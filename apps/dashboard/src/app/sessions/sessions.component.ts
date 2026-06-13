import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  aggregateClicksByTarget,
  buildClickPath,
  buildClicksPerMinute,
  buildEventTimeline,
  computeSessionStats,
  findIdleGaps,
  formatRelativeMs,
  formatTelemetryEvent,
  formatTelemetryTarget,
  formatTimestampCet,
  isGenericTelemetryTarget,
  parseSession,
  SessionParseError,
  type TargetAggregate,
  type TestingTelemetrySession,
} from '@solidaris/ui';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    ChartModule,
    MessageModule,
    SelectModule,
    TableModule,
  ],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss',
})
export class SessionsComponent {
  private static readonly FREQUENCY_CHART_MAX_ITEMS = 20;
  private static readonly FREQUENCY_ROW_HEIGHT_REM = 2.25;
  private static readonly FREQUENCY_CHART_AXIS_PADDING_REM = 2;

  readonly session = signal<TestingTelemetrySession | null>(null);
  readonly parseError = signal<string | null>(null);
  readonly appFilter = signal<'all' | 'ishare' | 'icrm'>('all');

  readonly filteredEvents = computed(() => {
    const current = this.session();
    if (!current) {
      return [];
    }

    const filter = this.appFilter();
    if (filter === 'all' || current.app === filter) {
      return current.events;
    }

    return [];
  });

  readonly stats = computed(() => computeSessionStats(this.filteredEvents()));
  readonly timeline = computed(() => buildEventTimeline(this.filteredEvents()));
  readonly clickPath = computed(() => buildClickPath(this.filteredEvents()));
  readonly clickAggregates = computed(() =>
    aggregateClicksByTarget(this.filteredEvents()).slice(0, 10),
  );
  readonly allClickAggregates = computed(() =>
    aggregateClicksByTarget(this.filteredEvents()),
  );
  readonly frequencyAggregates = computed(() =>
    this.allClickAggregates().slice(0, SessionsComponent.FREQUENCY_CHART_MAX_ITEMS),
  );
  readonly idleGaps = computed(() => findIdleGaps(this.filteredEvents()));

  readonly targetLabels = computed(() => {
    const labels = new Map<string, string>();
    for (const event of this.filteredEvents()) {
      if (event.target && event.label) {
        labels.set(event.target, event.label);
      }
    }
    return labels;
  });

  private readonly chartTheme = computed(() => this.readChartTheme());

