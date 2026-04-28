/* まちのできごと — Service Worker
   Strategy: cache-first for app shell, network-first for data.
   Bumping CACHE_VERSION invalidates the old cache.
*/
const CACHE_VERSION = "v1";
const CACHE_NAME = "machi-dekigoto-" + CACHE_VERSION;

// App shell — the files needed to render the UI offline.
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./src/styles.css",
  "./src/data.js",
  "./src/regions.js",
  "./src/app.jsx",
  "./src/components/regionpicker.jsx",
  "./src/components/shared.jsx",
  "./src/components/top.jsx",
  "./src/components/detail.jsx",
  "./src/components/registration.jsx",
  "./src/components/series.jsx",
  "./src/components/dashboard.jsx",
  "./src/components/mine.jsx",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

// Install — prime the cache with the app shell. We use addAll with
// {cache: 'reload'} requests so the SW always fetches fresh copies on install.
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
      APP_SHELL.map(async (url) => {
        try {
          const res = await fetch(url, { cache: "reload" });
          if (res.ok) await cache.put(url, res);
        } catch (_) { /* best-effort */ }
      })
    );
    self.skipWaiting();
  })());
});

// Activate — clean up old caches.
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map((n) => n === CACHE_NAME ? null : caches.delete(n)));
    self.clients.claim();
  })());
});

// Fetch — for same-origin GETs, serve from cache first and update in the
// background (stale-while-revalidate). Cross-origin (fonts, CDN scripts) go
// straight to network with a cache fallback.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
        return res;
      }).catch(() => null);

      // Prefer cache for speed & offline, revalidate in background.
      if (cached) {
        network; // fire and forget
        return cached;
      }
      const res = await network;
      if (res) return res;
      // Navigation fallback — serve the shell.
      if (req.mode === "navigate") {
        const shell = await cache.match("./index.html");
        if (shell) return shell;
      }
      return new Response("Offline", { status: 503, statusText: "Offline" });
    })());
    return;
  }

  // Cross-origin — network first, cache fallback.
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res && res.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    } catch (_) {
      const cached = await caches.match(req);
      if (cached) return cached;
      return new Response("", { status: 504 });
    }
  })());
});
