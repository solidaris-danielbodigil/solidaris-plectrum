// =============================================================================
// libs/ui/src/storybook/docs-contract.component.ts
// Renders one block of a component's .metadata.ts on its docs page.
//
// The metadata file is the single source of truth for the documentation
// (.ai/contracts/schema/component.metadata.ts). MDX pages embed one figure per
// section — usage, anatomy, patterns, composition, behavior, variants,
// accessibility, examples — through contractStory() in
// libs/ui/src/docs/docs-figure-stories.ts, and keep only headings, canvases
// and visuals of their own. `npm run docs:check` fails when a page restates a
// block as prose.
//
// PrimeNG components used:
//   - pds-docs-do-dont (p-card + p-tag + pds-icon) — usage
//   - p-table — anatomy, slots, variant options
//   - p-card  — patterns, examples, accessibility
//   - p-tag   — states, companions, nested components, WCAG level, role
//
// Styles: c-docs-contract* in libs/styles/src/06-components/_components.docs-figures.scss
// (text rhythm and code blocks only — PrimeNG owns the chrome).
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import type { ComponentMetadata } from '@solidaris/contracts';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { DocsDoDontComponent } from './docs-do-dont.component';
import type { DocsContractSection, DocsDoDontItem } from './docs-figures.types';

interface VariantRow {
  option: string;
  purpose: string;
  isDefault: boolean;
}

interface VariantGroup {
  prop: string;
  defaultOption: string;
  rows: VariantRow[];
}

/** Do / Don't entries of a metadata `usage` block. Exported for the spec. */
export function usageToDoDont(usage: ComponentMetadata['usage']): {
  dos: DocsDoDontItem[];
  donts: DocsDoDontItem[];
} {
  return {
    dos: usage.useCases.map((title) => ({ title })),
    donts: usage.antiPatterns.map((anti) => ({
      title: anti.scenario,
      detail: anti.reason,
      alternative: anti.alternative,
    })),
  };
}

@Component({
  selector: 'pds-docs-contract',
  imports: [Card, TableModule, Tag, DocsDoDontComponent],
  templateUrl: './docs-contract.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c-docs-contract o-layout--block o-layout--margin-block-3',
    '[attr.data-section]': 'section()',
  },
})
export class DocsContractComponent {
  readonly metadata = input.required<ComponentMetadata>();
  readonly section = input.required<DocsContractSection>();

  protected readonly name = computed(() => this.metadata().component.name);

  protected readonly doDont = computed(() =>
    usageToDoDont(this.metadata().usage),
  );

  protected readonly anatomy = computed(() => this.metadata().anatomy ?? []);

  protected readonly patterns = computed(
    () => this.metadata().usage.commonPatterns ?? [],
  );

  protected readonly composition = computed(() => {
    const composition = this.metadata().composition;
    return {
      slots: composition?.slots ?? [],
      parents: composition?.parentConstraints ?? [],
      companions: composition?.companions ?? [],
      nested: composition?.nestedComponents ?? [],
    };
  });

  protected readonly behavior = computed(() => {
    const behavior = this.metadata().behavior;
    return {
      states: behavior?.states ?? [],
      interactions: behavior?.interactions ?? [],
      responsive: behavior?.responsive ?? [],
    };
  });

  protected readonly variants = computed<VariantGroup[]>(() =>
    Object.entries(this.metadata().variants ?? {}).map(([prop, variant]) => ({
      prop,
      defaultOption: variant.default,
      rows: variant.options.map((option) => ({
        option,
        purpose: variant.purpose[option] ?? '',
        isDefault: option === variant.default,
      })),
    })),
  );

  protected readonly accessibility = computed(() => {
    const a11y = this.metadata().accessibility;
    return {
      wcagLevel: a11y.wcagLevel,
      role: a11y.role ?? null,
      aria: a11y.ariaAttributes ?? [],
      keyboard: a11y.keyboardSupport ?? [],
      contrast: a11y.contrastRequirements ?? [],
    };
  });

  protected readonly examples = computed(() => this.metadata().examples ?? []);

  /** True when the selected block has nothing to show — the figure says so instead of vanishing. */
  protected readonly empty = computed(() => {
    switch (this.section()) {
      case 'usage': {
        const { dos, donts } = this.doDont();
        return dos.length + donts.length === 0;
      }
      case 'anatomy':
        return this.anatomy().length === 0;
      case 'patterns':
        return this.patterns().length === 0;
      case 'composition': {
        const c = this.composition();
        return (
          c.slots.length +
            c.parents.length +
            c.companions.length +
            c.nested.length ===
          0
        );
      }
      case 'behavior': {
        const b = this.behavior();
        return (
          b.states.length + b.interactions.length + b.responsive.length === 0
        );
      }
      case 'variants':
        return this.variants().length === 0;
      case 'accessibility':
        return false;
      case 'examples':
        return this.examples().length === 0;
    }
  });
}
