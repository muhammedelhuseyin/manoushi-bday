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

// ===== Countdown elements =====
const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");

// ===== Typewriter message (LONGER) =====
const typeText = document.getElementById("typeText");
const message =
  "منوشي 💗\n\n" +
  "ما بعرف ليش بعض الناس لما يمرّوا بحياتنا—حتى لو كان كل اللي جمعنا هو شاشة وحديث بسيط—بيتركوا أثر حلو…\n" +
  "مو لأنهم عملوا شي كبير،\n" +
  "بس لأنهم خلّوا اللحظة أخف،\n" +
  "والضحكة أسهل،\n" +
  "والوقت ألطف.\n\n" +
  "الغريب إنو في ناس ما نعرف عنهم كثير…\n" +
  "بس نحس إن وجودهم مريح.\n" +
  "كأنهم موسيقى هادئة بالصدفة،\n" +
  "أو رسالة تيجي بوقت محتاج فيه تبتسم.\n\n" +
  "يمكن هاي الصفحة بسيطة…\n" +
  "بس الفكرة وراها مو بسيطة أبدًا 😉\n" +
  "هي بس طريقة أقول فيها: إنك شخص مميز… حتى بدون ما تحاولي.\n\n" +
  "وإذا يوم من الأيام خطر ببالك: \"ليش في حدا فكّر يعمل هيك شي إلي؟\"\n" +
  "فالإجابة بسيطة:\n" +
  "لأنك بتستاهلي 🤍\n\n" +
  "Happy Birthday, منوشي 🎂💗\n" +
  "سنينك كتار و حلوين  ✨\n\n" +
  "— من شخص حابب يشوفك تبتسمي اليوم 🙂";

let typeIndex = 0;
let typeTimer = null;

// ===== Helpers =====
function normalizePass(v){
  return (v || "")
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function pad2(n){ return String(n).padStart(2, "0"); }

// ===== Birthday logic =====
// Next upcoming birthday for countdown
function nextBirthdayDate(monthIndex0, day){
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), monthIndex0, day, 0, 0, 0);
  if (now.getTime() <= thisYear.getTime()) return thisYear;
  return new Date(now.getFullYear() + 1, monthIndex0, day, 0, 0, 0);
}

// Birthday date for "this year" (used to unlock second surprise after the day starts)
function birthdayThisYear(monthIndex0, day){
  const now = new Date();
  return new Date(now.getFullYear(), monthIndex0, day, 0, 0, 0);
}

const BDAY_MONTH = 0; // Jan (0-based)
const BDAY_DAY = 23;

const target = nextBirthdayDate(BDAY_MONTH, BDAY_DAY);
const bdayThisYear = birthdayThisYear(BDAY_MONTH, BDAY_DAY);

// ===== Unlock flow =====
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
  setupSecondSurprise();
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
  }, 18);
}

// ===== Copy message =====
const copyBtn = document.getElementById("copyBtn");
const copyToast = document.getElementById("copyToast");

copyBtn.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(message.replaceAll("\n", " "));
    copyToast.textContent = "تم النسخ 💌";
    setTimeout(() => (copyToast.textContent = ""), 2000);
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

// ===== Second surprise (opens on Jan 23) =====
const secondBtn = document.getElementById("secondBtn");
const secondBox = document.getElementById("secondBox");
const closeSecondBtn = document.getElementById("closeSecondBtn");
const secondText = document.getElementById("secondText");
const secondBadge = document.getElementById("secondBadge");
const secondHint = document.getElementById("secondHint");

function isSecondOpenAllowed(){
  // Opens starting 00:00 on Jan 23 of the current year, and stays open after that date.
  const now = new Date();
  return now.getTime() >= bdayThisYear.getTime();
}

function setupSecondSurprise(){
  const allowed = isSecondOpenAllowed();

  if (!allowed){
    secondBtn.disabled = true;
    secondBtn.textContent = "في شي ثاني… بس مو وقته بعد 🎁";
    secondBadge.textContent = "🔒 مفاجأة ثانية";
    secondHint.textContent = "بتنفتح فقط بتاريخ 23/1 😉";
    secondBox.classList.add("hidden");
    return;
  }

  // Allowed
  secondBtn.disabled = false;
  secondBtn.textContent = "افتحي المفاجأة الثانية 🎁";
  secondBadge.textContent = "🔓 مفاجأة ثانية";
  secondHint.textContent = "اليوم صار وقتها…";

  // The second surprise text (slightly bolder, still not a direct confession)
  secondText.textContent =
    "اليوم صار مسموح أقول لك شي صغير…\n\n" +
    "في ناس وجودهم لطيف…\n" +
    "وفي ناس وجودهم يغيّر المزاج.\n\n" +
    "وأنتِ من النوع الثاني 💗\n\n" +
    "كل سنة وانتي بخير يا منوشي 🎂✨";

  secondBtn.addEventListener("click", () => {
    secondBox.classList.remove("hidden");
  }, { once: true });

  closeSecondBtn.addEventListener("click", () => {
    secondBox.classList.add("hidden");
  });
}

