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
  avatar: "default",
  photo: "",
  premium: false,

  // stats
  streak: 0,
  best: "0/20",
  dailyStreak: 0,
  lastDaily: "",
  achievements: [],

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
  hapticOn: true,

  // nav history for hardware back button
  history: ["home"]
};

/* ============================================================
   DOM
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
  coinshop:     $("screen-coinshop"),
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
  nameHint:      $("name-hint"),
  // home
  avatarInitial: $("avatar-initial"),
  avatarBtn:     $("avatar-btn"),
  coinCount:     $("coin-count"),
  coinBtn:       $("coin-btn"),
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
  profileAvatar: $("profile-avatar"),
  profileName:   $("profile-name"),
  profileCountry:$("profile-country"),
  profileStreak: $("profile-streak"),
  profileBest:   $("profile-best"),
  profileGames:  $("profile-games"),
  profilePremiumBadge: $("profile-premium-badge"),
  profileBack:   $("profile-back"),
  editProfile:   $("edit-profile"),
  achievementsBtn:$("achievements-btn"),
  friendsBtn:    $("friends-btn"),
  premiumBtnProfile:$("premium-btn-profile"),
  // category
  categoryBack:  $("category-back"),
  categoryItems: document.querySelectorAll(".cat-item"),
  // leaderboard
  leaderboardBack:$("leaderboard-back"),
  lbList:        $("lb-list"),
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
  // coin shop
  coinshopBack:  $("coinshop-back"),
  coinshopBalance:$("coinshop-balance"),
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
  gameCoins:     $("game-coins"),
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
  // ad overlay
  adOverlay:     $("ad-overlay"),
  adCountdown:   $("ad-countdown"),
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
  state.name         = localStorage.getItem("pk_name") || "";
  state.country      = localStorage.getItem("pk_country") || "";
  state.coins        = parseInt(localStorage.getItem("pk_coins") || "0", 10);
  state.games        = parseInt(localStorage.getItem("pk_games") || "0", 10);
  state.avatar       = localStorage.getItem("pk_avatar") || "default";
  state.photo        = localStorage.getItem("pk_photo") || "";
  state.premium      = localStorage.getItem("pk_premium") === "on";
  state.streak       = parseInt(localStorage.getItem("pk_streak") || "0", 10);
  state.best         = localStorage.getItem("pk_best") || "0/20";
  state.dailyStreak  = parseInt(localStorage.getItem("pk_daily_streak") || "0", 10);
  state.lastDaily    = localStorage.getItem("pk_last_daily") || "";
  state.achievements = JSON.parse(localStorage.getItem("pk_achievements") || "[]");
  state.sfxOn        = localStorage.getItem("pk_sfx") !== "off";
  state.ambienceOn   = localStorage.getItem("pk_amb") !== "off";
  state.hapticOn     = localStorage.getItem("pk_haptic") !== "off";
}

function saveAll() {
  localStorage.setItem("pk_name", state.name);
  localStorage.setItem("pk_country", state.country);
  localStorage.setItem("pk_coins", String(state.coins));
  localStorage.setItem("pk_games", String(state.games));
  localStorage.setItem("pk_avatar", state.avatar);
  localStorage.setItem("pk_photo", state.photo);
  localStorage.setItem("pk_premium", state.premium ? "on" : "off");
  localStorage.setItem("pk_streak", String(state.streak));
  localStorage.setItem("pk_best", state.best);
  localStorage.setItem("pk_daily_streak", String(state.dailyStreak));
  localStorage.setItem("pk_last_daily", state.lastDaily);
  localStorage.setItem("pk_achievements", JSON.stringify(state.achievements));
  localStorage.setItem("pk_sfx", state.sfxOn ? "on" : "off");
  localStorage.setItem("pk_amb", state.ambienceOn ? "on" : "off");
  localStorage.setItem("pk_haptic", state.hapticOn ? "on" : "off");
}

/* ============================================================
   UI REFRESH
   ============================================================ */

