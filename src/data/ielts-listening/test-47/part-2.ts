import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 47 · Part 2 — 学校开放日场地说明（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白顺序：参观路线 → 课程展示 → 招生流程 → 校车线路 → 问答环节（填空块在前半段），
 * 后半段复述首站位置、展示内容、申请方式与问答形式（单选块）。
 * 题块顺序与录音顺序一致。开场用入场指引，不用 welcome to。
 */
export const test47Part2: ListeningLesson = {
  slug: 'test-47-part-2',
  part: 2,
  status: 'published',
  title: { zh: '学校开放日说明', en: 'A talk at a school open day' },
  summary: {
    zh: '讲解员在开放日带领访客参观：队伍先在主门厅集合，课程展示设在体育馆，陈列学生作品；招生须填在线申请表，校车服务城北郊区，问答环节在图书馆进行，招生简章在招生办公室领取；后半段复述参观首站、展示内容、申请方式与问答的小组形式。',
    en: 'The guide briefs visitors on school open day: the tour starts in the entrance hall, displays fill the sports hall with student work, admissions use an online form, the bus serves the northern suburbs, the Q&A is in the library, the prospectus comes from the admissions office; the recap covers first stop, displays, application and group Q&A.',
  },
  accent: { zh: '讲解员为南非口音，语速平稳，流程安排处会重复强调。', en: 'The guide speaks with a South African accent at a steady pace, repeating the schedule points that matter most.' },
  speechRate: '+8%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Tour begins at the main entrance', cells: [[{ blank: 11 }]] },
        { lead: 'Course displays in the', cells: [[{ blank: 12 }, { text: ' hall.' }]] },
        { lead: 'Admissions application submitted as an online', cells: [[{ blank: 13 }]] },
        { lead: 'School bus serves the northern', cells: [[{ blank: 14 }, { text: ' of the town.' }]] },
        { lead: 'Question session takes place in the', cells: [[{ blank: 15 }]] },
        { lead: 'Printed prospectus from the admissions', cells: [[{ blank: 16 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'Where does the tour go first?',
          options: [
            { key: 'A', text: 'The science labs.' },
            { key: 'B', text: 'The main entrance hall.' },
            { key: 'C', text: 'The sports field.' },
          ],
        },
        {
          number: 18,
          stem: 'What can visitors see in the course displays?',
          options: [
            { key: 'A', text: 'Student art and project work.' },
            { key: 'B', text: 'Official exam certificates.' },
            { key: 'C', text: 'Staff timetables for the term.' },
          ],
        },
        {
          number: 19,
          stem: 'How do parents apply for a place?',
          options: [
            { key: 'A', text: 'By posting a paper letter to the school.' },
            { key: 'B', text: 'Through the online form on the website.' },
            { key: 'C', text: 'By visiting the office every term.' },
          ],
        },
        {
          number: 20,
          stem: 'What happens at the question session?',
          options: [
            { key: 'A', text: 'Teachers interview each child one by one.' },
            { key: 'B', text: 'Visitors ask questions in a group session.' },
            { key: 'C', text: 'The head teacher gives a private tour.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['hall'], evidence: 3,
      explanation: {
        zh: '定位句 3：The tour begins at the main entrance hall, where the head teacher will greet you briefly。参观从主门厅开始，填 hall；entrance 已印在卷面上。',
        en: 'Sentence 3: "The tour begins at the main entrance hall, where the head teacher will greet you briefly". The tour starts in the entrance hall; entrance is printed, so write hall.',
      },
    },
    {
      number: 12, accepted: ['sports'], evidence: 7,
      explanation: {
        zh: '定位句 7：The course displays are held in the sports hall, spread along tables around the court。展示设在体育馆，空后已印 hall，填 sports。',
        en: 'Sentence 7: "The course displays are held in the sports hall, spread along tables around the court". Displays are in the sports hall; hall is printed, so write sports.',
      },
    },
    {
      number: 13, accepted: ['form'], evidence: 12,
      explanation: {
        zh: '定位句 12：Parents complete an online form to apply for a place, choosing the year group they need。招生走在线申请表，填 form。',
        en: 'Sentence 12: "Parents complete an online form to apply for a place, choosing the year group they need". Admissions use an online form, so write form.',
      },
    },
    {
      number: 14, accepted: ['suburbs'], evidence: 16,
      explanation: {
        zh: '定位句 16：The school bus serves the northern suburbs of the town, where most of our students live。校车服务城北郊区，填复数 suburbs。',
        en: 'Sentence 16: "The school bus serves the northern suburbs of the town, where most of our students live". The bus serves the northern suburbs; write the plural suburbs.',
      },
    },
    {
      number: 15, accepted: ['library'], evidence: 20,
      explanation: {
        zh: '定位句 20：The question session takes place in the library, on the ground floor beside the hall。问答环节在图书馆，填 library。',
        en: 'Sentence 20: "The question session takes place in the library, on the ground floor beside the hall". The Q&A is in the library, so write library.',
      },
    },
    {
      number: 16, accepted: ['office'], evidence: 23,
      explanation: {
        zh: '定位句 23：A printed prospectus is available from the admissions office near the entrance。简章在招生办公室领取，填 office。',
        en: 'Sentence 23: "A printed prospectus is available from the admissions office near the entrance". The prospectus comes from the admissions office, so write office.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：The tour first gathers in the main entrance hall, before moving through the building。首站是主门厅，对应 B。A 的实验室与 C 的运动场在录音中均未作为首站出现。',
        en: 'Sentence 27: "The tour first gathers in the main entrance hall, before moving through the building". The first stop is the entrance hall, matching B. Labs and the sports field are not the first stop.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：The tables hold student art and project work, not official certificates or staff timetables。展示的是学生美术与项目作品，对应 A。B 的官方证书与 C 的员工时间表在同句被否定。',
        en: 'Sentence 29: "The tables hold student art and project work, not official certificates or staff timetables". Student art and project work match A. Certificates and timetables are both ruled out in the same sentence.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：Applications go through the online form on the school website, rather than a posted letter。申请走网站在线表单，对应 B。A 的纸质邮寄信与 rather than 相反，C 的每学期上门在录音中没有依据。',
        en: 'Sentence 31: "Applications go through the online form on the school website, rather than a posted letter". The online form matches B. A posted letter contradicts rather than, and visiting every term is not said.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 33,
      explanation: {
        zh: '定位句 33：Visitors ask questions together in a group, with teachers and students replying on hand。问答是小组集体提问，对应 B。A 的逐人面试与句 34 的 not interviewed one by one 相反，C 的校长私人参观在录音中没有依据。',
        en: 'Sentence 33: "Visitors ask questions together in a group, with teachers and students replying on hand". A group Q&A matches B. One-by-one interviews contradict sentence 34, and a private head-teacher tour is not said.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'If you have just come through the gates, please follow the yellow flags toward the main hall.' },
    { speaker: 'guide', text: 'I am Leah, and I will be your guide for this school open day.' },
    { speaker: 'guide', text: 'We have a short tour planned, followed by displays, a talk on admissions and a question session.' },
    { speaker: 'guide', text: 'The tour begins at the main entrance hall, where the head teacher will greet you briefly.' },
    { speaker: 'guide', text: 'From the hall we pass the notice boards that show the latest school news and exam results.' },
    { speaker: 'guide', text: 'We will not enter every classroom today, but you can look through the doors as we walk.' },
    { speaker: 'guide', text: 'After the entrance hall, the next stop is the sports hall.' },
    { speaker: 'guide', text: 'The course displays are held in the sports hall, spread along tables around the court.' },
    { speaker: 'guide', text: 'Each subject sets out examples of student work, from design projects to writing samples.' },
    { speaker: 'guide', text: 'Art pieces and science models hang on the walls between the tables.' },
    { speaker: 'guide', text: 'Staff from each department stand beside their tables to answer quick questions.' },
    { speaker: 'guide', text: 'Next, the admissions process, which the registrar will explain in more detail later.' },
    { speaker: 'guide', text: 'Parents complete an online form to apply for a place, choosing the year group they need.' },
    { speaker: 'guide', text: 'The form asks for basic contact details and the child’s current school, if any.' },
    { speaker: 'guide', text: 'Offers are sent out after the deadline, and families then confirm whether they accept.' },
    { speaker: 'guide', text: 'Transport is another point parents often ask about on open day.' },
    { speaker: 'guide', text: 'The school bus serves the northern suburbs of the town, where most of our students live.' },
    { speaker: 'guide', text: 'The route picks up at three stops along the main road and returns there after school.' },
    { speaker: 'guide', text: 'Families outside the bus area arrange their own travel to and from the gates.' },
    { speaker: 'guide', text: 'After the tour and displays, we hold a question session for everyone.' },
    { speaker: 'guide', text: 'The question session takes place in the library, on the ground floor beside the hall.' },
    { speaker: 'guide', text: 'You may ask about subjects, homework, clubs or the school day in general.' },
    { speaker: 'guide', text: 'Teachers and senior students stay on hand to answer what they can.' },
    { speaker: 'guide', text: 'A printed prospectus is available from the admissions office near the entrance.' },
    { speaker: 'guide', text: 'It lists the subjects, clubs and term dates for the coming year.' },
    { speaker: 'guide', text: 'Now a few points visitors often ask about the day itself.' },
    { speaker: 'guide', text: 'Where does the tour go first?' },
    { speaker: 'guide', text: 'The tour first gathers in the main entrance hall, before moving through the building.' },
    { speaker: 'guide', text: 'Which displays are on show in the sports hall?' },
    { speaker: 'guide', text: 'The tables hold student art and project work, not official certificates or staff timetables.' },
    { speaker: 'guide', text: 'How do parents apply for a school place?' },
    { speaker: 'guide', text: 'Applications go through the online form on the school website, rather than a posted letter.' },
    { speaker: 'guide', text: 'What takes place at the question session?' },
    { speaker: 'guide', text: 'Visitors ask questions together in a group, with teachers and students replying on hand.' },
    { speaker: 'guide', text: 'Children are not interviewed one by one during the open day itself.' },
    { speaker: 'guide', text: 'The head teacher will speak briefly at the start, but the group session does the main work.' },
    { speaker: 'guide', text: 'The displays stay open until mid afternoon, so you can revisit them after the talk.' },
    { speaker: 'guide', text: 'Biscuits and drinks are laid out in the canteen during the break between sessions.' },
    { speaker: 'guide', text: 'Parents may note their questions down on the cards handed out at the entrance.' },
    { speaker: 'guide', text: 'Any question we cannot answer today will be followed up by email this week.' },
    { speaker: 'guide', text: 'The school garden beside the hall is also open for a short walk between displays.' },
    { speaker: 'guide', text: 'Please keep to the marked paths, as some rooms are still in lessons.' },
    { speaker: 'guide', text: 'This year’s open day follows the same timetable as the autumn visit last term.' },
    { speaker: 'guide', text: 'Thank you for walking the route with me, and I will hand you over to the registrar now.' },
  ],
  vocabulary: [
    {
      term: 'registrar', phonetic: '/ˌredʒɪˈstrɑːr/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '招生注册主任，负责入学登记', en: 'the staff member who explains the admissions process' },
      usage: { zh: '可数；the registrar、admissions registrar。', en: 'Countable: the registrar, admissions registrar.' },
      collocations: ['the registrar', 'the admissions registrar', 'speak to the registrar'],
      example: { en: 'The registrar explains the admissions process in detail later.', zh: '注册主任稍后详细讲解招生流程。' },
      listening: { zh: '三个音节，重音在最后音节 /ˈstrɑːr/。', en: 'Three syllables with stress on the final.' },
    },
    {
      term: 'prospectus', phonetic: '/prəˈspektəs/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '招生简章，学校介绍手册', en: 'the printed booklet listing subjects, clubs and dates' },
      usage: { zh: '可数；a printed prospectus、the school prospectus。', en: 'Countable: a printed prospectus, the school prospectus.' },
      collocations: ['the printed prospectus', 'the school prospectus', 'collect the prospectus'],
      example: { en: 'The prospectus lists subjects, clubs and term dates.', zh: '招生简章列出科目、社团与学期日期。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈspek/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'displays', phonetic: '/dɪˈspleɪz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '展示，陈列（学生作品）', en: 'the arranged tables and walls showing student work' },
      usage: { zh: '可数复数；course displays、on show in the displays。动词 display。', en: 'Plural countable: course displays. The verb is display.' },
      collocations: ['course displays', 'the displays in the hall', 'revisit the displays'],
      example: { en: 'The course displays fill the sports hall with student work.', zh: '课程展示在体育馆摆满学生作品。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈspleɪ/；结尾 /z/。', en: 'Two syllables with second stress; the ending is /z/.' },
    },
    {
      term: 'admissions', phonetic: '/ədˈmɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '招生，入学录取环节', en: 'the process of applying for and accepting a place' },
      usage: { zh: '复数名词；the admissions process、admissions office。', en: 'Plural: the admissions process, admissions office.' },
      collocations: ['the admissions process', 'the admissions office', 'admissions applications'],
      example: { en: 'The registrar explains the admissions process after the tour.', zh: '参观后注册主任讲解招生流程。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈmɪʃ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'suburbs', phonetic: '/ˈsʌbɜːrbs/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '郊区，城镇外围居住区', en: 'the residential areas outside the town centre' },
      usage: { zh: '复数；the northern suburbs、live in the suburbs。', en: 'Plural: the northern suburbs, live in the suburbs.' },
      collocations: ['the northern suburbs', 'the town suburbs', 'serve the suburbs'],
      example: { en: 'The school bus serves the northern suburbs each morning.', zh: '校车每天早上服务城北郊区。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsʌb/；结尾 /z/。', en: 'Two syllables with first stress; the ending is /z/.' },
    },
    {
      term: 'timetable', phonetic: '/ˈtaɪmteɪbl/', partOfSpeech: 'n.', sentenceIndex: 42,
      meaning: { zh: '时间表，课程日程安排', en: 'the schedule of sessions through the open day' },
      usage: { zh: '可数；the same timetable、the school timetable。', en: 'Countable: the same timetable, the school timetable.' },
      collocations: ['the open day timetable', 'the school timetable', 'follow the timetable'],
      example: { en: 'The open day follows last term’s timetable.', zh: '开放日沿用上学期的时间表。' },
      listening: { zh: '复合词，重音在第一词 time；table 读 /teɪbl/。', en: 'Compound with stress on time; table is /teɪbl/.' },
    },
  ],
  expressions: [
    {
      phrase: 'follow the yellow flags', sentenceIndex: 0,
      meaning: { zh: '跟着黄色指示旗走', en: 'to move along the route marked by yellow flags' },
      usage: { zh: 'follow + 标识物；场地指引高频。', en: 'Follow plus a marker; common in venue directions.' },
      example: { en: 'Follow the yellow flags toward the main hall.', zh: '跟着黄色旗子走到主门厅。' },
    },
    {
      phrase: 'stand beside', sentenceIndex: 10,
      meaning: { zh: '站在……旁边（值守展台）', en: 'to be next to a display table to answer questions' },
      usage: { zh: 'stand beside the tables；活动值守场景高频。', en: 'Stand beside the tables; common at displays.' },
      example: { en: 'Staff stand beside their tables to answer quick questions.', zh: '工作人员站在展台旁回答简短问题。' },
    },
    {
      phrase: 'apply for a place', sentenceIndex: 12,
      meaning: { zh: '申请入学名额', en: 'to submit an application for a school place' },
      usage: { zh: 'apply for + 名额；招生场景高频。', en: 'Apply for plus a place; common in admissions.' },
      example: { en: 'Parents complete the online form to apply for a place.', zh: '家长填在线表申请入学名额。' },
    },
    {
      phrase: 'on hand', sentenceIndex: 22,
      meaning: { zh: '在场待命，随时可帮忙', en: 'available nearby to answer questions' },
      usage: { zh: 'stay on hand、be on hand；活动志愿场景高频。', en: 'Stay on hand, be on hand; common at events.' },
      example: { en: 'Teachers and students stay on hand to answer questions.', zh: '老师和学生留在现场待命答疑。' },
    },
    {
      phrase: 'on show', sentenceIndex: 28,
      meaning: { zh: '展出，陈列出来', en: 'displayed for visitors to look at' },
      usage: { zh: 'be on show；展览场景高频。', en: 'Be on show; common at displays.' },
      example: { en: 'Student art and project work are on show in the sports hall.', zh: '学生美术与项目作品在体育馆展出。' },
    },
    {
      phrase: 'followed up', sentenceIndex: 39,
      meaning: { zh: '后续跟进，事后答复', en: 'to be answered later after the open day' },
      usage: { zh: 'follow up by email；被动 be followed up。', en: 'Follow up by email; passive be followed up.' },
      example: { en: 'Unanswered questions are followed up by email this week.', zh: '没答完的问题本周邮件跟进。' },
    },
  ],
  tips: [
    {
      title: { zh: '先定位展区，再记设施名称', en: 'Locate the zone before the facility name' },
      body: {
        zh: '第 11 题问首站地点，第 12 题问展示所在场馆；独白常先说路线再给设施名。听前把两题并排看，听到 entrance hall 时记首站，听到 sports hall 时记场馆，避免把两个地点填反。',
        en: 'Item 11 asks the first stop and item 12 the display hall; monologues often give the route before the facility. Read both together, note entrance hall for the stop and sports hall for the venue, so the two locations are not swapped.',
      },
    },
    {
      title: { zh: '否定句决定展示类选项', en: 'Negatives decide the display options' },
      body: {
        zh: '第 18 题出现 not official certificates or staff timetables 这类否定并列。干扰项常把被排除的材料说成展品；听到 not、rather than 时先在选项旁标叉，再确认被陈列的主体是学生作品。',
        en: 'Item 18 contains not official certificates or staff timetables. Distractors turn excluded material into exhibits; mark a cross on a negative such as not or rather than, then confirm the displayed subject is student work.',
      },
    },
    {
      title: { zh: '把流程按话题归堆预读', en: 'Pre-group the process points by topic' },
      body: {
        zh: '路线、展示、招生、校车、问答是五段并列内容。听前在每题旁标注话题词，独白路标 After the entrance hall、Next、Transport、After the tour 出现时，直接跳到对应话题的题号。',
        en: 'Route, displays, admissions, bus and Q&A are five parallel blocks. Mark topic words beside each gap before listening, and jump to that item on a signpost such as After the entrance hall, Next, Transport or After the tour.',
      },
    },
  ],
};
