import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { readCandidateRecords } from './records';
import { generateCandidateListing } from './generate';
import { candidateRecordFromFlags } from './record';

test('external candidate records retain identity, revision and ownership across submission changes', () => {
  const sourceRoot = process.cwd();
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-candidate-records-'));
  const write = (relative: string, value: unknown) => { const target = path.join(root, relative); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`); };
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(sourceRoot, '.ai/contracts/registry.json'), 'utf8'));
    registry.teams.push({ id: 'team', label: 'Team', kind: 'application', reviewer: null });
    registry.applications.push({ id: 'app', team: 'team', label: 'App', repository: 'https://github.com/team/app', kind: 'external' });
    write('.ai/contracts/registry.json', registry);
    write('.ai/contracts/compatibility.json', JSON.parse(fs.readFileSync(path.join(sourceRoot, '.ai/contracts/compatibility.json'), 'utf8')));
    const sha = 'a'.repeat(40);
    const metadata = structuredClone(JSON.parse(fs.readFileSync(path.join(sourceRoot, 'tools/devkit/assets/catalogue.json'), 'utf8')).components[0].metadata);
    metadata.component.id = 'team:card';
    metadata.component.path = 'src/plectrum-candidates/card/card.component.ts';
    metadata.component.scssPath = 'src/styles/plectrum-candidates/_components.card.scss';
    metadata.distribution = { kind: 'local' };
    metadata.governance = { status: 'candidate', owner: 'team', note: 'Approved proposal app-card' };
    const proposal = { schemaVersion: 1, id: 'app-card', componentId: 'team:card', team: 'team', application: 'app', issueUrl: `${registry.repository}/issues/1`, decision: 'approved-candidate', owner: 'team', decidedBy: '@solidaris-danielbodigil', decidedAt: '2026-09-25T00:00:00.000Z', decisionUrl: `${registry.repository}/issues/1#issuecomment-1`, note: 'Approved candidate' };
    write('.ai/candidates/proposals/app-card.json', proposal);
    const submission = { schemaVersion: 1, id: 'app-card', proposalId: 'app-card', operation: 'submit', componentId: 'team:card', team: 'team', application: 'app', origin: { repository: 'https://github.com/team/app', revision: sha, path: 'src/plectrum-candidates/card/card.metadata.json' }, metadata, toolkitVersion: '0.2.0', processVersion: '1.1.0', packages: ['ui', 'plectrum', 'styles'].map((name) => ({ name: `@solidaris/${name}`, version: '1.0.0' })), preview: { url: 'https://github.com/team/app/actions/runs/1', revision: sha }, checks: { url: 'https://github.com/team/app/actions/runs/1', revision: sha }, submittedAt: '2026-09-25T00:00:00.000Z' };
    write('.ai/candidates/submissions/app-card.json', submission);
    assert.equal(readCandidateRecords(root).submissions.size, 1);
    const review = candidateRecordFromFlags(root, 'review', ['--id', 'app-card', '--decision', 'accepted', '--pull-request', `${registry.repository}/pull/1`, '--reviewed-by', '@danielbodi', '--note', 'Source and preview reviewed']) as { sourceRevision: string; reviewedBy: string };
    assert.equal(review.sourceRevision, sha);
    assert.equal(review.reviewedBy, '@danielbodi');
    fs.mkdirSync(path.join(root, 'libs/ui/src/storybook'), { recursive: true });
    generateCandidateListing(root);
    assert.match(fs.readFileSync(path.join(root, 'libs/ui/src/storybook/candidate-data.generated.ts'), 'utf8'), /"reviewState": "submitted"/);
    write('.ai/candidates/submissions/app-card.json', { ...submission, origin: { ...submission.origin, repository: 'https://github.com/other/app' } });
    assert.throws(() => readCandidateRecords(root), /origin does not match/);
    write('.ai/candidates/submissions/app-card.json', { ...submission, operation: 'withdraw', withdrawalReason: 'No longer needed' });
    assert.equal(readCandidateRecords(root).submissions.get('app-card')?.operation, 'withdraw');
    generateCandidateListing(root);
    assert.doesNotMatch(fs.readFileSync(path.join(root, 'libs/ui/src/storybook/candidate-data.generated.ts'), 'utf8'), /app-card/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
