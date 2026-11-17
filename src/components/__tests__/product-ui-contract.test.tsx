import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import zh from '../../../messages/zh.json';
import en from '../../../messages/en.json';

const state = vi.hoisted(() => ({ locale: 'en' as 'zh' | 'en', signedIn: false }));
vi.mock('next-intl', async original => {
  const intl = await original<typeof import('next-intl')>();
  return { ...intl, useLocale: () => state.locale,
    useTranslations: (namespace: keyof typeof en) => intl.createTranslator({ locale: state.locale, messages: state.locale === 'zh' ? zh : en, namespace }) };
});
vi.mock('next-intl/server', async () => {
  const { createTranslator } = await import('next-intl');
  return { getTranslations: async (namespace: keyof typeof en) => createTranslator({ locale: state.locale, messages: state.locale === 'zh' ? zh : en, namespace }) };
});
vi.mock('next/image', () => ({ default: ({ alt, src }: ImgHTMLAttributes<HTMLImageElement>) => <span role="img" aria-label={alt} data-src={src} /> }));
vi.mock('@/i18n/navigation', () => ({ Link: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} /> }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: state.signedIn ? { id: 'fixture-user' } : null }) }));
vi.mock('../DownloadCard', () => ({ default: ({ fileId, gated, label }: { fileId: string; gated: boolean; label: string }) => <span data-file={fileId} data-gated={gated}>{label}</span> }));

import ProductGallery from '../ProductGallery';
import BlogListClient from '../BlogListClient';
import DownloadSection from '../DownloadSection';
import PermissionNote from '../PermissionNote';
import { xislandPermissionNote } from '@/data/xisland-permission';
import { localizeProduct, products } from '@/data/products';

beforeEach(() => { state.locale = 'en'; state.signedIn = false; });
const product = (id: string) => localizeProduct(products.find(item => item.id === id)!, state.locale);

