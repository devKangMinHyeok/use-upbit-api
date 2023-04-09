import {cloneDeep} from 'lodash';
import {ITicker} from '../interfaces';

const updateSocketData = (
  originalData: ITicker[],
  newData: ITicker[],
): ITicker[] => {
  try {
    const copyOriginal = cloneDeep(originalData);
    const copyNew = cloneDeep(newData);

    if (!copyOriginal.length || !copyNew.length) {
      return copyOriginal || copyNew;
    }

    const copyOriginalIndexed = copyOriginal.reduce(
      (acc, curr) => ({...acc, [curr.code]: curr}), // curr을 통해 copyOriginal 원소의 reference를 넘김
      {} as {[key: string]: ITicker},
    );

    copyNew.forEach(ele => {
      const target = copyOriginalIndexed[ele.code];
      if (target) {
        Object.assign(target, ele); // copyOriginal 원소의 reference인 target을 Object.assign하여 덮어씌움으로 copyOriginal까지 변경
      } else {
        copyOriginal.push(ele);
      }
    });

    return copyOriginal;
  } catch (error) {
    console.error(error);
    return originalData;
  }
};

export default updateSocketData;
