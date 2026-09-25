// Stable component identity → metadata's MDX source → Storybook's runtime docs ID.
// Names are supported only for legacy composition references in existing metadata.
import { ALL_COMPONENT_METADATA, COMPONENT_SOURCES } from './component-metadata';

export const normalizeDocsSource = (source: string) =>
  source.replaceAll('\\', '/').replace(/^\.\//, '');

export interface StorybookIndex {
  entries: Readonly<Record<string, { id: string; type: string; importPath: string }>>;
}

/** Match complete MDX source paths: two docs in one folder must stay distinct. */
export function docsIdsFromIndex(index: StorybookIndex): ReadonlyMap<string, string> {
  const bySource = new Map<string, string>();
  for (const entry of Object.values(index.entries ?? {})) {
    if (entry.type !== 'docs') continue;
    const source = normalizeDocsSource(entry.importPath);
    if (bySource.has(source)) throw new Error(`Ambiguous Storybook docs source: ${source}`);
    bySource.set(source, entry.id);
  }
  return bySource;
}

export async function loadDocsIdsBySource(): Promise<ReadonlyMap<string, string>> {
  if (typeof fetch !== 'function') return new Map();
  try {
    const response = await fetch('./index.json');
    return response.ok ? docsIdsFromIndex(await response.json() as StorybookIndex) : new Map();
  } catch {
    return new Map();
  }
}

const ID_BY_NAME = new Map(ALL_COMPONENT_METADATA.map(metadata => [metadata.component.name, metadata.component.id]));

export function resolveComponentDocsPath(
  idOrName: string,
  docsIdsBySource: ReadonlyMap<string, string>,
): string | null {
  const id = COMPONENT_SOURCES[idOrName] ? idOrName : ID_BY_NAME.get(idOrName.replace(/Component$/, ''));
  const source = id ? COMPONENT_SOURCES[id]?.docs : undefined;
  const docsId = source ? docsIdsBySource.get(normalizeDocsSource(source)) : undefined;
  return docsId ? `/docs/${docsId}` : null;
}
