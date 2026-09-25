import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  readRegistry,
  validateExchange,
  validateCandidate,
  validateMetadata,
} from './validate';
import { inventory } from './inventory';
import { exchangeSchemas } from '../../.ai/contracts/schema/exchange.schema';
import {
  resolveComponentDocsPath,
  docsIdsFromIndex,
} from '../../libs/ui/src/storybook/docs-storybook-index';
import { metadataCatalogue } from '../../libs/ui/src/storybook/catalogue';
import { COMPONENT_SOURCES } from '../../libs/ui/src/storybook/component-metadata';

const root = process.cwd();
const registry = readRegistry(root);
const revision = 'a'.repeat(40);
const reference = { url: 'https://github.com/example/team/pull/1', revision };

test('runtime docs mapping uses complete sources and rejects ambiguous pages', () => {
  const docs = docsIdsFromIndex({ entries: {
    first: { id: 'first--docs', type: 'docs', importPath: './libs/ui/src/lib/shared/first.mdx' },
    second: { id: 'second--docs', type: 'docs', importPath: './libs/ui/src/lib/shared/second.mdx' },
  } });
  assert.equal(docs.get('libs/ui/src/lib/shared/first.mdx'), 'first--docs');
  assert.equal(docs.get('libs/ui/src/lib/shared/second.mdx'), 'second--docs');
  assert.throws(() => docsIdsFromIndex({ entries: {
    first: { id: 'first--docs', type: 'docs', importPath: './same.mdx' },
    duplicate: { id: 'duplicate--docs', type: 'docs', importPath: 'same.mdx' },
  } }), /Ambiguous/);
});

test('a newly registered external team can exchange candidate, release and adoption JSON', async () => {
  const extended = structuredClone(registry);
  extended.teams.push({
    id: 'external-team',
    label: 'External team',
    kind: 'application',
    reviewer: null,
  });
  extended.applications.push({
    id: 'external-app',
    label: 'External app',
    team: 'external-team',
    repository: 'https://github.com/example/team',
    kind: 'external',
  });
  const metadata = structuredClone((await inventory(root))[0].metadata);
  metadata.component.id = 'external-team:panel';
  metadata.governance = {
    status: 'candidate',
    owner: 'external-team',
    note: 'Approved gap awaiting implementation.',
  };
  metadata.distribution = { kind: 'local' };
  const candidate = {
    schemaVersion: 1,
    id: 'proposal-1',
    componentId: metadata.component.id,
    team: 'external-team',
    application: 'external-app',
    state: 'approved',
    origin: {
      repository: 'https://github.com/example/team',
      revision,
      path: 'src/plectrum-candidates/panel',
    },
    metadata,
    evidence: { 'proposal-review': reference },
    history: [
      {
        from: 'proposed',
        to: 'approved',
        actor: 'reviewer',
        role: 'core',
        at: '2026-09-24T12:00:00Z',
        evidence: ['proposal-review'],
      },
    ],
  };
  assert.doesNotThrow(() => validateExchange('candidate', candidate, extended));
  const parsed = exchangeSchemas.candidate.parse(candidate);
  assert.throws(
    () => validateCandidate({ ...parsed, state: 'released' }),
    /history/,
  );
  assert.throws(
    () =>
      validateCandidate({
        ...parsed,
        history: [{ ...parsed.history[0], role: 'team' }],
      }),
    /Forbidden/,
  );
  assert.throws(
    () => validateCandidate({ ...parsed, evidence: {} }),
    /evidence/,
  );
  const adopted = {
    schemaVersion: 1,
    team: 'external-team',
    application: 'external-app',
    source: candidate.origin,
    observedAt: '2026-09-24T12:00:00Z',
    reporterVersion: '0.1.0',
    packages: [{ name: '@solidaris/ui', version: '2.0.0' }],
    observations: [
      {
        componentId: 'plectrum:form-field',
        kind: 'source-reference',
        count: 1,
        files: ['src/app.ts'],
      },
    ],
    limitations: ['Static source scan'],
  };
  assert.doesNotThrow(() => validateExchange('adoption', adopted, extended));
  assert.throws(() =>
    validateExchange('adoption', { ...adopted, schemaVersion: 2 }, extended),
  );
  assert.throws(() =>
    validateExchange('adoption', { ...adopted, team: 'unknown' }, extended),
  );
  const released = structuredClone(
    (await inventory(root)).find(
      (i) => i.metadata.component.id === 'plectrum:form-field',
    )!.metadata,
  );
  const snapshot = {
    schemaVersion: 1,
    version: '2.0.0',
    repository: registry.repository,
    revision,
    documentation: registry.operations.storybook,
    components: [
      {
        id: released.component.id,
        metadata: released,
        source: {
          repository: registry.repository,
          revision,
          path: released.component.path,
        },
        package: {
          name: '@solidaris/ui',
          version: '2.0.0',
          importPath: '@solidaris/ui',
          exportName: 'FormFieldComponent',
        },
        docs: {
          url: `${registry.operations.storybook}?path=/docs/custom-components-form-field--docs`,
          sourcePath: 'libs/ui/src/lib/form-field/form-field.mdx',
        },
      },
    ],
  };
  assert.doesNotThrow(() => validateExchange('contracts', snapshot, extended));
  assert.throws(
    () =>
      validateExchange(
        'contracts',
        {
          ...snapshot,
          components: [...snapshot.components, ...snapshot.components],
        },
        extended,
      ),
    /Duplicate/,
  );
  const compatibility = JSON.parse(
    readFileSync('.ai/contracts/compatibility.json', 'utf8'),
  );
  const release = {
    schemaVersion: 1,
    version: '2.0.0',
    revision,
    publishedAt: '2026-09-24T12:00:00Z',
    registry: registry.operations.registry,
    packages: [
      { name: '@solidaris/ui', version: '2.0.0', integrity: 'sha512-fixture' },
    ],
    contracts: {
      url: 'https://example.com/contracts/2.0.0.json',
      sha256: 'b'.repeat(64),
      schemaVersion: 1,
      version: '2.0.0',
    },
    toolkit: { ...compatibility, status: 'verified' },
    documentation: registry.operations.storybook,
  };
  assert.doesNotThrow(() => validateExchange('release', release, extended));
  assert.throws(
    () =>
      validateExchange(
        'release',
        { ...release, toolkit: { ...compatibility, status: 'planned' } },
        extended,
      ),
    /verified/,
  );
  assert.throws(
    () =>
      validateExchange(
        'release',
        {
          ...release,
          toolkit: { ...release.toolkit, dsVersionRange: '^9.0.0' },
        },
        extended,
      ),
    /ranges/,
  );
  assert.throws(
    () =>
      validateExchange(
        'compatibility',
        { ...compatibility, dsVersionRange: 'not-semver' },
        extended,
      ),
    /Invalid/,
  );
});

