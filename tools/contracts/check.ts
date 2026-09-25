import fs from 'node:fs';
import { inventory } from './inventory';
import { generateContracts } from './generate';
import { readRegistry, validateExchange } from './validate';
import processContract from '../../.ai/contracts/process.json';

async function check() {
  const root = process.cwd();
  await generateContracts(root, true);
  validateExchange(
    'compatibility',
    JSON.parse(fs.readFileSync('.ai/contracts/compatibility.json', 'utf8')),
    readRegistry(root),
  );
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const devkit = JSON.parse(fs.readFileSync('tools/devkit/package.json', 'utf8'));
  for (const command of Object.values(processContract.commands)) {
    if (!command.available || !command.command) continue;
    const script = /^npm run ([\w:-]+)/.exec(command.command)?.[1];
    if (script && !pkg.scripts[script])
      throw new Error(`Process command missing from package.json: ${script}`);
    if (command.context === 'consumer' && command.command?.includes('plectrum ') && !devkit.bin?.plectrum)
      throw new Error('Consumer process command has no toolkit executable.');
  }
  for (const step of processContract.steps) {
    if (!step.owner || !step.repository)
      throw new Error(`Unowned process step: ${step.id}`);
    for (const command of step.commands)
      if (!Object.hasOwn(processContract.commands, command))
        throw new Error(`Unknown process command: ${command}`);
  }
  for (const item of await inventory(root)) {
    if (/\b(TODO|TBD|FIXME)\b/.test(JSON.stringify(item.metadata)))
      throw new Error(
        `${item.metadata.component.id}: complete metadata TODOs before review`,
      );
  }
  console.log(
    'Contract schemas, registry, process commands, generated files and metadata readiness passed.',
  );
}
check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
