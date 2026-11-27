import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 1 · Part 1 — 周末陶艺课报名。原创仿真材料，非官方真题。
 *
 * 原文里的日期、金额、电话号码一律写成英文数词，保证录音读法正确；
 * 页面默认展示同一份文本。只有电话号码这类“口语读法本身会让考生误读”的串，
 * 用 displayText 显示成标准书写，不参与朗读、不改变 transcriptHash；
 * 其余数字保留录音里的英文读法。要改 text 就重跑音频脚本，
 * 指纹对不上的旧录音会被目录层自动丢弃。
 */
export const test01Part1: ListeningLesson = {
  slug: 'test-01-part-1',
  part: 1,
  status: 'published',
  title: { zh: '周末陶艺课报名', en: 'Enrolling in a weekend pottery course' },
  summary: {
    zh: '来电者向社区中心咨询周末陶艺课：开课日期、课时长度、费用、需要自带的物品，以及可以加报的三个工作坊。',
    en: 'A caller asks a community centre about its weekend pottery course: the start date, how long it runs, the fee, what to bring, and three optional workshops.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'receptionist', label: 'RECEPTIONIST', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'caller', label: 'CALLER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Course starts', cells: [[{ blank: 2 }]] },
        { lead: 'Course length', cells: [[{ blank: 3 }, { text: ' weeks' }]] },
        { lead: 'Course fee', cells: [[{ text: '£' }, { blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What does the caller need to bring to the class?',
          options: [
            { key: 'A', text: 'an apron' },
            { key: 'B', text: 'a set of tools' },
            { key: 'C', text: 'a packed lunch' },
          ],
        },
        {
          number: 6,
          stem: 'What does the receptionist say about tools?',
          options: [
            { key: 'A', text: 'They are included in the course fee.' },
            { key: 'B', text: 'They can be bought at the centre on the first day.' },
            { key: 'C', text: 'They must be ordered before the course starts.' },
          ],
        },
        {
          number: 7,
          stem: 'Which class does the caller decide to join?',
          options: [
            { key: 'A', text: 'the beginners’ class' },
            { key: 'B', text: 'the intermediate class' },
            { key: 'C', text: 'the advanced class' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Workshop', 'Day', 'Price'],
      rows: [
        { lead: 'Raku firing', cells: [[{ text: 'Saturday' }], [{ blank: 8 }]] },
        { lead: 'Glazing basics', cells: [[{ blank: 9 }], [{ text: '£15' }]] },
        { lead: { blank: 10 }, cells: [[{ text: 'Sunday' }], [{ text: 'free' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Krause'], evidence: 3,
      explanation: {
        zh: '定位句 3：来电者逐字母拼出 Krause。拼写题先写下首字母 K，再跟着读音补；不要按发音写成 Crouse 或 Crows。',
        en: 'Sentence 3: the caller spells the surname out. Write the first letter, then fill in the rest; do not guess a spelling such as Crouse.',
      },
    },
    {
      number: 2, accepted: ['12 May', 'May 12'], spoken: 'the twelfth of May', evidence: 6,
      explanation: {
        zh: '定位句 6：the next one starts on the twelfth of May。句 34 的 the fifteenth 是第一节课上课的日期，不是课程开始的日期，是干扰项。',
        en: 'Sentence 6: the next course "starts on the twelfth of May". The fifteenth in sentence 34 is the first class, not the start date.',
      },
    },
    {
      number: 3, accepted: ['six', '6'], evidence: 8,
      explanation: {
        zh: '定位句 8：The course runs for six weeks。空格后面已经印了 weeks，所以只填数字；six 和 6 都得分。',
        en: 'Sentence 8: the course "runs for six weeks". The word weeks is already printed, so write the number only; both six and 6 are accepted.',
      },
    },
    {
      number: 4, accepted: ['95', '95 pounds'], spoken: 'ninety-five pounds', evidence: 10,
      explanation: {
        zh: '定位句 10：It’s ninety-five pounds。后面的 twelve pounds（工具）、a hundred and ten（课程加工作坊的总价）、ten pound deposit（订金）都是干扰数字，听到 Course fee 对应的第一笔费用就要落笔。',
        en: 'Sentence 10: "It’s ninety-five pounds". The twelve pounds (tools), the hundred and ten (course plus workshop) and the ten pound deposit are distractors.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 12,
      explanation: {
        zh: '定位句 12：You will need an apron。工具可以在第一天向中心购买（句 14），不属于“必须自带”；午餐全段没有提到。',
        en: 'Sentence 12: "You will need an apron". Tools can be bought at the centre (sentence 14), and lunch is never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：You can buy a starter set from us on the first day。同义替换：can be bought at the centre = buy a starter set from us。A 错在费用不含工具，C 错在不需要提前订购。',
        en: 'Sentence 14: "You can buy a starter set from us on the first day". A is wrong because the fee excludes tools; C is wrong because nothing has to be ordered.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：I’d recommend the intermediate class。来电者先说自己不是 complete beginner，容易让人选 C；但接待员紧接着说 advanced group moves very quickly，否定了高级班。',
        en: 'Sentence 18: "I’d recommend the intermediate class". The caller says he is not a complete beginner, which points to C, but the receptionist rules the advanced group out.',
      },
    },
    {
      number: 8, accepted: ['30', '30 pounds'], spoken: 'thirty pounds', evidence: 22,
      explanation: {
        zh: '定位句 22：It’s very hands-on, and it costs thirty pounds。先用表格首列的 Saturday 和 Workshop 列的 Raku firing 锁定这一行，再等价格。',
        en: 'Sentence 22: "it costs thirty pounds". Use Saturday and Raku firing in the first two columns to find the row, then wait for the price.',
      },
    },
    {
      number: 9, accepted: ['Thursday'], evidence: 26,
      explanation: {
        zh: '定位句 26：It’s on the Thursday evening before the first class。Thursday 在句 8 也出现过（开课日期），这次指的是釉料课的日期。',
        en: 'Sentence 26: "on the Thursday evening before the first class". Thursday also appears in sentence 8 as the start date; here it is the glazing session.',
      },
    },
    {
      number: 10, accepted: ['open studio'], evidence: 28,
      explanation: {
        zh: '定位句 28：That’s the open studio on Sunday evenings。首列已给 Sunday、Price 列是 free，按行找工作坊名称，两个词。',
        en: 'Sentence 28: "That’s the open studio". Sunday and free are already in the row, so you only need the two-word name.',
      },
    },
  ],
  transcript: [
    { speaker: 'receptionist', text: 'Good afternoon, Riverside Community Centre. How can I help you?' },
    { speaker: 'caller', text: 'Hi. I saw a poster about your weekend pottery course, and I’d like to sign up for it.' },
    { speaker: 'receptionist', text: 'Great. It’s one of our most popular courses, so you’re just in time. Can I take your name?' },
    { speaker: 'caller', text: 'Yes, it’s Marcus Krause. That’s K, R, A, U, S, E.' },
    { speaker: 'receptionist', text: 'K, R, A, U, S, E. Got it. And a contact number?' },
    { speaker: 'caller', text: 'It’s oh seven four double six, two one nine, eight three oh.', displayText: 'It’s 07466 219 830.' },
    { speaker: 'receptionist', text: 'Thank you. The current course is fully booked, I’m afraid, but the next one starts on the twelfth of May.' },
    { speaker: 'caller', text: 'The twelfth of May. That’s a Tuesday, isn’t it?' },
    { speaker: 'receptionist', text: 'No, it’s a Thursday. The course runs for six weeks, and all the classes are on Sunday afternoons, from two until five.' },
    { speaker: 'caller', text: 'Sunday afternoons work well for me. How much does it cost?' },
    { speaker: 'receptionist', text: 'It’s ninety-five pounds, and that covers all the clay and the glazes you’ll use.' },
    { speaker: 'caller', text: 'So I don’t need to buy my own clay?' },
    { speaker: 'receptionist', text: 'No, everything like that is provided. You will need an apron, though, because it does get rather messy.' },
    { speaker: 'caller', text: 'Fine, I think I’ve got an old apron somewhere. And what about tools?' },
    { speaker: 'receptionist', text: 'You can buy a starter set from us on the first day, for twelve pounds. We don’t lend tools, I’m afraid.' },
    { speaker: 'caller', text: 'OK. Now, I did a bit of pottery at school, years ago, so I’m not a complete beginner. Which class should I go in?' },
    { speaker: 'receptionist', text: 'How much experience would you say you have?' },
    { speaker: 'caller', text: 'Well, I can centre the clay on the wheel, more or less, but I’ve never glazed anything.' },
    { speaker: 'receptionist', text: 'In that case I’d recommend the intermediate class. The advanced group moves very quickly, and most people find it frustrating at first.' },
    { speaker: 'caller', text: 'All right, the intermediate class it is. Are there any extra workshops I could do while I’m there?' },
    { speaker: 'receptionist', text: 'Yes, three of them. Most people start with the raku firing demonstration on the Saturday before the course begins.' },
    { speaker: 'caller', text: 'What happens in that one?' },
    { speaker: 'receptionist', text: 'You take a finished pot out of the kiln while it’s still red hot, and the glaze cracks in the open air. It’s very hands-on, and it costs thirty pounds.' },
    { speaker: 'caller', text: 'Thirty pounds. Is that suitable for someone at my level?' },
    { speaker: 'receptionist', text: 'Absolutely, it’s open to everyone. Then there’s a session on glazing basics, which I’d really recommend, given what you told me.' },
    { speaker: 'caller', text: 'When is that one?' },
    { speaker: 'receptionist', text: 'It’s on the Thursday evening before the first class, and it’s fifteen pounds.' },
    { speaker: 'caller', text: 'And the third workshop?' },
    { speaker: 'receptionist', text: 'That’s the open studio on Sunday evenings, after the main class. You can stay on and practise whatever you like, and it’s completely free.' },
    { speaker: 'caller', text: 'That sounds ideal. Could I book the glazing session as well as the course?' },
    { speaker: 'receptionist', text: 'Of course. I’ll put you down for both. That’s a hundred and ten pounds in total.' },
    { speaker: 'caller', text: 'Shall I pay now, or on the first day?' },
    { speaker: 'receptionist', text: 'You can pay on the day, but we do ask for a ten pound deposit to hold the place. Would you like to pay that by card?' },
    { speaker: 'caller', text: 'Yes, that’s fine. And just to check, the course starts on Thursday the twelfth of May?' },
    { speaker: 'receptionist', text: 'That’s right. The first class is on Sunday the fifteenth, but you can come in on the Thursday to collect your tools and have a look around.' },
    { speaker: 'caller', text: 'Perfect. Thanks very much for your help.' },
    { speaker: 'receptionist', text: 'You’re welcome. We’ll send you a confirmation email with a map. See you in May.' },
  ],
  vocabulary: [
    {
      term: 'current', phonetic: '/ˈkʌrənt/', partOfSpeech: 'adj.', sentenceIndex: 6,
      meaning: { zh: '当前的，现行的', en: 'belonging to the present time' },
      usage: { zh: '只作定语，放在名词前。the current course 指现在正在进行的这一期课程。', en: 'Used before a noun only. The current course is the one running now.' },
      collocations: ['the current course', 'the current situation', 'current prices'],
      example: { en: 'The current bus timetable expires at the end of the month.', zh: '现行公交时刻表月底失效。' },
      listening: { zh: '重音在第一音节，与 currant（醋栗）同音，靠语境区分。', en: 'Stress the first syllable. It is a homophone of currant, so let the context decide.' },
    },
    {
      term: 'clay', phonetic: '/kleɪ/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '黏土，陶土', en: 'soft sticky earth used for making pots' },
      usage: { zh: '不可数名词，不加 a 也没有复数。', en: 'Uncountable: no article and no plural.' },
      collocations: ['modelling clay', 'a clay pot', 'a lump of clay'],
      example: { en: 'Wet the clay before you try to shape it.', zh: '塑形前先把黏土弄湿。' },
      listening: { zh: '元音是 play 里的双元音 /eɪ/，容易听成 grey。', en: 'The vowel is the diphthong in play; it is easy to mishear as grey.' },
    },
    {
      term: 'apron', phonetic: '/ˈeɪprən/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '围裙', en: 'a piece of cloth worn over the front of the body to keep clothes clean' },
      usage: { zh: '可数名词。也可以指机场的停机坪，Part 4 的交通类讲座里出现过。', en: 'Countable. It can also mean the paved area of an airport where planes park.' },
      collocations: ['put on an apron', 'a kitchen apron'],
      example: { en: 'Put on an apron before you start decorating the cake.', zh: '开始给蛋糕裱花前先系上围裙。' },
      listening: { zh: '首音节读 /eɪ/，不是 /æ/。', en: 'The first syllable is /eɪ/, not /æ/.' },
    },
    {
      term: 'starter', phonetic: '/ˈstɑːtə/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '入门者；入门套装（此处 starter set 指入门工具套装）', en: 'a beginner; here a starter set is a basic kit for beginners' },
      usage: { zh: '常作复合词的定语：a starter set、a starter home、a starter motor。', en: 'Often found in compounds: a starter set, a starter home.' },
      collocations: ['a starter set', 'for starters'],
      example: { en: 'The cookbook comes with a starter set of spices.', zh: '这本食谱附带一套入门香料。' },
      listening: { zh: '英式读音结尾的 r 不卷舌，/ˈstɑːtə/。', en: 'British speakers do not sound the final r.' },
    },
    {
      term: 'centre', phonetic: '/ˈsentə/', partOfSpeech: 'v.', sentenceIndex: 17,
      meaning: { zh: '（动词）使居中；（名词）中心', en: 'verb: to place something exactly in the middle' },
      usage: { zh: '英式拼写为 centre，美式为 center。centre the clay 是陶艺术语：把泥团放在转盘正中。', en: 'British spelling; American is center. To centre the clay is to position it in the middle of the wheel.' },
      collocations: ['centre the clay', 'centre on something'],
      example: { en: 'Centre the photo before you frame it.', zh: '把照片摆正再装框。' },
      listening: { zh: '名词和动词同形，重音都在第一音节，要靠句子结构判断词性。', en: 'The noun and the verb share a spelling and a first-syllable stress; use the grammar to tell them apart.' },
    },
    {
      term: 'frustrating', phonetic: '/frʌˈstreɪtɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 18,
      meaning: { zh: '令人沮丧的，让人有挫败感的', en: 'making you feel annoyed because you cannot do what you want' },
      usage: { zh: '描述事物给人的感受；描述人的感受要用 frustrated。', en: 'Describes things; use frustrated for how a person feels.' },
      collocations: ['deeply frustrating', 'find something frustrating'],
      example: { en: 'It is frustrating when the website keeps crashing.', zh: '网站不断崩溃真让人恼火。' },
      listening: { zh: '重音在第二音节 /ˈstreɪ/。', en: 'Stress the second syllable.' },
    },
    {
      term: 'kiln', phonetic: '/kɪln/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '窑，烧制陶器或烘干物料用的炉子', en: 'a special oven for baking clay pots or drying materials' },
      usage: { zh: '可数名词。工艺类讲座的高频词，常和 fire、glaze、bake 一起出现。', en: 'Countable. Common in talks about crafts, near fire, glaze and bake.' },
      collocations: ['a pottery kiln', 'fire a kiln'],
      example: { en: 'The pots stay in the kiln overnight.', zh: '陶罐要在窑里放一整夜。' },
      listening: { zh: '单音节，字母 l 几乎不发音，听起来接近 kill 加一个很轻的 n。', en: 'One syllable; the l is barely pronounced.' },
    },
    {
      term: 'suitable', phonetic: '/ˈsuːtəbl/', partOfSpeech: 'adj.', sentenceIndex: 23,
      meaning: { zh: '合适的，适宜的', en: 'right for a particular person or purpose' },
      usage: { zh: 'be suitable for somebody or something；比 fit 正式。', en: 'Follow with for: suitable for somebody.' },
      collocations: ['suitable for beginners', 'perfectly suitable'],
      example: { en: 'Is this film suitable for young children?', zh: '这部电影适合小孩看吗？' },
      listening: { zh: 'suit 在这里读 /suːt/，重音在第一音节。', en: 'Pronounced /ˈsuːtəbl/, with stress on the first syllable.' },
    },
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '押金，订金（先付的一部分款项）', en: 'a sum of money paid in advance as part of a larger payment' },
      usage: { zh: '可数名词。租房、订场地、报名场景的高频词：pay a deposit、a refundable deposit。', en: 'Countable. Frequent in accommodation and booking scenes: pay a deposit, a refundable deposit.' },
      collocations: ['pay a deposit', 'a refundable deposit', 'a deposit of'],
      example: { en: 'You need to pay a deposit of two hundred dollars to reserve the room.', zh: '你需要付两百美元订金才能保留房间。' },
      listening: { zh: '重音在第二音节 /ˈpɒz/，与动词 dispose（处理）同根。', en: 'Stress the second syllable; it is related to dispose.' },
    },
    {
      term: 'confirmation', phonetic: '/ˌkɒnfəˈmeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '确认；确认函', en: 'a statement or document showing that something is definitely arranged' },
      usage: { zh: '表示“确认”这一行为时不可数，表示“确认函”时可数：a confirmation email。', en: 'Uncountable for the act, countable for the document.' },
      collocations: ['a confirmation email', 'receive confirmation', 'written confirmation'],
      example: { en: 'You will receive written confirmation of your booking.', zh: '你会收到预订的书面确认。' },
      listening: { zh: '五个音节，重音在第四个 /ˈmeɪ/，前面的音节快速带过。', en: 'Five syllables with stress on the fourth.' },
    },
  ],
  expressions: [
    {
      phrase: 'sign up for', sentenceIndex: 1,
      meaning: { zh: '报名参加', en: 'to register for an activity or course' },
      usage: { zh: '及物时后面接 for；也可以单独用：I signed up online.', en: 'Takes for before the activity, or stands alone: I signed up online.' },
      example: { en: 'I signed up for a first-aid course last week.', zh: '我上周报名了一个急救课程。' },
    },
    {
      phrase: 'just in time', sentenceIndex: 2,
      meaning: { zh: '正好赶上，及时', en: 'at the last moment before it becomes too late' },
      usage: { zh: '与 too late 相对；in time to do something。', en: 'The opposite of too late; follow with to do something.' },
      example: { en: 'We arrived just in time to catch the last train.', zh: '我们正好赶上最后一班火车。' },
    },
    {
      phrase: 'fully booked', sentenceIndex: 6,
      meaning: { zh: '已被预订一空', en: 'with no places left' },
      usage: { zh: '主语是课程、酒店、餐厅；同义表达是 There are no places left.', en: 'The subject is the event or venue. A paraphrase is There are no places left.' },
      example: { en: 'The hotel is fully booked for the whole weekend.', zh: '这家酒店整个周末都订满了。' },
    },
    {
      phrase: 'more or less', sentenceIndex: 17,
      meaning: { zh: '或多或少，差不多', en: 'approximately; not exactly' },
      usage: { zh: '口语里用来弱化语气，暗示“不算完全会”。', en: 'Softens a claim in speech, suggesting not completely.' },
      example: { en: 'The journey takes an hour, more or less.', zh: '路程大约一小时。' },
    },
    {
      phrase: 'hands-on', sentenceIndex: 22,
      meaning: { zh: '动手操作的，实践性强的', en: 'involving active participation rather than just watching' },
      usage: { zh: '可作定语或表语：a hands-on approach；The session is very hands-on.', en: 'Attributive or predicative.' },
      example: { en: 'The workshop is very hands-on, so bring old clothes.', zh: '这个工作坊动手内容很多，穿旧衣服来。' },
    },
    {
      phrase: 'stay on', sentenceIndex: 28,
      meaning: { zh: '继续留下来', en: 'to remain somewhere after others have left or after the usual time' },
      usage: { zh: '不及物短语动词；stay on to do something。', en: 'Intransitive; follow with to do something.' },
      example: { en: 'A few students stayed on to help tidy the lab.', zh: '几个学生留下来帮忙整理实验室。' },
    },
    {
      phrase: 'put you down for', sentenceIndex: 30,
      meaning: { zh: '把你登记在……名下', en: 'to write somebody’s name on a list for something' },
      usage: { zh: 'put somebody down for something，口语常用。', en: 'put somebody down for something' },
      example: { en: 'Shall I put you down for the Friday trip?', zh: '要我给你登记周五的行程吗？' },
    },
    {
      phrase: 'hold the place', sentenceIndex: 32,
      meaning: { zh: '保留名额', en: 'to keep a place reserved for somebody' },
      usage: { zh: 'hold 常与 a place、a room、a table 搭配，表示暂时保留。', en: 'hold a place, hold a room, hold a table.' },
      example: { en: 'Can you hold a table for two until eight?', zh: '能帮我们保留一张两人桌到八点吗？' },
    },
  ],
  tips: [
    {
      title: { zh: '先读限制再听', en: 'Read the limit first' },
      body: {
        zh: 'ONE WORD AND/OR A NUMBER 表示只能填一个词、一个数字，或“一个词加一个数字”（如 12 May）。提前知道空格要什么类型，就不会把 twelve pounds 整个写进去。',
        en: 'ONE WORD AND/OR A NUMBER means one word, or a number, or one word plus a number such as 12 May. Knowing the shape of the answer stops you from writing whole phrases.',
      },
    },
    {
      title: { zh: '以后说的为准', en: 'The last version wins' },
      body: {
        zh: 'Part 1 常出现自我修正：That’s a Tuesday, isn’t it? — No, it’s a Thursday。听到 no、sorry、actually、I mean 时，准备好划掉刚才写的答案。',
        en: 'Part 1 is full of self-corrections. When you hear no, sorry, actually or I mean, be ready to cross out what you just wrote.',
      },
    },
    {
      title: { zh: '拼写题跟读首字母', en: 'Spelling: catch the first letter' },
      body: {
        zh: '字母逐个读出时，先写下第一个字母，再跟着补；易混的 B/D、M/N、P/B 要特别留意。',
        en: 'When a name is spelt out, write the first letter and fill in the rest. Watch for B/D, M/N and P/B.',
      },
    },
  ],
};
