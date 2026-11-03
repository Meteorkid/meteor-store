import type { MouseEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));
vi.mock('next/link', () => ({ default: 'a' }));

import TransitionLink from '../TransitionLink';

function clickEvent(overrides: Partial<MouseEvent<HTMLAnchorElement>> = {}) {
  const event = {
    defaultPrevented: false,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    preventDefault: vi.fn(() => { event.defaultPrevented = true; }),
    ...overrides,
  };
  return event as unknown as MouseEvent<HTMLAnchorElement>;
}

beforeEach(() => { router.push.mockReset(); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('TransitionLink 视觉过渡取消', () => {
  it.each(['InvalidStateError', 'AbortError'])('%s 取消 ready 时仍跳转，且不产生未处理拒绝', async (name) => {
    const ready = Promise.reject(new DOMException(
      'Transition was aborted because of invalid state. Viewport size changed',
      name,
    ));
    vi.stubGlobal('document', {
      startViewTransition: (callback: () => void) => {
        callback();
        return { ready };
      },
    });
    const unhandled: unknown[] = [];
    const onUnhandled = (error: unknown) => { unhandled.push(error); };
    process.on('unhandledRejection', onUnhandled);

    try {
      const link = TransitionLink({ href: '/en/products/duocast' });
      link.props.onClick(clickEvent());
      await new Promise<void>(resolve => setImmediate(resolve));

      expect(link.props.href).toBe('/en/products/duocast');
      expect(router.push).toHaveBeenCalledExactlyOnceWith('/en/products/duocast');
      expect(unhandled).toEqual([]);
    } finally {
      process.off('unhandledRejection', onUnhandled);
      // 失败复现时也清理本测试的拒绝，避免污染后续用例。
      await ready.catch(() => {});
    }
  });

  it('非预期 ready 错误仍以原始错误拒绝', async () => {
    const error = new Error('Unexpected transition failure');
    const ready = Promise.reject(error);
    // 观察浏览器 promise 边界的拒绝结果，避免测试自身泄漏预期错误。
    const catchReady = vi.spyOn(ready, 'catch');
    vi.stubGlobal('document', { startViewTransition: (callback: () => void) => { callback(); return { ready }; } });

    TransitionLink({ href: '/en/products/duocast' }).props.onClick(clickEvent());

    await expect(catchReady.mock.results[0].value).rejects.toBe(error);
    expect(router.push).toHaveBeenCalledOnce();
  });

  it.each(['Error', 'AbortError', 'InvalidStateError'])('路由回调抛出的 %s 不被链接吞掉', (name) => {
    const error = name === 'Error' ? new Error('Route failed') : new DOMException('Route failed', name);
    router.push.mockImplementation(() => { throw error; });
    vi.stubGlobal('document', { startViewTransition: (callback: () => void) => { callback(); return { ready: Promise.resolve() }; } });

    expect(() => TransitionLink({ href: '/en/products/duocast' }).props.onClick(clickEvent())).toThrow(error);
    expect(router.push).toHaveBeenCalledOnce();
  });
});

describe('TransitionLink 原有导航行为', () => {
  it.each(['/zh/products/duocast', '/en/products/duocast'])('正常过渡保留 href 与语言：%s', (href) => {
    const startViewTransition = vi.fn((callback: () => void) => { callback(); return { ready: Promise.resolve() }; });
    vi.stubGlobal('document', { startViewTransition });
    const onClick = vi.fn();
    const event = clickEvent();
    const link = TransitionLink({ href, onClick });

    link.props.onClick(event);

    expect(link.props.href).toBe(href);
    expect(onClick).toHaveBeenCalledExactlyOnceWith(event);
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(router.push).toHaveBeenCalledExactlyOnceWith(href);
  });

  it.each(['metaKey', 'ctrlKey', 'shiftKey'] as const)('%s 点击继续由原生链接处理', (modifier) => {
    const startViewTransition = vi.fn();
    vi.stubGlobal('document', { startViewTransition });
    const event = clickEvent({ [modifier]: true });

    TransitionLink({ href: '/en/products/duocast' }).props.onClick(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(startViewTransition).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('尊重调用方 onClick 取消导航', () => {
    const startViewTransition = vi.fn();
    vi.stubGlobal('document', { startViewTransition });
    const event = clickEvent();

    TransitionLink({ href: '/en/products/duocast', onClick: (click) => click.preventDefault() }).props.onClick(event);

    expect(event.defaultPrevented).toBe(true);
    expect(startViewTransition).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('不支持 View Transition 时保留 Next Link 的默认导航', () => {
    vi.stubGlobal('document', {});
    const event = clickEvent();
    const link = TransitionLink({ href: '/en/products/duocast' });

    link.props.onClick(event);

    expect(link.props.href).toBe('/en/products/duocast');
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });
});
