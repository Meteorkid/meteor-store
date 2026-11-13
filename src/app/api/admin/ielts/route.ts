import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { isAdminSession } from '@/lib/admin';
import { logAdminAction } from '@/lib/admin-audit';
import { assertMatchingOrigin } from '@/lib/csrf';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { findIeltsPairRow, listIeltsPairRows, listIeltsPairs, validCuratedPairs, type IeltsPairRow } from '@/lib/ielts/catalog';
import { generateIeltsPair } from '@/lib/ielts/generator';
import { deleteIeltsPairRow, setIeltsPairStatus, upsertIeltsPairRow } from '@/lib/ielts/service';
import { IeltsPairSlugSchema, IeltsTaskSchema, type IeltsPairSeed } from '@/lib/ielts/types';
import type { AdminIeltsPair, AdminIeltsRow } from '@/components/admin/AdminIeltsManager';

/**
 * 雅思写作对照的后台接口。
 *
 * 这里只动数据库那一半：文件里的精选内容随代码上线，本接口不改文件。
 * 下架（hidden）会让同 slug 的文件版本一起消失，删除数据库行则让文件版本回到公开列表
 * ——这两条都来自 catalog 的合并规则，别在这里另写一套可见性判断。
 *
 * 生成是最贵的动作（会真的花钱调模型），所以单独按 5 次/分钟收紧限流，
 * 其余管理动作走 30 次/分钟。
 */

const GenerateSchema = z.object({
  action: z.literal('generate'),
  task: IeltsTaskSchema,
  topic: z.string().trim().min(1).max(40),
  category: z.string().trim().min(1).max(40),
}).strict();

const PostSchema = z.discriminatedUnion('action', [
  GenerateSchema,
  z.object({ action: z.literal('publish'), slug: IeltsPairSlugSchema }).strict(),
  z.object({ action: z.literal('hide'), slug: IeltsPairSlugSchema }).strict(),
  z.object({ action: z.literal('restore'), slug: IeltsPairSlugSchema }).strict(),
  z.object({ action: z.literal('delete'), slug: IeltsPairSlugSchema }).strict(),
]);

function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function failure(code: string, status: number, message?: string) {
  return privateJson({ error: message ?? (code === 'not_found' ? 'Not found' : code), errorCode: code }, status);
}

/** 请求体只有几个短字段，4KB 足够；同时看声明长度和实际流量，别让省略 Content-Length 的请求绕过去。 */
async function readBody(request: Request): Promise<{ value: unknown } | { response: NextResponse }> {
  const limit = 4 * 1024;
  if (Number(request.headers.get('content-length')) > limit) return { response: failure('too_large', 413) };
  if (!request.body) return { response: failure('invalid', 400) };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel().catch(() => undefined);
        return { response: failure('too_large', 413) };
      }
      chunks.push(value);
    }
    return { value: JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown };
  } catch {
    return { response: failure('invalid', 400) };
  } finally {
    reader.releaseLock();
  }
}

/** 精选种子按 slug 建索引：行里的标题在 content 为空时要回落到文件版本，否则下架后的卡片没有标题可显示。 */
function curatedBySlug(): Map<string, IeltsPairSeed> {
  return new Map(validCuratedPairs().map(seed => [seed.slug, seed]));
}

