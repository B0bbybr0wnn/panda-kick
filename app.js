import { QUESTIONS } from "./data/questions.js";

const QUESTIONS_PER_GAME = 20;
const DAILY_QUESTIONS = 10;

/* ============================================================
   STATE
   ============================================================ */

const state = {
  // profile
  name: "",
  country: "",
  coins: 0,
  games: 0,

  // stats
  streak: 0,
  best: "0/20",
  dailyStreak: 0,
  lastDaily: "",

  // gameplay
  difficulty: "easy",
  category: "all",
  pool: [],
  current: 0,
  score: 0,
  answered: false,
  isDaily: false,

  // settings
  sfxOn: true,
  ambienceOn: true,
  hapticOn: true
};

/* ============================================================
   DOM SHORTCUTS
   ============================================================ */

const $ = (id) => document.getElementById(id);

const screens = {
  onboard:      $("screen-onboard"),
  home:         $("screen-home"),
  profile:      $("screen-profile"),
  category:     $("screen-category"),
  leaderboard:  $("screen-leaderboard"),
  daily:        $("screen-daily"),
  store:        $("screen-store"),
  achievements: $("screen-achievements"),
  friends:      $("screen-friends"),
  settings:     $("screen-settings"),
  premium:      $("screen-premium"),
  game:         $("screen-game"),
  end:          $("screen-end"),
  share:        $("screen-share")
};

const el = {
  splash:        $("splash"),
  // onboarding
  inputName:     $("input-name"),
  inputCountry:  $("input-country"),
  onboard1:      $("onboard-next-1"),
  onboard2:      $("onboard-next-2"),
  onboardSteps:  document.querySelectorAll(".onboard-step"),
  // home
  avatarInitial: $("avatar-initial"),
  avatarBtn:     $("avatar-btn"),
  coinCount:     $("coin-count"),
  homeStreak:    $("home-streak"),
  homeBest:      $("home-best"),
  dailyBtn:      $("daily-btn"),
  leaderboardBtn:$("leaderboard-btn"),
  storeBtn:      $("store-btn"),
  settingsBtn:   $("settings-btn"),
  categoryPickBtn:$("category-pick-btn"),
  diffBtns:      document.querySelectorAll(".diff-btn"),
  // profile
  profileInitial:$("profile-initial"),
  profileName:   $("profile-name"),
  profileCountry:$("profile-country"),
  profileStreak: $("profile-streak"),
  profileBest:   $("profile-best"),
  profileGames:  $("profile-games"),
  profileBack:   $("profile-back"),
  editProfile:   $("edit-profile"),
  // category
  categoryBack:  $("category-back"),
  categoryItems: document.querySelectorAll(".cat-item"),
  // leaderboard
  leaderboardBack:$("leaderboard-back"),
  lbList:        $("lb-list"),
  lbTabs:        document.querySelectorAll(".lb-tab"),
  // daily
  dailyBack:     $("daily-back"),
  dailyStreakNum:$("daily-streak-num"),
  dailyStart:    $("daily-start"),
  dailyDone:     $("daily-done"),
  // store
  storeBack:     $("store-back"),
  storeCoins:    $("store-coins"),
  storeTabs:     document.querySelectorAll(".store-tab"),
  storeList:     $("store-list"),
  // achievements
  achBack:       $("ach-back"),
  // friends
  friendsBack:   $("friends-back"),
  createChallenge:$("create-challenge"),
  friendsLinkBox:$("friends-link-box"),
  challengeLink: $("challenge-link"),
  copyLink:      $("copy-link"),
  // settings
  settingsBack:  $("settings-back"),
  toggleSfx:     $("toggle-sfx"),
  toggleAmb:     $("toggle-amb"),
  toggleHaptic:  $("toggle-haptic"),
  resetProfile:  $("reset-profile"),
  // premium
  premiumBack:   $("premium-back"),
  premiumBuy:    $("premium-buy"),
  premiumRestore:$("premium-restore"),
  // game
  currentDiff:   $("current-diff"),
  diffSwitch:    $("diff-switch"),
  scoreDisplay:  $("score-display"),
  qCounter:      $("q-counter"),
  progressFill:  $("progress-fill"),
  categoryTag:   $("category-tag"),
  questionText:  $("question-text"),
  questionWrap:  document.querySelector(".question-wrap"),
  answers:       $("answers"),
  hintBtn:       $("hint-btn"),
  skipBtn:       $("skip-btn"),
  nextBtn:       $("next-btn"),
  // end
  finalScore:    $("final-score"),
  endMsg:        $("end-msg"),
  endCoins:      $("end-coins"),
  playAgain:     $("play-again"),
  shareBtn:      $("share-btn"),
  backHome:      $("back-home"),
  confetti:      $("confetti"),
  // share
  shareBack:     $("share-back"),
  shareScore:    $("share-score"),
  shareMsg:      $("share-msg"),
  shareName:     $("share-name"),
  shareWhatsapp: $("share-whatsapp"),
  shareTwitter:  $("share-twitter"),
  shareCopy:     $("share-copy"),
  shareImage:    $("share-image"),
  // sounds
  sfxCorrect:    $("sfx-correct"),
  sfxWrong:      $("sfx-wrong"),
  sfxAmbience:   $("sfx-ambience"),
  sfxWin:        $("sfx-win"),
  sfxTap:        $("sfx-tap"),
  sfxEnter:      $("sfx-enter")
};

