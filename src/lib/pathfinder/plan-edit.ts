import { z } from 'zod';
import {
  PathfinderPlanSchema,
  PathfinderPlanTaskSchema,
  type PathfinderPlan,
} from './schema';

/**
 * 已保存路径的编辑。
 *
 * 生成器产出的路径是「按你的条件算出来的一个起点」，不是终稿。这一层让路径
 * 变成可以长期维护的东西：调顺序、删掉不合适的、锁住已经安排好的、
 * 加自己的任务，以及只重做某一周而不推翻全部。
 *
 * **所有操作都是纯函数**：传入路径、返回新路径，不碰数据库也不碰组件状态。
 * 生成器那边的约束（每周 1–4 个任务、周时长必须等于任务时长之和、
 * 周数必须等于 durationWeeks）在编辑后同样要成立，否则存回去会校验失败——
 * 这些不变量在这里逐条维护，测试也钉在这一层。
 */

/**
 * 自定义任务用的哨兵 itemId。
 *
 * 生成器的任务必须引用目录中的条目，而自定义任务没有条目背书。用哨兵值而不是
 * 空字符串，是为了让「这条没有来源」在数据里是显式的：界面据此不渲染来源链接，
 * 也不会拿它去查一个查不到的条目。
 */
export const CUSTOM_TASK_ITEM_ID = 'custom';

/** 编辑后的任务：允许标记为自定义。 */
export const EditedPlanTaskSchema = PathfinderPlanTaskSchema.extend({
  /** true 表示用户手写，没有目录条目背书 */
  custom: z.boolean().optional(),
});

/**
 * 编辑后的路径。
 *
 * 复用生成器的 schema，只把任务换成允许自定义标记的版本——周数、任务数、
 * 时长求和这些不变量继续沿用，编辑不能把路径改成生成器产不出的形状。
 */
export const EditedPlanSchema = PathfinderPlanSchema;

export type EditedPlanTask = z.infer<typeof EditedPlanTaskSchema>;

/** 一周允许的任务数上限，与生成器 schema 保持一致。 */
export const MAX_TASKS_PER_WEEK = 4;
/** 一周至少要留一个任务，否则这一周在路径里没有意义。 */
export const MIN_TASKS_PER_WEEK = 1;

function recalcWeek(week: PathfinderPlan['weeks'][number]): PathfinderPlan['weeks'][number] {
  return {
    ...week,
    // 周时长必须等于任务时长之和，schema 的 superRefine 会校验；
    // 每次改动任务后都要重算，漏一次就存不回去
    estimatedMinutes: week.tasks.reduce((total, task) => total + task.estimatedMinutes, 0),
  };
}

function mapWeek(
  plan: PathfinderPlan,
  weekNumber: number,
  update: (week: PathfinderPlan['weeks'][number]) => PathfinderPlan['weeks'][number],
): PathfinderPlan {
  return {
    ...plan,
    weeks: plan.weeks.map((week) => (week.week === weekNumber ? recalcWeek(update(week)) : week)),
  };
}

export function findTaskWeek(plan: PathfinderPlan, taskId: string): number | null {
  const week = plan.weeks.find((candidate) => candidate.tasks.some((task) => task.id === taskId));
  return week?.week ?? null;
}

/**
 * 周内上移 / 下移一个任务。
 *
 * 只在周内移动：跨周移动会改变任务与阶段（准备 / 练习 / 真实行动…）的对应关系，
 * 而阶段是路径的骨架——把「交付」阶段的任务挪到第一周，路径就自相矛盾了。
 * 想改变节奏应该重做那一周，而不是搬运任务。
 */
export function moveTask(
  plan: PathfinderPlan,
  taskId: string,
  direction: 'up' | 'down',
): PathfinderPlan {
  const weekNumber = findTaskWeek(plan, taskId);
  if (weekNumber === null) return plan;

  return mapWeek(plan, weekNumber, (week) => {
    const index = week.tasks.findIndex((task) => task.id === taskId);
    const target = direction === 'up' ? index - 1 : index + 1;
    // 已在首/末位时原样返回，让界面可以直接禁用按钮而不必自己判边界
    if (index < 0 || target < 0 || target >= week.tasks.length) return week;

    const tasks = [...week.tasks];
    [tasks[index], tasks[target]] = [tasks[target], tasks[index]];
    return { ...week, tasks };
  });
}

/**
 * 删除一个任务。
 *
 * 一周至少保留一个任务：空周会让 schema 校验失败，而且一个没有任何任务的周
 * 对读者也没有意义。删不掉时原样返回，由界面禁用按钮并说明原因。
 */
