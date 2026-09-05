import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Badge } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ToolbarComponent } from './toolbar.component';

const meta: Meta<ToolbarComponent> = {
  title: 'Custom components/Toolbar',
  component: ToolbarComponent,
  decorators: [moduleMetadata({ imports: [Badge, ButtonModule, InputText] })],
  parameters: { layout: 'padded' },
  argTypes: {
    sticky: {
      control: 'boolean',
      description: 'When true (default) the toolbar sticks to the top of its scroll container.',
    },
  },
  args: { sticky: true },
};

export default meta;
type Story = StoryObj<ToolbarComponent>;

const SLOTS = `
  <ng-container slot="start">
    <input pInputText type="text" placeholder="Rechercher un document" aria-label="Rechercher" />
    <button pButton type="button" severity="secondary" size="small" [outlined]="true" label="Filtres" icon="bi bi-funnel"></button>
  </ng-container>
  <ng-container slot="end">
    <p-badge value="12" />
    <button pButton type="button" size="small" label="Nouveau"></button>
  </ng-container>`;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<pds-toolbar [sticky]="sticky">${SLOTS}</pds-toolbar>`,
  }),
};

export const Sticky: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="o-layout--overflow-y-auto" style="height: 16rem; background: var(--pds-color-surface-page);">
        <pds-toolbar [sticky]="true">${SLOTS}</pds-toolbar>
        <div class="o-layout--padding-3" style="height: 60rem;">
          <p>Scroll — the toolbar stays pinned to the top of this container.</p>
        </div>
      </div>`,
  }),
};

export const StartSlotOnly: Story = {
  render: () => ({
    template: `
      <pds-toolbar [sticky]="false">
        <ng-container slot="start">
          <input pInputText type="text" placeholder="Rechercher" aria-label="Rechercher" />
        </ng-container>
      </pds-toolbar>`,
  }),
};
