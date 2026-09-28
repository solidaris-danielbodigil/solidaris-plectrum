// Editor wrappers for the Plectrum-checkout agents, generated from .ai/agents.
// One role text per agent; editor-only lines sit in <!-- editor:cursor|vscode --> blocks.
// Commands, capabilities and identities resolve from process.json, registry.json and
// the editor MCP configuration, so a changed command reaches every agent in one edit.
import fs from 'node:fs';
import path from 'node:path';

export type Editor = 'cursor' | 'vscode';

interface Role {
  slug: string;
  name: string;
  description: string;
  summary: string;
  readonly: boolean;
  userInvocable: boolean;
  vscodeTools: string[];
  delegates?: string[];
}

const marker = '<!-- Generated from .ai/agents by contracts:generate. Do not edit. -->';

function at(value: unknown, dotted: string, source: string): string {
  const result = dotted.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], value);
  if (typeof result !== 'string') throw new Error(`Agent guidance references missing ${source}:${dotted}`);
  return result;
}

export interface GuidanceContext {
  process: { commands: Record<string, { command: string }> } & Record<string, unknown>;
  registry: { applications: { label: string; path?: string; kind: string }[] } & Record<string, unknown>;
  mcp: Record<string, { url?: string }>;
}

/** Keep the requested editor's blocks, drop the others, then resolve every placeholder. */
export function renderGuidance(text: string, editor: Editor, context: GuidanceContext): string {
  const local = context.registry.applications.filter((app) => app.kind === 'local-demo');
  const blocks = text.replace(/<!-- editor:(cursor|vscode) -->\n([\s\S]*?)<!-- \/editor -->\n?/g, (_, name: Editor, body: string) => (name === editor ? body : ''));
  return blocks.replace(/\{\{([A-Za-z]+)(?::([A-Za-z0-9.]+))?\}\}/g, (token, kind: string, key?: string) => {
    if (kind === 'command' && key) {
      const command = context.process.commands[key];
      if (!command) throw new Error(`Agent guidance references unknown process command ${key}`);
      return command.command;
    }
    if (kind === 'process' && key) return at(context.process, key, 'process');
    if (kind === 'registry' && key) return at(context.registry, key, 'registry');
    if (kind === 'mcp' && key) return at(context.mcp, `${key}.url`, 'mcp');
    if (kind === 'applications') return local.map((app) => app.label).join(', ');
    if (kind === 'applicationPaths') return local.map((app) => `${app.path}/`).join('  ');
    throw new Error(`Unknown agent guidance placeholder ${token}`);
  });
}

function frontmatter(role: Role, editor: Editor): string {
  const lines = ['---', `name: ${role.name}`, `description: ${role.description}`];
  if (editor === 'cursor') lines.push(`readonly: ${role.readonly}`);
  else {
    if (!role.userInvocable) lines.push('user-invocable: false');
    lines.push('tools:', ...role.vscodeTools.map((tool) => `  - ${tool}`));
    if (role.delegates?.length) lines.push('agents:', ...role.delegates.map((name) => `  - ${name}`));
  }
  return [...lines, '---'].join('\n');
}

/** Every generated agent file, keyed by repository path. */
export function agentOutputs(root: string, context: GuidanceContext): Map<string, string> {
  const source = path.join(root, '.ai/agents');
  const { roles } = JSON.parse(fs.readFileSync(path.join(source, 'agents.json'), 'utf8')) as { roles: Role[] };
  const read = (file: string) => fs.readFileSync(path.join(source, file), 'utf8').replaceAll('\r\n', '\n');
  const outputs = new Map<string, string>();
  const names = new Set(roles.map((role) => role.name));
  for (const role of roles) {
    for (const name of role.delegates ?? []) if (!names.has(name)) throw new Error(`${role.name} delegates to unknown agent ${name}`);
    const body = read(`roles/${role.slug}.md`);
    for (const editor of ['cursor', 'vscode'] as const) {
      const file = editor === 'cursor' ? `.cursor/agents/${role.slug}.md` : `.github/agents/${role.slug}.agent.md`;
      outputs.set(file, `${frontmatter(role, editor)}\n\n${marker}\n\n${renderGuidance(body, editor, context).trimEnd()}\n`);
    }
  }
  const baseline = read('baseline.md');
  outputs.set('.cursorrules', `${renderGuidance(baseline, 'cursor', context).trimEnd()}\n\n${marker}\n`);
  outputs.set('.github/copilot-instructions.md', `${renderGuidance(baseline, 'vscode', context).trimEnd()}\n\n${marker}\n`);
  return outputs;
}
