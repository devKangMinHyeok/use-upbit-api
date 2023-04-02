import {IOrderbook, ITicker} from '@root/src/interfaces';
import getLastBuffers from '../../../src/functions/getLastBuffers';

const createTicker = (code: string): ITicker => ({
  type: 'ticker',
  code: code,
  opening_price: 100,
  high_price: 200,
  low_price: 50,
  trade_price: 150,
  prev_closing_price: 90,
  acc_trade_price: 1000,
  change: 'RISE',
  change_price: 10,
  signed_change_price: 10,
  change_rate: 0.1,
  signed_change_rate: 0.1,
  ask_bid: 'ASK',
  trade_volume: 100,
  acc_trade_volume: 1000,
  trade_date: '20230101',
  trade_time: '235959',
  trade_timestamp: 1643664000000,
  acc_ask_volume: 500,
  acc_bid_volume: 500,
  highest_52_week_price: 250,
  highest_52_week_date: '20220101',
  lowest_52_week_price: 50,
  lowest_52_week_date: '20220101',
  market_state: 'ACTIVE',
  is_trading_suspended: false,
  market_warning: 'NONE',
  timestamp: 1643664000000,
  acc_trade_price_24h: 2000,
  acc_trade_volume_24h: 2000,
  stream_type: 'SNAPSHOT',
});

describe('getLastBuffers', () => {
  it('should return the correct number of unique items', () => {
    const buffer: (ITicker | IOrderbook)[] = [
      createTicker('A'),
      createTicker('B'),
      createTicker('C'),
      createTicker('A'),
      createTicker('D'),
    ];

    const maxNumResult = 3;
    const result = getLastBuffers(buffer, maxNumResult);

    expect(result.length).toBe(maxNumResult);
    expect(result.map(item => item.code)).toEqual(['D', 'A', 'C']);
  });

  it('should return an empty array if the input buffer is empty', () => {
    const buffer: (ITicker | IOrderbook)[] = [];
    const maxNumResult = 3;
    const result = getLastBuffers(buffer, maxNumResult);

    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });

  it('should return all unique items if maxNumResult is greater than the number of unique items', () => {
    const buffer: (ITicker | IOrderbook)[] = [
      createTicker('A'),
      createTicker('B'),
      createTicker('C'),
      createTicker('A'),
    ];

    const maxNumResult = 5;
    const result = getLastBuffers(buffer, maxNumResult);

    expect(result.length).toBe(3);
    expect(result.map(item => item.code)).toEqual(['A', 'C', 'B']);
  });
});
