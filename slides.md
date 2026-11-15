---
theme: ./theme
title: 'Measure, guide, fix: Core Web Vitals with an AI agent'
author: Ivan Kristianto
info: |
  DevFest Online workshop, 60 minutes. Layouts follow the organizer's DevFest speaker template.
  Brand marks in public/brand/ are cropped from that template's slide backgrounds.
colorSchema: light
transition: none
aspectRatio: 16/9
canvasWidth: 1280
duration: 60min
themeConfig:
  brandMarks: true
layout: cover
location: Online
name: Ivan Kristianto
role: 'GDE Web Performance'
date: 'Wednesday 18 November 2026'
---

# Measure, guide, fix: Core Web Vitals with an AI agent

<!--
00:00 to 00:30

- Welcome to the session. Title only; the next slide is about me.
-->

---
layout: trace
split: 7fr 5fr
---

::title::
# Hi, I'm Ivan

::default::
<p class="intro-role"><b>GDE, Web Performance</b><br><span class="df-mono">ivankristianto.com</span></p>

<table class="intro-stats">
  <tbody>
    <tr><th>Day job</th><td>Senior Web Engineer, Human Made</td></tr>
    <tr><th>GDE since</th><td>2018</td></tr>
    <tr><th>Podcast</th><td>Co-host of <i>ngobrolin web</i></td></tr>
    <tr><th>CLS today</th><td>0, I'll stay in frame</td></tr>
  </tbody>
</table>

::right::
<figure class="intro-photo">
  <img src="/speaker/ivan.jpg" alt="Ivan on a beach" width="400" height="400">
  <span class="df-label blue intro-tag">LCP element</span>
</figure>

::foot::
My first guided fix left the page slow. Today you'll see why.

<style>
.intro-role { font-size: 32px; line-height: 1.2; }
.intro-role .df-mono { font-size: 26px; }
.intro-stats { border-collapse: collapse; font-size: 30px; width: 100%; margin-top: 8px; }
.intro-stats th {
  text-align: left; font-family: var(--df-font-mono); font-weight: 300; font-size: 24px;
  padding: 12px 20px 12px 0; white-space: nowrap; width: 1%;
}
.intro-stats td { padding: 12px 0; white-space: nowrap; }
.intro-stats tr + tr th, .intro-stats tr + tr td { border-top: 2px dotted var(--df-ink); }
.intro-photo { position: relative; margin: 0; align-self: center; transform: rotate(-3deg); }
.intro-photo img {
  display: block; width: 340px; height: 340px; object-fit: cover;
  border: var(--df-stroke) solid var(--df-ink); border-radius: 28px;
}
.intro-tag { position: absolute; right: -28px; bottom: 30px; transform: rotate(7deg); font-size: 26px; padding: 2px 18px; }
</style>

<!--
00:30 to 02:00

- Hello, I'm Ivan, a GDE for Web Performance.
- The photo is the biggest thing on this slide, so it's the slide's LCP element. CLS today: I'll try to stay in frame.
- When I first followed a Modern Web Guidance guide, my test page stayed slow. Today you'll see why.
- The test I mention is written up at https://ivankristianto.com/testing-modern-web-guidance. It used an older guidance release and a different agent, so don't quote its numbers as today's.
- Today we fix three problems on a copy of a podcast site, Ngobrolin WEB, together, with an AI agent.
- I do every step on my screen first. You do the same on yours right after. If you fall behind, watch; the repo lets you repeat it all later.
-->

---

# Try the broken shop

<div class="flex flex-col gap-7 mt-2">
  <div class="flex items-center gap-6"><span class="df-label blue">LCP</span> The main image shows up late.</div>
  <div class="flex items-center gap-6"><span class="df-label yellow">INP</span> Typing in search feels stuck.</div>
  <div class="flex items-center gap-6"><span class="df-label red">CLS</span> An announcement pushes the page down.</div>
</div>

::foot::
Run <code>npm run sample:serve</code>, open 127.0.0.1:4173/starter/

<!--
02:00 to 03:00

