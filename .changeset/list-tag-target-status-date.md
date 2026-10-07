---
"@solidaris-danielbodigil/pds-ui": minor
---

List and Profile drawer: new optional inputs, no change for existing callers.

- **Profile drawer**: `disabledViews`, `quickActionsDisabled`, `callDisabled` and `emailDisabled` disable the matching view option (Détails / Documents) and the quick actions, call and email buttons.
- **List**: `ListEntryTagTarget` gains optional `status` and `date`, shown inline after the label in the tag popover. A target with only a `label` renders as before.
- **List**: count-tag buttons that open a target popover are no longer pill-shaped (`rounded` removed), so they read as regular buttons.
