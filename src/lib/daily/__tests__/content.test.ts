import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DailyContentSchema } from '../types';
import { englishLessons } from '../english-lessons';

const mocks = vi.hoisted(() => ({ select: vi.fn(), where: vi.fn(), limit: vi.fn() }));
vi.mock('@/lib/db', () => ({ db: { select: mocks.select } }));

const day = '2026-10-14';
const publishedAt = 'Wed, 14 Oct 2026 00:00:00 -0400';

/** 采用 arXiv 官方 RSS 字段结构，包含版本 GUID、公告类型、作者及原文摘要。 */
function paper(overrides: Partial<{
  id: string; version: string; title: string; description: string;
  date: string; authors: string; announceType: string; link: string;
}> = {}) {
  const item = {
    id: '2610.12345', version: 'v1', title: 'Learning &amp; Evaluation',
    description: 'We study a small model and report its limitations.',
    date: publishedAt, authors: 'Ada Chen, Alex Rivera', announceType: 'new',
    ...overrides,
  };
  return `<item>
    <title>${item.title}</title>
    <link>${item.link ?? `https://arxiv.org/abs/${item.id}`}</link>
    <description><![CDATA[arXiv:${item.id}${item.version} Announce Type: ${item.announceType}
    Abstract: ${item.description}]]></description>
    <guid isPermaLink="false">oai:arXiv.org:${item.id}${item.version}</guid>
    <category>cs.AI</category><category>cs.LG</category>
    <pubDate>${item.date}</pubDate>
    <arxiv:announce_type>${item.announceType}</arxiv:announce_type>
    <dc:creator>${item.authors}</dc:creator>
  </item>`;
}

function feed(...items: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:arxiv="http://arxiv.org/schemas/atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel><title>cs.AI updates on arXiv.org</title>${items.join('')}</channel>
  </rss>`;
}

function atomPaper(overrides: Partial<{ id: string; published: string; summary: string; authors: string }> = {}) {
  const item = {
    id: 'http://arxiv.org/abs/2610.12345v2', published: '2026-10-14T04:00:00Z',
    summary: 'We assume x &lt; y and compare A &amp; B.',
    authors: '<author><name>Ada Chen</name></author><author><name>Alex Rivera</name></author>',
    ...overrides,
  };
  return `<entry><id>${item.id}</id><updated>2026-10-20T04:00:00Z</updated>
    <published>${item.published}</published><title>Learning &amp; Evaluation</title>
    <summary>${item.summary}</summary>${item.authors}
    <category term="cs.AI" scheme="http://arxiv.org/schemas/atom"/>
    <category term="cs.LG" scheme="http://arxiv.org/schemas/atom"/></entry>`;
}

