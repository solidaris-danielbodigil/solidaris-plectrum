# Plectrum v1 gap report

**Date:** 2026-06-17  
**Scope:** `Plectrum_v1/ts` vs `Plectrum_v0.6` vs `tokens.json` vs SDS primitives  
**Audit tool:** `node libs/plectrum/scripts/audit-preset-refs.mjs`

### Layer ownership

Each gap is labeled with a **Source** indicating where the fix or decision lives:

| Source | Meaning |
|--------|---------|
| **Preset** | Gap or fix in `Plectrum_v1/ts` (PrimeNG `--p-*` tokens) |
| **SDS** | Gap or fix in `libs/styles` (primitives, `01-settings` bridges, `06-components` BEM) |
| **Both** | Preset default and SDS bridge/wiring both contribute |
| **Intentional** | Deliberate design choice (e.g. `c-accordion--bordered`) |
| **Out of scope** | Deferred initiative (dark mode, full `tokens.json` mirror) |

---

## Executive summary

| Question | Answer |
|----------|--------|
| Safe to switch default to v1? | **Yes, with one blocker fix** (`extremes.white`) and visual QA |
| Blockers (must fix before default) | **1** — `{extremes.white}` undefined in `base.ts` |
| High (visual QA) | **2** — Tabs preset boxed borders vs underline; accordion chromeless/default boxed panels vs divider-only (§2.1, §2.2) |
| Medium (fix soon) | **2** — `branding.800` (avatar bg); drawer hardcoded shadow |
| Low / intentional | Primary palette shift; `c-accordion--bordered` stacked chrome (intentional); dark scheme absent; extend regression |
| Cross-component refs | ~25 heuristic flags — PrimeNG resolves `button.*`, `datatable.*` at runtime |

### Gap inventory (Source + priority)

| Gap | Priority | Source |
|-----|----------|--------|
| `{extremes.white}` undefined | P0 — blocker | **Preset** |
| `{branding.800}` undefined | P1 — medium | **Preset** |
| Tabs boxed borders vs underline (§2.1) | P2 — high | **Preset** |
| Accordion divider-only vs boxed panels (§2.2) | P2 — high | **Both** |
| Base primary / surface palette shift | High — visual QA | **Preset** |
| Drawer hardcoded shadow | Medium | **Preset** |
| `c-accordion--bordered` stacked chrome | Low | **Intentional** |
| `extend` / `emutnav` / SDS hardcoded primitives | Low — parallel SSOT | **SDS** |
| SDS `primary-600` / `surface-50` drift | P8 — separate initiative | **SDS** |
| Dark `colorScheme` absent in v1 | P7 — deferred | **Out of scope** |
| Cross-component heuristic refs (§1.3) | Low — not blockers | **Preset** |

**Recommendation:** Default to v1 after `extremes.white` fix; use avatar-menu toggle for A/B with v0.6 during visual matrix. Defer full dark scheme.

---

## 1. Unresolved `{token.path}` references

### 1.1 Blockers (strict)

| Token | File(s) | Fix | Source |
|-------|---------|-----|--------|
| `{extremes.white}` | `base.ts` → `colorScheme.light.surface.0` | Add `primitive.extremes.white: "#ffffffff"` or hardcode `#ffffff` on `surface.0` | **Preset** |

### 1.2 Medium — missing primitive/extend

| Token | File(s) | Figma reference | Suggested fix | Source |
|-------|---------|-----------------|---------------|--------|
| `{branding.800}` | `avatar.ts` → `root.background` | `Primitive/Mode 1` branding.800 → `{rose.800}` | Add `branding.800: "{rose.800}"` to `extend.ts` or change avatar to `{rose.800}` | **Preset** |

### 1.3 Heuristic — cross-component (PrimeNG runtime)

**Source:** **Preset** (not blockers — PrimeNG resolves at runtime)

These reference other component token namespaces (`button.*`, `datatable.*`, `megamenu.*`, etc.). PrimeNG merges component presets at build time — **not blockers** unless visual QA shows broken colors.

