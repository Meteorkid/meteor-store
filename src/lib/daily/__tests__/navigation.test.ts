import { describe, expect, it } from 'vitest';
import { dailyEntryAnchor, dailyEntryHref, dailyWordAnchor, dailyWordHref, normalizeDailyReturn } from '../navigation';

describe('日刊条目定位', () => {
  it('预览链接与全文锚点一致，编码Unicode及URL符号且不跨栏目冲突', () => {
    const id = '论文 / # ? 一';
    const anchor = dailyEntryAnchor('papers', id);
    expect(anchor).toMatch(/^daily-entry-papers-[A-Za-z0-9_-]+$/);
    expect(new URL(dailyEntryHref('2026-10-24', 'papers', id), 'https://site.test').hash).toBe(`#${anchor}`);
    expect(dailyEntryAnchor('ai', id)).not.toBe(anchor);
    expect(normalizeDailyReturn(dailyEntryHref('2026-10-24', 'papers', id))).toBe(dailyEntryHref('2026-10-24', 'papers', id));
  });
  it('重复词条以索引区分，登录后仍能回到对应词条', () => {
    expect(dailyWordAnchor('take turns', 0)).not.toBe(dailyWordAnchor('take turns', 1));
    expect(dailyWordAnchor(' take turns ', 1)).toBe(dailyWordAnchor('take turns', 1));
    const href = dailyWordHref('2026-10-24', 'take turns', 1);
    expect(href.endsWith(dailyWordAnchor('take turns', 1))).toBe(true);
    expect(normalizeDailyReturn(href)).toBe(href);
  });
  it('不接受伪栏目、任意hash或超长条目', () => {
    for (const hash of ['daily-entry-admin-YQ', 'daily-entry-papers-..', `daily-entry-papers-${'a'.repeat(1201)}`]) {
      expect(normalizeDailyReturn(`/daily?date=2026-10-24#${hash}`)).toBeNull();
    }
  });
});
