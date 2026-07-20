import fs from 'fs';
const h = fs.readFileSync('c:/Projects/solidaris-nx/.ai/temp-fonts-page.html', 'utf8');
const key = 'customFonts';
const start = h.indexOf(key);
if (start < 0) {
  console.error('customFonts not found');
  process.exit(1);
}
const colon = h.indexOf(':', start);
let i = colon + 1;
while (h[i] === ' ') i++;
if (h[i] !== '[') {
  console.error('expected [ at', i, h.slice(i, i + 20));
  process.exit(1);
}
let depth = 0;
let inStr = false;
let esc = false;
const begin = i;
for (; i < h.length; i++) {
  const c = h[i];
  if (inStr) {
    if (esc) esc = false;
    else if (c === '\\') esc = true;
    else if (c === '"') inStr = false;
    continue;
  }
  if (c === '"') inStr = true;
  else if (c === '[') depth++;
  else if (c === ']') {
    depth--;
    if (depth === 0) {
      const raw = h.slice(begin, i + 1);
      const json = JSON.parse(raw.replace(/\\u0026/g, '&'));
      console.log(JSON.stringify(json, null, 2));
      process.exit(0);
    }
  }
}
console.error('unterminated array');
process.exit(1);
