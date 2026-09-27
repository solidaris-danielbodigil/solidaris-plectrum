#!/usr/bin/env node
// A manual publication must use the current protected main commit, after CI.
const repository = process.env.GITHUB_REPOSITORY;
const revision = process.env.GITHUB_SHA;
const token = process.env.GITHUB_TOKEN;
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REF !== 'refs/heads/main' || !repository || !revision || !token) {
  throw new Error('Release CI gate requires an authenticated workflow_dispatch on main.');
}
const request = async (path) => {
  const response = await fetch(`https://api.github.com/repos/${repository}/${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
  });
  if (!response.ok) throw new Error(`GitHub CI gate API ${path}: HTTP ${response.status}`);
  return response.json();
};
const main = await request('git/ref/heads/main');
if (main.object.sha !== revision) throw new Error(`Release revision ${revision} is no longer the current main commit ${main.object.sha}.`);
const checks = await request(`commits/${revision}/check-runs?per_page=100`);
const required = ['intake-guard', 'build', 'pack-smoke', 'storybook-tests', 'storybook-packed', 'figma-plugin'];
for (const name of required) {
  const matching = checks.check_runs.filter((check) => check.name === name && check.app?.slug === 'github-actions');
  if (!matching.some((check) => check.conclusion === 'success')) throw new Error(`Required CI check ${name} has not passed on ${revision}.`);
}
console.log(`Current main ${revision} passed all ${required.length} required CI jobs.`);
