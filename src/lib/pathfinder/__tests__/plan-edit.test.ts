import { describe, expect, it } from 'vitest';
import {
  addCustomTask,
  CUSTOM_TASK_ITEM_ID,
  isCustomTask,
  MAX_TASKS_PER_WEEK,
  moveTask,
  pruneTaskIds,
  removeTask,
  replaceWeekTasks,
  withToggledPin,
  type EditedPlanTask,
} from '../plan-edit';
import { PathfinderPlanSchema, type PathfinderPlan } from '../schema';

const task = (id: string, minutes = 60): EditedPlanTask => ({
  id,
  action: `完成 ${id}`,
  estimatedMinutes: minutes,
  itemId: `item-${id}`,
  evidence: '提交记录',
  alternative: '时间不够时先读文档',
});

function planWith(tasksByWeek: EditedPlanTask[][]): PathfinderPlan {
  const phases = ['prepare', 'practice', 'real-action', 'deliver', 'review'] as const;
  return {
    version: 2,
    title: '四周路径',
    summary: '摘要',
    durationWeeks: tasksByWeek.length,
    generatedAt: '2026-08-25T00:00:00.000Z',
    warnings: [],
    weeks: tasksByWeek.map((tasks, index) => ({
      week: index + 1,
      phase: phases[Math.min(index, phases.length - 1)],
      title: `第 ${index + 1} 周`,
      objective: '目标',
      estimatedMinutes: tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0),
      tasks,
    })),
  } as PathfinderPlan;
}

/** 每次编辑后都必须仍然满足生成器的 schema，否则存回服务端会被拒。 */
function expectValid(plan: PathfinderPlan) {
  const result = PathfinderPlanSchema.safeParse(plan);
  expect(result.success, result.success ? '' : JSON.stringify(result.error.issues[0])).toBe(true);
}

const base = () => planWith([
  [task('a'), task('b'), task('c')],
  [task('d')],
  [task('e'), task('f')],
  [task('g')],
]);

describe('周内排序', () => {
  it('上移与下移交换相邻任务', () => {
    const moved = moveTask(base(), 'b', 'up');
    expect(moved.weeks[0].tasks.map((t) => t.id)).toEqual(['b', 'a', 'c']);
    expectValid(moved);

    const down = moveTask(base(), 'a', 'down');
    expect(down.weeks[0].tasks.map((t) => t.id)).toEqual(['b', 'a', 'c']);
  });

  it('已在首位或末位时原样返回，界面可据此禁用按钮', () => {
    const plan = base();
    expect(moveTask(plan, 'a', 'up').weeks[0].tasks.map((t) => t.id)).toEqual(['a', 'b', 'c']);
    expect(moveTask(plan, 'c', 'down').weeks[0].tasks.map((t) => t.id)).toEqual(['a', 'b', 'c']);
  });

  it('不存在的任务 id 不改变路径', () => {
    expect(moveTask(base(), '不存在', 'up')).toEqual(base());
  });

  it('排序不改变周时长', () => {
    const before = base().weeks[0].estimatedMinutes;
    expect(moveTask(base(), 'b', 'up').weeks[0].estimatedMinutes).toBe(before);
  });
});

describe('删除任务', () => {
  it('删除后重算周时长', () => {
    const plan = removeTask(base(), 'b');
    expect(plan.weeks[0].tasks.map((t) => t.id)).toEqual(['a', 'c']);
    // 漏掉重算就会触发 schema 的「周时长必须等于任务时长之和」
    expect(plan.weeks[0].estimatedMinutes).toBe(120);
    expectValid(plan);
  });

  it('一周只剩一个任务时拒绝删除', () => {
    // 空周会让 schema 校验失败，对读者也没有意义
    const plan = base();
    expect(removeTask(plan, 'd')).toEqual(plan);
  });
});

