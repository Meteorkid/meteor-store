import { describe, expect, it } from 'vitest';
import { listeningTranscriptHash } from '../transcript-hash';
import {
  ListeningAudioSchema, ListeningLessonSchema, ListeningUtteranceSchema, answerFitsWordLimit, answerInSentence, countListeningWords, gradeListening,
  letterKey, listeningQuestionKind, listeningQuestionLocations, looseKey, measureAnswerWords, normalizeListeningAnswer,
  sectionQuestionNumbers, wordInSentence,
  type ListeningChoiceMultipleSection, type ListeningCompletionSection, type ListeningLesson,
  type ListeningMatchingSection, type ListeningSection, type ListeningChoiceSingleSection,
} from '../types';

/**
 * 协议是听力题库唯一的地基：80 道题、判分、音频与查词都挂在它上面。
 * 这里用一份合成的合法课时把每条规则钉住——改协议之前先看这个文件。
 */

const utterance = (speaker: string, text: string) => ({ speaker, text });

function completionSection(): ListeningCompletionSection {
  return {
    kind: 'completion',
    instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
    wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
    rows: [
      { lead: 'Membership', cells: [[{ blank: 1 }]] },
      { lead: 'Bring', cells: [[{ text: 'two forms of ' }, { blank: 2 }]] },
      { lead: 'Weekday closing time', cells: [[{ blank: 3 }]] },
    ],
  };
}

function singleSection(): ListeningChoiceSingleSection {
  return {
    kind: 'choice-single',
    instruction: 'Choose the correct letter, A, B or C.',
    questions: [
      { number: 4, stem: 'On Saturdays the library opens at', options: [{ key: 'A', text: '9.30' }, { key: 'B', text: '9.00' }, { key: 'C', text: '10.00' }] },
      { number: 5, stem: 'The car park is free for members', options: [{ key: 'A', text: 'at any time' }, { key: 'B', text: 'after five o’clock on weekdays' }, { key: 'C', text: 'at the weekend' }] },
      { number: 6, stem: 'How many items can be borrowed at a time?', options: [{ key: 'A', text: 'eight' }, { key: 'B', text: 'ten' }, { key: 'C', text: 'twelve' }] },
    ],
  };
}

function multipleSection(): ListeningChoiceMultipleSection {
  return {
    kind: 'choice-multiple',
    instruction: 'Which TWO documents will the caller bring? Choose TWO letters, A–E.',
    select: 2,
    stem: 'Which TWO documents will the caller bring?',
    options: [{ key: 'A', text: 'a passport' }, { key: 'B', text: 'a bank statement' }, { key: 'C', text: 'a bank card' }, { key: 'D', text: 'a utility bill' }, { key: 'E', text: 'a driving licence' }],
  };
}

function matchingSection(): ListeningMatchingSection {
  return {
    kind: 'matching',
    instruction: 'Match each late return with the correct charge. Choose the correct letter, A, B or C.',
    options: [{ key: 'A', text: 'free of charge' }, { key: 'B', text: 'a small charge' }, { key: 'C', text: 'a large charge' }],
    items: [{ number: 9, text: 'Returning books late in the first week' }, { number: 10, text: 'Returning books late after the first week' }],
  };
}

