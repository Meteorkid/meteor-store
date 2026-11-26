import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 35 · Part 2 — 成人教育课程介绍（单人说明，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 顺序：课程门类与常年开设项 → 课时时长、学费、证书与报名截止（单选 11–15）→
 * 场地、上课日、课程次数、费用包含项与晚报名要求（笔记填空 16–20）。
 */
export const test35Part2: ListeningLesson = {
  slug: 'test-35-part-2',
  part: 2,
  status: 'published',
  title: { zh: '成人教育课程介绍', en: 'Information on adult education courses' },
  summary: {
    zh: '社区成人教育中心介绍新学期课程：常年开设的基础计算机班、每次两小时的晚间课时、每学期六十美元标准学费、写作班颁发市议会证书，以及九月二十日截止报名；并说明中心楼场地、陶艺班周二晚、十二次课、费用含材料与茶点、晚报名需导师批准。',
    en: 'The adult education centre outlines the term: year-round basic computing, two hour evening sessions, the sixty dollar standard fee, the city council certificate for writing, and enrolment closing on the twentieth of September, plus the central building venue, Tuesday pottery evenings, twelve sessions, included materials and refreshments, and tutor approval for late enrolment.',
  },
  accent: { zh: '讲解员为加拿大口音。', en: 'The speaker has a Canadian accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 11,
          stem: 'Which group of courses runs all year?',
          options: [
            { key: 'A', text: 'basic computing' },
            { key: 'B', text: 'pottery' },
            { key: 'C', text: 'spoken English' },
          ],
        },
        {
          number: 12,
          stem: 'How long does each weekly session last?',
          options: [
            { key: 'A', text: 'one hour' },
            { key: 'B', text: 'two hours' },
            { key: 'C', text: 'three hours' },
          ],
        },
        {
          number: 13,
          stem: 'What is the standard evening course fee per term?',
          options: [
            { key: 'A', text: 'sixty dollars' },
            { key: 'B', text: 'thirty dollars' },
            { key: 'C', text: 'ninety dollars' },
          ],
        },
        {
          number: 14,
          stem: 'What qualification does the writing course lead to?',
          options: [
            { key: 'A', text: 'a formal university diploma' },
            { key: 'B', text: 'an international language test result' },
            { key: 'C', text: 'a city council certificate' },
          ],
        },
        {
          number: 15,
          stem: 'When does enrolment close?',
          options: [
            { key: 'A', text: 'the twentieth of September' },
            { key: 'B', text: 'the tenth of September' },
            { key: 'C', text: 'the thirtieth of September' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Venue', cells: [[{ blank: 16 }, { text: 'building' }]] },
        { lead: 'Pottery class meets', cells: [[{ blank: 17 }, { text: 'evenings' }]] },
        { lead: 'Sessions per course', cells: [[{ blank: 18 }]] },
        { lead: 'Fee includes course materials and', cells: [[{ blank: 19 }]] },
        { lead: 'Late enrolment needs the tutor’s', cells: [[{ blank: 20 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['A'], evidence: 2,
      explanation: {
        zh: '定位句 2：Computing is the only group that runs all year; the others start and finish each term。常年开设的是计算机，对应 A。陶艺与口语都按学期起止。',
        en: 'Sentence 2: "Computing is the only group that runs all year; the others start and finish each term", matching A. Pottery and spoken English run term by term.',
      },
    },
    {
      number: 12, accepted: ['B'], evidence: 7,
      explanation: {
        zh: '定位句 7：Most classes meet one evening a week, and each session lasts two hours。每周一次、每次两小时，对应 B。七点到九点的课间休息在句 8，不是课时长度。',
        en: 'Sentence 7: "Most classes meet one evening a week, and each session lasts two hours", matching B. The break in the seven to nine schedule in sentence 8 is not the session length.',
      },
    },
    {
      number: 13, accepted: ['A'], evidence: 9,
      explanation: {
        zh: '定位句 9：The standard fee for an evening course is sixty dollars per term。标准学费每学期六十美元，对应 A。半价优惠是学生与长者，不是标准价。',
        en: 'Sentence 9: "The standard fee for an evening course is sixty dollars per term", matching A. The half price concession in sentence 10 applies to students and seniors, not the standard fee.',
      },
    },
    {
      number: 14, accepted: ['C'], evidence: 11,
      explanation: {
        zh: '定位句 11：The writing course leads to a city council certificate, recorded on the centre’s public register。写作班颁发市议会证书，对应 C。计算机与陶艺只发参与证明（句 12）。',
        en: 'Sentence 11: "The writing course leads to a city council certificate, recorded on the centre’s public register", matching C. Computing and pottery give participation letters only, in sentence 12.',
      },
    },
    {
      number: 15, accepted: ['A'], evidence: 13,
      explanation: {
        zh: '定位句 13：Enrolment opens at the start of September, and it closes on the twentieth of September。截止九月二十日，对应 A。句 14 是截止后的晚报名规则。',
        en: 'Sentence 13: "Enrolment opens at the start of September, and it closes on the twentieth of September", matching A. Sentence 14 covers late enrolment after that date.',
      },
    },
    {
      number: 16, accepted: ['central'], evidence: 18,
      explanation: {
        zh: '定位句 18：The courses are held in the central building, near the library and the community hall。场地是中心楼，填 central；房间号与位置在后续通知邮件中给出。',
        en: 'Sentence 18: "The courses are held in the central building, near the library and the community hall", fill central. The exact room number arrives in the later welcome email.',
      },
    },
    {
      number: 17, accepted: ['Tuesday'], evidence: 19,
      explanation: {
        zh: '定位句 19：The pottery class is held on Tuesday evenings, while writing meets on Thursdays。陶艺班在周二晚，填 Tuesday；周四是写作班。',
        en: 'Sentence 19: "The pottery class is held on Tuesday evenings, while writing meets on Thursdays", fill Tuesday. Thursday is the writing class.',
      },
    },
    {
      number: 18, accepted: ['12', 'twelve'], spoken: 'twelve', evidence: 21,
      explanation: {
        zh: '定位句 21：Each course has twelve sessions over the term, and a missed class can be made up online。每门课十二次，填 twelve；补课渠道是线上记录，不是额外加课。',
        en: 'Sentence 21: "Each course has twelve sessions over the term, and a missed class can be made up online", fill twelve. Catch-up uses online notes, not extra sessions.',
      },
    },
    {
      number: 19, accepted: ['refreshments'], evidence: 22,
      explanation: {
        zh: '定位句 22：The fee covers course materials and refreshments, but you buy your own pottery clay if needed。费用含材料和茶点，填 refreshments；陶土需自购。',
        en: 'Sentence 22: "The fee covers course materials and refreshments, but you buy your own pottery clay if needed", fill refreshments. Pottery clay is bought separately.',
      },
    },
    {
      number: 20, accepted: ['approval'], evidence: 14,
      explanation: {
        zh: '定位句 14：After that date, late enrolment needs the tutor’s approval before a place can be reserved。晚报名需导师批准，填 approval；前台不能直接保留名额。',
        en: 'Sentence 14: "After that date, late enrolment needs the tutor’s approval before a place can be reserved", fill approval. The desk cannot reserve a place directly.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Let me go over what the adult education centre is offering this term, before you pick a course.' },
    { speaker: 'coordinator', text: 'The brochure lists four main groups, computing, creative writing, pottery and spoken English.' },
    { speaker: 'coordinator', text: 'Computing is the only group that runs all year; the others start and finish each term.' },
    { speaker: 'coordinator', text: 'The basic computing course assumes no prior skills, and it uses laptops provided by the centre.' },
    { speaker: 'coordinator', text: 'In creative writing, you draft short pieces and share feedback in a small group.' },
    { speaker: 'coordinator', text: 'Pottery covers hand building and glazing, with kiln time arranged through the tutor.' },
    { speaker: 'coordinator', text: 'Spoken English focuses on conversation, pronunciation and everyday vocabulary.' },
    { speaker: 'coordinator', text: 'Most classes meet one evening a week, and each session lasts two hours.' },
    { speaker: 'coordinator', text: 'Evening classes run from seven o’clock until nine, with a short break halfway through.' },
    { speaker: 'coordinator', text: 'The standard fee for an evening course is sixty dollars per term.' },
    { speaker: 'coordinator', text: 'Concession places are half price for students and senior residents, on proof of status.' },
    { speaker: 'coordinator', text: 'The writing course leads to a city council certificate, recorded on the centre’s public register.' },
    { speaker: 'coordinator', text: 'Computing and pottery give a participation letter only, not a formal exam certificate.' },
    { speaker: 'coordinator', text: 'Enrolment opens at the start of September, and it closes on the twentieth of September.' },
    { speaker: 'coordinator', text: 'After that date, late enrolment needs the tutor’s approval before a place can be reserved.' },
    { speaker: 'coordinator', text: 'You can register at the front desk or through the centre’s online portal.' },
    { speaker: 'coordinator', text: 'Bring a photo identification and the proof of concession if you apply for a reduced fee.' },
    { speaker: 'coordinator', text: 'Now for where and when each group meets.' },
    { speaker: 'coordinator', text: 'The courses are held in the central building, near the library and the community hall.' },
    { speaker: 'coordinator', text: 'The pottery class is held on Tuesday evenings, while writing meets on Thursdays.' },
    { speaker: 'coordinator', text: 'Basic computing runs on Mondays, and spoken English moves between Wednesday and Friday groups.' },
    { speaker: 'coordinator', text: 'Each course has twelve sessions over the term, and a missed class can be made up online.' },
    { speaker: 'coordinator', text: 'The fee covers course materials and refreshments, but you buy your own pottery clay if needed.' },
    { speaker: 'coordinator', text: 'A few weekend workshops run separately, and their fees appear on the booking page.' },
    { speaker: 'coordinator', text: 'If a class does not reach its minimum enrolment, it may be moved to a later term.' },
    { speaker: 'coordinator', text: 'The tutor will send a short welcome email once your place is confirmed.' },
    { speaker: 'coordinator', text: 'The email lists the room number, the first session date and any items to bring.' },
    { speaker: 'coordinator', text: 'A missed class can also be followed through the centre’s recorded notes.' },
    { speaker: 'coordinator', text: 'The centre keeps a waiting list for popular groups when all places are taken.' },
    { speaker: 'coordinator', text: 'Waiting list places are offered in the order applications were received.' },
    { speaker: 'coordinator', text: 'The tutors hold a drop in hour each week for course related questions.' },
    { speaker: 'coordinator', text: 'Room changes are posted on the notice board by the main entrance.' },
    { speaker: 'coordinator', text: 'Parking behind the hall is limited, so the bus is often the quickest option.' },
    { speaker: 'coordinator', text: 'The community library holds extra practice books for the English group.' },
    { speaker: 'coordinator', text: 'Course outlines are printed at the front desk and posted on the website.' },
    { speaker: 'coordinator', text: 'If you have accessibility needs, tell the office before the first session.' },
    { speaker: 'coordinator', text: 'The centre can arrange a quieter room for students who request one.' },
    { speaker: 'coordinator', text: 'Please do not bring food into the pottery studio, except bottled water.' },
    { speaker: 'coordinator', text: 'The kitchen area by the main hall is open before each evening class.' },
    { speaker: 'coordinator', text: 'Feel free to call the office if the timetable does not match your work commitments.' },
    { speaker: 'coordinator', text: 'The centre publishes a short update each term, posted beside the front desk.' },
    { speaker: 'coordinator', text: 'Course fees remain unchanged from the previous term.' },
    { speaker: 'coordinator', text: 'Most tutors welcome questions by email before the first session.' },
  ],
  vocabulary: [
    {
      term: 'brochure', phonetic: '/ˈbrəʊʃə/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '宣传小册子，课程简章', en: 'a printed leaflet listing the courses and details' },
      usage: { zh: '可数名词；the course brochure、pick up a brochure。', en: 'Countable: the course brochure, pick up a brochure.' },
      collocations: ['the course brochure', 'pick up a brochure', 'the brochure lists'],
      example: { en: 'The brochure lists four main course groups.', zh: '简章列出四个主要课程组。' },
      listening: { zh: '两个音节，重音在第一音节，开头 /br/。', en: 'Two syllables with stress on the first, opening /br/.' },
    },
    {
      term: 'concession', phonetic: '/kənˈseʃn/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '优惠票价，减免名额', en: 'a reduced fee for students, seniors or other eligible residents' },
      usage: { zh: '可数名词；concession place、concession rate。英式也指让步。', en: 'Countable: a concession place, a concession rate; elsewhere it means a compromise.' },
      collocations: ['a concession place', 'half price concession', 'proof of concession'],
      example: { en: 'Concession places are half price with proof of status.', zh: '凭身份凭证可享半价优惠名额。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈseʃ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'certificate', phonetic: '/səˈtɪfɪkət/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '结业证书', en: 'an official document recording completion of a course' },
      usage: { zh: '可数名词；award a certificate、hold a certificate。', en: 'Countable: award a certificate, hold a certificate.' },
      collocations: ['a course certificate', 'a council certificate', 'issue a certificate'],
      example: { en: 'The writing course leads to a council certificate.', zh: '写作班可取得市议会证书。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'enrolment', phonetic: '/ɪnˈrəʊlmənt/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '报名，注册', en: 'the act of signing up for a course' },
      usage: { zh: '不可数；enrolment opens、late enrolment。动词 enrol。', en: 'Uncountable: enrolment opens, late enrolment; the verb is enrol.' },
      collocations: ['course enrolment', 'late enrolment', 'the enrolment date'],
      example: { en: 'Enrolment closes on the twentieth of September.', zh: '报名于九月二十日截止。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈrəʊl/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'sessions', phonetic: '/ˈseʃnz/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '课程场次，每次上课', en: 'the individual class meetings that make up a course' },
      usage: { zh: '可数复数；twelve sessions、a missed session。', en: 'Countable plural: twelve sessions, a missed session.' },
      collocations: ['twelve sessions', 'the first session', 'a missed session'],
      example: { en: 'Each course has twelve sessions over the term.', zh: '每门课一学期十二次。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈse/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'kiln', phonetic: '/kɪln/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '陶窑，烧炉', en: 'the heated oven used to fire pottery' },
      usage: { zh: '可数名词；kiln time、load the kiln。', en: 'Countable: kiln time, load the kiln.' },
      collocations: ['kiln time', 'the pottery kiln', 'load the kiln'],
      example: { en: 'Kiln time is arranged through the tutor.', zh: '烧窑时间由导师安排。' },
      listening: { zh: '单音节，元音 /ɪ/，与 kill 近音。', en: 'One syllable with /ɪ/, close to kill.' },
    },
    {
      term: 'accessibility', phonetic: '/əkˌsesəˈbɪləti/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '无障碍便利，可及性', en: 'arrangements for students with physical or sensory needs' },
      usage: { zh: '不可数；accessibility needs、accessibility arrangements。', en: 'Uncountable: accessibility needs, accessibility arrangements.' },
      collocations: ['accessibility needs', 'accessibility arrangements', 'an accessibility request'],
      example: { en: 'Tell the office about any accessibility needs early.', zh: '有便利需求请提前告知办公室。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈbɪl/。', en: 'Five syllables with stress on the fourth.' },
    },
  ],
  expressions: [
    {
      phrase: 'focuses on', sentenceIndex: 6,
      meaning: { zh: '侧重，以…为重点', en: 'to give most attention to a stated skill' },
      usage: { zh: '及物短语；focus on conversation、focus on writing。', en: 'Transitive: focus on conversation, focus on writing.' },
      example: { en: 'Spoken English focuses on conversation.', zh: '口语课侧重对话练习。' },
    },
    {
      phrase: 'leads to', sentenceIndex: 11,
      meaning: { zh: '取得（资格/证书）', en: 'to result in a stated qualification after the course' },
      usage: { zh: '及物；lead to a certificate、lead to a diploma。', en: 'Transitive: lead to a certificate, lead to a diploma.' },
      example: { en: 'The writing course leads to a council certificate.', zh: '写作班可取得市议会证书。' },
    },
    {
      phrase: 'made up online', sentenceIndex: 21,
      meaning: { zh: '线上补回（缺课）', en: 'to catch up a missed class through online material' },
      usage: { zh: '被动搭配；a missed class can be made up online。', en: 'Passive: a missed class can be made up online.' },
      example: { en: 'A missed class can be made up online.', zh: '缺课可通过线上材料补上。' },
    },
    {
      phrase: 'drop in hour', sentenceIndex: 30,
      meaning: { zh: '现场答疑时段', en: 'an open hour when tutors answer questions without an appointment' },
      usage: { zh: '可数；hold a drop in hour、the weekly drop in hour。', en: 'Countable: hold a drop in hour, the weekly drop in hour.' },
      example: { en: 'Tutors hold a drop in hour each week.', zh: '导师每周设一个现场答疑时段。' },
    },
    {
      phrase: 'waiting list', sentenceIndex: 28,
      meaning: { zh: '候补名单', en: 'the list of applicants offered places once others cancel' },
      usage: { zh: '可数；keep a waiting list、join the waiting list。', en: 'Countable: keep a waiting list, join the waiting list.' },
      example: { en: 'The centre keeps a waiting list for popular groups.', zh: '热门课程设有候补名单。' },
    },
  ],
  tips: [
    {
      title: { zh: '先抓课程门类，再听细节', en: 'Note the groups before the details' },
      body: {
        zh: '开场先报四个课程组，先在卷旁标出 computing、writing、pottery、English，后面题目问常年开设、上课日、证书归属时，把细节归到对应组，避免张冠李戴。',
        en: 'The opening names four groups; note computing, writing, pottery and English first. When questions ask about year-round running, meeting day or certificate, attach each detail to its group to avoid swapping them.',
      },
    },
    {
      title: { zh: '区分标准价、优惠价与另购项', en: 'Separate standard, concession and extra costs' },
      body: {
        zh: 'sixty dollars 是标准学费，半价只给学生与长者且需凭证，陶土与材料中的陶土另购。听费用题先判断是哪一档，选项常把优惠价或另购材料放进标准费里。',
        en: 'Sixty dollars is the standard fee; half price is for students and seniors on proof, and clay is extra. Identify which bracket the question asks; options often put a concession price or an extra purchase inside the standard fee.',
      },
    },
    {
      title: { zh: '日期与时间点成对记', en: 'Pair dates and deadlines' },
      body: {
        zh: '九月初开放报名、二十日截止、之后晚报名需导师批准；听到日期立刻写下开闭与条件，别把截止日和晚报名审批混为一谈。',
        en: 'Enrolment opens in early September, closes on the twentieth, and late enrolment after that needs tutor approval. Write down the opening, closing and condition together; do not confuse the deadline with the late approval rule.',
      },
    },
  ],
};
