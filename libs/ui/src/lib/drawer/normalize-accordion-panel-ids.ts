/** Normalizes PrimeNG accordion `valueChange` payloads to string panel ids. */
export function normalizeAccordionPanelIds(
  value: string | number | string[] | number[] | null | undefined,
): string[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  return [String(value)];
}
