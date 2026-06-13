const INTERACTIVE_SELECTOR =
  'button, a, [role="button"], input, select, textarea, label, p-button, p-accordion-header, [data-telemetry-id], [data-test]';

const SVG_GRAPHIC_TAGS = new Set([
  'circle',
  'g',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
  'svg',
  'use',
]);

const PRIMENG_INTERNAL_ID = /^pn_id_\d+$/i;

const LANDMARK_ROLES = new Set([
  'banner',
  'complementary',
  'contentinfo',
  'form',
  'main',
  'navigation',
  'region',
  'search',
]);

export interface ClickTargetResolution {
  /** Stable machine id (`data-telemetry-id` or fallback). */
  id: string;
  /** Human-readable label from heuristics or `data-test` when present. */
  label?: string;
}

/** Resolves stable id and optional human label for a click event target. */
export function resolveClickTarget(target: EventTarget | null): ClickTargetResolution {
  if (!(target instanceof Element)) {
    return { id: 'unknown' };
  }

  const clicked = target;
  const interactive = findInteractiveElement(clicked);
  const el = interactive ?? clicked;
  const id = resolveClickTargetId(clicked);
  const label = resolveClickTargetLabel(clicked, el);

  return label ? { id, label } : { id };
}

/** Resolves a stable, machine-meaningful identifier for a click event target. */
export function describeClickTarget(target: EventTarget | null): string {
  return resolveClickTarget(target).id;
}

function findInteractiveElement(start: Element): Element | null {
  if (SVG_GRAPHIC_TAGS.has(start.tagName.toLowerCase())) {
    const control = start.closest('button, a, [role="button"], p-button');
    if (control) {
      return control;
    }
  }

  return start.closest(INTERACTIVE_SELECTOR);
}

function resolveClickTargetId(clicked: Element): string {
  const telemetryId = findTelemetryId(clicked);
  if (telemetryId) {
    return telemetryId;
  }

  const interactive = findInteractiveElement(clicked);
  const el = interactive ?? clicked;
  const elementId = el.id?.trim();
  if (elementId && !isPrimengInternalId(elementId)) {
    return elementId;
  }

  return el.tagName.toLowerCase();
}

function resolveClickTargetLabel(clicked: Element, el: Element): string | null {
  const dataTest = findDataTest(clicked);
  if (dataTest) {
    return dataTest;
  }

  const direct = extractElementLabel(el);
  if (direct) {
    return direct;
  }

  if (clicked !== el) {
    const fromClicked = extractElementLabel(clicked);
    if (fromClicked) {
      return fromClicked;
    }
  }

  const accordionHeader = readAccordionHeaderText(clicked);
  if (accordionHeader) {
    return accordionHeader;
  }

  return findLabelFromAncestors(clicked.parentElement, el);
}

function extractElementLabel(el: Element): string | null {
  if (isButtonLike(el)) {
    return (
      readAttributeLabel(el) ??
      readPrimeNgButtonLabel(el) ??
      readMeaningfulText(el) ??
      readTitle(el)
    );
  }

  if (isInputLike(el)) {
    return (
      readAssociatedLabel(el) ??
      readPlaceholder(el) ??
      readAttributeLabel(el) ??
      readInputName(el)
    );
  }

  if (el.tagName.toLowerCase() === 'a') {
    return readMeaningfulText(el) ?? readAttributeLabel(el) ?? readTitle(el);
  }

  if (el.tagName.toLowerCase() === 'p-accordion-header') {
    return readMeaningfulText(el);
  }

  if (el.getAttribute('role') === 'button') {
    return (
      readAttributeLabel(el) ??
      readMeaningfulText(el) ??
      readTitle(el)
    );
  }

  return (
    readAttributeLabel(el) ??
    readLandmarkLabel(el) ??
    readMeaningfulText(el)
  );
}

function findLabelFromAncestors(
  start: Element | null,
  stopBefore: Element,
): string | null {
  let current = start;

  while (current && current !== stopBefore) {
    const dataTest = current.getAttribute('data-test')?.trim();
    if (dataTest) {
      return dataTest;
    }

    const ariaLabel = readAttributeLabel(current);
    if (ariaLabel) {
      return ariaLabel;
    }

    const landmark = readLandmarkLabel(current);
    if (landmark) {
      return landmark;
    }

    const text = readMeaningfulText(current);
    if (text) {
      return text;
    }

    current = current.parentElement;
  }

  return null;
}

function isButtonLike(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  return tag === 'button' || tag === 'p-button' || el.getAttribute('role') === 'button';
}

function isInputLike(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select';
}

function readAttributeLabel(el: Element): string | null {
  const ariaLabel = el.getAttribute('aria-label')?.trim();
  if (ariaLabel && !isPrimengInternalId(ariaLabel)) {
    return ariaLabel;
  }

  const labelledBy = el.getAttribute('aria-labelledby')?.trim();
  if (labelledBy && typeof document !== 'undefined') {
    const labelText = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (labelText && labelText.length <= 80) {
      return labelText;
    }
  }

  return null;
}

function readTitle(el: Element): string | null {
  const title = el.getAttribute('title')?.trim();
  if (title && !isPrimengInternalId(title)) {
    return title;
  }
  return null;
}

function readPlaceholder(el: Element): string | null {
  const placeholder = el.getAttribute('placeholder')?.trim();
  return placeholder || null;
}

function readInputName(el: Element): string | null {
  const name = el.getAttribute('name')?.trim();
  if (!name || isPrimengInternalId(name)) {
    return null;
  }
  return name;
}

function readAssociatedLabel(input: Element): string | null {
  const id = input.getAttribute('id')?.trim();
  if (id && typeof document !== 'undefined') {
    const associated = document.querySelector(`label[for="${cssEscape(id)}"]`);
    if (associated) {
      return readMeaningfulText(associated);
    }
  }

  const parentLabel = input.closest('label');
  if (parentLabel) {
    return readMeaningfulText(parentLabel);
  }

  return null;
}

function readPrimeNgButtonLabel(el: Element): string | null {
  const host =
    el.tagName.toLowerCase() === 'p-button'
      ? el
      : el.closest('p-button');
  if (!host) {
    return null;
  }

  const labelEl = host.querySelector('.p-button-label');
  return labelEl ? readMeaningfulText(labelEl) : null;
}

function readAccordionHeaderText(start: Element): string | null {
  const header =
    start.closest('p-accordion-header') ??
    start.querySelector('p-accordion-header');
  return header ? readMeaningfulText(header) : null;
}

function readLandmarkLabel(el: Element): string | null {
  const role = el.getAttribute('role')?.trim();
  if (!role || !LANDMARK_ROLES.has(role)) {
    return null;
  }

  return readAttributeLabel(el) ?? readMeaningfulText(el);
}

function findTelemetryId(start: Element): string | null {
  const host = start.closest('[data-telemetry-id]');
  const value = host?.getAttribute('data-telemetry-id')?.trim();
  return value || null;
}

function findDataTest(start: Element): string | null {
  const host = start.closest('[data-test]');
  const value = host?.getAttribute('data-test')?.trim();
  return value || null;
}

function readMeaningfulText(el: Element): string | null {
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  if (!text || text.length > 80) {
    return null;
  }

  return text;
}

function isPrimengInternalId(value: string): boolean {
  return PRIMENG_INTERNAL_ID.test(value);
}

function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/"/g, '\\"');
}
