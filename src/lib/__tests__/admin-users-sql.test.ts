import { describe, expect, it } from 'vitest';

/**
 * 账号列表的生成 SQL 必须带表限定名。
 *
 * 这条测试补的是一次真实缺陷：`listSelection` 里的 6 个相关子查询原本写成
 * `${users.id}` / `${users.email}`，而 drizzle 在**单表查询**中会把 SELECT 列表内
 * `sql` 片段里的 Column 改写成裸列名（`"id"`）。子查询的每张表都有自己的 `id`，
 * Postgres 按内层优先解析，于是
 *   - `p.author_id = "id"` → `p.author_id = p.id` → 恒为 0
 *   - `o.email = "email"` → `o.email = o.email` → 恒真，把「这个人的订单」变成「全站订单」
 * 语句合法、tsc 通过、测试全绿，只有数字是假的。
 *
 * 同样的写法放进 WHERE 反而是对的（drizzle 只改写 SELECT 列表），
 * 所以肉眼审查极难分辨，只能对着真实生成的 SQL 断言。
 */
describe('账号列表的生成 SQL', () => {
  // toSQL() 不发起连接，但 db 是惰性 Proxy，仍要求这个变量存在
  process.env.DATABASE_URL ??= 'postgresql://user:pass@localhost/placeholder';

  async function listSql(): Promise<string> {
    const { adminUserListQuery } = await import('../admin-users');
    return adminUserListQuery().toSQL().sql;
  }

  it('相关子查询引用外层表时带 "users" 限定名', async () => {
    const generated = await listSql();
    expect(generated).toContain('"users"."id"');
    expect(generated).toContain('"users"."email"');
  });

  it('子查询里不出现裸的外层列引用', async () => {
    const generated = await listSql();
    // `= "id"` / `= "email"` 就是被 drizzle 剥掉限定名的形态
    expect(generated, '外层列引用丢了表限定，统计数字会静默算错').not.toMatch(/=\s*"id"/);
    expect(generated, '外层列引用丢了表限定，统计数字会静默算错').not.toMatch(/=\s*"email"/);
    expect(generated).not.toMatch(/=\s*"token_version"/);
  });

  it('六项统计都在 SELECT 列表里', async () => {
    const generated = await listSql();
    for (const table of [
      'from orders o',
      'from posts p',
      'from comments c',
      'from invite_redemptions r',
      'from personal_access_tokens t',
    ]) {
      expect(generated).toContain(table);
    }
  });
});
