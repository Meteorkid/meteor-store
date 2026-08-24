import { describe, expect, it } from 'vitest';
import { pathfinderItems, pathfinderSources } from '@/lib/db/schema';
import { emptyPathfinderTags } from '../catalog-types';
import { mapDatabaseCatalogItem, parseCatalogDirections } from '../catalog-db';

describe('Pathfinder database catalog contract', () => {
  it('新数据契约在 Drizzle 行与目录模型之间无损映射', () => {
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

  it('多方向 JSON 损坏或混入非法值时安全回退到主方向', () => {
    expect(parseCatalogDirections('{', 'backend')).toEqual(['backend']);
    expect(parseCatalogDirections('["data","bad",42,"data"]', 'backend'))
      .toEqual(['backend', 'data']);
  });
});
