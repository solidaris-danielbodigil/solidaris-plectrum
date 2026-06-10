---
name: User testing scenarios
overview: "A user-testing plan for the iSHARE app: validated task scenarios grounded in the actual app, additional use-case suggestions, and options for capturing behavioral data (clicks, timing, idle). Includes which scenarios are completable today versus blocked by placeholders."
todos:
  - id: decide-scope
    content: "Confirm deliverable scope: protocol doc only / + in-app data capture / capture only"
    status: pending
  - id: decide-placeholders
    content: "Decide placeholder handling: test-as-is (reframe Scenario 2, drop/rewrite Scenario 4) / build missing flows / mock stubs"
    status: pending
  - id: write-protocol
    content: "Write the moderated test script: intro, consent, tasks with success criteria, post-task questions, debrief"
    status: pending
  - id: telemetry-service
    content: "If capturing data: add test-only TestingTelemetryService (event/target/timestamp/taskId) behind env flag with JSON/CSV export"
    status: pending
  - id: telemetry-markers
    content: "If capturing data: add global click/idle listener + task start/stop and drawer/tag markers in affiliate-details"
    status: pending
  - id: missing-flows
    content: "If chosen: wire familyMemberSelect to a mock child dossier and add an incapacity/payment status indicator"
    status: pending
isProject: false
---

# iSHARE user testing scenarios

## Status: planning / not started

Two scoping decisions are still open (see "Open decisions" at the end). This document captures the research so it can be picked up later.

## App reality check (grounds every scenario)

The app has two real routes under a shared shell. All affiliate data is hard-coded to "Eva Martinez" regardless of `:id`. Many actions are placeholders (toasts / unbound outputs). Key files:

- Routes: [apps/ishare/src/app/app.routes.ts](apps/ishare/src/app/app.routes.ts)
- Affiliate page: [apps/ishare/src/app/affiliate-details/affiliate-details.component.html](apps/ishare/src/app/affiliate-details/affiliate-details.component.html) + `.ts`
- Document detail: [apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.component.ts](apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.component.ts)
- Drawer (Carte affilié): [libs/ui/src/lib/affiliate-detail-drawer](libs/ui/src/lib/affiliate-detail-drawer)
- Mock data: [apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.mock.ts](apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.mock.ts) and `EVA_MARTINEZ_*` constants in `affiliate-details.component.ts`

## The 4 proposed scenarios - feasibility

- Scenario 1 - Aggressivity / "personne agressive": COMPLETABLE. Header "Voir carte affilie" -> drawer Notes -> sensitive note "Personne agressive" with "Informations sensibles" tag (eye icon, danger styling). Clean success path.
- Scenario 2 - Dec 2025 incapacity, not yet paid: PARTIAL. There is an "Incapacite" document and a Certificat ITT period ending 24/12/2025, but no payment/indemnite status UI. The "why not paid" answer only exists as worker comments, not an explicit payment state. Either reframe the task ("where would you look for the status of this incapacity?") or build a payment/status indicator.
- Scenario 3 - C4 in the workflows: COMPLETABLE as a discovery task. C4 is not a document type; it is a warn worker comment on the Calcul step, reachable via the "1" warning count tag that deep-links to the panel ([mock L202-206](apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.mock.ts)). Good "find the information" task.
- Scenario 4 - Find child Jack's iShare dossier without affiliate search: NOT COMPLETABLE today. Jack Mota exists in the drawer Famille list (`enfant a charge`), but the family arrow button's `familyMemberSelect` output is not bound in the app, and all data is hard-coded to Eva Martinez, so there is no child dossier to navigate to. Requires building family-member navigation (real or mocked) before this can be tested.

## Additional use-case suggestions

Grounded in features that exist:

1. Search -> dossier entry: From Home, search by O.A. (319) + NISS and land on the affiliate page. Tests the entry funnel and breadcrumb.
2. Filter the document list: Use header info-tag filters (Documents actifs / Documents clotures / Derniere action) and the toolbar "Documents archives seulement" toggle to narrow the list. "Show me only closed documents."
3. Journey vs flat view: Toggle "Vue parcours" and ask the tester to locate a document both ways; compare which mental model they prefer.
4. Multi-target comment deep-link: Click the "2" info count tag, choose a panel from the popover (e.g. F.D.R. affilie - Incapacite), confirm they understand the jump + highlight. Tests the deep-link affordance and the new message pulse highlight.
5. Step-through a workflow: Use the stepper (Certificat medical -> Feuilles de renseignement -> Calcul) with prev/next, open accordions, and read the worker comment. "Walk me through where this request stands."
6. Audit trail / "Voir plus de details": Open the timeline drawer on Certificat ITT and interpret the audit events (24-27/11/2025). Tests comprehension of the history view.
7. Copy an identifier: Use a copyable identifier (NISS / N de contrat) - small but common real task.

Avoid over-testing placeholders: family arrow navigation, drawer menu / Actions rapides, status "Action requise" workflow, the Documents tab inside the drawer, and real API lookup by `:id`.

## Should we capture data? - recommendation

Yes, lightweight quantitative capture meaningfully complements moderated observation. The app currently has NO analytics/telemetry of any kind, so anything here is net-new.

Metrics worth capturing per task:

- Task success (completed / partial / failed / gave up) - usually recorded by the facilitator, not code.
- Time on task (start of task -> success event).
- Click/interaction count and the path of clicks (which sections they explored before finding the answer).
- Misclicks / dead-ends: clicks on placeholders (Actions rapides, drawer menu, status button) signal where users expect functionality that is not there.
- Idle / hesitation time on specific zones (e.g. time hovering the document list before first click) - signals confusion.
- Drawer open/close and which accordion (Famille / Notes) they open first for Scenario 1.
- Deep-link tag usage: did they discover the count tags, or scroll manually?

Capture options (lightweight -> heavier):

- A. No code: screen + audio recording + facilitator notes. Fastest to start, good for small N.
- B. Minimal in-app event logger: a tiny `TestingTelemetryService` that records `{ event, target, timestamp, taskId }` to memory and exports JSON/CSV at session end. A single global click listener + a few explicit markers (task start/end, drawer open, tag click). Respects the project's no-analytics-dependency posture; no third-party SDK.
- C. Third-party product analytics (PostHog / Matomo) with session replay + heatmaps. Most insight, but adds a dependency and privacy/consent overhead - likely overkill for moderated scenario testing.

Recommendation: B for quantitative signals if we want data, layered on top of A (recording + notes). Keep it test-only (env flag or separate build) so it never ships to production.

## Open decisions (asked, not yet answered)

1. Deliverable scope: protocol document only, protocol + in-app data capture, or data capture only.
2. Placeholder handling: test only what exists (rewrite/drop Scenario 4 + reframe Scenario 2), build the missing flows (family navigation + payment status) so all scenarios are completable, or add mock-only stubs just for testing.

## Suggested next steps once decisions are made

- If protocol-only: produce a structured test script (intro, consent, tasks 1..N with success criteria, post-task questions, SUS/debrief) as a markdown doc under the repo (e.g. `docs/user-testing/`).
- If instrumentation: add a test-only `TestingTelemetryService` in `libs/` behind an environment flag, a global click/idle listener, explicit task-start/stop markers in `affiliate-details`, and a JSON/CSV export. No production wiring.
- If building missing flows: wire `familyMemberSelect` -> a (mock) child dossier and add an incapacity/payment status indicator, each behind the existing mock data layer.
