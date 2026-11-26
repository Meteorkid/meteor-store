import type { CSSProperties, ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogSectionRail from './BlogSectionRail';
import BlogSectionToolbar from './BlogSectionToolbar';
import type { Locale } from '@/i18n/routing';

interface BlogPageShellProps {
  locale: Locale;
  activeSectionId?: string;
  activeStarMap?: boolean;
  header: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * 博客页的统一骨架：Header → 紧凑页头 → 顶部胶囊工具条 → 正文。
 * xl 以上在正文左侧的留白里再放一条常驻分区索引；它不占正文宽度，
 * 滚动时吸顶跟随，和顶部胶囊分别承担“随时切换”和“始终知道在哪”。
 */
export default function BlogPageShell({
  locale,
  activeSectionId,
  activeStarMap,
  header,
  children,
  className = '',
  style,
}: BlogPageShellProps) {
  return (
    <div className="blog-scope min-h-screen bg-black text-white" style={style}>
      <Header />
      <main className="relative">
        <div aria-hidden="true" className="blog-glow" />
        <aside className="pointer-events-none absolute inset-y-0 left-[calc(50%_-_624px)] z-10 hidden w-[168px] xl:block">
          <div className="pointer-events-auto sticky top-[88px] pt-6">
            <BlogSectionRail
              locale={locale}
              activeSectionId={activeSectionId}
              activeStarMap={activeStarMap}
            />
          </div>
        </aside>
        <div className={`mx-auto w-full max-w-4xl px-4 pb-10 pt-6 md:pb-14 md:pt-7 ${className}`}>
          {header}
          <BlogSectionToolbar
            locale={locale}
            activeSectionId={activeSectionId}
            activeStarMap={activeStarMap}
          />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

