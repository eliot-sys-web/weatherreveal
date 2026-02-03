:root{
  --bg0:#070A12;
  --bg1:#0B1020;
  --card: rgba(255,255,255,.08);
  --card2: rgba(255,255,255,.12);
  --stroke: rgba(255,255,255,.14);

  --text:#ECF2FF;
  --muted: rgba(236,242,255,.70);

  --primary:#7C5CFF;
  --primary2:#2EE9A6;
  --warn:#FFCC66;

  --shadow: 0 20px 60px rgba(0,0,0,.55);
  --radius: 18px;
}

[data-theme="light"]{
  --bg0:#F6F7FB;
  --bg1:#FFFFFF;
  --card: rgba(20,25,40,.06);
  --card2: rgba(20,25,40,.09);
  --stroke: rgba(20,25,40,.12);

  --text:#0B1020;
  --muted: rgba(11,16,32,.65);

  --primary:#5B5CFF;
  --primary2:#00B386;

  --shadow: 0 18px 50px rgba(10,20,40,.18);
}

*{ box-sizing:border-box; }
html,body{ height:100%; }
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  color:var(--text);
  background: linear-gradient(180deg, var(--bg0), var(--bg1));
  overflow-x:hidden;
}

a{ color:inherit; text-decoration:none; }
b{ font-weight: 700; }
u{ text-underline-offset: 4px; }

.bg{
  position:fixed; inset:0;
  pointer-events:none;
  overflow:hidden;
}
.aurora{
  position:absolute;
  width:900px; height:900px;
  filter: blur(50px);
  opacity:.55;
  mix-blend-mode: screen;
  animation: float 14s ease-in-out infinite;
}
.aurora.a1{ background: radial-gradient(circle at 30% 30%, var(--primary), transparent 55%); left:-220px; top:-260px; }
.aurora.a2{ background: radial-gradient(circle at 50% 50%, var(--primary2), transparent 60%); right:-260px; top:-200px; animation-duration: 17s; }
.aurora.a3{ background: radial-gradient(circle at 50% 50%, #FF6BD6, transparent 60%); left:10%; bottom:-420px; opacity:.28; animation-duration: 20s; }

@keyframes float{
  0%,100%{ transform: translate3d(0,0,0) scale(1); }
  50%{ transform: translate3d(30px,-25px,0) scale(1.06); }
}

.grain{
  position:absolute; inset:-20%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
  opacity:.14;
  transform: rotate(7deg);
}

.topbar{
  position:sticky; top:0;
  z-index:10;
  display:flex; align-items:center; justify-content:space-between;
  padding: 18px 22px;
  backdrop-filter: blur(16px);
  background: linear-gradient(180deg, rgba(0,0,0,.28), rgba(0,0,0,.06));
  border-bottom: 1px solid var(--stroke);
}
[data-theme="light"] .topbar{
  background: linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,.35));
}

.brand{ display:flex; align-items:center; gap:12px; }
.mark{
  width:44px; height:44px;
  display:grid; place-items:center;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(124,92,255,.22), rgba(46,233,166,.14));
  border: 1px solid var(--stroke);
  box-shadow: var(--shadow);
}
.brandTitle{ display:block; font-weight: 820; letter-spacing: .2px; }
.brandSub{ display:block; font-size: 12px; color: var(--muted); margin-top: 2px; }

.topActions{ display:flex; gap:10px; }

.container{
  max-width: 1100px;
  margin: 0 auto;
  padding: 26px 22px 80px;
}

.hero{
  display:grid;
  grid-template-columns: 1.2fr .9fr;
  gap: 22px;
  align-items:start;
  margin-top: 10px;
}

.pill{
  display:inline-flex;
  gap:8px;
  align-items:center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  border: 1px solid var(--stroke);
  color: var(--muted);
  font-size: 13px;
}

h1{
  margin: 14px 0 10px;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.06;
  letter-spacing: -0.6px;
}
.lead{
  margin: 0 0 16px;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.55;
}

.heroStats{
  display:grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 18px;
}
.miniStat{
  padding: 14px 14px;
  border-radius: var(--radius);
  background: rgba(255,255,255,.06);
  border: 1px solid var(--stroke);
}
.miniStat .k{ display:block; font-weight: 780; }
.miniStat .v{ display:block; margin-top: 4px; color: var(--muted); font-size: 13px; }

.panel{
  border-radius: calc(var(--radius) + 6px);
  background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.06));
  border: 1px solid var(--stroke);
  box-shadow: var(--shadow);
  overflow:hidden;
}
.panelHeader{
  padding: 18px 18px 10px;
  border-bottom: 1px solid var(--stroke);
}
.panelHeader h2{ margin:0; font-size: 16px; letter-spacing: .2px; }
.muted{ color: var(--muted); }

.form{ padding: 16px 18px 18px; }
.field{ display:flex; flex-direction:column; gap: 8px; margin-bottom: 14px; }
label{ font-size: 13px; color: var(--muted); }
.hint{ margin:0; font-size: 12px; color: var(--muted); }

input{
  height: 44px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--stroke);
  background: rgba(0,0,0,.18);
  color: var(--text);
  outline: none;
}
[data-theme="light"] input{ background: rgba(255,255,255,.75); }
input:focus{
  border-color: rgba(124,92,255,.55);
  box-shadow: 0 0 0 6px rgba(124,92,255,.16);
}

