import {useCallback, useEffect, useRef, useState} from 'react';
import {cloneDeep, throttle} from 'lodash';

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

const socketDataEncoder = (socketData: any) => {
  try {
    const encoder = new TextDecoder('utf-8');
    const rawData = new Uint8Array(socketData);
    const data = JSON.parse(encoder.decode(rawData));

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const typeChecker = (type: string) => {
  try {
    let isValid = true;
    if (type != 'ticker' && type != 'orderbook' && type != 'trade') {
      isValid = false;
    }
    return isValid;
  } catch (error) {
    console.error(error);
  }
};

const getLastBuffers = (buffer: any, maxNumResult: number) => {
  try {
    let result = [];

    for (let i = buffer.length - 1; i >= 0; i--) {
      let isExist = false;

      for (let j = 0; j < result.length; j++) {
        if (result[j].code === buffer[i].code) {
          isExist = true;
        } else continue;
      }

      if (!isExist) result.push(buffer[i]);
      else {
        if (maxNumResult <= result.length) break;
        else continue;
      }
    }

    return result;
  } catch (error) {
    console.error(error);
  }
};

const sortBuffers = (originalBuffers: any, sortOrder: ImarketCodes[]) => {
  try {
    let result = [];
    for (let i = 0; i < sortOrder.length; i++) {
      const targetCode = sortOrder[i].market;
      for (let j = 0; j < originalBuffers.length; j++) {
        if (targetCode === originalBuffers[j].code) {
          result.push(originalBuffers[j]);
          break;
        } else continue;
      }
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

const updateSocketData = (origininalData: any, newData: any) => {
  try {
    const copyOriginal = cloneDeep(origininalData);
    const copyNew = cloneDeep(newData);

    if (copyOriginal && newData) {
      for (let i = 0; i < copyOriginal.length; i++) {
        const target = copyOriginal[i];
        for (let j = 0; j < newData.length; j++) {
          if (target.code === newData[j].code) {
            copyOriginal[i] = newData[j];
            copyNew[j] = null;
            break;
          } else continue;
        }
      }

      // 원본 데이터에 없는 market 데이터가 새롭게 받은 데이터에 존재하는 case
      const remainNew = copyNew.filter((element: any) => element !== null);
      if (remainNew.length > 0) {
        copyOriginal.push(...remainNew);
      }
    }
    return copyOriginal;
  } catch (error) {
    console.error(error);
  }
};

const updateQueueBuffer = (buffer: any, maxSize: number) => {
  try {
    const copyBuffer = cloneDeep(buffer);
    while (copyBuffer.length >= maxSize) {
      copyBuffer.shift();
    }
    return copyBuffer;
  } catch (error) {
    console.error(error);
  }
};

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
  const SOCKET_URL: string = 'wss://api.upbit.com/websocket/v1';
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

export function useFetchMarketCode() {
  const REST_API_URL = 'https://api.upbit.com/v1/market/all?isDetails=false';
  const options = {method: 'GET', headers: {Accept: 'application/json'}};

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [marketCodes, setMarketCodes] = useState<ImarketCodes[]>([]);

  const fetchMarketCodes = useCallback(async () => {
    try {
      const response = await fetch(REST_API_URL, options);
      if (!response.ok) {
        throw new Error('Failed to fetch market codes');
      }
      const result = (await response.json()) as ImarketCodes[];

      setMarketCodes(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching market codes:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMarketCodes();
  }, [fetchMarketCodes]);

  return {isLoading, marketCodes};
}
