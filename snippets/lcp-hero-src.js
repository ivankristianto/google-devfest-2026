async function showHero() {
  const response = await fetch(FEATURED_URL);
  const featured = await response.json();
  await wait(FEATURED_DELAY_MS);
  heroImage.alt = featured.hero.alt;
  heroImage.src =
      new URL(featured.hero.src, response.url).href;
}
