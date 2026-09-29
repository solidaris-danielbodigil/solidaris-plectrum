# @solidaris-danielbodigil/pds-styles

SCSS source package (ITCSS). Relative `@use '../01-settings/...'` resolves inside the tarball.

In the consuming Angular app:

```json
"stylePreprocessorOptions": {
  "includePaths": ["node_modules/@solidaris-danielbodigil/pds-styles/src"]
}
```

Global stylesheet:

```scss
@use 'main';
```

Use a Sass-capable application builder and register this global stylesheet in both Angular and the application's local Storybook. This package supplies shared SCSS; it does not install the builder or generate application folders.

Application styles should follow ITCSS/BEMIT too. Create empty local layers from `01-settings` through `08-trumps`, put component partials in `src/styles/06-components`, and wire each import once. Keep shared tokens and styles in the installed package. When adding a local `main.scss`, make its import distinct from the package entry point and preserve shared/local layer order so component styles do not follow utilities accidentally.

The current devkit does not generate this structure or register candidate style imports. See [Build with Plectrum](https://solidaris-danielbodigil.github.io/solidaris-plectrum/storybook/latest/?path=/docs/get-started-use-plectrum-in-an-app--docs) for the release-specific setup, fonts, icons and theme integration. Agenda fonts are currently supplied separately from this package.
