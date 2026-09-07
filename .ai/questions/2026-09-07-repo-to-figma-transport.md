# Repository → Figma transport: custom plugin or Enterprise plan?

**Raised by:** first repo → Figma dry run (`Apply tokens to Figma`, 2026-09-07)
**Status:** open — repository → Figma and the `tokens:pull-figma` safety net are parked; Figma → repository is live

## Context

`tokens:apply` and `tokens:pull-figma` use Figma's Variables REST API
(`GET /v1/files/:key/variables/local`, `POST /v1/files/:key/variables`). Figma offers that API on
the **Enterprise** plan only. Solidaris is on the **Organization** plan:

- The personal-access-token dialog does not list `file_variables:read` / `file_variables:write`.
  All other file scopes were already on the token.
- [Run 34127712582](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/34127712582)
  stopped at the first GET with `403 Invalid scope … This endpoint requires the file_variables:read scope`.
  Nothing was written.

Figma → repository is unaffected: the PrimeUI plugin's GitHub sync and the comment thread
(`file_comments:*`) need no Variables scope.

Built and waiting: `tools/tokens/apply-to-figma.mjs` (real Variables payload, `--only` required,
branch-only, dry-run default, refuses the main file key), `.github/workflows/apply-to-figma.yml`
(`figma-write` environment), `library-publish.yml` → `tokens:pull-figma`.

## Options

### A. Custom Figma plugin (works on the Organization plan)

A small private plugin, published to the Solidaris organization, run by a designer with the branch
`proposals/{app}` open. It reads `proposed.dtcg.json` (pasted, or fetched from GitHub) and
creates/updates variables through `figma.variables`. The Plugin API is not plan-gated.

- Keeps branch-only writes and the designer review in Figma. No licence change.
- Not unattended: a person runs it. `apply-to-figma.yml` stays parked.
- New code to own: manifest and UI, DTCG → variable mapping (colours first), private publishing,
  keeping pace with the propose output.
- Does not restore `tokens:pull-figma`; the same plugin would have to export the branch's
  variables instead.

### B. Enterprise plan

Unlocks `file_variables:read/write` on personal access tokens. Everything already built runs as
designed after a new `FIGMA_TOKEN` with those scopes (scopes cannot be added to an existing token)
and the Figma branch `proposals/scratch` created in the UI.

- Unattended CI with two review gates: the GitHub `figma-write` environment and the Figma branch
  review.
- Licensing decision outside the design-system team.

## Until decided

- Repo → Figma is one-way in practice. `tokens:propose` remains the list of code-owned tokens
  missing from Figma; a designer who needs one in the UI Kit creates it on the branch by hand with
  the proposed name.
- `Apply tokens to Figma` and `Figma library publish` stop at the first Variables call. Do not
  expect them to write.
- Documented in Storybook (Docs / Token pipeline and Figma sync), `tools/tokens/README.md`,
  `tools/tokens/PLUGIN_SETUP.md`.

## Decision needed from

Design-system owner (option A) or whoever owns Figma licensing (option B).
