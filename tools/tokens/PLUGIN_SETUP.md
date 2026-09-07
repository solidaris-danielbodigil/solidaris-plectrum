# PrimeUI plugin → GitHub (designer-owned settings)

Recorded so engineers can audit what the plugin is allowed to touch.

## GitHub App / PAT

- Fine-grained PAT, **this repo only**
- Permissions: **Contents: Read and write**
- Do not use a classic PAT or org-wide access

## Branch

- Tokens branch: **`design-tokens/sync`**
- **Never `main`**
- The plugin commits directly; `tokens-sync.yml` opens the promotion PR

## Promotion

Every push to `design-tokens/sync` rebuilds `tokens/promote-staging` = the staging branch + the generated files (`src/tokens.json`, `--pds-*` SCSS, token manifest, `sync-report.generated.ts`) and opens or updates **one PR against `main`**. Changes in the report are measured against `main`'s `tokens.json`, so the PR always reads as "what merging this changes for the apps".

After merging a promotion PR, merge `main` back into `design-tokens/sync` so the next plugin push runs the current workflow and scripts. The plugin only ever writes `libs/plectrum/sync/tokens.json`, so that merge is conflict-free.

## Paths

| Field           | Value                            |
| --------------- | -------------------------------- |
| Tokens File     | `libs/plectrum/sync/tokens.json` |
| Theme Directory | `libs/plectrum/sync/theme/`      |

## Confirmed plugin behaviour (first sync, 2026-09-07)

| Question                                    | Expected                                                              | Confirmed                                                                                                                                                                                                                                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direct commit vs PR to `design-tokens/sync` | Direct commit to the tokens branch                                    | Direct commit, message `Update design tokens from Figma - DD/MM/YYYY`, author = PAT owner                                                                                                                                                                                                 |
| Overwrite vs merge `tokens.json`            | Overwrite the staging file                                            | Overwrite; the commit touches only `libs/plectrum/sync/tokens.json`                                                                                                                                                                                                                       |
| DTCG shape                                  | 7 sets + `$metadata.tokenSetOrder` matching current `src/tokens.json` | **Different**: `"source": "primeui-figma-plugin-v4"` plus 8 sets named `aura/component/light`, `aura/primitive`, `aura/semantic/light`, `aura/app`, `aura/custom`, `aura/semantic/common`, `aura/component/common`, `aura/effects`. No `$metadata`; sets apply in file order (later wins) |
| Numeric segment names                       | Plain keys                                                            | Quoted: key `"1"` and alias `{scale."1"}`. `resolve-dtcg` strips the quotes                                                                                                                                                                                                               |
| Shadows                                     | Expanded leaves (`…shadow.0.x`)                                       | Composite `{ x, y, blur, spread, color }` objects (arrays for multi-layer) under `aura/effects`, bottom-most layer first. `format-value` reverses to CSS order                                                                                                                            |
| Colors                                      | hex6                                                                  | hex8 with `ff` alpha (`#487395ff`). Normalised on ingestion                                                                                                                                                                                                                               |
| Theme files                                 | TypeScript PrimeNG preset under `sync/theme/`                         | Not synced yet — the Theme tab needs a Theme Designer secret key. Tokens-only sync works without it                                                                                                                                                                                       |

The promotion PR body and the Actions job summary carry the `tokens:report` output for each sync.

## Feedback in Figma (`tokens:notify-figma`)

After every push the workflow posts the same summary as a comment in the UI Kit — "Promoted for review" or "Blocked", what changed, which check failed. Replies go into one thread that starts with `[Plectrum token sync]`; resolve the thread to start a fresh one.

| Setting                      | Where                   | Value                                                                                                                                                                          |
| ---------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FIGMA_TOKEN`                | repo secret             | Figma personal access token with `file_comments:write` and `file_comments:read` (the same secret `pull-figma` / `apply-to-figma` use; add the comment scopes if it lacks them) |
| `FIGMA_FILE_KEY`             | repo variable           | Plectrum UI Kit file key (default `YNZ1DlSjDNUXrvkxlSp10D`)                                                                                                                    |
| `FIGMA_SYNC_COMMENT_NODE_ID` | repo variable, optional | Id of a frame (e.g. a "Token sync log" frame on the cover page) the thread is pinned to; without it the pin sits at the canvas origin of the first page                        |

Without `FIGMA_TOKEN` the step skips itself. It never blocks the promotion pull request.

Figma writes **from this repo** (Wave 7) never target the main file. They abort if branch `proposals/{app}` is missing.
