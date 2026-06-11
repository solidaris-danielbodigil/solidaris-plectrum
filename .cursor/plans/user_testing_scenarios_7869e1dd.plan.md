---
name: User testing scenarios
overview: "A user-testing plan for the iSHARE app: 4 validated task scenarios grounded in the actual app (including legacy Transactions CICS), incapacity domain logic and operator-guide document taxonomy for mock data, additional use-case suggestions, and options for capturing behavioral data (clicks, timing, idle). Includes which scenarios are completable today versus blocked by placeholders."
todos:
  - id: decide-scope
    content: "Confirm deliverable scope: protocol doc only / + in-app data capture / capture only"
    status: pending
  - id: decide-placeholders
    content: "Decide placeholder handling: test-as-is (reframe Scenario 1, drop/rewrite Scenario 3) / build missing flows / mock stubs"
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
  - id: mock-data-incapacity
    content: "Enrich Eva Martinez mock data per incapacity domain logic + operator guide (workflows, document types, statuses, audit events)"
    status: pending
  - id: transactions-cics-modal
    content: "If chosen: build Transactions CICS modal/drawer (searchable list + CICS launch CTA) wired from panel/header actions"
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
- Domain reference (legacy UI, same logic): [libs/assets/Guide opérateur iShare.pdf](libs/assets/Guide%20op%C3%A9rateur%20iShare.pdf) — operator guide, Jan 2024

## Operator guide reference (document taxonomy & content)

Source: [libs/assets/Guide opérateur iShare.pdf](libs/assets/Guide%20op%C3%A9rateur%20iShare.pdf). Legacy screenshots and labels; **business logic and document types are still valid** in the new app — only UI/UX changed.

### What iShare tracks (any sector)

Each document tab in the list shows:

- **Source** — IGED treatment file (e.g. "Gestion des certificats ITT", "Gestion des cartes de reprise")
- **Date de réception** — when IGED received the scan
- **Statut** — simplified IGED status

Document detail (right panel / second column) shows:

- **Délai de traitement** — estimated average from IBox (not real elapsed time)
- **Step timeline** — expandable rows: date, description, application, source (IGED)
- **IRIS** — link to scanned document image (access-gated, same rules as IRIS)
- **Incapacity period** — start/end dates on demande primaire panels

Status colour mapping (guide → new app severities):

| Guide | Meaning | New app |
|---|---|---|
| Vert | Accepté | `success` |
| Orange | En cours / En traitement | `warn` |
| Rouge | Refus | `danger` |

List behaviour worth mocking: documents **clôturés** stay in "en cours" for **1 month**, then move to **archives** (3-month rule planned). Filters: by **secteur**, sort by **date de réception** or **dernière action**, **action en cours** (pending/processing → received → closed).

### Indemnités workflows (the test focus)

Two linked flux de travail drive indemnity scenarios:

1. **Demande Primaire - Régime général**
2. **Demande Incapacité** (opens when incapacity-related docs arrive)

Plus **Rechute - Régime général** (same structure as primaire) and **Rechute - Incapacité** (parallel incapacity flux during relapse). Workflows chain via prev/next navigation between related parcours.

#### Demande primaire — mandatory steps & panels

| Step | Panel / document | Mandatory? | Mock content to include |
|---|---|---|---|
| 1. Certificat médical | **CIT** (certificat ITT) | Yes — accepted CIT required to start | Date réception, n° certificat, période incapacité, statut (Accepté / Refusé + raison), audit trail (Reçu → En traitement → Accepté), IRIS + Transactions CICS actions |
| 2. Feuilles de renseignement | **F.D.R. employeur** ou chômage | Yes | Date réception, date du risque, statut, worker comment if incomplete |
| | **F.D.R. affilié** | Yes | Idem; link to incapacité de travail variant |
| | **Compte financier** | Yes | Idem; liasse variant |
| | C4, déclarations d'accidents, questionnaires TI | Conditional | Appear as extra panels or **alerte** / worker comments when missing (Scenario 2 already uses C4 on Calcul) |
| 3. Calcul | **CALC** | Yes — verification + indemnity amount | Date réception, statut (En attente / Accepté), worker comment for missing docs, indemnité outcome for Scenario 1 |

Already partially mocked in `doc-demande-primaire`: CIT, three F.D.R. panels, Calcul with C4 warn comment. Gaps: CIT **refus** variant, chômage F.D.R. variant, déclaration accident / questionnaire TI panels, explicit **délai de traitement** and **indemnité** fields.

#### Demande incapacité — document types received during incapacity

Flux starts when any qualifying document is received. **Payments always sort chronologically at the top**; other docs stack below.

