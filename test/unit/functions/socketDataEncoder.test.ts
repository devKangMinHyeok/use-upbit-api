import socketDataEncoder from '@root/src/functions/socketDataEncoder';

interface TestDataType {
  id: number;
  name: string;
}

describe('socketDataEncoder', () => {
  // it('should decode a valid ArrayBuffer into the expected object', () => {
  //   const testData: TestDataType = {id: 1, name: 'test'};
  //   const testDataJson = JSON.stringify(testData);
  //   const testDataBuffer = new TextEncoder().encode(testDataJson).buffer;

  //   const result = socketDataEncoder<TestDataType>(testDataBuffer);

  //   expect(result).toEqual(testData);
  // });

  it('should return undefined when decoding an invalid ArrayBuffer(Not JSON data)', () => {
    const invalidDataBuffer = new Uint8Array([0, 1, 2, 3]).buffer;

    const result = socketDataEncoder<TestDataType>(invalidDataBuffer);

    expect(result).toBeUndefined();
  });

  it('should return undefined when decoding an empty ArrayBuffer', () => {
    const emptyDataBuffer = new ArrayBuffer(0);

    const result = socketDataEncoder<TestDataType>(emptyDataBuffer);

    expect(result).toBeUndefined();
  });
});
