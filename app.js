import { QUESTIONS } from "./data/questions.js";
import { AVATARS, FREE_AVATARS, PREMIUM_AVATARS, ALL_AVATARS } from "./icons.js";

const WORKER_URL = "https://panda-kick-api.bobbyjohon8585.workers.dev";
const QUESTIONS_PER_GAME = 20;
const DAILY_QUESTIONS = 10;

const state = {
  // auth
  userId: null,
  username: "",
  loggedIn: false,

  // profile
  name: "",
  country: "",
  coins: 100,
  games: 0,
  avatar: "ball",
  photo: "",
  premium: false,

  // stats
  streak: 0,
  best: "0/20",
  dailyStreak: 0,
  lastDaily: "",
  achievements: [],
  unlockedAvatars: ["ball", "trophy", "boot", "whistle", "stadium", "jersey", "gloves", "net", "card", "shield"],

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

  // nav
  history: ["home"]
};

const $ = (id) => document.getElementById(id);

const screens = {
  onboard:          $("screen-onboard"),
  signup:           $("screen-signup"),
  signin:           $("screen-signin"),
  home:             $("screen-home"),
  profile:          $("screen-profile"),
  settingsProfile:  $("screen-settings-profile"),
  category:         $("screen-category"),
  leaderboard:      $("screen-leaderboard"),
  daily:            $("screen-daily"),
  store:            $("screen-store"),
  coinshop:         $("screen-coinshop"),
  achievements:     $("screen-achievements"),
  trophies:         $("screen-trophies"),
  notifications:    $("screen-notifications"),
  friends:          $("screen-friends"),
  settings:         $("screen-settings"),
  premium:          $("screen-premium"),
  game:             $("screen-game"),
  end:              $("screen-end"),
  share:            $("screen-share")
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

  // signup
  signupUsername:$("signup-username"),
  signupPin:     $("signup-pin"),
  signupCountry: $("signup-country"),
  signupHint:    $("signup-hint"),
  signupBtn:     $("signup-btn"),
  gotoLogin:     $("goto-login"),

  // signin
  signinUsername:$("signin-username"),
  signinPin:     $("signin-pin"),
  signinHint:    $("signin-hint"),
  signinBtn:     $("signin-btn"),
  gotoSignup:    $("goto-signup"),

  // home
  bellBtn:       $("bell-btn"),
  bellBadge:     $("bell-badge"),
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
  trophyBtn:     $("trophy-btn"),
  friendsBtn:    $("friends-btn"),
  premiumBtnProfile:$("premium-btn-profile"),

  // settings-profile
  settingsProfileBack:$("settings-profile-back"),
  avatarGrid:    $("avatar-grid"),
  avatarCount:   $("avatar-count"),
  settingsName:  $("settings-name"),
  settingsCountry:$("settings-country"),
  saveProfileBtn:$("save-profile-btn"),
  cancelProfileBtn:$("cancel-profile-btn"),
  uploadPhotoBtn:$("upload-photo-btn"),
  photoInput:    $("photo-input"),
  photoHint:     $("photo-hint"),

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

  // coinshop
  coinshopBack:  $("coinshop-back"),
  coinshopBalance:$("coinshop-balance"),

  // achievements
  achBack:       $("ach-back"),

  // trophies
  trophiesBack:  $("trophies-back"),
  trophyAchGrid: $("trophy-ach-grid"),
  trophyMileGrid:$("trophy-mile-grid"),

  // notifications
  notifBack:     $("notif-back"),
  notifPanel:    $("notif-panel"),

  // friends
  friendsBack:   $("friends-back"),
  friendTabs:    document.querySelectorAll(".friend-tab"),
  ftabList:      $("ftab-list"),
  ftabRequests:  $("ftab-requests"),
  ftabAdd:       $("ftab-add"),
  friendList:    $("friend-list"),
  friendRequests:$("friend-requests"),
  addFriendInput:$("add-friend-input"),
  addFriendBtn:  $("add-friend-btn"),
  addFriendHint: $("add-friend-hint"),

  // settings
  settingsBack:  $("settings-back"),
  toggleSfx:     $("toggle-sfx"),
  toggleAmb:     $("toggle-amb"),
  toggleHaptic:  $("toggle-haptic"),
  signoutBtn:    $("signout-btn"),
  resetProfile:  $("reset-profile"),

  // premium
  premiumBack:   $("premium-back"),
  premiumBuy:    $("premium-buy"),
  premiumRestore:$("premium-restore"),

  // game
  currentDiff:   $("current-diff"),
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

  // ad
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

function playOnce(audio, maxSeconds) {
  if (!audio || !state.sfxOn) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    if (maxSeconds) {
      const stopAt = setTimeout(() => {
        try { audio.pause(); audio.currentTime = 0; } catch (e) {}
      }, maxSeconds * 1000);
      audio.addEventListener("ended", () => clearTimeout(stopAt), { once: true });
    }
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
  state.userId           = parseInt(localStorage.getItem("pk_user_id") || "0", 10) || null;
  state.username         = localStorage.getItem("pk_username") || "";
  state.loggedIn         = localStorage.getItem("pk_logged_in") === "on";
  state.name             = localStorage.getItem("pk_name") || "";
  state.country          = localStorage.getItem("pk_country") || "";
  state.coins            = parseInt(localStorage.getItem("pk_coins") || "100", 10);
  state.games            = parseInt(localStorage.getItem("pk_games") || "0", 10);
  state.avatar           = localStorage.getItem("pk_avatar") || "ball";
  state.photo            = localStorage.getItem("pk_photo") || "";
  state.premium          = localStorage.getItem("pk_premium") === "on";
  state.streak           = parseInt(localStorage.getItem("pk_streak") || "0", 10);
  state.best             = localStorage.getItem("pk_best") || "0/20";
  state.dailyStreak      = parseInt(localStorage.getItem("pk_daily_streak") || "0", 10);
  state.lastDaily        = localStorage.getItem("pk_last_daily") || "";
  state.achievements     = JSON.parse(localStorage.getItem("pk_achievements") || "[]");
  state.unlockedAvatars  = JSON.parse(localStorage.getItem("pk_avatars") || JSON.stringify(["ball","trophy","boot","whistle","stadium","jersey","gloves","net","card","shield"]));
  state.sfxOn            = localStorage.getItem("pk_sfx") !== "off";
  state.ambienceOn       = localStorage.getItem("pk_amb") !== "off";
  state.hapticOn         = localStorage.getItem("pk_haptic") !== "off";
}

function saveAll() {
  localStorage.setItem("pk_user_id", String(state.userId || ""));
  localStorage.setItem("pk_username", state.username);
  localStorage.setItem("pk_logged_in", state.loggedIn ? "on" : "off");
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
  localStorage.setItem("pk_avatars", JSON.stringify(state.unlockedAvatars));
  localStorage.setItem("pk_sfx", state.sfxOn ? "on" : "off");
  localStorage.setItem("pk_amb", state.ambienceOn ? "on" : "off");
  localStorage.setItem("pk_haptic", state.hapticOn ? "on" : "off");
}

/* ============================================================
   UI REFRESH
   ============================================================ */

function renderAvatar(container, hasPhoto, photo) {
  if (hasPhoto && photo) {
    container.style.backgroundImage = `url(${photo})`;
    container.classList.add("has-photo");
    container.innerHTML = "";
  } else {
    container.style.backgroundImage = "";
    container.classList.remove("has-photo");
    container.innerHTML = AVATARS[state.avatar] || AVATARS.ball;
  }
}

function refreshHomeUI() {
  el.homeStreak.textContent     = state.streak;
  el.homeBest.textContent       = state.best;
  el.coinCount.textContent      = state.coins;
  el.gameCoins.textContent      = state.coins;
  el.storeCoins.textContent     = state.coins;
  el.coinshopBalance.textContent= state.coins;

  renderAvatar(el.avatarBtn, !!state.photo, state.photo);
  renderAvatar(el.profileAvatar, !!state.photo, state.photo);

  el.profileName.textContent    = state.name || state.username || "Player";
  el.profileCountry.textContent = state.country ? "🌍 " + state.country : "🌍 Country";
  el.profileStreak.textContent  = state.streak;
  el.profileBest.textContent    = state.best;
  el.profileGames.textContent   = state.games;
  el.dailyStreakNum.textContent = state.dailyStreak;
  el.shareName.textContent      = state.name ? "— " + state.name : "— Player";

  el.profilePremiumBadge.style.display = state.premium ? "flex" : "none";
}

/* ============================================================
   SCREENS
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

  if (name === "game") startAmbience();
  else stopAmbience();
}

function goBack() {
  state.history.pop();
  const prev = state.history[state.history.length - 1] || "home";
  showScreen(prev, false);
  play(el.sfxTap, false);
}

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
    alert("No questions found.");
    return;
  }

  state.current  = 0;
  state.score    = 0;
  state.answered = false;

  el.currentDiff.textContent = isDaily ? "DAILY" : difficulty.toUpperCase();
  el.currentDiff.style.background = isDaily
    ? "var(--purple)"
    : (difficulty === "easy" ? "var(--gold)" : "var(--purple)");

  play(el.sfxEnter);
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
    btn.innerHTML = `<span class="answer-letter">${letters[i]}</span><span class="answer-text">${opt}</span>`;
    btn.addEventListener("click", () => handleAnswer(i, btn));
    el.answers.appendChild(btn);
  });

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
    playOnce(el.sfxCorrect, 0.6);
    buzz([15, 30, 15]);
  } else {
    btn.classList.add("wrong");
    allBtns[q.answer].classList.add("correct");
    play(el.sfxWrong);
    buzz([40, 40, 40]);
  }

  el.hintBtn.disabled = true;
  el.skipBtn.disabled = true;

  // Auto-advance after pulse
  setTimeout(() => {
    advanceQuestion();
  }, 900);
}

function advanceQuestion() {
  const total = state.isDaily ? DAILY_QUESTIONS : QUESTIONS_PER_GAME;
  if (state.current >= total - 1) return endGame();
  state.current++;
  renderQuestion();
}

function endGame() {
  const total = state.isDaily ? DAILY_QUESTIONS : QUESTIONS_PER_GAME;
  el.progressFill.style.width = "100%";
  const pct = state.score / total;

  let coinsEarned = 10;
  if (pct >= 0.75) coinsEarned = 20;
  if (pct === 1)   coinsEarned = 50;
  if (state.isDaily) coinsEarned += 25;
  state.coins += coinsEarned;
  state.games++;

  if (!state.isDaily) {
    const parts = state.best.split("/");
    const prevBest = parts[0] ? parseInt(parts[0], 10) / parseInt(parts[1], 10) : 0;
    if (pct > prevBest) state.best = `${state.score}/${total}`;
  }

  if (pct >= 0.6) state.streak++; else state.streak = 0;

  if (state.isDaily) {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastDaily !== today) {
      state.dailyStreak++;
      state.lastDaily = today;
    }
  }

  checkAchievements(pct);

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

  // Push score to global leaderboard
  pushScoreToCloud(state.score, total);

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
  const colors = ["#FFD84D", "#8B5CF6", "#22D06E", "#F5F7FA", "#E0B420"];
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

/* ⬇️ CONTINUE WITH CHUNK 4 ⬇️ */
/* ============================================================
   ACHIEVEMENTS + TROPHIES
   ============================================================ */

const MILESTONES = [
  { id: "games-10",   icon: "🎮", name: "Getting Started", sub: "10 games played",  check: () => state.games >= 10 },
  { id: "games-50",   icon: "🎯", name: "Regular",         sub: "50 games played",  check: () => state.games >= 50 },
  { id: "games-100",  icon: "🔥", name: "Devoted",         sub: "100 games played", check: () => state.games >= 100 },
  { id: "games-500",  icon: "👑", name: "Legend",          sub: "500 games played", check: () => state.games >= 500 },
  { id: "coins-500",  icon: "💰", name: "Rich Kid",        sub: "500 coins",        check: () => state.coins >= 500 },
  { id: "coins-2000", icon: "💎", name: "Ballin",          sub: "2000 coins",       check: () => state.coins >= 2000 },
  { id: "streak-3",   icon: "🔥", name: "Hot Start",       sub: "3-day streak",     check: () => state.streak >= 3 },
  { id: "streak-30",  icon: "🌟", name: "Unstoppable",     sub: "30-day streak",    check: () => state.streak >= 30 },
  { id: "daily-30",   icon: "🎯", name: "Daily King",      sub: "30 daily challenges", check: () => state.dailyStreak >= 30 }
];

function unlockAch(id) {
  if (state.achievements.includes(id)) return;
  state.achievements.push(id);
  saveAll();
}

function checkAchievements(pct) {
  if (pct >= 0.6) unlockAch("first-win");
  if (pct === 1)  unlockAch("perfect");
  if (state.streak >= 7) unlockAch("streak-7");
  if (state.coins >= 1000) unlockAch("coin-master");
  if (state.dailyStreak >= 7) unlockAch("daily-7");
  MILESTONES.forEach(m => { if (m.check()) unlockAch(m.id); });
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

function renderTrophies() {
  // Achievements grid
  const ACH = [
    { id: "first-win",   icon: "🥉", name: "First Win",     sub: "Score 12+" },
    { id: "perfect",     icon: "🥇", name: "Perfect",       sub: "20/20" },
    { id: "streak-7",    icon: "🔥", name: "On Fire",       sub: "7-day streak" },
    { id: "all-cats",    icon: "🌍", name: "Globetrotter",  sub: "All cats" },
    { id: "coin-master", icon: "💰", name: "Coin Master",   sub: "1000 coins" },
    { id: "daily-7",     icon: "🎯", name: "Daily Devotee", sub: "7 dailies" }
  ];
  el.trophyAchGrid.innerHTML = "";
  ACH.forEach(a => {
    const unlocked = state.achievements.includes(a.id);
    const card = document.createElement("div");
    card.className = "trophy-card " + (unlocked ? "unlocked" : "locked");
    card.innerHTML = `
      <div class="trophy-card-icon">${a.icon}</div>
      <div class="trophy-card-name">${a.name}</div>
      <div class="trophy-card-sub">${a.sub}</div>
    `;
    el.trophyAchGrid.appendChild(card);
  });

  // Milestones grid
  el.trophyMileGrid.innerHTML = "";
  MILESTONES.forEach(m => {
    const unlocked = state.achievements.includes(m.id);
    const card = document.createElement("div");
    card.className = "trophy-card " + (unlocked ? "unlocked" : "locked");
    card.innerHTML = `
      <div class="trophy-card-icon">${m.icon}</div>
      <div class="trophy-card-name">${m.name}</div>
      <div class="trophy-card-sub">${m.sub}</div>
    `;
    el.trophyMileGrid.appendChild(card);
  });
}

/* ============================================================
   AVATAR PICKER
   ============================================================ */

function renderAvatarPicker() {
  el.avatarGrid.innerHTML = "";
  el.avatarCount.textContent = `${state.unlockedAvatars.length}/${ALL_AVATARS.length}`;

  [...FREE_AVATARS, ...PREMIUM_AVATARS].forEach(id => {
    const isPremium = PREMIUM_AVATARS.includes(id);
    const isUnlocked = state.unlockedAvatars.includes(id) || (isPremium && state.premium);
    const isSelected = state.avatar === id && !state.photo;

    const cell = document.createElement("div");
    cell.className = "avatar-cell";
    if (isPremium) cell.classList.add("premium");
    if (isSelected) cell.classList.add("selected");
    if (!isUnlocked) cell.classList.add("locked");
    cell.innerHTML = AVATARS[id] || AVATARS.ball;

    cell.addEventListener("click", () => {
      if (!isUnlocked) {
        if (isPremium && !state.premium) {
          if (confirm("Premium avatar. Go Premium to unlock all 15?")) {
            showScreen("premium");
          }
          return;
        }
      }
      state.avatar = id;
      state.photo = "";
      saveAll();
      refreshHomeUI();
      renderAvatarPicker();
      buzz(15);
      play(el.sfxTap, false);
    });

    el.avatarGrid.appendChild(cell);
  });
}

/* ============================================================
   STORE
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
    const grid = document.createElement("div");
    grid.className = "avatar-grid";
    [...FREE_AVATARS, ...PREMIUM_AVATARS].forEach(id => {
      const isPremium = PREMIUM_AVATARS.includes(id);
      const isUnlocked = state.unlockedAvatars.includes(id) || (isPremium && state.premium);
      const cell = document.createElement("div");
      cell.className = "avatar-cell";
      if (isPremium) cell.classList.add("premium");
      if (!isUnlocked) cell.classList.add("locked");
      cell.innerHTML = AVATARS[id] || AVATARS.ball;
      grid.appendChild(cell);
    });
    el.storeList.appendChild(grid);
    return;
  }

  if (tab === "packs") {
    const packs = [
      { name: "World Cup Legends", sub: "100 hard questions", icon: "🏆" },
      { name: "African Football Deep", sub: "AFCON + clubs + players", icon: "🌍" },
      { name: "Retro 90s Pack", sub: "Football from the 90s", icon: "📼" },
      { name: "Champions League Elite", sub: "100 UCL questions", icon: "⭐" }
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
  }
}

/* ============================================================
   AD SIMULATION
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

/* ⬇️ CONTINUE WITH CHUNK 5 ⬇️ */
/* ============================================================
   API CALLS
   ============================================================ */

async function pushScoreToCloud(score, total) {
  if (!state.loggedIn || !state.username) return;
  try {
    await fetch(WORKER_URL + "/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.username,
        country: state.country || "",
        score,
        total
      })
    });
  } catch (e) {}
}

