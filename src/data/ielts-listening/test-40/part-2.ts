import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 40 · Part 2 — 泳池泳道规则说明（单人说明，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 顺序：泳道速度分区、浮板使用、跳水池规定、下水前淋浴与闭馆时间（单选 11–15）→
 * 泳道绳、慢泳道位置、浮板学习目标、跳水池监督员与最后入场时间（笔记填空 16–20）。
 */
export const test40Part2: ListeningLesson = {
  slug: 'test-40-part-2',
  part: 2,
  status: 'published',
  title: { zh: '泳池泳道规则说明', en: 'Explaining pool lane rules' },
  summary: {
    zh: '泳池讲解员说明三条泳道的速度分区：右道快泳、中道中等、左道慢泳；浮板供慢泳道初学者练踢水，跳水池禁止在板上跑动，下水前必须淋浴，场馆晚九点闭馆；并补充泳道由彩色泳绳分隔、慢泳者靠左道、浮板用于练习平稳呼吸、跳水池有独立监督员、最后入场在闭馆前三十分钟。',
    en: 'The guide explains three lanes: right fast, middle moderate, left slow. Float boards serve beginners in the slow lane; running on the board is banned; a shower is required before entering; the centre closes at nine in the evening. Lane ropes divide the lanes, slow swimmers keep left, boards practise breathing, the diving pool has a supervisor, and last entry is thirty minutes before closing.',
  },
  accent: { zh: '讲解员为加拿大口音。', en: 'The speaker has a Canadian accent.' },
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
          stem: 'Which lane is for fast swimmers?',
          options: [
            { key: 'A', text: 'the right hand lane' },
            { key: 'B', text: 'the middle lane' },
            { key: 'C', text: 'the left hand lane' },
          ],
        },
        {
          number: 12,
          stem: 'Where may float boards be used?',
          options: [
            { key: 'A', text: 'the diving pool' },
            { key: 'B', text: 'the slow lane' },
            { key: 'C', text: 'the fast lane' },
          ],
        },
        {
          number: 13,
          stem: 'What is not allowed in the diving pool?',
          options: [
            { key: 'A', text: 'waiting at the ladder' },
            { key: 'B', text: 'one person on the board' },
            { key: 'C', text: 'running on the board' },
          ],
        },
        {
          number: 14,
          stem: 'What must swimmers do before entering the water?',
          options: [
            { key: 'A', text: 'take a quick shower' },
            { key: 'B', text: 'tie back long hair' },
            { key: 'C', text: 'wear goggles' },
          ],
        },
        {
          number: 15,
          stem: 'When does the centre close?',
          options: [
            { key: 'A', text: 'eight o’clock' },
            { key: 'B', text: 'nine o’clock' },
            { key: 'C', text: 'ten o’clock' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Lanes are marked by coloured', cells: [[{ blank: 16 }]] },
        { lead: 'Slow swimmers keep to the', cells: [[{ blank: 17 }, { text: 'lane' }]] },
        { lead: 'Float boards help beginners learn to', cells: [[{ blank: 18 }]] },
        { lead: 'The diving pool has a separate', cells: [[{ blank: 19 }]] },
        { lead: 'Last entry is thirty minutes before', cells: [[{ blank: 20 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['A'], evidence: 2,
      explanation: {
        zh: '定位句 2：The right hand lane is for fast swimmers who keep a steady pace and pass others smoothly。快泳者走右道，对应 A。中道中等速度，左道慢泳与初学者。',
        en: 'Sentence 2: "The right hand lane is for fast swimmers who keep a steady pace and pass others smoothly", matching A. The middle lane is moderate pace, the left lane slow and beginner.',
      },
    },
    {
      number: 12, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：Float boards may be used in the slow lane, where beginners practise kicking and balance。浮板用于慢泳道，对应 B。跳水池不使用浮板。',
        en: 'Sentence 6: "Float boards may be used in the slow lane, where beginners practise kicking and balance", matching B. Boards are not used in the diving pool.',
      },
    },
    {
      number: 13, accepted: ['C'], evidence: 8,
      explanation: {
        zh: '定位句 8：In the diving pool, only controlled jumps are allowed, and running on the board is not permitted。板上跑动禁止，对应 C。在梯子处等候、每次一人用板都是允许的。',
        en: 'Sentence 8: "In the diving pool, only controlled jumps are allowed, and running on the board is not permitted", matching C. Waiting at the ladder and one person on the board are allowed.',
      },
    },
    {
      number: 14, accepted: ['A'], evidence: 10,
      explanation: {
        zh: '定位句 10：Before entering the water, every swimmer must take a quick shower to wash off sweat and cream。下水前快速淋浴，对应 A。束发与泳镜是建议项，不是强制要求。',
        en: 'Sentence 10: "Before entering the water, every swimmer must take a quick shower to wash off sweat and cream", matching A. Tying hair back and goggles are recommendations, not requirements.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 12,
      explanation: {
        zh: '定位句 12：The centre closes at nine o’clock in the evening, and the last session ends fifteen minutes earlier。晚九点闭馆，对应 B。最后场次提前十五分钟结束，不是闭馆时间。',
        en: 'Sentence 12: "The centre closes at nine o’clock in the evening, and the last session ends fifteen minutes earlier", matching B. The final session ends fifteen minutes early, that is not the closing time.',
      },
    },
    {
      number: 16, accepted: ['ropes'], evidence: 15,
      explanation: {
        zh: '定位句 15：Lanes are marked by coloured ropes that stretch across the water between the floats。泳道由彩色泳绳分隔，填 ropes；浮标是绳上的分段，不是分隔物本身。',
        en: 'Sentence 15: "Lanes are marked by coloured ropes that stretch across the water between the floats", fill ropes. The floats are segments on the rope, not the divider itself.',
      },
    },
    {
      number: 17, accepted: ['left'], evidence: 17,
      explanation: {
        zh: '定位句 17：Slow swimmers keep to the left lane, and they should not drift into the fast lane。慢泳者靠左道，填 left；不要漂入快泳道。',
        en: 'Sentence 17: "Slow swimmers keep to the left lane, and they should not drift into the fast lane", fill left. They must not drift into the fast lane.',
      },
    },
    {
      number: 18, accepted: ['breathe'], evidence: 18,
      explanation: {
        zh: '定位句 18：Float boards are mainly for beginners learning to breathe steadily while kicking。浮板帮助初学者练平稳呼吸，填 breathe；踢水与平衡是伴随练习。',
        en: 'Sentence 18: "Float boards are mainly for beginners learning to breathe steadily while kicking", fill breathe. Kicking and balance are companion drills.',
      },
    },
    {
      number: 19, accepted: ['supervisor'], evidence: 19,
      explanation: {
        zh: '定位句 19：The diving pool has a separate supervisor who watches every jump from the side。跳水池有独立监督员，填 supervisor；救生员负责主泳池。',
        en: 'Sentence 19: "The diving pool has a separate supervisor who watches every jump from the side", fill supervisor. Lifeguards cover the main pool.',
      },
    },
    {
      number: 20, accepted: ['closing'], evidence: 21,
      explanation: {
        zh: '定位句 21：Last entry to the pool is thirty minutes before closing, and the gate locks after that time。最后入场在闭馆前三十分钟，填 closing；锁门是入场截止后的动作。',
        en: 'Sentence 21: "Last entry to the pool is thirty minutes before closing, and the gate locks after that time", fill closing. The gate locks after entry has closed.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Before you get in the water, please make sure you know how the lanes are organised.' },
    { speaker: 'guide', text: 'The main pool has three lanes, and each one suits a different swimming speed.' },
    { speaker: 'guide', text: 'The right hand lane is for fast swimmers who keep a steady pace and pass others smoothly.' },
    { speaker: 'guide', text: 'The middle lane holds swimmers at a moderate speed, and it is the busiest lane on weekends.' },
    { speaker: 'guide', text: 'The left hand lane is for slow swimmers, learners and anyone who needs to rest often.' },
    { speaker: 'guide', text: 'If you are unsure which lane to join, ask the lifeguard before stepping onto the poolside.' },
    { speaker: 'guide', text: 'Float boards may be used in the slow lane, where beginners practise kicking and balance.' },
    { speaker: 'guide', text: 'The boards are kept on the rack beside the shallow end, and they are returned after use.' },
    { speaker: 'guide', text: 'In the diving pool, only controlled jumps are allowed, and running on the board is not permitted.' },
    { speaker: 'guide', text: 'Divers wait their turn at the ladder, and one person uses the board at a time.' },
    { speaker: 'guide', text: 'Before entering the water, every swimmer must take a quick shower to wash off sweat and cream.' },
    { speaker: 'guide', text: 'The shower area is just inside the changing rooms, and towels are left on the hooks.' },
    { speaker: 'guide', text: 'The centre closes at nine o’clock in the evening, and the last session ends fifteen minutes earlier.' },
    { speaker: 'guide', text: 'Please leave the poolside promptly after your swim, so the cleaners can finish their rounds.' },
    { speaker: 'guide', text: 'Now a few details about the lane equipment and the pool rules.' },
    { speaker: 'guide', text: 'Lanes are marked by coloured ropes that stretch across the water between the floats.' },
    { speaker: 'guide', text: 'The rope colours repeat along the pool, so you can tell your lane from a distance.' },
    { speaker: 'guide', text: 'Slow swimmers keep to the left lane, and they should not drift into the fast lane.' },
    { speaker: 'guide', text: 'Float boards are mainly for beginners learning to breathe steadily while kicking.' },
    { speaker: 'guide', text: 'The diving pool has a separate supervisor who watches every jump from the side.' },
    { speaker: 'guide', text: 'The supervisor calls the next diver when the board is clear and the water below is empty.' },
    { speaker: 'guide', text: 'Last entry to the pool is thirty minutes before closing, and the gate locks after that time.' },
    { speaker: 'guide', text: 'Children under eight must stay within arm’s reach of an adult at all times.' },
    { speaker: 'guide', text: 'No food or glass containers are allowed on the poolside, and drinks stay in the drinking area.' },
    { speaker: 'guide', text: 'Hair longer than shoulder length should be tied back before swimming.' },
    { speaker: 'guide', text: 'Goggles are recommended, but they are not checked at the entrance.' },
    { speaker: 'guide', text: 'If you feel unwell during the session, raise your arm and the lifeguard will come over.' },
    { speaker: 'guide', text: 'The sauna next to the pool opens after the main session and follows its own timetable.' },
    { speaker: 'guide', text: 'Pool rules are posted on the board near the entrance for anyone who misses this talk.' },
    { speaker: 'guide', text: 'Please read the signs before your first swim, and ask if anything is unclear.' },
    { speaker: 'guide', text: 'The changing rooms are cleaned between sessions, so leave your locker empty when you finish.' },
    { speaker: 'guide', text: 'Lost property is handed in at the reception desk near the main entrance.' },
    { speaker: 'guide', text: 'Towels and swimwear should not be left on the benches after the session.' },
    { speaker: 'guide', text: 'The pool water is tested each morning, and the readings are posted beside the shower.' },
    { speaker: 'guide', text: 'Lane bookings are taken online for busy weekend sessions.' },
    { speaker: 'guide', text: 'Casual swimmers may use the middle lane when it is not reserved for a class.' },
    { speaker: 'guide', text: 'Lessons run in the shallow end during weekday afternoons, and that area is marked off.' },
    { speaker: 'guide', text: 'Please keep noise down so swimmers can hear the lifeguard’s instructions.' },
    { speaker: 'guide', text: 'The first aid box is mounted on the wall by the diving pool.' },
    { speaker: 'guide', text: 'Any accident, however small, should be reported to the lifeguard straight away.' },
    { speaker: 'guide', text: 'Thank you for following these rules, and enjoy your swim.' },
  ],
  vocabulary: [
    {
      term: 'lanes', phonetic: '/leɪnz/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '泳道', en: 'the marked strip of water for swimmers of one speed' },
      usage: { zh: '可数名词；the right hand lane、join a lane。', en: 'Countable: the right hand lane, join a lane.' },
      collocations: ['the fast lane', 'the slow lane', 'join a lane'],
      example: { en: 'Each lane suits a different swimming speed.', zh: '每条泳道对应不同速度。' },
      listening: { zh: '单音节，与 main 押韵。', en: 'One syllable, rhyming with main.' },
    },
    {
      term: 'pace', phonetic: '/peɪs/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '速度，节奏', en: 'the steady speed at which a swimmer moves' },
      usage: { zh: '可数/不可数；a steady pace、keep the pace。', en: 'A steady pace, keep the pace.' },
      collocations: ['a steady pace', 'fast pace', 'slow the pace'],
      example: { en: 'Fast swimmers keep a steady pace.', zh: '快泳者保持稳定节奏。' },
      listening: { zh: '单音节，与 face 同音近韵。', en: 'One syllable, near rhyme with face.' },
    },
    {
      term: 'moderate', phonetic: '/ˈmɒdərət/', partOfSpeech: 'adj.', sentenceIndex: 3,
      meaning: { zh: '中等的，适中的', en: 'neither fast nor slow, in the middle range' },
      usage: { zh: '形容词；moderate speed、moderate pace。', en: 'Moderate speed, moderate pace.' },
      collocations: ['moderate speed', 'a moderate pace', 'moderate level'],
      example: { en: 'The middle lane holds moderate speed swimmers.', zh: '中道是中等速度泳者。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈmɒd/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'float', phonetic: '/fləʊt/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '浮板，浮具', en: 'the board held by beginners to support kicking' },
      usage: { zh: '可数名词；float board、the float rack。', en: 'Countable: float board, the float rack.' },
      collocations: ['float boards', 'the float rack', 'use a float'],
      example: { en: 'Float boards are used in the slow lane.', zh: '浮板在慢泳道使用。' },
      listening: { zh: '单音节，与 boat 押韵。', en: 'One syllable, rhyming with boat.' },
    },
    {
      term: 'rack', phonetic: '/ræk/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '架子，置物架', en: 'the frame where boards are stored between use' },
      usage: { zh: '可数名词；the board rack、on the rack。', en: 'Countable: the board rack, on the rack.' },
      collocations: ['the board rack', 'on the rack', 'return to the rack'],
      example: { en: 'Boards are kept on the rack beside the shallow end.', zh: '浮板放在浅水区旁架子上。' },
      listening: { zh: '单音节，元音 /æ/，与 back 押韵。', en: 'One syllable with /æ/, rhyming with back.' },
    },
    {
      term: 'permitted', phonetic: '/pəˈmɪtɪd/', partOfSpeech: 'adj.', sentenceIndex: 8,
      meaning: { zh: '允许的，许可的', en: 'allowed under the pool rules' },
      usage: { zh: '动词过去分词作表语；not permitted、be permitted。动词 permit。', en: 'Past participle predicative: not permitted, be permitted; the verb is permit.' },
      collocations: ['not permitted', 'be permitted', 'strictly permitted'],
      example: { en: 'Running on the board is not permitted.', zh: '禁止在板上跑动。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈmɪt/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'supervisor', phonetic: '/ˈsuːpəvaɪzə/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '监督员，看护员', en: 'the staff member who watches the diving pool' },
      usage: { zh: '可数名词；a separate supervisor、the pool supervisor。动词 supervise。', en: 'Countable: a separate supervisor, the pool supervisor; the verb is supervise.' },
      collocations: ['the diving supervisor', 'a separate supervisor', 'the pool supervisor'],
      example: { en: 'The diving pool has a separate supervisor.', zh: '跳水池有独立监督员。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈsuː/。', en: 'Four syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'get in the water', sentenceIndex: 0,
      meaning: { zh: '下水，进入泳池', en: 'to step into the swimming pool' },
      usage: { zh: '不及物短语；get in the water、get out of the water。', en: 'Intransitive: get in the water, get out of the water.' },
      example: { en: 'Know the lanes before you get in the water.', zh: '下水前先弄清泳道。' },
    },
    {
      phrase: 'keep to', sentenceIndex: 17,
      meaning: { zh: '留在（某泳道），遵守', en: 'to stay within a stated lane or rule' },
      usage: { zh: '及物；keep to the left lane、keep to the rules。', en: 'Transitive: keep to the left lane, keep to the rules.' },
      example: { en: 'Slow swimmers keep to the left lane.', zh: '慢泳者留在左道。' },
    },
    {
      phrase: 'drift into', sentenceIndex: 17,
      meaning: { zh: '漂入，滑入（邻道）', en: 'to move accidentally into another lane' },
      usage: { zh: '不及物；drift into the fast lane。', en: 'Intransitive: drift into the fast lane.' },
      example: { en: 'Do not drift into the fast lane.', zh: '不要漂入快泳道。' },
    },
    {
      phrase: 'raise your arm', sentenceIndex: 26,
      meaning: { zh: '举手（示意求助）', en: 'to lift an arm to call the lifeguard' },
      usage: { zh: '及物；raise your arm、raise an arm。', en: 'Transitive: raise your arm, raise an arm.' },
      example: { en: 'Raise your arm if you feel unwell.', zh: '身体不适就举手。' },
    },
    {
      phrase: 'handed in', sentenceIndex: 31,
      meaning: { zh: '交到（服务台）', en: 'to be brought to reception for lost property' },
      usage: { zh: '被动搭配；lost property is handed in、hand in the item。', en: 'Passive: lost property is handed in; hand in the item.' },
      example: { en: 'Lost property is handed in at reception.', zh: '失物交到服务台。' },
    },
  ],
  tips: [
    {
      title: { zh: '泳道位置与速度成对记', en: 'Pair lane position with speed' },
      body: {
        zh: '听到右、中、左道时同步记速度：右道快、中道中等、左道慢。题目常把速度安到邻道上，听时抓住 right、middle、left 与 fast、moderate、slow 的对应。',
        en: 'As right, middle and left lanes are named, match the speed: right fast, middle moderate, left slow. Questions attach a speed to the adjacent lane; catch the pairing of right, middle, left with fast, moderate, slow.',
      },
    },
    {
      title: { zh: '分清强制规则与建议项', en: 'Separate mandatory rules from advice' },
      body: {
        zh: '淋浴是强制，束发和泳镜是建议；跳水池禁止板上跑动，等候与单人用板允许。听到 must、not permitted 记规则，听到 recommended、should 记建议。',
        en: 'Showering is mandatory, tying hair back and goggles are advice; running on the board is banned, waiting and one person on the board are allowed. At must and not permitted note a rule; at recommended and should note advice.',
      },
    },
    {
      title: { zh: '时间点区分闭馆与最后入场', en: 'Separate closing time from last entry' },
      body: {
        zh: '晚九点是闭馆时间，闭馆前三十分钟是最后入场，最后场次再提前十五分钟结束。听到时间立刻标注它属于哪一项，别把入场截止当成闭馆时刻。',
        en: 'Nine in the evening is closing time, last entry is thirty minutes before closing, and the final session ends fifteen minutes earlier. Label each time as closing, entry or session end; do not treat entry cutoff as closing time.',
      },
    },
  ],
};
