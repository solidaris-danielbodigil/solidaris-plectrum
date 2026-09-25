# Storybook task sessions — September 2026

Formative research on the Plectrum Storybook as the documentation home. Six people who have not seen the September changes: three designers, three developers. One person at a time, 45 minutes, screen shared. Record completion, help needed and confidence; do not time people.

This is not a statistically representative study. Use it to find where the docs fail, not to prove a score.

## Before the session

- Storybook running at the published URL or `npm run storybook` on the facilitator's machine.
- Figma libraries enabled on the participant's account (designers). If not, that is the first observation.
- Recording template below copied into a fresh file per participant: `.ai/research/sessions/2026-09-<initials>.md`.
- The facilitator reads the script as written and does not explain the docs.

## Script

"You will use the Plectrum Storybook to do a few things a designer or developer does in a normal week. Think aloud. If you are stuck for more than two minutes I will ask what you expected to find, then help you. There are no wrong answers; when you cannot find something, the documentation is wrong, not you."

Open `?path=/docs/introduction--docs`. Start the first task that matches the participant's role.

## Tasks

Designers do D1, S1, S2, D2, S3, S4. Developers do V1, S1, S2, S3, S4. Shared tasks are S.

- **D1 — Start a form in Figma from Storybook.** "You have to design a form with a member number field. Starting here, find which Figma library to open and which component to use." Pass: enables or finds the PrimeNG kit, opens InputText with Label and Help text, and can name the Storybook page (Form Field) without help.
- **V1 — Install and render Form Field.** "You have a fresh Angular app. Use the docs to install Plectrum and show one labelled text field." Pass: follows Build with Plectrum, installs the tarballs and peers, pastes the Form Field snippet, sees the themed field. No repository source imported, no snippet repaired.
- **S1 — Choose an action hierarchy.** "A screen has Save, Cancel and Delete document. Which button treatment does each get, and why?" Pass: primary filled, secondary outlined or text, danger with a confirming dialog, explained from the Button page.
- **S2 — Find error guidance.** "A form field must show an error when it is empty on submit. Find where the docs say how." Pass: reaches Form Field or InputText through Find a component within two minutes, using a task word (error, validation).
- **D2 — Select tokens and responsive behaviour.** "Pick the text and background colours for body text on a card, the space between two form fields, and say what changes on a phone." Pass: names an approved text/surface pair, `gap-2` for related fields, and stacking or padding change at the narrow width, from the Foundations pages.
- **S3 — Interpret status and accessibility.** "On the Drawer page, tell me who owns it, whether you may use it in your app, and what accessibility testing has actually been done." Pass: reads Core and the owner badge, distinguishes the WCAG target from the evidence table, says Not assessed where it says so.
- **S4 — Propose a missing capability.** "You need a component that does not exist. What do you do, what do you send, and what happens next?" Pass: finds the proposal route, names the frame link, the components tried and what the screen must do, and one of the three core-team answers.

## Recording template

```
Participant: <initials>   Role: designer | developer   Date: YYYY-MM-DD
Facilitator:               Recording: yes | no

| Task | Completed | Help needed | Confidence 1-5 | Where they hesitated | Quote |
|------|-----------|-------------|----------------|----------------------|-------|
| D1/V1 |          |             |                |                      |       |
| S1   |           |             |                |                      |       |
| S2   |           |             |                |                      |       |
| D2   |           |             |                |                      |       |
| S3   |           |             |                |                      |       |
| S4   |           |             |                |                      |       |

Completed: yes | partial | no.  Help needed: none | hint | shown.
Three things to fix, in the participant's words:
1.
2.
3.
```

## Launch bar

At least five of six complete each shared task (S1–S4) without help, and each role task (D1, V1, D2) is completed by at least two of three. Record every failure with the page the person was on. Failures are documentation tickets, not participant errors.

## Agent-run dry runs

Before the human sessions, an agent walks the same seven tasks in the browser and records them in `.ai/research/sessions/2026-09-agent.md` with the same template and `Participant: agent`. Those runs check that every task is completable at all; they do not count toward the launch bar.
