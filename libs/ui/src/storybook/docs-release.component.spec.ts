import { TestBed } from '@angular/core/testing';
import { DocsReleaseComponent } from './docs-release.component';
import { DOCS_LINKS, releaseContextFrom } from './release-context';
import { DISTRIBUTED_PACKAGES, REGISTRY } from './process-docs';
import { PACKAGE_VERSION } from './release-state';
import toolkitPackage from '../../../../tools/devkit/package.json';

describe('release installation guidance', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 404 }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  async function render(context: ReturnType<typeof releaseContextFrom>) {
    await TestBed.configureTestingModule({ imports: [DocsReleaseComponent] }).compileComponents();
    const fixture = TestBed.createComponent(DocsReleaseComponent);
    fixture.componentRef.setInput('mode', 'install');
    fixture.componentRef.setInput('context', context);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('lets application teams copy all package names and find the published guide', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    const el = await render({ kind: 'development', reason: 'no-release-record' });
    const firstLink = el.querySelector('a');
    expect(firstLink?.getAttribute('href')).toBe(DOCS_LINKS.latestInstall);
    expect(firstLink?.textContent).toContain('Open the installation guide of the latest release');
    const copy = Array.from(el.querySelectorAll('button')).find((button) => button.textContent?.includes('Copy all package names'));
    expect(copy).toBeDefined();
    copy!.click();
    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith(DISTRIBUTED_PACKAGES.map((pkg) => pkg.name).join(' '));
    expect(el.textContent).not.toContain('./path/to/');
    expect(el.querySelector('details')).toBeNull();
  });

  it('keeps exact registry install commands for a matching recorded release', async () => {
    const documentation = DOCS_LINKS.release(PACKAGE_VERSION, toolkitPackage.version);
    const context = releaseContextFrom({
      schemaVersion: 1,
      version: PACKAGE_VERSION,
      revision: 'a'.repeat(40),
      publishedAt: '2026-09-28T10:00:00.000Z',
      registry: REGISTRY.operations.registry,
      documentation,
      packages: DISTRIBUTED_PACKAGES.map(({ name, version }) => ({ name, version, integrity: `sha512-${'A'.repeat(86)}==` })),
      contracts: { url: `${documentation}contracts.json`, sha256: 'b'.repeat(64), schemaVersion: 1, version: PACKAGE_VERSION },
      toolkit: { toolkitVersion: toolkitPackage.version, status: 'verified' },
    });
    expect(context.kind).toBe('release');
    const el = await render(context);
    for (const pkg of DISTRIBUTED_PACKAGES) expect(el.textContent).toContain(`${pkg.name}@${pkg.version}`);
    expect(el.textContent).toContain(REGISTRY.operations.registry);
    expect(el.textContent).not.toContain('development preview');
  });
});
