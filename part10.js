/* =====================================================================
   part10.js  –  Fun Night for members: nights list, reserve, the door,
   the room (photo frames on seats), bingo, raffle, host voice, table talk.
   Hidden unless the admin switch is on (the database enforces this too).
   ===================================================================== */
const FUN={on:false,list:[],at:0,st:null,tix:[],marks:{},timer:null,ch:null,q:[],playing:false,seen:{},vol:1,talk:{on:false,mic:true,peers:{},muted:{},stream:null,ch:null},zoom:true};
const FV='/fun/v/',FI='/fun/img/';
const NICK={1:"Kelly's eye",2:"One little duck",3:"Cup of tea",4:"Knock at the door",5:"Man alive",6:"Half a dozen",7:"Lucky seven",8:"Garden gate",9:"Doctor's orders",10:"Ten, the den",11:"Legs eleven",12:"One dozen",13:"Unlucky for some",14:"Valentine's day",15:"Young and keen",16:"Sweet sixteen",17:"Dancing queen",18:"Coming of age",19:"Goodbye teens",20:"One score",21:"Key of the door",22:"Two little ducks",23:"Thee and me",24:"Two dozen",25:"Duck and dive",26:"Pick and mix",27:"Up at seven",28:"Running late",29:"Rise and shine",30:"Burlington Bertie",31:"Get up and run",32:"Buckle my shoe",33:"All the threes",34:"Ask for more",35:"Jump and jive",36:"Three dozen",37:"More than eleven",38:"Piece of cake",39:"Those famous steps",40:"Life begins",41:"Time for fun",42:"That one's for you",43:"Down on your knee",44:"All the fours",45:"Halfway there",46:"Up to tricks",47:"Four and seven",48:"Four dozen",49:"Nearly fifty",50:"Half a century",51:"Tweak of the thumb",52:"Weeks in a year",53:"Here comes Herbie",54:"Clean the floor",55:"Snakes alive",56:"Pick up sticks",57:"All the beans",58:"Make them wait",59:"Brighton line",60:"Five dozen",61:"Baker's bun",62:"Tickety boo",63:"Tickle me",64:"Knock on the door",65:"Stop and thrive",66:"Clickety click",67:"Six and seven",68:"Saving grace",69:"Either way up",70:"Three score and ten",71:"Bang on the drum",72:"Six dozen",73:"Queen bee",74:"Candy store",75:"Strive and strive",76:"Trombones",77:"Sunset strip",78:"Nearly at the gate",79:"One more time",80:"Eight and blank",81:"Stop and run",82:"Straight on through",83:"Time for tea",84:"Seven dozen",85:"Staying alive",86:"Between the sticks",87:"Torquay in Devon",88:"Wobbly wobbly",89:"Nearly there",90:"Top of the shop"};
/* seats per room: [x, y(base), width] in a 1200 x 896 picture, grouped by table */
const ROOMS={
 small:{img:'room_small.jpg',t:[[[457,604,128],[607,602,128],[760,604,128],[262,662,140],[1040,716,150],[985,580,104]]]},
 medium:{img:'room_medium.jpg',t:[[[262,548,56],[368,547,56],[480,548,56],[176,596,62],[150,706,74],[340,700,62],[468,690,62]],[[760,545,56],[862,544,56],[970,545,56],[1040,596,62],[1062,712,74],[757,690,62],[878,698,62]]]},
 large:{img:'room_large.jpg',t:[[[345,380,36],[408,380,36],[470,380,36],[235,395,36],[525,398,36],[295,448,38],[458,444,38]],[[745,380,36],[805,380,36],[865,380,36],[665,402,36],[945,390,36],[745,444,38],[905,442,38]],[[255,562,52],[345,562,52],[440,562,52],[110,612,56],[505,622,56],[160,705,58],[360,708,58]],[[760,562,52],[850,562,52],[950,562,52],[700,618,56],[1085,612,56],[845,722,58],[1055,708,58]]]},
 xl:{img:'room_xl.jpg',t:[[[240,292,32],[300,268,32],[390,264,32],[455,292,32],[430,326,34],[350,334,34],[265,330,34]],[[495,342,36],[560,306,36],[660,306,36],[735,342,36],[700,394,38],[605,405,40],[510,390,38]],[[770,284,32],[858,258,32],[950,274,32],[990,302,32],[940,330,34],[865,346,34],[790,328,34]],[[70,480,44],[150,434,42],[265,420,42],[365,434,42],[395,492,44],[330,560,48],[205,576,48]],[[815,480,44],[860,430,42],[1005,424,42],[1115,476,44],[1105,554,48],[990,586,48],[865,560,48]],[[435,604,50],[520,532,46],[675,528,46],[770,584,50],[745,700,56],[605,752,58],[455,708,56]]]}
};
const fWhen=iso=>new Date(iso).toLocaleString('en-GB',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'});
const fTk=n=>String(n).padStart(4,'0');
const fErr=e=>toast((e&&e.message)||'Something went wrong. Please try again.');
async function frpc(fn,args){const r=await sb.rpc(fn,args||{});if(r.error)throw r.error;return r.data}

document.head.insertAdjacentHTML('beforeend',`<style>
.fn-hero{position:relative;overflow:hidden;border-radius:26px;padding:18px;background:linear-gradient(135deg,#1f5d4a,#2f8f8a);color:#fff;box-shadow:0 14px 30px rgba(31,93,74,.3)}
.fn-hero:after{content:"";position:absolute;width:150px;height:150px;border-radius:50%;right:-50px;top:-60px;background:rgba(255,255,255,.13)}
.fn-hero h3{font:700 20px var(--hf);margin:0 0 4px;position:relative}.fn-hero p{margin:0;position:relative;opacity:.95}
.fn-hero .btn{margin-top:12px;background:#fff;color:#1f5d4a;position:relative}
.fn-tk{display:inline-block;background:#fff8ea;color:#3a2a1e;border:2px dashed #c9a676;border-radius:10px;padding:6px 12px;font:800 18px/1 ui-monospace,monospace;letter-spacing:.08em}
.fn-code{display:block;text-align:center;background:var(--gs);color:var(--gd);border-radius:16px;padding:12px;font:800 20px var(--bf);user-select:all}
.fn-door{margin:-16px -16px 0;position:relative}.fn-door img{width:100%;display:block}
.fn-doorp{position:relative;margin-top:-22px;background:var(--card);border-radius:26px;padding:18px;box-shadow:0 14px 34px rgba(0,0,0,.25)}
.fn-doorp input{font-size:19px;text-align:center}
.fn-room{margin:-16px -16px 0;position:relative;overflow:hidden;background:#2a1d14;touch-action:pan-y}
.fn-stage{position:relative;transform-origin:0 0;transition:transform .5s ease}.fn-stage img.bg{width:100%;display:block}
.fn-fr{position:absolute;transform:translate(-50%,-100%);container-type:inline-size;border:0;background:none;padding:0}
.fn-fi{position:relative;background:#7a5238;border-radius:8cqw;padding:6cqw;box-shadow:0 3px 8px rgba(0,0,0,.45)}
.fn-fr.me .fn-fi{background:#c9a03c}.fn-fr.win .fn-fi{background:#e9b949}.fn-fr.win{animation:fnwin 1s ease-in-out infinite alternate}.fn-fr.spk .fn-fi{box-shadow:0 0 0 3px #3fd17c,0 3px 8px rgba(0,0,0,.45)}
.fn-fi .ph{aspect-ratio:1/1.05;background:#f6eedc center/cover;display:grid;place-items:center;color:#fff;font:800 56cqw/1 var(--bf)}
.fn-fi .nm{background:#fffaee;color:#3a2a1e;margin-top:6cqw;text-align:center;font:700 17cqw/1.5 var(--bf);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 4cqw}
.fn-fi .hat{position:absolute;left:50%;top:-36cqw;transform:translateX(-50%);font-size:60cqw;line-height:1}
@keyframes fnwin{to{transform:translate(-50%,-104%) rotate(3deg)}}
.fn-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px 12px;background:#5a3d2b;color:#fff3df;margin:0 -16px;font:600 14px var(--bf)}
.fn-bar .grow{flex:1;min-width:0}.fn-chip{border:0;border-radius:999px;padding:7px 12px;font:700 13px var(--bf);background:rgba(255,255,255,.16);color:#fff}.fn-chip.on{background:#3fd17c;color:#0f2a1b}.fn-chip.off{background:#c0392b}
.fn-tab{margin:0 -16px;padding:14px 12px 28px;background:url(${FI}table.jpg) center/420px;box-shadow:inset 0 10px 18px rgba(0,0,0,.28)}
.fn-call{display:flex;align-items:center;gap:12px;background:#fff8ea;color:#3a2a1e;border-radius:18px;padding:10px 14px;box-shadow:0 4px 10px rgba(0,0,0,.25)}
.fn-ball{width:62px;height:62px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#f4d27a 45%,#d89a2b);display:grid;place-items:center;font:800 28px var(--bf);border:3px solid #fff;box-shadow:0 3px 6px rgba(0,0,0,.3);flex:none}
.fn-call small{display:block;color:#8a6a4f;font-size:13px}.fn-call b{font:700 21px Georgia,serif}
.fn-card{margin-top:14px;background:#fffdf6;border-radius:10px;padding:8px;box-shadow:0 8px 16px rgba(0,0,0,.35);border:1px solid #e6d8bd}
.fn-card h4{margin:0 0 6px;font:700 12px var(--bf);letter-spacing:.12em;color:#9a3d2e;text-align:center}
.fn-grid{display:grid;grid-template-columns:repeat(9,1fr);gap:3px}
.fn-c{aspect-ratio:1;background:#fbf1dc;border:1.5px solid #caa97a;border-radius:5px;display:grid;place-items:center;font:700 clamp(13px,4.2vw,19px) var(--bf);color:#3a2a1e;position:relative;padding:0}
.fn-c.e{background:#ead9b8}.fn-c.d:after{content:"";position:absolute;inset:8%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff8d7a,#d2372a 60%,#a3221a);box-shadow:0 2px 3px rgba(0,0,0,.35);opacity:.88}
.fn-c.hot{outline:3px solid #2f9d5c}
.fn-row{display:flex;gap:12px;align-items:center;margin-top:16px}
.fn-tray{flex:1;background:#7a5238;border-radius:16px;padding:10px 12px;display:flex;gap:8px;align-items:center;box-shadow:inset 0 3px 6px rgba(0,0,0,.4);color:#fff3df;font-size:13px;min-width:0}
.fn-chipc{width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff8d7a,#d2372a 60%,#a3221a);box-shadow:0 2px 3px rgba(0,0,0,.4);flex:none;touch-action:none;cursor:grab}
.fn-drag{position:fixed;z-index:90;pointer-events:none;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff8d7a,#d2372a 60%,#a3221a);box-shadow:0 8px 14px rgba(0,0,0,.45)}
.fn-bingo{background:#2f7d4f;color:#fff;border:0;border-radius:18px;padding:16px 20px;font:800 20px var(--bf);box-shadow:0 5px 0 #1f5a37}
.fn-rt{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:12px}
.fn-rtk{background:#fff8ea;color:#3a2a1e;border-radius:8px;padding:10px 16px;font:800 22px ui-monospace,monospace;letter-spacing:.1em;box-shadow:0 5px 10px rgba(0,0,0,.3);border:2px dashed #c9a676;transform:rotate(-1.5deg)}
.fn-rtk:nth-child(even){transform:rotate(1.5deg)}.fn-rtk.w{background:#ffe38a;border-color:#c9a03c}
.fn-drum{width:150px;display:block;margin:0 auto}.fn-drum.spin{animation:fnspin .7s linear infinite}@keyframes fnspin{50%{transform:rotate(4deg) translateY(-4px)}}
.fn-over{position:fixed;inset:0;z-index:80;display:grid;place-items:center;background:rgba(20,12,6,.72);padding:20px;text-align:center}
.fn-over .bx{background:#fff8ea;color:#3a2a1e;border-radius:26px;padding:24px 22px;max-width:340px;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.fn-over h3{font:800 28px var(--hf);margin:0 0 6px}
.fn-conf{position:fixed;inset:0;z-index:85;pointer-events:none;overflow:hidden}.fn-conf i{position:absolute;top:-12px;width:10px;height:14px;animation:fnfall linear forwards}
@keyframes fnfall{to{transform:translateY(105vh) rotate(720deg)}}
.fn-rev{background:#fff8ea;color:#3a2a1e;border-radius:18px;padding:14px 10px;text-align:center;margin-top:10px;box-shadow:0 4px 10px rgba(0,0,0,.25)}
.fn-rev small{color:#8a6a4f;font-size:13px;display:block}.fn-rev p{margin:0;font-weight:700;min-height:1.5em}
.fn-revd{display:flex;gap:8px;justify-content:center;margin:10px 0}
.fn-revd span{width:56px;height:68px;border-radius:10px;background:#ead9b8;display:grid;place-items:center;font:800 34px/1 ui-monospace,monospace;border:2px dashed #c9a676;color:#8a6a4f}
.fn-revd .on{background:#ffe38a;border-style:solid;border-color:#c9a03c;color:#3a2a1e}.fn-revd .pop{animation:fnpop .4s ease-out}
.fn-revd .roll{background:#fff;border-color:#d2372a;color:#d2372a}
@keyframes fnpop{from{transform:scale(1.6)}}
.fn-rtk.out{opacity:.35;filter:grayscale(1)}.fn-rtk.in{box-shadow:0 0 0 3px #3fd17c,0 5px 10px rgba(0,0,0,.3)}
.fn-join{background:#fff8ea;color:#3a2a1e;border-radius:18px;padding:16px;margin-top:14px;box-shadow:0 8px 16px rgba(0,0,0,.35)}
.fn-join h4{margin:0 0 6px;font:800 20px var(--hf)}.fn-join p{margin:0 0 10px}
.fn-seg{display:flex;gap:8px;flex-wrap:wrap}.fn-seg button{flex:1;min-width:64px}
</style>`);

/* ---------- loading the list, entry points ---------- */
async function funLoad(force){
 if(!S.uid)return;if(!force&&Date.now()-FUN.at<45000)return;FUN.at=Date.now();
 try{FUN.on=!!(await frpc('fun_on'));FUN.list=FUN.on?(await frpc('fun_list'))||[]:[]}catch(e){FUN.on=false;FUN.list=[]}
 const el=document.getElementById('fn-entry');if(el)el.outerHTML=funEntry();
}
function funEntry(){
 if(!FUN.on||!FUN.list.length)return '<div id="fn-entry"></div>';
 const mine=FUN.list.find(n=>n.mine&&n.mine.status==='paid'&&(n.status==='doors'||n.status==='live')),n=mine||FUN.list[0];
 return `<div id="fn-entry" class="fn-hero"><h3>Fun Night</h3><p>${mine?`The doors are open for ${esc(n.name)}.`:`${esc(n.name)} · ${fWhen(n.starts_at)}`}</p><button class="btn" data-act="funopen">${mine?'Go to the door':'See the nights'}</button></div>`;
}
const _rm10=renderMain;
renderMain=function(){_rm10();if(S.uid&&S.prof&&(S.tab==='feed'||S.tab==='explore')){const m=$('#main .stack');if(m)m.insertAdjacentHTML('afterbegin',funEntry());funLoad()}};
ACT.funopen=async()=>{await funLoad(true);push('fun')};

V.fun=function(){
 const L=FUN.list;
 if(!L.length)return {t:'Fun Night',b:`<div class="card"><b>No nights planned just now.</b><p class="mut" style="margin-top:6px">We will let you know as soon as the next one is announced.</p></div>`};
 return {t:'Fun Night',b:`<div class="stack">${L.map(n=>{
  const m=n.mine||{},st=m.status,open=n.status==='doors'||n.status==='live';
  let body='';
  if(st==='paid')body=`<div class="card" style="background:var(--gs);box-shadow:none"><b>You're in.</b> Your secret passcode:<span class="fn-code" style="margin-top:8px">${esc(m.passcode||'')}</span></div>${open?`<button class="btn block" data-act="fundoor" data-id="${n.id}">Go to the door</button>`:`<p class="sm mut">The doors open about 15 minutes before the start. We will remind you.</p>`}`;
  else if(st==='reserved')body=`<div class="card" style="background:#fff6d9;color:#3a2a1e;box-shadow:none"><b>Reserved, not paid yet.</b><p style="margin:6px 0 0">Pay in cash by <b>${fWhen(m.expires_at)}</b> to keep your place.</p><p style="margin:6px 0 0;white-space:pre-line">${n.pay_info?esc(n.pay_info):'We will let you know where and when to pay Chris or Natalie.'}</p></div><button class="btn line block" data-act="funcancel" data-id="${n.id}">Cancel my reservation</button>`;
  else if(n.status==='sales'&&n.players<n.max_players)body=`<label class="f" for="fq-${n.id}">How many ${n.game==='bingo'?'bingo cards':'raffle tickets'}?</label><select id="fq-${n.id}">${Array.from({length:n.max_tickets_each},(_,i)=>`<option>${i+1}</option>`).join('')}</select><label class="row" style="gap:10px;margin-top:10px;align-items:flex-start"><input type="checkbox" id="fc-${n.id}" style="width:22px;height:22px;flex:none"><span>I am in Cyprus and can pay in cash in person.</span></label><button class="btn block" style="margin-top:10px" data-act="funreserve" data-id="${n.id}">Reserve my place</button><p class="xs mut">You pay in cash in person within 2 days. Nothing is paid online.</p>`;
  else if(n.status==='sales')body=`<p class="mut">This night is full.</p>`;
  else body=`<p class="mut">${n.status==='closed'?'This night has finished.':'Ticket sales have closed for this night.'}</p>`;
  return `<div class="card"><div class="row" style="justify-content:space-between;gap:8px"><h3 class="h2" style="overflow-wrap:anywhere">${esc(n.name)}</h3><span class="pill">${n.game==='bingo'?'Bingo':'Raffle'}</span></div><p class="mut" style="margin:4px 0 8px">${fWhen(n.starts_at)}${n.price_text?' · '+esc(n.price_text):''}</p>${(n.prizes||[]).length?`<p class="sm" style="margin:0 0 10px"><b>Prizes:</b> ${n.prizes.map(p=>esc(p.text||p)).join(' · ')}</p>`:''}<div class="stack">${body}</div></div>`}).join('')}
 <p class="xs mut" style="text-align:center">Fun Night is for people in Cyprus. Tickets belong to your account and cannot be passed on.</p></div>`};
};
ACT.funreserve=async d=>{const c=$('#fc-'+d.id);if(!c||!c.checked)return toast('Please tick the box to confirm you are in Cyprus.');try{await frpc('fun_reserve',{p_night:d.id,p_qty:+$('#fq-'+d.id).value,p_in_cyprus:true});toast('Reserved. Pay in cash within 2 days.');await funLoad(true);renderOv(true)}catch(e){fErr(e)}};
ACT.funcancel=async d=>{try{await frpc('fun_cancel',{p_night:d.id});await funLoad(true);renderOv(true)}catch(e){fErr(e)}};
ACT.fundoor=d=>push('fundoor',{id:d.id});

/* ---------- the door ---------- */
V.fundoor=function(o){
 const n=FUN.list.find(x=>x.id===o.id)||{};
 return {t:esc(n.name||'Fun Night'),b:`<div class="fn-door"><img src="${FI}door.jpg" alt=""></div><div class="fn-doorp"><h3 class="h2">${esc(n.name||'')}</h3><p class="mut" style="margin:4px 0 12px">Friends are waiting inside. Type your passcode and knock.</p><input id="fn-pass" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="your-secret-passcode" value="${esc((n.mine&&n.mine.passcode)||'')}" aria-label="Passcode"><button class="btn block" style="margin-top:12px" data-act="funknock" data-id="${o.id}">Knock on the door</button><p class="xs mut" style="text-align:center;margin-top:10px">Ticket holders only. Turn your sound on to hear the host.</p></div>`};
};
ACT.funknock=async d=>{
 funUnlock();
 try{await frpc('fun_enter',{p_night:d.id,p_code:val('fn-pass')})}catch(e){funSfx('no');return fErr(e)}
 funSfx('door');S.stack.pop();await funEnterRoom(d.id);
};

/* ---------- sound: host voice queue and small effects ---------- */
let FAC=null;const FAUD={};
function funUnlock(){try{FAC=FAC||new (window.AudioContext||window.webkitAudioContext)();if(FAC.state==='suspended')FAC.resume()}catch(e){}const a=new Audio();a.muted=true;a.play().catch(()=>{})}
function funSfx(k){if(!FAC)return;const t=FAC.currentTime,o=FAC.createOscillator(),g=FAC.createGain();o.connect(g);g.connect(FAC.destination);
 const P={door:[[180,0,.12],[140,.14,.12],[420,.36,.35]],no:[[200,0,.18],[150,.2,.3]],dab:[[620,0,.07]],win:[[523,0,.14],[659,.15,.14],[784,.3,.14],[1047,.45,.5]],lock:[[523,0,.1],[784,.1,.3]],tick:[[900,0,.03]]}[k]||[];
 o.type=k==='win'?'triangle':'sine';g.gain.setValueAtTime(0,t);P.forEach(p=>{o.frequency.setValueAtTime(p[0],t+p[1]);g.gain.setValueAtTime(.16*FUN.vol,t+p[1]);g.gain.exponentialRampToValueAtTime(.001,t+p[1]+p[2])});o.start(t);o.stop(t+2)}
function funSay(list,then){FUN.q.push({list:list.slice(),then});if(!FUN.playing)funNext()}
function funNext(){
 const job=FUN.q[0];if(!job){FUN.playing=false;funDuck(false);return}
 FUN.playing=true;funDuck(true);
 const f=job.list.shift();if(f===undefined){FUN.q.shift();if(job.then)try{job.then()}catch(e){}return funNext()}
 if(typeof f==='number')return setTimeout(funNext,f);
 if(typeof f==='function'){try{f()}catch(e){}return funNext()}
 const a=FAUD[f]||(FAUD[f]=new Audio(/^https?:/.test(f)?f:FV+f+'.mp3'));a.volume=FUN.vol;a.currentTime=0;let done=false;const go=()=>{if(done)return;done=true;setTimeout(funNext,120)};
 a.onended=go;a.onerror=go;a.play().catch(go);setTimeout(go,9000);
}
function funNm(id){const x=FUN.st&&(FUN.st.seats||[]).find(y=>y.id===id);try{return x&&x.clip?sb.storage.from('fun').getPublicUrl(x.clip).data.publicUrl:null}catch(e){return null}}
function funRoll(i){funRollStop();if(!FUN.rev)return;FUN.rev.roll=i;funPaint();FUN.rollT=setInterval(()=>{const e=document.getElementById('fn-roll');if(e)e.textContent=Math.floor(Math.random()*10);funSfx('tick')},90)}
function funRollStop(){clearInterval(FUN.rollT);FUN.rollT=null}
async function funTix(){try{FUN.tix=(await frpc('fun_my_tickets',{p_night:FUN.id}))||[]}catch(e){}funPaint()}

/* ---------- entering and syncing the room ---------- */
async function funEnterRoom(id){
 FUN.id=id;FUN.st=null;FUN.seen={calls:-1,draws:-1,claim:null,stage:null,ann:null,live:false};FUN.q=[];FUN.zoom=true;FUN.rev=null;FUN.spin=false;FUN.hide=null;FUN.over=null;FUN.skip=false;
 try{FUN.tix=(await frpc('fun_my_tickets',{p_night:id}))||[]}catch(e){FUN.tix=[]}
 try{FUN.marks=JSON.parse(localStorage.getItem('fn-m-'+id)||'{}')}catch(e){FUN.marks={}}
 await funSync(true);push('funroom',{id});
 const h=new Date().getHours(),mine=funNm(FUN.st&&FUN.st.me);funSay([h<17&&h>=5?'welcome_afternoon':'welcome_evening',300].concat(mine?['welcome_name',mine]:['welcome_all']));
 clearInterval(FUN.timer);FUN.timer=setInterval(()=>funSync(),4000);
 try{if(FUN.ch)sb.removeChannel(FUN.ch);FUN.ch=sb.channel('fun:'+id).on('broadcast',{event:'tick'},()=>funSync()).subscribe()}catch(e){}
}
function funLeave(){clearInterval(FUN.timer);FUN.timer=null;try{if(FUN.ch)sb.removeChannel(FUN.ch)}catch(e){}FUN.ch=null;funTalkOff();funRollStop();FUN.rev=null;FUN.q=[];FUN.id=null}
const _pop10=pop;pop=function(){const t=S.stack[S.stack.length-1];if(t&&t.v==='funroom')funLeave();return _pop10.apply(this,arguments)};
const _popall10=popall;popall=function(){if(S.stack.some(x=>x.v==='funroom'))funLeave();return _popall10.apply(this,arguments)};
ACT.pop=()=>pop();ACT.popall=()=>popall();
async function funSync(first){
 if(!FUN.id)return;let st;try{st=await frpc('fun_state',{p_night:FUN.id})}catch(e){return}
 if(!st||st.closed){if(!first&&FUN.st){funSay(['goodnight']);toast('The night has finished. Thank you for playing!');const t=S.stack[S.stack.length-1];if(t&&t.v==='funroom')pop()}return}
 const prev=FUN.st,sn=FUN.seen;FUN.st=st;const s=st.state||{};
 if(sn.calls<0){sn.calls=st.calls.length;sn.draws=st.draws.length;sn.claim=st.claim&&st.claim.id;sn.stage=s.stage;sn.ann=s.announce&&s.announce.ts;sn.live=st.status==='live';sn.round=st.round;sn.joining=!!s.joining;sn.ids={};st.seats.forEach(x=>sn.ids[x.id]=1)}
 if(sn.ids){st.seats.forEach(x=>{if(sn.ids[x.id])return;sn.ids[x.id]=1;const u=funNm(x.id);if(u&&st.status!=='live'&&x.id!==st.me)funSay(['welcome_name',u])})}
 if(st.status==='live'&&!sn.live){sn.live=true;sn.stage=s.stage;funSay(st.game==='bingo'?['eyes_down',300,'stage_'+(s.stage||1)]:['raffle_intro'])}
 if(st.game==='bingo'){
  if(st.round!==sn.round){sn.round=st.round;sn.calls=st.calls.length;sn.stage=s.stage;sn.joining=!!s.joining;FUN.marks={};try{localStorage.removeItem('fn-m-'+FUN.id)}catch(e){}FUN.tix=[];FUN.skip=false;funSay(['round_new']);funTix()}
  if(sn.joining&&!s.joining){funSay(['eyes_down',300,'stage_1'])}sn.joining=!!s.joining;
  if(s.stage!==sn.stage&&sn.live){sn.stage=s.stage;funSay(['stage_'+(s.stage||1)])}
  if(st.calls.length>sn.calls){const n=st.calls[st.calls.length-1];sn.calls=st.calls.length;funSay(['nick_'+n,350,'num_'+n])}
  if(st.claim&&st.claim.id!==sn.claim){sn.claim=st.claim.id;const c=st.claim,mine=c.user===st.me;
   if(c.valid){FUN.over={h:mine?'BINGO! You won!':'We have a winner!',p:`${esc(c.name||'')} wins the ${['one line','two lines','full house'][c.stage-1]} game.`,win:c.user};funSay(['bingo_check',200,'bingo_valid'].concat(funNm(c.user)||[],[c.stage===3?'bingo_house':'bingo_line','cheer']),()=>{});funSfx('win');funConfetti()}
   else if(mine){FUN.over={h:'Not yet',p:'That card is not quite there. On we go.'};funSay(['bingo_no'])}
   setTimeout(()=>{FUN.over=null;funPaint()},c.valid?9000:3500)}
 }else{
  if(st.draws.length>sn.draws){const d=st.draws[st.draws.length-1],dg=fTk(d.number).split('');sn.draws=st.draws.length;FUN.hide=d.prize_no;
   /* the build-up: drum, then one number at a time with a roll before each */
   const seq=[d.prize_no<=5&&d.prize_no===st.prizes.length?'prize_1':'prize_next',()=>{FUN.spin=true;FUN.rev={d:dg,k:0,roll:-1,prize:d.prize};funPaint()},'raffle_spin',2200,'raffle_ticket',500];
   dg.forEach((x,i)=>seq.push('raffle_n'+(i+1),()=>funRoll(i),i===3?3400:1700+i*350,()=>{funRollStop();if(FUN.rev){FUN.rev.k=i+1;FUN.rev.roll=-1;FUN.rev.pop=true;setTimeout(()=>{if(FUN.rev)FUN.rev.pop=false},450)}funSfx('lock');funPaint()},'digit_'+x,i===2?'raffle_close':i===3?1500:450));
   funSay(seq,()=>{funRollStop();FUN.spin=false;FUN.hide=null;FUN.rev=null;const mine=d.user===st.me;FUN.over={h:mine?'YOU WON!':'We have a winner!',p:`Ticket ${fTk(d.number)} · ${esc(d.name||'')}${d.prize?' wins '+esc(d.prize):''}`,win:d.user};funSfx('win');funConfetti();funSay(['raffle_winner'].concat(funNm(d.user)||[]));funPaint();setTimeout(()=>{FUN.over=null;funPaint()},9000)})}
 }
 if(s.announce&&s.announce.ts!==sn.ann){sn.ann=s.announce.ts;if(s.announce.url){const a=new Audio(s.announce.url);a.volume=1;a.play().catch(()=>{})}}
 funTalkRules();
 if(!first)funPaint();
}
function funPaint(){const t=S.stack[S.stack.length-1];if(t&&t.v==='funroom'&&!FUN.dragging)renderOv(true)}
function funConfetti(){const c=document.createElement('div');c.className='fn-conf';const col=['#e9b949','#d2372a','#2f9d5c','#39607f','#8a4fb3'];for(let i=0;i<70;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=col[i%5];p.style.animationDuration=(2.2+Math.random()*2.5)+'s';p.style.animationDelay=Math.random()*.8+'s';c.appendChild(p)}document.body.appendChild(c);setTimeout(()=>c.remove(),6000)}

/* ---------- the room view ---------- */
function funFrame(seat,pos,st,i){
 const w=pos[2]/12,me=seat.id===st.me,win=FUN.over&&FUN.over.win===seat.id,col=['#2f7d4f','#2b6cb0','#8a4fb3','#d66945','#be8c28','#3f6f73'][i%6];
 return `<div class="fn-fr${me?' me':''}${win?' win':''}" style="left:${pos[0]/12}%;top:${pos[1]/8.96}%;width:${w}%" ${me?'':`data-act="funseat" data-id="${seat.id}"`}><div class="fn-fi">${win?'<span class="hat">🥳</span>':''}<div class="ph" style="${seat.photo?`background-image:url('${esc(seat.photo)}')`:`background:${col}`}">${seat.photo?'':esc((seat.name||'?')[0].toUpperCase())}</div><div class="nm">${esc((seat.name||'').split(' ')[0])}</div></div></div>`;
}
V.funroom=function(){
 const st=FUN.st;if(!st)return {t:'Fun Night',b:'<p class="mut">Opening the room…</p>'};
 const s=st.state||{},R=ROOMS[st.room]||ROOMS.small,byT={};st.seats.forEach(x=>{(byT[x.table]=byT[x.table]||[]).push(x)});
 let frames='';R.t.forEach((tb,ti)=>{(byT[ti+1]||[]).forEach((seat,k)=>{if(tb[k])frames+=funFrame(seat,tb[k],st,k+ti)})});
 const mt=Math.min(st.my_table||1,R.t.length),tb=R.t[mt-1],big=R.t.length>1;
 let tf='';if(big&&FUN.zoom&&tb){const cx=tb.reduce((a,p)=>a+p[0],0)/tb.length/12,cy=tb.reduce((a,p)=>a+p[1]-30,0)/tb.length/8.96,z={medium:1.7,large:2.2,xl:2.6}[st.room]||2;tf=`transform:scale(${z}) translate(${Math.max(-(100-100/z),Math.min(0,50/z-cx))}%,${Math.max(-(100-100/z),Math.min(0,50/z-cy))}%)`}
 const extra=st.seats.filter(x=>x.table>R.t.length);
 const talkOn=FUN.talk.on,canTalk=s.talk===true,quiet=!!s.quiet;
 let game='';
 if(st.game==='bingo'){
  const last=st.calls[st.calls.length-1],stage=s.stage||1,rd=st.round||1,need=rd>1&&!st.joined,qty=st.my_qty||0,cost=(+st.price_amount||0)*qty;
  let join='';
  if(need&&qty&&s.joining&&!FUN.skip)join=`<div class="fn-join"><h4>Fancy another round?</h4><p>Round ${rd} is about to start, with fresh cards and a clean board. ${st.prizes.length?'Playing for: '+st.prizes.map(p=>esc(p.text||'')).filter(Boolean).join(' · ')+'.':''}</p><p>${st.prepaid?'<b>You have already paid for this round.</b>':cost?`<b>${cost.toLocaleString('en-GB')} ${esc(st.currency||'TL')}</b> for your ${qty} card${qty===1?'':'s'}. Nothing to pay now: just pay Chris or Natalie next time you see them.`:'Pay Chris or Natalie next time you see them.'}</p><div class="fn-seg"><button class="btn" data-act="funjoin">Join round ${rd}</button><button class="btn soft" data-act="funskip">Just watch</button></div></div>`;
  else if(need)join=`<div class="fn-join"><h4>You are watching round ${rd}</h4><p>${qty&&s.joining?'Changed your mind? You can still join until the first number is called.':'Sit back and enjoy. You can join the next one if there is another round.'}</p>${qty&&s.joining?`<button class="btn block" data-act="funjoin">Join round ${rd}</button>`:''}</div>`;
  else if(rd>1&&s.joining)join=`<div class="fn-join"><h4>You are in for round ${rd}</h4><p style="margin:0">Fresh cards are on the table. The first number is coming up.</p></div>`;
  game=`<div class="fn-call">${last?`<div class="fn-ball">${last}</div><div><small>George just called</small><b>${esc(NICK[last]||'')}</b></div>`:`<div class="fn-ball">?</div><div><small>${st.status==='live'?'Eyes down':'Waiting for the start'}</small><b>${st.status==='live'?'First number coming up':'Find your seat and get comfy'}</b></div>`}<span class="pill" style="margin-left:auto;flex:none">${rd>1?'Round '+rd+' · ':''}${['One line','Two lines','Full house'][stage-1]}</span></div>${join}
  ${FUN.tix.map(t=>`<div class="fn-card"><h4>YOUR CARD · No. ${fTk(t.number)}</h4><div class="fn-grid" data-tk="${t.id}">${t.card.map((row,r)=>row.map((n,c)=>n===null?'<span class="fn-c e"></span>':`<button class="fn-c${(FUN.marks[t.id]||{})[n]?' d':''}" data-act="funmark" data-tk="${t.id}" data-n="${n}">${n}</button>`).join('')).join('')}</div>${st.status==='live'?`<div style="text-align:right;margin-top:8px"><button class="fn-bingo" data-act="funbingo" data-id="${t.id}">Bingo!</button></div>`:''}</div>`).join('')}
  ${FUN.tix.length?`<div class="fn-row"><div class="fn-tray"><span class="fn-chipc" id="fn-src"></span><span>Drag a counter onto your number, or tap the number. Tap again to take it off.</span></div></div>`:''}
  <p class="xs" style="color:#fff3df;margin-top:10px;text-align:center">${st.calls.length} of 90 called${st.calls.length?': '+st.calls.slice(-8).join(', '):''}</p>`;
 }else{
  const shown=st.draws.filter(d=>d.prize_no!==FUN.hide),won={};shown.forEach(d=>won[d.number]=1);
  const rv=FUN.rev,pre=rv?rv.d.slice(0,rv.k).join(''):'',inn=t=>fTk(t.number).startsWith(pre),mIn=rv?FUN.tix.filter(inn).length:0;
  const rmsg=!rv?'':rv.k===0?'Good luck, everyone!':rv.k===4?'Check your tickets…':mIn?(rv.k===3?'One number away! ':'')+`${mIn} of your tickets ${mIn===1?'is':'are'} still in!`:(FUN.tix.length?'Not yours this time. Fingers crossed for your table!':'');
  const rev=rv?`<div class="fn-rev"><small>${rv.prize?'Drawing: '+esc(rv.prize):'The winning ticket'}</small><div class="fn-revd">${[0,1,2,3].map(i=>`<span class="${i<rv.k?'on'+(rv.pop&&i===rv.k-1?' pop':''):i===rv.roll?'roll':''}"${i===rv.roll?' id="fn-roll"':''}>${i<rv.k?rv.d[i]:i===rv.roll?'?':'·'}</span>`).join('')}</div><p>${rmsg}</p></div>`:'';
  game=`<img class="fn-drum${FUN.spin?' spin':''}" src="${FI}drum.png" alt=""><div class="fn-call" style="margin-top:10px"><div><small>${st.status==='live'?(FUN.spin?'The drum is spinning':'Good luck!'):'Waiting for the start'}</small><b>${shown.length?`Last winner: ticket ${fTk(shown[shown.length-1].number)}`:`${st.prizes.length} prize${st.prizes.length===1?'':'s'} tonight`}</b></div></div>${rev}
  <div class="fn-rt">${FUN.tix.map(t=>`<span class="fn-rtk${won[t.number]?' w':''}${rv&&rv.k?(inn(t)?' in':' out'):''}">${fTk(t.number)}</span>`).join('')}</div>
  ${shown.length?`<div class="card" style="margin-top:14px"><b>Winners so far</b>${shown.map(d=>`<div class="row" style="justify-content:space-between;gap:8px;margin-top:6px"><span>${esc(d.prize||'Prize '+d.prize_no)}</span><b>${fTk(d.number)} · ${esc((d.name||'').split(' ')[0])}</b></div>`).join('')}</div>`:''}`;
 }
 return {t:esc(st.name),b:`<div class="fn-room"><div class="fn-stage" style="${tf}"><img class="bg" src="${FI}${R.img}" alt="">${frames}</div></div>
 <div class="fn-bar"><span class="grow">🎙 George, your host${quiet?' · <b>The host is speaking</b>':''}</span>${big?`<button class="fn-chip" data-act="funzoom">${FUN.zoom?'Whole room':'My table'}</button>`:''}${R.t.length>1?`<button class="fn-chip" data-act="funtables">Table ${st.my_table}</button>`:''}</div>
 <div class="fn-bar" style="background:#4a3223"><span class="grow">${canTalk?(talkOn?(quiet?'Table talk paused':'Table talk is on'):'Chat with your table'):'Table talk is off tonight'}</span>${canTalk?`<button class="fn-chip ${talkOn?'on':''}" data-act="funtalk">${talkOn?'Table talk: on':'Table talk: off'}</button>${talkOn?`<button class="fn-chip ${FUN.talk.mic?'':'off'}" data-act="funmic">${FUN.talk.mic?'Mic on':'Mic muted'}</button>`:''}`:''}</div>
 ${extra.length?`<div class="fn-bar" style="background:#3b2a1e;font-weight:500">Also here: ${extra.map(x=>esc((x.name||'').split(' ')[0])).join(', ')}</div>`:''}
 <div class="fn-tab">${game}</div>
 ${FUN.over?`<div class="fn-over"><div class="bx"><h3>${FUN.over.h}</h3><p>${FUN.over.p}</p></div></div>`:''}`};
};
ACT.funjoin=async()=>{try{const r=await frpc('fun_join_round',{p_night:FUN.id});FUN.skip=false;toast(r&&r.owes?`You're in! Please pay ${(+r.amount).toLocaleString('en-GB')} ${FUN.st.currency||'TL'} next time.`:"You're in! Fresh cards are on the table.");funTick();await funTix();await funSync()}catch(e){fErr(e)}};
ACT.funskip=()=>{FUN.skip=true;renderOv(true)};
ACT.funzoom=()=>{FUN.zoom=!FUN.zoom;renderOv(true)};
ACT.funtables=()=>openSheet({v:'funtables'});
SH.funtables=function(){const st=FUN.st,n=st.tables;return `<h2 class="h2">Choose your table</h2><p class="mut" style="margin:4px 0 12px">Sit with your friends. Each table seats ${st.cap}.</p><div class="stack">${Array.from({length:n},(_,i)=>{const who=st.seats.filter(x=>x.table===i+1);return `<button class="listrow" data-act="funsit" data-id="${i+1}" ${who.length>=st.cap&&st.my_table!==i+1?'disabled':''}><span class="grow"><b>Table ${i+1}${st.my_table===i+1?' · you are here':''}</b><span class="xs mut" style="display:block">${who.length?who.map(x=>esc((x.name||'').split(' ')[0])).join(', '):'Empty so far'}</span></span><span class="pill">${who.length}/${st.cap}</span></button>`}).join('')}</div>`};
ACT.funsit=async d=>{try{await frpc('fun_sit',{p_night:FUN.id,p_table:+d.id});closeSheet();const was=FUN.talk.on;funTalkOff();await funSync();if(was)ACT.funtalk()}catch(e){fErr(e)}};
ACT.funseat=d=>{const st=FUN.st,x=st.seats.find(y=>y.id===d.id);if(!x||x.table!==st.my_table)return;openSheet({v:'funseat',id:d.id})};
SH.funseat=function(o){const x=FUN.st.seats.find(y=>y.id===o.id)||{},m=!!FUN.talk.muted[o.id];return `<h2 class="h2">${esc(x.name||'')}</h2><p class="mut" style="margin:4px 0 12px">At your table. Muting only changes what <b>you</b> hear.</p><button class="btn ${m?'':'line'} block" data-act="funmute" data-id="${o.id}">${m?'Unmute this person':'Mute this person for me'}</button>`};
ACT.funmute=d=>{FUN.talk.muted[d.id]=!FUN.talk.muted[d.id];funTalkRules();closeSheet();toast(FUN.talk.muted[d.id]?'Muted for you':'Unmuted')};

