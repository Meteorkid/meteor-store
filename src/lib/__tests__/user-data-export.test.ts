import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultDailyPanelSettings } from '../daily/panel-types';
import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import {
  blogImages,
  dailyPreferences,
  ieltsProgress,
  mastersWatches,
  phdNotices,
  phdWatches,
  personalAccessTokens,
  postSections,
  posts,
  studyCourses,
  studyDeadlines,
  studyProblems,
  tollowBookProgress,
  tollowPracticeSessions,
  tollowTextFavorites,
  users,
  orders,
  paymentRefundAttempts,
} from '../db/schema';

let ownedOrderRows: Array<{ id: string }> = [];
const refundQueries: Array<{ sql: string; params: unknown[] }> = [];
const phdQueries: Array<{ sql: string; params: unknown[] }> = [];
const ieltsQueries: Array<{ sql: string; params: unknown[] }> = [];
const ieltsProgressRows = [
  { userId: 'U1', pairSlug: 'task2-education-01', studiedAt: '2026-11-14T00:00:00Z', bookmarkedAt: null, updatedAt: '2026-11-14T00:00:00Z', privateNote: 'must-not-export' },
  { userId: 'U1', pairSlug: 'task2-environment-01', studiedAt: null, bookmarkedAt: '2026-11-14T01:00:00Z', updatedAt: '2026-11-14T01:00:00Z' },
  { userId: 'U2', pairSlug: 'other-ielts-pair', studiedAt: null, bookmarkedAt: '2026-11-14T00:00:00Z', updatedAt: '2026-11-14T00:00:00Z' },
];
const phdWatchRows = [
  { userId: 'U1', roundId: 'phd-round-1', status: 'preparing', reminders: true, createdAt: '2026-10-29T00:00:00Z', updatedAt: '2026-10-29T01:00:00Z', internalNote: 'must-not-export' },
  { userId: 'U2', roundId: 'other-phd-round', status: 'interested', reminders: false },
];
const phdNoticeRows = [
  { id: 'internal-notice-id', userId: 'U1', roundId: 'phd-round-1', kind: 'deadline', leadDays: 7, dateVersion: 2, createdAt: '2026-10-29T00:00:00Z', readAt: null, privateMetadata: 'must-not-export' },
  { id: 'other-notice', userId: 'U2', roundId: 'other-phd-round', kind: 'deadline' },
];
const refundRows = [
  { requestNo: 'owned-request', orderId: 'owned-order', paymentMethod: 'alipay', status: 'UNKNOWN', source: 'api', refundAmount: 3900, totalAmount: 3900, needsReview: false, createdAt: '2026-10-27T00:00:00Z', updatedAt: '2026-10-27T00:00:00Z', lastRequestedAt: '2026-10-27T00:00:00Z', lastQueriedAt: null, privateMetadata: 'must-not-export' },
  { requestNo: 'other-request', orderId: 'other-order', paymentMethod: 'alipay', status: 'SUCCESS' },
];

vi.mock('../software-licenses/service', () => ({
  exportSoftwareLicenseData: async () => ({ licenses: [], devices: [] }),
}));

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