function lesson(overrides: Partial<ListeningLesson> = {}): ListeningLesson {
  const value: ListeningLesson = {
    slug: 'test-99-part-1',
    part: 1,
    status: 'published',
    title: { zh: '加入图书馆', en: 'Joining the library' },
    summary: { zh: '一段关于办理借书证的对话。', en: 'A conversation about signing up for a library card.' },
    cast: [
      { id: 'assistant', label: 'LIBRARY ASSISTANT', gender: 'female', voice: 'en-GB-SoniaNeural' },
      { id: 'caller', label: 'CALLER', gender: 'male', voice: 'en-GB-RyanNeural' },
    ],
    sections: [completionSection(), singleSection(), multipleSection(), matchingSection()],
    answers: [
      { number: 1, accepted: ['free'], evidence: 2, explanation: { zh: '会员免费。', en: 'Membership is free.' } },
      { number: 2, accepted: ['identification', 'ID'], evidence: 2, explanation: { zh: '需要两种身份证明。', en: 'Two forms of identification are needed.' } },
      { number: 3, accepted: ['8 pm', '8.00 pm'], spoken: 'eight o’clock', evidence: 4, explanation: { zh: '工作日八点关门。', en: 'It closes at eight on weekdays.' } },
      { number: 4, accepted: ['A'], evidence: 4, explanation: { zh: '周六九点半开门。', en: 'It opens at 9.30 on Saturdays.' } },
      { number: 5, accepted: ['B'], evidence: 6, explanation: { zh: '工作日五点后免费。', en: 'It is free after five on weekdays.' } },
      { number: 6, accepted: ['C'], evidence: 8, explanation: { zh: '一次最多十二件。', en: 'Up to twelve items.' } },
      { number: 7, accepted: ['A'], evidence: 9, explanation: { zh: '会带护照。', en: 'The caller will bring a passport.' } },
      { number: 8, accepted: ['B'], evidence: 9, explanation: { zh: '会带银行对账单。', en: 'The caller will bring a bank statement.' } },
      { number: 9, accepted: ['A'], evidence: 10, explanation: { zh: '第一周免费。', en: 'Free in the first week.' } },
      { number: 10, accepted: ['B'], evidence: 10, explanation: { zh: '之后收取少量费用。', en: 'A small charge applies afterwards.' } },
    ],
    transcript: [
      utterance('assistant', 'Good morning, Greenway Library. How can I help you today?'),
      utterance('caller', 'I’d like to join, please. I’ve just moved to the area.'),
      utterance('assistant', 'Of course. Membership is free, but you’ll need two forms of identification.'),
      utterance('caller', 'What documents are acceptable?'),
      utterance('assistant', 'A passport, a bank statement or a utility bill. We’re open until eight o’clock on weekdays, and from nine thirty to half past four on Saturdays.'),
      utterance('caller', 'Is the car park free for members?'),
      utterance('assistant', 'It’s free after five o’clock on weekdays. At other times you’ll need to pay.'),
      utterance('caller', 'OK. And can I borrow books straight away?'),
      utterance('assistant', 'Yes, up to twelve items at a time.'),
      utterance('caller', 'Great, I’ll bring my passport and a bank statement on Saturday.'),
      utterance('assistant', 'Just so you know, late returns are free for the first week, and after that there’s a small charge.'),
      utterance('caller', 'Got it. See you on Saturday.'),
    ],
    vocabulary: [
      { term: 'membership', partOfSpeech: 'n.', meaning: { zh: '会员资格', en: 'membership' }, usage: { zh: '指成为会员的状态。', en: 'The state of being a member.' }, collocations: ['library membership'], example: { en: 'Membership costs ten dollars a year.', zh: '会员费每年十美元。' }, sentenceIndex: 2 },
      { term: 'acceptable', partOfSpeech: 'adj.', meaning: { zh: '可接受的', en: 'acceptable' }, usage: { zh: '形容被允许的。', en: 'Allowed or approved.' }, collocations: ['fully acceptable'], example: { en: 'Cash is not acceptable here.', zh: '这里不接受现金。' }, sentenceIndex: 3 },
      { term: 'charge', partOfSpeech: 'n.', meaning: { zh: '费用', en: 'charge' }, usage: { zh: '指需支付的钱。', en: 'A price asked for something.' }, collocations: ['a small charge'], example: { en: 'There is no charge for delivery.', zh: '配送不收费。' }, sentenceIndex: 10 },
      { term: 'utility', partOfSpeech: 'n.', meaning: { zh: '公用事业', en: 'utility' }, usage: { zh: '指水、电、煤气等服务。', en: 'A public service such as water or electricity.' }, collocations: ['utility bill'], example: { en: 'Keep your utility bills as proof of address.', zh: '保留水电账单作为地址证明。' }, sentenceIndex: 4 },
    ],
    expressions: [
      { phrase: 'two forms of', meaning: { zh: '两种形式的', en: 'two kinds of' }, usage: { zh: '后接名词。', en: 'Followed by a noun.' }, example: { en: 'Bring two forms of ID.', zh: '带上两种身份证明。' }, sentenceIndex: 2 },
      { phrase: 'straight away', meaning: { zh: '立刻', en: 'immediately' }, usage: { zh: '口语副词短语。', en: 'An informal adverbial phrase.' }, example: { en: 'You can start straight away.', zh: '你可以立刻开始。' }, sentenceIndex: 7 },
      { phrase: 'up to', meaning: { zh: '多达', en: 'as many as' }, usage: { zh: '表示上限。', en: 'Indicates a maximum.' }, example: { en: 'You can borrow up to ten books.', zh: '你最多可以借十本书。' }, sentenceIndex: 8 },
    ],
    ...overrides,
  };
  return value;
}

