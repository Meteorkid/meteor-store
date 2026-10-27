import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Effect = { deps?: readonly unknown[]; cleanup?: () => void };
type User = { id: string; email: string; emailVerified: boolean };
const runtime = vi.hoisted(() => ({
  user: { id: 'buyer-a', email: 'buyer-a@localhost.test', emailVerified: true } as User | null,
  states: [] as unknown[], refs: [] as Array<{ current: unknown }>,
  effects: [] as Effect[], layouts: [] as Effect[],
  callbacks: [] as Array<{ deps: readonly unknown[]; value: unknown }>,
  pendingEffects: [] as Array<() => void>, pendingLayouts: [] as Array<() => void>,
  stateIndex: 0, refIndex: 0, effectIndex: 0, layoutIndex: 0, callbackIndex: 0, dirty: false,
  // 仅验证未开放的扫码分支；不会修改或启用实际微信按钮。
  dormantWechatFixture: false,
  qr: vi.fn<(url: string, options: unknown) => Promise<string>>(), toast: vi.fn(),
}));

vi.mock('react', async original => {
  const changed = (next?: readonly unknown[], previous?: readonly unknown[]) =>
    !next || !previous || next.length !== previous.length || next.some((value, index) => !Object.is(value, previous[index]));
  const effect = (layout: boolean, callback: () => void | (() => void), deps?: readonly unknown[]) => {
    const index = layout ? runtime.layoutIndex++ : runtime.effectIndex++;
    const collection = layout ? runtime.layouts : runtime.effects;
    const previous = collection[index];
    if (!previous || changed(deps, previous.deps)) {
      (layout ? runtime.pendingLayouts : runtime.pendingEffects).push(() => {
        previous?.cleanup?.();
        collection[index] = { deps, cleanup: callback() || undefined };
      });
    }
  };
  return {
    ...await original<typeof import('react')>(),
    useState: <T,>(initial: T | (() => T)) => {
      const index = runtime.stateIndex++;
      if (!(index in runtime.states)) {
        const value = typeof initial === 'function' ? (initial as () => T)() : initial;
        runtime.states[index] = value === 'alipay' && runtime.dormantWechatFixture ? 'wechat' : value;
      }
      return [runtime.states[index], (next: T | ((previous: T) => T)) => {
        const value = typeof next === 'function' ? (next as (previous: T) => T)(runtime.states[index] as T) : next;
        if (!Object.is(value, runtime.states[index])) { runtime.states[index] = value; runtime.dirty = true; }
      }];
    },
    useRef: (initial: unknown) => runtime.refs[runtime.refIndex++] ??= { current: initial },
    useEffect: (callback: () => void | (() => void), deps?: readonly unknown[]) => effect(false, callback, deps),
    useLayoutEffect: (callback: () => void | (() => void), deps?: readonly unknown[]) => effect(true, callback, deps),
    useCallback: <T,>(callback: T, deps: readonly unknown[]) => {
      const index = runtime.callbackIndex++;
      if (!runtime.callbacks[index] || changed(deps, runtime.callbacks[index].deps)) {
        runtime.callbacks[index] = { deps, value: callback };
      }
      return runtime.callbacks[index].value;
    },
  };
});
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: runtime.user, loading: false }) }));
vi.mock('next-intl', () => ({ useLocale: () => 'zh', useTranslations: () => (key: string) => key }));
vi.mock('next/image', () => ({ default: 'img' }));
vi.mock('qrcode', () => ({ default: { toDataURL: runtime.qr } }));
vi.mock('../EasterEggs', () => ({ showToast: runtime.toast }));

import PaymentModal from '../PaymentModal';

type Node = ReactElement<Record<string, unknown>>;
const local = 'http://127.0.0.1:4411';
const oldQr = `${local}/mock/qr-a.png`;
let tree: Node | null;
let props: Parameters<typeof PaymentModal>[0];
let navigations: string[];
let listeners: Map<string, (event: unknown) => void>;
let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

const nodes = (node: unknown): Node[] => Array.isArray(node) ? node.flatMap(nodes)
  : isValidElement<Record<string, unknown>>(node) ? [node, ...nodes(node.props.children ?? null)] : [];
const texts = (node: unknown): string[] => Array.isArray(node) ? node.flatMap(texts)
  : isValidElement<Record<string, unknown>>(node) ? texts(node.props.children)
    : typeof node === 'string' ? [node] : [];
