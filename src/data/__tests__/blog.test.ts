import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { blogPosts, estimateReadingTime, toSummary } from '../blog';
import { blogSections } from '../blog-sections';
import { FOUR_SYMBOLS } from '../celestial';

const CONTENT_DIR = join(process.cwd(), 'content/blog/zh');
const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
const sectionIds = new Set(blogSections.map((s) => s.id));

describe('estimateReadingTime', () => {
  it('中文按每分钟 400 字估算', () => {
    expect(estimateReadingTime('字'.repeat(400))).toBe(1);
    expect(estimateReadingTime('字'.repeat(1200))).toBe(3);
  });

  it('英文按每分钟 200 词估算', () => {
    expect(estimateReadingTime('word '.repeat(400))).toBe(2);
  });

  it('中英混排时两者相加', () => {
    // 400 中文字（1 分钟）+ 200 英文词（1 分钟）
    expect(estimateReadingTime('字'.repeat(400) + ' ' + 'word '.repeat(200))).toBe(2);
  });

  it('极短内容至少记 1 分钟，不出现 0', () => {
    expect(estimateReadingTime('短')).toBe(1);
    expect(estimateReadingTime('')).toBe(1);
  });
});

describe('内容文件', () => {
  it('至少有一篇文章（防止读取路径错了导致测试空跑）', () => {
    expect(files.length).toBeGreaterThan(0);
    expect(blogPosts.length).toBeGreaterThan(0);
  });

  it.each(files)('%s 的 frontmatter 完整且合法', (file) => {
    const { data, content } = matter(readFileSync(join(CONTENT_DIR, file), 'utf-8'));

    expect(data.title, 'title 缺失').toBeTruthy();
    expect(data.excerpt, 'excerpt 缺失').toBeTruthy();
    expect(sectionIds.has(data.section), `section "${data.section}" 不在已定义的分区里`).toBe(true);
    if (data.sections !== undefined) {
      const arr = Array.isArray(data.sections) ? data.sections : [data.sections];
      arr.forEach((s) =>
        expect(sectionIds.has(s), `sections 里的 "${s}" 不在已定义的分区里`).toBe(true),
      );
    }

    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
    expect(String(date), 'date 需为 YYYY-MM-DD').toMatch(/^\d{4}-\d{2}-\d{2}$/);

    expect(content.trim().length, '正文为空').toBeGreaterThan(0);
  });

  it('slug 取自文件名，且不重复', () => {
    const slugs = blogPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(files).toContain(`${s}.md`));
  });

  it('按日期倒序排列', () => {
    const dates = blogPosts.map((p) => p.date);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });

  it('readingTime 是自动算出来的正整数', () => {
    blogPosts.forEach((p) => {
      expect(Number.isInteger(p.readingTime)).toBe(true);
      expect(p.readingTime).toBeGreaterThan(0);
    });
  });

  it('eventDate 缺省时回落到 date，且格式合法', () => {
    blogPosts.forEach((p) => {
      expect(p.eventDate, 'eventDate 缺失').toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

describe('博客分区星象', () => {
  it('每个分区都有可解释的星宿、四象与双语说明', () => {
    blogSections.forEach((section) => {
      expect(section.star, `${section.id} 缺少星宿映射`).toBeTruthy();
      const star = section.star!;
      expect(star.sus.zh).toBeTruthy();
      expect(star.sus.en).toBeTruthy();
      expect(star.reason.zh).toBeTruthy();
      expect(star.reason.en).toBeTruthy();
      expect(FOUR_SYMBOLS[star.symbolId]).toBeTruthy();
    });
  });
});

describe('toSummary', () => {
  it('剥掉正文，其余字段保留', () => {
    const summary = toSummary(blogPosts[0]);
    expect(summary).not.toHaveProperty('content');
    expect(summary.slug).toBe(blogPosts[0].slug);
    expect(summary.title).toBe(blogPosts[0].title);
  });

  it('返回的字段集合是固定白名单，新增字段不会被无意带到客户端', () => {
    expect(Object.keys(toSummary(blogPosts[0])).sort()).toEqual(
      ['date', 'draft', 'eventDate', 'excerpt', 'readingTime', 'section', 'sections', 'slug', 'tags', 'title'],
    );
  });
});
