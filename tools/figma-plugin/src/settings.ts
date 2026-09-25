import { DEFAULT_SETTINGS } from './github';
import type { PluginSettings } from './messages';

export const STORAGE_KEYS = {
  githubToken: 'githubToken',
  owner: 'owner',
  repo: 'repo',
  path: 'path',
  ref: 'ref',
} as const;

export function maskToken(token: string | undefined | null): string {
  if (!token) return 'not set';
  const trimmed = token.trim();
  if (trimmed.length < 4) return 'set';
  return `…${trimmed.slice(-4)}`;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export async function loadSettings(): Promise<{
  settings: PluginSettings;
  githubToken: string;
}> {
  const [owner, repo, path, ref, githubToken] = await Promise.all([
    figma.clientStorage.getAsync(STORAGE_KEYS.owner),
    figma.clientStorage.getAsync(STORAGE_KEYS.repo),
    figma.clientStorage.getAsync(STORAGE_KEYS.path),
    figma.clientStorage.getAsync(STORAGE_KEYS.ref),
    figma.clientStorage.getAsync(STORAGE_KEYS.githubToken),
  ]);
  return {
    settings: {
      owner: asString(owner, DEFAULT_SETTINGS.owner),
      repo: asString(repo, DEFAULT_SETTINGS.repo),
      path: asString(path, DEFAULT_SETTINGS.path),
      ref: asString(ref, DEFAULT_SETTINGS.ref),
    },
    githubToken: typeof githubToken === 'string' ? githubToken : '',
  };
}

export async function saveSettings(
  settings: PluginSettings,
  githubToken?: string,
): Promise<{ settings: PluginSettings; githubToken: string }> {
  const next: PluginSettings = {
    owner: asString(settings.owner, DEFAULT_SETTINGS.owner),
    repo: asString(settings.repo, DEFAULT_SETTINGS.repo),
    path: asString(settings.path, DEFAULT_SETTINGS.path),
    ref: asString(settings.ref, DEFAULT_SETTINGS.ref),
  };
  await Promise.all([
    figma.clientStorage.setAsync(STORAGE_KEYS.owner, next.owner),
    figma.clientStorage.setAsync(STORAGE_KEYS.repo, next.repo),
    figma.clientStorage.setAsync(STORAGE_KEYS.path, next.path),
    figma.clientStorage.setAsync(STORAGE_KEYS.ref, next.ref),
  ]);
  if (typeof githubToken === 'string') {
    await figma.clientStorage.setAsync(
      STORAGE_KEYS.githubToken,
      githubToken.trim(),
    );
  }
  const stored = await loadSettings();
  return { settings: stored.settings, githubToken: stored.githubToken };
}

export async function clearToken(): Promise<void> {
  await figma.clientStorage.setAsync(STORAGE_KEYS.githubToken, '');
}
