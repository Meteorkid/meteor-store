import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * 架构约束测试：所有写接口都必须限流。
 *
 * 这条约束此前只靠「记得加」来维持，结果 login / register 长期完全没有限流——
 * 恰好是全站计算最贵的两个端点。与其做一层路由包装把限流变成默认（要重构 12 个
 * 形态各异的路由，风险不小），不如把约束直接写成测试：新加的写接口忘了限流，
 * CI 就会红。成本几乎为零，防的是同一类问题。
 */

const API_ROOT = join(process.cwd(), 'src/app/api');

/** 明确豁免的路由，加入时必须写清楚理由 */
const EXEMPT: Record<string, string> = {
  'auth/logout/route.ts': '只清除 cookie，无计算成本也无滥用价值',
  'payment/alipay/notify/route.ts': '支付宝带验签的回调，限流会误伤其失败重试',
};

/** 需要跨入口共用同一限流 key 的少数路由；测试同时钉住路由调用和 guard 内的真实 rateLimit。 */
const SHARED_GUARDS: Record<string, { call: RegExp; file: string }> = {
  'blog/upload-image/route.ts': {
    call: /checkBlogImageUploadRateLimit\(/,
    file: join(process.cwd(), 'src/lib/blog-image-upload-guard.ts'),
  },
};

function findRouteFiles(dir: string, base = ''): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      return entry === '__tests__' ? [] : findRouteFiles(full, rel);
    }
    return entry === 'route.ts' ? [rel] : [];
  });
}

const routeFiles = findRouteFiles(API_ROOT);

describe('API 路由的限流覆盖', () => {
  it('能扫描到路由文件（防止扫描逻辑本身失效导致测试空跑）', () => {
    expect(routeFiles.length).toBeGreaterThan(5);
  });

  it.each(routeFiles)('%s', (rel) => {
    const source = readFileSync(join(API_ROOT, rel), 'utf-8');
    const hasWrite = /export async function (POST|PUT|PATCH|DELETE)/.test(source);
    if (!hasWrite) return;

    if (rel in EXEMPT) {
      // 豁免项也要保持豁免理由与实现一致：别默默加了限流却还挂在豁免名单里
      expect(source, `${rel} 已豁免（${EXEMPT[rel]}），但它现在调用了 rateLimit，请从豁免名单移除`)
        .not.toMatch(/rateLimit\(/);
      return;
    }

    const sharedGuard = SHARED_GUARDS[rel];
    if (sharedGuard) {
      expect(source, `${rel} 必须调用批准的共享限流 guard`).toMatch(sharedGuard.call);
      expect(
        readFileSync(sharedGuard.file, 'utf-8'),
        `${rel} 的共享限流 guard 内没有调用 rateLimit()`,
      ).toMatch(/rateLimit\(/);
      return;
    }

    expect(
      source,
      `${rel} 是写接口但没有调用 rateLimit()。请加上限流，或在本测试的 EXEMPT 里写明豁免理由。`,
    ).toMatch(/rateLimit\(/);
  });
});
