import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AdmissionsKind } from '@/lib/admissions/config';
import type { MastersHubProps } from '../MastersHub';
import { roundFixture, watchFixture } from './fixtures';

const hooks = vi.hoisted(() => ({
  key: '', stateIndex: 0, refIndex: 0, effectIndex: 0,
  states: new Map<string, unknown>(), refs: new Map<string, { current: unknown }>(),
  effects: new Map<string, { deps?: unknown[]; cleanup?: () => void }>(),
  pending: new Map<string, () => void | (() => void)>(),
}));
const mocks = vi.hoisted(() => ({ userId: 'user-a' as string | null, push: vi.fn(), fetch: vi.fn(), event: vi.fn() }));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: (initial: unknown) => {
    const key = `${hooks.key}:state:${hooks.stateIndex++}`;
    if (!hooks.states.has(key)) hooks.states.set(key, typeof initial === 'function' ? initial() : initial);
    return [hooks.states.get(key), (value: unknown) => hooks.states.set(key, typeof value === 'function' ? value(hooks.states.get(key)) : value)];
  },
  useRef: (initial: unknown) => {
    const key = `${hooks.key}:ref:${hooks.refIndex++}`;
    if (!hooks.refs.has(key)) hooks.refs.set(key, { current: initial });
    return hooks.refs.get(key);
  },
  useCallback: (callback: unknown) => callback,
  useSyncExternalStore: (_subscribe: unknown, _snapshot: unknown, serverSnapshot: () => unknown) => serverSnapshot(),
  useEffect: (effect: () => void | (() => void), deps?: unknown[]) => {
    const key = `${hooks.key}:effect:${hooks.effectIndex++}`;
    const previous = hooks.effects.get(key);
    if (!previous || !deps || deps.some((value, index) => !Object.is(value, previous.deps?.[index]))) {
      previous?.cleanup?.(); hooks.effects.set(key, { deps }); hooks.pending.set(key, effect);
    }
  },
}));
vi.mock('next-intl', () => ({ useLocale: () => 'zh' }));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: mocks.userId ? { id: mocks.userId } : null, loading: false }) }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', useRouter: () => ({ push: mocks.push, refresh: vi.fn() }) }));

import MastersHub from '../MastersHub';
import RoundCard from '../RoundCard';

type Node = ReactElement<Record<string, unknown>>;
function nodes(tree: unknown, match: (node: Node) => boolean): Node[] {
  if (Array.isArray(tree)) return tree.flatMap(child => nodes(child, match));
  if (!isValidElement<Record<string, unknown>>(tree)) return [];
  return [...(match(tree) ? [tree] : []), ...nodes(tree.props.children, match)];
}
const base = roundFixture();
function render(kind: AdmissionsKind = 'phd', overrides: Partial<MastersHubProps> = {}) {
  const wrapper = MastersHub({ kind, year: 2027, nowIso: '2026-10-14T04:00:00Z', rounds: [base],
    userId: 'user-a', initialWatches: [], watchedRounds: [], ...overrides });
  hooks.key = String(wrapper.key); hooks.stateIndex = hooks.refIndex = hooks.effectIndex = 0;
  const tree = (wrapper.type as (props: unknown) => Node)(wrapper.props);
  for (const [key, effect] of hooks.pending) hooks.effects.get(key)!.cleanup = effect() || undefined;
  hooks.pending.clear();
  return { tree, key: hooks.key };
}
function card(tree: Node) { return nodes(tree, node => node.type === RoundCard)[0].props; }
function dispose(key: string) {
  for (const [name, effect] of hooks.effects) if (name.startsWith(`${key}:`)) effect.cleanup?.();
}
async function settle() { for (let i = 0; i < 8; i++) await Promise.resolve(); }
const response = (data: unknown) => ({ ok: true, json: async () => data });

