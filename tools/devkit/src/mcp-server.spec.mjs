import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { createMcpServer, installedData, serveStdio } from './mcp-server.mjs';

const call = (id, name, args = {}) => ({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } });
const body = (response) => JSON.parse(response.result.content[0].text);

test('MCP server negotiates the protocol and lists read-only tools', async () => {
  const server = createMcpServer({ root: process.cwd(), record: () => {} });
  const init = await server.handle({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'test', version: '1' } } });
  assert.equal(init.result.protocolVersion, '2025-03-26');
  assert.deepEqual(init.result.capabilities, { tools: { listChanged: false } });
  assert.match(init.result.instructions, /search_components/);
  const unknownVersion = await server.handle({ jsonrpc: '2.0', id: 2, method: 'initialize', params: { protocolVersion: '1999-01-01' } });
  assert.equal(unknownVersion.result.protocolVersion, '2025-06-18');
  assert.equal(await server.handle({ jsonrpc: '2.0', method: 'notifications/initialized' }), null);
  const list = await server.handle({ jsonrpc: '2.0', id: 3, method: 'tools/list' });
  assert.deepEqual(list.result.tools.map((tool) => tool.name), ['search_components', 'get_component', 'find_token', 'check_tokens', 'get_process']);
  assert.ok(list.result.tools.every((tool) => tool.annotations.readOnlyHint));
  assert.equal((await server.handle({ jsonrpc: '2.0', id: 4, method: 'resources/list' })).error.code, -32601);
});

test('MCP tools answer from the installed catalogue and record content-free events', async () => {
  const events = [];
  const server = createMcpServer({ root: process.cwd(), record: (event) => events.push(event) });
  const search = body(await server.handle(call(1, 'search_components', { request: 'Search input with a button to clear the text' })));
  assert.equal(search.results[0].id, 'plectrum:input-clear');
  assert.match(search.results[0].meaning, /core team/);
  const component = body(await server.handle(call(2, 'get_component', { id: 'input-clear' })));
  assert.equal(component.id, 'plectrum:input-clear');
  assert.equal(component.import.exportName, 'InputClearComponent');
  assert.ok(component.metadata.usage.useCases.length);
  const tokens = body(await server.handle(call(3, 'find_token', { request: 'border width' })));
  assert.ok(tokens.tokens.includes('--pds-border-width-default'));
  const process_ = body(await server.handle(call(4, 'get_process')));
  assert.ok(process_.commands.some((command) => command.usage === 'plectrum mcp'));
  const missing = await server.handle(call(5, 'get_component', { id: 'nothing-like-this' }));
  assert.equal(missing.result.isError, true);
  assert.equal((await server.handle(call(6, 'nope'))).error.code, -32602);
  assert.deepEqual(events, [
    { source: 'mcp', name: 'search_components', outcome: 'ok' },
    { source: 'mcp', name: 'get_component', componentId: 'plectrum:input-clear' },
    { source: 'mcp', name: 'find_token', outcome: 'ok' },
    { source: 'mcp', name: 'get_process' },
    { source: 'mcp', name: 'get_component', outcome: 'empty' },
  ]);
  assert.ok(events.every((event) => !('request' in event)), 'events never carry the request text');
});

test('another team\'s local component is returned as local, not importable', async () => {
  const data = { ...installedData(), localComponents: [{ id: 'claims:claim-card', name: 'Claim card', description: 'Summary card of a health insurance claim', useCases: ['Show a claim summary with its status'], reusePotential: 'likely', team: 'claims', application: 'claims-portal', label: 'Claims portal' }] };
  const server = createMcpServer({ root: process.cwd(), data, record: () => {} });
  const search = body(await server.handle(call(1, 'search_components', { request: 'claim summary card with status' })));
  assert.equal(search.results[0].id, 'claims:claim-card');
  assert.equal(search.results[0].status, 'local');
  const component = body(await server.handle(call(2, 'get_component', { id: 'claims:claim-card' })));
  assert.match(component.meaning, /do not import/);
});

test('stdio transport answers one JSON message per line and reports parse errors', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const lines = [];
  output.on('data', (chunk) => lines.push(...chunk.toString().split('\n').filter(Boolean)));
  const reader = serveStdio(process.cwd(), input, output);
  input.write('{"jsonrpc":"2.0","id":1,"method":"ping"}\n');
  input.write('not json\n');
  input.end();
  await new Promise((resolve) => reader.on('close', resolve));
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(lines.map((line) => JSON.parse(line)), [
    { jsonrpc: '2.0', id: 1, result: {} },
    { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } },
  ]);
});
