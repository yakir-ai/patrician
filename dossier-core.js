/* Patrician dossier core. Builds the 10 chapters from engine state. No DOM. Shared by dossier.html and the desk backend. */
function buildDossier(S,O){const NAME=O.name||'',TIER=O.tier||'The Dossier',SAMPLE=!!O.sample,PAID=!!O.paid,SLOT=O.slots||{};const slot=k=>SLOT[k]?`<div class="prose">${SLOT[k]}</div>`:'';
const REF=O.ref||'PAT-'+new Date().toISOString().slice(2,10).replace(/-/g,'')+'-'+Math.abs([...(NAME+S.inc+S.exit)].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7)).toString(36).slice(0,4).toUpperCase();
const today=O.today?new Date(O.today):new Date();const DATE=today.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const rows=computeRows(S);
const pick=String(O.city||'').replace(/[^a-z]/g,'');let ord=[...rows];if(pick&&rows.find(r=>r.j.id===pick)){const l=rows.find(r=>r.j.id===pick);ord=[l,...rows.filter(r=>r!==l)]}
const T3=ord.slice(0,3);const L=T3[0];const home=HOMES[S.home];
const HOMEC={'New York':'the United States','Los Angeles':'the United States','Toronto':'Canada','London':'the United Kingdom','Paris':'France','Zurich':'Switzerland','Tel Aviv':'Israel','Dubai':'the UAE','Mumbai':'India','Singapore':'Singapore','Hong Kong':'Hong Kong','Sydney':'Australia'};
const homeC=HOMEC[home[0]]||home[0];
const US=S.pp.has('us');
const PPN={eu:'EU',uk:'UK',us:'US',ch:'Swiss',ca:'Canadian',au:'Australian',sg:'Singaporean',jp:'Japanese',il:'Israeli',other:'other'};
const ppText=[...S.pp].map(k=>PPN[k]||k).join(' and ')||'no listed';
const HHN={kids:'a family with school-age children',couple:'a couple without school-age children',solo:'a single household'};
const FR={1:'Register on arrival',2:'Standard permit',3:'Investor or elective route',4:'Quota or discretionary permit'};
const $f=n=>'$'+Math.round(n).toLocaleString('en-US');const pct=x=>(x*100).toFixed(1)+'%';
const rankOf=r=>rows.indexOf(r)+1;
const WN={tax:'Net kept',safe:'Safety',school:'Schools',sun:'Sun',prox:'Proximity to home',beauty:'Beauty',cost:'Cost of living',visa:'Ease of entry'};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const KEPTNOTE='Kept over 10 years assumes 5% growth on what is retained and a spend of 42% of net income, scaled by the cost index. It is a comparison figure, not a forecast.';
const XH=exitHome(HOMES[S.home][0],S);

/* ---------- reasoning helpers ---------- */
function why(r){const j=r.j;const o=[];
  if(r.eff<.005)o.push('no income tax on your salary');else if(r.eff<.18)o.push(`an effective rate of ${pct(r.eff)} on your income`);else o.push(`an effective rate of ${pct(r.eff)}, higher than the field, carried by other axes`);
  if(S.exit>0){const cg=cgUSD(j,S.exit,US);o.push(cg<S.exit*.01?'a liquidity event that lands untaxed':`${$f(cg)} on the exit`)}
  if(r.fr===1)o.push('the right to walk in on your passport');else if(r.fr===2)o.push('a standard permit route');else if(r.fr===3)o.push('an investor or elective residence route');else o.push('a quota or discretionary permit, the hardest door on the list');
  if(r.fly===0)o.push('no flight from home');else o.push(`${r.fly} hours from ${home[0]}`);
  if(S.hh==='kids')o.push(j.school>=8?'strong international schools':j.school>=6?'adequate schools':'thin schooling, which the weights penalize');
  return o}
