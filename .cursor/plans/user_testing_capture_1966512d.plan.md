---
name: User testing capture
overview: A capture-data plan layering OBS screen/audio recording + external facilitator notes on top of the existing dev-only `TestingTelemetryService`, with JSON session export and a new post-session analysis app at `apps/dashboard`. v1 covers iSHARE; later phases add iCRM testing and a design-system metrics view.
todos:
  - id: telemetry-export
    content: 'Extend TestingTelemetryService: session envelope, x/y+viewport+route on clicks, session_new/start/stop/export events, file download, optional ?session= query param'
    status: completed
  - id: telemetry-ids
    content: Add data-telemetry-id to key iSHARE controls; keep existing recordTelemetry markers
    status: completed
  - id: avatar-menu
    content: Add optional avatarMenuItems to sds-top-nav; build env-gated facilitator menu (New session / Start-Stop / Export) in app-shell wired to TestingTelemetryService
    status: completed
  - id: analytics-lib
    content: Extract parseSession + computeSessionStats + timeline/aggregate pure functions with unit tests
    status: completed
  - id: dashboard-app
    content: Scaffold apps/dashboard Angular app (default PrimeNG + reused libs/ui cards/accordions), chart.js, file upload, summary + timeline + charts + element-frequency view
    status: completed
  - id: capture-docs
    content: Write docs/user-testing/capture-data-workflow.md + update protocol checklist and export steps
    status: completed
  - id: future-phases
    content: 'Later phases (design now, build later): iCRM testing reuse + dashboard design-system metrics view (most-used components, counters, relationship map)'
    status: pending
isProject: false
---

# User testing data capture plan

## Context

The scenarios plan ([`.cursor/plans/user_testing_scenarios_7869e1dd.plan.md`](.cursor/plans/user_testing_scenarios_7869e1dd.plan.md)) already recommends **Option A + B**: moderated recording + lightweight in-app events. Partial implementation exists today:

| Piece                                                                                                                        | Status                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [`TestingTelemetryService`](libs/ui/src/lib/testing-telemetry/testing-telemetry.service.ts)                                  | Done — global clicks, idle (3s), explicit events, JSON/CSV export                                                   |
| `enableTestingTelemetry` flag                                                                                                | Done — `true` in dev, `false` in production                                                                         |
| Explicit markers in [`affiliate-details.component.ts`](apps/ishare/src/app/affiliate-details/affiliate-details.component.ts) | Partial — journey toggle, document select, deep links, drawers, CICS, family select                                 |
| Facilitator protocol                                                                                                         | Done — [`docs/user-testing/ishare-moderated-test-protocol.md`](docs/user-testing/ishare-moderated-test-protocol.md) |
| Task start/stop UI                                                                                                           | **Not wired** — `startTask()` / `stopTask()` exist but unused                                                       |
| Export UX                                                                                                                    | **Console-only** — no file download, no session metadata                                                            |
| Dashboard                                                                                                                    | **Missing** — new `apps/dashboard` app                                                                              |

### Your decisions (locked in)

- **Recording:** OBS on the facilitator laptop (screen + cursor + mic), files managed locally
- **Notes:** External (Word / spreadsheet / paper) — manual correlation
- **Facilitator controls:** A menu on the top-nav **avatar/user section** with New session, Start/Stop test session, Export data (env-gated)
- **Task boundaries:** Manual alignment using the OBS timeline (no per-task controls — session-level start/stop only)
- **Dashboard:** Post-session only; standalone app at **`apps/dashboard`** that reads uploaded JSON
- **Dashboard UI:** Stock PrimeNG components with default styling + reuse existing `libs/ui` components (cards, accordions, list); no bespoke dashboard design work
- **Heatmaps:** Capture `x/y` + viewport + route on every click now (cheap) **and** ship the element-frequency view in v1; pixel-overlay deferred to v1.1
- **Export UX:** A real file download (not devtools console copy-paste), triggered from the avatar menu
- **OBS sync:** Not needed — single-laptop recording; rely on relative `+mm:ss` timestamps only

---

## End-to-end workflow

```mermaid
flowchart LR
  subgraph session [During session]
    OBS[OBS recording]
    iSHARE[iSHARE dev build]
    Notes[External notes]
    iSHARE -->|clicks + markers| Buffer[In-memory telemetry]
  end

  subgraph after [After session]
    Buffer -->|Export JSON| JSON[session file]
    OBS --> OBSFile[.mp4 / .mkv]
    Notes --> NotesFile[notes doc]
    JSON --> Dashboard[apps/dashboard]
    Dashboard --> Charts[Timeline + charts]
  end

  subgraph correlate [Manual correlation]
    OBSFile
    NotesFile
    JSON
    correlate[Facilitator matches timestamps + pseudonym]
  end
```

