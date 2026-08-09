'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Dancing_Script } from 'next/font/google';
import { getCelestialSeason } from '@/lib/celestial-season';

const cursive = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  preload: true,
});

/**
 * 站主文章末尾的签名区块。
 *
 * 样式参考 /story 页面（StoryLetter.tsx）的签名区：流星划线 + 手写体 Meteor + 店主落款。
 * 简化掉羽毛笔装饰——每篇文章都带羽毛笔太重，保留核心仪式感即可。
 * 流星线动画用 IntersectionObserver 滚动到可见时触发，和 /story 一致。
 */
export default function PostSignature({ date }: { date: string }) {
  const t = useTranslations('PostSignature');
  const streakRef = useRef<HTMLDivElement>(null);
  const season = getCelestialSeason(date);

  useEffect(() => {
    const el = streakRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate');
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-16 pt-8">
      {/* 流星划线 */}
      <div ref={streakRef} className="story-meteor-line" aria-hidden="true">
        <div className="story-meteor-line__track" />
        <div className="story-meteor-line__glow" />
      </div>
      {/* 手写签名 + 落款 */}
      <div className="pt-5 text-right">
        <p className={`${cursive.className} text-3xl md:text-4xl text-purple-300/80 mb-1.5`}>
          Meteor
        </p>
        <p className="text-white/50 text-sm">{t('signature')}</p>
      {/* 星宿收尾：斗柄随文章日期指向当季方位 */}
        <p className="text-white/30 text-xs mt-2 tabular-nums">{t(`starlog.${season}`)}</p>
      </div>
    </div>
  );
}
