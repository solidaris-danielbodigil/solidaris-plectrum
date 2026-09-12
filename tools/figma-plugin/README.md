# Plectrum tokens plugin

Private Figma plugin that reads `tools/tokens/proposed.dtcg.json` from GitHub and upserts
code-owned tokens into the collection `proposals/{app}` on a Figma **branch**. It refuses the
main UI Kit file (`YNZ1DlSjDNUXrvkxlSp10D`).

The Plugin API is not plan-gated. This is the live repository → Figma transport on the
Organization plan. The REST path (`tokens:apply`) stays parked for Enterprise.

## Build

From the workspace root:

```bash
npm run figma-plugin:build
npm run figma-plugin:watch      # rebuild on change
npm run figma-plugin:typecheck
npm run figma-plugin:test
```

`manifest.json` points at `dist/code.js` and `dist/ui.html`. `dist/` is gitignored; CI uploads
`manifest.json` + `dist/` as the `plectrum-figma-plugin` artifact.

## Development install

1. `npm run figma-plugin:build`
2. Figma desktop → Plugins → Development → Import plugin from manifest…
3. Choose `tools/figma-plugin/manifest.json`

The first import registers a plugin `id`. Copy that id into `manifest.json` and commit it so later
publishes update the same plugin. Leave the placeholder `000000000000000000` until then.

## GitHub token (designer-owned)

Create a **fine-grained** personal access token:

- Resource owner / repository: **this repository only**
- Permissions: **Contents: Read** (no write)
- Do not use a classic PAT or org-wide access

In the plugin: GitHub settings → paste the token → Save. It is stored in `figma.clientStorage` on
that machine. The UI only ever shows `…last4`. Rotate on offboarding.

Default fetch target:

| Setting | Value                             |
| ------- | --------------------------------- |
| Owner   | `solidaris-danielbodigil`         |
| Repo    | `solidaris-plectrum`              |
| Path    | `tools/tokens/proposed.dtcg.json` |
| Ref     | `main` (a PR branch is allowed)   |

## Apply

1. In Figma, open the branch `proposals/{app}` (create it once in the UI if missing). Never run this on main.
2. Run **Plectrum tokens**. Confirm the file key is not the main UI Kit.
3. Fetch the proposal. Nothing is selected.
4. Filter, then **Select all visible** (explicit) or tick individual writable rows.
5. **Plan** — create / update / unchanged / skip. Existing variables are never retyped or deleted.
6. **Apply** — writes into `proposals/{app}`, hidden from publishing, mode `Value`, `codeSyntax.WEB = var(--pds-…)`.
7. Review the branch, merge to main, publish the library.

One plugin run is one Figma undo step (Edit → Undo).

## Publish to the organization

Figma desktop → Plugins → Manage plugins → Plectrum tokens → Publish → **Publish to: Organization**.
Organization-plan internal plugins skip Figma's Community review. Any member can publish; only the
original publisher can later change access.

## Guards

- `figma.fileKey` missing or equal to the main file → refuse
- Explicit selection required (no silent all)
- `$type: other` (shadows, gradients, durations, `%`, keywords, unresolved `var()`) → listed as skip
- Never deletes variables; never changes `resolvedType`
