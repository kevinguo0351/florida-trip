# Task: build a static travel-guide website for our Florida road trip

Build a **static site in `site/`** (it will be deployed as-is to GitHub Pages, no build step on the server).
Plain HTML + CSS + vanilla JS only. You may load these from a CDN: Leaflet 1.9.x (unpkg) and its CSS. No other frameworks, no npm build.

## Data (already in `site/`, do NOT invent new facts)
- `site/trip.json`: everything. Keys: `title, subtitle, days[], extras[], hotels, budget, todo, people, tips`.
  - `days[i]`: `date, dow, title, color, sleep, notes[], alt, stops[]`.
  - `stops[j]`: `id, name, cat (food|sight|park|shop|hotel|transport), lat, lon, note, time, img_key`.
  - `extras[]`: alternative / researched places (same shape, some have `tags[]`). Show them as a separate toggleable map layer + a "餐厅研究 & 备选" section.
- `site/routes.geojson`: one LineString per day (`properties.date, color, km, min`), real driving geometry. Draw on map with the day's color.
- `site/credits.json`: `{img_key: {file, page, artist, license}}`. Images live in `site/img/`. Some stops have no image: render a nice colored placeholder with an emoji by category instead (no broken images). Load credits.json at runtime so newly added photos appear automatically.
- All UI text in **Chinese** (keep English place names as given).

## Page design (must be very intuitive, mobile-first; most viewers open it on a phone from a Telegram/WeChat link)
1. **Hero**: title, subtitle, date range, 4 people chips (from `people`), quick stats (8 days, total km summed from routes, # of stops).
2. **Interactive map (the centerpiece)**: Leaflet with OpenStreetMap tiles (attribution required). 
   - All day routes drawn in their colors; numbered circle markers per stop (number = order within day, colored by day).
   - A **day selector** (pill buttons: 全部 / 11/23 周一 / ...). Selecting a day highlights that route, dims others, fits bounds, and scrolls the timeline to that day.
   - Marker popup: photo (if any), time, name, note, and a "Google 地图导航" link: `https://www.google.com/maps/dir/?api=1&destination=LAT,LON`.
   - Layer toggle for "备选/餐厅研究" (extras), shown as small grey markers.
   - Sticky on desktop (map left/right split with timeline); on mobile, map on top (~55vh) and content below.
3. **Day-by-day timeline**: one card per day with color bar, date/dow, title, where we sleep, driving km/min for that day (from routes.geojson), vertical timeline of stops (time, emoji per category, name, note, thumbnail). Clicking a stop flies the map to it and opens its popup. Show `notes` as small badges and `alt` in a collapsible "备选方案".
4. **Photo gallery**: grid of all available images with captions, lightbox on click, credit line (artist + license, link to `page`).
5. **餐厅研究 & 备选景点**: cards from `extras` (tags as chips).
6. **待办 / 预订清单** (`todo`): checklist UI, check state saved in localStorage.
7. **预算** (`budget`) and **迈阿密酒店闲鱼报价** (`hotels`) as clean cards/tables, plus **注意事项** (`tips`).
8. Footer: "地图 © OpenStreetMap contributors；照片来自 Wikimedia Commons，按各自许可使用" + last updated date.

Style: clean, modern, Florida vibe (warm sunset + ocean palette), rounded cards, system font stack with CJK fallback (`-apple-system, "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif`). Good contrast; no horizontal scroll on 375px width. Smooth but light — no heavy animations.

## Constraints
- Files: `site/index.html`, `site/style.css`, `site/app.js` (you may split JS further). Use `fetch()` for the JSON (it will be served over http).
- No secrets, no analytics, no external fonts.
- Must work when served by `python3 -m http.server` from `site/`.
- After building, verify yourself: serve `site/` locally, and use node to at least syntax-check app.js (`node --check site/app.js`). Fix any issue.
- Commit your work to git with a clear message when done.
