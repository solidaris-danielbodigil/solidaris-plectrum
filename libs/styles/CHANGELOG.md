# @solidaris/styles

## 2.1.1

### Patch Changes

- 846506d: Docs search fields keep a fixed width while typing: `.c-docs-control--fixed` sizes the input to 24rem, clamped to its column, instead of growing and shrinking with each keystroke. This ships the change from `add90a1`, which reached `libs/styles` after 2.1.0 was published without a version bump.

## 2.1.0

### Minor Changes

- 4c40610: `c-affiliate-search-panel` (iShare affiliate lookup card) is now full width: its `max-width` rule is removed. Its fields are no longer stretched across the card: each `c-affiliate-search-panel__field` keeps a token width in a wrapping row and shrinks below it on narrow viewports, like the affiliate documents filter toolbar. New tokens: `--pds-size-affiliate-search-field` (250px @ 14px base) and `--pds-size-affiliate-search-query-field` (360px, used by the `c-affiliate-search-panel__field--query` modifier for the identifier input and its submit button). `--pds-size-affiliate-search-panel-max` is deprecated: still declared but no longer read, removed in a later release. Drop any override of it.
- 4c40610: iShare affiliate details: the documents filter toolbar is always visible, and the category tabs are plain PrimeNG tabs.
  - **Filter toolbar**: the "Filtres" toggle in the documents card header and the collapse chevron ("Masquer les filtres") are removed. The toolbar renders by default, without the collapsible shell and its height, slide and elevation animation. The document search moves from the documents card header into the toolbar as its first field, with a visible "Rechercher un document" label (same width, label and small size as the other fields; same id, placeholder, clear button and telemetry). When at least one filter is active, an "Effacer les filtres" text button with the active-filter count badge sits at the end of the filter row. The search is not counted as a filter and is not reset by that action. Clearing the filters moves focus to the Secteur field.
  - **Category tabs**: the eye visibility toggles are removed. The three tabs (Parcours, Documents, Archivés) keep the PrimeNG defaults: sized to their content, left-aligned, with the preset tab padding. When they do not fit, the PrimeNG tab list scrolls with its navigators instead of clipping the text (WCAG 1.4.10). The tab list is named "Catégories de documents" through the `tabList` pass-through. The active tab's count badge is filled primary through a scoped `--p-badge-*` bridge on `c-affiliate-details__category-tabs`, and the inactive tabs use `severity="secondary"`. Empty categories use the native PrimeNG disabled tab (`p-disabled`) instead of a tooltip and page modifier.
  - **One category at a time**: the category accordions are removed. The tabs no longer scroll to an accordion panel; they switch PrimeNG tab panels (`p-tabpanels` / `p-tabpanel`, not lazy), so the documents card shows only the selected category's list. Each tab's `aria-controls` points to its tab panel, and the panel is labelled by its tab. Arrow keys move focus between tabs, Enter or Space selects one. Switching tabs starts the list at the top and keeps the document shown in the detail card. Selecting a document in another category (Document précédent / suivant, a cross-reference, the status action deep link or the "Dernière action" pick) switches to that category's tab. When a filter empties the selected tab, the first enabled tab is selected. A filter change that keeps the selected document visible leaves the user's tab as it is. When no document matches the filters, the selected panel shows the "Aucun document trouvé" empty state. The per-category "Aucun document ne correspond à ce filtre." message is removed: a disabled tab can no longer be opened, so the message could not be reached. The tab panels sit inside the card's existing padding through a scoped `--p-tabs-tabpanel-padding` bridge on `c-affiliate-details__category-tabs` (no second inset).
  - **Deprecated tokens** (still declared, no longer read, removed in a later release): `--pds-duration-toolbar-height`, `--pds-duration-toolbar-slide`, `--pds-duration-toolbar-elevation`, `--pds-shadow-affiliate-documents-toolbar-none`, `--pds-space-tab-padding-block` and `--pds-space-tab-padding-inline` (the `--p-tabs-tab-padding` bridge on `c-affiliate-details__category-tabs` is removed; values unchanged), `--pds-size-affiliate-details-documents-search-max` and `--pds-size-affiliate-details-documents-header-actions-min` (the search moved into the toolbar), `--pds-size-affiliate-details-category-label-min` (the accordion header labels are removed).
  - **Filter fields**: the toolbar fields can shrink below `--pds-size-affiliate-documents-filter-field` and `--pds-size-affiliate-documents-filter-date-field`, so they fit a 320px toolbar. Desktop widths do not change.
  - **Column floors**: the documents and detail cards cap `--pds-size-affiliate-details-documents-column-min` and `--pds-size-affiliate-details-detail-column-min` at the row width (`min(100%, …)`), so on narrow viewports the cards and the tab-list navigators no longer overflow past the screen edge. Desktop widths do not change.
  - **Filter count announcement**: a polite `role="status"` region in the toolbar reads "1 filtre actif" or "N filtres actifs", and "Filtres effacés" after the clear action.
  - **Removed iShare page classes** (not part of any contract): `c-affiliate-documents-toolbar-shell`, `c-affiliate-documents-toolbar-shell__clip`, `c-affiliate-documents-toolbar__panel`, `c-affiliate-details__category-eye`, `c-affiliate-details__category-eye--disabled`, `c-affiliate-details__category-tab--disabled`, `c-affiliate-details__documents-header-top`, `c-affiliate-details__documents-header-actions`, `c-affiliate-details__documents-search`, `c-affiliate-details__documents-search-input`, `c-affiliate-details__category-accordion`, `c-affiliate-details__category-panel-header`, `c-affiliate-details__category-panel-label`, `c-affiliate-details__category-panel-count`, `c-affiliate-details__category-panel-count-label`, `c-affiliate-details__category-panel-badge` and `c-affiliate-details__category-empty-filter`. The `category-panel-parcours`, `category-panel-isoles` and `category-panel-archives` element ids are removed; the tab panels use the PrimeNG-generated ids.
  - **Telemetry** (`pds-ui`): the `category-toggle-parcours`, `category-toggle-isoles` and `category-toggle-archives` target labels are removed, and `documents-filters-clear` ("Effacer les filtres") is added. The iShare page no longer emits the `documents-filters-toggle`, `documents-filter-toolbar-close` and `category-toggle-*` targets; `documents-filters-count` and `documents-filters-clear` now sit inside the toolbar. The `category-tab-*` targets are unchanged; the removed accordion headers had no telemetry id. Update any telemetry filter or test selector keyed on them.

