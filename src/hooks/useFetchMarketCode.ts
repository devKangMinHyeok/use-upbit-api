import {ImarketCodes} from '../interfaces';
import {useState, useEffect} from 'react';

/**
 * useFetchMarketCode hook is used to fetch market codes from upbit api
 * @returns Object with the market codes and a loading state.
 */
function useFetchMarketCode(): {
  isLoading: boolean;
  marketCodes: ImarketCodes[];
} {
  const REST_API_URL = 'https://api.upbit.com/v1/market/all?isDetails=false';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [marketCodes, setMarketCodes] = useState<ImarketCodes[]>([]);

  const fetchMarketCodes = async () => {
    const response = await fetch(REST_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch market codes');
    }
    const result = JSON.parse(await response.text()) as ImarketCodes[];
    try {
      console.log(result);
      setMarketCodes(result);
    } catch (error) {
      console.error('Error fetching market codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketCodes().catch(error => {
      console.error('Error fetching market codes:', error);
    });
  }, []);

  return {isLoading, marketCodes};
}

export default useFetchMarketCode;