const button = (label: string) => {
  const result = nodes(tree).find(node => node.type === 'button' && texts(node).includes(label));
  expect(result, `button ${label}`).toBeDefined();
  return result!;
};
const emailInput = () => nodes(tree).find(node => node.type === 'input' && node.props.type === 'email')!;
const images = () => nodes(tree).filter(node => node.type === 'img').map(node => node.props.src);
const render = () => {
  let attempts = 0;
  do {
    if (++attempts > 12) throw new Error('PaymentModal render did not settle');
    runtime.dirty = false;
    runtime.pendingLayouts = []; runtime.pendingEffects = [];
    runtime.stateIndex = runtime.refIndex = runtime.effectIndex = runtime.layoutIndex = runtime.callbackIndex = 0;
    tree = PaymentModal(props);
  } while (runtime.dirty);
  runtime.pendingLayouts.splice(0).forEach(effect => effect());
  runtime.pendingEffects.splice(0).forEach(effect => effect());
};
const settle = async () => { for (let round = 0; round < 3; round++) { for (let tick = 0; tick < 8; tick++) await Promise.resolve(); render(); } };
const submit = () => {
  const payment = button(runtime.dormantWechatFixture ? 'payWithWechat' : 'payWithAlipay');
  expect(payment.props.disabled).toBe(false);
  void (payment.props.onClick as () => Promise<void>)();
  render();
};
const close = () => {
  const control = nodes(tree).find(node => node.type === 'button' && node.props['aria-label'] === 'closeAriaLabel')!;
  (control.props.onClick as () => void)(); render();
};
const switchToBuyerB = () => { runtime.user = { id: 'buyer-b', email: 'buyer-b@localhost.test', emailVerified: true }; render(); };
const reply = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
};
const submission = (index: number) => JSON.parse(fetchMock.mock.calls[index][1]?.body as string);
const signal = (index: number) => fetchMock.mock.calls[index][1]?.signal as AbortSignal;

beforeEach(() => {
  vi.useFakeTimers();
  runtime.user = { id: 'buyer-a', email: 'buyer-a@localhost.test', emailVerified: true };
  runtime.states = []; runtime.refs = []; runtime.effects = []; runtime.layouts = []; runtime.callbacks = [];
  runtime.pendingEffects = []; runtime.pendingLayouts = []; runtime.dormantWechatFixture = false;
  runtime.qr.mockReset().mockResolvedValue(oldQr); runtime.toast.mockReset();
  navigations = []; listeners = new Map();
  props = { isOpen: true, onClose: vi.fn(() => { props = { ...props, isOpen: false }; }),
    productId: 'xnook', productName: 'XNook', planId: 'pro', planName: '永久', price: 9, basePrice: 9 };
  const location = { get href() { return `${local}/zh/products/xnook`; }, set href(value: string) { navigations.push(value); } };
  vi.stubGlobal('window', { location });
  vi.stubGlobal('navigator', { maxTouchPoints: 0 });
  vi.stubGlobal('document', { body: { style: { overflow: '' } }, activeElement: null,
    addEventListener: (name: string, callback: (event: unknown) => void) => listeners.set(name, callback),
    removeEventListener: (name: string, callback: (event: unknown) => void) => { if (listeners.get(name) === callback) listeners.delete(name); },
  });
  fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error('Unexpected mock payment request'));
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  runtime.layouts.forEach(effect => effect.cleanup?.());
  runtime.effects.forEach(effect => effect.cleanup?.());
  vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals();
});

