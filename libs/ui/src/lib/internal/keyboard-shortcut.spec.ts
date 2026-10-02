import {
  isEditableShortcutTarget,
  matchesKeyboardShortcut,
  toAriaKeyShortcuts,
} from './keyboard-shortcut';

describe('keyboard-shortcut helpers', () => {
  it('matches ALT + A on code or key', () => {
    expect(
      matchesKeyboardShortcut(
        new KeyboardEvent('keydown', { altKey: true, code: 'KeyA', key: 'å' }),
        'ALT + A',
      ),
    ).toBe(true);
    expect(
      matchesKeyboardShortcut(
        new KeyboardEvent('keydown', { altKey: true, key: 'a' }),
        'ALT + A',
      ),
    ).toBe(true);
  });

  it('rejects missing or extra modifiers and single keys', () => {
    expect(
      matchesKeyboardShortcut(new KeyboardEvent('keydown', { code: 'KeyA', key: 'a' }), 'ALT + A'),
    ).toBe(false);
    expect(
      matchesKeyboardShortcut(
        new KeyboardEvent('keydown', { altKey: true, shiftKey: true, code: 'KeyA', key: 'A' }),
        'ALT + A',
      ),
    ).toBe(false);
    expect(
      matchesKeyboardShortcut(new KeyboardEvent('keydown', { key: 'a' }), 'A'),
    ).toBe(false);
    expect(
      matchesKeyboardShortcut(
        new KeyboardEvent('keydown', { altKey: true, code: 'KeyA', key: 'a' }),
        'ALT + HYPER + A',
      ),
    ).toBe(false);
  });

  it('formats aria-keyshortcuts', () => {
    expect(toAriaKeyShortcuts('ALT + A')).toBe('Alt+A');
    expect(toAriaKeyShortcuts('ctrl + shift + k')).toBe('Control+Shift+K');
    expect(toAriaKeyShortcuts('META + Enter')).toBe('Meta+Enter');
  });

  it('treats inputs, textareas, selects and contenteditable as editable', () => {
    expect(isEditableShortcutTarget(document.createElement('input'))).toBe(true);
    expect(isEditableShortcutTarget(document.createElement('textarea'))).toBe(true);
    expect(isEditableShortcutTarget(document.createElement('select'))).toBe(true);
    const editable = document.createElement('div');
    editable.contentEditable = 'true';
    document.body.append(editable);
    expect(isEditableShortcutTarget(editable)).toBe(true);
    editable.remove();
    expect(isEditableShortcutTarget(document.createElement('button'))).toBe(false);
    expect(isEditableShortcutTarget(null)).toBe(false);
  });
});
