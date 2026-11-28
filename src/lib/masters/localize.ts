import type { MastersRound } from './types';

/**
 * The admissions database keeps official Chinese source labels for accuracy.
 * English pages translate only the structured facets (university, programme,
 * subject, round and intake) and leave quoted source notes in their original
 * language, where SourceLanguageNote explains why.
 */
const UNIVERSITY_EN: Record<string, string> = {
  新加坡国立大学: 'National University of Singapore',
  澳门城市大学: 'City University of Macau',
  澳门科技大学: 'Macau University of Science and Technology',
  香港大学: 'The University of Hong Kong',
  香港科技大学: 'The Hong Kong University of Science and Technology',
};

const PROGRAMME_EN: Record<string, string> = {
  'MSc in Computer Science（General Stream，无 Delta X Fellowship）':
    'MSc in Computer Science (General Stream, without Delta X Fellowship)',
  校级博士普通申请: 'University-wide PhD general application',
  'PhD（International Griffith Pathway研究奖学金）':
    'PhD (International Griffith Pathway Research Scholarship)',
};

const SUBJECT_EN: Record<string, string> = {
  国际管理: 'International Management',
  '计算机与信息安全': 'Computing and Information Security',
  计算机科学: 'Computer Science',
  '计算机科学与人工智能': 'Computer Science and Artificial Intelligence',
  金融科技: 'Financial Technology',
  研究学位: 'Research degree',
};

const INTAKE_EN: Record<string, string> = {
  '2027 Semester 1': 'Semester 1, 2027',
  '2027 Semester 2': 'Semester 2, 2027',
  '2027/2028 入学季': '2027/28 intake',
  '2027/28 入学季': '2027/28 intake',
  '2027/28 秋季（2027年9月）': 'Fall 2027 (September 2027)',
  '2027年4月或7月入学': 'April or July 2027 entry',
  '2027年8月入学': 'August 2027 intake',
  '2027年9月入学（2027/28学年）': 'September 2027 entry (2027/28 academic year)',
};

const STUDY_MODE_EN: Record<string, string> = {
  '全日制，1年': 'Full-time, 1 year',
  '全日制，标准学制1年': 'Full-time, standard duration 1 year',
  '国际学生全日制，1年或1.5年（依入学资格）': 'Full-time for international students, 1 or 1.5 years (depending on qualifications)',
  '全日制，通常2年（最长4年）': 'Full-time, normally 2 years (maximum 4 years)',
  '全日制，通常3至4年': 'Full-time, normally 3–4 years',
  '3年制/4年制博士项目，均提供全日制及非全日制模式（修读年限依模式）':
    '3-year / 4-year PhD programmes, offered full-time and part-time (duration depends on mode)',
  '以所选博士课程要求为准': 'Depends on the chosen PhD programme requirements',
  '以所选博士项目及奖学金规则为准': 'Depends on the chosen PhD programme and scholarship rules',
  全日制: 'Full-time',
  '待核验（本申请页未注明修读模式及学制）': 'Not verified (study mode and duration are not stated on this application page)',
};

const APPLICANT_GROUP_EN: Record<string, string> = {
  '计算机科学博士常规申请者，含非本地申请者；HKPFS初始申请另有要求':
    'Regular PhD in Computer Science applicants, including non-local applicants; HKPFS initial applications have separate requirements',
  'SMU计算机科学博士全日制申请者，含国际申请者':
    'Full-time SMU PhD in Computer Science applicants, including international applicants',
  '适用校级普通入学日程的博士申请者；推免、保荐、本科直博及另列特殊课程不适用':
    'PhD applicants under the university-wide general admission schedule; exempted, recommended, direct bachelor-to-PhD and separately listed special programmes do not apply',
  '该DPhil项目申请者，含海外申请者；部分奖学金另需单独申请':
    'Applicants to this DPhil programme, including overseas applicants; some scholarships require a separate application',
  '仅International Griffith Pathway：近十年在Griffith完成或正在完成Honours、Masters或Graduate Diploma，含至少40学分研究内容':
    'International Griffith Pathway only: completed or currently completing Honours, Masters or Graduate Diploma at Griffith within the last ten years, including at least 40 credit points of research',
};