**Session naming convention** (document in capture guide):

```
YYYY-MM-DD_P01_obs.mp4
YYYY-MM-DD_P01_notes.docx
YYYY-MM-DD_P01_telemetry.json
```

Participant pseudonym (`P01`, `P02`, …) is facilitator-chosen; never store real names in JSON.

---

## Part 1 — iSHARE telemetry (extend existing service)

Goal: make export self-describing and facilitator-friendly without adding notes UI or task controls.

### 1.1 Session envelope on export

Extend export payload (breaking change to raw array — wrap in object):

```ts
interface TestingTelemetrySession {
  schemaVersion: 1;
  exportedAt: string; // ISO — align with OBS stop time
  sessionId?: string; // optional ?session=P01 in URL
  participantId?: string;
  app: 'ishare' | 'icrm'; // app-agnostic from day one (iCRM tested in a later phase)
  build: { production: boolean; telemetryEnabled: boolean };
  events: TestingTelemetryEvent[];
}
```

Add optional query-param bootstrap (`?session=P01`) stored in `sessionStorage` and included in export. The `app` field is set per host app so the dashboard can filter/segment by app — iSHARE now, iCRM later (see Future phases). The service already lives in [`libs/ui`](libs/ui/src/lib/testing-telemetry/testing-telemetry.service.ts), so it is app-agnostic; only the host wiring (avatar menu, markers) is per-app.

### 1.1b Facilitator menu on the top-nav avatar

Reuse the existing user/avatar section in the top nav as the facilitator control surface. The avatar ([`sds-plectrum-avatar`](libs/ui/src/lib/plectrum-avatar/plectrum-avatar.component.ts)) currently lives in [`sds-top-nav`](libs/ui/src/lib/top-nav/top-nav.component.ts) (`c-top-nav__avatar`) and is purely presentational.

When `enableTestingTelemetry` is true, clicking the avatar opens a PrimeNG menu (`p-menu` / `p-popover`) with facilitator actions:

| Menu item              | Action                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| **New session**        | Clear buffer, generate a fresh `sessionId` (e.g. `P0n` or timestamp), record `session_new`            |
| **Start test session** | Begin capture — enable global click/idle listeners, record `session_start`                            |
| **Stop test session**  | End capture — disable listeners, record `session_stop`                                                |
| **Export data**        | Download `YYYY-MM-DD_{sessionId}_telemetry.json` (session envelope from 1.1), record `session_export` |

Start/Stop is a single toggle item (label swaps on state). This is a **session-level** control, not per-task — task segmentation is still manual via the recording timeline.

Implementation:

- Add optional menu support to `sds-top-nav` without breaking other consumers: new inputs `avatarMenuItems?: MenuItem[]` and `avatarMenuAriaLabel?`, plus an `avatarMenuToggle` output (or pass-through). When `avatarMenuItems` is empty/undefined, the avatar behaves exactly as today. Wrap the avatar in a PrimeNG `p-menu`/`p-popover` trigger only when items exist.
- In iSHARE, build the `MenuItem[]` in [`app-shell`](apps/ishare/src/app/layout/app-shell.component.ts) (or a small `TestingSessionMenuService`), gated by `environment.enableTestingTelemetry`, wired to `TestingTelemetryService`.
- Avatar keeps `role="img"`; when it becomes a menu trigger, add `role="button"`, `aria-haspopup="menu"`, and `aria-expanded` so it stays accessible.

This replaces the console-only export and removes the need for a separate facilitator strip.

### 1.2 Richer event targets

Add `data-telemetry-id` on high-value controls (cleaner click paths in dashboard):

- Journey view toggle, sector/sort filters, hors-parcours chip
- Status action button, info tags, list row tags
- Document detail stepper steps, accordion panels (already partially via `data-panel-id`)

Keep existing `recordTelemetry()` calls; IDs improve global click resolution in [`describeClickTarget()`](libs/ui/src/lib/testing-telemetry/testing-telemetry.service.ts).

### 1.2b Click coordinates for future heatmap

Extend each click event with optional spatial fields so an element-frequency view works now and a pixel-overlay heatmap is possible later:

```ts
interface TestingTelemetryEvent {
  event: string;
  target?: string;
  timestamp: string;
  taskId?: string | null;
  // New (clicks only):
  x?: number; // event.clientX
  y?: number; // event.clientY
  viewport?: { w: number; h: number };
  route?: string; // current Router URL
}
```

Captured in [`onGlobalClick()`](libs/ui/src/lib/testing-telemetry/testing-telemetry.service.ts). v1 only consumes `target` (element frequency); `x/y/viewport/route` are stored for a possible v1.1 overlay. Note: a reliable pixel overlay would require pinning the recording resolution — out of scope for v1.

