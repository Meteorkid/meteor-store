import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 25 · Part 1 — 租用自助仓（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：仓型与面积 → 门禁时段 → 保险方式 → 月租金 → 禁存物品 →
 * 长租折扣 → 签约证件 → 危险材料 → 锁具。表单填空块在前半段，单选块在后半段，
 * 题块顺序与录音顺序一致。开场由租户直接说明来意，不用机构问候加 How can I help you。
 */
export const test25Part1: ListeningLesson = {
  slug: 'test-25-part-1',
  part: 1,
  status: 'published',
  title: { zh: '租用自助仓', en: 'Renting a self-storage unit' },
  summary: {
    zh: '一名租户咨询自助仓：按物品多少确定小仓型与面积，了解门禁开放时段、保险是否可选、月租金与禁止存放的食物，随后确认年租折扣、签约证件、油漆溶剂等危险材料，以及自备挂锁。',
    en: 'A customer enquires about a self-storage unit: the adviser matches him to a small unit by area, and the conversation covers gate access hours, optional insurance, the monthly rent and prohibited food, then the annual discount, the identification needed to sign, hazardous paint and solvents, and the customer’s own padlock.',
  },
  accent: { zh: '仓务顾问为加拿大口音，租户为美式口音。', en: 'The storage adviser speaks with a Canadian accent and the customer with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Unit size', cells: [[{ blank: 1 }]] },
        { lead: 'Floor area', cells: [[{ blank: 2 }, { text: ' square feet' }]] },
        { lead: 'Gate access from', cells: [[{ blank: 3 }, { text: ' in the morning' }]] },
        { lead: 'Insurance', cells: [[{ blank: 4 }]] },
        { lead: 'Monthly rent', cells: [[{ text: '$' }, { blank: 5 }]] },
        { lead: 'Not allowed to store', cells: [[{ blank: 6 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'What discount applies to a twelve-month lease?',
          options: [
            { key: 'A', text: 'One month is free of charge.' },
            { key: 'B', text: 'Ten percent is taken off the monthly rate.' },
            { key: 'C', text: 'No discount is offered for longer leases.' },
          ],
        },
        {
          number: 8,
          stem: 'What must the customer bring to sign the agreement?',
          options: [
            { key: 'A', text: 'photo identification' },
            { key: 'B', text: 'a deposit paid in cash' },
            { key: 'C', text: 'a reference letter from a landlord' },
          ],
        },
        {
          number: 9,
          stem: 'Why can old paint tins not be stored?',
          options: [
            { key: 'A', text: 'They leak and stain the concrete floor.' },
            { key: 'B', text: 'They set off the smoke alarm in the unit.' },
            { key: 'C', text: 'They are classified as hazardous materials.' },
          ],
        },
        {
          number: 10,
          stem: 'What does the adviser say about the unit lock?',
          options: [
            { key: 'A', text: 'The customer brings his own padlock.' },
            { key: 'B', text: 'The centre supplies a free padlock.' },
            { key: 'C', text: 'A keypad code replaces the need for a lock.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['small'], evidence: 3,
      explanation: {
        zh: '定位句 3：Then the small unit should suit you。按物品多少匹配到小仓型；medium 与 large 在本段没有出现。',
        en: 'Sentence 3: "Then the small unit should suit you". The customer is matched to the small unit; medium and large are not mentioned here.',
      },
    },
    {
      number: 2, accepted: ['eighty', '80'], spoken: 'eighty', evidence: 5,
      explanation: {
        zh: '定位句 5：The small unit measures five by ten feet, so the floor area is eighty square feet。面积是八十平方英尺；five by ten 是尺寸，不是面积答案。',
        en: 'Sentence 5: "The small unit measures five by ten feet, so the floor area is eighty square feet". The area is eighty square feet; five by ten are the dimensions, not the area itself.',
      },
    },
    {
      number: 3, accepted: ['seven', '7'], spoken: 'seven', evidence: 9,
      explanation: {
        zh: '定位句 9：The main gate opens at seven in the morning, and it locks again at ten at night。空后已印 in the morning，填 seven；ten at night 是关门时间，不能填进开门空。',
        en: 'Sentence 9: "The main gate opens at seven in the morning, and it locks again at ten at night". In the morning is already printed, so write seven. Ten at night is the closing time, not the opening time.',
      },
    },
    {
      number: 4, accepted: ['optional'], evidence: 13,
      explanation: {
        zh: '定位句 13：Basic cover for fire and theft is optional; it isn’t built into the rent。保险是可选的，不包含在租金内；included 是被否定的说法。',
        en: 'Sentence 13: "Basic cover for fire and theft is optional; it isn’t built into the rent". Insurance is optional and not included in the rent; included is the rejected reading.',
      },
    },
    {
      number: 5, accepted: ['forty', '40'], spoken: 'forty', evidence: 17,
      explanation: {
        zh: '定位句 17：The small unit runs forty dollars a month。小仓月租金四十美元；ten percent 是年租折扣，不是月租金。',
        en: 'Sentence 17: "The small unit runs forty dollars a month". The monthly rent is forty dollars; ten percent is the annual discount, not the rent figure.',
      },
    },
    {
      number: 6, accepted: ['food'], evidence: 19,
      explanation: {
        zh: '定位句 19：Perishable food is not allowed, since it attracts pests and smells through the building。禁止存放易腐食物；paint tins 是句 25 的另一类违禁品，不填本空。',
        en: 'Sentence 19: "Perishable food is not allowed, since it attracts pests and smells through the building". Perishable food is prohibited; paint tins in sentence 25 are a separate banned category.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：A twelve-month lease gives you a ten percent discount on the monthly rate。年租享月租九折，对应 B。A 的免一个月租金和 C 的无折扣在录音中未出现。',
        en: 'Sentence 21: "A twelve-month lease gives you a ten percent discount on the monthly rate". The annual lease takes ten percent off the rate, matching B. A free month and no discount are not mentioned.',
      },
    },
    {
      number: 8, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：Just photo identification, so we can match the contract to your name。签约只需带带照片的身份证件，对应 A。B 的现金押金在句 31 改为刷卡，C 的推荐信被明确说不需要。',
        en: 'Sentence 23: "Just photo identification, so we can match the contract to your name". Photo ID matches A. The deposit in B is paid by card in sentence 31, and a reference letter in C is explicitly not required.',
      },
    },
    {
      number: 9, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：Paint and solvents count as hazardous materials, so we can’t take them at all。油漆属危险材料，对应 C。A 的渗漏染色与 B 的触发烟感在本段没有依据。',
        en: 'Sentence 25: "Paint and solvents count as hazardous materials, so we can’t take them at all". Paint is a hazardous material, matching C. Staining the floor and triggering the alarm are not mentioned here.',
      },
    },
    {
      number: 10, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：The centre doesn’t supply locks. You bring your own padlock, and the key stays with you。锁由租户自备挂锁，对应 A。B 的免费挂锁被否定，C 的密码键盘是大门门禁，不是仓门锁。',
        en: 'Sentence 27: "The centre doesn’t supply locks. You bring your own padlock, and the key stays with you". Customers bring their own padlock, matching A. A free centre lock is rejected, and the keypad code is for the main gate, not the unit.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I’m looking for a storage unit for some boxes and old furniture I can’t keep in my flat.' },
    { speaker: 'adviser', text: 'Good to meet you. We have three size classes here, and I’ll match you once I know how much you have.' },
    { speaker: 'customer', text: 'It’s mostly boxes, maybe a dozen, plus a small table and two chairs.' },
    { speaker: 'adviser', text: 'Then the small unit should suit you. It’s the cheapest size we rent out.' },
    { speaker: 'customer', text: 'Small, fine. How big is that one exactly?' },
    { speaker: 'adviser', text: 'The small unit measures five by ten feet, so the floor area is eighty square feet.' },
    { speaker: 'customer', text: 'Eighty square feet. That sounds enough for what I described.' },
    { speaker: 'adviser', text: 'It should be. You can stack the boxes along the back wall to leave room to walk in.' },
    { speaker: 'customer', text: 'What time can I get in and out? I work late most evenings.' },
    { speaker: 'adviser', text: 'The main gate opens at seven in the morning, and it locks again at ten at night.' },
    { speaker: 'customer', text: 'Seven to ten. Is there anyone on site after that?' },
    { speaker: 'adviser', text: 'No staff overnight, but the entry code keeps the gate closed, and cameras cover the lanes.' },
    { speaker: 'customer', text: 'Do I need insurance for the things I keep inside?' },
    { speaker: 'adviser', text: 'Basic cover for fire and theft is optional; it isn’t built into the rent.' },
    { speaker: 'customer', text: 'Optional. Can I buy it through you, or do I arrange it elsewhere?' },
    { speaker: 'adviser', text: 'We offer a monthly policy at the desk, but you’re welcome to use your own insurer.' },
    { speaker: 'customer', text: 'Right. What’s the monthly rent on the small unit?' },
    { speaker: 'adviser', text: 'The small unit runs forty dollars a month, billed on the first of each month.' },
    { speaker: 'customer', text: 'And what about items I can’t store here. Anything obvious I should avoid?' },
    { speaker: 'adviser', text: 'Perishable food is not allowed, since it attracts pests and smells through the building.' },
    { speaker: 'customer', text: 'Food, right. Is it cheaper if I sign up for a longer period?' },
    { speaker: 'adviser', text: 'Yes. A twelve-month lease gives you a ten percent discount on the monthly rate.' },
    { speaker: 'customer', text: 'Do I need to bring anything to sign the agreement today?' },
    { speaker: 'adviser', text: 'Just photo identification, so we can match the contract to your name.' },
    { speaker: 'customer', text: 'I have some old paint tins in the garage. Would those be a problem?' },
    { speaker: 'adviser', text: 'They would. Paint and solvents count as hazardous materials, so we can’t take them at all.' },
    { speaker: 'customer', text: 'Hazardous, understood. What about the lock on the unit itself?' },
    { speaker: 'adviser', text: 'The centre doesn’t supply locks. You bring your own padlock, and the key stays with you.' },
    { speaker: 'customer', text: 'So I should buy a sturdy padlock before I move anything in.' },
    { speaker: 'adviser', text: 'Exactly. The shop next door sells them, and our reception can order one too if you prefer.' },
    { speaker: 'customer', text: 'Identification only, then. No reference letter or deposit in cash?' },
    { speaker: 'adviser', text: 'The deposit goes on the card when you confirm, and we don’t ask for a reference letter here.' },
    { speaker: 'customer', text: 'When can I start moving things in?' },
    { speaker: 'adviser', text: 'Once the contract is signed and the deposit clears, usually within the same day.' },
    { speaker: 'customer', text: 'That’s quick. Is there a limit on how long I keep the unit?' },
    { speaker: 'adviser', text: 'You can extend month by month, or switch to the annual lease whenever you like.' },
    { speaker: 'customer', text: 'Good. I’ll think about the annual option after the first month.' },
    { speaker: 'adviser', text: 'Fine. Let me take you down to see the small unit before you decide.' },
  ],
  vocabulary: [
    {
      term: 'unit', phonetic: '/ˈjuːnɪt/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '（仓储）隔间，仓库单元', en: 'an individual locked room in a storage centre' },
      usage: { zh: '可数名词；storage unit、small unit、unit size。', en: 'Countable: a storage unit, a small unit, unit size.' },
      collocations: ['a storage unit', 'the small unit', 'rent a unit'],
      example: { en: 'The small unit suits a dozen boxes and a few pieces of furniture.', zh: '小仓能放十二箱和几件家具。' },
      listening: { zh: '两个音节，重音在第一音节；开头 /juː/。', en: 'Two syllables with first-syllable stress; opening /juː/.' },
    },
    {
      term: 'insurance', phonetic: '/ɪnˈʃʊərəns/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '保险', en: 'cover that pays out if stored goods are stolen or damaged' },
      usage: { zh: '不可数；optional insurance、fire and theft insurance。', en: 'Uncountable: optional insurance, fire and theft insurance.' },
      collocations: ['optional insurance', 'buy insurance', 'insurance policy'],
      example: { en: 'Basic cover for fire and theft is optional here.', zh: '基础火灾盗窃险是可选的。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈʃʊə/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'lease', phonetic: '/liːs/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '租约，租期合同', en: 'a formal agreement to rent a space for a fixed period' },
      usage: { zh: '可数；twelve-month lease、annual lease。动词 lease 也表出租。', en: 'Countable: a twelve-month lease, an annual lease. The verb also means to rent out.' },
      collocations: ['a twelve-month lease', 'sign a lease', 'the annual lease'],
      example: { en: 'A twelve-month lease cuts the monthly rate by ten percent.', zh: '签一年租约月租打九折。' },
      listening: { zh: '单音节 /liːs/，结尾 /s/ 清辅音。', en: 'One syllable /liːs/, ending in a voiceless /s/.' },
    },
    {
      term: 'perishable', phonetic: '/ˈperɪʃəbl/', partOfSpeech: 'adj.', sentenceIndex: 19,
      meaning: { zh: '易腐坏的（食物）', en: 'food that goes bad quickly and attracts pests' },
      usage: { zh: '定语；perishable food、perishable goods。', en: 'Attributive: perishable food, perishable goods.' },
      collocations: ['perishable food', 'perishable goods', 'keep perishables'],
      example: { en: 'Perishable food is banned from the storage building.', zh: '易腐食物禁止存入仓储楼。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈper/。', en: 'Four syllables with stress on the first.' },
    },
    {
      term: 'hazardous', phonetic: '/ˈhæzədəs/', partOfSpeech: 'adj.', sentenceIndex: 25,
      meaning: { zh: '危险的，有害的', en: 'dangerous, especially because of chemicals or solvents' },
      usage: { zh: '正式用词；hazardous materials、hazardous waste。', en: 'Formal: hazardous materials, hazardous waste.' },
      collocations: ['hazardous materials', 'hazardous waste', 'classified as hazardous'],
      example: { en: 'Paint and solvents are classified as hazardous materials.', zh: '油漆和溶剂属于危险材料。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈhæ/；结尾 /dəs/。', en: 'Three syllables with stress on the first; ending /dəs/.' },
    },
    {
      term: 'padlock', phonetic: '/ˈpædlɒk/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '挂锁', en: 'a portable lock with a U-shaped shackle' },
      usage: { zh: '可数；bring a padlock、padlock the unit。', en: 'Countable: bring a padlock, padlock the unit.' },
      collocations: ['a sturdy padlock', 'bring your own padlock', 'the unit padlock'],
      example: { en: 'Customers supply their own padlock for the unit door.', zh: '仓门挂锁由客户自备。' },
      listening: { zh: '复合词，两个音节都重读；/dl/ 辅音串。', en: 'A compound with two stresses; keep the /dl/ cluster.' },
    },
    {
      term: 'identification', phonetic: '/aɪˌdentɪfɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '身份证件', en: 'an official card showing who you are' },
      usage: { zh: '不可数；photo identification、show identification。口语常缩写 ID。', en: 'Uncountable: photo identification, show identification. The short form is ID.' },
      collocations: ['photo identification', 'show identification', 'identification required'],
      example: { en: 'Bring photo identification to sign the agreement.', zh: '签约时带带照片的身份证件。' },
      listening: { zh: '六个音节，重音在第五音节 /ˈkeɪ/。', en: 'Six syllables with stress on the fifth.' },
    },
  ],
  expressions: [
    {
      phrase: 'looking for', sentenceIndex: 0,
      meaning: { zh: '寻找，想要找（服务或商品）', en: 'to want to find a particular service or item' },
      usage: { zh: '接待场景开场；looking for a unit、looking for a quote。', en: 'An opening service phrase: looking for a unit, looking for a quote.' },
      example: { en: 'I’m looking for a unit to store some boxes.', zh: '我想找个仓放几个箱子。' },
    },
    {
      phrase: 'built into', sentenceIndex: 13,
      meaning: { zh: '包含在（价格）之内', en: 'included as part of the price rather than charged separately' },
      usage: { zh: 'be built into the rent；与 extra charge 相对。', en: 'Be built into the rent; the opposite of an extra charge.' },
      example: { en: 'Basic insurance is not built into the monthly rent.', zh: '基础保险不包含在月租里。' },
    },
    {
      phrase: 'attracts pests', sentenceIndex: 19,
      meaning: { zh: '招引害虫', en: 'to draw insects or rodents to the stored items' },
      usage: { zh: 'attract 后接害虫；food attracts pests。', en: 'Attract plus pests: food attracts pests.' },
      example: { en: 'Open food attracts pests through the building.', zh: '敞开的食物会把害虫引进楼里。' },
    },
    {
      phrase: 'count as', sentenceIndex: 25,
      meaning: { zh: '算作，归类为', en: 'to be classified as a particular type' },
      usage: { zh: 'count as hazardous、count as a deposit，后面接名词类别。', en: 'Count as plus a noun: count as hazardous, count as a deposit.' },
      example: { en: 'Paint and solvents count as hazardous materials.', zh: '油漆和溶剂算作危险材料。' },
    },
    {
      phrase: 'match the contract to', sentenceIndex: 23,
      meaning: { zh: '把合同与（身份）对应起来', en: 'to link a signed agreement to the person who signed it' },
      usage: { zh: 'match 此处指核对对应；match the contract to your name。', en: 'Here match means align: match the contract to your name.' },
      example: { en: 'Identification matches the contract to the named customer.', zh: '身份证件把合同和署名人对应起来。' },
    },
    {
      phrase: 'within the same day', sentenceIndex: 33,
      meaning: { zh: '当天之内', en: 'inside the same twenty-four hours, without waiting for another day' },
      usage: { zh: '时间状语；within the same day、within a week。', en: 'Adverbial: within the same day, within a week.' },
      example: { en: 'The unit can be opened within the same day.', zh: '当天就可以开仓使用。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单字段先判词性', en: 'Predict the gap type from the row label' },
      body: {
        zh: '第 1 题问仓型类别填形容词 small，第 2 题问面积填数字 eighty，第 4 题问保险是否包含填形容词 optional。听前在每行旁标出要填的类型，听到对应词性再落笔。',
        en: 'Item 1 asks for a size class (small), item 2 for an area figure (eighty), and item 4 for whether insurance is included (optional). Note the expected type beside each row before listening.',
      },
    },
    {
      title: { zh: '数字先归到对应的费用行', en: 'Assign each number to its fee row' },
      body: {
        zh: 'forty dollars 是月租金，ten percent 是年租折扣，eighty square feet 是面积。听到数字先对照空格属于哪一行，别把折扣比例填进租金空。',
        en: 'Forty dollars is the monthly rent, ten percent is the annual discount, and eighty square feet is the area. Match each number to its row before writing it down.',
      },
    },
    {
      title: { zh: '违禁物品分两类听', en: 'Keep the two banned categories apart' },
      body: {
        zh: '食物因招虫有异味被禁，油漆溶剂因属危险材料被禁。第 6 题问 Not allowed to store，题干没有限定类别，按先出现的食物作答；油漆题在第 9 题单选里再考。',
        en: 'Food is banned for attracting pests and smells, while paint and solvents are banned as hazardous. Item 6 asks the general prohibited item and takes the first mentioned, food; the paint question returns in item 9.',
      },
    },
  ],
};
