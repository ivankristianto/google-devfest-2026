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
# The published deck has no presenter view and offers the PDF. Local dev keeps presenter mode.
presenter: dev
download: true
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

**Point:** the hour in three verbs: measure, guide, fix.

- Welcome. Read the title and stop on the three verbs. Measure, ask an agent with expert guidance, fix, then measure again. That's the whole hour.
- This is hands-on. You'll fix a real page with an AI agent, on your own laptop.
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
    <tr><th>Middle name</th><td>Performance</td></tr>
  </tbody>
</table>

::right::
<figure class="intro-photo">
  <img src="/speaker/ivan.jpg" alt="Ivan on a beach" width="400" height="400">
  <span class="df-label blue intro-tag">LCP element</span>
</figure>

::foot::
My AI agent's first fix looked right. The page stayed slow.

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
00:30 to 01:30

**Point:** who's talking, and a first taste of the word LCP.

- I'm Ivan. GDE for Web Performance since 2018, web engineer at Human Made, and co-host of the ngobrolin web podcast. The page we fix today is a copy of that podcast's site.
- Middle name: Performance. It's a joke, but making pages fast is what I've done since 2018. The next slide has the proof.
- The photo is the biggest thing on this slide. Browsers call the biggest thing on screen the LCP element. Remember the word, it's back in ten minutes.
- Footer: the first time my AI agent fixed a slow page, the code looked right and the page stayed slow. You'll watch that happen in the second case, and see how we caught it.
- How we work: I do each step on my screen, then you do it on yours. Fall behind? Just watch. Everything is in the repo to redo later.
-->

---

# Proof: 100 on mobile

<figure class="df-shot psi-shots">
  <div class="df-shot-pair">
    <div>
      <p class="df-shot-cap">ivankristianto.com</p>
      <img src="/captures/psi-ivankristianto.png" width="640" height="424" alt="PageSpeed Insights report for www.ivankristianto.com on Mobile: real users No Data, and 100 for Performance, Accessibility, Best Practices and SEO">
    </div>
    <div>
      <p class="df-shot-cap">ngobrol.in, the podcast</p>
      <img src="/captures/psi-ngobrolin.png" width="640" height="424" alt="PageSpeed Insights report for ngobrol.in on Mobile: real users No Data, and 100 for Performance, Accessibility, Best Practices and SEO">
    </div>
  </div>
  <Credit>PageSpeed Insights, Mobile, 15 November 2026. Lighthouse lab test, one run each.</Credit>
</figure>

::foot::
Lab test only. No real-visitor data.

<style>
.psi-shots .df-shot-pair { max-width: 980px; }
</style>

<!--
01:30 to 02:00

**Point:** the loop works on real sites, and a lab score is only half the story.

- My site and the podcast's site, tested in PageSpeed Insights with Mobile selected. 100 in all four.
- Mobile here means a mid-range phone on a slow mobile connection, simulated. That's a lab test, the same kind we run today.
- Look above the scores: "Discover what your real users are experiencing" says No Data. Too few visitors in Chrome's real-user data so far. Keep that in mind, it comes back at the end.
- Today you take a slow copy of the podcast site and make it fast, step by step.
-->

---

# Try the broken site

<div class="flex flex-col gap-7 mt-2">
  <div class="flex items-center gap-6"><span class="df-label blue">LCP</span> The main image shows up late.</div>
  <div class="flex items-center gap-6"><span class="df-label yellow">INP</span> Typing in search feels stuck.</div>
  <div class="flex items-center gap-6"><span class="df-label red">CLS</span> An announcement pushes the page down.</div>
</div>

::foot::
Run <code>npm run sample:serve</code>, open 127.0.0.1:4173/starter/

<!--
02:00 to 03:00

**Point:** feel the three problems before we name them.

- Show: open 127.0.0.1:4173/starter/ in Chrome. Attendees start it with the command in the footer.
- Show: in DevTools, set the network to Slow 4G, then reload. The big episode image arrives seconds after the rest of the page. Set it back to No throttling for the next two.
- Show: click the search box and type "coding". The page lags behind your typing.
- Show: reload and keep your hands off. A couple of seconds in, a yellow announcement drops in at the top and pushes everything down.
- Three problems, three labels. The next slide says what the labels mean.
- If asked: part of the image delay is added on purpose so it's easy to see. It's marked in the code.
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

**Point:** three numbers, each one something a visitor can feel.

