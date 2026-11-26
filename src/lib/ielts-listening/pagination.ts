/**
 * 题库列表的分页：每套题 4 个 Part，每页 8 套（最多 32 张课时卡片）。
 * 纯函数，方便在单测里用合成的套题数组验证越界归一与切片。
 */

export const LISTENING_TESTS_PER_PAGE = 8;

export interface ListeningPagination<T> {
  /** 当前页的条目（已切片）。 */
  items: T[];
  /** 归一后的当前页码（1 起）。 */
  page: number;
  /** 总页数；没有条目时至少 1 页。 */
  totalPages: number;
}

/** 解析并归一页码：非整数按第 1 页；小于 1 取 1；超出末页取末页。 */
export function paginateListeningTests<T>(
  tests: T[],
  requestedPage: number,
  pageSize: number = LISTENING_TESTS_PER_PAGE,
): ListeningPagination<T> {
  const totalPages = Math.max(1, Math.ceil(tests.length / pageSize));
  const page = Number.isInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const start = (page - 1) * pageSize;
  return { items: tests.slice(start, start + pageSize), page, totalPages };
}

/** 把 ?page= 查询参数解析成整数；非法（空、非数字、小数）回退到 1。 */
export function parseListeningPageParam(raw: string | string[] | undefined): number {
  const text = Array.isArray(raw) ? raw[0] : raw;
  const value = Number.parseInt(String(text ?? ''), 10);
  return Number.isInteger(value) ? value : 1;
}
