import { packageJson } from './common.mjs';

export async function probeMcp(url) {
  try {
    const response = await fetch(url, {
      method: 'POST', signal: AbortSignal.timeout(6000),
      headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'plectrum-devkit', version: packageJson.version } } }),
    });
    const body = await response.text();
    const eventData = body.split(/\r?\n/).find((line) => line.startsWith('data:'))?.slice(5).trim();
    let payload;
    try { payload = JSON.parse(eventData ?? body); } catch { payload = null; }
    if (!response.ok || !payload?.result?.capabilities) return { ok: false, error: `HTTP ${response.status}; initialize capabilities unavailable` };
    return { ok: true, capabilities: Object.keys(payload.result.capabilities) };
  } catch (error) { return { ok: false, error: error.message }; }
}
