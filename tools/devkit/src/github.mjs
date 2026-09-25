import { format, hash } from './common.mjs';

export function githubRepository(url) {
  const parsed = new URL(url);
  if (parsed.hostname !== 'github.com') throw new Error(`Candidate PR transport needs a github.com repository: ${url}`);
  const parts = parsed.pathname.replace(/^\/+|\/+$/g, '').replace(/\.git$/, '').split('/');
  if (parts.length !== 2 || !parts.every((part) => /^[A-Za-z0-9_.-]+$/.test(part))) throw new Error(`Invalid GitHub repository URL: ${url}`);
  return { owner: parts[0], name: parts[1], fullName: `${parts[0]}/${parts[1]}` };
}

export class GitHubClient {
  constructor(token, fetchImpl = fetch, api = 'https://api.github.com') {
    this.token = token;
    this.fetchImpl = fetchImpl;
    this.api = api;
  }

  async request(method, endpoint, body, allowed = [200, 201]) {
    const response = await this.fetchImpl(`${this.api}${endpoint}`, {
      method,
      headers: {
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        ...(this.token ? { authorization: `Bearer ${this.token}` } : {}),
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    let payload;
    try { payload = await response.json(); } catch { payload = null; }
    if (!allowed.includes(response.status)) throw new Error(`GitHub ${method} ${endpoint}: HTTP ${response.status} ${payload?.message ?? ''}`);
    return { status: response.status, data: payload };
  }

  async content(repository, relative, ref = 'main') {
    const encoded = relative.split('/').map(encodeURIComponent).join('/');
    const { status, data } = await this.request('GET', `/repos/${repository}/contents/${encoded}?ref=${encodeURIComponent(ref)}`, undefined, [200, 404]);
    if (status === 404) return null;
    if (data?.type !== 'file' || data.encoding !== 'base64') throw new Error(`GitHub content is not a base64 file: ${relative}`);
    return { sha: data.sha, value: JSON.parse(Buffer.from(data.content.replaceAll('\n', ''), 'base64').toString('utf8')) };
  }

  async proposal(repository, id) {
    if (!/^[a-z][a-z0-9-]*$/.test(id)) throw new Error('Invalid proposal ID.');
    const record = await this.content(repository, `.ai/candidates/proposals/${id}.json`);
    if (!record) throw new Error(`Proposal ${id} is not merged in ${repository}/main.`);
    return record.value;
  }

  async submitPullRequest(repositoryUrl, submission) {
    if (!this.token) throw new Error('Set GH_TOKEN or GITHUB_TOKEN to open a reviewed candidate pull request.');
    const upstream = githubRepository(repositoryUrl);
    const me = (await this.request('GET', '/user')).data.login;
    if (!/^[A-Za-z0-9-]+$/.test(me)) throw new Error('Could not determine authenticated GitHub login.');
    const forkName = `${me}/${upstream.name}`;
    if (forkName.toLowerCase() !== upstream.fullName.toLowerCase()) {
      const existing = await this.request('GET', `/repos/${forkName}`, undefined, [200, 404]);
      if (existing.status === 404) await this.request('POST', `/repos/${upstream.fullName}/forks`, {} , [201, 202]);
      let fork;
      for (let attempt = 0; attempt < 12; attempt++) {
        const result = await this.request('GET', `/repos/${forkName}`, undefined, [200, 404]);
        if (result.status === 200) { fork = result.data; break; }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (!fork || fork.parent?.full_name?.toLowerCase() !== upstream.fullName.toLowerCase()) throw new Error(`Fork ${forkName} unavailable or not a fork of ${upstream.fullName}. Ask a maintainer if forking is disabled.`);
    }
    const base = 'main';
    const branch = `plectrum/candidate/${submission.id}/${hash(format(submission)).slice(0, 12)}`;
    const query = encodeURIComponent(`${me}:${branch}`);
    const pulls = (await this.request('GET', `/repos/${upstream.fullName}/pulls?state=all&head=${query}`)).data;
    const previous = pulls.find((pull) => pull.head?.ref === branch);
    if (previous?.merged_at) return previous.html_url;
    const existingBranch = await this.request('GET', `/repos/${forkName}/git/ref/heads/${branch}`, undefined, [200, 404]);
    if (existingBranch.status === 404) {
      const ref = (await this.request('GET', `/repos/${upstream.fullName}/git/ref/heads/${base}`)).data;
      await this.request('POST', `/repos/${forkName}/git/refs`, { ref: `refs/heads/${branch}`, sha: ref.object.sha });
    }
    const relative = `.ai/candidates/submissions/${submission.id}.json`;
    const existingContent = await this.content(forkName, relative, branch);
    if (JSON.stringify(existingContent?.value) !== JSON.stringify(submission)) {
      await this.request('PUT', `/repos/${forkName}/contents/${relative}`, {
        message: `candidate(${submission.id}): ${submission.operation}`,
        branch,
        content: Buffer.from(format(submission), 'utf8').toString('base64'),
        ...(existingContent ? { sha: existingContent.sha } : {}),
      }, [200, 201]);
    }
    if (previous?.state === 'open') return previous.html_url;
    if (previous?.state === 'closed') {
      const reopened = await this.request('PATCH', `/repos/${upstream.fullName}/pulls/${previous.number}`, { state: 'open' });
      return reopened.data.html_url;
    }
    const body = `Candidate ${submission.componentId}\n\nProposal: ${repositoryUrl}/blob/main/.ai/candidates/proposals/${submission.proposalId}.json\nSource: ${submission.origin.repository}/commit/${submission.origin.revision}\nPreview: ${submission.preview.url}\nChecks: ${submission.checks.url}\n\nOperation: ${submission.operation}. Metadata is JSON data only; central CI validates it and does not execute application source.`;
    const created = await this.request('POST', `/repos/${upstream.fullName}/pulls`, { title: `candidate(${submission.id}): ${submission.operation}`, head: `${me}:${branch}`, base, body, draft: false }, [201]);
    return created.data.html_url;
  }

  async submitAdoptionPullRequest(repositoryUrl, report) {
    if (!this.token) throw new Error('Set GH_TOKEN or GITHUB_TOKEN to open a reviewed adoption pull request.');
    const upstream = githubRepository(repositoryUrl);
    const me = (await this.request('GET', '/user')).data.login;
    if (!/^[A-Za-z0-9-]+$/.test(me)) throw new Error('Could not determine authenticated GitHub login.');
    const forkName = `${me}/${upstream.name}`;
    if (forkName.toLowerCase() !== upstream.fullName.toLowerCase()) {
      const existing = await this.request('GET', `/repos/${forkName}`, undefined, [200, 404]);
      if (existing.status === 404) await this.request('POST', `/repos/${upstream.fullName}/forks`, {}, [201, 202]);
      let fork;
      for (let attempt = 0; attempt < 12; attempt++) {
        const result = await this.request('GET', `/repos/${forkName}`, undefined, [200, 404]);
        if (result.status === 200) { fork = result.data; break; }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (!fork || fork.parent?.full_name?.toLowerCase() !== upstream.fullName.toLowerCase()) throw new Error(`Fork ${forkName} unavailable or not a fork of ${upstream.fullName}.`);
    }
    const branch = `plectrum/adoption/${report.application}/${hash(format(report)).slice(0, 12)}`;
    const query = encodeURIComponent(`${me}:${branch}`);
    const pulls = (await this.request('GET', `/repos/${upstream.fullName}/pulls?state=all&head=${query}`)).data;
    const previous = pulls.find((pull) => pull.head?.ref === branch);
    if (previous?.merged_at) return previous.html_url;
    const existingBranch = await this.request('GET', `/repos/${forkName}/git/ref/heads/${branch}`, undefined, [200, 404]);
    if (existingBranch.status === 404) {
      const ref = (await this.request('GET', `/repos/${upstream.fullName}/git/ref/heads/main`)).data;
      await this.request('POST', `/repos/${forkName}/git/refs`, { ref: `refs/heads/${branch}`, sha: ref.object.sha });
    }
    const relative = `.ai/adoption/${report.application}.json`;
    const existingContent = await this.content(forkName, relative, branch);
    if (JSON.stringify(existingContent?.value) !== JSON.stringify(report)) {
      await this.request('PUT', `/repos/${forkName}/contents/${relative}`, {
        message: `adoption(${report.application}): report ${report.observedAt}`,
        branch,
        content: Buffer.from(format(report), 'utf8').toString('base64'),
        ...(existingContent ? { sha: existingContent.sha } : {}),
      }, [200, 201]);
    }
    if (previous?.state === 'open') return previous.html_url;
    if (previous?.state === 'closed') return (await this.request('PATCH', `/repos/${upstream.fullName}/pulls/${previous.number}`, { state: 'open' })).data.html_url;
    const created = await this.request('POST', `/repos/${upstream.fullName}/pulls`, {
      title: `adoption(${report.application}): ${report.observedAt}`,
      head: `${me}:${branch}`,
      base: 'main',
      body: `Adoption report for ${report.application}\n\nSource: ${report.source.repository}/commit/${report.source.revision}\nObserved: ${report.observedAt}\nInstalled packages are listed separately from detected component usage.\n\nThis pull request changes only the adoption JSON. It does not publish a package.`,
    }, [201]);
    return created.data.html_url;
  }
}
