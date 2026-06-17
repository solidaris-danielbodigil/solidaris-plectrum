# Plectrum v1 — Visual QA report (for Design & Product)

**Date:** 17 June 2026  
**Audience:** UI/UX designers, product owners, engineering leads  
**Technical reference:** [PLECTRUM_V1_GAP_REPORT.md](./PLECTRUM_V1_GAP_REPORT.md)

---

## At a glance

We are upgrading the apps from **Plectrum v0.6** to **Plectrum v1** — a newer theme export from the Figma UI Kit, wired into PrimeNG components.

**Bottom line:** The upgrade is **almost ready**. One small technical fix is required before we switch the default theme. After that, we need a focused **visual review** on a handful of screens — especially **tabs** and **accordions** — where the live UI may not yet match the Figma UI Kit.

| Question | Answer |
|----------|--------|
| Is it safe to make v1 the default theme? | **Yes — after one quick engineering fix** and a visual sign-off |
| How many show-stoppers? | **1** (white background token missing — invisible to users until fixed) |
| How many items need design review? | **2 high** (tabs + accordions), plus broader colour/surface checks |
| Is dark mode included? | **No** — deferred to a later initiative |
| Can we compare old vs new? | **Yes** — a toggle lets us A/B test v0.6 and v1 side by side |

---

## What is changing?

Plectrum v1 brings the codebase closer to the current **Figma UI Kit**. In practice that means:

- **Primary brand colour** shifts slightly (blue-grey scale updated to match Figma v1)
- **Page and card backgrounds** use a new neutral grey scale
- **Component chrome** (borders, dividers, shadows) is driven by updated design tokens
- **Tabs and accordions** use PrimeNG’s newer unified components — but some border settings in v1 currently render as **boxed borders** instead of the **underline / divider** pattern in Figma

Most screens will look very similar. The differences are subtle on some surfaces and obvious on others (see below).

---

## Issues that need your eyes

### 🔴 High priority — likely visible mismatch with Figma

#### 1. Tabs show box borders instead of an underline

**What you should see (Figma):**  
A thin horizontal line under the tab row. The active tab is marked by a **primary-coloured bottom indicator** — not a box around each tab.

**What you may see today (v1):**  
Tabs look **boxed** — borders on all sides of the tab row and between individual tabs. The underline indicator is hard to read or competes with the box chrome.

**Where to check:**  
iSHARE → **Affiliate details** → category tabs above the accordion sections.

**Figma reference:** [Plectrum UI Kit — Tabs](https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=6961-92390)

**Expected fix:** Engineering adjusts the theme tokens so tabs match the underline pattern. **No design file changes expected** — this is aligning code to existing Figma.

---

#### 2. Accordions show full box borders instead of dividers

**What you should see (Figma):**  
Accordion sections separated by **thin horizontal dividers** only — no box around each panel.

**What you may see today (v1):**  
Each accordion panel has a **border on all four sides**, making sections look like stacked cards rather than a divided list.

**Where to check:**

| Screen | Accordion style | Notes |
|--------|-----------------|-------|
| iSHARE Affiliate details | Default (divider style expected) | Category panels below the tabs |
| List journey (when live) | Chromeless variant | Engineering still wiring the variant class |
| Document drawer timeline | Bordered variant | **Intentional** — stacked bordered accordion; not a bug |

**Figma reference:** [Plectrum UI Kit — Accordion](https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=6961-92390)

**Expected fix:** Theme token update + applying the correct accordion variant where needed. The bordered drawer accordion should **stay as-is**.

---

### 🟡 Medium priority — subtle but worth confirming

| Topic | What changed | Where to look | Design action |
|-------|--------------|---------------|---------------|
| **Avatar background** | v1 references a branding colour that isn’t fully defined yet | User avatar in top navigation | Confirm rose/branding tone once fixed |
| **Drawer shadow** | Shadow is hardcoded instead of using the shared overlay token | Any slide-in drawer / panel | Check elevation feels right vs Figma |
| **Divider weight** | Border colour source changed from transparent black to surface grey | Lists, cards, separators | Quick scan — should be minor |
| **Ghost / secondary buttons** | Transparent surface tokens from v0.6 are gone | Buttons across apps | Check hover and disabled states |

---

### 🟢 Low priority / intentional — no action unless something looks wrong

