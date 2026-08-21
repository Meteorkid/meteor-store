'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/navigation';

const BlackHole = dynamic(() => import('./BlackHole'), {
  ssr: false,
  // 占位必须撑满同样的正方形：黑洞容器没有 relative，
  // 早先的 absolute inset-0 会脱出容器并让它塌成 0 高，加载完成时整段布局跳一下
  loading: () => (
    <div className="pointer-events-none w-full aspect-square flex items-center justify-center">
      <div className="h-2/5 w-2/5 animate-pulse rounded-full bg-white/[0.02]" />
    </div>
  ),
});

/**
 * 首页收尾区：黑洞本身就是入口，点它进产品页。
 * 原先这里还有标题 + 描述 + 两个按钮 + 三条信任标签，已整块移除；
 * 组件也不再有 variant——历史上的 subtle 变体从未被任何页面使用。
 */
export default function CTASection() {
  const t = useTranslations('CTASection');

  return (
    <section className="relative py-16 md:py-24 overflow-visible">
      <div className="container mx-auto px-4">
        <Link
          href="/products"
          // 黑洞画在 canvas 里，读屏软件拿不到任何内容，
          // 可访问名只能挂在链接上，否则这就是一个没有名字的链接
          aria-label={t('browseProducts')}
          className="blackhole-link mx-auto w-full max-w-[500px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <BlackHole />
        </Link>
      </div>
    </section>
  );
}
