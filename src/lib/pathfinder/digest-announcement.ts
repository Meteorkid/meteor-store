import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { SITE_URL } from '@/lib/constants';
import { listCatalogItems } from './catalog';
import { isDigestItem, localizedText } from './catalog-view';

/**
 * 把当天的资讯日报发进通知箱（Header 铃铛）。
 *
 * 日报每天一期，是全站唯一每天都有新内容的东西——通知箱正是让人知道
 * 「今天有新的」的地方，不然只有主动打开发现页侧栏才看得到。
 *
 * **正文自带摘要，不只给一个链接**：铃铛面板里读完就走是常态，把当天综述
 * 放进正文，用户不点也能知道发生了什么；链接是给想读全文的人的。
 */

/** 幂等键前缀。同一天重复触发会撞唯一索引，落在同一行上。 */
const SOURCE_KEY_PREFIX = 'pathfinder-digest';

/** 通知正文里综述的截断长度。铃铛面板高度有限，太长会把其它通知挤出视野。 */
const BODY_SUMMARY_LIMIT = 180;

export interface DigestAnnouncementResult {
  /**
   * - `created` 已发出
   * - `duplicate` 这一期已发过
   * - `no-digest` 上游还没出这一期（正常，上游会断更）
   * - `catalog-unavailable` 读不到目录，**不是**「今天没有日报」
   */
  status: 'created' | 'duplicate' | 'no-digest' | 'catalog-unavailable';
  sourceKey?: string;
}

function clip(text: string, limit: number): string {
  const trimmed = text.trim();
  return trimmed.length <= limit ? trimmed : `${trimmed.slice(0, limit - 1).trimEnd()}…`;
}

/**
 * 取「最新一期」而不是「今天日期那一期」。
 *
 * 上游偶尔断更（实测 36 天出 30 期），按日期硬找会让断更当天什么都发不出去；
 * 而幂等键用的是那一期自己的发布日，所以断更时不会把昨天的重发一遍。
 */
function latestDigest(items: Awaited<ReturnType<typeof listCatalogItems>>) {
  const digests = items.filter((item) => item.status === 'published' && isDigestItem(item));
  return [...digests].sort((a, b) => (
    (b.publishedAt ?? b.discoveredAt ?? '').localeCompare(a.publishedAt ?? a.discoveredAt ?? '')
  ))[0] ?? null;
}

export async function announceDailyDigest(): Promise<DigestAnnouncementResult> {
  const catalog = await listCatalogItems();

  /*
   * 先分清「上游没出」和「我们读不到」。
   *
   * `listCatalogItems` 在数据库不可用时会静默降级成仓库内的静态种子，而种子里
   * 没有日报——两种情况都表现为「找不到日报」。这个任务一天只跑一次，
   * 混为一谈的话，某天撞上数据库短暂不可用就会静默跳过当天通知、日志还显示成功。
   * 实测撞到过一次：部署刚重启、目录缓存冷时的第一次调用就返回了 no-digest。
   *
   * 判据用「有没有来自数据库的条目」而不是「目录是不是空的」：生产的目录里
   * 恒有数百条数据库条目，一条都没有只可能是降级。
   */
  if (!catalog.some((item) => item.origin === 'database')) {
    return { status: 'catalog-unavailable' };
  }

  const digest = latestDigest(catalog);
  if (!digest) return { status: 'no-digest' };

  const day = (digest.publishedAt ?? digest.discoveredAt ?? '').slice(0, 10);
  if (!day) return { status: 'no-digest' };
  const sourceKey = `${SOURCE_KEY_PREFIX}:${day}`;

  const link = `${SITE_URL}/zh/pathfinder/items/${digest.id}`;
  const linkEn = `${SITE_URL}/en/pathfinder/items/${digest.id}`;
  const summaryZh = clip(localizedText(digest.summary, 'zh'), BODY_SUMMARY_LIMIT);
  const summaryEn = clip(localizedText(digest.summary, 'en'), BODY_SUMMARY_LIMIT);

  const now = new Date().toISOString();
  const [row] = await db.insert(announcements).values({
    id: crypto.randomUUID(),
    sourceKey,
    titleZh: localizedText(digest.title, 'zh'),
    titleEn: localizedText(digest.title, 'en'),
    bodyZh: `${summaryZh}\n\n${link}`,
    bodyEn: `${summaryEn}\n\n${linkEn}`,
    published: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    // 幂等：撞上唯一索引说明今天已经发过，什么都不做
  }).onConflictDoNothing({ target: announcements.sourceKey }).returning({ id: announcements.id });

  return { status: row ? 'created' : 'duplicate', sourceKey };
}

/** 后台要能看出某天的日报通知发过没有，排障时用。 */
export async function findDigestAnnouncement(day: string) {
  const [row] = await db
    .select({ id: announcements.id, publishedAt: announcements.publishedAt })
    .from(announcements)
    .where(and(eq(announcements.sourceKey, `${SOURCE_KEY_PREFIX}:${day}`)))
    .limit(1);
  return row ?? null;
}
