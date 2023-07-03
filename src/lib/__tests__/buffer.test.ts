import { expect, test } from "vitest";
import { arrayBufferToBuffer, bufferToArrayBuffer } from "../buffer";

test("arrayBufferToBuffer", () => {
  const buff = Buffer.from("hoge", "binary");
  expect(buff.toString()).toBe("hoge");
  const arr = buff.buffer.slice(
    buff.byteOffset,
    buff.byteOffset + buff.byteLength
  );
  expect(arr.byteLength).toBe(4);

  const got = arrayBufferToBuffer(arr);
  const want = buff;

  expect(got).toEqual(want);
});

test("bufferToArrayBuffer", () => {
  const s = "hoge";
  const buff = Buffer.from(s, "binary");

  const arr = new Uint8Array();
  for (let i = 0; i < s.length; i += 1) {
    arr[i] = s.charCodeAt(s.length - i - 1);
  }
  const want = arr.buffer;

  const got = bufferToArrayBuffer(buff);

  expect(got).toEqual(want);
});
