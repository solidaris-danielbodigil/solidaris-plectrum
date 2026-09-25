import type { Meta } from '@storybook/angular-vite';
import processContract from '../../../../.ai/contracts/process.json';
import registry from '../../../../.ai/contracts/registry.json';
import compatibility from '../../../../.ai/contracts/compatibility.json';
import { cardsStory, stepsStory } from './docs-figure-stories';
import type { DocsStep } from '../storybook/docs-figures.types';

const meta: Meta = { title: 'Docs/Figures/Pipeline contracts', tags: ['!dev'] };
export default meta;

function steps(journey: string): DocsStep[] {
  return processContract.steps
    .filter((step) => step.journey === journey || step.journey === 'both')
    .map((step) => ({
      title: step.id.replaceAll('-', ' '),
      who: `${step.owner} · ${step.repository} repository`,
      tone:
        step.owner === 'designer'
          ? 'design'
          : step.repository === 'consumer'
            ? 'app'
            : 'system',
      detail: `Requires: ${step.prerequisites.join(', ')}. Inputs: ${step.inputs.join(', ')}. Outputs: ${step.outputs.join(', ')}.`,
    }));
}
export const Contribution = {
  tags: ['!dev'],
  ...stepsStory(steps('contribution')),
};
export const Design = { tags: ['!dev'], ...stepsStory(steps('design')) };
export const Commands = {
  tags: ['!dev'],
  ...cardsStory(
    Object.entries(processContract.commands).map(([name, command]) => ({
      title: name,
      eyebrow: command.context,
      tone: 'neutral',
      lead: command.command ?? 'Not available yet',
      items: [
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
      lead: `Toolkit ${compatibility.toolkitVersion}`,
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
      lead: processContract.commands.consumerCheck.command,
      items: Object.entries(processContract.checkProfiles.consumerCi)
        .filter(([key]) => key !== 'commands')
        .map(([key, value]) => `${key}: ${value}`),
      tone: 'app',
    },
    {
      title: 'Configuration to confirm',
      items: registry.operations.pending,
      tone: 'neutral',
    },
  ]),
};
export const Teams = {
  tags: ['!dev'],
  ...cardsStory(
    registry.teams.map((team) => ({
      title: team.label,
      eyebrow: team.kind,
      items: [
        `ID: ${team.id}`,
        `Reviewer: ${team.reviewer ?? 'Not configured'}`,
      ],
      tone: 'neutral',
    })),
  ),
};
