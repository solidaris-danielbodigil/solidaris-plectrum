// Canvases for the small PrimeNG restyles that have no component of their own:
// AutoComplete sizing, Tabs padding bridge, Tag icon alignment, Card title spacing.
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { Card } from 'primeng/card';
import { Tab, TabList, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';

const meta: Meta = {
  title: 'Custom components/PrimeNG Tweaks',
  decorators: [
    moduleMetadata({
      imports: [AutoComplete, Card, FormsModule, Tab, TabList, Tabs, Tag],
    }),
  ],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const AutoCompleteSizing: Story = {
  name: 'AutoComplete sizing',
  render: () => ({
    props: {
      small: ['Certificat ITT'],
      large: ['Indemnités', 'Rechute'],
      suggestions: [],
    },
    template: `
      <div class="o-flex o-flex--col o-layout--gap-3" style="max-width: 28rem;">
        <p-autocomplete [(ngModel)]="small" [suggestions]="suggestions" [multiple]="true" size="small" placeholder="small multiple" />
        <p-autocomplete [(ngModel)]="large" [suggestions]="suggestions" [multiple]="true" size="large" placeholder="large multiple" />
      </div>`,
  }),
};

export const TagIconAlignment: Story = {
  name: 'Tag icon alignment',
  render: () => ({
    template: `
      <div class="o-flex o-flex--align-items-center o-layout--gap-2">
        <p-tag severity="success" icon="bi bi-check-lg" value="Accepté" />
        <p-tag severity="warn" icon="bi bi-hourglass-split" value="En traitement" />
        <p-tag severity="danger" icon="bi bi-x-lg" value="Refusé" />
      </div>`,
  }),
};

export const CardTitleSpacing: Story = {
  name: 'Card title spacing',
  render: () => ({
    // p-card treats a plain style attribute as its [style] object input —
    // constrain via a wrapper instead.
    template: `
      <div style="max-width: 24rem;">
        <p-card header="Titre du panneau">
          <p class="o-layout--margin-0">La marge sous le titre vient de _components.card.scss — global, pas par carte.</p>
        </p-card>
      </div>`,
  }),
};

export const TabsPaddingBridge: Story = {
  name: 'Tabs padding bridge',
  render: () => ({
    template: `
      <div class="c-affiliate-details__category-tabs" style="max-width: 28rem;">
        <p-tabs value="0">
          <p-tablist>
            <p-tab value="0">Indemnités</p-tab>
            <p-tab value="1">Allocations</p-tab>
            <p-tab value="2">Absences</p-tab>
          </p-tablist>
        </p-tabs>
      </div>`,
  }),
};