function atomFeed(...entries: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom">
    <updated>2026-10-20T00:00:00Z</updated>${entries.join('')}</feed>`;
}

function aiRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'pf_official', titleZh: '官方更新', titleEn: 'Official update',
    summaryZh: '官方已经发布的事实摘要。', summaryEn: 'A published source summary.',
    canonicalUrl: 'https://openai.com/news/example', publishedAt: '2026-10-14T01:00:00.000Z',
    sourceName: 'OpenAI News', trustLevel: 'official', ...overrides,
  };
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  mocks.limit.mockResolvedValue([]);
  const query = { from: vi.fn(), innerJoin: vi.fn(), where: mocks.where, orderBy: vi.fn(), limit: mocks.limit };
  query.from.mockReturnValue(query);
  query.innerJoin.mockReturnValue(query);
  query.orderBy.mockReturnValue(query);
  mocks.where.mockReturnValue(query);
  mocks.select.mockReturnValue(query);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('每日英语内容池', () => {
  it('七份原创课程结构有效，均含三个表达、阅读及两道有效练习', () => {
    expect(englishLessons).toHaveLength(7);
    expect(new Set(englishLessons.map((lesson) => lesson.id)).size).toBe(7);
    for (const lesson of englishLessons) {
      expect(DailyContentSchema.safeParse(lesson.content).success).toBe(true);
      expect(lesson.content.vocabulary).toHaveLength(3);
      expect(lesson.content.questions).toHaveLength(2);
      expect(lesson.content.passage.length).toBeGreaterThan(200);
      expect(lesson.content.passageTranslation).toBeTruthy();
    }
  });

  it('每课首次生成仍是草稿，用完不循环、不请求外部服务', async () => {
    const { loadDailyContent } = await import('../content');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const used: string[] = [];
    for (const lesson of englishLessons) {
      const result = await loadDailyContent('english', day, used);
      expect(result.status).toBe('draft');
      expect(result.sourceKey).toBe(`english:${lesson.id}`);
      expect(result.content).toEqual(lesson.content);
      used.push(result.sourceKey!);
    }
    expect(await loadDailyContent('english', day, used)).toMatchObject({ status: 'empty', content: null });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(mocks.select).not.toHaveBeenCalled();
  });

  it('返回独立内容快照，调用方修改不会污染后续课稿', async () => {
    const { loadDailyContent } = await import('../content');
    const first = await loadDailyContent('english', day);
    if (first.content?.kind !== 'english') throw new Error('Expected English lesson');
    first.content.vocabulary[0].term = 'changed';
    expect((await loadDailyContent('english', day)).content).toEqual(englishLessons[0].content);
  });
});

describe('arXiv 论文元数据', () => {
  it('读取小批量 Atom API，使用首发日期并保留原始摘要、作者和版本', async () => {
    const { parseArxivFeed } = await import('../content');
    expect(parseArxivFeed(atomFeed(atomPaper()), day)).toEqual([{
      id: 'https://arxiv.org/abs/2610.12345', url: 'https://arxiv.org/abs/2610.12345',
      title: 'Learning & Evaluation', summary: 'We assume x < y and compare A & B.',
      originalAbstract: 'We assume x < y and compare A & B.',
      sourceName: 'arXiv', sourceType: 'official', sourcePublishedAt: '2026-10-14T04:00:00.000Z',
      authors: ['Ada Chen', 'Alex Rivera'], version: 'v2', preprint: true,
      category: 'cs.AI · cs.LG',
    }]);
  });

  it('Atom 排除过期首发和已用论文，重复版本保留最新且每期最多三篇', async () => {
    const { parseArxivFeed } = await import('../content');
    const xml = atomFeed(
      atomPaper({ published: '2026-09-01T04:00:00Z' }),
      ...['00001v1', '00001v3', '00002v1', '00003v1', '00004v1', '00005v1']
        .map((id) => atomPaper({ id: `http://arxiv.org/abs/2610.${id}` })),
    );
    const items = parseArxivFeed(xml, day, ['https://arxiv.org/abs/2610.00002']);
    expect(items.map((item) => [item.id, item.version])).toEqual([
      ['https://arxiv.org/abs/2610.00001', 'v3'],
      ['https://arxiv.org/abs/2610.00003', 'v1'],
      ['https://arxiv.org/abs/2610.00004', 'v1'],
    ]);
  });

  it('Atom API 错误、缺失元数据和截断不能被当成正常空稿', async () => {
    const { parseArxivFeed } = await import('../content');
    expect(() => parseArxivFeed(atomFeed('<entry><id>http://arxiv.org/api/errors#incorrect_id_format</id></entry>'), day)).toThrow(/API/);
    expect(() => parseArxivFeed(atomFeed(atomPaper({ authors: '' })), day)).toThrow(/元数据不完整/);
    expect(() => parseArxivFeed(atomFeed(atomPaper({ id: '' })), day)).toThrow(/元数据不完整/);
    expect(() => parseArxivFeed(atomFeed(atomPaper({ id: 'http://arxiv.org/abs/2610.12345' })), day)).toThrow(/元数据不完整/);
    expect(() => parseArxivFeed(atomFeed('<entry><id>incomplete</id>'), day)).toThrow(/不完整/);
    expect(() => parseArxivFeed('<!DOCTYPE feed>' + atomFeed(), day)).toThrow(/DTD/);
    expect(parseArxivFeed(atomFeed(), day)).toEqual([]);
    expect(parseArxivFeed(atomFeed(atomPaper({ id: 'http://arxiv.org.evil.test/abs/2610.12345v1' })), day)).toEqual([]);
  });

  it('保留原始摘要、作者、版本、公告类型与预印本标识，不虚构代码链接', async () => {
    const { parseArxivFeed } = await import('../content');
    const [item] = parseArxivFeed(feed(paper({ version: 'v3', announceType: 'replace-cross' })), day);
    expect(item).toEqual({
      id: 'https://arxiv.org/abs/2610.12345', url: 'https://arxiv.org/abs/2610.12345',
      title: 'Learning & Evaluation', summary: 'We study a small model and report its limitations.',
      originalAbstract: 'We study a small model and report its limitations.',
      sourceName: 'arXiv', sourceType: 'official', sourcePublishedAt: '2026-10-14T04:00:00.000Z',
      authors: ['Ada Chen', 'Alex Rivera'], version: 'v3', preprint: true,
      announcementType: 'replace-cross', category: 'cs.AI · cs.LG',
    });
    expect(item.codeUrl).toBeUndefined();
  });

  it('按北京时间保留近七天，排除过期和未来公告，不把抓取时间当发布时间', async () => {
    const { parseArxivFeed } = await import('../content');
    const items = parseArxivFeed(feed(
      paper({ id: '2610.00001', date: 'Wed, 07 Oct 2026 16:00:00 GMT' }),
      paper({ id: '2610.00002', date: 'Wed, 07 Oct 2026 15:59:59 GMT' }),
      paper({ id: '2610.00003', date: 'Wed, 14 Oct 2026 15:59:59 GMT' }),
      paper({ id: '2610.00004', date: 'Wed, 14 Oct 2026 16:00:00 GMT' }),
    ), day);
    expect(items.map((item) => item.id)).toEqual([
      'https://arxiv.org/abs/2610.00003', 'https://arxiv.org/abs/2610.00001',
    ]);
  });

  it('保留摘要数学不等式和 CDATA 中的原文，不按 HTML 误删', async () => {
    const { parseArxivFeed } = await import('../content');
    const summary = 'We assume x < y and z > 0, then compare A & B.';
    expect(parseArxivFeed(feed(paper({ description: summary })), day)[0].summary).toBe(summary);
    expect(parseArxivFeed(feed(paper({ description: summary })), day)[0].originalAbstract).toBe(summary);
  });

  it('有近期合法论文链接但全部缺必要元数据时报告失败', async () => {
    const { parseArxivFeed } = await import('../content');
    expect(() => parseArxivFeed(feed(paper({ description: '', authors: '' })), day)).toThrow(/元数据不完整/);
  });

  it('同论文跨分类与版本只留最新版，剔除历史已用条目，每期最多三篇', async () => {
    const { parseArxivFeed } = await import('../content');
    const xml = feed(
      paper({ id: '2610.00001' }), paper({ id: '2610.00001', version: 'v2', announceType: 'replace' }),
      paper({ id: '2610.00002' }), paper({ id: '2610.00003' }), paper({ id: '2610.00004' }), paper({ id: '2610.00005' }),
    );
    const items = parseArxivFeed(xml, day, ['https://arxiv.org/abs/2610.00002']);
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.id)).toEqual([
      'https://arxiv.org/abs/2610.00003', 'https://arxiv.org/abs/2610.00004', 'https://arxiv.org/abs/2610.00005',
    ]);
    expect(parseArxivFeed(feed(paper(), paper({ version: 'v2', announceType: 'replace' })), day)[0].version).toBe('v2');
  });

  it('同一天优先新论文，避免旧论文修订按ID排序占满精选', async () => {
    const { parseArxivFeed } = await import('../content');
    const items = parseArxivFeed(feed(
      paper({ id: '2206.05446', version: 'v3', announceType: 'replace' }),
      paper({ id: '2610.00001', announceType: 'cross' }),
      paper({ id: '2610.00002' }), paper({ id: '2610.00003' }),
    ), day);
    expect(items.map((item) => item.announcementType)).toEqual(['new', 'new', 'cross']);
  });

  it('拒绝 DTD/外部实体、HTML 错误页及未闭合条目，合法空 feed 返回空', async () => {
    const { parseArxivFeed } = await import('../content');
    expect(() => parseArxivFeed('<!DOCTYPE rss [<!ENTITY x SYSTEM "file:///etc/passwd">]>' + feed(paper()), day)).toThrow(/DTD/);
    expect(() => parseArxivFeed('<html><body>Unavailable</body></html>', day)).toThrow(/格式/);
    expect(() => parseArxivFeed(feed('<item><title>incomplete</title>'), day)).toThrow(/不完整/);
    expect(parseArxivFeed(feed(), day)).toEqual([]);
  });

  it('丢弃伪装的 arXiv 主机、HTTP、用户信息与不一致 GUID，不跟随条目链接', async () => {
    const { parseArxivFeed } = await import('../content');
    expect(parseArxivFeed(feed(
      paper({ link: 'https://arxiv.org.evil.test/abs/2610.12345' }),
      paper({ link: 'http://arxiv.org/abs/2610.12345' }),
      paper({ link: 'https://arxiv.org@127.0.0.1/abs/2610.12345' }),
      paper({ link: 'https://arxiv.org/abs/2610.99999' }),
    ), day)).toEqual([]);
  });

  it('正常抓取仅生成待审草稿，使用固定 HTTPS 源并禁用重定向', async () => {
    const { loadDailyContent } = await import('../content');
    const fetchMock = vi.fn().mockResolvedValue(new Response(atomFeed(atomPaper())));
    vi.stubGlobal('fetch', fetchMock);
    const result = await loadDailyContent('papers', day);
    expect(result.status).toBe('draft');
    expect(result.content?.kind).toBe('papers');
    expect(result.sourceKey).toMatch(/^papers:[a-f0-9]{64}$/);
    expect(fetchMock).toHaveBeenCalledWith('https://export.arxiv.org/api/query?search_query=cat%3Acs.AI+OR+cat%3Acs.CL+OR+cat%3Acs.LG&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending', expect.objectContaining({
      redirect: 'error', cache: 'no-store', signal: expect.any(AbortSignal),
    }));
  });

  it.each([302, 429, 503])('上游 HTTP %s 抛错，由服务层记录失败而非空稿', async (status) => {
    const { loadDailyContent } = await import('../content');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status })));
    await expect(loadDailyContent('papers', day)).rejects.toThrow(`HTTP ${status}`);
  });

  it('声明体积和实际流体积均有上限', async () => {
    const { loadDailyContent, parseArxivFeed } = await import('../content');
    const oversized = 'x'.repeat(8 * 1024 * 1024 + 1);
    expect(() => parseArxivFeed(oversized, day)).toThrow(/体积/);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { headers: { 'content-length': String(oversized.length) } })));
    await expect(loadDailyContent('papers', day)).rejects.toThrow(/体积/);
    vi.resetModules();
    const fresh = await import('../content');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(oversized)));
    await expect(fresh.loadDailyContent('papers', day)).rejects.toThrow(/体积/);
  });

  it('接受超过旧2MB上限的正常合并feed，仍只输出三篇', async () => {
    const { parseArxivFeed } = await import('../content');
    const xml = feed(...Array.from({ length: 2000 }, (_, index) => paper({
      id: `2610.${String(index).padStart(5, '0')}`, description: 'A detailed research abstract. '.repeat(30),
    })));
    expect(Buffer.byteLength(xml)).toBeGreaterThan(2 * 1024 * 1024);
    expect(parseArxivFeed(xml, day)).toHaveLength(3);
  });

  it('并发补跑共用单连接，相邻请求至少间隔三秒，失败后仍可继续', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-14T04:00:00Z'));
    const { loadDailyContent } = await import('../content');
    const starts: number[] = [];
    const fetchMock = vi.fn().mockImplementation(async () => {
      starts.push(Date.now());
      if (starts.length === 1) throw new TypeError('network unavailable');
      return new Response(feed());
    });
    vi.stubGlobal('fetch', fetchMock);
    const results = Promise.allSettled([
      loadDailyContent('papers', day), loadDailyContent('papers', day), loadDailyContent('papers', day),
    ]);
    await vi.runAllTimersAsync();
    expect((await results).map((result) => result.status)).toEqual(['rejected', 'fulfilled', 'fulfilled']);
    expect(starts[1] - starts[0]).toBeGreaterThanOrEqual(3000);
    expect(starts[2] - starts[1]).toBeGreaterThanOrEqual(3000);
  });
});

