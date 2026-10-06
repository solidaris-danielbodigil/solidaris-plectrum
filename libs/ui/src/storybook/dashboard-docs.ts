// =============================================================================
// libs/ui/src/storybook/dashboard-docs.ts
// Reader guide for the Core dashboard (apps/dashboard, #/design-system).
//
// The dashboard owns the numbers; this module owns what each screen answers
// and what to do with the answer. The two `Record<…>` maps are the gate: a new
// SectionId or RuleId in libs/insights fails the Storybook typecheck until it
// is documented here, so the page cannot fall behind the engine.
//
// Thresholds are read from DEFAULT_THRESHOLDS — never retyped.
// =============================================================================

import {
  DEFAULT_THRESHOLDS as T,
  type RuleId,
  type SectionId,
} from '@pds-internal/insights';
import { DASHBOARD_URL } from './process-docs';

/** Deep link to one dashboard section (hash routing survives the Pages sub-path). */
export function sectionUrl(section: SectionId): string {
  return `${DASHBOARD_URL}#/design-system/${section}`;
}

export interface DashboardSectionDoc {
  /** Tab label in the dashboard. */
  label: string;
  /** The question the section answers. */
  question: string;
  /** What is on the screen. */
  shows: string;
  /** What to do with it. */
  act: string;
}

/** One entry per dashboard tab, in tab order. */
export const DASHBOARD_SECTIONS: Readonly<
  Record<SectionId, DashboardSectionDoc>
> = {
  overview: {
    label: 'Overview',
    question: 'Did anything move since last time?',
    shows:
      'Components by governance status, applications reporting, Core coverage, agent search pass rate, the latest release, recommendation counts by severity and the five highest-ranked items.',
    act: 'Read this first. Each tile and each of the five items links to the section that explains it — follow the link rather than reading every tab.',
  },
  adoption: {
    label: 'Adoption',
    question: 'Who uses which component?',
    shows:
      'An application × component matrix, components used per application, the adoption trend over the scan history, Core components never observed, deprecated components still rendered, and the components the scan cannot measure.',
    act: 'A deprecated component still in use needs a migration issue for the owning team. An unobserved Core component is a documentation problem before it is a retirement decision.',
  },
  local: {
    label: 'Local components',
    question: 'What are teams building on their own?',
    shows:
      'Local component counts per application, cross-team similarity clusters, and every local component the reports declare.',
    act: 'A cluster spanning two teams or more is the input for a Core proposal. Open it with the teams that built it; do not rebuild it centrally from the cluster alone.',
  },
  agent: {
    label: 'Agent & MCP',
    question: 'Does the agent help, and where does it fail?',
    shows:
      'Tool calls over the latest window, the no-match rate, commits helped, the tool mix, and the components agents look up most against whether the application adopted them.',
    act: 'Requests are never recorded, so a high no-match rate is a conversation with the team, not a log to read. Ask what they were looking for, then fix the catalogue or the metadata.',
  },
  search: {
    label: 'Search quality',
    question: 'Does the agent still find the right component?',
    shows:
      'The pass rate on reference requests, regressions against the previous run, known misses, the pass-rate history and the expected-versus-returned case table.',
    act: 'A regression is a release blocker: fix the component metadata or the search ranking, then re-run the evaluation. A known miss that stays open needs either a fix or a recorded reason.',
  },
  pipeline: {
    label: 'Pipeline',
    question: 'What is waiting on Core?',
    shows:
      'The candidate funnel from approved through submitted, reviewed, promoted and returned to Figma, with the team, the stage and the time since the last activity.',
    act: 'Everything on this screen waits on a Core decision or a Core action. Record the missing step with `npm run candidate:record` — the dashboard reads the records, not the issue tracker.',
  },
  'tokens-releases': {
    label: 'Tokens & releases',
    question: 'Are tokens and releases up to date?',
    shows:
      'The token count, the last Figma sync with its checks, pending code-owned token proposals, the release timeline, pending changesets and the catalogue-status history.',
    act: 'A blocked sync stops every design change from reaching the code — fix it before anything else here. Pending changesets with no recent tag mean a release is overdue.',
  },
  recommendations: {
    label: 'Recommendations',
    question: 'What should Core do next?',
    shows:
      'Every recommendation for the selected source, filterable by severity, rule and application. Each card carries its evidence, the next step and a link back to the section it came from.',
    act: 'Work top down; the order is already severity, applications affected and volume. Open the drawer for the evidence before acting — every row names the file it was computed from.',
  },
};

