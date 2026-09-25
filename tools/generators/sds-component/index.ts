import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { z } from 'zod';
import {
  componentIdSchema,
  componentMetadataSchema,
} from '../../../.ai/contracts/schema/component.schema';
import { readRegistry } from '../../contracts/validate';
import { inventory } from '../../contracts/inventory';
import { generateContracts } from '../../contracts/generate';

const optionsSchema = z.strictObject({
  name: z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/),
  id: componentIdSchema.optional(),
  owner: z.string().min(1),
  category:
    componentMetadataSchema.shape.component.shape.category.default('atoms'),
  type: componentMetadataSchema.shape.component.shape.type.default('display'),
  primeNg: z.string().optional(),
});
export type Options = z.input<typeof optionsSchema>;

/** Central-repository scaffold. Consumer toolkit initialization is implemented in P2. */
export async function generate(
  options: Options,
  root = process.cwd(),
): Promise<string> {
  const schema = optionsSchema.parse(options);
  const registry = readRegistry(root);
  const team = registry.teams.find((t) => t.id === schema.owner);
  if (!team)
    throw new Error(
      `Unknown owner ${schema.owner}. Registered teams: ${registry.teams.map((t) => t.id).join(', ')}`,
    );
  const name = schema.name;
  const className = name
    .split('-')
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('');
  const id =
    schema.id ?? `${team.kind === 'core' ? 'plectrum' : team.id}:${name}`;
  const existing = await inventory(root);
  if (
    existing.some(
      (i) =>
        i.metadata.component.id === id ||
        i.metadata.component.name === className,
    )
  )
    throw new Error('Component ID or name already exists');
  const folder = `libs/ui/src/lib/${name}`;
  const core = team.kind === 'core';
  const scss = `libs/styles/${core ? 'src' : 'candidates'}/06-components/_components.${name}.scss`;
  const scssBarrel = path.join(
    root,
    'libs/styles/src/06-components/_components.core.scss',
  );
  if (
    fs.existsSync(path.join(root, folder)) ||
    fs.existsSync(path.join(root, scss))
  )
    throw new Error(
      'Scaffold would overwrite existing component or stylesheet',
    );
  if (!fs.existsSync(scssBarrel))
    throw new Error('Run this central scaffold in a Plectrum checkout');
  const date = new Date().toISOString().slice(0, 10);
  const metadata = {
    component: {
      id,
      name: className,
      category: schema.category,
      description: `TODO: Describe ${className}`,
      type: schema.type,
      path: `${folder}/${name}.component.ts`,
      primeNgComponent: schema.primeNg,
      bemBlock: `c-${name}`,
      itcssLayer: '06-components',
      scssPath: scss,
      created: date,
      modified: date,
    },
    distribution: core
      ? {
          kind: 'angular',
          entryPoint: '.',
          exportName: `${className}Component`,
        }
      : { kind: 'local' },
    governance: {
      status: core ? 'core' : 'candidate',
      owner: team.id,
      ...(core
        ? {}
        : {
            note: 'TODO: Record the approved proposal and promotion conditions.',
          }),
    },
    usage: {
      useCases: ['TODO: Describe the need this component covers.'],
      commonPatterns: [],
      antiPatterns: [],
    },
    anatomy: [
      { part: `c-${name}`, role: 'Host containing the projected content.' },
    ],
    props: [],
    accessibility: { wcagLevel: 'AA' },
    tokens: { consumed: [] },
    aiHints: {
      priority: 'medium',
      context: 'TODO: State when to select this component.',
      selectionCriteria: {},
      keywords: [name],
    },
    examples: [
      {
        name: 'Default',
        description: 'Projected content.',
        code: `<pds-${name}>Content</pds-${name}>`,
      },
    ],
  };
  componentMetadataSchema.parse(metadata);
  const files: Record<string, string> = {};
  files[`${folder}/${name}.component.ts`] =
    `import { Component } from '@angular/core';

@Component({ selector: 'pds-${name}', standalone: true, templateUrl: './${name}.component.html' })
export class ${className}Component {}
`;
  files[`${folder}/${name}.component.html`] =
    `<div class="c-${name}"><ng-content /></div>\n`;
  files[`${folder}/index.ts`] = `export * from './${name}.component';\n`;
  files[`${folder}/${name}.metadata.ts`] =
    `import type { ComponentMetadata } from '@solidaris/contracts';\n\nexport const ${className}Metadata: ComponentMetadata = ${JSON.stringify(metadata, null, 2)};\n`;
  files[`${folder}/${name}.component.spec.ts`] =
    `import { TestBed } from '@angular/core/testing';
import { ${className}Component } from './${name}.component';

describe('${className}Component', () => {
  it('renders the documented host', async () => {
    await TestBed.configureTestingModule({ imports: [${className}Component] }).compileComponents();
    const fixture = TestBed.createComponent(${className}Component);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.c-${name}')).not.toBeNull();
  });
  it.todo('Verify the component-specific behavior before review');
});
`;
  files[`${folder}/${name}.stories.ts`] =
    `import type { Meta, StoryObj } from '@storybook/angular-vite';
import { expect } from 'storybook/test';
import { anatomyStory, contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { ${className}Component } from './${name}.component';
import { ${className}Metadata } from './${name}.metadata';

const meta: Meta<${className}Component> = {
  title: ${JSON.stringify(core ? `Custom components/${className}` : `Patterns/${team.label}/${className}`)},
  component: ${className}Component,
  parameters: { ...storyDesign(${className}Metadata.component.figmaUrl) },
  argTypes: argTypesFromProps(${className}Metadata.props ?? []),
};
export default meta;
type Story = StoryObj<${className}Component>;

export const Status = { tags: ['!dev'], ...statusStory(${className}Metadata.governance, ${className}Metadata.component) };
export const Default: Story = {
  render: () => ({ template: '<pds-${name}>Content</pds-${name}>', moduleMetadata: { imports: [${className}Component] } }),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.c-${name}')).toHaveTextContent('Content');
  },
};
export const Anatomy = { tags: ['!dev'], ...anatomyStory(${className}Metadata, Default) };
${['usage', 'patterns', 'examples', 'variants', 'composition', 'behavior', 'accessibility'].map((section) => `export const ${section[0].toUpperCase() + section.slice(1)} = { tags: ['!dev'], ...contractStory(${className}Metadata, '${section}') };`).join('\n')}
`;
  files[`${folder}/${name}.mdx`] =
    `import { Meta, Canvas, Controls, Story, Unstyled } from '@storybook/addon-docs/blocks';
import * as Stories from './${name}.stories';
import { ${className}Metadata as metadata } from './${name}.metadata';

<Meta of={Stories} />

# ${className}

<Unstyled><Story of={Stories.Status} /></Unstyled>

## Default

<Canvas of={Stories.Default} />
<Controls of={Stories.Default} />

## Usage

<Unstyled><Story of={Stories.Usage} /></Unstyled>

## Anatomy

<Unstyled><Story of={Stories.Anatomy} /></Unstyled>

{metadata.usage.commonPatterns.length > 0 && <><h2>Patterns</h2><Unstyled><Story of={Stories.Patterns} /></Unstyled></>}

{metadata.examples.length > 0 && <><h2>Examples</h2><Unstyled><Story of={Stories.Examples} /></Unstyled></>}

{metadata.variants && Object.keys(metadata.variants).length > 0 && <><h2>Variants</h2><Unstyled><Story of={Stories.Variants} /></Unstyled></>}

{metadata.composition && <><h2>Composition</h2><Unstyled><Story of={Stories.Composition} /></Unstyled></>}

{metadata.behavior && <><h2>Behavior</h2><Unstyled><Story of={Stories.Behavior} /></Unstyled></>}

## Accessibility

<Unstyled><Story of={Stories.Accessibility} /></Unstyled>
`;
  files[scss] =
    `@use '${core ? '../01-settings' : '../../src/01-settings'}/settings.prefix' as *;

// TODO: Apply the approved design using var(--#{$pds-prefix}-*) tokens.
// Layout belongs in o-flex / o-layout classes on the template.
.c-${name} {
  // Add only the component's own visual rules.
}
`;
  // All inputs and collisions are validated before the first write.
  const originalBarrel = fs.readFileSync(scssBarrel, 'utf8');
  try {
    for (const [file, content] of Object.entries(files)) {
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.writeFileSync(path.join(root, file), content, { flag: 'wx' });
    }
    if (core)
      fs.writeFileSync(
        scssBarrel,
        originalBarrel.trimEnd() + `\n@forward 'components.${name}';\n`,
      );
    await generateContracts(root);
  } catch (error) {
    for (const file of Object.keys(files))
      fs.rmSync(path.join(root, file), { force: true });
    fs.writeFileSync(scssBarrel, originalBarrel);
    if (fs.existsSync(path.join(root, folder)))
      fs.rmdirSync(path.join(root, folder));
    throw error;
  }
  return id;
}

async function main(): Promise<void> {
  const flags: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    const match = /^--([a-zA-Z]+)=(.+)$/.exec(arg);
    if (
      !match ||
      !['name', 'id', 'category', 'type', 'owner', 'primeNg'].includes(match[1])
    )
      throw new Error(`Unknown argument ${arg}. Use --name=value syntax.`);
    flags[match[1]] = match[2];
  }
  if (!flags['name']) {
    if (!process.stdin.isTTY) throw new Error('--name is required');
    const prompt = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    try {
      flags['name'] = (
        await prompt.question('Component name (kebab-case): ')
      ).trim();
    } finally {
      prompt.close();
    }
  }
  flags['owner'] ??= 'design-system';
  const id = await generate(flags as Options);
  console.log(
    `Created ${id}. Complete metadata TODOs, design and tests; npm run contracts:check rejects unfinished metadata.`,
  );
}
if (require.main === module)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
