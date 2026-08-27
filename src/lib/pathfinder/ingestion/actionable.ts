/**
 * 开源任务「能不能真的上手」的判定。
 *
 * 原来的判据只有「issue 是开着的」，于是推荐里混进了大量做不动的东西：实测
 * 生产库 68 条开源任务中 56 条（82%）发布超过一年、35 条超过三年，最老的一条
 * 是 2016 年的 TypeScript issue。一个挂了十年的「Good First Issue」不好做，
 * 通常不是因为它难，而是因为没人管——学生照着做完也没人合。
 *
 * 判据分两层：
 *
 * - **查询层**（见 `sources.ts`）：`no:assignee` 与 `-linked:pr` 把「已经有人在做」
 *   的挡在外面，`updated:>=` 划出活跃窗口。这些由 GitHub 在服务端过滤，不消耗
 *   我们的请求配额。
 * - **解析层**（本文件）：查询层拿不到或表达不了的判据在这里补——issue 的**年龄**
 *   与**维护者是否回应过**。GitHub 的 `updated` 会被机器人改标签刷新，所以
 *   「最近有更新」不等于「还活着」，必须结合创建时间和讨论数一起看。
 *
 * 全部是纯函数，输入是 GitHub 搜索接口原样返回的字段，便于逐条钉测试。
 */

/** 判定所需的字段，取自 GitHub 搜索接口返回的 issue 对象。 */
export interface IssueActivity {
  /** issue 创建时间 */
  createdAt: string | null;
  /** 最后一次活动时间（含机器人改标签） */
  updatedAt: string | null;
  /** 讨论数。0 表示从来没有人回应过 */
  comments: number;
  /** 该条目本身就是 PR（搜索结果里混入的） */
  isPullRequest: boolean;
  /** 已指派给具体的人 */
  hasAssignee: boolean;
}

/**
 * 超过这个年龄且**从未有人回应**的 issue 视为无人认领。
 *
 * 单看年龄会误伤：成熟项目里确实有两三年前提出、维护者一直认可、只是没人动手
 * 的好任务。加上「零讨论」这个条件才指向真正的「提了就没人理」。
 */
const SILENT_ISSUE_MAX_AGE_DAYS = 540;

/**
 * 无论有没有讨论，超过这个年龄都不再推荐。
 *
 * 三年前的 issue 即便当时讨论热烈，代码基线也多半已经改得面目全非，
 * 贡献指南、构建方式、相关模块都可能不一样了。
 */
const HARD_MAX_AGE_DAYS = 1095;

/** 最近这么久没有任何活动就当作停滞。 */
const MAX_IDLE_DAYS = 365;

/**
 * 讨论数上限。
 *
 * 超长讨论串通常意味着方案没谈拢、或者牵扯面比标签显示的大得多。
 * 对第一次给开源提 PR 的学生来说，这类 issue 的实际难度远高于「good first issue」
 * 的承诺。
 */
const MAX_COMMENTS = 60;

function ageInDays(iso: string | null, now: Date): number | null {
  if (!iso) return null;
  const parsed = Date.parse(iso);
  if (!Number.isFinite(parsed)) return null;
  return (now.getTime() - parsed) / 86_400_000;
}

/** 判定失败时给出原因，便于同步日志里看清楚为什么少了条目。 */
export type NotActionableReason =
  | 'pull-request'
  | 'assigned'
  | 'idle'
  | 'too-old'
  | 'silent-and-old'
  | 'too-contentious';

/**
 * 返回 null 表示可以上手；否则返回不推荐的原因。
 *
 * 缺字段时**放行**：GitHub 偶尔不返回某个字段，而查询层已经做过一轮过滤，
 * 在这里因为字段缺失就丢掉条目，会让目录随上游响应的抖动忽多忽少。
 */
export function notActionableReason(
  activity: IssueActivity,
  now = new Date(),
): NotActionableReason | null {
  if (activity.isPullRequest) return 'pull-request';
  if (activity.hasAssignee) return 'assigned';

  const idle = ageInDays(activity.updatedAt, now);
  if (idle !== null && idle > MAX_IDLE_DAYS) return 'idle';

  const age = ageInDays(activity.createdAt, now);
  if (age !== null && age > HARD_MAX_AGE_DAYS) return 'too-old';
  if (age !== null && age > SILENT_ISSUE_MAX_AGE_DAYS && activity.comments === 0) {
    return 'silent-and-old';
  }

  if (activity.comments > MAX_COMMENTS) return 'too-contentious';
  return null;
}

export function isActionableIssue(activity: IssueActivity, now = new Date()): boolean {
  return notActionableReason(activity, now) === null;
}
