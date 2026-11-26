import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 49 · Part 1 — 观众为有障碍需求的团体预订戏票。原创仿真材料，非官方真题。
 *
 * 对话围绕人数、轮椅座位、陪同座位、字幕场次、取票方式、预订姓氏、
 * 取票凭证、轮椅位价格与改签费用展开。
 */
export const test49Part1: ListeningLesson = {
  slug: 'test-49-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预订有无障碍需求的戏票', en: 'Booking theatre tickets with access needs' },
  summary: {
    zh: '一位男士代表团体致电剧院订票：同行人数、轮椅位所在排、陪同座位是否收费、哪一场带字幕、如何取票、预订姓氏、取票凭证、轮椅位票价以及改签需要缴纳的费用。',
    en: 'A man calls a theatre on behalf of a group: the number in the party, which row holds the wheelchair space, whether the companion seat costs extra, which performance has subtitles, how tickets are collected, the booking surname, the proof needed on collection, the wheelchair seat price and any fee for changing the booking.',
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
        { lead: 'Group size', cells: [[{ blank: 1 }, { text: ' people' }]] },
        { lead: 'Wheelchair position', cells: [[{ text: 'Row ' }, { blank: 2 }]] },
        { lead: 'Companion seat beside the chair', cells: [[{ text: 'The seat is ' }, { blank: 3 }, { text: ' of charge' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'Which performance carries subtitles?',
          options: [
            { key: 'A', text: 'The Saturday matinee.' },
            { key: 'B', text: 'The Friday evening show.' },
            { key: 'C', text: 'The Sunday morning tour.' },
          ],
        },
        {
          number: 5,
          stem: 'Why does the caller need accessible seating?',
          options: [
            { key: 'A', text: 'One group member uses a wheelchair.' },
            { key: 'B', text: 'Several members have limited sight.' },
            { key: 'C', text: 'The group wants seats near the exit.' },
          ],
        },
        {
          number: 6,
          stem: 'How will the group obtain the tickets?',
          options: [
            { key: 'A', text: 'They will be posted to the home address.' },
            { key: 'B', text: 'They will be collected at the box office.' },
            { key: 'C', text: 'They will wait in a locker by the side entrance.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Booking surname', cells: [[{ blank: 7 }]] },
        { lead: 'Document to bring', cells: [[{ text: 'the booking ' }, { blank: 8 }]] },
        { lead: 'Wheelchair space price', cells: [[{ blank: 9 }, { text: ' pounds' }]] },
        { lead: 'Changing the performance', cells: [[{ text: 'pay a ' }, { blank: 10 }, { text: ' change fee' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['four', '4'], evidence: 2,
      explanation: {
        zh: '定位句 2：There are four of us, and one of us uses a wheelchair。团体一共四人；句 15 提到六人以上才能邮寄，那是另一个门槛，不是本空人数。',
        en: 'Sentence 2: "There are four of us, and one of us uses a wheelchair". The party has four members; sentence 15 mentions six or more for postal booking, which is a separate threshold, not this group size.',
      },
    },
    {
      number: 2, accepted: ['C'], evidence: 5,
      explanation: {
        zh: '定位句 5：The wheelchair positions are in row C。轮椅位在 C 排；句 36 的 row C 是侧门坡道通向的同一排，不另给排号。',
        en: 'Sentence 5: "The wheelchair positions are in row C". The wheelchair spaces are in row C; the row C in sentence 36 refers to the same row reached by the side ramp, not another number.',
      },
    },
    {
      number: 3, accepted: ['free'], evidence: 7,
      explanation: {
        zh: '定位句 7：the companion seat next to the wheelchair space is free, so you do not pay for that ticket。陪同座位不收费；句 25 再次说明该陪同座没有额外费用。',
        en: 'Sentence 7: "the companion seat next to the wheelchair space is free, so you do not pay for that ticket". The companion seat carries no charge; sentence 25 repeats that there is no extra fee for it.',
      },
    },
    {
      number: 4, accepted: ['A'], evidence: 9,
      explanation: {
        zh: '定位句 9：The subtitled performance is the Saturday matinee。字幕场是周六日场；句 40 补充该日场对所有人固定票价，周五夜场和周日上午没有出现。',
        en: 'Sentence 9: "The subtitled performance is the Saturday matinee". The subtitled show is the Saturday matinee; sentence 40 notes this matinee has a fixed price. The Friday evening and Sunday morning options do not appear.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 11,
      explanation: {
        zh: '定位句 11：the wheelchair positions are held for every performance。保留轮椅位说明团体中有成员需要轮椅，对应 A。视力受限和靠近出口在全段都没有提到。',
        en: 'Sentence 11: "the wheelchair positions are held for every performance". Keeping wheelchair positions shows a member needs the chair, matching A. Limited sight and seats near the exit are never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：You can pick them up at the box office about half an hour before the performance。取票方式是开场前在票房领取；邮寄只适用于六人以上团体，储物柜在全段没有依据。',
        en: 'Sentence 13: "You can pick them up at the box office about half an hour before the performance". Tickets are collected at the box office before the show. Post applies only to groups of six or more, and a locker has no basis in the recording.',
      },
    },
    {
      number: 7, accepted: ['Everett'], evidence: 18,
      explanation: {
        zh: '定位句 18：It’s Everett。预订姓氏按拼字母记录；句 19 接待员重复确认 Everett，注意首字母大写。',
        en: 'Sentence 18: "It’s Everett". The booking surname is spelled out and repeated by the clerk in sentence 19; write the capital letter at the start.',
      },
    },
    {
      number: 8, accepted: ['reference'], evidence: 21,
      explanation: {
        zh: '定位句 21：Bring the booking reference, the one in the confirmation email。取票带预订编号即可；身份证只在网上用卡支付时才要求，不是本空答案。',
        en: 'Sentence 21: "Bring the booking reference, the one in the confirmation email". The booking reference is what to bring; ID is required only if the card was used online, so it is not this answer.',
      },
    },
    {
      number: 9, accepted: ['twelve', '12'], evidence: 23,
      explanation: {
        zh: '定位句 23：The wheelchair position costs twelve pounds。轮椅位票价十二英镑；句 24 的 eight pounds 是其余普通座的价格，不要填混。',
        en: 'Sentence 23: "The wheelchair position costs twelve pounds". The wheelchair space costs twelve pounds; the eight pounds in sentence 24 is the price of each ordinary seat, so do not mix the two.',
      },
    },
    {
      number: 10, accepted: ['small'], evidence: 27,
      explanation: {
        zh: '定位句 27：you will pay a small change fee for each ticket。改签每张票收一笔小额手续费；剧院自行取消时全额退款且免手续费，那是另一情形。',
        en: 'Sentence 27: "you will pay a small change fee for each ticket". A small fee applies to each changed ticket; a full refund with no fee applies when the venue cancels the show, which is a separate case.',
      },
    },
  ],
  transcript: [
    { speaker: 'caller', text: 'Hello, I’m ringing to book theatre tickets for a group coming to see the play next month.' },
    { speaker: 'clerk', text: 'Good morning. I can help with that. How many of you will be coming?' },
    { speaker: 'caller', text: 'There are four of us, and one of us uses a wheelchair.' },
    { speaker: 'clerk', text: 'Four visitors, with a wheelchair space required. Let me note that down.' },
    { speaker: 'caller', text: 'Which row would be best for us? I want to make sure there is room to turn the chair.' },
    { speaker: 'clerk', text: 'The wheelchair positions are in row C, with a wide gap beside the regular seats.' },
    { speaker: 'caller', text: 'Row C, that sounds comfortable. Is anyone able to sit beside the wheelchair user?' },
    { speaker: 'clerk', text: 'Yes, the companion seat next to the wheelchair space is free, so you do not pay for that ticket.' },
    { speaker: 'caller', text: 'That’s a relief. Now, one of our group is hard of hearing, so we would like the screening with subtitles.' },
    { speaker: 'clerk', text: 'The subtitled performance is the Saturday matinee, which starts at two thirty.' },
    { speaker: 'caller', text: 'The Saturday matinee works for us. Does it have the same seating as the evening show?' },
    { speaker: 'clerk', text: 'Yes, the wheelchair positions are held for every performance, but you should book early to keep them.' },
    { speaker: 'caller', text: 'We would prefer not to queue on the day. How do we collect the tickets?' },
    { speaker: 'clerk', text: 'You can pick them up at the box office about half an hour before the performance.' },
    { speaker: 'caller', text: 'Can they be sent to us by post instead?' },
    { speaker: 'clerk', text: 'Postal posting is available for groups of six or more, so for four of you the box office is the simpler option.' },
    { speaker: 'caller', text: 'Right, we will collect them there. Could you hold the booking under our surname?' },
    { speaker: 'clerk', text: 'Of course. What is the surname for the reservation?' },
    { speaker: 'caller', text: 'It’s Everett. E, V, double E, R, double T.' },
    { speaker: 'clerk', text: 'Everett, thank you. And what should you bring when you collect?' },
    { speaker: 'caller', text: 'Do we need ID, or just the booking reference?' },
    { speaker: 'clerk', text: 'Bring the booking reference, the one in the confirmation email. We do not ask for ID unless the card was used online.' },
    { speaker: 'caller', text: 'Good. How much do we pay for the wheelchair space itself?' },
    { speaker: 'clerk', text: 'The wheelchair position costs twelve pounds, and the three regular companion seats are priced at eight pounds each.' },
    { speaker: 'caller', text: 'Twelve pounds for the wheelchair space, and eight for each other seat.' },
    { speaker: 'clerk', text: 'That’s right. There is no extra charge for the companion seat beside the chair.' },
    { speaker: 'caller', text: 'What happens if we later need to change the performance?' },
    { speaker: 'clerk', text: 'You can move to another date, but you will pay a small change fee for each ticket.' },
    { speaker: 'caller', text: 'Is the fee waived if the theatre itself cancels the show?' },
    { speaker: 'clerk', text: 'Yes, if the venue cancels, you get a full refund without any fee at all.' },
    { speaker: 'caller', text: 'And if one person drops out two days before?' },
    { speaker: 'clerk', text: 'Then the unused ticket can be released, but the change fee still applies to any seat you move.' },
    { speaker: 'clerk', text: 'Let me confirm the details. Four people, one wheelchair user, row C, Saturday matinee, collected at the box office.' },
    { speaker: 'caller', text: 'That all sounds correct.' },
    { speaker: 'clerk', text: 'The confirmation email will arrive by this evening, and it includes the access map to the side entrance.' },
    { speaker: 'caller', text: 'Is the side entrance step free?' },
    { speaker: 'clerk', text: 'Yes, the ramp runs straight from the pavement to row C, and a member of staff can meet you at the door.' },
    { speaker: 'caller', text: 'That would be helpful. Do we need to ask for that in advance?' },
    { speaker: 'clerk', text: 'Just note it in the booking, and we will arrange a greeter on the day.' },
    { speaker: 'caller', text: 'Thank you. One last question, are there any discounts for students in the group?' },
    { speaker: 'clerk', text: 'Student tickets are available on weekday evenings, but the Saturday matinee has a fixed price for everyone.' },
    { speaker: 'caller', text: 'Fair enough. We will pay online once the confirmation comes through.' },
    { speaker: 'clerk', text: 'Lovely. Enjoy the play, and call us if anything changes before Saturday.' },
    { speaker: 'caller', text: 'Thanks very much for your help.' },
  ],
  vocabulary: [
    {
      term: 'wheelchair', phonetic: '/ˈwiːltʃeə/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '轮椅', en: 'a chair with wheels for a person who cannot walk' },
      usage: { zh: '可数；wheelchair space、wheelchair user。', en: 'Countable: wheelchair space, wheelchair user.' },
      collocations: ['a wheelchair space', 'uses a wheelchair', 'wheelchair position'],
      example: { en: 'One member of our group uses a wheelchair.', zh: '我们团里有一位成员坐轮椅。' },
      listening: { zh: '两个音节，重音在第一音节；中间 /tʃ/ 发音要轻。', en: 'Two syllables with stress on the first; the middle /tʃ/ is weak.' },
    },
    {
      term: 'companion', phonetic: '/kəmˈpæniən/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '陪同者，同伴（companion seat 陪同座位）', en: 'a person who accompanies another; a companion seat sits beside the wheelchair space' },
      usage: { zh: '可数；companion seat、travel companion。', en: 'Countable: companion seat, travel companion.' },
      collocations: ['companion seat', 'the companion beside the chair', 'a travelling companion'],
      example: { en: 'The companion seat next to the wheelchair space is free.', zh: '轮椅位旁的陪同座位不收费。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈpæn/；开头 /kə/ 弱读。', en: 'Three syllables with stress on the second; the opening /kə/ is reduced.' },
    },
    {
      term: 'subtitles', phonetic: '/ˈsʌbtaɪtlz/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '字幕', en: 'printed dialogue shown at the bottom of a film or play screening' },
      usage: { zh: '复数；screening with subtitles、subtitled performance。形容词 subtitled。', en: 'Plural: screening with subtitles. The adjective is subtitled.' },
      collocations: ['the subtitled performance', 'screening with subtitles', 'read the subtitles'],
      example: { en: 'The subtitled performance is the Saturday matinee.', zh: '带字幕的场次是周六日场。' },
      listening: { zh: '三个音节，重音在第一音节；结尾 /tlz/ 不要漏 /t/。', en: 'Three syllables with stress on the first; keep the /t/ before /lz/.' },
    },
    {
      term: 'reference', phonetic: '/ˈrefrəns/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '编号，凭证（booking reference 预订编号）', en: 'a code that identifies a booking; a booking reference' },
      usage: { zh: '可数；booking reference、reference number。', en: 'Countable: booking reference, reference number.' },
      collocations: ['the booking reference', 'reference number', 'confirmation reference'],
      example: { en: 'Bring the booking reference from the confirmation email.', zh: '带上确认邮件里的预订编号。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /rə/ 弱读。', en: 'Three syllables with stress on the first; the middle /rə/ is reduced.' },
    },
    {
      term: 'ramp', phonetic: '/ræmp/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '坡道', en: 'a sloped path that lets wheelchairs move between levels' },
      usage: { zh: '可数；side ramp、step free ramp。', en: 'Countable: side ramp, step free ramp.' },
      collocations: ['the ramp runs from', 'a wheelchair ramp', 'pavement ramp'],
      example: { en: 'The ramp runs straight from the pavement to row C.', zh: '坡道从人行道直通 C 排。' },
      listening: { zh: '单音节，结尾 /mp/ 要把 /m/ 读出来。', en: 'One syllable; pronounce the /m/ in the final /mp/.' },
    },
    {
      term: 'greeter', phonetic: '/ˈɡriːtə/', partOfSpeech: 'n.', sentenceIndex: 38,
      meaning: { zh: '迎宾人员，接待引导员', en: 'a member of staff who meets and directs visitors on arrival' },
      usage: { zh: '可数；arrange a greeter、the venue greeter。动词 greet。', en: 'Countable: arrange a greeter. The verb is greet.' },
      collocations: ['arrange a greeter', 'a greeter on the day', 'the front-of-house greeter'],
      example: { en: 'We will arrange a greeter to meet you at the door.', zh: '我们会安排一位引导员在门口接您。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /tə/ 轻读不卷舌。', en: 'Two syllables with stress on the first; the ending /tə/ is weak and non-rhotic.' },
    },
  ],
  expressions: [
    {
      phrase: 'coming to see', sentenceIndex: 0,
      meaning: { zh: '前来看（演出或活动）', en: 'travelling to attend a show or event' },
      usage: { zh: '后接演出或活动名；coming to see the play、coming to see a film。', en: 'Follow with a show or event: coming to see the play.' },
      example: { en: 'I’m calling to book tickets for a group coming to see the play.', zh: '我来电给前来看戏的团体订票。' },
    },
    {
      phrase: 'pick them up', sentenceIndex: 13,
      meaning: { zh: '领取，取走（票物）', en: 'to collect tickets or an item from a place' },
      usage: { zh: '代词放中间：pick them up；宾语是名词时可后置。', en: 'Put the pronoun in the middle: pick them up.' },
      example: { en: 'You can pick them up at the box office before the performance.', zh: '您可以开场前在票房取票。' },
    },
    {
      phrase: 'hold the booking', sentenceIndex: 16,
      meaning: { zh: '保留预订席位', en: 'to keep a reservation available for a group' },
      usage: { zh: 'hold a booking under a surname；被动 be held for。', en: 'Hold a booking under a surname; the passive is be held for.' },
      example: { en: 'Could you hold the booking under our surname, please?', zh: '能否用我们的姓氏保留预订？' },
    },
    {
      phrase: 'drops out', sentenceIndex: 30,
      meaning: { zh: '退出（团体、活动）', en: 'to stop taking part in a trip or event' },
      usage: { zh: '短语动词；第三人称 drops out，过去式 dropped out。', en: 'Phrasal verb: drops out, dropped out.' },
      example: { en: 'If one person drops out two days before, the ticket can be released.', zh: '若有人两天前退出，票位可以让出。' },
    },
    {
      phrase: 'step free', sentenceIndex: 35,
      meaning: { zh: '无台阶的，方便轮椅通行的', en: 'having no steps, so wheelchairs can pass through' },
      usage: { zh: '形容词短语；step free entrance、step free access。', en: 'Adjective phrase: step free entrance, step free access.' },
      example: { en: 'The side entrance is step free, with a ramp to the seating.', zh: '侧门没有台阶，配有通向座位的坡道。' },
    },
  ],
  tips: [
    {
      title: { zh: '先读备注表，预判词性', en: 'Read the notes and predict the part of speech' },
      body: {
        zh: '第 1–3 题是备注填空，听前先看空格前后：第一空后接 people 填数字，第二空接 Row 填字母，第三空在 is 与 of charge 之间填形容词。词性判断能防止把价格填进排号。',
        en: 'Items 1 to 3 complete notes. Before listening, judge each gap: the first expects a number before people, the second a letter after Row, and the third an adjective between is and of charge. Predicting parts of speech stops you putting a price in a row letter gap.',
      },
    },
    {
      title: { zh: '区分免费陪同座与普通票价', en: 'Separate the free companion seat from ordinary prices' },
      body: {
        zh: '本段反复出现价格：陪同座免费、轮椅位十二英镑、其余座位八英镑。听时把座位类型和金额并排记在草稿上，避免第 9 题把八英镑误填成轮椅位价格。',
        en: 'The recording returns to prices: the companion seat is free, the wheelchair space is twelve pounds, and other seats are eight. Note seat type and amount side by side, so item 9 does not take the eight pounds meant for an ordinary seat.',
      },
    },
    {
      title: { zh: '改签条款听条件', en: 'Note the condition behind each change rule' },
      body: {
        zh: '第 10 题问改签费用，原文给了三种情形：主动改签收小额手续费、剧院取消全额退款、成员退出座位可让出。选项常把不同条件下的规则混在一起，听清每个规则对应哪种情形。',
        en: 'Item 10 asks about the change fee. The recording gives three cases: changing voluntarily carries a small fee, a venue cancellation gives a full refund, and a dropout frees the seat. Options often mix rules across cases, so match each rule to its condition.',
      },
    },
  ],
};
