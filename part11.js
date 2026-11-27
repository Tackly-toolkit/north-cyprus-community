/* =====================================================================
   part11.js  –  Fun Night for admins: the on/off switch, separate Bingo
   and Raffle cards, creating a night, Mark as paid, refunds, the cash
   ledger, announcements to chosen members, and the live host console.
   ===================================================================== */
const AF={nights:[],on:false,night:null,res:[],sum:{},st:null,timer:null,auto:null,ch:null,pick:{},rec:null};
const FLIM={bingo:40,raffle:100,free:100};
const aMoney=(n,cur)=>(Math.round((+n||0)*100)/100).toLocaleString('en-GB')+' '+(cur||'TL');
const aLocal=iso=>{const d=new Date(iso),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes())};
const aStat={draft:'Draft',sales:'Tickets on sale',doors:'Doors open',live:'Live now',closed:'Finished'};

const _vadm11=V.admin;
V.admin=function(){const v=_vadm11.apply(this,arguments);v.b=v.b.replace('</div>\n',`</div>\n ${aRow('admgo','data-sec="fun"','Fun Night','Bingo and raffle nights: settings, tickets, cash and the live host screen')}\n`);return v};
const _admLoad11=admLoad;
admLoad=async function(sec,x){
 if(sec==='fun'||sec==='funedit'||sec==='funann'){AF.on=!!(await aok(sb.from('app_settings').select('fun_night_on').eq('id',1).single())).fun_night_on;AF.nights=await aok(sb.from('fun_nights').select('*').order('starts_at',{ascending:false}).limit(60));try{AF.duesAll=(await sb.rpc('fun_admin_dues',{p_night:null})).data||[]}catch(e){AF.duesAll=[]}if(sec==='funann'){AF.members=AF.members||await aok(sb.rpc('admin_members'))}return}
 if(sec==='funnight'){AF.night=await aok(sb.from('fun_nights').select('*').eq('id',x).single());AF.res=await aok(sb.rpc('fun_admin_reservations',{p_night:x}))||[];AF.sum=await aok(sb.rpc('fun_admin_summary',{p_night:x}))||{};try{AF.dues=(await sb.rpc('fun_admin_dues',{p_night:x})).data||[]}catch(e){AF.dues=[]}try{AF.st=(await sb.rpc('fun_state',{p_night:x})).data}catch(e){AF.st=null}afWatch(x);return}
 return _admLoad11.apply(this,arguments);
};
function afWatch(id){
 if(AF.wid===id&&AF.timer)return;afStop();AF.wid=id;
 AF.timer=setInterval(async()=>{const t=S.stack[S.stack.length-1];if(!t||t.v!=='adm_funnight'){afStop();return}if(document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;try{await admLoad('funnight',id)}catch(e){return}renderOv(true)},5000);
 try{AF.ch=sb.channel('fun:'+id).subscribe()}catch(e){}
}
function afStop(){clearInterval(AF.timer);AF.timer=null;clearInterval(AF.auto);AF.auto=null;try{if(AF.ch)sb.removeChannel(AF.ch)}catch(e){}AF.ch=null;AF.wid=null}
const afTick=()=>{try{if(AF.ch)AF.ch.send({type:'broadcast',event:'tick',payload:{}})}catch(e){}};
const afDo=async(fn,args,msg)=>{try{await aok(sb.rpc(fn,args));afTick();if(msg)toast(msg);await admReload()}catch(e){}};

/* ---------- Fun Night home: the switch, then one card per game ---------- */
V.adm_fun=function(){
 const card=(g,title,blurb)=>{const L=AF.nights.filter(n=>n.game===g);return `<div class="card"><h3 class="h2">${title}</h3><p class="sm mut" style="margin:4px 0 10px">${blurb}</p><div class="stack">${L.length?L.map(n=>aRow('admgo',`data-sec="funnight" data-x="${n.id}"`,esc(n.name),aTime(n.starts_at),`<span class="pill${n.status==='live'?' red':''}">${aStat[n.status]}</span>`)).join(''):'<p class="mut">No nights yet.</p>'}<button class="btn block" data-act="afnew" data-g="${g}">New ${g} night</button></div></div>`};
 return {t:'Fun Night',b:`<div class="stack">
 <div class="card row" style="gap:12px;align-items:flex-start"><div class="grow"><b>Fun Night is ${AF.on?'ON':'OFF'}</b><div class="xs mut">${AF.on?'Members can see the nights you put on sale.':'Hidden from every member. You can still set nights up and test them yourself.'}</div></div>${aSw(AF.on,'afswitch','','Fun Night on or off')}</div>
 ${card('bingo','Bingo settings',`Up to ${FLIM.bingo} players by default, 1 to 4 cards each. Three games a night: one line, two lines, full house.`)}
 ${card('raffle','Raffle settings',`Up to ${FLIM.raffle} players by default. One random draw for each prize, written to a record.`)}
 ${(AF.duesAll||[]).length?`<div class="card"><h3 class="h2">Still to collect</h3><p class="sm mut" style="margin:4px 0 2px">Extra bingo rounds that players said they would pay for next time. They cannot reserve again until this is settled.</p>${AF.duesAll.map(afDueRow).join('')}</div>`:''}
 <div class="card"><h3 class="h2">Announce an event</h3><p class="sm mut" style="margin:4px 0 10px">Send a short private message and phone alert to the members you choose. It is not a public post.</p><button class="btn soft block" data-act="admgo" data-sec="funann">Write an announcement</button></div>
 </div>`};
};
ACT.afswitch=async()=>{try{await aok(sb.from('app_settings').update({fun_night_on:!AF.on}).eq('id',1));aLog('fun_switch',{on:!AF.on});toast(!AF.on?'Fun Night is now ON for members':'Fun Night is now hidden');await admReload()}catch(e){}};
ACT.afnew=d=>{AF.edit={game:d.g,name:'',max_players:FLIM[d.g],max_tickets_each:d.g==='bingo'?4:10,prizes:[{kind:'cash'},{kind:'cash'},{kind:'cash'}],currency:'TL'};admGo('funedit')};
/* prizes: each one is either cash or an item, set one by one */
const afDueRow=j=>`<div class="row" style="justify-content:space-between;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid var(--line)"><span class="grow" style="min-width:0;overflow-wrap:anywhere"><b>${esc(j.name||'')}</b><span class="xs mut" style="display:block">${esc(j.night||'')} · round ${j.round} · ${j.qty} card${j.qty===1?'':'s'}${j.owes?' · '+aMoney(j.amount):''}</span></span>${!j.owes?'<span class="pill">paid up front</span>':j.settled_at?'<span class="pill">settled</span>':`<button class="btn" data-act="afsettle" data-id="${j.id}">Settled</button>`}</div>`;
const afPzKind=p=>p.kind||(p.text?'item':'cash');
function afPrizeRows(P,g,pre){
 const lab=i=>g==='bingo'?['One line','Two lines','Full house'][i]:`Prize ${i+1}${P.length>1?(i===0?' (drawn first)':i===P.length-1?' (drawn last, the big one)':''):''}`;
 return P.map((p,i)=>{const k=afPzKind(p);return `<div class="card" style="box-shadow:none;background:var(--bg);margin-top:8px"><div class="row" style="justify-content:space-between;gap:8px"><b>${lab(i)}</b>${g==='raffle'&&P.length>1?`<button class="btn line" data-act="afpzdel" data-i="${i}">Remove</button>`:''}</div>
 <label class="f" for="${pre}k${i}">What kind of prize?</label><select id="${pre}k${i}" data-pzk="${pre}" data-i="${i}"><option value="cash" ${k==='cash'?'selected':''}>Cash</option><option value="item" ${k==='item'?'selected':''}>An item (hamper, voucher, bottle…)</option></select>
 <div id="${pre}w${i}" ${k==='cash'?'hidden':''}><label class="f" for="${pre}t${i}">What is the prize?</label><input id="${pre}t${i}" maxlength="60" value="${k==='item'?esc(p.text||''):''}" placeholder="e.g. Food hamper"></div>
 <label class="f" for="${pre}v${i}" id="${pre}l${i}">${k==='cash'?'How much cash?':'What it cost us (optional, for the profit sum)'}</label><input id="${pre}v${i}" inputmode="decimal" value="${p.value||''}"></div>`}).join('');
}
function afPrizeRead(pre,cur){
 const out=[];for(let i=0;$('#'+pre+'k'+i);i++){const kind=$('#'+pre+'k'+i).value,v=+String(val(pre+'v'+i)).replace(/[^0-9.]/g,'')||0;out.push({kind,value:v,text:kind==='cash'?(v?v.toLocaleString('en-GB')+' '+(cur||'TL')+' cash':''):val(pre+'t'+i)})}
 return out;
}
const afPrizeBad=P=>{const i=P.findIndex(p=>!p.text);return i<0?'':(P[i].kind==='cash'?'Enter the cash amount for every cash prize.':'Give every item prize a name.')};
document.addEventListener('change',e=>{const d=e.target.dataset||{};if(!d.pzk)return;const cash=e.target.value==='cash',w=$('#'+d.pzk+'w'+d.i),l=$('#'+d.pzk+'l'+d.i);if(w)w.hidden=cash;if(l)l.textContent=cash?'How much cash?':'What it cost us (optional, for the profit sum)'});
function afGrab(){const n=AF.edit||{},dt=val('fe-d');Object.assign(n,{name:val('fe-n'),price_text:val('fe-pt'),price_amount:val('fe-pa')===''?null:+val('fe-pa'),currency:val('fe-cu')||'TL',pay_info:val('fe-pi'),max_players:+val('fe-mp')||n.max_players,max_tickets_each:+val('fe-mt')||n.max_tickets_each,prizes:afPrizeRead('pz',val('fe-cu'))});if(dt)n.starts_at=new Date(dt).toISOString()}
ACT.afpzadd=()=>{afGrab();AF.edit.prizes.push({kind:'cash'});renderOv(true)};
ACT.afpzdel=d=>{afGrab();AF.edit.prizes.splice(+d.i,1);renderOv(true)};
ACT.afedit=()=>{AF.edit=Object.assign({},AF.night,{prizes:(AF.night.prizes||[]).map(p=>Object.assign({},p))});admGo('funedit')};
V.adm_funedit=function(){
 const n=AF.edit||{},g=n.game,soft=FLIM[g];
 return {t:(n.id?'Edit ':'New ')+(g==='bingo'?'bingo':'raffle')+' night',b:`<div class="stack"><div class="card"><h3 class="h2">${g==='bingo'?'Bingo settings':'Raffle settings'}</h3>
 <label class="f" for="fe-n">Name of the night</label><input id="fe-n" maxlength="60" value="${esc(n.name||'')}" placeholder="${g==='bingo'?'Friday Bingo Night':'Winter Raffle'}">
 <label class="f" for="fe-d">Date and start time</label><input id="fe-d" type="datetime-local" value="${n.starts_at?aLocal(n.starts_at):''}">
 <label class="f" for="fe-pt">Ticket price, as members see it</label><input id="fe-pt" maxlength="60" value="${esc(n.price_text||'')}" placeholder="e.g. 200 TL per ${g==='bingo'?'card':'ticket'}">
 <div class="grid2" style="gap:10px"><div><label class="f" for="fe-pa">Price per ticket (number)</label><input id="fe-pa" inputmode="decimal" value="${n.price_amount??''}"></div><div><label class="f" for="fe-cu">Currency</label><input id="fe-cu" maxlength="6" value="${esc(n.currency||'TL')}"></div></div>
 <label class="f" for="fe-pi">Where and when to pay (optional, leave empty if you will tell people yourselves)</label><textarea id="fe-pi" maxlength="400" placeholder="Pay Chris or Natalie in cash at …, between … and …">${esc(n.pay_info||'')}</textarea>
 <div class="grid2" style="gap:10px"><div><label class="f" for="fe-mp">Most players</label><input id="fe-mp" inputmode="numeric" value="${n.max_players||soft}"></div><div><label class="f" for="fe-mt">Most ${g==='bingo'?'cards':'tickets'} each</label><input id="fe-mt" inputmode="numeric" value="${n.max_tickets_each||4}"></div></div>
 <div id="fe-warn"></div>
 </div><div class="card"><h3 class="h2">Prizes</h3><p class="sm mut" style="margin:4px 0 2px">${g==='bingo'?'One prize for each game. Each can be cash or an item.':'Drawn in this order, so put the biggest last. Each can be cash or an item.'}</p>${afPrizeRows((n.prizes||[]).length?n.prizes:[{kind:'cash'}],g,'pz')}${g==='raffle'?'<button class="btn soft block" style="margin-top:10px" data-act="afpzadd">Add another prize</button>':''}
 <button class="btn block" style="margin-top:12px" data-act="afsave">Save</button></div></div>`};
};
document.addEventListener('change',e=>{if(e.target.id==='af-pace'){AF.pace=+e.target.value;if(AF.auto){afStopAuto();ACT.afauto()}}});
document.addEventListener('input',e=>{if(e.target.id!=='fe-mp')return;const v=+e.target.value||0,g=(AF.edit||{}).game,w=$('#fe-warn');if(!w)return;
 w.innerHTML=v>FLIM.free?`<div class="card" style="background:var(--rs);color:var(--r);box-shadow:none;margin-top:10px"><b>This goes past the free allowance.</b><p style="margin:6px 0 0">More than ${FLIM.free} people in the room at once needs the paid plan for our live updates (the part that keeps every phone in step), and table talk would need a paid audio relay. Check with Firat before saving this number.</p></div>`:(g==='bingo'&&v>42?`<div class="card" style="background:#fff6d9;color:#3a2a1e;box-shadow:none;margin-top:10px">The biggest room seats 42. Extra players can still play, but they are listed under the room instead of sitting at a table.</div>`:'')});
ACT.afsave=async()=>{
 const n=AF.edit||{},name=val('fe-n'),dt=val('fe-d');if(!name||!dt)return toast('Add a name, date and time.');
 const prizes=afPrizeRead('pz',val('fe-cu')),bad=afPrizeBad(prizes);
 if(n.game==='bingo'&&prizes.length!==3)return toast('Bingo needs exactly three prizes: line, two lines, full house.');
 if(!prizes.length)return toast('Add at least one prize.');if(bad)return toast(bad);
 const row={name,game:n.game,starts_at:new Date(dt).toISOString(),price_text:val('fe-pt')||null,price_amount:val('fe-pa')===''?null:+val('fe-pa'),currency:val('fe-cu')||'TL',pay_info:val('fe-pi')||null,max_players:Math.max(2,+val('fe-mp')||FLIM[n.game]),max_tickets_each:Math.max(1,+val('fe-mt')||1),prizes,host_name:'George'};
 try{let id=n.id;if(id)await aok(sb.from('fun_nights').update(row).eq('id',id));else{row.created_by=S.uid;id=(await aok(sb.from('fun_nights').insert(row).select('id').single())).id}
  aLog('fun_night_save',{id});toast('Saved');S.stack.pop();if(S.stack.length&&S.stack[S.stack.length-1].v==='adm_funnight')S.stack.pop();await admGo('funnight',id)}catch(e){}
};

/* ---------- one night: counts, money, players, live host screen ---------- */
V.adm_funnight=function(){
 const n=AF.night||{},s=AF.sum||{},st=AF.st||{},x=st.state||{},R=AF.res||[],cur=n.currency,g=n.game,live=n.status==='live';
 const tile=(v,l)=>`<div class="card" style="text-align:center;padding:12px 6px"><div class="h2">${v}</div><div class="xs mut">${l}</div></div>`;
 const wait=R.filter(r=>r.status==='reserved'),paid=R.filter(r=>r.status==='paid'),gone=R.filter(r=>r.status==='expired'||r.status==='refunded');
 const next={draft:['sales','Open ticket sales'],sales:['doors','Open the doors'],doors:['live','Start the night'],live:['closed','Close the night']}[n.status];
 const profit=(+s.income||0)-(+s.prize_cost||0);
 let con='';
 if(n.status==='doors'||live){
  const seated=(st.seats||[]),muted=x.muted||[];
  let gm='';
  if(g==='bingo'){const calls=st.calls||[],last=calls[calls.length-1],c=st.claim,stage=x.stage||1,won=(x.winners||{})[stage];
   gm=`<div class="row" style="gap:12px"><div class="fn-ball">${last||'?'}</div><div class="grow"><b>${last?esc(NICK[last]):'No numbers called yet'}</b><div class="xs mut">${calls.length} of 90 called · playing for ${['one line','two lines','full house'][stage-1]}</div></div></div>
   ${x.joining?`<div class="card" style="box-shadow:none;background:#fff6d9;color:#3a2a1e"><b>Round ${s.round||2}: ${s.joined||0} of ${seated.length} have joined so far</b><div class="xs" style="margin-top:4px">Give everyone a moment to choose. Joining closes the moment you call the first number.</div></div>`:''}
   ${c&&calls.length?`<div class="card" style="box-shadow:none;background:${c.valid?'var(--gs)':'var(--bg)'}"><b>${c.valid?'Winning card: '+esc(c.name||''):'A Bingo call was checked: not yet'}</b><div class="xs mut">Checked automatically ${aTime(c.at)}</div></div>`:''}
   ${live?`<div class="fn-seg">${won&&stage<3?`<button class="btn" data-act="afstage" data-s="${stage+1}">Next game: ${['','two lines','full house'][stage]}</button>`:`<button class="btn" data-act="afcall" ${won?'disabled':''}>Call next number</button>`}</div>${won?'':`<p class="xs mut" style="margin-top:6px">You set the pace: press the button for each number, as slowly as you like. About ${Math.max(0,45-calls.length)} more numbers are usually needed for a line and 75 to 85 in all for a full house.</p><div class="card" style="box-shadow:none;background:var(--bg)"><b>Or let it run by itself</b><div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap"><label for="af-pace" class="sm">One number every</label><select id="af-pace" style="width:auto;flex:1;min-width:120px">${[8,10,12,15,20,30].map(v=>`<option value="${v}" ${(AF.pace||12)===v?'selected':''}>${v} seconds</option>`).join('')}</select></div><button class="btn ${AF.auto?'':'soft'} block" style="margin-top:8px" data-act="afauto">${AF.auto?'Stop automatic calling':'Start automatic calling'}</button></div>`}${won&&stage===3?`<p class="sm mut">Full house has been won${(s.round||1)>1?' in round '+s.round:''}. Close the night when you are ready, or offer everyone a fresh start.</p><button class="btn soft block" data-act="afround">Play another round</button>`:''}`:'<p class="sm mut">Press Start the night when everyone is in.</p>'}`}
  else{const d=st.draws||[],left=(n.prizes||[]).length-d.length;
   gm=`${d.map(y=>`<div class="row" style="justify-content:space-between;gap:8px"><span>${esc(y.prize||'Prize '+y.prize_no)}</span><b>${fTk(y.number)} · ${esc(y.name||'')}</b></div>`).join('')||'<p class="mut">No prizes drawn yet.</p>'}
   ${live?(left>0?`<button class="btn block" data-act="afdraw">Draw ${esc(((n.prizes||[])[d.length]||{}).text||'next prize')}</button><p class="xs mut">${left} prize${left===1?'':'s'} left. The winner is picked at random and cannot be changed.</p>`:'<p class="sm mut">All prizes are drawn. Close the night when you are ready.</p>'):'<p class="sm mut">Press Start the night when everyone is in.</p>'}`}
  con=`<div class="card" style="border:2px solid var(--g)"><h3 class="h2">Host screen</h3><p class="xs mut" style="margin:2px 0 10px">${seated.length} of ${s.paid||0} players are in the room · ${st.tables||1} table${(st.tables||1)===1?'':'s'}. Keep this page open while the night is running.</p><div class="stack">${gm}
  <div class="card" style="box-shadow:none;background:var(--bg)"><b>Speaking to the room</b><div class="fn-seg" style="margin-top:8px"><button class="btn ${x.quiet?'':'soft'}" data-act="afquiet">${x.quiet?'Let the tables talk again':'Quiet please'}</button><button class="btn ${AF.rec?'':'soft'}" data-act="afrec">${AF.rec?'Stop and send':'Record an announcement'}</button></div><p class="xs mut" style="margin-top:6px">Quiet please mutes every table. An announcement is up to 15 seconds and plays to everyone a moment after you stop.</p>
  <div class="row" style="justify-content:space-between;gap:10px;margin-top:8px"><span>Table talk for this night</span>${aSw(x.talk===true,'aftalk','','Table talk on or off')}</div></div>
  <div class="card" style="box-shadow:none;background:${x.locked?'var(--rs)':'var(--bg)'}"><div><div><b>${x.locked?'The doors are closed':'The doors are open'}</b><div class="xs mut">${x.locked?'Nobody new can come in. Players already inside can still come back if their phone drops out.':`Latecomers with a ticket can still come in. ${(s.paid||0)-seated.length} paid player${(s.paid||0)-seated.length===1?' is':'s are'} not in yet.`}</div></div><button class="btn ${x.locked?'':'soft'} block" style="margin-top:10px" data-act="aflock">${x.locked?'Reopen the doors':'Close the doors'}</button></div></div>
  ${seated.length?`<div class="card" style="box-shadow:none;background:var(--bg)"><b>In the room</b><div class="fn-seg" style="margin-top:8px"><button class="btn soft" data-act="afmuteall" data-on="1">Mute all</button><button class="btn soft" data-act="afmuteall" data-on="0">Unmute all</button></div>${seated.map(p=>`<div class="row" style="justify-content:space-between;gap:8px;margin-top:8px"><span style="overflow-wrap:anywhere">${esc(p.name||'')} <span class="xs mut">table ${p.table}</span></span><button class="btn ${muted.includes(p.id)?'':'soft'}" data-act="afmute" data-id="${p.id}">${muted.includes(p.id)?'Unmute':'Mute'}</button></div>`).join('')}</div>`:''}</div></div>`;
 }
 return {t:esc(n.name||'Fun Night'),b:`<div class="stack">
 <div class="card"><div class="row" style="justify-content:space-between;gap:8px"><span class="pill${live?' red':''}">${aStat[n.status]}</span><span class="sm mut">${n.starts_at?aTime(n.starts_at):''}</span></div>
 <div class="fn-seg" style="margin-top:10px">${next?`<button class="btn" data-act="afstatus" data-s="${next[0]}">${next[1]}</button>`:''}${n.status!=='closed'?`<button class="btn soft" data-act="afedit">Edit details</button>`:''}${n.status==='sales'?`<button class="btn soft" data-act="afstatus" data-s="draft">Pause sales</button>`:''}</div></div>
 ${con}
 <div class="grid2" style="gap:10px">${tile(s.reserved??0,'Waiting to pay')}${tile(s.paid??0,'Paid')}${tile(s.seats_left??0,'Seats left')}${tile({small:'Small',medium:'Medium',large:'Large',xl:'Extra large'}[s.room]||'–','Room')}</div>
 <div class="card"><h3 class="h2">Money for this night</h3><div class="row" style="justify-content:space-between;margin-top:8px"><span>Cash taken (${s.tickets||0} tickets)</span><b>${aMoney(s.income,cur)}</b></div><div class="row" style="justify-content:space-between;margin-top:6px"><span>Cost of prizes${(s.round||1)>1?' (all '+s.round+' rounds)':''}</span><b>${aMoney(s.prize_cost,cur)}</b></div><div class="row" style="justify-content:space-between;margin-top:6px;padding-top:8px;border-top:1px solid var(--line)"><span>${profit>=0?'Left over':'Short by'}</span><b style="color:${profit>=0?'var(--gd)':'var(--r)'}">${aMoney(Math.abs(profit),cur)}</b></div>${+s.to_collect?`<div class="row" style="justify-content:space-between;margin-top:6px"><span>Still to collect for extra rounds</span><b>${aMoney(s.to_collect,cur)}</b></div>`:''}${n.price_amount&&+s.prize_cost?`<p class="xs mut" style="margin-top:8px">The prizes are covered once ${Math.ceil(+s.prize_cost/+n.price_amount)} tickets are paid for.</p>`:''}</div>
 ${(AF.dues||[]).length?`<div class="card"><h3 class="h2">Extra rounds</h3><p class="sm mut" style="margin:4px 0 2px">Who joined a further round, and who still owes for it. Tap Settled once the cash is in your hand.</p>${AF.dues.map(afDueRow).join('')}</div>`:''}
 <div class="card"><h3 class="h2">Waiting to pay</h3>${wait.length?wait.map(r=>`<div class="row" style="justify-content:space-between;gap:8px;margin-top:10px"><span class="grow" style="min-width:0;overflow-wrap:anywhere"><b>${esc(r.name||'')}</b><span class="xs mut" style="display:block">${r.qty} ${g==='bingo'?'card':'ticket'}${r.qty===1?'':'s'} · pay by ${aTime(r.expires_at)}</span></span><button class="btn" data-act="afpay" data-id="${r.id}">Mark as paid</button></div>`).join(''):'<p class="mut" style="margin-top:6px">Nobody is waiting.</p>'}</div>
 <div class="card"><h3 class="h2">Paid players and cash ledger</h3>${paid.length?paid.map(r=>`<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--line)"><div class="row" style="justify-content:space-between;gap:8px"><b style="overflow-wrap:anywhere">${esc(r.name||'')}${r.seated?' <span class="pill">in the room</span>':''}</b><b>${aMoney(r.amount,cur)}</b></div><div class="xs mut">${g==='bingo'?'Cards':'Tickets'}: ${r.tickets.map(fTk).join(', ')} · taken by ${esc(r.paid_by||'')} ${aTime(r.paid_at)}${r.receipt?' · receipt '+esc(r.receipt):''}${r.rounds_paid>1?' · paid for '+r.rounds_paid+' rounds up front':''}</div><div class="xs mut">Passcode: ${esc(r.passcode||'')}</div>
 <div class="row" style="gap:8px;margin-top:8px"><input id="sp-${r.user_id}" value="${esc(r.spoken_as||'')}" aria-label="How the name is said" style="flex:1;min-width:0"><button class="btn soft" data-act="afsay" data-id="${r.user_id}">Play</button><button class="btn soft" data-act="afspoken" data-id="${r.user_id}">Save</button></div><div class="xs" style="margin-top:4px;color:${r.clip?'var(--gd)':'var(--mut,#777)'}">${r.clip?'George has this first name recorded. Tap Play to hear him.':'George has not recorded this first name yet, so he will welcome them without it.'}</div>
 <div style="text-align:right;margin-top:8px"><button class="btn line" data-act="afrefund" data-id="${r.id}">Refund</button></div></div>`).join(''):'<p class="mut" style="margin-top:6px">No paid players yet.</p>'}${paid.length?'<p class="xs mut" style="margin-top:10px">The box shows how the name will be said. George says the first name only. If it sounds wrong, type how it should sound (for example Ayshe) and save.</p>':''}</div>
 ${gone.length?`<div class="card"><h3 class="h2">Released places</h3>${gone.map(r=>`<div class="row" style="justify-content:space-between;gap:8px;margin-top:8px"><span style="overflow-wrap:anywhere">${esc(r.name||'')} <span class="xs mut">${r.status==='refunded'?'refunded':'not paid in time'}</span></span><button class="btn soft" data-act="afpay" data-id="${r.id}">Mark as paid</button></div>`).join('')}</div>`:''}
 <button class="btn soft block" data-act="admgo" data-sec="funann">Announce this event to members</button></div>`};
};
ACT.afstatus=d=>{if(d.s==='closed'&&!AF.conf){AF.conf=1;setTimeout(()=>AF.conf=0,4000);return toast('Tap again to close the night for everyone')}AF.conf=0;if(d.s==='closed')afStopAuto();afDo('fun_set_status',{p_night:AF.night.id,p_status:d.s},{sales:'Tickets are on sale',doors:'The doors are open',live:'The night has started',closed:'The night is closed',draft:'Sales paused'}[d.s])};
ACT.afpay=d=>{const r=AF.res.find(x=>x.id===d.id)||{};openSheet({v:'afpay',id:d.id,name:r.name,amt:AF.night.price_amount?AF.night.price_amount*r.qty:'',qty:r.qty,bingo:AF.night.game==='bingo'})};
document.addEventListener('change',e=>{if(e.target.id!=='ap-n')return;const b=+e.target.dataset.base;if(b)$('#ap-a').value=b*(+e.target.value)});
ACT.afround=()=>openSheet({v:'afround'});
SH.afround=function(){const n=AF.night,r=((AF.sum||{}).round||1)+1;return `<h2 class="h2">Play another round</h2><p class="mut" style="margin:4px 0 6px">Round ${r} starts with a clean board. Every player in the room is asked if they want to join, and those who do get fresh cards. Anyone who does not join can stay and watch.</p><p class="sm" style="margin:0 0 4px">${n.price_amount?`<b>${aMoney(n.price_amount,n.currency)} a card.</b> `:''}Players who paid for this round up front join straight away. Everyone else goes on the To collect list and pays next time.</p><h3 class="h2" style="margin-top:12px;font-size:1.05rem">Prizes for round ${r}</h3>${afPrizeRows((n.prizes||[]).map(p=>Object.assign({},p)),'bingo','rp')}<button class="btn block" style="margin-top:12px" data-act="afroundok">Start round ${r}</button>`};
ACT.afroundok=async()=>{const P=afPrizeRead('rp',AF.night.currency),bad=afPrizeBad(P);if(bad)return toast(bad);afStopAuto();try{const r=await aok(sb.rpc('fun_new_round',{p_night:AF.night.id,p_prizes:P}));closeSheet();afTick();toast('Round '+r+' is open. Players are choosing whether to join.');await admReload()}catch(e){}};
ACT.afsettle=d=>{if(AF.conf!==d.id){AF.conf=d.id;setTimeout(()=>AF.conf=0,4000);return toast('Tap Settled again once the cash is in your hand')}AF.conf=0;afDo('fun_settle',{p_join:d.id,p_amount:null,p_receipt:null},'Marked as settled')};
SH.afpay=function(o){return `<h2 class="h2">Mark as paid</h2><p class="mut" style="margin:4px 0 10px">${esc(o.name||'')} · ${o.qty} ticket${o.qty===1?'':'s'}. Only tap this once the cash is in your hand.</p>${o.bingo?`<label class="f" for="ap-n">Paying for</label><select id="ap-n" data-base="${o.amt||''}"><option value="1">This night (one round)</option><option value="2">Two rounds up front</option><option value="3">Three rounds up front</option></select><p class="xs mut">Only choose more if they are paying now for a possible extra round. If that round is not played, hand that part back.</p>`:''}<label class="f" for="ap-a">Cash taken</label><input id="ap-a" inputmode="decimal" value="${o.amt}"><label class="f" for="ap-r">Receipt number (optional)</label><input id="ap-r" maxlength="30"><button class="btn block" style="margin-top:12px" data-act="afpayok" data-id="${o.id}">Confirm payment and send tickets</button>`};
ACT.afpayok=async d=>{const a=val('ap-a');if(a===''||isNaN(+a))return toast('Enter the cash taken.');try{const rn=+(($('#ap-n')||{}).value||1);await aok(sb.rpc('fun_mark_paid',{p_res:d.id,p_amount:+a,p_receipt:val('ap-r')||null}));if(rn>1)await aok(sb.rpc('fun_set_rounds_paid',{p_res:d.id,p_rounds:rn}));closeSheet();toast('Paid. Tickets and passcode sent.');await admReload()}catch(e){}};
ACT.afrefund=d=>{if(AF.conf!==d.id){AF.conf=d.id;setTimeout(()=>AF.conf=0,4000);return toast('Tap Refund again to cancel their tickets')}AF.conf=0;afDo('fun_refund',{p_res:d.id},'Refunded. Their tickets are cancelled.')};
ACT.afspoken=d=>afDo('fun_set_spoken',{p_user:d.id,p_spoken:val('sp-'+d.id)},'Saved');
ACT.afsay=d=>{const r=(AF.res||[]).find(x=>x.user_id===d.id)||{},t=val('sp-'+d.id);
 if(r.clip&&t===(r.spoken_as||'')){const w=new Audio('/fun/v/welcome_name.mp3'),a=new Audio(sb.storage.from('fun').getPublicUrl(r.clip).data.publicUrl);w.onended=()=>a.play().catch(()=>{});w.play().catch(()=>a.play().catch(()=>{}));return}
 if(!t||!window.speechSynthesis)return toast('This device cannot play a preview.');const u=new SpeechSynthesisUtterance('Welcome, '+t);u.lang='en-GB';u.rate=.95;speechSynthesis.cancel();speechSynthesis.speak(u);toast(r.clip?'Save first to hear George say it':'George has not recorded this name yet. This is your phone reading it.')};
