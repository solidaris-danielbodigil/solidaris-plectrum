import type { ApplyLogItem, ApplyResult, PlanResult } from './messages';

export async function applyPlan(
  plan: PlanResult,
  app: string,
): Promise<ApplyResult> {
  const collectionName = `proposals/${app}`;
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection =
    collections.find((item) => item.name === collectionName && !item.remote) ??
    null;

  if (!collection) {
    collection = figma.variables.createVariableCollection(collectionName);
    collection.hiddenFromPublishing = true;
    collection.renameMode(collection.defaultModeId, 'Value');
  }

  const locals = await figma.variables.getLocalVariablesAsync();
  const byName = new Map(
    locals
      .filter((variable) => variable.variableCollectionId === collection.id)
      .map((variable) => [variable.name, variable]),
  );

  const log: ApplyLogItem[] = [];
  const rows = [...plan.create, ...plan.update];

  for (const row of rows) {
    if (!row.resolvedType || row.value == null) {
      log.push({
        name: row.name,
        action: row.action === 'update' ? 'update' : 'create',
        ok: false,
        error: 'Plan row is missing a typed value',
      });
      continue;
    }
    try {
      let variable = byName.get(row.name);
      if (!variable) {
        variable = figma.variables.createVariable(
          row.name,
          collection,
          row.resolvedType,
        );
        byName.set(row.name, variable);
      }
      variable.setValueForMode(collection.defaultModeId, row.value);
      if (row.cssVar) {
        variable.description = `Code-owned token ${row.cssVar}`;
        variable.setVariableCodeSyntax('WEB', `var(${row.cssVar})`);
      }
      variable.scopes = ['ALL_SCOPES'];
      variable.hiddenFromPublishing = true;
      log.push({
        name: row.name,
        action: row.action === 'update' ? 'update' : 'create',
        ok: true,
      });
    } catch (error) {
      log.push({
        name: row.name,
        action: row.action === 'update' ? 'update' : 'create',
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    created: log.filter((item) => item.ok && item.action === 'create').length,
    updated: log.filter((item) => item.ok && item.action === 'update').length,
    failed: log.filter((item) => !item.ok).length,
    log,
  };
}
