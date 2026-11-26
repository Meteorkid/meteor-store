import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 33 · Part 3 — 音乐练习研究设计（三人讨论，英式口音为主，导师美式）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：任务分工配对 → 样本分层与原因 → 练习日志记录项 → 伦理与退出条件 →
 * 三项测量指标 → 激励与时间表 → 风险与备份。
 */
export const test33Part3: ListeningLesson = {
  slug: 'test-33-part-3',
  part: 3,
  status: 'published',
  title: { zh: '音乐练习研究设计', en: 'Planning a study on music practice' },
  summary: {
    zh: '两名学生与导师设计一项音乐练习研究：分工招募本地学校参与者、设计练习日志、审批伦理同意书、共同确定测量方案；样本须包含初学者与有基础的学员以对比不同水平的练习效果，日志每天记录练习时长与休息，参与者可随时退出并删除数据。研究采用自评专注度、标准曲目限时演奏、教师周进度评分三项指标，随后讨论激励方式、八周时间表、样本风险与备份人选。',
    en: 'Two students and a tutor design a music practice study: recruit players, design the diary, approve consent and share the plan. The sample mixes beginners and advanced players, the diary records daily minutes and breaks, and participants may withdraw at any time. The study uses self-rated focus, a timed performance and a teacher rating, then covers incentives, risks and a reserve player.',
  },
  accent: { zh: '两名学生为英式口音，导师为美式口音。', en: 'The two students have British accents; the tutor has an American accent.' },
  cast: [
    { id: 'thomas', label: 'THOMAS', gender: 'male', voice: 'en-GB-ThomasNeural' },
    { id: 'sonia', label: 'SONIA', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'ava', label: 'AVA', gender: 'female', voice: 'en-US-AvaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which task matches each person? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'recruits participants from local schools' },
        { key: 'B', text: 'designs the practice diary' },
        { key: 'C', text: 'approves the ethics consent form' },
        { key: 'D', text: 'shares the measurement plan' },
        { key: 'E', text: 'contacts music teachers' },
        { key: 'F', text: 'writes the final report' },
      ],
      items: [
        { number: 21, text: 'Thomas' },
        { number: 22, text: 'Sonia' },
        { number: 23, text: 'the tutor' },
        { number: 24, text: 'the whole group' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Why must the sample include beginners and advanced players?',
          options: [
            { key: 'A', text: 'to compare practice effects across levels' },
            { key: 'B', text: 'to keep the recording sessions shorter' },
            { key: 'C', text: 'to satisfy the school music departments' },
          ],
        },
        {
          number: 26,
          stem: 'What should the diary record each day?',
          options: [
            { key: 'A', text: 'the player’s mood before the lesson' },
            { key: 'B', text: 'minutes of practice and any breaks' },
            { key: 'C', text: 'the cost of sheet music used' },
          ],
        },
        {
          number: 27,
          stem: 'What ethical condition applies to participants?',
          options: [
            { key: 'A', text: 'they must finish all eight weeks' },
            { key: 'B', text: 'their data stays in the school library' },
            { key: 'C', text: 'they can withdraw at any time' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE measures does the study use? Choose THREE letters, A–E.',
      select: 3,
      stem: 'Which THREE measures does the study use?',
      options: [
        { key: 'A', text: 'self-rated focus during practice' },
        { key: 'B', text: 'timed performance on a standard piece' },
        { key: 'C', text: 'teacher rating of weekly progress' },
        { key: 'D', text: 'daily medical test of the player' },
        { key: 'E', text: 'public recording of every practice session' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 5,
      explanation: {
        zh: '定位句 5：I can recruit participants from local schools, since I already know the music departments there。Thomas 负责招募参与者，对应 A。',
        en: 'Sentence 5: "I can recruit participants from local schools, since I already know the music departments there". Thomas recruits participants, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：Then I will design the practice diary that each player fills in every evening。Sonia 设计练习日志，对应 B。',
        en: 'Sentence 6: "Then I will design the practice diary that each player fills in every evening". Sonia designs the diary, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 7,
      explanation: {
        zh: '定位句 7：That leaves the ethics side to me. I will approve the consent form once the draft is ready。导师审批伦理同意书，对应 C。',
        en: 'Sentence 7: "That leaves the ethics side to me. I will approve the consent form once the draft is ready". The tutor approves the consent form, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 8,
      explanation: {
        zh: '定位句 8：the whole group should share the measurement plan, so everyone knows what each score means。测量方案由全组共同参与，对应 D。',
        en: 'Sentence 8: "the whole group should share the measurement plan, so everyone knows what each score means". The group shares the measurement plan, matching D.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 12,
      explanation: {
        zh: '定位句 12：Because we want to compare practice effects across levels, not just within one class。样本分层是为对比不同水平的练习效果，对应 A。缩短录音与满足学校部门在录音中无依据。',
        en: 'Sentence 12: "Because we want to compare practice effects across levels, not just within one class". The mixed sample compares effects across levels, matching A. Shorter recordings and pleasing departments have no basis.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：The diary should record minutes of practice and any breaks taken during the session。日志记录练习时长与休息，对应 B。课前情绪与乐谱花费在全段未提及。',
        en: 'Sentence 17: "The diary should record minutes of practice and any breaks taken during the session". The diary records minutes and breaks, matching B. Pre-lesson mood and sheet-music cost are not mentioned.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：They can withdraw at any time, without giving a reason, and their data is removed。参与者可随时退出，对应 C。必须坚持八周与数据留在学校图书馆被规则否定。',
        en: 'Sentence 25: "They can withdraw at any time, without giving a reason, and their data is removed". Participants may withdraw anytime, matching C. Staying eight weeks and keeping data in the library are ruled out.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：a self-rated focus, where the player marks how concentrated they were after each practice。第一项指标是自评专注度，对应 A。',
        en: 'Sentence 30: "a self-rated focus, where the player marks how concentrated they were after each practice". The first measure is self-rated focus, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：a timed performance on a standard piece, repeated at set dates。第二项是标准曲目限时演奏，对应 B。',
        en: 'Sentence 31: "a timed performance on a standard piece, repeated at set dates". The second measure is a timed performance, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 32,
      explanation: {
        zh: '定位句 32：a teacher rating of weekly progress, based on the same checklist for every student。第三项是教师周进度评分，对应 C。',
        en: 'Sentence 32: "a teacher rating of weekly progress, based on the same checklist for every student". The third measure is the teacher weekly rating, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'Thanks for making time. We should settle the design of the music practice study today.' },
    { speaker: 'ava', text: 'Good. Before choosing measures, let us agree who owns each task.' },
    { speaker: 'sonia', text: 'The research question is whether regular short practice works better than long occasional sessions.' },
    { speaker: 'thomas', text: 'To answer it, we need players at different levels, not one group only.' },
    { speaker: 'ava', text: 'Right. A mixed sample keeps the findings useful for ordinary learners.' },
    { speaker: 'thomas', text: 'I can recruit participants from local schools, since I already know the music departments there.' },
    { speaker: 'sonia', text: 'Then I will design the practice diary that each player fills in every evening.' },
    { speaker: 'ava', text: 'That leaves the ethics side to me. I will approve the consent form once the draft is ready.' },
    { speaker: 'thomas', text: 'And the whole group should share the measurement plan, so everyone knows what each score means.' },
    { speaker: 'sonia', text: 'Shall we start with who takes part?' },
    { speaker: 'thomas', text: 'We are thinking of sixteen players, split between beginners and those with several years of lessons.' },
    { speaker: 'ava', text: 'Why must the sample include both beginners and advanced players?' },
    { speaker: 'thomas', text: 'Because we want to compare practice effects across levels, not just within one class.' },
    { speaker: 'sonia', text: 'A beginner may need more breaks, while an advanced player keeps focus for longer.' },
    { speaker: 'ava', text: 'Keep the group small enough that each diary can be checked carefully.' },
    { speaker: 'thomas', text: 'The schools can provide rooms where players practise without distraction.' },
    { speaker: 'sonia', text: 'What exactly goes into the diary each day?' },
    { speaker: 'thomas', text: 'The diary should record minutes of practice and any breaks taken during the session.' },
    { speaker: 'sonia', text: 'We should avoid asking players to write long paragraphs after every session.' },
    { speaker: 'ava', text: 'A short tick list keeps the record honest and easy to compare across weeks.' },
    { speaker: 'thomas', text: 'Each entry also notes the piece worked on and the time of day.' },
    { speaker: 'sonia', text: 'That helps us spot whether morning or evening practice changes the score.' },
    { speaker: 'ava', text: 'Now the ethics side matters before any diary goes out.' },
    { speaker: 'thomas', text: 'Every participant signs a consent form that explains what we record and how it is stored.' },
    { speaker: 'sonia', text: 'What about players who decide they do not want to continue?' },
    { speaker: 'ava', text: 'They can withdraw at any time, without giving a reason, and their data is removed.' },
    { speaker: 'thomas', text: 'Parents also receive a copy of the information sheet before the first session.' },
    { speaker: 'sonia', text: 'The recordings are used only for this study, not posted publicly.' },
    { speaker: 'ava', text: 'Privacy should be stated clearly on the form, so families know what they agree to.' },
    { speaker: 'thomas', text: 'Now the measures we will rely on in the study.' },
    { speaker: 'sonia', text: 'First, a self-rated focus, where the player marks how concentrated they were after each practice.' },
    { speaker: 'thomas', text: 'Second, a timed performance on a standard piece, repeated at set dates.' },
    { speaker: 'ava', text: 'Third, a teacher rating of weekly progress, based on the same checklist for every student.' },
    { speaker: 'thomas', text: 'These three together should show whether practice habits change the result.' },
    { speaker: 'sonia', text: 'We should not overburden anyone with extra tests outside their lesson.' },
    { speaker: 'thomas', text: 'How do we keep participants motivated through the term?' },
    { speaker: 'sonia', text: 'A small incentive at the end might help, but it must not pressure anyone to stay.' },
    { speaker: 'ava', text: 'We can offer a summary of the findings to each player once the study closes.' },
    { speaker: 'thomas', text: 'Free sheet music would be a thank-you, but money is not needed for this group.' },
    { speaker: 'sonia', text: 'The diary itself gives a daily record, which some learners find encouraging.' },
    { speaker: 'ava', text: 'Let us review the timetable before we draft the materials.' },
    { speaker: 'thomas', text: 'Recruitment runs through the first two weeks, then practice begins.' },
    { speaker: 'sonia', text: 'The diary covers eight weeks, with one check-in each week.' },
    { speaker: 'ava', text: 'The teacher ratings are collected at weeks two, five and eight.' },
    { speaker: 'thomas', text: 'After the final performance, the analysis takes about a week.' },
    { speaker: 'sonia', text: 'We should leave time for missing entries to be followed up by email.' },
    { speaker: 'ava', text: 'If a diary is incomplete, do not fill it in from memory; note the gap instead.' },
    { speaker: 'thomas', text: 'Any other risks we have missed?' },
    { speaker: 'sonia', text: 'Players might overestimate their own focus, so the teacher rating balances the diary.' },
    { speaker: 'ava', text: 'That is why we use several measures rather than one self-report only.' },
    { speaker: 'thomas', text: 'Shall we divide the background reading by theme before the next meeting?' },
    { speaker: 'sonia', text: 'I will look at studies on deliberate practice, and you can take motivation research.' },
    { speaker: 'ava', text: 'Bring one short example that raised a question about our own design.' },
    { speaker: 'thomas', text: 'How many items should the final report contain?' },
    { speaker: 'sonia', text: 'One opening section, the sample, the measures, and the results tables.' },
    { speaker: 'ava', text: 'Keep the report short enough that other students can read it in an evening.' },
    { speaker: 'thomas', text: 'Who contacts the music teachers once the sample is set?' },
    { speaker: 'sonia', text: 'I can email them, since I have taught in two of the schools already.' },
    { speaker: 'ava', text: 'Ask each teacher to use the same checklist for ratings.' },
    { speaker: 'thomas', text: 'We should also agree a backup plan if a participant drops out early.' },
    { speaker: 'sonia', text: 'One reserve player per level keeps the groups balanced.' },
    { speaker: 'ava', text: 'Do not add a reserve without checking the sample size first.' },
    { speaker: 'thomas', text: 'I think the design covers the main points.' },
    { speaker: 'sonia', text: 'Next week we bring the diary draft and the consent form outline.' },
    { speaker: 'ava', text: 'Good. I will circulate the meeting notes after we finish here.' },
    { speaker: 'thomas', text: 'Thanks both. That gives us clear tasks before Friday.' },
  ],
  vocabulary: [
    {
      term: 'diary', phonetic: '/ˈdaɪəri/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '练习日志，记录簿', en: 'the daily record each player fills in about practice' },
      usage: { zh: '可数；practice diary、fill in the diary。复数 diaries。', en: 'Countable: practice diary, fill in the diary. Plural diaries.' },
      collocations: ['the practice diary', 'fill in the diary', 'the diary records'],
      example: { en: 'The diary records minutes of practice each day.', zh: '日志每天记录练习时长。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈdaɪ/；勿读 /ˈdɪəri/。', en: 'Three syllables with first-syllable stress; do not say /ˈdɪəri/.' },
    },
    {
      term: 'consent', phonetic: '/kənˈsent/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '同意，知情同意', en: 'the formal agreement to take part in the study' },
      usage: { zh: '不可数；consent form、sign consent。动词 consent。', en: 'Uncountable: consent form, sign consent. The verb is consent.' },
      collocations: ['the consent form', 'sign consent', 'ethics consent'],
      example: { en: 'The tutor approves the ethics consent form.', zh: '导师审批伦理同意书。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈsent/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'withdraw', phonetic: '/wɪðˈdrɔː/', partOfSpeech: 'v.', sentenceIndex: 25,
      meaning: { zh: '退出（研究）', en: 'to stop taking part and leave the study' },
      usage: { zh: '不及物；withdraw at any time、withdraw from the study。名词 withdrawal。', en: 'Intransitive: withdraw at any time, withdraw from the study. The noun is withdrawal.' },
      collocations: ['withdraw at any time', 'withdraw from the study', 'right to withdraw'],
      example: { en: 'Participants can withdraw at any time, with no reason given.', zh: '参与者可随时退出，无需说明理由。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈdrɔː/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'measures', phonetic: '/ˈmeʒəz/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '测量指标', en: 'a way of recording a result in the study' },
      usage: { zh: '可数复数；the measures we use、each measure。动词 measure。', en: 'Countable plural: the measures we use, each measure. The verb is measure.' },
      collocations: ['the measures', 'the measurement plan', 'use a measure'],
      example: { en: 'These are the measures the study will rely on.', zh: '这些是研究将采用的指标。' },
      listening: { zh: '两个音节，重音在第一音节；复数结尾 /z/。', en: 'Two syllables with first-syllable stress; plural ending /z/.' },
    },
    {
      term: 'rating', phonetic: '/ˈreɪtɪŋ/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '评分，等级评定', en: 'the score a teacher gives for progress' },
      usage: { zh: '可数；teacher rating、weekly rating。动词 rate。', en: 'Countable: teacher rating, weekly rating. The verb is rate.' },
      collocations: ['a teacher rating', 'weekly progress rating', 'the rating checklist'],
      example: { en: 'The teacher gives a rating of weekly progress.', zh: '教师给出周进度评分。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈreɪ/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'incentive', phonetic: '/ɪnˈsentɪv/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '激励，奖励', en: 'something offered to encourage continued participation' },
      usage: { zh: '可数；a small incentive、offer an incentive。', en: 'Countable: a small incentive, offer an incentive.' },
      collocations: ['a small incentive', 'an incentive to stay', 'offer an incentive'],
      example: { en: 'A small incentive might help, but it must not pressure anyone.', zh: '小激励或许有用，但不能施压。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsen/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '样本（参与者群体）', en: 'the group of people taking part in the study' },
      usage: { zh: '可数；the study sample、sample size。', en: 'Countable: the study sample, sample size.' },
      collocations: ['the sample', 'the sample size', 'a mixed sample'],
      example: { en: 'The sample mixes beginners and advanced players.', zh: '样本混合了初学者与有基础的学员。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɑː/；结尾 /pl/。', en: 'Two syllables with first-syllable stress; ending /pl/.' },
    },
  ],
  expressions: [
    {
      phrase: 'split between', sentenceIndex: 10,
      meaning: { zh: '在……之间分组', en: 'divided into two or more groups' },
      usage: { zh: 'be split between 加群体；split between beginners and advanced。', en: 'Be split between groups: split between beginners and advanced.' },
      example: { en: 'Sixteen players are split between two levels.', zh: '十六名学员按两个水平分组。' },
    },
    {
      phrase: 'tick list', sentenceIndex: 19,
      meaning: { zh: '勾选清单', en: 'a short checklist marked with ticks' },
      usage: { zh: '可数；a short tick list、on the tick list。', en: 'Countable: a short tick list, on the tick list.' },
      example: { en: 'A short tick list keeps the record honest.', zh: '简短勾选清单让记录可信。' },
    },
    {
      phrase: 'drops out', sentenceIndex: 59,
      meaning: { zh: '中途退出', en: 'to leave the study before it finishes' },
      usage: { zh: '短语动词；a participant drops out、drop out early。', en: 'Phrasal verb: a participant drops out, drop out early.' },
      example: { en: 'A backup plan covers anyone who drops out early.', zh: '备份方案应对中途退出的人。' },
    },
    {
      phrase: 'followed up', sentenceIndex: 45,
      meaning: { zh: '跟进（缺失记录）', en: 'to chase a missing entry or missing reply' },
      usage: { zh: 'follow up 加对象；follow up missing entries。名词 follow-up。', en: 'Follow up plus object: follow up missing entries. The noun is follow-up.' },
      example: { en: 'Missing entries are followed up by email.', zh: '缺失记录通过邮件跟进。' },
    },
    {
      phrase: 'keeps the groups balanced', sentenceIndex: 60,
      meaning: { zh: '保持各组人数均衡', en: 'keeps each level with a similar number of players' },
      usage: { zh: '保持均衡；一名备份让各组人数保持均衡。', en: 'Keep balanced: a reserve keeps the groups balanced.' },
      example: { en: 'One reserve player per level keeps the groups balanced.', zh: '每个水平留一名备份保持均衡。' },
    },
    {
      phrase: 'circulate the meeting notes', sentenceIndex: 64,
      meaning: { zh: '把纪要发给大家', en: 'to send meeting notes to every member' },
      usage: { zh: 'circulate 加材料；circulate the notes、circulate the draft。', en: 'Circulate plus material: circulate the notes, circulate the draft.' },
      example: { en: 'The tutor will circulate the meeting notes.', zh: '导师会把会议纪要发给大家。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先认人称再认任务', en: 'Match people before tasks' },
      body: {
        zh: '第 21–24 题把任务分给 Thomas、Sonia、导师和全组。分工段每句先说 I can、I will、That leaves 给我，再说动作；先把说话人对到名字，再把 recruit、design、approve、share 对上选项字母。',
        en: 'Items 21 to 24 split tasks among Thomas, Sonia, the tutor and the group. The division states I can, I will, or That leaves to me first, then the action. Match speaker to name first, then recruit, design, approve and share to a letter.',
      },
    },
    {
      title: { zh: '多选题只记明确采用的指标', en: 'Multiple choice records adopted measures only' },
      body: {
        zh: '第 28–30 题选研究采用的三项指标。讨论中被否定或未提的做法（每日体检、公开录像）是干扰项；听到 self-rated focus、timed performance、teacher rating 再勾选，听到 public、test 这类词就排除。',
        en: 'Items 28 to 30 pick the three adopted measures. Rejected or unmentioned ideas, daily tests and public recordings, are distractors. Tick self-rated focus, timed performance and teacher rating; cross out anything with public or test.',
      },
    },
    {
      title: { zh: '伦理题抓权利句', en: 'For ethics, catch the rights clause' },
      body: {
        zh: '第 27 题问参与者的伦理条件，答案在 can withdraw at any time 附近。研究讨论的单选项常是规则句的后半段；听到 consent、privacy、withdraw、data removed 时记录对应的权利与处理方式。',
        en: 'Item 27 asks the ethical condition, answered near can withdraw at any time. Discussion singles often use the second half of a rule sentence; note the right and the data handling on consent, privacy, withdraw or data removed.',
      },
    },
  ],
};
