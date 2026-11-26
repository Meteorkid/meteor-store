import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 39 · Part 2 — 市集组织者向摊主做开场说明。原创仿真材料，非官方真题。
 *
 * 独白按摊位抽签、用电申请、消防通道、布展撤展时间、收款方式推进，
 * 结尾把钥匙领取与撤展责任配对到对应人员。开场用议程提醒，不用 welcome to 句式。
 */
export const test39Part2: ListeningLesson = {
  slug: 'test-39-part-2',
  part: 2,
  status: 'published',
  title: { zh: '手作市集组织说明', en: 'Briefing craft fair organisers' },
  summary: {
    zh: '市集负责人向摊主说明安排：摊位在周五下午随机抽签分配，用电申请须在周三前提交，两处消防通道全程保持畅通，周六上午八点可布展、周日晚六点后撤展；抽签到场前须登记产品类型，标准摊位可用一千瓦电力，收款优先走市集共享刷卡系统。结尾把钥匙领取与撤展责任配对到场馆管理员和摊主本人。',
    en: 'The organiser briefs exhibitors: stalls are drawn randomly Friday afternoon, power applications are due Wednesday, the two fire exits stay clear, setup opens eight Saturday morning, teardown after six Sunday evening. Exhibitors register their type before the draw, a standard stall uses one thousand watts, and cards go through the fair system. Keys go to the caretaker, takedown to each owner.',
  },
  accent: { zh: '负责人为澳式口音，语速中等。', en: 'The organiser has an Australian accent and speaks at a moderate pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'organiser', label: 'ORGANISER', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Stalls chosen by a random', cells: [[{ blank: 11 }]] },
        { lead: 'Electricity applications due on', cells: [[{ blank: 12 }]] },
        { lead: 'The two fire', cells: [[{ blank: 13 }, { text: ' must stay clear' }]] },
        { lead: 'Breakdown allowed after', cells: [[{ blank: 14 }, { text: ' pm' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What must exhibitors do before the draw?',
          options: [
            { key: 'A', text: 'register their product type' },
            { key: 'B', text: 'bring their own tables and chairs' },
            { key: 'C', text: 'confirm their public liability insurance' },
          ],
        },
        {
          number: 16,
          stem: 'How much power may a standard stall use?',
          options: [
            { key: 'A', text: 'five hundred watts' },
            { key: 'B', text: 'one thousand watts' },
            { key: 'C', text: 'two thousand watts' },
          ],
        },
        {
          number: 17,
          stem: 'What is the rule for the fire exits?',
          options: [
            { key: 'A', text: 'they may hold spare stock overnight' },
            { key: 'B', text: 'they must be kept free at all times' },
            { key: 'C', text: 'they lead through to the public car park' },
          ],
        },
        {
          number: 18,
          stem: 'How does the fair prefer exhibitors to take payment?',
          options: [
            { key: 'A', text: 'cash kept in a separate personal tin' },
            { key: 'B', text: 'card payments through the fair system' },
            { key: 'C', text: 'personal cheques given to the coordinator' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which person handles each task? Choose the correct letter, A–D.',
      options: [
        { key: 'A', text: 'the fair coordinator' },
        { key: 'B', text: 'the volunteer team' },
        { key: 'C', text: 'the venue caretaker' },
        { key: 'D', text: 'each stall owner' },
      ],
      items: [
        { number: 19, text: 'Hands over the stall keys on arrival' },
        { number: 20, text: 'Takes down the own display at closing' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['draw'], evidence: 4,
      explanation: {
        zh: '定位句 4：Stalls are chosen by a random draw on Friday afternoon。摊位按随机抽签分配，填 draw。句 3 提到的 size 和 arrival time 是被排除的分配方式。',
        en: 'Sentence 4: "Stalls are chosen by a random draw on Friday afternoon". Allocation follows a random draw, so write draw. Size and arrival time in sentence 3 are the methods that were ruled out.',
      },
    },
    {
      number: 12, accepted: ['Wednesday'], evidence: 7,
      explanation: {
        zh: '定位句 7：you must send an electricity application to the office by Wednesday。用电申请截止周三；句 4 的 Friday 是抽签日，不是申请截止日。',
        en: 'Sentence 7: "you must send an electricity application to the office by Wednesday". Applications are due Wednesday; Friday in sentence 4 is the draw day, not the application deadline.',
      },
    },
    {
      number: 13, accepted: ['exits'], evidence: 12,
      explanation: {
        zh: '定位句 12：The two fire exits at the back of the hall must be kept free at all times。消防通道即两处出口，填 exits；aisle 是中央过道，不是消防门。',
        en: 'Sentence 12: "The two fire exits at the back of the hall must be kept free at all times". The fire exits are the two doors at the back, so write exits. The aisle is the central walkway, not the fire doors.',
      },
    },
    {
      number: 14, accepted: ['six', '6'], evidence: 18,
      explanation: {
        zh: '定位句 18：Teardown does not start until after six in the evening on Sunday。撤展晚六点后开始；句 36 的 five 是周日闭店时间，不是撤展时间。',
        en: 'Sentence 18: "Teardown does not start until after six in the evening on Sunday". Takedown begins after six; five in sentence 36 is the Sunday closing time, not the teardown hour.',
      },
    },
    {
      number: 15, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：Before the draw, please register your product type with the fair coordinator。抽签前先登记产品类型，对应 A。桌椅自带与保险确认在全段没有提到。',
        en: 'Sentence 21: "Before the draw, please register your product type with the fair coordinator". The pre-draw step is registering the product type, matching A. Bringing tables and insurance confirmation are never mentioned.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：A standard stall may draw one thousand watts from the wall sockets。标准摊位可用一千瓦，对应 B。五百与两千瓦在录音中没有依据。',
        en: 'Sentence 23: "A standard stall may draw one thousand watts from the wall sockets". A standard stall allows one thousand watts, matching B. Five hundred and two thousand watts have no basis.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：the two fire exits must be kept free at all times。消防通道任何时候都不得占用，对应 B。句 13 明确否定在门前存货；通往停车场是编造的干扰项。',
        en: 'Sentence 25: "the two fire exits must be kept free at all times". The exits must stay free throughout, matching B. Storage in front of the doors is rejected in sentence 13, and a route to the car park is a made-up distractor.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：The fair prefers card payments through the fair’s own payment system。收款优先走市集刷卡系统，对应 B。个人钱罐与支票在句 27、28 被排除。',
        en: 'Sentence 26: "The fair prefers card payments through the fair’s own payment system". Preferred payment goes through the fair card system, matching B. A personal tin and cheques are ruled out in sentences 27 and 28.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 30,
      explanation: {
        zh: '定位句 30：Keys for the back door are held by the caretaker, who hands them over when you arrive。钥匙由场馆管理员保管并在到场时交接，对应 C。协调员负责登记与通知，志愿者只协助搬运。',
        en: 'Sentence 30: "Keys for the back door are held by the caretaker, who hands them over when you arrive". The caretaker holds and hands over the keys, matching C. The coordinator handles registration and notices, and volunteers only help with lifting.',
      },
    },
    {
      number: 20, accepted: ['D'], evidence: 31,
      explanation: {
        zh: '定位句 31：At closing, each stall owner is responsible for taking down their own display。撤展由摊主本人负责，对应 D。志愿者在句 32 只帮忙搬重家具，不替人收展。',
        en: 'Sentence 31: "At closing, each stall owner is responsible for taking down their own display". Takedown is the stall owner’s duty, matching D. Volunteers in sentence 32 only help carry heavy furniture and do not pack away the goods.',
      },
    },
  ],
  transcript: [
    { speaker: 'organiser', text: 'Before you set up your stalls, there are five points I need to run through with you this evening.' },
    { speaker: 'organiser', text: 'We are holding the fair in the town hall over the weekend, and every exhibitor has a handout.' },
    { speaker: 'organiser', text: 'First, the allocation of stall spaces.' },
    { speaker: 'organiser', text: 'You may have noticed we do not assign spots by size or by arrival time.' },
    { speaker: 'organiser', text: 'Stalls are chosen by a random draw on Friday afternoon, once every exhibitor has registered.' },
    { speaker: 'organiser', text: 'The draw itself takes fifteen minutes, and the volunteer team will call out each number in turn.' },
    { speaker: 'organiser', text: 'Next, electricity and the safety rules around your stalls.' },
    { speaker: 'organiser', text: 'If you need more than the standard allowance, you must send an electricity application to the office by Wednesday.' },
    { speaker: 'organiser', text: 'The application should list your appliance, its wattage and the name of the person in charge.' },
    { speaker: 'organiser', text: 'We cannot supply extension leads from the stage side, so bring your own heavy-duty cable if needed.' },
    { speaker: 'organiser', text: 'Please do not run cables across the central aisle where visitors will walk.' },
    { speaker: 'organiser', text: 'Now the safety rules, which the venue caretaker takes very seriously.' },
    { speaker: 'organiser', text: 'The two fire exits at the back of the hall must be kept free at all times.' },
    { speaker: 'organiser', text: 'You may not store boxes, furniture or spare stock in front of those doors, even overnight.' },
    { speaker: 'organiser', text: 'The central aisle also stays clear, so people can reach the exits quickly in an emergency.' },
    { speaker: 'organiser', text: 'The caretaker checks the exits each morning before the doors open to the public.' },
    { speaker: 'organiser', text: 'Arrival and breakdown times matter for everyone involved.' },
    { speaker: 'organiser', text: 'Stalls may be set up from eight in the morning on Saturday, before the fair opens at ten.' },
    { speaker: 'organiser', text: 'Teardown does not start until after six in the evening on Sunday.' },
    { speaker: 'organiser', text: 'We ask you to leave your table in the state you found it, with no tape left on the floor.' },
    { speaker: 'organiser', text: 'Before I open the floor to questions, a few operational details.' },
    { speaker: 'organiser', text: 'Before the draw, please register your product type with the fair coordinator at the front desk.' },
    { speaker: 'organiser', text: 'That lets us separate food stalls from craft stalls, so the tables do not sit next to each other by accident.' },
    { speaker: 'organiser', text: 'A standard stall may draw one thousand watts from the wall sockets.' },
    { speaker: 'organiser', text: 'Anything above that needs the application form, and cables must sit behind the tables.' },
    { speaker: 'organiser', text: 'To repeat the safety point, the two fire exits must be kept free at all times.' },
    { speaker: 'organiser', text: 'Finally, money. The fair prefers card payments through the fair’s own payment system.' },
    { speaker: 'organiser', text: 'Cash is still accepted, but we ask that you ring it up on the shared reader rather than keep a separate tin.' },
    { speaker: 'organiser', text: 'Personal cheques cannot be accepted this year, and neither can overseas cards that do not work in the local system.' },
    { speaker: 'organiser', text: 'If a customer pays by card, the receipt prints on the shared reader, and you keep the copy.' },
    { speaker: 'organiser', text: 'Keys for the back door are held by the caretaker, who hands them over when you arrive.' },
    { speaker: 'organiser', text: 'At closing, each stall owner is responsible for taking down their own display.' },
    { speaker: 'organiser', text: 'The volunteer team can help carry heavy furniture, but they do not pack away your goods.' },
    { speaker: 'organiser', text: 'Before the weekend starts, let me recap the timetable for the hall.' },
    { speaker: 'organiser', text: 'On Friday afternoon registration closes, and then the stall draw is held in the main hall.' },
    { speaker: 'organiser', text: 'On Saturday morning setup starts at eight, doors open at ten, and the fair runs until six.' },
    { speaker: 'organiser', text: 'On Sunday doors open at eleven, the fair closes at five, and breakdown follows after six.' },
    { speaker: 'organiser', text: 'Food stalls must keep their surfaces clean, and any waste goes in the marked bins outside.' },
    { speaker: 'organiser', text: 'Craft stalls should price every item, because visitors do not always ask before buying.' },
    { speaker: 'organiser', text: 'If you spot a visitor who needs help, direct them to the information desk near the entrance.' },
    { speaker: 'organiser', text: 'Lost property goes to the same desk, and any first-aid issues go to the volunteer in the yellow vest.' },
    { speaker: 'organiser', text: 'The hall has a small kitchen for organisers, but no cooking may be done outside the food zone.' },
    { speaker: 'organiser', text: 'Parking behind the hall is for exhibitors only, and visitors use the public car park on the next street.' },
    { speaker: 'organiser', text: 'The coordinator will send a summary email tomorrow with the timetable and the contact numbers.' },
    { speaker: 'organiser', text: 'If anything changes over the weekend, tell the coordinator before you rearrange your stall.' },
    { speaker: 'organiser', text: 'Enjoy the fair, and look out for each other during the busy hours.' },
  ],
  vocabulary: [
    {
      term: 'draw', phonetic: '/drɔː/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '抽签，随机抽取', en: 'a random selection used to allocate spaces or numbers' },
      usage: { zh: '可数；a random draw、the stall draw。动词 draw 表抽取。', en: 'Countable: a random draw, the stall draw. The verb is draw.' },
      collocations: ['a random draw', 'the stall draw', 'the draw takes fifteen minutes'],
      example: { en: 'Stalls are chosen by a random draw on Friday afternoon.', zh: '摊位在周五下午随机抽签分配。' },
      listening: { zh: '单音节，长元音 /ɔː/，与 drawer（抽屉）区分。', en: 'One syllable with /ɔː/; do not confuse with drawer.' },
    },
    {
      term: 'exhibitor', phonetic: '/ɪɡˈzɪbɪtə/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '参展摊主，参展者', en: 'a person who shows and sells goods at a fair or exhibition' },
      usage: { zh: '可数；every exhibitor、exhibitor registration。动词 exhibit。', en: 'Countable: every exhibitor, exhibitor registration. The verb is exhibit.' },
      collocations: ['every exhibitor', 'the exhibitor list', 'an exhibitor stall'],
      example: { en: 'Every exhibitor receives a handout with the fair rules.', zh: '每位摊主都会拿到一份规则说明。' },
      listening: { zh: '五个音节，重音在第二音节 /ˈzɪb/。', en: 'Five syllables with stress on the second.' },
    },
    {
      term: 'application', phonetic: '/ˌæplɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '申请（表格或请求）', en: 'a formal request submitted before a deadline' },
      usage: { zh: '可数；electricity application、send an application。动词 apply。', en: 'Countable: electricity application, send an application. The verb is apply.' },
      collocations: ['send an application', 'the application form', 'the application due'],
      example: { en: 'The electricity application must reach the office by Wednesday.', zh: '用电申请须在周三前送到办公室。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈkeɪ/；-tion 读 /ʃn/。', en: 'Four syllables with stress on the third; -tion is /ʃn/.' },
    },
    {
      term: 'wattage', phonetic: '/ˈwɒtɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '功率（瓦数）', en: 'the amount of electrical power an appliance uses, measured in watts' },
      usage: { zh: '不可数；list the wattage、one thousand watts。', en: 'Uncountable: list the wattage, one thousand watts.' },
      collocations: ['the appliance wattage', 'the wattage limit', 'list the wattage'],
      example: { en: 'The application should list the wattage of each appliance.', zh: '申请上要列明每件电器的功率。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 -age 弱读 /ɪdʒ/。', en: 'Two syllables with stress on the first; the ending -age is /ɪdʒ/.' },
    },
    {
      term: 'extension leads', phonetic: '/ɪkˈstenʃn liːdz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '延长线，拖线板电源线', en: 'long cables that stretch the reach of a wall socket' },
      usage: { zh: '可数复数；supply extension leads、bring your own cable。', en: 'Countable plural: supply extension leads, bring your own cable.' },
      collocations: ['extension leads', 'bring extension leads', 'a heavy-duty cable'],
      example: { en: 'The centre does not supply extension leads from the stage side.', zh: '场地不提供舞台一侧的延长线。' },
      listening: { zh: 'extension 三个音节重音在第二音节；leads 结尾 /dz/。', en: 'Extension stresses the second syllable; leads ends in /dz/.' },
    },
    {
      term: 'teardown', phonetic: '/ˈteədaʊn/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '撤展，拆除布置', en: 'the act of taking down displays and packing away after an event' },
      usage: { zh: '可数或不可数；the teardown time、start teardown。短语动词是 tear down。', en: 'Countable or uncountable: the teardown time. The phrasal verb is tear down.' },
      collocations: ['the teardown time', 'start teardown', 'after the fair'],
      example: { en: 'Teardown does not start until after six in the evening.', zh: '撤展要到晚六点之后才开始。' },
      listening: { zh: '复合词，重音在第一音节；tear 此处读 /teə/，不读 /tɪə/。', en: 'Compound with stress on the first; tear here is /teə/, not /tɪə/.' },
    },
    {
      term: 'coordinator', phonetic: '/kəʊˈɔːdɪneɪtə/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '协调员，现场负责人', en: 'the person who organises schedules, registration and contacts for the fair' },
      usage: { zh: '可数；fair coordinator、contact the coordinator。动词 coordinate。', en: 'Countable: fair coordinator, contact the coordinator. The verb is coordinate.' },
      collocations: ['the fair coordinator', 'the coordinator sends', 'the coordinator at the desk'],
      example: { en: 'Register your product type with the fair coordinator.', zh: '向市集协调员登记产品类型。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈdɪ/；结尾 /ə/。', en: 'Five syllables with stress on the third; ending /ə/.' },
    },
  ],
  expressions: [
    {
      phrase: 'run through', sentenceIndex: 0,
      meaning: { zh: '逐条讲一遍，过一遍安排', en: 'to explain a set of rules or plans item by item' },
      usage: { zh: '及物短语动词；run through the points、run through the timetable。', en: 'Transitive: run through the points, run through the timetable.' },
      example: { en: 'I need to run through five points with you this evening.', zh: '今晚我需要和你们过一遍五点安排。' },
    },
    {
      phrase: 'by accident', sentenceIndex: 22,
      meaning: { zh: '不小心，无意中', en: 'without intending to; by chance' },
      usage: { zh: '状语；do not sit next to each other by accident。', en: 'Adverbial: sit next to each other by accident.' },
      example: { en: 'We separate food and craft stalls so they do not mix by accident.', zh: '我们把餐饮与手作摊位分开，避免无意混在一起。' },
    },
    {
      phrase: 'ring it up', sentenceIndex: 27,
      meaning: { zh: '把款项录入收款机', en: 'to record a sale on a till or card reader' },
      usage: { zh: '可分短语动词；ring up the cash、ring up the sale。', en: 'Separable: ring up the cash, ring up the sale.' },
      example: { en: 'Please ring up cash on the shared reader.', zh: '现金请录到共享收款机上。' },
    },
    {
      phrase: 'taking down', sentenceIndex: 31,
      meaning: { zh: '拆下（展位布置）', en: 'to remove and pack a display after the event' },
      usage: { zh: '可分短语动词；take down the display、take the stall down。', en: 'Separable: take down the display, take the stall down.' },
      example: { en: 'Each owner takes down their own display at closing.', zh: '闭展时摊主本人拆下自己的展位。' },
    },
    {
      phrase: 'pack away', sentenceIndex: 32,
      meaning: { zh: '收好，装箱打包', en: 'to put goods and furniture back into boxes or storage' },
      usage: { zh: '可分短语动词；pack away the goods、pack the stall away。', en: 'Separable: pack away the goods, pack the stall away.' },
      example: { en: 'Volunteers do not pack away your goods for you.', zh: '志愿者不会替你把货物收好。' },
    },
    {
      phrase: 'look out for', sentenceIndex: 45,
      meaning: { zh: '留意照应，照顾', en: 'to watch over and be helpful to people nearby' },
      usage: { zh: '后接人；look out for each other、look out for visitors。', en: 'Follow with people: look out for each other.' },
      example: { en: 'Look out for each other during the busy hours.', zh: '繁忙时段大家互相照应。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白按议程顺序跟题', en: 'Follow the agenda order' },
      body: {
        zh: 'Part 2 题目顺序与讲解顺序一致：先抽签与申请，再消防与时间，后收款与配对。听到 first、next、now、finally 时核对自己填到哪一题，避免把后面的收款细节提前记到用电空里。',
        en: 'Part 2 items follow the speaking order: the draw and application first, then safety and times, then payment and matching. Check your place when you hear first, next, now and finally, so later payment details are not written into an electricity gap.',
      },
    },
    {
      title: { zh: '配对题先记角色再记动作', en: 'For matching, note the role first' },
      body: {
        zh: '第 19、20 题把任务配对到人员。听前先把四个角色译成自己的话：协调员管登记通知，志愿者管搬运，管理员管钥匙，摊主管自己的展位；听到 hands over keys 与 takes down display 直接勾对应字母。',
        en: 'Items 19 and 20 match tasks to people. Translate the four roles first: the coordinator handles notices, volunteers lift things, the caretaker keeps keys, and the owner minds their own stall. Match hands over keys and takes down display to the right letter.',
      },
    },
    {
      title: { zh: '数字题区分瓦数与时刻', en: 'Separate watts from times' },
      body: {
        zh: '第 14 题问撤展时刻，第 16 题问允许功率，两句都带数字但语义不同。听前在题号旁标注“几点”还是“多少瓦”；one thousand watts 是功率，six in the evening 是时刻，不要互换。',
        en: 'Item 14 asks the teardown time and item 16 the allowed power; both carry numbers but mean different things. Mark time versus watts beside each question: one thousand watts is power, six in the evening is a time, and they cannot be swapped.',
      },
    },
  ],
};
