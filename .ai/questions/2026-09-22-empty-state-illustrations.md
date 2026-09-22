# Which empty-state illustration for which situation

**Status:** proposed — awaiting design sign-off

## Context

`pds-empty-state` picks a random catalog illustration unless the screen pins `illustration`. Production screens should pin one. The seven ids are in `libs/ui/src/lib/empty-state/empty-state-illustrations.ts`.

## Provisional mapping

| Id | Context | Why |
| --- | --- | --- |
| people-search | No results in a search or a list | Two people looking |
| search-doctor-stethoscoop | No results in a care search | The search is the subject |
| person-box | First empty screen, nothing filed yet | A person with a box |
| hand-coffee | First empty screen, a quiet start | A hand and a cup, no urgency |
| person-zero | A blocked task or a zero result that needs a person | The zero is the message |
| person-long-hair-window-happy-coffee | A lighter empty inbox | The window is calm |
| person-short-hair-window-happy-coffee | A lighter empty inbox, alternate | Same scene, other person |

Shown on the Empty State page under Default. Change the ids there when design picks different ones.
