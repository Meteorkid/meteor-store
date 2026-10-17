'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    // 日期、筛选和栏目锚点也是当前位置的一部分；切换语言不应把它们清空。
    router.replace(`${pathname}${window.location.search}${window.location.hash}`, { locale: newLocale });
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-lg border border-white/10 px-2 py-1 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
      aria-label="Switch language"
    >
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  );
}
