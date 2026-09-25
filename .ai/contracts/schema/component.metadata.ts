// Type-only contract. Edit component.schema.ts; JSON Schema is generated from it.
import type { z } from 'zod';
import type * as schema from './component.schema';

export type ComponentOwner = string;
export type ComponentMetadata = z.infer<typeof schema.componentMetadataSchema>;
export type ComponentGovernance = z.infer<
  typeof schema.componentGovernanceSchema
>;
export type ComponentStatus = z.infer<typeof schema.componentStatusSchema>;
export type ComponentPattern = z.infer<typeof schema.componentPatternSchema>;
export type AntiPattern = z.infer<typeof schema.antiPatternSchema>;
export type AnatomyPart = z.infer<typeof schema.anatomyPartSchema>;
export type SlotDefinition = z.infer<typeof schema.slotDefinitionSchema>;
export type PropDefinition = z.infer<typeof schema.propDefinitionSchema>;
export type ComponentExample = z.infer<typeof schema.componentExampleSchema>;
export type EvidenceResult = z.infer<typeof schema.evidenceResultSchema>;
export type EvidenceActor = z.infer<typeof schema.evidenceActorSchema>;
export type ManualEvidence = z.infer<typeof schema.manualEvidenceSchema>;
export type AccessibilityEvidence = z.infer<
  typeof schema.accessibilityEvidenceSchema
>;
