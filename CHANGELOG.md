# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-22

### Added

- `bytesToBase32` / `base32ToBytes` — isomorphic Base32 with `rfc4648` (default),
  `hex` (base32hex), and `crockford` variants, plus a `pad` option.
- Tolerant decoding: case-insensitive, ignores padding/whitespace/`-`; Crockford
  accepts `O`→0 and `I`/`L`→1 aliases.
- `encode` / `decode` text wrappers (UTF-8).
- Verified against the RFC 4648 §10 test vectors.
- ESM + CJS builds, types, and CI across Node 18 / 20 / 22.