### 1.3 Session lifecycle events

Driven by the avatar menu (1.1b) rather than auto-enabling on component init:

- `session_new` — New session selected (buffer cleared, new `sessionId`)
- `session_start` — Start test session (capture begins)
- `session_stop` — Stop test session (capture ends)
- `session_export` — Export data (download)

`TestingTelemetryService.enable()/disable()` move from the auto-call in [`affiliate-details.component.ts`](apps/ishare/src/app/affiliate-details/affiliate-details.component.ts) constructor to explicit Start/Stop menu actions, so capture only runs when the facilitator intends. Keep the env flag as the master gate (no menu, no capture in production).

Skip `task_start` / `task_stop` wiring per your choice; the dashboard does not assume per-task segments — tasks are aligned manually from the recording.

### 1.4 Production safety

- Keep [`environment.ts`](apps/ishare/src/environments/environment.ts) `enableTestingTelemetry: false`
- Do **not** deploy `apps/dashboard` to GitHub Pages ([`deploy-ishare-pages.yml`](.github/workflows/deploy-ishare-pages.yml) stays iSHARE-only)
- Add a short privacy note to the capture guide (local files, pseudonyms, consent from protocol §2)

---

## Part 2 — `apps/dashboard` (new Angular app)

Internal analysis tool. **Not** part of the design system product surface — minimal chrome, fast to build. v1 scope is **user-testing session analysis**; structure it as a routed shell so a later **design-system metrics** section can be added without rework (see Future phases).

### 2.1 Scaffold

- New project: `apps/dashboard` (mirror `apps/icrm` structure)
- Scripts: `npm run start:dashboard`, `npm run build:dashboard`
- Register in [`angular.json`](angular.json)
- Reuse Plectrum theme via `providePlectrum()` so stock PrimeNG renders on-brand
- **UI approach:** stock PrimeNG components with default styling (`p-table`, `p-chart`, `p-fileupload`, `p-card`) — no bespoke dashboard styling. Reuse existing `libs/ui` components where they fit (custom card, accordion, list) for visual consistency and speed
- Add `chart.js` + PrimeNG `ChartModule` **only for this app** (no chart dep in iSHARE/iCRM)
- **Routed shell from the start:** e.g. `/sessions` (v1) and a placeholder `/design-system` route reserved for the later metrics section. Imported sessions carry the `app` field so views can filter by **iSHARE** vs **iCRM**.

### 2.2 Shared analytics logic

Extract pure functions to a small lib (recommended path: `libs/user-testing/` or subfolder under `libs/ui/src/lib/testing-telemetry/`):

| Function                            | Output                                            |
| ----------------------------------- | ------------------------------------------------- |
| `parseSession(json)`                | Validated `TestingTelemetrySession`               |
| `computeSessionStats(events)`       | duration, click count, idle count, unique targets |
| `buildEventTimeline(events)`        | chronological rows for table/chart                |
| `aggregateClicksByTarget(events)`   | bar chart + element-frequency ranking data        |
| `findIdleGaps(events, thresholdMs)` | hesitation segments                               |
| `detectDeadEnds(events)`            | clicks on known placeholder targets               |

Dead-end list seeded from scenarios plan: Actions rapides, disabled placeholders, etc.

### 2.3 Dashboard views (v1)

Single-page app with file upload. Built from stock PrimeNG + reused `libs/ui` components:

1. **Import** — `p-fileupload` (drag-and-drop or picker); support multiple JSON files for cross-session comparison (optional v1.1)
2. **Summary cards** — reuse the `libs/ui` custom card: session duration, total clicks, idle events, export timestamp
3. **Event timeline** — sortable `p-table` (`event`, `target`, `timestamp`, relative `+mm:ss` from first event)
4. **Click path** — ordered unique targets in a reused accordion / list (sankey optional; v1 can be a simple numbered list)
5. **Charts** — `p-chart` bar: top 10 clicked targets; line/step: clicks per minute
6. **Element frequency (heatmap-lite)** — ranked list of most-clicked `target`s with a relative-intensity bar/shade; the v1 form of heatmapping (no pixel overlay)
7. **Idle gaps** — `p-table` of gaps > 3s with preceding target (confusion signal)

No backend, no auth — runs locally via `ng serve dashboard`.

### 2.4 Correlation aid (lightweight)

Display **relative timestamps** (`+00:00`, `+02:34`) from the first event prominently so the facilitator can scrub the OBS recording to the same offset. Since recording happens on a single laptop, no clock-sync feature is needed — the relative offset is sufficient to jump to the moment in the video.

