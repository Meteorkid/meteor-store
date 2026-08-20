/**
 * Service Worker —— 只负责一件事：断网时给出离线兜底页（Meteor Runner 小游戏）。
 *
 * ## 它刻意不做什么
 *
 * **不缓存正常页面，不缓存 _next/static，不缓存 API。** fetch 处理器只在
 * `request.mode === 'navigate'` 时介入，且永远网络优先——线上有响应就用线上的，
 * SW 完全不参与内容分发。这样「用户被 SW 卡在旧版本」这个最经典的坑从设计上不存在，
 * 缓存版本号也不需要跟 deploy-local.sh 的发布节奏联动。
 *
 * 代价：断网时只能玩游戏，不能浏览此前访问过的页面。彩蛋不值得为此承担缓存一致性风险。
 *
 * ## 要彻底移除 SW 时怎么做
 *
 * **不能直接删掉这个文件。** 删了之后浏览器拿不到新脚本，已注册的旧 SW 会继续存活。
 * 正确做法是把本文件内容替换成下面三行再发布一次，等一个发布周期后再删文件：
 *
 *     self.addEventListener('install', () => self.skipWaiting());
 *     self.addEventListener('activate', (e) => e.waitUntil(
 *       self.registration.unregister().then(() => caches.keys())
 *         .then((ks) => Promise.all(ks.map((k) => caches.delete(k)))));
 *     );
 */

// 改动预缓存内容**或缓存 key 规则**时把版本号 +1，activate 会清掉所有旧版本 cache。
// v2：cache key 从完整 URL 改成纯路径，旧版本里可能留着同一文件的多份副本。
const CACHE = 'meteor-offline-v2';

// 离线兜底页需要的全部资源，一个都不能少——少一个就是断网时的裂图。
const PRECACHE = ['/offline.html', '/meteor-runner.js', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // reload 绕开 HTTP 缓存，避免装进来的就是一份过期的兜底页
      .then((cache) => cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))))
      // 兜底页装不上就别激活，留着旧版本比留个半残的强
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 非 GET 一律不碰：POST 到支付/登录接口如果被 SW 经手，出问题极难排查
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 跨域资源（R2 图片、字体）交给浏览器

  // 1) 页面导航：网络优先，断网才给兜底页
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match('/offline.html').then((r) => r || Response.error())
      )
    );
    return;
  }

  // 2) 兜底页自己的依赖：同样网络优先，只是断网时能从预缓存里拿到。
  //    在线时永远走网络，所以改了引擎不会因为 SW 而看到旧版。
  if (PRECACHE.includes(url.pathname)) {
    // **cache key 用不带 query 的路径**。判断走的是 pathname，但 cache.put(req)
    // 存的是完整 URL——带任何查询参数的请求（cache-busting、调试参数、
    // 第三方加的 utm）都会各自占一条记录，同一个文件在缓存里堆出好几份，
    // 而离线回退时又只找得到其中一条。install 阶段预缓存用的也是纯路径，
    // 两边必须一致。
    const key = new Request(url.pathname);
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(key, copy));
          }
          return res;
        })
        .catch(() => caches.match(key).then((r) => r || Response.error()))
    );
  }

  // 3) 其余请求（_next/static、API、图片…）不注册 respondWith，浏览器照常处理
});

// 逃生舱：页面可以主动让 SW 注销并清干净，见 ServiceWorkerRegistrar 的 window.__meteorSwReset
self.addEventListener('message', (event) => {
  if (event.data !== 'meteor-sw-reset') return;
  event.waitUntil(
    self.registration
      .unregister()
      .then(() => caches.keys())
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.matchAll())
      .then((clients) => clients.forEach((c) => c.navigate(c.url)))
  );
});
