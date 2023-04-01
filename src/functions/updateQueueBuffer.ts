import {cloneDeep} from 'lodash';
import {ITrade} from '../interfaces';

const updateQueueBuffer = (buffer: ITrade[], maxSize: number) => {
  try {
    const copyBuffer = cloneDeep(buffer);
    while (copyBuffer.length >= maxSize) {
      copyBuffer.shift();
    }
    return copyBuffer;
  } catch (error) {
    console.error(error);
    return [] as ITrade[];
  }
};

export default updateQueueBuffer;
