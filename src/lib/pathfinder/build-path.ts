import type { PathfinderCatalogItem, PathfinderItemType } from './catalog-types';
import { catalogDeadlinePlanningTimestamp } from './catalog-view';
import { catalogItemViolations } from './contract';
import { rankCatalogItems, type RankedPathfinderItem } from './ranking';
import {
  PathfinderPlanSchema,
  type PathfinderPlan,
  type PathfinderPlanTask,
  type PathfinderPlanWeek,
  type PathfinderProfile,
} from './schema';

export interface BuildPathOptions {
  locale?: 'zh' | 'en';
  now: Date;
  preferredItemId?: string;
}

export type BuildPathResult =
  | { ok: true; plan: PathfinderPlan }
  | { ok: false; code: 'NO_ELIGIBLE_ITEMS'; message: string };

type Phase = PathfinderPlanWeek['phase'];

const PHASES_BY_DURATION: Record<number, readonly Phase[]> = {
  // 四周版把“交付”并入真实行动周的提交证据，仍保留最终复盘。
  4: ['prepare', 'practice', 'real-action', 'review'],
  5: ['prepare', 'practice', 'real-action', 'deliver', 'review'],
  6: ['prepare', 'practice', 'practice', 'real-action', 'deliver', 'review'],
  7: ['prepare', 'practice', 'practice', 'real-action', 'real-action', 'deliver', 'review'],
  8: ['prepare', 'prepare', 'practice', 'practice', 'real-action', 'real-action', 'deliver', 'review'],
};

const DIRECTION_LABELS = {
  zh: { ai: 'AI', frontend: '前端', backend: '后端', data: '数据' },
  en: { ai: 'AI', frontend: 'Frontend', backend: 'Backend', data: 'Data' },
} as const;

const PHASE_LABELS: Record<'zh' | 'en', Record<Phase, string>> = {
  zh: {
    prepare: '准备',
    practice: '练习',
    'real-action': '真实行动',
    deliver: '交付',
    review: '复盘',
  },
  en: {
    prepare: 'Prepare',
    practice: 'Practice',
    'real-action': 'Act',
    deliver: 'Deliver',
    review: 'Review',
  },
};

function clip(value: string, length: number): string {
  const normalized = value.trim();
  return normalized.length <= length ? normalized : `${normalized.slice(0, length - 1)}…`;
}

function validDeadline(value: string | null): string | undefined {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined;
}

function validDeadlineDate(value: string | null): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  return Number.isFinite(Date.parse(`${value}T00:00:00Z`)) ? value : undefined;
}

function targetItemType(goalType: PathfinderProfile['goalType']): PathfinderItemType {
  if (goalType === 'competition') return 'competition';
  if (goalType === 'internship') return 'internship';
  return 'open-source';
}

function buildPhases(
  durationWeeks: number,
  target: PathfinderCatalogItem | undefined,
  now: Date,
): Phase[] {
  const phases = [...(PHASES_BY_DURATION[durationWeeks] ?? PHASES_BY_DURATION[6])];
  if (!target || !['competition', 'internship'].includes(target.itemType)) {
    return phases;
  }

  const deadline = catalogDeadlinePlanningTimestamp(target);
  if (deadline === null) return phases;

  const daysRemaining = Math.max(0, Math.ceil((deadline - now.getTime()) / 86_400_000));
  const deadlineWeek = Math.max(1, Math.ceil(daysRemaining / 7));
  const latestActionIndex = Math.max(0, Math.min(phases.length - 1, deadlineWeek - 2));
  const currentActionIndex = phases.indexOf('real-action');

  // 至少保留一周准备，并给真实行动留出截止前缓冲；否则不把该机会硬塞进路径。
  if (latestActionIndex >= 1 && currentActionIndex > latestActionIndex) {
    phases.splice(currentActionIndex, 1);
    phases.splice(latestActionIndex, 0, 'real-action');
  }
  return phases;
}

