import type { ComponentFact, DrillTarget, Severity } from '@pds-internal/insights';

export type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

const SEVERITY_TAG: Record<Severity, TagSeverity> = {
  critical: 'danger',
  high: 'warn',
  medium: 'info',
  low: 'secondary',
};

const SEVERITY_ICON: Record<Severity, string> = {
  critical: 'bi bi-exclamation-octagon',
  high: 'bi bi-exclamation-triangle',
  medium: 'bi bi-info-circle',
  low: 'bi bi-dot',
};

const STATUS_TAG: Record<ComponentFact['status'], TagSeverity> = {
  core: 'success',
  app: 'info',
  deprecated: 'warn',
  candidate: 'secondary',
};

export function severityTag(severity: Severity): TagSeverity {
  return SEVERITY_TAG[severity];
}

export function severityIcon(severity: Severity): string {
  return SEVERITY_ICON[severity];
}

export function statusTag(status: ComponentFact['status']): TagSeverity {
  return STATUS_TAG[status];
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const DAY_MS = 86_400_000;

export function daysBetween(fromIso: string | null | undefined, now: Date): number | null {
  if (!fromIso) return null;
  const from = Date.parse(fromIso);
  return Number.isNaN(from) ? null : Math.max(0, Math.floor((now.getTime() - from) / DAY_MS));
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatAge(days: number | null): string {
  if (days === null) return '—';
  if (days === 0) return 'today';
  return days === 1 ? '1 day' : `${days} days`;
}

/** "today", "1 day ago", "12 days ago" */
export function formatAgo(days: number | null): string {
  if (days === null) return '—';
  return days === 0 ? 'today' : `${formatAge(days)} ago`;
}

export function percent(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

/** Query params that open the drill-down drawer for a target. */
export function drillParams(target: DrillTarget): Record<string, string> {
  const params: Record<string, string> = {};
  for (const key of ['app', 'component', 'candidate', 'cluster', 'evalCase'] as const) {
    const value = target[key];
    if (value) params[key] = value;
  }
  return params;
}

/** "a, b and c" */
export function listSentence(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
