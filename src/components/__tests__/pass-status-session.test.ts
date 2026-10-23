import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({
  states: [] as unknown[], index: 0, effectIndex: 0,
  effects: [] as { dependencies: unknown[]; cleanup?: () => void }[],
  pending: [] as (() => void)[],
  auth: { loading: false, user: { id: 'owner-a' } as { id: string } | null },
}));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: (initial: unknown) => {
    const index = hooks.index++;
    if (!(index in hooks.states)) hooks.states[index] = initial;
    return [hooks.states[index], (next: unknown) => {
      hooks.states[index] = typeof next === 'function' ? next(hooks.states[index]) : next;
    }];
  },
  useEffect: (effect: () => void | (() => void), dependencies: unknown[]) => {
    const index = hooks.effectIndex++;
    const previous = hooks.effects[index];
    if (previous && dependencies.every((value, i) => Object.is(value, previous.dependencies[i]))) return;
    hooks.pending.push(() => {
      previous?.cleanup?.();
      hooks.effects[index] = { dependencies, cleanup: effect() || undefined };
    });
  },
}));
vi.mock('../AuthProvider', () => ({ useAuth: () => hooks.auth }));

import { usePassStatus } from '../usePassStatus';

function renderPassStatus() {
  hooks.index = 0;
  hooks.effectIndex = 0;
  // eslint-disable-next-line react-hooks/rules-of-hooks -- 受控 hook 夹具执行真实状态逻辑，并显式运行清理函数。
  const value = usePassStatus();
  hooks.pending.splice(0).forEach(effect => effect());
  return value;
}
function deferred() {
  let resolve!: (value: Response) => void;
  const promise = new Promise<Response>(done => { resolve = done; });
  return { promise, resolve };
}
const status = (userId: string, currentPlan: string | null = 'annual') => new Response(JSON.stringify({
  userId, hasPass: currentPlan !== null, currentPlan, expiresAt: currentPlan === 'annual' ? '2027-10-01T00:00:00.000Z' : null,
}));
const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

beforeEach(() => {
  hooks.states = []; hooks.effects = []; hooks.pending = [];
  hooks.auth = { loading: false, user: { id: 'owner-a' } };
  vi.useFakeTimers();
});
afterEach(() => {
  hooks.effects.forEach(effect => effect.cleanup?.());
  vi.unstubAllGlobals(); vi.useRealTimers();
});

describe('Pass 状态的账号与失败边界', () => {
  it('换号即隐藏旧状态，并取消和忽略旧账号迟到响应', async () => {
    const first = deferred(); const second = deferred();
    const fetch = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    vi.stubGlobal('fetch', fetch);
    expect(renderPassStatus().loading).toBe(true);
    expect(fetch.mock.calls[0][1].cache).toBe('no-store');
    hooks.auth.user = { id: 'owner-b' };
    expect(renderPassStatus().status).toBeNull();
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    second.resolve(status('owner-b', null)); await settle();
    expect(renderPassStatus().status?.hasPass).toBe(false);
    first.resolve(status('owner-a', 'lifetime')); await settle();
    expect(renderPassStatus().status?.hasPass).toBe(false);
  });

  it('注销立即清除会员状态，同账号重新登录也必须重新查询', async () => {
    const second = deferred();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(status('owner-a')).mockReturnValueOnce(second.promise));
    renderPassStatus(); await settle(); expect(renderPassStatus().status?.hasPass).toBe(true);
    hooks.auth.user = null;
    expect(renderPassStatus()).toMatchObject({ status: null, loading: false, error: null });
    hooks.auth.user = { id: 'owner-a' };
    expect(renderPassStatus()).toMatchObject({ status: null, loading: true });
    second.resolve(status('owner-a', null)); await settle();
    expect(renderPassStatus().status?.hasPass).toBe(false);
  });

  it('503不变成未持有；用户重试成功后才恢复购买判断', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response('{}', { status: 503 })).mockResolvedValueOnce(status('owner-a', null));
    vi.stubGlobal('fetch', fetch);
    renderPassStatus(); await settle();
    expect(renderPassStatus()).toMatchObject({ status: null, error: 'failed', loading: false });
    renderPassStatus().retry(); expect(renderPassStatus().loading).toBe(true); await settle();
    expect(renderPassStatus()).toMatchObject({ status: { hasPass: false }, error: null, loading: false });
  });

  it('服务端身份与当前账号不符时要求刷新，不能采纳另一账号结果', async () => {
    const reload = vi.fn(); vi.stubGlobal('window', { location: { reload } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(status('owner-b', 'lifetime')));
    renderPassStatus(); await settle();
    expect(renderPassStatus()).toMatchObject({ status: null, error: 'changed', loading: false });
    renderPassStatus().retry(); expect(reload).toHaveBeenCalledOnce();
  });

  it('长期无响应会显示可重试错误，迟到结果不能恢复会员', async () => {
    const request = deferred(); const fetch = vi.fn().mockReturnValue(request.promise);
    vi.stubGlobal('fetch', fetch); renderPassStatus();
    await vi.advanceTimersByTimeAsync(15_000);
    expect(renderPassStatus()).toMatchObject({ status: null, error: 'failed', loading: false });
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    request.resolve(status('owner-a', 'lifetime')); await settle();
    expect(renderPassStatus().error).toBe('failed');
  });

  it('游客与身份加载阶段不请求会员接口', () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    hooks.auth = { user: null, loading: true };
    expect(renderPassStatus().loading).toBe(true);
    hooks.auth.loading = false;
    expect(renderPassStatus()).toMatchObject({ loading: false, status: null });
    expect(fetch).not.toHaveBeenCalled();
  });
});
