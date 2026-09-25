import fs from 'node:fs';
import path from 'node:path';
import {
  exchangeSchemas,
  registrySchema,
  type Registry,
  type Candidate,
} from '../../.ai/contracts/schema/exchange.schema';
import type { ComponentMetadata } from '../../.ai/contracts/schema/component.metadata';
import processContract from '../../.ai/contracts/process.json';
import { satisfies, validRange } from 'semver';

export function readRegistry(root: string): Registry {
  const registry = registrySchema.parse(
    JSON.parse(
      fs.readFileSync(path.join(root, '.ai/contracts/registry.json'), 'utf8'),
    ),
  );
  for (const values of [registry.teams, registry.applications]) {
    if (new Set(values.map((v) => v.id)).size !== values.length)
      throw new Error('Duplicate registry ID');
  }
  for (const app of registry.applications) {
    if (!registry.teams.some((t) => t.id === app.team))
      throw new Error(`Unknown team ${app.team}`);
    if (app.kind === 'local-demo' && !app.path)
      throw new Error(`Local application ${app.id} needs a path`);
  }
  for (const team of registry.teams) {
    const reviewers = [team.reviewer, ...(team.alternateReviewers ?? [])].filter((value): value is string => !!value);
    if (new Set(reviewers).size !== reviewers.length || reviewers.some((value) => !/^@[A-Za-z0-9-]+$/.test(value))) throw new Error(`Invalid or duplicate reviewer handle for ${team.id}`);
  }
  return registry;
}

export function validateMetadata(
  metadata: ComponentMetadata,
  registry: Registry,
): void {
  const team = registry.teams.find((t) => t.id === metadata.governance.owner);
  if (!team) throw new Error(`Unknown team ${metadata.governance.owner}`);
  const { status, note, replacementId } = metadata.governance;
  const distribution = metadata.distribution;
  if (status !== 'core' && !note)
    throw new Error(
      `${metadata.component.id}: ${status} needs a governance note`,
    );
  if (status === 'core' && team.kind !== 'core')
    throw new Error('Core components need a core owner');
  if (
    status === 'core' &&
    (distribution.kind === 'local' ||
      (distribution.kind === 'angular' && distribution.entryPoint !== '.'))
  )
    throw new Error('Core components must use a core package entry');
  if (status === 'candidate' && distribution.kind !== 'local')
    throw new Error('Candidates must stay local');
  if (
    status === 'app' &&
    distribution.kind !== 'local' &&
    !(
      distribution.kind === 'angular' &&
      distribution.entryPoint === `./patterns/${team.id}`
    )
  )
    throw new Error(
      'App components require a team secondary entry or local distribution',
    );
  if (replacementId === metadata.component.id)
    throw new Error('A component cannot replace itself');
  if (status !== 'deprecated' && replacementId)
    throw new Error('Only deprecated components have a replacement');
  const evidence = metadata.accessibility.evidence;
  for (const manual of [
    evidence?.manualKeyboard,
    evidence?.manualScreenReader,
  ]) {
    if (
      manual &&
      manual.result !== 'not-assessed' &&
      (!manual.by || !manual.method)
    )
      throw new Error('Manual evidence needs an actor and method');
  }
}

export function validateCandidate(candidate: Candidate): void {
  if (candidate.componentId !== candidate.metadata.component.id)
    throw new Error('Candidate component ID differs from metadata');
  if (candidate.team !== candidate.metadata.governance.owner)
    throw new Error('Candidate owner differs from team');
  let state = 'proposed';
  let previousAt = '';
  for (const event of candidate.history) {
    if (event.from !== state || event.at < previousAt)
      throw new Error('Candidate history is not continuous');
    const transition = processContract.transitions.find(
      (t) =>
        t.from === event.from && t.to === event.to && t.role === event.role,
    );
    if (!transition)
      throw new Error(
        `Forbidden transition ${event.from} → ${event.to} by ${event.role}`,
      );
    for (const key of transition.evidence) {
      if (!event.evidence.includes(key) || !candidate.evidence[key])
        throw new Error(`Transition needs evidence: ${key}`);
    }
    state = event.to;
    previousAt = event.at;
  }
  if (candidate.state !== state)
    throw new Error('Candidate state differs from history');
}

/** External records are JSON data only; never import a contributed .ts file. */
export function validateExchange(
  kind: keyof typeof exchangeSchemas,
  data: unknown,
  registry: Registry,
): unknown {
  const result = exchangeSchemas[kind].parse(data);
  if (kind === 'metadata')
    validateMetadata(result as ComponentMetadata, registry);
  if (kind === 'candidate' || kind === 'adoption') {
    const record = result as { team: string; application: string };
    const app = registry.applications.find(
      (app) => app.id === record.application && app.team === record.team,
    );
    if (!app) throw new Error('Unregistered application/team pair');
    const repository =
      kind === 'candidate'
        ? (result as Candidate).origin.repository
        : (result as import('zod').z.infer<typeof exchangeSchemas.adoption>)
            .source.repository;
    if (app.repository !== repository)
      throw new Error(
        'Report repository differs from the registered application',
      );
  }
  if (kind === 'candidate') {
    const candidate = result as Candidate;
    validateMetadata(candidate.metadata, registry);
    validateCandidate(candidate);
  }
  if (kind === 'contracts') {
    const snapshot = result as import('zod').z.infer<
      typeof exchangeSchemas.contracts
    >;
    const ids = new Set<string>();
    for (const entry of snapshot.components) {
      if (ids.has(entry.id) || entry.id !== entry.metadata.component.id)
        throw new Error('Duplicate or mismatched snapshot identity');
      ids.add(entry.id);
      validateMetadata(entry.metadata, registry);
      if (entry.metadata.distribution.kind === 'local')
        throw new Error('Local component in released snapshot');
      if (
        entry.package.version !== snapshot.version ||
        entry.source.revision !== snapshot.revision ||
        entry.source.repository !== snapshot.repository
      )
        throw new Error('Snapshot version/revision/repository mismatch');
    }
  }
  if (kind === 'release') {
    const release = result as import('zod').z.infer<
      typeof exchangeSchemas.release
    >;
    if (
      release.contracts.version !== release.version ||
      release.toolkit.status !== 'verified'
    )
      throw new Error(
        'Release needs matching contracts and verified toolkit compatibility',
      );
    validateExchange('compatibility', release.toolkit, registry);
    if (
      !satisfies(release.version, release.toolkit.dsVersionRange) ||
      !satisfies(
        `${release.contracts.schemaVersion}.0.0`,
        release.toolkit.contractSchemaRange,
      )
    )
      throw new Error('Release is outside toolkit compatibility ranges');
  }
  if (kind === 'compatibility') {
    const compatibility = result as import('zod').z.infer<
      typeof exchangeSchemas.compatibility
    >;
    for (const range of [
      compatibility.dsVersionRange,
      compatibility.contractSchemaRange,
      compatibility.processVersionRange,
    ]) {
      if (!validRange(range))
        throw new Error(`Invalid compatibility range: ${range}`);
    }
  }
  return result;
}

if (require.main === module) {
  try {
    const [kind, file] = process.argv.slice(2);
    if (!Object.hasOwn(exchangeSchemas, kind ?? '') || !file?.endsWith('.json'))
      throw new Error(
        'Usage: contracts:validate <metadata|candidate|adoption|contracts|release|compatibility|registry> <file.json>',
      );
    validateExchange(
      kind as keyof typeof exchangeSchemas,
      JSON.parse(fs.readFileSync(file, 'utf8')),
      readRegistry(process.cwd()),
    );
    console.log(`${kind}: valid`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
