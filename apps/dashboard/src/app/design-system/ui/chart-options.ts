// chart.js builders following the dataviz mark specs: bars ≤ 24px with a 4px
// rounded data end, a 2px surface gap between stacked segments, 2px lines with
// ≥ 8px ringed markers, hairline solid grid, legend only for ≥ 2 series, text in
// text tokens (never the series colour), one tooltip listing every series.
import type { ChartTheme } from '../../shared/chart-theme';

export interface BarSeries {
  label: string;
  data: (number | null)[];
  /** One colour, or one per bar (ordinal ramp across ordered categories). */
  color: string | string[];
}

export interface LineSeries {
  label: string;
  data: (number | null)[];
  color: string;
}

interface AxisOptions {
  horizontal?: boolean;
  stacked?: boolean;
  /** Values are percentages (0–100). */
  percent?: boolean;
  /** Fixed max of the value axis. */
  max?: number;
}

function font(theme: ChartTheme, size = 12) {
  return { family: theme.fontFamily, size };
}

function plugins(theme: ChartTheme, seriesCount: number, percent = false) {
  return {
    legend: {
      display: seriesCount > 1,
      position: 'bottom' as const,
      labels: {
        color: theme.text,
        font: font(theme),
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        padding: 16,
      },
    },
    tooltip: {
      titleFont: font(theme, 13),
      bodyFont: font(theme),
      titleColor: theme.text,
      bodyColor: theme.text,
      backgroundColor: theme.tooltipBg,
      borderColor: theme.grid,
      borderWidth: 1,
      padding: 10,
      usePointStyle: true,
      boxWidth: 8,
      boxHeight: 2,
      callbacks: {
        label: (item: { dataset: { label?: string }; formattedValue: string; raw: unknown }) =>
          item.raw === null
            ? `${item.dataset.label ?? ''}: no data`
            : `${item.formattedValue}${percent ? '%' : ''}  ${item.dataset.label ?? ''}`,
      },
    },
  };
}

function scales(theme: ChartTheme, options: AxisOptions) {
  const valueAxis = {
    beginAtZero: true,
    stacked: options.stacked ?? false,
    max: options.max,
    border: { display: false },
    grid: { color: theme.grid, lineWidth: 1 },
    ticks: {
      color: theme.muted,
      font: font(theme),
      precision: 0,
      callback: (value: string | number) => `${value}${options.percent ? '%' : ''}`,
    },
  };
  const categoryAxis = {
    stacked: options.stacked ?? false,
    border: { color: theme.grid },
    grid: { display: false },
    ticks: { color: theme.text, font: font(theme), autoSkip: false },
  };
  return options.horizontal
    ? { x: valueAxis, y: categoryAxis }
    : { x: categoryAxis, y: valueAxis };
}

export function barChart(
  theme: ChartTheme,
  labels: string[],
  series: BarSeries[],
  options: AxisOptions = {},
) {
  const stacked = options.stacked ?? false;
  return {
    data: {
      labels,
      datasets: series.map((s, index) => ({
        label: s.label,
        data: s.data,
        backgroundColor: s.color,
        hoverBackgroundColor: s.color,
        // Surface-coloured border = the 2px gap between touching segments.
        borderColor: theme.surface,
        borderWidth: stacked ? 1 : 0,
        borderSkipped: false as const,
        // Round only the data end: last stacked segment, or every plain bar.
        borderRadius: !stacked || index === series.length - 1 ? 4 : 0,
        maxBarThickness: 24,
        categoryPercentage: 0.7,
        barPercentage: 0.9,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: options.horizontal ? ('y' as const) : ('x' as const),
      interaction: { mode: 'index' as const, intersect: false, axis: options.horizontal ? ('y' as const) : ('x' as const) },
      plugins: plugins(theme, series.length, options.percent),
      scales: scales(theme, options),
    },
  };
}

export function lineChart(
  theme: ChartTheme,
  labels: string[],
  series: LineSeries[],
  options: AxisOptions = {},
) {
  return {
    data: {
      labels,
      datasets: series.map((s) => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        backgroundColor: s.color,
        borderWidth: 2,
        borderCapStyle: 'round' as const,
        borderJoinStyle: 'round' as const,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 12,
        pointBorderColor: theme.surface,
        pointBorderWidth: 2,
        pointStyle: 'circle' as const,
        tension: 0,
        spanGaps: true,
        fill: false,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index' as const, intersect: false },
      plugins: plugins(theme, series.length, options.percent),
      scales: scales(theme, options),
    },
  };
}

/** Vertical bars plus a constant threshold line (mixed chart, one value axis). */
export function barWithThreshold(
  theme: ChartTheme,
  labels: string[],
  bar: BarSeries,
  threshold: { label: string; value: number; color: string },
  options: AxisOptions = {},
) {
  const chart = barChart(theme, labels, [bar], options);
  return {
    data: {
      labels,
      datasets: [
        ...chart.data.datasets,
        {
          type: 'line' as const,
          label: threshold.label,
          data: labels.map(() => threshold.value),
          borderColor: threshold.color,
          backgroundColor: threshold.color,
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          pointHitRadius: 0,
          fill: false,
        },
      ],
    },
    options: { ...chart.options, plugins: plugins(theme, 2, options.percent) },
  };
}