function phasePool(
  phase: Phase,
  ranked: readonly RankedPathfinderItem[],
  targetType: PathfinderItemType,
  skillPrimary: RankedPathfinderItem,
  weekIndex: number,
  now: Date,
): readonly RankedPathfinderItem[] {
  if (phase === 'review') return [skillPrimary];

  if (phase === 'real-action' || phase === 'deliver') {
    const weekEndsAt = now.getTime() + (weekIndex + 1) * 7 * 86_400_000;
    const targetItems = ranked.filter(({ item }) => {
      if (item.itemType !== targetType) return false;
      const deadline = catalogDeadlinePlanningTimestamp(item);
      return deadline === null || weekEndsAt <= deadline;
    });
    if (targetItems.length > 0) return targetItems.slice(0, 2);
  }

  if (phase === 'prepare' || phase === 'practice') {
    const openSourceItems = ranked.filter(({ item }) => item.itemType === 'open-source');
    if (openSourceItems.length > 0) {
      if (skillPrimary.item.itemType === 'open-source') {
        return [skillPrimary, ...openSourceItems.filter(({ item }) => item.id !== skillPrimary.item.id)].slice(0, 2);
      }
      return openSourceItems.slice(0, 2);
    }
  }

  return [skillPrimary];
}

function buildAction(
  phase: Phase,
  item: PathfinderCatalogItem,
  locale: 'zh' | 'en',
  fragmented: boolean,
  selfGuided: boolean,
  goalType: PathfinderProfile['goalType'],
  occurrence: number,
): string {
  const title = clip(item.title[locale], 90);
  const split = fragmented
    ? locale === 'zh'
      ? '把任务拆成 3 次短时段完成。'
      : 'Split the task into three short sessions.'
    : '';
  const selfCheck = selfGuided
    ? locale === 'zh'
      ? '完成后按官方说明逐项自检，不等待导师反馈。'
      : 'Self-check each step against the official instructions instead of waiting for mentor feedback.'
    : '';

  if (locale === 'en') {
    const actions: Record<Phase, string> = {
      prepare: occurrence > 1
        ? `Set up the minimum environment for “${title}”, reproduce one official baseline, and record one failure plus its fix.`
        : `Read the verified entry “${title}”, list its prerequisites, and write down three terms to clarify.`,
      practice: occurrence > 1
        ? `Change one variable or implementation detail in the previous “${title}” exercise, compare the result, and explain the difference.`
        : `Use “${title}” to complete one smallest reproducible exercise and record every step.`,
      'real-action': occurrence > 1
        ? `Follow up the first real action for “${title}”: address one rule, review comment, or quality gap and record the improved result.`
        : buildRealAction(item.itemType, title, locale, goalType),
      deliver: `Turn the work based on “${title}” into one shareable result with a short README or application note.`,
      review: `Review the evidence from “${title}”, note one obstacle, one improvement, and the next concrete action.`,
    };
    return `${actions[phase]} ${split} ${selfCheck}`.trim();
  }

  const actions: Record<Phase, string> = {
    prepare: occurrence > 1
      ? `为「${title}」搭好最小环境，复现一项官方基线，并记录 1 个失败及修复过程。`
      : `阅读已核验条目「${title}」，列出参与前置条件，并记录 3 个需要查清的关键词。`,
    practice: occurrence > 1
      ? `在上一轮「${title}」练习中只改变 1 个变量或实现细节，对比结果并解释差异。`
      : `围绕「${title}」完成一个最小可复现练习，把每一步操作记录下来。`,
    'real-action': occurrence > 1
      ? `跟进「${title}」的第一次真实行动：处理 1 条规则、评审意见或质量缺口，并记录改进结果。`
      : buildRealAction(item.itemType, title, locale, goalType),
    deliver: `把基于「${title}」的本周工作整理成一个可分享成果，并附简短说明或申请备注。`,
    review: `复盘「${title}」相关证据，写下 1 个阻碍、1 个改进和下一步明确行动。`,
  };
  return `${actions[phase]}${split}${selfCheck}`;
}

