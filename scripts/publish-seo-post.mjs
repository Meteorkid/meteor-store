#!/usr/bin/env node
/**
 * 把 SEO 长尾文章从 content/blog-archive 发布到数据库 posts 表。
 *
 * 为什么单独写一个脚本而不是复用 migrate-file-posts.mjs：
 * 那个脚本会遍历整个 content/blog/ 目录，而该目录按约定应保持为空
 * （站主文章已全部入库，见 src/data/blog.ts 顶部说明）。本脚本按文件名
 * 精确发布，且**幂等**——同一篇重跑会按 title 命中并更新，不会产生重复。
 *
 * 使用：
 *   set -a && . ./.env.local && set +a && \
 *   node scripts/publish-seo-post.mjs --file=duo-agent-session-management.md
 *   node scripts/publish-seo-post.mjs --file=xxx.md --apply     # 真的写库
 *
 * 默认 dry-run，只打印将要写入的内容摘要。
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import crypto from 'crypto';
import { createSql } from './lib/pg-sql.mjs';

const ARCHIVE_DIR = join(process.cwd(), 'content/blog-archive/zh');

function parseArgs(argv) {
  const args = { file: '', apply: false };
  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--file=')) args.file = arg.slice('--file='.length);
    else {
      console.error(`未知参数：${arg}`);
      process.exit(1);
    }
  }
  if (!args.file) {
    console.error('必须指定 --file=<文件名>.md');
    process.exit(1);
  }
  return args;
}

function newPostId() {
  return crypto.randomBytes(8).toString('base64url');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const filepath = join(ARCHIVE_DIR, args.file);

  const raw = readFileSync(filepath, 'utf8');
  const { data, content } = matter(raw);

  const required = ['title', 'excerpt', 'date', 'section'];
  for (const key of required) {
    if (!data[key]) throw new Error(`frontmatter 缺少 ${key}`);
  }

  // gray-matter 会把 YAML 里的裸日期（`date: 2026-11-05`）解析成 Date 对象，
  // 直接拼字符串会得到 "Thu Nov 05 2026 08:00:00 GMT+0800 (China Standard Time)T00:00:00.000Z"。
  // 必须按本地日期取 YYYY-MM-DD，且不能用 toISOString()——那会按 UTC 算，
  // 东八区的 2026-11-05 会变成 2026-11-04。
  const date = data.date instanceof Date
    ? `${data.date.getFullYear()}-${String(data.date.getMonth() + 1).padStart(2, '0')}-${String(data.date.getDate()).padStart(2, '0')}`
    : String(data.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`date 需为 YYYY-MM-DD，收到：${date}`);
  }

  const publishedAt = `${date}T00:00:00.000Z`;
  const eventDate = data.eventDate ?? date;
  const tags = (data.tags ?? []).map((t) => String(t).trim()).filter(Boolean);
  const body = content.trim();

  console.log(`文件: ${args.file}`);
  console.log(`标题: ${data.title}`);
  console.log(`分区: ${data.section}   日期: ${date}   标签: ${tags.join(' / ')}`);
  console.log(`正文: ${body.length} 字符`);
  console.log(`摘要: ${data.excerpt.slice(0, 60)}…`);

  if (!args.apply) {
    console.log('\n[dry-run] 没有写库。确认无误后加 --apply。');
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');
  const sql = createSql(databaseUrl);

  const adminEmail = (process.env.ADMIN_EMAILS ?? '').split(',')[0].trim().toLowerCase();
  if (!adminEmail) throw new Error('ADMIN_EMAILS is not set');
  const [adminUser] = await sql.query(
    'SELECT id, name FROM users WHERE lower(email) = $1',
    [adminEmail],
  );
  if (!adminUser) throw new Error(`Admin user not found: ${adminEmail}`);
  console.log(`\n作者: ${adminUser.name} (${adminUser.id})`);

  // 幂等：按 title + locale 命中已有文章就更新，否则新建。
  const [existing] = await sql.query(
    'SELECT id FROM posts WHERE title = $1 AND locale = $2',
    [data.title, 'zh'],
  );

  const id = existing?.id ?? newPostId();
  const now = new Date().toISOString();

  if (existing) {
    await sql.query(
      `UPDATE posts SET excerpt = $1, content = $2, section_id = $3, status = 'published',
         event_date = $4, published_at = $5, updated_at = $6
       WHERE id = $7`,
      [data.excerpt, body, data.section, eventDate, publishedAt, now, id],
    );
    console.log(`  ↻ 更新已有文章 ${id}`);
  } else {
    await sql.query(
      `INSERT INTO posts (id, author_id, title, excerpt, content, section_id, status,
         event_date, published_at, locale, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'published', $7, $8, 'zh', $9, $9)`,
      [id, adminUser.id, data.title, data.excerpt, body, data.section, eventDate, publishedAt, now],
    );
    console.log(`  + 新建文章 ${id}`);
  }

  // 分区与标签：先清后写，保证重跑结果一致。
  await sql.query('DELETE FROM post_sections WHERE post_id = $1', [id]);
  await sql.query('DELETE FROM post_tags WHERE post_id = $1', [id]);

  await sql.query(
    'INSERT INTO post_sections (post_id, section_id) VALUES ($1, $2)',
    [id, data.section],
  );
  for (const tag of tags) {
    const tagKey = tag.toLowerCase().replace(/\s+/g, '');
    await sql.query(
      'INSERT INTO post_tags (post_id, tag, label) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [id, tagKey, tag],
    );
  }

  console.log(`\n完成 → /blog/p/${id}`);
  console.log(`标签 ${tags.length} 个，分区 1 个`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
