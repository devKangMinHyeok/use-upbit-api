const socketDataEncoder = (socketData: any) => {
  try {
    const encoder = new TextDecoder('utf-8');
    const rawData = new Uint8Array(socketData);
    const data = JSON.parse(encoder.decode(rawData));

    return data;
  } catch (error) {
    console.error(error);
  }
};

export default socketDataEncoder;
