import { isValidElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ states: [] as unknown[], index: 0, logout: vi.fn(), refresh: vi.fn() }));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: <T,>(initial: T) => {
    const index = mocks.index++;
    if (!(index in mocks.states)) mocks.states[index] = initial;
    return [mocks.states[index], (next: T) => { mocks.states[index] = next; }];
  },
  useRef: () => ({ current: null }), useEffect: vi.fn(),
}));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', useRouter: () => ({ refresh: mocks.refresh }) }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: { id: 'user-a', email: 'fixture@example.test' }, loading: false, logout: mocks.logout }) }));

import UserMenu from '../UserMenu';
type Node = ReactElement<Record<string, unknown>>;
const nodes = (node: unknown): Node[] => Array.isArray(node) ? node.flatMap(nodes)
  : isValidElement<Record<string, unknown>>(node) ? [node, ...nodes(node.props.children ?? null)] : [];
const render = () => { mocks.index = 0; return UserMenu(); };
const logoutButton = () => nodes(render()).find(node => node.type === 'button' && node.props.children === 'logout')!;

beforeEach(() => { mocks.states = [true]; mocks.logout.mockReset(); mocks.refresh.mockReset(); });

describe('退出登录后刷新服务端私有内容', () => {
  it('注销请求完成之前不刷新，成功之后刷新RSC并关闭菜单', async () => {
    let complete!: () => void;
    mocks.logout.mockReturnValue(new Promise<void>(resolve => { complete = resolve; }));
    const pending = (logoutButton().props.onClick as () => Promise<void>)();
    expect(mocks.refresh).not.toHaveBeenCalled();
    expect(mocks.states[0]).toBe(true);
    complete(); await pending;
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
    expect(mocks.states[0]).toBe(false);
  });

  it('注销失败保持菜单可重试，不刷新为伪退出状态', async () => {
    mocks.logout.mockRejectedValue(new Error('network unavailable'));
    await (logoutButton().props.onClick as () => Promise<void>)();
    expect(mocks.refresh).not.toHaveBeenCalled();
    expect(mocks.states[0]).toBe(true);
    expect(logoutButton().props.disabled).toBe(false);
    expect(nodes(render()).some(node => node.props.role === 'status' && node.props.children === 'error')).toBe(true);
  });
});
