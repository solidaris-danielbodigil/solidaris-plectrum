import type {
  MainToUi,
  PlanResult,
  PluginSettings,
  TokenRow,
  UiToMain,
} from './messages';

const $ = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;

const fileEl = $<HTMLParagraphElement>('file');
const guardEl = $<HTMLParagraphElement>('guard');
const ownerEl = $<HTMLInputElement>('owner');
const repoEl = $<HTMLInputElement>('repo');
const pathEl = $<HTMLInputElement>('path');
const refEl = $<HTMLInputElement>('ref');
const tokenEl = $<HTMLInputElement>('token');
const tokenStatusEl = $<HTMLSpanElement>('token-status');
const appEl = $<HTMLSelectElement>('app');
const appCustomEl = $<HTMLInputElement>('app-custom');
const filterEl = $<HTMLInputElement>('filter');
const rowsEl = $<HTMLTableSectionElement>('rows');
const countsEl = $<HTMLParagraphElement>('counts');
const summaryEl = $<HTMLParagraphElement>('summary');
const logEl = $<HTMLPreElement>('log');
const fetchBtn = $<HTMLButtonElement>('fetch');
const planBtn = $<HTMLButtonElement>('plan');
const applyBtn = $<HTMLButtonElement>('apply');

let blocked = false;
let rows: TokenRow[] = [];
const selected = new Set<string>();

function post(message: UiToMain): void {
  parent.postMessage({ pluginMessage: message }, '*');
}

function readSettings(): PluginSettings {
  return {
    owner: ownerEl.value.trim(),
    repo: repoEl.value.trim(),
    path: pathEl.value.trim(),
    ref: refEl.value.trim(),
  };
}

function writeSettings(settings: PluginSettings, tokenStatus: string): void {
  ownerEl.value = settings.owner;
  repoEl.value = settings.repo;
  pathEl.value = settings.path;
  refEl.value = settings.ref;
  tokenStatusEl.textContent = `Token ${tokenStatus}`;
}

function currentApp(): string {
  return appEl.value === 'custom' ? appCustomEl.value.trim() : appEl.value;
}

function visibleRows(): TokenRow[] {
  const q = filterEl.value.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (row) =>
      row.name.toLowerCase().includes(q) ||
      row.$type.toLowerCase().includes(q) ||
      (row.cssVar ?? '').toLowerCase().includes(q),
  );
}

function renderRows(): void {
  const visible = visibleRows();
  rowsEl.replaceChildren();
  for (const row of visible) {
    const tr = document.createElement('tr');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = selected.has(row.name);
    check.disabled = !row.writable;
    check.addEventListener('change', () => {
      if (check.checked) selected.add(row.name);
      else selected.delete(row.name);
      applyBtn.disabled = true;
      updateCounts();
    });
    const tdCheck = document.createElement('td');
    tdCheck.append(check);
    const tdName = document.createElement('td');
    tdName.textContent = row.name;
    const tdType = document.createElement('td');
    tdType.textContent = row.writable ? row.$type : `${row.$type} · skip`;
    const tdValue = document.createElement('td');
    tdValue.textContent =
      row.reason && !row.writable ? row.reason : row.preview;
    tr.append(tdCheck, tdName, tdType, tdValue);
    rowsEl.append(tr);
  }
  updateCounts();
}

function updateCounts(): void {
  const writable = rows.filter((row) => row.writable).length;
  countsEl.textContent = `${rows.length} tokens · ${writable} writable · ${selected.size} selected`;
}

function setBusy(busy: boolean): void {
  fetchBtn.disabled = busy || blocked;
  planBtn.disabled = busy || blocked;
  if (busy) applyBtn.disabled = true;
}

function describePlan(plan: PlanResult): string {
  return [
    `${plan.create.length} create`,
    `${plan.update.length} update`,
    `${plan.unchanged.length} unchanged`,
    `${plan.skip.length} skip`,
  ].join(' · ');
}

