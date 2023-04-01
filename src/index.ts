import {useCallback, useEffect, useRef, useState} from 'react';
import {cloneDeep, throttle} from 'lodash';
import getLastBuffers from './functions/getLastBuffers';
import sortBuffers from './functions/sortBuffers';
import updateQueueBuffer from './functions/updateQueueBuffer';
import {typeChecker} from './functions/typeChecker';
import socketDataEncoder from './functions/socketDataEncoder';
import updateSocketData from './functions/updateSocketData';

export interface ImarketCodes {
  market: string;
  korean_name: string;
  english_name: string;
}

export type RequestType = 'ticker' | 'orderbook' | 'trade';
export type ChangeType = 'RISE' | 'EVEN' | 'FALL';
export type OrderType = 'ASK' | 'BID';
export type MarketStateType = 'PREVIEW' | 'ACTIVE' | 'DELISTED';
export type MarketWarningType = 'NONE' | 'CAUTION';
export type StreamType = 'SNAPSHOT' | 'REALTIME';

export interface ITicker {
  type: RequestType;
  code: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  acc_trade_price: number;
  change: ChangeType;
  change_price: number;
  signed_change_price: number;
  change_rate: number;
  signed_change_rate: number;
  ask_bid: OrderType;
  trade_volume: number;
  acc_trade_volume: number;
  trade_date: string;
  trade_time: string;
  trade_timestamp: number;
  acc_ask_volume: number;
  acc_bid_volume: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  market_state: MarketStateType;
  is_trading_suspended: false;
  delisting_date?: Date;
  market_warning: MarketWarningType;
  timestamp: number;
  acc_trade_price_24h: number;
  acc_trade_volume_24h: number;
  stream_type: StreamType;
}

export interface IOrderbookUnit {
  ask_price: number;
  bid_price: number;
  ask_size: number;
  bid_size: number;
}

export interface IOrderbook {
  type: RequestType;
  code: string;
  timestamp: number;
  total_ask_size: number;
  total_bid_size: number;
  orderbook_units: IOrderbookUnit[];
  stream_type: StreamType;
}

export interface ITrade {
  type: RequestType;
  code: string;
  timestamp: number;
  trade_date: string;
  trade_time: string;
  trade_timestamp: number;
  trade_price: number;
  trade_volume: number;
  ask_bid: OrderType;
  prev_closing_price: number;
  change: ChangeType;
  change_price: number;
  sequential_id: number;
  stream_type: StreamType;
}

export interface TickerInterface {
  socket: WebSocket | null;
  isConnected: boolean;
  socketData: ITicker[];
}

export interface OrderbookInterface {
  socket: WebSocket | null;
  isConnected: boolean;
  socketData: IOrderbook;
}

export interface TradeInterface {
  socket: WebSocket | null;
  isConnected: boolean;
  socketData: ITrade[];
}

export function useUpbitWebSocket(
  targetMarketCodes: ImarketCodes[] = [
    {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    },
  ],
  type: RequestType = 'ticker',
  options = {throttle_time: 400, max_length_queue: 100},
) {
  const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';
  const {throttle_time, max_length_queue} = options;
  const socket = useRef<WebSocket | null>(null);
  const buffer = useRef<any[]>([] as any[]);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loadingBuffer, setLoadingBuffer] = useState<any>([]);
  const [socketData, setSocketData] = useState<any>();

  const throttled = useCallback(
    throttle(() => {
      try {
        const lastBuffers = getLastBuffers(
          buffer.current,
          targetMarketCodes.length,
        );

        switch (type) {
          case 'ticker':
            const sortedBuffers = sortBuffers(lastBuffers, targetMarketCodes);
            setLoadingBuffer(sortedBuffers);
            buffer.current = [];
            break;

          case 'orderbook':
            if (lastBuffers) setSocketData(lastBuffers[0]);
            buffer.current = [];
            break;

          case 'trade':
            const updatedBuffer = updateQueueBuffer(
              buffer.current,
              max_length_queue,
            );
            buffer.current = updatedBuffer;
            setSocketData(updatedBuffer);
            break;

          default:
            break;
        }
      } catch (error) {
        throw new Error();
      }
    }, throttle_time),
    [targetMarketCodes],
  );
  // socket 세팅
  useEffect(() => {
    try {
      const isTypeValid = typeChecker(type);
      if (!isTypeValid) {
        console.error(
          "[Error] | input type is unknown. (input type should be 'ticker' or 'orderbook' or 'trade')",
        );
        throw new Error();
      }

      if (type === 'orderbook' || type === 'trade') {
        if (targetMarketCodes.length > 1) {
          console.error(
            "[Error] | 'Length' of Target Market Codes should be only 'one' in 'orderbook' and 'trade'. you can request only 1 marketcode's data, when you want to get 'orderbook' or 'trade' data.",
          );
          throw new Error();
        }
      }

      if (targetMarketCodes.length > 0 && !socket.current) {
        socket.current = new WebSocket(SOCKET_URL);
        socket.current.binaryType = 'arraybuffer';

        const socketOpenHandler = () => {
          setIsConnected(true);
          console.log('[연결완료] | socket Open Type: ', type);
          if (socket.current?.readyState == 1) {
            const sendContent = [
              {ticket: 'test'},
              {
                type: type,
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
          setSocketData(null);
          buffer.current = [];
          console.log('연결종료');
        };

        const socketErrorHandler = (error: any) => {
          console.error('[Error]', error);
        };

        const socketMessageHandler = (evt: MessageEvent) => {
          const data = socketDataEncoder(evt.data);
          buffer.current.push(data);
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

  useEffect(() => {
    try {
      if (loadingBuffer.length > 0) {
        if (!socketData) {
          setSocketData(loadingBuffer);
        } else {
          setSocketData((prev: any) => {
            return updateSocketData(prev, loadingBuffer);
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

export function useFetchMarketCode(): {
  isLoading: boolean;
  marketCodes: ImarketCodes[];
} {
  const REST_API_URL = 'https://api.upbit.com/v1/market/all?isDetails=false';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [marketCodes, setMarketCodes] = useState<ImarketCodes[]>([]);

  const fetchMarketCodes = async () => {
    const response = await fetch(REST_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch market codes');
    }
    const result = JSON.parse(await response.text()) as ImarketCodes[];
    try {
      console.log(result);
      setMarketCodes(result);
    } catch (error) {
      console.error('Error fetching market codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketCodes().catch(error => {
      console.error('Error fetching market codes:', error);
    });
  }, []);

  return {isLoading, marketCodes};
}
