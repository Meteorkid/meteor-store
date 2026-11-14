export const vocabularyText = {
  zh: {
    eyebrow: 'STUDY · VOCABULARY', title: '我的生词本',
    description: '把阅读中遇见的词连同原句留下，按 1、3、7、14、30、60 天的间隔复习。',
    metaTitle: '我的生词本 · 语境复习', metaDescription: '收藏阅读中的生词和语境，按间隔计划复习。',
    total: '收藏总数', due: '今日待复习', all: '全部生词', dueOnly: '待复习',
    search: '搜索生词', searchHint: '搜索单词、释义或原句', searchAction: '搜索',
    loading: '正在读取生词本…', checking: '正在确认收藏状态…', saving: '正在加入…',
    loadFailed: '生词本暂时无法读取，请重试。这不代表你没有收藏。',
    failed: '操作未完成，请重试。', changed: '账号或记录已变化，请重新加载后继续。',
    login: '登录后继续', loginSave: '登录后加入生词本', refresh: '重新加载', retry: '重试',
    save: '加入生词本', saved: '已加入生词本', open: '打开生词本',
    lookupAgain: '这次释义的保存凭证已失效，请关闭浮层并重新查词后再加入。',
    empty: '生词本还是空的。阅读雅思范文时，点选英文单词即可加入。',
    noMatches: '没有符合条件的生词。试试其他关键词或查看全部生词。',
    read: '去读雅思范文', more: '继续加载', loadingMore: '正在加载…',
    list: '生词列表', meaning: '中文释义', usage: '用法', sentence: '收藏时的原句',
    source: '来源', lesson: '本文词汇', ai: 'AI 语境释义', high: '高分版本', basic: '基础版本',
    nextReview: '下次复习', stage: '复习阶段', delete: '删除', cancel: '取消',
    deleteConfirm: '删除这条生词和它的复习记录？', deleteAction: '确认删除', deleting: '正在删除…',
    deleted: '已删除生词。', reviewTitle: '生词复习', reveal: '查看释义',
    reviewHint: '先回想这个词在原句中的意思，再查看释义。',
    remembered: '记得', forgot: '忘了', recording: '正在记录…',
    remaining: '本组剩余 {count} 个', complete: '本组复习完成',
    completeHint: '已记录本组的复习结果。可以继续阅读，或到生词本查看下一次复习日期。',
    noDue: '当前没有到期的生词。', dueHint: '到期待复习按北京时间的日期计算。',
  },
  en: {
    eyebrow: 'STUDY · VOCABULARY', title: 'My vocabulary',
    description: 'Keep words with their original sentences, then review them after 1, 3, 7, 14, 30 and 60 days.',
    metaTitle: 'My vocabulary · Contextual review', metaDescription: 'Save vocabulary in context and review it with spaced repetition.',
    total: 'Saved words', due: 'Due today', all: 'All words', dueOnly: 'Due for review',
    search: 'Search vocabulary', searchHint: 'Search words, meanings or sentences', searchAction: 'Search',
    loading: 'Loading your vocabulary…', checking: 'Checking saved status…', saving: 'Saving…',
    loadFailed: 'Your vocabulary could not be loaded. Please retry; this does not mean it is empty.',
    failed: 'The action did not complete. Please retry.', changed: 'The account or record has changed. Reload before continuing.',
    login: 'Sign in to continue', loginSave: 'Sign in to save this word', refresh: 'Reload', retry: 'Retry',
    save: 'Save word', saved: 'Saved to vocabulary', open: 'Open vocabulary',
    lookupAgain: 'This lookup can no longer be saved. Close the panel and look up the word again.',
    empty: 'Your vocabulary is empty. Select an English word while reading an IELTS essay to save it.',
    noMatches: 'No words match these filters. Try another search or view all words.',
    read: 'Read IELTS essays', more: 'Load more', loadingMore: 'Loading…',
    list: 'Saved vocabulary', meaning: 'Chinese meaning', usage: 'Usage', sentence: 'Original saved sentence',
    source: 'Source', lesson: 'Lesson vocabulary', ai: 'AI contextual meaning', high: 'Higher-band version', basic: 'Basic version',
    nextReview: 'Next review', stage: 'Review stage', delete: 'Delete', cancel: 'Cancel',
    deleteConfirm: 'Delete this word and its review history?', deleteAction: 'Confirm deletion', deleting: 'Deleting…',
    deleted: 'Word deleted.', reviewTitle: 'Vocabulary review', reveal: 'Reveal meaning',
    reviewHint: 'Recall what the word means in this sentence before revealing the meaning.',
    remembered: 'Remembered', forgot: 'Forgot', recording: 'Recording…',
    remaining: '{count} left in this set', complete: 'Review set complete',
    completeHint: 'Your results have been recorded. Keep reading or open your vocabulary to check the next review dates.',
    noDue: 'No vocabulary is currently due for review.', dueHint: 'Review dates use Beijing time.',
  },
};

export type VocabularyFailure = 'login' | 'changed' | 'failed' | 'expired';

export function vocabularyFailure(status: number): VocabularyFailure {
  if (status === 401) return 'login';
  if (status === 409 || status === 404) return 'changed';
  return 'failed';
}

export const vocabularyButtonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300 disabled:opacity-50';
