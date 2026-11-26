import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 52 · Part 2 — 零废弃商店介绍（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白顺序：散装称重 → 容器自带 → 补充装 → 回收计划 → 会员折扣 → 空罐清洗（填空块在前半段），
 * 后半段复述计价方式、自带物品、回收去向与会员权益（单选块）。
 * 题块顺序与录音顺序一致。开场用店内指引，不用 welcome to。
 */
export const test52Part2: ListeningLesson = {
  slug: 'test-52-part-2',
  part: 2,
  status: 'published',
  title: { zh: '零废弃商店介绍', en: 'Introducing a zero-waste shop' },
  summary: {
    zh: '讲解员带顾客逛零废弃商店：散装粮油坚果按重量计价，顾客自带干净容器，墙面补充装提供洗洁精、洗发沐浴液，店铺回收计划把包装退回供应商，会员享九折优惠，空罐可在清洗水槽处理；后半段复述称重计价、自带容器、包装回收去向与会员折扣。',
    en: 'The guide briefs visitors on a zero-waste shop: bulk grains, nuts and pulses sell by weight, customers bring clean own containers, the refill wall supplies washing-up liquid and shampoo, a recycling scheme returns packaging to suppliers, members get a ten percent discount, and empty jars are washed at the sink; the recap covers weighing, containers, packaging return and member discount.',
  },
  accent: { zh: '讲解员为南非口音，语速平稳，流程规则处会重复强调。', en: 'The guide speaks with a South African accent at a steady pace, repeating the rules that matter most.' },
  speechRate: '+8%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Bulk goods are sold by', cells: [[{ blank: 11 }]] },
        { lead: 'Customers bring their own', cells: [[{ blank: 12 }]] },
        { lead: 'Refill section supplies washing-up', cells: [[{ blank: 13 }]] },
        { lead: 'Packaging returned through the shop', cells: [[{ blank: 14 }, { text: ' scheme.' }]] },
        { lead: 'Members receive a', cells: [[{ blank: 15 }, { text: ' discount.' }]] },
        { lead: 'Empty jars can be washed at the shop', cells: [[{ blank: 16 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'How are bulk goods priced?',
          options: [
            { key: 'A', text: 'By the size of the jar you bring.' },
            { key: 'B', text: 'By weight on the scales.' },
            { key: 'C', text: 'By a fixed monthly fee.' },
          ],
        },
        {
          number: 18,
          stem: 'What should customers bring from home?',
          options: [
            { key: 'A', text: 'Their own clean container.' },
            { key: 'B', text: 'Plastic bags from previous shops.' },
            { key: 'C', text: 'A pre-filled order list.' },
          ],
        },
        {
          number: 19,
          stem: 'What does the recycling scheme do with the packaging?',
          options: [
            { key: 'A', text: 'Buys back every old jar at full price.' },
            { key: 'B', text: 'Returns shop packaging to suppliers.' },
            { key: 'C', text: 'Sends waste to general landfill.' },
          ],
        },
        {
          number: 20,
          stem: 'What do shop members receive?',
          options: [
            { key: 'A', text: 'A free starter jar each year.' },
            { key: 'B', text: 'A percentage discount on purchases.' },
            { key: 'C', text: 'Early access to sales events.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['weight'], evidence: 5,
      explanation: {
        zh: '定位句 5：Bulk goods are sold by weight, so you pay for exactly what you scoop out。散装商品按重量出售，填 weight。',
        en: 'Sentence 5: "Bulk goods are sold by weight, so you pay for exactly what you scoop out". Bulk goods sell by weight, so write weight.',
      },
    },
    {
      number: 12, accepted: ['container'], evidence: 7,
      explanation: {
        zh: '定位句 7：Customers bring their own container to cut down on single use packaging。顾客自带容器，填 container。句 8 的 jars、bags、tins 是可用容器的例子。',
        en: 'Sentence 7: "Customers bring their own container to cut down on single use packaging". Customers bring their own container, so write container. Jars, bags and tins in sentence 8 are examples of containers.',
      },
    },
    {
      number: 13, accepted: ['liquid'], evidence: 10,
      explanation: {
        zh: '定位句 10：The refill section along the wall supplies washing-up liquid, shampoo and body wash。补充装供应洗洁精等液体，填 liquid。',
        en: 'Sentence 10: "The refill section along the wall supplies washing-up liquid, shampoo and body wash". The refill section supplies liquid, so write liquid.',
      },
    },
    {
      number: 14, accepted: ['recycling'], evidence: 13,
      explanation: {
        zh: '定位句 13：We also run a packaging recycling scheme for the shop’s own refill materials。包装经店铺回收计划退回，填 recycling；scheme 已印在卷面上。',
        en: 'Sentence 13: "We also run a packaging recycling scheme for the shop’s own refill materials". Packaging goes through the recycling scheme; scheme is printed, so write recycling.',
      },
    },
    {
      number: 15, accepted: ['ten percent'], evidence: 16,
      explanation: {
        zh: '定位句 16：Members of the shop receive a ten percent discount on every purchase。会员享九折优惠，填 ten percent。',
        en: 'Sentence 16: "Members of the shop receive a ten percent discount on every purchase". Members get a ten percent discount, so write ten percent.',
      },
    },
    {
      number: 16, accepted: ['sink'], evidence: 18,
      explanation: {
        zh: '定位句 18：Empty jars you cannot reuse can be washed at the sink near the refill wall。空罐在水槽清洗，填 sink。',
        en: 'Sentence 18: "Empty jars you cannot reuse can be washed at the sink near the refill wall". Jars are washed at the sink, so write sink.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：The scales price everything by weight, not by the size of jar you bring。散装商品按秤上重量计价，对应 B。A 的按罐子大小与句中 not 相反，C 的包月固定费用在录音中没有依据。',
        en: 'Sentence 22: "The scales price everything by weight, not by the size of jar you bring". Pricing by weight matches B. Jar size contradicts not it, and a monthly fee is not said.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：Customers bring their own container, clean and dry, rather than buying new bags each time。顾客自带干净容器，对应 A。B 的旧塑料袋与 rather than 相反，C 的预填清单在录音中没有依据。',
        en: 'Sentence 24: "Customers bring their own container, clean and dry, rather than buying new bags each time". A clean own container matches A. Plastic bags contradict rather than, and a pre-filled list is not said.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：It returns the shop packaging to suppliers for reuse, instead of burying it in landfill。回收计划把包装退回供应商重复使用，对应 B。A 的全价回购旧罐与 C 的送填埋在录音中均未出现。',
        en: 'Sentence 26: "It returns the shop packaging to suppliers for reuse, instead of burying it in landfill". Returning packaging to suppliers matches B. Buying back jars and sending waste to landfill are not mentioned.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：Members get a ten percent discount on purchases, with no free starter jar included。会员享消费折扣，对应 B。A 的免费起始罐与 no free starter jar 相反，C 的优先选购在录音中没有依据。',
        en: 'Sentence 28: "Members get a ten percent discount on purchases, with no free starter jar included". A percentage discount matches B. A free starter jar contradicts no free starter jar, and early access is not said.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'If you have your own container with you, bring it straight to the bulk shelves by the counter.' },
    { speaker: 'guide', text: 'I am Leah, and I will show you around our zero-waste shop before you start shopping.' },
    { speaker: 'guide', text: 'The shop sells everyday goods without the plastic wrapping most supermarkets use.' },
    { speaker: 'guide', text: 'We organise the room by product type, from dry foods to cleaning supplies.' },
    { speaker: 'guide', text: 'The bulk shelves hold grains, nuts, pulses and dried fruit in large open bins.' },
    { speaker: 'guide', text: 'Bulk goods are sold by weight, so you pay for exactly what you scoop out.' },
    { speaker: 'guide', text: 'You weigh your container first, then fill it and weigh it again at the till.' },
    { speaker: 'guide', text: 'Customers bring their own container to cut down on single use packaging.' },
    { speaker: 'guide', text: 'Clean jars, cloth bags and tins all work, as long as they are dry and intact.' },
    { speaker: 'guide', text: 'If you forget yours, spare paper bags are available near the door.' },
    { speaker: 'guide', text: 'The refill section along the wall supplies washing-up liquid, shampoo and body wash.' },
    { speaker: 'guide', text: 'You pour the liquid from the bulk dispenser into the bottle you brought.' },
    { speaker: 'guide', text: 'Refills cost less than a sealed bottle, and the bottle itself keeps coming back.' },
    { speaker: 'guide', text: 'We also run a packaging recycling scheme for the shop’s own refill materials.' },
    { speaker: 'guide', text: 'Empty pouches and caps come back through the scheme and go to the supplier.' },
    { speaker: 'guide', text: 'We do not send these materials to general landfill if they can be reused.' },
    { speaker: 'guide', text: 'Members of the shop receive a ten percent discount on every purchase.' },
    { speaker: 'guide', text: 'The card is free to join, and the discount applies to both bulk goods and refills.' },
    { speaker: 'guide', text: 'Empty jars you cannot reuse can be washed at the sink near the refill wall.' },
    { speaker: 'guide', text: 'Please label any jar you leave, so it can be offered to other customers.' },
    { speaker: 'guide', text: 'Now a few points people often ask on their first visit.' },
    { speaker: 'guide', text: 'How are the bulk goods priced?' },
    { speaker: 'guide', text: 'The scales price everything by weight, not by the size of jar you bring.' },
    { speaker: 'guide', text: 'What should customers bring from home?' },
    { speaker: 'guide', text: 'Customers bring their own container, clean and dry, rather than buying new bags each time.' },
    { speaker: 'guide', text: 'What does the recycling scheme do with the packaging?' },
    { speaker: 'guide', text: 'It returns the shop packaging to suppliers for reuse, instead of burying it in landfill.' },
    { speaker: 'guide', text: 'What do shop members receive?' },
    { speaker: 'guide', text: 'Members get a ten percent discount on purchases, with no free starter jar included.' },
    { speaker: 'guide', text: 'The shop holds a swap table where spare jars can be exchanged between members.' },
    { speaker: 'guide', text: 'Any damaged food on the shelves is removed before it reaches the till.' },
    { speaker: 'guide', text: 'Staff weigh out loose tea and spices on request for smaller quantities.' },
    { speaker: 'guide', text: 'The opening hours match the local market, closing earlier on Sundays.' },
    { speaker: 'guide', text: 'Children are welcome, but small dry goods should stay on the shelves once opened.' },
    { speaker: 'guide', text: 'A small deposit holds a refill bottle for regular customers who forget theirs.' },
    { speaker: 'guide', text: 'Reusable cloth wraps can be bought at the counter for wrapping cheese or bread.' },
    { speaker: 'guide', text: 'The shop does not stock single use plastic cutlery or straws.' },
    { speaker: 'guide', text: 'Donations of clean spare jars are taken at the counter throughout the week.' },
    { speaker: 'guide', text: 'Every month a workshop shows how to reduce waste in the kitchen at home.' },
    { speaker: 'guide', text: 'Receipts are printed on recycled paper, and bags can be skipped if you carry goods yourself.' },
    { speaker: 'guide', text: 'The refill dispensers are cleaned each morning before the shop opens.' },
    { speaker: 'guide', text: 'If a product runs low, staff note it and restock before the next weekend.' },
    { speaker: 'guide', text: 'The prices on the shelf show the unit cost per weight, so you can compare easily.' },
    { speaker: 'guide', text: 'That is the tour for today, and you may browse the bulk shelves whenever you are ready.' },
  ],
  vocabulary: [
    {
      term: 'bulk', phonetic: '/bʌlk/', partOfSpeech: 'adj.', sentenceIndex: 4,
      meaning: { zh: '散装的，大包装按量售卖的', en: 'sold loose from open bins rather than wrapped' },
      usage: { zh: '形容词；bulk shelves、bulk goods、buy in bulk。', en: 'Adjective: bulk shelves, bulk goods, buy in bulk.' },
      collocations: ['bulk shelves', 'bulk goods', 'buy in bulk'],
      example: { en: 'The bulk shelves hold grains, nuts and pulses.', zh: '散装货架摆着谷物、坚果与豆类。' },
      listening: { zh: '单音节，元音 /ʌ/，结尾 /lk/ 读出来。', en: 'One syllable with /ʌ/; pronounce the final /lk/.' },
    },
    {
      term: 'refill', phonetic: '/ˈriːfɪl/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '补充装，二次灌入的货品', en: 'the product poured into a reused bottle rather than a new one' },
      usage: { zh: '可数；the refill section、a refill bottle。动词 refill 重音在后。', en: 'Countable: the refill section. The verb stresses the second syllable.' },
      collocations: ['the refill section', 'a refill bottle', 'the refill dispenser'],
      example: { en: 'The refill section supplies washing-up liquid and shampoo.', zh: '补充装区供应洗洁精与洗发水。' },
      listening: { zh: '名词重音在第一音节 /ˈriː/；结尾 /fɪl/。', en: 'Noun stress on the first syllable; ending /fɪl/.' },
    },
    {
      term: 'container', phonetic: '/kənˈteɪnər/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '容器（自带罐装散装货品）', en: 'the clean jar, bag or tin a customer brings to fill' },
      usage: { zh: '可数；your own container、a clean container。动词 contain。', en: 'Countable: your own container. The verb is contain.' },
      collocations: ['your own container', 'a clean container', 'the container weight'],
      example: { en: 'Customers weigh their own container before filling it.', zh: '顾客先称自带容器的重量再装货。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈteɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'packaging', phonetic: '/ˈpækɪdʒɪŋ/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '包装（可回收退回的材料）', en: 'the pouches, caps and wrapping collected for reuse' },
      usage: { zh: '不可数；packaging recycling、the shop packaging。动词 package。', en: 'Uncountable: packaging recycling. The verb is package.' },
      collocations: ['packaging recycling', 'the shop packaging', 'reuse the packaging'],
      example: { en: 'The scheme returns shop packaging to the supplier.', zh: '该计划把店铺包装退回供应商。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpæk/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'discount', phonetic: '/ˈdɪskaʊnt/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '折扣（会员购物价减免）', en: 'the percentage off a purchase for members' },
      usage: { zh: '可数；a ten percent discount、member discount。', en: 'Countable: a ten percent discount, member discount.' },
      collocations: ['a ten percent discount', 'the member discount', 'a discount on purchases'],
      example: { en: 'Members receive a ten percent discount on every purchase.', zh: '会员每次购物享九折优惠。' },
      listening: { zh: '名词重音在第一音节 /ˈdɪs/；动词 discount 重音在后。', en: 'Noun stress on the first syllable; the verb stresses the second.' },
    },
    {
      term: 'dispenser', phonetic: '/dɪˈspensər/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '分装器，补充装出料龙头', en: 'the bulk tap from which liquid is poured into a bottle' },
      usage: { zh: '可数；the bulk dispenser、refill dispensers。', en: 'Countable: the bulk dispenser, refill dispensers.' },
      collocations: ['the bulk dispenser', 'refill dispensers', 'the dispenser tap'],
      example: { en: 'Pour liquid from the bulk dispenser into your bottle.', zh: '从分装器把液体倒入自带瓶子。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈspen/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'bring their own container', sentenceIndex: 7,
      meaning: { zh: '自带容器购物', en: 'to take a clean jar or bag from home to fill' },
      usage: { zh: 'bring your own + 物品；零废弃场景高频。', en: 'Bring your own plus an item; common in zero waste.' },
      example: { en: 'Customers bring their own container to cut packaging.', zh: '顾客自带容器以减少包装。' },
    },
    {
      phrase: 'single use', sentenceIndex: 7,
      meaning: { zh: '一次性的，只用一次的', en: 'used once then thrown away, such as plastic bags' },
      usage: { zh: 'single use + 名词；环保语境高频。', en: 'Single use plus a noun; common in environmental talk.' },
      example: { en: 'The shop cuts down on single use packaging.', zh: '商店减少一次性包装。' },
    },
    {
      phrase: 'come back through', sentenceIndex: 14,
      meaning: { zh: '经由……回收退回', en: 'to return through the shop scheme to the supplier' },
      usage: { zh: 'come back through + 渠道；回收流程高频。', en: 'Come back through plus a channel; common in recycling.' },
      example: { en: 'Empty pouches come back through the scheme to the supplier.', zh: '空袋经回收计划退回供应商。' },
    },
    {
      phrase: 'on request', sentenceIndex: 31,
      meaning: { zh: '应要求，按需提供', en: 'done only when a customer asks for it' },
      usage: { zh: '状语短语；weigh out on request。', en: 'Adverbial: weigh out on request.' },
      example: { en: 'Staff weigh loose spices on request.', zh: '店员应要求称取少量香料。' },
    },
    {
      phrase: 'on the shelves', sentenceIndex: 33,
      meaning: { zh: '摆在货架上', en: 'displayed ready for sale in the shop' },
      usage: { zh: '地点短语；stay on the shelves。', en: 'Locational phrase: stay on the shelves.' },
      example: { en: 'Dry goods stay on the shelves once opened by a child.', zh: '干货一旦被孩子拆开就留在货架上。' },
    },
    {
      phrase: 'runs low', sentenceIndex: 41,
      meaning: { zh: '所剩不多，即将售罄', en: 'to be nearly out of stock' },
      usage: { zh: 'run low on something；库存表述高频。', en: 'Run low on something; common about stock.' },
      example: { en: 'If a product runs low, staff restock before the weekend.', zh: '货品快售罄时，店员在周末前补货。' },
    },
  ],
  tips: [
    {
      title: { zh: '先看卷面搭配，锁定答案词性', en: 'Use printed collocations to predict the gap' },
      body: {
        zh: '第 11 题空前是 by，填方式名词 weight；第 14 题空后是 scheme，填 recycling；第 15 题空后是 discount，填比例。听前把词性写在空格旁，录音里只等那一类词，避免把相邻的 shampoo、caps 填进去。',
        en: 'Item 11 follows by, expecting a method noun; item 14 precedes scheme, expecting recycling; item 15 precedes discount, expecting a proportion. Note the word class beside each gap, and wait for that class rather than a nearby shampoo or cap.',
      },
    },
    {
      title: { zh: '否定句决定回收类选项', en: 'Negatives decide the recycling options' },
      body: {
        zh: '第 19 题出现 instead of burying it in landfill 这类对比。干扰项常把回收说成填埋或高价回购；听到 instead of、reuse、supplier 时记下包装实际去向，答案取退回供应商那一项。',
        en: 'Item 19 contrasts instead of burying it in landfill. Distractors turn recycling into landfill or buyback; on instead of, reuse and supplier, note where packaging actually goes and choose returning to suppliers.',
      },
    },
    {
      title: { zh: '把规则按话题归堆预读', en: 'Pre-group the rules by topic' },
      body: {
        zh: '称重计价、自带容器、补充装、回收计划、会员折扣是五段并列内容。听前在每题旁标注话题词，独白路标 Bulk goods、Customers bring、The refill section、recycling scheme、Members 出现时直接跳到对应题号。',
        en: 'Weighing, own containers, refills, recycling and member discount are five parallel blocks. Mark topic words beside each gap before listening, and jump to that item on a signpost such as Bulk goods, Customers bring, The refill section, recycling scheme or Members.',
      },
    },
  ],
};
