import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 38 · Part 1 — 安排寄养宠物狗（双人对话，英式口音）。原创仿真材料，非官方真题。
 *
 * 主人先开口咨询。表单填空 1–4 按对话顺序出现，单选 5–7 落在每日反馈、接送方式与自备物品，
 * 表格 8–10 是见面会、入住与接回的安排。题块顺序与录音一致。
 */
export const test38Part1: ListeningLesson = {
  slug: 'test-38-part-1',
  part: 1,
  status: 'published',
  title: { zh: '安排寄养宠物狗', en: 'Arranging dog boarding' },
  summary: {
    zh: '一名主人致电狗舍咨询爱犬寄养：狗名 Milo、寄养两晚、需近期狂犬病疫苗、每日三次散步；随后弄清每日通过应用发送照片与短视频、由狗舍厢车从镇中心接狗、需自带日常狗粮，并安排周六见面会、周日入住与周五接回。',
    en: 'An owner phones the kennels about boarding his dog: Milo, two nights, a current rabies injection, three walks a day. The stay includes a daily photo and short video message, a kennel van pickup from the town centre, and his usual food from home. A Saturday meet and greet, Sunday drop-off and Friday collection are arranged.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'owner', label: 'OWNER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Dog’s name', cells: [[{ blank: 1 }]] },
        { lead: 'Number of nights', cells: [[{ blank: 2 }]] },
        { lead: 'Vaccination to check: current', cells: [[{ blank: 3 }, { text: ' injection' }]] },
        { lead: 'Walks each day', cells: [[{ blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What feedback does the owner receive during the stay?',
          options: [
            { key: 'A', text: 'a daily photo and short video message' },
            { key: 'B', text: 'a phone call each evening from the handler' },
            { key: 'C', text: 'a written report after the dog leaves' },
          ],
        },
        {
          number: 6,
          stem: 'How will Milo travel to the kennels?',
          options: [
            { key: 'A', text: 'the owner drives him to the kennels' },
            { key: 'B', text: 'the kennel van collects from the town centre' },
            { key: 'C', text: 'a relative brings him after the meeting' },
          ],
        },
        {
          number: 7,
          stem: 'What must the owner bring from home?',
          options: [
            { key: 'A', text: 'his usual food in a bag' },
            { key: 'B', text: 'his own bedding and blanket' },
            { key: 'C', text: 'a supply of treats for the stay' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Arrangement', 'Day', 'Time'],
      rows: [
        { lead: 'Meet and greet', cells: [[{ blank: 8 }], [{ text: 'eleven thirty' }]] },
        { lead: 'Boarding drop-off', cells: [[{ text: 'Sunday' }], [{ blank: 9 }]] },
        { lead: 'Collection', cells: [[{ text: 'Friday' }], [{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Milo'], evidence: 2,
      explanation: {
        zh: '定位句 2：His name is Milo, and he’s a three-year-old spaniel。狗名填 Milo；句 2 的 spaniel 是犬种，不是名字。',
        en: 'Sentence 2: "His name is Milo, and he’s a three-year-old spaniel". The dog’s name is Milo. Spaniel in sentence 2 is the breed, not the name.',
      },
    },
    {
      number: 2, accepted: ['two'], evidence: 4,
      explanation: {
        zh: '定位句 4：Two nights, from Friday evening until Sunday afternoon。寄养两晚，填 two；句 3 的 how many nights 只是提问，不是答案。',
        en: 'Sentence 4: "Two nights, from Friday evening until Sunday afternoon". The stay is two nights, so write two. How many nights in sentence 3 is the question, not the answer.',
      },
    },
    {
      number: 3, accepted: ['rabies'], evidence: 7,
      explanation: {
        zh: '定位句 7：We ask for a current rabies injection, and the annual kennel cough vaccine。要核查的近期疫苗是狂犬病 rabies；kennel cough 是另一项年度疫苗，不是空格所指。',
        en: 'Sentence 7: "We ask for a current rabies injection, and the annual kennel cough vaccine". The checked vaccination is rabies. Kennel cough is a separate annual vaccine, not the gap item.',
      },
    },
    {
      number: 4, accepted: ['three'], evidence: 11,
      explanation: {
        zh: '定位句 11：each dog gets three walks a day on the country paths。每日散步三次，填 three；句 10 的 two decent walks 是主人的期望，不是犬舍安排。',
        en: 'Sentence 11: "each dog gets three walks a day on the country paths". There are three walks a day, so write three. Two decent walks in sentence 10 is the owner’s expectation, not the kennel arrangement.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 15,
      explanation: {
        zh: '定位句 15：Every boarder gets a daily photo and a short video message on our app。每日照片加短视频对应 A；B 的每晚电话与 C 的离店后书面报告在讲解中未出现。',
        en: 'Sentence 15: "Every boarder gets a daily photo and a short video message on our app". A daily photo and video match A. An evening phone call in B and a post-stay report in C are not mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：Our kennel van collects dogs from the town centre once each morning。厢车从镇中心接狗对应 B；A 的自驾被句 20 排除（主人那周没车），C 的亲属接送未提及。',
        en: 'Sentence 19: "Our kennel van collects dogs from the town centre once each morning". The van pickup matches B. Driving in A is ruled out in sentence 20, and a relative in C is not mentioned.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：Most owners bring a bag of his usual food, so his diet does not change。需自带日常狗粮对应 A；B 的床被句 25 说明犬舍已提供，C 的零食被句 27 列为可选而非必备。',
        en: 'Sentence 23: "Most owners bring a bag of his usual food, so his diet does not change". The usual food matches A. Bedding in B is supplied in sentence 25, and treats in C are optional rather than required.',
      },
    },
    {
      number: 8, accepted: ['Saturday'], evidence: 31,
      explanation: {
        zh: '定位句 31：The meet and greet is on Saturday morning, starting at eleven thirty。首列 Meet and greet、时间 eleven thirty 已给出，缺的是星期 Saturday。',
        en: 'Sentence 31: "The meet and greet is on Saturday morning, starting at eleven thirty". Meet and greet and eleven thirty are printed, so the missing day is Saturday.',
      },
    },
    {
      number: 9, accepted: ['nine o’clock'], evidence: 33,
      explanation: {
        zh: '定位句 33：Milo would arrive on Sunday at nine o’clock。首列入住、星期 Sunday 已给出，缺的是时间 nine o’clock；句 35 的 half-hour 是安顿时长，不是时间点。',
        en: 'Sentence 33: "Milo would arrive on Sunday at nine o’clock". Boarding drop-off and Sunday are printed, so the missing time is nine o’clock. The half-hour in sentence 35 is a settling period, not a time.',
      },
    },
    {
      number: 10, accepted: ['four thirty'], evidence: 33,
      explanation: {
        zh: '定位句 33：you collect him the following Friday at four thirty in the afternoon。首列 Collection、星期 Friday 已给出，缺的是时间 four thirty。',
        en: 'Sentence 33: "you collect him the following Friday at four thirty in the afternoon". Collection and Friday are printed, so the missing time is four thirty.',
      },
    },
  ],
  transcript: [
    { speaker: 'owner', text: 'Hi, I’m calling about boarding for my dog next month.' },
    { speaker: 'adviser', text: 'Hello, thanks for ringing. I’m Clara at the kennels, and I’ll note your details down first.' },
    { speaker: 'owner', text: 'Great. His name is Milo, and he’s a three-year-old spaniel.' },
    { speaker: 'adviser', text: 'Milo, thank you. How many nights will you need us to look after him?' },
    { speaker: 'owner', text: 'Two nights, from Friday evening until Sunday afternoon, if that’s free.' },
    { speaker: 'adviser', text: 'Two nights. Now, before he comes, have his vaccinations been kept up to date?' },
    { speaker: 'owner', text: 'Yes, he had his last booster in the spring. Is there a particular injection you check?' },
    { speaker: 'adviser', text: 'We ask for a current rabies injection, and the annual kennel cough vaccine, before the first stay.' },
    { speaker: 'owner', text: 'Rabies and kennel cough. I’ll bring the record card with me.' },
    { speaker: 'adviser', text: 'Fine. How many walks would you expect Milo to have each day?' },
    { speaker: 'owner', text: 'He likes two decent walks, not just a short garden run. Is that possible here?' },
    { speaker: 'adviser', text: 'Yes, each dog gets three walks a day on the country paths, with a rest period between them.' },
    { speaker: 'owner', text: 'That sounds like the right pace for him.' },
    { speaker: 'adviser', text: 'Now, do you want to see how he settles in before the stay?' },
    { speaker: 'owner', text: 'Yes, I’d like that. Can I send updates while he’s with you?' },
    { speaker: 'adviser', text: 'Every boarder gets a daily photo and a short video message on our app, so you can watch the walks and the rest time.' },
    { speaker: 'owner', text: 'A photo and video each day. That will settle my worries.' },
    { speaker: 'adviser', text: 'We also send a note after the stay about his appetite and sleep.' },
    { speaker: 'owner', text: 'How does the dog get to the kennels? Can I drop him off myself?' },
    { speaker: 'adviser', text: 'You can bring him by car, or we arrange a pickup. Our kennel van collects dogs from the town centre once each morning.' },
    { speaker: 'owner', text: 'The van pickup would be easier, as I don’t have a car that week.' },
    { speaker: 'adviser', text: 'Then we’ll put Milo on the morning pickup run.' },
    { speaker: 'owner', text: 'What should I send with him, apart from his record card?' },
    { speaker: 'adviser', text: 'Most owners bring a bag of his usual food, so his diet does not change, and any medicine he takes at set times.' },
    { speaker: 'owner', text: 'Should I bring his bed or his blanket from home?' },
    { speaker: 'adviser', text: 'Bedding is provided here, but a familiar blanket helps nervous dogs settle, so you are welcome to send one.' },
    { speaker: 'owner', text: 'Treats, then, or is that not needed?' },
    { speaker: 'adviser', text: 'Treats are optional. We prefer the usual food over extra snacks during the stay.' },
    { speaker: 'owner', text: 'Let’s talk about the visits before the booking.' },
    { speaker: 'adviser', text: 'We run a short meet and greet before every first stay, so the dog can meet the staff and see the runs.' },
    { speaker: 'owner', text: 'When can we do that?' },
    { speaker: 'adviser', text: 'The meet and greet is on Saturday morning, starting at eleven thirty, and it takes about twenty minutes.' },
    { speaker: 'owner', text: 'Saturday, eleven thirty. And the boarding itself?' },
    { speaker: 'adviser', text: 'Milo would arrive on Sunday at nine o’clock, and you collect him the following Friday at four thirty in the afternoon.' },
    { speaker: 'owner', text: 'Sunday nine, Friday four thirty. That lines up with my trip.' },
    { speaker: 'adviser', text: 'There is a half-hour settling-in period on arrival, so please don’t expect a walk straight away.' },
    { speaker: 'owner', text: 'Does he share a run with other dogs?' },
    { speaker: 'adviser', text: 'Each boarder has a private run, and dogs meet only on the walks, by temperament.' },
    { speaker: 'owner', text: 'Is there anywhere he can run off the lead?' },
    { speaker: 'adviser', text: 'The exercise field is fenced, and handlers let suitable dogs off the lead there once a day.' },
    { speaker: 'owner', text: 'What about nights? Does he sleep inside?' },
    { speaker: 'adviser', text: 'Kennel blocks are heated, and each dog sleeps in its own compartment with a raised bed.' },
    { speaker: 'owner', text: 'I should mention he’s a little nervous around loud gates.' },
    { speaker: 'adviser', text: 'We note that on his profile, and the handler will introduce him gradually to the gate area.' },
    { speaker: 'owner', text: 'Is the booking refundable if I change dates?' },
    { speaker: 'adviser', text: 'You can move the stay up to a week ahead without charge, and a shorter notice change keeps a credit on the account.' },
    { speaker: 'owner', text: 'I think that covers what I need to know.' },
    { speaker: 'adviser', text: 'I’ll reserve Milo for the two nights, and email the pickup details this evening.' },
    { speaker: 'owner', text: 'Thanks, Clara. I’ll bring the vaccination card to the meet and greet.' },
    { speaker: 'adviser', text: 'Lovely. Speak to you on Saturday then.' },
  ],
  vocabulary: [
    {
      term: 'boarding', phonetic: '/ˈbɔːdɪŋ/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '寄养（宠物短期寄宿照料）', en: 'the temporary care of a pet while the owner is away' },
      usage: { zh: '不可数；dog boarding、boarding kennels。动词 board。', en: 'Uncountable: dog boarding, boarding kennels. The verb is board.' },
      collocations: ['dog boarding', 'boarding kennels', 'arrange boarding'],
      example: { en: 'I’m calling about boarding for my dog next month.', zh: '我来电咨询下个月寄养我的狗。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /ɪŋ/。', en: 'Two syllables, first-syllable stress, ending /ɪŋ/.' },
    },
    {
      term: 'kennel', phonetic: '/ˈkenl/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '狗舍，犬只寄宿处', en: 'the place where dogs are kept or boarded' },
      usage: { zh: '可数；kennel van、private run。复数 kennels 常指整间犬舍。', en: 'Countable: kennel van, private run. The plural kennels often means the whole establishment.' },
      collocations: ['the kennels', 'the kennel van', 'a private kennel'],
      example: { en: 'I’m Clara at the kennels, and I’ll take your details.', zh: '我是狗舍的 Clara，先记一下你的信息。' },
      listening: { zh: '两个音节，/nl/ 辅音丛后不加元音。', en: 'Two syllables; do not add a vowel after the /nl/ cluster.' },
    },
    {
      term: 'rabies', phonetic: '/ˈreɪbiːz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '狂犬病（需疫苗预防）', en: 'the serious disease prevented by the rabies injection' },
      usage: { zh: '不可数；rabies injection、rabies vaccine。', en: 'Uncountable: rabies injection, rabies vaccine.' },
      collocations: ['a rabies injection', 'current rabies cover', 'the rabies vaccine'],
      example: { en: 'We check a current rabies injection before the first stay.', zh: '首次寄养前我们核查近期狂犬病疫苗。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /biːz/。', en: 'Three syllables, first-syllable stress, ending /biːz/.' },
    },
    {
      term: 'walks', phonetic: '/wɔːks/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '散步，遛狗（复数）', en: 'times the dog is taken out for exercise' },
      usage: { zh: '可数复数；three walks a day。动词 walk。', en: 'Plural countable: three walks a day. The verb is walk.' },
      collocations: ['daily walks', 'three walks a day', 'a long walk'],
      example: { en: 'Each dog gets three walks a day on the paths.', zh: '每只狗每天在小径上散步三次。' },
      listening: { zh: '单音节，结尾 /ks/ 清辅音。', en: 'One syllable with a final /ks/ cluster.' },
    },
    {
      term: 'pickup', phonetic: '/ˈpɪkʌp/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '接送，上门取走（服务）', en: 'the arrangement that collects the dog from a place' },
      usage: { zh: '可数；van pickup、morning pickup run。动词短语 pick up。', en: 'Countable: van pickup, morning pickup run. The verb phrase is pick up.' },
      collocations: ['a van pickup', 'the morning pickup', 'arrange a pickup'],
      example: { en: 'The kennel van collects dogs from the town centre.', zh: '狗舍厢车从镇中心接狗。' },
      listening: { zh: '复合词，重音在第一部分；/ʌ/ 短元音。', en: 'Compound with first-part stress; short /ʌ/.' },
    },
    {
      term: 'blanket', phonetic: '/ˈblæŋkɪt/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '毯子（带去熟悉气味的物品）', en: 'a familiar cover that helps a nervous dog settle' },
      usage: { zh: '可数；familiar blanket、send a blanket。', en: 'Countable: familiar blanket, send a blanket.' },
      collocations: ['a familiar blanket', 'his blanket from home', 'a soft blanket'],
      example: { en: 'A familiar blanket helps nervous dogs settle in.', zh: '熟悉的毯子能让紧张的狗安定下来。' },
      listening: { zh: '两个音节，重音在第一音节，/ŋk/ 辅音丛。', en: 'Two syllables, first-syllable stress, /ŋk/ cluster.' },
    },
    {
      term: 'booster', phonetic: '/ˈbuːstə/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '加强针，补打疫苗', en: 'the repeat injection that keeps vaccination current' },
      usage: { zh: '可数；last booster、annual booster。', en: 'Countable: last booster, annual booster.' },
      collocations: ['the last booster', 'an annual booster', 'the booster vaccine'],
      example: { en: 'He had his last booster in the spring.', zh: '他春天刚打过最近一针加强针。' },
      listening: { zh: '两个音节，重音在第一音节，长元音 /uː/。', en: 'Two syllables, first-syllable stress, long /uː/.' },
    },
  ],
  expressions: [
    {
      phrase: 'settles in', sentenceIndex: 13,
      meaning: { zh: '适应新环境，安定下来', en: 'to feel comfortable in an unfamiliar place' },
      usage: { zh: '不及物；settle in before the stay。名词 settling-in。', en: 'Intransitive: settle in before the stay. The noun is settling-in.' },
      example: { en: 'We see how the dog settles in before the booking.', zh: '预订前先看狗能否适应新环境。' },
    },
    {
      phrase: 'drop him off', sentenceIndex: 18,
      meaning: { zh: '把狗送到犬舍', en: 'to take the dog to the kennels and leave him there' },
      usage: { zh: '可分开；代词 him 插在 drop 和 off 之间。', en: 'Separable: the pronoun him sits between drop and off.' },
      example: { en: 'Can I drop him off at the kennels myself?', zh: '我可以自己把他送到犬舍吗？' },
    },
    {
      phrase: 'bring a bag of', sentenceIndex: 23,
      meaning: { zh: '带一袋（日常食物）', en: 'to pack a container of the usual diet' },
      usage: { zh: '及物；bring a bag of usual food。', en: 'Transitive: bring a bag of usual food.' },
      example: { en: 'Owners bring a bag of the dog’s usual food.', zh: '主人带一袋狗平时吃的狗粮。' },
    },
    {
      phrase: 'meet and greet', sentenceIndex: 29,
      meaning: { zh: '见面会（首次接触安排）', en: 'the short introductory visit before a first stay' },
      usage: { zh: '可数名词短语；run a meet and greet。', en: 'Countable phrase: run a meet and greet.' },
      example: { en: 'We run a short meet and greet before every first stay.', zh: '每次首次寄养前我们安排简短见面会。' },
    },
    {
      phrase: 'lines up with', sentenceIndex: 34,
      meaning: { zh: '与（行程）对得上', en: 'to match a planned schedule or trip' },
      usage: { zh: '及物；lines up with my trip。', en: 'Transitive: lines up with my trip.' },
      example: { en: 'The drop-off and collection line up with my trip.', zh: '入住和接回时间与我的行程对得上。' },
    },
    {
      phrase: 'off the lead', sentenceIndex: 38,
      meaning: { zh: '松开牵引绳（自由活动）', en: 'without a leash, in a safe enclosed area' },
      usage: { zh: '介词短语；run off the lead、on the lead 相对。', en: 'Prepositional phrase: run off the lead; compare on the lead.' },
      example: { en: 'Suitable dogs run off the lead in the fenced field.', zh: '合适的狗在围好的场地松开牵引绳活动。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单题先判类别再填', en: 'Sort each gap by category' },
      body: {
        zh: '第 1–4 题分别是名字、晚数、疫苗类型、每日次数。听到 name 记名字，nights 记数字，injection、vaccine 记疫苗项，walks 记次数；落笔前确认空格要的是哪一类，避免把犬种 spaniel 填进名字空。',
        en: 'Items 1–4 are a name, a night count, a vaccine type and a daily count. Note a name after name, a number after nights, a vaccine after injection or vaccine, and a count after walks. Confirm the category before writing; do not put the breed spaniel into the name gap.',
      },
    },
    {
      title: { zh: '自备项与提供项分开记', en: 'Split what you bring from what is supplied' },
      body: {
        zh: '第 7 题问主人必须带什么。句 23 的日常狗粮是自备项；床被由犬舍提供，毯子只是可选安抚物，零食列为可选。听到 provided、included 记提供项，记得 bring、must 记自备项。',
        en: 'Item 7 asks what the owner must bring. The usual food in sentence 23 is self-provided; bedding is supplied, a blanket is an optional comfort item, and treats are optional. Note supplied items after provided or included, and self-provided after bring or must.',
      },
    },
    {
      title: { zh: '表格题按已给行找答案', en: 'Locate the row from printed clues' },
      body: {
        zh: '见面表先用 Arrangement 和已给时间找行：第 8 行时间已给、缺星期；第 9 行星期已给、缺时间；第 10 行星期已给、缺时间。二十分钟、半小时这类时长不要写进时间空格。',
        en: 'For the visit table, use Arrangement and the printed time to find rows: row 8 has the time and needs a day; row 9 has Sunday and needs a time; row 10 has Friday and needs a time. Do not write durations such as twenty minutes into a time gap.',
      },
    },
  ],
};
