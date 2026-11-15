// Lab measurement of the three faults for every variant. Diagnostic only, never field Core Web Vitals.
// Usage: node sample/tests/measure.mjs [--runs 5] [--variants starter,lcp,inp,cls,final] [--out evidence/measurements]
import { chromium } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { VARIANTS as VARIANT_PATHS, ORIGIN } from './variants.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const VIEWPORT = { width: 1280, height: 800 };
const MOBILE = { width: 390, height: 844 };
const CPU_RATE = 4;
const QUERY = 'coding';
const KEY_INTERVAL_MS = 120;
// DevTools' "Slow 4G" preset (bytes per second, ms). The LCP case is measured with it.
const SLOW_4G = { latency: 562.5, downloadThroughput: 180000, uploadThroughput: 84375 };
const SCENARIOS = ['load', 'slow4g', 'mobile', 'interaction'];

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []));
const RUNS = Number(args.runs || 5);
const VARIANTS = (args.variants || Object.keys(VARIANT_PATHS).join(',')).split(',');
const OUT = resolve(ROOT, args.out || 'evidence/measurements');
const ONLY = args.only ? args.only.split(',') : SCENARIOS;
const pathOf = (v) => VARIANT_PATHS[v] || `/reference/${v}/`;

const LINES = JSON.parse(readFileSync(resolve(ROOT, 'sample/shared/transcript.json'), 'utf8'));
const expectedCount = (q) => LINES.filter((l) => l.text.toLowerCase().includes(q) || l.episode.toLowerCase().includes(q)).length;

const median = (a) => {
  const s = a.filter((x) => typeof x === 'number').sort((x, y) => x - y);
  if (!s.length) return null;
  const h = s.length >> 1;
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
};
const round = (x, d = 0) => (typeof x === 'number' ? Number(x.toFixed(d)) : x);

async function ensureServer() {
  // Port 4173 may belong to another worktree's server, so check it serves this checkout.
  const local = readFileSync(resolve(ROOT, 'sample/starter/app.js'), 'utf8');
  const check = async () => {
    try { return (await (await fetch(`${ORIGIN}/starter/app.js`)).text()) === local; } catch { return null; }
  };
  const first = await check();
  if (first === true) return () => {};
  if (first === false) throw new Error(`${ORIGIN} serves a different checkout. Stop that server first.`);
  const child = spawn(process.execPath, [resolve(ROOT, 'scripts/serve-sample.mjs')], { cwd: ROOT, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    if (await check()) return () => child.kill();
    await new Promise((r) => setTimeout(r, 200));
  }
  child.kill();
  throw new Error('sample server did not start');
}

const initScript = () => {
  const m = (window.__m = { lcp: [], shifts: [], events: [], mutations: [], keys: [], announcementAt: null });
  const describe = (node) => {
    if (!node || node.nodeType !== 1) return node ? node.nodeName : null;
    return node.tagName.toLowerCase() + (node.id ? '#' + node.id : '') + (node.className && typeof node.className === 'string' ? '.' + node.className.split(' ')[0] : '');
  };
  new PerformanceObserver((l) => l.getEntries().forEach((e) => m.lcp.push({
    t: e.startTime, size: e.size, el: describe(e.element), url: e.url ? e.url.split('/').pop() : '', loadTime: e.loadTime, renderTime: e.renderTime,
  }))).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => l.getEntries().forEach((e) => m.shifts.push({
    t: e.startTime, value: e.value, hadRecentInput: e.hadRecentInput,
    sources: e.sources.map((s) => ({ node: describe(s.node), from: Math.round(s.previousRect.y), to: Math.round(s.currentRect.y) })),
  }))).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => l.getEntries().forEach((e) => {
    if (e.interactionId) m.events.push({ id: e.interactionId, name: e.name, t: e.startTime, d: e.duration, ps: e.processingStart, pe: e.processingEnd });
  })).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  addEventListener('keydown', () => m.keys.push(performance.now()), true);
  new MutationObserver((list) => {
    for (const r of list) {
      if (r.target.id === 'results') m.mutations.push(performance.now());
      for (const n of r.addedNodes) if (n.nodeType === 1 && n.matches('.announcement, .announcement *')) m.announcementAt ??= performance.now();
    }
  }).observe(document, { childList: true, subtree: true });
};

