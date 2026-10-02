// =============================================================================
// libs/ui/src/lib/internal/keyboard-shortcut.ts
// Internal helpers for document-level keyboard shortcuts written as
// "ALT + A" / "CTRL + SHIFT + K". Shared by pds-profile-card and
// pds-profile-header — not part of the public package API (no index.ts).
// =============================================================================

const SHORTCUT_MODIFIER_KEYS = ['ALT', 'CTRL', 'SHIFT', 'META'] as const;

/** True when the event comes from a field where typing must not trigger a shortcut. */
export function isEditableShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;

  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

/** True when `event` matches `shortcut` exactly (every modifier, no extra one). */
export function matchesKeyboardShortcut(
  event: KeyboardEvent,
  shortcut: string,
): boolean {
  const parts = shortcut.split('+').map((part) => part.trim().toUpperCase());

  if (parts.length < 2) {
    return false;
  }

  const key = parts[parts.length - 1];
  const modifiers = parts.slice(0, -1);
  const needsAlt = modifiers.includes('ALT');
  const needsCtrl = modifiers.includes('CTRL');
  const needsShift = modifiers.includes('SHIFT');
  const needsMeta = modifiers.includes('META');

  if (
    event.altKey !== needsAlt ||
    event.ctrlKey !== needsCtrl ||
    event.shiftKey !== needsShift ||
    event.metaKey !== needsMeta
  ) {
    return false;
  }

  if (
    modifiers.some(
      (modifier) =>
        !SHORTCUT_MODIFIER_KEYS.includes(
          modifier as (typeof SHORTCUT_MODIFIER_KEYS)[number],
        ),
    )
  ) {
    return false;
  }

  return event.code === `Key${key}` || event.key.toUpperCase() === key;
}

/** "ALT + A" → "Alt+A" — the aria-keyshortcuts syntax. */
export function toAriaKeyShortcuts(shortcut: string): string {
  return shortcut
    .split('+')
    .map((part) => part.trim())
    .map((part) => {
      const upper = part.toUpperCase();

      if (upper === 'ALT') {
        return 'Alt';
      }

      if (upper === 'CTRL') {
        return 'Control';
      }

      if (upper === 'SHIFT') {
        return 'Shift';
      }

      if (upper === 'META') {
        return 'Meta';
      }

      return part.length === 1 ? part.toUpperCase() : part;
    })
    .join('+');
}