export interface DashboardRuleDoc {
  /** Section the recommendation drills into. */
  section: SectionId;
  /** What the recommendation is telling you. */
  means: string;
  /** The condition that makes it fire, with its threshold. */
  fires: string;
  /** The first move. */
  act: string;
}

const percent = (ratio: number) => `${Math.round(ratio * 100)}%`;

/** One entry per recommendation rule of libs/insights, grouped by section. */
export const DASHBOARD_RULES: Readonly<Record<RuleId, DashboardRuleDoc>> = {
  'deprecated-in-use': {
    section: 'adoption',
    means: 'An application still renders a component Core has deprecated.',
    fires: 'Any observation of a deprecated component.',
    act: 'Open a migration issue with the owning team and name the replacement from the governance note.',
  },
  'retire-deprecated': {
    section: 'adoption',
    means: 'A deprecated component nobody uses any more can be deleted.',
    fires:
      'No usage left, and every external application has sent a fresh report.',
    act: 'Delete the component, its styles and its metadata in one pull request; the changeset documents the removal.',
  },
  'unused-component': {
    section: 'adoption',
    means: 'A Core component no application and no other component uses.',
    fires: `Measurable, older than ${T.unusedMinAgeDays} days, zero usage, and every external application has reported.`,
    act: 'Check that teams know it exists before concluding anything — this is usually a documentation or naming problem.',
  },
  'app-no-plectrum': {
    section: 'adoption',
    means: 'A reporting application contains no Plectrum component at all.',
    fires: 'A report or scan exists and finds zero components.',
    act: 'Offer the team an onboarding session; the packages may be installed without being used.',
  },
  'stale-report': {
    section: 'adoption',
    means: 'The figures shown for an application are out of date.',
    fires: 'The latest report is older than the staleness window of the source.',
    act: 'Ask the team to run the adoption report in CI again.',
  },
  'missing-report': {
    section: 'adoption',
    means: 'Core cannot see how an external application uses Plectrum.',
    fires: 'A registered external application has never sent a report.',
    act: 'Help the team add the adoption report to their pipeline. Until then, Reported coverage is unknown, not zero.',
  },
  'outdated-runtime': {
    section: 'adoption',
    means: 'An application runs an older Plectrum than the current runtime.',
    fires: 'One minor behind (medium) or one major behind (high).',
    act: 'A minor upgrade is non-breaking — propose it. A major needs the migration notes of the release.',
  },
  'promote-local': {
    section: 'local',
    means: 'Several teams built the same thing locally.',
    fires: `Similar local components scoring ${T.similarityMinScore} or more across two teams; high from ${T.promoteHighTeams} teams.`,
    act: 'Start a Core proposal with the teams in the cluster and reuse the strongest implementation as the candidate.',
  },
  'local-duplicates-core': {
    section: 'local',
    means: 'A local component looks like a Core component that already exists.',
    fires: `A local–Core pair scoring ${T.similarityMinScore} or more.`,
    act: 'Ask the team whether the Core component covers their case. If it does not, the gap belongs in the Core component.',
  },
  'catalogue-gap': {
    section: 'agent',
    means: 'Agents keep asking for components the catalogue does not have.',
    fires: `${T.catalogueGapMinEmpty} empty searches or more and a no-match ratio of ${percent(T.catalogueGapRatio)}; high from ${percent(T.catalogueGapHighRatio)}.`,
    act: 'Ask the team what they were looking for. Queries are counts only — the answer is not in the data.',
  },
  'lookup-not-adopted': {
    section: 'agent',
    means: 'An application reads a component repeatedly and never uses it.',
    fires: `${T.lookupNotAdoptedMin} lookups or more with no observation in the same application.`,
    act: 'Ask what stopped them — a missing variant, an API that does not fit, or documentation that does not answer their case.',
  },
  'mcp-tool-unused': {
    section: 'agent',
    means: 'A declared MCP tool nobody calls.',
    fires: `Zero calls while agents made ${T.mcpToolUnusedMinCalls} calls or more.`,
    act: 'Make its purpose clearer in the agent instructions, or drop the tool.',
  },
  'agent-idle': {
    section: 'agent',
    means: 'An application has the agent set up but is not using it.',
    fires: 'No active day in the reported window.',
    act: 'Check the setup with the team before concluding they do not want it.',
  },
  'deprecated-looked-up': {
    section: 'agent',
    means: 'Agents keep reading a deprecated component, so new code is about to depend on it.',
    fires: `${T.deprecatedLookupMin} lookups or more of a deprecated id in the window.`,
    act: 'Tell the team now and point them at the replacement from the governance note.',
  },
  'search-eval-regression': {
    section: 'search',
    means: 'A reference request that used to pass now returns the wrong components.',
    fires: 'Any case that flips from pass to fail.',
    act: 'Release blocker. Fix the component metadata or the search ranking, then re-run the evaluation.',
  },
  'search-eval-drop': {
    section: 'search',
    means: 'Fewer reference requests find the right components than before.',
    fires: 'The pass rate is below the previous recorded run.',
    act: 'Compare the case table with the previous run and fix what changed.',
  },
  'known-miss-open': {
    section: 'search',
    means: 'Agents asking a known request still get the wrong components.',
    fires: `A known miss open for more than ${T.knownMissMaxAgeDays} days.`,
    act: 'Improve the metadata, or record why it stays a miss so it stops being counted as pending work.',
  },
  'review-waiting': {
    section: 'pipeline',
    means: 'A team is blocked waiting for a Core review of its submission.',
    fires: `No current review after ${T.reviewWaitingDays} days; critical after ${T.reviewWaitingCriticalDays}.`,
    act: 'Review the current revision and record the decision with `npm run candidate:record`.',
  },
  'approved-no-submission': {
    section: 'pipeline',
    means: 'An approved candidate never arrived.',
    fires: `Approved more than ${T.approvedNoSubmissionDays} days ago with no submission.`,
    act: 'Ask the team whether it is still coming, or withdraw the approval.',
  },
  'accepted-not-promoted': {
    section: 'pipeline',
    means: 'Core accepted a candidate but has not integrated it.',
    fires: `Accepted more than ${T.acceptedNotPromotedDays} days ago with no promotion.`,
    act: 'Plan the integration pull request and the promotion record.',
  },
  'promoted-no-figma': {
    section: 'pipeline',
    means: 'A promoted component is missing from the Figma library.',
    fires: `Promoted more than ${T.promotedNoFigmaDays} days ago with no Figma return.`,
    act: 'Schedule the attended Figma session; designers cannot use the component until it is there.',
  },
  'token-sync-blocked': {
    section: 'tokens-releases',
    means: 'Figma token changes cannot reach the code.',
    fires: 'The recorded sync has a failing check.',
    act: 'Open the sync run from the card and fix the failing check first — everything downstream is frozen.',
  },
  'token-proposals-pending': {
    section: 'tokens-releases',
    means: 'Tokens exist in code but not in Figma.',
    fires: `Code-owned proposals waiting more than ${T.tokenProposalsPendingDays} days.`,
    act: 'Apply the selected names on a PrimeNG 21 proposal branch and have a designer review them.',
  },
  'release-due': {
    section: 'tokens-releases',
    means: 'Merged work is not in anybody’s hands yet.',
    fires: `Changesets pending more than ${T.releasePendingDays} days, or no tag for ${T.releaseLastTagDays} days while changesets are pending.`,
    act: 'Cut the release; the pending changesets already describe it.',
  },
};