Examples: `badge.ts` → `{button.success.background}`, `datatable.ts` → `{datatable.border.color}`, `menubar.ts` → `{megamenu.item.active.color}`.

### 1.4 Audit stats

- Total refs scanned: **1560**
- Unique token paths: **227**
- Strict blockers: **1**

---

## 2. v1 vs v0.6 — component diff matrix

| Component | v0.6 | v1 | Impact | Source |
|-----------|------|-----|--------|--------|
| **base — primary** | `{primary.500}` / hover 700 / contrast `surface.0` | Full primary scale + `{primary.600}` / contrast `#fff` | **High** — brand blue-gray shift | **Preset** |
| **base — surface** | Hardcoded grays (`#f9f9f9` … `#202020`) | `neutral.*` scale via refs | **High** — page/card backgrounds | **Preset** |
| **base — content.border** | `{transparant.black.100}` | `{surface.400}` | Medium — divider weight | **Preset** |
| **base — colorScheme** | `light` + **`dark`** | **`light` only** | Dark mode broken if `.dark` used | **Out of scope** |
| **extend** | `emutnav`, `transparant.*`, `surface.75`, `focus.color`, `primary.75` | `basic.solidaris`, `plectrum.*`, `functional.link` | v1 preset does not emit v0.6 extend vars; SDS SCSS uses hardcoded `--sds-*` instead | **SDS** |
| **drawer** | `shadow: "{overlay.modal.shadow}"`, title weight 600 | Hardcoded shadow string, title weight 700 | Medium — elevation differs from v0.6 | **Preset** |
| **accordion** | panel border `0 0 1px 0`, padding 1.125rem, focus offset `-1px` | panel border `1px` (all sides), padding 1rem, focus offset `0` | **High** — chromeless/default render boxed panels; `c-accordion--bordered` intentional; see §2.2 | **Both** |
| **avatar** | bg `{content.border.color}` | bg `{branding.800}` (undefined) | **Medium** until branding fixed | **Preset** |
| **button** | Uses `{transparant.*}`, `{surface.75}` | No transparent tokens | Visual diff on ghost/secondary | **Preset** |
| **index** | Includes `steps`, `tabmenu`, `tabview`, `inputchips`, `colorpicker`, `inlinemessage` | Includes `tabs` (unified); drops v0.6-only components | Low — unused in SDS apps | **Preset** |
| **tabs** | v0.6 `tabmenu`: `tablist.borderWidth` / `item.borderWidth` = `0 0 1px 0`; `activeBar` 1px | v1 `tabs`: `tablist.borderWidth` / `tab.borderWidth` = `1px` (all sides) | **High** — boxed tab chrome; see §2.1 | **Preset** |

### 2.1 Tabs — boxed borders vs underline indicator (**High**)

**Source:** **Preset**

**Reported:** Incorrect PrimeNG Tabs styling after v1 upgrade. Tabs render with full box borders instead of the Plectrum underline pattern.

**SSOT (expected chrome):**

