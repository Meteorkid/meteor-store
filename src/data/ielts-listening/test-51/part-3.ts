import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 51 · Part 3 — 肠道菌群海报准备（两人学术讨论，新西兰口音为主，一名爱尔兰口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：信息层级 → 图示选择 → 术语通俗化 → 面板排版
 * → 海报目标与早期草稿问题 → 图示形式 → 引用核对、句子拆分、版面层级（多选 28–30）。
 * 配对题考“谁提出了哪条方案”。
 */
export const test51Part3: ListeningLesson = {
  slug: 'test-51-part-3',
  part: 3,
  status: 'published',
  title: { zh: '肠道菌群海报准备', en: 'Preparing a poster on gut bacteria' },
  summary: {
    zh: '两名学生准备肠道菌群海报：主问题置于版面顶部，用简单图示代替复杂图表，专业术语改写成日常说法，面板按从左到右的阅读顺序排列。海报面向非专业读者；早期草稿术语过难；菌群平衡用比例图示呈现。措施包括核对引用与来源清单、长句拆短、最详细部分放在视线高度。',
    en: 'Two students plan a gut-bacteria poster: the main question goes at the top, simple drawings replace graphs, terms are rewritten plainly, and panels follow a left-to-right order. It targets non-specialists; early drafts used terms too hard; a scale diagram shows the bacterial balance. Measures include matching citations to sources, splitting long sentences, keeping detail at eye level.',
  },
  accent: { zh: 'Mitchell 为新西兰口音，Emily 为爱尔兰口音。', en: 'Mitchell has a New Zealand accent; Emily has an Irish accent.' },
  speechRate: '+2%',
  cast: [
    { id: 'mitchell', label: 'MITCHELL', gender: 'male', voice: 'en-NZ-MitchellNeural' },
    { id: 'emily', label: 'EMILY', gender: 'female', voice: 'en-IE-EmilyNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which proposal does each person put forward? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'put the main question at the top of the poster' },
        { key: 'B', text: 'use simple drawings instead of complicated graphs' },
        { key: 'C', text: 'rewrite technical terms in everyday language' },
        { key: 'D', text: 'include references in a small bottom corner' },
        { key: 'E', text: 'arrange the panels in a clear reading order' },
        { key: 'F', text: 'collect source articles before the layout begins' },
      ],
      items: [
        { number: 21, text: 'Mitchell' },
        { number: 22, text: 'Emily' },
        { number: 23, text: 'Mitchell' },
        { number: 24, text: 'Emily' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What is the poster’s main aim?',
          options: [
            { key: 'A', text: 'To explain a medical process to non-specialists' },
            { key: 'B', text: 'To advertise the college research centre' },
            { key: 'C', text: 'To compare two strains of bacteria' },
          ],
        },
        {
          number: 26,
          stem: 'What problem did the group find with early drafts?',
          options: [
            { key: 'A', text: 'There were too many colours on the board' },
            { key: 'B', text: 'The terms were too hard for readers' },
            { key: 'C', text: 'The references were missing entirely' },
          ],
        },
        {
          number: 27,
          stem: 'What material will illustrate the balance of bacteria?',
          options: [
            { key: 'A', text: 'A scale diagram' },
            { key: 'B', text: 'A photograph of the laboratory' },
            { key: 'C', text: 'A bar chart of survey results' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE measures will the group take? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE measures will the group take in preparing the poster?',
      options: [
        { key: 'A', text: 'Keep the most detailed section near the eye level' },
        { key: 'B', text: 'Check that the citations match the source list' },
        { key: 'C', text: 'Split long sentences into short ones' },
        { key: 'D', text: 'Print the poster in landscape format' },
        { key: 'E', text: 'Remove all labels from the drawings' },
        { key: 'F', text: 'Add a quote from each scientist' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Mitchell 说 I think we should put the main question at the top of the poster, in the largest lettering。他主张把主问题放在顶部，对应 A。句 3 的细节不要压过主问题是铺垫，不是方案。',
        en: 'Sentence 4: Mitchell says he would "put the main question at the top of the poster, in the largest lettering", matching A. Sentence 3 about details not burying the question is background, not a proposal.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 7,
      explanation: {
        zh: '定位句 7：Emily 说 I suggest we use simple drawings instead of complicated graphs, so the idea comes across quickly。她提议用简单图示代替复杂图表，对应 B。句 8 的肠道小图是 Mitchell 的补充。',
        en: 'Sentence 7: Emily suggests they "use simple drawings instead of complicated graphs, so the idea comes across quickly", matching B. The small gut diagram in sentence 8 is Mitchell’s addition.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 10,
      explanation: {
        zh: '定位句 10：Mitchell 说 We should rewrite technical terms in everyday language, and keep the long names only in a small note。他提出把术语改写成日常说法，对应 C。',
        en: 'Sentence 10: Mitchell says they should "rewrite technical terms in everyday language, and keep the long names only in a small note", matching C.',
      },
    },
    {
      number: 24, accepted: ['E'], evidence: 13,
      explanation: {
        zh: '定位句 13：Emily 说 I will arrange the panels in a clear reading order, left to right, so nobody skips a step。她提出面板按清晰阅读顺序排列，对应 E。句 15 的引用角落是另一项安排，不归她这条方案。',
        en: 'Sentence 13: Emily says she will "arrange the panels in a clear reading order, left to right, so nobody skips a step", matching E. The reference corner in sentence 15 is a separate arrangement, not her proposal here.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：It should explain a medical process to non-specialists, not sell the research centre or pick one strain。海报目标是向非专业读者解释医学过程，对应 A。宣传研究中心与比较菌株都被排除。',
        en: 'Sentence 19: it should "explain a medical process to non-specialists, not sell the research centre or pick one strain", matching A. Advertising the centre and comparing strains are ruled out.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：Looking at our early drafts, the terms were too hard for readers who have not studied biology。早期草稿术语过难，对应 B。配色杂乱是另一个易改问题，引用并非缺失。',
        en: 'Sentence 21: "Looking at our early drafts, the terms were too hard for readers who have not studied biology", matching B. The clashing colours are a separate easy fix, and the references were not missing.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：A scale diagram can show which groups are larger, without needing exact numbers。菌群平衡用比例图示呈现，对应 A。实验室照片太暗，柱状图会占满整板。',
        en: 'Sentence 25: "A scale diagram can show which groups are larger, without needing exact numbers", matching A. The lab photo would be too dark, and a bar chart would fill the whole panel.',
      },
    },
    {
      number: 28, accepted: ['B'], evidence: 39,
      explanation: {
        zh: '定位句 39：We must check that the citations match the source list at the bottom, so no study is cited twice or missed。核对引用与来源清单一致是第一项措施，对应 B。',
        en: 'Sentence 39: "We must check that the citations match the source list at the bottom, so no study is cited twice or missed", matching B.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 41,
      explanation: {
        zh: '定位句 41：I will split long sentences into short ones, so the reading pace stays easy。把长句拆短是第二项措施，对应 C。句 42 说明长从句会让海报像论文。',
        en: 'Sentence 41: "I will split long sentences into short ones, so the reading pace stays easy", matching C. Sentence 42 notes long clauses make a poster feel like an essay.',
      },
    },
    {
      number: 30, accepted: ['A'], evidence: 43,
      explanation: {
        zh: '定位句 43：The most detailed section should stay near the eye level, where people stop to read。最详细部分放在视线高度是第三项措施，对应 A。横版排版、去掉图示标签、加入科学家引言均为干扰项。',
        en: 'Sentence 43: "The most detailed section should stay near the eye level, where people stop to read", matching A. Landscape format, removing drawing labels and adding scientist quotes are distractors.',
      },
    },
  ],
  transcript: [
    { speaker: 'mitchell', text: 'Emily, the poster on gut bacteria is due next Friday, so let us settle how we will organise the information.' },
    { speaker: 'emily', text: 'Good, I have the notes from last week’s lecture, and the board wants a poster that visitors can follow in five minutes.' },
    { speaker: 'mitchell', text: 'Right, what should stand out first when someone steps up?' },
    { speaker: 'emily', text: 'We do not want the details to bury the main question.' },
    { speaker: 'mitchell', text: 'I think we should put the main question at the top of the poster, in the largest lettering.' },
    { speaker: 'emily', text: 'That works. What about the images?' },
    { speaker: 'mitchell', text: 'The data sets are dense, and a full chart would be hard to read from a distance.' },
    { speaker: 'emily', text: 'I suggest we use simple drawings instead of complicated graphs, so the idea comes across quickly.' },
    { speaker: 'mitchell', text: 'Yes, a small diagram of the gut is clearer than a spreadsheet.' },
    { speaker: 'emily', text: 'What about the words themselves? The lecture was full of medical terms.' },
    { speaker: 'mitchell', text: 'We should rewrite technical terms in everyday language, and keep the long names only in a small note.' },
    { speaker: 'emily', text: 'Readers do not need the exact Latin names to follow the process.' },
    { speaker: 'mitchell', text: 'How should the panels flow around the board?' },
    { speaker: 'emily', text: 'I will arrange the panels in a clear reading order, left to right, so nobody skips a step.' },
    { speaker: 'mitchell', text: 'Where do the references go?' },
    { speaker: 'emily', text: 'They can sit in a small bottom corner, in a smaller font, so they do not distract from the message.' },
    { speaker: 'mitchell', text: 'Have we collected the source articles yet?' },
    { speaker: 'emily', text: 'Not all of them; I will pull the key studies before we start the layout.' },
    { speaker: 'mitchell', text: 'What is the poster trying to achieve overall?' },
    { speaker: 'emily', text: 'It should explain a medical process to non-specialists, not sell the research centre or pick one strain.' },
    { speaker: 'mitchell', text: 'Right, visitors are secondary-school students and local families.' },
    { speaker: 'emily', text: 'Looking at our early drafts, the terms were too hard for readers who have not studied biology.' },
    { speaker: 'mitchell', text: 'The first version also had five colours that clashed, but that is easy to fix.' },
    { speaker: 'emily', text: 'The references were not missing, just small and easy to overlook.' },
    { speaker: 'mitchell', text: 'Which visual best shows the balance of different bacteria?' },
    { speaker: 'emily', text: 'A scale diagram can show which groups are larger, without needing exact numbers.' },
    { speaker: 'mitchell', text: 'A lab photograph would be too dark, and a bar chart would take up the whole panel.' },
    { speaker: 'emily', text: 'We should draft the captions once the diagrams are in place.' },
    { speaker: 'mitchell', text: 'How much text fits on one panel?' },
    { speaker: 'emily', text: 'Around eighty words, so every sentence has to earn its place.' },
    { speaker: 'mitchell', text: 'Should we add statistics from the survey?' },
    { speaker: 'emily', text: 'Only the figure that supports the main point, and we label its source beside it.' },
    { speaker: 'mitchell', text: 'What tone should the writing take?' },
    { speaker: 'emily', text: 'Warm and plain, like a good guidebook, not a medical report.' },
    { speaker: 'mitchell', text: 'Let us check the board dimensions before printing.' },
    { speaker: 'emily', text: 'The display stands are portrait, so the tallest panel goes at eye level.' },
    { speaker: 'mitchell', text: 'Eye level matters, because visitors glance at the middle of the board first.' },
    { speaker: 'emily', text: 'We can test the layout on a blank board this afternoon.' },
    { speaker: 'mitchell', text: 'Good, what references must we keep?' },
    { speaker: 'emily', text: 'We must check that the citations match the source list at the bottom, so no study is cited twice or missed.' },
    { speaker: 'mitchell', text: 'Each claim should trace back to one of the collected articles.' },
    { speaker: 'emily', text: 'I will split long sentences into short ones, so the reading pace stays easy.' },
    { speaker: 'mitchell', text: 'Long clauses make a poster feel like an essay.' },
    { speaker: 'emily', text: 'The most detailed section should stay near the eye level, where people stop to read.' },
    { speaker: 'mitchell', text: 'The introduction can sit higher, and the conclusion lower down.' },
    { speaker: 'emily', text: 'Do we need labels on the drawings?' },
    { speaker: 'mitchell', text: 'Short labels help visitors find each part; blank drawings would confuse them.' },
    { speaker: 'emily', text: 'What about the title?' },
    { speaker: 'mitchell', text: 'It should name the topic in five words, with a smaller subtitle underneath.' },
    { speaker: 'emily', text: 'We should agree the colour scheme before the first print.' },
    { speaker: 'mitchell', text: 'Two muted colours plus one dark accent is enough for the whole board.' },
    { speaker: 'emily', text: 'Font size matters too; the body must be readable from two metres.' },
    { speaker: 'mitchell', text: 'We will use one plain typeface across the panels, not several styles.' },
    { speaker: 'emily', text: 'Where can visitors ask follow-up questions?' },
    { speaker: 'mitchell', text: 'A small contact box at the side gives an email for enquiries.' },
    { speaker: 'emily', text: 'Should the poster mention ongoing research?' },
    { speaker: 'mitchell', text: 'Only one short line, so the focus stays on the process we explain.' },
    { speaker: 'emily', text: 'The handout can carry the extra detail that does not fit on the board.' },
    { speaker: 'mitchell', text: 'We should keep a digital copy for the college website.' },
    { speaker: 'emily', text: 'Let us divide the work before Friday’s deadline.' },
    { speaker: 'mitchell', text: 'I will redraw the diagrams, and you can tighten the wording.' },
    { speaker: 'emily', text: 'Deal. I will bring the source list to the session on Thursday.' },
    { speaker: 'mitchell', text: 'Anything we have forgotten?' },
    { speaker: 'emily', text: 'We need to confirm the board number at the entrance hall.' },
    { speaker: 'mitchell', text: 'I will email the exhibition organiser this evening.' },
    { speaker: 'emily', text: 'Then the plan is settled; I will see you after the lunch break.' },
    { speaker: 'mitchell', text: 'See you then.' },
  ],
  vocabulary: [
    {
      term: 'panels', phonetic: '/ˈpænlz/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '展板，海报分区', en: 'one section of a poster carrying a theme' },
      usage: { zh: '可数；arrange the panels、one panel per topic。', en: 'Countable: arrange the panels, one panel per topic.' },
      collocations: ['the panels flow', 'one panel', 'the top panel'],
      example: { en: 'The panels follow a left-to-right reading order.', zh: '展板按从左到右的阅读顺序排列。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpæ/，结尾 /nl/。', en: 'Two syllables stressing the first; ending /nl/.' },
    },
    {
      term: 'diagram', phonetic: '/ˈdaɪəɡræm/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '示意图，简图', en: 'a simple drawing explaining a process or part' },
      usage: { zh: '可数；small diagram、scale diagram。动词 diagram 表图解。', en: 'Countable: small diagram, scale diagram. The verb is diagram.' },
      collocations: ['a small diagram', 'a scale diagram', 'draw the diagram'],
      example: { en: 'A gut diagram is clearer than a spreadsheet.', zh: '肠道简图比电子表格清晰。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈdaɪ/。', en: 'Three syllables stressing the first.' },
    },
    {
      term: 'terms', phonetic: '/tɜːmz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '术语，专业说法', en: 'specialised words used in a subject' },
      usage: { zh: '可数复数；technical terms、medical terms。', en: 'Countable plural: technical terms, medical terms.' },
      collocations: ['technical terms', 'medical terms', 'rewrite the terms'],
      example: { en: 'Technical terms are rewritten in everyday language.', zh: '专业术语改写成日常说法。' },
      listening: { zh: '单音节，结尾 /z/，与 term 单复数区分。', en: 'One syllable ending /z/; distinguish singular term.' },
    },
    {
      term: 'citations', phonetic: '/saɪˈteɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '引文出处，文献标注', en: 'a reference naming the source of a claim' },
      usage: { zh: '可数；citations match the source list。动词 cite。', en: 'Countable: citations match the source list. The verb is cite.' },
      collocations: ['the citations match', 'a citation for', 'check the citations'],
      example: { en: 'The citations must match the source list.', zh: '引用必须与来源清单一致。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈteɪ/。', en: 'Three syllables stressing the second.' },
    },
    {
      term: 'layout', phonetic: '/ˈleɪaʊt/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '版面布局，排版安排', en: 'the arrangement of sections on the poster board' },
      usage: { zh: '可数；start the layout、test the layout。', en: 'Countable: start the layout, test the layout.' },
      collocations: ['the layout begins', 'test the layout', 'the board layout'],
      example: { en: 'We pull the studies before the layout.', zh: '排版前先找齐研究材料。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈleɪ/，是 lay out 的合成词。', en: 'Two syllables stressing the first; a compound of lay out.' },
    },
    {
      term: 'portrait', phonetic: '/ˈpɔːtrət/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '竖版（版面朝向）', en: 'an upright board taller than it is wide' },
      usage: { zh: '版面用语；display stands are portrait。反义 landscape。', en: 'A layout term: display stands are portrait. The opposite is landscape.' },
      collocations: ['a portrait board', 'portrait format', 'the portrait stands'],
      example: { en: 'The stands are portrait, not landscape.', zh: '展架是竖版而非横版。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpɔː/，结尾 /ət/。', en: 'Two syllables stressing the first; ending /ət/.' },
    },
    {
      term: 'captions', phonetic: '/ˈkæpʃnz/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '图注，说明文字', en: 'a short line under a drawing explaining it' },
      usage: { zh: '可数；draft the captions、caption under the diagram。', en: 'Countable: draft the captions, caption under the diagram.' },
      collocations: ['draft the captions', 'the caption line', 'a short caption'],
      example: { en: 'Captions are drafted after the diagrams.', zh: '图示就位后再写图注。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkæ/，结尾 /ʃn/。', en: 'Two syllables stressing the first; ending /ʃn/.' },
    },
  ],
  expressions: [
    {
      phrase: 'put the main question at the top', sentenceIndex: 4,
      meaning: { zh: '把主问题放在版面顶部', en: 'to place the central question highest on the board' },
      usage: { zh: 'put 后接位置；put the question at the top。', en: 'Put plus place: put the question at the top.' },
      example: { en: 'The main question goes at the top in large lettering.', zh: '主问题用大字放在顶部。' },
    },
    {
      phrase: 'simple drawings', sentenceIndex: 7,
      meaning: { zh: '简单图示，简笔画', en: 'plain sketches instead of detailed charts' },
      usage: { zh: '名词短语；use simple drawings instead of graphs。', en: 'A noun phrase: use simple drawings instead of graphs.' },
      example: { en: 'Simple drawings carry the idea quickly.', zh: '简单图示能快速传达意思。' },
    },
    {
      phrase: 'rewrite technical terms', sentenceIndex: 10,
      meaning: { zh: '把专业术语改写通俗', en: 'to restate specialised words in plain language' },
      usage: { zh: 'rewrite 后接宾语；rewrite technical terms in plain speech。', en: 'Rewrite plus object: rewrite technical terms in plain speech.' },
      example: { en: 'We rewrite technical terms for non-specialists.', zh: '我们为非专业读者改写术语。' },
    },
    {
      phrase: 'reading order', sentenceIndex: 13,
      meaning: { zh: '阅读顺序', en: 'the sequence in which panels are meant to be read' },
      usage: { zh: '名词短语；a clear reading order、left-to-right reading order。', en: 'A noun phrase: a clear reading order, left-to-right reading order.' },
      example: { en: 'Panels follow a clear reading order.', zh: '展板遵循清晰的阅读顺序。' },
    },
    {
      phrase: 'split long sentences', sentenceIndex: 41,
      meaning: { zh: '把长句拆成短句', en: 'to break complex sentences into short ones' },
      usage: { zh: 'split 后接宾语；split long sentences into short ones。', en: 'Split plus object: split long sentences into short ones.' },
      example: { en: 'Long sentences are split for an easy pace.', zh: '长句拆短以保持轻松节奏。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对先记说话人', en: 'Match the voice first' },
      body: {
        zh: '配对题问“谁提出哪条方案”。开头先把 Mitchell 和 Emily 的声音对上，每条意见先记说话人再记方案内容，避免两人提议混在一行。',
        en: 'Matching asks who proposed what. Match the two voices at the start, note the speaker before the proposal, and do not mix their ideas on one line.',
      },
    },
    {
      title: { zh: '被否定的方案直接排除', en: 'Rejected proposals are out' },
      body: {
        zh: 'Not、instead、rather than 之后紧跟的方案通常被否决，例如比较两种菌株、去掉图示标签、加入科学家引言。听到否定词就把对应选项划掉。',
        en: 'A proposal after Not, instead or rather than is usually rejected, such as comparing strains, removing labels or adding scientist quotes. Cross the option out at the negation.',
      },
    },
    {
      title: { zh: '多选题辨正式措施', en: 'Read the strength in multiple choice' },
      body: {
        zh: '多选题正确项往往是 We must / We will 引出的正式准备步骤：核对引用、拆分长句、安排视线高度。顾虑、背景和被排除的素材是干扰项，听到建议动词时集中记录。',
        en: 'Correct multiple-choice items are the formal steps introduced by We must or We will: checking citations, splitting sentences, placing eye-level sections. Worries and excluded material are distractors; concentrate on suggestions.',
      },
    },
  ],
};
