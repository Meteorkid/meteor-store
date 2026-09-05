import { describe, expect, it } from 'vitest';
import { CATALOG_FACT_KEYS, catalogMetaFields } from '../catalog-fields';
import { catalogItemFixture } from './fixtures';

/** 只回显 key 与参数，断言的是「显示了哪些字段」而不是具体文案。 */
const t = (key: string, values?: Record<string, string | number>) => (
  values ? `${key}:${Object.values(values).join(',')}` : key
);

describe('卡片按类型选取元信息', () => {
  it('AI 动态只给机构和发布时间，不出现费用与参与形式', () => {
    const fields = catalogMetaFields(
      catalogItemFixture({
        itemType: 'ai-update',
        organization: { zh: 'Google DeepMind', en: 'Google DeepMind' },
        publishedAt: '2026-08-19T00:00:00.000Z',
      }),
      'zh',
      t,
    );

    expect(fields[0]).toBe('Google DeepMind');
    expect(fields.some((field) => field.startsWith('published:'))).toBe(true);
    // 一条新闻标着「免费 · 形式未注明」既没有信息量，又会被误当成可报名的机会
    expect(fields).not.toContain('free');
    expect(fields).not.toContain('costUnknown');
    expect(fields.some((field) => field.startsWith('remote.'))).toBe(false);
  });

  it('竞赛展示费用，不展示与报名无关的发布时间', () => {
    const fields = catalogMetaFields(
      catalogItemFixture({ itemType: 'competition', cost: { amount: 0, currency: 'CNY', label: null } }),
      'zh',
      t,
    );
    expect(fields).toContain('free');
    expect(fields.some((field) => field.startsWith('published:'))).toBe(false);
  });

  it('实习在参与形式未注明时不占用字段', () => {
    const withStatus = catalogMetaFields(
      catalogItemFixture({ itemType: 'internship', remoteStatus: 'onsite' }),
      'zh',
      t,
    );
    const withoutStatus = catalogMetaFields(
      catalogItemFixture({ itemType: 'internship', remoteStatus: 'unspecified' }),
      'zh',
      t,
    );

    expect(withStatus).toContain('remote.onsite');
    expect(withoutStatus.some((field) => field.startsWith('remote.'))).toBe(false);
  });

  it('开源展示投入时间与技能标签，最多两个', () => {
    const fields = catalogMetaFields(
      catalogItemFixture({
        itemType: 'open-source',
        estimatedMinutes: 120,
        tags: { topic: [], skill: ['python', 'c', 'testing'], career: [], format: [] },
      }),
      'zh',
      t,
    );

    expect(fields).toContain('time:2');
    expect(fields).toContain('python');
    expect(fields).toContain('c');
    expect(fields).not.toContain('testing');
  });

  it('缺失字段不会留下空字符串', () => {
    const fields = catalogMetaFields(
      catalogItemFixture({ itemType: 'open-source', estimatedMinutes: null, region: null }),
      'zh',
      t,
    );
    expect(fields.every((field) => field.length > 0)).toBe(true);
  });
});

describe('详情页关键事实按类型裁剪', () => {
  it('AI 动态不列费用、设备、网络与参与形式', () => {
    expect(CATALOG_FACT_KEYS['ai-update']).not.toContain('cost');
    expect(CATALOG_FACT_KEYS['ai-update']).not.toContain('device');
    expect(CATALOG_FACT_KEYS['ai-update']).not.toContain('network');
    expect(CATALOG_FACT_KEYS['ai-update']).not.toContain('remote');
    /*
     * 地区同理，只是漏得更久：抓取管线给每条 RSS 硬编码 region: 'global'
     * （见 ingestion/parse.ts），线上实测 100/100 全是「全球」。
     * 一个恒定值不构成事实，只是占着侧栏的位置。
     */
    expect(CATALOG_FACT_KEYS['ai-update']).not.toContain('region');
  });

  it('竞赛保留截止与费用，实习保留地点与形式', () => {
    expect(CATALOG_FACT_KEYS.competition).toContain('deadline');
    expect(CATALOG_FACT_KEYS.competition).toContain('cost');
    expect(CATALOG_FACT_KEYS.internship).toContain('region');
    expect(CATALOG_FACT_KEYS.internship).toContain('remote');
  });

  it('每类都至少列出一项事实', () => {
    for (const keys of Object.values(CATALOG_FACT_KEYS)) {
      expect(keys.length).toBeGreaterThan(0);
    }
  });
});
