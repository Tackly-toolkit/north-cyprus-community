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
.fntop{height:36px;padding:0 10px;border-radius:18px;border:0;background:#f6c343;color:#3a2a1e;font:700 13px var(--bf);display:flex;align-items:center;gap:5px;margin-left:2px;flex:none}.fntop.open{animation:fnglow 1.6s ease-in-out infinite}@keyframes fnglow{50%{box-shadow:0 0 0 5px rgba(246,195,67,.35)}}@media(max-width:560px){#top.hasfn .logo .t{display:none}.fntop b{display:none}.fntop{padding:0 9px;font-size:17px}}
.fn-v{display:flex;flex-direction:column;gap:6px;margin:-16px;padding-bottom:6px;background:#6b3f1f url(${FI}table.jpg) center/420px;min-height:calc(100vh - 56px);min-height:calc(100dvh - 56px)}
#ov:has(.fn-v){background:#6b3f1f}.ovb:has(.fn-v){padding-bottom:0}
.fn-left{display:flex;flex-direction:column;gap:6px;min-width:0}
.fn-v .fn-room{position:relative;overflow:hidden;margin:0;max-height:calc(100vh - 500px);max-height:calc(100dvh - 500px);min-height:150px;display:flex;align-items:center;background:#2a1a10}
.fn-v .fn-stage{width:100%;flex:none;transform:none}
.fn-fr.me .fn-fi{background:#35c46a;box-shadow:0 0 10px 3px rgba(53,196,106,.85)}
.fn-rb{position:absolute;left:0;right:0;bottom:0;display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:14px 8px 6px;background:linear-gradient(transparent,rgba(40,24,12,.88));color:#fff;font:600 12px var(--bf);z-index:6}.fn-rb .grow{flex:1;min-width:120px}.fn-rb .fn-chip{padding:4px 10px;font-size:12px}
.fn-mates{display:flex;align-items:center;gap:6px;margin:0 8px;background:rgba(255,248,234,.95);border-radius:12px;padding:5px 9px;color:#3a2a1e;overflow:hidden}.fn-mates>b{font-size:12px;line-height:1.15;margin-right:auto;flex:none}.fn-mates>b small{display:block;font-weight:600;color:#8a6a4f}
.fn-m{border:0;background:none;padding:0;display:grid;justify-items:center;gap:1px;min-width:0;color:#3a2a1e}.fn-m .ph{width:34px;height:34px;border-radius:8px;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3);background:#f6eedc center/cover;display:grid;place-items:center;color:#fff;font:800 15px var(--bf)}.fn-m i{font:700 10px var(--bf);max-width:44px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fn-m.me .ph{border-color:#35c46a;box-shadow:0 0 6px 2px rgba(53,196,106,.7)}.fn-m.mu .ph{opacity:.45}
.fn-also{margin:0 8px;color:#fff3df;font-size:12px;text-align:center}
.fn-info{display:none}
.fn-v .fn-tab{margin:0;padding:0 8px 10px;border-radius:0;background:none;box-shadow:none;display:flex;flex-direction:column;gap:6px}
.fn-v .fn-call{padding:6px 9px;gap:9px;border-radius:16px}.fn-v .fn-ball{width:46px;height:46px;font-size:21px;flex:none}.fn-v .fn-call b{font-size:16px}.fn-v .fn-call small{font-size:11px}.fn-v .fn-call .grow{flex:1;min-width:0}
.fn-v .fn-bingo{padding:11px 14px;font-size:16px;flex:none}
.fn-called{display:flex;gap:6px;align-items:center;background:rgba(255,248,234,.95);border-radius:10px;padding:5px 9px;font-size:12px;color:#3a2a1e;white-space:nowrap;overflow:hidden}.fn-called span{overflow:hidden;flex:1;min-width:0}.fn-called i{font-style:normal;font-weight:800;background:#ffe38a;border-radius:6px;padding:0 5px}.fn-called em{font-style:normal;color:#8a6a4f;flex:none}
.fn-book{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.fn-book.n6 .fn-tk:nth-child(1){order:1}.fn-book.n6 .fn-tk:nth-child(2){order:3}.fn-book.n6 .fn-tk:nth-child(3){order:5}.fn-book.n6 .fn-tk:nth-child(4){order:2}.fn-book.n6 .fn-tk:nth-child(5){order:4}.fn-book.n6 .fn-tk:nth-child(6){order:6}
.fn-book .fn-tk{background:#fffaf0;border:0;border-radius:9px;padding:3px;margin:0;display:block;box-shadow:0 2px 5px rgba(0,0,0,.3);min-width:0}.fn-book .fn-tk.hot{box-shadow:0 0 0 3px #f6c343,0 2px 8px rgba(0,0,0,.4)}
.fn-r{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:2px;margin-bottom:2px}.fn-r:last-child{margin-bottom:0}
.fn-book .fn-c{aspect-ratio:38/48;background:#fff;border:1px solid #d8c7a4;border-radius:4px;font:800 clamp(11px,2.95vw,20px)/1 var(--bf);letter-spacing:-.3px;min-width:0}.fn-book .fn-c.e{background:#f1e4c9;border-color:transparent}.fn-book .fn-c.now{background:#ffe9a6;border-color:#c9a03c}.fn-book .fn-c.d:after{inset:6% 2%}
.fn-v .fn-drum{width:64px;height:auto;margin:0;flex:none}
.fn-fair{margin:0 4px;font-size:12.5px;color:#fff3dc;text-align:center;text-shadow:0 1px 2px rgba(0,0,0,.5)}
.fn-v .fn-rev{margin-top:0}.fn-v .fn-join{margin-top:0}
@media(min-width:700px){.fn-v .fn-room{max-height:calc(100dvh - 770px)}.fn-book{gap:12px}.fn-book .fn-tk{padding:6px;border-radius:14px}.fn-r{gap:4px;margin-bottom:4px}.fn-book .fn-c{border-radius:7px;font-size:clamp(15px,2.4vw,22px)}.fn-m .ph{width:44px;height:44px}.fn-m i{font-size:12px;max-width:60px}}
@media(min-width:1000px){#ov .wrap:has(.fn-v){max-width:1240px}.fn-v{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:14px;align-items:start;padding:14px;border-radius:0}.fn-v .fn-room{max-height:none;border-radius:16px}.fn-mates,.fn-also{margin:0}.fn-info{display:block;background:rgba(255,248,234,.95);border-radius:14px;padding:12px 14px;color:#3a2a1e;font-size:14px}.fn-info h4{margin:0 0 6px;font:700 15px Georgia,serif}.fn-info p{margin:0 0 12px;color:#6d5a4a;line-height:1.6}.fn-called{display:none}.fn-v .fn-tab{padding:0}.fn-book .fn-c{font-size:clamp(14px,1.45vw,20px)}}
.fn-seg{display:flex;gap:8px;flex-wrap:wrap}.fn-seg button{flex:1;min-width:64px}
</style>`);

/* ---------- loading the list, entry points ---------- */
async function funLoad(force){
 if(!S.uid)return;if(!force&&Date.now()-FUN.at<45000)return;FUN.at=Date.now();
 try{FUN.list=(await frpc('fun_list'))||[];FUN.on=FUN.list.length>0}catch(e){FUN.on=false;FUN.list=[]}
 funTop();
 if(!FUN.linked&&location.hash==='#fun'){FUN.linked=1;try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}if(FUN.on&&FUN.list.length){const go=k=>{if(S.stack.length||k>6)return;funGo();setTimeout(()=>go(k+1),700)};setTimeout(()=>go(0),400)}}
}
/* the only way in: a small button in the top bar, shown only to invited members while Fun Night is switched on (or the special link, #fun) */
function funTop(){
 const old=document.querySelector('#top .fntop'),show=S.uid&&S.prof&&FUN.on&&FUN.list.length;
 const tp=document.getElementById('top');if(tp)tp.classList.toggle('hasfn',!!show);
 if(!show){if(old)old.remove();return}
 const open=FUN.list.some(n=>n.mine&&n.mine.status==='paid'&&(n.status==='doors'||n.status==='live'));
 const h=`<button class="fntop${open?' open':''}" data-act="funopen" aria-label="Fun Night"><span aria-hidden="true">🎉</span><b>Fun Night</b></button>`;
 if(old){old.outerHTML=h;return}
 const at=document.querySelector('#top .invtop')||document.querySelector('#top .sosb');if(at)at.insertAdjacentHTML('beforebegin',h);
}
function funGo(){const d=FUN.list.filter(n=>n.mine&&n.mine.status==='paid'&&(n.status==='doors'||n.status==='live'));if(d.length===1)push('fundoor',{id:d[0].id});else push('fun')}
const _rt10=renderTop;
renderTop=function(){_rt10();funTop()};
const _rm10=renderMain;
renderMain=function(){_rm10();if(S.uid&&S.prof)funLoad()};
ACT.funopen=async()=>{await funLoad(true);if(FUN.on&&FUN.list.length)funGo()};

V.fun=function(){
 const L=FUN.list;
 if(!L.length)return {t:'Fun Night',b:`<div class="card"><b>No nights planned just now.</b><p class="mut" style="margin-top:6px">We will let you know as soon as the next one is announced.</p></div>`};
 return {t:'Fun Night',b:`<div class="stack">${L.map(n=>{
  const m=n.mine||{},st=m.status,open=n.status==='doors'||n.status==='live';
  let body='';
  if(st==='paid')body=`<div class="card" style="background:var(--gs);box-shadow:none"><b>You're in.</b> Your secret passcode:<span class="fn-code" style="margin-top:8px">${esc(m.passcode||'')}</span></div>${open?`<button class="btn block" data-act="fundoor" data-id="${n.id}">Go to the door</button>`:`<p class="sm mut">The doors open about 15 minutes before the start. We will remind you.</p>`}`;
  else if(st==='reserved')body=`<div class="card" style="background:#fff6d9;color:#3a2a1e;box-shadow:none"><b>Reserved, not paid yet.</b><p style="margin:6px 0 0">Pay in cash by <b>${fWhen(m.expires_at)}</b> to keep your place.</p><p style="margin:6px 0 0;white-space:pre-line">${n.pay_info?esc(n.pay_info):'We will let you know where and when to pay Chris or Natalie.'}</p></div><button class="btn line block" data-act="funcancel" data-id="${n.id}">Cancel my reservation</button>`;
  else if(n.status==='sales'&&n.players<n.max_players)body=`${n.game==='bingo'&&n.max_tickets_each<2?`<input type="hidden" id="fq-${n.id}" value="1"><p style="margin:0"><b>One bingo booklet each.</b> Six cards, with every number from 1 to 90 on them, just like a real booklet.</p>`:`<label class="f" for="fq-${n.id}">How many ${n.game==='bingo'?'bingo booklets':'raffle tickets'}?</label><select id="fq-${n.id}">${Array.from({length:n.max_tickets_each},(_,i)=>`<option>${i+1}</option>`).join('')}</select>`}<label class="row" style="gap:10px;margin-top:10px;align-items:flex-start"><input type="checkbox" id="fc-${n.id}" style="width:22px;height:22px;flex:none"><span>I am in Cyprus and can pay in cash in person.</span></label><button class="btn block" style="margin-top:10px" data-act="funreserve" data-id="${n.id}">Reserve my place</button><p class="xs mut">You pay in cash in person within 2 days. Nothing is paid online.</p>`;
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
function funPre(list){list.forEach(f=>{if(!f||FAUD[f])return;try{const a=new Audio(/^https?:/.test(f)?f:FV+f+'.mp3');a.preload='auto';a.load();FAUD[f]=a}catch(e){}})}
function funPreAll(game){funPre(['welcome_name','welcome_all','eyes_down','stage_1','stage_2','stage_3','bingo_valid','bingo_line','bingo_house','bingo_no','bingo_check','congrats','cheer','goodnight','goodbye_day','round_new','raffle_intro','raffle_fair','raffle_spin','raffle_ticket','raffle_winner','raffle_close','raffle_n1','raffle_n2','raffle_n3','raffle_n4','prize_1','prize_next']);try{if(!FAUD._clap){FAUD._clap=new Audio(FV+'applause.mp3');FAUD._clap.preload='auto';FAUD._clap.load()}}catch(e){}
 const rest=game==='raffle'?[0,1,2,3,4,5,6,7,8,9].map(d=>'digit_'+d):Array.from({length:90},(_,i)=>['nick_'+(i+1),'num_'+(i+1)]).flat();let i=0;clearInterval(FUN.preT);FUN.preT=setInterval(()=>{if(i>=rest.length||!FUN.id)return clearInterval(FUN.preT);funPre(rest.slice(i,i+4));i+=4},350)}
function funClap(){try{const a=FAUD._clap||(FAUD._clap=new Audio(FV+'applause.mp3'));a.currentTime=0;a.volume=Math.max(0,Math.min(1,.95*(FUN.vol==null?1:FUN.vol)));a.play().catch(()=>{})}catch(e){}}
function funRoll(i){funRollStop();if(!FUN.rev)return;FUN.rev.roll=i;funPaint();FUN.rollT=setInterval(()=>{const e=document.getElementById('fn-roll');if(e)e.textContent=Math.floor(Math.random()*10);funSfx('tick')},90)}
function funRollStop(){clearInterval(FUN.rollT);FUN.rollT=null}
async function funTix(){try{FUN.tix=(await frpc('fun_my_tickets',{p_night:FUN.id}))||[]}catch(e){}funPaint()}

/* ---------- entering and syncing the room ---------- */
async function funEnterRoom(id){
 FUN.id=id;FUN.st=null;FUN.seen={calls:-1,draws:-1,claim:null,stage:null,ann:null,live:false};FUN.q=[];FUN.zoom=true;FUN.fair=false;FUN.rev=null;FUN.spin=false;FUN.hide=null;FUN.over=null;FUN.skip=false;
 try{FUN.tix=(await frpc('fun_my_tickets',{p_night:id}))||[]}catch(e){FUN.tix=[]}
 try{FUN.marks=JSON.parse(localStorage.getItem('fn-m-'+id)||'{}')}catch(e){FUN.marks={}}
 await funSync(true);push('funroom',{id});
 funPreAll(FUN.st&&FUN.st.game);(FUN.st&&FUN.st.seats||[]).forEach(x=>funPre([funNm(x.id)]));FUN.wl={at:Date.now(),n:1};const h=new Date().getHours(),mine=funNm(FUN.st&&FUN.st.me);funSay([h>=5&&h<12?'welcome_morning':h>=12&&h<17?'welcome_afternoon':'welcome_evening',300].concat(mine?['welcome_name',mine]:['welcome_all']));
 clearInterval(FUN.timer);FUN.timer=setInterval(()=>funSync(),4000);
 try{if(FUN.ch)sb.removeChannel(FUN.ch);FUN.ch=sb.channel('fun:'+id).on('broadcast',{event:'tick'},()=>funSync()).subscribe()}catch(e){}
}
function funLeave(){clearInterval(FUN.timer);FUN.timer=null;try{if(FUN.ch)sb.removeChannel(FUN.ch)}catch(e){}FUN.ch=null;funTalkOff();funRollStop();FUN.rev=null;FUN.q=[];FUN.id=null}
const _pop10=pop;pop=function(){const t=S.stack[S.stack.length-1];if(t&&t.v==='funroom')funLeave();return _pop10.apply(this,arguments)};
const _popall10=popall;popall=function(){if(S.stack.some(x=>x.v==='funroom'))funLeave();return _popall10.apply(this,arguments)};
ACT.pop=()=>pop();ACT.popall=()=>popall();
async function funSync(first){
 if(!FUN.id)return;let st;try{st=await frpc('fun_state',{p_night:FUN.id})}catch(e){return}
 if(!st||st.closed){if(!first&&FUN.st){funSay([(()=>{const h=new Date().getHours();return h>=5&&h<17?'goodbye_day':'goodnight'})()]);toast('The night has finished. Thank you for playing!');const t=S.stack[S.stack.length-1];if(t&&t.v==='funroom')pop()}return}
 const prev=FUN.st,sn=FUN.seen;FUN.st=st;const s=st.state||{};
 if(sn.calls<0){sn.calls=st.calls.length;sn.draws=st.draws.length;sn.claim=st.claim&&st.claim.id;sn.stage=s.stage;sn.ann=s.announce&&s.announce.ts;sn.live=st.status==='live';sn.round=st.round;sn.joining=!!s.joining;sn.ids={};st.seats.forEach(x=>sn.ids[x.id]=1)}
 if(sn.ids){const nw=[];st.seats.forEach(x=>{if(sn.ids[x.id])return;sn.ids[x.id]=1;const u=funNm(x.id);if(u){funPre([u]);if(st.status!=='live'&&x.id!==st.me)nw.push(u)}});
  /* names flow one after another; "Welcome" is only said now and then, not before every name */
  if(nw.length){const w=FUN.wl||(FUN.wl={at:0,n:0}),say=Date.now()-w.at>20000||w.n>=4;if(say)w.n=0;w.n+=nw.length;w.at=Date.now();funSay((say?['welcome_name']:[]).concat(nw.flatMap((u,i)=>i?[120,u]:[u])))}}
 if(st.status==='live'&&!sn.live){sn.live=true;sn.stage=s.stage;funSay(st.game==='bingo'?['eyes_down',300,'stage_'+(s.stage||1)]:['raffle_intro',300,'raffle_fair']);if(st.game==='raffle')FUN.fair=true}
 if(st.game==='bingo'){
  if(st.round!==sn.round){sn.round=st.round;sn.calls=st.calls.length;sn.stage=s.stage;sn.joining=!!s.joining;FUN.marks={};try{localStorage.removeItem('fn-m-'+FUN.id)}catch(e){}FUN.tix=[];FUN.skip=false;funSay(['round_new']);funTix()}
  if(sn.joining&&!s.joining){funSay(['eyes_down',300,'stage_1'])}sn.joining=!!s.joining;
  if(s.stage!==sn.stage&&sn.live){sn.stage=s.stage;funSay(['stage_'+(s.stage||1)])}
  if(st.calls.length>sn.calls){const n=st.calls[st.calls.length-1];sn.calls=st.calls.length;funSay(['nick_'+n,350,'num_'+n])}
  if(st.claim&&st.claim.id!==sn.claim){sn.claim=st.claim.id;const c=st.claim,mine=c.user===st.me;
   if(c.valid){FUN.over={h:mine?'BINGO! You won!':'We have a winner!',p:`${esc(c.name||'')} wins the ${['one line','two lines','full house'][c.stage-1]} game.`,win:c.user};funClap();funConfetti();funSay(['bingo_valid'].concat(funNm(c.user)||[],c.stage===3?['bingo_house']:['bingo_line','congrats'],['cheer']),()=>{});funSfx('win');funConfetti()}
   else if(mine){FUN.over={h:'Not yet',p:'That card is not quite there. On we go.'};funSay(['bingo_no'])}
   setTimeout(()=>{FUN.over=null;funPaint()},c.valid?9000:3500)}
 }else{
  if(st.draws.length>sn.draws){const d=st.draws[st.draws.length-1],dg=fTk(d.number).split('');sn.draws=st.draws.length;FUN.hide=d.prize_no;
   /* the build-up: drum, then one number at a time with a roll before each */
   const seq=(FUN.fair?[]:['raffle_fair',400]).concat([d.prize_no<=5&&d.prize_no===st.prizes.length?'prize_1':'prize_next',()=>{FUN.spin=true;FUN.rev={d:dg,k:0,roll:-1,prize:d.prize};funPaint()},'raffle_spin',2200,'raffle_ticket',500]);FUN.fair=true;
   dg.forEach((x,i)=>seq.push('raffle_n'+(i+1),()=>funRoll(i),i===3?3400:1700+i*350,()=>{funRollStop();if(FUN.rev){FUN.rev.k=i+1;FUN.rev.roll=-1;FUN.rev.pop=true;setTimeout(()=>{if(FUN.rev)FUN.rev.pop=false},450)}funSfx('lock');funPaint()},'digit_'+x,i===2?'raffle_close':i===3?1500:450));
   funSay(seq,()=>{funRollStop();FUN.spin=false;FUN.hide=null;FUN.rev=null;const mine=d.user===st.me;FUN.over={h:mine?'YOU WON!':'We have a winner!',p:`Ticket ${fTk(d.number)} · ${esc(d.name||'')}${d.prize?' wins '+esc(d.prize):''}`,win:d.user};funSfx('win');funConfetti();funClap();funSay(['raffle_winner'].concat(funNm(d.user)||[]));funPaint();setTimeout(()=>{FUN.over=null;funPaint()},9000)})}
 }
 if(s.announce&&s.announce.ts!==sn.ann){sn.ann=s.announce.ts;if(s.announce.url){const a=new Audio(s.announce.url);a.volume=1;a.play().catch(()=>{})}}
 funTalkRules();
 if(!first)funPaint();
}
function funPaint(){const t=S.stack[S.stack.length-1];if(t&&t.v==='funroom'&&!FUN.dragging)renderOv(true)}
function funConfetti(){
 try{const old=document.getElementById('fn-fx');if(old)old.remove();const cv=document.createElement('canvas');cv.id='fn-fx';cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:400;pointer-events:none';document.body.appendChild(cv);
 const W=cv.width=innerWidth,H=cv.height=innerHeight,g=cv.getContext('2d'),col=['#f6c343','#e4572e','#35c46a','#3d8bd9','#b36ad9','#ff7eb6','#ffffff'],P=[],T0=performance.now(),DUR=6500;
 for(let i=0;i<170;i++)P.push({k:0,x:Math.random()*W,y:-20-Math.random()*H*.6,vx:(Math.random()-.5)*1.4,vy:2+Math.random()*3.2,w:6+Math.random()*7,h:9+Math.random()*9,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:col[i%7]});
 const burst=()=>{const x=W*(.15+Math.random()*.7),y=H*(.12+Math.random()*.3),c=col[Math.floor(Math.random()*6)];for(let i=0;i<46;i++){const a=Math.PI*2*i/46,v=2.2+Math.random()*3.2;P.push({k:1,x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1,c:i%5?c:'#ffffff'})}};
 [0,450,950,1500,2200,3000,3900].forEach(d=>setTimeout(burst,d));
 const step=now=>{const e=now-T0;g.clearRect(0,0,W,H);for(const q of P){if(q.k){q.x+=q.vx;q.y+=q.vy;q.vy+=.045;q.vx*=.985;q.vy*=.985;q.life-=.012;if(q.life<=0)continue;g.globalAlpha=Math.max(0,q.life);g.fillStyle=q.c;g.beginPath();g.arc(q.x,q.y,2.6,0,6.3);g.fill()}else{q.x+=q.vx+Math.sin((e+q.r*900)/420)*.9;q.y+=q.vy;q.r+=q.vr;g.globalAlpha=e>DUR-900?Math.max(0,(DUR-e)/900):1;g.save();g.translate(q.x,q.y);g.rotate(q.r);g.fillStyle=q.c;g.fillRect(-q.w/2,-q.h/2,q.w,q.h*Math.abs(Math.cos(q.r*1.7)));g.restore()}}
  g.globalAlpha=1;if(e<DUR&&cv.isConnected)requestAnimationFrame(step);else cv.remove()};requestAnimationFrame(step)}catch(e){}
}

/* ---------- the room view ---------- */
function funFrame(seat,pos,st,i){
 const w=pos[2]/12,me=seat.id===st.me,win=FUN.over&&FUN.over.win===seat.id,col=['#2b6cb0','#8a4fb3','#d66945','#be8c28','#7a5238','#b0413e'][i%6];
 return `<div class="fn-fr${me?' me':''}${win?' win':''}" style="left:${pos[0]/12}%;top:${pos[1]/8.96}%;width:${w}%" ${me?'':`data-act="funseat" data-id="${seat.id}"`}><div class="fn-fi">${win?'<span class="hat">🥳</span>':''}<div class="ph" style="${seat.photo?`background-image:url('${esc(seat.photo)}')`:`background:${col}`}">${seat.photo?'':esc((seat.name||'?')[0].toUpperCase())}</div><div class="nm">${esc((seat.name||'').split(' ')[0])}</div></div></div>`;
}
/* which of my cards is closest to winning the game being played (lines complete by called numbers) */
function funBest(){const st=FUN.st,called={};(st.calls||[]).forEach(n=>called[n]=1);let best=null,bl=-1;FUN.tix.forEach(t=>{if(!t.card)return;const l=t.card.filter(r=>r.every(n=>n===null||called[n])).length;if(l>bl){bl=l;best=t}});return best}
V.funroom=function(){
 const st=FUN.st;if(!st)return {t:'Fun Night',b:'<p class="mut">Opening the room…</p>'};
 const s=st.state||{},R=ROOMS[st.room]||ROOMS.small,byT={};st.seats.forEach(x=>{(byT[x.table]=byT[x.table]||[]).push(x)});
 let frames='';R.t.forEach((tb,ti)=>{(byT[ti+1]||[]).forEach((seat,k)=>{if(tb[k])frames+=funFrame(seat,tb[k],st,k+ti)})});
 const extra=st.seats.filter(x=>x.table>R.t.length);
 const talkOn=FUN.talk.on,canTalk=s.talk===true,quiet=!!s.quiet,host=/^george$/i.test((st.host_name||'').trim())?'':(st.host_name||'').trim();
 const cols=['#2b6cb0','#8a4fb3','#d66945','#be8c28','#7a5238','#b0413e'];
 const mine=(byT[st.my_table]||[]).slice().sort((x,y)=>(y.id===st.me)-(x.id===st.me));
 const mates=`<div class="fn-mates"><b>Your table${R.t.length>1?'<small>Table '+st.my_table+'</small>':''}</b>${mine.map((x,i)=>{const me=x.id===st.me;return `<button class="fn-m${me?' me':''}${FUN.talk.muted[x.id]?' mu':''}" ${me?'':`data-act="funseat" data-id="${x.id}"`}><span class="ph" style="${x.photo?`background-image:url('${esc(x.photo)}')`:`background:${cols[i%6]}`}">${x.photo?'':esc((x.name||'?')[0].toUpperCase())}</span><i>${me?'You':esc((x.name||'').split(' ')[0])}</i></button>`}).join('')}</div>`;
 const prizes=st.prizes.map((p,i)=>`<div class="row" style="justify-content:space-between;gap:8px"><span>${st.game==='bingo'?['One line','Two lines','Full house'][i]||'Prize '+(i+1):'Prize '+(i+1)}</span><b style="text-align:right">${esc(p.text||'')}</b></div>`).join('');
 let game='',side='';
 if(st.game==='bingo'){
  const last=st.calls[st.calls.length-1],stage=s.stage||1,rd=st.round||1,need=rd>1&&!st.joined,qty=st.my_qty||0,cost=(+st.price_amount||0)*qty;
  let join='';
  if(need&&qty&&s.joining&&!FUN.skip)join=`<div class="fn-join"><h4>Fancy another round?</h4><p>Round ${rd} is about to start, with a fresh booklet and a clean board. ${st.prizes.length?'Playing for: '+st.prizes.map(p=>esc(p.text||'')).filter(Boolean).join(' · ')+'.':''}</p><p>${st.prepaid?'<b>You have already paid for this round.</b>':cost?`<b>${cost.toLocaleString('en-GB')} ${esc(st.currency||'TL')}</b> for your booklet. Nothing to pay now: just pay Chris or Natalie next time you see them.`:'Pay Chris or Natalie next time you see them.'}</p><div class="fn-seg"><button class="btn" data-act="funjoin">Join round ${rd}</button><button class="btn soft" data-act="funskip">Just watch</button></div></div>`;
  else if(need)join=`<div class="fn-join"><h4>You are watching round ${rd}</h4><p>${qty&&s.joining?'Changed your mind? You can still join until the first number is called.':'Sit back and enjoy. You can join the next one if there is another round.'}</p>${qty&&s.joining?`<button class="btn block" data-act="funjoin">Join round ${rd}</button>`:''}</div>`;
  else if(rd>1&&s.joining)join=`<div class="fn-join"><h4>You are in for round ${rd}</h4><p style="margin:0">Your fresh booklet is on the table. The first number is coming up.</p></div>`;
  const book=FUN.tix.map(t=>{const m=FUN.marks[t.id]||{},hot=last&&!m[last]&&t.card.some(r=>r.includes(last));return `<div class="fn-tk${hot?' hot':''}">${t.card.map(row=>`<div class="fn-r">${row.map(n=>n===null?'<span class="fn-c e"></span>':`<button class="fn-c${m[n]?' d':''}${n===last&&!m[n]?' now':''}" data-act="funmark" data-tk="${t.id}" data-n="${n}">${n}</button>`).join('')}</div>`).join('')}</div>`}).join('');
  game=`<div class="fn-call">${last?`<div class="fn-ball">${last}</div><div class="grow"><small>George just called</small><b>${esc(NICK[last]||'')}</b></div>`:`<div class="fn-ball">?</div><div class="grow"><small>${st.status==='live'?'Eyes down':'Waiting for the start'}</small><b>${st.status==='live'?'First number coming up':'Find your seat and get comfy'}</b></div>`}<span class="pill" style="flex:none">${rd>1?'Round '+rd+' · ':''}${['One line','Two lines','Full house'][stage-1]}</span>${st.status==='live'&&FUN.tix.length?'<button class="fn-bingo" data-act="funbingo">Bingo!</button>':''}</div>
  <div class="fn-called"><b>Latest:</b><span>${st.calls.length?'<i>'+last+'</i>'+st.calls.slice(-13,-1).reverse().map(n=>' · '+n).join(''):'nothing yet'}</span><em>${st.calls.length} of 90</em></div>${join}
  ${FUN.tix.length?`<div class="fn-book n${FUN.tix.length}">${book}</div>`:''}`;
  side=`<div class="fn-info"><h4>Called so far</h4><p>${st.calls.length?st.calls.join(' · '):'Nothing yet'}</p><h4>Tonight's prizes</h4>${prizes}</div>`;
 }else{
  const shown=st.draws.filter(d=>d.prize_no!==FUN.hide),won={};shown.forEach(d=>won[d.number]=1);
  const rv=FUN.rev,pre=rv?rv.d.slice(0,rv.k).join(''):'',inn=t=>fTk(t.number).startsWith(pre),mIn=rv?FUN.tix.filter(inn).length:0;
  const rmsg=!rv?'':rv.k===0?'Good luck, everyone!':rv.k===4?'Check your tickets…':mIn?(rv.k===3?'One number away! ':'')+`${mIn} of your tickets ${mIn===1?'is':'are'} still in!`:(FUN.tix.length?'Not yours this time. Fingers crossed for your table!':'');
  const rev=rv?`<div class="fn-rev"><small>${rv.prize?'Drawing: '+esc(rv.prize):'The winning ticket'}</small><div class="fn-revd">${[0,1,2,3].map(i=>`<span class="${i<rv.k?'on'+(rv.pop&&i===rv.k-1?' pop':''):i===rv.roll?'roll':''}"${i===rv.roll?' id="fn-roll"':''}>${i<rv.k?rv.d[i]:i===rv.roll?'?':'·'}</span>`).join('')}</div><p>${rmsg}</p></div>`:'';
  const wins=shown.length?`<b>Winners so far</b>${shown.map(d=>`<div class="row" style="justify-content:space-between;gap:8px;margin-top:6px"><span>${esc(d.prize||'Prize '+d.prize_no)}</span><b>${fTk(d.number)} · ${esc((d.name||'').split(' ')[0])}</b></div>`).join('')}`:'';
  game=`<div class="fn-call"><img class="fn-drum${FUN.spin?' spin':''}" src="${FI}drum.png" alt=""><div class="grow"><small>${st.status==='live'?(FUN.spin?'The drum is spinning':'Good luck!'):'Waiting for the start'}</small><b>${shown.length?`Last winner: ticket ${fTk(shown[shown.length-1].number)}`:`${st.prizes.length} prize${st.prizes.length===1?'':'s'} tonight`}</b></div></div>
  <p class="fn-fair">Every ticket number and every winner is picked by an automated system, never by hand.</p>${rev}
  <div class="fn-rt">${FUN.tix.map(t=>`<span class="fn-rtk${won[t.number]?' w':''}${rv&&rv.k?(inn(t)?' in':' out'):''}">${fTk(t.number)}</span>`).join('')}</div>
  ${wins?`<div class="card fn-wins" style="margin-top:12px">${wins}</div>`:''}`;
  side=`<div class="fn-info"><h4>Tonight's prizes</h4>${prizes}</div>`;
 }
 return {t:esc(st.name),b:`<div class="fn-v"><div class="fn-left"><div class="fn-room"><div class="fn-stage"><img class="bg" src="${FI}${R.img}" alt="">${frames}</div>
 <div class="fn-rb"><span class="grow">🎙 ${host?esc(host)+' is your host · George calling':'George, your host'}${quiet?' · <b>The host is speaking</b>':''}</span>${R.t.length>1?`<button class="fn-chip" data-act="funtables">Change table</button>`:''}${canTalk?`<button class="fn-chip ${talkOn?'on':''}" data-act="funtalk">${talkOn?'Table talk: on':'Table talk: off'}</button>${talkOn?`<button class="fn-chip ${FUN.talk.mic?'':'off'}" data-act="funmic">${FUN.talk.mic?'Mic on':'Mic muted'}</button>`:''}`:''}</div></div>
 ${mates}${extra.length?`<div class="fn-also">Also here: ${extra.map(x=>esc((x.name||'').split(' ')[0])).join(', ')}</div>`:''}${side}</div>
 <div class="fn-tab">${game}</div></div>
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
ACT.funmark=(d,el)=>{funSetMark(d.tk,d.n);funPaint()};
document.addEventListener('pointerdown',e=>{
 if(!e.target.closest||!e.target.closest('#fn-src'))return;e.preventDefault();FUN.dragging=true;
 const g=document.createElement('div');g.className='fn-drag';document.body.appendChild(g);let hot=null;
 const mv=ev=>{g.style.left=ev.clientX+'px';g.style.top=ev.clientY+'px';const c=document.elementFromPoint(ev.clientX,ev.clientY-18),b=c&&c.closest&&c.closest('button.fn-c');if(hot&&hot!==b)hot.classList.remove('hot');hot=b||null;if(hot)hot.classList.add('hot')};
 const up=()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);g.remove();FUN.dragging=false;if(hot){hot.classList.remove('hot');funSetMark(hot.dataset.tk,hot.dataset.n,true);hot.classList.add('d')}};
 mv(e);document.addEventListener('pointermove',mv);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);
});
ACT.funbingo=async d=>{const bt=d.id?{id:d.id}:funBest();if(!bt)return;try{await frpc('fun_claim',{p_night:FUN.id,p_ticket:bt.id});funTick();funSync()}catch(e){fErr(e)}};
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
