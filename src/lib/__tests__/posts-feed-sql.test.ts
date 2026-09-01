import { describe, expect, it } from 'vitest';
import { estimateReadingTime } from '@/data/blog';

/**
 * 博客列表链路的生成 SQL 必须把正文留在数据库里。
 *
 * 这条测试补的是一次真实事故：getPublishedUserPosts 用的列集合里带着
 * `content`，而它是整条读取链路的根——/blog、分区页、标签页、两个 RSS、
 * sitemap、搜索索引、相关阅读每次渲染都会跑一遍。正文在应用层唯一的用途
 * 是喂给 estimateReadingTime，算完就丢。结果是每次列表页渲染都把全站
 * Markdown 从 Neon 搬一遍，出网额度被打满后所有投稿查询 402，
 * 博客降级成「只展示文件文章」，而 content/blog 早已迁空 —— 博客直接空了。
 *
 * 类型和普通单测都看不出正文有没有被取回来，只有生成的 SQL 说了算。
 */
describe('已发布文章的 feed 查询', () => {
  // toSQL() 不发起连接，但 db 是惰性 Proxy，仍要求这个变量存在
  process.env.DATABASE_URL ??= 'postgresql://user:pass@localhost/placeholder';

  async function feedSql(): Promise<string> {
    const { publishedFeedQuery } = await import('../posts');
    return publishedFeedQuery('zh').toSQL().sql;
  }

  it('不把 content 选成返回列', async () => {
    const generated = await feedSql();
    const selectList = generated.slice(0, generated.indexOf(' from '));

    // 作为返回列时 content 会是独立的一项：`select "posts"."content",` 或 `, "posts"."content" from`
    expect(selectList, '正文被选成返回列，全站 Markdown 会随每次列表渲染出库')
      .not.toMatch(/(?:select|,)\s*"posts"\."content"\s*(?:,|$)/);
    expect(selectList).not.toMatch(/(?:select|,)\s*"content"\s*(?:,|$)/);
  });

  it('阅读时长在 SQL 里算，且引用正文时带 "posts" 限定名', async () => {
    const generated = await feedSql();

    expect(generated).toContain('greatest(1, round(');
    // drizzle 会把 SELECT 列表里 sql 片段中的 Column 改写成裸列名，
    // join 查询下那要靠「另一张表恰好没有同名列」才不出错（见 admin-users-sql.test.ts）
    expect(generated).toContain('"posts"."content"');
    expect(generated, '正文引用丢了表限定名，换个 join 就会撞上同名列')
      .not.toMatch(/length\(\s*"content"\s*\)/);
  });

  it('列表要用到的字段都还在', async () => {
    const generated = await feedSql();
    for (const column of ['"title"', '"excerpt"', '"section_id"', '"published_at"', '"event_date"']) {
      expect(generated).toContain(column);
    }
  });
});

/**
 * SQL 与 JS 两份阅读时长公式必须同口径。
 *
 * 单测环境没有真 Postgres，所以这里用 JS 复刻 SQL 的语义再与 estimateReadingTime
 * 对比——它证明不了 Postgres 的真实行为，但能在**任何一边的公式被改动**时立刻变红，
 * 提醒另一边同步。真实一致性在改动后连一次数据库抽样核对。
 */
describe('阅读时长：SQL 语义与 JS 公式同口径', () => {
  /** 复刻 readingTimeSql：CJK 字符数 / 400 + 其余按空白切出的词数 / 200，下限 1 */
  function simulateSqlReadingTime(content: string): number {
    const cjkCount = content.length - content.replace(/[一-龥]/g, '').length;
    const stripped = content.replace(/[一-龥]/g, ' ').trim();
    // 对应 nullif(regexp_split_to_array(...), array['']) —— 空串要归零而不是 1
    const wordCount = stripped === '' ? 0 : stripped.split(/\s+/).length;
    return Math.max(1, Math.round(cjkCount / 400 + wordCount / 200));
  }

  const samples: [string, string][] = [
    ['纯中文 400 字', '字'.repeat(400)],
    ['纯中文 1200 字', '字'.repeat(1200)],
    ['纯英文 400 词', 'word '.repeat(400)],
    ['中英混排', '字'.repeat(400) + ' ' + 'word '.repeat(200)],
    ['空正文', ''],
    ['只有空白', '   \n\t  '],
    ['极短', '一'],
    ['带 Markdown 标记', '# 标题\n\n正文'.repeat(50)],
  ];

  for (const [name, content] of samples) {
    it(`${name} 两边一致`, () => {
      expect(simulateSqlReadingTime(content)).toBe(estimateReadingTime(content));
    });
  }
});
