# Measure, guide, fix: Core Web Vitals with an AI agent

![Cover slide: Measure, guide, fix: Core Web Vitals with an AI agent. Ivan Kristianto, GDE Web Performance, DevFest Online, Wednesday 18 November 2026](docs/cover.png)

Welcome. This is the material from a one-hour hands-on workshop at Google DevFest Online on 18 November 2026, run by Ivan Kristianto (GDE, Web Performance).

You get a small copy of the [Ngobrolin WEB](https://github.com/ngobrolin/landing) podcast site with three performance problems built in. You fix each one with an AI agent ([Antigravity](https://antigravity.google/)) and [Modern Web Guidance](https://developer.chrome.com/blog/modern-web-guidance-v1), and you measure in Chrome DevTools before and after every change. The slides are in here too, and [online](https://talks.ivankristianto.com/google-devfest-2026/).

You can follow along live, or work through it on your own at any time.

## What you'll fix

| Case | What a visitor notices | What you learn |
|---|---|---|
| **LCP** | The main image shows up late | The browser can't download an image it hasn't been told about |
| **INP** | Typing in search feels stuck | Splitting work isn't enough; the browser also needs a chance to draw |
| **CLS** | An announcement pushes the page down | Save space for content that arrives later |

Every case runs the same loop:

1. **Measure:** record the problem in the DevTools Performance panel.
2. **Ask:** type `/plan` in Antigravity, then paste the case's prompt.
3. **Check:** read the plan. Does it fix what we measured? Does the page still work the same? Does it name the guide it used?
4. **Apply:** click Proceed and read the diff.
5. **Measure again:** same recording, fresh reload.

The INP case has a twist: the first fix follows the guide and the page is still slow. The second recording is what catches it.

## Get started

You need Node.js 22.12 or newer, Chrome, and the Antigravity App for the agent part. You also need its terminal command, `agy`, to install the guidance plugin.

```bash
git clone https://github.com/ivankristianto/google-devfest-2026.git
cd google-devfest-2026
npm ci
npx modern-web-guidance@latest install   # adds the guidance skill to .agents/skills/
agy plugin install https://github.com/GoogleChrome/modern-web-guidance   # adds the guidance to Antigravity, once per machine
npm run sample:serve
```

Open http://127.0.0.1:4173/starter/ in Chrome. That's the broken site you'll fix.

Then open the repo folder in Antigravity and follow [`workshop/prompts.md`](workshop/prompts.md). It has every prompt from the slides, word for word, and the measurement settings for each case. Two settings matter most:

- **CPU:** 4x slowdown in every case.
- **Network:** Slow 4G for the LCP case only. On localhost every request is instant, which hides the problem. Turn it off again for INP and CLS.

The agent reads [`AGENTS.md`](AGENTS.md) on every turn. It keeps the agent inside `sample/starter/`, asks for a plan before any edit, and makes it measure before and after. That's why the prompts can stay short.

### Stuck on a case?

Each case has a prepared fix you can open and measure:

| Case | Prepared fix |
|---|---|
| LCP | http://127.0.0.1:4173/reference/lcp/ |
| INP, first attempt | http://127.0.0.1:4173/reference/inp-yield-only/ |
| INP, working fix | http://127.0.0.1:4173/reference/inp/ |
| CLS | http://127.0.0.1:4173/reference/cls/ |
| All three | http://127.0.0.1:4173/reference/final/ |

Each folder fixes only its own case and leaves the other two problems in place, so you can measure one at a time.

### The slides

The deck is online at https://talks.ivankristianto.com/google-devfest-2026/ ([PDF](https://talks.ivankristianto.com/google-devfest-2026/slidev-exported.pdf)). To run it locally:

```bash
npm run slides:dev      # http://localhost:3030
npm run slides:export   # PDF; run `npx playwright install chromium` once first
```

The deck and the sample run on separate ports. You don't need the deck running to do the exercises.

## A note on numbers

Everything you measure on your laptop is a lab number. It's great for finding causes and comparing before with after. The Core Web Vitals score Google uses comes from real visitors' Chrome browsers, over the weeks after you ship. The practice-run numbers behind the slides, and how they were taken, are in [`evidence/measurements/`](evidence/measurements/).

## What's in here

| Path | What it is |
|---|---|
| `sample/starter/` | The broken site. The only folder the agent should edit. |
| `sample/reference/` | Prepared fixes, one folder per case, plus `final/` |
| `sample/shared/` | The podcast data and images both versions use |
| `sample/tests/` | Functional checks and the lab measurement script |
| `workshop/prompts.md` | Prompts and step-by-step instructions |
| `slides.md`, `theme/` | The Slidev deck and its DevFest theme |
| `snippets/` | Code excerpts shown on the slides, generated from the sample |
| `evidence/measurements/` | Lab measurements of every fault and fix |

## Contributing

Found a step that didn't work, a confusing slide, or a bug in the sample? [Open an issue](https://github.com/ivankristianto/google-devfest-2026/issues). Pull requests are welcome too.

Before you open a pull request:

1. Install the test browser once with `npx playwright install chromium`, then run `npm run sample:test`. These tests check the page still works: every search result is reachable, stale searches are cancelled, the announcement still shows.
2. If you change the sample, keep each fault on its own. A per-case folder in `sample/reference/` should fix only its case. Rerun `node sample/tests/measure.mjs` to check, and include the updated `evidence/measurements/`.
3. If you change the sample's code, run `npm run slides:snippets` so the slides pick it up. Don't edit `snippets/` by hand.
4. Prompts on the slides and in `workshop/prompts.md` must match word for word.
5. Versions are pinned and the lockfile is committed, so the live session runs the exact same tools. Please don't add or bump dependencies without a reason in the pull request.
6. Keep the sample offline: no remote APIs, analytics, web fonts or user data.

## Credits

- Site content, episode images and host photos come from the Ngobrolin WEB podcast ([ngobrolin/landing](https://github.com/ngobrolin/landing)).
- Parts of the search code are adapted from [mwg-longtasks-eval](https://github.com/ivankristianto/mwg-longtasks-eval) (MIT).
- The slide layouts follow the Google DevFest speaker template.

Details and the upstream license are in [`sample/shared/ATTRIBUTION.md`](sample/shared/ATTRIBUTION.md).

## License

The code, slides and workshop docs are released under the [MIT License](LICENSE). The Ngobrolin WEB content and images, and the DevFest and Google Developer Groups marks in `public/brand/`, belong to their owners and are not covered by it.
