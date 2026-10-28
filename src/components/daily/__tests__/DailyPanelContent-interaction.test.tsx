import { isValidElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultDailyPanelSettings, type DailyPreviewResponse } from '@/lib/daily/panel-types';

const hooks = vi.hoisted(() => ({ values: [] as unknown[], index: 0 }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(), useId: () => 'daily-content-fixture',
  useState: <T,>(initial: T | (() => T)) => {
    const index = hooks.index++;
    if (!(index in hooks.values)) hooks.values[index] = typeof initial === 'function' ? (initial as () => T)() : initial;
    return [hooks.values[index], (next: T | ((previous: T) => T)) => {
      hooks.values[index] = typeof next === 'function' ? (next as (previous: T) => T)(hooks.values[index] as T) : next;
    }];
  },
}));
vi.mock('@/i18n/navigation', () => ({ Link: 'a' }));
vi.mock('@/lib/daily/panel-client', () => ({ useDailyPanel: vi.fn() }));
import { DailyPanelContent } from '../DailyNotificationPanel';

type Node = ReactElement<Record<string, unknown>>;
function find(node: unknown, predicate: (node: Node) => boolean): Node | undefined {
  if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean);
  if (!isValidElement<Record<string, unknown>>(node)) return undefined;
  return predicate(node) ? node : find(node.props.children, predicate);
}
const preview: DailyPreviewResponse = { date: '2026-10-24', updatedAt: null, editions: [{
  channel: 'english', status: 'published', title: 'English', updatedAt: null, totalCount: 1,
  contentDate: '2026-10-23', currentStatus: 'failed', content: { kind: 'english', vocabulary: [{ term: 'adapt', meaning: '适应', example: 'We adapt.', translation: '我们会适应。' }] },
}] };
function render() {
  hooks.index = 0;
  return DailyPanelContent({ preview, settings: defaultDailyPanelSettings(['english']), locale: 'zh' });
}
beforeEach(() => { hooks.values = []; hooks.index = 0; });

describe('日刊预览栏目折叠', () => {
  it('按栏目折叠隐藏正文和链接，仍保留失败与真实期次；再次展开恢复原内容', () => {
    let tree = render();
    const toggle = find(tree, node => node.type === 'button' && node.props['aria-controls'] === 'daily-content-fixture-english')!;
    expect(toggle.props['aria-expanded']).toBe(true);
    (toggle.props.onClick as () => void)();
    tree = render();
    expect(find(tree, node => node.props.id === 'daily-content-fixture-english')?.props.hidden).toBe(true);
    expect(find(tree, node => node.type === 'button')?.props['aria-expanded']).toBe(false);
    expect(find(tree, node => node.type === 'time')?.props.dateTime).toBe('2026-10-23');
    const status = find(tree, node => node.type === 'p' && Array.isArray(node.props.children) && node.props.children.includes('本期内容获取失败。'));
    expect(status).toBeDefined();
    (find(tree, node => node.type === 'button')!.props.onClick as () => void)();
    expect(find(render(), node => node.props.id === 'daily-content-fixture-english')?.props.hidden).toBe(false);
  });
});
