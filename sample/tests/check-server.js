import { readFileSync } from 'node:fs';
import { ORIGIN } from './variants.js';

// Another worktree's server may already hold port 4173, and reuseExistingServer would test that copy.
export default async function checkServer() {
  const local = readFileSync(new URL('../starter/index.html', import.meta.url), 'utf8');
  const served = await (await fetch(`${ORIGIN}/starter/index.html`)).text();
  if (served !== local) {
    throw new Error(`${ORIGIN} is serving a different checkout. Stop that server, then rerun.`);
  }
}
