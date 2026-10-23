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
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));


import DownloadCard from '@/components/DownloadCard';

type Node = ReactElement<Record<string, unknown>>;
let tree: Node;
let productId = 'xnook';
let gated = true;
const nodes = (node: unknown): Node[] => Array.isArray(node) ? node.flatMap(nodes)
  : isValidElement<Record<string, unknown>>(node) ? [node, ...nodes(node.props.children ?? null)] : [];
const hrefs = () => nodes(tree).map(node => node.props.href).filter(Boolean);
const text = () => nodes(tree).map(node => typeof node.props.children === 'string' ? node.props.children : '').join(' ');
const render = () => {
  let attempts = 0;
  do {
    if (++attempts > 10) throw new Error('Render did not settle');
    runtime.dirty = false;
    runtime.pendingEffects = []; // React丢弃渲染期setState触发的中间渲染effects。
    runtime.stateIndex = runtime.refIndex = runtime.effectIndex = 0;
    tree = DownloadCard({ productId, gated, fileId: 'dmg', label: 'DMG', icon: null, iconColor: '', recommended: true });
  } while (runtime.dirty);
  runtime.pendingEffects.splice(0).forEach(effect => effect());
};
const settle = async () => { await new Promise(resolve => setImmediate(resolve)); render(); };
const reply = (userId: string, ids: string[]) => new Response(JSON.stringify({ userId, entitlements: ids.map(productId => ({ productId })) }));
const click = (label: string) => {
  const node = nodes(tree).find(node => node.type === 'button' && node.props.children === label);
  expect(node).toBeDefined();
  (node!.props.onClick as () => void)(); render();
};
beforeEach(() => {
  productId = 'xnook'; gated = true;
  runtime.user = { id: 'user-a' }; runtime.loading = false;
  runtime.states = []; runtime.refs = []; runtime.effects = []; runtime.pendingEffects = [];
  runtime.refreshAuth.mockClear(); runtime.refreshPage.mockClear();
});
afterEach(() => { runtime.effects.forEach(effect => effect.cleanup?.()); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('门控下载授权状态', () => {
  it('超时结束校验并给出重试，不长期停留在检查中', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(() => new Promise<Response>(() => {})); vi.stubGlobal('fetch', fetchMock);
    render(); await vi.advanceTimersByTimeAsync(15_000); render();
    expect(text()).toContain('downloadUnavailable'); expect(hrefs()).toEqual([]);
    expect((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].signal?.aborted).toBe(true);
  });
  it.each([500, 503])('HTTP %i 显示读取失败并可重试，不导向购买', async status => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('{}', { status })).mockResolvedValueOnce(reply('user-a', ['xnook']));
    vi.stubGlobal('fetch', fetchMock); render(); await settle();
    expect(hrefs()).not.toContain('/products/xnook#pricing');
    expect(text()).toContain('downloadUnavailable');
    expect(nodes(tree).some(node => node.props.role === 'alert')).toBe(true);
    click('downloadRetry'); expect(text()).toContain('downloadChecking'); await settle();
    expect(hrefs()).toContain('/api/download/xnook?file=dmg');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it('401提供带产品与下载锚点的登录继续入口', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
    render(); await settle();
    expect(hrefs()).toContain('/login?next=%2Fproducts%2Fxnook%23download');
    expect(hrefs()).not.toContain('/products/xnook#pricing');
    expect(text()).toContain('downloadSessionExpired');
  });
  it('只有成功读取本账号的空授权列表才引导购买', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply('user-a', [])));
    render(); await settle(); expect(hrefs()).toContain('/products/xnook#pricing');
  });
  it('身份待定时不显示登录或购买，不发授权查询', async () => {
    runtime.loading = true; runtime.user = null;
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    render(); expect(hrefs()).toEqual([]); expect(text()).toContain('downloadChecking'); expect(fetchMock).not.toHaveBeenCalled();
  });
  it('A换到B时立刻隐藏旧授权并拒收A的迟到响应', async () => {
    let finishA!: (response: Response) => void;
    const fetchMock = vi.fn().mockImplementationOnce(() => new Promise<Response>(resolve => { finishA = resolve; })).mockResolvedValueOnce(reply('user-b', []));
    vi.stubGlobal('fetch', fetchMock); render();
    runtime.user = { id: 'user-b' }; render();
    expect(hrefs()).toEqual([]); expect(text()).toContain('downloadChecking');
    finishA(reply('user-a', ['xnook'])); await settle();
    expect(hrefs()).toContain('/products/xnook#pricing');
    expect(hrefs()).not.toContain('/api/download/xnook?file=dmg');
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  });
  it('Cookie身份与当前UI不同不采用他人授权，明确要求刷新账号', async () => {
    const fetchMock = vi.fn().mockResolvedValue(reply('user-b', ['xnook'])); vi.stubGlobal('fetch', fetchMock);
    render(); await settle(); expect(hrefs()).toEqual([]); expect(text()).toContain('downloadAccountChanged');
    click('downloadRefresh'); await settle(); expect(runtime.refreshAuth).toHaveBeenCalledOnce();
  });
  it.each([null, {}, { userId: 'user-a', entitlements: {} }, { userId: 'user-a', entitlements: [{}] }])('损坏响应不被当成无授权：%j', async body => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body))));
    render(); await settle(); expect(text()).toContain('downloadUnavailable'); expect(hrefs()).toEqual([]);
  });
  it('网络失败保留重试，注销后不能保留下载链接', async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(reply('user-a',['xnook']));
    vi.stubGlobal('fetch', fetchMock); render(); await settle(); expect(text()).toContain('downloadUnavailable');
    click('downloadRetry'); await settle(); expect(hrefs()).toContain('/api/download/xnook?file=dmg');
    runtime.user = null; render(); expect(hrefs()).toContain('/login?next=%2Fproducts%2Fxnook%23download');
    expect(hrefs()).not.toContain('/api/download/xnook?file=dmg');
  });
  it('产品切换重新校验，免费公开下载不查询账号授权', async () => {
    const fetchMock=vi.fn().mockImplementation(async () => reply('user-a',['xnook']));vi.stubGlobal('fetch',fetchMock);
    render();await settle();productId='xisland';render();expect(hrefs()).toEqual([]);await settle();expect(hrefs()).toContain('/products/xisland#pricing');
    gated=false;render();expect(hrefs()).toContain('/api/download/xisland?file=dmg');expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