| Document type | When it appears | Mock detail fields |
|---|---|---|
| **Paiement** | Each indemnity payment | Date réception, date traitement, amount/period, statut |
| **Prolongation** | Extended incapacity | Dates, link to CIT period |
| **Carte de reprise** | Return-to-work | Date réception, date clôture CIT, statut |
| **Attestation de VA** (vacances annuelles) | Annual leave attestation | Date réception, date traitement, date clôture |
| **Fiche 225** | F225 form | Date réception, statut |
| **CIT** (prolongation cert.) | New/extended certificate | Same as primaire CIT panel |

Currently `doc-incapacite` has **empty** stepper panels — this is the highest-priority mock fill for Scenario 1.

#### Rechute — same taxonomy, different parcours

- **Rechute - Régime général:** identical mandatory set to demande primaire (CIT → F.D.R. → CALC).
- **Rechute - Incapacité:** same ongoing doc types as demande incapacité (paiements top, VA/prolongation/carte de reprise below).
- Workflows **chain** across primaire ↔ incapacité ↔ rechute via navigation buttons (maps to new app parcours prev/next + "Vue parcours").

### Operator signals → mock UI elements

| Guide concept | Meaning | New app mapping | Mock idea |
|---|---|---|---|
| **Message d'alerte** | Document incomplete in IGED; action needed from affilié, employeur, or chômage | Worker comment (`severity: warn`) + deep-link count tag | Scenario 2 (C4 missing on Calcul); add alerte on F.D.R. panel for missing employeur doc |
| **Puce d'information** | Document linked by deduction — data unreliable or mis-filed | Info worker comment or info tag on list item | Add one panel with info comment: "document lié par déduction — vérifier le rangement" |
| **Réidentification affilié** | Scan filed under wrong person | First audit event in timeline | Rare scenario; optional mock on a closed doc |
| **Réidentification document** | Wrong barcode, correct affilié | First activity in detail timeline | e.g. "Reçu Gestion certificats ITT → Réidentifié → Reçu Gestion cartes de reprise" (guide p.17) |

### Carnet affilié (drawer) — guide vs new app

| Guide field | New app |
|---|---|
| Nom titulaire (bleu) / personnes à charge (noir) | Drawer Famille list — titulaire vs dependents styling |
| Composition du carnet mutualiste | Famille accordion entries |
| Notes / alertes | Notes accordion (sensitive notes, e.g. "Personne agressive") |

### Map guide content → current mock coverage

| Guide area | In new mock today? | Priority for test data |
|---|---|---|
| Demande primaire CIT + F.D.R. + CALC | Partial (`doc-demande-primaire`) | Medium — add refus variant, délai traitement, indemnité status |
| Demande incapacité ongoing docs | No (`doc-incapacite` empty) | **High** — Scenario 1 |
| Rechute régime général + incapacité | No (`doc-rechute` empty, not split) | **High** |
| Paiements (chronological top) | No | **High** for Scenario 1 |
| Message d'alerte / incomplete | Partial (C4 on Calcul — Scenario 2) | Medium — extend to F.D.R. |
| Puce d'information (deduction) | No | Low — good edge-case task |
| Réidentification timeline | Partial (CERTIFICAT_ITT_MORE_DETAILS has generic audit) | Low |
| IRIS / Transactions CICS actions | Buttons rendered, no handler | Scenario 4 |
| Archived vs en cours (1-month rule) | Partial (`parcours-clotures` + archive toggle) | Medium |
| Secteur / date / action filters | UI exists | Additional use-case #2 |

## The 4 proposed scenarios - feasibility

