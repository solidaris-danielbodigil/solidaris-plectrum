import type { Meta, StoryObj } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { ToggleButton } from 'primeng/togglebutton';
import { statusStory } from '../docs/docs-figure-stories';
import {
  assertRoleVisible,
  assertTextVisible,
  expect,
} from '../storybook/story-tests';

const ROW =
  'o-flex o-flex--row-wrap o-flex--align-items-center o-layout--gap-2';

const meta: Meta = {
  title: 'PrimeNG/Actions',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

/** Ownership badge for the docs page — CSS-only theme proof. */
export const Status = statusStory({ status: 'core', owner: 'design-system' });

export const Severities: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Primaire');
    await assertRoleVisible(canvasElement, 'button', 'Danger');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button label="Primaire" />
        <p-button label="Secondaire" severity="secondary" />
        <p-button label="Succès" severity="success" />
        <p-button label="Info" severity="info" />
        <p-button label="Attention" severity="warn" />
        <p-button label="Danger" severity="danger" />
        <p-button label="Contraste" severity="contrast" />
      </div>
    `,
  }),
};

export const Outlined: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Primaire');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button label="Primaire" [outlined]="true" />
        <p-button label="Secondaire" severity="secondary" [outlined]="true" />
        <p-button label="Succès" severity="success" [outlined]="true" />
        <p-button label="Danger" severity="danger" [outlined]="true" />
      </div>
    `,
  }),
};

export const Text: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Primaire');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button label="Primaire" [text]="true" />
        <p-button label="Secondaire" severity="secondary" [text]="true" />
        <p-button label="Danger" severity="danger" [text]="true" />
      </div>
    `,
  }),
};

export const Link: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Lien');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `<p-button label="Lien" [link]="true" />`,
  }),
};

export const Sizes: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Petit');
    await assertRoleVisible(canvasElement, 'button', 'Grand');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button label="Petit" size="small" icon="bi bi-check-lg" />
        <p-button label="Normal" icon="bi bi-check-lg" />
        <p-button label="Grand" size="large" icon="bi bi-check-lg" />
      </div>
    `,
  }),
};

export const Icon: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Enregistrer');
    await assertRoleVisible(canvasElement, 'button', 'Rechercher');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `
      <div class="${ROW}">
        <p-button icon="bi bi-search" ariaLabel="Rechercher" />
        <p-button label="Enregistrer" icon="bi bi-check-lg" />
        <p-button label="Profil" icon="bi bi-person" iconPos="right" />
      </div>
    `,
  }),
};

export const Loading: Story = {
  play: async ({ canvasElement }) => {
    await assertRoleVisible(canvasElement, 'button', 'Recherche');
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `<p-button label="Recherche" icon="bi bi-search" [loading]="true" />`,
  }),
};

export const Disabled: Story = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    await expectDisabled(button);
  },
  render: () => ({
    moduleMetadata: { imports: [Button] },
    template: `<p-button label="Enregistrer" [disabled]="true" />`,
  }),
};

export const Toggle: Story = {
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Activé');
  },
  render: () => ({
    props: { checked: true },
    moduleMetadata: { imports: [FormsModule, ToggleButton] },
    template: `
      <p-togglebutton
        [(ngModel)]="checked"
        onLabel="Activé"
        offLabel="Désactivé"
        onIcon="bi bi-check-lg"
        offIcon="bi bi-x-lg"
      />
    `,
  }),
};

export const Select: Story = {
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Liste');
    await assertTextVisible(canvasElement, 'Grille');
  },
  render: () => ({
    props: {
      value: 'list',
      options: [
        { label: 'Liste', value: 'list' },
        { label: 'Grille', value: 'grid' },
      ],
    },
    moduleMetadata: { imports: [FormsModule, SelectButton] },
    template: `
      <p-selectbutton
        [options]="options"
        [(ngModel)]="value"
        optionLabel="label"
        optionValue="value"
      />
    `,
  }),
};

async function expectDisabled(button: Element | null): Promise<void> {
  const blocked =
    (button as HTMLButtonElement | null)?.disabled === true ||
    button?.getAttribute('aria-disabled') === 'true' ||
    button?.getAttribute('data-p-disabled') === 'true' ||
    button?.closest('[data-p-disabled="true"], .p-disabled') !== null;
  await expect(blocked).toBe(true);
}
