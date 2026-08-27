import { describe, expect, it } from 'vitest';
import { isActionableIssue, notActionableReason, type IssueActivity } from '../ingestion/actionable';

const NOW = new Date('2026-08-27T00:00:00.000Z');
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

const activity = (over: Partial<IssueActivity> = {}): IssueActivity => ({
  createdAt: daysAgo(60),
  updatedAt: daysAgo(5),
  comments: 3,
  isPullRequest: false,
  hasAssignee: false,
  ...over,
});

describe('可上手判定', () => {
  it('近期创建、有讨论、无人认领的可以上手', () => {
    expect(isActionableIssue(activity(), NOW)).toBe(true);
  });

  it('已有人认领的不推荐', () => {
    expect(notActionableReason(activity({ hasAssignee: true }), NOW)).toBe('assigned');
    expect(notActionableReason(activity({ isPullRequest: true }), NOW)).toBe('pull-request');
  });

  it('机器人刷新过 updated 的老 issue 仍被年龄挡下', () => {
    /*
     * 真实案例：microsoft/TypeScript 的 "Scope of this is lost when passing a
     * member function to setInterval" 创建于 2016-08-11，却在 2026-03-16 被
     * 机器人改标签刷新过 updated_at。只看「最近有更新」会把它当成活跃任务，
     * 而它正是原来出现在推荐里最老的那条。
     */
    expect(notActionableReason(activity({
      createdAt: '2016-08-11T00:00:00.000Z',
      updatedAt: daysAgo(20),
      comments: 12,
    }), NOW)).toBe('too-old');
  });

  it('长期无人回应的老 issue 视为无人认领', () => {
    // 单看年龄会误伤「维护者认可但没人动手」的好任务，所以要配合零讨论
    expect(notActionableReason(activity({ createdAt: daysAgo(600), comments: 0 }), NOW))
      .toBe('silent-and-old');
    expect(isActionableIssue(activity({ createdAt: daysAgo(600), comments: 8 }), NOW)).toBe(true);
  });

  it('长期停滞的不推荐', () => {
    expect(notActionableReason(activity({ updatedAt: daysAgo(400) }), NOW)).toBe('idle');
  });

  it('讨论过长的不推荐', () => {
    // 超长讨论串意味着方案没谈拢，实际难度远高于 good first issue 的承诺
    expect(notActionableReason(activity({ comments: 120 }), NOW)).toBe('too-contentious');
  });

  it('缺字段时放行，不让目录随上游抖动忽多忽少', () => {
    expect(isActionableIssue({
      createdAt: null, updatedAt: null, comments: 0, isPullRequest: false, hasAssignee: false,
    }, NOW)).toBe(true);
  });
});
