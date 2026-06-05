import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface Schema {
  name: string;
  category: 'atoms' | 'molecules' | 'organisms' | 'templates';
  type: 'interactive' | 'display' | 'container' | 'input' | 'navigation' | 'feedback';
  primeNg?: string;
}

function toFileName(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toClassName(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  created  ${filePath}`);
  } else {
    console.log(`  skipped  ${filePath} (already exists)`);
  }
}

function generate(schema: Schema): void {
  const fileName = toFileName(schema.name);
  const className = toClassName(fileName);
  const today = new Date().toISOString().split('T')[0];
  const root = path.resolve(__dirname, '../../..');

  const componentDir = path.join(root, 'libs/ui/src/lib', fileName);
  const scssPath = path.join(root, 'libs/styles/src/06-components', `_${fileName}.scss`);
  const indexPath = path.join(root, 'libs/ui/src/index.ts');

  // Component TS
  writeFile(path.join(componentDir, `${fileName}.component.ts`), `import { Component } from '@angular/core';

@Component({
  selector: 'sds-${fileName}',
  standalone: true,
  templateUrl: './${fileName}.component.html',
  styleUrl: './${fileName}.component.scss',
})
export class ${className}Component {}
`);

  // Component HTML
  writeFile(path.join(componentDir, `${fileName}.component.html`), `<div class="c-${fileName}">
  <!-- ${className} component -->
  <ng-content></ng-content>
</div>
`);

  // Component SCSS
  writeFile(path.join(componentDir, `${fileName}.component.scss`), `// Styles live in libs/styles/src/06-components/_${fileName}.scss
// This file is intentionally minimal — only component-specific overrides here.
`);

  // Component Spec
  writeFile(path.join(componentDir, `${fileName}.component.spec.ts`), `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${className}Component } from './${fileName}.component';

describe('${className}Component', () => {
  let component: ${className}Component;
  let fixture: ComponentFixture<${className}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${className}Component],
    }).compileComponents();

    fixture = TestBed.createComponent(${className}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
`);

  // Storybook Story (colocated)
  writeFile(path.join(componentDir, `${fileName}.stories.ts`), `import type { Meta, StoryObj } from '@storybook/angular';
import { ${className}Component } from './${fileName}.component';

const meta: Meta<${className}Component> = {
  title: '${schema.category}/${className}',
  component: ${className}Component,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: \`
**${className}** — TODO: describe what this component does.
- Figma: [TODO add Figma node URL]
- PrimeNG: ${schema.primeNg ? `wraps \`${schema.primeNg}\`` : 'custom component'}
        \`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<${className}Component>;

export const Default: Story = {};

// TODO: Add stories for all applicable states:
// export const Hover: Story = {};
// export const Disabled: Story = {};
// export const Loading: Story = {};
// export const Error: Story = {};
// export const Empty: Story = {};
`);

  // Metadata Contract
  writeFile(path.join(componentDir, `${fileName}.metadata.ts`), `import { ComponentMetadata } from '@solidaris/contracts';

export const ${className}Metadata: ComponentMetadata = {
  component: {
    name: '${className}',
    category: '${schema.category}',
    description: 'TODO: Describe ${className}',
    type: '${schema.type}',
    path: 'libs/ui/src/lib/${fileName}/${fileName}.component.ts',
    ${schema.primeNg ? `primeNgComponent: '${schema.primeNg}',` : `primeNgComponent: undefined,`}
    bemBlock: 'c-${fileName}',
    itcssLayer: '06-components',
    scssPath: 'libs/styles/src/06-components/_${fileName}.scss',
    created: '${today}',
    modified: '${today}',
  },
  usage: {
    useCases: [],
    commonPatterns: [],
    antiPatterns: [],
  },
  accessibility: {
    wcagLevel: 'AA',
  },
  tokens: {
    consumed: [],
  },
  aiHints: {
    priority: 'medium',
    context: 'TODO: When should an agent use this component?',
    selectionCriteria: {},
    keywords: ['${fileName}'],
  },
  examples: [
    {
      name: 'default',
      description: 'Default ${className}',
      code: \`<sds-${fileName}></sds-${fileName}>\`,
    },
  ],
};
`);

  // BEM SCSS in styles lib
  writeFile(scssPath, `@use '../01-settings/prefix' as *;

// =============================================================================
// 06-components/_${fileName}.scss
// BEM block: c-${fileName}
// Design ref: TODO add Figma node URL
// =============================================================================

.c-${fileName} {
  // TODO: Add styles using var(--#{$sds-prefix}-*) tokens

  // &__element {}
  // &--modifier {}
  // &.is-active {}
}
`);

  // Update barrel export
  const exportLine = `export { ${className}Component } from './lib/${fileName}/${fileName}.component';\n`;
  const currentIndex = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf-8') : '';
  if (!currentIndex.includes(exportLine)) {
    fs.appendFileSync(indexPath, exportLine, 'utf-8');
    console.log(`  updated  libs/ui/src/index.ts`);
  }

  console.log(`
✅ Component scaffolded: ${className}

Files created:
  libs/ui/src/lib/${fileName}/${fileName}.component.ts
  libs/ui/src/lib/${fileName}/${fileName}.component.html
  libs/ui/src/lib/${fileName}/${fileName}.component.scss
  libs/ui/src/lib/${fileName}/${fileName}.component.spec.ts
  libs/ui/src/lib/${fileName}/${fileName}.stories.ts          ← STORYBOOK (colocated)
  libs/ui/src/lib/${fileName}/${fileName}.metadata.ts         ← CONTRACT
  libs/styles/src/06-components/_${fileName}.scss             ← BEM STYLES

Next steps:
  1. Fill in the .metadata.ts TODOs
  2. Add BEM styles using var(--sds-*) tokens
  3. Complete all Storybook story states
  4. Run: npm run generate-index
  `);
}

// CLI entry point
async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

async function main() {
  const args = process.argv.slice(2);
  const argMap: Record<string, string> = {};
  for (const arg of args) {
    const [k, v] = arg.replace(/^--/, '').split('=');
    if (k && v) argMap[k] = v;
  }

  const name = argMap['name'] || await prompt('Component name (kebab-case, e.g. data-card): ');
  const categoryRaw = argMap['category'] || await prompt('Category [atoms/molecules/organisms/templates] (default: atoms): ');
  const typeRaw = argMap['type'] || await prompt('Type [interactive/display/container/input/navigation/feedback] (default: display): ');
  const primeNg = argMap['primeNg'] || '';

  const category = (['atoms', 'molecules', 'organisms', 'templates'].includes(categoryRaw) ? categoryRaw : 'atoms') as Schema['category'];
  const type = (['interactive', 'display', 'container', 'input', 'navigation', 'feedback'].includes(typeRaw) ? typeRaw : 'display') as Schema['type'];

  generate({ name, category, type, primeNg: primeNg || undefined });
}

main().catch(console.error);