- Scenario 1 - Dec 2025 incapacity, not yet paid: PARTIAL. Anchored in the **demande primaire** parcours: Certificat ITT period ends 24/12/2025; `doc-incapacite` exists in the list but has no detail content yet. Per the operator guide, unpaid indemnity should surface as a **paiement** panel at the top of the incapacité flux (chronological payments first). No payment/indemnité status UI today. The "why not paid" answer only exists as worker comments (e.g. missing C4 on Calcul — a conditional doc per guide), not an explicit payment state. Either reframe the task ("where would you look for the status of this incapacity?") or enrich mock data + add a payment/status indicator.
- Scenario 2 - C4 in the workflows: COMPLETABLE as a discovery task. C4 is a conditional document in the F.D.R. step (guide: "pourra s'ajouter aux flux") — not a standalone document type. Mocked as a **message d'alerte** / warn worker comment on the Calcul step, reachable via the "1" warning count tag that deep-links to the panel ([mock L202-206](apps/ishare/src/app/affiliate-details/affiliate-document-detail/affiliate-document-detail.mock.ts)). Good "find the information" task.
- Scenario 3 - Find child Jack's iShare dossier without affiliate search: NOT COMPLETABLE today. Jack Mota exists in the drawer Famille list (`enfant a charge`), but the family arrow button's `familyMemberSelect` output is not bound in the app, and all data is hard-coded to Eva Martinez, so there is no child dossier to navigate to. Requires building family-member navigation (real or mocked) before this can be tested.
- Scenario 4 - Launch a CICS transaction from the dossier: NOT COMPLETABLE today. Legacy iShare exposes a header **Transactions CICS** button that opens a modal with a warning banner, a searchable transaction table (columns: Transaction / Description / Actions), and per-row external-link CTAs to open the transaction in CICS (see legacy screenshot in `assets/image-d7c6548b-a00c-4a0d-8bd1-51212dac2701.png`). The new app shows **Transactions CICS** as panel action buttons on document detail panels (Certificat ITT, F.D.R. panels, Calcul) but they have no click handler and no modal/drawer exists. Task idea: *"The affiliate asks about their ONVA vacation days — find and open the right CICS transaction."* Success = open modal, search (e.g. `UA38`), launch CICS CTA. Requires building the modal/drawer + wiring actions (header-level entry point optional but matches legacy mental model).

## Incapacity domain logic (mock data guide)

Reference diagram: `assets/image-5ddebb37-1406-4045-8b1d-bf89d91e683e.png`

The indemnities parcours follows a fixed lifecycle. Mock data for Eva Martinez should reflect these rules so scenarios (especially Scenario 1) tell a coherent story.

### Parcours structure

| Phase | Document type | What it contains |
|---|---|---|
| **1. Demande primaire** | Demande primaire - Régime général | Documents obligatoires pour percevoir la première indemnité |
| | Incapacité (within primary parcours) | Documents reçus au cours de l'incapacité |
| **2. Rechute** | Rechute - Régime général | Documents obligatoires pour percevoir la première indemnité (same doc set as primary) |
| | Rechute - Incapacité | Documents reçus au cours de l'incapacité |
| **3. Invalidité** | Invalidité | Documents reçus au cours de l'invalidité |

### Business rules (when each phase applies)

- **Rechute trigger:** L'affilié retombe en maladie dans les **14 jours** qui suivent sa reprise au travail pour une incapacité, ou dans les **3 mois** pour une invalidité.
- **Invalidité trigger:** Après **1 an** d'incapacité continue.

### Current mock gaps vs domain logic

What exists today in `EVA_MARTINEZ_DOCUMENT_GROUPS` / `EVA_MARTINEZ_DOCUMENT_DETAILS`:

- **Demande primaire parcours** (`parcours-demande-primaire`, 24/11/2025–24/12/2025): `doc-demande-primaire` has full stepper detail (Certificat ITT, F.D.R. panels, Calcul with C4 warn comment). `doc-incapacite` exists in the list but its detail record has **empty panels** on all three steps.
- **Rechute parcours** (`parcours-rechute`, 01/01/2026–15/01/2026): `doc-rechute` exists in the list but detail is also **empty** — no separate "Rechute - Régime général" vs "Rechute - Incapacité" split.
- **Invalidité:** No parcours or document yet.
- **Closed parcours** (`parcours-clotures`): Has closed demande primaire + incapacité entries — useful as historical context but not wired to the active scenario dates.

### Suggested mock data to add (when building flows)

Aligned with the operator guide taxonomy (see section above):

1. **Fill `doc-incapacite`** (demande primaire parcours): stepper panels for ongoing incapacity — **paiement** panel at top (not yet paid / en attente for Scenario 1), then prolongation or attestation VA, optional carte de reprise. Include date réception, date traitement, période, audit events per guide.
2. **Split rechute parcours** into `doc-rechute-regime-general` (CIT → F.D.R. employeur/affilié/compte financier → CALC, mirror primaire) + `doc-rechute-incapacite` (paiements + VA/prolongation). Dates respect the 14-day rechute rule.
3. **Enrich `doc-demande-primaire`**: add `délai de traitement` field on detail header; one **refus CIT** example in closed parcours; optional chômage F.D.R. variant; explicit **indemnité** outcome on Calcul ("non versée — C4 manquant").
4. **Operator signals**: one **alerte** on an F.D.R. panel (incomplete — action employeur); one **puce d'information** panel (lié par déduction); optional **réidentification** audit event on a secondary panel.
5. **Add invalidité parcours** (optional v1): ≥ 1 year after incapacity start; invalidity-period documents per diagram.
6. **Transactions CICS mock list**: UA38 (jours vacances ONVA), UALG, UBET, UCAB, UCCT, UCDM, UCFI — matches legacy modal screenshot and guide indemnités context.

