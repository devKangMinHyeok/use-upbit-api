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
