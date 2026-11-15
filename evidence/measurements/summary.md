# Fault measurements

Lab runs, not field data. Chromium 156.0.8078.4 (Playwright 1.64.1), headless, viewport 1280x800, CPU throttled 4x, cache disabled, no network throttling, served by `npm run sample:serve`. Sample commit 1b82fe5. 5 fresh visits per variant and scenario. Date 2026-11-14.

## Load: LCP and hero discovery (no input)

| Variant | LCP element | LCP ms | Hero request start ms | Hero priority | CLS (no input) |
|---|---|---|---|---|---|
| starter | img#hero-image hero-episode.jpg | 760, 716, 716, 720, 760 (median 720) | 747, 706, 708, 713, 745 (median 713) | Low | 0.131, 0.131, 0.131, 0.131, 0.131 (median 0.131) |
| lcp | img#hero-image hero-episode.jpg | 96, 108, 88, 100, 84 (median 96) | 10, 10, 10, 10, 10 (median 10) | High | 0.131, 0.131, 0.131, 0.131, 0.131 (median 0.131) |
| inp | img#hero-image hero-episode.jpg | 720, 720, 720, 736, 700 (median 720) | 712, 708, 707, 714, 691 (median 708) | Low | 0.131, 0.131, 0.131, 0.131, 0.131 (median 0.131) |
| inp-yield-only | img#hero-image hero-episode.jpg | 736, 720, 732, 736, 720 (median 732) | 714, 709, 714, 716, 708 (median 714) | Low | 0.131, 0.131, 0.131, 0.131, 0.131 (median 0.131) |
| cls | img#hero-image hero-episode.jpg | 720, 720, 716, 736, 716 (median 720) | 708, 708, 706, 714, 709 (median 708) | Low | 0, 0, 0, 0, 0 (median 0) |
| final | img#hero-image hero-episode.jpg | 88, 100, 88, 84, 84 (median 88) | 10, 10, 9, 10, 10 (median 10) | High | 0, 0, 0, 0, 0 (median 0) |

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
| starter | 1888, 1856, 1840, 1864, 1888 (median 1864) | 2, 2, 2, 2, 2 (median 2) | 188 / 160 / 271 / 1177 / 22 | 1120 (148 / 95 / 159 / 669) |
| lcp | 1872, 1848, 1880, 1872, 1864 (median 1872) | 2, 2, 2, 2, 2 (median 2) | 186 / 160 / 274 / 1175 / 22 | 1120 (147 / 96 / 160 / 666) |
| inp | 32, 32, 32, 32, 32 (median 32) | 0, 0, 0, 0, 0 (median 0) | 75 / 48 / 71 / 308 / 202 | none |
| inp-yield-only | 704, 416, 616, 704, 704 (median 704) | 4, 4, 3, 3, 3 (median 3) | 95 / 85 / 137 / 606 / 34 | 644 (38 / 1 / 106 / 485) |
| cls | 1864, 1864, 1864, 1880, 1856 (median 1864) | 2, 2, 2, 2, 2 (median 2) | 184 / 159 / 272 / 1175 / 23 | 1122 (145 / 96 / 160 / 671) |
| final | 32, 32, 32, 32, 40 (median 32) | 0, 0, 0, 0, 0 (median 0) | 73 / 48 / 71 / 317 / 202 | none |

Trace columns are medians across runs. Longest task breakdown is the median of each run's single longest task.