ACT.afcall=async()=>{if(Date.now()-(AF.lastCall||0)<4500)return toast('George is still calling the last number.');AF.lastCall=Date.now();try{await aok(sb.rpc('fun_call_next',{p_night:AF.night.id}));afTick();await admReload()}catch(e){afStopAuto()}};
function afStopAuto(){clearInterval(AF.auto);AF.auto=null}
ACT.afauto=()=>{if(AF.auto){afStopAuto();return renderOv(true)}
 const step=async()=>{const st=AF.st||{},x=st.state||{};if(x.quiet)return;if((x.winners||{})[x.stage||1]){afStopAuto();toast('We have a winner. Automatic calling has stopped.');return renderOv(true)}await ACT.afcall()};
 AF.pace=+val('af-pace')||AF.pace||12;AF.auto=setInterval(()=>{AF.lastCall=0;step()},AF.pace*1000);AF.lastCall=0;step();renderOv(true)};
ACT.afstage=d=>afDo('fun_set_stage',{p_night:AF.night.id,p_stage:+d.s},'Next game started');
ACT.afdraw=()=>afDo('fun_draw_next',{p_night:AF.night.id},'Drawn. The winner is being announced.');
ACT.afquiet=()=>afDo('fun_host_set',{p_night:AF.night.id,p_key:'quiet',p_value:!((AF.st||{}).state||{}).quiet});
ACT.aflock=()=>{const on=!((AF.st||{}).state||{}).locked;afDo('fun_host_set',{p_night:AF.night.id,p_key:'locked',p_value:on},on?'The doors are closed to latecomers':'The doors are open again')};
ACT.aftalk=()=>afDo('fun_host_set',{p_night:AF.night.id,p_key:'talk',p_value:((AF.st||{}).state||{}).talk!==true});
ACT.afmute=d=>{const m=(((AF.st||{}).state||{}).muted||[]).slice(),i=m.indexOf(d.id);if(i<0)m.push(d.id);else m.splice(i,1);afDo('fun_host_set',{p_night:AF.night.id,p_key:'muted',p_value:m})};
ACT.afmuteall=d=>afDo('fun_host_set',{p_night:AF.night.id,p_key:'muted',p_value:d.on==='1'?(((AF.st||{}).seats)||[]).map(p=>p.id):[]},d.on==='1'?'Everyone is muted':'Everyone is unmuted');
ACT.afrec=async()=>{
 if(AF.rec){try{AF.rec.stop()}catch(e){}return}
 if(!navigator.mediaDevices||!window.MediaRecorder)return toast('This device cannot record. Use Quiet please and the automatic host instead.');
 let stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}catch(e){return toast('Please allow the microphone.')}
 const id=AF.night.id,chunks=[],mr=new MediaRecorder(stream);AF.rec=mr;
 await aok(sb.rpc('fun_host_set',{p_night:id,p_key:'quiet',p_value:true}));afTick();
 mr.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 mr.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());AF.rec=null;clearTimeout(AF.rect);
  try{const type=mr.mimeType||'audio/webm',ext=/mp4|aac/.test(type)?'m4a':'webm',path='ann/'+id+'/'+Date.now()+'.'+ext,blob=new Blob(chunks,{type});
   const up=await sb.storage.from('fun').upload(path,blob,{contentType:type});if(up.error)throw up.error;
   const url=sb.storage.from('fun').getPublicUrl(path).data.publicUrl;
   await aok(sb.rpc('fun_host_set',{p_night:id,p_key:'announce',p_value:{url,ts:Date.now()}}));afTick();toast('Announcement sent to the room');
   setTimeout(async()=>{try{await sb.rpc('fun_host_set',{p_night:id,p_key:'quiet',p_value:false});afTick();admReload()}catch(e){}},Math.min(17000,2000+blob.size/4))
  }catch(e){toast('The announcement could not be sent.')}
  admReload()};
 mr.start();AF.rect=setTimeout(()=>{try{mr.stop()}catch(e){}},15000);renderOv(true);
};