async function fetchLeaderboard(range = "all") {
  try {
    const res = await fetch(WORKER_URL + "/leaderboard?range=" + range);
    const data = await res.json();
    return data.scores || [];
  } catch (e) {
    return [];
  }
}

async function doSignup() {
  const username = el.signupUsername.value.trim().toLowerCase();
  const pin = el.signupPin.value.trim();
  const country = el.signupCountry.value.trim();

  if (username.length < 3) { el.signupHint.textContent = "Username: 3+ chars"; return; }
  if (!/^[a-z0-9_]+$/.test(username)) { el.signupHint.textContent = "Letters, numbers, _ only"; return; }
  if (!/^\d{4}$/.test(pin)) { el.signupHint.textContent = "PIN must be 4 digits"; return; }

  el.signupHint.textContent = "Creating…";

  try {
    const res = await fetch(WORKER_URL + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pin, country })
    });
    const data = await res.json();
    if (!data.ok) {
      el.signupHint.textContent = data.error || "Signup failed";
      return;
    }
    // Logged in
    state.userId   = data.user.id;
    state.username = data.user.username;
    state.name     = data.user.username;
    state.country  = data.user.country || country;
    state.coins    = data.user.coins || 100;
    state.premium  = !!data.user.premium;
    state.loggedIn = true;
    saveAll();
    refreshHomeUI();
    play(el.sfxCorrect);
    buzz([15, 30, 15]);
    showScreen("home");
  } catch (e) {
    el.signupHint.textContent = "Network error. Try again.";
  }
}

