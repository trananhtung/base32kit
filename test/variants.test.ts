import { describe, it, expect } from "vitest";
import { bytesToBase32, base32ToBytes, encode, decode } from "../src/index.js";

const bytes = (...n: number[]) => new Uint8Array(n);

describe("base32hex variant", () => {
  it("uses the 0-9A-V alphabet and round-trips", () => {
    const enc = encode("foobar", { variant: "hex" });
    expect(/^[0-9A-V=]+$/.test(enc)).toBe(true);
    expect(decode(enc, { variant: "hex" })).toBe("foobar");
  });

  it("hex of 'foo' is the known vector CPNMU===", () => {
    expect(encode("foo", { variant: "hex" })).toBe("CPNMU===");
  });
});

describe("crockford variant", () => {
  it("encodes without padding and excludes I L O U", () => {
    const enc = bytesToBase32(bytes(1, 2, 3, 4, 5), { variant: "crockford" });
    expect(enc).not.toContain("=");
    expect(/[ILOU]/.test(enc)).toBe(false);
  });

  it("round-trips", () => {
    const data = bytes(255, 0, 128, 64, 32, 16);
    expect(Array.from(base32ToBytes(bytesToBase32(data, { variant: "crockford" }), { variant: "crockford" }))).toEqual(
      Array.from(data),
    );
  });

  it("decodes the O→0 and I/L→1 aliases", () => {
    const canonical = bytesToBase32(bytes(0b00000_00001), { variant: "crockford" });
    // Replace any 0 with O and 1 with I; decoding should still match.
    const aliased = canonical.replace(/0/g, "O").replace(/1/g, "I");
    expect(Array.from(base32ToBytes(aliased, { variant: "crockford" }))).toEqual(
      Array.from(base32ToBytes(canonical, { variant: "crockford" })),
    );
  });
});

describe("pad option", () => {
  it("can drop padding on rfc4648", () => {
    expect(encode("f", { pad: false })).toBe("MY");
    expect(encode("f")).toBe("MY======");
  });
});