/* ⬇️ CONTINUE WITH CHUNK 2 ⬇️ */
/* ============================================================
   SOUND
   ============================================================ */

function play(audio, restart = true) {
  if (!audio || !state.sfxOn) return;
  try {
    if (restart) audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (e) {}
}

function stop(audio) {
  if (!audio) return;
  try { audio.pause(); audio.currentTime = 0; } catch (e) {}
}

function startAmbience() {
  if (!state.ambienceOn || !el.sfxAmbience) return;
  el.sfxAmbience.volume = 0.18;
  el.sfxAmbience.play().catch(() => {});
}
function stopAmbience() { stop(el.sfxAmbience); }

/* ============================================================
   HAPTIC
   ============================================================ */

function buzz(pattern = 12) {
  if (!state.hapticOn) return;
  if (navigator.vibrate) navigator.vibrate(pattern);
}

/* ============================================================
   STORAGE
   ============================================================ */

function loadAll() {
  state.name        = localStorage.getItem("pk_name") || "";
  state.country     = localStorage.getItem("pk_country") || "";
  state.coins       = parseInt(localStorage.getItem("pk_coins") || "0", 10);
  state.games       = parseInt(localStorage.getItem("pk_games") || "0", 10);
  state.streak      = parseInt(localStorage.getItem("pk_streak") || "0", 10);
  state.best        = localStorage.getItem("pk_best") || "0/20";
  state.dailyStreak = parseInt(localStorage.getItem("pk_daily_streak") || "0", 10);
  state.lastDaily   = localStorage.getItem("pk_last_daily") || "";
  state.sfxOn       = localStorage.getItem("pk_sfx") !== "off";
  state.ambienceOn  = localStorage.getItem("pk_amb") !== "off";
  state.hapticOn    = localStorage.getItem("pk_haptic") !== "off";
}

function saveAll() {
  localStorage.setItem("pk_name", state.name);
  localStorage.setItem("pk_country", state.country);
  localStorage.setItem("pk_coins", String(state.coins));
  localStorage.setItem("pk_games", String(state.games));
  localStorage.setItem("pk_streak", String(state.streak));
  localStorage.setItem("pk_best", state.best);
  localStorage.setItem("pk_daily_streak", String(state.dailyStreak));
  localStorage.setItem("pk_last_daily", state.lastDaily);
  localStorage.setItem("pk_sfx", state.sfxOn ? "on" : "off");
  localStorage.setItem("pk_amb", state.ambienceOn ? "on" : "off");
  localStorage.setItem("pk_haptic", state.hapticOn ? "on" : "off");
}

function refreshHomeUI() {
  el.homeStreak.textContent = state.streak;
  el.homeBest.textContent   = state.best;
  el.coinCount.textContent  = state.coins;
  el.avatarInitial.textContent = state.name ? state.name[0].toUpperCase() : "?";
  el.profileInitial.textContent = state.name ? state.name[0].toUpperCase() : "?";
  el.profileName.textContent    = state.name || "Player";
  el.profileCountry.textContent = state.country ? "🌍 " + state.country : "🌍 Country";
  el.profileStreak.textContent  = state.streak;
  el.profileBest.textContent    = state.best;
  el.profileGames.textContent   = state.games;
  el.dailyStreakNum.textContent = state.dailyStreak;
  el.storeCoins.textContent     = state.coins;
  el.shareName.textContent      = state.name ? "— " + state.name : "— Player";
}

/* ============================================================
   SCREEN CONTROL
   ============================================================ */

function showScreen(name) {
  Object.values(screens).forEach(s => {
    if (!s) return;
    s.classList.remove("active");
    s.classList.remove("enter");
  });
  const target = screens[name];
  if (!target) return;
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

function buildPool(difficulty, category, count = QUESTIONS_PER_GAME) {
  let filtered = QUESTIONS.filter(q => q.difficulty === difficulty);
  if (category && category !== "all") {
    filtered = filtered.filter(q => q.category === category);
  }
  if (!filtered.length) return [];
  const shuffled = shuffle(filtered);
  while (shuffled.length < count) shuffled.push(...shuffle(filtered));
  return shuffled.slice(0, count);
}

function buildDailyPool() {
  const filtered = QUESTIONS.filter(q => q.difficulty === "pro");
  const shuffled = shuffle(filtered);
  while (shuffled.length < DAILY_QUESTIONS) shuffled.push(...shuffle(filtered));
  return shuffled.slice(0, DAILY_QUESTIONS);
}

/* ⬇️ CONTINUE WITH CHUNK 3 ⬇️ */
function startGame(difficulty, category = "all", isDaily = false) {
  state.difficulty = difficulty;
  state.category   = category;
  state.isDaily    = isDaily;

  const count = isDaily ? DAILY_QUESTIONS : QUESTIONS_PER_GAME;
  state.pool = isDaily
    ? buildDailyPool()
    : buildPool(difficulty, category, count);

  if (!state.pool.length) {
    alert("No questions found for this selection.");
    return;
  }

  state.current  = 0;
  state.score    = 0;
  state.answered = false;

  el.currentDiff.textContent = isDaily ? "DAILY" : difficulty.toUpperCase();
  el.currentDiff.style.background = isDaily
    ? "var(--purple)"
    : (difficulty === "easy" ? "var(--mint)" : "var(--orange)");

  stop(el.sfxEnter);
  startAmbience();
  showScreen("game");
  renderQuestion();
}

function renderQuestion() {
  const q = state.pool[state.current];
  if (!q) return;
  state.answered = false;

  const total = state.isDaily ? DAILY_QUESTIONS : QUESTIONS_PER_GAME;

  el.scoreDisplay.textContent = state.score;
  el.qCounter.textContent = `${state.current + 1}/${total}`;
  el.progressFill.style.width = `${(state.current / total) * 100}%`;

  el.categoryTag.textContent = q.category.toUpperCase();
  el.questionText.textContent = q.question;

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
    state.current === total - 1 ? "FINISH →" : "NEXT →";

  el.hintBtn.disabled = false;
  el.skipBtn.disabled = false;
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
  el.hintBtn.disabled = true;
  el.skipBtn.disabled = true;
}

function nextQuestion() {
  const total = state.isDaily ? DAILY_QUESTIONS : QUESTIONS_PER_GAME;
  if (state.current >= total - 1) return endGame();
  state.current++;
  renderQuestion();
}

function endGame() {
  const total = state.isDaily ? DAILY_QUESTIONS : QUESTIONS_PER_GAME;
  el.progressFill.style.width = "100%";
  const pct = state.score / total;

  // Coins
  let coinsEarned = 10;
  if (pct >= 0.75) coinsEarned = 20;
  if (pct === 1)   coinsEarned = 50;
  if (state.isDaily) coinsEarned += 25;
  state.coins += coinsEarned;

  // Games played
  state.games++;

  // Best (only for normal games)
  if (!state.isDaily) {
    const parts = state.best.split("/");
    const prevBest = parts[0] ? parseInt(parts[0], 10) / parseInt(parts[1], 10) : 0;
    if (pct > prevBest) state.best = `${state.score}/${total}`;
  }

  // Streak
  if (pct >= 0.6) state.streak++; else state.streak = 0;

  // Daily tracking
  if (state.isDaily) {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastDaily !== today) {
      state.dailyStreak++;
      state.lastDaily = today;
    }
  }

  saveAll();
  refreshHomeUI();

  stopAmbience();
  play(el.sfxWin);
  if (pct >= 0.6) {
    buzz([60, 40, 60, 40, 120]);
    fireConfetti();
  }

  el.finalScore.textContent = `0/${total}`;
  el.endMsg.textContent = getEndMessage(pct);
  el.endCoins.textContent = `+${coinsEarned}`;
  animateScore(0, state.score, total);

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

/* ⬇️ CONTINUE WITH CHUNK 4 ⬇️ */
/* ============================================================
   SHARE
   ============================================================ */

function shareText() {
  return `I scored ${el.shareScore.textContent} in Panda Kick football trivia! 🐼⚽\nBeat my score → https://panda-kick.pages.dev`;
}

/* ============================================================
   EVENTS — ONBOARDING
   ============================================================ */

el.onboard1.addEventListener("click", () => {
  const name = el.inputName.value.trim();
  if (name.length < 2) { alert("Please enter a name."); return; }
  state.name = name;
  saveAll();
  el.onboardSteps[0].style.display = "none";
  el.onboardSteps[1].style.display = "flex";
  play(el.sfxTap, false);
  buzz(12);
});

el.onboard2.addEventListener("click", () => {
  const country = el.inputCountry.value;
  if (!country) { alert("Please pick a country."); return; }
  state.country = country;
  saveAll();
  play(el.sfxTap, false);
  buzz(12);
  refreshHomeUI();
  showScreen("home");
  startAmbience();
});

/* ============================================================
   EVENTS — HOME
   ============================================================ */

el.avatarBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  refreshHomeUI();
  showScreen("profile");
});

