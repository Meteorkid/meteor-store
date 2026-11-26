import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 27 · Part 2 — 渡轮安全广播（单人播报）。原创仿真材料，非官方真题。
 *
 * 广播顺序：救生衣位置 → 集合点 → 车辆甲板规定 → 颠簸提示 → 抵达流程。
 * 填空块集中在前半段，单选块在抵达说明之后，题块顺序与录音顺序一致。
 */
export const test27Part2: ListeningLesson = {
  slug: 'test-27-part-2',
  part: 2,
  status: 'published',
  title: { zh: '渡轮安全广播', en: 'A safety announcement on a ferry' },
  summary: {
    zh: '渡轮船员播报航行安全须知：救生衣存放在座位下方，紧急集合点在船首救生艇旁；车辆甲板上车门须关闭，禁止返回车辆；风浪天扶扶手慢行；靠岸时退到黄色标线后，步行乘客走舷梯旁楼梯下船。广播随后补充备用救生衣位置、司机停车要求、颠簸时的自我保护动作，以及靠岸前的铃声信号。',
    en: 'A crew member covers ferry safety: jackets are under each seat, and the assembly point is the lifeboat near the bow. Car doors stay shut on the vehicle deck; passengers must not return to cars. In rough weather they hold the handrail; on docking they stand behind the yellow line, and foot passengers leave by the stairs. Lockers, parking rules, bracing in a lurch, and the pre-berthing bell follow.',
  },
  accent: { zh: '广播员为南非口音英语。', en: 'The announcer speaks with a South African English accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'announcer', label: 'ANNOUNCER', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Life jackets stored under each', cells: [[{ blank: 11 }]] },
        { lead: 'Assembly point: lifeboat near the', cells: [[{ blank: 12 }]] },
        { lead: 'Car deck: keep all car', cells: [[{ blank: 13 }, { text: ' closed.' }]] },
        { lead: 'Rough weather: hold the', cells: [[{ blank: 14 }, { text: ' while walking.' }]] },
        { lead: 'Docking: stand behind the yellow', cells: [[{ blank: 15 }, { text: ' on the promenade deck.' }]] },
        { lead: 'Arrival: foot passengers leave through the', cells: [[{ blank: 16 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'Where are the spare life jackets kept?',
          options: [
            { key: 'A', text: 'in the drawer beside each inner seat' },
            { key: 'B', text: 'in the crew lockers at the stern' },
            { key: 'C', text: 'in the snack bar on the upper deck' },
          ],
        },
        {
          number: 18,
          stem: 'What must drivers do before the boat sails?',
          options: [
            { key: 'A', text: 'switch off the engine and set the handbrake' },
            { key: 'B', text: 'leave the car doors open for ventilation' },
            { key: 'C', text: 'keep the headlights on for the crossing' },
          ],
        },
        {
          number: 19,
          stem: 'If the ferry lurches suddenly, passengers should first',
          options: [
            { key: 'A', text: 'return to the car deck' },
            { key: 'B', text: 'sit on the outer rail' },
            { key: 'C', text: 'steady themselves against a fixed surface' },
          ],
        },
        {
          number: 20,
          stem: 'What do passengers hear just before docking?',
          options: [
            { key: 'A', text: 'a short music jingle' },
            { key: 'B', text: 'the ship’s bell ring twice' },
            { key: 'C', text: 'the horn for one long blast' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['seat'], evidence: 2,
      explanation: {
        zh: '定位句 2：Each life jacket is stored under your seat, in a sealed plastic bag。救生衣放在座位下方，填 seat。句 28 的抽屉是呕吐袋位置，别混到救生衣题里。',
        en: 'Sentence 2: "Each life jacket is stored under your seat, in a sealed plastic bag". The jacket goes under the seat, so write seat. The drawer in sentence 28 holds a sick bag, not the jacket.',
      },
    },
    {
      number: 12, accepted: ['bow'], evidence: 4,
      explanation: {
        zh: '定位句 4：we assemble at the lifeboat near the bow。集合点在船首旁的救生艇边，填 bow。stern 是句 19 备用柜所在的船尾，方向相反。',
        en: 'Sentence 4: "we assemble at the lifeboat near the bow". The assembly point is near the bow, so write bow. The stern in sentence 19 is where the spare lockers sit, the opposite end.',
      },
    },
    {
      number: 13, accepted: ['doors'], evidence: 7,
      explanation: {
        zh: '定位句 7：While the ferry is moving, keep all car doors closed。车辆甲板上所有车门须关闭，填 doors。句 8 的 side doors 是通往车辆甲板的舱门，不是本题所指。',
        en: 'Sentence 7: "While the ferry is moving, keep all car doors closed". All car doors stay shut, so write doors. The side doors in sentence 8 lead to the vehicle deck itself, not the cars.',
      },
    },
    {
      number: 14, accepted: ['handrail'], evidence: 10,
      explanation: {
        zh: '定位句 10：keep to the inside seating and hold the handrail as you walk。风浪天行走时扶扶手，填 handrail。rail 在句 12 指禁止坐的外栏杆，不是扶手。',
        en: 'Sentence 10: "keep to the inside seating and hold the handrail as you walk". Hold the handrail while walking, so write handrail. The rail in sentence 12 is the outer rail you must not sit on.',
      },
    },
    {
      number: 15, accepted: ['line'], evidence: 15,
      explanation: {
        zh: '定位句 15：stand behind the yellow line marked on the promenade deck。靠岸时站在黄色标线后，填 line。句 4 的 green arrows 是集合时的地面指引，不是标线。',
        en: 'Sentence 15: "stand behind the yellow line marked on the promenade deck". Stand behind the yellow line, so write line. The green arrows in sentence 4 guide the assembly walk, not the docking marker.',
      },
    },
    {
      number: 16, accepted: ['stairs'], evidence: 17,
      explanation: {
        zh: '定位句 17：Foot passengers leave through the stairs on the starboard side, once the gangway is in place。步行乘客经楼梯下船，填 stairs。gangway 是接驳跳板，不是出口通道本身。',
        en: 'Sentence 17: "Foot passengers leave through the stairs on the starboard side, once the gangway is in place". Foot passengers use the stairs, so write stairs. The gangway is the connecting ramp, not the exit route itself.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：Extra life jackets are kept in the crew lockers at the stern。备用救生衣在船尾船员储物柜，对应 B。A 的座位抽屉放呕吐袋，C 的吧台不在储物位置。',
        en: 'Sentence 19: "Extra life jackets are kept in the crew lockers at the stern". Spare jackets are in stern crew lockers, matching B. Inner-seat drawers hold sick bags, and the snack bar is not storage.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 20,
      explanation: {
        zh: '定位句 20：the engine must be switched off and the handbrake set before the boat sails。司机须熄火并拉手刹，对应 A。B 开车门通风与句 7 关门要求相反，C 开车灯未被要求。',
        en: 'Sentence 20: "the engine must be switched off and the handbrake set before the boat sails". Drivers switch off the engine and set the handbrake, matching A. Open doors contradict sentence 7, and headlights are never required.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 21,
      explanation: {
        zh: '定位句 21：steady yourself against a fixed surface before looking around for the crew。颠簸时先靠稳固物体稳住身体，对应 C。A 返回车辆甲板被句 6 禁止，B 坐栏杆被句 12 禁止。',
        en: 'Sentence 21: "steady yourself against a fixed surface before looking around for the crew". Brace against a fixed surface first, matching C. Returning to the car deck is banned in sentence 6, and sitting on the rail in sentence 12.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：you may hear the ship’s bell ring twice before the ropes go over。靠岸前听到船铃响两声，对应 B。A 的音乐提示音与 C 的长鸣汽笛在录音中未出现。',
        en: 'Sentence 22: "you may hear the ship’s bell ring twice before the ropes go over". The signal is the bell ringing twice, matching B. A music jingle and a long horn blast are not mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'announcer', text: 'Attention, please, for the safety briefing on board this crossing.' },
    { speaker: 'announcer', text: 'We will cover life jackets, the assembly point, the car deck rules, rough weather advice, and the arrival procedure.' },
    { speaker: 'announcer', text: 'Each life jacket is stored under your seat, in a sealed plastic bag.' },
    { speaker: 'announcer', text: 'If the bag feels damp, tell a crew member rather than moving it yourself.' },
    { speaker: 'announcer', text: 'Should we have to leave the ship, we assemble at the lifeboat near the bow, following the green arrows on the floor.' },
    { speaker: 'announcer', text: 'Children go with an adult, and any bag is carried by hand rather than dragged on the deck.' },
    { speaker: 'announcer', text: 'Drivers who parked their cars should not return to them during the crossing.' },
    { speaker: 'announcer', text: 'While the ferry is moving, keep all car doors closed, and do not lean over the rail above the vehicles.' },
    { speaker: 'announcer', text: 'The side doors to the car deck stay locked until the ferry reaches the mooring.' },
    { speaker: 'announcer', text: 'Unless a crew member directs you elsewhere, stay on the passenger deck.' },
    { speaker: 'announcer', text: 'If the weather turns rough, keep to the inside seating and hold the handrail as you walk.' },
    { speaker: 'announcer', text: 'Walk slowly near the stairwell, because steps can become slippery when spray reaches them.' },
    { speaker: 'announcer', text: 'Do not sit on the outer rail, even if the deck looks sheltered from the wind.' },
    { speaker: 'announcer', text: 'Drinks should be carried in low cups, because a sudden roll can spill a full glass.' },
    { speaker: 'announcer', text: 'Near the end of the trip, we will announce the docking over the public address system.' },
    { speaker: 'announcer', text: 'When docking begins, stand behind the yellow line marked on the promenade deck.' },
    { speaker: 'announcer', text: 'Please keep small children away from the rail while the berth comes alongside.' },
    { speaker: 'announcer', text: 'Foot passengers leave through the stairs on the starboard side, once the gangway is in place.' },
    { speaker: 'announcer', text: 'Drivers wait in the passenger lounge until the crew opens the car deck lights.' },
    { speaker: 'announcer', text: 'Extra life jackets are kept in the crew lockers at the stern, and only staff should open those.' },
    { speaker: 'announcer', text: 'For those who drove on, the engine must be switched off and the handbrake set before the boat sails.' },
    { speaker: 'announcer', text: 'If the ferry lurches in high seas, steady yourself against a fixed surface before looking around for the crew.' },
    { speaker: 'announcer', text: 'As the berth draws near, you may hear the ship’s bell ring twice before the ropes go over.' },
    { speaker: 'announcer', text: 'Mobile phone signals may drop as we leave the coast, so messages can be written before boarding.' },
    { speaker: 'announcer', text: 'There are toilets at the aft end of the middle deck, with signage in the main corridor.' },
    { speaker: 'announcer', text: 'A snack bar serves tea, coffee, and light meals between the middle and upper decks.' },
    { speaker: 'announcer', text: 'Lost property is handed to the purser’s desk near the main entrance.' },
    { speaker: 'announcer', text: 'If you feel unwell during the crossing, sit near the centre of the ship, where the movement is least.' },
    { speaker: 'announcer', text: 'A sick bag is kept in the drawer beside each inner seat.' },
    { speaker: 'announcer', text: 'Crew members wear orange jackets and can answer questions about the route or timetable.' },
    { speaker: 'announcer', text: 'Smoking is not allowed anywhere on the passenger decks, including outside areas.' },
    { speaker: 'announcer', text: 'Photographs of the harbour are welcome, but do not block the walkway with a tripod.' },
    { speaker: 'announcer', text: 'Our crossing is expected to take about two hours in this weather.' },
    { speaker: 'announcer', text: 'The ticket you hold also covers the return sailing within the booked date.' },
    { speaker: 'announcer', text: 'For any change of seat, please ask a crew member rather than moving bags between groups.' },
    { speaker: 'announcer', text: 'The outdoor shelter, if reopened, sits at the stern end of the upper deck.' },
    { speaker: 'announcer', text: 'We will remind you again before the car deck opens for unloading.' },
    { speaker: 'announcer', text: 'Now, relax and enjoy the view from the forward windows.' },
    { speaker: 'announcer', text: 'Any questions about the next half hour can be asked at the purser’s desk.' },
    { speaker: 'announcer', text: 'Thank you for your attention, and safe crossing.' },
  ],
  vocabulary: [
    {
      term: 'life jacket', phonetic: '/ˈlaɪf ˌdʒækɪt/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '救生衣', en: 'the buoyant coat worn to stay afloat in water' },
      usage: { zh: '可数名词；put on a life jacket、store a life jacket。', en: 'Countable: put on a life jacket, store a life jacket.' },
      collocations: ['put on a life jacket', 'spare life jackets', 'the life jacket locker'],
      example: { en: 'Each life jacket is stored under your seat.', zh: '每件救生衣都放在座位下方。' },
      listening: { zh: '复合词 life 加 jacket；/dʒ/ 清晰。', en: 'Compound life plus jacket; the /dʒ/ is clear.' },
    },
    {
      term: 'assemble', phonetic: '/əˈsembl/', partOfSpeech: 'v.', sentenceIndex: 4,
      meaning: { zh: '集合（应急集结）', en: 'to gather passengers at a designated point' },
      usage: { zh: '动词；assemble at the lifeboat、assemble on deck。名词 assembly。', en: 'Verb: assemble at the lifeboat, assemble on deck. The noun is assembly.' },
      collocations: ['assemble at the lifeboat', 'assemble on deck', 'assemble near the bow'],
      example: { en: 'We assemble at the lifeboat near the bow.', zh: '我们在船首救生艇旁集合。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈsem/；词尾 /bl/。', en: 'Two syllables with stress on the second; ending /bl/.' },
    },
    {
      term: 'handrail', phonetic: '/ˈhændreɪl/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '扶手', en: 'the rail you hold to keep balance on stairs or walkways' },
      usage: { zh: '可数名词；hold the handrail、stairs handrail。', en: 'Countable: hold the handrail, stair handrail.' },
      collocations: ['hold the handrail', 'the stair handrail', 'grip the handrail'],
      example: { en: 'Hold the handrail as you walk across the deck.', zh: '走过甲板时扶好扶手。' },
      listening: { zh: '复合词 hand 加 rail，重音在第一个音节。', en: 'Compound hand plus rail, stress on the first.' },
    },
    {
      term: 'gangway', phonetic: '/ˈɡæŋweɪ/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '接驳跳板，舷梯', en: 'the ramp joining the ship to the quay' },
      usage: { zh: '可数名词；gangway in place、walk down the gangway。', en: 'Countable: gangway in place, walk down the gangway.' },
      collocations: ['the gangway is in place', 'walk down the gangway', 'the ship’s gangway'],
      example: { en: 'Foot passengers leave once the gangway is in place.', zh: '跳板就位后步行乘客下船。' },
      listening: { zh: '两个音节，重音在第一个；/w/ 在第二个音节开头。', en: 'Two syllables with first-syllable stress; /w/ starts the second.' },
    },
    {
      term: 'lockers', phonetic: '/ˈlɒkəz/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '储物柜（复数）', en: 'locked cabinets for storing equipment' },
      usage: { zh: '可数名词复数；crew lockers、store equipment in the lockers。', en: 'Plural countable: crew lockers, store equipment in the lockers.' },
      collocations: ['crew lockers', 'storage lockers', 'open the lockers'],
      example: { en: 'Spare jackets are kept in the crew lockers.', zh: '备用救生衣放在船员储物柜里。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /z/。', en: 'Two syllables with first-syllable stress; ending /z/.' },
    },
    {
      term: 'lurches', phonetic: '/lɜːtʃɪz/', partOfSpeech: 'v.', sentenceIndex: 21,
      meaning: { zh: '（船）突然倾斜颠簸（第三人称）', en: 'rolls or sways suddenly to one side' },
      usage: { zh: '动词第三人称；the ferry lurches。原形 lurch，名词 a lurch。', en: 'Third person verb: the ferry lurches. The base verb is lurch.' },
      collocations: ['the ferry lurches', 'the bus lurches', 'lurch to one side'],
      example: { en: 'If the ferry lurches in high seas, steady yourself first.', zh: '船在大浪中倾斜时先稳住身体。' },
      listening: { zh: '词尾两个音节 /tʃɪz/，长元音 /ɜː/。', en: 'Ending /tʃɪz/; long /ɜː/.' },
    },
    {
      term: 'tripod', phonetic: '/ˈtraɪpɒd/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '三脚架', en: 'the three-legged stand for a camera' },
      usage: { zh: '可数名词；a camera tripod、set up a tripod。', en: 'Countable: a camera tripod, set up a tripod.' },
      collocations: ['a tripod', 'camera tripod', 'block the walkway with a tripod'],
      example: { en: 'Do not block the walkway with a tripod.', zh: '不要用三脚架挡住通道。' },
      listening: { zh: '两个音节，重音在第一个；/traɪ/ 为长音。', en: 'Two syllables with first-syllable stress; long /traɪ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'stored under', sentenceIndex: 2,
      meaning: { zh: '存放在……下面', en: 'kept beneath something for quick access' },
      usage: { zh: '存放在……下面；be stored under something，如 jackets stored under the seat。', en: 'Be stored under something: jackets stored under the seat.' },
      example: { en: 'The jacket is stored under your seat in a bag.', zh: '救生衣装袋放在座位下面。' },
    },
    {
      phrase: 'assemble at', sentenceIndex: 4,
      meaning: { zh: '在……处集合', en: 'to gather at a designated location' },
      usage: { zh: 'assemble at 加地点；assemble at the lifeboat。', en: 'Assemble at plus location: assemble at the lifeboat.' },
      example: { en: 'We assemble at the lifeboat near the bow.', zh: '我们在船首救生艇旁集合。' },
    },
    {
      phrase: 'switched off', sentenceIndex: 20,
      meaning: { zh: '关掉（引擎、电器）', en: 'turned off an engine or machine' },
      usage: { zh: 'switch off 的被动形式；the engine is switched off、the lights are switched off。', en: 'Passive of switch off: the engine is switched off, the lights are off.' },
      example: { en: 'The engine must be switched off before sailing.', zh: '开船前必须熄火。' },
    },
    {
      phrase: 'steady yourself against', sentenceIndex: 21,
      meaning: { zh: '靠在……上稳住身体', en: 'to brace your body against a solid object' },
      usage: { zh: 'steady yourself against 加表面；against the wall、against the rail。', en: 'Steady yourself against a surface: against the wall, the rail.' },
      example: { en: 'Steady yourself against a fixed surface first.', zh: '先靠稳固物体稳住身体。' },
    },
    {
      phrase: 'comes alongside', sentenceIndex: 16,
      meaning: { zh: '（船）靠到码头旁', en: 'to pull in next to the berth or quay' },
      usage: { zh: 'come alongside 的第三人称；the berth comes alongside。', en: 'Third person of come alongside: the berth comes alongside.' },
      example: { en: 'Keep children away from the rail as the berth comes alongside.', zh: '码头靠拢时看好孩子远离栏杆。' },
    },
    {
      phrase: 'handed to', sentenceIndex: 26,
      meaning: { zh: '交到（某处）', en: 'passed to a person or desk for handling' },
      usage: { zh: 'be handed to 加对象；lost property handed to the desk。', en: 'Be handed to plus recipient: lost property handed to the desk.' },
      example: { en: 'Lost property is handed to the purser’s desk.', zh: '遗失物品交到事务长服务台。' },
    },
  ],
  tips: [
    {
      title: { zh: '船首船尾方向分开记', en: 'Keep bow and stern separate' },
      body: {
        zh: '第 12 题集合点在船首 bow，第 17 题备用柜在船尾 stern，两个方向同篇出现。听到 near the bow 先标前面，听到 at the stern 标后面，别把方位词写反。',
        en: 'Item 12 places the assembly point near the bow, while item 17 puts spare lockers at the stern. Mark near the bow as the front and at the stern as the back, and do not swap the directions.',
      },
    },
    {
      title: { zh: '禁止动作与必做动作对照记', en: 'Pair bans with required actions' },
      body: {
        zh: '广播里常先说禁止什么，再说必须做什么：禁止回车辆，但必须关门；禁止坐外栏杆，但必须扶扶手。做笔记时把禁令和要求并排写，避免只听到后半句就填错。',
        en: 'The briefing often names a ban before a requirement: no returning to cars, but doors must close; no sitting on the rail, but hold the handrail. Write bans and requirements side by side, so a half-heard second clause does not fill the gap wrongly.',
      },
    },
    {
      title: { zh: '广播信号听次数', en: 'Count the sound signal' },
      body: {
        zh: '第 20 题问靠岸前听到什么信号，句 22 的 bell ring twice 是答案。广播类题目常把信号声（铃、汽笛、提示音）和次数绑定，听到信号名时顺手记下响了几下。',
        en: 'Item 20 asks for the pre-berthing signal, and the bell ringing twice in sentence 22 is the answer. Broadcast questions often bind a sound, bell, horn, or jingle, to a count; write the number of repeats when you hear the signal.',
      },
    },
  ],
};
