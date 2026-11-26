import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 23 · Part 1 — 咨询托儿所名额（双人对话，英式口音）。原创仿真材料，非官方真题。
 *
 * 家长先开口问名额。表单填空 1–4 按对话顺序出现，单选 5–7 落在年龄分班、餐食与等候名单，
 * 表格 8–10 是两次试园与开放上午的安排。题块顺序与录音一致。
 */
export const test23Part1: ListeningLesson = {
  slug: 'test-23-part-1',
  part: 1,
  status: 'published',
  title: { zh: '咨询托儿所名额', en: 'Asking about a nursery place' },
  summary: {
    zh: '家长致电托儿所咨询女儿的名额：姓氏、出生日期、希望入园日期与注册费，接待员介绍三个年龄班的划分、现场供应的热午餐、等候名单规则，并安排两次试园和一次开放上午。',
    en: 'A parent phones about a place for his daughter: surname, date of birth, preferred start date and registration fee. The adviser explains the three age rooms, the hot lunch cooked on site, the waiting list rules, and arranges two trial visits plus an open morning.',
  },
  accent: { zh: '两位说话人均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'parent', label: 'PARENT', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Child’s date of birth', cells: [[{ blank: 2 }]] },
        { lead: 'Preferred start date', cells: [[{ blank: 3 }]] },
        { lead: 'Registration fee', cells: [[{ text: '£' }, { blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'Which room will Elena join first?',
          options: [
            { key: 'A', text: 'the twos room' },
            { key: 'B', text: 'the baby room' },
            { key: 'C', text: 'the threes room' },
          ],
        },
        {
          number: 6,
          stem: 'What meals does the nursery arrange?',
          options: [
            { key: 'A', text: 'a hot lunch cooked on site' },
            { key: 'B', text: 'packed lunches brought from home' },
            { key: 'C', text: 'snacks only, with no lunch provided' },
          ],
        },
        {
          number: 7,
          stem: 'What happens if no place is available on the start date?',
          options: [
            { key: 'A', text: 'the family pays to reserve a place immediately' },
            { key: 'B', text: 'the family joins a free waiting list and hears by post' },
            { key: 'C', text: 'the family waits through a sibling priority queue' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Arrangement', 'Day', 'Time'],
      rows: [
        { lead: 'Trial play session', cells: [[{ blank: 8 }], [{ text: 'ten o’clock' }]] },
        { lead: 'Meeting with key worker', cells: [[{ text: 'Friday' }], [{ blank: 9 }]] },
        { lead: 'Open morning', cells: [[{ blank: 10 }], [{ text: 'until midday' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Barnes'], evidence: 4,
      explanation: {
        zh: '定位句 4：家长逐字母拼出 Barnes。先写下首字母 B，再跟着读音补；注意末尾是 nes，不要写成 Barns。',
        en: 'Sentence 4: the parent spells the surname out as B, A, R, N, E, S. Write the first letter and fill in the rest; watch the final nes and do not write Barns.',
      },
    },
    {
      number: 2, accepted: ['12 March', 'March 12'], spoken: 'the twelfth of March', evidence: 6,
      explanation: {
        zh: '定位句 6：The twelfth of March, two thousand and twenty-three。日期按英式 12 March 书写；年份不进空格，表格只要月日。',
        en: 'Sentence 6: "The twelfth of March, two thousand and twenty-three". Write the date in British order, 12 March. The year is not needed in the gap.',
      },
    },
    {
      number: 3, accepted: ['4 September', 'September 4'], spoken: 'the fourth of September', evidence: 8,
      explanation: {
        zh: '定位句 8：The fourth of September, if that works, after the summer holiday。这是希望的入园日；句 7 的 during the first term 只是时间背景，不是具体日期。',
        en: 'Sentence 8: "The fourth of September, if that works, after the summer holiday". This is the preferred start date. During the first term in sentence 7 is only background timing, not the actual date.',
      },
    },
    {
      number: 4, accepted: ['35'], spoken: 'thirty-five pounds', evidence: 11,
      explanation: {
        zh: '定位句 11：It’s thirty-five pounds。空格前已印 £，只填数字；句 13 的 later start date 是改期规则，不是费用金额。',
        en: 'Sentence 11: "It’s thirty-five pounds". The pound sign is already printed, so write the number only. The later start date in sentence 13 is a rescheduling rule, not a charge.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：She would start in the twos room, because that group covers up to the third birthday。两岁半先进 twos room，对应 A；B 的 baby room 收两岁以下，C 的 threes room 要满三岁。',
        en: 'Sentence 17: "She would start in the twos room, because that group covers up to the third birthday". She starts in the twos room, matching A. The baby room in B is for under twos, and the threes room in C requires age three.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：We cook a hot lunch on site every day, with vegetarian and dairy-free options。现场做热午餐对应 A；B 的自带午餐与句中 you don’t need to pack food 相反，C 说只供点心，漏掉了午餐。',
        en: 'Sentence 21: "We cook a hot lunch on site every day, with vegetarian and dairy-free options". The on-site hot lunch matches A. Packed lunches in B contradict you don’t need to pack food, and C misses the lunch entirely.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：We keep a waiting list for the next intake. There’s no charge to join it, and we write to you by post。免费等候、去信通知对应 B；A 的付费预留与 no charge 相反，C 的兄弟姐妹优先在句 27 只是排序规则，不是普通家庭走的通道。',
        en: 'Sentence 25: "We keep a waiting list for the next intake. There’s no charge to join it, and we write to you by post". A free list with postal contact matches B. Paying to reserve in A contradicts no charge, and the sibling queue in C is only a ranking rule in sentence 27, not the ordinary route.',
      },
    },
    {
      number: 8, accepted: ['Thursday'], evidence: 30,
      explanation: {
        zh: '定位句 30：The first is a trial play session on Thursday morning, starting at ten o’clock。先用首列 Trial play session 和时间 ten o’clock 锁定这一行，缺的是星期 Thursday。',
        en: 'Sentence 30: "The first is a trial play session on Thursday morning, starting at ten o’clock". Use Trial play session and ten o’clock to locate the row; the missing item is the day, Thursday.',
      },
    },
    {
      number: 9, accepted: ['eleven thirty'], evidence: 32,
      explanation: {
        zh: '定位句 32：Then on Friday you meet her key worker for about twenty minutes, at eleven thirty in the small office off the main hall。首列 Meeting with key worker、星期 Friday 已给出，缺的是时间；二十分钟是会面时长，不是时间点。',
        en: 'Sentence 32: "Then on Friday you meet her key worker for about twenty minutes, at eleven thirty in the small office off the main hall.". Meeting with key worker and Friday are printed, so the missing item is the time. Twenty minutes is the meeting length, not the time itself.',
      },
    },
    {
      number: 10, accepted: ['Saturday'], evidence: 34,
      explanation: {
        zh: '定位句 34：The third option is our open morning, which runs on Saturday from ten until midday。首列是开放上午，结束时间 until midday 已印出，缺的是星期 Saturday。',
        en: 'Sentence 34: "The third option is our open morning, which runs on Saturday from ten until midday". The first column is the open morning and until midday is printed, so the missing day is Saturday.',
      },
    },
  ],
  transcript: [
    { speaker: 'parent', text: 'Hi, I’m phoning about a place for my daughter at the nursery on Mill Road.' },
    { speaker: 'adviser', text: 'Good afternoon, thanks for calling. Let me take your details first, and then I can tell you about the groups.' },
    { speaker: 'parent', text: 'That would be lovely. She’s nearly three, and I’d like her to start in the autumn.' },
    { speaker: 'adviser', text: 'Fine. Could I have your surname, please?' },
    { speaker: 'parent', text: 'It’s Barnes. That’s B, A, R, N, E, S.' },
    { speaker: 'adviser', text: 'Barnes, thank you. And your daughter’s date of birth?' },
    { speaker: 'parent', text: 'The twelfth of March, two thousand and twenty-three.' },
    { speaker: 'adviser', text: 'Right, so she’ll turn three during the first term. When were you hoping to start?' },
    { speaker: 'parent', text: 'The fourth of September, if that works, after the summer holiday.' },
    { speaker: 'adviser', text: 'The fourth of September is possible. Now, there’s a one-off registration fee to hold the place.' },
    { speaker: 'parent', text: 'How much is that?' },
    { speaker: 'adviser', text: 'It’s thirty-five pounds, and it covers the registration forms and her first set of belongings.' },
    { speaker: 'parent', text: 'Is it refundable if we change our mind?' },
    { speaker: 'adviser', text: 'I’m afraid not, but it does stay on the account if you move to a later start date.' },
    { speaker: 'parent', text: 'I see. Now, how do you split the children by age?' },
    { speaker: 'adviser', text: 'We have three rooms. The baby room is for under twos, the twos room holds children from two to three, and the threes room takes anyone over three.' },
    { speaker: 'parent', text: 'Elena is two and a half now, so which room would she go into first?' },
    { speaker: 'adviser', text: 'She would start in the twos room, because that group covers up to the third birthday.' },
    { speaker: 'parent', text: 'And does she move across once she turns three?' },
    { speaker: 'adviser', text: 'Yes, at the start of the following term, with a short settling-in period in the new room.' },
    { speaker: 'parent', text: 'What about food? Is lunch provided, or do we send a packed lunch?' },
    { speaker: 'adviser', text: 'We cook a hot lunch on site every day, with vegetarian and dairy-free options, so you don’t need to pack food.' },
    { speaker: 'parent', text: 'What about snacks between meals?' },
    { speaker: 'adviser', text: 'We provide fruit and a light snack in the morning and again in the afternoon, and drinks are water or milk.' },
    { speaker: 'parent', text: 'That sounds good. What if there isn’t a place available on the fourth of September?' },
    { speaker: 'adviser', text: 'We keep a waiting list for the next intake. There’s no charge to join it, and we write to you by post when a place opens up.' },
    { speaker: 'parent', text: 'Is there any priority for families who already have a child here?' },
    { speaker: 'adviser', text: 'Yes, siblings get first look, but everyone else is ordered by the date they joined the list.' },
    { speaker: 'parent', text: 'Could we come and see the nursery before deciding?' },
    { speaker: 'adviser', text: 'Of course. We run two trial visits each month, and I can book both for you.' },
    { speaker: 'adviser', text: 'The first is a trial play session on Thursday morning, starting at ten o’clock, when parents can watch the free play.' },
    { speaker: 'parent', text: 'Thursday, ten o’clock.' },
    { speaker: 'adviser', text: 'Then on Friday you meet her key worker for about twenty minutes, at eleven thirty in the small office off the main hall.' },
    { speaker: 'parent', text: 'Eleven thirty on Friday. That works around my other meetings.' },
    { speaker: 'adviser', text: 'The third option is our open morning, which runs on Saturday from ten until midday, so you can speak to several parents at once.' },
    { speaker: 'parent', text: 'I think I’d prefer the two weekday visits, but I might drop in on the open morning too.' },
    { speaker: 'adviser', text: 'Fine. I’ll reserve the Thursday session and the Friday meeting, and send the open morning details by email.' },
    { speaker: 'parent', text: 'What should we bring on the first visit?' },
    { speaker: 'adviser', text: 'Just a pair of indoor shoes for her, and a coat for the garden. Nappies and wipes are provided here.' },
    { speaker: 'parent', text: 'Do the children go outside every day?' },
    { speaker: 'adviser', text: 'Yes, weather permitting, there’s a half hour in the garden each morning and again after lunch.' },
    { speaker: 'parent', text: 'Great. Is there anything else I should know before applying?' },
    { speaker: 'adviser', text: 'The application form asks for two references, and we need a copy of her immunisation record before she starts.' },
    { speaker: 'parent', text: 'I can get those together this week.' },
    { speaker: 'adviser', text: 'Perfect. Your details are Barnes, starting the fourth of September, thirty-five pound registration fee.' },
    { speaker: 'parent', text: 'That all matches what we discussed.' },
    { speaker: 'adviser', text: 'I’ll send the confirmation this afternoon. Is there anything else?' },
    { speaker: 'parent', text: 'No, that covers it. Thanks for being so patient with the paperwork.' },
    { speaker: 'adviser', text: 'You’re welcome. I look forward to meeting Elena.' },
  ],
  vocabulary: [
    {
      term: 'nursery', phonetic: '/ˈnɜːsəri/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '托儿所，幼儿园（招收学龄前儿童）', en: 'a place where young children are cared for during the day' },
      usage: { zh: '英式日常用词；nursery place、nursery room。美式常说 daycare。', en: 'Common in British English: nursery place, nursery room. American English often says daycare.' },
      collocations: ['a nursery place', 'the nursery room', 'nursery staff'],
      example: { en: 'She started at the local nursery after her second birthday.', zh: '两岁生日后她进了家附近的托儿所。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /ri/ 轻读。', en: 'Two syllables, stressed on the first, with a light final /ri/.' },
    },
    {
      term: 'registration', phonetic: '/ˌredʒɪˈstreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '注册，登记（registration fee 指一次性注册费）', en: 'the act of signing a child up; a registration fee is the one-off sign-up charge' },
      usage: { zh: '与 fee、form 搭配；动词 register。区别于 monthly fee（按月收取）。', en: 'Often with fee and form; the verb is register. Compare the recurring monthly fee.' },
      collocations: ['a registration fee', 'the registration form', 'complete the registration'],
      example: { en: 'The registration fee covers the enrolment paperwork.', zh: '注册费包含报名文书手续。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈstreɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'refundable', phonetic: '/rɪˈfʌndəbl/', partOfSpeech: 'adj.', sentenceIndex: 12,
      meaning: { zh: '可退还的，可退款的', en: 'money that can be given back if the arrangement changes' },
      usage: { zh: '费用场景高频；non-refundable 指不退。名词 refund 作名词重音在前。', en: 'Common with charges; non-refundable means kept. The noun refund stresses the first syllable.' },
      collocations: ['a refundable deposit', 'non-refundable fees', 'fully refundable'],
      example: { en: 'The deposit is refundable if you cancel a week ahead.', zh: '提前一周取消，押金可以退还。' },
      listening: { zh: '重音在第二音节 /ˈfʌn/，注意不要和 refund 动词重音混。', en: 'Stress the second syllable; do not confuse it with the verb refund.' },
    },
    {
      term: 'siblings', phonetic: '/ˈsɪblɪŋz/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '兄弟姐妹（复数）', en: 'brothers or sisters in the same family' },
      usage: { zh: '正式用语；日常口语常说 brother or sister。sibling priority 指兄弟姐妹优先。', en: 'Formal; speech often says brother or sister. Sibling priority is the family preference rule.' },
      collocations: ['sibling priority', 'older siblings', 'sibling rivalry'],
      example: { en: 'Siblings of existing children get first look at places.', zh: '在读孩子的兄弟姐妹优先获得名额。' },
      listening: { zh: '两个音节，/bl/ 辅音丛后接 /ɪŋz/，不要漏 /l/。', en: 'Two syllables; keep the /l/ before the /ɪŋz/ ending.' },
    },
    {
      term: 'trial', phonetic: '/ˈtraɪəl/', partOfSpeech: 'adj.', sentenceIndex: 29,
      meaning: { zh: '试读的，试用的（trial visit 指试园参观）', en: 'test or introductory, before the real arrangement begins' },
      usage: { zh: 'trial visit、trial session；名词 trial 指“试验”。注意与 trial（审判）区分语境。', en: 'Trial visit, trial session; the noun means a test. The legal sense is trial in court.' },
      collocations: ['a trial visit', 'a trial session', 'trial period'],
      example: { en: 'We booked a trial visit before accepting the place.', zh: '接受名额前我们先约了一次试园。' },
      listening: { zh: '两个音节，双元音 /aɪ/ 后接 /əl/，不要读成 try-all。', en: 'Two syllables; the /aɪ/ runs into /əl/, not two separate beats.' },
    },
    {
      term: 'key worker', phonetic: '/ˈkiː ˌwɜːkə/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '责任老师（托儿所中负责固定几名儿童的员工）', en: 'the member of nursery staff who is responsible for a small group of children' },
      usage: { zh: '英式托育高频词；key worker 与儿童家庭定期沟通。不可写成 keyworker。', en: 'Common in British childcare; the key worker liaises with the family. Keep two words.' },
      collocations: ['meet the key worker', 'the child’s key worker', 'key worker contact'],
      example: { en: 'The key worker shares daily updates with the parents.', zh: '责任老师每天向家长反馈情况。' },
      listening: { zh: 'key 长元音 /kiː/，worker 第二部分弱读 /wɜːkə/。', en: 'Keep the long /kiː/; worker reduces the second part to /wɜːkə/.' },
    },
    {
      term: 'immunisation', phonetic: '/ˌɪmjuːnaɪˈzeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 42,
      meaning: { zh: '免疫接种，疫苗记录', en: 'the process of being vaccinated; the record of injections received' },
      usage: { zh: '英式拼写 immunisation，美式 immunization。名词 immune 是“有免疫力的”。', en: 'British immunisation, American immunization. The adjective is immune.' },
      collocations: ['immunisation record', 'immunisation schedule', 'routine immunisation'],
      example: { en: 'The nursery needs a copy of the immunisation record.', zh: '托儿所需要一份免疫接种记录副本。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈzeɪ/，词长不要漏音节。', en: 'Five syllables with stress on the fourth; do not drop any beat.' },
    },
  ],
  expressions: [
    {
      phrase: 'hold the place', sentenceIndex: 9,
      meaning: { zh: '保留名额，占位', en: 'to reserve a place until the family confirms' },
      usage: { zh: '及物；hold a place for somebody。名词 place 在此指名额。', en: 'Transitive: hold a place for somebody. Place means a vacancy here.' },
      example: { en: 'The deposit holds the place for two weeks.', zh: '押金把名额保留两周。' },
    },
    {
      phrase: 'change our mind', sentenceIndex: 12,
      meaning: { zh: '改变主意', en: 'to decide against a choice already made' },
      usage: { zh: '人称随主语变化：change my mind、change their mind。', en: 'Possessive changes: change my mind, change their mind.' },
      example: { en: 'You lose the fee if you change your mind.', zh: '改变主意的话费用不退。' },
    },
    {
      phrase: 'turn three', sentenceIndex: 7,
      meaning: { zh: '满三岁（达到年龄）', en: 'to reach the age of three' },
      usage: { zh: 'turn 加年龄表示“满岁”；turn thirty、turn eighteen。', en: 'Turn plus age means to reach it: turn thirty, turn eighteen.' },
      example: { en: 'She turns three next March and moves to the threes room.', zh: '她明年三月满三岁，升到 threes 班。' },
    },
    {
      phrase: 'free play', sentenceIndex: 30,
      meaning: { zh: '自由活动（儿童自主选择游戏）', en: 'unstructured play chosen by the children themselves' },
      usage: { zh: '托育与教育语境；free play 与 adult-led activity 相对。', en: 'Childcare sense; free play contrasts with adult-led activity.' },
      example: { en: 'Parents watch the free play during the trial session.', zh: '试园时段家长观看孩子自由活动。' },
    },
    {
      phrase: 'weather permitting', sentenceIndex: 40,
      meaning: { zh: '天气允许的话', en: 'if the weather is suitable, otherwise the plan changes' },
      usage: { zh: '固定状语短语，主谓结构省略；放句首或句尾。', en: 'Fixed adverbial with a shortened clause; it can open or close a sentence.' },
      example: { en: 'The garden visit happens, weather permitting, after lunch.', zh: '天气允许的话，午饭后去花园。' },
    },
    {
      phrase: 'drop in', sentenceIndex: 35,
      meaning: { zh: '顺路参加，不预约就到访', en: 'to attend without a fixed booking' },
      usage: { zh: '不及物；drop in on the open morning。drop-in 作形容词。', en: 'Intransitive: drop in on the open morning. The adjective form is drop-in.' },
      example: { en: 'You can drop in between ten and midday on Saturday.', zh: '周六十点到十二点之间可以顺路过来。' },
    },
  ],
  tips: [
    {
      title: { zh: '先分清一次性费用和时段安排', en: 'Separate fees from timetable items' },
      body: {
        zh: 'Part 1 常把注册费、日期、星期和时间混在一段里。听到 registration fee、one-off 记费用；date、start 记日期；day、morning、afternoon 记星期；o’clock、thirty 记时间点。落笔前先看空格要哪一类。',
        en: 'Part 1 mixes fees, dates, days and times in one flow. Note charges after registration fee or one-off; dates after date or start; days after day or morning; times after o’clock or thirty. Check which type the gap needs before you write.',
      },
    },
    {
      title: { zh: '年龄换算要跟上房间划分', en: 'Match age to the room' },
      body: {
        zh: '单选 5 先听清三个房间的年龄段：under twos、two to three、over three，再把孩子当前两岁半代入。听到 covers up to the third birthday 这类边界词，才是她先进哪个房间的依据。',
        en: 'Before choice 5, note the three room ranges: under twos, two to three, over three, then match the child at two and a half. A boundary phrase such as covers up to the third birthday decides the first room.',
      },
    },
    {
      title: { zh: '表格题先按行找已给信息', en: 'Locate the row from printed clues' },
      body: {
        zh: '试园表先用已印的 Arrangement 和 Time 找行：第 8 行时间已给、缺星期；第 9 行星期已给、缺时间；第 10 行结束时间已给、缺星期。不要把 twenty minutes、half hour 这类时长写进时间空格。',
        en: 'For the visit table, use the printed Arrangement and Time to find each row: row 8 has the time and needs a day; row 9 has Friday and needs a time; row 10 has until midday and needs a day. Do not write durations such as twenty minutes into a time gap.',
      },
    },
  ],
};
