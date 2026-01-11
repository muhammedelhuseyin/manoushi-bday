// ===============================
// NAS-STYLE: Manoushi Birthday Page
// Full script: unlock + countdown + typewriter + copy + confetti + 2nd surprise
// ===============================

// ===== Passwords (normalized forms) =====
const validPasswords = new Set([
  "23/1",
  "23/01",
  "2301"
]);

// ===== DOM =====
const lockScreen = document.getElementById("lockScreen");
const surpriseScreen = document.getElementById("surpriseScreen");
const passInput = document.getElementById("passInput");
const unlockBtn = document.getElementById("unlockBtn");
const errorMsg = document.getElementById("errorMsg");

const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");

const typeText = document.getElementById("typeText");

const confettiBtn = document.getElementById("confettiBtn");
const canvas = document.getElementById("confetti");
const ctx = canvas?.getContext?.("2d");

const copyBtn = document.getElementById("copyBtn");
const copyToast = document.getElementById("copyToast");

// Second surprise
const secondBtn = document.getElementById("secondBtn");
const secondBox = document.getElementById("secondBox");
const closeSecondBtn = document.getElementById("closeSecondBtn");
const secondText = document.getElementById("secondText");
const secondBadge = document.getElementById("secondBadge");
const secondHint = document.getElementById("secondHint");

// Optional sound

// ===== Message (LONG) =====
const message =
  "منوشي 😌
يمكن أنا ما بحكي كتير…
بس لما ألمّح، بكون قاصد 😉

ووصولك لهون يعني إنك عرفتي كلمة السر،
بس السؤال الأهم:
عرفتي ليش أنا عملت كل هالحركات؟ 😏

عملت هالصفحة مو لأنو فاضي،
ولا لأنو بحب البرمجة لهالدرجة…
عملتها لأنو في ناس
وجودهم بيخلّي الواحد يعمل أشياء مو من عادته.

وأنتِ من هالنوع.

ما بعرف إذا بتنتبهي،
بس فيك شي بيشدّ الانتباه بدون ما تعملي شي،
وفيك طاقة بتخلّي الواحد يبتسم غصب عنه.

فـ اليوم عيدك،
وحبيت يكون في شي مختلف،
شي بسيط… بس وراه معنى.

كل سنة وإنتِ بخير 🎂
وإن شاء الله تضلّي
تربكي الناس بلطافتك
وتخلّيهم يفكروا فيك بدون سبب 😌

Happy Birthday 💗;

// ===== Digits normalization (Arabic/Persian -> Latin) =====
function toLatinDigits(str) {
  const map = {
    "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9",
    "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9"
  };
  return str.replace(/[٠-٩۰-۹]/g, (d) => map[d] ?? d);
}

function normalizePass(v){
  return toLatinDigits((v || "").toString())
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-.]/g, "/")  // 23-1 or 23.1 => 23/1
    .toLowerCase();
}

// ===== Countdown target (next birthday) =====
const BDAY_MONTH = 0; // January (0-based)
const BDAY_DAY = 23;

function nextBirthdayDate(monthIndex0, day){
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), monthIndex0, day, 0, 0, 0);
  if (now.getTime() <= thisYear.getTime()) return thisYear;
  return new Date(now.getFullYear() + 1, monthIndex0, day, 0, 0, 0);
}

function birthdayThisYear(monthIndex0, day){
  const now = new Date();
  return new Date(now.getFullYear(), monthIndex0, day, 0, 0, 0);
}

const target = nextBirthdayDate(BDAY_MONTH, BDAY_DAY);
const bdayThisYear = birthdayThisYear(BDAY_MONTH, BDAY_DAY);

// ===== Typewriter =====
let typeIndex = 0;
let typeTimer = null;

function startTypewriter(){
  if (!typeText) return;
  typeText.textContent = "";
  typeIndex = 0;

  if (typeTimer) clearInterval(typeTimer);
  typeTimer = setInterval(() => {
    typeText.textContent = message.slice(0, typeIndex++);
    if (typeIndex > message.length) clearInterval(typeTimer);
  }, 18);
}

// ===== Countdown =====
let countdownTimer = null;