async function doSignin() {
  const username = el.signinUsername.value.trim().toLowerCase();
  const pin = el.signinPin.value.trim();

  if (!username || !pin) { el.signinHint.textContent = "Enter username and PIN"; return; }

  el.signinHint.textContent = "Signing in…";

  try {
    const res = await fetch(WORKER_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pin })
    });
    const data = await res.json();
    if (!data.ok) {
      el.signinHint.textContent = data.error || "Login failed";
      return;
    }
    state.userId   = data.user.id;
    state.username = data.user.username;
    state.name     = data.user.username;
    state.country  = data.user.country || state.country;
    state.coins    = data.user.coins || state.coins;
    state.premium  = !!data.user.premium;
    state.loggedIn = true;
    saveAll();
    refreshHomeUI();
    play(el.sfxCorrect);
    buzz([15, 30, 15]);
    showScreen("home");
  } catch (e) {
    el.signinHint.textContent = "Network error. Try again.";
  }
}

async function loadLeaderboard(range = "all") {
  el.lbList.innerHTML = `<div class="lb-empty">Loading…</div>`;
  const scores = await fetchLeaderboard(range);
  if (!scores.length) {
    el.lbList.innerHTML = `<div class="lb-empty">No scores yet.<br>Play a game to appear here.</div>`;
    return;
  }
  el.lbList.innerHTML = "";
  scores.forEach((entry, i) => {
    const isMe = entry.name === state.username;
    const row = document.createElement("div");
    row.className = "lb-row" + (isMe ? " me" : "");
    row.innerHTML = `
      <span class="lb-rank ${i < 3 ? 'top' : ''}">#${i + 1}</span>
      <div class="lb-info">
        <div class="lb-name">${entry.name}${isMe ? " (you)" : ""}</div>
        <div class="lb-country">${entry.country || "🌍"}</div>
      </div>
      <span class="lb-score">${entry.score}/${entry.total}</span>
    `;
    el.lbList.appendChild(row);
  });
}

