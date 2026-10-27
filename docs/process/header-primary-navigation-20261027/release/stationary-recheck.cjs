const { chromium, expect } = require('/Users/meteor/github/meteor-store/node_modules/@playwright/test');
const fs = require('fs');
const { BASE, RELEASE, createReadOnlyContext, ready, assertHealth } = require('./production-observer.cjs');
const OUT = '/tmp/meteor-header-production-20261027';
if (!process.argv.includes('--run')) { console.log('Prepared; wait for explicit deployed confirmation before --run'); process.exit(0); }
const result = { startedAt: new Date().toISOString(), base: BASE, release: RELEASE, guestStub: false, readOnly: true, trials: [], events: [] };
const save = () => fs.writeFileSync(OUT + '/stationary-results.json', JSON.stringify(result, null, 2));
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  result.browser = browser.version();
  try {
    for (let trial = 0; trial < 5; trial++) {
      const label = `stationary-${trial}`;
      const context = await createReadOnlyContext(browser, label, { viewport: { width: 1024, height: 900 } }, result);
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      try {
        await ready(page, 'en', result, label);
        await page.locator('#header-overview-products').click();
        await expect(page).toHaveURL(/\/en\/products$/);
        const name = page.locator('#header-overview-daily');
        const box = await name.boundingBox(), point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
        await page.evaluate(() => { window.previousHeaderForStationaryTest = document.querySelector('header'); });
        await page.mouse.click(point.x, point.y);
        await expect(page).toHaveURL(/\/en\/daily$/);
        await expect(page.getByRole('banner')).toBeVisible();
        await page.waitForLoadState('networkidle', { timeout: 25000 });
        const observation = await page.evaluate(() => new Promise(resolve => {
          const started = performance.now(), samples = [];
          const sample = () => {
            samples.push({ time: performance.now(), panels: document.querySelectorAll('[id^="header-panel-"]').length, oldHeaderConnected: window.previousHeaderForStationaryTest.isConnected });
            if (performance.now() - started >= 700) resolve(samples); else requestAnimationFrame(sample);
          };
          sample();
        }));
        expect(observation.every(sample => sample.panels === 0)).toBe(true);
        if (trial === 0) await page.screenshot({ path: OUT + '/stationary-closed.png' });
        const arrow = page.locator('#header-trigger-daily');
        await arrow.focus(); await page.keyboard.press('Enter');
        await expect(page.locator('#header-panel-daily')).toBeVisible();
        await page.keyboard.press('Escape'); await expect(arrow).toBeFocused();
        await page.mouse.move(point.x + 3, point.y);
        await expect(page.locator('#header-panel-daily')).toBeVisible();
        await page.mouse.move(1, 850); await expect(page.locator('#header-panel-daily')).toHaveCount(0);
        await page.mouse.click(point.x, point.y); await expect(page).toHaveURL(/\/en\/daily$/);
        await page.mouse.move(point.x, 400); await page.mouse.move(point.x, point.y);
        await expect(page.locator('#header-panel-daily')).toBeVisible();
        await arrow.click(); await expect(arrow).toHaveAttribute('aria-expanded', 'false');
        await arrow.click(); await expect(arrow).toHaveAttribute('aria-expanded', 'true');
        await page.waitForLoadState('networkidle', { timeout: 25000 });
        assertHealth(result, label);
        result.trials.push({ trial, label, status: 'passed', point, stationarySamples: observation.length, oldHeaderDetached: observation.some(sample => !sample.oldHeaderConnected), groupMoveRestoresHover: true, leaveAndReturnSamePoint: true, arrowKeyboardAndPointer: true });
        if (trial === 4) {
          await page.evaluate(async () => {
            await new Promise(requestAnimationFrame);
            const animations = document.getAnimations().filter(animation => animation.effect && Number.isFinite(animation.effect.getTiming().iterations));
            await Promise.allSettled(animations.map(animation => animation.finished));
          });
          await page.screenshot({ path: OUT + '/stationary-final.png' });
        }
      } catch (error) {
        result.trials.push({ trial, label, status: 'failed', error: error.message, url: page.url() });
        try { await page.screenshot({ path: OUT + '/stationary-failure-' + trial + '.png' }); } catch {}
      } finally { await context.close(); save(); }
      console.log(label, result.trials.at(-1).status);
    }
  } finally { await browser.close(); result.finishedAt = new Date().toISOString(); save(); }
  process.exitCode = result.trials.some(trial => trial.status === 'failed') ? 1 : 0;
})().catch(error => { result.fatal = error.message; save(); console.error(error); process.exitCode = 2; });
