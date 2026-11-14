import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { VocabularyEntry, VocabularyList } from '@/lib/study/vocabulary-types';

const runtime = vi.hoisted(() => ({
  user: { id: 'user-a' } as { id: string } | null, loading: false,
  states: [] as unknown[], refs: [] as Array<{ current: unknown }>,
  effects: [] as Array<{ deps: unknown[]; cleanup?: () => void }>,
  pendingEffects: [] as Array<() => void>, stateIndex: 0, refIndex: 0, effectIndex: 0, dirty: false,
  refresh: vi.fn(), reload: vi.fn(),
}));
vi.mock('react', async original => ({
  ...await original<typeof import('react')>(),
  useState: <T,>(initial: T | (() => T)) => {
    const index = runtime.stateIndex++;
    if (!(index in runtime.states)) runtime.states[index] = typeof initial === 'function' ? (initial as () => T)() : initial;
    return [runtime.states[index], (next: T | ((previous: T) => T)) => {
      runtime.states[index] = typeof next === 'function' ? (next as (previous: T) => T)(runtime.states[index] as T) : next;
      runtime.dirty = true;
    }];
  },
  useRef: (initial: unknown) => runtime.refs[runtime.refIndex++] ??= { current: initial },
  useId: () => 'vocabulary-search',
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => void | (() => void), deps: unknown[]) => {
    const index = runtime.effectIndex++;
    const previous = runtime.effects[index];
    if (!previous || deps.some((value, at) => !Object.is(value, previous.deps[at]))) {
      runtime.pendingEffects.push(() => {
        previous?.cleanup?.();
        runtime.effects[index] = { deps, cleanup: effect() || undefined };
      });
    }
  },
}));
vi.mock('@/components/AuthProvider', () => ({ useAuth: () => ({ user: runtime.user, loading: runtime.loading }) }));
vi.mock('@/i18n/navigation', () => ({ Link: 'a', useRouter: () => ({ refresh: runtime.refresh }) }));

import VocabularySaveAction from '../VocabularySaveAction';
import VocabularyReviewQueue from '../VocabularyReviewQueue';
import VocabularyManager from '../VocabularyManager';

const entry: VocabularyEntry = {
  id: 'word-a', sourceKey: 'source-a', reviewStage: 0, reviewDueOn: '2026-11-15', reviewIntervalDays: 1,
  lastReviewedOn: null, revision: 3, createdAt: '2026-11-14', updatedAt: '2026-11-14',
  snapshot: { word: 'benefits', lemma: 'benefit', partOfSpeech: 'noun', meaningZh: '益处', usageZh: '复数名词', source: 'lesson', sentence: 'It brings benefits.', sentenceZh: '这带来益处。', pairSlug: 'test-essay', titleZh: '测试范文', titleEn: 'Test essay', side: 'high', segmentIndex: 0 },
};
const list: VocabularyList = { entries: [entry], total: 1, dueCount: 1, nextCursor: null };
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status });

type Node = ReactElement<Record<string, unknown>>;
let tree: Node;
let renderComponent: () => Node;
let mountedKey: string | null | undefined;
let changed = vi.fn<() => void>();
const nodes = (node: unknown = tree): Node[] => Array.isArray(node) ? node.flatMap(nodes)
  : isValidElement<Record<string, unknown>>(node) ? [node, ...nodes(node.props.children ?? null)] : [];
const words = (node: unknown = tree): string => Array.isArray(node) ? node.map(words).join(' ')
  : isValidElement<Record<string, unknown>>(node) ? words(node.props.children ?? null)
    : typeof node === 'string' || typeof node === 'number' ? String(node) : '';
