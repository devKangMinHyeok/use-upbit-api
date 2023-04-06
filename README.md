# use-upbit-api

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/devKangMinHyeok/use-upbit-api/ci.yml?style=plastic)
![Weekly Downloads](https://img.shields.io/npm/dw/use-upbit-api?style=plastic)
![version](https://img.shields.io/npm/v/use-upbit-api?style=plastic)
![types](https://img.shields.io/npm/types/use-upbit-api?style=plastic)

**The use-upbit-api custom hook for Upbit API** (Korea crypto exchange). In the previous, Upbit API's Websocket usage in React is difficult for developer who is unfamiliar with websocket in React, but this React Custom Hook solve the problem. Let's use this awesome custom hooks!

[_npm_ &rarr;](https://www.npmjs.com/package/use-upbit-api)

[_Git Repository_ &rarr;](https://github.com/devKangMinHyeok/use-upbit-api)

[_View Demo_ &rarr;](https://devkangminhyeok.github.io/React-Upbit-API-Example/total-example)

![TOTALEXAMPLE](https://user-images.githubusercontent.com/44657722/183570075-cb54905c-a57c-44a6-96c3-3d66dccef054.gif)

---

## Install

    npm install --save use-upbit-api

---

## Hooks

**REST API**

[useFetchMarketCode](#usefetchmarketcode)

**WEBSOCKET API**

[useWsTicker](#usewsticker)

[useWsOrderbook](#usewsorderbook)

[useWsTrade](#usewstrade)

---

## useFetchMarketCode

useFetchMarketCode hook is used to fetch market codes from upbit api

```tsx
const {isLoading, marketCodes} = useFetchMarketCode();
```

## useWsTicker

useWsTicker is a custom hook that connects to a WebSocket API and retrieves real-time ticker data for a given market code.

```tsx
const webSocketOptions = {throttle_time: 400};

const {socket, isConnected, socketData} = useWsTicker(
  targetMarketCode,
  webSocketOptions,
);
```

## useWsOrderbook

useWsOrderbook is a custom hook that connects to a WebSocket API and retrieves real-time order book data for a given market code.

```tsx
const webSocketOptions = {throttle_time: 400};

const {socket, isConnected, socketData} = useWsOrderbook(
  targetMarketCode,
  webSocketOptions,
);
```

## useWsTrade

useWsTrade is a custom hook that connects to a WebSocket API
and retrieves real-time trade data for a given market code.

```tsx
const webSocketOptions = {throttle_time: 400, max_length_queue: 100};

const {socket, isConnected, socketData} = useWsTrade(
  targetMarketCode,
  webSocketOptions,
);
```

## Contributing

If you want to contribute to `use-upbit-api`, please contact me <rkdalsgur032@unist.ac.kr>

## License

Licensed under the MIT License, Copyright © 2022-present MinHyeok Kang.
