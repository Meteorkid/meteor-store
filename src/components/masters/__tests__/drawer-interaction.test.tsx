import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({
  refs: [] as Array<{ current: unknown }>, refIndex: 0, effectIndex: 0,
  effects: [] as Array<{ deps?: unknown[]; cleanup?: () => void }>,
  pending: new Map<number, () => void | (() => void)>(),
}));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useId: () => 'drawer-title-test',
  useRef: (initial: unknown) => hooks.refs[hooks.refIndex++] ??= { current: initial },
  useEffect: (effect: () => void | (() => void), deps?: unknown[]) => {
    const index = hooks.effectIndex++;
    const previous = hooks.effects[index];
    if (!previous || !deps || deps.some((value, i) => !Object.is(value, previous.deps?.[i]))) {
      previous?.cleanup?.();
      hooks.effects[index] = { deps };
      hooks.pending.set(index, effect);
    }
  },
}));
vi.mock('react-dom', async original => ({
  ...await original<typeof import('react-dom')>(),
  flushSync: (callback: () => void) => callback(),
}));

import MastersRoundDrawer from '../MastersRoundDrawer';

type ElementNode = ReactElement<Record<string, unknown>>;
class FocusTarget {
  isConnected = true;
  visible = true;
  guarded = false;
  focus = vi.fn();
  getClientRects = () => this.visible ? [{}] : [];
  hasAttribute = (name: string) => name === 'data-drawer-focus-guard' && this.guarded;
}
class InlineStyle {
  declarations = new Map<string, [string, string]>();
  getPropertyValue = (name: string) => this.declarations.get(name)?.[0] ?? '';
  getPropertyPriority = (name: string) => this.declarations.get(name)?.[1] ?? '';
  setProperty = (name: string, value: string, priority = '') => { this.declarations.set(name, [value, priority]); };
  removeProperty = (name: string) => { this.declarations.delete(name); };
}
let tree: ElementNode;
let trigger: FocusTarget;
let fallback: FocusTarget;
let closeButton: FocusTarget;
let lastField: FocusTarget;
let content: { scrollTop: number };
let bodyStyle: InlineStyle;
let browserWindow: EventTarget & { scrollTo: ReturnType<typeof vi.fn> };
let dialog: { open: boolean; showModal: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn>; querySelectorAll: () => FocusTarget[] };
let onClose = vi.fn<() => void>();
let currentOpen: boolean;

function nodes(predicate: (props: Record<string, unknown>) => boolean, node: unknown = tree): ElementNode[] {
  if (Array.isArray(node)) return node.flatMap(child => nodes(predicate, child ?? null));
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [...(predicate(node.props) ? [node] : []), ...nodes(predicate, node.props.children ?? null)];
}
function render(open = currentOpen) {
  currentOpen = open;
  hooks.refIndex = hooks.effectIndex = 0;
  tree = MastersRoundDrawer({ open, title: '申请详情', closeLabel: '关闭详情', onClose,
    trigger: trigger as unknown as HTMLElement, children: '详情内容' });
  (tree.props.ref as { current: unknown }).current = dialog;
  (nodes(props => props.children === '详情内容')[0].props.ref as { current: unknown }).current = content;
  (nodes(props => props['aria-label'] === '关闭详情')[0].props.ref as { current: unknown }).current = closeButton;
  for (const [index, effect] of hooks.pending) hooks.effects[index].cleanup = effect() || undefined;
  hooks.pending.clear();
}
function event(name: string, value: unknown) { (tree.props[name] as (event: unknown) => void)(value); }

beforeEach(() => {
  hooks.refs = []; hooks.effects = []; hooks.pending.clear();
  trigger = new FocusTarget(); fallback = new FocusTarget(); closeButton = new FocusTarget(); lastField = new FocusTarget();
  content = { scrollTop: 77 };
  bodyStyle = new InlineStyle();
  bodyStyle.setProperty('overflow', 'auto', 'important');
  bodyStyle.setProperty('padding-right', '12px');
  bodyStyle.setProperty('color', 'red');
  vi.stubGlobal('HTMLElement', FocusTarget);
  vi.stubGlobal('document', { activeElement: trigger, body: { style: bodyStyle },
    documentElement: { clientWidth: 980 }, querySelector: vi.fn(() => fallback) });
  browserWindow = Object.assign(new EventTarget(), { scrollX: 4, scrollY: 760, innerWidth: 1000,
    getComputedStyle: () => ({ paddingRight: '12px' }), scrollTo: vi.fn() });
  vi.stubGlobal('window', browserWindow);
  dialog = { open: false, showModal: vi.fn(() => { dialog.open = true; }), close: vi.fn(() => { dialog.open = false; }),
    querySelectorAll: () => [closeButton, lastField] };
  onClose = vi.fn(() => render(false));
  render(false);
});
afterEach(() => {
  hooks.effects.forEach(effect => effect.cleanup?.());
  vi.unstubAllGlobals();
});

