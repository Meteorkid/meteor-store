import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 4 · Part 1 — 社团干事向租车行咨询租小巴。原创仿真材料，非官方真题。
 *
 * 对话围绕人数、司机安排、取车时间、保险、押金与里程限制展开，
 * 中间穿插两次自我修正（人数十二改十六、取车时间九点半改八点半）。
 */
export const test04Part1: ListeningLesson = {
  slug: 'test-04-part-1',
  part: 1,
  status: 'published',
  title: { zh: '为社团出游租小巴', en: 'Hiring a minibus for a club trip' },
  summary: {
    zh: '城市徒步社团的干事向租车行咨询周六出游的小巴：出行人数、是否配司机、取车时间、保险档位、押金与里程限制，以及取车时需要出示的证件。',
    en: 'A secretary from a city walking club calls a minibus hire office about a Saturday trip: the number of passengers, whether a driver is included, the collection time, insurance level, deposit, mileage limit and the document needed on the day.',
  },
  accent: { zh: '两位说话人均为澳式口音。', en: 'Both speakers use Australian accents.' },
  speechRate: '+3%',
  cast: [
    { id: 'clerk', label: 'CLERK', gender: 'female', voice: 'en-AU-NatashaNeural' },
    { id: 'caller', label: 'CALLER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Club', cells: [[{ text: 'city walking club' }]] },
        { lead: 'Number of passengers', cells: [[{ blank: 1 }]] },
        { lead: 'Driver', cells: [[{ text: 'A driver is ' }, { blank: 2 }, { text: ' (self-drive).' }]] },
        { lead: 'Collection time on Saturday', cells: [[{ blank: 3 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'Why does the caller ask for the larger bus?',
          options: [
            { key: 'A', text: 'The group carries a lot of camping equipment.' },
            { key: 'B', text: 'Several members need extra leg room.' },
            { key: 'C', text: 'The club has invited guests along.' },
          ],
        },
        {
          number: 5,
          stem: 'What does the clerk say about the basic cover?',
          options: [
            { key: 'A', text: 'It is already included in the hire price.' },
            { key: 'B', text: 'It covers damage to windscreens and tyres.' },
            { key: 'C', text: 'It costs thirty pounds less than the premium option.' },
          ],
        },
        {
          number: 6,
          stem: 'By what time must the minibus be returned?',
          options: [
            { key: 'A', text: 'Saturday evening' },
            { key: 'B', text: 'Sunday evening' },
            { key: 'C', text: 'Monday morning' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Deposit', cells: [[{ blank: 7 }, { text: ' pounds' }]] },
        { lead: 'Mileage included', cells: [[{ blank: 8 }, { text: ' kilometres per day' }]] },
        { lead: 'Excess mileage charge', cells: [[{ blank: 9 }, { text: ' per kilometre' }]] },
        { lead: 'Document to show on collection', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['sixteen', '16'], evidence: 3,
      explanation: {
        zh: '定位句 3：I first thought twelve, but in the end sixteen of us signed up。十二是先被否定的旧数字，最终人数以 but 之后的 sixteen 为准。',
        en: 'Sentence 3: "I first thought twelve, but in the end sixteen of us signed up". Twelve is the earlier figure that is rejected; the final number after but is sixteen.',
      },
    },
    {
      number: 2, accepted: ['optional'], evidence: 6,
      explanation: {
        zh: '定位句 6：It’s self-drive, so a driver is optional。车可以自己开，司机只是可选项；空后已印 self-drive，只填 optional。',
        en: 'Sentence 6: "It’s self-drive, so a driver is optional". The bus can be driven by the group, and a driver is only an extra choice; self-drive is already printed in the notes.',
      },
    },
    {
      number: 3, accepted: ['eight thirty', '8.30'], spoken: 'eight thirty', evidence: 10,
      explanation: {
        zh: '定位句 10：the previous booking finishes at eight, so eight thirty works better。来电者先提 nine thirty，被接待员用前一句的日程否定，答案以修正后的 eight thirty 为准。',
        en: 'Sentence 10: "the previous booking finishes at eight, so eight thirty works better". The caller suggests nine thirty first, but the clerk rejects it because of the earlier booking; the corrected time is eight thirty.',
      },
    },
    {
      number: 4, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：We’re carrying camping stoves, tents and cool boxes for the overnight stop。多出来的空间是为露营装备准备的；腿空间和受邀客人在全段都没有提到。',
        en: 'Sentence 24: "We’re carrying camping stoves, tents and cool boxes for the overnight stop". The extra space is for camping gear. Leg room and invited guests are never mentioned.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：Basic cover is included in the hire price。B 错在挡风玻璃和轮胎属于高档保险；C 把三十英镑说成差价，原文只说高档要另加三十英镑。',
        en: 'Sentence 17: "Basic cover is included in the hire price". B is wrong because windscreens and tyres belong to the premium option, and C misreads the thirty pounds as a difference between the two prices.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：Return it by Sunday evening, please。晚于这个时间会按第二天计费；周六晚和周一早都与原文不符。',
        en: 'Sentence 27: "Return it by Sunday evening, please". A later return counts as a second day. Saturday evening and Monday morning do not match the recording.',
      },
    },
    {
      number: 7, accepted: ['eighty', '80'], spoken: 'eighty pounds', evidence: 31,
      explanation: {
        zh: '定位句 31：It’s eighty pounds, payable when you collect the keys。句中提到的 a hundred 是别家公司的标准，用作干扰数字，不要填进去。',
        en: 'Sentence 31: "It’s eighty pounds, payable when you collect the keys". A hundred refers to what other companies charge, and is a distractor here.',
      },
    },
    {
      number: 8, accepted: ['two hundred', '200'], spoken: 'two hundred', evidence: 34,
      explanation: {
        zh: '定位句 34：The hire includes two hundred kilometres per day。注意是每天两百公里，不是整个行程的总里程；空格后已印 kilometres per day。',
        en: 'Sentence 34: "The hire includes two hundred kilometres per day". It is two hundred kilometres each day, not the total for the whole trip; kilometres per day is already printed.',
      },
    },
    {
      number: 9, accepted: ['forty pence'], evidence: 36,
      explanation: {
        zh: '定位句 36：any distance beyond the limit costs forty pence per kilometre。超出限额之后才按这个单价收费；答案是货币加单位，两个词。',
        en: 'Sentence 36: "any distance beyond the limit costs forty pence per kilometre". The charge applies only after the limit; the answer is the two-word amount with its unit.',
      },
    },
    {
      number: 10, accepted: ['driving licence'], evidence: 40,
      explanation: {
        zh: '定位句 40：We’ll need the driving licence of whoever is driving。押金用银行卡支付，银行卡不是要登记的证件；注意英式拼写 licence。',
        en: 'Sentence 40: "We’ll need the driving licence of whoever is driving". The card is only for the deposit, not the document to record. Note the British spelling licence.',
      },
    },
  ],
  transcript: [
    { speaker: 'caller', text: 'Hello, I’m phoning about hiring a minibus for a club day trip next Saturday.' },
    { speaker: 'caller', text: 'I’m after something that can take our whole group away for the day.' },
    { speaker: 'clerk', text: 'Good morning. Which club are you with, and how many members are coming?' },
    { speaker: 'caller', text: 'We’re the city walking club. I first thought twelve, but in the end sixteen of us signed up.' },
    { speaker: 'clerk', text: 'Sixteen passengers. The twelve-seater would be too tight, so you’ll need the eighteen-seater model.' },
    { speaker: 'caller', text: 'Eighteen seats sounds fine. Do we have to take a driver with the bus, or can we drive it ourselves?' },
    { speaker: 'clerk', text: 'It’s self-drive, so a driver is optional. Most groups choose to drive themselves.' },
    { speaker: 'caller', text: 'We’d rather drive ourselves, thanks. One of our members has a clean licence and plenty of bus experience.' },
    { speaker: 'clerk', text: 'Good. What time would you like to collect the vehicle on Saturday morning?' },
    { speaker: 'caller', text: 'Is nine thirty possible? We meet at the club hall at nine.' },
    { speaker: 'clerk', text: 'Let me check the diary. The previous booking finishes at eight, so eight thirty works better.' },
    { speaker: 'caller', text: 'Eight thirty, then. That gives us enough time to load the bags before everyone arrives.' },
    { speaker: 'caller', text: 'Will the bus have seat belts for everyone?' },
    { speaker: 'clerk', text: 'Yes, every seat has a belt, and there are two small child seats available if anyone needs one.' },
    { speaker: 'caller', text: 'That’s reassuring. We have a couple of younger members coming along.' },
    { speaker: 'clerk', text: 'Now, would you like the basic cover or the premium insurance?' },
    { speaker: 'caller', text: 'What does the basic cover include?' },
    { speaker: 'clerk', text: 'Basic cover is included in the hire price. It covers damage to the bodywork, but not the windows or the tyres.' },
    { speaker: 'caller', text: 'And the premium option?' },
    { speaker: 'clerk', text: 'That adds another thirty pounds, and it covers windscreens and tyres as well.' },
    { speaker: 'caller', text: 'We’ll stick with the basic cover, if that’s alright. We’re a careful group.' },
    { speaker: 'clerk', text: 'Fine. I notice you asked for the larger bus rather than the standard one.' },
    { speaker: 'caller', text: 'Yes, we do have quite a lot of equipment to carry.' },
    { speaker: 'clerk', text: 'Is there a particular reason you need so much space?' },
    { speaker: 'caller', text: 'We’re carrying camping stoves, tents and cool boxes for the overnight stop, so the bigger boot helps.' },
    { speaker: 'clerk', text: 'I see. The eighteen-seater has a long rear bench, so there should be plenty of room.' },
    { speaker: 'caller', text: 'When does it have to come back? We’re staying one night, in case you need to know.' },
    { speaker: 'clerk', text: 'Return it by Sunday evening, please. Any later return counts as a second day.' },
    { speaker: 'caller', text: 'Sunday evening, understood. We won’t be late back.' },
    { speaker: 'clerk', text: 'Before I finish, let me confirm the deposit and the mileage.' },
    { speaker: 'caller', text: 'Yes, please. How much is the deposit?' },
    { speaker: 'clerk', text: 'It’s eighty pounds, payable when you collect the keys. Some companies ask for a hundred, but ours is eighty.' },
    { speaker: 'caller', text: 'Eighty pounds, and that comes back to us if there’s no damage?' },
    { speaker: 'clerk', text: 'Exactly. We inspect the vehicle together when you return it.' },
    { speaker: 'clerk', text: 'The hire includes two hundred kilometres per day.' },
    { speaker: 'caller', text: 'Two hundred a day. Are there extra charges after that?' },
    { speaker: 'clerk', text: 'Yes, any distance beyond the limit costs forty pence per kilometre.' },
    { speaker: 'caller', text: 'Forty pence per kilometre. We’ll keep an eye on the route, then.' },
    { speaker: 'clerk', text: 'Before you leave, there is one document we need to see.' },
    { speaker: 'caller', text: 'What do you need from us on the morning?' },
    { speaker: 'clerk', text: 'We’ll need the driving licence of whoever is driving, plus a card for the deposit.' },
    { speaker: 'caller', text: 'The driver will bring his licence, no problem.' },
    { speaker: 'clerk', text: 'And one last thing, please check the fuel level on arrival and on return.' },
    { speaker: 'caller', text: 'Will do. Do we have to fill the tank up before we bring it back?' },
    { speaker: 'clerk', text: 'Yes, return it with the same amount of fuel you collected with, or we charge for the difference.' },
    { speaker: 'caller', text: 'Fine. Could you send the booking confirmation to the club email?' },
    { speaker: 'clerk', text: 'Of course. I’ll also attach a map of the depot and the insurance summary.' },
    { speaker: 'caller', text: 'That’s great. Thanks for your help.' },
    { speaker: 'clerk', text: 'You’re welcome. Enjoy the trip, and drive safely.' },
  ],
  vocabulary: [
    {
      term: 'optional', phonetic: '/ˈɒpʃənl/', partOfSpeech: 'adj.', sentenceIndex: 6,
      meaning: { zh: '可选的，非强制的', en: 'available as a choice, but not required' },
      usage: { zh: '常作表语或定语：a driver is optional、an optional extra。', en: 'Used predicatively or attributively: a driver is optional, an optional extra.' },
      collocations: ['an optional extra', 'optional insurance', 'completely optional'],
      example: { en: 'The roof rack is optional, so you do not have to book it.', zh: '车顶架是可选项，不必预订。' },
      listening: { zh: '三个音节，重音在第一音节；结尾 -al 轻读成 /l/。', en: 'Three syllables with stress on the first; the final -al is a light /l/.' },
    },
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '押金，订金', en: 'money paid in advance and returned if nothing is damaged' },
      usage: { zh: '租车、租房场景高频词：pay a deposit、a refundable deposit。', en: 'Frequent in hire and accommodation scenes: pay a deposit, a refundable deposit.' },
      collocations: ['pay a deposit', 'a refundable deposit', 'a deposit of'],
      example: { en: 'You leave a deposit when you collect the keys.', zh: '取钥匙时要留一笔押金。' },
      listening: { zh: '重音在第二音节 /ˈpɒz/，与 dispose（处理）同根。', en: 'Stress the second syllable; it is related to dispose.' },
    },
    {
      term: 'mileage', phonetic: '/ˈmaɪlɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '里程，行车公里数', en: 'the distance a vehicle has travelled, measured in miles or kilometres' },
      usage: { zh: '不可数；mileage included、excess mileage。英式语境下也可指公里数。', en: 'Uncountable: mileage included, excess mileage.' },
      collocations: ['excess mileage', 'mileage limit', 'the mileage included'],
      example: { en: 'The hire agreement sets a daily mileage limit.', zh: '租车协议规定了每日里程上限。' },
      listening: { zh: '第一音节与 mile 同音，结尾 -age 弱读 /ɪdʒ/。', en: 'The first syllable sounds like mile; the ending -age is a weak /ɪdʒ/.' },
    },
    {
      term: 'kilometre', phonetic: '/kɪˈlɒmɪtə/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '千米，公里', en: 'a unit of distance equal to one thousand metres' },
      usage: { zh: '英式拼写 kilometre，美式 kilometer；per kilometre 表示每公里。', en: 'British spelling kilometre, American kilometer; per kilometre means for each kilometre.' },
      collocations: ['per kilometre', 'two hundred kilometres', 'excess kilometres'],
      example: { en: 'The service charge is calculated per kilometre travelled.', zh: '服务费按行驶里程每公里计算。' },
      listening: { zh: '重音在第二音节 /ˈlɒ/；澳式读音常把首音节读得更轻。', en: 'Stress the second syllable; Australian speakers often reduce the first syllable.' },
    },
    {
      term: 'licence', phonetic: '/ˈlaɪsns/', partOfSpeech: 'n.', sentenceIndex: 40,
      meaning: { zh: '执照，许可证（driving licence 驾照）', en: 'an official document that allows you to do something' },
      usage: { zh: '英式名词为 licence，动词为 license；美式都写作 license。', en: 'British: noun licence, verb license; American uses license for both.' },
      collocations: ['a driving licence', 'a clean licence', 'show your licence'],
      example: { en: 'The hire office checks the driving licence of the driver.', zh: '租车行会查验驾驶员的驾照。' },
      listening: { zh: '两个音节，结尾 /ns/，不要读成 lie-sen-see。', en: 'Two syllables ending in /ns/, not three.' },
    },
    {
      term: 'boot', phonetic: '/buːt/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '汽车后备箱；长靴', en: 'the storage space at the back of a car; also a shoe covering the foot and leg' },
      usage: { zh: '英式英语指后备箱，美式说 trunk；同一词也指靴子，靠语境区分。', en: 'British for car storage; Americans say trunk. The same word also means a shoe.' },
      collocations: ['the car boot', 'load the boot', 'a big boot'],
      example: { en: 'We packed the cool boxes into the boot before leaving.', zh: '出发前我们把冷藏箱塞进后备箱。' },
      listening: { zh: '与 boat 对比：boot 是长元音 /uː/，boat 是双元音 /əʊ/。', en: 'Compare boot with boat: /uː/ versus /əʊ/.' },
    },
    {
      term: 'premium', phonetic: '/ˈpremiəm/', partOfSpeech: 'adj.', sentenceIndex: 15,
      meaning: { zh: '高档的，优质高价的', en: 'higher in price and quality than the basic option' },
      usage: { zh: '保险与产品场景常用：premium cover、premium version。名词 premium 指保费。', en: 'Common in insurance: premium cover, premium version. As a noun it means the insurance fee.' },
      collocations: ['premium insurance', 'the premium option', 'premium cover'],
      example: { en: 'The premium cover also protects the windscreens.', zh: '高档保险还承保挡风玻璃。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈprem/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'inspect', phonetic: '/ɪnˈspekt/', partOfSpeech: 'v.', sentenceIndex: 33,
      meaning: { zh: '查验，仔细检查', en: 'to look at something carefully to check its condition' },
      usage: { zh: '及物动词；inspect the vehicle、inspect the keys。名词是 inspection。', en: 'Transitive: inspect the vehicle. The noun is inspection.' },
      collocations: ['inspect the vehicle', 'inspect the keys', 'inspect the damage'],
      example: { en: 'We inspect the vehicle together when you return it.', zh: '还车时我们一起查验车辆。' },
      listening: { zh: '重音在第二音节 /ˈspekt/，词尾 /kt/ 要读清楚。', en: 'Stress the second syllable; pronounce the final /kt/.' },
    },
  ],
  expressions: [
    {
      phrase: 'signed up', sentenceIndex: 3,
      meaning: { zh: '报名，登记参加', en: 'registered to take part in something' },
      usage: { zh: 'sign up for something；过去式和过去分词是 signed up。', en: 'Sign up for something; the past form is signed up.' },
      example: { en: 'Sixteen members signed up for the Saturday walk.', zh: '十六名会员报名参加周六徒步。' },
    },
    {
      phrase: 'stick with', sentenceIndex: 20,
      meaning: { zh: '坚持选择，沿用（某方案）', en: 'to continue choosing or using something rather than changing' },
      usage: { zh: '口语中表示不改主意：stick with the basic cover。', en: 'In speech it means keeping your choice: stick with the basic cover.' },
      example: { en: 'I’ll stick with the morning train, even though it is slower.', zh: '虽然慢一点，我还是选早班火车。' },
    },
    {
      phrase: 'keep an eye on', sentenceIndex: 37,
      meaning: { zh: '留意，照看', en: 'to watch something carefully so that no problem appears' },
      usage: { zh: '后接名词；同义表达是 watch carefully。', en: 'Follow with a noun; a paraphrase is watch carefully.' },
      example: { en: 'Keep an eye on the fuel gauge during the trip.', zh: '途中留意油表。' },
    },
    {
      phrase: 'in case', sentenceIndex: 26,
      meaning: { zh: '以防，万一', en: 'because something might happen, as a precaution' },
      usage: { zh: 'in case 后接从句；不要和 if 混淆，它强调提前准备。', en: 'Follow with a clause; it means as a precaution, not if.' },
      example: { en: 'I’ll bring a spare phone in case the battery dies.', zh: '我多带一部手机以防没电。' },
    },
    {
      phrase: 'comes back', sentenceIndex: 32,
      meaning: { zh: '退回，返还', en: 'to be returned to the person who paid' },
      usage: { zh: '押金、文件等退还给某人：the deposit comes back to you。', en: 'Used for money or documents being returned: the deposit comes back to you.' },
      example: { en: 'The damage waiver comes back to you when the car is returned clean.', zh: '车辆干净归还后，免赔押金会退给你。' },
    },
    {
      phrase: 'fill the tank up', sentenceIndex: 43,
      meaning: { zh: '把油箱加满', en: 'to put enough fuel in so the tank is full' },
      usage: { zh: 'fill up 是可分短语动词；fill the tank up 或 fill up the tank 均可。', en: 'Fill up is separable: fill the tank up or fill up the tank.' },
      example: { en: 'Please fill the tank up before you return the van.', zh: '还车前请把油箱加满。' },
    },
  ],
  tips: [
    {
      title: { zh: '先抓旧说法，再等修正', en: 'Note the first version, then the correction' },
      body: {
        zh: 'Part 1 常有自我修正：句 3 的 twelve 被 sixteen 替换，句 9 的 nine thirty 被句 10 的 eight thirty 替换。听到 but、sorry、actually 时，准备划掉刚记下的旧数字。',
        en: 'Part 1 often self-corrects: twelve becomes sixteen in sentence 3, and nine thirty becomes eight thirty in sentence 10. When you hear but, sorry or actually, cross out the earlier figure.',
      },
    },
    {
      title: { zh: '区分限额内与超限额的费用', en: 'Separate the limit from the excess charge' },
      body: {
        zh: '第 8 题问每天含多少里程，第 9 题问超出后每公里单价，两句紧挨着但语义不同。先在题号旁标出“总量”还是“单价”，避免把两百公里写进单价空。',
        en: 'Item 8 asks for the daily mileage included, and item 9 for the per-kilometre excess charge. The sentences are close but the meanings differ. Mark total versus rate beside the question before the recording starts.',
      },
    },
    {
      title: { zh: '时间题留意口语读法', en: 'Times: listen for the spoken form' },
      body: {
        zh: '八点半录音读 eight thirty，卷面可写 8.30；拼写题之外的时间、金额，accepted 都同时接受英文数词与阿拉伯数字。答题卡上不要把 thirty 拼成 tree。',
        en: 'Eight thirty may be written as 8.30 on the answer sheet. Apart from spelling items, times and prices accept both words and digits. Do not write tree when you mean thirty.',
      },
    },
  ],
};