- Open http://127.0.0.1:4173/starter/ after npm run sample:serve.
- Show each problem once. Reload and watch the image arrive late. Type "coding" in search and feel the lag. Reload and watch the page jump when the announcement lands.
- Don't explain the labels yet. The next slide does.
- The image delay is artificial and labelled as such in the source. Say so if someone asks.
-->

---

# Three numbers for how a page feels

<table class="df-table df-metrics">
  <thead><tr><th>Metric</th><th>What a visitor feels</th><th>Good</th></tr></thead>
  <tbody>
    <tr><td><span class="df-label blue">LCP</span></td><td>How long until the main content shows</td><td>2.5 s or less</td></tr>
    <tr><td><span class="df-label yellow">INP</span></td><td>How long the page takes to react to a tap or a key</td><td>200 ms or less</td></tr>
    <tr><td><span class="df-label red">CLS</span></td><td>How much the content jumps while you read</td><td>0.1 or less</td></tr>
  </tbody>
</table>

::foot::
Together they are the Core Web Vitals.

<!--
03:00 to 05:00

- Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift. Say the full names once, then use the short ones.
- One sentence each, in the words of the person using the page.
- The "good" values come from web.dev. Google checks them on real visits, at the 75th percentile, split by mobile and desktop. We come back to the difference between real visits and our own machine after the first fix.
-->

---
layout: trace
split: 6fr 5fr
codeSize: 18px
---

::title::
# Modern Web Guidance

::default::

- Coding agents learned from years of old web code. Some of it is out of date.
- Written by web experts, with Chrome, Edge, Firefox, MDN and the community taking part.
- Version 1.0 came out on 10 November 2026, with 203 guides.
- It installs into your project as a skill. The agent picks it up on its own.

::right::
<div class="df-box yellow df-quote">
  <p class="df-mono df-small">From the skill's own description:</p>
  <p>"web APIs evolve rapidly and training weights contain obsolete patterns"</p>
</div>

```bash
npx modern-web-guidance@latest install
```

::foot::
Overview video: youtu.be/PsrHq5F_BAc (Chrome for Developers, 7 min)

<!--
05:00 to 06:30 (slides 5 to 7: about 5 minutes on guidance)

