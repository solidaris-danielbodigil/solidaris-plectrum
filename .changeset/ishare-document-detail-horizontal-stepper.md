---
"@solidaris-danielbodigil/pds-styles": patch
---

iShare affiliate document detail: the horizontal stepper is the only layout. The A/B test is over and users chose A (horizontal). The vertical variant (B) and its layout switch are removed.

- **Removed iShare page classes** (not part of any contract): the `c-affiliate-document-detail__stepper--vertical` modifier and its rules, and the `c-affiliate-document-detail__vertical-step-nav` row. The horizontal stepper rules on `c-affiliate-document-detail__stepper` no longer sit behind `:not(.c-affiliate-document-detail__stepper--vertical)`. Their specificity drops from (0,3,0) to (0,2,0) and the rendered values do not change.
- **Tokens**: none deprecated. The vertical rules only read `--pds-spacing-1`, which the horizontal stepper still uses.
- **Worker comment copy**: each worker-comment `p-message` in the document panels now has an icon-only "Copier le message" button at its inline end. The comment text and the button are projected through the PrimeNG `#container` template, so the severity icon stays PrimeNG-rendered. The layout uses `o-flex` / `o-layout` mixes, so this adds no SCSS. On a successful copy, the page shows the existing "Copié !" toast.