async function newPage(browser, viewport, network) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.addInitScript(initScript);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_RATE });
  if (network) await cdp.send('Network.emulateNetworkConditions', { offline: false, ...network });
  const requests = [];
  cdp.on('Network.requestWillBeSent', (e) => requests.push({ url: e.request.url.split('/').pop(), priority: e.request.initialPriority, ts: e.timestamp }));
  return { context, page, cdp, requests };
}

async function settleLoad(page) {
  await page.waitForFunction(() => {
    const img = document.getElementById('hero-image');
    return window.__m.announcementAt !== null && img && img.complete && img.naturalWidth > 0;
  }, null, { timeout: 60000 });
  await page.waitForTimeout(1500);
}

async function loadRun(browser, url, viewport, network) {
  const { context, page, requests } = await newPage(browser, viewport, network);
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await settleLoad(page);
  const data = await page.evaluate(() => {
    const hero = document.getElementById('hero-image');
    const res = performance.getEntriesByType('resource').find((r) => r.name === hero.currentSrc);
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    const notice = document.querySelector('.announcement');
    return {
      m: window.__m,
      fcp: fcp && fcp.startTime,
      heroRequestStart: res && res.startTime,
      heroResponseEnd: res && res.responseEnd,
      heroRect: hero.getBoundingClientRect().toJSON(),
      announcementHeight: notice && notice.getBoundingClientRect().height,
    };
  });
  await context.close();
  const lcp = data.m.lcp.at(-1) || {};
  const heroReq = requests.find((r) => r.url === 'hero-episode.jpg');
  const doc = requests[0];
  const counted = data.m.shifts.filter((s) => !s.hadRecentInput);
  return {
    lcpMs: round(lcp.t), lcpElement: lcp.el, lcpUrl: lcp.url, lcpSize: lcp.size,
    fcpMs: round(data.fcp),
    heroRequestStartMs: round(data.heroRequestStart),
    heroResponseEndMs: round(data.heroResponseEnd),
    heroRequestAfterDocMs: heroReq && doc ? round((heroReq.ts - doc.ts) * 1000) : null,
    heroInitialPriority: heroReq && heroReq.priority,
    heroRendered: { w: round(data.heroRect.width), h: round(data.heroRect.height) },
    announcementAtMs: round(data.m.announcementAt),
    announcementHeight: round(data.announcementHeight),
    cls: round(counted.reduce((a, s) => a + s.value, 0), 4),
    shifts: data.m.shifts.map((s) => ({ t: round(s.t), value: round(s.value, 4), hadRecentInput: s.hadRecentInput, sources: s.sources.slice(0, 3) })),
  };
}

const SCRIPT = new Set(['FunctionCall', 'EvaluateScript', 'EventDispatch', 'TimerFire', 'RunMicrotasks', 'v8.compile', 'v8.run', 'v8.callFunction', 'V8.Execute', 'v8.evaluateModule', 'FireAnimationFrame', 'v8.produceCache', 'V8.GC_MC_BACKGROUND_MARKING']);
const bucket = (name) => {
  if (name === 'ParseHTML') return 'parseHTML';
  if (name === 'UpdateLayoutTree' || name === 'RecalculateStyles' || name === 'ScheduleStyleRecalculation') return 'style';
  if (name === 'Layout') return 'layout';
  if (['Paint', 'PrePaint', 'Layerize', 'Commit', 'UpdateLayer', 'CompositeLayers', 'PaintImage', 'RasterTask'].includes(name)) return 'paint';
  if (/GC|Scavenge|MarkCompact/i.test(name)) return 'gc';
  if (SCRIPT.has(name) || name.startsWith('v8.') || name.startsWith('V8.')) return 'script';
  return 'other';
};

