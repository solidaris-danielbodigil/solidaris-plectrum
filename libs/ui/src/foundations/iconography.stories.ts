// =============================================================================
// libs/ui/src/foundations/iconography.stories.ts
// Iconography foundation page — searchable, filterable Bootstrap Icons browser.
//
// Template: ./iconography-page.component.html
//
// PrimeNG components used:
//   - sds-toolbar    — sticky card toolbar (libs/ui/src/lib/toolbar)
//   - p-iconField    — search field with leading icon
//   - p-inputIcon    — icon slot inside IconField
//   - InputText      — directive on the <input>
//   - p-selectButton — variant filter (All / Regular / Filled) + size picker (S/M/L/XL)
//   - p-badge        — icon count
//   - p-toast        — copy-to-clipboard confirmation
//
// Styles: c-iconography* classes from libs/styles/src/06-components/_iconography.scss
// =============================================================================

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { Badge } from 'primeng/badge';
import { Card } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarComponent } from '../lib/toolbar/toolbar.component';
import { InputClearComponent } from '../lib/input-clear';

// ── Build-time icon list ──────────────────────────────────────────────────────
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

// ── Variant filter options for p-selectButton ─────────────────────────────────
// Bootstrap Icons has two styles: regular (no suffix) and filled (-fill suffix).
const VARIANT_OPTIONS = [
  { label: 'All',     value: 'all'     },
  { label: 'Regular', value: 'regular' },
  { label: 'Filled',  value: 'fill'    },
];

// ── Size options for icon preview ──────────────────────────────────────────────
const SIZE_OPTIONS = [
  { label: 'S',   value: '1rem'   },
  { label: 'M',   value: '1.5rem' },
  { label: 'L',   value: '2rem'   },
  { label: 'XL',  value: '3rem'   },
];

// ── Iconography Page Component ────────────────────────────────────────────────
@Component({
  selector: 'sds-iconography-page',
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
    Card,
    Toast,
  ],
  providers: [MessageService],
  templateUrl: './iconography-page.component.html',
})
class IconographyPageComponent {
  private readonly messageService = inject(MessageService);

  readonly variantOptions = VARIANT_OPTIONS;
  readonly sizeOptions    = SIZE_OPTIONS;

  readonly searchQuery   = signal('');
  readonly variantFilter = signal('all');
  readonly iconSize      = signal('1.5rem');
  readonly hoveredIcon   = signal<string | null>(null);

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
        (v === 'fill'    &&  name.endsWith('-fill')) ||
        (v === 'regular' && !name.endsWith('-fill'));
      return matchesQuery && matchesVariant;
    });
  });

  copyToClipboard(iconName: string): void {
    const classString = `bi bi-${iconName}`;
    navigator.clipboard.writeText(classString).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copied!',
        detail: classString,
        life: 2000,
      });
    });
  }
}

// ── Storybook meta ────────────────────────────────────────────────────────────
const meta: Meta<IconographyPageComponent> = {
  title: 'Foundations/Iconography',
  component: IconographyPageComponent,
  decorators: [
    moduleMetadata({ imports: [IconographyPageComponent] }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**Iconography** — searchable Bootstrap Icons browser for the Plectrum design system.

- All icons are rendered via Bootstrap Icons CSS font (\`bi bi-{name}\`)
- Click any icon to copy its class string to the clipboard
- Filter by variant: All / Regular (no suffix) / Filled (-fill suffix)
- Toolbar uses \`<sds-toolbar [sticky]="true">\` with named \`slot=start\` / \`slot=end\` projection

Figma: [Foundations — Iconography](https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=6961-92390)

Page styles: \`libs/styles/src/06-components/_iconography.scss\`
Toolbar styles: \`libs/styles/src/06-components/_components.toolbar.scss\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<IconographyPageComponent>;

export const AllIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Full Bootstrap Icons browser with search and variant filter.',
      },
    },
  },
};
