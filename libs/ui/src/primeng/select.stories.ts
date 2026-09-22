import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import { statusStory } from '../docs/docs-figure-stories';
import { evidenceStory } from '../storybook/evidence-story';
import { assertTextVisible } from '../storybook/story-tests';
import { primeNgEvidence } from './primeng.evidence';
import { primeNgExample } from './primeng.examples';

const offices = [
  { name: 'Solidaris Brabant', code: '306' },
  { name: 'Solidaris Liège', code: '319' },
  { name: 'Solidaris Wallonie', code: '323' },
];

const meta: Meta = {
  title: 'PrimeNG/Select',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Status = {
  tags: ['!dev'],
  ...statusStory(
    { status: 'core', owner: 'design-system' },
    {
      description:
        'One choice from a list. Stock PrimeNG Select inside Form Field. The panel uses appendTo="body".',
      figmaUrl:
        'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=156-5882',
    },
  ),
};

export const Default: Story = {
  parameters: {
    docs: { source: { code: primeNgExample('select').code, language: 'ts' } },
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Mutualité');
  },
  render: () => ({
    props: { office: null, offices },
    moduleMetadata: { imports: [FormsModule, Select, FormFieldComponent] },
    template: `
      <pds-form-field label="Mutualité" inputId="office-docs">
        <p-select
          inputId="office-docs"
          [(ngModel)]="office"
          [options]="offices"
          optionLabel="name"
          optionValue="code"
          placeholder="Choisissez une mutualité"
          appendTo="body"
          [fluid]="true"
        />
      </pds-form-field>
    `,
  }),
};

export const Filtered: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Commune');
  },
  render: () => ({
    props: {
      city: null,
      cities: ['Bruxelles', 'Charleroi', 'Liège', 'Mons', 'Namur'].map((name) => ({ name })),
    },
    moduleMetadata: { imports: [FormsModule, Select, FormFieldComponent] },
    template: `
      <pds-form-field label="Commune" inputId="city-docs">
        <p-select
          inputId="city-docs"
          [(ngModel)]="city"
          [options]="cities"
          optionLabel="name"
          placeholder="Choisissez une commune"
          [filter]="true"
          filterPlaceholder="Rechercher"
          appendTo="body"
          [fluid]="true"
        />
      </pds-form-field>
    `,
  }),
};

export const Evidence = {
  tags: ['!dev'],
  ...evidenceStory('AA', primeNgEvidence('select')),
};