function analyseTrace(buffer, windowStartTs, windowEndTs) {
  const { traceEvents } = JSON.parse(buffer.toString('utf8'));
  const threads = traceEvents.filter((e) => e.ph === 'M' && e.name === 'thread_name' && e.args.name === 'CrRendererMain');
  const byThread = new Map();
  for (const e of traceEvents) {
    if (e.ph !== 'X' || !e.dur) continue;
    if (!threads.some((t) => t.pid === e.pid && t.tid === e.tid)) continue;
    const key = `${e.pid}:${e.tid}`;
    if (!byThread.has(key)) byThread.set(key, []);
    byThread.get(key).push(e);
  }
  const events = [...byThread.values()].sort((a, b) => b.length - a.length)[0] || [];
  const keyEvents = events.filter((e) => e.name === 'EventDispatch' && e.args && e.args.data && e.args.data.type === 'keydown').sort((a, b) => a.ts - b.ts);
  const start = windowStartTs ?? (keyEvents[0] && keyEvents[0].ts);
  const inWindow = events.filter((e) => e.ts >= start - 1000 && (windowEndTs == null || e.ts <= windowEndTs)).sort((a, b) => a.ts - b.ts || b.dur - a.dur);
  const selfOf = new Map();
  const taskOf = new Map();
  const tops = [];
  const stack = [];
  for (const e of inWindow) {
    while (stack.length && stack.at(-1).ts + stack.at(-1).dur <= e.ts) stack.pop();
    selfOf.set(e, e.dur);
    if (stack.length) {
      selfOf.set(stack.at(-1), selfOf.get(stack.at(-1)) - e.dur);
      taskOf.set(e, taskOf.get(stack[0]));
    } else {
      taskOf.set(e, e);
      tops.push(e);
    }
    stack.push(e);
  }
  const totals = {};
  const perTask = new Map();
  for (const e of inWindow) {
    const b = bucket(e.name);
    const self = selfOf.get(e) / 1000;
    if (b === 'other' && /RunTask/.test(e.name)) continue;
    totals[b] = (totals[b] || 0) + self;
    const t = taskOf.get(e);
    if (!perTask.has(t)) perTask.set(t, {});
    const pt = perTask.get(t);
    pt[b] = (pt[b] || 0) + self;
  }
  const longTasks = tops.filter((e) => e.dur >= 50000).map((e) => ({
    ms: round(e.dur / 1000),
    ...Object.fromEntries(Object.entries(perTask.get(e) || {}).map(([k, v]) => [k, round(v)])),
  }));
  longTasks.sort((a, b) => b.ms - a.ms);
  // How many HTML insertions land before the browser lays them out: more than one means batches pile up into one frame.
  let parses = 0;
  let maxParsesPerLayout = 0;
  for (const e of inWindow) {
    if (e.name === 'ParseHTML') parses++;
    if (e.name === 'Layout') { maxParsesPerLayout = Math.max(maxParsesPerLayout, parses); parses = 0; }
  }
  return {
    maxParsesPerLayout,
    totalsMs: Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, round(v)])),
    longTaskCount: longTasks.length,
    longestTasks: longTasks.slice(0, 3),
  };
}

