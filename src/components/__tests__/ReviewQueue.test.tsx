import { isValidElement, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({
  stateIndex: 0,
  setters: Array.from({ length: 4 }, () => vi.fn()),
  refresh: vi.fn(),
  notes: {} as Record<string, string>,
}));
vi.mock('react', async (importOriginal) => ({
  ...await importOriginal<typeof import('react')>(),
  useState: (initial: unknown) => {
    const index = hooks.stateIndex++;
    return [index === 1 ? hooks.notes : initial, hooks.setters[index]];
  },
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: hooks.refresh }) }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

import ReviewQueue, { type ReviewItem } from '../ReviewQueue';

const item: ReviewItem = {
  id: 'P1',
  title: '管理员看到的标题',
  excerpt: '摘要',
  authorName: '作者',
  sectionLabel: '技术',
  tags: [],
  createdAt: '2026-08-10T08:00:00.000Z',
  updatedAt: '2026-08-10T09:00:00.000Z',
  html: '<p>管理员看到的正文</p>',
};

function button(node: unknown, label: string): ReactElement<{ onClick: () => Promise<void> }> | undefined {
  if (Array.isArray(node)) {
    return node.map((child) => button(child, label)).find(Boolean);
  }
  if (!isValidElement<{ children?: unknown; onClick: () => Promise<void> }>(node)) return;
  if (node.type === 'button' && node.props.children === label) return node;
  return button(node.props.children, label);
}

beforeEach(() => {
  vi.clearAllMocks();
  hooks.stateIndex = 0;
  hooks.notes = { P1: '审核意见' };
});
afterEach(() => vi.unstubAllGlobals());

describe('审核请求绑定所见版本', () => {
  it.each([true, false])('approve=%s 发送正文对应的 updatedAt', async (approve) => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetchMock);
    const tree = ReviewQueue({ items: [item] });

    await button(tree, approve ? 'approveAndPublish' : 'reject')!.props.onClick();

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      postId: item.id,
      expectedUpdatedAt: item.updatedAt,
      approve,
      note: '审核意见',
    });
    expect(hooks.refresh).toHaveBeenCalledOnce();
  });

  it('409 提示重新加载，不能把旧决定自动重试到新版', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 409, json: async () => ({ error: 'server conflict' }) });
    vi.stubGlobal('fetch', fetchMock);

    await button(ReviewQueue({ items: [item] }), 'approveAndPublish')!.props.onClick();

    expect(hooks.setters[3]).toHaveBeenLastCalledWith('versionConflict');
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(hooks.refresh).not.toHaveBeenCalled();
  });
});
