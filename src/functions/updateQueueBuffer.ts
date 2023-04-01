import {cloneDeep} from 'lodash';

const updateQueueBuffer = (buffer: any, maxSize: number) => {
  try {
    const copyBuffer = cloneDeep(buffer);
    while (copyBuffer.length >= maxSize) {
      copyBuffer.shift();
    }
    return copyBuffer;
  } catch (error) {
    console.error(error);
  }
};

export default updateQueueBuffer;
