# ADR: Repository → Figma via a private plugin

**Date:** 2026-09-10
**Status:** accepted
**Supersedes:** the open choice in `.ai/questions/2026-09-07-repo-to-figma-transport.md`

## Decision

Use a private Figma plugin (`tools/figma-plugin`, Plugin API `figma.variables`) as the live repository → Figma transport on the Organization plan. Keep `tokens:apply`, `tokens:pull-figma`, `apply-to-figma.yml` and `library-publish.yml` parked as the Enterprise alternative.

## Why

Figma's Variables REST API (`file_variables:read` / `file_variables:write`) is Enterprise only. The Plugin API is not plan-gated. A designer with the branch `proposals/{app}` open runs the plugin; writes stay off the main UI Kit file (`YNZ1DlSjDNUXrvkxlSp10D`).

## Consequences

- `tokens:propose` emits a committed, typed `tools/tokens/proposed.dtcg.json`. CI rebuilds it and fails on drift.
- The plugin fetches that file from GitHub (designer-owned fine-grained PAT, Contents: Read, this repository only) and upserts selected tokens into the collection `proposals/{app}`.
- The write is attended. There is no unattended CI write on the Organization plan.
- `tokens:pull-figma` stays parked. Export (branch variables → JSON) is a follow-up, not part of this decision.
- Category-based Figma scopes and an exclude list for documentation-only tokens (`docs/*`, `doc/demo/*`, `token/explorer/*`) are follow-ups.

## References

- Plugin: `tools/figma-plugin/README.md`
- Designer setup: `tools/tokens/PLUGIN_SETUP.md` → "Repo → Figma (Plectrum tokens plugin)"
