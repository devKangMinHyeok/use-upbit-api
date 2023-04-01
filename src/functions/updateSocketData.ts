import {cloneDeep} from 'lodash';
const updateSocketData = <T>(origininalData: T[], newData: T[]) => {
  try {
    const copyOriginal = cloneDeep(origininalData);
    const copyNew = cloneDeep(newData);

    if (copyOriginal && newData) {
      for (let i = 0; i < copyOriginal.length; i++) {
        const target = copyOriginal[i];
        for (let j = 0; j < newData.length; j++) {
          if (target.code === newData[j].code) {
            copyOriginal[i] = newData[j];
            copyNew[j] = null as T;
            break;
          } else continue;
        }
      }

      // 원본 데이터에 없는 market 데이터가 새롭게 받은 데이터에 존재하는 case
      const remainNew = copyNew.filter((element: any) => element !== null);
      if (remainNew.length > 0) {
        copyOriginal.push(...remainNew);
      }
    }
    return copyOriginal;
  } catch (error) {
    console.error(error);
  }
};

export default updateSocketData;
