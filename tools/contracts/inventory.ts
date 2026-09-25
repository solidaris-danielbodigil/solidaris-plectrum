import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { componentMetadataSchema } from '../../.ai/contracts/schema/component.schema';
import { readRegistry, validateMetadata } from './validate';
import type { ComponentMetadata } from '../../.ai/contracts/schema/component.metadata';

export const posix = (value: string) => value.replaceAll('\\', '/');
export function filesUnder(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? filesUnder(path.join(dir, entry.name))
        : [path.join(dir, entry.name)],
    )
    .sort();
}
export interface InventoryItem {
  metadata: ComponentMetadata;
  metadataPath: string;
  docsPath: string;
  exportSymbol: string;
}
export async function inventory(root: string): Promise<InventoryItem[]> {
  const registry = readRegistry(root);
  const result: InventoryItem[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const file of filesUnder(path.join(root, 'libs/ui/src/lib')).filter(
    (f) => f.endsWith('.metadata.ts'),
  )) {
    // Only trusted source files in this checkout are executable; intake uses validateExchange.
    const module = await import(pathToFileURL(file).href);
    const exports = Object.entries(module).filter(
      ([, value]) => value && typeof value === 'object' && 'component' in value,
    );
    if (exports.length !== 1)
      throw new Error(`${file}: expected exactly one metadata export`);
    const [exportSymbol, value] = exports[0];
    const metadata = componentMetadataSchema.parse(value);
    validateMetadata(metadata, registry);
    if (
      metadata.distribution.kind === 'local' &&
      metadata.component.scssPath?.startsWith('libs/styles/src/')
    )
      throw new Error(
        `${metadata.component.id}: local styles must stay outside the published styles/src tree`,
      );
    if (ids.has(metadata.component.id) || names.has(metadata.component.name))
      throw new Error(
        `Duplicate component ID/name: ${metadata.component.id} / ${metadata.component.name}`,
      );
    ids.add(metadata.component.id);
    names.add(metadata.component.name);
    const metadataPath = posix(path.relative(root, file));
    const docsPath = metadataPath.replace(/\.metadata\.ts$/, '.mdx');
    for (const relative of [
      metadata.component.path,
      docsPath,
      ...(metadata.component.scssPath ? [metadata.component.scssPath] : []),
    ]) {
      const absolute = path.resolve(root, relative);
      if (
        path.isAbsolute(relative) ||
        path.relative(root, absolute).startsWith('..') ||
        !fs.existsSync(absolute)
      )
        throw new Error(
          `${metadata.component.id}: missing or unsafe source ${relative}`,
        );
    }
    if (
      metadata.distribution.kind === 'angular' &&
      !fs.existsSync(path.join(path.dirname(file), 'index.ts'))
    )
      throw new Error(`${metadata.component.id}: missing export barrel`);
    result.push({ metadata, metadataPath, docsPath, exportSymbol });
  }
  for (const { metadata } of result) {
    if (
      metadata.governance.replacementId &&
      !ids.has(metadata.governance.replacementId)
    )
      throw new Error(
        `Unknown replacement ${metadata.governance.replacementId}`,
      );
  }
  return result.sort((a, b) =>
    a.metadata.component.id.localeCompare(b.metadata.component.id, 'en'),
  );
}
