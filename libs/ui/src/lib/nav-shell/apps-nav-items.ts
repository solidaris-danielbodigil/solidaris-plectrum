import type { NavItem } from './nav-item.model';

export const IGED_NAV_ICON = 'logo-iged';

export type PlectrumAppId = 'icrm' | 'ishare' | 'iged';

const PAGES_BASE = '/solidaris-plectrum';

const LOCAL_DEV_PORTS: Record<Exclude<PlectrumAppId, 'icrm'>, string> = {
  ishare: '4200',
  iged: '4210',
};

/**
 * Shared first-level shell rail — every Plectrum app passes the same items
 * and marks its own `activeItemId`. Sibling apps get an `href` at runtime via
 * `plectrumAppsNavItems()`.
 */
export const PLECTRUM_APPS_NAV_ITEMS: NavItem[] = [
  { id: 'icrm', label: 'iCRM', icon: 'logo-icrm', iconSource: 'svg' },
  { id: 'ishare', label: 'iShare', icon: 'logo-ishare', iconSource: 'svg' },
  { id: 'iged', label: 'iGED', icon: IGED_NAV_ICON, iconSource: 'svg' },
];

export function isPlectrumAppId(value: string): value is PlectrumAppId {
  return value === 'icrm' || value === 'ishare' || value === 'iged';
}

/** Resolve a sibling-app URL for GitHub Pages or local `ng serve`. */
export function resolvePlectrumAppHref(
  appId: PlectrumAppId,
  loc: Pick<Location, 'origin' | 'pathname' | 'hostname' | 'protocol'> | undefined =
    typeof globalThis !== 'undefined' ? globalThis.location : undefined,
): string | undefined {
  if (!loc || appId === 'icrm') {
    return undefined;
  }

  if (loc.pathname.includes(PAGES_BASE)) {
    const base = `${loc.origin}${PAGES_BASE}`;
    return appId === 'ishare' ? `${base}/` : `${base}/iged/`;
  }

  if (loc.hostname === 'localhost' || loc.hostname === '127.0.0.1') {
    return `${loc.protocol}//${loc.hostname}:${LOCAL_DEV_PORTS[appId]}/`;
  }

  return undefined;
}

/** Same rail items with `href` filled for every app except the current one. */
export function plectrumAppsNavItems(currentAppId: PlectrumAppId): NavItem[] {
  return PLECTRUM_APPS_NAV_ITEMS.map((item) => {
    if (item.id === currentAppId || !isPlectrumAppId(item.id)) {
      return item;
    }

    const href = resolvePlectrumAppHref(item.id);
    return href ? { ...item, href } : item;
  });
}
