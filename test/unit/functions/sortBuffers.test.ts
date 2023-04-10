import generateTicker from '../../generators/generateTicker';
import sortBuffers from '../../../src/functions/sortBuffers';
import {ImarketCodes} from '../../../src/interfaces';

describe('sortBuffers', () => {
  const ticker1 = generateTicker('AAPL');
  const ticker2 = generateTicker('TSLA');
  const ticker3 = generateTicker('GOOGL');
  const ticker4 = generateTicker('AMZN');
  const ticker5 = generateTicker('NFLX');
  const ticker6 = generateTicker('FB');
  const ticker7 = generateTicker('MSFT');
  const ticker8 = generateTicker('NVDA');
  const originalBuffers = [
    ticker1,
    ticker2,
    ticker3,
    ticker4,
    ticker5,
    ticker6,
    ticker7,
    ticker8,
  ];

  const sortOrder: ImarketCodes[] = [
    {market: 'AAPL', korean_name: '애플', english_name: 'Apple'},
    {market: 'TSLA', korean_name: '테슬라', english_name: 'Tesla'},
    {market: 'GOOGL', korean_name: '구글', english_name: 'Alphabet Inc.'},
    {market: 'AMZN', korean_name: '아마존', english_name: 'Amazon.com, Inc.'},
    {market: 'NFLX', korean_name: '넷플릭스', english_name: 'Netflix, Inc.'},
    {market: 'FB', korean_name: '페이스북', english_name: 'Facebook, Inc.'},
    {
      market: 'MSFT',
      korean_name: '마이크로소프트',
      english_name: 'Microsoft Corporation',
    },
    {
      market: 'NVDA',
      korean_name: '엔비디아',
      english_name: 'NVIDIA Corporation',
    },
  ];

  it('should sort the buffers in the order specified by sortOrder', () => {
    const sortedBuffers = sortBuffers(originalBuffers, sortOrder);
    expect(sortedBuffers).toEqual([
      ticker1,
      ticker2,
      ticker3,
      ticker4,
      ticker5,
      ticker6,
      ticker7,
      ticker8,
    ]);
  });

  it('should return undefined if originalBuffers is empty', () => {
    const sortedBuffers = sortBuffers([], sortOrder);
    expect(sortedBuffers).toBeUndefined();
  });

  it('should return undefined if sortOrder is empty', () => {
    const sortedBuffers = sortBuffers(originalBuffers, []);
    expect(sortedBuffers).toBeUndefined();
  });
});
