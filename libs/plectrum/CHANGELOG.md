# @solidaris/plectrum

## 1.0.0

### Major Changes

- 5a886d4: Rename the three Core catalogue APIs to domain-neutral names: ListDocument* → ListEntry*, pds-affiliate-overview-card → pds-profile-card, pds-affiliate-detail-drawer → pds-profile-drawer. Keyword-to-icon inference moves to iSHARE; ProfileDrawerData uses generalRows / contactRows / relatedMembers.

### Minor Changes

- f152b62: Promote `pds-toolbar` from Candidate (iSHARE) to Core so every application can import it.
- eb922bb: Add an optional hint on form-field and require Storybook play tests on every component. Catalogue stories, a11y reports, Chromatic, and story coverage run in CI; toolbar row/column gap classes now apply.

### Patch Changes

- f699043: Publish `@solidaris/ui`, `@solidaris/plectrum`, and `@solidaris/styles` as versioned packages (APF for the Angular libs, SCSS source for styles).
