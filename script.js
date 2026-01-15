const timerEl = document.getElementById("timer");
const targetDate = new Date("May 16, 2028 00:00:00").getTime();

setInterval(() => {
  const now = Date.now();
  let diff = targetDate - now;
  if (diff < 0) diff = 0;

  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);

  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = (totalDays % 365) % 30;

  timerEl.innerHTML = `
    Time Left :
    ${years}Y ${months}M ${days}D
    ${hours}H ${minutes}M ${seconds}S
  `;
}, 1000);


/* ===== PAGE NAVIGATION (SPA) ===== */
const homePage = document.getElementById("homePage");
const notePage = document.getElementById("notePage");
const specialPage = document.getElementById("specialPage");
const khaasPage = document.getElementById("khaasPage");
const expressPage = document.getElementById("expressPage");
const owPage = document.getElementById("owPage");
const countPage = document.getElementById("countPage");
const moodPage = document.getElementById("moodPage");
const growthPage = document.getElementById('growthPage');

function hideAllPages() {
  homePage.classList.add("hidden");
  notePage.classList.add("hidden");
  specialPage.classList.add("hidden");
  khaasPage.classList.add("hidden");
  expressPage.classList.add("hidden");
  owPage.classList.add("hidden");
  countPage.classList.add("hidden");
  growthPage.classList.add("hidden");
}


function showHome() {
  hideAllPages();
  homePage.classList.remove("hidden");
  startHearts();
  stopFirework();
  stopEmojiRain();
}

function showOW(){
  hideAllPages();
  owPage.classList.remove("hidden");
}

function showGrowth(){
  hideAllPages();
  growthPage.classList.remove("hidden");
}

function showCount(){
  hideAllPages();
  countPage.classList.remove("hidden");
}

function showNote() {
  hideAllPages();
  notePage.classList.remove("hidden");
  stopHearts();
  stopFirework();
}

function showSpecial() {
  hideAllPages();
  specialPage.classList.remove("hidden");
  stopHearts();
}

function showMore() {
  hideAllPages();
  khaasPage.classList.remove("hidden");
  stopHearts();
}

function showExpress() {
  hideAllPages();
  expressPage.classList.remove("hidden");
  stopHearts();
}


/* ===== HEART RAIN ===== */
const heartsContainer = document.querySelector(".hearts");
let heartInterval;

function startHearts() {
  heartInterval = setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 4 + Math.random() * 3 + "s";
    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 7000);
  }, 300);
}

function stopHearts() {
  clearInterval(heartInterval);
  heartsContainer.innerHTML = "";
}


startHearts();


/* ===== EMOJI RAIN ===== */
const emojiRainBox = document.querySelector(".emoji-rain");
let emojiRainInterval = null;

// 👉 EDIT THIS LIST ONLY
const emojiList = ["🍑","🔞","🥵","💦","👅","💋","👡","👙","🍒","👠"];

function startEmojiRain(){
  if (emojiRainInterval) return;

  emojiRainInterval = setInterval(()=>{
    const e = document.createElement("div");
    e.className = "emoji-drop";
    e.textContent = emojiList[Math.floor(Math.random()*emojiList.length)];

    e.style.left = Math.random()*100 + "vw";
    e.style.fontSize = 16 + Math.random()*28 + "px";
    e.style.animationDuration = 4 + Math.random()*4 + "s";
    e.style.opacity = Math.random()*0.6 + 0.4;

    emojiRainBox.appendChild(e);
    setTimeout(()=>e.remove(), 9000);
  }, 280);
}

function stopEmojiRain(){
  clearInterval(emojiRainInterval);
  emojiRainInterval = null;
  emojiRainBox.innerHTML = "";
}



/* ===== DAILY NOTE FROM CSV ===== */
async function loadDailyNote() {
  try {
    const res = await fetch("daily-notes.csv");
    const text = await res.text();
    const rows = text.split("\n").slice(1);

    const today = new Date().toISOString().slice(0, 10);
    let note = "No note for today 🤍";

    rows.forEach(row => {
      const [date, msg] = row.split(",");
      if (date === today) note = msg;
    });

    document.getElementById("dailyNote").textContent = note;
  } catch {
    document.getElementById("dailyNote").textContent =
      "Failed to load note 🤍";
  }
}

loadDailyNote();

let songg = "";

async function loadDailySong() {
  const res = await fetch("daily-songs.csv");
  const text = await res.text();
  const rows = text.trim().split("\n").slice(1);

  const today = new Date().toISOString().slice(0, 10);

  for (let row of rows) {
    const [date, ...songs] = row.split(",");
    if (date.trim() === today) {
      songg = songs.join(",").trim();
      break;
    }
  }

  loadSpotifyPlaylist(songg); // ✅ CALL HERE
}

