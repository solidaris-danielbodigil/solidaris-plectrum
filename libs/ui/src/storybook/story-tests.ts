// Shared Storybook play-function helpers. Import from here so interaction
// tests stay consistent across the catalogue (storybook/test = Interactions panel).
// Re-export via a local binding — Vite's storybook/test transform cannot
// rewrite `export { … } from 'storybook/test'` into valid ESM.
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

export { expect, fn, userEvent, waitFor, within };

/** Assert visible text in the story canvas (render / smoke contract). */
export async function assertTextVisible(
  canvasElement: HTMLElement,
  text: string | RegExp,
): Promise<void> {
  const canvas = within(canvasElement);
  await expect(canvas.getByText(text)).toBeVisible();
}

/** Assert a role is present and visible. Overlays (drawer, dialog) search the document. */
export async function assertRoleVisible(
  canvasElement: HTMLElement,
  role: string,
  name?: string | RegExp,
  options?: { inDocument?: boolean },
): Promise<void> {
  const root = options?.inDocument
    ? canvasElement.ownerDocument.body
    : canvasElement;
  const canvas = within(root);
  const match = name
    ? canvas.getByRole(role, { name })
    : canvas.getByRole(role);
  await expect(match).toBeVisible();
}

/** Wait until visible text appears — overlays and animations. */
export async function waitForText(
  canvasElement: HTMLElement,
  text: string | RegExp,
  options?: { inDocument?: boolean },
): Promise<void> {
  const root = options?.inDocument
    ? canvasElement.ownerDocument.body
    : canvasElement;
  const canvas = within(root);
  await waitFor(() => expect(canvas.getByText(text)).toBeVisible());
}

// ── Keyboard contract ──────────────────────────────────────────────────────
// Stories tagged 'keyboard' (a string literal: Storybook indexes tags statically)
// prove the keyboardSupport lines of a component's metadata that Plectrum owns.
// Behaviour PrimeNG already implements (Tree arrows, Accordion headers, Dialog /
// Drawer focus trap) is not re-tested. contracts:check requires one such story
// per interactive component.

/** The element that has focus, inside the story canvas or an overlay mounted on body. */
export function focused(canvasElement: HTMLElement): Element | null {
  return canvasElement.ownerDocument.activeElement;
}

/** Wait until `element` has focus. */
export async function expectFocus(element: Element): Promise<void> {
  await waitFor(() => expect(element).toHaveFocus());
}

/** Start from the document body so the next Tab reaches the first focusable element. */
export function resetFocus(canvasElement: HTMLElement): void {
  (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
}

/**
 * Press Tab `count` times from the current focus and return the accessible
 * label of each element reached, for asserting the tab order.
 */
export async function tabSequence(
  canvasElement: HTMLElement,
  count: number,
  options: { shift?: boolean } = {},
): Promise<string[]> {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    await userEvent.tab({ shift: options.shift });
    names.push(accessibleLabel(focused(canvasElement)));
  }
  return names;
}

/** aria-label, then aria-labelledby text, then visible text — enough to identify a control in a test. */
export function accessibleLabel(element: Element | null): string {
  if (!element) return '';
  const label = element.getAttribute('aria-label');
  if (label) return label.trim();
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map((id) => element.ownerDocument.getElementById(id)?.textContent ?? '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) return text;
  }
  if (element instanceof HTMLInputElement) return element.placeholder || element.name || element.type;
  return (element.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/** Focus `element` with Tab from the body, failing when it is not reachable within `limit` presses. */
export async function tabTo(canvasElement: HTMLElement, element: Element, limit = 30): Promise<void> {
  resetFocus(canvasElement);
  for (let i = 0; i < limit; i++) {
    await userEvent.tab();
    if (focused(canvasElement) === element) return;
  }
  throw new Error(`Not reachable with Tab within ${limit} presses: ${accessibleLabel(element) || element.tagName}`);
}

/** True when Tab never lands on `element` before cycling back past `limit` presses. */
export async function isSkippedByTab(canvasElement: HTMLElement, element: Element, limit = 30): Promise<boolean> {
  resetFocus(canvasElement);
  for (let i = 0; i < limit; i++) {
    await userEvent.tab();
    if (focused(canvasElement) === element) return false;
  }
  return true;
}

/** Replace navigator.clipboard for one play function; returns the recorded writes and a restore callback. */
export function stubClipboard(canvasElement: HTMLElement): { writes: string[]; restore: () => void } {
  const navigator = canvasElement.ownerDocument.defaultView!.navigator;
  const previous = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  const writes: string[] = [];
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: async (text: string) => { writes.push(text); } },
  });
  return {
    writes,
    restore: () => {
      if (previous) Object.defineProperty(navigator, 'clipboard', previous);
      else delete (navigator as unknown as Record<string, unknown>)['clipboard'];
    },
  };
}

/**
 * Press Escape on the focused element. PrimeNG overlays (Drawer, Dialog) read the
 * legacy `which` code, which a real key press sets and user-event does not.
 */
export function pressEscape(canvasElement: HTMLElement): void {
  const target = canvasElement.ownerDocument.activeElement ?? canvasElement.ownerDocument.body;
  const view = canvasElement.ownerDocument.defaultView!;
  for (const type of ['keydown', 'keyup'] as const) {
    const event = new view.KeyboardEvent(type, { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true });
    Object.defineProperty(event, 'keyCode', { get: () => 27 });
    Object.defineProperty(event, 'which', { get: () => 27 });
    target.dispatchEvent(event);
  }
}
