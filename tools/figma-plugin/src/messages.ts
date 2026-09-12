export type ProposalType =
  | 'color'
  | 'dimension'
  | 'number'
  | 'fontWeight'
  | 'fontFamily'
  | 'other';

export interface PluginSettings {
  owner: string;
  repo: string;
  path: string;
  ref: string;
}

export interface TokenRow {
  name: string;
  $type: ProposalType | string;
  preview: string;
  cssVar: string | null;
  source: string | null;
  reason: string | null;
  writable: boolean;
}

export interface PlanRow {
  name: string;
  action: 'create' | 'update' | 'unchanged' | 'skip';
  reason?: string;
  resolvedType?: 'COLOR' | 'FLOAT' | 'STRING';
  value?: { r: number; g: number; b: number; a: number } | number | string;
  cssVar?: string;
  preview?: string;
}

export interface PlanResult {
  create: PlanRow[];
  update: PlanRow[];
  unchanged: PlanRow[];
  skip: PlanRow[];
}

export interface ApplyLogItem {
  name: string;
  action: 'create' | 'update';
  ok: boolean;
  error?: string;
}

export interface ApplyResult {
  created: number;
  updated: number;
  failed: number;
  log: ApplyLogItem[];
}

export type UiToMain =
  | { type: 'ready' }
  | { type: 'save-settings'; settings: PluginSettings; githubToken: string }
  | { type: 'clear-token' }
  | { type: 'fetch' }
  | { type: 'plan'; app: string; names: string[] }
  | { type: 'apply'; app: string; names: string[] };

export type MainToUi =
  | {
      type: 'boot';
      fileKey: string | null;
      fileName: string;
      blocked: boolean;
      reason: string | null;
      settings: PluginSettings;
      tokenStatus: string;
    }
  | { type: 'settings-saved'; settings: PluginSettings; tokenStatus: string }
  | { type: 'proposal'; rows: TokenRow[]; error?: string }
  | { type: 'plan'; plan: PlanResult }
  | { type: 'applied'; result: ApplyResult }
  | { type: 'error'; message: string };
