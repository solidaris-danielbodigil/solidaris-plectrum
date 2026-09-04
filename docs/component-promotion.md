# Promoting an app component into the design system

1. **Author in the app** only while the API is still moving.
2. **Open a PR in this repo** that adds the generic component to `libs/ui`, styles to `libs/styles` (ITCSS + BEMIT), and a Storybook story. No app-specific logic.
3. **Publish** `@solidaris/ui` (and styles / plectrum if needed) via changesets on merge.
4. **In the app repo**, bump the DS packages (Renovate/Dependabot template in `tools/consumers/`), delete the local copy, and import from `@solidaris/ui`.

There is no cross-repo Storybook aggregation — Storybook stays in this repository (`libs/ui/.storybook/main.ts`).
