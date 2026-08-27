import { describe, expect, it } from 'vitest';
import {
  STATIC_PATHFINDER_ITEMS,
  STATIC_PATHFINDER_SOURCES,
} from '../catalog-seeds';

describe('Pathfinder 静态可信种子', () => {
  it('规模保持在 30–80 条且覆盖四类内容', () => {
    /*
     * 上界从 50 提到 80：为摊薄来源集中度补进了 16 个开源仓库。
     *
     * 起因是实测 68 条开源任务里 apache/airflow 占 22、pytorch/pytorch 占 20，
     * 两个仓库就是六成；而收紧「可上手」判据后 backend 方向一度只剩 0 条候选。
     * 候选池太小时任何严格判据都会表现为「这个方向没有任务」，所以扩仓库与
     * 收紧判据必须一起做。上界仍然存在，是因为这份种子要人工核实过每一条。
     */
    expect(STATIC_PATHFINDER_ITEMS.length).toBeGreaterThanOrEqual(30);
    expect(STATIC_PATHFINDER_ITEMS.length).toBeLessThanOrEqual(80);

    const types = new Set(STATIC_PATHFINDER_ITEMS.map((item) => item.itemType));
    expect(types).toEqual(new Set(['open-source', 'competition', 'internship', 'ai-update']));
  });

  it('只使用唯一的 HTTPS 官方原文链接', () => {
    const urls = STATIC_PATHFINDER_ITEMS.map((item) => item.canonicalUrl);

    expect(new Set(urls).size).toBe(urls.length);
    for (const raw of urls) {
      const url = new URL(raw);
      expect(url.protocol).toBe('https:');
      expect(url.username).toBe('');
      expect(url.password).toBe('');
    }
    expect(STATIC_PATHFINDER_SOURCES.every((source) => (
      source.trustLevel === 'official' && source.origin === 'static'
    ))).toBe(true);
  });

  it('公开字段双语完整，且 AI 动态不会直接进入学习路径', () => {
    for (const item of STATIC_PATHFINDER_ITEMS) {
      expect(item.status).toBe('published');
      expect(item.title.zh.trim()).not.toBe('');
      expect(item.title.en.trim()).not.toBe('');
      expect(item.summary.zh.trim()).not.toBe('');
      expect(item.summary.en.trim()).not.toBe('');
      expect(item.eligibility.zh.trim()).not.toBe('');
      expect(item.eligibility.en.trim()).not.toBe('');
      expect(item.organization.zh.trim()).not.toBe('');
      expect(item.organization.en.trim()).not.toBe('');
      expect(item.source.name.zh.trim()).not.toBe('');
      expect(item.source.name.en.trim()).not.toBe('');
      if (item.region) {
        expect(item.region.zh.trim()).not.toBe('');
        expect(item.region.en.trim()).not.toBe('');
      }
      expect(Number.isNaN(Date.parse(item.verifiedAt))).toBe(false);
      if (item.itemType === 'ai-update') expect(item.learningEligible).toBe(false);
    }
  });

  it('英文事实字段不会回落为中文占位', () => {
    for (const item of STATIC_PATHFINDER_ITEMS) {
      expect(item.source.name.en).not.toMatch(/\p{Script=Han}/u);
      expect(item.organization.en).not.toMatch(/\p{Script=Han}/u);
      expect(item.region?.en ?? '').not.toMatch(/\p{Script=Han}/u);
      expect(item.deadlineText?.en ?? '').not.toMatch(/\p{Script=Han}/u);
    }
  });

  it('未知时区不伪造标准时间，明确时区的截止日期才写入 deadlineAt', () => {
    const timeSensitiveItems = STATIC_PATHFINDER_ITEMS.filter((item) => (
      item.itemType === 'competition' || item.itemType === 'internship'
    ));

    expect(timeSensitiveItems.length).toBeGreaterThan(0);
    expect(timeSensitiveItems.every((item) => item.deadlineText !== null)).toBe(true);
    expect(timeSensitiveItems
      .filter((item) => item.deadlineAt !== null)
      .every((item) => !Number.isNaN(Date.parse(item.deadlineAt!)))).toBe(true);
    expect(STATIC_PATHFINDER_ITEMS.find((item) => item.id === 'static-mitacs-gri-2027')?.deadlineAt)
      .toBe('2026-09-16T20:00:00.000Z');
    expect(STATIC_PATHFINDER_ITEMS.find((item) => item.id === 'static-oist-spring-2027')?.deadlineAt)
      .toBe('2026-10-15T14:59:00.000Z');
    expect(STATIC_PATHFINDER_ITEMS.find((item) => item.id === 'static-aic-open-source-2026')?.deadlineAt)
      .toBeNull();
    for (const id of ['aic-open-source-2026', 'ibm-z-datathon-2026', 'unu-ai-sdgs-2026', 'mitacs-gri-2027', 'oist-spring-2027', 'max-planck-cs-internship-2027']) {
      expect(STATIC_PATHFINDER_ITEMS.find((item) => item.id === `static-${id}`)?.deadlineDate)
        .toMatch(/^2026-\d{2}-\d{2}$/);
    }
  });

  it('只在官方明确时写入免费或人民币费用，其余保持未知', () => {
    const byId = new Map(STATIC_PATHFINDER_ITEMS.map((item) => [item.id, item]));
    expect(byId.get('static-aic-open-source-2026')?.costCny).toBe(500);
    expect(byId.get('static-ibm-z-datathon-2026')?.costCny).toBe(0);
    expect(byId.get('static-unu-ai-sdgs-2026')?.costCny).toBe(0);
    expect(byId.get('static-oist-spring-2027')?.costCny).toBeNull();
    expect(byId.get('static-oist-spring-2027')?.cost).toEqual({
      amount: 5000,
      currency: 'JPY',
      label: { zh: '5,000 日元（不可退）', en: 'JPY 5,000 (non-refundable)' },
    });
    expect(byId.get('static-lanqiao-cup')?.costCny).toBeNull();
  });

  it('学校、毕业日期或成熟原型等复杂资格会保留人工核对边界', () => {
    for (const id of ['static-mitacs-gri-2027', 'static-unu-ai-sdgs-2026']) {
      expect(STATIC_PATHFINDER_ITEMS.find((item) => item.id === id))
        .toMatchObject({ learningEligible: false, requiresManualEligibilityCheck: true });
    }
  });

  it('使用 2026-08 核验后的长期 canonical URL', () => {
    const byId = new Map(STATIC_PATHFINDER_ITEMS.map((item) => [item.id, item]));

    expect(byId.get('static-react')?.canonicalUrl).toBe('https://github.com/react/react');
    expect(byId.get('static-tianchi-competitions')?.canonicalUrl)
      .toBe('https://tianchi.aliyun.com/competition/');
    expect(byId.get('static-deepmind-blog')?.canonicalUrl)
      .toBe('https://deepmind.google/blog/');

    const alibaba = byId.get('static-alibaba-recruitment');
    expect(alibaba?.canonicalUrl).toBe('https://talent.alibaba.com/');
    expect(`${alibaba?.title.zh} ${alibaba?.title.en}`).not.toMatch(/校园|campus/i);
    expect(alibaba?.summary.zh).toContain('是否开放');
  });

  it('手机可浏览入口覆盖四个方向，但编码仓库仍要求电脑', () => {
    const phoneDirections = new Set(
      STATIC_PATHFINDER_ITEMS
        .filter((item) => item.device === 'either')
        .map((item) => item.direction),
    );

    expect(phoneDirections).toEqual(new Set(['ai', 'frontend', 'backend', 'data']));
    expect(STATIC_PATHFINDER_ITEMS
      .filter((item) => item.itemType === 'open-source')
      .every((item) => item.device === 'computer')).toBe(true);
  });

  it('没有具体赛项、岗位和标准截止时间的长期门户不会直接进入学习路径', () => {
    const portals = STATIC_PATHFINDER_ITEMS
      .filter((item) => item.itemType === 'competition' || item.itemType === 'internship')
      .filter((item) => !item.id.match(/aic-open-source|ibm-z-datathon|unu-ai-sdgs|mitacs-gri|oist-spring|max-planck/));
    expect(portals.every((item) => item.learningEligible === false)).toBe(true);

    // 不写死总数：那只会跟着目录大小走，加一条种子就要改一次，而它并不比
    // 上面那行多钉住任何东西。真正要保证的是「能进学习路径的都不是长期门户」
    const eligible = STATIC_PATHFINDER_ITEMS.filter((item) => item.learningEligible);
    expect(eligible.length).toBeGreaterThan(0);
    for (const item of eligible) expect(portals).not.toContainEqual(item);
  });

  it('综合招聘入口明确用标签覆盖四个技术方向', () => {
    const genericRecruitmentIds = new Set([
      'static-ncss-internships',
      'static-bytedance-campus',
      'static-tencent-campus',
      'static-alibaba-recruitment',
      'static-huawei-campus',
      'static-microsoft-students',
      'static-google-students',
    ]);

    for (const item of STATIC_PATHFINDER_ITEMS.filter((entry) => genericRecruitmentIds.has(entry.id))) {
      expect(item.tags.career).toEqual(expect.arrayContaining(['frontend', 'backend', 'ai', 'data']));
      expect(item.directions).toEqual(expect.arrayContaining(['frontend', 'backend', 'ai', 'data']));
    }
  });
});