function risks(r){const j=r.j;const o=[];
  if(j.regime)o.push(`The headline result assumes you elect the special regime (${j.regime}). Eligibility, the current figure, and the election deadline must be confirmed before you rely on it.`);
  if(j.wealth)o.push('A wealth tax applies on your total assets, including assets held abroad. The engine does not model it. On a large balance sheet it can exceed the income tax saving.');
  if(US)o.push('You hold a US passport. The United States taxes you on worldwide income wherever you live, so the local rate is a floor for foreign tax credit purposes, not the rate you pay. The engine applies the US floor already.');
  if(r.fr>=4)o.push('Entry runs through a quota or discretionary permit. Availability changes yearly and is not guaranteed at any price.');
  if(S.exit>0)o.push(XH&&XH.tax>0?`${homeC} takes about ${$f(XH.tax)} of the event on the way out unless the sequence or a deferral avoids it. Move first, sell first, or split the vesting: the order decides the outcome.`:XH?`${homeC} has no charge on the way out, but the date you break residence still decides which country taxes the event. Fix the sequence before the term sheet.`:`${homeC} may apply an exit tax or deemed disposal when you cease residence with unrealized gains. The order of operations decides the outcome.`);
  if(j.cost>=85)o.push('Cost of the life is at the top of the index. Housing at the corridor you will want is scarce and priced in cash.');
  if(r.fly>=10)o.push(`${r.fly} hours from ${home[0]}. Elderly parents, a board seat, or a co-parenting arrangement can make that the deciding number.`);
  if(FLOW[j.cc]<=-3000)o.push('Net millionaire outflow in 2025. The tax welcome is narrowing and the political direction is against you.');
  return o.slice(0,4)}
function questions(r){const j=r.j;const q=[];
  q.push(`What are the tax residency tests here (days, home, center of vital interests), and how do I document the break from ${homeC} so that both sides agree on the date?`);
  if(j.regime)q.push(`Am I eligible for the special regime, what is the current figure, when must I elect it, and what happens when it expires?`);
  if(S.exit>0)q.push(`If the liquidity event happens after I move, does ${j.city} tax the gain, and does ${homeC} apply an exit tax or claw the gain back under a look-back rule?`);
  if(US)q.push('As a US citizen, how do the foreign earned income exclusion and the foreign tax credit interact with local tax, and which local banks will open an account for a US person?');
  if(j.wealth)q.push('What is the wealth tax base, which assets are exempt, and how are foreign holdings valued?');
  q.push(`Which treaty applies between ${homeC} and ${j.country}, and does it protect pensions, dividends, and equity that vests after I leave?`);
  if(r.fr>=3)q.push('Which residence route fits my profile, what is the realistic timeline to a card, and how many days of presence keep it valid?');
  q.push('If I hold my shares in a holding company before I move, where should it sit, and what substance does it need to survive a treaty challenge?');
  q.push('What does it cost, all in, to keep this residence valid for 5 years: presence days, filings, renewals, and the professional fees around them?');
  return q.slice(0,5)}
function arch(){if(S.exit>0)return 'founder';if(S.inc>=1500000&&S.exit===0)return 'investor'in ARCH?'investor':'exec';return 'exec'}

/* ---------- pages ---------- */
const P=[];const page=(cls,html)=>P.push(`<section class="page ${cls||''}"><div class="folio"><span>Patrician · Private Dossier · ${REF}</span><span>${String(P.length+1).padStart(2,'0')}</span></div>${html}</section>`);

