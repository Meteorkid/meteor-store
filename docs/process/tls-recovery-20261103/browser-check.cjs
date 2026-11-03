const { chromium, expect } = require('/Users/meteor/github/meteor-store/node_modules/@playwright/test');
const fs = require('node:fs');
const observer = require('/Users/meteor/github/meteor-store/docs/process/header-primary-navigation-20261027/release/production-observer.cjs');
const OUT = '/tmp/meteor-tls-recovery-20261103/browser';
const BASE = 'https://www.imagentx.top';
if (!process.argv.includes('--run-after-certificate-updated')) {
  console.log('Prepared only. No network access. Await explicit certificate-updated notice.');
  process.exit(0);
}
if (fs.existsSync(`${OUT}/results.json`)) throw new Error('Existing evidence preserved; do not replay into this directory.');
const state = {
  startedAt: new Date().toISOString(), base: BASE, cases: [], events: [],
  normalTlsValidation: true, ignoreHTTPSErrors: false,
  boundaries: [
    'Fresh anonymous Chrome contexts; no login, cookies or storage state imported.',
    'Service workers blocked. Every non-GET request and every WebSocket is blocked.',
    'All permitted GET requests reach production; no authentication or API fixtures.',
    'No source edits, deploys, database writes, business actions or messages.',
    '375px mobile is Chrome touch emulation, not a physical phone test.'
  ]
};
function sanitize(value) {
  if (typeof value === 'string') return value.replace(/([?&](?:sentry_key|api_key|apikey|token|access_token|key)=)[^&#\s"']+/gi, '$1[REDACTED]').replace(/(https?:\/\/)[^\s/@]+@/gi, '$1[REDACTED]@');
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, sanitize(val)]));
  return value;
}
function save() { fs.writeFileSync(`${OUT}/results.json`, JSON.stringify(sanitize(state), null, 2)); }
async function settled(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const finite = document.getAnimations().filter(animation => {
      const timing = animation.effect?.getComputedTiming();
      return timing && Number.isFinite(timing.endTime) && animation.playState !== 'finished';
    });
    await Promise.race([Promise.allSettled(finite.map(animation => animation.finished)), new Promise(resolve => setTimeout(resolve, 4000))]);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return { finiteAnimationsWaited: finite.length, unfinishedFiniteAnimations: finite.filter(animation => !['finished', 'idle'].includes(animation.playState)).length };
  });
}
async function initial(page, label, locale) {
  const authPromise = page.waitForResponse(response => new URL(response.url()).pathname === '/api/auth/me', { timeout: 30000 });
  const doc = await page.goto(`${BASE}/${locale}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  expect(doc.status()).toBe(200);
  const auth = await authPromise;
  const body = await auth.json();
  const authResult = { label, type: 'anonymous-auth', status: auth.status(), anonymous: body.user === null, noStore: (auth.headers()['cache-control'] || '').includes('no-store') };
  state.events.push(authResult);
  expect(authResult.status).toBe(200); expect(authResult.anonymous).toBe(true); expect(authResult.noStore).toBe(true);
  await page.waitForLoadState('networkidle', { timeout: 25000 });
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
  expect(await page.locator('main').innerText()).not.toBe('');
  return { initialStatus: doc.status(), initialUrl: page.url(), tls: await doc.securityDetails(), title: await page.title() };
}
async function screenshot(page, name) {
  const animations = await settled(page);
  expect(animations.unfinishedFiniteAnimations).toBe(0);
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  return { path, animations };
}
async function runCase(browser, label, options, fn) {
  const context = await observer.createReadOnlyContext(browser, label, options, state);
  expect(typeof context.routeWebSocket).toBe('function');
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) state.events.push({ label, type: `console-${message.type()}`, message: message.text() }); });
  try {
    const result = await fn(page);
    await page.waitForLoadState('networkidle', { timeout: 25000 });
    observer.assertHealth(state, label);
    state.cases.push({ label, status: 'passed', ...result });
  } catch (error) {
    state.cases.push({ label, status: 'failed', error: error.stack, url: page.url(), healthIssues: observer.healthIssues(state, label) });
  } finally { await context.close(); save(); }
  console.log(`${label}: ${state.cases.at(-1).status}`);
}
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  state.browser = browser.version();
  try {
    await runCase(browser, 'desktop-zh-1280', { viewport: { width: 1280, height: 900 } }, async page => {
      const initialResult = await initial(page, 'desktop-zh-1280', 'zh');
      const start = page.url();
      const arrow = page.locator('#header-trigger-products');
      await arrow.focus(); await page.keyboard.press('Enter');
      await expect(page.locator('#header-panel-products')).toBeVisible();
      await expect(arrow).toHaveAttribute('aria-expanded', 'true');
      expect(page.url()).toBe(start);
      await page.keyboard.press('Escape'); await expect(arrow).toBeFocused();
      await expect(page.locator('#header-panel-products')).toHaveCount(0);
      const name = page.locator('#header-overview-products');
      await expect(name).toHaveAttribute('href', '/zh/products');
      await name.click();
      await expect.poll(() => new URL(page.url()).pathname).toBe('/zh/products');
      await page.mouse.move(1, 850);
      await expect(page.locator('#header-panel-products')).toHaveCount(0);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('main').getByText('Meteor Products', { exact: true })).toBeVisible();
      await page.waitForLoadState('networkidle', { timeout: 25000 });
      return { ...initialResult, finalUrl: page.url(), actions: ['products arrow opens submenu without navigating', 'Escape closes submenu and restores focus', 'primary products name navigates to /zh/products'], screenshot: await screenshot(page, 'desktop-zh-1280') };
    });
    await runCase(browser, 'mobile-en-375', { viewport: { width: 375, height: 900 }, hasTouch: true, isMobile: true }, async page => {
      const initialResult = await initial(page, 'mobile-en-375', 'en');
      const hamburger = page.locator('[aria-controls="header-mobile-panel"]');
      const overflowBefore = await page.evaluate(() => document.body.style.overflow);
      await hamburger.tap(); await expect(page.locator('#header-mobile-panel')).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
      const start = page.url(), arrow = page.locator('button[aria-controls="header-mobile-products"]');
      await arrow.tap(); await expect(page.locator('#header-mobile-products')).toBeVisible();
      expect(page.url()).toBe(start);
      const target = await arrow.boundingBox(); expect(target.width).toBeGreaterThanOrEqual(44); expect(target.height).toBeGreaterThanOrEqual(44);
      const shot = await screenshot(page, 'mobile-en-375');
      const name = page.locator('#header-mobile-overview-products');
      await expect(name).toHaveAttribute('href', '/en/products'); await name.tap();
      await expect.poll(() => new URL(page.url()).pathname).toBe('/en/products');
      await expect(page.locator('main').getByText('Meteor Products', { exact: true })).toBeVisible();
      await expect(page.locator('#header-mobile-panel')).toHaveCount(0);
      await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(overflowBefore);
      await hamburger.tap(); await page.keyboard.press('Escape');
      await expect(page.locator('#header-mobile-panel')).toHaveCount(0);
      await expect(hamburger).toBeFocused();
      await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(overflowBefore);
      const scroll = await page.evaluate(async () => {
        const before = window.scrollY; window.scrollTo(0, 300); await new Promise(resolve => requestAnimationFrame(resolve));
        return { before, after: window.scrollY, documentHeight: document.documentElement.scrollHeight, viewportHeight: innerHeight };
      });
      expect(scroll.after).toBeGreaterThan(0);
      return { ...initialResult, finalUrl: page.url(), overflowBefore, scroll, arrowTarget: target, actions: ['mobile menu locks body scrolling', 'products arrow opens submenu without navigating', 'primary products name navigates to /en/products, closes menu and restores overflow', 'Escape closes menu, restores focus and scrolling', 'programmatic scroll succeeds after close'], screenshot: shot };
    });
  } finally { await browser.close(); state.browserClosed = true; state.finishedAt = new Date().toISOString(); save(); }
  state.summary = {
    cases: state.cases.length, passed: state.cases.filter(item => item.status === 'passed').length, failed: state.cases.filter(item => item.status === 'failed').length,
    anonymousAuthReads: state.events.filter(item => item.type === 'anonymous-auth').length, apiReads: state.events.filter(item => item.type === 'api-read').length,
    staticResponses: state.events.filter(item => item.type === 'static').length, invalidStatic: state.events.filter(item => item.type === 'static' && !item.valid).length,
    blockedWrites: state.events.filter(item => item.type === 'blocked-write').length, blockedWebSockets: state.events.filter(item => item.type === 'blocked-websocket').length,
    healthIssues: state.events.filter(item => ['pageerror', 'http-error', 'failed-get'].includes(item.type)).length
  }; save(); console.log(JSON.stringify(state.summary)); process.exitCode = state.summary.failed ? 1 : 0;
})().catch(error => { state.fatal = error.stack; save(); console.error(error); process.exitCode = 2; });
