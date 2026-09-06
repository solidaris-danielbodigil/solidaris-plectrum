/**
 * generate-index.ts
 *
 * Scans libs/ui for Angular components, parses their imports to build
 * a relationship graph, and outputs .ai/contracts/index.json.
 *
 * Run: npm run generate-index   (tsx tools/scripts/generate-index.ts)
 *
 * Output is content-stable: meta.generated only advances when the index
 * content actually changed, so CI can gate staleness with
 * `npm run generate-index && git diff --exit-code -- .ai/contracts/index.json`
 * and repeated runs (editor hooks, scaffolder) never produce diff churn.
 *
 * Dependencies: fs, path (tsx already in devDeps)
 */

import * as fs from 'fs';
import * as path from 'path';

const WORKSPACE_ROOT = path.resolve(__dirname, '../../');
const UI_LIB_PATH = path.join(WORKSPACE_ROOT, 'libs/ui/src/lib');
const OUTPUT_PATH = path.join(WORKSPACE_ROOT, '.ai/contracts/index.json');

interface ComponentEntry {
  path: string;
  category: string;
  /** governance.status from .metadata.ts — core | candidate | app | deprecated */
  status: string | null;
  /** governance.owner from .metadata.ts — design-system | ishare | icrm */
  owner: string | null;
  metadata: boolean;
  bemBlock: string | null;
  primeNg: string | null;
  scssPath: string | null;
  uses: string[];
  usedBy: string[];
}

interface IndexFile {
  meta: {
    generated: string;
    framework: string;
    componentLibrary: string;
    designSystem: string;
    prefix: string;
    baseRemPx: number;
  };
  workspace: {
    apps: { name: string; path: string }[];
    libs: { name: string; path: string; purpose: string }[];
  };
  tokenArchitecture: unknown;
  components: Record<string, ComponentEntry>;
  relationships: Record<string, { uses: string[]; usedBy: string[] }>;
  summary: {
    totalComponents: number;
    componentsWithMetadata: number;
    relationshipsMapped: number;
    tokenFiles: number;
    primeNgMappings: number;
    /** Component count per governance.status; `undeclared` = no governance block */
    byStatus: Record<string, number>;
  };
}

function findComponents(dir: string): Map<string, string> {
  const components = new Map<string, string>();

  if (!fs.existsSync(dir)) {
    console.log(`⚠ libs/ui/src/lib does not exist yet. Index will be empty.`);
    return components;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const componentDir = path.join(dir, entry.name);
      const componentFile = fs.readdirSync(componentDir).find(
        (f: string) => f.endsWith('.component.ts') && !f.endsWith('.spec.ts')
      );
      if (componentFile) {
        const name = toPascalCase(entry.name.replace('.component', ''));
        components.set(name, path.join(componentDir, componentFile));
      }
      // Recurse one level deeper
      const subDirs = fs.readdirSync(componentDir, { withFileTypes: true }).filter((d: { isDirectory: () => boolean }) => d.isDirectory());
      for (const sub of subDirs) {
        const subPath = path.join(componentDir, sub.name);
        const subFile = fs.readdirSync(subPath).find(
          (f: string) => f.endsWith('.component.ts') && !f.endsWith('.spec.ts')
        );
        if (subFile) {
          const name = toPascalCase(sub.name.replace('.component', ''));
          components.set(name, path.join(subPath, subFile));
        }
      }
    }
  }

  return components;
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function extractImports(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const imports: string[] = [];

  // Match: import { X } from '../something/something.component';
  const importRegex = /import\s*\{[^}]*\}\s*from\s*['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.includes('.component') || importPath.includes('/lib/')) {
      // Extract component name from path
      const segments = importPath.split('/');
      const last = segments[segments.length - 1].replace('.component', '');
      imports.push(toPascalCase(last));
    }
  }

  // Match template usage: <pds-component-name or <app-component-name
  const templatePath = filePath.replace('.component.ts', '.component.html');
  if (fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const tagRegex = /<(pds|app|lib)-([a-z-]+)/g;
    while ((match = tagRegex.exec(template)) !== null) {
      imports.push(toPascalCase(match[2]));
    }
  }

  return [...new Set(imports)];
}

function hasMetadata(componentPath: string): boolean {
  const dir = path.dirname(componentPath);
  return fs.readdirSync(dir).some((f: string) => f.endsWith('.metadata.ts'));
}

/**
 * Read a field from the colocated .metadata.ts file using a simple regex.
 * Avoids a full TS parse — sufficient for string literal values.
 */
