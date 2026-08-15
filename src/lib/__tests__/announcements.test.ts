import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  rows: [] as Array<Record<string, unknown>>,
  inserted: [] as Array<Record<string, unknown>>,
  updated: [] as Array<Record<string, unknown>>,
  deleted: [] as Array<Record<string, unknown>>,
  /** 最近一次 UPDATE ... SET 的字段，用来断言"哪些列真的被写了" */
  setPayload: null as Record<string, unknown> | null,
}));

vi.mock('../db', () => {
  const limitFn = async () => state.rows;
  return {
    db: {
      select: () => ({
        from: () => ({
          where: () => ({ orderBy: () => ({ limit: limitFn }), limit: limitFn }),
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
        set: (payload: Record<string, unknown>) => {
          state.setPayload = payload;
          return { where: () => ({ returning: async () => state.updated }) };
        },
      }),
      delete: () => ({
        where: () => ({ returning: async () => state.deleted }),
      }),
    },
  };
});

import { createAnnouncement, deleteAnnouncement, updateAnnouncement } from '../announcements';
import { pickAnnouncementText } from '../announcement-text';

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
    state.updated = [];
    state.setPayload = null;
  });

  it('显式传 null 时清空字段，而不是回填旧值', async () => {
    state.updated = [{ id: 'A1' }];

    await updateAnnouncement('A1', { titleEn: null, bodyEn: null });

    // 用 `??` 合并会让这两个 null 被当成"没传"，于是清空标题永远不生效
    expect(state.setPayload).toMatchObject({ titleEn: null, bodyEn: null });
  });

  it('未提供的字段不进 SET，保持原值', async () => {
    state.updated = [{ id: 'A1' }];

    await updateAnnouncement('A1', { titleZh: '只改中文' });

    expect(state.setPayload).toHaveProperty('titleZh', '只改中文');
    expect(state.setPayload).not.toHaveProperty('titleEn');
    expect(state.setPayload).not.toHaveProperty('bodyZh');
    expect(state.setPayload).not.toHaveProperty('published');
  });

  it('发布时用 SQL 表达式写 publishedAt，不做先查后写', async () => {
    state.updated = [{ id: 'A2', published: true, publishedAt: '2026-08-02T00:00:00.000Z' }];

    const result = await updateAnnouncement('A2', { published: true });

    // coalesce(published_at, now) —— 首次发布才落时间，已发布的保持原值
    expect(state.setPayload?.publishedAt).toBeTruthy();
    expect(typeof state.setPayload?.publishedAt).not.toBe('string');
    expect(result?.publishedAt).toBeTruthy();
  });

  it('下架时不碰 publishedAt', async () => {
    state.updated = [{ id: 'A3', published: false }];

    await updateAnnouncement('A3', { published: false });

    expect(state.setPayload).toHaveProperty('published', false);
    expect(state.setPayload).not.toHaveProperty('publishedAt');
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

  it('删除成功返回被删除的公告，供审计留标题快照', async () => {
    state.deleted = [{ id: 'A1', titleZh: '标题' }];
    await expect(deleteAnnouncement('A1')).resolves.toMatchObject({ id: 'A1', titleZh: '标题' });
  });

  it('未命中返回 null', async () => {
    await expect(deleteAnnouncement('missing')).resolves.toBeNull();
  });
});
