import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 6 · Part 1 — 居民到社区图书馆办理借书证（双人对话，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 生活交易类对话：地址证明、借阅上限、续借规则、儿童区开放时间，以及参考资料、
 * 有声书和期刊三类物品的借阅方式。配对题考“三类物品分别适用哪条规则”，
 * 干扰项把续借次数和预留期限混在一起。
 */
export const test06Part1: ListeningLesson = {
  slug: 'test-06-part-1',
  part: 1,
  status: 'published',
  title: { zh: '办理图书馆借书证', en: 'Joining the local library' },
  summary: {
    zh: '新搬来的居民到 Riverside 图书馆办借书证：需要的地址证明、一次可借的数量、借阅期限、逾期与续借规则、儿童区开放时间，以及三类物品的借阅方式。',
    en: 'A new resident joins Riverside Library: the address proof required, how many items a card allows, the loan period, overdue and renewal rules, the children’s opening hours, and how three categories of items are lent out.',
  },
  accent: { zh: '两位说话人均为新西兰口音。', en: 'Both speakers use New Zealand accents.' },
  speechRate: '+2%',
  cast: [
    { id: 'librarian', label: 'LIBRARIAN', gender: 'female', voice: 'en-NZ-MollyNeural' },
    { id: 'visitor', label: 'VISITOR', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Proof of address (utility)', cells: [[{ blank: 2 }]] },
        { lead: 'Maximum items per card', cells: [[{ blank: 3 }]] },
        { lead: 'Standard loan period', cells: [[{ blank: 4 }, { text: ' weeks' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What does the librarian say happens first when an item is overdue?',
          options: [
            { key: 'A', text: 'A reminder email is sent to the borrower.' },
            { key: 'B', text: 'A daily fine starts to accumulate straight away.' },
            { key: 'C', text: 'The library card is temporarily blocked.' },
          ],
        },
        {
          number: 6,
          stem: 'How does the librarian say most people renew their items?',
          options: [
            { key: 'A', text: 'By phoning the library desk.' },
            { key: 'B', text: 'Through the library website.' },
            { key: 'C', text: 'In person at the counter.' },
          ],
        },
        {
          number: 7,
          stem: 'What does the librarian say about the children’s section?',
          options: [
            { key: 'A', text: 'It opens at ten on weekdays.' },
            { key: 'B', text: 'The story time must be booked in advance.' },
            { key: 'C', text: 'It closes at six in the evening.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which rule applies to each category of item? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'cannot be taken home, though copies can be made' },
        { key: 'B', text: 'lent out in the same way as ordinary books' },
        { key: 'C', text: 'limited to four items taken alongside the books' },
        { key: 'D', text: 'reserved for three days after the previous borrower returns it' },
        { key: 'E', text: 'renewed only twice, either online or by phone' },
      ],
      items: [
        { number: 8, text: 'reference books' },
        { number: 9, text: 'audio books' },
        { number: 10, text: 'magazines' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Harland'], evidence: 3,
      explanation: {
        zh: '定位句 3：来访者逐字母拼出 Harland，H, A, R, L, A, N, D。拼写题先记首字母 H，再跟读音补；不要按发音写成 Harlin 或 Harland 漏字母。',
        en: 'Sentence 3: the visitor spells the surname out as H, A, R, L, A, N, D. Write the first letter, then fill in the rest; do not guess a spelling such as Harlin.',
      },
    },
    {
      number: 2, accepted: ['bill'], evidence: 8,
      explanation: {
        zh: '定位句 8：we prefer a recent utility bill if you have one。句 7 的 bank statement 也算接受，但表单要填的是“账单”这一类证明；只填 bill 一个词。',
        en: 'Sentence 8: "we prefer a recent utility bill if you have one". The bank statement in sentence 7 is also accepted, but the form asks for the document type, so write one word: bill.',
      },
    },
    {
      number: 3, accepted: ['twelve', '12'], evidence: 12,
      explanation: {
        zh: '定位句 12：The standard card allows twelve items。twelve 与 12 都得分；句 34 的 four magazines 是期刊的附加上限，不是总借阅量，属于干扰数字。',
        en: 'Sentence 12: "The standard card allows twelve items". Both twelve and 12 are accepted. The four magazines in sentence 34 are an extra magazine limit, a distractor for the total.',
      },
    },
    {
      number: 4, accepted: ['three', '3'], evidence: 14,
      explanation: {
        zh: '定位句 14：The loan period is three weeks for most items。空格后已印 weeks，只填数字；reference books 不外借，不参与这个期限。',
        en: 'Sentence 14: "The loan period is three weeks for most items". Weeks is already printed, so write the number only. Reference books are not loaned out.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：You’ll get a reminder by email first, and only after that a small daily fine starts to build up。first 说明第一步是提醒邮件；B 把罚款说成立刻开始，与 only after that 相反；C 的封卡在对话中从未出现。',
        en: 'Sentence 16: "You’ll get a reminder by email first, and only after that a small daily fine starts to build up". First makes the email the first step. B contradicts only after that, and C, blocking the card, is never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：online is quickest, and you see the new date straight away。同义替换：through the website = online。句 20 提到电话也可以续，句 21 提到到柜台也可以，但都不是最常用的方式。',
        en: 'Sentence 22: "online is quickest, and you see the new date straight away". Through the website paraphrases online. Phone renewal in sentence 20 and desk renewal in sentence 21 are alternatives, not the usual route.',
      },
    },
    {
      number: 7, accepted: ['C'], evidence: 26,
      explanation: {
        zh: '定位句 26：It opens at nine thirty on weekdays, and ten on Saturdays, and closes at six each evening。C 的晚上六点闭馆与原文一致；A 把工作日开门时间说成十点，正好与周六混淆；B 与句 28 的 You don’t need to book 相反。',
        en: 'Sentence 26: "It opens at nine thirty on weekdays, and ten on Saturdays, and closes at six each evening". C matches the six o’clock close. A swaps the weekday and Saturday opening times, and B contradicts You don’t need to book in sentence 28.',
      },
    },
    {
      number: 8, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：Those can’t be borrowed, but you can read them in the reading room, and we make copies for you。不能外借、但可复印，对应 A。D 的预留三天是借书预约的规则，不是参考书。',
        en: 'Sentence 30: "Those can’t be borrowed, but you can read them in the reading room, and we make copies for you". That matches A: no home loan, but copies available. The three-day hold in D applies to reserved books, not references.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 32,
      explanation: {
        zh: '定位句 32：Those go out just like ordinary books, and they count toward your twelve items。go out just like ordinary books 与 B 同义；它们计入十二件上限，不适用期刊的四条规则。',
        en: 'Sentence 32: "Those go out just like ordinary books, and they count toward your twelve items". Go out just like ordinary books paraphrases B. They count toward the twelve, not the magazine limit in C.',
      },
    },
    {
      number: 10, accepted: ['C'], evidence: 34,
      explanation: {
        zh: '定位句 34：you may take up to four magazines at once, in addition to the books。four magazines 加 in addition to the books 对应 C；E 的续借两次是所有可借物品的通用规则，不是期刊专属。',
        en: 'Sentence 34: "you may take up to four magazines at once, in addition to the books", which matches C. The two renewals in E apply to all loaned items, not magazines alone.',
      },
    },
  ],
  transcript: [
    { speaker: 'librarian', text: 'Good morning, I’m the librarian on duty, and I can sort out a borrower’s card for you today.' },
    { speaker: 'visitor', text: 'Hi, I’ve just moved to the neighbourhood, and I’d like to join the library, please.' },
    { speaker: 'librarian', text: 'Of course, membership is free, and it only takes a few minutes. Can I take your name?' },
    { speaker: 'visitor', text: 'Yes, it’s Dale Harland. That’s H, A, R, L, A, N, D.' },
    { speaker: 'librarian', text: 'Harland, Dale. Thank you. And could I see some identification?' },
    { speaker: 'visitor', text: 'Sure, here’s my driver’s licence. Does that show where I live?' },
    { speaker: 'librarian', text: 'It does, but we also need one document that serves as proof of your current address.' },
    { speaker: 'visitor', text: 'Would a bank statement be all right? I brought one in my bag.' },
    { speaker: 'librarian', text: 'A statement is fine, though we prefer a recent utility bill if you have one.' },
    { speaker: 'visitor', text: 'I have a gas bill from last month. Is that recent enough?' },
    { speaker: 'librarian', text: 'Yes, anything from the last three months works. Let me make a copy of that.' },
    { speaker: 'visitor', text: 'Great. Now, how many things can I borrow at once?' },
    { speaker: 'librarian', text: 'The standard card allows twelve items, including books, audio books and magazines.' },
    { speaker: 'visitor', text: 'Twelve, that sounds plenty. And how long can I keep them?' },
    { speaker: 'librarian', text: 'The loan period is three weeks for most items. Reference books stay in the library.' },
    { speaker: 'visitor', text: 'What happens if I don’t bring something back in time?' },
    { speaker: 'librarian', text: 'You’ll get a reminder by email first, and only after that a small daily fine starts to build up.' },
    { speaker: 'visitor', text: 'So the reminder itself doesn’t cost anything?' },
    { speaker: 'librarian', text: 'No, the reminder is free. The fine begins once the item passes its due date.' },
    { speaker: 'visitor', text: 'Can I renew items myself if I need more time?' },
    { speaker: 'librarian', text: 'You can renew online through the website, or by phone, but only twice for each item.' },
    { speaker: 'visitor', text: 'What about renewing in person at this desk?' },
    { speaker: 'librarian', text: 'That’s possible, but online is quickest, and you see the new date straight away.' },
    { speaker: 'visitor', text: 'Good. I have a young daughter, so I wanted to ask about the children’s area.' },
    { speaker: 'librarian', text: 'The children’s section is on the ground floor, just near the main entrance.' },
    { speaker: 'visitor', text: 'What hours does it open? I know some libraries close early on certain days.' },
    { speaker: 'librarian', text: 'It opens at nine thirty on weekdays, and ten on Saturdays, and closes at six each evening.' },
    { speaker: 'visitor', text: 'Is there a story time for young children?' },
    { speaker: 'librarian', text: 'Yes, every Saturday at eleven, for children aged three to six. You don’t need to book.' },
    { speaker: 'visitor', text: 'That’s handy. Could I ask about the reference books upstairs?' },
    { speaker: 'librarian', text: 'Those can’t be borrowed, but you can read them in the reading room, and we make copies for you.' },
    { speaker: 'visitor', text: 'And the audio books on the shelf by the window?' },
    { speaker: 'librarian', text: 'Those go out just like ordinary books, and they count toward your twelve items.' },
    { speaker: 'visitor', text: 'Do magazines also count toward the limit?' },
    { speaker: 'librarian', text: 'They do, but you may take up to four magazines at once, in addition to the books.' },
    { speaker: 'visitor', text: 'One last thing, can I reserve a book that someone else has?' },
    { speaker: 'librarian', text: 'Yes, you place a hold online, and when it comes back we keep it aside for three days.' },
    { speaker: 'visitor', text: 'How will I know it’s ready to collect?' },
    { speaker: 'librarian', text: 'We send you an email, and you have a week to pick it up before it returns to the shelf.' },
    { speaker: 'visitor', text: 'That all sounds clear. Shall I sign anything now?' },
    { speaker: 'librarian', text: 'I’ve already entered your details on the screen. Just sign here, and the card is ready in a minute.' },
    { speaker: 'visitor', text: 'Excellent. Thank you very much for explaining everything.' },
    { speaker: 'librarian', text: 'You’re welcome. Enjoy the library, and see you on Saturday.' },
  ],
  vocabulary: [
    {
      term: 'membership', phonetic: '/ˈmembəʃɪp/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '会员资格，入会', en: 'the state of belonging to an organisation as a member' },
      usage: { zh: '不可数；join the membership、annual membership、free membership。', en: 'Uncountable: join the membership, annual membership, free membership.' },
      collocations: ['free membership', 'annual membership', 'apply for membership'],
      example: { en: 'Membership of the club costs twelve dollars a year.', zh: '俱乐部会员费一年十二美元。' },
      listening: { zh: '重音在第一音节 /ˈmem/，中间的 /bə/ 弱读。', en: 'Stress the first syllable; the middle /bə/ is reduced.' },
    },
    {
      term: 'identification', phonetic: '/aɪˌdentɪfɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '身份证明（证件）', en: 'official documents that prove who you are' },
      usage: { zh: '口语常缩成 ID；see some identification、show identification。', en: 'Often shortened to ID in speech: show identification.' },
      collocations: ['some identification', 'photo identification', 'proof of identification'],
      example: { en: 'You need identification to collect the parcel.', zh: '取包裹需要出示身份证明。' },
      listening: { zh: '五个音节，重音在最后一个 /ˈkeɪ/，前面音节快速连读。', en: 'Five syllables with stress on the final /ˈkeɪ/.' },
    },
    {
      term: 'statement', phonetic: '/ˈsteɪtmənt/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '（银行）对账单；声明', en: 'a bank document showing money paid in and out; a formal remark' },
      usage: { zh: '银行语境里 a bank statement 是对账单；一般语境指“声明”。', en: 'In banking, a bank statement lists transactions; elsewhere it means a remark.' },
      collocations: ['a bank statement', 'a monthly statement', 'a formal statement'],
      example: { en: 'The bank sends a statement at the end of each month.', zh: '银行每月底寄一份对账单。' },
      listening: { zh: 'state 读 /steɪt/，与 station 的开头区分开。', en: 'State is /steɪt/; do not confuse it with station.' },
    },
    {
      term: 'due date', phonetic: '/ˈdjuː deɪt/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '到期日，应归还日期', en: 'the day by which something must be returned or paid' },
      usage: { zh: '借阅与付款场景高频：past its due date、extend the due date。', en: 'Common with borrowing and payments: past its due date, extend the due date.' },
      collocations: ['the due date', 'past the due date', 'before the due date'],
      example: { en: 'Please return the book before the due date.', zh: '请在到期日前归还这本书。' },
      listening: { zh: 'due 读 /djuː/，与 dew（露水）同音；靠后面的 date 判断词义。', en: 'Due is a homophone of dew; the following date tells you the meaning.' },
    },
    {
      term: 'renew', phonetic: '/rɪˈnjuː/', partOfSpeech: 'v.', sentenceIndex: 19,
      meaning: { zh: '续借；续订；更新', en: 'to extend the period of a book, contract or licence' },
      usage: { zh: 'renew a book、renew a membership；名词是 renewal。', en: 'renew a book, renew a membership; the noun is renewal.' },
      collocations: ['renew online', 'renew a loan', 'renew the card'],
      example: { en: 'You can renew the ticket online before it expires.', zh: '你可以在票过期前在线续订。' },
      listening: { zh: '重音在第二音节 /ˈnjuː/，开头 /rɪ/ 很轻。', en: 'Stress the second syllable; the opening /rɪ/ is weak.' },
    },
    {
      term: 'reserve', phonetic: '/rɪˈzɜːv/', partOfSpeech: 'v.', sentenceIndex: 35,
      meaning: { zh: '预留，预订；保留', en: 'to keep something available for a particular person' },
      usage: { zh: 'reserve a book、reserve a table；名词 reservation。', en: 'reserve a book, reserve a table; the noun is reservation.' },
      collocations: ['reserve a place', 'reserve a book', 'reserved for'],
      example: { en: 'I reserved a seat near the window.', zh: '我订了靠窗的座位。' },
      listening: { zh: '动词重音在第二音节；名词 reserve 重音在第一音节，靠词性区分。', en: 'The verb stresses the second syllable; the noun stresses the first.' },
    },
    {
      term: 'hold', phonetic: '/həʊld/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '（预约中的）预留登记', en: 'a request to keep an item for a borrower once it returns' },
      usage: { zh: '图书馆语境 place a hold 表示“预约”；普通语境 hold 是“握住”。', en: 'In libraries, place a hold means to reserve; elsewhere it means grip.' },
      collocations: ['place a hold', 'put a hold on', 'a hold on a book'],
      example: { en: 'I put a hold on the next novel in the series.', zh: '我预约了这个系列的下一本小说。' },
      listening: { zh: '与 hole（洞）同音，靠搭配 place a hold 判断词义。', en: 'A homophone of hole; the collocation place a hold identifies it.' },
    },
  ],
  expressions: [
    {
      phrase: 'just moved to', sentenceIndex: 1,
      meaning: { zh: '刚搬到（某地）', en: 'having recently moved house to an area' },
      usage: { zh: 'move to 后接城市或街区；现在完成时 have just moved 强调不久前发生。', en: 'Follow move to with a place; the present perfect have just moved stresses recency.' },
      example: { en: 'We have just moved to this street, so we don’t know the shops yet.', zh: '我们刚搬到这条街，还不认识这里的店铺。' },
    },
    {
      phrase: 'proof of your current address', sentenceIndex: 6,
      meaning: { zh: '地址证明', en: 'an official document showing where someone lives' },
      usage: { zh: '开户、办证场景的固定说法；proof 后接 of。', en: 'A fixed phrase for accounts and cards; proof takes of.' },
      example: { en: 'The bank asked for two pieces of proof of address.', zh: '银行要求提供两份地址证明。' },
    },
    {
      phrase: 'count toward', sentenceIndex: 32,
      meaning: { zh: '计入，算在（额度之内）', en: 'to be included in a total or limit' },
      usage: { zh: 'count toward the limit、count toward the total；美式也写 count towards。', en: 'count toward the limit; American English also writes count towards.' },
      example: { en: 'These ten points count toward your final mark.', zh: '这十分计入你的最终成绩。' },
    },
    {
      phrase: 'in addition to', sentenceIndex: 34,
      meaning: { zh: '除……之外（还）', en: 'as well as; besides' },
      usage: { zh: '后接名词或动名词；与 besides 同义，比 apart from 正式。', en: 'Follow with a noun or gerund; similar to besides, more formal than apart from.' },
      example: { en: 'In addition to the course, she joined two clubs.', zh: '除了课程，她还参加了两个社团。' },
    },
    {
      phrase: 'build up', sentenceIndex: 16,
      meaning: { zh: '（累积）逐渐增加', en: 'to increase little by little over time' },
      usage: { zh: '此处指罚款逐日累积；build up 也可表示“建立信心”。', en: 'Here the fine accumulates day by day; build up can also mean to develop confidence.' },
      example: { en: 'Interest builds up on the unpaid balance each month.', zh: '未付余额每月都会累积利息。' },
    },
    {
      phrase: 'pick it up', sentenceIndex: 38,
      meaning: { zh: '取走，领取', en: 'to collect something from a place' },
      usage: { zh: 'pick something up 是可分短语动词；代词放中间：pick it up。', en: 'A separable phrasal verb: put the pronoun in the middle, pick it up.' },
      example: { en: 'I’ll pick the tickets up on my way home.', zh: '我回家路上取票。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格先按类别锁定行', en: 'Locate the row by category first' },
      body: {
        zh: '配对题的三个物品在原文里按参考书、有声书、期刊的顺序出现。听之前先在物品旁写下关键词，听到 shelf、section 等词时回到对应行，再记规则，不要听到什么选什么。',
        en: 'The three categories appear in order: references, audio books and magazines. Note a keyword beside each item before listening, and return to that row when the shelf or section is mentioned.',
      },
    },
    {
      title: { zh: '数字题排除附加上限', en: 'Watch for the extra limit' },
      body: {
        zh: '十二件是总借阅量，四本是期刊的附加数量，两者不属于同一空格。听到数字先问自己：这是总量、期限还是附加项，再落笔。',
        en: 'Twelve is the total allowance; four is an extra magazine cap. They do not belong to the same blank. When a number arrives, decide whether it is a total, a period or an extra limit.',
      },
    },
    {
      title: { zh: '自我修正后版本为准', en: 'The corrected version wins' },
      body: {
        zh: 'Part 1 常先给一个容易的答案再修正，例如 statement 可以、但更想要 bill。听到 prefer、actually、though 这类词，准备把刚写下的答案换成后面的版本。',
        en: 'Part 1 often gives an easy answer first and then corrects it: a statement will do, but a bill is preferred. When you hear prefer, actually or though, be ready to replace what you wrote.',
      },
    },
  ],
};
