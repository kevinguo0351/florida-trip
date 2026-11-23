'use strict';
const $ = id => document.getElementById(id);
const emoji = {food:'🍽️', sight:'📷', park:'🌴', shop:'🛍️', hotel:'🛏️', transport:'✈️'};
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shortDate = date => date.slice(5).replace('-', '/');
let trip, credits, routes, map, extraLayer, selected = 'all';
const palette = ['#e4572e','#f2a900','#0aa1dd','#c2185b','#2e9e44','#6a4c93','#8d5524','#37474f'];
const dayLayers = new Map();
const markers = new Map();
const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function creditFor(stop) { return credits[stop.img_key || stop.id]; }
function media(stop, className = 'thumb') {
  const credit = creditFor(stop);
  return credit ? `<img class="media ${className}" src="${escapeHTML(credit.file)}" alt="${escapeHTML(stop.name)}" loading="lazy" data-category="${escapeHTML(stop.cat)}" data-name="${escapeHTML(stop.name)}">` : `<span class="${className} placeholder"><span>${emoji[stop.cat] || '📍'}</span><span class="placeholder-name">${escapeHTML(stop.name)}</span></span>`;
}
function creditLine(c) { return `<a href="${escapeHTML(c.page)}" target="_blank" rel="noopener noreferrer">${escapeHTML(c.artist)} · ${escapeHTML(c.license)}</a>`; }
function navLink(stop) { return `<a class="navigation-link" href="https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lon}" target="_blank" rel="noopener noreferrer">Google 地图导航 ↗</a>`; }
function popup(stop) { const c = creditFor(stop); return `<div class="popup">${media(stop,'popup-media')}${c ? `<div class="credit">${creditLine(c)}</div>` : ''}<p class="stop-time">${escapeHTML(stop.time || '备选地点')}</p><h3>${escapeHTML(stop.name)}</h3><p>${escapeHTML(stop.note)}</p>${navLink(stop)}</div>`; }
function driving(date) { const f = routes.features.filter(r => r.properties.date === date); return {km:f.reduce((s,r)=>s+r.properties.km,0), min:f.reduce((s,r)=>s+r.properties.min,0)}; }
function duration(min) { return `${Math.floor(min/60) ? `${Math.floor(min/60)} 小时 ` : ''}${min%60 ? `${min%60} 分钟` : ''}`.trim() || '0 分钟'; }
function render() {
  document.title = trip.title;
  $('title').innerHTML = escapeHTML(trip.title).replace(/11\/23–11\/30/, '<span class="nowrap">11/23–11/30</span>');
  $('subtitle').innerHTML = trip.subtitle.split(' → ').map((city,i)=>`<span class="route-segment">${i ? ' → ' : ''}${escapeHTML(city)}</span>`).join(' ');
  $('dates').textContent = `${trip.days[0].date.replaceAll('-','/')} — ${trip.days.at(-1).date.replaceAll('-','/')}`;
  $('people').innerHTML = trip.people.map(([name,note])=>`<div class="person"><strong>${escapeHTML(name)}</strong>${escapeHTML(note)}</div>`).join('');
  const count = trip.days.reduce((sum,d)=>sum+d.stops.length,0);
  const km = routes.features.reduce((sum,f)=>sum+f.properties.km,0);
  $('stats').innerHTML = [[trip.days.length,'天的旅行'],[km.toLocaleString('zh-CN'),'公里路线'],[count,'个行程站点']].map(([n,l])=>`<div class="stat"><strong>${n}</strong><span>${l}</span></div>`).join('');
  $('day-count').textContent = `${trip.days.length} 天 · ${count} 站`;
  $('legend-items').innerHTML = trip.days.map(d=>`<span><i style="background:${d.color}"></i>${shortDate(d.date)} ${escapeHTML(d.dow)}</span>`).join('');
  $('map-legend').open = !window.matchMedia('(max-width:760px)').matches;
  $('day-selector').innerHTML = `<button class="day-pill" type="button" data-day="all" aria-pressed="true">全部</button>` + trip.days.map(d=>`<button class="day-pill" type="button" style="--day-color:${d.color}" data-day="${d.date}" aria-pressed="false">${shortDate(d.date)} ${escapeHTML(d.dow)}</button>`).join('');
  $('days').innerHTML = trip.days.map((d)=>{
    const drive = driving(d.date);
    return `<article class="day-card" id="day-${d.date}" style="--day-color:${d.color}"><p class="day-date">${shortDate(d.date)} · ${escapeHTML(d.dow)}</p><h3>${escapeHTML(d.title)}</h3><div class="day-meta">🛏️ ${escapeHTML(d.sleep)}<br>🚗 ${drive.km} 公里 · ${duration(drive.min)} 驾车</div><div class="badges">${d.notes.map(n=>`<span class="badge">${escapeHTML(n)}</span>`).join('')}</div><ol class="stops">${d.stops.map((s,i)=>`<li><span class="stop-dot">${i+1}</span><button class="stop-button" type="button" data-stop="${d.date}:${i}" aria-label="在地图查看 ${escapeHTML(s.name)}，${escapeHTML(s.time)}"><span><span class="stop-time">${escapeHTML(s.time)} · ${emoji[s.cat] || '📍'}</span><span class="stop-name">${escapeHTML(s.name)}</span><span class="stop-note">${escapeHTML(s.note)}</span></span>${media(s)}</button></li>`).join('')}</ol>${d.alt ? `<details><summary>备选方案</summary><p>${escapeHTML(d.alt)}</p></details>` : ''}</article>`;
  }).join('');
  const allStops = [...trip.days.flatMap(d=>d.stops),...trip.extras];
  $('gallery').innerHTML = Object.entries(credits).map(([key,c])=>{
    const stop = allStops.find(s=>(s.img_key || s.id)===key);
    const name = stop?.name || key;
    return `<figure><button type="button" data-photo="${escapeHTML(key)}" aria-label="放大照片：${escapeHTML(name)}"><img src="${escapeHTML(c.file)}" alt="${escapeHTML(name)}" loading="lazy" data-category="${escapeHTML(stop?.cat || 'sight')}"></button><figcaption>${escapeHTML(name)}<div class="credit">${creditLine(c)}</div></figcaption></figure>`;
  }).join('') || '<p class="muted">暂无可用照片。</p>';
  $('extras').innerHTML = trip.extras.map((s,i)=>`<article class="extra-card">${media(s)}<h3>${emoji[s.cat] || '📍'} ${escapeHTML(s.name)}</h3><p>${escapeHTML(s.note)}</p><div class="tags">${(s.tags || []).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('')}</div><button type="button" data-extra="${i}">在地图查看 ↗</button></article>`).join('');
  $('budget').innerHTML = `<h3>旅行预算</h3><p class="budget-total">${escapeHTML(trip.budget.total)}</p><table><caption class="muted">预算分项（美元）</caption><tbody>${trip.budget.rows.map(([a,b])=>`<tr><th scope="row">${escapeHTML(a)}</th><td>${escapeHTML(b)}</td></tr>`).join('')}</tbody></table><h3 style="margin-top:20px">省钱方案</h3><ul>${trip.budget.save.map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ul>`;
  $('hotels').innerHTML = `<h3>迈阿密酒店闲鱼报价</h3><p class="muted">${escapeHTML(trip.hotels.note)}</p><table><thead><tr><th scope="col">酒店</th><th scope="col">报价</th><th scope="col">备注</th></tr></thead><tbody>${trip.hotels.items.map(row=>`<tr>${row.map(v=>`<td>${escapeHTML(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  if (trip.team) { const t=trip.team; const L=a=>`<ul>${a.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul>`; $('team').innerHTML = `<p class="muted">${escapeHTML(t.intro)}</p><div class="team-grid">${t.roles.map(r=>`<div class="panel team-card"><h3>${escapeHTML(r.name)}<small> · ${escapeHTML(r.title)}</small></h3><h4>负责</h4>${L(r.owns)}<h4>具体要做</h4>${L(r.do)}<p class="muted"><strong>能学到：</strong>${escapeHTML(r.learn)}</p></div>`).join('')}</div><div class="panel" style="margin-top:16px"><h3>团队规则</h3>${L(t.rules)}</div>`; }
  $('tips').innerHTML = trip.tips.map(t=>`<li>${escapeHTML(t)}</li>`).join('');
  renderTodos();
}
let checked = {};
function renderTodos() {
  try { checked = JSON.parse(localStorage.getItem('florida-trip-todo-v1') || '{}') || {}; } catch { $('storage-status').textContent = '浏览器无法读取保存记录；仍可勾选当前清单。'; }
  $('todo').innerHTML = trip.todo.map(([name,when,note],i)=>`<label class="todo-item"><input type="checkbox" data-todo="${i}" ${checked[name] ? 'checked' : ''}><span><strong>${escapeHTML(name)}</strong><span class="deadline">${escapeHTML(when)}</span><small>${escapeHTML(note)}</small></span></label>`).join('');
  updateTodoCount();
}
function updateTodoCount() { $('todo-count').textContent = `${$('todo').querySelectorAll('input:checked').length} / ${trip.todo.length} 已完成`; }
function selectDay(date, scroll = true, fit = true) {
  selected = date;
  document.querySelectorAll('[data-day]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.day===date)));
  document.querySelectorAll('.day-card').forEach(c=>c.classList.toggle('selected',c.id===`day-${date}`));
  const bounds = [];
  dayLayers.forEach((layers,key)=>{
    const active = date==='all' || date===key;
    layers.route.setStyle({opacity:active ? .85 : .12,weight:active ? 5 : 3});
    layers.stops.forEach((marker,i)=>{ marker.setOpacity(active ? 1 : .25); marker.setIcon(stopIcon(layers.color,i,date===key)); marker.setZIndexOffset(date===key ? 500 : 0); });
    if(active) { if(layers.route.getBounds().isValid()) bounds.push(layers.route.getBounds()); layers.stops.forEach(m=>bounds.push(m.getLatLng())); if(date!=='all') layers.route.bringToFront(); }
  });
  if(map && fit && bounds.length) map.fitBounds(L.latLngBounds(bounds),{padding:[30,30],maxZoom:12,animate:motion});
  if(scroll && date!=='all') $(`day-${date}`).scrollIntoView({behavior:motion?'smooth':'auto',block:'start'});
}
function stopIcon(color,index,numbered) {
  const size = numbered ? 28 : 12;
  return L.divIcon({className:'number-marker',html:`<span class="${numbered ? 'marker-circle' : 'marker-dot'}" style="--marker-color:${color}">${numbered ? index+1 : ''}</span>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
}
function initMap() {
  if(!window.L) { $('map-status').textContent = '地图组件未能载入，请检查网络后刷新。行程与导航仍可使用。'; $('map').innerHTML='<p style="padding:24px">地图暂不可用 · 请查看下方行程</p>'; return; }
  map = L.map('map',{scrollWheelZoom:false,zoomControl:false,dragging:!L.Browser.mobile});
  if(L.Browser.mobile) $('map-lock').classList.add('available');
  L.control.zoom({position:'bottomright',zoomInTitle:'放大',zoomOutTitle:'缩小'}).addTo(map);
  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}).addTo(map);
  tiles.on('tileerror',()=>{ $('map-status').textContent='部分底图未能载入；路线与站点仍可查看。'; });
  const shared = new Map();
  trip.days.forEach(d=>d.stops.forEach(s=>{ const key=`${s.lat},${s.lon}`; if(!shared.has(key))shared.set(key,[]); shared.get(key).push(s); }));
  trip.days.forEach(d=>{
    const route = L.geoJSON({type:'FeatureCollection',features:routes.features.filter(f=>f.properties.date===d.date)},{style:f=>({color:d.color,weight:5,opacity:.85})}).addTo(map);
    const stops = d.stops.map((s,i)=>{
      const peers = shared.get(`${s.lat},${s.lon}`);
      const angle = 2*Math.PI*peers.indexOf(s)/peers.length;
      const position = peers.length > 1 ? [s.lat + .0007*Math.sin(angle),s.lon + .0008*Math.cos(angle)] : [s.lat,s.lon];
      const marker = L.marker(position,{title:`${shortDate(d.date)} 第 ${i+1} 站 ${s.name}`,icon:stopIcon(d.color,i,false)}).bindPopup(popup(s),{closeButton:false}).addTo(map);
      marker.on('click',()=>selectDay(d.date,false,false));
      markers.set(`${d.date}:${i}`,marker); return marker;
    });
    dayLayers.set(d.date,{route,stops,color:d.color});
  });
  extraLayer=L.layerGroup();
  trip.extras.forEach((s,i)=>{ const marker=L.marker([s.lat,s.lon],{title:`备选：${s.name}`,icon:L.divIcon({className:'extra-marker',iconSize:[12,12],iconAnchor:[6,6]})}).bindPopup(popup(s),{closeButton:false}).addTo(extraLayer); markers.set(`extra:${i}`,marker); });
  selectDay('all',false);
}
function showStop(key) {
  const extra = key.startsWith('extra:');
  const stop = extra ? trip.extras[Number(key.split(':')[1])] : trip.days.find(d=>d.date===key.split(':')[0]).stops[Number(key.split(':')[1])];
  if(!map) { window.open(`https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lon}`,'_blank','noopener,noreferrer'); return; }
  if(extra) { $('extras-toggle').checked=true; extraLayer.addTo(map); } else selectDay(key.split(':')[0],false,false);
  $('map').scrollIntoView({behavior:motion?'smooth':'auto',block:'center'});
  const marker=markers.get(key);
  map.flyTo(marker.getLatLng(),15,{animate:motion,duration:.7});
  marker.openPopup();
}
function bindEvents() {
  $('map-lock').addEventListener('click',()=>{ const unlock=!map.dragging.enabled(); if(unlock)map.dragging.enable();else map.dragging.disable(); $('map-lock').setAttribute('aria-pressed',String(unlock)); $('map-lock').textContent=unlock ? '锁定地图，继续滚动' : '点击地图解锁拖动'; });
  $('day-selector').addEventListener('click',e=>{const b=e.target.closest('[data-day]'); if(b)selectDay(b.dataset.day);});
  $('reset-map').addEventListener('click',()=>selectDay('all',false));
  $('extras-toggle').addEventListener('change',e=>{if(map)e.target.checked ? extraLayer.addTo(map) : map.removeLayer(extraLayer);});
  $('days').addEventListener('click',e=>{const b=e.target.closest('[data-stop]');if(b)showStop(b.dataset.stop);});
  $('extras').addEventListener('click',e=>{const b=e.target.closest('[data-extra]');if(b)showStop(`extra:${b.dataset.extra}`);});
  $('todo').addEventListener('change',e=>{if(!e.target.matches('[data-todo]'))return;checked[trip.todo[Number(e.target.dataset.todo)][0]]=e.target.checked;try{localStorage.setItem('florida-trip-todo-v1',JSON.stringify(checked));}catch{$('storage-status').textContent='浏览器无法保存勾选；当前页面仍可使用。';}updateTodoCount();});
  $('gallery').addEventListener('click',e=>{
    const b=e.target.closest('[data-photo]');if(!b)return;
    const c=credits[b.dataset.photo]; $('lightbox-image').hidden=false; $('lightbox-image').src=c.file; $('lightbox-image').alt=b.querySelector('img')?.alt || b.getAttribute('aria-label');
    $('lightbox-caption').innerHTML=`<p>${escapeHTML($('lightbox-image').alt)}</p><p class="credit">${creditLine(c)}</p>`; $('lightbox').showModal();
  });
  $('close-lightbox').addEventListener('click',()=>$('lightbox').close());
  $('lightbox').addEventListener('click',e=>{if(e.target===$('lightbox')) {const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  document.addEventListener('error',e=>{if(e.target.tagName!=='IMG')return;const img=e.target;if(img.id==='lightbox-image'){img.hidden=true;$('lightbox-caption').insertAdjacentHTML('afterbegin','<p>照片暂不可用</p>');return;}const p=document.createElement('span');p.className=`${img.className} placeholder`;p.innerHTML=`<span>${emoji[img.dataset.category]||'📷'}</span><span class="placeholder-name">${escapeHTML(img.dataset.name || img.alt)}</span>`;p.setAttribute('aria-label','照片暂不可用');img.replaceWith(p);},true);
}
function initSectionNav() {
  const links = [...document.querySelectorAll('.section-nav a')];
  const visible = new Set();
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{ if(entry.isIntersecting)visible.add(entry.target.id);else visible.delete(entry.target.id); });
    const active = links.find(link=>visible.has(link.hash.slice(1)));
    links.forEach(link=>{ if(link===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current'); });
  },{rootMargin:'-5% 0px -45% 0px',threshold:0});
  links.forEach(link=>observer.observe(document.querySelector(link.hash)));
}
async function getJSON(file) { const response=await fetch(file);if(!response.ok)throw new Error(`${file}: ${response.status}`);return response.json(); }
async function start() {
  try {
    [trip,routes,credits]=await Promise.all([getJSON('trip.json'),getJSON('routes.geojson'),getJSON('credits.json')]);
    trip.days.forEach((d,i)=>{ d.color=palette[i%palette.length]; });
    bindEvents();render();initMap();initSectionNav();$('status').textContent='';
  } catch(error) { console.error(error);$('status').textContent='旅行数据载入失败，请检查网络后刷新。请通过网站地址打开本页。'; }
}
start();
