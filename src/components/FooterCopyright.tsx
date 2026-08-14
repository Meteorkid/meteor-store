'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { OPERATOR } from '@/lib/constants';
import { showToast } from './EasterEggs';
import OnlineVisitors from './OnlineVisitors';

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
  // 管局要求「版权所有」与备案主体一致。眨眼彩蛋那行同样要带主体名——
  // 两行都在 DOM 里，缺主体的 © 声明会被判定为不一致
  const copyright = t('copyrightOperator', { year, operator: OPERATOR.name });
  const copyrightAlt = t('copyrightOperatorAlt', { year, operator: OPERATOR.name });

  return (
    <div className="space-y-2">
      <p
        className="footer-wink text-muted-foreground text-sm cursor-default select-none"
        onClick={onClick}
      >
        <span className="wink-default">{copyright}</span>
        <span className="wink-alt">{copyrightAlt}</span>
      </p>
      {/* 备案信息：未取得的项留空即不渲染，避免把占位符挂到线上被管局驳回 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
        {OPERATOR.icp && (
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            {OPERATOR.icp}
          </a>
        )}
        {OPERATOR.police && (
          <a
            href="https://beian.mps.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            {OPERATOR.police}
          </a>
        )}
      </div>
      <OnlineVisitors />
    </div>
  );
}
