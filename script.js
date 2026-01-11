// ===== Password (Birthday) =====
const validPasswords = new Set([
  "23/1", "2301", "23/01"
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

// ===== Typewriter message =====
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
  "وأتمنى سنتك تكون ألطف من كل اللي قبلها ✨\n\n" +
  "— من شخص حابب يشوفك تبتسمي اليوم 🙂";

let typeIndex = 0;
let typeTimer = null;

// ===== تحويل الأرقام العربية والفارسية =====
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
    .replace(/[-.]/g, "/")
    .toLowerCase();
}

// ===== Birthday logic =====
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

const BDAY_MONTH = 0; // January
const BDAY_DAY = 23;

const target = nextBirthdayDate(BDAY_MONTH, BDAY_DAY);
const bdayThisYear = birthdayThisYear(BDAY_MONTH, BDAY_DAY);

// ===== Unlock =====
function unlock(){
  const p = normalizePass(passInput.value);

  if (!validPasswords.has(p)) {
    errorMsg.textContent = "جربي تاريخ ميلادك: 23/1 🎂";
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
  setInterval(tick, 1000);
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

// ===== Second Surprise =====
const secondBtn = document.getElementById("secondBtn");
const secondBox = document.getElementById("secondBox");
const closeSecondBtn = document.getElementById("closeSecondBtn");
const secondText = document.getElementById("secondText");
const secondBadge = document.getElementById("secondBadge");
const secondHint = document.getElementById("secondHint");

function isSecondOpenAllowed(){
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

  secondBtn.disabled = false;
  secondBtn.textContent = "افتحي المفاجأة الثانية 🎁";
  secondBadge.textContent = "🔓 مفاجأة ثانية";
  secondHint.textContent = "اليوم صار وقتها…";

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
