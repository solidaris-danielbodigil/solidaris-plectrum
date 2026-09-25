import assert from 'node:assert/strict';
import test from 'node:test';
import { GitHubClient } from './github.mjs';

test('candidate PR transport creates a fork, reuses an identical PR, and keeps revisions under one ID', async () => {
  const upstream = 'solidaris-danielbodigil/solidaris-plectrum';
  const fork = 'contributor/solidaris-plectrum';
  const refs = new Set();
  const contents = new Map();
  const pulls = [];
  const calls = [];
  let forked = false;
  const json = (status, data) => ({ status, json: async () => data });
  const fetchMock = async (url, options) => {
    const endpoint = new URL(url).pathname + new URL(url).search;
    const method = options.method;
    calls.push(`${method} ${endpoint}`);
    const body = options.body ? JSON.parse(options.body) : undefined;
    if (endpoint === '/user') return json(200, { login: 'contributor' });
    if (endpoint === `/repos/${fork}` && method === 'GET') return json(forked ? 200 : 404, forked ? { parent: { full_name: upstream } } : { message: 'Not Found' });
    if (endpoint === `/repos/${upstream}/forks` && method === 'POST') { forked = true; return json(202, {}); }
    if (endpoint.startsWith(`/repos/${upstream}/pulls?`) && method === 'GET') {
      const head = new URL(url).searchParams.get('head')?.split(':')[1];
      return json(200, pulls.filter((pull) => pull.head.ref === head));
    }
    if (endpoint === `/repos/${upstream}/git/ref/heads/main`) return json(200, { object: { sha: 'a'.repeat(40) } });
    if (endpoint.startsWith(`/repos/${fork}/git/ref/heads/`)) return json(refs.has(endpoint) ? 200 : 404, {});
    if (endpoint === `/repos/${fork}/git/refs` && method === 'POST') { refs.add(`/repos/${fork}/git/ref/${body.ref.replace(/^refs\//, '')}`); return json(201, {}); }
    if (endpoint.startsWith(`/repos/${fork}/contents/`)) {
      const key = endpoint;
      if (method === 'GET') {
        const value = contents.get(key);
        return value ? json(200, { type: 'file', encoding: 'base64', sha: 'file-sha', content: Buffer.from(value).toString('base64') }) : json(404, { message: 'Not Found' });
      }
      if (method === 'PUT') {
        contents.set(`${endpoint}?ref=${encodeURIComponent(body.branch)}`, Buffer.from(body.content, 'base64').toString('utf8'));
        return json(201, {});
      }
    }
    if (endpoint === `/repos/${upstream}/pulls` && method === 'POST') {
      const pull = { head: { ref: body.head.split(':')[1] }, number: pulls.length + 1, state: 'open', html_url: `https://github.com/${upstream}/pull/${pulls.length + 1}` };
      pulls.push(pull);
      return json(201, pull);
    }
    throw new Error(`Unexpected ${method} ${endpoint}`);
  };
  const client = new GitHubClient('test-token', fetchMock);
  const record = { id: 'app-card', proposalId: 'app-card', operation: 'submit', componentId: 'team:card', origin: { repository: 'https://github.com/team/app', revision: 'a'.repeat(40) }, preview: { url: 'https://example.com/preview' }, checks: { url: 'https://example.com/checks' } };
  const url = `https://github.com/${upstream}`;
  assert.equal(await client.submitPullRequest(url, record), `${url}/pull/1`);
  assert.equal(await client.submitPullRequest(url, record), `${url}/pull/1`);
  assert.equal(pulls.length, 1);
  assert.equal(calls.filter((call) => call.includes('/forks')).length, 1);
  assert.equal(await client.submitPullRequest(url, { ...record, operation: 'revise', origin: { ...record.origin, revision: 'b'.repeat(40) } }), `${url}/pull/2`);
  assert.equal(await client.submitPullRequest(url, { ...record, operation: 'withdraw', withdrawalReason: 'No longer needed' }), `${url}/pull/3`);
  assert.equal(pulls.length, 3);
});
