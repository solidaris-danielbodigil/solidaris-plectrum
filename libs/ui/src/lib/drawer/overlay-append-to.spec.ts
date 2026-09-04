import { pdsOverlayAppendTo, resolveStorybookPreviewDocument } from './overlay-append-to';

describe('overlay-append-to', () => {
  it('targets body outside Storybook', () => {
    expect(resolveStorybookPreviewDocument()).toBe(document);
    expect(pdsOverlayAppendTo()).toBe('body');
  });
});
