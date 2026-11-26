import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 26 · Part 3 — 旅游统计评析（两人讨论，新西兰 + 爱尔兰口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：口径差异 → 季节性偏差 → 可比性存疑 → 图表误读提醒 → 选题理由与共同弱点 →
 * 提纲要求 → 安全结论边界（多选 28–30）。配对 21–24 先于单选 25–27，多选最后。
 */
export const test26Part3: ListeningLesson = {
  slug: 'test-26-part-3',
  part: 3,
  status: 'published',
  title: { zh: '旅游统计评析', en: 'Reviewing tourism statistics' },
  summary: {
    zh: '两名学生评析两个滨海城镇的旅游数据：指出两镇计数口径不同，季节性高峰扭曲年度对比，质疑两份调查是否可比，并提醒不要仅凭单一图表趋势下结论；确定提纲要素，梳理可以安全陈述的结论边界。',
    en: 'Two students review tourism data for two coastal towns: flagging different counting rules, seasonal peaks that distort annual comparison, doubts about comparability, and warnings against overreading one chart trend; they settle the outline elements and the safe conclusions.',
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
      instruction: 'What does each person point out? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'points out differences in how figures are counted' },
        { key: 'B', text: 'flags that seasonal peaks distort year comparisons' },
        { key: 'C', text: 'questions whether the two surveys are comparable' },
        { key: 'D', text: 'warns against overreading a single chart trend' },
        { key: 'E', text: 'recommends collecting data for a full calendar year' },
        { key: 'F', text: 'compares visitor spending across three regions' },
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
          stem: 'Why does Liam say the two towns are hard to compare?',
          options: [
            { key: 'A', text: 'The two towns share the same survey frame' },
            { key: 'B', text: 'Their visitor base and definitions differ clearly' },
            { key: 'C', text: 'The ferry prices are lower in Arna' },
          ],
        },
        {
          number: 26,
          stem: 'What weakness do they agree the data has?',
          options: [
            { key: 'A', text: 'Sample frames and counting rules differ between the two years' },
            { key: 'B', text: 'The chart uses the wrong colours for the two lines' },
            { key: 'C', text: 'The survey missed all overseas visitors' },
          ],
        },
        {
          number: 27,
          stem: 'What does the tutor expect in the review outline?',
          options: [
            { key: 'A', text: 'A completed first draft of the review' },
            { key: 'B', text: 'The review question, cited sources and a rough plan' },
            { key: 'C', text: 'A full annotated bibliography' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE conclusions can the review safely state? Choose three letters, A–F.',
      select: 3,
      stem: 'Which THREE conclusions can the review safely state?',
      options: [
        { key: 'A', text: 'visitor numbers rose during the summer months' },
        { key: 'B', text: 'the destination is now the region’s top attraction' },
        { key: 'C', text: 'spending per visitor stayed roughly steady' },
        { key: 'D', text: 'all tourists came from overseas markets' },
        { key: 'E', text: 'sample sizes differ between the two years' },
        { key: 'F', text: 'the survey should cover a full twelve months before broader claims' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：So the two figures use different counting rules, and that alone can explain much of the gap。Liam 指出计数口径不同，对应 A。',
        en: 'Sentence 3: "the two figures use different counting rules", matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：Those seasonal peaks distort the year on year comparison, since one town may have a longer high season。Emily 指出季节高峰扭曲年度对比，对应 B。',
        en: 'Sentence 6: "Those seasonal peaks distort the year on year comparison", matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 9,
      explanation: {
        zh: '定位句 9：Given those differences, I doubt the two surveys are comparable in a strict sense。Liam 质疑两份调查的可比性，对应 C。',
        en: 'Sentence 9: "I doubt the two surveys are comparable in a strict sense", matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 12,
      explanation: {
        zh: '定位句 12：A single upward trend on one chart should not be read as proof of a steady market recovery。Emily 提醒不要过度解读单条图表趋势，对应 D。',
        en: 'Sentence 12: "A single upward trend on one chart should not be read as proof", matching D.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：Their visitor base differs most clearly, which lets us practise comparing definitions rather than totals。两镇访客群体与定义差异明显，对应 B。A 的同一抽样框、C 的船票价格均未提及。',
        en: 'Sentence 17: "Their visitor base differs most clearly", matching B. The shared frame in A and ferry prices in C are not mentioned.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 22,
      explanation: {
        zh: '定位句 22：the sample and the counting rules differ between the two years。共同弱点是抽样框与计数口径跨年不同，对应 A。B 的线条颜色、C 的漏掉海外游客均未被列为弱点。',
        en: 'Sentence 22: "the sample and the counting rules differ between the two years", matching A. Line colours and missing overseas visitors are not raised as weaknesses.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：She wants the question, the sources we will cite, and a short paragraph plan。提纲要研究问题、引用史料和粗略段落计划，对应 B。完整初稿在提纲通过之后，完整书目不在要求内。',
        en: 'Sentence 26: "She wants the question, the sources we will cite, and a short paragraph plan", matching B. The full draft comes later, and the bibliography is not an outline requirement.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：visitor numbers clearly rose during the summer months, which both tables show。两表都显示夏季访客上升，这一结论安全，对应 A。',
        en: 'Sentence 30: "visitor numbers clearly rose during the summer months, which both tables show", matching A.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 32,
      explanation: {
        zh: '定位句 32：spending per visitor stayed roughly steady across the two summers。人均消费大致平稳，对应 C。句 33 补充平均支出变动很小。',
        en: 'Sentence 32: "spending per visitor stayed roughly steady across the two summers", matching C. Sentence 33 adds that the average moved only a little.',
      },
    },
    {
      number: 30, accepted: ['F'], evidence: 34,
      explanation: {
        zh: '定位句 34：the survey should cover a full twelve months before anyone makes broader claims。结论边界是需覆盖完整一年再作宽泛判断，对应 F。B 的头号景点、D 的全来自海外在句 37、38 被否定；E 的样本量差异是局限而非结论。',
        en: 'Sentence 34: "the survey should cover a full twelve months before anyone makes broader claims", matching F. The top attraction in B and all overseas visitors in D are rejected in sentences 37 and 38; sample size difference in E is a limitation, not a finding.',
      },
    },
  ],
  transcript: [
    { speaker: 'liam', text: 'The tourism numbers we pulled last month cover two coastal towns, and the gaps look large at first glance.' },
    { speaker: 'emily', text: 'Before we trust those gaps, we should check what each survey actually counted.' },
    { speaker: 'liam', text: 'Right. The town of Arna counted day visitors who parked on the seafront, while Pell listed only guests who stayed overnight.' },
    { speaker: 'liam', text: 'So the two figures use different counting rules, and that alone can explain much of the gap.' },
    { speaker: 'emily', text: 'I also notice both sets peak in the summer, which makes any annual average hard to read.' },
    { speaker: 'liam', text: 'Yes, a three month summer high can pull the yearly total well above a quiet winter.' },
    { speaker: 'emily', text: 'Those seasonal peaks distort the year on year comparison, since one town may have a longer high season.' },
    { speaker: 'liam', text: 'Have you looked at where the respondents came from?' },
    { speaker: 'emily', text: 'The Arna sample leans on weekend visitors, and Pell drew mostly from hotel bookings.' },
    { speaker: 'liam', text: 'Given those differences, I doubt the two surveys are comparable in a strict sense.' },
    { speaker: 'emily', text: 'We can still describe each town on its own terms, but we should not rank them directly.' },
    { speaker: 'liam', text: 'The chart we were given plots monthly visitors on one line.' },
    { speaker: 'emily', text: 'A single upward trend on one chart should not be read as proof of a steady market recovery.' },
    { speaker: 'liam', text: 'Exactly. One good season may reflect cheaper ferry tickets rather than a lasting rise.' },
    { speaker: 'emily', text: 'So where should our review start?' },
    { speaker: 'liam', text: 'I want to separate facts the table records from claims the travel brochure makes.' },
    { speaker: 'emily', text: 'Tell me why you picked these two towns for the review.' },
    { speaker: 'liam', text: 'Their visitor base differs most clearly, which lets us practise comparing definitions rather than totals.' },
    { speaker: 'emily', text: 'What about the weaknesses anyone should spot first?' },
    { speaker: 'liam', text: 'The sample frames overlap only slightly, and neither survey records spending per visit.' },
    { speaker: 'emily', text: 'I noticed that too. The figures mix arrivals with people who returned more than once.' },
    { speaker: 'liam', text: 'The month split is uneven, with four summer weeks carrying most of the annual count.' },
    { speaker: 'emily', text: 'We agree the main weakness is that the sample and the counting rules differ between the two years.' },
    { speaker: 'liam', text: 'Should we write that as a direct criticism?' },
    { speaker: 'emily', text: 'Keep it fair. Say what limits the comparison, rather than calling the data useless.' },
    { speaker: 'liam', text: 'Fair enough. What does the tutor expect in the review outline?' },
    { speaker: 'emily', text: 'She wants the question, the sources we will cite, and a short paragraph plan.' },
    { speaker: 'liam', text: 'So the outline is question plus sources plus plan, not a full draft.' },
    { speaker: 'emily', text: 'Correct. The written review comes after the outline is approved.' },
    { speaker: 'liam', text: 'Now, which conclusions can we safely state?' },
    { speaker: 'emily', text: 'First, visitor numbers clearly rose during the summer months, which both tables show.' },
    { speaker: 'liam', text: 'That is safe, since the monthly rows agree even where definitions differ.' },
    { speaker: 'emily', text: 'Second, spending per visitor stayed roughly steady across the two summers.' },
    { speaker: 'liam', text: 'The average spend moved only a little, so that narrow claim holds up.' },
    { speaker: 'emily', text: 'Third, the survey should cover a full twelve months before anyone makes broader claims.' },
    { speaker: 'liam', text: 'Yes, a partial year cannot support statements about the whole market.' },
    { speaker: 'emily', text: 'What should we avoid claiming?' },
    { speaker: 'liam', text: 'We must not say Arna is now the region’s top attraction; the ranking data is not here.' },
    { speaker: 'emily', text: 'Nor can we say all tourists came from overseas markets; most respondents were local or domestic.' },
    { speaker: 'liam', text: 'And the sample size difference between years is a limitation, not a finding we highlight as a result.' },
    { speaker: 'emily', text: 'Good. The three safe parts are the summer rise, the steady spend, and the need for a full year.' },
    { speaker: 'liam', text: 'Let me write those down before I forget.' },
    { speaker: 'emily', text: 'How long do we have for the reading note?' },
    { speaker: 'liam', text: 'The draft review is due in two weeks, and the outline next Friday.' },
    { speaker: 'emily', text: 'Then we split the work after the outline is accepted.' },
    { speaker: 'liam', text: 'I can draft the definition section, and you check the spending figures.' },
    { speaker: 'emily', text: 'Good. I will note the rows where the month labels look incomplete.' },
    { speaker: 'liam', text: 'Did you find any notes on how the surveys were collected?' },
    { speaker: 'emily', text: 'One was run at the car park, the other at the reception desk, which explains the sample bias.' },
    { speaker: 'liam', text: 'We could mention that in the data discussion.' },
    { speaker: 'emily', text: 'The timetable says the tutor wants a spoken follow-up after the written review.' },
    { speaker: 'liam', text: 'I will prepare two questions she might ask about the sample.' },
    { speaker: 'emily', text: 'Cite each survey by its report reference, not by the brochure page.' },
    { speaker: 'liam', text: 'The reading list marks which sources are open access for the course.' },
    { speaker: 'emily', text: 'Check whether any figures are repeated without a record behind them.' },
    { speaker: 'liam', text: 'Those are the claims we should treat with caution.' },
    { speaker: 'emily', text: 'Did the reports explain how visitors were classified?' },
    { speaker: 'liam', text: 'Only briefly, which is why the counting difference is worth raising.' },
    { speaker: 'emily', text: 'Separate the figures the tables prove from the authors’ own interpretation.' },
    { speaker: 'liam', text: 'That keeps the review analytical rather than descriptive.' },
    { speaker: 'emily', text: 'Let me reread the last section before we compare notes again.' },
    { speaker: 'liam', text: 'I will read the chapter on tourism trends tonight.' },
    { speaker: 'emily', text: 'Meet me by the library entrance after your tutorial.' },
    { speaker: 'liam', text: 'One more thing. Should we quote the ferry ticket prices?' },
    { speaker: 'emily', text: 'Only if a report backs the figure; otherwise leave it out.' },
    { speaker: 'liam', text: 'Understood. I will keep the review close to the evidence.' },
    { speaker: 'emily', text: 'Good. We can refine the outline once both sections are done.' },
  ],
  vocabulary: [
    {
      term: 'survey', phonetic: '/ˈsɜːveɪ/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '调查，问卷统计', en: 'a study that collects responses from a group' },
      usage: { zh: '可数；run a survey、survey frame。动词 survey。', en: 'Countable: run a survey, survey frame; the verb is survey.' },
      collocations: ['the tourism survey', 'the two surveys', 'survey results'],
      example: { en: 'Each survey counted visitors in its own way.', zh: '两份调查各按自己的方式计数。' },
      listening: { zh: '名词重音在第一音节；动词重音在第二音节。', en: 'The noun stresses the first; the verb stresses the second.' },
    },
    {
      term: 'definitions', phonetic: '/ˌdefɪˈnɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '定义，口径界定', en: 'the rules saying what counts as a visitor' },
      usage: { zh: '可数复数；compare definitions、working definition。', en: 'Countable plural: compare definitions, working definition.' },
      collocations: ['different definitions', 'visitor definitions', 'the counting definitions'],
      example: { en: 'The two towns use different visitor definitions.', zh: '两镇对访客的定义不同。' },
      listening: { zh: '重音在第三音节 /ˈnɪʃ/。', en: 'Stress the third syllable /ˈnɪʃ/.' },
    },
    {
      term: 'seasonal', phonetic: '/ˈsiːzənl/', partOfSpeech: 'adj.', sentenceIndex: 6,
      meaning: { zh: '季节性的', en: 'related to a particular time of year' },
      usage: { zh: 'seasonal peaks、seasonal variation。名词 season。', en: 'seasonal peaks, seasonal variation; the noun is season.' },
      collocations: ['seasonal peaks', 'seasonal demand', 'seasonal workers'],
      example: { en: 'Seasonal peaks distort the annual average.', zh: '季节高峰扭曲年度均值。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsiː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'comparable', phonetic: '/ˈkɒmpərəbl/', partOfSpeech: 'adj.', sentenceIndex: 9,
      meaning: { zh: '可比的，可对照的', en: 'similar enough to judge against each other' },
      usage: { zh: 'be comparable、comparable in a strict sense。名词 comparability。', en: 'be comparable, comparable in a strict sense; the noun is comparability.' },
      collocations: ['comparable data', 'strictly comparable', 'comparable samples'],
      example: { en: 'The two samples are not strictly comparable.', zh: '两份样本并不能严格对照。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkɒm/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'trend', phonetic: '/trend/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '趋势，走向', en: 'the general direction of a figure over time' },
      usage: { zh: '可数；upward trend、chart trend。', en: 'Countable: upward trend, chart trend.' },
      collocations: ['an upward trend', 'the market trend', 'a single trend'],
      example: { en: 'One chart trend does not prove recovery.', zh: '单条图表趋势不能证明复苏。' },
      listening: { zh: '单音节，与 send 押韵，开头 /tr/。', en: 'One syllable rhyming with send, opening /tr/.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '样本（调查对象）', en: 'the group chosen to represent a wider population' },
      usage: { zh: '可数；sample frame、sample size。', en: 'Countable: sample frame, sample size.' },
      collocations: ['the sample frame', 'the survey sample', 'sample bias'],
      example: { en: 'The sample frames overlap only slightly.', zh: '抽样框重合度很低。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɑː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'outline', phonetic: '/ˈaʊtlaɪn/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '提纲，大纲', en: 'a short plan showing the main parts of a review' },
      usage: { zh: '可数；hand in the outline、rough outline。', en: 'Countable: hand in the outline, rough outline.' },
      collocations: ['the review outline', 'a rough outline', 'draft the outline'],
      example: { en: 'The outline lists question and sources first.', zh: '提纲先列问题与史料。' },
      listening: { zh: '复合词，重音在第一部分 /ˈaʊt/。', en: 'A compound with stress on the first part.' },
    },
    {
      term: 'interpretation', phonetic: '/ɪnˌtɜːprɪˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 58,
      meaning: { zh: '解读，阐释', en: 'the meaning an author gives to the figures' },
      usage: { zh: '可数或不可数；the author’s interpretation。动词 interpret。', en: 'Countable or uncountable: the author’s interpretation; the verb is interpret.' },
      collocations: ['the author’s interpretation', 'a cautious interpretation', 'separate facts from interpretation'],
      example: { en: 'Separate record figures from the author’s interpretation.', zh: '把表格数字与作者解读分开。' },
      listening: { zh: '重音在第四音节 /ˈteɪ/。', en: 'Stress the fourth syllable /ˈteɪ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'trust those gaps', sentenceIndex: 1,
      meaning: { zh: '相信这些差距属实', en: 'to take the apparent differences at face value' },
      usage: { zh: 'trust 作动词；trust the figures、trust the gap。', en: 'Trust is a verb: trust the figures, trust the gap.' },
      example: { en: 'Do not trust the gaps before checking the counts.', zh: '核对计数前别相信差距。' },
    },
    {
      phrase: 'rank them directly', sentenceIndex: 10,
      meaning: { zh: '直接排定高下', en: 'to place one above the other without caveat' },
      usage: { zh: 'rank 作动词；rank the towns、rank them directly。', en: 'Rank is a verb: rank the towns, rank them directly.' },
      example: { en: 'We should not rank the two towns directly.', zh: '我们不该直接给两镇排名。' },
    },
    {
      phrase: 'read as proof', sentenceIndex: 12,
      meaning: { zh: '被当成证据', en: 'to be taken as confirmation of a claim' },
      usage: { zh: '被动短语；be read as proof、read as evidence，指把趋势误当作定论。', en: 'be read as proof, read as evidence.' },
      example: { en: 'The trend should not be read as proof.', zh: '这一趋势不应被当成证据。' },
    },
    {
      phrase: 'holds up', sentenceIndex: 33,
      meaning: { zh: '站得住，成立', en: 'to remain valid under scrutiny' },
      usage: { zh: '结论站得住；the claim holds up。', en: 'A claim holds up under scrutiny.' },
      example: { en: 'That narrow claim still holds up.', zh: '这个窄结论仍然成立。' },
    },
    {
      phrase: 'treat with caution', sentenceIndex: 55,
      meaning: { zh: '谨慎对待', en: 'to regard a claim as uncertain until checked' },
      usage: { zh: '动词短语；treat a figure with caution、treat a claim with caution，指存疑待核。', en: 'treat a figure with caution, treat a claim with caution.' },
      example: { en: 'Unsupported figures should be treated with caution.', zh: '没有出处的数字要谨慎对待。' },
    },
    {
      phrase: 'close to the evidence', sentenceIndex: 65,
      meaning: { zh: '紧扣证据', en: 'to keep claims tied to what the records show' },
      usage: { zh: '形容词短语；close to the evidence、stay close to the data，指结论不超出记录。', en: 'close to the evidence, stay close to the data.' },
      example: { en: 'Keep the review close to the evidence.', zh: '让书评紧扣证据。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对先记提议者', en: 'Match the point to its speaker' },
      body: {
        zh: 'Part 3 配对常考“谁指出了哪点”。边听边在人名旁记下动词与关键词：counting rules, seasonal peaks, comparable, chart trend，不要把对方附和的话当成他提出的。',
        en: 'Part 3 matching often asks who said what. Note the verb and keyword beside each name: counting rules, seasonal peaks, comparable, chart trend. Do not count agreement as a proposal.',
      },
    },
    {
      title: { zh: '多选区分结论与局限', en: 'Separate findings from limitations' },
      body: {
        zh: '多选三项正确：夏季上升、人均平稳、需满一年。样本量差异是局限而非结论，头号景点与全来自海外被明确否定。听到 limitation、must not 就在选项旁打叉。',
        en: 'Three are correct: summer rise, steady spend, full-year need. Sample size difference is a limitation, not a finding; top attraction and all overseas visitors are rejected. Mark limitations and must-not items out.',
      },
    },
    {
      title: { zh: '统计题抓口径词', en: 'Catch the counting-rule nouns' },
      body: {
        zh: 'survey、definition、sample frame、counting rules、comparable 这类词在题干反复出现。听到它们就预判后面是口径说明、弱点还是操作建议，单选答案通常紧跟解释句。',
        en: 'Words like survey, definition, sample frame, counting rules and comparable recur in stems. When you hear one, predict whether the next sentence defines, critiques or advises; the single-choice answer usually follows.',
      },
    },
  ],
};
