import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 11 · Part 3 — 城市骑行毕业论文选题（两人讨论，新西兰 + 爱尔兰口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：题目收窄 → 公开数据可得性 → 理论框架 → 写作节奏 → 选题理由与数据来源 →
 * 大纲要求 → 偏差控制措施（多选 28–30）。配对 21–24 先于单选 25–27，多选最后。
 */
export const test11Part3: ListeningLesson = {
  slug: 'test-11-part-3',
  part: 3,
  status: 'published',
  title: { zh: '城市骑行毕业论文选题', en: 'Planning a dissertation on urban cycling' },
  summary: {
    zh: '两名学生讨论城市骑行毕业论文：把题目收窄到大学周边路线，核查公开数据集，围绕安全与舒适搭建理论框架，安排每周写作目标，并设计问卷的偏差控制与小范围试点。',
    en: 'Two students plan a dissertation on urban cycling: narrowing the topic to routes near the university, checking public datasets, framing the study around safety and comfort, setting a weekly writing target, and planning bias controls plus a pilot survey.',
  },
  accent: { zh: 'Liam 为新西兰口音，Emily 为爱尔兰口音，两人语速中等。', en: 'Liam speaks with a New Zealand accent and Emily with an Irish accent, both at a moderate pace.' },
  speechRate: '+2%',
  cast: [
    { id: 'liam', label: 'LIAM', gender: 'male', voice: 'en-NZ-MitchellNeural' },
    { id: 'emily', label: 'EMILY', gender: 'female', voice: 'en-IE-EmilyNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'What does each person suggest? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'narrow focus to cycling routes near the university' },
        { key: 'B', text: 'use survey data collected by the city council' },
        { key: 'C', text: 'build the theoretical framework around safety and comfort' },
        { key: 'D', text: 'set a weekly writing target for the draft' },
        { key: 'E', text: 'compare cycling use between two neighbouring suburbs' },
        { key: 'F', text: 'check which datasets are publicly available' },
      ],
      items: [
        { number: 21, text: 'Liam' },
        { number: 22, text: 'Emily' },
        { number: 23, text: 'Liam' },
        { number: 24, text: 'Emily' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Why did Liam choose urban cycling as his topic?',
          options: [
            { key: 'A', text: 'Campus congestion made walking unsafe for students' },
            { key: 'B', text: 'Other travel modes are already well studied or hard to measure' },
            { key: 'C', text: 'The bus company asked for independent research' },
          ],
        },
        {
          number: 26,
          stem: 'Which data source does Liam find most readily available without his own survey?',
          options: [
            { key: 'A', text: 'The council travel surveys' },
            { key: 'B', text: 'The university bike share records' },
            { key: 'C', text: 'The local cycling magazine reviews' },
          ],
        },
        {
          number: 27,
          stem: 'What does the supervisor require in the dissertation outline?',
          options: [
            { key: 'A', text: 'A full annotated bibliography' },
            { key: 'B', text: 'The research question and a rough timeline' },
            { key: 'C', text: 'A completed case study of two suburbs' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE measures will help control bias in the survey? Choose three letters, A–F.',
      select: 3,
      stem: 'Which THREE measures will help control bias in the survey?',
      options: [
        { key: 'A', text: 'include only people who already own a bike' },
        { key: 'B', text: 'ask both cyclists and non-cyclists the same questions' },
        { key: 'C', text: 'record where each survey response comes from' },
        { key: 'D', text: 'delete any unusual answers before analysis begins' },
        { key: 'E', text: 'run a small pilot before the main survey' },
        { key: 'F', text: 'collect responses only from the busiest street' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Liam 说 narrow the focus to the routes near the university，对应 A。E 的郊区比较在句 30 被他自己放弃。',
        en: 'Sentence 4: Liam says to "narrow the focus to the routes near the university", matching A. The suburb comparison in sentence 30 is dropped.',
      },
    },
    {
      number: 22, accepted: ['F'], evidence: 5,
      explanation: {
        zh: '定位句 5：Emily 问 have you checked which datasets are publicly available，对应 F。B 的市议会调查是句 19 讨论的现成来源，不是她这条建议。',
        en: 'Sentence 5: Emily asks "which datasets are publicly available", matching F. The council surveys in sentence 19 are an existing source, not this suggestion.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 10,
      explanation: {
        zh: '定位句 10：Liam 接受 Emily 在句 9 提出的框架，回应 Safety and comfort, rather than pure efficiency，对应 C。',
        en: 'Sentence 10: Liam accepts the framework Emily raised in sentence 9, answering "Safety and comfort, rather than pure efficiency", matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 11,
      explanation: {
        zh: '定位句 11：Emily 建议 Set a weekly writing target for the draft，对应 D。句 12 的章节文件夹是配套做法，不是写作目标本身。',
        en: 'Sentence 11: Emily suggests a "weekly writing target for the draft", matching D. The chapter folder in sentence 12 is a supporting habit.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：步行数据难收集、公交调查已存在，骑行介于两者之间且少有人研究，对应 B。A 的步行安全、C 的公交公司委托均未提及。',
        en: 'Sentence 17: walking data are hard to collect, bus surveys exist, and cycling sits between them with little campus study, matching B. A and C are not mentioned.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：The council travel surveys are the obvious source，对应 A。共享单车记录在句 22 只是备选，且可能只覆盖市中心。',
        en: 'Sentence 19: "The council travel surveys are the obvious source", matching A. Bike share records in sentence 22 are a possible backup.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：大纲要 main research question、short literature note 和 rough timeline，对应 B。完整书目是以后的事，郊区案例已被取消。',
        en: 'Sentence 26: the outline needs the research question, a literature note and a rough timeline, matching B. The full bibliography comes later, and the suburb case is dropped.',
      },
    },
    {
      number: 28, accepted: ['B'], evidence: 34,
      explanation: {
        zh: '定位句 34：Ask both cyclists and non-cyclists the same questions，对应 B。只问骑车人（A）正是句 33 指出的样本陷阱。',
        en: 'Sentence 34: ask "both cyclists and non-cyclists the same questions", matching B. Reaching only riders, A, is the trap in sentence 33.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 36,
      explanation: {
        zh: '定位句 36：Record where each response comes from，对应 C。按校门或郊区记录来源，才能检查样本分布。',
        en: 'Sentence 36: "Record where each response comes from", matching C. Tracking by gate or suburb lets them check the spread.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 39,
      explanation: {
        zh: '定位句 39：I’ll run a small pilot before the main survey，对应 E。删除异常答卷（D）在句 38 被否定，只采最忙街道（F）在句 41 被否定。',
        en: 'Sentence 39: a "small pilot before the main survey", matching E. Deleting odd answers, D, is rejected in sentence 38, and the busiest street only, F, in sentence 41.',
      },
    },
  ],
  transcript: [
    { speaker: 'liam', text: 'I spent last week looking at cycling counts around campus, and the numbers surprised me.' },
    { speaker: 'emily', text: 'Oh really? I’ve been meaning to ask what made you settle on urban cycling for the dissertation.' },
    { speaker: 'liam', text: 'It started with the congestion around the main gates. Bikes, buses and delivery vans all share the same narrow road.' },
    { speaker: 'emily', text: 'That sounds like a good case, but the title still feels too broad. You can’t study every cycle route in the city.' },
    { speaker: 'liam', text: 'I know. So I thought we could narrow the focus to the routes near the university, where most students ride.' },
    { speaker: 'emily', text: 'That makes the sample easier to reach. Before you fix the routes, though, have you checked which datasets are publicly available?' },
    { speaker: 'liam', text: 'Not yet. The council publishes travel surveys, but I don’t know how far back they go.' },
    { speaker: 'emily', text: 'I’d start there. If the public data cover your routes, you save weeks of collecting it yourself.' },
    { speaker: 'liam', text: 'Right. What about the theory part? The proposal needs a clear framework.' },
    { speaker: 'emily', text: 'Most cycling studies look at speed or distance. I’d build the framework around safety and comfort, since those shape whether people ride at all.' },
    { speaker: 'liam', text: 'Safety and comfort, rather than pure efficiency. That gives me two angles to compare.' },
    { speaker: 'emily', text: 'And once the outline is approved, don’t leave the writing to the end. Set a weekly writing target for the draft, even if it is only five hundred words.' },
    { speaker: 'liam', text: 'Five hundred a week sounds manageable. I’ll keep a folder for each chapter.' },
    { speaker: 'emily', text: 'A chapter folder also keeps your notes separate from the reading list.' },
    { speaker: 'liam', text: 'Have you spoken to your supervisor about the scope?' },
    { speaker: 'emily', text: 'Not yet. I want a rough plan first, so the meeting has something to react to.' },
    { speaker: 'liam', text: 'Fair enough. Tell me why cycling, rather than walking or public transport.' },
    { speaker: 'emily', text: 'Walking data are hard to collect, and bus surveys already exist. Cycling sits between them, and few students have looked at it on campus.' },
    { speaker: 'liam', text: 'That’s a solid reason. Now the data. What do you think you can get without running your own survey?' },
    { speaker: 'emily', text: 'The council travel surveys are the obvious source. They ask residents how they commute, and they break the answers down by suburb.' },
    { speaker: 'liam', text: 'Are those surveys detailed enough for route choice?' },
    { speaker: 'emily', text: 'Probably not. They tell me how people travel, not which street they take. I may need a short questionnaire of my own.' },
    { speaker: 'liam', text: 'Bike share records could help too, if the scheme publishes them by station.' },
    { speaker: 'emily', text: 'That would narrow it further, but station data may only cover the centre.' },
    { speaker: 'liam', text: 'I’ll check that next. For the outline, the supervisor usually wants more than a topic title.' },
    { speaker: 'emily', text: 'What does she ask for each proposal?' },
    { speaker: 'liam', text: 'She wants the main research question, a short literature note and a rough timeline. An annotated bibliography comes later.' },
    { speaker: 'emily', text: 'So the outline is question plus timeline, not the full reading list.' },
    { speaker: 'liam', text: 'If the supervisor wants a literature note, start with five key studies rather than thirty.' },
    { speaker: 'liam', text: 'I should also decide whether to compare two neighbouring suburbs.' },
    { speaker: 'emily', text: 'Hold on. That would widen the focus again. Keep the university routes for now, and add a comparison only if the data allow.' },
    { speaker: 'liam', text: 'Good point. I’ll drop the suburb comparison from the first draft.' },
    { speaker: 'emily', text: 'Now think about bias. If you run your own questionnaire, who answers it will shape the results.' },
    { speaker: 'liam', text: 'I could hand it out outside the bike racks, but that would only reach people who already ride.' },
    { speaker: 'emily', text: 'That’s the trap. Ask both cyclists and non-cyclists the same questions, so you compare attitudes rather than habits.' },
    { speaker: 'liam', text: 'How do I stop the answers from skewing toward one part of campus?' },
    { speaker: 'emily', text: 'Record where each response comes from, by gate or by suburb, and check the spread before you analyse it.' },
    { speaker: 'liam', text: 'And what about odd replies? If someone writes a joke answer, should I remove it early?' },
    { speaker: 'emily', text: 'Keep unusual answers until the pilot is over. Deleting them at the start hides problems with your questions.' },
    { speaker: 'liam', text: 'So the pilot matters. I’ll run a small pilot before the main survey, with twenty or thirty people.' },
    { speaker: 'emily', text: 'Yes. The pilot shows whether the questions are clear, and whether the route choices make sense.' },
    { speaker: 'emily', text: 'Watch the time you spend on each route, rather than counting every trip.' },
    { speaker: 'liam', text: 'I can mark the peak hour separately from the midday traffic.' },
    { speaker: 'emily', text: 'Keep a record of the weather on each count day, since rain changes cycling numbers.' },
    { speaker: 'liam', text: 'That matters more near the university, where students ride in all seasons.' },
    { speaker: 'emily', text: 'Ask riders what would make the route safer, not just whether they enjoy it.' },
    { speaker: 'liam', text: 'Non-riders can say what stops them from cycling too.' },
    { speaker: 'emily', text: 'Note the length of each interview, so you keep the sample balanced.' },
    { speaker: 'liam', text: 'I’ll aim for about fifteen minutes per conversation.' },
    { speaker: 'emily', text: 'And back up your figures with the council data wherever you can.' },
    { speaker: 'liam', text: 'That should keep the claims modest and checkable.' },
    { speaker: 'emily', text: 'Leave one chapter for the local conditions, rather than general theory.' },
    { speaker: 'liam', text: 'The safety angle can use the accident reports near the gates.' },
    { speaker: 'emily', text: 'Comfort covers shade, surface quality and places to wait at crossings.' },
    { speaker: 'liam', text: 'I’ll check whether those reports are available online first.' },
    { speaker: 'emily', text: 'If not, ask the department how you can access them.' },
    { speaker: 'liam', text: 'I should avoid relying only on the busiest street. Its riders are not typical of everyone.' },
    { speaker: 'emily', text: 'Right. Cover the quiet routes too, even if fewer people use them.' },
    { speaker: 'emily', text: 'The same applies to interviews. Speak to riders from different route types.' },
    { speaker: 'liam', text: 'Let me list the steps. Check public data, draft the framework, set the writing target, then plan the pilot.' },
    { speaker: 'emily', text: 'That order works. Book the supervisor meeting once the research question is one sentence.' },
    { speaker: 'liam', text: 'I’ll write that tonight. Thanks for talking it through.' },
  ],
  vocabulary: [
    {
      term: 'dissertation', phonetic: '/ˌdɪsəˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '学位论文', en: 'a long piece of research writing submitted for a degree' },
      usage: { zh: '可数；write/plan a dissertation，本科与硕士阶段常用。', en: 'Countable: write or plan a dissertation, common at undergraduate and master level.' },
      collocations: ['plan a dissertation', 'dissertation topic', 'the dissertation outline'],
      example: { en: 'My dissertation compares cycling routes around campus.', zh: '我的论文比较校园周边骑行路线。' },
      listening: { zh: '重音在第四音节 /ˈteɪ/，开头 /dɪ/ 轻读。', en: 'Stress the fourth syllable /ˈteɪ/; the opening /dɪ/ is soft.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '样本（调查对象）', en: 'the group of people who take part in a study' },
      usage: { zh: '可数；reach the sample、sample size。', en: 'Countable: reach the sample, sample size.' },
      collocations: ['the survey sample', 'sample size', 'reach the sample'],
      example: { en: 'The sample covers students living near the gates.', zh: '样本包括住在校门附近的学生。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɑː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'framework', phonetic: '/ˈfreɪmwɜːk/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '理论框架', en: 'the structure of ideas that supports a study' },
      usage: { zh: '可数；build a framework around something。', en: 'Countable: build a framework around something.' },
      collocations: ['the theoretical framework', 'build a framework', 'a safety framework'],
      example: { en: 'The study uses a framework of comfort and safety.', zh: '研究采用舒适与安全的框架。' },
      listening: { zh: '复合词，重音在第一部分 /freɪ/。', en: 'A compound word; stress the first part.' },
    },
    {
      term: 'efficiency', phonetic: '/ɪˈfɪʃnsi/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '效率，通行速度', en: 'how fast or productive a movement or system is' },
      usage: { zh: '不可数；pure efficiency 纯效率。形容词 efficient。', en: 'Uncountable; pure efficiency. The adjective is efficient.' },
      collocations: ['traffic efficiency', 'route efficiency', 'pure efficiency'],
      example: { en: 'The report measures speed rather than efficiency.', zh: '报告衡量速度而不是效率。' },
      listening: { zh: '重音在第二音节 /ˈfɪʃ/，结尾 /si/。', en: 'Stress the second syllable /ˈfɪʃ/; it ends in /si/.' },
    },
    {
      term: 'commute', phonetic: '/kəˈmjuːt/', partOfSpeech: 'v.', sentenceIndex: 19,
      meaning: { zh: '通勤，上下班往返', en: 'to travel regularly between home and work or study' },
      usage: { zh: '动词；名词 commuter、commute。', en: 'Verb; the noun and person form are commute and commuter.' },
      collocations: ['commute by bike', 'how people commute', 'daily commute'],
      example: { en: 'Residents were asked how they commute to campus.', zh: '居民被问到如何通勤去校园。' },
      listening: { zh: '重音在第二音节 /ˈmjuː/。', en: 'Stress the second syllable /ˈmjuː/.' },
    },
    {
      term: 'bias', phonetic: '/ˈbaɪəs/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '偏差，样本偏见', en: 'a tendency that makes results unfair or one-sided' },
      usage: { zh: '不可数；control bias、sample bias。形容词 biased。', en: 'Uncountable: control bias, sample bias; the adjective is biased.' },
      collocations: ['control bias', 'sample bias', 'response bias'],
      example: { en: 'The questionnaire is designed to reduce bias.', zh: '问卷设计用来减少偏差。' },
      listening: { zh: '两个音节，与 by 同韵。', en: 'Two syllables; rhymes with by.' },
    },
    {
      term: 'questionnaire', phonetic: '/ˌkwestʃəˈneə/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '问卷', en: 'a written set of questions for a survey' },
      usage: { zh: '可数；run a questionnaire、design a questionnaire。', en: 'Countable: run or design a questionnaire.' },
      collocations: ['a short questionnaire', 'the survey questionnaire', 'questionnaire responses'],
      example: { en: 'I will hand out a short questionnaire outside the library.', zh: '我会在图书馆外发放简短问卷。' },
      listening: { zh: '重音在第三音节 /ˈneə/，中间 /tʃə/ 轻读。', en: 'Stress the third syllable /ˈneə/; the middle /tʃə/ is soft.' },
    },
    {
      term: 'pilot', phonetic: '/ˈpaɪlət/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '试点，小规模预调查', en: 'a small test before the main study' },
      usage: { zh: '可数；run a pilot、pilot study。', en: 'Countable: run a pilot, a pilot study.' },
      collocations: ['a small pilot', 'run a pilot', 'the pilot phase'],
      example: { en: 'The pilot uses twenty or thirty students.', zh: '试点找二三十名学生参加。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpaɪ/。', en: 'Two syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'settle on', sentenceIndex: 1,
      meaning: { zh: '选定，敲定（题目）', en: 'to choose something after thinking it over' },
      usage: { zh: '及物短语；settle on a topic、settle on a route。', en: 'Transitive: settle on a topic, settle on a route.' },
      example: { en: 'She settled on cycling after comparing three subjects.', zh: '比较三个题目后她选定了骑行。' },
    },
    {
      phrase: 'narrow the focus', sentenceIndex: 4,
      meaning: { zh: '收窄研究范围', en: 'to make the study cover a smaller, clearer area' },
      usage: { zh: 'focus 作不可数名词；narrow the focus to something。', en: 'Focus is uncountable here: narrow the focus to something.' },
      example: { en: 'We narrow the focus to routes near the gates.', zh: '我们把范围收窄到校门附近路线。' },
    },
    {
      phrase: 'break the answers down', sentenceIndex: 19,
      meaning: { zh: '拆分（数据），按类别统计', en: 'to separate data into categories' },
      usage: { zh: '及物短语；break the answers down by suburb。', en: 'Transitive: break the answers down by suburb.' },
      example: { en: 'The survey breaks responses down by age.', zh: '调查按年龄拆分回答。' },
    },
    {
      phrase: 'react to', sentenceIndex: 15,
      meaning: { zh: '对……作出反馈', en: 'to give feedback on a draft or idea' },
      usage: { zh: '对某份草稿或想法给出反馈；常用 react to a plan、react to a proposal。', en: 'react to a plan, react to a proposal.' },
      example: { en: 'The supervisor needs a draft to react to.', zh: '导师需要一份草稿才能给出反馈。' },
    },
    {
      phrase: 'hold on', sentenceIndex: 30,
      meaning: { zh: '等等，先别急', en: 'a call to pause and reconsider' },
      usage: { zh: '对话中打断并提醒；后常接反驳。', en: 'Used in dialogue to interrupt and warn; often followed by a counterpoint.' },
      example: { en: 'Hold on, that would widen the topic again.', zh: '等等，那又会把题目扩大。' },
    },
    {
      phrase: 'shape the results', sentenceIndex: 32,
      meaning: { zh: '决定结果走向', en: 'to influence what the final results look like' },
      usage: { zh: 'shape 作动词；who answers it shapes the results。', en: 'Shape is a verb here: who answers it shapes the results.' },
      example: { en: 'The chosen sample shapes the whole outcome.', zh: '所选样本决定整个结果走向。' },
    },
    {
      phrase: 'relying only on', sentenceIndex: 56,
      meaning: { zh: '只依赖，仅凭', en: 'to use only one source or group' },
      usage: { zh: 'rely on 表示依赖；此处用现在分词 relying，避免只凭一条路线或一组人。', en: 'rely on means to depend on; here the gerund relying warns against one source only.' },
      example: { en: 'Do not rely on the busiest route alone.', zh: '不要只靠最忙的路线。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先记提议者', en: 'Match the suggestion to its speaker' },
      body: {
        zh: 'Part 3 配对常考“谁提出了哪条建议”。边听边在人名旁记下动词与关键词：narrow focus、public datasets、framework、writing target，别把对方重复认同的话当成他提出的。',
        en: 'Part 3 matching often asks who suggested what. Note the verb and keyword beside each name: narrow focus, public datasets, framework, writing target. Do not count agreement as a proposal.',
      },
    },
    {
      title: { zh: '多选盯被否定的干扰项', en: 'Track rejected options in multiple choice' },
      body: {
        zh: '多选三项正确，其余三项通常在对话里被明确否定：只找骑车人、删异常答卷、只采最忙街道。听到否定语气就在选项旁打叉，最后从剩下的里选三个。',
        en: 'Three options are correct and the rest are usually rejected outright: only riders, deleting odd answers, the busiest street only. Mark rejected ones as you hear them, then choose three from the rest.',
      },
    },
    {
      title: { zh: '学术讨论抓名词术语', en: 'Catch the academic nouns' },
      body: {
        zh: 'dissertation、framework、sample、pilot、bias 这类词在选项题干里反复出现。听到它们就预判后面是定义、理由还是操作步骤，单选题答案通常紧跟解释句。',
        en: 'Words like dissertation, framework, sample, pilot and bias recur in the stems. When you hear one, predict whether the next sentence defines, justifies or gives a step; the single-choice answer usually follows the explanation.',
      },
    },
  ],
};
