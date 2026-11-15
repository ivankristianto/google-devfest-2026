// Serves sample/ like `sirv sample --dev`, plus a redirect for directory URLs missing the trailing slash.
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sirv from 'sirv';

const ROOT = resolve(fileURLToPath(new URL('../sample', import.meta.url)));
const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 4173);

// Same options the sirv CLI passes for `--dev`, so responses match the rehearsal evidence.
const serve = sirv(ROOT, { dev: true, gzip: true, brotli: true });

function directoryMissingSlash(pathname) {
  if (pathname.endsWith('/') || pathname.includes('//')) return false;
  let dir;
  try { dir = join(ROOT, decodeURIComponent(pathname)); } catch { return false; }
  return dir.startsWith(ROOT + sep) && existsSync(join(dir, 'index.html'));
}

const server = createServer((req, res) => {
  const started = process.hrtime.bigint();
  res.once('finish', () => {
    const ms = (Number(process.hrtime.bigint() - started) / 1e6).toFixed(2);
    console.log(`  [${new Date().toTimeString().slice(0, 8)}] ${res.statusCode} ─ ${ms}ms ─ ${req.url}`);
  });

  const [pathname, query] = req.url.split('?');
  if (directoryMissingSlash(pathname)) {
    // Without the slash, relative URLs like styles.css resolve one level up and 404. 307 because browsers cache 301.
    res.writeHead(307, { Location: `${pathname}/${query === undefined ? '' : `?${query}`}`, 'Cache-Control': 'no-store' });
    res.end();
    return;
  }
  serve(req, res);
});

server.on('error', (err) => {
  console.error(err.code === 'EADDRINUSE' ? `Port ${PORT} is in use. Stop the other server first.` : err);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Sample: http://${HOST}:${PORT}/\n  Starter: http://${HOST}:${PORT}/starter/\n`);
});
