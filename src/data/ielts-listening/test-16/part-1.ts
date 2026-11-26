import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 16 · Part 1 — 退换故障咖啡机（双人对话，加拿大 + 美国口音）。原创仿真材料，非官方真题。
 *
 * 生活售后对话：故障现象、购买凭证、保修期、上门取件、退款与换货条件，以及运输损伤与保外处理。
 * 题块顺序：表格填空 1–4 → 单选 5–7 → 配对 8–10。
 */
export const test16Part1: ListeningLesson = {
  slug: 'test-16-part-1',
  part: 1,
  status: 'published',
  title: { zh: '退换故障咖啡机', en: 'Returning a faulty coffee machine' },
  summary: {
    zh: '顾客就漏水的咖啡机联系售后：登记姓名与故障现象、核对购买凭证和保修期，了解上门取件安排、换货优先与退款条件，并区分运输损伤、保外故障与本机换货的处理方式。',
    en: 'A customer contacts support about a leaking coffee machine: registering the name and fault, checking the receipt and warranty, arranging home collection, the exchange-first policy and refund conditions, and separating transit damage, out-of-warranty faults and the current unit.',
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
        { lead: 'Fault: the machine', cells: [[{ blank: 2 }, { text: ' water when brewing' }]] },
        { lead: 'Proof of purchase: kept the', cells: [[{ blank: 3 }]] },
        { lead: 'Warranty period:', cells: [[{ blank: 4 }, { text: ' months' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'How will the faulty machine be collected?',
          options: [
            { key: 'A', text: 'The customer brings it to the nearest shop' },
            { key: 'B', text: 'A courier calls at the customer’s home' },
            { key: 'C', text: 'The customer posts it back by ordinary mail' },
          ],
        },
        {
          number: 6,
          stem: 'Under what condition can the customer receive a refund?',
          options: [
            { key: 'A', text: 'A repair attempt has already been made' },
            { key: 'B', text: 'The replacement unit is out of stock' },
            { key: 'C', text: 'The customer returns within seven days' },
          ],
        },
        {
          number: 7,
          stem: 'What should the customer do before the courier arrives?',
          options: [
            { key: 'A', text: 'Repack the machine with a new box from the shop' },
            { key: 'B', text: 'Contact the technician about the leaking seal' },
            { key: 'C', text: 'Keep the original packaging and note the panel code' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What treatment applies to each case? Choose the correct letter, A–C.',
      options: [
        { key: 'A', text: 'exchanged for a brand new unit' },
        { key: 'B', text: 'charged to the customer with no exchange included' },
        { key: 'C', text: 'repaired under the separate transit cover' },
      ],
      items: [
        { number: 8, text: 'the dented outer casing' },
        { number: 9, text: 'a fault after the warranty period' },
        { number: 10, text: 'the current faulty machine' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Bennett'], evidence: 1,
      explanation: {
        zh: '定位句 1：顾客逐字母拼出 Bennett，B, E, N, N, E, T。拼写题先记首字母 B，再跟读音补全；不要写成 Bennet。',
        en: 'Sentence 1: the customer spells Bennett, B, E, N, N, E, T. Note the first letter and fill in the rest; do not write Bennet.',
      },
    },
    {
      number: 2, accepted: ['leaking'], evidence: 3,
      explanation: {
        zh: '定位句 3：it started leaking water from under the body。故障是漏水，填 leaking；句 5 的 still leaks 是补充确认，不是另一现象。',
        en: 'Sentence 3: the machine "started leaking water from under the body", so fill leaking. Still leaks in sentence 5 only confirms the fault.',
      },
    },
    {
      number: 3, accepted: ['receipt'], evidence: 7,
      explanation: {
        zh: '定位句 7：The receipt came with the box, and I also saved the email。购买凭证是收据，填 receipt；邮件是备份，不是题目所问的凭证原件。',
        en: 'Sentence 7: "The receipt came with the box", so fill receipt. The saved email is a backup, not the document asked for.',
      },
    },
    {
      number: 4, accepted: ['twelve', '12'], evidence: 13,
      explanation: {
        zh: '定位句 13：Correct. These machines carry a warranty of twelve months from the delivery date。空格后已印 months，填数字；句 12 的 four weeks 是购买时长，不是保修期。',
        en: 'Sentence 13: "a warranty of twelve months". Months is printed, so write the number. Four weeks in sentence 12 is the purchase age, not the warranty.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：A courier will call at your home within the next two working days。上门取件对应 B。A 的送回门店、C 的普通邮寄都被句 15 的 collected rather than dropped off 排除。',
        en: 'Sentence 17: "A courier will call at your home", matching B. Taking it to the shop or posting it back are ruled out in sentence 15.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：a refund to the original card, but only after a repair attempt has been made。退款以先尝试维修为前提，对应 A。B 的缺货、C 的七天期限均未提及。',
        en: 'Sentence 21: the refund is available "only after a repair attempt has been made", matching A. Out of stock and a seven-day limit are not mentioned.',
      },
    },
    {
      number: 7, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：Keep the original packaging if you still have it, and note the error code shown on the panel。保留原包装并记录面板代码，对应 C。A 的新盒子、B 的直接联系技师都不是顾客此刻要做的事。',
        en: 'Sentence 25: keep "the original packaging" and "note the error code shown on the panel", matching C. A new box or contacting the technician directly is not asked of the customer.',
      },
    },
    {
      number: 8, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：Casing damage from delivery is treated separately. We photograph it and send it for repair under the transit cover。运输磕碰外壳走单独运输险，对应 C。',
        en: 'Sentence 29: casing damage from delivery is "send it for repair under the transit cover", matching C.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：the customer pays for the technician’s time, and an exchange is not included。保外故障由顾客付费、不含换货，对应 B。',
        en: 'Sentence 31: the customer "pays for the technician’s time, and an exchange is not included", matching B.',
      },
    },
    {
      number: 10, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：I’d prefer the new unit rather than a refund。本机在保修期内先走换货，对应 A。换货安排在句 19 已说明，句 32 是顾客确认选择。',
        en: 'Sentence 32: the customer prefers "the new unit rather than a refund", so the faulty machine matches A. The exchange-first rule was stated in sentence 19.',
      },
    },
  ],
  transcript: [
    { speaker: 'agent', text: 'Thank you for calling appliance support. Could I confirm your surname first, please?' },
    { speaker: 'customer', text: 'It’s Bennett, B, E, N, N, E, T.' },
    { speaker: 'agent', text: 'Thank you. And the coffee machine is the one delivered last Saturday?' },
    { speaker: 'customer', text: 'Yes. It brewed two cups fine, but this morning it started leaking water from under the body.' },
    { speaker: 'agent', text: 'Leaking water. Did you check the water tank was seated properly?' },
    { speaker: 'customer', text: 'I did. It still leaks whenever I run the brewing cycle.' },
    { speaker: 'agent', text: 'And do you have the receipt or the order confirmation email?' },
    { speaker: 'customer', text: 'The receipt came with the box, and I also saved the email in my inbox.' },
    { speaker: 'agent', text: 'That’s all we need for the claim. Can you describe the leak once more for the record?' },
    { speaker: 'customer', text: 'Water collects on the bench near the drip tray, and a small pool forms underneath.' },
    { speaker: 'customer', text: 'I’ve checked the seal around the lid too, and it looks intact.' },
    { speaker: 'agent', text: 'I’ll note that down. When did you buy it, roughly?' },
    { speaker: 'customer', text: 'The order was placed four weeks ago, so it’s still inside the warranty.' },
    { speaker: 'agent', text: 'Correct. These machines carry a warranty of twelve months from the delivery date.' },
    { speaker: 'customer', text: 'Good. I’m not sure whether I want it fixed or swapped.' },
    { speaker: 'agent', text: 'Let me walk you through the options. First, the machine will be collected rather than dropped off.' },
    { speaker: 'customer', text: 'Do I need to take it back to the shop myself?' },
    { speaker: 'agent', text: 'Not at all. A courier will call at your home within the next two working days to pick it up.' },
    { speaker: 'customer', text: 'And what happens once it reaches the workshop?' },
    { speaker: 'agent', text: 'They test the heating element and the seals before deciding. For faults inside the warranty, we first arrange an exchange.' },
    { speaker: 'customer', text: 'What if I decide I’d rather have my money back?' },
    { speaker: 'agent', text: 'You can choose a refund to the original card, but only after a repair attempt has been made.' },
    { speaker: 'customer', text: 'I see. So a straight swap is faster than waiting for the refund.' },
    { speaker: 'agent', text: 'That’s right. Refunds take five to seven working days once the old machine arrives.' },
    { speaker: 'customer', text: 'Is there anything I should do on my side before the courier comes?' },
    { speaker: 'agent', text: 'Keep the original packaging if you still have it, and note the error code shown on the panel.' },
    { speaker: 'customer', text: 'The panel shows a small red light, no numbers.' },
    { speaker: 'agent', text: 'That’s fine. Describe the light in the claim, and we’ll pass it to the technician.' },
    { speaker: 'customer', text: 'What about marks on the outer casing? The box itself was dented on arrival.' },
    { speaker: 'agent', text: 'Casing damage from delivery is treated separately. We photograph it and send it for repair under the transit cover.' },
    { speaker: 'customer', text: 'And if the problem appeared after the warranty ran out?' },
    { speaker: 'agent', text: 'Then the customer pays for the technician’s time, and an exchange is not included.' },
    { speaker: 'customer', text: 'Understood. For now I’d prefer the new unit rather than a refund.' },
    { speaker: 'agent', text: 'I’ll record exchange as your first choice. The courier will bring the replacement on the same visit if it’s in stock.' },
    { speaker: 'customer', text: 'Does the replacement come with the remaining warranty?' },
    { speaker: 'agent', text: 'Yes, it keeps the original warranty period, so you won’t lose those four weeks.' },
    { speaker: 'customer', text: 'One more thing, the milk frother attachment was missing from the box.' },
    { speaker: 'agent', text: 'I’ll list that as a separate note. Missing parts are posted out within three days.' },
    { speaker: 'customer', text: 'Thanks for sorting this out today.' },
    { speaker: 'agent', text: 'You’re welcome. The collection email will arrive this evening.' },
  ],
  vocabulary: [
    {
      term: 'warranty', phonetic: '/ˈwɒrənti/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '保修，保修期', en: 'a guarantee that repairs or replacement are free within a set period' },
      usage: { zh: '可数/不可数；inside the warranty、a twelve-month warranty、under warranty。', en: 'inside the warranty, a twelve-month warranty, under warranty.' },
      collocations: ['the warranty period', 'under warranty', 'extend the warranty'],
      example: { en: 'The machine is still covered by the warranty.', zh: '机器仍在保修期内。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈwɒ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'receipt', phonetic: '/rɪˈsiːt/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '收据，购买凭证', en: 'the document proving a purchase was made' },
      usage: { zh: '可数；keep the receipt、hand over the receipt。字母 p 不发音。', en: 'Countable: keep the receipt. The p is silent.' },
      collocations: ['keep the receipt', 'the original receipt', 'a sales receipt'],
      example: { en: 'You need the receipt to claim a refund.', zh: '退款需要出示收据。' },
      listening: { zh: '重音在第二音节 /ˈsiː/，p 不发音，别读成 re-cept。', en: 'Stress the second syllable; the p is silent.' },
    },
    {
      term: 'courier', phonetic: '/ˈkʊriə/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '快递员，取件配送人员', en: 'a person or company that collects and delivers parcels' },
      usage: { zh: '可数；a courier will call、arrange a courier。', en: 'Countable: a courier will call, arrange a courier.' },
      collocations: ['the courier collects', 'book a courier', 'a courier delivery'],
      example: { en: 'The courier picks the parcel up from your home.', zh: '快递员上门取走包裹。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkʊ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'exchange', phonetic: '/ɪksˈtʃeɪndʒ/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '换货，更换新机', en: 'giving a replacement product in place of the faulty one' },
      usage: { zh: '可数/不可数；arrange an exchange、exchange for a new unit。动词同形。', en: 'arrange an exchange, exchange for a new unit; the verb has the same form.' },
      collocations: ['an exchange', 'arrange an exchange', 'exchange for a new unit'],
      example: { en: 'The shop offered an exchange rather than a repair.', zh: '商店给出换货而不是维修。' },
      listening: { zh: '重音在第二音节 /ˈtʃeɪndʒ/，开头 /ɪks/ 弱读。', en: 'Stress the second syllable; the opening /ɪks/ is reduced.' },
    },
    {
      term: 'refund', phonetic: '/ˈriːfʌnd/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '退款', en: 'money paid back to the customer after a return' },
      usage: { zh: '可数；a refund to the card、claim a refund。动词重音在第二音节。', en: 'Countable: a refund to the card, claim a refund; the verb stresses the second syllable.' },
      collocations: ['a full refund', 'receive a refund', 'refund to the card'],
      example: { en: 'The refund goes back to the original payment card.', zh: '退款退回原支付卡。' },
      listening: { zh: '名词重音在第一音节 /ˈriː/，动词反之。', en: 'Noun stress on the first syllable; the verb reverses it.' },
    },
    {
      term: 'technician', phonetic: '/tekˈnɪʃn/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '技师，维修人员', en: 'a skilled person who repairs or maintains equipment' },
      usage: { zh: '可数；an approved technician、the workshop technician。', en: 'Countable: an approved technician, the workshop technician.' },
      collocations: ['the technician checks', 'a repair technician', 'send to a technician'],
      example: { en: 'The technician tests the seals before any repair.', zh: '技师在维修前先检查密封圈。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈnɪʃ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'packaging', phonetic: '/ˈpækɪdʒɪŋ/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '包装，包装箱', en: 'the box and materials that protect a product' },
      usage: { zh: '不可数；keep the original packaging、the outer packaging。', en: 'Uncountable: keep the original packaging, the outer packaging.' },
      collocations: ['original packaging', 'keep the packaging', 'the packaging box'],
      example: { en: 'Keep the packaging until the warranty ends.', zh: '保修结束前保留包装。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpæk/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'seal', phonetic: '/siːl/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '密封圈，密封垫', en: 'the ring or gasket that keeps liquid inside a machine' },
      usage: { zh: '可数；the seal around the lid、replace the seal。动词也表密封。', en: 'Countable: the seal around the lid, replace the seal; it is also a verb.' },
      collocations: ['the lid seal', 'a worn seal', 'check the seal'],
      example: { en: 'A loose seal can let water leak onto the bench.', zh: '密封圈松动会让水漏到台面上。' },
      listening: { zh: '单音节，与 feel 押韵，长音 /iː/。', en: 'One syllable, rhyming with feel, with a long /iː/.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk you through', sentenceIndex: 15,
      meaning: { zh: '逐项向你说明', en: 'to explain the steps to someone in order' },
      usage: { zh: '及物；walk you through the options、walk through the claim。', en: 'Transitive: walk you through the options.' },
      example: { en: 'I’ll walk you through the return steps.', zh: '我把退货步骤逐项告诉你。' },
    },
    {
      phrase: 'pick it up', sentenceIndex: 17,
      meaning: { zh: '上门取走（包裹）', en: 'to collect an item from its location' },
      usage: { zh: '可分短语动词；pick up the parcel、the courier picks it up。', en: 'Separable: pick up the parcel, the courier picks it up.' },
      example: { en: 'The driver picks the machine up at the door.', zh: '司机在门口取走机器。' },
    },
    {
      phrase: 'on my side', sentenceIndex: 24,
      meaning: { zh: '在我这一方，我需要做的', en: 'what the customer has to do personally' },
      usage: { zh: 'on my side 对应 agent 的 on our side；对话中分工常用。', en: 'Used to divide tasks between caller and agent.' },
      example: { en: 'What do I need to do on my side?', zh: '我这边需要做什么？' },
    },
    {
      phrase: 'in stock', sentenceIndex: 33,
      meaning: { zh: '有现货，库存充足', en: 'available for immediate delivery' },
      usage: { zh: '表语；the replacement is in stock。反义 out of stock。', en: 'Predicative: the replacement is in stock; the opposite is out of stock.' },
      example: { en: 'The new unit is in stock today.', zh: '新机今天有现货。' },
    },
    {
      phrase: 'sorting this out', sentenceIndex: 38,
      meaning: { zh: '把这事处理好', en: 'to resolve a problem or arrangement' },
      usage: { zh: 'sort out 解决；名词 sort-out。口语常说 thanks for sorting it out。', en: 'sort out means to resolve; thanks for sorting it out is colloquial.' },
      example: { en: 'We’ll sort out the missing parts today.', zh: '我们今天把缺件处理好。' },
    },
  ],
  tips: [
    {
      title: { zh: '售后对话分清三类处理', en: 'Separate the three repair routes' },
      body: {
        zh: '同一通电话里本机换货、运输损伤维修、保外付费是三条线。听到 transit cover、warranty ran out、exchange 这类词就把对应选项记到那一行，别把本机的换货记到运输损伤上。',
        en: 'One call covers three routes: exchange for the unit, transit-cover repair, and paid out-of-warranty work. Mark each option beside its route when you hear transit cover, warranty ran out or exchange.',
      },
    },
    {
      title: { zh: '条件句里藏着单选答案', en: 'Conditionals carry the single-choice answer' },
      body: {
        zh: '退款、取件这类规则常以 only if、rather than 引出。听到 only after a repair attempt 就抓住前提条件，干扰项往往把时间或地点换掉。',
        en: 'Rules for refunds and collection are framed with only if or rather than. Catch the condition after only after a repair attempt; distractors usually swap time or place.',
      },
    },
    {
      title: { zh: '拼写题跟读音逐字母', en: 'Spell surnames letter by letter' },
      body: {
        zh: '姓氏题一定要等说话人拼读完整再写。Bennett 双写 n，结尾 -ett；听到 B, E, N, N, E, T 再落纸，避免按发音少写一个字母。',
        en: 'Wait until the spelling is complete before writing. Bennett has double n and ends -ett; write it after hearing B, E, N, N, E, T rather than guessing by sound.',
      },
    },
  ],
};
