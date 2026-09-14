import type { PlanResult, PlanRow } from './messages';
import {
  previewValue,
  toFigmaValue,
  valuesMatch,
  type ProposalToken,
} from './values';

export interface ExistingVariable {
  name: string;
  resolvedType: string;
  value?: unknown;
}

export interface ProposalDoc {
  codeOwned?: Record<string, ProposalToken>;
}

export function buildPlan(
  proposal: ProposalDoc,
  selection: string[],
  existing: ExistingVariable[],
): PlanResult {
  const byName = new Map(existing.map((variable) => [variable.name, variable]));
  const names = [...new Set(selection)];
  const create: PlanRow[] = [];
  const update: PlanRow[] = [];
  const unchanged: PlanRow[] = [];
  const skip: PlanRow[] = [];

  for (const name of names) {
    const token = proposal.codeOwned?.[name];
    if (!token) {
      skip.push({ name, action: 'skip', reason: 'not-in-proposal' });
      continue;
    }

    const mapped = toFigmaValue(token);
    if ('skip' in mapped) {
      skip.push({
        name,
        action: 'skip',
        reason: mapped.reason,
        cssVar: token.$extensions?.['com.solidaris.pds']?.cssVar,
        preview: previewValue(token),
      });
      continue;
    }

    const found = byName.get(name);
    const row: PlanRow = {
      name,
      action: 'create',
      resolvedType: mapped.resolvedType,
      value: mapped.value,
      cssVar: token.$extensions?.['com.solidaris.pds']?.cssVar,
      preview: mapped.preview,
    };

    if (!found) {
      create.push({ ...row, action: 'create' });
      continue;
    }

    if (found.resolvedType !== mapped.resolvedType) {
      skip.push({
        name,
        action: 'skip',
        reason: `type-mismatch:${found.resolvedType}→${mapped.resolvedType}`,
        cssVar: row.cssVar,
        preview: row.preview,
      });
      continue;
    }

    if (valuesMatch(mapped.resolvedType, mapped.value, found.value)) {
      unchanged.push({ ...row, action: 'unchanged' });
    } else {
      update.push({ ...row, action: 'update' });
    }
  }

  return { create, update, unchanged, skip };
}
