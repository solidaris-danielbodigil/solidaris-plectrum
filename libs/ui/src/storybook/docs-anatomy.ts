// =============================================================================
// libs/ui/src/storybook/docs-anatomy.ts
// Resolve metadata.anatomy `part` strings to querySelector candidates so the
// docs figure can hang numbered callouts on a live specimen.
// =============================================================================

/**
 * CSS selectors to try for one anatomy `part` string, in order.
 *
 * `part` is written for humans (BEM class, PrimeNG host, a slash-separated
 * pair). Placeholders (`…`, `{name}`) and prose labels are skipped.
 */
export function anatomyPartSelectors(
  part: string,
  bemBlock = '',
): string[] {
  return part
    .split(/\s*\/\s*/)
    .map((token) => token.trim())
    .filter(Boolean)
    .flatMap((token) => selectorsForToken(token, bemBlock));
}

function selectorsForToken(token: string, bemBlock: string): string[] {
  if (/[…{}]/.test(token) || /\s/.test(token)) {
    return [];
  }

  if (/^[a-z][\w-]*\s*=/.test(token) || /^[a-z][\w-]*="/.test(token)) {
    return [`[${token}]`];
  }

  if (token.startsWith('__') && bemBlock) {
    return [`.${bemBlock}${token}`];
  }

  if (/[.#\[]/.test(token)) {
    return [token];
  }

  if (token.startsWith('p-') || token.startsWith('pds-')) {
    return [token, `.${token}`];
  }

  return [`.${token}`];
}

/** First element inside `root` that matches a candidate selector for `part`. */
export function queryAnatomyPart(
  root: ParentNode,
  part: string,
  bemBlock = '',
): Element | null {
  for (const selector of anatomyPartSelectors(part, bemBlock)) {
    try {
      const match = root.querySelector(selector);
      if (match) {
        return match;
      }
    } catch {
      // Invalid selector — try the next candidate.
    }
  }
  return null;
}

export type AnatomySide = 'left' | 'right' | 'top' | 'bottom';

export interface AnatomyBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AnatomyCallout extends AnatomyBox {
  index: number;
  side: AnatomySide;
  markerX: number;
  markerY: number;
  lineX1: number;
  lineY1: number;
  lineX2: number;
  lineY2: number;
}

export interface AnatomyMetrics {
  markerRadius: number;
  gutter: number;
  clearance: number;
  anchorRadius: number;
}

export function boxContains(
  outer: AnatomyBox,
  inner: AnatomyBox,
  inset = 2,
): boolean {
  return (
    inner.x >= outer.x - inset &&
    inner.y >= outer.y - inset &&
    inner.x + inner.w <= outer.x + outer.w + inset &&
    inner.y + inner.h <= outer.y + outer.h + inset
  );
}

export function leafOrientation(boxes: AnatomyBox[]): 'row' | 'col' | 'mixed' {
  if (boxes.length < 2) {
    return 'mixed';
  }
  const xs = boxes.map((box) => box.x + box.w / 2);
  const ys = boxes.map((box) => box.y + box.h / 2);
  const xSpread = Math.max(...xs) - Math.min(...xs);
  const ySpread = Math.max(...ys) - Math.min(...ys);
  if (xSpread > ySpread * 1.5) {
    return 'row';
  }
  if (ySpread > xSpread * 1.5) {
    return 'col';
  }
  return 'mixed';
}

function union(boxes: AnatomyBox[]): AnatomyBox {
  const x = Math.min(...boxes.map((box) => box.x));
  const y = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.w));
  const bottom = Math.max(...boxes.map((box) => box.y + box.h));
  return { x, y, w: right - x, h: bottom - y };
}

function toward(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  distance: number,
): { x: number; y: number } {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: fromX + (dx / len) * distance,
    y: fromY + (dy / len) * distance,
  };
}

