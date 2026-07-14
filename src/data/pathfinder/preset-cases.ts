import { resolveResources, type PathfinderResource } from '@/data/pathfinder-resources';
import type { PathfinderInput, PathfinderPlan } from '@/lib/pathfinder/schema';

export interface PresetCase {
  id: 'phone-zero-budget' | 'part-time-interrupted' | 'no-mentor-help-card';
  title: string;
  isPreset: true;
  scenario: string;
  input: PathfinderInput;
  result: {
    plan: PathfinderPlan;
    resources: PathfinderResource[];
    source: 'preset';
  };
}

function presetResult(plan: PathfinderPlan) {
  return {
    plan,
    resources: resolveResources(plan.resourceIds),
    source: 'preset' as const,
  };
}

/**
 * 评委可直接体验的典型场景。
 * 这些是静态演示数据，不会调用模型，也不代表真实用户或调研结果。
 */
export const PRESET_CASES: readonly PresetCase[] = [
  {
    id: 'phone-zero-budget',
    title: '仅手机、零预算',
    isPreset: true,
    scenario: '为首份实习学习信息检索与表达：只有手机、每天 30 分钟、流量有限。',
    input: {
      goal: '为第一份实习学习信息检索与岗位表达',
      stage: '大学',
      device: '仅手机',
      weeklyHours: 4,
      dailyMinutes: 30,
      budget: 0,
      hasMentor: false,
      network: '流量有限',
      constraints: ['时间碎片化', '预算有限', '缺少指导'],
    },
    result: presetResult({
      summary: '你不需要先拥有电脑或付费课程。先用手机练习看懂岗位信息、提炼关键词，再把它写成自己的表达。',
      todaySteps: [
        '打开手机浏览器，搜索 3 个公开招聘或实习信息来源。',
        '从其中 2 个岗位描述里各记下 1 个重复出现的能力关键词。',
        '把两个关键词写进备忘录，并标注自己已经会或想补齐的部分。',
      ],
      weekPlan: [
        { day: 1, title: '记录两个岗位关键词，建立手机备忘录', minutes: 15, cost: 0, device: '手机', network: '低流量', evidence: '笔记' },
        { day: 2, title: '阅读一篇公开求职流程指引，圈出一个不懂的环节', minutes: 20, cost: 0, device: '手机', network: '低流量', evidence: '笔记' },
        { day: 3, title: '把一段课程或社团经历改写成三行能力描述', minutes: 25, cost: 0, device: '手机', network: '低流量', evidence: '完成记录' },
        { day: 4, title: '查看一个实习岗位，提取需要准备的两项材料', minutes: 20, cost: 0, device: '手机', network: '低流量', evidence: '截图' },
        { day: 5, title: '用备忘录写出自己的三行自我介绍', minutes: 25, cost: 0, device: '手机', network: '低流量', evidence: '笔记' },
        { day: 6, title: '对照岗位关键词，补充一条可证明的经历', minutes: 20, cost: 0, device: '手机', network: '低流量', evidence: '完成记录' },
        { day: 7, title: '复盘本周记录，确定下周只补一个能力关键词', minutes: 10, cost: 0, device: '手机', network: '低流量', evidence: '笔记' },
      ],
      resourceIds: ['job-search-info', 'resume-template-free', 'note-taking-method'],
      encouragement: '第一份实习的准备，不必从完美简历开始；先看懂一个岗位，就是在靠近它。',
    }),
  },
  {
    id: 'part-time-interrupted',
    title: '兼职中断、碎片时间',
    isPreset: true,
    scenario: '兼职经常打断学习，只能用每天 20 分钟整理简历与作品记录。',
    input: {
      goal: '在碎片时间完成第一版简历与作品整理',
      stage: '大学',
      device: '手机和电脑',
      weeklyHours: 3,
      dailyMinutes: 20,
      budget: 0,
      hasMentor: true,
      network: '普通网络',
      constraints: ['时间碎片化', '预算有限'],
    },
    result: presetResult({
      summary: '不用等到有完整周末。把简历拆成每天一块可见的小材料，临时被打断也不会丢掉已经完成的部分。',
      todaySteps: [
        '选一段最熟悉的经历，不追求完整，只写下发生了什么。',
        '把行动、结果、学到的内容各写成一句。',
        '保存为“简历素材 01”，明天只补充一处细节。',
      ],
      weekPlan: [
        { day: 1, title: '将一段过往经历写成三行简历要点', minutes: 15, cost: 0, device: '手机', network: '普通', evidence: '完成记录' },
        { day: 2, title: '为第一条经历补一个可核对的结果', minutes: 15, cost: 0, device: '手机', network: '普通', evidence: '笔记' },
        { day: 3, title: '整理一个作品或课程作业的名称与链接', minutes: 20, cost: 0, device: '手机', network: '普通', evidence: '截图' },
        { day: 4, title: '把常用联系方式与技能名称集中到一页', minutes: 15, cost: 0, device: '手机', network: '普通', evidence: '完成记录' },
        { day: 5, title: '用免费简历功能录入一条完整经历', minutes: 20, cost: 0, device: '电脑', network: '普通', evidence: '截图' },
        { day: 6, title: '请可信任的人只看一处表述是否清楚', minutes: 15, cost: 0, device: '手机', network: '普通', evidence: '完成记录' },
        { day: 7, title: '删除一条空泛描述，替换为具体行动', minutes: 15, cost: 0, device: '手机', network: '普通', evidence: '笔记' },
      ],
      resourceIds: ['resume-template-free', 'internship-prep', 'note-taking-method'],
      encouragement: '被打断不等于前功尽弃。保住一条可复用的素材，就是在继续前进。',
    }),
  },
  {
    id: 'no-mentor-help-card',
    title: '没有导师、不敢求助',
    isPreset: true,
    scenario: '没有可以长期请教的人，希望用低压力方式完成第一次职业求助。',
    input: {
      goal: '用低压力方式向前辈请教第一份实习准备',
      stage: '大学',
      device: '仅手机',
      weeklyHours: 3,
      dailyMinutes: 20,
      budget: 0,
      hasMentor: false,
      network: '普通网络',
      constraints: ['缺少指导', '时间碎片化', '预算有限'],
    },
    result: presetResult({
      summary: '求助不需要先认识“导师”。先准备一个具体、可拒绝、只占 5 分钟的问题，让第一次开口更轻。',
      todaySteps: [
        '写下你最想了解的一件具体事情，例如“简历中的项目经历怎么写”。',
        '复制这句话：我想了解___，您方便时能否指点 5 分钟？',
        '把这句话保存到备忘录，先不发送也算完成第一步。',
      ],
      weekPlan: [
        { day: 1, title: '写出一个只需 5 分钟回答的具体问题', minutes: 15, cost: 0, device: '手机', network: '普通', evidence: '笔记' },
        { day: 2, title: '把问题放进低压力求助模板', minutes: 15, cost: 0, device: '手机', network: '普通', evidence: '完成记录' },
        { day: 3, title: '列出一位可联系的学长学姐、老师或就业老师', minutes: 15, cost: 0, device: '手机', network: '低流量', evidence: '笔记' },
        { day: 4, title: '核对对方公开的联系方式与合适的发送时段', minutes: 15, cost: 0, device: '手机', network: '普通', evidence: '截图' },
        { day: 5, title: '发送一次简短、可拒绝的求助信息', minutes: 15, cost: 0, device: '手机', network: '普通', evidence: '完成记录' },
        { day: 6, title: '把得到的建议改写成下一步行动', minutes: 20, cost: 0, device: '手机', network: '普通', evidence: '笔记' },
        { day: 7, title: '为下次求助保存一条有效表达', minutes: 15, cost: 0, device: '手机', network: '低流量', evidence: '完成记录' },
      ],
      resourceIds: ['help-seeking-guide', 'expression-course', 'internship-prep'],
      encouragement: '求助不是打扰。把问题说得具体，就是在为自己争取一条新的路径。',
    }),
  },
] as const;
