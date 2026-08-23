import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  blogImages,
  personalAccessTokens,
  postSections,
  posts,
  tollowBookProgress,
  tollowPracticeSessions,
  tollowTextFavorites,
  users,
} from '../db/schema';

let accountRows = [{
  id: 'U1',
  email: 'user@example.com',
  name: 'User',
  avatarUrl: null,
  bio: null,
  emailVerified: true,
  isStudent: false,
  studentEmail: null,
  studentVerifiedAt: null,
  tokenVersion: 3,
  blogImageBytes: 3072,
  createdAt: '2026-08-10T00:00:00.000Z',
}];

const tokenRows = [
  {
    name: 'Codex',
    tokenPrefix: 'msb_abc123',
    scopes: ['blog:read', 'blog:write'],
    tokenVersion: 3,
    expiresAt: '2099-11-08T00:00:00.000Z',
    lastUsedAt: '2026-08-10T00:00:00.000Z',
    revokedAt: null,
    createdAt: '2026-08-10T00:00:00.000Z',
    tokenHash: 'must-not-export',
  },
];

const postRows = [{
  id: 'P1',
  title: '文章',
  excerpt: '摘要',
  content: '正文',
  sectionId: 'tech',
  status: 'draft',
  reviewNote: null,
  reviewedAt: null,
  eventDate: '2026-08-10',
  publishedAt: null,
  createdAt: '2026-08-10T00:00:00.000Z',
  updatedAt: '2026-08-10T00:00:00.000Z',
}];

const sectionRows = [
  { postId: 'P1', sectionId: 'tech' },
  { postId: 'P1', sectionId: 'story' },
];

const imageRows = [{
  objectKey: `blog/U1/${'a'.repeat(64)}.webp`,
  sizeBytes: 3072,
  status: 'ready',
  createdAt: '2026-08-10T00:00:00.000Z',
  updatedAt: '2026-08-10T00:01:00.000Z',
  uploadedAt: '2026-08-10T00:01:00.000Z',
}];

const tollowProgressRows = [{
  bookId: 'lunyu',
  sectionId: 'chapter-01',
  segmentIndex: 1,
  offset: 8,
  updatedAt: '2026-08-23T00:00:00.000Z',
}];
const tollowSessionRows = [{
  id: 'S1',
  clientRecordId: 'local-S1',
  bookId: 'lunyu',
  bookTitle: '论语',
  startedAt: '2026-08-23T00:00:00.000Z',
  endedAt: '2026-08-23T00:01:00.000Z',
  durationMs: 60_000,
  wordsTyped: 100,
  wpm: 100,
  accuracy: 98,
  errorCount: 2,
  createdAt: '2026-08-23T00:01:00.000Z',
}];
const tollowFavoriteRows = [{
  id: 'F1',
  bookId: 'lunyu',
  bookTitle: '论语',
  sectionId: 'chapter-01',
  sectionTitle: '學而第一',
  segmentIndex: 0,
  startOffset: 0,
  endOffset: 4,
  quote: '學而時習',
  note: '常读常新',
  tags: ['经典'],
  createdAt: '2026-08-23T00:00:00.000Z',
  updatedAt: '2026-08-23T00:00:00.000Z',
}];

vi.mock('../db', () => ({
  db: {
    select: () => ({
      from: (table: unknown) => ({
        where: async () => {
          if (table === users) return accountRows;
          if (table === blogImages) return imageRows;
          if (table === personalAccessTokens) return tokenRows;
          if (table === posts) return postRows;
          if (table === postSections) return sectionRows;
          if (table === tollowBookProgress) return tollowProgressRows;
          if (table === tollowPracticeSessions) return tollowSessionRows;
          if (table === tollowTextFavorites) return tollowFavoriteRows;
          return [];
        },
      }),
    }),
  },
}));

describe('用户数据导出', () => {
  beforeEach(() => {
    accountRows = [{
      id: 'U1',
      email: 'user@example.com',
      name: 'User',
      avatarUrl: null,
      bio: null,
      emailVerified: true,
      isStudent: false,
      studentEmail: null,
      studentVerifiedAt: null,
      tokenVersion: 3,
      blogImageBytes: 3072,
      createdAt: '2026-08-10T00:00:00.000Z',
    }];
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('只导出 PAT 的安全元数据，不包含哈希或内部版本', async () => {
    const { exportUserData } = await import('../user-data-export');

    const exported = await exportUserData('U1', 'user@example.com');
    const tokens = exported.security.personalAccessTokens;

    expect(tokens).toEqual([
      expect.objectContaining({
        name: 'Codex',
        tokenPrefix: 'msb_abc123',
        scopes: ['blog:read', 'blog:write'],
        status: 'active',
      }),
    ]);
    expect(JSON.stringify(tokens)).not.toContain('must-not-export');
    expect(tokens[0]).not.toHaveProperty('tokenHash');
    expect(tokens[0]).not.toHaveProperty('tokenVersion');
    expect(exported.content.posts[0].eventDate).toBe('2026-08-10');
    expect(exported.content.postSections).toEqual(sectionRows);
    expect(exported.content.blogImages).toEqual({
      count: 1,
      quota: {
        usedBytes: 3072,
        limitBytes: 200 * 1024 * 1024,
        remainingBytes: (200 * 1024 * 1024) - 3072,
      },
      items: imageRows,
    });
    expect(exported.account).not.toHaveProperty('blogImageBytes');
    expect(exported.tollow).toEqual({
      bookProgress: tollowProgressRows,
      practiceSessions: tollowSessionRows,
      textFavorites: tollowFavoriteRows,
    });
    expect(JSON.stringify(exported.tollow)).not.toContain('userId');
  });

  it('只有已验证的当前管理员导出 1 GiB 额度', async () => {
    vi.stubEnv('ADMIN_EMAILS', 'admin@example.com');
    accountRows = [{
      ...accountRows[0],
      email: 'admin@example.com',
      emailVerified: true,
    }];
    const { exportUserData } = await import('../user-data-export');

    const adminExport = await exportUserData('U1', 'admin@example.com');
    expect(adminExport.content.blogImages.quota.limitBytes).toBe(1024 * 1024 * 1024);

    accountRows = [{ ...accountRows[0], emailVerified: false }];
    const unverifiedExport = await exportUserData('U1', 'admin@example.com');
    expect(unverifiedExport.content.blogImages.quota.limitBytes).toBe(200 * 1024 * 1024);
  });
});
