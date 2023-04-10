import {ITicker, ImarketCodes} from '../interfaces';

const sortBuffers = (
  buffers: ITicker[],
  sortOrder: ImarketCodes[],
): ITicker[] | undefined => {
  if (buffers.length === 0 || sortOrder.length === 0) {
    return undefined;
  }

  const tickerMap: {[code: string]: ITicker} = {};
  buffers.forEach(ticker => (tickerMap[ticker.code] = ticker));

  const result: ITicker[] = [];
  sortOrder.forEach(({market}) => {
    const ticker = tickerMap[market];
    if (ticker) result.push(ticker);
  });

  return result;
};

export default sortBuffers;
