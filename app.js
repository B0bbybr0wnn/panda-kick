import { QUESTIONS } from "./data/questions.js";

const QUESTIONS_PER_GAME = 20;

const state = {
  difficulty: "easy",
  pool: [],
  current: 0,
  score: 0,
  answered: false,
  streak: 0,
  best: "0/20"
};

/* ============================================================
   DOM
   ============================================================ */

const $ = (id) => document.getElementById(id);

const screens = {
  home: $("screen-home"),
  game: $("screen-game"),
  end:  $("screen-end")
};

const el = {
  splash:       $("splash"),
  homeStreak:   $("home-streak"),
  homeBest:     $("home-best"),
  diffBtns:     document.querySelectorAll(".diff-btn"),
  currentDiff:  $("current-diff"),
  diffSwitch:   $("diff-switch"),
  scoreDisplay: $("score-display"),
  qCounter:     $("q-counter"),
  progressFill: $("progress-fill"),
  categoryTag:  $("category-tag"),
  questionText: $("question-text"),
  questionWrap: document.querySelector(".question-wrap"),
  answers:      $("answers"),
  nextBtn:      $("next-btn"),
  finalScore:   $("final-score"),
  endMsg:       $("end-msg"),
  playAgain:    $("play-again"),
  backHome:     $("back-home"),
  confetti:     $("confetti"),
  sfxCorrect:   $("sfx-correct"),
  sfxWrong:     $("sfx-wrong"),
  sfxAmbience:  $("sfx-ambience"),
  sfxWin:       $("sfx-win"),
  sfxTap:       $("sfx-tap"),
  sfxEnter:     $("sfx-enter")
};

/* ============================================================
   SOUND
   ============================================================ */

function play(audio, restart = true) {
  if (!audio) return;
  try {
    if (restart) audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (e) {}
}

function stop(audio) {
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
  } catch (e) {}
}

function startAmbience() {
  if (!el.sfxAmbience) return;
  el.sfxAmbience.volume = 0.18;
  el.sfxAmbience.play().catch(() => {});
}

function stopAmbience() {
  stop(el.sfxAmbience);
}

/* ============================================================
   HAPTIC
   ============================================================ */

function buzz(pattern = 12) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

/* ============================================================
   STORAGE
   ============================================================ */

function loadStats() {
  state.streak = parseInt(localStorage.getItem("pk_streak") || "0", 10);
  state.best   = localStorage.getItem("pk_best") || "0/20";
  el.homeStreak.textContent = state.streak;
  el.homeBest.textContent   = state.best;
}

function saveStats() {
  localStorage.setItem("pk_streak", String(state.streak));
  localStorage.setItem("pk_best", state.best);
}

/* ============================================================
   SCREENS
   ============================================================ */

function showScreen(name) {
  Object.values(screens).forEach(s => {
    s.classList.remove("active");
    s.classList.remove("enter");
  });
  const target = screens[name];
  target.classList.add("active");
  void target.offsetWidth;
  target.classList.add("enter");
}

