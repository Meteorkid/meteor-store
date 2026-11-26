import { describe, expect, it } from 'vitest';
import {
  LISTENING_TESTS_PER_PAGE, paginateListeningTests, parseListeningPageParam,
} from '../pagination';

/**
 * 列表分页：每页 8 套（32 张卡片）。用合成的套题 id 模拟未来 52 套的批次，
 * 不依赖任何临时题目文件；越界页码归一，切片不重叠、不缺号。
 */

const makeTests = (count: number) => Array.from({ length: count }, (_, index) => `test-${String(index + 1).padStart(2, '0')}`);

describe('听力题库分页', () => {
  it('每页固定 8 套；52 套共 7 页，末页 4 套', () => {
    const tests = makeTests(52);
    const first = paginateListeningTests(tests, 1);
    expect(first.totalPages).toBe(7);
    expect(first.page).toBe(1);
    expect(first.items).toHaveLength(8);
    expect(first.items[0]).toBe('test-01');
    expect(first.items[7]).toBe('test-08');

    const last = paginateListeningTests(tests, 7);
    expect(last.items).toHaveLength(4);
    expect(last.items[0]).toBe('test-49');
    expect(last.items[3]).toBe('test-52');
  });

  it('各页切片首尾相接，不重叠也不缺号', () => {
    const tests = makeTests(52);
    const pages = Array.from({ length: 7 }, (_, offset) => paginateListeningTests(tests, offset + 1).items);
    expect(pages.flat()).toEqual(tests);
    for (const page of pages) expect(page.length).toBeLessThanOrEqual(LISTENING_TESTS_PER_PAGE);
  });

  it('页码越界归一：小于 1 取第 1 页，超出末页取末页，非法值取第 1 页', () => {
    const tests = makeTests(52);
    expect(paginateListeningTests(tests, 0).page).toBe(1);
    expect(paginateListeningTests(tests, -3).page).toBe(1);
    expect(paginateListeningTests(tests, 99).page).toBe(7);
    expect(paginateListeningTests(tests, Number.NaN).page).toBe(1);
    expect(paginateListeningTests(tests, 2.5).page).toBe(1);
  });

  it('少量套题时只有一页，不渲染空分页', () => {
    const tests = makeTests(2);
    const result = paginateListeningTests(tests, 1);
    expect(result.totalPages).toBe(1);
    expect(result.items).toHaveLength(2);
    expect(paginateListeningTests(tests, 5).page).toBe(1);
  });

  it('查询参数解析：空/数组/非数字回退 1，正常数字取整数', () => {
    expect(parseListeningPageParam(undefined)).toBe(1);
    expect(parseListeningPageParam('')).toBe(1);
    expect(parseListeningPageParam('abc')).toBe(1);
    expect(parseListeningPageParam(['3'])).toBe(3);
    expect(parseListeningPageParam('4')).toBe(4);
  });
});
