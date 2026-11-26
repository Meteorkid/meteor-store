import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 8 · Part 3 — 珊瑚礁展示准备（三人讨论）。原创仿真材料，非官方真题。
 *
 * 两名学生 Thomas、Sonia 与导师 Ava 敲定展示分工、图表与时长规范，再讨论引用与彩排准备。
 * 配对题考分工，单选题考图表理由、时长与图片引用，多选题考导师建议的三项彩排习惯。
 */
export const test08Part3: ListeningLesson = {
  slug: 'test-08-part-3',
  part: 3,
  status: 'published',
  title: { zh: '准备一份关于珊瑚礁的展示', en: 'Preparing a presentation on coral reefs' },
  summary: {
    zh: '两名学生与导师核对珊瑚礁展示的任务分工：谁做开场幻灯片、谁画调查地图、谁核对参考文献；随后确定图表形式、讲述时长与期刊图片引用规则，最后列出彩排前要做的三项准备。',
    en: 'Two students and their tutor agree who does what in their coral reef presentation: opening slides, survey map and references; then they settle the chart type, the speaking time and the journal-image citation rule, before listing three rehearsal preparations.',
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
        { key: 'A', text: 'draws the reef survey map' },
        { key: 'B', text: 'compiles the reading list' },
        { key: 'C', text: 'writes the introduction' },
        { key: 'D', text: 'prepares the opening slides' },
        { key: 'E', text: 'runs the timing practice' },
        { key: 'F', text: 'checks all references' },
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
          stem: 'Why does the tutor recommend a bar chart?',
          options: [
            { key: 'A', text: 'to show growth over several years' },
            { key: 'B', text: 'to compare the four sites side by side' },
            { key: 'C', text: 'to display the number of species at each site' },
          ],
        },
        {
          number: 26,
          stem: 'How long should the main talk last?',
          options: [
            { key: 'A', text: 'twelve minutes' },
            { key: 'B', text: 'fifteen minutes' },
            { key: 'C', text: 'eighteen minutes' },
          ],
        },
        {
          number: 27,
          stem: 'What rule applies to images taken from journals?',
          options: [
            { key: 'A', text: 'cite the author in the corner of the slide' },
            { key: 'B', text: 'ask the publisher for written permission' },
            { key: 'C', text: 'replace them with your own free photographs' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE preparations does the tutor recommend before the talk? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE preparations does the tutor recommend?',
      options: [
        { key: 'A', text: 'record the rehearsal on a phone' },
        { key: 'B', text: 'rehearse standing up' },
        { key: 'C', text: 'prepare answers to likely questions' },
        { key: 'D', text: 'leave every chart on screen during questions' },
        { key: 'E', text: 'bring spare printed notes to read aloud' },
        { key: 'F', text: 'practise with a timer' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['D'], evidence: 3,
      explanation: {
        zh: '定位句 3：I can take the opening slides, with the broad outline of the reef sites we visited。Thomas 负责开场幻灯片，对应 D。',
        en: 'Sentence 3: "I can take the opening slides, with the broad outline of the reef sites we visited". Thomas prepares the opening slides, matching D.',
      },
    },
    {
      number: 22, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Then I will draw the survey map myself, since I recorded the coordinates in the field。Sonia 画调查地图，对应 A。',
        en: 'Sentence 4: "Then I will draw the survey map myself, since I recorded the coordinates in the field". Sonia draws the survey map, matching A.',
      },
    },
    {
      number: 23, accepted: ['F'], evidence: 5,
      explanation: {
        zh: '定位句 5：That leaves the references to me. I will check that every image and data source is listed properly。导师核对全部参考文献，对应 F。',
        en: 'Sentence 5: "That leaves the references to me. I will check that every image and data source is listed properly". The tutor checks the references, matching F.',
      },
    },
    {
      number: 24, accepted: ['E'], evidence: 7,
      explanation: {
        zh: '定位句 7：the whole group should run the timing practice in the seminar room, with a clock at the front。计时彩排由全组一起完成，对应 E。',
        en: 'Sentence 7: "the whole group should run the timing practice in the seminar room, with a clock at the front". The timing practice is a group task, matching E.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：A bar chart works well when you compare the four sites side by side。柱状图用于并排比较四个点位，对应 B。折线图才用来显示逐年变化。',
        en: 'Sentence 17: "A bar chart works well when you compare the four sites side by side". A bar chart compares the four sites, matching B. A line graph would show change over years.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：The main presentation is fifteen minutes, with three minutes for questions after it。主讲十五分钟，问答另算三分钟；十二和十八没有依据。',
        en: 'Sentence 25: "The main presentation is fifteen minutes, with three minutes for questions after it". The talk lasts fifteen minutes; the three minutes are for questions. Twelve and eighteen have no basis.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 31,
      explanation: {
        zh: '定位句 31：If you reproduce an image from a journal, cite the author in the corner of the slide, under the picture。期刊图片在幻灯片角落标注作者，对应 A。出版方许可只在课程外使用时才需要。',
        en: 'Sentence 31: "If you reproduce an image from a journal, cite the author in the corner of the slide, under the picture". Journal images carry the author citation in the corner, matching A. Publisher permission is only needed outside the course.',
      },
    },
    {
      number: 28, accepted: ['B'], evidence: 37,
      explanation: {
        zh: '定位句 37：First, rehearse standing up, the way you will stand on the stage。第一条建议是站着彩排，对应 B。',
        en: 'Sentence 37: "First, rehearse standing up, the way you will stand on the stage". The first recommendation is to rehearse standing up, matching B.',
      },
    },
    {
      number: 29, accepted: ['F'], evidence: 39,
      explanation: {
        zh: '定位句 39：Rehearse twice if you can, and practise with a timer so you know where you stand。第二条建议是用计时器练节奏，对应 F。',
        en: 'Sentence 39: "Rehearse twice if you can, and practise with a timer so you know where you stand". The second recommendation is to practise with a timer, matching F.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 41,
      explanation: {
        zh: '定位句 41：Prepare answers to likely questions, such as how we chose the survey sites。第三条建议是准备常见提问的回答，对应 C。手机录音、全程留图和照读打印稿都被否定或未被建议。',
        en: 'Sentence 41: "Prepare answers to likely questions, such as how we chose the survey sites". The third recommendation is to prepare answers to likely questions, matching C. Recording on a phone, keeping every chart on screen and reading printed notes aloud are rejected or not advised.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'Thanks for making time, Ava. We are nearly ready with our coral reef presentation.' },
    { speaker: 'sonia', text: 'We wanted to go over the structure before the deadline tomorrow afternoon.' },
    { speaker: 'ava', text: 'Good. Let us start by agreeing who owns each section of the talk.' },
    { speaker: 'thomas', text: 'I can take the opening slides, with the broad outline of the reef sites we visited.' },
    { speaker: 'sonia', text: 'Then I will draw the survey map myself, since I recorded the coordinates in the field.' },
    { speaker: 'ava', text: 'That leaves the references to me. I will check that every image and data source is listed properly.' },
    { speaker: 'thomas', text: 'Should we also run through the timing together before we hand the draft in?' },
    { speaker: 'ava', text: 'Yes, the whole group should run the timing practice in the seminar room, with a clock at the front.' },
    { speaker: 'sonia', text: 'Is that everything for the division of work?' },
    { speaker: 'ava', text: 'It looks like it. Once each person knows their part, the draft should come together quickly.' },
    { speaker: 'sonia', text: 'I was worried the map would take longer than the other slides.' },
    { speaker: 'ava', text: 'The coordinates you kept in the field notebook should make it straightforward.' },
    { speaker: 'sonia', text: 'I wrote them down beside each site name in my notebook.' },
    { speaker: 'thomas', text: 'That should save us looking them up again.' },
    { speaker: 'thomas', text: 'The next thing we wanted to check was the charts.' },
    { speaker: 'sonia', text: 'We have data from four reef sites, collected over two seasons last year.' },
    { speaker: 'thomas', text: 'Could we put those figures in a bar chart?' },
    { speaker: 'ava', text: 'A bar chart works well when you compare the four sites side by side.' },
    { speaker: 'sonia', text: 'A line graph would show change over years, but we only have two seasons to compare.' },
    { speaker: 'ava', text: 'Right, so keep the chart simple and label each axis clearly before you add colours.' },
    { speaker: 'thomas', text: 'We have already chosen plain colours for the bars.' },
    { speaker: 'ava', text: 'Good, avoid patterns that look busy on the projector.' },
    { speaker: 'ava', text: 'The projector in the lecture hall washes out bright reds, so test the colours there.' },
    { speaker: 'sonia', text: 'We can check that at the rehearsal on Wednesday.' },
    { speaker: 'thomas', text: 'How long does the main talk need to be?' },
    { speaker: 'ava', text: 'The main presentation is fifteen minutes, with three minutes for questions after it.' },
    { speaker: 'sonia', text: 'That means we should keep each case study to about two minutes.' },
    { speaker: 'sonia', text: 'The third case study is the damaged reef near the harbour.' },
    { speaker: 'thomas', text: 'We should show one before and after photograph for that site.' },
    { speaker: 'thomas', text: 'The after photograph was taken this spring, so the recovery is visible.' },
    { speaker: 'thomas', text: 'And what about the photographs we copied from the journals?' },
    { speaker: 'ava', text: 'If you reproduce an image from a journal, cite the author in the corner of the slide, under the picture.' },
    { speaker: 'sonia', text: 'Do we need permission from the publisher as well?' },
    { speaker: 'ava', text: 'Only if the image is used outside this course. For the seminar, the citation is enough.' },
    { speaker: 'ava', text: 'And keep the citation readable, not a tiny line at the bottom.' },
    { speaker: 'sonia', text: 'I will make a note of the author for each image tonight.' },
    { speaker: 'thomas', text: 'Now, what should we do in the last two days before the talk?' },
    { speaker: 'ava', text: 'A few habits help. First, rehearse standing up, the way you will stand on the stage.' },
    { speaker: 'sonia', text: 'Just one rehearsal, or more than that?' },
    { speaker: 'ava', text: 'Rehearse twice if you can, and practise with a timer so you know where you stand.' },
    { speaker: 'thomas', text: 'Is there anything else we should prepare in advance?' },
    { speaker: 'ava', text: 'Prepare answers to likely questions, such as how we chose the survey sites.' },
    { speaker: 'sonia', text: 'What should we leave on screen during the questions?' },
    { speaker: 'ava', text: 'Leave the summary slide up, not every previous chart.' },
    { speaker: 'thomas', text: 'What about our notes on the laptop?' },
    { speaker: 'ava', text: 'Spare printed notes are useful if the app fails, but do not read from them word for word.' },
    { speaker: 'sonia', text: 'I usually keep a small card with the main headings, not the whole script.' },
    { speaker: 'ava', text: 'That is a good compromise between notes and speaking freely.' },
    { speaker: 'thomas', text: 'Our laptop also has a copy of the slides in case the file does not open.' },
    { speaker: 'ava', text: 'That is sensible, but still bring the printed notes as a backup.' },
    { speaker: 'sonia', text: 'Did we miss anything about the background reading?' },
    { speaker: 'ava', text: 'The background articles are on the course page, two of them due by Friday.' },
    { speaker: 'sonia', text: 'Are both articles required reading, or just background?' },
    { speaker: 'ava', text: 'They are background, but the methods paper helps you defend the map.' },
    { speaker: 'thomas', text: 'Which one should we read first?' },
    { speaker: 'ava', text: 'The survey methods paper, because it matches the map you drew.' },
    { speaker: 'sonia', text: 'I will check the image credits once the map is finished.' },
    { speaker: 'thomas', text: 'The references page can go at the end, after the summary.' },
    { speaker: 'thomas', text: 'Should we email the draft to each other tonight?' },
    { speaker: 'sonia', text: 'Yes, so everyone sees the same version before the rehearsal.' },
    { speaker: 'thomas', text: 'I think the opening slides are the next thing on my list.' },
    { speaker: 'sonia', text: 'I will start the survey map this evening after dinner.' },
    { speaker: 'ava', text: 'Come back to me if a chart stops making sense once you rehearse aloud.' },
    { speaker: 'thomas', text: 'Will do.' },
    { speaker: 'sonia', text: 'Thanks for the feedback today.' },
  ],
  vocabulary: [
    {
      term: 'presentation', phonetic: '/ˌpreznˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '展示，报告', en: 'a talk with slides that explains a topic to an audience' },
      usage: { zh: '可数；give a presentation、a course presentation。', en: 'Countable: give a presentation, a course presentation.' },
      collocations: ['give a presentation', 'a course presentation', 'the main presentation'],
      example: { en: 'We are nearly ready with our coral reef presentation.', zh: '我们的珊瑚礁展示快准备好了。' },
      listening: { zh: '重音在第四个音节 /ˈteɪ/；中间 /zn/ 轻读。', en: 'Stress the fourth syllable; the middle /zn/ is weak.' },
    },
    {
      term: 'coordinates', phonetic: '/kəʊˈɔːdɪnəts/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '坐标', en: 'numbers that mark a position on a map' },
      usage: { zh: '常用复数；record the coordinates、map coordinates。', en: 'Usually plural: record the coordinates, map coordinates.' },
      collocations: ['record the coordinates', 'map coordinates', 'field coordinates'],
      example: { en: 'I recorded the coordinates in the field.', zh: '我在现场记录了坐标。' },
      listening: { zh: '重音在第二音节 /ˈɔː/；动词形式重音在第一音节。', en: 'Stress the second syllable here; the verb accents the first.' },
    },
    {
      term: 'references', phonetic: '/ˈrefrənsɪz/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '参考文献，引用出处', en: 'the list of sources cited in a piece of work' },
      usage: { zh: '常用复数；check the references、a references page。', en: 'Usually plural: check the references, a references page.' },
      collocations: ['check the references', 'the references page', 'list the references'],
      example: { en: 'I will check that every source is listed properly in the references.', zh: '我会核对参考文献里每个出处是否完整。' },
      listening: { zh: '三个音节，重音在第一音节；结尾 /sɪz/。', en: 'Three syllables with stress on the first and a final /sɪz/.' },
    },
    {
      term: 'bar chart', phonetic: '/ˈbɑː tʃɑːt/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '柱状图', en: 'a diagram with bars of different heights for comparison' },
      usage: { zh: '可数；put data in a bar chart。对照 line graph 折线图。', en: 'Countable: put data in a bar chart. Compare a line graph.' },
      collocations: ['a bar chart', 'draw a bar chart', 'the bars of a chart'],
      example: { en: 'A bar chart compares the four sites side by side.', zh: '柱状图把四个点位并排放在一起比较。' },
      listening: { zh: '两个名词都重读；bar 后短暂停顿。', en: 'Both nouns are stressed with a short pause after bar.' },
    },
    {
      term: 'axis', phonetic: '/ˈæksɪs/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '坐标轴', en: 'the labelled line along which values are measured on a chart' },
      usage: { zh: '复数 axes；label each axis、the x axis。', en: 'Plural axes: label each axis, the x axis.' },
      collocations: ['label each axis', 'the horizontal axis', 'the axis labels'],
      example: { en: 'Label each axis clearly before you add colours.', zh: '加颜色前先把每条坐标轴标清楚。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈæk/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'reproduce', phonetic: '/ˌriːprəˈdjuːs/', partOfSpeech: 'v.', sentenceIndex: 31,
      meaning: { zh: '复制，转载（图片等）', en: 'to copy or publish someone else’s image, text or data' },
      usage: { zh: '及物动词；reproduce an image、reproduce a chart。', en: 'Transitive: reproduce an image, reproduce a chart.' },
      collocations: ['reproduce an image', 'reproduce a photograph', 'reproduce a table'],
      example: { en: 'If you reproduce an image from a journal, cite the author.', zh: '转载期刊图片时要标注作者。' },
      listening: { zh: '重音在第三音节 /ˈdjuːs/；前缀 /riː/ 长音。', en: 'Stress the third syllable; the prefix is a long /riː/.' },
    },
    {
      term: 'citation', phonetic: '/saɪˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '引用，出处标注', en: 'a note identifying the author and source of borrowed material' },
      usage: { zh: '可数；a citation under the picture、keep the citation readable。', en: 'Countable: a citation under the picture, keep the citation readable.' },
      collocations: ['a citation', 'the author citation', 'include a citation'],
      example: { en: 'The citation should sit in the corner, under the picture.', zh: '出处标注放在角落、图片下方。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈteɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'compromise', phonetic: '/ˈkɒmprəmaɪz/', partOfSpeech: 'n.', sentenceIndex: 47,
      meaning: { zh: '折中方案', en: 'a middle way between two opposing choices' },
      usage: { zh: '可数；a good compromise、a compromise between notes and freedom。', en: 'Countable: a good compromise, a compromise between two things.' },
      collocations: ['a good compromise', 'a compromise between', 'find a compromise'],
      example: { en: 'A heading card is a good compromise between notes and speaking freely.', zh: '提纲卡片是兼顾提词与自由表达的折中办法。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkɒm/。', en: 'Three syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'go over', sentenceIndex: 1,
      meaning: { zh: '核对，过一遍', en: 'to review or check something together' },
      usage: { zh: '短语动词；go over the structure、go over the draft。', en: 'A phrasal verb: go over the structure, go over the draft.' },
      example: { en: 'We wanted to go over the structure before the deadline.', zh: '我们想在截止前把结构核对一遍。' },
    },
    {
      phrase: 'owns each section', sentenceIndex: 2,
      meaning: { zh: '各自负责一部分', en: 'to be responsible for one part of a shared task' },
      usage: { zh: 'own 在此为“负责、牵头”；own a section、own the slides。', en: 'Here own means take responsibility: own a section, own the slides.' },
      example: { en: 'Let us agree who owns each section of the talk.', zh: '我们先说好谁负责哪一部分。' },
    },
    {
      phrase: 'side by side', sentenceIndex: 17,
      meaning: { zh: '并排，并列', en: 'next to one another for direct comparison' },
      usage: { zh: '方式状语；compare the sites side by side。', en: 'An adverbial: compare the sites side by side.' },
      example: { en: 'A bar chart compares the four sites side by side.', zh: '柱状图把四个点位并排比较。' },
    },
    {
      phrase: 'come together', sentenceIndex: 9,
      meaning: { zh: '凑齐，成型', en: 'to develop into a complete piece of work' },
      usage: { zh: '不及物；the draft comes together、the plan comes together。', en: 'Intransitive: the draft comes together, the plan comes together.' },
      example: { en: 'Once each person knows their part, the draft should come together quickly.', zh: '各人分工明确后，草稿很快就能成型。' },
    },
    {
      phrase: 'word for word', sentenceIndex: 45,
      meaning: { zh: '逐字地，照原文', en: 'exactly as written, without changing a word' },
      usage: { zh: '方式状语；do not read notes word for word。', en: 'An adverbial: do not read notes word for word.' },
      example: { en: 'Do not read from the printed notes word for word.', zh: '不要照着打印稿逐字念。' },
    },
    {
      phrase: 'come back to me', sentenceIndex: 62,
      meaning: { zh: '再回来找我（反馈问题）', en: 'to return for more help after trying something yourself' },
      usage: { zh: '辅导场景用语；come back to me if a chart fails to make sense。', en: 'A tutoring phrase: come back to me if a chart fails to make sense.' },
      example: { en: 'Come back to me if a chart stops making sense once you rehearse.', zh: '彩排后若图表讲不通，再回来找我。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先抓身份句', en: 'For matching, catch the role first' },
      body: {
        zh: '第 21–24 题把任务和人配对。讨论开场先报分工，人名后面紧跟动词短语（take the slides、draw the map、check references）；听到人名立刻在题号旁标记，再把短语对上选项。',
        en: 'Items 21 to 24 pair people with tasks. The division of work opens the discussion, and each name is followed by a verb phrase such as take the slides, draw the map or check references. Mark the number when you hear the name, then match the phrase to a letter.',
      },
    },
    {
      title: { zh: '多选题排除被否定的选项', en: 'For multi-select, drop the rejected options' },
      body: {
        zh: '第 28–30 题选三项彩排准备。导师逐条给建议，同时会否定手机录音、全程留图、照读打印稿；被否定或未被提及的选项先划掉，剩下的就是答案。',
        en: 'Items 28 to 30 ask for three rehearsal preparations. The tutor lists the recommendations and rejects recording on a phone, keeping every chart on screen and reading printed notes aloud. Cross out rejected or unmentioned options first, then the remaining ones are the answers.',
      },
    },
    {
      title: { zh: '图表题听比较对象', en: 'For chart questions, listen for what is compared' },
      body: {
        zh: '第 25 题问为什么用柱状图。题目选项会把比较对象换成年份、物种数；录音里 side by side、four sites 才是选择柱状图的依据，别被 line graph 的泛泛对比带偏。',
        en: 'Item 25 asks why a bar chart is chosen. The options swap the comparison to years or species counts. The recording says side by side and four sites, which justify the bar chart; do not be led away by the general mention of a line graph.',
      },
    },
  ],
};
