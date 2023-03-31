import {renderHook, act} from '@testing-library/react-hooks';
import {useFetchMarketCode, ImarketCodes} from '../../../src/index'; // Update the path to your hook file

describe('useFetchMarketCode', () => {
  beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              market: 'KRW-BTC',
              korean_name: '비트코인',
              english_name: 'Bitcoin',
            },
          ] as ImarketCodes[]),
        ok: true,
      } as Response),
    );
  });

  afterAll(() => {
    (global.fetch as jest.Mock).mockRestore();
  });

  it('fetches and returns market codes', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useFetchMarketCode());

    // Assert that the hook starts in a loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for the hook to finish fetching data
    await waitForNextUpdate();

    // Assert that the hook is no longer in a loading state
    expect(result.current.isLoading).toBe(false);

    // Assert that the fetched data is correct
    expect(result.current.marketCodes).toEqual([
      {
        market: 'KRW-BTC',
        korean_name: '비트코인',
        english_name: 'Bitcoin',
      },
    ]);
  });
});
