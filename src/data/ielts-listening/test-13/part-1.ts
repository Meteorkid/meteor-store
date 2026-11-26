import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 13 · Part 1 — 租客致电保洁公司预约定期家庭清洁。原创仿真材料，非官方真题。
 *
 * 对话围绕房屋面积、深层清洁加项、押金、用品提供方、改约时限展开，
 * 后段确认标准清洁范围、工具归属、当日取消费用与入户方式。
 */
export const test13Part1: ListeningLesson = {
  slug: 'test-13-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预约家庭保洁', en: 'Arranging a house clean' },
  summary: {
    zh: '租客致电保洁公司预约每周一次的家庭清洁：登记公寓面积与卧室数，确认地毯深层清洁加项、押金、常规用品由谁提供、改约提前时限，以及标准清洁范围、工具归属、当日取消费用和入户方式。',
    en: 'A tenant calls a cleaning company to book a weekly house clean: he gives the flat’s size and bedroom count, then confirms the carpet add-on, the deposit, who supplies routine products, the notice period for changing a booking, the standard clean scope, who owns the tools, the same-day cancellation fee and the access method.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  speechRate: '+0%',
  cast: [
    { id: 'agent', label: 'AGENT', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'caller', label: 'CALLER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Flat size', cells: [[{ blank: 1 }, { text: ' square metres' }]] },
        { lead: 'Bedrooms', cells: [[{ blank: 2 }]] },
        { lead: 'Add-on deep clean', cells: [[{ blank: 3 }]] },
        { lead: 'Routine products supplied by', cells: [[{ blank: 4 }]] },
        { lead: 'Booking deposit', cells: [[{ blank: 5 }, { text: ' pounds' }]] },
        { lead: 'Booking change notice', cells: [[{ blank: 6 }, { text: ' hours' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'What does the standard clean include?',
          options: [
            { key: 'A', text: 'Ovens and inside refrigerators' },
            { key: 'B', text: 'Kitchen surfaces, bathroom, floors and dusting' },
            { key: 'C', text: 'Carpet washing for every room' },
          ],
        },
        {
          number: 8,
          stem: 'Who supplies the vacuum and cloths?',
          options: [
            { key: 'A', text: 'The cleaner’s own equipment' },
            { key: 'B', text: 'The customer must lend theirs' },
            { key: 'C', text: 'The building reception provides them' },
          ],
        },
        {
          number: 9,
          stem: 'What happens if the booking is cancelled on the same day?',
          options: [
            { key: 'A', text: 'The slot is refunded in full if refilled' },
            { key: 'B', text: 'Half the visit fee is charged' },
            { key: 'C', text: 'The deposit is doubled' },
          ],
        },
        {
          number: 10,
          stem: 'How will the cleaner get access to this flat?',
          options: [
            { key: 'A', text: 'A key left at reception' },
            { key: 'B', text: 'A digital door code sent in the morning' },
            { key: 'C', text: 'The lock box outside the door' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['seventy', '70'], spoken: 'seventy square metres', evidence: 2,
      explanation: {
        zh: '定位句 2：It has two bedrooms, on the fourth floor, about seventy square metres。面积以平方计为七十；楼层是背景信息，不要填进面积空。',
        en: 'Sentence 2: "It has two bedrooms, on the fourth floor, about seventy square metres". The size is seventy square metres; the floor level is background and does not belong in the size gap.',
      },
    },
    {
      number: 2, accepted: ['two', '2'], evidence: 2,
      explanation: {
        zh: '定位句 2：two bedrooms。卧室数量为两间；同一节里的七十平方米是面积，不要与卧室数混淆。',
        en: 'Sentence 2: "It has two bedrooms". There are two bedrooms. The seventy square metres in the same sentence is the area, not the bedroom count.',
      },
    },
    {
      number: 3, accepted: ['carpets'], evidence: 6,
      explanation: {
        zh: '定位句 6：What about the carpets? We have two rugs that need a deeper clean。加项是地毯深层清洁；普通吸尘属于标准服务，不是这个加项。',
        en: 'Sentence 6: "What about the carpets? We have two rugs that need a deeper clean". The add-on is a deep carpet clean; routine vacuuming belongs to the standard service.',
      },
    },
    {
      number: 4, accepted: ['staff'], evidence: 9,
      explanation: {
        zh: '定位句 9：For ordinary surfaces our staff bring spray and cloths。常规用品由保洁员工自带；特殊台面才由客户留下指定产品。',
        en: 'Sentence 9: "For ordinary surfaces our staff bring spray and cloths". Routine products come from the cleaning staff; only special-surface products are left by the customer.',
      },
    },
    {
      number: 5, accepted: ['ten', '10'], spoken: 'ten pounds', evidence: 11,
      explanation: {
        zh: '定位句 11：For a flat this size it is forty-five pounds each visit, and there is a deposit of ten pounds to hold the first slot。押金为十英镑；句中的 forty-five 是每次服务费，不是押金。',
        en: 'Sentence 11: "there is a deposit of ten pounds to hold the first slot". The deposit is ten pounds; the forty-five mentioned there is the per-visit fee, not the deposit.',
      },
    },
    {
      number: 6, accepted: ['forty-eight', '48'], spoken: 'forty-eight hours', evidence: 13,
      explanation: {
        zh: '定位句 13：Please give us at least forty-eight hours’ notice。改约需提前四十八小时；不足时限会按当日取消处理。',
        en: 'Sentence 13: "Please give us at least forty-eight hours’ notice". A booking change needs forty-eight hours’ notice; shorter notice counts as same-day cancellation.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：our standard clean covers the kitchen surfaces, bathroom, floors and dusting in the living areas。标准范围对应 B。烤箱冰箱内部与地毯水洗都属于另加项目。',
        en: 'Sentence 15: "our standard clean covers the kitchen surfaces, bathroom, floors and dusting in the living areas". The standard scope matches B. Oven and fridge interiors and carpet washing are separate add-ons.',
      },
    },
    {
      number: 8, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：Our staff carry their own vacuum, mops and cloths。工具由保洁员自带，客户无需出借；接待处不提供设备。',
        en: 'Sentence 18: "Our staff carry their own vacuum, mops and cloths". The cleaner brings the equipment, so the customer does not lend theirs, and reception does not supply it.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：Then we charge half the visit fee, because the cleaner’s time is already reserved。当日取消收半费；全额退款与押金翻倍在原文中没有依据。',
        en: 'Sentence 20: "Then we charge half the visit fee, because the cleaner’s time is already reserved". Same-day cancellation costs half the fee. A full refund and a doubled deposit are never mentioned.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：I have a digital door code, so I can send that to your cleaner the morning of the visit。这套房用早上发送的门禁密码入户；留钥匙和密码箱是其他客户的常见做法，不是本户安排。',
        en: 'Sentence 23: "I have a digital door code, so I can send that to your cleaner the morning of the visit". This flat uses a door code sent that morning. Leaving a key and the lock box are other customers’ arrangements, not this one’s.',
      },
    },
  ],
  transcript: [
    { speaker: 'caller', text: 'Hello, I’d like to book a regular house clean for my flat, please.' },
    { speaker: 'agent', text: 'Of course. I’ll take a few details and check what we can offer.' },
    { speaker: 'caller', text: 'It has two bedrooms, on the fourth floor, about seventy square metres.' },
    { speaker: 'agent', text: 'Two bedrooms, seventy square metres. Got that. Is this a one-off clean or a weekly booking?' },
    { speaker: 'caller', text: 'Weekly, starting next month. I work long hours, so the flat does not get much attention.' },
    { speaker: 'agent', text: 'Fine.' },
    { speaker: 'caller', text: 'What about the carpets? We have two rugs that need a deeper clean.' },
    { speaker: 'agent', text: 'Carpet care is an add-on, not part of the standard visit. We can arrange a specialist after the general clean.' },
    { speaker: 'caller', text: 'Good. Do you bring your own cleaning products, or should I supply them?' },
    { speaker: 'agent', text: 'For ordinary surfaces our staff bring spray and cloths. If you have a special wood or marble top, you can leave the product you want used.' },
    { speaker: 'caller', text: 'Right. What does the weekly service cost?' },
    { speaker: 'agent', text: 'For a flat this size it is forty-five pounds each visit, and there is a deposit of ten pounds to hold the first slot.' },
    { speaker: 'caller', text: 'And if I need to change the day of a clean?' },
    { speaker: 'agent', text: 'Please give us at least forty-eight hours’ notice, so we can reassign the cleaner’s round.' },
    { speaker: 'caller', text: 'Understood.' },
    { speaker: 'agent', text: 'Now, our standard clean covers the kitchen surfaces, bathroom, floors and dusting in the living areas.' },
    { speaker: 'caller', text: 'Will the cleaner move heavy furniture?' },
    { speaker: 'agent', text: 'We can shift light chairs, but sofas and wardrobes stay where they are for insurance reasons.' },
    { speaker: 'agent', text: 'Our staff carry their own vacuum, mops and cloths, so you do not need to lend equipment.' },
    { speaker: 'caller', text: 'What if I cancel on the same day?' },
    { speaker: 'agent', text: 'Then we charge half the visit fee, because the cleaner’s time is already reserved.' },
    { speaker: 'caller', text: 'How do you get in when I’m not home?' },
    { speaker: 'agent', text: 'Most customers leave a key with the building reception, or we use the lock box outside the front door.' },
    { speaker: 'caller', text: 'I have a digital door code, so I can send that to your cleaner the morning of the visit.' },
    { speaker: 'agent', text: 'That works too. Please confirm it in writing, so the cleaner does not wait outside.' },
    { speaker: 'caller', text: 'Do you clean the windows inside?' },
    { speaker: 'agent', text: 'Internal window sills and frames are included, but the outside glass is a separate service.' },
    { speaker: 'agent', text: 'Just to confirm, the flat is on the fourth floor, and the building has a lift, so access should not be a problem.' },
    { speaker: 'caller', text: 'Yes, there is a lift, though it can be slow in the morning.' },
    { speaker: 'agent', text: 'Are there any pets in the flat?' },
    { speaker: 'caller', text: 'No pets, just two indoor plants that need to be moved before the floor is washed.' },
    { speaker: 'agent', text: 'We can move them gently, but please tell the cleaner which ones are heavy.' },
    { speaker: 'agent', text: 'Shall I note the carpets as an add-on for the first visit only?' },
    { speaker: 'caller', text: 'Yes, just the two rugs on the first visit, and ordinary carpet care after that.' },
    { speaker: 'agent', text: 'Splendid. The confirmation email will list the add-on and the total for week one.' },
    { speaker: 'caller', text: 'Thanks. I’ll drop the key details to reception after this call.' },
  ],
  vocabulary: [
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '押金，预订金', en: 'money paid in advance to hold a booking or slot' },
      usage: { zh: '服务预订场景：a ten-pound deposit、pay a deposit；动词 deposit 指存款。', en: 'In bookings: a ten-pound deposit, pay a deposit. As a verb it means put money in a bank.' },
      collocations: ['a booking deposit', 'pay a deposit', 'a refundable deposit'],
      example: { en: 'The ten-pound deposit holds the first cleaning slot.', zh: '十英镑押金预留第一次清洁时段。' },
      listening: { zh: '重音在第二音节 /ˈpɒ/，与 dispose 同根。', en: 'Stress the second syllable; it shares a root with dispose.' },
    },
    {
      term: 'add-on', phonetic: '/ˈæd ɒn/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '加项，另购服务', en: 'an extra service charged on top of the standard package' },
      usage: { zh: '连字符名词；an add-on to the standard visit，动词短语 add on。', en: 'A hyphenated noun: an add-on to the standard visit; the phrasal verb is add on.' },
      collocations: ['an add-on service', 'book an add-on', 'a paid add-on'],
      example: { en: 'Carpet care is an add-on after the general clean.', zh: '地毯护理是普通清洁之后的加项。' },
      listening: { zh: '两个词都重读，中间不停顿，不要听成 add one。', en: 'Both halves are stressed without a pause; do not hear it as add one.' },
    },
    {
      term: 'surfaces', phonetic: '/ˈsɜːfɪsɪz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '台面，表面', en: 'the flat top of a table, counter or work area' },
      usage: { zh: '保洁与家居场景：kitchen surface、special wood surface。', en: 'Cleaning and home usage: a kitchen surface, a special wood surface.' },
      collocations: ['a hard surface', 'wipe the surface', 'special surfaces'],
      example: { en: 'Please tell the cleaner which surface needs special spray.', zh: '请告诉保洁哪块台面需要专用喷剂。' },
      listening: { zh: '双音节，重音在首音节 /ˈsɜː/，尾音 /s/。', en: 'Two syllables with first-syllable stress; the ending is /s/.' },
    },
    {
      term: 'vacuum', phonetic: '/ˈvækjuːm/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '吸尘器', en: 'the machine that cleans dust and dirt from floors and carpets' },
      usage: { zh: '英式口语也说 hoover；vacuum 可作动词表示吸尘。', en: 'British speech also says hoover; vacuum can be a verb meaning clean with the machine.' },
      collocations: ['carry the vacuum', 'a vacuum cleaner', 'run the vacuum'],
      example: { en: 'The cleaner brings the vacuum and the mops.', zh: '保洁员自带吸尘器和拖把。' },
      listening: { zh: '三音节，重音在首音节 /ˈvæk/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'wardrobes', phonetic: '/ˈwɔːdrəʊbz/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '衣柜，衣橱', en: 'a tall cupboard where clothes are hung' },
      usage: { zh: '家具名词；wardrobe 也指个人全部衣物。', en: 'A furniture noun; it can also mean someone’s whole clothes collection.' },
      collocations: ['a built-in wardrobe', 'move a wardrobe', 'the wardrobe stays'],
      example: { en: 'Sofas and wardrobes are not moved during the clean.', zh: '清洁时不移动沙发和衣柜。' },
      listening: { zh: '双音节，重音在前；ward 读 /wɔːd/。', en: 'Two syllables with stress first; ward is /wɔːd/.' },
    },
    {
      term: 'reception', phonetic: '/rɪˈsepʃn/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '（楼宇）接待处，前台', en: 'the front desk of a building, where keys can be left' },
      usage: { zh: '建筑场景：building reception、leave a key at reception。', en: 'Building usage: building reception, leave a key at reception.' },
      collocations: ['the building reception', 'at reception', 'the reception desk'],
      example: { en: 'Customers often leave a key with the reception staff.', zh: '客户常把钥匙留在接待处。' },
      listening: { zh: '三音节，重音在第二音节 /ˈsep/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'code', phonetic: '/kəʊd/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '门禁密码，代号', en: 'the number or characters that unlock a door or device' },
      usage: { zh: 'door code、digital code；动词 code 指编码。', en: 'A door code, a digital code; as a verb it means write code.' },
      collocations: ['a door code', 'send the code', 'the access code'],
      example: { en: 'The customer sends the door code to the cleaner in the morning.', zh: '客户早上把门禁密码发给保洁员。' },
      listening: { zh: '单音节，与 cold 对比元音不同。', en: 'One syllable; the vowel differs from cold.' },
    },
    {
      term: 'rugs', phonetic: '/rʌɡz/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '小地毯，脚垫', en: 'a smaller carpet laid on top of a floor' },
      usage: { zh: '可数；wall-to-wall carpet 是满铺地毯，rug 是小块。', en: 'Countable; a wall-to-wall carpet covers the floor, a rug is smaller.' },
      collocations: ['two rugs', 'wash the rug', 'a wool rug'],
      example: { en: 'Only the two rugs receive the deep clean this week.', zh: '本周只有两块小地毯做深层清洁。' },
      listening: { zh: '短元音 /ʌ/，尾音 /ɡ/ 浊化。', en: 'Short /ʌ/ with a voiced final /ɡ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'take a few details', sentenceIndex: 1,
      meaning: { zh: '登记几项信息', en: 'to write down a small amount of information' },
      usage: { zh: '服务电话开场说法；也可说 take your details。', en: 'A service-phone opening; take your details means the same.' },
      example: { en: 'I’ll take a few details before I check the slots.', zh: '查时段前我先登记几项信息。' },
    },
    {
      phrase: 'deeper clean', sentenceIndex: 6,
      meaning: { zh: '深层清洁，彻底清扫', en: 'a thorough clean beyond the regular surface wipe' },
      usage: { zh: '名词短语；动词形式 deep-clean。', en: 'A noun phrase; the verb form is deep-clean.' },
      example: { en: 'The two rugs need a deep clean after the winter.', zh: '过冬后两块地毯需要深层清洁。' },
    },
    {
      phrase: 'leave the product', sentenceIndex: 9,
      meaning: { zh: '留下指定用品', en: 'to keep a particular item ready for the cleaner to use' },
      usage: { zh: 'leave 后接物品；leave it out 是另一种说法。', en: 'Follow leave with the item; leave it out is a paraphrase.' },
      example: { en: 'Leave the product you want used beside the sink.', zh: '把你想用的用品放在水槽边。' },
    },
    {
      phrase: 'shift light chairs', sentenceIndex: 17,
      meaning: { zh: '挪动轻椅子', en: 'to move small chairs out of the way' },
      usage: { zh: 'shift 在此是轻移；重物用 move 并受保险限制。', en: 'Shift means move lightly here; heavy items are moved only under the insurance rules.' },
      example: { en: 'We can shift the light chairs before washing the floor.', zh: '洗地前我们可以挪开轻椅子。' },
    },
    {
      phrase: 'carry their own', sentenceIndex: 18,
      meaning: { zh: '自带（工具）', en: 'to bring the equipment themselves rather than borrow it' },
      usage: { zh: 'own 后省略名词；carry one’s own 同构。', en: 'The noun is omitted after own; carry one’s own works the same way.' },
      example: { en: 'The staff carry their own vacuum and cloths.', zh: '员工自带吸尘器和抹布。' },
    },
    {
      phrase: 'in writing', sentenceIndex: 24,
      meaning: { zh: '以书面形式', en: 'as a written message rather than a phone call' },
      usage: { zh: '确认信息时用；同义表达是 by email。', en: 'Used for confirming details; by email is a paraphrase.' },
      example: { en: 'Please confirm the code in writing before the visit.', zh: '就诊前请以书面形式确认密码。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单字段先定词性', en: 'Predict the gap type from the row label' },
      body: {
        zh: '第 1 题后已印 square metres，填数字；第 2 题问间数；第 4 题问用品提供方，预判填人。听前在题号旁标出数字、名词或角色，听到对应类别再落笔。',
        en: 'Item 1 already prints square metres, so it needs a number; item 2 asks for a count; item 4 asks who supplies products, so expect a role. Mark number, noun or role beside each gap before listening.',
      },
    },
    {
      title: { zh: '区分标准服务与加项', en: 'Separate the standard service from add-ons' },
      body: {
        zh: '第 7 题考标准清洁范围，第 3 题考加项地毯。录音先说普通台面、浴室、地板和除尘，再说地毯护理另收费。听到 add-on、special、separate service 这类词时，注意它指向的是加项而不是标准包。',
        en: 'Item 7 tests the standard scope and item 3 the carpet add-on. The recording lists surfaces, bathroom, floors and dusting first, then charges separately for carpet care. Words such as add-on, special and separate service point to extras rather than the standard package.',
      },
    },
    {
      title: { zh: '入户方式别混为一谈', en: 'Do not mix up the access methods' },
      body: {
        zh: '第 10 题问本户怎么入户。录音先泛讲其他客户留钥匙或用密码箱，再说本户用早上发送的门禁密码。选择题干扰项常把别处的做法安到题干对象上，抓住说话人提到 I have my… 的那句。',
        en: 'Item 10 asks how this flat is entered. The recording first describes other customers’ keys and lock boxes, then this flat’s morning door code. Distractors often attach another household’s method to the stem; catch the sentence where the speaker says I have my…',
      },
    },
  ],
};
