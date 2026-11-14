import { describe, expect, it } from 'vitest';
import {
  CHANGELOG_PRODUCT_IDS,
  FULL_BODY_LIMIT,
  changelogCopy,
  prepareReleaseBody,
  releaseSummary,
} from '../product-changelog';
import snapshot from '../product-releases.json';
import { alternativeProducts } from '../xisland-alternatives';
import { alternativeDetails } from '../xisland-alternative-details';

describe('release 正文整理', () => {
  it('去掉开头的 H1，其余标题降两级', () => {
    const out = prepareReleaseBody('# X Island v2.0.18\n\n正文。\n\n## 小节\n\n- 条目');
    // 页面自己渲染版本标题，正文再来一个 H1 会出现两个主标题
    expect(out.startsWith('# ')).toBe(false);
    expect(out).toContain('#### 小节');
    expect(out).toContain('正文。');
  });

  it('代码块里的 # 注释不被当成标题', () => {
    const out = prepareReleaseBody('正文\n\n```bash\n# 这是注释\nrm -rf x\n```');
    expect(out).toContain('# 这是注释');
    expect(out).not.toContain('#### 这是注释');
  });

  it('去掉独立成行的图片，正文里的行内图片保留', () => {
    const out = prepareReleaseBody('段前\n\n![截图](https://x/a.png)\n\n段后 ![行内](https://x/b.png)');
    expect(out).not.toContain('a.png');
    // 行内图片是句子的一部分，删掉会把句子拆坏
    expect(out).toContain('b.png');
  });

  it('摘要取第一段可读文字并截断', () => {
    const summary = releaseSummary('# 标题\n\n这是第一段。\n\n- 列表项\n\n## 小标题');
    expect(summary.startsWith('这是第一段')).toBe(true);
    expect(summary.length).toBeLessThanOrEqual(111);
  });
});

describe('更新日志快照', () => {
  it('每个白名单产品都有版本，且按时间降序、tag 唯一', () => {
    for (const id of CHANGELOG_PRODUCT_IDS) {
      const rows = (snapshot as Record<string, Array<{ tag: string; published: string }>>)[id];
      expect(rows.length, `${id} 快照为空`).toBeGreaterThan(0);
      expect(new Set(rows.map((row) => row.tag)).size).toBe(rows.length);
      const dates = rows.map((row) => row.published);
      expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
      expect(FULL_BODY_LIMIT).toBeGreaterThan(0);
    }
  });

  it('两套文案的键一一对应，不会漏翻', () => {
    const zh = Object.keys(changelogCopy.zh).sort();
    const en = Object.keys(changelogCopy.en).sort();
    expect(en).toEqual(zh);
  });
});

describe('对比子页数据', () => {
  it('每个详情 id 都能在总表里找到对应行', () => {
    const ids = new Set(alternativeProducts.map((item) => item.id));
    for (const detail of alternativeDetails) {
      expect(ids.has(detail.id), `${detail.id} 不在总表里`).toBe(true);
    }
  });

  it('总表里的每个竞品都有独立对比页（本站除外）', () => {
    const detailed = new Set(alternativeDetails.map((item) => item.id));
    for (const item of alternativeProducts) {
      if (item.self) continue;
      expect(detailed.has(item.id), `${item.id} 缺少对比页文案`).toBe(true);
    }
  });

  it('每页都必须写「什么时候该选对方」，不能只讲自己的优点', () => {
    for (const detail of alternativeDetails) {
      for (const locale of ['zh', 'en'] as const) {
        expect(detail.chooseThem[locale].trim().length).toBeGreaterThan(20);
        expect(detail.sections.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
