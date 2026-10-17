import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({
  states: [] as unknown[],
  refs: [] as Array<{ current: unknown }>,
  callbacks: [] as Array<{ deps: readonly unknown[]; callback: unknown }>,
  effects: [] as Array<{ deps: readonly unknown[]; cleanup?: () => void }>,
  pending: [] as Array<() => void>,
  stateIndex: 0,
  refIndex: 0,
  callbackIndex: 0,
  effectIndex: 0,
  dirty: false,
  commit: () => {},
}));

// 沿用 Node 环境：替换 hook 调度与 DOM 边界，事件处理和 effect 均执行真实 Header。
// 不模拟浏览器命中测试、焦点与 Next 路由，相关真实交互仍需浏览器复验。
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState: <T,>(initial: T | (() => T)) => {
    const index = hooks.stateIndex++;
    if (!(index in hooks.states)) hooks.states[index] = typeof initial === 'function' ? (initial as () => T)() : initial;
    return [hooks.states[index], (next: T | ((previous: T) => T)) => {
      const value = typeof next === 'function' ? (next as (previous: T) => T)(hooks.states[index] as T) : next;
      if (!Object.is(value, hooks.states[index])) hooks.dirty = true;
      hooks.states[index] = value;
    }];
  },
  useRef: (initial: unknown) => hooks.refs[hooks.refIndex++] ??= { current: initial },
  useCallback: (callback: unknown, deps: readonly unknown[]) => {
    const index = hooks.callbackIndex++;
    const previous = hooks.callbacks[index];
    if (!previous || deps.some((value, position) => !Object.is(value, previous.deps[position]))) {
      hooks.callbacks[index] = { deps, callback };
    }
    return hooks.callbacks[index].callback;
  },
  useEffect: (effect: () => void | (() => void), deps: readonly unknown[]) => {
    const index = hooks.effectIndex++;
    const previous = hooks.effects[index];
    if (!previous || deps.some((value, position) => !Object.is(value, previous.deps[position]))) {
      hooks.pending.push(() => {
        previous?.cleanup?.();
        hooks.effects[index] = { deps, cleanup: effect() || undefined };
      });
    }
  },
}));
vi.mock('react-dom', () => ({ flushSync: (callback: () => void) => { callback(); hooks.commit(); } }));
vi.mock('next-intl', () => ({ useLocale: () => 'zh', useTranslations: () => (key: string) => key }));
vi.mock('@/i18n/navigation', () => ({ usePathname: () => '/daily', Link: () => null }));
vi.mock('../AuthProvider', () => ({ useAuth: () => ({ user: null, logout: vi.fn() }) }));
vi.mock('../UserMenu', () => ({ default: () => null }));
vi.mock('../NotificationBell', () => ({ default: () => null }));
vi.mock('../LanguageSwitcher', () => ({ default: () => null }));
vi.mock('../BrandMark', () => ({ default: () => null }));

import Header from '../Header';

type ElementNode = ReactElement<Record<string, unknown>>;

class PointerTarget extends EventTarget {
  constructor(private readonly link: PointerTarget | null = null) { super(); }
  closest(selector: string) { return selector === 'a[href]' ? this.link : null; }
}

let tree: ElementNode;
let browserWindow: EventTarget;
let body: { style: { overflow: string } };
let closePopovers = vi.fn<(event: Event) => void>();

function renderHeader() {
  let attempts = 0;
  do {
    if (++attempts > 20) throw new Error('Header render did not settle');
    hooks.dirty = false;
    hooks.stateIndex = hooks.refIndex = hooks.callbackIndex = hooks.effectIndex = 0;
    tree = Header();
  } while (hooks.dirty);
  hooks.pending.splice(0).forEach(effect => effect());
  return tree;
}

function findElement(predicate: (props: Record<string, unknown>) => boolean, node: unknown = tree): ElementNode | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findElement(predicate, child ?? null);
      if (found) return found;
    }
  } else if (isValidElement<Record<string, unknown>>(node)) {
    if (predicate(node.props)) return node;
    return findElement(predicate, node.props.children ?? null);
  }
}

function invoke(element: ElementNode | undefined, name: string, event: Record<string, unknown> = {}) {
  expect(element).toBeDefined();
  const handler = element?.props[name] as ((event: Record<string, unknown>) => void) | undefined;
  handler?.(event);
  renderHeader();
}

