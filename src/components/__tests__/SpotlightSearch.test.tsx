import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({
  open: false,
  cleanups: [] as Array<() => void>,
}));

// Node 环境只替换挂载与状态调度，快捷键判断和事件监听均运行真实组件代码。
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState: () => [hooks.open, (next: boolean | ((previous: boolean) => boolean)) => {
    hooks.open = typeof next === 'function' ? next(hooks.open) : next;
  }],
  useCallback: (callback: () => void) => callback,
  useEffect: (effect: () => void | (() => void)) => {
    const cleanup = effect();
    if (cleanup) hooks.cleanups.push(cleanup);
  },
}));

vi.mock('next/dynamic', () => ({ default: () => () => null }));

import SpotlightSearch from '../SpotlightSearch';

let browserWindow: EventTarget;
let openEvents = vi.fn<(event: Event) => void>();

function unmountSearch() {
  hooks.cleanups.splice(0).forEach(cleanup => cleanup());
}

function renderSearch() {
  unmountSearch();
  return SpotlightSearch();
}

function pressKey(
  key: string,
  modifiers: { metaKey?: boolean; ctrlKey?: boolean } = {},
  target = { tagName: 'BUTTON', isContentEditable: false },
) {
  const event = new Event('keydown', { cancelable: true });
  Object.defineProperties(event, {
    key: { value: key },
    metaKey: { value: modifiers.metaKey ?? false },
    ctrlKey: { value: modifiers.ctrlKey ?? false },
    target: { value: target },
  });
  browserWindow.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  hooks.open = false;
  browserWindow = new EventTarget();
  openEvents = vi.fn<(event: Event) => void>();
  browserWindow.addEventListener('spotlight:open', openEvents);
  vi.stubGlobal('window', browserWindow);
  renderSearch();
});

afterEach(() => {
  unmountSearch();
  vi.unstubAllGlobals();
});

describe('Spotlight 搜索快捷键与导航交接', () => {
  it.each([
    { name: '/', key: '/', modifiers: {} },
    { name: 'Meta+K', key: 'k', modifiers: { metaKey: true } },
    { name: 'Ctrl+K', key: 'k', modifiers: { ctrlKey: true } },
  ])('$name 打开时广播一次，让导航有机会释放焦点和滚动锁', ({ key, modifiers }) => {
    const event = pressKey(key, modifiers);

    expect(event.defaultPrevented).toBe(true);
    expect(openEvents).toHaveBeenCalledTimes(1);
    expect(renderSearch()).not.toBeNull();
  });

  it.each([
    { tagName: 'INPUT', isContentEditable: false },
    { tagName: 'TEXTAREA', isContentEditable: false },
    { tagName: 'DIV', isContentEditable: true },
  ])('在 $tagName 编辑区输入 / 不拦截输入，也不打开搜索', target => {
    const event = pressKey('/', {}, target);

    expect(event.defaultPrevented).toBe(false);
    expect(openEvents).not.toHaveBeenCalled();
    expect(renderSearch()).toBeNull();
  });

  it.each([
    { name: 'Meta+K', modifiers: { metaKey: true } },
    { name: 'Ctrl+K', modifiers: { ctrlKey: true } },
  ])('外部打开事件生效后，$name 关闭搜索且不再次广播打开', ({ modifiers }) => {
    browserWindow.dispatchEvent(new CustomEvent('spotlight:open'));
    expect(renderSearch()).not.toBeNull();
    openEvents.mockClear();

    const event = pressKey('k', modifiers);

    expect(event.defaultPrevented).toBe(true);
    expect(openEvents).not.toHaveBeenCalled();
    expect(renderSearch()).toBeNull();
  });

  it('卸载后释放快捷键和打开事件监听', () => {
    unmountSearch();

    const event = pressKey('/');
    expect(event.defaultPrevented).toBe(false);
    expect(openEvents).not.toHaveBeenCalled();

    browserWindow.dispatchEvent(new CustomEvent('spotlight:open'));
    expect(renderSearch()).toBeNull();
  });
});
