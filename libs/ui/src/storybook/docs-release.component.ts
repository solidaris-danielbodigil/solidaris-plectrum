// =============================================================================
// libs/ui/src/storybook/docs-release.component.ts
// Which documentation the reader is on, and how to install what it describes.
// State comes from the recorded release (./release.json beside a versioned
// build), never from manifest versions: a development preview says so.
//
// PrimeNG components used:
//   - p-message — release (success) or development preview (warn)
//
// Styles: c-docs-callout* and c-docs-contract__code in
// libs/styles/src/06-components/_components.docs-figures.scss.
// =============================================================================

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Message } from 'primeng/message';
import toolkitPackage from '../../../../tools/devkit/package.json';
import { DocsLinkComponent } from './docs-link.component';
import { NPMRC, REGISTRY_INSTALL, REGISTRY_LOGIN } from './process-docs';
import { DOCS_LINKS, loadReleaseContext, type ReleaseContext } from './release-context';
import { PACKAGE_VERSION, PRESET_VERSION } from './release-state';

@Component({
  selector: 'pds-docs-release',
  imports: [Message, DocsLinkComponent],
  templateUrl: './docs-release.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'c-docs-callout o-layout o-layout--block o-layout--margin-block-3' },
})
export class DocsReleaseComponent {
  /** `summary`: which docs these are. `install`: the install commands that match them. */
  readonly mode = input<'summary' | 'install'>('summary');
  /** Tests and stories may pass a context; otherwise ./release.json decides. */
  readonly context = input<ReleaseContext>();

  private readonly loaded = signal<ReleaseContext | null>(null);
  protected readonly state = computed(() => this.context() ?? this.loaded());
  protected readonly links = DOCS_LINKS;
  protected readonly runtime = PACKAGE_VERSION;
  protected readonly toolkit = toolkitPackage.version;
  protected readonly preset = PRESET_VERSION;
  protected readonly npmrc = NPMRC;
  protected readonly login = REGISTRY_LOGIN;
  protected readonly registryInstall = REGISTRY_INSTALL;

  constructor() {
    void loadReleaseContext().then((context) => this.loaded.set(context));
  }

  protected shortRevision(revision: string): string {
    return revision.slice(0, 7);
  }

  protected publishedOn(iso: string): string {
    return iso.slice(0, 10);
  }
}
