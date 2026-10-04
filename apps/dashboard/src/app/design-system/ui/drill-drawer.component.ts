import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, type ParamMap } from '@angular/router';
import type { Recommendation } from '@pds-internal/insights';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  capitalize,
  daysBetween,
  drillParams,
  formatAge,
  formatAgo,
  formatDate,
  severityIcon,
  severityTag,
  statusTag,
  type TagSeverity,
} from '../insights.format';
import { InsightsStore, SECTIONS } from '../insights.store';
import { expectedText } from '../sections/search.section';

interface Fact {
  label: string;
  value: string;
  tag?: TagSeverity;
  /** Query params of a drill link on the value. */
  drill?: Record<string, string>;
}

interface DrillTable {
  title: string;
  columns: string[];
  rows: { cells: string[]; drill?: Record<string, string> }[];
}

interface DrillLink {
  label: string;
  url: string;
  icon: string;
}

interface DrillView {
  kicker: string;
  title: string;
  text: string[];
  facts: Fact[];
  tables: DrillTable[];
  links: DrillLink[];
  /** Recommendations about this subject. */
  related: Recommendation[];
  /** Set when the drawer shows one recommendation. */
  rec?: Recommendation;
}

const DRILL_KEYS = ['rec', 'candidate', 'cluster', 'evalCase', 'component', 'app'] as const;

/**
 * Drill-down drawer driven by query params (?component=…, ?app=…, ?candidate=…,
 * ?cluster=…, ?evalCase=…, ?rec=…): detail, evidence and links. Closing clears them.
 */
