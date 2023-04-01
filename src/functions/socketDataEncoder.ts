const socketDataEncoder = <T>(socketData: ArrayBuffer): T | undefined => {
  try {
    const encoder = new TextDecoder('utf-8');
    const rawData = new Uint8Array(socketData);
    const data = JSON.parse(encoder.decode(rawData)) as T;

    return data;
  } catch (error) {
    console.error(error);
  }
};

export default socketDataEncoder;
