import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 24 · Part 1 — 预订城堡一日游（双人对话，澳式口音）。原创仿真材料，非官方真题。
 *
 * 对话顺序：出发地点 → 门票是否另付 → 午餐内容 → 儿童票价 → 成人价包含项 → 取消条款 →
 * 导游称呼、时长、儿童陪同年龄、返程停靠点。前填空块、单选块、后填空块依次推进。
 */
export const test24Part1: ListeningLesson = {
  slug: 'test-24-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预订城堡一日游', en: 'Booking a coach tour to a castle' },
  summary: {
    zh: '游客预订周六前往 Redcastle Castle 的大巴一日游：确认出发点是市政厅而非火车站，城堡门票另付，团费含打包午餐；了解五到十二岁儿童票价、成人价包含项目与提前两天取消全额退款的条款，并记下导游名字、行程时长、八岁以下儿童须有成人陪同以及返程河边咖啡馆停靠点。',
    en: 'A customer books the Saturday coach trip to Redcastle Castle: departure from the town hall, a separate castle ticket, and a packed lunch included. The conversation covers the child fare, what the adult price includes, the two-day full-refund rule, the guide’s name, trip length, the under-eight companion rule and the café stop.',
  },
  accent: { zh: '咨询员与顾客均为澳式口音，对话语速中等。', en: 'The adviser and the customer both speak with Australian accents, at a moderate pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-AU-NatashaNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Coach departs from the town', cells: [[{ blank: 1 }]] },
        { lead: 'Castle entry ticket is', cells: [[{ blank: 2 }]] },
        { lead: 'Lunch provided: a', cells: [[{ blank: 3 }, { text: ' lunch' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'How much does a child pay on this tour?',
          options: [
            { key: 'A', text: 'Fifteen dollars for ages five to twelve' },
            { key: 'B', text: 'Free for every child over five' },
            { key: 'C', text: 'Twenty dollars for children under five' },
          ],
        },
        {
          number: 5,
          stem: 'What does the standard adult price include?',
          options: [
            { key: 'A', text: 'The castle entry ticket and keep rooms' },
            { key: 'B', text: 'Coach travel, packed lunch and a grounds walk' },
            { key: 'C', text: 'A hot lunch served at the inn' },
          ],
        },
        {
          number: 6,
          stem: 'What is the cancellation rule?',
          options: [
            { key: 'A', text: 'Full refund with two days’ notice before departure' },
            { key: 'B', text: 'Half the fee is returned when the customer is unwell' },
            { key: 'C', text: 'No refund is possible after booking' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Tour guide (first name)', cells: [[{ blank: 7 }]] },
        { lead: 'Outing lasts roughly eight', cells: [[{ blank: 8 }]] },
        { lead: 'Children under', cells: [[{ blank: 9 }, { text: ' must stay with an adult' }]] },
        { lead: 'Return trip stops at the riverside', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['hall'], evidence: 2,
      explanation: {
        zh: '定位句 2：That one leaves on Saturday morning from the town hall, not the railway station。出发点是市政厅，填 hall；火车站是被排除的干扰地点。',
        en: 'Sentence 2: the coach leaves "from the town hall, not the railway station". The meeting point is the town hall; the railway station is the distractor.',
      },
    },
    {
      number: 2, accepted: ['separate'], evidence: 6,
      explanation: {
        zh: '定位句 6：The castle ticket is separate; the driver can sell you one on the coach。门票需另购，填 separate。',
        en: 'Sentence 6: "the castle ticket is separate", so fill separate. The driver can sell one on the coach, but it is not in the tour fee.',
      },
    },
    {
      number: 3, accepted: ['packed'], evidence: 8,
      explanation: {
        zh: '定位句 8：A packed lunch goes with every booking, made up of a sandwich, fruit and a drink。团费含打包午餐，填 packed；句 10 的热餐是自付项目。',
        en: 'Sentence 8: "a packed lunch goes with every booking", so fill packed. The hot plates at the inn in sentence 10 are paid for separately.',
      },
    },
    {
      number: 4, accepted: ['A'], evidence: 12,
      explanation: {
        zh: '定位句 12：Children between five and twelve pay fifteen dollars; under five ride free with an adult。五到十二岁付十五元，对应 A。B 的五岁以上全免、C 的五岁以下二十元均与原文相反。',
        en: 'Sentence 12: "children between five and twelve pay fifteen dollars", matching A. Free entry over five and a twenty-dollar under-five charge contradict the transcript.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：The coach travel, the packed lunch and the guided walk around the castle grounds。成人价含车费、打包午餐和场地导览，对应 B。门票与主楼房间在句 6、16 均需另付或自行参观。',
        en: 'Sentence 14: the price covers "coach travel, the packed lunch and the guided walk around the castle grounds", matching B. The ticket and keep rooms are excluded in sentences 6 and 16.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：You can cancel two days before departure and get the full tour fee back。提前两天取消全额退款，对应 A。句 20 的扣半价适用于两天以内，不是生病即可退半价。',
        en: 'Sentence 18: cancel "two days before departure and get the full tour fee back", matching A. The half-fee kept in sentence 20 applies inside the two-day window, not on medical grounds alone.',
      },
    },
    {
      number: 7, accepted: ['Nora'], evidence: 28,
      explanation: {
        zh: '定位句 28：Her surname is Ellison, but please call her Nora once you are on the coach。要填的名字是 Nora；Ellison 是姓氏，题目问 first name。',
        en: 'Sentence 28: her surname is Ellison, "but please call her Nora". The requested first name is Nora; Ellison is the surname.',
      },
    },
    {
      number: 8, accepted: ['hours'], evidence: 30,
      explanation: {
        zh: '定位句 30：Roughly eight hours, back in town by five in the afternoon。全程约八小时，题干已印 eight，填 hours。',
        en: 'Sentence 30: "roughly eight hours", so fill hours; eight is already printed in the row.',
      },
    },
    {
      number: 9, accepted: ['eight'], evidence: 32,
      explanation: {
        zh: '定位句 32：Children under eight must stay with an adult in every part of the grounds。八岁以下须有成人陪同，填 eight。',
        en: 'Sentence 32: "children under eight must stay with an adult", so fill eight.',
      },
    },
    {
      number: 10, accepted: ['café'], evidence: 36,
      explanation: {
        zh: '定位句 36：One short stop at the riverside café, about twenty minutes for tea。返程在河边咖啡馆停靠，填 café。',
        en: 'Sentence 36: one short stop "at the riverside café", so fill café. The twenty minutes are the stop length, not the place.',
      },
    },
  ],
  transcript: [
    { speaker: 'adviser', text: 'Which tour are you looking at today, sir?' },
    { speaker: 'customer', text: 'The Saturday coach trip up to Redcastle Castle. I’ve seen the poster outside the café.' },
    { speaker: 'adviser', text: 'That one leaves on Saturday morning from the town hall, not the railway station.' },
    { speaker: 'customer', text: 'Good, the town hall is a five-minute walk from my flat.' },
    { speaker: 'adviser', text: 'Fine. The coach boards at eight forty-five and rolls off at nine sharp.' },
    { speaker: 'customer', text: 'Does the price cover entry into the castle itself?' },
    { speaker: 'adviser', text: 'The castle ticket is separate; the driver can sell you one on the coach if you like.' },
    { speaker: 'customer', text: 'What about food? Is lunch included in the tour fee?' },
    { speaker: 'adviser', text: 'A packed lunch goes with every booking, made up of a sandwich, fruit and a drink.' },
    { speaker: 'customer', text: 'I was hoping for something hot at the inn.' },
    { speaker: 'adviser', text: 'The inn serves hot plates after the tour, but you pay for those yourself.' },
    { speaker: 'customer', text: 'How much does the child fare come to, by the way?' },
    { speaker: 'adviser', text: 'Children between five and twelve pay fifteen dollars; under five ride free with an adult.' },
    { speaker: 'customer', text: 'And what does the standard adult price include?' },
    { speaker: 'adviser', text: 'The coach travel, the packed lunch and the guided walk around the castle grounds.' },
    { speaker: 'customer', text: 'Is the guide available all afternoon inside the keep?' },
    { speaker: 'adviser', text: 'The walk covers the grounds and the courtyard; the keep rooms are explored on your own.' },
    { speaker: 'customer', text: 'What happens if I have to cancel, say, because I’m unwell?' },
    { speaker: 'adviser', text: 'You can cancel two days before departure and get the full tour fee back.' },
    { speaker: 'customer', text: 'And inside those two days?' },
    { speaker: 'adviser', text: 'Then we keep half the fee, unless the coach itself is cancelled for bad weather.' },
    { speaker: 'customer', text: 'That sounds fair. Can I put my name down for two adults and one child?' },
    { speaker: 'adviser', text: 'Certainly. I’ll note the adult, the adult and the seven-year-old child.' },
    { speaker: 'customer', text: 'What should we bring on board?' },
    { speaker: 'adviser', text: 'A warm coat and sensible shoes. The grounds are grassy and can be muddy.' },
    { speaker: 'customer', text: 'Is there room on the coach for large bags?' },
    { speaker: 'adviser', text: 'Only one small bag per seat. Bigger cases go in the hold with your name tag.' },
    { speaker: 'customer', text: 'Who is the guide meeting us at the town hall?' },
    { speaker: 'adviser', text: 'Her surname is Ellison, but please call her Nora once you are on the coach.' },
    { speaker: 'customer', text: 'How long does the whole outing take from pickup to drop-off?' },
    { speaker: 'adviser', text: 'Roughly eight hours, back in town by five in the afternoon.' },
    { speaker: 'customer', text: 'The seven-year-old is happy on long walks, but how strict is the keep age limit?' },
    { speaker: 'adviser', text: 'Children under eight must stay with an adult in every part of the grounds.' },
    { speaker: 'customer', text: 'We’ll make sure one of us stays close to her.' },
    { speaker: 'adviser', text: 'Good. The confirmation email lists the pickup time and the seat numbers.' },
    { speaker: 'customer', text: 'One last question. Does the coach stop anywhere on the way back?' },
    { speaker: 'adviser', text: 'One short stop at the riverside café, about twenty minutes for tea.' },
    { speaker: 'customer', text: 'Perfect. I’ll pay by the card on file.' },
    { speaker: 'adviser', text: 'Done. The seat reservation shows three names, and the driver will call them on Saturday.' },
  ],
  vocabulary: [
    {
      term: 'coach', phonetic: '/kəʊtʃ/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '长途旅游大巴', en: 'the large bus used for group day trips' },
      usage: { zh: '可数；the coach tour、board the coach。', en: 'Countable: the coach tour, board the coach.' },
      collocations: ['the coach tour', 'board the coach', 'the coach driver'],
      example: { en: 'The coach leaves from the town hall.', zh: '大巴从市政厅出发。' },
      listening: { zh: '单音节，与 go 押韵尾韵不同，注意 /tʃ/ 尾音。', en: 'One syllable; mind the final /tʃ/.' },
    },
    {
      term: 'separate', phonetic: '/ˈseprət/', partOfSpeech: 'adj.', sentenceIndex: 6,
      meaning: { zh: '另行收费的，分开的', en: 'paid for apart from the tour fee' },
      usage: { zh: '形容词；ticket is separate、separate charge。动词 /ˈsepəreɪt/。', en: 'Adjective: a separate charge; the verb is pronounced /ˈsepəreɪt/.' },
      collocations: ['a separate ticket', 'paid separately', 'a separate charge'],
      example: { en: 'The castle ticket is separate.', zh: '城堡门票需另付。' },
      listening: { zh: '形容词三个音节，重音在第一音节 /ˈsep/。', en: 'Three syllables; adjective stress on the first.' },
    },
    {
      term: 'packed lunch', phonetic: '/pækt lʌntʃ/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '打包午餐，便当', en: 'the prepared meal carried on the trip' },
      usage: { zh: '可数/不可数；a packed lunch、pack a lunch。', en: 'Countable or uncountable: pack a lunch.' },
      collocations: ['a packed lunch', 'make a packed lunch', 'bring a packed lunch'],
      example: { en: 'A packed lunch goes with every booking.', zh: '每份预订都含打包午餐。' },
      listening: { zh: 'packed 的 /kt/ 在快读中可弱化为 /k/。', en: 'The /kt/ in packed may soften to /k/ in fast speech.' },
    },
    {
      term: 'fare', phonetic: '/feə/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '车费，票价', en: 'the amount charged for a seat on the trip' },
      usage: { zh: '可数；the child fare、the adult fare、pay the fare。', en: 'Countable: the child fare, the adult fare.' },
      collocations: ['the child fare', 'the adult fare', 'the return fare'],
      example: { en: 'Children between five and twelve pay the child fare.', zh: '五到十二岁付儿童票价。' },
      listening: { zh: '单音节，与 fair 同音。', en: 'One syllable, homophone of fair.' },
    },
    {
      term: 'grounds', phonetic: '/ɡraʊndz/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '（城堡）场地，庭园', en: 'the open land belonging to the castle' },
      usage: { zh: '恒用复数；the castle grounds、walk the grounds。', en: 'Always plural: the castle grounds, walk the grounds.' },
      collocations: ['the castle grounds', 'the palace grounds', 'the grounds walk'],
      example: { en: 'The walk covers the castle grounds.', zh: '步行路线覆盖城堡场地。' },
      listening: { zh: '单音节带复数 /z/，与 ground 同根。', en: 'One syllable plus plural /z/, from ground.' },
    },
    {
      term: 'cancel', phonetic: '/ˈkænsl/', partOfSpeech: 'v.', sentenceIndex: 17,
      meaning: { zh: '取消（预订）', en: 'to pull out of a booked trip' },
      usage: { zh: '动词；cancel two days ahead、cancel the booking。名词 cancellation。', en: 'Verb: cancel the booking; the noun is cancellation.' },
      collocations: ['cancel the booking', 'cancel two days ahead', 'cancel the tour'],
      example: { en: 'You can cancel two days before departure.', zh: '提前两天可以取消。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈleɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'hold', phonetic: '/həʊld/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '（大巴）行李舱', en: 'the luggage compartment under the coach' },
      usage: { zh: '可数；go in the hold、the luggage hold。', en: 'Countable: go in the hold, the luggage hold.' },
      collocations: ['the luggage hold', 'go in the hold', 'under the hold'],
      example: { en: 'Bigger cases go in the hold.', zh: '大件箱子放进行李舱。' },
      listening: { zh: '单音节，与 cold 尾韵相同。', en: 'One syllable, rhyming with cold.' },
    },
  ],
  expressions: [
    {
      phrase: 'on the coach', sentenceIndex: 6,
      meaning: { zh: '在大巴车上', en: 'inside the bus during the trip' },
      usage: { zh: '介词短语；buy a ticket on the coach、meet on the coach。', en: 'On the coach, not in the coach; compare on the train.' },
      example: { en: 'The driver can sell a ticket on the coach.', zh: '司机可在车上卖票。' },
    },
    {
      phrase: 'put my name down', sentenceIndex: 21,
      meaning: { zh: '登记报名，占位', en: 'to reserve a seat under one’s name' },
      usage: { zh: '短语动词；put your name down for two adults。', en: 'Put your name down for a place; the informal sign-up.' },
      example: { en: 'Can I put my name down for two adults?', zh: '我能登记两个成人位吗？' },
    },
    {
      phrase: 'pay for', sentenceIndex: 10,
      meaning: { zh: '为……另行付款', en: 'to cover the cost of something separately' },
      usage: { zh: 'pay for the hot meal、pay for the ticket；宾语放 for 后。', en: 'Pay for the item; the object follows for.' },
      example: { en: 'You pay for the hot plates yourself.', zh: '热餐由你自己付款。' },
    },
    {
      phrase: 'on your own', sentenceIndex: 16,
      meaning: { zh: '自行，没有陪同', en: 'without a guide or another person' },
      usage: { zh: '固定短语；explore the rooms on your own。', en: 'On your own means alone; compare by yourself.' },
      example: { en: 'The keep rooms are explored on your own.', zh: '主楼房间自行参观。' },
    },
    {
      phrase: 'on the way back', sentenceIndex: 35,
      meaning: { zh: '返程途中', en: 'during the return trip' },
      usage: { zh: '固定短语；stop on the way back、call on the way back。', en: 'On the way back, not on the return way.' },
      example: { en: 'The coach stops at the café on the way back.', zh: '大巴返程时在咖啡馆停靠。' },
    },
  ],
  tips: [
    {
      title: { zh: '先记地点再记是否含票', en: 'Note place before included-or-not' },
      body: {
        zh: '前三空分别是出发点、门票是否另付、午餐类型。听到 town hall 别写成 railway station；separate 表示门票不含；packed lunch 是团餐，hot plates 是自付。',
        en: 'The first three blanks are meeting point, ticket status and meal type. Town hall beats the railway station; separate means excluded; packed lunch is the tour meal, while hot plates are paid extra.',
      },
    },
    {
      title: { zh: '票价按年龄段分层听', en: 'Listen to fare bands by age' },
      body: {
        zh: '儿童票价分两段：五到十二岁十五元，五岁以下随成人免费。单选题问儿童付多少，别把免费段和付费段混成一项。',
        en: 'The child fare has two bands: fifteen dollars for five to twelve, under five free with an adult. Do not merge the free band into the paid band.',
      },
    },
    {
      title: { zh: '取消条款抓时间分界', en: 'Pin the cutoff date in cancellation rules' },
      body: {
        zh: '取消规则以两天为界：提前两天全额退，两天以内扣半价；天气原因取消另说。听到 two days、full fee、half the fee 就把分界标在选项旁。',
        en: 'Cancellation splits at two days: full refund before that, half fee kept inside it; operator cancellation for weather is separate. Mark two days, full fee and half fee beside the options.',
      },
    },
  ],
};
