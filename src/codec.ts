import { getVariant, type Variant } from "./variants.js";

export interface EncodeOptions {
  /** Alphabet to use. Default `"rfc4648"`. */
  variant?: Variant;
  /** Emit `=` padding. Default: the variant's convention (on for RFC, off for Crockford). */
  pad?: boolean;
}

export interface DecodeOptions {
  /** Alphabet to use. Default `"rfc4648"`. */
  variant?: Variant;
}

/**
 * Encode bytes to a Base32 string.
 *
 * ```ts
 * bytesToBase32(new TextEncoder().encode("foobar")); // "MZXW6YTBOI======"
 * bytesToBase32(bytes, { variant: "crockford" });    // unpadded Crockford
 * ```
 */
export function bytesToBase32(bytes: Uint8Array, options: EncodeOptions = {}): string {
  const table = getVariant(options.variant ?? "rfc4648");
  const pad = options.pad ?? table.padding;

  let value = 0;
  let bits = 0;
  let output = "";
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i]!;
    bits += 8;
    while (bits >= 5) {
      output += table.alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += table.alphabet[(value << (5 - bits)) & 31];
  if (pad) while (output.length % 8 !== 0) output += "=";
  return output;
}

/**
 * Decode a Base32 string to bytes. Case-insensitive; ignores padding and
 * embedded whitespace. Crockford input also accepts `O`→0 and `I`/`L`→1.
 *
 * ```ts
 * base32ToBytes("MZXW6YTBOI======"); // bytes of "foobar"
 * ```
 */
export function base32ToBytes(input: string, options: DecodeOptions = {}): Uint8Array {
  const table = getVariant(options.variant ?? "rfc4648");

  let value = 0;
  let bits = 0;
  const out: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code === 61) break; // '=' padding
    if (code === 32 || code === 9 || code === 10 || code === 13 || code === 45) continue; // ws, '-'
    const v = code < 128 ? table.lookup[code]! : -1;
    if (v === -1) throw new SyntaxError(`base32ToBytes: invalid character "${input[i]}"`);
    value = (value << 5) | v;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Uint8Array.from(out);
}
