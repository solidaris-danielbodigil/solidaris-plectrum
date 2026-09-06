// Shared Storybook play-function helpers. Import from here so interaction
// tests stay consistent across the catalogue (storybook/test = Interactions panel).
export { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { expect, waitFor, within } from 'storybook/test';

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
