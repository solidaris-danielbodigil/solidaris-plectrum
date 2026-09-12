import { applyPlan } from './apply';
import { fetchProposal, isProposalDoc } from './github';
import { refuseWrite } from './guard';
import type { MainToUi, TokenRow, UiToMain } from './messages';
import { buildPlan, type ExistingVariable } from './plan';
import { clearToken, loadSettings, maskToken, saveSettings } from './settings';
import { previewValue, toFigmaValue, type ProposalToken } from './values';

figma.showUI(__html__, { width: 440, height: 640, themeColors: true });

let cachedProposal: { codeOwned: Record<string, ProposalToken> } | null = null;

function post(message: MainToUi): void {
  figma.ui.postMessage(message);
}

function fileGuard(): {
  blocked: boolean;
  reason: string | null;
  fileKey: string | null;
} {
  const fileKey = figma.fileKey ?? null;
  const verdict = refuseWrite(fileKey, figma.editorType);
  return { ...verdict, fileKey };
}

function toRows(proposal: {
  codeOwned: Record<string, ProposalToken>;
}): TokenRow[] {
  return Object.entries(proposal.codeOwned)
    .map(([name, token]) => {
      const mapped = toFigmaValue(token);
      const reason =
        'skip' in mapped
          ? mapped.reason
          : (token.$extensions?.['com.solidaris.pds']?.reason ?? null);
      return {
        name,
        $type: token.$type ?? 'other',
        preview: previewValue(token),
        cssVar: token.$extensions?.['com.solidaris.pds']?.cssVar ?? null,
        source: token.$extensions?.['com.solidaris.pds']?.source ?? null,
        reason,
        writable: !('skip' in mapped),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function existingFor(app: string): Promise<ExistingVariable[]> {
  const collectionName = `proposals/${app}`;
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const collection = collections.find(
    (item) => item.name === collectionName && !item.remote,
  );
  if (!collection) return [];
  const locals = await figma.variables.getLocalVariablesAsync();
  return locals
    .filter((variable) => variable.variableCollectionId === collection.id)
    .map((variable) => ({
      name: variable.name,
      resolvedType: variable.resolvedType,
      value: variable.valuesByMode[collection.defaultModeId],
    }));
}

async function boot(): Promise<void> {
  const guard = fileGuard();
  const { settings, githubToken } = await loadSettings();
  post({
    type: 'boot',
    fileKey: guard.fileKey,
    fileName: figma.root.name,
    blocked: guard.blocked,
    reason: guard.reason,
    settings,
    tokenStatus: maskToken(githubToken),
  });
}

figma.ui.onmessage = async (message: UiToMain) => {
  try {
    if (message.type === 'ready') {
      await boot();
      return;
    }

    if (message.type === 'save-settings') {
      const saved = await saveSettings(message.settings, message.githubToken);
      post({
        type: 'settings-saved',
        settings: saved.settings,
        tokenStatus: maskToken(saved.githubToken),
      });
      return;
    }

    if (message.type === 'clear-token') {
      await clearToken();
      const { settings, githubToken } = await loadSettings();
      post({
        type: 'settings-saved',
        settings,
        tokenStatus: maskToken(githubToken),
      });
      return;
    }

    const guard = fileGuard();
    if (guard.blocked) {
      post({
        type: 'error',
        message: guard.reason ?? 'Writes are blocked on this file.',
      });
      return;
    }

    if (message.type === 'fetch') {
      const { settings, githubToken } = await loadSettings();
      if (!githubToken) {
        post({
          type: 'proposal',
          rows: [],
          error: 'Set a GitHub personal access token first.',
        });
        return;
      }
      const raw = await fetchProposal(settings, githubToken, fetch);
      if (!isProposalDoc(raw)) {
        post({
          type: 'proposal',
          rows: [],
          error: 'The file is not a proposal document (missing codeOwned).',
        });
        return;
      }
      cachedProposal = raw as { codeOwned: Record<string, ProposalToken> };
      post({ type: 'proposal', rows: toRows(cachedProposal) });
      return;
    }

    if (message.type === 'plan' || message.type === 'apply') {
      if (!cachedProposal) {
        post({
          type: 'error',
          message: 'Fetch the proposal from GitHub first.',
        });
        return;
      }
      const app = message.app.trim();
      if (!app) {
        post({
          type: 'error',
          message: 'Choose an application (proposals/{app}).',
        });
        return;
      }
      if (!message.names.length) {
        post({
          type: 'error',
          message: 'Select at least one token. Nothing is selected by default.',
        });
        return;
      }
      const plan = buildPlan(
        cachedProposal,
        message.names,
        await existingFor(app),
      );
      if (message.type === 'plan') {
        post({ type: 'plan', plan });
        return;
      }
      const writable = plan.create.length + plan.update.length;
      if (!writable) {
        post({
          type: 'error',
          message: 'Nothing to write. Plan again after changing the selection.',
        });
        return;
      }
      const result = await applyPlan(plan, app);
      figma.notify(
        `Plectrum tokens: ${result.created} created, ${result.updated} updated${result.failed ? `, ${result.failed} failed` : ''}.`,
      );
      post({ type: 'applied', result });
    }
  } catch (error) {
    post({
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
