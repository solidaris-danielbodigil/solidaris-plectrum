import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

interface Schema {
  name: string;
  category: 'atoms' | 'molecules' | 'organisms' | 'templates';
  type:
    | 'interactive'
    | 'display'
    | 'container'
    | 'input'
    | 'navigation'
    | 'feedback';
  primeNg?: string;
  /** Team accountable for the component — decides the initial governance status. */
  owner: 'design-system' | 'ishare' | 'icrm';
}

const OWNERS = ['design-system', 'ishare', 'icrm'] as const;

/**
 * Core-team work is `core` from day one. Anything an application team
 * scaffolds starts as a `candidate`: the core team promotes it later or
 * settles it as `app` (docs/component-promotion.md).
 */
function initialStatus(owner: Schema['owner']): 'core' | 'candidate' {
  return owner === 'design-system' ? 'core' : 'candidate';
}

function toFileName(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toClassName(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
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
  // ITCSS naming: _components.{name}.scss, forwarded from _components.core.scss.
  const scssPath = path.join(
    root,
    'libs/styles/src/06-components',
    `_components.${fileName}.scss`,
  );
  const coreScssPath = path.join(
    root,
    'libs/styles/src/06-components',
    '_components.core.scss',
  );
  const indexPath = path.join(root, 'libs/ui/src/index.ts');

  // Component TS — no styleUrl: styles live in libs/styles (ITCSS 06-components).
  writeFile(
    path.join(componentDir, `${fileName}.component.ts`),
    `import { Component } from '@angular/core';

@Component({
  selector: 'pds-${fileName}',
  standalone: true,
  templateUrl: './${fileName}.component.html',
})
export class ${className}Component {}
`,
  );

  // Component HTML
  writeFile(
    path.join(componentDir, `${fileName}.component.html`),
    `<div class="c-${fileName}">
  <!-- ${className} component -->
  <ng-content></ng-content>
</div>
`,
  );

  // No colocated component SCSS — all styles live in the ITCSS layer
  // (libs/styles/src/06-components). The only allowed exception is a :host
  // display rule under ViewEncapsulation, added by hand with a comment.

  // Component Spec — Tester-agent checklist as skeletons (fill or delete the
  // pending cases; a bare "should create" is not enough for review).
  writeFile(
    path.join(componentDir, `${fileName}.component.spec.ts`),
    `import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  // Tester checklist (.cursor/agents/tester.md) — implement what applies:

  it('should render the correct semantic element', () => {
    // e.g. expect(fixture.nativeElement.querySelector('nav')).toBeTruthy();
    pending('TODO: assert the semantic root element');
  });

  it('should apply the BEM host class', () => {
    // e.g. expect(fixture.nativeElement.classList).toContain('c-${fileName}');
    pending('TODO: assert c-${fileName} on the host');
  });

  it('should apply modifier classes from inputs', () => {
    pending('TODO: set an input, assert the --modifier / is-* class');
  });

  it('should emit outputs when triggered', () => {
    pending('TODO: trigger the interaction, assert the output emission');
  });

  it('should project slot content', () => {
    pending('TODO: render with projected content, assert it appears');
  });
});
`,
  );

  // Storybook Story (colocated)
  writeFile(
    path.join(componentDir, `${fileName}.stories.ts`),
    `import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from '../../storybook/story-tests';
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.firstElementChild).toBeTruthy();
  },
};

// TODO: Add stories for all applicable states:
// export const Hover: Story = {};
// export const Disabled: Story = {};
// export const Loading: Story = {};
// export const Error: Story = {};
// export const Empty: Story = {};
`,
  );

  // Metadata Contract
  writeFile(
    path.join(componentDir, `${fileName}.metadata.ts`),
    `import { ComponentMetadata } from '@solidaris/contracts';

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
    scssPath: 'libs/styles/src/06-components/_components.${fileName}.scss',
    created: '${today}',
    modified: '${today}',
  },
  governance: {
    status: '${initialStatus(schema.owner)}',
    owner: '${schema.owner}',${
      schema.owner === 'design-system'
        ? ''
        : `
    note: 'TODO: what the core team needs before promoting this to core.',`
    }
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
      code: \`<(pds|app|lib)-${fileName}></pds-${fileName}>\`,
    },
  ],
};
`,
  );

  // BEM SCSS in styles lib (ITCSS 06-components layer)
  writeFile(
    scssPath,
    `@use '../01-settings/settings.prefix' as *;

// =============================================================================
// 06-components/_components.${fileName}.scss
// c-${fileName} — TODO: one-line purpose.
//
// Design ref:   TODO add Figma node URL
// Token source: libs/styles/src/01-settings/ (add component tokens there first)
// =============================================================================

.c-${fileName} {
  // TODO: var(--#{$pds-prefix}-*) tokens only.
  // Layout (flex, gap, padding, overflow) is o-flex / o-layout in the template.

  // &__element {}
  // &--modifier {}
  // &.is-active {}
}
`,
  );

  // Forward the new partial from the layer barrel so it actually compiles.
  const forwardLine = `@forward 'components.${fileName}';\n`;
  const currentCore = fs.existsSync(coreScssPath)
    ? fs.readFileSync(coreScssPath, 'utf-8')
    : '';
  if (!currentCore.includes(forwardLine.trim())) {
    fs.appendFileSync(coreScssPath, forwardLine, 'utf-8');
    console.log(
      `  updated  libs/styles/src/06-components/_components.core.scss`,
    );
  }

  // Update barrel export
  const exportLine = `export { ${className}Component } from './lib/${fileName}/${fileName}.component';\n`;
  const currentIndex = fs.existsSync(indexPath)
    ? fs.readFileSync(indexPath, 'utf-8')
    : '';
  if (!currentIndex.includes(exportLine)) {
    fs.appendFileSync(indexPath, exportLine, 'utf-8');
    console.log(`  updated  libs/ui/src/index.ts`);
  }

  // Keep the contracts index in sync — no manual step, no stale index.
  console.log('\n🔄 Regenerating .ai/contracts/index.json …');
  execSync('npm run generate-index', { cwd: root, stdio: 'inherit' });

  console.log(`
✅ Component scaffolded: ${className}

Files created:
  libs/ui/src/lib/${fileName}/${fileName}.component.ts          (no styleUrl — styles live in ITCSS)
  libs/ui/src/lib/${fileName}/${fileName}.component.html
  libs/ui/src/lib/${fileName}/${fileName}.component.spec.ts
  libs/ui/src/lib/${fileName}/${fileName}.stories.ts            ← STORYBOOK (colocated)
  libs/ui/src/lib/${fileName}/${fileName}.metadata.ts           ← CONTRACT
  libs/styles/src/06-components/_components.${fileName}.scss    ← BEM STYLES (ITCSS)

_components.core.scss forwards the new partial; .ai/contracts/index.json regenerated.
Commit both with the component.

Governance: status '${initialStatus(schema.owner)}', owner '${schema.owner}'.
${
  schema.owner === 'design-system'
    ? ''
    : `A candidate stays with the ${schema.owner} team until the core team promotes it — file the Storybook page under Patterns/{App}.
`
}
Next steps:
  1. Fill in the .metadata.ts TODOs
  2. Add BEM styles using var(--pds-*) tokens
  3. Complete all Storybook story states
  `);
}

// CLI entry point
async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    }),
  );
}

