# @solidaris-danielbodigil/pds-devkit

## 0.7.2

### Patch Changes

- f59d9c3: Adoption reports now also detect styles-only components (Accordion, Drawer, Skeleton Slot, Timeline, Detail List…) by their BEM block class — the block, an element or a modifier such as `c-accordion--bordered`, in templates and class strings — so usage counts for those components appear in reports. The report limitations say so. The scanner is exported as `scanObservations(root, sourceFiles, catalogue)` for central tooling; Angular components are still matched by named import or selector, unchanged.

  The central registry now accepts usage reports (`operations.reportIngestionEnabled: true`); the toolkit's registry snapshot carries the new value.

## 0.7.1

### Patch Changes

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

## 0.7.0

### Minor Changes

- ba1fc98: Add `plectrum mcp`, an offline MCP server over stdio that answers editor agents from the installed catalogue, tokens and process (`search_components`, `get_component`, `find_token`, `check_tokens`, `get_process`). `plectrum init` now configures it with the Figma remote MCP server (OAuth in the editor) and the application's own Storybook MCP at `http://localhost:6006/mcp`; generated Storybooks add `@storybook/addon-mcp`. Existing projects keep their `.plectrum/config.json` values; `plectrum doctor` lists the recommended ones.

  Measure the Plectrum agent without collecting content: MCP tool calls and CLI commands record tool names, component IDs and outcomes in `.plectrum/telemetry` (ignored by git, off with `telemetry.enabled: false`), and `adoption-report` adds a 30-day `agent` block with these counts and the `Plectrum-Agent:` commit trailers.

## 0.6.0

### Minor Changes

- aef6185: Make local components visible to Core. The evidence checklist of a new component gets a "Reuse potential (none / possible / likely) and why" line. The usage report now lists the team's local components with that estimate, and Find a component shows them under a new Local scope. Each toolkit release ships the other teams' local components (`@solidaris-danielbodigil/pds-devkit/local-components`): `plectrum scaffold` lists similar ones, and the agents check them before suggesting a new component.

  There is no "rejected" proposal decision any more: teams own their components, so a proposal ends as approved-candidate, use-existing or app-specific. A submitted candidate that Core does not integrate is "kept-local" instead of "rejected".

## 0.5.1

### Patch Changes

- 660ba0a: Application agents act as the team's first reviewer: before anything is built they check PrimeNG and the installed catalogue (use cases, anti-patterns, compositions), say when an existing component already covers the need, answer layout and UX questions, flag decisions for a designer, and recommend showing new UX early to the core team or a designer. They also know about local token files. The contribution "implement" step no longer lists `plectrum init`; the starter runs `plectrum bootstrap` on `npm install`.

## 0.5.0

### Minor Changes

- 8deb3aa: Turn usage reporting on by default, and show its status in a generated `Plectrum/Setup` story and in `plectrum doctor`. New applications get `reporting.enabled: true`, and the generated CI workflow runs `plectrum adoption-submit` after each push to `main` with the `PLECTRUM_ADOPTION_TOKEN` secret. While the application is not in the Plectrum registry or no token is set, the submission is skipped with a GitHub Actions warning instead of failing the build. Existing `.plectrum/config.json` files keep their current value; set `reporting.enabled` to `false` to opt out.

## 0.4.1

### Patch Changes

- a00b0ca: Mark the v0.6 preset as deprecated while retaining it for migration comparisons. Ship Agenda font files in `pds-styles` and generate FR/NL and preset controls in application Storybook previews. Remove the test-only SCSS component.

## 0.3.2

### Patch Changes

- 1d24002: Describe the design-origin component route and the distinct PrimeNG 21 token and Custom components Figma files in the installed process and registry snapshots.

## 0.3.1

### Patch Changes

- 4424c08: Mark Profile Card as deprecated in the distributed catalogue and link its proposed Profile header design. The existing Angular export remains available; no replacement component is published yet.

## 0.3.0

### Minor Changes

- d4cbb3d: Render `plectrum help`, the generated agent roles, baseline instructions and `rules/consumer.md` from the installed process contract (1.3.0), which now carries command summaries, the onboarding journey, proposal outcomes and routes. `self-check` fails when the CLI and the contract disagree on available commands. Catalogue and doctor link each component to the versioned Storybook of the installed runtime and toolkit pair instead of the development preview. Ships `schema/process.v1.schema.json`.

## 0.2.1

### Patch Changes

- 52a9aea: Update the distributed registry snapshot after the verified private GitHub Packages release.