test('all governance statuses remain distinct and renaming keeps docs/adoption joined by ID', async () => {
  const original = (await inventory(root)).find(
    (i) => i.metadata.component.id === 'plectrum:drawer',
  )!;
  const docs = new Map([
    [
      COMPONENT_SOURCES[original.metadata.component.id].docs,
      'actual-runtime-docs-id',
    ],
  ]);
  for (const status of ['core', 'candidate', 'app', 'deprecated'] as const) {
    const metadata = {
      ...original.metadata,
      component: { ...original.metadata.component, name: 'RenamedPanel' },
      governance: { ...original.metadata.governance, status },
    };
    const row = metadataCatalogue([metadata], docs, {
      [metadata.component.id]: ['External app'],
    })[0];
    assert.equal(
      row.scope,
      {
        core: 'Core',
        candidate: 'Candidate',
        app: 'App-specific',
        deprecated: 'Deprecated',
      }[status],
    );
    assert.equal(row.path, '/docs/actual-runtime-docs-id');
    assert.deepEqual(row.usedIn, ['External app']);
  }
  assert.equal(
    resolveComponentDocsPath('plectrum:drawer', docs),
    '/docs/actual-runtime-docs-id',
  );
  assert.equal(
    resolveComponentDocsPath('Drawer', docs),
    '/docs/actual-runtime-docs-id',
  );
  assert.equal(resolveComponentDocsPath('plectrum:unknown', docs), null);
  assert.throws(
    () =>
      validateMetadata(
        {
          ...original.metadata,
          governance: {
            status: 'candidate',
            owner: 'ishare',
            note: 'Awaiting review',
          },
        },
        registry,
      ),
    /local/,
  );
});
