# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Material for a one-hour Google DevFest Online workshop, "Measure, guide, fix: Core Web Vitals with an AI agent". One repo holds a Slidev deck and a small vanilla-JS copy of the Ngobrolin WEB podcast site (latest episode, episode grid, transcript search) that the audience repairs live with Antigravity (Gemini 4 Hydrogen) and Modern Web Guidance. The catalogue has three deliberate faults, one per metric, worked in the order LCP, INP, CLS. Each case runs Plan, human review, Exec, then a repeated measurement.

## Commands

One root package, exact-pinned versions, committed lockfile, Node >= 22.12.0. Run `npm ci` after cloning or creating a worktree, and `npx playwright install chromium` once per machine.

- `npm run sample:serve`: runs `scripts/serve-sample.mjs`, which serves `sample/` at http://127.0.0.1:4173 through sirv in dev mode. The root is an index page (`sample/index.html`), the starter is at `/starter/`, reference checkpoints under `/reference/`. The script redirects `/starter` to `/starter/` (307), because without the slash the relative `styles.css` and `app.js` URLs 404. Dev mode is required: without it sirv caches file sizes at startup, so edited files come back truncated and new files 404. Dev mode adds no hot reload, only `Cache-Control: no-store`, so every reload is a cold fetch.
- `npm run sample:test`: Playwright functional checks (`sample/tests/playwright.config.js`). One test: `npx playwright test --config sample/tests/playwright.config.js -g "<test name>"`.
- `npm run slides:dev`: Slidev at http://localhost:3030. `slides:build` and `slides:export` (PDF, via `playwright-chromium`) also exist.
- `npm run slides:snippets`: regenerates `snippets/` from the sample via `scripts/snippets.mjs`. Slides import those excerpts, never `sample/` directly, so they keep showing the original faults after the live agent edits the starter. Rerun after changing the sample, then re-export the code slides (14, 19, 21, 25) to check nothing clips. Never hand-edit `snippets/`.

Slidev and the sample run on separate ports; attendees fixing the sample never need the deck running. No dependency changes without a reason; the live session depends on these exact versions.

## Layout and boundaries

- `slides.md` is the Slidev entry. Root `index.html` is reserved by Slidev for head injections, so the sample must not live there. `public/` is deck assets only.
- `sample/starter/` is the audience's broken app and the only directory the workshop agent is allowed to edit.
- `sample/reference/` holds prepared fixes, one folder per case (`lcp/`, `inp/`, `cls/`) that fixes only that case and leaves the other two faults in place, plus `final/` with all three fixed. Per-case folders are how each fault is measured in isolation; `final/` is the end state. Keep it out of agent repair scope.
- Entry files the deck imports as snippets: `sample/starter/index.html`, `app.js`, `styles.css`. Renaming them breaks the slides.
- `sample/shared/` holds the deterministic dataset and local images used by both starter and reference.
- `sample/tests/` holds functional acceptance checks (all results still reachable, search cancellation, announcement still present). They guard correctness, not metric scores.
- `workshop/` holds attendee docs: `setup.md`, `prompts.md`, `measurement.md`.
- `evidence/` holds rehearsal traces and screenshots, scrubbed of personal paths, cookies, tokens and redemption codes.

Show real sample source in slides with Slidev snippet imports (`<<< @/sample/starter/app.js`) instead of copying code into the deck.

## Sample design constraints

The sample's search code is adapted from https://github.com/ivankristianto/mwg-longtasks-eval (MIT). Its content comes from the public Ngobrolin WEB site, https://github.com/ngobrolin/landing: 14 pinned episodes, 9,982 auto-generated transcript lines, episode thumbnails and host photos, built by `node sample/shared/tools/make-data.mjs <landing checkout> --images`. Keep the license and attribution in `sample/shared/ATTRIBUTION.md`. Interface copy is Indonesian; the demo query is "coding" (1,686 matches).

- No remote APIs, analytics, web fonts, service worker or user data. The only real content is the published podcast archive. Data must be deterministic, so the episode list is pinned in the build script and `transcript.json` is committed.
- Typing switches the page to a results view at the keystroke (`is-searching` on `body` hides the `.home` sections), so rows that render late shift nothing. Keep that, or the INP case starts producing CLS.
- Each fault must be measurable on its own (via the per-case reference folders, not runtime toggles in the starter), and fixing one must not change another.
- **LCP fault:** hero `src` assigned late from JavaScript, with correct dimensions from the start so it adds no CLS. Confirm the image really is the LCP element at the workshop viewport. Label any artificial delay as artificial.
- **INP fault:** expensive search result rendering. Every match must stay reachable (no silent capping), stale renders must still be cancelled. The teaching point is that a `scheduler.yield()` around cheap string building does not split the DOM insertion and layout cost.
- **CLS fault:** an announcement inserted automatically after first render, above visible content, with no reserved space. It must fire without user input, since recent input excludes shifts from CLS.
- Measure against `npm run sample:serve` (static, no hot reload), not the Slidev or any HMR dev server.

## Writing slides and docs

- Don't make up Antigravity commands, keyboard shortcuts, mode names, model IDs or redemption steps. The only documented ones in use are the Antigravity App's `/plan` then Proceed and model selector, the CLI's `agy --mode=plan` and Shift+Tab, and `agy plugin install https://github.com/GoogleChrome/modern-web-guidance`, which adds the guidance plugin to the user's Antigravity config (check with `agy plugin list`). Attendees also run `npx modern-web-guidance@latest install`, which adds the skill to `.agents/skills/` in the repo. Keep both (https://antigravity.google/docs/plan/, https://antigravity.google/docs/cli/modes/). Confirm them in rehearsal. Code redemption is handled by the organizer before the event and stays out of the deck.
- Don't invent Modern Web Guidance guide IDs. Known real ones: `break-up-long-tasks`, `optimize-image-priority`, `performance`. Check with `npx -y modern-web-guidance@latest search "<query>"`.
- Local DevTools traces are diagnostic only. Never present them as field Core Web Vitals, and never present TBT as INP.

## Background

`AGENTS.md` at the root holds the workshop agent's rules (Antigravity loads it on every turn, https://antigravity.google/docs/rules/). The prompts on the slides and in `workshop/prompts.md` stay short because of it, so keep its scope rules in sync with the boundaries above, and keep each slide prompt word for word identical to `workshop/prompts.md`.
