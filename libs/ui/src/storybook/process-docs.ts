// Storybook renderers for the shared process contract, team registry and package manifests.
// The toolkit renders its help and agent guidance from the same process.json
// (tools/devkit/src/process.mjs); pages never retype a step, command or outcome.
import processContract from '../../../../.ai/contracts/process.json';
import registry from '../../../../.ai/contracts/registry.json';
import toolkitPackage from '../../../../tools/devkit/package.json';
import plectrumPackage from '../../../plectrum/package.json';
import stylesPackage from '../../../styles/package.json';
import uiPackage from '../../package.json';
import type { DocsCard, DocsStep, FigureTone } from './docs-figures.types';

type Step = (typeof processContract.steps)[number];
type Role = Step['owner'];
export type CommandId = keyof typeof processContract.commands;
export type Journey = keyof typeof processContract.journeys;
export type Decision = keyof typeof processContract.proposalOutcomes;

export const PROCESS_VERSION = processContract.version;
export const REGISTRY = registry;

const coreTeam = registry.teams.find((team) => team.kind === 'core');

const ROLE_LABEL: Readonly<Record<string, string>> = {
  team: 'Application team',
  core: `${coreTeam?.label ?? 'Core'} team`,
  designer: 'Designer',
  release: 'Release maintainer',
};

/** Who acts, in reader words. Core takes its label from the registry; roles are validated by processSchema. */
export function roleLabel(role: Role): string {
  return ROLE_LABEL[role] ?? role;
}

const REPOSITORY_LABEL: Record<Step['repository'], string> = {
  consumer: 'application repository',
  plectrum: 'Plectrum repository',
};

function toneOf(step: Pick<Step, 'owner' | 'repository'>): FigureTone {
  if (step.owner === 'designer') return 'design';
  if (step.owner === 'release') return 'neutral';
  return step.repository === 'consumer' ? 'app' : 'system';
}

const stepById = new Map(processContract.steps.map((step) => [step.id, step]));

export function processStep(id: string): Step {
  const step = stepById.get(id);
  if (!step) throw new Error(`Unknown process step: ${id}`);
  return step;
}

export function command(id: CommandId): string {
  return processContract.commands[id].command;
}

export function commandSummary(id: CommandId): string {
  return processContract.commands[id].summary;
}

const title = (id: string) => id.charAt(0).toUpperCase() + id.slice(1).replaceAll('-', ' ');

/** One process step as a figure step: who, where, needs, provides and, unless omitted, its commands. */
export function docsStep(id: string, extra: Pick<DocsStep, 'links'> = {}, withCommands = true): DocsStep {
  const step = processStep(id);
  return {
    title: title(step.id),
    who: `${roleLabel(step.owner)} · ${REPOSITORY_LABEL[step.repository]}`,
    tone: toneOf(step),
    detail: `Needs: ${step.prerequisites.join('; ')}. Provides: ${step.outputs.join('; ')}.`,
    ...(withCommands && step.commands.length ? { commands: step.commands.map((id) => command(id as CommandId)) } : {}),
    ...extra,
  };
}

/** A journey overview. Commands stay with each step's own section unless requested. */
export function journeySteps(
  journey: Journey,
  links: Readonly<Record<string, DocsStep['links']>> = {},
  withCommands = false,
): DocsStep[] {
  return processContract.journeys[journey].map((id) => docsStep(id, { links: links[id] }, withCommands));
}

