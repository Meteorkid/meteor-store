import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 46 · Part 2 — 酒店水疗设施介绍（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：预订方式 → 疗程时长 → 着装与自带物品 → 禁忌症 → 取消政策，
 * 随后把五处设施（面部护理、按摩、蒸汽房、美甲、泳池）配对到对应规则。
 */
export const test46Part2: ListeningLesson = {
  slug: 'test-46-part-2',
  part: 2,
  status: 'published',
  title: { zh: '酒店水疗设施介绍', en: 'Introducing hotel spa facilities' },
  summary: {
    zh: '水疗负责人向住客介绍：在水疗台预约，标准疗程六十分钟，内穿宽松衣物并自备首饰之外的换洗衣物；高血压者避免蒸汽房，孕妇须告知前台；二十四小时前可免费取消。面部护理要求素颜到店，按摩用精油放松肌肉，蒸汽房限时二十分钟，美甲含手部手臂抛光，泳池允许十二岁以上儿童使用。',
    en: 'The spa host covers desk bookings, the sixty-minute session, loose clothing under the robe, blood-pressure advice for the steam room, pregnant guests telling reception, and free cancellation within twenty-four hours. The facial needs bare skin, the massage uses warm oils, the steam room has a twenty-minute limit, the manicure ends with a hand-and-arm polish, the pool admits children over twelve.',
  },
  accent: { zh: '发言人为新西兰口音，语速中等偏慢。', en: 'The speaker has a New Zealand accent and speaks at a moderate pace.' },
  speechRate: '+2%',
  cast: [
    { id: 'host', label: 'HOST', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Bookings are made at the spa', cells: [[{ blank: 11 }]] },
        { lead: 'Standard session lasts', cells: [[{ blank: 12 }, { text: ' minutes' }]] },
        { lead: 'Wear loose', cells: [[{ blank: 13 }, { text: ' underneath the robe' }]] },
        { lead: 'High', cells: [[{ blank: 14 }, { text: ' guests should avoid the steam room' }]] },
        { lead: 'Free cancellation up to', cells: [[{ blank: 15 }, { text: ' hours before' }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which description applies to each facility? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'uses warm oils to ease stiff muscles' },
        { key: 'B', text: 'requires no makeup on arrival' },
        { key: 'C', text: 'has a time limit of twenty minutes' },
        { key: 'D', text: 'needs a medical note for first-time guests' },
        { key: 'E', text: 'finishes with a hand-and-arm polish' },
        { key: 'F', text: 'can be used by children over twelve' },
      ],
      items: [
        { number: 16, text: 'facial' },
        { number: 17, text: 'massage' },
        { number: 18, text: 'steam room' },
        { number: 19, text: 'manicure' },
        { number: 20, text: 'swimming pool' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['desk'], evidence: 2,
      explanation: {
        zh: '定位句 2：you reserve a place at the spa desk, either when you check in or by calling extension forty from your room。预约在水疗台办理，填 desk；extension forty 是房间电话分机，不是办理地点。',
        en: 'Sentence 2: "you reserve a place at the spa desk, either when you check in or by calling extension forty from your room". Bookings go through the spa desk, so write desk. Extension forty is the room line, not the booking place.',
      },
    },
    {
      number: 12, accepted: ['sixty', '60'], evidence: 3,
      explanation: {
        zh: '定位句 3：Our standard session lasts sixty minutes, including time to change and to relax after the treatment。标准疗程六十分钟，sixty 与 60 都得分；句 4 的 thirty 是短疗程时长，不是标准档。',
        en: 'Sentence 3: "Our standard session lasts sixty minutes, including time to change and to relax after the treatment". The standard session is sixty minutes; sixty and 60 both fit. Thirty in sentence 4 is the short option, not the standard length.',
      },
    },
    {
      number: 13, accepted: ['clothing'], evidence: 5,
      explanation: {
        zh: '定位句 5：we provide a robe and slippers, but guests should wear loose clothing underneath and leave jewellery in their locker。浴袍内穿宽松衣物，填 clothing；robe 与 slippers 是场地提供的，不是自备着装。',
        en: 'Sentence 5: "we provide a robe and slippers, but guests should wear loose clothing underneath and leave jewellery in their locker". Under the robe wear loose clothing, so write clothing. The robe and slippers are supplied on site.',
      },
    },
    {
      number: 14, accepted: ['blood pressure'], evidence: 8,
      explanation: {
        zh: '定位句 8：If you have high blood pressure, you should avoid the steam room and the heat pool until your doctor has said it is safe。高血压者避免蒸汽房，填 blood pressure；句 9 的孕妇属于另一类提醒，不能混填。',
        en: 'Sentence 8: "If you have high blood pressure, you should avoid the steam room and the heat pool until your doctor has said it is safe". High blood pressure guests avoid the steam room, so write blood pressure. Pregnant guests in sentence 9 are a separate warning.',
      },
    },
    {
      number: 15, accepted: ['twenty-four', '24'], evidence: 10,
      explanation: {
        zh: '定位句 10：Cancellations are free up to twenty-four hours before the booked time。二十四小时前可免费取消，twenty-four 与 24 都得分；句 11 的满额扣费是过了这个窗口之后的规则。',
        en: 'Sentence 10: "Cancellations are free up to twenty-four hours before the booked time". Free cancellation lasts twenty-four hours ahead; twenty-four and 24 both fit. The full charge in sentence 11 applies after that window.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：the facial room, where guests arrive without makeup so the therapist can prepare the skin properly。面部护理要求素颜到店，对应 B。D 的首次就诊医疗证明在本段没有归给面部护理。',
        en: 'Sentence 13: "the facial room, where guests arrive without makeup so the therapist can prepare the skin properly". The facial needs bare skin, matching B. The medical note in D is not assigned to the facial.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 14,
      explanation: {
        zh: '定位句 14：the massage room, where warm oils are used to ease stiff muscles and tired shoulders。按摩用暖油放松僵硬肌肉，对应 A。',
        en: 'Sentence 14: "the massage room, where warm oils are used to ease stiff muscles and tired shoulders". The massage uses warm oils for stiff muscles, matching A.',
      },
    },
    {
      number: 18, accepted: ['C'], evidence: 15,
      explanation: {
        zh: '定位句 15：the steam room, a small tiled room with a time limit of twenty minutes。蒸汽房限时二十分钟，对应 C。句 20 的桑拿房座位数是另一设施的信息。',
        en: 'Sentence 15: "the steam room, a small tiled room with a time limit of twenty minutes". The steam room has a twenty-minute limit, matching C. The sauna seating in sentence 20 belongs to another facility.',
      },
    },
    {
      number: 19, accepted: ['E'], evidence: 16,
      explanation: {
        zh: '定位句 16：The manicure corner finishes each visit with a hand-and-arm polish, and the nails are filed before any colour goes on。美甲含手部手臂抛光，对应 E。',
        en: 'Sentence 16: "The manicure corner finishes each visit with a hand-and-arm polish, and the nails are filed before any colour goes on". The manicure ends with a hand-and-arm polish, matching E.',
      },
    },
    {
      number: 20, accepted: ['F'], evidence: 17,
      explanation: {
        zh: '定位句 17：the swimming pool, which can be used by children over twelve, provided an adult stays at the poolside。泳池允许十二岁以上儿童使用，对应 F。句 39 补充十二岁以下须有家人陪同，不是独立规则。',
        en: 'Sentence 17: "the swimming pool, which can be used by children over twelve, provided an adult stays at the poolside". The pool admits children over twelve, matching F. Under-twelves needing a family member in sentence 39 is an extra condition.',
      },
    },
  ],
  transcript: [
    { speaker: 'host', text: 'Before the tour of the hotel, let me explain how the spa facilities work, since most guests ask about them at reception.' },
    { speaker: 'host', text: 'The spa is on the third floor, beside the indoor pool, and it opens from eight in the morning until nine at night.' },
    { speaker: 'host', text: 'To book a treatment, you reserve a place at the spa desk, either when you check in or by calling extension forty from your room.' },
    { speaker: 'host', text: 'Our standard session lasts sixty minutes, including time to change and to relax after the treatment.' },
    { speaker: 'host', text: 'Some short options run thirty minutes, mainly for the steam room and the express facial.' },
    { speaker: 'host', text: 'For dress, we provide a robe and slippers, but guests should wear loose clothing underneath and leave jewellery in their locker.' },
    { speaker: 'host', text: 'If you are visiting for a massage, a towel is provided, so there is nothing extra to bring.' },
    { speaker: 'host', text: 'A few health conditions mean you should check with the therapist before booking.' },
    { speaker: 'host', text: 'If you have high blood pressure, you should avoid the steam room and the heat pool until your doctor has said it is safe.' },
    { speaker: 'host', text: 'Pregnant guests are welcome for gentle treatments, but they must tell the reception desk on arrival.' },
    { speaker: 'host', text: 'Cancellations are free up to twenty-four hours before the booked time, and you can change the date at no cost in that window.' },
    { speaker: 'host', text: 'Inside that twenty-four hours, the full charge still applies, unless the treatment is moved by the spa itself.' },
    { speaker: 'host', text: 'Now let me describe the five facilities you can see from the corridor.' },
    { speaker: 'host', text: 'First, the facial room, where guests arrive without makeup so the therapist can prepare the skin properly.' },
    { speaker: 'host', text: 'Next, the massage room, where warm oils are used to ease stiff muscles and tired shoulders.' },
    { speaker: 'host', text: 'Then the steam room, a small tiled room with a time limit of twenty minutes, for guests who need to loosen up.' },
    { speaker: 'host', text: 'The manicure corner finishes each visit with a hand-and-arm polish, and the nails are filed before any colour goes on.' },
    { speaker: 'host', text: 'Finally the swimming pool, which can be used by children over twelve, provided an adult stays at the poolside.' },
    { speaker: 'host', text: 'The pool itself is heated to twenty-eight degrees, and lane swimming is allowed before nine in the morning.' },
    { speaker: 'host', text: 'Towels are stacked beside the changing rooms, and there are lockers for personal belongings.' },
    { speaker: 'host', text: 'The sauna next to the steam room seats eight, and guests are asked to sit on a towel rather than on the wooden bench.' },
    { speaker: 'host', text: 'The relaxation room has reclining chairs, herbal tea and quiet music after any treatment.' },
    { speaker: 'host', text: 'Therapists hold certificates in massage and facial care, and they update their training each year.' },
    { speaker: 'host', text: 'The spa stock a range of oils, creams and polish in the cupboard, and guests can buy the same products at the front desk.' },
    { speaker: 'host', text: 'A first visit always starts with a short consultation about any aches, allergies or skin sensitivities.' },
    { speaker: 'host', text: 'If a guest has an allergy to a particular product, the therapist chooses a substitute from the shelf.' },
    { speaker: 'host', text: 'The treatment list is posted on the notice board outside, and times can be reserved up to two weeks ahead.' },
    { speaker: 'host', text: 'Group bookings for hen parties are welcome in the afternoon, with a shared room for up to six guests.' },
    { speaker: 'host', text: 'The spa does not allow food or drink inside the treatment rooms, apart from water in the relaxation area.' },
    { speaker: 'host', text: 'Glasses are not brought into the sauna, to keep the wooden surfaces dry.' },
    { speaker: 'host', text: 'Guests with long hair are asked to tie it back before using the pool.' },
    { speaker: 'host', text: 'The changing rooms contain showers, hair dryers and a full-length mirror near the exit.' },
    { speaker: 'host', text: 'A therapist can advise on the best package if you are unsure between a facial and a massage.' },
    { speaker: 'host', text: 'The evening slots are the busiest, so early booking is recommended for those times.' },
    { speaker: 'host', text: 'Weekend mornings are quieter, and guests often add a swim after their treatment.' },
    { speaker: 'host', text: 'The spa reception keeps a record of each guest’s preferences for the next visit.' },
    { speaker: 'host', text: 'If you feel unwell at any point during a treatment, tell the therapist straight away.' },
    { speaker: 'host', text: 'Staff check the heat levels in the steam room twice an hour during busy periods.' },
    { speaker: 'host', text: 'The poolside cafe serves light snacks and smoothies after a session.' },
    { speaker: 'host', text: 'Children under twelve use the pool only with a family member, never on their own.' },
    { speaker: 'host', text: 'A locker key is issued at the desk, and lost keys carry a small replacement fee.' },
    { speaker: 'host', text: 'The spa towels are laundered each day, and fresh ones are laid out every morning.' },
    { speaker: 'host', text: 'There is no dress code for the relaxation room, though guests are asked to cover up away from the treatment beds.' },
    { speaker: 'host', text: 'Booking extensions are possible if the therapist has a free slot, and they are charged by the extra half hour.' },
    { speaker: 'host', text: 'The whole floor is kept quiet, and phones are switched to silent near the treatment rooms.' },
    { speaker: 'host', text: 'Thank you for your attention, and the reception desk can take bookings after this tour.' },
  ],
  vocabulary: [
    {
      term: 'reserve', phonetic: '/rɪˈzɜːv/', partOfSpeech: 'v.', sentenceIndex: 2,
      meaning: { zh: '预订，预留（时段）', en: 'to keep a time or place available for someone' },
      usage: { zh: 'reserve a place、reserve a slot；名词 reservation。', en: 'reserve a place, reserve a slot; the noun is reservation.' },
      collocations: ['reserve a place', 'reserve a treatment', 'reserve ahead'],
      example: { en: 'Guests reserve a treatment at the spa desk.', zh: '客人在水疗台预约疗程。' },
      listening: { zh: '动词重音在第二音节；名词 reserve 重音在第一音节，靠词性区分。', en: 'The verb stresses the second syllable; the noun stresses the first.' },
    },
    {
      term: 'session', phonetic: '/ˈseʃn/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '一次疗程，一段使用时间', en: 'one period of treatment or use at the spa' },
      usage: { zh: '可数；standard session、a thirty-minute session。', en: 'Countable: standard session, a thirty-minute session.' },
      collocations: ['the standard session', 'a short session', 'the treatment session'],
      example: { en: 'The standard session lasts sixty minutes.', zh: '标准疗程持续六十分钟。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈse/，结尾 /ʃn/。', en: 'Two syllables with stress on the first; ending /ʃn/.' },
    },
    {
      term: 'robe', phonetic: '/rəʊb/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '浴袍，宽松长袍', en: 'a loose garment worn over swimwear or a treatment outfit' },
      usage: { zh: '可数；spa robe、put on a robe。', en: 'Countable: spa robe, put on a robe.' },
      collocations: ['a spa robe', 'the robe and slippers', 'wear a robe'],
      example: { en: 'The spa provides a robe and slippers for guests.', zh: '水疗为客人提供浴袍和拖鞋。' },
      listening: { zh: '单音节，长元音 /əʊ/，与 robed（穿长袍的）区分。', en: 'One syllable with /əʊ/; distinguish from robed.' },
    },
    {
      term: 'blood pressure', phonetic: '/blʌd ˈpreʃə/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '血压', en: 'the force of blood against the walls of the arteries' },
      usage: { zh: '不可数；high blood pressure、check blood pressure。', en: 'Uncountable: high blood pressure, check blood pressure.' },
      collocations: ['high blood pressure', 'low blood pressure', 'blood pressure condition'],
      example: { en: 'High blood pressure guests should avoid the steam room.', zh: '高血压客人应避免蒸汽房。' },
      listening: { zh: 'pressure 两个音节，重音在第一音节；blood 中 /d/ 轻读。', en: 'Pressure stresses the first syllable; the /d/ in blood is soft.' },
    },
    {
      term: 'cancellations', phonetic: '/ˌkænsəˈleɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '取消（预约）', en: 'the act of calling off a booked treatment' },
      usage: { zh: '可数或不可数；free cancellation、make a cancellation。动词 cancel。', en: 'Countable or uncountable: free cancellation. The verb is cancel.' },
      collocations: ['free cancellation', 'the cancellation window', 'late cancellation'],
      example: { en: 'Free cancellation runs up to twenty-four hours ahead.', zh: '二十四小时前可免费取消。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈleɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'therapist', phonetic: '/ˈθerəpɪst/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '理疗师，护理师', en: 'a trained staff member who carries out spa treatments' },
      usage: { zh: '可数；massage therapist、facial therapist。动词 therapy 指疗法。', en: 'Countable: massage therapist, facial therapist. Therapy is the treatment.' },
      collocations: ['the massage therapist', 'the facial therapist', 'ask the therapist'],
      example: { en: 'The therapist uses warm oils on stiff muscles.', zh: '理疗师用暖油放松僵硬肌肉。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈθer/，开头 /θ/ 要咬舌。', en: 'Three syllables stressing the first; the opening /θ/ is dental.' },
    },
    {
      term: 'polish', phonetic: '/ˈpɒlɪʃ/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '抛光，护理膏；手部手臂打磨', en: 'a smooth finishing treatment on nails, hands or arms' },
      usage: { zh: '可数或不可数；hand-and-arm polish、nail polish。动词 polish。', en: 'Countable or uncountable: hand-and-arm polish, nail polish. The verb is polish.' },
      collocations: ['a hand-and-arm polish', 'nail polish', 'the finishing polish'],
      example: { en: 'The manicure finishes with a hand-and-arm polish.', zh: '美甲以手部手臂抛光收尾。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpɒ/，结尾 /ʃ/。', en: 'Two syllables with stress on the first; ending /ʃ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'check in', sentenceIndex: 2,
      meaning: { zh: '办理入住登记', en: 'to arrive at a hotel and register as a guest' },
      usage: { zh: '及物可分；check in at the desk、check in your bag。', en: 'Separable: check in at the desk, check in your bag.' },
      example: { en: 'You can book when you check in at reception.', zh: '你可以在前台办理入住时预订。' },
    },
    {
      phrase: 'avoid the steam room', sentenceIndex: 8,
      meaning: { zh: '避开蒸汽房', en: 'not to use the steam room for health reasons' },
      usage: { zh: 'avoid 后接名词或动名词；avoid the heat pool 同理。', en: 'Avoid takes a noun or gerund; avoid the heat pool works the same way.' },
      example: { en: 'Guests with high blood pressure avoid the steam room.', zh: '高血压客人避开蒸汽房。' },
    },
    {
      phrase: 'change the date', sentenceIndex: 10,
      meaning: { zh: '改期，更换预约时间', en: 'to move a booking to another day or time' },
      usage: { zh: 'change the date at no cost；change the booking 同义。', en: 'change the date at no cost; change the booking means the same.' },
      example: { en: 'You may change the date within the free window.', zh: '免费时段内可以改期。' },
    },
    {
      phrase: 'stays at the poolside', sentenceIndex: 17,
      meaning: { zh: '留在泳池边陪护', en: 'remaining beside the pool while a child swims' },
      usage: { zh: 'poolside 作地点副词；an adult stays at the poolside。', en: 'Poolside acts as an adverb: an adult stays at the poolside.' },
      example: { en: 'An adult must stay at the poolside throughout.', zh: '成人必须全程留在泳池边。' },
    },
    {
      phrase: 'tie it back', sentenceIndex: 30,
      meaning: { zh: '把头发扎起来', en: 'to fasten long hair away from the face and neck' },
      usage: { zh: '可分短语动词；tie the hair back，代词放中间：tie it back。', en: 'Separable: tie the hair back; put the pronoun in the middle, tie it back.' },
      example: { en: 'Long hair should be tied back before swimming.', zh: '游泳前应把长发扎起。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白信号词标出段落', en: 'Follow the monologue signposts' },
      body: {
        zh: 'Part 2 没有对话提问提示下一题。First、Next、Then、Finally 依次引出五处设施，听到这些词就核对配对项是否走到对应设施。',
        en: 'Nobody asks a question to mark the next item, but First, Next, Then and Finally order the five facilities. Use them to check which matching item you are on.',
      },
    },
    {
      title: { zh: '配对选项缩成关键词', en: 'Reduce options to keywords' },
      body: {
        zh: '六个选项记整句很困难。每项留一个关键词：oils、makeup、twenty minutes、medical note、polish、children，听时拿关键词对设施，而不是逐句翻译。',
        en: 'Do not memorise six full sentences. Keep one keyword per option: oils, makeup, twenty minutes, medical note, polish, children, and match keywords to facilities.',
      },
    },
    {
      title: { zh: '分清规则与附加条件', en: 'Rule versus extra condition' },
      body: {
        zh: '配对题问的是设施对应规则。泳池条目里十二岁以上是主规则，句 39 的十二岁以下须家人陪同是补充；落笔前确认选项说的是该设施的核心规则。',
        en: 'Matching asks for the facility’s rule. For the pool, over twelve is the main rule, while under-twelves needing a family member in sentence 39 is an extra condition. Confirm the option names the core rule before choosing.',
      },
    },
  ],
};
