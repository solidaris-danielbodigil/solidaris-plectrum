# @solidaris-danielbodigil/styles

SCSS source package (ITCSS). Relative `@use '../01-settings/...'` resolves inside the tarball.

In the consuming Angular app:

```json
"stylePreprocessorOptions": {
  "includePaths": ["node_modules/@solidaris-danielbodigil/styles/src"]
}
```

Global stylesheet:

```scss
@use 'main';
```