function toAdminRow(
  row: IeltsPairRow,
  curated: Map<string, IeltsPairSeed>,
): AdminIeltsRow {
  const seed = curated.get(row.slug);
  return {
    slug: row.slug,
    task: row.task,
    category: row.category,
    topic: row.topic,
    status: row.status,
    source: row.source,
    sortOrder: row.sortOrder,
    title: row.content?.title ?? seed?.content.title ?? null,
    updatedAt: row.updatedAt ?? '',
    inCurated: Boolean(seed),
  };
}

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);
  try {
    const [rows, pairs] = await Promise.all([listIeltsPairRows(), listIeltsPairs()]);
    const curated = curatedBySlug();
    const rowBySlug = new Map(rows.map(row => [row.slug, row]));
    const adminPairs: AdminIeltsPair[] = pairs.map(pair => ({
      slug: pair.slug,
      task: pair.task,
      category: pair.category,
      topic: pair.topic,
      sortOrder: pair.sortOrder,
      source: pair.source,
      title: pair.content.title,
      // 合并层里只有「数据库行带 content」才会整组替换文件版本，所以正文来源看这一条
      fromDatabase: Boolean(rowBySlug.get(pair.slug)?.content),
    }));
    return privateJson({ rows: rows.map(row => toAdminRow(row, curated)), pairs: adminPairs });
  } catch (error) {
    console.error('Ielts admin list failed:', error);
    return failure('load_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !isAdminSession(session)) return failure('not_found', 404);
  if (assertMatchingOrigin(request)) return failure('origin', 403);
  const body = await readBody(request);
  if ('response' in body) return body.response;
  const parsed = PostSchema.safeParse(body.value);
  if (!parsed.success) return failure('invalid', 400);

  const ip = getClientIp(request);
  const isGenerate = parsed.data.action === 'generate';
  const { limited } = await rateLimit(
    `admin-ielts:${isGenerate ? 'generate' : 'manage'}:${session.userId}:${ip}`,
    isGenerate ? 5 : 30,
    60_000,
    { fallback: 'memory' },
  );
  if (limited) return failure('rate_limited', 429);

  try {
    if (parsed.data.action === 'generate') {
      const { task, topic, category } = parsed.data;
      if (!process.env.DEEPSEEK_API_KEY?.trim()) {
        return failure('generate_unconfigured', 503, '未配置生成密钥（DEEPSEEK_API_KEY），无法生成对照');
      }
      // 生成失败（模型报错、词数不达标等）与写库失败要分开报：前者是 502 并带上原因，
      // 后者是服务端问题，混在一起会把数据库故障说成「生成失败」
      let generated: Awaited<ReturnType<typeof generateIeltsPair>>;
      try {
        generated = await generateIeltsPair({ task, topic, category });
      } catch (error) {
        console.error('Ielts admin generation failed:', error);
        const message = error instanceof Error ? error.message : '雅思对照生成失败';
        return failure('generate_failed', 502, message.slice(0, 300));
      }
      // 新草稿排在现有内容之后：最大值同时看数据库行和文件精选，否则会插到精选组中间
      const rows = await listIeltsPairRows();
      const curated = curatedBySlug();
      const maxSortOrder = Math.max(
        0,
        ...rows.map(row => row.sortOrder),
        ...[...curated.values()].map(seed => seed.sortOrder),
      );
      const sortOrder = maxSortOrder + 10;
      await upsertIeltsPairRow({
        slug: generated.slug,
        task,
        category,
        topic,
        status: 'draft',
        sortOrder,
        content: generated.content,
        source: 'generated',
      });
      const row: AdminIeltsRow = {
        slug: generated.slug,
        task,
        category,
        topic,
        status: 'draft',
        source: 'generated',
        sortOrder,
        title: generated.content.title,
        updatedAt: new Date().toISOString(),
        inCurated: curated.has(generated.slug),
      };
      await logAdminAction(session, {
        action: 'ielts.generate',
        targetType: 'ielts-pair',
        targetId: generated.slug,
        detail: { slug: generated.slug, task, topic, category, sortOrder, status: 'draft', wordCounts: generated.wordCounts },
        ip,
      });
      return privateJson({ row, wordCounts: generated.wordCounts });
    }

    const { slug } = parsed.data;
    if (parsed.data.action === 'publish') {
      await setIeltsPairStatus(slug, 'published');
      await logAdminAction(session, {
        action: 'ielts.publish', targetType: 'ielts-pair', targetId: slug,
        detail: { slug, status: 'published' }, ip,
      });
      return privateJson({ success: true, slug, status: 'published' });
    }

    if (parsed.data.action === 'hide') {
      const row = await findIeltsPairRow(slug);
      let fileOverride = false;
      if (row) {
        await setIeltsPairStatus(slug, 'hidden');
      } else {
        // 精选组还没有数据库行：下架要新建一行 content 为空的覆盖行（合并规则 4），
        // 否则「下架文件里那一组」只是界面上的说法，点下去什么都不会发生。
        const seed = curatedBySlug().get(slug);
        if (!seed) return failure('not_found', 404);
        fileOverride = true;
        await upsertIeltsPairRow({
          slug,
          task: seed.task,
          category: seed.category,
          topic: seed.topic,
          status: 'hidden',
          sortOrder: seed.sortOrder,
          content: null,
          source: 'curated',
        });
      }
      await logAdminAction(session, {
        action: 'ielts.hide', targetType: 'ielts-pair', targetId: slug,
        detail: { slug, status: 'hidden', fileOverride }, ip,
      });
      return privateJson({ success: true, slug, status: 'hidden', fileOverride });
    }

    const inCurated = curatedBySlug().has(slug);
    if (parsed.data.action === 'restore') {
      await deleteIeltsPairRow(slug);
      await logAdminAction(session, {
        action: 'ielts.restore', targetType: 'ielts-pair', targetId: slug,
        detail: { slug, inCurated, removed: true }, ip,
      });
      return privateJson({ success: true, slug, inCurated });
    }

    await deleteIeltsPairRow(slug);
    await logAdminAction(session, {
      action: 'ielts.delete', targetType: 'ielts-pair', targetId: slug,
      detail: { slug, inCurated, removed: true }, ip,
    });
    return privateJson({ success: true, slug, inCurated });
  } catch (error) {
    console.error('Ielts admin action failed:', error);
    return failure('action_failed', 500);
  }
}
