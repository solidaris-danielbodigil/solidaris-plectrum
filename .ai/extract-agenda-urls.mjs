import fs from 'fs';
const h = fs.readFileSync('c:/Projects/solidaris-nx/.ai/temp-fonts-page.html', 'utf8');
const re =
  /\\"name\\":\\"(Agenda[^\\"]*)\\",\\"type\\":\\"url\\",\\"url\\":\\"(https:[^\\]+)\\"/g;
let m;
const fonts = [];
while ((m = re.exec(h))) {
  fonts.push({
    name: m[1],
    url: m[2].replace(/\\u0026/g, '&'),
  });
}
console.log(JSON.stringify(fonts, null, 2));
