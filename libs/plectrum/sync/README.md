# Plugin staging (never write `Plectrum_v1/ts` in place)

PrimeUI Figma plugin GitHub sync lands here:

| Plugin setting  | Path                             |
| --------------- | -------------------------------- |
| Tokens File     | `libs/plectrum/sync/tokens.json` |
| Theme Directory | `libs/plectrum/sync/theme/`      |

`.github/workflows/tokens-sync.yml` runs on push to `design-tokens/sync`:

1. `sync/tokens.json` → `libs/plectrum/src/tokens.json`, then `tokens:build`
2. `tokens:audit` — blocks the promotion PR on drift
3. The incoming theme is copied, except `extend.ts`, before `tokens:validate-preset`. An invalid incoming theme fails the sync even when the previous preset was valid. With no incoming theme, preset coverage does not block the token promotion.
4. `tokens:report` — what changed against `main`'s `tokens.json`, which checks passed, what happens next. Written to the Actions job summary, used as the promotion PR body, and committed as `libs/ui/src/storybook/sync-report.generated.ts` for the Storybook page Docs/Token pipeline/Sync status
5. When the audit passed: `tokens/promote-staging` is rebuilt from `main` plus the pinned tokens, generated files and release intent. `extend.ts` is not overwritten. One PR against `main` is opened or updated. A staging file without `source` and `provenance.fileKey`, `provenance.revision` and `provenance.schemaVersion` fails before promotion.
6. `tokens:notify-figma` — the same summary as a comment thread in the Plectrum UI Kit, promoted or blocked (needs `FIGMA_TOKEN`; skips itself otherwise, never blocks the PR)

Hand-fixes stay in `Plectrum_v1/ts/extend.ts`. Do not silently patch generated theme files.
