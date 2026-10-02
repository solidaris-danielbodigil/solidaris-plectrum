# Profile header — pressed quick-filter style

**Status:** open
**Opened:** 2026-10-02
**Owner:** design-system

## Context

`pds-profile-header` quick filters (info tags with `filterKey`) are now PrimeNG ToggleButtons (`size="small"`, product decision 2026-10-02); display-only tags stay PrimeNG Tags. Figma (Profile header 2438:10587, tags 2443:6006) only draws the tags and has no pressed state.

With the Plectrum v1 ToggleButton tokens, the pressed and unpressed states differ by colour only: the root stays `primary.200` (#d0dde7), the checked content segment is `surface.0` (#ffffff) with a faint shadow, and the text goes from `text.muted` to `surface.950`. Background contrast between the two states is **1.38:1**, below the 3:1 that WCAG 1.4.1 / 1.4.11 needs for colour to be the only cue. The code therefore adds an aria-hidden `bi bi-check-lg` icon in front of the pressed toggle's label (`aria-pressed` stays the programmatic state).

The small ToggleButton is also **33px** high, against the 28px Figma tag (`tag/padding/y 4`, `label/label-sm`).

## Question

1. Is the check icon the right non-colour cue for the pressed quick filter, or should the pressed style change (e.g. a stroke, a filled `primary` checked background with ≥ 3:1 against unpressed)?
2. Should the quick filters keep the stock small ToggleButton height (33px) or be tuned to the 28px tag height (token bridge on `.c-profile-header__info-tags`)?
3. Please add the pressed / unpressed quick-filter states to the Profile header node so Code Connect can map them.

## Decision

Pending.