function issueMessages(value: unknown): string[] {
  const result = ListeningLessonSchema.safeParse(value);
  return result.success ? [] : result.error.issues.map(issue => issue.message);
}

describe('听力课时协议', () => {
  it('接受一份合法课时', () => {
    expect(issueMessages(lesson())).toEqual([]);
  });

  it('题号必须从 1 连续覆盖到 10', () => {
    const value = lesson();
    value.sections = [
      { ...completionSection(), rows: [{ lead: 'Membership', cells: [[{ blank: 2 }]] }, ...completionSection().rows.slice(1)] },
      singleSection(), multipleSection(), matchingSection(),
    ];
    expect(issueMessages(value)).toContain('题号必须从 1 连续递增：第 1 题的位置写的是 2');

    const short = lesson();
    short.sections = [completionSection(), singleSection()];
    expect(issueMessages(short)).toContain('一个 Part 必须正好 10 题，现在是 6 题');
  });

  it('填空答案必须出现在定位句里，数字写法用 spoken 对应英文数词', () => {
    const value = lesson();
    value.answers = value.answers.map(answer => answer.number === 1 ? { ...answer, accepted: ['no charge'] } : answer);
    expect(issueMessages(value)).toContain('答案「no charge」没有出现在第 2 句原文中');

    const missingSpoken = lesson();
    missingSpoken.answers = missingSpoken.answers.map(answer => answer.number === 3 ? { ...answer, spoken: undefined } : answer);
    expect(issueMessages(missingSpoken)).toContain('答案「8 pm」没有出现在第 4 句原文中');

    const spoken = lesson();
    spoken.answers = spoken.answers.map(answer => answer.number === 3 ? { ...answer, accepted: ['8.00 pm'], spoken: 'eight o’clock' } : answer);
    expect(issueMessages(spoken)).toEqual([]);
  });

  it('填空答案受试卷词数限制约束', () => {
    const value = lesson();
    value.answers = value.answers.map(answer => answer.number === 1 ? { ...answer, accepted: ['free of charge'] } : answer);
    expect(issueMessages(value)).toContain('答案「free of charge」没有出现在第 2 句原文中');

    const strict = lesson();
    strict.sections = [{ ...completionSection(), wordLimit: 'ONE WORD AND/OR A NUMBER' }, singleSection(), multipleSection(), matchingSection()];
    strict.answers = strict.answers.map(answer => answer.number === 3 ? { ...answer, accepted: ['by eight pm'] } : answer);
    expect(issueMessages(strict)).toContain('「by eight pm」超出词数限制 ONE WORD AND/OR A NUMBER');
    // 数字 + 一个词仍在限制内
    const numberAndWord = lesson();
    numberAndWord.sections = [{ ...completionSection(), wordLimit: 'ONE WORD AND/OR A NUMBER' }, singleSection(), multipleSection(), matchingSection()];
    numberAndWord.answers = numberAndWord.answers.map(answer => answer.number === 3 ? { ...answer, accepted: ['8.00 pm'] } : answer);
    expect(issueMessages(numberAndWord)).toEqual([]);
  });

  it('选择与配对的答案必须是题块里存在的字母', () => {
    const value = lesson();
    value.answers = value.answers.map(answer => answer.number === 4 ? { ...answer, accepted: ['D'] } : answer);
    expect(issueMessages(value)).toContain('答案必须是选项字母（ABC）');
  });

  it('多选题各题号的字母不可重复', () => {
    const value = lesson();
    value.answers = value.answers.map(answer => answer.number === 8 ? { ...answer, accepted: ['A'] } : answer);
    expect(issueMessages(value)).toContain('多选题各题号的字母不可重复');
  });

  it('题块顺序必须与录音顺序一致', () => {
    // 第四题的答案句早于第三题的答案句（第 4 句）
    const value = lesson();
    value.answers = value.answers.map(answer => answer.number === 4 ? { ...answer, evidence: 2 } : answer);
    expect(issueMessages(value)).toContain('题块的定位句早于上一个题块：题目顺序应与录音顺序一致');

    // 同一句同时是上一题块最后一题和本题块第一题的答案句：允许
    const shared = lesson();
    shared.answers = shared.answers.map(answer => answer.number === 4 ? { ...answer, evidence: 4 } : answer);
    expect(issueMessages(shared)).toEqual([]);
  });

  it('说话人必须在 cast 里，且 id 不重复', () => {
    const value = lesson();
    value.transcript = value.transcript.map((item, index) => index === 0 ? { ...item, speaker: 'stranger' } : item);
    expect(issueMessages(value)).toContain('说话人 stranger 不在 cast 中');

    const duplicated = lesson();
    duplicated.cast = [duplicated.cast[0], { ...duplicated.cast[0] }];
    expect(issueMessages(duplicated)).toContain('说话人 id 不可重复');
  });

  it('表格行宽与首列必须齐全，选项字母从 A 连续', () => {
    const value = lesson();
    value.sections = [{
      ...completionSection(),
      columns: ['Day', 'Opening time', 'Closing time'],
      rows: [{ lead: 'Monday', cells: [[{ text: '9.00' }]] }],
    }, singleSection(), multipleSection(), matchingSection()];
    expect(issueMessages(value)).toContain('每行必须有 2 个单元格');

    const missingLead = lesson();
    missingLead.sections = [{
      ...completionSection(),
      columns: ['Day', 'Closing time'],
      rows: [{ cells: [[{ text: '9.00' }]] }],
    }, singleSection(), multipleSection(), matchingSection()];
    expect(issueMessages(missingLead)).toContain('表格的每一行都需要首列（文字或空位）');

    const skipped = lesson();
    const singles = singleSection();
    skipped.sections = [completionSection(), {
      ...singles,
      questions: singles.questions.map(question => ({ ...question, options: [{ key: 'B', text: '9.30' }, { key: 'C', text: '9.00' }] })),
    }, multipleSection(), matchingSection()];
    expect(issueMessages(skipped)).toContain('选项字母必须从 A 开始连续');
  });

  it('生词与词组必须原样出现在所引原句中，且课内不重复', () => {
    const value = lesson();
    value.vocabulary = value.vocabulary.map((item, index) => index === 0 ? { ...item, sentenceIndex: 6 } : item);
    expect(issueMessages(value)).toContain('生词「membership」没有出现在第 6 句原文中');

    const boundary = lesson();
    boundary.vocabulary = boundary.vocabulary.map((item, index) => index === 0 ? { ...item, term: 'member', sentenceIndex: 2 } : item);
    expect(issueMessages(boundary)).toContain('生词「member」没有出现在第 2 句原文中');

    const duplicated = lesson();
    duplicated.expressions = duplicated.expressions.map((item, index) => index === 1 ? { ...item, phrase: 'two forms of' } : item);
    expect(issueMessages(duplicated)).toContain('词组不可重复');

    const absent = lesson();
    absent.expressions = absent.expressions.map((item, index) => index === 0 ? { ...item, phrase: 'three kinds of' } : item);
    expect(issueMessages(absent)).toContain('词组「three kinds of」没有出现在第 2 句原文中');
  });

  it('slug 与 part 必须一致', () => {
    expect(issueMessages(lesson({ slug: 'test-99-part-2' }))).toContain('slug 必须以 part-N 结尾且与 part 一致');
  });

  it('题号从本 Part 的起始题号开始：Part 2 是 11–20', () => {
    const shift = (value: ListeningLesson, offset: number): ListeningLesson => ({
      ...value,
      part: 2,
      slug: 'test-99-part-2',
      sections: value.sections.map(section => {
        switch (section.kind) {
          case 'completion': return { ...section, rows: section.rows.map(row => ({
            ...row,
            lead: row.lead === undefined ? undefined : typeof row.lead === 'string' ? row.lead : { blank: row.lead.blank + offset },
            cells: row.cells.map(cell => cell.map(segment => 'blank' in segment ? { blank: segment.blank + offset } : segment)),
          })) };
          case 'choice-single': return { ...section, questions: section.questions.map(question => ({ ...question, number: question.number + offset })) };
          case 'matching': return { ...section, items: section.items.map(item => ({ ...item, number: item.number + offset })) };
          default: return section;
        }
      }),
      answers: value.answers.map(answer => ({ ...answer, number: answer.number + offset })),
    });
    const part2 = shift(lesson(), 10);
    expect(issueMessages(part2)).toEqual([]);
    expect(listeningQuestionLocations(part2).map(item => item.number)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(gradeListening(part2, { 11: 'free', 17: 'B', 18: 'A' }).score).toBe(3);

    // 写成 1–10 的 Part 2 不合法
    expect(issueMessages({ ...lesson(), part: 2, slug: 'test-99-part-2' })).toContain('题号必须从 11 连续递增：第 11 题的位置写的是 1');
    // 答案没有跟着题号走也不合法
    const staleAnswers = { ...part2, answers: lesson().answers };
    expect(issueMessages(staleAnswers)).toContain('答案必须按题号 11..20 顺序排列');
  });

  it('中文说明不能留英文，英文说明不能留中文', () => {
    expect(issueMessages(lesson({ title: { zh: 'Joining the library', en: 'Joining the library' } }))).toContain('缺少中文说明');
    expect(issueMessages(lesson({ title: { zh: '加入图书馆', en: '加入图书馆' } }))).toContain('缺少英文说明');
  });
});

describe('题号遍历', () => {
  const value = lesson();

  it('每种题块按试卷顺序给出题号', () => {
    expect(sectionQuestionNumbers(value.sections[0], 1)).toEqual([1, 2, 3]);
    expect(sectionQuestionNumbers(value.sections[1], 4)).toEqual([4, 5, 6]);
    expect(sectionQuestionNumbers(value.sections[2], 7)).toEqual([7, 8]);
    expect(sectionQuestionNumbers(value.sections[3], 9)).toEqual([9, 10]);
    expect(listeningQuestionLocations(value).map(item => item.sectionIndex)).toEqual([0, 0, 0, 1, 1, 1, 2, 2, 3, 3]);
    expect(listeningQuestionKind(value, 8)).toBe('choice-multiple');
    expect(listeningQuestionKind(value, 10)).toBe('matching');
  });

  it('空位之外的文字不计入题号', () => {
    const section: ListeningSection = {
      kind: 'completion', instruction: 'Complete the form below.', wordLimit: 'NO MORE THAN TWO WORDS',
      rows: [{ lead: 'Name', cells: [[{ text: 'Anna ' }, { blank: 5 }, { text: ' Smith' }]] }],
    };
    expect(sectionQuestionNumbers(section, 5)).toEqual([5]);
  });

  it('表格首列可以是空位，排在同一行其他空位之前', () => {
    const table: ListeningCompletionSection = {
      kind: 'completion', instruction: 'Complete the table below.', wordLimit: 'NO MORE THAN TWO WORDS',
      columns: ['Item', 'When', 'Price'],
      rows: [
        { lead: 'Documents', cells: [[{ blank: 2 }], [{ text: 'free' }]] },
        { lead: { blank: 3 }, cells: [[{ text: 'on Saturday' }], [{ text: 'free' }]] },
      ],
    };
    expect(sectionQuestionNumbers(table, 1)).toEqual([2, 3]);

    // 把多选题块换成这份表格：题号 7 落在首列空位，8 落在 When 列，整体仍然合法
    const value = lesson();
    value.sections = [completionSection(), singleSection(), { ...table, rows: [
      { lead: 'Documents', cells: [[{ blank: 7 }], [{ text: 'free' }]] },
      { lead: { blank: 8 }, cells: [[{ text: 'on Saturday' }], [{ text: 'free' }]] },
    ] }, matchingSection()];
    value.answers = value.answers.map(answer => answer.number === 7
      ? { ...answer, accepted: ['Saturday'], evidence: 9 }
      : answer.number === 8 ? { ...answer, accepted: ['bank statement'], evidence: 9 } : answer);
    expect(issueMessages(value)).toEqual([]);
    expect(listeningQuestionKind(value, 8)).toBe('completion');
    expect(gradeListening(value, { 7: 'saturday', 8: 'bank statement' }, [7, 8]).score).toBe(2);
  });
});

describe('答案规范化与判分', () => {
  const value = lesson();

  it('大小写、空白、句末标点、撇号与破折号不计', () => {
    expect(normalizeListeningAnswer('  Check–In. ')).toBe('check-in');
    expect(normalizeListeningAnswer('O’Neill')).toBe("o'neill");
    expect(looseKey('Check In')).toBe('checkin');
    expect(looseKey('check-in')).toBe('checkin');
    expect(looseKey('(£)9.30')).toBe('9.30');
    expect(letterKey(' (b). ')).toBe('B');
  });

  it('词数限制按雅思规则计数：数字不占词数，但最多一个数字', () => {
    const twoWordsAndNumber = { maxWords: 2, allowNumber: true };
    expect(answerFitsWordLimit('15 December', twoWordsAndNumber)).toBe(true);
    expect(answerFitsWordLimit('two-week tickets', twoWordsAndNumber)).toBe(true);
    expect(answerFitsWordLimit('the bus stop', twoWordsAndNumber)).toBe(false);
    expect(answerFitsWordLimit('15 16 17', twoWordsAndNumber)).toBe(false);
    expect(measureAnswerWords('£15 20%', twoWordsAndNumber)).toMatchObject({ tokens: 2, words: 0, numbers: 2, fits: false });
    const oneWordAndNumber = { maxWords: 1, allowNumber: true };
    expect(answerFitsWordLimit('15', oneWordAndNumber)).toBe(true);
    expect(answerFitsWordLimit('15 Tuesday', oneWordAndNumber)).toBe(true);
    expect(answerFitsWordLimit('next Tuesday', oneWordAndNumber)).toBe(false);
    expect(answerFitsWordLimit('9.30 am', oneWordAndNumber)).toBe(true);
    const twoWords = { maxWords: 2, allowNumber: false };
    expect(answerFitsWordLimit('20 percent', twoWords)).toBe(true);
    expect(answerFitsWordLimit('15', twoWords)).toBe(true);
    expect(answerFitsWordLimit('15 December', twoWords)).toBe(true);
    expect(answerFitsWordLimit('15 16 17', twoWords)).toBe(false);
    expect(answerFitsWordLimit('', twoWords)).toBe(false);
  });

  it('答案作为连续的词出现在句子里，整词匹配', () => {
    expect(answerInSentence('We’re open until eight o’clock on weekdays.', 'eight o’clock')).toBe(true);
    expect(answerInSentence('It’s K, R, A, U, S, E.', 'K, R, A, U, S, E')).toBe(true);
    expect(answerInSentence('We’re open until eight o’clock.', 'nine thirty')).toBe(false);
    expect(wordInSentence('It is part of the course.', 'art')).toBe(false);
    expect(wordInSentence('It is part of the course.', 'part')).toBe(true);
    // 连字符词按一个词算：归一之后两边都要比较，不能只归一被查的词
    expect(wordInSentence('That’s a within-subjects design.', 'within-subjects')).toBe(true);
    expect(wordInSentence('It was a well-known fact.', 'well-known')).toBe(true);
    expect(wordInSentence('It was a well known fact.', 'well-known')).toBe(false);
  });

  it('填空：宽松书写得分，空答与错误内容不得分，备选拼写同样得分', () => {
    const grade = gradeListening(value, {
      1: ' FREE. ', 2: 'ID', 3: '8pm', 4: 'a', 5: 'B', 6: 'c', 7: 'B', 8: 'A', 9: 'A', 10: 'B',
    });
    expect(grade.score).toBe(10);
    expect(grade.results.map(item => item.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(gradeListening(value, { 1: 'free of charge' }, [1]).results[0].correct).toBe(false);
    expect(gradeListening(value, { 1: '   ' }, [1]).results[0].correct).toBe(false);
    expect(gradeListening(value, { 3: '(£)8.00 pm' }, [3]).results[0].correct).toBe(true);
    expect(gradeListening(value, { 3: '20.00' }, [3]).results[0].correct).toBe(false);
  });

  it('单选与配对只看字母，大小写与标点不计', () => {
    expect(gradeListening(value, { 4: '(A)' }, [4]).results[0].correct).toBe(true);
    expect(gradeListening(value, { 4: 'b' }, [4]).results[0].correct).toBe(false);
    expect(gradeListening(value, { 10: 'b.' }, [10]).results[0].correct).toBe(true);
  });

  it('多选题整组计分：全对才得分，顺序不限', () => {
    expect(gradeListening(value, { 7: 'B', 8: 'A' }, [7, 8])).toMatchObject({ score: 2, total: 2, results: [{ correct: true }, { correct: true }] });
    expect(gradeListening(value, { 7: 'A', 8: '' }, [7, 8])).toMatchObject({ score: 0, results: [{ correct: false }, { correct: false }] });
    expect(gradeListening(value, { 7: 'A', 8: 'C' }, [7, 8]).score).toBe(0);
    // 只重练多选题组的一半：不完整的一律算错
    expect(gradeListening(value, { 7: 'A', 8: 'B' }, [7])).toMatchObject({ score: 0, total: 1 });
  });

  it('错题重练只判指定题号', () => {
    const grade = gradeListening(value, { 1: 'free', 3: '8 pm', 9: 'C' }, [1, 3, 9]);
    expect(grade).toMatchObject({ score: 2, total: 3, results: [{ number: 1, correct: true }, { number: 3, correct: true }, { number: 9, correct: false }] });
  });

  it('一个题都没作答时是 0 分而不是满分', () => {
    expect(gradeListening(value, {})).toMatchObject({ score: 0, total: 10 });
  });
});


describe('原文的展示写法', () => {
  it('允许用 displayText 覆盖数字写法，且不改变音频指纹', () => {
    const paragraph = utterance('caller', 'It’s oh seven four double six, two one nine, eight three oh.');
    const spokenHash = listeningTranscriptHash([paragraph.text]);
    const parsed = ListeningUtteranceSchema.safeParse({
      ...paragraph,
      displayText: 'It’s 07466 219 830.',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.displayText).toBe('It’s 07466 219 830.');
    expect(listeningTranscriptHash([paragraph.text])).toBe(spokenHash);
    expect(ListeningUtteranceSchema.safeParse({ ...paragraph, displayText: 'two\nlines' }).success).toBe(false);
  });
});

describe('音频清单的对象 key', () => {
  const audio = (key: string) => ({ key, durationSec: 12.5, transcriptHash: 'aec4cb5c4dbef6f6', cues: [[0, 5]], generatedAt: '2026-11-25T00:00:00Z' });

  it('接受旧的无版本 key 与带音频指纹的新 key', () => {
    expect(ListeningAudioSchema.safeParse(audio('ielts-listening/test-01-part-1/aec4cb5c4dbef6f6.mp3')).success).toBe(true);
    expect(ListeningAudioSchema.safeParse(audio('ielts-listening/test-01-part-1/aec4cb5c4dbef6f6-1e5c1984.mp3')).success).toBe(true);
  });

  it('拒绝跨课时路径、非法指纹与多余后缀', () => {
    for (const key of [
      'ielts-listening/test-01-talk/aec4cb5c4dbef6f6.mp3',
      'ielts-listening/test-01-part-1/zzzz.mp3',
      'ielts-listening/test-01-part-1/aec4cb5c4dbef6f6-1e5c1984-extra.mp3',
    ]) expect(ListeningAudioSchema.safeParse(audio(key)).success).toBe(false);
  });
});

describe('统计与指纹', () => {
  const value = lesson();

  it('原文词数按字母词统计', () => {
    expect(countListeningWords(value)).toBe(value.transcript.reduce((sum, item) => sum + (item.text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? []).length, 0));
    expect(countListeningWords({ transcript: [utterance('a', 'Two-week tickets cost £15, right?')] })).toBe(4);
  });

  it('原文指纹只随句子文本变化', () => {
    const sentences = value.transcript.map(item => item.text);
    const hash = listeningTranscriptHash(sentences);
    expect(hash).toMatch(/^[a-f0-9]{16}$/);
    expect(listeningTranscriptHash(value.transcript.map(item => item.text))).toBe(hash);
    expect(listeningTranscriptHash([...sentences.slice(0, -1), 'A different last sentence.'])).not.toBe(hash);
    expect(listeningTranscriptHash([...sentences].reverse())).not.toBe(hash);
  });
});