  readonly barChartData = computed(() => {
    const aggregates = this.clickAggregates();
    const theme = this.chartTheme();
    return {
      labels: aggregates.map((item) => this.formatAggregateLabel(item)),
      datasets: [
        {
          label: 'Clicks',
          data: aggregates.map((item) => item.count),
          backgroundColor: theme.primaryFill,
          borderColor: theme.primary,
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  });

  readonly frequencyChartData = computed(() => {
    const aggregates = this.frequencyAggregates();
    const theme = this.chartTheme();
    return {
      labels: aggregates.map((item) => this.formatAggregateLabel(item)),
      datasets: [
        {
          label: 'Clicks',
          data: aggregates.map((item) => item.count),
          backgroundColor: theme.primaryFill,
          borderColor: theme.primary,
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 22,
          maxBarThickness: 28,
        },
      ],
    };
  });

  readonly lineChartData = computed(() => {
    const buckets = buildClicksPerMinute(this.filteredEvents());
    const theme = this.chartTheme();
    return {
      labels: buckets.map((item) => item.label),
      datasets: [
        {
          label: 'Clicks / minute',
          data: buckets.map((item) => item.count),
          fill: false,
          borderColor: theme.accent,
          backgroundColor: theme.accentFill,
          pointBackgroundColor: theme.accent,
          pointBorderColor: theme.text,
          tension: 0.2,
        },
      ],
    };
  });

  readonly frequencyChartHeightRem = computed(() => {
    const count = this.frequencyAggregates().length;
    if (count === 0) {
      return 12;
    }

    return (
      count * SessionsComponent.FREQUENCY_ROW_HEIGHT_REM +
      SessionsComponent.FREQUENCY_CHART_AXIS_PADDING_REM
    );
  });

  readonly barChartOptions = computed(() => {
    const theme = this.chartTheme();
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'x' as const,
      plugins: this.buildChartPlugins(theme, false),
      scales: {
        x: {
          ticks: {
            color: theme.muted,
            font: { size: 12 },
            maxRotation: 45,
            minRotation: 0,
            callback: (value: string | number) =>
              this.truncateChartLabel(
                this.barChartData().labels[Number(value)] ?? String(value),
              ),
          },
          grid: { color: theme.grid, drawBorder: false },
        },
        y: {
          beginAtZero: true,
          ticks: { color: theme.muted, font: { size: 12 }, precision: 0 },
          grid: { color: theme.grid, drawBorder: false },
        },
      },
    };
  });

  readonly frequencyChartOptions = computed(() => {
    const theme = this.chartTheme();
    const fullLabels = this.frequencyChartData().labels;
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y' as const,
      layout: { padding: { left: 12, right: 16, top: 8, bottom: 8 } },
      plugins: this.buildChartPlugins(theme, true, fullLabels),
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: theme.muted, font: { size: 12 }, precision: 0 },
          grid: { color: theme.grid, drawBorder: false },
        },
        y: {
          ticks: {
            color: theme.text,
            font: { size: 13 },
            autoSkip: false,
            padding: 8,
            crossAlign: 'far' as const,
            callback: (value: string | number) =>
              this.truncateChartLabel(fullLabels[Number(value)] ?? String(value), 48),
          },
          grid: { display: false },
        },
      },
    };
  });

  readonly lineChartOptions = computed(() => {
    const theme = this.chartTheme();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: this.buildChartPlugins(theme, false),
      scales: {
        x: {
          ticks: { color: theme.muted, font: { size: 12 } },
          grid: { color: theme.grid, drawBorder: false },
        },
        y: {
          beginAtZero: true,
          ticks: { color: theme.muted, font: { size: 12 }, precision: 0 },
          grid: { color: theme.grid, drawBorder: false },
        },
      },
    };
  });

  readonly appFilterOptions = [
    { label: 'All apps', value: 'all' as const },
    { label: 'iSHARE', value: 'ishare' as const },
    { label: 'iCRM', value: 'icrm' as const },
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseSession(JSON.parse(reader.result as string));
        this.session.set(parsed);
        this.appFilter.set(parsed.app);
        this.parseError.set(null);
      } catch (error) {
        this.session.set(null);
        this.parseError.set(
          error instanceof SessionParseError
            ? error.message
            : 'Unable to parse session JSON',
        );
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  formatDuration(ms: number): string {
    return formatRelativeMs(ms);
  }

  formatTarget(target: string | null | undefined, label?: string | null): string {
    return formatTelemetryTarget(
      target,
      label ?? (target ? this.targetLabels().get(target) : undefined),
    );
  }

  formatAggregateLabel(aggregate: TargetAggregate): string {
    return formatTelemetryTarget(aggregate.target, aggregate.label);
  }

  formatEvent(event: string): string {
    return formatTelemetryEvent(event);
  }

  formatTimestamp(iso: string | null | undefined): string {
    return formatTimestampCet(iso);
  }

  showTargetSecondary(
    target: string | null | undefined,
    label?: string | null,
  ): boolean {
    if (!target?.trim()) {
      return false;
    }

    if (label?.trim()) {
      return true;
    }

    return isGenericTelemetryTarget(target);
  }

  private readChartTheme(): {
    text: string;
    muted: string;
    primary: string;
    primaryFill: string;
    accent: string;
    accentFill: string;
    grid: string;
    tooltipBg: string;
  } {
    if (typeof document === 'undefined') {
      return {
        text: '#f1f5f9',
        muted: '#94a3b8',
        primary: '#60a5fa',
        primaryFill: 'rgba(96, 165, 250, 0.72)',
        accent: '#34d399',
        accentFill: 'rgba(52, 211, 153, 0.15)',
        grid: 'rgba(148, 163, 184, 0.2)',
        tooltipBg: '#0f172a',
      };
    }

    const root = getComputedStyle(document.documentElement);
    const get = (token: string, fallback: string) =>
      root.getPropertyValue(token).trim() || fallback;
    const primary = get('--p-primary-color', '#60a5fa');

    return {
      text: get('--p-text-color', '#f1f5f9'),
      muted: get('--p-text-muted-color', '#94a3b8'),
      primary,
      primaryFill: this.withAlpha(primary, 0.72),
      accent: get('--p-green-400', '#34d399'),
      accentFill: 'rgba(52, 211, 153, 0.15)',
      grid: get('--p-content-border-color', 'rgba(148, 163, 184, 0.2)'),
      tooltipBg: get('--p-surface-900', '#0f172a'),
    };
  }

  private withAlpha(color: string, alpha: number): string {
    const rgbMatch = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
    }

    const hexMatch = color.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    if (hexMatch) {
      return `rgba(${parseInt(hexMatch[1], 16)}, ${parseInt(hexMatch[2], 16)}, ${parseInt(hexMatch[3], 16)}, ${alpha})`;
    }

    return `rgba(96, 165, 250, ${alpha})`;
  }

  private buildChartPlugins(
    theme: ReturnType<SessionsComponent['readChartTheme']>,
    showFullTooltipTitle: boolean,
    fullLabels?: string[],
  ) {
    return {
      legend: {
        display: false,
      },
      tooltip: {
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        titleColor: theme.text,
        bodyColor: theme.muted,
        backgroundColor: theme.tooltipBg,
        borderColor: theme.grid,
        borderWidth: 1,
        callbacks: showFullTooltipTitle
          ? {
              title: (items: { dataIndex?: number; label?: string }[]) => {
                const index = items[0]?.dataIndex;
                if (fullLabels && index !== undefined) {
                  return fullLabels[index] ?? items[0]?.label ?? '';
                }
                return items[0]?.label ?? '';
              },
              label: (item: { formattedValue?: string }) =>
                `Clicks: ${item.formattedValue ?? ''}`,
            }
          : {
              title: (items: { label?: string }[]) => items[0]?.label ?? '',
            },
      },
    };
  }

  private truncateChartLabel(label: string, maxLength = 28): string {
    if (label.length <= maxLength) {
      return label;
    }
    return `${label.slice(0, maxLength - 1)}…`;
  }
}
