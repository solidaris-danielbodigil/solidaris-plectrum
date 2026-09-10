import {
  afterRenderEffect,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular-vite';
import type { MenuItem } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';
import { ScrollTop } from 'primeng/scrolltop';
import { StepperModule } from 'primeng/stepper';
import { TabsModule } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { statusStory } from '../docs/docs-figure-stories';
import { CONTENT_API } from './gallery-arg-types';
import { assertTextVisible, waitForText } from '../storybook/story-tests';

@Component({
  selector: 'pds-gallery-stepper-demo',
  standalone: true,
  imports: [StepperModule],
  template: `
    <p-stepper [value]="1">
      <p-step-list>
        <p-step [value]="1">Réception</p-step>
        <p-step [value]="2">Analyse</p-step>
        <p-step [value]="3">Décision</p-step>
      </p-step-list>
      <p-step-panels>
        <p-step-panel [value]="1">
          <ng-template #content>
            <p class="o-layout--margin-0 o-layout--padding-block-2">
              Document reçu.
            </p>
          </ng-template>
        </p-step-panel>
        <p-step-panel [value]="2">
          <ng-template #content>
            <p class="o-layout--margin-0 o-layout--padding-block-2">
              Analyse en cours.
            </p>
          </ng-template>
        </p-step-panel>
        <p-step-panel [value]="3">
          <ng-template #content>
            <p class="o-layout--margin-0 o-layout--padding-block-2">
              Décision envoyée.
            </p>
          </ng-template>
        </p-step-panel>
      </p-step-panels>
    </p-stepper>
  `,
})
class GalleryStepperDemo {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly repairStepperRoles = afterRenderEffect(() => {
    const root = this.host.nativeElement as HTMLElement;
    const stepper = root.querySelector('p-stepper');
    stepper?.setAttribute('role', 'group');
    stepper?.setAttribute('aria-label', 'Étapes du dossier');
    root.querySelectorAll('[role="tab"]').forEach((el) => {
      el.removeAttribute('role');
      el.removeAttribute('aria-controls');
    });
    root.querySelectorAll('[role="tabpanel"]').forEach((el) => {
      el.removeAttribute('role');
    });
  });
}

@Component({
  selector: 'pds-gallery-messages-demo',
  standalone: true,
  imports: [Message],
  template: `
    <div class="o-flex o-flex--y o-layout--gap-2">
      <p-message severity="success">Le dossier a été enregistré.</p-message>
      <p-message severity="warn">Une pièce est manquante.</p-message>
      <p-message severity="error">La date de début est obligatoire.</p-message>
      <p-message severity="info">Dernière mise à jour le 24/11/2025.</p-message>
    </div>
  `,
})
class GalleryMessagesDemo {}

const CRUMBS: MenuItem[] = [
  { label: 'Accueil' },
  { label: 'Dossiers' },
  { label: 'Eva Martinez' },
];

const meta: Meta = {
  title: 'PrimeNG/Content and navigation',
  parameters: { layout: 'padded' },
  argTypes: CONTENT_API as Meta['argTypes'],
};

export default meta;

type Story = StoryObj;

/** Ownership badge for the docs page — CSS-only theme proof. */
export const Status = { tags: ['!dev'], ...statusStory({ status: 'core', owner: 'design-system' }) };

export const CardBlock: Story = {
  name: 'Card',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Dossier');
    await assertTextVisible(
      canvasElement,
      'Certificat ITT accepté le 24/11/2025.',
    );
  },
  render: () => ({
    moduleMetadata: { imports: [Card] },
    template: `
      <p-card header="Dossier">
        <p class="o-layout--margin-0">Certificat ITT accepté le 24/11/2025.</p>
      </p-card>
    `,
  }),
};

