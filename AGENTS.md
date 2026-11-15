# Workshop rules for the agent

These rules apply when you work on a workshop case (LCP, INP or CLS) on the Ngobrolin WEB podcast page served at http://127.0.0.1:4173/starter/ by `npm run sample:serve`.

## Scope

- Edit files only in `sample/starter/`. Never edit `sample/reference/`, `sample/shared/`, `sample/tests/`, `snippets/`, the slides, the theme or this file.
- Propose a plan first and wait for approval before you edit any file.
- Work on one case at a time: LCP, INP or CLS, whichever the prompt names. Leave the other faults alone.
- If the fix needs files outside `sample/starter/`, or the cause turns out to be different from what you planned, stop and explain before going further.

## Evidence

- Measure in the browser before you propose a change, and measure again the same way after it: same page, same window size, a fresh reload.
- If you cannot record a trace or see the page, say so. Do not guess what a trace would show.
- Local measurements are lab results. Never describe them as field Core Web Vitals or as what real users will see.
- Check Modern Web Guidance before proposing a fix, and name the guide in the plan.

## Keep the page working

- The hero shows the same image at the same size.
- Every search match stays reachable. When someone types fast, only the latest search is shown.
- The announcement still appears.
- After a change, check these by hand in the browser. If Playwright is installed, also run `npm run sample:test` and report the result.
