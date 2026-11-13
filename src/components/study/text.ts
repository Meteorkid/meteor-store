/**
 * 学习工作台的共享文案。
 *
 * 三个页面（工作台 / 课程 / 算法）各自维护自己的文案模块，
 * 这里只放共用部分：登录边界、保存状态与复习队列。
 */

export const studyCommonText = {
  zh: {
    login: '登录后继续',
    loginHint: '登录后可以跨设备保存你的学习记录。',
    sessionChanged: '账号已变化，请刷新页面后重试。',
    refresh: '刷新页面',
    failed: '操作失败，请稍后重试。',
    loadFailed: '内容暂时无法读取。',
    retry: '重试',
    save: '保存',
    saving: '保存中…',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    confirmDelete: '确认删除？',
    empty: '还没有内容。',
  },
  en: {
    login: 'Sign in to continue',
    loginHint: 'Sign in to keep your study records across devices.',
    sessionChanged: 'Your account changed. Refresh the page and try again.',
    refresh: 'Refresh',
    failed: 'Something went wrong. Please try again.',
    loadFailed: 'This section could not be loaded.',
    retry: 'Retry',
    save: 'Save',
    saving: 'Saving…',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirmDelete: 'Delete this item?',
    empty: 'Nothing here yet.',
  },
} as const;

export const reviewQueueText = {
  zh: {
    title: '今日复习',
    empty: '今天没有到期的复习。',
    remembered: '记得',
    forgot: '忘了',
    rememberedHint: '进入下一档间隔',
    forgotHint: '回到 1 天后重新巩固',
    interval: '{days} 天间隔',
    difficultyEasy: '简单',
    difficultyMedium: '中等',
    difficultyHard: '困难',
    login: '登录后继续',
    sessionChanged: '账号已变化',
    refresh: '刷新页面',
    failed: '未能记录，请重试',
    retry: '重试',
    openLink: '打开题目',
  },
  en: {
    title: 'Due today',
    empty: 'No reviews due today.',
    remembered: 'Remembered',
    forgot: 'Forgot',
    rememberedHint: 'Move to the next interval',
    forgotHint: 'Back to a 1-day interval',
    interval: '{days}-day interval',
    difficultyEasy: 'Easy',
    difficultyMedium: 'Medium',
    difficultyHard: 'Hard',
    login: 'Sign in to continue',
    sessionChanged: 'Your account changed',
    refresh: 'Refresh',
    failed: 'Could not record this review',
    retry: 'Retry',
    openLink: 'Open problem',
  },
} as const;
