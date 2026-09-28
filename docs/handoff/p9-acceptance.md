# P9 acceptance record

Status: **in progress**, 28 September 2026. The test matrix in the [pipeline plan](../../.cursor/plans/plectrum-pipelines-toolkit-and-ssot.plan.md) is the acceptance contract. This record separates verified evidence from live work still needed. A local draft or simulated transport does not prove external adoption or design publication.

| Scenario | Evidence so far | Remaining live gate |
| --- | --- | --- |
| Clean consumer initialization | `pack-smoke` in [PR #38 CI](https://github.com/solidaris-danielbodigil/solidaris-plectrum/actions/runs/36413382243) packed and installed four packages in a throwaway Angular app outside the monorepo, built it and exercised the installed toolkit. [Release `2.0.2-devkit-0.2.1`](https://github.com/solidaris-danielbodigil/solidaris-plectrum/releases/tag/plectrum-v2.0.2-devkit-0.2.1) also passed registry installation. | Install with a real application repository and its own GitHub Packages read identity. |
| Consumer validation failure | Pack smoke exercises invalid token, missing required metadata, managed-file conflict and empty source scan. | Repeat against the chosen external application and record its CI output. |
| New component and metadata edit | P8 acceptance edits proved generated docs/catalogue changes from one metadata use case and registration without a manual count; central generation and `pack-smoke` exercise scaffolding. | Review a real candidate with a pinned commit and preview. |
| New application | P8 temporary registration proved team/application lists; local changes were reverted. | Register an actual external application and team in `registry.json`. |
| Candidate lifecycle | `ishare-temporary-probe` was submitted, revised and withdrawn in central PRs #14, #16 and #18. Pack smoke uses a local approved proposal and simulated transport. | Approved proposal, real external submission PR, Core review, integration, Figma return, release and replacement mapping. |
| External adoption | Pack smoke produces a report and simulates submission. Central `reportIngestionEnabled` is false. | Opt in from a registered external repository, merge two successive reviewed reports, prove old observations disappear and freshness/unknown states remain distinct. |
| Figma inbound | P5 plugin promotion and inbound checks are on `main`. | Run an attended invalid and valid export from the verified design file, retaining report/PR links. |
| Figma outbound and return | P6 contracts, branch/identity checks and return record validation are on `main`. | Obtain the `proposals/plectrum` branch URL and approved candidate, perform the attended change, capture design review/merge/publication and return export. |
| Process/toolkit update | P8 process-contract edit propagated to CLI help, managed agent guidance and Storybook; managed-file conflict was exercised. PR #38 has six required CI jobs green. | Merge #38, publish and install the resulting `pds-devkit@0.3.0` in an external app; check the installed-version docs. |
| Release | P7 private release and matching versioned Storybook/Pages are verified at `2.0.2-devkit-0.2.1`. | Publish the next version after the version PR is merged and its `main` CI is green. |
| Retry and recovery | Immutable archive retry and Pages pointer checks are covered by release scripts; [recovery guide](pipeline-recovery.md) records incident actions. | Retain a real failed/retried run and confirm the previous released docs remain accessible. |

## Migration ledger

- Stable component IDs and replacement links are defined by metadata and validated in candidate records. Existing iSHARE patterns live under the explicit `./patterns/ishare` secondary entry; the root export removal has a major changeset. Do not reassign IDs when moving an implementation into Core.
- The three current application entries (`ishare`, `icrm`, `iged`) are `local-demo` in `registry.json`. They are not evidence of a consuming team repository. Register the first external repository with its real team and immutable URL before enabling ingestion.
- Central historical candidate records for `ishare-temporary-probe` remain as a withdrawn audit trail, not as an active candidate. New live candidates need new approved proposal IDs.
- P8 replaced hand-copied editor agent text with generated Cursor and VS Code/Copilot adapters from `.ai/agents` and `process.json`. The installed toolkit writes managed adapters and preserves separate local notes. A real copied-folder user migration still needs an identified repository and before/after review.
- The older Storybook/knowledge-base [migration ledger](migration-ledger.md) remains a separate destination cutover: its receiving owner and target space are unresolved. Do not delete or mark moved pages on a guessed destination.

The acceptance owner should add immutable URLs and dates for each remaining live gate, then mark P9 complete only when all scenarios pass. Incident actions are in the [recovery guide](pipeline-recovery.md).
