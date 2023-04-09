import {ITicker, ImarketCodes, TKOptionsInterface} from '../interfaces';
import {useRef, useState, useCallback, useEffect} from 'react';
import getLastBuffers from '../functions/getLastBuffers';
import sortBuffers from '../functions/sortBuffers';
import {throttle} from 'lodash';
import socketDataEncoder from '../functions/socketDataEncoder';
import updateSocketData from '../functions/updateSocketData';

/**
 * useWsTicker is a custom hook that connects to a WebSocket API
 * and retrieves real-time ticker data for a given market code.
 * @param targetMarketCodes - Array of market codes to retrieve ticker data for.
 * @param options - `throttle_time` the data update frequency(ms).
 * @throws targetMarketCodes should be React State Value, if not, unexpected errors can occur.
 * @returns Object with the WebSocket object, connection status, and real-time ticker data.
 */
function useWsTicker(
  targetMarketCodes: ImarketCodes[],
  options: TKOptionsInterface = {},
) {
  const {throttle_time = 400, debug = false} = options;
  const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';
  const socket = useRef<WebSocket | null>(null);
  const buffer = useRef<ITicker[]>([]);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loadingBuffer, setLoadingBuffer] = useState<ITicker[]>([]);
  const [socketData, setSocketData] = useState<ITicker[]>();

  const throttled = useCallback(
    throttle(() => {
      try {
        const lastBuffers = getLastBuffers(
          buffer.current,
          targetMarketCodes.length,
        );
        const sortedBuffers =
          lastBuffers && sortBuffers(lastBuffers, targetMarketCodes);
        sortedBuffers && setLoadingBuffer(sortedBuffers);
        buffer.current = [];
      } catch (error) {
        console.error(error);
        return;
      }
    }, throttle_time),
    [targetMarketCodes],
  );
  // socket 세팅
  useEffect(() => {
    try {
      if (targetMarketCodes.length > 0 && !socket.current) {
        socket.current = new WebSocket(SOCKET_URL);
        socket.current.binaryType = 'arraybuffer';

        const socketOpenHandler = () => {
          setIsConnected(true);
          if (debug)
            console.log('[completed connect] | socket Open Type: ', 'ticker');
          if (socket.current?.readyState == 1) {
            const sendContent = [
              {ticket: 'test'},
              {
                type: 'ticker',
                codes: targetMarketCodes.map(code => code.market),
              },
            ];
            socket.current.send(JSON.stringify(sendContent));
            if (debug) console.log('message sending done');
          }
        };

        const socketCloseHandler = () => {
          setIsConnected(false);
          setLoadingBuffer([]);
          setSocketData([]);
          buffer.current = [];
          if (debug) console.log('connection closed');
        };

        const socketErrorHandler = (event: Event) => {
          const error = (event as ErrorEvent).error as Error;
          console.error('[Error]', error);
        };

        const socketMessageHandler = (evt: MessageEvent<ArrayBuffer>) => {
          const data = socketDataEncoder<ITicker>(evt.data);
          if (data) {
            buffer.current.push(data);
            throttled();
          }
        };

        socket.current.onopen = socketOpenHandler;
        socket.current.onclose = socketCloseHandler;
        socket.current.onerror = socketErrorHandler;
        socket.current.onmessage = socketMessageHandler;
      }
      return () => {
        if (socket.current) {
          if (socket.current.readyState != 0) {
            socket.current.close();
            socket.current = null;
          }
        }
      };
    } catch (error) {
      throw new Error();
    }
  }, [targetMarketCodes]);

  useEffect(() => {
    try {
      if (loadingBuffer.length > 0) {
        if (!socketData) {
          setSocketData(loadingBuffer);
        } else {
          setSocketData(prev => {
            return prev && updateSocketData(prev, loadingBuffer);
          });
          setLoadingBuffer([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [loadingBuffer]);

  return {socket: socket.current, isConnected, socketData};
}

export default useWsTicker;
