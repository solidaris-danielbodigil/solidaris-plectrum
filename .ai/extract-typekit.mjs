import fs from 'fs';
const h = fs.readFileSync('c:/Projects/solidaris-nx/.ai/temp-fonts-page.html', 'utf8');
const re = /https:\/\/use\.typekit\.net\/[^"\\]+/g;
const urls = new Set();
let m;
while ((m = re.exec(h))) {
  urls.add(m[0].replace(/\\u0026/g, '&').replace(/\\\//g, '/'));
}
console.log([...urls].join('\n'));
