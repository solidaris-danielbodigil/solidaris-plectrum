import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  contentsUrl,
  DEFAULT_SETTINGS,
  fetchProposal,
  githubHeaders,
  isProposalDoc,
} from './github';
import { maskToken } from './settings';

describe('contentsUrl', () => {
  it('builds the Contents API URL with a ref', () => {
    assert.equal(
      contentsUrl(DEFAULT_SETTINGS),
      'https://api.github.com/repos/solidaris-danielbodigil/solidaris-plectrum/contents/tools/tokens/proposed.dtcg.json?ref=main',
    );
  });
});

describe('githubHeaders', () => {
  it('sends the raw media type and a bearer token', () => {
    const headers = githubHeaders('secret');
    assert.equal(headers.Accept, 'application/vnd.github.raw+json');
    assert.equal(headers.Authorization, 'Bearer secret');
  });
});

describe('fetchProposal', () => {
  it('parses JSON from a successful raw response', async () => {
    const doc = await fetchProposal(DEFAULT_SETTINGS, 'tok', async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => '{"codeOwned":{}}',
    }));
    assert.deepEqual(doc, { codeOwned: {} });
  });

  it('throws a short GitHub error', async () => {
    await assert.rejects(
      () =>
        fetchProposal(DEFAULT_SETTINGS, 'tok', async () => ({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          text: async () => 'missing',
        })),
      /GitHub 404/,
    );
  });
});

describe('isProposalDoc', () => {
  it('requires a codeOwned object', () => {
    assert.equal(isProposalDoc({ codeOwned: {} }), true);
    assert.equal(isProposalDoc({}), false);
  });
});

describe('maskToken', () => {
  it('shows only the last four characters', () => {
    assert.equal(maskToken('github_pat_abcxyz'), '…cxyz');
    assert.equal(maskToken(''), 'not set');
  });
});
