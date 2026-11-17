import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { products } from '../products';

/**
 * 产品页媒体契约。
 *
 * 2026-11 之前 `public/products/<id>/demo.mp4` 是 GIF 转出来的：360–480px、
 * 5–8fps、20–65KB。页面上糊成一团，而且**没有任何测试拦得住**——数据里只写了
 * 一个路径，路径存在就算过。这里把「画质」折成几条可断言的下限，
 * 至少让下一次误替换在 CI 里当场失败。
 */

const publicPath = (url: string) => resolve(process.cwd(), 'public', url.replace(/^\//, ''));

const withMedia = products.filter((product) => product.media);

describe('产品页媒体', () => {
  it('每款产品都有封面，且至少有宣传片或一张界面实景', () => {
    expect(withMedia.length).toBe(products.length);
    for (const product of withMedia) {
      expect(existsSync(publicPath(product.media!.cover)), `${product.id} 缺封面`).toBe(true);
      // claude-phone-control 的宣传物料只有一段扫码画面，截帧和海报会重复，
      // 所以只放宣传片。除此之外都要求有实景图。
      const hasVisual = Boolean(product.media!.demo) || product.media!.screenshots.length > 0;
      expect(hasVisual, `${product.id} 既没有宣传片也没有截图`).toBe(true);
    }
  });

  it('演示片同时提供 MP4、WebM 与海报帧', () => {
    for (const product of withMedia) {
      const media = product.media!;
      if (!media.demo) continue;
      expect(media.demo.endsWith('.mp4'), `${product.id} 的 demo 必须是 mp4`).toBe(true);
      expect(existsSync(publicPath(media.demo)), `${product.id} 缺 demo.mp4`).toBe(true);
      expect(media.demoWebm, `${product.id} 缺 WebM 备用源`).toBeTruthy();
      expect(existsSync(publicPath(media.demoWebm!)), `${product.id} 的 WebM 不存在`).toBe(true);
      expect(media.demoPoster, `${product.id} 缺海报帧`).toBeTruthy();
      expect(existsSync(publicPath(media.demoPoster!)), `${product.id} 的海报帧不存在`).toBe(true);
    }
  });

  it('演示片不再是 GIF 转码的低清文件', () => {
    for (const product of withMedia) {
      const media = product.media!;
      if (!media.demo) continue;
      const bytes = statSync(publicPath(media.demo)).size;
      // 11–16 秒的 720p 片段，CRF 22 下最小的 ex-memory 也有 1.1MB。
      // 500KB 这条线是给「别再把 40KB 的 GIF 转码塞回来」留的余量。
      expect(bytes, `${product.id} 的 demo.mp4 只有 ${(bytes / 1024).toFixed(0)}KB，疑似 GIF 转码`)
        .toBeGreaterThan(500 * 1024);
    }
  });

  it('截图文件存在，且双语 alt 都不为空', () => {
    for (const product of withMedia) {
      for (const shot of product.media!.screenshots) {
        expect(existsSync(publicPath(shot.src)), `${product.id} 缺 ${shot.src}`).toBe(true);
        expect(statSync(publicPath(shot.src)).size).toBeGreaterThan(8 * 1024);
        expect(shot.alt.zh.trim().length).toBeGreaterThan(4);
        expect(shot.alt.en.trim().length).toBeGreaterThan(4);
      }
    }
  });

  it('不同产品不复用同一个演示片', () => {
    const demos = withMedia.map((product) => product.media!.demo).filter(Boolean);
    expect(new Set(demos).size).toBe(demos.length);
  });
});
