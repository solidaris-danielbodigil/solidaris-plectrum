# iSHARE moderated user test protocol

**Deliverable scope:** protocol document + in-app telemetry behind `environment.enableTestingTelemetry` (plan option B).

**Facilitator “today” for mock coherence:** June 2026.

**Test affiliate:** Eva Martinez (NISS `63092814612` or route id from home search).

---

## 1. Introduction

Welcome the participant. Explain that iSHARE is a redesign of the operator tool for tracking affiliate documents and indemnity workflows. This session tests whether experienced operators can complete realistic tasks in the new interface.

Clarify:

- There is no right or wrong “click path” — we care about how you think and what you notice.
- Some areas are still placeholders; if something does not work, say so and move on.
- Think aloud when comfortable.

---

## 2. Consent

Before starting:

1. Confirm consent to **audio/video screen recording** for analysis.
2. Confirm consent to **anonymous interaction logging** (clicks, timing) when the test build has telemetry enabled.
3. Confirm the participant may stop at any time.

Note: telemetry is exported as JSON automatically when the facilitator stops the test session via the top-nav **avatar menu** → **Arrêter la session test**. See [capture-data-workflow.md](./capture-data-workflow.md).

---

## 3. Tasks

### Task 1 — Incapacity not yet paid (Scenario 1)

**Prompt (facilitator):**  
*« L'affilié appelle pour sa prolongation de maladie du 25 au 27 décembre 2025. Elle n'a toujours pas reçu de paiement. Pouvez-vous vérifier l'état du dossier et expliquer pourquoi ? »*

**Starting point:** Eva Martinez dossier, Vue parcours ON.

**Success criteria:**

- Opens **Incapacité** in the demande primaire parcours.
- Finds the **Paiement** step with message *pas de paiement reçu pour le moment* for period 25–27/12/2025.
- Finds **Certificat** prolongation Accepté for 25–27/12/2025.
- Optionally connects missing C4 on demande primaire Calcul as a root cause.
- May reference header tag **Paiement incapacité: Non versé** if noticed.

**Partial:** Finds incapacité flux but cannot explain non-payment.  
**Fail:** Cannot locate incapacité document or asserts payment was sent.

---

### Task 2 — C4 claimed sent, not in workflow (Scenario 2)

**Prompt:**  
*« Il prétend avoir remis son C4 pour sa demande primaire mais vous ne le trouvez pas dans les workflows. Où allez-vous trouver l'information ? »*

**Success criteria:**

1. Opens **demande primaire** → **Calcul** → **message d'alerte** C4 manquant (15/12/2025), e.g. via the warn count tag.
2. Turns **Vue parcours OFF** (or searches flat list) and finds standalone **C4** with réception **16/12/2025**.
3. Explains the document is **reçu mais non rattaché** au parcours — workflow alert remains until linked.

**Partial:** Step 1 only.  
**Fail:** Concludes C4 was never received.

---

### Task 3 — Child dossier without affiliate search (Scenario 3)

**Prompt:**  
*« Je dois consulter le dossier iShare de Jack, enfant à charge. Je n'ai pas son NISS sous la main. »*

**Starting point:** Eva Martinez dossier → **Voir carte affilié** → Famille.

**Success criteria:**

- Opens affiliate drawer and selects **Jack Mota** (enfant à charge, DOB 14/08/2015).
- Lands on Jack's dossier (different header name / NISS).
- Identifies at least one active document in Jack's list.

**Partial:** Finds Jack in Famille but cannot open dossier.  
**Fail:** Uses home search without being prompted.

---

### Task 4 — Launch a CICS transaction (Scenario 4)

**Prompt:**  
*« L'affilié demande combien de jours de vacances ONVA il lui reste. Ouvrez la transaction CICS adaptée. »*

**Success criteria:**

- Opens **Transactions CICS** from a document panel (or header if available).
- Uses search to find **UA38** (jours vacances ONVA).
- Clicks the per-row **CICS** launch CTA.

**Partial:** Opens modal but wrong transaction.  
**Fail:** Cannot open Transactions CICS.

---

### Task 5 — Attestation pédicure receipt (Scenario 5)

**Prompt:**  
*« J'ai remis une attestation de soin pédicure le 9/06/2026, est-ce que vous l'avez bien reçue ? »*

**Success criteria:**

- Turns **Vue parcours OFF** (isolated document not in parcours groups).
- Finds **Attestation de soin pédicure** with réception **09/06/2026**.
- Confirms **Reçu** in audit timeline (09/06/2026 13:28) and answers clearly yes/no.
- Notes application **Remboursements AO/AC**.

**Partial:** Finds document but wrong date.  
**Fail:** Looks only inside indemnity parcours.

---

## 4. Post-task questions (after each task)

1. How confident are you that you found the right answer? (1–5)
2. What was confusing or different from legacy iShare?
3. Did you use the count tags (info/warn badges) on document rows?
4. For Task 2/5: Did turning off Vue parcours help?

---

## 5. Debrief & SUS note

**Debrief (5 min):**

- Overall impression of the new layout vs legacy.
- Journey view vs flat list preference.
- Anything missing for daily operator work.

**SUS (optional, 10 items):**  
If time permits, administer the standard System Usability Scale questionnaire and score per Brooke (1986). Not required for pass/fail of individual tasks.

**Session close:** Thank participant; remind them recording/logging use is internal only.

---

## Facilitator checklist (before session)

- [ ] Development build with `enableTestingTelemetry: true` (`npm run start`).
- [ ] OBS profile ready (screen + cursor + mic); naming convention agreed (`YYYY-MM-DD_P01_*`).
- [ ] Optional session URL: `?session=P01` on affiliate route.
- [ ] Avatar menu flow rehearsed: **Démarrer la session test** → **Arrêter la session test** (auto-export JSON).
- [ ] Dashboard available locally: `npm run start:dashboard` (post-session analysis).
- [ ] Vue parcours ON/OFF — 6 documents in flat list, 4 in groups + 2 standalone in journey mode.
- [ ] Scenario 5 attestation réception exactly **09/06/2026**.
- [ ] Scenario 2 C4 réception **16/12/2025** + Calcul alerte **15/12/2025**.
- [ ] Scenario 1 — no paiement Accepté before 27/12/2025.
- [ ] Jack Mota navigation from drawer works.
