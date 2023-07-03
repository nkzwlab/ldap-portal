export const encodeUtf8 = (text: string): Buffer => {
  const encoder = new TextEncoder();
  const arr = encoder.encode(text);
  return Buffer.from(arr);
};
