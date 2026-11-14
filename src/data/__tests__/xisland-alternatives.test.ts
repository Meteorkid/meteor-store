import { describe, expect, it } from 'vitest';
import {
  ALTERNATIVES_VERIFIED_ON,
  alternativeProducts,
  alternativesPageCopy,
} from '../xisland-alternatives';

describe('对比页数据结构', () => {
  it('至少收录 5 款同类工具', () => {
    // 少于 5 款就不配叫「同类工具对比」，只是拿一两款垫背。
    expect(alternativeProducts.length).toBeGreaterThanOrEqual(5);
  });

  it('id 唯一', () => {
    const ids = alternativeProducts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('本站条目恰好一条，且排在第一', () => {
    const self = alternativeProducts.filter((p) => p.self);
    expect(self).toHaveLength(1);
    expect(alternativeProducts[0].self).toBe(true);
    expect(self[0].id).toBe('xisland');
  });

  it('本站之外的条目按官方声称的代理数降序', () => {
    const rest = alternativeProducts.filter((p) => !p.self).map((p) => p.agents);
    expect(rest).toEqual([...rest].sort((a, b) => b - a));
  });

  it('外链一律 https，站内链接以 / 开头', () => {
    for (const p of alternativeProducts) {
      if (p.self) {
        expect(p.href.startsWith('/')).toBe(true);
      } else {
        expect(p.href.startsWith('https://')).toBe(true);
      }
      if (p.repo) expect(p.repo.startsWith('https://')).toBe(true);
    }
  });

  it('released 只允许 null 或 YYYY-MM-DD', () => {
    for (const p of alternativeProducts) {
      if (p.released !== null) {
        expect(p.released).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('每条都写清许可、价格、适合谁与取舍', () => {
    for (const p of alternativeProducts) {
      for (const field of [p.license, p.pricing, p.bestFor, p.tradeoff]) {
        expect(field.zh.trim().length).toBeGreaterThan(0);
        expect(field.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('代理数必须是正整数', () => {
    for (const p of alternativeProducts) {
      expect(Number.isInteger(p.agents)).toBe(true);
      expect(p.agents).toBeGreaterThan(0);
    }
  });
});

describe('诚实性约束（防退化成一页广告）', () => {
  it('必须保留「XIsland 不占优的地方」且不少于 3 条', () => {
    // 这一页的价值在可信，不在赢。删掉劣势清单等于把它变成广告，
    // 读者一眼能看出来，而且会反过来伤害品牌。
    expect(alternativesPageCopy.limitations.length).toBeGreaterThanOrEqual(3);
  });

  it('劣势清单必须承认用户规模与未公证这两件客观事实', () => {
    const all = alternativesPageCopy.limitations.map((l) => l.zh).join('\n');
    expect(all).toContain('star');
    expect(all).toContain('公证');
  });

  it('必须声明本页由本站团队维护，避免被当成中立评测', () => {
    expect(alternativesPageCopy.disclosure.zh).toContain('由 XIsland 团队维护');
    expect(alternativesPageCopy.disclosure.en.toLowerCase()).toContain('maintained by the xisland team');
  });

  it('必须承认「30 个」这个数字不能直接横比', () => {
    const all = alternativesPageCopy.limitations.map((l) => l.zh).join('\n');
    expect(all).toContain('不能横');
  });

  it('核对日期是合法日期且不是未来', () => {
    expect(ALTERNATIVES_VERIFIED_ON).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(`${ALTERNATIVES_VERIFIED_ON}T00:00:00Z`).getTime()).toBeLessThanOrEqual(Date.now());
  });
});
