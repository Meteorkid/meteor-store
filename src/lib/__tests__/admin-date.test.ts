import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatAdminDate, formatAdminTimestamp } from '../admin-date';
afterEach(()=>vi.unstubAllEnvs());
describe('后台时间的服务端/手机一致性',()=>{
 it.each(['zh','en'])('机器时区不同也输出相同的北京时间，%s',locale=>{const value='2026-10-31T16:30:00Z';vi.stubEnv('TZ','America/Los_Angeles');const server=formatAdminTimestamp(value,locale);vi.stubEnv('TZ','Asia/Shanghai');expect(formatAdminTimestamp(value,locale)).toBe(server);expect(server).toContain('00:30:00');});
 it('跨午夜的日期按北京时间显示，异常值不会让整个列表崩溃',()=>{expect(formatAdminDate('2026-10-31T16:30:00Z','zh')).toBe('2026/11/01');expect(formatAdminTimestamp('invalid','en')).toBe('invalid');});
});
