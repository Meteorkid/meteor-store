import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 50 · Part 3 — 偏远岛屿研究讨论（两名学生）。原创仿真材料，非官方真题。
 *
 * 分工讨论在前半段（配对 21–24），可达性、样本量与长期监测目的在中段（单选 25–27），
 * 必记生态指标在后半段（多选 28–30）。题块顺序与录音顺序一致。
 */
export const test50Part3: ListeningLesson = {
  slug: 'test-50-part-3',
  part: 3,
  status: 'published',
  title: { zh: '偏远岛屿研究讨论', en: 'Discussing a study on remote islands' },
  summary: {
    zh: '两名学生讨论偏远岛屿生态研究：各自承担行程记录、样本清点、与大陆样点对比和多年指标跟踪；分析岛屿可达性困难、小样本试点的原因与长期监测目的，并确定要记录的三项生态指标。',
    en: 'Two students plan a remote island ecology study: one records travel distances and times, one checks usable sample counts, one compares island samples with mainland sites, and one tracks indicators over years. They discuss access difficulties, the pilot sample size and the purpose of long-term monitoring, then agree on three ecological indicators to record.',
  },
  accent: { zh: 'Clara 为加拿大口音，Andrew 为美式口音。', en: 'Clara speaks with a Canadian accent and Andrew with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'clara', label: 'CLARA', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'andrew', label: 'ANDREW', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which task has each person taken on in the study plan? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'compare the island samples with mainland sites' },
        { key: 'B', text: 'note the distance and travel time to each island' },
        { key: 'C', text: 'track the same indicators over several years' },
        { key: 'D', text: 'check the number of usable samples per site' },
        { key: 'E', text: 'write the section on island weather' },
      ],
      items: [
        { number: 21, text: 'Clara' },
        { number: 22, text: 'Clara' },
        { number: 23, text: 'Andrew' },
        { number: 24, text: 'Andrew' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What is the main difficulty in reaching the study sites?',
          options: [
            { key: 'A', text: 'The islands are hard to reach and trips depend on the weather.' },
            { key: 'B', text: 'The local ferry runs only in summer months.' },
            { key: 'C', text: 'The team has to fly between each island.' },
          ],
        },
        {
          number: 26,
          stem: 'Why does the team keep the sample size small at first?',
          options: [
            { key: 'A', text: 'To avoid damaging fragile island plants.' },
            { key: 'B', text: 'To check that the collection method works before scaling up.' },
            { key: 'C', text: 'To keep the travel budget as low as possible.' },
          ],
        },
        {
          number: 27,
          stem: 'What is the purpose of long-term monitoring?',
          options: [
            { key: 'A', text: 'To record how ecological indicators change over time.' },
            { key: 'B', text: 'To visit each island only once for comparison.' },
            { key: 'C', text: 'To replace the original mainland survey.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE ecological indicators will the team record? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE ecological indicators will the team record?',
      options: [
        { key: 'A', text: 'bird nesting counts' },
        { key: 'B', text: 'soil acidity' },
        { key: 'C', text: 'flowering dates' },
        { key: 'D', text: 'island ferry timetables' },
        { key: 'E', text: 'hotel guest numbers' },
        { key: 'F', text: 'local radio schedules' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：I will note the distance and travel time to each island, since that decides how often we can go back。Clara 负责记录各岛距离与行程时间，对应 B。',
        en: 'Sentence 4: "I will note the distance and travel time to each island, since that decides how often we can go back". Clara records distance and travel time, matching B.',
      },
    },
    {
      number: 22, accepted: ['D'], evidence: 6,
      explanation: {
        zh: '定位句 6：I also need to check the number of usable samples per site, once the fieldwork returns。Clara 清点每个样点可用样本数量，对应 D。',
        en: 'Sentence 6: "I also need to check the number of usable samples per site, once the fieldwork returns". Clara checks usable sample counts per site, matching D.',
      },
    },
    {
      number: 23, accepted: ['A'], evidence: 9,
      explanation: {
        zh: '定位句 9：Then I can compare the island samples with those mainland sites in my section。Andrew 负责把岛屿样本与大陆样点对比，对应 A。',
        en: 'Sentence 9: "Then I can compare the island samples with those mainland sites in my section". Andrew compares island samples with mainland sites, matching A.',
      },
    },
    {
      number: 24, accepted: ['C'], evidence: 11,
      explanation: {
        zh: '定位句 11：I will track the same indicators over several years, so the trends are visible。Andrew 多年跟踪同一组指标，对应 C。E 的天气章节在句 12 被明确排除。',
        en: 'Sentence 11: "I will track the same indicators over several years, so the trends are visible". Andrew tracks the same indicators over years, matching C. The weather section in E is explicitly excluded in sentence 12.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 14,
      explanation: {
        zh: '定位句 14：The islands are hard to reach, and every trip depends on the weather and the tide。岛屿难达、行程受天气潮汐制约，对应 A。句 16 否定轮渡仅限夏季，句 17 否定岛间飞行。',
        en: 'Sentence 14: "The islands are hard to reach, and every trip depends on the weather and the tide". Access is difficult and trips depend on weather and tide, matching A. Sentence 16 rules out a summer-only ferry, and sentence 17 rules out island flights.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：The first round checks that the collection method works before we scale up。小样本是为先验证采集方法再扩大规模，对应 B。句 22 说明保护植物不是本次样本量的原因，句 24 否定预算驱动。',
        en: 'Sentence 20: "The first round checks that the collection method works before we scale up". The small pilot validates the method before expansion, matching B. Sentence 22 says plant protection is not the reason, and sentence 24 rules out the budget.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：It records how the ecological indicators change over the years。长期监测记录生态指标逐年变化，对应 A。句 28 否定只访一次，句 30 说明大陆调查保留作对照。',
        en: 'Sentence 26: "It records how the ecological indicators change over the years". Long-term monitoring tracks indicators over time, matching A. Sentence 28 rules out a single visit, and sentence 30 keeps the mainland survey as comparison.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：First, bird nesting counts, because they show how the breeding colonies use the islands。鸟群筑巢计数是指标之一，对应 A。',
        en: 'Sentence 32: "First, bird nesting counts, because they show how the breeding colonies use the islands". Bird nesting counts are an indicator, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 33,
      explanation: {
        zh: '定位句 33：Second, soil acidity, which tells us about the ground conditions under the plants。土壤酸度是第二项指标，对应 B。',
        en: 'Sentence 33: "Second, soil acidity, which tells us about the ground conditions under the plants". Soil acidity is the second indicator, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 34,
      explanation: {
        zh: '定位句 34：Third, flowering dates, to compare when plants open across the years。开花日期是第三项指标，对应 C。D 的轮渡时刻、E 的酒店客数、F 的广播时间表在句 35–40 被排除。',
        en: 'Sentence 34: "Third, flowering dates, to compare when plants open across the years". Flowering dates are the third indicator, matching C. Ferry timetables, hotel guest numbers and radio schedules in D, E and F are excluded in sentences 35 to 40.',
      },
    },
  ],
  transcript: [
    { speaker: 'clara', text: 'Shall we start with the remote islands study you chose for our report?' },
    { speaker: 'andrew', text: 'Yes, I have read the first draft, and the site list still needs tightening.' },
    { speaker: 'clara', text: 'Let us go through what each of us will cover before we meet the tutor.' },
    { speaker: 'andrew', text: 'First the access side. How do we reach each of the selected islands?' },
    { speaker: 'clara', text: 'I will note the distance and travel time to each island, since that decides how often we can go back.' },
    { speaker: 'andrew', text: 'Right. The crossings are rough, so the schedule depends on sea conditions.' },
    { speaker: 'clara', text: 'I also need to check the number of usable samples per site, once the fieldwork returns.' },
    { speaker: 'andrew', text: 'Why does that matter before the analysis?' },
    { speaker: 'clara', text: 'It tells us which islands have enough material to compare with the mainland sites.' },
    { speaker: 'andrew', text: 'Then I can compare the island samples with those mainland sites in my section.' },
    { speaker: 'clara', text: 'Good, that leaves the longer observation side to you.' },
    { speaker: 'andrew', text: 'I will track the same indicators over several years, so the trends are visible.' },
    { speaker: 'clara', text: 'We should avoid writing a separate section on island weather; the tutor asked for ecology only.' },
    { speaker: 'andrew', text: 'Agreed. Now what makes these sites hard to work on?' },
    { speaker: 'clara', text: 'The islands are hard to reach, and every trip depends on the weather and the tide.' },
    { speaker: 'andrew', text: 'Is the ferry limited to a particular season?' },
    { speaker: 'clara', text: 'It runs year round, but rough seas can cancel the crossing at short notice.' },
    { speaker: 'andrew', text: 'So the team cannot simply fly between the islands either; there are no small air services.' },
    { speaker: 'clara', text: 'Correct. Each visit has to be planned around the boat schedule.' },
    { speaker: 'andrew', text: 'Why did we keep the sample size small at this stage?' },
    { speaker: 'clara', text: 'The first round checks that the collection method works before we scale up.' },
    { speaker: 'andrew', text: 'Is it about protecting fragile plants on the islands?' },
    { speaker: 'clara', text: 'That matters generally, but this small sample is a pilot, not a conservation limit.' },
    { speaker: 'andrew', text: 'And the budget does not drive the sample choice?' },
    { speaker: 'clara', text: 'Correct. The method check comes first; spending follows once the pilot works.' },
    { speaker: 'andrew', text: 'What will the long term monitoring be for?' },
    { speaker: 'clara', text: 'It records how the ecological indicators change over the years.' },
    { speaker: 'andrew', text: 'So each island is revisited rather than surveyed once?' },
    { speaker: 'clara', text: 'Exactly. A single visit cannot show whether a population is rising or falling.' },
    { speaker: 'andrew', text: 'The original mainland survey stays as the comparison base, then?' },
    { speaker: 'clara', text: 'Yes, we do not replace it; the islands are added beside it.' },
    { speaker: 'andrew', text: 'Let us settle the indicators we will record on site.' },
    { speaker: 'clara', text: 'First, bird nesting counts, because they show how the breeding colonies use the islands.' },
    { speaker: 'andrew', text: 'Second, soil acidity, which tells us about the ground conditions under the plants.' },
    { speaker: 'clara', text: 'Third, flowering dates, to compare when plants open across the years.' },
    { speaker: 'andrew', text: 'What about the ferry timetables we collected for access?' },
    { speaker: 'clara', text: 'Those belong to the logistics section, not the ecological indicators.' },
    { speaker: 'andrew', text: 'The hotel guest numbers from the local resort?' },
    { speaker: 'clara', text: 'Leave those out; they have nothing to do with the island ecology.' },
    { speaker: 'andrew', text: 'And the local radio schedules I copied for travel updates?' },
    { speaker: 'clara', text: 'Background only. They do not go on the indicator list.' },
    { speaker: 'andrew', text: 'Do we need to record the sea temperature near the shore?' },
    { speaker: 'clara', text: 'Only if it changes the nesting pattern; otherwise keep to the three agreed measures.' },
    { speaker: 'andrew', text: 'When is the draft due to the tutor?' },
    { speaker: 'clara', text: 'By the end of next week, so we can revise after her comments.' },
    { speaker: 'andrew', text: 'I will send my mainland comparison notes before the Wednesday meeting.' },
    { speaker: 'clara', text: 'I will summarise the travel details and sample counts in one table.' },
    { speaker: 'andrew', text: 'Who will draw the map of the island sites?' },
    { speaker: 'clara', text: 'The tutor assistant can supply the base map; we mark the visited points on it.' },
    { speaker: 'andrew', text: 'Should we interview any island residents?' },
    { speaker: 'clara', text: 'Not for this report; the ecology data comes from our own field visits.' },
    { speaker: 'andrew', text: 'What if a site turns out to be too small to sample?' },
    { speaker: 'clara', text: 'We note it as inaccessible and explain why, rather than forcing weak data in.' },
    { speaker: 'andrew', text: 'Do the students from the other group share our island list?' },
    { speaker: 'clara', text: 'No, their coast study uses mainland reserves, so the sets do not overlap.' },
    { speaker: 'andrew', text: 'How will we present the long term trends in the report?' },
    { speaker: 'clara', text: 'A simple chart per indicator, with the islands shown as separate lines.' },
    { speaker: 'andrew', text: 'We should label the axes clearly, since the report will be read outside our group.' },
    { speaker: 'clara', text: 'Yes, and each line needs the year range it covers.' },
    { speaker: 'andrew', text: 'Anything else before we email the draft?' },
    { speaker: 'clara', text: 'Check that every sample has a site code and the date it was collected.' },
    { speaker: 'andrew', text: 'I will also include the weather condition on the day of each visit, as context.' },
    { speaker: 'clara', text: 'That is fine, as long as it stays a note beside the main indicator.' },
    { speaker: 'andrew', text: 'Let us meet after the tutor session to divide the remaining writing.' },
    { speaker: 'clara', text: 'Good. I will bring the pilot data from the first island trip.' },
    { speaker: 'andrew', text: 'And I will bring the mainland records for comparison.' },
    { speaker: 'clara', text: 'Perfect. We can start the analysis section after that.' },
  ],
  vocabulary: [
    {
      term: 'remote', phonetic: '/rɪˈməʊt/', partOfSpeech: 'adj.', sentenceIndex: 0,
      meaning: { zh: '偏远的，偏僻的', en: 'far from towns, roads or other settlements' },
      usage: { zh: '形容词；remote islands、remote area，与 isolated 近义。', en: 'Adjective: remote islands, a remote area; similar to isolated.' },
      collocations: ['remote islands', 'a remote site', 'remote locations'],
      example: { en: 'The study covers several remote islands.', zh: '研究覆盖几座偏远岛屿。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈməʊ/，开头 /rɪ/ 弱读。', en: 'Two syllables with stress on the second; the opening /rɪ/ is weak.' },
    },
    {
      term: 'access', phonetic: '/ˈækses/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '可达性，进入便利程度', en: 'how easy or difficult it is to reach and enter a place' },
      usage: { zh: '不可数名词；access side 指可达性分析，形容词 accessible。', en: 'Uncountable; the access side analyses reachability; the adjective is accessible.' },
      collocations: ['the access side', 'site accessibility', 'easy accessibility'],
      example: { en: 'Access to the islands depends on sea conditions.', zh: '前往岛屿取决于海况。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈbɪl/，开头 ac 弱读。', en: 'Five syllables with stress on the fourth; the opening ac is weak.' },
    },
    {
      term: 'samples', phonetic: '/ˈsɑːmplz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '样本，样品', en: 'a small amount collected to represent a whole site' },
      usage: { zh: '可数名词；usable samples、sample size，动词 sample。', en: 'Countable: usable samples, sample size; the verb is sample.' },
      collocations: ['usable samples', 'the sample size', 'per site'],
      example: { en: 'We check the number of usable samples per site.', zh: '我们清点每个样点的可用样本数。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɑː/，结尾 /pl/。', en: 'Two syllables with first-syllable stress and the ending /pl/.' },
    },
    {
      term: 'indicators', phonetic: '/ˈɪndɪkeɪtəz/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '指标，指示要素', en: 'a measure used to show the state of an ecosystem' },
      usage: { zh: '可数名词；ecological indicators，动词 indicate。', en: 'Countable: ecological indicators; the verb is indicate.' },
      collocations: ['the same indicators', 'ecological indicators', 'track an indicator'],
      example: { en: 'We track the same indicators over several years.', zh: '我们多年跟踪同一组指标。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈɪn/，结尾 /keɪtə/。', en: 'Four syllables with first-syllable stress and the ending /keɪtə/.' },
    },
    {
      term: 'pilot', phonetic: '/ˈpaɪlət/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '试点，小规模先行试验', en: 'a small first round testing a method before full work' },
      usage: { zh: '可数名词；pilot study、pilot data，此处不指飞行员。', en: 'Countable: a pilot study, pilot data; not the aircraft meaning here.' },
      collocations: ['a pilot', 'the pilot data', 'a pilot study'],
      example: { en: 'This small sample is a pilot, not a conservation limit.', zh: '这个小样本是试点，不是保护限额。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpaɪ/，双元音。', en: 'Two syllables with first-syllable stress and a diphthong.' },
    },
    {
      term: 'monitoring', phonetic: '/ˈmɒnɪtərɪŋ/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '监测，长期跟踪观察', en: 'regular recording of measures over time to spot changes' },
      usage: { zh: '不可数名词；long term monitoring，动词 monitor。', en: 'Uncountable: long term monitoring; the verb is monitor.' },
      collocations: ['long term monitoring', 'ecological monitoring', 'monitoring records'],
      example: { en: 'Monitoring records how indicators change over the years.', zh: '监测记录指标逐年变化。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈmɒ/，结尾 /ɪŋ/。', en: 'Three syllables with first-syllable stress and the ending /ɪŋ/.' },
    },
    {
      term: 'acidity', phonetic: '/əˈsɪdəti/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '酸度', en: 'the level of acid in soil or water' },
      usage: { zh: '不可数名词；soil acidity，形容词 acidic，名词 acid。', en: 'Uncountable: soil acidity; the adjective is acidic, the noun acid.' },
      collocations: ['soil acidity', 'the acidity level', 'measure acidity'],
      example: { en: 'Soil acidity shows the ground conditions under the plants.', zh: '土壤酸度反映植物下方的地面条件。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈsɪ/，开头 ə 弱读。', en: 'Four syllables with stress on the second; the opening ə is weak.' },
    },
  ],
  expressions: [
    {
      phrase: 'go through', sentenceIndex: 2,
      meaning: { zh: '逐条讨论，过一遍', en: 'to review items one by one in a meeting' },
      usage: { zh: '及物短语动词；go through the tasks、go through the list。', en: 'Transitive phrasal verb: go through the tasks, go through the list.' },
      example: { en: 'Let us go through what each of us will cover.', zh: '我们逐条过一遍各自负责的部分。' },
    },
    {
      phrase: 'scale up', sentenceIndex: 20,
      meaning: { zh: '扩大规模', en: 'to run the study on a larger scale after the pilot' },
      usage: { zh: '短语动词；与 scale down 相对，名词 scale up。', en: 'Phrasal verb, opposite to scale down; the noun is a scale up.' },
      example: { en: 'The method is checked before we scale up.', zh: '方法验证之后再扩大规模。' },
    },
    {
      phrase: 'rising or falling', sentenceIndex: 28,
      meaning: { zh: '上升或下降（种群趋势）', en: 'whether a population is increasing or decreasing' },
      usage: { zh: '趋势描述；a population is rising or falling，同 up or down。', en: 'Trend description: a population is rising or falling, like up or down.' },
      example: { en: 'A single visit cannot show whether a population is rising or falling.', zh: '只访一次看不出种群是升是降。' },
    },
    {
      phrase: 'settle the indicators', sentenceIndex: 31,
      meaning: { zh: '敲定记录指标', en: 'to agree on the measures to be recorded' },
      usage: { zh: 'settle 在此为商定；settle the checklist、settle the plan。', en: 'Settle means agree on here: settle the checklist, settle the plan.' },
      example: { en: 'Let us settle the indicators we will record on site.', zh: '我们敲定现场要记录的指标。' },
    },
    {
      phrase: 'leave those out', sentenceIndex: 38,
      meaning: { zh: '把那些排除在外', en: 'to not include certain items in the list' },
      usage: { zh: 'leave out 及物短语动词；宾语可放中间，同义 exclude。', en: 'Leave out is transitive; the object can sit in the middle, like exclude.' },
      example: { en: 'Leave the hotel numbers out of the ecology list.', zh: '把酒店客数排除在生态清单外。' },
    },
    {
      phrase: 'overlap', sentenceIndex: 54,
      meaning: { zh: '重叠，重合（样点清单）', en: 'to share the same sites or data between two groups' },
      usage: { zh: '动词/名词；sets do not overlap，两组清单不重合。', en: 'Verb or noun: sets do not overlap means the lists share no sites.' },
      example: { en: 'Our island list and their mainland reserves do not overlap.', zh: '我们的岛屿清单和他们的大陆保护区不重合。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先听分工动词', en: 'Listen for the task verbs in matching' },
      body: {
        zh: '配对四题对应四个动作：note、check、compare、track。听到 I will 这类表态句时，把说话人和后面的动作一起记下，再去匹配 A–E 的任务描述；天气章节是被排除的干扰项。',
        en: 'The four matching items turn on note, check, compare and track. When you hear I will, record the speaker and the action together, then match it to A–E. The weather section is the excluded distractor.',
      },
    },
    {
      title: { zh: '被排除的内容不是记录指标', en: 'Rejected items are not indicators' },
      body: {
        zh: '多选三题要找真正的生态指标。轮渡时刻、酒店客数、广播时间表都被明确归到后勤或背景，听到 belong to、leave out、background only 时划掉对应选项。',
        en: 'The multiple choice asks for genuine ecological indicators. Ferry timetables, hotel numbers and radio schedules are logistics or background. Cross out an option when you hear belong to, leave out or background only.',
      },
    },
    {
      title: { zh: '原因题区分主因与一般顾虑', en: 'Separate the main reason from general concerns' },
      body: {
        zh: '样本量小的主因是先验证采集方法；保护脆弱植物、控制预算都在问答中被否定。选项出现这类一般顾虑时，回定位句确认它是不是被说话人排除。',
        en: 'The main reason for the small sample is validating the collection method; protecting plants and limiting the budget are rejected in the exchanges. When such general concerns appear as options, check the locating sentence to see whether the speaker ruled them out.',
      },
    },
  ],
};
