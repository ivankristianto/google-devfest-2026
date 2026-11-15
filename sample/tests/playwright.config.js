// Runs against starter by default. SAMPLE_VARIANT=lcp, a comma list, or "all" targets reference copies.
import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { VARIANTS, ORIGIN } from './variants.js';

const requested = (process.env.SAMPLE_VARIANT || 'starter').split(',').map((v) => v.trim());
const selected = requested.includes('all') ? Object.keys(VARIANTS) : requested;
for (const v of selected) {
  if (!VARIANTS[v]) throw new Error(`Unknown SAMPLE_VARIANT "${v}". Use one of: ${Object.keys(VARIANTS).join(', ')}, all`);
}

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.js',
  globalSetup: './check-server.js',
  reporter: 'list',
  outputDir: './.results',
  use: { viewport: { width: 1280, height: 800 } },
  projects: selected.map((name) => ({ name, use: { baseURL: ORIGIN + VARIANTS[name] } })),
  webServer: {
    command: 'npm run sample:serve',
    url: `${ORIGIN}/starter/`,
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    reuseExistingServer: true,
  },
});
