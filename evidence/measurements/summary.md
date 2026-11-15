# Fault measurements

Lab runs, not field data. Chromium 156.0.8078.4 (Playwright 1.64.1), headless, viewport 1280x800, CPU throttled 4x, cache disabled, no network throttling except where a table says Slow 4G, served by `npm run sample:serve`. Sample commit 48b1647. 5 fresh visits per variant and scenario. Date 2026-11-15.

## Load: LCP and hero discovery (no input)

| Variant | LCP element | LCP ms | Hero request start ms | Hero priority | CLS (no input) |
|---|---|---|---|---|---|
| starter | img#hero-image hero-episode.jpg | 740, 704, 736, 728, 740 (median 736) | 732, 696, 716, 713, 716 (median 716) | Low | 0.131, 0.131, 0.131, 0.131, 0.131 (median 0.131) |
| lcp | img#hero-image hero-episode.jpg | 88, 88, 84, 88, 100 (median 88) | 10, 9, 9, 10, 9 (median 9) | High | 0.131, 0.131, 0.131, 0.131, 0.131 (median 0.131) |
| inp | img#hero-image hero-episode.jpg | 732, 720, 720, 716, 720 (median 720) | 718, 708, 710, 710, 709 (median 710) | Low | 0.131, 0.131, 0.131, 0.131, 0.131 (median 0.131) |
| inp-yield-only | img#hero-image hero-episode.jpg | 724, 740, 732, 736, 732 (median 732) | 710, 719, 719, 716, 718 (median 718) | Low | 0.131, 0.131, 0.131, 0.131, 0.131 (median 0.131) |
| cls | img#hero-image hero-episode.jpg | 732, 748, 736, 736, 740 (median 736) | 719, 729, 715, 720, 725 (median 720) | Low | 0, 0, 0, 0, 0 (median 0) |
| final | img#hero-image hero-episode.jpg | 92, 88, 84, 88, 96 (median 88) | 11, 11, 10, 10, 10 (median 10) | High | 0, 0, 0, 0, 0 (median 0) |

## Load under Slow 4G network throttling (no input)

DevTools Slow 4G preset: 562.5 ms latency, 1440 kbit/s down. This is how the LCP case is measured in the workshop.

| Variant | LCP element | LCP ms | Hero request start ms |
|---|---|---|---|
| starter | img#hero-image hero-episode.jpg | 5448, 5428, 5448, 5444, 5444 (median 5444) | 3357, 3348, 3365, 3358, 3365 (median 3358) |
| lcp | img#hero-image hero-episode.jpg | 2336, 2352, 2352, 2264, 2352 (median 2352) | 585, 584, 583, 583, 584 (median 584) |
| inp | img#hero-image hero-episode.jpg | 5448, 5444, 5432, 5448, 5428 (median 5444) | 3366, 3356, 3348, 3357, 3348 (median 3356) |
| inp-yield-only | img#hero-image hero-episode.jpg | 5444, 5432, 5444, 5444, 5436 (median 5444) | 3357, 3348, 3366, 3359, 3356 (median 3357) |
| cls | img#hero-image hero-episode.jpg | 5436, 5440, 5448, 5448, 5444 (median 5444) | 3356, 3357, 3359, 3358, 3357 (median 3357) |
| final | img#hero-image hero-episode.jpg | 2344, 2344, 2260, 2344, 2344 (median 2344) | 589, 589, 588, 588, 588 (median 588) |

## CLS at a second width (390x844, no input)

| Variant | CLS |
|---|---|
| starter | 0.237, 0.237, 0.237, 0.237, 0.237 (median 0.237) |
| lcp | 0.237, 0.237, 0.237, 0.237, 0.237 (median 0.237) |
| inp | 0.237, 0.237, 0.237, 0.237, 0.237 (median 0.237) |
| inp-yield-only | 0.237, 0.237, 0.237, 0.237, 0.237 (median 0.237) |
| cls | 0, 0, 0, 0, 0 (median 0) |
| final | 0, 0, 0, 0, 0 (median 0) |

## Interaction: typing "coding" at 120 ms per key

| Variant | Worst interaction ms | Long tasks (>=50 ms) | Main-thread self time in window: script / parseHTML / style / layout / paint ms | Longest task ms (script / parseHTML / style / layout) |
|---|---|---|---|---|
| starter | 1992, 2008, 1944, 1936, 1904 (median 1944) | 2, 2, 2, 2, 2 (median 2) | 201 / 167 / 281 / 1219 / 25 | 1170 (158 / 98 / 164 / 695) |
| lcp | 2008, 1904, 1896, 1904, 1904 (median 1904) | 2, 2, 2, 2, 2 (median 2) | 195 / 162 / 277 / 1199 / 24 | 1144 (153 / 96 / 162 / 683) |
| inp | 40, 32, 40, 32, 32 (median 32) | 0, 0, 0, 0, 0 (median 0) | 72 / 48 / 72 / 323 / 209 | none |
| inp-yield-only | 576, 544, 664, 632, 656 (median 632) | 3, 4, 3, 3, 4 (median 3) | 105 / 78 / 129 / 543 / 38 | 560 (38 / 1 / 95 / 410) |
| cls | 1984, 1968, 2208, 2072, 1992 (median 1992) | 2, 2, 2, 2, 2 (median 2) | 205 / 176 / 289 / 1250 / 27 | 1210 (161 / 104 / 171 / 716) |
| final | 32, 40, 32, 32, 40 (median 32) | 0, 0, 0, 0, 0 (median 0) | 78 / 48 / 73 / 323 / 200 | none |

Trace columns are medians across runs. Longest task breakdown is the median of each run's single longest task.
