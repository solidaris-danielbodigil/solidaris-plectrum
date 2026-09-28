import assert from 'node:assert/strict';
import test from 'node:test';
import { asset } from './common.mjs';
import { guidance } from './managed.mjs';
import { consumerCommands, expand, renderConsumerRules, renderHelp } from './process.mjs';

const contract = asset('process.json');

test('help lists every available application command with its summary', () => {
  const help = renderHelp(contract, '0.0.0-test');
  for (const command of consumerCommands(contract)) {
    assert.ok(help.includes(command.usage), command.id);
    assert.ok(help.includes(command.summary), command.id);
  }
  assert.ok(!help.includes('scaffold --name=<name>'), 'Plectrum-checkout commands stay out of toolkit help');
});

test('role guidance resolves every command placeholder from the contract', () => {
  const { roles, baseline } = guidance(contract);
  for (const text of [...Object.values(roles), baseline]) assert.doesNotMatch(text, /\{\{|\}\}/);
  assert.ok(roles.Tester.includes('plectrum check --profile ci'));
  assert.throws(() => expand('{{command:missing}}', contract), /Unknown process command/);
});

test('changing one command in the contract changes help, agent guidance and consumer rules together', () => {
  const changed = structuredClone(contract);
  changed.commands.consumerCheck.command = 'npx --no-install plectrum check --profile release';
  changed.commands.consumerCheck.summary = 'Run the release profile.';
  const help = renderHelp(changed, '0.0.0-test');
  const { roles } = guidance(changed);
  const rules = renderConsumerRules(changed);
  for (const output of [help, roles.Tester, rules]) assert.ok(output.includes('check --profile release'));
  assert.ok(help.includes('Run the release profile.'));
  assert.ok(!rules.includes('check --profile ci'));
});