export const Tags: Story = {
  name: 'Tag',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Accepté');
    await assertTextVisible(canvasElement, 'En traitement');
  },
  render: () => ({
    moduleMetadata: { imports: [Tag] },
    template: `
      <div class="o-flex o-flex--row-wrap o-flex--align-items-center o-layout--gap-2">
        <p-tag value="Accepté" severity="success" icon="bi bi-check-lg" />
        <p-tag value="En traitement" severity="warn" icon="bi bi-hourglass-split" />
        <p-tag value="Info" severity="info" icon="bi bi-info-circle" />
        <p-tag value="Secondaire" severity="secondary" />
      </div>
    `,
  }),
};

export const Badges: Story = {
  name: 'Badge',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, '3');
  },
  render: () => ({
    moduleMetadata: { imports: [Badge] },
    template: `
      <div class="o-flex o-flex--row-wrap o-flex--align-items-center o-layout--gap-2">
        <p-badge value="3" />
        <p-badge value="12" severity="warn" />
        <p-badge value="OK" severity="success" />
      </div>
    `,
  }),
};

export const Messages: Story = {
  name: 'Message',
  play: async ({ canvasElement }) => {
    await waitForText(canvasElement, 'Le dossier a été enregistré.');
  },
  render: () => ({
    moduleMetadata: { imports: [GalleryMessagesDemo] },
    template: `<pds-gallery-messages-demo />`,
  }),
};

export const Dividers: Story = {
  name: 'Divider',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Avant');
    await assertTextVisible(canvasElement, 'Après');
  },
  render: () => ({
    moduleMetadata: { imports: [Divider] },
    template: `
      <p class="o-layout--margin-0">Avant</p>
      <p-divider />
      <p class="o-layout--margin-0">Après</p>
    `,
  }),
};

export const Breadcrumbs: Story = {
  name: 'Breadcrumb',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Eva Martinez');
  },
  render: () => ({
    props: { items: CRUMBS },
    moduleMetadata: { imports: [Breadcrumb] },
    template: `<p-breadcrumb [model]="items" [home]="{ icon: 'bi bi-house', label: 'Accueil' }" homeAriaLabel="Accueil" aria-label="Fil d’Ariane" />`,
  }),
};

export const TabSet: Story = {
  name: 'Tabs',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Détails');
    await assertTextVisible(canvasElement, 'Identité et coordonnées.');
  },
  render: () => ({
    moduleMetadata: { imports: [TabsModule] },
    template: `
      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">Détails</p-tab>
          <p-tab value="1">Documents</p-tab>
          <p-tab value="2">Notes</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <p class="o-layout--margin-0">Identité et coordonnées.</p>
          </p-tabpanel>
          <p-tabpanel value="1">
            <p class="o-layout--margin-0">Pièces du dossier.</p>
          </p-tabpanel>
          <p-tabpanel value="2">
            <p class="o-layout--margin-0">Notes internes.</p>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    `,
  }),
};

export const Steps: Story = {
  name: 'Stepper',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Réception');
    await waitForText(canvasElement, 'Document reçu.');
  },
  render: () => ({
    moduleMetadata: { imports: [GalleryStepperDemo] },
    template: `<pds-gallery-stepper-demo />`,
  }),
};

export const ScrollToTop: Story = {
  name: 'ScrollTop',
  play: async ({ canvasElement }) => {
    await assertTextVisible(canvasElement, 'Début de la page');
    await assertTextVisible(canvasElement, 'Fin de la page');
  },
  render: () => ({
    moduleMetadata: { imports: [ScrollTop] },
    template: `
      <div
        class="o-layout--overflow-y-auto"
        style="height: 12rem; position: relative;"
      >
        <p class="o-layout--margin-0">Début de la page</p>
        <p class="o-layout--padding-block-8">Contenu long pour faire apparaître le bouton.</p>
        <p class="o-layout--padding-block-8">Encore du contenu.</p>
        <p class="o-layout--margin-0">Fin de la page</p>
        <p-scrolltop [target]="'parent'" icon="bi bi-chevron-up" />
      </div>
    `,
  }),
};