function refreshHomeUI() {
  el.homeStreak.textContent     = state.streak;
  el.homeBest.textContent       = state.best;
  el.coinCount.textContent      = state.coins;
  el.gameCoins.textContent      = state.coins;
  el.storeCoins.textContent     = state.coins;
  el.coinshopBalance.textContent= state.coins;

  // avatar
  const initial = state.name ? state.name[0].toUpperCase() : "?";
  el.avatarInitial.textContent = initial;
  el.profileInitial.textContent = initial;

  // photo override
  if (state.photo) {
    el.avatarBtn.style.backgroundImage = `url(${state.photo})`;
    el.avatarBtn.classList.add("has-photo");
    el.avatarInitial.textContent = "";
    el.profileAvatar.style.backgroundImage = `url(${state.photo})`;
    el.profileAvatar.classList.add("has-photo");
    el.profileInitial.textContent = "";
  } else {
    el.avatarBtn.style.backgroundImage = "";
    el.avatarBtn.classList.remove("has-photo");
    el.profileAvatar.style.backgroundImage = "";
    el.profileAvatar.classList.remove("has-photo");
  }

  el.profileName.textContent   = state.name || "Player";
  el.profileCountry.textContent= state.country ? "🌍 " + state.country : "🌍 Country";
  el.profileStreak.textContent = state.streak;
  el.profileBest.textContent   = state.best;
  el.profileGames.textContent  = state.games;
  el.dailyStreakNum.textContent= state.dailyStreak;
  el.shareName.textContent     = state.name ? "— " + state.name : "— Player";

  el.profilePremiumBadge.style.display = state.premium ? "flex" : "none";
}

/* ============================================================
   SCREEN CONTROL
   ============================================================ */

function showScreen(name, push = true) {
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

  if (push && state.history[state.history.length - 1] !== name) {
    state.history.push(name);
  }
}

/* ============================================================
   HARDWARE BACK BUTTON
   ============================================================ */

function goBack() {
  // pop current
  state.history.pop();
  const prev = state.history[state.history.length - 1] || "home";
  showScreen(prev, false);
  play(el.sfxTap, false);
}

window.addEventListener("popstate", () => goBack());
history.pushState({}, ""); // enables popstate

