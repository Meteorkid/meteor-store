const { chromium, expect } = require('/Users/meteor/github/meteor-store/node_modules/@playwright/test');
const fs = require('fs'), crypto = require('crypto');
const observer = require('/Users/meteor/github/meteor-store/docs/process/header-primary-navigation-20261027/release/production-observer.cjs');
const variant = 'candidate';
const BASE = observer.BASE;
const OUT = '/tmp/meteor-glass-production-20261028';
const SOURCE = '/Users/meteor/github/meteor-store';
const visualOnly = false;
if (!process.argv.includes('--run')) { console.log('Prepared; use --run only after deployment is explicitly confirmed live.'); process.exit(0); }
fs.mkdirSync(OUT, { recursive: true });
const groups = [['products', '/products'], ['daily', '/daily'], ['learn', '/pathfinder'], ['content', '/blog'], ['help', '/docs']];
const state = { startedAt: new Date().toISOString(), variant, base: BASE, visualOnly, guestStub: false, expectedRelease: process.env.EXPECTED_RELEASE || null, observerSource: 'docs/process/header-primary-navigation-20261027/release/production-observer.cjs', reusedCheckSource: 'docs/process/header-glass-highlight-20261028/header-glass-check.cjs', cases: [], events: [], sourceFiles: {}, boundaries: ['Production browser accepts GET only; all non-GET requests and WebSockets are blocked.', 'Independent Chrome contexts start with no cookies and service workers blocked.', 'Anonymous auth/me is a real production GET response, with no fixtures or database error exemptions.', 'Touch/coarse and media preferences are browser emulation, not physical-device acceptance.', 'No business writes, authentication, deployment, or source changes are performed by this check.'] };
for (const file of ['src/components/Header.tsx', 'src/components/Header.module.css']) state.sourceFiles[file] = crypto.createHash('sha256').update(fs.readFileSync(`${SOURCE}/${file}`)).digest('hex');
const manifest = JSON.parse(fs.readFileSync(`${SOURCE}/docs/process/header-glass-highlight-20261028/manifest.json`));
expect(state.sourceFiles['src/components/Header.module.css']).toBe(manifest.files['src/components/Header.module.css']);
function sanitize(value) {
  if (typeof value === 'string') return value
    .replace(/([?&](?:sentry_key|api_key|apikey|token|access_token|key)=)[^&#\s"']+/gi, '$1[REDACTED]')
    .replace(/(https?:\/\/)[^\s/@]+@/gi, '$1[REDACTED]@');
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitize(item)]));
  return value;
}
function save() { fs.writeFileSync(`${OUT}/results.json`, JSON.stringify(sanitize(state), null, 2)); }
async function settled(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const finite = document.getAnimations().filter(animation => {
      const timing = animation.effect?.getComputedTiming();
      return timing && Number.isFinite(timing.endTime) && animation.playState !== 'finished';
    });
    await Promise.race([Promise.allSettled(finite.map(animation => animation.finished)), new Promise(resolve => setTimeout(resolve, 3000))]);
  });
}
async function snap(page, label) {
  if (!['selected-zh-1280', 'mobile-selected-zh-375'].includes(label)) return null;
  await settled(page);
  const path = `${OUT}/${label}.png`;
  await page.screenshot({ path, ...(label === 'selected-zh-1280' ? { clip: { x: 0, y: 0, width: page.viewportSize().width, height: 100 } } : {}) });
  return path;
}
async function ready(page, locale) {
  await observer.ready(page, locale, state, page.__acceptanceLabel);
  expect(state.events.filter(event => event.label === page.__acceptanceLabel && event.type === 'anonymous-auth').at(-1)?.noStore).toBe(true);
  await page.locator('#header-overview-products').waitFor({ state: page.viewportSize().width >= 1024 ? 'visible' : 'attached' });
  if (page.viewportSize().width >= 1024) await page.locator(`header a[href="/${locale}/login"]`).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(1, 850);
}
async function routeIs(page, locale, path) {
  await expect.poll(() => new URL(page.url()).pathname).toBe(`/${locale}${path}`);
  await expect(page.getByRole('banner')).toBeVisible();
}
async function geometry(page, mobile = false) {
  const data = await page.evaluate(mobile => {
    const root = mobile ? document.querySelector('#header-mobile-panel') : document.querySelector('header');
    const rect = node => { const box = node.getBoundingClientRect(); return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height }; };
    const controls = [...root.querySelectorAll('a,button')].filter(node => node.getClientRects().length && (!node.closest('[id^="header-panel-"]') || mobile));
    const text = controls.flatMap(node => {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), rows = [], widths = []; let child;
      while ((child = walker.nextNode())) {
        if (!child.nodeValue.trim()) continue;
        const range = document.createRange(); range.selectNodeContents(child);
        for (const box of range.getClientRects()) if (box.width > 1 && box.height > 1) { if (!rows.some(top => Math.abs(top - box.top) < 1)) rows.push(box.top); widths.push(box.width); }
      }
      if (!rows.length) return [];
      return [{ text: node.textContent.trim(), id: node.id, box: rect(node), rows: rows.length, textWidth: Math.max(...widths), transform: getComputedStyle(node).transform }];
    });
    const primary = [...root.querySelectorAll(mobile ? '[id^="header-mobile-overview-"] > span' : '[id^="header-overview-"]')].filter(node => node.getClientRects().length).map(node => {
      const style = getComputedStyle(node), range = document.createRange(); range.selectNodeContents(node);
      return { text: node.textContent, textWidth: range.getBoundingClientRect().width, available: node.getBoundingClientRect().width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight), transform: style.transform };
    });
    return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, root: rect(root), scrollWidth: root.scrollWidth, right: Math.max(...controls.map(node => node.getBoundingClientRect().right)), text, primary };
  }, mobile);
  expect(data.documentWidth).toBeLessThanOrEqual(data.viewport + 1);
  expect(data.scrollWidth).toBeLessThanOrEqual(data.viewport + 1);
  expect(data.right).toBeLessThanOrEqual(data.viewport + 1);
  if (!mobile) for (const text of data.text) expect(text.rows, `Header text must remain one line: ${text.text}`).toBe(1);
  for (const item of data.primary) { expect(item.textWidth, `${item.text} must not be compressed`).toBeLessThanOrEqual(item.available + 1); expect(item.transform).toBe('none'); }
  return data;
}
async function panelGeometry(page, id) {
  const locator = page.locator(`#header-panel-${id}`); await expect(locator).toBeVisible();
  await expect.poll(async () => locator.evaluate(node => Math.abs(node.getBoundingClientRect().top - document.querySelector('header').getBoundingClientRect().bottom))).toBeLessThan(1);
  const data = await locator.evaluate(node => {
    const box = node.getBoundingClientRect(), header = document.querySelector('header').getBoundingClientRect(), group = getComputedStyle(node.parentElement);
    return { left: box.left, width: box.width, top: box.top, headerBottom: header.bottom, viewport: innerWidth, groupPosition: group.position, groupTransform: group.transform, groupBackdrop: group.backdropFilter };
  });
  expect(Math.abs(data.left)).toBeLessThan(1); expect(Math.abs(data.width - data.viewport)).toBeLessThan(1);
  expect(data.groupPosition).toBe('static'); expect(data.groupTransform).toBe('none'); expect(data.groupBackdrop).toBe('none');
  return data;
}
async function glass(locator, pseudo = '::before') {
  return locator.evaluate((node, pseudo) => {
    const leaf = getComputedStyle(node), before = getComputedStyle(node, pseudo), parent = getComputedStyle(node.parentElement);
    return { leafTransform: leaf.transform, parentTransform: parent.transform, outlineStyle: leaf.outlineStyle, outlineWidth: leaf.outlineWidth, opacity: Number(before.opacity), transform: before.transform, transition: before.transitionDuration, backdrop: before.backdropFilter, background: before.backgroundColor, borderColor: before.borderTopColor, borderWidth: before.borderTopWidth, pointerEvents: before.pointerEvents, zIndex: before.zIndex };
  }, pseudo);
}
async function forcePseudo(page, selector, pseudoClasses) {
  const session = await page.context().newCDPSession(page); await session.send('DOM.enable'); await session.send('CSS.enable');
  const { root } = await session.send('DOM.getDocument'); const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector });
  await session.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: pseudoClasses });
  return async () => { await session.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] }); await session.detach(); };
}
async function pressed(page, locator, name, reduced = false) {
  const box = await locator.boundingBox(); await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
  try {
    if (variant === 'candidate') await expect.poll(async () => (await glass(locator)).transform).toBe(reduced ? 'none' : 'matrix(0.96, 0, 0, 0.96, 0, 0)');
    const style = await glass(locator); expect(style.leafTransform).toBe('none'); expect(style.parentTransform).toBe('none');
    if (reduced) expect(style.transition.split(',').every(value => parseFloat(value) === 0)).toBe(true);
    return { style, screenshot: await snap(page, name, true) };
  } finally { await page.mouse.move(1, 850); await page.mouse.up(); await page.keyboard.press('Escape'); }
}
async function test(browser, label, options, run) {
  const context = await observer.createReadOnlyContext(browser, label, options, state);
  expect(typeof context.routeWebSocket).toBe('function');
  const page = await context.newPage(); page.__acceptanceLabel = label; page.setDefaultTimeout(20000);
  try {
    const result = await run(page, context);
    await settled(page);
    await page.waitForLoadState('networkidle', { timeout: 25000 });
    observer.assertHealth(state, label);
    const auth = state.events.filter(event => event.label === label && event.type === 'anonymous-auth');
    expect(auth.length).toBeGreaterThan(0);
    expect(auth.every(event => event.anonymous && event.status === 200 && event.noStore)).toBe(true);
    state.cases.push({ label, status: 'passed', ...result });
  } catch (error) {
    state.cases.push({ label, status: 'failed', error: error.message, url: page.url(), healthIssues: observer.healthIssues(state, label) });
  } finally { await context.close(); save(); }
  console.log(`${label}: ${state.cases.at(-1).status}`);
}
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true }); state.browser = browser.version();
  try {
    for (const width of [1280, 1024]) for (const locale of ['zh', 'en']) await test(browser, `desktop-${locale}-${width}`, { viewport: { width, height: 900 } }, async (page, context) => {
      await ready(page, locale); const actions = [], screenshots = [], bounds = await geometry(page);
      const selected = page.locator('#header-overview-products');
      if (variant === 'candidate') await expect.poll(async () => (await glass(selected)).opacity).toBe(1);
      screenshots.push(await snap(page, `selected-${locale}-${width}`)); const selectedStyle = await glass(selected);
      const resetHover = await forcePseudo(page, '#header-overview-daily', ['hover']);
      if (variant === 'candidate') await expect.poll(async () => (await glass(page.locator('#header-overview-daily'))).opacity).toBe(0.65);
      screenshots.push(await snap(page, `hover-${locale}-${width}`, true)); await resetHover();
      const press = await pressed(page, selected, `pressed-${locale}-${width}`);
      const arrow = page.locator('#header-trigger-learn'); await arrow.focus(); await page.keyboard.press('Enter');
      const panel = await panelGeometry(page, 'learn'); screenshots.push(await snap(page, `expanded-${locale}-${width}`)); await page.keyboard.press('Escape');
      if (visualOnly) return { bounds, panel, selectedStyle, press, screenshots, hoverCapture: 'CDP forced :hover isolates material from menu opening; real hover is tested in candidate regression.' };
      for (const [id, path] of groups) { const link = page.locator(`#header-overview-${id}`); await expect(link).toHaveAttribute('href', `/${locale}${path}`); await link.click(); await routeIs(page, locale, path); await page.mouse.move(1, 850); await expect(page.locator('[id^="header-panel-"]')).toHaveCount(0); actions.push(`name ${id} -> ${path}`); }
      await ready(page, locale); await page.locator('#header-trigger-products').focus(); await selected.hover(); await expect(page.locator('#header-panel-products')).toBeVisible();
      await page.locator('#header-overview-daily').hover(); await expect(page.locator('#header-panel-daily')).toBeVisible(); await page.locator('#header-panel-daily a').first().click(); await routeIs(page, locale, '/daily'); actions.push('focused group A -> hover group B -> first submenu click');
      await page.mouse.move(1, 850); const help = page.locator('#header-overview-help'); await help.focus(); await page.keyboard.press('Enter'); await routeIs(page, locale, '/docs');
      await selected.focus(); await page.keyboard.press('ArrowDown'); await expect(page.locator('#header-panel-products a').first()).toBeFocused(); await page.keyboard.press('Escape'); await expect(selected).toBeFocused();
      const focusStyle = await glass(selected); expect(focusStyle.outlineStyle).toBe('solid'); expect(focusStyle.outlineWidth).toBe('2px'); actions.push('name Enter navigates; ArrowDown/Escape restores name; focus visible');
      const productsArrow = page.locator('#header-trigger-products'); await productsArrow.focus(); await page.keyboard.press('ArrowDown'); await expect(page.locator('#header-panel-products a').first()).toBeFocused(); await page.keyboard.press('Escape'); await expect(productsArrow).toBeFocused();
      const before = page.url(); await page.keyboard.press('Enter'); await expect(productsArrow).toHaveAttribute('aria-expanded', 'true'); await page.keyboard.press('Space'); await expect(productsArrow).toHaveAttribute('aria-expanded', 'false'); expect(page.url()).toBe(before); actions.push('arrow ArrowDown/Escape/Enter/Space stays on route');
      await productsArrow.hover(); await expect(productsArrow).toHaveAttribute('aria-expanded', 'true'); await productsArrow.click(); await expect(productsArrow).toHaveAttribute('aria-expanded', 'false'); await productsArrow.click(); await expect(productsArrow).toHaveAttribute('aria-expanded', 'true'); await page.keyboard.press('Escape'); actions.push('arrow pointer toggles');
      const popupPromise = context.waitForEvent('page'); await selected.click({ modifiers: ['Meta'] }); const popup = await popupPromise; await popup.waitForLoadState('domcontentloaded'); expect(new URL(popup.url()).pathname).toBe(`/${locale}/products`); expect(page.url()).toBe(before); await popup.close(); actions.push('Meta click preserves current page');
      return { bounds, panel, selectedStyle, focusStyle, press, screenshots, actions };
    });
    for (const width of [375, 768]) for (const locale of ['zh', 'en']) await test(browser, `touch-${locale}-${width}`, { viewport: { width, height: 900 }, hasTouch: true, isMobile: width === 375 }, async (page, context) => {
      await ready(page, locale); const screenshots = [], actions = [], bounds = await geometry(page); const hamburger = page.locator('[aria-controls="header-mobile-panel"]'), previousOverflow = await page.evaluate(() => document.body.style.overflow);
      await hamburger.tap(); await expect(page.locator('#header-mobile-panel')).toBeVisible(); await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
      const mobileBounds = await geometry(page, true), selected = page.locator('#header-mobile-overview-products > span');
      if (variant === 'candidate') await expect.poll(async () => (await glass(selected)).opacity).toBe(1);
      const selectedStyle = await glass(selected); screenshots.push(await snap(page, `mobile-selected-${locale}-${width}`));
      const arrow = page.locator('button[aria-controls="header-mobile-products"]'), location = page.url(); await arrow.tap(); await expect(page.locator('#header-mobile-products')).toBeVisible(); expect(page.url()).toBe(location);
      const target = await arrow.boundingBox(); expect(target.width).toBeGreaterThanOrEqual(44); expect(target.height).toBeGreaterThanOrEqual(44); screenshots.push(await snap(page, `mobile-expanded-${locale}-${width}`)); await arrow.tap(); await expect(page.locator('#header-mobile-products')).toHaveCount(0);
      if (visualOnly) return { bounds, mobileBounds, selectedStyle, target, screenshots };
      for (const [id, path] of groups) { if (!await page.locator('#header-mobile-panel').count()) await hamburger.tap(); await page.locator(`#header-mobile-overview-${id}`).tap(); await routeIs(page, locale, path); await expect(page.locator('#header-mobile-panel')).toHaveCount(0); await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(previousOverflow); actions.push(`mobile name ${id} -> ${path}; unlocked`); }
      await hamburger.tap(); await page.keyboard.press('Escape'); await expect(page.locator('#header-mobile-panel')).toHaveCount(0); await expect(hamburger).toBeFocused(); await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe(previousOverflow); actions.push('mobile Escape restores hamburger and scroll');
      return { bounds, mobileBounds, selectedStyle, target, screenshots, actions };
    });
    await test(browser, 'coarse-en-1024', { viewport: { width: 1024, height: 900 }, hasTouch: true }, async page => {
      await ready(page, 'en'); expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true); const bounds = await geometry(page), screenshots = [await snap(page, 'coarse-selected-en-1024')];
      const arrow = page.locator('#header-trigger-learn'), target = await arrow.boundingBox(); expect(target.width).toBeGreaterThanOrEqual(44); await arrow.tap(); const panel = await panelGeometry(page, 'learn'); screenshots.push(await snap(page, 'coarse-expanded-en-1024'));
      if (!visualOnly) { await page.locator('#header-overview-help').tap(); await routeIs(page, 'en', '/docs'); await expect(page.locator('[id^="header-panel-"]')).toHaveCount(0); }
      return { bounds, target, panel, screenshots };
    });
    if (variant === 'candidate' && !visualOnly) for (const preference of ['prefers-reduced-motion', 'prefers-reduced-transparency', 'prefers-contrast']) await test(browser, preference, {}, async (page, context) => {
      const cdp = await context.newCDPSession(page), value = preference === 'prefers-contrast' ? 'more' : 'reduce';
      await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: preference, value }] }); await ready(page, 'en');
      expect(await page.evaluate(({ preference, value }) => matchMedia(`(${preference}: ${value})`).matches, { preference, value })).toBe(true);
      const selected = page.locator('#header-overview-products'); await expect.poll(async () => (await glass(selected)).opacity).toBe(1);
      let press; if (preference === 'prefers-reduced-motion') press = await pressed(page, selected, `${preference}-pressed`, true);
      await page.locator('#header-trigger-learn').focus(); await page.keyboard.press('Enter'); const panel = await panelGeometry(page, 'learn'), selectedStyle = await glass(selected), arrowStyle = await glass(page.locator('#header-trigger-learn'));
      const surface = await page.locator('header').evaluate(node => ({ backdrop: getComputedStyle(node).backdropFilter, panelBackdrop: getComputedStyle(node.querySelector('[id^="header-panel-"]')).backdropFilter }));
      if (preference === 'prefers-reduced-transparency') { expect(selectedStyle.backdrop).toBe('none'); expect(arrowStyle.backdrop).toBe('none'); expect(surface.backdrop).toBe('none'); expect(surface.panelBackdrop).toBe('none'); }
      if (preference === 'prefers-contrast') { expect(selectedStyle.borderColor).toBe('rgb(255, 255, 255)'); expect(selectedStyle.borderWidth).toBe('1px'); expect(selectedStyle.backdrop).toBe('none'); }
      const screenshots = [await snap(page, preference)]; await page.setViewportSize({ width: 375, height: 900 }); await page.locator('[aria-controls="header-mobile-panel"]').click(); await expect(page.locator('#header-mobile-panel')).toBeVisible();
      const mobile = page.locator('#header-mobile-overview-products > span'); await expect.poll(async () => (await glass(mobile)).opacity).toBe(1); const mobileStyle = await glass(mobile);
      if (preference === 'prefers-reduced-motion') { expect(mobileStyle.transform).toBe('none'); expect(mobileStyle.transition).toBe('0s'); }
      if (preference === 'prefers-reduced-transparency') expect(mobileStyle.backdrop).toBe('none');
      if (preference === 'prefers-contrast') { expect(mobileStyle.borderColor).toBe('rgb(255, 255, 255)'); expect(mobileStyle.borderWidth).toBe('1px'); }
      screenshots.push(await snap(page, `mobile-${preference}`)); await cdp.detach(); return { selectedStyle, arrowStyle, mobileStyle, surface, panel, press, screenshots };
    });
  } finally { await browser.close(); state.browserClosed = true; state.finishedAt = new Date().toISOString(); save(); }
  state.summary = { cases: state.cases.length, passed: state.cases.filter(item => item.status === 'passed').length, failed: state.cases.filter(item => item.status === 'failed').length, anonymousAuthReads: state.events.filter(item => item.type === 'anonymous-auth').length, apiReads: state.events.filter(item => item.type === 'api-read').length, staticResponses: state.events.filter(item => item.type === 'static').length, invalidStatic: state.events.filter(item => item.type === 'static' && !item.valid).length, blockedWrites: state.events.filter(item => item.type === 'blocked-write').length, blockedWebSockets: state.events.filter(item => item.type === 'blocked-websocket').length, healthIssues: state.events.filter(item => ['pageerror', 'http-error', 'failed-get'].includes(item.type)).length }; save();
  console.log(JSON.stringify({ passed: state.cases.filter(item => item.status === 'passed').length, failed: state.cases.filter(item => item.status === 'failed').length, results: `${OUT}/results.json` }));
  process.exitCode = state.cases.some(item => item.status === 'failed') ? 1 : 0;
})().catch(error => { state.fatal = error.message; save(); console.error(error); process.exitCode = 2; });