el.dailyBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastDaily === today) {
    el.dailyStart.style.display = "none";
    el.dailyDone.style.display = "block";
  } else {
    el.dailyStart.style.display = "block";
    el.dailyDone.style.display = "none";
  }
  el.dailyStreakNum.textContent = state.dailyStreak;
  showScreen("daily");
});

el.leaderboardBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  renderLeaderboard();
  showScreen("leaderboard");
});

el.storeBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  showScreen("store");
});

el.settingsBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  showScreen("settings");
});

el.categoryPickBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  showScreen("category");
});

el.diffBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    play(el.sfxTap, false); buzz(12);
    startGame(btn.dataset.diff, state.category, false);
  });
});

/* ============================================================
   EVENTS — PROFILE
   ============================================================ */

el.profileBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.editProfile.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  el.onboardSteps[0].style.display = "flex";
  el.onboardSteps[1].style.display = "none";
  el.inputName.value = state.name;
  el.inputCountry.value = state.country;
  showScreen("onboard");
});

/* ============================================================
   EVENTS — CATEGORY
   ============================================================ */

el.categoryBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.categoryItems.forEach(item => {
  item.addEventListener("click", () => {
    play(el.sfxTap, false); buzz(12);
    state.category = item.dataset.cat;
    el.categoryItems.forEach(i => i.classList.remove("selected"));
    item.classList.add("selected");
    setTimeout(() => showScreen("home"), 200);
  });
});

