import {ITrade, ImarketCodes, TROptionsInterface} from '../interfaces';
import {useRef, useState, useCallback, useEffect} from 'react';
import {throttle} from 'lodash';

import updateQueueBuffer from '../functions/updateQueueBuffer';
import socketDataEncoder from '../functions/socketDataEncoder';

/**
 * useWsTrade is a custom hook that connects to a WebSocket API
 * and retrieves real-time trade data for a given market code.
 * @param targetMarketCodes - Array of market codes to retrieve trade data for.
 * @param options - `throttle_time` the data update frequency(ms).
 * @param options - `max_length_queue` Maximum number of items in data buffer.
 * @throws targetMarketCodes should be React State Value, if not, unexpected errors can occur.
 * @returns Object with the WebSocket object, connection status, and real-time trade data.
 */
function useWsTrade(
  targetMarketCodes: ImarketCodes,
  options: TROptionsInterface = {},
) {
  const {throttle_time = 400, max_length_queue = 100, debug = false} = options;
  const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';
  const socket = useRef<WebSocket | null>(null);
  const buffer = useRef<ITrade[]>([]);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socketData, setSocketData] = useState<ITrade[]>();

  const throttled = useCallback(
    throttle(() => {
      try {
        const updatedBuffer = updateQueueBuffer(
          buffer.current,
          max_length_queue,
        );
        buffer.current = updatedBuffer;
        setSocketData(updatedBuffer);
      } catch (error) {
        throw new Error();
      }
    }, throttle_time),
    [targetMarketCodes],
  );
  // socket 세팅
  useEffect(() => {
    try {
      if ([targetMarketCodes].length > 0 && !socket.current) {
        socket.current = new WebSocket(SOCKET_URL);
        socket.current.binaryType = 'arraybuffer';

        const socketOpenHandler = () => {
          setIsConnected(true);
          if (debug)
            console.log('[completed connect] | socket Open Type: ', 'trade');
          if (socket.current?.readyState == 1) {
            const sendContent = [
              {ticket: 'test'},
              {
                type: 'trade',
                codes: [targetMarketCodes.market],
              },
            ];
            socket.current.send(JSON.stringify(sendContent));
            if (debug) console.log('message sending done');
          }
        };

        const socketCloseHandler = () => {
          setIsConnected(false);
          setSocketData([]);
          buffer.current = [];
          if (debug) console.log('connection closed');
        };

        const socketErrorHandler = (event: Event) => {
          const error = (event as ErrorEvent).error as Error;
          console.error('[Error]', error);
        };

        const socketMessageHandler = (evt: MessageEvent<ArrayBuffer>) => {
          const data = socketDataEncoder<ITrade>(evt.data);
          data && buffer.current.push(data);
          throttled();
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

  return {socket: socket.current, isConnected, socketData};
}

export default useWsTrade;
