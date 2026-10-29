import type { MastersRegion, MastersRoundDetails, MastersRoundInput } from '@/lib/masters/types';

const base = {
  studyType: 'research', eventType: 'application', opensOn: null, openingState: 'unknown',
  deadlineStatus: 'unverified', deadlineOn: null, deadlineAt: null, deadlineTimeZone: null,
  deadlineText: '等待本年度官网同步核验', rolling: false, mayCloseEarly: false,
} as const;

function seed(id: string, region: MastersRegion, details: MastersRoundDetails, intakeYear = 2027): MastersRoundInput {
  return { id, region, intakeYear, status: 'draft', verifiedOn: null, details };
}

/** 只提供项目身份和轮次模板；日期必须每次从当期官网重新取得，初始化不能发布。 */
export const phdSeeds: MastersRoundInput[] = [
  ...[
    { id: 'main', name: '主轮', year: 2027, month: 9 },
    { id: 'clearing-1', name: '第一补录轮', year: 2027, month: 9 },
    { id: 'clearing-2', name: '第二补录轮', year: 2028, month: 1 },
  ].map(round => seed(`phd-hku-cs-${round.year}-${round.id}`, 'hong-kong', {
    ...base, university: '香港大学', programme: 'PhD in Computer Science',
    subject: '计算机科学', studyMode: '3年制/4年制博士项目，均提供全日制及非全日制模式（修读年限依模式）',
    intakeLabel: `${round.year}年${round.month}月入学（2027/28学年）`,
    applicantGroup: '计算机科学博士常规申请者，含非本地申请者；HKPFS初始申请另有要求', roundName: round.name,
    openingNote: '等待官网重新核验申请期。',
    officialUrl: 'https://www.cs.hku.hk/programmes/research-postgraduate/',
    sourceNote: '计算机科学系当期招生轮次与研究生院申请日程交叉核验后发布；补录以剩余名额为条件，HKPFS初始申请另有要求。',
  }, round.year)),
  seed('phd-smu-cs-2027-august', 'singapore', {
    ...base, university: 'Singapore Management University', programme: 'PhD in Computer Science',
    subject: '计算机科学', studyMode: '全日制', intakeLabel: '2027年8月入学',
    applicantGroup: 'SMU计算机科学博士全日制申请者，含国际申请者', roundName: '8月入学申请期',
    openingNote: '等待官网重新核验申请期。',
    officialUrl: 'https://computing.smu.edu.sg/phd/online-application',
    sourceNote: 'SCIS博士项目总览 https://computing.smu.edu.sg/phd 明确提供PhD in Computer Science；本申请期适用于全日制博士，非兼读制申请。',
  }),
  seed('phd-must-research-2027-general-1', 'macau', {
    ...base, university: '澳门科技大学', programme: '校级博士普通申请',
    subject: '研究学位', studyMode: '以所选博士课程要求为准', intakeLabel: '2027/28 入学季',
    applicantGroup: '适用校级普通入学日程的博士申请者；推免、保荐、本科直博及另列特殊课程不适用',
    roundName: '普通入学第一轮', openingNote: '等待官网重新核验申请期。', mayCloseEarly: true,
    officialUrl: 'https://sgs.must.edu.mo/page/id-3170.html',
    sourceNote: '仅采集研究生院校级普通入学轮次；具体博士课程资格和特殊招生日期须查所选课程，额满可提前截止。',
  }),
  ...[
    { id: 'scholarship', name: '奖学金考虑截止', eventType: 'scholarship' },
    { id: 'final', name: '预计最终申请截止', eventType: 'application' },
  ].map(round => seed(`phd-oxford-cs-2027-${round.id}`, 'uk', {
    ...base, eventType: round.eventType as 'application' | 'scholarship',
    university: 'University of Oxford', programme: 'DPhil in Computer Science', subject: '计算机科学与人工智能',
    studyMode: '全日制，通常3至4年', intakeLabel: '2027/28 入学季',
    applicantGroup: '该DPhil项目申请者，含海外申请者；部分奖学金另需单独申请', roundName: round.name,
    openingNote: '等待官网重新核验申请期。',
    officialUrl: 'https://www.ox.ac.uk/admissions/graduate/courses/dphil-computer-science',
    sourceNote: '项目页将Oxford奖学金考虑截止与预计最终申请截止分别列出；需获取可解析的当期页面后才自动公开。',
  })),
  seed('phd-griffith-research-2027-international-scholarship-2', 'australia', {
    ...base, eventType: 'scholarship', university: 'Griffith University',
    programme: 'PhD（International Griffith Pathway研究奖学金）', subject: '研究学位',
    studyMode: '以所选博士项目及奖学金规则为准', intakeLabel: '2027年4月或7月入学',
    applicantGroup: '仅International Griffith Pathway：近十年在Griffith完成或正在完成Honours、Masters或Graduate Diploma，含至少40学分研究内容',
    roundName: '国际生奖学金第二轮', openingNote: '等待官网重新核验申请期。',
    officialUrl: 'https://www.griffith.edu.au/apply/research-study',
    sourceNote: '此项是有本校学习经历门槛的国际生奖学金轮次，不是所有国际生的博士申请截止；申请录取和申请奖学金必须分开核对。',
  }),
];