function preferSide(
  box: AnatomyBox,
  wrapping: boolean,
  orientation: 'row' | 'col' | 'mixed',
  bounds: AnatomyBox,
): AnatomySide {
  if (wrapping) {
    return 'left';
  }
  if (orientation === 'row') {
    return 'bottom';
  }
  if (orientation === 'col') {
    return 'right';
  }
  const relX = bounds.w ? (box.x + box.w / 2 - bounds.x) / bounds.w : 0.5;
  const relY = bounds.h ? (box.y + box.h / 2 - bounds.y) / bounds.h : 0.5;
  if (relY < 0.22) {
    return 'top';
  }
  if (relY > 0.78) {
    return 'bottom';
  }
  if (relX < 0.28) {
    return 'left';
  }
  return 'right';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Shared badge rail for one side — leaders then stretch to each part. */
function railPosition(
  side: AnatomySide,
  group: AnatomyBox[],
  stage: { w: number; h: number },
  metrics: AnatomyMetrics,
): number {
  const pad = metrics.markerRadius + 2;
  switch (side) {
    case 'left':
      return clamp(Math.min(...group.map((item) => item.x)) - metrics.gutter, pad, stage.w - pad);
    case 'right':
      return clamp(
        Math.max(...group.map((item) => item.x + item.w)) + metrics.gutter,
        pad,
        stage.w - pad,
      );
    case 'top':
      return clamp(Math.min(...group.map((item) => item.y)) - metrics.gutter, pad, stage.h - pad);
    case 'bottom':
      return clamp(
        Math.max(...group.map((item) => item.y + item.h)) + metrics.gutter,
        pad,
        stage.h - pad,
      );
  }
}

/**
 * Places numbered callouts around measured parts the way Material anatomy
 * figures do: badges share a rail on each side, hairline leaders grow or
 * shrink from that rail to the part edge.
 */
export function placeAnatomyCallouts(
  items: Array<AnatomyBox & { index: number }>,
  stage: { w: number; h: number },
  metrics: AnatomyMetrics,
): AnatomyCallout[] {
  if (!items.length) {
    return [];
  }

  const wrapping = items.map((item) =>
    items.some(
      (other) => other.index !== item.index && boxContains(item, other),
    ),
  );
  const leaves = items.filter((_, index) => !wrapping[index]);
  const orientation = leafOrientation(leaves);
  const bounds = union(items);
  const pad = metrics.markerRadius + 2;

  const placed = items.map((item, index) => {
    const side = preferSide(item, wrapping[index], orientation, bounds);
    const attachX = item.x + item.w / 2;
    const attachY =
      wrapping[index] && side === 'left'
        ? item.y + item.h * 0.25
        : item.y + item.h / 2;
    let anchorX = attachX;
    let anchorY = attachY;
    switch (side) {
      case 'left':
        anchorX = item.x;
        anchorY = attachY;
        break;
      case 'right':
        anchorX = item.x + item.w;
        anchorY = attachY;
        break;
      case 'top':
        anchorX = attachX;
        anchorY = item.y;
        break;
      case 'bottom':
        anchorX = attachX;
        anchorY = item.y + item.h;
        break;
    }
    return {
      ...item,
      side,
      markerX: attachX,
      markerY: attachY,
      anchorX,
      anchorY,
    };
  });

  for (const side of ['left', 'right', 'top', 'bottom'] as const) {
    const group = placed.filter((item) => item.side === side);
    if (!group.length) {
      continue;
    }

    const rail = railPosition(side, group, stage, metrics);
    const along = side === 'left' || side === 'right' ? 'markerY' : 'markerX';
    for (const item of group) {
      if (side === 'left' || side === 'right') {
        item.markerX = rail;
      } else {
        item.markerY = rail;
      }
    }

    group.sort((a, b) => a[along] - b[along]);
    for (let i = 1; i < group.length; i++) {
      const prev = group[i - 1];
      const curr = group[i];
      if (curr[along] - prev[along] < metrics.clearance) {
        curr[along] = prev[along] + metrics.clearance;
      }
    }

    for (const item of group) {
      if (side === 'left' || side === 'right') {
        item.markerY = clamp(item.markerY, pad, stage.h - pad);
        item.anchorY = item.markerY;
      } else {
        item.markerX = clamp(item.markerX, pad, stage.w - pad);
        item.anchorX = item.markerX;
      }
    }
  }

  return placed.map((item) => {
    const start = toward(
      item.markerX,
      item.markerY,
      item.anchorX,
      item.anchorY,
      metrics.markerRadius,
    );
    const end = toward(
      item.anchorX,
      item.anchorY,
      item.markerX,
      item.markerY,
      metrics.anchorRadius,
    );
    return {
      index: item.index,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      side: item.side,
      markerX: item.markerX,
      markerY: item.markerY,
      lineX1: start.x,
      lineY1: start.y,
      lineX2: end.x,
      lineY2: end.y,
    };
  });
}

/** Resolve a custom-property length on `el` to CSS pixels (rule 10). */
export function tokenPx(
  el: Element,
  property: string,
  fallback: number,
): number {
  const value = getComputedStyle(el).getPropertyValue(property).trim();
  if (!value) {
    return fallback;
  }
  const probe = document.createElement('div');
  probe.style.width = value;
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  el.appendChild(probe);
  const px = probe.getBoundingClientRect().width;
  probe.remove();
  return px || fallback;
}