function buildRealAction(
  itemType: PathfinderItemType,
  title: string,
  locale: 'zh' | 'en',
  goalType: PathfinderProfile['goalType'],
): string {
  if (locale === 'en') {
    if (itemType === 'competition') {
      return `Check the official eligibility and deadline for “${title}”, then complete the first real registration, team, or problem-analysis action.`;
    }
    if (itemType === 'internship') {
      return `Check the official eligibility and deadline for “${title}”, tailor one application artifact, and record the actual submission decision.`;
    }
    if (goalType === 'competition') {
      return `Turn the work in “${title}” into a demonstrable prototype or problem analysis for competition preparation; this does not imply that registration is open.`;
    }
    if (goalType === 'internship') {
      return `Turn the work in “${title}” into one evidence-backed project story for an application; this does not imply that a matching role is open.`;
    }
    return `Choose one realistically scoped issue in “${title}”, reproduce it, and prepare or submit one minimal contribution.`;
  }

  if (itemType === 'competition') {
    return `核对「${title}」的官方资格与截止时间，完成报名、组队或赛题拆解中的第一项真实行动。`;
  }
  if (itemType === 'internship') {
    return `核对「${title}」的官方资格与截止时间，针对岗位完善一份申请材料并记录真实投递决定。`;
  }
  if (goalType === 'competition') {
    return `把「${title}」中的实践整理成可演示原型或赛题分析，作为竞赛准备证据；这一步不代表当前已有可报名赛项。`;
  }
  if (goalType === 'internship') {
    return `把「${title}」中的实践整理成一段有证据的项目经历，作为申请材料；这一步不代表当前已有匹配岗位。`;
  }
  return `在「${title}」中选择一个范围可控的问题，完成复现，并准备或提交一次最小贡献。`;
}

function buildEvidence(phase: Phase, locale: 'zh' | 'en', occurrence: number): string {
  const evidence: Record<'zh' | 'en', Record<Phase, string>> = {
    zh: {
      prepare: '一页前置条件清单和 3 个关键词解释',
      practice: '可复现步骤、运行结果或带日期截图',
      'real-action': '报名、贡献、申请或明确放弃原因的记录',
      deliver: '可访问成果、提交记录或材料版本',
      review: '包含问题、改进与下一步的一页复盘',
    },
    en: {
      prepare: 'A one-page prerequisite checklist and explanations for three terms',
      practice: 'Reproduction steps plus a result or dated screenshot',
      'real-action': 'A registration, contribution, application, or documented no-go decision',
      deliver: 'A shareable result, submission record, or versioned application artifact',
      review: 'A one-page review covering obstacle, improvement, and next action',
    },
  };
  if (occurrence <= 1) return evidence[locale][phase];
  if (locale === 'zh') {
    if (phase === 'prepare') return '环境清单、基线运行日志和一次故障修复记录';
    if (phase === 'practice') return '两组对比结果、变量说明和差异结论';
    if (phase === 'real-action') return '评审或规则反馈、改动记录和更新后的成果';
  } else {
    if (phase === 'prepare') return 'Environment checklist, baseline log, and one documented fix';
    if (phase === 'practice') return 'Two comparable results, the changed variable, and a conclusion';
    if (phase === 'real-action') return 'Feedback or rule note, change record, and improved result';
  }
  return evidence[locale][phase];
}

function buildAlternative(
  alternative: RankedPathfinderItem | undefined,
  locale: 'zh' | 'en',
): string {
  if (alternative) {
    const title = clip(alternative.item.title[locale], 90);
    return locale === 'zh'
      ? `若当前条目不可用，改用同方向已核验条目「${title}」，保持相同产出标准。`
      : `If the current entry is unavailable, use the verified same-direction entry “${title}” with the same evidence standard.`;
  }
  return locale === 'zh'
    ? '若条目临时不可用，暂停执行并回到目录选择同方向的已核验条目，不自行使用失效链接。'
    : 'If the entry becomes unavailable, pause and choose another verified same-direction catalog entry; do not rely on an expired link.';
}

