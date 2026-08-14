import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  rows: [] as Array<Record<string, unknown>>,
  existing: [] as Array<Record<string, unknown>>,
  inserted: [] as Array<Record<string, unknown>>,
  updated: [] as Array<Record<string, unknown>>,
  deleted: [] as Array<Record<string, unknown>>,
}));

vi.mock('../db', () => {
  const limitFn = async () => state.rows;
  return {
    db: {
      select: () => ({
        from: () => ({
          where: () => ({ orderBy: () => ({ limit: limitFn }), limit: async () => state.existing }),
          orderBy: () => ({ limit: limitFn }),
          limit: limitFn,
        }),
      }),
      insert: () => ({
        values: (row: Record<string, unknown>) => {
          state.inserted.push(row);
          return { returning: async () => [row] };
        },
      }),
      update: () => ({
        set: () => ({
          where: () => ({ returning: async () => state.updated }),
        }),
      }),
      delete: () => ({
        where: () => ({ returning: async () => state.deleted }),
      }),
    },
  };
});

import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  pickAnnouncementText,
} from '../announcements';

describe('pickAnnouncementText', () => {
  it('zh 优先取中文，缺失时回退英文', () => {
    expect(pickAnnouncementText('中文', 'English', 'zh')).toBe('中文');
    expect(pickAnnouncementText(null, 'English', 'zh')).toBe('English');
  });

  it('en 优先取英文，缺失时回退中文', () => {
    expect(pickAnnouncementText('中文', 'English', 'en')).toBe('English');
    expect(pickAnnouncementText('中文', null, 'en')).toBe('中文');
  });

  it('两种语言都缺失时返回空串', () => {
    expect(pickAnnouncementText(null, null, 'zh')).toBe('');
    expect(pickAnnouncementText(undefined, undefined, 'en')).toBe('');
  });
});

describe('createAnnouncement', () => {
  beforeEach(() => {
    state.inserted = [];
  });

  it('发布时写入 publishedAt', async () => {
    const result = await createAnnouncement({
      titleZh: '标题',
      published: true,
    });
    expect(result.published).toBe(true);
    expect(result.publishedAt).toBeTruthy();
  });

  it('未发布时 publishedAt 为 null', async () => {
    const result = await createAnnouncement({
      titleZh: '草稿',
      published: false,
    });
    expect(result.published).toBe(false);
    expect(result.publishedAt).toBeNull();
  });
});

describe('updateAnnouncement', () => {
  beforeEach(() => {
    state.existing = [];
    state.updated = [];
  });

  it('已发布公告重新发布时保留原发布时间', async () => {
    const original = '2026-08-01T00:00:00.000Z';
    state.existing = [{ id: 'A1', published: true, publishedAt: original }];
    state.updated = [{ id: 'A1', published: true, publishedAt: original, updatedAt: 'x' }];

    const result = await updateAnnouncement('A1', { published: true });
    expect(result?.publishedAt).toBe(original);
  });

  it('草稿首次发布时写入 publishedAt', async () => {
    state.existing = [{ id: 'A2', published: false, publishedAt: null }];
    state.updated = [{ id: 'A2', published: true, publishedAt: '2026-08-02T00:00:00.000Z' }];

    const result = await updateAnnouncement('A2', { published: true });
    expect(result?.publishedAt).toBeTruthy();
  });

  it('公告不存在时返回 null', async () => {
    const result = await updateAnnouncement('missing', {});
    expect(result).toBeNull();
  });
});

describe('deleteAnnouncement', () => {
  beforeEach(() => {
    state.deleted = [];
  });

  it('删除成功返回 true', async () => {
    state.deleted = [{ id: 'A1' }];
    await expect(deleteAnnouncement('A1')).resolves.toBe(true);
  });

  it('未命中返回 false', async () => {
    await expect(deleteAnnouncement('missing')).resolves.toBe(false);
  });
});
