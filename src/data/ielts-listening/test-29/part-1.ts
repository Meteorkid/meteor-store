import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 29 · Part 1 — 报名成人游泳课（双人对话，澳式口音）。原创仿真材料，非官方真题。
 *
 * 对话顺序：水平分组 → 教练配比 → 课程周数 → 自带泳具 → 课时长度 → 补课政策 →
 * 上课日、浅水区深度、补课加入对象、泳池门票。前填空块、单选块、后填空块依次推进。
 */
export const test29Part1: ListeningLesson = {
  slug: 'test-29-part-1',
  part: 1,
  status: 'published',
  title: { zh: '报名成人游泳课', en: 'Booking adult swimming lessons' },
  summary: {
    zh: '一名成人学员报名游泳课：经入水测试分入初级组，每组一名教练带六名学员，课程共八周；了解需自带泳帽、泳镜和毛巾，每节水中四十五分钟，缺课可在同期同级别的另一个组补上；并记下上课日周二和周四、浅水区两米深、补课加入同级别组，以及泳池门票需另付。',
    en: 'An adult books swimming lessons: a water test places him in the beginner group, one coach takes six swimmers, and the course runs eight weeks. He brings cap, goggles and towel, each lesson lasts forty-five minutes in the water, and a missed class is caught up in another same-level group. Notes cover the Tuesday and Thursday evenings, the two-metre shallow end and the separate pool entry fee.',
  },
  accent: { zh: '咨询员与学员均为澳式口音，对话语速中等。', en: 'The adviser and the student both speak with Australian accents, at a moderate pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-AU-NatashaNeural' },
    { id: 'student', label: 'STUDENT', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Group level:', cells: [[{ blank: 1 }]] },
        { lead: 'One coach for every', cells: [[{ blank: 2 }, { text: ' swimmers' }]] },
        { lead: 'Course length:', cells: [[{ blank: 3 }, { text: ' weeks' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'What swim gear must students bring?',
          options: [
            { key: 'A', text: 'Kick boards and rash vests' },
            { key: 'B', text: 'A swim cap, goggles and a towel' },
            { key: 'C', text: 'Flippers and a buoyancy belt' },
          ],
        },
        {
          number: 5,
          stem: 'How long is each in-water lesson?',
          options: [
            { key: 'A', text: 'Forty-five minutes' },
            { key: 'B', text: 'Ten minutes' },
            { key: 'C', text: 'Seventy-five minutes' },
          ],
        },
        {
          number: 6,
          stem: 'What is the catch-up policy?',
          options: [
            { key: 'A', text: 'Missed classes are never refunded or moved' },
            { key: 'B', text: 'Students join another same-level group within the course' },
            { key: 'C', text: 'A private one-on-one lesson replaces each missed class' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Missed class: join another', cells: [[{ blank: 7 }, { text: ' at the same level' }]] },
        { lead: 'Own group meets on', cells: [[{ blank: 8 }, { text: ' and Thursday' }]] },
        { lead: 'Shallow end depth:', cells: [[{ blank: 9 }, { text: ' metres' }]] },
        { lead: 'Pool entry fee is', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['beginner'], evidence: 4,
      explanation: {
        zh: '定位句 4：That puts you in the beginner group, yes。学员分入初级组，填 beginner。improver lane 是被排除的较高水平。',
        en: 'Sentence 4: "that puts you in the beginner group", so fill beginner. The improver lane is the higher level ruled out.',
      },
    },
    {
      number: 2, accepted: ['six', '6'], evidence: 6,
      explanation: {
        zh: '定位句 6：One coach for every six swimmers, so nobody waits too long for a turn。一名教练带六名学员，填 six。',
        en: 'Sentence 6: "one coach for every six swimmers", so fill six.',
      },
    },
    {
      number: 3, accepted: ['eight', '8'], evidence: 8,
      explanation: {
        zh: '定位句 8：Eight weeks in total, with one session each evening。课程共八周，填 eight。句 10 的 week six 是进度节点，不是总周数。',
        en: 'Sentence 8: "eight weeks in total", so fill eight. Week six in sentence 10 is a progress milestone, not the total length.',
      },
    },
    {
      number: 4, accepted: ['B'], evidence: 12,
      explanation: {
        zh: '定位句 12：A swim cap, goggles and a towel. The club supplies the kick boards。自带泳帽、泳镜、毛巾，对应 B。踢水板由俱乐部提供，防晒背心可选。',
        en: 'Sentence 12: bring "a swim cap, goggles and a towel", matching B. Kick boards are supplied; the rash vest is optional.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：Forty-five minutes in the water, plus ten minutes to change before and after。水中课时四十五分钟，对应 A。十分钟是换衣时间，不是游泳时长。',
        en: 'Sentence 16: "forty-five minutes in the water", matching A. The ten minutes are changing time, not swimming time.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：You can join another group at the same level within the same eight weeks。缺课可加入同期同级别另一组，对应 B。不退款、私人一对一补课均未提及。',
        en: 'Sentence 18: join "another group at the same level within the same eight weeks", matching B. No refund and private one-on-one replacement are not mentioned.',
      },
    },
    {
      number: 7, accepted: ['group'], evidence: 18,
      explanation: {
        zh: '定位句 18：join another group at the same level。补课加入另一个同级别组，填 group。',
        en: 'Sentence 18: join "another group at the same level", so fill group.',
      },
    },
    {
      number: 8, accepted: ['Tuesday'], evidence: 22,
      explanation: {
        zh: '定位句 22：Tuesday and Thursday, from seven until a quarter past seven。本组周二和周四上课，题干已印 Thursday，填 Tuesday。',
        en: 'Sentence 22: "Tuesday and Thursday", so fill Tuesday; Thursday is already printed in the row.',
      },
    },
    {
      number: 9, accepted: ['two', '2'], evidence: 24,
      explanation: {
        zh: '定位句 24：The shallow end is just two metres deep, which suits nervous beginners。浅水区两米深，填 two。',
        en: 'Sentence 24: the shallow end is "just two metres deep", so fill two.',
      },
    },
    {
      number: 10, accepted: ['separate'], evidence: 28,
      explanation: {
        zh: '定位句 28：Pool entry is separate. You pay it at the desk each time you arrive。泳池门票另付，填 separate。',
        en: 'Sentence 28: "pool entry is separate", paid at the desk each visit, so fill separate.',
      },
    },
  ],
  transcript: [
    { speaker: 'adviser', text: 'Which level would you like to start from, sir?' },
    { speaker: 'student', text: 'I can float and kick, but I’m still slow on my breathing, so I’m unsure.' },
    { speaker: 'adviser', text: 'We group new swimmers by a short water test on the first evening.' },
    { speaker: 'student', text: 'So would I go in the beginner group rather than the improver lane?' },
    { speaker: 'adviser', text: 'That puts you in the beginner group, yes.' },
    { speaker: 'student', text: 'How many coaches look after one beginner group?' },
    { speaker: 'adviser', text: 'One coach for every six swimmers, so nobody waits too long for a turn.' },
    { speaker: 'student', text: 'And how long does the whole course run?' },
    { speaker: 'adviser', text: 'Eight weeks in total, with one session each evening.' },
    { speaker: 'student', text: 'Is that enough to get comfortable in deep water?' },
    { speaker: 'adviser', text: 'Most beginners can manage a full length by the end of week six.' },
    { speaker: 'student', text: 'What should I bring on the first night?' },
    { speaker: 'adviser', text: 'A swim cap, goggles and a towel. The club supplies the kick boards.' },
    { speaker: 'student', text: 'Do I need to wear a rash vest for the colder lane?' },
    { speaker: 'adviser', text: 'No, the indoor pool stays warm; the vest is optional for open water.' },
    { speaker: 'student', text: 'How long is each lesson on the timetable?' },
    { speaker: 'adviser', text: 'Forty-five minutes in the water, plus ten minutes to change before and after.' },
    { speaker: 'student', text: 'What happens if I miss a class because of work?' },
    { speaker: 'adviser', text: 'You can join another group at the same level within the same eight weeks.' },
    { speaker: 'student', text: 'Is there a fee for that catch-up session?' },
    { speaker: 'adviser', text: 'No, the make-up session is covered in your course price.' },
    { speaker: 'student', text: 'Which evenings do our own group meet?' },
    { speaker: 'adviser', text: 'Tuesday and Thursday, from seven until a quarter past seven.' },
    { speaker: 'student', text: 'My flat is on the bus line, so timing works well.' },
    { speaker: 'adviser', text: 'The shallow end is just two metres deep, which suits nervous beginners.' },
    { speaker: 'student', text: 'Do we ever move into the deep section?' },
    { speaker: 'adviser', text: 'Only after the coach signs off your length swim in the shallow end.' },
    { speaker: 'student', text: 'What about pool entry fees? Are they added to the course price?' },
    { speaker: 'adviser', text: 'Pool entry is separate. You pay it at the desk each time you arrive.' },
    { speaker: 'student', text: 'Can I leave my wet kit in the locker overnight?' },
    { speaker: 'adviser', text: 'Better to take it home. Lockers empty at ten, and wet bags can smell.' },
    { speaker: 'student', text: 'What if the pool closes for a maintenance week?' },
    { speaker: 'adviser', text: 'Those sessions move to the following month, and we email the new dates.' },
    { speaker: 'student', text: 'Is the changing room shared with the public sessions?' },
    { speaker: 'adviser', text: 'It is booked for our course during these two hours, so it stays private.' },
    { speaker: 'student', text: 'I’ll fill the form after we finish talking.' },
    { speaker: 'adviser', text: 'Fine. The desk needs your emergency contact and a signed health note.' },
    { speaker: 'student', text: 'Any swimming in the first week beyond the water test?' },
    { speaker: 'adviser', text: 'We walk through the ladder and the backstroke kick before you swim a length.' },
    { speaker: 'student', text: 'Good. I’ll pay the course fee by card at the desk.' },
    { speaker: 'adviser', text: 'Welcome aboard. Your first evening is next Tuesday at seven sharp.' },
  ],
  vocabulary: [
    {
      term: 'beginner', phonetic: '/bɪˈɡɪnə/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '初学者，初级学员', en: 'a swimmer starting from the basic level' },
      usage: { zh: '可数；the beginner group、a nervous beginner。', en: 'Countable: the beginner group, a nervous beginner.' },
      collocations: ['the beginner group', 'a nervous beginner', 'complete beginner'],
      example: { en: 'The beginner group meets twice a week.', zh: '初级组每周上两次课。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈɡɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'coach', phonetic: '/kəʊtʃ/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '教练', en: 'the instructor who leads the swimming group' },
      usage: { zh: '可数；one coach、the swimming coach。', en: 'Countable: one coach, the swimming coach.' },
      collocations: ['one coach', 'the swimming coach', 'the coach signs off'],
      example: { en: 'One coach looks after six swimmers.', zh: '一名教练带六名学员。' },
      listening: { zh: '单音节，尾音 /tʃ/ 完整读出。', en: 'One syllable; keep the final /tʃ/.' },
    },
    {
      term: 'goggles', phonetic: '/ˈɡɒɡlz/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '泳镜', en: 'the sealed eye wear used in the pool' },
      usage: { zh: '恒用复数；a pair of goggles、wear goggles。', en: 'Always plural: a pair of goggles, wear goggles.' },
      collocations: ['a pair of goggles', 'wear goggles', 'the swim goggles'],
      example: { en: 'Bring goggles that seal around the eyes.', zh: '带上能包住眼眶的泳镜。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɡɒ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'catch-up', phonetic: '/ˈkætʃ ʌp/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '补课，追补课程', en: 'a session that replaces a missed class' },
      usage: { zh: '可数；a catch-up session、the catch-up class。动词 catch up。', en: 'Countable: a catch-up session; the verb is catch up.' },
      collocations: ['a catch-up session', 'the catch-up class', 'book a catch-up'],
      example: { en: 'The make-up session covers the missed week.', zh: '补课补上落下的一周。' },
      listening: { zh: '复合词，重音落在 catch 上。', en: 'Compound; stress falls on catch.' },
    },
    {
      term: 'shallow', phonetic: '/ˈʃæləʊ/', partOfSpeech: 'adj.', sentenceIndex: 24,
      meaning: { zh: '浅的（水区）', en: 'where the water does not reach a great depth' },
      usage: { zh: '形容词；the shallow end、shallow water。反义 deep。', en: 'Adjective: the shallow end, shallow water; the opposite is deep.' },
      collocations: ['the shallow end', 'shallow water', 'the shallow section'],
      example: { en: 'The shallow end suits nervous beginners.', zh: '浅水区适合紧张的初学者。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈʃæ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'separate', phonetic: '/ˈseprət/', partOfSpeech: 'adj.', sentenceIndex: 28,
      meaning: { zh: '另行收取的，分开的', en: 'paid apart from the course price' },
      usage: { zh: '形容词；pool entry is separate、a separate fee。动词 /ˈsepəreɪt/。', en: 'Adjective: a separate fee; the verb is pronounced /ˈsepəreɪt/.' },
      collocations: ['a separate fee', 'paid separately', 'entry is separate'],
      example: { en: 'Pool entry is paid separately at the desk.', zh: '泳池门票在前台另付。' },
      listening: { zh: '形容词三个音节，重音在第一音节。', en: 'Three syllables; adjective stress on the first.' },
    },
    {
      term: 'maintenance', phonetic: '/ˈmeɪntənəns/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '维护，检修（闭馆）', en: 'the scheduled repair work that closes the pool' },
      usage: { zh: '不可数；a maintenance week、pool maintenance。', en: 'Uncountable: a maintenance week, pool maintenance.' },
      collocations: ['a maintenance week', 'pool maintenance', 'during maintenance'],
      example: { en: 'The pool closes for a maintenance week.', zh: '泳池因检修闭馆一周。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈmeɪn/。', en: 'Three syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'signs off', sentenceIndex: 26,
      meaning: { zh: '签字认可，获准（进入深水区）', en: 'to approve that a swimmer is ready' },
      usage: { zh: '短语动词；the coach signs off your length swim、sign off on the request。', en: 'The coach signs off the swim; compare sign off on.' },
      example: { en: 'The coach signs off the length first.', zh: '教练先签字认可游完一趟。' },
    },
    {
      phrase: 'covered in', sentenceIndex: 20,
      meaning: { zh: '包含在（价格）内', en: 'included in the amount already paid' },
      usage: { zh: '被动短语；the session is covered in the price。', en: 'The session is covered in the price; compare included in.' },
      example: { en: 'The make-up session is covered in the course price.', zh: '补课含在课程费内。' },
    },
    {
      phrase: 'on the bus line', sentenceIndex: 23,
      meaning: { zh: '在公交沿线', en: 'reachable along a bus route' },
      usage: { zh: '介词短语；live on the bus line、the flat is on the line。', en: 'On the bus line means served by a bus route.' },
      example: { en: 'My flat is on the bus line.', zh: '我公寓在公交沿线。' },
    },
    {
      phrase: 'beyond the water test', sentenceIndex: 37,
      meaning: { zh: '入水测试之外（的内容）', en: 'apart from the entry-level water assessment' },
      usage: { zh: '固定短语；beyond the test、beyond the first session。', en: 'Beyond means apart from; compare after the test.' },
      example: { en: 'Any swimming beyond the water test?', zh: '除了入水测试还有游泳内容吗？' },
    },
    {
      phrase: 'welcome aboard', sentenceIndex: 40,
      meaning: { zh: '欢迎加入（课程）', en: 'the friendly closing after booking is confirmed' },
      usage: { zh: '固定寒暄；welcome aboard the course、welcome aboard the team。', en: 'Welcome aboard after sign-up; originally for a ship or flight.' },
      example: { en: 'Welcome aboard the beginner course.', zh: '欢迎加入初级课程。' },
    },
  ],
  tips: [
    {
      title: { zh: '先记水平再记配比', en: 'Note level before ratio' },
      body: {
        zh: '前三空依次是水平组别、教练配比、课程周数。听到 beginner 别写成 improver；six 是每名教练带的人数；eight 是总周数，week six 只是进度节点。',
        en: 'The first three blanks are level, coach ratio and course length. Write beginner, not improver; six is the swimmer-to-coach ratio; eight is the total weeks, while week six is only a milestone.',
      },
    },
    {
      title: { zh: '自带与提供分清', en: 'Separate brought gear from supplied gear' },
      body: {
        zh: '泳帽、泳镜、毛巾自带；踢水板俱乐部提供；防晒背心仅开放水域可选。单选题问必须自带时，别把提供项和可选项混进答案。',
        en: 'Cap, goggles and towel are brought; kick boards are supplied; the rash vest is open-water optional. For the must-bring question, do not mix supplied or optional items in.',
      },
    },
    {
      title: { zh: '补课条款抓同期同级', en: 'Catch-up stays same period and level' },
      body: {
        zh: '补课只能在同一八周课程内、加入同级别另一个组，且不再另收费。听到 another group、same level、covered in the price 就把这三个条件标在选项旁。',
        en: 'The catch-up stays within the same eight weeks, in another same-level group, at no extra fee. Mark another group, same level and covered in the price beside the options.',
      },
    },
  ],
};