function taskMinutes(
  item: PathfinderCatalogItem,
  weeklyMinutes: number,
  fragmented: boolean,
): number {
  const defaultMinutes = Math.min(120, weeklyMinutes);
  const requested = item.estimatedMinutes ?? defaultMinutes;
  const fragmentedCap = fragmented ? Math.min(90, weeklyMinutes) : weeklyMinutes;
  const bounded = Math.max(30, Math.min(requested, fragmentedCap));
  return Math.ceil(bounded / 5) * 5;
}

function buildWarnings(
  profile: PathfinderProfile,
  items: readonly PathfinderCatalogItem[],
  ranked: readonly RankedPathfinderItem[],
  selected: readonly PathfinderCatalogItem[],
  target: PathfinderCatalogItem | undefined,
  options: Required<Pick<BuildPathOptions, 'locale' | 'now'>> & Pick<BuildPathOptions, 'preferredItemId'>,
): string[] {
  const warnings: string[] = [];
  const { locale, now, preferredItemId } = options;
  const targetType = targetItemType(profile.goalType);

  if (preferredItemId) {
    const preferred = items.find((item) => item.id === preferredItemId);
    if (!preferred) {
      warnings.push(locale === 'zh'
        ? '指定条目已不在当前目录中，路径已改用其他已核验条目。'
        : 'The requested entry is no longer in the catalog, so the plan uses another verified entry.');
    } else {
      const violations = catalogItemViolations(preferred, profile, now);
      if (violations.length > 0) {
        warnings.push(locale === 'zh'
          ? `指定条目不满足当前条件（${violations.map((violation) => violation.message).join('')}），未纳入路径。`
          : 'The requested entry does not meet the current constraints and was not included.');
      }
    }
  }

  if (
    ['competition', 'internship'].includes(profile.goalType)
    && !ranked.some(({ item }) => item.itemType === targetType)
  ) {
    warnings.push(locale === 'zh'
      ? '当前没有满足条件的对应机会，路径先安排能力准备，不承诺存在可报名或可投递名额。'
      : 'No matching opportunity currently meets the constraints; this plan focuses on preparation and does not promise an available opening.');
  }

  if (selected.some((item) => item.cost.amount === null)) {
    warnings.push(locale === 'zh'
      ? '部分条目费用尚未核实；执行前请查看官方页面，费用超出预算时使用替代项。'
      : 'Some costs are unverified. Check the official page first and use the alternative if the cost exceeds your budget.');
  }

  if (selected.some((item) => (
    item.cost.amount !== null && item.cost.amount > 0 && item.cost.currency !== 'CNY'
  ))) {
    warnings.push(locale === 'zh'
      ? '部分条目有已核实的外币费用；系统不会使用临时汇率猜测人民币金额，请在官网核对并自行判断预算。'
      : 'Some entries have verified fees in another currency. The planner does not guess a CNY conversion from a temporary exchange rate; verify the official fee against your budget.');
  }

  const opportunities = selected.filter(
    (item) => item.itemType === 'competition' || item.itemType === 'internship',
  );
  if (
    target
    && (target.itemType === 'competition' || target.itemType === 'internship')
    && catalogDeadlinePlanningTimestamp(target) !== null
    && !selected.some((item) => item.id === target.id)
  ) {
    warnings.push(locale === 'zh'
      ? `「${clip(target.title.zh, 70)}」截止太近，无法在保留准备步骤的前提下排入周计划；请立即在官网自行判断是否来得及，本路径不承诺可报名或投递。`
      : `“${clip(target.title.en, 70)}” closes too soon to fit after a preparation step. Check the official page immediately and decide whether there is still enough time; this path does not promise an application or submission.`);
  }
  if (opportunities.some((item) => catalogDeadlinePlanningTimestamp(item) === null)) {
    warnings.push(locale === 'zh'
      ? '部分机会没有可验证的标准截止时间，请以官方页面当前信息为准。'
      : 'Some opportunities have no verified normalized deadline; use the current official page as the source of truth.');
  }

  const seenDeadlineIds = new Set<string>();
  for (const item of opportunities) {
    if (seenDeadlineIds.has(item.id)) continue;
    seenDeadlineIds.add(item.id);
    const deadline = catalogDeadlinePlanningTimestamp(item);
    if (deadline === null) continue;

    const daysRemaining = Math.ceil((deadline - now.getTime()) / 86_400_000);
    if (daysRemaining < 7) {
      warnings.push(locale === 'zh'
        ? `「${clip(item.title.zh, 70)}」距截止不足一周，已前置真实行动；路径不承诺能够赶上。`
        : `“${clip(item.title.en, 70)}” closes in under a week. The real action is front-loaded, but the plan does not promise you can make the deadline.`);
    } else if (daysRemaining <= profile.durationWeeks * 7) {
      warnings.push(locale === 'zh'
        ? `「${clip(item.title.zh, 70)}」将在路径期间截止，相关行动已按截止时间前置。`
        : `“${clip(item.title.en, 70)}” closes during this plan, so its actions have been scheduled earlier.`);
    }
  }

  return warnings.slice(0, 20);
}

