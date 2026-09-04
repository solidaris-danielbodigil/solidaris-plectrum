/**
 * Boxes-and-arrows SVG diagram for Storybook MDX pages (Docs/Token pipeline).
 *
 * This is the one docs figure with no PrimeNG equivalent. Steps, cards and
 * callouts are Angular components on PrimeNG (libs/ui/src/storybook/docs-*)
 * and are embedded through `<Story of={…} />`.
 *
 * Written without JSX — Angular's Storybook webpack runs this file through
 * the app Babel loader, which has no React preset.
 *
 * Styles: libs/styles/src/06-components/_components.docs-figures.scss. Every
 * fill, stroke and radius is a --pds-* token, so the pipeline docs are drawn
 * with the pipeline's own output. The root carries `sb-unstyled` so Storybook's
 * docs typography stays out of the markup.
 */
import { createElement as h, type ReactNode } from 'react';
import type { FigureTone } from '../src/storybook/docs-figures.types';

// ── Diagram ──────────────────────────────────────────────────────────────────

export interface DiagramLane {
  title: string;
  subtitle?: string;
  x: number;
  w: number;
  tone?: FigureTone;
}

export interface DiagramNode {
  id: string;
  title: string;
  /** Extra lines under the title. */
  lines?: readonly string[];
  /** Monospace lines — token names, file names. */
  mono?: boolean;
  x: number;
  y: number;
  w?: number;
  h?: number;
  tone?: FigureTone;
  pill?: boolean;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  /** A human step rather than an automated one. */
  dashed?: boolean;
  /** Sideways shift so two edges between the same nodes do not overlap. */
  offset?: number;
}

