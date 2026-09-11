---
name: patrician-site
description: Operating manual for patrician.ch, Yakir Hannan's UHNW relocation site (the board of 100 addresses, the globe, the Patrician Engine, the Private Dossier). ALWAYS use this skill when Yakir mentions patrician, patrician.ch, the board, the globe, the engine, the dossier, a city on the board, a Pexels clip for the site, the Supabase backend, Stripe for the site, the SEO city pages, or asks to add, remove, swap, fix, verify, or improve anything on the site. It holds the goals, the rules, the data model, the media procedure, the deploy procedure, the validation rules, the monetization plan, the backend, everything already shipped, and everything still open. Never work on the site freestyle. This file is the only valid path.
---

# PATRICIAN.CH

## 0. Read this first

You are continuing a build that has run across 8 sessions since 09.09.2026. Yakir does not want to re-explain anything. A new chat must behave as if it was there for all of it.

Before the first edit in any session:

1. Read this whole file.
2. Read the memory file `/projects/01a07170-6b7f-71c8-80e0-2196ccaa7e52/areas/patrician-site.md` for anything decided after this file was written.
3. Check the repo state: `git -C /home/claude/site log --oneline -3` and `grep -o "patrician.js?v=[0-9]*" /home/claude/site/index.html`. If `/home/claude/site` does not exist, clone `github.com/yakir-ai/patrician` into it (main branch) and `github.com/yakir-ai/patrician-desk` into `/home/claude/backend`.
4. Never assume the live site matches your memory of it. Look at the files.

Yakir works fast, on his phone half the time, sends screenshots, and says "fix" or "go". Do the work, push it, report the commit hash and what changed in a few sentences. Do not ask questions you can answer by reading the code. Ask only when the decision is his (a board swap, a pricing change, a copy direction).

## 1. What the product is

**One sentence:** patrician.ch answers "Where should a high earner actually live?" with a ranked, modeled answer on the reader's own income, passports, and family, across 100 tier-one addresses, and sells the written-up answer as a paid Dossier.

**The page, in order (section numbers are part of the design):**

