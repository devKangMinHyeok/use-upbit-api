import {IOrderbook, ITicker} from '../interfaces';

const getLastBuffers = <T extends IOrderbook | ITicker>(
  buffer: T[],
  maxNumResult: number,
) => {
  try {
    const result: T[] = [];

    for (let i = buffer.length - 1; i >= 0; i--) {
      let isExist = false;

      for (let j = 0; j < result.length; j++) {
        if (result[j].code === buffer[i].code) {
          isExist = true;
        } else continue;
      }

      if (!isExist) result.push(buffer[i]);
      else {
        if (maxNumResult <= result.length) break;
        else continue;
      }
    }

    return result;
  } catch (error) {
    console.error(error);
  }
};

export default getLastBuffers;