/* Cover */
page('cover',`<div><div class="brand"><svg class="mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="mk-au" gradientUnits="userSpaceOnUse" x1="10" y1="8" x2="54" y2="58"><stop offset="0" stop-color="#e9d4a0"/><stop offset=".5" stop-color="#c4a468"/><stop offset="1" stop-color="#8f7443"/></linearGradient><radialGradient id="mk-rd" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#d81046"/><stop offset=".55" stop-color="#cb003b"/><stop offset="1" stop-color="#9c002d"/></radialGradient></defs><path d="M32 8 L51 13.8 V33 C51 44.5 42.6 52.4 32 57 C21.4 52.4 13 44.5 13 33 V13.8 Z" fill="url(#mk-au)"/><path d="M32 10.6 L48.6 15.7 V33 C48.6 43.2 41.3 50.2 32 54.3 C22.7 50.2 15.4 43.2 15.4 33 V15.7 Z" fill="url(#mk-rd)"/><path d="M32 12.4 L47 17 V33 C47 42.3 40.4 48.6 32 52.4 C23.6 48.6 17 42.3 17 33 V17 Z" fill="none" stroke="url(#mk-au)" stroke-opacity=".55" stroke-width=".7"/><polygon points="28.70,20.50 35.30,20.50 35.30,28.20 43.00,28.20 43.00,34.80 35.30,34.80 35.30,42.50 28.70,42.50 28.70,34.80 21.00,34.80 21.00,28.20 28.70,28.20" fill="#ffffff"/></svg>PATRICIAN<span class="tld">.CH</span></div></div>
<div><div class="eyebrow">Private Dossier · ${TIER}</div><h1>Where you should<br><em>actually</em> live.</h1><p style="margin-top:22px;font-family:var(--serif);font-size:15pt;max-width:30em;color:#d6cdbb">A modeled answer for one profile, not a brochure. Three addresses, the numbers behind each, the route in, and the questions to settle before you sign anything.</p></div>
<div class="meta"><div><span>Prepared for</span><b>${esc(NAME||'The client')}</b></div><div><span>Reference</span><b>${REF}</b></div><div><span>Date</span><b>${DATE}</b></div><div><span>Leading candidate</span><b>${L.j.flag} ${L.j.city}</b></div></div>`);

/* 1. The answer */
page('',`<div class="eyebrow">01 · The answer</div><h2>${L.j.city} <em>leads</em>. ${T3[1].j.city} and ${T3[2].j.city} are the alternatives worth a flight.</h2>
<p class="lede">On your numbers, ${L.j.city} wins on ${why(L).slice(0,3).join(', ')}. Over 10 years you keep about ${fmt(L.kept10)} of what you earn and exit, against ${fmt(rows[rows.length-1].kept10)} at the bottom of the field.</p>
<div class="kpis"><div><i>Effective tax, ${L.j.city}</i><b>${pct(L.eff)}</b><small>on ${fmt(S.inc)} a year</small></div><div><i>Kept over 10 years</i><b>${fmt(L.kept10)}</b><small>income net of tax, plus the exit</small></div><div><i>Route in</i><b style="font-size:15pt">${FR[L.fr]}</b><small>on your ${ppText} passport</small></div><div><i>Flight from ${home[0]}</i><b>${L.fly?L.fly+'h':'Home'}</b><small>direct, typical</small></div></div>
<p class="small">${KEPTNOTE}</p>${slot('answer')}${S.exit>0&&XH?`<h3>Before the destination: what ${homeC} takes when you leave</h3><p>${XH.tax>0?`On the ${$f(S.exit)} event, the exit rule of ${homeC} is worth about <b>${$f(XH.tax)}</b> if the whole amount is unrealized gain on the day you leave. `:''}${XH.note} ${XH.defer!=='Not applicable.'?'Deferral: '+XH.defer:''}</p>`:''}<h3>The three, in one line each</h3>
<table><thead><tr><th>Rank</th><th>Address</th><th>Why it is here</th><th class="n">Kept, 10 yrs</th></tr></thead>
${T3.map((r,i)=>`<tr class="${i===0?'lead':''}"><td><b>${rankOf(r)}</b></td><td><b>${r.j.flag} ${r.j.city}</b><br><span class="small">${r.j.country}</span></td><td>${why(r).slice(0,3).join(', ')}.</td><td class="n"><b>${fmt(r.kept10)}</b></td></tr>`).join('')}</table>
<h3>What could change the answer</h3><ul class="verify">${risks(L).slice(0,3).map(x=>`<li>${x}</li>`).join('')}</ul>`);

