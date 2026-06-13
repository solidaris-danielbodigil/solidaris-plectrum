# User testing data capture workflow

This guide describes how facilitators capture aligned session artifacts (OBS recording, external notes, telemetry JSON) for moderated iSHARE user tests.

## Privacy

- Use participant pseudonyms only (`P01`, `P02`, …) — never real names in filenames or JSON.
- Recordings, notes, and telemetry stay on the facilitator laptop.
- Confirm consent per [ishare-moderated-test-protocol.md](./ishare-moderated-test-protocol.md) §2 before starting.

## File naming convention

```
YYYY-MM-DD_P01_obs.mp4
YYYY-MM-DD_P01_notes.docx
YYYY-MM-DD_P01_telemetry.json
```

The telemetry export filename is generated automatically: `YYYY-MM-DD_{sessionId}_telemetry.json`.

---

## 1. Before session

1. **OBS profile** — 1080p canvas, capture display + cursor, record system audio + facilitator mic.
2. **Dev build** — run iSHARE with `enableTestingTelemetry: true` (development configuration).
3. **Optional URL** — open `http://localhost:4200/?session=P01` so `participantId` is set in the export.
4. **Mock checklist** — verify scenarios in the [moderated test protocol](./ishare-moderated-test-protocol.md) facilitator checklist.
5. **Notes template** — prepare an external doc with columns: `participantId`, `task`, `outcome`, `timestamp_in_obs`, `quotes`, `observations`.

---

## 2. During session

1. Start **OBS** recording.
2. Open iSHARE dev build (with `?session=P01` if used).
3. Avatar menu → **Démarrer la session test** (capture begins; a new session is created automatically if needed).
4. Run protocol tasks; encourage think-aloud.
5. Avatar menu → **Arrêter la session test** when finished (stops capture and downloads JSON automatically).
6. Stop **OBS** recording.

Capture only runs between Start and Stop — navigating away does not auto-start telemetry.

---

## 3. After session

1. Rename OBS file to `YYYY-MM-DD_P01_obs.mp4` (or your pseudonym).
2. Complete external notes; reference OBS timestamps where helpful.
3. Run the analysis dashboard:

   ```bash
   npm run start:dashboard
   ```

4. Open **Sessions** → **Import JSON** → select the telemetry file.
5. Use the **+mm:ss** column to scrub the OBS recording to the same moment.
6. Review click path, top targets, idle gaps, and element frequency for confusion signals.

---

## 4. Avatar menu reference

| Item | Action |
|------|--------|
| Démarrer la session test | Creates session if needed, begins global click + idle capture |
| Arrêter la session test | Ends capture, downloads session envelope JSON, logs `session_stop` and `session_export` |

The menu appears only when `environment.enableTestingTelemetry` is `true` (development builds).

---

## Related docs

- [iSHARE moderated test protocol](./ishare-moderated-test-protocol.md)
- [User testing scenarios plan](../../.cursor/plans/user_testing_scenarios_7869e1dd.plan.md)