/* ---------- bingo: tap or drag a counter, then call Bingo ---------- */
function funSetMark(tk,n,on){const m=FUN.marks[tk]=FUN.marks[tk]||{};if(on===undefined)on=!m[n];if(on)m[n]=1;else delete m[n];try{localStorage.setItem('fn-m-'+FUN.id,JSON.stringify(FUN.marks))}catch(e){}funSfx('dab')}
ACT.funmark=(d,el)=>{funSetMark(d.tk,d.n);el.classList.toggle('d')};
document.addEventListener('pointerdown',e=>{
 if(!e.target.closest||!e.target.closest('#fn-src'))return;e.preventDefault();FUN.dragging=true;
 const g=document.createElement('div');g.className='fn-drag';document.body.appendChild(g);let hot=null;
 const mv=ev=>{g.style.left=ev.clientX+'px';g.style.top=ev.clientY+'px';const c=document.elementFromPoint(ev.clientX,ev.clientY-18),b=c&&c.closest&&c.closest('button.fn-c');if(hot&&hot!==b)hot.classList.remove('hot');hot=b||null;if(hot)hot.classList.add('hot')};
 const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);g.remove();FUN.dragging=false;if(hot){hot.classList.remove('hot');funSetMark(hot.dataset.tk,hot.dataset.n,true);hot.classList.add('d')}};
 mv(e);document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);
});
ACT.funbingo=async d=>{try{await frpc('fun_claim',{p_night:FUN.id,p_ticket:d.id});funTick();funSync()}catch(e){fErr(e)}};
function funTick(){try{if(FUN.ch)FUN.ch.send({type:'broadcast',event:'tick',payload:{}})}catch(e){}}

