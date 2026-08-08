'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { FeedPostSummary } from '@/data/blog-feed';

/**
 * 星图导航：把当前博客的全部文章按「事件时间」排成一条蜿蜒的星轨。
 * 每篇文章是一颗星，hover 浮现标题与日期，点击跳转原文。
 * 位置由 slug 哈希决定，刷新不会乱跳；星的大小/亮度随机，模拟夜空。
 */

/** 确定性字符串哈希，保证星的位置每次渲染一致 */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const W = 960;
const H = 460;
const PAD = 48;

interface StarMapProps {
  posts: FeedPostSummary[];
}

export default function StarMap({ posts }: StarMapProps) {
  const t = useTranslations('StarMap');

  const nodes = useMemo(() => {
    const sorted = [...posts].sort((a, b) => a.eventDate.localeCompare(b.eventDate));
    if (sorted.length === 0) return [];
    return sorted.map((p, i) => {
      const r = hashString(p.slug);
      const x = PAD + (i / (sorted.length - 1)) * (W - PAD * 2);
      // 蜿蜒：随时间沿正/余弦摆动 + 一点哈希噪声，让星轨起伏像星座
      const wobble = (r % 100) / 100;
      const y = H / 2 + Math.sin(i * 0.55 + (r % 7) * 0.6) * 130 + (wobble - 0.5) * 70;
      const size = 3 + ((r >> 4) % 40) / 12;
      return { key: p.slug, p, x, y, size };
    });
  }, [posts]);

  const line = nodes.map((n) => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(' ');

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={t('aria')}
      >
        {/* 星轨连线：一条贯穿的银河，把文章串起来 */}
        {nodes.length > 1 && (
          <polyline
            points={line}
            fill="none"
            stroke="rgba(167,139,250,0.35)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {nodes.map(({ key, p, x, y, size }) => (
          <Link key={key} href={p.href} className="group" aria-label={`${p.title}`}>
            <circle
              cx={x}
              cy={y}
              r={size}
              fill="#e8e8f4"
              className="cursor-pointer transition-all duration-200 group-hover:fill-violet-300 group-hover:stroke-violet-300"
              style={{ filter: 'drop-shadow(0 0 2px rgba(167,139,250,0.8))' }}
            >
              <title>{`${p.eventDate} · ${p.title}`}</title>
            </circle>
          </Link>
        ))}
      </svg>

      {/* 图例说明 */}
      <p className="t-footnote absolute bottom-3 left-4 text-white/45">{t('legend')}</p>
    </div>
  );
}