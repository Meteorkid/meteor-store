'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/navigation';

const BlackHole = dynamic(() => import('./BlackHole'), {
  ssr: false,
  // 占位必须撑满同样的正方形：黑洞容器没有 relative，
  // 早先的 absolute inset-0 会脱出容器并让它塌成 0 高，加载完成时整段布局跳一下
  loading: () => <BlackHolePlaceholder />,
});

function BlackHolePlaceholder() {
  return (
    <div className="pointer-events-none w-full aspect-square flex items-center justify-center" aria-hidden="true">
      <div className="h-2/5 w-2/5 animate-pulse rounded-full bg-white/[0.02]" />
    </div>
  );
}

/**
 * 首页收尾区：黑洞本身就是入口，点它进产品页。
 * **有意不加任何悬浮效果**（放大 / 提亮都试过又撤了）：它就该静静待在那儿。
 * 桌面端的可点提示由 <a> 自带的指针形状承担，键盘用户由 focus-visible 焦点环承担。
 * 原先这里还有标题 + 描述 + 两个按钮 + 三条信任标签，已整块移除；
 * 组件也不再有 variant——历史上的 subtle 变体从未被任何页面使用。
 */
export default function CTASection() {
  const t = useTranslations('CTASection');
  const sectionRef = useRef<HTMLElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      const frame = window.requestAnimationFrame(() => setNearViewport(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      // 提前一屏左右开始加载：用户滚到这里时通常已经加载完成，
      // 但首页首屏不必为页尾的黑洞付出 Three.js 的下载与执行成本。
      { rootMargin: '600px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-visible">
      <div className="container mx-auto px-4">
        <Link
          href="/products"
          // 黑洞画在 canvas 里，读屏软件拿不到任何内容，
          // 可访问名只能挂在链接上，否则这就是一个没有名字的链接
          aria-label={t('browseProducts')}
          className="block mx-auto w-full max-w-[500px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          {nearViewport ? <BlackHole /> : <BlackHolePlaceholder />}
        </Link>
      </div>
    </section>
  );
}