function readMetadataField(componentPath: string, field: string): string | null {
  const dir = path.dirname(componentPath);
  const metaFile = fs.readdirSync(dir).find((f: string) => f.endsWith('.metadata.ts'));
  if (!metaFile) return null;
  const content = fs.readFileSync(path.join(dir, metaFile), 'utf-8');
  const match = content.match(new RegExp(`${field}:\\s*['"]([^'"]+)['"]`));
  return match ? match[1] : null;
}

/**
 * Read `status` / `owner` from the `governance: { … }` block only, so a prop
 * named "status" elsewhere in the file cannot be mistaken for it.
 */
function readGovernanceField(componentPath: string, field: 'status' | 'owner'): string | null {
  const dir = path.dirname(componentPath);
  const metaFile = fs.readdirSync(dir).find((f: string) => f.endsWith('.metadata.ts'));
  if (!metaFile) return null;
  const content = fs.readFileSync(path.join(dir, metaFile), 'utf-8');
  const block = content.match(/governance:\s*\{([^}]*)\}/);
  if (!block) return null;
  const match = block[1].match(new RegExp(`\\b${field}:\\s*['"]([a-z-]+)['"]`));
  return match ? match[1] : null;
}

function detectBemBlock(componentPath: string): string | null {
  // Prefer metadata file (source of truth) over SCSS scanning.
  const fromMeta = readMetadataField(componentPath, 'bemBlock');
  if (fromMeta) return fromMeta;

  // Fallback: scan the ITCSS component SCSS file.
  const componentName = path.basename(path.dirname(componentPath));
  const scssFile = path.join(
    WORKSPACE_ROOT,
    `libs/styles/src/06-components/_components.${componentName}.scss`
  );
  if (!fs.existsSync(scssFile)) return null;
  const content = fs.readFileSync(scssFile, 'utf-8');
  const match = content.match(/\.(c-[a-z][a-z0-9-]*)\s*\{/);
  return match ? match[1] : null;
}

function detectPrimeNg(componentPath: string): string | null {
  if (!fs.existsSync(componentPath)) return null;
  const content = fs.readFileSync(componentPath, 'utf-8');
  const match = content.match(/from\s*['"]primeng\/([a-z]+)['"]/);
  return match ? toPascalCase(match[1]) : null;
}

function getCategory(componentPath: string): string {
  // Read from metadata (source of truth).
  const fromMeta = readMetadataField(componentPath, 'category');
  if (fromMeta) return fromMeta;

  // Fallback: infer from folder structure.
  const relativePath = path.relative(UI_LIB_PATH, componentPath);
  if (relativePath.includes('atoms/') || relativePath.includes('atom/')) return 'atoms';
  if (relativePath.includes('molecules/') || relativePath.includes('molecule/')) return 'molecules';
  if (relativePath.includes('organisms/') || relativePath.includes('organism/')) return 'organisms';
  if (relativePath.includes('templates/') || relativePath.includes('template/')) return 'templates';
  return 'uncategorized';
}

function findScssPath(componentPath: string): string | null {
  // Prefer metadata scssPath field.
  const fromMeta = readMetadataField(componentPath, 'scssPath');
  if (fromMeta) return fromMeta;

  // Fallback: look for _components.{name}.scss in ITCSS layer.
  const componentName = path.basename(path.dirname(componentPath));
  const itcssFile = `libs/styles/src/06-components/_components.${componentName}.scss`;
  return fs.existsSync(path.join(WORKSPACE_ROOT, itcssFile)) ? itcssFile : null;
}

function generate(): void {
  console.log('🔍 Scanning libs/ui for components...');

  const components = findComponents(UI_LIB_PATH);
  console.log(`   Found ${components.size} component(s)`);

  // Read existing index to preserve workspace/tokenArchitecture config
  let existingIndex: IndexFile | null = null;
  if (fs.existsSync(OUTPUT_PATH)) {
    existingIndex = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
  }

  const componentEntries: Record<string, ComponentEntry> = {};
  const relationships: Record<string, { uses: string[]; usedBy: string[] }> = {};

  // First pass: register all components
  for (const [name, filePath] of components) {
    // Forward slashes regardless of OS — the committed index must not depend
    // on whether it was generated on Windows or in CI.
    const relativePath = path.relative(WORKSPACE_ROOT, filePath).split(path.sep).join('/');
    componentEntries[name] = {
      path: relativePath,
      category: getCategory(filePath),
      status: readGovernanceField(filePath, 'status'),
      owner: readGovernanceField(filePath, 'owner'),
      metadata: hasMetadata(filePath),
      bemBlock: detectBemBlock(filePath),
      primeNg: detectPrimeNg(filePath),
      scssPath: findScssPath(filePath),
      uses: [],
      usedBy: [],
    };
    relationships[name] = { uses: [], usedBy: [] };
  }

  // Second pass: build relationship graph
  for (const [name, filePath] of components) {
    const imports = extractImports(filePath);
    const validImports = imports.filter((i) => components.has(i) && i !== name);
    componentEntries[name].uses = validImports;
    relationships[name].uses = validImports;

    for (const imported of validImports) {
      if (componentEntries[imported]) {
        componentEntries[imported].usedBy.push(name);
        relationships[imported].usedBy.push(name);
      }
    }
  }

  // Count relationships
  let totalRelationships = 0;
  for (const rel of Object.values(relationships)) {
    totalRelationships += rel.uses.length + rel.usedBy.length;
  }

  // Count PrimeNG mappings
  const primeNgMappings = Object.values(componentEntries).filter((c) => c.primeNg).length;

  // Governance status distribution — sorted keys keep the output stable.
  const byStatus: Record<string, number> = {};
  for (const entry of Object.values(componentEntries)) {
    const key = entry.status ?? 'undeclared';
    byStatus[key] = (byStatus[key] ?? 0) + 1;
  }
  const byStatusSorted = Object.fromEntries(
    Object.entries(byStatus).sort(([a], [b]) => a.localeCompare(b)),
  );

  // Build output
  const output: IndexFile = {
    meta: {
      generated: new Date().toISOString(),
      framework: 'angular',
      componentLibrary: 'primeng',
      designSystem: 'plectrum',
      prefix: 'pds',
      baseRemPx: 14,
    },
    workspace: existingIndex?.workspace ?? {
      apps: [
        { name: 'ishare', path: 'apps/ishare' },
        { name: 'icrm', path: 'apps/icrm' },
      ],
      libs: [
        { name: 'ui', path: 'libs/ui', purpose: 'Shared Angular components (SSOT)' },
        { name: 'styles', path: 'libs/styles', purpose: 'SCSS/ITCSS tokens and utilities (SSOT)' },
        { name: 'plectrum', path: 'libs/plectrum', purpose: 'PrimeNG theme preset integration' },
      ],
    },
    tokenArchitecture: existingIndex?.tokenArchitecture ?? {
      prefix: '--pds-*',
      prefixConfig: 'libs/styles/src/01-settings/_settings.prefix.scss',
      layers: {
        primitive: {
          files: [
            'libs/styles/src/01-settings/_settings.colors-primitive.scss',
            'libs/styles/src/01-settings/_settings.typography-primitive.scss',
          ],
          pattern: '--pds-{category}-{palette}-{shade}',
        },
        semantic: {
          files: [
            'libs/styles/src/01-settings/_settings.colors-semantic.scss',
            'libs/styles/src/01-settings/_settings.typography-semantic.scss',
            'libs/styles/src/01-settings/_settings.spacing.scss',
            'libs/styles/src/01-settings/_settings.radius.scss',
            'libs/styles/src/01-settings/_settings.shadows.scss',
            'libs/styles/src/01-settings/_settings.transitions.scss',
            'libs/styles/src/01-settings/_settings.focus.scss',
            'libs/styles/src/01-settings/_settings.globals.scss',
          ],
          pattern: '--pds-{category}-{role}',
        },
        component: {
          files: ['libs/styles/src/06-components/_components.*.scss'],
          pattern: '--p-{component}-{property} mapped from --pds-*',
        },
      },
    },
    components: componentEntries,
    relationships,
    summary: {
      totalComponents: components.size,
      componentsWithMetadata: Object.values(componentEntries).filter((c) => c.metadata).length,
      relationshipsMapped: totalRelationships,
      tokenFiles: 11,
      primeNgMappings,
      byStatus: byStatusSorted,
    },
  };

  // Content-stable write: ignore meta.generated when comparing, keep the old
  // timestamp (and skip the write) when nothing else changed.
  const comparable = (index: IndexFile): string =>
    JSON.stringify({ ...index, meta: { ...index.meta, generated: '' } });

  if (existingIndex && comparable(existingIndex) === comparable(output)) {
    console.log(`✅ Index up to date — .ai/contracts/index.json unchanged`);
    console.log(`   Components: ${output.summary.totalComponents}`);
    return;
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`✅ Index written to .ai/contracts/index.json`);
  console.log(`   Components: ${output.summary.totalComponents}`);
  console.log(`   With metadata: ${output.summary.componentsWithMetadata}`);
  console.log(`   Relationships: ${output.summary.relationshipsMapped}`);
  console.log(`   By status: ${JSON.stringify(output.summary.byStatus)}`);
}

generate();