describe('付款弹窗异步生命周期（全本机模拟，无真实支付）', () => {
  it('关闭后丢弃迟到支付宝地址，即使fetch忽略abort仍不跳转', async () => {
    const payment = deferred<Response>(); fetchMock.mockReturnValueOnce(payment.promise);
    render(); submit(); close();
    expect(signal(0).aborted).toBe(true);
    payment.resolve(reply({ success: true, payUrl: `${local}/mock/pay-a` })); await settle();
    expect(tree).toBeNull(); expect(navigations).toEqual([]); expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('Escape关闭提交中的弹窗后不接受旧付款响应', async () => {
    const payment = deferred<Response>(); fetchMock.mockReturnValueOnce(payment.promise);
    render(); submit(); listeners.get('keydown')!({ key: 'Escape' }); render();
    payment.resolve(reply({ success: true, payUrl: `${local}/mock/escape-old` })); await settle();
    expect(signal(0).aborted).toBe(true); expect(navigations).toEqual([]); expect(tree).toBeNull();
  });

  it('换号后旧payUrl不跳转，新页面显示B账号的只读邮箱', async () => {
    const payment = deferred<Response>(); fetchMock.mockReturnValueOnce(payment.promise);
    render(); submit(); switchToBuyerB();
    payment.resolve(reply({ success: true, payUrl: `${local}/mock/pay-a` })); await settle();
    expect(navigations).toEqual([]); expect(signal(0).aborted).toBe(true);
    expect(emailInput().props).toMatchObject({ value: 'buyer-b@localhost.test', readOnly: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each(['email', 'verification'] as const)('同一账号的%s变化后，不继续旧身份发起的支付跳转', async change => {
    const payment = deferred<Response>(); fetchMock.mockReturnValueOnce(payment.promise);
    render(); submit();
    runtime.user = { id: 'buyer-a', email: change === 'email' ? 'changed@localhost.test' : 'buyer-a@localhost.test',
      emailVerified: change !== 'verification' };
    render();
    payment.resolve(reply({ success: true, payUrl: `${local}/mock/stale-identity` })); await settle();
    expect(navigations).toEqual([]); expect(signal(0).aborted).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('换号后二维码转换的迟到结果不会显示，也不会启动轮询', async () => {
    runtime.dormantWechatFixture = true;
    const qr = deferred<string>(); runtime.qr.mockReturnValueOnce(qr.promise);
    fetchMock.mockResolvedValueOnce(reply({ success: true, codeUrl: `${local}/mock/code-a`, orderId: 'order-a', accessToken: 'mock-token-a' }));
    render(); submit(); await settle(); expect(runtime.qr).toHaveBeenCalledOnce();
    switchToBuyerB(); qr.resolve(oldQr); await settle(); await vi.advanceTimersByTimeAsync(6000); await settle();
    expect(images()).toEqual([]); expect(navigations).toEqual([]); expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each(['close', 'change-account'] as const)('扫码轮询已发出时%s，迟到paid不能跳转或继续轮询', async action => {
    runtime.dormantWechatFixture = true;
    const polling = deferred<Response>();
    fetchMock.mockResolvedValueOnce(reply({ success: true, codeUrl: `${local}/mock/code-a`, orderId: 'order-a', accessToken: 'mock-token-a' }))
      .mockReturnValueOnce(polling.promise);
    render(); submit(); await settle(); expect(images()).toEqual([oldQr]);
    await vi.advanceTimersByTimeAsync(3000); expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe('/api/payment?orderId=order-a&token=mock-token-a');
    if (action === 'close') close(); else switchToBuyerB();
    polling.resolve(reply({ status: 'paid' })); await settle(); await vi.advanceTimersByTimeAsync(9000); await settle();
    expect(navigations).toEqual([]); expect(images()).toEqual([]); expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('B账号重开只在主动点击时提交B邮箱，旧A响应不覆盖B付款', async () => {
    const oldPayment = deferred<Response>();
    fetchMock.mockReturnValueOnce(oldPayment.promise).mockResolvedValueOnce(reply({ success: true, payUrl: `${local}/mock/pay-b` }));
    render(); submit(); close();
    runtime.user = { id: 'buyer-b', email: ' buyer-b@localhost.test ', emailVerified: true };
    props = { ...props, isOpen: true }; render();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    (emailInput().props.onChange as (event: unknown) => void)({ target: { value: 'different@localhost.test' } }); render();
    submit(); await settle();
    expect(submission(0).email).toBe('buyer-a@localhost.test'); expect(submission(1).email).toBe('buyer-b@localhost.test');
    expect(navigations).toEqual([`${local}/mock/pay-b`]);
    oldPayment.resolve(reply({ success: true, payUrl: `${local}/mock/pay-a` })); await settle();
    expect(navigations).toEqual([`${local}/mock/pay-b`]); expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('实际微信入口保持不可选择，点击只提示并继续使用支付宝', async () => {
    render(); const wechat = button('wechat');
    expect(wechat.props['aria-disabled']).toBe('true');
    (wechat.props.onClick as () => void)(); render();
    expect(runtime.toast).toHaveBeenCalledWith('wechatInDevelopment');
    expect(fetchMock).not.toHaveBeenCalled(); expect(runtime.qr).not.toHaveBeenCalled();
    fetchMock.mockResolvedValueOnce(reply({ success: true, payUrl: `${local}/mock/alipay-only` }));
    submit(); await settle(); expect(submission(0).paymentMethod).toBe('alipay');
    expect(navigations).toEqual([`${local}/mock/alipay-only`]);
  });
});
