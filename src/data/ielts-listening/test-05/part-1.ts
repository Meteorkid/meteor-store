import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 5 · Part 1 — 新生开立学生银行账户（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：登记姓名、出生日期与专业 → 证件检查（护照在、住址证明忘带）→
 * 透支额度 → 月费条件 → 手机银行开通。填空块在前半段，单选块在后半段，
 * 题块顺序与录音顺序一致。
 */
export const test05Part1: ListeningLesson = {
  slug: 'test-05-part-1',
  part: 1,
  status: 'published',
  title: { zh: '开立学生银行账户', en: 'Opening a student bank account' },
  summary: {
    zh: '新生到银行咨询开户：登记姓名、出生日期与专业，检查所需证件，了解学生透支额度、免月费条件和手机银行的开通方式。',
    en: 'A new student visits a bank to open an account: he gives his name, date of birth and course, checks the required documents, and learns about the student overdraft, the monthly fee conditions and mobile banking.',
  },
  accent: { zh: '银行顾问为加拿大口音，学生为美式口音。', en: 'The adviser speaks with a Canadian accent and the student with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'student', label: 'STUDENT', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Date of birth', cells: [[{ blank: 2 }]] },
        { lead: 'Course of study', cells: [[{ blank: 3 }]] },
        { lead: 'Photo identification', cells: [[{ blank: 4 }]] },
        { lead: 'Document left at the hall', cells: [[{ blank: 5 }]] },
        { lead: 'Interest-free overdraft limit', cells: [[{ text: '$' }, { blank: 6 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'What happens if a student needs an overdraft above five hundred dollars?',
          options: [
            { key: 'A', text: 'It is approved automatically at the counter.' },
            { key: 'B', text: 'It must be arranged beforehand and bears interest.' },
            { key: 'C', text: 'It cancels the monthly account fee.' },
          ],
        },
        {
          number: 8,
          stem: 'What does the adviser say about the monthly fee?',
          options: [
            { key: 'A', text: 'It is free for all student account holders.' },
            { key: 'B', text: 'It is waived when the balance stays above three hundred dollars.' },
            { key: 'C', text: 'It is charged once each academic term.' },
          ],
        },
        {
          number: 9,
          stem: 'What happens if the balance drops below three hundred dollars?',
          options: [
            { key: 'A', text: 'The overdraft limit is reduced at once.' },
            { key: 'B', text: 'A fee of twelve dollars is taken that month.' },
            { key: 'C', text: 'The account is closed automatically.' },
          ],
        },
        {
          number: 10,
          stem: 'What does the student need before logging into the mobile app?',
          options: [
            { key: 'A', text: 'a temporary PIN sent by post' },
            { key: 'B', text: 'a second visit to the branch' },
            { key: 'C', text: 'a printed address statement' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Fraser'], evidence: 3,
      explanation: {
        zh: '定位句 3：学生逐字母拼出 Fraser。拼写题先写下首字母 F，再跟着读音补全；不要按发音写成 Frazer 或 Frasier。',
        en: 'Sentence 3: the student spells the surname out letter by letter. Write the first letter, then fill in the rest; do not guess a spelling such as Frazer.',
      },
    },
    {
      number: 2, accepted: ['3 September', 'September 3'], spoken: 'the third of September', evidence: 7,
      explanation: {
        zh: '定位句 7：I was born on the third of September, two thousand and four。日期只填月日，年份 two thousand and four 是干扰信息，空格后没有年份位置。',
        en: 'Sentence 7: "I was born on the third of September, two thousand and four". Only the month and day are needed; the year is a distractor, since the gap has no year field.',
      },
    },
    {
      number: 3, accepted: ['mechanical engineering'], evidence: 10,
      explanation: {
        zh: '定位句 10：Well, actually it’s mechanical engineering。学生先说 engineering，用 actually 自我修正为 mechanical engineering，落笔以修正后的说法为准。',
        en: 'Sentence 10: "Well, actually it’s mechanical engineering". The student first says engineering and then corrects himself with actually, so the corrected form wins.',
      },
    },
    {
      number: 4, accepted: ['passport'], evidence: 12,
      explanation: {
        zh: '定位句 12：I brought my passport with me, so here it is。顾问在句 11 说明需要照片证件和住址证明两样，本空只填照片证件。',
        en: 'Sentence 12: "I brought my passport with me, so here it is". Sentence 11 explains that one photo identification and one address proof are required; this gap asks only for the photo document.',
      },
    },
    {
      number: 5, accepted: ['residence letter'], evidence: 14,
      explanation: {
        zh: '定位句 14：I left the residence letter from the hall in my room。住址证明忘在宿舍，对应表单 Document left at the hall；旧银行账单是句 16 被否定的干扰项。',
        en: 'Sentence 14: "I left the residence letter from the hall in my room". The missing address proof matches the form row. The old bank statement in sentence 16 is a rejected distractor.',
      },
    },
    {
      number: 6, accepted: ['500', 'five hundred'], spoken: 'five hundred', evidence: 21,
      explanation: {
        zh: '定位句 21：an interest-free overdraft of five hundred dollars。句 23 再次强调初始额度 stays five hundred；后面提到的 three hundred 是月费余额门槛，不是透支额度，别混淆。',
        en: 'Sentence 21: "an interest-free overdraft of five hundred dollars". Sentence 23 repeats that the initial limit stays five hundred. The three hundred later refers to the balance threshold for the fee, not the overdraft.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：Anything beyond five hundred has to be arranged in advance with our loans team, and it carries interest。in advance = beforehand，carries interest = bears interest。A 错在不能自动批准，C 错在与月费无关。',
        en: 'Sentence 25: "Anything beyond five hundred has to be arranged in advance with our loans team, and it carries interest". In advance matches beforehand, and carries interest matches bears interest. A is wrong because approval is not automatic, and C confuses this with the account fee.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：the student account has no monthly fee as long as you keep three hundred dollars in it at all times。as long as 引导免月费条件，对应 B。A 太绝对，C 的每学期收费全段没有提到。',
        en: 'Sentence 29: "the student account has no monthly fee as long as you keep three hundred dollars in it at all times". As long as introduces the waiver condition, matching B. A is too absolute, and a termly fee is never mentioned.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：Then the fee for that month is twelve dollars, and it comes off automatically。余额跌破门槛当月扣十二美元。A 说额度立刻下调，C 说账户自动关闭，都与原文不符。',
        en: 'Sentence 31: "Then the fee for that month is twelve dollars, and it comes off automatically". A twelve-dollar fee is taken that month. A claims the overdraft limit drops at once, and C claims the account closes automatically; neither appears in the recording.',
      },
    },
    {
      number: 10, accepted: ['A'], evidence: 35,
      explanation: {
        zh: '定位句 35：use that temporary PIN to log in。临时密码由邮寄送达，是登录前的必备材料。B 错在不需要二次到店，C 错在打印账单与登录无关。',
        en: 'Sentence 35: "use that temporary PIN to log in". The temporary PIN arrives by post and is required before login. B is wrong because a second branch visit is unnecessary, and C confuses the PIN with an address statement.',
      },
    },
  ],
  transcript: [
    { speaker: 'student', text: 'Hi, I’d like to open a student account, please. I’ve just started my first year at the city university.' },
    { speaker: 'adviser', text: 'Welcome to Northgate Bank. We have a dedicated student package, so it should take about twenty minutes.' },
    { speaker: 'adviser', text: 'Could I take your name first?' },
    { speaker: 'student', text: 'Sure. My surname is Fraser. That’s F, R, A, S, E, R.' },
    { speaker: 'adviser', text: 'F, R, A, S, E, R. Thank you. And your first name?' },
    { speaker: 'student', text: 'It’s Nathan. Nathan Fraser.' },
    { speaker: 'adviser', text: 'Thanks, Nathan. And your date of birth?' },
    { speaker: 'student', text: 'I was born on the third of September, two thousand and four.' },
    { speaker: 'adviser', text: 'The third of September, two thousand and four. Got that. What course are you following here?' },
    { speaker: 'student', text: 'I’m reading engineering at the moment.' },
    { speaker: 'student', text: 'Well, actually it’s mechanical engineering, but I’ll write the full name on the form later.' },
    { speaker: 'adviser', text: 'Mechanical engineering. Fine. Now I’ll need two forms of identification, one photo and one showing your home address.' },
    { speaker: 'student', text: 'Of course. I brought my passport with me, so here it is.' },
    { speaker: 'adviser', text: 'Thank you. The passport will do for the photo part. And the address proof?' },
    { speaker: 'student', text: 'Oh dear, I think I left the residence letter from the hall in my room. Is that a problem?' },
    { speaker: 'adviser', text: 'It is, I’m afraid. We can’t open the account without something that shows where you live.' },
    { speaker: 'student', text: 'Would a bank statement from back home work? It has my old address on it, though, not this one.' },
    { speaker: 'adviser', text: 'It has to be dated within the last three months, and it must show your local address. The hall letter would be perfect.' },
    { speaker: 'student', text: 'Then I’ll have to run back and fetch it. I’ll come straight back after this.' },
    { speaker: 'adviser', text: 'No rush. The branch stays open until six this evening.' },
    { speaker: 'student', text: 'Thanks. Before I go, could I ask how the student account works?' },
    { speaker: 'adviser', text: 'Of course. Every student gets an interest-free overdraft of five hundred dollars, once your enrolment is confirmed.' },
    { speaker: 'student', text: 'Five hundred. Is that likely to rise in later years?' },
    { speaker: 'adviser', text: 'It can, but only after you’ve kept the account in good order. The initial limit stays five hundred.' },
    { speaker: 'student', text: 'Good. What happens if I need more than that?' },
    { speaker: 'adviser', text: 'Anything beyond five hundred has to be arranged in advance with our loans team, and it carries interest.' },
    { speaker: 'student', text: 'Right. I don’t want to fall into that, so I’ll keep an eye on the balance.' },
    { speaker: 'adviser', text: 'You’ll get a message each time you approach your limit, so you won’t be caught out.' },
    { speaker: 'student', text: 'And what about the monthly fee? I saw online that standard accounts charge something each month.' },
    { speaker: 'adviser', text: 'That’s right, but the student account has no monthly fee as long as you keep three hundred dollars in it at all times.' },
    { speaker: 'student', text: 'Three hundred. What if my balance drops below that during the term?' },
    { speaker: 'adviser', text: 'Then the fee for that month is twelve dollars, and it comes off automatically.' },
    { speaker: 'student', text: 'And the mobile banking app? Can I set that up today?' },
    { speaker: 'adviser', text: 'Not quite yet. Once the account is open, we post a temporary PIN to your address, usually within three working days.' },
    { speaker: 'student', text: 'Do I need to choose a PIN here at the counter?' },
    { speaker: 'adviser', text: 'No, you download the app, enter your card number, and use that temporary PIN to log in.' },
    { speaker: 'student', text: 'Then I pick my own password once I’m inside?' },
    { speaker: 'adviser', text: 'Exactly. You choose your own PIN in the app, and you can change it whenever you like.' },
    { speaker: 'student', text: 'Perfect. Is there anything else I should know?' },
    { speaker: 'adviser', text: 'Your debit card arrives by post too, and you activate it from the same app.' },
    { speaker: 'student', text: 'OK, I’ll go and collect the letter, then.' },
    { speaker: 'adviser', text: 'Please do. I’ll hold your application here, and I’ll see you shortly.' },
  ],
  vocabulary: [
    {
      term: 'identification', phonetic: '/aɪˌdentɪfɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '身份证明，证件', en: 'official documents that prove who you are' },
      usage: { zh: '不可数名词；photo identification 指带照片的证件，如护照、驾照。', en: 'Uncountable. Photo identification means a document with your picture, such as a passport.' },
      collocations: ['two forms of identification', 'photo identification', 'show identification'],
      example: { en: 'You need two forms of identification to collect the parcel.', zh: '取包裹需要两种身份证明。' },
      listening: { zh: '六个音节，重音在第五个 /ˈkeɪ/，开头的 i 读 /aɪ/。', en: 'Six syllables with stress on the fifth; the opening i sounds like /aɪ/.' },
    },
    {
      term: 'residence', phonetic: '/ˈrezɪdəns/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '住所，住处', en: 'the place where you live' },
      usage: { zh: '正式用词；residence letter 指宿舍或居住证明信，地址证明场景常见。', en: 'Formal. A residence letter proves where you live, common in address-checking scenes.' },
      collocations: ['a residence letter', 'hall of residence', 'proof of residence'],
      example: { en: 'The hall of residence sends a letter confirming your address.', zh: '宿舍管理处会出具一封证明你住址的信。' },
      listening: { zh: '重音在第一音节 /ˈrez/，不要和 residents（居民）混淆。', en: 'Stress the first syllable; do not confuse it with residents.' },
    },
    {
      term: 'statement', phonetic: '/ˈsteɪtmənt/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '（银行）对账单', en: 'a printed record of money paid into or out of an account' },
      usage: { zh: '银行场景高频词；bank statement、monthly statement。', en: 'Common in banking: a bank statement, a monthly statement.' },
      collocations: ['a bank statement', 'a monthly statement', 'an old statement'],
      example: { en: 'The bank statement shows every payment from last month.', zh: '银行对账单列出了上个月的每一笔支出。' },
      listening: { zh: 'state 加 ment，两个音节清晰，不要漏听结尾的 /nt/。', en: 'State plus ment; listen for the final /nt/.' },
    },
    {
      term: 'enrolment', phonetic: '/ɪnˈrəʊlmənt/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '注册入学，登记', en: 'the act of officially joining a course or institution' },
      usage: { zh: '英式拼写 enrolment，美式 enrollment；动词是 enrol。', en: 'British spelling enrolment, American enrollment; the verb is enrol.' },
      collocations: ['once your enrolment is confirmed', 'university enrolment', 'the enrolment date'],
      example: { en: 'Your student discount starts once enrolment is confirmed.', zh: '注册确认后即可享受学生优惠。' },
      listening: { zh: '重音在第二音节 /ˈrəʊl/，开头 /ɪn/ 弱读。', en: 'Stress the second syllable; the opening /ɪn/ is weak.' },
    },
    {
      term: 'overdraft', phonetic: '/ˈəʊvədraːft/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '透支（额度）', en: 'an arrangement allowing you to spend more money than your account holds' },
      usage: { zh: '可数名词；interest-free overdraft 指免息透支，overdraft limit 是透支额度。', en: 'Countable. An interest-free overdraft charges no interest; the overdraft limit is the maximum allowed.' },
      collocations: ['an interest-free overdraft', 'the overdraft limit', 'arrange an overdraft'],
      example: { en: 'The bank offers students an overdraft of five hundred pounds.', zh: '银行给学生提供五百英镑的透支额度。' },
      listening: { zh: '复合词，重音在第一音节；draft 读 /draːft/，不要听成 over draw。', en: 'A compound with first-syllable stress; draft is /draːft/.' },
    },
    {
      term: 'balance', phonetic: '/ˈbæləns/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '账户余额', en: 'the amount of money left in an account' },
      usage: { zh: '银行场景高频词；keep a balance、balance drops below。', en: 'Common in banking: keep a balance, the balance drops below.' },
      collocations: ['the account balance', 'keep a balance', 'a low balance'],
      example: { en: 'Check your balance before you pay the rent.', zh: '付房租前先查一下余额。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈbæl/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'temporary', phonetic: '/ˈtemprəri/', partOfSpeech: 'adj.', sentenceIndex: 33,
      meaning: { zh: '临时的，暂时的', en: 'lasting only for a short time' },
      usage: { zh: '与 permanent 相对；temporary PIN、temporary password 是开通账户时的常见搭配。', en: 'The opposite of permanent. A temporary PIN or password is common when opening an account.' },
      collocations: ['a temporary PIN', 'a temporary password', 'temporary access'],
      example: { en: 'The app sends you a temporary PIN by post.', zh: '应用会通过邮寄发给你一个临时密码。' },
      listening: { zh: '英式常读三个音节 /ˈtemprəri/，不要拆成四个音节。', en: 'British speakers often say three syllables, /ˈtemprəri/, not four.' },
    },
    {
      term: 'activate', phonetic: '/ˈæktɪveɪt/', partOfSpeech: 'v.', sentenceIndex: 39,
      meaning: { zh: '激活（卡片、账户）', en: 'to make a card or account start working' },
      usage: { zh: '及物动词；activate the card、activate the account，名词是 activation。', en: 'Transitive: activate the card, activate the account; the noun is activation.' },
      collocations: ['activate the card', 'activate the account', 'activate online'],
      example: { en: 'You can activate the new card through the app.', zh: '你可以通过应用激活新卡。' },
      listening: { zh: '重音在第一音节 /ˈæk/，结尾是 /veɪt/。', en: 'Stress the first syllable; the ending is /veɪt/.' },
    },
  ],
  expressions: [
    {
      phrase: 'take your name', sentenceIndex: 2,
      meaning: { zh: '登记你的姓名', en: 'to write down somebody’s name on a form' },
      usage: { zh: '办理业务时的开场说法；也可说 take your details。', en: 'An opening phrase in service scenes; take your details means the same.' },
      example: { en: 'I’ll take your name and address on this form.', zh: '我把你的姓名和地址登记在这张表上。' },
    },
    {
      phrase: 'do for', sentenceIndex: 13,
      meaning: { zh: '充当，满足（某项要求）', en: 'to be acceptable as something for a particular purpose' },
      usage: { zh: '口语中 The passport will do for the photo part 表示护照可以满足照片证件这一项。', en: 'In speech, The passport will do for the photo part means it meets that requirement.' },
      example: { en: 'This letter will do for proof of address.', zh: '这封信可以当作住址证明。' },
    },
    {
      phrase: 'fall into that', sentenceIndex: 26,
      meaning: { zh: '陷入那种情况', en: 'to get into that unwanted situation' },
      usage: { zh: 'fall into 加麻烦、债务、错误等名词；that 指代前面提到的高息透支。', en: 'Fall into plus trouble, debt or error; that refers to the interest-bearing overdraft.' },
      example: { en: 'Keep an eye on spending so you don’t fall into debt.', zh: '留意开销，别背上债务。' },
    },
    {
      phrase: 'keep an eye on', sentenceIndex: 26,
      meaning: { zh: '留意，照看', en: 'to watch something carefully' },
      usage: { zh: '及物短语动词；后接 balance、budget、time 等。', en: 'Transitive: keep an eye on the balance, the budget, the time.' },
      example: { en: 'Keep an eye on your balance before the end of term.', zh: '学期结束前留意一下余额。' },
    },
    {
      phrase: 'caught out', sentenceIndex: 27,
      meaning: { zh: '措手不及，猝不及防', en: 'suddenly put in a difficult position without warning' },
      usage: { zh: '被动形式 be caught out；此处指不会在余额不足时毫无准备。', en: 'Passive: be caught out. Here it means you will not be taken by surprise.' },
      example: { en: 'The warning email means you won’t be caught out at the weekend.', zh: '有了提醒邮件，周末你就不会措手不及。' },
    },
    {
      phrase: 'at all times', sentenceIndex: 29,
      meaning: { zh: '一直，始终', en: 'always, in every situation' },
      usage: { zh: '放在句末作状语；与 the whole time 同义，语气更正式。', en: 'Adverbial phrase at the end; similar to the whole time but more formal.' },
      example: { en: 'Your student card must be carried at all times.', zh: '学生证必须随身携带。' },
    },
    {
      phrase: 'hold your application', sentenceIndex: 41,
      meaning: { zh: '保留你的申请', en: 'to keep your application open rather than cancel it' },
      usage: { zh: 'hold 在此表示“暂留、保留”；hold a place、hold a reservation 同类。', en: 'Hold means keep temporarily here, as in hold a place or hold a reservation.' },
      example: { en: 'We’ll hold your application until six this evening.', zh: '我们会把你的申请保留到今晚六点。' },
    },
  ],
  tips: [
    {
      title: { zh: '先读表单字段再听', en: 'Read the form before listening' },
      body: {
        zh: '表单填空的字段名就是定位线索：Surname、Date of birth、Course、Photo identification 依次出现。听之前把每个字段要填的类型（姓名、日期、专业、证件）写在旁边。',
        en: 'The row labels are your navigation cues: Surname, Date of birth, Course and Photo identification appear in order. Note the expected type beside each gap before the recording starts.',
      },
    },
    {
      title: { zh: 'actually 之后是修正答案', en: 'The answer follows actually' },
      body: {
        zh: '学生先说 engineering，紧接着 Well, actually it’s mechanical engineering。听到 actually、well、I mean 这类自我修正标记时，准备把刚才写下的词换成后面的完整说法。',
        en: 'The student first says engineering, then "Well, actually it’s mechanical engineering". When you hear actually, well or I mean, be ready to replace what you wrote with the corrected phrase.',
      },
    },
    {
      title: { zh: '区分两个五百和三百', en: 'Keep the two numbers apart' },
      body: {
        zh: 'five hundred 是免息透支额度，three hundred 是免月费的余额门槛，twelve dollars 是不足额时当月的费用。听到数字先对照空格属于哪一行，不要把第二个数字写进第一题。',
        en: 'Five hundred is the interest-free overdraft, three hundred is the balance threshold for the fee, and twelve dollars is the monthly fee when you fall below it. Match each number to its row before writing it down.',
      },
    },
  ],
};
