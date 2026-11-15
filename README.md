# DevFest Online: Modern Web Guidance

Local project skeleton for a roughly one-hour guided workshop.

## Agreed scope

- Slidev presentation and sample website in one repository.
- Three cases solved together: LCP, INP, and CLS.
- Antigravity with Gemini 4 Hydrogen.
- Each case follows Plan → human review → Exec → measurement.

## Structure

- `public/`: presentation assets.
- `sample/starter/`: audience exercise application.
- `sample/reference/`: prepared solutions, outside agent repair scope.
- `sample/shared/`: local sample data and assets.
- `sample/tests/`: functional acceptance checks.
- `workshop/`: setup, prompts, and measurement instructions.
- `evidence/`: scrubbed rehearsal traces and screenshots.

## Commands

```bash
npm ci
npx playwright install chromium
npm run sample:serve   # sample at http://127.0.0.1:4173/starter/
npm run sample:test    # functional checks
npm run slides:dev     # deck at http://localhost:3030
```

The presentation and the measured sample run on separate ports.

## Current state

The sample, the deck and the workshop prompts are in place. The repo will live at https://github.com/ivankristianto/google-devfest-2026. The model, mode and browser setup still need a rehearsal.
