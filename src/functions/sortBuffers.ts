import {ITicker, ImarketCodes} from '../interfaces';

const sortBuffers = (
  originalBuffers: ITicker[],
  sortOrder: ImarketCodes[],
): ITicker[] | undefined => {
  try {
    const result: ITicker[] = [];
    for (let i = 0; i < sortOrder.length; i++) {
      const targetCode = sortOrder[i].market;
      for (let j = 0; j < originalBuffers.length; j++) {
        if (targetCode === originalBuffers[j].code) {
          result.push(originalBuffers[j]);
          break;
        } else continue;
      }
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

export default sortBuffers;