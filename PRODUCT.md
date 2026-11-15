# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Slidev for the deck (`slides.md` at the repo root, Node >= 22.12.0). Plain static HTML, CSS and vanilla JS for the sample, a local copy of the Ngobrolin WEB podcast site, with search code adapted from https://github.com/ivankristianto/mwg-longtasks-eval (MIT). No framework in the sample, so each fault's browser work shows up directly in a Performance trace. Confirmed by Ivan.

## Users

Attendees of a one-hour Google DevFest Online workshop, at mixed skill levels: some have never opened the Performance panel, others ship frontend code daily. Ivan runs every step on the shared screen first and attendees repeat it on their own machines with Antigravity, Chrome DevTools and Modern Web Guidance. INP round 2 is presenter-led; attendees watch and can repeat it from the repo. The deck uses plain words, explains each metric and trace view the first time it appears, and keeps the same five-step loop and the same three plan checks in every case.

Ivan presents and drives the shared demo. After the event, the repository is a take-home for people who want to repeat the exercises alone.

## Product Purpose

Teach one debugging loop three times: reproduce a Core Web Vitals problem in DevTools, ask an AI agent for a plan backed by Modern Web Guidance, review that plan as humans, let the agent apply it, then repeat the same measurement. The three cases are LCP, INP and CLS, all required and worked in that order.

Success means an attendee can apply the loop to their own site and knows that a local trace is diagnostic evidence, not a field result.

## Positioning

The sample's faults are real and measurable, and the lesson includes the case where following guidance does not fix the bottleneck. Ivan's earlier experiment showed that adding `scheduler.yield()` around cheap string building left the expensive DOM work in one long task. The workshop treats agent output and guidance as proposals that a measurement has to confirm.

## Operating Context

- Three surfaces: the Slidev deck (screen-shared, 16:9), the sample site (opened locally by each attendee and measured), and the workshop docs in `workshop/` (setup, prompts, measurement).
- Each case runs Plan, then group review, then Exec, then a repeated trace under identical conditions (same viewport, CPU throttle, network preset, cache state, fresh visit).
- Slidev and the sample run on separate ports. Attendees repairing the sample never need the deck running.
- The sample is measured from a production-style static server, not an HMR dev server.
- Timing is tight: 60 minutes total, about 10 to 12 per case. Every case has a prepared checkpoint in `sample/reference/` in case a live agent run stalls.

## Capabilities and Constraints

- The sample is a local copy of the Ngobrolin WEB podcast site in Indonesian: latest episode, episode grid, topic shortcuts, panelists, an automatic announcement, and transcript search with a result count. It uses 9,982 transcript lines from 14 pinned episodes.
- Three independently switchable faults: a hero image whose `src` is set late from JavaScript (LCP), expensive search result rendering (INP), and an announcement inserted after first render with no reserved space (CLS).
- Fixes must keep every matching search result reachable, keep stale-render cancellation, keep the announcement, and keep hero content and dimensions.
- The sample has no remote APIs, analytics, web fonts, service worker or user data. Its only real content is the published podcast archive.
- Agent edits are limited to `sample/starter/`. Reference solutions, tests, slides and evidence are out of repair scope.
- Event: Wednesday 18 November 2026, online. Presenter: Ivan Kristianto, GDE Web Performance.
- Agent surface: Antigravity App (desktop) is the main surface; Antigravity CLI (`agy`) is the fallback. Documented controls as of 2026-11-13: `/plan` plus a goal, then Proceed, in the App; `agy --mode=plan` or Shift+Tab in the CLI. On a personal account the App's agent uses a built-in browser rather than Chrome DevTools MCP, so whether it can record performance traces is unverified.
- Code redemption is handled by the organizer before the event starts; the deck doesn't cover it.
- Repo: https://github.com/ivankristianto/google-devfest-2026 (must be public before the event).
- Throttling: CPU 4x slowdown in every case. Network Slow 4G for the LCP case only, because localhost hides the late image; INP and CLS run without network throttling (the 1.9 MB transcript would take about 11 s under Slow 4G).
- Undecided: whether Q&A counts inside the hour.

## Brand Commitments

The deck must follow the organizer's Google speaker template: https://docs.google.com/presentation/d/1SgexbAwG48vw9ROOdvmPVR4aA-lpu5o6YCuG8a9oXOM/edit. Binding points taken from it:

- 16:9 slides.
- Headlines in Google Sans Bold, subheads in Roboto Mono Light, body in Google Sans regular.
- Palette: Google Blue 500 `#4285f4`, Green 500 `#34a853`, Red 500 `#ea4335`, Yellow 500 `#fbbc04`; halftone blue `#57caff`, green `#5cdb6d`, red `#ff7daf`, yellow `#ffd427`; pastel blue `#c3ecf6`, green `#ccf6c5`, red `#f8d8d8`, yellow `#ffe7a5`; off-white `#f0f0f0`; Black 02 `#1e1e1e`.
- Its layout families: title slides with location, speaker name and role; numbered section titles; full-screen content; half-screen presenter slides where graphics stay left of the centerline; statements, big numbers, charts and device frames. Title and subhead line limits are set per layout.
- Every image added to the deck needs a source credit.
- The template's pink guidance slides and notes are removed from the final deck.

The template binds the deck only. The sample is a copy of a real podcast site that borrows the template's palette and 3px ink strokes so it sits with the deck on a shared screen. The values are copied into each `styles.css` (no shared stylesheet, no extra request). It uses system fonts, because the sample loads no web fonts, and carries no Google or DevFest names or logos.

## Evidence on Hand

- Ivan's articles: https://ivankristianto.com/chrome-modern-web-guidance and https://ivankristianto.com/testing-modern-web-guidance
- Experiment repo and interactive comparison: https://github.com/ivankristianto/mwg-longtasks-eval and https://ivankristianto.github.io/mwg-longtasks-eval/demo/
- Official video: https://www.youtube.com/watch?v=PsrHq5F_BAc (Chrome for Developers, 2026-11-10)
- Not yet on hand: rehearsal traces, before/after measurements for the new sample, screenshots, and any tested Antigravity run. Historical numbers from the old experiment must not be presented as results for this sample.

## Product Principles

1. Measure before and after every change. A recommended API in the diff is not proof.
2. Keep behavior intact. A fix that drops results, removes the announcement or edits tests fails, whatever the metric says.
3. Keep agents in scope. The agent plans from evidence, humans review, and edits stay inside `sample/starter/`.
4. Never fabricate. No invented guide IDs, Antigravity commands, redemption steps or timings.
5. Protect all three cases. A stalled run moves to its prepared checkpoint; INP and CLS never become homework.

## Accessibility & Inclusion

The sample keeps search keyboard-operable and preserves accessibility through every repair. The deck has to stay readable over a compressed screen share for viewers at mixed skill levels.
