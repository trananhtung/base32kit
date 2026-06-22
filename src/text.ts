import { bytesToBase32, base32ToBytes, type EncodeOptions, type DecodeOptions } from "./codec.js";

const encoder = /* @__PURE__ */ new TextEncoder();
const decoder = /* @__PURE__ */ new TextDecoder();

/** Base32-encode a UTF-8 string. */
export function encode(text: string, options?: EncodeOptions): string {
  return bytesToBase32(encoder.encode(text), options);
}

/** Decode a Base32 string to a UTF-8 string. */
export function decode(base32: string, options?: DecodeOptions): string {
  return decoder.decode(base32ToBytes(base32, options));
}
