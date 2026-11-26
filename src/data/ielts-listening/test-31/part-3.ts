import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 31 · Part 3 — 河流田野笔记评阅（两人学术讨论，新西兰口音为主，一名爱尔兰口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：分工核对完整性与单位 → 缺失读数原因 → 单位统一 → 异常值处理 → 补充采样计划的三项改进。
 * 配对题考“谁承担哪项核对任务”，多选题从六项里挑出三项采样改进。开场用迟到道歉。
 */
export const test31Part3: ListeningLesson = {
  slug: 'test-31-part-3',
  part: 3,
  status: 'published',
  title: { zh: '河流田野笔记评阅', en: 'Reviewing fieldwork notes on rivers' },
  summary: {
    zh: '两名学生一起评阅河流田野笔记：分工核对每条读数的日期与地点标签、统一测量单位、标记异常高低值，并规划干涸河段的第二轮采样。讨论缺失读数的原因、分析前必须先修正的单位问题、异常值的处理方式，以及补充采样在时段、深度和上游点位上的三项改进。',
    en: 'Two students review river fieldwork notes: they split the checks for date and site labels, standardise measurement units, flag unusually high or low readings, and plan a second round at the dry channel. They discuss the missing readings, the unit fix needed before analysis, how outliers are treated, and three sampling improvements on timing, depth and an upstream site.',
  },
  accent: { zh: 'Liam 为新西兰口音，Emily 为爱尔兰口音。', en: 'Liam has a New Zealand accent; Emily has an Irish accent.' },
  speechRate: '+2%',
  cast: [
    { id: 'liam', label: 'LIAM', gender: 'male', voice: 'en-NZ-MitchellNeural' },
    { id: 'emily', label: 'EMILY', gender: 'female', voice: 'en-IE-EmilyNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which task matches each person? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'checks that every reading has a date and site label' },
        { key: 'B', text: 'standardises the measurement units across the notebook' },
        { key: 'C', text: 'flags readings that look unusually high or low' },
        { key: 'D', text: 'plans a second sampling round at the dry channel' },
        { key: 'E', text: 'redraws the map of the survey sites' },
        { key: 'F', text: 'writes the methods section for the report' },
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
          stem: 'Why are some readings missing from the afternoon session?',
          options: [
            { key: 'A', text: 'The notebook page was washed by rain.' },
            { key: 'B', text: 'The recorder failed at that site.' },
            { key: 'C', text: 'The site was left out of the sample on purpose.' },
          ],
        },
        {
          number: 26,
          stem: 'What must be fixed before the data are analysed?',
          options: [
            { key: 'A', text: 'The units of measurement' },
            { key: 'B', text: 'The names of the survey sites' },
            { key: 'C', text: 'The weather notes beside each reading' },
          ],
        },
        {
          number: 27,
          stem: 'How will the team handle an outlier reading?',
          options: [
            { key: 'A', text: 'Delete it as soon as it looks unusual' },
            { key: 'B', text: 'Keep it marked and remeasure in the next round' },
            { key: 'C', text: 'Copy the nearest value across to fill the gap' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE improvements will the supplementary sampling plan include? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE improvements does the second sampling round adopt?',
      options: [
        { key: 'A', text: 'sampling at the same time of day' },
        { key: 'B', text: 'measuring water depth as well as flow' },
        { key: 'C', text: 'adding a second site upstream' },
        { key: 'D', text: 'recording the colour of the water' },
        { key: 'E', text: 'taking readings only after rain' },
        { key: 'F', text: 'photographing every pebble in the channel' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：I’ll go through each reading and check that every one carries a date and a site label。Liam 核对日期与地点标签，对应 A。句 10 的重画地图是被推迟的工作，不归他本周任务。',
        en: 'Sentence 4: Liam says he will "go through each reading and check that every one carries a date and a site label", matching A. Redrawing the map in sentence 10 is deferred, not his current task.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 5,
      explanation: {
        zh: '定位句 5：I’ll take the units and make sure the whole notebook uses the same measurements。Emily 统一测量单位，对应 B。',
        en: 'Sentence 5: Emily says she will "take the units and make sure the whole notebook uses the same measurements", matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 7,
      explanation: {
        zh: '定位句 7：You can flag those as you come across them, and we’ll decide later whether to trust them。Liam 负责标记异常高低读数，对应 C。句 35 的保留判断是两人后续决定，不是他的标记动作。',
        en: 'Sentence 7: Emily says Liam can "flag those as you come across them", matching C. Keeping the value in sentence 35 is a later joint decision, not his flagging task.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 9,
      explanation: {
        zh: '定位句 9：I’ll plan a second sampling round there, once we know which dates the water returns。Emily 规划干涸河段的第二轮采样，对应 D。F 的方法部分写作在句 11 被推迟。',
        en: 'Sentence 9: Emily says she will "plan a second sampling round there", matching D. Writing the methods in F is deferred in sentence 11.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：The recorder itself failed at that site, so no sound notes were saved, and the handwritten numbers are blank。缺失源于录音设备故障，对应 B。A 的雨水冲坏本子在句 0 只是笔记本被浸湿，不是当天缺数原因；C 的有意排除在对话中没有依据。',
        en: 'Sentence 17: "The recorder itself failed at that site, so no sound notes were saved, and the handwritten numbers are blank". The recorder failed, matching B. The wet notebook in sentence 0 is a separate detail, and deliberate exclusion in C is never mentioned.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：I’ll standardise everything to one unit before analysis, and keep the original figure in a separate column。分析前必须统一单位，对应 A。B 的站点名称由 Liam 在句 22 补标签，C 的天气备注是补充记录，不是分析前必须修正项。',
        en: 'Sentence 25: Emily says she will "standardise everything to one unit before analysis", matching A. Site labels in B are Liam’s task in sentence 22, and weather notes in C are supplementary records, not a pre-analysis fix.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：So the plan is to keep them marked, remeasure in the next round, and compare then。异常值保留标记并在第二轮重测，对应 B。A 的立刻删除在句 37 被否定，C 的抄邻近值在对话中未出现。',
        en: 'Sentence 36: "the plan is to keep them marked, remeasure in the next round, and compare then". Keeping and remeasuring matches B. Deleting at once in A is rejected in sentence 37, and copying a neighbour in C is never proposed.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 43,
      explanation: {
        zh: '定位句 43：So we should sample at the same time of day on each visit, to keep the comparison fair。同一时段采样是改进之一，对应 A。句 42 提到灌溉导致时段差异，是这条改进的理由。',
        en: 'Sentence 43: "we should sample at the same time of day on each visit, to keep the comparison fair". Same-time sampling matches A. Sentence 42 explains why: flow changes with irrigation through the day.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 45,
      explanation: {
        zh: '定位句 45：Measuring water depth as well as flow would show whether the channel holds a steady stream。同时测水深是第二项改进，对应 B。句 44 说明首轮只记了表面流量。',
        en: 'Sentence 45: "Measuring water depth as well as flow would show whether the channel holds a steady stream". Depth alongside flow matches B. Sentence 44 notes the first round recorded surface flow only.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 47,
      explanation: {
        zh: '定位句 47：Adding a second site upstream would let us see where the water seeps back into the bed。增设上游点位是第三项改进，对应 C。D 的水色记录在句 49 被说成主观备注，E 的只雨后采样在句 51 被否定，F 的逐块拍照在句 53 被否。',
        en: 'Sentence 47: "Adding a second site upstream would let us see where the water seeps back into the bed". An upstream site matches C. Water colour in D is called subjective in sentence 49, rain-only sampling in E is rejected in sentence 51, and photographing every pebble in F in sentence 53.',
      },
    },
  ],
  transcript: [
    { speaker: 'liam', text: 'Sorry I’m late, I had to dry out the field notebook after it got soaked on the walk back.' },
    { speaker: 'emily', text: 'No problem. We’ve got the river notes spread on the table, so let’s see where we stand.' },
    { speaker: 'liam', text: 'Right. The aim today is to check the notebook before we enter anything into the spreadsheet.' },
    { speaker: 'emily', text: 'We should split the first round of checks between us, rather than both reading the same pages.' },
    { speaker: 'liam', text: 'I’ll go through each reading and check that every one carries a date and a site label.' },
    { speaker: 'emily', text: 'Good. I’ll take the units and make sure the whole notebook uses the same measurements.' },
    { speaker: 'liam', text: 'Then who looks at readings that look unusually high or low?' },
    { speaker: 'emily', text: 'You can flag those as you come across them, and we’ll decide later whether to trust them.' },
    { speaker: 'liam', text: 'And the dry channel we skipped last month?' },
    { speaker: 'emily', text: 'I’ll plan a second sampling round there, once we know which dates the water returns.' },
    { speaker: 'liam', text: 'We don’t need to redraw the site map this week; the old one still matches our route.' },
    { speaker: 'emily', text: 'Agreed. The methods section for the report can wait until the data look clean.' },
    { speaker: 'liam', text: 'So your unit check first, then my completeness pass, and we’ll meet again on outliers.' },
    { speaker: 'emily', text: 'Before we divide the pages, let me show you what I found on the first day’s sheet.' },
    { speaker: 'liam', text: 'Sure. What’s the problem with the readings at the upper bend?' },
    { speaker: 'emily', text: 'A whole block of values is missing from the afternoon session, between two and four.' },
    { speaker: 'liam', text: 'Did the rain wash the page out, or did you leave the recorder behind?' },
    { speaker: 'emily', text: 'The recorder itself failed at that site, so no sound notes were saved, and the handwritten numbers are blank.' },
    { speaker: 'liam', text: 'That explains the gap. We’ll mark those rows as missing rather than guessing figures.' },
    { speaker: 'emily', text: 'Right. We must not invent values to make the series look complete.' },
    { speaker: 'liam', text: 'What about the site labels? I noticed one page only says the name of the stream, not the bend.' },
    { speaker: 'emily', text: 'That’s the kind of gap your completeness check should catch.' },
    { speaker: 'liam', text: 'I’ll add the site code beside each row where the label is missing or unclear.' },
    { speaker: 'emily', text: 'Good. Now the units. Some pages record flow in litres per second, others in cubic metres.' },
    { speaker: 'liam', text: 'That would mislead the whole comparison if we entered them side by side.' },
    { speaker: 'emily', text: 'I’ll standardise everything to one unit before analysis, and keep the original figure in a separate column.' },
    { speaker: 'liam', text: 'Are the depth readings in centimetres throughout, or do some pages use metres?' },
    { speaker: 'emily', text: 'Most are centimetres, but two early pages list metres, so I’ll convert those carefully.' },
    { speaker: 'liam', text: 'Temperature looks consistent, but the shade readings vary with cloud cover.' },
    { speaker: 'emily', text: 'We should note the weather beside each reading, since shade affects the light levels.' },
    { speaker: 'liam', text: 'Let’s turn to the unusual values. The flow at site three on the twelfth looks far above the rest.' },
    { speaker: 'emily', text: 'That one may be real after the storm, but it is much higher than the neighbouring dates.' },
    { speaker: 'liam', text: 'I’ll flag it rather than delete it straight away. We need to see whether it repeats.' },
    { speaker: 'emily', text: 'And the very low reading at site five, near the bridge.' },
    { speaker: 'liam', text: 'That could be a blocked pipe reading, or a measurement taken partly above the water.' },
    { speaker: 'emily', text: 'We won’t drop it just because it disagrees with the others. Outliers can hold real information.' },
    { speaker: 'liam', text: 'So the plan is to keep them marked, remeasure in the next round, and compare then.' },
    { speaker: 'emily', text: 'Exactly. Deleting a value at once would hide a possible problem with the instrument.' },
    { speaker: 'liam', text: 'What do we do if the repeat reading matches the original high one?' },
    { speaker: 'emily', text: 'Then we treat it as a genuine peak and explain it in the report.' },
    { speaker: 'liam', text: 'Fine. Now the supplementary sampling plan for the dry channel.' },
    { speaker: 'emily', text: 'We need to decide what the second round should measure, and where it should go.' },
    { speaker: 'liam', text: 'First, the timing. If we sample at different times of day, the flow changes with irrigation.' },
    { speaker: 'emily', text: 'So we should sample at the same time of day on each visit, to keep the comparison fair.' },
    { speaker: 'liam', text: 'Second, depth. The first round recorded surface flow, not how deep the water runs.' },
    { speaker: 'emily', text: 'Measuring water depth as well as flow would show whether the channel holds a steady stream.' },
    { speaker: 'liam', text: 'Third, location. The dry stretch sits between two mapped sites, with no reading in between.' },
    { speaker: 'emily', text: 'Adding a second site upstream would let us see where the water seeps back into the bed.' },
    { speaker: 'liam', text: 'What about recording the colour of the water? It might show sediment after rain.' },
    { speaker: 'emily', text: 'Colour is a useful note, but too subjective for a main measurement.' },
    { speaker: 'liam', text: 'Should we take readings only after rain, to catch the high flows?' },
    { speaker: 'emily', text: 'Certainly not. That would bias the sample toward storm events and miss the ordinary dry days.' },
    { speaker: 'liam', text: 'And photographing every pebble in the channel?' },
    { speaker: 'emily', text: 'That would take too long, and it does not answer our flow question. A few photos of the bed are enough.' },
    { speaker: 'liam', text: 'So the three additions are same-time sampling, depth alongside flow, and one upstream site.' },
    { speaker: 'emily', text: 'That matches what we need. We can list the rejected ideas in the methods appendix.' },
    { speaker: 'liam', text: 'How many visits should the second round cover?' },
    { speaker: 'emily', text: 'Three visits over two weeks, so we can compare a wet day and a dry day.' },
    { speaker: 'emily', text: 'Good. Bring the calibrated meter, and label every vial with the site code at the stream.' },
    { speaker: 'liam', text: 'We can compare both weeks once the readings arrive.' },
    { speaker: 'liam', text: 'One more point. The spreadsheet columns should match the notebook headings exactly.' },
    { speaker: 'emily', text: 'I’ll draft the column names once the units are settled, and you can check them against the pages.' },
    { speaker: 'liam', text: 'Then the methods section after that, once the repeat readings are in.' },
    { speaker: 'emily', text: 'Agreed. Let’s finish the unit conversion this afternoon, and I’ll email you the flagged rows.' },
    { speaker: 'liam', text: 'Thanks. I’ll bring the map next time, even if we do not redraw it yet.' },
  ],
  vocabulary: [
    {
      term: 'reading', phonetic: '/ˈriːdɪŋ/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '（仪器）读数', en: 'a number recorded from a field instrument' },
      usage: { zh: '可数；each reading、a high reading。动词 read 的动名词形式。', en: 'Countable: each reading, a high reading. A gerund from the verb read.' },
      collocations: ['each reading', 'an unusual reading', 'record a reading'],
      example: { en: 'Every reading needs a date and a site label.', zh: '每条读数都要标日期和地点。' },
      listening: { zh: '重音在第一音节 /ˈriː/；读 /rɛd/ 的是过去式 read，靠词性判断。', en: 'Stress the first syllable; past-tense read sounds /rɛd/.' },
    },
    {
      term: 'site', phonetic: '/saɪt/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '采样点，观测地点', en: 'the place where a field measurement was taken' },
      usage: { zh: '可数；site label、survey site、upstream site。与 sight 同音。', en: 'Countable: site label, survey site. A homophone of sight.' },
      collocations: ['the site label', 'the survey sites', 'a second site upstream'],
      example: { en: 'Each row must carry a site code.', zh: '每一行都要带点位代码。' },
      listening: { zh: '与 sight（视线）同音，靠搭配 site label 判断词义。', en: 'Homophone of sight; the collocation site label identifies it.' },
    },
    {
      term: 'standardise', phonetic: '/ˈstændərdaɪz/', partOfSpeech: 'v.', sentenceIndex: 25,
      meaning: { zh: '统一（单位、标准）', en: 'to make measurements use the same unit or format' },
      usage: { zh: '及物；standardise the units；名词 standardisation。美式拼 standardize。', en: 'Transitive: standardise the units; noun standardisation. US spelling standardize.' },
      collocations: ['standardise the units', 'standardise the format'],
      example: { en: 'Emily standardises all figures to one unit before analysis.', zh: '分析前 Emily 把所有数值统一到一个单位。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈstæn/；中间 /dər/ 弱读。', en: 'Three syllables, first stress; the middle /dər/ is weak.' },
    },
    {
      term: 'Outliers', phonetic: '/ˈaʊtlaɪərz/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '异常值，离群读数', en: 'a value far above or below the rest of the series' },
      usage: { zh: '可数；flag an outlier、treat the outlier。', en: 'Countable: flag an outlier, treat the outlier.' },
      collocations: ['an outlier reading', 'flag the outliers', 'keep the outlier marked'],
      example: { en: 'Outliers are marked first and remeasured later.', zh: '异常值先标记，之后再重测。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈaʊ/；结尾 /laɪər/ 连读。', en: 'Two syllables, first stress; the ending /laɪər/ blends.' },
    },
    {
      term: 'supplementary', phonetic: '/ˌsʌplɪˈmentəri/', partOfSpeech: 'adj.', sentenceIndex: 40,
      meaning: { zh: '补充的，追加的', en: 'added later to fill a gap in the first round' },
      usage: { zh: '定语；supplementary sampling、supplementary data。', en: 'Attributive: supplementary sampling, supplementary data.' },
      collocations: ['the supplementary sampling plan', 'supplementary data'],
      example: { en: 'The second round is the supplementary sampling plan.', zh: '第二轮是补充采样计划。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈmen/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'irrigation', phonetic: '/ˌɪrɪˈɡeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 42,
      meaning: { zh: '灌溉', en: 'supplying farmland with water through channels' },
      usage: { zh: '不可数；irrigation changes flow、irrigation channels。', en: 'Uncountable: irrigation changes flow, irrigation channels.' },
      collocations: ['the irrigation schedule', 'irrigation water', 'changes with irrigation'],
      example: { en: 'Flow shifts through the day when irrigation releases water.', zh: '灌溉放水时流量一天内会变化。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈɡeɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'upstream', phonetic: '/ˌʌpˈstriːm/', partOfSpeech: 'adv.', sentenceIndex: 47,
      meaning: { zh: '上游方向', en: 'toward the higher source of the river' },
      usage: { zh: '方位副词；a second site upstream。反义 downstream。', en: 'Adverb of direction: a second site upstream. Opposite downstream.' },
      collocations: ['the site upstream', 'move upstream', 'a second site upstream'],
      example: { en: 'An upstream site shows where water returns to the bed.', zh: '上游点位显示水从哪里回到河床。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈstriːm/。', en: 'Two syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'split the first round of checks between us', sentenceIndex: 3,
      meaning: { zh: '把核对工作两人分开做', en: 'to divide the checking tasks between two people' },
      usage: { zh: 'split something between somebody；后接任务清单。', en: 'Split something between somebody; followed by the task list.' },
      example: { en: 'We split the checks between us instead of rereading together.', zh: '我们把核对分开做，而不是一起重读。' },
    },
    {
      phrase: 'come across', sentenceIndex: 7,
      meaning: { zh: '碰到，遇到（问题读数）', en: 'to meet with something while working through notes' },
      usage: { zh: '可分短语；come across a value、come across a gap。', en: 'Separable: come across a value, come across a gap.' },
      example: { en: 'Flag unusual readings as you come across them.', zh: '碰到异常读数就标出来。' },
    },
    {
      phrase: 'side by side', sentenceIndex: 24,
      meaning: { zh: '并排地，放在一起比较', en: 'next to each other for comparison' },
      usage: { zh: '状语；enter figures side by side。', en: 'Adverbial: enter figures side by side.' },
      example: { en: 'Mixed units would mislead a side-by-side comparison.', zh: '单位混放会误导并排比较。' },
    },
    {
      phrase: 'hold real information', sentenceIndex: 35,
      meaning: { zh: '含有真实信息', en: 'to carry genuine signal rather than pure error' },
      usage: { zh: 'hold 此处为“含有”；outliers hold information。', en: 'Here hold means contain: outliers hold information.' },
      example: { en: 'An outlier may hold real information about the storm.', zh: '异常值可能含有风暴的真实信息。' },
    },
    {
      phrase: 'seeps back into', sentenceIndex: 47,
      meaning: { zh: '渗回（河床）', en: 'to flow slowly back into the river bed' },
      usage: { zh: 'seep into/through；主语是水或液体。', en: 'Seep into or through; the subject is water or liquid.' },
      example: { en: 'The new upstream site shows where water seeps back into the bed.', zh: '新增上游点位显示水渗回河床的位置。' },
    },
    {
      phrase: 'bias the sample', sentenceIndex: 51,
      meaning: { zh: '使样本产生偏差', en: 'to make the sample lean toward one kind of condition' },
      usage: { zh: 'bias 作动词；bias the sample toward storm events。', en: 'Bias as a verb: bias the sample toward storm events.' },
      example: { en: 'Rain-only readings would bias the sample toward wet days.', zh: '只在雨后读数会让样本偏向雨天。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对按分工动词归人', en: 'Match tasks to people by verb' },
      body: {
        zh: '第 21–24 题四个任务按 check、standardise、flag、plan 四个动词依次出现，说话人轮流承担。听前在人名旁留空，听到动词短语再选字母；重画地图和写方法部分是被推迟的干扰项。',
        en: 'Items 21 to 24 follow the verbs check, standardise, flag and plan in order, split between speakers. Leave a blank by each name and match the letter when the verb phrase arrives. Redrawing the map and writing methods are deferred distractors.',
      },
    },
    {
      title: { zh: '异常值先标记不删除', en: 'Flag outliers before deleting anything' },
      body: {
        zh: '第 27 题的立场是 keep marked + remeasure。句 37 明确说立刻删除会掩盖仪器问题，句 51 的只雨后采样也是被否定的做法；听到 delete、drop、guess 这类词时，先在对应选项旁打叉。',
        en: 'Item 27’s position is keep marked and remeasure. Sentence 37 says deleting at once hides an instrument problem, and rain-only sampling in sentence 51 is rejected. On delete, drop or guess, cross out the matching option first.',
      },
    },
    {
      title: { zh: '多选区分主测量与备注', en: 'Separate main measures from notes' },
      body: {
        zh: '第 28–30 题三项改进是同时段、水深、上游点位。水色被说成 subjective note，逐块拍照太慢，只雨后采样会造成偏差；多选题里“太主观、太慢、太偏”三类描述对应被排除的选项。',
        en: 'Items 28 to 30 adopt same-time sampling, depth and an upstream site. Water colour is a subjective note, pebble photos are too slow, and rain-only readings bias the sample. Descriptions like too subjective, too slow and too one-sided map to rejected options.',
      },
    },
  ],
};
