import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 20 · Part 1 — 安排家具送货（双人对话，加拿大 + 美国口音）。原创仿真材料，非官方真题。
 *
 * 生活交易对话：楼层与电梯、拆装服务、时间窗、旧家具回收、损坏申诉。
 * 题块顺序：表单填空 1–6 → 单选 7–10。
 */
export const test20Part1: ListeningLesson = {
  slug: 'test-20-part-1',
  part: 1,
  status: 'published',
  title: { zh: '安排家具送货', en: 'Arranging furniture delivery' },
  summary: {
    zh: '顾客预约家具送货：登记姓氏、楼层与货梯、货品构成、周六上午的时间窗和旧沙发回收，并了解标准运费包含范围、送货队的装配协助、离场前检查与货损申诉流程。',
    en: 'A customer books furniture delivery: surname, floor and goods lift, items ordered, the Saturday morning window and old sofa collection, plus the standard charge, delivery-team assembly help, the pre-departure check and the damage claim process.',
  },
  accent: { zh: '客服为加拿大口音，顾客为美国口音，语速中等。', en: 'The agent speaks with a Canadian accent and the customer with an American accent, at a moderate pace.' },
  speechRate: '+5%',
  cast: [
    { id: 'agent', label: 'AGENT', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Item needing assembly: the', cells: [[{ blank: 2 }]] },
        { lead: 'Apartment: the', cells: [[{ blank: 3 }, { text: ' floor' }]] },
        { lead: 'Building access: a', cells: [[{ blank: 4 }, { text: ' lift' }]] },
        { lead: 'Delivery window: Saturday', cells: [[{ blank: 5 }]] },
        { lead: 'Old item for collection: the', cells: [[{ blank: 6 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'What does the standard delivery charge include?',
          options: [
            { key: 'A', text: 'Carrying items up to the fourth floor where a lift exists' },
            { key: 'B', text: 'Full assembly of every flat-pack item' },
            { key: 'C', text: 'Collection of all old furniture in the flat' },
          ],
        },
        {
          number: 8,
          stem: 'What assembly help will the delivery team provide?',
          options: [
            { key: 'A', text: 'Build the whole wardrobe from the boxes' },
            { key: 'B', text: 'Carry boxes upstairs and tighten loose fittings' },
            { key: 'C', text: 'Replace any panel that arrives scratched' },
          ],
        },
        {
          number: 9,
          stem: 'What should the customer do before the team leaves?',
          options: [
            { key: 'A', text: 'Sign the confirmation email at the depot' },
            { key: 'B', text: 'Check surfaces and keep the packaging' },
            { key: 'C', text: 'Measure the corridor for future orders' },
          ],
        },
        {
          number: 10,
          stem: 'What is the first step if a box arrives damaged?',
          options: [
            { key: 'A', text: 'Return it by post the same day' },
            { key: 'B', text: 'Photograph the damage and note it on the sheet' },
            { key: 'C', text: 'Wait seven days before contacting support' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Nolan'], evidence: 1,
      explanation: {
        zh: '定位句 1：顾客逐字母拼出 Nolan，N, O, L, A, N。拼写题先记首字母 N，再跟读音补全；不要写成 Nollen。',
        en: 'Sentence 1: the customer spells Nolan, N, O, L, A, N. Note the first letter and fill in the rest; do not write Nollen.',
      },
    },
    {
      number: 2, accepted: ['wardrobe'], evidence: 2,
      explanation: {
        zh: '定位句 2：The order shows a wardrobe and a dining table。需要组装的是衣柜，填 wardrobe；餐桌已拼装好，不是题目所问。',
        en: 'Sentence 2: the order shows "a wardrobe and a dining table". The wardrobe needs assembly, so fill wardrobe; the table is already joined.',
      },
    },
    {
      number: 3, accepted: ['third'], evidence: 5,
      explanation: {
        zh: '定位句 5：The third floor. 公寓在三楼，填 third；句 5 的 narrow corridor 是通道情况，不是楼层。',
        en: 'Sentence 5: "The third floor", so fill third. The narrow corridor in the same sentence is the access condition, not the floor.',
      },
    },
    {
      number: 4, accepted: ['goods'], evidence: 7,
      explanation: {
        zh: '定位句 7：a goods lift at the back, big enough for the wardrobe box。电梯是货梯，填 goods；句 8 的 back entrance 是入口位置。',
        en: 'Sentence 7: "a goods lift at the back", so fill goods. The back entrance in sentence 8 is the access point.',
      },
    },
    {
      number: 5, accepted: ['morning'], evidence: 11,
      explanation: {
        zh: '定位句 11：Could it be the morning, around ten? 时间窗是周六上午，填 morning；句 12 的 nine and eleven 是两小时窗口的起止。',
        en: 'Sentence 11: "Could it be the morning, around ten?", so fill morning. Nine and eleven in sentence 12 are the two-hour window limits.',
      },
    },
    {
      number: 6, accepted: ['sofa'], evidence: 13,
      explanation: {
        zh: '定位句 13：There’s an old sofa we want gone。旧家具是沙发，填 sofa；句 14 的 dry and intact 是回收条件。',
        en: 'Sentence 13: "an old sofa we want gone", so fill sofa. Dry and intact in sentence 14 are the collection conditions.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：Up to the fourth floor with a lift is included in the standard rate。标准运费含有电梯条件下上四楼，对应 A。B 的全装配、C 的回收全部旧家具都被后文排除。',
        en: 'Sentence 17: up to the fourth floor with a lift is in the standard rate, matching A. Full assembly and collecting every old item are ruled out later.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：They carry the boxes to the flat and tighten loose fittings。送货队只搬箱和紧固配件，对应 B。整机装配是另购服务，换板不在当日职责内。',
        en: 'Sentence 21: they "carry the boxes to the flat and tighten loose fittings", matching B. Whole assembly is a separate service, and panel replacement is not a day-of duty.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：Check the table surface and the panel edges, and keep the packaging。离场前检查表面边缘并保留包装，对应 B。A 的去门店签字、C 的量走廊均未提及。',
        en: 'Sentence 23: check "the table surface and the panel edges" and keep the packaging, matching B. Depot signing and measuring the corridor are not mentioned.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：Take a photo of the damage before the team leaves, and note it on the delivery sheet。货损先拍照并在单据上记录，对应 B。C 的七天是后续申诉期限，不是第一步。',
        en: 'Sentence 25: "take a photo of the damage before the team leaves, and note it on the delivery sheet", matching B. Seven days in C is the later claim window, not the first step.',
      },
    },
  ],
  transcript: [
    { speaker: 'agent', text: 'I can book your furniture delivery today. Could I have your surname first, please?' },
    { speaker: 'customer', text: 'It’s Nolan, N, O, L, A, N.' },
    { speaker: 'agent', text: 'Thank you. The order shows a wardrobe and a dining table.' },
    { speaker: 'customer', text: 'That’s right. Both are for the new flat on River Street.' },
    { speaker: 'agent', text: 'Which floor are you on, please?' },
    { speaker: 'customer', text: 'The third floor. There’s no step up to the front door, but the corridor is narrow.' },
    { speaker: 'agent', text: 'Is there a lift in the building?' },
    { speaker: 'customer', text: 'Yes, a goods lift at the back, big enough for the wardrobe box.' },
    { speaker: 'agent', text: 'Good. I’ll note that the team should use the back entrance and the goods lift.' },
    { speaker: 'customer', text: 'The wardrobe arrives in flat-pack. The table should already be joined.' },
    { speaker: 'agent', text: 'Noted. We’ll check the table joins on the day.' },
    { speaker: 'customer', text: 'Saturday works best. Could it be the morning, around ten?' },
    { speaker: 'agent', text: 'Saturday morning we can do. Our windows are two hours, so the team arrives between nine and eleven.' },
    { speaker: 'customer', text: 'There’s an old sofa we want gone. Do you collect used furniture?' },
    { speaker: 'agent', text: 'We can take the old sofa away, provided it is dry and not broken into pieces.' },
    { speaker: 'customer', text: 'It’s intact, just too big for the new flat. Is there a charge for that?' },
    { speaker: 'agent', text: 'The collection is included in your delivery fee, but we can only take one item at this price.' },
    { speaker: 'agent', text: 'Now the delivery charge itself. Up to the fourth floor with a lift is included in the standard rate.' },
    { speaker: 'customer', text: 'What about stairs if the lift were out of order?' },
    { speaker: 'agent', text: 'Then the team would call before climbing, and a small stair fee may apply.' },
    { speaker: 'customer', text: 'What do your people actually assemble on the day?' },
    { speaker: 'agent', text: 'They carry the boxes to the flat and tighten loose fittings. Full assembly is a separate service arranged through the website.' },
    { speaker: 'customer', text: 'Should I check anything before the team leaves?' },
    { speaker: 'agent', text: 'Check the table surface and the panel edges, and keep the packaging until you have done that.' },
    { speaker: 'customer', text: 'What if a box reaches the flat with a split side?' },
    { speaker: 'agent', text: 'Take a photo of the damage before the team leaves, and note it on the delivery sheet.' },
    { speaker: 'customer', text: 'And if the wardrobe has a scratched panel inside?' },
    { speaker: 'agent', text: 'Report that within seven days through your account, and we arrange a replacement panel.' },
    { speaker: 'customer', text: 'One access note. The front door opens onto a small courtyard. Tell the driver to ring the left-hand bell.' },
    { speaker: 'agent', text: 'Noted. The confirmation email will show the two-hour window and the contact number.' },
    { speaker: 'customer', text: 'Understood. Thanks for arranging all this.' },
    { speaker: 'agent', text: 'You’re welcome. We’ll see you Saturday morning.' },
    { speaker: 'customer', text: 'The flat is on the second side of the building, so the courtyard path is short.' },
    { speaker: 'agent', text: 'I’ll note the short path on the booking sheet.' },
    { speaker: 'customer', text: 'The dining table needs to go against the north wall.' },
    { speaker: 'agent', text: 'We’ll place each item where you ask, unless the doorway blocks it.' },
    { speaker: 'customer', text: 'The wardrobe will sit beside the window in the bedroom.' },
    { speaker: 'agent', text: 'Fine. The team will ask you to point out each room before carrying things in.' },
    { speaker: 'customer', text: 'That should be quick, since the flat has only two rooms.' },
    { speaker: 'agent', text: 'Good. Please keep your phone reachable on the morning of delivery.' },
  ],
  vocabulary: [
    {
      term: 'delivery', phonetic: '/dɪˈlɪvəri/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '送货，配送', en: 'the act of bringing ordered goods to a home' },
      usage: { zh: '可数/不可数；the delivery fee、book a delivery。动词 deliver。', en: 'Countable or uncountable: the delivery fee, book a delivery; the verb is deliver.' },
      collocations: ['the delivery fee', 'book a delivery', 'the delivery window'],
      example: { en: 'The delivery arrives in a two-hour window.', zh: '送货在两小时窗口内到达。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈlɪv/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'flat-pack', phonetic: '/ˌflæt ˈpæk/', partOfSpeech: 'adj.', sentenceIndex: 9,
      meaning: { zh: '平板包装的（需自行组装）', en: 'sold in boxes to be assembled at home' },
      usage: { zh: '复合形容词；flat-pack wardrobe、flat-pack furniture。', en: 'Compound: flat-pack wardrobe, flat-pack furniture.' },
      collocations: ['flat-pack furniture', 'a flat-pack wardrobe', 'flat-pack boxes'],
      example: { en: 'The wardrobe comes as flat-pack parts.', zh: '衣柜是平板包装零件。' },
      listening: { zh: '复合词重音落在 pack 上。', en: 'Stress falls on pack in the compound.' },
    },
    {
      term: 'corridor', phonetic: '/ˈkɒrɪdɔː/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '走廊，过道', en: 'the narrow passage leading to the front door' },
      usage: { zh: '可数；a narrow corridor、the building corridor。', en: 'Countable: a narrow corridor, the building corridor.' },
      collocations: ['a narrow corridor', 'the corridor width', 'down the corridor'],
      example: { en: 'The box may not fit the narrow corridor.', zh: '箱子可能过不了窄走廊。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkɒ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'goods', phonetic: '/ɡʊdz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '货物；（电梯）货用', en: 'items carried; the lift designed for freight' },
      usage: { zh: 'goods lift、goods entrance；恒用复数。', en: 'Goods lift, goods entrance; always plural.' },
      collocations: ['the goods lift', 'the goods entrance', 'deliver the goods'],
      example: { en: 'The furniture goes up in the goods lift.', zh: '家具走货梯上楼。' },
      listening: { zh: '单音节，与 wood 同尾韵。', en: 'One syllable, rhyming with wood.' },
    },
    {
      term: 'assembly', phonetic: '/əˈsembli/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '组装，装配', en: 'putting the parts together into the finished item' },
      usage: { zh: '不可数；full assembly、assembly service。动词 assemble。', en: 'Uncountable: full assembly, assembly service; the verb is assemble.' },
      collocations: ['full assembly', 'the assembly service', 'self assembly'],
      example: { en: 'Full assembly is booked through the website.', zh: '整机装配通过网站预订。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈsem/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'collection', phonetic: '/kəˈlekʃn/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '回收，上门取走（旧物）', en: 'taking away old furniture from the address' },
      usage: { zh: '可数/不可数；the old furniture collection、arrange a collection。', en: 'Countable or uncountable: arrange a collection.' },
      collocations: ['the furniture collection', 'arrange a collection', 'a free collection'],
      example: { en: 'Old sofa collection is included in the fee.', zh: '旧沙发回收包含在费用里。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈlek/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'damage', phonetic: '/ˈdæmɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '损坏，破损', en: 'harm done to a box or panel in transit' },
      usage: { zh: '不可数；report the damage、damage to the panel。动词同形。', en: 'Uncountable: report the damage; it is also a verb.' },
      collocations: ['report the damage', 'damage to the box', 'undamaged items'],
      example: { en: 'Photograph any damage before signing.', zh: '签字前拍下破损处。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈdæ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'packaging', phonetic: '/ˈpækɪdʒɪŋ/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '包装，包装箱', en: 'the boxes and wrapping protecting an item' },
      usage: { zh: '不可数；keep the packaging、the outer packaging。', en: 'Uncountable: keep the packaging, the outer packaging.' },
      collocations: ['keep the packaging', 'the original packaging', 'discard the packaging'],
      example: { en: 'Keep the packaging until the check is done.', zh: '检查完成前保留包装。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpæk/。', en: 'Three syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'on the day', sentenceIndex: 10,
      meaning: { zh: '送货当天', en: 'on the actual delivery occasion' },
      usage: { zh: '指活动当天；on the day of delivery、check on the day。', en: 'Refers to the actual occasion: on the day of delivery.' },
      example: { en: 'The team checks the joins on the day.', zh: '队伍当天检查拼接处。' },
    },
    {
      phrase: 'take the old sofa away', sentenceIndex: 14,
      meaning: { zh: '上门取走旧沙发', en: 'to collect and remove an old item' },
      usage: { zh: '可分短语动词；take the sofa away，名词 takeaway 另指外卖。', en: 'Separable: take the sofa away. Takeaway also means a meal.' },
      example: { en: 'We can take the old sofa away.', zh: '我们可以把旧沙发取走。' },
    },
    {
      phrase: 'apply', sentenceIndex: 19,
      meaning: { zh: '（费用）适用，收取', en: 'to be charged or relevant in a situation' },
      usage: { zh: '费用或规则适用；a fee may apply、the rule applies to lifts。', en: 'A fee may apply; the rule applies to lifts.' },
      example: { en: 'A stair fee may apply if the lift fails.', zh: '电梯故障时可能收楼层搬运费。' },
    },
    {
      phrase: 'split side', sentenceIndex: 24,
      meaning: { zh: '（箱体）开裂的一侧', en: 'a cracked or torn panel on a box' },
      usage: { zh: 'split 作形容词；a split side、a split panel。', en: 'Split is an adjective here: a split side, a split panel.' },
      example: { en: 'A split side lets dust into the box.', zh: '箱体开裂会让灰尘进去。' },
    },
    {
      phrase: 'keep the packaging', sentenceIndex: 23,
      meaning: { zh: '保留包装不要丢弃', en: 'to hold onto the boxes after delivery' },
      usage: { zh: '退货或换板时常要求保留原包装；keep the packaging until checked。', en: 'Original packaging is often kept for returns or panel swaps.' },
      example: { en: 'Keep the packaging until you inspect the surface.', zh: '检查表面之前别扔包装。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单先记位置再记物', en: 'Note location before item' },
      body: {
        zh: '楼层、电梯、货品、时间窗、旧物是表格五行。听到 third floor、goods lift、wardrobe、morning、sofa 就填到对应行，别把餐桌误当成要组装的物品。',
        en: 'The five form rows are floor, lift, item, window and old item. Match third floor, goods lift, wardrobe, morning and sofa to their rows; do not take the dining table as the flat-pack item.',
      },
    },
    {
      title: { zh: '条件句区分包含与另购', en: 'Conditionals split included and separate' },
      body: {
        zh: '标准运费、装配服务、旧物回收三条线各有前提：有电梯上四楼含在标准价；整机装配是网站另购；回收只含一件。听到 provided、separate、only 就把条件标在选项旁。',
        en: 'Standard charge, assembly and collection each have a condition: up to four floors with a lift is standard; whole assembly is a separate purchase; collection covers one item. Mark conditions beside options at provided, separate and only.',
      },
    },
    {
      title: { zh: '货损流程抓先后顺序', en: 'Damage claim follows a fixed order' },
      body: {
        zh: '货损申诉第一步是离场前拍照并记单，七天内再走账户申诉换板。单选题问 first step 时，别把后面的期限当成当场动作。',
        en: 'The first damage step is to photograph and note it before departure; the seven-day claim and panel swap come later. When the question asks for the first step, do not take the later deadline as an on-the-spot action.',
      },
    },
  ],
};
