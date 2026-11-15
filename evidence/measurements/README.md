# Are the faults real?

Lab evidence for the sample in `sample/`, produced by `node sample/tests/measure.mjs`. These are local diagnostic runs on one machine, not field Core Web Vitals. Full tables are in `summary.md`, raw per-run values in `results.json`.

Setup: Playwright's full Chromium 156 in new headless mode, 1280x800, 4x CPU throttling, cache disabled, `npm run sample:serve`. No network throttling, except the Slow 4G load runs (DevTools preset: 562.5 ms latency, 1.44 Mbit/s down), which is how the workshop measures the LCP case. Every number is one of 5 fresh visits; medians are given next to all values.

## LCP

The hero (`img#hero-image`, `hero-episode.jpg`) is the LCP element in all 60 load runs, with and without throttling.

Slow 4G, as used in the workshop:

- starter: hero request starts at 3,358 ms (median), LCP 5,444 ms. Poor (over 4 s).
- `reference/lcp`: request at 584 ms, right after the HTML arrives, LCP 2,352 ms. Good (2.5 s or less).

The starter's image waits for a chain: the HTML, then `app.js`, then `featured.json`, then the labelled artificial delay in `app.js` (`FEATURED_DELAY_MS`, 600 ms). Each request in the chain pays Slow 4G latency, and the late image download shares bandwidth with the 1.9 MB transcript that starts earlier. After the fix, most of the remaining LCP is the image download itself.

No network throttling:

- starter: request at 716 ms, LCP 736 ms, initial priority Low.
- `reference/lcp`: request at 9 ms, LCP 88 ms, priority High.

On localhost both are under 2.5 s, which is why the workshop measures this case with Slow 4G. About 600 ms of the unthrottled delay is the artificial delay.

## INP

Typing "coding" at 120 ms per key (1,686 matching transcript lines; the first key alone matches 8,050). Interaction durations come from Event Timing; the cost breakdown is self time on the renderer main thread from a DevTools trace.

- starter: worst interaction 1,944 ms. Every key queues behind one long task (median 1,170 ms) that is mostly layout (695 ms) and style (164 ms). Script, including the filter loop and the string building, is 158 ms of it.
- `reference/inp-yield-only` (first attempt: batches of 100 rows, `scheduler.yield()` between them): worst interaction 576, 544, 664, 632, 656 ms (median 632). Many batches are laid out in a single frame, so the longest task (median 560 ms) is still mostly layout (410 ms) and style (95 ms).
- `reference/inp` (same batches, waiting for `requestAnimationFrame` before each yield): worst interaction 32 to 40 ms (median 32), no long tasks, at most 2 batches per layout.

In these traces the yield continuations ran before the browser rendered, so batches piled up until one large style and layout pass. Waiting for a frame before yielding limits each frame to one batch. An earlier run in Playwright's headless shell build showed the same pattern.

## CLS

The announcement is inserted about 2.5 s after first paint with no input.

- starter: CLS 0.131 at 1280x800 and 0.237 at 390x844, in every run.
- `reference/cls`: 0 at both widths.

## Isolation

Each per-case folder changes only its own metric. LCP and hero timing match starter in `inp/`, `inp-yield-only/` and `cls/`, with and without Slow 4G. CLS matches starter in `lcp/`, `inp/` and `inp-yield-only/`. Interaction times stay at about 1.9 to 2.0 s in `lcp/` and `cls/`. `final/` fixes all three.

Typing switches the page to a results view at the keystroke, so rows that render late move nothing: layout shift without recent input after the first key was 0 in all 30 interaction runs (`lateShift` in `results.json`).

## Limits

- Headless only. Headed desktop Chrome, which attendees will use, has not been measured yet.
- `reference/inp` renders one batch of 100 rows per frame, so long result lists fill in over many frames, and rendering pauses while the tab is hidden. Time to the last row was not measured.
