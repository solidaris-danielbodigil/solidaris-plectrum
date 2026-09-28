// Renders toolkit help, consumer rules and role text from the installed process contract.
// The contract is the only source: nothing here restates a command, step or outcome.

const shortForm = (contract, command) => {
  const binary = contract.toolkit.invocation.split(' ').at(-1);
  return command.startsWith(`${contract.toolkit.invocation} `) ? `${binary}${command.slice(contract.toolkit.invocation.length)}` : command;
};

/** Available application-repository commands, in contract order. */
export function consumerCommands(contract) {
  return Object.entries(contract.commands)
    .filter(([, command]) => command.context === 'consumer' && command.available)
    .map(([id, command]) => ({ id, usage: shortForm(contract, command.command).replace(/^\S+ /, ''), full: command.command, summary: command.summary, scope: command.scope }));
}

/** The CLI subcommand a process command invokes: `tokens check`, `candidate-submit`, … */
export function subcommandOf(usage) {
  const words = usage.split(' ');
  return words[0] === 'tokens' ? `${words[0]} ${words[1]}` : words[0];
}

export function renderHelp(contract, version) {
  const lines = [`Plectrum toolkit ${version} · process ${contract.version}`, '', 'Commands:'];
  for (const command of consumerCommands(contract)) {
    lines.push(`  ${command.usage}`, `      ${command.summary}${command.scope ? ` (${command.scope})` : ''}`);
  }
  const schemas = contract.commands.consumerValidate?.values?.schema;
  if (schemas) lines.push('', `Schemas for validate: ${schemas.join(', ')}`);
  lines.push('', `All commands accept ${contract.toolkit.globalOptions.join(', ')}.`, ...contract.toolkit.notes, '');
  return lines.join('\n');
}

/** Replace {{command:id}} with that command's `plectrum …` form, without optional [..] groups. Unknown IDs fail. */
export function expand(text, contract) {
  return text.replace(/\{\{command:([A-Za-z]+)\}\}/g, (_, id) => {
    const command = contract.commands[id];
    if (!command) throw new Error(`Unknown process command in guidance: ${id}`);
    return shortForm(contract, command.command).replace(/ \[[^\]]*\]/g, '');
  });
}

const sentence = (items) => items.join('; ');

/** Application-repository rules generated into rules/consumer.md. */
export function renderConsumerRules(contract) {
  const steps = new Map(contract.steps.map((step) => [step.id, step]));
  const section = (journey) =>
    contract.journeys[journey]
      .map((id) => steps.get(id))
      .map((step, index) => {
        const where = step.repository === 'consumer' ? 'this repository' : 'the central Plectrum repository';
        const commands = step.commands.map((id) => `\`${shortForm(contract, contract.commands[id].command)}\``);
        return `${index + 1}. **${step.id}** — ${step.owner}, in ${where}. Needs: ${sentence(step.prerequisites)}. Produces: ${sentence(step.outputs)}.${commands.length ? ` Commands: ${commands.join(', ')}.` : ''}`;
      })
      .join('\n');
  const outcomes = Object.entries(contract.proposalOutcomes)
    .map(([decision, outcome]) => `- \`${decision}\`: ${outcome.effect}${outcome.step ? ` Next step: **${outcome.step}**.` : ''}`)
    .join('\n');
  return `<!-- Generated from process.json ${contract.version} by contracts:generate. Do not edit. -->
# Plectrum in an application repository

The installed \`@solidaris-danielbodigil/pds-devkit\` package owns the catalogue, schemas, process and shared role instructions. \`.plectrum/config.json\` owns this application's identity and paths. \`plectrum update\` regenerates editor adapters; keep team-specific notes in other files.

${contract.contexts.consumer.rule} Candidates live under \`${contract.contexts.consumer.componentRoot}\`; their styles under \`${contract.contexts.consumer.stylesRoot}\`.

## Build with Plectrum

${section('onboarding')}

## Contribute a component

${section('contribution')}

## Proposal decisions

${outcomes}

## Commands

${consumerCommands(contract).map((command) => `- \`plectrum ${command.usage}\` — ${command.summary}`).join('\n')}

${contract.toolkit.notes.join(' ')}

The package's \`rules/central/\` files describe the Plectrum checkout and are reference material. Their monorepo paths and commands do not apply to application repositories.
`;
}
