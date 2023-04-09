import useWsTicker from '../../../src/hooks/useWsTicker';
import * as React from 'react';
import {useState} from 'react';

import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const TestTickerComponentConnection = () => {
  const [marketCode, _] = useState([
    {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    },
  ]);
  const {isConnected, socketData} = useWsTicker(marketCode);

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
  it('renders connection status and received socket data', async () => {
    // Render the TestTickerComponentConnection
    render(<TestTickerComponentConnection />);

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
