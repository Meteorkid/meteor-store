import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  session: null as null | { userId: string },
  listCalls: [] as Array<Record<string, unknown>>,
  createCalls: [] as Array<Record<string, unknown>>,
  updateCalls: [] as Array<Record<string, unknown>>,
  deleteCalls: [] as Array<Record<string, unknown>>,
  notFound: false,
}));

vi.mock('@/lib/auth', () => ({ getSession: async () => state.session }));
vi.mock('@/lib/rate-limit', () => ({
  getClientIp: () => '203.0.113.8',
  rateLimit: async () => ({ limited: false }),
}));
vi.mock('@/lib/tollow', () => {
  class TollowNotFoundError extends Error {}
  return {
    TollowNotFoundError,
    listTollowFavorites: async (userId: string, query: Record<string, unknown>) => {
      state.listCalls.push({ userId, query });
      return { items: [], total: 0, ...query };
    },
    createTollowFavorite: async (userId: string, input: Record<string, unknown>) => {
      state.createCalls.push({ userId, input });
      return { id: 'F1', ...input };
    },
    updateTollowFavorite: async (userId: string, id: string, input: Record<string, unknown>) => {
      state.updateCalls.push({ userId, id, input });
      if (state.notFound) throw new TollowNotFoundError('收藏不存在');
      return { id, ...input };
    },
    deleteTollowFavorite: async (userId: string, id: string) => {
      state.deleteCalls.push({ userId, id });
      if (state.notFound) throw new TollowNotFoundError('收藏不存在');
    },
  };
});

import { GET, POST } from '../favorites/route';
import { DELETE, PATCH } from '../favorites/[id]/route';

const validFavorite = {
  bookId: 'the-little-prince',
  bookTitle: '小王子',
  sectionId: 'chapter-one',
  sectionTitle: '第一章',
  segmentIndex: 0,
  startOffset: 0,
  endOffset: 4,
  quote: '重要的文字',
  note: null,
  tags: ['哲思'],
};

describe('/api/tollow/favorites', () => {
  beforeEach(() => {
    state.session = { userId: 'U1' };
    state.listCalls.length = 0;
    state.createCalls.length = 0;
    state.updateCalls.length = 0;
    state.deleteCalls.length = 0;
    state.notFound = false;
  });

  it('列表支持搜索、筛选、排序和分页白名单', async () => {
    const req = new NextRequest('http://localhost/api/tollow/favorites?q=重要&bookId=the-little-prince&tag=哲思&sort=position&page=2&limit=10');
    expect((await GET(req)).status).toBe(200);
    expect(state.listCalls[0]!).toEqual({
      userId: 'U1',
      query: { q: '重要', bookId: 'the-little-prince', tag: '哲思', sort: 'position', page: 2, limit: 10 },
    });
    expect((await GET(new NextRequest('http://localhost/api/tollow/favorites?sort=random'))).status).toBe(400);
  });

  it('创建时拒绝客户端所有者并使用当前用户', async () => {
    expect((await POST(new NextRequest('http://localhost/api/tollow/favorites', {
      method: 'POST', body: JSON.stringify({ ...validFavorite, userId: 'U2' }),
    }))).status).toBe(400);

    expect((await POST(new NextRequest('http://localhost/api/tollow/favorites', {
      method: 'POST', body: JSON.stringify(validFavorite),
    }))).status).toBe(201);
    expect(state.createCalls[0]!).toEqual({ userId: 'U1', input: validFavorite });
  });

  it('更新只允许笔记和标签，删除与更新都绑定当前用户', async () => {
    const context = { params: Promise.resolve({ id: 'F1' }) };
    expect((await PATCH(new NextRequest('http://localhost/api/tollow/favorites/F1', {
      method: 'PATCH', body: JSON.stringify({ quote: '篡改来源' }),
    }), context)).status).toBe(400);

    expect((await PATCH(new NextRequest('http://localhost/api/tollow/favorites/F1', {
      method: 'PATCH', body: JSON.stringify({ note: '新笔记', tags: ['重点'] }),
    }), context)).status).toBe(200);
    expect(state.updateCalls[0]!).toEqual({ userId: 'U1', id: 'F1', input: { note: '新笔记', tags: ['重点'] } });

    expect((await DELETE(new NextRequest('http://localhost/api/tollow/favorites/F1'), context)).status).toBe(204);
    expect(state.deleteCalls[0]!).toEqual({ userId: 'U1', id: 'F1' });
  });

  it('其他用户不可见的收藏统一返回 404', async () => {
    state.notFound = true;
    const response = await PATCH(new NextRequest('http://localhost/api/tollow/favorites/F2', {
      method: 'PATCH', body: JSON.stringify({ note: 'x' }),
    }), { params: Promise.resolve({ id: 'F2' }) });
    expect(response.status).toBe(404);
  });
});
