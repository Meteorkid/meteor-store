import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const runtime = vi.hoisted(() => ({
  user: { id: 'user-a' } as { id: string } | null, loading: false,
  states: [] as unknown[], refs: [] as Array<{ current: unknown }>,
  effects: [] as Array<{ deps: unknown[]; cleanup?: () => void }>,
  pendingEffects: [] as Array<() => void>, stateIndex: 0, refIndex: 0, effectIndex: 0, dirty: false,
  refreshAuth: vi.fn(async () => {}), refreshPage: vi.fn(),
}));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: <T,>(initial: T | (() => T)) => {
    const index = runtime.stateIndex++;
    if (!(index in runtime.states)) runtime.states[index] = typeof initial === 'function' ? (initial as () => T)() : initial;
    return [runtime.states[index], (next: T | ((previous: T) => T)) => {
      runtime.states[index] = typeof next === 'function' ? (next as (previous: T) => T)(runtime.states[index] as T) : next;
      runtime.dirty = true;
    }];
  },
  useRef: (initial: unknown) => runtime.refs[runtime.refIndex++] ??= { current: initial },
  useEffect: (effect: () => void | (() => void), deps: unknown[]) => {
    const index = runtime.effectIndex++;
    const previous = runtime.effects[index];
    if (!previous || deps.some((value, at) => !Object.is(value, previous.deps[at]))) {
      runtime.pendingEffects.push(() => {
        previous?.cleanup?.();
        runtime.effects[index] = { deps, cleanup: effect() || undefined };
      });
    }
  },
}));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: runtime.user, loading: runtime.loading, refresh: runtime.refreshAuth }) }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', useRouter: () => ({ refresh: runtime.refreshPage }) }));

import SaveButton from '@/components/pathfinder/SaveButton';
import FollowButton from '@/components/pathfinder/FollowButton';
import ReminderToggle from '@/components/pathfinder/ReminderToggle';

type Node = ReactElement<Record<string, unknown>>;
let tree: Node;
let renderComponent: () => Node;
const nodes = (node: unknown = tree): Node[] => Array.isArray(node) ? node.flatMap(nodes)
  : isValidElement<Record<string, unknown>>(node) ? [node, ...nodes(node.props.children ?? null)] : [];
const button = () => nodes().find(node => node.props['aria-pressed'] !== undefined || node.props.type === 'checkbox')!;
const selected = () => button().props['aria-pressed'] ?? button().props.checked;
const render = () => {
  let iterations = 0;
  do {
    if (++iterations > 10) throw new Error('Render did not settle');
    runtime.dirty = false;
    runtime.stateIndex = runtime.refIndex = runtime.effectIndex = 0;
    tree = renderComponent();
  } while (runtime.dirty);
  runtime.pendingEffects.splice(0).forEach(effect => effect());
};
const click = () => { ((button().props.onClick ?? button().props.onChange) as () => void)(); render(); };
const settle = async () => { for (let index = 0; index < 8; index++) await Promise.resolve(); render(); };

beforeEach(() => {
  runtime.user = { id: 'user-a' }; runtime.loading = false;
  runtime.states = []; runtime.refs = []; runtime.effects = []; runtime.pendingEffects = [];
  runtime.refreshAuth.mockClear(); runtime.refreshPage.mockClear();
});
afterEach(() => { runtime.effects.forEach(effect => effect.cleanup?.()); vi.unstubAllGlobals(); });

describe.each(['save', 'follow', 'reminder'] as const)('%s 会话变化', kind => {
  beforeEach(() => {
    const props = { initialOwnerId: 'user-a' };
    renderComponent = kind === 'save'
      ? () => SaveButton({ ...props, itemId: 'item-a', initialSaved: true })
      : kind === 'follow' ? () => FollowButton({ ...props, kind: 'topic', value: 'ai', initialFollowing: true })
        : () => ReminderToggle({ ...props, itemId: 'item-a', initialEnabled: true });
  });

  it('401提供登录继续入口并清除旧按下状态', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
    render(); click(); await settle();
    expect(selected()).toBe(false);
    expect(nodes().some(node => node.type === 'a' && node.props.children === 'loginAction')).toBe(true);
    expect(nodes().some(node => node.props.children === 'failed')).toBe(false);
  });

  it('同页退出立即清掉旧状态，点击不再发送写请求', async () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    render(); expect(selected()).toBe(true);
    runtime.user = null; render();
    expect(selected()).toBe(false);
    click();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(nodes().some(node => node.type === 'a' && node.props.children === 'loginAction')).toBe(true);
  });

  it('A操作等待时切到B，不接受迟到结果或自动写入B', async () => {
    let resolve!: (response: Response) => void;
    const fetchMock = vi.fn<typeof fetch>(() => new Promise<Response>(done => { resolve = done; }));
    vi.stubGlobal('fetch', fetchMock);
    render(); click();
    runtime.user = { id: 'user-b' }; render();
    resolve(new Response(JSON.stringify({ saved: true, following: true, remindDeadline: true })));
    await settle();
    expect(selected()).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ headers: { 'X-Pathfinder-User': 'user-a' } });
    expect((fetchMock.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(true);
  });

  it('409显示账号变化与刷新入口，刷新不自动重放写请求', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 409 }));
    vi.stubGlobal('fetch', fetchMock);
    render(); click(); await settle();
    expect(selected()).toBe(false);
    expect(button().props.disabled).toBe(true);
    const refresh = nodes().find(node => node.type === 'button' && node.props.children === 'refreshAction')!;
    expect(refresh).toBeDefined();
    (refresh.props.onClick as () => void)(); await settle();
    expect(runtime.refreshAuth).toHaveBeenCalledTimes(1);
    expect(runtime.refreshPage).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('尚未确定身份时不使用另一身份的SSR状态或发请求', () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    runtime.loading = true; render(); click();
    expect(selected()).toBe(false);
    expect(button().props.disabled).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    runtime.loading = false; render();
    expect(selected()).toBe(true);
  });

  it('普通失败保留可重试状态，但401不再次发送旧身份操作', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('{}', { status: 503 }))
      .mockResolvedValueOnce(new Response('{}', { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);
    render(); click(); await settle();
    expect(selected()).toBe(true);
    expect(button().props.disabled).toBe(false);
    click(); await settle(); click(); await settle();
    expect(selected()).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('匹配身份时采用SSR状态，只在点击后发送一次并采用服务端结果', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ saved: false, following: false, remindDeadline: false })));
    vi.stubGlobal('fetch', fetchMock);
    render();
    expect(selected()).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    const handler = (button().props.onClick ?? button().props.onChange) as () => void;
    handler(); handler(); render(); await settle();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(selected()).toBe(false);
    expect(button().props.disabled).toBe(false);
  });
});
