import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AdmissionsKind } from '@/lib/admissions/config';
import { roundFixture } from '@/components/masters/__tests__/fixtures';

const hooks = vi.hoisted(() => ({ states: [] as unknown[], index: 0 }));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: (initial: unknown) => {
    const index = hooks.index++;
    if (hooks.states.length <= index) hooks.states[index] = initial;
    return [hooks.states[index], (value: unknown) => { hooks.states[index] = typeof value === 'function' ? value(hooks.states[index]) : value; }];
  },
  useRef: () => ({ current: null }), useEffect: () => {},
}));
vi.mock('next-intl', () => ({ useLocale: () => 'zh' }));
import MastersManager from '../MastersManager';

type Node = ReactElement<Record<string, unknown>>;
function nodes(tree: unknown, match: (node: Node) => boolean): Node[] {
  if (Array.isArray(tree)) return tree.flatMap(child => nodes(child, match));
  if (!isValidElement<Record<string, unknown>>(tree)) return [];
  return [...(match(tree) ? [tree] : []), ...nodes(tree.props.children, match)];
}
const base = roundFixture();
const round = { ...base, details: { ...base.details, programme: 'PhD Computer Science', studyType: 'research' as const } };
function render(kind?: AdmissionsKind) {
  hooks.index = 0;
  const wrapper = MastersManager({ initialYear: 2027, initialRounds: [round], kind });
  return (wrapper.type as (props: unknown) => Node)(wrapper.props);
}
function click(tree: Node, label: string) {
  const button = nodes(tree, node => node.type === 'button' && node.props.children === label)[0];
  return (button.props.onClick as () => unknown)();
}
const fetchMock = vi.fn();
beforeEach(() => { hooks.states = []; fetchMock.mockReset(); vi.stubGlobal('fetch', fetchMock); });
afterEach(() => vi.unstubAllGlobals());

describe('硕博共用管理表单', () => {
  it.each([['phd', 'research'], [undefined, 'taught']] as const)('%s新建默认培养类型为%s，博士不提供授课型', (kind, expected) => {
    click(render(kind), '新增申请轮次');
    const select = nodes(render(kind), node => node.props.label === '培养类型')[0];
    expect(select.props.value).toBe(expected);
    expect((select.props.options as string[][]).map(option => option[0])).toEqual(kind === 'phd' ? ['research'] : ['taught', 'research']);
  });

  it.each(['phd', 'masters'] as const)('%s导入与列表刷新使用相同学位的后台接口', async kind => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ created: 2 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rounds: [round] }) });
    await click(render(kind), '导入首批官方草稿');
    expect(fetchMock).toHaveBeenNthCalledWith(1, `/api/admin/${kind}`, expect.objectContaining({ method: 'POST', body: JSON.stringify({ action: 'import' }) }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, `/api/admin/${kind}?year=2027`, { cache: 'no-store' });
  });

  it('博士更正保留乐观并发版本，仅提交到博士后台', async () => {
    click(render('phd'), '编辑 / 预览');
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ round }) });
    const editor = nodes(render('phd'), node => node.type === 'form').at(-1)!;
    await (editor.props.onSubmit as (event: unknown) => Promise<void>)({ preventDefault: vi.fn(), nativeEvent: { submitter: { getAttribute: () => 'save' } } });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe('/api/admin/phd');
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.input.expectedUpdatedAt).toBe(round.updatedAt);
    expect(body.input.details.studyType).toBe('research');
    expect(body.action).toBe('save');
  });
});
