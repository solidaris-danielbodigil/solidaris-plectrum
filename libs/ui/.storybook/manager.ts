/**
 * Storybook manager chrome — Plectrum brand theme.
 *
 * The manager runs outside the preview iframe, so it cannot read the compiled
 * --pds-* custom properties (rule 10 applies to docs content, not UI chrome).
 * Every colour below is a token literal, cited to its source:
 *   primary        #487395  — primary.600 (tokens.json → --pds-color-primary-600)
 *   page surface   #f9f9f9  — gray.50 (--pds-color-surface-page)
 *   content bg     #ffffff  — surface.0
 *   panel border   #e7e7e7  — --pds-color-panel-border
 *   card border    #d1d1d1  — --pds-color-card-border
 *   text           #0a0a0a  — --pds-color-text
 * Logo assets ship from libs/assets (served at /assets by the storybook target).
 */
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const plectrumTheme = create({
  base: 'light',

  brandTitle: 'Plectrum Design System',
  brandUrl: 'https://zeroheight.com/5cba76f64/p/8028d1-plectrum-design-system',
  brandImage: './assets/Logo.svg',
  brandTarget: '_blank',

  colorPrimary: '#487395',
  colorSecondary: '#487395',

  appBg: '#f9f9f9',
  appContentBg: '#ffffff',
  appPreviewBg: '#f9f9f9',
  appBorderColor: '#e7e7e7',
  appBorderRadius: 8,

  textColor: '#0a0a0a',
  textInverseColor: '#ffffff',

  barTextColor: '#5f5f5f',
  barSelectedColor: '#487395',
  barHoverColor: '#487395',
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#d1d1d1',
  inputTextColor: '#0a0a0a',
  inputBorderRadius: 6,

  fontBase:
    '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: 'ui-monospace, "Cascadia Code", Consolas, monospace',
});

addons.setConfig({
  theme: plectrumTheme,
});