- LCP, Largest Contentful Paint: how long until the biggest thing on screen shows up. Good is 2.5 seconds or less.
- INP, Interaction to Next Paint: after you tap or press a key, how long until the page visibly reacts. Good is 200 milliseconds or less.
- CLS, Cumulative Layout Shift: how much content moves on its own while you read. It's a score, not a time. Good is 0.1 or less.
- Tie back to the last slide: the late image is LCP, the stuck typing is INP, the jumping announcement is CLS.
- Together they're the Core Web Vitals. Google reads them from real visitors' Chrome. Today we measure on our own laptops, which is not the same thing. More on that after the first fix.
-->

---
layout: trace
split: 6fr 5fr
codeSize: 18px
---

::title::
# Modern Web Guidance

::default::

- AI coding agents learned from years of old web code. Some of it is out of date.
- Short guides by web experts from Chrome, Edge, Firefox and MDN.
- Version 1.0 came out on 10 November 2026, with 203 guides.
- One command adds it to your project. The agent finds it by itself.

::right::
<div class="df-box yellow df-quote">
  <p class="df-mono df-small">In its own words:</p>
  <p>"web APIs evolve rapidly and training weights contain obsolete patterns"</p>
  <p class="df-small">Plainly: browsers change fast, and what the AI learned gets old.</p>
</div>

```bash
npx modern-web-guidance@latest install
```

::foot::
Overview video: youtu.be/PsrHq5F_BAc (Chrome for Developers, 7 min)

<!--
05:00 to 06:30 (slides 6 to 8: about 5 minutes on guidance)

**Point:** why an agent needs guidance, and how you add it to a project.

- AI coding agents learned from years of web code. Much of it is old. Ask for a fix and you often get the most common answer, not the current one.
- Modern Web Guidance is a set of short guides written by web experts, one per task. People from Chrome, Edge, Firefox and MDN worked on it. Version 1.0 has 203 guides.
- The yellow box is the guidance describing itself. "Training weights" is what the AI learned. The last line says it plainly.
- The command adds it to your project as a "skill", a folder of instructions the agent reads. The agent finds it there by itself, so you don't have to mention it in every prompt.
- Footer: a seven-minute overview video from Chrome, for later.
- If asked about the count: the list command shows 208 entries because it also counts a few broad topic guides.
-->

---

# How the agent uses a guide

<div class="df-flow df-flow-4">
  <div class="df-box blue"><b>Search</b><span>a few words about the task</span></div>
  <FlowArrow />
  <div class="df-box yellow"><b>Read</b><span>one guide, all of it</span></div>
  <FlowArrow />
  <div class="df-box green"><b>Check</b><span>its code against the guide</span></div>
  <FlowArrow />
  <div class="df-box red"><b>Tell</b><span>which guide it used</span></div>
</div>

```bash
npx -y modern-web-guidance@latest search "prioritize hero image"
# optimize-image-priority, html, performance, ...
```

::foot::
No guide named? Then no guide was used.

<!--
06:30 to 08:00

**Point:** the agent looks things up before it writes code, and tells you what it used.

- Walk the four boxes left to right.
- Search: the agent turns your task into a few words. The command under the boxes is the same search, and you can run it yourself. For "prioritize hero image", the first result is optimize-image-priority.
- Read: it reads that one guide from start to end, not the whole library.
- Check: before it finishes, it compares its code with the guide's rules.
- Tell: its answer ends by naming each guide it used. Footer: no guide named means no guide used. That's your fastest check later.
- Before the event: rerun the search, results can change between releases.
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
Shortened from the optimize-image-priority guide. It can't see our page, so we measure first.

<!--
08:00 to 09:30

**Point:** a guide is specific and practical, but it can't see your page.

- This is the guide the agent will use in our first case, shortened.
- Steps: find the LCP image, then raise its priority with fetchpriority="high".

[click]

- Rules: some are musts, some are "do not". This one: don't lazy-load the LCP image while also asking for high priority. People do that a lot.

[click]

- Browser support: which browsers have the feature, and what happens in the others. "Baseline" means it works in all the major browsers, here since October 2024. Older browsers ignore the attribute. Nothing breaks.
- Footer, the catch: the guide says "raise the priority". It doesn't know our page only sets the image from JavaScript, late. A measurement shows that. That's why we always measure first.
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
  <div class="df-box blue"><b>Again</b><span>record the same way</span></div>
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
No App? In a terminal: <code>agy --mode=plan</code>

