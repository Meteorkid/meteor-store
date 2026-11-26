import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 7 · Part 1 — 家长为孩子咨询钢琴课（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：孩子年龄与姓名 → 老师资质 → 上课时段 → 试听课费用 → 家用乐器，
 * 后半段再谈教龄、考级、月费、音乐会门票与补课规则。填空块在前半段，单选块在后半段，
 * 题块顺序与录音顺序一致。
 */
export const test07Part1: ListeningLesson = {
  slug: 'test-07-part-1',
  part: 1,
  status: 'published',
  title: { zh: '为孩子约钢琴课', en: 'Arranging piano lessons for a child' },
  summary: {
    zh: '一位母亲致电音乐工作室，为七岁的女儿咨询钢琴课：登记孩子年龄与姓名，了解老师资质、可选上课日、试听课安排、家用乐器要求，以及教龄、考级、月费、音乐会门票和补课规则。',
    en: 'A mother calls a music studio to arrange piano lessons for her seven-year-old daughter: she registers the child, learns about the teacher’s qualifications, the available lesson days, the trial session, the home instrument, and then the teacher’s experience, exams, monthly fee, concert tickets and make-up lessons.',
  },
  accent: { zh: '家长为美式口音，课程顾问为澳式口音。', en: 'The parent speaks with an American accent and the adviser with an Australian accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'parent', label: 'PARENT', gender: 'female', voice: 'en-US-JennyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Daughter’s age', cells: [[{ blank: 1 }]] },
        { lead: 'Teacher’s main qualification', cells: [[{ blank: 2 }]] },
        { lead: 'Lesson day', cells: [[{ blank: 3 }]] },
        { lead: 'Trial lesson for families who enrol that week', cells: [[{ blank: 4 }]] },
        { lead: 'Instrument needed at home at first', cells: [[{ blank: 5 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'What does the adviser say about the teacher, Elena?',
          options: [
            { key: 'A', text: 'She recently finished her training.' },
            { key: 'B', text: 'She has taught young children for many years.' },
            { key: 'C', text: 'She mainly works with adult learners.' },
          ],
        },
        {
          number: 7,
          stem: 'What does the adviser say about piano exams?',
          options: [
            { key: 'A', text: 'They are required after the first year.' },
            { key: 'B', text: 'They are optional and decided by each family.' },
            { key: 'C', text: 'They are held once every term.' },
          ],
        },
        {
          number: 8,
          stem: 'What does the monthly fee include?',
          options: [
            { key: 'A', text: 'concert tickets' },
            { key: 'B', text: 'a make-up session' },
            { key: 'C', text: 'music sheets' },
          ],
        },
        {
          number: 9,
          stem: 'What does the adviser say about concert tickets?',
          options: [
            { key: 'A', text: 'They are free for family members.' },
            { key: 'B', text: 'They are added to the monthly fee.' },
            { key: 'C', text: 'They must be bought at the door.' },
          ],
        },
        {
          number: 10,
          stem: 'What happens if a child misses a lesson?',
          options: [
            { key: 'A', text: 'A Saturday make-up can be booked with notice.' },
            { key: 'B', text: 'The monthly fee is reduced for that week.' },
            { key: 'C', text: 'The place is given to another child.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['seven', '7'], evidence: 3,
      explanation: {
        zh: '定位句 3：家长先说 eight，随即自我修正为 seven，句末又确认 she’s seven now。听到 hold on、no 这类改口词时，要以修正后的数字为准；eight 是干扰项。',
        en: 'Sentence 3: the parent first says eight, then corrects herself to seven, and ends with she’s seven now. When you hear hold on or no, take the corrected number; eight is the distractor.',
      },
    },
    {
      number: 2, accepted: ['diploma'], evidence: 10,
      explanation: {
        zh: '定位句 10：She holds a diploma in piano performance。空前提到 qualification，听到 holds a … in piano performance 即可锁定 diploma；four years ago 是入职年限，不是资质名称。',
        en: 'Sentence 10: "She holds a diploma in piano performance". The note asks for the qualification, so diploma fits; four years ago is how long she has worked here, not the qualification itself.',
      },
    },
    {
      number: 3, accepted: ['Thursday'], evidence: 17,
      explanation: {
        zh: '定位句 17：there are two places left on that Thursday group。句 14 先列出 Tuesday、Thursday、Saturday 三个选项，家长排除了 Tuesday，顾问确认的是 Thursday；Saturday 只是备选时段。',
        en: 'Sentence 17: "there are two places left on that Thursday group". Sentence 14 lists Tuesday, Thursday and Saturday; the parent rules Tuesday out and the adviser confirms Thursday. Saturday remains an alternative only.',
      },
    },
    {
      number: 4, accepted: ['free'], evidence: 22,
      explanation: {
        zh: '定位句 22：if you enrol that same week, the trial is free。前半句的 fifteen pounds 是单独试听的价格，属于干扰；条件是“当周报名”，满足后试听才免费。',
        en: 'Sentence 22: "if you enrol that same week, the trial is free". The fifteen pounds earlier is the price of a standalone trial, a distractor; free applies only when the family enrols that week.',
      },
    },
    {
      number: 5, accepted: ['keyboard'], evidence: 27,
      explanation: {
        zh: '定位句 27：a portable keyboard is enough。顾问明确说前几个月不需要 upright piano，所以家用乐器填 keyboard；upright piano 是被否定的干扰项。',
        en: 'Sentence 27: "a portable keyboard is enough". The adviser says an upright piano is not needed at first, so keyboard is the answer; upright piano is the rejected distractor.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 32,
      explanation: {
        zh: '定位句 32：She has been working with young children for eleven years now。十一年教儿童对应 many years。A 与句 10 的 diploma 相反（早已毕业），C 与 young children 相反。',
        en: 'Sentence 32: "She has been working with young children for eleven years now". Eleven years with young children matches many years. A contradicts the diploma in sentence 10, and C contradicts young children.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 34,
      explanation: {
        zh: '定位句 34：Exams here are entirely optional, and the decision is up to each family。optional 加 up to the family 对应“可选、由家庭决定”。A 与 optional 相反，C 的 every term 在录音里没有出现。',
        en: 'Sentence 34: "Exams here are entirely optional, and the decision is up to each family". Optional and up to the family match B. A contradicts optional, and every term is never mentioned.',
      },
    },
    {
      number: 8, accepted: ['C'], evidence: 38,
      explanation: {
        zh: '定位句 38：that covers all the music sheets she needs。月费包含乐谱。音乐会门票在句 40 单独说明免费，不属于月费；补课在句 42 是另安排的周六场次。',
        en: 'Sentence 38: "that covers all the music sheets she needs". The monthly fee covers music sheets. Concert tickets are dealt with separately in sentence 40, and make-up lessons in sentence 42.',
      },
    },
    {
      number: 9, accepted: ['A'], evidence: 40,
      explanation: {
        zh: '定位句 40：the concert tickets are free for family members。同义替换：free for family members 与 A 逐义对应。B 说门票并入月费，与句 38 的 music sheets 混淆；C 说门口购票，录音否定了收费。',
        en: 'Sentence 40: "the concert tickets are free for family members", which matches A word for word. B confuses tickets with the music sheets in sentence 38, and C contradicts the free admission.',
      },
    },
    {
      number: 10, accepted: ['A'], evidence: 42,
      explanation: {
        zh: '定位句 42：You can book a make-up session on a Saturday, as long as you let us know before the lesson starts。条件是提前告知，对应 A。B 的费用减免和 C 的名额转给他人在录音中均未提及。',
        en: 'Sentence 42: "You can book a make-up session on a Saturday, as long as you let us know before the lesson starts". The condition is advance notice, matching A. A fee reduction and giving the place away are never mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'adviser', text: 'I’m Tom from the Northgate Music Studio, and you’re through to the lessons desk.' },
    { speaker: 'parent', text: 'Hi, I saw your website last night, and I would like to arrange piano lessons for my daughter.' },
    { speaker: 'adviser', text: 'That’s lovely. Welcome. Before I go any further, how old is she?' },
    { speaker: 'parent', text: 'She’s eight, hold on, no, seven. She had her birthday back in March, so she’s seven now.' },
    { speaker: 'adviser', text: 'Seven is a really good age to begin. And what’s her full name?' },
    { speaker: 'parent', text: 'Poppy Hale. That’s P, O, P, P, Y, and Hale, H, A, L, E.' },
    { speaker: 'adviser', text: 'Thank you, Poppy Hale. Has she played any instrument before?' },
    { speaker: 'parent', text: 'Not really. She sings in the school choir, but she has never sat down at a piano.' },
    { speaker: 'adviser', text: 'That’s completely fine. Our beginners’ group is built for children with no experience at all.' },
    { speaker: 'parent', text: 'And who would be teaching that group?' },
    { speaker: 'adviser', text: 'The lead teacher is Elena Marsh. She holds a diploma in piano performance, and she joined us four years ago.' },
    { speaker: 'parent', text: 'That sounds reassuring. I was half afraid she might get a brand new graduate.' },
    { speaker: 'adviser', text: 'Not at all. Elena looks after the whole beginners’ track, so she knows exactly how nervous first lessons can be.' },
    { speaker: 'parent', text: 'Wonderful. Now, what days do the lessons run on?' },
    { speaker: 'adviser', text: 'We have the beginners’ group on Tuesday and Thursday afternoons, and a few Saturday morning places are still open.' },
    { speaker: 'parent', text: 'Tuesday is out, she has swimming then. What about the Thursday group?' },
    { speaker: 'adviser', text: 'Thursday after school, from four thirty to five fifteen. Let me check the register for you.' },
    { speaker: 'adviser', text: 'Yes, there are two places left on that Thursday group.' },
    { speaker: 'parent', text: 'Thursday works for us, then.' },
    { speaker: 'parent', text: 'Do we need to come along for a trial lesson before she joins?' },
    { speaker: 'adviser', text: 'Yes, every new child has a trial session before they enter the group.' },
    { speaker: 'parent', text: 'How much does that trial cost?' },
    { speaker: 'adviser', text: 'It’s fifteen pounds on its own, but if you enrol that same week, the trial is free.' },
    { speaker: 'parent', text: 'Free, that’s good. When could the trial be?' },
    { speaker: 'adviser', text: 'The next trial session is on the twelfth of April, at four o’clock in the afternoon.' },
    { speaker: 'parent', text: 'The twelfth of April. I’ll write that down before I forget.' },
    { speaker: 'parent', text: 'Now, do we need to have a piano at home? We live in a fairly small flat.' },
    { speaker: 'adviser', text: 'For the first few months, a portable keyboard is enough. You do not need to buy an upright piano straight away.' },
    { speaker: 'parent', text: 'A keyboard, right. Does the studio lend one out for home practice?' },
    { speaker: 'adviser', text: 'I’m afraid not. The keyboards here stay in the practice rooms, and families arrange their own instrument.' },
    { speaker: 'parent', text: 'That’s fair enough.' },
    { speaker: 'parent', text: 'How long has Elena been teaching, actually? You mentioned her diploma, but not her years.' },
    { speaker: 'adviser', text: 'She has been working with young children for eleven years now, and she still enjoys every group.' },
    { speaker: 'parent', text: 'And what about exams? I really don’t want her pushed into tests too early.' },
    { speaker: 'adviser', text: 'You won’t be. Exams here are entirely optional, and the decision is up to each family.' },
    { speaker: 'adviser', text: 'Most children wait until they have studied for two years before they enter for anything.' },
    { speaker: 'parent', text: 'That matches what I hoped to hear.' },
    { speaker: 'parent', text: 'How much are the regular lessons, by the way?' },
    { speaker: 'adviser', text: 'The group sessions are thirty pounds a month, and that covers all the music sheets she needs.' },
    { speaker: 'parent', text: 'Thirty a month. Is there anything extra to pay for the end of term concert?' },
    { speaker: 'adviser', text: 'No, the concert tickets are free for family members, so you can bring as many relatives as you like.' },
    { speaker: 'parent', text: 'What if she misses a week because she is ill or away?' },
    { speaker: 'adviser', text: 'You can book a make-up session on a Saturday, as long as you let us know before the lesson starts.' },
    { speaker: 'parent', text: 'That’s fair. One last thing, can I reach you on this contact number?' },
    { speaker: 'parent', text: 'It’s oh seven nine three, four six two, eight one five.', displayText: 'It’s 0793 462 815.' },
    { speaker: 'adviser', text: 'Got it. I’ll send the trial confirmation to your email this evening.' },
    { speaker: 'parent', text: 'Thank you so much for your help.' },
    { speaker: 'adviser', text: 'You’re welcome. We’ll see you on the twelfth of April.' },
  ],
  vocabulary: [
    {
      term: 'diploma', phonetic: '/dɪˈpləʊmə/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '文凭，毕业证书', en: 'a qualification awarded after completing a course of study' },
      usage: { zh: '可数名词；a diploma in piano performance 指某专业的文凭。', en: 'Countable: a diploma in a subject.' },
      collocations: ['hold a diploma', 'a diploma in music', 'a teaching diploma'],
      example: { en: 'She holds a diploma in early childhood education.', zh: '她持有幼儿教育专业文凭。' },
      listening: { zh: '重音在第二音节 /ˈpləʊ/，不要听成 diplomat（外交官）。', en: 'Stress the second syllable; do not confuse it with diplomat.' },
    },
    {
      term: 'beginners', phonetic: '/bɪˈɡɪnəz/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '初学者，新手', en: 'people who are learning something for the first time' },
      usage: { zh: '复数名词；beginners’ group 指初级班，所有格加撇号。', en: 'Plural; a beginners’ group is a class for new learners.' },
      collocations: ['a beginners’ group', 'complete beginners', 'a course for beginners'],
      example: { en: 'This book is written for complete beginners.', zh: '这本书是为完全零基础的人写的。' },
      listening: { zh: '重音在第二音节 /ˈɡɪ/，结尾 -ers 弱读成 /əz/。', en: 'Stress the second syllable; the ending -ers is a weak /əz/.' },
    },
    {
      term: 'register', phonetic: '/ˈredʒɪstə/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '名册，登记表', en: 'an official list of names and places' },
      usage: { zh: '可数名词；check the register 指查看报名名册。同形动词表示“登记”。', en: 'Countable: check the register. The same word is a verb meaning to record.' },
      collocations: ['check the register', 'the class register', 'on the register'],
      example: { en: 'Your name is still on the register for next term.', zh: '你的名字还在下学期的名册上。' },
      listening: { zh: '三个音节，重音在第一个；与 region（地区）开头相近，靠语境区分。', en: 'Three syllables with first-syllable stress; context separates it from region.' },
    },
    {
      term: 'trial', phonetic: '/ˈtraɪəl/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '试听课，试用环节', en: 'a short session to see whether something suits you' },
      usage: { zh: '可数名词；trial lesson、trial session 是报名前的试听安排。', en: 'Countable: a trial lesson or trial session before enrolment.' },
      collocations: ['a trial lesson', 'a free trial', 'on trial'],
      example: { en: 'You can take a trial class before you sign the contract.', zh: '签合同前你可以先上一节试听课。' },
      listening: { zh: '两个音节，/ˈtraɪ/ 里是双元音 /aɪ/，不要拆成 try 加弱读。', en: 'Two syllables with the diphthong /aɪ/ in the first.' },
    },
    {
      term: 'portable', phonetic: '/ˈpɔːtəbl/', partOfSpeech: 'adj.', sentenceIndex: 27,
      meaning: { zh: '便携的，可手提的', en: 'light enough to be carried easily' },
      usage: { zh: '放在名词前：a portable keyboard、a portable charger。', en: 'Used before a noun: a portable keyboard.' },
      collocations: ['a portable keyboard', 'a portable device', 'portable furniture'],
      example: { en: 'The portable speaker fits into a small bag.', zh: '这个便携音箱能塞进小包里。' },
      listening: { zh: '三个音节，重音在第一个；结尾 -able 读 /əbl/。', en: 'Three syllables with stress on the first; -able is /əbl/.' },
    },
    {
      term: 'optional', phonetic: '/ˈɒpʃənl/', partOfSpeech: 'adj.', sentenceIndex: 34,
      meaning: { zh: '可选的，非强制的', en: 'something you can choose to do, but do not have to do' },
      usage: { zh: '与 compulsory、required 相对；an optional exam、optional extras。', en: 'The opposite of compulsory or required: an optional exam.' },
      collocations: ['optional extras', 'an optional module', 'purely optional'],
      example: { en: 'The evening workshop is optional, so you may leave early.', zh: '晚间工作坊是可选的，你可以提前离开。' },
      listening: { zh: '三个音节，重音在第一个；/ɒp/ 后面的 /ʃ/ 要读清楚。', en: 'Three syllables with first-syllable stress; listen for the /ʃ/ after /ɒp/.' },
    },
    {
      term: 'make-up', phonetic: '/ˈmeɪk ʌp/', partOfSpeech: 'adj.', sentenceIndex: 42,
      meaning: { zh: '补课的，补做的', en: 'arranged to replace a missed session' },
      usage: { zh: '作定语用连字符：a make-up session、a make-up lesson；名词 makeup 指化妆品，拼写无连字符。', en: 'Hyphenated as an adjective: a make-up session. The noun makeup means cosmetics.' },
      collocations: ['a make-up session', 'a make-up lesson', 'book a make-up'],
      example: { en: 'Students who were ill can attend a make-up class on Saturday.', zh: '生病的学生可以参加周六的补课。' },
      listening: { zh: '重音落在 make 上；连读时 up 的 /ʌ/ 很轻。', en: 'Stress falls on make; the /ʌ/ in up is weak.' },
    },
    {
      term: 'confirmation', phonetic: '/ˌkɒnfəˈmeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 45,
      meaning: { zh: '确认函，确认通知', en: 'a message showing that a booking has been arranged' },
      usage: { zh: '可数名词；a confirmation email、receive confirmation。表示“确认”这一行为时不可数。', en: 'Countable: a confirmation email. The act of confirming is uncountable.' },
      collocations: ['a confirmation email', 'send confirmation', 'written confirmation'],
      example: { en: 'You will get a confirmation email once the place is booked.', zh: '名额登记成功后你会收到确认邮件。' },
      listening: { zh: '五个音节，重音在第四个 /ˈmeɪ/，前面的音节快速带过。', en: 'Five syllables with stress on the fourth; the earlier syllables run together.' },
    },
  ],
  expressions: [
    {
      phrase: 'arrange piano lessons', sentenceIndex: 1,
      meaning: { zh: '安排钢琴课', en: 'to book or organise a series of music lessons' },
      usage: { zh: 'arrange 后接名词；也可说 arrange for somebody to do something。', en: 'Arrange takes a noun; arrange for somebody to do something is also common.' },
      example: { en: 'I called to arrange guitar lessons for my son.', zh: '我打电话来给儿子安排吉他课。' },
    },
    {
      phrase: 'hold on', sentenceIndex: 3,
      meaning: { zh: '等等，稍等（用于改口前停顿）', en: 'a short pause while you check or correct yourself' },
      usage: { zh: '口语里常用于想起正确信息前的停顿；hold on 也可表示“别挂电话”。', en: 'A spoken pause before a correction; it can also mean stay on the line.' },
      example: { en: 'Hold on, I think I wrote the wrong date down.', zh: '等等，我好像把日期记错了。' },
    },
    {
      phrase: 'on its own', sentenceIndex: 22,
      meaning: { zh: '单独地，不附带其他安排', en: 'separately, without anything else included' },
      usage: { zh: '此处指试听单独购买的价格；也可表示“独自”。', en: 'Here it means bought separately; it can also mean alone.' },
      example: { en: 'The trial class costs twenty pounds on its own.', zh: '试听课单独购买要二十英镑。' },
    },
    {
      phrase: 'straight away', sentenceIndex: 27,
      meaning: { zh: '立刻，马上', en: 'immediately, without waiting' },
      usage: { zh: '口语常用，同义的有 at once、right away。', en: 'Spoken synonym of at once or right away.' },
      example: { en: 'You do not need to buy the books straight away.', zh: '你不必立刻把书买齐。' },
    },
    {
      phrase: 'up to each family', sentenceIndex: 34,
      meaning: { zh: '由每个家庭自行决定', en: 'for each family to decide' },
      usage: { zh: 'be up to somebody 表示“由某人决定”；后接名词或动词原形。', en: 'Be up to somebody means it is their decision; follow with a noun or verb.' },
      example: { en: 'Whether to enter for the exam is up to you.', zh: '要不要报考由你决定。' },
    },
    {
      phrase: 'covers all the music sheets', sentenceIndex: 38,
      meaning: { zh: '包含全部乐谱费用', en: 'includes the cost of all the sheet music' },
      usage: { zh: 'cover 在收费语境里表示“包含、抵付”；sheet music 是乐谱的标准说法。', en: 'Cover means to include the cost of; sheet music is the standard term.' },
      example: { en: 'The course fee covers all the materials you need.', zh: '课程费用包含你需要的全部材料。' },
    },
    {
      phrase: 'let us know', sentenceIndex: 42,
      meaning: { zh: '告知，通知', en: 'to tell somebody about something' },
      usage: { zh: '口语常用；let us know before the lesson starts 指提前通知。', en: 'Common in speech; let us know before something happens means in advance.' },
      example: { en: 'Please let us know if you cannot attend.', zh: '如果不能参加，请告知我们。' },
    },
  ],
  tips: [
    {
      title: { zh: '改口之后才是答案', en: 'The corrected version wins' },
      body: {
        zh: 'Part 1 常先给一个错误数字再改口：句 3 先说 eight，再用 hold on, no 改成 seven。听到 no、actually、I mean、hold on 时，准备划掉刚写的内容，以最后一版为准。',
        en: 'Part 1 often opens with a wrong figure and then corrects it: sentence 3 says eight first, then hold on, no, seven. When you hear no, actually, I mean or hold on, be ready to replace what you wrote.',
      },
    },
    {
      title: { zh: '价格先记条件，再记数字', en: 'Note the condition before the price' },
      body: {
        zh: '试听报价分两种情形：单独试听 fifteen pounds，当周报名则 free。听价格时一并记下触发条件（if you enrol that week），否则容易把原价当成答案。',
        en: 'The trial has two prices: fifteen pounds alone, free if you enrol that week. Record the condition along with the price, or you may write the standalone rate instead of the answer.',
      },
    },
    {
      title: { zh: '排除项先划掉', en: 'Cross out ruled-out options' },
      body: {
        zh: '句 15 家长明确说 Tuesday is out，句 27 顾问否定了 upright piano。这类被排除的选项在单选里常做干扰项，听的时候就在选项旁划掉，避免后面回头误选。',
        en: 'Sentence 15 rules Tuesday out, and sentence 27 rejects an upright piano. Ruled-out items are common distractors; cross them out beside the options so you do not drift back to them.',
      },
    },
  ],
};
