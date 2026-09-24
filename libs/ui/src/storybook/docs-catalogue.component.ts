import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Badge } from 'primeng/badge';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { FormFieldComponent } from '../lib/form-field/form-field.component';
import { ToolbarComponent } from '../lib/toolbar/toolbar.component';
import contracts from '../../../../.ai/contracts/index.json';
import { ALL_COMPONENT_METADATA } from './component-metadata';
import {
  buildCatalogue,
  matchesCatalogue,
  type CatalogueEntry,
  type CatalogueImplementation,
  type CataloguePurpose,
  type CatalogueScope,
} from './catalogue';
import { DocsLinkComponent } from './docs-link.component';

type PurposeFilter = CataloguePurpose | 'all';
type ImplementationFilter = CatalogueImplementation | 'all';
type ScopeFilter = CatalogueScope | 'all';

@Component({
  selector: 'pds-docs-catalogue',
  imports: [
    FormsModule,
    IconField,
    InputIcon,
    InputText,
    Badge,
    Select,
    TableModule,
    Tag,
    FormFieldComponent,
    ToolbarComponent,
    DocsLinkComponent,
  ],
  templateUrl: './docs-catalogue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'c-docs-catalogue o-flex o-flex--y o-layout--min-h-0',
  },
})
export class DocsCatalogueComponent {
  protected readonly pageSize = 25;
  protected readonly search = signal('');
  protected readonly purpose = signal<PurposeFilter>('all');
  protected readonly implementation = signal<ImplementationFilter>('all');
  protected readonly scope = signal<ScopeFilter>('all');
  protected readonly usedIn = signal<string>('all');
  protected readonly first = signal(0);
  private readonly docsIds = signal<ReadonlyMap<string, string>>(new Map());

  constructor() {
    void this.loadDocsIds();
  }

  protected readonly purposeOptions: { label: string; value: PurposeFilter }[] =
    [
      { label: 'All purposes', value: 'all' },
      { label: 'Actions', value: 'Actions' },
      { label: 'Forms', value: 'Forms' },
      { label: 'Navigation', value: 'Navigation' },
      { label: 'Data', value: 'Data' },
      { label: 'Feedback', value: 'Feedback' },
      { label: 'Overlays', value: 'Overlays' },
    ];

  protected readonly implementationOptions: {
    label: string;
    value: ImplementationFilter;
  }[] = [
    { label: 'Any build', value: 'all' },
    { label: 'PrimeNG', value: 'PrimeNG' },
    { label: 'Angular', value: 'Angular' },
    { label: 'CSS', value: 'CSS' },
  ];

  protected readonly scopeOptions: { label: string; value: ScopeFilter }[] = [
    { label: 'All scopes', value: 'all' },
    { label: 'Core', value: 'Core' },
    { label: 'App examples', value: 'App example' },
  ];

  protected readonly usedInOptions = computed(() => {
    const teams = new Set<string>();
    for (const entry of this.entries()) {
      for (const team of entry.usedIn) teams.add(team);
    }
    return [
      { label: 'All teams', value: 'all' },
      ...[...teams]
        .sort((a, b) => a.localeCompare(b))
        .map((team) => ({ label: team, value: team })),
      { label: 'Not used', value: 'none' },
    ];
  });

  protected readonly entries = computed(() =>
    buildCatalogue(ALL_COMPONENT_METADATA, this.docsIds(), contracts.usedIn),
  );

  protected readonly visible = computed(() =>
    this.entries().filter((entry) =>
      matchesCatalogue(
        entry,
        this.search(),
        this.purpose(),
        this.implementation(),
        this.scope(),
        this.usedIn(),
      ),
    ),
  );

  protected onSearch(value: string): void {
    this.search.set(value);
    this.first.set(0);
  }

  protected onFilter<T>(target: { set(value: T): void }, value: T): void {
    target.set(value);
    this.first.set(0);
  }

  private async loadDocsIds(): Promise<void> {
    if (typeof fetch !== 'function') return;
    try {
      const response = await fetch('./index.json');
      if (!response.ok) return;
      const storybook = (await response.json()) as {
        entries?: Record<
          string,
          { id: string; type: string; importPath: string }
        >;
      };
      const byFolder = new Map<string, string>();
      for (const entry of Object.values(storybook.entries ?? {})) {
        if (entry.type !== 'docs') continue;
        const folder = entry.importPath.split('/').at(-2);
        if (folder && !byFolder.has(folder)) byFolder.set(folder, entry.id);
      }
      this.docsIds.set(byFolder);
    } catch {
      // Index unavailable — names stay text until the next load.
    }
  }

  protected scopeSeverity(entry: CatalogueEntry): 'success' | 'secondary' {
    return entry.scope === 'Core' ? 'success' : 'secondary';
  }
}
