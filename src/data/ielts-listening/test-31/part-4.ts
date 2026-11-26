import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 31 · Part 4 — 储能技术（单人讲座，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 结构：电网供需平衡 → 抽水蓄能 → 电池 → 氢储 → 供热储能 → 按时长选型 → 可再生并网原因、
 * 电池时长限制、氢储适用场景与抽水蓄能地理限制。笔记填空 31–36 在前半段，单选 37–40 在后半段。
 * 开场用具体现象，不用 Today's lecture is about 句式。
 */
export const test31Part4: ListeningLesson = {
  slug: 'test-31-part-4',
  part: 4,
  status: 'published',
  title: { zh: '储能技术', en: 'Energy storage' },
  summary: {
    zh: '讲座解释电网为何需要储能：抽水蓄能把水蓄在上游水库、放水推动涡轮发电；电池响应快但单机容量小；氢储适合长时段缺口；另有供热储能调节建筑负荷。后半段讨论可再生发电波动、电池时长限制、氢储的长周期定位与抽水蓄能对地形的要求。',
    en: 'The lecture explains why the grid needs storage: pumped hydro holds water in an upper reservoir and releases it through a turbine; batteries respond fast but hold limited power; hydrogen suits long gaps; heat storage eases building loads. The later section covers variable renewables, battery duration limits, hydrogen’s long-cycle role and the terrain pumped hydro requires.',
  },
  accent: { zh: '讲师为新西兰口音，术语处放慢并重复。', en: 'The lecturer has a New Zealand accent and slows down for technical terms.' },
  speechRate: '+2%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Grid storage balances supply and', cells: [[{ blank: 31 }]] },
        { lead: 'Pumped hydro stores energy as water in an upper', cells: [[{ blank: 32 }]] },
        { lead: 'When demand rises, water falls and turns a', cells: [[{ blank: 33 }]] },
        { lead: 'Batteries release energy quickly but hold a small amount of', cells: [[{ blank: 34 }]] },
        { lead: 'Hydrogen stores energy over a long', cells: [[{ blank: 35 }]] },
        { lead: 'The cheapest established long-duration method is pumped', cells: [[{ blank: 36 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'Why does the grid need storage alongside renewables?',
          options: [
            { key: 'A', text: 'Wind and solar output varies through the day' },
            { key: 'B', text: 'Coal plants stop running during the night' },
            { key: 'C', text: 'Household demand stays completely constant' },
          ],
        },
        {
          number: 38,
          stem: 'What limits how long a battery station can supply the grid?',
          options: [
            { key: 'A', text: 'The high cost of recycling old cells' },
            { key: 'B', text: 'The limited capacity of each unit' },
            { key: 'C', text: 'The weight of the metals inside' },
          ],
        },
        {
          number: 39,
          stem: 'Where does hydrogen storage fit best?',
          options: [
            { key: 'A', text: 'Short evening demand peaks' },
            { key: 'B', text: 'Seasonal or long gaps in supply' },
            { key: 'C', text: 'Small handheld home devices' },
          ],
        },
        {
          number: 40,
          stem: 'What is the main drawback of pumped hydro?',
          options: [
            { key: 'A', text: 'It needs suitable hilly geography' },
            { key: 'B', text: 'It loses all its water between cycles' },
            { key: 'C', text: 'It cannot switch between pumping and generation' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['demand'], evidence: 3,
      explanation: {
        zh: '定位句 3：The power grid must match electricity supply and demand at every moment of the day。储能平衡供应与需求，填 demand。句 4 的 wind and solar 是发电来源，不是空格对象。',
        en: 'Sentence 3: "The power grid must match electricity supply and demand at every moment of the day". Storage balances supply and demand, so write demand. Wind and solar in sentence 4 are sources, not the missing word.',
      },
    },
    {
      number: 32, accepted: ['reservoir'], evidence: 9,
      explanation: {
        zh: '定位句 9：It stores energy as water held in an upper reservoir, high above a lower one。抽水蓄能把水蓄在上游水库，填 reservoir。',
        en: 'Sentence 9: "It stores energy as water held in an upper reservoir, high above a lower one". Water is held in an upper reservoir, so write reservoir.',
      },
    },
    {
      number: 33, accepted: ['turbine'], evidence: 10,
      explanation: {
        zh: '定位句 10：the water is released downhill and turns a turbine connected to a generator。放水推动涡轮，填 turbine。句 11 的 generator 是涡轮相连的设备，不是被水推动的部件。',
        en: 'Sentence 10: "the water is released downhill and turns a turbine connected to a generator". Falling water turns a turbine, so write turbine. The generator in sentence 11 is connected to it, not the component turned directly.',
      },
    },
    {
      number: 34, accepted: ['power'], evidence: 18,
      explanation: {
        zh: '定位句 18：each battery unit holds only a small amount of power, so long coverage needs many cells。单机蓄电量小，填 power。句 19 的回收成本是另一问题，不是容量限制。',
        en: 'Sentence 18: "each battery unit holds only a small amount of power, so long coverage needs many cells". Each unit holds limited power, so write power. Recycling cost in sentence 19 is a separate issue, not the capacity limit.',
      },
    },
    {
      number: 35, accepted: ['period'], evidence: 24,
      explanation: {
        zh: '定位句 24：Hydrogen suits long gaps, such as a period of weeks without strong wind or sun。氢储适合长时段，填 period；空后已无单位词。',
        en: 'Sentence 24: "Hydrogen suits long gaps, such as a period of weeks without strong wind or sun". Hydrogen suits a long period, so write period.',
      },
    },
    {
      number: 36, accepted: ['hydro'], evidence: 27,
      explanation: {
        zh: '定位句 27：For long-duration cover, pumped hydro stays the cheapest established method。长期储能里抽水蓄能最省，填 hydro；题目已给 pumped。',
        en: 'Sentence 27: "For long-duration cover, pumped hydro stays the cheapest established method". Pumped hydro is the cheapest, and pumped is printed, so write hydro.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 38,
      explanation: {
        zh: '定位句 38：Wind and solar output varies through the day and with the weather, so the grid cannot rely on them alone。可再生发电波动是储能存在的原因，对应 A。B 的燃煤夜间停产在句 39 被说成可稳定运行，C 的需求恒定与句 5 相反。',
        en: 'Sentence 38: "Wind and solar output varies through the day and with the weather, so the grid cannot rely on them alone". Variable renewables match A. Coal in B can run steadily at night per sentence 39, and constant demand in C contradicts sentence 5.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 43,
      explanation: {
        zh: '定位句 43：Each unit holds a limited capacity, and adding more cells raises the cost quickly。电池时长限制来自单机容量，对应 B。A 的回收成本在句 44 被说成附加问题，C 的金属重量未被点名为主要限制。',
        en: 'Sentence 43: "Each unit holds a limited capacity, and adding more cells raises the cost quickly". The limit is per-unit capacity, matching B. Recycling in A is an added issue in sentence 44, and metal weight in C is not named as the main limit.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 45,
      explanation: {
        zh: '定位句 45：Hydrogen, by contrast, is built for seasonal or long gaps rather than a short evening peak。氢储面向季节或长缺口，对应 B。A 的短峰值由电池承担，句 46 有说明；C 的小型手持设备在讲座中未涉及。',
        en: 'Sentence 45: "Hydrogen, by contrast, is built for seasonal or long gaps rather than a short evening peak". Seasonal or long gaps match B. Short peaks in A go to batteries in sentence 46, and handheld devices in C are not discussed.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 47,
      explanation: {
        zh: '定位句 47：Its need for suitable geography rules out many flat sites。抽水蓄能依赖合适地形，对应 A。B 的水全部流失与句 48 相反，C 的不能切换在句 48 被否定。',
        en: 'Sentence 47: "Its need for suitable geography rules out many flat sites". Geography is the drawback, matching A. Losing all water in B contradicts sentence 48, and being unable to switch in C is rejected there too.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'On a windy afternoon, the grid can carry far more electricity than anyone needs; on a still night, the same lines fall short.' },
    { speaker: 'lecturer', text: 'That gap between supply and demand is what energy storage is built to close.' },
    { speaker: 'lecturer', text: 'Today we look at four ways storage works, and where each one fits the grid.' },
    { speaker: 'lecturer', text: 'The power grid must match electricity supply and demand at every moment of the day.' },
    { speaker: 'lecturer', text: 'Wind and solar help, but their output rises and falls with weather and sunlight.' },
    { speaker: 'lecturer', text: 'When generation drops below what homes and businesses use, the system draws on stored energy.' },
    { speaker: 'lecturer', text: 'When generation climbs above use, spare power charges the storage instead of being wasted.' },
    { speaker: 'lecturer', text: 'This balancing keeps voltage steady and prevents sudden cuts to local supply.' },
    { speaker: 'lecturer', text: 'The oldest large-scale method is pumped hydro, or pumped storage.' },
    { speaker: 'lecturer', text: 'It stores energy as water held in an upper reservoir, high above a lower one.' },
    { speaker: 'lecturer', text: 'When demand rises, the water is released downhill and turns a turbine connected to a generator.' },
    { speaker: 'lecturer', text: 'The generator feeds electricity back into the grid for as long as the upper pool holds water.' },
    { speaker: 'lecturer', text: 'In quiet hours, spare power pumps the water back uphill to refill the reservoir.' },
    { speaker: 'lecturer', text: 'This cycle can repeat for decades, and each round loses only a modest share of the energy.' },
    { speaker: 'lecturer', text: 'Pumped hydro works well wherever two pools can be built at different heights.' },
    { speaker: 'lecturer', text: 'The second method is the battery, the kind used in power stations and in electric vehicles.' },
    { speaker: 'lecturer', text: 'Batteries release their stored energy very quickly, within seconds of a demand spike.' },
    { speaker: 'lecturer', text: 'That speed makes them ideal for smoothing short dips between one generation source and another.' },
    { speaker: 'lecturer', text: 'But each battery unit holds only a small amount of power, so long coverage needs many cells stacked together.' },
    { speaker: 'lecturer', text: 'Battery cost falls when production scales up, yet recycling old cells remains a technical problem.' },
    { speaker: 'lecturer', text: 'A battery station can be built near the city it serves, without a valley or a dam.' },
    { speaker: 'lecturer', text: 'The third method stores energy as hydrogen, a gas that can be kept in tanks for weeks or months.' },
    { speaker: 'lecturer', text: 'When power is cheap and plentiful, it splits water into hydrogen and oxygen.' },
    { speaker: 'lecturer', text: 'The hydrogen is stored, and later a fuel cell turns it back into electricity when needed.' },
    { speaker: 'lecturer', text: 'Hydrogen suits long gaps, such as a period of weeks without strong wind or sun.' },
    { speaker: 'lecturer', text: 'It is less efficient than batteries over a short peak, because each conversion loses energy.' },
    { speaker: 'lecturer', text: 'Its tanks take up space, and handling the gas needs careful engineering.' },
    { speaker: 'lecturer', text: 'For long-duration cover, pumped hydro stays the cheapest established method.' },
    { speaker: 'lecturer', text: 'The fourth option covers heat storage, used mainly for buildings rather than the power grid.' },
    { speaker: 'lecturer', text: 'Warm water or rocks hold heat through the day and release it when evening rooms cool.' },
    { speaker: 'lecturer', text: 'This lowers the heating load on the grid during the coldest hours.' },
    { speaker: 'lecturer', text: 'To choose among methods, planners ask how long the stored energy must last.' },
    { speaker: 'lecturer', text: 'Short peaks of minutes or hours are best handled by batteries, which respond fast.' },
    { speaker: 'lecturer', text: 'Medium gaps of a day or two can use pumped hydro where the terrain allows it.' },
    { speaker: 'lecturer', text: 'Long gaps spanning weeks or seasons lean toward hydrogen, despite its lower efficiency.' },
    { speaker: 'lecturer', text: 'Mixing several methods lets the grid cover both fast spikes and slow shortages.' },
    { speaker: 'lecturer', text: 'Now let us look at why storage has grown alongside renewable generation.' },
    { speaker: 'lecturer', text: 'Wind and solar output varies through the day and with the weather, so the grid cannot rely on them alone.' },
    { speaker: 'lecturer', text: 'A coal plant can run steadily through the night, but it emits carbon and is being phased down.' },
    { speaker: 'lecturer', text: 'Storage acts as the buffer that lets variable renewables replace that steady fossil supply.' },
    { speaker: 'lecturer', text: 'Without storage, a calm cloudy day would force the system to buy expensive backup power.' },
    { speaker: 'lecturer', text: 'With storage, spare sunny midday power is saved for the evening peak when people cook and light their homes.' },
    { speaker: 'lecturer', text: 'Batteries face a clear limit on duration. Each unit holds a limited capacity, and adding more cells raises the cost quickly.' },
    { speaker: 'lecturer', text: 'Heavy metals and recycling rules add to that cost, though they do not decide the main duration limit.' },
    { speaker: 'lecturer', text: 'Hydrogen, by contrast, is built for seasonal or long gaps rather than a short evening peak.' },
    { speaker: 'lecturer', text: 'A short peak is better served by a battery that can answer within seconds.' },
    { speaker: 'lecturer', text: 'Pumped hydro also has limits. Its need for suitable geography rules out many flat sites.' },
    { speaker: 'lecturer', text: 'It does not lose all its water between cycles, and the plant can reverse between pumping and generation.' },
    { speaker: 'lecturer', text: 'Looking ahead, the cheapest long-duration option for sites with hills remains pumped hydro.' },
    { speaker: 'lecturer', text: 'Where the land is flat, planners combine batteries for short cover with hydrogen for long gaps.' },
    { speaker: 'lecturer', text: 'No single method wins every case; the choice depends on duration, terrain and cost.' },
    { speaker: 'lecturer', text: 'Understanding these trade-offs helps explain why storage is central to a renewable grid.' },
  ],
  vocabulary: [
    {
      term: 'grid', phonetic: '/ɡrɪd/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '电网', en: 'the network that carries electricity to homes and businesses' },
      usage: { zh: '可数；power grid、the grid、feed into the grid。', en: 'Countable: power grid, the grid, feed into the grid.' },
      collocations: ['the power grid', 'feed the grid', 'the grid matches supply'],
      example: { en: 'The grid must match supply and demand each moment.', zh: '电网必须随时匹配供需。' },
      listening: { zh: '单音节，与 greed 区分；靠 grid 搭配判断。', en: 'One syllable; distinguish from greed by context.' },
    },
    {
      term: 'reservoir', phonetic: '/ˈrezərvwɑːr/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '水库，蓄水池', en: 'the raised body of water that stores energy in pumped hydro' },
      usage: { zh: '可数；upper reservoir、lower reservoir。', en: 'Countable: upper reservoir, lower reservoir.' },
      collocations: ['the upper reservoir', 'the lower reservoir', 'refill the reservoir'],
      example: { en: 'Water is held in the upper reservoir until needed.', zh: '水蓄在上游水库等待调用。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈrez/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'turbine', phonetic: '/ˈtɜːrbaɪn/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '涡轮机', en: 'the machine turned by flowing water to drive a generator' },
      usage: { zh: '可数；turn a turbine、a water turbine。', en: 'Countable: turn a turbine, a water turbine.' },
      collocations: ['turn a turbine', 'a water turbine', 'the turbine drives'],
      example: { en: 'Falling water turns a turbine connected to the generator.', zh: '落水推动与发电机相连的涡轮。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /baɪn/。', en: 'Two syllables, first stress; ending /baɪn/.' },
    },
    {
      term: 'capacity', phonetic: '/kəˈpæsəti/', partOfSpeech: 'n.', sentenceIndex: 42,
      meaning: { zh: '容量，蓄电能力', en: 'the amount a battery or station can hold' },
      usage: { zh: '不可数/可数；limited capacity、storage capacity。', en: 'Uncountable or countable: limited capacity, storage capacity.' },
      collocations: ['limited capacity', 'storage capacity', 'unit capacity'],
      example: { en: 'Each unit has a limited capacity for long cover.', zh: '单机容量有限，难以长期供电。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈpæs/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'hydrogen', phonetic: '/ˈhaɪdrədʒən/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '氢（气）', en: 'a gas used to store energy over long periods' },
      usage: { zh: '不可数；hydrogen storage、hydrogen and oxygen。', en: 'Uncountable: hydrogen storage, hydrogen and oxygen.' },
      collocations: ['hydrogen storage', 'store hydrogen', 'hydrogen tanks'],
      example: { en: 'Hydrogen is kept in tanks for weeks or months.', zh: '氢气存入罐中可存数周甚至数月。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈhaɪ/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'efficiency', phonetic: '/ɪˈfɪʃnsi/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '效率', en: 'the share of stored energy that comes back as usable power' },
      usage: { zh: '不可数；lower efficiency、energy efficiency。形容词 efficient。', en: 'Uncountable: lower efficiency, energy efficiency. Adjective efficient.' },
      collocations: ['lower efficiency', 'energy efficiency', 'conversion efficiency'],
      example: { en: 'Each conversion loses energy, so efficiency drops.', zh: '每次转换都耗能，效率随之下降。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈfɪʃ/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'terrain', phonetic: '/təˈreɪn/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '地形，地貌', en: 'the shape and height of the land' },
      usage: { zh: '不可数；suitable terrain、flat terrain。', en: 'Uncountable: suitable terrain, flat terrain.' },
      collocations: ['suitable terrain', 'flat terrain', 'the terrain allows'],
      example: { en: 'Pumped hydro works only where the terrain allows two pools.', zh: '抽水蓄能只在地形允许双池处可行。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈreɪn/。', en: 'Two syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'draws on', sentenceIndex: 5,
      meaning: { zh: '调用，动用（储能）', en: 'to use stored energy when supply falls short' },
      usage: { zh: 'draw on something；此处主语是系统，宾语是储能。', en: 'Draw on something; the system is the subject, storage the object.' },
      example: { en: 'The system draws on stored energy when generation drops.', zh: '发电下降时系统调用储能。' },
    },
    {
      phrase: 'charges the storage', sentenceIndex: 6,
      meaning: { zh: '给储能装置充电', en: 'to fill the storage with spare power' },
      usage: { zh: 'charge 此处为“充能”；charge the battery、charge the storage。', en: 'Here charge means fill: charge the battery, charge the storage.' },
      example: { en: 'Spare power charges the storage instead of being wasted.', zh: '多余电力充入储能，而不是浪费掉。' },
    },
    {
      phrase: 'demand spike', sentenceIndex: 16,
      meaning: { zh: '（需求）骤升尖峰', en: 'a sudden short rise in demand for power' },
      usage: { zh: '可数；demand spike、a short spike。', en: 'Countable: demand spike, a short spike.' },
      example: { en: 'Batteries answer a demand spike within seconds.', zh: '电池几秒内回应需求尖峰。' },
    },
    {
      phrase: 'scales up', sentenceIndex: 19,
      meaning: { zh: '扩大规模生产', en: 'to increase production volume to bring costs down' },
      usage: { zh: '可分短语动词；cost falls when production scales up。', en: 'Separable: cost falls when production scales up.' },
      example: { en: 'Battery cost falls as production scales up.', zh: '电池成本随产量扩大而下降。' },
    },
    {
      phrase: 'phased down', sentenceIndex: 38,
      meaning: { zh: '逐步淘汰，缩减', en: 'to be reduced little by little and eventually ended' },
      usage: { zh: '被动语态；a plant is phased down。反义 phase up 少见。', en: 'Passive: a plant is phased down.' },
      example: { en: 'Coal plants are being phased down as storage grows.', zh: '随储能发展，燃煤电厂逐步缩减。' },
    },
    {
      phrase: 'rules out', sentenceIndex: 46,
      meaning: { zh: '排除，使不可行', en: 'to make a method impossible at a given site' },
      usage: { zh: 'rule out something；被动 be ruled out。', en: 'Rule out something; passive be ruled out.' },
      example: { en: 'Flat terrain rules out pumped hydro at many sites.', zh: '平坦地形使许多地点无法建抽水蓄能。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记按方法段落抓名词', en: 'Catch nouns by storage method' },
      body: {
        zh: '第 31–36 题随供需、抽水蓄能、电池、氢储、长期成本五段出现。听到 reservoir、turbine、power、period、hydro 时回到对应行；generator、recycling 是相邻概念，不要填入部件或成本行。',
        en: 'Items 31 to 36 follow supply-demand, pumped hydro, batteries, hydrogen and long-duration cost. On reservoir, turbine, power, period and hydro, return to the row. Generator and recycling are adjacent concepts, not the part or cost answers.',
      },
    },
    {
      title: { zh: '单选题区分时长定位', en: 'Match each method to its duration' },
      body: {
        zh: '第 38 题问电池限制，第 39 题问氢储定位，第 40 题问抽水蓄能缺点。三类方法各有一句核心描述：limited capacity、seasonal or long gaps、suitable geography；听到方法名先划下句中的限制词。',
        en: 'Items 38 to 40 ask the battery limit, the hydrogen role and the pumped hydro drawback. Each method has one core line: limited capacity, seasonal or long gaps, suitable geography. Note the limit word after each method name.',
      },
    },
    {
      title: { zh: '干扰项用相邻细节做替换', en: 'Distractors reuse adjacent details' },
      body: {
        zh: '回收成本、金属重量、短峰值、夜间燃煤都在原文出现过，但分别被归为附加问题、未点名限制、电池场景和对比背景。落笔前确认选项说的是题干问的那类方法，而不是讲座里顺带提到的另一细节。',
        en: 'Recycling cost, metal weight, short peaks and night coal all appear, but they are an added issue, an unnamed factor, a battery scenario or contrast background. Confirm the option names the method the stem asks about, not a side detail.',
      },
    },
  ],
};
