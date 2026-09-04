import { readClassNames } from './cssom';
import { pdsOverlayAppendTo } from './storybook-preview-frame';
import {
  clearStorybookToasts,
  renderStorybookToast,
  resolveStorybookPreviewDocument,
  resolveStorybookToastDocument,
  showStorybookToast,
  STORYBOOK_TOAST_HOST_ID,
} from './storybook-toast';

describe('storybook-toast', () => {
  afterEach(() => {
    clearStorybookToasts();
  });

  it('resolves to the current document outside Storybook', () => {
    expect(resolveStorybookPreviewDocument()).toBe(document);
    expect(resolveStorybookToastDocument()).toBe(document);
    expect(pdsOverlayAppendTo()).toBe('body');
  });

  it('registers preview-toast classes in the CSSOM', () => {
    expect(readClassNames(/^sb-preview-toast/)).toEqual(
      jasmine.arrayContaining([
        'sb-preview-toast-host',
        'sb-preview-toast',
        'sb-preview-toast__summary',
        'sb-preview-toast__detail',
      ]),
    );
  });

  it('mounts the toast on the target document body', () => {
    renderStorybookToast(document, {
      summary: 'Copié !',
      detail: 'Territoire: 319',
    });

    const host = document.getElementById(STORYBOOK_TOAST_HOST_ID);
    expect(host).toBeTruthy();
    expect(host?.className).toBe('sb-preview-toast-host');
    expect(host?.textContent).toContain('Copié !');
    expect(host?.textContent).toContain('Territoire: 319');
    expect(host?.querySelector('.sb-preview-toast--success')).toBeTruthy();
    expect(host?.style.position).toBe('fixed');
  });

  it('replaces the previous toast and removes it after life', () => {
    jasmine.clock().install();

    try {
      renderStorybookToast(document, { summary: 'First', life: 2000 });
      renderStorybookToast(document, {
        severity: 'error',
        summary: 'Second',
        life: 2000,
      });

      const host = document.getElementById(STORYBOOK_TOAST_HOST_ID);
      expect(host?.textContent).toBe('Second');
      expect(host?.querySelector('.sb-preview-toast--error')).toBeTruthy();

      jasmine.clock().tick(2000);
      expect(document.getElementById(STORYBOOK_TOAST_HOST_ID)).toBeNull();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('showStorybookToast writes to the current document in unit tests', () => {
    showStorybookToast({ summary: 'Copied', detail: '--pds-radius-md' });

    expect(document.getElementById(STORYBOOK_TOAST_HOST_ID)?.textContent).toContain(
      '--pds-radius-md',
    );
  });
});
