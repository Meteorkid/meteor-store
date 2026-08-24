import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchPathfinderSource, PATHFINDER_MAX_RESPONSE_BYTES } from '../ingestion/fetch-source';
import { cleanExternalText, isAllowedHost, normalizeIngestionUrl } from '../ingestion/normalize';
import { parseGithubSearch, parseGreenhouseJobs, parseRss } from '../ingestion/parse';
import {
  buildCuratedIssueQuery,
  GITHUB_QUERY_LIMIT,
  curatedRepositoriesByDirection,
  PATHFINDER_SYNC_SOURCES,
  PATHFINDER_SYNC_SOURCE_MAP,
  stableBucket,
} from '../ingestion/sources';
import {
  buildPathfinderMembershipCursor,
  changedPathfinderStatus,
  effectivePathfinderAutoPublish,
  isPathfinderSourceDue,
  parsePathfinderMembershipCursor,
  restoredPathfinderStatus,
  serializeDirections,
  updateLocalizedZh,
} from '../ingestion/sync';

describe('Pathfinder ingestion', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('规范化 URL 并移除跟踪参数', () => {
    expect(normalizeIngestionUrl('https://Example.com/post/?utm_source=x&b=2&a=1#part'))
      .toBe('https://example.com/post?a=1&b=2');
    expect(normalizeIngestionUrl('http://example.com/post')).toBeNull();
  });

  it('只接受精确域名或其子域名', () => {
    expect(isAllowedHost('https://news.openai.com/a', ['openai.com'])).toBe(true);
    expect(isAllowedHost('https://openai.com.attacker.test/a', ['openai.com'])).toBe(false);
  });

  it('清理外部 HTML、实体并限制长度', () => {
    expect(cleanExternalText('<p>Hello &amp; <b>world</b></p>', 100)).toBe('Hello & world');
    expect(cleanExternalText('123456', 5)).toBe('1234…');
    expect(cleanExternalText('bad &#99999999;', 100)).toBe('bad &#99999999;');
  });

  it('清理 XML 实体编码的外部 HTML', () => {
    expect(cleanExternalText(
      '&lt;img src=&quot;https://storage.googleapis.com/example.webp&quot;&gt;Study with Search',
      100,
    )).toBe('Study with Search');
  });

  it('解析 RSS 与 Atom 条目并拒绝非白名单链接', () => {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('openai-news')!;
    const xml = `
      <rss><channel>
        <item><title><![CDATA[First update]]></title><link>https://openai.com/news/first?utm_source=x</link><guid>first</guid><description><![CDATA[<p>Summary</p>]]></description><pubDate>Mon, 24 Aug 2026 00:00:00 GMT</pubDate></item>
        <item><title>Bad</title><link>https://attacker.test/post</link></item>
      </channel></rss>`;
    const items = parseRss(source, xml);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      externalId: 'first',
      canonicalUrl: 'https://openai.com/news/first',
      titleEn: 'First update',
      learningEligible: false,
    });
  });

  it('按来源同步周期判断是否到期，非法时间会安全重试', () => {
    const now = new Date('2026-08-24T02:00:00.000Z');
    expect(isPathfinderSourceDue(null, 60, now)).toBe(true);
    expect(isPathfinderSourceDue('invalid', 60, now)).toBe(true);
    expect(isPathfinderSourceDue('2026-08-24T01:30:01.000Z', 60, now)).toBe(false);
    expect(isPathfinderSourceDue('2026-08-24T01:00:00.000Z', 60, now)).toBe(true);
  });

  it('长期未核验条目只有在曾人工通过或允许自动发布时才恢复公开', () => {
    expect(restoredPathfinderStatus({ reviewerId: null, reviewedAt: null }, false)).toBe('pending');
    expect(restoredPathfinderStatus({ reviewerId: 'admin', reviewedAt: '2026-08-01' }, false)).toBe('published');
    expect(restoredPathfinderStatus({ reviewerId: null, reviewedAt: null }, true)).toBe('published');
  });

  it('内容变化需要重新审核，但显式下架和驳回不会被同步任务复活', () => {
    expect(changedPathfinderStatus('published', false)).toBe('pending');
    expect(changedPathfinderStatus('published', true)).toBe('published');
    expect(changedPathfinderStatus('archived', true)).toBe('archived');
    expect(changedPathfinderStatus('rejected', true)).toBe('rejected');
  });

  it('代码白名单撤销直发后，即使数据库遗留 true 也必须进入人工审核', () => {
    expect(effectivePathfinderAutoPublish(true, true)).toBe(true);
    expect(effectivePathfinderAutoPublish(true, false)).toBe(false);
    expect(effectivePathfinderAutoPublish(false, true)).toBe(false);
  });

  it('成员游标只保留最近一次 200 响应中的受限条目，供 304 刷新核验时间', () => {
    const cursor = buildPathfinderMembershipCursor([
      { externalId: 'one' },
      { externalId: 'one' },
      { externalId: 'two' },
    ]);
    expect(parsePathfinderMembershipCursor(cursor)).toEqual(['one', 'two']);
    expect(parsePathfinderMembershipCursor('{')).toEqual([]);
  });

  it('解析 GitHub issue 并保留可验证字段', () => {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('github-good-first-issues')!;
    const items = parseGithubSearch(source, JSON.stringify({
      items: [{
        id: 42,
        html_url: 'https://github.com/example/project/issues/7',
        repository_url: 'https://api.github.com/repos/example/project',
        title: 'Improve React docs',
        body: '<p>Update the getting started guide.</p>',
        created_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-24T00:00:00Z',
        labels: [{ name: 'good first issue' }, { name: 'documentation' }],
      }],
    }));
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      externalId: '42',
      organization: 'example/project',
      direction: 'frontend',
      directions: ['frontend'],
      difficulty: 'beginner',
      learningEligible: true,
      requiresManualEligibilityCheck: true,
      publishedAt: '2026-08-01T00:00:00.000Z',
    });
    expect(items[0].contentHash).toHaveLength(64);
  });

  it('已策展来源的 issue 用来源方向，且不需要人工核对资格', () => {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('curated-issues-data-1')!;
    const items = parseGithubSearch(source, JSON.stringify({
      items: [{
        id: 99,
        html_url: 'https://github.com/pandas-dev/pandas/issues/501',
        repository_url: 'https://api.github.com/repos/pandas-dev/pandas',
        // 标题里全是 React 词汇，用来证明方向来自来源而不是文本推断
        title: 'Improve React-style docs example',
        body: 'Update the docstring.',
        created_at: '2026-08-01T00:00:00Z',
        labels: [{ name: 'good first issue' }, { name: 'Docs' }],
      }],
    }));

    expect(items[0]).toMatchObject({
      direction: 'data',
      directions: ['data'],
      learningEligible: true,
      requiresManualEligibilityCheck: false,
    });
  });

  it('已策展 issue 来源只能查询目录里已有的仓库', () => {
    const seededRepos = new Set(
      [...curatedRepositoriesByDirection().values()].flat().map((repo) => repo.toLowerCase()),
    );
    const curated = PATHFINDER_SYNC_SOURCES.filter((source) => source.curated);
    expect(curated.length).toBeGreaterThan(0);

    for (const source of curated) {
      const query = new URL(source.fetchUrl).searchParams.get('q') ?? '';
      const repos = [...query.matchAll(/repo:([^\s]+)/g)].map((match) => match[1].toLowerCase());
      expect(repos.length).toBeGreaterThan(0);
      for (const repo of repos) {
        // 自动发布的前提是仓库已经在目录里审过；查询里出现没审过的仓库就等于绕过了审核
        expect(seededRepos, `${source.id} 查询了未策展的仓库 ${repo}`).toContain(repo);
      }
      expect(source.autoPublish).toBe(true);
    }
  });

  it('每条生成的查询都不超过 GitHub 搜索的 256 字符上限', () => {
    // 超限时 GitHub 返回 422，而且是静默的：整条来源无声停产，后台只看到抓取 0 条。
    // 所以宁可在 CI 上红——此时把 CURATED_ISSUE_BUCKETS 调大一次即可。
    for (const source of PATHFINDER_SYNC_SOURCES.filter((item) => item.curated)) {
      const query = new URL(source.fetchUrl).searchParams.get('q') ?? '';
      expect(query.length, `${source.id} 的查询已达 ${query.length} 字符`)
        .toBeLessThanOrEqual(GITHUB_QUERY_LIMIT);
    }
  });

  it('目录里每个已策展仓库都恰好被一条来源覆盖', () => {
    // 「加仓库到 catalog-seeds.ts，issue 自动跟上」靠的就是这条：
    // 漏掉的仓库不会有任何提示，多覆盖一次则会浪费一次抓取配额
    const covered = PATHFINDER_SYNC_SOURCES
      .filter((source) => source.curated)
      .flatMap((source) => {
        const query = new URL(source.fetchUrl).searchParams.get('q') ?? '';
        return [...query.matchAll(/repo:([^\s]+)/g)].map((match) => match[1]);
      });
    const seeded = [...curatedRepositoriesByDirection().values()].flat();

    expect([...covered].sort()).toEqual([...seeded].sort());
  });

  it('新增仓库不会挪动已有仓库的来源归属', () => {
    // 分桶按仓库名哈希取模，桶数固定。改成按当前数量动态算桶数的话，
    // 每加一个仓库都会重排，已入库的 issue 会与新来源对不上号并慢慢变 stale。
    const before = ['django/django', 'nodejs/node', 'pallets/flask']
      .map((repo) => stableBucket(repo, 2));
    const after = ['django/django', 'nodejs/node', 'pallets/flask']
      .map((repo) => stableBucket(repo, 2));

    expect(after).toEqual(before);
    // 哈希只取决于仓库名本身，与清单里有多少个仓库、顺序如何无关
    expect(stableBucket('django/django', 2)).toBe(stableBucket('django/django', 2));
  });

  it('查询串按固定格式拼装，只收当前开放且无人认领的 issue', () => {
    const query = buildCuratedIssueQuery(['a/b', 'c/d']);
    expect(query).toContain('is:open');
    expect(query).toContain('no:assignee');
    expect(query).toContain('archived:false');
    expect(query).toContain('label:"good first issue"');
    expect(query).toContain('repo:a/b repo:c/d');
  });

  it('泛 GitHub 搜索来源已停用', () => {
    // 每小时约 30 条几乎不重复的 issue、全部滞留 pending、且被禁止进入学习路径；
    // 职责已由按种子仓库生成的策展来源接管
    expect(PATHFINDER_SYNC_SOURCE_MAP.get('github-good-first-issues')?.enabled).toBe(false);
  });

  it('职位板只取面向学生的岗位，并保留地点与发布时间', () => {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('databricks-student-jobs')!;
    const items = parseGreenhouseJobs(source, JSON.stringify({
      jobs: [
        {
          id: 1,
          title: 'Software Engineering Intern (2027 Start)',
          absolute_url: 'https://databricks.com/company/careers/open-positions/job?gh_jid=1',
          location: { name: 'San Francisco, California' },
          company_name: 'Databricks',
          first_published: '2026-08-20T23:40:25-04:00',
          application_deadline: null,
        },
        {
          id: 2,
          // 「International」含 intern 子串：早先用 includes 判断时它被当成实习岗放了进来
          title: 'Manager, International Statutory Accounting',
          absolute_url: 'https://databricks.com/company/careers/open-positions/job?gh_jid=2',
          location: { name: 'London, United Kingdom' },
        },
      ],
    }));

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      externalId: '1',
      organization: 'Databricks',
      regionZh: 'San Francisco, California',
      remoteStatus: 'onsite',
      // 工作许可与年级要求画像判断不了，必须本人核对
      requiresManualEligibilityCheck: true,
      learningEligible: false,
      publishedAt: '2026-08-21T03:40:25.000Z',
    });
    expect(items[0].summaryZh).toContain('San Francisco');
  });

  it('职位板拒绝非白名单域名的岗位链接，远程岗位标记为远程', () => {
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('databricks-student-jobs')!;
    const items = parseGreenhouseJobs(source, JSON.stringify({
      jobs: [
        {
          id: 3,
          title: 'Data Engineering Intern',
          absolute_url: 'https://evil.example.com/job/3',
          location: { name: 'Remote - United States' },
        },
        {
          id: 4,
          title: 'Research Intern',
          absolute_url: 'https://job-boards.greenhouse.io/databricks/jobs/4',
          location: { name: 'Remote - Canada' },
        },
      ],
    }));

    expect(items.map((item) => item.externalId)).toEqual(['4']);
    expect(items[0].remoteStatus).toBe('remote');
  });

  it('英文采集内容变化时只更新旧 fallback，不覆盖人工中文', () => {
    expect(updateLocalizedZh('Old summary', 'Old summary', null, 'New summary'))
      .toBe('New summary');
    expect(updateLocalizedZh('人工摘要', 'Old summary', null, 'New summary'))
      .toBe('人工摘要');
    // 上游删除摘要时，英文与由英文生成的中文 fallback 都清空。
    expect(updateLocalizedZh('Old summary', 'Old summary', null, '')).toBe('');
  });

  it('持久化多方向时去重、保留主方向并丢弃非法值', () => {
    expect(serializeDirections('ai', ['data', 'ai', 'invalid' as 'ai']))
      .toBe('["ai","data"]');
  });

  it('重定向到非白名单域名时拒绝继续抓取', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, {
      status: 302,
      headers: { location: 'https://attacker.test/feed' },
    })));
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('openai-news')!;

    await expect(fetchPathfinderSource(source)).rejects.toThrow(/host is not allowed/);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('外部网络连接失败时只重试一次', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(new Response('<rss />', { status: 200 })));
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('openai-news')!;

    await expect(fetchPathfinderSource(source)).resolves.toMatchObject({
      body: '<rss />',
      notModified: false,
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('流式响应超过上限时在完整读入内存前中止', async () => {
    const oversized = new Uint8Array(PATHFINDER_MAX_RESPONSE_BYTES + 1);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(oversized);
        controller.close();
      },
    }), { status: 200 })));
    const source = PATHFINDER_SYNC_SOURCE_MAP.get('openai-news')!;

    await expect(fetchPathfinderSource(source)).rejects.toThrow(/too large/);
  });
});
