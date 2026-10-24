/*
 * Service worker for "תורת הצבע".
 * Pages: network first, cached copy when offline.
 * Built assets, images and fonts: cache first (their names change on every build).
 */
const VERSION = 'pcc-v3';
// Works at the site root (Vercel) and under a sub-path (GitHub Pages).
const BASE = new URL(self.registration.scope).pathname;
const SHELL = ['', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'].map((p) => BASE + p);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(BASE, copy));
          return res;
        })
        .catch(() => caches.match(BASE)),
    );
    return;
  }

  const cacheable =
    (url.origin === location.origin && (url.pathname.startsWith(BASE + 'assets/') || /\.(png|svg|jpg|jpeg|webp|ico)$/.test(url.pathname))) ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';
  if (!cacheable) return;

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok || res.type === 'opaque') {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
