'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { SITE_URL } from '@/lib/constants';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    if (/^\/blog\/tag\/[^/]+\/?$/.test(pathname)) {
      // 标签集合不一定跨语言存在；只跟随页面已核实的对应地址。
      const href = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${newLocale}"]`)?.getAttribute('href');
      let targetPath = '/blog/tags';
      if (href) {
        try {
          const target = new URL(href, window.location.origin);
          if ([window.location.origin, new URL(SITE_URL).origin].includes(target.origin)
              && !target.username && !target.password
              && new RegExp(`^/${newLocale}/blog/tag/[^/]+/?$`).test(target.pathname)) {
            targetPath = `${target.pathname.slice(newLocale.length + 1)}${window.location.search}${window.location.hash}`;
          }
        } catch { /* 无效对应地址回退到目标语言的标签目录。 */ }
      }
      router.replace(targetPath, { locale: newLocale });
      return;
    }
    // 日期、筛选和栏目锚点也是当前位置的一部分；切换语言不应把它们清空。
    router.replace(`${pathname}${window.location.search}${window.location.hash}`, { locale: newLocale });
  };

  return (
    <button
      onClick={handleClick}
      className="site-language-switch relative inline-flex h-10 min-w-10 cursor-pointer items-center justify-center px-1 text-xs font-semibold tracking-[0.14em] text-[var(--site-header-accent)] transition-colors duration-150 hover:text-white focus-visible:text-white max-lg:h-11 max-lg:min-w-11 max-lg:text-[13px] after:absolute after:bottom-1 after:inset-x-2.5 after:h-px after:bg-current after:opacity-40 after:transition-opacity after:content-[''] hover:after:opacity-100 focus-visible:after:opacity-100"
      aria-label={locale === 'zh' ? '切换到英文' : 'Switch to Chinese'}
      title={locale === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  );
}