/* 2. Profile and method */
page('',`<div class="eyebrow">02 · Your profile and the method</div><h2>What we modeled, and <em>how</em>.</h2>
<div class="two"><div><h4>Inputs</h4><table><tr><td>Annual income</td><td class="n"><b>${$f(S.inc)}</b></td></tr><tr><td>Liquidity event modeled</td><td class="n"><b>${S.exit?$f(S.exit):'None'}</b></td></tr><tr><td>Passports held</td><td class="n"><b>${[...S.pp].map(k=>PPN[k]).join(', ')}</b></td></tr><tr><td>Household</td><td class="n"><b>${HHN[S.hh]}</b></td></tr><tr><td>Home base today</td><td class="n"><b>${home[0]}</b></td></tr><tr><td>Desk</td><td class="n"><b>${esc(TIER)}</b></td></tr></table></div>
<div><h4>Your weights</h4>${Object.keys(S.w).map(k=>`<div style="display:flex;justify-content:space-between;font-size:9.5pt"><span>${WN[k]}</span><span>${S.w[k]}/10</span></div><div class="bar"><i style="width:${S.w[k]*10}%"></i></div>`).join('')}</div></div>
<h3>How the ranking works</h3>
<p>Each of the ${J.length} addresses is scored on 8 axes and weighted by your sliders. Net kept is the only axis computed from your numbers: income tax at simplified 2026 headline brackets, plus tax on the liquidity event at the local capital gains rate, over 10 years. Safety, schools, sun, beauty, and cost are editorial indices. Proximity is flight time from ${home[0]}. Ease of entry is the friction of the best residence route open to your passports.</p>
<p>${S.hh==='kids'?'Because you have school-age children, schools carry full weight.':S.hh==='couple'?'Because there are no school-age children, the schools axis carries 30% of its weight.':'Because you are a single household, the schools axis is switched off.'} ${US?'Because you hold a US passport, local tax is floored at the US federal rate, which is the mechanism the foreign tax credit produces in practice.':''}</p>
<h3>What the model does not do</h3>
<ul><li>Social contributions, most deductions, wealth taxes, municipal surcharges, and treaties are ignored.</li><li>Special regimes are flagged, not applied. Where a regime exists the true rate is usually lower than shown.</li><li>Exit taxes in ${homeC} are flagged, not computed.</li><li>Housing cost is an index, not a rent.</li></ul>`);

/* 3. Full ranking */
page('',`<div class="eyebrow">03 · The full ranking</div><h2>All ${J.length}, on your <em>weights</em>.</h2>
<table style="font-size:8.4pt" class="tight"><thead><tr><th>#</th><th>Address</th><th class="n">Eff. tax</th><th class="n">Net / yr</th><th class="n">Kept 10y</th><th>Route in</th><th class="n">Flight</th><th class="n">Cost</th><th class="n">Score</th></tr></thead>
${rows.map((r,i)=>`<tr class="${T3.includes(r)?'lead':''}"><td>${i+1}</td><td>${r.j.flag} ${r.j.city}</td><td class="n">${pct(r.eff)}</td><td class="n">${fmt(r.net)}</td><td class="n">${fmt(r.kept10)}</td><td>${FR[r.fr]}</td><td class="n">${r.fly?r.fly+'h':'0'}</td><td class="n">${r.j.cost}</td><td class="n">${Math.round(r.score*100)}</td></tr>`).join('')}</table>
<p class="small">Score is 0 to 100 relative to this field and your weights. Cost is an index where 100 is the most expensive city on the list. Highlighted rows are the three profiled in this dossier. ${KEPTNOTE}</p>`);

