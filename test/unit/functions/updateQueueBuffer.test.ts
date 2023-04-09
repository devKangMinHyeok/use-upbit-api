import generateTrade from '../../generators/generateTrade';
import {ITrade} from '../../../src/interfaces';
import updateQueueBuffer from '../../../src/functions/updateQueueBuffer';

describe('updateQueueBuffer', () => {
  const trades: ITrade[] = [
    generateTrade('AAPL'),
    generateTrade('AAPL'),
    generateTrade('AAPL'),
    generateTrade('AAPL'),
  ];

  it('should remove items from the beginning of the buffer if it exceeds the maximum size', () => {
    const maxSize = 3;
    const buffer: ITrade[] = trades;
    const expected: ITrade[] = trades.slice(1, 4);
    expect(updateQueueBuffer(buffer, maxSize)).toEqual(expected);
  });

  it('should return an empty array if the buffer is empty', () => {
    const maxSize = 3;
    const buffer: ITrade[] = [];
    const expected: ITrade[] = [];
    expect(updateQueueBuffer(buffer, maxSize)).toEqual(expected);
  });

  it('should return a copy of the buffer if it does not exceed the maximum size', () => {
    const maxSize = 3;
    const buffer: ITrade[] = trades.slice(1, 3);
    const expected: ITrade[] = trades.slice(1, 3);
    expect(updateQueueBuffer(buffer, maxSize)).toEqual(expected);
  });
});
