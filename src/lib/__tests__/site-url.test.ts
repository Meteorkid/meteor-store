import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * 架构约束测试：站点域名统一收口到 src/lib/constants.ts 的 SITE_URL。
 *
 * 这条约束此前靠「记得别改」维持，结果 sitemap、JSON-LD、邮件、CSP 等各处
 * 各自硬编码 imagentx.top，换域名时要全局搜替换、还容易漏。以后域名只允许
 * 出现在 constants.ts 一处，其他非测试源码里再出现硬编码 CI 就会红。
 */

const SRC = join(process.cwd(), 'src');
/** 域名常量的唯一定义处，豁免检查 */
const ALLOWED = join(SRC, 'lib/constants.ts');
const DOMAIN_RE = /imagentx\.top/i;

/** 收集 src 下的非测试源码文件：跳过 __tests__ 目录与 *.test.* / *.spec.* 文件 */
function collectSourceFiles(dir: string, exts: string[]): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' || entry === 'node_modules' ? [] : collectSourceFiles(full, exts);
    }
    if (/\.(test|spec)\.(ts|tsx)$/.test(entry)) return [];
    return exts.some((e) => entry.endsWith(e)) ? [full] : [];
  });
}

/** 返回文件里所有命中硬编码域名的「路径:行号: 原文」列表，便于定位 */
function findHardcodedDomain(file: string): string[] {
  return readFileSync(file, 'utf8')
    .split('\n')
    .map((line, index) => ({ line, no: index + 1 }))
    .filter(({ line }) => DOMAIN_RE.test(line))
    .map(({ line, no }) => `${file.replace(`${process.cwd()}/`, '')}:${no}: ${line.trim()}`);
}

describe('站点域名收口', () => {
  it('非测试源码中不允许出现字面量 imagentx.top（constants.ts 除外）', () => {
    // 域名只允许在 SITE_URL 的定义处出现；任何其他 src 文件出现都算回潮
    const offenders = collectSourceFiles(SRC, ['.ts', '.tsx'])
      .filter((file) => file !== ALLOWED)
      .flatMap(findHardcodedDomain);
    expect(offenders).toEqual([]);
  });

  it('constants.ts 仍包含域名，保证上面的豁免不是空转', () => {
    // 若常量被删/改名，扫描规则依然成立但钉子失去意义，这里兜底
    expect(readFileSync(ALLOWED, 'utf8')).toMatch(DOMAIN_RE);
  });
});
