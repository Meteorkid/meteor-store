import type { CSSProperties, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

/**
 * 分区页的统一骨架。
 *
 * 首页保留沉浸式 Hero；其余内容页统一成「顶部信息条 → 横向栏目条 → 正文」。
 * 这样产品、博客、帮助、定价、竞赛、Pathfinder 不再各自发明一套页头，
 * 也让页面宽度回到同一把尺子上。
 */
export function SectionMasthead({
  eyebrow,
  title,
  description,
  actions,
  aside,
  accent,
  className = '',
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  /** RGB 三通道，例如 "94 234 212" */
  accent?: string;
  className?: string;
}) {
  const eyebrowStyle: CSSProperties | undefined = accent
    ? { color: `rgb(${accent} / 0.95)` }
    : undefined;

  return (
    <header className={`border-b border-white/10 ${className}`}>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-end lg:gap-12">
        <div className="min-w-0">
          <p className="t-eyebrow mb-4 flex items-center gap-2.5 text-violet-300" style={eyebrowStyle}>
            <span
              aria-hidden="true"
              className="h-px w-6 bg-current opacity-60"
            />
            {eyebrow}
          </p>
          <h1 className="t-title-1 max-w-4xl text-balance text-white">{title}</h1>
          {description && (
            <p className="t-body mt-4 max-w-[42rem] text-pretty text-white/65">{description}</p>
          )}
          {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </div>
    </header>
  );
}

export interface SectionTabItem {
  href: string;
  label: ReactNode;
  active?: boolean;
  count?: number;
  title?: string;
}

/**
 * 一条横向栏目条，替代 Pathfinder 的左栏和帮助中心的胶囊群。
 *
 * - 桌面端整行排列，窄屏横向滚动；
 * - active 只表达当前页面，不改变链接语义；
 * - 以底边细线为骨架，不再给每个 tab 套一个胶囊。
 */
export function SectionTabs({
  items,
  ariaLabel,
  accent,
  className = '',
}: {
  items: SectionTabItem[];
  ariaLabel: string;
  accent?: string;
  className?: string;
}) {
  const activeColor = accent ? `rgb(${accent})` : 'rgb(196 181 253)';

  return (
    <nav aria-label={ariaLabel} className={`border-b border-white/10 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="relative">
          <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const content = (
              <>
                <span style={item.active ? { color: activeColor } : undefined}>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-[11px] tabular-nums text-white/60">{item.count}</span>
                )}
              </>
            );
            const className = `relative inline-flex min-h-12 shrink-0 items-center gap-1.5 px-3.5 text-sm transition-colors duration-200 after:absolute after:inset-x-3 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 ${
              item.active
                ? 'font-semibold text-white after:scale-x-100'
                : 'text-white/55 hover:text-white/85'
            }`;
            const key = `${item.href}-${String(item.label)}`;

            return item.href.startsWith('#') ? (
              <a
                key={key}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                title={item.title}
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link
                key={key}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                title={item.title}
                className={className}
                style={item.active ? { color: activeColor } : undefined}
              >
                {content}
              </Link>
            );
          })}
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black via-black/50 to-transparent sm:hidden"
          />
        </div>
      </div>
    </nav>
  );
}

/** 主内容 + 侧栏。栏目条已经承担一级导航，侧栏只放辅助信息。 */
export function SectionSplit({
  main,
  aside,
  className = '',
}: {
  main: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-10 ${aside ? 'lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12' : ''} ${className}`}>
      <div className="min-w-0">{main}</div>
      {aside && <aside className="min-w-0 space-y-6">{aside}</aside>}
    </div>
  );
}

/** 统一的页面内容宽度。 */
export const sectionContainer = 'mx-auto w-full max-w-7xl px-4';
