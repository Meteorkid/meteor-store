import { isValidElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultDailyPanelSettings, type DailyPanelSettings as Settings } from '@/lib/daily/panel-types';

const hooks = vi.hoisted(() => ({
  values: [] as unknown[], index: 0, dirty: false,
  effects: new Map<number, { dependencies: unknown[]; cleanup?: () => void }>(),
}));
const store = vi.hoisted(() => ({ current: {} as Record<string, unknown> }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useRef: (initial: unknown) => {
    const index = hooks.index++;
    hooks.values[index] ??= { current: initial };
    return hooks.values[index];
  },
  useState: <T,>(initial: T) => {
    const index = hooks.index++;
    if (!(index in hooks.values)) hooks.values[index] = initial;
    return [hooks.values[index], (next: T) => { hooks.values[index] = next; hooks.dirty = true; }];
  },
  useEffect: (effect: () => (() => void), dependencies: unknown[]) => {
    const index = hooks.index++;
    const previous = hooks.effects.get(index);
    if (!previous || dependencies.some((value, i) => value !== previous.dependencies[i])) {
      previous?.cleanup?.();
      hooks.effects.set(index, { dependencies, cleanup: effect() });
    }
  },
}));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ loading: false }) }));
vi.mock('@/lib/daily/panel-client', () => ({ useDailyPanel: () => store.current }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));
import DailyNotificationPanel from '../DailyNotificationPanel';
import DailyPanelSettings from '../DailyPanelSettings';

type Node = ReactElement<Record<string, unknown>>;
function find(node: unknown, predicate: (node: Node) => boolean): Node | undefined {
  if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean);
  if (!isValidElement<Record<string, unknown>>(node)) return undefined;
  return predicate(node) ? node : find(node.props.children, predicate);
}
function render(userId: string | null = 'a') {
  let tree: Node;
  do {
    hooks.dirty = false;
    hooks.index = 0;
    tree = DailyNotificationPanel({ locale: 'zh', userId });
  } while (hooks.dirty);
  return tree;
}
function open(userId: string) {
  const tree = render(userId);
  const button = find(tree, node => node.type === 'button' && node.props.children === '自定义')!;
  (button.props.onClick as () => void)();
  return find(render(userId), node => node.type === DailyPanelSettings)!;
}

beforeEach(() => {
  hooks.effects.forEach(effect => effect.cleanup?.());
  hooks.effects.clear(); hooks.values = []; hooks.index = 0; hooks.dirty = false;
  const settings = defaultDailyPanelSettings();
  store.current = {
    preview: null, contentLoading: false, contentFailed: false, settings, effectiveSettings: settings, defaultSettings: settings,
    preferencesLoading: false, preferencesFailed: false, preferencesChanged: false, preferencesReady: true, revision: 'revision-a',
    saving: false, saveError: null, refresh: vi.fn(), reload: vi.fn(), save: vi.fn(async () => true),
    clearSaveError: vi.fn(() => { store.current.saveError = null; }),
  };
});

describe('每日面板编辑会话', () => {
  it('新编辑会话与显式重新加载清除旧保存错误，普通重绘和内容刷新不清', () => {
    store.current.saveError = 'conflict';
    open('a');
    expect(store.current.clearSaveError).toHaveBeenCalledOnce();
    expect(store.current.saveError).toBeNull();
    store.current.saveError = 'conflict';
    const editor = find(render('a'), node => node.type === DailyPanelSettings)!;
    expect(editor.props.error).toBe('conflict');
    expect(store.current.clearSaveError).toHaveBeenCalledOnce();
    (editor.props.onReload as () => void)();
    expect(store.current.clearSaveError).toHaveBeenCalledTimes(2);
    expect(store.current.reload).toHaveBeenCalledOnce();
    store.current.saveError = 'conflict';
    const tree = render('a');
    const refresh = find(tree, node => node.type === 'button' && node.props.children === '刷新')!;
    (refresh.props.onClick as () => void)();
    expect(store.current.refresh).toHaveBeenCalledOnce();
    expect(store.current.clearSaveError).toHaveBeenCalledTimes(2);
    expect(store.current.saveError).toBe('conflict');
  });

  it('A→B→A永久丢弃旧草稿，必须显式重新进入编辑', () => {
    expect(open('a')).toBeDefined();
    expect(find(render('b'), node => node.type === DailyPanelSettings)).toBeUndefined();
    expect(find(render('a'), node => node.type === DailyPanelSettings)).toBeUndefined();
  });

  it('编辑期间版本刷新不改变本次保存的expectedRevision', async () => {
    const editor = open('a');
    store.current.revision = 'revision-new';
    const current = find(render('a'), node => node.type === DailyPanelSettings)!;
    await (current.props.onSave as (settings: Settings) => Promise<boolean>)(editor.props.settings as Settings);
    expect(store.current.save).toHaveBeenCalledWith(editor.props.settings, 'revision-a');
  });

  it('A的迟到保存完成不会关闭B的新草稿或抢走焦点', async () => {
    let finish!: (saved: boolean) => void;
    store.current.save = vi.fn(() => new Promise<boolean>(resolve => { finish = resolve; }));
    const editorA = open('a');
    const focus = vi.fn();
    (hooks.values[0] as { current: unknown }).current = { focus };
    const pending = (editorA.props.onSave as (settings: Settings) => Promise<boolean>)(editorA.props.settings as Settings);
    const editorB = open('b');
    finish(true);
    await pending;
    expect(find(render('b'), node => node.type === DailyPanelSettings)?.props.settings).toBe(editorB.props.settings);
    expect(focus).not.toHaveBeenCalled();
  });

  it('取消后重新进入同账号编辑，旧保存完成不能关闭新会话', async () => {
    let finish!: (saved: boolean) => void;
    store.current.save = vi.fn(() => new Promise<boolean>(resolve => { finish = resolve; }));
    const first = open('a');
    const pending = (first.props.onSave as (settings: Settings) => Promise<boolean>)(first.props.settings as Settings);
    (first.props.onCancel as () => void)();
    open('a');
    finish(true);
    await pending;
    expect(find(render('a'), node => node.type === DailyPanelSettings)).toBeDefined();
  });

  it('卸载后忽略保存完成，不把焦点移到旧触发器', async () => {
    let finish!: (saved: boolean) => void;
    store.current.save = vi.fn(() => new Promise<boolean>(resolve => { finish = resolve; }));
    const editor = open('a');
    const focus = vi.fn();
    (hooks.values[0] as { current: unknown }).current = { focus };
    const pending = (editor.props.onSave as (settings: Settings) => Promise<boolean>)(editor.props.settings as Settings);
    hooks.effects.forEach(effect => effect.cleanup?.());
    finish(true); await pending;
    expect(focus).not.toHaveBeenCalled();
  });

  it('GET身份不匹配显示账号变化并刷新整页，不反复重读旧owner', () => {
    const reloadPage = vi.fn();
    vi.stubGlobal('window', { location: { reload: reloadPage } });
    store.current.preferencesChanged = true;
    const tree = render('a');
    const action = find(tree, node => node.type === 'button' && node.props.children === '重新加载已保存设置')!;
    (action.props.onClick as () => void)();
    expect(reloadPage).toHaveBeenCalledOnce();
    expect(store.current.reload).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
