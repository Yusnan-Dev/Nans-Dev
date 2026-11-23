const CACHE_NAME = 'nans-dev-pwa-v15';
const ASSETS = [
  './',
  './index.html',
  './main.js',
  './pwa-lang-addon.js',
  './style.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './perf_engine.wasm',
  './go-telemetry.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(ASSETS.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
