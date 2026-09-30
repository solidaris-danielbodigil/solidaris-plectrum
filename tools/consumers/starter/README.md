# Plectrum application starter

Copy this folder into a new repository. Set `plectrum.team`, `plectrum.application` and `plectrum.repository` in `package.json` before running `npm install`. Configure developer access to the Solidaris GitHub Packages registry outside this repository; `.npmrc` contains only the registry URL. Grant the new GitHub repository read access to the private packages so its generated workflow can install them with `GITHUB_TOKEN`. `npm install` runs the application-owned `postinstall` to generate ITCSS, Storybook, `.ai` guidance, Git hook and CI. Commit those generated files and the lockfile. If npm scripts are disabled, run `npm run pds:bootstrap` afterward.

Run `npm start`, `npm run pds:storybook`, `npm run pds:test:unit`, `npm run pds:test:stories`, `npm run pds:build-storybook` and `npm run pds:check:ci` to verify the application. A local component starts with `npm run pds:component -- --name my-component` and does not wait for Core approval. Both test runners use Chromium; run `npx playwright install chromium` once locally (CI installs it in its job).

This source starter targets the next `pds-devkit@0.4.0` release. Until it is published, use local tarballs for validation. The first package install also requires a reachable private registry and authorized credentials, which files in this starter cannot provision.
