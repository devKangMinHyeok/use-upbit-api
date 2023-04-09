const socketDataEncoder = <T>(socketData: ArrayBuffer): T | undefined => {
  const encoder = new TextDecoder('utf-8');
  const rawData = new Uint8Array(socketData);
  try {
    const data = JSON.parse(encoder.decode(rawData)) as T;
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export default socketDataEncoder;
