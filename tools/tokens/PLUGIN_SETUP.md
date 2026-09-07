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
| `FIGMA_TOKEN`                | repo secret             | Figma personal access token. Comments: `file_comments:read` + `file_comments:write`. Repo→Figma variables: also `file_variables:read` + `file_variables:write` (Enterprise, Full seat). Figma cannot add scopes to an existing token — mint a new one. |
| `FIGMA_FILE_KEY`             | repo variable           | Plectrum UI Kit file key (default `YNZ1DlSjDNUXrvkxlSp10D`)                                                                                                                    |
| `FIGMA_SYNC_COMMENT_NODE_ID` | repo variable, optional | Id of a frame (e.g. a "Token sync log" frame on the cover page) the thread is pinned to; without it the pin sits at the canvas origin of the first page                        |

Without `FIGMA_TOKEN` the step skips itself. It never blocks the promotion pull request.

Figma writes **from this repo** never target the main file. `apply-to-figma.yml` lists branches on the main UI Kit (`YNZ1DlSjDNUXrvkxlSp10D`), not `FIGMA_FILE_KEY` (that var is the comment target and may be a Figma branch).

## Repo → Figma (`tokens:apply`) — parked

**Status 2026-09-07: not available on the Organization plan.** `tokens:apply` and the `tokens:pull-figma` safety net use Figma's Variables REST API (`GET …/variables/local`, `POST …/variables`), which Figma offers on the **Enterprise** plan only. The token dialog shows no `file_variables:*` scope, and the first dry run stopped at the first Variables call with `403 Invalid scope … requires the file_variables:read scope` before anything was written ([run 34127712582](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/34127712582)). Figma → repo is unaffected: the plugin sync and the comment thread need no Variables scope.

Open decision — `.ai/questions/2026-09-07-repo-to-figma-transport.md`:

| Option                                                    | What it unlocks                                                                                            | What stays manual                                                              |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| A. Custom Figma plugin (Plugin API, `figma.variables`)    | Writing `proposed.dtcg.json` into the collection `proposals/{app}` on the Organization plan                | A designer runs it with the branch open; we build and maintain the plugin      |
| B. Enterprise plan                                        | `file_variables:read/write` on a PAT → `apply-to-figma.yml` and `library-publish.yml` run as built         | Creating the Figma branch (no API); a new PAT with the Variables scopes        |

Until then code-owned tokens stay code-only. `tokens:propose` lists what the UI Kit lacks; a designer who needs one of them in Figma creates it on the branch `proposals/{app}` by hand, with the proposed name (e.g. `color/surface/75`).

When the Variables API becomes available:

1. Mint a new PAT with `file_variables:read` + `file_variables:write` (plus the comment scopes) and replace `FIGMA_TOKEN`. Scopes cannot be added to an existing token.
2. Create Figma branch **`proposals/scratch`** on the main UI Kit (Full seat). There is no API for branch creation.
3. Run **Apply tokens to Figma** (`workflow_dispatch`) with `only=<one Figma name>`: dry-run first, then `write=true` once the payload looks right. The job writes into the collection `proposals/scratch` on that branch and aborts if the branch is missing. `branch_key` (from the URL `/design/{main}/branch/{key}/`) skips the branch listing when `GET ?branch_data=true` returns none.

The `figma-write` GitHub Environment is the approval gate for real writes.