beforeEach(() => {
  hooks.states.clear(); hooks.refs.clear(); hooks.effects.clear(); hooks.pending.clear();
  mocks.userId = 'user-a'; mocks.push.mockReset(); mocks.fetch.mockReset(); mocks.event.mockReset();
  mocks.fetch.mockResolvedValue(response({ userId: 'user-a', watches: [], rounds: [] }));
  vi.stubGlobal('fetch', mocks.fetch); vi.stubGlobal('window', { dispatchEvent: mocks.event });
});
afterEach(() => { for (const effect of hooks.effects.values()) effect.cleanup?.(); vi.unstubAllGlobals(); });

describe('硕博共享申请界面的作用域隔离', () => {
  it('博士读取与保存仅访问博士接口，带博士owner头并广播博士事件', async () => {
    let { tree } = render(); await settle();
    expect(mocks.fetch).toHaveBeenCalledWith('/api/phd/watches', { cache: 'no-store' });
    const watch = watchFixture();
    mocks.fetch.mockResolvedValueOnce(response({ userId: 'user-a', watch }));
    (card(tree).onSave as (input: unknown) => void)({ roundId: base.id, status: 'preparing', reminders: false });
    await settle();
    expect(mocks.fetch).toHaveBeenLastCalledWith('/api/phd/watches', expect.objectContaining({ method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Phd-User': 'user-a' } }));
    expect(mocks.event.mock.calls[0][0].type).toBe('phd-watches-changed');
    tree = render().tree;
    expect(card(tree).watch).toEqual(watch);
    (card(tree).onSelect as (id: string) => void)(base.id);
    tree = render().tree;
    expect(nodes(tree, node => node.type === 'a' && node.props.download === true)[0].props.href).toBe(`/api/phd/calendar?ids=${base.id}`);
    const yearForm = nodes(tree, node => node.type === 'form')[0];
    (yearForm.props.onSubmit as (event: unknown) => void)({ preventDefault: vi.fn() });
    expect(mocks.push).toHaveBeenCalledWith('/phd?year=2027');
  });

  it('同一账号与轮次ID的硕博草稿、导出选择与年份互不串用', () => {
    let masters = render('masters');
    (card(masters.tree).onDraftChange as (value: unknown) => void)({ status: 'submitted', reminders: true });
    (card(masters.tree).onSelect as (id: string) => void)(base.id);
    masters = render('masters');
    expect(card(masters.tree).draft).toEqual({ status: 'submitted', reminders: true });
    const phd = render();
    expect(phd.key).not.toBe(masters.key);
    expect(card(phd.tree).draft).toEqual({ status: 'preparing', reminders: false });
    expect(card(phd.tree).selected).toBe(false);
    expect(render('phd', { year: 2028 }).key).not.toBe(phd.key);
    mocks.userId = 'user-b';
    expect(render().key).not.toBe(phd.key);
    mocks.userId = null;
    expect(card(render().tree).signedIn).toBe(false);
  });

  it('切换作用域后，旧保存结果既不覆盖新界面也不广播过时事件', async () => {
    const masters = render('masters'); await settle();
    let complete!: (value: unknown) => void;
    mocks.fetch.mockImplementationOnce(() => new Promise(resolve => { complete = resolve; }));
    (card(masters.tree).onSave as (input: unknown) => void)({ roundId: base.id, status: 'preparing', reminders: false });
    dispose(masters.key);
    render(); await settle();
    complete(response({ userId: 'user-a', watch: watchFixture() })); await settle();
    expect(card(render().tree).watch).toBeUndefined();
    expect(mocks.event).not.toHaveBeenCalled();
  });

  it('响应owner不符时保留草稿并报错，不接受其他账号的关注', async () => {
    let { tree } = render(); await settle();
    (card(tree).onDraftChange as (value: unknown) => void)({ status: 'submitted', reminders: true });
    mocks.fetch.mockResolvedValueOnce(response({ userId: 'user-b', watch: watchFixture() }));
    (card(tree).onSave as (input: unknown) => void)({ roundId: base.id, status: 'submitted', reminders: true });
    await settle(); tree = render().tree;
    expect(card(tree).watch).toBeUndefined();
    expect(card(tree).draft).toEqual({ status: 'submitted', reminders: true });
    expect(card(tree).error).toContain('未能保存');
    expect(mocks.event).not.toHaveBeenCalled();
  });
});