- [PrimeNG Tabs](https://primeng.org/tabs) — default tablist uses a bottom divider; active tab indicated by underline / active bar, not per-tab box borders.
- [Plectrum Figma UI Kit](https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=6961-92390) — tab navigation: thin row divider + primary bottom indicator on active tab; no boxed tab cells.

**Affected surface:** iSHARE affiliate-details category tabs — `p-tabs` / `p-tablist` in `apps/ishare/src/app/affiliate-details/affiliate-details.component.html` (category navigation above accordions). BEM hooks: `c-affiliate-details__category-tab`.

**Observed (computed CSS):**

| Selector | Current (v1 preset) | Expected |
|----------|---------------------|----------|
| `.p-tablist-tab-list` | `border-style: solid`; `border-color: var(--p-tabs-tablist-border-color)`; `border-width: var(--p-tabs-tablist-border-width)` on **all sides** | `border-bottom` only — thin divider under the tab row; no top/left/right box |
| `.p-tab` | `border-width: var(--p-tabs-tab-border-width)` — visible borders between/around tabs | No tab-level borders; active state = bottom indicator (`activeBar`) only |

**Root cause (preset diff):** `Plectrum_v1/ts/tabs.ts` sets `tablist.borderWidth: "1px"` and `tab.borderWidth: "1px"`. v0.6 `tabmenu.ts` used `borderWidth: "0 0 1px 0"` on both `tablist` and `item` (underline style). v1 also defines `activeBar` (`height: "3px"`, `background: "{primary.color}"`) but boxed tab borders compete with / obscure the intended indicator.

**Recommended fix (future pass — no implementation in this report):** Adjust `Plectrum_v1/ts/tabs.ts` token values, e.g.:

- `tablist.borderWidth` → `"0 0 1px 0"` (bottom divider only)
- `tab.borderWidth` → `"0 0 0 0"` or `"0"` (no per-tab box borders)
- Confirm `activeBar` height/offset matches Figma (v0.6 `tabmenu` used 1px bar; v1 preset uses 3px)
- Visual QA against affiliate-details category tabs after preset change; avoid SCSS overrides unless preset tokens cannot express the design

### 2.2 Accordion — chromeless boxed borders vs divider-only (**High**)

**Source:** **Both** (preset `borderWidth` + SDS `c-accordion--chromeless` token-bridge wiring)

**Reported:** Chromeless / default accordion panels render with a full box border on all sides instead of the Plectrum underline / divider pattern between panels.

**SSOT (expected chrome):**

- [PrimeNG Accordion](https://primeng.org/accordion) — default panel chrome uses horizontal dividers between panels (`border-bottom` only), not a boxed border on every side.
- [Plectrum Figma UI Kit](https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=6961-92390) — list journey / category group accordions: thin horizontal dividers between sections; no stacked boxed panel chrome.

**Affected surfaces:**

| Surface | Variant / class | Notes | Source |
|---------|-----------------|-------|--------|
| iSHARE affiliate-details category accordion | Default preset (no `c-accordion--*` on `<p-accordion>`) | `apps/ishare/src/app/affiliate-details/affiliate-details.component.html` — category panels below category tabs; BEM hook `c-affiliate-details__category-accordion` | **Both** |
| List journey group accordions (when wired) | `c-accordion--chromeless` | Token bridge in `01-settings/_settings.accordion.scss` lines 46–62 — class defined but not yet applied in templates | **Both** |
| Document drawer timeline events | `c-accordion--bordered` | **Out of scope for this gap** — intentional stacked bordered accordion (`document-more-details-drawer.component.html`) | **Intentional** |

**Observed (computed CSS):**

| Selector | Current (v1 preset) | Expected |
|----------|---------------------|----------|
| `.p-accordionpanel` | `border-style: solid`; `border-width: var(--p-accordion-panel-border-width)` on **all sides** (`1px` from preset) | `border-bottom` only — thin divider between panels; no top/left/right box |

**Root cause (preset + token-bridge interaction):**

- `Plectrum_v1/ts/accordion.ts` sets `panel.borderWidth: "1px"` — shorthand applies equal width on all four sides.
- v0.6 `accordion.ts` used `panel.borderWidth: "0 0 1px 0"` — bottom divider only.
- `c-accordion--chromeless` in `01-settings/_settings.accordion.scss` sets `--p-accordion-panel-border-width: 0` and `--p-accordion-panel-border-color: transparent`, but surfaces without that class inherit the v1 preset boxed border. Even with the bridge, preset specificity / emitted `--p-accordion-panel-border-width` may win unless the variant class is present and overrides resolve correctly.
- **`c-accordion--bordered`** (`06-components/_components.accordion.scss` lines 13–135) is intentional stacked bordered chrome — separate design intent; do not conflate with this gap.

**Recommended fix (future pass — no implementation in this report):**

- Adjust `Plectrum_v1/ts/accordion.ts`: `panel.borderWidth` → `"0 0 1px 0"` (divider-only default, matching v0.6 and PrimeNG/Figma).
- Apply `c-accordion--chromeless` on affiliate-details category `<p-accordion>` if hidden toggler + transparent chrome is required; confirm token bridge removes panel borders after preset fix.
- Visual QA: affiliate-details category accordion (divider-only); list journey groups once chromeless is wired; confirm `c-accordion--bordered` drawers unchanged.

---

## 3. v1 / v0.6 vs `tokens.json` (key roles)

| Role | tokens.json (Figma) | v0.6 | v1 | SDS primitive |
|------|---------------------|------|-----|---------------|
| Panel / drawer border | `#e7e7e7` (drawer border) | `surface.200` / transparent variants | `surface.200` in overlays | `--sds-color-surface-border-drawer` **#e7e7e7** ✓ |
| Primary 600 | `{primary.600}` semantic | Custom scale in primitive | `#487395` scale | `--sds-color-primary-600` **#3f5870** (drift) |
| Surface 50 (page) | neutral.50 / gray | `#f9f9f9` | `{neutral.50}` → `#fafafa` | `--sds-color-surface-50` **#f6f6f6** (drift) |
| Overlay shadow | drawer shadow tokens | `{overlay.modal.shadow}` | Hardcoded `0 8px 10px…` | `--sds-shadow-*` separate |
| surface.0 | `{extremes.white}` | `#ffffff` | `{extremes.white}` **undefined** | `--sds-color-surface-0` **#ffffff** ✓ |

**Note:** SDS primitives were authored against v0.6 + Figma audits; v1 Figma export uses a different primary/surface story. SDS overrides (`--p-*` in `01-settings`) bridge many gaps.

---

## 4. SDS primitives vs Figma drift

Tokens apps actually use:

| SDS variable | Value | Figma / v1 | Status |
|--------------|-------|------------|--------|
| `--sds-color-panel-border` | `#e7e7e7` | drawer border | ✓ Aligned |
| `--sds-color-surface-50` | `#f6f6f6` | neutral.50 `#fafafa` | Minor drift |
| `--sds-color-primary-600` | `#3f5870` | v1 `#487395` | Intentional until SDS refresh |
| `--sds-color-emutnav-*` | rose/black-alpha | v0.6 `extend.emutnav` only | SDS hardcoded — **no v1 preset dependency** |
| `--sds-color-surface-75` | `#ededed` | v0.6 `extend.surface.75` | SDS only — v1 components don't reference |

---

## 5. Recommended Phase 2 fix order

| Priority | Item | Action | Source |
|----------|------|--------|--------|
| P0 | `extremes.white` | Add to `base.ts` primitive | **Preset** |
| P1 | `branding.800` | Alias to `{rose.800}` in `extend.ts` | **Preset** |
| P2 | **Tabs underline preset** | `Plectrum_v1/ts/tabs.ts` — `tablist.borderWidth` / `tab.borderWidth` → underline style; QA affiliate-details `p-tabs` | **Preset** |
| P2 | **Accordion divider-only preset** | `Plectrum_v1/ts/accordion.ts` — `panel.borderWidth` → `"0 0 1px 0"`; wire `c-accordion--chromeless` where needed; QA affiliate-details category accordion; leave `c-accordion--bordered` unchanged | **Both** |
| P3 | Default v1 + avatar toggle | `providePlectrum()` + localStorage (after P2 tabs + accordion visual QA) | — |
| P4 | Visual matrix | top-nav, overview card, drawers, accordions (post-P2), tabs, list | — |
| P5 | Drawer shadow | Align to `{overlay.modal.shadow}` or Figma token (optional) | **Preset** |
| P6 | extend merge (v0.6) | **Skip** — no unresolved v1 refs to `emutnav`/`transparant`/`surface.75` | **SDS** |
| P7 | Dark colorScheme | **Out of scope** — no full dark mode | **Out of scope** |
| P8 | SDS primary refresh | Separate initiative — do not mirror `tokens.json` | **SDS** |

---

## 6. Out of scope (confirmed)

- Mirroring full `tokens.json` into preset or SCSS
- Regenerating SDS primitives from Figma
- Deleting `Plectrum_v0.6`
- Full dark mode in v1

---

*Generated as part of the Plectrum v1 upgrade plan. Re-run audit after preset edits:*

```bash
node libs/plectrum/scripts/audit-preset-refs.mjs
```
