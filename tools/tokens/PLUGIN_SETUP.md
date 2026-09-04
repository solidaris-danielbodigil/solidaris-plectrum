# PrimeUI plugin → GitHub (designer-owned settings)

Recorded so engineers can audit what the plugin is allowed to touch.

## GitHub App / PAT

- Fine-grained PAT, **this repo only**
- Permissions: **Contents: Read and write**
- Do not use a classic PAT or org-wide access

## Branch

- Tokens branch: **`design-tokens/sync`**
- **Never `main`**
- If the plugin offers “open a pull request”, enable it; otherwise `tokens-sync.yml` opens the promotion PR from this branch

## Paths

| Field | Value |
|---|---|
| Tokens File | `libs/plectrum/sync/tokens.json` |
| Theme Directory | `libs/plectrum/sync/theme/` |

## Confirmed / expected plugin behaviour

Confirm after the first real sync and update this table:

| Question | Expected | Confirmed |
|---|---|---|
| Direct commit vs PR to `design-tokens/sync` | Direct commit to the tokens branch | _pending first sync_ |
| Overwrite vs merge `tokens.json` | Overwrite the staging file | _pending_ |
| DTCG shape | 7 sets + `$metadata.tokenSetOrder` matching current `src/tokens.json` | _pending_ |
| Theme files | TypeScript PrimeNG preset under `sync/theme/` | _pending_ |

Figma writes **from this repo** (Wave 7) never target the main file. They abort if branch `proposals/{app}` is missing.
