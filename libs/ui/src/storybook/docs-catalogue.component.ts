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
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ToolbarComponent } from '../lib/toolbar/toolbar.component';
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
    Select,
    TableModule,
    Tag,
    ToolbarComponent,
    DocsLinkComponent,
  ],
  templateUrl: './docs-catalogue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-catalogue o-layout o-layout--block' },
})
export class DocsCatalogueComponent {
  protected readonly search = signal('');
  protected readonly purpose = signal<PurposeFilter>('all');
  protected readonly implementation = signal<ImplementationFilter>('all');
  protected readonly scope = signal<ScopeFilter>('all');
  private readonly docsIds = signal<ReadonlyMap<string, string>>(new Map());

  constructor() {
    void this.loadDocsIds();
  }

  protected readonly purposeOptions: { label: string; value: PurposeFilter }[] = [
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

  private readonly entries = computed(() =>
    buildCatalogue(ALL_COMPONENT_METADATA, this.docsIds()),
  );

  protected readonly visible = computed(() =>
    this.entries().filter((entry) =>
      matchesCatalogue(
        entry,
        this.search(),
        this.purpose(),
        this.implementation(),
        this.scope(),
      ),
    ),
  );

  protected onSearch(value: string): void {
    this.search.set(value);
  }

  private async loadDocsIds(): Promise<void> {
    if (typeof fetch !== 'function') return;
    try {
      const response = await fetch('./index.json');
      if (!response.ok) return;
      const storybook = (await response.json()) as {
        entries?: Record<string, { id: string; type: string; importPath: string }>;
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
