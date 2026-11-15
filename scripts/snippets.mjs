// Cuts slide excerpts out of the sample into snippets/. Run after changing the sample:
// npm run slides:snippets. Excerpts are committed so the slides keep showing the
// original faults after the live agent edits sample/starter/ during the workshop.
// Options: `omit` replaces matching lines with one elision marker per run, and
// `wrap` breaks a long line before `at`, indenting the rest so it fits a slide column.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SNIPPETS = [
  {
    out: 'lcp-hero-src.js', file: 'sample/starter/app.js', from: 'async function showHero', to: 'heroImage.src =', close: '}',
    wrap: [{ line: 'heroImage.src = new URL', at: 'new URL(' }],
  },
  { out: 'lcp-hero-markup.html', file: 'sample/starter/index.html', from: '<img id="hero-image"', to: '<img id="hero-image"' },
  { out: 'inp-render.js', file: 'sample/starter/app.js', from: "let html = '';", to: 'results.innerHTML = html;' },
  {
    out: 'inp-batch-loop.js', file: 'sample/reference/inp/app.js', from: 'for (let start = 0;', to: 'if (token !== renderToken) return;', close: '}',
    wrap: [{ line: 'for (let start = 0;', at: 'start += BATCH_SIZE' }, { line: 'const html = matches.slice(', at: '.map(lineCard)' }],
  },
  { out: 'cls-insert.js', file: 'sample/starter/app.js', from: "const notice = document.createElement('aside');", to: "notice.className = 'announcement';", gap: true, tail: "document.querySelector('main').before(notice);" },
  {
    out: 'cls-styles.css', file: 'sample/starter/styles.css', from: '.announcement {', to: 'border-block:', close: '}',
    omit: ['display:', 'gap:', 'align-items:', 'background:', 'border-block:'],
  },
];

const ELISION = { js: '// …', css: '/* … */', html: '<!-- … -->' };

function lineOf(lines, needle, after = 0) {
  const i = lines.findIndex((line, n) => n >= after && line.includes(needle));
  if (i === -1) throw new Error(`"${needle}" not found`);
  return i;
}

function omitLines(lines, needles, marker) {
  const out = [];
  for (const line of lines) {
    if (!needles.some((n) => line.includes(n))) { out.push(line); continue; }
    const mark = `${line.match(/^ */)[0]}${marker}`;
    if (out.at(-1) !== mark) out.push(mark);
  }
  return out;
}

function wrapLines(lines, wraps) {
  return lines.flatMap((line) => {
    const w = wraps.find((x) => line.includes(x.line));
    if (!w) return [line];
    const at = line.indexOf(w.at);
    if (at === -1) throw new Error(`"${w.at}" not found in wrapped line`);
    const indent = line.match(/^ */)[0];
    return [line.slice(0, at).trimEnd(), `${indent}    ${line.slice(at)}`];
  });
}

function dedent(lines) {
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(indent));
}

mkdirSync('snippets', { recursive: true });
for (const s of SNIPPETS) {
  const lines = readFileSync(s.file, 'utf8').split('\n');
  const start = lineOf(lines, s.from);
  const end = lineOf(lines, s.to, start);
  const marker = ELISION[s.out.split('.').pop()];
  let picked = lines.slice(start, end + 1);
  const indent = lines[start].match(/^ */)[0];
  if (s.gap) picked.push(`${indent}${marker}`, lines[lineOf(lines, s.tail, end)]);
  if (s.close) picked.push(`${indent}${s.close}`);
  if (s.omit) picked = omitLines(picked, s.omit, marker);
  if (s.wrap) picked = wrapLines(picked, s.wrap);
  writeFileSync(`snippets/${s.out}`, `${dedent(picked).join('\n')}\n`);
  console.log(`snippets/${s.out} (${picked.length} lines) from ${s.file}`);
}