/* ============================================================
   GAME LOGIC
   ============================================================ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPool(difficulty) {
  const filtered = QUESTIONS.filter(q => q.difficulty === difficulty);
  if (!filtered.length) return [];
  const shuffled = shuffle(filtered);
  while (shuffled.length < QUESTIONS_PER_GAME) {
    shuffled.push(...shuffle(filtered));
  }
  return shuffled.slice(0, QUESTIONS_PER_GAME);
}

function startGame(difficulty) {
  state.difficulty = difficulty;
  state.pool       = buildPool(difficulty);
  state.current    = 0;
  state.score      = 0;
  state.answered   = false;

  el.currentDiff.textContent = difficulty.toUpperCase();
  el.currentDiff.style.background =
    difficulty === "easy" ? "var(--mint)" : "var(--orange)";

  stop(el.sfxEnter);
  startAmbience();
  showScreen("game");
  renderQuestion();
}

function renderQuestion() {
  const q = state.pool[state.current];
  if (!q) return;
  state.answered = false;

  el.scoreDisplay.textContent = state.score;
  el.qCounter.textContent = `${state.current + 1}/${QUESTIONS_PER_GAME}`;
  el.progressFill.style.width = `${(state.current / QUESTIONS_PER_GAME) * 100}%`;

  el.categoryTag.textContent = q.category.toUpperCase();
  el.questionText.textContent = q.question;

  // re-trigger slide animation
  el.questionWrap.classList.remove("slide-in");
  void el.questionWrap.offsetWidth;
  el.questionWrap.classList.add("slide-in");

  el.answers.innerHTML = "";
  const letters = ["A", "B", "C", "D"];
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerHTML = `<span class="answer-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener("click", () => handleAnswer(i, btn));
    el.answers.appendChild(btn);
  });

  el.nextBtn.disabled = true;
  el.nextBtn.textContent =
    state.current === QUESTIONS_PER_GAME - 1 ? "FINISH →" : "NEXT →";
}

function handleAnswer(index, btn) {
  if (state.answered) return;
  state.answered = true;

  buzz(15);
  play(el.sfxTap, false);

  const q = state.pool[state.current];
  const allBtns = el.answers.querySelectorAll(".answer-btn");
  allBtns.forEach(b => b.classList.add("locked"));

  if (index === q.answer) {
    btn.classList.add("correct");
    state.score++;
    el.scoreDisplay.textContent = state.score;
    el.scoreDisplay.classList.remove("pop");
    void el.scoreDisplay.offsetWidth;
    el.scoreDisplay.classList.add("pop");
    play(el.sfxCorrect);
    buzz([15, 30, 15]);
  } else {
    btn.classList.add("wrong");
    allBtns[q.answer].classList.add("correct");
    play(el.sfxWrong);
    buzz([40, 40, 40]);
  }

  el.nextBtn.disabled = false;
}

function nextQuestion() {
  if (state.current >= QUESTIONS_PER_GAME - 1) return endGame();
  state.current++;
  renderQuestion();
}

function endGame() {
  el.progressFill.style.width = "100%";
  const pct = state.score / QUESTIONS_PER_GAME;

  const parts = state.best.split("/");
  const prevBest = parts[0] ? parseInt(parts[0], 10) / parseInt(parts[1], 10) : 0;
  if (pct > prevBest) {
    state.best = `${state.score}/${QUESTIONS_PER_GAME}`;
  }

  if (pct >= 0.6) state.streak++;
  else state.streak = 0;

  saveStats();
  loadStats();

  stopAmbience();
  play(el.sfxWin);
  if (pct >= 0.6) {
    buzz([60, 40, 60, 40, 120]);
    fireConfetti();
  }

  el.finalScore.textContent = `0/${QUESTIONS_PER_GAME}`;
  el.endMsg.textContent = getEndMessage(pct);
  animateScore(0, state.score, QUESTIONS_PER_GAME);

  showScreen("end");
}

function animateScore(from, to, total) {
  const dur = 900;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(from + (to - from) * eased);
    el.finalScore.textContent = `${val}/${total}`;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function getEndMessage(pct) {
  if (pct === 1)  return "Perfect score. Legend. 🐼🔥";
  if (pct >= 0.8) return "Elite football brain. 🏆";
  if (pct >= 0.6) return "Solid. You know your football.";
  if (pct >= 0.4) return "Not bad — keep training.";
  if (pct >= 0.2) return "Rough one. Try again.";
  return "Time to hit the books. 📚";
}

function fireConfetti() {
  const colors = ["#00E0A4", "#7C5CFF", "#FF7A3D", "#F5C542", "#F5F7FA"];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (2 + Math.random() * 2) + "s";
    p.style.animationDelay = (Math.random() * 0.6) + "s";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.confetti.appendChild(p);
    setTimeout(() => p.remove(), 5000);
  }
}

/* ============================================================
   EVENTS
   ============================================================ */

el.diffBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    play(el.sfxTap, false);
    buzz(12);
    startGame(btn.dataset.diff);
  });
});

el.nextBtn.addEventListener("click", () => {
  play(el.sfxTap, false);
  nextQuestion();
});

el.diffSwitch.addEventListener("click", () => {
  state.difficulty = state.difficulty === "easy" ? "pro" : "easy";
  const newPool = buildPool(state.difficulty);
  state.pool = [
    ...state.pool.slice(0, state.current),
    ...newPool.slice(0, QUESTIONS_PER_GAME - state.current)
  ];
  el.currentDiff.textContent = state.difficulty.toUpperCase();
  el.currentDiff.style.background =
    state.difficulty === "easy" ? "var(--mint)" : "var(--orange)";
  play(el.sfxTap, false);
  buzz(20);
  renderQuestion();
});

el.playAgain.addEventListener("click", () => {
  play(el.sfxTap, false);
  startGame(state.difficulty);
});

el.backHome.addEventListener("click", () => {
  play(el.sfxTap, false);
  loadStats();
  showScreen("home");
});

/* ============================================================
   SPLASH + INIT
   ============================================================ */

window.addEventListener("load", () => {
  const splash = el.splash;

  // splash plays enter.mp3
  setTimeout(() => {
    try {
      el.sfxEnter.volume = 0.7;
      el.sfxEnter.play().catch(() => {});
    } catch (e) {}
  }, 100);

  // hide splash after 2.4s
  setTimeout(() => {
    splash.classList.add("hide");
    stop(el.sfxEnter);
    showScreen("home");
  }, 2400);

  loadStats();
});

// register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
                  }