async function loadFriends() {
  if (!state.userId) return;
  el.friendList.innerHTML = `<div class="lb-empty">Loading…</div>`;
  try {
    const res = await fetch(WORKER_URL + "/friend/list?user_id=" + state.userId);
    const data = await res.json();
    if (!data.friends || !data.friends.length) {
      el.friendList.innerHTML = `<div class="lb-empty">No friends yet. Add someone by username.</div>`;
      return;
    }
    el.friendList.innerHTML = "";
    data.friends.forEach(f => {
      const item = document.createElement("div");
      item.className = "friend-item";
      item.innerHTML = `
        <div class="friend-avatar-mini">${AVATARS[f.avatar] || AVATARS.ball}</div>
        <div class="friend-info">
          <div class="friend-name">${f.username}</div>
          <div class="friend-sub">${f.country || "🌍"} · 💰 ${f.coins || 0}</div>
        </div>
      `;
      el.friendList.appendChild(item);
    });
  } catch (e) {
    el.friendList.innerHTML = `<div class="lb-empty">Failed to load.</div>`;
  }
}

async function loadFriendRequests() {
  if (!state.userId) return;
  el.friendRequests.innerHTML = `<div class="lb-empty">Loading…</div>`;
  try {
    const res = await fetch(WORKER_URL + "/friend/requests?user_id=" + state.userId);
    const data = await res.json();
    if (!data.requests || !data.requests.length) {
      el.friendRequests.innerHTML = `<div class="lb-empty">No pending requests.</div>`;
      return;
    }
    el.friendRequests.innerHTML = "";
    data.requests.forEach(r => {
      const item = document.createElement("div");
      item.className = "friend-item";
      item.innerHTML = `
        <div class="friend-avatar-mini">${AVATARS.ball}</div>
        <div class="friend-info">
          <div class="friend-name">${r.from_username}</div>
          <div class="friend-sub">wants to be friends</div>
        </div>
        <button class="friend-action" data-reqid="${r.id}">ACCEPT</button>
      `;
      item.querySelector(".friend-action").addEventListener("click", async () => {
        try {
          await fetch(WORKER_URL + "/friend/accept", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: state.userId, request_id: r.id })
          });
          play(el.sfxCorrect);
          buzz(20);
          loadFriendRequests();
          loadFriends();
        } catch (e) {}
      });
      el.friendRequests.appendChild(item);
    });
  } catch (e) {
    el.friendRequests.innerHTML = `<div class="lb-empty">Failed to load.</div>`;
  }
}