/* 4-6. City chapters */
T3.forEach((r,i)=>{const j=r.j;const tax=r.tax,net=r.net;const cg=S.exit?cgUSD(j,S.exit,US):0;const fl=FLOW[j.cc];
page('',`<div class="eyebrow">0${4+i} · Candidate ${i+1} of 3 · Rank ${rankOf(r)} of ${J.length}</div><h2>${j.flag} ${j.city}, <em>${j.country}</em></h2>
<p class="lede">${esc(j.lede)}</p>
<div class="kpis"><div><i>Tax on ${fmt(S.inc)}</i><b>${fmt(tax)}</b><small>${pct(r.eff)} effective</small></div><div><i>Net a year</i><b>${fmt(net)}</b><small>before living costs</small></div><div><i>On the exit</i><b>${S.exit?fmt(cg):'n/a'}</b><small>${S.exit?`${(j.cg*100).toFixed(0)}% capital gains${US?', US floor':''}`:'no event modeled'}</small></div><div><i>Kept over 10 years</i><b>${fmt(r.kept10)}</b><small>rank ${rankOf(r)} on net kept</small></div></div>
<h3>The tax picture</h3>
<table><thead><tr><th>Line</th><th class="n">Amount</th><th>Note</th></tr></thead><tr><td>Gross income</td><td class="n">${$f(S.inc)}</td><td>as entered</td></tr><tr><td>Income tax, simplified brackets</td><td class="n">${$f(tax)}</td><td>${j.cur} brackets converted at ${FX[j.cur]} USD${j.add?', plus '+(j.add*100).toFixed(1)+'% surcharge':''}${j.cap?', capped at '+(j.cap*100)+'%':''}${US&&j.cur!=='USD'?', US federal floor applied':''}</td></tr><tr><td>Net income</td><td class="n"><b>${$f(net)}</b></td><td>${pct(1-r.eff)} of gross</td></tr>${S.exit?`<tr><td>Liquidity event</td><td class="n">${$f(S.exit)}</td><td>as entered</td></tr><tr><td>Tax on the gain</td><td class="n">${$f(cg)}</td><td>${(j.cg*100).toFixed(0)}% local rate${US?', US 23.8% floor':''}</td></tr>${XH?`<tr><td>Exit rule of ${homeC}, on leaving</td><td class="n">${XH.tax>0?$f(XH.tax):'None'}</td><td>${XH.tax>0?'indicative, if the whole event is gain at departure. '+XH.defer:'no charge on the way out'}</td></tr>`:''}`:''}</table><p class="small">${KEPTNOTE}</p>${slot('city'+(i+1))}
${j.regime?`<div class="box gold"><h4 style="margin-top:0">Special regime, flagged not applied</h4><p style="margin:0">${esc(j.regime)}. If you qualify, your real rate is lower than the table above. Confirm the current figure and the election mechanics with counsel before you plan around it.</p></div>`:''}
${(()=>{const w=wealthTax(j,S);if(!w&&!j.wealth)return '';if(!w)return `<div class="box"><h4 style="margin-top:0">Wealth tax</h4><p style="margin:0">Levied on your total net assets, including holdings abroad. Rate not modeled here. Verify with counsel.</p></div>`;return `<div class="box"><h4 style="margin-top:0">Wealth tax, indicative</h4><p style="margin:0">${esc(w.note)}. ${w.annual!=null?`On the ${$f(w.base)} you would hold after the exit, that is about <b>${$f(w.annual)}</b> a year, <b>${$f(w.tenYear)}</b> over 10 years, on top of the income figures above.`:'No liquidity event is modeled, so the base is unknown. Multiply your net assets by the rate for the annual charge.'} Levied on worldwide net assets. Not in the ranking.</p></div>`})()}
<h3>The route in, on your ${ppText} passport</h3>
<p><b>${FR[r.fr]}.</b> ${esc(j.visa.t)}</p>
<h3>The life</h3>
<table><thead><tr><th>Cost index</th><th>Safety</th><th>Schools</th><th>Sun</th><th>Beauty</th><th>Flight from ${home[0]}</th><th>Net millionaire inflow 2025</th></tr></thead><tr><td>${j.cost} / 100</td><td>${j.safe} / 10</td><td>${j.school} / 10</td><td>${j.sun.toLocaleString()} h</td><td>${j.beauty} / 10</td><td>${r.fly?r.fly+' h':'Home'}</td><td>${fl!=null?(fl>0?'+':'')+fl.toLocaleString()+' (country)':'No data'}</td></tr></table>
<h3>The housing corridors</h3><p>${CORR[j.id]?`The 3 addresses to see first: <b>${CORR[j.id].join('</b>, <b>')}</b>. Prices are quoted on request and move with the season, so the dossier names the corridors and leaves the figures to the agent you meet there.`:'Corridors on request.'}</p>
<h4>An ordinary day in ${j.city}</h4>
<ul class="tl four">${j.day.map(d=>`<li><i>${d[0]}</i><div><b>${esc(d[1])}</b><span>${esc(d[2])}</span></div></li>`).join('')}</ul>`)});

