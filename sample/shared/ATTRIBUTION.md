# Attribution

## Content: Ngobrolin WEB

The sample is a local copy of the Ngobrolin WEB podcast site. Its content comes from
[ngobrolin/landing](https://github.com/ngobrolin/landing) (commit `ac997cc`) and the show's YouTube channel.
The workshop presenter is one of the show's three hosts.

What came from there:

- `transcript.json`: 9,982 transcript lines from 14 episodes (9 September to 11 November 2026). The episode list is pinned in `tools/make-data.mjs`, so new episodes upstream do not change the file (SHA-256 starts `45c87853ed1b6097`). Sponsor reads are left out. The transcripts are YouTube's automatic captions and contain many mishearings.
- `images/hero-episode.jpg` and `images/episode-1.jpg` to `episode-8.jpg`: episode thumbnails from YouTube.
- `images/cover.jpg` and `images/host-*.jpg`: the podcast cover and the three hosts' photos, scaled down from the landing repo.
- Episode titles, dates, descriptions and host details in the page markup.

Rebuild with `node sample/shared/tools/make-data.mjs <path to landing checkout> --images` (the image step needs network access and macOS `sips`).

## Code: mwg-longtasks-eval

Parts of the search code are adapted from
[mwg-longtasks-eval](https://github.com/ivankristianto/mwg-longtasks-eval)
(commit `7d1f015`), released under the MIT License below: the `escapeHtml` helper, the `scheduler.yield()` feature check with its `setTimeout` fallback, and the render-token pattern that cancels stale searches, in every `app.js` under `sample/`.

The page design, faults, fixes and tests were written for this workshop.

## Upstream license

```
MIT License

Copyright (c) 2026 Ivan Kristianto

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
```
