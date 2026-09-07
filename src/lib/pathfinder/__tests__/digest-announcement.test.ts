import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 幂等和密钥这两件事都发生在数据库与运行时，单测没有真 Postgres，
 * 所以这里对着源码与 schema 钉不变量——与 posts-feed-sql.test.ts 同类做法。
 */
const read = (...segments: string[]) => readFileSync(path.join(__dirname, '..', '..', '..', ...segments), 'utf-8');

describe('日报通知', () => {
  it('幂等由唯一索引保证，不是先查后写', () => {
    /*
     * cron 补跑、重试、手动触发都必须落在同一行上，否则铃铛里会出现
     * 两条一模一样的通知。「先查后写」在并发下挡不住，所以用
     * announcements.source_key 的唯一索引 + onConflictDoNothing。
     */
    const schema = read('lib', 'db', 'schema.ts');
    expect(schema).toContain("uniqueIndex('announcements_source_key_idx')");

    const lib = read('lib', 'pathfinder', 'digest-announcement.ts');
    expect(lib).toContain('onConflictDoNothing');
    expect(lib).toContain('sourceKey');
  });

  it('幂等键用那一期自己的发布日，不是运行当天', () => {
    /*
     * 上游偶尔断更（实测 36 天出 30 期）。用运行当天做键的话，断更那天会把
     * 昨天那期当成新的再发一遍；用那一期自己的发布日就天然只发一次。
     */
    const lib = read('lib', 'pathfinder', 'digest-announcement.ts');
    expect(lib).toContain('digest.publishedAt ?? digest.discoveredAt');
    expect(lib).not.toMatch(/sourceKey = .*new Date\(\)/);
  });

  it('通知正文自带摘要，不只给一个链接', () => {
    // 铃铛面板里读完就走是常态；不点也该知道今天发生了什么
    const lib = read('lib', 'pathfinder', 'digest-announcement.ts');
    expect(lib).toContain('summaryZh');
    expect(lib).toContain('BODY_SUMMARY_LIMIT');
  });

  it('铃铛只把本站链接变成可点的', () => {
    /*
     * 公告目前只有管理员和定时任务能写，但把任意外链变成可点是另一回事：
     * 将来若开放更多写入路径，这里就是钓鱼链接的入口。
     */
    const bell = read('components', 'NotificationBell.tsx');
    expect(bell).toContain('siteOrigin');
    expect(bell).toContain('isInternal');
    // 用 React 元素拼接，不能退回 innerHTML。匹配 JSX 属性写法而不是裸词，
    // 否则会命中注释里「而不是 dangerouslySetInnerHTML」那句自己
    expect(bell).not.toContain('dangerouslySetInnerHTML=');
  });

  it('cron 路由与其它定时任务共用同一个密钥', () => {
    // 再拆一个密钥只会多一个要轮换的东西；cron-secret.test.ts 也钉着这条
    const route = read('app', 'api', 'cron', 'pathfinder-digest', 'route.ts');
    expect(route).toContain('PATHFINDER_CRON_SECRET');
    expect(route).toContain('timingSafeEqual');
    expect(route).toContain('rateLimit');
  });
});

describe('读不到目录与上游没出稿要分开报', () => {
  it('目录降级时返回 catalog-unavailable，不是 no-digest', () => {
    /*
     * listCatalogItems 在数据库不可用时会静默降级成仓库内的静态种子，
     * 而种子里没有日报——两种情况都表现为「找不到日报」。这个任务一天
     * 只跑一次，混为一谈的话，某天撞上数据库短暂不可用就会静默跳过当天
     * 通知、日志还显示成功。实测撞到过一次：部署刚重启、目录缓存冷时的
     * 第一次调用就返回了 no-digest。
     */
    const lib = read('lib', 'pathfinder', 'digest-announcement.ts');
    expect(lib).toContain("status: 'catalog-unavailable'");
    // 判据是「有没有数据库来源的条目」，不是「目录空不空」
    expect(lib).toContain("item.origin === 'database'");
  });

  it('cron 路由把读不到目录报成失败，让包装脚本非零退出', () => {
    // 报成功的话，静默跳过当天通知就没人会发现
    const route = read('app', 'api', 'cron', 'pathfinder-digest', 'route.ts');
    expect(route).toContain('catalog-unavailable');
    expect(route).toContain('503');
    expect(route).toContain('success: false');
  });
});

