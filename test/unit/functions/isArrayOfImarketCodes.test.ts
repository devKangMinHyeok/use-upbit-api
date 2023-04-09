import isArrayOfImarketCodes from '../../../src/functions/isArrayOfImarketCodes';
import {ImarketCodes} from '../../../src/interfaces';

describe('isArrayOfImarketCodes', () => {
  it('should return true for an array of valid ImarketCodes objects', () => {
    const validMarketCodesArray: ImarketCodes[] = [
      {market: 'KRW-BTC', korean_name: '비트코인', english_name: 'Bitcoin'},
      {market: 'KRW-ETH', korean_name: '이더리움', english_name: 'Ethereum'},
    ];

    expect(isArrayOfImarketCodes(validMarketCodesArray)).toBe(true);
  });

  it('should return false for an array containing invalid ImarketCodes objects', () => {
    const invalidMarketCodesArray = [
      {market: 'KRW-BTC', korean_name: '비트코인', english_name: 'Bitcoin'},
      {market: 'KRW-ETH', korean_name: '이더리움'}, // missing english_name
    ];

    expect(isArrayOfImarketCodes(invalidMarketCodesArray)).toBe(false);
  });

  it('should return false for a non-array value', () => {
    const notAnArray = {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    };

    expect(isArrayOfImarketCodes(notAnArray)).toBe(false);
  });

  it('should return false for an empty array', () => {
    const emptyArray: unknown[] = [];

    expect(isArrayOfImarketCodes(emptyArray)).toBe(false);
  });
});
