export const MAIN_FILE_KEY: string;
export const REM_IN_PX: number;

export interface FigmaRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function cssToFigmaColor(value: string): FigmaRgba | null;
export function colorsEqual(a: FigmaRgba | null, b: FigmaRgba | null, epsilon?: number): boolean;
export function roundPx(n: number): number;