$<HTMLButtonElement>('save').addEventListener('click', () => {
  post({
    type: 'save-settings',
    settings: readSettings(),
    githubToken: tokenEl.value,
  });
  tokenEl.value = '';
});

$<HTMLButtonElement>('clear-token').addEventListener('click', () => {
  post({ type: 'clear-token' });
  tokenEl.value = '';
});

appEl.addEventListener('change', () => {
  appCustomEl.hidden = appEl.value !== 'custom';
  applyBtn.disabled = true;
});

fetchBtn.addEventListener('click', () => {
  selected.clear();
  applyBtn.disabled = true;
  setBusy(true);
  logEl.textContent = 'Fetching…';
  post({ type: 'fetch' });
});

filterEl.addEventListener('input', renderRows);

$<HTMLButtonElement>('select-visible').addEventListener('click', () => {
  for (const row of visibleRows()) {
    if (row.writable) selected.add(row.name);
  }
  applyBtn.disabled = true;
  renderRows();
});

$<HTMLButtonElement>('clear-selection').addEventListener('click', () => {
  selected.clear();
  applyBtn.disabled = true;
  renderRows();
});

planBtn.addEventListener('click', () => {
  setBusy(true);
  post({ type: 'plan', app: currentApp(), names: [...selected] });
});

applyBtn.addEventListener('click', () => {
  setBusy(true);
  post({ type: 'apply', app: currentApp(), names: [...selected] });
});

window.onmessage = (event: MessageEvent<{ pluginMessage?: MainToUi }>) => {
  const message = event.data.pluginMessage;
  if (!message) return;

  if (message.type === 'boot') {
    blocked = message.blocked;
    fileEl.textContent = `${message.fileName} · ${message.fileKey ?? 'no file key'}`;
    guardEl.textContent =
      message.reason ??
      'Writes go to collection proposals/{app} on this branch.';
    guardEl.className = message.blocked ? 'blocked' : 'hint';
    writeSettings(message.settings, message.tokenStatus);
    setBusy(false);
    return;
  }

  if (message.type === 'settings-saved') {
    writeSettings(message.settings, message.tokenStatus);
    logEl.textContent = 'Settings saved. The token is not shown again.';
    return;
  }

  if (message.type === 'proposal') {
    setBusy(false);
    rows = message.rows;
    selected.clear();
    applyBtn.disabled = true;
    renderRows();
    summaryEl.textContent = '';
    logEl.textContent =
      message.error ??
      `Loaded ${message.rows.length} tokens. Nothing is selected.`;
    return;
  }

  if (message.type === 'plan') {
    setBusy(false);
    applyBtn.disabled =
      blocked || message.plan.create.length + message.plan.update.length === 0;
    summaryEl.textContent = describePlan(message.plan);
    const lines = [
      ...message.plan.create.map(
        (row) => `create  ${row.name}  ${row.preview ?? ''}`,
      ),
      ...message.plan.update.map(
        (row) => `update  ${row.name}  ${row.preview ?? ''}`,
      ),
      ...message.plan.unchanged.map((row) => `unchanged  ${row.name}`),
      ...message.plan.skip.map(
        (row) => `skip  ${row.name}  ${row.reason ?? ''}`,
      ),
    ];
    logEl.textContent = lines.join('\n') || 'Empty plan.';
    return;
  }

  if (message.type === 'applied') {
    setBusy(false);
    applyBtn.disabled = true;
    summaryEl.textContent = `${message.result.created} created · ${message.result.updated} updated · ${message.result.failed} failed`;
    logEl.textContent = message.result.log
      .map(
        (item) =>
          `${item.ok ? item.action : 'fail'}  ${item.name}${item.error ? `  ${item.error}` : ''}`,
      )
      .join('\n');
    return;
  }

  if (message.type === 'error') {
    setBusy(false);
    logEl.textContent = message.message;
  }
};

post({ type: 'ready' });