async function interactionRun(browser, url) {
  const { context, page, cdp } = await newPage(browser, VIEWPORT);
  await page.goto(url, { waitUntil: 'load' });
  await settleLoad(page);
  await page.waitForFunction(() => !document.getElementById('search').disabled);
  await page.focus('#search');
  await browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'v8.execute', 'blink.user_timing'] });
  const sends = [...QUERY].map((c, i) => new Promise((ok) => setTimeout(async () => {
    const base = { key: c, code: 'Key' + c.toUpperCase(), windowsVirtualKeyCode: c.toUpperCase().charCodeAt(0) };
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', text: c, unmodifiedText: c, ...base });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
    ok();
  }, i * KEY_INTERVAL_MS)));
  await Promise.all(sends);
  const expected = expectedCount(QUERY);
  await page.waitForFunction((n) => {
    const m = window.__m;
    const last = m.mutations.at(-1) ?? 0;
    return document.querySelectorAll('#results > li').length === n && performance.now() - last > 1000;
  }, expected, { timeout: 120000, polling: 100 });
  await page.waitForTimeout(300);
  const trace = await browser.stopTracing();
  const data = await page.evaluate(() => ({ m: window.__m, status: document.getElementById('search-status').textContent, shown: document.querySelectorAll('#results > li').length }));
  await context.close();

  const byId = new Map();
  for (const e of data.m.events) {
    const cur = byId.get(e.id);
    if (!cur || e.d > cur.d) byId.set(e.id, e);
  }
  const interactions = [...byId.values()].sort((a, b) => a.t - b.t).map((e) => ({
    name: e.name, durationMs: e.d, inputDelayMs: round(e.ps - e.t), processingMs: round(e.pe - e.ps), presentationMs: round(e.t + e.d - e.pe),
  }));
  const worst = interactions.reduce((a, b) => (b.durationMs > (a ? a.durationMs : -1) ? b : a), null);
  return {
    query: QUERY, expected, shown: data.shown, status: data.status,
    keysSeen: data.m.keys.length,
    interactionCount: interactions.length,
    worstInteractionMs: worst ? worst.durationMs : 0,
    worst,
    interactionsMs: interactions.map((i) => i.durationMs),
    // Rows that land long after the keystroke must not move anything: these would count toward CLS.
    lateShift: round(data.m.shifts.filter((s) => !s.hadRecentInput && s.t > data.m.keys[0]).reduce((a, s) => a + s.value, 0), 4),
    trace: analyseTrace(trace),
  };
}

function summarise(results) {
  const lines = [];
  const env = results.env;
  lines.push('# Fault measurements', '');
  lines.push(`Lab runs, not field data. Chromium ${env.browserVersion} (Playwright ${env.playwright}), headless, viewport ${VIEWPORT.width}x${VIEWPORT.height}, CPU throttled ${CPU_RATE}x, cache disabled, no network throttling except where a table says Slow 4G, served by \`npm run sample:serve\`. Sample commit ${env.commit}. ${RUNS} fresh visits per variant and scenario. Date ${env.date}.`, '');
  const fmt = (vals, d = 0) => `${vals.map((v) => round(v, d)).join(', ')} (median ${round(median(vals), d)})`;
  lines.push('## Load: LCP and hero discovery (no input)', '');
  lines.push('| Variant | LCP element | LCP ms | Hero request start ms | Hero priority | CLS (no input) |', '|---|---|---|---|---|---|');
  for (const v of VARIANTS) {
    const r = results.variants[v].load;
    lines.push(`| ${v} | ${[...new Set(r.map((x) => `${x.lcpElement} ${x.lcpUrl}`))].join('; ')} | ${fmt(r.map((x) => x.lcpMs))} | ${fmt(r.map((x) => x.heroRequestStartMs))} | ${[...new Set(r.map((x) => x.heroInitialPriority))].join(', ')} | ${fmt(r.map((x) => x.cls), 3)} |`);
  }
  lines.push('', '## Load under Slow 4G network throttling (no input)', '');
  lines.push(`DevTools Slow 4G preset: ${SLOW_4G.latency} ms latency, ${round(SLOW_4G.downloadThroughput * 8 / 1000)} kbit/s down. This is how the LCP case is measured in the workshop.`, '');
  lines.push('| Variant | LCP element | LCP ms | Hero request start ms |', '|---|---|---|---|');
  for (const v of VARIANTS) {
    const r = results.variants[v].slow4g;
    lines.push(`| ${v} | ${[...new Set(r.map((x) => `${x.lcpElement} ${x.lcpUrl}`))].join('; ')} | ${fmt(r.map((x) => x.lcpMs))} | ${fmt(r.map((x) => x.heroRequestStartMs))} |`);
  }
  lines.push('', `## CLS at a second width (${MOBILE.width}x${MOBILE.height}, no input)`, '');
  lines.push('| Variant | CLS |', '|---|---|');
  for (const v of VARIANTS) lines.push(`| ${v} | ${fmt(results.variants[v].mobile.map((x) => x.cls), 3)} |`);
  lines.push('', `## Interaction: typing "${QUERY}" at ${KEY_INTERVAL_MS} ms per key`, '');
  lines.push('| Variant | Worst interaction ms | Long tasks (>=50 ms) | Main-thread self time in window: script / parseHTML / style / layout / paint ms | Longest task ms (script / parseHTML / style / layout) |', '|---|---|---|---|---|');
  for (const v of VARIANTS) {
    const r = results.variants[v].interaction;
    const tot = (k) => median(r.map((x) => x.trace.totalsMs[k] || 0));
    const lt = r.map((x) => x.trace.longestTasks[0]).filter(Boolean);
    const ltDesc = lt.length ? `${round(median(lt.map((t) => t.ms)))} (${['script', 'parseHTML', 'style', 'layout'].map((k) => round(median(lt.map((t) => t[k] || 0)))).join(' / ')})` : 'none';
    lines.push(`| ${v} | ${fmt(r.map((x) => x.worstInteractionMs))} | ${fmt(r.map((x) => x.trace.longTaskCount))} | ${['script', 'parseHTML', 'style', 'layout', 'paint'].map((k) => round(tot(k))).join(' / ')} | ${ltDesc} |`);
  }
  lines.push('', 'Trace columns are medians across runs. Longest task breakdown is the median of each run\'s single longest task.', '');
  return lines.join('\n');
}