/* ============================================================
   EVENTS — LEADERBOARD
   ============================================================ */

el.leaderboardBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

function renderLeaderboard() {
  const history = JSON.parse(localStorage.getItem("pk_history") || "[]");
  if (!history.length) {
    el.lbList.innerHTML = `<div class="lb-empty">No scores yet.<br>Play a game to appear here.</div>`;
    return;
  }
  const sorted = [...history].sort((a, b) => b.score - a.score).slice(0, 10);
  el.lbList.innerHTML = "";
  sorted.forEach((entry, i) => {
    const row = document.createElement("div");
    row.className = "lb-row";
    row.innerHTML = `
      <span class="lb-rank ${i < 3 ? 'top' : ''}">#${i + 1}</span>
      <span class="lb-name">${entry.name}</span>
      <span class="lb-score">${entry.score}/${entry.total}</span>
    `;
    el.lbList.appendChild(row);
  });
}

/* ============================================================
   EVENTS — DAILY
   ============================================================ */

el.dailyBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.dailyStart.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  startGame("pro", "all", true);
});

/* ============================================================
   EVENTS — STORE (rewarded ad placeholder)
   ============================================================ */

el.storeBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.storeList.addEventListener("click", (e) => {
  const btn = e.target.closest(".store-btn");
  if (!btn) return;
  const amount = parseInt(btn.dataset.reward || "0", 10);
  if (!amount) return;
  play(el.sfxTap, false); buzz(12);
  // TODO Phase 5: wire real rewarded ad here
  state.coins += amount;
  saveAll();
  refreshHomeUI();
  alert(`+${amount} coins earned!`);
});