/* 7. Head to head */
page('',`<div class="eyebrow">07 · Head to head</div><h2>Three addresses, <em>one</em> table.</h2>
<table><thead><tr><th></th>${T3.map(r=>`<th>${r.j.flag} ${r.j.city}</th>`).join('')}</tr></thead>
${[['Rank on your weights',r=>rankOf(r)+' of '+J.length],['Effective income tax',r=>pct(r.eff)],['Net income a year',r=>fmt(r.net)],['Tax on the exit',r=>S.exit?fmt(cgUSD(r.j,S.exit,US)):'n/a'],['Kept over 10 years',r=>fmt(r.kept10)],['Route in',r=>FR[r.fr]],['Special regime',r=>r.j.regime?'Yes, verify':'None'],['Wealth tax, annual, indicative',r=>{const w=wealthTax(r.j,S);return w?(w.annual!=null?fmt(w.annual):(w.rate*100).toFixed(2)+'% of net assets'):(r.j.wealth?'Yes, verify':'None')}],['Exit rule of '+homeC+', on the event',r=>XH?(XH.tax>0?fmt(XH.tax):'None'):'n/a'],['Flight from '+home[0],r=>r.fly?r.fly+' h':'Home'],['Cost index',r=>r.j.cost+' / 100'],['Safety',r=>r.j.safe+' / 10'],['Schools',r=>r.j.school+' / 10'],['Sun, hours a year',r=>r.j.sun.toLocaleString()],['Beauty',r=>r.j.beauty+' / 10'],['Net millionaire inflow 2025, country level (Henley)',r=>{const f=FLOW[r.j.cc];return f!=null?signed(f)+' ('+r.j.country+')'+(FLOWNOTE[r.j.id]?'. '+FLOWNOTE[r.j.id]:''):'No data'}]].map(([l,f])=>`<tr><td>${l}</td>${T3.map(r=>`<td><b>${f(r)}</b></td>`).join('')}</tr>`).join('')}</table>
<h3>How to read it</h3>
<p>Where the numbers are close, the life decides. Where the numbers are far apart, the life has to be worth the difference. ${L.j.city} leads by ${Math.round((L.score-T3[1].score)*100)} points on your weights over ${T3[1].j.city}${Math.round((L.score-T3[1].score)*100)<=4?', which is inside the noise of the model. Visit both':''}.</p>
<p>If you move one slider, the order can change. The three sliders that move this ranking most for you are ${Object.entries(S.w).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>WN[x[0]].toLowerCase()).join(', ')}.</p>
<h3>What to verify, per candidate</h3>
<ul class="verify">${T3.map(r=>`<li><b>${r.j.city}.</b> ${risks(r)[0]||'No structural flags beyond the assumptions in section 10.'}</li>`).join('')}</ul>`);

