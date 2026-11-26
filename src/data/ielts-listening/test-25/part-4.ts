import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 25 · Part 4 — 记忆与遗忘（单人讲座，加拿大口音）。原创仿真材料。
 *
 * 讲座顺序：编码挂靠已有知识 → 提取情境线索 → 相似材料干扰与压力 → 遗忘曲线形态 →
 * 间隔重复策略；笔记填空五题在前，多选两题居中，单选三题在后。开场用反问，
 * 不用 Today's lecture is about 句式。
 */
export const test25Part4: ListeningLesson = {
  slug: 'test-25-part-4',
  part: 4,
  status: 'published',
  title: { zh: '记忆与遗忘', en: 'Memory and forgetting' },
  summary: {
    zh: '讲座讲解记忆的编码与提取：新信息挂靠已有知识，提取情境与编码情境一致时线索最有效；相似材料相互竞争、高压学习会削弱记录。遗忘曲线显示最初一天流失最快、随后趋平，推荐短时段间隔重复来强化记忆痕迹。',
    en: 'The lecture covers encoding and retrieval: new information attaches to existing knowledge, and retrieval works best when the context matches the encoding context. Similar materials compete, and high stress weakens the record. The forgetting curve shows the fastest loss in the first day before levelling off; short spaced sessions strengthen the memory trace.',
  },
  accent: { zh: '讲者为加拿大口音，语速平稳，术语重读。', en: 'The lecturer has a Canadian accent, speaking steadily and stressing the technical terms.' },
  speechRate: '+5%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Encoding: new information is attached to existing', cells: [[{ blank: 31 }]] },
        { lead: 'Retrieval works best when the', cells: [[{ blank: 32 }, { text: ' matches the encoding situation' }]] },
        { lead: 'Interference: similar materials', cells: [[{ blank: 33 }, { text: ' for the same neural space' }]] },
        { lead: 'Most forgetting happens within the first', cells: [[{ blank: 34 }]] },
        { lead: 'Spaced reviews strengthen the memory', cells: [[{ blank: 35 }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO factors weaken the memory record? Choose TWO letters, A–E.',
      select: 2,
      stem: 'Which TWO factors most clearly weaken what you encode?',
      options: [
        { key: 'A', text: 'studying similar subjects back to back' },
        { key: 'B', text: 'getting enough sleep before study' },
        { key: 'C', text: 'saying the study words aloud' },
        { key: 'D', text: 'high emotional stress while learning' },
        { key: 'E', text: 'working in a quiet room' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 38,
          stem: 'Why do context cues help recall?',
          options: [
            { key: 'A', text: 'They store the fact in a second memory' },
            { key: 'B', text: 'They recreate the situation where learning happened' },
            { key: 'C', text: 'They remove the interference from similar material' },
          ],
        },
        {
          number: 39,
          stem: 'What does the forgetting curve show?',
          options: [
            { key: 'A', text: 'Memory fades at an even rate across each week' },
            { key: 'B', text: 'Recalled material returns automatically after rest' },
            { key: 'C', text: 'Memory drops fastest at the start, then levels off' },
          ],
        },
        {
          number: 40,
          stem: 'Which review strategy does the lecturer recommend?',
          options: [
            { key: 'A', text: 'Short sessions spaced over time' },
            { key: 'B', text: 'One long cramming session the night before' },
            { key: 'C', text: 'Rereading every page at each review' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['knowledge'], evidence: 4,
      explanation: {
        zh: '定位句 4：Instead, you attach the new information to knowledge you already have。编码时新信息挂靠已有知识，填 knowledge。',
        en: 'Sentence 4: "Instead, you attach the new information to knowledge you already have". New information attaches to existing knowledge, so write knowledge.',
      },
    },
    {
      number: 32, accepted: ['context'], evidence: 9,
      explanation: {
        zh: '定位句 9：retrieval works best when the context matches the encoding context。提取情境与编码情境一致时效果最好，填 context。',
        en: 'Sentence 9: "retrieval works best when the context matches the encoding context". Retrieval matches the encoding context, so write context.',
      },
    },
    {
      number: 33, accepted: ['compete'], evidence: 15,
      explanation: {
        zh: '定位句 15：When two sets of similar facts compete for the same neural space, each pulls the other aside。相似材料竞争同一神经空间，填 compete。',
        en: 'Sentence 15: "When two sets of similar facts compete for the same neural space, each pulls the other aside". Similar facts compete for the same space, so write compete.',
      },
    },
    {
      number: 34, accepted: ['day'], evidence: 24,
      explanation: {
        zh: '定位句 24：He found that most forgetting happens within the first day after learning。大部分遗忘发生在最初一天，填 day。',
        en: 'Sentence 24: "He found that most forgetting happens within the first day after learning". Most loss occurs in the first day, so write day.',
      },
    },
    {
      number: 35, accepted: ['trace'], evidence: 32,
      explanation: {
        zh: '定位句 32：Each revisit strengthens the memory trace, and the next loss becomes slower than before。间隔复习强化记忆痕迹，填 trace。',
        en: 'Sentence 32: "Each revisit strengthens the memory trace, and the next loss becomes slower than before". Reviews strengthen the memory trace, so write trace.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 38,
      explanation: {
        zh: '定位句 38：studying similar subjects back to back makes their details compete and blur together。相近科目连着学是削弱记录的因素之一，对应 A。',
        en: 'Sentence 38: "studying similar subjects back to back makes their details compete and blur together". Similar subjects studied back to back weaken the record, matching A.',
      },
    },
    {
      number: 37, accepted: ['D'], evidence: 39,
      explanation: {
        zh: '定位句 39：high emotional stress while learning narrows the focus and encodes the material weakly。学习时的高压是另一削弱因素，对应 D。B 的睡眠、C 的出声朗读、E 的安静房间在句 40 被归为支持性习惯。',
        en: 'Sentence 39: "high emotional stress while learning narrows the focus and encodes the material weakly". High stress while learning weakens encoding, matching D. Sleep, saying words aloud and a quiet room are supportive habits in sentence 40.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 42,
      explanation: {
        zh: '定位句 42：Context cues help recall because they recreate the situation where learning took place。情境线索重建学习时的场景，对应 B。A 的二次存储与 C 的消除干扰在本段没有依据。',
        en: 'Sentence 42: "Context cues help recall because they recreate the situation where learning took place". Cues recreate the learning situation, matching B. A second memory and removing interference are not mentioned.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 44,
      explanation: {
        zh: '定位句 44：The forgetting curve shows memory dropping fastest at the start, then levelling off over time。曲线开头掉得最快、随后趋平，对应 C。A 的匀速遗忘与 B 的自动恢复在本段被否定。',
        en: 'Sentence 44: "The forgetting curve shows memory dropping fastest at the start, then levelling off over time". The fastest loss at first then a plateau matches C. Even fading and automatic return are rejected here.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 46,
      explanation: {
        zh: '定位句 46：the recommended strategy is short sessions spaced over time, not one long block。推荐短时段间隔复习，对应 A。B 的考前一晚突击在句 33 被否定，C 的每次重读全页在句 35 被否定。',
        en: 'Sentence 46: "the recommended strategy is short sessions spaced over time, not one long block". Short spaced sessions match A. A single cramming block is rejected in sentence 33, and rereading every page in sentence 35.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'How much of what you study tonight will still be there next month?' },
    { speaker: 'lecturer', text: 'Today we look at why some things stay in memory and others fade within days.' },
    { speaker: 'lecturer', text: 'Memory starts with encoding, the way the brain turns new input into a lasting record.' },
    { speaker: 'lecturer', text: 'When you meet new facts, you do not store them in empty space.' },
    { speaker: 'lecturer', text: 'Instead, you attach the new information to knowledge you already have.' },
    { speaker: 'lecturer', text: 'The stronger that link, the easier the fact is to bring back later.' },
    { speaker: 'lecturer', text: 'Students who know the field already usually learn a new concept faster than beginners.' },
    { speaker: 'lecturer', text: 'This does not mean beginners cannot learn, only that the first links take more time.' },
    { speaker: 'lecturer', text: 'Next comes retrieval, pulling the stored record back into mind when you need it.' },
    { speaker: 'lecturer', text: 'A key finding is that retrieval works best when the context matches the encoding context.' },
    { speaker: 'lecturer', text: 'The room, the mood, even the words around a fact can act as cues to bring it back.' },
    { speaker: 'lecturer', text: 'If you studied sitting by a window, the same view may later help recall what you read.' },
    { speaker: 'lecturer', text: 'Context cues do not hold the fact themselves; they point to where it was stored.' },
    { speaker: 'lecturer', text: 'This is why recalling the original situation often unlocks a memory that feels lost.' },
    { speaker: 'lecturer', text: 'Now a common reason we forget is interference between similar materials.' },
    { speaker: 'lecturer', text: 'When two sets of similar facts compete for the same neural space, each pulls the other aside.' },
    { speaker: 'lecturer', text: 'Learning two close subjects one after another can blur both, because details swap in memory.' },
    { speaker: 'lecturer', text: 'This effect grows when the material shares names, dates or rules.' },
    { speaker: 'lecturer', text: 'Unlike simple decay, interference can be reduced by spacing the topics apart.' },
    { speaker: 'lecturer', text: 'Stress also plays a part. A high emotional state while learning narrows attention and weakens the record.' },
    { speaker: 'lecturer', text: 'Sleep, on the other hand, lets the brain sort and consolidate what was studied during the day.' },
    { speaker: 'lecturer', text: 'A quiet room and saying words aloud are ordinary study habits that do not themselves block memory.' },
    { speaker: 'lecturer', text: 'These support focus, but they do not rescue material encoded weakly in the first place.' },
    { speaker: 'lecturer', text: 'The pattern of forgetting was first drawn by a researcher who tested his own recall.' },
    { speaker: 'lecturer', text: 'He found that most forgetting happens within the first day after learning.' },
    { speaker: 'lecturer', text: 'After that sharp drop, the curve levels off, and what remains fades much more slowly.' },
    { speaker: 'lecturer', text: 'This means the first twenty four hours matter more than later weeks for keeping a new fact.' },
    { speaker: 'lecturer', text: 'Recall does not fall evenly; the steepest loss sits right after the study session.' },
    { speaker: 'lecturer', text: 'Many students feel discouraged after forgetting a first draft, but that loss follows a normal curve.' },
    { speaker: 'lecturer', text: 'The curve itself was drawn from simple word lists, so real material can fade a little differently.' },
    { speaker: 'lecturer', text: 'Still, its main message holds, which is to review early before the steep drop carries the material away.' },
    { speaker: 'lecturer', text: 'How should review be planned? The evidence favors short sessions spread over time.' },
    { speaker: 'lecturer', text: 'Each revisit strengthens the memory trace, and the next loss becomes slower than before.' },
    { speaker: 'lecturer', text: 'Cramming everything into one long evening fills the trace for a day, but it does not last.' },
    { speaker: 'lecturer', text: 'Short spaced reviews, by contrast, build a record that survives into exam week.' },
    { speaker: 'lecturer', text: 'You do not need to reread every page each time; a quick recall check is enough.' },
    { speaker: 'lecturer', text: 'Trying to pull the fact out yourself works better than reading the notes over again.' },
    { speaker: 'lecturer', text: 'Let us turn to two factors that weaken the record most clearly.' },
    { speaker: 'lecturer', text: 'First, studying similar subjects back to back makes their details compete and blur together.' },
    { speaker: 'lecturer', text: 'Second, high emotional stress while learning narrows the focus and encodes the material weakly.' },
    { speaker: 'lecturer', text: 'Good sleep, saying words aloud and a quiet room are supportive habits rather than threats.' },
    { speaker: 'lecturer', text: 'Now a few questions about why this happens in memory terms.' },
    { speaker: 'lecturer', text: 'Context cues help recall because they recreate the situation where learning took place.' },
    { speaker: 'lecturer', text: 'The brain treats shared details as a doorway back to the original session.' },
    { speaker: 'lecturer', text: 'The forgetting curve shows memory dropping fastest at the start, then levelling off over time.' },
    { speaker: 'lecturer', text: 'It does not mean the lost material is gone forever, but a weak trace is hard to rebuild.' },
    { speaker: 'lecturer', text: 'As for review, the recommended strategy is short sessions spaced over time, not one long block.' },
    { speaker: 'lecturer', text: 'Spacing lets each trace settle before the next review pushes it deeper.' },
    { speaker: 'lecturer', text: 'Before we close, note that memory is not a filing cabinet where facts sit untouched.' },
    { speaker: 'lecturer', text: 'It is an active rebuild each time you recall, and every recall leaves the record a little stronger.' },
    { speaker: 'lecturer', text: 'If you plan reviews around these limits, you will keep more of what you study with less effort.' },
  ],
  vocabulary: [
    {
      term: 'encoding', phonetic: '/ɪnˈkoʊdɪŋ/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '编码，信息存入记忆的过程', en: 'the process of turning new input into a lasting memory record' },
      usage: { zh: '不可数；encoding context、weak encoding。动词 encode。', en: 'Uncountable: encoding context, weak encoding. The verb is encode.' },
      collocations: ['the encoding context', 'the encoding process', 'weak encoding'],
      example: { en: 'Encoding turns new input into a lasting record in the brain.', zh: '编码把新输入变成脑中持久的记录。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈkoʊ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'retrieval', phonetic: '/rɪˈtriːvl/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '提取，回忆调取', en: 'pulling a stored memory back into mind when needed' },
      usage: { zh: '不可数；retrieval context、memory retrieval。动词 retrieve。', en: 'Uncountable: retrieval context, memory retrieval. The verb is retrieve.' },
      collocations: ['memory retrieval', 'the retrieval context', 'aid retrieval'],
      example: { en: 'Retrieval works best when the context matches encoding.', zh: '情境一致时提取最顺利。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtriː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'context', phonetic: '/ˈkɒntekst/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '情境，背景线索', en: 'the room, mood and surroundings present when learning happens' },
      usage: { zh: '可数；context cues、the encoding context。', en: 'Countable: context cues, the encoding context.' },
      collocations: ['the context matches', 'context cues', 'the original context'],
      example: { en: 'The context at retrieval should match the encoding context.', zh: '提取情境应与编码情境一致。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkɒn/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'interference', phonetic: '/ˌɪntərˈfɪrəns/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '干扰，相似材料互相削弱', en: 'similar memories blocking or blurring one another' },
      usage: { zh: '不可数；interference between materials。动词 interfere。', en: 'Uncountable: interference between materials. The verb is interfere.' },
      collocations: ['interference between similar materials', 'reduce interference', 'competitive interference'],
      example: { en: 'Interference grows when two materials share names or rules.', zh: '两份材料同名同规则时干扰增强。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈfɪr/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'consolidate', phonetic: '/kənˈsɒlɪdeɪt/', partOfSpeech: 'v.', sentenceIndex: 20,
      meaning: { zh: '巩固，固化（记忆）', en: 'to sort and fix studied material into a stable memory' },
      usage: { zh: '及物；consolidate what was studied。名词 consolidation。', en: 'Transitive: consolidate what was studied. The noun is consolidation.' },
      collocations: ['consolidate what was studied', 'consolidate memory', 'consolidate during sleep'],
      example: { en: 'Sleep lets the brain consolidate the material studied that day.', zh: '睡眠让大脑巩固当天所学。' },
      listening: { zh: '五个音节，重音在第二音节 /ˈsɒl/。', en: 'Five syllables with stress on the second.' },
    },
    {
      term: 'trace', phonetic: '/treɪs/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '记忆痕迹', en: 'the lasting record left in memory after a review' },
      usage: { zh: '可数；memory trace、strengthen the trace。', en: 'Countable: memory trace, strengthen the trace.' },
      collocations: ['the memory trace', 'strengthen the trace', 'a weak trace'],
      example: { en: 'Each review strengthens the memory trace a little more.', zh: '每次复习都把记忆痕迹加固一点。' },
      listening: { zh: '单音节；与 trade 押韵，结尾 /s/。', en: 'One syllable, rhyming with trade; ending /s/.' },
    },
    {
      term: 'cramming', phonetic: '/ˈkræmɪŋ/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '考前突击，临时死记', en: 'forcing a large amount of material into one long study block' },
      usage: { zh: '不可数；cram everything into one evening。动词 cram。', en: 'Uncountable: cram everything into one evening. The verb is cram.' },
      collocations: ['cramming for an exam', 'one long cramming block', 'cram everything in'],
      example: { en: 'Cramming into one long evening does not last into exam week.', zh: '一晚突击撑不到考试周。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkræ/；结尾 /ɪŋ/。', en: 'Two syllables with stress on the first; ending /ɪŋ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'attach the new information to', sentenceIndex: 4,
      meaning: { zh: '把新信息挂靠到（已有知识上）', en: 'to link new information to something already held in memory' },
      usage: { zh: 'attach something to something；此处即把新信息挂到已有知识上。', en: 'Attach something to something; here new information is linked to existing knowledge.' },
      example: { en: 'You attach the new information to knowledge you already have.', zh: '你把新信息挂靠在已有知识之上。' },
    },
    {
      phrase: 'bring back', sentenceIndex: 5,
      meaning: { zh: '回忆起，调取出来', en: 'to recall a stored fact when it is needed' },
      usage: { zh: '可分短语动词；bring back a fact、bring it back later。', en: 'Separable: bring back a fact, bring it back later.' },
      example: { en: 'A strong link makes the fact easy to bring back later.', zh: '联结越强，事后越容易回忆起来。' },
    },
    {
      phrase: 'act as cues', sentenceIndex: 10,
      meaning: { zh: '充当线索，提示回忆入口', en: 'to serve as signals that point to a stored memory' },
      usage: { zh: 'act as cues to bring it back；cues 为复数。', en: 'Act as cues to bring it back; cues is plural.' },
      example: { en: 'The room and mood can act as cues to recall the fact.', zh: '房间与情绪可充当回忆线索。' },
    },
    {
      phrase: 'levels off', sentenceIndex: 25,
      meaning: { zh: '趋平，下降速度放缓', en: 'to stop dropping steeply and flatten out over time' },
      usage: { zh: 'level off；主语常是曲线或比率。过去式 levelled off。', en: 'Level off; the subject is a curve or rate. Past tense levelled off.' },
      example: { en: 'After the sharp drop, the forgetting curve levels off.', zh: '急剧下降后遗忘曲线趋于平缓。' },
    },
    {
      phrase: 'back to back', sentenceIndex: 38,
      meaning: { zh: '接连地，中间不隔开', en: 'one after another, with no gap between topics' },
      usage: { zh: '副词短语；study subjects back to back。', en: 'Adverbial: study subjects back to back.' },
      example: { en: 'Studying similar subjects back to back blurs their details.', zh: '相近科目连着学容易混淆细节。' },
    },
    {
      phrase: 'rather than', sentenceIndex: 40,
      meaning: { zh: '而不是', en: 'in contrast to the option being rejected' },
      usage: { zh: '连接并列成分；supportive habits rather than threats。', en: 'Joins parallel parts: supportive habits rather than threats.' },
      example: { en: 'Sleep and quiet are supportive rather than threats.', zh: '睡眠与安静是助力而非威胁。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记填空抓定义句主干', en: 'For notes, catch the definition sentence' },
      body: {
        zh: '第 31–35 题答案都出现在解释概念的定义句里：attach to knowledge、context matches、facts compete、first day、memory trace。听这类讲座先跟段落主题词，空前后的印刷词常把答案限定为一个名词。',
        en: 'Items 31 to 35 all appear in definition sentences: attach to knowledge, context matches, facts compete, first day, memory trace. Follow each section’s topic word; the printed words around the gap usually limit the answer to one noun.',
      },
    },
    {
      title: { zh: '多选区分削弱因素与支持习惯', en: 'Split weakening factors from supportive habits' },
      body: {
        zh: '第 36、37 题选两个削弱记录的因素：相近科目连着学、高压学习。睡眠充足、出声朗读、安静房间被明确归为 supportive habits rather than threats，听到 rather than 就排除这些选项。',
        en: 'Items 36 and 37 pick the two weakening factors: similar subjects back to back and high stress. Sleep, saying words aloud and a quiet room are called supportive habits rather than threats; on rather than, eliminate those options.',
      },
    },
    {
      title: { zh: '单选题听因果与形态描述', en: 'Listen to cause and shape in single choice' },
      body: {
        zh: '第 38 题问情境线索为何有用，答案在 because 之后；第 39 题问曲线形态，答案在 fastest at the start then levelling off；第 40 题问策略，答案在 recommended strategy is 之后。抓住这些信号词即可定位。',
        en: 'Item 38 asks why cues help, answered after because; item 39 asks the curve’s shape, answered in fastest at the start then levelling off; item 40 asks the strategy, answered after recommended strategy is. These signal phrases locate each answer.',
      },
    },
  ],
};
