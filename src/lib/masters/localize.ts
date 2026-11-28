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
  香港大学: 'The University of Hong Kong',
  香港科技大学: 'The Hong Kong University of Science and Technology',
};

const PROGRAMME_EN: Record<string, string> = {
  'MSc in Computer Science（General Stream，无 Delta X Fellowship）':
    'MSc in Computer Science (General Stream, without Delta X Fellowship)',
};

const SUBJECT_EN: Record<string, string> = {
  国际管理: 'International Management',
  '计算机与信息安全': 'Computing and Information Security',
  计算机科学: 'Computer Science',
  金融科技: 'Financial Technology',
};

const INTAKE_EN: Record<string, string> = {
  '2027 Semester 1': 'Semester 1, 2027',
  '2027 Semester 2': 'Semester 2, 2027',
  '2027/2028 入学季': '2027/28 intake',
  '2027/28 入学季': '2027/28 intake',
  '2027/28 秋季（2027年9月）': 'Fall 2027 (September 2027)',
  '2027年8月入学': 'August 2027 intake',
};

const CHINESE_NUMBERS: Record<string, number> = {
  一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
};

function englishRoundName(name: string): string {
  if (name === '主轮') return 'Main round';
  if (name === '补录') return 'Supplementary round';
  if (name === '提前批') return 'Early round';
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
      intakeLabel: INTAKE_EN[round.details.intakeLabel] ?? round.details.intakeLabel,
      roundName: englishRoundName(round.details.roundName),
    },
  };
}

export function localizeMastersRounds(rounds: readonly MastersRound[], locale: string): MastersRound[] {
  return rounds.map((round) => localizeMastersRound(round, locale));
}
