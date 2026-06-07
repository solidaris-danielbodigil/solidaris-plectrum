import { IconRegistry } from './icon.registry';
import { registerPlectrumIcons, SVG_COPY_CONTENT_LEGACY } from './plectrum-icons';

describe('registerPlectrumIcons', () => {
  it('should register copy-content-LEGACY SVG icon', () => {
    const registry = new IconRegistry();
    registerPlectrumIcons(registry);

    const entry = registry.get('copy-content-LEGACY');

    expect(entry).toBeTruthy();
    expect(entry?.svg).toBe(SVG_COPY_CONTENT_LEGACY);
  });
});