async function sendFriendRequest() {
  const target = el.addFriendInput.value.trim().toLowerCase();
  if (!target) { el.addFriendHint.textContent = "Enter a username"; return; }
  if (!state.userId) { el.addFriendHint.textContent = "Sign in first"; return; }
  if (target === state.username) { el.addFriendHint.textContent = "Can't add yourself"; return; }

  el.addFriendHint.textContent = "Sending…";

  try {
    const res = await fetch(WORKER_URL + "/friend/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: state.userId, target })
    });
    const data = await res.json();
    if (!data.ok) {
      el.addFriendHint.textContent = data.error || "Failed";
      return;
    }
    el.addFriendHint.textContent = "✅ Request sent!";
    el.addFriendInput.value = "";
    play(el.sfxCorrect);
    buzz(20);
  } catch (e) {
    el.addFriendHint.textContent = "Network error";
  }
}

async function loadNotifications() {
  el.notifPanel.innerHTML = `<div class="notif-empty">Loading…</div>`;
  try {
    const res = await fetch(WORKER_URL + "/notifications");
    const data = await res.json();
    const list = data.notifications || [];
    if (!list.length) {
      el.notifPanel.innerHTML = `<div class="notif-empty">No notifications yet.<br>Play a game to start seeing updates.</div>`;
      return;
    }
    el.notifPanel.innerHTML = "";
    list.forEach(n => {
      const item = document.createElement("div");
      item.className = "notif-item";
      item.innerHTML = `
        <div class="notif-icon">🏆</div>
        <div class="notif-body">
          <div class="notif-title">${n.username} scored ${n.score}/${n.total}!</div>
          <div class="notif-time">${n.date}</div>
        </div>
      `;
      el.notifPanel.appendChild(item);
    });
  } catch (e) {
    el.notifPanel.innerHTML = `<div class="lb-empty">Failed to load.</div>`;
  }
}

