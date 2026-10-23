import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({ states: [] as unknown[], index: 0 }));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: <T,>(initial: T) => {
    const index = hooks.index++;
    if (!(index in hooks.states)) hooks.states[index] = initial;
    return [hooks.states[index], (next: T) => { hooks.states[index] = next; }];
  },
  useRef: (value: unknown) => ({ current: value }), useEffect: vi.fn(), useCallback: (callback: unknown) => callback,
}));
vi.mock('next-intl', () => ({ useLocale: () => 'zh', useTranslations: () => (key: string) => key }));
import { AuthProvider } from '../AuthProvider';

const user = { id: 'user-a', email: 'fixture@example.test' };
beforeEach(() => { hooks.states = [user, false]; hooks.index = 0; });
afterEach(() => vi.unstubAllGlobals());

describe('AuthProvider注销成功边界', () => {
  it('HTTP失败不会声称已退出或丢掉当前身份', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 500 })));
    const context = AuthProvider({ children: null }).props.value;
    await expect(context.logout()).rejects.toThrow('Logout failed');
    expect(hooks.states[0]).toEqual(user);
  });

  it('成功注销后才清除当前身份', async () => {
    let complete!: (response: Response) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(resolve => { complete = resolve; })));
    const context = AuthProvider({ children: null }).props.value;
    const pending = context.logout();
    expect(hooks.states[0]).toEqual(user);
    complete(new Response('{}')); await pending;
    expect(hooks.states[0]).toBeNull();
  });
});
