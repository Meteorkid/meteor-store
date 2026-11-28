export type LearnPrimaryKey = 'discover' | 'workbench' | 'listening' | 'directions' | 'plan' | 'applications' | 'saved';
export type LearnSecondaryKey = 'opportunities' | 'topics' | 'weekly' | 'courses' | 'algorithms' | 'writing' | 'vocabulary' | 'masters' | 'phd';

export const LEARN_PRIMARY: readonly { key: LearnPrimaryKey; href: string }[] = [
  { key: 'discover', href: '/pathfinder' },
  { key: 'workbench', href: '/study' },
  { key: 'listening', href: '/study/ielts/listening' },
  { key: 'directions', href: '/pathfinder/directions/ai' },
  { key: 'plan', href: '/pathfinder/plan' },
  { key: 'applications', href: '/masters' },
  { key: 'saved', href: '/pathfinder/saved' },
];

/** 一级入口按最长语义前缀归位；听力必须先于学习工作台判断。 */
export function learnPrimaryForPath(pathname: string): LearnPrimaryKey | null {
  if (/^\/study\/ielts\/listening(?:\/|$)/.test(pathname)) return 'listening';
  if (/^\/pathfinder\/directions(?:\/|$)/.test(pathname)) return 'directions';
  if (/^\/pathfinder\/plan(?:\/|$)/.test(pathname)) return 'plan';
  if (/^\/pathfinder\/saved(?:\/|$)/.test(pathname)) return 'saved';
  if (/^\/(?:masters|phd)(?:\/|$)/.test(pathname)) return 'applications';
  if (/^\/study(?:\/|$)/.test(pathname)) return 'workbench';
  if (/^\/pathfinder(?:\/|$)/.test(pathname)) return 'discover';
  return null;
}

const SECONDARY: Record<LearnPrimaryKey, readonly { key: LearnSecondaryKey; href: string }[]> = {
  discover: [
    { key: 'opportunities', href: '/pathfinder/opportunities' },
    { key: 'topics', href: '/pathfinder/topics' },
    { key: 'weekly', href: '/pathfinder/weekly' },
  ],
  workbench: [
    { key: 'courses', href: '/study/courses' },
    { key: 'algorithms', href: '/study/algorithms' },
    { key: 'writing', href: '/study/ielts' },
    { key: 'vocabulary', href: '/study/vocabulary' },
  ],
  applications: [
    { key: 'masters', href: '/masters' },
    { key: 'phd', href: '/phd' },
  ],
  listening: [],
  directions: [],
  plan: [],
  saved: [],
};

export function learnSecondaryFor(primary: LearnPrimaryKey | null) {
  return primary ? SECONDARY[primary] : [];
}

/** 二级条目的高亮：详情页也要归属到对应栏目，但写作不能吞掉听力。 */
export function learnSecondaryActive(pathname: string, key: LearnSecondaryKey): boolean {
  switch (key) {
    case 'opportunities':
      return /^\/pathfinder\/(?:opportunities|items)(?:\/|$)/.test(pathname);
    case 'topics':
      return /^\/pathfinder\/(?:topics|organizations)(?:\/|$)/.test(pathname);
    case 'weekly':
      return /^\/pathfinder\/weekly(?:\/|$)/.test(pathname);
    case 'courses':
      return /^\/study\/courses(?:\/|$)/.test(pathname);
    case 'algorithms':
      return /^\/study\/algorithms(?:\/|$)/.test(pathname);
    case 'writing':
      return /^\/study\/ielts(?:\/|$)/.test(pathname) && !/^\/study\/ielts\/listening(?:\/|$)/.test(pathname);
    case 'vocabulary':
      return /^\/study\/vocabulary(?:\/|$)/.test(pathname);
    case 'masters':
      return /^\/masters(?:\/|$)/.test(pathname);
    case 'phd':
      return /^\/phd(?:\/|$)/.test(pathname);
  }
}