const button = (label: string) => nodes().find(node => node.type === 'button' && words(node) === label)!;
function unmount() {
  runtime.effects.forEach(effect => effect.cleanup?.());
  runtime.states = []; runtime.refs = []; runtime.effects = []; runtime.pendingEffects = [];
}
function render() {
  let iterations = 0;
  do {
    if (++iterations > 12) throw new Error('Render did not settle');
    runtime.dirty = false;
    runtime.stateIndex = runtime.refIndex = runtime.effectIndex = 0;
    const root = renderComponent();
    const key = typeof root.type === 'function' ? root.key : undefined;
    if (key !== mountedKey) { unmount(); mountedKey = key; }
    tree = typeof root.type === 'function' ? (root.type as (props: Record<string, unknown>) => Node)(root.props) : root;
  } while (runtime.dirty);
  runtime.pendingEffects.splice(0).forEach(effect => effect());
}
function click(label: string) {
  const target = button(label);
  expect(target, `Missing button: ${label}`).toBeDefined();
  expect(target.props.disabled).not.toBe(true);
  (target.props.onClick as () => void)();
  render();
}
async function settle() {
  for (let count = 0; count < 15; count++) await Promise.resolve();
  render();
}

beforeEach(() => {
  runtime.user = { id: 'user-a' }; runtime.loading = false;
  unmount(); mountedKey = undefined;
  runtime.refresh.mockClear(); runtime.reload.mockClear();
  const target = new EventTarget(); changed = vi.fn();
  target.addEventListener('study:vocabulary-changed', changed);
  vi.stubGlobal('window', Object.assign(target, { location: { reload: runtime.reload } }));
});
afterEach(() => { unmount(); vi.unstubAllGlobals(); });

describe('查词加入生词本', () => {
  beforeEach(() => {
    renderComponent = () => VocabularySaveAction({ saveToken: 'signed-lookup', sourceKey: 'source-a', returnTo: '/study/ielts/test-essay', locale: 'zh' });
  });

  it('游客只提供保留范文目的地的登录入口，不自动收藏', () => {
    runtime.user = null;
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    render();
    expect(tree.props.href).toBe('/login?next=%2Fstudy%2Fielts%2Ftest-essay');
    expect(words()).toContain('登录后加入生词本');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('只提交签名凭证，成功回读所属账号后才显示已加入并广播变更', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response({ userId: 'user-a', entry: null }))
      .mockResolvedValueOnce(response({ userId: 'user-a', entry, created: true }));
    vi.stubGlobal('fetch', fetchMock);
    render(); await settle();
    click('加入生词本');
    expect(words()).not.toContain('已加入生词本');
    await settle();
    expect(words()).toContain('已加入生词本');
    expect(fetchMock.mock.calls[1]).toEqual(['/api/study/vocabulary', expect.objectContaining({ method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json', 'X-Study-User': 'user-a' }, body: JSON.stringify({ saveToken: 'signed-lookup' }) })]);
    expect(changed).toHaveBeenCalledTimes(1);
    expect(runtime.refresh).toHaveBeenCalledTimes(1);
  });

  it('已收藏只读取状态，不再次保存或重置复习计划', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({ userId: 'user-a', entry }));
    vi.stubGlobal('fetch', fetchMock);
    render(); await settle();
    expect(words()).toContain('已加入生词本');
    expect(button('加入生词本')).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('过期凭证明示重新查词，不把失败显示成已加入', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(response({ userId: 'user-a', entry: null })).mockResolvedValueOnce(response({ error: 'invalid_receipt' }, 400)));
    render(); await settle(); click('加入生词本'); await settle();
    expect(words()).toContain('重新查词');
    expect(words()).not.toContain('已加入生词本');
    expect(changed).not.toHaveBeenCalled();
  });

  it('读取503可重试，返回其他账号数据时须重新加载', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response({}, 503)).mockResolvedValueOnce(response({ userId: 'user-b', entry }));
    vi.stubGlobal('fetch', fetchMock);
    render(); await settle(); click('重试'); await settle();
    expect(words()).toContain('账号或记录已变化');
    expect(words()).not.toContain('已加入生词本');
    expect(button('重新加载')).toBeDefined();
  });

  it('保存A等待时切换到B，不接受A的迟到成功或自动写入B', async () => {
    let resolve!: (value: Response) => void;
    const fetchMock = vi.fn().mockResolvedValueOnce(response({ userId: 'user-a', entry: null }))
      .mockImplementationOnce(() => new Promise<Response>(done => { resolve = done; }))
      .mockResolvedValueOnce(response({ userId: 'user-b', entry: null }));
    vi.stubGlobal('fetch', fetchMock);
    render(); await settle(); click('加入生词本');
    runtime.user = { id: 'user-b' }; render(); await settle();
    resolve(response({ userId: 'user-a', entry })); await settle();
    expect(words()).not.toContain('已加入生词本');
    expect(button('加入生词本')).toBeDefined();
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(changed).not.toHaveBeenCalled();
  });
});

