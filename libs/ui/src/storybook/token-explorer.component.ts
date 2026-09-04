// =============================================================================
// libs/ui/src/storybook/token-explorer.component.ts
// Reusable foundation page template — one component behind every token page.
//
// The stylesheet is the source of truth (.ai/rules/10-css-ssot.md):
//   - which tokens exist        → cssom.ts readTokenDeclarations()
//   - what they resolve to      → getComputedStyle on the host
//   - the --p-* alias + literal → parsed from the authored declaration
//   - Figma ref + curated group → tokens.generated.ts annotations
//   - section order + labels    → token-sections.ts
//   - how and when to use it    → the foundation MDX page
//
// A token added to 01-settings appears here with no other edit.
//
// PrimeNG components used:
//   - pds-toolbar    — sticky toolbar shell (libs/ui/src/lib/toolbar)
//   - p-iconField    — search field with leading icon
//   - InputText      — directive on the <input>
//   - p-select       — role filter when a category has many groups
//   - p-selectButton — role filter, copy format, view switch
//   - p-badge        — live token count
//   - Storybook preview toast — copy confirmation (main preview frame)
//
// Styles: c-token-explorer* in libs/styles/src/06-components/_components.token-explorer.scss
// =============================================================================

import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Badge } from 'primeng/badge';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { InputClearComponent } from '../lib/input-clear';
import { ToolbarComponent } from '../lib/toolbar/toolbar.component';
import { showStorybookToast } from './storybook-toast';
import { readTokenDeclarations, resolveToken, type TokenDeclaration } from './cssom';
import { TOKEN_SECTIONS, type TokenCategorySections } from './token-sections';
import {
  classifyToken,
  COMPONENT_GROUP,
  type TokenCategory,
  type TokenTaxon,
} from './token-taxonomy';
import { TOKEN_ANNOTATIONS } from './tokens.generated';

/** What the click-to-copy action puts on the clipboard. */
export type TokenCopyFormat = 'var' | 'name' | 'value';

export type TokenExplorerView = 'grid' | 'table';

/** Typography roles bundle five properties; `type-role` renders one row per role. */
export type TokenExplorerBundle = 'type-role' | null;

/** Search stays hidden below this many tokens — it would only add noise. */
const SEARCH_THRESHOLD = 8;

/** Above this many sections the filter becomes a searchable dropdown. */
const FILTER_BUTTON_LIMIT = 6;

const TYPE_PROPS = ['family', 'size', 'weight', 'line-height', 'spacing'] as const;
/** Shown on the role card. Size and tracking stay on the live preview only. */
const VISIBLE_TYPE_PROPS = ['family', 'weight', 'line-height'] as const;
const TYPE_PROP_RE = /-(family|size|weight|line-height|spacing)$/;

const ANNOTATIONS = new Map(
  TOKEN_ANNOTATIONS.map((annotation) => [annotation.cssVar, annotation]),
);

const COMPONENT_SECTION = {
  label: 'Component & feature tokens',
};

interface RowMember {
  prop: string;
  cssVar: string;
  computed: string;
}

interface ExplorerRow {
  label: string;
  cssVar: string;
  computed: string;
  authored: string;
  fallback: string;
  figmaRef: string | null;
  primeNgVar: string | null;
  primeEmpty: boolean;
  section: string;
  scope: TokenTaxon['scope'];
  haystack: string;
  /** Populated for `type-role` bundles only. */
  members: RowMember[];
  copy: Record<TokenCopyFormat, string>;
  preview: Record<string, string>;
}

interface ExplorerSection {
  key: string;
  label: string;
  rows: ExplorerRow[];
}

function typeRole(name: string): string {
  const semantic = /^text-([a-z]+)-/.exec(name);
  if (semantic) return semantic[1];
  return classifyToken(name).group;
}

