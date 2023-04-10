import useWsTicker from '../../../src/hooks/useWsTicker';
import * as React from 'react';
import {useState, useEffect} from 'react';

import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ErrorBoundary from './ErrorBoundary';
import {ImarketCodes} from '../../../src/interfaces';

const debugTest = false;

const TestTickerComponent = ({
  customMarketCode,
  onError,
}: {
  customMarketCode?: unknown;
  onError?: (error: Error) => void;
}) => {
  const [marketCode, setMarketCode] = useState<unknown>([
    {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    },
  ]);

  useEffect(() => {
    if (customMarketCode) {
      setMarketCode(() => customMarketCode);
    }
  }, [customMarketCode]);

  const {isConnected, socketData} = useWsTicker(
    marketCode as ImarketCodes[],
    onError,
    {
      debug: debugTest,
    },
  );

  return (
    <div>
      {isConnected ? <p>Connected</p> : <p>Not Connected</p>}
      {socketData && socketData.length > 0 && (
        <ul data-testid="socket-data">
          {socketData.map((data, index) => (
            <li key={index}>
              {data.code} - {data.trade_price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

describe('useWsTicker hook', () => {
  // Test invalid targetMarketCodes
  // it('useWsTicker should throw error with invalid targetMarketCodes', () => {
  //   const onError: jest.MockedFunction<(error: Error) => void> = jest.fn();
  //   const invalidTargetMarketCodes = [
  //     {
  //       market: 'KRW-BTC',
  //       korean_name: '비트코인',
  //       english_name: 'Bitcoin',
  //     },
  //     {
  //       market: 'KRW-ETH',
  //       korean_name: '이더리움',
  //     },
  //   ];
  //   // Render the TestOrderbookComponent
  //   render(
  //     <ErrorBoundary onError={onError}>
  //       <TestTickerComponent
  //         customMarketCode={invalidTargetMarketCodes}
  //         onError={onError}
  //       />
  //     </ErrorBoundary>,
  //   );

  //   expect(onError).toHaveBeenCalled();
  //   expect(onError.mock.calls[0][0].message).toBe(
  //     'targetMarketCodes does not have the correct interface',
  //   );
  // });

  it('renders connection status and received socket data', async () => {
    // Render the TestTickerComponent
    render(<TestTickerComponent />);

    // Check if the connection status is displayed
    const connectionStatus = screen.getByText(/Connected|Not Connected/i);
    expect(connectionStatus).toBeInTheDocument();

    // Wait for the socket data to be displayed
    const socketDataList = await screen.findByTestId(
      'socket-data',
      {},
      {timeout: 5000},
    );

    // Check if the socket data is displayed
    expect(socketDataList).toBeInTheDocument();
    expect(socketDataList.children.length).toBeGreaterThan(0);
  });
});
