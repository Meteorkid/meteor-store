import {
  LISTENING_QUESTION_COUNT, ListeningLessonSchema,
  countListeningSentenceWords, countListeningWords, gradeListening,
  listeningQuestionLocations, sectionQuestionNumbers,
  type ListeningLesson,
} from './types.ts';

/**
 * 听力课时的内容质检（“拿得出手”的那一层）。
 *
 * `ListeningLessonSchema` 只管结构合法：字段在不在、题号连不连续、答案在不在原文里。
 * 这里再管可读性与质量：原文能不能直接朗读、标准答案能不能判满分、解析是否言之有物、
 * 题型是否有变化、答案有没有明显偏向。
 *
 * `auditListeningLesson` 返回违规说明数组：空数组即通过；每条消息以类别标签开头，
 * 并带上题号、句号等定位信息，方便在测试里按类别筛选、在内容审核里定位。
 */

/** 各 Part 的原文词数区间，参照雅思真实材料的长度。 */
const WORD_RANGE: Record<number, [number, number]> = {
  1: [450, 800],
  2: [550, 900],
  3: [550, 950],
  4: [600, 1000],
};

/** 录音与页面共用同一份原文，这些符号会被读错或读不出，一律写成英文。 */
const UNSPEAKABLE = /[0-9%&/$€¥@#*_[\]{}<>\\|^~:]|"|“|”/;
// St 不能吃掉 States 之类的词，所以后面要求不是小写字母
const ABBREVIATIONS = /\b(e\.g\.|i\.e\.|etc\.|Mr|Mrs|Ms|Dr|St|No\.)(?![a-z])/;

/** 只盯电话/编号式连续口语数字，避免把 "Oh, I see." 这类感叹词当成数字。 */
const SPOKEN_NUMBER_RUN = /\b(?:oh|zero)\b(?=(?:\s+(?:zero|one|two|three|four|five|six|seven|eight|nine|double|treble)){2,})/i;

/** 一条违规的类别标签；测试按标签分组断言，标签名不要随意合并。 */
export type ListeningAuditTag =
  | 'schema'
  | 'structure'
  | 'grading'
  | 'length'
  | 'speakable'
  | 'spoken-number'
  | 'notes'
  | 'explanation'
  | 'answer-bias'
  | 'numbering'
  | 'completion';

/**
 * 对一篇课时做完整质检。结构都过不了协议时只回协议层问题：
 * 深层规则依赖合法字段，再往下跑只会堆出一批没有意义的二次报错。
 */
export function auditListeningLesson(lesson: ListeningLesson): string[] {
  const violations: string[] = [];
  const push = (tag: ListeningAuditTag, message: string) => violations.push(`${tag}: ${message}`);

  const parsed = ListeningLessonSchema.safeParse(lesson);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      push('schema', `${issue.path.join('.')}: ${issue.message}`);
    }
    return violations;
  }
  const l = parsed.data;
  const slug = l.slug;
  const locations = listeningQuestionLocations(l);

  // ---- 题型与题量：10 题、至少两种题型；Part 1/2/4 要有填空 ----
  if (locations.length !== LISTENING_QUESTION_COUNT) {
    push('structure', `${slug}：题数 ${locations.length}，应为 ${LISTENING_QUESTION_COUNT}`);
  }
  const kinds = new Set(locations.map(location => l.sections[location.sectionIndex].kind));
  // Part 3 在真题里以选择、配对为主；其余三个 Part 都要有填空
  if (l.part !== 3 && !kinds.has('completion')) {
    push('structure', `${slug}：Part 1、2、4 需要填空题`);
  }
  if (kinds.size < 2) {
    push('structure', `${slug}：至少两种题型，现在只有 ${kinds.size} 种`);
  }
  if (l.sections.length < 2 || l.sections.length > 4) {
    push('structure', `${slug}：题块数量 ${l.sections.length}，应在 2–4 之间`);
  }

  // ---- 判分：满分作答得满分，备选写法都得分，空白作答必须 0 分 ----
  const perfect: Record<string, string> = {};
  for (const answer of l.answers) {
    perfect[String(answer.number)] = answer.accepted[0];
    // 可接受的其它写法也必须得分
    for (const form of answer.accepted.slice(1)) {
      const single = gradeListening(l, { [String(answer.number)]: form }, [answer.number]);
      if (!single.results[0]?.correct) {
        push('grading', `${slug} 第 ${answer.number} 题的备选答案「${form}」不得分`);
      }
    }
  }
  const grade = gradeListening(l, perfect);
  if (grade.score !== LISTENING_QUESTION_COUNT) {
    push('grading', `${slug}：满分作答只得 ${grade.score}/${LISTENING_QUESTION_COUNT} 分`);
  }
  if (grade.total !== LISTENING_QUESTION_COUNT) {
    push('grading', `${slug}：判分总题数 ${grade.total}，应为 ${LISTENING_QUESTION_COUNT}`);
  }
  if (gradeListening(l, {}).score !== 0) {
    push('grading', `${slug}：空白作答不是 0 分，判分把“没答”当成了答对`);
  }

  // ---- 原文长度与句子长度适合听力练习；Part 1/3 对话，Part 2/4 独白 ----
  const words = countListeningWords(l);
  const [minWords, maxWords] = WORD_RANGE[l.part];
  if (words < minWords) push('length', `${slug}：词数 ${words}，少于下限 ${minWords}`);
  if (words > maxWords) push('length', `${slug}：词数 ${words}，超出上限 ${maxWords}`);
  l.transcript.forEach((utterance, index) => {
    const length = countListeningSentenceWords(utterance.text);
    if (length > 32) push('length', `${slug} 第 ${index} 句有 ${length} 个词（≤32）`);
  });
  const speakers = new Set(l.transcript.map(utterance => utterance.speaker));
  if ((l.part === 1 || l.part === 3) && speakers.size < 2) {
    push('length', `${slug}：Part ${l.part} 是对话，至少需要两位说话人`);
  }
  if ((l.part === 2 || l.part === 4) && speakers.size !== 1) {
    push('length', `${slug}：Part ${l.part} 是独白，只能有一位说话人，现在有 ${speakers.size} 位`);
  }
  for (const member of l.cast) {
    if (!l.transcript.some(utterance => utterance.speaker === member.id)) {
      push('length', `${slug}：说话人 ${member.id} 没有台词`);
    }
  }

  // ---- 原文可以直接朗读：没有数字、符号、缩写、连续空白，句末有标点 ----
  l.transcript.forEach((utterance, index) => {
    const text = utterance.text;
    if (UNSPEAKABLE.test(text)) push('speakable', `${slug} 第 ${index} 句含数字或符号：${text}`);
    if (ABBREVIATIONS.test(text)) push('speakable', `${slug} 第 ${index} 句含缩写：${text}`);
    if (/\s{2,}/.test(text)) push('speakable', `${slug} 第 ${index} 句有连续空白`);
    if (!/[.?!]$/.test(text)) push('speakable', `${slug} 第 ${index} 句没有以句末标点结束：${text}`);
  });

  // ---- 口语数字串必须给考生标准写法 ----
  l.transcript.forEach((utterance, index) => {
    if (!SPOKEN_NUMBER_RUN.test(utterance.text)) return;
    if (!utterance.displayText) {
      push('spoken-number', `${slug} 第 ${index} 句「${utterance.text}」缺少考生写法`);
    } else if (!/\d/.test(utterance.displayText)) {
      push('spoken-number', `${slug} 第 ${index} 句的展示写法没有数字`);
    }
  });

  // ---- 词汇与词组讲解足够，且都带语境 ----
  if (l.vocabulary.length < 6) push('notes', `${slug}：词汇只有 ${l.vocabulary.length} 条，至少 6 条`);
  if (l.expressions.length < 5) push('notes', `${slug}：词组只有 ${l.expressions.length} 条，至少 5 条`);
  if ((l.tips?.length ?? 0) < 2) push('notes', `${slug}：答题提示只有 ${l.tips?.length ?? 0} 条，至少 2 条`);
  const withPhonetic = l.vocabulary.filter(item => item.phonetic).length;
  if (l.vocabulary.length > 0 && withPhonetic / l.vocabulary.length < 0.8) {
    push('notes', `${slug}：带音标的词汇占比 ${withPhonetic}/${l.vocabulary.length}，不足 80%`);
  }
  const withListeningTip = l.vocabulary.filter(item => item.listening).length;
  if (withListeningTip < 3) {
    push('notes', `${slug}：带听力提示的词汇只有 ${withListeningTip} 条，至少 3 条`);
  }
  // 讲词与讲题要对得上：至少三条讲解引用的是答案句
  const evidenceSentences = new Set(l.answers.map(answer => answer.evidence));
  const explainedOnEvidence = [...l.vocabulary, ...l.expressions]
    .filter(item => evidenceSentences.has(item.sentenceIndex)).length;
  if (explainedOnEvidence < 3) {
    push('notes', `${slug}：引用答案句的讲解只有 ${explainedOnEvidence} 条，至少 3 条`);
  }

  // ---- 解析写到了定位与干扰，不是一句空话 ----
  for (const answer of l.answers) {
    if (answer.explanation.zh.length < 24) {
      push('explanation', `${slug} 第 ${answer.number} 题中文解析不足 24 字（${answer.explanation.zh.length}）`);
    }
    if (answer.explanation.en.length < 50) {
      push('explanation', `${slug} 第 ${answer.number} 题英文解析不足 50 字（${answer.explanation.en.length}）`);
    }
    if (!/句|定位|听到|原文/.test(answer.explanation.zh)) {
      push('explanation', `${slug} 第 ${answer.number} 题中文解析没有提到定位/原文`);
    }
    // 解析里引用的“定位句 N / Sentence N”必须就是 evidence
    const quotedZh = answer.explanation.zh.match(/定位句 (\d+)/);
    if (!quotedZh) {
      push('explanation', `${slug} 第 ${answer.number} 题中文解析没有写“定位句 N”`);
    } else if (Number(quotedZh[1]) !== answer.evidence) {
      push('explanation', `${slug} 第 ${answer.number} 题中文解析的定位句 ${quotedZh[1]} 与 evidence ${answer.evidence} 不一致`);
    }
    const quotedEn = answer.explanation.en.match(/Sentences? (\d+)/);
    if (!quotedEn) {
      push('explanation', `${slug} 第 ${answer.number} 题英文解析没有写“Sentence N”`);
    } else if (Number(quotedEn[1]) !== answer.evidence) {
      push('explanation', `${slug} 第 ${answer.number} 题英文解析的定位句 ${quotedEn[1]} 与 evidence ${answer.evidence} 不一致`);
    }
  }
  for (const item of l.vocabulary) {
    if (item.example.en.length < 20) push('explanation', `${slug} 生词「${item.term}」例句英文不足 20 字符`);
    if (item.usage.zh.length < 8) push('explanation', `${slug} 生词「${item.term}」中文用法说明不足 8 字`);
  }
  for (const item of l.expressions) {
    if (item.example.en.length < 20) push('explanation', `${slug} 词组「${item.phrase}」例句英文不足 20 字符`);
    if (item.usage.zh.length < 8) push('explanation', `${slug} 词组「${item.phrase}」中文用法说明不足 8 字`);
  }

  // ---- 答案与选项没有明显偏向 ----
  const answerFor = (number: number) => l.answers.find(answer => answer.number === number)!;
  const letters = locations
    .filter(location => l.sections[location.sectionIndex].kind !== 'completion')
    .map(location => answerFor(location.number).accepted[0]);
  if (letters.length >= 2 && new Set(letters).size < 2) {
    push('answer-bias', `${slug}：选项字母全是 ${letters.join('')}`);
  }
  const completions = locations
    .filter(location => l.sections[location.sectionIndex].kind === 'completion')
    .map(location => answerFor(location.number).accepted[0].toLowerCase());
  if (completions.length >= 2 && new Set(completions).size !== completions.length) {
    push('answer-bias', `${slug}：填空备选答案重复`);
  }
  for (const section of l.sections) {
    const options = section.kind === 'choice-single'
      ? section.questions.flatMap(question => question.options.map(option => option.text))
      : section.kind === 'matching' || section.kind === 'choice-multiple'
        ? section.options.map(option => option.text)
        : [];
    if (new Set(options.map(text => text.toLowerCase())).size !== options.length) {
      push('answer-bias', `${slug}：同一题块的选项文字重复`);
    }
  }
  for (const section of l.sections) {
    if (section.kind !== 'completion') continue;
    const blanks = sectionQuestionNumbers(section, (l.part - 1) * LISTENING_QUESTION_COUNT + 1).length;
    if (blanks < 2) push('answer-bias', `${slug}：填空题块只有 ${blanks} 个空（≥2）`);
  }

  // ---- 题号按雅思规则连续：Part 1 是 1–10，Part 2 是 11–20，以此类推 ----
  const first = (l.part - 1) * LISTENING_QUESTION_COUNT + 1;
  const expectedNumbers = Array.from({ length: LISTENING_QUESTION_COUNT }, (_, offset) => first + offset);
  if (locations.map(location => location.number).join(',') !== expectedNumbers.join(',')) {
    push('numbering', `${slug}：题号不是 ${first}–${first + LISTENING_QUESTION_COUNT - 1} 连续编号`);
  }
  if (l.answers.map(answer => answer.number).join(',') !== expectedNumbers.join(',')) {
    push('numbering', `${slug}：答案题号不是 ${first}–${first + LISTENING_QUESTION_COUNT - 1} 顺序排列`);
  }

  // ---- 填空的备选写法都符合试卷上的词数限制（答案记录存在且有写法） ----
  for (const section of l.sections) {
    if (section.kind !== 'completion') continue;
    for (const number of sectionQuestionNumbers(section, first)) {
      const answer = l.answers.find(item => item.number === number);
      if (!answer) {
        push('completion', `${slug} 第 ${number} 题没有答案记录`);
      } else if (answer.accepted.length < 1) {
        push('completion', `${slug} 第 ${number} 题缺少可接受写法`);
      }
    }
  }

  return violations;
}
