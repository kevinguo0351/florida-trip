'use strict';
/* Florida road trip · bilingual project dashboard */
const $ = id => document.getElementById(id);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const emoji = {food:'🍽️', sight:'📷', park:'🌴', shop:'🛍️', hotel:'🛏️', transport:'✈️'};
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shortDate = d => d.slice(5).replace('-', '/');
const palette = ['#e4572e','#f2a900','#0aa1dd','#c2185b','#2e9e44','#6a4c93','#8d5524','#37474f'];
const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = () => window.matchMedia('(min-width:761px)').matches;

/* ---------- UI strings ---------- */
const UI = {
 zh:{skip:'跳到每日行程',brand:'Florida 公路旅行',heroEyebrow:'海风 · 日落 · 公路',ctaDash:'查看项目看板',ctaMap:'打开路线地图',ctaLedger:'财务入口 ↗',
  dashEyebrow:'项目总览',dashTitle:'项目看板',live:'实时',chartDrive:'每天驾车距离（公里）',chartBudget:'预算结构（估算，美元）',chartTasks:'任务进度（按负责人）',
  ganttEyebrow:'时间线',ganttTitle:'甘特图',ganttPhase:'旅程阶段（8 天）',ganttDay:'每日时间表',ganttHint:'点任意色条，地图会飞到那个站点；斜纹 = 开车/机动时间。',
  mapEyebrow:'一路向海',mapTitle:'跟着地图出发',follow:'滚动联动',reset:'查看全程',unlock:'点击地图解锁拖动',lock:'锁定地图，继续滚动',legend:'每日路线图例',showExtras:'显示餐厅/备选',mapHint:'悬停列表 ↔ 地图高亮，点击互相定位',
  daysEyebrow:'每天都有新风景',daysTitle:'每日行程',kanbanEyebrow:'分工与任务',kanbanTitle:'任务看板',kanbanReset:'重置',kanbanHint:'拖动卡片换列（手机上点卡片切换状态），状态保存在本浏览器。',
  teamEyebrow:'把旅行当项目来跑',teamTitle:'团队分工',galleryEyebrow:'旅途预览',galleryTitle:'旅行相册',extrasEyebrow:'留一点随性',extrasTitle:'餐厅研究 & 备选景点',
  todoEyebrow:'出发前，心里有数',todoTitle:'预订清单',budgetEyebrow:'把预算花在喜欢的地方',budgetTitle:'预算与财务',openLedger:'打开财务台账 ↗',tipsTitle:'注意事项',
  footMap:'地图',footPhoto:'照片来自 Wikimedia Commons，按各自许可使用',updated:'最后更新',navigator:'导航',
  ledgerTitle:'旅行财务台账',ledgerTabAll:'全部支出',ledgerTabSplit:'分摊',ledgerTabReceipts:'票据',ledgerSync:'估算数据 · 演示台账',ledgerExport:'在 Google Sheets 打开 ↗',
  nav:{dashboard:'总览看板',gantt:'甘特图',journey:'路线地图',kanban:'任务看板',team:'团队分工',gallery:'相册',extras:'餐厅与备选',todo:'预订清单',budget:'预算财务',tips:'注意事项'},
  kpi:{days:'天',km:'公里',stops:'站点',people:'成员',budget:'预算/人',tasks:'任务完成'},
  cols:{todo:'待办',doing:'进行中',done:'已完成'},all:'全部',owner:'负责人',due:'截止',
  drive:'驾车',stops:'站',km:'公里',hr:'小时',min:'分钟',alt:'备选方案',extra:'备选地点',navLink:'Google 地图导航 ↗',viewMap:'在地图查看 ↗',
  done:'已完成',budgetBreak:'预算分项（美元）',save:'省钱方案',hotels:'迈阿密酒店报价',hotel:'酒店',quote:'报价',note:'备注',
  learn:'能学到：',owns:'负责',todoDo:'具体要做',rules:'团队规则',zoom:'放大照片',photoNA:'照片暂不可用',
  loadFail:'旅行数据载入失败，请检查网络后刷新。',mapFail:'地图组件未能载入。',
  ledger:{date:'日期',item:'项目',cat:'类别',payer:'付款人',amt:'金额',est:'估算',total:'合计（估算）',per:'人均',owe:'应收/应付',receipts:'票据会在旅途中上传到共享文件夹。',demo:'演示链接：完整台账在旅途中维护。'},
  toastDone:'任务完成 🎉',toastAll:'预订清单全部完成！',toastLang:'已切换到中文'},
 en:{skip:'Skip to itinerary',brand:'Florida Road Trip',heroEyebrow:'Sea breeze · Sunsets · Open road',ctaDash:'View dashboard',ctaMap:'Open route map',ctaLedger:'Finance ledger ↗',
  dashEyebrow:'Overview',dashTitle:'Project Dashboard',live:'Live',chartDrive:'Driving distance per day (km)',chartBudget:'Budget mix (estimate, USD)',chartTasks:'Task progress by owner',
  ganttEyebrow:'Timeline',ganttTitle:'Gantt Chart',ganttPhase:'Trip phases (8 days)',ganttDay:'Daily schedule',ganttHint:'Click any bar to fly the map to that stop; hatched = driving / buffer.',
  mapEyebrow:'Toward the sea',mapTitle:'Follow the map',follow:'Scroll sync',reset:'Show all',unlock:'Tap to unlock map',lock:'Lock map, keep scrolling',legend:'Route legend',showExtras:'Show restaurants / options',mapHint:'Hover list ↔ highlight map; click to jump either way',
  daysEyebrow:'Something new every day',daysTitle:'Daily Itinerary',kanbanEyebrow:'Roles & tasks',kanbanTitle:'Kanban Board',kanbanReset:'Reset',kanbanHint:'Drag cards between columns (tap to advance on mobile); saved in this browser.',
  teamEyebrow:'Running the trip like a project',teamTitle:'Team & Roles',galleryEyebrow:'Preview',galleryTitle:'Photo Gallery',extrasEyebrow:'Room for spontaneity',extrasTitle:'Restaurants & Alternatives',
  todoEyebrow:'Before we go',todoTitle:'Booking Checklist',budgetEyebrow:'Spend on what we love',budgetTitle:'Budget & Finance',openLedger:'Open finance ledger ↗',tipsTitle:'Notes',
  footMap:'Map',footPhoto:'Photos from Wikimedia Commons under their licenses',updated:'Last updated',navigator:'Navigator',
  ledgerTitle:'Trip Finance Ledger',ledgerTabAll:'All expenses',ledgerTabSplit:'Split',ledgerTabReceipts:'Receipts',ledgerSync:'Estimates · demo ledger',ledgerExport:'Open in Google Sheets ↗',
  nav:{dashboard:'Dashboard',gantt:'Gantt',journey:'Route map',kanban:'Kanban',team:'Team',gallery:'Gallery',extras:'Restaurants',todo:'Checklist',budget:'Budget',tips:'Notes'},
  kpi:{days:'days',km:'km',stops:'stops',people:'people',budget:'budget / person',tasks:'tasks done'},
  cols:{todo:'To do',doing:'In progress',done:'Done'},all:'All',owner:'Owner',due:'Due',
  drive:'drive',stops:'stops',km:'km',hr:'h',min:'min',alt:'Alternatives',extra:'Option',navLink:'Navigate in Google Maps ↗',viewMap:'View on map ↗',
  done:'done',budgetBreak:'Breakdown (USD)',save:'Ways to save',hotels:'Miami hotel quotes',hotel:'Hotel',quote:'Quote',note:'Notes',
  learn:'Takeaway: ',owns:'Owns',todoDo:'To do',rules:'Team rules',zoom:'Enlarge photo',photoNA:'Photo unavailable',
  loadFail:'Could not load trip data. Please refresh.',mapFail:'Map failed to load.',
  ledger:{date:'Date',item:'Item',cat:'Category',payer:'Paid by',amt:'Amount',est:'est.',total:'Total (estimate)',per:'Per person',owe:'Balance',receipts:'Receipts will be uploaded to the shared folder during the trip.',demo:'Demo link: the full ledger is maintained during the trip.'},
  toastDone:'Task done 🎉',toastAll:'Checklist complete!',toastLang:'Switched to English'}
};

