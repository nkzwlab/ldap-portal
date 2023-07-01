export const encodeUtf8 = (text: string): ArrayBuffer => {
  const encoder = new TextEncoder();
  return encoder.encode(text);
};
