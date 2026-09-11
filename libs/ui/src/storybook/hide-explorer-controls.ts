// =============================================================================
// Hide TokenExplorer inputs on consumer Playground stories.
// File-level `component: TokenExplorerComponent` + Vite docgen leaks these
// onto every story in the file. Apply per Playground only — do not change
// TokenExplorer inputs or global docgen.
// =============================================================================

export const EXPLORER_INPUT_NAMES = [
  'category',
  'groups',
  'bundle',
  'nameFilter',
  'stubPrime',
  'view',
] as const;

/** `parameters.controls.exclude` — drops explorer knobs from the Controls panel. */
export const hideExplorerControls = {
  controls: { exclude: [...EXPLORER_INPUT_NAMES] },
} as const;

/** Disable the inherited explorer args so the Inputs table stays empty of them. */
export const hideExplorerArgTypes = Object.fromEntries(
  EXPLORER_INPUT_NAMES.map((name) => [
    name,
    { table: { disable: true }, control: false },
  ]),
);
