// Git history readers of the Core dashboard generator. Every reader is tolerant:
// old file shapes are mapped or skipped, and a checkout without usable history
// (no git, shallow clone) yields empty arrays instead of failing the build.
import { execFileSync } from 'node:child_process';

export interface Commit {
  sha: string;
  /** Commit time as an ISO string in UTC. */
  at: string;
}

function git(root: string, args: string[]): string | null {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return null;
  }
}

const iso = (value: string) => new Date(value).toISOString();
export const shortSha = (sha: string) => sha.slice(0, 7);

/** HEAD sha and commit time; the generated module is a pure function of this checkout. */
export function head(root: string): Commit {
  const line = git(root, ['log', '-1', '--format=%H%x09%cI'])?.trim();
  if (!line) throw new Error('A committed git HEAD is required to generate the dashboard data.');
  const [sha, at] = line.split('\t');
  return { sha, at: iso(at) };
}

/** True when the full commit history is present (not a shallow clone). */
export function historyAvailable(root: string): boolean {
  const shallow = git(root, ['rev-parse', '--is-shallow-repository'])?.trim();
  return shallow === 'false';
}

/** Commits that touched `file`, oldest first (by commit time, then sha). */
export function fileCommits(root: string, file: string): Commit[] {
  const output = git(root, ['log', '--format=%H%x09%cI', '--', file]);
  if (!output) return [];
  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, at] = line.split('\t');
      return { sha, at: iso(at) };
    })
    .sort((a, b) => a.at.localeCompare(b.at) || a.sha.localeCompare(b.sha));
}

/** Content of `file` at `sha`, or null when the file did not exist there. */
export function showFile(root: string, sha: string, file: string): string | null {
  return git(root, ['show', `${sha}:${file}`]);
}

/** Commit time of the first commit that added `file`; null when untracked or history is missing. */
export function firstAddedAt(root: string, file: string): string | null {
  const output = git(root, ['log', '--diff-filter=A', '--format=%cI', '--', file]);
  const dates = (output ?? '').split('\n').filter(Boolean).map(iso).sort();
  return dates[0] ?? null;
}

/** Tags matching `pattern` with the commit time of the tagged commit, oldest first. */
export function tags(root: string, pattern: string): { tag: string; at: string }[] {
  const output = git(root, ['for-each-ref', '--format=%(refname:short)%09%(*committerdate:iso-strict)%09%(committerdate:iso-strict)', `refs/tags/${pattern}`]);
  if (!output) return [];
  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [tag, annotated, direct] = line.split('\t');
      return { tag, at: iso(annotated || direct) };
    })
    .sort((a, b) => a.at.localeCompare(b.at) || a.tag.localeCompare(b.tag));
}

/**
 * One point per commit of `file`, read by `parse` (null skips an unreadable or
 * old shape). Consecutive points with the same value collapse to the first one;
 * the latest point is always kept so a chart ends at the last change.
 */
export function history<T>(root: string, file: string, parse: (text: string) => T | null): { at: string; revision: string; value: T }[] {
  const points: { at: string; revision: string; value: T }[] = [];
  const commits = fileCommits(root, file);
  commits.forEach((commit, index) => {
    const text = showFile(root, commit.sha, file);
    if (text === null) return;
    let value: T | null = null;
    try {
      value = parse(text);
    } catch {
      value = null;
    }
    if (value === null) return;
    const previous = points.at(-1);
    const same = previous && JSON.stringify(previous.value) === JSON.stringify(value);
    if (same && index < commits.length - 1) return;
    points.push({ at: commit.at, revision: shortSha(commit.sha), value });
  });
  return points;
}