function loadSpotifyPlaylist(link) {
  const embed = link.replace(
    "open.spotify.com/",
    "open.spotify.com/embed/"
  );
  document.getElementById("spotifyEmbed").src = embed;
}

loadDailySong();





const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let rockets = [];
let particles = [];
let loopId = null;
let intervalId = null;
let running = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ===== ROCKET ===== */
class Rocket {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.vy = -(Math.random() * 4 + 7);
    this.targetY = Math.random() * canvas.height * 0.4 + 80;
    this.exploded = false;
    this.color = `hsl(${Math.random() * 360},100%,60%)`;
  }

  update() {
    this.y += this.vy;
    this.vy += 0.02; // gravity
    this.drawTrail();

    if (this.y <= this.targetY && !this.exploded) {
      this.exploded = true;
      explode(this.x, this.y, this.color);
    }
  }

  drawTrail() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

/* ===== PARTICLES ===== */
class Particle {
  constructor(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.color = color;
  }

  update() {
    this.vy += 0.05;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.015;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function explode(x, y, color) {
  for (let i = 0; i < 160; i++) {
    particles.push(new Particle(x, y, color));
  }
}

/* ===== ANIMATION LOOP ===== */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  rockets = rockets.filter(r => !r.exploded);
  particles = particles.filter(p => p.alpha > 0);

  rockets.forEach(r => r.update());
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  loopId = requestAnimationFrame(animate);
}

/* ===== PUBLIC CONTROLS ===== */
function startFirework() {
  if (running) return;
  running = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animate();

  intervalId = setInterval(() => {
    rockets.push(new Rocket());
  }, 550);
}

function stopFirework() {
  running = false;

  cancelAnimationFrame(loopId);
  clearInterval(intervalId);

  rockets = [];
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}



// /* ===== AJJ KA SPECIAL (JSON BASED) ===== */

// async function loadSpecial() {
//   const emojiEl = document.getElementById("specialEmoji");
//   const titleEl = document.getElementById("specialTitle");
//   const descEl = document.getElementById("specialDesc");
//   const challengeEl = document.getElementById("specialChallenge");

//   try {
//     const res = await fetch("specials.json", { cache: "no-store" });
//     const data = await res.json();

//     const today = new Date();
//     const key =
//       String(today.getMonth() + 1).padStart(2, "0") +
//       "-" +
//       String(today.getDate()).padStart(2, "0");

//     if (data[key]) {
//       const item = data[key];
//       emojiEl.textContent = item.emoji;
//       titleEl.textContent = item.title;
//       descEl.textContent = item.desc;
//       challengeEl.textContent = "🌟 Challenge: " + item.challenge;
//     } else {
//       emojiEl.textContent = "✨";
//       titleEl.textContent = "Nothing Special Today";
//       descEl.textContent =
//         "Even ordinary days are important. Take care 🤍";
//       challengeEl.textContent = "";
//     }

//   } catch (e) {
//     titleEl.textContent = "Unable to load special";
//     descEl.textContent = "Check your internet or file setup.";
//     challengeEl.textContent = "";
//   }
// }

// loadSpecial();


async function loadSpecialFromJSON() {
  try {
    const res = await fetch("specials.json", { cache: "no-store" });
    if (!res.ok) throw new Error("specials.json not found");

    const data = await res.json();

    const today = new Date();
    const key =
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    const eventEl = document.getElementById("specialEvent");
    const historyEl = document.getElementById("specialHistory");
    const challengeEl = document.getElementById("specialChallenge");

    if (data[key]) {
      const item = data[key];

      eventEl.textContent = item.title;
      historyEl.textContent = item.desc;
      challengeEl.textContent = item.challenge;
    } else {
      eventEl.textContent = "Nothing Special Today ✨";
      historyEl.textContent = "Even ordinary days matter 🤍";
      challengeEl.textContent = "Just be present today.";
    }

  } catch (e) {
    console.error(e);
    document.getElementById("specialEvent").textContent =
      "Failed to load special";
  }
}

// load once
loadSpecialFromJSON();

(function checkDone(){
  const key = "done-" + new Date().toISOString().slice(0,10);

  if (localStorage.getItem(key)) {
    document.querySelector(".done-btn")?.remove();
    document.querySelector(".done-text")?.classList.remove("hidden");
    document.getElementById("reactionBox")?.classList.remove("locked");
  }
})();


/* ===== CARD TOGGLE ===== */
function unlock(card,next){
  card.classList.add("active");
  document.getElementById(next)?.classList.remove("locked");
  celebrate();
}

/* ===== DAILY CHALLENGE DONE ===== */
function markDone(){
  const key = "done-" + new Date().toISOString().slice(0,10);

  localStorage.setItem(key, "true");

  document.querySelector(".done-btn")?.remove();
  document.querySelector(".done-text")?.classList.remove("hidden");
  document.getElementById("reactionBox")?.classList.remove("locked");

  celebrate();
}


/* Load completion state */
(function checkDone() {
  const key = "specialDone-" + new Date().toDateString();
  if (localStorage.getItem(key)) {
    document.querySelector(".done-btn")?.remove();
    document.querySelector(".done-text")?.classList.remove("hidden");
  }
})();

/* ===== REACTIONS ===== */
function react(t){
  localStorage.setItem("react-"+Date(),t);
  if(t==="love")startHearts();
  if(t==="fire")startFirework();
  if(t==="meh")startEmojiRain();
  if(t==="se")stopFirework();
  if(t==="cross")stopEmojiRain();
}


function sendFeeling(type) {
  const now = new Date();
  const date = now.toISOString().slice(0,10);
  const time = now.toTimeString().slice(0,5);

  const entry = { mood: type, date, time };

  const history =
    JSON.parse(localStorage.getItem("moodHistory")) || [];

  history.push(entry);
  localStorage.setItem("moodHistory", JSON.stringify(history));

  updateMoodInsight();

  const map = {
    missing:"🤍 Missing you",
    need:"🫂 Need you",
    thinking:"🌙 Thinking of you",
    proud:"😔 I’m sad",
    grateful:"🌸 Grateful for you",
    naughty:"💋 Feelin Naughtyy"
  };

  const status = document.getElementById("feelingStatus");
  status.textContent = "Mood synced: " + map[type];
  status.classList.remove("hidden");

  startEmojiRain();
  setTimeout(stopEmojiRain, 2000);
}


function handleStreak() {
  const today = new Date().toISOString().slice(0, 10);

  const lastVisit = localStorage.getItem("lastVisit");
  let streak = Number(localStorage.getItem("streak")) || 0;

  if (!lastVisit) {
    streak = 1; // first ever visit
  } 
  else {
    const diffDays =
      (new Date(today) - new Date(lastVisit)) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak += 1; // continued streak
    } 
    else if (diffDays > 1) {
      streak = 1; // streak broken
    }
    // diffDays === 0 → same day → no change
  }

