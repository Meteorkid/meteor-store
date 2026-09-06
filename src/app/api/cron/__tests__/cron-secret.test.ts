import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 全部 cron 接口只认一个密钥变量：`PATHFINDER_CRON_SECRET`。
 *
 * 这条测试补的是一次真实故障：`/api/cron/pass-expiry` 读的是它独有的
 * `PASS_EXPIRY_CRON_SECRET`，而那个变量**从来没配到服务器的 .env.production 上**。
 * 于是 Pass 到期提醒从 2026-08-07 上线起一封都没发出去——接口对任何调用都返回 401。
 *
 * 最阴的是它自己的单测一直是绿的：测试在 `beforeEach` 里设置路由读的那个变量，
 * 路由读什么它就设什么，**名字取错也永远测得通**。单测能证明鉴权逻辑是对的，
 * 证明不了这个变量在生产环境存在。
 *
 * 所以这里换个角度钉：不验证「值对不对」（CI 里本来就没有生产密钥），
 * 而是验证「所有 cron 路由用的是同一个、已知在线上配好的变量名」。
 * 新加的 cron 路由自创一个密钥变量时，CI 会红——那正是漏配的高发时刻。
 */
const CRON_DIR = path.join(__dirname, '..');
const SHARED_SECRET = 'PATHFINDER_CRON_SECRET';

function cronRouteFiles(): { name: string; source: string }[] {
  return readdirSync(CRON_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== '__tests__')
    .map((entry) => ({
      name: entry.name,
      source: readFileSync(path.join(CRON_DIR, entry.name, 'route.ts'), 'utf-8'),
    }));
}

describe('cron 接口的密钥变量', () => {
  it('存在待检查的 cron 路由', () => {
    // 目录结构变了（改名/搬走）时别让上面几条静默变成空断言
    expect(cronRouteFiles().length).toBeGreaterThan(0);
  });

  it('只使用共用的 PATHFINDER_CRON_SECRET', () => {
    const offenders: string[] = [];

    for (const { name, source } of cronRouteFiles()) {
      for (const match of source.matchAll(/process\.env\.([A-Z0-9_]*CRON_SECRET)/g)) {
        if (match[1] !== SHARED_SECRET) {
          offenders.push(`${name}: process.env.${match[1]}`);
        }
      }
    }

    expect(
      offenders,
      `以下 cron 路由自创了密钥变量，它多半没配到线上（历史教训见本文件注释）：\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  it('每个 cron 路由都真的读了密钥', () => {
    const unguarded = cronRouteFiles()
      .filter(({ source }) => !source.includes(`process.env.${SHARED_SECRET}`))
      .map(({ name }) => name);

    expect(unguarded, `以下 cron 路由没有做密钥鉴权：\n${unguarded.join('\n')}`).toEqual([]);
  });
});
