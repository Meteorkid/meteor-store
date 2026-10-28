import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailyHubProps } from '../DailyHub';

const hooks = vi.hoisted(() => ({ values: [] as unknown[], index: 0, dirty: false,
  effects: new Map<number, { dependencies: unknown[]; cleanup?: () => void }>() }));
const identity = vi.hoisted(() => ({ userId: 'user-a' }));
const navigation = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState: (initial: unknown) => {
    const index = hooks.index++;
    if (!(index in hooks.values)) hooks.values[index] = typeof initial === 'function' ? initial() : initial;
    return [hooks.values[index], (next: unknown) => { hooks.values[index] = typeof next === 'function' ? next(hooks.values[index]) : next; hooks.dirty = true; }];
  },
  useRef: (initial: unknown) => { const index = hooks.index++; hooks.values[index] ??= { current: initial }; return hooks.values[index]; },
  useCallback: (callback: unknown) => callback,
  useSyncExternalStore: (_subscribe: unknown, snapshot: () => unknown) => snapshot(),
  useEffect: (effect: () => (() => void) | undefined, dependencies: unknown[]) => {
    const index = hooks.index++, previous = hooks.effects.get(index);
    if (!previous || dependencies.some((value, i) => value !== previous.dependencies[i])) {
      previous?.cleanup?.(); hooks.effects.set(index, { dependencies, cleanup: effect() });
    }
  },
}));
vi.mock('next-intl', () => ({ useLocale: () => 'zh' }));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: { id: identity.userId }, loading: false }) }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', useRouter: () => navigation }));
vi.mock('../refresh', () => ({ subscribeDailyDate: () => () => {}, subscribeDailyRefresh: () => () => {}, fetchDailyEditions: vi.fn() }));
vi.mock('../entry-navigation', () => ({ useDailyEntryNavigation: () => {} }));
import DailyHub from '../DailyHub';
type Node = ReactElement<Record<string, unknown>>;
function findAll(node: unknown, predicate: (node: Node) => boolean): Node[] {
  if (Array.isArray(node)) return node.flatMap(child => findAll(child, predicate));
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [...(predicate(node) ? [node] : []), ...findAll(node.props.children, predicate)];
}
const revision = '2026-10-24T01:00:00.000Z';
const nextRevision = '2026-10-24T01:00:00.001Z';
const props: DailyHubProps = { date: '2026-10-24', today: '2026-10-24', editions: [], userId: 'user-a',
  initialPreferences: { channels: ['english'], reminders: true }, initialPreferencesRevision: revision };
function render(value = props): Node {
  let result: Node;
  do {
    hooks.index = 0; hooks.dirty = false;
    const inner = DailyHub(value);
    result = (inner.type as (props: unknown) => Node)(inner.props);
  } while (hooks.dirty);
  return result;
}
function button(tree: Node, label: string) { return findAll(tree, node => node.type === 'button' && node.props.children === label)[0]; }
function click(node: Node) { return (node.props.onClick as () => unknown)(); }
function open() { click(button(render(), '管理栏目')); return render(); }
function checkboxes(tree: Node) { return findAll(tree, node => node.type === 'input' && node.props.type === 'checkbox'); }
function unmount() { hooks.effects.forEach(effect => effect.cleanup?.()); hooks.effects.clear(); hooks.values = []; }
const response = (preferences: unknown, rev = nextRevision, userId = 'user-a') => Response.json({ userId, preferences, revision: rev });
beforeEach(() => {
  unmount(); hooks.index = 0; hooks.dirty = false; identity.userId = 'user-a'; vi.clearAllMocks();
  vi.stubGlobal('window', Object.assign(new EventTarget(), { localStorage: { getItem: () => null, setItem: vi.fn() }, location: { search: '', reload: vi.fn() } }));
});
afterEach(() => { unmount(); vi.unstubAllGlobals(); });

describe('日刊关注版本与编辑草稿', () => {
  it('保存携带编辑开始的owner和revision，后续RSC版本变化不替换本次版本', async () => {
    const fetchMock = vi.fn(async () => response({ channels: [], reminders: true })); vi.stubGlobal('fetch', fetchMock);
    const tree = open();
    (checkboxes(tree)[0].props.onChange as (event: unknown) => void)({ target: { checked: false } });
    await click(button(render({ ...props, initialPreferencesRevision: nextRevision }), '保存选择'));
    const options = (fetchMock.mock.calls as unknown as [string, RequestInit][])[0][1];
    expect(options.headers).toMatchObject({ 'X-Daily-User': 'user-a' });
    expect(JSON.parse(String(options.body))).toEqual({ channels: [], reminders: true, expectedRevision: revision });
    expect(button(render(), '保存选择')).toBeUndefined();
  });

  it('409保留草稿并阻止覆盖，显式重新读取后使用新版本保存', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json({ code: 'revision_conflict' }, { status: 409 }))
      .mockResolvedValueOnce(response({ channels: ['ai'], reminders: false }))
      .mockResolvedValueOnce(response({ channels: ['ai'], reminders: false }, '2026-10-24T01:00:00.002Z'));
    vi.stubGlobal('fetch', fetchMock);
    (checkboxes(open())[1].props.onChange as (event: unknown) => void)({ target: { checked: true } });
    await click(button(render(), '保存选择'));
    let tree = render();
    expect(checkboxes(tree)[1].props.checked).toBe(true);
    expect(button(tree, '保存选择').props.disabled).toBe(true);
    expect(findAll(tree, node => node.props.role === 'alert')[0].props.children).toContain('其他窗口或设备');
    await click(button(tree, '重新读取已保存设置'));
    tree = render(); expect(checkboxes(tree)[2].props.checked).toBe(true); expect(checkboxes(tree)[1].props.checked).toBe(false);
    expect(button(tree, '保存选择').props.disabled).toBe(false);
    await click(button(tree, '保存选择'));
    expect(JSON.parse(String(fetchMock.mock.calls[2][1].body)).expectedRevision).toBe(nextRevision);
  });

  it('保存返回错误owner时不采用结果，要求显式重新加载会话', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => response({ channels: ['ai'], reminders: false }, nextRevision, 'user-b')));
    await click(button(open(), '保存选择'));
    const tree = render(); expect(button(tree, '保存选择').props.disabled).toBe(true);
    expect(checkboxes(tree)[0].props.checked).toBe(true);
    await click(button(tree, '重新读取已保存设置'));
    expect(window.location.reload).toHaveBeenCalledOnce();
  });

  it('换账号卸载后，旧保存成功不改新草稿或执行页面导航', async () => {
    let finish!: (value: Response) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(resolve => { finish = resolve; })));
    const dispatch = vi.spyOn(window, 'dispatchEvent');
    const pending = click(button(open(), '保存选择'));
    unmount(); identity.userId = 'user-b';
    const other = { ...props, userId: 'user-b', initialPreferences: { channels: ['ai'] as const, reminders: false } };
    render({ ...other, initialPreferences: { ...other.initialPreferences, channels: [...other.initialPreferences.channels] } });
    finish(response({ channels: ['english'], reminders: true })); await pending;
    expect(dispatch).not.toHaveBeenCalled(); expect(navigation.replace).not.toHaveBeenCalled();
  });
});
