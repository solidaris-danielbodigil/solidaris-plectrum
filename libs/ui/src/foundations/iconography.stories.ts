// =============================================================================
// libs/ui/src/foundations/iconography.stories.ts
// Iconography foundation — size tokens via <pds-token-explorer>, plus the
// Bootstrap Icons catalog using the same token-block chrome.
// =============================================================================

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { Badge } from 'primeng/badge';
import { ToolbarComponent } from '../lib/toolbar/toolbar.component';
import { InputClearComponent } from '../lib/input-clear';
import { type IconSize } from '../lib/icon/icon.types';
import { TokenExplorerComponent } from '../storybook/token-explorer.component';
import { showStorybookToast } from '../storybook/storybook-toast';

const ALL_ICON_NAMES: string[] = (() => {
  try {
    // @ts-expect-error — require.context is a webpack/Storybook API
    const ctx = require.context(
      '../../../../node_modules/bootstrap-icons/icons',
      false,
      /\.svg$/
    );
    return ctx
      .keys()
      .map((k: string) => k.replace('./', '').replace('.svg', ''))
      .sort() as string[];
  } catch {
    return ['house', 'heart', 'star', 'bell', 'gear', 'person', 'folder', 'search'];
  }
})();

const VARIANT_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Regular', value: 'regular' },
  { label: 'Filled', value: 'fill' },
];

const SIZE_OPTIONS: { label: string; value: IconSize }[] = [
  { label: 'XS', value: 'xs' },
  { label: 'S', value: 'sm' },
  { label: 'M', value: 'md' },
  { label: 'L', value: 'lg' },
  { label: 'XL', value: 'xl' },
];

@Component({
  selector: 'pds-iconography-page',
  standalone: true,
  imports: [
    FormsModule,
    ToolbarComponent,
    IconField,
    InputIcon,
    InputText,
    InputClearComponent,
    SelectButton,
    Badge,
  ],
  templateUrl: './iconography-page.component.html',
})
class IconographyPageComponent {
  readonly variantOptions = VARIANT_OPTIONS;
  readonly sizeOptions = SIZE_OPTIONS;
  readonly totalCount = ALL_ICON_NAMES.length;

  readonly searchQuery = signal('');
  readonly variantFilter = signal('all');
  readonly iconSize = signal<IconSize>('md');

  readonly previewSize = computed(
    () => `var(--pds-icon-size-${this.iconSize()})`,
  );

  clearSearchQuery(): void {
    this.searchQuery.set('');
  }

  readonly filteredIcons = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const v = this.variantFilter();
    return ALL_ICON_NAMES.filter((name) => {
      const matchesQuery = !q || name.includes(q);
      const matchesVariant =
        v === 'all' ||
        (v === 'fill' && name.endsWith('-fill')) ||
        (v === 'regular' && !name.endsWith('-fill'));
      return matchesQuery && matchesVariant;
    });
  });

  copyToClipboard(iconName: string): void {
    const classString = `bi bi-${iconName}`;
    void navigator.clipboard.writeText(classString).then(
      () =>
        showStorybookToast({
          summary: 'Copied',
          detail: classString,
        }),
      () =>
        showStorybookToast({
          severity: 'error',
          summary: 'Copy failed',
          detail: 'Clipboard access was blocked by the browser.',
          life: 3000,
        }),
    );
  }
}

const meta: Meta<IconographyPageComponent> = {
  title: 'Foundations/Iconography',
  component: IconographyPageComponent,
  tags: ['!dev'],
  decorators: [
    moduleMetadata({ imports: [IconographyPageComponent, TokenExplorerComponent] }),
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<IconographyPageComponent>;

export const Sizes: Story = {
  render: () => ({
    template: `<pds-token-explorer category="icon" />`,
    moduleMetadata: { imports: [TokenExplorerComponent] },
  }),
};

export const AllIcons: Story = {};
