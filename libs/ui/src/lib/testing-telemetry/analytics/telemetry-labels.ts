/** HTML tag names and other non-actionable targets without a captured label. */
export const GENERIC_TELEMETRY_TARGETS = new Set([
  'a',
  'article',
  'button',
  'div',
  'form',
  'g',
  'header',
  'input',
  'label',
  'li',
  'main',
  'nav',
  'p',
  'path',
  'section',
  'span',
  'svg',
  'ul',
]);

const UNIDENTIFIED_TARGET_LABEL = 'Élément non identifié';

/** Whether a target id is a bare HTML tag (or SVG fragment) without semantic meaning. */
export function isGenericTelemetryTarget(target: string | null | undefined): boolean {
  const normalized = target?.trim().toLowerCase() ?? '';
  return !normalized || GENERIC_TELEMETRY_TARGETS.has(normalized);
}

/** French display labels for known telemetry target identifiers. */
const TELEMETRY_TARGET_LABELS: Record<string, string> = {
  'affiliate-overview-info-tags': 'Tags affilié',
  'affiliate-overview-status-action': 'Action statut affilié',
  'archived-only': 'Archives uniquement',
  'cics-modal-search': 'Recherche CICS',
  'document-search': 'Recherche documents',
  'drawer-menu': 'Menu tiroir',
  'drawer-quick-actions': 'Actions rapides',
  'documents-sort': 'Tri documents',
  'filter-sector': 'Filtre secteur',
  'filter-sort': 'Filtre tri',
  'hors-parcours-chip': 'Puce hors parcours',
  'journey-view': 'Vue parcours',
  'session-export': 'Exporter les données',
  'session-new': 'Nouvelle session',
  'session-start': 'Démarrer la session test',
  'session-stop': 'Arrêter la session test',
};

/** French display labels for telemetry event names. */
const TELEMETRY_EVENT_LABELS: Record<string, string> = {
  click: 'Clic',
  idle: 'Inactivité',
  marker: 'Marqueur',
  session_export: 'Export session',
  session_new: 'Nouvelle session',
  session_start: 'Session démarrée',
  session_stop: 'Session arrêtée',
  task_start: 'Tâche démarrée',
  task_stop: 'Tâche terminée',
};

const CET_TIMESTAMP_FORMATTER = new Intl.DateTimeFormat('fr-BE', {
  timeZone: 'Europe/Brussels',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/** Human-readable label for a telemetry target id; falls back to a readable id string. */
export function formatTelemetryTarget(
  target: string | null | undefined,
  label?: string | null,
): string {
  if (label?.trim()) {
    return label.trim();
  }

  if (!target) {
    return '—';
  }

  if (isGenericTelemetryTarget(target)) {
    return UNIDENTIFIED_TARGET_LABEL;
  }

  const known = TELEMETRY_TARGET_LABELS[target];
  if (known) {
    return known;
  }

  return humanizeTelemetryId(target);
}

/** Human-readable label for a telemetry event name. */
export function formatTelemetryEvent(event: string | null | undefined): string {
  if (!event) {
    return '—';
  }

  return TELEMETRY_EVENT_LABELS[event] ?? humanizeTelemetryId(event);
}

/** Formats an ISO timestamp in European style (CET / Europe-Brussels). */
export function formatTimestampCet(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return CET_TIMESTAMP_FORMATTER.format(date);
}

function humanizeTelemetryId(value: string): string {
  if (value.startsWith('#')) {
    return value;
  }

  return value
    .replace(/^document-(row|tag)-/, 'Document $1 ')
    .replace(/^cics-launch-/, 'Lancement CICS ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