<!--
09:30 to 11:00

**Point:** five steps and three questions, the same in every case.

- Measure: record the problem in Chrome DevTools before anyone touches code. That's our "before".
- Ask: in Antigravity, type /plan, then the prompt. The agent reads the page and the guide and writes a plan. No code changes yet.
- Check: read the plan together with the three questions on screen. Read them out.
- Apply: if the plan passes, click Proceed. The agent edits the code and shows the diff, the lines it changed.
- Again: same recording, same way, fresh reload. That's our "after".
- Why we read before Proceed: plan mode is not a promise that nothing gets edited. Reading the plan is the human part of the job.
- Why the prompts are short: the repo has a rules file, AGENTS.md, that the agent reads every turn. Only edit the starter folder, measure before and after, say so when you can't see the page.
- Footer: no App? The terminal version, agy, does the same with agy --mode=plan. Shift+Tab switches modes.
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
- Model set to Gemini 4 Hydrogen
- Guidance installed: `.agents/skills/modern-web-guidance`
- Sample running at 127.0.0.1:4173/starter/
- The agent can open the sample

</div>

::right::
<Placeholder label="Antigravity App: model selector, a /plan prompt and the Proceed button" note="Capture from the rehearsed version. Credit: own capture." />

::foot::
Stuck? Watch my screen. You can repeat it all after the session.

<!--
11:00 to 14:00

**Point:** everyone at the same starting line before the first case.

- Go down the five checks. Hands up, or a reaction in chat, when all five are done.
- The model selector is under the prompt box. Pick Gemini 4 Hydrogen.
- No .agents/skills/modern-web-guidance folder? Run npx modern-web-guidance@latest install in the repo folder.
- Last check: ask the agent to open 127.0.0.1:4173/starter/ and tell you the page title.
- App won't start? Use the terminal version, agy, with the same sign-in.
- For me: personal accounts use the App's built-in browser. Business accounts and agy use /browser with Chrome.
- Sign-in and code redemption were done before today. Anyone stuck there watches my screen and repeats later.
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

**Point:** first case, LCP. We go slowly.

- First case: the main image shows up late. That's LCP.
- We go slowly this time so the steps feel familiar by the third case.
-->

---
layout: trace
split: 4fr 7fr
---

::title::
# Measure: record a reload

::default::

1. DevTools, **Performance** panel
2. Network: **Slow 4G**, like a phone
3. Click Record and reload
4. Find the **LCP**: which image, and when did it start downloading?

::right::
<figure class="df-shot">
  <img src="/captures/lcp-measure.png" width="840" height="383" alt="Chrome DevTools Performance panel after a reload of the starter on Slow 4G: LCP 5.40 s, and the LCP breakdown insight shows 2,763 ms of resource load delay before the hero image download starts">
  <Credit>Own capture, Chrome 157 DevTools, Slow 4G, 4x CPU slowdown</Credit>
</figure>

::foot::
Watch first, then do the same.

<!--
14:00 to 16:00

**Point:** the Performance panel tells you which element is the LCP and why it was late.

- Show: DevTools, Performance panel. Open the gear for capture settings and set Network to Slow 4G. On localhost every request is instant, so without this the problem hardly shows. Slow 4G is closer to a visitor on a phone.
- The circular arrow at the top is Record and reload. Click it and wait until it stops.
- Insights on the left: LCP is 5.4 seconds, in red. Good is 2.5, poor starts at 4.
- Click LCP breakdown. It splits LCP into four parts. "Resource load delay" is about 2.8 seconds: time before the browser even asked for the image.
- Read the Network track left to right: the page, then app.js and the stylesheet, then featured.json, and only then hero-episode.jpg. The image waits for a script, which waits for a data file.
- Ask the room: why would the browser wait so long to fetch the most important image?
- Before the event: check the panel names match the Chrome on screen.
-->

---
layout: trace
split: 1fr
---

::title::
# Ask: type /plan, then this

::default::

```text
LCP case. Open http://127.0.0.1:4173/starter/ and record a reload
with Slow 4G network throttling. Find the LCP element and when
its download starts. Use Modern Web Guidance on loading the hero
image early. Explain why it shows up late and propose the smallest
fix. Keep the same image at the same size.
```

::foot::
Copy it from workshop/prompts.md

<!--
16:00 to 18:00

**Point:** a good prompt says what to measure and what must not change.