/* ⬇️ CONTINUE WITH CHUNK 6 ⬇️ */
/* ============================================================
   EVENTS
   ============================================================ */

// ---- ONBOARDING (first time) ----
el.onboard1.addEventListener("click", () => {
  const name = el.inputName.value.trim();
  if (name.length < 2) { el.nameHint.textContent = "At least 2 characters."; return; }
  el.nameHint.textContent = "";
  state.name = name;
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
  showScreen("signup");
});

// ---- SIGNUP / SIGNIN ----
el.signupBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  doSignup();
});

el.signinBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  doSignin();
});

el.gotoLogin.addEventListener("click", () => {
  play(el.sfxTap, false);
  showScreen("signin");
});

el.gotoSignup.addEventListener("click", () => {
  play(el.sfxTap, false);
  showScreen("signup");
});

// ---- HOME ----
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

el.bellBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  el.bellBadge.style.display = "none";
  localStorage.setItem("pk_last_notif_seen", String(Date.now()));
  loadNotifications();
  showScreen("notifications");
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
  showScreen("leaderboard");
  loadLeaderboard("alltime");
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

// ---- COIN SHOP ----
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

// ---- PROFILE ----
el.profileBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.editProfile.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  el.settingsName.value = state.name;
  el.settingsCountry.value = state.country;
  el.photoHint.textContent = state.premium
    ? "Premium · Tap to change your photo"
    : "Premium only · Go premium to upload";
  renderAvatarPicker();
  showScreen("settingsProfile");
});

