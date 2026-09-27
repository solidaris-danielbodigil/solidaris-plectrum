import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
function run(cwd: string, args: string[]) {
  try {
    return execFileSync(process.execPath, args, {
      cwd,
      encoding: 'utf8',
      timeout: 180_000,
      stdio: 'pipe',
      env: { ...process.env, NG_CLI_ANALYTICS: 'false' },
    });
  } catch (error) {
    const failed = error as { stdout?: string; stderr?: string };
    throw new Error(`${args.join(' ')}\n${failed.stdout}\n${failed.stderr}`);
  }
}

test(
  'scaffold → metadata registry → docs/contracts → built tarball exports in an isolated checkout',
  { timeout: 240_000 },
  async () => {
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'plectrum-p1-'));
    // Only this test-created absolute directory is removed. Keep dependencies outside it.
    try {
      for (const file of [
        'package.json',
        'angular.json',
        'tsconfig.json',
        'tsconfig.base.json',
        '.ai/contracts',
        '.ai/rules',
        '.ai/skills',
        'tools/contracts',
        'tools/devkit',
        'tools/generators',
        'tools/scripts',
        'libs/ui',
        'libs/styles',
        'libs/plectrum',
      ]) {
        fs.cpSync(path.join(root, file), path.join(fixture, file), {
          recursive: true,
        });
      }
      fs.symlinkSync(
        path.join(root, 'node_modules'),
        path.join(fixture, 'node_modules'),
        process.platform === 'win32' ? 'junction' : 'dir',
      );
      const cli = [
        '--import',
        'tsx',
        'tools/generators/sds-component/index.ts',
      ];
      assert.throws(
        () => run(fixture, [...cli, '--name=invalid-owner', '--owner=unknown']),
        /Unknown owner/,
      );
      assert.equal(
        fs.existsSync(path.join(fixture, 'libs/ui/src/lib/invalid-owner')),
        false,
      );
      for (const [name, owner] of [
        ['pipeline-core', 'design-system'],
        ['pipeline-candidate', 'iged'],
      ]) {
        run(fixture, [...cli, `--name=${name}`, `--owner=${owner}`]);
        const metadata = path.join(
          fixture,
          `libs/ui/src/lib/${name}/${name}.metadata.ts`,
        );
        assert.throws(
          () => run(fixture, ['--import', 'tsx', 'tools/contracts/check.ts']),
          /TODO/,
        );
        fs.writeFileSync(
          metadata,
          fs
            .readFileSync(metadata, 'utf8')
            .replaceAll(/TODO: [^"\n]+/g, 'Fixture reviewed content.'),
        );
      }
      assert.throws(
        () =>
          run(fixture, [
            ...cli,
            '--name=pipeline-core',
            '--owner=design-system',
          ]),
        /already exists/,
      );
      run(fixture, ['--import', 'tsx', 'tools/contracts/generate.ts']);
      run(fixture, [
        '--import',
        'tsx',
        'tools/contracts/generate.ts',
        '--check',
      ]);
      run(fixture, ['--import', 'tsx', 'tools/contracts/check.ts']);
      run(fixture, [
        '--import',
        'tsx',
        'tools/scripts/check-metadata-props.ts',
      ]);
      run(fixture, ['--import', 'tsx', 'tools/scripts/check-docs-ssot.mjs']);
      run(fixture, [
        path.join(root, 'node_modules/typescript/bin/tsc'),
        '-p',
        'libs/ui/.storybook/tsconfig.json',
        '--noEmit',
      ]);
      const index = JSON.parse(
        fs.readFileSync(path.join(fixture, '.ai/contracts/index.json'), 'utf8'),
      );
      assert.equal(
        index.components['iged:pipeline-candidate'].status,
        'candidate',
      );
      assert.equal(index.components['iged:pipeline-candidate'].package, null);
      assert.equal(
        index.components['iged:pipeline-candidate'].scssPath,
        'libs/styles/candidates/06-components/_components.pipeline-candidate.scss',
      );
      assert.doesNotMatch(
        fs.readFileSync(
          path.join(
            fixture,
            'libs/styles/src/06-components/_components.core.scss',
          ),
          'utf8',
        ),
        /pipeline-candidate/,
      );
      assert.equal(
        index.components['plectrum:pipeline-core'].package.exportName,
        'PipelineCoreComponent',
      );
      const registry = fs.readFileSync(
        path.join(fixture, 'libs/ui/src/storybook/component-metadata.ts'),
        'utf8',
      );
      assert.match(registry, /PipelineCoreMetadata/);
      assert.match(registry, /PipelineCandidateMetadata/);
      const { compile } = await import('@mdx-js/mdx');
      await compile(
        fs.readFileSync(
          path.join(fixture, 'libs/ui/src/lib/pipeline-core/pipeline-core.mdx'),
        ),
      );
      run(fixture, [
        path.join(root, 'node_modules/@angular/cli/bin/ng.js'),
        'build',
        'ui',
      ]);
      const npm = process.env['npm_execpath'];
      assert.ok(
        npm,
        'Run through npm run test:pipelines so the npm CLI location is known',
      );
      const packed = JSON.parse(
        run(path.join(fixture, 'dist/libs/ui'), [
          npm,
          'pack',
          '--json',
          '--ignore-scripts',
          '--cache',
          path.join(fixture, '.npm-cache'),
          '--pack-destination',
          fixture,
        ]),
      )[0];
      assert.ok(
        packed.files.some((f: { path: string }) =>
          f.path.includes('patterns-ishare'),
        ),
      );
      const packedStyles = JSON.parse(
        run(path.join(fixture, 'libs/styles'), [
          npm,
          'pack',
          '--json',
          '--ignore-scripts',
          '--cache',
          path.join(fixture, '.npm-cache'),
          '--pack-destination',
          fixture,
        ]),
      )[0];
      assert.ok(
        !packedStyles.files.some(
          (f: { path: string }) =>
            f.path.includes('pipeline-candidate') ||
            f.path.includes('storybook-candidates'),
        ),
      );
      const consumer = path.join(fixture, 'consumer');
      const installed = path.join(consumer, 'node_modules/@solidaris-danielbodigil/ui');
      fs.mkdirSync(installed, { recursive: true });
      execFileSync('tar', [
        '-xzf',
        path.join(fixture, packed.filename),
        '--strip-components=1',
        '-C',
        installed,
      ]);
      const probe = `import { PipelineCoreComponent } from '@solidaris-danielbodigil/ui';
import { DelayPredictionCardComponent, TransactionsCicsModalComponent } from '@solidaris-danielbodigil/ui/patterns/ishare';
// @ts-expect-error candidates are local, never a public core export
import { PipelineCandidateComponent } from '@solidaris-danielbodigil/ui';
// @ts-expect-error application patterns are absent from the core entry
import { DelayPredictionCardComponent as WrongEntry } from '@solidaris-danielbodigil/ui';
export const components = [PipelineCoreComponent, DelayPredictionCardComponent, TransactionsCicsModalComponent];
`;
      fs.writeFileSync(path.join(consumer, 'probe.ts'), probe);
      run(consumer, [
        path.join(root, 'node_modules/typescript/bin/tsc'),
        '--noEmit',
        '--skipLibCheck',
        '--target',
        'es2022',
        '--module',
        'esnext',
        '--moduleResolution',
        'bundler',
        'probe.ts',
      ]);
      const coreBarrel = path.join(
        fixture,
        'libs/ui/src/lib/pipeline-core/index.ts',
      );
      const originalBarrel = fs.readFileSync(coreBarrel, 'utf8');
      fs.appendFileSync(coreBarrel, "export * from '../pipeline-candidate';\n");
      assert.throws(
        () => run(fixture, ['--import', 'tsx', 'tools/contracts/generate.ts']),
        /boundary violation/,
      );
      fs.writeFileSync(coreBarrel, originalBarrel);
      const candidateFile = path.join(
        fixture,
        'libs/ui/src/lib/pipeline-candidate/pipeline-candidate.metadata.ts',
      );
      const originalCandidate = fs.readFileSync(candidateFile, 'utf8');
      fs.writeFileSync(
        candidateFile,
        originalCandidate.replace(
          'iged:pipeline-candidate',
          'plectrum:pipeline-core',
        ),
      );
      assert.throws(
        () => run(fixture, ['--import', 'tsx', 'tools/contracts/generate.ts']),
        /Duplicate/,
      );
      fs.writeFileSync(candidateFile, originalCandidate);
      // A stale generated registry must fail, including an uncommitted/missing file.
      fs.appendFileSync(
        path.join(fixture, 'libs/ui/src/storybook/component-metadata.ts'),
        '// drift\n',
      );
      assert.throws(
        () =>
          run(fixture, [
            '--import',
            'tsx',
            'tools/contracts/generate.ts',
            '--check',
          ]),
        /stale/,
      );
    } finally {
      const absolute = path.resolve(fixture);
      if (
        path.dirname(absolute) !== path.resolve(os.tmpdir()) ||
        !path.basename(absolute).startsWith('plectrum-p1-')
      )
        throw new Error('Unsafe fixture cleanup');
      // Remove the junction first so recursive cleanup cannot traverse the shared node_modules.
      fs.rmSync(path.join(absolute, 'node_modules'), {
        force: true,
        recursive: true,
      });
      fs.rmSync(absolute, { recursive: true, force: true });
    }
  },
);
