import useFetchMarketCode from '../../../src/hooks/useFetchMarketCode';
import * as React from 'react';

import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const TestFetchMarketCodeComponent = () => {
  const {isLoading, marketCodes} = useFetchMarketCode({debug: true});

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        marketCodes.length > 0 && (
          <ul data-testid="market-codes">
            {marketCodes.map((code, index) => (
              <li key={index}>
                {code.market} - {code.korean_name} - {code.english_name}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

describe('useFetchMarketCode hook', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches and displays market codes', async () => {
    // Mock fetch response
    const mockMarketCodes = [
      {
        market: 'KRW-BTC',
        korean_name: '비트코인',
        english_name: 'Bitcoin',
      },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockMarketCodes)),
    } as Response);

    // Render the TestFetchMarketCodeComponent
    render(<TestFetchMarketCodeComponent />);

    // Check if the loading status is displayed
    const loadingStatus = screen.getByText(/Loading.../i);
    expect(loadingStatus).toBeInTheDocument();

    // Wait for the loading status to be removed
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading.../i));

    // Check if the market codes are displayed
    const marketCodesList = screen.getByTestId('market-codes');
    expect(marketCodesList).toBeInTheDocument();
    expect(marketCodesList.children.length).toBeGreaterThan(0);
  });

  it('handles errors when fetching market codes', async () => {
    // Mock fetch response with error
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    // Render the TestFetchMarketCodeComponent
    render(<TestFetchMarketCodeComponent />);

    // Check if the loading status is displayed
    const loadingStatus = screen.getByText(/Loading.../i);
    expect(loadingStatus).toBeInTheDocument();

    // Wait for the loading status to be removed
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading.../i));

    // Check if the market codes list is empty
    const marketCodesList = screen.queryByTestId('market-codes');
    expect(marketCodesList).not.toBeInTheDocument();
  });
});
