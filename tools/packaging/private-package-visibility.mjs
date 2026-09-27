// Verify actual GitHub Packages visibility, not the npm --access flag.
export function selectPackageVisibility(records, packageName) {
  const shortName = packageName.slice(packageName.indexOf('/') + 1);
  const record = records.find((item) => item.package_type === 'npm' && (item.name === packageName || item.name === shortName));
  return record?.visibility ?? null;
}

export async function readPackageVisibility(packageName, owner, token) {
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  for (let page = 1; ; page++) {
    const response = await fetch(`https://api.github.com/users/${owner}/packages?package_type=npm&per_page=100&page=${page}`, { headers });
    if (!response.ok) throw new Error(`GitHub package visibility lookup failed: HTTP ${response.status}.`);
    const batch = await response.json();
    const visibility = selectPackageVisibility(batch, packageName);
    if (visibility) return visibility;
    if (batch.length < 100) return null;
  }
}
