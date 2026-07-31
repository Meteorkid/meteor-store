import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { blogSections, type BlogSectionId } from './blog-sections';
import { type Locale } from '@/i18n/routing';

/**
 * 文章内容存在仓库里的 Markdown 文件（content/blog/*.md），构建时读取。
 *
 * 选文件而不是数据库，是因为它带版本历史、能 diff、能离线写、不绑定任何厂商，
 * 将来真要迁到 CMS，Markdown 也是通用入口格式。代价是「发布 = 一次部署」。
 *
 * 这个模块只在服务端使用（用了 fs）。客户端组件只应 import 类型，
 * 或接收由服务端裁剪好的 BlogPostSummary。
 */

const CONTENT_DIR = join(process.cwd(), 'content/blog');

const SECTION_IDS = blogSections.map((s) => s.id) as [BlogSectionId, ...BlogSectionId[]];

/** frontmatter 结构。校验失败直接抛错——宁可构建失败，也不要静默渲染出错的文章 */
const FrontmatterSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  // gray-matter 会把 YAML 里的裸日期解析成 Date
  date: z.union([z.string(), z.date()]).transform((v) =>
    v instanceof Date ? v.toISOString().slice(0, 10) : v,
  ).pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期需为 YYYY-MM-DD')),
  section: z.enum(SECTION_IDS),
  tags: z.array(z.string()).default([]),
  /** 草稿只在开发环境可见，可以放心提交半成品 */
  draft: z.boolean().default(false),
});

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  section: BlogSectionId;
  readingTime: number;
  tags: string[];
  draft: boolean;
}

/** 列表页只需要这些字段，正文不进客户端 bundle */
export type BlogPostSummary = Omit<BlogPost, 'content'>;

/**
 * 估算阅读时长。中英文速度差异很大，分开算：
 * 中文按每分钟 400 字，其余按每分钟 200 词。
 */
export function estimateReadingTime(content: string): number {
  const cjk = (content.match(/[一-龥]/g) ?? []).length;
  const words = content
    .replace(/[一-龥]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

function loadPosts(locale?: Locale): BlogPost[] {
  // 如果指定了 locale，尝试加载对应目录；否则加载默认目录
  const blogDir = locale
    ? join(CONTENT_DIR, locale)
    : CONTENT_DIR;

  // 如果目录不存在，回退到默认目录
  const actualDir = existsSync(blogDir) ? blogDir : CONTENT_DIR;

  const files = readdirSync(actualDir).filter((f) => f.endsWith('.md'));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(join(actualDir, file), 'utf-8');
    const { data, content } = matter(raw);

    const parsed = FrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('；');
      throw new Error(`content/blog/${file} 的 frontmatter 有问题 —— ${issues}`);
    }

    return {
      slug,
      ...parsed.data,
      content: content.trim(),
      readingTime: estimateReadingTime(content),
    };
  });

  // 草稿只在开发环境露出，生产构建里当它不存在
  const visible = process.env.NODE_ENV === 'production' ? posts.filter((p) => !p.draft) : posts;

  return visible.sort((a, b) => b.date.localeCompare(a.date));
}

export const blogPosts: BlogPost[] = loadPosts();

/** 按 locale 获取博客文章列表 */
export function getBlogPosts(locale: Locale): BlogPost[] {
  return loadPosts(locale);
}

/** 显式列出会到达客户端的字段，避免以后新增字段被无意带过去 */
export function toSummary(post: BlogPost): BlogPostSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    section: post.section,
    readingTime: post.readingTime,
    tags: post.tags,
    draft: post.draft,
  };
}