  localStorage.setItem("lastVisit", today);
  localStorage.setItem("streak", streak);

  document.getElementById("streakBox").textContent =
    "🔥 Streak: " + streak + " days";
}

handleStreak();


/* ===== OPEN WHEN LETTERS ===== */
const letters = {
  miss: "I know you’re missing me right now. Just remember — distance doesn’t change what we are. I’m still here, thinking of you 🤍",
  low: "If today feels heavy, it’s okay. You don’t have to be strong all the time. Rest. Breathe. I’m proud of you for still trying.",
  night: "It’s late and your mind won’t slow down. Try to relax your shoulders, take a deep breath, and know you’re not alone tonight 🌙",
  happy: "Seeing you happy makes everything worth it. Hold onto this feeling — you deserve moments like this ☀️"
};

function openLetter(type) {
  const modal = document.getElementById("letterModal");
  const textEl = document.getElementById("letterText");

  textEl.textContent = letters[type] || "This letter is empty.";
  modal.classList.remove("hidden");

  // mark as opened (per day)
  const key = "opened-letter-" + type + "-" + new Date().toISOString().slice(0,10);
  localStorage.setItem(key, "true");

  // gentle effect
  startEmojiRain?.();
  setTimeout(() => stopEmojiRain?.(), 2000);
}

function closeLetter() {
  document.getElementById("letterModal").classList.add("hidden");
}


/* ===== COUNTDOWNS ===== */
(function initCountdowns() {
  // ✏️ EDIT THESE DATES ONLY
  const startedDate = new Date("2025-09-29");   // relationship start
  const lastCallDate = new Date("2026-01-12");  // last call
  const nextPlanDate = new Date("2026-02-14");  // next meet / plan

  const today = new Date();
  today.setHours(0,0,0,0);

  function daysBetween(a, b) {
    return Math.floor((b - a) / (1000 * 60 * 60 * 24));
  }

  document.getElementById("cdStarted").textContent =
    daysBetween(startedDate, today) + " days";

  document.getElementById("cdLastCall").textContent =
    daysBetween(lastCallDate, today) + " days";

  const until = daysBetween(today, nextPlanDate);
  document.getElementById("cdNext").textContent =
    until >= 0 ? until + " days" : "Soon 🤍";
})();




