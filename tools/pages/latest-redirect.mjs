/** Preserve Storybook's manager route and section when following the latest alias. */
export function latestRedirectHtml(id) {
  if (!/^\d+\.\d+\.\d+-devkit-\d+\.\d+\.\d+$/.test(id)) throw new Error('Invalid release ID');
  const target = `../releases/${id}/`;
  return `<!doctype html><meta charset="utf-8"><title>Plectrum latest release</title>
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
<noscript><meta http-equiv="refresh" content="0; url=${target}"></noscript>
<a href="${target}">Plectrum ${id}</a>\n`;
}
