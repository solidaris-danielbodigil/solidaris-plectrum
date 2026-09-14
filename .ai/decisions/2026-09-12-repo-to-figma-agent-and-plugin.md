# ADR: Agent-first repo → Figma; plugin as fallback

**Date:** 2026-09-12
**Status:** accepted
**Supplements:** `.ai/decisions/2026-09-10-repo-to-figma-plugin.md`

## Decision

On the Organization plan, repository → Figma uses the Plugin API (`figma.variables` and the rest of the Plugin API). Two attended front doors share that API:

1. **Agent + Figma MCP** (`use_figma`) — default when an agent session is running. Upsert selected tokens from `proposed.dtcg.json`. After a candidate is promoted to `core`, the same session may build the Figma component from the repo (variables first, then frames bound to those variables).
2. **Plectrum tokens plugin** — fallback when no agent is available. Tokens only: fetch, select, apply on `proposals/{app}`.
3. **A human** may still draw the Figma component by hand instead of the agent. Both are valid.

Same guards as the plugin: branch `proposals/{app}` only, never the main UI Kit (`YNZ1DlSjDNUXrvkxlSp10D`), explicit selection, no retype or delete, values from the typed proposal — not guessed hex. Creating the Figma branch and publishing the library stay human. There is still no unattended CI write.

`tokens:apply` and `tokens:pull-figma` stay parked (Enterprise REST).

## Why

The 2026-09-10 decision chose the Plugin API over Enterprise REST. Figma MCP is the same API, so an agent does not need the plugin as a hop. The plugin remains so a designer without an agent session can still apply tokens.

## Consequences

- `proposed.dtcg.json` stays the catalog. Selection is still explicit (the agent names the tokens, or a person ticks rows).
- After core promotion, the Figma component is designed from the repo: bind variables. A Storybook capture is a visual check only — it is not the library component.
- Promotion still moves tokens from `proposals/{app}` into Component or Semantic before publish.
- One write path per change: agent or plugin, not both.

## References

- Plugin: `tools/figma-plugin/README.md`
- Designer setup: `tools/tokens/PLUGIN_SETUP.md`
- Storybook: Docs → Token pipeline → Figma sync
