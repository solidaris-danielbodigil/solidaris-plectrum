---
"@solidaris-danielbodigil/pds-styles": minor
---

`c-affiliate-search-panel` (iShare affiliate lookup card) is now full width: its `max-width` rule is removed. Its fields are no longer stretched across the card: each `c-affiliate-search-panel__field` keeps a token width in a wrapping row and shrinks below it on narrow viewports, like the affiliate documents filter toolbar. New tokens: `--pds-size-affiliate-search-field` (250px @ 14px base) and `--pds-size-affiliate-search-query-field` (360px, used by the `c-affiliate-search-panel__field--query` modifier for the identifier input and its submit button). `--pds-size-affiliate-search-panel-max` is deprecated: still declared but no longer read, removed in a later release. Drop any override of it.
