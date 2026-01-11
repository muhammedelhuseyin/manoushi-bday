// ===== Password (Birthday) =====
const validPasswords = new Set([
  "23/1", "23-1", "23.1", "23 1",
  "2301", "23/01", "23-01", "23.01"
]);

const lockScreen = document.getElementById("lockScreen");
const surpriseScreen = document.getElementById("surpriseScreen");
const passInput = document.getElementById("passInput");
const unlockBtn = document.getElementById("unlockBtn");
const errorMsg = document.getElementById("errorMsg");

// ===== Countdown target =====
// Current conversation date is Jan 11, 2026 -> next birthday is Jan 23, 2026
const target = new Date(2026, 0, 23, 0, 0, 0); // month is 0-based (0=Jan)

const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");

// ===== Typewriter message =====
const typeText = document.getElementById("typeText");
const message =
  "منوشي 💗\n" +
  "كل سنة وانتي بخير…\n" +
  "كنت بدي هديّة تكون بسيطة بس مختلفة…\n" +
  "يمكن صفحة صغيرة… بس وراها اهتمام كبير 🤍\n" +
  "ان شاء الله أيامك تكون أخف وأحلى من أي سنة قبل ✨";

let typeIndex = 0;
let typeTimer = null;

function normalizePass(v){
  return (v || "")
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function unlock(){
  const p = normalizePass(passInput.value);
  if (!validPasswords.has(p)) {
    errorMsg.textContent = "مو هيك 😅 جرّبي تاريخ ميلادك: 23/1";
    return;
  }

  errorMsg.textContent = "";
  lockScreen.classList.add("hidden");
  surpriseScreen.classList.remove("hidden");

  startCountdown();
  startTypewriter();
}

unlockBtn.addEventListener("click", unlock);
passInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlock();
});

// ===== Countdown =====
let countdownTimer = null;
function startCountdown(){
  function tick(){
    const now = new Date();
    let diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      dEl.textContent = "0";
      hEl.textContent = "0";
      mEl.textContent = "0";
      sEl.textContent = "0";
      return;
    }

    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / (3600 * 24));
    const hours = Math.floor((sec % (3600 * 24)) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = Math.floor(sec % 60);

    dEl.textContent = days;
    hEl.textContent = hours;
    mEl.textContent = mins;
    sEl.textContent = secs;
  }

  tick();
  countdownTimer = setInterval(tick, 1000);
}

// ===== Typewriter =====
function startTypewriter(){
  typeText.textContent = "";
  typeIndex = 0;
  if (typeTimer) clearInterval(typeTimer);

  typeTimer = setInterval(() => {
    typeText.textContent = message.slice(0, typeIndex++);
    if (typeIndex > message.length) clearInterval(typeTimer);
  }, 26);
}

// ===== Copy message =====
const copyBtn = document.getElementById("copyBtn");
const copyToast = document.getElementById("copyToast");

copyBtn.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(message.replaceAll("\n", " "));
    copyToast.textContent = "تم النسخ 💌 ابعتيها لها أو احتفظي فيها 😉";
    setTimeout(() => (copyToast.textContent = ""), 2200);
  }catch{
    copyToast.textContent = "ما قدرت أنسخ 😅 جرّب من جهاز/متصفح ثاني.";
    setTimeout(() => (copyToast.textContent = ""), 2200);
  }
});

// ===== Confetti (simple) =====
const confettiBtn = document.getElementById("confettiBtn");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let W, H;
function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let particles = [];
function makeConfetti(){
  const count = 180;
  particles = Array.from({length: count}, () => ({
    x: Math.random() * W,
    y: -20 - Math.random() * H * 0.2,
    r: 3 + Math.random() * 4,
    vx: -1.8 + Math.random() * 3.6,
    vy: 2 + Math.random() * 5,
    rot: Math.random() * Math.PI,
    vr: -0.15 + Math.random() * 0.3
  }));
}

let confettiRunning = false;
function draw(){
  if (!confettiRunning) return;

  ctx.clearRect(0,0,W,H);
  ctx.globalAlpha = 0.9;

  for (const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    if (p.y > H + 30) {
      p.y = -20;
      p.x = Math.random() * W;
    }
    if (p.x < -30) p.x = W + 30;
    if (p.x > W + 30) p.x = -30;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    // draw little rectangle confetti (color randomized each frame subtly)
    const hue = (p.x + p.y) % 360;
    ctx.fillStyle = `hsl(${hue}, 90%, 70%)`;
    ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.2);

    ctx.restore();
  }

  requestAnimationFrame(draw);
}

confettiBtn.addEventListener("click", () => {
  makeConfetti();
  confettiRunning = true;
  draw();
  setTimeout(() => {
    confettiRunning = false;
    ctx.clearRect(0,0,W,H);
  }, 2600);
});