describe('生词复习队列', () => {
  beforeEach(() => { renderComponent = () => VocabularyReviewQueue({ initialEntries: [entry], ownerId: 'user-a', locale: 'zh' }); });

  it('先回想再揭晓，写入携带revision，确认成功后才移出队列', async () => {
    const entries = [entry];
    renderComponent = () => VocabularyReviewQueue({ initialEntries: entries, ownerId: 'user-a', locale: 'zh' });
    let resolve!: (value: Response) => void;
    const fetchMock = vi.fn(() => new Promise<Response>(done => { resolve = done; }));
    vi.stubGlobal('fetch', fetchMock);
    render();
    expect(words()).toContain('It brings benefits.');
    expect(words()).not.toContain('益处');
    expect(button('记得')).toBeUndefined();
    click('查看释义');
    expect(words()).toContain('益处');
    click('记得');
    expect(words()).toContain('benefits');
    expect(fetchMock.mock.calls[0]).toEqual(['/api/study/vocabulary/reviews', expect.objectContaining({ cache: 'no-store', body: JSON.stringify({ id: entry.id, expectedRevision: 3, result: 'remembered' }) })]);
    resolve(response({ userId: 'user-a', entry: { ...entry, revision: 4 } })); await settle();
    expect(words()).toContain('本组复习完成');
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('503保留词卡可重试，409保留记录并要求重新加载', async () => {
    const entries = [entry]; renderComponent = () => VocabularyReviewQueue({ initialEntries: entries, ownerId: 'user-a', locale: 'zh' });
    const fetchMock = vi.fn().mockResolvedValueOnce(response({}, 503)).mockResolvedValueOnce(response({ error: 'review_conflict' }, 409));
    vi.stubGlobal('fetch', fetchMock);
    render(); click('查看释义'); click('忘了'); await settle();
    expect(words()).toContain('benefits'); click('重试'); await settle();
    expect(words()).toContain('账号或记录已变化');
    expect(button('忘了').props.disabled).toBe(true);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ result: 'forgot', expectedRevision: 3 });
    expect(changed).not.toHaveBeenCalled();
  });

  it('账号变化立即隐藏旧词，复习迟到结果不广播成功', async () => {
    const entries = [entry]; renderComponent = () => VocabularyReviewQueue({ initialEntries: entries, ownerId: 'user-a', locale: 'zh' });
    let resolve!: (value: Response) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(done => { resolve = done; })));
    render(); click('查看释义'); click('记得');
    runtime.user = { id: 'user-b' }; render();
    expect(words()).not.toContain('benefits');
    resolve(response({ userId: 'user-a', entry })); await settle();
    expect(words()).not.toContain('本组复习完成');
    expect(changed).not.toHaveBeenCalled();
  });
});

