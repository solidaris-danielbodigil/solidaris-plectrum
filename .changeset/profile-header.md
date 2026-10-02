---
"@solidaris-danielbodigil/pds-ui": minor
"@solidaris-danielbodigil/pds-styles": minor
"@solidaris-danielbodigil/pds-devkit": patch
---

Add Profile Header (`pds-profile-header`, `plectrum:profile-header`), the Core shell header from the Figma Profile header design. It keeps the Profile Card content and logic with the new layout: the name is an outlined primary Button that opens the profile (Alt+A shortcut, shown in its tooltip), the status action is a Button — or a SplitButton when several actions wait, whose main button and chevron both open the menu — quick filters are PrimeNG ToggleButtons (display-only tags stay PrimeNG Tags), identifiers use the new inplace chip, and the severity gradient is unchanged. Slots `[slot=actions]`, `[slot=aside]`, `[slot=nav]` and `[slot=nav-end]` take the application's page actions, an aside panel and the shell tabs. Styles and tokens live in `_components.profile-header.scss` and `_settings.profile-header.scss` (`--pds-*-profile-header-*`).

iShare's app shell now uses `pds-profile-header` instead of `pds-profile-card`.

Copyable Text gains two opt-in inputs, `iconPosition` (`'start'` default | `'end'`) and `labelWeight` (`'semibold'` default | `'regular'`); existing chips are unchanged.

Profile Card is deprecated with `replacementId: 'plectrum:profile-header'` and is removed in the next major. Migration — same inputs and outputs, renamed types:

| Profile Card | Profile Header |
| --- | --- |
| `pds-profile-card` / `ProfileCardComponent` | `pds-profile-header` / `ProfileHeaderComponent` |
| `ProfileCardVariant` | `ProfileHeaderVariant` |
| `ProfileCardStatusAction` / `ProfileCardStatusSeverity` | `ProfileHeaderStatusAction` / `ProfileHeaderStatusSeverity` |
| `ProfileCardInfoTag` / `ProfileCardInfoTagFilterKey` | `ProfileHeaderInfoTag` / `ProfileHeaderInfoTagFilterKey` (now `string`) |
| `ProfileCardIdentifier` | `ProfileHeaderIdentifier` |
| `ProfileCardPrimaryAction` | `ProfileHeaderPrimaryAction` |
| `primaryAction.icon` left of the name | right of the name, default `bi bi-person-square` — drop `icon: 'bi bi-eye'` to get the Figma glyph |
| `statusAction.icon` default `bi-exclamation-triangle-fill` (several actions) | severity default `bi-check-lg` / `bi-exclamation-triangle` / `bi-exclamation-octagon` |
| Telemetry `affiliate-overview-primary-action` / `-status-action` / `-info-tags` | `profile-header-name-action` / `-status-action` / `-info-tags` |
