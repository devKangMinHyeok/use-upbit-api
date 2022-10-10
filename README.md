# use-upbit-api v1.1.5

**The use-upbit-api custom hook for Upbit API** (Korea crypto exchange). In the previous, Upbit API's Websocket usage in React is difficult for developer who is unfamiliar with websocket in React, but this React Custom Hook solve the problem. Let's use this awesome custom hooks!

**_npm_** [here](https://www.npmjs.com/package/use-upbit-api)

**_Git Repository_** [here](https://github.com/devKangMinHyeok/use-upbit-api)

- **_Always opening_** to join this project for developing this library.
- **_Typescript_** is supported.

**_View Demo_** [here](https://devkangminhyeok.github.io/React-Upbit-API-Example/total-example)

![TOTALEXAMPLE](https://user-images.githubusercontent.com/44657722/183570075-cb54905c-a57c-44a6-96c3-3d66dccef054.gif)

**_View Demo Code_** is [here](https://github.com/devKangMinHyeok/React-Upbit-API-Example)

## Install

    npm install --save use-upbit-api

## Format

### useFetchMarketCode

```jsx
const { isLoading, marketCodes } = useFetchMarketCode();
```

| Return      | Description                         | Type        | Format                                                                                  |
| ----------- | ----------------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| isLoading   | State of fetching market codes data | Boolean     | `true : Loading`, <br> `false : Done`                                                   |
| marketCodes | All market codes of Upbit           | ObjectArray | { <br>`market: string`,<br> `korean_name: string`, <br> `english_name: string`<br>} [ ] |

### useUpbitWebSocket

```jsx
const { socket, isConnected, socketData } = useUpbitWebSocket(
  targetMarketCodes,
  type,
  option
);
```

**Default Value**

```jsx
targetMarketCodes : [
  { market: "KRW-BTC", korean_name: "비트코인", english_name: "Bitcoin" },
]
type : "ticker"
option : { throttle_time: 400, max_length_queue: 100 }
```

| Argument              | Description                                                                                                              | Type        | Format                                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **targetMarketCodes** | Targeted market codes to Websocket API                                                                                   | ObjectArray | { `market: string`, `korean_name: string`, `english_name: string`} [ ] <br><br> - targetMarketCodes **should be strictly Object Array**, **not Object** .                                                                     |
| **type**              | Websocket Connection Type                                                                                                | String      | `"ticker"` <br>`"orderbook"` <br> `"trade"` <br> <br>**- Strictly above one of the three types above**                                                                                                                        |
| **option**            | throttle_time : period of updating socketData <br> max_length_queue : In "trade" type, max length of trade history queue | Object      | { <br> `throttle_time: number`,<br> `max_length_queue: number` <br> } <br><br> **- Too Low throttle_time (less than 400ms) may cause unexpectable bug. <br><br> - Too Large max_length_queue can make too large memory use.** |

| Return          | Description                                            | Type             | Format                                             |
| --------------- | ------------------------------------------------------ | ---------------- | -------------------------------------------------- |
| **socket**      | WebSocket object which is created by useUpbitWebSocket | WebSocket object |                                                    |
| **isConnected** | State of Websocket Connection                          | Boolean          | - `true : Connected` <br> - `false : NonConnected` |
| **socketData**  | recieved data from upbit websocket server              | ObjectArray      |                                                    |

## Usage

**_Git Example Code_** is [here](https://github.com/devKangMinHyeok/React-Upbit-API-Example)

### useFetchMarketCode

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

### useUpbitWebSocket

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

## typescript Support(version >= 1.1.4)

**ticker API**

```tsx
import { TickerInterface, useUpbitWebSocket } from "use-upbit-api";

const { socket, isConnected, socketData }: TickerInterface = useUpbitWebSocket(
  targetMarketCodes,
  "ticker",
  option
);
```

**orderbook API**

```tsx
import { OrderbookInterface, useUpbitWebSocket } from "use-upbit-api";

const { socket, isConnected, socketData }: OrderbookInterface =
  useUpbitWebSocket(targetMarketCodes, "orderbook", option);
```

**trade API**

```tsx
import { TradeInterface, useUpbitWebSocket } from "use-upbit-api";

const { socket, isConnected, socketData }: TradeInterface = useUpbitWebSocket(
  targetMarketCodes,
  "trade",
  option
);
```

## Contributing

If you want to contribute to `use-upbit-api`, please contact me <rkdalsgur032@unist.ac.kr>

## License

Licensed under the MIT License, Copyright © 2022-present MinHyeok Kang.
