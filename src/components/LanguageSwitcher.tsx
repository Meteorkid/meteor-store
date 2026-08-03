'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    router.replace(pathname, { locale: newLocale });
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
