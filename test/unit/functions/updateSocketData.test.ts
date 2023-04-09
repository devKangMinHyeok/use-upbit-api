import generateTicker from '../../generators/generateTicker';
import {ITicker} from '../../../src/interfaces';
import updateSocketData from '../../../src/functions/updateSocketData';

describe('updateSocketData', () => {
  it('should update existing ticker data in the original array, and add new tickers to the end of the array', () => {
    const originalData: ITicker[] = [
      generateTicker('KRW-BTC'),
      generateTicker('KRW-ETH'),
      generateTicker('KRW-ADA'),
    ];

    const newData: ITicker[] = [
      {...originalData[0], trade_price: 50000000},
      generateTicker('KRW-DOGE'),
    ];

    const expectedData: ITicker[] = [
      {...originalData[0], trade_price: 50000000},
      {...originalData[1]},
      {...originalData[2]},
      newData[1],
    ];

    const result = updateSocketData(originalData, newData);
    expect(result).toEqual(expectedData);
  });

  it('should return the original data if either the original or new data is falsy', () => {
    const originalData: ITicker[] = [
      generateTicker('KRW-BTC'),
      generateTicker('KRW-ETH'),
      generateTicker('KRW-ADA'),
    ];

    const newData: ITicker[] = [];

    expect(updateSocketData(originalData, [])).toEqual(originalData);
    expect(updateSocketData([], newData)).toEqual(newData);
  });
});
