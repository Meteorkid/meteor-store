import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 22 · Part 3 — 三人讨论医院实习安排（学术讨论）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：分工配对（记录、排班确认、复盘阅读、督导会议）→ 轮转顺序（单选）→
 * 督导周要求（单选）→ 感染防控规则（单选）→ 商定三项安排（多选）→ 下次会前分工。
 * 配对块在前，单选块居中，多选块在后，题块顺序与录音顺序一致。
 */
export const test22Part3: ListeningLesson = {
  slug: 'test-22-part-3',
  part: 3,
  status: 'published',
  title: { zh: '医院实习安排讨论', en: 'Planning a hospital placement' },
  summary: {
    zh: '导师与两名学生规划医院实习：先明确记录维护、轮转确认、周复盘阅读和督导会议的分工，再确定轮转科室顺序、导师每周要求的书面复盘、感染防控洗手规则，最后商定排班提前确认、纸质实习日记和首日跟随资深护士三项安排。',
    en: 'A tutor and two students plan a hospital placement: they split the record keeping, rotation confirmation, weekly reflection review and supervision meeting, then settle the rotation order, the weekly written reflection the supervisor requires, the hand-washing rule for infection control, and finally agree on confirming the rota early, keeping a paper diary and shadowing a senior nurse on day one.',
  },
  accent: { zh: '导师为英式口音，Neerja 为印度口音，Aria 为美式口音。', en: 'The tutor has a British accent, Neerja an Indian accent, and Aria an American accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'tutor', label: 'TUTOR', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which responsibility belongs to each person? Choose the correct letter, A–G.',
      options: [
        { key: 'A', text: 'keeps the placement record up to date' },
        { key: 'B', text: 'confirms the rotation schedule with the ward' },
        { key: 'C', text: 'checks infection-control procedures before each shift' },
        { key: 'D', text: 'arranges the weekly supervision meeting' },
        { key: 'E', text: 'reviews the student’s written reflections' },
        { key: 'F', text: 'signs off the attendance register' },
        { key: 'G', text: 'coordinates handover between two wards' },
      ],
      items: [
        { number: 21, text: 'Neerja' },
        { number: 22, text: 'the tutor' },
        { number: 23, text: 'Aria' },
        { number: 24, text: 'Neerja' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Which rotation comes first?',
          options: [
            { key: 'A', text: 'emergency department' },
            { key: 'B', text: 'general medical wards' },
            { key: 'C', text: 'outpatient clinic' },
          ],
        },
        {
          number: 26,
          stem: 'What does the supervisor require each week?',
          options: [
            { key: 'A', text: 'a daily talk with the ward nurse' },
            { key: 'B', text: 'a written reflection on a case or procedure' },
            { key: 'C', text: 'a signed attendance register' },
          ],
        },
        {
          number: 27,
          stem: 'What infection-control rule applies to every student?',
          options: [
            { key: 'A', text: 'Gloves are worn instead of hand washing.' },
            { key: 'B', text: 'Hands are washed before and after patient contact.' },
            { key: 'C', text: 'Procedures are reviewed before each shift.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE arrangements do they agree on for the placement? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE arrangements do they agree on for the placement?',
      options: [
        { key: 'A', text: 'confirm the rota two weeks ahead' },
        { key: 'B', text: 'keep a paper placement diary' },
        { key: 'C', text: 'ask ward staff before using equipment' },
        { key: 'D', text: 'invite a guest speaker from the infection team' },
        { key: 'E', text: 'extend the placement by one month' },
        { key: 'F', text: 'shadow a senior nurse on the first day' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 5,
      explanation: {
        zh: '定位句 5：I keep the placement record up to date, logging each ward and the tasks completed。Neerja 负责维护实习记录，对应 A。',
        en: 'Sentence 5: "I keep the placement record up to date, logging each ward and the tasks completed". Neerja maintains the placement record, matching A.',
      },
    },
    {
      number: 22, accepted: ['D'], evidence: 11,
      explanation: {
        zh: '定位句 11：I arrange the weekly supervision meeting, book the room and send the agenda the evening before。导师负责安排每周督导会议，对应 D。',
        en: 'Sentence 11: "I arrange the weekly supervision meeting, book the room and send the agenda the evening before". The tutor arranges the supervision meeting, matching D.',
      },
    },
    {
      number: 23, accepted: ['E'], evidence: 9,
      explanation: {
        zh: '定位句 9：I review the student’s written reflections each week, checking they match the ward notes。Aria 负责阅读每周书面复盘，对应 E。',
        en: 'Sentence 9: "I review the student’s written reflections each week, checking they match the ward notes". Aria reviews the written reflections, matching E.',
      },
    },
    {
      number: 24, accepted: ['B'], evidence: 7,
      explanation: {
        zh: '定位句 7：I confirm the rotation schedule with the ward before each block。Neerja 第二次发言负责与病区确认轮转安排，对应 B。',
        en: 'Sentence 7: "I confirm the rotation schedule with the ward before each block". Neerja’s second role is confirming the rotation schedule, matching B.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：first block emergency department, then general wards, then outpatient clinic。第一个轮转科室是急诊，对应 A。B 是第二段，C 是第三段。',
        en: 'Sentence 18: "first block emergency department, then general wards, then outpatient clinic". The first rotation is the emergency department, matching A. B is the second block and C the third.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：daily talk with ward nurse yes, but supervisor requirement each week is a written reflection。导师每周要求的是书面复盘，对应 B。A 的每日交谈是日常安排，不是导师周要求；C 的签到表由病区护士负责。',
        en: 'Sentence 25: "daily talk with ward nurse yes, but supervisor requirement each week is a written reflection". The supervisor’s weekly requirement is a written reflection, matching B. The daily talk is routine, not the weekly requirement, and the register is signed by ward nurses.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 32,
      explanation: {
        zh: '定位句 32：hands washed before and after patient contact, every single time。每条学生都必须接触患者前后洗手，对应 B。A 与句 34 手套不能替代洗手相反，C 是班前检查流程，不是学生规则。',
        en: 'Sentence 32: "hands washed before and after patient contact, every single time". The universal rule is hand washing before and after contact, matching B. A contradicts gloves as a replacement in sentence 34, and C is a pre-shift procedure, not the student rule.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 39,
      explanation: {
        zh: '定位句 39：confirm the rota two weeks ahead, so the ward can plan cover。排班提前两周确认是商定安排之一，对应 A。',
        en: 'Sentence 39: "confirm the rota two weeks ahead, so the ward can plan cover". Confirming the rota early is one agreed arrangement, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 42,
      explanation: {
        zh: '定位句 42：agreed arrangement is a paper placement diary, kept in the uniform pocket。商定使用纸质实习日记，对应 B。句 41 的手机笔记被导师否决。',
        en: 'Sentence 42: "agreed arrangement is a paper placement diary, kept in the uniform pocket". The group agrees on a paper diary, matching B. The phone notes in sentence 41 are ruled out.',
      },
    },
    {
      number: 30, accepted: ['F'], evidence: 46,
      explanation: {
        zh: '定位句 46：shadow a senior nurse on the first day, follow their tasks rather than starting alone。首日跟随资深护士是第三项商定安排，对应 F。',
        en: 'Sentence 46: "shadow a senior nurse on the first day, follow their tasks rather than starting alone". Shadowing a senior nurse on day one is the third agreed arrangement, matching F.',
      },
    },
  ],
  transcript: [
    { speaker: 'tutor', text: 'Right, thanks for coming in. We are here to settle the details of this hospital placement.' },
    { speaker: 'neerja', text: 'I have the placement outline open in front of me, so I am ready.' },
    { speaker: 'aria', text: 'I brought my notebook, and I will jot down anything we agree on.' },
    { speaker: 'tutor', text: 'The agenda covers the rotations, supervision, the record, infection control and the rota.' },
    { speaker: 'tutor', text: 'First, who does what around the record and the schedule. Neerja, your first task.' },
    { speaker: 'neerja', text: 'I keep the placement record up to date, logging each ward and the tasks completed each day.' },
    { speaker: 'tutor', text: 'And who confirms the rotation schedule with the wards?' },
    { speaker: 'neerja', text: 'I confirm the rotation schedule with the ward before each block, so there are no last minute changes.' },
    { speaker: 'tutor', text: 'Good. Aria, your part in this paperwork.' },
    { speaker: 'aria', text: 'I review the student’s written reflections each week, checking they match the ward notes.' },
    { speaker: 'tutor', text: 'Now my own responsibility, to keep the supervision side running.' },
    { speaker: 'tutor', text: 'I arrange the weekly supervision meeting, book the room and send the agenda the evening before.' },
    { speaker: 'neerja', text: 'One thing I wondered about. Who signs the attendance register each day?' },
    { speaker: 'tutor', text: 'The ward nurse signs off the attendance register on the register before you leave the floor.' },
    { speaker: 'aria', text: 'What about the move between one ward and the next?' },
    { speaker: 'tutor', text: 'The student coordinates handover between two wards, walking through the ongoing cases before the handover ends.' },
    { speaker: 'tutor', text: 'Now the rotations themselves. Neerja, what order do the blocks run in?' },
    { speaker: 'neerja', text: 'I had assumed general wards came first, but I may have that wrong.' },
    { speaker: 'tutor', text: 'General wards come second. First block emergency department, then general wards, then outpatient clinic.' },
    { speaker: 'aria', text: 'Emergency first, that makes sense for someone still learning triage.' },
    { speaker: 'tutor', text: 'Why start there? In the department you see a wide range of cases fast, before routine cases set in.' },
    { speaker: 'neerja', text: 'How long does each block last?' },
    { speaker: 'tutor', text: 'Three weeks each, with a two day handover between blocks to smooth the move.' },
    { speaker: 'tutor', text: 'Supervision next. What does the supervisor require from you each week?' },
    { speaker: 'aria', text: 'I thought daily check-ins with the ward nurse were required.' },
    { speaker: 'tutor', text: 'A daily talk with the ward nurse yes, but the supervisor requirement each week is a written reflection.' },
    { speaker: 'neerja', text: 'One reflection per week, and how long should it run?' },
    { speaker: 'tutor', text: 'Two hundred words or so, on one case or one procedure that stuck with you.' },
    { speaker: 'aria', text: 'Does the supervisor read them before the meeting takes place?' },
    { speaker: 'tutor', text: 'Yes, and the meeting focuses on the questions the reflections raise rather than a fixed checklist.' },
    { speaker: 'tutor', text: 'Infection control now, the strictest part of the placement.' },
    { speaker: 'neerja', text: 'What is the basic rule every student has to follow on the floor?' },
    { speaker: 'tutor', text: 'Hands washed before and after patient contact, every single time, between two patients as well.' },
    { speaker: 'aria', text: 'So gloves come first in situations like wound care?' },
    { speaker: 'tutor', text: 'Gloves cover contact with blood or wounds, but they are not a replacement for hand washing.' },
    { speaker: 'neerja', text: 'Is there a record we keep for infection control as well?' },
    { speaker: 'tutor', text: 'Check infection-control procedures before each shift, and report any breach to the nurse in charge.' },
    { speaker: 'tutor', text: 'Rota and availability, then. Aria, when must we confirm the schedule?' },
    { speaker: 'aria', text: 'I had wondered whether the week before was enough notice.' },
    { speaker: 'tutor', text: 'Confirm the rota two weeks ahead, so the ward can plan cover around your placement.' },
    { speaker: 'neerja', text: 'And how should we keep our own notes during the blocks?' },
    { speaker: 'aria', text: 'I usually keep everything in the notes app on my phone.' },
    { speaker: 'tutor', text: 'The agreed arrangement is a paper placement diary, kept in the uniform pocket for notes between tasks.' },
    { speaker: 'neerja', text: 'What about equipment on the ward, if something looks useful?' },
    { speaker: 'tutor', text: 'Ask ward staff before using any equipment, rather than testing it yourself between cases.' },
    { speaker: 'aria', text: 'What guidance do we get on the very first day?' },
    { speaker: 'tutor', text: 'Shadow a senior nurse on the first day, follow their tasks rather than starting a procedure alone.' },
    { speaker: 'tutor', text: 'Any other proposals the group should consider for this placement?' },
    { speaker: 'neerja', text: 'Could we invite a guest speaker from the hospital infection team?' },
    { speaker: 'tutor', text: 'Interesting, but not this placement. Keep that idea for the next cohort, when the timetable allows.' },
    { speaker: 'aria', text: 'Can we extend the placement by one month to cover more wards?' },
    { speaker: 'tutor', text: 'The course fixes four blocks, so an extension is not on offer this year.' },
    { speaker: 'tutor', text: 'Let me recap the three arrangements we have agreed on today.' },
    { speaker: 'tutor', text: 'Rota two weeks ahead, a paper diary, and shadowing a senior nurse on day one.' },
    { speaker: 'neerja', text: 'And the record stays up to date through every block.' },
    { speaker: 'aria', text: 'The reflections are reviewed weekly before supervision.' },
    { speaker: 'tutor', text: 'Yes. Any questions before we split into the ward groups?' },
    { speaker: 'neerja', text: 'How do we log a case that worries us during the block?' },
    { speaker: 'tutor', text: 'Write it in the diary, and raise it at the next supervision meeting.' },
    { speaker: 'aria', text: 'What if a ward is running short of staff while we are there?' },
    { speaker: 'tutor', text: 'Tell the nurse in charge, and do not take on a procedure beyond your level of training.' },
    { speaker: 'neerja', text: 'Understood, that seems clear.' },
    { speaker: 'tutor', text: 'Good. Next week you meet the ward nurses, and bring the diary with you.' },
    { speaker: 'aria', text: 'I will send the supervision agenda to each student tonight, once the room is booked.' },
    { speaker: 'neerja', text: 'I will confirm the rotation dates with each ward by Friday, as we agreed.' },
    { speaker: 'tutor', text: 'Thank you both. That covers the placement plan for this term.' },
  ],
  vocabulary: [
    {
      term: 'placement', phonetic: '/ˈpleɪsmənt/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '（实习）岗位，实习安排', en: 'a period of supervised work in a hospital as part of a course' },
      usage: { zh: '可数名词；hospital placement、on placement、placement plan。', en: 'Countable: hospital placement, on placement, placement plan.' },
      collocations: ['the hospital placement', 'on placement', 'the placement plan'],
      example: { en: 'We are here to settle the details of this hospital placement.', zh: '我们来敲定这次医院实习的细节。' },
      listening: { zh: '两个音节，重音在第一个；复合 place 加 ment。', en: 'Two syllables with first-syllable stress; compound place plus ment.' },
    },
    {
      term: 'rotation', phonetic: '/rəʊˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '轮转，科室轮班', en: 'a scheduled block of work in one ward or department' },
      usage: { zh: '可数名词；rotation schedule、on rotation。动词 rotate。', en: 'Countable: rotation schedule, on rotation. The verb is rotate.' },
      collocations: ['the rotation schedule', 'each rotation', 'a rotation block'],
      example: { en: 'I confirm the rotation schedule with the ward before each block.', zh: '每个段开始前我与病区确认轮转安排。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈteɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'reflection', phonetic: '/rɪˈflekʃn/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '复盘，反思记录', en: 'a written account of what a student learned from a case' },
      usage: { zh: '可数名词；written reflection、weekly reflection。动词 reflect。', en: 'Countable: written reflection, weekly reflection. The verb is reflect.' },
      collocations: ['a written reflection', 'the weekly reflection', 'submit a reflection'],
      example: { en: 'The supervisor requirement each week is a written reflection.', zh: '导师每周要求一份书面复盘。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈflek/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'supervisor', phonetic: '/ˈsuːpəvaɪzə/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '督导，指导教师', en: 'the member of staff who oversees the student’s progress' },
      usage: { zh: '可数名词；the supervisor、meet the supervisor。动词 supervise。', en: 'Countable: the supervisor, meet the supervisor. The verb is supervise.' },
      collocations: ['the supervisor', 'the supervisor requirement', 'supervisor meeting'],
      example: { en: 'The supervisor reads the reflection before the meeting.', zh: '督导会前先阅读复盘记录。' },
      listening: { zh: '四个音节，重音在第一个；/vaɪz/ 读清楚。', en: 'Four syllables with first-syllable stress; listen for /vaɪz/.' },
    },
    {
      term: 'infection', phonetic: '/ɪnˈfekʃn/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '感染', en: 'the spread of germs between patients and staff' },
      usage: { zh: '不可数；infection control、prevent infection。形容词 infectious。', en: 'Uncountable: infection control, prevent infection. The adjective is infectious.' },
      collocations: ['infection control', 'prevent infection', 'the infection team'],
      example: { en: 'Infection control is the strictest part of the placement.', zh: '感染防控是实习中最严格的部分。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈfek/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'rota', phonetic: '/ˈrəʊtə/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '排班表，值班轮次表', en: 'the list showing who works on which days and shifts' },
      usage: { zh: '英式常用词，美式多称 schedule；confirm the rota、on the rota。', en: 'British for schedule: confirm the rota, on the rota.' },
      collocations: ['confirm the rota', 'the weekly rota', 'the rota two weeks ahead'],
      example: { en: 'Confirm the rota two weeks ahead so the ward can plan cover.', zh: '排班提前两周确认，方便病区安排人手。' },
      listening: { zh: '两个音节，重音在第一个；与 rotor 读音区分。', en: 'Two syllables with first-syllable stress; do not confuse it with rotor.' },
    },
    {
      term: 'diary', phonetic: '/ˈdaɪəri/', partOfSpeech: 'n.', sentenceIndex: 42,
      meaning: { zh: '实习日记，记录本', en: 'a small paper book for daily notes during the placement' },
      usage: { zh: '可数名词；paper diary、placement diary、keep a diary。', en: 'Countable: paper diary, placement diary, keep a diary.' },
      collocations: ['a paper diary', 'the placement diary', 'keep a diary'],
      example: { en: 'The agreed arrangement is a paper placement diary.', zh: '商定的安排是使用纸质实习日记。' },
      listening: { zh: '三个音节，重音在第一个；/daɪ/ 是双元音。', en: 'Three syllables with first-syllable stress; /daɪ/ is a diphthong.' },
    },
    {
      term: 'cohort', phonetic: '/ˈkəʊhɔːt/', partOfSpeech: 'n.', sentenceIndex: 49,
      meaning: { zh: '同期学生，一届学员', en: 'the group of students who follow the course in the same year' },
      usage: { zh: '可数名词；the next cohort、this cohort。', en: 'Countable: the next cohort, this cohort.' },
      collocations: ['the next cohort', 'this cohort', 'the student cohort'],
      example: { en: 'Keep the speaker idea for the next cohort.', zh: '把请嘉宾的想法留给下一届学生。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /ɔːt/。', en: 'Two syllables with first-syllable stress; the ending /ɔːt/.' },
    },
  ],
  expressions: [
    {
      phrase: 'up to date', sentenceIndex: 5,
      meaning: { zh: '保持最新，及时更新', en: 'kept current as tasks and records change' },
      usage: { zh: '表示保持最新；keep something up to date，如 record up to date、notes up to date。', en: 'Keep something up to date; record up to date, notes up to date.' },
      example: { en: 'I keep the placement record up to date each day.', zh: '我每天把实习记录更新到最新。' },
    },
    {
      phrase: 'handover between', sentenceIndex: 15,
      meaning: { zh: '（科室间）交接', en: 'the passing of ongoing cases from one team to the next' },
      usage: { zh: 'handover between two wards、during handover；动词 hand over。', en: 'Handover between two wards, during handover. The verb is hand over.' },
      example: { en: 'The student coordinates handover between two wards.', zh: '学生负责两个病区之间的交接。' },
    },
    {
      phrase: 'set in', sentenceIndex: 20,
      meaning: { zh: '形成，成为常态', en: 'to become established as the usual pattern' },
      usage: { zh: 'set in 的过去式；routine cases set in、winter set in。', en: 'Past of set in: routine cases set in, winter set in.' },
      example: { en: 'Students see many cases before routine cases set in.', zh: '在常规病例成为常态前，学生能见到多种病例。' },
    },
    {
      phrase: 'report any breach', sentenceIndex: 36,
      meaning: { zh: '上报任何违规操作', en: 'to tell the senior staff about a rule broken' },
      usage: { zh: 'report a breach to somebody；breach 此处指违反流程。', en: 'Report a breach to somebody; here breach means a rule violation.' },
      example: { en: 'Report any breach to the nurse in charge.', zh: '任何违规操作都要上报给负责护士。' },
    },
    {
      phrase: 'on offer', sentenceIndex: 51,
      meaning: { zh: '本年度提供的，可行的', en: 'available or allowed under the current rules' },
      usage: { zh: '课程与政策语境；extension is not on offer、the course on offer。', en: 'Courses and policy: extension is not on offer, the course on offer.' },
      example: { en: 'An extension is not on offer this year.', zh: '本年度不提供延期安排。' },
    },
    {
      phrase: 'take on a procedure', sentenceIndex: 60,
      meaning: { zh: '独立承担一项操作', en: 'to carry out a clinical task on your own' },
      usage: { zh: 'take on 后接工作或任务；take on a procedure、take on extra work。', en: 'Take on a task: take on a procedure, take on extra work.' },
      example: { en: 'Do not take on a procedure beyond your level of training.', zh: '不要承担超出训练水平的操作。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对先写说话人再写职责', en: 'Match the voice before the duty' },
      body: {
        zh: '第 21–24 题问分工归属。开场把导师、Neerja、Aria 的声音和名字对上；每条职责先记说话人，再记内容。Neerja 出现两次，分别对应记录维护与排班确认，别把两条职责混到一人身上。',
        en: 'Items 21 to 24 ask who owns each duty. Match voices to names early, then record the duty. Neerja appears twice, for record keeping and schedule confirmation; do not merge the two roles onto one person.',
      },
    },
    {
      title: { zh: '区分每日安排与每周要求', en: 'Separate daily routine from weekly requirement' },
      body: {
        zh: '第 26 题考每周督导要求，句 25 先提每日与病区护士交谈，句 28 用 but 转折给出真正的周要求 written reflection。听到 daily、each day 先记为日常安排，but 之后才是题目答案。',
        en: 'Item 26 asks the weekly supervisor requirement. Sentence 25 mentions the daily talk with the ward nurse first, and sentence 28 turns with but to the written reflection. Note daily items as routine; the answer follows but.',
      },
    },
    {
      title: { zh: '多选区分商定项与被推迟项', en: 'Agreed items versus deferred ideas' },
      body: {
        zh: '多选题三项商定：提前两周排班、纸质日记、首日跟随资深护士。句 52 的嘉宾演讲与句 54 的延期被明确推迟或排除；句 47 的先问护士只是设备规则，不是本次商定安排。落笔前在选项旁标出强弱与去留。',
        en: 'The three agreed items are the early rota, the paper diary and the first-day shadowing. The guest speaker in sentence 52 and the extension in sentence 54 are deferred or excluded; asking staff before equipment in sentence 47 is a rule, not an agreed arrangement. Mark strength and status beside each option first.',
      },
    },
  ],
};