@Component({
  selector: 'app-drill-drawer',
  standalone: true,
  imports: [RouterLink, ButtonModule, DrawerModule, TableModule, TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-drawer
      [visible]="view() !== null"
      (visibleChange)="$event || close()"
      position="right"
      [modal]="true"
      [blockScroll]="true"
      [closeOnEscape]="true"
      ariaCloseLabel="Close details"
      [style]="{ width: 'min(40rem, 100vw)' }"
    >
      <ng-template #header>
        @if (view(); as v) {
          <div class="o-flex o-flex--y o-layout o-layout--gap-0-5">
            <p class="u-text-label-sm o-layout o-layout--margin-0">{{ v.kicker }}</p>
            <h2 class="u-text-heading-sm o-layout o-layout--margin-0">{{ v.title }}</h2>
          </div>
        }
      </ng-template>

      @if (view(); as v) {
        <div class="o-flex o-flex--y o-layout o-layout--gap-4">
          @if (v.rec; as rec) {
            <div class="o-flex o-flex--wrap o-layout o-layout--gap-1">
              <p-tag [severity]="sevTag(rec)" [icon]="sevIcon(rec)" [value]="capitalize(rec.severity)" />
              <p-tag severity="secondary" [value]="rec.rule" />
              <p-tag [severity]="rec.provenance === 'demo' ? 'contrast' : 'secondary'" [value]="capitalize(rec.provenance)" />
            </div>
          }

          @for (paragraph of v.text; track $index) {
            <p class="u-text-body-md o-layout o-layout--margin-0">{{ paragraph }}</p>
          }

          @if (v.facts.length > 0) {
            <dl class="o-flex o-flex--wrap">
              @for (fact of v.facts; track fact.label) {
                <div class="o-flex o-flex--y o-flex__item o-flex__item--12 o-flex__item--6@sm o-layout o-layout--gap-0-5 o-layout--padding-bottom-3 o-layout--padding-right-2">
                  <dt class="u-text-label-sm">{{ fact.label }}</dt>
                  <dd class="u-text-body-md">
                    @if (fact.drill) {
                      <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="fact.drill">{{ fact.value }}</a>
                    } @else if (fact.tag) {
                      <p-tag [severity]="fact.tag" [value]="fact.value" />
                    } @else {
                      {{ fact.value }}
                    }
                  </dd>
                </div>
              }
            </dl>
          }

          @if (v.rec; as rec) {
            <section class="o-flex o-flex--y o-layout o-layout--gap-2" aria-labelledby="drill-evidence">
              <h3 id="drill-evidence" class="u-text-heading-xs o-layout o-layout--margin-0">Evidence</h3>
              <div class="o-layout o-layout--overflow-x-auto">
                <p-table [value]="rec.evidence" size="small">
                  <ng-template #header>
                    <tr><th scope="col">Fact</th><th scope="col">Value</th><th scope="col">Source</th></tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr><th scope="row">{{ row.label }}</th><td>{{ row.value }}</td><td>{{ row.source }}</td></tr>
                  </ng-template>
                </p-table>
              </div>
              @if (rec.next; as next) {
                <h3 class="u-text-heading-xs o-layout o-layout--margin-0">Next step</h3>
                <p class="u-text-body-md o-layout o-layout--margin-0">{{ next.label }}</p>
                @if (next.command) {
                  <pre class="u-text-body-sm o-layout o-layout--margin-0 o-layout--overflow-x-auto"><code>{{ next.command }}</code></pre>
                }
                @if (next.url) {
                  <a pButton [text]="true" size="small" [href]="next.url" target="_blank" rel="noopener noreferrer">
                    <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                    <span>Open</span>
                  </a>
                }
              }
              <div>
                <a pButton size="small" [outlined]="true" [routerLink]="['/design-system', rec.target.section]" [queryParams]="targetParams(rec)">
                  <i class="bi bi-box-arrow-in-right" aria-hidden="true"></i>
                  <span>Open in {{ sectionLabel(rec) }}</span>
                </a>
              </div>
            </section>
          }

          @for (table of v.tables; track table.title) {
            <section class="o-flex o-flex--y o-layout o-layout--gap-2" [attr.aria-label]="table.title">
              <h3 class="u-text-heading-xs o-layout o-layout--margin-0">{{ table.title }}</h3>
              @if (table.rows.length === 0) {
                <p class="u-text-body-md o-layout o-layout--margin-0">None.</p>
              } @else {
                <div class="o-layout o-layout--overflow-x-auto">
                  <p-table [value]="table.rows" size="small">
                    <ng-template #header>
                      <tr>
                        @for (column of table.columns; track $index) {
                          <th scope="col">{{ column }}</th>
                        }
                      </tr>
                    </ng-template>
                    <ng-template #body let-row>
                      <tr>
                        @for (cell of row.cells; track $index; let first = $first) {
                          <td>
                            @if (first && row.drill) {
                              <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="row.drill">{{ cell }}</a>
                            } @else {
                              {{ cell }}
                            }
                          </td>
                        }
                      </tr>
                    </ng-template>
                  </p-table>
                </div>
              }
            </section>
          }

          @if (v.related.length > 0) {
            <section class="o-flex o-flex--y o-layout o-layout--gap-2" aria-labelledby="drill-related">
              <h3 id="drill-related" class="u-text-heading-xs o-layout o-layout--margin-0">Recommendations ({{ v.related.length }})</h3>
              <ul class="o-flex o-flex--y o-layout o-layout--gap-1">
                @for (rec of v.related; track rec.id) {
                  <li class="o-flex o-flex--wrap o-flex--align-items-center o-layout o-layout--gap-1">
                    <p-tag [severity]="sevTag(rec)" [icon]="sevIcon(rec)" [value]="capitalize(rec.severity)" />
                    <a pButton [text]="true" size="small" [routerLink]="[]" [queryParams]="{ rec: rec.id }">{{ rec.title }}</a>
                  </li>
                }
              </ul>
            </section>
          }

          @if (v.links.length > 0) {
            <section class="o-flex o-flex--y o-layout o-layout--gap-1" aria-labelledby="drill-links">
              <h3 id="drill-links" class="u-text-heading-xs o-layout o-layout--margin-0">Links</h3>
              <ul class="o-flex o-flex--y o-flex--align-items-flex-start o-layout o-layout--gap-0-5">
                @for (link of v.links; track link.url) {
                  <li>
                    <a pButton [text]="true" size="small" [href]="link.url" target="_blank" rel="noopener noreferrer">
                      <i [class]="link.icon" aria-hidden="true"></i>
                      <span>{{ link.label }}</span>
                    </a>
                  </li>
                }
              </ul>
            </section>
          }
        </div>
      }
    </p-drawer>
  `,
})
export class DrillDrawerComponent {
  private readonly store = inject(InsightsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly query = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly capitalize = capitalize;

  readonly view = computed<DrillView | null>(() => this.build(this.query()));

  close(): void {
    const queryParams = Object.fromEntries(DRILL_KEYS.map((key) => [key, null]));
    void this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
  }

  sevTag(rec: Recommendation) {
    return severityTag(rec.severity);
  }

  sevIcon(rec: Recommendation) {
    return severityIcon(rec.severity);
  }

  targetParams(rec: Recommendation) {
    return drillParams(rec.target);
  }

  sectionLabel(rec: Recommendation) {
    return SECTIONS.find((s) => s.id === rec.target.section)?.label ?? rec.target.section;
  }

  private build(q: ParamMap): DrillView | null {
    const rec = q.get('rec');
    if (rec) return this.recView(rec);
    const candidate = q.get('candidate');
    if (candidate) return this.candidateView(candidate);
    const cluster = q.get('cluster');
    if (cluster) return this.clusterView(cluster);
    const evalCase = q.get('evalCase');
    if (evalCase) return this.evalCaseView(evalCase);
    const component = q.get('component');
    if (component) return this.componentView(component, q.get('app'));
    const app = q.get('app');
    if (app) return this.appView(app);
    return null;
  }

  private notFound(kicker: string, id: string): DrillView {
    return {
      kicker,
      title: id,
      text: ['Not found in this data source. Switch the source or regenerate the insights.'],
      facts: [],
      tables: [],
      links: [],
      related: [],
    };
  }

  private recView(id: string): DrillView {
    const rec = this.store.recommendations().find((r) => r.id === id);
    if (!rec) return this.notFound('Recommendation', id);
    return {
      kicker: 'Recommendation',
      title: rec.title,
      text: [rec.why],
      facts: [],
      tables: [],
      links: [],
      related: [],
      rec,
    };
  }

  private related(predicate: (r: Recommendation) => boolean): Recommendation[] {
    return this.store.recommendations().filter(predicate);
  }

  private componentView(id: string, app: string | null): DrillView {
    const store = this.store;
    const usage = store.usage();
    const fact = store.componentById.get(id);
    const local = usage.localComponents.find((l) => l.id === id);
    const related = this.related((r) => r.target.component === id && (!app || !r.target.app || r.target.app === app));

    const similar = usage.similarity
      .filter((p) => p.a === id || p.b === id)
      .map((p) => {
        const other = p.a === id ? p.b : p.a;
        return {
          cells: [store.componentName(other), p.kind, String(p.score), p.matchedFields.join(', ')],
          drill: { component: other },
        };
      });

    if (local) {
      const cluster = store.clusters().find((c) => c.members.includes(id));
      return {
        kicker: `Local component · ${store.appLabel(local.application)}`,
        title: local.name,
        text: [local.description, ...(local.reuseNote ? [local.reuseNote] : [])],
        facts: [
          { label: 'Id', value: local.id },
          { label: 'Team', value: local.team },
          { label: 'Application', value: store.appLabel(local.application), drill: { app: local.application } },
          { label: 'Reuse potential', value: local.reusePotential, tag: local.reusePotential === 'likely' ? 'success' : 'secondary' },
          ...(cluster ? [{ label: 'Cluster', value: cluster.members.map((m) => store.componentName(m)).join(' + '), drill: { cluster: cluster.id } }] : []),
        ],
        tables: [
          { title: 'Use cases', columns: ['Use case'], rows: local.useCases.map((u) => ({ cells: [u] })) },
          { title: 'Similar components', columns: ['Component', 'Kind', 'Score', 'Matched'], rows: similar },
        ],
        links: [],
        related,
      };
    }

    if (!fact) return this.notFound('Component', id);

    const observations = usage.observations
      .filter((o) => o.componentId === id)
      .map((o) => ({ cells: [store.appLabel(o.application), String(o.count), String(o.files)], drill: { app: o.application } }));
    const lookups = [...store.latestAgentByApp().values()]
      .filter((p) => (p.lookups[id] ?? 0) > 0)
      .map((p) => ({ cells: [store.appLabel(p.application), String(p.lookups[id]), String(p.reused[id] ?? 0)], drill: { app: p.application } }));

    const links: DrillLink[] = [];
    if (fact.docsUrl) links.push({ label: 'Storybook docs', url: fact.docsUrl, icon: 'bi bi-book' });
    links.push({ label: 'Contract index on GitHub', url: store.githubUrl('.ai/contracts/index.json'), icon: 'bi bi-github' });
    links.push({ label: 'Toolkit catalogue on GitHub', url: store.githubUrl('tools/devkit/assets/catalogue.json'), icon: 'bi bi-github' });

    return {
      kicker: app ? `Component · in ${store.appLabel(app)}` : 'Component',
      title: fact.name,
      text: [],
      facts: [
        { label: 'Id', value: fact.id },
        { label: 'Status', value: fact.status, tag: statusTag(fact.status) },
        ...(fact.replacementId
          ? [{ label: 'Replacement', value: store.componentName(fact.replacementId), drill: { component: fact.replacementId } }]
          : []),
        { label: 'Owner', value: fact.owner },
        { label: 'Distribution', value: fact.distribution },
        { label: 'Measurable', value: fact.measurable ? 'Yes' : 'No' },
        { label: 'Created', value: formatDate(fact.created) },
        { label: 'Modified', value: formatDate(fact.modified) },
        { label: 'Used by components', value: fact.usedBy.map((u) => store.componentName(u)).join(', ') || 'None' },
        { label: 'Repository scan', value: fact.scanUsedIn.map((a) => store.appLabel(a)).join(', ') || 'Not found' },
      ],
      tables: [
        { title: `Usage (${store.source()})`, columns: ['Application', 'Occurrences', 'Files'], rows: observations },
        { title: 'Agent lookups (latest windows)', columns: ['Application', 'Lookups', 'Reused in commits'], rows: lookups },
        ...(similar.length > 0
          ? [{ title: 'Similar local components', columns: ['Component', 'Kind', 'Score', 'Matched'], rows: similar }]
          : []),
      ],
      links,
      related,
    };
  }

  private appView(id: string): DrillView {
    const store = this.store;
    const app = store.applications().find((a) => a.id === id);
    if (!app) return this.notFound('Application', id);
    const age = daysBetween(app.reportedAt, store.now);
    const agent = store.latestAgentByApp().get(id);
    const usage = store.usage();
    return {
      kicker: `Application · ${capitalize(store.source())}`,
      title: app.label,
      text: [],
      facts: [
        { label: 'Team', value: app.team },
        { label: 'Kind', value: app.kind },
        {
          label: 'Last report',
          value: app.reportedAt ? `${formatDate(app.reportedAt)} (${formatAgo(age)})` : 'Never',
          ...(age !== null && age > usage.staleAfterDays ? { tag: 'warn' as const } : {}),
        },
        { label: 'Reports', value: String(app.reports) },
        { label: 'Runtime package', value: app.packageVersion ? `v${app.packageVersion}` : '—' },
        { label: 'Current runtime', value: `v${store.data.versions.runtime}` },
        ...(agent
          ? [
              { label: 'Agent active days', value: `${agent.activeDays} of ${agent.windowDays}` },
              { label: 'Searches with no match', value: `${agent.emptySearches} of ${agent.tools['search_components'] ?? 0}` },
            ]
          : []),
      ],
      tables: [
        {
          title: 'Components used',
          columns: ['Component', 'Occurrences', 'Files'],
          rows: usage.observations
            .filter((o) => o.application === id)
            .sort((a, b) => b.count - a.count)
            .map((o) => ({ cells: [store.componentName(o.componentId), String(o.count), String(o.files)], drill: { component: o.componentId } })),
        },
        {
          title: 'Local components',
          columns: ['Component', 'Reuse potential'],
          rows: usage.localComponents
            .filter((l) => l.application === id)
            .map((l) => ({ cells: [l.name, l.reusePotential], drill: { component: l.id } })),
        },
      ],
      links: [{ label: 'Adoption reports on GitHub', url: store.githubUrl('.ai/adoption'), icon: 'bi bi-github' }],
      related: this.related((r) => r.target.app === id),
    };
  }

  private candidateView(id: string): DrillView {
    const store = this.store;
    const c = store.data.repo.candidates.find((x) => x.id === id);
    if (!c) return this.notFound('Candidate', id);
    const dates: [string, string | undefined][] = [
      ['Decided', c.decidedAt],
      ['Submitted', c.submittedAt],
      ['Reviewed', c.reviewedAt],
      ['Promoted', c.promotedAt],
      ['Back in Figma', c.figmaReturnedAt],
    ];
    return {
      kicker: 'Candidate',
      title: c.componentId,
      text: [],
      facts: [
        { label: 'Stage', value: c.stage, tag: c.stage === 'withdrawn' ? 'secondary' : 'info' },
        { label: 'Team', value: c.team },
        { label: 'Application', value: store.appLabel(c.application), drill: { app: c.application } },
        { label: 'Review current', value: c.reviewCurrent ? 'Yes' : 'No' },
      ],
      tables: [
        {
          title: 'Steps',
          columns: ['Step', 'Date', 'Age'],
          rows: dates
            .filter((d): d is [string, string] => Boolean(d[1]))
            .map(([label, at]) => ({ cells: [label, formatDate(at), formatAge(daysBetween(at, store.now))] })),
        },
      ],
      links: Object.entries(c.links).map(([label, url]) => ({ label: `${capitalize(label)} record`, url, icon: 'bi bi-github' })),
      related: this.related((r) => r.target.candidate === id),
    };
  }

  private clusterView(id: string): DrillView {
    const store = this.store;
    const cluster = store.findCluster(id);
    if (!cluster) return this.notFound('Cluster', id);
    const locals = new Map(store.usage().localComponents.map((l) => [l.id, l]));
    return {
      kicker: 'Similar local components',
      title: cluster.members.map((m) => store.componentName(m)).join(' + '),
      text: [`${cluster.members.length} local components in ${cluster.teams.length} teams look alike: a candidate to share.`],
      facts: [
        { label: 'Teams', value: cluster.teams.join(', ') },
        { label: 'Best score', value: String(cluster.score) },
        { label: 'Matched fields', value: cluster.matchedFields.join(', ') || '—' },
      ],
      tables: [
        {
          title: 'Members',
          columns: ['Component', 'Team', 'Reuse potential'],
          rows: cluster.members.map((m) => ({
            cells: [store.componentName(m), locals.get(m)?.team ?? '—', locals.get(m)?.reusePotential ?? '—'],
            drill: { component: m },
          })),
        },
        {
          title: 'Near-duplicates in the catalogue',
          columns: ['Core component', 'Similar to', 'Score'],
          rows: cluster.coreMatches.map((m) => ({
            cells: [store.componentName(m.core), store.componentName(m.local), String(m.score)],
            drill: { component: m.core },
          })),
        },
      ],
      links: [],
      related: this.related((r) => r.target.cluster === id || cluster.members.includes(r.target.component ?? '')),
    };
  }

  private evalCaseView(id: string): DrillView {
    const store = this.store;
    const evaluation = store.data.repo.searchEval;
    const c = evaluation.results.find((x) => x.id === id);
    if (!c) return this.notFound('Reference request', id);
    const since = evaluation.knownMisses.find((k) => k.id === id)?.since ?? null;
    const expected = new Set([...c.anyOf, ...c.allOf]);
    return {
      kicker: 'Reference request',
      title: c.query,
      text: [],
      facts: [
        { label: 'Case id', value: c.id },
        { label: 'Result', value: c.pass ? 'Pass' : 'Fail', tag: c.pass ? 'success' : 'danger' },
        { label: 'Expected', value: expectedText(c) },
        ...(c.knownMiss ? [{ label: 'Known miss since', value: since ? `${formatDate(since)} (${formatAge(daysBetween(since, store.now))})` : 'Unknown' }] : []),
        ...(evaluation.regressions.includes(c.id) ? [{ label: 'Regression', value: 'Yes', tag: 'danger' as const }] : []),
      ],
      tables: [
        {
          title: 'Returned by the agent search',
          columns: ['Component', 'Expected'],
          rows: c.results.map((r) => ({ cells: [store.componentName(r), expected.has(r) ? 'Yes' : 'No'], drill: { component: r } })),
        },
        {
          title: 'Expected but missing',
          columns: ['Component'],
          rows: [...expected].filter((e) => !c.results.includes(e)).map((e) => ({ cells: [store.componentName(e)], drill: { component: e } })),
        },
      ],
      links: [
        { label: 'Evaluation results on GitHub', url: store.githubUrl('libs/ui/src/storybook/agent-eval.generated.ts'), icon: 'bi bi-github' },
      ],
      related: this.related((r) => r.target.evalCase === id),
    };
  }
}
