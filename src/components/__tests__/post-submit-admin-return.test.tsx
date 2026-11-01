import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserPost } from '@/lib/posts';
const mocks=vi.hoisted(()=>({push:vi.fn()}));
vi.mock('react',async original=>({...await original<typeof import('react')>(),useState:(v:unknown)=>[v,vi.fn()],useRef:()=>({current:null})}));
vi.mock('@/i18n/navigation',()=>({useRouter:()=>({push:mocks.push}),Link:()=>null}));
vi.mock('next-intl',()=>({useLocale:()=> 'zh',useTranslations:()=>Object.assign((k:string)=>k,{rich:()=>null})}));
import PostSubmitForm from '../PostSubmitForm';
const post={id:'post-a',title:'测试文章标题',excerpt:'用于验证后台编辑之后返回正确列表的摘要',content:'测试正文。'.repeat(80),sectionId:'product-updates',tags:[],sections:[],status:'published'} as unknown as UserPost;
function button(node:unknown,label:string):ReactElement<Record<string,unknown>>|undefined {if(Array.isArray(node)){for(const child of node){const found=button(child,label);if(found)return found;}}else if(isValidElement<Record<string,unknown>>(node)){if(node.type==='button'&&node.props.children===label)return node;return button(node.props.children,label);}}
beforeEach(()=>{vi.clearAllMocks();vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({success:true})}));});afterEach(()=>vi.unstubAllGlobals());
describe('后台文章编辑语义和返回',()=>{
 it.each([true,false])('成功保存返回对应列表，adminEditing=%s',async adminEditing=>{const tree=PostSubmitForm({initialPost:post,adminEditing,renderPreview:async()=>''});tree.props.onSubmit({preventDefault:vi.fn()});await vi.waitFor(()=>expect(mocks.push).toHaveBeenCalledWith(adminEditing?'/admin/posts':'/blog/my-posts'));const body=JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);expect(body).not.toHaveProperty('asAdmin');});
 it('已发布后台文章显示保存修改且不提供会误导的保存草稿',()=>{const tree=PostSubmitForm({initialPost:post,adminEditing:true,renderPreview:async()=>''});expect(button(tree,'saveChanges')).toBeDefined();expect(button(tree,'saveDraft')).toBeUndefined();});
 it('草稿后台文章明确提示保存并发布，同时保留保存草稿',()=>{const tree=PostSubmitForm({initialPost:{...post,status:'draft'},adminEditing:true,renderPreview:async()=>''});expect(button(tree,'saveAndPublish')).toBeDefined();expect(button(tree,'saveDraft')).toBeDefined();});
 it('失败时保留表单，不跳到成功列表',async()=>{vi.mocked(fetch).mockResolvedValue({ok:false,json:async()=>({error:'failed'})} as Response);const tree=PostSubmitForm({initialPost:post,adminEditing:true,renderPreview:async()=>''});tree.props.onSubmit({preventDefault:vi.fn()});await Promise.resolve();await Promise.resolve();expect(mocks.push).not.toHaveBeenCalled();});
});
