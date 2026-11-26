import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 22 · Part 2 — 就业中心工作坊说明（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白顺序：简历诊所所需材料 → 模拟面试时长 → 本期技能课程 → 预约渠道 → 补贴资格 →
 * 工作坊楼层，后半段回答常见疑问：简历先查什么、模拟面试后反馈、课程面向人群、补贴证明。
 * 填空块在前半段，单选块在后半段，题块顺序与录音顺序一致。
 */
export const test22Part2: ListeningLesson = {
  slug: 'test-22-part-2',
  part: 2,
  status: 'published',
  title: { zh: '就业中心工作坊说明', en: 'Introducing a jobcentre workshop' },
  summary: {
    zh: '就业中心辅导员介绍本季免费工作坊：简历诊所要带的纸质材料、模拟面试时长、基础编程技能课程、网站预约方式、面向领补贴者的交通补贴资格，以及工作坊所在楼层；随后解答简历首查项、面试反馈形式、课程适合人群与补贴所需证明。',
    en: 'A jobcentre officer briefs applicants on this term’s free workshops: resume clinic materials, the mock interview length, the basic coding course, website booking, the travel subsidy and the workshop floor, then answers questions on what the clinic checks first, interview feedback, the course audience and subsidy proof.',
  },
  accent: { zh: '辅导员为南非口音，语速平稳，规则与时间会重复说明。', en: 'The officer speaks with a South African accent at a steady pace, repeating rules and times clearly.' },
  speechRate: '+8%',
  cast: [
    { id: 'officer', label: 'OFFICER', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Resume clinic: bring two printed', cells: [[{ blank: 11 }]] },
        { lead: 'Mock interview lasts about', cells: [[{ blank: 12 }, { text: ' minutes.' }]] },
        { lead: 'Skill course this term: basic', cells: [[{ blank: 13 }]] },
        { lead: 'Book a place through the', cells: [[{ blank: 14 }]] },
        { lead: 'Subsidy available to people on', cells: [[{ blank: 15 }]] },
        { lead: 'Workshop room: on the', cells: [[{ blank: 16 }, { text: ' floor.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'What does the resume adviser check first?',
          options: [
            { key: 'A', text: 'the layout and any gaps in the work history' },
            { key: 'B', text: 'the spelling and grammar of every sentence' },
            { key: 'C', text: 'the salary expected for each listed job' },
          ],
        },
        {
          number: 18,
          stem: 'What happens after the mock interview?',
          options: [
            { key: 'A', text: 'The session is recorded and sent to employers.' },
            { key: 'B', text: 'Feedback is written on a review sheet and read together.' },
            { key: 'C', text: 'The applicant books a second interview the same day.' },
          ],
        },
        {
          number: 19,
          stem: 'Who may join the basic coding course?',
          options: [
            { key: 'A', text: 'people already working full time in software' },
            { key: 'B', text: 'applicants who hold a computer science degree' },
            { key: 'C', text: 'anyone looking to switch careers with no experience' },
          ],
        },
        {
          number: 20,
          stem: 'What must an applicant provide to claim the subsidy?',
          options: [
            { key: 'A', text: 'proof of their current income status' },
            { key: 'B', text: 'a printed copy of their driver’s licence' },
            { key: 'C', text: 'the contact details of a previous employer' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['copies'], evidence: 2,
      explanation: {
        zh: '定位句 2：bring two printed copies of your current resume。简历诊所要带两份纸质复印件；句 3 说手机里的电子版不够，digital copy 是干扰项。',
        en: 'Sentence 2: "bring two printed copies of your current resume". The clinic needs two printed copies; sentence 3 says a digital copy on a phone is not enough, so that is the distractor.',
      },
    },
    {
      number: 12, accepted: ['forty', '40'], evidence: 5,
      explanation: {
        zh: '定位句 5：Each mock interview lasts about forty minutes。模拟面试约四十分钟；句 5 后半段的 shorter discussion 是面试后的讨论，不是时长。',
        en: 'Sentence 5: "Each mock interview lasts about forty minutes". The interview lasts about forty minutes; the shorter discussion after it is a separate part, not the duration.',
      },
    },
    {
      number: 13, accepted: ['coding'], evidence: 9,
      explanation: {
        zh: '定位句 9：The course on offer now is basic coding。本期技能课是基础编程；句 8 的 practical qualification 是课程目标，不是科目名称。',
        en: 'Sentence 9: "The course on offer now is basic coding". The current skill course is basic coding; the practical qualification in sentence 8 is the course’s aim, not the subject name.',
      },
    },
    {
      number: 14, accepted: ['website'], evidence: 12,
      explanation: {
        zh: '定位句 12：book through the jobcentre website。预约走就业中心网站；句 13 的 front desk 只是网站报错时的备用渠道。',
        en: 'Sentence 12: "book through the jobcentre website". Booking goes through the website; the front desk in sentence 13 is only a fallback when the website errors.',
      },
    },
    {
      number: 15, accepted: ['benefits'], evidence: 14,
      explanation: {
        zh: '定位句 14：a travel subsidy for applicants on benefits。补贴面向领救济金的申请人；句 15 的 income status 是审核条件，不是这里的类别。',
        en: 'Sentence 14: "a travel subsidy for applicants on benefits". The subsidy applies to applicants on benefits; the income status in sentence 15 is the check condition, not the category here.',
      },
    },
    {
      number: 16, accepted: ['second'], evidence: 17,
      explanation: {
        zh: '定位句 17：The workshop itself meets on the second floor。工作坊在二层；句 13 的 first floor 指前台所在楼层，不是工作坊房间。',
        en: 'Sentence 17: "The workshop itself meets on the second floor". The workshop is on the second floor; the first floor in sentence 13 is where the front desk sits, not the workshop room.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：The first pass checks the layout and any gaps in your work history。先看版式与工作经历空档，对应 A。B 的拼写语法在句 22 被排到后一轮检查，C 的期望薪资录音中未出现。',
        en: 'Sentence 21: "The first pass checks the layout and any gaps in your work history". Layout and history gaps are checked first, matching A. Spelling and grammar are deferred to a later pass in sentence 22, and expected salary is never mentioned.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：The interviewer writes feedback on a review sheet … You then read the sheet together。反馈写在评价表上并一起过一遍，对应 B。A 的录音在句 28 被明确否定，C 的同日二面录音中没有依据。',
        en: 'Sentence 26: "The interviewer writes feedback on a review sheet … You then read the sheet together". Feedback goes on a review sheet and is read together, matching B. Recording the session is explicitly ruled out in sentence 28, and booking a second interview the same day is not claimed.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 30,
      explanation: {
        zh: '定位句 30：The course is open to anyone looking to switch careers, whether you come from an office job, a trade or a period out of work。课程面向想转行、零基础的人，对应 C。A 的全职软件从业者在句 31 被建议去成人学院，B 的学位在录音中未提及。',
        en: 'Sentence 30: "The course is open to anyone looking to switch careers, whether you come from an office job, a trade or a period out of work". It suits career changers with no experience, matching C. Full-time software workers are directed to the adult college in sentence 31, and a degree is not mentioned.',
      },
    },
    {
      number: 20, accepted: ['A'], evidence: 34,
      explanation: {
        zh: '定位句 34：you must provide proof of your current income status, such as a benefit letter or a payslip。补贴需要当前收入状况证明，对应 A。B 的驾照在句 35 被单独列为不够用的证件，C 的前雇主联系方式与补贴无关。',
        en: 'Sentence 34: "you must provide proof of your current income status, such as a benefit letter or a payslip". The subsidy needs income-status proof, matching A. A driver’s licence alone is ruled out in sentence 35, and a former employer’s contact details are irrelevant.',
      },
    },
  ],
  transcript: [
    { speaker: 'officer', text: 'Good afternoon, and please take a seat. This short briefing covers the free workshops the jobcentre runs this term, so write down the dates that matter to you.' },
    { speaker: 'officer', text: 'The first session is the resume clinic, held every Wednesday morning in room six.' },
    { speaker: 'officer', text: 'Before that session, bring two printed copies of your current resume, because the adviser marks one for you and keeps the other on file.' },
    { speaker: 'officer', text: 'Digital copies on a phone are not enough for the clinic, since the adviser needs to write notes on the paper itself.' },
    { speaker: 'officer', text: 'Next comes the mock interview, which runs every Thursday afternoon.' },
    { speaker: 'officer', text: 'Each mock interview lasts about forty minutes, followed by a shorter discussion about what went well.' },
    { speaker: 'officer', text: 'You will sit across from an interviewer who asks the same kinds of questions used by local employers.' },
    { speaker: 'officer', text: 'The room has a one-way window, but other applicants can hear the discussion afterwards, so answers should stay honest and direct.' },
    { speaker: 'officer', text: 'The third offer this term is a short skill course, aimed at people who want a practical qualification before applying.' },
    { speaker: 'officer', text: 'The course on offer now is basic coding, running for six weeks, two evenings a week.' },
    { speaker: 'officer', text: 'It starts from no experience, and the final week involves a small project you can show to employers.' },
    { speaker: 'officer', text: 'Places are limited, so you cannot just turn up on the first evening.' },
    { speaker: 'officer', text: 'To reserve a place, book through the jobcentre website, and a confirmation will be sent to your email.' },
    { speaker: 'officer', text: 'If the website gives an error, call the front desk on the first floor rather than walking in without a booking.' },
    { speaker: 'officer', text: 'Some of these sessions carry a travel subsidy for applicants on benefits, to cover bus fares and lunch.' },
    { speaker: 'officer', text: 'The subsidy is not automatic. You must show a recent letter or statement that confirms your current income status.' },
    { speaker: 'officer', text: 'Once approved, the money is paid back to your card at the end of the workshop week.' },
    { speaker: 'officer', text: 'The workshop itself meets on the second floor, in the room beside the training kitchen.' },
    { speaker: 'officer', text: 'The stairs are at the far end of the main hall, and the lift is next to the reception desk if you need it.' },
    { speaker: 'officer', text: 'Now a few points applicants often ask about the resume clinic.' },
    { speaker: 'officer', text: 'What does the adviser look at first when your paper reaches the desk?' },
    { speaker: 'officer', text: 'The first pass checks the layout and any gaps in your work history, since those are what an employer notices in the first minute.' },
    { speaker: 'officer', text: 'Spelling and grammar are checked later, after the structure makes sense.' },
    { speaker: 'officer', text: 'Some applicants ask whether the clinic will rewrite the resume for them.' },
    { speaker: 'officer', text: 'The adviser will suggest wording and rearrange sections, but the final version stays yours to submit.' },
    { speaker: 'officer', text: 'After the mock interview, what happens next?' },
    { speaker: 'officer', text: 'The interviewer writes feedback on a review sheet, covering your opening answer, your examples and your body language.' },
    { speaker: 'officer', text: 'You then read the sheet together, and decide which two points to practise before the real interview.' },
    { speaker: 'officer', text: 'There is no recording of the session, so notes on paper are the only record you take away.' },
    { speaker: 'officer', text: 'Who is allowed into the basic coding course?' },
    { speaker: 'officer', text: 'The course is open to anyone looking to switch careers, whether you come from an office job, a trade or a period out of work.' },
    { speaker: 'officer', text: 'People already working full time in software should apply through the adult college instead, since this group starts from zero.' },
    { speaker: 'officer', text: 'The fee for this jobcentre course is covered by the scheme, but materials for the final project are your own responsibility.' },
    { speaker: 'officer', text: 'One last question about the subsidy.' },
    { speaker: 'officer', text: 'To claim it, you must provide proof of your current income status, such as a benefit letter or a payslip from part time work.' },
    { speaker: 'officer', text: 'A driver’s licence or a bank statement alone does not confirm the relevant status, so bring the right document to the booking desk.' },
    { speaker: 'officer', text: 'If your situation changes after approval, tell the adviser the same week, because the subsidy may be adjusted.' },
    { speaker: 'officer', text: 'Before you leave, pick up the printed timetable from the rack beside the door.' },
    { speaker: 'officer', text: 'It lists every clinic, course and mock interview for the next three months, with the room numbers and booking links.' },
    { speaker: 'officer', text: 'The front desk can also help you print resume copies if you do not have a printer at home.' },
    { speaker: 'officer', text: 'That service is free, but please arrive at least twenty minutes before your booked session.' },
    { speaker: 'officer', text: 'Are there any questions about the dates or the rooms before we split up?' },
    { speaker: 'officer', text: 'No, then follow the signs to the second floor, and make sure you keep the booking email for your records.' },
  ],
  vocabulary: [
    {
      term: 'resume', phonetic: '/ˈrezjumeɪ/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '简历，履历表', en: 'a written summary of a person’s work history and skills' },
      usage: { zh: '可数名词；英式常称 CV；current resume、rewrite a resume。', en: 'Countable; British English often says CV. Current resume, rewrite a resume.' },
      collocations: ['a printed resume', 'the current resume', 'rewrite a resume'],
      example: { en: 'Bring two printed copies of your current resume to the clinic.', zh: '带两份打印好的简历复印件去诊所。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /meɪ/ 不弱读。', en: 'Two syllables with first-syllable stress; the ending /meɪ/ stays clear.' },
    },
    {
      term: 'mock', phonetic: '/mɒk/', partOfSpeech: 'adj.', sentenceIndex: 5,
      meaning: { zh: '模拟的，仿真的', en: 'practised in a form that copies a real situation' },
      usage: { zh: '只作定语；mock interview、mock test、mock exam。', en: 'Attributive only: mock interview, mock test, mock exam.' },
      collocations: ['a mock interview', 'a mock test', 'the mock session'],
      example: { en: 'Each mock interview lasts about forty minutes.', zh: '每次模拟面试约四十分钟。' },
      listening: { zh: '单音节，元音 /ɒ/，结尾 /k/ 清辅音。', en: 'One syllable with /ɒ/ and a voiceless final /k/.' },
    },
    {
      term: 'qualification', phonetic: '/ˌkwɒlɪfɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '资格证明，技能证书', en: 'an official record showing a level of skill or training' },
      usage: { zh: '可数名词；a practical qualification、gain a qualification。', en: 'Countable: a practical qualification, gain a qualification.' },
      collocations: ['a practical qualification', 'gain a qualification', 'a recognised qualification'],
      example: { en: 'The course aims to give applicants a practical qualification.', zh: '课程旨在让申请人获得实用资格证明。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈkeɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'subsidy', phonetic: '/ˈsʌbsədi/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '补贴，补助金', en: 'money paid to cover costs for eligible applicants' },
      usage: { zh: '可数名词；a travel subsidy、claim the subsidy。动词 subsidise。', en: 'Countable: a travel subsidy, claim the subsidy. The verb is subsidise.' },
      collocations: ['a travel subsidy', 'claim the subsidy', 'the subsidy is approved'],
      example: { en: 'The travel subsidy covers bus fares and lunch.', zh: '交通补贴可覆盖车费和午餐。' },
      listening: { zh: '三个音节，重音在第一个；结尾 /di/ 弱读。', en: 'Three syllables with first-syllable stress; the ending is weak /di/.' },
    },
    {
      term: 'layout', phonetic: '/ˈleɪaʊt/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '版式，版面安排', en: 'the arrangement of sections and text on a page' },
      usage: { zh: '可数或不可数；check the layout、page layout。', en: 'Countable or uncountable: check the layout, page layout.' },
      collocations: ['check the layout', 'the page layout', 'a clear layout'],
      example: { en: 'The first pass checks the layout and gaps in the history.', zh: '第一轮先检查版式和经历空档。' },
      listening: { zh: '复合词 lay 加 out，重音在第一个音节。', en: 'Compound lay plus out, stress on the first.' },
    },
    {
      term: 'feedback', phonetic: '/ˈfiːdbæk/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '反馈，点评意见', en: 'comments on how a person performed in the session' },
      usage: { zh: '不可数；write feedback、give feedback、review sheet feedback。', en: 'Uncountable: write feedback, give feedback.' },
      collocations: ['write feedback', 'give feedback', 'review feedback'],
      example: { en: 'The interviewer writes feedback on a review sheet.', zh: '面试官把反馈写在评价表上。' },
      listening: { zh: '复合词 feed 加 back，重音在第一个。', en: 'Compound feed plus back, stress on the first.' },
    },
    {
      term: 'payslip', phonetic: '/ˈpeɪslɪp/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '工资单，收入凭条', en: 'a document showing the pay received for a period' },
      usage: { zh: '可数名词；a payslip from part time work、show a payslip。', en: 'Countable: a payslip from part time work, show a payslip.' },
      collocations: ['a payslip', 'a recent payslip', 'show a payslip'],
      example: { en: 'A payslip from part time work confirms your income status.', zh: '兼职工资单可以证明你的收入状况。' },
      listening: { zh: '复合词 pay 加 slip，重音在第一个音节。', en: 'Compound pay plus slip, stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'take a seat', sentenceIndex: 0,
      meaning: { zh: '请坐下', en: 'a polite invitation to sit down' },
      usage: { zh: '独白开场礼貌用语；please take a seat、take your seat。', en: 'Polite opener: please take a seat, take your seat.' },
      example: { en: 'Good afternoon, and please take a seat.', zh: '下午好，请坐。' },
    },
    {
      phrase: 'on file', sentenceIndex: 2,
      meaning: { zh: '存档，留存备案', en: 'kept in the records for later reference' },
      usage: { zh: '登记语境；kept on file、put on file。', en: 'Registration: kept on file, put on file.' },
      example: { en: 'The adviser marks one copy and keeps the other on file.', zh: '顾问改一份，另一份存档。' },
    },
    {
      phrase: 'turn up', sentenceIndex: 11,
      meaning: { zh: '到场，露面（不预约直接来）', en: 'to arrive without booking in advance' },
      usage: { zh: '短语动词；cannot just turn up、turn up late。', en: 'Phrasal verb: cannot just turn up, turn up late.' },
      example: { en: 'Places are limited, so do not just turn up on the first evening.', zh: '名额有限，别直接到场参加第一晚。' },
    },
    {
      phrase: 'on offer', sentenceIndex: 9,
      meaning: { zh: '本期提供的，正在开设的', en: 'available or provided during this term' },
      usage: { zh: '课程与商品语境；the course on offer、the job on offer。', en: 'Courses or jobs: the course on offer, the job on offer.' },
      example: { en: 'The course on offer now is basic coding for beginners.', zh: '本期开设的课程是零基础基础编程。' },
    },
    {
      phrase: 'switch careers', sentenceIndex: 30,
      meaning: { zh: '转行，更换职业方向', en: 'to change to a different kind of work' },
      usage: { zh: 'switch 后接 careers、jobs、fields；switch careers from something。', en: 'Switch takes careers, jobs or fields; switch careers from something.' },
      example: { en: 'The course suits anyone looking to switch careers.', zh: '课程适合任何想转行的人。' },
    },
    {
      phrase: 'your own responsibility', sentenceIndex: 32,
      meaning: { zh: '由本人自行承担', en: 'something you must pay for or arrange yourself' },
      usage: { zh: '表示由本人自行承担；materials are your own responsibility 指材料自备。', en: 'Be one’s own responsibility; materials are your own responsibility.' },
      example: { en: 'Final project materials are your own responsibility.', zh: '期末项目材料由你自行准备。' },
    },
  ],
  tips: [
    {
      title: { zh: '材料题分清带几份、带哪种', en: 'Separate quantity from format' },
      body: {
        zh: '第 11 题问数量与形式：two printed copies，句 3 补充电子版不够。听前先看空格前的 two printed，落笔时确认答案是纸质复印件，不要把 digital copy 填进去。',
        en: 'Item 11 asks quantity and format: two printed copies, and sentence 3 adds that a digital copy is insufficient. Check the printed two before the gap, and confirm the answer is paper copies rather than a digital copy.',
      },
    },
    {
      title: { zh: '楼层与部门别混', en: 'Do not mix floor and department' },
      body: {
        zh: '第 16 题问工作坊楼层，句 17 给 second floor；句 13 的 first floor 属于 front desk。独白常把两个楼层信息放在不同段落，听到楼层先记下对应房间用途，避免填反。',
        en: 'Item 16 asks the workshop floor, given in sentence 17 as the second floor; the first floor in sentence 13 belongs to the front desk. A monologue places the two floor details in different sections, so record the room’s use beside each floor level.',
      },
    },
    {
      title: { zh: '被排除人群反向判断课程对象', en: 'Excluded groups define the audience' },
      body: {
        zh: '第 19 题问谁能上编程课，句 31 把全职软件从业者排除并建议去成人学院；反过来印证课程是零基础转行班。听到 people already working full time 这类排除语，在对应选项旁标叉。',
        en: 'Item 19 asks who may join. Sentence 31 excludes full-time software workers and sends them to the adult college, which confirms the course starts from zero. Mark a cross beside options after people already working full time.',
      },
    },
  ],
};
