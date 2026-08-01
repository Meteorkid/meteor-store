'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { showToast } from './EasterEggs';

/** Footer 版权行：hover 眨眼（CSS），连点 5 次有小惊喜 */
export default function FooterCopyright() {
  const t = useTranslations('Footer');
  const taps = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClick = () => {
    taps.current++;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { taps.current = 0; }, 1500);
    if (taps.current >= 5) {
      taps.current = 0;
      showToast(t('copyrightTapReward'));
    }
  };

  const year = new Date().getFullYear();

  return (
    <div className="space-y-2">
      <p
        className="footer-wink text-muted-foreground text-sm cursor-default select-none"
        onClick={onClick}
      >
        <span className="wink-default">{t('copyrightLine1', { year })}</span>
        <span className="wink-alt">{t('copyrightLine2', { year })}</span>
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
        <a
          href="https://beian.miit.gov.cn"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors"
        >
          {t('icpPlaceholder')}
        </a>
        <a
          href="https://beian.mps.gov.cn"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors"
        >
          {t('policePlaceholder')}
        </a>
        <span>{t('operatorPlaceholder')}</span>
      </div>
    </div>
  );
}
