import type { SubNavShellItem, SubNavShellSection } from '@solidaris/ui';
import type { IgedMessageSet } from '../i18n';

export const IGED_DOMAIN_IDS = [
  'dashboard',
  'ac',
  'soins',
  'medical',
  'indemnites',
  'juridique',
  'population',
] as const;

export type IgedDomainId = (typeof IGED_DOMAIN_IDS)[number];

/** Queues that have a real screen in this POC. Everything else is a stub. */
export const IGED_AVAILABLE_ITEM_IDS = new Set([
  'vue-ensemble',
  'at-dc-demande',
]);

const DOMAIN_ICONS: Record<IgedDomainId, string> = {
  dashboard: 'bi bi-columns',
  ac: 'bi bi-shield-plus',
  soins: 'bi bi-heart-pulse',
  medical: 'bi bi-hospital',
  indemnites: 'bi bi-calculator',
  juridique: 'bi bi-book',
  population: 'bi bi-person-vcard',
};

const DOMAIN_DEFAULT_PATH: Record<IgedDomainId, string> = {
  dashboard: '/dashboard/vue-ensemble',
  ac: '/ac',
  soins: '/soins',
  medical: '/medical',
  indemnites: '/indemnites/at-dc-demande',
  juridique: '/juridique',
  population: '/population',
};

const INDEMNITES_ITEMS = {
  atDc: ['at-dc-demande', 'at-dc-mp-rente'] as const,
  autres: [
    'remboursements-164',
    'risques-sociaux',
    'actes-naissance',
    'administration-mc',
    'attestations-vacances',
    'autorisation-tp',
    'courriers-entrants',
    'dossiers-ffe',
    'declaration-revenus',
    'detention',
    'feuilles-renseignements',
    'fraude-sociale',
  ] as const,
  encodage: ['encodage-documents', 'encodage-indus'] as const,
  gestion: [
    'gestion-calcs',
    'gestion-cartes-reprise',
    'gestion-certificats-itt',
    'gestion-comptes-bancaires',
    'gestion-flux-z100',
    'gestion-indus',
    'gestion-listes',
    'gestion-listes-medicales',
    'gestion-proratas',
    'gestion-rejets-macro',
  ] as const,
};

export function isIgedDomainId(value: string): value is IgedDomainId {
  return (IGED_DOMAIN_IDS as readonly string[]).includes(value);
}

export function defaultPathForDomain(domainId: IgedDomainId): string {
  return DOMAIN_DEFAULT_PATH[domainId];
}

export function domainIdFromUrl(url: string): IgedDomainId {
  const segment = url.split(/[/?#]/).filter(Boolean)[0] ?? 'indemnites';
  return isIgedDomainId(segment) ? segment : 'indemnites';
}

export function activeSubNavItemIdFromUrl(url: string): string {
  const path = url.split('?')[0] ?? '';
  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 2) {
    return parts[1];
  }
  const segment = parts[0];
  if (
    segment &&
    isIgedDomainId(segment) &&
    segment !== 'dashboard' &&
    segment !== 'indemnites'
  ) {
    return segment;
  }
  return segment ?? 'at-dc-demande';
}

function navItem(
  id: string,
  label: string,
  routerLink: string,
): SubNavShellItem {
  const available = IGED_AVAILABLE_ITEM_IDS.has(id);
  return {
    id,
    label,
    disabled: !available,
    routerLink: available ? routerLink : undefined,
  };
}

function indemnitesItem(
  id: keyof IgedMessageSet['indemnitesItems'],
  copy: IgedMessageSet,
): SubNavShellItem {
  return navItem(id, copy.indemnitesItems[id], `/indemnites/${id}`);
}

function itemsForDomain(
  domainId: IgedDomainId,
  copy: IgedMessageSet,
): SubNavShellItem[] {
  if (domainId === 'dashboard') {
    return [
      navItem(
        'vue-ensemble',
        copy.dashboardItems.vueEnsemble,
        '/dashboard/vue-ensemble',
      ),
      navItem(
        'mon-panier',
        copy.dashboardItems.monPanier,
        '/dashboard/mon-panier',
      ),
      navItem(
        'abonnements-alertes',
        copy.dashboardItems.abonnements,
        '/dashboard/abonnements-alertes',
      ),
    ];
  }

  if (domainId === 'indemnites') {
    return [
      ...INDEMNITES_ITEMS.atDc,
      ...INDEMNITES_ITEMS.autres,
      ...INDEMNITES_ITEMS.encodage,
      ...INDEMNITES_ITEMS.gestion,
    ].map((id) => indemnitesItem(id, copy));
  }

  return [
    navItem(domainId, copy.domains[domainId], DOMAIN_DEFAULT_PATH[domainId]),
  ];
}

/** All iGED domains as SubNav accordions; leaf queues are the third level. */
export function buildSubNavSections(
  copy: IgedMessageSet,
): SubNavShellSection[] {
  return IGED_DOMAIN_IDS.map((domainId) => ({
    id: domainId,
    label: copy.domains[domainId],
    items: itemsForDomain(domainId, copy),
  }));
}

export interface OverviewFileCard {
  id: string;
  itemId: string;
  title: string;
  domainId: IgedDomainId;
  domainLabel: string;
  domainIcon: string;
  favorite: boolean;
  available: boolean;
  routerLink?: string;
  recus: number;
  attribues: number;
  enTraitement: number;
  incomplets: number;
  rappels: number;
  clotures: number;
}

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
  }
  return Math.abs(h);
}

function mockKpis(
  id: string,
): Pick<
  OverviewFileCard,
  'recus' | 'attribues' | 'enTraitement' | 'incomplets' | 'rappels' | 'clotures'
> {
  const h = hash(id) >>> 0;
  return {
    recus: (h % 70) + 15,
    attribues: ((h >>> 4) % 25) + 5,
    enTraitement: ((h >>> 8) % 20) + 5,
    incomplets: (h >>> 12) % 12,
    rappels: (h >>> 16) % 8,
    clotures: ((h >>> 20) % 60) + 20,
  };
}

const INITIAL_FAVORITES = new Set([
  'indemnites--at-dc-demande',
  'ac--ac',
  'soins--soins',
]);

export function buildOverviewCards(copy: IgedMessageSet): OverviewFileCard[] {
  const cards: OverviewFileCard[] = [];

  for (const section of buildSubNavSections(copy)) {
    if (!isIgedDomainId(section.id)) {
      continue;
    }

    const domainId = section.id;
    for (const item of section.items) {
      if (item.id === 'vue-ensemble') {
        continue;
      }

      const id = `${domainId}--${item.id}`;
      cards.push({
        id,
        itemId: item.id,
        title: item.label,
        domainId,
        domainLabel: copy.domains[domainId],
        domainIcon: DOMAIN_ICONS[domainId],
        favorite: INITIAL_FAVORITES.has(id),
        available: IGED_AVAILABLE_ITEM_IDS.has(item.id),
        routerLink:
          typeof item.routerLink === 'string' ? item.routerLink : undefined,
        ...mockKpis(item.id),
      });
    }
  }

  return cards;
}