el.trophyBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  renderTrophies();
  showScreen("trophies");
});

el.friendsBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  loadFriends();
  loadFriendRequests();
  showScreen("friends");
});

el.premiumBtnProfile.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  showScreen("premium");
});

// ---- PROFILE SETTINGS ----
el.settingsProfileBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("profile");
});

el.cancelProfileBtn.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("profile");
});

el.saveProfileBtn.addEventListener("click", () => {
  const name = el.settingsName.value.trim();
  const country = el.settingsCountry.value;
  if (name.length < 2) { alert("Name must be 2+ characters."); return; }
  if (!country) { alert("Pick a country."); return; }
  state.name = name;
  state.country = country;
  saveAll();
  refreshHomeUI();
  play(el.sfxCorrect);
  buzz([15, 30, 15]);
  alert("Profile saved!");
  showScreen("profile");
});

el.uploadPhotoBtn.addEventListener("click", () => {
  if (!state.premium) {
    if (confirm("Premium only. Go Premium to upload your photo?")) {
      showScreen("premium");
    }
    return;
  }
  play(el.sfxTap, false);
  el.photoInput.click();
});

el.photoInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    state.photo = ev.target.result;
    saveAll();
    refreshHomeUI();
    buzz(20);
    play(el.sfxCorrect);
    el.photoHint.textContent = "✅ Photo set!";
  };
  reader.readAsDataURL(file);
});

// ---- CATEGORY ----
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

// ---- LEADERBOARD ----
el.leaderboardBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.lbTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    el.lbTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    play(el.sfxTap, false);
    loadLeaderboard(tab.dataset.lb === "weekly" ? "week" : "all");
  });
});