describe('申请详情抽屉的焦点与滚动交接', () => {
  it('仅打开时进入原生模态，关闭恢复原样式、优先级与滚动位置', () => {
    expect(dialog.showModal).not.toHaveBeenCalled();
    render(true);
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
    expect(bodyStyle.getPropertyValue('position')).toBe('fixed');
    expect(bodyStyle.getPropertyValue('top')).toBe('-760px');
    expect(bodyStyle.getPropertyValue('padding-right')).toBe('32px');
    expect(closeButton.focus).toHaveBeenCalledWith({ preventScroll: true });
    render(false);
    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(bodyStyle.getPropertyValue('position')).toBe('');
    expect(bodyStyle.getPropertyValue('overflow')).toBe('auto');
    expect(bodyStyle.getPropertyPriority('overflow')).toBe('important');
    expect(bodyStyle.getPropertyValue('padding-right')).toBe('12px');
    expect(bodyStyle.getPropertyValue('color')).toBe('red');
    expect(browserWindow.scrollTo).toHaveBeenCalledWith({ left: 4, top: 760, behavior: 'instant' });
    expect(trigger.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('内容更新不重开dialog或覆盖原滚动快照', () => {
    render(true); content.scrollTop = 77; render(true);
    expect(content.scrollTop).toBe(77);
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
    expect(dialog.close).not.toHaveBeenCalled();
    render(false);
    expect(browserWindow.scrollTo).toHaveBeenCalledTimes(1);
  });

  it('每次打开或更换触发轮次从详情顶部开始，不沿用上一轮内部滚动', () => {
    render(true);
    expect(content.scrollTop).toBe(0);
    content.scrollTop = 77;
    render(false); render(true);
    expect(content.scrollTop).toBe(0);
    content.scrollTop = 77;
    trigger = new FocusTarget(); render(true);
    expect(content.scrollTop).toBe(0);
    expect(browserWindow.scrollTo).toHaveBeenLastCalledWith({ left: 4, top: 760, behavior: 'instant' });
  });

  it('Escape只关闭这一层，取消原生默认动作后通知父组件', () => {
    render(true);
    const stopPropagation = vi.fn();
    const preventDefault = vi.fn();
    event('onKeyDown', { key: 'Escape', stopPropagation });
    event('onCancel', { preventDefault, stopPropagation });
    expect(stopPropagation).toHaveBeenCalledTimes(2);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
    expect(dialog.open).toBe(false);
  });

  it('只有遮罩上开始和结束的点击关闭，内容内拖动不误关', () => {
    render(true);
    event('onPointerDown', { target: lastField, currentTarget: dialog });
    event('onClick', { target: dialog, currentTarget: dialog });
    expect(onClose).not.toHaveBeenCalled();
    event('onPointerDown', { target: dialog, currentTarget: dialog });
    event('onClick', { target: dialog, currentTarget: dialog });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('首尾焦点守卫环绕到有效控件', () => {
    render(true);
    const guards = nodes(props => Object.hasOwn(props, 'data-drawer-focus-guard'));
    (guards[0].props.onFocus as () => void)();
    expect(lastField.focus).toHaveBeenCalledWith({ preventScroll: true });
    (guards[1].props.onFocus as () => void)();
    expect(closeButton.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it.each(['removed', 'hidden'])('原触发器%s时回到图表切换按钮，不滚动定位列表', state => {
    render(true);
    if (state === 'removed') trigger.isConnected = false;
    else trigger.visible = false;
    render(false);
    expect(trigger.focus).not.toHaveBeenCalled();
    expect(fallback.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('spotlight冒泡处理前同步释放模态与滚动锁，之后清理不抢搜索焦点', () => {
    render(true);
    const searchAccept = vi.fn(() => {
      expect(dialog.open).toBe(false);
      expect(bodyStyle.getPropertyValue('position')).toBe('');
      expect(bodyStyle.getPropertyValue('overflow')).toBe('auto');
      bodyStyle.setProperty('overflow', 'hidden');
    });
    browserWindow.addEventListener('spotlight:open', searchAccept);
    browserWindow.dispatchEvent(new Event('spotlight:open'));
    render(false);
    expect(searchAccept).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
    expect(trigger.focus).not.toHaveBeenCalled();
    expect(fallback.focus).not.toHaveBeenCalled();
    expect(bodyStyle.getPropertyValue('overflow')).toBe('hidden');
    expect(browserWindow.scrollTo).toHaveBeenCalledTimes(1);
  });
});