/** The consumer CI profile in reader words, straight from checkProfiles.consumerCi. */
export function consumerCiRequirements(): string[] {
  const { commands, ...policy } = processContract.checkProfiles.consumerCi;
  return [
    `Runs: ${commands.map((id) => command(id as CommandId)).join(', ')}`,
    ...Object.entries(policy).map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value ? 'required' : 'off'}`),
  ];
}

/** Commands of a Plectrum-checkout check profile (component, release, tokens). */
export function profileCommands(profile: 'component' | 'release' | 'tokens'): string[] {
  return processContract.checkProfiles[profile].map((id) => command(id as CommandId));
}

/** The four proposal decisions of the contract, with who acts next and what they provide. */
export function outcomeCards(): DocsCard[] {
  return (Object.entries(processContract.proposalOutcomes) as [Decision, (typeof processContract.proposalOutcomes)[Decision]][]).map(
    ([decision, outcome]) => {
      const next = outcome.step ? processStep(outcome.step) : null;
      return {
        eyebrow: decision,
        title: next ? `${roleLabel(outcome.next as Role)}: ${title(next.id).toLowerCase()}` : `${roleLabel(outcome.next as Role)}: no candidate`,
        tone: next ? toneOf(next) : 'neutral',
        lead: outcome.effect,
        items: next ? [`Provides: ${next.outputs.join('; ')}.`] : [],
      };
    },
  );
}

/** Routes by repository context: each lists its steps, next actor and handed-over artifact. */
export function routeSteps(routeId: string): DocsStep[] {
  const route = processContract.routes.find((item) => item.id === routeId);
  if (!route) throw new Error(`Unknown process route: ${routeId}`);
  return route.steps.map((id) => docsStep(id));
}

export function routeDecision(routeId: string): string | null {
  return processContract.routes.find((item) => item.id === routeId)?.decision ?? null;
}

/** Registered teams: the only owner values metadata, CLI and candidate records accept. */
export function teamCards(): DocsCard[] {
  return registry.teams.map((team) => {
    const applications = registry.applications.filter((app) => app.team === team.id);
    const reviewers = [team.reviewer, ...(('alternateReviewers' in team ? team.alternateReviewers : undefined) ?? [])].filter(Boolean);
    return {
      eyebrow: team.kind,
      title: team.label,
      tone: team.kind === 'core' ? 'system' : 'app',
      items: [
        `Owner ID: ${team.id}`,
        applications.length
          ? `Applications: ${applications.map((app) => `${app.label} (${app.kind})`).join(', ')}`
          : 'No registered application',
        `Reviewer: ${reviewers.length ? reviewers.join(', ') : 'not configured'}`,
      ],
    };
  });
}

/** Distributed packages, from their manifests. */
export const DISTRIBUTED_PACKAGES = [
  { name: uiPackage.name, version: uiPackage.version, description: uiPackage.description, role: 'runtime' },
  { name: plectrumPackage.name, version: plectrumPackage.version, description: plectrumPackage.description, role: 'runtime' },
  { name: stylesPackage.name, version: stylesPackage.version, description: stylesPackage.description, role: 'runtime' },
  { name: toolkitPackage.name, version: toolkitPackage.version, description: toolkitPackage.description, role: 'toolkit' },
] as const;

export const PACKAGE_NAMES = {
  ui: uiPackage.name,
  plectrum: plectrumPackage.name,
  styles: stylesPackage.name,
  toolkit: toolkitPackage.name,
} as const;

const peers: Record<string, string> = { ...plectrumPackage.peerDependencies, ...uiPackage.peerDependencies };
export const PEER_RANGES: Readonly<Record<string, string>> = peers;

const runtimeNames = DISTRIBUTED_PACKAGES.filter((pkg) => pkg.role === 'runtime').map((pkg) => pkg.name);
const vendorPeers = ['primeng', '@primeuix/themes'];

export const NPMRC = `${registry.operations.publicationScope}:registry=${registry.operations.registry}`;

export const REGISTRY_LOGIN = `npm login --scope=${registry.operations.publicationScope} --auth-type=legacy --registry=${registry.operations.registry}`;

/** Registry install of one exact release; versions come from the manifests of this build. */
export const REGISTRY_INSTALL = [
  `npm install ${[...DISTRIBUTED_PACKAGES.filter((pkg) => pkg.role === 'runtime').map((pkg) => `${pkg.name}@${pkg.version}`), ...vendorPeers.map((name) => `"${name}@${PEER_RANGES[name]}"`)].join(' ')}`,
  `npm install --save-dev ${toolkitPackage.name}@${toolkitPackage.version}`,
].join('\n');

export const RUNTIME_PACKAGE_NAMES = runtimeNames;
