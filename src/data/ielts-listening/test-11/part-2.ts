import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 11 · Part 2 — 步行街区方案介绍（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：改造范围 → 送货时段 → 公交改线 → 商户与居民诉求 → 试运行安排 → 五方意见（配对 16–20）
 * → 配套设施与评估方式。信号词 Buses are the next issue、After six months 标出段落切换。
 */
export const test11Part2: ListeningLesson = {
  slug: 'test-11-part-2',
  part: 2,
  status: 'published',
  title: { zh: '步行街区方案介绍', en: 'A talk on the new pedestrian zone' },
  summary: {
    zh: '交通部门官员介绍步行街区的改造范围、送货时段限制、公交改线方案、商户与居民的不同反馈，以及为期六个月试运行的评估方式和配套设施安排。',
    en: 'A transport officer explains the pedestrian zone’s scope, delivery restrictions, the bus diversion, mixed feedback from traders and residents, the six-month trial and its evaluation, plus the supporting facilities.',
  },
  accent: { zh: '发言人为新西兰口音，语速中等。', en: 'The speaker has a New Zealand accent and speaks at a moderate pace.' },
  speechRate: '+2%',
  cast: [
    { id: 'officer', label: 'OFFICER', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'The zone covers the old market street and the nearby', cells: [[{ blank: 11 }]] },
        { lead: 'Deliveries allowed only before', cells: [[{ blank: 12 }, { text: ' in the morning' }]] },
        { lead: 'Buses diverted along', cells: [[{ blank: 13 }]] },
        { lead: 'Traders asked for more outdoor', cells: [[{ blank: 14 }]] },
        { lead: 'The trial lasts', cells: [[{ blank: 15 }, { text: ' months' }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which view does each group hold? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'worried that unloading will become harder' },
        { key: 'B', text: 'supports the plan but concerns about evening noise' },
        { key: 'C', text: 'wants extra outdoor seating for customers' },
        { key: 'D', text: 'reports the diversion adds a few minutes but runs reliably' },
        { key: 'E', text: 'sells goods that must be moved in small deliveries' },
        { key: 'F', text: 'objects to any change to the current timetable' },
      ],
      items: [
        { number: 16, text: 'the café owner' },
        { number: 17, text: 'the bookshop manager' },
        { number: 18, text: 'the market traders' },
        { number: 19, text: 'local residents' },
        { number: 20, text: 'the bus company' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['square'], evidence: 3,
      explanation: {
        zh: '定位句 3：It will cover the street itself and the nearby square。题目已给 nearby，填 square；句 4 的 main road 是保留通车的外围道路，不是街区范围。',
        en: 'Sentence 3: "It will cover the street itself and the nearby square". Nearby is printed, so fill square. The main road in sentence 4 stays open to traffic and is outside the zone.',
      },
    },
    {
      number: 12, accepted: ['nine', '9'], evidence: 7,
      explanation: {
        zh: '定位句 7：suppliers may unload only before nine in the morning。题目已给 in the morning，填数字；句 7 的 after seven at night 是晚间时段，不是早晨截止点。',
        en: 'Sentence 7: "suppliers may unload only before nine in the morning". In the morning is printed, so write the number. The after seven at night clause is the evening window, not the morning cutoff.',
      },
    },
    {
      number: 13, accepted: ['River Road'], evidence: 12,
      explanation: {
        zh: '定位句 12：buses will be diverted along River Road。道路专有名词两个词，首字母大写；句 13 的 library stop 是站点位置，不是改线走廊。',
        en: 'Sentence 12: "buses will be diverted along River Road". A two-word proper noun with capitals. The library stop in sentence 13 is a stop, not the diversion road.',
      },
    },
    {
      number: 14, accepted: ['seating'], evidence: 15,
      explanation: {
        zh: '定位句 15：Several traders have asked for more outdoor seating。室外座位是商户的共同诉求，填 seating；句 22 书店经理再次提到同一诉求。',
        en: 'Sentence 15: "Several traders have asked for more outdoor seating". Outdoor seating is the shared trader request. The bookshop manager repeats it in sentence 22.',
      },
    },
    {
      number: 15, accepted: ['six', '6'], evidence: 16,
      explanation: {
        zh: '定位句 16：The scheme will run as a trial for six months。空格后已印 months，只填数字；句 19 的 after six months 是复核时点，不是试运行长度。',
        en: 'Sentence 16: "The scheme will run as a trial for six months". Months is printed, so write the number. After six months in sentence 19 is the review point, not the trial length.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：She likes the idea of more people walking past, but she worries about noise from outdoor tables after dark。认可人流但担心晚间噪音，对应 B。',
        en: 'Sentence 21: she "likes the idea of more people walking past, but she worries about noise from outdoor tables after dark", matching B.',
      },
    },
    {
      number: 17, accepted: ['C'], evidence: 22,
      explanation: {
        zh: '定位句 22：He would welcome extra outdoor seating, since his shop attracts readers who like to sit outside。书店经理想要户外座位，对应 C。',
        en: 'Sentence 22: "He would welcome extra outdoor seating, since his shop attracts readers who like to sit outside", matching C.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：their deliveries need easy unloading，句 24 补充早高峰时段不够搬重物。商贩担心卸货变难，对应 A。E 说小批量送货，与他们卖家具大件相反。',
        en: 'Sentence 23: "their deliveries need easy unloading", and sentence 24 adds the morning window is short for heavy goods, matching A. E, small deliveries, contradicts their large furniture.',
      },
    },
    {
      number: 19, accepted: ['F'], evidence: 27,
      explanation: {
        zh: '定位句 27：A few residents opposite the square object to any change to the current bus timetable。部分居民反对改时刻表，对应 F。句 26 的多数居民有条件支持，是另一批人的态度。',
        en: 'Sentence 27: "A few residents opposite the square object to any change to the current bus timetable", matching F. The supportive majority in sentence 26 hold a different view.',
      },
    },
    {
      number: 20, accepted: ['D'], evidence: 28,
      explanation: {
        zh: '定位句 28：the new route adds a few minutes, but the road is wider and runs reliably。公交公司认为绕路略增时间但可靠，对应 D。句 29 加开一班车是配套请求，不是路线评价。',
        en: 'Sentence 28: "the new route adds a few minutes, but the road is wider and runs reliably", matching D. The extra bus in sentence 29 is a separate request.',
      },
    },
  ],
  transcript: [
    { speaker: 'officer', text: 'Before we look at the maps, let me run through what the pedestrian zone will change.' },
    { speaker: 'officer', text: 'I’m Rachel, from the transport office, and I’ll be presenting the proposal this evening.' },
    { speaker: 'officer', text: 'The scheme closes the old market street to private cars during the day, apart from access to the shops.' },
    { speaker: 'officer', text: 'It will cover the street itself and the nearby square, where the weekly market is held.' },
    { speaker: 'officer', text: 'The main road around the zone stays open, so through traffic can still cross the town.' },
    { speaker: 'officer', text: 'The council has published a map showing which streets remain open to vehicles.' },
    { speaker: 'officer', text: 'Deliveries are a key concern, because most shops receive goods in the morning.' },
    { speaker: 'officer', text: 'Under the plan, suppliers may unload only before nine in the morning, and after seven at night.' },
    { speaker: 'officer', text: 'Between those times, the streets are kept clear for pedestrians and cyclists.' },
    { speaker: 'officer', text: 'Cyclists will share the widened footway rather than use a separate lane.' },
    { speaker: 'officer', text: 'The crossings near the primary school were the most complained about in last year’s survey.' },
    { speaker: 'officer', text: 'Buses are the next issue. The current route passes straight along the market street.' },
    { speaker: 'officer', text: 'During the zone, buses will be diverted along River Road, which runs one block to the north.' },
    { speaker: 'officer', text: 'The new stop outside the library replaces the one in front of the town hall.' },
    { speaker: 'officer', text: 'The walk between the two stops stays under five minutes.' },
    { speaker: 'officer', text: 'Several traders have asked for more outdoor seating, so that customers can stay longer.' },
    { speaker: 'officer', text: 'The scheme will run as a trial for six months, so that we can measure the effect before any final decision.' },
    { speaker: 'officer', text: 'During the trial, officers will count pedestrians, record delivery delays and note any complaints from shops.' },
    { speaker: 'officer', text: 'Shop fronts along the street will be repainted during the works.' },
    { speaker: 'officer', text: 'After six months, the council will review the results and decide whether to make the zone permanent.' },
    { speaker: 'officer', text: 'We have now spoken to the main groups, and their comments were mixed.' },
    { speaker: 'officer', text: 'First, the café owner. She likes the idea of more people walking past, but she worries about noise from outdoor tables after dark.' },
    { speaker: 'officer', text: 'The bookshop manager is more cautious. He would welcome extra outdoor seating, since his shop attracts readers who like to sit outside.' },
    { speaker: 'officer', text: 'The market traders, who sell furniture and large goods, say their deliveries need easy unloading.' },
    { speaker: 'officer', text: 'They are concerned that the early morning window will not give them enough time to bring heavy items in.' },
    { speaker: 'officer', text: 'One trader has suggested a small trolley be kept at the entrance for moving goods.' },
    { speaker: 'officer', text: 'Local residents were consulted at two meetings last month. Most support the scheme, provided the evening seating closes early.' },
    { speaker: 'officer', text: 'A few residents opposite the square object to any change to the current bus timetable.' },
    { speaker: 'officer', text: 'The bus company itself has reviewed the diversion. Their driver says the new route adds a few minutes, but the road is wider and runs reliably.' },
    { speaker: 'officer', text: 'They have asked for an extra bus at the Saturday market, to carry the extra shoppers.' },
    { speaker: 'officer', text: 'The company will keep a spare bus at the depot on market mornings.' },
    { speaker: 'officer', text: 'If the trial causes clear problems with deliveries, the timetable may be relaxed.' },
    { speaker: 'officer', text: 'Four cycle racks will be installed beside the square, and the footway outside the hall will be widened.' },
    { speaker: 'officer', text: 'Parking for bicycles is free throughout the zone.' },
    { speaker: 'officer', text: 'Two old trees will be kept in place, and benches will be spaced along the widened footway.' },
    { speaker: 'officer', text: 'Lighting along the street will be replaced, so that the evening area feels safe after sunset.' },
    { speaker: 'officer', text: 'There will be no public car park inside the zone, but the multi-storey car park remains two streets away.' },
    { speaker: 'officer', text: 'Visitors with mobility needs can still set down passengers at the square edge.' },
    { speaker: 'officer', text: 'We will publish the trial figures on the council website once the first month is complete.' },
    { speaker: 'officer', text: 'A short survey will be handed to shoppers at the Saturday market during the trial.' },
    { speaker: 'officer', text: 'Questions are welcome at the end, but first I’ll show you the route diagrams.' },
  ],
  vocabulary: [
    {
      term: 'scheme', phonetic: '/skiːm/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '方案，计划（市政工程）', en: 'a formal plan or project carried out by an organisation' },
      usage: { zh: '英式市政语境常用；the scheme、the pedestrian scheme。美式多说 plan。', en: 'Common in British public projects: the scheme. American English usually says plan.' },
      collocations: ['the scheme', 'a new scheme', 'the trial scheme'],
      example: { en: 'The council approved the cycling scheme last week.', zh: '市政会上周批准了骑行方案。' },
      listening: { zh: '单音节，读 /skiːm/，与 skin 区分。', en: 'One syllable /skiːm/; do not confuse with skin.' },
    },
    {
      term: 'deliveries', phonetic: '/dɪˈlɪvəriz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '送货，交付的货物', en: 'goods brought to a shop or address' },
      usage: { zh: '常用复数；morning deliveries、a delivery window。动词 deliver。', en: 'Usually plural: morning deliveries, a delivery window; the verb is deliver.' },
      collocations: ['morning deliveries', 'unload deliveries', 'delivery times'],
      example: { en: 'Deliveries to the high street must finish before nine.', zh: '商业街必须在九点前完成送货。' },
      listening: { zh: '重音在第二音节 /ˈlɪv/，词尾 /riz/ 轻读。', en: 'Stress the second syllable; the final /riz/ is soft.' },
    },
    {
      term: 'diverted', phonetic: '/daɪˈvɜːtɪd/', partOfSpeech: 'v.', sentenceIndex: 12,
      meaning: { zh: '改道，绕行', en: 'sent along a different route' },
      usage: { zh: 'be diverted along/through somewhere，即沿某路绕行；名词形式是 diversion。', en: 'be diverted along somewhere; the noun is diversion.' },
      collocations: ['diverted along', 'diverted through', 'traffic diverted'],
      example: { en: 'Buses are diverted while the street is closed.', zh: '街道封闭期间公交改道。' },
      listening: { zh: '重音在第二音节 /ˈvɜː/，开头 /daɪ/ 与 dive 同韵。', en: 'Stress the second syllable; the opening rhymes with dive.' },
    },
    {
      term: 'seating', phonetic: '/ˈsiːtɪŋ/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '座位（统称）', en: 'the seats provided for people to sit on' },
      usage: { zh: '不可数；outdoor seating、seating capacity。', en: 'Uncountable: outdoor seating, seating capacity.' },
      collocations: ['outdoor seating', 'extra seating', 'seating area'],
      example: { en: 'The café added outdoor seating for the summer.', zh: '咖啡馆夏天加了室外座位。' },
      listening: { zh: '读 /ˈsiːtɪŋ/，与 sitting /ˈsɪtɪŋ/ 元音不同。', en: 'Pronounced /ˈsiːtɪŋ/, not sitting /ˈsɪtɪŋ/.' },
    },
    {
      term: 'trial', phonetic: '/ˈtraɪəl/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '试运行，试点期', en: 'a test period before a scheme becomes permanent' },
      usage: { zh: '试运行或试点期；常见搭配 run a trial、on trial、a six-month trial。', en: 'run a trial, on trial, a six-month trial.' },
      collocations: ['a six-month trial', 'run a trial', 'the trial period'],
      example: { en: 'The lane operates as a trial for one year.', zh: '这条车道先试运行一年。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtraɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'traders', phonetic: '/ˈtreɪdəz/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '商户，摊主', en: 'people who sell goods from a shop or stall' },
      usage: { zh: '可数复数；market traders、local traders。', en: 'Countable plural: market traders, local traders.' },
      collocations: ['local traders', 'market traders', 'the shop traders'],
      example: { en: 'Traders raised concerns about the early closing hour.', zh: '商户对提早关门时间提出了担忧。' },
      listening: { zh: 'tray 同韵，结尾 /dəz/ 轻读。', en: 'Rhymes with tray; the final /dəz/ is soft.' },
    },
    {
      term: 'diversion', phonetic: '/daɪˈvɜːʃn/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '绕行路线，改道', en: 'an alternative route when the normal road is closed' },
      usage: { zh: '可数；the bus diversion、follow the diversion。', en: 'Countable: the bus diversion, follow the diversion.' },
      collocations: ['the bus diversion', 'follow the diversion', 'a signed diversion'],
      example: { en: 'The diversion adds ten minutes to the journey.', zh: '绕行让路程多花十分钟。' },
      listening: { zh: '重音在第二音节 /ˈvɜː/，结尾 /ʃn/。', en: 'Stress the second syllable; it ends in /ʃn/.' },
    },
    {
      term: 'residents', phonetic: '/ˈrezɪdənts/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '居民', en: 'people who live in a particular area' },
      usage: { zh: '可数复数；local residents、resident survey。', en: 'Countable plural: local residents, a resident survey.' },
      collocations: ['local residents', 'nearby residents', 'resident feedback'],
      example: { en: 'Residents were asked about the evening traffic.', zh: '居民被问及夜间交通情况。' },
      listening: { zh: '重音在第一音节，词尾 /ts/ 清晰。', en: 'Stress the first syllable; the final /ts/ is clear.' },
    },
  ],
  expressions: [
    {
      phrase: 'run through', sentenceIndex: 0,
      meaning: { zh: '逐一介绍，过一遍', en: 'to explain the main points in order' },
      usage: { zh: '及物短语动词；run through the changes、run through the plan。', en: 'Transitive: run through the changes, run through the plan.' },
      example: { en: 'Let me run through the timetable before you leave.', zh: '你走之前我把时间表过一遍。' },
    },
    {
      phrase: 'apart from', sentenceIndex: 2,
      meaning: { zh: '除……之外', en: 'except for; leaving out' },
      usage: { zh: '后接名词或动名词；与 except for 同义。', en: 'Follow with a noun or gerund; same as except for.' },
      example: { en: 'The street is closed apart from shop deliveries.', zh: '除店铺送货外，街道封闭。' },
    },
    {
      phrase: 'object to', sentenceIndex: 27,
      meaning: { zh: '反对，不赞成', en: 'to be against a proposal or change' },
      usage: { zh: 'object to something；名词 objection。注意 to 是介词。', en: 'object to something; the noun is objection. To is a preposition.' },
      example: { en: 'Residents object to the earlier closing time.', zh: '居民反对提早关门。' },
    },
    {
      phrase: 'provided', sentenceIndex: 26,
      meaning: { zh: '只要，前提是', en: 'on the condition that' },
      usage: { zh: '引导条件从句，常接 that；与 as long as 同义。', en: 'Introduces a condition, often with that; same as as long as.' },
      example: { en: 'They support the plan, provided the noise stops early.', zh: '只要噪音早点结束，他们就支持方案。' },
    },
    {
      phrase: 'set down', sentenceIndex: 37,
      meaning: { zh: '放下（乘客），即停即走', en: 'to let passengers leave a vehicle at the kerb' },
      usage: { zh: 'set down passengers，即路边放下乘客；反义短语是 pick up。', en: 'set down passengers; the opposite is pick up.' },
      example: { en: 'The bus sets down passengers outside the library.', zh: '公交在图书馆外放下乘客。' },
    },
    {
      phrase: 'runs reliably', sentenceIndex: 28,
      meaning: { zh: '运行稳定可靠', en: 'works consistently without breakdowns' },
      usage: { zh: 'run 在此表示“运转”；reliably 修饰路线或服务。', en: 'Run means to operate here; reliably modifies the route or service.' },
      example: { en: 'The replacement route runs reliably at peak hour.', zh: '替代路线高峰时段运行稳定。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白跟着路标走', en: 'Follow the monologue signposts' },
      body: {
        zh: 'Part 2 没有对话提问提示下一题。Deliveries are a key concern、Buses are the next issue、After six months 这些短语标出话题切换，听到就检查自己填到了哪一格。',
        en: 'Nobody asks a question to mark the next item. Deliveries are a key concern, Buses are the next issue and After six months mark topic switches; use them to check your place.',
      },
    },
    {
      title: { zh: '配对题分清态度正负', en: 'Match the stance, not the keyword' },
      body: {
        zh: '同一群体内部也有分歧：多数居民有条件支持，少数居民反对时刻表。先判断态度是支持、担忧还是反对，再去对应选项，别只抓 timetable、seating 这类原词。',
        en: 'Even one group splits: most residents support with conditions, a few oppose the timetable. Judge the stance first, support, worry or reject, then match; do not rely on single keywords like timetable or seating.',
      },
    },
    {
      title: { zh: '数字题核对时段', en: 'Check the time slot in number items' },
      body: {
        zh: '早晨九点和晚间七点是两个不同窗口，题目问早晨截止点，就不要填 seven。听到数字先确认它属于哪个时段。',
        en: 'Nine in the morning and seven at night are two separate windows. The question asks the morning cutoff, so seven is wrong. Match each number to its slot.',
      },
    },
  ],
};
