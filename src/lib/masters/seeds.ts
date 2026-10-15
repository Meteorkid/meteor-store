import type { MastersRegion, MastersRoundDetails, MastersRoundInput } from './types';

const VERIFIED_ON = '2026-10-14';
const base = {
  studyType: 'taught', eventType: 'application', opensOn: null, openingState: 'unknown',
  deadlineStatus: 'confirmed', deadlineAt: null, deadlineTimeZone: null,
  rolling: false, mayCloseEarly: false,
} as const;

function seed(id: string, region: MastersRegion, details: MastersRoundDetails): MastersRoundInput {
  return { id, region, intakeYear: 2027, status: 'draft', verifiedOn: VERIFIED_ON, details };
}

/** 仅是官方核验后的首批待审数据，不代表五地区全部项目，也不自动沿用到下一入学年。 */
export const mastersSeeds: MastersRoundInput[] = [
  ...[
    { id: 'main', name: '主轮', date: '2026-12-01' },
    { id: 'clearing', name: '补录轮', date: '2027-04-30' },
  ].map((round) => seed(`hku-msccs-general-2027-${round.id}`, 'hong-kong', {
    ...base, university: '香港大学', programme: 'MSc in Computer Science（General Stream，无 Delta X Fellowship）',
    subject: '计算机科学', studyMode: '全日制，标准学制1年', intakeLabel: '2027/28 秋季（2027年9月）',
    applicantGroup: '申请 General Stream 且不选择 Delta X Fellowship 的申请者，含非本地申请者',
    roundName: round.name, openingNote: '项目页已公布本轮截止；未在该页确认具体开放日。',
    deadlineOn: round.date, deadlineAt: `${round.date}T12:00:00+08:00`, deadlineTimeZone: 'Asia/Hong_Kong',
    deadlineText: `${round.date} 香港时间中午12:00`,
    officialUrl: 'https://master.cds.hku.hk/msccs/about/msc-in-computer-science-application-procedure-2027-28/',
    sourceNote: '项目官方页明确2027/28秋季主轮及补录时间，均为HKT noon。此记录限定一般方向、无Fellowship路径；含Fellowship的路径和上海教学安排另行区分。未将未来截止推断为当前已开放。',
  })),
  ...[
    { phase: 1, date: '2026-10-11' }, { phase: 2, date: '2026-11-29' },
    { phase: 3, date: '2027-01-10' }, { phase: 4, date: '2027-02-28' },
  ].map((round) => seed(`hkust-mimt-2027-phase-${round.phase}`, 'hong-kong', {
    ...base, university: '香港科技大学', programme: 'MSc in International Management（MIMT）',
    subject: '国际管理', studyMode: '全日制，1年', intakeLabel: '2027/28 入学季',
    applicantGroup: 'MIMT一般申请，含国际申请者；CEMS选项另有交换安排', roundName: `第${round.phase}轮`,
    openingState: 'open', openingNote: '官方表示2026年9月起接受申请并滚动审理，未披露具体开放日。',
    deadlineOn: round.date, deadlineAt: `${round.date}T23:59:00+08:00`, deadlineTimeZone: 'Asia/Hong_Kong',
    deadlineText: `${round.date} 23:59 香港时间`, rolling: true,
    officialUrl: 'https://mimt.hkust.edu.hk/admissions/application-deadlines-procedures',
    sourceNote: '2027/28项目官方页同时列出滚动审理和四轮截止，所有轮次23:59 HK Time。国际申请者应预留签证时间；第三、四轮CEMS申请不享有交换选校优先权。申请材料需完整。',
  })),
  seed('cityu-macau-fintech-2027', 'macau', {
    ...base, university: '澳门城市大学', programme: 'Master of Science in Financial Technology',
    subject: '金融科技', studyMode: '全日制，通常2年（最长4年）', intakeLabel: '2027/2028 入学季',
    applicantGroup: '该项目一般申请者；具体身份资格与入学考试按招生处要求', roundName: '项目申请截止',
    openingNote: '项目页提供2027/2028申请入口，未明确开放日或轮次起始。',
    deadlineOn: '2027-04-30', deadlineText: '2027 / 4 / 30（官方仅列日期）',
    officialUrl: 'https://fof.cityu.edu.mo/en/masterofscienceinfintech',
    sourceNote: '项目官方页在2027/2028申请入口下明确截止2027/4/30；没有截止时刻、时区或分轮次信息，不能补成23:59。未把其他学校或校级招生日程套用到本项目。',
  }),
  seed('nus-mcomp-infosec-2027-august', 'singapore', {
    ...base, university: '新加坡国立大学', programme: 'Master of Computing（Infocomm Security Specialisation）',
    subject: '计算机与信息安全', studyMode: '待核验（本申请页未注明修读模式及学制）', intakeLabel: '2027年8月入学',
    applicantGroup: 'MComp with Specialisations申请者，含国际申请者；本记录为信息安全方向', roundName: '8月入学申请期',
    opensOn: '2026-10-01', openingState: 'scheduled', openingNote: '官方申请表明确开放日2026-10-01。',
    deadlineOn: '2027-01-31', deadlineText: '31 January 2027（未公布具体时刻和时区）',
    officialUrl: 'https://www.comp.nus.edu.sg/programmes/pg/misc/application/',
    sourceNote: '官方申请期为2026-10-01至2027-01-31，对应8月入学。须在截止前提交完整申请并缴费；国际申请者材料要求单列。未将此日期当作奖学金期限，未擅自补时区或23:59。',
  }),
  seed('oxford-advanced-cs-2027-final', 'uk', {
    ...base, university: 'University of Oxford', programme: 'MSc in Advanced Computer Science',
    subject: '计算机科学', studyMode: '全日制，12个月', intakeLabel: '2027/28（预计2027-10-10开学）',
    applicantGroup: '该项目2027/28入学申请者，含海外申请者', roundName: '最终申请截止',
    openingState: 'open', openingNote: '核验时项目页明确显示Open，未在该页公布具体开放日。',
    deadlineOn: '2027-01-06', deadlineAt: '2027-01-06T12:00:00Z', deadlineTimeZone: 'Europe/London',
    deadlineText: '6 January 2027, 12:00 midday UK time',
    officialUrl: 'https://www.ox.ac.uk/admissions/graduate/courses/msc-advanced-computer-science',
    sourceNote: '官方项目页明确2027/28最终截止为1月6日英国时间中午；该日英国使用GMT。按一月截止提交可获多数Oxford奖学金自动考虑，但需要单独申请的奖学金仍须另查条件和期限。',
  }),
  ...[
    { id: 'semester-1', label: '2027 Semester 1（2027-02-22开学）', date: '2026-11-30', rule: '第一学期为入学前一年11月30日' },
    { id: 'semester-2', label: '2027 Semester 2（2027-07-26开学）', date: '2027-05-31', rule: '第二学期为入学当年5月31日' },
  ].map((term) => seed(`uq-computer-science-2027-international-${term.id}`, 'australia', {
    ...base, university: 'The University of Queensland', programme: 'Master of Computer Science（5522）',
    subject: '计算机科学', studyMode: '国际学生全日制，1年或1.5年（依入学资格）', intakeLabel: term.label,
    applicantGroup: '国际申请者，含拟持学生签证赴澳者；非本地学生截止', roundName: '国际申请截止',
    openingNote: '2027项目页有申请入口，但未核实具体申请开放日。',
    deadlineOn: term.date, deadlineText: `${term.date}（${term.rule}；仅日期）`,
    officialUrl: 'https://study.uq.edu.au/study-options/programs/master-computer-science-5522?year=2027',
    sourceNote: `已核项目2027版原始HTML中data-student-type="international"的Important dates：${term.rule}。页面未公布截止时刻/时区；domestic块另列1月31日/6月30日，不适用于本记录。`,
  })),
];