- The problem it solves: an agent writes the code it saw most often while training. On the web, a lot of that is older than today's best practice.
- Modern Web Guidance is a set of expert-written guides, each about one task. Chrome, Edge, Firefox, MDN and the community take part (https://developer.chrome.com/blog/modern-web-guidance-v1).
- 203 guides is the count in the 1.0 release notes. The list command prints 208 entries because it also has broad guides like "performance".
- The quote is from the description in the skill file that the installer writes. It is the reason the skill tells the agent to look things up first.
- The install command writes .agents/skills/modern-web-guidance/ into the project. Antigravity reads skills from there (https://antigravity.google/docs/skills/).
- Video: https://www.youtube.com/watch?v=PsrHq5F_BAc. The definition is at 1:06, expert review and local search at 1:55.
-->

---

# How the agent uses a guide

<div class="df-flow df-flow-4">
  <div class="df-box blue"><b>Search</b><span>a short phrase about the task</span></div>
  <FlowArrow />
  <div class="df-box yellow"><b>Retrieve</b><span>one guide, read in full</span></div>
  <FlowArrow />
  <div class="df-box green"><b>Check</b><span>its code against the guide</span></div>
  <FlowArrow />
  <div class="df-box red"><b>Credit</b><span>names the guide it used</span></div>
</div>

```bash
npx -y modern-web-guidance@latest search "prioritize hero image"
# optimize-image-priority, html, performance, ...
```

::foot::
After a change, the agent's answer ends by naming each guide it used.

<!--
06:30 to 08:00

- These four steps come from the skill file itself.
- Search: the agent turns the task into a short phrase. Real output from modern-web-guidance 1.0.0 on 2026-11-13: optimize-image-priority came back first.
- Retrieve: it loads only that guide, not the whole library.
- Check: it compares its code with the guide's rules before it finishes.
- Credit: the skill tells the agent to end the answer that delivers a change with a "Modern Web Guidance" section, one line per guide, quoting the rule. At the plan stage, AGENTS.md asks it to name the guide in the plan. Either way, no guide named means no guidance used.
- Rerun the search before the event in case results changed.
-->

---
layout: trace
split: 4fr 7fr
codeSize: 20px
---

::title::
# What a guide contains

::default::
<div class="df-legend">
  <p><span class="df-label blue">1</span> Steps to follow</p>
  <p><span class="df-label yellow">2</span> Rules, including what not to do</p>
  <p><span class="df-label green">3</span> Which browsers support it</p>
</div>

::right::

```md {1-3|4-6|7-9}
## How to implement
1. Identify the LCP image
2. Add fetchpriority="high" to it
## Best practices
DO NOT combine fetchpriority="high"
with loading="lazy"
## Fallback strategy
Baseline since 2024-10-29.
Chrome 103, Edge 103, Firefox 132, Safari 17.2
```

::foot::
Shortened from optimize-image-priority. The guide can't see our page; we measure first.

<!--
08:00 to 09:30

- Click through the three parts. This is the guide our agent will use for the first problem.
- Steps: find the LCP image, then raise its priority.
- Rules: the guide marks some as MANDATORY and some as DO NOT. Lazy-loading the LCP image is a classic mistake.
- Browser support: each guide says which browsers support the feature and what happens in the ones that don't. Here, browsers without fetchpriority just ignore it.
- The catch: this guide says "raise the priority". It cannot know that our page only sets the image source from JavaScript after a delay. Only a measurement shows that. That's why we always measure first.
-->

---

# One loop, three times

<div class="df-flow df-flow-5">
  <div class="df-box blue"><b>Measure</b><span>record what is slow</span></div>
  <FlowArrow />
  <div class="df-box yellow"><b>Ask</b><span><code>/plan</code> + prompt</span></div>
  <FlowArrow />
  <div class="df-box green"><b>Check</b><span>read the plan</span></div>
  <FlowArrow />
  <div class="df-box red"><b>Apply</b><span>click Proceed</span></div>
  <FlowArrow />
  <div class="df-box blue"><b>Again</b><span>same recording</span></div>
</div>

<div class="df-small df-questions">
  <p><b>Check the plan, every time:</b></p>
  <ol>
    <li>Does it fix what we measured?</li>
    <li>Does the page still work the same?</li>
    <li>Does it name the guide it used?</li>
  </ol>
</div>

::foot::
CLI fallback: <code>agy --mode=plan</code>

<!--
09:30 to 11:00

- Measure: record the problem in Chrome DevTools before anyone changes code.
- Ask: in the Antigravity App, type /plan and the prompt from the slide. The agent reads the page and the guidance and proposes a change. It does not change code yet.
- Check: we read the plan together with the same three questions every time.
- Apply: click Proceed. The agent changes the code and shows the diff.
- Again: the same recording, the same way, on a fresh reload.
- Controls from the Antigravity docs, checked 2026-11-13: /plan then Proceed in the App (https://antigravity.google/docs/plan/). CLI fallback: agy --mode=plan, or Shift+Tab to change mode (https://antigravity.google/docs/cli/modes/).
- The docs don't promise that plan mode blocks edits, so we always read the plan before Proceed.
- The repo has an AGENTS.md that the agent reads on every turn: only edit sample/starter/, measure before and after, say so when it can't see the page. That is why the prompts can stay short.
-->

---
layout: trace
split: 6fr 5fr
---

::title::
# Get ready

::default::
<div class="df-checks">

- Antigravity App open and signed in
- Gemini 4 Hydrogen in the model selector
- `.agents/skills/modern-web-guidance` exists
- Sample running at 127.0.0.1:4173/starter/
- The agent can open the sample

</div>

::right::
<Placeholder label="Antigravity App: model selector, a /plan prompt and the Proceed button" note="Capture from the rehearsed version. Credit: own capture." />

::foot::
Stuck? Watch my screen. You can repeat it all after the session.

<!--
11:00 to 14:00

- Installs, first sign-in and code redemption happen before the event (the organizer handles redemption). This slot is a quick check.
- Model selector sits under the prompt box (https://antigravity.google/docs/models/).
- Guidance: if .agents/skills/modern-web-guidance is missing, run npx modern-web-guidance@latest install in the repo root.
- Quick test: ask the agent to open http://127.0.0.1:4173/starter/ and tell you the page title.
- Browser: on a personal account the App uses its built-in browser. Business accounts and the CLI use /browser with Chrome (https://antigravity.google/docs/commands/browser/).
- Fallback if the App won't start: the CLI, agy, with the same sign-in.
- Hands up, or a reaction in chat, when all five are ticked.
-->

---
layout: section
number: '01'
color: blue
subhead: 'LCP: how long until the main content shows.'
---

# The main image shows up late

<!--
14:00 (Case 1, about 10 minutes)

- First case, so we go slowly. Each step will feel familiar by the third case.
-->

---
layout: trace
split: 4fr 7fr
---

::title::
# Measure: record a reload

::default::

1. DevTools, **Performance** panel
2. Record and reload
3. Find the **LCP** marker: which element, and when did its download start?

::right::
<figure class="df-shot">
  <img src="/captures/lcp-measure.png" width="840" height="383" alt="Chrome DevTools Performance panel after a reload of the starter: LCP 0.67 s, and the LCP breakdown insight shows 652 ms of resource load delay before the hero image download starts">
  <Credit>Own capture, Chrome 157 DevTools, 4x CPU slowdown</Credit>
</figure>

::foot::
Watch first, then do the same.

<!--
14:00 to 16:00

- This is the first time we open the Performance panel. Show where the record-and-reload button is.
- The LCP marker sits on the timings track. Click it to see which element it is: the hero image.
- Then find the image request in the network track. It starts late, long after the HTML has arrived.
- Ask the room: why would the browser start downloading the most important image so late?
- The capture is the LCP breakdown insight in the Insights sidebar. Click it and the timeline zooms to the load and marks each part. Almost all of the 0.67 s is "Resource load delay": the browser waited about 650 ms before it even asked for the image.
- Check track names against the Chrome version on screen before the event. The capture is from Chrome 157.
-->

---
layout: trace
split: 1fr
---

::title::
# Ask: type /plan, then this

::default::

```text
LCP case. Open http://127.0.0.1:4173/starter/ and record a reload.
Find the LCP element and when its download starts.
Use Modern Web Guidance on loading the hero image early.
Explain why it shows up late and propose the smallest fix.
Keep the same image at the same size.
```

::foot::
Copy it from workshop/prompts.md

<!--
16:00 to 18:00

- Type /plan in the prompt box first, then paste.
- While the agent works, point out when it searches and retrieves a guide. We expect optimize-image-priority.
- AGENTS.md carries the rest: stay in sample/starter/, measure before and after, say so when you can't see the page.
-->

---
layout: trace
split: 3fr 8fr
codeSize: 22px
---

::title::
# Check the plan

::default::

**A good plan:**

<div class="df-checks">

- Puts the image in the HTML
- Same image, same size
- Names its guide

</div>

::right::
<<< @/snippets/lcp-hero-src.js js

<<< @/snippets/lcp-hero-markup.html html

::foot::
Expected guide: optimize-image-priority. Plan looks right? Click Proceed.

<!--
18:00 to 21:00

- Show the code: the image tag has no src. JavaScript fetches a JSON file, waits, then sets the src. The browser can't start downloading something it doesn't know about.
- The guide says raise the priority. That alone doesn't fix this, because the image isn't in the HTML yet. A good plan puts the src in the HTML, and can add fetchpriority="high" too.
- Same image, same width and height, or we'd swap an LCP problem for a CLS one.
- Click Proceed. Read the diff together. Edits stay inside sample/starter/.
- If the run stalls, open sample/reference/lcp/ and say it is prepared.
-->

---
layout: trace
split: 4fr 7fr
---

::title::
# Measure again

::default::
<div class="df-checks">

- Same recording, fresh reload
- The image download starts right away
- Same image, same size

</div>

::right::
<figure class="df-shot">
  <div class="df-shot-pair">
    <div>
      <p class="df-shot-cap">Before</p>
      <img src="/captures/lcp-before.png" width="222" height="114" alt="LCP breakdown before the fix: resource load delay 650 ms">
    </div>
    <div>
      <p class="df-shot-cap">After</p>
      <img src="/captures/lcp-after.png" width="222" height="114" alt="LCP breakdown after the fix: resource load delay 9 ms">
    </div>
  </div>
  <Credit>LCP breakdown, own capture, Chrome 157 DevTools</Credit>
</figure>
<LabValue compact value="720 → 96 ms" what="LCP, before → after" />

::foot::
Your machine helps find the cause. Real visitors decide the score.

<!--
21:00 to 24:00

- Ask the agent: measure again the same way and show before and after. Then repeat the recording ourselves.
- The image request now starts with the page, and the LCP marker moves left.
- The two tables are the same LCP breakdown insight, before and after. Resource load delay drops from about 650 ms to under 10 ms. The other rows barely change.
- The yellow box is from my prep runs: headless Chromium, CPU slowed 4x, median of 5 runs. The captures are single runs in Chrome with DevTools open, so their numbers don't match the box exactly. Your numbers will differ too.
- Say this once, clearly: numbers from our own machine are lab numbers. They help us find causes. The score that counts comes from real visitors (field data), after you ship.
-->

---
layout: section
number: '02'
color: yellow
subhead: 'INP: how long the page takes to react to a tap or a key.'
---

# Typing in search feels stuck

<!--
24:00 (Case 2, about 13 minutes, two rounds)

- Same loop. This time the problem happens when we type, not when the page loads.
- This case has two rounds. The first fix looks right and isn't enough. I lead round 2.
-->

---
layout: trace
split: 4fr 7fr
---

::title::
# Measure: record while typing

::default::

1. Reload and wait
2. Record, type **coding**, stop
3. Find the **interaction**: what runs under it?

::right::
<figure class="df-shot">
  <img src="/captures/inp-measure.png" width="840" height="383" alt="Chrome DevTools Performance panel while typing coding in the starter: INP 971 ms, and the INP breakdown shows 810 ms of processing, one long task that is mostly Layout">
  <Credit>Own capture, Chrome 157 DevTools, 4x CPU slowdown</Credit>
</figure>

::foot::
INP needs a real key press. A reload alone won't show it.

<!--
24:00 to 26:00

- This is a different kind of recording: no reload. Start recording, type, stop.
- Find the interaction on the interactions track. Under it is one long block of work on the main thread.
- Don't guess which code is slow yet. Look at what the block contains: scripting, then style and layout.
- In the capture, the INP breakdown insight is open: 810 ms of processing under one key press. The short yellow part on the left is our search code (renderResults). The long purple bar is Layout. Most of the time goes to the browser laying out the rows, not to our JavaScript.
- Lighthouse page loads and Total Blocking Time are not INP. INP needs a real interaction.
-->

---
layout: trace
split: 1fr
---

::title::
# Ask: type /plan, then this

::default::

```text
INP case. Open http://127.0.0.1:4173/starter/, record typing
"coding" in the search box, and find what makes the page slow
to react. Use Modern Web Guidance on breaking up long tasks.
Propose the smallest fix. Keep every search result, and show
only the latest search when someone types fast.
```

::foot::
Copy it from workshop/prompts.md

<!--
26:00 to 27:30

- /plan, then paste.
- We expect the agent to retrieve break-up-long-tasks.
-->

---
layout: trace
split: 4fr 7fr
codeSize: 22px
---

::title::
# Check the plan

::default::

**A good plan:**

<div class="df-checks">

- Keeps every result
- Typing fast shows only the latest search
- Names its guide

</div>

::right::
<<< @/snippets/inp-render.js js

::foot::
Expected guide: break-up-long-tasks. Plan looks right? Click Proceed.

<!--
27:30 to 30:00 (round 1)

- Show the code: it builds a long HTML string, pausing every 50 ms, then writes all of it to the page in one go at the end.
- The agent will probably propose splitting the work into batches with scheduler.yield() between them. That's a reasonable first plan. Approve it if it keeps the three checks, and say we will measure it.
- Not acceptable: showing only the first 50 results. That looks fast and hides transcript lines.
- Click Proceed, read the diff.
- If the run stalls, open sample/reference/inp-yield-only/ and say it is prepared.
-->

---
layout: trace
split: 4fr 7fr
---

::title::
# Round 1: still slow

::default::
<div class="df-checks">

- Same typing, fresh reload
- The diff has <code>scheduler.yield()</code>
- The trace still shows one long block

</div>

::right::
<figure class="df-shot" style="--shot-h: 220px">
  <img src="/captures/inp-round1.png" width="840" height="383" alt="Round 1 interaction trace: INP 630 ms, and one long Layout block still sits under the key press, so the next key waits 514 ms">
  <Credit>Own capture, Chrome 157 DevTools, 4x CPU slowdown</Credit>
</figure>
<LabValue compact value="704 ms" what="slowest key press, round 1" />

::foot::
A fix in the diff is a guess until the trace confirms it.

<!--
30:00 to 32:00

- Repeat the same typing and compare.
- The code follows the guide. The page is still slow. In our prep trace, the batches still ended up being drawn in one long pass.
- In the capture: processing is now 0 ms, so our code did break up. But one long Layout bar is still there, and the next key press waited 514 ms behind it (input delay). The batches piled up and got laid out together. The capture's INP is 630 ms, one run with DevTools open, so it differs a little from the yellow box.
- Say what the trace on screen shows today. Don't turn it into a rule about scheduler.yield().
- Lab value from prep: headless Chromium, CPU 4x slower, median of 5, slowest key press 704 ms (it was 1864 ms before). Not field INP.
- Check: same result count, every transcript line reachable.
-->

---
layout: trace
split: 3fr 8fr
codeSize: 20px
---

::title::
# Round 2: let the browser draw

::default::

Wait for the next frame, then pause. Each batch now reaches the screen.

<span class="df-label outline">I lead this one</span>

::right::
<<< @/snippets/inp-batch-loop.js js

<LabValue compact value="32 ms" what="slowest key press, round 2" />

::foot::
Round 2 prompt: workshop/prompts.md

<!--
32:00 to 37:00

- I drive this round. Watch first; try it yourself afterwards from workshop/prompts.md.
- /plan with the round 2 prompt. Give the agent the round 1 trace and ask why the batches didn't help.
- The change we expect: wait for the next frame (requestAnimationFrame), then yield. Now the browser can draw each batch before the next one starts.
- Same three checks: every result, latest search only, guide named. Proceed, read the diff, record the same typing.
- Lab value from prep: 32 ms, against 704 ms for round 1. Lab only.
- If the run stalls, open sample/reference/inp/ and say it is prepared.
- My earlier experiment with an older guidance release is at https://ivankristianto.com/testing-modern-web-guidance. Its numbers are not today's.
-->

---
layout: section
number: '03'
color: red
subhead: 'CLS: how much the content jumps while you read.'
---

# The page jumps

<!--
37:00 (Case 3, about 10 minutes)

- Last case. You know the loop now, so this one goes faster.
-->

---
layout: trace
split: 4fr 7fr
---

::title::
# Measure: record a reload, hands off

::default::

1. Record and reload
2. Don't touch anything
3. Find the **layout shift**: what moved, and what pushed it?

::right::
<figure class="df-shot" style="--shot-h: 330px">
  <img src="/captures/cls-measure.png" width="590" height="365" alt="Hovering the layout shift in the Performance panel: a 0.1308 shift, previewed with the yellow announcement arriving above the latest episode and pushing it down">
  <Credit>Own capture, Chrome 157 DevTools</Credit>
</figure>

::foot::
A click or a key press right before a shift stops it counting.

<!--
37:00 to 39:00

- Same recording as LCP, but now we look at the layout shifts track.
- Hands off: shifts right after a click or key press are excluded from CLS, so touching the page hides the problem.
- The things that moved are the victims. The announcement that arrived late is the cause.
- To get the capture's view: open the "Layout shift culprits" insight, then hover the purple diamond on the Layout shifts track. DevTools plays the shift on a small screenshot. Score 0.1308, at about 2.5 s, with nobody touching the page.
- The insight found no culprit for this shift. The preview shows the cause anyway: the announcement our script inserts.
-->

---
layout: trace
split: 1fr
---

::title::
# Ask: type /plan, then this

::default::

```text
CLS case. Open http://127.0.0.1:4173/starter/ and record a reload
without touching the page. Find what moves and what pushes it.
Use Modern Web Guidance on preventing layout shifts.
Propose the smallest fix that keeps the announcement.
Check it at a desktop width and a phone width.
```

::foot::
Copy it from workshop/prompts.md

<!--
39:00 to 40:30

- /plan, then paste.
- During research, "prevent layout shifts" returned broader guides, not one CLS guide. Read what the agent retrieves.
-->

---
layout: trace
split: 4fr 7fr
codeSize: 22px
---

::title::
# Check the plan

::default::

**A good plan:**

<div class="df-checks">

- Keeps the announcement
- Saves its space from the start
- Works at a phone width too
- Names its guide

</div>

::right::
<<< @/snippets/cls-insert.js js

<<< @/snippets/cls-styles.css css

::foot::
Plan looks right? Click Proceed.

<!--
40:30 to 44:00

- Show the code: the announcement is created by JavaScript and inserted above the page after it has drawn. Nothing held its place.
- Removing the announcement is not a fix. It fails the "page still works" check.
- The space has to fit at the workshop width and on a phone.
- Proceed, read the diff. If the run stalls, use sample/reference/cls/ and say it is prepared.
-->

---
layout: trace
split: 4fr 7fr
---

::title::
# Measure again

::default::
<div class="df-checks">

- Same recording, hands off
- No shift when it arrives
- Phone width too (lab: 0.237 → 0)

</div>

::right::
<figure class="df-shot">
  <div class="df-shot-rows">
    <p class="df-shot-cap">Before</p>
    <img src="/captures/cls-before.png" width="840" height="132" alt="Reload of the starter: CLS 0.13 and a layout shift marker at about 2.5 s">
    <p class="df-shot-cap">After</p>
    <img src="/captures/cls-after.png" width="840" height="132" alt="Reload after the fix: CLS 0 and no layout shifts track at all">
  </div>
  <Credit>Own capture, Chrome 157 DevTools, 4x CPU slowdown</Credit>
</figure>
<LabValue compact value="0.131 → 0" what="CLS at 1280 px wide" />

::foot::
The announcement still shows. It just has its own space now.

<!--
44:00 to 47:00

- Record the same hands-off reload.
- The layout shift is gone, and the announcement is still there.
- In the "after" capture there is no Layout shifts track at all, and CLS reads 0. In this recording, no track meant no shifts.
- Resize to a phone width (390 px in prep) and check again.
- Lab values from prep, same setup as before.
-->

---

# What we found

<div class="df-found df-dense">
  <p><span class="df-label blue">LCP</span> The browser couldn't see the image until JavaScript set it. In the HTML, it loads right away.</p>
  <p><span class="df-label yellow">INP</span> Splitting the work wasn't enough. The browser also needed a chance to draw between batches.</p>
  <p><span class="df-label red">CLS</span> The announcement arrived with no space saved. Saving the space stopped the jump.</p>
</div>

::foot::
Each time, the second recording decided.

<!--
47:00 to 49:00

- One sentence per case. If today's live run ended somewhere else, say what we actually saw.
- The guide gave the agent good advice every time. The measurement told us whether it fixed our page. In INP it didn't, the first time.
-->

---
layout: presenter
---

# Take the loop home

- Repo: github.com/ivankristianto/<br>google-devfest-2026
- Prompts: `workshop/prompts.md`
- Video: youtu.be/PsrHq5F_BAc
- Notes: ivankristianto.com

Measure, ask, check, apply, measure again.

<!--
49:00 to 50:00, then questions until 60:00

- The repo has the shop, the prompts and AGENTS.md. Repeat all three cases at your own pace, including INP round 2.
- Links: official video https://www.youtube.com/watch?v=PsrHq5F_BAc, articles https://ivankristianto.com/chrome-modern-web-guidance and https://ivankristianto.com/testing-modern-web-guidance.
- On your own site: record a real journey, ask for a plan, check it, apply, record again. After you ship, look at real-visitor data.
- Questions. If a case ran over, finish it here from its prepared checkpoint.
-->
