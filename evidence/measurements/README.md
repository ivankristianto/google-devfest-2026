# Are the faults real?

Lab evidence for the sample in `sample/`, produced by `node sample/tests/measure.mjs`. These are local diagnostic runs on one machine, not field Core Web Vitals. Full tables are in `summary.md`, raw per-run values in `results.json`.

Setup: Playwright's full Chromium 156 in new headless mode, 1280x800, 4x CPU throttling, cache disabled, no network throttling, `npm run sample:serve`. Every number is one of 5 fresh visits; medians are given next to all values.

## LCP

The hero (`img#hero-image`, `hero-episode.jpg`) is the LCP element in all 30 load runs.

- starter: hero request starts at 713 ms (median), LCP 720 ms, initial priority Low.
- `reference/lcp`: request at 10 ms, LCP 96 ms, priority High.

About 600 ms of the starter's delay is the labelled artificial delay in `app.js` (`FEATURED_DELAY_MS`). Without it the late `src` would still cost a JSON round trip, but only tens of milliseconds on localhost.

## INP

Typing "coding" at 120 ms per key (1,686 matching transcript lines; the first key alone matches 8,050). Interaction durations come from Event Timing; the cost breakdown is self time on the renderer main thread from a DevTools trace.

- starter: worst interaction 1,864 ms. Every key queues behind one long task (median 1,120 ms) that is mostly layout (669 ms) and style (159 ms). Script, including the filter loop and the string building, is 148 ms of it.
- `reference/inp-yield-only` (first attempt: batches of 100 rows, `scheduler.yield()` between them): worst interaction 704, 416, 616, 704, 704 ms (median 704). Traces show 60 to 115 batches laid out in a single frame, so the longest task (median 644 ms) is still mostly layout (485 ms) and style (106 ms).
- `reference/inp` (same batches, waiting for `requestAnimationFrame` before each yield): worst interaction 32 ms in all five runs, no long tasks, at most 2 batches per layout.

In these traces the yield continuations ran before the browser rendered, so batches piled up until one large style and layout pass. Waiting for a frame before yielding limits each frame to one batch. An earlier run in Playwright's headless shell build showed the same pattern.

## CLS

The announcement is inserted about 2.5 s after first paint with no input.

- starter: CLS 0.131 at 1280x800 and 0.237 at 390x844, in every run.
- `reference/cls`: 0 at both widths.

## Isolation

Each per-case folder changes only its own metric. LCP and hero timing match starter in `inp/`, `inp-yield-only/` and `cls/`. CLS matches starter in `lcp/`, `inp/` and `inp-yield-only/`. Interaction times stay near 1.9 s in `lcp/` and `cls/`. `final/` fixes all three.

Typing switches the page to a results view at the keystroke, so rows that render late move nothing: layout shift without recent input after the first key was 0 in all 30 interaction runs (`lateShift` in `results.json`).

## Limits

- Headless only. Headed desktop Chrome, which attendees will use, has not been measured yet.
- `reference/inp` renders one batch of 100 rows per frame, so long result lists fill in over many frames, and rendering pauses while the tab is hidden. Time to the last row was not measured.
