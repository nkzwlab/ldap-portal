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
