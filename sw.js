const CACHE="brk-v10",ASSETS=["/logo.svg","/logo-white.svg","/favicon.svg","/favicon.ico","/favicon-96x96.png","/apple-touch-icon.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  const p=u.pathname;
  // Network-first with HTTP-cache bypass for HTML/data (guarantees shared links load the latest code)
  const networkFirst = p==='/' || p.endsWith('.html') || p.endsWith('data.json') || p.endsWith('updated_at.txt') || p.endsWith('manifest.json');
  if(networkFirst){
    // {cache:'no-cache'} forces the browser to revalidate with the server, bypassing stale HTTP cache
    e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{
      // Cache under path-only key so ?v=timestamp share URLs still find a fallback if offline
      const cacheKey = new Request(u.origin+u.pathname);
      caches.open(CACHE).then(c=>c.put(cacheKey,r.clone()));
      return r;
    }).catch(()=>caches.match(new Request(u.origin+u.pathname)).then(r=>r||caches.match(e.request).then(r2=>r2||Response.error()))));
  } else {
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{caches.open(CACHE).then(c=>c.put(e.request,res.clone()));return res;})));
  }
});
