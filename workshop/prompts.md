# Workshop prompts

These are the prompts from the slides, word for word. Ivan runs each step on the shared screen first, then everyone does the same.

## Before you start

1. Run `npm run sample:serve` and open http://127.0.0.1:4173/starter/ in Chrome.
2. Open the repo folder in the Antigravity App and pick **Gemini 4 Hydrogen** in the model selector under the prompt box.
3. Check that `.agents/skills/modern-web-guidance/` exists. If it doesn't, run `npx modern-web-guidance@latest install` in the repo root.

The repo's `AGENTS.md` holds the ground rules the agent reads on every turn: edit only `sample/starter/`, measure before and after, keep the page working, and say so when it can't see the page. That's why the prompts below can stay short.

## Each case, step by step

1. **Measure.** Record the problem in the Chrome DevTools Performance panel.
2. **Ask.** In the prompt box, type `/plan`, then paste the prompt for the case.
3. **Check.** Read the plan together:
   - Does it fix what we measured?
   - Does the page still work the same?
   - Does it name the guide it used? (After Proceed, the agent's answer also ends with a "Modern Web Guidance" section listing each guide.)
4. **Apply.** If the plan passes, click **Proceed**. Read the diff.
5. **Measure again.** Ask the agent: `Measure again the same way and show before and after.` Then repeat your own recording on a fresh reload.

If a plan fails a check, tell the agent what's wrong and ask for a new plan before you click Proceed.

**Fallback:** if the App won't start, use the Antigravity CLI. Start it with `agy --mode=plan` (or press Shift+Tab until plan mode shows), paste the same prompt, then switch back to the default mode to apply it.

These controls come from https://antigravity.google/docs/plan/ and https://antigravity.google/docs/cli/modes/, checked on 2026-11-13. The docs don't promise that plan mode blocks edits, so always read the plan before you click Proceed.

## Case 1: LCP, the main image shows up late

```text
LCP case. Open http://127.0.0.1:4173/starter/ and record a reload.
Find the LCP element and when its download starts.
Use Modern Web Guidance on loading the hero image early.
Explain why it shows up late and propose the smallest fix.
Keep the same image at the same size.
```

Expected guide: `optimize-image-priority`.

## Case 2: INP, typing in search feels stuck

```text
INP case. Open http://127.0.0.1:4173/starter/, record typing
"coding" in the search box, and find what makes the page slow
to react. Use Modern Web Guidance on breaking up long tasks.
Propose the smallest fix. Keep every search result, and show
only the latest search when someone types fast.
```

Expected guide: `break-up-long-tasks`.

### Round 2 (Ivan leads this one)

Use it after round 1 is applied and measured, if typing is still slow.

```text
INP round 2. The round 1 fix is in, and typing is still slow.
Record typing "coding" again on a fresh reload. Check whether
the browser gets to draw between the batches. Propose the
smallest change that lets it draw each batch. Keep every
search result, and show only the latest search.
```

## Case 3: CLS, the page jumps

```text
CLS case. Open http://127.0.0.1:4173/starter/ and record a reload
without touching the page. Find what moves and what pushes it.
Use Modern Web Guidance on preventing layout shifts.
Propose the smallest fix that keeps the announcement.
Check it at a desktop width and a phone width.
```

There may not be one dedicated guide for this case. Read which guides the agent names.

## If the agent can't record a trace

Record it yourself in the Performance panel, then paste what you saw after the prompt: the LCP element and when its download started, the long task under the key press, or what moved during the layout shift.

## If a run stalls

Each case has a prepared fix in `sample/reference/`. Use it to show the expected diff and to measure, and say out loud that it is prepared.

| Case | Prepared fix |
|---|---|
| LCP | `sample/reference/lcp/` |
| INP round 1 | `sample/reference/inp-yield-only/` |
| INP round 2 | `sample/reference/inp/` |
| CLS | `sample/reference/cls/` |
| All three | `sample/reference/final/` |

Each folder fixes only its own case and keeps the other problems, so you can measure it on its own at `http://127.0.0.1:4173/reference/<folder>/`.
