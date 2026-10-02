---
"@solidaris-danielbodigil/pds-ui": minor
"@solidaris-danielbodigil/pds-styles": minor
---

List group header: the type (`titleAccent`) and the dates now share a second line under the group title. The dates are grouped in `c-list__date-range` as `start - end`, or the single known date. The divider is removed on group rows.

- **Colour**: dates use `--pds-color-list-date-value` (surface-700), darker than the former label colour. `--pds-color-list-date-label` (surface-500) is deprecated: still declared but no longer read, removed in a later release.
- **Accessibility**: the "Date de début / fin" labels are screen-reader only, and the group treeitem accessible name now includes the localised dates (FR/NL), e.g. "Parcours Indemnités - Demande primaire, Date de début 24/11/2025, Date de fin 24/12/2025".
- **Telemetry**: the group label is now `Title - Type` (previously `Title Type`), and the treeitem name, previously `TitleType`, now starts with `Title - Type`. Update any telemetry filter or test selector keyed on the old label.
- **API**: `ListGroup` is unchanged. Remove a trailing " -" from group titles, since the type no longer follows the title on the same line.
- **Internal markup**: the template elements `c-list__dates`, `c-list__date`, `c-list__date--end` and `c-list__date-value` are no longer rendered or styled. They were never part of the documented anatomy.
- **Tag severity**: `ListEntryStatus.severity` and `ListEntryTag.severity` also accept `contrast`, rendered as the dark PrimeNG tag.
