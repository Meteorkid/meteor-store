import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 18 · Part 3 — AI 伦理研讨会准备（三人讨论）。原创仿真材料，非官方真题。
 *
 * 两名学生 Thomas、Sonia 与导师 Ava 敲定阅读分工、案例挑选、问题审批与时间分配，
 * 再讨论跨行业案例的理由、记录要求、各段时长，以及导师建议的三项准备。
 */
export const test18Part3: ListeningLesson = {
  slug: 'test-18-part-3',
  part: 3,
  status: 'published',
  title: { zh: '准备 AI 伦理研讨会', en: 'Preparing a seminar on AI and ethics' },
  summary: {
    zh: '两名学生与导师核对 AI 伦理研讨会的分工：谁整理阅读清单、谁挑选案例、谁审批讨论问题、谁参与时间分配；随后确定案例为何要覆盖不同行业、记录应写清什么、各段时长比例，以及彩排前要完成的三项准备。',
    en: 'Two students and their tutor agree who owns what in their AI ethics seminar: the reading list, the case studies, the discussion questions and the time allocation. They then settle why cases must cover different sectors, what the notes should record, how long each section runs, and three preparations to finish before rehearsal.',
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
        { key: 'A', text: 'compiles the reading list' },
        { key: 'B', text: 'selects the case studies' },
        { key: 'C', text: 'approves the discussion questions' },
        { key: 'D', text: 'shares the time allocation' },
        { key: 'E', text: 'records each speaker’s main point' },
        { key: 'F', text: 'writes the seminar summary' },
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
          stem: 'Why must the cases cover different sectors?',
          options: [
            { key: 'A', text: 'The ethical issue appears across many fields.' },
            { key: 'B', text: 'Each sector has the same regulations.' },
            { key: 'C', text: 'The group has read about only one industry.' },
          ],
        },
        {
          number: 26,
          stem: 'What does the tutor say the seminar notes must record?',
          options: [
            { key: 'A', text: 'every article the group read' },
            { key: 'B', text: 'who raised each point' },
            { key: 'C', text: 'the final answer to each question' },
          ],
        },
        {
          number: 27,
          stem: 'Which part of the seminar gets the longest time?',
          options: [
            { key: 'A', text: 'the opening' },
            { key: 'B', text: 'the case studies' },
            { key: 'C', text: 'the discussion' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE preparations does the tutor recommend before rehearsal? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE preparations does the tutor recommend?',
      options: [
        { key: 'A', text: 'divide the background reading by topic' },
        { key: 'B', text: 'choose cases that raise no obvious answer' },
        { key: 'C', text: 'write the discussion questions in advance' },
        { key: 'D', text: 'invite an outside expert to the panel' },
        { key: 'E', text: 'run the seminar twice in practice' },
        { key: 'F', text: 'record the main points on a phone' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：I can compile the reading list, since I already have the links from last term。Thomas 整理阅读清单，对应 A。',
        en: 'Sentence 3: "I can compile the reading list, since I already have the links from last term". Thomas compiles the reading list, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：Then I will select the case studies, and match each one to a sector。Sonia 挑选案例，对应 B。',
        en: 'Sentence 4: "Then I will select the case studies, and match each one to a sector". Sonia selects the case studies, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 5,
      explanation: {
        zh: '定位句 5：That leaves the discussion questions to me. I will approve them once the draft is ready。导师审批讨论问题，对应 C。',
        en: 'Sentence 5: "That leaves the discussion questions to me. I will approve them once the draft is ready". The tutor approves the discussion questions, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 7,
      explanation: {
        zh: '定位句 7：The whole group should share the time allocation, so everyone knows how long each section runs。时间分配由全组共同参与，对应 D。',
        en: 'Sentence 7: "The whole group should share the time allocation, so everyone knows how long each section runs". The group shares the time allocation, matching D.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 15,
      explanation: {
        zh: '定位句 15：Because the ethical issue appears across many fields, not just one type of company。伦理问题存在于多个行业；各行业法规相同和只读过一个行业在全段没有依据。',
        en: 'Sentence 15: "Because the ethical issue appears across many fields, not just one type of company". The issue spans many fields; identical regulations and reading about one industry have no basis.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：The notes must record who raised each point, not just a list of topics。记录要写清谁提出了哪一点；读过的文章清单和最终答案都不是记录要求。',
        en: 'Sentence 23: "The notes must record who raised each point, not just a list of topics". The notes record who raised each point; the article list and final answers are not the requirement.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 31,
      explanation: {
        zh: '定位句 31：The discussion section is the longest part of the seminar。讨论段时长最长；开场五分钟、案例各四分钟都是更短的部分。',
        en: 'Sentence 31: "The discussion section is the longest part of the seminar". The discussion is the longest part; the five-minute opening and four-minute cases are shorter.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 35,
      explanation: {
        zh: '定位句 35：First, divide the background reading by topic, so each person owns one theme。第一项准备是按主题分工阅读，对应 A。',
        en: 'Sentence 35: "First, divide the background reading by topic, so each person owns one theme". The first preparation divides reading by topic, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 37,
      explanation: {
        zh: '定位句 37：Second, choose cases that raise no obvious answer, where reasonable people disagree。第二项是挑选没有标准答案的案例，对应 B。',
        en: 'Sentence 37: "Second, choose cases that raise no obvious answer, where reasonable people disagree". The second preparation selects open-ended cases, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 39,
      explanation: {
        zh: '定位句 39：Third, write the discussion questions in advance, rather than making them up on the spot。第三项是提前写好讨论问题，对应 C。外部专家、彩排两次和手机录音均被否定或未被建议。',
        en: 'Sentence 39: "Third, write the discussion questions in advance, rather than making them up on the spot". The third preparation writes questions ahead, matching C. An outside expert, two rehearsals and phone recording are rejected or not advised.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'Thanks for meeting us, Ava. We are putting together the seminar on AI and ethics.' },
    { speaker: 'sonia', text: 'We wanted to settle the division of work before the reading deadline.' },
    { speaker: 'ava', text: 'Good. Let us agree who owns each part first.' },
    { speaker: 'thomas', text: 'I can compile the reading list, since I already have the links from last term.' },
    { speaker: 'sonia', text: 'Then I will select the case studies, and match each one to a sector.' },
    { speaker: 'ava', text: 'That leaves the discussion questions to me. I will approve them once the draft is ready.' },
    { speaker: 'thomas', text: 'What about the timing on the day itself?' },
    { speaker: 'ava', text: 'The whole group should share the time allocation, so everyone knows how long each section runs.' },
    { speaker: 'sonia', text: 'Is that everything for the division of work?' },
    { speaker: 'ava', text: 'It looks like it. Once the roles are clear, the draft should come together quickly.' },
    { speaker: 'sonia', text: 'I was worried the cases would all sound too similar.' },
    { speaker: 'ava', text: 'Spread them across different sectors, rather than keeping to one industry.' },
    { speaker: 'thomas', text: 'Which sectors did you have in mind?' },
    { speaker: 'ava', text: 'Health, transport, and hiring systems are the three we discussed in the lecture.' },
    { speaker: 'sonia', text: 'Why is it important to cover more than one sector?' },
    { speaker: 'ava', text: 'Because the ethical issue appears across many fields, not just one type of company.' },
    { speaker: 'thomas', text: 'One case could look at an algorithm used in hiring decisions.' },
    { speaker: 'sonia', text: 'Another could cover triage tools in a hospital setting.' },
    { speaker: 'ava', text: 'Keep each case short, around four minutes, so the discussion still has room.' },
    { speaker: 'thomas', text: 'I have drafted a few questions for the opening.' },
    { speaker: 'sonia', text: 'Open-ended questions work better than yes or no prompts here.' },
    { speaker: 'ava', text: 'I will read through them and approve the wording before the rehearsal.' },
    { speaker: 'thomas', text: 'What should we do with the notes from our practice talk?' },
    { speaker: 'ava', text: 'The notes must record who raised each point, not just a list of topics.' },
    { speaker: 'sonia', text: 'Who should write those notes on the day?' },
    { speaker: 'ava', text: 'Rotate the note-taker between the three of you, so no one carries it all alone.' },
    { speaker: 'sonia', text: 'Will the notes be shared after the seminar?' },
    { speaker: 'ava', text: 'Yes, put them on the course page once the discussion has ended.' },
    { speaker: 'thomas', text: 'How should we split the time between the sections?' },
    { speaker: 'ava', text: 'The opening takes about five minutes, and it sets the question for the room.' },
    { speaker: 'sonia', text: 'Each case study gets roughly four minutes, with a short transition between them.' },
    { speaker: 'ava', text: 'The discussion section is the longest part of the seminar.' },
    { speaker: 'thomas', text: 'Why does the discussion need the most time?' },
    { speaker: 'ava', text: 'This seminar aims to debate the cases, not to deliver a lecture on ethics.' },
    { speaker: 'sonia', text: 'Before we rehearse, what preparations should we finish?' },
    { speaker: 'ava', text: 'First, divide the background reading by topic, so each person owns one theme.' },
    { speaker: 'thomas', text: 'I can split the articles between privacy, fairness and bias.' },
    { speaker: 'ava', text: 'Second, choose cases that raise no obvious answer, where reasonable people disagree.' },
    { speaker: 'sonia', text: 'A case with a clear answer would make the discussion dull.' },
    { speaker: 'ava', text: 'Third, write the discussion questions in advance, rather than making them up on the spot.' },
    { speaker: 'thomas', text: 'Shall we send those questions to you tonight?' },
    { speaker: 'ava', text: 'Yes, before the rehearsal on Wednesday afternoon.' },
    { speaker: 'sonia', text: 'Should we invite an outside expert to join the panel?' },
    { speaker: 'ava', text: 'There is no outside expert for this term, so keep the panel to the three of you.' },
    { speaker: 'thomas', text: 'Do we need to run the seminar twice in practice?' },
    { speaker: 'ava', text: 'One rehearsal is enough at this stage, unless the timing still slips.' },
    { speaker: 'sonia', text: 'Should one of us record the main points on a phone?' },
    { speaker: 'ava', text: 'The written notes already cover that, so a recording is not required.' },
    { speaker: 'thomas', text: 'Are there any background articles we must read first?' },
    { speaker: 'ava', text: 'Two articles are on the course page, and both are listed under ethics.' },
    { speaker: 'sonia', text: 'Which one should we open with?' },
    { speaker: 'ava', text: 'Start with the ethics framework, because it gives you the language for the cases.' },
    { speaker: 'thomas', text: 'Where do the case studies come from?' },
    { speaker: 'ava', text: 'Each case should cite its source, whether a news report or a published study.' },
    { speaker: 'sonia', text: 'What about the slides?' },
    { speaker: 'ava', text: 'Keep plain headings, and avoid crowding each slide with text.' },
    { speaker: 'thomas', text: 'We can test the colours in the seminar room before the talk.' },
    { speaker: 'sonia', text: 'Should we email the draft to each other tonight?' },
    { speaker: 'thomas', text: 'Yes, so everyone sees the same version before the rehearsal.' },
    { speaker: 'ava', text: 'Come back to me if a case stops making sense once you speak it aloud.' },
    { speaker: 'thomas', text: 'Will do.' },
    { speaker: 'sonia', text: 'Thanks for the feedback today.' },
    { speaker: 'ava', text: 'You are welcome. Focus on the discussion questions first, and the rest will follow.' },
    { speaker: 'thomas', text: 'I will finish the reading list this evening.' },
    { speaker: 'sonia', text: 'I will pick the cases after I read the framework article.' },
    { speaker: 'ava', text: 'Check the timing once more when you rehearse standing up.' },
    { speaker: 'thomas', text: 'We will leave ten minutes at the end for questions from the audience.' },
    { speaker: 'sonia', text: 'That should fit inside the total slot we were given.' },
  ],
  vocabulary: [
    {
      term: 'reading list', phonetic: '/ˈriːdɪŋ lɪst/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '阅读清单', en: 'the list of articles and chapters assigned for a course' },
      usage: { zh: '可数；compile the reading list、on the reading list。', en: 'Countable: compile the reading list, on the reading list.' },
      collocations: ['the reading list', 'compile the reading list', 'split the reading list'],
      example: { en: 'Thomas can compile the reading list from last term’s links.', zh: 'Thomas 可以从上学期的链接整理阅读清单。' },
      listening: { zh: 'reading 与 list 都重读；中间短暂停顿。', en: 'Both parts are stressed with a short pause.' },
    },
    {
      term: 'case studies', phonetic: '/ˈkeɪs ˌstʌdiz/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '案例研究，案例', en: 'real examples used to discuss a topic in a seminar' },
      usage: { zh: '常用复数；select the case studies、a case study。', en: 'Usually plural: select the case studies, a case study.' },
      collocations: ['the case studies', 'select the case studies', 'a real case study'],
      example: { en: 'Sonia will select the case studies for the seminar.', zh: 'Sonia 为研讨会挑选案例。' },
      listening: { zh: 'case 单音节；studies 重音在第一音节 /ˈstʌ/。', en: 'case is one syllable; studies stresses the first.' },
    },
    {
      term: 'sectors', phonetic: '/ˈsektəz/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '行业，领域', en: 'a part of the economy or society such as health or transport' },
      usage: { zh: '可数；different sectors、the health sector。', en: 'Countable: different sectors, the health sector.' },
      collocations: ['different sectors', 'the health sector', 'across sectors'],
      example: { en: 'Spread the cases across different sectors.', zh: '把案例分布到不同行业。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsek/；结尾 /tə/。', en: 'Two syllables with stress on the first; the ending is /tə/.' },
    },
    {
      term: 'notes', phonetic: '/nəʊts/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '记录，笔记', en: 'written records of the points raised in a discussion' },
      usage: { zh: '常用复数；write the notes、keep notes。单数 note。', en: 'Usually plural: write the notes, keep notes. Singular note.' },
      collocations: ['the notes', 'write the notes', 'share the notes'],
      example: { en: 'The notes record who raised each point.', zh: '记录写清谁提出了哪一点。' },
      listening: { zh: '单音节 /nəʊt/，复数结尾 /s/。', en: 'One syllable /nəʊt/ with plural /s/.' },
    },
    {
      term: 'rehearsal', phonetic: '/rɪˈhɜːsl/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '彩排，演练', en: 'a practice run of a talk or seminar before the real event' },
      usage: { zh: '可数；before the rehearsal、one rehearsal。动词 rehearse。', en: 'Countable: before the rehearsal, one rehearsal. The verb is rehearse.' },
      collocations: ['before the rehearsal', 'one rehearsal', 'the practice rehearsal'],
      example: { en: 'The tutor approves the wording before the rehearsal.', zh: '导师在彩排前审批措辞。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈhɜː/；结尾 /sl/。', en: 'Two syllables with stress on the second and a final /sl/.' },
    },
    {
      term: 'bias', phonetic: '/ˈbaɪəs/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '偏见，偏差', en: 'an unfair tendency that favours one group or outcome' },
      usage: { zh: '不可数；fairness and bias、algorithmic bias。', en: 'Uncountable: fairness and bias, algorithmic bias.' },
      collocations: ['fairness and bias', 'algorithmic bias', 'hidden bias'],
      example: { en: 'The articles are split between privacy, fairness and bias.', zh: '文章按隐私、公平和偏差分类。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈbaɪ/；结尾 /əs/。', en: 'Two syllables with stress on the first and a final /əs/.' },
    },
    {
      term: 'cite', phonetic: '/saɪt/', partOfSpeech: 'v.', sentenceIndex: 53,
      meaning: { zh: '标注出处，引用来源', en: 'to identify the source of a case or data in writing' },
      usage: { zh: '及物动词；cite its source、cite a study。名词 citation。', en: 'Transitive: cite its source, cite a study. The noun is citation.' },
      collocations: ['cite its source', 'cite a study', 'cite a news report'],
      example: { en: 'Each case should cite its source clearly.', zh: '每个案例都应标注来源。' },
      listening: { zh: '单音节 /saɪt/，与 site、sight 同音。', en: 'One syllable /saɪt/, homophone of site and sight.' },
    },
  ],
  expressions: [
    {
      phrase: 'owns each part', sentenceIndex: 2,
      meaning: { zh: '各自负责一部分', en: 'to be responsible for one part of a shared task' },
      usage: { zh: 'own 在此为“牵头、负责”；own a section、own the list。', en: 'Here own means take responsibility: own a section, own the list.' },
      example: { en: 'Let us agree who owns each part first.', zh: '我们先说好谁负责哪一部分。' },
    },
    {
      phrase: 'come together', sentenceIndex: 9,
      meaning: { zh: '成型，凑齐', en: 'to develop into a complete piece of work' },
      usage: { zh: '不及物；the draft comes together、the plan comes together。', en: 'Intransitive: the draft comes together, the plan comes together.' },
      example: { en: 'Once the roles are clear, the draft should come together quickly.', zh: '分工明确后，草稿很快就能成型。' },
    },
    {
      phrase: 'open-ended', sentenceIndex: 20,
      meaning: { zh: '开放式的，无固定答案的', en: 'allowing several answers rather than one fixed reply' },
      usage: { zh: '定语；open-ended questions、open-ended cases。对照 yes or no。', en: 'Attributive: open-ended questions, open-ended cases. Compare yes or no.' },
      example: { en: 'Open-ended questions work better than yes or no prompts.', zh: '开放式问题比是非提问更合适。' },
    },
    {
      phrase: 'on the spot', sentenceIndex: 39,
      meaning: { zh: '当场，临时', en: 'without preparation, right at the moment' },
      usage: { zh: '方式状语；make up questions on the spot。', en: 'An adverbial: make up questions on the spot.' },
      example: { en: 'Write the questions in advance, not on the spot.', zh: '问题要提前写，不要临时想。' },
    },
    {
      phrase: 'come back to me', sentenceIndex: 59,
      meaning: { zh: '再回来找我', en: 'to return for help after trying something yourself' },
      usage: { zh: '辅导场景用语；come back to me if a case fails to make sense。', en: 'A tutoring phrase: come back to me if a case fails to make sense.' },
      example: { en: 'Come back to me if a case stops making sense.', zh: '案例讲不通时再回来找我。' },
    },
    {
      phrase: 'crowding each slide', sentenceIndex: 55,
      meaning: { zh: '把幻灯片塞得太满', en: 'filling a slide with too much text or detail' },
      usage: { zh: 'crowd 此处指“挤满”；avoid crowding the slide。', en: 'Here crowd means fill densely: avoid crowding the slide.' },
      example: { en: 'Avoid crowding each slide with text.', zh: '别把每张幻灯片堆满文字。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先抓分工句', en: 'For matching, catch the role first' },
      body: {
        zh: '第 21–24 题把任务和人配对。讨论开场先报分工，人名后紧跟动词短语（compile the list、select cases、approve questions、share timing）；听到人名立刻在题号旁标记，再把短语对上选项字母。',
        en: 'Items 21 to 24 pair people with tasks. The division opens the discussion, and each name is followed by a verb phrase such as compile the list, select cases, approve questions and share timing. Mark the number when you hear the name, then match the phrase to a letter.',
      },
    },
    {
      title: { zh: '多选题排除被否定项', en: 'For multi-select, drop the rejected options' },
      body: {
        zh: '第 28–30 题选三项彩排准备。导师按 first、second、third 给建议，同时否定外部专家、两次彩排和手机录音；被否定或未被提及的选项先划掉，剩下三项即答案。',
        en: 'Items 28 to 30 ask for three preparations. The tutor lists first, second and third, and rejects an outside expert, two rehearsals and phone recording. Cross out rejected or unmentioned options first; the remaining three are the answers.',
      },
    },
    {
      title: { zh: '时长题听最高级', en: 'For timing items, listen for the superlative' },
      body: {
        zh: '第 27 题问哪一段最长，答案在 longest 之后；开场五分钟、案例各四分钟是相邻短时长。时间类题目留意 longest、shortest、about five minutes 这类比较与数量信号。',
        en: 'Item 27 asks which section is longest, and the answer follows longest; the five-minute opening and four-minute cases are neighbouring shorter blocks. Watch comparison and quantity signals such as longest, shortest and about five minutes.',
      },
    },
  ],
};