describe('产品媒体与获取入口', () => {
  /**
   * 画廊有两类格子：宣传片（内联原生播放器）和截图（放大按钮 + 灯箱）。
   * 断言必须按类分别钉：2026-11 换媒体后演示位不再有按钮，原先「每个 figure
   * 都要有 button」的写法把一次刻意的设计变更判成了 bug，红了整整一个提交。
   */
  it('画廊：截图用原生按钮放大，宣传片用原生播放器', () => {
    const html = renderToStaticMarkup(<ProductGallery product={product('xnook')} />);
    const figures = html.match(/<figure\b[\s\S]*?<\/figure>/g) ?? [];
    const film = figures.filter((figure) => figure.includes('<video'));
    const shots = figures.filter((figure) => !figure.includes('<video'));

    // 宣传片：原生控制条 + 不预载，说明文字同样留在播放器外
    expect(film).toHaveLength(1);
    expect(film[0]).toMatch(/<video[^>]*controls/);
    expect(film[0]).toContain('preload="none"');
    expect(film[0]).toContain('<figcaption');
    expect(film[0]).not.toContain('<button');

    // 截图：键盘可达的原生按钮开灯箱，说明文字在按钮外，不拿 div 冒充按钮
    expect(shots.length).toBeGreaterThan(0);
    for (const figure of shots) {
      expect(figure).toContain('<button type="button"');
      expect(figure).toContain('</button><figcaption');
      expect(figure).not.toContain('role="button"');
    }
  });

  it.each(['zh', 'en'] as const)('%s 游客投稿保留登录回跳，已登录直接进入编辑器', locale => {
    state.locale = locale;
    const guest = renderToStaticMarkup(<BlogListClient posts={[]} counts={{}} />);
    expect(guest).toContain('href="/login?next=%2Fblog%2Fsubmit"');
    state.signedIn = true;
    const signedIn = renderToStaticMarkup(<BlogListClient posts={[]} counts={{}} />);
    expect(signedIn).toContain('href="/blog/submit"');
    expect(signedIn).not.toContain('/login?next=');
  });

  it.each(['zh', 'en'] as const)('%s 下载说明跟随现有渠道且不改变门控条目', async locale => {
    state.locale = locale;
    const messages = locale === 'zh' ? zh.ProductDetailPage : en.ProductDetailPage;
    // 源码默认门控；线上由 SOFTWARE_LICENSE_ENABLED 在运行时放开成 14 天试用
    // （`catalog.withDownloads()`，另有 catalog 用例覆盖），静态渲染这里看到的是默认值。
    for (const id of ['xisland', 'xnook']) {
      const html = renderToStaticMarkup(await DownloadSection({ product: product(id) }));
      expect(html).toContain(messages.downloadHintGated);
      expect(html).toContain('data-file="dmg" data-gated="true"');
      expect(html).not.toContain('Gitee');
    }
    const binary = renderToStaticMarkup(await DownloadSection({ product: product('statux') }));
    expect(binary).toContain(messages.downloadHint);
    expect(binary).toContain('data-file="macos-arm64" data-gated="false"');
    expect(binary).toContain('data-file="macos-x64" data-gated="false"');
    const packagePage = renderToStaticMarkup(await DownloadSection({ product: product('omnicrawl') }));
    expect(packagePage).toContain(messages.downloadHintPackage);
    expect(packagePage).toContain('data-file="pypi" data-gated="false"');
  });

  it('没有公开下载条目时不生成空的下载引导', async () => {
    expect(await DownloadSection({ product: { ...product('xnook'), downloads: [] } })).toBeNull();
  });

  it('DuoCast ZIP 下载也显示对应的未公证安装提示', async () => {
    const html = renderToStaticMarkup(await DownloadSection({ product: product('duocast') }));
    expect(html).toContain('data-file="macos-arm64" data-gated="false"');
    expect(html).toContain('xattr -cr &quot;/Applications/DuoCast.app&quot;');
    expect(html).toContain(en.ProductDetailPage.macInstallTitle);
  });

  /**
   * 「继续下一步」要往终端发 ⌘V，macOS 因此要求辅助功能权限；adhoc 签名又让
   * 每次更新都要重新拖一次。这三点此前只存在于应用内提示和 CHANGELOG，
   * 产品页上没有任何落点 —— 用户搜「XIsland 粘贴不了」找不到答案。
   */
  it.each(['zh', 'en'] as const)('%s XIsland 给出辅助功能授权三步与未授权兜底', locale => {
    const copy = xislandPermissionNote[locale];
    const html = renderToStaticMarkup(<PermissionNote productId="xisland" locale={locale} />);

    expect(html).toContain('permission-note');
    expect(html).toContain(copy.title);
    expect(html).toContain(copy.fallback);
    // 拖拽目标与可粘贴路径必须写全，写错一个字符用户就找不到对应条目
    expect(html).toContain('/Applications/X Island.app');
    expect(html).toContain('⌘V');
    // adhoc 签名是「每次更新都要重拖」的原因，不能省掉这个解释
    expect(html).toContain('adhoc');
    // 三步必须是真列表项，读屏才会念出序号；顺序即操作顺序
    expect(html.match(/<li class=/g) ?? []).toHaveLength(3);
    // 「更新后要重拖一次」是最容易被忽略、代价最高的一句，必须加粗强调
    expect(html).toContain('<strong');
  });

  it('辅助功能说明只出现在 XIsland 产品页', () => {
    for (const id of ['xnook', 'duocast', 'statux']) {
      expect(PermissionNote({ productId: id, locale: 'zh' })).toBeNull();
    }
  });

  /**
   * 领取入口原本只挂在下方定价卡的免费档里，而顶部「下载 DMG」是锚点直达下载区，
   * 用户下完就以为结束（装好发现只能试用 14 天，回头也找不到入口）。
   * 这里钉住「下载卡下方必须给出领码去路」，以及已领取时改为指向账户页。
   */
  it.each(['zh', 'en'] as const)('%s 桌面软件在下载卡下方给出领码入口，已领取时改指账户页', async locale => {
    state.locale = locale;
    vi.stubEnv('SOFTWARE_LICENSE_ENABLED', 'true');
    try {
      const messages = locale === 'zh' ? zh.ProductDetailPage : en.ProductDetailPage;
      const nudgeText = messages.licenseClaimNudge.replace(/<\/?claim>/g, '');
      const ownedText = messages.licenseClaimOwned.replace(/<\/?account>/g, '');

      const html = renderToStaticMarkup(await DownloadSection({ product: product('xisland') }));
      expect(html).toContain('href="/products/xisland#pricing"');
      expect(html).toContain(nudgeText.slice(0, 8));
      expect(html).not.toContain('href="/account#software-licenses"');

      const owned = renderToStaticMarkup(
        await DownloadSection({ product: product('xisland'), licenseClaimed: true }),
      );
      expect(owned).toContain('href="/account#software-licenses"');
      expect(owned).toContain(ownedText.slice(0, 6));
      expect(owned).not.toContain('href="/products/xisland#pricing"');

      // 不需要激活码的产品不该被带上领码引导
      const binary = renderToStaticMarkup(await DownloadSection({ product: product('statux') }));
      expect(binary).not.toContain('#pricing');
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