export interface DiagramProps {
  /** Read by screen readers; also seeds the arrow-marker id. */
  title: string;
  /** Screen-reader description. Defaults to a sentence per edge. */
  description?: string;
  width: number;
  height: number;
  lanes?: readonly DiagramLane[];
  nodes: readonly DiagramNode[];
  edges?: readonly DiagramEdge[];
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const NODE_W = 200;
const NODE_H = 64;
const BOX_RADIUS = 8;
const LANE_RADIUS = 12;
const TITLE_GAP = 18;
const LINE_GAP = 15;

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function boxOf(node: DiagramNode): Box {
  return { x: node.x, y: node.y, w: node.w ?? NODE_W, h: node.h ?? NODE_H };
}

interface Route {
  d: string;
  /** Point on the middle segment that the label is placed against. */
  label: readonly [number, number];
  /** Horizontal labels sit above the line; vertical labels sit beside it. */
  orientation: 'horizontal' | 'vertical';
}

/** Orthogonal route leaving the side of `a` that faces `b`. */
function route(a: Box, b: Box, offset: number): Route {
  const ax = a.x + a.w / 2;
  const ay = a.y + a.h / 2;
  const bx = b.x + b.w / 2;
  const by = b.y + b.h / 2;
  const dx = bx - ax;
  const dy = by - ay;

  if (Math.abs(dx) >= Math.abs(dy)) {
    const y1 = ay + offset;
    const y2 = by + offset;
    const x1 = dx >= 0 ? a.x + a.w : a.x;
    const x2 = dx >= 0 ? b.x : b.x + b.w;
    const mid = (x1 + x2) / 2;
    const d =
      y1 === y2 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} H${mid} V${y2} H${x2}`;
    return { d, label: [mid, (y1 + y2) / 2], orientation: 'horizontal' };
  }

  const x1 = ax + offset;
  const x2 = bx + offset;
  const y1 = dy >= 0 ? a.y + a.h : a.y;
  const y2 = dy >= 0 ? b.y : b.y + b.h;
  const mid = (y1 + y2) / 2;
  const d =
    x1 === x2 ? `M${x1} ${y1} V${y2}` : `M${x1} ${y1} V${mid} H${x2} V${y2}`;
  return { d, label: [(x1 + x2) / 2, mid], orientation: 'vertical' };
}

const LABEL_LIFT = 7;
const LABEL_INDENT = 8;

function describe(
  nodes: readonly DiagramNode[],
  edges: readonly DiagramEdge[],
): string {
  const titleOf = (id: string): string =>
    nodes.find((node) => node.id === id)?.title ?? id;
  if (edges.length === 0) {
    return `Boxes: ${nodes.map((node) => node.title).join(', ')}.`;
  }
  const flows = edges.map((edge) => {
    const flow = `${titleOf(edge.from)} to ${titleOf(edge.to)}`;
    return edge.label ? `${flow} (${edge.label})` : flow;
  });
  return `Flow: ${flows.join('; ')}.`;
}

/**
 * Presentation-attribute fallbacks. The stylesheet overrides all of them; if it
 * is not applied (stale tab, missing bundle) the figure degrades to an outlined
 * wireframe in the page text colour instead of SVG's default solid-black fill.
 */
const FALLBACK_TEXT = { fill: 'currentColor' } as const;
const FALLBACK_SHAPE = { fill: 'none', stroke: 'currentColor' } as const;

function renderLane(lane: DiagramLane, height: number, index: number): ReactNode {
  const cx = lane.x + lane.w / 2;
  return h(
    'g',
    {
      key: index,
      className: `c-docs-diagram__lane c-docs-diagram__lane--${lane.tone ?? 'neutral'}`,
    },
    h('rect', { x: lane.x, y: 0, width: lane.w, height, rx: LANE_RADIUS, fill: 'none' }),
    h(
      'text',
      { ...FALLBACK_TEXT, x: cx, y: 28, textAnchor: 'middle', className: 'c-docs-diagram__lane-title' },
      lane.title,
    ),
    lane.subtitle
      ? h(
          'text',
          { ...FALLBACK_TEXT, x: cx, y: 46, textAnchor: 'middle', className: 'c-docs-diagram__lane-subtitle' },
          lane.subtitle,
        )
      : null,
  );
}

function renderEdge(
  edge: DiagramEdge,
  index: number,
  boxes: ReadonlyMap<string, Box>,
  marker: string,
): ReactNode {
  const from = boxes.get(edge.from);
  const to = boxes.get(edge.to);
  if (!from || !to) return null;

  const { d, label, orientation } = route(from, to, edge.offset ?? 0);
  const labelProps =
    orientation === 'horizontal'
      ? { x: label[0], y: label[1] - LABEL_LIFT, textAnchor: 'middle' }
      : { x: label[0] + LABEL_INDENT, y: label[1], textAnchor: 'start', dominantBaseline: 'middle' };

  return h(
    'g',
    {
      key: index,
      className: `c-docs-diagram__edge${edge.dashed ? ' c-docs-diagram__edge--dashed' : ''}`,
    },
    h('path', { ...FALLBACK_SHAPE, d, markerEnd: `url(#${marker})` }),
    edge.label
      ? h('text', { ...FALLBACK_TEXT, ...labelProps, className: 'c-docs-diagram__edge-label' }, edge.label)
      : null,
  );
}

function renderNode(node: DiagramNode): ReactNode {
  const box = boxOf(node);
  const lines = node.lines ?? [];
  const block = TITLE_GAP + lines.length * LINE_GAP;
  const titleBaseline = box.y + (box.h - block) / 2 + 13;
  const cx = box.x + box.w / 2;
  const lineClass = `c-docs-diagram__node-line${node.mono ? ' c-docs-diagram__node-line--mono' : ''}`;

  return h(
    'g',
    {
      key: node.id,
      className: `c-docs-diagram__node c-docs-diagram__node--${node.tone ?? 'neutral'}`,
    },
    h('rect', {
      ...FALLBACK_SHAPE,
      x: box.x,
      y: box.y,
      width: box.w,
      height: box.h,
      rx: node.pill ? box.h / 2 : BOX_RADIUS,
    }),
    h(
      'text',
      { ...FALLBACK_TEXT, x: cx, y: titleBaseline, textAnchor: 'middle', className: 'c-docs-diagram__node-title' },
      node.title,
    ),
    lines.map((line, index) =>
      h(
        'text',
        {
          ...FALLBACK_TEXT,
          key: index,
          x: cx,
          y: titleBaseline + TITLE_GAP + index * LINE_GAP,
          textAnchor: 'middle',
          className: lineClass,
        },
        line,
      ),
    ),
  );
}

export function Diagram({
  title,
  description,
  width,
  height,
  lanes = [],
  nodes,
  edges = [],
}: DiagramProps): ReactNode {
  const id = `pds-docs-${slug(title)}`;
  const marker = `${id}-arrow`;
  const boxes = new Map<string, Box>(nodes.map((node) => [node.id, boxOf(node)]));

  return h(
    'figure',
    { className: 'c-docs-diagram sb-unstyled' },
    h(
      'svg',
      {
        className: 'c-docs-diagram__svg',
        viewBox: `0 0 ${width} ${height}`,
        role: 'img',
        'aria-labelledby': `${id}-title ${id}-desc`,
      },
      h('title', { id: `${id}-title` }, title),
      h('desc', { id: `${id}-desc` }, description ?? describe(nodes, edges)),
      h(
        'defs',
        null,
        h(
          'marker',
          {
            id: marker,
            viewBox: '0 0 10 10',
            refX: 9,
            refY: 5,
            markerWidth: 7,
            markerHeight: 7,
            orient: 'auto-start-reverse',
          },
          h('path', { ...FALLBACK_TEXT, d: 'M0 0L10 5L0 10Z', className: 'c-docs-diagram__arrowhead' }),
        ),
      ),
      lanes.map((lane, index) => renderLane(lane, height, index)),
      edges.map((edge, index) => renderEdge(edge, index, boxes, marker)),
      nodes.map(renderNode),
    ),
  );
}
