const CACHE_NAME = 'agrimach-pwa-v6';

// Core static assets required for instant offline loading & WebAPK generation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app-icon-192.png',
  '/app-icon-512.png',
  '/app-icon.svg',
  '/favicon.ico',
  '/favicon.svg',
  '/og-image.jpg'
];

// Install: Skip waiting and cache core assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('PWA Precache non-fatal warning:', err);
      });
    })
  );
});

// Activate: Take control immediately and purge legacy caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              console.log('Clearing old PWA cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

// Fetch: Safe, error-handling fetch strategy for WebAPK & PWA runtime
self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET requests with http/https schemes
  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) return;

  // Bypass API calls, Firebase, Firestore, and external third-party services
  if (
    req.url.includes('/api/') || 
    req.url.includes('firestore.googleapis.com') || 
    req.url.includes('firebase') ||
    req.url.includes('qrserver.com')
  ) {
    return;
  }

  // 1. HTML Navigation Requests -> Instant Cache First with Background Network Revalidation (Eliminates white flash)
  if (req.mode === 'navigate' || req.destination === 'document' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.match('/index.html').then(cachedHtml => {
        // Fetch fresh HTML in background to update cache
        const networkFetch = fetch(req)
          .then(networkRes => {
            if (networkRes && networkRes.status === 200) {
              const copy = networkRes.clone();
              caches.open(CACHE_NAME).then(cache => cache.put('/index.html', copy));
            }
            return networkRes;
          })
          .catch(err => {
            console.warn('Navigation network fetch failed, using cache:', err);
            return cachedHtml;
          });

        // Return cached HTML instantly (0ms delay) if available to avoid browser white screen wait
        if (cachedHtml) {
          return cachedHtml;
        }

        // If no cache yet, wait for network fetch
        return networkFetch;
      })
    );
    return;
  }

  // 2. Static Assets (Icons, Images, JS, CSS) -> Cache First, Network Fallback
  event.respondWith(
    caches.match(req).then(cachedResponse => {
      if (cachedResponse) {
        // Fetch in background to keep cache fresh
        fetch(req).then(networkRes => {
          if (networkRes && networkRes.status === 200) {
            const contentType = networkRes.headers.get('content-type') || '';
            if (!contentType.includes('text/html')) {
              const copy = networkRes.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
            }
          }
        }).catch(() => {/* Ignore background sync failures */});

        return cachedResponse;
      }

      // If not in cache, fetch from network safely
      return fetch(req)
        .then(networkRes => {
          if (networkRes && networkRes.status === 200) {
            const contentType = networkRes.headers.get('content-type') || '';
            if (!contentType.includes('text/html')) {
              const copy = networkRes.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
            }
          }
          return networkRes;
        })
        .catch(err => {
          console.warn('Fetch fallback failed:', err);
          // Return empty 200 for missing images to prevent broken install loops
          if (req.destination === 'image') {
            return new Response('', { status: 200, headers: { 'Content-Type': 'image/png' } });
          }
          return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
    })
  );
});
