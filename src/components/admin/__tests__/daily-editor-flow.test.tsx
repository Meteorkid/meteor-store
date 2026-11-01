import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailyEdition } from '@/lib/daily/types';
const hooks=vi.hoisted(()=>({states:[] as unknown[],index:0}));
vi.mock('react',async original=>({...await original<typeof import('react')>(),useState:(initial:unknown)=>{const i=hooks.index++;if(!(i in hooks.states))hooks.states[i]=typeof initial==='function'?initial():initial;return [hooks.states[i],(next:unknown)=>{hooks.states[i]=typeof next==='function'?next(hooks.states[i]):next;}];},useRef:()=>({current:null}),useEffect:vi.fn()}));
vi.mock('next-intl',()=>({useLocale:()=> 'zh'}));
import DailyManager from '../DailyManager';
const edition={id:'2026-10-31:english',date:'2026-10-31',channel:'english',status:'draft',title:'原始标题',summary:'摘要',updatedAt:'2026-10-31T00:00:00Z',content:{kind:'english',vocabulary:[{term:'test',meaning:'测试',example:'A test.',translation:'测试。'}],passage:'A local test.',questions:[{question:'What?',options:['Test','Other'],answerIndex:0,explanation:'Test.'}]}} as DailyEdition;
type Node=ReactElement<Record<string,unknown>>;let tree:Node;
function RenderDaily(){hooks.index=0;tree=DailyManager({initialDate:edition.date,initialEditions:[edition]});}
function find(predicate:(p:Record<string,unknown>)=>boolean,node:unknown=tree):Node|undefined{if(Array.isArray(node)){for(const child of node){const found=find(predicate,child ?? null);if(found)return found;}}else if(isValidElement<Record<string,unknown>>(node)){if(predicate(node.props))return node;return find(predicate,node.props.children ?? null);}}
function click(label:string){const target=find(p=>p.children===label&&typeof p.onClick==='function');expect(target).toBeDefined();(target!.props.onClick as ()=>void)();RenderDaily();}
function changeTitle(){(find(p=>p.label==='标题')!.props.onChange as (v:string)=>void)('修改后的标题');RenderDaily();}
const editor=()=>find(p=>p.tabIndex===-1&&typeof p.onSubmit==='function');
beforeEach(()=>{hooks.states=[];hooks.index=0;vi.stubGlobal('fetch',vi.fn());vi.stubGlobal('requestAnimationFrame',(callback:FrameRequestCallback)=>{callback(0);return 1;});RenderDaily();click('编辑 / 预览');});afterEach(()=>vi.unstubAllGlobals());
describe('日刊编辑未保存保护',()=>{
 it('无修改可直接返回；有修改时取消确认保留输入',()=>{click('返回列表');expect(editor()).toBeUndefined();click('编辑 / 预览');changeTitle();click('关闭编辑');expect(find(p=>p.role==='alert')).toBeDefined();click('继续编辑');expect(editor()).toBeDefined();expect(find(p=>p.label==='标题')!.props.value).toBe('修改后的标题');expect(fetch).not.toHaveBeenCalled();});
 it('明确放弃才关闭编辑',()=>{changeTitle();click('返回列表');expect(editor()).toBeDefined();click('放弃改动并继续');expect(editor()).toBeUndefined();expect(fetch).not.toHaveBeenCalled();});
 it('成功保存同步版本基线，返回时不再误报未保存',async()=>{changeTitle();vi.mocked(fetch).mockResolvedValue({ok:true,json:async()=>({edition:{...edition,title:'修改后的标题',updatedAt:'2026-11-01T00:00:00Z'}})} as Response);await (editor()!.props.onSubmit as (e:unknown)=>Promise<void>)({preventDefault:vi.fn(),nativeEvent:{submitter:{getAttribute:()=> 'save'}}});RenderDaily();const body=JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string);expect(body).toMatchObject({expectedUpdatedAt:edition.updatedAt,status:'draft'});click('返回列表');expect(editor()).toBeUndefined();expect(find(p=>p.children==='放弃改动并继续')).toBeUndefined();});
});
