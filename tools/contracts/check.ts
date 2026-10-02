import fs from 'node:fs';
import { inventory } from './inventory';
import { missingKeyboardStories } from './keyboard-stories';
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
  validateExchange('process', processContract, readRegistry(root));
  const gate = /^npm run ([\w:-]+)/.exec(processContract.capabilities.storybookMcp.gate)?.[1];
  if (gate && !pkg.scripts[gate])
    throw new Error(`Storybook MCP gate missing from package.json: ${gate}`);
  const items = await inventory(root);
  for (const item of items) {
    if (/\b(TODO|TBD|FIXME)\b/.test(JSON.stringify(item.metadata)))
      throw new Error(
        `${item.metadata.component.id}: complete metadata TODOs before review`,
      );
  }
  const withoutKeyboardStory = missingKeyboardStories(root, items);
  if (withoutKeyboardStory.length)
    throw new Error(
      `Interactive components need a story tagged 'keyboard' that proves accessibility.keyboardSupport: ${withoutKeyboardStory.join(', ')}`,
    );
  console.log(
    'Contract schemas, registry, process commands, generated files, metadata readiness and keyboard stories passed.',
  );
}
check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