/* ---------- table talk: a small group call between the phones at one table ---------- */
const FRTC={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
ACT.funtalk=async()=>{
 const tk=FUN.talk;if(tk.on){funTalkOff();return renderOv(true)}
 if(!navigator.mediaDevices||!window.RTCPeerConnection)return toast('Table talk is not supported on this phone.');
 try{tk.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}})}catch(e){return toast('Please allow the microphone to use table talk.')}
 tk.on=true;tk.mic=true;tk.peers={};const st=FUN.st,me=st.me,room='funtalk:'+FUN.id+':'+st.my_table;
 const send=(event,payload)=>tk.ch&&tk.ch.send({type:'broadcast',event,payload:Object.assign({from:me},payload)});
 const peer=id=>{
  if(tk.peers[id])return tk.peers[id];const pc=new RTCPeerConnection(FRTC),p=tk.peers[id]={pc,a:new Audio()};p.a.autoplay=true;
  tk.stream.getTracks().forEach(t=>pc.addTrack(t,tk.stream));
  pc.onicecandidate=e=>{if(e.candidate)send('ice',{to:id,c:e.candidate})};
  pc.ontrack=e=>{p.a.srcObject=e.streams[0];p.a.play().catch(()=>{});funTalkRules()};
  pc.onconnectionstatechange=()=>{if(['failed','closed','disconnected'].includes(pc.connectionState)){try{pc.close()}catch(e){}delete tk.peers[id]}};
  return p;
 };
 const offer=async id=>{const p=peer(id),o=await p.pc.createOffer();await p.pc.setLocalDescription(o);send('sdp',{to:id,d:p.pc.localDescription})};
 tk.ch=sb.channel(room,{config:{broadcast:{self:false}}})
  .on('broadcast',{event:'hello'},({payload})=>{if(payload.from===me||tk.peers[payload.from])return;if(me<payload.from)offer(payload.from);else send('hello',{})})
  .on('broadcast',{event:'sdp'},async({payload})=>{if(payload.to!==me)return;const p=peer(payload.from);try{await p.pc.setRemoteDescription(payload.d);if(payload.d.type==='offer'){const a=await p.pc.createAnswer();await p.pc.setLocalDescription(a);send('sdp',{to:payload.from,d:p.pc.localDescription})}}catch(e){}})
  .on('broadcast',{event:'ice'},({payload})=>{if(payload.to!==me)return;const p=tk.peers[payload.from];if(p)p.pc.addIceCandidate(payload.c).catch(()=>{})})
  .on('broadcast',{event:'bye'},({payload})=>{const p=tk.peers[payload.from];if(p){try{p.pc.close()}catch(e){}delete tk.peers[payload.from]}})
  .subscribe(s=>{if(s==='SUBSCRIBED')send('hello',{})});
 if(!localStorage.getItem('fn-tip')){toast('Tip: earphones give the clearest sound.');try{localStorage.setItem('fn-tip','1')}catch(e){}}
 funTalkRules();renderOv(true);
};
function funTalkOff(){const tk=FUN.talk;if(tk.ch){try{tk.ch.send({type:'broadcast',event:'bye',payload:{from:FUN.st&&FUN.st.me}});sb.removeChannel(tk.ch)}catch(e){}}Object.values(tk.peers).forEach(p=>{try{p.pc.close();p.a.srcObject=null}catch(e){}});if(tk.stream)tk.stream.getTracks().forEach(t=>t.stop());tk.on=false;tk.peers={};tk.stream=null;tk.ch=null}
ACT.funmic=()=>{FUN.talk.mic=!FUN.talk.mic;funTalkRules();renderOv(true)};
function funDuck(on){FUN.talk.duck=on;funTalkRules()}
function funTalkRules(){
 const tk=FUN.talk;if(!tk.on)return;const s=(FUN.st&&FUN.st.state)||{},me=FUN.st&&FUN.st.me,quiet=!!s.quiet||s.talk!==true,hm=(s.muted||[]).includes(me);
 if(s.talk!==true){funTalkOff();return}
 if(tk.stream)tk.stream.getAudioTracks().forEach(t=>t.enabled=tk.mic&&!quiet&&!hm);
 Object.keys(tk.peers).forEach(id=>{const a=tk.peers[id].a;a.muted=quiet||!!tk.muted[id]||(s.muted||[]).includes(id);a.volume=tk.duck?.25:1});
}
