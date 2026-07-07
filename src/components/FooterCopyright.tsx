'use client';

import { useRef } from 'react';
import { showToast } from './EasterEggs';

/** Footer 版权行：hover 眨眼（CSS），连点 5 次有小惊喜 */
export default function FooterCopyright() {
  const taps = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClick = () => {
    taps.current++;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { taps.current = 0; }, 1500);
    if (taps.current >= 5) {
      taps.current = 0;
      showToast('再点也不会掉钱出来啦');
    }
  };

  return (
    <p
      className="footer-wink text-muted-foreground text-sm cursor-default select-none"
      onClick={onClick}
    >
      <span className="wink-default">© {new Date().getFullYear()} Meteor Store · 某个还在攒学费的大学生</span>
      <span className="wink-alt">© {new Date().getFullYear()} Meteor Store · (｡•̀ᴗ-)✧ 被你发现了</span>
    </p>
  );
}
