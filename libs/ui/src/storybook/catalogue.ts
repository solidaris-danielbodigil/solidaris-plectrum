import type { ComponentMetadata } from '@solidaris/contracts';
import { PRIMENG_KIT } from '../primeng/plectrum-figma';

export type CataloguePurpose =
  | 'Actions'
  | 'Forms'
  | 'Navigation'
  | 'Data'
  | 'Feedback'
  | 'Overlays';

export type CatalogueImplementation = 'PrimeNG' | 'Angular' | 'CSS';

export type CatalogueScope = 'Core' | 'App example';

export interface CatalogueEntry {
  name: string;
  purpose: CataloguePurpose;
  implementation: CatalogueImplementation;
  scope: CatalogueScope;
  summary: string;
  keywords: readonly string[];
  /** Storybook docs path. Empty until the Storybook index resolves a page. */
  path: string;
}

const TYPE_PURPOSE: Record<ComponentMetadata['component']['type'], CataloguePurpose> = {
  input: 'Forms',
  navigation: 'Navigation',
  feedback: 'Feedback',
  display: 'Data',
  interactive: 'Actions',
  container: 'Data',
};

const PRIMENG_LABEL: Record<string, string> = {
  autocomplete: 'AutoComplete',
  datatable: 'DataTable',
  datepicker: 'DatePicker',
  inputgroup: 'InputGroup',
  inputtext: 'InputText',
  scrolltop: 'ScrollTop',
  selectbutton: 'SelectButton',
  togglebutton: 'ToggleButton',
};

export function displayName(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function purposeOf(meta: ComponentMetadata): CataloguePurpose {
  const name = meta.component.name.toLowerCase();
  if (name.includes('drawer')) return 'Overlays';
  if (name.includes('nav') || name.includes('toolbar')) return 'Navigation';
  return TYPE_PURPOSE[meta.component.type];
}

function implementationOf(meta: ComponentMetadata): CatalogueImplementation {
  return meta.component.path.endsWith('.scss') ? 'CSS' : 'Angular';
}

/** Task words a description does not spell out, so search still finds the row. */
function taskWords(text: string): string[] {
  const extra: string[] = [];
  if (/\bdrawer\b/i.test(text)) extra.push('side panel', 'panel');
  if (/\bempty\b/i.test(text)) extra.push('no results');
  if (/\berror\b|\binvalid\b/i.test(text)) extra.push('error', 'validation');
  return extra;
}

export function metadataCatalogue(
  metadata: readonly ComponentMetadata[],
  docsIdByFolder: ReadonlyMap<string, string>,
): CatalogueEntry[] {
  return metadata.map((meta) => {
    const folder = meta.component.name
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
    const docsId = docsIdByFolder.get(folder);
    const summary = meta.component.description;
    const keywords = [
      meta.component.name,
      meta.component.bemBlock,
      meta.component.type,
      ...meta.usage.useCases,
      ...taskWords(`${summary} ${meta.usage.useCases.join(' ')}`),
    ];
    return {
      name: displayName(meta.component.name),
      purpose: purposeOf(meta),
      implementation: implementationOf(meta),
      scope: meta.governance.status === 'app' ? 'App example' : 'Core',
      summary,
      keywords,
      path: docsId ? `/docs/${docsId}` : '',
    };
  });
}

export function primengCatalogue(): CatalogueEntry[] {
  return PRIMENG_KIT.filter((component) => component.storybook).map((component) => {
    const name =
      PRIMENG_LABEL[component.figma] ??
      component.figma.charAt(0).toUpperCase() + component.figma.slice(1);
    return {
      name,
      purpose: component.purpose,
      implementation: 'PrimeNG' as const,
      scope: 'Core' as const,
      summary: component.plectrum
        ? `PrimeNG ${name}. Plectrum uses ${component.plectrum}.`
        : `PrimeNG ${name}, themed by providePlectrum().`,
      keywords: [component.figma, name, component.code],
      path: component.storybook ?? '',
    };
  });
}

export function buildCatalogue(
  metadata: readonly ComponentMetadata[],
  docsIdByFolder: ReadonlyMap<string, string>,
): CatalogueEntry[] {
  return [...metadataCatalogue(metadata, docsIdByFolder), ...primengCatalogue()];
}

export function matchesCatalogue(
  entry: CatalogueEntry,
  query: string,
  purpose: CataloguePurpose | 'all',
  implementation: CatalogueImplementation | 'all',
  scope: CatalogueScope | 'all',
): boolean {
  if (purpose !== 'all' && entry.purpose !== purpose) return false;
  if (implementation !== 'all' && entry.implementation !== implementation) return false;
  if (scope !== 'all' && entry.scope !== scope) return false;
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = [
    entry.name,
    entry.summary,
    entry.purpose,
    entry.implementation,
    entry.scope,
    ...entry.keywords,
  ]
    .join(' ')
    .toLowerCase();
  return words.every((word) => haystack.includes(word));
}
