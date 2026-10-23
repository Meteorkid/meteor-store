import { beforeEach, describe, expect, it, vi } from 'vitest';
const auth=vi.hoisted(()=>({getSession:vi.fn(), getUserEntitlements:vi.fn()}));
vi.mock('@/lib/auth',()=>({getSession:auth.getSession}));
vi.mock('@/lib/entitlements',()=>({getUserEntitlements:auth.getUserEntitlements}));
import { GET } from '../route';
beforeEach(()=>{auth.getSession.mockReset().mockResolvedValue({userId:'a',email:'a@example.test'});auth.getUserEntitlements.mockReset().mockResolvedValue([{productId:'xnook'}]);});
describe('私人授权读取',()=>{
 it('成功响应带owner和no-store',async()=>{const r=await GET();expect(r.status).toBe(200);expect(r.headers.get('cache-control')).toBe('no-store');expect(await r.json()).toEqual({userId:'a',entitlements:[{productId:'xnook'}]});});
 it('游客401也不缓存且不查询授权',async()=>{auth.getSession.mockResolvedValue(null);const r=await GET();expect(r.status).toBe(401);expect(r.headers.get('cache-control')).toBe('no-store');expect(auth.getUserEntitlements).not.toHaveBeenCalled();});
 it('查询失败返回503，不伪造空列表或泄漏内部错误',async()=>{auth.getUserEntitlements.mockRejectedValue(new Error('private fixture details'));const r=await GET();expect(r.status).toBe(503);expect(r.headers.get('cache-control')).toBe('no-store');expect(await r.json()).toEqual({error:'Entitlements unavailable'});});
});
