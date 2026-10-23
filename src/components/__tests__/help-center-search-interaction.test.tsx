import { isValidElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HelpSearchEntry } from '@/data/help-search';

const hooks = vi.hoisted(() => ({
  states: [] as unknown[],
  refs: [] as Array<{ current: unknown }>,
  stateIndex: 0,
  refIndex: 0,
  dirty: false,
  locale: 'zh',
  push: vi.fn(),
  effects: [] as Array<() => void>,
}));

// Node 环境只替换 hooks 调度和焦点边界，执行组件真实事件；不代替浏览器焦点与命中测试。
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState: <T,>(initial: T) => {
    const index = hooks.stateIndex++;
    if (!(index in hooks.states)) hooks.states[index] = initial;
    return [hooks.states[index], (next: T | ((previous: T) => T)) => {
      const value = typeof next === 'function' ? (next as (previous: T) => T)(hooks.states[index] as T) : next;
      if (!Object.is(value, hooks.states[index])) hooks.dirty = true;
      hooks.states[index] = value;
    }];
  },
  useRef: (initial: unknown) => hooks.refs[hooks.refIndex++] ??= { current: initial },
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => void) => hooks.effects.push(effect),
}));
vi.mock('next-intl', () => ({ useLocale: () => hooks.locale }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', useRouter: () => ({ push: hooks.push }) }));

import HelpCenterSearch from '../help/HelpCenterSearch';

type ElementNode = ReactElement<Record<string, unknown>>;
const entries: HelpSearchEntry[] = [
  { slug: 'start-here', category: 'getting-started', categoryOrder: 1, order: 1, commercial: false, title: '入门指南', excerpt: '帮助使用网站', keywords: '开始', initials: '', fullPinyin: '' },
  { slug: 'account-help', category: 'account', categoryOrder: 2, order: 1, commercial: false, title: '账户帮助', excerpt: '登录与账户指南', keywords: '账户', initials: '', fullPinyin: '' },
];
let tree: ElementNode;
const scrollIntoView = vi.fn();
const listNode = { querySelector: vi.fn(() => ({ scrollIntoView })) };
const inputNode = { focus: vi.fn(), blur: vi.fn() };

function renderSearch() {
  let attempts = 0;
  do {
    if (++attempts > 10) throw new Error('Search render did not settle');
    hooks.dirty = false;
    hooks.stateIndex = hooks.refIndex = 0;
    tree = HelpCenterSearch({ entries, placeholder: '搜索帮助文章', noResults: '没有匹配结果' });
  } while (hooks.dirty);
  const ref = input().props.ref as { current: unknown };
  ref.current = inputNode;
  const listRef = find(props => props.role === 'listbox')?.props.ref as { current: unknown } | undefined;
  if (listRef) listRef.current = listNode;
  hooks.effects.splice(0).forEach(effect => effect());
}

function find(predicate: (props: Record<string, unknown>) => boolean, node: unknown = tree): ElementNode | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = find(predicate, child ?? null);
      if (found) return found;
    }
  } else if (isValidElement<Record<string, unknown>>(node)) {
    if (predicate(node.props)) return node;
    return find(predicate, node.props.children ?? null);
  }
}

function input() { return find(props => props.role === 'combobox')!; }
function emptyMessage() { return find(props => props.children === '没有匹配结果'); }
function invoke(element: ElementNode | undefined, name: string, event: Record<string, unknown> = {}) {
  expect(element).toBeDefined();
  const handler = element?.props[name] as ((event: Record<string, unknown>) => void) | undefined;
  handler?.(event);
  renderSearch();
}
function typeQuery(query: string) { invoke(input(), 'onChange', { target: { value: query } }); }
function keyDown(key: string, target: unknown = inputNode) {
  const preventDefault = vi.fn();
  invoke(find(props => typeof props.onKeyDown === 'function'), 'onKeyDown', { key, target, preventDefault, nativeEvent: { isComposing: false } });
  return preventDefault;
}

beforeEach(() => {
  hooks.states = [];
  hooks.effects = [];
  scrollIntoView.mockClear();
  listNode.querySelector.mockClear();
  hooks.refs = [];
  hooks.locale = 'zh';
  hooks.push.mockClear();
  inputNode.focus.mockClear();
  inputNode.blur.mockClear();
  renderSearch();
});