/* trip phases for the Gantt (day index ranges) */
const PHASES = [
 {zh:'Tampa 抵达 & Ybor 老城',en:'Arrive Tampa & Ybor City',from:0,to:0,c:0},
 {zh:'Clearwater 海湾',en:'Clearwater & Gulf islands',from:1,to:1,c:1},
 {zh:'Lakeland → Orlando',en:'Lakeland → Orlando',from:2,to:2,c:2},
 {zh:'Disney Magic Kingdom',en:'Disney Magic Kingdom',from:3,to:3,c:3},
 {zh:'Space Coast → 迈阿密',en:'Space Coast → Miami',from:4,to:4,c:4},
 {zh:'迈阿密城市日',en:'Miami city day',from:5,to:5,c:5},
 {zh:'Everglades → Tampa',en:'Everglades → Tampa',from:6,to:6,c:6},
 {zh:'返程',en:'Fly home',from:7,to:7,c:7}];
const MILESTONES = [
 {day:1,zh:'10:00 渡轮',en:'10:00 ferry'},{day:2,zh:'10:30 赖特导览',en:'10:30 Wright tour'},{day:3,zh:'开园',en:'Rope drop'},
 {day:4,zh:'14:30 Saturn V 末班',en:'14:30 last Saturn V bus'},{day:6,zh:'天黑前过湿地',en:'Swamp road before dark'},{day:6,zh:'Bern\'s 晚餐',en:'Bern\'s dinner'}];
const STAYS = [
 {zh:'Clearwater ×2',en:'Clearwater ×2',from:0,to:1},{zh:'Disney Springs',en:'Disney Springs',from:2,to:2},{zh:'Celebration',en:'Celebration',from:3,to:3},
 {zh:'迈阿密 Aloft ×2',en:'Miami Aloft ×2',from:4,to:5},{zh:'Tampa 机场',en:'Tampa airport',from:6,to:6}];

/* Kanban tasks: id, owner, due, zh, en, default column */
const TASKS = [
 ['mk','Toby','11/22','买 Magic Kingdom 门票（4 张，绑同一账号）','Buy Magic Kingdom tickets (4, one account)','doing'],
 ['berns','Toby','11/22','订 Bern\'s 11/29 晚餐 4 人','Book Bern\'s 11/29 dinner for 4','todo'],
 ['fsc','Toby','11/24','预约赖特建筑导览 11/25 10:30','Book Wright tour 11/25 10:30','todo'],
 ['ksc','Toby','11/25','买 KSC 门票（成人按儿童价）','Buy KSC tickets (adult-at-kid price)','todo'],
 ['ll','Toby','11/23','Lightning Lane Multi Pass 开售即买','Buy Lightning Lane Multi Pass at opening','todo'],
 ['hotelmia','Kevin','11/20','订迈阿密 Aloft Brickell 两晚','Book Miami Aloft Brickell, 2 nights','done'],
 ['parkmobile','Kevin','11/26','装 ParkMobile，查好每站停车场','Install ParkMobile, scout every parking lot','doing'],
 ['nav','Kevin','11/23','每段导航提前设好','Pre-set navigation for every leg','todo'],
 ['meals','Rosemary','11/23','确认每顿饭：排队/订位/营业时间','Confirm every meal: lines, reservations, hours','doing'],
 ['snacks','Rosemary','11/24','Caladesi 零食和水','Snacks & water for Caladesi','todo'],
 ['ferry','Rosemary','11/24','渡轮现场买票 $20/人','Buy ferry tickets at dock, $20/person','todo'],
 ['ledger','Jasik','11/23','建好共享台账，记录每笔支出','Set up shared ledger, log every expense','doing'],
 ['checklist','Jasik','11/23','每日出门清单','Daily out-the-door checklist','todo'],
 ['hertz','Jasik','11/23','Hertz：登记全部司机、问收费系统','Hertz: register all drivers, ask about tolls','todo'],
 ['sun29','Jasik','11/29','带队 11/29：起床、出发、Naples 午饭','Lead 11/29: wake-up, departure, Naples lunch','todo'],
 ['research','Kevin','11/19','餐厅调研：Yelp / 小红书 / Reddit','Restaurant research: Yelp / Xiaohongshu / Reddit','done'],
 ['route','Toby','11/19','敲定总路线和每日节奏','Lock master route and daily pacing','done']];
const TODO_TO_TASK = ['mk','berns','fsc','ksc','ll','ferry','hertz','parkmobile'];

/* Estimated ledger (USD) – illustrative, labelled as estimates */
const LEDGER = [
 ['11/20','Aloft Brickell ×2','Miami hotel ×2','lodging','Kevin',265],
 ['11/20','Clearwater 酒店 ×2','Clearwater hotel ×2','lodging','Toby',330],
 ['11/20','Orlando 酒店 ×2','Orlando hotels ×2','lodging','Toby',360],
 ['11/20','Tampa 机场酒店','Tampa airport hotel','lodging','Toby',170],
 ['11/21','Hertz 租车 8 天','Hertz rental, 8 days','transport','Jasik',460],
 ['11/22','Magic Kingdom 门票 ×4','Magic Kingdom tickets ×4','tickets','Toby',890],
 ['11/23','Lightning Lane ×4','Lightning Lane ×4','tickets','Toby',180],
 ['11/25','KSC 门票 ×4','KSC tickets ×4','tickets','Toby',285],
 ['11/23','History Center ×4','History Center ×4','tickets','Rosemary',76],
 ['11/24','Caladesi 渡轮 + 公园','Caladesi ferry + park','tickets','Rosemary',88],
 ['11/25','赖特导览 ×4','Wright tour ×4','tickets','Toby',80],
 ['11/23–29','油费','Gas','transport','Jasik',120],
 ['11/23–29','停车 + 路费','Parking + tolls','transport','Kevin',270],
 ['11/23–30','餐饮（不含 Bern\'s）','Meals (excl. Bern\'s)','food','Rosemary',1800],
 ['11/29','Bern\'s 晚餐','Bern\'s dinner','food','Jasik',600]];
