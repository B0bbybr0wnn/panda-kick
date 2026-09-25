const CACHE = "panda-kick-v7";
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/icons.js",
  "/data/questions.js",
  "/manifest.json",
  "/sounds/correct.mp3",
  "/sounds/wrong.mp3",
  "/sounds/ambience.mp3",
  "/sounds/win.mp3",
  "/sounds/tap.mp3",
  "/sounds/enter.mp3"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match("/index.html")))
  );
});
