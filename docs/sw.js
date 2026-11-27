// network first: always the newest version online, last copy when offline
const C = 'lc-v3';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // pages are fetched past the browser cache, so a new version shows straight away
  const nav = e.request.mode === 'navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('.html');
  const net = nav ? fetch(u.href, { cache: 'no-store', credentials: 'same-origin' }) : fetch(e.request);
  e.respondWith(net.then(r => { const c = r.clone(); caches.open(C).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
