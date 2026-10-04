// Data shapes of the Plectrum Core dashboard. Pure types: no node, devkit or
// Angular imports, so the same module runs in the browser and in node tests.
// Facts come from tools/insights/generate.ts; recommendations are derived in
// recommend.ts.

export type Provenance = 'reported' | 'demo';

export interface PlectrumInsights {
  schemaVersion: 1;
  generatedAt: string;
  revision: string;
  repository: string;
  links: { storybook: string; dashboard: string };
  versions: { runtime: string; toolkit: string };
  historyAvailable: boolean;
  repo: RepositoryFacts;
  usage: Record<Provenance, UsageFacts>;
}

export interface RepositoryFacts {
  components: ComponentFact[];
  scanHistory: { at: string; revision: string; usedIn: Record<string, string[]> }[];
  catalogueHistory: { at: string; revision: string; byStatus: Record<string, number> }[];
  searchEval: {
    toolkitVersion: string;
    total: number;
    passed: number;
    rate: number;
    regressions: string[];
    fixed: string[];
    knownMisses: { id: string; since: string | null }[];
    results: EvalCase[];
    history: { at: string; revision: string; passed: number; total: number; rate: number }[];
  };
  candidates: CandidateFact[];
  tokens: {
    names: number;
    sync: {
      stage: 'merged' | 'blocked' | 'released';
      generatedAt: string;
      runUrl: string | null;
      checks: { id: string; name: string; status: string }[];
    } | null;
    proposals: { count: number; since: string | null };
  };
  releases: {
    tags: { tag: string; runtime: string; toolkit: string; at: string }[];
    pending: { id: string; bumps: { packageName: string; bump: 'major' | 'minor' | 'patch' }[]; since: string }[];
  };
  /** process.json capabilities.plectrumMcp.tools */
  mcpTools: string[];
}

/** One replayed reference request, as scored in agent-eval.generated.ts. */
export interface EvalCase {
  id: string;
  query: string;
  /** At least one of these ids must be returned. */
  anyOf: string[];
  /** All of these ids must be returned. */
  allOf: string[];
  /** The request expects no match. */
  none: boolean;
  results: string[];
  pass: boolean;
  knownMiss: boolean;
}

export interface ComponentFact {
  id: string;
  name: string;
  status: 'core' | 'app' | 'deprecated' | 'candidate';
  owner: string;
  distribution: 'angular' | 'styles' | 'local';
  measurable: boolean;
  replacementId?: string;
  created: string;
  modified: string;
  docsUrl: string | null;
  usedBy: string[];
  /** Application ids where the repository scan found the component. */
  scanUsedIn: string[];
}

export interface LocalComponent {
  id: string;
  name: string;
  description: string;
  useCases: string[];
  reusePotential: 'none' | 'possible' | 'likely' | 'unknown';
  reuseNote?: string;
}

export interface UsageFacts {
  provenance: Provenance;
  note: string;
  /** STALE_AFTER_DAYS from tools/adoption/records.ts */
  staleAfterDays: number;
  applications: {
    id: string;
    label: string;
    team: string;
    kind: 'local-demo' | 'external';
    reportedAt: string | null;
    packageVersion: string | null;
    reports: number;
  }[];
  /** Latest report per application. */
  observations: { application: string; componentId: string; count: number; files: number }[];
  agentHistory: AgentPoint[];
  localComponents: (LocalComponent & { team: string; application: string })[];
  similarity: { a: string; b: string; kind: 'local-local' | 'local-core'; score: number; matchedFields: string[] }[];
}

export interface AgentPoint {
  application: string;
  observedAt: string;
  windowDays: number;
  activeDays: number;
  tools: Record<string, number>;
  commands: Record<string, number>;
  lookups: Record<string, number>;
  emptySearches: number;
  commits: { total: number; reuse: number; scaffold: number; advice: number };
  reused: Record<string, number>;
}

