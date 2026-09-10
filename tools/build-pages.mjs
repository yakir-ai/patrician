// Builds the indexable pages from patrician.js: /cities/<id>/, /compare/<a>-vs-<b>/, the two hubs, and sitemap.xml.
// Run: node tools/build-pages.mjs   (from the repo root). Commit the output.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const src = readFileSync(join(ROOT, 'patrician.js'), 'utf8');
const E = new Function(src + ';return {J,HOMES,computeRows,fmt,STR,DOORS,FLOW,FLOWNOTE,signed,MOB,ARCH,taxUSD,cgUSD,hav,flyH,CLIMATE,CLIM,STREET}')();
const { J, HOMES, STR, DOORS, FLOW, FLOWNOTE, signed, MOB, taxUSD, cgUSD, hav, flyH, CLIMATE, CLIM, STREET } = E;
const SITE = 'https://patrician.ch';
const NOW = '2026-09-10';

const MOVED = { pt: ['May 2026', 'citizenship moved from 5 to 10 years of residence'], se: ['June 2026', 'citizenship moved from 5 to 8 years, with language and civics tests'], de: ['2025', 'the 3 year fast track to citizenship was abolished'], es: ['April 2025', 'the golden visa closed'], mt: ['April 2025', 'investor citizenship was struck down by the EU Court of Justice'], gb: ['April 2025', 'the non-dom regime was replaced by a 4 year window'], it: ['2024', 'the flat tax on foreign income doubled to €200K a year'], nl: ['2024', 'the investor visa closed'], au: ['2024', 'the Significant Investor visa closed'], ie: ['2023', 'the investor programme closed'], gr: ['2024', 'the golden visa floor rose to €800K in the areas people actually want'], vu: ['2024', 'EU visa-free access was revoked'] };
const BASES = [['New York', 40.71, -74], ['London', 51.51, -.13], ['Zurich', 47.37, 8.54], ['Dubai', 25.2, 55.27], ['Singapore', 1.35, 103.82], ['Tel Aviv', 32.08, 34.78]];
const INCOMES = [300000, 1000000, 3000000];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = n => n >= 1e6 ? '$' + (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + 'M' : '$' + Math.round(n / 1000) + 'K';
const pct = x => Math.round(x * 100) + '%';
const streetRank = j => STREET.findIndex(x => x.id === j.id) + 1;
const doorsOf = j => (j.doors || []).map(d => DOORS[d]).filter(Boolean);
const nearest = (j, n = 6) => J.filter(x => x.id !== j.id).map(x => ({ x, d: hav([j.lat, j.lon], [x.lat, x.lon]) })).sort((a, b) => (a.x.cc === j.cc ? -1e9 : 0) + a.d - ((b.x.cc === j.cc ? -1e9 : 0) + b.d)).slice(0, n).map(o => o.x);
const taxLine = (j, inc) => { const t = taxUSD(j, inc, false); return { tax: t, eff: t / inc, net: inc - t }; };
const cgOf = j => { const g = cgUSD(j, 1000000, false); return g / 1000000; };
const climate = j => { for (const k of Object.keys(CLIMATE)) if (CLIMATE[k].has(j.id)) return CLIM[k]; return null; };

const CSS = `
:root{--ink:#0a0a0c;--ink-2:#111114;--ivory:#f2ecdf;--bone:#d6cdbb;--gold:#c4a468;--gold-2:#8f7443;--mute:#8a8373;--line:rgba(196,164,104,.22);--serif:'Cormorant Garamond',Georgia,serif;--sans:'Jost',Helvetica,Arial,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}html{background:var(--ink);color:var(--bone);font-family:var(--sans);font-weight:300;-webkit-font-smoothing:antialiased}body{line-height:1.6}
a{color:var(--gold);text-decoration:none}a:hover{color:var(--ivory)}
.wrap{max-width:1080px;margin:0 auto;padding:0 clamp(20px,6vw,72px)}
nav{position:sticky;top:0;z-index:20;background:rgba(10,10,12,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}nav .wrap{display:flex;align-items:center;justify-content:space-between;height:66px}
.brand{font-family:var(--serif);letter-spacing:.32em;font-size:16px;color:var(--ivory);display:flex;align-items:center;gap:10px}.brand small{font-family:var(--sans);letter-spacing:.2em;font-size:10px;color:var(--gold)}
.btn{display:inline-block;border:1px solid var(--gold);color:var(--gold);padding:12px 18px;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase}.btn:hover{background:var(--gold);color:var(--ink)}
.btn.solid{background:var(--gold);color:var(--ink)}.btn.solid:hover{background:var(--ivory)}
.hero{position:relative;min-height:62vh;display:flex;align-items:flex-end;overflow:hidden}.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.75) brightness(.5)}.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,12,.2),rgba(10,10,12,.35) 50%,var(--ink) 100%)}
.hero .wrap{position:relative;z-index:1;padding-top:120px;padding-bottom:48px}
.eyebrow{font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:14px}.eyebrow:before{content:"";width:28px;height:1px;background:var(--gold)}
h1{font-family:var(--serif);font-weight:300;font-size:clamp(40px,7vw,84px);line-height:1;color:var(--ivory);margin:18px 0 16px;max-width:14ch}h1 em{font-style:italic;color:var(--gold)}
.lede{font-size:clamp(17px,1.6vw,20px);max-width:640px;color:var(--bone)}
section{padding:clamp(48px,8vw,96px) 0;border-top:1px solid var(--line)}section.alt{background:var(--ink-2)}
h2{font-family:var(--serif);font-weight:300;font-size:clamp(28px,3.4vw,44px);color:var(--ivory);line-height:1.1;margin:14px 0 22px}h2 em{font-style:italic;color:var(--gold)}
.grid{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}@media(min-width:800px){.grid{grid-template-columns:repeat(4,1fr)}.grid.two{grid-template-columns:repeat(2,1fr)}.grid.three{grid-template-columns:repeat(3,1fr)}}
.fact{border:1px solid var(--line);padding:18px 16px;background:var(--ink)}.fact small{display:block;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}.fact b{display:block;font-family:var(--serif);font-weight:400;font-size:30px;color:var(--ivory);margin-top:8px;line-height:1}.fact span{display:block;font-size:12.5px;color:var(--mute);margin-top:6px}
table{width:100%;border-collapse:collapse;font-size:14px}th{font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--mute);text-align:left;padding:10px 8px;border-bottom:1px solid var(--line)}td{padding:12px 8px;border-bottom:1px solid var(--line);color:var(--bone)}td b{font-family:var(--serif);font-weight:400;font-size:20px;color:var(--ivory)}td:not(:first-child){text-align:right}th:not(:first-child){text-align:right}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.chip{border:1px solid var(--line);padding:7px 11px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--bone)}.chip.gold{border-color:var(--gold);color:var(--gold)}
.mv{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(203,0,59,.45);padding:8px 12px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#e0335f;margin-top:16px}.mv:before{content:"";width:6px;height:6px;border-radius:50%;background:#cb003b}
p{max-width:680px;margin-bottom:14px;font-size:16px}
.tl{list-style:none;display:grid;gap:14px;max-width:680px}.tl li{display:grid;grid-template-columns:64px 1fr;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}.tl time{font-family:var(--serif);color:var(--gold);font-size:20px}.tl b{display:block;font-family:var(--serif);font-weight:400;font-size:22px;color:var(--ivory)}.tl span{color:var(--mute);font-size:14px}
.cards{display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}@media(min-width:800px){.cards{grid-template-columns:repeat(3,1fr)}}.card{display:block;border:1px solid var(--line);padding:16px;background:var(--ink)}.card b{display:block;font-family:var(--serif);font-weight:400;font-size:22px;color:var(--ivory)}.card span{display:block;font-size:12px;color:var(--mute);margin-top:4px}.card:hover{border-color:var(--gold)}
details{border-top:1px solid var(--line);padding:16px 0}summary{cursor:pointer;font-family:var(--serif);font-size:22px;color:var(--ivory);list-style:none}summary::-webkit-details-marker{display:none}details p{margin-top:10px}
.cta{border:1px solid var(--gold);padding:28px;display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between;background:linear-gradient(90deg,rgba(196,164,104,.08),transparent)}.cta b{display:block;font-family:var(--serif);font-weight:300;font-size:28px;color:var(--ivory)}.cta span{display:block;color:var(--mute);font-size:14px;margin-top:4px;max-width:560px}
footer{padding:40px 0;border-top:1px solid var(--line);font-size:12px;color:var(--mute)}footer .wrap{display:flex;flex-wrap:wrap;gap:12px 24px;justify-content:space-between}
.fine{font-size:12.5px;color:var(--mute);max-width:720px}
.list{columns:2;column-gap:32px}@media(min-width:800px){.list{columns:4}}.list a{display:block;padding:8px 0;border-bottom:1px solid var(--line);color:var(--bone)}.list a:hover{color:var(--gold)}
`;

const head = ({ title, desc, path, image, ld }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}${path}"><meta property="og:type" content="article"><meta property="og:image" content="${esc(image)}"><meta property="og:site_name" content="Patrician">
<meta name="twitter:card" content="summary_large_image"><meta name="robots" content="index,follow,max-image-preview:large,noai,noimageai"><meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://images.pexels.com https://images.unsplash.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap">
<style>${CSS}</style>
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
</head><body>
<nav><div class="wrap"><a class="brand" href="/">PATRICIAN <small>.CH</small></a><a class="btn" href="/#report">Private Dossier</a></div></nav>`;

const foot = () => `<footer><div class="wrap"><span>© 2026 Patrician · <a href="/legal.html">Terms, privacy, disclaimer</a></span><span><a href="/cities/">All 100 addresses</a> · <a href="/compare/">Head to head</a> · <a href="/">The engine</a></span></div></footer>
<p class="fine wrap" style="padding-bottom:40px">Tax figures use a simplified marginal model with indicative 2026 brackets for a non-US single filer, ignore social contributions, most deductions, wealth taxes, and treaties, and are not advice. Residence rules change often. Verify before acting.</p>
</body></html>`;

/* ---------- city pages ---------- */
function cityPage(j) {
  const path = `/cities/${j.id}/`;
  const flow = FLOW[j.cc];
  const mob = MOB[j.cc];
  const doors = doorsOf(j);
  const sr = streetRank(j);
  const cg = cgOf(j);
  const taxes = INCOMES.map(i => ({ inc: i, ...taxLine(j, i) }));
  const near = nearest(j);
  const moved = MOVED[j.cc];
  const clim = climate(j);
  const regime = j.regime ? j.regime : null;
  const title = `${j.city}, ${j.country}: tax, residence, cost, and an ordinary day for a high earner`;
  const desc = `${j.lede} Effective tax at $1M: ${pct(taxes[1].eff)}. Capital gains: ${pct(cg)}. ${doors.length ? 'Routes in: ' + doors.join(', ') + '.' : ''} Modeled by Patrician.`;
  const faq = [
    [`How much tax would a $1M earner pay in ${j.city}?`, `On the simplified 2026 model, about ${money(taxes[1].tax)}, an effective ${pct(taxes[1].eff)}, leaving ${money(taxes[1].net)}. At $300K the rate is ${pct(taxes[0].eff)}, at $3M it is ${pct(taxes[2].eff)}. Social contributions, deductions, and treaties are not included.${regime ? ' Special regime: ' + regime : ''}`],
    [`How does a foreigner get residence in ${j.city}?`, j.visa.t + (doors.length ? ` Routes that matter for money: ${doors.join(', ')}.` : '')],
    [`What does life in ${j.city} cost compared with Zurich?`, `The cost index is ${j.cost} against Zurich at 100, safety ${j.safe}/10, schools ${j.school}/10, ${j.sun.toLocaleString()} sun hours a year.${flow != null ? ` ${j.country} as a whole saw a net ${flow > 0 ? 'inflow' : 'outflow'} of ${Math.abs(flow).toLocaleString()} millionaires in 2025 (Henley, country level).${FLOWNOTE[j.id] ? ' ' + FLOWNOTE[j.id] + '.' : ''}` : ''}`],
  ];
  const ld = [{ '@context': 'https://schema.org', '@type': 'Article', headline: title, description: desc, datePublished: NOW, dateModified: NOW, author: { '@type': 'Organization', name: 'Patrician', url: SITE }, publisher: { '@type': 'Organization', name: 'Patrician', url: SITE }, mainEntityOfPage: SITE + path, image: j.vid?.poster || j.img },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }];
  const html = head({ title, desc, path, image: j.vid?.poster || j.img, ld }) + `
<header class="hero"><img src="${esc(j.vid?.poster || j.img)}" alt="${esc(j.city)}" fetchpriority="high"><div class="wrap"><div class="eyebrow">${j.flag} ${esc(j.country)} · Address ${String(J.findIndex(x => x.id === j.id) + 1).padStart(2, '0')} of ${J.length}</div>
<h1>${esc(j.city)}, for a <em>high earner</em>.</h1><p class="lede">${esc(j.lede)}</p>${moved ? `<div class="mv">Rules moved ${moved[0]}: ${esc(moved[1])}</div>` : ''}</div></header>
<section><div class="wrap"><div class="eyebrow">The numbers</div><h2>What ${esc(j.city)} <em>takes</em>, and what it costs.</h2>
<div class="grid"><div class="fact"><small>Effective tax at $1M</small><b>${pct(taxes[1].eff)}</b><span>${money(taxes[1].net)} kept</span></div><div class="fact"><small>Capital gains</small><b>${pct(cg)}</b><span>on a $1M gain</span></div><div class="fact"><small>Cost index</small><b>${j.cost}</b><span>Zurich = 100</span></div><div class="fact"><small>Supercar street index</small><b>#${sr}</b><span>of ${J.length}</span></div><div class="fact"><small>Safety</small><b>${j.safe}/10</b><span>&nbsp;</span></div><div class="fact"><small>Schools</small><b>${j.school}/10</b><span>international options</span></div><div class="fact"><small>Sun hours a year</small><b>${j.sun.toLocaleString()}</b><span>${clim ? esc(clim) : '&nbsp;'}</span></div><div class="fact"><small>${flow != null ? esc(j.country) + ' net millionaire inflow 2025' : 'Passport mobility'}</small><b>${flow != null ? signed(flow) : (mob != null ? mob : '')}</b><span>${flow != null ? 'Henley, country level' + (FLOWNOTE[j.id] ? '. ' + esc(FLOWNOTE[j.id]) : '') : 'index'}</span></div></div>
<h2 style="margin-top:44px">Tax on <em>your</em> bracket.</h2>
<table><thead><tr><th>Income</th><th>Tax</th><th>Effective</th><th>Kept</th></tr></thead><tbody>${taxes.map(t => `<tr><td><b>${money(t.inc)}</b></td><td>${money(t.tax)}</td><td>${pct(t.eff)}</td><td>${money(t.net)}</td></tr>`).join('')}</tbody></table>
${regime ? `<p style="margin-top:18px"><b style="color:var(--ivory);font-weight:400">Special regime.</b> ${esc(regime)}</p>` : ''}${j.wealth ? `<p><b style="color:var(--ivory);font-weight:400">Wealth and exit.</b> ${esc(j.wealth)}</p>` : ''}
<p class="fine">Simplified marginal model, indicative 2026 brackets, non-US single filer. Run the engine with your own income, exit, passports, and family to see where ${esc(j.city)} ranks for you.</p>
<p><a class="btn solid" href="/?pick=${j.id}#engine">Rank ${esc(j.city)} on my numbers →</a></p></div></section>
<section class="alt"><div class="wrap"><div class="eyebrow">Who gets in</div><h2>The residence <em>route</em>.</h2><p>${esc(j.visa.t)}</p>${doors.length ? `<div class="chips">${doors.map(d => `<span class="chip gold">${esc(d)}</span>`).join('')}</div>` : ''}${mob != null ? `<p class="fine">A ${esc(j.country)} passport scores ${mob} on the mobility index. The passport ladder on the engine compares 65 of them.</p>` : ''}</div></section>
<section><div class="wrap"><div class="eyebrow">The life</div><h2>An ordinary day in <em>${esc(j.city)}</em>.</h2><ul class="tl">${j.day.map(d => `<li><time>${esc(d[0])}</time><div><b>${esc(d[1])}</b><span>${esc(d[2])}</span></div></li>`).join('')}</ul>
<h2 style="margin-top:44px">Flight times.</h2><table><thead><tr><th>From</th><th>Hours</th></tr></thead><tbody>${BASES.map(b => `<tr><td>${esc(b[0])}</td><td>${flyH([b[1], b[2]], [j.lat, j.lon]) || 'Home'}</td></tr>`).join('')}</tbody></table></div></section>
<section class="alt"><div class="wrap"><div class="eyebrow">Within reach</div><h2>Near ${esc(j.city)} on the <em>board</em>.</h2><div class="cards">${near.map(x => `<a class="card" href="/cities/${x.id}/"><b>${esc(x.city)}</b><span>${x.flag} ${esc(x.country)} · tax at $1M ${pct(taxLine(x, 1000000).eff)} · cost ${x.cost}</span></a>`).join('')}</div>
<div class="cards" style="margin-top:12px">${near.slice(0, 3).map(x => `<a class="card" href="/compare/${[j.id, x.id].sort().join('-vs-')}/"><b>${esc(j.city)} vs ${esc(x.city)}</b><span>Head to head</span></a>`).join('')}</div></div></section>
<section><div class="wrap"><div class="eyebrow">Questions</div>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
<div class="cta" style="margin-top:40px"><div><b>The Dossier on ${esc(j.city)}, on your numbers.</b><span>Your top 3 modeled and compared on your income, exit, passports, and family. 10 chapters, about 40 pages, as a PDF within 24 hours. $149, refunded within 7 days if it does not change how you think.</span></div><a class="btn solid" href="/?pick=${j.id}#report">Get the Dossier</a></div></div></section>` + foot();
  return { path, html, title };
}

/* ---------- comparison pages ---------- */
function comparePage(a, b) {
  const [x, y] = [a, b].sort((p, q) => p.id < q.id ? -1 : 1);
  const path = `/compare/${x.id}-vs-${y.id}/`;
  const ta = INCOMES.map(i => taxLine(x, i)), tb = INCOMES.map(i => taxLine(y, i));
  const rows = [
    ['Effective tax at $300K', pct(ta[0].eff), pct(tb[0].eff)], ['Effective tax at $1M', pct(ta[1].eff), pct(tb[1].eff)], ['Effective tax at $3M', pct(ta[2].eff), pct(tb[2].eff)],
    ['Kept at $1M', money(ta[1].net), money(tb[1].net)], ['Capital gains', pct(cgOf(x)), pct(cgOf(y))], ['Cost index (Zurich 100)', x.cost, y.cost], ['Safety', x.safe + '/10', y.safe + '/10'], ['Schools', x.school + '/10', y.school + '/10'], ['Sun hours', x.sun.toLocaleString(), y.sun.toLocaleString()], ['Supercar street index', '#' + streetRank(x), '#' + streetRank(y)], ['Routes in', doorsOf(x).join(', ') || 'Standard permits', doorsOf(y).join(', ') || 'Standard permits'], ['Net millionaire inflow 2025 (country, Henley)', FLOW[x.cc] != null ? signed(FLOW[x.cc]) : 'n/a', FLOW[y.cc] != null ? signed(FLOW[y.cc]) : 'n/a'], ['Flight London', flyH([51.51, -.13], [x.lat, x.lon]) || 'Home', flyH([51.51, -.13], [y.lat, y.lon]) || 'Home'], ['Flight New York', flyH([40.71, -74], [x.lat, x.lon]) || 'Home', flyH([40.71, -74], [y.lat, y.lon]) || 'Home'],
  ];
  const cheaper = ta[1].eff < tb[1].eff ? x : y, other = cheaper === x ? y : x, diff = money(Math.abs(ta[1].net - tb[1].net));
  const verdicts = [
    ['For an executive on salary', `${cheaper.city} keeps more of a $1M salary, ${diff} a year on this model. ${other.city} answers with ${other.school >= cheaper.school ? 'schools' : ''}${other.school >= cheaper.school && other.safe > cheaper.safe ? ' and ' : ''}${other.safe > cheaper.safe ? 'safety' : ''}${other.school < cheaper.school && other.safe <= cheaper.safe ? 'the life itself' : ''}.`],
    ['For a founder with an exit', `Capital gains: ${x.city} ${pct(cgOf(x))}, ${y.city} ${pct(cgOf(y))}. The order of operations, move then sell or sell then move, decides more than the rate. ${x.wealth || y.wealth ? 'Exit rules apply: ' + esc(x.wealth || y.wealth) : 'Neither city taxes wealth as such.'}`],
    ['For a family', `${x.school >= y.school ? x.city : y.city} scores higher on schools, ${x.safe >= y.safe ? x.city : y.city} on safety, and the cheaper life is in ${x.cost <= y.cost ? x.city : y.city}. ${x.sun >= y.sun ? x.city : y.city} has the sun.`],
  ];
  const title = `${x.city} vs ${y.city} for a high earner: tax, residence, cost, and life compared`;
  const desc = `${x.city} takes ${pct(ta[1].eff)} of $1M, ${y.city} ${pct(tb[1].eff)}. Capital gains ${pct(cgOf(x))} vs ${pct(cgOf(y))}, cost ${x.cost} vs ${y.cost}, schools, safety, routes in, and flights. Modeled by Patrician.`;
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: title, description: desc, datePublished: NOW, dateModified: NOW, author: { '@type': 'Organization', name: 'Patrician', url: SITE }, publisher: { '@type': 'Organization', name: 'Patrician', url: SITE }, mainEntityOfPage: SITE + path, image: x.vid?.poster || x.img };
  const html = head({ title, desc, path, image: x.vid?.poster || x.img, ld }) + `
<header class="hero" style="min-height:50vh"><img src="${esc(x.vid?.poster || x.img)}" alt=""><div class="wrap"><div class="eyebrow">Head to head</div><h1>${esc(x.city)} <em>vs</em> ${esc(y.city)}.</h1><p class="lede">${esc(x.flag)} ${esc(x.country)} against ${esc(y.flag)} ${esc(y.country)}, on tax, residence, cost, and the life. Same model, same year, no brochure.</p></div></header>
<section><div class="wrap"><table><thead><tr><th></th><th>${esc(x.city)}</th><th>${esc(y.city)}</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table>
<p class="fine" style="margin-top:16px">Simplified marginal model, indicative 2026 brackets, non-US single filer, no social contributions, deductions, wealth taxes, or treaties.</p></div></section>
<section class="alt"><div class="wrap"><div class="eyebrow">Verdicts</div><h2>Who should pick <em>which</em>.</h2>${verdicts.map(v => `<h3 style="font-family:var(--serif);font-weight:400;font-size:24px;color:var(--ivory);margin-top:22px">${v[0]}</h3><p>${v[1]}</p>`).join('')}
<div class="cards" style="margin-top:28px"><a class="card" href="/cities/${x.id}/"><b>${esc(x.city)}</b><span>The full page</span></a><a class="card" href="/cities/${y.id}/"><b>${esc(y.city)}</b><span>The full page</span></a><a class="card" href="/?pick=${x.id}#engine"><b>Rank both on my numbers</b><span>The engine, 90 seconds</span></a></div></div></section>
<section><div class="wrap"><div class="cta"><div><b>The Dossier: ${esc(x.city)}, ${esc(y.city)}, and the third you have not considered.</b><span>Your top 3 modeled on your income, exit, passports, and family. 10 chapters, about 40 pages, as a PDF within 24 hours. $149, refunded within 7 days if it does not change how you think.</span></div><a class="btn solid" href="/#report">Get the Dossier</a></div></div></section>` + foot();
  return { path, html, title };
}

/* ---------- hubs ---------- */
function citiesHub(pages) {
  const path = '/cities/';
  const title = 'All 100 addresses: every serious city for a high earner, on one model';
  const desc = 'Tax, residence route, cost, safety, schools, sun, and an ordinary day, for 100 cities on 5 continents. Modeled by Patrician.';
  const byCountry = {};
  J.forEach(j => { (byCountry[j.country] = byCountry[j.country] || []).push(j); });
  const html = head({ title, desc, path, image: SITE + '/globe-tex.jpg' }) + `
<header class="hero" style="min-height:38vh"><div class="wrap"><div class="eyebrow">The board</div><h1>Every serious <em>address</em>.</h1><p class="lede">${J.length} cities in ${Object.keys(byCountry).length} countries, each on the same model: tax on your bracket, the route in, the cost, the day.</p></div></header>
<section><div class="wrap">${Object.keys(byCountry).sort().map(c => `<h2 style="font-size:26px;margin-top:28px">${byCountry[c][0].flag} ${esc(c)}</h2><div class="cards">${byCountry[c].map(j => `<a class="card" href="/cities/${j.id}/"><b>${esc(j.city)}</b><span>tax at $1M ${pct(taxLine(j, 1000000).eff)} · cost ${j.cost} · ${j.sun.toLocaleString()} sun hours</span></a>`).join('')}</div>`).join('')}</div></section>` + foot();
  return { path, html, title };
}
function compareHub(pairs) {
  const path = '/compare/';
  const title = 'Head to head: the cities high earners actually compare';
  const desc = 'Zurich vs Dubai, Monaco vs Singapore, Lisbon vs Milan. Tax, capital gains, cost, schools, and routes in, side by side on one model.';
  const html = head({ title, desc, path, image: SITE + '/globe-tex.jpg' }) + `
<header class="hero" style="min-height:38vh"><div class="wrap"><div class="eyebrow">Head to head</div><h1>The comparisons people <em>actually</em> make.</h1><p class="lede">${pairs.length} pairings, each on the same model. Pick yours, then run the engine on your own numbers.</p></div></header>
<section><div class="wrap"><div class="cards">${pairs.map(([a, b]) => { const [x, y] = [a, b].sort((p, q) => p.id < q.id ? -1 : 1); return `<a class="card" href="/compare/${x.id}-vs-${y.id}/"><b>${esc(x.city)} vs ${esc(y.city)}</b><span>${x.flag} ${esc(x.country)} · ${y.flag} ${esc(y.country)}</span></a>`; }).join('')}</div></div></section>` + foot();
  return { path, html, title };
}

/* ---------- pairs worth a page ---------- */
const want = ['zrh', 'zug', 'gva', 'dxb', 'auh', 'sin', 'mco', 'lis', 'mil', 'lon', 'mia', 'hkg', 'lux', 'ams', 'vie', 'mad', 'bcn', 'ath', 'nas', 'gcm', 'lcy', 'tlv', 'aus', 'val', 'prg', 'and', 'qtn', 'syd', 'tor', 'pmi', 'sdg'];
const picks = want.map(id => J.find(j => j.id === id)).filter(Boolean);
const pairs = [];
const seen = new Set();
const add = (a, b) => { if (!a || !b || a === b) return; const k = [a.id, b.id].sort().join('-'); if (seen.has(k)) return; seen.add(k); pairs.push([a, b]); };
// natural rivalries first, then each pick against the nearest 2 by distance and the 2 closest by tax
[['zrh', 'dxb'], ['zrh', 'sin'], ['zug', 'zrh'], ['zug', 'gva'], ['mco', 'dxb'], ['mco', 'sin'], ['dxb', 'sin'], ['dxb', 'auh'], ['lis', 'mil'], ['lis', 'mad'], ['lis', 'bcn'], ['mil', 'zrh'], ['lon', 'dxb'], ['lon', 'zrh'], ['lon', 'lis'], ['mia', 'dxb'], ['mia', 'nas'], ['hkg', 'sin'], ['lux', 'zrh'], ['vie', 'zrh'], ['vie', 'prg'], ['ath', 'lis'], ['nas', 'gcm'], ['tlv', 'dxb'], ['tlv', 'lis'], ['and', 'mco'], ['syd', 'sin'], ['tor', 'mia'], ['pmi', 'lis'], ['aus', 'mia'], ['sdg', 'sfo'], ['sdg', 'mia']].forEach(([a, b]) => add(J.find(j => j.id === a), J.find(j => j.id === b)));
picks.forEach(p => { nearest(p, 2).forEach(q => add(p, q)); const e = taxLine(p, 1000000).eff; J.filter(q => q.id !== p.id).map(q => ({ q, d: Math.abs(taxLine(q, 1000000).eff - e) })).sort((a, b) => a.d - b.d).slice(0, 1).forEach(o => add(p, o.q)); });

/* ---------- write ---------- */
const out = [];
const write = pg => { const dir = join(ROOT, pg.path); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, 'index.html'), pg.html); out.push(pg.path); };
J.forEach(j => write(cityPage(j)));
pairs.forEach(([a, b]) => write(comparePage(a, b)));
write(citiesHub()); write(compareHub(pairs));
const urls = ['/', '/dossier.html?sample=1', ...out];
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u.replace('&', '&amp;')}</loc><lastmod>${NOW}</lastmod><changefreq>${u === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${u === '/' ? '1.0' : u.startsWith('/cities/') && u.length > 9 ? '0.8' : '0.6'}</priority></url>`).join('\n')}\n</urlset>\n`);
console.log(`wrote ${J.length} city pages, ${pairs.length} comparisons, 2 hubs, sitemap with ${urls.length} urls`);
