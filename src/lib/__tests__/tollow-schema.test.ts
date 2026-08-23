import { getTableConfig } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import {
  tollowBookProgress,
  tollowPracticeSessions,
  tollowTextFavorites,
} from '../db/schema';

describe('Tollow 数据表', () => {
  it('阅读进度按用户和书籍保持唯一记录', () => {
    const config = getTableConfig(tollowBookProgress);

    expect(config.name).toBe('tollow_book_progress');
    expect(config.columns.map((column) => column.name)).toEqual([
      'user_id',
      'book_id',
      'section_id',
      'segment_index',
      'offset',
      'updated_at',
    ]);
    expect(config.primaryKeys).toHaveLength(1);
  });

  it('练习会话有幂等键和历史查询索引', () => {
    const config = getTableConfig(tollowPracticeSessions);
    const indexNames = config.indexes.map((index) => index.config.name);

    expect(config.name).toBe('tollow_practice_sessions');
    expect(indexNames).toContain('tollow_sessions_user_client_uniq');
    expect(indexNames).toContain('tollow_sessions_user_started_idx');
  });

  it('文本收藏有用户时间和书籍索引', () => {
    const config = getTableConfig(tollowTextFavorites);
    const indexNames = config.indexes.map((index) => index.config.name);

    expect(config.name).toBe('tollow_text_favorites');
    expect(indexNames).toContain('tollow_favorites_user_updated_idx');
    expect(indexNames).toContain('tollow_favorites_user_book_idx');
    expect(tollowTextFavorites.tags.dataType).toBe('array');
  });
});
