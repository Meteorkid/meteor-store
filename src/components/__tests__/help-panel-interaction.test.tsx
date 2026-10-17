import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const panel = vi.hoisted(() => ({
  state: { open: true, slug: 'start-here', width: 720 },
  setWidth: vi.fn(),
}));

// Node 环境替换 hooks 与 DOM 边界，真实执行拖拽事件；实际命中和布局由浏览器验收。
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState: (initial: unknown) => [initial, vi.fn()],
  useRef: (initial: unknown) => ({ current: initial }),
  useCallback: (callback: unknown) => callback,
  useEffect: () => {},
}));
vi.mock('next-intl', () => ({ useLocale: () => 'zh' }));
vi.mock('../help/HelpPanelContext', () => ({
  useHelpPanel: () => ({ state: panel.state, closePanel: vi.fn(), setWidth: panel.setWidth }),
}));

import HelpPanel from '../help/HelpPanel';

type ElementNode = ReactElement<Record<string, unknown>>;
let tree: ElementNode;
let documentTarget: EventTarget & { body: { style: { cursor: string; userSelect: string } } };

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

function startDrag() {
  const handle = find(props => typeof props.onMouseDown === 'function');
  expect(handle).toBeDefined();
  (handle?.props.onMouseDown as (event: { clientX: number }) => void)({ clientX: 100 });
}

function moveTo(clientX: number) {
  documentTarget.dispatchEvent(Object.assign(new Event('mousemove'), { clientX }));
}

beforeEach(() => {
  panel.setWidth.mockClear();
  documentTarget = Object.assign(new EventTarget(), { body: { style: { cursor: '', userSelect: '' } } });
  vi.stubGlobal('document', documentTarget);
  tree = HelpPanel()!;
});

afterEach(() => {
  documentTarget.dispatchEvent(new Event('mouseup'));
  vi.unstubAllGlobals();
});

describe('帮助侧栏宽度拖拽', () => {
  it('保存720px但视口限制到600px时，向右拖50px立即缩到550px', () => {
    const panelElement = find(props => props.role === 'complementary')!;
    const ref = panelElement.props.ref as { current: unknown };
    ref.current = { getBoundingClientRect: () => ({ width: 600 }) };

    startDrag();
    moveTo(150);

    expect(panel.setWidth).toHaveBeenCalledExactlyOnceWith(550);
    documentTarget.dispatchEvent(new Event('mouseup'));
    moveTo(200);
    expect(panel.setWidth).toHaveBeenCalledOnce();
    expect(documentTarget.body.style).toEqual({ cursor: '', userSelect: '' });
  });

  it('尚无面板布局引用时仍回退到保存的宽度', () => {
    startDrag();
    moveTo(150);
    expect(panel.setWidth).toHaveBeenCalledExactlyOnceWith(670);
  });
});
