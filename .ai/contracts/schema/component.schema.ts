import { z } from 'zod';

const text = z.string().min(1);
const strings = z.array(text);
export const componentIdSchema = z
  .string()
  .regex(/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/);
export const dateSchema = z.iso.date();
export const componentStatusSchema = z.enum([
  'core',
  'candidate',
  'app',
  'deprecated',
]);
export const componentGovernanceSchema = z.strictObject({
  status: componentStatusSchema,
  owner: text, // Validated against registry.json, never a second list of teams.
  note: text.optional(),
  replacementId: componentIdSchema.optional(),
});
export const componentPatternSchema = z.strictObject({
  name: text,
  description: text,
  composition: text,
});
export const antiPatternSchema = z.strictObject({
  scenario: text,
  reason: text,
  alternative: text,
});
export const anatomyPartSchema = z.strictObject({ part: text, role: text });
export const slotDefinitionSchema = z.strictObject({
  name: text,
  description: text,
  allowedComponents: strings.optional(),
});
export const propDefinitionSchema = z.strictObject({
  name: text,
  type: text,
  required: z.boolean(),
  default: z.string().optional(),
  description: text,
});
export const componentExampleSchema = z.strictObject({
  name: text,
  description: text,
  code: text,
});
export const evidenceResultSchema = z.enum([
  'passed',
  'failed',
  'not-assessed',
]);
export const evidenceActorSchema = z.enum(['person', 'agent']);
export const manualEvidenceSchema = z.strictObject({
  result: evidenceResultSchema,
  by: evidenceActorSchema.optional(),
  method: text.optional(),
});
export const accessibilityEvidenceSchema = z.strictObject({
  automated: evidenceResultSchema,
  manualKeyboard: manualEvidenceSchema,
  manualScreenReader: manualEvidenceSchema,
  date: dateSchema,
  version: text,
  limitations: strings,
});
export const distributionSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('angular'),
    entryPoint: z.string().regex(/^(\.|\.\/patterns\/[a-z][a-z0-9-]*)$/),
    exportName: text,
  }),
  z.strictObject({ kind: z.literal('styles') }),
  z.strictObject({ kind: z.literal('local') }),
]);

/** Canonical metadata shape. TypeScript types and JSON Schema are derived from it. */
export const componentMetadataSchema = z.strictObject({
  component: z.strictObject({
    id: componentIdSchema,
    name: text,
    category: z.enum(['atoms', 'molecules', 'organisms', 'templates']),
    description: text,
    type: z.enum([
      'interactive',
      'display',
      'container',
      'input',
      'navigation',
      'feedback',
    ]),
    path: text,
    primeNgComponent: text.optional(),
    bemBlock: text,
    itcssLayer: z.enum(['05-objects', '06-components']),
    scssPath: text.optional(),
    figmaUrl: z.url().optional(),
    created: dateSchema,
    modified: dateSchema,
  }),
  distribution: distributionSchema,
  governance: componentGovernanceSchema,
  usage: z.strictObject({
    useCases: strings,
    commonPatterns: z.array(componentPatternSchema),
    antiPatterns: z.array(antiPatternSchema),
  }),
  anatomy: z.array(anatomyPartSchema).optional(),
  variants: z
    .record(
      text,
      z.strictObject({
        options: strings,
        default: text,
        purpose: z.record(text, text),
      }),
    )
    .optional(),
  composition: z
    .strictObject({
      slots: z.array(slotDefinitionSchema).optional(),
      parentConstraints: strings.optional(),
      companions: strings.optional(),
      nestedComponents: strings.optional(),
    })
    .optional(),
  behavior: z
    .strictObject({
      states: strings,
      interactions: strings.optional(),
      responsive: strings.optional(),
    })
    .optional(),
  props: z.array(propDefinitionSchema).optional(),
  accessibility: z.strictObject({
    role: text.optional(),
    ariaAttributes: strings.optional(),
    keyboardSupport: strings.optional(),
    wcagLevel: z.enum(['A', 'AA', 'AAA']),
    contrastRequirements: strings.optional(),
    evidence: accessibilityEvidenceSchema.optional(),
  }),
  tokens: z.strictObject({
    consumed: strings,
    primeNgMappings: z.record(text, text).optional(),
  }),
  aiHints: z.strictObject({
    priority: z.enum(['high', 'medium', 'low']),
    context: text,
    selectionCriteria: z.record(text, text),
    keywords: strings,
  }),
  examples: z.array(componentExampleSchema),
});
