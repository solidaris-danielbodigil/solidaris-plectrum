---
name: Surgical skeletons
overview: Rework the loading skeletons to mask only data-dependent values (count badges, list rows, document/affiliate data) while keeping static chrome (titles, tab labels, accordion section labels) rendered and making embedded static controls real-but-disabled.
todos:
  - id: docs-header
    content: 'Collapse documents card header into a single real header (affiliate-details.component.html L101-221): static title, sort button [disabled]=pageLoading(), tabs always rendered with [disabled], and count badge swapped to circle skeleton when loading.'
    status: completed
  - id: docs-body
    content: Remove the dedicated skeleton accordion block; always render the real accordion path with each category count badge swapped to a circle skeleton when loading; keep pds-list [loading]=pageLoading().
    status: completed
  - id: detail-header
    content: 'Detail card header: keep title as skeleton when loading, render prev/next nav buttons real-but-disabled ([disabled]=pageLoading() || !canGo...). Detail body unchanged.'
    status: completed
  - id: overview-primary
    content: 'Overview card: render the primary action button real-but-disabled when loading (if primaryAction present) instead of the skeleton slot; keep all other overview values skeletonized.'
    status: completed
  - id: count-skeleton-scss
    content: 'Add a reusable count-badge circle skeleton; remove now-unused skeleton tokens (_settings.affiliate-details.scss) and rules (_components.affiliate-details.scss): docs-title, docs-sort, category-tab, panel-label, panel-badge, skeleton-tabs, skeleton-accordion.'
    status: completed
  - id: ts-cleanup
    content: Remove unused skeletonCategoryTabSlots and skeletonDocumentsAccordionValue from affiliate-details.component.ts.
    status: completed
  - id: tests
    content: Update affiliate-details and affiliate-overview-card specs (overview skeleton-slot count 8->7, primary action disabled assertion; drop assertions on removed skeleton classes) and run both suites.
    status: completed
isProject: false
---

# Surgical Skeletons: mask data, keep static chrome, disable controls

## Principle

A skeleton should only stand in for content a real backend wouldn't have yet. Static labels/taxonomy render normally; static interactive controls render real-but-disabled (matching the toolbar); only genuinely data-dependent values get a `p-skeleton`.

## Full static-vs-data classification

Static (NOT skeletonized):

- Documents card title "Suivi des documents"
- Documents sort toggle button -> render disabled
- Tab labels (Parcours / Isoles / Archives) - `DOC_CATEGORY_SPECS` is a fixed taxonomy
- Per-tab eye (show/hide) toggle -> render disabled
- Accordion category section labels + the word "documents"
- Detail panel prev/next nav buttons -> render disabled
- Overview "Voir carte affilie" primary action -> render disabled

Data-dependent (skeletonized):

- Documents: header count badge, per-tab count badge, accordion count badge, document list rows
- Detail header: document title
- Detail body (fully): step labels, cert titles, status tags, detail-row values, body action buttons (they live inside the data-driven step/panel structure)
- Overview: avatar, affiliate name, status action, info-tag values, identifiers

Note: because `simulateAffiliateLoading` is a flash over already-present mock data, `categories()`, `selectedCategoryTab()`, accordion structure etc. are all available during the flash. We therefore render the REAL structure and mask only the values/rows - this also removes the load->loaded layout shift.

## Changes

### 1. Documents card header - [affiliate-details.component.html](apps/ishare/src/app/affiliate-details/affiliate-details.component.html) (L101-221)

- Collapse the `@if (pageLoading()) {...} @else {...}` header into a SINGLE always-rendered real header.
- Title `h2` stays as-is.
- Header count badge: `@if (pageLoading()) { <p-skeleton shape="circle" .../> } @else { <span class="c-list__count-badge">{{ documentCount() }}</span> }`.
- Sort button: add `[disabled]="pageLoading()"`.
- Tabs always rendered; add `[disabled]="pageLoading()"` to each `p-tab` and to the eye `pButton`; swap each tab `<p-badge>` for the circle skeleton when `pageLoading()`.

### 2. Documents card body - same file (L223-360)

- Remove the dedicated `@if (pageLoading()) { skeleton accordion }` block entirely.
- Always render the real `@if (showCategoryTabs())` accordion path (data is present during the flash).
- In each accordion panel header, swap the `<p-badge [value]="cat.count">` for the circle skeleton when `pageLoading()` (keep the label + "documents" text).
- Keep `pds-list [loading]="pageLoading()"` (already skeletonizes rows).
- Scroll container: keep the existing `[class.o-layout--overflow-hidden]="pageLoading()"` / no-scroll-shadow behavior.

### 3. Detail card header - same file (L370-411)

- Single header: title `@if (pageLoading()) { <p-skeleton title slot> } @else { <h2>{{ selectedDocumentTitle() }}</h2> }`.
- Prev/next nav buttons: always rendered, `[disabled]="pageLoading() || !canGoToPreviousDocument()"` and `... || !canGoToNextDocument()`.
- Detail body (`app-affiliate-document-detail`) stays fully skeletonized - unchanged in [affiliate-document-detail.component.html](apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.component.html).

### 4. Overview card - [affiliate-overview-card.component.html](libs/ui/src/lib/affiliate-overview-card/affiliate-overview-card.component.html)

- Keep avatar/title/status/info-tags/identifiers skeletonized.
- Primary action: when `loading()` and `primaryAction()` is set, render the real button with `[disabled]="true"` instead of the `--primary-action` skeleton slot. (Visual note: a lone styled button beside greyed skeletons; acceptable per the chosen "disabled" treatment.)

### 5. Shared count-badge skeleton + SCSS/token cleanup

- Add one reusable count-badge skeleton (circle, ~24px) used by header/tab/accordion. Prefer `p-skeleton shape="circle" size="var(--pds-size-list-count-badge-min)"` (consistent with the avatar's native-shape approach).
- Remove now-unused skeleton tokens in [\_settings.affiliate-details.scss](libs/styles/src/01-settings/_settings.affiliate-details.scss): `docs-title-w/h`, `docs-sort`, `category-tab-w/h`, `panel-label-w/h`, `panel-badge-w/h`, `panel-header-h` (keep/repurpose `docs-count`).
- Remove now-unused rules in [\_components.affiliate-details.scss](libs/styles/src/06-components/_components.affiliate-details.scss): `__skeleton-slot--docs-title/--docs-sort/--category-tab/--panel-label/--panel-badge`, `__skeleton-tabs`, `__skeleton-accordion`.

### 6. TS cleanup - [affiliate-details.component.ts](apps/ishare/src/app/affiliate-details/affiliate-details.component.ts)

- Remove `skeletonCategoryTabSlots` and `skeletonDocumentsAccordionValue` (L525-527) - no longer used.

### 7. Tests

- [affiliate-details.component.spec.ts](apps/ishare/src/app/affiliate-details/affiliate-details.component.spec.ts): run; update/remove any assertions tied to removed skeleton classes; optionally assert badges are skeleton + controls disabled while loading.
- [affiliate-overview-card.component.spec.ts](libs/ui/src/lib/affiliate-overview-card/affiliate-overview-card.component.spec.ts): the skeleton-slot count drops from 8 to 7 (primary action now real-disabled); update the count and add an assertion that the primary action renders disabled when loading.

## Result

- Documents column: real title/tabs/accordion labels visible immediately; only count badges + list rows shimmer; sort/eye/tabs disabled. No layout shift on load.
- Detail column: document title skeleton + disabled nav; body fully skeleton.
- Overview: data values skeleton; "Voir carte affilie" real-disabled.
- Toolbar: unchanged (already disabled).
