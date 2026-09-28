// Read the job and step list of .github/workflows/ci.yml for the maintainer docs.
// The workflow is the source; Storybook renders this extract instead of a copied table.
// Deliberately limited to the layout ci.yml uses (two-space jobs, `- name:` steps).

export interface CiStep {
  name: string;
  run: string | null;
  advisory: boolean;
  condition: string | null;
}

export interface CiJob {
  id: string;
  condition: string | null;
  steps: CiStep[];
}

const unquote = (value: string) => value.trim().replace(/^'(.*)'$/, '$1').replace(/^"(.*)"$/, '$1');

export function ciJobs(workflow: string): CiJob[] {
  const lines = workflow.replaceAll('\r\n', '\n').split('\n');
  const start = lines.findIndex((line) => line === 'jobs:');
  if (start < 0) throw new Error('ci.yml has no top-level jobs: block');
  const jobs: CiJob[] = [];
  let job: CiJob | null = null;
  let step: CiStep | null = null;
  let block = false;
  for (const line of lines.slice(start + 1)) {
    if (block && step && /^ {10}\S/.test(line)) {
      // Keep the repository commands of a multi-line block; shell glue is summarized.
      const command = line.trim();
      if (/^(npm|npx|node) /.test(command)) step.run = step.run && step.run !== 'inline shell script' ? `${step.run} && ${command}` : command;
      else step.run ??= 'inline shell script';
      continue;
    }
    block = false;
    const jobMatch = /^ {2}([a-z][a-z0-9-]*):\s*$/.exec(line);
    if (jobMatch) {
      job = { id: jobMatch[1], condition: null, steps: [] };
      jobs.push(job);
      step = null;
      continue;
    }
    if (!job) continue;
    const jobIf = /^ {4}if: (.+)$/.exec(line);
    if (jobIf) job.condition = unquote(jobIf[1]);
    const stepMatch = /^ {6}- (?:name|uses): (.+)$/.exec(line);
    if (stepMatch) {
      step = { name: unquote(stepMatch[1]), run: null, advisory: false, condition: null };
      if (line.includes('- name:')) job.steps.push(step);
      continue;
    }
    if (!step) continue;
    const run = /^ {8}run: (.+)$/.exec(line);
    if (run) {
      if (run[1].trim() === '|') block = true;
      else step.run = unquote(run[1]);
    }
    if (/^ {8}continue-on-error: true\s*$/.test(line)) step.advisory = true;
    const stepIf = /^ {8}if: (.+)$/.exec(line);
    if (stepIf) step.condition = unquote(stepIf[1]);
  }
  if (!jobs.length) throw new Error('ci.yml declares no jobs');
  return jobs;
}
