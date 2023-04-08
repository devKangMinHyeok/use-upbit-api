// Test code
import useWsOrderbook from '../../../src/hooks/useWsOrderbook';
import * as React from 'react';
import {useState} from 'react';

import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const TestOrderbookComponent = () => {
  const [marketCode, _] = useState([
    {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    },
  ]);
  const {isConnected, socketData} = useWsOrderbook(marketCode);

  return (
    <div>
      {isConnected ? <p>Connected</p> : <p>Not Connected</p>}
      {socketData && (
        <ul data-testid="socket-data">
          {socketData.orderbook_units.map((unit, index) => (
            <li key={index} data-testid={`orderbook-unit-${index}`}>
              Ask Price: {unit.ask_price} | Ask Size: {unit.ask_size}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

describe('useWsOrderbook hook', () => {
  it('renders connection status and received socket data', async () => {
    // Render the TestOrderbookComponent
    render(<TestOrderbookComponent />);

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
    // Render the TestOrderbookComponent
    render(<TestOrderbookComponent />);

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
      const orderbookUnits = await screen.findAllByTestId(/orderbook-unit-\d+/);

      // Check if there are orderbook units
      expect(orderbookUnits.length).toBeGreaterThan(0);

      // Test one of the orderbook units
      const firstUnit = orderbookUnits[0];

      if (firstUnit.textContent) {
        console.log('firstUnit.textContent: ', firstUnit.textContent);
        const askPriceMatch = firstUnit.textContent.match(
          /Ask Price: (\d+\.?\d+)/,
        );

        const askSizeMatch =
          firstUnit.textContent.match(/Ask Size: (\d+\.\d+)/);
        console.log('askPriceMatch: ', askPriceMatch);
        console.log('askSizeMatch: ', askSizeMatch);
        if (askPriceMatch && askSizeMatch) {
          const askPrice = parseFloat(askPriceMatch[1]);
          const askSize = parseFloat(askSizeMatch[1]);
          console.log('askPrice: ', askPrice);
          console.log('askSize: ', askSize);

          expect(askPrice).toBeGreaterThan(0);
          expect(askSize).toBeGreaterThan(0);
        } else {
          throw new Error(
            'Failed to match ask price and size in the orderbook unit',
          );
        }
      } else {
        throw new Error('Orderbook unit has no text content');
      }
    });
  });
});
