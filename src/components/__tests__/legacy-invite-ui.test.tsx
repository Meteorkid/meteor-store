import { renderToStaticMarkup } from 'react-dom/server';
import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({ values: [] as unknown[], index: 0 }));
vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return { ...actual, useEffect: () => {}, useRef: (initial: unknown) => ({ current: initial }), useState: (initial: unknown) => {
    const index = hooks.index++;
    if (!(index in hooks.values)) hooks.values[index] = initial;
    return [hooks.values[index], (value: unknown) => { hooks.values[index] = value; }];
  } };
});
vi.mock('next-intl', () => ({ useLocale: () => 'zh', useTranslations: () => (key: string) => ({
  title: '历史邀请码兑换', activationHint: 'MS 软件激活码请在软件设置中使用。', wrongCodeType: '这是软件激活码，请在软件设置中使用。', createdTitle: '已发出的历史邀请码',
} as Record<string, string>)[key] ?? key }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: { id: 'buyer', emailVerified: true }, loading: false }) }));
vi.mock('@/i18n/navigation', () => ({ Link: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a> }));

import InviteCodeManager from '../InviteCodeManager';
import RedeemForm from '../RedeemForm';

function findForm(tree: ReactNode): ReactElement<{ onSubmit: (event: { preventDefault(): void }) => Promise<void> }> | undefined {
  if (Array.isArray(tree)) return tree.map(findForm).find(Boolean);
  if (!isValidElement<{ children?: ReactNode }>(tree)) return undefined;
  if (tree.type === 'form') return tree as ReturnType<typeof findForm>;
  return findForm(tree.props.children);
}

beforeEach(() => { hooks.values = []; hooks.index = 0; vi.stubGlobal('fetch', vi.fn()); });
afterEach(() => vi.unstubAllGlobals());

describe('历史邀请码界面', () => {
  it('后台只展示历史列表及撤销能力，不再渲染新建表单', () => {
    hooks.values = [[{ id: 'legacy', code: 'INV-AAAA-BBBB-CCCC', productId: 'xnook', planName: 'Pro', usedCount: 1, maxUses: 3, status: 'active', memo: null, expiresAt: null }], false, '', ''];
    const html = renderToStaticMarkup(<InviteCodeManager />);
    expect(html).toContain('INV-AAAA-BBBB-CCCC');
    expect(html).toContain('1');
    expect(html).toContain('revoke');
    expect(html).not.toContain('<form');
    expect(html).not.toContain('<select');
    expect(html).not.toContain('generate');
  });

  it('历史兑换页明确提示MS码在软件内使用，即使嵌入时隐藏标题', () => {
    const html = renderToStaticMarkup(<RedeemForm hideHeading />);
    expect(html).toContain('MS 软件激活码请在软件设置中使用。');
    expect(html).toContain('INV-XXXX-XXXX-XXXX');
  });

  it('误填当前软件激活码时提示正确位置，不向旧兑换接口提交', async () => {
    hooks.values = ['MS-AAAA-BBBB-CCCC-DDDD', false, '', null, false];
    const form = findForm(RedeemForm());
    expect(form).toBeDefined();
    await form!.props.onSubmit({ preventDefault() {} });
    expect(fetch).not.toHaveBeenCalled();
    expect(hooks.values[2]).toBe('这是软件激活码，请在软件设置中使用。');
  });

  it('旧INV仍提交到原接口并携带当前账号归属', async () => {
    hooks.values = ['INV-AAAA-BBBB-CCCC', false, '', null, false];
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ userId: 'buyer', success: true, licenseKey: 'MC-SOURCE', productId: 'xnook', productName: { zh: 'XNook', en: 'XNook' }, planName: 'Pro', softwareLicenses: [{ id: 'software', productId: 'xnook', code: 'MS-RESULT' }] }), { status: 200, headers: { 'content-type': 'application/json' } }));
    await findForm(RedeemForm())!.props.onSubmit({ preventDefault() {} });
    expect(fetch).toHaveBeenCalledWith('/api/invite/redeem', expect.objectContaining({ method: 'POST', headers: expect.objectContaining({ 'X-Software-License-User': 'buyer' }), body: JSON.stringify({ code: 'INV-AAAA-BBBB-CCCC' }) }));
    expect(hooks.values[3]).toMatchObject({ userId: 'buyer', softwareLicenses: [{ code: 'MS-RESULT' }] });
  });
});
