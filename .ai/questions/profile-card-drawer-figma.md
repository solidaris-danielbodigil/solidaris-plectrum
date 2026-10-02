# Profile Card and Profile Drawer — Plectrum kit nodes

**Status:** partially answered — Profile Card answered by Profile header (2026-10-02); Profile Drawer remains open
**Opened:** 2026-09-08  
**Owner:** design-system

## Context

`pds-profile-card` and `pds-profile-drawer` were genericised from the iSHARE affiliate overview card and detail drawer. The Plectrum for PrimeNG (Main) UI Kit has stock Card and Drawer pages, but no profile-summary card or dossier-style drawer node. Custom-components has `pds-list / c-list`; it does not yet have matching nodes for these two.

The Profile Card metadata now links to the proposed **Profile header** in the separate PLECTRUM · Custom components file. The existing `pds-profile-card` implementation remains exported but is deprecated; `pds-profile-header` implements the Figma node and replaces it. The Profile Drawer design question remains open.

## Question

Please add Plectrum kit (or Custom-components) nodes for:

1. `pds-profile-card` / `c-profile-card` — variants default / in-order / warning / danger
2. `pds-profile-drawer` / `c-drawer__profile-*` — header, view switch, general/contact rows, related members, notes

The Profile Card link is now the proposed Profile header node; a corresponding Profile Drawer node and reviewed implementation are still needed.

## Decision

Profile Card: design reference received on 2026-09-28 at `https://www.figma.com/design/IRkr21rHS0w7rI0bgrv1fZ/PLECTRUM-%C2%B7-Custom-components?node-id=2438-10587`. On 2026-10-02 the design-system team approved the Core implementation `plectrum:profile-header` (`pds-profile-header`, `libs/ui/src/lib/profile-header/`) for that node; `plectrum:profile-card` now carries `replacementId: 'plectrum:profile-header'` and is removed in the next major. Profile Drawer: pending.
