# use-upbit-api v1.0.0

**The use-upbit-api custom hook for Upbit API** (Korea crypto exchange). In the previous, Upbit API's Websocket usage in React is difficult for developer who is unfamiliar with websocket in React, but this React Custom Hook solve the problem. Let's use this awesome custom hooks!

- **_Always opening_** to join this project for developing this library.
- **_Typescript_** is supported.

**_View Demo_** [here](https://devkangminhyeok.github.io/React-Upbit-API-Example/total-example)

**_Git Repository_** [here](https://github.com/devKangMinHyeok/use-upbit-api)

## Install

    npm install --save use-upbit-api

## Usage

Git Example is [here](https://github.com/devKangMinHyeok/React-Upbit-API-Example)

**useFetchMarketCode**

```
import { useFetchMarketCode } from "use-upbit-api";

function  App()  {
const  {  isLoading,  marketCodes  }  =  useFetchMarketCode();

return (
<>
	{!isLoading ? marketCodes.map((ele)  =>
		<div  key={ele.market}>
			{ele.market}
		</div>)
		:  null
	}
</>
);
}

export  default App;
```

**useUpbitWebSocket**

**ticker API**

```
import { useFetchMarketCode } from "use-upbit-api";
import { useUpbitWebSocket } from  "use-upbit-api";

function  App()  {
const option = { throttle_time: 400, max_length_queue: 100 };
const  {  isLoading, marketCodes:  targetMarketCodes  }  =  useFetchMarketCode();
const  {  socket,  isConnected,  socketData  }  =  useUpbitWebSocket(targetMarketCodes, "ticker", option);

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
					? socketData.map((data,  index)  => (
						<tr  key={`${data.code}_${index}`}>
							<td>{data.code}</td>
							<td>{data.trade_price}</td>
							<td>{(data.signed_change_rate *  100).toFixed(2)}%</td>
						</tr>
					))
				:  null}
			</tbody>
		</table>
	</>
);
}

export  default App;
```
