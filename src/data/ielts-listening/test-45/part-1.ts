import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 45 · Part 1 — 预约机场停车（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：选定车场与步行距离 → 接驳巴士频率 → 钥匙是否由代管 → 预订天数与超时收费；
 * 填空块在前半段，单选块在后半段，题块顺序与录音顺序一致。
 */
export const test45Part1: ListeningLesson = {
  slug: 'test-45-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预约机场停车', en: 'Arranging airport parking' },
  summary: {
    zh: '旅客打电话预订机场停车：比较南北两个车场的位置与步行距离，询问接驳巴士频率、车钥匙是否由工作人员代管、预订天数以及超时返回的收费方式。',
    en: 'A customer books airport parking by phone: he compares the north and south car parks, asks about the shuttle frequency, whether an attendant keeps the keys, the length of the booking and the overtime charge for a late return.',
  },
  accent: { zh: '车场顾问为加拿大口音，旅客为美式口音。', en: 'The parking adviser speaks with a Canadian accent and the customer with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Car park chosen', cells: [[{ text: 'the ' }, { blank: 1 }, { text: ' car park' }]] },
        { lead: 'Walk from the north park', cells: [[{ blank: 2 }, { text: ' minutes' }]] },
        { lead: 'Shuttle bus runs every', cells: [[{ blank: 3 }, { text: ' minutes' }]] },
        { lead: 'Keys held by the', cells: [[{ blank: 4 }]] },
        { lead: 'Overtime charged per', cells: [[{ blank: 5 }]] },
        { lead: 'Booking covers', cells: [[{ blank: 6 }, { text: ' days' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'Why does the customer choose the north car park?',
          options: [
            { key: 'A', text: 'It is the cheapest close option and has covered bays.' },
            { key: 'B', text: 'It runs its own shuttle to the other terminal.' },
            { key: 'C', text: 'It is reserved for overnight arrivals only.' },
          ],
        },
        {
          number: 8,
          stem: 'What happens to the car keys after parking?',
          options: [
            { key: 'A', text: 'The customer keeps them in a sealed envelope.' },
            { key: 'B', text: 'The attendant at the booth collects and holds them.' },
            { key: 'C', text: 'They are locked inside the car for the stay.' },
          ],
        },
        {
          number: 9,
          stem: 'What overtime charge applies if the car comes back late?',
          options: [
            { key: 'A', text: 'A fixed daily rate is charged regardless of the extra hours.' },
            { key: 'B', text: 'Overtime beyond the booked hours is charged per hour.' },
            { key: 'C', text: 'No charge is made after a late return.' },
          ],
        },
        {
          number: 10,
          stem: 'What should customers bring with them on the day?',
          options: [
            { key: 'A', text: 'The booking reference and the card used for payment' },
            { key: 'B', text: 'A printed map of the car park' },
            { key: 'C', text: 'The car insurance documents' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['north'], evidence: 3,
      explanation: {
        zh: '定位句 3：We have the north car park, which sits right beside the main terminal。顾问先介绍 north 车场，句 5 与句 17 再次以 north park 回指；south park 是句 7 的远场干扰项。',
        en: 'Sentence 3: "We have the north car park, which sits right beside the main terminal". The north park is introduced first and repeated in sentences 5 and 17. The south park in sentence 7 is the far-out distractor.',
      },
    },
    {
      number: 2, accepted: ['10', 'ten'], spoken: 'ten', evidence: 5,
      explanation: {
        zh: '定位句 5：The north park is about a ten minute walk along the covered path。步行时间是 ten minutes；句 7 提到的 south park 靠接驳车，不填步行时长。',
        en: 'Sentence 5: "The north park is about a ten minute walk along the covered path". The walking time is ten minutes. The south park in sentence 7 relies on the shuttle, so it has no walking time.',
      },
    },
    {
      number: 3, accepted: ['20', 'twenty'], spoken: 'twenty', evidence: 9,
      explanation: {
        zh: '定位句 9：The shuttle leaves every twenty minutes。接驳频率为二十分钟一班；注意空格后已有 minutes，答案只填 twenty。',
        en: 'Sentence 9: "The shuttle leaves every twenty minutes". The shuttle runs every twenty minutes. The word minutes already appears after the gap, so write only twenty.',
      },
    },
    {
      number: 4, accepted: ['attendant'], evidence: 11,
      explanation: {
        zh: '定位句 11：The attendant keeps your keys at the booth after you park。代管钥匙的是 booth 的 attendant；句 13 与句 21 重复同一规则，顾客自己保管是被否定的做法。',
        en: 'Sentence 11: "The attendant keeps your keys at the booth after you park". The attendant at the booth holds the keys. Sentences 13 and 21 repeat the rule; keeping the keys yourself is rejected.',
      },
    },
    {
      number: 5, accepted: ['hour'], evidence: 17,
      explanation: {
        zh: '定位句 17：Any overtime beyond the booked hours is charged per hour。超时按小时计费；句 17 后半句的 fixed daily rate 是费率折算方式，不是计费单位。',
        en: 'Sentence 17: "Any overtime beyond the booked hours is charged per hour". Overtime is charged per hour. The fixed daily rate later in the sentence describes how the rate is worked out, not the billing unit.',
      },
    },
    {
      number: 6, accepted: ['4', 'four'], spoken: 'four', evidence: 15,
      explanation: {
        zh: '定位句 15：Your reservation covers four days。预订共四天；句 29 再次提到 four day reservation，句 39 的 two days 是改期提前量，不是预订天数。',
        en: 'Sentence 15: "Your reservation covers four days". The booking lasts four days, repeated in sentence 29. The two days in sentence 39 is the deadline for amending dates, not the booking length.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：It is the cheapest close option, and it has covered bays for most of the day。north 车场胜在近且便宜、车位有顶棚，对应 A。B 错在接驳车属于 south 车场，C 错在它并非只留给过夜到达旅客。',
        en: 'Sentence 21: "It is the cheapest close option, and it has covered bays for most of the day". The north park is cheap, close and covered, matching A. B wrongly attributes the shuttle to it, and C wrongly limits it to overnight arrivals.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：The attendant at the booth collects and holds them until your return flight。钥匙由 booth 工作人员收走保管，对应 B。A 的密封信封、C 的锁在车内都与原文规则相反。',
        en: 'Sentence 25: "The attendant at the booth collects and holds them until your return flight". The attendant collects and keeps the keys, matching B. The sealed envelope in A and locking them in the car in C both contradict the rule.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：Any overtime beyond the booked hours is charged per hour。超出预订时长的部分按小时计费，对应 B。A 说不论超时多久都按整天收费，C 说晚归不收钱，均与原文不符。',
        en: 'Sentence 17: "Any overtime beyond the booked hours is charged per hour". Extra hours are billed per hour, matching B. A claims a flat daily charge regardless of the extra time, and C claims no late fee; neither appears in the recording.',
      },
    },
    {
      number: 10, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：Take your booking reference and the card you paid with; the booth checks both。当天要带预订编号和付款银行卡，对应 A。B 的纸质地图、C 的保险文件全段没有提到。',
        en: 'Sentence 27: "Take your booking reference and the card you paid with; the booth checks both". Bring the reference and the payment card, matching A. A printed map in B and insurance documents in C are never mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I need to book parking at the airport for my trip next week.' },
    { speaker: 'adviser', text: 'Sure, let me walk you through the options. Which terminal are you flying from?' },
    { speaker: 'customer', text: 'The main terminal, and I would prefer something close by.' },
    { speaker: 'adviser', text: 'We have the north car park, which sits right beside the main terminal.' },
    { speaker: 'customer', text: 'How far is that one on foot, if I have luggage?' },
    { speaker: 'adviser', text: 'The north park is about a ten minute walk along the covered path.' },
    { speaker: 'customer', text: 'And what about the south park, which I saw online?' },
    { speaker: 'adviser', text: 'The south park is further out, and it relies on the shuttle bus to the terminal.' },
    { speaker: 'customer', text: 'How often does that shuttle run during the day?' },
    { speaker: 'adviser', text: 'The shuttle leaves every twenty minutes, from the shelter beside the south entrance.' },
    { speaker: 'customer', text: 'Once I have parked, what do I do with my car keys?' },
    { speaker: 'adviser', text: 'The attendant keeps your keys at the booth after you park, so you do not carry them around.' },
    { speaker: 'customer', text: 'Do I keep them myself if I park in the north lot?' },
    { speaker: 'adviser', text: 'No, the same rule applies there; the attendant holds the keys for the booking.' },
    { speaker: 'customer', text: 'How long am I booking the space for in total?' },
    { speaker: 'adviser', text: 'Your reservation covers four days, from the morning of departure to your return.' },
    { speaker: 'customer', text: 'What happens if I bring the car back late after the flight?' },
    { speaker: 'adviser', text: 'Any overtime beyond the booked hours is charged per hour, at a fixed daily rate split down.' },
    { speaker: 'customer', text: 'Is there a charge for leaving the keys at the booth?' },
    { speaker: 'adviser', text: 'No, key holding is included in the parking price, with no separate fee.' },
    { speaker: 'customer', text: 'Right, what should I know about the north park in particular?' },
    { speaker: 'adviser', text: 'It is the cheapest close option, and it has covered bays for most of the day.' },
    { speaker: 'customer', text: 'What about the shuttle service for the south park?' },
    { speaker: 'adviser', text: 'The shuttle runs between the south entrance and the main terminal doors.' },
    { speaker: 'customer', text: 'Who keeps the car keys once the booking begins?' },
    { speaker: 'adviser', text: 'The attendant at the booth collects and holds them until your return flight.' },
    { speaker: 'customer', text: 'What do I need to bring with me on the day?' },
    { speaker: 'adviser', text: 'Take your booking reference and the card you paid with; the booth checks both.' },
    { speaker: 'customer', text: 'Can I park overnight in the short stay bays instead?' },
    { speaker: 'adviser', text: 'Those bays are for arrivals and quick drops, not a four day reservation.' },
    { speaker: 'customer', text: 'Does the shuttle stop at the other terminal on the way?' },
    { speaker: 'adviser', text: 'It serves only the main terminal, so check your flight gate before boarding.' },
    { speaker: 'customer', text: 'Is there a lift from the north park to the departures level?' },
    { speaker: 'adviser', text: 'Yes, the covered path leads to the lift beside terminal arrivals.' },
    { speaker: 'customer', text: 'What if my flight returns after midnight?' },
    { speaker: 'adviser', text: 'The booth stays staffed overnight, and keys are handed back at that desk.' },
    { speaker: 'customer', text: 'Do children need any special arrangement for the walk?' },
    { speaker: 'adviser', text: 'The path is level throughout, so pushchairs can use it without steps.' },
    { speaker: 'customer', text: 'One last thing, can I change the booking dates online?' },
    { speaker: 'adviser', text: 'You can amend the dates through your account up to two days before arrival.' },
    { speaker: 'customer', text: 'That sounds clear. I will go with the north car park.' },
    { speaker: 'adviser', text: 'Done. Please show the reference when you reach the booth.' },
  ],
  vocabulary: [
    {
      term: 'terminal', phonetic: '/ˈtɜːmɪnl/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '航站楼，候机楼', en: 'the main building of an airport where passengers board flights' },
      usage: { zh: '机场场景高频词；main terminal、domestic terminal、terminal doors。', en: 'Common at airports: the main terminal, the domestic terminal, the terminal doors.' },
      collocations: ['the main terminal', 'terminal arrivals', 'terminal doors'],
      example: { en: 'The shuttle stops outside the main terminal.', zh: '接驳车停在主航站楼门外。' },
      listening: { zh: '重音在第一音节 /ˈtɜː/，结尾 -al 弱读，不要听成 term inal。', en: 'Stress the first syllable; the ending -al is weak, not a separate syllable.' },
    },
    {
      term: 'shuttle', phonetic: '/ˈʃʌtl/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '接驳班车，往返巴士', en: 'a bus that runs regularly between two fixed places' },
      usage: { zh: '可数名词；shuttle bus、shuttle service、the shuttle leaves every。', en: 'Countable: a shuttle bus, the shuttle service, the shuttle leaves every twenty minutes.' },
      collocations: ['the shuttle bus', 'the shuttle service', 'a shuttle route'],
      example: { en: 'The shuttle runs between the car park and the terminal.', zh: '接驳车在车场和航站楼之间往返。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈʃʌ/，不要漏听结尾的 /l/。', en: 'Two syllables with first-syllable stress; listen for the final /l/.' },
    },
    {
      term: 'attendant', phonetic: '/əˈtendənt/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '（车场、服务台的）值班人员，服务员', en: 'a person whose job is to help customers at a booth or counter' },
      usage: { zh: '可数名词；parking attendant、booth attendant，动词是 attend。', en: 'Countable: a parking attendant, a booth attendant; the verb is attend.' },
      collocations: ['the attendant at the booth', 'a parking attendant', 'the attendant holds the keys'],
      example: { en: 'The attendant at the booth keeps your car keys.', zh: '收费亭的工作人员保管你的车钥匙。' },
      listening: { zh: '重音在第二音节 /ˈten/，开头 /ə/ 弱读，结尾 -ant 清晰。', en: 'Stress the second syllable; the opening /ə/ is weak and the ending -ant is clear.' },
    },
    {
      term: 'reservation', phonetic: '/ˌrezəˈveɪʃn/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '预订，预约', en: 'an arrangement to keep a place or service for a particular time' },
      usage: { zh: '可数名词；booking 与 reservation 近义，reservation 更正式；make a reservation。', en: 'Countable, more formal than booking. Make a reservation for a place or service.' },
      collocations: ['your reservation covers', 'make a reservation', 'a booking reference'],
      example: { en: 'Your reservation covers four days of parking.', zh: '你的预订包含四天停车。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈveɪ/，开头 re 弱读。', en: 'Four syllables with stress on the third; the opening re is weak.' },
    },
    {
      term: 'overtime', phonetic: '/ˈəʊvətaɪm/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '超时（使用时间），加班', en: 'time beyond the agreed or booked period' },
      usage: { zh: '此处指超出预订时长的停车时间；日常也指加班。overtime 不可数。', en: 'Here it means time beyond the booked period; it also means working extra hours. Uncountable.' },
      collocations: ['any overtime beyond', 'overtime charge', 'charged per hour'],
      example: { en: 'Overtime beyond the booked hours is charged per hour.', zh: '超出预订时长的部分按小时计费。' },
      listening: { zh: '复合词，重音在第一音节；time 读 /taɪm/，双元音饱满。', en: 'A compound with first-syllable stress; time has a full diphthong /taɪm/.' },
    },
    {
      term: 'reference', phonetic: '/ˈrefrəns/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '编号，凭据；参考', en: 'a code or number that identifies a booking or order' },
      usage: { zh: '预订场景中 booking reference 指预订编号；此处不指“参考资料”。', en: 'In booking scenes a booking reference is the identifying code, not source material.' },
      collocations: ['the booking reference', 'a reference number', 'show the reference'],
      example: { en: 'Show your booking reference at the booth.', zh: '在收费亭出示你的预订编号。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈref/，中间 re 弱读。', en: 'Three syllables with first-syllable stress; the middle re is weak.' },
    },
    {
      term: 'amend', phonetic: '/əˈmend/', partOfSpeech: 'v.', sentenceIndex: 39,
      meaning: { zh: '修改，变更（预订、文件）', en: 'to change the details of a booking or document' },
      usage: { zh: '及物动词；amend the dates、amend the booking，名词是 amendment。', en: 'Transitive: amend the dates, amend the booking; the noun is amendment.' },
      collocations: ['amend the dates', 'amend the booking', 'amend online'],
      example: { en: 'You can amend the dates through your account.', zh: '你可以通过账户修改日期。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈmend/，开头 /ə/ 弱读。', en: 'Two syllables with stress on the second; the opening /ə/ is weak.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk you through', sentenceIndex: 1,
      meaning: { zh: '一步步给你讲解', en: 'to explain something step by step' },
      usage: { zh: '服务场景开场常用；walk you through the options、the booking。', en: 'Common in service openings: walk you through the options or the booking.' },
      example: { en: 'Let me walk you through the parking options.', zh: '我一步步给你讲一下停车选项。' },
    },
    {
      phrase: 'relies on', sentenceIndex: 7,
      meaning: { zh: '依靠，依赖', en: 'to depend on something for a particular purpose' },
      usage: { zh: 'rely on 加名词；此处 south park 依赖接驳车往返航站楼。', en: 'Rely on plus a noun; here the south park depends on the shuttle bus.' },
      example: { en: 'The south park relies on the shuttle bus to the terminal.', zh: '南车场靠接驳车往返航站楼。' },
    },
    {
      phrase: 'applies there', sentenceIndex: 13,
      meaning: { zh: '同样适用于那里', en: 'to be valid or relevant in that case too' },
      usage: { zh: 'the same rule applies 表示规则同样适用；apply to 后接对象。', en: 'The same rule applies means it holds there too; apply to takes the object.' },
      example: { en: 'The same key rule applies in the north lot.', zh: '同样的钥匙规则在北车场也适用。' },
    },
    {
      phrase: 'split down', sentenceIndex: 17,
      meaning: { zh: '折算，拆分（费率）', en: 'to work out a daily rate by dividing it into smaller units' },
      usage: { zh: '此处指日费率再按小时折算；split 表示拆分计算。', en: 'Here the daily rate is divided down into hourly units; split means to divide up.' },
      example: { en: 'The daily rate is split down to a per hour charge.', zh: '日费率被折算成按小时收取。' },
    },
    {
      phrase: 'checks both', sentenceIndex: 27,
      meaning: { zh: '核对这两样', en: 'to verify the two items mentioned just before' },
      usage: { zh: 'both 指代前文的 reference 和 card； booth checks both。', en: 'Both refers back to the reference and the card; the booth checks both.' },
      example: { en: 'The booth checks the reference and the card.', zh: '收费亭核对编号和银行卡。' },
    },
    {
      phrase: 'quick drops', sentenceIndex: 29,
      meaning: { zh: '临时即停即走', en: 'short stops for leaving passengers or luggage briefly' },
      usage: { zh: '机场场景 quick drop 指短暂上下客，与过夜停车相对。', en: 'At airports a quick drop is a brief stop for passengers, the opposite of overnight parking.' },
      example: { en: 'Short stay bays are for quick drops only.', zh: '短时车位仅供即停即走。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单行先判断要填哪类信息', en: 'Judge the expected answer type first' },
      body: {
        zh: '听之前看六行字段：车场名、步行分钟数、接驳频率、代管人、计费单位、预订天数。空格前后的 minutes、days 已经给出单位，答案只填数字或名词。',
        en: 'Before listening, read the six rows: car park, walking minutes, shuttle frequency, who holds the keys, billing unit, booking length. Minutes and days already appear after the gaps, so write only the number or noun.',
      },
    },
    {
      title: { zh: 'north 与 south 两条信息分开记', en: 'Keep north and south apart' },
      body: {
        zh: 'north park 靠近航站楼、步行十分钟；south park 距离远、靠二十分钟一班的接驳车。听到方向词先对照空格属于哪个车场，避免把接驳频率写进步行距离。',
        en: 'The north park is close, a ten minute walk away; the south park is further out and served by a shuttle every twenty minutes. Match each detail to its car park before writing it down.',
      },
    },
    {
      title: { zh: '否定句里的答案不是正确做法', en: 'Rejected options are distractors' },
      body: {
        zh: '顾客问能不能自己留钥匙、能不能停短时车位，顾问都用 No 否定。听到 No、not、instead 这类标记时，准备把刚才的设想划掉，正确规则通常在下一句才说清。',
        en: 'The customer asks whether he keeps the keys himself and whether short stay bays will do, and the adviser rejects both with No. When you hear No, not or instead, mark that idea down and wait for the rule that follows.',
      },
    },
  ],
};
