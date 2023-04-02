import {ChangeType, ITrade, OrderType, StreamType} from '../../src/interfaces';

const generateTrade = (code: string): ITrade => {
  const now = Date.now();
  const randomVolume = Math.floor(Math.random() * 1000);
  const randomPrice = Math.floor(Math.random() * 10000);
  const randomType = Math.random() < 0.5 ? 'ASK' : 'BID';
  const randomChange = Math.floor(Math.random() * 3);
  const randomSequentialId = Math.floor(Math.random() * 10000);
  return {
    type: 'trade',
    code: code,
    timestamp: now,
    trade_date: new Date(now).toISOString().substring(0, 10),
    trade_time: new Date(now).toISOString().substring(11, 19),
    trade_timestamp: now,
    trade_price: randomPrice,
    trade_volume: randomVolume,
    ask_bid: randomType as OrderType,
    prev_closing_price: randomPrice - randomChange,
    change: ['RISE', 'EVEN', 'FALL'][randomChange] as ChangeType,
    change_price: randomChange,
    sequential_id: randomSequentialId,
    stream_type: 'REALTIME' as StreamType,
  };
};

export default generateTrade;
