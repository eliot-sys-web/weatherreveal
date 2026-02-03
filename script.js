// -------------------------
// Utils
// -------------------------
const $ = (sel) => document.querySelector(sel);

function clamp(x, a, b){ return Math.min(b, Math.max(a, x)); }

function pad2(n){ return String(n).padStart(2, "0"); }

function formatDateFR(d){
  const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function isLeapYear(y){
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

function dayOfYear(date){
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start;
  return Math.floor(diff / 86400000) + 1;
}

// Hash string -> 32-bit
function hashString(str){
  let h = 2166136261;
  for (let i = 0; i < str.length; i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Deterministic PRNG: Mulberry32
function mulberry32(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rnd, arr){
  return arr[Math.floor(rnd() * arr.length)];
}

function degToCompass(deg){
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  const idx = Math.round((deg % 360) / 22.5) % 16;
  return dirs[idx];
}

function hoursToHHMM(h){
  let hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  if (mm === 60){ mm = 0; hh += 1; }
  hh = (hh + 24) % 24;
  return `${pad2(hh)}:${pad2(mm)}`;
}

// -------------------------
// “Weather” generator (coherent fiction)
// -------------------------
function generateWeather({ city, month, day, year }){
  const key = `${city.trim().toLowerCase()}|${year}-${pad2(month+1)}-${pad2(day)}`;
  const seed = hashString(key) ^ (year * 2654435761);
  const rnd = mulberry32(seed >>> 0);

  // Date
  const date = new Date(year, month, day);
  const doy = dayOfYear(date);

  // Seasonal curve (Northern hemisphere-like)
  // Peak around late June/July (doy ~ 200), trough around January.
  const seasonal = Math.sin((2 * Math.PI * (doy - 172)) / 365);

  // City “profile” from hash (fake latitude + climate offset)
  const hc = hashString(city.trim().toLowerCase());
  const lat = 15 + (hc % 61); // 15..75
  const climateOffset = ((hc >>> 8) % 2400) / 100 - 12; // -12..+12 approx

  // Baseline temperature and noise
  const base = 12 + 11 * seasonal + climateOffset;        // average day temp
  const noise = (rnd() - 0.5) * 4.5;                      // +/- ~2.25
  const avg = base + noise;

  const diurnal = 6 + rnd() * 5;                          // 6..11
  const tMax = avg + diurnal * (0.55 + rnd() * 0.10);
  const tMin = avg - diurnal * (0.45 + rnd() * 0.10);

  // Cloud & precipitation (correlated)
  const winterBoost = clamp(-seasonal, 0, 1);             // more clouds in "winter"
  const humidFactor = clamp((12 - Math.abs(climateOffset)) / 12, 0, 1); // temperate ~ more humid
  let cloud = clamp(0.25 + 0.35 * winterBoost + 0.25 * humidFactor + (rnd() - 0.5) * 0.35, 0.05, 0.98);

  const rainProb = clamp(0.15 + 0.45 * cloud + 0.15 * winterBoost + (rnd() - 0.5) * 0.10, 0.03, 0.92);
  const isRain = rnd() < rainProb;

  // If rain: heavier clouds
  if (isRain) cloud = clamp(cloud + 0.18 + rnd() * 0.22, 0.25, 0.99);

  const rainMM = isRain ? Math.round((Math.pow(rnd(), 0.55) * (8 + 28 * cloud)) * 10) / 10 : 0;

  // Humidity correlated with cloud/rain
  const humidity = Math.round(clamp(
    42 + cloud * 45 + (isRain ? 12 : 0) + (rnd() - 0.5) * 10 - climateOffset * 0.7,
    15, 100
  ));

  // Wind correlated with pressure systems / rain
  const windKmh = Math.round(clamp(
    6 + rnd() * 24 + (isRain ? 6 : 0) + cloud * 6,
    0, 70
  ));
  const windDir = Math.round(rnd() * 359);

  // Pressure lower if rainy/cloudy
  const pressure = Math.round(clamp(
    1019 - cloud * 18 - (isRain ? 10 : 0) + (rnd() - 0.5) * 8,
    970, 1040
  ));

  // UV index: higher in summer, lower with clouds
  const uv = Math.round(clamp(
    1.5 + 7.2 * clamp(seasonal * 0.65 + 0.55, 0, 1) * (1 - cloud * 0.70) + (rnd() - 0.5) * 0.6,
    0, 11
  ));

  // Day length approx (very simplified)
  const latFactor = Math.cos((Math.abs(lat - 45) / 45) * (Math.PI / 2)); // 0..1
  const dayLen = clamp(12 + (4.2 * seasonal) * (0.55 + 0.45 * latFactor), 7.2, 16.8);
  const sunrise = 12 - dayLen / 2;
  const sunset  = 12 + dayLen / 2;

  // “Feels like” simple: wind chill / humidity effect
  let feels = avg;
  if (avg < 10) feels = avg - (windKmh / 35);
  if (avg > 24) feels = avg + (humidity - 55) / 18;
  feels = Math.round(feels * 10) / 10;

  // Description
  let desc;
  if (isRain && rainMM > 12) desc = "Pluie soutenue";
  else if (isRain) desc = "Averses / pluie faible";
  else if (cloud > 0.72) desc = "Très nuageux";
  else if (cloud > 0.45) desc = "Partiellement nuageux";
  else desc = "Ciel dégagé";

  // Snow hint (only if cold + precip)
  const snowPossible = isRain && avg <= 1.5;
  const precipType = snowPossible ? "neige (possible)" : (isRain ? "pluie" : "aucune");

  return {
    key, city, date, doy, lat,
    tMin: Math.round(tMin * 10) / 10,
    tMax: Math.round(tMax * 10) / 10,
    tAvg: Math.round(avg * 10) / 10,
    feels,
    rainMM,
    rainProb,
    humidity,
    windKmh,
    windDir,
    pressure,
    cloud,
    uv,
    sunriseHHMM: hoursToHHMM(sunrise),
    sunsetHHMM: hoursToHHMM(sunset),
    desc,
    precipType
  };
}

// -------------------------
// UI
// -------------------------
function drawMiniChart(canvas, w){
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  // Background grid
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  for (let i=1;i<=4;i++){
    const y = (H*i)/5;
    ctx.beginPath(); ctx.moveTo(16,y); ctx.lineTo(W-16,y); ctx.stroke();
  }
  ctx.restore();

  // Fake temperature curve based on min/max
  const points = [];
  const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];
  // simple curve: min around 6, max around 15
  for (const h of hours){
    let t;
    if (h <= 6) t = w.tMin + (w.tAvg - w.tMin) * (h / 6) * 0.55;
    else if (h <= 15) t = w.tMin + (w.tMax - w.tMin) * ((h - 6) / 9);
    else t = w.tMax - (w.tMax - w.tMin) * ((h - 15) / 9) * 0.75;
    points.push({ h, t });
  }

  const tMin = Math.min(...points.map(p=>p.t));
  const tMax = Math.max(...points.map(p=>p.t));
  const pad = 6;
  const tLo = tMin - pad, tHi = tMax + pad;

  const x = (h) => 16 + (W - 32) * (h / 24);
  const y = (t) => 18 + (H - 36) * (1 - (t - tLo) / (tHi - tLo));

  // Line
  const grad = ctx.createLinearGradient(0,0,W,0);
  grad.addColorStop(0, "rgba(124,92,255,0.95)");
  grad.addColorStop(1, "rgba(0,212,255,0.95)");

  ctx.lineWidth = 3;
  ctx.strokeStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x(points[0].h), y(points[0].t));
  for (let i=1;i<points.length;i++){
    ctx.lineTo(x(points[i].h), y(points[i].t));
  }
  ctx.stroke();

  // Dots
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (const p of points){
    ctx.beginPath();
    ctx.arc(x(p.h), y(p.t), 3.4, 0, Math.PI*2);
    ctx.fill();
  }

  // Labels (min/max)
  ctx.fillStyle = "rgba(255,255,255,0.80)";
  ctx.font = "700 12px ui-sans-serif, system-ui";
  ctx.fillText(`${w.tMin}°C`, 20, y(w.tMin) - 10);
  ctx.fillText(`${w.tMax}°C`, 20, y(w.tMax) - 10);
}

function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function getTheme(){
  return localStorage.getItem("theme") || "dark";
}

function setQueryFromForm(city, birthISO, year){
  const params = new URLSearchParams();
  params.set("city", city);
  params.set("birth", birthISO);
  params.set("year", year);
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
}

function getQuery(){
  const p = new URLSearchParams(location.search);
  return {
    city: p.get("city"),
    birth: p.get("birth"),
    year: p.get("year")
  };
}

function showResults(w, leapNote){
  $("#results").hidden = false;

  $("#resultTitle").textContent = `Météo à ${w.city} le ${formatDateFR(w.date)}`;
  $("#resultSubtitle").textContent =
    `${w.desc} • Précipitations : ${w.precipType} • “Latitude” simulée : ${Math.round(w.lat)}°`;

  $("#resultSummary").textContent = `${w.desc} — ${w.tMin}° / ${w.tMax}°`;

  $("#tempValue").textContent = `${w.tMin}°C → ${w.tMax}°C`;
  $("#tempDetail").textContent = `Moyenne ~ ${w.tAvg}°C • Ressenti ~ ${w.feels}°C`;

  $("#rainValue").textContent = w.rainMM > 0 ? `${w.rainMM} mm` : `0 mm`;
  const rainPct = Math.round(w.rainProb * 100);
  $("#rainDetail").textContent = `Probabilité (simulée) : ${rainPct}% • Type : ${w.precipType}`;

  $("#windValue").textContent = `${w.windKmh} km/h`;
  $("#windDetail").textContent = `Direction : ${degToCompass(w.windDir)} (${w.windDir}°)`;

  $("#humValue").textContent = `${w.humidity}%`;
  $("#humDetail").textContent = `Nébulosité : ${Math.round(w.cloud * 100)}%`;

  $("#pressValue").textContent = `${w.pressure} hPa`;
  $("#pressDetail").textContent = w.pressure < 1000 ? `Tendance perturbée possible` : `Plutôt stable`;

  $("#skyValue").textContent = `${Math.round(w.cloud * 100)}% • UV ${w.uv}`;
  $("#skyDetail").textContent = `Indice UV (simulé) : ${w.uv}/11`;

  $("#sunriseValue").textContent = w.sunriseHHMM;
  $("#sunsetValue").textContent = w.sunsetHHMM;
  $("#feelsValue").textContent = `${w.feels}°C`;

  $("#astroNote").textContent =
    `${leapNote ? leapNote + " " : ""}Lever/coucher générés de façon approximative (démo).`;

  drawMiniChart($("#miniChart"), w);

  // scroll to results
  setTimeout(() => $("#results").scrollIntoView({ behavior: "smooth", block: "start" }), 80);
}

function hideResults(){
  $("#results").hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// -------------------------
// Wiring
// -------------------------
setTheme(getTheme());

$("#btnTheme").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(cur === "dark" ? "light" : "dark");
});

$("#btnAgain").addEventListener("click", hideResults);

$("#btnRandom").addEventListener("click", () => {
  const cities = ["Paris", "Lyon", "Marseille", "Tokyo", "Reykjavík", "New York", "Alger", "Montréal", "São Paulo", "Sydney"];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const year = 1950 + Math.floor(Math.random() * 76); // 1950..2025

  // Random day/month (safe-ish)
  const month = Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  const birth = new Date(2000, month, day); // arbitrary year for input
  const iso = `${birth.getFullYear()}-${pad2(birth.getMonth()+1)}-${pad2(birth.getDate())}`;

  $("#city").value = city;
  $("#year").value = year;
  $("#birth").value = iso;
});

$("#btnShare").addEventListener("click", async () => {
  const city = $("#city").value.trim();
  const birth = $("#birth").value;
  const year = $("#year").value;

  if (!city || !birth || !year){
    alert("Remplis d’abord la ville, la date (jour/mois) et l’année 🙂");
    return;
  }

  setQueryFromForm(city, birth, year);
  const link = location.href;

  try{
    await navigator.clipboard.writeText(link);
    alert("Lien copié dans le presse-papiers !");
  }catch{
    prompt("Copie le lien :", link);
  }
});

$("#weatherForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const city = $("#city").value.trim();
  const birthISO = $("#birth").value;
  const year = parseInt($("#year").value, 10);

  if (!city || !birthISO || !Number.isFinite(year)){
    alert("Merci de compléter tous les champs.");
    return;
  }

  const birth = new Date(birthISO);
  const month = birth.getMonth();
  const day = birth.getDate();

  let leapNote = "";
  let targetDay = day;

  // Handle Feb 29 in non-leap years
  if (month === 1 && day === 29 && !isLeapYear(year)){
    leapNote = `⚠️ ${year} n’est pas bissextile : 29 février ajusté au 28 février.`;
    targetDay = 28;
  }

  const w = generateWeather({ city, month, day: targetDay, year });

  // Update URL for shareable state
  setQueryFromForm(city, birthISO, year);

  showResults(w, leapNote);
});

// Load from query if present
(function initFromQuery(){
  const q = getQuery();
  if (q.city) $("#city").value = q.city;
  if (q.birth) $("#birth").value = q.birth;
  if (q.year) $("#year").value = q.year;

  if (q.city && q.birth && q.year){
    // auto-generate
    $("#weatherForm").dispatchEvent(new Event("submit", { cancelable: true }));
  }else{
    // defaults for nicer first view
    // set birth to today-ish (safe for date input)
    const d = new Date();
    const iso = `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
    $("#birth").value = iso;
    $("#year").value = 2000;
  }
})();
