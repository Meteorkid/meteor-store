import type { PathfinderCatalogItem } from '../catalog-types';
import type { PathfinderProfile } from '../schema';

export const profileFixture: PathfinderProfile = {
  goal: '完成一个 AI 开源项目并留下可验证成果',
  goalType: 'project',
  direction: 'ai',
  stage: 'sophomore',
  foundation: 'beginner',
  weeklyHours: 4,
  durationWeeks: 6,
  device: 'phone-and-pc',
  budgetCny: 100,
  acceptForeignCurrencyCosts: false,
  network: 'normal',
  constraints: [],
};

export function catalogItemFixture(
  overrides: Partial<PathfinderCatalogItem> = {},
): PathfinderCatalogItem {
  const item: PathfinderCatalogItem = {
    id: 'item-open-source',
    sourceId: 'source-official',
    source: {
      id: 'source-official',
      name: { zh: '官方来源', en: 'Official source' },
      adapter: 'manual',
      siteUrl: 'https://example.com',
      sourceType: 'manual',
      trustLevel: 'official',
      enabled: true,
      autoPublish: false,
      syncIntervalMinutes: 1_440,
      lastSuccessAt: '2026-08-23T00:00:00.000Z',
      lastError: null,
      consecutiveFailures: 0,
      origin: 'static',
    },
    externalId: 'external-open-source',
    canonicalUrl: 'https://example.com/open-source',
    itemType: 'open-source',
    title: { zh: '可信 AI 开源项目', en: 'Verified AI open-source project' },
    summary: { zh: '适合完成最小贡献。', en: 'Suitable for a minimal contribution.' },
    organization: { zh: '示例组织', en: 'Example Org' },
    direction: 'ai',
    directions: ['ai'],
    difficulty: 'beginner',
    estimatedMinutes: 120,
    costCny: 0,
    cost: { amount: 0, currency: 'CNY', label: null },
    device: 'computer',
    network: 'normal',
    region: null,
    remoteStatus: 'remote',
    eligibility: { zh: '大学生均可参与', en: 'Open to university students' },
    deadlineText: null,
    deadlineDate: null,
    deadlineAt: null,
    publishedAt: '2026-08-01T00:00:00.000Z',
    discoveredAt: '2026-08-01T00:00:00.000Z',
    verifiedAt: '2026-08-23T00:00:00.000Z',
    status: 'published',
    learningEligible: true,
    requiresManualEligibilityCheck: false,
    tags: { topic: ['ai'], skill: ['python'], career: [], format: ['project'] },
    origin: 'static',
    ...overrides,
  };
  if (overrides.direction && overrides.directions === undefined) {
    item.directions = [overrides.direction];
  }
  if (overrides.costCny !== undefined && overrides.cost === undefined) {
    item.cost = {
      amount: overrides.costCny,
      currency: overrides.costCny === null ? null : 'CNY',
      label: null,
    };
  }
  return item;
}
