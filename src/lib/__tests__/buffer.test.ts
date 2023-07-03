import { expect, test } from "vitest";
import { arrayBufferToBuffer } from "../buffer";

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
