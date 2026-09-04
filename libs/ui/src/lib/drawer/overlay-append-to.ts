/**
 * Storybook 10 docs `<Canvas>` defaults to a nested iframe (~100px tall).
 * Overlays mounted there are clipped. The visible surface is the preview
 * iframe (`#storybook-preview-iframe`) under the manager window.
 *
 * In apps and unit tests there is no preview iframe, so this returns `'body'`.
 */
export function resolveStorybookPreviewDocument(): Document {
  try {
    const preview = window.top?.document.getElementById(
      'storybook-preview-iframe',
    );
    if (preview instanceof HTMLIFrameElement && preview.contentDocument) {
      return preview.contentDocument;
    }
  } catch {
    // Manager is cross-origin, or this is Karma / a non-Storybook host.
  }

  return document;
}

export function isStorybookPreviewRoot(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    if (window.frameElement?.id === 'storybook-preview-iframe') {
      return true;
    }

    return window.parent === window;
  } catch {
    return true;
  }
}

/** PrimeNG `appendTo` target — preview frame in a docs canvas, otherwise body. */
export function pdsOverlayAppendTo(): HTMLElement | 'body' {
  if (typeof document === 'undefined') {
    return 'body';
  }

  try {
    const preview = resolveStorybookPreviewDocument();
    if (preview !== document) {
      return preview.body;
    }
  } catch {
    // Stay on the current document.
  }

  return 'body';
}
