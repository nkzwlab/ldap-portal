export const bufferToArrayBuffer = (buff: Buffer): ArrayBuffer => {
  const arr = buff.buffer.slice(
    buff.byteOffset,
    buff.byteOffset + buff.byteLength
  );
  return arr;
};

export const arrayBufferToBuffer = (arr: ArrayBuffer): Buffer => {
  return Buffer.from(arr);
};

export const concatArrayBufferAndBuffer = (
  arr: ArrayBuffer,
  buff: Buffer
): Buffer => {
  const tmp = new Uint8Array(arr.byteLength + buff.byteLength);
  tmp.set(new Uint8Array(arr), 0);
  tmp.set(new Uint8Array(buff), arr.byteLength);
  return Buffer.from(tmp.buffer);
};
