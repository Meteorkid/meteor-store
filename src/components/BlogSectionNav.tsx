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

/** 分区导航：每个分区都是真实路由，可分享、可被收录 */
export default function BlogSectionNav({ activeSectionId }: BlogSectionNavProps) {
  return (
    <nav aria-label="博客分区" className="mb-10 space-y-4">
      <Link
        href="/blog"
        className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
          activeSectionId
            ? 'text-gray-500 hover:bg-white/[0.06] hover:text-white'
            : 'bg-white/10 text-white ring-1 ring-white/20'
        }`}
      >
        全部
      </Link>

      {channelGroups.map(({ channel, sections }) => (
        <div key={channel.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600 sm:w-24">
            {channel.label}
          </span>
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => {
              const count = countBySection(s.id);
              const active = s.id === activeSectionId;
              return (
                <Link
                  key={s.id}
                  href={`/blog/section/${s.slug}`}
                  title={s.description}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    active ? `${s.accent} ring-1` : 'text-gray-500 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {s.label}
                  <span className="ml-1.5 text-xs text-gray-600">{count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
