import {ImarketCodes} from '../interfaces';
import isImarketCodes from './isImarketCodes';

const isArrayOfImarketCodes = (obj: unknown): obj is ImarketCodes[] => {
  if (!Array.isArray(obj) || obj.length === 0) return false;

  return obj.every(item => isImarketCodes(item));
};

export default isArrayOfImarketCodes;
