# NL-BE copy review

**Status:** ready for native sign-off  
**Opened:** 2026-09-08  
**Owner:** design-system / product

## Context

Plectrum ships user-facing copy through `PDS_LOCALE` (`fr` | `nl` only). English is not a product locale — Storybook chrome and docs stay in English.

Dictionaries (NL-BE, u-form):

- `libs/ui/src/lib/copyable-text/copyable-text.i18n.ts`
- `libs/ui/src/lib/top-nav/top-nav.i18n.ts`
- `libs/ui/src/lib/list/list.i18n.ts`
- `libs/ui/src/lib/profile-card/profile-card.i18n.ts`
- `libs/ui/src/lib/profile-drawer/profile-drawer.i18n.ts`
- `libs/ui/src/lib/delay-prediction-card/delay-prediction-card.i18n.ts`
- `libs/ui/src/lib/transactions-cics-modal/transactions-cics-modal.i18n.ts`

## Locked terminology

| Topic | Choice | Why |
|---|---|---|
| Member | **aangeslotene** (not lid) | Matches FR *affilié* / mutualité language |
| Breadcrumb | **Kruimelpad** | Usual Belgian UI term; *broodkruimelpad* is a calque |
| Family section | **Familie** (not gezin) | Matches FR *Famille* and related members on the file |
| Delay card | **Termijnvoorspelling** | Named surface; keep the compound |
| Predicted close | **Voorspelde sluiting** | Claims *clôture* |
| CICS | **CICS** unchanged | Proper name |

Do not change message keys. Edit only the `nl` values if a native reviewer disagrees.

## Decision

English locale: **do not add** unless a product asks. `PdsLocale` stays `'fr' \| 'nl'`.

NL-BE strings: written; native reviewer may still tweak tone.
