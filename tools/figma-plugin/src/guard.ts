import { MAIN_FILE_KEY } from '../../tokens/figma-values.mjs';

export function refuseWrite(
  fileKey: string | null | undefined,
  editorType = 'figma',
): { blocked: boolean; reason: string | null } {
  if (editorType !== 'figma') {
    return {
      blocked: true,
      reason: 'This plugin only runs in the Figma design editor.',
    };
  }
  if (!fileKey) {
    return {
      blocked: true,
      reason:
        'figma.fileKey is unavailable. Import or publish this plugin privately (enablePrivatePluginApi) and open a Figma branch — never the main UI Kit.',
    };
  }
  if (fileKey === MAIN_FILE_KEY) {
    return {
      blocked: true,
      reason: `Resolved key is the main file (${MAIN_FILE_KEY}). Refusing to write to main. Open the Figma branch proposals/{app}.`,
    };
  }
  return { blocked: false, reason: null };
}
