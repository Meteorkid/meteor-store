import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 29 · Part 3 — 校园可持续审计（两人讨论，澳式 + 英式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：审计范围、数据来源、指标权重、报告章节、汇报对象（配对 21–24）→
 * 排除建筑、最高权重理由、首收报告人（单选 25–27）→ 三项测量指标（多选 28–30）。
 */
export const test29Part3: ListeningLesson = {
  slug: 'test-29-part-3',
  part: 3,
  status: 'published',
  title: { zh: '校园可持续审计', en: 'Planning a campus sustainability audit' },
  summary: {
    zh: '两名学生规划校园可持续审计：范围只覆盖主教学楼，数据来自学院能源账单与部门用纸记录，节能指标权重最高，报告后段列出下学期建议；随后明确体育中心、咖啡馆和旧宿舍被排除，节能权重最高是因为同时降低账单与碳足迹，完整报告先交校园运营主管；并锁定用电、打印纸和用水量三项测量指标。',
    en: 'Two students plan a sustainability audit: scope covers main teaching buildings, data come from energy bills and paper orders, energy saving weighs highest, and a later section lists next-term recommendations. They exclude the sports centre, café and old halls, note energy cuts bills and carbon, and send the full report first to the operations officer. Indicators are electricity, paper and water.',
  },
  accent: { zh: 'William 为澳式口音，Thomas 为英式口音，两人语速中等。', en: 'William speaks with an Australian accent and Thomas with a British accent, both at a moderate pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'william', label: 'WILLIAM', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'thomas', label: 'THOMAS', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which description matches each audit term? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'covers only the main teaching buildings' },
        { key: 'B', text: 'drawn from the college’s energy bills' },
        { key: 'C', text: 'gives energy saving the highest score' },
        { key: 'D', text: 'lists recommendations for next term' },
        { key: 'E', text: 'shared with the student union' },
      ],
      items: [
        { number: 21, text: 'The audit scope' },
        { number: 22, text: 'The data source' },
        { number: 23, text: 'The indicator weight' },
        { number: 24, text: 'The report section' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Which buildings are excluded from the audit?',
          options: [
            { key: 'A', text: 'The main teaching buildings' },
            { key: 'B', text: 'The sports centre, café and old halls' },
            { key: 'C', text: 'The library seminar rooms' },
          ],
        },
        {
          number: 26,
          stem: 'Why does energy saving get the highest weight?',
          options: [
            { key: 'A', text: 'It reduces bills and the carbon footprint most' },
            { key: 'B', text: 'It is the easiest data to collect' },
            { key: 'C', text: 'Students request it in the survey' },
          ],
        },
        {
          number: 27,
          stem: 'Who receives the final report first?',
          options: [
            { key: 'A', text: 'The student union' },
            { key: 'B', text: 'The campus operations officer' },
            { key: 'C', text: 'The audit team’s tutor' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE indicators does the audit measure? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE indicators does the audit measure?',
      options: [
        { key: 'A', text: 'electricity use' },
        { key: 'B', text: 'printed paper' },
        { key: 'C', text: 'water consumption' },
        { key: 'D', text: 'student satisfaction' },
        { key: 'E', text: 'outdoor parking' },
        { key: 'F', text: 'bicycle repairs' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：The scope this time covers only the main teaching buildings, not the sports centre。审计范围只限主教学楼，对应 A。',
        en: 'Sentence 3: the scope "covers only the main teaching buildings", matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：The main data source is the college’s energy bills over the past year。数据主要来自学院能源账单，对应 B。',
        en: 'Sentence 6: the main data source is "the college’s energy bills", matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 10,
      explanation: {
        zh: '定位句 10：Energy saving carries the highest weight, because it drives the biggest carbon cut。节能指标权重最高，对应 C。',
        en: 'Sentence 10: energy saving "carries the highest weight", matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 13,
      explanation: {
        zh: '定位句 13：A later section lists recommendations for next term, with a clear owner for each。报告章节列出下学期建议，对应 D。分享给学生会是后续流程，不是章节内容。',
        en: 'Sentence 13: a later section "lists recommendations for next term", matching D. Sharing with the union is a later step, not the section itself.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：The sports centre and the student café are excluded, along with the old halls of residence。体育中心、咖啡馆和旧宿舍被排除，对应 B。主教学楼是纳入范围的对象。',
        en: 'Sentence 19: the sports centre, café and old halls are excluded, matching B. Main teaching buildings are in scope.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：Because cutting energy use reduces both the bills and the college’s carbon footprint。节能同时降低账单和碳足迹，对应 A。收集难易、学生调查未提及。',
        en: 'Sentence 21: cutting energy use reduces "both the bills and the college’s carbon footprint", matching A. Ease of collection and student survey requests are not mentioned.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：The campus operations officer gets the full version before the union sees the summary。完整报告先交校园运营主管，对应 B。学生会后看精简版。',
        en: 'Sentence 25: the operations officer gets the full version before the union sees the summary, matching B. The union receives the trimmed version later.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：First, electricity use in every teaching building on the meter list。测量用电，对应 A。',
        en: 'Sentence 27: the first indicator is "electricity use" in every teaching building, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：Second, printed paper, counted from department order records。测量打印纸，对应 B。',
        en: 'Sentence 28: the second indicator is "printed paper", counted from order records, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：Third, water consumption, read from the shared meter spreadsheet。测量用水量，对应 C。学生满意度属另一评审，停车与修车不打分。',
        en: 'Sentence 29: the third indicator is "water consumption", matching C. Student satisfaction belongs to another review; parking and bike repairs are not scored.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'The college’s last audit covered the whole campus, and our report ran to forty pages.' },
    { speaker: 'william', text: 'This year we should keep the sustainability audit tighter and easier to follow.' },
    { speaker: 'thomas', text: 'Right. First we need to decide what the audit actually covers.' },
    { speaker: 'william', text: 'The scope this time covers only the main teaching buildings, not the sports centre.' },
    { speaker: 'thomas', text: 'That keeps the numbers small enough for a student team to collect.' },
    { speaker: 'william', text: 'Next, where do our figures come from?' },
    { speaker: 'thomas', text: 'The main data source is the college’s energy bills over the past year.' },
    { speaker: 'william', text: 'We also ask departments to report how much paper they order each month.' },
    { speaker: 'thomas', text: 'Meter readings for water sit beside the bills in the same spreadsheet.' },
    { speaker: 'william', text: 'Once the numbers arrive, we weigh each indicator in the score.' },
    { speaker: 'thomas', text: 'Energy saving carries the highest weight, because it drives the biggest carbon cut.' },
    { speaker: 'william', text: 'Waste and water come next, with paper use counted under waste.' },
    { speaker: 'thomas', text: 'The report itself opens with a short summary for busy readers.' },
    { speaker: 'william', text: 'A later section lists recommendations for next term, with a clear owner for each.' },
    { speaker: 'thomas', text: 'Who sees the draft before it goes public?' },
    { speaker: 'william', text: 'The audit team checks the tables first, then the campus operations officer.' },
    { speaker: 'thomas', text: 'Does the student union receive a copy as well?' },
    { speaker: 'william', text: 'Yes, a trimmed version is shared with the union after the officer signs off.' },
    { speaker: 'thomas', text: 'So which buildings fall outside this year’s scope?' },
    { speaker: 'william', text: 'The sports centre and the student café are excluded, along with the old halls of residence.' },
    { speaker: 'thomas', text: 'Why does energy saving get the highest weight in the overall score?' },
    { speaker: 'william', text: 'Because cutting energy use reduces both the bills and the college’s carbon footprint.' },
    { speaker: 'thomas', text: 'Which indicator sits just behind energy in the weighting?' },
    { speaker: 'william', text: 'Waste, then water use, rather than anything to do with parking or travel.' },
    { speaker: 'thomas', text: 'Who receives the final report first?' },
    { speaker: 'william', text: 'The campus operations officer gets the full version before the union sees the summary.' },
    { speaker: 'thomas', text: 'Let’s list the indicators we will measure this year.' },
    { speaker: 'william', text: 'First, electricity use in every teaching building on the meter list.' },
    { speaker: 'thomas', text: 'Second, printed paper, counted from department order records.' },
    { speaker: 'william', text: 'Third, water consumption, read from the shared meter spreadsheet.' },
    { speaker: 'thomas', text: 'Should we ask students how satisfied they feel with the campus?' },
    { speaker: 'william', text: 'That survey belongs to the student experience review, not this sustainability audit.' },
    { speaker: 'thomas', text: 'What about outdoor parking and the number of car spaces?' },
    { speaker: 'william', text: 'Parking is a travel issue we note briefly, but it is not scored here.' },
    { speaker: 'thomas', text: 'Bicycle repairs at the campus stand do not enter the audit either.' },
    { speaker: 'william', text: 'We keep the measured list tight so the team can finish on time.' },
    { speaker: 'thomas', text: 'How many weeks do we have to collect the figures?' },
    { speaker: 'william', text: 'Three weeks for bills and meters, then one week to check the tables.' },
    { speaker: 'thomas', text: 'The spreadsheet splits columns by building and by month.' },
    { speaker: 'william', text: 'Any missing reading gets a note, not a guessed number.' },
    { speaker: 'thomas', text: 'The audit must compare against last year’s baseline.' },
    { speaker: 'william', text: 'We flag any building whose use rose against that baseline.' },
    { speaker: 'thomas', text: 'Charts show the trend over twelve months, not a single snapshot.' },
    { speaker: 'william', text: 'The recommendation section names one action per indicator.' },
    { speaker: 'thomas', text: 'Each action says whether it needs money, staff time or both.' },
    { speaker: 'william', text: 'The summary never hides a weak result behind positive wording.' },
    { speaker: 'thomas', text: 'Shall we book a short meeting with the operations officer?' },
    { speaker: 'william', text: 'I’ll send the request once the data draft is ready.' },
    { speaker: 'thomas', text: 'The audit team meets in the library seminar room on Wednesdays.' },
    { speaker: 'william', text: 'Bring last year’s report to that meeting for the baseline numbers.' },
    { speaker: 'thomas', text: 'Is there a public event where we present the findings?' },
    { speaker: 'william', text: 'Yes, a twenty-minute talk after the results are approved.' },
    { speaker: 'thomas', text: 'The union forum invites students to ask questions on the same evening.' },
    { speaker: 'william', text: 'We keep the technical tables in a handout rather than the talk itself.' },
    { speaker: 'thomas', text: 'Who calculates the final weighted score?' },
    { speaker: 'william', text: 'The operations officer signs off the method, but our team does the arithmetic.' },
    { speaker: 'thomas', text: 'Any rule about rounding the monthly totals?' },
    { speaker: 'william', text: 'We round to the nearest whole unit, and note the method in the appendix.' },
    { speaker: 'thomas', text: 'The old halls have no meter for heat, so their figures stay out of scope.' },
    { speaker: 'william', text: 'That matches our scope note for the excluded buildings.' },
    { speaker: 'thomas', text: 'If a bill arrives late, we chase the accounts office the same week.' },
    { speaker: 'william', text: 'Missing bills are marked pending until the account office replies.' },
    { speaker: 'thomas', text: 'The audit closes with an honest comparison to the target set in spring.' },
    { speaker: 'william', text: 'That target splits energy, waste and water into three equal aims.' },
    { speaker: 'thomas', text: 'We should record who collected each set of figures in the cover sheet.' },
    { speaker: 'william', text: 'Good practice, so anyone can trace the numbers back later.' },
    { speaker: 'thomas', text: 'I’ll draft the scope paragraph before our next Wednesday meeting.' },
    { speaker: 'william', text: 'And I will pull the energy bills from the shared drive tonight.' },
  ],
  vocabulary: [
    {
      term: 'audit', phonetic: '/ˈɔːdɪt/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '审计，核查（环境数据）', en: 'a systematic review of sustainability figures' },
      usage: { zh: '可数；the sustainability audit、run an audit。动词同形。', en: 'Countable: run an audit; it is also a verb.' },
      collocations: ['the sustainability audit', 'run an audit', 'the audit scope'],
      example: { en: 'This year the audit covers main teaching buildings.', zh: '今年审计只覆盖主教学楼。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɔː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'scope', phonetic: '/skəʊp/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '范围，涵盖边界', en: 'the set of buildings or items included' },
      usage: { zh: '不可数；the audit scope、in scope、out of scope。', en: 'Uncountable: in scope, out of scope.' },
      collocations: ['the audit scope', 'in scope', 'out of scope'],
      example: { en: 'The sports centre falls outside the scope.', zh: '体育中心不在范围内。' },
      listening: { zh: '单音节，与 hope 押韵。', en: 'One syllable, rhyming with hope.' },
    },
    {
      term: 'indicator', phonetic: '/ˈɪndɪkeɪtə/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '指标，衡量项', en: 'a measured factor scored in the review' },
      usage: { zh: '可数；the energy indicator、each indicator。', en: 'Countable: the energy indicator, each indicator.' },
      collocations: ['each indicator', 'the energy indicator', 'a measured indicator'],
      example: { en: 'Each indicator carries a different weight.', zh: '每项指标权重不同。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈɪn/。', en: 'Four syllables with stress on the first.' },
    },
    {
      term: 'weight', phonetic: '/weɪt/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '权重，分值占比', en: 'the importance given to one indicator' },
      usage: { zh: '不可数；the highest weight、carry a weight。', en: 'Uncountable: carry the highest weight.' },
      collocations: ['the highest weight', 'carry weight', 'the weighting order'],
      example: { en: 'Energy saving carries the highest weight.', zh: '节能指标权重最高。' },
      listening: { zh: '单音节，与 wait 同音。', en: 'One syllable, homophone of wait.' },
    },
    {
      term: 'baseline', phonetic: '/ˈbeɪslaɪn/', partOfSpeech: 'n.', sentenceIndex: 40,
      meaning: { zh: '基线，上年参照值', en: 'last year’s figures used as the comparison point' },
      usage: { zh: '可数；last year’s baseline、against the baseline。', en: 'Countable: against the baseline.' },
      collocations: ['last year’s baseline', 'against the baseline', 'the baseline year'],
      example: { en: 'Compare this year against the baseline.', zh: '今年与基线对照。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈbeɪs/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'consumption', phonetic: '/kənˈsʌmpʃn/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '消耗量（水电）', en: 'the amount of water or energy used' },
      usage: { zh: '不可数；water consumption、energy consumption。', en: 'Uncountable: water consumption, energy consumption.' },
      collocations: ['water consumption', 'energy consumption', 'lower consumption'],
      example: { en: 'Water consumption comes from meter readings.', zh: '用水量取自水表读数。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsʌmp/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'appendix', phonetic: '/əˈpendɪks/', partOfSpeech: 'n.', sentenceIndex: 57,
      meaning: { zh: '附录', en: 'the notes section at the back of the report' },
      usage: { zh: '可数，复数 appendices；in the appendix、the report appendix。', en: 'Countable, plural appendices: in the appendix.' },
      collocations: ['in the appendix', 'the report appendix', 'an appendix note'],
      example: { en: 'The method note sits in the appendix.', zh: '方法说明放在附录里。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈpen/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'signs off', sentenceIndex: 17,
      meaning: { zh: '签字批准，定稿通过', en: 'to approve the draft before release' },
      usage: { zh: '短语动词；the officer signs off the report、sign off on the method。', en: 'Sign off the report; compare sign off on the method.' },
      example: { en: 'The officer signs off after checking tables.', zh: '主管核对表格后签字批准。' },
    },
    {
      phrase: 'out of scope', sentenceIndex: 58,
      meaning: { zh: '不在审计范围内', en: 'not included in the audit boundaries' },
      usage: { zh: '固定短语；stay out of scope、out of the audit。反义 in scope。', en: 'Out of scope; the opposite is in scope.' },
      example: { en: 'The old halls stay out of scope.', zh: '旧宿舍不在范围内。' },
    },
    {
      phrase: 'drives the biggest carbon cut', sentenceIndex: 10,
      meaning: { zh: '带来最大幅度的削减', en: 'to cause the largest reduction in emissions' },
      usage: { zh: '动宾短语；drive the biggest carbon cut、drive savings。', en: 'Drive the biggest cut means lead the reduction.' },
      example: { en: 'Energy saving drives the biggest carbon cut.', zh: '节能带来最大的碳减排。' },
    },
    {
      phrase: 'trace the numbers back', sentenceIndex: 65,
      meaning: { zh: '追溯（数据来源）', en: 'to follow a figure back to its original record' },
      usage: { zh: '短语动词；trace the numbers back、trace back to the bills。', en: 'Trace back means follow to the source record.' },
      example: { en: 'Anyone can trace the numbers back later.', zh: '之后任何人都能追溯数据。' },
    },
    {
      phrase: 'splits columns by', sentenceIndex: 38,
      meaning: { zh: '按……分列，划分', en: 'to divide columns according to a category' },
      usage: { zh: '被动短语；split by building、split by month。', en: 'Split by building or month; compare divide into.' },
      example: { en: 'The spreadsheet splits columns by building.', zh: '表格按建筑分列。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对按审计环节归类', en: 'Match term to audit stage' },
      body: {
        zh: '配对四题先认环节：范围只含主教学楼，来源是能源账单，权重给节能最高分，报告章节列下学期建议。分享给学生会是流程后续，不是章节描述。',
        en: 'Read the stage first: scope covers main buildings, source is energy bills, weight favours energy, section lists recommendations. Sharing with the union is a later step, not a section description.',
      },
    },
    {
      title: { zh: '排除项与纳入项对照', en: 'Contrast excluded and included' },
      body: {
        zh: '排除的是体育中心、咖啡馆、旧宿舍；纳入的是主教学楼。单选题问被排除建筑时，别把纳入范围的教学楼当成答案。',
        en: 'Excluded are sports centre, café and old halls; included are main teaching buildings. For the exclusion question, do not choose an included building.',
      },
    },
    {
      title: { zh: '多选剔除非审计指标', en: 'Remove non-audit indicators' },
      body: {
        zh: '三项测量是用电、打印纸、用水量。学生满意度属另一评审，停车是出行问题只作备注，修车不进入审计。多选先把这些类别划掉。',
        en: 'The three measured items are electricity, printed paper and water. Satisfaction belongs to another review, parking is a travel note, and bike repairs are outside. Remove those categories first.',
      },
    },
  ],
};
