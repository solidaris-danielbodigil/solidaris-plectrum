import { Injectable, computed, inject, signal } from '@angular/core';
import {
  DEFAULT_THRESHOLDS,
  localClusters,
  recommend,
  type AgentPoint,
  type ComponentFact,
  type Provenance,
  type Recommendation,
  type SectionId,
  type Severity,
} from '@pds-internal/insights';
import { INSIGHTS_DATA } from './insights.token';

export const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'bi bi-grid-1x2' },
  { id: 'adoption', label: 'Adoption', icon: 'bi bi-diagram-3' },
  { id: 'local', label: 'Local components', icon: 'bi bi-boxes' },
  { id: 'agent', label: 'Agent & MCP', icon: 'bi bi-robot' },
  { id: 'search', label: 'Search quality', icon: 'bi bi-search' },
  { id: 'pipeline', label: 'Pipeline', icon: 'bi bi-signpost-split' },
  { id: 'tokens-releases', label: 'Tokens & releases', icon: 'bi bi-tags' },
  { id: 'recommendations', label: 'Recommendations', icon: 'bi bi-lightbulb' },
];

export const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

export const COMPONENT_STATUSES: ComponentFact['status'][] = ['core', 'app', 'deprecated', 'candidate'];

/** A local component cluster (libs/insights localClusters) plus the table read model. */
export interface ClusterView {
  id: string;
  members: string[];
  teams: string[];
  applications: string[];
  score: number;
  matchedFields: string[];
  coreMatches: { local: string; core: string; score: number }[];
}

/**
 * Read model of the Plectrum metrics pages: the generated facts, the selected
 * provenance (Reported | Demo) and the recommendations computed in the browser.
 */
/** Provided on the lazy design-system route with the insights data (design-system.routes.ts). */
@Injectable()
export class InsightsStore {
  readonly data = inject(INSIGHTS_DATA);
  readonly now = new Date();

  /** Demo while no application has sent a report. */
  readonly hasReported = this.data.usage.reported.applications.some((app) => app.reportedAt !== null);
  readonly source = signal<Provenance>(this.hasReported ? 'reported' : 'demo');

  readonly usage = computed(() => this.data.usage[this.source()]);

  readonly recommendations = computed<Recommendation[]>(() =>
    recommend(this.data, this.source(), this.now),
  );

  readonly componentById = new Map(this.data.repo.components.map((c) => [c.id, c]));

  readonly applications = computed(() => this.usage().applications);

  /** Observation count per `${app}|${componentId}`. */
  readonly observationIndex = computed(() => {
    const index = new Map<string, number>();
    for (const o of this.usage().observations) {
      index.set(`${o.application}|${o.componentId}`, o.count);
    }
    return index;
  });

  /** Applications observed using each component in the selected source. */
  readonly appsByComponent = computed(() => {
    const index = new Map<string, string[]>();
    for (const o of this.usage().observations) {
      if (o.count > 0) {
        index.set(o.componentId, [...(index.get(o.componentId) ?? []), o.application]);
      }
    }
    return index;
  });

  readonly latestAgentByApp = computed(() => {
    const latest = new Map<string, AgentPoint>();
    for (const point of this.usage().agentHistory) {
      const current = latest.get(point.application);
      if (!current || current.observedAt < point.observedAt) {
        latest.set(point.application, point);
      }
    }
    return latest;
  });

  readonly clusters = computed<ClusterView[]>(() => {
    const usage = this.usage();
    return localClusters(usage, DEFAULT_THRESHOLDS.similarityMinScore).map((cluster) => ({
      id: cluster.id,
      members: cluster.members,
      teams: cluster.teams,
      applications: cluster.applications,
      score: Math.max(0, ...cluster.pairs.map((p) => p.score)),
      matchedFields: [...new Set(cluster.pairs.flatMap((p) => p.matchedFields))],
      coreMatches: usage.similarity
        .filter((p) => p.kind === 'local-core' && cluster.members.includes(p.a))
        .map((p) => ({ local: p.a, core: p.b, score: p.score })),
    }));
  });

  setSource(source: Provenance): void {
    this.source.set(source);
  }

  appLabel(id: string): string {
    return this.data.usage.demo.applications.find((a) => a.id === id)?.label
      ?? this.data.usage.reported.applications.find((a) => a.id === id)?.label
      ?? id;
  }

  componentName(id: string): string {
    return this.componentById.get(id)?.name
      ?? this.usage().localComponents.find((l) => l.id === id)?.name
      ?? id;
  }

  recommendationsFor(section: SectionId): Recommendation[] {
    return this.recommendations().filter((r) => r.target.section === section);
  }

  findCluster(id: string): ClusterView | undefined {
    return this.clusters().find((c) => c.id === id);
  }

  githubUrl(path: string): string {
    const repo = this.data.repository.startsWith('http')
      ? this.data.repository
      : `https://github.com/${this.data.repository}`;
    return `${repo.replace(/\/$/, '')}/blob/${this.data.revision}/${path}`;
  }
}
