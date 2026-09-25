import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { probeMcp } from './mcp.mjs';

test('MCP doctor validates initialize capabilities for JSON and event stream responses', async () => {
  let mode = 'json';
  const server = http.createServer((request, response) => {
    assert.equal(request.method, 'POST');
    const payload = JSON.stringify({ jsonrpc: '2.0', id: 1, result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'fixture', version: '1.0.0' } } });
    response.writeHead(200, { 'content-type': mode === 'json' ? 'application/json' : 'text/event-stream' });
    response.end(mode === 'json' ? payload : `event: message\ndata: ${payload}\n\n`);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const url = `http://127.0.0.1:${server.address().port}/mcp`;
    assert.deepEqual(await probeMcp(url), { ok: true, capabilities: ['tools'] });
    mode = 'sse';
    assert.deepEqual(await probeMcp(url), { ok: true, capabilities: ['tools'] });
  } finally { await new Promise((resolve) => server.close(resolve)); }
});
