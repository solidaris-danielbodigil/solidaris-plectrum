// =============================================================================
// Component Metadata Schema — Solidaris/Plectrum Contract-Driven Development
//
// This TypeScript interface defines the contract for component metadata files.
// Every component in libs/ui MUST have a colocated .metadata.ts file conforming
// to this schema, plus Storybook stories and play tests (rules/03-storybook.md §5).
//
// Purpose:
//   - Machine-readable documentation for AI agents
//   - Queryable selection criteria and composition rules
//   - Governance enforcement (anti-patterns, accessibility)
//   - Drift detection between code and design intent
// =============================================================================

/**
 * How far a component may be reused.
 *
 *   core       — generic, owned by the design-system team, safe for every application
 *   candidate  — built for one application, flagged for promotion; the owning
 *                team keeps it until the core team moves it (see docs/component-promotion.md)
 *   app        — application-specific by design; documented here, not part of the
 *                design-system contract
 *   deprecated — scheduled for removal; `governance.note` names the replacement
 */
export type ComponentStatus = 'core' | 'candidate' | 'app' | 'deprecated';

/** Team accountable for the component. `design-system` is the core team. */
export type ComponentOwner = 'design-system' | 'ishare' | 'icrm';

export interface ComponentGovernance {
  status: ComponentStatus;
  owner: ComponentOwner;
  /** Required unless status is `core`: what has to happen next and why. */
  note?: string;
}

export interface ComponentMetadata {
  /** Identity and location */
  component: {
    name: string;
    /** atoms | molecules | organisms | templates */
    category: 'atoms' | 'molecules' | 'organisms' | 'templates';
    description: string;
    /** interactive | display | container | input | navigation | feedback */
    type: 'interactive' | 'display' | 'container' | 'input' | 'navigation' | 'feedback';
    /** Relative path from workspace root */
    path: string;
    /** PrimeNG component this wraps/extends, if any */
    primeNgComponent?: string;
    /** BEM block class */
    bemBlock: string;
    /** ITCSS layer where styles live */
    itcssLayer: '05-objects' | '06-components';
    /** SCSS file path */
    scssPath?: string;
    created: string; // ISO date
    modified: string; // ISO date
  };

  /**
   * Ownership and reuse scope. Rendered as the badge on the component's docs
   * page (pds-docs-status) and copied into .ai/contracts/index.json.
   */
  governance: ComponentGovernance;

  /** When and why to use this component */
  usage: {
    useCases: string[];
    commonPatterns: ComponentPattern[];
    antiPatterns: AntiPattern[];
  };

  /** Available variants and their purposes */
  variants?: {
    [propName: string]: {
      options: string[];
      default: string;
      purpose: Record<string, string>;
    };
  };

  /** Composition rules — what goes inside, what goes alongside */
  composition?: {
    /** Components that can be nested inside */
    slots?: SlotDefinition[];
    /** Typical parent components */
    parentConstraints?: string[];
    /** Components commonly used alongside */
    companions?: string[];
    /** Components nested inside this one */
    nestedComponents?: string[];
  };

  /** Behavioral states and interactions */
  behavior?: {
    states: string[];
    interactions?: string[];
    responsive?: string[];
  };

  /** Component inputs/props */
  props?: PropDefinition[];

  /** Accessibility contract */
  accessibility: {
    role?: string;
    ariaAttributes?: string[];
    keyboardSupport?: string[];
    wcagLevel: 'A' | 'AA' | 'AAA';
    contrastRequirements?: string[];
  };

  /** Design token dependencies */
  tokens: {
    /** Semantic tokens this component consumes */
    consumed: string[];
    /** PrimeNG --p-* variables mapped */
    primeNgMappings?: Record<string, string>;
  };

  /** AI agent selection hints */
  aiHints: {
    priority: 'high' | 'medium' | 'low';
    context: string;
    selectionCriteria: Record<string, string>;
    keywords: string[];
  };

  /** Copy-paste examples */
  examples: ComponentExample[];
}

export interface ComponentPattern {
  name: string;
  description: string;
  composition: string; // code snippet
}

export interface AntiPattern {
  scenario: string;
  reason: string;
  alternative: string;
}

export interface SlotDefinition {
  name: string;
  description: string;
  allowedComponents?: string[];
}

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface ComponentExample {
  name: string;
  description: string;
  code: string;
}
