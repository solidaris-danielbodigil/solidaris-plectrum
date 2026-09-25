import type { ComponentMetadata } from '@solidaris/contracts';
import { resolveComponentDocsPath } from './docs-storybook-index';
import { STATUS_PRESENTATION } from './governance';
import { PRIMENG_KIT } from '../primeng/plectrum-figma';
import { CENTRAL_CANDIDATES } from './candidate-data.generated';

export type CataloguePurpose =
  | 'Actions'
  | 'Forms'
  | 'Navigation'
  | 'Data'
  | 'Feedback'
  | 'Overlays';

export type CatalogueImplementation = 'PrimeNG' | 'Angular' | 'CSS';

export type CatalogueScope = 'Core' | 'Candidate' | 'App-specific' | 'Deprecated';

export interface CatalogueEntry {
  name: string;
  purpose: CataloguePurpose;
  implementation: CatalogueImplementation;
  scope: CatalogueScope;
  summary: string;
  keywords: readonly string[];
  /** Teams whose application source renders this component. Empty for PrimeNG. */
  usedIn: readonly string[];
  /** Storybook docs path. Empty until the Storybook index resolves a page. */
  path: string;
  /** Versioned preview in the contributing application's repository. */
  externalUrl?: string;
  candidateState?: 'Submitted' | 'Accepted for integration' | 'Rejected';
}

const TYPE_PURPOSE: Record<
  ComponentMetadata['component']['type'],
  CataloguePurpose
> = {
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
  docsIdBySource: ReadonlyMap<string, string>,
  usedIn: Readonly<Record<string, readonly string[]>>,
): CatalogueEntry[] {
  return metadata.map((meta) => {
    const docsPath = resolveComponentDocsPath(meta.component.id, docsIdBySource);
    const summary = meta.component.description;
    const keywords = [
      meta.component.name,
      meta.component.bemBlock,
      meta.component.type,
      ...meta.usage.useCases,
      ...taskWords(`${summary} ${meta.usage.useCases.join(' ')}`),
    ];
    return {
      id: meta.component.id,
      name: displayName(meta.component.name),
      purpose: purposeOf(meta),
      implementation: implementationOf(meta),
      scope: STATUS_PRESENTATION[meta.governance.status].label as CatalogueScope,
      summary,
      keywords,
      usedIn: usedIn[meta.component.id] ?? [],
      path: docsPath ?? '',
    };
  });
}

export function primengCatalogue(): CatalogueEntry[] {
  return PRIMENG_KIT.filter((component) => component.storybook).map(
    (component) => {
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
        usedIn: [],
        path: component.storybook ?? '',
      };
    },
  );
}

export function buildCatalogue(
  metadata: readonly ComponentMetadata[],
  docsIdBySource: ReadonlyMap<string, string>,
  usedIn: Readonly<Record<string, readonly string[]>> = {},
): CatalogueEntry[] {
  return [
    ...metadataCatalogue(metadata, docsIdBySource, usedIn),
    ...primengCatalogue(),
    ...candidateCatalogue(CENTRAL_CANDIDATES, new Set(metadata.map((item) => item.component.id))),
  ];
}

export interface CandidateListing {
  id: string;
  operation: 'submit' | 'revise' | 'withdraw';
  componentId: string;
  team: string;
  application: string;
  metadata: { component: { name: string; description: string; type: string; path: string; bemBlock: string }; usage: { useCases: readonly string[] } };
  preview: { url: string; revision: string };
  reviewState?: 'submitted' | 'accepted' | 'rejected';
}

export function candidateCatalogue(candidates: readonly CandidateListing[], coreIds: ReadonlySet<string>): CatalogueEntry[] {
  return candidates.filter((record) => record.operation !== 'withdraw' && !coreIds.has(record.componentId)).map((record) => ({
    name: displayName(record.metadata.component.name),
    purpose: TYPE_PURPOSE[record.metadata.component.type as ComponentMetadata['component']['type']] ?? 'Data',
    implementation: record.metadata.component.path.endsWith('.scss') ? 'CSS' : 'Angular',
    scope: 'Candidate',
    summary: record.metadata.component.description,
    keywords: [record.id, record.componentId, record.application, record.team, record.metadata.component.bemBlock, ...record.metadata.usage.useCases],
    usedIn: [],
    path: '',
    externalUrl: record.preview.url,
    candidateState: record.reviewState === 'accepted' ? 'Accepted for integration' : record.reviewState === 'rejected' ? 'Rejected' : 'Submitted',
  }));
}

export function matchesCatalogue(
  entry: CatalogueEntry,
  query: string,
  purpose: CataloguePurpose | 'all',
  implementation: CatalogueImplementation | 'all',
  scope: CatalogueScope | 'all',
  usedIn: string | 'all' = 'all',
): boolean {
  if (purpose !== 'all' && entry.purpose !== purpose) return false;
  if (implementation !== 'all' && entry.implementation !== implementation)
    return false;
  if (scope !== 'all' && entry.scope !== scope) return false;
  if (usedIn === 'none' && entry.usedIn.length > 0) return false;
  if (usedIn !== 'all' && usedIn !== 'none' && !entry.usedIn.includes(usedIn)) {
    return false;
  }
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = [
    entry.name,
    entry.summary,
    entry.purpose,
    entry.implementation,
    entry.scope,
    ...entry.usedIn,
    ...entry.keywords,
  ]
    .join(' ')
    .toLowerCase();
  return words.every((word) => haystack.includes(word));
}
