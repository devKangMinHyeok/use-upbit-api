# use-upbit-api

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/devKangMinHyeok/use-upbit-api/ci.yml?style=plastic)
![Weekly Downloads](https://img.shields.io/npm/dw/use-upbit-api?style=plastic)
![version](https://img.shields.io/npm/v/use-upbit-api?style=plastic)
![types](https://img.shields.io/npm/types/use-upbit-api?style=plastic)

**The use-upbit-api, React custom hook for Upbit API** (Korea crypto exchange).

In the previous, Upbit API's Websocket usage in React is difficult for developer who is unfamiliar with websocket in React, but this React Custom Hook solve the problem.

Let's use this awesome custom hooks!

[_npm_ &rarr;](https://www.npmjs.com/package/use-upbit-api)

[_Git Repository_ &rarr;](https://github.com/devKangMinHyeok/use-upbit-api)

[_Coverage Status_ &rarr;](https://devkangminhyeok.github.io/use-upbit-api/)

[_View Demo_ &rarr;](https://devkangminhyeok.github.io/React-Upbit-API-Example/total-example)

[_Demo Code_ &rarr;](https://github.com/devKangMinHyeok/React-Upbit-API-Example)

![TOTALEXAMPLE](https://user-images.githubusercontent.com/44657722/183570075-cb54905c-a57c-44a6-96c3-3d66dccef054.gif)

## Install

    npm install --save use-upbit-api

## Hooks

**REST API**

[useFetchMarketCode](#usefetchmarketcode)

**WEBSOCKET API**

[useWsTicker](#usewsticker)

[useWsOrderbook](#usewsorderbook)

[useWsTrade](#usewstrade)

## useFetchMarketCode

useFetchMarketCode hook is used to fetch market codes from upbit api

```tsx
import {useFetchMarketCode} from 'use-upbit-api';

function Component() {
  const {isLoading, marketCodes} = useFetchMarketCode(
    (options = {debug: false}), // default option, can be modified.
  );

  //...
}
```

## ⚠️ CAUTIONs IN WEBSOCKET API

targetMarketCode should be state in react (useState, ...), if not, unexpectable error can occur.

Do not use just constant or variable.

## useWsTicker

useWsTicker is a custom hook that connects to a WebSocket API and retrieves real-time ticker data for a given market code.

```tsx
import { useWsTicker } from "use-upbit-api";

function Component() {
  const [targetMarketCode, _] = useState([
    {
      market: 'KRW-BTC',
      korean_name: '비트코인',
      english_name: 'Bitcoin',
    },
    ...
  ]);

  const {socket, isConnected, socketData} = useWsTicker(
    targetMarketCode, // should be array
    onError, // onError?: (error: Error) => void // optional, user for using ErrorBoundary
    (options = {throttle_time: 400, debug: false}), // default option, can be modified.
  );

  // ...
}


```

## useWsOrderbook

useWsOrderbook is a custom hook that connects to a WebSocket API and retrieves real-time order book data for a given market code.

```tsx
import {useWsOrderbook} from 'use-upbit-api';

function Component() {
  const [targetMarketCode, _] = useState({
    market: 'KRW-BTC',
    korean_name: '비트코인',
    english_name: 'Bitcoin',
  });

  const {socket, isConnected, socketData} = useWsOrderbook(
    targetMarketCode, // should be above form object
    onError, // onError?: (error: Error) => void // optional, user for using ErrorBoundary
    (options = {throttle_time: 400, debug: false}), // default option, can be modified.
  );

  // ...
}
```

## useWsTrade

useWsTrade is a custom hook that connects to a WebSocket API
and retrieves real-time trade data for a given market code.

```tsx
import {useWsTrade} from 'use-upbit-api';

function Component() {
  const [targetMarketCode, _] = useState({
    market: 'KRW-BTC',
    korean_name: '비트코인',
    english_name: 'Bitcoin',
  });

  const {socket, isConnected, socketData} = useWsTrade(
    targetMarketCode, // should be above form object
    onError, // onError?: (error: Error) => void // optional, user for using ErrorBoundary
    (options = {throttle_time: 400, max_length_queue: 100, debug: false}), // default option, can be modified.
  );

  // ...
}
```

## Flow

### API Flow
![api_flow](https://user-images.githubusercontent.com/44657722/232290272-75ff747a-0b96-4a12-b85b-1a8b57247f9e.png)

### Websocket Hook Flow
![ws_logic_flow](https://user-images.githubusercontent.com/44657722/232290395-31fef232-fdb7-4e0b-91ce-01693a68cb7f.png)


## Contributing

Thank you for your interest in contributing to use-upbit-api. Before you begin writing code, it is important that you share your intention to contribute with the team, based on the type of contribution

1. You want to **propose a new feature** and implement it.
   - Post about your intended feature in an [issue](https://github.com/devKangMinHyeok/use-upbit-api/issues), then implement it.
   - We suggest that the branch name that you implement is better to be {type}/{issue number}/{issue name}. ex) feature/118/githubAction, bugfix/120/typo
2. You want to **implement a feature or bug-fix** for an outstanding issue.
   - Search for your issue in the [use-upbit-api issue list](https://github.com/devKangMinHyeok/use-upbit-api/issues).
   - Pick an issue and comment that you'd like to work on the feature or bug-fix.
   - If you need more context on a particular issue, please ask and we shall provide.
3. **Open pull request**
   - You implement and test your feature or bug-fix, please submit a Pull Request to [use-upbit-api PR](https://github.com/devKangMinHyeok/use-upbit-api/pulls) with some test case.
   - Once a pull request is accepted and CI is passing, there is nothing else you need to do. we will check and merge the PR for you.

**_Always opening_** to join this project for developing this library.

❗️[_ISSUE_ &rarr;](https://github.com/devKangMinHyeok/use-upbit-api/issues)

✅ [_Pull Request_ &rarr;](https://github.com/devKangMinHyeok/use-upbit-api/pulls)

## License

Licensed under the MIT License, Copyright © 2022-present MinHyeok Kang.