@Component({
  selector: 'pds-token-explorer',
  standalone: true,
  imports: [
    FormsModule,
    NgTemplateOutlet,
    ToolbarComponent,
    IconField,
    InputIcon,
    InputText,
    InputClearComponent,
    Select,
    SelectButton,
    Badge,
  ],
  templateUrl: './token-explorer.component.html',
  // ViewEncapsulation.None — styles live in the libs/styles global sheet (SSOT).
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenExplorerComponent {
  readonly category = input<TokenCategory>('color');
  /** Restrict to these section keys. Empty means every section in the category. */
  readonly groups = input<readonly string[]>([]);
  readonly bundle = input<TokenExplorerBundle>(null);
  /** Blank mapped `--p-*` on the host so authored fallbacks are visible. */
  readonly stubPrime = input(false);
  readonly view = input<TokenExplorerView>('grid');

  private readonly host = inject(ElementRef<HTMLElement>);

  /** Flips once the host is in the DOM — the CSSOM needs a live document. */
  private readonly rendered = signal(false);

  readonly search = signal('');
  readonly sectionFilter = signal('all');
  readonly copyFormat = signal<TokenCopyFormat>('var');
  /** Seeded from the `view` input, then owned by the toolbar switch. */
  readonly activeView = linkedSignal<TokenExplorerView>(() => this.view());
  /** Editable in the typography playground so real copy can be previewed. */
  readonly sampleText = signal('Mutualité Solidaris — 1 234,56 €');
  readonly replaying = signal(false);

  readonly copyFormatOptions = [
    { label: 'var()', value: 'var' as const },
    { label: 'Name', value: 'name' as const },
    { label: 'Value', value: 'value' as const },
  ];

  readonly viewOptions = [
    { label: 'Grid', value: 'grid' as const },
    { label: 'Table', value: 'table' as const },
  ];

  constructor() {
    afterNextRender(() => {
      if (this.stubPrime()) {
        for (const declaration of readTokenDeclarations().values()) {
          if (declaration.primeNgVar) {
            this.host.nativeElement.style.setProperty(declaration.primeNgVar, 'initial');
          }
        }
      }
      this.rendered.set(true);
    });
  }

  readonly catalog = computed<TokenCategorySections>(
    () => TOKEN_SECTIONS[this.category()],
  );

  /** Every row for this category, before search and section filtering. */
  private readonly allRows = computed<ExplorerRow[]>(() => {
    this.rendered();
    const category = this.category();
    const allowed = this.groups();

    const declarations = [...readTokenDeclarations().values()].filter((declaration) => {
      const taxon = this.taxonOf(declaration);
      if (taxon.category !== category) return false;
      return allowed.length === 0 || allowed.includes(taxon.group);
    });

    return this.bundle() === 'type-role'
      ? this.buildBundles(declarations)
      : declarations.map((declaration) => this.buildRow(declaration));
  });

  readonly sections = computed<ExplorerSection[]>(() => {
    const catalog = this.catalog();
    const query = this.search().trim().toLowerCase();
    const active = this.sectionFilter();

    const buckets = new Map<string, ExplorerRow[]>();
    for (const row of this.allRows()) {
      if (active !== 'all' && row.section !== active) continue;
      if (query && !row.haystack.includes(query)) continue;
      const bucket = buckets.get(row.section);
      if (bucket) bucket.push(row);
      else buckets.set(row.section, [row]);
    }

    const order = catalog.sections.map((section) => section.key);
    return [...buckets.entries()]
      .map(([key, rows]) => {
        const meta = catalog.sections.find((section) => section.key === key);
        if (key === COMPONENT_GROUP) {
          return { key, ...COMPONENT_SECTION, rows };
        }
        return { key, label: meta?.label ?? key, rows };
      })
      .sort((a, b) => this.sectionRank(order, a.key) - this.sectionRank(order, b.key));
  });

  readonly matchCount = computed(() =>
    this.sections().reduce((total, section) => total + section.rows.length, 0),
  );

  readonly totalCount = computed(() => this.allRows().length);

  readonly sectionOptions = computed(() => {
    const catalog = this.catalog();
    const present = new Set(this.allRows().map((row) => row.section));
    const options = catalog.sections
      .filter((section) => present.has(section.key))
      .map((section) => ({ label: section.label, value: section.key }));

    if (present.has(COMPONENT_GROUP)) {
      options.push({ label: COMPONENT_SECTION.label, value: COMPONENT_GROUP });
    }
    return [{ label: 'All', value: 'all' }, ...options];
  });

  readonly searchable = computed(() => this.totalCount() > SEARCH_THRESHOLD);
  readonly filterable = computed(() => this.sectionOptions().length > 2);
  /** Colors have 20+ roles — a button row would swamp the toolbar. */
  readonly compactFilter = computed(
    () => this.sectionOptions().length > FILTER_BUTTON_LIMIT,
  );
  readonly isBundled = computed(() => this.bundle() === 'type-role');

  clearSearch(): void {
    this.search.set('');
  }

  /** Restart the motion previews for keyboard and reduced-pointer users. */
  replay(): void {
    this.replaying.set(false);
    requestAnimationFrame(() => this.replaying.set(true));
  }

  copy(row: ExplorerRow): void {
    const text = row.copy[this.copyFormat()];
    void navigator.clipboard.writeText(text).then(
      () =>
        showStorybookToast({
          summary: 'Copied',
          detail: text,
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

  // ── Classification ──────────────────────────────────────────────────────────

  /**
   * Color groups follow Figma collection names via classifyToken — the
   * generated annotation may still say `brand` / `feedback`. Other categories
   * keep the manifest group when one exists.
   */
  private taxonOf(declaration: TokenDeclaration): TokenTaxon {
    const classified = classifyToken(declaration.name);
    if (classified.category === 'color') return classified;

    const annotation = ANNOTATIONS.get(declaration.cssVar);
    if (annotation) {
      return {
        category: annotation.category as TokenCategory,
        group: annotation.group,
        scope: 'foundation',
      };
    }
    return classified;
  }

  private sectionRank(order: string[], key: string): number {
    if (key === COMPONENT_GROUP) return order.length + 1;
    const index = order.indexOf(key);
    return index === -1 ? order.length : index;
  }

  // ── Row construction ────────────────────────────────────────────────────────

  private resolve(cssVar: string): string {
    if (!this.rendered()) return '';
    return resolveToken(this.host.nativeElement, cssVar);
  }

  private buildRow(declaration: TokenDeclaration): ExplorerRow {
    const taxon = this.taxonOf(declaration);
    const annotation = ANNOTATIONS.get(declaration.cssVar);
    // var() fallback means the resolved value is already correct when the
    // aliased --p-* is missing; primeEmpty is informational only.
    const computedValue = this.resolve(declaration.cssVar) || declaration.fallback;
    const primeEmpty = Boolean(
      declaration.primeNgVar && !this.resolve(declaration.primeNgVar),
    );

    return {
      label: declaration.name,
      cssVar: declaration.cssVar,
      computed: computedValue,
      authored: declaration.authored,
      fallback: declaration.fallback,
      figmaRef: annotation?.figmaRef ?? null,
      primeNgVar: declaration.primeNgVar,
      primeEmpty,
      section: taxon.group,
      scope: taxon.scope,
      haystack: `${declaration.name} ${declaration.cssVar} ${computedValue} ${
        annotation?.figmaRef ?? ''
      } ${declaration.primeNgVar ?? ''}`.toLowerCase(),
      members: [],
      copy: {
        var: `var(${declaration.cssVar})`,
        name: declaration.cssVar,
        value: computedValue,
      },
      preview: this.previewProps(taxon.category, declaration.name, computedValue),
    };
  }

  /**
   * Collapse `text-{role}-{size}-{prop}` tokens into one row per type role.
   *
   * Only foundation roles bundle. Component type tokens such as
   * `text-delay-prediction-metric-size` also match the property suffix, but they
   * are not a role and belong in the component section instead.
   */
  private buildBundles(declarations: TokenDeclaration[]): ExplorerRow[] {
    const groups = new Map<string, TokenDeclaration[]>();
    for (const declaration of declarations) {
      if (!TYPE_PROP_RE.test(declaration.name)) continue;
      if (classifyToken(declaration.name).scope !== 'foundation') continue;
      const key = declaration.name.replace(TYPE_PROP_RE, '');
      const bucket = groups.get(key);
      if (bucket) bucket.push(declaration);
      else groups.set(key, [declaration]);
    }

    return [...groups.entries()].map(([key, members]) => {
      const byProp = new Map(
        members.map((declaration) => [
          TYPE_PROP_RE.exec(declaration.name)?.[1] ?? '',
          declaration,
        ]),
      );
      const valueOf = (prop: string) => {
        const declaration = byProp.get(prop);
        if (!declaration) return '';
        return this.resolve(declaration.cssVar) || declaration.fallback;
      };

      const family = valueOf('family');
      const size = valueOf('size');
      const weight = valueOf('weight');
      const lineHeight = valueOf('line-height');
      const shorthand = [weight, `${size}/${lineHeight}`, family]
        .filter(Boolean)
        .join(' ');

      const memberRows: RowMember[] = VISIBLE_TYPE_PROPS.filter((prop) =>
        byProp.has(prop),
      ).map((prop) => ({
        prop,
        cssVar: byProp.get(prop)!.cssVar,
        computed: valueOf(prop),
      }));

      return {
        label: key,
        cssVar: `--pds-${key}-*`,
        computed: shorthand,
        authored: shorthand,
        fallback: shorthand,
        figmaRef: null,
        primeNgVar: null,
        primeEmpty: false,
        section: typeRole(key),
        scope: 'foundation' as const,
        haystack: `${key} ${shorthand} u-${key}`.toLowerCase(),
        members: memberRows,
        copy: {
          var: `@include ${key};`,
          name: `.u-${key}`,
          value: shorthand,
        },
        preview: {
          '--pds-token-explorer-font-family': family,
          '--pds-token-explorer-font-size': size,
          '--pds-token-explorer-font-weight': weight,
          '--pds-token-explorer-line-height': lineHeight,
          '--pds-token-explorer-letter-spacing': valueOf('spacing'),
        },
      };
    });
  }

  /** Maps a resolved value onto the custom property its preview modifier reads. */
  private previewProps(
    category: TokenCategory | null,
    name: string,
    value: string,
  ): Record<string, string> {
    switch (category) {
      case 'color':
        return { '--pds-token-explorer-swatch': value };
      case 'radius':
        return { '--pds-token-explorer-radius': value };
      case 'shadow':
        return { '--pds-token-explorer-shadow': value };
      case 'spacing':
        return { '--pds-token-explorer-size': value === 'auto' ? '100%' : value };
      case 'motion':
        return { '--pds-token-explorer-duration': value };
      case 'focus':
        return { '--pds-token-explorer-focus': value };
      case 'icon':
        return { '--pds-token-explorer-icon-size': value };
      case 'typography': {
        const map: Record<string, string> = {
          family: '--pds-token-explorer-font-family',
          size: '--pds-token-explorer-font-size',
          weight: '--pds-token-explorer-font-weight',
          'line-height': '--pds-token-explorer-line-height',
          spacing: '--pds-token-explorer-letter-spacing',
        };
        const prop = map[classifyToken(name).group];
        return prop ? { [prop]: value } : {};
      }
      default:
        return {};
    }
  }
}