## Additional use-case suggestions

Grounded in features that exist:

1. Search -> dossier entry: From Home, search by O.A. (319) + NISS and land on the affiliate page. Tests the entry funnel and breadcrumb.
2. Filter the document list: Use header info-tag filters (Documents actifs / Documents clotures / Derniere action) and the toolbar "Documents archives seulement" toggle to narrow the list. "Show me only closed documents."
3. Journey vs flat view: Toggle "Vue parcours" and ask the tester to locate a document both ways; compare which mental model they prefer.
4. Multi-target comment deep-link: Click the "2" info count tag, choose a panel from the popover (e.g. F.D.R. affilie - Incapacite), confirm they understand the jump + highlight. Tests the deep-link affordance and the new message pulse highlight.
5. Step-through a workflow: Use the stepper (Certificat medical -> Feuilles de renseignement -> Calcul) with prev/next, open accordions, and read the worker comment. "Walk me through where this request stands."
6. Audit trail / "Voir plus de details": Open the timeline drawer on Certificat ITT and interpret the audit events (24-27/11/2025). Tests comprehension of the history view.
7. Copy an identifier: Use a copyable identifier (NISS / N de contrat) - small but common real task.
8. Incomplete document / alerte: Find the message d'alerte on a panel where IGED status is incomplete and identify who must act (affilié, employeur, chômage). Tests worker-comment + alert affordance per guide p.12.
9. Mis-filed document (puce d'information): Locate a panel flagged as "lié par déduction" and explain what it means. Tests info-severity comment comprehension.
10. Workflow chaining: From rechute incapacité, use parcours navigation to jump back to demande primaire régime général. Tests cross-parcours linking described in guide p.15.

Avoid over-testing placeholders: family arrow navigation, drawer menu / Actions rapides, status "Action requise" workflow, the Documents tab inside the drawer, Transactions CICS panel buttons (no handler/modal), and real API lookup by `:id`.

## Should we capture data? - recommendation

Yes, lightweight quantitative capture meaningfully complements moderated observation. The app currently has NO analytics/telemetry of any kind, so anything here is net-new.

Metrics worth capturing per task:

- Task success (completed / partial / failed / gave up) - usually recorded by the facilitator, not code.
- Time on task (start of task -> success event).
- Click/interaction count and the path of clicks (which sections they explored before finding the answer).
- Misclicks / dead-ends: clicks on placeholders (Actions rapides, drawer menu, status button) signal where users expect functionality that is not there.
- Idle / hesitation time on specific zones (e.g. time hovering the document list before first click) - signals confusion.
- Deep-link tag usage: did they discover the count tags, or scroll manually?
- Transactions CICS (Scenario 4): modal open, search used, which transaction launched.

Capture options (lightweight -> heavier):

- A. No code: screen + audio recording + facilitator notes. Fastest to start, good for small N.
- B. Minimal in-app event logger: a tiny `TestingTelemetryService` that records `{ event, target, timestamp, taskId }` to memory and exports JSON/CSV at session end. A single global click listener + a few explicit markers (task start/end, drawer open, tag click). Respects the project's no-analytics-dependency posture; no third-party SDK.
- C. Third-party product analytics (PostHog / Matomo) with session replay + heatmaps. Most insight, but adds a dependency and privacy/consent overhead - likely overkill for moderated scenario testing.

Recommendation: B for quantitative signals if we want data, layered on top of A (recording + notes). Keep it test-only (env flag or separate build) so it never ships to production.

## Open decisions (asked, not yet answered)

1. Deliverable scope: protocol document only, protocol + in-app data capture, or data capture only.
2. Placeholder handling: test only what exists (rewrite/drop Scenario 3 + reframe Scenario 1, skip Scenario 4), build the missing flows (family navigation + payment status + Transactions CICS modal + enriched incapacity mock data) so all scenarios are completable, or add mock-only stubs just for testing.

## Suggested next steps once decisions are made

- If protocol-only: produce a structured test script (intro, consent, tasks 1..N with success criteria, post-task questions, SUS/debrief) as a markdown doc under the repo (e.g. `docs/user-testing/`).
- If instrumentation: add a test-only `TestingTelemetryService` in `libs/` behind an environment flag, a global click/idle listener, explicit task-start/stop markers in `affiliate-details`, and a JSON/CSV export. No production wiring.
- If building missing flows: wire `familyMemberSelect` -> a (mock) child dossier; enrich mock data per incapacity domain logic + operator guide taxonomy (document types, statuses, audit events, alertes); add an incapacity/payment status indicator; build the Transactions CICS modal/drawer (searchable table + CICS launch CTA) and wire panel/header actions — all behind the existing mock data layer.