/* ============================================================
   EVENTS — ACHIEVEMENTS
   ============================================================ */

el.achBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("profile");
});

/* ============================================================
   EVENTS — FRIENDS
   ============================================================ */

el.friendsBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.createChallenge.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  el.challengeLink.value = `https://panda-kick.pages.dev/?challenge=${code}`;
  el.friendsLinkBox.style.display = "flex";
});

el.copyLink.addEventListener("click", async () => {
  play(el.sfxTap, false); buzz(12);
  try {
    await navigator.clipboard.writeText(el.challengeLink.value);
    alert("Link copied!");
  } catch (e) {
    el.challengeLink.select();
    document.execCommand("copy");
    alert("Link copied!");
  }
});

/* ============================================================
   EVENTS — SETTINGS
   ============================================================ */

el.settingsBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.toggleSfx.checked = state.sfxOn;
el.toggleAmb.checked = state.ambienceOn;
el.toggleHaptic.checked = state.hapticOn;

el.toggleSfx.addEventListener("change", () => {
  state.sfxOn = el.toggleSfx.checked;
  saveAll();
});

el.toggleAmb.addEventListener("change", () => {
  state.ambienceOn = el.toggleAmb.checked;
  saveAll();
  if (state.ambienceOn) startAmbience(); else stopAmbience();
});

el.toggleHaptic.addEventListener("change", () => {
  state.hapticOn = el.toggleHaptic.checked;
  saveAll();
});

el.resetProfile.addEventListener("click", () => {
  if (!confirm("Erase your profile and progress?")) return;
  localStorage.clear();
  location.reload();
});

/* ============================================================
   EVENTS — PREMIUM (placeholder)
   ============================================================ */

el.premiumBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.premiumBuy.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  alert("Premium coming soon. Payment integration in Phase 6.");
});

el.premiumRestore.addEventListener("click", () => {
  play(el.sfxTap, false);
  alert("Restore coming soon.");
});

/* ============================================================
   EVENTS — GAME
   ============================================================ */

el.nextBtn.addEventListener("click", () => {
  play(el.sfxTap, false);
  nextQuestion();
});

el.diffSwitch.addEventListener("click", () => {
  state.difficulty = state.difficulty === "easy" ? "pro" : "easy";
  const total = state.isDaily ? DAILY_QUESTIONS : QUESTIONS_PER_GAME;
  const newPool = buildPool(state.difficulty, state.category, total);
  state.pool = [
    ...state.pool.slice(0, state.current),
    ...newPool.slice(0, total - state.current)
  ];
  el.currentDiff.textContent = state.difficulty.toUpperCase();
  el.currentDiff.style.background =
    state.difficulty === "easy" ? "var(--mint)" : "var(--orange)";
  play(el.sfxTap, false); buzz(20);
  renderQuestion();
});

