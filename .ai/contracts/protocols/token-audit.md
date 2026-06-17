# Token Audit Protocol

## When to Run

- After any change to `01-settings/` files
- Before merging PRs that touch design tokens
- Weekly automated drift check (CI/CD)

## Audit Steps

### 1. Prefix Compliance

```
Scan all SCSS in libs/styles/ for:
- Hardcoded --pds- without #{$pds-prefix} → ERROR
- Direct use of primitive tokens in 06-components/ → WARNING
- Missing @use 'settings.prefix' as * in files emitting tokens → ERROR
```

### 2. Semantic Coverage

```
For each primitive token used in components:
- Does a semantic alias exist? → If not, FLAG for creation
- Is the semantic token documented? → If not, FLAG
```

### 3. PrimeNG Sync

```
For each --p-* override in the codebase:
- Does it reference an --pds-* semantic token? → If hardcoded value, ERROR
- Is the mapping documented in component .metadata.ts? → If not, WARNING
```

### 4. Figma Drift

```
Compare Figma variable export against token files:
- New Figma variables without code equivalent → FLAG for implementation
- Code tokens without Figma equivalent → FLAG for review (may be component-level)
- Value mismatches → FLAG for resolution
```

### 5. Accessibility

```
For all --pds-color-text-* and --pds-color-surface-* pairs:
- Compute contrast ratio
- Flag any pair below 4.5:1 (AA normal text)
- Flag any pair below 3:1 (AA large text / UI)
```

## Output Format

```
TOKEN AUDIT REPORT — {date}
═══════════════════════════
Prefix compliance:  {pass/fail} ({n} issues)
Semantic coverage:  {n}% ({m} primitives used directly)
PrimeNG sync:       {pass/fail} ({n} hardcoded overrides)
Figma drift:        {n} new | {m} missing | {k} mismatched
Accessibility:      {pass/fail} ({n} contrast failures)

ISSUES:
- [ERROR] {file}:{line} — {description}
- [WARNING] {file}:{line} — {description}
```