async function main() {
  const args = process.argv.slice(2);
  const argMap: Record<string, string> = {};
  for (const arg of args) {
    const [k, v] = arg.replace(/^--/, '').split('=');
    if (k && v) argMap[k] = v;
  }

  const name =
    argMap['name'] ||
    (await prompt('Component name (kebab-case, e.g. data-card): '));
  const categoryRaw =
    argMap['category'] ||
    (await prompt(
      'Category [atoms/molecules/organisms/templates] (default: atoms): ',
    ));
  const typeRaw =
    argMap['type'] ||
    (await prompt(
      'Type [interactive/display/container/input/navigation/feedback] (default: display): ',
    ));
  const primeNg = argMap['primeNg'] || '';
  const ownerRaw =
    argMap['owner'] ||
    (await prompt(
      'Owner [design-system/ishare/icrm] (default: design-system): ',
    ));

  const category = (
    ['atoms', 'molecules', 'organisms', 'templates'].includes(categoryRaw)
      ? categoryRaw
      : 'atoms'
  ) as Schema['category'];
  const type = (
    [
      'interactive',
      'display',
      'container',
      'input',
      'navigation',
      'feedback',
    ].includes(typeRaw)
      ? typeRaw
      : 'display'
  ) as Schema['type'];
  const owner = (
    (OWNERS as readonly string[]).includes(ownerRaw) ? ownerRaw : 'design-system'
  ) as Schema['owner'];

  generate({ name, category, type, primeNg: primeNg || undefined, owner });
}

main().catch(console.error);
