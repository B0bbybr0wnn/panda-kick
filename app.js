import { QUESTIONS } from "./data/questions.js";

/* ============================================================
   CONFIG
   ============================================================ */

const QUESTIONS_PER_GAME = 20;

/* ============================================================
   STATE
   ============================================================ */

const state = {
  difficulty: "easy",
  pool: [],
  current: 0,
  score: 0,
  answered: false,
  streak: 0,
  best: 0
};

/* ============================================================
   DOM
   ============================================================ */

const $ = (id) => document.getElementById(id);

const screens = {
  home: $("screen-home"),
  game: $("screen-game"),
  end: $("screen-end")
};

const el = {
  // home
  homeStreak:    $("home-streak"),
  homeBest:      $("home-best"),
  diffBtns:      document.querySelectorAll(".diff-btn"),

  // game
  currentDiff:   $("current-diff"),
  diffSwitch:    $("diff-switch"),
  scoreDisplay:  $("score-display"),
  qCounter:      $("q-counter"),
  progressFill:  $("progress-fill"),
  categoryTag:   $("category-tag"),
  questionText:  $("question-text"),
  answers:       $("answers"),
  nextBtn:       $("next-btn"),

  // end
  finalScore:    $("final-score"),
  endMsg:        $("end-msg"),
  playAgain:     $("play-again"),
  backHome:      $("back-home"),

  // sound hooks
  sfxCorrect:    $("sfx-correct"),
  sfxWrong:      $("sfx-wrong"),
  sfxWhistle:    $("sfx-whistle"),
  sfxAmbience:   $("sfx-ambience")
};

/* ============================================================
   STORAGE
   ============================================================ */

function loadStats() {
  const s = parseInt(localStorage.getItem("pk_streak") || "0", 10);
  const b = localStorage.getItem("pk_best") || "0/20";
  state.streak = s;
  state.best = b;
  el.homeStreak.textContent = s;
  el.homeBest.textContent = b;
}

function saveStats() {
  localStorage.setItem("pk_streak", String(state.streak));
  localStorage.setItem("pk_best", state.best);
}

/* ============================================================
   SCREEN CONTROL
   ============================================================ */

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

/* ============================================================
   SOUND (hooks only — files come later)
   ============================================================ */

function playSfx(audioEl) {
  if (!audioEl || !audioEl.src) return;
  try {
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  } catch (e) {}
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
  const shuffled = shuffle(filtered);
  // If fewer than needed, repeat with fresh shuffle
  while (shuffled.length < QUESTIONS_PER_GAME) {
    shuffled.push(...shuffle(filtered));
  }
  return shuffled.slice(0, QUESTIONS_PER_GAME);
}

function startGame(difficulty) {
  state.difficulty = difficulty;
  state.pool = buildPool(difficulty);
  state.current = 0;
  state.score = 0;
  state.answered = false;

  el.currentDiff.textContent = difficulty.toUpperCase();
  el.currentDiff.style.background = difficulty === "easy" ? "var(--mint)" : "var(--orange)";

  showScreen("game");
  renderQuestion();
}

function renderQuestion() {
  const q = state.pool[state.current];
  state.answered = false;

  // Top bar
  el.scoreDisplay.textContent = state.score;
  el.qCounter.textContent = `${state.current + 1}/${QUESTIONS_PER_GAME}`;
  el.progressFill.style.width = `${((state.current) / QUESTIONS_PER_GAME) * 100}%`;

  // Question
  el.categoryTag.textContent = q.category.toUpperCase();
  el.questionText.textContent = q.question;

  // Answers
  el.answers.innerHTML = "";
  const letters = ["A", "B", "C", "D"];
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerHTML = `<span class="answer-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener("click", () => handleAnswer(i, btn));
    el.answers.appendChild(btn);
  });

  // Reset next button
  el.nextBtn.disabled = true;
  el.nextBtn.textContent =
    state.current === QUESTIONS_PER_GAME - 1 ? "FINISH →" : "NEXT →";
}

function handleAnswer(index, btn) {
  if (state.answered) return;
  state.answered = true;

  const q = state.pool[state.current];
  const allBtns = el.answers.querySelectorAll(".answer-btn");

  // Lock all
  allBtns.forEach(b => b.classList.add("locked"));

  if (index === q.answer) {
    btn.classList.add("correct");
    state.score++;
    el.scoreDisplay.textContent = state.score;
    playSfx(el.sfxCorrect);
  } else {
    btn.classList.add("wrong");
    allBtns[q.answer].classList.add("correct");
    playSfx(el.sfxWrong);
  }

  el.nextBtn.disabled = false;
}

function nextQuestion() {
  if (state.current >= QUESTIONS_PER_GAME - 1) {
    endGame();
    return;
  }
  state.current++;
  renderQuestion();
}

function endGame() {
  // Progress bar full
  el.progressFill.style.width = "100%";

  const pct = state.score / QUESTIONS_PER_GAME;

  // Best score (only compare same-scale, so use fraction)
  const [bestNum, bestDen] = state.best.split("/").map(Number);
  if (!bestDen || pct > bestNum / bestDen) {
    state.best = `${state.score}/${QUESTIONS_PER_GAME}`;
  }

  // Streak: win if 60%+ correct
  if (pct >= 0.6) state.streak++;
  else state.streak = 0;

  saveStats();

  // End screen content
  el.finalScore.textContent = `${state.score}/${QUESTIONS_PER_GAME}`;
  el.endMsg.textContent = getEndMessage(pct);

  // Refresh home stats
  loadStats();

  showScreen("end");
}

function getEndMessage(pct) {
  if (pct === 1)     return "Perfect score. Legend. 🐼🔥";
  if (pct >= 0.8)    return "Elite football brain. 🏆";
  if (pct >= 0.6)    return "Solid. You know your football.";
  if (pct >= 0.4)    return "Not bad — keep training.";
  if (pct >= 0.2)    return "Rough one. Try again.";
  return "Time to hit the books. 📚";
}

/* ============================================================
   EVENTS
   ============================================================ */

// Home: difficulty pick
el.diffBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    startGame(btn.dataset.diff);
  });
});

// Game: next
el.nextBtn.addEventListener("click", nextQuestion);

// Game: switch difficulty mid-game
el.diffSwitch.addEventListener("click", () => {
  state.difficulty = state.difficulty === "easy" ? "pro" : "easy";
  const newPool = buildPool(state.difficulty);
  // keep the ones already answered, replace rest
  state.pool = [
    ...state.pool.slice(0, state.current),
    ...newPool.slice(0, QUESTIONS_PER_GAME - state.current)
  ];
  el.currentDiff.textContent = state.difficulty.toUpperCase();
  el.currentDiff.style.background =
    state.difficulty === "easy" ? "var(--mint)" : "var(--orange)";
  // Re-render current question from new pool
  renderQuestion();
});

// End: play again
el.playAgain.addEventListener("click", () => startGame(state.difficulty));

// End: home
el.backHome.addEventListener("click", () => {
  loadStats();
  showScreen("home");
});

/* ============================================================
   INIT
   ============================================================ */

loadStats();
