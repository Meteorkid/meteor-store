import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 14 · Part 1 — 买家上门看二手自行车（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话围绕车型、车龄、刹车状况、报价、用途、换挡、付款方式、
 * 送货范围、保修与随车配件展开，穿插头盔、现金、拖车等干扰信息。
 */
export const test14Part1: ListeningLesson = {
  slug: 'test-14-part-1',
  part: 1,
  status: 'published',
  title: { zh: '买二手自行车', en: 'Buying a second-hand bike' },
  summary: {
    zh: '买家上门看一辆待售二手自行车：车型与车龄、刹车和换挡状况、报价，买车用途，付款方式，送货范围、保修期限以及随车包含的配件。',
    en: 'A buyer visits a seller to inspect a second-hand bicycle: the model and age, brake and gear condition, the asking price, what the buyer needs it for, payment method, delivery range, warranty period and the accessories that are included.',
  },
  accent: { zh: '两位说话人均为澳式口音。', en: 'Both speakers use Australian accents.' },
  speechRate: '+3%',
  cast: [
    { id: 'seller', label: 'SELLER', gender: 'female', voice: 'en-AU-NatashaNeural' },
    { id: 'buyer', label: 'BUYER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Bike model', cells: [[{ blank: 1 }]] },
        { lead: 'Age of the bike', cells: [[{ blank: 2 }, { text: ' years' }]] },
        { lead: 'Brake condition', cells: [[{ blank: 3 }]] },
        { lead: 'Asking price', cells: [[{ text: '£' }, { blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What does the buyer mainly need the bike for?',
          options: [
            { key: 'A', text: 'travelling to the university campus' },
            { key: 'B', text: 'long weekend cycling trips' },
            { key: 'C', text: 'delivering food around the city' },
          ],
        },
        {
          number: 6,
          stem: 'What does the seller say about the gears?',
          options: [
            { key: 'A', text: 'They slip under heavy load.' },
            { key: 'B', text: 'They shift smoothly.' },
            { key: 'C', text: 'They were replaced last year.' },
          ],
        },
        {
          number: 7,
          stem: 'Which payment method does the seller prefer?',
          options: [
            { key: 'A', text: 'Cash on collection' },
            { key: 'B', text: 'Bank transfer before collection' },
            { key: 'C', text: 'Card payment through a website' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Item', 'Detail'],
      rows: [
        { lead: 'Delivery', cells: [[{ text: 'within ' }, { blank: 8 }, { text: ' of the seller’s home' }]] },
        { lead: 'Warranty', cells: [[{ blank: 9 }, { text: ' on the brakes and gears' }]] },
        { lead: 'Included accessory', cells: [[{ blank: 10 }, { text: ' fixed to the handlebars' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Ridgeline'], evidence: 3,
      explanation: {
        zh: '定位句 3：It’s a Ridgeline hybrid, the aluminium frame version in dark blue。车型是 Ridgeline；hybrid 是车种，不是型号名。',
        en: 'Sentence 3: "It’s a Ridgeline hybrid, the aluminium frame version in dark blue". The model is Ridgeline; hybrid describes the type of bike, not the model name.',
      },
    },
    {
      number: 2, accepted: ['four', '4'], spoken: 'four years', evidence: 5,
      explanation: {
        zh: '定位句 5：It’s four years old now, though it’s barely been ridden in the last eighteen months。车龄四年；句末的十八个月是近期使用情况，不是车龄。',
        en: 'Sentence 5: "It’s four years old now, though it’s barely been ridden in the last eighteen months". The bike is four years old; the eighteen months at the end describes recent use, not the age.',
      },
    },
    {
      number: 3, accepted: ['good'], evidence: 7,
      explanation: {
        zh: '定位句 7：The brakes are in good condition. I replaced the pads last spring。刹车状况良好；pads 是刚换的零件，不是空里要填的状况描述。',
        en: 'Sentence 7: "The brakes are in good condition. I replaced the pads last spring". The brake condition is good; pads are the replaced part, not the condition word.',
      },
    },
    {
      number: 4, accepted: ['220'], spoken: 'two hundred and twenty pounds', evidence: 11,
      explanation: {
        zh: '定位句 11：I’m asking two hundred and twenty pounds, though I’m open to a reasonable offer。报价 220 英镑；可议价不代表报价已经下调。',
        en: 'Sentence 11: "I’m asking two hundred and twenty pounds, though I’m open to a reasonable offer". The asking price is two hundred and twenty pounds; being open to an offer does not lower the quoted price.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 14,
      explanation: {
        zh: '定位句 14：I mainly need it to get to the university campus。买车主要为了通勤去校园；长途周末骑行和送餐在全段没有提到。',
        en: 'Sentence 14: "I mainly need it to get to the university campus". The main purpose is commuting to campus; long weekend rides and food delivery are never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：They shift smoothly. I had the cables adjusted at the bike shop last month。换挡顺滑；句 19 说 cassette 仍耐用，并没有说整套齿轮去年更换。',
        en: 'Sentence 17: "They shift smoothly. I had the cables adjusted at the bike shop last month". The gears shift smoothly; sentence 19 says the cassette still has life, not that the gears were replaced last year.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：I’d rather you pay by bank transfer before you take the bike away。卖家偏好取车前银行转账；句 23 说明不常用现金，网站刷卡全段未提。',
        en: 'Sentence 21: "I’d rather you pay by bank transfer before you take the bike away". The seller prefers a transfer before collection; sentence 23 explains cash is rarely kept, and card payment online is never raised.',
      },
    },
    {
      number: 8, accepted: ['ten kilometres', '10 km'], spoken: 'ten kilometres', evidence: 25,
      explanation: {
        zh: '定位句 25：I can deliver within ten kilometres of here, for a small extra charge。送货范围是家周围十公里；额外收费不改变距离。',
        en: 'Sentence 25: "I can deliver within ten kilometres of here, for a small extra charge". The delivery radius is ten kilometres; the extra charge does not change the distance.',
      },
    },
    {
      number: 9, accepted: ['three months'], evidence: 27,
      explanation: {
        zh: '定位句 27：I’ll give you three months’ warranty on the parts I named today。保修三个月；句 29 说明保修只覆盖刹车和齿轮，不含轮胎磨损。',
        en: 'Sentence 27: "I’ll give you three months’ warranty on the parts I named today". The warranty runs three months; sentence 29 limits it to brakes and gears, excluding tyre wear.',
      },
    },
    {
      number: 10, accepted: ['lights'], evidence: 31,
      explanation: {
        zh: '定位句 31：There’s a pump, but the included accessory is a set of lights fixed to the handlebars。随车包含的配件是车灯；气筒虽在，但不在赠品清单里。',
        en: 'Sentence 31: "There’s a pump, but the included accessory is a set of lights fixed to the handlebars". The included accessory is the lights; the pump is present but not listed as included.',
      },
    },
  ],
  transcript: [
    { speaker: 'buyer', text: 'Hi, I’ve come to look at the bike you advertised online.' },
    { speaker: 'seller', text: 'Hello, yes. It’s just inside the garage here, so come through.' },
    { speaker: 'buyer', text: 'Thanks. What model did you say it was again?' },
    { speaker: 'seller', text: 'It’s a Ridgeline hybrid, the aluminium frame version in dark blue.' },
    { speaker: 'buyer', text: 'And how old is it?' },
    { speaker: 'seller', text: 'It’s four years old now, though it’s barely been ridden in the last eighteen months.' },
    { speaker: 'buyer', text: 'Four years. How are the brakes looking?' },
    { speaker: 'seller', text: 'The brakes are in good condition. I replaced the pads last spring, and the rims are straight.' },
    { speaker: 'buyer', text: 'Any rust on the chain or the spokes?' },
    { speaker: 'seller', text: 'The chain has a little surface wear, but nothing that needs work before you ride it.' },
    { speaker: 'buyer', text: 'What are you asking for it?' },
    { speaker: 'seller', text: 'I’m asking two hundred and twenty pounds, though I’m open to a reasonable offer.' },
    { speaker: 'buyer', text: 'Two hundred and twenty. Could I take it for a quick ride around the block?' },
    { speaker: 'seller', text: 'Of course. The helmet on the hook is yours to borrow if you want it.' },
    { speaker: 'buyer', text: 'That’s alright, I’ve got my own. I mainly need it to get to the university campus.' },
    { speaker: 'seller', text: 'A hybrid like this suits commuting well. The tyres are the right width for city roads.' },
    { speaker: 'buyer', text: 'How do the gears feel under load?' },
    { speaker: 'seller', text: 'They shift smoothly. I had the cables adjusted at the bike shop last month.' },
    { speaker: 'buyer', text: 'No slipping when you climb a hill, then?' },
    { speaker: 'seller', text: 'Not that I’ve noticed. The rear cassette still has plenty of life in it.' },
    { speaker: 'buyer', text: 'If we agree on a price, how would you like to be paid?' },
    { speaker: 'seller', text: 'I’d rather you pay by bank transfer before you take the bike away.' },
    { speaker: 'buyer', text: 'Cash isn’t convenient for you, then?' },
    { speaker: 'seller', text: 'I don’t keep much cash at home, and a transfer leaves a clear record for both of us.' },
    { speaker: 'buyer', text: 'Right. Can you deliver it, or do I need to bring a trailer?' },
    { speaker: 'seller', text: 'I can deliver within ten kilometres of here, for a small extra charge.' },
    { speaker: 'buyer', text: 'That would save me hiring a trailer. What about any guarantee on the bike?' },
    { speaker: 'seller', text: 'I’ll give you three months’ warranty on the parts I named today.' },
    { speaker: 'buyer', text: 'Three months. What does that cover if something fails?' },
    { speaker: 'seller', text: 'It covers the brakes and the gears. Tyre wear and a flat tube are your own responsibility.' },
    { speaker: 'buyer', text: 'Does the sale include anything else?' },
    { speaker: 'seller', text: 'There’s a pump, but the included accessory is a set of lights fixed to the handlebars.' },
    { speaker: 'buyer', text: 'The pump looks a bit old, but it’ll do for now.' },
    { speaker: 'seller', text: 'It’s the original one. The lights run off small batteries, so no charging cable is needed.' },
    { speaker: 'buyer', text: 'What size frame is it, by the way?' },
    { speaker: 'seller', text: 'It’s a medium frame, which suits riders between one seventy and one eighty-five.' },
    { speaker: 'buyer', text: 'That’s about right for me. Were the saddle and grips replaced recently?' },
    { speaker: 'seller', text: 'The saddle is original, but the grips are new. I’ll leave the bottle cage on as well.' },
    { speaker: 'buyer', text: 'I’ll think it over tonight and text you tomorrow.' },
    { speaker: 'seller', text: 'Fair enough. I’ve had two other people ask, so don’t leave it too long.' },
    { speaker: 'buyer', text: 'Understood. Thanks for showing me around.' },
    { speaker: 'seller', text: 'No trouble. Ride it gently on your first test lap.' },
  ],
  vocabulary: [
    {
      term: 'hybrid', phonetic: '/ˈhaɪbrɪd/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '混合型自行车（兼顾通勤与轻度骑行）', en: 'a bike built for both commuting and lighter rides' },
      usage: { zh: '可数；a hybrid bike、hybrid frame。也指混合物。', en: 'Countable: a hybrid bike, hybrid frame. It also means a mixture.' },
      collocations: ['a hybrid bike', 'a hybrid frame', 'hybrid model'],
      example: { en: 'A hybrid like this suits commuting well.', zh: '这种混合型自行车很适合通勤。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈhaɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'warranty', phonetic: '/ˈwɒrənti/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '保修，质保承诺', en: 'a promise that faults in a sold item will be repaired within a period' },
      usage: { zh: '可数；a three months’ warranty、under warranty。与 guarantee 近义。', en: 'Countable: a three months’ warranty, under warranty. Near synonym guarantee.' },
      collocations: ['a three months’ warranty', 'under warranty', 'warranty period'],
      example: { en: 'The warranty covers the brakes and the gears.', zh: '保修范围包括刹车和齿轮。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /rən/ 弱读。', en: 'Three syllables with stress on the first; the middle /rən/ is reduced.' },
    },
    {
      term: 'transfer', phonetic: '/trænsˈfɜː(r)/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '转账', en: 'moving money from one bank account to another' },
      usage: { zh: '名词重音在第二音节；bank transfer、pay by transfer。动词同形。', en: 'Noun stress on the second: bank transfer, pay by transfer. The verb shares the form.' },
      collocations: ['a bank transfer', 'pay by transfer', 'online transfer'],
      example: { en: 'I’d rather you pay by bank transfer before collection.', zh: '我更希望取车前银行转账付款。' },
      listening: { zh: '名词重音在后 /ˈfɜː/；不要与 transport 混淆。', en: 'Noun stress on the second; do not confuse with transport.' },
    },
    {
      term: 'brakes', phonetic: '/breɪks/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '刹车，制动器', en: 'the part of a bike that slows or stops the wheel' },
      usage: { zh: '常用复数 brakes；brake pads、brake condition。', en: 'Usually plural brakes: brake pads, brake condition.' },
      collocations: ['the brakes', 'brake pads', 'brake condition'],
      example: { en: 'The brakes are in good condition after the pad replacement.', zh: '换过来令片后刹车状况良好。' },
      listening: { zh: '单音节，开头 /br/ 辅音连缀；与 break 同音。', en: 'One syllable with /br/; it sounds like break.' },
    },
    {
      term: 'gears', phonetic: '/ɡɪəz/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '齿轮，变速挡', en: 'the wheel and sprocket parts that set the bike’s speed' },
      usage: { zh: '常用复数 gears；shift gears、rear gear。', en: 'Usually plural gears: shift gears, rear gear.' },
      collocations: ['the gears', 'shift gears', 'rear gear'],
      example: { en: 'The gears shift smoothly after the cable adjustment.', zh: '调过线之后换挡很顺滑。' },
      listening: { zh: '单音节 /ɪə/；与 gear 在句中弱读时听似 /ɡə/。', en: 'One syllable /ɪə/; in weak position it sounds like /ɡə/.' },
    },
    {
      term: 'cassette', phonetic: '/kəˈset/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '飞轮（后轮上的齿轮组）', en: 'the cluster of sprockets on the rear wheel' },
      usage: { zh: '自行车术语；rear cassette、cassette wear。', en: 'Bike term: rear cassette, cassette wear.' },
      collocations: ['the rear cassette', 'cassette life', 'replace the cassette'],
      example: { en: 'The rear cassette still has plenty of life in it.', zh: '后飞轮还很耐用。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈset/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'accessory', phonetic: '/əkˈsesəri/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '配件，附属用品', en: 'an extra item used with the main object' },
      usage: { zh: '可数，复数 accessories；bike accessory、included accessory。', en: 'Countable, plural accessories: bike accessory, included accessory.' },
      collocations: ['the included accessory', 'bike accessories', 'fixed accessory'],
      example: { en: 'The included accessory is a set of handlebar lights.', zh: '包含的配件是一组车把灯。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈses/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'saddle', phonetic: '/ˈsædl/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '车座', en: 'the padded seat of a bicycle' },
      usage: { zh: '可数；bike saddle、original saddle。', en: 'Countable: bike saddle, original saddle.' },
      collocations: ['the saddle', 'a bike saddle', 'the original saddle'],
      example: { en: 'The saddle is original, but the grips are new.', zh: '车座是原配的，握把是新换的。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsæ/；结尾 /dl/。', en: 'Two syllables with stress on the first; the ending is /dl/.' },
    },
  ],
  expressions: [
    {
      phrase: 'come to look at', sentenceIndex: 0,
      meaning: { zh: '上门来看（待售物品）', en: 'to visit a seller to inspect something for sale' },
      usage: { zh: '不定式结构；come to look at the bike。', en: 'Infinitive: come to look at the bike.' },
      example: { en: 'I’ve come to look at the bike you advertised.', zh: '我上门来看你广告里的自行车。' },
    },
    {
      phrase: 'open to a reasonable offer', sentenceIndex: 11,
      meaning: { zh: '愿意议价', en: 'willing to consider a lower price from a buyer' },
      usage: { zh: '销售用语；be open to a reasonable offer。', en: 'Sales phrase: be open to a reasonable offer.' },
      example: { en: 'I’m open to a reasonable offer on the price.', zh: '价格方面可以接受合理还价。' },
    },
    {
      phrase: 'under load', sentenceIndex: 16,
      meaning: { zh: '承重时，发力时', en: 'while carrying weight or working hard' },
      usage: { zh: '方式状语；gears feel smooth under load。', en: 'Adverbial: gears feel smooth under load.' },
      example: { en: 'How do the gears feel under load on a hill?', zh: '上坡发力时换挡感觉如何？' },
    },
    {
      phrase: 'leaves a clear record', sentenceIndex: 23,
      meaning: { zh: '留下凭证记录', en: 'to keep a trace that the transaction happened' },
      usage: { zh: '后接 for both of us；a transfer leaves a record。', en: 'Follow with for both of us: a transfer leaves a record.' },
      example: { en: 'A transfer leaves a clear record for both of us.', zh: '转账对双方都留有清楚记录。' },
    },
    {
      phrase: 'plenty of life', sentenceIndex: 19,
      meaning: { zh: '还很耐用，剩余寿命充足', en: 'still serviceable with much wear left' },
      usage: { zh: '口语评价零件；plenty of life in the cassette。', en: 'Colloquial part appraisal: plenty of life in the cassette.' },
      example: { en: 'The rear cassette still has plenty of life in it.', zh: '后飞轮还很耐用。' },
    },
    {
      phrase: 'asking for it', sentenceIndex: 10,
      meaning: { zh: '（卖家）要价', en: 'to ask a particular price for something' },
      usage: { zh: 'What are you asking for it? 是买家问价句式。', en: 'What are you asking for it? is the buyer’s price question.' },
      example: { en: 'What are you asking for the bike?', zh: '这辆车你要价多少？' },
    },
  ],
  tips: [
    {
      title: { zh: '数字题区分报价与里程', en: 'Separate price from distance' },
      body: {
        zh: '第 4 题要报价，第 8 题要送货距离，两句隔着整段对话。听前在题号旁标出“金额”“距离”“时长”，听到对应话题再落笔，避免把十公里填进价格空。',
        en: 'Item 4 asks the price and item 8 the delivery distance, with most of the conversation between them. Label the gaps amount, distance and duration before the recording, and write a number only when its topic is named.',
      },
    },
    {
      title: { zh: '二手交易留意“原配与新换”', en: 'Watch original versus replaced parts' },
      body: {
        zh: '卖家会区分原配零件和刚换的零件：pads last spring、cables adjusted last month、grips new。选择题常把“换过某个小件”说成“整套齿轮更换”，听到具体零件名再判断选项。',
        en: 'The seller separates original parts from recently replaced ones: pads last spring, cables adjusted last month, grips new. Multiple choice often turns "one small part replaced" into "the whole gears were replaced"; match the specific part before choosing.',
      },
    },
    {
      title: { zh: '付款方式听介词', en: 'For payment, listen for the preposition' },
      body: {
        zh: '第 7 题问偏好的付款方式，答案在 pay by bank transfer 的 by 之后；cash 与 card 是被对比或未提及的干扰项。付款类题目留意 by、in cash、online 这些方式词。',
        en: 'Item 7 asks the preferred payment method, and the answer follows pay by bank transfer; cash and card are contrasted or unmentioned distractors. Watch method words such as by, in cash and online in payment questions.',
      },
    },
  ],
};
