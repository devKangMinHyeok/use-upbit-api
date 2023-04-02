import {IOrderbook, ITicker} from '@root/src/interfaces';
import getLastBuffers from '../../../src/functions/getLastBuffers';
import generateTicker from '@root/test/generators/generateTicker';

describe('getLastBuffers', () => {
  it('should return the correct number of unique items', () => {
    const buffer: (ITicker | IOrderbook)[] = [
      generateTicker('A'),
      generateTicker('B'),
      generateTicker('C'),
      generateTicker('A'),
      generateTicker('D'),
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
      generateTicker('A'),
      generateTicker('B'),
      generateTicker('C'),
      generateTicker('A'),
    ];

    const maxNumResult = 5;
    const result = getLastBuffers(buffer, maxNumResult);

    expect(result.length).toBe(3);
    expect(result.map(item => item.code)).toEqual(['A', 'C', 'B']);
  });
});