el.hintBtn.addEventListener("click", () => {
  if (state.answered) return;
  if (state.coins < 30) { alert("Need 30 coins. Earn some in Store or by playing."); return; }
  state.coins -= 30;
  saveAll();
  refreshHomeUI();
  play(el.sfxTap, false); buzz(20);
  const q = state.pool[state.current];
  const buttons = el.answers.querySelectorAll(".answer-btn");
  const wrongIndices = [];
  buttons.forEach((b, i) => { if (i !== q.answer && !b.classList.contains("wrong")) wrongIndices.push(i); });
  if (wrongIndices.length) {
    const pick = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    buttons[pick].classList.add("locked");
    buttons[pick].style.opacity = "0.15";
    buttons[pick].disabled = true;
  }
  el.hintBtn.disabled = true;
});

el.skipBtn.addEventListener("click", () => {
  if (state.answered) return;
  if (state.coins < 50) { alert("Need 50 coins. Earn some in Store or by playing."); return; }
  state.coins -= 50;
  saveAll();
  refreshHomeUI();
  play(el.sfxTap, false); buzz(20);
  state.answered = true;
  nextQuestion();
});

/* ============================================================
   EVENTS — END
   ============================================================ */

el.playAgain.addEventListener("click", () => {
  play(el.sfxTap, false);
  startGame(state.difficulty, state.category, false);
});

el.backHome.addEventListener("click", () => {
  play(el.sfxTap, false);
  refreshHomeUI();
  showScreen("home");
});

el.shareBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  const total = state.isDaily ? DAILY_QUESTIONS : QUESTIONS_PER_GAME;
  el.shareScore.textContent = `${state.score}/${total}`;
  el.shareMsg.textContent = `I scored ${state.score}/${total} in Panda Kick football trivia!`;
  el.shareName.textContent = state.name ? "— " + state.name : "— Player";
  showScreen("share");
});

/* ============================================================
   EVENTS — SHARE
   ============================================================ */

el.shareBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("end");
});

el.shareWhatsapp.addEventListener("click", () => {
  play(el.sfxTap, false);
  window.open("https://wa.me/?text=" + encodeURIComponent(shareText()), "_blank");
});

el.shareTwitter.addEventListener("click", () => {
  play(el.sfxTap, false);
  window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText()), "_blank");
});

el.shareCopy.addEventListener("click", async () => {
  play(el.sfxTap, false);
  try {
    await navigator.clipboard.writeText(shareText());
    alert("Copied!");
  } catch (e) {
    alert("Copy failed — long press to copy manually.");
  }
});

el.shareImage.addEventListener("click", () => {
  play(el.sfxTap, false);
  alert("Screenshot the card above and share it!");
});

/* ============================================================
   HISTORY (for leaderboard)
   ============================================================ */

const originalEndGame = endGame;
endGame = function() {
  originalEndGame.apply(this, arguments);
  const total = state.isDaily ? DAILY_QUESTIONS : QUESTIONS_PER_GAME;
  const history = JSON.parse(localStorage.getItem("pk_history") || "[]");
  history.push({
    name: state.name || "Player",
    score: state.score,
    total,
    date: Date.now()
  });
  localStorage.setItem("pk_history", JSON.stringify(history.slice(-50)));
};

/* ============================================================
   SPLASH + INIT
   ============================================================ */

window.addEventListener("load", () => {
  loadAll();

  setTimeout(() => {
    try {
      el.sfxEnter.volume = 0.7;
      el.sfxEnter.play().catch(() => {});
    } catch (e) {}
  }, 100);

  setTimeout(() => {
    el.splash.classList.add("hide");
    stop(el.sfxEnter);
    refreshHomeUI();

    if (!state.name || !state.country) {
      showScreen("onboard");
    } else {
      showScreen("home");
      startAmbience();
    }
  }, 2400);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
       }