function startCountdown(){
  function tick(){
    const now = new Date();
    const diff = target.getTime() - now.getTime();

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
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(tick, 1000);
}

// ===== Copy (with fallback for mobile Safari) =====
function showToast(text){
  if (!copyToast) return;
  copyToast.textContent = text;
  setTimeout(() => (copyToast.textContent = ""), 2000);
}

async function copyTextSmart(text){
  // Try Clipboard API first (needs HTTPS + user gesture)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {}
  }

  // Fallback: hidden textarea + execCommand
  try{
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }catch(_){
    return false;
  }
}

copyBtn?.addEventListener("click", async () => {
  const ok = await copyTextSmart(message.replaceAll("\n", " "));
  showToast(ok ? "تم النسخ 💌" : "ما قدرت أنسخ 😅 جرّبي ضغطة مطوّلة ونسخ.");
});

// ===== Confetti =====
let W = 0, H = 0;
let particles = [];
let confettiRunning = false;

function resizeCanvas(){
  if (!canvas) return;
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

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

function drawConfetti(){
  if (!confettiRunning || !ctx) return;

  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = 0.9;

  for (const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    if (p.y > H + 30) { p.y = -20; p.x = Math.random() * W; }
    if (p.x < -30) p.x = W + 30;
    if (p.x > W + 30) p.x = -30;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    const hue = (p.x + p.y) % 360;
    ctx.fillStyle = `hsl(${hue}, 90%, 70%)`;
    ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.2);

    ctx.restore();
  }

  requestAnimationFrame(drawConfetti);
}

confettiBtn?.addEventListener("click", () => {
  if (!canvas || !ctx) return;
  makeConfetti();
  confettiRunning = true;
  drawConfetti();

  setTimeout(() => {
    confettiRunning = false;
    ctx.clearRect(0, 0, W, H);
  }, 2600);
});

// ===== Second surprise (opens starting Jan 23 of current year, stays open after) =====
function isSecondOpenAllowed(){
  const now = new Date();
  return now.getTime() >= bdayThisYear.getTime();
}

function setupSecondSurprise(){
  if (!secondBtn) return;

  const allowed = isSecondOpenAllowed();

  if (!allowed){
    secondBtn.disabled = true;
    secondBtn.textContent = "في شي ثاني… بس مو وقته بعد 🎁";
    secondBadge && (secondBadge.textContent = "🔒 مفاجأة ثانية");
    secondHint && (secondHint.textContent = "بتنفتح فقط بتاريخ 23/1 😉");
    secondBox?.classList.add("hidden");
    return;
  }

  secondBtn.disabled = false;
  secondBtn.textContent = "افتحي المفاجأة الثانية 🎁";
  secondBadge && (secondBadge.textContent = "🔓 مفاجأة ثانية");
  secondHint && (secondHint.textContent = "اليوم صار وقتها…");

  if (secondText){
    secondText.textContent =
      "اليوم صار مسموح أقول لك شي صغير…\n\n" +
      "في ناس وجودهم لطيف…\n" +
      "وفي ناس وجودهم يغيّر المزاج.\n\n" +
      "وأنتِ من النوع الثاني 💗\n\n" +
      "كل سنة وانتي بخير يا منوشي 🎂✨";
  }

  // open/close
  secondBtn.addEventListener("click", () => {
    secondBox?.classList.remove("hidden");
  });

  closeSecondBtn?.addEventListener("click", () => {
    secondBox?.classList.add("hidden");
  });
}

// ===== Unlock =====


function unlock(){
  const p = normalizePass(passInput?.value);

  if (!validPasswords.has(p)) {
    if (errorMsg) errorMsg.textContent = "جربي تاريخ ميلادك: 23/1 🎂";
    return;
  }

  if (errorMsg) errorMsg.textContent = "";

  lockScreen?.classList.add("hidden");
  surpriseScreen?.classList.remove("hidden");


  startCountdown();
  startTypewriter();
  setupSecondSurprise();
}

unlockBtn?.addEventListener("click", unlock);
passInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlock();
});

// Extra: make sure tapping input doesn't zoom weirdly on iOS (already input font-size 16)

