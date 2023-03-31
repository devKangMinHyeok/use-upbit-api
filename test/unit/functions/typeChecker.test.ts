import {typeChecker} from '../../../src/index';

describe('typeChecker', () => {
  it("should return true when passed 'ticker', 'orderbook', or 'trade'", () => {
    expect(typeChecker('ticker')).toBe(true);
    expect(typeChecker('orderbook')).toBe(true);
    expect(typeChecker('trade')).toBe(true);
  });

  it("should return false when passed any value other than 'ticker', 'orderbook', or 'trade'", () => {
    expect(typeChecker('foo')).toBe(false);
    expect(typeChecker('bar')).toBe(false);
    expect(typeChecker('baz')).toBe(false);
  });
});
