import {
  createComponent,
  EnvironmentInjector,
  inject,
  provideAppInitializer,
} from '@angular/core';
import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Button } from 'primeng/button';
import {
  DEFAULT_PLECTRUM_PRESET_VERSION,
  PLECTRUM_PRESET_STORAGE_KEY,
  providePlectrum,
  readStoredPresetVersion,
  writeStoredPresetVersion,
  type PlectrumPresetVersion,
} from '@solidaris/plectrum';
import { providePdsLocale, type PdsLocale } from '../src/lib/i18n';
import { IconRegistry, registerPlectrumIcons } from '../src/lib/icon';
import { installStorybookToastListener } from '../src/storybook/storybook-toast';
import { PlectrumDocsContainer } from './docs-container';
import { DocsAnchor } from './docs-link';

installStorybookToastListener();

function readInitialPreset(): PlectrumPresetVersion {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_PLECTRUM_PRESET_VERSION;
  }

  return (
    readStoredPresetVersion(localStorage) ?? DEFAULT_PLECTRUM_PRESET_VERSION
  );
}

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Plectrum UI locale',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        dynamicTitle: true,
        items: [
          { value: 'fr', title: 'FR' },
          { value: 'nl', title: 'NL' },
        ],
      },
    },
    plectrumPreset: {
      description: 'Plectrum PrimeNG preset version',
      toolbar: {
        title: 'Preset',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'v1', title: 'Preset v1 (default)' },
          { value: 'v0.6', title: 'Preset v0.6 (legacy)' },
        ],
      },
    },
  },
  initialGlobals: {
    locale: 'fr',
    plectrumPreset: readInitialPreset(),
  },
  decorators: [
    (storyFn, context) => {
      const version = (context.globals['plectrumPreset'] ??
        DEFAULT_PLECTRUM_PRESET_VERSION) as PlectrumPresetVersion;
      const locale = (context.globals['locale'] ?? 'fr') as PdsLocale;

      if (typeof localStorage !== 'undefined') {
        writeStoredPresetVersion(version, localStorage);
      }

      return applicationConfig({
        providers: [
          provideAnimationsAsync(),
          providePlectrum(version),
          providePdsLocale(locale),
          provideAppInitializer(() => {
            registerPlectrumIcons(inject(IconRegistry));
            // PrimeNG injects .p-button CSS on first Button create. MDX anchors
            // only wear those classes — mount a detached link button so prose
            // links match pds-docs-link on pages that have not rendered one yet.
            const button = createComponent(Button, {
              environmentInjector: inject(EnvironmentInjector),
            });
            button.instance.link = true;
            button.changeDetectorRef.detectChanges();
          }),
        ],
      })(storyFn, context);
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          'Get started',
          ['Use Plectrum in an app', 'Contribute'],
          'Docs',
          [
            'Writing stories',
            'CSS architecture',
            'Token pipeline',
            'PrimeNG customizations',
            'Releases and versioning',
            'AI strategy',
            "What's new",
            'Component status',
          ],
          'Foundations',
          ['Token finder'],
          'PrimeNG',
          ['Actions', 'Forms', 'Data', 'Content and navigation', 'Overlays'],
          // Core catalogue first; app-owned (status app / candidate) work sits
          // under Patterns/{App}.
          'Custom components',
          'Shell',
          'Patterns',
          ['iSHARE'],
        ],
      },
    },
    // Use the app's page background (--pds-color-surface-page = gray-50 = #f9f9f9)
    // so the shell's own surface/50 (#f6f6f6) background is clearly visible.
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#f9f9f9' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    // Catalogue canvases need an inset. Opt into `fullscreen` only for app
    // chrome (nav shells) and full-page token catalogues that pad themselves.
    layout: 'padded',
    // Pixel widths from $breakpoints in libs/styles/src/01-settings/_settings.breakpoints.scss
    // (xs 36rem/576 · sm 48rem/768 · md 62rem/992 · lg 75rem/1200 · xl 87.5rem/1400).
    viewport: {
      options: {
        xs: {
          name: 'xs · 576px',
          styles: { width: '576px', height: '100%' },
          type: 'mobile',
        },
        sm: {
          name: 'sm · 768px',
          styles: { width: '768px', height: '100%' },
          type: 'tablet',
        },
        md: {
          name: 'md · 992px',
          styles: { width: '992px', height: '100%' },
          type: 'desktop',
        },
        lg: {
          name: 'lg · 1200px',
          styles: { width: '1200px', height: '100%' },
          type: 'desktop',
        },
        xl: {
          name: 'xl · 1400px',
          styles: { width: '1400px', height: '100%' },
          type: 'desktop',
        },
      },
    },
    // addon-a11y × test-runner: WCAG 2.1 AA per story (rules/06-accessibility.md).
    // WCAG 2.1 AA — addon-a11y fails the story when a violation is found.
    a11y: {
      test: 'error',
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
    docs: {
      container: PlectrumDocsContainer,
      components: { a: DocsAnchor },
      toc: {
        headingSelector: 'h2, h3',
        title: 'On this page',
      },
    },
  },
};

export { PLECTRUM_PRESET_STORAGE_KEY };
export default preview;
