// Pluma Lab: la app se actualiza sola y el modelo de IA queda guardado para usarla sin conexión
const CACHE = 'pluma-lab-v6';
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png']))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
const put = (req, res) => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return res; };
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const heavy = url.pathname.includes('/mp/') || /fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(url.host);
  if (heavy) { e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => put(req, r)))); return; }
  if (url.origin !== location.origin) return;
  // Página y archivos propios: primero la red (para recibir mejoras), si no hay conexión, la copia guardada
  e.respondWith(fetch(req, { cache: 'no-cache' }).then((r) => put(req, r)).catch(() => caches.match(req).then((hit) => hit || caches.match('index.html'))));
});
