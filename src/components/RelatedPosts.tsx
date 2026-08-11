'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { RelatedPost } from '@/lib/related-posts';

interface RelatedPostsProps {
  posts: RelatedPost[];
  /** 当前文章的四象色（用于星点着色），可选 */
  accentRgb?: string;
}

function reasonLabel(reason: string, t: (key: string, values?: Record<string, string | number | Date>) => string): string {
  if (reason.startsWith('tag:')) {
    return t('reasonTag', { tag: reason.slice(4) });
  }
  if (reason.startsWith('section:')) {
    return t('reasonSection', { section: reason.slice(8) });
  }
  return '';
}

export default function RelatedPosts({ posts, accentRgb }: RelatedPostsProps) {
  const t = useTranslations('RelatedPosts');

  if (posts.length === 0) return null;

  const starColor = accentRgb ? `rgb(${accentRgb})` : 'rgba(167,139,250,0.6)';

  return (
    <section className="mt-20" aria-labelledby="related-heading">
      <h2 id="related-heading" className="t-title-4 mb-1 text-white">
        {t('title')}
      </h2>
      <p className="t-footnote mb-6 text-white/30">{t('asterism')}</p>

      {/* 桌面端：星点 + 连线布局 */}
      <div className="hidden md:block">
        <svg
          viewBox="0 0 400 120"
          className="h-auto w-full"
          aria-hidden="true"
          role="presentation"
        >
          {/* 主星（当前文章） */}
          <circle cx="40" cy="60" r="5" fill="#e8e8f4" opacity="0.9">
            <title>{t('currentStar')}</title>
          </circle>

          {/* 连线：主星到伴星 */}
          {posts.map((_, i) => {
            const cx = 140 + i * 120;
            return (
              <line
                key={`line-${i}`}
                x1="45"
                y1="58"
                x2={cx - 4}
                y2={40 + i * 30}
                stroke={starColor}
                strokeWidth="0.8"
                strokeDasharray={i === 0 ? undefined : '3 3'}
                opacity={0.35}
              />
            );
          })}

          {/* 伴星 */}
          {posts.map((post, i) => {
            const cx = 140 + i * 120;
            const cy = 40 + i * 30;
            const size = 3.5 - i * 0.3;
            return (
              <g key={post.href}>
                <circle cx={cx} cy={cy} r={size} fill={starColor} opacity="0.7" />
                <text x={cx} y={cy - 10} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10">
                  {post.title.slice(0, 12)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 移动端 + 通用链接列表（无障碍） */}
      <div className="space-y-5">
        {posts.map((post) => (
          <Link
            key={post.href}
            href={post.href}
            className="block group"
          >
            <div className="flex items-baseline gap-3">
              {/* 小星点 */}
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: starColor, opacity: 0.6 }}
              />
              <div>
                <span className="t-body text-white/80 group-hover:text-white transition-colors">
                  {post.title}
                </span>
                <p className="t-footnote mt-1 text-white/45">
                  {post.date.replace(/-/g, '.')}
                  {post.reason && (
                    <span className="ml-2 text-white/30">
                      · {reasonLabel(post.reason, t)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
