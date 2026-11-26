import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 6 · Part 4 — 二手市场的经济学（单人讲座，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 结构：信息不对称定义 → 阿克洛夫二手车模型与隐藏缺陷 → 平台评价与信任 → 定价上下限
 * → 循环经济定位 → 公平价格、虚假评价与环境局限。笔记填空 31–36 按讲座顺序，单选 37–40 落在后半段。
 */
export const test06Part4: ListeningLesson = {
  slug: 'test-06-part-4',
  part: 4,
  status: 'published',
  title: { zh: '二手市场的经济学', en: 'The economics of second-hand markets' },
  summary: {
    zh: '讲座解释二手市场里的信息不对称、阿克洛夫的二手车模型、平台评价如何重建信任、买卖双方的定价界限，以及旧物再利用在循环经济中的位置与局限。',
    en: 'A lecture explains information asymmetry in second-hand markets, Akerlof’s used-car model, how platform ratings rebuild trust, the pricing limits on each side, and where reuse fits in the circular economy, along with its limits.',
  },
  accent: { zh: '讲师为新西兰口音，术语会放慢并重复。', en: 'The lecturer has a New Zealand accent and slows down for key terms.' },
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
        { lead: 'In second-hand markets, sellers usually know more than the', cells: [[{ blank: 31 }]] },
        { lead: 'Akerlof studied the problem using the used', cells: [[{ blank: 32 }, { text: ' market' }]] },
        { lead: 'Buyers lower their offers because they fear hidden', cells: [[{ blank: 33 }]] },
        { lead: 'Platforms reduce distrust through positive', cells: [[{ blank: 34 }]] },
        { lead: 'The buyer’s maximum', cells: [[{ blank: 35 }, { text: ' is the most they will pay' }]] },
        { lead: 'Reusing goods supports the', cells: [[{ blank: 36 }, { text: ' economy' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'Why does the lecturer say a fair price is not the cheapest possible price?',
          options: [
            { key: 'A', text: 'Both sides should feel they have done reasonably well.' },
            { key: 'B', text: 'The seller must pay for a warranty on every item.' },
            { key: 'C', text: 'The buyer chooses the lowest price available.' },
          ],
        },
        {
          number: 38,
          stem: 'What happens when platform reviews can be faked?',
          options: [
            { key: 'A', text: 'Buyers trust the reviews more after moderation.' },
            { key: 'B', text: 'Sellers offer refunds to protect their reputation.' },
            { key: 'C', text: 'Buyers learn to discount them and the system weakens.' },
          ],
        },
        {
          number: 39,
          stem: 'What is the lecturer’s overall view of second-hand trade?',
          options: [
            { key: 'A', text: 'It will replace most new shopping within a decade.' },
            { key: 'B', text: 'It is useful but not a complete environmental solution.' },
            { key: 'C', text: 'It only works for goods that still look new.' },
          ],
        },
        {
          number: 40,
          stem: 'What environmental benefit does keeping goods in circulation provide?',
          options: [
            { key: 'A', text: 'It extends product life and reduces waste.' },
            { key: 'B', text: 'It removes the need to transport goods.' },
            { key: 'C', text: 'It cuts all demand for raw materials.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['buyer'], evidence: 5,
      explanation: {
        zh: '定位句 5：sellers usually know far more about the item than the buyer。空前提到 know more than the，填名词 buyer；句 6 的 faults 是卖方掌握的信息，不是空格要填的对象。',
        en: 'Sentence 5: "sellers usually know far more about the item than the buyer". The gap follows know more than the, so buyer fits. The faults in sentence 6 are what sellers know, not the missing word.',
      },
    },
    {
      number: 32, accepted: ['car'], evidence: 8,
      explanation: {
        zh: '定位句 8：a famous paper on the used car market。题目已给 used 和 market，填 car。句 10 的 reliable car 是举例中的车，不是模型名称里的品类。',
        en: 'Sentence 8: "a famous paper on the used car market". Used and market are printed, so fill car. The reliable car in sentence 10 is an example, not the model’s category.',
      },
    },
    {
      number: 33, accepted: ['defects'], evidence: 11,
      explanation: {
        zh: '定位句 11：Because they fear hidden defects, they offer a price that reflects the average quality。hidden defects 是固定搭配“隐藏缺陷”；句 12 的 good cars 是被挤出市场的一方，不能填。',
        en: 'Sentence 11: "Because they fear hidden defects, they offer a price that reflects the average quality". Hidden defects is the fixed phrase. The good cars in sentence 12 are pushed out, not the answer.',
      },
    },
    {
      number: 34, accepted: ['ratings'], evidence: 19,
      explanation: {
        zh: '定位句 19：A seller with many years of positive ratings is easier to trust。positive ratings 对应题目里的 positive；句 20 的 descriptions 和 photographs 是另外两类信任机制，不能混填。',
        en: 'Sentence 19: "A seller with many years of positive ratings is easier to trust", matching the printed positive. Descriptions and photographs in sentence 20 are separate trust mechanisms.',
      },
    },
    {
      number: 35, accepted: ['offer'], evidence: 24,
      explanation: {
        zh: '定位句 24：Every buyer has a maximum offer, the most they would pay before walking away。与卖方的 reservation price 对举，买方一侧的上限是 maximum offer。',
        en: 'Sentence 24: "Every buyer has a maximum offer, the most they would pay before walking away". Balancing the seller’s reservation price, the buyer’s upper limit is the maximum offer.',
      },
    },
    {
      number: 36, accepted: ['circular'], evidence: 31,
      explanation: {
        zh: '定位句 31：the bigger picture of the circular economy。题目已给 economy，填形容词 circular；注意拼写 c-i-r-c-u-l-a-r。',
        en: 'Sentence 31: "the bigger picture of the circular economy". Economy is printed, so fill the adjective circular. Spell it c-i-r-c-u-l-a-r.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：the price at which both sides feel they have done reasonably well, rather than one side losing out。公平价要让双方都觉得合理，对应 A。B 的保修由卖方承担在句 17 只是降低买方风险的手段；C 与原意相反。',
        en: 'Sentence 36: "the price at which both sides feel they have done reasonably well, rather than one side losing out", matching A. The warranty in B is only a risk-reduction device in sentence 17, and C contradicts the idea.',
      },
    },
    {
      number: 38, accepted: ['C'], evidence: 38,
      explanation: {
        zh: '定位句 38：When reviews can be faked, buyers learn to discount them, and the whole system weakens。评价可造假时买家会打折看待，信任体系随之变弱，对应 C。A 把审核之后的信任说反了；B 的退款在本段没有出现。',
        en: 'Sentence 38: "When reviews can be faked, buyers learn to discount them, and the whole system weakens", matching C. A reverses trust after moderation, and the refunds in B are not mentioned here.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 40,
      explanation: {
        zh: '定位句 40：This does not mean second-hand trade solves environmental problems by itself。讲师认为有用但不能独立解决环境问题，对应 B。A 的十年内取代新购物、C 的只适用于外观崭新的商品都与讲座相反。',
        en: 'Sentence 40: "This does not mean second-hand trade solves environmental problems by itself", matching B: useful but incomplete. A, replacing new shopping within a decade, and C, only goods that look new, both contradict the lecture.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 42,
      explanation: {
        zh: '定位句 42：extending the life of products is one of the clearest ways to reduce waste。延长产品寿命、减少浪费对应 A。B 错在运输仍有成本（句 41），C 错在原材料需求只是被推迟而非消除。',
        en: 'Sentence 42: "extending the life of products is one of the clearest ways to reduce waste", matching A. B ignores the transport cost in sentence 41, and C understates that raw-material demand is delayed, not removed.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Consider the last thing you bought second hand, whether it was a textbook, a jacket or a bicycle.' },
    { speaker: 'lecturer', text: 'Most of us assume we got a fair price, but second-hand markets work on a different set of rules from ordinary shops.' },
    { speaker: 'lecturer', text: 'Today we will look at why these markets exist, how prices are negotiated, and what keeps buyers and sellers trusting each other.' },
    { speaker: 'lecturer', text: 'We begin with the problem economists call information asymmetry.' },
    { speaker: 'lecturer', text: 'In any market, the two sides do not always know the same things about the product.' },
    { speaker: 'lecturer', text: 'In second-hand markets, sellers usually know far more about the item than the buyer.' },
    { speaker: 'lecturer', text: 'They have owned it, they know how it has been treated, and they know its faults.' },
    { speaker: 'lecturer', text: 'The buyer, by contrast, sees only a short inspection and whatever the seller chooses to say.' },
    { speaker: 'lecturer', text: 'This gap was studied in detail by the economist George Akerlof, in a famous paper on the used car market.' },
    { speaker: 'lecturer', text: 'His model showed how a lack of trust can pull an entire market toward lower quality.' },
    { speaker: 'lecturer', text: 'Imagine a buyer who cannot tell a reliable car from a damaged one.' },
    { speaker: 'lecturer', text: 'Because they fear hidden defects, they offer a price that reflects the average quality they expect.' },
    { speaker: 'lecturer', text: 'Good cars then appear too cheap to sell, and their owners keep them off the market.' },
    { speaker: 'lecturer', text: 'The cars that remain are the weaker ones, which further lowers what buyers are willing to pay.' },
    { speaker: 'lecturer', text: 'This downward spiral is what Akerlof described in his analysis.' },
    { speaker: 'lecturer', text: 'In practice, buyers and sellers have found ways around the problem.' },
    { speaker: 'lecturer', text: 'One basic method is inspection, where a third party examines the item and reports its condition.' },
    { speaker: 'lecturer', text: 'Another is the warranty, which passes some of the risk from the buyer back to the seller.' },
    { speaker: 'lecturer', text: 'Online platforms have done something larger, by turning reputation into a visible commodity.' },
    { speaker: 'lecturer', text: 'A seller with many years of positive ratings is easier to trust than an unknown face across a table.' },
    { speaker: 'lecturer', text: 'Verified descriptions, photographs and payment protection all reduce the fear of being cheated.' },
    { speaker: 'lecturer', text: 'These mechanisms matter because trade cannot grow when people are afraid of losing money.' },
    { speaker: 'lecturer', text: 'Now let us turn to pricing, the second part of our topic.' },
    { speaker: 'lecturer', text: 'Every seller has a reservation price, the lowest amount at which they are willing to sell.' },
    { speaker: 'lecturer', text: 'Every buyer has a maximum offer, the most they would pay before walking away.' },
    { speaker: 'lecturer', text: 'A transaction can happen only when the buyer’s maximum offer exceeds the seller’s reservation price.' },
    { speaker: 'lecturer', text: 'The space between those two figures is where the price is negotiated.' },
    { speaker: 'lecturer', text: 'In a second-hand market, prices are rarely fixed, and bargaining is part of the normal process.' },
    { speaker: 'lecturer', text: 'Sellers may start high to leave room to move down, while buyers open low to leave room to move up.' },
    { speaker: 'lecturer', text: 'Comparable sales set an anchor, and a similar item sold last week gives both sides a reference point.' },
    { speaker: 'lecturer', text: 'Condition, age and included accessories all shift that anchor up or down.' },
    { speaker: 'lecturer', text: 'We should place this trade inside the bigger picture of the circular economy.' },
    { speaker: 'lecturer', text: 'When an item is reused rather than thrown away, it delays the need to manufacture a replacement.' },
    { speaker: 'lecturer', text: 'Manufacturing new goods consumes raw materials, energy and water, and it produces waste.' },
    { speaker: 'lecturer', text: 'Keeping a useful object in circulation for another owner avoids some of that cost.' },
    { speaker: 'lecturer', text: 'A fair price is not the cheapest possible price.' },
    { speaker: 'lecturer', text: 'It is the price at which both sides feel they have done reasonably well, rather than one side losing out.' },
    { speaker: 'lecturer', text: 'Trust in a platform rests on three things, which are consistent rules, honest reviews, and a clear route to complain.' },
    { speaker: 'lecturer', text: 'When reviews can be faked, buyers learn to discount them, and the whole system weakens.' },
    { speaker: 'lecturer', text: 'Platforms therefore invest in moderation, in identity checks and in dispute resolution.' },
    { speaker: 'lecturer', text: 'This does not mean second-hand trade solves environmental problems by itself.' },
    { speaker: 'lecturer', text: 'Some goods are too worn to repair, and transport between buyers and sellers also has a cost.' },
    { speaker: 'lecturer', text: 'Still, extending the life of products is one of the clearest ways to reduce waste.' },
    { speaker: 'lecturer', text: 'To sum up, second-hand markets face a trust problem caused by unequal information.' },
    { speaker: 'lecturer', text: 'Reputation systems and inspection help to close that gap, and prices are set between two private limits.' },
    { speaker: 'lecturer', text: 'Beyond the money, this trade keeps materials in use longer, which aligns it with circular thinking.' },
    { speaker: 'lecturer', text: 'Next week we will look at how repair cultures and recycling compare in their environmental effects.' },
    { speaker: 'lecturer', text: 'Thank you for your attention, and I will take questions after the break.' },
  ],
  vocabulary: [
    {
      term: 'asymmetry', phonetic: '/ˌeɪˈsɪmətri/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '不对称（双方掌握的信息不等）', en: 'a lack of balance between two sides' },
      usage: { zh: '学术术语；information asymmetry 是经济学核心概念。形容词 asymmetric。', en: 'An academic term; information asymmetry is a core economics concept. The adjective is asymmetric.' },
      collocations: ['information asymmetry', 'market asymmetry', 'asymmetry between buyers'],
      example: { en: 'Information asymmetry explains why used goods are hard to price fairly.', zh: '信息不对称解释了二手商品为何难以公平定价。' },
      listening: { zh: '五个音节，重音在第二 /ˈsɪ/。', en: 'Five syllables with stress on the second.' },
    },
    {
      term: 'inspection', phonetic: '/ɪnˈspekʃn/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '检查，查验', en: 'an official or careful examination of an item’s condition' },
      usage: { zh: '可数或不可数；动词 inspect。third-party inspection 第三方查验。', en: 'Countable or uncountable; the verb is inspect. Third-party inspection is a fixed phrase.' },
      collocations: ['a careful inspection', 'third-party inspection', 'under inspection'],
      example: { en: 'A mechanic’s inspection can reveal hidden faults.', zh: '机修工的检查能发现隐藏故障。' },
      listening: { zh: '重音在第二音节 /ˈspek/，结尾 /ʃn/。', en: 'Stress the second syllable; the word ends in /ʃn/.' },
    },
    {
      term: 'warranty', phonetic: '/ˈwɒrənti/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '保修单，质保承诺', en: 'a promise to repair or replace a faulty item within a period' },
      usage: { zh: '可数名词；under warranty、a two-year warranty。注意与 guarantee 区分。', en: 'Countable: under warranty, a two-year warranty. Compare guarantee.' },
      collocations: ['a full warranty', 'under warranty', 'the warranty period'],
      example: { en: 'The phone still has a six-month warranty left.', zh: '这部手机还有六个月保修。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈwɒ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'reputation', phonetic: '/ˌrepjuˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '名声，信誉', en: 'the opinion people hold of a seller based on past behaviour' },
      usage: { zh: '不可数；build a reputation、a good reputation。', en: 'Uncountable: build a reputation, a good reputation.' },
      collocations: ['a good reputation', 'build a reputation', 'online reputation'],
      example: { en: 'The shop earned its reputation through honest descriptions.', zh: '这家店靠如实描述赢得了信誉。' },
      listening: { zh: '四个音节，重音在第三个 /ˈteɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'ratings', phonetic: '/ˈreɪtɪŋz/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '评分，评价（平台上的星级或好评）', en: 'scores or positive reviews given by previous buyers' },
      usage: { zh: '常用复数；positive ratings、a five-star rating。', en: 'Usually plural: positive ratings, a five-star rating.' },
      collocations: ['positive ratings', 'high ratings', 'seller ratings'],
      example: { en: 'A seller with high ratings attracts more buyers.', zh: '评分高的卖家更吸引买家。' },
      listening: { zh: '复数词尾 /z/ 很轻，单数 rating 指单次评分。', en: 'The plural /z/ is soft; a rating is one individual score.' },
    },
    {
      term: 'reservation', phonetic: '/ˌrezəˈveɪʃn/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '保留（价格）；最低接受价', en: 'in pricing, the lowest amount a seller will accept' },
      usage: { zh: 'reservation price 是定价术语；普通语境指预订（a hotel reservation）。', en: 'Reservation price is a pricing term; elsewhere it means a booking, a hotel reservation.' },
      collocations: ['reservation price', 'the seller’s reservation'],
      example: { en: 'The seller’s reservation price reflects what the item cost originally.', zh: '卖方保留价参考了物品当初的成本。' },
      listening: { zh: '四个音节，重音在第三个 /ˈveɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'anchor', phonetic: '/ˈæŋkə/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '参照锚点（价格对比基准）', en: 'a reference point that pulls a price toward it' },
      usage: { zh: '定价与心理学术语；set an anchor、price anchor。本义是船锚。', en: 'A pricing and psychology term: set an anchor, price anchor. Its basic meaning is a ship anchor.' },
      collocations: ['set an anchor', 'a price anchor', 'an anchor point'],
      example: { en: 'A recent sale sets an anchor for the next price.', zh: '最近一笔成交价为下一次定价提供锚点。' },
      listening: { zh: '读 /ˈæŋkə/，中间的 /ŋk/ 连读。', en: 'Pronounced /ˈæŋkə/, linking the /ŋk/ cluster.' },
    },
    {
      term: 'moderation', phonetic: '/ˌmɒdəˈreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '（平台）审核，内容管理', en: 'the process of checking reviews and listings for abuse' },
      usage: { zh: '不可数；动词 moderate，审核员 moderator。', en: 'Uncountable; the verb is moderate, and the reviewer is a moderator.' },
      collocations: ['platform moderation', 'content moderation', 'review moderation'],
      example: { en: 'Moderation removes reviews that look paid for.', zh: '审核会删除疑似收买的评价。' },
      listening: { zh: '四个音节，重音在第三个 /ˈreɪ/。', en: 'Four syllables with stress on the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'by contrast', sentenceIndex: 7,
      meaning: { zh: '相比之下', en: 'on the other side; by comparison' },
      usage: { zh: '放在句首引导对比；与 by comparison 相近。', en: 'At the start of a contrasting sentence; similar to by comparison.' },
      example: { en: 'The seller knows the history; the buyer, by contrast, sees little.', zh: '卖方知道来历，相比之下买方了解甚少。' },
    },
    {
      phrase: 'ways around', sentenceIndex: 15,
      meaning: { zh: '绕过问题的办法', en: 'methods that avoid or solve a problem' },
      usage: { zh: 'find ways around something；around 表示“绕开”。', en: 'find ways around something; around means avoiding the obstacle.' },
      example: { en: 'Buyers and sellers found ways around the lack of trust.', zh: '买卖双方找到了绕开信任缺失的办法。' },
    },
    {
      phrase: 'turn to', sentenceIndex: 22,
      meaning: { zh: '转入，开始讨论（下一话题）', en: 'to move on to the next topic' },
      usage: { zh: '讲座信号短语；turn to pricing、turn to the data。', en: 'A lecture signpost: turn to pricing, turn to the data.' },
      example: { en: 'Now let us turn to the evidence from our survey.', zh: '现在转入调查证据部分。' },
    },
    {
      phrase: 'rather than', sentenceIndex: 36,
      meaning: { zh: '而不是', en: 'instead of' },
      usage: { zh: '连接两个对等成分；后接名词或动名词。', en: 'Links two parallel items; followed by a noun or gerund.' },
      example: { en: 'Reuse the item rather than buy a new one.', zh: '把物品接着用，而不是买新的。' },
    },
    {
      phrase: 'rests on', sentenceIndex: 37,
      meaning: { zh: '建立在……之上，依靠', en: 'is based on; relies on' },
      usage: { zh: 'trust rests on something；同义 be built on。', en: 'trust rests on something; the same idea is be built on.' },
      example: { en: 'The platform’s trust rests on clear rules.', zh: '平台信任建立在明确规则之上。' },
    },
    {
      phrase: 'by itself', sentenceIndex: 40,
      meaning: { zh: '独自地，单凭自身', en: 'alone, without help from anything else' },
      usage: { zh: 'solve the problem by itself；on its own 意思相近。', en: 'solve the problem by itself; on its own works the same way.' },
      example: { en: 'One policy cannot fix the system by itself.', zh: '单靠一项政策无法独立修好这个系统。' },
    },
  ],
  tips: [
    {
      title: { zh: '先预测空格词性', en: 'Predict the part of speech' },
      body: {
        zh: '第 31 空前是 know more than the，填指人名词；第 34 空前是 positive，填名词复数；第 36 空后是 economy，填形容词。听之前把词性写在空格旁，只等那一类词。',
        en: 'Before item 31, know more than the calls for a person noun; before item 34, positive calls for a plural noun; after item 36, economy calls for an adjective. Note the part of speech before listening.',
      },
    },
    {
      title: { zh: '术语成对记，别填反', en: 'Keep the paired terms apart' },
      body: {
        zh: '卖方一侧是 reservation price（最低接受价），买方一侧是 maximum offer（最高出价）。题目问哪一侧就取哪组，Akerlof 模型里的 good cars 和 defects 也分属被挤出和被担心的两方。',
        en: 'The seller’s side is the reservation price; the buyer’s side is the maximum offer. Match the side named in the question. In the model, good cars are pushed out while defects are feared.',
      },
    },
    {
      title: { zh: '观点题听限定句', en: 'For attitude items, listen for the qualifier' },
      body: {
        zh: '第 39 题问整体看法，答案在 does not mean … by itself 这种限定句里。讲座先讲再利用的好处，随后用 This does not mean 转折，讲师的立场通常在转折之后。',
        en: 'Item 39 asks for the overall view, which sits in a qualifier such as does not mean … by itself. The lecture lists benefits first, then turns with This does not mean; the stance follows the turn.',
      },
    },
  ],
};
