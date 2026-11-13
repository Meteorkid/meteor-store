import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { ieltsPairs } from '@/lib/db/schema';
import { curatedIeltsPairs } from '@/data/ielts';
import {
  IeltsPairSeedSchema,
  type IeltsPairContent,
  type IeltsPairSeed,
  type IeltsPairSource,
  type IeltsPairStatus,
  type IeltsTask,
} from './types';

/**
 * 雅思对照库的合并层：仓库文件里的精选对照 + 数据库里的对照。
 *
 * 为什么不是「只读数据库」：精选对照随代码上线，任何环境（含本地空库）
 * 打开页面都有内容；为什么不是「只读文件」：后台生成的对照要能立刻上架，
 * 不必等下一次部署。
 *
 * 合并规则（一行一条，测试逐条钉住）：
 * 1. 以文件里的精选对照为底；
 * 2. 数据库行 status='hidden' → 该 slug 整体移除（文件版本也不回填，这就是「下架」）；
 * 3. 数据库行 status='published' 且有 content → 整组替换（后台改写或生成）；
 * 4. 数据库行 content 为空 → 只覆盖状态与排序（例如把文件里的一组下架或置顶）；
 * 5. 数据库行 status='draft' → 不公开；
 * 6. 读数据库失败 → 退回只用文件内容，页面不空白。
 */

export interface IeltsPairRecord {
  slug: string;
  task: IeltsTask;
  category: string;
  topic: string;
  sortOrder: number;
  source: IeltsPairSource;
  content: IeltsPairContent;
}

export interface IeltsPairRow {
  slug: string;
  task: IeltsTask;
  category: string;
  topic: string;
  status: IeltsPairStatus;
  sortOrder: number;
  source: IeltsPairSource;
  content: IeltsPairContent | null;
  /** 数据库行的更新时间；后台列表展示用，合并逻辑不读它 */
  updatedAt?: string;
}

/** 文件里的精选对照先过一遍协议：坏数据丢弃并留痕，不让一组坏内容把整页拖垮。 */
export function validCuratedPairs(seeds: IeltsPairSeed[] = curatedIeltsPairs): IeltsPairSeed[] {
  const valid: IeltsPairSeed[] = [];
  for (const seed of seeds) {
    const parsed = IeltsPairSeedSchema.safeParse(seed);
    if (parsed.success) valid.push(parsed.data);
    else console.error('雅思对照内容不合法，已跳过', seed?.slug, parsed.error.issues[0]?.message);
  }
  return valid;
}

export function mergeIeltsPairs(seeds: IeltsPairSeed[], rows: IeltsPairRow[]): IeltsPairRecord[] {
  const bySlug = new Map<string, IeltsPairRecord>();

  for (const seed of seeds) {
    if (seed.status !== 'published') continue;
    bySlug.set(seed.slug, {
      slug: seed.slug,
      task: seed.task,
      category: seed.category,
      topic: seed.topic,
      sortOrder: seed.sortOrder,
      source: 'curated',
      content: seed.content,
    });
  }

  for (const row of rows) {
    if (row.status === 'hidden') {
      bySlug.delete(row.slug);
      continue;
    }
    if (row.status !== 'published') continue;

    const existing = bySlug.get(row.slug);
    const content = row.content ?? existing?.content;
    if (!content) continue;
    // 只覆盖状态/排序时保留原来的来源标记：它还是文件里那一组，只是被后台调整过
    const source: IeltsPairSource = row.content ? row.source : existing?.source ?? row.source;
    bySlug.set(row.slug, {
      slug: row.slug,
      task: row.task,
      category: row.category,
      topic: row.topic,
      sortOrder: row.sortOrder,
      source,
      content,
    });
  }

  return [...bySlug.values()].sort((a, b) => (a.sortOrder - b.sortOrder) || a.slug.localeCompare(b.slug));
}

/** 公开页用的对照列表：数据库读不到就退回精选内容，绝不空白。 */
export async function listIeltsPairs(): Promise<IeltsPairRecord[]> {
  const seeds = validCuratedPairs();
  try {
    const rows = await db.select().from(ieltsPairs).orderBy(desc(ieltsPairs.updatedAt));
    return mergeIeltsPairs(seeds, rows as IeltsPairRow[]);
  } catch (error) {
    console.error('雅思对照读取失败，退回精选内容', error);
    return mergeIeltsPairs(seeds, []);
  }
}

export async function getIeltsPair(slug: string): Promise<IeltsPairRecord | null> {
  const pairs = await listIeltsPairs();
  return pairs.find(pair => pair.slug === slug) ?? null;
}

/** 后台用：连同未发布的数据库行一起列出，并标出哪些 slug 会被下架覆盖。 */
export async function listIeltsPairRows(): Promise<IeltsPairRow[]> {
  const rows = await db.select().from(ieltsPairs).orderBy(desc(ieltsPairs.updatedAt));
  return rows as IeltsPairRow[];
}

export async function findIeltsPairRow(slug: string): Promise<IeltsPairRow | null> {
  const rows = await db.select().from(ieltsPairs).where(eq(ieltsPairs.slug, slug)).limit(1);
  return (rows[0] as IeltsPairRow | undefined) ?? null;
}
