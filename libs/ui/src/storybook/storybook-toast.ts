import {
  isStorybookPreviewRoot,
  resolveStorybookPreviewDocument,
} from './storybook-preview-frame';

export {
  isStorybookPreviewRoot,
  pdsOverlayAppendTo,
  resolveStorybookPreviewDocument,
} from './storybook-preview-frame';

export const PDS_STORYBOOK_TOAST_SOURCE = 'pds-storybook-toast';
export const STORYBOOK_TOAST_HOST_ID = 'pds-sb-preview-toast-host';

export type StorybookToastSeverity = 'success' | 'error' | 'info';

export interface StorybookToast {
  summary: string;
  detail?: string;
  severity?: StorybookToastSeverity;
  life?: number;
}

interface StorybookToastMessage {
  source: typeof PDS_STORYBOOK_TOAST_SOURCE;
  toast: StorybookToast;
}

const HOST_ID = STORYBOOK_TOAST_HOST_ID;

/**
 * Storybook manager (`window.top`) is the only surface that is never clipped
 * by a Canvas or preview iframe. Fall back to the preview document, then self.
 */
export function resolveStorybookToastDocument(): Document {
  try {
    const topDoc = window.top?.document;
    if (topDoc?.getElementById('storybook-preview-iframe')) {
      return topDoc;
    }
  } catch {
    // Cross-origin top, or no manager.
  }

  return resolveStorybookPreviewDocument();
}

function isNestedStorybookCanvas(): boolean {
  try {
    return /iframe\.html/i.test(window.location.href) && window.parent !== window.top;
  } catch {
    return false;
  }
}

function token(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback;
  }

  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

function paintToast(
  host: HTMLElement,
  card: HTMLElement,
  severity: StorybookToastSeverity,
): void {
  const space2 = token('--pds-spacing-2', '0.75rem');
  const space3 = token('--pds-spacing-3', '1rem');
  const space4 = token('--pds-spacing-4', '1.5rem');
  const space6 = token('--pds-spacing-6', '2rem');
  const radius = token('--pds-radius-md', '6px');
  const shadow = token('--pds-shadow-overlay-popover', '0 8px 24px rgba(0, 0, 0, 0.16)');
  const text = token('--pds-color-text', '#333');
  const family = token('--pds-font-family-body', '"Open Sans", sans-serif');
  const background =
    severity === 'success'
      ? token('--pds-color-success-subtle', '#e8f6ee')
      : severity === 'error'
        ? token('--pds-color-danger-subtle', '#fde8e8')
        : token('--pds-color-surface', '#ffffff');

  host.style.cssText = [
    'position:fixed',
    `inset-block-end:${space4}`,
    'inset-inline-start:50%',
    'transform:translateX(-50%)',
    'z-index:2147483646',
    'pointer-events:none',
  ].join(';');

  card.style.cssText = [
    'display:flex',
    'flex-direction:column',
    `gap:${token('--pds-spacing-0-5', '0.25rem')}`,
    'min-inline-size:16rem',
    `max-inline-size:min(32rem, calc(100vw - ${space6}))`,
    `padding:${space2} ${space3}`,
    `border-radius:${radius}`,
    `box-shadow:${shadow}`,
    `background:${background}`,
    `color:${text}`,
    `font-family:${family}`,
    'font-size:0.875rem',
    'line-height:1.4',
  ].join(';');
}

export function showStorybookToast(toast: StorybookToast): void {
  if (typeof window === 'undefined') {
    return;
  }

  const target = resolveStorybookToastDocument();
  renderStorybookToast(target, toast);

  if (target !== document || !isNestedStorybookCanvas()) {
    return;
  }

  const message: StorybookToastMessage = {
    source: PDS_STORYBOOK_TOAST_SOURCE,
    toast,
  };

  try {
    window.parent.postMessage(message, '*');
  } catch {
    // Local toast already rendered.
  }
}

export function installStorybookToastListener(): void {
  if (typeof window === 'undefined' || !isStorybookPreviewRoot()) {
    return;
  }

  const installed = window as Window & { __pdsSbToastInstalled?: boolean };
  if (installed.__pdsSbToastInstalled) {
    return;
  }

  installed.__pdsSbToastInstalled = true;
  window.addEventListener('message', (event: MessageEvent<StorybookToastMessage>) => {
    if (event.data?.source !== PDS_STORYBOOK_TOAST_SOURCE || !event.data.toast) {
      return;
    }

    renderStorybookToast(resolveStorybookToastDocument(), event.data.toast);
  });
}

export function clearStorybookToasts(target?: Document): void {
  const docs = new Set<Document>();
  if (target) {
    docs.add(target);
  } else {
    docs.add(document);
    try {
      if (window.top?.document) {
        docs.add(window.top.document);
      }
    } catch {
      // ignore
    }
  }

  for (const doc of docs) {
    doc.getElementById(HOST_ID)?.remove();
  }
}

export function renderStorybookToast(
  target: Document,
  toast: StorybookToast,
): void {
  const life = toast.life ?? 2000;
  const severity = toast.severity ?? 'success';
  let host = target.getElementById(HOST_ID);

  if (!host) {
    host = target.createElement('div');
    host.id = HOST_ID;
    host.className = 'sb-preview-toast-host';
    host.setAttribute('aria-live', 'polite');
    target.body.appendChild(host);
  }

  host.replaceChildren();

  const card = target.createElement('div');
  card.className = `sb-preview-toast sb-preview-toast--${severity}`;
  card.setAttribute('role', 'status');

  const summary = target.createElement('p');
  summary.className = 'sb-preview-toast__summary';
  summary.style.margin = '0';
  summary.style.fontWeight = '600';
  summary.textContent = toast.summary;
  card.appendChild(summary);

  if (toast.detail) {
    const detail = target.createElement('p');
    detail.className = 'sb-preview-toast__detail';
    detail.style.margin = '0';
    detail.textContent = toast.detail;
    card.appendChild(detail);
  }

  paintToast(host, card, severity);
  host.appendChild(card);

  const view = target.defaultView ?? window;
  view.setTimeout(() => {
    card.remove();
    if (host && host.childElementCount === 0) {
      host.remove();
    }
  }, life);
}
