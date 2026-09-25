import type { PluginSettings } from './messages';

export const DEFAULT_SETTINGS: PluginSettings = {
  owner: 'solidaris-danielbodigil',
  repo: 'solidaris-plectrum',
  path: 'tools/tokens/proposed.dtcg.json',
  ref: 'main',
};

export function contentsUrl(settings: PluginSettings): string {
  const path = settings.path.replace(/^\/+/, '');
  return `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${path}?ref=${encodeURIComponent(settings.ref)}`;
}

export function githubHeaders(token: string): Record<string, string> {
  return {
    Accept: 'application/vnd.github.raw+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export interface FetchLike {
  (
    url: string,
    init?: { method?: string; headers?: Record<string, string> },
  ): Promise<{
    ok: boolean;
    status: number;
    statusText: string;
    text(): Promise<string>;
  }>;
}

export async function fetchProposal(
  settings: PluginSettings,
  token: string,
  fetchImpl: FetchLike,
): Promise<unknown> {
  const response = await fetchImpl(contentsUrl(settings), {
    method: 'GET',
    headers: githubHeaders(token),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(
      `GitHub ${response.status} ${response.statusText}: ${body.slice(0, 200)}`,
    );
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(
      'GitHub response was not JSON. Check the path and Accept header.',
    );
  }
}

export function isProposalDoc(
  value: unknown,
): value is { codeOwned: Record<string, unknown> } {
  return (
    value != null &&
    typeof value === 'object' &&
    'codeOwned' in value &&
    typeof (value as { codeOwned: unknown }).codeOwned === 'object' &&
    (value as { codeOwned: unknown }).codeOwned != null
  );
}