const OPENING_NOTE_EN: Record<string, string> = {
  '等待官网重新核验申请期。': 'Waiting for the official site to reconfirm the application window.',
  '官方当期申请说明明确开放日：2026-08-01。':
    'The current official application notice confirms the opening date: 2026-08-01.',
  '研究生院明确本轮申请开放日：2026-09-01。补录须有剩余名额。':
    'The graduate school confirms this round opened on 2026-09-01. Supplementary rounds require places to remain.',
};

const DEADLINE_TEXT_EN: Record<string, string> = {
  等待本年度官网同步核验: 'Waiting for the current official site to be verified',
  国际申请截止: 'International application deadline',
  项目申请截止: 'Programme application deadline',
  国际学生截止: 'International student deadline',
};

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function englishIntake(value: string): string {
  const known = INTAKE_EN[value];
  if (known) return known;
  const single = /^(\d{4})年(\d{1,2})月入学(?:（(\d{4}\/\d{2})学年）)?$/.exec(value);
  if (single) {
    const month = MONTHS_EN[Number(single[2]) - 1];
    if (month) {
      return `${month} ${single[1]} entry${single[3] ? ` (${single[3]} academic year)` : ''}`;
    }
  }
  const range = /^(\d{4})年(\d{1,2})月或(\d{1,2})月入学$/.exec(value);
  if (range) {
    const first = MONTHS_EN[Number(range[2]) - 1];
    const second = MONTHS_EN[Number(range[3]) - 1];
    if (first && second) return `${first} or ${second} ${range[1]} entry`;
  }
  return value;
}

const CHINESE_NUMBERS: Record<string, number> = {
  一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
};

function englishRoundName(name: string): string {
  if (name === '主轮') return 'Main round';
  if (name === '补录' || name === '补录轮') return 'Supplementary round';
  if (name === '提前批') return 'Early round';
  if (name === '常规轮') return 'Regular round';
  if (name === '国际申请截止') return 'International application deadline';
  if (name === '项目申请截止') return 'Programme application deadline';
  if (name === '国际学生截止') return 'International student deadline';
  if (name === '第一补录轮') return 'First supplementary round';
  if (name === '第二补录轮') return 'Second supplementary round';
  if (name === '普通入学第一轮') return 'General admission round 1';
  if (name === '奖学金考虑截止') return 'Scholarship consideration deadline';
  if (name === '预计最终申请截止') return 'Expected final application deadline';
  if (name === '国际生奖学金第二轮') return 'International scholarship round 2';
  const monthMatch = /^(\d{1,2})月入学申请期$/.exec(name);
  if (monthMatch) return `${monthMatch[1]} intake application period`;
  const match = /^第([0-9]+|[一二三四五六七八九十]+)轮$/.exec(name);
  if (!match) return name;
  const value = /^[0-9]+$/.test(match[1])
    ? Number(match[1])
    : match[1].split('').reduce((total, char) => total + (CHINESE_NUMBERS[char] ?? 0), 0);
  return `Round ${value}`;
}

function englishProgramme(value: string): string {
  return (PROGRAMME_EN[value] ?? value)
    .replace(/（/g, ' (')
    .replace(/）/g, ')')
    .replace(/，/g, ', ');
}

export function localizeMastersRound(round: MastersRound, locale: string): MastersRound {
  if (locale !== 'en') return round;
  return {
    ...round,
    details: {
      ...round.details,
      university: UNIVERSITY_EN[round.details.university] ?? round.details.university,
      programme: englishProgramme(round.details.programme),
      subject: SUBJECT_EN[round.details.subject] ?? round.details.subject,
      intakeLabel: englishIntake(round.details.intakeLabel),
      studyMode: STUDY_MODE_EN[round.details.studyMode] ?? round.details.studyMode,
      applicantGroup: APPLICANT_GROUP_EN[round.details.applicantGroup] ?? round.details.applicantGroup,
      openingNote: OPENING_NOTE_EN[round.details.openingNote] ?? round.details.openingNote,
      roundName: englishRoundName(round.details.roundName),
      deadlineText: DEADLINE_TEXT_EN[round.details.deadlineText] ?? round.details.deadlineText,
    },
  };
}

export function localizeMastersRounds(rounds: readonly MastersRound[], locale: string): MastersRound[] {
  return rounds.map((round) => localizeMastersRound(round, locale));
}
