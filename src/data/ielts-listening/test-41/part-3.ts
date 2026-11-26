import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 41 · Part 3 — 三人准备空气质量报告。原创仿真材料，非官方真题。
 *
 * 讨论顺序：分工认领（配对 21–24）→ 监测点布点原则 → 多来源交叉核对 → 限值标准对比 →
 * 结论措辞（单选 25–27）→ 三类数据源（多选 28–30）→ 会后分工与截止时间。
 * 配对块在前，单选居中，多选在后，题块顺序与录音顺序一致。
 */
export const test41Part3: ListeningLesson = {
  slug: 'test-41-part-3',
  part: 3,
  status: 'published',
  title: { zh: '准备空气质量报告', en: 'Preparing a report on air quality' },
  summary: {
    zh: '三名学生合作撰写空气质量报告：Neerja 先认领监测点选址、后做图表地图，Ryan 核对数据来源可靠性，Aria 把读数对照官方限值标准；随后讨论布点应均衡覆盖住宅、路边与工业区，多来源交叉核对以防漏掉局部高峰，结论须谨慎并限定在实测时段内；最后确定固定站读数、便携传感器读数与同期天气记录三类数据源，并安排会后分工与截止时间。',
    en: 'Three students prepare an air quality report: Neerja takes site selection then the charts, Ryan checks source reliability, Aria compares readings with thresholds. They discuss even zone coverage, cross-checking sources to catch local spikes, cautious conclusions tied to the measured period, then agree on fixed stations, portable sensors and matching weather records, and split follow-up work.',
  },
  accent: { zh: 'Neerja 为印度口音，Ryan 为英式口音，Aria 为美式口音。', en: 'Neerja has an Indian accent, Ryan a British accent, and Aria an American accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'ryan', label: 'RYAN', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which part of the report does each person take on? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'Selects the monitoring sites across the district.' },
        { key: 'B', text: 'Checks the data sources and their reliability.' },
        { key: 'C', text: 'Compares readings against official threshold standards.' },
        { key: 'D', text: 'Designs the charts and maps for the report.' },
        { key: 'E', text: 'Writes the final conclusions and recommendations.' },
      ],
      items: [
        { number: 21, text: 'Neerja' },
        { number: 22, text: 'Ryan' },
        { number: 23, text: 'Aria' },
        { number: 24, text: 'Neerja' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Where should monitoring sites be placed?',
          options: [
            { key: 'A', text: 'All near the town centre for easy access.' },
            { key: 'B', text: 'Across residential, roadside and industrial zones evenly.' },
            { key: 'C', text: 'Only beside the busiest roads where pollution peaks.' },
          ],
        },
        {
          number: 26,
          stem: 'Why should readings be cross-checked across sources?',
          options: [
            { key: 'A', text: 'A single source can miss a local spike.' },
            { key: 'B', text: 'It doubles the number of figures to display.' },
            { key: 'C', text: 'It lets the report choose the lowest reading.' },
          ],
        },
        {
          number: 27,
          stem: 'How should the report conclusions be written?',
          options: [
            { key: 'A', text: 'As general predictions for the next year.' },
            { key: 'B', text: 'As recommendations made before the data arrives.' },
            { key: 'C', text: 'Cautiously, tied to the measured period.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE sources will the report rely on? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE sources will the report rely on?',
      options: [
        { key: 'A', text: 'fixed station readings' },
        { key: 'B', text: 'portable sensor readings' },
        { key: 'C', text: 'weather records' },
        { key: 'D', text: 'social media complaints' },
        { key: 'E', text: 'neighbourhood surveys' },
        { key: 'F', text: 'traffic camera footage' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：I will take the first section, choosing where the monitoring sites go across the district。Neerja 认领监测点选址，对应 A。',
        en: 'Sentence 3: "I will take the first section, choosing where the monitoring sites go across the district". Neerja takes site selection, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：My part is checking the data sources, so we know each figure comes from a reliable instrument。Ryan 负责核对数据来源可靠性，对应 B。',
        en: 'Sentence 4: "My part is checking the data sources, so we know each figure comes from a reliable instrument". Ryan checks source reliability, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 5,
      explanation: {
        zh: '定位句 5：I will compare the readings against the official threshold standards for each pollutant。Aria 负责对照限值标准，对应 C。',
        en: 'Sentence 5: "I will compare the readings against the official threshold standards for each pollutant". Aria compares readings with thresholds, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 6,
      explanation: {
        zh: '定位句 6：That leaves the charts and maps to me once the numbers are ready。Neerja 第二次发言认领图表与地图设计，对应 D。',
        en: 'Sentence 6: "That leaves the charts and maps to me once the numbers are ready". Neerja’s second task is the charts and maps, matching D.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 10,
      explanation: {
        zh: '定位句 10：So the sites should cover residential, roadside and industrial zones as evenly as possible。布点要均衡覆盖住宅、路边与工业区，对应 B。A 的全放中心与句 11 的背景对照点相悖，C 的只放主干道与均衡覆盖相反。',
        en: 'Sentence 10: "So the sites should cover residential, roadside and industrial zones as evenly as possible". Even zone coverage matches B. Centre-only placement contradicts the background site in sentence 11, and roadside-only placement contradicts even coverage.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：A single source can miss a local spike on a particular afternoon。交叉核对是为防单一来源漏掉局部高峰，对应 A。B 的翻倍展示数字与 C 的挑最低读数在录音中均未出现。',
        en: 'Sentence 18: "A single source can miss a local spike on a particular afternoon". Cross-checking catches a missed local spike, matching A. Doubling displayed figures and choosing the lowest reading are not mentioned.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：The conclusions must be cautious and tied to the period we actually measured。结论须谨慎并限定在实测时段内，对应 C。A 的年度预测与句 30 的不可外推相反，B 的数据到达前先下建议在录音中被否定。',
        en: 'Sentence 29: "The conclusions must be cautious and tied to the period we actually measured". Cautious, period-bound conclusions match C. Next-year predictions contradict the no-generalisation point, and recommendations before the data are ruled out.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 35,
      explanation: {
        zh: '定位句 35：The first source is the fixed station readings, collected day by day across the district。第一类数据源是固定站读数，对应 A。',
        en: 'Sentence 35: "The first source is the fixed station readings, collected day by day across the district". The first agreed source is fixed station readings, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：The second source is the portable sensor readings from our street walks。第二类是便携传感器读数，对应 B。',
        en: 'Sentence 36: "The second source is the portable sensor readings from our street walks". The second agreed source is portable sensor readings, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 37,
      explanation: {
        zh: '定位句 37：The third source is the weather records for the same dates and wind conditions。第三类是同期天气记录，对应 C。',
        en: 'Sentence 37: "The third source is the weather records for the same dates and wind conditions". The third agreed source is weather records, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'neerja', text: 'Thanks for making time to finish the air quality report before Friday.' },
    { speaker: 'ryan', text: 'Happy to. We should agree on who covers which part before we split the work.' },
    { speaker: 'aria', text: 'The report pulls together monitoring data, standards and a short written conclusion.' },
    { speaker: 'neerja', text: 'I will take the first section, choosing where the monitoring sites go across the district.' },
    { speaker: 'ryan', text: 'My part is checking the data sources, so we know each figure comes from a reliable instrument.' },
    { speaker: 'aria', text: 'I will compare the readings against the official threshold standards for each pollutant.' },
    { speaker: 'neerja', text: 'That leaves the charts and maps to me once the numbers are ready.' },
    { speaker: 'ryan', text: 'Before we go further, let us agree how the sites should be chosen.' },
    { speaker: 'neerja', text: 'The district has residential streets, busy roads and a small industrial edge.' },
    { speaker: 'aria', text: 'If all sensors sit near the centre, the report will miss the differences between those areas.' },
    { speaker: 'ryan', text: 'So the sites should cover residential, roadside and industrial zones as evenly as possible.' },
    { speaker: 'neerja', text: 'We also need a background site away from any obvious local source, for comparison.' },
    { speaker: 'aria', text: 'Each site should be labelled with its type and the month it was first read.' },
    { speaker: 'ryan', text: 'Next, the data sources behind the readings we will show.' },
    { speaker: 'neerja', text: 'The fixed stations run continuously, so they give a steady daily record.' },
    { speaker: 'ryan', text: 'Portable sensors are carried between streets, which catches hot spots the fixed stations miss.' },
    { speaker: 'aria', text: 'Weather records matter too, because wind and rain change how pollution spreads.' },
    { speaker: 'ryan', text: 'We should cross-check each source against the others, rather than trust one instrument alone.' },
    { speaker: 'neerja', text: 'A single source can miss a local spike on a particular afternoon.' },
    { speaker: 'aria', text: 'If two sources disagree, we note the gap instead of picking the nicer number.' },
    { speaker: 'ryan', text: 'The portable readings are less precise, so their limits should be stated in the methods section.' },
    { speaker: 'neerja', text: 'Good. Now how do the readings line up with the threshold standards?' },
    { speaker: 'aria', text: 'Each pollutant has an official threshold, a level above which health risk rises.' },
    { speaker: 'ryan', text: 'We compare the measured average with that threshold over the same period.' },
    { speaker: 'aria', text: 'A reading above the threshold does not prove a health problem on its own.' },
    { speaker: 'neerja', text: 'It means the area needs closer watching, not an immediate warning to residents.' },
    { speaker: 'ryan', text: 'We should mark any short exceedance separately from a repeat seasonal pattern.' },
    { speaker: 'aria', text: 'That distinction keeps the report honest rather than alarming on one bad day.' },
    { speaker: 'neerja', text: 'Now the conclusions. What should the final summary say?' },
    { speaker: 'ryan', text: 'The conclusions must be cautious and tied to the period we actually measured.' },
    { speaker: 'aria', text: 'We should not generalise beyond the data, or claim a trend we have not tracked.' },
    { speaker: 'neerja', text: 'If the record covers only summer months, the report must say so plainly.' },
    { speaker: 'ryan', text: 'Recommendations should follow from the findings, not from what we hope to see.' },
    { speaker: 'aria', text: 'That means naming what could be checked again next season, rather than closing the case.' },
    { speaker: 'neerja', text: 'Let us list the sources the report will rely on for the charts.' },
    { speaker: 'ryan', text: 'The first source is the fixed station readings, collected day by day across the district.' },
    { speaker: 'aria', text: 'The second source is the portable sensor readings from our street walks.' },
    { speaker: 'neerja', text: 'The third source is the weather records for the same dates and wind conditions.' },
    { speaker: 'ryan', text: 'What about the other ideas people mentioned in the planning notes?' },
    { speaker: 'aria', text: 'Social media complaints are listed, but they report smell and irritation, not measured pollution.' },
    { speaker: 'neerja', text: 'Neighbourhood surveys ask how people feel, so they cannot stand in for instrument data.' },
    { speaker: 'ryan', text: 'Traffic camera footage shows queue lengths, but it does not measure the air itself.' },
    { speaker: 'aria', text: 'So those three instrument-based sources are the ones the report will cite.' },
    { speaker: 'neerja', text: 'I will map each monitoring site and note the zone it represents.' },
    { speaker: 'ryan', text: 'I will verify the station maintenance dates before we use any fixed reading.' },
    { speaker: 'aria', text: 'I will prepare the threshold comparison table for each pollutant type.' },
    { speaker: 'neerja', text: 'Who turns the numbers into the report charts?' },
    { speaker: 'aria', text: 'That was my section earlier, but Neerja has taken the maps and charts since then.' },
    { speaker: 'ryan', text: 'Fine. Neerja drafts the visuals, and Aria checks the standards side.' },
    { speaker: 'neerja', text: 'I will keep the charts simple, one pollutant per map, so readers can follow them.' },
    { speaker: 'ryan', text: 'Avoid putting too many colours on one map, or the message gets lost.' },
    { speaker: 'aria', text: 'The report also needs a short methods note explaining how the sensors were placed.' },
    { speaker: 'neerja', text: 'We should record any site that was out of service for part of the month.' },
    { speaker: 'ryan', text: 'If a station failed, we mark the missing days rather than filling them with estimates.' },
    { speaker: 'aria', text: 'Good. Estimated readings would weaken the comparison with the threshold standards.' },
    { speaker: 'neerja', text: 'What about the visual format for the conclusions?' },
    { speaker: 'ryan', text: 'A short summary table works best, with the main finding and its evidence beside it.' },
    { speaker: 'aria', text: 'We can add a simple bar chart for the worst reading each zone reached.' },
    { speaker: 'neerja', text: 'Please do not hide an exceedance because the overall average looks acceptable.' },
    { speaker: 'ryan', text: 'Honesty about the bad days matters more than a tidy average for the report.' },
    { speaker: 'aria', text: 'Before the draft, let us check the deadline and the document length.' },
    { speaker: 'neerja', text: 'The draft is due by Friday afternoon, ahead of the tutor meeting on Monday.' },
    { speaker: 'ryan', text: 'Each section should stay under four pages, so the whole report reads quickly.' },
    { speaker: 'aria', text: 'We will circulate the draft by email on Thursday for last minute comments.' },
    { speaker: 'neerja', text: 'If any reading looks unusual, we flag it in the notes rather than deleting it.' },
    { speaker: 'ryan', text: 'An outlier can be explained later; removing it silently would break the data trail.' },
    { speaker: 'aria', text: 'That covers sites, sources, standards, visuals and conclusions.' },
    { speaker: 'neerja', text: 'I will start the site map and send it to Ryan for a source check.' },
    { speaker: 'ryan', text: 'I will reply with any station records that need a closer look.' },
    { speaker: 'aria', text: 'And I will hold the threshold table until the charts are ready to compare.' },
    { speaker: 'neerja', text: 'I think that is enough to keep everyone busy until Thursday.' },
  ],
  vocabulary: [
    {
      term: 'monitoring', phonetic: '/ˈmɒnɪtərɪŋ/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '监测（定点持续记录空气质量）', en: 'the ongoing measurement of air quality at fixed sites' },
      usage: { zh: '不可数；monitoring sites、air monitoring。动词是 monitor。', en: 'Uncountable: monitoring sites, air monitoring. The verb is monitor.' },
      collocations: ['monitoring sites', 'air monitoring', 'the monitoring record'],
      example: { en: 'The monitoring sites cover the main zones of the district.', zh: '监测点覆盖城区主要分区。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈmɒn/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'threshold', phonetic: '/ˈθreʃhəʊld/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '限值，临界标准（超过即风险升高）', en: 'the official level above which health risk rises' },
      usage: { zh: '可数；threshold standards、above the threshold。', en: 'Countable: threshold standards, above the threshold.' },
      collocations: ['the threshold standards', 'above the threshold', 'the official threshold'],
      example: { en: 'Each reading is compared against the threshold standard.', zh: '每项读数都与限值标准对照。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈθreʃ/；th 读 /θ/。', en: 'Two syllables with first stress; th is /θ/.' },
    },
    {
      term: 'pollutant', phonetic: '/pəˈluːtənt/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '污染物', en: 'a harmful substance measured in the air' },
      usage: { zh: '可数；each pollutant、pollutant levels。动词是 pollute。', en: 'Countable: each pollutant. The verb is pollute.' },
      collocations: ['each pollutant', 'pollutant levels', 'the pollutant type'],
      example: { en: 'The table compares one pollutant at a time against the threshold.', zh: '表格逐项把一种污染物与限值对照。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈluː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'portable', phonetic: '/ˈpɔːtəbl/', partOfSpeech: 'adj.', sentenceIndex: 15,
      meaning: { zh: '便携的，可随身携带的', en: 'light enough to carry between streets during field walks' },
      usage: { zh: '形容词；portable sensors、a portable unit。', en: 'Adjective: portable sensors, a portable unit.' },
      collocations: ['portable sensors', 'a portable sensor', 'the portable readings'],
      example: { en: 'Portable sensors catch hot spots the fixed stations miss.', zh: '便携传感器能捕捉固定站漏掉的热点。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpɔː/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'exceedance', phonetic: '/ɪkˈsiːdəns/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '超标读数（超过限值的一次记录）', en: 'a reading that goes above the threshold level' },
      usage: { zh: '可数；a short exceedance、mark the exceedance。动词是 exceed。', en: 'Countable: a short exceedance. The verb is exceed.' },
      collocations: ['a short exceedance', 'mark the exceedance', 'an exceedance of the threshold'],
      example: { en: 'A short exceedance is marked separately from a seasonal pattern.', zh: '短时超标与季节趋势分开标注。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsiː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'outlier', phonetic: '/ˈaʊtlaɪər/', partOfSpeech: 'n.', sentenceIndex: 65,
      meaning: { zh: '异常值，离群数据点', en: 'a reading far from the rest, which needs an explanation' },
      usage: { zh: '可数；an outlier、remove an outlier。', en: 'Countable: an outlier, remove an outlier.' },
      collocations: ['an outlier', 'explain the outlier', 'silently remove an outlier'],
      example: { en: 'An outlier can be explained later, not deleted in silence.', zh: '异常值可以之后解释，不能悄悄删掉。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈaʊt/；结尾 /ər/ 轻读。', en: 'Two syllables with first stress; the ending is weak.' },
    },
  ],
  expressions: [
    {
      phrase: 'split the work', sentenceIndex: 1,
      meaning: { zh: '分工，把任务拆开认领', en: 'to divide the report tasks between the team members' },
      usage: { zh: 'split the work、split the sections；讨论分工高频。', en: 'Split the work, split the sections; common when dividing tasks.' },
      example: { en: 'We agree on roles before we split the work.', zh: '分工前先确认各自角色。' },
    },
    {
      phrase: 'cross-check', sentenceIndex: 17,
      meaning: { zh: '交叉核对，互相印证', en: 'to compare one source against another for agreement' },
      usage: { zh: '及物；cross-check each source、cross-check the readings。', en: 'Transitive: cross-check each source, cross-check the readings.' },
      example: { en: 'We cross-check each source against the others.', zh: '我们把各来源互相交叉核对。' },
    },
    {
      phrase: 'stand in for', sentenceIndex: 40,
      meaning: { zh: '代替，充当……的依据', en: 'to take the place of proper instrument data' },
      usage: { zh: 'stand in for instrument data；否定句高频。', en: 'Stand in for instrument data; common in negatives.' },
      example: { en: 'Surveys cannot stand in for measured instrument data.', zh: '问卷不能替代仪器实测数据。' },
    },
    {
      phrase: 'generalise beyond', sentenceIndex: 30,
      meaning: { zh: '超出数据范围下推断', en: 'to draw conclusions wider than the measured evidence allows' },
      usage: { zh: 'generalise beyond the data；学术写作高频。', en: 'Generalise beyond the data; common in academic writing.' },
      example: { en: 'We should not generalise beyond the measured record.', zh: '我们不应超出实测记录下推断。' },
    },
    {
      phrase: 'tied to', sentenceIndex: 29,
      meaning: { zh: '限定在，与……绑定', en: 'limited to the period or evidence actually collected' },
      usage: { zh: 'tied to the measured period；结论措辞高频。', en: 'Tied to the measured period; common in conclusion writing.' },
      example: { en: 'The conclusions stay tied to the measured period.', zh: '结论限定在实测时段内。' },
    },
    {
      phrase: 'flag it', sentenceIndex: 64,
      meaning: { zh: '标出，提请注意（异常数据）', en: 'to mark an unusual reading for later review' },
      usage: { zh: 'flag it in the notes；后接异常项。', en: 'Flag it in the notes; followed by the unusual item.' },
      example: { en: 'We flag an unusual reading in the notes instead of deleting it.', zh: '异常读数在笔记中标出，而不是删除。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对按发言顺序认领任务', en: 'Match each turn to its claimed task' },
      body: {
        zh: '第 21 到 24 题对应四次发言：Neerja 两次分别认领选址与图表，Ryan 管来源，Aria 管标准。听前给 A 到 E 标上 site、source、standard、chart、conclusion 关键词，轮到谁发言就把该轮任务对号入座，不要把下一个人的话题配给前一位。',
        en: 'Items 21 to 24 follow four turns: Neerja speaks twice for site selection and charts, Ryan owns sources, Aria owns standards. Tag A to E with site, source, standard, chart and conclusion beforehand, and match each claim to its speaker turn.',
      },
    },
    {
      title: { zh: '多选区分仪器数据与主观反馈', en: 'Separate instrument data from subjective feedback' },
      body: {
        zh: '第 28 到 30 题选三类数据源。录音明确固定站、便携传感器、天气记录为仪器类来源；社交媒体投诉、社区问卷、交通摄像头分别被说成主观感受或不测量空气，属于干扰项。听到 report smell、how people feel、does not measure the air 时把对应选项划掉。',
        en: 'Items 28 to 30 choose three sources. Fixed stations, portable sensors and weather records are the instrument-based sources; social complaints, surveys and camera footage are subjective or do not measure air. Cross them out at report smell, how people feel and does not measure the air.',
      },
    },
    {
      title: { zh: '结论题抓谨慎与边界信号', en: 'Catch caution and scope signals in conclusions' },
      body: {
        zh: '第 27 题问结论写法，录音用 cautious、tied to the measured period、not generalise 这类边界词。干扰项把结论写成年度预测或先于数据的建议；听到 trend、predict、before the data 时先标记，回到录音核对是否有同等强度依据。',
        en: 'Item 27 asks how to write conclusions; the recording uses cautious, tied to the measured period and not generalise. Distractors offer next-year predictions or pre-data recommendations. Mark trend, predict and before the data first, then check the recording for matching evidence.',
      },
    },
  ],
};