export interface CandidateFact {
  id: string;
  componentId: string;
  team: string;
  application: string;
  stage:
    | 'approved'
    | 'use-existing'
    | 'app-specific'
    | 'submitted'
    | 'accepted'
    | 'kept-local'
    | 'promoted'
    | 'figma-returned'
    | 'withdrawn';
  decidedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  promotedAt?: string;
  figmaReturnedAt?: string;
  reviewCurrent: boolean;
  links: Record<string, string>;
}

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type SectionId =
  | 'overview'
  | 'adoption'
  | 'local'
  | 'agent'
  | 'search'
  | 'pipeline'
  | 'tokens-releases'
  | 'recommendations';

export interface DrillTarget {
  section: SectionId;
  app?: string;
  component?: string;
  candidate?: string;
  cluster?: string;
  evalCase?: string;
}

export type RuleId =
  | 'deprecated-in-use'
  | 'retire-deprecated'
  | 'deprecated-looked-up'
  | 'promote-local'
  | 'local-duplicates-core'
  | 'catalogue-gap'
  | 'search-eval-regression'
  | 'search-eval-drop'
  | 'known-miss-open'
  | 'stale-report'
  | 'missing-report'
  | 'app-no-plectrum'
  | 'unused-component'
  | 'lookup-not-adopted'
  | 'outdated-runtime'
  | 'mcp-tool-unused'
  | 'agent-idle'
  | 'review-waiting'
  | 'approved-no-submission'
  | 'accepted-not-promoted'
  | 'promoted-no-figma'
  | 'token-sync-blocked'
  | 'token-proposals-pending'
  | 'release-due';

export interface Recommendation {
  /** `${rule}:${subject}`, stable across runs. */
  id: string;
  rule: RuleId;
  severity: Severity;
  score: number;
  title: string;
  why: string;
  evidence: { label: string; value: string | number; source: string }[];
  target: DrillTarget;
  next?: { label: string; command?: string; url?: string };
  provenance: Provenance | 'repository';
}

/** Rule thresholds. Ages are in days, ratios in 0–1. staleAfterDays comes from UsageFacts. */
export interface Thresholds {
  /** promote-local, local-duplicates-core: minimum similarity score of a pair. */
  similarityMinScore: number;
  /** promote-local: a cluster spanning this many teams is high severity. */
  promoteHighTeams: number;
  /** deprecated-looked-up: minimum lookups of a deprecated id in the window. */
  deprecatedLookupMin: number;
  /** catalogue-gap: minimum empty searches in the window. */
  catalogueGapMinEmpty: number;
  /** catalogue-gap: empty / search_components ratio that fires the rule (medium). */
  catalogueGapRatio: number;
  /** catalogue-gap: ratio from which the rule is high. */
  catalogueGapHighRatio: number;
  /** known-miss-open: age of a known miss before it is flagged. */
  knownMissMaxAgeDays: number;
  /** unused-component: minimum component age before it can be flagged unused. */
  unusedMinAgeDays: number;
  /** lookup-not-adopted: minimum lookups in an application without an observation. */
  lookupNotAdoptedMin: number;
  /** mcp-tool-unused: minimum total tool calls across latest windows. */
  mcpToolUnusedMinCalls: number;
  /** review-waiting: submission age without a current review (high). */
  reviewWaitingDays: number;
  /** review-waiting: submission age from which the rule is critical. */
  reviewWaitingCriticalDays: number;
  /** approved-no-submission: approval age without a submission. */
  approvedNoSubmissionDays: number;
  /** accepted-not-promoted: acceptance age without a promotion. */
  acceptedNotPromotedDays: number;
  /** promoted-no-figma: promotion age without a Figma return. */
  promotedNoFigmaDays: number;
  /** token-proposals-pending: age of the oldest code-owned proposal. */
  tokenProposalsPendingDays: number;
  /** release-due: age of the oldest pending changeset (low). */
  releasePendingDays: number;
  /** release-due: age of the last tag while changesets are pending (medium). */
  releaseLastTagDays: number;
}