/* 8. Structure and passports */
const A=ARCH[arch()]||ARCH.exec;const AN={exec:'The Executive',founder:'The Founder',investor:'The Investor',builder:'The Builder'};
const destPass=PASS.filter(p=>T3.some(r=>r.j.cc===p.k));const heldPass=PASS.filter(p=>S.pp.has(p.k));
page('',`<div class="eyebrow">08 · The structure and the passport</div><h2>How the money is <em>held</em>.</h2>
<p>Your profile reads as <b>${AN[arch()]||'The Executive'}</b>${S.exit>0?', because a liquidity event is on the table':''}. The map below is the archetype, not your case. Counsel draws your case.</p>
<div class="ent">${A.nodes.map(n=>`<div><b>${n[1]}</b><span>${n[2]}</span></div>`).join('')}</div>
<div class="arrows">${A.edges.map(e=>`<span>${A.nodes.find(n=>n[0]===e[0])[1]} → ${A.nodes.find(n=>n[0]===e[1])[1]}: ${e[2]}</span>`).join('')}</div>
${A.pattern?`<h3>The goal</h3><p>${A.pattern.goal}</p><h3>The structure</h3><p>${A.pattern.structure}</p><h3>The trap</h3><p>${A.pattern.trap}</p>`:A.notes.map(n=>`<h3>${n[0]}</h3><p>${n[1]}</p>`).join('')}
${(typeof OVERLAYS!=='undefined'?OVERLAYS:[]).filter(o=>(o.k==='us'&&S.pp.has('us'))||(o.k==='family'&&S.hh==='kids')).map(o=>`<div class="warn"><b>${o.t}.</b> ${o.p}</div>`).join('')}
${slot('structure')}<h3>The sequence, for counsel to complete</h3>
<p class="small">The pattern above is the archetype. The lines below are your case, and they are settled with a lawyer in ${L.j.city}, not by this draft. The exit rule of ${homeC} is set out below. The dates are yours to fix with counsel; the rest counsel signs.</p>
<table class="seq"><tbody>
<tr><td><b>1. Residence start date in ${L.j.city}</b><span>The day tax residence begins. Lease, registration, day count evidence from this date.</span></td><td class="fill">Counsel, on your dates</td></tr>
<tr><td><b>2. Exit rule of ${homeC}</b><span>${XH?esc(XH.note):'Exit tax, deemed disposition, temporary non residence claw back, or none. The threshold and the clock.'}</span></td><td class="fill">Dossier, verify with counsel</td></tr>
<tr><td><b>3. ${S.exit>0?'Transaction date relative to residence':'Contract date relative to residence'}</b><span>${S.exit>0?'Term sheet and closing must sit behind the residence date by the margin the exit rule requires.':'The employment contract or the regime election is dated after residence starts, not before.'}</span></td><td class="fill">Counsel, on your dates</td></tr>
<tr><td><b>4. Regime election</b><span>Which inbound regime, the election deadline, and what it excludes.</span></td><td class="fill">Counsel</td></tr>
<tr><td><b>5. Entity and holding</b><span>${S.exit>0?'Whether the shares move into a holding first, where, and the participation exemption that applies.':'Whether any entity is needed at all, and where it is managed from.'}</span></td><td class="fill">Counsel</td></tr>
<tr><td><b>6. Substance evidence</b><span>Office, board minutes, decision makers, staff location. What ${homeC} will ask for if it tests place of effective management.</span></td><td class="fill">Counsel</td></tr>
<tr><td><b>7. Wealth, inheritance, and the wrapper</b><span>Wealth tax exposure in ${L.j.city}, the inheritance rate to your heirs, forced heirship, and whether a trust or foundation is warranted.</span></td><td class="fill">Counsel</td></tr>
<tr><td><b>8. Written residency opinion</b><span>A signed opinion that the structure holds under the rules of ${L.j.city} and ${homeC} on your dates.</span></td><td class="fill">Counsel</td></tr>
</tbody></table>
<h3>The passport question</h3>
${destPass.length?`<table><thead><tr><th>Passport</th><th class="n">Visa free</th><th>Years to citizenship</th><th>Dual</th><th>Investment route</th></tr></thead>${destPass.map(p=>`<tr><td><b>${p.f} ${p.n}</b><br><span class="small">${p.note}</span></td><td class="n">${p.mob}</td><td>${p.yrs}</td><td>${p.dual}</td><td>${p.inv}</td></tr>`).join('')}</table>`:`<p>None of your three candidates offers a realistic path to a second passport. Treat them as residence, and keep the ladder question separate.</p>`}
${heldPass.some(p=>p.ctax&&p.ctax!=='No')?`<div class="warn">One of the passports you hold taxes you after you leave. The local rates in this dossier are floors, not the rate you pay. Renunciation is a separate, expensive decision with its own exit tax.</div>`:''}`);