const stopServer = await ensureServer();
// Default is Playwright's new-headless full Chromium, which schedules frames like desktop Chrome; the headless shell does not.
const browser = await chromium.launch({ channel: args.channel || 'chromium' });
const results = {
  env: {
    browserVersion: browser.version(),
    channel: args.channel || 'chromium',
    playwright: JSON.parse(readFileSync(resolve(ROOT, 'node_modules/@playwright/test/package.json'), 'utf8')).version,
    commit: execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT }).toString().trim(),
    date: new Date().toISOString().slice(0, 10),
    viewport: VIEWPORT, mobile: MOBILE, cpuThrottle: CPU_RATE, slow4g: SLOW_4G, runs: RUNS, query: QUERY, keyIntervalMs: KEY_INTERVAL_MS,
  },
  variants: {},
};
try {
  for (const v of VARIANTS) {
    const url = ORIGIN + pathOf(v);
    const out = (results.variants[v] = { load: [], slow4g: [], mobile: [], interaction: [] });
    for (let i = 0; i < RUNS; i++) {
      if (ONLY.includes('load')) out.load.push(await loadRun(browser, url, VIEWPORT));
      if (ONLY.includes('slow4g')) out.slow4g.push(await loadRun(browser, url, VIEWPORT, SLOW_4G));
      if (ONLY.includes('mobile')) out.mobile.push(await loadRun(browser, url, MOBILE));
      if (ONLY.includes('interaction')) out.interaction.push(await interactionRun(browser, url));
      const l = out.load.at(-1) || {};
      const it = out.interaction.at(-1) || {};
      process.stdout.write(`${v} run ${i + 1}: LCP ${l.lcpMs} ms (${l.lcpElement}), Slow 4G LCP ${(out.slow4g.at(-1) || {}).lcpMs} ms, hero req ${l.heroRequestStartMs} ms, CLS ${l.cls}, mobile CLS ${(out.mobile.at(-1) || {}).cls}, worst interaction ${it.worstInteractionMs} ms ${JSON.stringify(it.interactionsMs)} max inserts per layout ${it.trace && it.trace.maxParsesPerLayout}, shift without input ${it.lateShift}\n`);
    }
  }
} finally {
  await browser.close();
  stopServer();
}
mkdirSync(OUT, { recursive: true });
writeFileSync(resolve(OUT, 'results.json'), JSON.stringify(results, null, 2) + '\n');
const full = SCENARIOS.every((x) => ONLY.includes(x));
if (full) writeFileSync(resolve(OUT, 'summary.md'), summarise(results));
console.log(`\nWrote ${resolve(OUT, full ? 'summary.md' : 'results.json').replace(ROOT + '/', '')}`);
