const CACHE="brk-v9",ASSETS=["/logo.svg","/logo-white.svg","/favicon.svg","/favicon.ico","/favicon-96x96.png","/apple-touch-icon.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  const p=u.pathname;
  // Network-first for HTML, data.json, updated_at.txt (so shared links always get latest code)
  const networkFirst = p==='/' || p.endsWith('.html') || p.endsWith('data.json') || p.endsWith('updated_at.txt') || p.endsWith('manifest.json');
  if(networkFirst){
    e.respondWith(fetch(e.request).then(r=>{caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r;}).catch(()=>caches.match(e.request).then(r=>r||Response.error())));
  } else {
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{caches.open(CACHE).then(c=>c.put(e.request,res.clone()));return res;})));
  }
});
