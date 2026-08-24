import { describe, expect, it } from 'vitest';
import {
  pathfinderScrollBehavior,
  parseStoredPathfinderPlan,
  withToggledTask,
  type StoredPathfinderPlan,
} from '../plan-view';

describe('Pathfinder local plan state', () => {
  it('拒绝空值、损坏 JSON 与旧版本缓存', () => {
    expect(parseStoredPathfinderPlan(null)).toBeNull();
    expect(parseStoredPathfinderPlan('{')).toBeNull();
    expect(parseStoredPathfinderPlan(JSON.stringify({ version: 1 }))).toBeNull();
    expect(parseStoredPathfinderPlan(JSON.stringify({
      version: 2,
      savedAt: '2026-08-24T00:00:00.000Z',
      response: { kind: 'plan', source: 'deterministic', plan: { version: 2 } },
      completedTaskIds: [],
    }))).toBeNull();
  });

  it('恢复有效的安全响应缓存', () => {
    const stored: StoredPathfinderPlan = {
      version: 2,
      savedAt: '2026-08-24T00:00:00.000Z',
      response: {
        kind: 'safety',
        source: 'safety',
        message: '先联系可信任的人。',
        actions: ['联系辅导员'],
      },
      completedTaskIds: [],
    };

    expect(parseStoredPathfinderPlan(JSON.stringify(stored))).toEqual(stored);
  });

  it('拒绝非法阶段与日期，避免损坏缓存让计划页崩溃', () => {
    const invalidPlan = {
      version: 2,
      savedAt: '2026-08-24T00:00:00.000Z',
      response: {
        kind: 'plan',
        source: 'deterministic',
        plan: {
          version: 2,
          title: '计划',
          summary: '摘要',
          durationWeeks: 4,
          generatedAt: '2026-08-24T00:00:00.000Z',
          warnings: [],
          weeks: Array.from({ length: 4 }, (_, index) => ({
            week: index + 1,
            phase: index === 0 ? 'not-a-phase' : 'practice',
            title: `第 ${index + 1} 周`,
            objective: '完成任务',
            estimatedMinutes: 60,
            tasks: [{
              id: `task-${index}`,
              action: '执行',
              estimatedMinutes: 60,
              itemId: 'item-1',
              evidence: '证据',
              alternative: '替代项',
              deadlineAt: index === 0 ? 'not-a-date' : undefined,
            }],
          })),
        },
      },
      completedTaskIds: [],
    };

    expect(parseStoredPathfinderPlan(JSON.stringify(invalidPlan))).toBeNull();
  });

  it('切换任务不会修改原数组，并避免重复任务 ID', () => {
    const original = ['task-1'];

    expect(withToggledTask(original, 'task-2')).toEqual(['task-1', 'task-2']);
    expect(withToggledTask(original, 'task-1')).toEqual([]);
    expect(original).toEqual(['task-1']);
  });

  it('用户偏好减少动态效果时不启用平滑滚动', () => {
    expect(pathfinderScrollBehavior(true)).toBe('auto');
    expect(pathfinderScrollBehavior(false)).toBe('smooth');
  });
});
