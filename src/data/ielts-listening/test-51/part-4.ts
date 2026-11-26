import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 51 · Part 4 — 天气预报讲座（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：观测网 → 数值模式 → 集合预报 → 不确定性表达。
 * 笔记填空 31–36，单选 37–40。
 */
export const test51Part4: ListeningLesson = {
  slug: 'test-51-part-4',
  part: 4,
  status: 'published',
  title: { zh: '天气预报', en: 'Weather forecasting' },
  summary: {
    zh: '讲座讲解预报的三层结构：全国气象观测站定期采集数据，计算机数值模式以当前大气条件为起点推演未来，多个微调初始场的版本组成集合预报；预报员再向公众说明剩余不确定性。早期观测稀少且无计算机，故依赖本地经验；模式把观测转成未来天气，集合用于展示可能结果的范围，预报应作为区间而非单一精确结果来读。',
    en: 'The lecture covers three forecasting layers: stations collect data at intervals, a numerical model starts from current conditions, altered versions form an ensemble, and forecasters explain uncertainty. Early forecasts had few observers and no computers, relying on local experience; the model turns observations into future conditions; the ensemble shows its range; forecasts are read as ranges.',
  },
  accent: { zh: '发言人为新西兰口音，语速平稳。', en: 'The speaker has a New Zealand accent and speaks at a steady pace.' },
  speechRate: '+2%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS',
      rows: [
        { lead: 'Observation network: weather', cells: [[{ blank: 31 }, { text: ' across the country' }]] },
        { lead: 'Data collected at regular', cells: [[{ blank: 32 }]] },
        { lead: 'Computers run a numerical', cells: [[{ blank: 33 }]] },
        { lead: 'The model starts from current', cells: [[{ blank: 34 }]] },
        { lead: 'A group of forecasts is called an', cells: [[{ blank: 35 }]] },
        { lead: 'Forecasters explain the remaining', cells: [[{ blank: 36 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'Why did early forecasts rely on local signs?',
          options: [
            { key: 'A', text: 'Fewer observers and no computers to handle the numbers' },
            { key: 'B', text: 'Storms moved too quickly along the coast' },
            { key: 'C', text: 'Farmers refused to keep written records' },
          ],
        },
        {
          number: 38,
          stem: 'What does the numerical model do?',
          options: [
            { key: 'A', text: 'Repeats the forecast from the previous year' },
            { key: 'B', text: 'Turns observations into future conditions' },
            { key: 'C', text: 'Filters out all cases of bad weather' },
          ],
        },
        {
          number: 39,
          stem: 'Why is an ensemble used?',
          options: [
            { key: 'A', text: 'To show the range of possible outcomes' },
            { key: 'B', text: 'To cut the cost of running observations' },
            { key: 'C', text: 'To replace the forecaster’s judgment' },
          ],
        },
        {
          number: 40,
          stem: 'What is the main message about uncertainty?',
          options: [
            { key: 'A', text: 'Forecasts are never exact and should be read as a range' },
            { key: 'B', text: 'Uncertainty means the observations are wrong' },
            { key: 'C', text: 'Uncertainty only affects long-range rainfall' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['stations'], evidence: 3,
      explanation: {
        zh: '定位句 3：The first layer is the network of weather stations across the country, each reporting wind, temperature and humidity。观测网是全国气象站，填 stations。句 4 的田野、屋顶是站点位置，不是网络名称。',
        en: 'Sentence 3: "The first layer is the network of weather stations across the country, each reporting wind, temperature and humidity", so write stations. Fields and rooftops in sentence 4 are site locations, not the network name.',
      },
    },
    {
      number: 32, accepted: ['intervals'], evidence: 5,
      explanation: {
        zh: '定位句 5：Data from each site is collected at regular intervals, so the picture stays fresh through the day。数据按固定间隔采集，填 intervals。',
        en: 'Sentence 5: "Data from each site is collected at regular intervals, so the picture stays fresh through the day", so write intervals.',
      },
    },
    {
      number: 33, accepted: ['model'], evidence: 8,
      explanation: {
        zh: '定位句 8：The second layer is the numerical model, a computer programme that runs the physics of the atmosphere。计算机运行数值模式，填 model。句 9 的三维网格是模式内部结构。',
        en: 'Sentence 8: "The second layer is the numerical model, a computer programme that runs the physics of the atmosphere", so write model. The three-dimensional grid in sentence 9 is the model’s internal structure.',
      },
    },
    {
      number: 34, accepted: ['conditions'], evidence: 10,
      explanation: {
        zh: '定位句 10：It starts from current conditions, the state of the atmosphere observed that morning。模式以当前条件为起点，填 conditions。',
        en: 'Sentence 10: "It starts from current conditions, the state of the atmosphere observed that morning", so write conditions.',
      },
    },
    {
      number: 35, accepted: ['ensemble'], evidence: 18,
      explanation: {
        zh: '定位句 18：A group of forecasts built this way is called an ensemble, the standard tool for modern forecasting。这样一组预报称为集合预报，填 ensemble。',
        en: 'Sentence 18: "A group of forecasts built this way is called an ensemble, the standard tool for modern forecasting", so write ensemble.',
      },
    },
    {
      number: 36, accepted: ['uncertainty'], evidence: 19,
      explanation: {
        zh: '定位句 19：Even with all this machinery, forecasters explain the remaining uncertainty to the public。预报员向公众说明剩余不确定性，填 uncertainty。句 20 的“预报不是承诺”是对不确定性的解释。',
        en: 'Sentence 19: "Even with all this machinery, forecasters explain the remaining uncertainty to the public", so write uncertainty. The statement that a forecast is not a promise in sentence 20 explains the uncertainty.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：Back then there were fewer observers and no computers to handle the numbers, so forecasters relied on local signs and experience。早期观测稀少、没有计算机处理数据，对应 A。风暴移速与农民记录都不是旧方法的主因。',
        en: 'Sentence 26: "Back then there were fewer observers and no computers to handle the numbers, so forecasters relied on local signs and experience", matching A. Storm speed and farmer records are not the main reasons for old methods.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：The numerical model turns observations into future conditions by applying the rules of fluid motion。数值模式把观测转成未来条件，对应 B。它不重复旧预报，也不滤除坏天气。',
        en: 'Sentence 30: "The numerical model turns observations into future conditions by applying the rules of fluid motion", matching B. It neither repeats an old forecast nor removes bad weather.',
      },
    },
    {
      number: 39, accepted: ['A'], evidence: 34,
      explanation: {
        zh: '定位句 34：The ensemble is used to show the range of possible outcomes across the coming days。集合预报用于展示未来可能结果的范围，对应 A。它不降低观测成本，也不能替代预报员判断。',
        en: 'Sentence 34: "The ensemble is used to show the range of possible outcomes across the coming days", matching A. It does not cut observation costs or replace forecaster judgment.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 40,
      explanation: {
        zh: '定位句 40：The main message about uncertainty is that forecasts are never exact and should be read as a range。不确定性的核心信息是预报从不精确、应按区间来读，对应 A。不确定性不等于数据有误，也不只影响长期降雨。',
        en: 'Sentence 40: "The main message about uncertainty is that forecasts are never exact and should be read as a range", matching A. Uncertainty does not mean the data is wrong, nor does it affect only long-range rain.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Weather has defeated farmers, sailors and armies for centuries, yet we now predict it a week ahead with reasonable confidence.' },
    { speaker: 'lecturer', text: 'Long ago, a forecast was based on the feel of the wind, the look of the clouds and old sayings passed down.' },
    { speaker: 'lecturer', text: 'Today the science rests on three layers, observation, calculation and judgment.' },
    { speaker: 'lecturer', text: 'The first layer is the network of weather stations across the country, each reporting wind, temperature and humidity.' },
    { speaker: 'lecturer', text: 'The stations sit in fields, on rooftops and beside coastal harbours.' },
    { speaker: 'lecturer', text: 'Data from each site is collected at regular intervals, so the picture stays fresh through the day.' },
    { speaker: 'lecturer', text: 'Rain gauges, thermometers and anemometers feed readings into a central record.' },
    { speaker: 'lecturer', text: 'Satellites and radar add what the surface instruments cannot see.' },
    { speaker: 'lecturer', text: 'The second layer is the numerical model, a computer programme that runs the physics of the atmosphere.' },
    { speaker: 'lecturer', text: 'The model divides the air into a three-dimensional grid of small boxes.' },
    { speaker: 'lecturer', text: 'It starts from current conditions, the state of the atmosphere observed that morning.' },
    { speaker: 'lecturer', text: 'Each box carries temperature, pressure and the direction the wind is moving.' },
    { speaker: 'lecturer', text: 'The programme works out how these quantities change over the next hours.' },
    { speaker: 'lecturer', text: 'Small errors in the starting data can grow as the simulation runs.' },
    { speaker: 'lecturer', text: 'That sensitivity is why forecasters do not trust one single run of the model.' },
    { speaker: 'lecturer', text: 'Instead, the third layer runs many versions with slight changes to the input.' },
    { speaker: 'lecturer', text: 'Each version nudges the temperature or the wind a little from the first estimate.' },
    { speaker: 'lecturer', text: 'The spread between these runs reveals where the future is settled and where it is open.' },
    { speaker: 'lecturer', text: 'A group of forecasts built this way is called an ensemble, the standard tool for modern forecasting.' },
    { speaker: 'lecturer', text: 'Even with all this machinery, forecasters explain the remaining uncertainty to the public.' },
    { speaker: 'lecturer', text: 'A forecast is not a promise that one exact weather will arrive.' },
    { speaker: 'lecturer', text: 'It is a statement about what is most likely, given the data available.' },
    { speaker: 'lecturer', text: 'The same model can produce a wet day in one run and a dry one in another.' },
    { speaker: 'lecturer', text: 'Ensemble members that agree closely give the forecaster more confidence.' },
    { speaker: 'lecturer', text: 'When the runs scatter widely, the message turns cautious.' },
    { speaker: 'lecturer', text: 'Early weather forecasting faced two practical limits that shaped its methods.' },
    { speaker: 'lecturer', text: 'Back then there were fewer observers and no computers to handle the numbers, so forecasters relied on local signs and experience.' },
    { speaker: 'lecturer', text: 'Storms did move quickly along the coast, but that was not the main reason for old methods.' },
    { speaker: 'lecturer', text: 'Farmers kept their own diaries, yet records were rarely shared between towns.' },
    { speaker: 'lecturer', text: 'The telegraph changed this by passing observations between distant places each morning.' },
    { speaker: 'lecturer', text: 'The numerical model turns observations into future conditions by applying the rules of fluid motion.' },
    { speaker: 'lecturer', text: 'It does not repeat an old forecast, nor does it remove the possibility of bad weather.' },
    { speaker: 'lecturer', text: 'Physical laws describe how warm air rises and how moisture condenses into rain.' },
    { speaker: 'lecturer', text: 'The resolution of the grid sets the smallest feature the model can represent.' },
    { speaker: 'lecturer', text: 'The ensemble is used to show the range of possible outcomes across the coming days.' },
    { speaker: 'lecturer', text: 'It does not cut the cost of observations, and it cannot replace the forecaster’s judgment.' },
    { speaker: 'lecturer', text: 'Each run represents one plausible path the atmosphere might take.' },
    { speaker: 'lecturer', text: 'Plausible paths cluster around the most likely weather in a stable pattern.' },
    { speaker: 'lecturer', text: 'Outliers suggest a scenario that would need an unusual trigger to develop.' },
    { speaker: 'lecturer', text: 'Forecasters weight the ensemble by how well past runs have performed locally.' },
    { speaker: 'lecturer', text: 'The main message about uncertainty is that forecasts are never exact and should be read as a range.' },
    { speaker: 'lecturer', text: 'Uncertainty does not mean the observations are wrong, only that the future still has room to move.' },
    { speaker: 'lecturer', text: 'It does not affect only long-range rain; it appears in wind warnings too.' },
    { speaker: 'lecturer', text: 'A range helps people plan, for example bringing a jacket but keeping an umbrella close.' },
    { speaker: 'lecturer', text: 'Short-range forecasts carry the highest confidence, because errors have little time to grow.' },
    { speaker: 'lecturer', text: 'Beyond a week, the spread between runs usually widens again.' },
    { speaker: 'lecturer', text: 'Forecasters update the model each time a fresh batch of observations arrives.' },
    { speaker: 'lecturer', text: 'Human judgment reviews the model output for local features the grid misses.' },
    { speaker: 'lecturer', text: 'Coastal winds, hill shadows and lake breezes need a local eye.' },
    { speaker: 'lecturer', text: 'The public presentation turns these numbers into plain warnings and likely times.' },
    { speaker: 'lecturer', text: 'Technology keeps improving, but the basic loop of observe, compute and judge remains the same.' },
    { speaker: 'lecturer', text: 'Good forecasting respects both the strength of the data and the limits of what it can know.' },
  ],
  vocabulary: [
    {
      term: 'stations', phonetic: '/ˈsteɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '观测站，气象站', en: 'fixed sites that record weather conditions' },
      usage: { zh: '可数复数；weather stations、coastal stations。', en: 'Countable plural: weather stations, coastal stations.' },
      collocations: ['weather stations', 'the station network', 'remote stations'],
      example: { en: 'Weather stations report wind and temperature daily.', zh: '气象站每日报告风力与气温。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsteɪ/，结尾 /nz/。', en: 'Two syllables stressing the first; ending /nz/.' },
    },
    {
      term: 'intervals', phonetic: '/ˈɪntəvlz/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '间隔，固定时段', en: 'regular gaps between one reading and the next' },
      usage: { zh: '可数复数；at regular intervals。', en: 'Countable plural: at regular intervals.' },
      collocations: ['regular intervals', 'at short intervals', 'time intervals'],
      example: { en: 'Readings arrive at regular intervals.', zh: '读数按固定间隔传入。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈɪn/。', en: 'Three syllables stressing the first.' },
    },
    {
      term: 'model', phonetic: '/ˈmɒdl/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '模式（计算机预报程序）', en: 'a computer programme that simulates the atmosphere' },
      usage: { zh: '可数；numerical model、run the model。动词 model 表建模。', en: 'Countable: numerical model, run the model. The verb is model.' },
      collocations: ['the numerical model', 'run the model', 'the model output'],
      example: { en: 'The numerical model simulates atmospheric physics.', zh: '数值模式模拟大气物理。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈmɒ/，结尾 /dl/。', en: 'Two syllables stressing the first; ending /dl/.' },
    },
    {
      term: 'conditions', phonetic: '/kənˈdɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '（大气）条件，状态', en: 'the state of the atmosphere at a given time' },
      usage: { zh: '可数复数；current conditions、weather conditions。', en: 'Countable plural: current conditions, weather conditions.' },
      collocations: ['current conditions', 'atmospheric conditions', 'surface conditions'],
      example: { en: 'The model starts from current conditions.', zh: '模式以当前条件为起点。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈdɪʃ/。', en: 'Two syllables stressing the second.' },
    },
    {
      term: 'ensemble', phonetic: '/ɒnˈsɒmbl/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '集合预报（多版本预报组）', en: 'a set of slightly different forecasts run together' },
      usage: { zh: '可数；an ensemble of forecasts、ensemble members。', en: 'Countable: an ensemble of forecasts, ensemble members.' },
      collocations: ['an ensemble of forecasts', 'the ensemble members', 'run an ensemble'],
      example: { en: 'An ensemble shows the spread between forecast runs.', zh: '集合预报显示各版本预报的分歧。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsɒm/。', en: 'Three syllables stressing the second.' },
    },
    {
      term: 'uncertainty', phonetic: '/ʌnˈsɜːtnti/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '不确定性，预报的可能范围', en: 'the lack of one exact outcome in a forecast' },
      usage: { zh: '不可数；remaining uncertainty、deal with uncertainty。形容词 uncertain。', en: 'Uncountable: remaining uncertainty, deal with uncertainty. The adjective is uncertain.' },
      collocations: ['the remaining uncertainty', 'forecast uncertainty', 'express uncertainty'],
      example: { en: 'Forecasters explain the remaining uncertainty plainly.', zh: '预报员清楚说明剩余不确定性。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈsɜː/。', en: 'Four syllables stressing the second.' },
    },
    {
      term: 'observations', phonetic: '/ˌɒbzəˈveɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '观测记录，实测数据', en: 'a measured reading collected at a weather site' },
      usage: { zh: '可数或不可数；observations arrive、share observations。动词 observe。', en: 'Countable or uncountable: observations arrive, share observations. The verb is observe.' },
      collocations: ['share observations', 'the observations arrive', 'fresh observations'],
      example: { en: 'The telegraph passed observations between towns.', zh: '电报在城镇间传递观测记录。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈveɪ/。', en: 'Four syllables stressing the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'numerical model', sentenceIndex: 8,
      meaning: { zh: '数值模式', en: 'the computer model using physics and numbers' },
      usage: { zh: '名词短语；run the numerical model、the numerical model output。', en: 'A noun phrase: run the numerical model, the numerical model output.' },
      example: { en: 'The numerical model runs atmospheric physics.', zh: '数值模式运行大气物理计算。' },
    },
    {
      phrase: 'starts from', sentenceIndex: 10,
      meaning: { zh: '从……起步，以……为起点', en: 'to begin the calculation from a given state' },
      usage: { zh: 'start from 后接起点；starts from current conditions。', en: 'start from plus base: starts from current conditions.' },
      example: { en: 'The forecast starts from current observations.', zh: '预报从当前观测起步。' },
    },
    {
      phrase: 'local signs', sentenceIndex: 26,
      meaning: { zh: '本地征兆，经验迹象', en: 'on-site hints such as wind and cloud used before instruments' },
      usage: { zh: '名词短语；rely on local signs、read the local signs。', en: 'A noun phrase: rely on local signs, read the local signs.' },
      example: { en: 'Early forecasters relied on local signs.', zh: '早期预报员依赖本地征兆。' },
    },
    {
      phrase: 'range of possible outcomes', sentenceIndex: 34,
      meaning: { zh: '可能结果的范围', en: 'the spread of scenarios the forecast allows' },
      usage: { zh: '名词短语；show a range of possible outcomes。', en: 'A noun phrase: show a range of possible outcomes.' },
      example: { en: 'The ensemble shows the range of possible outcomes.', zh: '集合预报展示可能结果的范围。' },
    },
    {
      phrase: 'short-range forecasts', sentenceIndex: 44,
      meaning: { zh: '短期预报', en: 'predictions covering the next few days' },
      usage: { zh: '名词短语；short-range forecasts carry high confidence。反义 long-range。', en: 'A noun phrase: short-range forecasts carry high confidence. The opposite is long-range.' },
      example: { en: 'Short-range forecasts carry the highest confidence.', zh: '短期预报置信度最高。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记填空抓名词短语', en: 'Catch the noun phrase in note completion' },
      body: {
        zh: 'R1 笔记题答案多为句中核心名词：stations、intervals、model、conditions、ensemble、uncertainty。听时先定位句子主干，空格前后的介词和冠词能帮你锁定词性与单复数。',
        en: 'R1 note answers are mostly core nouns: stations, intervals, model, conditions, ensemble, uncertainty. Locate the sentence skeleton first; prepositions and articles around the blank reveal part of speech and number.',
      },
    },
    {
      title: { zh: '按三层结构记层次', en: 'Keep the three layers in order' },
      body: {
        zh: '讲座按观测、计算、判断三层推进。每层对应一组特点，单选题常问某层的作用；听到 first layer、second layer、third layer 就核对当前层次。',
        en: 'The lecture moves through observation, calculation and judgment. Each layer carries its own features; single-choice questions target one layer’s role. Match first, second and third layer to the stage.',
      },
    },
    {
      title: { zh: '区分作用与限制', en: 'Purpose versus limitation' },
      body: {
        zh: '集合预报的作用是展示结果范围；它的限制是不能降低成本、不能替代预报员判断。选项把限制改写成作用是常见干扰，落笔前确认动词是 used to、does not 还是 cannot。',
        en: 'The ensemble shows the outcome range; its limits are that it does not cut costs and cannot replace judgment. An option turning a limit into a purpose is a common distractor; check whether the verb is used to, does not or cannot.',
      },
    },
  ],
};
