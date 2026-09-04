# Plugin staging (never write `Plectrum_v1/ts` in place)

PrimeUI Figma plugin GitHub sync lands here:

| Plugin setting | Path |
|---|---|
| Tokens File | `libs/plectrum/sync/tokens.json` |
| Theme Directory | `libs/plectrum/sync/theme/` |

`.github/workflows/tokens-sync.yml` runs on push to `design-tokens/sync` and opens a PR that promotes:

- `sync/tokens.json` → `libs/plectrum/src/tokens.json`
- `sync/theme/` → `libs/plectrum/src/Plectrum_v1/` **only if** `tokens:validate-preset` passes

Hand-fixes stay in `Plectrum_v1/ts/extend.ts`. Do not silently patch generated theme files.
