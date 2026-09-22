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

export const RELEASE_SUMMARY = `The three packages are at ${PACKAGE_VERSION}. What's new lists that version under Released. npm publish is not switched on yet, so install packed tarballs of ${PACKAGE_VERSION}. The Preset toolbar (${PRESET_VERSION}) is the theme, not the package version.`;
