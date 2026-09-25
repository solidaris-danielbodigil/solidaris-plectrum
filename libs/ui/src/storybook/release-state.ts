// Package version and publication state for Storybook consumer pages.
// Versions come from the three package.json files. Publication is a fact about
// .github/workflows/release.yml: the version PR runs; npm publish stays off
// until NPM_TOKEN and registry access exist.
import plectrumPackage from '../../../plectrum/package.json';
import stylesPackage from '../../../styles/package.json';
import uiPackage from '../../package.json';

export const PACKAGE_VERSION = uiPackage.version;

export const RELEASE_PACKAGES = [
  { name: uiPackage.name, version: uiPackage.version },
  { name: plectrumPackage.name, version: plectrumPackage.version },
  { name: stylesPackage.name, version: stylesPackage.version },
] as const;

if (RELEASE_PACKAGES.some((pkg) => pkg.version !== PACKAGE_VERSION)) {
  throw new Error(
    `Plectrum packages must share one version. Got ${RELEASE_PACKAGES.map((pkg) => `${pkg.name}@${pkg.version}`).join(', ')}.`,
  );
}

/** npm publish is parked in release.yml. Consumers install packed tarballs. */
export const REGISTRY_PUBLISHED = false;

/**
 * The date `libs/ui/package.json` last changed — a proxy for when 1.0.0 shipped,
 * since the three packages version together. Refresh it after every version bump:
 *   git log -1 --format=%ad --date=short -- libs/ui/package.json
 */
export const RELEASE_DATE = '2026-09-14';

/** Theme preset in the Storybook toolbar. Not the package version. */
export const PRESET_VERSION = 'v1';

export const REPO_CLONE =
  'https://github.com/solidaris-danielbodigil/solidaris-plectrum.git';

export const REPO_DIR = 'solidaris-plectrum';

export const ANGULAR_RANGE = uiPackage.peerDependencies['@angular/core'];
export const PRIMENG_RANGE = uiPackage.peerDependencies.primeng;
export const PRIMEUIX_RANGE =
  plectrumPackage.peerDependencies['@primeuix/themes'];

/** npm pack drops the scope: @solidaris/ui → solidaris-ui-1.0.0.tgz */
export function tarballName(packageName: string, version = PACKAGE_VERSION): string {
  return `${packageName.replace(/^@/, '').replace('/', '-')}-${version}.tgz`;
}

export const TARBALL_INSTALL = `npm install \\
  ./path/to/${tarballName('@solidaris/ui')} \\
  ./path/to/${tarballName('@solidaris/plectrum')} \\
  ./path/to/${tarballName('@solidaris/styles')} \\
  primeng @primeuix/themes`;

export const RELEASE_SUMMARY = `The three runtime manifests declare ${PACKAGE_VERSION}; registry publishing is not enabled. Install packed tarballs until a verified release exists. The Preset toolbar (${PRESET_VERSION}) selects the theme, not the package version.`;
