import {ImarketCodes} from '../interfaces';

const isImarketCodes = (obj: unknown): obj is ImarketCodes => {
  if (typeof obj !== 'object' || obj === null) return false;

  const objAsRecord = obj as Record<string, unknown>;
  return (
    typeof objAsRecord.market === 'string' &&
    typeof objAsRecord.korean_name === 'string' &&
    typeof objAsRecord.english_name === 'string'
  );
};

export default isImarketCodes;
