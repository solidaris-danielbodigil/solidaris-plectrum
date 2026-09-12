# Repository → Figma transport: custom plugin or Enterprise plan?

**Raised by:** first repo → Figma dry run (`Apply tokens to Figma`, 2026-09-07)
**Status:** decided — Option A (private Figma plugin) on the Organization plan. See `.ai/decisions/2026-09-10-repo-to-figma-plugin.md`.

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

## Decision

**Option A.** The Plectrum tokens plugin (`tools/figma-plugin`) writes `proposed.dtcg.json` into
the collection `proposals/{app}` through `figma.variables`. A designer runs it with that Figma
branch open. The REST scripts and workflows stay parked as the Enterprise path (Option B).

## What remains parked

- `Apply tokens to Figma` and `Figma library publish` still stop at the first Variables REST call.
  Do not expect them to write until the org is on Enterprise and a new `FIGMA_TOKEN` carries
  `file_variables:*`.
- Export (branch variables → JSON, the `tokens:pull-figma` replacement) is not in the plugin yet.
