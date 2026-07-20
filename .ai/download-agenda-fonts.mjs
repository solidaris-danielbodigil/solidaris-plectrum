import fs from 'fs';
import path from 'path';
import { mkdir } from 'fs/promises';

const h = fs.readFileSync('c:/Projects/solidaris-nx/.ai/temp-fonts-page.html', 'utf8');

/** @type {{ name: string; weight: number; style: string; url: string }[]} */
const fonts = [
  {
    name: 'agenda-regular',
    weight: 400,
    style: 'normal',
    url:
      'https://use.typekit.net/af/0c0905/00000000000000003b9ae392/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3',
  },
  {
    name: 'agenda-italic',
    weight: 400,
    style: 'italic',
    url:
      'https://use.typekit.net/af/2dba1c/00000000000000003b9ae393/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3',
  },
  {
    name: 'agenda-semibold',
    weight: 600,
    style: 'normal',
    url:
      'https://use.typekit.net/af/5be660/00000000000000003b9ae397/27/l?subset_id=2&fvd=n6&v=3',
  },
  {
    name: 'agenda-bold',
    weight: 700,
    style: 'normal',
    url:
      'https://use.typekit.net/af/ab8655/00000000000000003b9ae398/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3',
  },
];

// Verify fvd from HTML when present
for (const f of fonts) {
  const needle = f.url.split('?')[0];
  if (!h.includes(needle.replace(/\//g, '\\/'))) {
    console.warn('URL path not found in styleguide HTML:', f.name);
  }
}

const outDir = 'c:/Projects/solidaris-nx/libs/assets/fonts/agenda';
await mkdir(outDir, { recursive: true });

for (const f of fonts) {
  const res = await fetch(f.url);
  if (!res.ok) {
    console.error(f.name, res.status, res.statusText);
    process.exitCode = 1;
    continue;
  }
  const ct = res.headers.get('content-type') ?? '';
  const ext = ct.includes('woff2') ? 'woff2' : ct.includes('woff') ? 'woff' : 'bin';
  const file = path.join(outDir, `${f.name}.${ext}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(file, buf);
  console.log('wrote', file, buf.length, 'bytes', ct);
}
