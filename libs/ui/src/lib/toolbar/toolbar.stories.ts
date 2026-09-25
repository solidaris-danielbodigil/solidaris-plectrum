import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { Badge } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { anatomyStory, contractStory, statusStory } from '../../docs/docs-figure-stories';
import { argTypesFromProps } from '../../storybook/arg-types-from-props';
import { storyDesign } from '../../storybook/story-design';
import { expect, within } from '../../storybook/story-tests';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarMetadata } from './toolbar.metadata';

const meta: Meta<ToolbarComponent> = {
  title: 'Custom components/Toolbar',
  component: ToolbarComponent,
  decorators: [moduleMetadata({ imports: [Badge, ButtonModule, InputText] })],
  parameters: {
    layout: 'padded',
    ...storyDesign(ToolbarMetadata.component.figmaUrl),
  },
  argTypes: argTypesFromProps(ToolbarMetadata.props ?? []),
  args: { sticky: true, variant: 'default' },
};

export default meta;
type Story = StoryObj<ToolbarComponent>;

// Docs figures — hidden from the sidebar. The MDX page embeds these; the
// content comes from toolbar.metadata.ts, the documentation SSOT.
export const Status = { tags: ['!dev'], ...statusStory(ToolbarMetadata.governance, ToolbarMetadata.component) };
export const Usage = { tags: ['!dev'], ...contractStory(ToolbarMetadata, 'usage') };
export const Variants = { tags: ['!dev'], ...contractStory(ToolbarMetadata, 'variants') };
export const Patterns = { tags: ['!dev'], ...contractStory(ToolbarMetadata, 'patterns') };
export const Examples = { tags: ['!dev'], ...contractStory(ToolbarMetadata, 'examples') };
export const Composition = { tags: ['!dev'], ...contractStory(ToolbarMetadata, 'composition') };
export const Behavior = { tags: ['!dev'], ...contractStory(ToolbarMetadata, 'behavior') };
export const Accessibility = { tags: ['!dev'], ...contractStory(ToolbarMetadata, 'accessibility') };

const SLOTS = `
  <ng-container slot="start">
    <input pInputText type="text" placeholder="Search" aria-label="Search" />
    <button pButton type="button" severity="secondary" size="small" [outlined]="true" label="Filters" icon="bi bi-funnel"></button>
  </ng-container>
  <ng-container slot="end">
    <p-badge value="12" />
    <button pButton type="button" size="small" label="New"></button>
  </ng-container>`;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<pds-toolbar [sticky]="sticky" [variant]="variant">${SLOTS}</pds-toolbar>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Search' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'New' })).toBeVisible();
  },
};

export const Anatomy = { tags: ['!dev'], ...anatomyStory(ToolbarMetadata, Default) };

export const Sticky: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="o-layout o-layout--overflow-y-auto" style="height: 16rem; background: var(--pds-color-surface-page);">
        <pds-toolbar [sticky]="true">${SLOTS}</pds-toolbar>
        <div class="o-layout o-layout--padding-3" style="height: 60rem;">
          <p>Scroll — the toolbar stays pinned to the top of this container.</p>
        </div>
      </div>`,
  }),
  play: async ({ canvasElement }) => {
    const scroller = canvasElement.querySelector(
      '.o-layout--overflow-y-auto',
    ) as HTMLElement | null;
    const toolbar = canvasElement.querySelector(
      'pds-toolbar',
    ) as HTMLElement | null;

    await expect(toolbar).toHaveClass('c-toolbar--sticky');
    await expect(getComputedStyle(toolbar!).position).toBe('sticky');

    scroller!.scrollTop = 240;
    await expect(toolbar).toHaveClass('c-toolbar--sticky');
    await expect(getComputedStyle(toolbar!).position).toBe('sticky');
  },
};

export const Bordered: Story = {
  args: { sticky: true, variant: 'bordered' },
  render: (args) => ({
    props: args,
    template: `<pds-toolbar [sticky]="sticky" variant="bordered">${SLOTS}</pds-toolbar>`,
  }),
  play: async ({ canvasElement }) => {
    const toolbar = canvasElement.querySelector(
      'pds-toolbar',
    ) as HTMLElement | null;
    const card = canvasElement.querySelector('p-card') as HTMLElement | null;

    await expect(toolbar).toHaveClass('c-toolbar--bordered');
    await expect(card).toHaveClass('u-border-all');
    await expect(card?.style.getPropertyValue('--p-card-shadow').trim()).toBe(
      'none',
    );
    await expect(
      card?.style.getPropertyValue('--pds-border-color').trim(),
    ).toBe('var(--pds-color-card-border)');
  },
};

export const StartSlotOnly: Story = {
  render: () => ({
    template: `
      <pds-toolbar [sticky]="false">
        <ng-container slot="start">
          <input pInputText type="text" placeholder="Search" aria-label="Search" />
        </ng-container>
      </pds-toolbar>`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Search' })).toBeVisible();
  },
};
