import { expect, test } from '@playwright/test';

/**
 * 产品卡片的演示片必须「进入视口就播」，不需要鼠标悬浮。
 *
 * 早先是悬浮才播（GIF 时代沿用下来的），代价是卡片在鼠标碰上去之前完全静止，
 * 而移动端压根没有悬浮——那里的演示片从来没被看见过。
 *
 * 这条只能用真实浏览器验：IntersectionObserver 与 muted autoplay 的行为
 * 依赖真实布局与页面可见性，jsdom 给不了。
 */
test.describe('产品演示片自动播放', () => {
  test('滚到视口内即自动播放，全程不碰鼠标', async ({ page }) => {
    await page.goto('/zh/products');

    // 取第一个可见的演示片。列表页会为不同断点渲染多套卡片，
    // display:none 的那套不会触发 IntersectionObserver，必须挑真正可见的。
    const video = page.locator('video[src*="demo.mp4"]:visible').first();
    await expect(video).toBeAttached();

    await video.scrollIntoViewIfNeeded();

    // 播放进度真的在推进，才算「在播」——只看 paused 会被
    // 「已 play() 但因缓冲停在 0」蒙混过去
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.currentTime), {
        timeout: 15000,
        message: '演示片没有自动播放（currentTime 始终为 0）',
      })
      .toBeGreaterThan(0);

    const state = await video.evaluate((v: HTMLVideoElement) => ({
      paused: v.paused,
      muted: v.muted,
      loop: v.loop,
      display: getComputedStyle(v).display,
    }));

    expect(state.paused, '应处于播放状态').toBe(false);
    // muted 是 autoplay 能成立的前提，loop 让短片持续循环
    expect(state.muted).toBe(true);
    expect(state.loop).toBe(true);
    // display 不能是 none（那是老版本靠 hidden 藏起来的写法）
    expect(state.display).not.toBe('none');

    // 淡入是 500ms 的 transition，必须轮询等它走完——
    // 开播那一刻取样只会拿到 0.0x，那是过渡中间态不是最终值
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => Number(getComputedStyle(v).opacity)), {
        timeout: 5000,
        message: '演示片开播后应淡入到完全不透明',
      })
      .toBeGreaterThan(0.9);
  });

  test('全部演示片预加载，滚到哪张都能立刻动起来', async ({ page }) => {
    await page.goto('/zh/products');

    // 12 个演示片合计约 1.07MB，全量预加载换取滚动时不卡顿是划算的
    // （改造前那批 GIF 是 6.5MB，还靠 display:none 隐藏，照样会下载）。
    const all = await page.evaluate(() => {
      const vids = [...document.querySelectorAll<HTMLVideoElement>('video[src*="demo.mp4"]')];
      return {
        总数: vids.length,
        preload全为auto: vids.every((v) => v.getAttribute('preload') === 'auto'),
      };
    });

    expect(all.总数).toBeGreaterThan(0);
    expect(all.preload全为auto, '演示片应 preload="auto"，滚到眼前时已缓冲好').toBe(true);

    // 页面底部、还没滚到的那张也应完成缓冲（readyState ≥ 2 = HAVE_CURRENT_DATA）
    const last = page.locator('video[src*="demo.mp4"]:visible').last();
    await expect
      .poll(() => last.evaluate((v: HTMLVideoElement) => v.readyState), {
        timeout: 20000,
        message: '未滚到的演示片也应预加载好',
      })
      .toBeGreaterThanOrEqual(2);
  });

  test('有演示片的卡片不再请求封面图，静态态就是视频第一帧', async ({ page }) => {
    const coverRequests: string[] = [];
    page.on('request', (r) => {
      const u = r.url();
      if (u.includes('/_next/image') && u.includes('cover.webp')) coverRequests.push(u);
    });

    await page.goto('/zh/products');
    await page.waitForTimeout(6000);

    // 封面走 /_next/image，而部署会清空 .next/cache/images——缓存冷时
    // 每张都要在 2G 内存的机器上现做一次 sharp 转换，头几个访客会看到裂图。
    // 卡片改用视频第一帧当静态态后，这条链路就不该再被碰到了。
    expect(
      coverRequests,
      `产品卡片不应再请求封面优化图，实际请求了 ${coverRequests.length} 次`,
    ).toEqual([]);

    /*
      **必须查全部，不能只查第一个。**
      这条起初写成 .first()，结果放过了一个真 bug：preload="auto" 下视频常在
      React 挂上监听之前就 loadeddata 完了，onLoadedData 收不到、ready 恒为 false，
      于是视频在播（paused=false、currentTime 一直走）但 opacity 卡在 0，
      整排卡片全是空的。只看第一个恰好躲过去了。
    */
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const vids = [...document.querySelectorAll<HTMLVideoElement>('video[src*="demo.mp4"]')];
            const 就绪 = vids.filter((v) => v.readyState >= 2);
            const 可见 = 就绪.filter((v) => Number(getComputedStyle(v).opacity) > 0.9);
            return 就绪.length > 0 && 可见.length === 就绪.length;
          }),
        { timeout: 15000, message: '每个已拿到第一帧的演示片都应淡入可见' },
      )
      .toBe(true);
  });
});
