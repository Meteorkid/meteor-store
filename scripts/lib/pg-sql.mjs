import pg from 'pg';

/**
 * 把 `@neondatabase/serverless` 的 `neon()` 换成 node-postgres，**保持同样的调用形状**。
 *
 * 2026-09-02 数据库从 Neon 迁到同机自建 PostgreSQL 18 之后，运维脚本原来的
 * `neon()` 驱动走 HTTP、只能连 Neon，连不上新库。脚本里两种用法都要照顾：
 *
 *   await sql`select * from users where id = ${id}`   // 标签模板，值自动参数化
 *   await sql.query('select * from users where id = $1', [id])
 *
 * 两者都返回 rows 数组，与 neon 的默认行为一致，所以脚本正文一行都不用动，
 * 只需把 `neon(url)` 换成 `createSql(url)`。
 *
 * **`allowExitOnIdle: true` 不能去掉**：neon 走 HTTP 没有常驻连接，脚本跑完就退出；
 * 而 pg.Pool 会持有空闲连接把 Node 的事件循环一直吊着，脚本执行完却不退出，
 * 在 cron 里就是一个永远不结束的任务。加上它，池空闲时自动放行进程退出。
 */
export function createSql(connectionString) {
  if (!connectionString) {
    throw new Error('createSql: 缺少数据库连接串');
  }

  const pool = new pg.Pool({
    connectionString,
    max: 4,
    allowExitOnIdle: true,
    connectionTimeoutMillis: 10_000,
  });

  // 空闲连接被服务端切断时 pg 会在池上抛错，不监听就是未捕获异常
  pool.on('error', (err) => {
    console.error('数据库连接池错误：', err.message);
  });

  const run = async (text, params = []) => (await pool.query(text, params)).rows;

  const sql = (strings, ...values) => {
    // 标签模板：把插值位置换成 $1/$2…，值走参数化，不做字符串拼接
    const text = strings.reduce(
      (acc, part, i) => acc + part + (i < values.length ? `$${i + 1}` : ''),
      '',
    );
    return run(text, values);
  };

  sql.query = run;
  /** 需要立刻结束进程时可显式调用；常规情况下靠 allowExitOnIdle 自然退出 */
  sql.end = () => pool.end();

  return sql;
}
