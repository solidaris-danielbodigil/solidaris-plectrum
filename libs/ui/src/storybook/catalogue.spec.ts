import { ALL_COMPONENT_METADATA } from './component-metadata';
import { PRIMENG_KIT } from '../primeng/plectrum-figma';
import {
  buildCatalogue,
  matchesCatalogue,
  primengCatalogue,
} from './catalogue';

describe('catalogue generation', () => {
  const docs = new Map([['form-field', 'custom-components-form-field--docs']]);
  const entries = buildCatalogue(ALL_COMPONENT_METADATA, docs);

  it('includes every metadata component and every PrimeNG Figma key', () => {
    const names = entries.map((entry) => entry.name);
    expect(names).toContain('Form Field');
    expect(names).toContain('Empty State');
    expect(names).toContain('Drawer');
    expect(primengCatalogue()).toHaveLength(
      PRIMENG_KIT.filter((component) => component.storybook).length,
    );
    expect(names).toContain('Button');
    expect(names).toContain('InputText');
  });

  it('links a component from the folder name in the Storybook index', () => {
    const formField = entries.find((entry) => entry.name === 'Form Field');
    expect(formField?.path).toBe('/docs/custom-components-form-field--docs');
  });

  it('finds error guidance and a side panel from generated words', () => {
    const errors = entries
      .filter((entry) => matchesCatalogue(entry, 'error', 'all', 'all', 'all'))
      .map((entry) => entry.name);
    const panels = entries
      .filter((entry) => matchesCatalogue(entry, 'side panel', 'all', 'all', 'Core'))
      .map((entry) => entry.name);

    expect(errors).toContain('Form Field');
    expect(panels).toContain('Drawer');
  });
});
