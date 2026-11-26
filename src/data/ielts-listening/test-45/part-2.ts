import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 45 · Part 2 — 有轨电车博物馆讲解（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白前半段按线路历史、车辆修复、驾驶体验、票价与团体预约展开，对应五道单选；
 * 后半段补充路线位置、车间楼层、体验时长、票价与团体人数，对应五道笔记填空。
 */
export const test45Part2: ListeningLesson = {
  slug: 'test-45-part-2',
  part: 2,
  status: 'published',
  title: { zh: '有轨电车博物馆讲解', en: 'A talk at a tram museum' },
  summary: {
    zh: '讲解员在有轨电车博物馆开场：回顾老线路当年服务码头与集市的历史，介绍车辆手工修复的方式、静态驾驶体验的内容、标准票包含的项目，以及团体预约的人数与提前量。',
    en: 'A guide opens a tram museum talk: the old line once served the docks and markets, vehicles are restored by hand, the driving experience uses a static cab, a standard ticket covers the hall, gallery and film, and group bookings need eight or more people reserved ahead.',
  },
  accent: { zh: '讲解员为加拿大口音，语速中等偏快，术语会重复。', en: 'The guide has a Canadian accent, speaks fairly quickly and repeats key terms.' },
  speechRate: '+5%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 11,
          stem: 'What was the original tram line mainly used for?',
          options: [
            { key: 'A', text: 'carrying dock workers and market traders' },
            { key: 'B', text: 'tourists visiting the old harbour bridges' },
            { key: 'C', text: 'school children travelling to suburban stops' },
          ],
        },
        {
          number: 12,
          stem: 'How are the museum vehicles restored?',
          options: [
            { key: 'A', text: 'by a small team working by hand with old parts' },
            { key: 'B', text: 'by replacing every panel with modern plastic' },
            { key: 'C', text: 'by sending the cars abroad for painting' },
          ],
        },
        {
          number: 13,
          stem: 'What can visitors do in the driving experience?',
          options: [
            { key: 'A', text: 'drive a car along the museum track' },
            { key: 'B', text: 'steer a static cab and ring the bell' },
            { key: 'C', text: 'test the brakes on a moving trailer' },
          ],
        },
        {
          number: 14,
          stem: 'What does a standard museum ticket cover?',
          options: [
            { key: 'A', text: 'the hall, the workshop gallery and a short film' },
            { key: 'B', text: 'a private volunteer talk for each party' },
            { key: 'C', text: 'free entry to the cafe and shop area' },
          ],
        },
        {
          number: 15,
          stem: 'What is required for a group booking?',
          options: [
            { key: 'A', text: 'ten or more people booked on the day' },
            { key: 'B', text: 'eight or more people reserved a week ahead' },
            { key: 'C', text: 'a deposit paid in cash at the entrance' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Original route ran along the', cells: [[{ blank: 16 }, { text: ' beside the harbour wall' }]] },
        { lead: 'Restoration workshop on the', cells: [[{ blank: 17 }, { text: ' floor' }]] },
        { lead: 'Driving session lasts', cells: [[{ blank: 18 }, { text: ' minutes' }]] },
        { lead: 'Adult ticket costs', cells: [[{ blank: 19 }, { text: ' dollars' }]] },
        { lead: 'Group booking needs', cells: [[{ blank: 20 }, { text: ' people or more' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['A'], evidence: 8,
      explanation: {
        zh: '定位句 8：It carried dock workers and market traders along the harbour route。线路主要服务码头工人和集市商贩，对应 A。B 的观光游客、C 的郊区学童全段没有提到。',
        en: 'Sentence 8: "It carried dock workers and market traders along the harbour route". The line served dock workers and traders, matching A. Tourists in B and suburban school children in C are never mentioned.',
      },
    },
    {
      number: 12, accepted: ['A'], evidence: 10,
      explanation: {
        zh: '定位句 10：A small team restores each vehicle by hand, using parts from old stock。修复靠小团队手工完成、使用旧库存零件，对应 A。B 的现代塑料面板、C 的送出国喷漆都与原文相反。',
        en: 'Sentence 10: "A small team restores each vehicle by hand, using parts from old stock". A small hand team uses old parts, matching A. Modern plastic panels in B and overseas painting in C contradict the recording.',
      },
    },
    {
      number: 13, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：Under supervision, visitors steer a static cab and ring the original bell。体验是在静态驾驶室里握方向盘、摇铃，对应 B。句 14 明确否定开上轨道，A 错；C 的移动拖车试车没有提到。',
        en: 'Sentence 13: "Under supervision, visitors steer a static cab and ring the original bell". Visitors steer a static cab and ring the bell, matching B. Sentence 14 rules out driving on the track, and a moving trailer test in C is not mentioned.',
      },
    },
    {
      number: 14, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：It covers the hall, the workshop viewing gallery and a short film about the line。标准票含展厅、车间观景廊和短片，对应 A。B 的私人讲解、C 的餐饮区免费都不在票内。',
        en: 'Sentence 16: "It covers the hall, the workshop viewing gallery and a short film about the line". The ticket covers the hall, gallery and film, matching A. A private talk in B and free cafe entry in C are not included.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：The group booking rule applies to parties of eight or more, booked a week ahead。团体需八人以上并提前一周预约，对应 B。A 把人数说成十人且当天预订，C 的现金押金全段未提。',
        en: 'Sentence 17: "The group booking rule applies to parties of eight or more, booked a week ahead". Groups need eight or more, reserved a week ahead, matching B. A says ten booked on the day, and a cash deposit in C is never mentioned.',
      },
    },
    {
      number: 16, accepted: ['riverside'], evidence: 19,
      explanation: {
        zh: '定位句 19：The original route ran along the riverside beside the old harbour wall。线路沿海滨河边走，空格后已有 beside the harbour wall，答案填 riverside。',
        en: 'Sentence 19: "The original route ran along the riverside beside the old harbour wall". The route ran along the riverside; beside the harbour wall already follows the gap, so write riverside.',
      },
    },
    {
      number: 17, accepted: ['ground'], evidence: 20,
      explanation: {
        zh: '定位句 20：The restoration workshop sits on the ground floor, behind the glass screen。车间在一楼，ground floor 是固定搭配；注意不要写成 first floor。',
        en: 'Sentence 20: "The restoration workshop sits on the ground floor, behind the glass screen". The workshop is on the ground floor; do not write first floor, which means the next level up.',
      },
    },
    {
      number: 18, accepted: ['30', 'thirty'], spoken: 'thirty', evidence: 21,
      explanation: {
        zh: '定位句 21：The driving experience session lasts thirty minutes in the old tram cab。体验时长三十分钟；空格后已有 minutes，只填 thirty。',
        en: 'Sentence 21: "The driving experience session lasts thirty minutes in the old tram cab". The session lasts thirty minutes; minutes already follows the gap, so write only thirty.',
      },
    },
    {
      number: 19, accepted: ['12', 'twelve'], spoken: 'twelve', evidence: 22,
      explanation: {
        zh: '定位句 22：An adult ticket costs twelve dollars, with no extra charge for the film。成人票十二美元，短片不另收费；句 30 的 under ten free 是儿童政策，不是成人票价。',
        en: 'Sentence 22: "An adult ticket costs twelve dollars, with no extra charge for the film". The adult ticket is twelve dollars and the film is free. The under ten free policy in sentence 30 applies to children, not adults.',
      },
    },
    {
      number: 20, accepted: ['8', 'eight'], spoken: 'eight', evidence: 23,
      explanation: {
        zh: '定位句 23：A group of eight or more can reserve a guided slot by phone or email。团体门槛是八人以上；句 17 的 eight 与本句一致，不要写成单选干扰项里的 ten。',
        en: 'Sentence 23: "A group of eight or more can reserve a guided slot by phone or email". The threshold is eight or more, matching sentence 17; do not write ten, the distractor in the single choice.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Before we set off around the museum, a few things will make your visit easier to follow.' },
    { speaker: 'guide', text: 'I am Liam, your guide today, and we will keep to the main exhibition hall first.' },
    { speaker: 'guide', text: 'The collection traces the old city tram line that once served the harbour district.' },
    { speaker: 'guide', text: 'In its early years the line carried workers to the docks and the fish markets.' },
    { speaker: 'guide', text: 'The route closed in the nineteen fifties, when buses took over most services.' },
    { speaker: 'guide', text: 'The museum keeps six original cars, each with its own route number painted on the side.' },
    { speaker: 'guide', text: 'Now a few questions about what you will see in the main hall.' },
    { speaker: 'guide', text: 'What was the original tram line mainly used for?' },
    { speaker: 'guide', text: 'It carried dock workers and market traders along the harbour route.' },
    { speaker: 'guide', text: 'How are the museum vehicles looked after between open days?' },
    { speaker: 'guide', text: 'A small team restores each vehicle by hand, using parts from old stock.' },
    { speaker: 'guide', text: 'The wooden panels are treated for rot, and the windows are reglazed where cracked.' },
    { speaker: 'guide', text: 'What can visitors try in the driving experience at the far end of the hall?' },
    { speaker: 'guide', text: 'Under supervision, visitors steer a static cab and ring the original bell.' },
    { speaker: 'guide', text: 'They do not take the car onto the track, and no driving licence is needed.' },
    { speaker: 'guide', text: 'What does a standard museum ticket cover?' },
    { speaker: 'guide', text: 'It covers the hall, the workshop viewing gallery and a short film about the line.' },
    { speaker: 'guide', text: 'The group booking rule applies to parties of eight or more, booked a week ahead.' },
    { speaker: 'guide', text: 'Now the notes that follow, so keep these details in mind.' },
    { speaker: 'guide', text: 'The original route ran along the riverside beside the old harbour wall.' },
    { speaker: 'guide', text: 'The restoration workshop sits on the ground floor, behind the glass screen.' },
    { speaker: 'guide', text: 'The driving experience session lasts thirty minutes in the old tram cab.' },
    { speaker: 'guide', text: 'An adult ticket costs twelve dollars, with no extra charge for the film.' },
    { speaker: 'guide', text: 'A group of eight or more can reserve a guided slot by phone or email.' },
    { speaker: 'guide', text: 'The timetable runs from ten in the morning until five in the afternoon.' },
    { speaker: 'guide', text: 'Volunteers give short talks by the oldest car at quarter past each hour.' },
    { speaker: 'guide', text: 'The cafe near the exit sells tram shaped biscuits and old route prints.' },
    { speaker: 'guide', text: 'Shoes should be flat, as some sections of the platform are uneven.' },
    { speaker: 'guide', text: 'Photography is allowed in the hall, but not inside the restored cabs.' },
    { speaker: 'guide', text: 'The shop stocks reproductions of the old timetable posters.' },
    { speaker: 'guide', text: 'Children under ten visit free when accompanied by an adult.' },
    { speaker: 'guide', text: 'The accessible entrance is around the side of the building, by the cycle rack.' },
    { speaker: 'guide', text: 'Lost property from last season is kept at the front desk all month.' },
    { speaker: 'guide', text: 'Today our group will turn left into the hall in about a minute.' },
    { speaker: 'guide', text: 'The first exhibit explains how the cable system pulled the early cars.' },
    { speaker: 'guide', text: 'Notice the wooden seat backs, which were rebuilt from the original pattern.' },
    { speaker: 'guide', text: 'A brake demonstration runs at twenty past each hour near the track.' },
    { speaker: 'guide', text: 'The driver uniform on display belonged to a conductor from nineteen forty nine.' },
    { speaker: 'guide', text: 'Most restoration tools on show were used in the original workshops.' },
    { speaker: 'guide', text: 'Please stay with the group as we cross the busy concrete floor.' },
    { speaker: 'guide', text: 'The volunteer in the blue jacket can answer questions about the engines.' },
    { speaker: 'guide', text: 'We will pause by the model layout before moving to the driving cab.' },
    { speaker: 'guide', text: 'The model shows the harbour line as it looked before the closure.' },
    { speaker: 'guide', text: 'Any questions before we enter the main exhibition space?' },
    { speaker: 'guide', text: 'No, then please follow me through the doorway on the left.' },
  ],
  vocabulary: [
    {
      term: 'route', phonetic: '/ruːt/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '线路，路线', en: 'the path along which a vehicle regularly travels' },
      usage: { zh: '可数名词；tram route、harbour route、route number。', en: 'Countable: a tram route, a harbour route, a route number.' },
      collocations: ['the original route', 'the harbour route', 'the route closed'],
      example: { en: 'The old tram route ran beside the harbour wall.', zh: '老电车线路沿海滨墙走。' },
      listening: { zh: '单音节，长元音 /ruːt/，不要读成 rowte。', en: 'One syllable with the long vowel /ruːt/, not rowte.' },
    },
    {
      term: 'restoration', phonetic: '/ˌrestəˈreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '修复，复原', en: 'the work of repairing an old object to its original condition' },
      usage: { zh: '不可数名词；动词 restore，形容词 restored；restoration workshop 是修复车间。', en: 'Uncountable; verb restore, adjective restored. A restoration workshop restores old vehicles.' },
      collocations: ['the restoration workshop', 'vehicle restoration', 'restore by hand'],
      example: { en: 'The restoration workshop is on the ground floor.', zh: '修复车间在一楼。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈreɪ/，开头 rest 弱读。', en: 'Four syllables with stress on the third; the opening rest is weak.' },
    },
    {
      term: 'static', phonetic: '/ˈstætɪk/', partOfSpeech: 'adj.', sentenceIndex: 13,
      meaning: { zh: '静态的，不动的', en: 'not moving; fixed in one place' },
      usage: { zh: '此处 static cab 指固定不动的模拟驾驶室，与跑在轨道上的实车相对。', en: 'Here a static cab is a fixed simulator, as opposed to a car running on the track.' },
      collocations: ['a static cab', 'a static display', 'static position'],
      example: { en: 'Visitors steer a static cab in the driving experience.', zh: '体验中游客在静态驾驶室里握方向盘。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈstæ/，短元音。', en: 'Two syllables with first-syllable stress and a short vowel.' },
    },
    {
      term: 'supervision', phonetic: '/ˌsuːpəˈvɪʒn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '监督，指导看护', en: 'the act of watching over somebody to keep them safe' },
      usage: { zh: '不可数；under supervision 表示在专人看护下，反义无监督为 unsupervised。', en: 'Uncountable. Under supervision means watched over; the opposite is unsupervised.' },
      collocations: ['under supervision', 'close supervision', 'staff supervision'],
      example: { en: 'Visitors try the cab only under supervision.', zh: '游客只能在专人看护下试用驾驶室。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈvɪ/，前两音节连读。', en: 'Four syllables with stress on the third; the first two blend together.' },
    },
    {
      term: 'gallery', phonetic: '/ˈɡæləri/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '廊，观景廊，展厅', en: 'an open room or raised walkway used to view exhibits' },
      usage: { zh: '可数名词；viewing gallery 指隔着玻璃看车间的观景廊，art gallery 是美术馆。', en: 'Countable. A viewing gallery overlooks a workshop through glass; an art gallery shows paintings.' },
      collocations: ['the viewing gallery', 'the workshop gallery', 'a side gallery'],
      example: { en: 'The ticket includes access to the workshop gallery.', zh: '门票含车间观景廊参观。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈɡæ/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'reserve', phonetic: '/rɪˈzɜːv/', partOfSpeech: 'v.', sentenceIndex: 23,
      meaning: { zh: '预订，预留', en: 'to book a place or slot ahead of time' },
      usage: { zh: '及物动词；reserve a slot、reserve a place，名词 reservation。', en: 'Transitive: reserve a slot, reserve a place; the noun is reservation.' },
      collocations: ['reserve a guided slot', 'reserve ahead', 'book and reserve'],
      example: { en: 'Groups of eight or more can reserve a slot by email.', zh: '八人以上团体可邮件预约场次。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈzɜːv/，结尾 /v/ 清晰。', en: 'Two syllables with stress on the second; the final /v/ is clear.' },
    },
    {
      term: 'reproductions', phonetic: '/ˌriːprəˈdʌkʃnz/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '复制品，复刻品', en: 'an exact copy of an old poster, painting or object' },
      usage: { zh: '可数名词；此处指旧海报复刻品，不是“繁殖”义。动词 reproduce。', en: 'Countable: copied posters or objects; here it is not the biological sense. The verb is reproduce.' },
      collocations: ['reproductions of posters', 'an old reproduction', 'copy and reproduction'],
      example: { en: 'The shop sells reproductions of old timetable posters.', zh: '商店卖旧时刻表海报的复刻品。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈdʌk/。', en: 'Four syllables with stress on the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'set off', sentenceIndex: 0,
      meaning: { zh: '出发，动身', en: 'to begin a walk or tour around a place' },
      usage: { zh: '短语动词；set off around the museum 指开始参观行程，后接地点。', en: 'Phrasal verb: set off around the museum means start the tour around it.' },
      example: { en: 'We will set off around the museum in a minute.', zh: '我们马上开始参观博物馆。' },
    },
    {
      phrase: 'took over', sentenceIndex: 4,
      meaning: { zh: '接管，取代（线路服务）', en: 'to take control of a service that something else used to run' },
      usage: { zh: '此处 buses took over most services 指巴士取代电车承担客运。', en: 'Here buses took over most services means buses replaced the trams.' },
      example: { en: 'Buses took over most services after the line closed.', zh: '线路关闭后巴士取代了大部分客运。' },
    },
    {
      phrase: 'looked after', sentenceIndex: 9,
      meaning: { zh: '照料，维护', en: 'to care for and keep in good condition' },
      usage: { zh: '及物短语动词；此处指车辆在闭馆日得到维护，同 cared for。', en: 'Transitive phrasal verb; here it means vehicles are maintained, like cared for.' },
      example: { en: 'The vehicles are looked after between open days.', zh: '车辆在闭馆日之间得到维护。' },
    },
    {
      phrase: 'by hand', sentenceIndex: 10,
      meaning: { zh: '手工（而非机器）', en: 'made or done by people, not by machine' },
      usage: { zh: '方式状语；restore by hand、made by hand，与 by machine 相对。', en: 'Adverbial of method: restore by hand, made by hand, opposite to by machine.' },
      example: { en: 'Each panel is restored by hand.', zh: '每块面板都靠手工修复。' },
    },
    {
      phrase: 'ahead', sentenceIndex: 17,
      meaning: { zh: '提前，事先', en: 'before the date that has been mentioned' },
      usage: { zh: 'booked a week ahead 指提前一周预订；ahead 单独作时间状语。', en: 'Booked a week ahead means reserved one week before; ahead works as a time adverb.' },
      example: { en: 'Group bookings must be made a week ahead.', zh: '团体预订必须提前一周办理。' },
    },
    {
      phrase: 'stay with', sentenceIndex: 39,
      meaning: { zh: '紧跟，不离开（队伍）', en: 'to keep near a group and not wander off' },
      usage: { zh: '参观场景常用；stay with the group 即跟紧团队，与 wander off 相对。', en: 'Common on tours: stay with the group, the opposite of wandering off.' },
      example: { en: 'Please stay with the group on the concrete floor.', zh: '在水泥地坪上请跟紧队伍。' },
    },
  ],
  tips: [
    {
      title: { zh: '先听单选，后听笔记细节', en: 'Single choice first, note details second' },
      body: {
        zh: '独白前半段五题单选按历史用途、修复方式、驾驶体验、票含项目、团体条件依次出现；后半段才进入笔记填空。听到 Now the notes 这类过渡句时，把注意力从选项比对切到数字与名词记录。',
        en: 'The first five single questions follow history, restoration, driving experience, ticket coverage and group conditions in order; the note gaps come after the transition Now the notes. When you hear that cue, switch from comparing options to writing numbers and nouns.',
      },
    },
    {
      title: { zh: '区分静态体验与真实驾驶', en: 'Separate the simulator from a real drive' },
      body: {
        zh: '驾驶体验在静态驾驶室进行，只能握方向盘、摇铃；句 14 明确否定开上轨道。选项里出现 track、moving trailer 这类真实行驶词汇时，多半是干扰项。',
        en: 'The driving experience uses a static cab: steer and ring the bell only. Sentence 14 rules out the track. Options with real driving words like track or moving trailer are usually distractors.',
      },
    },
    {
      title: { zh: '数字题先看单位再落笔', en: 'Check the unit before writing numbers' },
      body: {
        zh: '笔记三行分别给了 minutes、dollars、people or more 作单位，答案只填 thirty、twelve、eight。听到数字先对照行首字段，避免把三十分钟和十二美元写反。',
        en: 'The note rows already give minutes, dollars and people or more, so write only thirty, twelve and eight. Match each number to its row label before recording it, so the session length and ticket price are not swapped.',
      },
    },
  ],
};