- 4c40610: List group header: the type (`titleAccent`) and the dates now share a second line under the group title. The dates are grouped in `c-list__date-range` as `start - end`, or the single known date. The divider is removed on group rows.
  - **Colour**: dates use `--pds-color-list-date-value` (surface-700), darker than the former label colour. `--pds-color-list-date-label` (surface-500) is deprecated: still declared but no longer read, removed in a later release.
  - **Accessibility**: the "Date de début / fin" labels are screen-reader only, and the group treeitem accessible name now includes the localised dates (FR/NL), e.g. "Parcours Indemnités - Demande primaire, Date de début 24/11/2025, Date de fin 24/12/2025".
  - **Telemetry**: the group label is now `Title - Type` (previously `Title Type`), and the treeitem name, previously `TitleType`, now starts with `Title - Type`. Update any telemetry filter or test selector keyed on the old label.
  - **API**: `ListGroup` is unchanged. Remove a trailing " -" from group titles, since the type no longer follows the title on the same line.
  - **Internal markup**: the template elements `c-list__dates`, `c-list__date`, `c-list__date--end` and `c-list__date-value` are no longer rendered or styled. They were never part of the documented anatomy.
  - **Tag severity**: `ListEntryStatus.severity` and `ListEntryTag.severity` also accept `contrast`, rendered as the dark PrimeNG tag.