function utilities() { return findElement(props => typeof props.onPointerDownCapture === 'function'); }
function hamburger() { return findElement(props => props['aria-controls'] === 'header-mobile-panel'); }
function mobilePanel() { return findElement(props => props.id === 'header-mobile-panel'); }
function productGroup() { return findElement(props => typeof props.onPointerEnter === 'function' && typeof props.onPointerLeave === 'function'); }
function productPanel() { return findElement(props => props.id === 'header-panel-products'); }

beforeEach(() => {
  vi.useFakeTimers();
  hooks.states = [];
  hooks.refs = [];
  hooks.callbacks = [];
  hooks.effects = [];
  hooks.pending = [];
  hooks.commit = renderHeader;
  browserWindow = Object.assign(new EventTarget(), {
    scrollY: 0,
    matchMedia: () => Object.assign(new EventTarget(), { matches: true }),
  });
  body = { style: { overflow: 'auto' } };
  closePopovers = vi.fn<(event: Event) => void>();
  browserWindow.addEventListener('header:close-popovers', closePopovers);
  vi.stubGlobal('window', browserWindow);
  vi.stubGlobal('document', Object.assign(new EventTarget(), { body, activeElement: null }));
  vi.stubGlobal('Element', PointerTarget);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => callback(0), 16));
  vi.stubGlobal('cancelAnimationFrame', clearTimeout);
  renderHeader();
  closePopovers.mockClear();
});

afterEach(() => {
  hooks.effects.forEach(effect => effect.cleanup?.());
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Header 导航交接', () => {
  it('手机通知内同路径 query 链接点击后关闭菜单、浮层并恢复滚动', () => {
    invoke(hamburger(), 'onClick', { detail: 1 });
    expect(mobilePanel()).toBeDefined();
    expect(body.style.overflow).toBe('hidden');
    closePopovers.mockClear();

    const dailyLink = Object.assign(new PointerTarget(), { href: '/zh/daily?date=2026-10-17' });
    invoke(utilities(), 'onClickCapture', { target: new PointerTarget(dailyLink) });

    // pathname 始终为 /daily，闭合不能依赖路由变更或 hashchange。
    expect(Boolean(mobilePanel())).toBe(false);
    expect(body.style.overflow).toBe('auto');
    expect(closePopovers).toHaveBeenCalledOnce();
  });

  it('纯悬停打开桌面分组后，搜索打开事件关闭下拉与工具浮层', () => {
    invoke(productGroup(), 'onPointerEnter', { pointerType: 'mouse' });
    vi.advanceTimersByTime(120);
    renderHeader();
    expect(Boolean(productPanel())).toBe(true);
    closePopovers.mockClear();

    browserWindow.dispatchEvent(new CustomEvent('spotlight:open'));
    renderHeader();

    expect(Boolean(productPanel())).toBe(false);
    expect(closePopovers).toHaveBeenCalledOnce();
  });

  it('搜索接管后，先前排队的 hover 不会重新打开桌面分组', () => {
    invoke(productGroup(), 'onPointerEnter', { pointerType: 'mouse' });
    expect(Boolean(productPanel())).toBe(false);

    browserWindow.dispatchEvent(new CustomEvent('spotlight:open'));
    vi.advanceTimersByTime(200);
    renderHeader();

    expect(Boolean(productPanel())).toBe(false);
    expect(closePopovers).toHaveBeenCalledOnce();
  });

  it('工具区内非链接点击仍保留手机菜单，不误触发导航闭合', () => {
    invoke(hamburger(), 'onClick', { detail: 1 });
    closePopovers.mockClear();

    invoke(utilities(), 'onClickCapture', { target: new PointerTarget() });

    expect(Boolean(mobilePanel())).toBe(true);
    expect(body.style.overflow).toBe('hidden');
    expect(closePopovers).not.toHaveBeenCalled();
  });

  it('搜索按钮与快捷键同样先同步释放手机滚动锁，再交给搜索监听器', () => {
    invoke(hamburger(), 'onClick', { detail: 1 });
    closePopovers.mockClear();
    const acceptSearch = vi.fn(() => {
      expect(Boolean(mobilePanel())).toBe(false);
      expect(body.style.overflow).toBe('auto');
    });
    browserWindow.addEventListener('spotlight:open', acceptSearch);

    invoke(findElement(props => props['aria-label'] === 'search'), 'onClick');

    expect(acceptSearch).toHaveBeenCalledOnce();
    expect(closePopovers).toHaveBeenCalledOnce();
  });

  it('卸载 Header 后移除搜索交接监听', () => {
    hooks.effects.splice(0).forEach(effect => effect.cleanup?.());

    browserWindow.dispatchEvent(new CustomEvent('spotlight:open'));

    expect(closePopovers).not.toHaveBeenCalled();
  });
});
