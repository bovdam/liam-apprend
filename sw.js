// Service Worker â€“ Liam apprend v2
const CACHE = 'liam-v2';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.add('./index.html'))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Navigation (chargement de page) â†’ toujours index.html depuis le cache
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html')
        .then(r => r || fetch(e.request))
    );
    return;
  }
  // Autres requÃªtes â†’ cache en prioritÃ©, rÃ©seau en fallback
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request))
  );
});

