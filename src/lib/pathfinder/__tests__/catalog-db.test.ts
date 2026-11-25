import { describe, expect, it } from 'vitest';
import { pathfinderItems, pathfinderSources } from '@/lib/db/schema';
import { emptyPathfinderTags } from '../catalog-types';
import { mapDatabaseCatalogItem, parseCatalogDirections } from '../catalog-db';

describe('Pathfinder database catalog contract', () => {
  const item: typeof pathfinderItems.$inferSelect = {
    id: 'pf_contract',
    sourceId: 'manual-source',
    externalId: 'external-1',
    canonicalUrl: 'https://example.com/opportunity',
    urlHash: 'hash',
    itemType: 'internship',
    titleZh: '研究实习',
    titleEn: 'Research Internship',
    summaryZh: '中文摘要',
    summaryEn: 'English summary',
    organization: '测试研究所',
    organizationEn: 'Example Institute',
    direction: 'ai',
    directions: '["ai","data"]',
    difficulty: 'intermediate',
    estimatedMinutes: 360,
    costCny: null,
    costAmount: 5000,
    costCurrency: 'JPY',
    costLabelZh: '不可退',
    costLabelEn: 'Non-refundable',
    device: 'computer',
    network: 'normal',
    region: 'Japan',
    regionZh: '日本',
    regionEn: 'Japan',
    remoteStatus: 'onsite',
    eligibilityZh: '大学生，需人工核对学籍要求',
    eligibilityEn: 'University students; verify enrolment requirements manually',
    deadlineText: '2026-10-15 23:59 JST',
    deadlineTextZh: '2026-10-15 23:59 日本标准时间',
    deadlineTextEn: '2026-10-15 23:59 JST',
    deadlineDate: '2026-10-15',
    deadlineAt: '2026-10-15T14:59:00.000Z',
    publishedAt: '2026-08-01T00:00:00.000Z',
    discoveredAt: '2026-08-24T00:00:00.000Z',
    verifiedAt: '2026-08-24T00:00:00.000Z',
    status: 'published',
    learningEligible: true,
    requiresManualEligibilityCheck: true,
    reviewerId: 'admin',
    reviewedAt: '2026-08-24T00:00:00.000Z',
    contentHash: 'content-hash',
    createdAt: '2026-08-24T00:00:00.000Z',
    updatedAt: '2026-08-24T00:00:00.000Z',
  };
  const source: typeof pathfinderSources.$inferSelect = {
    id: 'manual-source',
    name: 'Example Institute',
    adapter: 'manual',
    siteUrl: 'https://example.com',
    sourceType: 'manual',
    trustLevel: 'official',
    enabled: true,
    autoPublish: false,
    syncIntervalMinutes: 1440,
    etag: null,
    lastModified: null,
    cursor: null,
    lastSuccessAt: null,
    lastError: null,
    consecutiveFailures: 0,
    createdAt: '2026-08-24T00:00:00.000Z',
    updatedAt: '2026-08-24T00:00:00.000Z',
  };

  it('新数据契约在 Drizzle 行与目录模型之间无损映射', () => {
    const tags = emptyPathfinderTags();
    tags.skill.push('Python');

    expect(mapDatabaseCatalogItem(item, source, tags)).toMatchObject({
      organization: { zh: '测试研究所', en: 'Example Institute' },
      directions: ['ai', 'data'],
      cost: {
        amount: 5000,
        currency: 'JPY',
        label: { zh: '不可退', en: 'Non-refundable' },
      },
      region: { zh: '日本', en: 'Japan' },
      deadlineText: {
        zh: '2026-10-15 23:59 日本标准时间',
        en: '2026-10-15 23:59 JST',
      },
      deadlineDate: '2026-10-15',
      requiresManualEligibilityCheck: true,
      tags: { skill: ['Python'] },
    });
  });

  it('旧的无标记付款 Issue 先隐藏，补齐标记后作为信息自动公开', () => {
    const offer = {
      ...item, itemType: 'open-source', canonicalUrl: 'https://github.com/run-llama/llama_index/issues/24363',
      titleEn: 'Docs idea: agent spend audit', summaryEn: 'Buy (live): POST https://example.org/buy → x402 $19 USDC.',
      reviewerId: null, reviewedAt: null, requiresManualEligibilityCheck: false, learningEligible: true, costCny: 0,
    };
    const github = { ...source, adapter: 'github' };
    const map = (row: typeof item) => mapDatabaseCatalogItem(row, github, emptyPathfinderTags());
    // 历史无标记记录在公开层先隐藏，下一轮同步会补上 payment-v1 标记
    expect(map(offer).status).toBe('pending');
    // 补上标记后就是一条带费用提示的公开信息，即使没有人工 reviewer
    expect(map({ ...offer, contentHash: 'payment-v1:current', requiresManualEligibilityCheck: true,
      learningEligible: false, costCny: null,
    })).toMatchObject({ status: 'published', requiresManualEligibilityCheck: true });
    // 历史数据把 learningEligible 写成 true 也不能进入学习路径
    expect(map({ ...offer, contentHash: 'payment-v1:current', requiresManualEligibilityCheck: true,
      learningEligible: true, costCny: null,
    }).learningEligible).toBe(false);
    // 人工记录过原币费用时保留金额
    expect(map({ ...offer, contentHash: 'payment-v1:current', requiresManualEligibilityCheck: true,
      learningEligible: false, costCny: null, costAmount: 19, costCurrency: 'USD',
    })).toMatchObject({ status: 'published', cost: { amount: 19, currency: 'USD' } });
    expect(map({ ...offer, status: 'rejected' }).status).toBe('rejected');
  });

  it('Codeforces 历史行的 startTimeSeconds 从公开截止字段拆出', () => {
    const contest = mapDatabaseCatalogItem({
      ...item, sourceId: 'codeforces-contests', deadlineText: null, deadlineTextZh: null, deadlineTextEn: null,
    }, source, emptyPathfinderTags());
    expect(contest).toMatchObject({ startsAt: item.deadlineAt, deadlineAt: null, deadlineDate: null });
  });

  it('多方向 JSON 损坏或混入非法值时安全回退到主方向', () => {
    expect(parseCatalogDirections('{', 'backend')).toEqual(['backend']);
    expect(parseCatalogDirections('["data","bad",42,"data"]', 'backend'))
      .toEqual(['backend', 'data']);
  });
});
