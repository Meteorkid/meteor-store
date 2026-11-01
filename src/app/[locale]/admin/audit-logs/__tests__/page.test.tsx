import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
vi.mock('next-intl/server',()=>({getTranslations:async()=> (k:string)=>k,setRequestLocale:vi.fn()}));
vi.mock('@/lib/admin-session',()=>({getAdminPageSession:async()=>({userId:'admin'})}));
vi.mock('@/lib/admin',()=>({isAdminSession:()=>true}));
vi.mock('@/lib/admin-audit',()=>({AUDIT_LOG_PAGE_SIZE:50,listAdminAuditLogs:async()=>[{id:'A',adminEmail:'a@example.test',action:'test.action',targetType:'post',targetId:'P',detail:{text:'x'.repeat(300)+'尾部完整可读'},ip:'203.0.113.1',createdAt:'2026-10-31T00:00:00Z'}]}));
import Page from '../page';
it('审计详情可显式展开全文，手机行字段都有标签',async()=>{const html=renderToStaticMarkup(await Page({params:Promise.resolve({locale:'zh'})}));expect(html).toContain('<details>');expect(html).toContain('viewDetail');expect(html).toContain('尾部完整可读');expect([...html.matchAll(/data-label=/g)]).toHaveLength(6);});
