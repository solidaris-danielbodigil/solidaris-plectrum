#!/usr/bin/env node
// A public repository's GITHUB_TOKEN gave the first packages public visibility.
// Require a separate classic PAT before publishing the new personal package names.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const registry = JSON.parse(readFileSync(resolve(root, '.ai/contracts/registry.json'), 'utf8'));
const owner = registry.operations.publicationScope.slice(1);
const token = process.env.PLECTRUM_PACKAGE_PUBLISH_TOKEN;
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REF !== 'refs/heads/main' ||
  process.env.GITHUB_REPOSITORY !== new URL(registry.repository).pathname.slice(1) ||
  owner !== 'solidaris-danielbodigil' || registry.operations.visibility !== 'private' ||
  !token || token === process.env.GITHUB_TOKEN || token !== process.env.NODE_AUTH_TOKEN) {
  throw new Error('Private personal-account publication requires a separate classic package PAT in the protected environment.');
}
const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
const user = await fetch('https://api.github.com/user', { headers });
if (!user.ok) throw new Error(`Package token identity check failed: HTTP ${user.status}.`);
const scopes = (user.headers.get('x-oauth-scopes') ?? '').split(',').map((scope) => scope.trim());
if (!scopes.includes('write:packages') || !scopes.includes('read:packages')) throw new Error('Package token must be a classic PAT with write:packages and read:packages.');
const identity = await user.json();
if (identity.login !== owner) throw new Error(`Package PAT belongs to ${identity.login}, expected ${owner}.`);
const packages = await fetch(`https://api.github.com/users/${owner}/packages?package_type=npm&per_page=1`, { headers });
if (!packages.ok) throw new Error(`Package token cannot read personal package settings: HTTP ${packages.status}.`);
console.log(`Classic package token can inspect ${owner} npm packages; private visibility will be checked after each publish.`);
