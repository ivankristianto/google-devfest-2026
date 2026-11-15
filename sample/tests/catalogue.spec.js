import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { ORIGIN } from './variants.js';

const LINES = JSON.parse(readFileSync(new URL('../shared/transcript.json', import.meta.url), 'utf8'));
const matchingIds = (query) => {
  const q = query.toLowerCase();
  return LINES.filter((l) => l.text.toLowerCase().includes(q) || l.episode.toLowerCase().includes(q)).map((l) => String(l.id));
};
const countText = (n) => `${n.toLocaleString('id')} baris cocok`;

const rows = (page) => page.locator('#results > li');
const shownIds = (page) => page.$$eval('#results > li', (els) => els.map((el) => el.dataset.id));

async function openCatalogue(page) {
  await page.goto('./');
  await expect(page.locator('#search')).toBeEnabled();
}

test('hero image keeps its dimensions and loads', async ({ page }) => {
  await page.goto('./');
  const hero = page.locator('#hero-image');
  await expect(hero).toHaveAttribute('width', '1280');
  await expect(hero).toHaveAttribute('height', '720');
  await expect(hero).not.toHaveAttribute('loading', 'lazy');
  await expect.poll(() => hero.evaluate((img) => img.complete && img.naturalWidth), { timeout: 10_000 }).toBe(1280);
  expect(await hero.evaluate((img) => new URL(img.currentSrc).pathname)).toBe('/shared/images/hero-episode.jpg');
  await expect(hero).toHaveAttribute('alt', /\w/);
  const box = await hero.boundingBox();
  expect(Math.abs(box.width / box.height - 1280 / 720)).toBeLessThan(0.01);
});

test('a known query returns every match and the last one is reachable', async ({ page }) => {
  const expected = matchingIds('coding');
  await openCatalogue(page);
  await page.locator('#search').pressSequentially('coding');
  await expect(page.locator('#search-status')).toContainText(countText(expected.length));
  await expect(rows(page)).toHaveCount(expected.length, { timeout: 30_000 });
  expect(await shownIds(page)).toEqual(expected);
  const last = rows(page).last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
  await expect(last).toHaveAttribute('data-id', expected.at(-1));
});

test('a new query cancels the stale render', async ({ page }) => {
  const expected = matchingIds('server');
  // A fast machine finishes starter's string loop inside its 50 ms budget, so nothing goes stale.
  // Advancing performance.now() 1 ms per call makes that render yield, like it would on a slow device.
  await page.addInitScript(() => {
    const realNow = performance.now.bind(performance);
    let skew = 0;
    performance.now = () => realNow() + ++skew;
  });
  await openCatalogue(page);
  // The second query lands while the first render is paused at its first yield, in every variant.
  await page.evaluate(() => {
    const search = document.getElementById('search');
    for (const value of ['a', 'server']) {
      search.value = value;
      search.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await expect(page.locator('#search-status')).toContainText(countText(expected.length));
  await expect(rows(page)).toHaveCount(expected.length, { timeout: 30_000 });
  // A stale render that was not cancelled would keep writing rows after this point.
  await page.waitForTimeout(1500);
  expect(await shownIds(page)).toEqual(expected);
});

test('the announcement appears above the content without any input', async ({ page }) => {
  await page.goto('./');
  const notice = page.locator('.announcement');
  await expect(notice).toBeVisible({ timeout: 10_000 });
  await expect(notice).toContainText('Episode baru setiap Selasa malam');
  const noticeBox = await notice.boundingBox();
  const heroBox = await page.locator('#hero-image').boundingBox();
  expect(noticeBox.y + noticeBox.height).toBeLessThanOrEqual(heroBox.y);
});

test('search works with the keyboard alone', async ({ page }) => {
  const expected = matchingIds('deno');
  await openCatalogue(page);
  for (let i = 0; i < 20; i++) {
    if (await page.locator('#search').evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(page.locator('#search')).toBeFocused();
  await page.keyboard.type('deno');
  await expect(page.locator('#search-status')).toContainText(countText(expected.length));
  await expect(rows(page)).toHaveCount(expected.length, { timeout: 30_000 });
  const url = page.url();
  await page.keyboard.press('Enter');
  expect(page.url()).toBe(url);
  await expect(rows(page)).toHaveCount(expected.length);
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Backspace');
  await expect(rows(page)).toHaveCount(0);
  await expect(page.locator('#search-status')).toContainText('Ketik kata atau judul episode');
});

test('every request stays on the local server', async ({ page }) => {
  const foreign = [];
  page.on('request', (req) => {
    if (!req.url().startsWith(ORIGIN) && !req.url().startsWith('data:')) foreign.push(req.url());
  });
  await page.goto('./');
  await expect(page.locator('.announcement')).toBeVisible({ timeout: 10_000 });
  expect(foreign).toEqual([]);
});
