# use-upbit-api

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/devKangMinHyeok/use-upbit-api/ci.yml?style=plastic)
![Weekly Downloads](https://img.shields.io/npm/dw/use-upbit-api?style=plastic)
![version](https://img.shields.io/npm/v/use-upbit-api?style=plastic)
![types](https://img.shields.io/npm/types/use-upbit-api?style=plastic)

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

## Hooks

[useFetchMarketCode](#useFetchMarketCode)

[useWsTicker](#useWsTicker)

[useWsOrderbook](#useWsOrderbook)

[useWsTrade](#useWsTrade)

## useFetchMarketCode

```tsx
const {isLoading, marketCodes} = useFetchMarketCode();
```

## useWsTicker

```tsx
const webSocketOptions = {throttle_time: 400, max_length_queue: 100};

const {socket, isConnected, socketData} = useWsTicker(
  targetMarketCode,
  webSocketOptions,
);
```

## useWsOrderbook

```tsx
const webSocketOptions = {throttle_time: 400, max_length_queue: 100};

const {socket, isConnected, socketData} = useWsOrderbook(
  targetMarketCode,
  webSocketOptions,
);
```

## useWsTrade

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
