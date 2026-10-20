// Pluma Lab: funciona sin conexión después de la primera visita
const CACHE = 'pluma-lab-v1';
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "mp/pose.js", "mp/pose_landmark_full.tflite.wasm", "mp/pose_landmark_lite.tflite.wasm", "mp/pose_solution_packed_assets.data.wasm", "mp/pose_solution_packed_assets_loader.js", "mp/pose_solution_simd_wasm_bin.js", "mp/pose_solution_simd_wasm_bin.wasm", "mp/pose_solution_wasm_bin.js", "mp/pose_solution_wasm_bin.wasm", "mp/pose_web.binarypb.wasm"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE.filter((f) => !f.startsWith('mp/'))))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
    if (res.ok && (new URL(e.request.url).origin === location.origin || /fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(e.request.url))) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); }
    return res;
  }).catch(() => caches.match('index.html'))));
});