---

## Part 3 — Documentation (capture-specific)

New doc: [`docs/user-testing/capture-data-workflow.md`](docs/user-testing/capture-data-workflow.md)

Sections:

1. **Before session** — OBS profile (1080p, system + mic audio), dev build checklist, naming convention
2. **During session** — start OBS → open iSHARE (`?session=P01`) → avatar menu **New session** → **Start test session** → run protocol tasks → **Stop test session** → stop OBS → avatar menu **Export data**
3. **After session** — import JSON in dashboard, scrub OBS using `+mm:ss` column, write notes in external template
4. **External notes template** — link to a simple markdown/CSV template with columns: `participantId`, `task`, `outcome (success/partial/fail)`, `timestamp_in_obs`, `quotes`, `observations`

Update [`ishare-moderated-test-protocol.md`](docs/user-testing/ishare-moderated-test-protocol.md):

- Replace “export via console” with the avatar-menu flow (New session / Start / Stop / Export)
- Add OBS + file naming to facilitator checklist
- Cross-link to capture workflow doc

---

## Part 4 — What stays out of scope

- In-app facilitator notes and **per-task** start/stop controls (session-level start/stop only via avatar menu; tasks segmented manually)
- Live/real-time dashboard during sessions
- Pixel-overlay heatmaps on screenshots (deferred to v1.1; needs fixed recording resolution) and third-party session replay (PostHog/Hotjar)
- Server-side storage or multi-user access
- Clock-sync feature between OBS and telemetry (single-laptop recording + relative timestamps make it unnecessary)
- Bespoke dashboard styling — use default PrimeNG + reused `libs/ui` components
- **iCRM testing and design-system metrics** — deferred to later phases (see Future phases); v1 ships iSHARE session analysis only

---

## Part 5 — Future phases (design now, build later)

These are **not** in v1 but shape current structural decisions (app-agnostic envelope, routed dashboard shell) so they slot in cleanly.

### 5.1 iCRM user testing

- Reuse the same [`TestingTelemetryService`](libs/ui/src/lib/testing-telemetry/testing-telemetry.service.ts) (already in `libs/ui`) in iCRM; set `app: 'icrm'` on export.
- Add the env-gated avatar menu to iCRM's shell (same `sds-top-nav` avatar-menu inputs from 1.1b) and `data-telemetry-id` markers on key iCRM controls.
- Add an iCRM-specific protocol + capture doc, mirroring [`ishare-moderated-test-protocol.md`](docs/user-testing/ishare-moderated-test-protocol.md).
- Dashboard `/sessions` gains an **app filter** (iSHARE / iCRM) and supports cross-app comparison.

### 5.2 Design-system metrics view (`/design-system`)

A separate dashboard section surfacing how the design system is used across apps. Candidate views:

- **Most-used components** — counts of `libs/ui` components rendered/used across iSHARE + iCRM (and Storybook), ranked.
- **Counters** — totals: components in `libs/ui`, tokens in `libs/styles`, stories, PrimeNG components wrapped, coverage gaps.
- **Relationship map** — component ↔ component and component ↔ token dependency graph (e.g. which components consume which semantic tokens; which apps import which `libs/ui` exports). A node/edge graph view.
- Optional: adoption over time, orphaned/unused tokens or components.

**Data sourcing (to decide when scoped):** static analysis of the repo (imports from `libs/ui`/`libs/styles`, `index.ts` exports, template selectors, token usage) produced by a build-time script that emits a JSON the dashboard reads — keeping the dashboard a pure JSON consumer, consistent with the session-analysis design. This is distinct from runtime telemetry and will get its own mini-plan when prioritized.

---

## Suggested implementation order

1. Telemetry service: session envelope, `x/y`+viewport+route on clicks, explicit enable/disable, download (unblocks real sessions)
2. `sds-top-nav` optional avatar menu + iSHARE env-gated facilitator menu (New session / Start-Stop / Export)
3. `data-telemetry-id` pass on key controls
4. Analytics pure functions + unit tests (incl. element-frequency aggregation)
5. Scaffold `apps/dashboard` + import + summary + timeline table
6. Charts (bar + clicks/minute) + element-frequency view
7. Capture workflow doc + protocol updates

---

## Success criteria

- Facilitator can run a full session with OBS + iSHARE dev build and end with three aligned files (video, notes, JSON) using a documented naming scheme
- JSON export includes `exportedAt`, optional `participantId`, and structured `events`
- Dashboard loads JSON locally and shows timeline, click aggregates, and idle gaps with relative timestamps for OBS scrubbing
- Production iSHARE build and GitHub Pages deploy expose **no** telemetry UI and **no** dashboard
