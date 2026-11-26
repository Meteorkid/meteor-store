import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 12 · Part 1 — 电话订购生日蛋糕（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：尺寸与人数 → 口味（巧克力改为柠檬）→ 蜡烛与装饰文字 → 取货时间 → 订金，
 * 后半段再谈取消规则、坚果过敏、总价构成、配送与夹心。填空块在前半段，单选块在后半段，
 * 题块顺序与录音顺序一致。
 */
export const test12Part1: ListeningLesson = {
  slug: 'test-12-part-1',
  part: 1,
  status: 'published',
  title: { zh: '订生日蛋糕', en: 'Ordering a birthday cake' },
  summary: {
    zh: '一位母亲致电蛋糕店为女儿订生日蛋糕：确认尺寸与人数、选择口味、约定装饰文字和取货时间、支付订金，随后了解取消规则、坚果过敏提示、总价包含项目、配送方式和蛋糕夹心。',
    en: 'A mother calls a cake shop to order a birthday cake for her daughter: she confirms the size and guest numbers, chooses the flavour, agrees the icing message and collection time, pays the deposit, and then learns the cancellation rule, the allergy note, what the price includes, delivery options and the filling.',
  },
  accent: { zh: '顾客为美式口音，店员为澳式口音。', en: 'The customer speaks with an American accent and the assistant with an Australian accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'assistant', label: 'ASSISTANT', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'female', voice: 'en-US-JennyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Cake size', cells: [[{ blank: 1 }]] },
        { lead: 'Chosen flavour', cells: [[{ blank: 2 }]] },
        { lead: 'Message on top: Happy birthday', cells: [[{ blank: 3 }]] },
        { lead: 'Collection day', cells: [[{ blank: 4 }]] },
        { lead: 'Deposit', cells: [[{ text: '£' }, { blank: 5 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'What happens if the order is cancelled after the three-day point?',
          options: [
            { key: 'A', text: 'The deposit is kept towards the ingredients.' },
            { key: 'B', text: 'The deposit is fully refunded.' },
            { key: 'C', text: 'The deposit is moved to another order.' },
          ],
        },
        {
          number: 7,
          stem: 'What does the assistant say about the nut allergy?',
          options: [
            { key: 'A', text: 'The cake is guaranteed completely nut-free.' },
            { key: 'B', text: 'The kitchen may contain nut traces.' },
            { key: 'C', text: 'Allergic guests must order a separate dessert.' },
          ],
        },
        {
          number: 8,
          stem: 'What is included in the forty-two pound price?',
          options: [
            { key: 'A', text: 'home delivery' },
            { key: 'B', text: 'candles and the icing message' },
            { key: 'C', text: 'a second portion for the allergic guest' },
          ],
        },
        {
          number: 9,
          stem: 'Why does the customer decide to collect the cake?',
          options: [
            { key: 'A', text: 'Delivery is unavailable on Saturdays.' },
            { key: 'B', text: 'The delivery fee covers only the town centre.' },
            { key: 'C', text: 'The trip is short enough to collect.' },
          ],
        },
        {
          number: 10,
          stem: 'What filling does the cake use?',
          options: [
            { key: 'A', text: 'fresh cream' },
            { key: 'B', text: 'buttercream' },
            { key: 'C', text: 'chocolate ganache' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['ten-inch'], evidence: 3,
      explanation: {
        zh: '定位句 3：I’d suggest the ten-inch round, which feeds up to twenty-five people。按二十位客人推荐的尺寸是 ten-inch；round 是形状，不是尺寸答案。',
        en: 'Sentence 3: "I’d suggest the ten-inch round, which feeds up to twenty-five people". For twenty guests the recommended size is ten-inch; round describes the shape, not the size.',
      },
    },
    {
      number: 2, accepted: ['lemon'], evidence: 7,
      explanation: {
        zh: '定位句 7：Let’s go with lemon。家长先提 chocolate，句 6 因半数客人不吃而改口，lemon 是最终选择；chocolate 是被放弃的干扰项。',
        en: 'Sentence 7: "Let’s go with lemon". The customer first says chocolate, then in sentence 6 changes it because half the guests do not eat it; lemon is the final choice and chocolate is the rejected distractor.',
      },
    },
    {
      number: 3, accepted: ['Poppy'], evidence: 13,
      explanation: {
        zh: '定位句 13：Just Happy birthday Poppy, in pink if you have it。表头已印 Happy birthday，空格只填名字 Poppy，首字母大写。',
        en: 'Sentence 13: "Just Happy birthday Poppy, in pink if you have it". Happy birthday is already printed, so the gap needs only the name Poppy, capitalised.',
      },
    },
    {
      number: 4, accepted: ['Saturday'], evidence: 17,
      explanation: {
        zh: '定位句 17：Saturday afternoon, after three, then。取货日是 Saturday；noon 与 after three 是时段，不是日期。',
        en: 'Sentence 17: "Saturday afternoon, after three, then". The collection day is Saturday; noon and after three are time slots, not the day.',
      },
    },
    {
      number: 5, accepted: ['ten', '10'], spoken: 'ten pounds', evidence: 20,
      explanation: {
        zh: '定位句 20：We take a deposit of ten pounds。订金是 ten pounds；句 30 的 forty-two 是总价，句 32 的 eight 是配送费，都不是订金。',
        en: 'Sentence 20: "We take a deposit of ten pounds". The deposit is ten pounds. Forty-two in sentence 30 is the total price and eight in sentence 32 the delivery fee, neither is the deposit.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：After that point, it is kept towards the ingredients。超过三天期限后订金抵作食材费，对应 A。B 与 kept towards 相反，C 是三天前取消的处理方式，张冠李戴。',
        en: 'Sentence 23: "After that point, it is kept towards the ingredients". After the deadline the deposit covers ingredients, matching A. B contradicts kept towards, and C is the rule for cancelling three days beforehand.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：I can’t promise the kitchen is completely free of nut traces。厨房可能有坚果残留，对应 B。A 与 can’t promise 相反，C 要求另订甜点在录音中没有提到。',
        en: 'Sentence 26: "I can’t promise the kitchen is completely free of nut traces". Traces may remain, matching B. A contradicts can’t promise, and a separate dessert is never mentioned.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：the candles and the icing message are included in that。总价含蜡烛与糖霜文字，对应 B。配送在句 32 另收八镑，C 的第二份点心未提及。',
        en: 'Sentence 30: "the candles and the icing message are included in that". The price covers candles and the message, matching B. Delivery costs eight pounds extra in sentence 32, and a second portion is not mentioned.',
      },
    },
    {
      number: 9, accepted: ['C'], evidence: 32,
      explanation: {
        zh: '定位句 32：for a short trip to your street collecting is usually simpler。路程短，自取更方便，对应 C。A 的周六不配送与录音相反，B 的配送范围限制未提及。',
        en: 'Sentence 32: "for a short trip to your street collecting is usually simpler". The short trip makes collecting easier, matching C. Saturday delivery being unavailable contradicts the recording, and a delivery area limit is not mentioned.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：Buttercream throughout, which keeps better in a warm room than fresh cream would。夹心全程用奶油霜，对应 B；fresh cream 是被比较后否定的对象。',
        en: 'Sentence 35: "Buttercream throughout, which keeps better in a warm room than fresh cream would". The filling is buttercream, matching B; fresh cream is the rejected comparison.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hello, I’d like to order a birthday cake for my daughter, if you take orders by phone.' },
    { speaker: 'assistant', text: 'Good to hear from you. Is the party at home, or somewhere else?' },
    { speaker: 'customer', text: 'At home, and about twenty guests are coming on Saturday afternoon.' },
    { speaker: 'assistant', text: 'Twenty guests, then. I’d suggest the ten-inch round, which feeds up to twenty-five people.' },
    { speaker: 'customer', text: 'The ten-inch sounds right. What flavours do you have this week?' },
    { speaker: 'assistant', text: 'Today we can offer chocolate, vanilla, lemon and coffee, and the fillings change with each one.' },
    { speaker: 'customer', text: 'She likes chocolate, but hold on, half the guests don’t eat it, so lemon would be safer.' },
    { speaker: 'customer', text: 'Let’s go with lemon, with vanilla buttercream between the layers.' },
    { speaker: 'assistant', text: 'Lemon with vanilla buttercream, noted. And how many candles will you need?' },
    { speaker: 'customer', text: 'Eight, please. She turns eight this month.' },
    { speaker: 'assistant', text: 'Eight candles go in with the order at no extra charge.' },
    { speaker: 'customer', text: 'Now, what should we write on top of the cake?' },
    { speaker: 'assistant', text: 'We can pipe a message in icing, up to twenty letters, and there are three colours to choose from.' },
    { speaker: 'customer', text: 'Just Happy birthday Poppy, in pink if you have it.' },
    { speaker: 'assistant', text: 'Happy birthday Poppy, pink icing. That fits within the letter limit.' },
    { speaker: 'customer', text: 'And when could I collect it?' },
    { speaker: 'assistant', text: 'Cakes for Saturday parties can be collected from twelve noon, or after three in the afternoon.' },
    { speaker: 'customer', text: 'Saturday afternoon, after three, then. I’ll be out in the morning anyway.' },
    { speaker: 'assistant', text: 'After three on Saturday. We close at five, so don’t leave it too late.' },
    { speaker: 'customer', text: 'How much deposit do you need to hold the order?' },
    { speaker: 'assistant', text: 'We take a deposit of ten pounds, and the rest is paid when you collect.' },
    { speaker: 'customer', text: 'Fine. What happens if we have to cancel?' },
    { speaker: 'assistant', text: 'If you cancel three days beforehand, the deposit stays on the account for another order.' },
    { speaker: 'assistant', text: 'After that point, it is kept towards the ingredients, because the cake has already been prepared.' },
    { speaker: 'customer', text: 'Understood. Now, one guest has a nut allergy, so I should mention that.' },
    { speaker: 'assistant', text: 'Thanks for telling me. Our lemon sponge itself contains no nuts, but we do prepare chocolate cakes in the same kitchen.' },
    { speaker: 'assistant', text: 'I can’t promise the kitchen is completely free of nut traces, so I’ll write the allergy note on the order card.' },
    { speaker: 'customer', text: 'So is the cake safe for her, or not?' },
    { speaker: 'assistant', text: 'It is made without nuts, but for that guest I would keep her portion apart and label it clearly.' },
    { speaker: 'customer', text: 'Right. What is the total price, then?' },
    { speaker: 'assistant', text: 'The ten-inch lemon cake is forty-two pounds, and the candles and the icing message are included in that.' },
    { speaker: 'customer', text: 'Forty-two. Do you deliver, or must we collect?' },
    { speaker: 'assistant', text: 'We can deliver within the town for an extra eight pounds, but for a short trip to your street collecting is usually simpler.' },
    { speaker: 'customer', text: 'We’ll collect, thanks.' },
    { speaker: 'customer', text: 'Is the cake filled with fresh cream, or buttercream?' },
    { speaker: 'assistant', text: 'Buttercream throughout, which keeps better in a warm room than fresh cream would.' },
    { speaker: 'assistant', text: 'Can I take a name and a contact number for the order?' },
    { speaker: 'customer', text: 'It’s Mara Hale, and the number is oh seven seven one, two three four, six eight nine.', displayText: 'It’s 0771 234 689.' },
    { speaker: 'assistant', text: 'Got it. I’ll confirm the details by email this evening.' },
    { speaker: 'customer', text: 'Thank you.' },
    { speaker: 'assistant', text: 'You’re welcome. See you Saturday.' },
  ],
  vocabulary: [
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '订金，押金', en: 'a sum paid in advance to hold an order' },
      usage: { zh: '可数名词；pay a deposit、keep the deposit。报名与预订场景高频。', en: 'Countable: pay a deposit, keep the deposit. Common in booking scenes.' },
      collocations: ['pay a deposit', 'a deposit of', 'keep the deposit'],
      example: { en: 'You pay a small deposit to reserve the cake.', zh: '付一小笔订金即可预留蛋糕。' },
      listening: { zh: '重音在第二音节 /ˈpɒz/，与 dispose 同根。', en: 'Stress the second syllable; related to dispose.' },
    },
    {
      term: 'flavours', phonetic: '/ˈfleɪvəz/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '口味，风味', en: 'the taste of a food or drink' },
      usage: { zh: '英式拼写 flavour，美式 flavor；What flavour、chocolate flavour。', en: 'British flavour, American flavor: what flavour, chocolate flavour.' },
      collocations: ['a choice of flavour', 'lemon flavour', 'the flavour of'],
      example: { en: 'The shop offers four flavours each week.', zh: '店里每周提供四种口味。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /ə/ 不卷舌。', en: 'Two syllables with first-syllable stress; the ending is not rolled.' },
    },
    {
      term: 'buttercream', phonetic: '/ˈbʌtəkriːm/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '奶油霜（黄油加糖制成的夹心）', en: 'a sweet filling made from butter and sugar' },
      usage: { zh: '不可数；between the layers 指蛋糕夹层。', en: 'Uncountable; between the layers means in the cake filling.' },
      collocations: ['vanilla buttercream', 'buttercream filling', 'covered in buttercream'],
      example: { en: 'The sponge is filled with vanilla buttercream.', zh: '蛋糕夹层是香草奶油霜。' },
      listening: { zh: '复合词，butter 弱读成 /bət/，重音在 cream。', en: 'A compound; butter weakens to /bət/, stress on cream.' },
    },
    {
      term: 'icing', phonetic: '/ˈaɪsɪŋ/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '糖霜，糖衣', en: 'a sweet coating spread over cakes' },
      usage: { zh: '不可数；icing message 指用糖霜挤出的文字。', en: 'Uncountable; an icing message is piped in frosting.' },
      collocations: ['the icing message', 'pink icing', 'pipe icing'],
      example: { en: 'The name was piped in white icing.', zh: '名字是用白糖霜挤上去的。' },
      listening: { zh: '与 ice 同根，开头 /aɪ/ 是双元音。', en: 'Related to ice; the opening /aɪ/ is a diphthong.' },
    },
    {
      term: 'ingredients', phonetic: '/ɪnˈɡriːdiənts/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '原料，配料', en: 'a food item used in making a dish or cake' },
      usage: { zh: '可数名词，常用复数；cake ingredients、fresh ingredients。', en: 'Countable, often plural: cake ingredients, fresh ingredients.' },
      collocations: ['the ingredients', 'fresh ingredients', 'list of ingredients'],
      example: { en: 'The ingredients are weighed out the night before.', zh: '配料在前一晚称好。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈɡriː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'allergy', phonetic: '/ˈælədʒi/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '过敏', en: 'a medical reaction to a particular food or substance' },
      usage: { zh: '可数名词；a nut allergy、have an allergy to something。形容词 allergic。', en: 'Countable: a nut allergy. The adjective is allergic.' },
      collocations: ['a nut allergy', 'food allergy', 'an allergy to'],
      example: { en: 'Please tell us about any food allergy before ordering.', zh: '下单前请告知任何食物过敏情况。' },
      listening: { zh: '三个音节，重音在第一个；结尾 /dʒi/ 读清楚。', en: 'Three syllables with first-syllable stress; listen for the final /dʒi/.' },
    },
    {
      term: 'traces', phonetic: '/ˈtreɪsɪz/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '微量残留，痕迹', en: 'a very small amount left behind' },
      usage: { zh: '可数；nut traces、traces of something。食品安全提示常用。', en: 'Countable: nut traces, traces of something. Common in food safety notes.' },
      collocations: ['nut traces', 'traces of nuts', 'free of traces'],
      example: { en: 'The kitchen may contain traces of nuts.', zh: '厨房可能残留坚果成分。' },
      listening: { zh: '单音节，与 trade 押韵，元音是 /eɪ/。', en: 'One syllable rhyming with trade, vowel /eɪ/.' },
    },
    {
      term: 'portion', phonetic: '/ˈpɔːʃn/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '一份（食物）', en: 'a single serving of food for one person' },
      usage: { zh: '可数名词；a portion of cake、keep one portion apart。', en: 'Countable: a portion of cake, keep one portion apart.' },
      collocations: ['a portion of', 'one portion', 'a generous portion'],
      example: { en: 'Set aside one portion for the allergic guest.', zh: '给过敏的客人留出一份。' },
      listening: { zh: '两个音节，重音在第一个；/ʃn/ 结尾不要多加元音。', en: 'Two syllables with first-syllable stress; do not add a vowel before /ʃn/.' },
    },
  ],
  expressions: [
    {
      phrase: 'go with', sentenceIndex: 7,
      meaning: { zh: '选择，敲定（某选项）', en: 'to choose one option after weighing them' },
      usage: { zh: '口语常用；go with lemon、I’ll go with the larger one。', en: 'Spoken: go with lemon, I’ll go with the larger one.' },
      example: { en: 'I think I’ll go with the lemon filling.', zh: '我想选柠檬夹心。' },
    },
    {
      phrase: 'hold the order', sentenceIndex: 19,
      meaning: { zh: '保留订单名额', en: 'to keep an order reserved until payment' },
      usage: { zh: 'hold 搭配 order、place、table 表示暂时保留。', en: 'Hold with order, place or table means to reserve.' },
      example: { en: 'The deposit holds the order until Saturday.', zh: '订金把订单保留到周六。' },
    },
    {
      phrase: 'three days beforehand', sentenceIndex: 22,
      meaning: { zh: '提前三天', en: 'three days before the event' },
      usage: { zh: 'beforehand 表示“提前”；也可说 three days in advance。', en: 'Beforehand means in advance; three days in advance is equivalent.' },
      example: { en: 'Tell us three days beforehand if you need to cancel.', zh: '如需取消，请提前三天告知。' },
    },
    {
      phrase: 'kept towards', sentenceIndex: 23,
      meaning: { zh: '抵作（某项费用）', en: 'used to pay part of a later cost' },
      usage: { zh: 'keep something towards the ingredients；说明押金的去向。', en: 'Keep something towards the ingredients, stating where the deposit goes.' },
      example: { en: 'The deposit is kept towards the materials.', zh: '订金抵作材料费。' },
    },
    {
      phrase: 'included in', sentenceIndex: 30,
      meaning: { zh: '包含在（价格）之内', en: 'part of the price paid' },
      usage: { zh: 'be included in the price；反义是 extra charge。', en: 'Be included in the price; the opposite is an extra charge.' },
      example: { en: 'Delivery is not included in the ticket price.', zh: '票价不含配送。' },
    },
    {
      phrase: 'keeps better', sentenceIndex: 35,
      meaning: { zh: '保存得更久、更稳定', en: 'stays fresh or usable for longer' },
      usage: { zh: 'keep 指食物保存；keeps better in a warm room。', en: 'Keep means food stays edible; keeps better in a warm room.' },
      example: { en: 'Buttercream keeps better than fresh cream in summer.', zh: '夏天奶油霜比鲜奶油更耐放。' },
    },
  ],
  tips: [
    {
      title: { zh: '改口之后选最终口味', en: 'The corrected flavour wins' },
      body: {
        zh: '句 6 先说 chocolate，再用 hold on 改成 lemon。口味题一定要以改口后的那一项为准；chocolate 往往被放进干扰选项。',
        en: 'Sentence 6 opens with chocolate and then corrects to lemon with hold on. For flavour items, take the corrected choice; chocolate is usually planted as a distractor.',
      },
    },
    {
      title: { zh: '总价、订金、配送费分开记', en: 'Separate total, deposit and delivery fee' },
      body: {
        zh: '一段对话里常出现多笔钱：订金 ten、总价 forty-two、配送费 eight。听数字时连同它对应的名目一起记，避免把配送费当成订金。',
        en: 'One dialogue often carries several sums: the deposit ten, the total forty-two, the delivery fee eight. Record the figure together with what it pays for, so the delivery fee is not mistaken for the deposit.',
      },
    },
    {
      title: { zh: '过敏题听否定承诺', en: 'Listen for the refusal in allergy items' },
      body: {
        zh: '过敏类单选常把“不含某成分”和“厨房完全无残留”混在一起。can’t promise、may contain 之后才是真实政策，保证性说法通常是干扰项。',
        en: 'Allergy choices often mix “no nut in the cake” with “a nut-free kitchen”. The real policy follows can’t promise or may contain; guaranteed wording is usually the distractor.',
      },
    },
  ],
};
