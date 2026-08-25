import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * drizzle `sql` 模板里的插值不能套引号。
 *
 * 这条测试补的是一次真实故障：后台首页统计写成
 * `sql\`… where ${orders.productId} = '${PASS_PRODUCT_ID}' …\``，
 * 外面那对引号让生成的 SQL 变成字符串字面量 `'$1'`，语句实际零参数却仍绑了 4 个，
 * Postgres 报「bind message supplies 4 parameters, but prepared statement requires 0」，
 * **整个 /admin 首页 500**。
 *
 * 这类错误的隐蔽之处在于：同一段模板里 `= 'published'` 这种写死的字面量带引号是对的，
 * 只有带 `${}` 的插值不能带——两者长得几乎一样，肉眼极易看混。
 * 类型检查和构建都发现不了，只有真正连上数据库执行才会炸。
 */
const srcDir = path.join(__dirname, '..', '..');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (entry === 'node_modules' || entry.startsWith('.')) return [];
    if (statSync(full).isDirectory()) return walk(full);
    return /\.tsx?$/.test(entry) ? [full] : [];
  });
}

describe('drizzle sql 模板的插值', () => {
  it('插值外面不能套单引号', () => {
    const offenders: string[] = [];

    for (const file of walk(srcDir)) {
      const source = readFileSync(file, 'utf-8');
      if (!source.includes('sql`') && !source.includes('sql<')) continue;

      source.split('\n').forEach((line, index) => {
        // 只看确实在 sql 模板里的行，避免误伤普通字符串
        if (!/sql[<`]/.test(line)) return;
        // 注释行是在讲这个坑本身，不算违规
        if (/^\s*\*|^\s*\/\//.test(line)) return;
        if (/'\$\{/.test(line) || /\}'/.test(line.replace(/\$\{[^}]*\}'/g, (m) => m))) {
          if (/'\$\{[^}]*\}'/.test(line)) {
            offenders.push(`${path.relative(srcDir, file)}:${index + 1}`);
          }
        }
      });
    }

    expect(offenders, `以下位置把 sql 插值套进了引号，会让参数绑定失效：\n${offenders.join('\n')}`)
      .toEqual([]);
  });
});