const studyCourseRows = [
  { userId: 'U1', term: '2026-2027-1', name: '数据结构', credits: 4, score: 92, status: 'completed', createdAt: '2026-09-01T00:00:00Z', updatedAt: '2026-11-01T00:00:00Z', privateNote: 'must-not-export' },
  { userId: 'U2', term: '2026-2027-1', name: '其他人的课', credits: 3, score: null, status: 'in-progress' },
];
const studyDeadlineRows = [
  { userId: 'U1', courseId: 'course-1', title: '第三次作业', kind: 'assignment', dueAt: '2026-11-20', status: 'open', notes: null, createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-01T00:00:00Z', privateNote: 'must-not-export' },
  { userId: 'U2', courseId: null, title: '别人的作业', kind: 'assignment', dueAt: '2026-11-21', status: 'open', notes: null },
];
const studyProblemRows = [
  { userId: 'U1', title: '两数之和', topic: '数组', difficulty: 'easy', url: 'https://leetcode.cn/problems/two-sum/', status: 'solved', notes: null, reviewStage: 2, reviewDueOn: '2026-11-16', reviewIntervalDays: 7, lastReviewedOn: '2026-11-09', createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-09T00:00:00Z', privateNote: 'must-not-export' },
  { userId: 'U2', title: '别人的题', topic: '', difficulty: 'medium', url: null, status: 'todo', notes: null },
];

vi.mock('../db', () => ({
  db: {
    select: (selection?: Record<string, unknown>) => ({
      from: (table: unknown) => ({
        where: async (condition?: SQL) => {
          if (table === users) return accountRows;
          if (table === orders) return ownedOrderRows;
          if (table === paymentRefundAttempts) {
            const query = new PgDialect().sqlToQuery(condition!);
            refundQueries.push(query);
            return refundRows.filter(row => query.params.includes(row.orderId))
              .map(row => Object.fromEntries(Object.entries(row).filter(([key]) => !selection || key in selection)));
          }
          if (table === blogImages) return imageRows;
          if (table === personalAccessTokens) return tokenRows;
          if (table === posts) return postRows;
          if (table === postSections) return sectionRows;
          if (table === tollowBookProgress) return tollowProgressRows;
          if (table === tollowPracticeSessions) return tollowSessionRows;
          if (table === tollowTextFavorites) return tollowFavoriteRows;
          if (table === dailyPreferences) {
            const row = { channels: ['english'], reminders: false, updatedAt: '2026-10-14T00:00:00Z',
              panelSettings: defaultDailyPanelSettings(['papers', 'english']), panelUpdatedAt: '2026-10-23T01:00:00.000Z' };
            return [Object.fromEntries(Object.entries(row).filter(([key]) => !selection || key in selection))];
          }
          if (table === mastersWatches) return [{ roundId: 'round-1', status: 'preparing', reminders: true }];
          if (table === ieltsProgress) {
            const query = new PgDialect().sqlToQuery(condition!);
            ieltsQueries.push(query);
            return ieltsProgressRows.filter(row => query.params.includes(row.userId))
              .map(row => Object.fromEntries(Object.entries(row).filter(([key]) => !selection || key in selection)));
          }
          if (table === studyCourses || table === studyDeadlines || table === studyProblems) {
            const query = new PgDialect().sqlToQuery(condition!);
            const rows = table === studyCourses ? studyCourseRows : table === studyDeadlines ? studyDeadlineRows : studyProblemRows;
            return rows.filter(row => query.params.includes(row.userId))
              .map(row => Object.fromEntries(Object.entries(row).filter(([key]) => !selection || key in selection)));
          }
          if (table === phdWatches || table === phdNotices) {
            const query = new PgDialect().sqlToQuery(condition!);
            phdQueries.push(query);
            const rows = table === phdWatches ? phdWatchRows : phdNoticeRows;
            return rows.filter(row => query.params.includes(row.userId))
              .map(row => Object.fromEntries(Object.entries(row).filter(([key]) => !selection || key in selection)));
          }
          return [];
        },
      }),
    }),
  },
}));

describe('用户数据导出', () => {
  beforeEach(() => {
    ownedOrderRows = [];
    refundQueries.length = 0;
    phdQueries.length = 0;
    ieltsQueries.length = 0;
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
    expect(exported.daily.preferences?.channels).toEqual(['english']);
    expect(exported.daily.preferences?.panelSettings).toEqual(defaultDailyPanelSettings(['papers', 'english']));
    expect(exported.daily.preferences?.panelUpdatedAt).toBe('2026-10-23T01:00:00.000Z');
    expect(exported.daily.preferences).not.toHaveProperty('userId');
    expect(exported.masters.applications).toEqual([{ roundId: 'round-1', status: 'preparing', reminders: true }]);
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

  it('博士申请和提醒只导出本人记录及字段白名单，硕士合同保持不变', async () => {
    const { exportUserData } = await import('../user-data-export');
    const exported = await exportUserData('U1', 'user@example.com');
    expect(exported.phd).toEqual({
      applications: [{ roundId: 'phd-round-1', status: 'preparing', reminders: true,
        createdAt: '2026-10-29T00:00:00Z', updatedAt: '2026-10-29T01:00:00Z' }],
      notices: [{ roundId: 'phd-round-1', kind: 'deadline', leadDays: 7, dateVersion: 2,
        createdAt: '2026-10-29T00:00:00Z', readAt: null }],
    });
    expect(phdQueries.map(query => query.params)).toEqual([['U1'], ['U1']]);
    expect(phdQueries[0].sql).toContain('"phd_watches"."user_id"');
    expect(phdQueries[1].sql).toContain('"phd_notices"."user_id"');
    expect(JSON.stringify(exported.phd)).not.toMatch(/userId|internal-notice|must-not-export|other-phd/);
    expect(exported.masters).toEqual({ applications: [{ roundId: 'round-1', status: 'preparing', reminders: true }], notices: [] });
  });

  it('退款尝试仅按本人已导出的订单关联，使用字段白名单', async () => {
    ownedOrderRows = [{ id: 'owned-order' }];
    const { exportUserData } = await import('../user-data-export');
    const exported = await exportUserData('U1', 'user@example.com');
    expect(exported.commerce.refundAttempts).toEqual([expect.objectContaining({ requestNo: 'owned-request', orderId: 'owned-order', status: 'UNKNOWN' })]);
    expect(refundQueries[0].params).toEqual(['owned-order']);
    expect(JSON.stringify(exported.commerce.refundAttempts)).not.toContain('other-request');
    expect(JSON.stringify(exported.commerce.refundAttempts)).not.toContain('must-not-export');
  });

  it('学习数据只导出本人记录，字段白名单不含 userId 与内部字段', async () => {
    const { exportUserData } = await import('../user-data-export');
    const exported = await exportUserData('U1', 'user@example.com');
    expect(exported.study.courses).toEqual([{
      term: '2026-2027-1', name: '数据结构', credits: 4, score: 92, status: 'completed',
      createdAt: '2026-09-01T00:00:00Z', updatedAt: '2026-11-01T00:00:00Z',
    }]);
    expect(exported.study.deadlines).toEqual([{
      courseId: 'course-1', title: '第三次作业', kind: 'assignment', dueAt: '2026-11-20',
      status: 'open', notes: null, createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-01T00:00:00Z',
    }]);
    expect(exported.study.problems).toEqual([{
      title: '两数之和', topic: '数组', difficulty: 'easy', url: 'https://leetcode.cn/problems/two-sum/',
      status: 'solved', notes: null, reviewStage: 2, reviewDueOn: '2026-11-16', reviewIntervalDays: 7,
      lastReviewedOn: '2026-11-09', createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-09T00:00:00Z',
    }]);
    const serialized = JSON.stringify(exported.study);
    expect(serialized).not.toMatch(/userId|must-not-export|U2|其他人的课|别人的/);
  });

  it('没有本人订单时不查询全站退款记录', async () => {
    const { exportUserData } = await import('../user-data-export');
    const exported = await exportUserData('U1', 'user@example.com');
    expect(exported.commerce.refundAttempts).toEqual([]);
    expect(refundQueries).toHaveLength(0);
  });

  it('雅思已学与收藏只导出本人记录及字段白名单', async () => {
    const { exportUserData } = await import('../user-data-export');
    const exported = await exportUserData('U1', 'user@example.com');
    expect(exported.ielts).toEqual({ progress: [
      { pairSlug: 'task2-education-01', studiedAt: '2026-11-14T00:00:00Z', bookmarkedAt: null, updatedAt: '2026-11-14T00:00:00Z' },
      { pairSlug: 'task2-environment-01', studiedAt: null, bookmarkedAt: '2026-11-14T01:00:00Z', updatedAt: '2026-11-14T01:00:00Z' },
    ] });
    expect(ieltsQueries).toMatchObject([{ sql: '"ielts_progress"."user_id" = $1', params: ['U1'] }]);
    expect(JSON.stringify(exported.ielts)).not.toMatch(/userId|must-not-export|other-ielts-pair/);
  });
});
