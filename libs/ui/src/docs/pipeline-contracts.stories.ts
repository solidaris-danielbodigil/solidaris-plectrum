import type { Meta } from '@storybook/angular-vite';
import processContract from '../../../../.ai/contracts/process.json';
import registry from '../../../../.ai/contracts/registry.json';
import compatibility from '../../../../.ai/contracts/compatibility.json';
import { cardsStory, stepsStory } from './docs-figure-stories';
import { consumerCiRequirements, journeySteps, teamCards } from '../storybook/process-docs';

const meta: Meta = { title: 'Docs/Figures/Pipeline contracts', tags: ['!dev'] };
export default meta;

export const Onboarding = { tags: ['!dev'], ...stepsStory(journeySteps('onboarding', {}, true)) };
export const Contribution = { tags: ['!dev'], ...stepsStory(journeySteps('contribution', {}, true)) };
export const Design = { tags: ['!dev'], ...stepsStory(journeySteps('design', {}, true)) };
export const Commands = {
  tags: ['!dev'],
  ...cardsStory(
    Object.entries(processContract.commands).map(([name, command]) => ({
      title: name,
      eyebrow: command.context,
      tone: 'neutral',
      lead: command.command,
      items: [
        command.summary,
        command.available
          ? `${command.context === 'consumer' ? 'Available in the application checkout.' : 'Available in the Plectrum checkout.'}${'scope' in command ? ` Scope: ${command.scope}.` : ''}`
          : `Planned: ${'plannedPhase' in command ? command.plannedPhase : 'later phase'}`,
      ],
    })),
  ),
};
export const Operations = {
  tags: ['!dev'],
  ...cardsStory([
    {
      title: 'Distribution',
      eyebrow: registry.operations.visibility,
      lead: `${registry.operations.publicationScope} · ${registry.operations.registry}`,
      items: [
        `Publication enabled: ${registry.operations.publicationEnabled}`,
        `Reporting: ${registry.operations.reportTransport}`,
        `Ingestion enabled: ${registry.operations.reportIngestionEnabled}`,
      ],
      tone: 'system',
    },
    {
      title: 'Toolkit compatibility',
      eyebrow: compatibility.status,
      lead: `Toolkit ${compatibility.toolkitVersion} · process ${processContract.version}`,
      items: [
        `DS: ${compatibility.dsVersionRange}`,
        `Contracts: ${compatibility.contractSchemaRange}`,
        `Process: ${compatibility.processVersionRange}`,
        `Editors: ${compatibility.editors.join(', ')}`,
      ],
      tone: 'app',
    },
    {
      title: 'Consumer CI profile',
      eyebrow: 'consumerCi',
      items: consumerCiRequirements(),
      tone: 'app',
    },
    {
      title: 'Configuration to confirm',
      items: registry.operations.pending,
      tone: 'neutral',
    },
  ]),
};
export const Teams = { tags: ['!dev'], ...cardsStory(teamCards()) };