const CAT = {lodging:['住宿','Lodging','#0aa1dd'],transport:['交通','Transport','#f2a900'],tickets:['门票活动','Tickets','#c2185b'],food:['餐饮','Food','#2e9e44']};
const PEOPLE = ['Toby','Rosemary','Kevin','Jasik'];

let lang = (new URLSearchParams(location.search).get('lang') || localStorage.getItem('ft-lang') || 'zh') === 'en' ? 'en' : 'zh';
let DATA = {}, trip, credits, routes, map, extraLayer, selected = 'all', ganttDay = 0;
const dayLayers = new Map(), markers = new Map();
let programmaticUntil = 0;
const t = k => k.split('.').reduce((o,p)=>o?.[p], UI[lang]) ?? k;

/* ---------- helpers ---------- */
function creditFor(s){ return credits[s.img_key || s.id]; }
function media(s, cls='thumb'){ const c=creditFor(s); return c ? `<img class="media ${cls}" src="${esc(c.file)}" alt="${esc(s.name)}" loading="lazy" data-category="${esc(s.cat)}" data-name="${esc(s.name)}">` : `<span class="${cls} placeholder"><span>${emoji[s.cat]||'📍'}</span><span class="placeholder-name">${esc(s.name)}</span></span>`; }
function creditLine(c){ return `<a href="${esc(c.page)}" target="_blank" rel="noopener noreferrer">${esc(c.artist)} · ${esc(c.license)}</a>`; }
function navLink(s){ return `<a class="navigation-link" href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}" target="_blank" rel="noopener noreferrer">${t('navLink')}</a>`; }
function popup(s){ const c=creditFor(s); return `<div class="popup">${media(s,'popup-media')}${c?`<div class="credit">${creditLine(c)}</div>`:''}<p class="stop-time">${esc(s.time||t('extra'))}</p><h3>${esc(s.name)}</h3><p>${esc(s.note)}</p>${navLink(s)}</div>`; }
function driving(date){ const f=routes.features.filter(r=>r.properties.date===date); return {km:f.reduce((a,r)=>a+r.properties.km,0),min:f.reduce((a,r)=>a+r.properties.min,0)}; }
function duration(m){ const h=Math.floor(m/60), r=m%60; return lang==='en' ? `${h?h+' h ':''}${r?r+' min':''}`.trim() : `${h?h+' 小时 ':''}${r?r+' 分钟':''}`.trim(); }
function toast(msg){ const el=$('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>el.classList.remove('show'),2200); }
function confetti(x=innerWidth/2,y=innerHeight/3){ if(!motion) return; for(let i=0;i<36;i++){ const p=document.createElement('i'); p.className='confetti'; p.style.left=x+'px'; p.style.top=y+'px'; p.style.background=palette[i%palette.length]; p.style.setProperty('--dx',(Math.random()*2-1)*220+'px'); p.style.setProperty('--dy',(Math.random()*-1)*220-60+'px'); p.style.setProperty('--r',Math.random()*720+'deg'); document.body.appendChild(p); setTimeout(()=>p.remove(),1100);} }
function parseHM(s){ const m=/^(\d{1,2}):(\d{2})/.exec(s||''); return m ? +m[1]+ +m[2]/60 : null; }
const sum = a => a.reduce((x,y)=>x+y,0);

/* ---------- static UI text ---------- */
function applyStatic(){
 document.documentElement.lang = lang==='en' ? 'en' : 'zh-CN';
 $$('[data-i18n]').forEach(el=>{ const v=t(el.dataset.i18n); if(typeof v==='string') el.textContent=v; });
 $$('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
 const secs=[['dashboard-section','dashboard'],['gantt-section','gantt'],['journey','journey'],['kanban-section','kanban'],['team-section','team'],['extras-section','extras'],['gallery-section','gallery'],['todo-section','todo'],['budget-section','budget']];
 document.querySelector('.section-nav').innerHTML = secs.map(([id,k])=>`<a href="#${id}">${t('nav.'+k)}</a>`).join('');
 // floating navigator with sub-items
 const dayItems = trip.days.map(d=>`<li class="sub"><a href="#day-${d.date}" data-navday="${d.date}"><i style="background:${d.color}"></i>${shortDate(d.date)} ${esc(d.dow)}</a></li>`).join('');
 const exItems = trip.extras.filter(e=>e.cat==='food').map(e=>`<li class="sub"><a href="#extra-${e.id}">${esc(e.name)}</a></li>`).join('');
 $('nav-list').innerHTML = secs.map(([id,k])=>`<li><a href="#${id}">${t('nav.'+k)}</a></li>${k==='journey'?dayItems:''}${k==='extras'?exItems:''}`).join('') + `<li><a href="#tips-section">${t('nav.tips')}</a></li>`;
 initSectionSpy();
}

/* ---------- render ---------- */
function render(){
 document.title = trip.title;
 $('title').innerHTML = esc(trip.title).replace(/11\/23–11\/30/,'<span class="nowrap">11/23–11/30</span>');
 $('subtitle').innerHTML = trip.subtitle.split(' → ').map((c,i)=>`<span class="route-segment">${i?' → ':''}${esc(c)}</span>`).join(' ');
 $('dates').textContent = lang==='en' ? 'Nov 23 – Nov 30, 2026 · 8 days · 4 people' : '2026 年 11 月 23 日 — 30 日 · 8 天 · 4 人';
 $('people').innerHTML = trip.people.map(([n,note],i)=>`<div class="person" style="--c:${palette[i*2]}"><span class="avatar">${esc(n[0])}</span><span><strong>${esc(n)}</strong>${esc(note)}</span></div>`).join('');
 const count = sum(trip.days.map(d=>d.stops.length));
 $('day-count').textContent = `${trip.days.length} ${t('kpi.days')} · ${count} ${t('stops')}`;
 $('legend-items').innerHTML = trip.days.map(d=>`<button type="button" class="legend-chip" data-day="${d.date}"><i style="background:${d.color}"></i>${shortDate(d.date)} ${esc(d.dow)}</button>`).join('');
 $('map-legend').open = desktop();
 $('day-selector').innerHTML = `<button class="day-pill" type="button" data-day="all" aria-pressed="true">${t('all')}</button>` + trip.days.map(d=>`<button class="day-pill" type="button" style="--day-color:${d.color}" data-day="${d.date}" aria-pressed="false">${shortDate(d.date)} ${esc(d.dow)}</button>`).join('');
 $('days').innerHTML = trip.days.map(d=>{ const dr=driving(d.date);
  return `<article class="day-card" id="day-${d.date}" data-date="${d.date}" style="--day-color:${d.color}"><p class="day-date">${shortDate(d.date)} · ${esc(d.dow)}</p><h3>${esc(d.title)}</h3><div class="day-meta">🛏️ ${esc(d.sleep)}<br>🚗 ${dr.km} ${t('km')} · ${duration(dr.min)} ${t('drive')}</div><div class="badges">${d.notes.map(n=>`<span class="badge">${esc(n)}</span>`).join('')}</div><ol class="stops">${d.stops.map((s,i)=>`<li><span class="stop-dot">${i+1}</span><button class="stop-button" type="button" data-stop="${d.date}:${i}"><span><span class="stop-time">${esc(s.time)} · ${emoji[s.cat]||'📍'}</span><span class="stop-name">${esc(s.name)}</span><span class="stop-note">${esc(s.note)}</span></span>${media(s)}</button></li>`).join('')}</ol>${d.alt?`<details><summary>${t('alt')}</summary><p>${esc(d.alt)}</p></details>`:''}</article>`; }).join('');
 const all=[...trip.days.flatMap(d=>d.stops),...trip.extras];
 $('gallery').innerHTML = Object.entries(credits).map(([k,c])=>{ const s=all.find(x=>(x.img_key||x.id)===k); const n=s?.name||k; return `<figure class="tilt"><button type="button" data-photo="${esc(k)}" aria-label="${t('zoom')}: ${esc(n)}"><img src="${esc(c.file)}" alt="${esc(n)}" loading="lazy" data-category="${esc(s?.cat||'sight')}"></button><figcaption>${esc(n)}<div class="credit">${creditLine(c)}</div></figcaption></figure>`; }).join('');
 $('extras').innerHTML = trip.extras.map((s,i)=>`<article class="extra-card tilt" id="extra-${s.id}" data-extra-card="${i}">${media(s)}<h3>${emoji[s.cat]||'📍'} ${esc(s.name)}</h3><p>${esc(s.note)}</p><div class="tags">${(s.tags||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div><button type="button" data-extra="${i}">${t('viewMap')}</button></article>`).join('');
 const b=trip.budget;
 $('budget').innerHTML = `<h3>${lang==='en'?'Trip budget':'旅行预算'}</h3><p class="budget-total">${esc(b.total)}</p><table><caption class="muted">${t('budgetBreak')}</caption><tbody>${b.rows.map(([a,v])=>`<tr><th scope="row">${esc(a)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table><h3 style="margin-top:20px">${t('save')}</h3><ul>${b.save.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
 $('hotels').innerHTML = `<h3>${t('hotels')}</h3><p class="muted">${esc(trip.hotels.note)}</p><table><thead><tr><th>${t('hotel')}</th><th>${t('quote')}</th><th>${t('note')}</th></tr></thead><tbody>${trip.hotels.items.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 if(trip.team){ const T=trip.team, L=a=>`<ul>${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  $('team').innerHTML = `<p class="muted">${esc(T.intro)}</p><div class="team-grid">${T.roles.map((r,i)=>`<div class="panel team-card tilt" style="--c:${palette[i*2]}"><h3><span class="avatar">${esc(r.name[0])}</span>${esc(r.name)}<small> · ${esc(r.title)}</small></h3><h4>${t('owns')}</h4>${L(r.owns)}<h4>${t('todoDo')}</h4>${L(r.do)}<p class="muted"><strong>${t('learn')}</strong>${esc(r.learn)}</p></div>`).join('')}</div><div class="panel" style="margin-top:16px"><h3>${t('rules')}</h3>${L(T.rules)}</div>`; }
 $('tips').innerHTML = trip.tips.map(x=>`<li>${esc(x)}</li>`).join('');
 renderTodos(); renderKanban(); renderDashboard(); renderGantt(); renderLedger();
}

/* ---------- dashboard ---------- */
function renderDashboard(){
 const km=sum(routes.features.map(f=>f.properties.km)), stops=sum(trip.days.map(d=>d.stops.length));
 const st=kanbanState(), done=TASKS.filter(x=>st[x[0]]==='done').length;
 const est=sum(LEDGER.map(r=>r[5]));
 const k=[[trip.days.length,t('kpi.days'),'📅'],[km.toLocaleString(),t('kpi.km'),'🚗'],[stops,t('kpi.stops'),'📍'],[PEOPLE.length,t('kpi.people'),'👥'],['$'+Math.round(est/4).toLocaleString(),t('kpi.budget'),'💵'],[Math.round(done/TASKS.length*100)+'%',t('kpi.tasks'),'✅']];
 $('kpis').innerHTML = k.map(([n,l,e])=>`<div class="kpi tilt"><span class="kpi-ico">${e}</span><strong data-count="${esc(n)}">${esc(n)}</strong><span>${esc(l)}</span></div>`).join('');
 countUp();
 const max=Math.max(...trip.days.map(d=>driving(d.date).km));
 $('drive-chart').innerHTML = trip.days.map(d=>{ const v=driving(d.date).km; return `<button type="button" class="bar" data-day="${d.date}" style="--h:${(v/max*100).toFixed(1)}%;--c:${d.color}" title="${shortDate(d.date)} · ${v} km"><span class="bar-v">${v}</span><span class="bar-fill"></span><span class="bar-l">${shortDate(d.date)}</span></button>`; }).join('');
 const cats=Object.keys(CAT).map(c=>[c,sum(LEDGER.filter(r=>r[3]===c).map(r=>r[5]))]); let acc=0;
 const stops2=cats.map(([c,v])=>{ const a=acc/est*360; acc+=v; return `${CAT[c][2]} ${a.toFixed(1)}deg ${(acc/est*360).toFixed(1)}deg`; }).join(',');
 $('budget-donut').innerHTML = `<div class="donut" style="background:conic-gradient(${stops2})"><div class="donut-hole"><strong>$${est.toLocaleString()}</strong><span>${lang==='en'?'est. total':'估算总计'}</span></div></div><ul class="donut-legend">${cats.map(([c,v])=>`<li><i style="background:${CAT[c][2]}"></i>${CAT[c][lang==='en'?1:0]}<b>$${v.toLocaleString()}</b></li>`).join('')}</ul>`;
 $('task-progress').innerHTML = PEOPLE.map((p,i)=>{ const mine=TASKS.filter(x=>x[1]===p), d=mine.filter(x=>st[x[0]]==='done').length, pct=mine.length?d/mine.length*100:0; return `<div class="tp"><div class="tp-head"><span><span class="avatar sm" style="--c:${palette[i*2]}">${p[0]}</span>${p}</span><span>${d}/${mine.length}</span></div><div class="tp-bar"><i style="width:${pct}%;background:${palette[i*2]}"></i></div></div>`; }).join('');
}
function countUp(){ if(!motion) return; $$('#kpis strong').forEach(el=>{ const raw=el.dataset.count, m=/[\d,]+/.exec(raw); if(!m) return; const target=+m[0].replace(/,/g,''); const pre=raw.slice(0,m.index), post=raw.slice(m.index+m[0].length); let s=null; const step=ts=>{ s??=ts; const p=Math.min(1,(ts-s)/900), v=Math.round(target*(1-Math.pow(1-p,3))); el.textContent=pre+v.toLocaleString()+post; if(p<1) requestAnimationFrame(step); }; requestAnimationFrame(step); }); }

/* ---------- gantt ---------- */
function renderGantt(){
 const n=trip.days.length;
 const head=`<div class="g-row g-head"><div class="g-label"></div><div class="g-track" style="--n:${n}">${trip.days.map(d=>`<span>${shortDate(d.date)}<small>${esc(d.dow)}</small></span>`).join('')}</div></div>`;
 const bar=(from,to,label,color,extra='')=>`<span class="g-bar ${extra}" style="--s:${from};--e:${to+1};--c:${color}" title="${esc(label)}">${esc(label)}</span>`;
 const rows=[
  [lang==='en'?'Phases':'阶段', PHASES.map(p=>bar(p.from,p.to,p[lang],palette[p.c])).join('')],
  [lang==='en'?'Stays':'住宿', STAYS.map((s,i)=>bar(s.from,s.to,s[lang],'#37474f','stay')).join('')],
  [lang==='en'?'Milestones':'里程碑', MILESTONES.map((m,i)=>`<span class="g-ms" style="--s:${m.day};--k:${MILESTONES.filter((x,j)=>x.day===m.day&&j<i).length}" title="${esc(m[lang])}"><i></i>${esc(m[lang])}</span>`).join('')],
  ...PEOPLE.map((p,i)=>{ const span = p==='Rosemary' ? [0,7,lang==='en'?'from 22:59 · to 06:15':'22:59 到 · 06:15 走'] : p==='Jasik' ? [0,7,lang==='en'?'lands 00:27':'00:27 先到'] : [0,7,lang==='en'?'06:03 → 17:20':'06:03 → 17:20']; return [p, bar(span[0],span[1],span[2],palette[i*2],'person')]; })];
 $('gantt-phase').innerHTML = head + rows.map(([l,b])=>`<div class="g-row"><div class="g-label">${esc(l)}</div><div class="g-track" style="--n:${n}">${b}</div></div>`).join('');
 $('gantt-tabs').innerHTML = trip.days.map((d,i)=>`<button type="button" data-gday="${i}" aria-pressed="${i===ganttDay}" style="--c:${d.color}">${shortDate(d.date)}</button>`).join('');
 renderGanttDay();
}
const CAP={food:1.25,sight:1.5,park:3.5,shop:2,transport:.75,hotel:1};
function renderGanttDay(){
 const d=trip.days[ganttDay], zh=DATA.zh.days[ganttDay];
 const H0=4,H1=24, span=H1-H0;
 const items=d.stops.map((s,i)=>{ const zt=zh.stops[i].time; let st=parseHM(zt); if(zt==='全天') st=8; if(zt==='晚上') st=21.5; return {s,i,st}; });
 items.forEach((it,i)=>{ const nx=items[i+1]?.st; let en=it.st+(CAP[it.s.cat]||1.25); if(zh.stops[i].time==='全天') en=21.5; if(nx!=null&&nx>it.st) en=Math.min(en,nx); it.en=Math.min(en,H1); it.gap = nx!=null && nx>it.en ? [it.en,nx] : null; });
 const ticks=[]; for(let h=H0;h<=H1;h+=2) ticks.push(`<span style="left:${(h-H0)/span*100}%">${String(h%24).padStart(2,'0')}:00</span>`);
 const pos=(a,b)=>`left:${(a-H0)/span*100}%;width:${Math.max(1.2,(b-a)/span*100)}%`;
 $('gantt-day').innerHTML = `<div class="gd"><div class="gd-axis">${ticks.join('')}</div><div class="gd-sun" style="${pos(17.5,24)}" title="sunset 17:30"></div>${items.map(it=>`<div class="gd-row"><div class="gd-label">${emoji[it.s.cat]||'📍'} ${esc(it.s.name)}</div><div class="gd-track">${it.gap?`<span class="gd-gap" style="${pos(...it.gap)}"></span>`:''}<button type="button" class="gd-bar" data-stop="${d.date}:${it.i}" style="${pos(it.st,it.en)};--c:${d.color}"><b>${esc(it.s.time)}</b></button></div></div>`).join('')}</div>`;
 $$('#gantt-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.gday===ganttDay)));
}

/* ---------- kanban ---------- */
function kanbanState(){ let s={}; try{ s=JSON.parse(localStorage.getItem('ft-kanban-v1')||'{}')||{}; }catch{} TASKS.forEach(x=>{ if(!s[x[0]]) s[x[0]]=x[5]; }); return s; }
function saveKanban(s){ try{ localStorage.setItem('ft-kanban-v1',JSON.stringify(s)); }catch{} }
let kFilter='all';
function renderKanban(){
 const st=kanbanState();
 $('kanban-filter').innerHTML = ['all',...PEOPLE].map((p,i)=>`<button type="button" data-kf="${p}" aria-pressed="${kFilter===p}" style="--c:${i?palette[(i-1)*2]:'#11666b'}">${p==='all'?t('all'):p}</button>`).join('');
 $('kanban').innerHTML = ['todo','doing','done'].map(col=>{ const cards=TASKS.filter(x=>st[x[0]]===col && (kFilter==='all'||x[1]===kFilter));
  return `<div class="k-col" data-col="${col}"><div class="k-head"><span class="k-dot ${col}"></span>${t('cols.'+col)}<span class="k-count">${cards.length}</span></div><div class="k-list">${cards.map(x=>{ const pi=PEOPLE.indexOf(x[1]); return `<div class="k-card ${col}" draggable="true" data-task="${x[0]}" style="--c:${palette[pi*2]}"><p>${esc(lang==='en'?x[4]:x[3])}</p><div class="k-meta"><span class="avatar sm" style="--c:${palette[pi*2]}">${x[1][0]}</span>${x[1]}<span class="k-due">⏰ ${x[2]}</span></div></div>`; }).join('')}</div></div>`; }).join('');
}
function moveTask(id,col,ev){
 const st=kanbanState(); if(st[id]===col) return; st[id]=col; saveKanban(st);
 const ti=TODO_TO_TASK.indexOf(id); if(ti>=0){ const name=DATA.zh.todo[ti][0]; checked[name]= col==='done'; try{ localStorage.setItem('florida-trip-todo-v1',JSON.stringify(checked)); }catch{} }
 renderKanban(); renderDashboard(); renderTodos();
 if(col==='done'){ toast(t('toastDone')); confetti(ev?.clientX, ev?.clientY); }
}

/* ---------- todos (synced with kanban) ---------- */
let checked={};
function renderTodos(){
 try{ checked=JSON.parse(localStorage.getItem('florida-trip-todo-v1')||'{}')||{}; }catch{}
 $('todo').innerHTML = trip.todo.map(([n,w,note],i)=>{ const key=DATA.zh.todo[i][0]; return `<label class="todo-item"><input type="checkbox" data-todo="${i}" ${checked[key]?'checked':''}><span><strong>${esc(n)}</strong><span class="deadline">${esc(w)}</span><small>${esc(note)}</small></span></label>`; }).join('');
 $('todo-count').textContent = `${$$('#todo input:checked').length} / ${trip.todo.length} ${t('done')}`;
}

/* ---------- ledger (demo) ---------- */
function renderLedger(){
 const L=t('ledger'), tot=sum(LEDGER.map(r=>r[5]));
 const paid=Object.fromEntries(PEOPLE.map(p=>[p,sum(LEDGER.filter(r=>r[4]===p).map(r=>r[5]))])); const bals=PEOPLE.map(p=>Math.round(paid[p]-tot/4)); bals[0]-=sum(bals); const maxBal=Math.max(...bals.map(Math.abs))||1;
 $('ledger-body').innerHTML = `<div class="ledger-kpis"><div><span>${L.total}</span><strong>$${tot.toLocaleString()}</strong></div><div><span>${L.per}</span><strong>$${Math.round(tot/4).toLocaleString()}</strong></div><div><span>${lang==='en'?'Entries':'笔数'}</span><strong>${LEDGER.length}</strong></div></div>
 <div class="ledger-scroll"><table class="ledger"><thead><tr><th>${L.date}</th><th>${L.item}</th><th>${L.cat}</th><th>${L.payer}</th><th class="num">${L.amt}</th></tr></thead><tbody>${LEDGER.map(r=>`<tr><td>${r[0]}</td><td>${esc(lang==='en'?r[2]:r[1])}</td><td><span class="cat" style="--c:${CAT[r[3]][2]}">${CAT[r[3]][lang==='en'?1:0]}</span></td><td>${r[4]}</td><td class="num">$${r[5].toLocaleString()}</td></tr>`).join('')}</tbody></table></div>
 <h3 style="margin-top:18px">${L.owe} <small class="muted">${lang==='en'?'(+ = is owed)':'（+ 为应收）'}</small></h3><div class="split">${PEOPLE.map((p,i)=>{ const bal=bals[i]; return `<div class="split-row"><span class="avatar sm" style="--c:${palette[i*2]}">${p[0]}</span>${p}<span class="split-bar"><i style="--w:${Math.abs(bal)/maxBal*100}%" class="${bal>=0?'pos':'neg'}"></i></span><b class="${bal>=0?'pos':'neg'}">${bal>=0?'+':'−'}$${Math.abs(Math.round(bal)).toLocaleString()}</b></div>`; }).join('')}</div><p class="muted small">${L.receipts}</p>`;
}
function openLedger(e){ e?.preventDefault(); $('ledger-dialog').showModal(); }

/* ---------- map ---------- */
function stopIcon(color,i,numbered){ const s=numbered?28:12; return L.divIcon({className:'number-marker',html:`<span class="${numbered?'marker-circle':'marker-dot'}" style="--marker-color:${color}">${numbered?i+1:''}</span>`,iconSize:[s,s],iconAnchor:[s/2,s/2]}); }
function selectDay(date, scroll=true, fit=true){
 selected=date;
 $$('[data-day]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.day===date)));
 $$('.day-card').forEach(c=>c.classList.toggle('selected',c.dataset.date===date));
 $$('#nav-list [data-navday]').forEach(a=>a.classList.toggle('on',a.dataset.navday===date));
 if(map){ const bounds=[];
  dayLayers.forEach((ly,key)=>{ const on=date==='all'||date===key;
   ly.route.setStyle({opacity:on?.9:.1,weight:on?(date===key?6:5):3});
   ly.stops.forEach((m,i)=>{ m.setOpacity(on?1:.2); m.setIcon(stopIcon(ly.color,i,date===key)); m.setZIndexOffset(date===key?500:0); });
   if(on){ if(ly.route.getBounds().isValid()) bounds.push(ly.route.getBounds()); ly.stops.forEach(m=>bounds.push(m.getLatLng())); if(date!=='all') ly.route.bringToFront(); } });
  if(fit&&bounds.length){ const bb=L.latLngBounds(bounds), o={padding:[34,34],maxZoom:12}; if(map._loaded&&motion) map.flyToBounds(bb,{...o,duration:.8}); else map.fitBounds(bb,o); }
  const d=trip.days.find(x=>x.date===date); const hud=$('map-hud');
  if(d){ const dr=driving(d.date); hud.hidden=false; hud.style.setProperty('--c',d.color); hud.innerHTML=`<b>${shortDate(d.date)} ${esc(d.dow)}</b> ${esc(d.title)}<span>🚗 ${dr.km} ${t('km')} · ${duration(dr.min)} · 📍 ${d.stops.length}</span>`; } else hud.hidden=true; }
 if(scroll&&date!=='all'){ programmaticUntil=Date.now()+1200; $(`day-${date}`).scrollIntoView({behavior:motion?'smooth':'auto',block:'start'}); }
}
function markerEl(key){ return markers.get(key)?.getElement(); }
function hot(key,on){ markerEl(key)?.classList.toggle('hot',on); const b=document.querySelector(`.stop-button[data-stop="${key}"]`); b?.classList.toggle('hot',on); }
function initMap(){
 if(map){ map.remove(); map=null; dayLayers.clear(); markers.clear(); }
 if(!window.L){ $('map-status').textContent=t('mapFail'); return; }
 map=L.map('map',{scrollWheelZoom:false,zoomControl:false,dragging:!L.Browser.mobile});
 if(L.Browser.mobile) $('map-lock').classList.add('available');
 L.control.zoom({position:'bottomright'}).addTo(map);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}).addTo(map);
 const shared=new Map(); trip.days.forEach(d=>d.stops.forEach(s=>{ const k=`${s.lat},${s.lon}`; if(!shared.has(k)) shared.set(k,[]); shared.get(k).push(s); }));
 trip.days.forEach(d=>{
  const route=L.geoJSON({type:'FeatureCollection',features:routes.features.filter(f=>f.properties.date===d.date)},{style:()=>({color:d.color,weight:5,opacity:.85,className:'route-line'})}).addTo(map);
  route.on('click',()=>selectDay(d.date,true,true));
  route.on('mouseover',()=>route.setStyle({weight:8})); route.on('mouseout',()=>route.setStyle({weight:selected===d.date?6:5}));
  const stops=d.stops.map((s,i)=>{ const peers=shared.get(`${s.lat},${s.lon}`), a=2*Math.PI*peers.indexOf(s)/peers.length; const p=peers.length>1?[s.lat+.0007*Math.sin(a),s.lon+.0008*Math.cos(a)]:[s.lat,s.lon];
   const key=`${d.date}:${i}`;
   const m=L.marker(p,{title:`${shortDate(d.date)} #${i+1} ${s.name}`,icon:stopIcon(d.color,i,false),riseOnHover:true}).bindPopup(popup(s),{closeButton:false,autoPanPadding:[30,30]}).addTo(map);
   m.on('click',()=>{ if(selected!==d.date) selectDay(d.date,false,false); focusListItem(key); });
   m.on('mouseover',()=>hot(key,true)); m.on('mouseout',()=>hot(key,false));
   markers.set(key,m); return m; });
  dayLayers.set(d.date,{route,stops,color:d.color}); });
 extraLayer=L.layerGroup();
 trip.extras.forEach((s,i)=>{ const m=L.marker([s.lat,s.lon],{title:s.name,icon:L.divIcon({className:'extra-marker',html:`<span>${emoji[s.cat]||'📍'}</span>`,iconSize:[26,26],iconAnchor:[13,13]})}).bindPopup(popup(s),{closeButton:false}).addTo(extraLayer); m.on('click',()=>{ const c=document.querySelector(`[data-extra-card="${i}"]`); c?.classList.add('flash'); setTimeout(()=>c?.classList.remove('flash'),1400); }); markers.set(`extra:${i}`,m); });
 if($('extras-toggle').checked) extraLayer.addTo(map);
 selectDay(selected,false,true);
}
function focusListItem(key){ const b=document.querySelector(`.stop-button[data-stop="${key}"]`); if(!b) return; b.classList.add('flash'); setTimeout(()=>b.classList.remove('flash'),1400); if(desktop()){ programmaticUntil=Date.now()+1200; b.scrollIntoView({behavior:motion?'smooth':'auto',block:'center'}); } }
function showStop(key){
 const ex=key.startsWith('extra:'); const s = ex ? trip.extras[+key.split(':')[1]] : trip.days.find(d=>d.date===key.split(':')[0]).stops[+key.split(':')[1]];
 if(!map){ window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}`,'_blank','noopener'); return; }
 if(ex){ $('extras-toggle').checked=true; extraLayer.addTo(map); } else selectDay(key.split(':')[0],false,false);
 if(!desktop() || !inView($('map'))){ programmaticUntil=Date.now()+1200; $('map').scrollIntoView({behavior:motion?'smooth':'auto',block:'center'}); }
 const m=markers.get(key); map.flyTo(m.getLatLng(),14,{duration:motion?.8:0}); setTimeout(()=>m.openPopup(), motion?820:0);
 if(!ex) focusListItem(key);
}
function inView(el){ const r=el.getBoundingClientRect(); return r.top<innerHeight && r.bottom>0; }

/* ---------- interactions ---------- */
function ripple(e){ const el=e.target.closest('button,.btn,.day-pill,.k-card,.legend-chip'); if(!el||!motion) return; const r=el.getBoundingClientRect(), s=document.createElement('span'); s.className='ripple'; const d=Math.max(r.width,r.height)*2; s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`; el.appendChild(s); setTimeout(()=>s.remove(),600); }
function tilt(e){ const el=e.target.closest('.tilt'); $$('.tilt.tilting').forEach(x=>{ if(x!==el){ x.classList.remove('tilting'); x.style.removeProperty('--rx'); x.style.removeProperty('--ry'); } }); if(!el||!motion||!desktop()) return; const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; el.classList.add('tilting'); el.style.setProperty('--rx',(-y*6).toFixed(2)+'deg'); el.style.setProperty('--ry',(x*8).toFixed(2)+'deg'); el.style.setProperty('--mx',(x+.5)*100+'%'); el.style.setProperty('--my',(y+.5)*100+'%'); }

let dragId=null;
function bindEvents(){
 document.addEventListener('pointerdown',ripple);
 document.addEventListener('pointermove',tilt,{passive:true});
 $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
 document.addEventListener('click',e=>{ const a=e.target.closest('[data-ledger]'); if(a) openLedger(e); });
 $('close-ledger').addEventListener('click',()=>$('ledger-dialog').close());
 $('ledger-dialog').addEventListener('click',e=>{ if(e.target===$('ledger-dialog')) $('ledger-dialog').close(); });
 $('ledger-export').addEventListener('click',e=>{ e.preventDefault(); toast(t('ledger.demo')); });
 $('map-lock').addEventListener('click',()=>{ const u=!map.dragging.enabled(); u?map.dragging.enable():map.dragging.disable(); $('map-lock').setAttribute('aria-pressed',String(u)); $('map-lock').textContent=u?t('lock'):t('unlock'); });
 $('day-selector').addEventListener('click',e=>{ const b=e.target.closest('[data-day]'); if(b) selectDay(b.dataset.day); });
 $('legend-items').addEventListener('click',e=>{ const b=e.target.closest('[data-day]'); if(b) selectDay(b.dataset.day,false,true); });
 $('drive-chart').addEventListener('click',e=>{ const b=e.target.closest('[data-day]'); if(b) selectDay(b.dataset.day,true,true); });
 $('reset-map').addEventListener('click',()=>selectDay('all',false));
 $('extras-toggle').addEventListener('change',e=>{ if(map) e.target.checked?extraLayer.addTo(map):map.removeLayer(extraLayer); });
 $('days').addEventListener('click',e=>{ const b=e.target.closest('[data-stop]'); if(b) showStop(b.dataset.stop); });
 $('days').addEventListener('mouseover',e=>{ const b=e.target.closest('[data-stop]'); if(b) hot(b.dataset.stop,true); });
 $('days').addEventListener('mouseout',e=>{ const b=e.target.closest('[data-stop]'); if(b) hot(b.dataset.stop,false); });
 $('gantt-day').addEventListener('click',e=>{ const b=e.target.closest('[data-stop]'); if(b){ programmaticUntil=Date.now()+1400; $('journey').scrollIntoView({behavior:motion?'smooth':'auto'}); setTimeout(()=>showStop(b.dataset.stop),motion?500:0); } });
 $('gantt-tabs').addEventListener('click',e=>{ const b=e.target.closest('[data-gday]'); if(b){ ganttDay=+b.dataset.gday; renderGanttDay(); } });
 $('extras').addEventListener('click',e=>{ const b=e.target.closest('[data-extra]'); if(b) showStop(`extra:${b.dataset.extra}`); });
 $('todo').addEventListener('change',e=>{ if(!e.target.matches('[data-todo]')) return; const i=+e.target.dataset.todo, key=DATA.zh.todo[i][0]; checked[key]=e.target.checked; try{ localStorage.setItem('florida-trip-todo-v1',JSON.stringify(checked)); }catch{}
  const st=kanbanState(); st[TODO_TO_TASK[i]]=e.target.checked?'done':'todo'; saveKanban(st); renderKanban(); renderDashboard();
  $('todo-count').textContent=`${$$('#todo input:checked').length} / ${trip.todo.length} ${t('done')}`;
  if(e.target.checked){ const r=e.target.getBoundingClientRect(); confetti(r.left,r.top); if($$('#todo input:checked').length===trip.todo.length) toast(t('toastAll')); } });
 // kanban
 $('kanban-filter').addEventListener('click',e=>{ const b=e.target.closest('[data-kf]'); if(b){ kFilter=b.dataset.kf; renderKanban(); } });
 $('kanban-reset').addEventListener('click',()=>{ try{ localStorage.removeItem('ft-kanban-v1'); }catch{} renderKanban(); renderDashboard(); });
 const kb=$('kanban');
 kb.addEventListener('dragstart',e=>{ const c=e.target.closest('.k-card'); if(!c) return; dragId=c.dataset.task; c.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain',dragId); });
 kb.addEventListener('dragend',e=>{ e.target.closest('.k-card')?.classList.remove('dragging'); $$('.k-col').forEach(c=>c.classList.remove('over')); });
 kb.addEventListener('dragover',e=>{ const col=e.target.closest('.k-col'); if(!col) return; e.preventDefault(); $$('.k-col').forEach(c=>c.classList.toggle('over',c===col)); });
 kb.addEventListener('drop',e=>{ const col=e.target.closest('.k-col'); if(!col||!dragId) return; e.preventDefault(); moveTask(dragId,col.dataset.col,e); dragId=null; });
 kb.addEventListener('click',e=>{ if(desktop()) return; const c=e.target.closest('.k-card'); if(!c) return; const order=['todo','doing','done'], st=kanbanState(); moveTask(c.dataset.task,order[(order.indexOf(st[c.dataset.task])+1)%3],e); });
 // gallery
 $('gallery').addEventListener('click',e=>{ const b=e.target.closest('[data-photo]'); if(!b) return; const c=credits[b.dataset.photo]; const img=$('lightbox-image'); img.hidden=false; img.src=c.file; img.alt=b.querySelector('img')?.alt||''; $('lightbox-caption').innerHTML=`<p>${esc(img.alt)}</p><p class="credit">${creditLine(c)}</p>`; $('lightbox').showModal(); });
 $('close-lightbox').addEventListener('click',()=>$('lightbox').close());
 $('lightbox').addEventListener('click',e=>{ if(e.target===$('lightbox')) $('lightbox').close(); });
 document.addEventListener('error',e=>{ if(e.target.tagName!=='IMG') return; const img=e.target; if(img.id==='lightbox-image'){ img.hidden=true; return; } const p=document.createElement('span'); p.className=`${img.className} placeholder`; p.innerHTML=`<span>${emoji[img.dataset.category]||'📷'}</span><span class="placeholder-name">${esc(img.dataset.name||img.alt)}</span>`; img.replaceWith(p); },true);
 // navigator
 const nav=$('navigator'), fab=$('nav-fab'); let hideT;
 const show=()=>{ clearTimeout(hideT); nav.classList.add('open'); fab.setAttribute('aria-expanded','true'); };
 const hide=(d=350)=>{ clearTimeout(hideT); hideT=setTimeout(()=>{ nav.classList.remove('open'); fab.setAttribute('aria-expanded','false'); },d); };
 $('nav-hotzone').addEventListener('mouseenter',show); nav.addEventListener('mouseenter',show); nav.addEventListener('mouseleave',()=>hide());
 document.addEventListener('mousemove',e=>{ if(innerWidth-e.clientX<18) show(); },{passive:true});
 fab.addEventListener('click',()=>nav.classList.contains('open')?hide(0):show());
 nav.addEventListener('click',e=>{ const a=e.target.closest('a'); if(!a) return; if(a.dataset.navday){ e.preventDefault(); selectDay(a.dataset.navday,true,true); } if(!desktop()) hide(0); });
 // scroll progress + scroll-synced map
 addEventListener('scroll',()=>{ const h=document.documentElement; $('progress').style.transform=`scaleX(${h.scrollTop/(h.scrollHeight-h.clientHeight||1)})`; },{passive:true});
}
function initScrollSync(){
 const io=new IntersectionObserver(es=>{ if(Date.now()<programmaticUntil||!$('follow-toggle').checked||!desktop()) return; const v=es.filter(x=>x.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0]; if(v&&v.target.dataset.date!==selected) selectDay(v.target.dataset.date,false,true); },{rootMargin:'-35% 0px -55% 0px'});
 $$('.day-card').forEach(c=>io.observe(c));
 const rv=new IntersectionObserver(es=>es.forEach(x=>{ if(x.isIntersecting){ x.target.classList.add('in'); rv.unobserve(x.target); } }),{threshold:.08});
 $$('.reveal').forEach(s=>rv.observe(s));
}
let spy;
function initSectionSpy(){
 spy?.disconnect(); const links=[...$$('.section-nav a'),...$$('#nav-list > li > a')]; const vis=new Set();
 spy=new IntersectionObserver(es=>{ es.forEach(x=>x.isIntersecting?vis.add(x.target.id):vis.delete(x.target.id)); links.forEach(a=>{ const on=vis.has(a.hash.slice(1)); on?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'); }); },{rootMargin:'-10% 0px -60% 0px'});
 new Set(links.map(a=>a.hash)).forEach(h=>{ const el=document.querySelector(h); if(el) spy.observe(el); });
}
function setLang(l){
 if(l===lang) return; lang=l; try{ localStorage.setItem('ft-lang',l); }catch{} const u=new URL(location); u.searchParams.set('lang',l); history.replaceState(null,'',u);
 trip=DATA[l]; applyStatic(); render(); initMap(); initScrollSync(); toast(t('toastLang'));
}
async function getJSON(f){ const r=await fetch(f); if(!r.ok) throw new Error(f); return r.json(); }
async function start(){
 try{
  const [zh,en,rt,cr]=await Promise.all([getJSON('trip.json'),getJSON('trip.en.json'),getJSON('routes.geojson'),getJSON('credits.json')]);
  [zh,en].forEach(d=>d.days.forEach((x,i)=>x.color=palette[i%palette.length]));
  DATA={zh,en}; routes=rt; credits=cr; trip=DATA[lang];
  bindEvents(); applyStatic(); render(); initMap(); initScrollSync(); $('status').textContent='';
 }catch(err){ console.error(err); window.__err=String(err.stack||err); $('status').textContent=t('loadFail'); }
}
start();