- Type /plan in the prompt box, then paste.
- Read it line by line. Each line has a job: which case, what to record, which guidance to use, ask for the smallest fix, and the one thing that must stay the same.
- "Same image at the same size" stops a fix that trades the LCP problem for a layout shift.
- While it runs, point out when the agent searches and opens a guide. We expect optimize-image-priority.
- Attendees copy the prompt from workshop/prompts.md.
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

**Point:** read the cause in the code yourself, then judge the plan.

- Top code: the image address comes from JavaScript. It fetches a JSON file, waits, and only then sets src.
- Bottom code: the img tag in the HTML has a width and height but no src. The browser can't download an image nobody told it about.
- Read the three checks on the left against the plan.
- Watch for a plan that only adds fetchpriority="high". The guide suggests it, but alone it does nothing here: there's still no src until the script runs. A good plan puts src in the HTML, and may add fetchpriority as well.
- Plan passes? Click Proceed. Read the diff together. Every edit should be inside sample/starter/.
- If the run stalls: open sample/reference/lcp/ and say it's prepared.
-->

---
layout: trace
split: 4fr 7fr
---

::title::
# Measure again

::default::
<div class="df-checks">

- Same recording, Slow 4G, fresh reload
- The image download starts right away
- Same image, same size

</div>

::right::
<figure class="df-shot">
  <div class="df-shot-pair">
    <div>
      <p class="df-shot-cap">Before</p>
      <img src="/captures/lcp-before.png" width="222" height="114" alt="LCP breakdown before the fix on Slow 4G: resource load delay 2,782 ms">
    </div>
    <div>
      <p class="df-shot-cap">After</p>
      <img src="/captures/lcp-after.png" width="222" height="114" alt="LCP breakdown after the fix on Slow 4G: resource load delay 23 ms">
    </div>
  </div>
  <Credit>LCP breakdown, own capture, Chrome 157 DevTools, Slow 4G</Credit>
</figure>
<LabValue compact value="5.4 → 2.4 s" what="LCP, before → after" source="Lab, headless Chromium, Slow 4G, 4x slower CPU, middle of 5 runs" />

::foot::
Your machine helps find the cause. Real visitors decide the score.

<!--
21:00 to 24:00

**Point:** the second recording proves the fix, and a laptop number is not the real-visitor score.

- Ask the agent: "Measure again the same way and show before and after." Then record it yourself too.
- Keep Network on Slow 4G for this recording, or the comparison means nothing.
- Left table before, right table after. Resource load delay drops from about 2.8 seconds to about 20 ms. The image request now starts right after the HTML.
- What's left is mostly downloading the image itself, about 1.7 seconds on Slow 4G. If asked: a smaller image is the next fix, and DevTools already suggests it under "Improve image delivery".
- Check the page by eye: same image, same size.
- Yellow box: my practice runs, Slow 4G, the middle result of five: 5.4 seconds, poor, down to 2.4, good. The tables are one run with DevTools open, so the numbers differ a little. Yours will too. Look at the size of the change.
- Footer, say it clearly once: this is a lab number from your machine, good for finding causes. The score Google uses comes from real visitors, over the weeks after you ship.
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

**Point:** second case, INP. Two rounds, and the first one fails.

- Same loop, but the problem happens when you type, not when the page loads.
- Set Network back to No throttling now. With Slow 4G the 1.9 MB search data takes about 11 seconds to arrive, and search stays off until then. Keep the CPU at 4x.
- Heads up: two rounds. The first fix follows the guide and still isn't enough. That's the most useful moment of the hour.
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
3. Find the **key press**: what work runs under it?

::right::
<figure class="df-shot">
  <img src="/captures/inp-measure.png" width="840" height="383" alt="Chrome DevTools Performance panel while typing coding in the starter: INP 971 ms, and the INP breakdown shows 810 ms of processing, one long task that is mostly Layout">
  <Credit>Own capture, Chrome 157 DevTools, 4x CPU slowdown</Credit>
</figure>

::foot::
INP needs a real key press. A reload alone won't show it.

<!--
24:00 to 26:00

**Point:** INP needs a real key press, and the recording shows where the time goes.

