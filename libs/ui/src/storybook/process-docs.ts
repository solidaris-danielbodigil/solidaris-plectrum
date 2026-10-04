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
/** Core dashboard on the same Pages site as Storybook (usage, agent effect, recommendations). */
export const DASHBOARD_URL = new URL('../dashboard/', registry.operations.storybook).href;

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

/**
 * Reader copy for each process step. The contract owns who acts, where and with which
 * commands; these sentences only say it in plain words. process-docs.spec.ts fails when
 * a contract step has no entry here.
 */
export const STEP_COPY: Readonly<Record<string, { title: string; detail: string }>> = {
  install: { title: 'Install the packages', detail: 'Install the Plectrum packages in your application.' },
  initialize: { title: 'Set up the application', detail: 'The plectrum bootstrap script adds the Plectrum configuration, local style layers, Storybook, tests, editor instructions, a pre-commit hook and a CI workflow.' },
  build: { title: 'Build screens', detail: 'Compose screens from themed PrimeNG controls, Core components and --pds-* tokens.' },
  validate: { title: 'Run the checks', detail: 'Check token usage and the Plectrum rules before each merge.' },
  discover: { title: 'Look for an existing solution', detail: 'Ask /plectrum or search themed PrimeNG and Core components. For new UX, talk early to the core team or a designer.' },
  approve: { title: 'Core decides', detail: 'The core team records a decision on the proposal and names the owner.' },
  implement: { title: 'Build the component', detail: 'Create the component in your application, with its story, unit test, metadata and evidence checklist.' },
  submit: { title: 'Submit it to Core', detail: 'When your checks pass and Core has approved the proposal, open the intake pull request.' },
  integrate: { title: 'Core integrates it', detail: 'The core team adds the component to the shared packages.' },
  'design-return': { title: 'Update Figma', detail: 'A designer adds the component to Custom components and publishes the library. New tokens, if any, go back through the token sync.' },
  'design-propose': { title: 'Propose a design', detail: 'A designer opens a proposal from a Custom components frame and names the intended owner.' },
  'design-review': { title: 'Review the design', detail: 'The design team and Core record their decision on the design.' },
  'design-publish': { title: 'Publish the design', detail: 'The designer publishes the approved component in Custom components, using PrimeNG 21 variables.' },
  'export-design': { title: 'Export from Figma', detail: 'A designer pushes the approved tokens from Figma to the staging branch.' },
  'validate-design': { title: 'Review the token sync', detail: 'Core reviews the generated pull request.' },
  release: { title: 'Release', detail: 'A maintainer publishes the packages and their documentation.' },
  adopt: { title: 'Report usage', detail: 'CI tells Core which Plectrum components your application uses, once the team is registered.' },
  upgrade: { title: 'Upgrade', detail: 'Install the new release, refresh the generated files and run the checks.' },
  'change-in-plectrum': { title: 'Implement in Plectrum', detail: 'The core team makes the change in the Plectrum repository, through a reviewed pull request.' },
};

/** One process step as a figure step: who acts, what happens and, unless omitted, its commands. */
export function docsStep(id: string, extra: Pick<DocsStep, 'links'> = {}, withCommands = true): DocsStep {
  const step = processStep(id);
  const copy = STEP_COPY[step.id];
  if (!copy) throw new Error(`No reader copy for process step: ${step.id}`);
  return {
    title: copy.title,
    who: roleLabel(step.owner),
    tone: toneOf(step),
    detail: copy.detail,
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

const CI_POLICY_LABEL: Readonly<Record<string, string>> = {
  strictTokens: 'Fails on an unknown or hardcoded token',
  requireSourceScan: 'Fails when no source or style file is scanned',
  requireInstalledPackages: 'Fails when the Plectrum packages are missing or incompatible',
  requireManagedAdapters: 'Fails when a generated editor or CI file is missing or edited',
  requireCandidateStoriesAndEvidence: 'Fails when a local component lacks its story or completed evidence',
};

/** The consumer CI profile in reader words, straight from checkProfiles.consumerCi. */
export function consumerCiRequirements(): string[] {
  const { commands, ...policy } = processContract.checkProfiles.consumerCi;
  return [
    `Runs ${commands.map((id) => command(id as CommandId)).join(', ')}`,
    ...Object.entries(policy)
      .filter(([, value]) => value)
      .map(([key]) => CI_POLICY_LABEL[key] ?? key.replace(/([A-Z])/g, ' $1').toLowerCase()),
  ];
}

/** Commands of a Plectrum-checkout check profile (component, release, tokens). */
export function profileCommands(profile: 'component' | 'release' | 'tokens'): string[] {
  return processContract.checkProfiles[profile].map((id) => command(id as CommandId));
}

/** Reader copy for each proposal decision; the spec fails when a contract decision has none. */
export const OUTCOME_COPY: Readonly<Record<string, { title: string; lead: string }>> = {
  'approved-candidate': { title: 'Build it, then submit it', lead: 'Your team builds the component and owns it. When it is ready, submit it to Core.' },
  'use-existing': { title: 'Use what exists', lead: 'A PrimeNG control, Core component or token already covers the need.' },
  'app-specific': { title: 'Keep it in your application', lead: 'The need is specific to your application. Build it locally; it will not be shared.' },
};

/** The proposal decisions of the contract, in reader words. */
export function outcomeCards(): DocsCard[] {
  return (Object.entries(processContract.proposalOutcomes) as [Decision, (typeof processContract.proposalOutcomes)[Decision]][]).map(
    ([decision, outcome]) => {
      const copy = OUTCOME_COPY[decision];
      if (!copy) throw new Error(`No reader copy for proposal decision: ${decision}`);
      return {
        eyebrow: decision,
        title: copy.title,
        tone: outcome.step ? toneOf(processStep(outcome.step)) : 'neutral',
        lead: copy.lead,
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