describe('已有 AI 资讯与发布会', () => {
  it('只查询已发布 AI 资讯，使用北京时间当天边界并保留官方/聚合来源身份', async () => {
    const { loadDailyContent } = await import('../content');
    mocks.limit.mockResolvedValue([
      aiRow(), aiRow({ id: 'pf_digest', canonicalUrl: 'https://agihunt.info/daily/2026-10-14', sourceName: 'AGI Hunt 日报', trustLevel: 'verified' }),
      aiRow({ id: 'pf_yesterday', canonicalUrl: 'https://openai.com/news/old', publishedAt: '2026-10-13T15:59:59.000Z' }),
      aiRow({ id: 'pf_tomorrow', canonicalUrl: 'https://openai.com/news/future', publishedAt: '2026-10-14T16:00:00.000Z' }),
    ]);
    const result = await loadDailyContent('ai', day);
    expect(result.status).toBe('published');
    if (result.content?.kind !== 'ai') throw new Error('Expected AI briefing');
    expect(result.content.items).toHaveLength(2);
    expect(result.content.items.map((item) => item.sourceType)).toEqual(['official', 'aggregator']);
    const query = new PgDialect().sqlToQuery(mocks.where.mock.calls[0][0] as SQL);
    expect(query.params).toEqual(['published', 'ai-update', '2026-10-13T16:00:00.000Z', '2026-10-14T16:00:00.000Z']);
    expect(query.sql).toContain('"pathfinder_items"."status"');
  });

  it('按来源URL去重、排除已用内容，跳过缺摘要和不安全链接，最多五条', async () => {
    const { loadDailyContent } = await import('../content');
    mocks.limit.mockResolvedValue([
      aiRow({ id: 'already-used' }),
      aiRow({ id: 'no-summary', summaryZh: '', summaryEn: '' }),
      aiRow({ id: 'insecure', canonicalUrl: 'javascript:alert(1)' }),
      ...Array.from({ length: 7 }, (_, index) => aiRow({ id: `pf_${index}`, canonicalUrl: `https://openai.com/news/${index}` })),
      aiRow({ id: 'duplicate', canonicalUrl: 'https://openai.com/news/0?utm_source=other' }),
    ]);
    const result = await loadDailyContent('ai', day, ['already-used']);
    if (result.content?.kind !== 'ai') throw new Error('Expected AI briefing');
    expect(result.content.items.map((item) => item.id)).toEqual(['pf_0', 'pf_1', 'pf_2', 'pf_3', 'pf_4']);
  });

  it('数据库失败向上传递，不回退静态种子；正常无资讯是 empty', async () => {
    const { loadDailyContent } = await import('../content');
    mocks.limit.mockRejectedValueOnce(new Error('database unavailable'));
    await expect(loadDailyContent('ai', day)).rejects.toThrow('database unavailable');
    expect(await loadDailyContent('ai', day)).toMatchObject({ status: 'empty', content: null });
  });

  it('发布会默认无稿，等待管理员录入；非法日期不发请求', async () => {
    const { loadDailyContent } = await import('../content');
    expect(await loadDailyContent('events', day)).toMatchObject({ status: 'empty', content: null });
    await expect(loadDailyContent('papers', '2026-02-30')).rejects.toThrow();
    expect(mocks.select).not.toHaveBeenCalled();
  });
});
