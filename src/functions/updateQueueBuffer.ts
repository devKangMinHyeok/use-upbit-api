import {cloneDeep} from 'lodash';
import {ITrade} from '../interfaces';

const updateQueueBuffer = (buffer: ITrade[], maxSize: number): ITrade[] => {
  const copyBuffer = cloneDeep(buffer);
  if (copyBuffer.length >= maxSize) {
    copyBuffer.splice(0, copyBuffer.length - maxSize);
  }
  return copyBuffer;
};

export default updateQueueBuffer;