.row{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn{
  height: 44px;
  border-radius: 14px;
  border: 1px solid var(--stroke);
  background: rgba(255,255,255,.08);
  color: var(--text);
  cursor: pointer;
  padding: 0 14px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap: 10px;
  font-weight: 700;
  letter-spacing:.2px;
  transition: transform .12s ease, background .2s ease, border-color .2s ease;
}
.btn:hover{ transform: translateY(-1px); background: rgba(255,255,255,.12); }
.btn:active{ transform: translateY(0px) scale(.99); }

.btn.primary{
  background: linear-gradient(135deg, rgba(124,92,255,.95), rgba(46,233,166,.70));
  border-color: rgba(255,255,255,.16);
}
.btn.primary:hover{ filter: brightness(1.02); }

.btn.ghost{
  background: rgba(255,255,255,.06);
}

.btnLabel{ display:none; }
@media (min-width: 880px){
  .btnLabel{ display:inline; }
}

.note{
  margin-top: 10px;
  font-size: 13px;
  color: var(--muted);
  min-height: 18px;
}

.trust{
  display:flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding: 10px 6px;
  color: var(--muted);
  font-size: 12px;
}
.trustItem{ display:flex; gap: 8px; align-items:center; }
.dot{
  width:8px; height:8px; border-radius:999px;
  background: linear-gradient(135deg, var(--primary), var(--primary2));
  box-shadow: 0 0 0 4px rgba(124,92,255,.12);
}

.results{
  margin-top: 26px;
  padding: 18px;
  border-radius: calc(var(--radius) + 10px);
  border: 1px solid var(--stroke);
  background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.05));
  box-shadow: var(--shadow);
}

.resultsHeader{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap: 10px;
  margin-bottom: 12px;
}
.resultsHeader h2{ margin:0; font-size: 18px; }
.badgeRow{ display:flex; gap: 8px; flex-wrap: wrap; }
.badge{
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: rgba(255,255,255,.08);
  font-size: 12px;
  font-weight: 700;
}
.badge.subtle{ color: var(--muted); font-weight: 650; }

.grid{
  display:grid;
  grid-template-columns: 1.2fr .9fr .9fr;
  gap: 12px;
  margin-top: 12px;
  animation: pop .22s ease-out;
}
@keyframes pop{
  from{ opacity:0; transform: translateY(6px); }
  to{ opacity:1; transform: translateY(0); }
}

.card{
  border-radius: var(--radius);
  border: 1px solid var(--stroke);
  background: rgba(255,255,255,.07);
  padding: 14px;
}
.card.big{
  grid-row: span 2;
  padding: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.06));
}
.card.wide{ grid-column: 1 / -1; }

.card h3{
  margin: 0 0 10px;
  font-size: 14px;
  letter-spacing: .2px;
}
.kpi{
  margin: 0;
  font-size: 28px;
  font-weight: 850;
  letter-spacing: -0.6px;
}
.unit{ font-size: 14px; color: var(--muted); margin-left: 2px; }
.divider{
  height:1px;
  background: var(--stroke);
  margin: 12px 0;
}
.mini{ margin: 0; color: var(--muted); font-size: 13px; }
.summary{ margin: 0; line-height:1.55; color: var(--muted); }

.cardTop{
  display:flex;
  gap: 14px;
  align-items:center;
}
.iconWrap{
  width: 56px; height: 56px;
  border-radius: 18px;
  display:grid;
  place-items:center;
  border: 1px solid var(--stroke);
  background: rgba(255,255,255,.08);
}
.bigTemp{
  font-size: 46px;
  font-weight: 900;
  letter-spacing: -1.2px;
  line-height: 1;
}
.bigMeta{
  margin-top: 6px;
  color: var(--muted);
  font-size: 13px;
}
.sep{ margin: 0 8px; opacity: .6; }

.cardMid{
  margin-top: 14px;
  display:grid;
  gap: 10px;
}
.progressLabel{
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-size: 13px;
}
.bar{
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  border: 1px solid var(--stroke);
  overflow:hidden;
}
.fill{
  height:100%;
  width:0%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(124,92,255,.9), rgba(46,233,166,.8));
  transition: width .5s ease;
}

.sunRow{
  display:flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.sunItem{ display:flex; flex-direction:column; gap: 4px; }
.sunItem .val{ font-weight: 800; }

.chips{
  display:flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip{
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid var(--stroke);
  background: rgba(255,255,255,.06);
  color: var(--muted);
  font-size: 12px;
}

.foot{ margin: 12px 2px 0; font-size: 12px; }

.skeleton{
  margin-top: 14px;
}
.skLine{
  height: 14px;
  width: 55%;
  border-radius: 999px;
  background: rgba(255,255,255,.10);
  border: 1px solid var(--stroke);
  overflow:hidden;
  position:relative;
}
.skGrid{
  margin-top: 12px;
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.skCard{
  height: 96px;
  border-radius: var(--radius);
  background: rgba(255,255,255,.07);
  border: 1px solid var(--stroke);
  position:relative;
  overflow:hidden;
}
.skLine::after, .skCard::after{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent);
  transform: translateX(-60%);
  animation: shimmer 1.1s ease-in-out infinite;
}
@keyframes shimmer{
  0%{ transform: translateX(-60%); }
  100%{ transform: translateX(120%); }
}

.footer{
  padding: 28px 22px;
  text-align:center;
  border-top: 1px solid var(--stroke);
  background: rgba(255,255,255,.03);
}

/* Responsive */
@media (max-width: 980px){
  .hero{ grid-template-columns: 1fr; }
  .row{ grid-template-columns: 1fr; }
  .grid{ grid-template-columns: 1fr; }
  .card.big{ grid-row:auto; }
  .card.wide{ grid-column:auto; }
  .skGrid{ grid-template-columns: 1fr 1fr; }
}