/* ---------- announce an event to chosen members ---------- */
V.adm_funann=function(){
 const L=AF.nights.filter(n=>n.status!=='closed'),M=(AF.members||[]).filter(m=>m.id!==S.uid&&!m.suspended),all=M.length&&M.every(m=>AF.pick[m.id]),cnt=M.filter(m=>AF.pick[m.id]).length;
 return {t:'Announce an event',b:`<div class="stack"><div class="card">
 <label class="f" for="an-n">Which event?</label><select id="an-n">${L.length?L.map(n=>`<option value="${n.id}" ${AF.night&&AF.night.id===n.id?'selected':''}>${esc(n.name)} · ${aTime(n.starts_at)}</option>`).join(''):'<option value="">Create a night first</option>'}</select>
 <label class="f" for="an-b">Short message</label><textarea id="an-b" maxlength="600" rows="4" placeholder="Bingo night this Friday at 8pm. Reserve your cards in the app and pay Chris or Natalie in cash.">${esc(AF.annText||'')}</textarea>
 <p class="xs mut">It arrives as a message from Admin in each member's chat, with a phone alert. The event name and time are added for you.</p></div>
 <div class="card"><div><h3 class="h2">Who should get it?</h3></div><div class="fn-seg" style="margin-top:8px"><button class="btn ${all?'':'soft'}" data-act="anall" data-on="1">Select all (${M.length})</button><button class="btn soft" data-act="anall" data-on="0">Clear all</button></div>
 <div style="margin-top:8px">${M.map(m=>`<label class="row" style="gap:10px;padding:8px 0;border-top:1px solid var(--line)"><input type="checkbox" data-pick="${m.id}" ${AF.pick[m.id]?'checked':''} style="width:22px;height:22px;flex:none"><span style="overflow-wrap:anywhere">${esc(m.display_name||'Member')}</span></label>`).join('')||'<p class="mut">No members yet.</p>'}</div></div>
 <button class="btn block" data-act="ansend" id="an-go">Send to ${cnt} member${cnt===1?'':'s'}</button></div>`};
};
document.addEventListener('change',e=>{const id=e.target.dataset&&e.target.dataset.pick;if(!id)return;AF.pick[id]=e.target.checked;const n=Object.values(AF.pick).filter(Boolean).length,b=$('#an-go');if(b)b.textContent=`Send to ${n} member${n===1?'':'s'}`});
ACT.anall=d=>{const M=(AF.members||[]).filter(m=>m.id!==S.uid&&!m.suspended);AF.annText=val('an-b');AF.pick={};if(d.on==='1')M.forEach(m=>AF.pick[m.id]=true);renderOv(true)};
ACT.ansend=async()=>{
 const ids=Object.keys(AF.pick).filter(k=>AF.pick[k]),night=val('an-n'),body=val('an-b');
 if(!night)return toast('Choose an event first.');if(body.length<3)return toast('Write a short message first.');if(!ids.length)return toast('Choose at least one member.');
 if(AF.conf!=='ann'){AF.conf='ann';setTimeout(()=>AF.conf=0,4000);return toast(`Tap again to send to ${ids.length} member${ids.length===1?'':'s'}`)}AF.conf=0;
 try{const n=await aok(sb.rpc('fun_announce',{p_night:night,p_body:body,p_users:ids}));toast(`Sent to ${n} member${n===1?'':'s'}`);AF.pick={};AF.annText='';pop()}catch(e){}
};
