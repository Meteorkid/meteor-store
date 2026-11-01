import { beforeEach, describe, expect, it, vi } from 'vitest';
const hooks = vi.hoisted(() => ({ refs: [] as Array<{current: unknown}>, index: 0, deps: null as readonly unknown[] | null, effect: undefined as (() => void) | undefined }));
vi.mock('react', () => ({
  useRef: (value: unknown) => hooks.refs[hooks.index++] ??= {current:value},
  useEffect: (effect: () => void, deps: readonly unknown[]) => { if (!hooks.deps || deps.some((d,i)=>d!==hooks.deps![i])) hooks.effect=effect; hooks.deps=deps; },
}));
import { useAdminEditorFocus } from '../useAdminEditorFocus';
const editor={scrollIntoView:vi.fn(),focus:vi.fn()},list={scrollIntoView:vi.fn(),focus:vi.fn()};
function RenderFocus(open: boolean,id?:string) { hooks.index=0;const refs=useAdminEditorFocus<HTMLDivElement>(open,id);refs.editorRef.current=editor as unknown as HTMLFormElement;refs.listRef.current=list as unknown as HTMLDivElement;const effect=hooks.effect;hooks.effect=undefined;effect?.(); }
beforeEach(()=>{vi.clearAllMocks();hooks.refs=[];hooks.deps=null;hooks.effect=undefined;});
describe('管理长表单焦点交接',()=>{
 it('首次列表渲染不抢焦点，打开编辑才定位表单并避免弹出输入键盘',()=>{RenderFocus(false);expect(list.focus).not.toHaveBeenCalled();RenderFocus(true,'A');expect(editor.scrollIntoView).toHaveBeenCalledWith({block:'start',behavior:'instant'});expect(editor.focus).toHaveBeenCalledWith({preventScroll:true});});
 it('同一记录输入时不重新定位，切换记录才重新定位',()=>{RenderFocus(true,'A');vi.clearAllMocks();RenderFocus(true,'A');expect(editor.focus).not.toHaveBeenCalled();RenderFocus(true,'B');expect(editor.focus).toHaveBeenCalledOnce();});
 it('关闭编辑回到列表，而不是停在已消失的表单位置',()=>{RenderFocus(true,'A');RenderFocus(false);expect(list.scrollIntoView).toHaveBeenCalledOnce();expect(list.focus).toHaveBeenCalledWith({preventScroll:true});});
});
