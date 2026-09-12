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

| Setting                      | Where                   | Value                                                                                                                                                                                                                                                  |
| ---------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FIGMA_TOKEN`                | repo secret             | Figma personal access token. Comments: `file_comments:read` + `file_comments:write`. Repo→Figma variables: also `file_variables:read` + `file_variables:write` (Enterprise, Full seat). Figma cannot add scopes to an existing token — mint a new one. |
| `FIGMA_FILE_KEY`             | repo variable           | Plectrum UI Kit file key (default `YNZ1DlSjDNUXrvkxlSp10D`)                                                                                                                                                                                            |
| `FIGMA_SYNC_COMMENT_NODE_ID` | repo variable, optional | Id of a frame (e.g. a "Token sync log" frame on the cover page) the thread is pinned to; without it the pin sits at the canvas origin of the first page                                                                                                |

Without `FIGMA_TOKEN` the step skips itself. It never blocks the promotion pull request.

Figma writes **from this repo** never target the main file. `apply-to-figma.yml` lists branches on the main UI Kit (`YNZ1DlSjDNUXrvkxlSp10D`), not `FIGMA_FILE_KEY` (that var is the comment target and may be a Figma branch).

## Repo → Figma (Plectrum tokens plugin)

**Live on the Organization plan.** A private plugin (`tools/figma-plugin`) fetches the committed `tools/tokens/proposed.dtcg.json` from GitHub and upserts selected tokens through `figma.variables`. Decision: `.ai/decisions/2026-09-10-repo-to-figma-plugin.md`. Full install and publish steps: `tools/figma-plugin/README.md`.

### Designer-owned GitHub PAT

- Fine-grained PAT, **this repo only**
- Permissions: **Contents: Read**
- Stored in the plugin (`figma.clientStorage`) on that machine. The UI shows `…last4` only.
- Do not reuse the PrimeUI plugin's Contents **write** token.

### Plugin settings

| Field | Value                                             |
| ----- | ------------------------------------------------- |
| Owner | `solidaris-danielbodigil`                         |
| Repo  | `solidaris-plectrum`                              |
| Path  | `tools/tokens/proposed.dtcg.json`                 |
| Ref   | `main` (or a PR branch)                           |
| App   | suffix of the open Figma branch `proposals/{app}` |

### Guards

- Open the Figma branch `proposals/{app}`. The plugin refuses `figma.fileKey` equal to the main UI Kit (`YNZ1DlSjDNUXrvkxlSp10D`) or undefined.
- Writes only the collection `proposals/{app}`: hidden from publishing, one mode `Value`, `scopes: ALL_SCOPES`, `codeSyntax.WEB = var(--pds-…)`.
- Explicit selection — nothing is selected after fetch. "Select all visible" is an action, not the default.
- Never deletes a variable; never changes `resolvedType`.
- `$type: other` (shadows, gradients, durations, `%`, keywords, unresolved `var()`) appears as skip.

`npm run tokens:propose` regenerates the proposal (typed, deterministic). CI fails if that file is stale.

## Repo → Figma (`tokens:apply`) — Enterprise alternative

**Parked on the Organization plan.** `tokens:apply` and `tokens:pull-figma` use Figma's Variables REST API (`GET …/variables/local`, `POST …/variables`), which Figma offers on the **Enterprise** plan only. The first dry run stopped at the first Variables call with `403 Invalid scope` ([run 34127712582](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/34127712582)). Nothing was written. Use the Plectrum tokens plugin until the org is on Enterprise.

When the Variables API becomes available:

1. Mint a new PAT with `file_variables:read` + `file_variables:write` (plus the comment scopes) and replace `FIGMA_TOKEN`. Scopes cannot be added to an existing token.
2. Create Figma branch **`proposals/scratch`** on the main UI Kit (Full seat). There is no API for branch creation.
3. Run **Apply tokens to Figma** (`workflow_dispatch`) with `only=<one Figma name>`: dry-run first, then `write=true` once the payload looks right. The job writes into the collection `proposals/scratch` on that branch and aborts if the branch is missing. `branch_key` (from the URL `/design/{main}/branch/{key}/`) skips the branch listing when `GET ?branch_data=true` returns none.

The `figma-write` GitHub Environment is the approval gate for real REST writes.
