# use-upbit-api v1.0.4

**The use-upbit-api custom hook for Upbit API** (Korea crypto exchange). In the previous, Upbit API's Websocket usage in React is difficult for developer who is unfamiliar with websocket in React, but this React Custom Hook solve the problem. Let's use this awesome custom hooks!

- **_Always opening_** to join this project for developing this library.
- **_Typescript_** is supported.

**_View Demo_** [here](https://devkangminhyeok.github.io/React-Upbit-API-Example/total-example)

![TOTALEXAMPLE](https://user-images.githubusercontent.com/44657722/183570075-cb54905c-a57c-44a6-96c3-3d66dccef054.gif)

**_Git Repository_** [here](https://github.com/devKangMinHyeok/use-upbit-api)

## Install

    npm install --save use-upbit-api

## Usage

**_Git Example Code_** is [here](https://github.com/devKangMinHyeok/React-Upbit-API-Example)

###useFetchMarketCode

```jsx
import { useFetchMarketCode } from "use-upbit-api";

function App() {
  const { isLoading, marketCodes } = useFetchMarketCode();

  return (
    <>
      {!isLoading
        ? marketCodes.map((ele) => <div key={ele.market}>{ele.market}</div>)
        : null}
    </>
  );
}

export default App;
```

---

###useUpbitWebSocket

**ticker API**

```jsx
import { useFetchMarketCode } from "use-upbit-api";
import { useUpbitWebSocket } from "use-upbit-api";

function App() {
  const option = { throttle_time: 400, max_length_queue: 100 };
  const { isLoading, marketCodes: targetMarketCodes } = useFetchMarketCode();
  const { socket, isConnected, socketData } = useUpbitWebSocket(
    targetMarketCodes,
    "ticker",
    option
  );

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>코인</th>
            <th>현재가</th>
            <th>등락률</th>
          </tr>
        </thead>
        <tbody>
          {socketData
            ? socketData.map((data, index) => (
                <tr key={`${data.code}_${index}`}>
                  <td>{data.code}</td>
                  <td>{data.trade_price}</td>
                  <td>{(data.signed_change_rate * 100).toFixed(2)}%</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </>
  );
}

export default App;
```

**orderbook API**

```jsx
import { useState } from "react";
import { useUpbitWebSocket } from "use-upbit-api";

function App() {
  const option = { throttle_time: 400, max_length_queue: 100 };
  const [targetMarketCodes, setTargetMarketCodes] = useState([
    {
      market: "KRW-BTC",
      korean_name: "비트코인",
      english_name: "Bitcoin",
    },
  ]);
  const { socket, isConnected, socketData } = useUpbitWebSocket(
    targetMarketCodes,
    "orderbook",
    option
  );

  return (
    <>
      {socketData ? (
        <div>
          <div>코인 : {socketData.code}</div>
          <div>총 매도 물량 : {socketData.total_ask_size}</div>
          <div>총 매수 물량 : {socketData.total_bid_size}</div>
          <table>
            <thead>
              <tr>
                <th>매도 물량</th>
                <th>가격</th>
                <th>매수 물량</th>
              </tr>
            </thead>
            <tbody>
              {[...socketData.orderbook_units].reverse().map((ele, index) => (
                <tr key={`ask_${index}`}>
                  <th>{ele.ask_size}</th>
                  <th>{ele.ask_price}</th>
                  <th>-</th>
                </tr>
              ))}
              {[...socketData.orderbook_units].map((ele, index) => (
                <tr key={`bid_${index}`}>
                  <th>-</th>
                  <th>{ele.bid_price}</th>
                  <th>{ele.bid_size}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Orderbook Loading...</div>
      )}
    </>
  );
}

export default App;
```

**trade API**

```jsx
import { useState } from "react";
import { useUpbitWebSocket } from "use-upbit-api";

function App() {
  const option = { throttle_time: 400, max_length_queue: 100 };
  const [targetMarketCodes, setTargetMarketCodes] = useState([
    {
      market: "KRW-BTC",
      korean_name: "비트코인",
      english_name: "Bitcoin",
    },
  ]);
  const { socket, isConnected, socketData } = useUpbitWebSocket(
    targetMarketCodes,
    "trade",
    option
  );

  return (
    <>
      {socketData ? (
        <table>
          <thead>
            <tr>
              <th>코인</th>
              <th>체결 ID</th>
              <th>체결 시간</th>
              <th>ASK/BID</th>
              <th>체결 가격</th>
            </tr>
          </thead>
          <tbody>
            {[...socketData].reverse().map((ele, index) => (
              <tr key={index}>
                <th>{ele.code} </th>
                <th>{ele.sequential_id} </th>
                <th>
                  {ele.trade_date} {ele.trade_time}
                </th>
                <th>{ele.ask_bid} </th>
                <th>{ele.prev_closing_price} </th>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default App;
```

## Contributing

If you want to contribute to `use-upbit-api`, please contact me <rkdalsgur032@unist.ac.kr>

## License

Licensed under the MIT License, Copyright © 2022-present MinHyeok Kang.