| Topic | Notes |
|-------|-------|
| **Primary colour shift** | v1 primary is slightly different from v0.6 (`#487395` scale vs older blue-grey). Apps may still show older values in some places until a broader token refresh. |
| **Bordered accordion in drawers** | Document timeline accordion uses a **deliberate** stacked bordered style — different from list/category accordions. |
| **Background greys** | Page background (`surface-50`) differs slightly between Figma v1, the new theme, and values baked into our SCSS. Minor drift — separate refresh planned. |

---

## Colour & surface reference

Simplified comparison of key colours. Hex values help when spot-checking in Figma or DevTools.

| Design role | Figma / v1 theme | What apps currently use | Status |
|-------------|------------------|-------------------------|--------|
| White / surface base | `#ffffff` | `#ffffff` | ✅ Aligned (after engineering fix) |
| Page background | `#fafafa` (neutral 50) | `#f6f6f6` | ⚠️ Minor drift — separate refresh |
| Primary 600 (brand) | `#487395` | `#3f5870` | ⚠️ Intentional until token refresh |
| Panel / drawer border | `#e7e7e7` | `#e7e7e7` | ✅ Aligned |
| Drawer shadow | Figma overlay token | Custom shadow string | ⚠️ Check elevation in QA |

---

## What is **not** in this release

These are consciously deferred — not oversights:

- **Dark mode** — v1 theme is light-only for now
- **Full Figma → code token sync** — we are not mirroring the entire Figma export into code in one go
- **Regenerating all SCSS colour primitives** — planned as a separate initiative
- **Removing the old v0.6 theme** — kept for comparison during QA

---

## Visual QA checklist

Please review **v1 vs v0.6** (toggle available in the avatar menu during QA) and sign off or flag issues.

### Must review (P2)

- [ ] **Affiliate details — category tabs** — underline indicator, no boxed tabs
- [ ] **Affiliate details — category accordion** — divider-only, no boxed panels
- [ ] **Top navigation** — colours, avatar, active states
- [ ] **Overview / dashboard cards** — surfaces, borders, shadows

### Should review (broader sweep)

- [ ] **Drawers** — shadow depth, title weight, panel borders
- [ ] **Lists and data tables** — row dividers, hover, selection
- [ ] **Buttons** — primary, secondary, ghost, disabled
- [ ] **Form fields** — focus ring, error states
- [ ] **Document drawer accordion** — confirm bordered style still correct (intentional)

### Sign-off template

| Reviewer | Date | v1 approved? | Notes |
|----------|------|--------------|-------|
| | | ☐ Yes ☐ No — see comments | |

---

## Fix timeline (simplified)

| Step | What | Who | Depends on |
|------|------|-----|------------|
| 1 | Fix missing white background token | Engineering | — |
| 2 | Fix tabs underline styling | Engineering | Step 1 |
| 3 | Fix accordion divider styling | Engineering | Step 1 |
| 4 | Fix avatar branding colour | Engineering | Step 1 |
| 5 | **Visual QA** (this checklist) | **Design** | Steps 2–3 |
| 6 | Switch default theme to v1 | Engineering | Design sign-off |
| 7 | Optional: drawer shadow alignment | Engineering | Step 6 |
| 8 | Broader colour token refresh | Engineering + Design | Separate project |

---

## Glossary (plain English)

| Term | Meaning |
|------|---------|
| **Plectrum v0.6 / v1** | Two versions of our design theme. v1 is newer and closer to current Figma. |
| **Theme / preset** | The set of design values (colours, spacing, borders) that PrimeNG components read automatically. |
| **Figma UI Kit** | The single source of truth for how components should look. |
| **Token** | A named design value (e.g. “primary colour”, “panel border”) used consistently in code. |
| **Variant** | A deliberate style option for a component — e.g. accordion with borders vs divider-only. |
| **Visual drift** | When the live app colour or spacing doesn’t exactly match Figma — sometimes intentional, sometimes a gap to fix. |

---

## Questions?

For technical detail, token paths, and engineering fix specs, see the [full gap report](./PLECTRUM_V1_GAP_REPORT.md).

For Figma specs, use the [Plectrum UI Kit](https://www.figma.com/design/YNZ1DlSjDNUXrvkxlSp10D/Plectrum-for-PrimeNG--Main-?node-id=6961-92390).