(function growthTimeline(){
  /* ✏️ EDIT THIS DATE ONLY */
  const startDate = new Date("2025-09-29");

  const today = new Date();
  today.setHours(0,0,0,0);

  const daysTogether = Math.floor(
    (today - startDate) / (1000*60*60*24)
  );

  const todayStr = new Date().toISOString().slice(0,10);

  let visits = Number(localStorage.getItem("totalVisits")) || 0;
  const lastVisitDate = localStorage.getItem("lastVisitDate");

  if (lastVisitDate !== todayStr) {
    visits++;
    localStorage.setItem("totalVisits", visits);
    localStorage.setItem("lastVisitDate", todayStr);
  }


  /* STREAK */
 

  /* HARD DAYS */
  if(!localStorage.getItem("hardDays")){
    localStorage.setItem("hardDays", "0");
  }

  const hardDays =
    Number(localStorage.getItem("hardDays"));

  /* UI */
  document.getElementById("gtDays").textContent =
    daysTogether + " days";

  
  document.getElementById("gtVisits").textContent =
    visits;

  document.getElementById("gtHard").textContent =
    hardDays;

  /* MESSAGE */
  const msg = document.getElementById("growthMessage");
  msg.textContent =
    daysTogether > 300
      ? "If we made it this far, we can handle anything 🤍"
      : "We’re still building — and that’s beautiful 🤍";

  /* MONTHLY RECAP */
  const monthKey =
    "recap-" + today.getFullYear() + "-" + today.getMonth();

  let recap =
    JSON.parse(localStorage.getItem(monthKey)) || {
      visits:0,
      hardDays:0
    };

  recap.visits++;
  localStorage.setItem(monthKey, JSON.stringify(recap));

  disableHardDayBtn();

})();

/* ===== HARD DAY BUTTON ===== */
function addHardDay(){
  const today = new Date().toISOString().slice(0,10);
  const lastHardDay = localStorage.getItem("lastHardDay");

  if (lastHardDay === today) return; // already counted today

  let hard = Number(localStorage.getItem("hardDays")) || 0;
  hard++;

  localStorage.setItem("hardDays", hard);
  localStorage.setItem("lastHardDay", today);

  document.getElementById("gtHard").textContent = hard;

  disableHardDayBtn();
}

function disableHardDayBtn(){
  const btn = document.querySelector(".growth-btn");
  if (!btn) return;

  const today = new Date().toISOString().slice(0,10);
  const lastHardDay = localStorage.getItem("lastHardDay");

  if (lastHardDay === today) {
    btn.textContent = "🤍 You stayed strong today";
    btn.disabled = true;
    btn.style.opacity = "0.6";
  }
}

(function milestoneSystem(){
  const startDate = new Date("2025-09-29"); // SAME as growth timeline
  const today = new Date();
  today.setHours(0,0,0,0);

  const daysTogether = Math.floor(
    (today - startDate) / (1000*60*60*24)
  );

  const milestoneDays = 90; // ~3 months
  const completed = Math.floor(daysTogether / milestoneDays);
  const progressDays = daysTogether % milestoneDays;

  const percent = Math.min(
    (progressDays / milestoneDays) * 100,
    100
  );

  document.getElementById("msFill").style.width = percent + "%";
  document.getElementById("msRemaining").textContent =
    milestoneDays - progressDays;

  /* ===== HISTORY ===== */
  let history =
    JSON.parse(localStorage.getItem("milestoneHistory")) || [];

  for(let i=1;i<=completed;i++){
    const label = `Completed ${i*3} months together 🤍`;
    if(!history.includes(label)){
      history.push(label);
    }
  }

  localStorage.setItem(
    "milestoneHistory",
    JSON.stringify(history)
  );

  const list = document.getElementById("milestoneList");
  list.innerHTML = "";

  history.forEach(h=>{
    const li = document.createElement("li");
    li.textContent = "✨ " + h;
    list.appendChild(li);
  });
})();


const startDate = new Date("2025-09-29"); // SAME DATE everywhere
const milestoneDays = 90; // ~3 months

const today = new Date();
today.setHours(0,0,0,0);

const daysTogether = Math.floor(
  (today - startDate) / (1000 * 60 * 60 * 24)
);

const completed = Math.floor(daysTogether / milestoneDays);
const progressDays = daysTogether % milestoneDays;

/* ===== PROGRESS BAR ===== */
document.getElementById("msFill").style.width =
  (progressDays / milestoneDays) * 100 + "%";

document.getElementById("msRemaining").textContent =
  milestoneDays - progressDays;

/* ===== MILESTONE HISTORY (NO STORAGE) ===== */
const list = document.getElementById("milestoneList");
list.innerHTML = "";

for (let i = 1; i <= completed; i++) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + i * milestoneDays);

  const li = document.createElement("li");
  li.style.display = "flex";
  li.style.justifyContent = "space-between";

  li.innerHTML = `
    <span>Completed ${i * 3} months together 🤍</span>
    <span style="opacity:.7;font-size:12px">
      ${d.toDateString()}
    </span>
  `;

  list.appendChild(li);
}




function celebrateFor(seconds = 5) {
  startFirework();
  
  setTimeout(stopFirework, seconds * 1000);
}

