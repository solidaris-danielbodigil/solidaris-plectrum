---
'@solidaris-danielbodigil/pds-devkit': minor
---

Turn usage reporting on by default, and show its status in a generated `Plectrum/Setup` story and in `plectrum doctor`. New applications get `reporting.enabled: true`, and the generated CI workflow runs `plectrum adoption-submit` after each push to `main` with the `PLECTRUM_ADOPTION_TOKEN` secret. While the application is not in the Plectrum registry or no token is set, the submission is skipped with a GitHub Actions warning instead of failing the build. Existing `.plectrum/config.json` files keep their current value; set `reporting.enabled` to `false` to opt out.

Application agents now act as the team's first reviewer: before anything is built they check PrimeNG and the installed catalogue (use cases, anti-patterns, compositions), recommend reuse, answer layout and UX questions, and recommend sharing new UX early with the core team or a designer. They also know about local token files.
