import {ITrade, ImarketCodes} from '../interfaces';
import {useRef, useState, useCallback, useEffect} from 'react';
import {throttle} from 'lodash';

import updateQueueBuffer from '../functions/updateQueueBuffer';
import socketDataEncoder from '../functions/socketDataEncoder';

function useWsTrade(
  targetMarketCodes: ImarketCodes[],
  options = {throttle_time: 400, max_length_queue: 100},
) {
  const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';
  const {throttle_time, max_length_queue} = options;
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
      if (targetMarketCodes.length > 1) {
        console.error(
          "[Error] | 'Length' of Target Market Codes should be only 'one' in 'orderbook' and 'trade'. you can request only 1 marketcode's data, when you want to get 'orderbook' or 'trade' data.",
        );
        throw new Error();
      }

      if (targetMarketCodes.length > 0 && !socket.current) {
        socket.current = new WebSocket(SOCKET_URL);
        socket.current.binaryType = 'arraybuffer';

        const socketOpenHandler = () => {
          setIsConnected(true);
          console.log('[연결완료] | socket Open Type: ', 'trade');
          if (socket.current?.readyState == 1) {
            const sendContent = [
              {ticket: 'test'},
              {
                type: 'trade',
                codes: targetMarketCodes.map(code => code.market),
              },
            ];
            socket.current.send(JSON.stringify(sendContent));
            console.log('message sending done');
          }
        };

        const socketCloseHandler = () => {
          setIsConnected(false);
          setSocketData([]);
          buffer.current = [];
          console.log('연결종료');
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
