import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mastersText } from '../text';
import { roundFixture, watchFixture } from './fixtures';

const hooks = vi.hoisted(() => ({
  instance: '', refIndex: 0, effectIndex: 0,
  refs: new Map<string, { current: unknown }>(),
  effects: new Map<string, { deps?: unknown[]; cleanup?: () => void }>(),
  pending: new Map<string, () => void | (() => void)>(),
}));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: (initial: unknown) => [initial, vi.fn()],
  useRef: (initial: unknown) => {
    const key = `${hooks.instance}:${hooks.refIndex++}`;
    if (!hooks.refs.has(key)) hooks.refs.set(key, { current: initial });
    return hooks.refs.get(key);
  },
  useEffect: (effect: () => void | (() => void), deps?: unknown[]) => {
    const key = `${hooks.instance}:${hooks.effectIndex++}`;
    const previous = hooks.effects.get(key);
    if (!previous || !deps || deps.some((value, index) => !Object.is(value, previous.deps?.[index]))) {
      previous?.cleanup?.();
      hooks.effects.set(key, { deps });
      hooks.pending.set(key, effect);
    }
  },
}));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));

import RoundCard from '../RoundCard';

type ElementNode = ReactElement<Record<string, unknown>>;
type CardProps = Parameters<typeof RoundCard>[0];
const save = vi.fn();
const remove = vi.fn();
const progress = { list: { focus: vi.fn(), getClientRects: () => [{}] }, drawer: { focus: vi.fn(), getClientRects: () => [{}] } };
let documentMock: { body: object; activeElement: object };
function nodes(node: unknown, predicate: (element: ElementNode) => boolean): ElementNode[] {
  if (Array.isArray(node)) return node.flatMap(child => nodes(child, predicate));
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [...(predicate(node) ? [node] : []), ...nodes(node.props.children, predicate)];
}
function render(instance: 'list' | 'drawer', overrides: Partial<CardProps> = {}) {
  hooks.instance = instance; hooks.refIndex = hooks.effectIndex = 0;
  const tree = RoundCard({ round: roundFixture(), idPrefix: instance, now: new Date('2026-10-14T04:00:00Z'),
    locale: 'zh', copy: mastersText.zh, signedIn: true, watchesReady: true, busy: false,
    selected: false, selectionFull: false, onSelect: vi.fn(), onSave: save, onRemove: remove, ...overrides });
  const select = nodes(tree, node => node.type === 'select')[0];
  if (select?.props.ref) (select.props.ref as { current: unknown }).current = progress[instance];
  for (const [key, effect] of hooks.pending) hooks.effects.get(key)!.cleanup = effect() || undefined;
  hooks.pending.clear();
  return tree;
}
function follow(tree: ElementNode) {
  (nodes(tree, node => node.type === 'button' && node.props.children === mastersText.zh.watch)[0].props.onClick as () => void)();
}

beforeEach(() => {
  hooks.refs.clear(); hooks.effects.clear(); hooks.pending.clear(); save.mockClear(); remove.mockClear();
  progress.list.focus.mockClear(); progress.drawer.focus.mockClear();
  const body = {};
  documentMock = { body, activeElement: body };
  vi.stubGlobal('document', documentMock);
});
afterEach(() => { vi.unstubAllGlobals(); });

describe('申请卡片保存期间的操作与焦点', () => {
  it.each([{ busy: true, watchesReady: true }, { busy: false, watchesReady: false }])('忙碌或未就绪时阻止重复保存和取消关注：%j', state => {
    const tree = render('drawer', { watch: watchFixture(), ...state });
    const preventDefault = vi.fn();
    (nodes(tree, node => node.type === 'form')[0].props.onSubmit as (event: unknown) => void)({ preventDefault });
    (nodes(tree, node => node.type === 'button' && node.props.children === mastersText.zh.remove)[0].props.onClick as () => void)();
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(save).not.toHaveBeenCalled(); expect(remove).not.toHaveBeenCalled();
  });

  it('关注成功时仅发起动作的抽屉实例接住BODY焦点，常驻列表不抢焦点', () => {
    render('list');
    follow(render('drawer'));
    render('list', { busy: true }); render('drawer', { busy: true });
    const watch = watchFixture();
    render('list', { watch }); render('drawer', { watch });
    expect(save).toHaveBeenCalledOnce();
    expect(progress.list.focus).not.toHaveBeenCalled();
    expect(progress.drawer.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('关注完成时焦点仍在另一控件上，不移动；后续更新也不补抢焦点', () => {
    follow(render('drawer')); render('drawer', { busy: true });
    documentMock.activeElement = {};
    render('drawer', { watch: watchFixture() });
    documentMock.activeElement = documentMock.body;
    render('drawer', { watch: watchFixture() });
    expect(progress.drawer.focus).not.toHaveBeenCalled();
  });

  it('关注失败后清除本实例意图，其他入口后来关注成功也不补抢焦点', () => {
    follow(render('drawer')); render('drawer', { busy: true });
    render('drawer', { error: '保存失败' });
    render('drawer', { watch: watchFixture() });
    expect(progress.drawer.focus).not.toHaveBeenCalled();
  });
});