- Hero: "Where should a high earner *actually* live." Eyebrow "Your private relocation desk". Lede (29 words, digits): "Every serious address on 5 continents, ranked for your income, your passports, and your family. 90 seconds to the answer, and an ordinary day in the city that wins." CTA "Run the engine →", secondary "See the 100 addresses ↓" (to #atlas). Stats row: jurisdictions, passports compared (65), millionaires relocating in 2025 (142,000).
- 01 · The board (`#atlas`): a horizontal rail of 100 city cards, each on a film, with cost index, safety, and the country's net millionaire inflow. Tap opens the theatre (full-screen film with the numbers).
- 02 · The globe (`#globe-sec`): canvas globe, parchment continents on ink-black seas, gold bezel, every city pinned, gold arcs from the reader's home to their top 3, tap a pin for the HUD card, list of all 100 under it.
- 03 · The question (`#thesis`): the thesis and the 4 pillars (Where, Which passport, How, What it looks like).
- 04 · The Patrician Engine (`#engine`): presets (Executive with kids, Founder before exit, Investor after exit, Builder remote), 10 filters, income and exit sliders, passports held (US, EU, UK, Switzerland, UAE, Canada, Australia, Singapore, Japan, Israel, Other, in that order), household (Solo, Couple, Kids), home base, 8 weight sliders (Keep more, Safety, Schools, Sun, Near home, Beauty, Cost sensitivity, Ease of entry), ranked results, "keep my ranking" email capture.
- 05 · The Passport Ladder (`#passports`): 65 passports compared, Henley 2026 mobility scores, redrawn passport artwork.
- 06 · The Structure (`#structure`): 4 archetype patterns (The Executive, The Founder, The Investor, The Builder) and 2 overlays, entity sketches, glossary tooltips.
- 07 · The Life (`#life`): "An ordinary day in {city}", film, 4-stop day, 4 stat tiles (supercar street index, effective tax, sun hours, flight from home), prev/next/select navigation, "Near {city}" mosaic of the 8 closest addresses.
- 08 · The Private Dossier (`#report`): FOMO block "Six doors closed this year", 3 tiers, request form, preview logic.
- 09 · Questions (`#faq`): FAQ with schema.
- Footer: Explore links, legal links, "Made with love in Switzerland" with the heart icon, all rights reserved.

**Other pages:** `/dossier.html` (the preview and the paid document renderer, chapters 1 to 4 open, 5 to 9 locked), `/legal.html` (#terms #privacy #cookies #disclaimer #ip), `/cities/<id>/` (100 SEO pages), `/compare/<a>-vs-<b>/` (about 90 head-to-heads), `/cities/` and `/compare/` hubs, `sitemap.xml`, `robots.txt`.

## 2. Goals, in priority order

1. **Money.** At least $10,000 a month from the site, mainly from the $149 Dossier sold on autopilot with zero human work per order. Yakir said: "We must make $10,000 every month. Focus on that fact." Every product decision is judged by whether it moves a reader toward paying $149.
2. **Never give the Dossier away.** The free view is a preview (chapters 1 to 4). Chapters 5 to 9 are paid. Yakir caught an earlier version that showed the whole thing before payment and was right to kill it.
3. **World class, nothing generic.** His opening brief: "Something you don't see often. No half ass generic shit." Every screen must look like a private bank made it. Everything moves smoothly (fades, slides, no components popping in).
4. **True numbers.** He caught the Henley country figure being shown as if it were city data. "Check everything that everything will be true and no mistakes." Accuracy beats impressiveness.
5. **Fun places stay.** The board is a list of places wealthy people actually go, not only tax-optimal ones. Cancún, Tulum, Bali, Las Vegas, Cape Town stay even where the tax case is weak.

The $1,900 Architecture tier and the by-application Move tier exist in the copy. Yakir is unsure how to deliver them (needs vetted counsel per region). Do not build delivery machinery for them until he says so. Do not remove them from the page either.

## 3. Yakir's rules for this site

These came from him directly across the sessions. They are not negotiable.

**Board and content**
- 100 addresses, always exactly 100. Tier-one only, plus the fun places rule above.
- No Arab country on the board except the UAE (Dubai, Abu Dhabi). Doha, Riyadh, Bahrain, Muscat, Marrakech are out. He said "no Riyadh" and "only UAE" more than once.
- Palestine is banned from everything permanently. A Milan clip with Palestine flags was replaced the moment he saw it. Check every clip for flags and political content before using it.
- No Tel Aviv or Israel emphasis on the board. Tel Aviv is on the board as one of 100, nothing more. Israel is in the passport list after Japan.
- Cities that are high tax and left leaning are labeled so (CLIMATE `left`). Capital-friendly places are labeled "Capital friendly" (CLIMATE `free`). He asked for this explicitly ("if it's good for our goals"). Vienna and Munich are not labeled left after he questioned it. Munich is `tax` (high tax) only.
- Tooltips on any jargon (lump sum, NHR, non-dom, HNWI). "Be crystal clear."
- The word is "addresses", not "places", in product copy (he asked why, was told, and kept it).
- No "Operated from Tel Aviv". The footer says made with love in Switzerland with the heart icon (not an emoji, not the italic heart).
- The site is Swiss-branded: `.CH` is part of the logo and must stay visible ("there are many sites called patrician").
- Never write "who is behind Patrician" copy that sounds like a mid-level PM. It must sound impressive to billionaires.

**Media**
- Every city runs on a film clip. Never a still, never a photo grid. He has said "no photos, only high end looking videos" at least 4 times, and "make sure everybody has a video, not image" again on 10.09.2026.
- Real footage only, from Pexels (Unsplash for the odd photo), never AI generated images or video.
- No copyrighted material. He linked RETINAA's Swiss passport photographs. They were refused and the passport was redrawn instead. Same for the Patek 5712 page video (used only if a Pexels equivalent exists).
- Clips must show the place as the reader imagines it: Paris shows the Eiffel Tower, London the towers or Big Ben, Tel Aviv the skyline and beach (a Netanya clip was rejected), Zug not Zurich, Miami with yachts (Brickell).
- The Ferrari clip is the F8 Tributo and the supercar tile must show the yellow prancing horse badge.
- Favicon and logo mark: Swiss flag inside a shield, red `#cb003b`, transparent background, no black box. He was angry the black background survived one round. Check it.

**Writing (his global rules, applied here)**
- American English. Digits for numbers (3 not three, 90 seconds not ninety). "%" not "percent".
- No em dashes, no en dashes, no semicolons, no tildes, no horizontal rules, no "e.g.".
- No rule-of-three lists, no "It's not X, it's Y", no "Here's the thing", no fake-deep closers, no wrap-up conclusions, no LinkedIn punchlines.
- Banned words: delve, underscore, showcase, foster, harness, unveil, tapestry, landscape, testament, realm, intricate, pivotal, vibrant, meticulous, crucial, robust, seamless, foundational, nudge.
- Never present an ask as a confirmed action. Never fabricate a number, a name, a threshold, or a source.

**How to work with him**
- Do the work, then report: commit hash, what changed, what to verify. Short.
- When he asks "yes?" or "wdyt", answer with a position, then act if he says go.
- Screenshots are bug reports. Read the pixels, find the cause in the code, fix it, push.
- He refreshes Safari on an iPhone. GitHub Pages takes about a minute. Tell him to pull to refresh when the fix depends on a new `?v=`.
- Flag a risk to him once (money, legal, candidacy), then his decision is final.
- If he says "roll back", roll back exactly, do not improve on the way.

## 4. Stack, repos, deploy

- **Front end:** static. `index.html` (all CSS and the page JS inline), `patrician.js` (the data: the 100 records, all maps, the helpers `PX`, `PV`, `VALT`, `signed`, `computeRows`, `flowLabel`, `trend`), `land.js` (land polygons for the globe), `globe-tex.jpg` (NASA Blue Marble relief baked to parchment), `passports.svg`, `favicon.svg`, `og.png`, `dossier.html`, `legal.html`.
- **Hosting:** GitHub Pages from `yakir-ai/patrician`, main branch, public. Cloudflare in front for DNS and HTTPS. `vercel.json` is a leftover from the first deploy attempt and is not used. There is no build step on the host: push to main and it is live in about a minute.
- **Cache busting:** `index.html` loads `patrician.js?v=NN`. Bump `NN` every time `patrician.js` changes, otherwise phones keep the old data. As of this file: v=40.
- **Backend:** separate private repo `yakir-ai/patrician-desk`, local at `/home/claude/backend`. Supabase (Postgres + 4 edge functions + private storage bucket), Stripe Checkout, Resend email, Anthropic API for the dossier text. Not deployed yet (see section 12).
- **Commit style:** one line, plain, what changed and why it matters. Examples used: "Board: Jersey and Quinta do Lago in, Anguilla and Ravello out. Pages rebuilt", "Mobile: globe fits inside its frame with its bezel, more air under the map title".
- **Always before commit:** `node --check patrician.js`, and syntax check the 2 inline scripts of `index.html` by extracting them (regex `<script(?![^>]*src)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>` to files, `node --check` each). This has caught a broken quote every second session.
- **Push:** `git add -A && git commit -qm "..." && git push -q origin main`. The remote is authenticated already in the sandbox. If it is not, ask Yakir for a fresh token rather than reusing the one in the transcript (see section 13).

## 5. Design system

- Colors: `--ink #0a0a0c`, `--ink-2 #111114`, `--ink-3 #18181d`, `--ivory #f2ecdf`, `--bone #d6cdbb`, `--mute #8a8373`, `--line rgba(242,236,223,.12)`, `--gold #c4a468`, `--gold-2 #8b7440`. Brand red for the mark and the heart: `#cb003b`.
- Type: Cormorant Garamond (display, light 300), Jost (UI, tracked caps). Font load is gated so the hero does not flash.
- Motion: `--ease: cubic-bezier(.22,1,.36,1)`. Everything reveals with `.rv` (opacity + translateY) on scroll, staggered with `.d1 .d2 .d3`. Nothing may pop in. He has sent 6 messages about choppiness.
- Layout: `section` padding `clamp(76px,11vw,170px) clamp(20px,6vw,96px)`. Mobile breakpoint is `max-width:899px`. Desktop grid for the globe section is `1fr 1.1fr` with the globe sticky at `top:96px`.
- Globe: canvas, radius `R0 = s * .44 * dpr` on desktop and `s * .385 * dpr` on phones (the bezel draws to `1.22 R`, so anything above .40 on a square phone canvas gets clipped). Auto-spin starts immediately on load, pauses on drag, resumes after 500 ms. Labels never run under the bezel: a label that would cross the rim flips to the other side of its pin, else it is dropped. Phones show labels only for `z > .66` (facing you), desktop `z > .42`. Top 3 and the selected city always keep labels.
- Stat tiles (`.basket div:before`): image masked top to bottom (`linear-gradient(180deg, transparent 0%, rgba(0,0,0,.18) 30%, rgba(0,0,0,.62) 58%, #000 100%)`), image anchored `50% 60%`, opacity .62.
- Mobile globe section order: eyebrow, headline, hint ("Drag sideways to rotate · pinch or scroll to zoom · tap a city"), globe, lede, pins list. Achieved with `display:contents` on the text column and `order`. The hint is above the globe on phones, below it on desktop.
- The HUD card on phones sits under the globe with 26px of air and the page scrolls so its top lands at 46% of the screen when a pin is tapped.
- Section separators are gradients, not lines. Backgrounds are films with a dark gradient over them, frozen on phones where needed (`data-freeze`).

## 6. The data model (`patrician.js`)

Every city is one object in the `J` array. Records are one line each except a few historical ones (London spans lines): **always locate a record's end with the next `\n{id:'`**, never with the next newline. Cutting at a newline removed half of the London record once.

```js
{id:'xxx',cc:'cc',city:'Name',country:'Country',flag:'🇽🇽',cur:'USD',lat:0.00,lon:0.00,
 vid:PV(pexelsId,'file.mp4','poster-slug',altFile?),imgs:[],
 br:[[0,.10],[50000,.20]],br2?:[[0,.025]],add?:.02,cg:.20,
 regime?:'one sentence, the special regime for new residents',
 cost:80,safe:8,school:6,sun:2800,beauty:7,wealth?:1,
 visa:{eu?:1,us?:1,il?:3,uk?:3,ca?:3,au?:3,jp?:3,ch?:3,_:2,t:'the route in, 2 to 4 sentences'},
 lede:'2 sentences, the pitch',
 day:[['07:30','Place','One line.'],['10:00','Place','One line.'],['13:00','Place','One line.'],['18:00','Place','One line.']]},
```

Field rules:
- `id`: 3 letters, unique, lowercase. Used in URLs (`/cities/<id>/`, `/?pick=<id>`), so never rename an id of a live city.
- `cc`: ISO country code, lowercase. It keys `FLOW`, `FLOW24`, and `MOB` (`FX` is keyed by currency, not by country). Crown dependencies and territories get their own code (Jersey `je`, Gibraltar `gi`) so they do not inherit the UK's outflow figure. Add their passport score to `MOB` by hand (`je:68.3`, `gi:68.3`, the British figure). Cities with no country record (Anguilla had none) omit `cc`.
- `cur`: the currency the brackets are written in. `FX` converts to USD. Casa de Campo is `USD` on purpose (the market prices in dollars).
- `br`: marginal brackets `[threshold, rate]` in local currency, ascending. `br2`: a second stack (US states, Swiss cantons). `add`: a flat surcharge on top (solidarity, municipal). `USF` is the federal US table. US cities use `br:USF` plus `br2` for the state, `cg` = 20% + 3.8% NIIT + state.
- `cg`: capital gains rate on a $1M gain, as a fraction. 0 where there is none.
- `regime`: the special regime a new resident can elect, one sentence, with the figure. The engine shows it as a tag and on the city page. The default system stays in `br` and the wealth regime lives here (Jersey HVR, Gibraltar Category 2, Italy lump sum, Portugal IFICI, Spain Beckham, Greece non-dom, Switzerland lump sum). This is the rule: numbers on the default system, regime in the note.
- `cost`: index, Zurich = 100. `safe`, `school`, `beauty`: 1 to 10. `sun`: hours a year. `wealth:1` where a wealth tax applies (also add the id to `STR.wealth`).
- `visa`: `_` is the default friction for an unlisted passport (1 walk in, 2 investment or application, 3 harder, 4 quota permit). Per-passport overrides use the engine's passport keys. `t` is the human text.
- `lede` and `day`: see section 8 for voice.

The aux maps, all keyed by id unless noted:
- `ORDER`: the board order (roughly geographic: Switzerland, Monaco, France, Italy, Central Europe, Spain, UK, Portugal, Greece, Cyprus, Malta, Middle East, Asia, Pacific, Africa, US East, US Central, US West, Canada, Mexico, Central and South America, Caribbean). Insert new cities next to their neighbors.
- `SIG`: `[ferrari, lamborghini, rolexAndPatek]` 1 to 5, drives the supercar street index (ranked 1 to 100).
- `TZ`: IANA zone for the local clock.
- `VR`: doors, subset of `DOORS` keys: `inv` Golden visa, `cbi` Citizenship by investment, `talent` Founder & talent, `lump` Lump sum residence, `nomad` Remote work visa.
- `STR`: sets `terr` (territorial or zero tax), `reg` (has a regime), `wealth` (wealth tax), `lump` (lump-sum style regime). `FILTERS` read these.
- `CLIMATE`: sets `free`, `left`, `tax`, rendered as pills via `CLIM`.
- `FLOW` and `FLOW24` (keyed by `cc`): Henley net millionaire inflow 2025 and 2024, country level. `FLOWNOTE` (by id): one sentence where the city's reality differs from the national figure (California cities, Maui, Vancouver, London). The label is always "{Country} net millionaire inflow 2025" so no reader mistakes it for a city figure.
- `MOB` (by `cc`): Henley 2026 Wealth Mobility score, 0 to 100.
- `HOMES`: the home base list for flight time.
- `VALT`: filled by `PV` when an alt file is given. The player's last fallback.

`computeRows(S)` is the ranking: tax on income, capital gains on the exit, `kept10 = net*10 + exit - cg`, visa friction from the reader's passports, flight time from home, then a weighted score over 8 normalized factors (`tax, safe, school, sun, prox, beauty, cost, visa`), school weight scaled by household. Tags: 0% income tax, low effective tax, regime, wealth tax, US tax floor (US passport holders are taxed at least at US rates everywhere), walk in, quota permit, under 5h from home, top 4 wealth magnet, net wealth exodus.

## 7. Adding, removing, or swapping a city (the exact procedure)

1. **Decide with Yakir.** Propose out and in with one line of reasoning each, wait for "go".
2. **Find the film first** (section 9). No film, no card.
3. **Research the numbers.** Brackets, capital gains, regime, residence route, cost, safety, sun, school. Write the record with real figures. Where a figure is converted or approximated, say so in the report (Casa de Campo DOP thresholds were converted at a round rate and flagged).
4. **Write the record** on one line, insert after its geographic neighbor using the `\n{id:'` boundary.
5. **Update every map:** `SIG`, `TZ`, `VR`, `STR` (terr / reg / wealth / lump as applicable), `CLIMATE`, `ORDER`, `MOB` if the country is new, `FLOWNOTE` if the national figure misleads.
6. **Remove the outgoing city** from the record list and from every map and set. Grep for `'xxx'` afterwards. 0 hits.
7. **Pitfalls that have bitten:** `re.sub(r"Set\(\['", ...)` eats the quote, leaving `['gib',jer'`. `.replace("'nas','sbh'", ...)` with `count=1` hits `STR` before `ORDER` because `STR` is defined first. Multi-line records. Forgetting `MOB` for a new `cc`. Forgetting `imgs:[]`.
8. `node --check patrician.js`. Count `{id:'` equals 100. `ORDER` has 100 entries.
9. **Delete stale generated pages** for the outgoing id: `cities/<id>` and every `compare/*-vs-<id>` and `compare/<id>-vs-*`. The generator does not clean up.
10. **Rebuild pages:** `node tools/build-pages.mjs` from the repo root. Expect "wrote 100 city pages, N comparisons, 2 hubs, sitemap with M urls". Check for "missing aux" warnings (Dallas once lacked `SIG` and `TZ`).
11. **Regenerate the structured data** city list in `index.html` (the `itemListElement` array inside the ld+json), from `ORDER` and the records, 100 items "City, Country".
12. **Bump `?v=`** in `index.html`.
13. Syntax check both inline scripts, commit, push, report with the effective tax at $1M for each new card (read it from the generated page).
14. **Verify list:** name in the report the figures a paid dossier must confirm (thresholds, surtaxes, program minimums).

## 8. Writing the content of a card

Voice: a private desk that has lived there. Specific, short, no adjectives doing the work. Numbers in digits. The reader is a founder, executive, or investor with $300K to $5M a year.

- `lede`: 2 sentences. First names the place in one concrete image, second gives the tax or residence fact that makes it an address. Example: "The Crown Dependency 20 minutes off Normandy that has been the quiet British answer since before Monaco had a casino. 20% and then 1%, no capital gains tax, no inheritance tax, 14 miles of coast, and a flight to London that takes less time than the Tube to Heathrow."
- `day`: 4 stops, morning to evening, `[time, place, one line]`. One stop is the paperwork (the notary, the LLC, the residence certificate), one is the water or the view, one is lunch somewhere real, the last is the flight or the drive out with times to 2 real cities. Real place names only. Do not use the same weekday device every time (he asked why everything was "Tuesday").
- `regime`: one sentence, the rate or the cap, who qualifies, how long it lasts.
- `visa.t`: how each passport gets in, the price of the door, and one line of life logistics.
- City pages get FAQs and "near city" cards automatically from the record. Write nothing extra there.
- Numbers that are country level say so in the label. Never let a national figure sit next to a city name without the country in the label.

## 9. Media: how clips are found and wired

Source: **Pexels only** (free license, commercial use). Never AI, never a stock site that needs a license, never a screenshot of someone's video.

Procedure that works from the sandbox (which cannot reach pexels.com directly, only through `web_search` and `web_fetch`):

1. `web_search` for `"Download this video" pexels <place> <subject>` or `pexels.com/video <place> aerial`. Hits come back as `https://www.pexels.com/video/<slug>-<id>/`.
2. `web_fetch` that video page. Read 3 things: the `meta-article:tag` list (confirms the place, "Izmir" on a clip titled Gibraltar means it is not Gibraltar), the `og:image` (the poster: everything between `/videos/<id>/` and `.jpeg` or `.jpg`), and the Canva "Edit in Canva" link, whose `file-url` is the master file name (`<uid>_2560_1440_60fps.mp4` or `<id>-uhd_2560_1440_25fps.mp4`).
3. Build the record: `vid:PV(id,'<720p file>','<poster slug>','<master file>')`. The 720p name follows the master's pattern with `1280_720` in place of the master resolution and the same fps. It is inferred, not verified, so **always pass the master as the 4th argument**. `PV` registers it in `VALT` and the player falls back to it if the 720p name 404s.
4. Posters ending `.jpg` (older uploads) are passed with the extension. `PV` only appends `.jpeg` when there is no dot.
5. Search pages (`pexels.com/search/videos/<term>/`) can be fetched once their URL has appeared in a search result. They list 30 clip slugs cheaply. Fetch a video page only for the clip you intend to use. Each fetch costs about 10K tokens.
6. Prefer clips filmed in the place. When only a stand-in exists (Niseko runs on a European forest, Jersey on a pier that is not Jersey, Provence on a lavender field that is not tagged Provence), say so to Yakir in the report and offer a licensed clip from iStock or Getty (about $60 to $170) as the honest fix.
7. Check the clip for flags, politics, crowds, watermarks, and anything a billionaire would not want on his screen.
8. Phones: `srcFor()` swaps `_1920_1080_` for `_1280_720_`. The error handler tries the given file, then `VALT`. Films are warmed 120% of a screen ahead (`vwarm`), muted and `playsInline` set by property before `play()`, retried on touch and scroll. Low Power Mode on iPhone blocks all autoplay at OS level. Nothing to fix there.
9. Never ship a card on stills. Verify with: `grep -o "{id:'[a-z]*',[^}]*" patrician.js | grep -vc "vid:PV"` must print 0.

Clips already licensed-quality and in use worth keeping as references: Fort Lauderdale 20619611, Barcelona 20066590, San Diego 17595973, Algarve 29865804, Punta Cana 3576316, Dalmatian coast 11102628, Nashville 26605317, Gibraltar 34550382, Arizona 30848103, Ibiza 26588488.

## 10. Data validation rules

- Every number on the site must be defensible with a source Yakir could be shown. Where you are not sure, write "verify" in the record's regime text is not acceptable on the page. Instead keep the figure you believe correct and put the verify note in the report to Yakir and in the pending list.
- Tax brackets: from the national revenue authority tables for the current year. Surcharges as `add`. Currency in `cur`.
- Capital gains: the rate a resident individual pays on a $1M gain in listed securities, after the common exemptions (2 year holding rule for Croatia, participation exemptions ignored).
- Henley inflow: country level, 2025 report, `FLOW`. 2024 in `FLOW24`. Arrow is the 2025 sign. Trend text compares to 2024. Add a `FLOWNOTE` when the city is a net exporter inside a net importer country (California, Hawaii) or the reverse.
- Mobility: Henley 2026 Global Wealth Mobility score in `MOB`, by country.
- Passports: the full 65-passport audit was done in session 6 (Israel citizenship text was wrong and fixed). Any passport claim on the page must match the country's current naturalization rule.
- Residence programs: name the program (Golden Visa, Category 2, HVR, LTR, Premium Residency), the minimum, and the year of the rule. Portugal's Golden Visa is funds only (no real estate) and citizenship moved to 10 years in May 2026. Spain's Golden Visa closed April 2025. The UK non-dom regime was replaced by a 4 year window in April 2025. Malta's investor citizenship was struck down April 2025. These closures are the FOMO block and must stay accurate.
- Figures flagged for verification before any paid dossier ships: Jersey HVR (£1.25M / £250K minimum / £3.5M home), Gibraltar Category 2 (£118K / £44,740 / £37K), Dominican Republic brackets (converted from DOP) and the 4th-year rule on foreign financial income, Croatia municipal surtax for Hvar town, Italy lump sum current figure, Thailand LTR terms, every "verify current thresholds" phrase left in a `visa.t`.
- Numbers must render with `signed()` (true minus U+2212) and `toLocaleString`.

## 11. Mobile and UX rules learned the hard way

- Films: set `muted`, `defaultMuted`, `playsInline` by property before calling `play()`. Call `load()` after attaching the source. Play on the `playing` event, not on `canplay`.
- Atlas rail: each playing card warms the next 2. Sideways scroll wakes the in-view card.
- Globe on phones: radius .385, hint above, lede 22px below, title 30px above, atlas-to-globe gap about 60px (was 160px).
- Globe labels: rim-aware flip or drop. Sparser on phones.
- HUD card: opens under the globe on phones and scrolls into frame. The pins list under the globe scrolls the globe back into view when tapped.
- Desktop globe: sticky in its column so the empty space below the hint is gone.
- Life section: prev/next arrows and an "or any address" select. Steps scroll the film into view on phones. Tracked as `life_pick`.
- First tap on "Run the engine" used to do nothing. Fixed by scrolling to `#engine` with the nav offset.
- Back navigation from a city jump must work (history state fix in session 4).
- On load, go to the top. The logo links to `/` not `/#top`.
- Tooltips are sticky on touch.
- Everything that appears must fade or slide in with the hero's easing. The globe and the pins list included. The globe spins from the first frame.

## 12. Monetization and the Dossier

Decided in session 6 after Yakir's "there is no room for mistake here" brief:

- **The product is the $149 Dossier.** 10 chapters written by the engine on the reader's exact inputs: the 3 candidates in full, head to head, the structure for the archetype, the passport question, the 5 questions for counsel, the first 90 days, assumptions, sources, small print. Delivered as a PDF within 24 hours of payment (in practice minutes, the 24 hours is a promise with margin).
- **The preview** (`/dossier.html` without a paid token) opens chapters 1 to 4 (the three in one line each, what could change the answer, how the ranking works, all 100 on your numbers) and locks 5 to 9 behind a "Get the Dossier" link. This is the free taste. It exists already the moment the engine runs, which is the hook: "Your preview exists already."
- **FOMO is real, not invented:** the 6 closed doors list (Portugal, Sweden, Spain, Malta, Germany, UK) with months. "the next change will not announce itself either". Counsel calls booked in order of arrival. A 7 day refund, one email, no questions.
- **No human in the loop per order.** The copy says the desk reviews every number. The backend generates and sends automatically. Whether to add a human approval step before sending is undecided. Yakir leans no because it breaks autopilot. Do not add one without asking.
- **Inputs are only what the engine has** (income, exit, passports, household, home, weights, filters). Do not design anything that needs data the form does not collect.
- **Traffic plan** (from the session 6 analysis): the 100 city pages and 90 comparisons are the SEO engine. Deep link `/?pick=<id>` sends page readers into the engine preselected. Email capture on "keep my ranking". The newsletter with double opt-in. Paid traffic is not planned until conversion is measured.
- **Prices in copy:** $149, $1,900, by application. Do not change without Yakir.

## 13. Backend (`yakir-ai/patrician-desk`)

Flow: site form → `intake` (saves the request, opens Stripe Checkout, emails the desk and the client) → Stripe → `stripe-webhook` (marks paid) → `generate` (writes the dossier from the site's own engine plus Claude, stores it in the private `dossiers` bucket, emails a 30 day signed link, copies the desk). `letter` handles the newsletter with double opt-in.

Tables: `requests`, `orders`, `dossiers`, `subscribers`, `events`. Service role only, no public access. Migration `20260910000000_init.sql`.

Secrets (Supabase → Edge Functions → Secrets): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `INTERNAL_KEY`, `NOTIFY_EMAIL`, `FROM_EMAIL` (after the domain is verified in Resend, for example `Patrician <desk@patrician.ch>`), `SITE_URL`, optional `ANTHROPIC_MODEL` (defaults to claude-sonnet-4-6).

Deploy: `supabase db push` then `supabase functions deploy intake stripe-webhook generate letter --no-verify-jwt`. Stripe webhook endpoint `https://<ref>.supabase.co/functions/v1/stripe-webhook`, event `checkout.session.completed`. Then set `API` in `index.html` to the functions base URL (`FORM_ENDPOINT` and `LETTER_ENDPOINT` derive from it). Until then the form falls back to `FORM_FALLBACK` (a Formspree endpoint, empty now) and ultimately to mailto. `PAY_LINK` is a hosted checkout link (Lemon Squeezy, Paddle, or a PayPal link) for the interim if Stripe stays blocked.

Re-run a failed dossier: `curl -X POST https://<ref>.supabase.co/functions/v1/generate -H "x-internal-key: $INTERNAL_KEY" -H "content-type: application/json" -d '{"order_id":"<uuid>"}'`.

**Blocker:** Yakir lives in Israel and is not registered as a freelancer (osek patur). Stripe is on hold until he checks how to register or picks a merchant of record. Do everything that does not need Stripe.

## 14. Security, legal, analytics, SEO

- **Security:** CSP meta (`default-src 'self'`, scripts self + GTM + Cloudflare insights, styles self + Google Fonts, images self + Pexels, media Pexels), an XSS fix in session 5 (city names are text, never HTML), `nosniff` and referrer policy headers, `robots.txt` allows search engines and refuses GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, CCBot, anthropic-ai, ClaudeBot, Claude-Web. Pending: Cloudflare Bot Fight Mode, HSTS, DNSSEC, security headers at the edge, branch protection on main.
- **The GitHub PAT Yakir pasted in chat (`github_pat_11ABF45...`) must be revoked.** It is in the transcripts. Remind him until it is done.
- **Legal:** `/legal.html` with terms, privacy, cookies, disclaimer ("modeling and introduction service, not tax or legal advice"), IP ("all rights reserved", no training). Cookie consent on the site. Pending on Yakir's side: a Swiss entity behind the terms, the PATRICIAN trademark at the Swiss IGE, Swiss counsel review before the first paid dossier, and the 5 counsel relationships the Architecture tier needs.
- **Analytics:** GA4 via gtag with `GA_ID` (empty, property creation stopped at step 2 of 4). Events: `preset`, `filter`, `pick_city`, `life_pick`, `keep_ranking`, `letter_subscribe`, `dossier_request`. Cloudflare insights allowed in CSP.
- **SEO:** `tools/build-pages.mjs` generates 100 city pages (tax at $300K/$1M/$3M, capital gains, cost, safety, schools, sun, the country's inflow, flight times, FAQs with schema, near-city cards, comparisons, CTA to the engine preselected, link to the Dossier), about 90 comparisons (side-by-side table, verdicts for executive, founder, family), 2 hubs, `sitemap.xml`. `index.html` carries the ItemList of all 100. Title: "Patrician.ch: Where Should a High Earner Actually Live?". OG image `og.png`.

## 15. What has been accomplished (by session)

- **S1 (09.09):** concept (born as BUTLER / MERIDIAN, renamed PATRICIAN), domain patrician.ch bought on Dynadot, repo, Cloudflare DNS and SSL, GitHub Pages live, first 24 then 31 jurisdictions, Henley 2025 data in.
- **S2:** globe UX rebuilt (tap a city, fly, HUD), atlas theatre, passport search to 65 passports, more cities, visa doors, social metadata, brand mark (shield with Swiss cross), titles and previews, supercar and watch indices, world clock.
- **S3:** Henley 2026 review, ticker smoothed, mark red corrected to `#cb003b`, videos-only mosaic, climate pills, globe restyled as a printed parchment sphere, passport SVG redrawn, tier cards, Ferrari background, Lugano video, Paris (Eiffel), London (towers), Oslo, Tokyo, Seoul clips.
- **S4:** globe texture from NASA Blue Marble baked to parchment with ink seas, passports redrawn as real emblems (RETINAA photos refused on copyright), about 20 cities added (his Hebrew list: Dubai, Monaco, St. Moritz, Gstaad, Singapore, Tokyo, Vienna, Zurich, Nice, Cannes, Antibes, Saint-Tropez, Como, Portofino, Florence, Provence, Positano, Ravello, Capri, Courchevel, Zermatt, Lucerne, Lugano and others), Sirmione and Cinque Terre removed, section 06 rewritten around 4 patterns and 2 overlays, Henley 2026 mobility scores, glossary tooltips, back navigation fix, home base from IP, logo to `/`, legal protections and all rights reserved.
- **S5:** HUD close button, section 02 two-column fix, "The Patrician Engine" rename, 10 filters, XSS fix and CSP, phone fixes (card below globe, sticky tooltips, theatre scroll, structure list), dossier film, jump targets, analytics wiring, full backend built (Supabase + Stripe + Resend + Anthropic), phone layout bugs.
- **S6:** heart icon, stat tile thumbnails (Ferrari badge), Israel passport fix and full passport audit, globe spin/tilt/zoom/entrance, section gradient seams, "Near city" mosaic, mobile structure diagrams, font gating, performance, the monetization overhaul (gated preview, automated copy, FOMO block), the $10K a month analysis.
- **S7 (10.09):** SEO generator and 197 URLs, board swaps (Fort Lauderdale, San Francisco, Mallorca, Barcelona, Bangkok, Niseko in, Siena, Verona, Virgin Gorda, Wollerau, Basseterre, Antigua out, San Diego for Lake Tahoe), atlas moved above the globe, Barcelona and Fort Lauderdale films, mobile autoplay and pre-buffering, Henley figure relabeled country level with `FLOWNOTE`, atlas and Life navigation, true minus sign, flow arrows.
- **S8 (10.09, this file):** Jersey and Quinta do Lago in for Anguilla and Ravello. Casa de Campo, Hvar, Scottsdale, Nashville in for Oslo, Seoul, Taipei, Antibes. Gibraltar in for Amsterdam (Hvar chosen over Dubrovnik). Every city on film. Provence and Ibiza clips replaced. Mobile globe section rebuilt (title above, hint above, radius, labels, HUD scroll), stat tile gradient, hero lede shortened, sections renamed 01 The board and 02 The globe, desktop globe sticky, `VALT` fallback for inferred 720p names. patrician.js v=40, 178 commits.

## 16. What is still open

**Yakir's side (he must do these, remind him, do not pretend they are done):**
- Create the Supabase project, run the migration, deploy the 4 functions, set `API` in `index.html`.
- Stripe: register as osek patur or pick a merchant of record. Then keys and webhook. Interim: `PAY_LINK` hosted checkout.
- Resend account, verify patrician.ch, `RESEND_API_KEY`, `FROM_EMAIL`.
- Anthropic API key, `INTERNAL_KEY`.
- GA4 property (stopped at step 2 of 4) and `GA_ID`.
- Revoke the GitHub PAT from the transcript.
- Cloudflare hardening (Bot Fight Mode, HSTS, DNSSEC, headers), branch protection on main.
- Swiss entity, PATRICIAN trademark, Swiss counsel review before the first paid dossier, counsel relationships for the $1,900 tier.
- Decide whether a human approval step sits before dossier delivery.
- Licensed clips for Jersey and Niseko if the stand-ins bother him.

**Claude's side, next in line:**
- Full number verification pass over all 100 records against primary sources, one table, flagged deltas (he asked for every number to be true, only the flow figures were fixed so far).
- Wire `FORM_FALLBACK` (Formspree) so requests are captured before the backend exists.
- The automated platform: today a city swap is a manual procedure (section 7). Build `tools/` scripts that take a record and do the maps, the page rebuild, the structured data, the stale page cleanup, and the version bump in one command, with validation (100 records, 100 in ORDER, every id in SIG/TZ/VR, every cc in MOB or flagged, every record with a `vid`).
- A clip resolver script that, given a Pexels video id, fetches the page through the allowed path and returns the `PV(...)` line with master and poster, so no file name is ever inferred.
- Dossier generator quality pass once the API key exists: run 5 profiles through `generate`, read the output as a client would, fix the template.
- Conversion instrumentation once GA4 exists: preview opens, lock clicks, form starts, form sends, checkout opens, paid.
- Candidates parked: Park City, Dubrovnik, Boca Raton and Bora Bora and Prague are the weakest survivors if a swap is ever needed.
- Comprehensive accessibility and performance pass on the 100 city pages.

## 17. The cascading plan (his format)

- **Someday:** the desk that every high earner's advisor recommends. The Dossier is the standard first document in a relocation. A counsel network in 20 jurisdictions. The Move tier run by a small team.
- **5Y:** patrician.ch is a business with recurring revenue (Dossier, Architecture, an annual "rules changed" subscription), licensed data partnerships, and a brand in Swiss private-banking circles.
- **1Y:** $10K a month from Dossiers on autopilot, the Architecture tier delivered with 5 counsel partners, 1,000 subscribers to the letter, 100 city pages ranking for "{city} tax residency" style queries.
- **Monthly:** ship the backend and take the first payment. Verify all numbers. Measure preview-to-paid conversion. Add or swap cities only on evidence.
- **Weekly:** one content or data improvement, one conversion experiment, clip quality pass on 10 cards.
- **Daily (while building):** fix what his screenshots show, push, report hashes. Keep the pending list current.
- **Now:** Supabase, Stripe path decision, GA4, PAT revoke, number verification.

## 18. How to answer in a new chat

- Open with what you did or will do, not with a summary of this file.
- When he sends a screenshot: name the cause in one sentence, fix it, push, give the hash, tell him to refresh if a `?v=` changed.
- When he asks "which is better" or "should we": one position, one reason, then act on "go".
- When a request conflicts with a rule here (a still instead of a film, an Arab city, a photo from a stock site with a license), refuse in one sentence, name the rule, offer the compliant path.
- When a number is uncertain: ship the best figure, mark it in the report as "verify", never on the page as "verify".
- Report stand-in media honestly every time.
- Keep the memory file `/projects/01a07170-6b7f-71c8-80e0-2196ccaa7e52/areas/patrician-site.md` in mind for decisions made after this file. If he asks to remember something about the site, write it there.
- Shorter is better. He reads on a phone.

## Session 9 (11.09.2026): the dossier is one document

- `dossier-core.js` builds all 10 chapters from engine state with no DOM. `dossier.html` (the preview, chapters 1 and 2 open) and the backend (`_shared/dossier.ts`, the paid document) both run it, so the paid document is the same chapters and the same numbers the reader saw. `dossier.css` is shared the same way. The backend fetches all three from the live site.
- Claude writes 6 bounded prose slots (answer, city1, city2, city3, structure, sequence), one call each, 220 to 380 words, from a FACTS block. A failed slot is dropped and the document still ships. No number ever comes from the model.
- `EXIT` in patrician.js: the exit rule of each of the 12 home cities, applied to the event. `WT`: indicative wealth tax rate for 25 cities, computed on the proceeds when an exit is modeled. `CORR`: 3 housing corridors for all 100 cities, names only, no prices.
- "Reviewed" is gone from the cover. `REVIEW_HOLD=1` holds every dossier for a human read, `release` sends it. Links last a year. PDF through `PDF_API_URL` + `PDF_API_KEY` (PDFShift style), HTML otherwise.
- The dossier section on the site is gated: nothing personal until the reader touches the engine (`S.set`), then it unlocks live.
- Bug fixed: `num()` read a missing query value as 0, so the sample ran on $150K from New York while its cover said $1.5M from London. Same fix in engine.ts.
- Never add a horizontal element without wrapping it: the flow line above the board caused sideways panning on phones for most of a day. `html,body{overflow-x:clip}` now guards it.
- Backend is live: Supabase project `patrician-desk`, ref `sexxnfpnrkyuiartjpya`, region eu-central-2 (Zurich), free plan. Migration `init_desk` applied. Functions deployed with verify_jwt=false: intake, stripe-webhook, generate, release, letter. The site's `API` constant points at `https://sexxnfpnrkyuiartjpya.supabase.co/functions/v1`. Deploy functions through the Supabase MCP tool (bundle `_shared/` inside each function and rewrite `../_shared/` to `./_shared/`); the sandbox cannot reach supabase.co directly.
- Secrets still to set in the Supabase dashboard (Project Settings, Edge Functions, Secrets): ANTHROPIC_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, FROM_EMAIL, NOTIFY_EMAIL, INTERNAL_KEY, SITE_URL, REVIEW_HOLD, PDF_API_URL, PDF_API_KEY. Until RESEND_API_KEY exists every email is skipped with a console warning, so the form saves requests but nobody is notified.

## Security and privacy posture (11.09.2026), mandatory on every change
- Payments: Paddle as merchant of record (Israel is not a Stripe country). intake creates a Paddle transaction, paddle-webhook verifies the HMAC signature with a 5 minute window and handles transaction.completed only.
- Public endpoints are rate limited through the events table (kind rl): intake 5 per IP per 10 min and 3 per email per day, letter 3 per IP per 10 min and 1 confirmation per email per day, silent on the letter so the endpoint cannot probe or bomb.
- Internal endpoints (generate, release) compare the key in constant time. generate is idempotent per order.
- Retention runs in pg_cron and matches the privacy notice: rl counters 1 day, unconfirmed subscribers 30 days, unpaid enquiries 24 months, events 24 months. Paid or failed requests are never purged because orders and dossiers cascade from them.
- RLS on with no policies (service role only), private dossiers bucket, CORS limited to patrician.ch, honeypot on the form, GA only after consent.
- Identity: all commits in both repos are authored "Patrician <desk@patrician.ch>". main on the site repo cannot be force pushed or deleted. Never add a name, email, phone, or location to any file, commit, or email footer.
- Privacy notice names Supabase, Paddle, Resend, Anthropic, Google Analytics, Pexels, Google Fonts, Cloudflare, GitHub Pages, and states CCPA rights.
- Still on Yakir: GitHub Pro then private repo, Proton Mail, Cloudflare Transform Rules for security headers (GitHub Pages cannot set them), Bot Fight Mode, HSTS, DNSSEC, revoke the leaked PAT.
