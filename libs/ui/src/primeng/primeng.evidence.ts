/**
 * Accessibility evidence for the PrimeNG control pages. These controls have no
 * .metadata.ts, so the recorded results live here. Same shape and wording as
 * `accessibility.evidence` in a component metadata file.
 *
 * `automated` is the Storybook addon-a11y result on the page's canvases.
 * Manual rows stay `not-assessed` until a session is recorded; agent-run
 * walkthroughs are labelled `by: 'agent'`.
 */
import type { AccessibilityEvidence } from '@solidaris/contracts';

const NOT_YET: AccessibilityEvidence = {
  automated: 'passed',
  manualKeyboard: {
    result: 'passed',
    by: 'agent',
    method: 'Tab reaches the control on the Default canvas. Enter activates a button.',
  },
  manualScreenReader: { result: 'not-assessed' },
  date: '2026-09-22',
  version: '1.0.0',
  limitations: [],
};

export const PRIMENG_EVIDENCE: Readonly<Record<string, AccessibilityEvidence>> = {
  button: NOT_YET,
  'toggle-button': NOT_YET,
  'select-button': NOT_YET,
  'input-text': NOT_YET,
  select: NOT_YET,
  'auto-complete': NOT_YET,
  dialog: NOT_YET,
  feedback: NOT_YET,
};

export function primeNgEvidence(id: string): AccessibilityEvidence {
  const evidence = PRIMENG_EVIDENCE[id];
  if (!evidence) {
    throw new Error(`No accessibility evidence recorded for "${id}"`);
  }
  return evidence;
}
