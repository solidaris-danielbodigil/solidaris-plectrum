import type { Meta, StoryObj } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { statusStory } from '../docs/docs-figure-stories';
import { evidenceStory } from '../storybook/evidence-story';
import { assertTextVisible } from '../storybook/story-tests';
import { primeNgEvidence } from './primeng.evidence';
import { primeNgExample } from './primeng.examples';

const meta: Meta = {
  title: 'PrimeNG/SelectButton',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

const periods = [
  { label: 'Semaine', value: 'week' },
  { label: 'Mois', value: 'month' },
  { label: 'Année', value: 'year' },
];

export const Status = {
  tags: ['!dev'],
  ...statusStory(
    { status: 'core', owner: 'design-system' },
    {
      description:
        'One choice among two or three options on one line. Stock PrimeNG SelectButton with the Plectrum theme.',
      figmaUrl:
        'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=191-6703',
    },
  ),
};

export const Default: Story = {
  parameters: {
    docs: { source: { code: primeNgExample('select-button').code, language: 'ts' } },
  },
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Mois');
  },
  render: () => ({
    props: { period: 'month', periods },
    moduleMetadata: { imports: [FormsModule, SelectButton] },
    template: `
      <p-selectbutton
        [(ngModel)]="period"
        [options]="periods"
        optionLabel="label"
        optionValue="value"
        [allowEmpty]="false"
        ariaLabel="Période"
      />
    `,
  }),
};

export const Views: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Liste');
    await assertTextVisible(canvasElement, 'Grille');
  },
  render: () => ({
    props: {
      view: 'list',
      options: [
        { label: 'Liste', value: 'list', icon: 'bi bi-list' },
        { label: 'Grille', value: 'grid', icon: 'bi bi-grid' },
      ],
    },
    moduleMetadata: { imports: [FormsModule, SelectButton] },
    template: `
      <p-selectbutton
        [(ngModel)]="view"
        [options]="options"
        optionLabel="label"
        optionValue="value"
        [allowEmpty]="false"
        ariaLabel="Affichage"
      />
    `,
  }),
};

export const Evidence = {
  tags: ['!dev'],
  ...evidenceStory('AA', primeNgEvidence('select-button')),
};
