/** @type {import('stylelint').Config} */
export default {
  defaultSeverity: 'warning',
  customSyntax: 'postcss-scss',
  plugins: ['./tools/stylelint/no-layout-in-components.mjs'],
  rules: {
    'pds/no-layout-in-components': [true, { severity: 'warning' }],
  },
};
