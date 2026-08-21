const CACHE_NAME = 'agrimach-v4-prod';

// Essential static assets (DO NOT hardcode hashed chunk JS here)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app-icon.svg',
  '/favicon.svg',
  '/app-icon.png',
  '/og-image.jpg'
];

// Install: Cache basic static assets and immediately take control
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Initial cache addAll error (non-fatal):', err);
      });
    })
  );
});

// Activate: Immediately purge all old versions of cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Purging legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for Navigation (HTML) to avoid serving stale JS hashes
self.addEventListener('fetch', event => {
  const req = event.request;

  // 1. Navigation / HTML requests -> Network First (fallback to cache if offline)
  if (req.mode === 'navigate' || req.destination === 'document' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(networkRes => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // 2. API / Firebase / Firestore requests -> Network only (bypass SW)
  if (req.url.includes('/api/') || req.url.includes('firestore.googleapis.com') || req.url.includes('firebase')) {
    return;
  }

  // 3. Static Assets (JS, CSS, Images, Fonts) -> Stale While Revalidate
  event.respondWith(
    caches.match(req).then(cachedRes => {
      const fetchPromise = fetch(req).then(networkRes => {
        if (networkRes && networkRes.status === 200) {
          // Never cache HTML responses when expecting JS or CSS (prevents SPA rewrite corruptions)
          const contentType = networkRes.headers.get('content-type') || '';
          if (!contentType.includes('text/html') || req.destination === 'document') {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
        }
        return networkRes;
      }).catch(() => cachedRes);

      return cachedRes || fetchPromise;
    })
  );
});