describe('自定义任务', () => {
  it('添加后带自定义标记，且不引用目录条目', () => {
    const plan = addCustomTask(base(), 2, { action: '把上周的 demo 录成视频', estimatedMinutes: 45 }, 'x1');
    const added = plan.weeks[1].tasks.at(-1)!;

    expect(added.itemId).toBe(CUSTOM_TASK_ITEM_ID);
    expect(isCustomTask(added)).toBe(true);
    expect(added.action).toBe('把上周的 demo 录成视频');
    expect(plan.weeks[1].estimatedMinutes).toBe(105);
    expectValid(plan);
  });

  it('时长被钳进合法区间，空标题不添加', () => {
    const tooShort = addCustomTask(base(), 2, { action: '任务', estimatedMinutes: 1 }, 'x');
    expect(tooShort.weeks[1].tasks.at(-1)!.estimatedMinutes).toBe(5);

    const plan = base();
    expect(addCustomTask(plan, 2, { action: '   ', estimatedMinutes: 60 }, 'x')).toEqual(plan);
  });

  it('一周已有 4 个任务时不再添加', () => {
    const full = planWith([[task('a'), task('b'), task('c'), task('d')]]);
    expect(addCustomTask(full, 1, { action: '第五个', estimatedMinutes: 30 }, 'x')).toEqual(full);
  });
});

describe('按周重生成时保留锁定任务', () => {
  it('锁定的排在前面，剩余名额才给新任务', () => {
    const plan = replaceWeekTasks(base(), 1, [task('n1'), task('n2'), task('n3')], ['a']);

    expect(plan.weeks[1 - 1].tasks.map((t) => t.id)).toEqual(['a', 'n1', 'n2', 'n3']);
    expectValid(plan);
  });

  it('新任务不会挤爆每周 4 个的上限', () => {
    // 锁 3 条再灌 4 条新的，若简单拼接就会变成 7 条而存不回去
    const plan = replaceWeekTasks(base(), 1, [task('n1'), task('n2'), task('n3'), task('n4')], ['a', 'b', 'c']);

    expect(plan.weeks[0].tasks).toHaveLength(MAX_TASKS_PER_WEEK);
    expect(plan.weeks[0].tasks.map((t) => t.id)).toEqual(['a', 'b', 'c', 'n1']);
    expectValid(plan);
  });

  it('与保留任务重复的新任务被跳过，不出现两份', () => {
    const plan = replaceWeekTasks(base(), 1, [task('a'), task('n1')], ['a']);
    expect(plan.weeks[0].tasks.map((t) => t.id)).toEqual(['a', 'n1']);
  });

  it('没有新任务且没有锁定时保持原样，不清空这一周', () => {
    const plan = base();
    expect(replaceWeekTasks(plan, 2, [], [])).toEqual(plan);
  });

  it('重生成后周时长跟着变', () => {
    const plan = replaceWeekTasks(base(), 2, [task('n1', 30), task('n2', 20)], []);
    expect(plan.weeks[1].estimatedMinutes).toBe(50);
    expectValid(plan);
  });

  it('只影响目标周，其它周原样', () => {
    const plan = replaceWeekTasks(base(), 3, [task('n1')], []);
    expect(plan.weeks[0].tasks.map((t) => t.id)).toEqual(['a', 'b', 'c']);
    expect(plan.weeks[3].tasks.map((t) => t.id)).toEqual(['g']);
  });
});

describe('锁定与残留 id 清理', () => {
  it('锁定是可切换的 id 列表', () => {
    expect(withToggledPin([], 'a')).toEqual(['a']);
    expect(withToggledPin(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('删除任务后清掉指向已消失任务的完成与锁定记录', () => {
    // 留着不会立刻出错，但会让「已完成 3/5」这类计数虚高
    const plan = removeTask(base(), 'b');
    expect(pruneTaskIds(plan, ['a', 'b', 'g'])).toEqual(['a', 'g']);
  });

  it('重生成某一周后同样清理', () => {
    const plan = replaceWeekTasks(base(), 1, [task('n1')], []);
    expect(pruneTaskIds(plan, ['a', 'b', 'c', 'd'])).toEqual(['d']);
  });
});
