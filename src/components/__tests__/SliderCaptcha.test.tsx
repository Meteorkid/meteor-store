import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({ states: [] as unknown[], index: 0, effects: [] as Array<() => (() => void) | void> }));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: () => {
    const index = hooks.index++;
    return [hooks.states[index], (value: unknown) => { hooks.states[index] = value; }];
  },
  useRef: (value: unknown) => ({ current: value }),
  useEffect: (effect: () => (() => void) | void) => { hooks.effects.push(effect); },
  useCallback: (callback: unknown) => callback,
}));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
import SliderCaptcha from '../SliderCaptcha';

const fetchMock = vi.fn();
let listeners: Map<string, () => Promise<void>>;
beforeEach(() => {
  hooks.index = 0;
  hooks.effects = [];
  // 模拟用户已拖动旧挑战，运行真实提交事件，不生成或破解验证码。
  hooks.states = ['old-challenge', 55, 100, true, false, false, false, ''];
  listeners = new Map();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.stubGlobal('requestAnimationFrame', vi.fn());
  vi.stubGlobal('document', {
    addEventListener: (name: string, callback: () => Promise<void>) => listeners.set(name, callback),
    removeEventListener: (name: string) => listeners.delete(name),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe('滑块挑战消费后的客户端流程', () => {
  it('失败后清除旧proof并取得新挑战，不能复用已消费题目', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'invalid' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'fresh-challenge', targetY: 60 }) });
    const onVerify = vi.fn();
    SliderCaptcha({ onVerify });
    const cleanup = hooks.effects[1]();
    await listeners.get('mouseup')!();
    expect(fetchMock.mock.calls.map(call => call[0])).toEqual(['/api/captcha/verify', '/api/captcha/challenge']);
    expect(hooks.states[0]).toBe('fresh-challenge');
    expect(hooks.states[2]).toBe(0);
    expect(hooks.states[6]).toBe(false);
    expect(onVerify).toHaveBeenCalledExactlyOnceWith({ token: '' });
    cleanup?.();
  });

  it('成功时交付proof，不额外换题', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ proof: 'one-time-proof' }) });
    const onVerify = vi.fn();
    SliderCaptcha({ onVerify });
    const cleanup = hooks.effects[1]();
    await listeners.get('mouseup')!();
    expect(onVerify).toHaveBeenCalledExactlyOnceWith({ token: 'one-time-proof' });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(hooks.states[4]).toBe(true);
    cleanup?.();
  });
});
