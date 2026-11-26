import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 19 · Part 1 — 报名晚间语言课（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：分班测试时间 → 上课频次 → 教材费与课本 → 随身物品 → 选晚间的原因 →
 * 退费规则 → 缺课补课 → 班级人数 → 课本名称 → 下期开课日期。前填空块、单选块、
 * 后填空块依次推进，题块顺序与录音顺序一致。
 */
export const test19Part1: ListeningLesson = {
  slug: 'test-19-part-1',
  part: 1,
  status: 'published',
  title: { zh: '报名晚间语言课', en: 'Signing up for evening language classes' },
  summary: {
    zh: '一名学员到语言学校报名晚间课程：先参加分班测试确定级别，了解每周两次的上课频次、教材费包含内容与需自购的课本，确认随身物品、选晚间班的原因、开课后的退费规则，以及缺课补课、班级人数、课本名称和下期开课日期。',
    en: 'A student signs up for evening classes at a language school: a placement test sets the level, and the conversation covers the twice-weekly schedule, what the material fee includes and the textbook to buy, what to bring, why evening classes suit the student, refunds after the course begins, catch-up arrangements, maximum class size, the coursebook title and the next start date.',
  },
  accent: { zh: '学员为澳式口音，课程顾问为澳式口音。', en: 'The student and the adviser both speak with Australian accents.' },
  speechRate: '+3%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-AU-NatashaNeural' },
    { id: 'student', label: 'STUDENT', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Placement test held on', cells: [[{ blank: 1 }]] },
        { lead: 'Course meets twice a', cells: [[{ blank: 2 }]] },
        { lead: 'Material fee', cells: [[{ text: '$' }, { blank: 3 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'What should the student bring to the placement test?',
          options: [
            { key: 'A', text: 'The main coursebook' },
            { key: 'B', text: 'A pen and photo identification' },
            { key: 'C', text: 'A completed registration form' },
          ],
        },
        {
          number: 5,
          stem: 'Why does the student choose the evening course?',
          options: [
            { key: 'A', text: 'He works during the day.' },
            { key: 'B', text: 'He prefers studying late at night.' },
            { key: 'C', text: 'The morning classes are already full.' },
          ],
        },
        {
          number: 6,
          stem: 'What happens if the student withdraws after the course has begun?',
          options: [
            { key: 'A', text: 'The full fee is returned minus an admin charge.' },
            { key: 'B', text: 'No refund is possible without a medical note.' },
            { key: 'C', text: 'The remaining sessions can be transferred to a friend.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'A missed class can be made up in a different', cells: [[{ blank: 7 }]] },
        { lead: 'Maximum number of students per class', cells: [[{ blank: 8 }]] },
        { lead: 'Coursebook at this level', cells: [[{ blank: 9 }]] },
        { lead: 'Next course begins on the twelfth of', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Wednesday'], evidence: 5,
      explanation: {
        zh: '定位句 5：It’s held on Wednesday evening, from six thirty until seven forty-five。分班测试在周三晚上；six thirty 是开始时间，不是测试日。',
        en: 'Sentence 5: "It’s held on Wednesday evening, from six thirty until seven forty-five". The test is on Wednesday; six thirty is the start time, not the day.',
      },
    },
    {
      number: 2, accepted: ['week'], evidence: 7,
      explanation: {
        zh: '定位句 7：The standard evening class runs twice a week。频次是每周两次；Mondays and Thursdays 是具体上课日，不填进本空。',
        en: 'Sentence 7: "The standard evening class runs twice a week". The frequency is twice a week; Mondays and Thursdays are the days, not the answer here.',
      },
    },
    {
      number: 3, accepted: ['thirty', '30'], spoken: 'thirty dollars', evidence: 13,
      explanation: {
        zh: '定位句 13：the material fee is thirty dollars, which covers the workbook and the printed handouts。教材费三十美元；coursebook 在句 15 是需自购的另一项，不计入这笔费用。',
        en: 'Sentence 13: "the material fee is thirty dollars, which covers the workbook and the printed handouts". The material fee is thirty dollars; the coursebook in sentence 15 is bought separately and is not part of this fee.',
      },
    },
    {
      number: 4, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：Just a pen and some photo identification。随身带笔和带照片的身份证件，对应 B。A 的课本在句 17 明确说测试前不必买，C 的填好表格在句 34 留到测试结果出来后再填级别。',
        en: 'Sentence 17: "Just a pen and some photo identification". A pen and photo ID match B. The coursebook in A is explicitly not needed before the test, and the form in C has its level left blank until the result.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：I work during the day, so the morning classes don’t suit me at all。白天上班所以选晚间班，对应 A。B 的偏好深夜学习和 C 的上午班满员在录音中均未提到。',
        en: 'Sentence 18: "I work during the day, so the morning classes don’t suit me at all". Working during the day explains the evening choice, matching A. A preference for late-night study and full morning classes are never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：Once the course has begun, we can only refund the remaining sessions if you have a medical note。开课后凭医疗证明才能退剩余课时，对应 B。A 是开课前的退费规则，C 的转赠朋友在录音中没有出现。',
        en: 'Sentence 22: "Once the course has begun, we can only refund the remaining sessions if you have a medical note". After the start, a medical note is required for a refund, matching B. A is the pre-start rule, and transferring sessions to a friend is not mentioned.',
      },
    },
    {
      number: 7, accepted: ['group'], evidence: 24,
      explanation: {
        zh: '定位句 24：You can catch up in a different group at the same level。缺课可补到同级别的另一个班，填 group；level 是班的级别，不是补课时加入的对象。',
        en: 'Sentence 24: "You can catch up in a different group at the same level". The missed class is caught up in another group; level describes the group’s standard, not the place you join.',
      },
    },
    {
      number: 8, accepted: ['twelve', '12'], evidence: 26,
      explanation: {
        zh: '定位句 26：We keep each group to twelve students maximum。每班最多十二人；one or two visitors 是额外旁听人数，不是班级上限。',
        en: 'Sentence 26: "We keep each group to twelve students maximum". The maximum class size is twelve; one or two visitors are extra attendees, not the cap.',
      },
    },
    {
      number: 9, accepted: ['Gateway'], evidence: 28,
      explanation: {
        zh: '定位句 28：At your level it’s the Gateway textbook, the second edition。该级别课本是 Gateway；second edition 是版本，不是书名。',
        en: 'Sentence 28: "At your level it’s the Gateway textbook, the second edition". The coursebook is Gateway; second edition is the version, not the title.',
      },
    },
    {
      number: 10, accepted: ['October'], evidence: 30,
      explanation: {
        zh: '定位句 30：The next intake starts on Friday the twelfth of October。下期开课在十月十二日；Friday 与 twelfth 已在表头提示，填月份 October。',
        en: 'Sentence 30: "The next intake starts on Friday the twelfth of October". The next course begins October twelfth; Friday and twelfth are already printed, so write the month, October.',
      },
    },
  ],
  transcript: [
    { speaker: 'student', text: 'Hello, I’d like to sign up for one of the evening language classes, if there are still places.' },
    { speaker: 'adviser', text: 'Hi there. Sure thing. We run several levels after work, so first we need to place you at the right level.' },
    { speaker: 'student', text: 'Right. I studied some Spanish at school, but I’ve forgotten most of it.' },
    { speaker: 'adviser', text: 'That’s fine. We’ll put you in for a short placement test rather than guess from your old school report.' },
    { speaker: 'student', text: 'When does that test take place?' },
    { speaker: 'adviser', text: 'It’s held on Wednesday evening, from six thirty until seven forty-five in the small room upstairs.' },
    { speaker: 'student', text: 'Wednesday works for me. How often does the actual course meet?' },
    { speaker: 'adviser', text: 'The standard evening class runs twice a week, on Mondays and Thursdays, from seven until nine.' },
    { speaker: 'student', text: 'Twice a week. I was hoping for a single evening, but this should fit around my job.' },
    { speaker: 'adviser', text: 'Most people prefer two shorter sessions rather than one long night, and you get more practice that way.' },
    { speaker: 'student', text: 'What will the test itself involve?' },
    { speaker: 'adviser', text: 'A short reading passage, a few sentences to write, and a brief chat with the teacher at the end.' },
    { speaker: 'student', text: 'Fine. Is there a fee for the materials once I’m placed?' },
    { speaker: 'adviser', text: 'The course itself is listed separately, and the material fee is thirty dollars, which covers the workbook and the printed handouts.' },
    { speaker: 'student', text: 'Thirty dollars. Does that include the main textbook?' },
    { speaker: 'adviser', text: 'Certainly not. The main coursebook you buy yourself from the bookshop next door, and the thirty covers only the loose materials.' },
    { speaker: 'student', text: 'Do I need to bring anything with me to the test?' },
    { speaker: 'adviser', text: 'Just a pen and some photo identification. You don’t need to buy the coursebook before the test.' },
    { speaker: 'student', text: 'I work during the day, so the morning classes don’t suit me at all.' },
    { speaker: 'adviser', text: 'That’s why most of our students take the evening sessions.' },
    { speaker: 'student', text: 'I assume there is some kind of refund arrangement if plans change?' },
    { speaker: 'adviser', text: 'A note on refunds. If you withdraw before the course starts, the full fee is returned minus a small admin charge.' },
    { speaker: 'adviser', text: 'Once the course has begun, we can only refund the remaining sessions if you have a medical note.' },
    { speaker: 'student', text: 'And what if I miss a class through work?' },
    { speaker: 'adviser', text: 'You can catch up in a different group at the same level, provided that group still has space.' },
    { speaker: 'student', text: 'How big are the classes, by the way?' },
    { speaker: 'adviser', text: 'We keep each group to twelve students maximum, so there is room for one or two visitors from another session.' },
    { speaker: 'student', text: 'Which coursebook will we be using?' },
    { speaker: 'adviser', text: 'At your level it’s the Gateway textbook, the second edition, available from the bookshop down the road.' },
    { speaker: 'student', text: 'And when does the next course begin?' },
    { speaker: 'adviser', text: 'The next intake starts on Friday the twelfth of October, after the placement test results are posted.' },
    { speaker: 'student', text: 'Friday the twelfth. Will I hear from you after the test?' },
    { speaker: 'adviser', text: 'Yes, we send the level result by email the following morning, with the class time and the teacher’s name.' },
    { speaker: 'student', text: 'Great. Can I fill the registration form now?' },
    { speaker: 'adviser', text: 'Of course. Put your name and contact number on the top, and leave the level blank for the test result.' },
    { speaker: 'student', text: 'Here you are.' },
    { speaker: 'adviser', text: 'Thanks. I’ll book you in for the Wednesday test, and I’ll see you upstairs at six thirty.' },
    { speaker: 'student', text: 'Will the classroom have any handouts ready on the first night?' },
    { speaker: 'adviser', text: 'Yes, the welcome pack is on your desk before the doors open.' },
    { speaker: 'student', text: 'That’s everything, then. I’ll look out for the level email.' },
    { speaker: 'adviser', text: 'Safe trip home, and good luck with the test.' },
    { speaker: 'student', text: 'Thanks for your help.' },
  ],
  vocabulary: [
    {
      term: 'placement', phonetic: '/ˈpleɪsmənt/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '分班定级；安置', en: 'assigning a student to the right level' },
      usage: { zh: 'placement test 是分班测试；也指实习岗位。', en: 'Placement test sets the level; it also means a work placement.' },
      collocations: ['placement test', 'a placement for', 'level placement'],
      example: { en: 'The placement test decides which evening class you join.', zh: '分班测试决定你上哪个晚间班。' },
      listening: { zh: '两个音节，重音在第一个；与 place 同根。', en: 'Two syllables with first-syllable stress; related to place.' },
    },
    {
      term: 'workbook', phonetic: '/ˈwɜːkbʊk/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '练习册', en: 'a book of exercises that accompanies a coursebook' },
      usage: { zh: '可数名词；coursebook 是课本，workbook 是配套练习册。', en: 'Countable: coursebook is the main book, workbook the exercise book.' },
      collocations: ['the workbook', 'a workbook exercise', 'workbook pages'],
      example: { en: 'The material fee covers the workbook and handouts.', zh: '教材费包含练习册和讲义。' },
      listening: { zh: '复合词，两个重音；中间 /k/ 不脱落。', en: 'A compound with two stresses; the middle /k/ stays.' },
    },
    {
      term: 'identification', phonetic: '/aɪˌdentɪfɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '身份证件', en: 'an official card showing who you are' },
      usage: { zh: '不可数；photo identification、show identification。常缩写 ID，但口语全称要听清。', en: 'Uncountable: photo identification. The short form is ID.' },
      collocations: ['photo identification', 'show identification', 'identification required'],
      example: { en: 'Bring photo identification to the placement test.', zh: '带带照片的身份证件去参加分班测试。' },
      listening: { zh: '五个音节，重音在最后 /ˈkeɪ/。', en: 'Five syllables with stress on the final /ˈkeɪ/.' },
    },
    {
      term: 'refunds', phonetic: '/ˈriːfʌndz/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '退款', en: 'money returned to a student who withdraws' },
      usage: { zh: '名词重音在前；a refund、claim a refund。动词重音在后 /rɪˈfʌnd/。', en: 'Noun stress on the first; the verb stresses the second syllable.' },
      collocations: ['a refund', 'refund arrangement', 'full refund'],
      example: { en: 'The refund rule differs before and after the course starts.', zh: '开课前后的退费规则不同。' },
      listening: { zh: '名词重音在第一音节；别和 refund 动词混。', en: 'Noun stress on the first; distinguish it from the verb.' },
    },
    {
      term: 'group', phonetic: '/ɡruːp/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '班，学习小组', en: 'the set of students in one class' },
      usage: { zh: '可数名词；different group、same level group。', en: 'Countable: different group, same-level group.' },
      collocations: ['a different group', 'the class group', 'join a group'],
      example: { en: 'You can catch up in another group at the same level.', zh: '你可以补到同级别的另一个班。' },
      listening: { zh: '单音节，元音 /uː/；结尾 /p/ 送气轻。', en: 'One syllable with /uː/; the final /p/ is soft.' },
    },
    {
      term: 'intake', phonetic: '/ˈɪnteɪk/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '（一期）招收入学', en: 'the set of students starting a course at one date' },
      usage: { zh: '可数名词；the next intake、autumn intake。', en: 'Countable: the next intake, autumn intake.' },
      collocations: ['the next intake', 'new intake', 'intake date'],
      example: { en: 'The next intake starts on the twelfth of October.', zh: '下一期十月十二日开课。' },
      listening: { zh: '复合词，重音在第一个；/teɪ/ 双元音。', en: 'Compound with first stress; /teɪ/ is a diphthong.' },
    },
    {
      term: 'textbook', phonetic: '/ˈtekstbʊk/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '课本，教科书', en: 'the main book used in a course' },
      usage: { zh: '可数名词；buy the textbook、coursebook 同义。', en: 'Countable: buy the textbook; coursebook is a near synonym.' },
      collocations: ['the main textbook', 'buy a textbook', 'textbook title'],
      example: { en: 'The textbook is bought separately from the material fee.', zh: '课本需在教材费之外另行购买。' },
      listening: { zh: '复合词，两个重音；/kst/ 辅音串。', en: 'Compound with two stresses; keep the /kst/ cluster.' },
    },
  ],
  expressions: [
    {
      phrase: 'sign up for', sentenceIndex: 0,
      meaning: { zh: '报名参加（课程）', en: 'to register for a course or class' },
      usage: { zh: 'sign up for a class；后接课程名。', en: 'Sign up for a class, followed by the course name.' },
      example: { en: 'I’d like to sign up for the evening Spanish course.', zh: '我想报名晚间西班牙语课。' },
    },
    {
      phrase: 'put you in for', sentenceIndex: 3,
      meaning: { zh: '安排你参加（测试）', en: 'to enter someone for a test or event' },
      usage: { zh: 'put somebody in for the test；报名参加某考核。', en: 'Put somebody in for the test, entering them for the assessment.' },
      example: { en: 'We’ll put you in for the placement test this week.', zh: '我们安排你本周参加分班测试。' },
    },
    {
      phrase: 'catch up', sentenceIndex: 24,
      meaning: { zh: '补课，赶上进度', en: 'to make up work missed from a class' },
      usage: { zh: 'catch up in another group；缺课补课场景高频。', en: 'Catch up in another group; common for missed classes.' },
      example: { en: 'You can catch up in a group at the same level.', zh: '你可以到同级别的班里补课。' },
    },
    {
      phrase: 'book you in', sentenceIndex: 36,
      meaning: { zh: '为你登记名额', en: 'to reserve a place for someone' },
      usage: { zh: 'book somebody in for the test；接待场景常用。', en: 'Book somebody in for the test; common on reception.' },
      example: { en: 'I’ll book you in for the Wednesday test.', zh: '我给你登记周三的测试名额。' },
    },
    {
      phrase: 'work during the day', sentenceIndex: 18,
      meaning: { zh: '白天上班', en: 'to be employed through the daytime' },
      usage: { zh: '解释选课时段的常用句；与 in the evening 相对。', en: 'A common reason for an evening class; the opposite of working at night.' },
      example: { en: 'I work during the day, so morning classes do not suit me.', zh: '我白天上班，上午班不适合我。' },
    },
    {
      phrase: 'leave the level blank', sentenceIndex: 34,
      meaning: { zh: '留空（待后填）', en: 'not filled in until later information arrives' },
      usage: { zh: 'leave a field blank；表格填写说明常用。', en: 'Leave a field blank; common in form instructions.' },
      example: { en: 'Leave the level blank until the test result arrives.', zh: '级别一栏留空，等测试结果出来再填。' },
    },
  ],
  tips: [
    {
      title: { zh: '两笔费用分开记', en: 'Keep the two fees separate' },
      body: {
        zh: '第 3 题是教材费 thirty，课本 textbook 需另买，句 15 还出现 bookshop。听数字时连同名目一起记，避免把课本价填进教材费空。',
        en: 'Item 3 asks the material fee, thirty, while the textbook is bought separately and a bookshop appears in sentence 15. Record each figure with what it pays for, so the textbook price does not go into the fee gap.',
      },
    },
    {
      title: { zh: '退费规则按时间分界', en: 'Refunds split by the time line' },
      body: {
        zh: '第 6 题问开课后的退费：开课前 full minus admin，开课后 only with a medical note。选择题常把两条规则互换，听到 before the course starts 与 once the course has begun 先标时间分界。',
        en: 'Item 6 asks post-start refunds: before the start it is full minus an admin charge, after the start only with a medical note. Distractors swap the two rules; mark the time split at before the course starts and once it has begun.',
      },
    },
    {
      title: { zh: '日期题只缺月份或日', en: 'In date gaps, only the missing part' },
      body: {
        zh: '第 10 题表头已印 Friday the twelfth of，空格只填月份 October；第 1 题问星期几，six thirty 是时刻。听日期先看表头给出了哪一部分，别把时刻或星期填进月份空。',
        en: 'Item 10 already prints Friday the twelfth of, so only the month October is missing; item 1 asks the weekday, and six thirty is a time. Check what the header already gives before writing a date answer.',
      },
    },
  ],
};
