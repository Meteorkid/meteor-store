import { isValidElement, type ReactElement } from 'react';
import { beforeEach, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({ states: [] as unknown[], index: 0, register: vi.fn() }));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: (initial: unknown) => {
    const index = hooks.index++;
    if (!(index in hooks.states)) hooks.states[index] = initial;
    return [hooks.states[index], (value: unknown) => { hooks.states[index] = typeof value === 'function' ? value(hooks.states[index]) : value; }];
  },
  useCallback: (callback: unknown) => callback,
}));
vi.mock('next-intl', () => ({ useLocale: () => 'zh', useTranslations: () => (key: string) => key }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', useRouter: () => ({ push: vi.fn() }) }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ register: hooks.register, user: null }) }));
vi.mock('../SliderCaptcha', () => ({ default: 'captcha-stub' }));
import AuthForm from '../AuthForm';

type Node = ReactElement<Record<string, unknown>>;
function find(node: unknown, predicate: (node: Node) => boolean): Node | undefined {
  if (Array.isArray(node)) {
    for (const child of node) { const found = find(child, predicate); if (found) return found; }
  } else if (isValidElement<Record<string, unknown>>(node)) {
    if (predicate(node)) return node;
    return find(node.props.children, predicate);
  }
}
function render() { hooks.index = 0; return AuthForm({}); }

beforeEach(() => {
  hooks.states = [];
  hooks.states[0] = 'register';
  hooks.states[9] = true;
  hooks.states[10] = { token: 'old-proof' };
  hooks.register.mockReset();
});

it('换题清空proof后按钮禁用，直接提交也不会发注册请求；新proof恢复按钮', async () => {
  let tree = render();
  const captcha = find(tree, node => typeof node.props.onVerify === 'function')!;
  const verify = captcha.props.onVerify as (data: { token: string }) => void;
  verify({ token: '' });
  tree = render();
  expect(find(tree, node => node.props.type === 'submit')?.props.disabled).toBe(true);
  const submit = find(tree, node => node.type === 'form')!.props.onSubmit as (event: { preventDefault: () => void }) => Promise<void>;
  await submit({ preventDefault: vi.fn() });
  expect(hooks.register).not.toHaveBeenCalled();
  verify({ token: 'fresh-proof' });
  expect(find(render(), node => node.props.type === 'submit')?.props.disabled).toBe(false);
});

it('注册返回错误后丢弃已消费或过期proof，并重新挂载挑战', async () => {
  hooks.register.mockResolvedValue({ error: 'Registration failed' });
  let tree = render();
  const previousKey = find(tree, node => typeof node.props.onVerify === 'function')!.key;
  const submit = find(tree, node => node.type === 'form')!.props.onSubmit as (event: { preventDefault: () => void }) => Promise<void>;
  await submit({ preventDefault: vi.fn() });
  tree = render();
  expect(find(tree, node => node.props.type === 'submit')?.props.disabled).toBe(true);
  expect(find(tree, node => typeof node.props.onVerify === 'function')!.key).not.toBe(previousKey);
  expect(hooks.register).toHaveBeenCalledOnce();
});
