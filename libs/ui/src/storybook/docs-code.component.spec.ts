import { TestBed } from '@angular/core/testing';
import { DocsCodeComponent } from './docs-code.component';

describe('copyable docs code block', () => {
  afterEach(() => vi.restoreAllMocks());

  async function render(code: string, label?: string) {
    await TestBed.configureTestingModule({ imports: [DocsCodeComponent] }).compileComponents();
    const fixture = TestBed.createComponent(DocsCodeComponent);
    fixture.componentRef.setInput('code', code);
    if (label) fixture.componentRef.setInput('label', label);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the code as a block and names its copy button', async () => {
    const el = await render('npm run pds:component -- --name=<name>', 'Copy scaffold command');
    expect(el.querySelector('pre code')?.textContent).toBe('npm run pds:component -- --name=<name>');
    const button = el.querySelector('button');
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.getAttribute('aria-label')).toBe('Copy scaffold command');
  });

  it('copies exactly the code that is shown', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    const el = await render('npx --no-install plectrum doctor [--live]');
    el.querySelector('button')!.click();
    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith('npx --no-install plectrum doctor [--live]');
    vi.unstubAllGlobals();
  });
});
