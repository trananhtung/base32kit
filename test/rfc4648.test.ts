import { describe, it, expect } from "vitest";
import { encode, decode, bytesToBase32, base32ToBytes } from "../src/index.js";

// RFC 4648 §10 test vectors.
const VECTORS: Array<[string, string]> = [
  ["", ""],
  ["f", "MY======"],
  ["fo", "MZXQ===="],
  ["foo", "MZXW6==="],
  ["foob", "MZXW6YQ="],
  ["fooba", "MZXW6YTB"],
  ["foobar", "MZXW6YTBOI======"],
];

describe("RFC 4648 vectors", () => {
  it("encodes each vector exactly", () => {
    for (const [text, expected] of VECTORS) expect(encode(text)).toBe(expected);
  });

  it("decodes each vector back", () => {
    for (const [text, encoded] of VECTORS) expect(decode(encoded)).toBe(text);
  });

  it("round-trips arbitrary bytes of every length 0..40", () => {
    for (let len = 0; len <= 40; len++) {
      const arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) arr[i] = (i * 31 + 7) & 0xff;
      expect(Array.from(base32ToBytes(bytesToBase32(arr)))).toEqual(Array.from(arr));
    }
  });
});

describe("decode tolerance", () => {
  it("is case-insensitive and ignores whitespace/padding", () => {
    expect(decode("mzxw6ytboi======")).toBe("foobar");
    expect(decode("MZXW 6YTB OI")).toBe("foobar"); // spaces + missing padding
  });

  it("throws on invalid characters", () => {
    expect(() => base32ToBytes("0189")).toThrow(SyntaxError); // 0/1/8/9 not in RFC alphabet
  });
});
