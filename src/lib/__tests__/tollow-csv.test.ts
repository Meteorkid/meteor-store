import { describe, expect, it } from 'vitest';
import { buildTollowSessionsCsv } from '../tollow-csv';

describe('Tollow Pro CSV', () => {
  it('输出 UTF-8 BOM、稳定列顺序并防止公式注入', () => {
    const csv = buildTollowSessionsCsv([{
      id: 'S1',
      bookId: null,
      bookTitle: '=HYPERLINK("https://evil.test","含,逗号")\n下一行',
      startedAt: '2026-08-24T00:00:00.000Z',
      endedAt: '2026-08-24T00:01:00.000Z',
      durationMs: 60_000,
      wordsTyped: 100,
      wpm: 88.5,
      accuracy: 98.25,
      errorCount: 2,
    }]);

    expect(csv.startsWith('\uFEFF"开始时间","结束时间","书籍"')).toBe(true);
    expect(csv).toContain("'=HYPERLINK");
    expect(csv).toContain('""https://evil.test""');
    expect(csv.endsWith('\r\n')).toBe(true);
  });
});
