import isImarketCodes from '../../../src/functions/isImarketCodes';
import {ImarketCodes} from '../../../src/interfaces';

describe('isImarketCodes', () => {
  it('should return true for valid ImarketCodes objects', () => {
    const validMarketCode: ImarketCodes = {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    };

    expect(isImarketCodes(validMarketCode)).toBe(true);
  });

  it('should return false for invalid objects', () => {
    const invalidMarketCode = {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      // Missing english_name property
    };

    expect(isImarketCodes(invalidMarketCode)).toBe(false);
  });

  it('should return false for non-object values', () => {
    const nonObjectValues: unknown[] = ['string', 42, true, null, undefined];

    nonObjectValues.forEach(value => {
      expect(isImarketCodes(value)).toBe(false);
    });
  });
});