- A different recording, no reload. Reload first and let the page settle. Click the search box, press Record, type "coding", press Stop.
- Insights: INP about 970 ms. Good is 200.
- Click INP breakdown. Three parts: input delay, processing, presentation. Processing is over 800 ms of work under one key press.
- Under it, the chart shows what the page was busy with, as stacked bars. The short yellow part on the left is our code, renderResults. The long purple bar is Layout, the browser working out where every result row goes. "coding" matches 1,686 lines; the first letter alone matches over 8,000.
- So our JavaScript isn't the expensive part. Putting the rows on the page is.
- A page-load test like Lighthouse won't show this. INP needs a real key press.
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

**Point:** protect the feature in the prompt.

- /plan, then paste.
- Two lines protect the feature: every result stays reachable, and fast typing shows only the latest search. Without them, an easy "fix" shows the first 50 results and calls it fast.
- We expect break-up-long-tasks.
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

**Point:** this code already pauses. The pauses are in the wrong place.

- Show the code. The loop builds one long HTML string and pauses every 50 ms to let the browser breathe.
- The last line is the expensive one: results.innerHTML = html. Every row goes in at once, and the browser lays them all out in one go. The pauses never touched that part.
- The agent will likely propose batches of rows with scheduler.yield() between them. That's a fair first plan. Approve it if it passes the three checks, and say out loud: we'll measure it.
- Reject anything that caps results, like showing only the first 50.
- Proceed, read the diff.
- If the run stalls: open sample/reference/inp-yield-only/ and say it's prepared.
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
- The code now has <code>scheduler.yield()</code>
- The recording still shows one long block

</div>

::right::
<figure class="df-shot" style="--shot-h: 220px">
  <img src="/captures/inp-round1.png" width="840" height="383" alt="Round 1 interaction trace: INP 630 ms, and one long Layout block still sits under the key press, so the next key waits 514 ms">
  <Credit>Own capture, Chrome 157 DevTools, 4x CPU slowdown</Credit>
</figure>
<LabValue compact value="632 ms" what="slowest key press, round 1" />

::foot::
Code that looks right is only a guess until you measure it.

<!--
30:00 to 32:00

**Point:** code that follows the guide can still leave the page slow. Only the recording tells you.

- Record the same typing on a fresh reload.
- In the capture: processing is now 0 ms, so our code did break up. But there's still one long purple Layout bar, and the next key press waited 514 ms behind it. DevTools calls that wait the input delay.
- What happened: the batches went into the page faster than the browser drew them. They piled up and were laid out together, in one long pass.
- Yellow box: slowest key press 632 ms in practice runs, down from about 1,940. Better, still far from 200. The capture shows 630 ms from one run with DevTools open.
- Say what today's recording shows. Don't turn it into "scheduler.yield() doesn't work". It worked. It wasn't enough here.
- Check: same result count, every line still there.
-->

---
layout: trace
split: 3fr 8fr
codeSize: 20px
---

::title::
# Round 2: let the browser draw

::default::

Let the browser draw each batch before starting the next one.

<span class="df-label outline">I lead this one</span>

::right::
<<< @/snippets/inp-batch-loop.js js

<LabValue compact value="32 ms" what="slowest key press, round 2" />

::foot::
Round 2 prompt: workshop/prompts.md

<!--
32:00 to 37:00

**Point:** give the browser a moment to draw each batch.

- I drive this round. You watch, and repeat it later from workshop/prompts.md.
- /plan with the round 2 prompt. It asks the agent whether the browser gets to draw between batches.
- The code: same batches, one new line. await nextFrame() waits until the browser has drawn the screen once, then we pause. Each batch is on screen before the next one starts.
- Same three checks: every result, latest search only, guide named. Proceed, read the diff, record the same typing.
- Yellow box: 32 ms in practice runs, from 632 in round 1.
- If asked about the trade-off: long lists now fill in over many frames. The first rows show right away, the last ones a moment later.
- If the run stalls: open sample/reference/inp/ and say it's prepared.
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

**Point:** last case, CLS. It goes faster.

- Last case. You know the loop now, so this one moves quicker.
- The page jumps. That's CLS.
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
Touch the page and the shift won't count. Hands off.

<!--
37:00 to 39:00

**Point:** find what moved and what pushed it, without touching the page.

- Same recording as LCP, with Network still on No throttling: Record and reload. Then hands off the mouse and keyboard.
- Footer, why hands off: a shift right after a click or key press doesn't count toward CLS, because the visitor expects the page to change then. Touch the page and you hide the problem from yourself.
- Open "Layout shift culprits" in Insights, then hover the purple diamond on the Layout shifts track. DevTools plays the shift on a small screenshot.
- Score 0.1308, at about 2.5 seconds. The yellow announcement lands at the top and pushes the episode down.
- The episode moved, but it did nothing wrong. The announcement pushed it. Fix the thing that pushes.
- The insight found no culprit for this shift. The preview shows the cause anyway.
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

