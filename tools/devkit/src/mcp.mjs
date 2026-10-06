import { spawn } from 'node:child_process';
import { packageJson } from './common.mjs';

const initialize = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'plectrum-devkit', version: packageJson.version } } };

export async function probeMcp(url) {
  try {
    const response = await fetch(url, {
      method: 'POST', signal: AbortSignal.timeout(6000),
      headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
      body: JSON.stringify(initialize),
    });
    const body = await response.text();
    const eventData = body.split(/\r?\n/).find((line) => line.startsWith('data:'))?.slice(5).trim();
    let payload;
    try { payload = JSON.parse(eventData ?? body); } catch { payload = null; }
    if (!response.ok || !payload?.result?.capabilities) return { ok: false, error: `HTTP ${response.status}; initialize capabilities unavailable` };
    return { ok: true, capabilities: Object.keys(payload.result.capabilities) };
  } catch (error) { return { ok: false, error: error.message }; }
}

/** Start a stdio server the way the editor would, send initialize and stop it. npx needs a shell on Windows. */
export function probeStdioMcp({ command, args }, timeout = 60000) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { shell: process.platform === 'win32', stdio: ['pipe', 'pipe', 'ignore'] });
    let output = '';
    // Closing stdin stops the server even where kill() only reaches the Windows shell.
    const finish = (result) => { clearTimeout(timer); child.stdin.end(); child.kill(); resolve(result); };
    const timer = setTimeout(() => finish({ ok: false, error: `no initialize answer within ${timeout / 1000}s` }), timeout);
    child.on('error', (error) => finish({ ok: false, error: error.message }));
    child.on('exit', (code) => finish({ ok: false, error: `exited with code ${code} before answering` }));
    child.stdout.on('data', (chunk) => {
      output += chunk;
      for (const line of output.split('\n').slice(0, -1)) {
        let payload;
        try { payload = JSON.parse(line); } catch { continue; }
        if (payload.id === 1) return finish(payload.result?.capabilities ? { ok: true, capabilities: Object.keys(payload.result.capabilities) } : { ok: false, error: 'initialize capabilities unavailable' });
      }
    });
    child.stdin.write(`${JSON.stringify(initialize)}\n`);
  });
}
