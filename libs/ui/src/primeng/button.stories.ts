// PrimeNG/Button — control page. Stock p-button themed by providePlectrum();
// the page owns the Solidaris rules for using it. Theme proof stays on
// PrimeNG/Actions.
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Button } from 'primeng/button';
import { statusStory } from '../docs/docs-figure-stories';
import { evidenceStory } from '../storybook/evidence-story';
import { assertRoleVisible, expect } from '../storybook/story-tests';
import { ACTIONS_API } from './gallery-arg-types';
import { primeNgEvidence } from './primeng.evidence';
import { primeNgExample } from './primeng.examples';

const ROW =
  'o-flex o-flex--row-wrap o-flex--align-items-center o-layout o-layout--gap-2';

interface ButtonArgs {
  label: string;
  severity:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast';
  outlined: boolean;
  text: boolean;
  size: 'small' | 'large' | undefined;
  disabled: boolean;
  loading: boolean;
}

const meta: Meta<ButtonArgs> = {
  title: 'PrimeNG/Button',
  parameters: { layout: 'padded' },
  argTypes: {
    ...(ACTIONS_API as Meta['argTypes']),
    label: { control: 'text', table: { category: 'PrimeNG' } },
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'contrast'],
      table: { category: 'PrimeNG' },
    },
    outlined: { control: 'boolean', table: { category: 'PrimeNG' } },
    text: { control: 'boolean', table: { category: 'PrimeNG' } },
    size: {
      control: 'select',
      options: [undefined, 'small', 'large'],
      table: { category: 'PrimeNG' },
    },
    disabled: { control: 'boolean', table: { category: 'PrimeNG' } },
    loading: { control: 'boolean', table: { category: 'PrimeNG' } },
  },
  args: {
    label: 'Enregistrer',
    severity: 'primary',
    outlined: false,
    text: false,
    size: undefined,
    disabled: false,
    loading: false,
  },
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const Status = {
  tags: ['!dev'],
  ...statusStory(
    { status: 'core', owner: 'design-system' },
    {
      description:
        'The action control. Stock PrimeNG Button with the Plectrum theme; no Angular wrapper. This page holds the Solidaris rules for choosing and naming it.',
      figmaUrl:
        'https://www.figma.com/design/wjMnb8GsK8bVKA7UreOJ4L/Plectrum-DS--PrimeNG-v21-?node-id=10-125',
    },
  ),
};

/** Primary canvas. The Controls panel edits these args. */
export const Default: Story = {
  parameters: {
    docs: { source: { code: primeNgExample('button').code, language: 'ts' } },
  },
  play: async ({ canvasElement, args }) => {
    await assertRoleVisible(canvasElement, 'button', args.label);
  },
  render: (args) => ({
    props: args,
    moduleMetadata: { imports: [Button] },
    template: `
      <p-button
        [label]="label"
        [severity]="severity === 'primary' ? undefined : severity"
        [outlined]="outlined"
        [text]="text"
        [size]="size"
        [disabled]="disabled"
        [loading]="loading"
      />
    `,
  }),
};

/** One primary, safe secondaries, one destructive — the hierarchy on a view. */
export const Hierarchy: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Enregistrer');
    await assertRoleVisible(canvasElement, 'button', 'Supprimer le document');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button label="Enregistrer" />
        <p-button label="Annuler" severity="secondary" [outlined]="true" />
        <p-button label="Supprimer le document" severity="danger" />
      </div>
    `,
  }),
};

export const Secondary: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Annuler');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button label="Annuler" severity="secondary" [outlined]="true" />
        <p-button label="Retour" severity="secondary" [text]="true" />
      </div>
    `,
  }),
};

export const Destructive: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Supprimer le document');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `<p-button label="Supprimer le document" severity="danger" icon="bi bi-trash" />`,
  }),
};

export const LinkStyle: Story = {
  name: 'Link',
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Voir le dossier');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `<p-button label="Voir le dossier" [link]="true" />`,
  }),
};

export const IconOnly: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Rechercher');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button icon="bi bi-search" ariaLabel="Rechercher" severity="secondary" [outlined]="true" />
        <p-button label="Enregistrer" icon="bi bi-check-lg" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Filtrer');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button label="Filtrer" size="small" icon="bi bi-funnel" severity="secondary" [outlined]="true" />
        <p-button label="Enregistrer" />
      </div>
    `,
  }),
};

export const States: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('button');
    await expect(buttons.length).toBe(2);
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button label="Recherche" icon="bi bi-search" [loading]="true" />
        <p-button label="Enregistrer" [disabled]="true" />
      </div>
    `,
  }),
};

/** Long labels in both example languages; the button grows, the text does not shrink. */
export const LongLabels: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', /Envoyer/);
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button label="Envoyer la demande de remboursement" />
        <p-button label="Terugbetalingsaanvraag verzenden" severity="secondary" [outlined]="true" />
      </div>
    `,
  }),
};

export const Evidence = {
  tags: ['!dev'],
  ...evidenceStory('AA', primeNgEvidence('button')),
};
