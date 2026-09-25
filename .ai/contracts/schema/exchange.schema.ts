import { z } from 'zod';
import { componentIdSchema, componentMetadataSchema } from './component.schema';

const text = z.string().min(1);
const version = z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
const revision = z.string().regex(/^[0-9a-f]{40}$/);
const schemaVersion = z.literal(1);
const source = z.strictObject({ repository: z.url(), revision, path: text });
const reference = z.strictObject({ url: z.url(), revision });
export const registrySchema = z.strictObject({
  schemaVersion,
  repository: z.url(),
  teams: z.array(
    z.strictObject({
      id: z.string().regex(/^[a-z][a-z0-9-]*$/),
      label: text,
      kind: z.enum(['core', 'application']),
      reviewer: text.nullable(),
      alternateReviewers: z.array(text).optional(),
    }),
  ),
  applications: z.array(
    z.strictObject({
      id: text,
      team: text,
      label: text,
      path: text.optional(),
      repository: z.url(),
      kind: z.enum(['local-demo', 'external']),
    }),
  ),
  operations: z.strictObject({
    registry: z.url(),
    publicationScope: z.string().regex(/^@[a-z0-9-]+$/),
    visibility: z.enum(['private', 'public']),
    publicationEnabled: z.boolean(),
    reportTransport: z.literal('reviewed-pull-request'),
    reportIngestionEnabled: z.boolean(),
    editors: z.array(text),
    storybook: z.url(),
    figma: z.strictObject({
      componentLibrary: text,
      tokenLibrary: text,
      proposalCollectionPrefix: text,
      identitiesVerifiedForPublication: z.boolean(),
    }),
    pending: z.array(text),
  }),
});
export const candidateStateSchema = z.enum([
  'proposed',
  'approved',
  'implemented',
  'submitted',
  'accepted',
  'figma-reviewed',
  'released',
  'rejected',
  'withdrawn',
]);
export const candidateSchema = z.strictObject({
  schemaVersion,
  id: text,
  componentId: componentIdSchema,
  team: text,
  application: text,
  state: candidateStateSchema,
  origin: source,
  metadata: componentMetadataSchema,
  evidence: z.record(text, reference),
  history: z.array(
    z.strictObject({
      from: candidateStateSchema,
      to: candidateStateSchema,
      actor: text,
      role: z.enum(['team', 'core', 'designer', 'release']),
      at: z.iso.datetime(),
      evidence: z.array(text),
    }),
  ),
});
export const proposalDecisionSchema = z.enum([
  'approved-candidate',
  'use-existing',
  'app-specific',
  'rejected',
]);
export const proposalSchema = z.strictObject({
  schemaVersion,
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  componentId: componentIdSchema,
  team: text,
  application: text,
  issueUrl: z.url(),
  decision: proposalDecisionSchema,
  owner: text,
  decidedBy: text,
  decidedAt: z.iso.datetime(),
  decisionUrl: z.url(),
  note: text,
});
export const candidateSubmissionSchema = z.strictObject({
  schemaVersion,
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  proposalId: text,
  operation: z.enum(['submit', 'revise', 'withdraw']),
  componentId: componentIdSchema,
  team: text,
  application: text,
  origin: source,
  metadata: componentMetadataSchema,
  toolkitVersion: version,
  processVersion: version,
  packages: z.array(z.strictObject({ name: text, version })),
  preview: reference,
  checks: reference,
  submittedAt: z.iso.datetime(),
  withdrawalReason: text.optional(),
});
export const candidateReviewSchema = z.strictObject({
  schemaVersion,
  id: text,
  decision: z.enum(['accepted', 'rejected']),
  pullRequestUrl: z.url(),
  reviewedBy: text,
  reviewedAt: z.iso.datetime(),
  sourceRevision: revision,
  note: text,
});
export const candidatePromotionSchema = z.strictObject({
  schemaVersion,
  id: text,
  sourceComponentId: componentIdSchema,
  coreComponentId: componentIdSchema,
  integrationPullRequestUrl: z.url(),
  sourceRevision: revision,
  review: z.strictObject({
    api: reference,
    tokens: reference,
    dependencies: reference,
    i18n: reference,
    accessibility: reference,
    figma: reference,
  }),
});
export const adoptionReportSchema = z.strictObject({
  schemaVersion,
  application: text,
  team: text,
  source,
  observedAt: z.iso.datetime(),
  reporterVersion: version,
  packages: z.array(z.strictObject({ name: text, version })),
  observations: z.array(
    z.strictObject({
      componentId: componentIdSchema,
      kind: z.enum(['source-reference', 'runtime']),
      count: z.number().int().nonnegative(),
      files: z.array(text),
    }),
  ),
  limitations: z.array(text),
});
export const compatibilitySchema = z.strictObject({
  schemaVersion,
  toolkitVersion: version,
  dsVersionRange: text,
  contractSchemaRange: text,
  processVersionRange: text,
  editors: z.array(text),
  status: z.enum(['planned', 'verified']),
});
export const publishedContractSchema = z.strictObject({
  schemaVersion,
  version,
  repository: z.url(),
  revision,
  documentation: z.url(),
  components: z.array(
    z.strictObject({
      id: componentIdSchema,
      metadata: componentMetadataSchema,
      source,
      package: z.strictObject({
        name: text,
        version,
        importPath: text.optional(),
        exportName: text.optional(),
      }),
      docs: z.strictObject({ url: z.url(), sourcePath: text }),
    }),
  ),
});
export const releaseManifestSchema = z.strictObject({
  schemaVersion,
  version,
  revision,
  publishedAt: z.iso.datetime(),
  registry: z.url(),
  packages: z.array(z.strictObject({ name: text, version, integrity: text })),
  contracts: z.strictObject({
    url: z.url(),
    sha256: z.string().regex(/^[0-9a-f]{64}$/),
    schemaVersion,
    version,
  }),
  toolkit: compatibilitySchema,
  documentation: z.url(),
  figmaReturn: reference.optional(),
});
export const exchangeSchemas = {
  metadata: componentMetadataSchema,
  registry: registrySchema,
  candidate: candidateSchema,
  proposal: proposalSchema,
  submission: candidateSubmissionSchema,
  candidateReview: candidateReviewSchema,
  candidatePromotion: candidatePromotionSchema,
  adoption: adoptionReportSchema,
  compatibility: compatibilitySchema,
  contracts: publishedContractSchema,
  release: releaseManifestSchema,
};
export type Registry = z.infer<typeof registrySchema>;
export type Candidate = z.infer<typeof candidateSchema>;
