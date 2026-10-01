# @solidaris/styles

## 2.0.4

### Patch Changes

- c8ea036: Ship Open Sans with the styles package. The latin variable font (weights 300–800, SIL Open Font License) is in `assets/fonts/open-sans/` and loaded by `04-elements`; applications that copy the package's `assets/fonts` folder get it with Agenda, without loading Open Sans from another source.

## 2.0.3

### Patch Changes

- a00b0ca: Mark the v0.6 preset as deprecated while retaining it for migration comparisons. Ship Agenda font files in `pds-styles` and generate FR/NL and preset controls in application Storybook previews. Remove the test-only SCSS component.

## 2.0.2

### Patch Changes

- c335207: Move the distributable packages to new Plectrum names so their first GitHub Packages publication can be verified as private. The earlier package names remain a public historical release.

## 2.0.1

### Patch Changes

- 6094cfa: Figma token sync 8baef65.

  0 values changed, 172 added, 0 removed.
  Review the sync report before merging. Adjust the bump if the change is not a patch.

## 2.0.0

## 1.0.0

### Major Changes

- 5a886d4: Rename the three Core catalogue APIs to domain-neutral names: ListDocument* → ListEntry*, pds-affiliate-overview-card → pds-profile-card, pds-affiliate-detail-drawer → pds-profile-drawer. Keyword-to-icon inference moves to iSHARE; ProfileDrawerData uses generalRows / contactRows / relatedMembers.

### Minor Changes

- f152b62: Promote `pds-toolbar` from Candidate (iSHARE) to Core so every application can import it.
- eb922bb: Add an optional hint on form-field and require Storybook play tests on every component. Catalogue stories, a11y reports, Chromatic, and story coverage run in CI; toolbar row/column gap classes now apply.

### Patch Changes

- f699043: Publish `@solidaris/ui`, `@solidaris/plectrum`, and `@solidaris/styles` as versioned packages (APF for the Angular libs, SCSS source for styles).
