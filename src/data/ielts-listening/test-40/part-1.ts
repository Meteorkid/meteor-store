import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 40 · Part 1 — 订花送人（双人对话，加拿大 + 美式口音）。原创仿真材料，非官方真题。
 *
 * 对话顺序：登记姓名与场合 → 送达时段 → 贺卡字数 → 远程下单方式 → 替换花材（填空 1–6）→
 * 替换前确认、送达窗口、保鲜建议与远程订单流转（单选 7–10）。题块顺序与录音顺序一致。
 */
export const test40Part1: ListeningLesson = {
  slug: 'test-40-part-1',
  part: 1,
  status: 'published',
  title: { zh: '订花送人', en: 'Ordering a flower delivery' },
  summary: {
    zh: '顾客为姐姐生日订花：登记姓名 Carter、场合生日，选择下午送达，贺卡限三十词，通过网站远程下单并在线付款；了解玫瑰缺货时以同色百合替换、替换前会电话确认花色与风格、送达窗口两小时，以及斜剪花茎并每日换水的保鲜建议。',
    en: 'A customer orders a birthday bouquet for his sister: surname Carter, occasion birthday, afternoon slot, a thirty word card, and a website order paid online. He learns roses are replaced by a similarly coloured lily after a phone confirmation, the delivery window is two hours, and fresh flowers need angled stem cuts and daily water changes.',
  },
  accent: { zh: '花店店员为加拿大口音，顾客为美式口音。', en: 'The florist speaks with a Canadian accent and the customer with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'florist', label: 'FLORIST', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Occasion', cells: [[{ blank: 2 }]] },
        { lead: 'Delivery slot', cells: [[{ blank: 3 }]] },
        { lead: 'Card message limit', cells: [[{ blank: 4 }, { text: 'words' }]] },
        { lead: 'Order method', cells: [[{ blank: 5 }]] },
        { lead: 'Replacement stem', cells: [[{ blank: 6 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'What happens before a flower substitution?',
          options: [
            { key: 'A', text: 'the florist calls to confirm colour and style' },
            { key: 'B', text: 'the customer must visit the shop' },
            { key: 'C', text: 'the order is cancelled automatically' },
          ],
        },
        {
          number: 8,
          stem: 'How long is the delivery window?',
          options: [
            { key: 'A', text: 'one hour' },
            { key: 'B', text: 'two hours' },
            { key: 'C', text: 'three hours' },
          ],
        },
        {
          number: 9,
          stem: 'What fresh keeping advice is given?',
          options: [
            { key: 'A', text: 'put the bouquet in direct sun' },
            { key: 'B', text: 'leave any leaves below the water line' },
            { key: 'C', text: 'cut stems at an angle and change water daily' },
          ],
        },
        {
          number: 10,
          stem: 'How does a remote order reach the local shop?',
          options: [
            { key: 'A', text: 'the website sends it after online payment clears' },
            { key: 'B', text: 'a courier carries the cash to the shop' },
            { key: 'C', text: 'the customer phones each stem to the shop' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Carter'], evidence: 4,
      explanation: {
        zh: '定位句 4：Carter. C, A, R, T, E, R。拼写题跟着字母逐个写；不要按发音误写成 Cartor 或 Karter。',
        en: 'Sentence 4: "Carter. C, A, R, T, E, R". Write the letters as spelled; do not guess Cartor or Karter from the sound.',
      },
    },
    {
      number: 2, accepted: ['birthday'], evidence: 6,
      explanation: {
        zh: '定位句 6：It’s her birthday, so something bright and cheerful。场合是生日，填 birthday；句 7 的 warm colours 是风格搭配，不是场合。',
        en: 'Sentence 6: "It’s her birthday, so something bright and cheerful". The occasion is birthday, so fill birthday. Warm colours in sentence 7 are the style, not the occasion.',
      },
    },
    {
      number: 3, accepted: ['afternoon'], evidence: 9,
      explanation: {
        zh: '定位句 9：We offer morning and afternoon slots, and the next available one is tomorrow afternoon。选下午档，填 afternoon；上午档是另一个选项。',
        en: 'Sentence 9: "We offer morning and afternoon slots, and the next available one is tomorrow afternoon". The slot is afternoon, so fill afternoon. The morning slot is the other option.',
      },
    },
    {
      number: 4, accepted: ['30', 'thirty'], spoken: 'thirty', evidence: 12,
      explanation: {
        zh: '定位句 12：Yes, there is a card with each order. The message has a limit of thirty words。贺卡限三十词，填 thirty；更长内容改由邮件发送，不占卡片。',
        en: 'Sentence 12: "Yes, there is a card with each order. The message has a limit of thirty words". The card limit is thirty words, so fill thirty. Longer messages go by email instead.',
      },
    },
    {
      number: 5, accepted: ['website'], evidence: 15,
      explanation: {
        zh: '定位句 15：You can order through the website, choose the slot and pay online, and the order reaches our local shop。远程下单走网站，填 website；电话只用于改动送达细节。',
        en: 'Sentence 15: "You can order through the website, choose the slot and pay online, and the order reaches our local shop". The method is the website, so fill website. The phone handles delivery changes only.',
      },
    },
    {
      number: 6, accepted: ['lily'], evidence: 17,
      explanation: {
        zh: '定位句 17：If a rose variety is unavailable, we replace it with a lily of a similar shade。替换花材是百合，填 lily；玫瑰是缺货的原品种，不是替换项。',
        en: 'Sentence 17: "If a rose variety is unavailable, we replace it with a lily of a similar shade". The replacement stem is lily, so fill lily. The rose is the original that ran short.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：Before any substitution, we call you to confirm the main colour and style。替换前先电话确认花色与风格，对应 A。不必到店，也不会自动取消订单。',
        en: 'Sentence 21: "Before any substitution, we call you to confirm the main colour and style", matching A. No shop visit is required, and the order is not cancelled automatically.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：The delivery runs in a two hour window, and the driver texts when arriving。送达窗口两小时，对应 B；短信到达是送达环节，不是窗口长度。',
        en: 'Sentence 23: "The delivery runs in a two hour window, and the driver texts when arriving", matching B. The arrival text is part of delivery, not the window length.',
      },
    },
    {
      number: 9, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：Cut the stems at an angle when they arrive, and change the water every day。斜剪花茎并每日换水，对应 C。避免直射与热源，泡水线下的叶子要去掉。',
        en: 'Sentence 25: "Cut the stems at an angle when they arrive, and change the water every day", matching C. Keep the bouquet away from direct sun and heat, and strip leaves below the water line.',
      },
    },
    {
      number: 10, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：The website sends the order directly to our local shop after the online payment clears。网站在在线付款结清后把订单送到本地店，对应 A。没有专人送现金，也不靠电话报花材。',
        en: 'Sentence 29: "The website sends the order directly to our local shop after the online payment clears", matching A. No courier carries cash, and stems are not listed by phone.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'I’d like to order a bouquet for my sister’s birthday, if that’s still possible.' },
    { speaker: 'florist', text: 'Of course. We arrange hand tied bouquets for any occasion.' },
    { speaker: 'customer', text: 'Great. Can I leave my name for the order?' },
    { speaker: 'florist', text: 'Sure. What’s your surname?' },
    { speaker: 'customer', text: 'Carter. C, A, R, T, E, R.' },
    { speaker: 'florist', text: 'Carter, noted. What occasion is the bouquet for?' },
    { speaker: 'customer', text: 'It’s her birthday, so something bright and cheerful.' },
    { speaker: 'florist', text: 'For a birthday we mix roses with seasonal stems in warm colours.' },
    { speaker: 'customer', text: 'When can the flowers be delivered?' },
    { speaker: 'florist', text: 'We offer morning and afternoon slots, and the next available one is tomorrow afternoon.' },
    { speaker: 'customer', text: 'The afternoon suits me. She will be home after lunch.' },
    { speaker: 'customer', text: 'Can we add a card with the bouquet?' },
    { speaker: 'florist', text: 'Yes, there is a card with each order. The message has a limit of thirty words.' },
    { speaker: 'customer', text: 'Thirty words. I will keep the note short and warm.' },
    { speaker: 'customer', text: 'I’m placing this from another city, so how do I pay and confirm?' },
    { speaker: 'florist', text: 'You can order through the website, choose the slot and pay online, and the order reaches our local shop.' },
    { speaker: 'customer', text: 'What if the roses you planned are out of stock?' },
    { speaker: 'florist', text: 'If a rose variety is unavailable, we replace it with a lily of a similar shade.' },
    { speaker: 'customer', text: 'So the lily is the replacement stem you would use?' },
    { speaker: 'florist', text: 'Yes, a lily matches the rose in colour and texture when the rose runs short.' },
    { speaker: 'customer', text: 'I’m glad you check first. I don’t want a surprise bouquet.' },
    { speaker: 'florist', text: 'Before any substitution, we call you to confirm the main colour and style.' },
    { speaker: 'customer', text: 'How long is the delivery window once the slot is chosen?' },
    { speaker: 'florist', text: 'The delivery runs in a two hour window, and the driver texts when arriving.' },
    { speaker: 'customer', text: 'Any advice to keep the flowers fresh once they arrive?' },
    { speaker: 'florist', text: 'Cut the stems at an angle when they arrive, and change the water every day.' },
    { speaker: 'customer', text: 'Should I put the bouquet in direct sunlight?' },
    { speaker: 'florist', text: 'Keep it away from direct sun and heating, and remove any leaves below the water line.' },
    { speaker: 'customer', text: 'How does the order reach the local shop when I order from far away?' },
    { speaker: 'florist', text: 'The website sends the order directly to our local shop after the online payment clears.' },
    { speaker: 'customer', text: 'What happens if the recipient is not in?' },
    { speaker: 'florist', text: 'The driver leaves the flowers with a neighbour, or returns them to the shop for a second attempt.' },
    { speaker: 'customer', text: 'How far ahead should I order for a special date?' },
    { speaker: 'florist', text: 'Two days in advance gives us time to source the stems, though same day orders are possible before noon.' },
    { speaker: 'customer', text: 'Do you deliver to offices as well as homes?' },
    { speaker: 'florist', text: 'We deliver to both, but office orders need a contact person and the room number.' },
    { speaker: 'customer', text: 'I will fill the order on the website tonight.' },
    { speaker: 'florist', text: 'Perfect. Please double check the card message and the delivery address before confirming.' },
    { speaker: 'customer', text: 'Thanks for walking me through the options.' },
    { speaker: 'florist', text: 'You’re welcome. We hope she enjoys the bouquet.' },
  ],
  vocabulary: [
    {
      term: 'bouquet', phonetic: '/buˈkeɪ/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '花束', en: 'the tied arrangement of flowers bought as a gift' },
      usage: { zh: '可数名词；a hand tied bouquet、order a bouquet。', en: 'Countable: a hand tied bouquet, order a bouquet.' },
      collocations: ['a hand tied bouquet', 'order a bouquet', 'the birthday bouquet'],
      example: { en: 'The customer orders a birthday bouquet.', zh: '顾客订一束生日花。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈkeɪ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'substitution', phonetic: '/ˌsʌbstɪˈtjuːʃn/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '替换，花材调换', en: 'replacing one stem with another when stock runs short' },
      usage: { zh: '可数/不可数；before any substitution、a substitution request。动词 substitute。', en: 'Before any substitution, a substitution request; the verb is substitute.' },
      collocations: ['flower substitution', 'before any substitution', 'a substitution request'],
      example: { en: 'A call comes before any substitution.', zh: '任何替换前都会先打电话。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈtjuː/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'slots', phonetic: '/slɒts/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '时段，预约窗口', en: 'the chosen period for delivery or collection' },
      usage: { zh: '可数名词；delivery slot、afternoon slot。', en: 'Countable: delivery slot, afternoon slot.' },
      collocations: ['the delivery slot', 'the afternoon slot', 'choose a slot'],
      example: { en: 'The next available slot is tomorrow afternoon.', zh: '下一个可选时段是明天下午。' },
      listening: { zh: '单音节，元音 /ɒ/，与 got 押韵。', en: 'One syllable with /ɒ/, rhyming with got.' },
    },
    {
      term: 'stems', phonetic: '/stemz/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '花茎，花枝', en: 'the long stalk of each flower in the arrangement' },
      usage: { zh: '可数复数；cut the stems、seasonal stems。单数 stem。', en: 'Countable plural: cut the stems, seasonal stems; singular stem.' },
      collocations: ['cut the stems', 'seasonal stems', 'the flower stems'],
      example: { en: 'The florist replaces the rose with a lily stem.', zh: '店员用百合枝替换玫瑰。' },
      listening: { zh: '单音节，结尾 /z/。', en: 'One syllable ending /z/.' },
    },
    {
      term: 'texture', phonetic: '/ˈtekstʃə/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '质感，花材外形触感', en: 'the look and feel of a flower, matched when substituting' },
      usage: { zh: '不可数；colour and texture、match the texture。', en: 'Uncountable: colour and texture, match the texture.' },
      collocations: ['colour and texture', 'match the texture', 'the flower texture'],
      example: { en: 'The lily matches the rose in texture.', zh: '百合与玫瑰质感相近。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtek/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'source', phonetic: '/sɔːs/', partOfSpeech: 'v.', sentenceIndex: 33,
      meaning: { zh: '采购，组织到货源', en: 'to obtain the required stems from suppliers' },
      usage: { zh: '及物动词；source the stems、source fresh flowers。', en: 'Transitive: source the stems, source fresh flowers.' },
      collocations: ['source the stems', 'source fresh flowers', 'source in advance'],
      example: { en: 'Two days gives time to source the stems.', zh: '两天时间足够采购花材。' },
      listening: { zh: '单音节，与 sauce 同音。', en: 'One syllable, homophone with sauce.' },
    },
    {
      term: 'recipient', phonetic: '/rɪˈsɪpiənt/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '收花人，接收者', en: 'the person who receives the bouquet' },
      usage: { zh: '可数名词；the recipient is not in、contact the recipient。', en: 'Countable: the recipient is not in, contact the recipient.' },
      collocations: ['the recipient', 'the intended recipient', 'meet the recipient'],
      example: { en: 'The driver leaves flowers with a neighbour if the recipient is out.', zh: '收花人不在时司机把花留给邻居。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsɪp/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'leave my name', sentenceIndex: 2,
      meaning: { zh: '登记姓名', en: 'to write down one’s name for the order' },
      usage: { zh: '登记订单时留下姓名；leave your name、leave your details。', en: 'Leave your name, leave your details.' },
      example: { en: 'Could I leave my name for the order?', zh: '我可以登记姓名占个订单吗？' },
    },
    {
      phrase: 'out of stock', sentenceIndex: 16,
      meaning: { zh: '缺货，卖完', en: 'the planned flower variety has no stock left' },
      usage: { zh: '表语；be out of stock、run out of stock。', en: 'Predicative: be out of stock, run out of stock.' },
      example: { en: 'What if the roses are out of stock?', zh: '万一玫瑰缺货怎么办？' },
    },
    {
      phrase: 'runs short', sentenceIndex: 19,
      meaning: { zh: '所剩无几，缺货', en: 'to have only a small amount left' },
      usage: { zh: '不及物；the rose runs short、the supply runs short。', en: 'Intransitive: the rose runs short, the supply runs short.' },
      example: { en: 'The lily matches the rose when it runs short.', zh: '玫瑰将尽时用百合替代。' },
    },
    {
      phrase: 'walking me through', sentenceIndex: 38,
      meaning: { zh: '逐项讲解，带我过一遍', en: 'to explain the options step by step' },
      usage: { zh: '及物；walk me through the options、walk through the process。', en: 'Transitive: walk me through the options, walk through the process.' },
      example: { en: 'Thanks for walking me through the options.', zh: '谢谢你逐项讲解。' },
    },
    {
      phrase: 'change the water', sentenceIndex: 25,
      meaning: { zh: '换水（保鲜）', en: 'to replace the water in the vase each day' },
      usage: { zh: '及物；change the water daily、change the vase water。', en: 'Transitive: change the water daily, change the vase water.' },
      example: { en: 'Change the water every day to keep the bouquet fresh.', zh: '每天换水以保持花束新鲜。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单字段先预判答案类型', en: 'Predict the answer type from each row' },
      body: {
        zh: '听前把 Surname、Occasion、Delivery slot、Card message limit、Order method、Replacement stem 读一遍，预判填姓名、场合、时段、数字、方式还是花材；听到字段名再落笔。',
        en: 'Read Surname, Occasion, Delivery slot, Card message limit, Order method and Replacement stem beforehand, and predict a name, occasion, slot, number, method or stem. Write only at the matching cue.',
      },
    },
    {
      title: { zh: '替换题抓“先确认后更换”', en: 'Substitution: confirm first, then swap' },
      body: {
        zh: '缺货不是直接换：店员先电话确认花色与风格，再用同色百合替代。选项常把替换说成自动处理或必须到店，听时抓住 call、confirm、similar shade 这类限定。',
        en: 'Stock shortage does not mean an instant swap: the florist calls to confirm colour and style first, then substitutes a similarly coloured lily. Distractors make the swap automatic or require a shop visit; catch call, confirm and similar shade.',
      },
    },
    {
      title: { zh: '远程订单区分下单与送达', en: 'Separate ordering from delivery' },
      body: {
        zh: '网站下单、在线付款结清后订单才传到本地店；送达窗口两小时、司机到达发短信。听到 website、payment、window、text 时判断这是下单环节还是送达环节。',
        en: 'The website order reaches the local shop only after online payment clears; the delivery window is two hours and the driver texts on arrival. At website, payment, window and text, decide whether it is ordering or delivery.',
      },
    },
  ],
};
