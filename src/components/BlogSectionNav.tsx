import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import { getSectionsByChannel, type BlogSectionId } from '@/data/blog-sections';

const channelGroups = getSectionsByChannel();

function countBySection(sectionId: BlogSectionId): number {
  return blogPosts.filter((p) => p.section === sectionId).length;
}

interface BlogSectionNavProps {
  /** 当前所在分区，未传表示「全部」 */
  activeSectionId?: BlogSectionId;
}

/**
 * 分区导航：单条横向 rail，频道之间用发丝竖线分隔。
 * 每个分区是真实路由，可分享、可被收录。
 */
export default function BlogSectionNav({ activeSectionId }: BlogSectionNavProps) {
  return (
    <nav aria-label="博客分区" className="-mx-4 mb-14 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max items-center gap-1 text-sm">
        <Link
          href="/blog"
          aria-current={activeSectionId ? undefined : 'page'}
          className={`rounded-full px-3.5 py-1.5 font-medium transition-colors duration-200 ${
            activeSectionId
              ? 'text-white/40 hover:text-white'
              : 'bg-white/[0.08] text-white shadow-[inset_0_-2px_0_rgba(255,255,255,0.45)]'
          }`}
        >
          全部
        </Link>

        {channelGroups.map(({ channel, sections }) => (
          <div key={channel.id} className="flex items-center gap-1">
            <span aria-hidden className="mx-3 h-4 w-px shrink-0 bg-white/10" />
            <span className="mr-1 shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
              {channel.label}
            </span>
            {sections.map((s) => {
              const count = countBySection(s.id);
              const active = s.id === activeSectionId;
              return (
                <Link
                  key={s.id}
                  href={`/blog/section/${s.slug}`}
                  title={s.description}
                  aria-current={active ? 'page' : undefined}
                  style={{ '--tab-accent': s.rgb } as React.CSSProperties}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 font-medium transition-colors duration-200 ${
                    active ? 'blog-tab--active' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {s.label}
                  {count > 0 && (
                    <sup className="ml-1 text-[10px] font-normal tabular-nums opacity-50">{count}</sup>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
