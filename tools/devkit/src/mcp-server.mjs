// Offline Plectrum MCP server over stdio (JSON-RPC 2.0, one message per line).
// It answers from the data installed with this toolkit version — catalogue,
// tokens, process and other teams' local components — so an application agent
// needs no network, account or running Storybook to ask what already exists.
import readline from 'node:readline';
import { asset, configAt, installedDocsUrl, packageJson } from './common.mjs';
import { tokenCheck } from './checks.mjs';
import { consumerCommands } from './process.mjs';
import { findTokens, searchComponents } from './search.mjs';
import { recordEvent } from './telemetry.mjs';

const supportedVersions = ['2025-06-18', '2025-03-26', '2024-11-05'];

const instructions = 'Plectrum design-system catalogue installed with this application. '
  + 'Call search_components with the user need in plain words before building any component, pattern or page section, '
  + 'then get_component for the best match to read its use cases, anti-patterns, composition, accessibility and examples. '
  + 'Themed PrimeNG controls are not in this catalogue: use the PrimeNG MCP server for them. '
  + 'Use find_token before writing a --pds-* value and check_tokens after editing styles.';

const tools = [
  {
    name: 'search_components',
    description: 'Find Plectrum components, and other teams\' local components, that already cover a need. Describe what the screen must do, not the component you expect.',
    inputSchema: { type: 'object', properties: { request: { type: 'string', description: 'The need in plain words, e.g. "side panel showing a member\'s details".' }, limit: { type: 'integer', minimum: 1, maximum: 10 } }, required: ['request'], additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'get_component',
    description: 'Read one component contract: status and owner, how to import it, use cases, anti-patterns, composition, behaviour, accessibility, examples and the documentation page of the installed release.',
    inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'Component ID such as plectrum:drawer, or just drawer.' } }, required: ['id'], additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'find_token',
    description: 'List installed --pds-* token names containing every word of the request, e.g. "warning border".',
    inputSchema: { type: 'object', properties: { request: { type: 'string' } }, required: ['request'], additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'check_tokens',
    description: 'Check this application\'s sources and styles for unknown --pds-* tokens; strict also reports hardcoded hex and px values.',
    inputSchema: { type: 'object', properties: { strict: { type: 'boolean' } }, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'get_process',
    description: 'Plectrum commands for this repository, the component statuses and what each proposal decision means.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
];

const statuses = {
  core: 'Generic and owned by the core team — safe in every application.',
  candidate: 'Built for the owning team and flagged for promotion. Ask the core team before reusing it in another application.',
  app: 'Owned by one application. Other applications propose, they do not import.',
  deprecated: 'Scheduled for removal. Do not add new usages.',
  local: 'Built and owned by another application team. Talk to that team and propose a shared version to Core; do not import it.',
};

/** Data installed with the toolkit; tests pass fixtures instead. */
export function installedData() {
  return { catalogue: asset('catalogue.json'), localComponents: asset('local-components.json').components, tokens: asset('tokens.json').names, contract: asset('process.json') };
}

function resolveId(id, data) {
  const value = String(id ?? '').trim();
  const all = [...data.catalogue.components.map((entry) => entry.id), ...data.localComponents.map((entry) => entry.id)];
  return all.find((candidate) => candidate === value) ?? all.find((candidate) => candidate.split(':')[1] === value.toLowerCase()) ?? null;
}

/** Create a request handler. `handle` returns the JSON-RPC response, or null for a notification. */
export function createMcpServer({ root, data = installedData(), record = (event) => recordEvent(root, event) }) {
  const run = {
    search_components({ request, limit }) {
      const results = searchComponents(request, data, { limit: Math.min(Math.max(Number(limit) || 5, 1), 10) });
      record({ source: 'mcp', name: 'search_components', outcome: results.length ? 'ok' : 'empty' });
      return {
        results: results.map((item) => ({ ...item, meaning: statuses[item.status] })),
        next: results.length
          ? 'Call get_component for the best match before proposing a new component. A composition of several components may cover the need.'
          : 'No Plectrum component matches. Check themed PrimeNG (PrimeNG MCP) next; build a local component only if neither covers the need.',
      };
    },
    get_component({ id }) {
      const resolved = resolveId(id, data);
      if (!resolved) {
        record({ source: 'mcp', name: 'get_component', outcome: 'empty' });
        throw new Error(`No component ${id}. Call search_components first.`);
      }
      record({ source: 'mcp', name: 'get_component', componentId: resolved });
      const entry = data.catalogue.components.find((item) => item.id === resolved);
      if (!entry) {
        const local = data.localComponents.find((item) => item.id === resolved);
        return { ...local, status: 'local', meaning: statuses.local };
      }
      const status = entry.metadata.governance?.status;
      return {
        id: entry.id,
        status,
        meaning: statuses[status],
        owner: entry.metadata.governance?.owner,
        import: entry.package?.exportName
          ? { package: entry.package.importPath, exportName: entry.package.exportName, selector: entry.selector }
          : { package: entry.package?.name, note: 'CSS classes only: no Angular import. Use the BEM block in the template.' },
        docsUrl: installedDocsUrl(root, entry),
        metadata: entry.metadata,
      };
    },
    find_token({ request }) {
      const names = findTokens(request, data.tokens);
      record({ source: 'mcp', name: 'find_token', outcome: names.length ? 'ok' : 'empty' });
      return { tokens: names, usage: 'Write var(--name). A value only this application needs goes in a local token file listed in paths.localTokenFiles.' };
    },
    check_tokens({ strict = false }) {
      const result = tokenCheck(root, configAt(root), Boolean(strict));
      record({ source: 'mcp', name: 'check_tokens', outcome: result.violations.length ? 'error' : 'ok' });
      return { filesScanned: result.count, profile: strict ? 'strict' : 'unknown-token', violations: result.violations };
    },
    get_process() {
      record({ source: 'mcp', name: 'get_process' });
      return {
        commands: consumerCommands(data.contract).map(({ usage, summary }) => ({ usage: `plectrum ${usage}`, summary })),
        statuses,
        proposalOutcomes: Object.fromEntries(Object.entries(data.contract.proposalOutcomes ?? {}).map(([key, value]) => [key, value.effect])),
        commitTrailer: 'When you helped with a commit, add one trailer: "Plectrum-Agent: reuse=<component ids>", "Plectrum-Agent: scaffold=<slug>" or "Plectrum-Agent: advice".',
      };
    },
  };

  const reply = (id, result) => ({ jsonrpc: '2.0', id, result });
  const fail = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

  async function handle(message) {
    if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') return fail(message?.id ?? null, -32600, 'Invalid request');
    const notification = message.id === undefined || message.id === null;
    if (notification) return null;
    const { id, method, params = {} } = message;
    switch (method) {
      case 'initialize': {
        const requested = params.protocolVersion;
        return reply(id, {
          protocolVersion: supportedVersions.includes(requested) ? requested : supportedVersions[0],
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'plectrum', title: 'Plectrum design system', version: packageJson.version },
          instructions,
        });
      }
      case 'ping':
        return reply(id, {});
      case 'tools/list':
        return reply(id, { tools });
      case 'tools/call': {
        const tool = run[params.name];
        if (!tool) return fail(id, -32602, `Unknown tool: ${params.name}`);
        try {
          const result = await tool(params.arguments ?? {});
          return reply(id, { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }], isError: false });
        } catch (error) {
          return reply(id, { content: [{ type: 'text', text: error.message }], isError: true });
        }
      }
      default:
        return fail(id, -32601, `Method not found: ${method}`);
    }
  }

  return { handle, tools };
}

/** Serve over stdin/stdout. Diagnostics go to stderr so stdout carries only protocol messages. */
export function serveStdio(root, input = process.stdin, output = process.stdout) {
  const server = createMcpServer({ root });
  const lines = readline.createInterface({ input, crlfDelay: Infinity });
  // Requests are answered one at a time, in arrival order.
  let queue = Promise.resolve();
  lines.on('line', (line) => {
    if (!line.trim()) return;
    queue = queue.then(async () => {
      let message;
      try { message = JSON.parse(line); } catch {
        output.write(`${JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } })}\n`);
        return;
      }
      const response = await server.handle(message);
      if (response) output.write(`${JSON.stringify(response)}\n`);
    });
  });
  process.stderr.write(`Plectrum MCP ${packageJson.version}: ${server.tools.length} tools on stdio.\n`);
  return lines;
}
