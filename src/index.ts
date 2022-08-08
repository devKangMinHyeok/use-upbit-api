import { useCallback, useEffect, useRef, useState } from "react";
import { cloneDeep, throttle } from "lodash";

interface ImarketCodes {
  market: string;
  korean_name: string;
  english_name: string;
}

const socketDataEncoder = (socketData: any) => {
  try {
    const encoder = new TextDecoder("utf-8");
    const rawData = new Uint8Array(socketData);
    const data = JSON.parse(encoder.decode(rawData));

    return data;
  } catch (error) {
    console.log(error);
  }
};

const typeChecker = (type: string) => {
  try {
    let isValid = true;
    if (type != "ticker" && type != "orderbook" && type != "trade") {
      isValid = false;
    }
    return isValid;
  } catch (error) {
    console.log(error);
  }
};

const getLastBuffers = (buffer: any, maxNumResult: number) => {
  try {
    let result = [];

    for (let i = buffer.length - 1; i >= 0; i--) {
      let isExist = false;

      for (let j = 0; j < result.length; j++) {
        if (result[j].code === buffer[i].code) {
          isExist = true;
        } else continue;
      }

      if (!isExist) result.push(buffer[i]);
      else {
        if (maxNumResult <= result.length) break;
        else continue;
      }
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

const sortBuffers = (originalBuffers: any, sortOrder: ImarketCodes[]) => {
  try {
    let result = [];
    for (let i = 0; i < sortOrder.length; i++) {
      const targetCode = sortOrder[i].market;
      for (let j = 0; j < originalBuffers.length; j++) {
        if (targetCode === originalBuffers[j].code) {
          result.push(originalBuffers[j]);
          break;
        } else continue;
      }
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

const updateSocketData = (origininalData: any, newData: any) => {
  try {
    const copyOriginal = cloneDeep(origininalData);
    const copyNew = cloneDeep(newData);

    if (copyOriginal && newData) {
      for (let i = 0; i < copyOriginal.length; i++) {
        const target = copyOriginal[i];
        for (let j = 0; j < newData.length; j++) {
          if (target.code === newData[j].code) {
            copyOriginal[i] = newData[j];
            copyNew[j] = null;
            break;
          } else continue;
        }
      }

      // 원본 데이터에 없는 market 데이터가 새롭게 받은 데이터에 존재하는 case
      const remainNew = copyNew.filter((element: any) => element !== null);
      if (remainNew.length > 0) {
        copyOriginal.push(...remainNew);
      }
    }
    return copyOriginal;
  } catch (error) {
    console.log(error);
  }
};

const updateQueueBuffer = (buffer: any, maxSize: number) => {
  try {
    const copyBuffer = cloneDeep(buffer);
    while (copyBuffer.length >= maxSize) {
      copyBuffer.shift();
    }
    return copyBuffer;
  } catch (error) {
    console.log(error);
  }
};

export function useUpbitWebSocket(
  targetMarketCodes: ImarketCodes[],
  type: string,
  options = { throttle_time: 400, max_length_queue: 100 }
) {
  const SOCKET_URL: string = "wss://api.upbit.com/websocket/v1";
  const { throttle_time, max_length_queue } = options;
  const socket = useRef<WebSocket | null>(null);
  const buffer = useRef<any[]>([] as any[]);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loadingBuffer, setLoadingBuffer] = useState<any>([]);
  const [socketData, setSocketData] = useState<any>();

  const throttled = useCallback(
    throttle(() => {
      try {
        const lastBuffers = getLastBuffers(
          buffer.current,
          targetMarketCodes.length
        );

        switch (type) {
          case "ticker":
            const sortedBuffers = sortBuffers(lastBuffers, targetMarketCodes);
            setLoadingBuffer(sortedBuffers);
            buffer.current = [];
            break;

          case "orderbook":
            setSocketData(lastBuffers);
            buffer.current = [];
            break;

          case "trade":
            const updatedBuffer = updateQueueBuffer(
              buffer.current,
              max_length_queue
            );
            buffer.current = updatedBuffer;
            setSocketData(updatedBuffer);
            break;

          default:
            break;
        }
      } catch (error) {
        throw new Error();
      }
    }, throttle_time),
    [targetMarketCodes]
  );
  // socket 세팅
  useEffect(() => {
    try {
      const isTypeValid = typeChecker(type);
      if (!isTypeValid) {
        console.log(
          "[Error] | input type is unknown. (input type should be 'ticker' or 'orderbook' or 'trade')"
        );
        throw new Error();
      }

      if (type === "orderbook" || type === "trade") {
        if (targetMarketCodes.length > 1) {
          console.log(
            "[Error] | 'Length' of Target Market Codes should be only 'one' in 'orderbook' and 'trade'. you can request only 1 marketcode's data, when you want to get 'orderbook' or 'trade' data."
          );
          throw new Error();
        }
      }

      if (targetMarketCodes.length > 0 && !socket.current) {
        socket.current = new WebSocket(SOCKET_URL);
        socket.current.binaryType = "arraybuffer";

        const socketOpenHandler = () => {
          setIsConnected(true);
          console.log("[연결완료] | socket Open Type: ", type);
          if (socket.current?.readyState == 1) {
            const sendContent = [
              { ticket: "test" },
              {
                type: type,
                codes: targetMarketCodes.map((code) => code.market),
              },
            ];
            socket.current.send(JSON.stringify(sendContent));
            console.log("message sending done");
          }
        };

        const socketCloseHandler = () => {
          setIsConnected(false);
          setLoadingBuffer([]);
          setSocketData(null);
          buffer.current = [];
          console.log("연결종료");
        };

        const socketErrorHandler = (error: any) => {
          console.log("[Error]", error);
        };

        const socketMessageHandler = (evt: MessageEvent) => {
          const data = socketDataEncoder(evt.data);
          buffer.current.push(data);
          throttled();
        };

        socket.current.onopen = socketOpenHandler;
        socket.current.onclose = socketCloseHandler;
        socket.current.onerror = socketErrorHandler;
        socket.current.onmessage = socketMessageHandler;
      }
      return () => {
        if (socket.current) {
          if (socket.current.readyState != 0) {
            socket.current.close();
            socket.current = null;
          }
        }
      };
    } catch (error) {
      throw new Error();
    }
  }, [targetMarketCodes]);

  useEffect(() => {
    try {
      if (loadingBuffer.length > 0) {
        if (!socketData) {
          setSocketData(loadingBuffer);
        } else {
          setSocketData((prev: any) => {
            return updateSocketData(prev, loadingBuffer);
          });
          setLoadingBuffer([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [loadingBuffer]);

  return { socket: socket.current, isConnected, socketData };
}

export function useFetchMarketCode() {
  const REST_API_URL: string =
    "https://api.upbit.com/v1/market/all?isDetails=false";
  const options = { method: "GET", headers: { Accept: "application/json" } };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [marketCodes, setMarketCodes] = useState<ImarketCodes[]>(
    [] as ImarketCodes[]
  );

  const fetchMarketCodes = useCallback(async () => {
    const response = await fetch(REST_API_URL, options);
    const result: ImarketCodes[] = await response.json();

    setMarketCodes(result);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMarketCodes();
  }, []);

  return { isLoading, marketCodes };
}