/** 使用可信目录条目生成 4–8 周确定性路径。 */
export function buildPath(
  profile: PathfinderProfile,
  items: readonly PathfinderCatalogItem[],
  options: BuildPathOptions,
): BuildPathResult {
  const locale = options.locale ?? 'zh';
  const now = options.now;
  const ranked = rankCatalogItems(items, profile, {
    now,
    preferredItemId: options.preferredItemId,
  });

  if (ranked.length === 0) {
    const limitedDataMessage = locale === 'zh'
      ? '当前目录暂无经核验的低流量任务。可在能够使用校园网或 Wi-Fi 时，将网络条件切换为“普通”后重试。'
      : 'The catalog currently has no verified low-data tasks. When campus network or Wi-Fi is available, switch the network setting to “Normal” and try again.';
    const genericMessage = locale === 'zh'
      ? '当前没有同时满足方向、设备、网络、预算与资格条件的已核验条目。'
      : 'No verified entry currently matches the selected direction, device, network, budget, and eligibility constraints.';
    const phoneOnlyMessage = locale === 'zh'
      ? '当前目录暂无经核验可用手机完成的实践项目。你仍可用手机浏览机会；能借用学校机房或电脑时，将设备切换为“有电脑”后重试。'
      : 'The catalog currently has no verified hands-on project that can be completed on a phone. You can still browse opportunities; when a campus lab or computer is available, switch to a device setting with a computer and try again.';
    const noFoundationMessage = locale === 'zh'
      ? '当前目录暂无能把“零基础”可靠衔接到该方向实践的入门条目，因此不会生成看似完整但跳过前置能力的路径。请先在课程中完成基础编程训练，或改为浏览目录与机会。'
      : 'The catalog currently has no verified beginner entry that can bridge zero foundation into hands-on work in this direction, so it will not generate a polished-looking plan that skips prerequisites. Complete an introductory programming course first, or browse the catalog and opportunities instead.';
    return {
      ok: false,
      code: 'NO_ELIGIBLE_ITEMS',
      message: profile.device === 'phone-only'
        ? phoneOnlyMessage
        : profile.network === 'limited-data'
          ? limitedDataMessage
          : profile.foundation === 'none' ? noFoundationMessage : genericMessage,
    };
  }

  const hasPracticeResource = ranked.some(({ item }) => item.itemType === 'open-source');
  if (profile.device === 'phone-only' && !hasPracticeResource) {
    return {
      ok: false,
      code: 'NO_ELIGIBLE_ITEMS',
      message: locale === 'zh'
        ? '当前目录只有可用手机浏览或报名的机会入口，暂无经核验可用手机完成的实践项目。你仍可先用手机核对资格与截止时间；能借用学校机房或电脑时，将设备切换为“有电脑”后再生成路径。'
        : 'The current catalog only has opportunities that can be browsed or registered for by phone, not a verified hands-on project that can be completed on a phone. You can still check eligibility and deadlines now; when a campus lab or computer is available, switch the device setting to one with a computer and generate the path again.',
    };
  }

  const profileTargetType = targetItemType(profile.goalType);
  const preferred = options.preferredItemId
    ? ranked.find(({ item }) => item.id === options.preferredItemId)
    : undefined;
  const effectiveTargetType = preferred
    && (preferred.item.itemType === 'competition' || preferred.item.itemType === 'internship')
    ? preferred.item.itemType
    : profileTargetType;
  const targetRanked = (
    preferred && (preferred.item.itemType === 'competition' || preferred.item.itemType === 'internship')
      ? preferred
      : ranked.find(({ item }) => item.itemType === effectiveTargetType)
  );
  const skillPrimary = (
    preferred?.item.itemType === 'open-source'
      ? preferred
      : ranked.find(({ item }) => item.itemType === 'open-source')
  ) ?? ranked[0];
  const target = targetRanked?.item;
  const phases = buildPhases(profile.durationWeeks, target, now);
  const weeklyMinutes = profile.weeklyHours * 60;
  const fragmented = profile.constraints.includes('fragmented-time');
  const selfGuided = profile.constraints.includes('no-mentor');
  const selected: PathfinderCatalogItem[] = [];
  const phaseOccurrences = new Map<Phase, number>();

  const weeks: PathfinderPlanWeek[] = phases.map((phase, index) => {
    const occurrence = (phaseOccurrences.get(phase) ?? 0) + 1;
    phaseOccurrences.set(phase, occurrence);
    const pool = phasePool(phase, ranked, effectiveTargetType, skillPrimary, index, now);
    const rankedItem = pool[0];
    const item = rankedItem.item;
    selected.push(item);

    const alternative = ranked.find(({ item: candidate }) => candidate.id !== item.id);
    const estimatedMinutes = taskMinutes(item, weeklyMinutes, fragmented);
    const deadlineAt = validDeadline(item.deadlineAt);
    const deadlineDate = validDeadlineDate(item.deadlineDate);
    const task: PathfinderPlanTask = {
      id: clip(`week-${index + 1}-${item.id}`, 240),
      action: clip(buildAction(
        phase,
        item,
        locale,
        fragmented,
        selfGuided,
        profile.goalType,
        occurrence,
      ), 500),
      estimatedMinutes,
      itemId: item.id,
      evidence: buildEvidence(phase, locale, occurrence),
      alternative: clip(buildAlternative(alternative, locale), 500),
      ...(deadlineAt ? { deadlineAt } : {}),
      ...(!deadlineAt && deadlineDate ? { deadlineDate } : {}),
    };

    const phaseLabel = PHASE_LABELS[locale][phase];
    return {
      week: index + 1,
      phase,
      title: locale === 'zh'
        ? `第 ${index + 1} 周 · ${phaseLabel}`
        : `Week ${index + 1} · ${phaseLabel}`,
      objective: locale === 'zh'
        ? `围绕「${clip(item.title.zh, 90)}」完成本周${phaseLabel}产出。`
        : `Complete this week’s ${phaseLabel.toLowerCase()} outcome with “${clip(item.title.en, 90)}”.`,
      estimatedMinutes,
      tasks: [task],
    };
  });

  const warnings = buildWarnings(profile, items, ranked, selected, target, {
    locale,
    now,
    preferredItemId: options.preferredItemId,
  });
  const direction = DIRECTION_LABELS[locale][profile.direction];
  const title = locale === 'zh'
    ? `${direction} · ${profile.durationWeeks} 周行动路径`
    : `${direction} · ${profile.durationWeeks}-week action path`;
  const summary = locale === 'zh'
    ? `围绕“${clip(profile.goal, 110)}”，按准备、练习、真实行动、交付与复盘推进；所有任务只引用当前已发布且可学习的目录条目。`
    : `Work toward “${clip(profile.goal, 110)}” through preparation, practice, real action, delivery, and review. Every task references a currently published, learning-eligible catalog entry.`;

  const plan = PathfinderPlanSchema.parse({
    version: 2,
    title,
    summary,
    durationWeeks: profile.durationWeeks,
    generatedAt: now.toISOString(),
    warnings,
    weeks,
  });

  return { ok: true, plan };
}
