import processContract from '../../../../.ai/contracts/process.json';
import registry from '../../../../.ai/contracts/registry.json';
import { teamFilterLabels, type CatalogueEntry } from './catalogue';
import { consumerCiRequirements, docsStep, journeySteps, outcomeCards, routeSteps, teamCards } from './process-docs';

describe('process docs renderers', () => {
  it('renders every journey step, in contract order, with its commands', () => {
    for (const [journey, ids] of Object.entries(processContract.journeys)) {
      const steps = journeySteps(journey as keyof typeof processContract.journeys, {}, true);
      expect(steps.map((step) => step.title.toLowerCase().replaceAll(' ', '-'))).toEqual(ids);
    }
    const initialize = docsStep('initialize');
    expect(initialize.commands).toEqual(
      processContract.steps.find((step) => step.id === 'initialize')!.commands.map(
        (id) => processContract.commands[id as keyof typeof processContract.commands].command,
      ),
    );
  });

  it('omits commands from journey overviews unless asked', () => {
    expect(journeySteps('onboarding').every((step) => !step.commands)).toBe(true);
  });

  it('shows exactly the proposal decisions of the contract', () => {
    expect(outcomeCards().map((card) => card.eyebrow)).toEqual(Object.keys(processContract.proposalOutcomes));
  });

  it('resolves every route to its steps', () => {
    for (const route of processContract.routes) expect(routeSteps(route.id)).toHaveLength(route.steps.length);
  });

  it('lists one owner card per registered team and every registered application', () => {
    const cards = teamCards();
    expect(cards.map((card) => card.title)).toEqual(registry.teams.map((team) => team.label));
    for (const app of registry.applications) expect(cards.some((card) => card.items?.some((item) => item.includes(app.label)))).toBe(true);
  });

  it('renders the consumer CI profile flags from the contract', () => {
    expect(consumerCiRequirements()).toContain('strict tokens: required');
  });

  it('adds a registered application to the team filter before it reports any usage', () => {
    const entries = [{ usedIn: ['iSHARE'] }] as unknown as CatalogueEntry[];
    expect(teamFilterLabels(entries, [...registry.applications, { label: 'New App' }])).toContain('New App');
  });
});
