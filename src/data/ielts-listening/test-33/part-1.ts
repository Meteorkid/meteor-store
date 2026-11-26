import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 33 · Part 1 — 预订游船（双人对话，英式口音）。原创仿真材料，非官方真题。
 *
 * 对话围绕航程时长、上船码头、无障碍座位、天气取消退款、发船频率、宠物规定、
 * 船上提供物、票含讲解、无障碍预订方式与取消通知渠道展开。
 */
export const test33Part1: ListeningLesson = {
  slug: 'test-33-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预订游船', en: 'Booking a river boat trip' },
  summary: {
    zh: '游客向订票处咨询河上游船：航程时长、上船码头、无障碍座位位置与预订要求、恶劣天气取消时的退款、发船频率、宠物规定、船上提供的物品、成人票包含的讲解，以及取消通知的发送渠道。',
    en: 'A visitor asks about a river cruise: the trip length, the boarding pier, where accessible seats are and how to reserve them, refunds if bad weather cancels the trip, how often boats run, the pet rule, what the boat provides, the commentary included in the adult ticket, and how cancellation notice is sent.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'clerk', label: 'CLERK', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'visitor', label: 'VISITOR', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Cruise lasts', cells: [[{ blank: 1 }, { text: ' hours' }]] },
        { lead: 'Boarding pier: Pier', cells: [[{ blank: 2 }]] },
        { lead: 'Accessible seating beside the', cells: [[{ blank: 3 }]] },
        { lead: 'Bad weather: tickets fully', cells: [[{ blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'How often do the boats run through the day?',
          options: [
            { key: 'A', text: 'once in the morning only' },
            { key: 'B', text: 'every two hours' },
            { key: 'C', text: 'three times on Sundays' },
          ],
        },
        {
          number: 6,
          stem: 'What rule applies to pets on board?',
          options: [
            { key: 'A', text: 'dogs must stay on a lead on the lower deck' },
            { key: 'B', text: 'cats are welcome on the upper deck' },
            { key: 'C', text: 'no pets are allowed at all' },
          ],
        },
        {
          number: 7,
          stem: 'What is provided on the boat?',
          options: [
            { key: 'A', text: 'tea and biscuits for every passenger' },
            { key: 'B', text: 'waterproof boots for the open seats' },
            { key: 'C', text: 'life jackets for every passenger' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Ticket / booking detail', 'Information'],
      rows: [
        { lead: 'Adult ticket includes a short guided', cells: [[{ blank: 8 }]] },
        { lead: 'Accessible seats reserved for passengers with a', cells: [[{ blank: 9 }]] },
        { lead: 'Cancellation notice sent by phone or', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['three', '3'], evidence: 3,
      explanation: {
        zh: '定位句 3：The cruise lasts three hours, and that includes a stop at the old stone bridge。航程三小时；句 7 的 ten 与 two 是发船时刻，不是时长。',
        en: 'Sentence 3: "The cruise lasts three hours, and that includes a stop at the old stone bridge". The trip lasts three hours; ten and two in sentence 7 are departure times, not the duration.',
      },
    },
    {
      number: 2, accepted: ['two', '2'], evidence: 9,
      explanation: {
        zh: '定位句 9：Boarding is at Pier two, the wooden one beside the fish market。上船在二号码头；main pier 是句 1 的泛指，不是具体编号。',
        en: 'Sentence 9: "Boarding is at Pier two, the wooden one beside the fish market". Boarding is at Pier two; the main pier in sentence 1 is a general reference, not the number.',
      },
    },
    {
      number: 3, accepted: ['ramp'], evidence: 11,
      explanation: {
        zh: '定位句 11：We keep accessible seating beside the ramp at the rear of the boat。无障碍座位在坡道旁；rear 是方位，不是座位依托的设施。',
        en: 'Sentence 11: "We keep accessible seating beside the ramp at the rear of the boat". Accessible seats are beside the ramp; rear is the position, not the facility.',
      },
    },
    {
      number: 4, accepted: ['refunded'], evidence: 14,
      explanation: {
        zh: '定位句 14：If the river is too rough, we cancel before departure, and the tickets are fully refunded。天气恶劣取消时票款全额退还；cancel 是动作，空里要填被动结果 refunded。',
        en: 'Sentence 14: "If the river is too rough, we cancel before departure, and the tickets are fully refunded". Bad-weather cancellation refunds tickets in full; cancel is the action, and the gap asks for the passive result refunded.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：Every two hours, weather permitting, so you have a choice of morning or afternoon departure。船只每两小时一班，对应 B。A 的只上午一班与 C 的周日三班在录音中未出现。',
        en: 'Sentence 17: "Every two hours, weather permitting, so you have a choice of morning or afternoon departure". Boats run every two hours, matching B. A morning-only service and three Sunday trips are not mentioned.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：Dogs are welcome, but they must stay on a lead and remain on the lower deck。狗须牵绳待在下层甲板，对应 A。B 的猫在上层被句 21 否定，C 的完全禁宠与录音不符。',
        en: 'Sentence 19: "Dogs are welcome, but they must stay on a lead and remain on the lower deck". Dogs stay on a lead on the lower deck, matching A. Cats upstairs are rejected in sentence 21, and a total ban contradicts the recording.',
      },
    },
    {
      number: 7, accepted: ['C'], evidence: 23,
      explanation: {
        zh: '定位句 23：We provide life jackets for every passenger, and there are waterproof covers over the open seats。船上为每位乘客配救生衣，对应 C。A 的茶点与 B 的防水靴在录音中未作为提供物出现。',
        en: 'Sentence 23: "We provide life jackets for every passenger, and there are waterproof covers over the open seats". Life jackets are provided for everyone, matching C. Tea and biscuits and waterproof boots are not supplied.',
      },
    },
    {
      number: 8, accepted: ['commentary'], evidence: 27,
      explanation: {
        zh: '定位句 27：The ticket covers a short guided commentary about the riverside buildings。成人票含一段简短讲解，填 commentary。leaflet 是另发的资料，不是票含项目。',
        en: 'Sentence 27: "The ticket covers a short guided commentary about the riverside buildings". The ticket includes a short commentary, so write commentary. The leaflet is a separate handout, not an included item.',
      },
    },
    {
      number: 9, accepted: ['wheelchair'], evidence: 30,
      explanation: {
        zh: '定位句 30：Those accessible places are reserved for passengers with a wheelchair。无障碍座位预留给使用轮椅的乘客，填 wheelchair。',
        en: 'Sentence 30: "Those accessible places are reserved for passengers with a wheelchair". Accessible seats are reserved for wheelchair users, so write wheelchair.',
      },
    },
    {
      number: 10, accepted: ['email'], evidence: 32,
      explanation: {
        zh: '定位句 32：The crew checks the forecast by phone or email the evening before。取消通知通过电话或邮件发出，填 email。phone 已在题干给出。',
        en: 'Sentence 32: "The crew checks the forecast by phone or email the evening before". Notice goes by phone or email, so write email. Phone is already printed in the lead.',
      },
    },
  ],
  transcript: [
    { speaker: 'visitor', text: 'I am planning a river boat trip this Saturday, and I would like to check the details before I book.' },
    { speaker: 'clerk', text: 'Of course. The river cruise leaves from the main pier in the town centre.' },
    { speaker: 'visitor', text: 'How long does the trip itself take?' },
    { speaker: 'clerk', text: 'The cruise lasts three hours, and that includes a stop at the old stone bridge.' },
    { speaker: 'visitor', text: 'Three hours. That fits with our afternoon plans.' },
    { speaker: 'clerk', text: 'Which day were you thinking of?' },
    { speaker: 'visitor', text: 'Saturday. Are the boats busy then?' },
    { speaker: 'clerk', text: 'The first trip goes out at ten, and there is another at two in the afternoon.' },
    { speaker: 'visitor', text: 'Good. Now the boarding point. Which pier do we use?' },
    { speaker: 'clerk', text: 'Boarding is at Pier two, the wooden one beside the fish market.' },
    { speaker: 'visitor', text: 'Pier two. Is there any access for someone who uses a wheelchair?' },
    { speaker: 'clerk', text: 'Yes. We keep accessible seating beside the ramp at the rear of the boat.' },
    { speaker: 'visitor', text: 'Beside the ramp, that makes boarding easier.' },
    { speaker: 'visitor', text: 'I will. What happens if the weather turns and the trip has to be called off?' },
    { speaker: 'clerk', text: 'If the river is too rough, we cancel before departure, and the tickets are fully refunded.' },
    { speaker: 'visitor', text: 'Refunded in full. Is there any other notice I should know about?' },
    { speaker: 'visitor', text: 'So how often do they run through the day?' },
    { speaker: 'clerk', text: 'Every two hours, weather permitting, so you have a choice of morning or afternoon departure.' },
    { speaker: 'visitor', text: 'We are bringing our small dog with us. Are pets allowed on board?' },
    { speaker: 'clerk', text: 'Dogs are welcome, but they must stay on a lead and remain on the lower deck.' },
    { speaker: 'visitor', text: 'On the lead, lower deck. What about cats?' },
    { speaker: 'clerk', text: 'Cats are not accepted on the public cruises, only registered assistance animals.' },
    { speaker: 'visitor', text: 'What is provided on the boat itself?' },
    { speaker: 'clerk', text: 'We provide life jackets for every passenger, and there are waterproof covers over the open seats.' },
    { speaker: 'visitor', text: 'Life jackets and covers. Do we need to bring our own food?' },
    { speaker: 'clerk', text: 'Tea and coffee are served, but snacks you can buy at the kiosk before boarding.' },
    { speaker: 'visitor', text: 'Does the adult ticket include anything else?' },
    { speaker: 'clerk', text: 'The ticket covers a short guided commentary about the riverside buildings.' },
    { speaker: 'visitor', text: 'A commentary. Is it given in English only?' },
    { speaker: 'clerk', text: 'The guide speaks English, and a leaflet lists the main landmarks in three languages.' },
    { speaker: 'clerk', text: 'Those accessible places are reserved for passengers with a wheelchair, so mention it when you book.' },
    { speaker: 'visitor', text: 'I will mention the wheelchair then.' },
    { speaker: 'clerk', text: 'The crew checks the forecast by phone or email the evening before.' },
    { speaker: 'visitor', text: 'Right, we would get an email if that happened?' },
    { speaker: 'clerk', text: 'Usually, yes, and the booking number on your ticket confirms the trip.' },
    { speaker: 'visitor', text: 'How many passengers can one boat carry?' },
    { speaker: 'clerk', text: 'About forty, and the crew counts heads before every departure.' },
    { speaker: 'visitor', text: 'Are children charged the same?' },
    { speaker: 'clerk', text: 'Under fives travel free, and older children pay a reduced fare.' },
    { speaker: 'visitor', text: 'Do we need to arrive early?' },
    { speaker: 'clerk', text: 'Boarding opens twenty minutes before departure, and the boat leaves on the hour.' },
    { speaker: 'visitor', text: 'I think that covers what we needed.' },
    { speaker: 'clerk', text: 'You can reserve the seats online, or pay at the kiosk before you sail.' },
    { speaker: 'visitor', text: 'We will book online this evening.' },
    { speaker: 'clerk', text: 'Fine. Have a pleasant trip, and remember Pier two beside the market.' },
  ],
  vocabulary: [
    {
      term: 'cruise', phonetic: '/kruːz/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '乘船游览，游船行程', en: 'a pleasure trip on a boat or ship' },
      usage: { zh: '可数；river cruise、go on a cruise。动词 cruise。', en: 'Countable: river cruise, go on a cruise. The verb is cruise.' },
      collocations: ['a river cruise', 'the cruise lasts', 'board the cruise'],
      example: { en: 'The river cruise leaves from the main pier.', zh: '河上游船从主码头出发。' },
      listening: { zh: '单音节 /kruːz/，长元音 /uː/，结尾 /z/。', en: 'One syllable /kruːz/ with long /uː/ and final /z/.' },
    },
    {
      term: 'pier', phonetic: '/pɪə/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '码头，栈桥', en: 'the structure where boats pick up and drop off passengers' },
      usage: { zh: '可数；Pier two、board at the pier。', en: 'Countable: Pier two, board at the pier.' },
      collocations: ['Pier two', 'the main pier', 'beside the pier'],
      example: { en: 'Boarding is at Pier two beside the fish market.', zh: '在鱼市旁的二号码头上船。' },
      listening: { zh: '单音节 /pɪə/，双元音 /ɪə/。', en: 'One syllable /pɪə/ with a glide /ɪə/.' },
    },
    {
      term: 'accessible', phonetic: '/əkˈsesəbl/', partOfSpeech: 'adj.', sentenceIndex: 11,
      meaning: { zh: '无障碍的，方便残障人士使用的', en: 'designed so people with disabilities can use it' },
      usage: { zh: '形容词；accessible seating、accessible access。名词 access。', en: 'Adjective: accessible seating, accessible access. The noun is access.' },
      collocations: ['accessible seating', 'accessible places', 'accessible booking'],
      example: { en: 'Accessible seating sits beside the ramp at the rear.', zh: '无障碍座位在后部坡道旁。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈses/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'refunded', phonetic: '/rɪˈfʌndɪd/', partOfSpeech: 'v.', sentenceIndex: 14,
      meaning: { zh: '退还（款项）', en: 'paid the money back to the customer' },
      usage: { zh: '过去分词；tickets are refunded、fully refunded。名词 refund。', en: 'Past participle: tickets are refunded, fully refunded. The noun is refund.' },
      collocations: ['fully refunded', 'the tickets are refunded', 'refunded in full'],
      example: { en: 'Cancelled trips have the tickets fully refunded.', zh: '取消的行程全额退还票款。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈfʌn/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'commentary', phonetic: '/ˈkɒməntri/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '讲解，现场解说', en: 'the spoken explanation given during a trip or event' },
      usage: { zh: '可数；guided commentary、recorded commentary。', en: 'Countable: guided commentary, recorded commentary.' },
      collocations: ['a guided commentary', 'the ticket includes commentary', 'short commentary'],
      example: { en: 'The ticket covers a short guided commentary.', zh: '票价包含一段简短讲解。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈkɒ/；结尾 /tri/。', en: 'Four syllables with first-syllable stress and a final /tri/.' },
    },
    {
      term: 'wheelchair', phonetic: '/ˈwiːltʃeə/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '轮椅', en: 'the seat on wheels used by people who cannot walk' },
      usage: { zh: '可数；passengers with a wheelchair、use a wheelchair。', en: 'Countable: passengers with a wheelchair, use a wheelchair.' },
      collocations: ['a wheelchair', 'passengers with a wheelchair', 'wheelchair access'],
      example: { en: 'Accessible seats are reserved for wheelchair users.', zh: '无障碍座位留给轮椅乘客。' },
      listening: { zh: '复合词 wheel + chair，重音在第一音节。', en: 'Compound wheel plus chair, stress on the first.' },
    },
    {
      term: 'assistance', phonetic: '/əˈsɪstəns/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '辅助，协助（如导盲犬）', en: 'help or support, often an assistance animal for a disability' },
      usage: { zh: '不可数；assistance animal、with assistance。动词 assist。', en: 'Uncountable: assistance animal, with assistance. The verb is assist.' },
      collocations: ['an assistance animal', 'registered assistance', 'assistance on board'],
      example: { en: 'Only registered assistance animals are accepted.', zh: '只接受登记的辅助动物。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsɪ/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'weather permitting', sentenceIndex: 17,
      meaning: { zh: '天气允许的话', en: 'if the weather stays suitable' },
      usage: { zh: '条件状语；weather permitting 放在句末，等于 if the weather permits。', en: 'A conditional adverbial, equivalent to if the weather permits.' },
      example: { en: 'Boats run every two hours, weather permitting.', zh: '天气允许的话船只每两小时一班。' },
    },
    {
      phrase: 'on a lead', sentenceIndex: 19,
      meaning: { zh: '牵着牵引绳', en: 'held by a leash attached to the animal' },
      usage: { zh: '介词短语；keep a dog on a lead、walk on a lead。', en: 'Prepositional phrase: keep a dog on a lead, walk on a lead.' },
      example: { en: 'Dogs must stay on a lead on the lower deck.', zh: '狗须牵绳待在下层甲板。' },
    },
    {
      phrase: 'called off', sentenceIndex: 13,
      meaning: { zh: '取消（行程）', en: 'to cancel an event or trip' },
      usage: { zh: 'call off 的被动；the trip is called off、call off the cruise。', en: 'Passive of call off: the trip is called off, call off the cruise.' },
      example: { en: 'The trip has to be called off in rough weather.', zh: '风浪天气行程只得取消。' },
    },
    {
      phrase: 'reserved for', sentenceIndex: 30,
      meaning: { zh: '预留给……', en: 'kept aside for a particular group of people' },
      usage: { zh: '被动；seats reserved for passengers、reserved for guests。', en: 'Passive: seats reserved for passengers, reserved for guests.' },
      example: { en: 'Accessible places are reserved for wheelchair users.', zh: '无障碍座位预留给轮椅乘客。' },
    },
    {
      phrase: 'counts heads', sentenceIndex: 36,
      meaning: { zh: '清点人数', en: 'to count how many people are on board' },
      usage: { zh: 'count heads 为固定说法；the crew counts heads、count heads before sailing。', en: 'Fixed phrase: the crew counts heads, count heads before sailing.' },
      example: { en: 'The crew counts heads before every departure.', zh: '每次开船前船员清点人数。' },
    },
    {
      phrase: 'reduced fare', sentenceIndex: 38,
      meaning: { zh: '优惠票价', en: 'a lower ticket price for a group such as children' },
      usage: { zh: '可数；pay a reduced fare、child reduced fare。', en: 'Countable: pay a reduced fare, child reduced fare.' },
      example: { en: 'Older children pay a reduced fare.', zh: '大龄儿童享优惠票价。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单题先分清时长与时刻', en: 'Split durations from times' },
      body: {
        zh: '第 1、5 题都和时间有关：three hours 是航程时长，every two hours 是发船间隔；句 7 的 ten、two 是时刻。听前在题号旁标注“多久”“隔多久”，避免把发船时刻填进时长空。',
        en: 'Items 1 and 5 both involve time: three hours is the duration, every two hours the interval; ten and two in sentence 7 are clock times. Label the gaps how long and how often before listening, so a departure time does not fill the duration gap.',
      },
    },
    {
      title: { zh: '规则题区分允许与禁止', en: 'Split allowed from banned rules' },
      body: {
        zh: '第 6 题问宠物规定。录音先讲允许的狗（on a lead、lower deck），再否定猫与其他宠物；听到 welcome、must、not accepted 时把对应对象归到允许或禁止一侧。',
        en: 'Item 6 asks the pet rule. The recording first allows dogs on a lead on the lower deck, then rejects cats and other pets. On welcome, must, or not accepted, place the animal on the allowed or banned side.',
      },
    },
    {
      title: { zh: '表格题回找题干预留词', en: 'In tables, use the printed lead words' },
      body: {
        zh: '第 8–10 题题干已印 guided、with a、phone or 等上下文。听到 commentary、wheelchair、email 时回勾紧邻题干，别把句中另一个名词（leaflet、phone）填进空内。',
        en: 'Items 8 to 10 print context such as guided, with a, and phone or. Match commentary, wheelchair and email to their nearest lead; do not write the other noun in the sentence, such as leaflet or phone.',
      },
    },
  ],
};
