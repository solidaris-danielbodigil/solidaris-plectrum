// Package versions for Storybook consumer pages come from package manifests.
// Source versions are never treated as evidence of registry publication:
// release-context.ts reads the recorded release instead.
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

/** Theme preset in the Storybook toolbar. Not the package version. */
export const PRESET_VERSION = 'v1';

export const REPO_CLONE =
  'https://github.com/solidaris-danielbodigil/solidaris-plectrum.git';

export const REPO_DIR = 'solidaris-plectrum';

export const ANGULAR_RANGE = uiPackage.peerDependencies['@angular/core'];
export const PRIMENG_RANGE = uiPackage.peerDependencies.primeng;
export const PRIMEUIX_RANGE =
  plectrumPackage.peerDependencies['@primeuix/themes'];

/** npm pack drops the @: @solidaris-danielbodigil/pds-ui → solidaris-danielbodigil-pds-ui-2.0.1.tgz */
export function tarballName(packageName: string, version = PACKAGE_VERSION): string {
  return `${packageName.replace(/^@/, '').replace('/', '-')}-${version}.tgz`;
}

export const TARBALL_INSTALL = `npm install \\\n${RELEASE_PACKAGES.map((pkg) => `  ./path/to/${tarballName(pkg.name, pkg.version)} \\\n`).join('')}  primeng @primeuix/themes`;
