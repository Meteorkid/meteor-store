import { renderToStaticMarkup } from 'react-dom/server';
import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
vi.mock('next-intl/server',()=>({getTranslations:async()=> (k:string)=>k,setRequestLocale:vi.fn()}));
vi.mock('@/i18n/navigation',()=>({Link:(props:AnchorHTMLAttributes<HTMLAnchorElement>)=><a {...props}/> }));
vi.mock('@/lib/admin-session',()=>({getAdminPageSession:async()=>({userId:'admin'})}));
vi.mock('@/lib/admin',()=>({isAdminSession:()=>true}));
vi.mock('@/lib/reports',()=>({countPendingReports:async()=>new Map()}));
vi.mock('@/lib/admin-stats',()=>({getAllPosts:async()=>['pending','published'].map((status,i)=>({id:'P'+i,title:'Title '+i,source:'database',author:'Member',section:'product-updates',status,publishedAt:null,createdAt:'2026-10-31T00:00:00Z',href:'/blog/p/P'+i}))}));
import Page from '../page';
describe('手机文章记录与编辑入口',()=>{
 it('每项字段保留标签，窄屏卡片仍保留表格语义',async()=>{const html=renderToStaticMarkup(await Page({params:Promise.resolve({locale:'zh'})}));expect(html).toContain('role="table"');expect([...html.matchAll(/data-label=/g)]).toHaveLength(16);expect(html).toContain('data-label="tableActions"');});
 it('未发布标题进入受保护编辑器，编辑链接保持当前标签页',async()=>{const html=renderToStaticMarkup(await Page({params:Promise.resolve({locale:'zh'})}));expect(html).toMatch(/href="\/blog\/submit\?id=P0&amp;admin=1"[^>]*>Title 0/);expect(html).toContain('href="/blog/p/P1"');expect(html).not.toContain('target="_blank"');expect(html).toContain('data-admin-action="true"');});
});