// ---- DAILY ----
el.dailyBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.dailyStart.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  startGame("pro", "all", true);
});

// ---- STORE ----
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

// ---- ACHIEVEMENTS / TROPHIES ----
el.achBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("profile");
});

el.trophiesBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("profile");
});

// ---- NOTIFICATIONS ----
el.notifBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

// ---- FRIENDS ----
el.friendsBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("profile");
});

el.friendTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    el.friendTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    el.ftabList.style.display = tab.dataset.ftab === "list" ? "block" : "none";
    el.ftabRequests.style.display = tab.dataset.ftab === "requests" ? "block" : "none";
    el.ftabAdd.style.display = tab.dataset.ftab === "add" ? "block" : "none";
    play(el.sfxTap, false);
    if (tab.dataset.ftab === "list") loadFriends();
    if (tab.dataset.ftab === "requests") loadFriendRequests();
  });
});

el.addFriendBtn.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(12);
  sendFriendRequest();
});

// ---- SETTINGS ----
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
});

el.toggleHaptic.addEventListener("change", () => {
  state.hapticOn = el.toggleHaptic.checked;
  saveAll();
});

el.signoutBtn.addEventListener("click", () => {
  if (!confirm("Sign out? Your local data stays on this phone.")) return;
  state.loggedIn = false;
  state.userId = null;
  state.username = "";
  saveAll();
  play(el.sfxTap, false);
  showScreen("signin");
});

el.resetProfile.addEventListener("click", () => {
  if (!confirm("Erase ALL local data? This cannot be undone.")) return;
  localStorage.clear();
  location.reload();
});

// ---- PREMIUM ----
el.premiumBack.addEventListener("click", () => {
  play(el.sfxTap, false); showScreen("home");
});

el.premiumBuy.addEventListener("click", () => {
  play(el.sfxTap, false); buzz(20);
  state.premium = true;
  state.coins += 500;
  saveAll();
  refreshHomeUI();
  play(el.sfxCorrect);
  alert("Premium unlocked! +500 coins bonus.");
  showScreen("profile");
});

el.premiumRestore.addEventListener("click", () => {
  play(el.sfxTap, false);
  alert("Restore coming soon.");
});

// ---- GAME ----
el.hintBtn.addEventListener("click", () => {
  if (state.answered) return;
  if (state.coins < 30) { alert("Need 30 coins."); return; }
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
  if (state.coins < 50) { alert("Need 50 coins."); return; }
  state.coins -= 50;
  saveAll();
  refreshHomeUI();
  play(el.sfxTap, false); buzz(20);
  state.answered = true;
  advanceQuestion();
});

// ---- END ----
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

// ---- SHARE ----
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

// ---- BACK BUTTON ----
window.addEventListener("popstate", () => goBack());
history.pushState({ page: "home" }, "", location.href);

// ---- INIT ----
window.addEventListener("load", () => {
  loadAll();

  setTimeout(() => {
    try {
      el.sfxEnter.volume = 0.7;
      el.sfxEnter.play().catch(() => {});
    } catch (e) {}
  }, 1000);

  setTimeout(() => {
    el.splash.classList.add("hide");
    stop(el.sfxEnter);
    refreshHomeUI();
    renderAchievements();

    if (!state.loggedIn) {
      if (!state.name || !state.country) {
        showScreen("onboard");
      } else {
        showScreen("signup");
      }
    } else {
      showScreen("home");
    }

    // Check for new notifications
    checkNotificationsBadge();
  }, 4000);
});

async function checkNotificationsBadge() {
  try {
    const res = await fetch(WORKER_URL + "/notifications");
    const data = await res.json();
    const list = data.notifications || [];
    if (!list.length) return;
    const lastSeen = parseInt(localStorage.getItem("pk_last_notif_seen") || "0", 10);
    const latest = list[0];
    const latestTime = new Date(latest.date).getTime();
    if (latestTime > lastSeen) {
      el.bellBadge.textContent = list.length;
      el.bellBadge.style.display = "flex";
    }
  } catch (e) {}
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
      }
