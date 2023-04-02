import {ITicker} from '@root/src/interfaces';

function generateTicker(market: string): ITicker {
  const ticker: ITicker = {
    type: 'ticker',
    code: market,
    trade_date: '20230101',
    trade_time: '235959',
    trade_timestamp: 1643664000000,
    trade_price: Math.random() * 200,
    trade_volume: Math.random() * 100,
    acc_trade_price: Math.random() * 1000,
    acc_trade_volume: Math.random() * 1000,
    opening_price: Math.random() * 100,
    high_price: Math.random() * 200,
    low_price: Math.random() * 50,
    prev_closing_price: Math.random() * 90,
    change: 'RISE',
    change_price: Math.random() * 10,
    change_rate: Math.random() * 0.1,
    signed_change_price: Math.random() * 10,
    signed_change_rate: Math.random() * 0.1,
    ask_bid: 'ASK',
    acc_ask_volume: Math.random() * 500,
    acc_bid_volume: Math.random() * 500,
    highest_52_week_price: Math.random() * 250,
    highest_52_week_date: '20220101',
    lowest_52_week_price: Math.random() * 50,
    lowest_52_week_date: '20220101',
    timestamp: 1643664000000,
    acc_trade_price_24h: Math.random() * 2000,
    acc_trade_volume_24h: Math.random() * 2000,
    stream_type: 'SNAPSHOT',
    is_trading_suspended: false,
    market_state: 'ACTIVE',
    market_warning: 'NONE',
  };
  return ticker;
}

export default generateTicker;
