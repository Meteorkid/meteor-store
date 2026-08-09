'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { FeedPostSummary } from '@/data/blog-feed';
import { FOUR_SYMBOLS, MANSION_GROUPS } from '@/data/celestial';
import type { Locale } from '@/i18n/routing';

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
const H = 500;
const PAD = 120;
const FRAME = { left: 62, right: 898, top: 62, bottom: 438 };

interface StarMapProps {
  posts: FeedPostSummary[];
}

export default function StarMap({ posts }: StarMapProps) {
  const t = useTranslations('StarMap');
  const locale = useLocale() as Locale;

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
        <MansionFrame locale={locale} />

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
      <p className="t-footnote border-t border-white/[0.06] px-4 py-3 text-white/45">{t('legend')}</p>
    </div>
  );
}

/** 二十八宿外缘：四组七宿只提供文化方位感，不参与文章导航。 */
function MansionFrame({ locale }: { locale: Locale }) {
  const [east, south, west, north] = MANSION_GROUPS;
  const width = FRAME.right - FRAME.left;
  const height = FRAME.bottom - FRAME.top;
  const horizontalX = (index: number) => FRAME.left + ((index + 0.5) / 7) * width;
  const verticalY = (index: number) => FRAME.top + ((index + 0.5) / 7) * height;

  const color = (symbolId: (typeof MANSION_GROUPS)[number]['symbolId'], alpha: number) =>
    `rgb(${FOUR_SYMBOLS[symbolId].rgb} / ${alpha})`;

  return (
    <g aria-hidden="true">
      <rect
        x={FRAME.left}
        y={FRAME.top}
        width={width}
        height={height}
        rx="18"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      <text x={W / 2} y="20" textAnchor="middle" fill={color(east.symbolId, 0.62)} fontSize="11">
        {FOUR_SYMBOLS[east.symbolId].label[locale]}
      </text>
      {east.mansions.map((mansion, index) => {
        const x = horizontalX(index);
        return (
          <g key={`east-${mansion}`}>
            <line x1={x} y1={FRAME.top} x2={x} y2={FRAME.top + 8} stroke={color(east.symbolId, 0.52)} />
            <text x={x} y={FRAME.top - 12} textAnchor="middle" fill={color(east.symbolId, 0.72)} fontSize="12">
              {mansion}
            </text>
          </g>
        );
      })}

      <text
        x={W - 18}
        y={H / 2}
        textAnchor="middle"
        fill={color(south.symbolId, 0.62)}
        fontSize="11"
        transform={`rotate(90 ${W - 18} ${H / 2})`}
      >
        {FOUR_SYMBOLS[south.symbolId].label[locale]}
      </text>
      {south.mansions.map((mansion, index) => {
        const y = verticalY(index);
        return (
          <g key={`south-${mansion}`}>
            <line x1={FRAME.right - 8} y1={y} x2={FRAME.right} y2={y} stroke={color(south.symbolId, 0.52)} />
            <text x={FRAME.right + 14} y={y + 4} fill={color(south.symbolId, 0.72)} fontSize="12">
              {mansion}
            </text>
          </g>
        );
      })}

      <text x={W / 2} y={H - 8} textAnchor="middle" fill={color(west.symbolId, 0.62)} fontSize="11">
        {FOUR_SYMBOLS[west.symbolId].label[locale]}
      </text>
      {west.mansions.map((mansion, index) => {
        const x = horizontalX(index);
        return (
          <g key={`west-${mansion}`}>
            <line x1={x} y1={FRAME.bottom - 8} x2={x} y2={FRAME.bottom} stroke={color(west.symbolId, 0.52)} />
            <text x={x} y={FRAME.bottom + 24} textAnchor="middle" fill={color(west.symbolId, 0.72)} fontSize="12">
              {mansion}
            </text>
          </g>
        );
      })}

      <text
        x="18"
        y={H / 2}
        textAnchor="middle"
        fill={color(north.symbolId, 0.62)}
        fontSize="11"
        transform={`rotate(-90 18 ${H / 2})`}
      >
        {FOUR_SYMBOLS[north.symbolId].label[locale]}
      </text>
      {north.mansions.map((mansion, index) => {
        const y = verticalY(index);
        return (
          <g key={`north-${mansion}`}>
            <line x1={FRAME.left} y1={y} x2={FRAME.left + 8} y2={y} stroke={color(north.symbolId, 0.52)} />
            <text x={FRAME.left - 14} y={y + 4} textAnchor="end" fill={color(north.symbolId, 0.72)} fontSize="12">
              {mansion}
            </text>
          </g>
        );
      })}
    </g>
  );
}
