# base32kit

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

> Tiny, **isomorphic** Base32 codec — RFC 4648, base32hex, and Crockford, between strings and `Uint8Array`. **Zero dependencies**.

[![CI](https://github.com/trananhtung/base32kit/actions/workflows/ci.yml/badge.svg)](https://github.com/trananhtung/base32kit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/base32kit.svg)](https://www.npmjs.com/package/base32kit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/base32kit)](https://bundlephobia.com/package/base32kit)
[![types](https://img.shields.io/npm/types/base32kit.svg)](https://www.npmjs.com/package/base32kit)
[![license](https://img.shields.io/npm/l/base32kit.svg)](./LICENSE)

`Buffer` doesn't do Base32, and you reach for it when handling **TOTP/2FA
secrets** (RFC 4648) or **Crockford** ids. `base32kit` covers all three common
alphabets, both directions, between strings and bytes — the same in Node and the
browser. **Zero dependencies**. (For Base64/hex, see its sibling
[`codeckit`](https://www.npmjs.com/package/codeckit).)

```ts
import { encode, decode } from "base32kit";

encode("foobar");                 // "MZXW6YTBOI======"
decode("MZXW6YTBOI======");       // "foobar"
encode("id", { variant: "crockford" }); // unpadded Crockford
```

## Why base32kit?

- **Three alphabets.** `rfc4648` (default, `A–Z2–7`), `hex` (base32hex, `0–9A–V`),
  and `crockford` (`0–9A–Z` minus `I L O U`, case-insensitive, no padding).
- **Tolerant decoding.** Case-insensitive, ignores padding, whitespace, and `-`;
  Crockford also accepts `O`→0 and `I`/`L`→1.
- **RFC-correct.** Passes the RFC 4648 §10 test vectors exactly.
- **Bytes or text.** Low-level `Uint8Array` functions plus UTF-8 text wrappers.
- **Isomorphic & tiny.** Node, Deno, Bun, browsers. Full types, ESM + CJS, zero
  dependencies.

## Install

```bash
npm install base32kit
# or: pnpm add base32kit  /  yarn add base32kit  /  bun add base32kit
```

## Text

```ts
import { encode, decode } from "base32kit";

encode("foobar");                          // "MZXW6YTBOI======"
encode("foobar", { pad: false });          // "MZXW6YTBOI"
encode("foo", { variant: "hex" });         // "CPNMU==="
decode("mzxw6ytboi", { variant: "rfc4648" }); // "foobar" (case + padding tolerant)
```

## Bytes

```ts
import { bytesToBase32, base32ToBytes } from "base32kit";

bytesToBase32(new Uint8Array([1, 2, 3, 4, 5]));                 // RFC 4648
bytesToBase32(secret, { variant: "crockford" });               // unpadded
base32ToBytes("JBSWY3DPEHPK3PXP");                             // → Uint8Array

// TOTP secret → bytes
const key = base32ToBytes(otpSecret.replace(/\s/g, ""));
```

```ts
interface EncodeOptions {
  variant?: "rfc4648" | "hex" | "crockford"; // default "rfc4648"
  pad?: boolean; // default: on for rfc4648/hex, off for crockford
}
```

## Contributors ✨

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome — code, docs, bug reports, ideas, reviews! See the [emoji key](https://allcontributors.org/docs/en/emoji-key) for how each contribution is recognized, and open a PR or issue to get involved.

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/trananhtung"><img src="https://avatars.githubusercontent.com/u/30992229?v=4?s=100" width="100px;" alt="Tung Tran"/><br /><sub><b>Tung Tran</b></sub></a><br /><a href="https://github.com/trananhtung/base32kit/commits?author=trananhtung" title="Code">💻</a> <a href="#maintenance-trananhtung" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[MIT](./LICENSE) © Tung Tran