**Point:** keep the feature, and test more than one screen size.

- /plan, then paste.
- "Keeps the announcement" rules out the easy non-fix: deleting it.
- "A desktop width and a phone width": text wraps differently on a phone, so the space it needs changes.
- There may not be one guide just for this. Read which guides the agent names.
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

**Point:** the fix is to save the space before the content arrives.

- Top code: the script creates the announcement and inserts it before main, after the page has drawn. Nothing held its place.
- Bottom code: its CSS has padding and margins, but nothing reserves its height before it exists.
- Read the four checks on the left against the plan. The space has to fit on a phone too.
- Not a fix: removing the announcement. It fails "does the page still work the same".
- Proceed, read the diff.
- If the run stalls: open sample/reference/cls/ and say it's prepared.
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
- Phone width too (0.237 → 0 in the lab)

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
<LabValue compact value="0.131 → 0" what="CLS, desktop width" />

::foot::
The announcement still shows. It just has its own space now.

<!--
44:00 to 47:00

**Point:** no shift, and the announcement is still there.

- Record the same hands-off reload.
- Top row before: CLS 0.13 and a diamond on the Layout shifts track. Bottom row after: CLS 0, and in this recording no Layout shifts track at all.
- Check the page: the announcement still appears.
- Resize to a phone width, about 390 pixels, and check again. In practice runs, phone CLS went from 0.237 to 0.
- Yellow box: practice runs, same setup as before.
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

**Point:** one lesson per case, and the habit behind all three.

- LCP: the browser can't download what it hasn't been told about. Put the important image in the HTML.
- INP: splitting the work is half the job. The browser also needs a chance to draw between pieces.
- CLS: if something will appear later, save its space now.
- Footer: each time, the second recording decided whether we were done. The guide gave good advice every time. It couldn't see our page.
- If today's live run ended somewhere else, say what we actually saw.
-->

---
layout: trace
split: 7fr 4fr
---

::title::
# Take the loop home

::default::
<div class="df-found home-points">
  <p><span class="df-label blue">1</span><span><b>Record twice.</b> Before the change and after it. The second recording decides.</span></p>
  <p><span class="df-label yellow">2</span><span><b>Read the plan.</b> The guide makes the agent better. Only you can check it against your page.</span></p>
  <p><span class="df-label red">3</span><span><b>Laptop finds, visitors decide.</b> Find the cause on your machine. Real visitors set the score.</span></p>
</div>

::right::
<figure class="home-qr">
  <img src="/qr-repo.svg" width="300" height="300" alt="QR code linking to github.com/ivankristianto/google-devfest-2026">
  <figcaption>Sample, prompts and agent rules<br><span class="df-mono">github.com/ivankristianto/<br>google-devfest-2026</span></figcaption>
</figure>

::foot::
Notes: ivankristianto.com

<style>
.home-points { gap: 26px; }
.home-points p { grid-template-columns: 64px 1fr; font-size: 30px; line-height: 1.25; }
.home-points .df-label { text-align: center; padding: 2px 0; }
.home-qr { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.home-qr img {
  display: block; width: 260px; height: 260px;
  border: var(--df-stroke) solid var(--df-ink); border-radius: 20px; padding: 10px; background: #fff;
}
.home-qr figcaption { text-align: center; font-size: 22px; line-height: 1.3; }
.home-qr .df-mono { font-size: 20px; }
</style>

<!--
49:00 to 50:00, then questions until 60:00

**Point:** three habits to keep, and the repo to practise with.

- Leave the QR code up while you talk. People scan it during the first bullet. The repo has the site, the prompts and the rules file, so they can redo all three cases at their own pace, round 2 included.
- Record twice: before and after every change. Today the second recording caught a fix that looked right and wasn't.
- Read the plan: the guide made the agent's advice better each time, but it never saw our page. That check is your job.
- Laptop finds, visitors decide: your laptop is where you find causes. After you ship, real-visitor data tells you if it worked. Remember the "No Data" on the two sites at the start: a 100 in the lab is not the same as real visitors having a fast page.
- On your own site next week: pick one slow thing a visitor would notice and run the loop once.
- Questions until the hour. If a case ran over, finish it here from its prepared folder.
-->
