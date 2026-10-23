import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import zh from '../../../messages/zh.json';
import en from '../../../messages/en.json';
import type { SearchEntry } from '@/lib/search-index';

const hooks = vi.hoisted(() => ({
  states: [] as unknown[], refs: [] as Array<{ current: unknown }>,
  effects: [] as Array<{ deps?: unknown[]; cleanup?: () => void }>,
  pending: new Map<number, () => void | (() => void)>(),
  stateIndex: 0, refIndex: 0, effectIndex: 0, dirty: false, locale: 'en', push: vi.fn(),
}));

// 执行组件的真实渲染和事件逻辑；DOM、网络与调度使用隔离边界，浏览器验收另行执行。
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
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
  useMemo: (factory: () => unknown) => factory(),
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => void | (() => void), deps?: unknown[]) => {
    const index = hooks.effectIndex++;
    const previous = hooks.effects[index];
    if (!previous || !deps || deps.some((value, i) => !Object.is(value, previous.deps?.[i]))) {
      previous?.cleanup?.();
      hooks.effects[index] = { deps };
      hooks.pending.set(index, effect);
    }
  },
}));
vi.mock('next-intl', async original => {
  const intl = await original<typeof import('next-intl')>();
  return {
    ...intl,
    useLocale: () => hooks.locale,
    useTranslations: () => intl.createTranslator({ locale: hooks.locale, messages: hooks.locale === 'zh' ? zh : en, namespace: 'SpotlightSearch' }),
  };
});
vi.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: hooks.push }) }));

import SpotlightSearchPanel from '../SpotlightSearchPanel';

type ElementNode = ReactElement<Record<string, unknown>>;
const inputNode = { focus: vi.fn() };
const listNode = { querySelector: vi.fn(() => ({ scrollIntoView: vi.fn() })) };
const panelNode = { querySelectorAll: () => [inputNode] };
const close = vi.fn();
let tree: ElementNode;
let responseEntries: SearchEntry[];
let storage: Map<string, string>;

function nodes(predicate: (props: Record<string, unknown>) => boolean, node: unknown = tree): ElementNode[] {
  if (Array.isArray(node)) return node.flatMap(child => nodes(predicate, child ?? null));
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [...(predicate(node.props) ? [node] : []), ...nodes(predicate, node.props.children ?? null)];
}
function input() { return nodes(props => props.type === 'text')[0]; }
function options() { return nodes(props => props.role === 'option'); }
function renderSearch() {
  let attempts = 0;
  do {
    if (++attempts > 10) throw new Error('Render did not settle');
    hooks.dirty = false;
    hooks.stateIndex = hooks.refIndex = hooks.effectIndex = 0;
    tree = SpotlightSearchPanel({ onClose: close });
  } while (hooks.dirty);
  (input().props.ref as { current: unknown }).current = inputNode;
  (nodes(props => props.role === 'listbox')[0].props.ref as { current: unknown }).current = listNode;
  (tree.props.ref as { current: unknown }).current = panelNode;
  for (const [index, effect] of hooks.pending) hooks.effects[index].cleanup = effect() || undefined;
  hooks.pending.clear();
}
async function typeQuery(value: string) {
  (input().props.onChange as (e: unknown) => void)({ target: { value } });
  renderSearch();
  await vi.advanceTimersByTimeAsync(200);
  renderSearch();
}
function key(key: string) {
  (tree.props.onKeyDown as (e: unknown) => void)({
    key, target: inputNode, preventDefault: vi.fn(), nativeEvent: { isComposing: false },
  });
  renderSearch();
}
function entry(id: string, group: SearchEntry['group']): SearchEntry {
  return { id, title: id, group, href: `/${id}`, keywords: id, initials: id, fullPinyin: id };
}

beforeEach(() => {
  vi.useFakeTimers();
  hooks.states = []; hooks.refs = []; hooks.effects = []; hooks.pending.clear(); hooks.locale = 'en';
  hooks.push.mockClear(); close.mockClear(); inputNode.focus.mockClear();
  storage = new Map();
  responseEntries = [entry('help', '帮助'), entry('blog', '博客'), entry('page', '页面')];
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
  const documentMock = Object.assign(new EventTarget(), { body: { style: { overflow: '' } }, activeElement: inputNode });
  vi.stubGlobal('document', documentMock);
  vi.stubGlobal('window', { matchMedia: () => ({ matches: false }), location: { origin: 'https://example.test' } });
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ results: responseEntries }) })));
  renderSearch();
});
afterEach(() => {
  hooks.effects.forEach(effect => effect.cleanup?.());
  vi.useRealTimers(); vi.unstubAllGlobals();
});

describe('Spotlight 面板顺序、翻译与焦点关闭契约', () => {
  it('可见分组顺序、data-index 与方向键选择一致', async () => {
    await typeQuery('student');
    expect(options().map(option => option.props['data-index'])).toEqual([0, 1, 2]);
    key('ArrowDown');
    expect(options().map(option => option.props['aria-selected'])).toEqual([false, true, false]);
    key('Enter');
    expect(hooks.push).toHaveBeenCalledWith('/help');
    await vi.advanceTimersByTimeAsync(180);
    expect(close).toHaveBeenCalledWith(false);
  });

  it('Escape 请求恢复触发器，卸载时释放原有滚动样式', async () => {
    expect(document.body.style.overflow).toBe('hidden');
    key('Escape');
    await vi.advanceTimersByTimeAsync(180);
    expect(close).toHaveBeenCalledWith(true);
    hooks.effects.forEach(effect => effect.cleanup?.());
    expect(document.body.style.overflow).toBe('');
  });

  it('历史搜索参与键盘列表，Enter 填入关键词而不会误打开热门页', async () => {
    hooks.states = []; hooks.refs = [];
    storage.set('spotlight:history', JSON.stringify(['masters']));
    renderSearch();
    expect(options().map(option => option.props['data-index'])).toEqual([0, 1, 2, 3, 4, 5]);
    key('Enter');
    expect(input().props.value).toBe('masters');
    expect(hooks.push).not.toHaveBeenCalled();
  });

  it('计算结果可见且占据键盘第一个位置', async () => {
    responseEntries = [];
    await typeQuery('2+3');
    expect(options()).toHaveLength(1);
    expect(options()[0].props['data-index']).toBe(0);
    expect(options()[0].props['aria-selected']).toBe(true);
  });

  it.each(['zh', 'en'])('%s 过滤提示、结果播报和操作文案使用当前语言', async locale => {
    hooks.locale = locale;
    await typeQuery('page: student');
    expect(fetch).toHaveBeenLastCalledWith(`/api/spotlight/search?q=page%3A%20student&locale=${locale}`, expect.any(Object));
    expect(input().props.placeholder).toBe(locale === 'zh' ? '在页面中搜索…' : 'Search Pages…');
    const clear = nodes(props => props.children === (locale === 'zh' ? '清除过滤' : 'Clear filter'));
    expect(clear).toHaveLength(1);
    const announced = nodes(props => props['aria-live'] === 'polite')[0].props.children;
    expect(announced).toBe(locale === 'zh' ? '找到 1 条结果' : '1 result found');
  });

  it('短查询仍使用不透明深色底，信息文字没有低于 white/60 的档位', async () => {
    await typeQuery('a');
    expect(nodes(props => (props.style as { backgroundColor?: string })?.backgroundColor === 'rgb(18, 14, 32)')).toHaveLength(1);
    expect(nodes(props => /text-white\/(?:15|20|25|30|35|40|50)(?!\d)/.test(String(props.className)))).toHaveLength(0);
  });
});
