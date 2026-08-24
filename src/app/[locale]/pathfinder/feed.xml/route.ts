import { listCatalogItems } from '@/lib/pathfinder/catalog';
import {
  formatCatalogDeadlineDate,
  localizedText,
  sortCatalogItems,
} from '@/lib/pathfinder/catalog-view';
import { buildGenericRssFeed, FEED_HEADERS } from '@/lib/feed';

/**
 * Pathfinder 机会库 RSS。
 *
 * 按「最近新增」而不是默认排序输出：订阅者要的是增量，
 * 而默认排序会把临近截止的老条目顶到最前面，每次抓取都像有新内容。
 *
 * 动态渲染而不是 force-static：条目由定时同步写入数据库，没有一个
 * 可以挂 revalidatePath 的发布动作；缓存交给 FEED_HEADERS 的 max-age。
 */
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const pathfinderLocale = locale === 'en' ? 'en' : 'zh';
  const items = sortCatalogItems(
    (await listCatalogItems()).filter((item) => item.status === 'published'),
    'recent',
  ).slice(0, 50);

  const xml = buildGenericRssFeed(
    items.map((item) => {
      const deadline = formatCatalogDeadlineDate(item, pathfinderLocale);
      const summary = localizedText(item.summary, pathfinderLocale);
      return {
        title: localizedText(item.title, pathfinderLocale),
        // 指向站内详情页而不是原文：详情页才有资格、费用、核验时间这些判断依据
        link: `/${locale}/pathfinder/items/${item.id}`,
        description: deadline
          ? `${summary}${summary ? ' ' : ''}(${pathfinderLocale === 'zh' ? '截止' : 'Deadline'} ${deadline})`
          : summary,
        category: item.itemType,
        pubDate: item.discoveredAt,
      };
    }),
    {
      title: pathfinderLocale === 'zh' ? 'Meteor Pathfinder 机会库' : 'Meteor Pathfinder opportunities',
      description: pathfinderLocale === 'zh'
        ? '面向大学生的竞赛、实习、开源任务与 AI 动态，全部保留官方来源与核验时间。'
        : 'Competitions, internships, open-source tasks, and AI updates for university students, each with its official source and verification date.',
      path: `/${locale}/pathfinder`,
    },
  );

  return new Response(xml, { headers: FEED_HEADERS });
}