/* ⬇️ CONTINUE WITH CHUNK 3 ⬇️ */
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
  play(el.sfxEnter);
  startAmbience();
  refreshHomeUI();
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
  el.gameCoins.textContent = state.coins;

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

  // Coins earned
  let coinsEarned = 10;
  if (pct >= 0.75) coinsEarned = 20;
  if (pct === 1)   coinsEarned = 50;
  if (state.isDaily) coinsEarned += 25;
  state.coins += coinsEarned;

  // Games
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

  // Achievements
  checkAchievements(pct);

  // Save history
  const history = JSON.parse(localStorage.getItem("pk_history") || "[]");
  history.push({
    name: state.name || "Player",
    score: state.score,
    total,
    date: Date.now()
  });
  localStorage.setItem("pk_history", JSON.stringify(history.slice(-100)));

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
  const colors = ["#00FFB2", "#3B82F6", "#7C5CFF", "#FFD84D", "#FF6B35", "#F5F7FA"];
  for (let i = 0; i < 80; i++) {
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
   ACHIEVEMENTS
   ============================================================ */

function unlockAch(id) {
  if (state.achievements.includes(id)) return;
  state.achievements.push(id);
  saveAll();
  renderAchievements();
}

function checkAchievements(pct) {
  if (pct >= 0.6) unlockAch("first-win");
  if (pct === 1)  unlockAch("perfect");
  if (state.streak >= 7) unlockAch("streak-7");
  if (state.coins >= 1000) unlockAch("coin-master");
  if (state.dailyStreak >= 7) unlockAch("daily-7");
}

function renderAchievements() {
  document.querySelectorAll(".ach-item").forEach(item => {
    const id = item.dataset.ach;
    if (state.achievements.includes(id)) {
      item.classList.remove("locked");
      item.classList.add("unlocked");
    } else {
      item.classList.add("locked");
      item.classList.remove("unlocked");
    }
  });
}

/* ⬇️ CONTINUE WITH CHUNK 4 ⬇️ */
/* ============================================================
   STORE — RENDER
   ============================================================ */

function renderStore(tab = "coins") {
  el.storeList.innerHTML = "";

  if (tab === "coins") {
    el.storeList.innerHTML = `
      <div class="store-item">
        <div class="store-icon">💰</div>
        <div class="store-info">
          <div class="store-name">+100 Coins</div>
          <div class="store-sub">Watch a short ad</div>
        </div>
        <button class="store-btn" data-reward="100">FREE</button>
      </div>
      <div class="store-item">
        <div class="store-icon">💰💰</div>
        <div class="store-info">
          <div class="store-name">+500 Coins</div>
          <div class="store-sub">Watch a longer ad</div>
        </div>
        <button class="store-btn" data-reward="500">FREE</button>
      </div>
    `;
    return;
  }

  if (tab === "avatars") {
    const avatars = [
      { id: "default", name: "Initial", free: true },
      { id: "ball", name: "Ball", free: true },
      { id: "trophy", name: "Trophy", free: false, price: 200 },
      { id: "crown", name: "Crown", free: false, price: 300 },
      { id: "bolt", name: "Bolt", free: false, price: 300 },
      { id: "panda", name: "Panda", free: false, price: 500 },
      { id: "whistle", name: "Whistle", free: false, price: 400 },
      { id: "stadium", name: "Stadium", free: false, price: 600 },
      { id: "premium", name: "Premium", free: false, price: 1000, premiumOnly: true }
    ];

    const grid = document.createElement("div");
    grid.className = "avatar-grid";

    avatars.forEach(a => {
      const cell = document.createElement("div");
      cell.className = "avatar-cell";
      if (state.avatar === a.id) cell.classList.add("selected");
      const unlocked = state.achievements.includes("avatar-" + a.id) || a.free;

      if (!unlocked) cell.classList.add("locked");

      cell.innerHTML = avatarSVG(a.id);

      cell.addEventListener("click", () => {
        if (!unlocked) {
          if (a.premiumOnly && !state.premium) {
            alert("Premium only. Go Premium to unlock.");
            showScreen("premium");
            return;
          }
          if (state.coins < a.price) {
            alert(`Need ${a.price} coins.`);
            return;
          }
          state.coins -= a.price;
          state.achievements.push("avatar-" + a.id);
          state.avatar = a.id;
          saveAll();
          refreshHomeUI();
          renderStore("avatars");
          buzz(20);
          play(el.sfxCorrect);
          alert("Unlocked!");
        } else {
          state.avatar = a.id;
          state.photo = "";
          saveAll();
          refreshHomeUI();
          renderStore("avatars");
          buzz(15);
          play(el.sfxTap, false);
        }
      });

      grid.appendChild(cell);
    });

    el.storeList.appendChild(grid);
    return;
  }

  if (tab === "packs") {
    const packs = [
      { name: "World Cup Legends", sub: "100 hard questions", price: 500, icon: "🏆" },
      { name: "African Football Deep", sub: "AFCON + clubs + players", price: 500, icon: "🌍" },
      { name: "Retro 90s Pack", sub: "Football from the 90s", price: 400, icon: "📼" },
      { name: "Champions League Elite", sub: "100 UCL questions", price: 600, icon: "⭐" }
    ];
    packs.forEach(p => {
      const item = document.createElement("div");
      item.className = "store-item locked";
      item.innerHTML = `
        <div class="store-icon">${p.icon}</div>
        <div class="store-info">
          <div class="store-name">${p.name}</div>
          <div class="store-sub">${p.sub}</div>
        </div>
        <button class="store-btn locked">SOON</button>
      `;
      el.storeList.appendChild(item);
    });
    return;
  }
}

/* ============================================================
   AVATAR SVG ICONS
   ============================================================ */

function avatarSVG(id) {
  const stroke = "#00FFB2";
  const fill = "none";
  const s = `stroke="${stroke}" stroke-width="2" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"`;

  const icons = {
    default: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" ${s}/><text x="50" y="60" text-anchor="middle" fill="${stroke}" font-size="30" font-weight="900" font-family="sans-serif">?</text></svg>`,
    ball: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" ${s}/><path d="M50 30 L65 42 L60 62 L40 62 L35 42 Z M50 30 L50 18 M65 42 L80 38 M60 62 L72 76 M40 62 L28 76 M35 42 L20 38" ${s}/></svg>`,
    trophy: `<svg viewBox="0 0 100 100"><path d="M30 25 L70 25 L70 45 Q70 60 50 60 Q30 60 30 45 Z M30 30 L20 30 Q15 30 15 40 Q15 50 30 50 M70 30 L80 30 Q85 30 85 40 Q85 50 70 50 M40 60 L40 70 L60 70 L60 60 M35 70 L65 70 M45 70 L45 82 L55 82 L55 70" ${s}/></svg>`,
    crown: `<svg viewBox="0 0 100 100"><path d="M25 75 L25 45 L40 60 L50 35 L60 60 L75 45 L75 75 Z M25 75 L75 75" ${s}/><circle cx="25" cy="42" r="3" ${s}/><circle cx="50" cy="32" r="3" ${s}/><circle cx="75" cy="42" r="3" ${s}/></svg>`,
    bolt: `<svg viewBox="0 0 100 100"><path d="M55 15 L30 55 L48 55 L45 85 L70 45 L52 45 Z" ${s}/></svg>`,
    panda: `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="30" ${s}/><circle cx="30" cy="30" r="10" ${s}/><circle cx="70" cy="30" r="10" ${s}/><circle cx="42" cy="50" r="5" fill="${stroke}"/><circle cx="58" cy="50" r="5" fill="${stroke}"/><path d="M45 65 Q50 70 55 65" ${s}/></svg>`,
    whistle: `<svg viewBox="0 0 100 100"><circle cx="35" cy="60" r="18" ${s}/><path d="M50 55 L85 45 Q90 45 90 52 L90 60 L50 68" ${s}/><circle cx="35" cy="60" r="5" fill="${stroke}"/></svg>`,
    stadium: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="40" ry="18" ${s}/><path d="M10 55 L10 45 M90 55 L90 45 M20 50 L20 40 M80 50 L80 40 M35 46 L35 36 M65 46 L65 36 M50 44 L50 34" ${s}/></svg>`,
    premium: `<svg viewBox="0 0 100 100"><path d="M50 20 L62 45 L90 45 L68 62 L76 90 L50 72 L24 90 L32 62 L10 45 L38 45 Z" fill="${stroke}"/></svg>`
  };

  return icons[id] || icons.default;
}

/* ============================================================
   AD SIMULATION (placeholder for real AdMob later)
   ============================================================ */

function watchAd(duration, onComplete) {
  el.adOverlay.style.display = "flex";
  let remaining = duration;
  el.adCountdown.textContent = remaining;

  const interval = setInterval(() => {
    remaining--;
    el.adCountdown.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(interval);
      el.adOverlay.style.display = "none";
      onComplete();
    }
  }, 1000);
}

/* ============================================================
   EVENTS — ONBOARDING
   ============================================================ */

el.onboard1.addEventListener("click", () => {
  const name = el.inputName.value.trim();
  if (name.length < 2) {
    el.nameHint.textContent = "At least 2 characters.";
    return;
  }
  const existing = JSON.parse(localStorage.getItem("pk_names") || "[]");
  if (existing.includes(name.toLowerCase()) && name.toLowerCase() !== state.name.toLowerCase()) {
    el.nameHint.textContent = "Name taken. Try another.";
    return;
  }
  el.nameHint.textContent = "";
  state.name = name;
  existing.push(name.toLowerCase());
  localStorage.setItem("pk_names", JSON.stringify(existing));
  saveAll();
  el.onboardSteps[0].style.display = "none";
  el.onboardSteps[1].style.display = "flex";
  play(el.sfxTap, false);
  buzz(12);
});

el.onboard2.addEventListener("click", () => {
  const country = el.inputCountry.value;
  if (!country) { alert("Pick a country."); return; }
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
  renderAchievements();
  showScreen("profile");
});

el.coinBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  el.coinBtn.classList.add("flip");
  setTimeout(() => el.coinBtn.classList.remove("flip"), 600);
  refreshHomeUI();
  showScreen("coinshop");
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
  renderStore("coins");
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
   EVENTS — COIN SHOP
   ============================================================ */

el.coinshopBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

document.querySelectorAll(".coinshop-item").forEach(item => {
  item.querySelector(".store-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    const reward = parseInt(item.dataset.reward, 10);
    const adTime = parseInt(item.dataset.ad, 10);
    play(el.sfxTap, false); buzz(12);
    watchAd(adTime, () => {
      state.coins += reward;
      saveAll();
      refreshHomeUI();
      play(el.sfxCorrect);
      buzz([20, 40, 20]);
      alert(`+${reward} coins!`);
    });
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

el.achievementsBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  renderAchievements();
  showScreen("achievements");
});

el.friendsBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  showScreen("friends");
});

el.premiumBtnProfile.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  showScreen("premium");
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
  const sorted = [...history].sort((a, b) => (b.score / b.total) - (a.score / a.total)).slice(0, 10);
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
   EVENTS — STORE
   ============================================================ */

el.storeBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.storeTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    el.storeTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderStore(tab.dataset.store);
    play(el.sfxTap, false);
  });
});

el.storeList.addEventListener("click", (e) => {
  const btn = e.target.closest(".store-btn");
  if (!btn || btn.classList.contains("locked")) return;
  const amount = parseInt(btn.dataset.reward || "0", 10);
  if (!amount) return;
  play(el.sfxTap, false); buzz(12);
  watchAd(5, () => {
    state.coins += amount;
    saveAll();
    refreshHomeUI();
    play(el.sfxCorrect);
    alert(`+${amount} coins!`);
  });
});

/* ============================================================
   EVENTS — ACHIEVEMENTS / FRIENDS
   ============================================================ */

el.achBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("profile");
});

el.friendsBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("profile");
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
    alert("Copied!");
  } catch (e) {
    el.challengeLink.select();
    document.execCommand("copy");
    alert("Copied!");
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
   EVENTS — PREMIUM
   ============================================================ */

el.premiumBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.premiumBuy.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(20);
  // Placeholder unlock for testing
  state.premium = true;
  state.coins += 500;
  saveAll();
  refreshHomeUI();
  play(el.sfxCorrect);
  alert("Premium unlocked! +500 coins bonus. Real payment in Phase 6.");
  showScreen("profile");
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
  if (state.coins < 30) { alert("Need 30 coins. Get some in the coin shop."); return; }
  state.coins -= 30;
  saveAll();
  refreshHomeUI();
  play(el.sfxTap, false); buzz(20);
  const q = state.pool[state.current];
  const buttons = el.answers.querySelectorAll(".answer-btn");
  const wrongIndices = [];
  buttons.forEach((b, i) => {
    if (i !== q.answer && !b.disabled) wrongIndices.push(i);
  });
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
  if (state.coins < 50) { alert("Need 50 coins. Get some in the coin shop."); return; }
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
  stop(el.sfxWin);
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

function shareText() {
  return `I scored ${el.shareScore.textContent} in Panda Kick football trivia! 🐼⚽\nBeat my score → https://panda-kick.pages.dev`;
}

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
   SPLASH + INIT
   ============================================================ */

window.addEventListener("load", () => {
  loadAll();

  // enter sound plays ~1s after app launch
  setTimeout(() => {
    try {
      el.sfxEnter.volume = 0.7;
      el.sfxEnter.play().catch(() => {});
    } catch (e) {}
  }, 1000);

  // splash hides after 4s
  setTimeout(() => {
    el.splash.classList.add("hide");
    stop(el.sfxEnter);
    refreshHomeUI();
    renderAchievements();

    if (!state.name || !state.country) {
      showScreen("onboard");
    } else {
      showScreen("home");
      startAmbience();
    }
  }, 4000);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
       }
