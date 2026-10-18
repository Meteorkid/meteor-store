import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getPendingPosts: vi.fn(),
  queue: vi.fn(() => null),
  markdownToHtml: vi.fn((content: string) => `<p>${content}</p>`),
}));
vi.mock('@/lib/admin-session', () => ({ getAdminPageSession: async () => ({ userId: 'admin' }) }));
vi.mock('@/lib/admin', () => ({ isAdminSession: () => true }));
vi.mock('@/lib/posts', () => ({ getPendingPosts: mocks.getPendingPosts }));
vi.mock('@/lib/markdown', () => ({ markdownToHtml: mocks.markdownToHtml }));
vi.mock('@/components/ReviewQueue', () => ({ default: mocks.queue }));
vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: vi.fn(),
}));

import ReviewPage from '../page';

describe('审核队列页面', () => {
  it('把同一次取数的正文和 updatedAt 一起交给审核组件', async () => {
    mocks.getPendingPosts.mockResolvedValue([{
      id: 'P1', title: '原稿标题', excerpt: '原稿摘要', authorName: '作者',
      sectionId: 'tech', tags: ['原稿'], content: '原稿正文',
      createdAt: '2026-08-10T08:00:00.000Z', updatedAt: '2026-08-10T09:00:00.000Z',
    }]);

    renderToStaticMarkup(await ReviewPage({ params: Promise.resolve({ locale: 'zh' }) }));

    expect(mocks.getPendingPosts).toHaveBeenCalledOnce();
    expect(mocks.queue).toHaveBeenCalledWith(expect.objectContaining({
      items: [expect.objectContaining({
        id: 'P1', html: '<p>原稿正文</p>', updatedAt: '2026-08-10T09:00:00.000Z',
      })],
    }), undefined);
  });
});
