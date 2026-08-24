import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchPathfinderSource, PATHFINDER_MAX_RESPONSE_BYTES } from '../ingestion/fetch-source';
import { cleanExternalText, isAllowedHost, normalizeIngestionUrl } from '../ingestion/normalize';
import { parseGithubSearch, parseRss } from '../ingestion/parse';
import { PATHFINDER_SYNC_SOURCE_MAP } from '../ingestion/sources';
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
