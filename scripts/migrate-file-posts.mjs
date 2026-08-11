import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import matter from 'gray-matter';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

const CONTENT_DIR = join(process.cwd(), 'content/blog');

function newPostId() {
  return crypto.randomBytes(8).toString('base64url');
}

function parseFile(filepath) {
  const raw = readFileSync(filepath, 'utf8');
  const { data, content } = matter(raw);
  return { frontmatter: data, content: content.trim() };
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');
  const sql = neon(databaseUrl);

  // 获取管理员用户 ID
  const adminEmail = (process.env.ADMIN_EMAILS ?? '').split(',')[0].trim().toLowerCase();
  const [adminUser] = await sql.query(
    'SELECT id, name FROM users WHERE lower(email) = $1',
    [adminEmail],
  );
  if (!adminUser) throw new Error(`Admin user not found: ${adminEmail}`);
  console.log(`作者: ${adminUser.name} (${adminUser.id})`);

  const results = [];

  for (const locale of ['zh', 'en']) {
    const dir = join(CONTENT_DIR, locale);
    const files = readdirSync(dir).filter((f) => extname(f) === '.md');

    for (const file of files) {
      const filepath = join(dir, file);
      const { frontmatter, content } = parseFile(filepath);

      // 跳过草稿
      if (frontmatter.draft) {
        console.log(`  跳过草稿: ${locale}/${file}`);
        continue;
      }

      const slug = file.replace('.md', '');
      const id = newPostId();
      const now = new Date().toISOString();
      const publishedAt = `${frontmatter.date}T00:00:00.000Z`;
      const eventDate = frontmatter.eventDate ?? frontmatter.date;
      const tags = (frontmatter.tags ?? []).map((t) => t.trim());
      const sections = [frontmatter.section];

      try {
        // 1. 插入 posts 主表
        await sql.query(
          `INSERT INTO posts (id, author_id, title, excerpt, content, section_id, status, 
            event_date, published_at, locale, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'published', $7, $8, $9, $10, $11)`,
          [id, adminUser.id, frontmatter.title, frontmatter.excerpt, content,
           frontmatter.section, eventDate, publishedAt, locale, publishedAt, publishedAt],
        );

        // 2. 插入 post_sections
        for (const sectionId of sections) {
          await sql.query(
            'INSERT INTO post_sections (post_id, section_id) VALUES ($1, $2)',
            [id, sectionId],
          );
        }

        // 3. 插入 post_tags
        for (const tag of tags) {
          const tagKey = tag.toLowerCase().replace(/\s+/g, '');
          await sql.query(
            'INSERT INTO post_tags (post_id, tag, label) VALUES ($1, $2, $3)',
            [id, tagKey, tag],
          );
        }

        results.push({ locale, slug, id, title: frontmatter.title });
        console.log(`  ✓ ${locale}/${slug} → ${id}`);
      } catch (err) {
        console.error(`  ✗ ${locale}/${slug}: ${err.message}`);
      }
    }
  }

  console.log(`\n迁移完成: ${results.length} 篇`);
  console.log('\n文章 ID 映射:');
  for (const r of results) {
    console.log(`  ${r.locale}/${r.slug} → /blog/p/${r.id}  "${r.title}"`);
  }
}

main().catch((err) => {
  console.error('迁移失败:', err);
  process.exit(1);
});
