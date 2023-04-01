import {ITicker, ImarketCodes} from './interfaces';
import {useRef, useState, useCallback, useEffect} from 'react';
import getLastBuffers from './functions/getLastBuffers';
import sortBuffers from './functions/sortBuffers';
import {throttle} from 'lodash';
import socketDataEncoder from './functions/socketDataEncoder';
import updateSocketData from './functions/updateSocketData';

export function useWsTicker(
  targetMarketCodes: ImarketCodes[] = [
    {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    },
  ],
  options = {throttle_time: 400},
) {
  const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';
  const {throttle_time} = options;
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
          console.log('[연결완료] | socket Open Type: ', 'ticker');
          if (socket.current?.readyState == 1) {
            const sendContent = [
              {ticket: 'test'},
              {
                type: 'ticker',
                codes: targetMarketCodes.map(code => code.market),
              },
            ];
            socket.current.send(JSON.stringify(sendContent));
            console.log('message sending done');
          }
        };

        const socketCloseHandler = () => {
          setIsConnected(false);
          setLoadingBuffer([]);
          setSocketData([]);
          buffer.current = [];
          console.log('연결종료');
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
