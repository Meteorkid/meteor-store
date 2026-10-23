import { isValidElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultDailyPanelSettings, type DailyPanelSettings as Settings } from '@/lib/daily/panel-types';

const hooks = vi.hoisted(() => ({ states: [] as unknown[], index: 0 }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useId: () => 'settings-fixture',
  useState: <T,>(initial: T) => {
    const index = hooks.index++;
    if (!(index in hooks.states)) hooks.states[index] = initial;
    return [hooks.states[index], (next: T | ((previous: T) => T)) => {
      hooks.states[index] = typeof next === 'function' ? (next as (previous: T) => T)(hooks.states[index] as T) : next;
    }];
  },
}));
import DailyPanelSettings from '../DailyPanelSettings';

type Node = ReactElement<Record<string, unknown>>;
const save = vi.fn(async () => true);
const cancel = vi.fn();
const reload = vi.fn();
let settings: Settings;
function render(error: string | null = null, saving = false) {
  hooks.index = 0;
  return DailyPanelSettings({ locale: 'zh', userId: 'user-a', settings, defaultSettings: defaultDailyPanelSettings(['english', 'papers']),
    saving, error, onSave: save, onCancel: cancel, onReload: reload });
}
function find(node: unknown, predicate: (node: Node) => boolean): Node | undefined {
  if (Array.isArray(node)) return node.map(child => find(child, predicate)).find(Boolean);
  if (!isValidElement<Record<string, unknown>>(node)) return undefined;
  return predicate(node) ? node : find(node.props.children, predicate);
}
function click(tree: Node, label: string) {
  const node = find(tree, node => node.type === 'button' && (node.props.children === label || node.props['aria-label'] === label));
  expect(node).toBeDefined();
  (node!.props.onClick as () => void)();
}
function submit(tree: Node) { (tree.props.onSubmit as (event: unknown) => void)({ preventDefault: vi.fn() }); }

beforeEach(() => { hooks.states = []; hooks.index = 0; save.mockClear(); cancel.mockClear(); reload.mockClear(); settings = defaultDailyPanelSettings(['english', 'papers']); });
describe('面板自定义草稿事件', () => {
  it('栏目排序和每栏条数在保存时一起提交', () => {
    click(render(), '上移 每日论文');
    const tree = render();
    const count = find(tree, node => node.type === 'select' && node.props['aria-label'] === '每日英语 · 条数')!;
    (count.props.onChange as (event: unknown) => void)({ target: { value: '5' } });
    submit(render());
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ channels: ['papers', 'english'], itemCounts: expect.objectContaining({ english: 5 }) }));
  });

  it('取消不会保存，错误后重绘保留当前草稿', () => {
    click(render(), '上移 每日论文');
    click(render('failed'), '取消');
    expect(cancel).toHaveBeenCalledOnce();
    expect(save).not.toHaveBeenCalled();
    submit(render('failed'));
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ channels: ['papers', 'english'] }));
  });

  it('恢复默认保存null以继续继承关注，之后再改字段会保存显式设置', () => {
    click(render(), '恢复默认');
    submit(render());
    expect(save).toHaveBeenLastCalledWith(null);
    click(render(), '上移 每日论文');
    submit(render());
    expect(save).toHaveBeenLastCalledWith(expect.objectContaining({ channels: ['papers', 'english'] }));
  });

  it('全关不会自动复活成全选，开源条数锁定1', () => {
    settings = defaultDailyPanelSettings([]);
    const tree = render();
    const count = find(tree, node => node.type === 'select' && node.props['aria-label'] === '每日开源项目 · 条数')!;
    expect(count.props.disabled).toBe(true);
    expect(count.props.value).toBe(1);
    submit(tree);
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ channels: [] }));
  });

  it.each(['conflict', 'changed', 'login'])('%s 阻止保存并提供显式重新加载', error => {
    const tree = render(error);
    submit(tree);
    expect(save).not.toHaveBeenCalled();
    click(tree, '重新加载已保存设置');
    expect(reload).toHaveBeenCalledOnce();
  });

  it('保存中保留提交按钮焦点并阻止重复保存，避免原生disabled让外层铃铛失焦关闭', () => {
    const tree = render(null, true);
    const button = find(tree, node => node.props.type === 'submit')!;
    expect(button.props['aria-disabled']).toBe(true);
    expect(button.props.disabled).toBeUndefined();
    submit(tree);
    expect(save).not.toHaveBeenCalled();
  });
});
