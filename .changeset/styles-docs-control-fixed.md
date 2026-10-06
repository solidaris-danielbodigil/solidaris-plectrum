---
"@solidaris-danielbodigil/pds-styles": patch
---

Docs search fields keep a fixed width while typing: `.c-docs-control--fixed` sizes the input to 24rem, clamped to its column, instead of growing and shrinking with each keystroke. This ships the change from `add90a1`, which reached `libs/styles` after 2.1.0 was published without a version bump.
