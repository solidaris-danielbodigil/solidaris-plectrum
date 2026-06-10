---
name: Tag header and popover fixes
overview: Show a comment tag in each accordion panel header whenever the panel has a worker comment, and replace the mis-anchored custom popover with a PrimeNG p-menu popup so the jump targets anchor correctly and match the select/autocomplete overlay styling.
todos:
  - id: header-tag
    content: Derive the accordion panel header tag from panel.workerComment in affiliate-document-detail.component.html; remove redundant countTag from types and mock
    status: completed
  - id: header-spec
    content: Update affiliate-document-detail.component.spec.ts to assert the comment tag on both compte-financier-liasse and fdr-affilie-incapacite
    status: completed
  - id: menu-ts
    content: 'In list.component.ts, swap Popover for Menu: build MenuItem[] model from tag.targets and toggle p-menu on multi-target clicks; remove onTagTargetSelect/tagAnchorFromEvent'
    status: completed
  - id: menu-html
    content: 'Replace the p-popover block in list.component.html with <p-menu #tagMenu [popup] [model] appendTo=body>'
    status: completed
  - id: menu-specs
    content: Update list and affiliate-details specs to target .p-menu-overlay / .p-menu-item-link, then run both suites headless
    status: completed
isProject: false
---

# Tag header + popover anchoring fixes

## 1. Panel header comment tag (derive from `workerComment`)

The header already renders a tag, but only when a separate manual `countTag` field exists. `fdr-affilie-incapacite` has a `workerComment` but no `countTag`, so it shows only "Clôturé". The list-row tags are already derived from `workerComment` via `deriveDocumentTags`, so the header tag should use the same single source of truth.

- In [affiliate-document-detail.component.html](apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.component.html) (lines 54-60), drive the second `p-tag` off `panel.workerComment` instead of `panel.countTag`:

```html
@if (panel.workerComment) {
<p-tag
  [severity]="panel.workerComment.severity"
  value="1"
  [icon]="panel.workerComment.icon"
/>
}
```

- Remove the now-redundant `countTag` field from [affiliate-document-detail.types.ts](apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.types.ts) (lines 42-46) and the two `countTag` blocks in [affiliate-document-detail.mock.ts](apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.mock.ts) (lines 92-96, 120-124).
- Update the spec [affiliate-document-detail.component.spec.ts](apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.component.spec.ts) (lines 165-175): keep the `compte-financier-liasse` assertion and add one for `fdr-affilie-incapacite` (now also shows the tag).

## 2 + 3. Anchoring + option styling: replace popover with `p-menu` popup

PrimeNG overlays anchor via `absolutePosition(container, target)` (see `align()` in `primeng-popover.mjs`); the select/autocomplete overlays use the same mechanism and work, so we stay with PrimeNG anchoring rather than CSS anchor positioning (Chromium-only in 2026). The current `.c-list__tag-target` buttons have no SCSS, which is why they look unstyled. `p-menu [popup]` solves both: it anchors to `event.currentTarget` automatically and renders native overlay options (`.p-menu-overlay` / `.p-menu-item-link`) matching the select/autocomplete look.

In [list.component.ts](libs/ui/src/lib/list/list.component.ts):

- Replace `Popover` import/usage with `Menu` (`primeng/menu`) and `MenuItem` (`primeng/api`); update `imports` array (line 38) and the `viewChild` (line 71) to `Menu`.
- Add a `tagMenuModel = signal<MenuItem[]>([])`. In the multi-target branch of `onTagClick` (lines 171-173), build the model from `tag.targets` (each `{ label: target.label, command: () => this.tagTargetClick.emit({ doc, tag, target }) }`), then `this.tagMenu()?.toggle(event)`.
- Delete `onTagTargetSelect` (lines 191-200) and `tagAnchorFromEvent` (lines 176-182); keep `activeTag` only if still needed (it can be dropped).

In [list.component.html](libs/ui/src/lib/list/list.component.html):

- Replace the entire `<p-popover>` block (lines 222-239) with:

```html
<p-menu #tagMenu [popup]="true" [model]="tagMenuModel()" appendTo="body" />
```

## Tests

- [list.component.spec.ts](libs/ui/src/lib/list/list.component.spec.ts) (lines 941-971): assert the menu overlay (`.p-menu-overlay`) appends to body and emits `tagTargetClick` when a `.p-menu-item-link` is clicked.
- [affiliate-details.component.spec.ts](apps/ishare/src/app/affiliate-details/affiliate-details.component.spec.ts) (lines 599-601): change the jump-link selector from `.c-list__tag-target` to `.p-menu-item-link`.
- Run `ng test ui --include=**/list.component.spec.ts` and `ng test ishare --include=**/affiliate-*.spec.ts` headless.

## Notes

- Single-target tags keep their existing direct-emit behavior (no menu).
- `appendTo="body"` keeps the overlay out of the overflow-clipped list card.