describe('帮助搜索键盘与空结果恢复', () => {
  it('空结果按 Escape 关闭提示，保留关键词且不移走输入焦点', () => {
    typeQuery('zzzz-no-match');
    expect(emptyMessage()).toBeDefined();

    expect(keyDown('Escape')).toHaveBeenCalledOnce();

    expect(emptyMessage()).toBeUndefined();
    expect(input().props.value).toBe('zzzz-no-match');
    expect(inputNode.blur).not.toHaveBeenCalled();
    expect(hooks.push).not.toHaveBeenCalled();
  });

  it('清空关键词后返回输入框，空提示消失', () => {
    typeQuery('zzzz-no-match');
    invoke(find(props => props.children === '清空关键词'), 'onClick');

    expect(input().props.value).toBe('');
    expect(inputNode.focus).toHaveBeenCalledOnce();
    expect(emptyMessage()).toBeUndefined();
  });

  it.each(['zh', 'en'])('空状态提供现有反馈入口及 %s 操作文案', locale => {
    hooks.locale = locale;
    typeQuery('zzzz-no-match');
    const feedback = find(props => props.href === '/feedback?type=question');
    expect(feedback).toBeDefined();
    expect(feedback?.props.children).toBe(locale === 'zh' ? '提交问题' : 'Submit a question');
    expect(find(props => props.children === (locale === 'zh' ? '清空关键词' : 'Clear keywords'))).toBeDefined();
  });

  it('空状态作为状态信息播报，组合框不引用不存在的列表或选项', () => {
    typeQuery('zzzz-no-match');
    expect(emptyMessage()?.props.role).toBe('status');
    expect(find(props => props.role === 'listbox')).toBeUndefined();
    expect(input().props['aria-controls']).toBeUndefined();
    expect(input().props['aria-activedescendant']).toBeUndefined();
    expect(input().props['aria-describedby']).toBe(emptyMessage()?.props.id);
    expect(input().props['aria-label']).toBe('搜索帮助文章');
    expect(input().props['aria-autocomplete']).toBe('list');
  });

  it('焦点移到空状态操作时保留面板，移出搜索区才关闭', () => {
    typeQuery('zzzz-no-match');
    const contains = vi.fn(() => true);
    const focusTarget = {};
    invoke(find(props => typeof props.onBlur === 'function'), 'onBlur', {
      currentTarget: { contains }, relatedTarget: focusTarget,
    });
    expect(contains).toHaveBeenCalledWith(focusTarget);
    expect(emptyMessage()).toBeDefined();

    contains.mockReturnValue(false);
    invoke(find(props => typeof props.onBlur === 'function'), 'onBlur', {
      currentTarget: { contains }, relatedTarget: null,
    });
    expect(emptyMessage()).toBeUndefined();
  });

  it('空状态操作上的 Escape 也关闭面板并返回输入框', () => {
    typeQuery('zzzz-no-match');
    keyDown('Escape', {});
    expect(emptyMessage()).toBeUndefined();
    expect(inputNode.focus).toHaveBeenCalledOnce();
  });

  it('正常结果仍支持方向键循环、Enter 导航与 Escape 关闭', () => {
    typeQuery('指南');
    expect(input().props['aria-activedescendant']).toBe('help-result-start-here');
    keyDown('ArrowUp');
    expect(input().props['aria-activedescendant']).toBe('help-result-account-help');
    keyDown('ArrowDown');
    expect(input().props['aria-activedescendant']).toBe('help-result-start-here');
    keyDown('Enter');
    expect(hooks.push).toHaveBeenCalledWith('/docs/start-here');
    expect(input().props['aria-expanded']).toBe(false);

    invoke(input(), 'onFocus');
    keyDown('Escape');
    expect(input().props['aria-expanded']).toBe(false);
    expect(inputNode.blur).not.toHaveBeenCalled();
  });

  it('方向键改变活动项时就近滚入列表，不平滑移动整个页面', () => {
    typeQuery('指南');
    scrollIntoView.mockClear();
    keyDown('ArrowDown');
    expect(input().props['aria-activedescendant']).toBe('help-result-account-help');
    expect(listNode.querySelector).toHaveBeenLastCalledWith('[aria-selected="true"]');
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'nearest' });
  });

  it('点击结果继续打开对应帮助文章', () => {
    typeQuery('指南');
    invoke(find(props => props.id === 'help-result-account-help'), 'onMouseDown');
    expect(hooks.push).toHaveBeenCalledWith('/docs/account-help');
    expect(input().props['aria-expanded']).toBe(false);
  });

  it('清空按钮的 Enter 不会触发当前搜索结果导航', () => {
    typeQuery('指南');
    keyDown('Enter', {});
    expect(hooks.push).not.toHaveBeenCalled();
  });

  it('Escape 后无需重新输入，ArrowDown 可以恢复结果选择', () => {
    typeQuery('指南');
    keyDown('Escape');
    keyDown('ArrowDown');
    expect(input().props['aria-expanded']).toBe(true);
    expect(input().props['aria-activedescendant']).toBe('help-result-start-here');
  });

  it('中文输入法确认候选时不触发结果导航', () => {
    typeQuery('指南');
    invoke(find(props => typeof props.onKeyDown === 'function'), 'onKeyDown', {
      key: 'Enter', target: inputNode, preventDefault: vi.fn(), nativeEvent: { isComposing: true },
    });
    expect(hooks.push).not.toHaveBeenCalled();
  });
});
