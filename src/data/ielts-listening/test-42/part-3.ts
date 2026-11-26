import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 42 · Part 3 — 三人规划朋辈辅导计划。原创仿真材料，非官方真题。
 *
 * 讨论顺序：招募来源与课程年级覆盖（配对）→ 培训内容与边界 → 配对规则 → 评估指标（配对）
 * → 复述计划目标、配对规则解决的问题、评估尚存漏洞（单选）→ 三项保障措施（多选）→ 会后分工。
 * 配对块在前，单选居中，多选在后，题块顺序与录音顺序一致。
 */
export const test42Part3: ListeningLesson = {
  slug: 'test-42-part-3',
  part: 3,
  status: 'published',
  title: { zh: '规划朋辈辅导计划', en: 'Planning a peer tutoring scheme' },
  summary: {
    zh: '导师与两名研究生规划朋辈辅导计划：分别提出招募应覆盖不同课程与年级、培训包含课时规划与边界规则、配对按学科需求、评估跟踪出勤与目标进度；随后复述计划目标、学科配对解决的问题与评估尚未衡量信心收获的漏洞，最后商定协调员每周跟进、会后书面记录、按学科需求配对三项保障及会后分工。',
    en: 'A tutor and two postgraduates plan a peer tutoring scheme: recruiting across courses and year groups, training in planning and boundaries, matching by subject need, and tracking attendance and goals; they restate the aim, the problem matching solves, and the unmeasured confidence gap, then agree on weekly check-ins, written records and need-based matching, and split follow-up tasks.',
  },
  accent: { zh: 'Neerja 为印度口音，Ryan 为英式口音，Aria 为美式口音。', en: 'Neerja has an Indian accent, Ryan a British accent, and Aria an American accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'ryan', label: 'RYAN', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which point about the scheme does each person make? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'Recruitment should draw students from different courses and year groups.' },
        { key: 'B', text: 'Tutor training covers session planning and boundary rules.' },
        { key: 'C', text: 'A shared matching rule pairs tutors and tutees by subject need.' },
        { key: 'D', text: 'Evaluation tracks attendance and progress against agreed goals.' },
        { key: 'E', text: 'Supervision catches mismatches before they harm the scheme.' },
      ],
      items: [
        { number: 21, text: 'Neerja' },
        { number: 22, text: 'Ryan' },
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
          stem: 'What is the scheme’s main aim?',
          options: [
            { key: 'A', text: 'To give struggling students structured academic support.' },
            { key: 'B', text: 'To replace regular lectures with peer-led teaching.' },
            { key: 'C', text: 'To mark exams for students who miss the sitting.' },
          ],
        },
        {
          number: 26,
          stem: 'What problem does the subject matching rule solve?',
          options: [
            { key: 'A', text: 'It prevents a tutor being out of their depth on the request.' },
            { key: 'B', text: 'It ensures every tutor attends weekly training.' },
            { key: 'C', text: 'It balances the courses recruited into the pool.' },
          ],
        },
        {
          number: 27,
          stem: 'What gap remains in the evaluation plan?',
          options: [
            { key: 'A', text: 'It has no record of session attendance.' },
            { key: 'B', text: 'It has not weighed how to measure confidence gains.' },
            { key: 'C', text: 'It fails to collect monthly feedback from both sides.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE safeguards do they agree on? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE safeguards do they agree on?',
      options: [
        { key: 'A', text: 'weekly tutor check-ins with a coordinator' },
        { key: 'B', text: 'a written session record after each meeting' },
        { key: 'C', text: 'matching by a shared subject need' },
        { key: 'D', text: 'paid advertising around campus' },
        { key: 'E', text: 'open access to all student timetables' },
        { key: 'F', text: 'automatic promotion to senior tutor' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：If all tutors come from one course, tutees outside it will be left out。Neerja 指出招募要覆盖不同课程与年级，避免单一课程的池子漏掉其他学生，对应 A。',
        en: 'Sentence 4: "If all tutors come from one course, tutees outside it will be left out". Neerja argues recruitment must cover different courses and year groups, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 8,
      explanation: {
        zh: '定位句 8：The training covers session planning, how to set small targets, and boundary rules。Ryan 说明培训包含课时规划与边界规则，对应 B。',
        en: 'Sentence 8: "The training covers session planning, how to set small targets, and boundary rules". Ryan describes training in session planning and boundaries, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 12,
      explanation: {
        zh: '定位句 12：The shared matching rule pairs people by the subject need behind the request。Aria 讲配对规则按请求背后的学科需求匹配双方，对应 C。',
        en: 'Sentence 12: "The shared matching rule pairs people by the subject need behind the request". Aria explains the matching rule pairs by subject need, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 16,
      explanation: {
        zh: '定位句 16：Evaluation tracks attendance at each session and progress against agreed goals。Neerja 第二次发言说明评估跟踪出勤与约定目标的进展，对应 D。',
        en: 'Sentence 16: "Evaluation tracks attendance at each session and progress against agreed goals". Neerja’s second point is that evaluation tracks attendance and goal progress, matching D.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：Its main aim is to give struggling students structured academic support。计划目标是给有困难的学生结构化学业支持，对应 A。B 的替代讲座与句 22 相反，C 的替考阅卷在录音中没有依据。',
        en: 'Sentence 21: "Its main aim is to give struggling students structured academic support", matching A. Replacing lectures contradicts sentence 22, and exam marking is not mentioned.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 24,
      explanation: {
        zh: '定位句 24：Subject matching solves the problem of a tutor being out of their depth。学科配对解决导师对请求内容力不从心的问题，对应 A。B 的每周培训与 C 的课程平衡分别属于培训和招募话题。',
        en: 'Sentence 24: "Subject matching solves the problem of a tutor being out of their depth", matching A. Weekly training and course balance belong to the training and recruitment topics.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：The plan has not weighed how to measure confidence and speaking comfort。评估漏洞是尚未衡量信心与表达舒适感这类收获，对应 B。A 的出勤记录与句 16 相反，C 的月度反馈在句 17 已有安排。',
        en: 'Sentence 27: "The plan has not weighed how to measure confidence and speaking comfort". The gap is unmeasured confidence gains, matching B. Attendance records exist per sentence 16, and monthly feedback is arranged in sentence 17.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：The first safeguard is weekly tutor check-ins with a coordinator。第一项保障是协调员每周与导师跟进，对应 A。',
        en: 'Sentence 30: "The first safeguard is weekly tutor check-ins with a coordinator". The first agreed safeguard is weekly coordinator check-ins, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：The second is a written session record after each meeting。第二项保障是每次会后填写书面记录，对应 B。',
        en: 'Sentence 31: "The second is a written session record after each meeting". The second agreed safeguard is the post-meeting written record, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 33,
      explanation: {
        zh: '定位句 33：Pairs are matched by a shared subject need rather than a friendship。第三项保障是按学科需求而非私交配对，对应 C。',
        en: 'Sentence 33: "Pairs are matched by a shared subject need rather than a friendship". The third agreed safeguard is need-based matching, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'neerja', text: 'Shall we start by reviewing how the peer tutoring scheme will recruit its tutors?' },
    { speaker: 'ryan', text: 'Yes, let us settle recruitment first, then move to training and matching.' },
    { speaker: 'aria', text: 'The scheme pairs senior students with peers who need extra subject help.' },
    { speaker: 'neerja', text: 'For recruitment, the tutor pool should cover different courses and year groups.' },
    { speaker: 'neerja', text: 'If all tutors come from one course, tutees outside it will be left out.' },
    { speaker: 'ryan', text: 'We also want tutors who can explain ideas slowly rather than repeat lectures.' },
    { speaker: 'aria', text: 'Applications include a short reference from a course tutor.' },
    { speaker: 'ryan', text: 'Next, the training each selected tutor completes before the first session.' },
    { speaker: 'ryan', text: 'The training covers session planning, how to set small targets, and boundary rules.' },
    { speaker: 'neerja', text: 'Boundaries matter so tutors do not drift into personal advice outside their role.' },
    { speaker: 'aria', text: 'There is also a practice session where two applicants take turns as tutor and tutee.' },
    { speaker: 'ryan', text: 'After training, the matching stage decides who works with whom.' },
    { speaker: 'aria', text: 'The shared matching rule pairs people by the subject need behind the request.' },
    { speaker: 'neerja', text: 'A tutor strong in maths should not be matched to a writing request.' },
    { speaker: 'aria', text: 'Timetable gaps are checked next, so the two can meet at a free slot.' },
    { speaker: 'ryan', text: 'Now the evaluation we will use to judge whether the scheme works.' },
    { speaker: 'neerja', text: 'Evaluation tracks attendance at each session and progress against agreed goals.' },
    { speaker: 'aria', text: 'We ask both sides to note whether the sessions feel useful each month.' },
    { speaker: 'ryan', text: 'The supervision side catches a poor match before it harms the scheme.' },
    { speaker: 'neerja', text: 'A coordinator reviews complaints and meets any mismatched pair early.' },
    { speaker: 'ryan', text: 'Good. Let us restate what the scheme is trying to do overall.' },
    { speaker: 'aria', text: 'Its main aim is to give struggling students structured academic support.' },
    { speaker: 'neerja', text: 'It is not a replacement for lectures, and it does not cover exam marking.' },
    { speaker: 'ryan', text: 'Why did we settle on matching by subject need?' },
    { speaker: 'ryan', text: 'Subject matching solves the problem of a tutor being out of their depth.' },
    { speaker: 'aria', text: 'Without it, pairs meet but cannot actually help with the requested work.' },
    { speaker: 'neerja', text: 'Which part of the evaluation plan still looks weak to you?' },
    { speaker: 'aria', text: 'The plan has not weighed how to measure confidence and speaking comfort.' },
    { speaker: 'neerja', text: 'Attendance and grades are recorded, but softer gains stay hard to score.' },
    { speaker: 'ryan', text: 'We should list the safeguards we agree to build into the scheme.' },
    { speaker: 'neerja', text: 'The first safeguard is weekly tutor check-ins with a coordinator.' },
    { speaker: 'aria', text: 'The second is a written session record after each meeting.' },
    { speaker: 'ryan', text: 'The third safeguard follows the matching rule we just discussed.' },
    { speaker: 'ryan', text: 'Pairs are matched by a shared subject need rather than a friendship.' },
    { speaker: 'neerja', text: 'What about the other ideas raised in the early notes?' },
    { speaker: 'aria', text: 'Paid advertising around campus would draw applicants, but it is outside our budget.' },
    { speaker: 'ryan', text: 'Open access to every timetable raises privacy concerns we cannot accept.' },
    { speaker: 'neerja', text: 'Automatic promotion to senior tutor rewards longevity, not session quality.' },
    { speaker: 'aria', text: 'So those three safeguards are the ones we will write into the plan.' },
    { speaker: 'ryan', text: 'Neerja, could you draft the recruitment wording for student applicants?' },
    { speaker: 'neerja', text: 'Sure, I will note the course and year group balance we want in the pool.' },
    { speaker: 'aria', text: 'I will prepare the training outline, including the practice session slot.' },
    { speaker: 'ryan', text: 'I will check the matching rules against the tutor application forms.' },
    { speaker: 'neerja', text: 'Does anyone want to add a note on the supervision meetings?' },
    { speaker: 'aria', text: 'I can add that, since I already read the coordinator handout last week.' },
    { speaker: 'ryan', text: 'Good, the split is fair and everyone knows what to check first.' },
    { speaker: 'neerja', text: 'One thing to confirm, do we charge tutees anything for the sessions?' },
    { speaker: 'ryan', text: 'No, the scheme is free for enrolled students within the faculty.' },
    { speaker: 'aria', text: 'Materials and room bookings are covered by the student support budget.' },
    { speaker: 'neerja', text: 'Should the sessions run through the whole term or only the first half?' },
    { speaker: 'ryan', text: 'They run the full term, with a review after the fourth weekly meeting.' },
    { speaker: 'aria', text: 'We can pause a pair if either side feels the fit is not working.' },
    { speaker: 'neerja', text: 'How many sessions do we expect each matched pair to hold per week?' },
    { speaker: 'ryan', text: 'One session a week is the standard, and longer meetings are decided by the pair.' },
    { speaker: 'aria', text: 'The matching form lists the main subjects students find hardest this year.' },
    { speaker: 'neerja', text: 'I will pull those subject lists and check the tutor pool against them.' },
    { speaker: 'ryan', text: 'I will trace the evaluation section and mark where the softer gains fit.' },
    { speaker: 'aria', text: 'I will summarise the three safeguards with their main responsibilities.' },
    { speaker: 'neerja', text: 'Is there a limit on how many tutees one tutor can take on?' },
    { speaker: 'ryan', text: 'Each tutor supports two tutees at most, to keep the sessions focused.' },
    { speaker: 'aria', text: 'That prevents a strong tutor from being spread too thin across requests.' },
    { speaker: 'neerja', text: 'Let us meet again next week before the plan goes to the student liaison team.' },
    { speaker: 'aria', text: 'I think that covers recruitment, training, matching, evaluation and supervision.' },
    { speaker: 'ryan', text: 'We should also note who to contact if a session has to be rescheduled.' },
    { speaker: 'neerja', text: 'The coordinator handles rescheduling, and tutors confirm the new slot by email.' },
    { speaker: 'aria', text: 'I will include that contact line in the session record template.' },
    { speaker: 'ryan', text: 'Then the draft is ready for our short review on Thursday.' },
  ],
  vocabulary: [
    {
      term: 'recruitment', phonetic: '/rɪˈkruːtmənt/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '招募，招收（导师候选人）', en: 'the process of signing up volunteer tutors' },
      usage: { zh: '不可数；tutor recruitment、the recruitment pool。动词是 recruit。', en: 'Uncountable: tutor recruitment, the recruitment pool. The verb is recruit.' },
      collocations: ['tutor recruitment', 'the recruitment pool', 'recruitment wording'],
      example: { en: 'Recruitment should cover students from different courses.', zh: '招募应覆盖不同课程的学生。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈkruː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'boundary', phonetic: '/ˈbaʊndri/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '边界，角色分寸（辅导与私人建议之间）', en: 'the line between tutoring support and personal advice' },
      usage: { zh: '可数名词；boundary rules、cross a boundary。', en: 'Countable: boundary rules, cross a boundary.' },
      collocations: ['boundary rules', 'role boundaries', 'clear boundaries'],
      example: { en: 'Training covers the boundary rules tutors must keep.', zh: '培训讲导师必须遵守的边界规则。' },
      listening: { zh: '两个音节，重音在第一个；结尾 -ry 弱读。', en: 'Two syllables with first stress; the ending is weak.' },
    },
    {
      term: 'matching', phonetic: '/ˈmætʃɪŋ/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '配对，把导师与学生安排成对', en: 'the process of pairing a tutor with a suitable tutee' },
      usage: { zh: '不可数；the matching rule、subject matching。动词是 match。', en: 'Uncountable: the matching rule, subject matching. The verb is match.' },
      collocations: ['the matching rule', 'subject matching', 'pair matching'],
      example: { en: 'The matching rule pairs people by subject need.', zh: '配对规则按学科需求安排双方。' },
      listening: { zh: '两个音节，重音在第一个；/tʃ/ 读清楚。', en: 'Two syllables with first stress; pronounce /tʃ/.' },
    },
    {
      term: 'evaluation', phonetic: '/ɪˌvæljuˈeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '评估，衡量计划是否有效', en: 'the measurement of whether the scheme achieves its goals' },
      usage: { zh: '可数或不可数；the evaluation plan、track evaluation。动词是 evaluate。', en: 'The evaluation plan, track evaluation. The verb is evaluate.' },
      collocations: ['the evaluation plan', 'track evaluation', 'scheme evaluation'],
      example: { en: 'Evaluation tracks attendance and progress against goals.', zh: '评估跟踪出勤与目标进展。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈeɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'safeguard', phonetic: '/ˈseɪfɡɑːd/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '保障措施，防止计划出问题的安排', en: 'a measure built in to protect the scheme from harm' },
      usage: { zh: '可数名词；build in a safeguard、the three safeguards。', en: 'Countable: build in a safeguard, the three safeguards.' },
      collocations: ['the three safeguards', 'build in a safeguard', 'a safeguard against'],
      example: { en: 'Weekly check-ins are a safeguard against poor matches.', zh: '每周跟进是防止配对失当的保障。' },
      listening: { zh: '复合词，重音在第一个词 safe。', en: 'Compound with stress on safe.' },
    },
    {
      term: 'out of their depth', phonetic: '/ˌaʊt əv ðeə depθ/', partOfSpeech: 'phrase', sentenceIndex: 24,
      meaning: { zh: '力不从心，超出能力范围', en: 'unable to cope with the subject required of them' },
      usage: { zh: '习语；be out of your depth、feel out of your depth。', en: 'Idiom: be out of your depth, feel out of your depth.' },
      collocations: ['out of their depth', 'feel out of your depth', 'out of my depth'],
      example: { en: 'Subject matching prevents a tutor being out of their depth.', zh: '学科配对避免导师对请求内容力不从心。' },
      listening: { zh: 'depth 单音节 /depθ/，结尾 /θ/ 读出来。', en: 'depth is one syllable /depθ/; pronounce the final /θ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'settle recruitment', sentenceIndex: 1,
      meaning: { zh: '先把招募方案定下来', en: 'to agree the recruitment approach first' },
      usage: { zh: 'settle 后接话题；settle the details、settle on a plan。', en: 'Settle takes the topic: settle the details, settle on a plan.' },
      example: { en: 'Let us settle recruitment before we discuss training.', zh: '讨论培训前先把招募定下来。' },
    },
    {
      phrase: 'drift into', sentenceIndex: 9,
      meaning: { zh: '不知不觉滑向（角色之外的内容）', en: 'to move gradually into something outside the role' },
      usage: { zh: 'drift into personal advice；后接名词。', en: 'Drift into personal advice; followed by a noun.' },
      example: { en: 'Boundaries stop tutors drifting into personal advice.', zh: '边界规则防止导师滑向私人建议。' },
    },
    {
      phrase: 'tracks attendance', sentenceIndex: 16,
      meaning: { zh: '记录并跟踪出勤情况', en: 'to record who attends each session over time' },
      usage: { zh: 'track attendance、track progress；评估语境高频。', en: 'Track attendance, track progress; common in evaluation talks.' },
      example: { en: 'Evaluation tracks attendance at every session.', zh: '评估跟踪每次活动的出勤。' },
    },
    {
      phrase: 'out of their depth', sentenceIndex: 24,
      meaning: { zh: '超出能力，应付不来', en: 'unable to manage the required subject' },
      usage: { zh: '与 vocab 呼应；solve the problem of being out of depth。', en: 'Related to the vocab entry; solve the out-of-depth problem.' },
      example: { en: 'A tutor out of their depth cannot help the requested work.', zh: '力不从心的导师帮不上请求的忙。' },
    },
    {
      phrase: 'check-ins with', sentenceIndex: 30,
      meaning: { zh: '与……定期跟进沟通', en: 'short regular meetings to review how things are going' },
      usage: { zh: 'check-ins with a coordinator；口语复合名词。', en: 'Check-ins with a coordinator; spoken compound noun.' },
      example: { en: 'Weekly check-ins with a coordinator catch problems early.', zh: '每周与协调员跟进能及早发现问题。' },
    },
    {
      phrase: 'spread too thin', sentenceIndex: 60,
      meaning: { zh: '摊得太薄，精力分散', en: 'to be given too many tasks to do them well' },
      usage: { zh: 'spread yourself thin；口语习语。', en: 'Spread yourself thin; a spoken idiom.' },
      example: { en: 'A strong tutor must not be spread too thin across requests.', zh: '能力强的导师也不能被请求摊得太薄。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对先标发言人再对类别', en: 'Tag speakers before matching categories' },
      body: {
        zh: '第 21 到 24 题对应 Neerja、Ryan、Aria、Neerja 四位发言轮次，选项分招募、培训、配对、评估四类。听前给 A 到 E 标类别，听到 recruitment、training、matching、evaluation 时直接对号入座。',
        en: 'Items 21 to 24 follow Neerja, Ryan, Aria and Neerja, and options split into recruitment, training, matching and evaluation. Tag A to E with categories beforehand, and match recruitment, training, matching and evaluation as they appear.',
      },
    },
    {
      title: { zh: '多选排除预算与隐私干扰', en: 'Eliminate budget and privacy distractors' },
      body: {
        zh: '第 28 到 30 题选三项。录音里付费广告超预算、开放时间表涉隐私、自动晋升看资历，都被否定；听到 outside our budget、privacy concerns、rewards longevity 时把对应选项划掉。',
        en: 'Items 28 to 30 choose three. Paid advertising is over budget, open timetables raise privacy concerns, and automatic promotion rewards longevity; cross out options after outside our budget, privacy concerns or rewards longevity.',
      },
    },
    {
      title: { zh: '评估漏洞听“尚未衡量”', en: 'Listen for what evaluation has not measured' },
      body: {
        zh: '第 27 题问评估计划的漏洞，答案常出现在 has not weighed、stays hard to score 这类表达后。讲座已经记录的出勤、成绩、月度反馈不能选；要找尚未纳入指标的软性收获。',
        en: 'Item 27 asks for the evaluation gap, and the answer often follows has not weighed or stays hard to score. Attendance, grades and monthly feedback already recorded are not the gap; look for the soft gain left out of the metrics.',
      },
    },
  ],
};
