import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { posix, type InventoryItem } from './inventory';

/** Check the source graph before packaging; private imports must not smuggle a candidate into Core. */
export function checkBoundaries(
  root: string,
  items: InventoryItem[],
  barrels: Map<string, string>,
  outputs: Map<string, string>,
  packageName: string,
): void {
  const exists = (file: string) =>
    outputs.has(file) || fs.existsSync(path.join(root, file));
  const read = (file: string) =>
    outputs.get(file) ?? fs.readFileSync(path.join(root, file), 'utf8');
  const resolve = (from: string, specifier: string): string | undefined => {
    if (specifier === packageName) return barrels.get('.');
    if (specifier.startsWith(packageName + '/'))
      return barrels.get('.' + specifier.slice(packageName.length));
    if (!specifier.startsWith('.')) return undefined;
    const base = posix(
      path.normalize(path.join(path.dirname(from), specifier)),
    );
    return [base + '.ts', base + '/index.ts', base].find(
      (f) => exists(f) && f.endsWith('.ts'),
    );
  };
  for (const [entry, barrel] of barrels) {
    const seen = new Set<string>();
    const visit = (file: string) => {
      if (seen.has(file)) return;
      seen.add(file);
      if (file.endsWith('.metadata.ts'))
        throw new Error(`Runtime entry ${entry} reaches metadata ${file}`);
      const item = items.find((i) =>
        file.startsWith(posix(path.dirname(i.metadataPath)) + '/'),
      );
      if (item) {
        const distribution = item.metadata.distribution;
        if (
          distribution.kind === 'local' ||
          (distribution.kind === 'angular' &&
            distribution.entryPoint !== '.' &&
            distribution.entryPoint !== entry)
        )
          throw new Error(
            `Package boundary violation: ${entry} reaches ${item.metadata.component.id}`,
          );
      }
      const ast = ts.createSourceFile(
        file,
        read(file),
        ts.ScriptTarget.Latest,
        true,
      );
      for (const node of ast.statements) {
        if (!ts.isImportDeclaration(node) && !ts.isExportDeclaration(node))
          continue;
        if (!node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier))
          continue;
        const target = resolve(file, node.moduleSpecifier.text);
        if (target) visit(target);
      }
    };
    visit(barrel);
  }
}
