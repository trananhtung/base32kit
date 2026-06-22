/** Which Base32 alphabet to use. */
export type Variant = "rfc4648" | "hex" | "crockford";

interface VariantSpec {
  alphabet: string;
  /** Extra decode aliases (e.g. Crockford's O→0, I/L→1). */
  aliases?: Record<string, number>;
  /** Whether padding with `=` is conventional. */
  padding: boolean;
}

const SPECS: Record<Variant, VariantSpec> = {
  // RFC 4648 §6
  rfc4648: { alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", padding: true },
  // RFC 4648 §7 (base32hex) — sorts the same as the encoded bytes
  hex: { alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV", padding: true },
  // Crockford Base32 — no I, L, O, U; case-insensitive; no padding
  crockford: {
    alphabet: "0123456789ABCDEFGHJKMNPQRSTVWXYZ",
    aliases: { O: 0, I: 1, L: 1 },
    padding: false,
  },
};

export interface VariantTable {
  alphabet: string;
  /** char code → 5-bit value (or -1). */
  lookup: Int16Array;
  padding: boolean;
}

const TABLES = /* @__PURE__ */ new Map<Variant, VariantTable>();

export function getVariant(variant: Variant): VariantTable {
  let table = TABLES.get(variant);
  if (table) return table;

  const spec = SPECS[variant];
  if (!spec) throw new RangeError(`base32: unknown variant "${variant}"`);

  const lookup = new Int16Array(128).fill(-1);
  for (let i = 0; i < spec.alphabet.length; i++) {
    const c = spec.alphabet.charCodeAt(i);
    lookup[c] = i;
    lookup[String.fromCharCode(c).toLowerCase().charCodeAt(0)] = i;
  }
  for (const [ch, value] of Object.entries(spec.aliases ?? {})) {
    lookup[ch.charCodeAt(0)] = value;
    lookup[ch.toLowerCase().charCodeAt(0)] = value;
  }

  table = { alphabet: spec.alphabet, lookup, padding: spec.padding };
  TABLES.set(variant, table);
  return table;
}
