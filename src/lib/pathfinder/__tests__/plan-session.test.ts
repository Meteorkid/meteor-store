import { describe, expect, it } from 'vitest';
import { assertPlanOwner, parseOwnedPlan, parseRemotePlan, planStorageKey } from '../plan-session';
const response = { kind: 'plan', source: 'deterministic', plan: {
  version: 2, title: 'A private plan', summary: 'summary', durationWeeks: 4, generatedAt: '2026-10-22T00:00:00Z', warnings: [],
  weeks: Array.from({ length: 4 }, (_, i) => ({ week: i + 1, phase: 'practice', title: 'week', objective: 'objective', estimatedMinutes: 30,
    tasks: [{ id: `task-${i}`, action: 'task', itemId: `item-${i}`, evidence: 'evidence', alternative: 'alternative', estimatedMinutes: 30 }] })),
} };
const draft = { version: 3, userId: 'A', savedAt: '2026-10-22T00:00:00Z', response, completedTaskIds: ['task-0', 'deleted'], pinnedTaskIds: ['task-1'], profile: null };
describe('本地计划与响应身份隔离', () => {
  it('A/B/guest和相似账号标识使用互不相同的键', () => { expect(new Set([null, 'A', 'B', 'guest', 'user:A', 'A:guest'].map(planStorageKey)).size).toBe(6); });
  it('只恢复本人记录，绝不回退旧v2或其他身份', () => {
    expect(parseOwnedPlan(JSON.stringify(draft), 'A')?.completedTaskIds).toEqual(['task-0']);
    expect(parseOwnedPlan(JSON.stringify(draft), 'B')).toBeNull();
    expect(parseOwnedPlan(JSON.stringify(draft), null)).toBeNull();
    expect(parseOwnedPlan(JSON.stringify({ ...draft, version: 2, userId: undefined }), 'B')).toBeNull();
    expect(parseOwnedPlan(JSON.stringify({ ...draft, userId: null }), null)?.pinnedTaskIds).toEqual(['task-1']);
  });
  it('拒绝损坏缓存及日期，合法安全响应不带任务状态', () => {
    expect(parseOwnedPlan('{', 'A')).toBeNull();
    expect(parseOwnedPlan(JSON.stringify({ ...draft, savedAt: 'bad' }), 'A')).toBeNull();
    expect(parseOwnedPlan(JSON.stringify({ ...draft, response: {} }), 'A')).toBeNull();
    expect(parseOwnedPlan(JSON.stringify({ ...draft, response: { kind: 'safety', source: 'safety', message: 'support', actions: ['ask'] } }), 'A')?.completedTaskIds).toEqual([]);
  });
  it('空计划也必须带预期身份，200不代表已登录', () => {
    expect(parseRemotePlan({ userId: 'B', plan: null }, 'B')).toBeNull();
    for (const value of [{ plan: null }, { userId: null, plan: null }, { userId: 'A', plan: null }]) expect(() => parseRemotePlan(value, 'B')).toThrow('Account changed');
    expect(() => assertPlanOwner({ userId: 'A' }, 'B')).toThrow();
  });
  it('正常云端恢复校验内容并清除残留任务id', () => {
    const parsed = parseRemotePlan({ userId: 'A', plan: { plan: response.plan, updatedAt: draft.savedAt, completedTaskIds: ['task-0', 'deleted'], pinnedTaskIds: ['task-1'], profile: null } }, 'A');
    expect(parsed?.response).toEqual(response); expect(parsed?.completedTaskIds).toEqual(['task-0']);
    expect(() => parseRemotePlan({ userId: 'A', plan: {} }, 'A')).toThrow('Invalid saved plan');
  });
});
