import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 16 · Part 3 — 睡眠播客讨论（两人讨论，加拿大 + 英国口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：选题角度 → 公开研究可得性 → 嘉宾选择 → 剪辑长度 → 选题理由与数据来源 →
 * 大纲要求 → 偏差控制（多选 28–30）。配对 21–24 先于单选 25–27，多选最后。
 */
export const test16Part3: ListeningLesson = {
  slug: 'test-16-part-3',
  part: 3,
  status: 'published',
  title: { zh: '睡眠播客讨论', en: 'Discussing a podcast on sleep' },
  summary: {
    zh: '两名学生策划睡眠主题播客：把首集聚焦青少年睡眠，核查公开研究，邀请睡眠障碍医生，控制单集剪辑长度，并确定主要数据来源、大纲要求与听众反馈的偏差控制方式。',
    en: 'Two students plan a sleep podcast: focusing the first episode on teenage sleep, checking open-access research, inviting a sleep-disorders doctor, keeping episodes short, and settling the main data source, outline requirements and listener-feedback bias controls.',
  },
  accent: { zh: 'Liam 为加拿大口音，Sonia 为英国口音，两人语速中等。', en: 'Liam speaks with a Canadian accent and Sonia with a British accent, both at a moderate pace.' },
  speechRate: '+5%',
  cast: [
    { id: 'liam', label: 'LIAM', gender: 'male', voice: 'en-CA-LiamNeural' },
    { id: 'sonia', label: 'SONIA', gender: 'female', voice: 'en-GB-SoniaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'What does each person suggest? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'focus the first episode on teenage sleep' },
        { key: 'B', text: 'invite a doctor who studies sleep disorders' },
        { key: 'C', text: 'quote a public survey on sleep hours' },
        { key: 'D', text: 'keep each edited episode under forty minutes' },
        { key: 'E', text: 'compare sleep habits in two age groups' },
        { key: 'F', text: 'check which studies are freely available' },
      ],
      items: [
        { number: 21, text: 'Liam' },
        { number: 22, text: 'Sonia' },
        { number: 23, text: 'Liam' },
        { number: 24, text: 'Sonia' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Why did they choose sleep as the podcast topic?',
          options: [
            { key: 'A', text: 'The course requires a series on student health' },
            { key: 'B', text: 'Campus fatigue is rarely studied by existing podcasts' },
            { key: 'C', text: 'The medical school asked for sleep research' },
          ],
        },
        {
          number: 26,
          stem: 'Which data source will the hosts rely on most at first?',
          options: [
            { key: 'A', text: 'A public survey on sleep hours' },
            { key: 'B', text: 'The university library’s sleep archive' },
            { key: 'C', text: 'Their own overnight diary study' },
          ],
        },
        {
          number: 27,
          stem: 'What does the tutor advise about the podcast outline?',
          options: [
            { key: 'A', text: 'A full annotated reading list' },
            { key: 'B', text: 'The main question and a rough running order' },
            { key: 'C', text: 'A completed interview with the expert' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE measures will help avoid bias in listener feedback? Choose three letters, A–F.',
      select: 3,
      stem: 'Which THREE measures will help avoid bias in listener feedback?',
      options: [
        { key: 'A', text: 'include only listeners who sleep badly' },
        { key: 'B', text: 'ask the same questions in the same order' },
        { key: 'C', text: 'record where each listener response comes from' },
        { key: 'D', text: 'cut any answer that looks unusual' },
        { key: 'E', text: 'run a short pilot episode first' },
        { key: 'F', text: 'collect feedback only from the busiest study hall' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Liam 说 focus the first episode on teenage sleep，对应 A。E 的两个年龄组比较在句 32 被他自己放弃。',
        en: 'Sentence 4: Liam suggests to "focus the first episode on teenage sleep", matching A. The two-age-group comparison in sentence 32 is dropped.',
      },
    },
    {
      number: 22, accepted: ['F'], evidence: 5,
      explanation: {
        zh: '定位句 5：Sonia 问 have you checked which studies are freely available online，对应 F。A 的公开睡眠调查是句 22 讨论的现成来源，不是这条建议。',
        en: 'Sentence 5: Sonia asks "which studies are freely available online", matching F. The public sleep survey in sentence 22 is an existing source, not this suggestion.',
      },
    },
    {
      number: 23, accepted: ['D'], evidence: 14,
      explanation: {
        zh: '定位句 14：Liam 提议 Keep each edited episode under forty minutes，对应 D。',
        en: 'Sentence 14: Liam proposes to keep "each edited episode under forty minutes", matching D.',
      },
    },
    {
      number: 24, accepted: ['B'], evidence: 9,
      explanation: {
        zh: '定位句 9：Sonia 建议 invite a doctor who studies sleep disorders，对应 B。句 10 她讨论真实故事，但不取代专家嘉宾。',
        en: 'Sentence 9: Sonia suggests to "invite a doctor who studies sleep disorders", matching B. The real story in sentence 10 does not replace the expert guest.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：Revision advice already exists, and few podcasts look at fatigue on campus。校园疲惫少有人做，对应 B。A 的课程要求、C 的医学院委托均未提及。',
        en: 'Sentence 21: revision advice exists, and "few podcasts look at fatigue on campus", matching B. A course requirement and a medical school request are not mentioned.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：A public survey on sleep hours is the obvious source，对应 A。图书馆档案在句 5 只是待查项，日记研究还没开始做。',
        en: 'Sentence 23: "A public survey on sleep hours is the obvious source", matching A. The library archive is still a check item in sentence 5, and the diary study has not begun.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：大纲要 main question、a short note on the research 和 a rough running order，对应 B。完整书目以后再补，专家访谈尚未完成。',
        en: 'Sentence 29: the outline needs the main question, a research note and a rough running order, matching B. The full bibliography comes later, and the expert interview is unfinished.',
      },
    },
    {
      number: 28, accepted: ['B'], evidence: 37,
      explanation: {
        zh: '定位句 37：Ask both good and poor sleepers the same questions，对应 B。只问睡不好的人（A）正是句 35 指出的样本陷阱。',
        en: 'Sentence 37: ask "both good and poor sleepers the same questions", matching B. Reaching only bad sleepers, A, is the trap in sentence 35.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 39,
      explanation: {
        zh: '定位句 39：Record where each listener response comes from，对应 C。按院系或年级记录来源，才能检查分布。',
        en: 'Sentence 39: "Record where each listener response comes from", matching C. Tracking by faculty or year lets them check the spread.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 42,
      explanation: {
        zh: '定位句 42：I’ll run a short pilot before the main series，对应 E。删除异常回复（D）在句 40 被否定，只采最忙自习室（F）在句 43 被否定。',
        en: 'Sentence 42: a "short pilot before the main series", matching E. Cutting odd replies, D, is rejected in sentence 40, and the busiest study hall only, F, in sentence 43.',
      },
    },
  ],
  transcript: [
    { speaker: 'liam', text: 'I came across a report that nearly half of local students sleep under six hours a night.' },
    { speaker: 'sonia', text: 'That sounds like the podcast we’ve been looking for. Why sleep rather than revision tips?' },
    { speaker: 'liam', text: 'Everyone talks about exam stress, but nobody follows how tired people actually are.' },
    { speaker: 'sonia', text: 'The angle should be narrow, though. We can’t cover the whole science of sleep in eight episodes.' },
    { speaker: 'liam', text: 'Right. I thought we focus the first episode on teenage sleep, since our listeners are mostly undergraduates.' },
    { speaker: 'sonia', text: 'That keeps the case relatable. Before locking the topic, have you checked which studies are freely available online?' },
    { speaker: 'liam', text: 'Not yet. The university library holds some, but I don’t know what the public can read.' },
    { speaker: 'sonia', text: 'Start there. Open-access research saves us weeks of asking permission to quote numbers.' },
    { speaker: 'liam', text: 'Who should we bring on as a guest?' },
    { speaker: 'sonia', text: 'I’d invite a doctor who studies sleep disorders, so the medical side has a clear voice.' },
    { speaker: 'liam', text: 'A researcher might be dry. Would a former patient be easier to listen to?' },
    { speaker: 'sonia', text: 'One real story works, but we still need an expert to answer the tricky questions.' },
    { speaker: 'liam', text: 'Fine. What about the length?' },
    { speaker: 'sonia', text: 'What feels right to you?' },
    { speaker: 'liam', text: 'Keep each edited episode under forty minutes, or people won’t finish it on the bus.' },
    { speaker: 'sonia', text: 'Forty minutes is tighter than my first plan. I can cut the intro and the long readings.' },
    { speaker: 'liam', text: 'Leave the listener question segment near the end, where it fits naturally.' },
    { speaker: 'sonia', text: 'Have you spoken to the course tutor about the outline?' },
    { speaker: 'liam', text: 'Not yet. I want a rough plan first, so the meeting has something to react to.' },
    { speaker: 'sonia', text: 'Tell me again what made you pick this subject.' },
    { speaker: 'liam', text: 'Walking past the library at midnight, I saw students still reading at the desks. That image stuck with me.' },
    { speaker: 'sonia', text: 'Same here. Revision advice already exists, and few podcasts look at fatigue on campus.' },
    { speaker: 'liam', text: 'What numbers can we use without running our own survey?' },
    { speaker: 'sonia', text: 'A public survey on sleep hours is the obvious source. It breaks replies down by age group and course.' },
    { speaker: 'liam', text: 'Is that detailed enough for bedtime routines?' },
    { speaker: 'sonia', text: 'Probably not. It says how many hours people get, not what they do before bed. We may ask listeners directly.' },
    { speaker: 'liam', text: 'Listener messages could help too, if we tag them by year of study.' },
    { speaker: 'sonia', text: 'I’ll check that next. For the outline, the tutor usually wants more than a title.' },
    { speaker: 'liam', text: 'What does she ask for each proposal?' },
    { speaker: 'sonia', text: 'She wants the main question, a short note on the research, and a rough running order. A full reading list comes later.' },
    { speaker: 'liam', text: 'So the outline is question plus order, not the whole bibliography.' },
    { speaker: 'sonia', text: 'If she wants background reading, start with three key papers rather than twenty.' },
    { speaker: 'liam', text: 'I should also decide whether to compare sleep habits in two age groups.' },
    { speaker: 'sonia', text: 'Hold on. That widens the focus again. Keep undergraduates for now, add the comparison only if the data allow.' },
    { speaker: 'liam', text: 'Good point. I’ll drop the age comparison from the first draft.' },
    { speaker: 'sonia', text: 'Now think about bias. If we invite listeners to reply, who answers will shape the results.' },
    { speaker: 'liam', text: 'We could put the call-out in the study hall, but that would reach only people who stay up late.' },
    { speaker: 'sonia', text: 'That’s the trap. Ask both good and poor sleepers the same questions, so we compare habits rather than a single type.' },
    { speaker: 'liam', text: 'How do I stop replies skewing toward one year group?' },
    { speaker: 'sonia', text: 'Record where each listener response comes from, by faculty or year, and check the spread before analysing it.' },
    { speaker: 'liam', text: 'What about odd replies? If someone writes a joke message, should I remove it early?' },
    { speaker: 'sonia', text: 'Keep unusual answers until the pilot is over. Deleting them at the start hides problems with the questions.' },
    { speaker: 'liam', text: 'So a pilot episode matters. I’ll run a short pilot before the main series, with twenty or thirty listeners.' },
    { speaker: 'sonia', text: 'Yes. The pilot shows whether the questions are clear and whether the stories land.' },
    { speaker: 'liam', text: 'I should avoid relying only on the busiest study hall. Its students are not typical of everyone.' },
    { speaker: 'sonia', text: 'Right. Cover the dorms and the evening sports clubs too, even if fewer replies come back.' },
    { speaker: 'liam', text: 'The same applies to interviews. Speak to listeners from different routines.' },
    { speaker: 'sonia', text: 'Let me list the steps. Check open studies, draft the outline, plan the guest, then record the pilot.' },
    { speaker: 'liam', text: 'That order works. Book the tutor meeting once the main question is one sentence.' },
    { speaker: 'sonia', text: 'I’ll write that tonight. Thanks for talking it through.' },
    { speaker: 'liam', text: 'We should keep the tone warm rather than academic.' },
    { speaker: 'sonia', text: 'Listeners can skip the long study summaries.' },
    { speaker: 'liam', text: 'Each episode ends with one practical sleep tip.' },
    { speaker: 'sonia', text: 'That keeps the series useful for students.' },
    { speaker: 'liam', text: 'We can invite listeners to send their own questions.' },
    { speaker: 'sonia', text: 'The best messages become the next episode’s opening.' },
    { speaker: 'liam', text: 'I’ll draft the episode titles by the weekend.' },
    { speaker: 'sonia', text: 'And I’ll check the open-access links tonight.' },
  ],
  vocabulary: [
    {
      term: 'fatigue', phonetic: '/fəˈtiːɡ/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '疲劳，疲惫', en: 'a state of being very tired from lack of rest' },
      usage: { zh: '不可数；campus fatigue、sleep fatigue。形容词 fatigued。', en: 'Uncountable: campus fatigue, sleep fatigue; the adjective is fatigued.' },
      collocations: ['student fatigue', 'tiredness and fatigue', 'chronic fatigue'],
      example: { en: 'Few podcasts discuss fatigue after late study nights.', zh: '很少播客谈熬夜学习后的疲惫。' },
      listening: { zh: '重音在第二音节 /ˈtiː/，结尾 /ɡ/ 清晰。', en: 'Stress the second syllable; the final /ɡ/ is clear.' },
    },
    {
      term: 'angle', phonetic: '/ˈæŋɡl/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '选题角度，切入视角', en: 'the particular way a topic is approached' },
      usage: { zh: '可数；the angle should be narrow、find an angle。', en: 'Countable: the angle should be narrow, find an angle.' },
      collocations: ['the podcast angle', 'a narrow angle', 'the editorial angle'],
      example: { en: 'The series needs a sharper angle than general sleep advice.', zh: '节目需要比泛泛睡眠建议更锋利的角度。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈæŋ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'episode', phonetic: '/ˈepɪsəʊd/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '（播客）一集', en: 'one programme in a numbered series' },
      usage: { zh: '可数；the first episode、the edited episode。', en: 'Countable: the first episode, the edited episode.' },
      collocations: ['the first episode', 'a short episode', 'record an episode'],
      example: { en: 'Each episode runs under forty minutes.', zh: '每集时长不到四十分钟。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈep/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'guest', phonetic: '/ɡest/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '嘉宾，受访者', en: 'a person invited to take part in a programme' },
      usage: { zh: '可数；invite a guest、the guest expert。', en: 'Countable: invite a guest, the guest expert.' },
      collocations: ['the guest expert', 'invite a guest', 'a guest interview'],
      example: { en: 'The doctor appears as the first guest.', zh: '医生作为首位嘉宾出场。' },
      listening: { zh: '单音节，与 chest 同尾韵。', en: 'One syllable, rhyming with chest.' },
    },
    {
      term: 'open-access', phonetic: '/ˌəʊpən ˈækses/', partOfSpeech: 'adj.', sentenceIndex: 7,
      meaning: { zh: '开放获取的（公开可读研究）', en: 'research anyone can read online without a subscription' },
      usage: { zh: '复合形容词；open-access research、an open-access paper。', en: 'Compound: open-access research, an open-access paper.' },
      collocations: ['open-access studies', 'open-access journals', 'open-access papers'],
      example: { en: 'Open-access papers can be quoted without written permission.', zh: '开放获取论文无需书面授权即可引用。' },
      listening: { zh: '复合词重音落在 access 上。', en: 'Stress falls on access in the compound.' },
    },
    {
      term: 'outline', phonetic: '/ˈaʊtlaɪn/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '大纲，提纲', en: 'a short plan of the main points' },
      usage: { zh: '可数；the podcast outline、draft an outline。', en: 'Countable: the podcast outline, draft an outline.' },
      collocations: ['the series outline', 'a rough outline', 'write an outline'],
      example: { en: 'The tutor reads the outline before the interview.', zh: '导师在访谈前先看大纲。' },
      listening: { zh: '复合词，重音在第一音节 /ˈaʊt/。', en: 'Compound with stress on the first part.' },
    },
    {
      term: 'research', phonetic: '/rɪˈsɜːtʃ/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '研究，调研', en: 'organized study of a subject to discover facts' },
      usage: { zh: '不可数；do research、a note on the research。', en: 'Uncountable: do research, a note on the research.' },
      collocations: ['background research', 'research question', 'do research'],
      example: { en: 'The outline needs a short note on the research.', zh: '提纲要附一段研究说明。' },
      listening: { zh: '重音在第二音节 /ˈsɜːtʃ/，结尾 /tʃ/ 清晰。', en: 'Stress the second syllable; the final /tʃ/ is clear.' },
    },
    {
      term: 'bias', phonetic: '/ˈbaɪəs/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '偏差，样本偏向', en: 'a tendency that makes feedback one-sided' },
      usage: { zh: '不可数；control bias、response bias。形容词 biased。', en: 'Uncountable: control bias, response bias; the adjective is biased.' },
      collocations: ['feedback bias', 'sample bias', 'control the bias'],
      example: { en: 'Feedback from one hall only creates bias.', zh: '只收集一个自习室的反馈会造成偏差。' },
      listening: { zh: '两个音节，与 by 同韵。', en: 'Two syllables, rhyming with by.' },
    },
    {
      term: 'pilot', phonetic: '/ˈpaɪlət/', partOfSpeech: 'n.', sentenceIndex: 42,
      meaning: { zh: '试播集，小规模预演', en: 'a short test episode before the main series' },
      usage: { zh: '可数；run a pilot、a pilot episode。', en: 'Countable: run a pilot, a pilot episode.' },
      collocations: ['a short pilot', 'the pilot episode', 'run a pilot'],
      example: { en: 'The pilot asks twenty or thirty listeners for replies.', zh: '试播集收集二三十名听众的反馈。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpaɪ/。', en: 'Two syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'stuck with me', sentenceIndex: 20,
      meaning: { zh: '留在我脑海里，让人难忘', en: 'to remain in someone’s memory' },
      usage: { zh: 'image stuck with me 表示画面印象深刻；stick with 另有坚持之意。', en: 'Image stuck with me means it lingered; stick with can also mean to keep at something.' },
      example: { en: 'The midnight library image stuck with me.', zh: '午夜图书馆的画面一直留在我脑海。' },
    },
    {
      phrase: 'running our own survey', sentenceIndex: 22,
      meaning: { zh: '自行发起调查', en: 'to collect primary data instead of using existing sources' },
      usage: { zh: 'run a survey；our own 强调不是现成数据。', en: 'Run a survey; our own stresses primary data over existing sources.' },
      example: { en: 'We can avoid running our own survey at first.', zh: '一开始我们可以不自己做调查。' },
    },
    {
      phrase: 'tag them by', sentenceIndex: 26,
      meaning: { zh: '按……给消息分类标记', en: 'to label responses according to a category' },
      usage: { zh: 'tag by year、tag by faculty；宾语可放中间。', en: 'Tag by year, tag by faculty; the object can sit in the middle.' },
      example: { en: 'Messages are tagged by year of study.', zh: '消息按年级打标签。' },
    },
    {
      phrase: 'hold on', sentenceIndex: 33,
      meaning: { zh: '等等，先别急', en: 'a call to pause and reconsider' },
      usage: { zh: '对话中打断并提醒；后常接反驳。', en: 'Used in dialogue to interrupt and warn; often followed by a counterpoint.' },
      example: { en: 'Hold on, that widens the focus again.', zh: '等等，那又把范围扩大了。' },
    },
    {
      phrase: 'shape the results', sentenceIndex: 35,
      meaning: { zh: '决定结果走向', en: 'to influence what the feedback looks like' },
      usage: { zh: 'shape 作动词；who answers it shapes the results。', en: 'Shape is a verb here: who answers it shapes the results.' },
      example: { en: 'The chosen listeners shape the whole outcome.', zh: '受访听众决定整体结果走向。' },
    },
    {
      phrase: 'stories land', sentenceIndex: 43,
      meaning: { zh: '（内容）被听众接受，奏效', en: 'to be understood and received well by listeners' },
      usage: { zh: 'land 在此表示产生反响；the joke lands、the story lands。', en: 'Land means to land with an audience here: the joke lands, the story lands.' },
      example: { en: 'The pilot shows whether the stories land.', zh: '试播集看故事能不能打动听众。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先记提议者', en: 'Match the suggestion to its speaker' },
      body: {
        zh: 'Part 3 配对常考谁提出哪条建议。边听边在人名旁记下关键词：teenage sleep、freely available studies、forty minutes、sleep doctor，别把对方认同的话当成他的提议。',
        en: 'Part 3 matching asks who suggested what. Note the keyword beside each name: teenage sleep, freely available studies, forty minutes, sleep doctor. Do not count agreement as a proposal.',
      },
    },
    {
      title: { zh: '多选盯被否定的干扰项', en: 'Track rejected options in multiple choice' },
      body: {
        zh: '多选三项正确，其余三项通常被明确否定：只问睡不好的人、删异常回复、只采最忙自习室。听到否定语气就在选项旁打叉，最后从剩下的里选三个。',
        en: 'Three options are correct and the rest are usually rejected outright: only poor sleepers, deleting odd replies, the busiest study hall only. Mark rejected ones as you hear them, then choose three from the rest.',
      },
    },
    {
      title: { zh: '学术讨论抓名词术语', en: 'Catch the academic nouns' },
      body: {
        zh: 'episode、outline、pilot、bias、open-access 在题干反复出现。听到它们就预判后面是定义、理由还是操作步骤，单选题答案通常紧跟解释句。',
        en: 'Words like episode, outline, pilot, bias and open-access recur in the stems. When you hear one, predict whether the next sentence defines, justifies or gives a step; the answer usually follows.',
      },
    },
  ],
};
