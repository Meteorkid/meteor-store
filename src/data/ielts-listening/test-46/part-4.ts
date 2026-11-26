import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 46 · Part 4 — 酒店业史讲座（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：路边客栈 → 城镇寄宿屋 → 十九世纪现代酒店 → 铁路与连锁标准化
 * → 旅游经济带动就业 → 客人期待的变化。笔记填空 31–36，单选 37–40。
 */
export const test46Part4: ListeningLesson = {
  slug: 'test-46-part-4',
  part: 4,
  status: 'published',
  title: { zh: '酒店业史', en: 'The history of the hotel industry' },
  summary: {
    zh: '讲座从历史上的路边客栈讲起：客人共用厅堂与草铺，城镇寄宿屋按床出租并登记在册；十九世纪铁路推动现代酒店出现，提供独立房间、明码标价与书面标准；酒店带动城镇旅游与周边就业，客人期待也从一张临时床铺升级为可预订的房间。',
    en: 'The lecture traces roadside inns where guests shared a hall and straw beds, then town lodging houses that rented beds and kept registers. The railway in the nineteenth century brought modern hotels with private rooms, clear prices and written standards. Hotels anchored tourism and nearby jobs, and guest expectations rose from a spare bed to a booked room.',
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
        { lead: 'Earliest accommodation: simple', cells: [[{ blank: 31 }, { text: ' beside the main roads' }]] },
        { lead: 'Lodging houses catered to merchants and other', cells: [[{ blank: 32 }, { text: ' who could pay' }]] },
        { lead: 'The guest paid for a', cells: [[{ blank: 33 }, { text: ', a key and a candle' }]] },
        { lead: 'The keeper kept a register behind a', cells: [[{ blank: 34 }, { text: ' near the entrance' }]] },
        { lead: 'The early tradition of welcome is what we now call', cells: [[{ blank: 35 }]] },
        { lead: 'The railway changed the whole travel', cells: [[{ blank: 36 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'What did guests choose above all in the early motor hotels?',
          options: [
            { key: 'A', text: 'Safety and luxury in every room' },
            { key: 'B', text: 'Price and convenience near their route' },
            { key: 'C', text: 'A famous historical name' },
          ],
        },
        {
          number: 38,
          stem: 'What did the modern hotel promise?',
          options: [
            { key: 'A', text: 'A private room, a clear price and a written standard' },
            { key: 'B', text: 'Free meals for every guest' },
            { key: 'C', text: 'Entertainment in every lobby' },
          ],
        },
        {
          number: 39,
          stem: 'How did hotels affect a town?',
          options: [
            { key: 'A', text: 'They supplied cheap housing for local workers' },
            { key: 'B', text: 'They trained drivers in hotel management' },
            { key: 'C', text: 'They anchored tourism and supported nearby jobs' },
          ],
        },
        {
          number: 40,
          stem: 'What does the lecturer say about changing expectations?',
          options: [
            { key: 'A', text: 'Hotels closed as roads improved' },
            { key: 'B', text: 'Expectations climbed from a spare bed to a booked room' },
            { key: 'C', text: 'Inns replaced private homes as offices' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['inns'], evidence: 3,
      explanation: {
        zh: '定位句 3：The earliest accommodation were simple inns beside the main roads。最早的住宿是大路旁的客栈，填 inns；句 5 的草铺长凳是客栈内部设施，不是住宿类型。',
        en: 'Sentence 3: "The earliest accommodation were simple inns beside the main roads", so write inns. The straw bench in sentence 5 is inside the inn, not the type of accommodation.',
      },
    },
    {
      number: 32, accepted: ['travellers'], evidence: 10,
      explanation: {
        zh: '定位句 10：They catered to merchants and other travellers who could pay。寄宿屋接待商人及其他付得起费用的旅行者，填 travellers；merchants 是并列举例，不是空格所指群体。',
        en: 'Sentence 10: "They catered to merchants and other travellers who could pay", so write travellers. Merchants are a parallel example, not the group the blank names.',
      },
    },
    {
      number: 33, accepted: ['room'], evidence: 13,
      explanation: {
        zh: '定位句 13：The guest paid for a room, a key and a candle for the night。客人为房间、钥匙和蜡烛付费，填 room；句 11 的 bed 是寄宿屋出租单位，与本句付费项不同。',
        en: 'Sentence 13: "The guest paid for a room, a key and a candle for the night", so write room. The bed in sentence 11 is the lodging unit, not this payment item.',
      },
    },
    {
      number: 34, accepted: ['desk'], evidence: 14,
      explanation: {
        zh: '定位句 14：The keeper kept a register behind a desk near the entrance。登记簿放在入口旁的桌子后面，填 desk；register 是登记册本身，不是摆放位置。',
        en: 'Sentence 14: "The keeper kept a register behind a desk near the entrance", so write desk. The register is the book itself, not where it sits.',
      },
    },
    {
      number: 35, accepted: ['hospitality'], evidence: 19,
      explanation: {
        zh: '定位句 19：This early tradition of welcome is what we now call hospitality。早期迎客传统即今日所说的待客之道，填 hospitality；welcome 是句中修饰，不能作为答案词。',
        en: 'Sentence 19: "This early tradition of welcome is what we now call hospitality", so write hospitality. Welcome is the modifier in the sentence, not the answer word.',
      },
    },
    {
      number: 36, accepted: ['industry'], evidence: 22,
      explanation: {
        zh: '定位句 22：The railway changed the whole travel industry。铁路改变了整个旅游业，填 industry；句 23 的更多人负担得起旅行是行业变化的结果。',
        en: 'Sentence 22: "The railway changed the whole travel industry", so write industry. More people affording travel in sentence 23 is a result of the change.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：What guests chose above all was price and convenience near their route。汽车旅馆客人最看重价格与路线便利，对应 B。句 29 的设施系统与句 44 的干净水是后来的期待，不是首要选择。',
        en: 'Sentence 35: "What guests chose above all was price and convenience near their route", matching B. The planned facilities in sentence 29 and clean water in sentence 44 are later expectations, not the top choice.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 37,
      explanation: {
        zh: '定位句 37：The modern hotel promised a private room, a clear price and a written standard。现代酒店承诺独立房间、明码标价与书面标准，对应 A。免费餐食与大堂娱乐在本段未被承诺。',
        en: 'Sentence 37: "The modern hotel promised a private room, a clear price and a written standard", matching A. Free meals and lobby entertainment are not promised in this lecture.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 39,
      explanation: {
        zh: '定位句 39：Hotels anchored tourism in a town and supported nearby jobs in food and transport。酒店锚定城镇旅游并带动周边餐饮交通就业，对应 C。为本地工人提供低价住房与培训司机在录音中没有出现。',
        en: 'Sentence 39: "Hotels anchored tourism in a town and supported nearby jobs in food and transport", matching C. Cheap worker housing and driver training are not mentioned.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 43,
      explanation: {
        zh: '定位句 43：Over time, expectations climbed from a spare bed to a booked room with a view。客人期待从临时床铺升级为可预订的房间，对应 B。酒店随道路改善而关闭、客栈改作办公室均与讲座内容相反。',
        en: 'Sentence 43: "Over time, expectations climbed from a spare bed to a booked room with a view", matching B. Hotels closing as roads improved and inns becoming offices contradict the lecture.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'For most of history, a traveller could expect a bare room, a shared bench and a meal that was whatever the innkeeper had that day.' },
    { speaker: 'lecturer', text: 'Before the modern age, long journeys were slow and expensive.' },
    { speaker: 'lecturer', text: 'People travelled mainly for trade, religion or government work.' },
    { speaker: 'lecturer', text: 'The earliest accommodation were simple inns beside the main roads.' },
    { speaker: 'lecturer', text: 'These inns had a common hall where guests ate and slept together.' },
    { speaker: 'lecturer', text: 'The innkeeper provided bread, ale and a bed of straw on a bench.' },
    { speaker: 'lecturer', text: 'Privacy was rare, and guests shared the fire and the table.' },
    { speaker: 'lecturer', text: 'In towns, taverns and coaching houses served people between stages.' },
    { speaker: 'lecturer', text: 'Horses were changed at these stops, and travellers rested for the night.' },
    { speaker: 'lecturer', text: 'By the seventeenth century, city lodging houses began to appear.' },
    { speaker: 'lecturer', text: 'They catered to merchants and other travellers who could pay.' },
    { speaker: 'lecturer', text: 'A lodging house rented a bed rather than a whole house.' },
    { speaker: 'lecturer', text: 'Meals were often extra, and the rooms were small and plain.' },
    { speaker: 'lecturer', text: 'The guest paid for a room, a key and a candle for the night.' },
    { speaker: 'lecturer', text: 'The keeper kept a register behind a desk near the entrance.' },
    { speaker: 'lecturer', text: 'Names were written in a book, and the price was agreed before sleep.' },
    { speaker: 'lecturer', text: 'Standards varied widely, and some houses were noisy or dirty.' },
    { speaker: 'lecturer', text: 'A letter of introduction from a trusted person helped secure a bed.' },
    { speaker: 'lecturer', text: 'Travellers judged a house by its cleanliness, its food and its owner.' },
    { speaker: 'lecturer', text: 'This early tradition of welcome is what we now call hospitality.' },
    { speaker: 'lecturer', text: 'Hospitality meant offering shelter first, and conversation after.' },
    { speaker: 'lecturer', text: 'The first true hotels appeared in the nineteenth century.' },
    { speaker: 'lecturer', text: 'The railway changed the whole travel industry.' },
    { speaker: 'lecturer', text: 'More people could afford to travel, and journeys became shorter.' },
    { speaker: 'lecturer', text: 'Hotels were built near stations, ports and city centres.' },
    { speaker: 'lecturer', text: 'They offered many rooms under one roof, with a permanent staff.' },
    { speaker: 'lecturer', text: 'Guests no longer dealt with a single keeper but with a manager.' },
    { speaker: 'lecturer', text: 'The hotel kept a printed list of prices and rules for the public.' },
    { speaker: 'lecturer', text: 'Lobbies replaced the old common hall as the meeting space.' },
    { speaker: 'lecturer', text: 'Reception desks, stairs and dining rooms were planned as a system.' },
    { speaker: 'lecturer', text: 'Bathrooms were shared at first, then added to individual rooms as standards rose.' },
    { speaker: 'lecturer', text: 'The twentieth century brought chains that repeated one standard.' },
    { speaker: 'lecturer', text: 'A guest in any city expected the same bed, the same linen and the same bill.' },
    { speaker: 'lecturer', text: 'Tourism grew after the Second World War, and hotels followed the roads.' },
    { speaker: 'lecturer', text: 'Motor hotels opened beside new highways for drivers on long cross-country trips.' },
    { speaker: 'lecturer', text: 'What guests chose above all was price and convenience near their route.' },
    { speaker: 'lecturer', text: 'The early inn had no fixed price and no written guarantee.' },
    { speaker: 'lecturer', text: 'The modern hotel promised a private room, a clear price and a written standard.' },
    { speaker: 'lecturer', text: 'Booking became part of the service, by letter, by telegram and later by phone.' },
    { speaker: 'lecturer', text: 'Hotels anchored tourism in a town and supported nearby jobs in food and transport.' },
    { speaker: 'lecturer', text: 'A large hotel could employ cooks, cleaners, porters, guides and drivers.' },
    { speaker: 'lecturer', text: 'Visitors spent money in local shops, theatres and cafes around the building.' },
    { speaker: 'lecturer', text: 'Cities began to plan their streets around the tourist trade.' },
    { speaker: 'lecturer', text: 'Over time, expectations climbed from a spare bed to a booked room with a view.' },
    { speaker: 'lecturer', text: 'Guests expected clean water, a lock on the door and a reliable meal.' },
    { speaker: 'lecturer', text: 'Service became a proper profession, with training in manners and several languages.' },
    { speaker: 'lecturer', text: 'Hotels also became venues for meetings, weddings and conferences.' },
    { speaker: 'lecturer', text: 'The modern industry now balances comfort, cost and environmental impact.' },
    { speaker: 'lecturer', text: 'Many older inns survive as small hotels, keeping their original character.' },
    { speaker: 'lecturer', text: 'Their history reminds us that shelter has always been the core of the trade.' },
    { speaker: 'lecturer', text: 'Today a traveller can compare prices and rooms before leaving home.' },
    { speaker: 'lecturer', text: 'Yet the basic exchange, a bed and a welcome, has not changed.' },
  ],
  vocabulary: [
    {
      term: 'inns', phonetic: '/ɪnz/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '客栈，路边旅店', en: 'a small old roadside place offering food and a bed' },
      usage: { zh: '可数；复数 inns。roadside inn、country inn。', en: 'Countable; plural inns. Roadside inn, country inn.' },
      collocations: ['simple inns', 'roadside inn', 'the old inn'],
      example: { en: 'Simple inns stood beside the main roads.', zh: '大路旁立着简陋的客栈。' },
      listening: { zh: '单音节短元音 /ɪ/，与 in 同音，靠上下文区分。', en: 'One short vowel /ɪ/, homophone of in; rely on context.' },
    },
    {
      term: 'travellers', phonetic: '/ˈtrævləz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '旅行者，旅客', en: 'a person making a journey, especially for trade or leisure' },
      usage: { zh: '可数；英式双写 l：traveller。动词 travel。', en: 'Countable; British spelling doubles the l. The verb is travel.' },
      collocations: ['other travellers', 'a weary traveller', 'travellers rested'],
      example: { en: 'Lodging houses served travellers who could pay.', zh: '寄宿屋接待付得起费用的旅客。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈtræ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'register', phonetic: '/ˈredʒɪstə/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '登记簿，入住名册', en: 'a book in which guests’ names are recorded' },
      usage: { zh: '可数；keep a register、sign the register。动词 register 指登记。', en: 'Countable: keep a register, sign the register. The verb is register.' },
      collocations: ['a register of names', 'the hotel register', 'keep a register'],
      example: { en: 'The keeper kept a register behind the desk.', zh: '店主在桌后保存登记簿。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈredʒ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'hospitality', phonetic: '/ˌhɒspɪˈtæləti/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '待客之道，殷勤服务', en: 'the friendly and generous reception of guests' },
      usage: { zh: '不可数；tradition of hospitality、hospitality industry。', en: 'Uncountable: tradition of hospitality, hospitality industry.' },
      collocations: ['the tradition of welcome', 'the hospitality trade', 'offer hospitality'],
      example: { en: 'The early welcome tradition is called hospitality.', zh: '早期迎客传统被称为待客之道。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈtæ/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'industry', phonetic: '/ˈɪndəstri/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '行业，产业', en: 'a branch of business or trade, such as travel' },
      usage: { zh: '可数或不可数；travel industry、hotel industry。', en: 'Countable or uncountable: travel industry, hotel industry.' },
      collocations: ['the travel industry', 'the hotel industry', 'the modern industry'],
      example: { en: 'The railway changed the travel industry.', zh: '铁路改变了旅游业。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈɪn/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'convenience', phonetic: '/kənˈviːniəns/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '便利，方便（位置或服务）', en: 'the quality of being easy to reach or use' },
      usage: { zh: '不可数；price and convenience、for convenience。形容词 convenient。', en: 'Uncountable: price and convenience, for convenience. The adjective is convenient.' },
      collocations: ['price and convenience', 'for convenience', 'the convenience of guests'],
      example: { en: 'Guests chose price and convenience near the route.', zh: '客人看重价格与路线便利。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈviː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'anchored', phonetic: '/ˈæŋkəd/', partOfSpeech: 'v.', sentenceIndex: 39,
      meaning: { zh: '使扎根，成为（城镇经济的）支柱', en: 'to give a town a stable base of visitors and trade' },
      usage: { zh: '动词；anchor tourism in a town。名词 anchor 指锚。', en: 'As a verb: anchor tourism in a town. The noun means an anchor.' },
      collocations: ['anchor tourism', 'anchor the local economy', 'an anchor business'],
      example: { en: 'Hotels anchored tourism in the town.', zh: '酒店成为城镇旅游的支柱。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈæŋ/，鼻音 /ŋ/。', en: 'Two syllables stressing the first; nasal /ŋ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'catered to', sentenceIndex: 10,
      meaning: { zh: '接待，迎合（某类客人）', en: 'to provide what a particular group needs' },
      usage: { zh: 'cater to someone；美式也说 cater for。过去式 catered to。', en: 'cater to someone; American English also uses cater for. Past: catered to.' },
      example: { en: 'The houses catered to paying merchants.', zh: '这些寄宿屋接待付费商人。' },
    },
    {
      phrase: 'under one roof', sentenceIndex: 25,
      meaning: { zh: '在同一栋建筑内，集中在一起', en: 'in one building, as a single establishment' },
      usage: { zh: '固定短语；many rooms under one roof。', en: 'A fixed phrase: many rooms under one roof.' },
      example: { en: 'The hotel offered many rooms under one roof.', zh: '酒店在同一栋楼内提供许多房间。' },
    },
    {
      phrase: 'above all', sentenceIndex: 35,
      meaning: { zh: '最重要的是，首先', en: 'more than anything else; most importantly' },
      usage: { zh: '句首或句中作强调；what guests chose above all。', en: 'Emphatic phrase at the start or middle: what guests chose above all.' },
      example: { en: 'Guests chose price above all.', zh: '客人最看重价格。' },
    },
    {
      phrase: 'balances comfort, cost', sentenceIndex: 47,
      meaning: { zh: '在舒适与成本之间取得平衡', en: 'to keep comfort and cost in a fair balance' },
      usage: { zh: '表示在舒适与成本之间权衡；balance comfort, cost and impact。', en: 'balance A and B; balance comfort, cost and impact.' },
      example: { en: 'The industry balances comfort and cost.', zh: '行业在舒适与成本间求平衡。' },
    },
    {
      phrase: 'compare prices', sentenceIndex: 50,
      meaning: { zh: '比较价格', en: 'to check prices across options before booking' },
      usage: { zh: '指预订前比对价格；compare prices and rooms；compare A with B。', en: 'compare prices and rooms; compare A with B.' },
      example: { en: 'Today travellers compare prices online.', zh: '如今旅客在线比较价格。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记填空抓名词短语', en: 'Catch the noun phrase in note completion' },
      body: {
        zh: 'R1 笔记题答案多为句中核心名词：inns、travellers、room、desk、hospitality、industry。听时先定位句子主干，空格前后的介词和冠词能帮你锁定词性与单复数。',
        en: 'R1 note answers are mostly core nouns: inns, travellers, room, desk, hospitality, industry. Locate the sentence skeleton first; prepositions and articles around the blank reveal part of speech and number.',
      },
    },
    {
      title: { zh: '按历史顺序记层次', en: 'Keep the chronological layers' },
      body: {
        zh: '讲座按时间推进：客栈 → 寄宿屋 → 现代酒店 → 汽车旅馆。每个阶段对应一组特点，单选题常问某阶段的选择或承诺；听到时间词（seventeenth century、nineteenth century）就核对当前阶段。',
        en: 'The lecture moves in time: inns, lodging houses, modern hotels, motor hotels. Each stage carries its own features; single-choice questions target one stage’s choice or promise. Match time words (seventeenth century, nineteenth century) to the stage.',
      },
    },
    {
      title: { zh: '区分承诺与背景句', en: 'Promise versus background' },
      body: {
        zh: '现代酒店的承诺由 promised 引出（独立房间、明码标价、书面标准）；背景句只描述设施或期待。选项把背景句改写成承诺是常见干扰，落笔前确认动词是 promised 还是 merely described。',
        en: 'The modern hotel’s promise is introduced by promised (private room, clear price, written standard); background sentences only describe facilities or expectations. An option that turns background into a promise is a common distractor; check whether the verb is promised or merely described.',
      },
    },
  ],
};
