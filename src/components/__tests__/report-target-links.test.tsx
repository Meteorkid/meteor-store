import { renderToStaticMarkup } from 'react-dom/server';
import type { AnchorHTMLAttributes } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const state=vi.hoisted(()=>({index:0,targetType:'comment',targetStatus:'pending'}));
vi.mock('react',async original=>({...await original<typeof import('react')>(),useState:(initial:unknown)=>{const i=state.index++;return [i===0?[{id:'R',targetType:state.targetType,targetId:'T1',targetPreview:'完整内容'+ '测试'.repeat(100),targetStatus:state.targetStatus,reason:'other',status:'pending',reporterName:'测试',createdAt:'2026-10-31T00:00:00Z'}]:i===1?false:typeof initial==='function'?initial():initial,vi.fn()];},useEffect:vi.fn()}));
vi.mock('next-intl',()=>({useTranslations:()=> (k:string)=>k}));vi.mock('@/i18n/navigation',()=>({Link:(p:AnchorHTMLAttributes<HTMLAnchorElement>)=><a {...p}/> }));
import ReportModeration from '../ReportModeration';
beforeEach(()=>{state.index=0;state.targetType='comment';state.targetStatus='pending';});
describe('举报目标的真实详情入口',()=>{
 it('评论可展开全文，并直接定位管理列表中的评论',()=>{const html=renderToStaticMarkup(<ReportModeration/>);expect(html).toContain('<details');expect(html).toContain('href="/admin/comments#comment-T1"');expect(html).not.toContain('href="#"');});
 it('已下架文章进入受保护编辑器，公开文章仍进入详情',()=>{state.targetType='post';const draft=renderToStaticMarkup(<ReportModeration/>);expect(draft).toContain('href="/blog/submit?id=T1&amp;admin=1"');state.index=0;state.targetStatus='published';expect(renderToStaticMarkup(<ReportModeration/>)).toContain('href="/blog/p/T1"');});
});
