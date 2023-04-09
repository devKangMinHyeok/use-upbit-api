// Test code
import useWsTrade from '../../../src/hooks/useWsTrade';
import * as React from 'react';
import {useState} from 'react';

import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const TestTradeComponent = () => {
  const [marketCode, _] = useState({
    market: 'KRW-BTC',
    korean_name: '비트코인',
    english_name: 'Bitcoin',
  });
  const {isConnected, socketData} = useWsTrade(marketCode);

  return (
    <div>
      {isConnected ? <p>Connected</p> : <p>Not Connected</p>}
      {socketData && (
        <ul data-testid="socket-data">
          {socketData.map((trade, index) => (
            <li key={index} data-testid={`trade-data-${index}`}>
              Price: {trade.trade_price} | Volume: {trade.trade_volume}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

describe('useWsTrade hook', () => {
  it('renders connection status and received socket data', async () => {
    // Render the TestTradeComponent
    render(<TestTradeComponent />);

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

  it('received socket data correctly', async () => {
    // Render the TestTradeComponent
    render(<TestTradeComponent />);

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

    // Test the socketData content
    await waitFor(async () => {
      const tradeDataItems = await screen.findAllByTestId(/trade-data-\d+/);

      // Check if there are trade data items
      expect(tradeDataItems.length).toBeGreaterThan(0);

      // Test one of the trade data items
      const firstTradeData = tradeDataItems[0];

      if (firstTradeData.textContent) {
        const priceMatch =
          firstTradeData.textContent.match(/Price: (\d+\.?\d+)/);

        const volumeMatch =
          firstTradeData.textContent.match(/Volume: (\d+\.\d+)/);

        if (priceMatch && volumeMatch) {
          const price = parseFloat(priceMatch[1]);
          const volume = parseFloat(volumeMatch[1]);

          expect(price).toBeGreaterThan(0);
          expect(volume).toBeGreaterThan(0);
        } else {
          throw new Error(
            'Failed to match price and volume in the trade data item',
          );
        }
      } else {
        throw new Error('Trade data item has no text content');
      }
    });
  });
});
