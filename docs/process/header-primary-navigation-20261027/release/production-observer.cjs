const { expect } = require('/Users/meteor/github/meteor-store/node_modules/@playwright/test');
const BASE = 'https://www.imagentx.top';
const RELEASE = '9bb7b9e3ae70244d6b48009a51d0bd4efe3c3919';
async function createReadOnlyContext(browser, label, options, state) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block', ...options });
  expect(await context.cookies()).toHaveLength(0);
  await context.route('**/*', route => {
    const request = route.request();
    if (request.method() !== 'GET') {
      state.events.push({ label, type: 'blocked-write', method: request.method(), url: request.url() });
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  if (context.routeWebSocket) await context.routeWebSocket('**/*', socket => {
    state.events.push({ label, type: 'blocked-websocket', url: socket.url() });
    socket.close();
  });
  context.on('page', page => page.on('pageerror', error => state.events.push({ label, type: 'pageerror', message: error.message })));
  context.on('response', response => {
    const request = response.request(), url = response.url(), pathname = new URL(url).pathname;
    const status = response.status(), contentType = response.headers()['content-type'] || '';
    if (status >= 400) state.events.push({ label, type: 'http-error', status, url, resourceType: request.resourceType(), contentType });
    if (/\.(?:js|css)$/.test(pathname)) {
      const expectedMime = pathname.endsWith('.css') ? /^text\/css(?:;|$)/i : /^(?:application|text)\/(?:javascript|x-javascript|ecmascript)(?:;|$)/i;
      const valid = status >= 200 && status < 300 && expectedMime.test(contentType);
      state.events.push({ label, type: 'static', status, url, contentType, valid });
    }
    if (pathname.startsWith('/api/')) state.events.push({ label, type: 'api-read', method: request.method(), status, url, contentType });
  });
  context.on('requestfailed', request => {
    if (request.method() !== 'GET') return;
    const error = request.failure()?.errorText || 'unknown';
    state.events.push({ label, type: error.includes('ERR_ABORTED') ? 'navigation-aborted-get' : 'failed-get', url: request.url(), resourceType: request.resourceType(), error });
  });
  return context;
}
async function ready(page, locale, state, label) {
  const authPromise = page.waitForResponse(response => new URL(response.url()).pathname === '/api/auth/me', { timeout: 30000 });
  await page.goto(`${BASE}/${locale}/products`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const auth = await authPromise;
  expect(auth.status()).toBe(200);
  const body = await auth.json();
  expect(body.user).toBeNull();
  state.events.push({ label, type: 'anonymous-auth', status: auth.status(), anonymous: body.user === null, noStore: (auth.headers()['cache-control'] || '').includes('no-store') });
  await page.waitForLoadState('networkidle', { timeout: 25000 });
}
function healthIssues(state, label) {
  return state.events.filter(event => event.label === label && (
    ['pageerror', 'http-error', 'failed-get'].includes(event.type) || (event.type === 'static' && !event.valid)
  ));
}
function assertHealth(state, label) {
  const issues = healthIssues(state, label);
  expect(issues, `Production GET/static/page errors for ${label}: ${JSON.stringify(issues)}`).toHaveLength(0);
  expect(state.events.filter(event => event.label === label && event.type === 'static').length).toBeGreaterThan(0);
}
module.exports = { BASE, RELEASE, createReadOnlyContext, ready, assertHealth, healthIssues };