export function removeTask(plan: PathfinderPlan, taskId: string): PathfinderPlan {
  const weekNumber = findTaskWeek(plan, taskId);
  if (weekNumber === null) return plan;

  const week = plan.weeks.find((candidate) => candidate.week === weekNumber);
  if (!week || week.tasks.length <= MIN_TASKS_PER_WEEK) return plan;

  return mapWeek(plan, weekNumber, (current) => ({
    ...current,
    tasks: current.tasks.filter((task) => task.id !== taskId),
  }));
}

export interface CustomTaskInput {
  action: string;
  estimatedMinutes: number;
  evidence?: string;
}

/** 自定义任务的 id 前缀，便于在数据里一眼分辨来源。 */
const CUSTOM_TASK_ID_PREFIX = 'custom-';

export function isCustomTask(task: EditedPlanTask): boolean {
  return task.custom === true || task.itemId === CUSTOM_TASK_ITEM_ID;
}

/**
 * 往某一周添加自定义任务。
 *
 * 自定义任务没有目录条目背书，因此不带截止时间，`alternative` 也留一句
 * 中性说明而不是编一个替代方案——替代方案本该来自目录里的同类条目。
 */
export function addCustomTask(
  plan: PathfinderPlan,
  weekNumber: number,
  input: CustomTaskInput,
  idSuffix: string,
): PathfinderPlan {
  const week = plan.weeks.find((candidate) => candidate.week === weekNumber);
  if (!week || week.tasks.length >= MAX_TASKS_PER_WEEK) return plan;

  const action = input.action.trim().slice(0, 500);
  if (!action) return plan;

  const task: EditedPlanTask = {
    id: `${CUSTOM_TASK_ID_PREFIX}${idSuffix}`,
    action,
    estimatedMinutes: Math.min(1_800, Math.max(5, Math.round(input.estimatedMinutes))),
    itemId: CUSTOM_TASK_ITEM_ID,
    evidence: input.evidence?.trim().slice(0, 300) || '自己记录完成情况',
    alternative: '这是你自己添加的任务，系统不提供替代方案',
    custom: true,
  };

  return mapWeek(plan, weekNumber, (current) => ({
    ...current,
    tasks: [...current.tasks, task],
  }));
}

/**
 * 用新生成的一周替换旧的一周，但保留锁定的任务。
 *
 * 这是「新生成只替换部分路径」的落点：锁定的任务原样留下并排在前面，
 * 剩余名额才由新任务填补。名额算法而不是简单拼接——否则锁 3 条再重生成，
 * 这一周会超过 4 个任务的上限而存不回去。
 *
 * 新任务里与保留任务 id 重复的会被跳过，避免重生成命中同一条目时出现两份。
 */
export function replaceWeekTasks(
  plan: PathfinderPlan,
  weekNumber: number,
  incomingTasks: readonly EditedPlanTask[],
  pinnedTaskIds: readonly string[],
): PathfinderPlan {
  const week = plan.weeks.find((candidate) => candidate.week === weekNumber);
  if (!week) return plan;

  const pinned = week.tasks.filter((task) => pinnedTaskIds.includes(task.id));
  const slots = MAX_TASKS_PER_WEEK - pinned.length;
  const keptIds = new Set(pinned.map((task) => task.id));
  const fresh = incomingTasks.filter((task) => !keptIds.has(task.id)).slice(0, Math.max(0, slots));

  const tasks = [...pinned, ...fresh];
  // 全部锁定时没有空位，新任务无处安放——保持原样而不是清空这一周
  if (tasks.length < MIN_TASKS_PER_WEEK) return plan;

  return mapWeek(plan, weekNumber, (current) => ({ ...current, tasks }));
}

/** 切换锁定状态。锁定只是一组 id，不写进路径本身，便于独立存取。 */
export function withToggledPin(
  pinnedTaskIds: readonly string[],
  taskId: string,
): string[] {
  return pinnedTaskIds.includes(taskId)
    ? pinnedTaskIds.filter((id) => id !== taskId)
    : [...pinnedTaskIds, taskId];
}

/**
 * 清掉已经不在路径里的任务 id。
 *
 * 删除任务或重生成某一周后，完成状态与锁定状态里会残留指向已消失任务的 id。
 * 留着不会立刻出错，但会随着反复编辑越积越多，并让「已完成 3/5」这类计数虚高。
 */
export function pruneTaskIds(
  plan: PathfinderPlan,
  taskIds: readonly string[],
): string[] {
  const alive = new Set(plan.weeks.flatMap((week) => week.tasks.map((task) => task.id)));
  return taskIds.filter((id) => alive.has(id));
}
