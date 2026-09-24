// =============================================================================
// libs/ui/src/storybook/docs-storybook-index.ts
// Shared "component folder → docs page id" resolver, read once at runtime from
// Storybook's own ./index.json (never hand-copied — rule 10).
//
// Consumers:
//   - docs-contract.component.ts — composition().companions / .nested render
//     as pds-docs-link when the name resolves to a libs/ui component with a
//     docs page, falling back to p-tag (PrimeNG names, e.g. "Tag", "Card").
// =============================================================================

import { ALL_COMPONENT_METADATA } from './component-metadata';

/** Storybook's index.json (v5) — the part needed to find a docs page. */
interface StorybookIndex {
  entries: Readonly<
    Record<string, { id: string; type: string; importPath: string }>
  >;
}

/** `libs/ui/src/lib/icon/icon.component.ts` → `libs/ui/src/lib/icon`. */
export function folderOf(path: string): string {
  return path.replace(/^\.\//, '').replace(/\/[^/]*$/, '');
}

/**
 * Component folder → docs page id, resolved once from Storybook's own
 * `./index.json` (relative to iframe.html, so it resolves in dev and in a
 * static build under a sub-path). Empty map when the index is unavailable —
 * callers fall back to plain text / a non-linked tag.
 */
export async function loadDocsIdsByFolder(): Promise<
  ReadonlyMap<string, string>
> {
  if (typeof fetch !== 'function') return new Map();
  try {
    const response = await fetch('./index.json');
    if (!response.ok) return new Map();
    const storybook = (await response.json()) as StorybookIndex;
    const byFolder = new Map<string, string>();
    for (const entry of Object.values(storybook.entries ?? {})) {
      if (entry.type !== 'docs') continue;
      const folder = folderOf(entry.importPath);
      if (!byFolder.has(folder)) byFolder.set(folder, entry.id);
    }
    return byFolder;
  } catch {
    return new Map();
  }
}

/** `component.name` → `component.path`, for every `libs/ui` component with a `.metadata.ts`. */
const PATH_BY_COMPONENT_NAME: ReadonlyMap<string, string> = new Map(
  ALL_COMPONENT_METADATA.map((metadata) => [
    metadata.component.name,
    metadata.component.path,
  ]),
);

/**
 * Resolves a composition name (e.g. `"Icon"`, `"SubNavShellComponent"`) to its
 * docs page route. Strips a trailing Angular `Component` suffix, matches
 * against `ALL_COMPONENT_METADATA`, and looks the resulting folder up in
 * `docsIdsByFolder`. Returns `null` for PrimeNG names or when Storybook's
 * index has not loaded yet — callers fall back to plain text / `p-tag`.
 */
export function resolveComponentDocsPath(
  name: string,
  docsIdsByFolder: ReadonlyMap<string, string>,
): string | null {
  const bareName = name.replace(/Component$/, '');
  const path = PATH_BY_COMPONENT_NAME.get(bareName);
  if (!path) return null;
  const docsId = docsIdsByFolder.get(folderOf(path));
  return docsId ? `/docs/${docsId}` : null;
}
