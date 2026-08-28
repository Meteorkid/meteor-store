import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.join(__dirname, '..', '..');
const badge = readFileSync(path.join(root, 'components', 'AdminPendingBadge.tsx'), 'utf-8');
const api = readFileSync(path.join(root, 'app', 'api', 'admin', 'pending', 'route.ts'), 'utf-8');
const cron = readFileSync(path.join(root, 'app', 'api', 'cron', 'admin-digest', 'route.ts'), 'utf-8');
const email = readFileSync(path.join(root, 'lib', 'email.ts'), 'utf-8');

describe('站内角标', () => {
  it('用模块级 store，两个 Header 实例共享一次请求', () => {
    /*
     * Header 桌面版与移动版各渲染一个 UserMenu。各自 fetch 会打两次接口，
     * 而且两个角标可能显示不同的数——公告铃铛当初就踩过这个。
     */
    expect(badge).toContain('useSyncExternalStore');
    expect(badge).toMatch(/let inflight/);
    expect(badge).toContain('if (inflight) return inflight');
  });

  it('拉取失败当作 0 且不重试', () => {
    // 角标是辅助信息，静默失败远好过在每个页面反复打一个会失败的接口
    expect(badge).toMatch(/\.catch\(/);
    expect(badge).toMatch(/total: 0/);
  });

  it('计数接口对非管理员返回 404 而不是 403', () => {
    // 与后台页面一致：403 等于告诉对方「这里确实有个管理接口」
    expect(api).toContain('isAdminSession');
    expect(api).toMatch(/status: 404/);
    expect(api).not.toMatch(/status: 403/);
  });

  it('计数接口不可被缓存', () => {
    // 线上是 nginx 反代，对 /api/* 做统一缓存很常见；缓存住会让不同管理员看到同一份数
    expect(api).toContain("'Cache-Control': 'no-store'");
  });
});

describe('离站邮件提醒', () => {
  it('没有待办就不发信', () => {
    /*
     * 一个每天准时到达、内容永远是「0 项待处理」的提醒，很快会被规则过滤掉，
     * 真有事的那天也一起被过滤了。
     */
    expect(cron).toMatch(/if \(total === 0\) return/);
    expect(email).toMatch(/data\.total <= 0\) return/);
  });

  it('鉴权用常数时间比较，且限流 fail-closed', () => {
    expect(cron).toContain('timingSafeEqual');
    expect(cron).toContain('failClosed: true');
  });

  it('复用已有的 cron 密钥，不新增一个要轮换的东西', () => {
    expect(cron).toContain('PATHFINDER_CRON_SECRET');
  });

  it('收件人来自 ADMIN_EMAILS，未配置时不发', () => {
    expect(cron).toContain('getAdminEmails()');
    expect(cron).toMatch(/recipients\.length === 0/);
  });
});
