const { chromium, expect } = require('/Users/meteor/.codex/worktrees/duocast-launch/meteor-store/node_modules/@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const mode = process.argv[2], diagnostics = process.argv.includes('--diagnostic'), mediaDiagnostics = process.argv.includes('--media-diagnostic');
if (!['local', 'production'].includes(mode)) {
  console.log('Prepared only; no browser or network started. Usage: node check.cjs local|production BASE RUN_NAME');
  process.exit(0);
}
const base = process.argv[3], runName = process.argv[4], selectedLabels = process.argv[5]?.split(',');
if (!base || !/^[a-z0-9-]+$/.test(runName || '')) throw new Error('Explicit base and unique run name required.');
const baseUrl = new URL(base);
const localTlsFixture = process.argv.includes('--local-selfsigned');
if (localTlsFixture && !(mode === 'local' && baseUrl.protocol === 'https:' && ['localhost', '127.0.0.1'].includes(baseUrl.hostname))) throw new Error('Self-signed TLS fixture is permitted only for explicitly requested local HTTPS.');
if (mode === 'local' && !['localhost', '127.0.0.1'].includes(baseUrl.hostname)) throw new Error('Local fixture mode is restricted to loopback.');
if (mode === 'production' && (baseUrl.protocol !== 'https:' || !['www.imagentx.top', 'imagentx.top'].includes(baseUrl.hostname))) throw new Error('Production must use the official HTTPS origin.');
const out = path.join('/tmp/meteor-duocast-20261103/browser', runName);
if (fs.existsSync(out)) throw new Error('Existing evidence preserved; choose a new run name.');
fs.mkdirSync(out);
const expectedSha = '15e932bf5cbe9e29e46c998d58e5d481918a7db1ed1489922d79f56fd4b2edd1';
const expectedBytes = 339310;
const fixture = '/tmp/meteor-duocast-20261103/release-audit-v0.1.0/DuoCast-0.1.0-macOS-arm64.zip';
const downloadPath = '/api/download/duocast?file=macos-arm64';
const state = { startedAt: new Date().toISOString(), mode, base, normalTlsValidation: !localTlsFixture, ignoreHTTPSErrors: localTlsFixture, events: [], cases: [], boundaries: [
  'Fresh anonymous Chrome context; no personal cookies, profile, or storage imported.',
  'Only GET requests permitted; WebSocket and Service Worker blocked; no claim/login/order actions.',
  mode === 'local' ? 'Local only: /api/auth/me anonymous fixture and the exact verified ZIP download fixture; external GET blocked; known missing-database announcement errors recorded separately; not production API/R2 evidence.' : 'Production: every permitted GET uses real endpoints, with no authentication/API fixtures and ordinary TLS validation.',
  localTlsFixture ? 'Explicitly authorized local HTTPS proxy uses a task self-signed certificate and ignoreHTTPSErrors=true; production always retains normal TLS.' : 'Normal TLS verification is retained.',
  'Mobile means 375px Chrome touch emulation, not physical-phone testing. Audio/device behavior is outside browser validation.'
] };
function clean(value) {
  if (typeof value === 'string') return value.replace(/([?&](?:x-amz-[^=&#\s]+|sentry_key|api_key|apikey|token|access_token|credential|credentials|signature|key)=)[^&#\s"']+/gi, '$1[REDACTED]').replace(/(https?:\/\/)[^\s/@]+@/gi, '$1[REDACTED]@');
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, clean(val)]));
  return value;
}
function event(value) { state.events.push(clean(value)); }
function save() { fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(clean(state), null, 2)); }
async function shot(page, name) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const finite = document.getAnimations().filter(a => Number.isFinite(a.effect?.getComputedTiming().endTime) && a.playState !== 'finished');
    await Promise.race([Promise.allSettled(finite.map(a => a.finished)), new Promise(r => setTimeout(r, 4000))]);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  const target = path.join(out, `${name}.png`);
  await page.screenshot({ path: target });
  return target;
}
function issues(label) { return state.events.filter(e => e.label === label && (['pageerror', 'http-error', 'failed-get'].includes(e.type) || (e.type === 'static' && !e.valid))); }
async function newContext(browser, label, options) {
  const intentionallyBlockedGet = new Set(), mediaStarts = new WeakMap();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block', acceptDownloads: true, ignoreHTTPSErrors: localTlsFixture, ...options });
  expect(await context.cookies()).toHaveLength(0);
  if (diagnostics) {
    await context.exposeBinding('__duocastObserveRejection', (_source, payload) => event({ label, type: 'unhandledrejection-observed', ...payload }));
    await context.addInitScript(() => {
      window.__duocastDiagnosticStage = 'document-initialization';
      window.addEventListener('unhandledrejection', event => {
        const reason = event.reason;
        void window.__duocastObserveRejection({ timestamp: new Date().toISOString(), performanceNow: performance.now(), url: location.href, stage: window.__duocastDiagnosticStage,
          reason: { name: reason?.name, constructor: reason?.constructor?.name, message: reason?.message, stack: reason?.stack, tag: Object.prototype.toString.call(reason), isDOMException: reason instanceof DOMException },
          viewport: { width: innerWidth, height: innerHeight, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight, visualWidth: visualViewport?.width, visualHeight: visualViewport?.height, visualScale: visualViewport?.scale }
        });
      });
    });
  }
  await context.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url());
    if (req.method() !== 'GET') { event({ label, type: 'blocked-write', method: req.method(), url: req.url() }); return route.abort('blockedbyclient'); }
    if (mode === 'local' && url.origin !== baseUrl.origin) { intentionallyBlockedGet.add(req.url()); event({ label, type: 'local-external-block', url: req.url() }); return route.abort('blockedbyclient'); }
    if (mode === 'local' && url.origin === baseUrl.origin && url.pathname === '/api/auth/me') {
      event({ label, type: 'fixture', fixture: 'anonymous-auth' });
      return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'cache-control': 'no-store' }, body: JSON.stringify({ user: null }) });
    }
    if (mode === 'local' && url.origin === baseUrl.origin && url.pathname === '/api/download/duocast' && url.searchParams.get('file') === 'macos-arm64') {
      event({ label, type: 'fixture', fixture: 'verified-local-zip' });
      return route.fulfill({ status: 200, contentType: 'application/zip', headers: { 'cache-control': 'no-store', 'content-disposition': 'attachment; filename="DuoCast-0.1.0-macOS-arm64.zip"' }, body: fs.readFileSync(fixture) });
    }
    return route.continue();
  });
  await context.routeWebSocket('**/*', socket => { event({ label, type: 'blocked-websocket', url: socket.url() }); socket.close(); });
  context.on('page', page => {
    page.on('pageerror', error => event({ label, type: 'pageerror', timestamp: new Date().toISOString(), url: page.url(), name: error.name, message: error.message, stack: error.stack }));
    page.on('console', msg => { if (['error', 'warning'].includes(msg.type())) event({ label, type: `console-${msg.type()}`, message: msg.text() }); });
  });
  if (mediaDiagnostics) {
    context.on('request', request => {
      if (new URL(request.url()).pathname !== '/products/duocast/cover-motion.mp4') return;
      mediaStarts.set(request, Date.now());
      event({ label, type: 'media-request', timestamp: new Date().toISOString(), url: request.url(), range: request.headers().range, timing: request.timing() });
    });
    context.on('requestfinished', request => {
      if (!mediaStarts.has(request)) return;
      event({ label, type: 'media-request-finished', timestamp: new Date().toISOString(), url: request.url(), elapsedMs: Date.now() - mediaStarts.get(request), timing: request.timing() });
    });
  }
  context.on('response', response => {
    const req = response.request(), url = new URL(response.url()), status = response.status(), headers = response.headers(), contentType = headers['content-type'] || '';
    if (mediaDiagnostics && mediaStarts.has(req)) event({ label, type: 'media-response', timestamp: new Date().toISOString(), url: response.url(), status, elapsedMs: Date.now() - mediaStarts.get(req), contentType, contentLength: headers['content-length'], contentRange: headers['content-range'], acceptRanges: headers['accept-ranges'] });
    if (status >= 400) event({ label, type: mode === 'local' && status >= 500 && /^\/api\/(announcements|daily\/preview)$/.test(url.pathname) ? 'local-database-http-error' : 'http-error', status, url: response.url(), contentType });
    if (/\.(js|css)$/.test(url.pathname)) {
      const valid = status >= 200 && status < 300 && (url.pathname.endsWith('.css') ? /^text\/css/ : /^(application|text)\/(javascript|x-javascript|ecmascript)/).test(contentType);
      event({ label, type: 'static', status, url: response.url(), contentType, valid });
    }
    if (url.pathname.startsWith('/api/')) event({ label, type: 'api-read', method: req.method(), status, url: response.url(), contentType });
    if (url.pathname === '/api/download/duocast') {
      const location = headers.location ? new URL(headers.location, base) : null;
      event({ label, type: 'download-redirect', status, noStore: (headers['cache-control'] || '').includes('no-store'), targetHost: location?.hostname, targetPath: location?.pathname, privateR2Host: !!location?.hostname.endsWith('.r2.cloudflarestorage.com'), signed: !!location?.searchParams.has('X-Amz-Signature') });
    }
  });
  context.on('requestfailed', req => {
    if (req.method() !== 'GET') return;
    const error = req.failure()?.errorText || 'unknown';
    event({ label, type: intentionallyBlockedGet.has(req.url()) ? 'local-external-blocked-get' : error.includes('ERR_ABORTED') ? 'navigation-aborted-get' : 'failed-get', url: req.url(), error });
  });
  return context;
}
async function runCase(browser, label, options, fn) {
  if (selectedLabels && !selectedLabels.includes(label)) return;
  const context = await newContext(browser, label, options), page = await context.newPage();
  page.setDefaultTimeout(20000);
  let result;
  try {
    result = await fn(page, context);
    expect(issues(label)).toHaveLength(0);
    state.cases.push({ label, status: 'passed', ...result });
  } catch (error) {
    let screenshot;
    try { screenshot = await shot(page, `${label}-failure`); } catch {}
    state.cases.push({ label, status: 'failed', functionalResult: result, error: clean(error.stack), url: clean(page.url()), healthIssues: issues(label), screenshot });
  } finally { await context.close(); save(); }
  console.log(`${label}: ${state.cases.at(-1).status}`);
}
async function openAnonymous(page, locale, pathname = '/products') {
  const authPromise = page.waitForResponse(r => new URL(r.url()).pathname === '/api/auth/me');
  const response = await page.goto(`${base}/${locale}${pathname}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  expect(response.status()).toBe(200);
  const auth = await authPromise;
  expect(auth.status()).toBe(200); expect((await auth.json()).user).toBeNull();
  expect(auth.headers()['cache-control']).toContain('no-store');
  return { status: response.status(), tls: await response.securityDetails(), anonymous: true };
}
async function diagnoseListMotion(page, label, screenshotName) {
  const cover = page.locator('[data-product-cover="duocast"]');
  await cover.scrollIntoViewIfNeeded();
  const video = cover.locator('video[data-motion-video]'); await expect(video).toHaveCount(1);
  const started = Date.now(), samples = [], frameScreenshots = [];
  let firstReady, lastObserved, fiveSecondState, firstBytes, secondBytes, nextSampleMs = 0;
  while (Date.now() - started < 30000) {
    const elapsedMs = Date.now() - started;
    const value = await video.evaluate(v => ({ src: v.currentSrc, time: v.currentTime, readyState: v.readyState, networkState: v.networkState, paused: v.paused, ended: v.ended, duration: Number.isFinite(v.duration) ? v.duration : null, width: v.videoWidth, height: v.videoHeight, muted: v.muted, loop: v.loop, playsInline: v.playsInline, error: v.error ? { code: v.error.code, message: v.error.message } : null }));
    lastObserved = { elapsedMs, ...value };
    if (elapsedMs >= nextSampleMs) { samples.push(lastObserved); event({ label, type: 'media-state-sample', ...lastObserved }); nextSampleMs = elapsedMs + 1000; }
    if (!fiveSecondState && elapsedMs >= 5000) { fiveSecondState = lastObserved; event({ label, type: 'media-five-second-checkpoint', ...lastObserved }); }
    if (value.error) throw new Error(`Media error ${JSON.stringify(value.error)}`);
    if (!firstReady && value.readyState >= 2) {
      firstReady = lastObserved;
      const file = path.join(out, `${screenshotName}-motion-a.png`); firstBytes = await video.screenshot({ path: file }); frameScreenshots.push(file);
    }
    if (firstReady && !secondBytes && value.time > firstReady.time + 1.2) {
      const file = path.join(out, `${screenshotName}-motion-b.png`); secondBytes = await video.screenshot({ path: file }); frameScreenshots.push(file);
    }
    if (fiveSecondState && secondBytes) break;
    await page.waitForTimeout(250);
  }
  const diagnostic = { maximumObservationMs: 30000, firstReady, fiveSecondState, lastObserved, samples };
  event({ label, type: 'media-load-diagnostic', ...diagnostic });
  expect(firstReady, 'Video must decode within the explicit 30-second observation limit').toBeTruthy();
  expect(secondBytes, 'Video currentTime must advance during the bounded observation').toBeTruthy();
  expect(firstReady.width).toBe(1280); expect(firstReady.height).toBe(800); expect(firstReady.duration).toBeCloseTo(5.4, 1); expect(firstReady.muted).toBe(true); expect(firstReady.loop).toBe(false);
  const framesDiffer = !firstBytes.equals(secondBytes); expect(framesDiffer).toBe(true);
  const poster = await cover.locator('img[data-cover-frame="poster"]').evaluate(img => ({ complete: img.complete, width: img.naturalWidth, source: img.currentSrc })); expect(poster.width).toBeGreaterThan(0);
  return { diagnostic, framesDiffer, frameScreenshots, poster, screenshot: await shot(page, screenshotName) };
}
async function motion(page, label, screenshotName) {
  if (mediaDiagnostics && screenshotName.endsWith('-list')) return diagnoseListMotion(page, label, screenshotName);
  const cover = page.locator('[data-product-cover="duocast"]');
  await cover.scrollIntoViewIfNeeded();
  const video = cover.locator('video[data-motion-video]');
  await expect(video).toHaveCount(1);
  await expect.poll(() => video.evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);
  let before = await video.evaluate(v => ({ time: v.currentTime, duration: v.duration, ended: v.ended }));
  if (before.ended) { await page.mouse.move(0, 0); await video.hover(); before = await video.evaluate(v => ({ time: v.currentTime, duration: v.duration, ended: v.ended })); }
  await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(before.time + 0.12);
  const observed = await video.evaluate(v => ({ src: v.currentSrc, time: v.currentTime, duration: v.duration, width: v.videoWidth, height: v.videoHeight, muted: v.muted, loop: v.loop, playsInline: v.playsInline }));
  expect(observed.width).toBe(1280); expect(observed.height).toBe(800); expect(observed.duration).toBeCloseTo(5.4, 1); expect(observed.muted).toBe(true); expect(observed.loop).toBe(false);
  const poster = await cover.locator('img[data-cover-frame="poster"]').evaluate(img => ({ complete: img.complete, width: img.naturalWidth, source: img.currentSrc }));
  expect(poster.width).toBeGreaterThan(0);
  const firstFrame = path.join(out, `${screenshotName}-motion-a.png`), secondFrame = path.join(out, `${screenshotName}-motion-b.png`);
  const firstBytes = await video.screenshot({ path: firstFrame });
  await expect.poll(() => video.evaluate(v => v.currentTime), { timeout: 6000 }).toBeGreaterThan(observed.time + 1.2);
  const secondBytes = await video.screenshot({ path: secondFrame });
  const framesDiffer = !firstBytes.equals(secondBytes); expect(framesDiffer).toBe(true);
  const screenshot = await shot(page, screenshotName);
  event({ label, type: 'motion', before, observed, poster, framesDiffer });
  return { before, observed, poster, framesDiffer, frameScreenshots: [firstFrame, secondFrame], screenshot };
}
async function diagnosticStage(page, label, stage) {
  if (!diagnostics) return;
  const observed = await page.evaluate(stage => { window.__duocastDiagnosticStage = stage; return { stage, timestamp: new Date().toISOString(), performanceNow: performance.now(), url: location.href, width: innerWidth, height: innerHeight, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight, visualWidth: visualViewport?.width, visualHeight: visualViewport?.height, visualScale: visualViewport?.scale }; }, stage);
  event({ label, type: 'diagnostic-stage', ...observed });
}
async function standard(page, locale, label) {
  const initial = await openAnonymous(page, locale);
  await diagnosticStage(page, label, 'list-loaded');
  const cards = page.locator('main [data-product-cover]'); await expect(cards).toHaveCount(13);
  const link = page.locator('#lab a').filter({ has: page.locator('[data-product-cover="duocast"]') }); await expect(link).toHaveCount(1); await expect(link).toBeVisible();
  const cardHref = await link.getAttribute('href');
  const freePriceVisible = (await link.innerText()).includes(locale === 'zh' ? '免费' : 'Free');
  await diagnosticStage(page, label, 'list-scroll-and-motion');
  const listMotion = await motion(page, label, `${label}-list`);
  await diagnosticStage(page, label, 'list-card-click');
  await link.click(); await expect(page).toHaveURL(new RegExp(`/${locale}/products/duocast$`));
  await expect(page.locator('main h1')).toHaveText('DuoCast');
  await diagnosticStage(page, label, 'detail-scroll-and-motion');
  const detailMotion = await motion(page, label, `${label}-detail-cover`);
  const mainText = await page.locator('main').innerText();
  for (const text of ['macOS 14.2+', 'Apple Silicon', '0.1.0', expectedSha.slice(0, 12), 'ad-hoc', locale === 'zh' ? '未经 Apple 公证' : 'not notarized by Apple', locale === 'zh' ? '不保证两副蓝牙耳机同时播放' : 'simultaneous playback on two Bluetooth headsets is not guaranteed']) expect(mainText).toContain(text);
  const github = page.locator('main a[href="https://github.com/Meteorkid/duocast"]').first(); await expect(github).toBeVisible(); const githubHref = await github.getAttribute('href');
  const help = page.locator(`main a[href="/${locale}/docs/duocast-first-play"]`).first(); await expect(help).toBeVisible();
  const downloadLink = page.locator(`#download a[href="${downloadPath}"]`); await expect(downloadLink).toHaveCount(1);
  await diagnosticStage(page, label, 'download-scroll');
  await downloadLink.scrollIntoViewIfNeeded(); const downloadShot = await shot(page, `${label}-download`);
  await diagnosticStage(page, label, 'download-click');
  const downloadPromise = page.waitForEvent('download', { timeout: 45000 }); await downloadLink.click(); const download = await downloadPromise;
  const target = path.join(out, `${label}-${download.suggestedFilename()}`); await download.saveAs(target);
  expect(await download.failure()).toBeNull();
  const buffer = fs.readFileSync(target), sha256 = crypto.createHash('sha256').update(buffer).digest('hex'); expect(buffer.length).toBe(expectedBytes); expect(sha256).toBe(expectedSha);
  const redirect = state.events.filter(e => e.label === label && e.type === 'download-redirect').at(-1);
  if (mode === 'production') { expect(redirect.status).toBe(302); expect(redirect.noStore).toBe(true); expect(redirect.privateR2Host).toBe(true); expect(redirect.signed).toBe(true); }
  await diagnosticStage(page, label, 'help-link-click');
  await help.click(); await expect(page).toHaveURL(new RegExp(`/${locale}/docs/duocast-first-play$`));
  await diagnosticStage(page, label, 'help-loaded');
  const helpText = await page.locator('main').innerText(); expect(helpText).toContain('DuoCast'); expect(helpText).toContain('SHA-256'); expect(helpText).toContain(expectedSha);
  const helpShot = await shot(page, `${label}-help`);
  const horizontalOverflow = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth })); expect(horizontalOverflow.scrollWidth).toBeLessThanOrEqual(horizontalOverflow.width + 1);
  return { initial, productCards: 13, cardHref, listMotion, detailMotion, checkedDescription: true, freePriceVisible, githubHref, download: { file: target, bytes: buffer.length, sha256, actualDownloadEvent: true, redirect, screenshot: downloadShot }, help: { url: page.url(), screenshot: helpShot }, horizontalOverflow };
}
(async () => {
  if (mode === 'local') { const buf = fs.readFileSync(fixture); expect(buf.length).toBe(expectedBytes); expect(crypto.createHash('sha256').update(buf).digest('hex')).toBe(expectedSha); }
  const browser = await chromium.launch({ channel: 'chrome', headless: true }); state.browser = browser.version();
  try {
    await runCase(browser, 'desktop-zh-1280', { viewport: { width: 1280, height: 900 } }, page => standard(page, 'zh', 'desktop-zh-1280'));
    await runCase(browser, 'mobile-en-375', { viewport: { width: 375, height: 900 }, hasTouch: true, isMobile: true }, page => standard(page, 'en', 'mobile-en-375'));
    await runCase(browser, 'reduced-motion-en-375', { viewport: { width: 375, height: 900 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' }, async page => {
      const initial = await openAnonymous(page, 'en', '/products/duocast');
      const cover = page.locator('[data-product-cover="duocast"]'); await cover.scrollIntoViewIfNeeded();
      await expect(cover).toHaveAttribute('data-active', 'false'); await expect(cover.locator('video')).toHaveCount(0);
      await expect.poll(() => cover.locator('img[data-cover-frame="poster"]').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
      const poster = await cover.locator('img[data-cover-frame="poster"]').evaluate(img => ({ complete: img.complete, width: img.naturalWidth, source: img.currentSrc })); expect(poster.width).toBeGreaterThan(0);
      return { initial, poster, noVideo: true, screenshot: await shot(page, 'reduced-motion-en-375') };
    });
    await runCase(browser, 'search-sitemap-home', { reducedMotion: 'reduce' }, async page => {
      await openAnonymous(page, 'zh', '');
      const homeIds = await page.locator('#products [data-product-cover]').evaluateAll(nodes => nodes.map(n => n.getAttribute('data-product-cover')));
      expect(homeIds).toEqual(['xisland', 'xnook', 'statux', 'claude-phone-control', 'cursor-source-analyzer']); expect(homeIds).not.toContain('duocast');
      const results = [];
      for (const locale of ['zh', 'en']) {
        const result = await page.evaluate(async locale => { const r = await fetch(`/api/spotlight/search?q=DuoCast&locale=${locale}`); return { status: r.status, body: await r.json() }; }, locale);
        expect(result.status).toBe(200); const entries = result.body.results.map(x => x.entry || x);
        expect(entries.some(x => x.href === '/products/duocast')).toBe(true); expect(entries.some(x => x.href === '/docs/duocast-first-play')).toBe(true);
        results.push({ locale, status: result.status, entries: entries.map(x => ({ title: x.title, href: x.href })) });
      }
      const sitemap = await page.evaluate(async () => { const r = await fetch('/sitemap.xml'); return { status: r.status, body: await r.text() }; }); expect(sitemap.status).toBe(200);
      const paths = ['zh', 'en'].flatMap(locale => [`/${locale}/products/duocast`, `/${locale}/docs/duocast-first-play`]); for (const pathname of paths) expect(sitemap.body).toContain(pathname);
      return { homeIds, search: results, sitemap: { status: sitemap.status, contains: paths } };
    });
  } finally { await browser.close(); state.finishedAt = new Date().toISOString(); state.browserClosed = true; }
  state.summary = { cases: state.cases.length, passed: state.cases.filter(c => c.status === 'passed').length, failed: state.cases.filter(c => c.status === 'failed').length, healthIssues: state.events.filter(e => ['pageerror', 'http-error', 'failed-get'].includes(e.type) || (e.type === 'static' && !e.valid)).length, fixtures: state.events.filter(e => e.type === 'fixture').length, blockedWrites: state.events.filter(e => e.type === 'blocked-write').length, blockedWebSockets: state.events.filter(e => e.type === 'blocked-websocket').length };
  save(); console.log(JSON.stringify(state.summary)); process.exitCode = state.summary.failed ? 1 : 0;
})().catch(error => { state.fatal = clean(error.stack); save(); console.error(clean(error.stack)); process.exitCode = 2; });
