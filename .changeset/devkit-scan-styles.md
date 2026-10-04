---
"@solidaris-danielbodigil/pds-devkit": patch
---

Adoption reports now also detect styles-only components (Accordion, Drawer, Skeleton Slot, Timeline, Detail List…) by their BEM block class — the block, an element or a modifier such as `c-accordion--bordered`, in templates and class strings — so usage counts for those components appear in reports. The report limitations say so. The scanner is exported as `scanObservations(root, sourceFiles, catalogue)` for central tooling; Angular components are still matched by named import or selector, unchanged.

The central registry now accepts usage reports (`operations.reportIngestionEnabled: true`); the toolkit's registry snapshot carries the new value.
