import { describe, expect, it } from 'vitest';
import type { DailyEdition } from '@/lib/daily/types';
import { getDailyEditionEntries } from '../state';

const publishedPaper: DailyEdition = {
  id: 'paper-edition', date: '2026-10-16', channel: 'papers', status: 'published',
  title: 'A paper worth reading', summary: 'A short introduction.',
  content: { kind: 'papers', items: [{ id: 'paper', title: 'Paper', summary: 'Summary', url: 'https://example.com/paper', sourceName: 'Source', sourceType: 'official' }] },
  sourceKey: null, publishedAt: '2026-10-16T00:40:00Z', updatedAt: '2026-10-16T00:40:00Z',
};

describe('本期概览的内容边界', () => {
  it('按所选日期匹配，并只用同一期的已读记录', () => {
    const editions = [{ ...publishedPaper, id: 'today', date: '2026-10-17', title: 'Today' }, publishedPaper];
    const entries = getDailyEditionEntries('2026-10-16', ['papers'], editions, ['2026-10-17:papers']);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ edition: { id: 'paper-edition' }, status: 'published', isRead: false });
    expect(getDailyEditionEntries('2026-10-16', ['papers'], editions, ['2026-10-16:papers'])[0].isRead).toBe(true);
  });

  it('保持栏目顺序，排除未选中的栏目和全年申请日历', () => {
    const entries = getDailyEditionEntries('2026-10-16', ['masters', 'papers', 'english'], [publishedPaper], []);
    expect(entries.map(entry => entry.channel.id)).toEqual(['english', 'papers']);
    expect(getDailyEditionEntries('2026-10-16', ['masters'], [], [])).toEqual([]);
    expect(getDailyEditionEntries('2026-10-16', [], [publishedPaper], [])).toEqual([]);
  });

  it.each([
    ['empty', 'empty'], ['failed', 'failed'], ['draft', 'unpublished'], ['published', 'unpublished'],
  ] as const)('%s 无正文时显示 %s，历史已读不计入已完成', (status, expected) => {
    const edition = { ...publishedPaper, status, content: null };
    const entries = getDailyEditionEntries('2026-10-16', ['papers'], [edition], ['2026-10-16:papers']);
    expect(entries[0]).toMatchObject({ status: expected, isRead: false });
  });

  it('成功读取但缺少该期记录时才判断未发布，不修改传入数据', () => {
    const editions = Object.freeze([Object.freeze(publishedPaper)]);
    const selected = Object.freeze(['papers'] as const);
    const entries = getDailyEditionEntries('2026-10-17', selected, editions, []);
    expect(entries[0]).toMatchObject({ edition: undefined, status: 'unpublished', isRead: false });
    expect(editions[0]).toBe(publishedPaper);
  });
});