/* 9. Questions, plan, sources */
const MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];const d=n=>{const x=new Date(today);x.setDate(x.getDate()+n);return x.getDate()+' '+MO[x.getMonth()]};
page('',`<div class="eyebrow">09 · Before you sign anything</div><h2>Five questions for <em>counsel</em>, and the first 90 days.</h2>
<h3>The five questions, for a lawyer in ${L.j.city}</h3><ol>${questions(L).map(q=>`<li>${q}</li>`).join('')}</ol>
${slot('sequence')}<h3>The first 90 days</h3>
<ul class="tl grid"><li><i>${d(0)}</i><div><b>Counsel call in ${L.j.city}</b><span>Take the five questions above. Ask for a written residency opinion and a fee quote for the application.</span></div></li><li><i>${d(14)}</i><div><b>Order of operations</b><span>${S.exit?'Fix the sequence: move, then sell, or sell, then move. Model both with the exit rules of '+homeC+'.':'Fix the date you cease residence in '+homeC+' and the evidence you will keep: lease, school enrollment, day counts.'}</span></div></li><li><i>${d(30)}</i><div><b>Visit ${L.j.city} and ${T3[1].j.city}</b><span>An ordinary weekday, not a weekend. Schools, the commute, the bank, the housing corridor. The visit settles what the model cannot.</span></div></li><li><i>${d(45)}</i><div><b>Residence application</b><span>${FR[L.fr]}. Bank reference, proof of funds, health cover, and a local address are the usual file.</span></div></li><li><i>${d(60)}</i><div><b>Banking and structure</b><span>Open the local account and, if counsel agrees, set the holding before the first vesting or sale after the move.</span></div></li><li><i>${d(90)}</i><div><b>Cut the ties</b><span>Deregister in ${homeC}, notify the tax authority, close what has to close. Keep the day count from day one.</span></div></li></ul>
`);
page('',`<div class="eyebrow">10 · Assumptions, sources, and the small print</div><h2>What this dossier <em>is</em>, and is not.</h2>
<h3>Assumptions</h3>
<p class="small" style="font-size:9pt;line-height:1.5">${KEPTNOTE} The exit rule of ${homeC} and the wealth tax lines are indicative headline mechanisms for 2026, applied on the assumption that the whole liquidity event is unrealized gain at departure and that the proceeds are the balance sheet afterwards. Income tax uses simplified 2026 headline marginal brackets in local currency converted at fixed rates (${Object.entries(FX).slice(0,6).map(([k,v])=>k+' '+v).join(', ')}). Capital gains uses the local headline rate on the full event. US citizens are floored at US federal rates (income) and 23.8% (gains). Social contributions, deductions, municipal taxes, wealth taxes, and treaties are excluded. Editorial indices for cost, safety, schools, sun, and beauty are Patrician's. Net millionaire inflow is country level from the Henley Private Wealth Migration Report 2025. Visa routes are as understood at publication and change often.</p>
<h3>Sources</h3><ul class="small" style="font-size:9pt"><li>Henley &amp; Partners, Private Wealth Migration Report 2025, for country level net millionaire flows.</li><li>National tax authorities and published 2026 headline brackets, simplified.</li><li>Published residence and citizenship program rules as understood at the date on the cover.</li><li>Patrician editorial indices for cost, safety, schools, sun, and beauty.</li></ul>
<h3>The small print</h3><p class="small" style="font-size:9pt;line-height:1.5">This dossier is a modeling and introduction document. It is not tax, legal, immigration, or investment advice, and nothing in it creates an adviser relationship. Licensed counsel in the jurisdiction must confirm every figure and route before you act. Reference ${REF}, prepared ${DATE}.</p><p class="small" style="font-size:9pt;line-height:1.5"><b>Confidential and protected.</b> This dossier is prepared for the named recipient on the inputs they supplied, is licensed for their personal use and for sharing with their own advisers, and may not be resold, republished, extracted, or used to provide services to others. © 2026 Patrician · patrician.ch · All rights reserved. It is not legal, tax, immigration, investment, or financial advice, no outcome is guaranteed, and the terms at patrician.ch/legal.html apply, including the limitation of liability and the requirement to verify every figure with licensed counsel before acting.</p>
<div class="sig">Patrician</div>`);

return {pages:P,L,T3,rows,ord,REF,DATE,home,homeC,US,arche:arch()}}
if(typeof module!=='undefined')module.exports={buildDossier};
