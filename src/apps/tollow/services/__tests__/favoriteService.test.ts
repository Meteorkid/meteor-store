import { describe, expect, it, vi } from 'vitest';
import { TollowFavoriteService } from '../favoriteService';

describe('TollowFavoriteService', () => {
  it('列表请求只发送白名单筛选参数', async () => {
    const fetcher = vi.fn(async () => Response.json({ items: [], total: 0, page: 2, limit: 10 }));
    const service = new TollowFavoriteService(fetcher);

    await service.list({
      q: '重要',
      bookId: 'lunyu',
      tag: '哲思',
      sort: 'position',
      page: 2,
      limit: 10,
    });

    expect(fetcher).toHaveBeenCalledWith('/api/tollow/favorites?q=%E9%87%8D%E8%A6%81&bookId=lunyu&tag=%E5%93%B2%E6%80%9D&sort=position&page=2&limit=10');
  });

  it('创建、编辑和删除使用对应方法且不携带 userId', async () => {
    const fetcher = vi.fn(async () => Response.json({ favorite: { id: 'F1' } }));
    const service = new TollowFavoriteService(fetcher);
    const input = {
      bookId: 'lunyu',
      bookTitle: '论语',
      sectionId: 'chapter-01',
      sectionTitle: '學而第一',
      segmentIndex: 0,
      startOffset: 0,
      endOffset: 4,
      quote: '学而时习',
      note: null,
      tags: ['经典'],
    };

    await service.create(input);
    await service.update('F1', { note: '常读常新', tags: ['经典'] });
    await service.remove('F1');

    const calls = fetcher.mock.calls as unknown as Array<[string, RequestInit?]>;
    expect(calls[0]?.[1]).toMatchObject({ method: 'POST' });
    expect(calls[1]?.[0]).toBe('/api/tollow/favorites/F1');
    expect(calls[1]?.[1]).toMatchObject({ method: 'PATCH' });
    expect(calls[2]?.[1]).toMatchObject({ method: 'DELETE' });
    expect(JSON.stringify(fetcher.mock.calls)).not.toContain('userId');
  });

  it('服务端错误转为可展示的错误消息', async () => {
    const service = new TollowFavoriteService(async () => Response.json(
      { error: '收藏不存在' },
      { status: 404 },
    ));

    await expect(service.remove('missing')).rejects.toThrow('收藏不存在');
  });
});