- 9b6aa68: Add Profile Header (`pds-profile-header`, `plectrum:profile-header`), the Core shell header from the Figma Profile header design. It keeps the Profile Card content and logic with the new layout: the name is an outlined primary Button that opens the profile (Alt+A shortcut, shown in its tooltip), the status action is a Button — or a SplitButton when several actions wait, whose main button and chevron both open the menu — quick filters are PrimeNG ToggleButtons (display-only tags stay PrimeNG Tags), identifiers use the new inplace chip, and the severity gradient is unchanged. Slots `[slot=actions]`, `[slot=aside]`, `[slot=nav]` and `[slot=nav-end]` take the application's page actions, an aside panel and the shell tabs. Styles and tokens live in `_components.profile-header.scss` and `_settings.profile-header.scss` (`--pds-*-profile-header-*`).

  iShare's app shell now uses `pds-profile-header` instead of `pds-profile-card`.

  Copyable Text gains two opt-in inputs, `iconPosition` (`'start'` default | `'end'`) and `labelWeight` (`'semibold'` default | `'regular'`); existing chips are unchanged.

  Profile Card is deprecated with `replacementId: 'plectrum:profile-header'` and is removed in the next major. Migration — same inputs and outputs, renamed types:

  | Profile Card                                                                    | Profile Header                                                                                     |
  | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
  | `pds-profile-card` / `ProfileCardComponent`                                     | `pds-profile-header` / `ProfileHeaderComponent`                                                    |
  | `ProfileCardVariant`                                                            | `ProfileHeaderVariant`                                                                             |
  | `ProfileCardStatusAction` / `ProfileCardStatusSeverity`                         | `ProfileHeaderStatusAction` / `ProfileHeaderStatusSeverity`                                        |
  | `ProfileCardInfoTag` / `ProfileCardInfoTagFilterKey`                            | `ProfileHeaderInfoTag` / `ProfileHeaderInfoTagFilterKey` (now `string`)                            |
  | `ProfileCardIdentifier`                                                         | `ProfileHeaderIdentifier`                                                                          |
  | `ProfileCardPrimaryAction`                                                      | `ProfileHeaderPrimaryAction`                                                                       |
  | `primaryAction.icon` left of the name                                           | right of the name, default `bi bi-person-square` — drop `icon: 'bi bi-eye'` to get the Figma glyph |
  | `statusAction.icon` default `bi-exclamation-triangle-fill` (several actions)    | severity default `bi-check-lg` / `bi-exclamation-triangle` / `bi-exclamation-octagon`              |
  | Telemetry `affiliate-overview-primary-action` / `-status-action` / `-info-tags` | `profile-header-name-action` / `-status-action` / `-info-tags`                                     |

### Patch Changes

- 4c40610: iShare affiliate document detail: the horizontal stepper is the only layout. The A/B test is over and users chose A (horizontal). The vertical variant (B) and its layout switch are removed.
  - **Removed iShare page classes** (not part of any contract): the `c-affiliate-document-detail__stepper--vertical` modifier and its rules, and the `c-affiliate-document-detail__vertical-step-nav` row. The horizontal stepper rules on `c-affiliate-document-detail__stepper` no longer sit behind `:not(.c-affiliate-document-detail__stepper--vertical)`. Their specificity drops from (0,3,0) to (0,2,0) and the rendered values do not change.
  - **Tokens**: none deprecated. The vertical rules only read `--pds-spacing-1`, which the horizontal stepper still uses.
  - **Worker comment copy**: each worker-comment `p-message` in the document panels now has an icon-only "Copier le message" button at its inline end. The comment text and the button are projected through the PrimeNG `#container` template, so the severity icon stays PrimeNG-rendered. The layout uses `o-flex` / `o-layout` mixes, so this adds no SCSS. On a successful copy, the page shows the existing "Copié !" toast.

## 2.0.5

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