describe('私人生词本列表', () => {
  beforeEach(() => { renderComponent = () => VocabularyManager({ initialData: list, ownerId: 'user-a', locale: 'zh' }); });

  it('初始加载失败明示重试，不显示空收藏', () => {
    renderComponent = () => VocabularyManager({ initialData: null, ownerId: 'user-a', locale: 'zh' });
    render(); expect(words()).toContain('生词本暂时无法读取');
    expect(words()).not.toContain('生词本还是空的');
    expect(button('重试')).toBeDefined();
  });

  it('待复习只显示队列与分页，完整释义和删除入口留在全部生词', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response({ ...list, nextCursor: 'due-next', userId: 'user-a' }))
      .mockResolvedValueOnce(response({ ...list, userId: 'user-a' }));
    vi.stubGlobal('fetch', fetchMock);
    render();
    expect(words()).toContain('益处');
    expect(button('删除')).toBeDefined();
    click('待复习'); await settle(); await settle();
    expect(nodes().find(node => node.type === VocabularyReviewQueue)?.props.initialEntries).toEqual([entry]);
    expect(words()).not.toContain('益处');
    expect(button('删除')).toBeUndefined();
    expect(nodes().some(node => node.type === 'section' && node.props['aria-label'] === '生词列表')).toBe(false);
    expect(button('继续加载')).toBeDefined();
  });

  it('待复习为空时由队列显示空状态，不重复显示列表空状态', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response({ ...list, entries: [], total: 0, dueCount: 0, userId: 'user-a' }))
      .mockResolvedValueOnce(response({ ...list, dueCount: 0, userId: 'user-a' }));
    vi.stubGlobal('fetch', fetchMock);
    render(); click('待复习'); await settle(); await settle();
    expect(nodes().find(node => node.type === VocabularyReviewQueue)?.props.initialEntries).toEqual([]);
    expect(words()).not.toContain('没有符合条件的生词');
    expect(words()).not.toContain('生词本还是空的');
  });

  it('删除须页内确认，失败保留记录与确认操作', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response({}, 503)); vi.stubGlobal('fetch', fetchMock);
    render(); click('删除');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(words()).toContain('删除这条生词和它的复习记录');
    click('确认删除'); await settle();
    expect(words()).toContain('benefits'); expect(words()).toContain('操作未完成');
    expect(button('确认删除')).toBeDefined();
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: 'no-store', headers: { 'Content-Type': 'application/json', 'X-Study-User': 'user-a' } });
  });

  it('搜索在服务器完成，旧查询迟到不会覆盖新结果', async () => {
    let resolveOld!: (value: Response) => void;
    const fetchMock = vi.fn().mockImplementationOnce(() => new Promise<Response>(done => { resolveOld = done; }))
      .mockResolvedValueOnce(response({ ...list, entries: [], total: 0, userId: 'user-a' }))
      .mockResolvedValueOnce(response({ ...list, userId: 'user-a' }));
    vi.stubGlobal('fetch', fetchMock);
    render();
    const search = (value: string) => {
      (nodes().find(node => node.type === 'input')!.props.onChange as (event: unknown) => void)({ target: { value } }); render();
      (nodes().find(node => node.type === 'form')!.props.onSubmit as (event: unknown) => void)({ preventDefault() {} }); render();
    };
    search('old'); search('new'); await settle();
    resolveOld(response({ ...list, userId: 'user-a' })); await settle();
    expect(String(fetchMock.mock.calls[0][0])).toContain('query=old');
    expect(String(fetchMock.mock.calls[1][0])).toContain('query=new');
    expect(words()).not.toContain('benefits');
    expect(words()).toContain('没有符合条件的生词');
    expect((fetchMock.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(true);
  });

  it('分页使用游标并合并条目，账号变化立即隐藏整个旧列表', async () => {
    renderComponent = () => VocabularyManager({ initialData: { ...list, nextCursor: 'cursor-a' }, ownerId: 'user-a', locale: 'zh' });
    const fetchMock = vi.fn().mockResolvedValue(response({ ...list, entries: [{ ...entry, id: 'word-b', snapshot: { ...entry.snapshot, word: 'context' } }], userId: 'user-a' }));
    vi.stubGlobal('fetch', fetchMock);
    render(); click('继续加载'); await settle();
    expect(String(fetchMock.mock.calls[0][0])).toContain('cursor=cursor-a');
    expect(words()).toContain('benefits'); expect(words()).toContain('context');
    runtime.user = { id: 'user-b' }; render();
    expect(words()).not.toContain('benefits'); expect(words()).not.toContain('context');
    expect(words()).toContain('账号或记录已变化');
  });
});
