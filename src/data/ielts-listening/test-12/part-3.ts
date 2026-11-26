import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 12 · Part 3 — 材料实验室实习三人讨论（双人对话加导师）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：各自谈岗位日常内容（配对）→ 复述主要职责（单选）→ 上岗前安全培训要求（单选）→
 * 考核方式（单选）→ 实习三项必备要求（多选）→ 样品分配与进度安排。
 * 配对块在前，单选块居中，多选块在后，题块顺序与录音顺序一致。
 */
export const test12Part3: ListeningLesson = {
  slug: 'test-12-part-3',
  part: 3,
  status: 'published',
  title: { zh: '材料实验室实习讨论', en: 'Discussing an internship at a materials lab' },
  summary: {
    zh: '实验室主管与两名实习生候选人讨论暑期实习：分别说明日常记录样品测试结果、上岗前的安全培训、导师带教与每周日志安排，复述主要职责、安全培训与考核方式，并商定实习必备的三项要求及后期样品分配。',
    en: 'A lab supervisor and two internship candidates discuss the summer placement: daily recording of sample test results, the pre-entry safety induction, mentor support and the weekly log, then the main duties, the safety requirement and the assessment, before agreeing on three required elements and later sample allocation.',
  },
  accent: { zh: '主管为英式口音，Neerja 为印度口音，Aria 为美式口音。', en: 'The supervisor has a British accent, Neerja an Indian accent, and Aria an American accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'supervisor', label: 'SUPERVISOR', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which feature of the internship does each person raise? Choose the correct letter, A–G.',
      options: [
        { key: 'A', text: 'keeping a weekly work log for the supervisor' },
        { key: 'B', text: 'completing a safety induction before touching any equipment' },
        { key: 'C', text: 'being paired with a named mentor from the research group' },
        { key: 'D', text: 'designing new building materials from scratch' },
        { key: 'E', text: 'helping record results from material samples' },
        { key: 'F', text: 'rotating through every department in the building' },
        { key: 'G', text: 'preparing a short report for the end-of-internship review' },
      ],
      items: [
        { number: 21, text: 'Neerja' },
        { number: 22, text: 'the supervisor' },
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
          stem: 'What will the intern’s main duties involve?',
          options: [
            { key: 'A', text: 'designing new materials from scratch' },
            { key: 'B', text: 'assisting with tests on material samples' },
            { key: 'C', text: 'managing the lab stockroom and ordering supplies' },
          ],
        },
        {
          number: 26,
          stem: 'What must the intern do before using any lab equipment?',
          options: [
            { key: 'A', text: 'pass the safety induction and sign the safety record' },
            { key: 'B', text: 'obtain permission from each department head' },
            { key: 'C', text: 'complete an online materials examination' },
          ],
        },
        {
          number: 27,
          stem: 'How will the internship be assessed?',
          options: [
            { key: 'A', text: 'by a written final examination' },
            { key: 'B', text: 'by the weekly log and a final presentation' },
            { key: 'C', text: 'by a peer review from fellow interns' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE requirements do they agree on for the placement? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE requirements do they agree on for the placement?',
      options: [
        { key: 'A', text: 'attend the safety induction before the first lab day' },
        { key: 'B', text: 'rotate through every department in the building' },
        { key: 'C', text: 'keep a weekly work log' },
        { key: 'D', text: 'buy personal safety equipment at their own cost' },
        { key: 'E', text: 'present a summary report at the end of the placement' },
        { key: 'F', text: 'record results from the material samples' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['E'], evidence: 6,
      explanation: {
        zh: '定位句 6：We would help record results from the material samples。Neerja 描述日常工作是协助记录样品测试结果，对应 E。',
        en: 'Sentence 6: "We would help record results from the material samples". Neerja describes the daily task of recording sample results, matching E.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 10,
      explanation: {
        zh: '定位句 10：Every new intern completes a safety induction in their first week, and signs the safety record before entering the testing area。主管强调碰设备前必须完成安全培训，对应 B。',
        en: 'Sentence 10: "Every new intern completes a safety induction in their first week, and signs the safety record before entering the testing area". The supervisor stresses the pre-entry induction, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 14,
      explanation: {
        zh: '定位句 14：Each intern is paired with a named mentor from the research group。Aria 关心有人带教，主管说明每位实习生都有指定导师，对应 C。',
        en: 'Sentence 14: "Each intern is paired with a named mentor from the research group". Aria worries about being left alone, and the supervisor explains the named mentor, matching C.',
      },
    },
    {
      number: 24, accepted: ['A'], evidence: 22,
      explanation: {
        zh: '定位句 22：You keep a weekly work log, and I read it every Friday to see how the placement is going。Neerja 询问汇报频率，主管说明每周日志供主管阅读，对应 A。',
        en: 'Sentence 22: "You keep a weekly work log, and I read it every Friday to see how the placement is going". Neerja asks about reporting, and the weekly log for the supervisor matches A.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：You assist with tests on material samples, while the research team plans the next experiments。主要职责是协助样品测试，对应 B。A 的自行设计材料在句 28 被 Not at this stage 否定，C 的库房管理在句 30 归实验室管理员。',
        en: 'Sentence 28: "You assist with tests on material samples, while the research team plans the next experiments". The duty is assisting with sample tests, matching B. Designing materials from scratch is ruled out in the same sentence, and stockroom work in sentence 30 belongs to a lab officer.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：the induction must be finished and the safety record signed。上岗前要完成培训并签字，对应 A。B 的逐部门批准与 C 的在线材料考试在录音中均未出现。',
        en: 'Sentence 36: "the induction must be finished and the safety record signed". Completing the induction and signing the record matches A. Permission from department heads and an online exam are never mentioned.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 39,
      explanation: {
        zh: '定位句 39：Your weekly log shows your progress week by week, and the final presentation carries the rest of the mark。考核看每周日志加最终汇报，对应 B。A 的笔试在句 39 被 No written exam 否定，C 的同伴互评在句 41 被非正式化处理。',
        en: 'Sentence 39: "Your weekly log shows your progress week by week, and the final presentation carries the rest of the mark". Assessment uses the log plus the presentation, matching B. A written exam is ruled out in the same sentence, and peer marking in sentence 41 is only informal feedback.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 45,
      explanation: {
        zh: '定位句 45：the safety induction has to be completed before you set foot in the testing area。进实验室前完成安全培训是必备要求，对应 A。B 的轮转所有部门在句 49 被排除，D 的自购防护装备在句 51 被否定。',
        en: 'Sentence 45: "the safety induction has to be completed before you set foot in the testing area". Completing the induction first is a requirement, matching A. Rotating through departments in sentence 49 is ruled out, and buying own gear in sentence 51 is refused.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 46,
      explanation: {
        zh: '定位句 46：the weekly log, kept up to date, so the supervisor can follow how the work develops。每周日志及时更新是第二项必备要求，对应 C。',
        en: 'Sentence 46: "the weekly log, kept up to date, so the supervisor can follow how the work develops". Keeping the log current is the second requirement, matching C.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 53,
      explanation: {
        zh: '定位句 53：It is part of the assessment, so yes, it counts as a required task at the end of the placement。期末总结汇报是必备任务，对应 E。F 的记录样品结果是日常职责，不在他们列的三项要求清单里。',
        en: 'Sentence 53: "It is part of the assessment, so yes, it counts as a required task at the end of the placement". The end report is a required task, matching E. Recording sample results in F is a routine duty, not one of the three listed requirements.',
      },
    },
  ],
  transcript: [
    { speaker: 'supervisor', text: 'Good afternoon, both of you. You are here to talk through the summer internship in the materials lab, so let’s start with what the placement actually involves.' },
    { speaker: 'neerja', text: 'Thank you. I read the advertisement, but I’d like to hear how a typical week looks.' },
    { speaker: 'aria', text: 'Same here. I’m mainly curious about how much lab time there really is.' },
    { speaker: 'supervisor', text: 'Fair questions. We’ll go through the daily work, the safety side, the support you get, and how we assess the placement.' },
    { speaker: 'supervisor', text: 'Neerja, you asked about the typical week first. What do you picture yourself doing?' },
    { speaker: 'neerja', text: 'I expect to spend most of the day in the main lab, right beside the research team.' },
    { speaker: 'neerja', text: 'We would help record results from the material samples, such as strength tests and heat measurements, rather than designing products ourselves.' },
    { speaker: 'supervisor', text: 'That sounds about right. The samples are tested on fixed rigs, and your job is to log and check the readings.' },
    { speaker: 'supervisor', text: 'Most samples are small, so lifting them rarely needs a second person.' },
    { speaker: 'supervisor', text: 'Before any equipment is touched, though, there is one rule we cannot skip.' },
    { speaker: 'supervisor', text: 'Every new intern completes a safety induction in their first week, and signs the safety record before entering the testing area.' },
    { speaker: 'aria', text: 'What happens in that induction? Is it just paperwork?' },
    { speaker: 'supervisor', text: 'It covers fire procedures, handling sharp tools, and what to do if a sample spills.' },
    { speaker: 'supervisor', text: 'You also watch a short film on lab hazards, and an officer checks that you can use the eyewash station.' },
    { speaker: 'aria', text: 'Is the induction repeated if we miss the first day?' },
    { speaker: 'supervisor', text: 'It is held once a week, and you attend the next session before entering the lab.' },
    { speaker: 'aria', text: 'I was worried we would be left to figure out the machines on our own.' },
    { speaker: 'supervisor', text: 'Certainly not. Each intern is paired with a named mentor from the research group, who shows you the machines and answers your questions.' },
    { speaker: 'aria', text: 'That’s reassuring. My mentor can walk me through the test rigs without me bothering the whole group.' },
    { speaker: 'neerja', text: 'Will the mentor write my final reference as well?' },
    { speaker: 'supervisor', text: 'The mentor contributes to the report, but the final sign-off comes from me.' },
    { speaker: 'neerja', text: 'And how often do we report back to you?' },
    { speaker: 'supervisor', text: 'You keep a weekly work log, and I read it every Friday to see how the placement is going.' },
    { speaker: 'neerja', text: 'So the weekly log is for you, not a separate assignment to hand in somewhere else.' },
    { speaker: 'aria', text: 'Do we have to prepare anything for the end of the internship?' },
    { speaker: 'supervisor', text: 'Near the end you give a short presentation on one sample you worked with, and that forms part of the final assessment.' },
    { speaker: 'supervisor', text: 'Now, a few details about the main duties.' },
    { speaker: 'neerja', text: 'Are we expected to design our own materials?' },
    { speaker: 'supervisor', text: 'Not at this stage. You assist with tests on material samples, while the research team plans the next experiments.' },
    { speaker: 'aria', text: 'So the stockroom and ordering supplies are not really our job.' },
    { speaker: 'supervisor', text: 'Correct. A lab officer handles stock, and your time goes to the samples and the readings.' },
    { speaker: 'aria', text: 'What about cleaning the test rigs after sessions?' },
    { speaker: 'supervisor', text: 'Your mentor shows you the routine cleaning after each session, so that is part of the lab duties.' },
    { speaker: 'supervisor', text: 'About safety, one thing people often ask.' },
    { speaker: 'aria', text: 'Do we need to bring our own gloves or goggles?' },
    { speaker: 'supervisor', text: 'No, the lab issues all personal safety equipment, and the stockroom keeps spare goggles for the sessions.' },
    { speaker: 'supervisor', text: 'Before the first lab day, though, the induction must be finished and the safety record signed.' },
    { speaker: 'supervisor', text: 'Now the assessment. How do we decide whether the placement went well?' },
    { speaker: 'neerja', text: 'Is there a final written exam at the end?' },
    { speaker: 'supervisor', text: 'No written exam. Your weekly log shows your progress week by week, and the final presentation carries the rest of the mark.' },
    { speaker: 'aria', text: 'So peers do not mark each other?' },
    { speaker: 'supervisor', text: 'Not formally. Fellows may give feedback informally, but the assessment rests with the mentor and me.' },
    { speaker: 'neerja', text: 'Do we get feedback during the placement, not only at the end?' },
    { speaker: 'supervisor', text: 'Yes, the mentor notes any problems early, and the Friday log review gives you a chance to ask questions.' },
    { speaker: 'supervisor', text: 'Let’s agree on what the placement definitely requires from you.' },
    { speaker: 'aria', text: 'First, the safety induction has to be completed before you set foot in the testing area.' },
    { speaker: 'neerja', text: 'Second, the weekly log, kept up to date, so the supervisor can follow how the work develops.' },
    { speaker: 'supervisor', text: 'Third, you stay with your mentor through the placement, rather than swapping people every few days.' },
    { speaker: 'neerja', text: 'What about seeing other departments? The building has several research teams.' },
    { speaker: 'supervisor', text: 'You may meet the other teams at a group seminar, but rotating through every department is not part of this internship.' },
    { speaker: 'aria', text: 'I had wondered whether we would buy our own safety gear, to keep after the placement.' },
    { speaker: 'supervisor', text: 'No need. Everything the lab issues stays in the lab, and you do not pay for it yourself.' },
    { speaker: 'aria', text: 'And the final presentation, is that counted as a requirement?' },
    { speaker: 'supervisor', text: 'It is part of the assessment, so yes, it counts as a required task at the end of the placement.' },
    { speaker: 'neerja', text: 'When do we find out which samples we will work with?' },
    { speaker: 'supervisor', text: 'Your mentor will assign the samples after the induction, once you are cleared to enter the lab.' },
    { speaker: 'aria', text: 'What happens if the tests are running behind schedule?' },
    { speaker: 'supervisor', text: 'Then the mentor adjusts your weekly log tasks, and you still finish the required safety items on time.' },
    { speaker: 'supervisor', text: 'Any last questions before we look around the lab?' },
    { speaker: 'neerja', text: 'I think that covers the main points.' },
    { speaker: 'supervisor', text: 'Good. Let’s walk over to the testing area, and I’ll introduce you to your likely mentors.' },
  ],
  vocabulary: [
    {
      term: 'internship', phonetic: '/ˈɪntɜːnʃɪp/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '实习（期），见习岗位', en: 'a temporary placement for gaining practical experience' },
      usage: { zh: '可数名词；a summer internship、apply for an internship。动词 intern。', en: 'Countable: a summer internship. The verb is intern.' },
      collocations: ['a summer internship', 'an internship in the lab', 'apply for an internship'],
      example: { en: 'The materials lab offers two summer internships each year.', zh: '材料实验室每年提供两个暑期实习名额。' },
      listening: { zh: '三个音节，重音在第一个；结尾 -ship 读 /ʃɪp/。', en: 'Three syllables with first-syllable stress; -ship is /ʃɪp/.' },
    },
    {
      term: 'induction', phonetic: '/ɪnˈdʌkʃn/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '入职培训，上岗引导', en: 'the training given to someone starting a new role' },
      usage: { zh: '可数名词；safety induction、complete an induction。动词 induct。', en: 'Countable: safety induction, complete an induction. The verb is induct.' },
      collocations: ['safety induction', 'complete an induction', 'induction session'],
      example: { en: 'All new interns finish the safety induction before entering the lab.', zh: '所有新实习生进实验室前都完成安全培训。' },
      listening: { zh: '重音在第二音节 /ˈdʌk/；开头 /ɪ/ 很弱。', en: 'Stress the second syllable; the opening /ɪ/ is weak.' },
    },
    {
      term: 'mentor', phonetic: '/ˈmentɔː/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '导师，带教人', en: 'an experienced person who guides a less experienced colleague' },
      usage: { zh: '可数名词；a named mentor、be paired with a mentor。', en: 'Countable: a named mentor, be paired with a mentor.' },
      collocations: ['a named mentor', 'a lab mentor', 'mentor support'],
      example: { en: 'Each intern works with a mentor from the research group.', zh: '每位实习生都有研究组的一名导师带教。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /ɔː/ 不卷舌。', en: 'Two syllables with first-syllable stress; the ending is not rolled.' },
    },
    {
      term: 'readings', phonetic: '/ˈriːdɪŋz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '读数，测量数值', en: 'the numbers recorded from a measuring instrument' },
      usage: { zh: '复数；log the readings、check the readings。也指阅读材料。', en: 'Plural: log the readings, check the readings. Also means reading materials.' },
      collocations: ['check the readings', 'record the readings', 'test readings'],
      example: { en: 'The intern logs each reading into the test sheet.', zh: '实习生把每个读数记到测试表上。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /z/ 浊化。', en: 'Two syllables with first-syllable stress; the ending is voiced /z/.' },
    },
    {
      term: 'samples', phonetic: '/ˈsɑːmplz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '样品，试样', en: 'small pieces of material tested in the lab' },
      usage: { zh: '可数复数；material samples、test a sample。', en: 'Countable plural: material samples, test a sample.' },
      collocations: ['material samples', 'test samples', 'sample results'],
      example: { en: 'The samples are tested for strength and heat resistance.', zh: '样品接受强度与耐热测试。' },
      listening: { zh: '两个音节，重音在第一个；/mpl/ 辅音串不要漏。', en: 'Two syllables with first-syllable stress; keep the /mpl/ cluster.' },
    },
    {
      term: 'stockroom', phonetic: '/ˈstɒkruːm/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '库房，储藏室', en: 'a room where lab supplies and equipment are kept' },
      usage: { zh: '可数名词；lab stockroom、in the stockroom。', en: 'Countable: lab stockroom, in the stockroom.' },
      collocations: ['the lab stockroom', 'stockroom supplies', 'keep spares in the stockroom'],
      example: { en: 'Spare goggles are kept in the lab stockroom.', zh: '备用护目镜放在实验室库房。' },
      listening: { zh: '复合词，两个重音；room 读 /ruːm/。', en: 'A compound with two stresses; room is /ruːm/.' },
    },
    {
      term: 'hazards', phonetic: '/ˈhæzədz/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '危险，隐患', en: 'things that could cause injury in a workplace' },
      usage: { zh: '可数复数；lab hazards、identify hazards。形容词 hazardous。', en: 'Countable plural: lab hazards. The adjective is hazardous.' },
      collocations: ['lab hazards', 'identify hazards', 'safety hazards'],
      example: { en: 'The induction film lists the common lab hazards.', zh: '培训影片列出常见实验室隐患。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /dz/。', en: 'Two syllables with first-syllable stress; the ending is /dz/.' },
    },
    {
      term: 'presentation', phonetic: '/ˌpreznˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '汇报展示，陈述', en: 'a talk given to a group about one’s work' },
      usage: { zh: '可数名词；give a presentation、a final presentation。', en: 'Countable: give a presentation, a final presentation.' },
      collocations: ['a short presentation', 'final presentation', 'give a presentation'],
      example: { en: 'Each intern gives a short presentation at the end.', zh: '每位实习生最后做一次简短汇报。' },
      listening: { zh: '四个音节，重音在最后 /ˈteɪ/。', en: 'Four syllables with stress on the final /ˈteɪ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'talk through', sentenceIndex: 0,
      meaning: { zh: '逐项讨论，过一遍', en: 'to discuss something in detail' },
      usage: { zh: '及物短语动词；talk through the placement、the schedule。', en: 'Transitive: talk through the placement or the schedule.' },
      example: { en: 'We will talk through the duties before you start.', zh: '开始前我们把职责逐项讨论清楚。' },
    },
    {
      phrase: 'figure out', sentenceIndex: 16,
      meaning: { zh: '弄明白，独自摸索出', en: 'to work out how something works on your own' },
      usage: { zh: '表示不靠他人讲解、自己琢磨出设备或方法的用法，口语高频，宾语可放在 out 前后。', en: 'To work out how something works without being shown; the object can go before or after out.' },
      example: { en: 'New interns should not have to figure out the rigs alone.', zh: '新实习生不必独自摸索测试设备。' },
    },
    {
      phrase: 'paired with', sentenceIndex: 17,
      meaning: { zh: '与……结对，搭配', en: 'matched with a partner for a task' },
      usage: { zh: 'be paired with a mentor；配对、分组场景。', en: 'Be paired with a mentor; used for pairing and grouping.' },
      example: { en: 'Each candidate is paired with an experienced mentor.', zh: '每位候选人都与一名经验丰富的导师结对。' },
    },
    {
      phrase: 'sign-off', sentenceIndex: 20,
      meaning: { zh: '签字批准，最终认可', en: 'final approval given by the person in charge' },
      usage: { zh: '名词；the final sign-off comes from somebody。', en: 'A noun: the final sign-off comes from somebody.' },
      example: { en: 'The supervisor’s sign-off is needed before the report goes out.', zh: '报告发出前需要主管签字批准。' },
    },
    {
      phrase: 'up to date', sentenceIndex: 46,
      meaning: { zh: '及时更新的，不拖延的', en: 'kept current, without missing recent entries' },
      usage: { zh: 'keep the log up to date；与 out of date 相对。', en: 'Keep the log up to date; the opposite is out of date.' },
      example: { en: 'The weekly log must be kept up to date.', zh: '每周日志必须及时更新。' },
    },
    {
      phrase: 'set foot in', sentenceIndex: 45,
      meaning: { zh: '踏入，进入（某地）', en: 'to enter a place for the first time' },
      usage: { zh: 'set foot in the lab；常用否定或条件句。', en: 'Set foot in the lab; often in negatives or conditionals.' },
      example: { en: 'No one sets foot in the testing area without the induction.', zh: '没完成培训任何人都不能进测试区。' },
    },
    {
      phrase: 'cleared to enter', sentenceIndex: 55,
      meaning: { zh: '获准进入', en: 'given permission to go inside' },
      usage: { zh: 'be cleared to enter the lab；安全审查通过后使用。', en: 'Be cleared to enter the lab, after safety checks pass.' },
      example: { en: 'Interns are cleared to enter only after the induction.', zh: '实习生通过培训后才获准进入。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先把声音和角色对上', en: 'Match voices to roles first' },
      body: {
        zh: 'Part 3 配对问“谁提出了哪项安排”。开场先记住主管、Neerja、Aria 的声音；每条安排先标说话人再记内容，避免把导师带教记到 Neerja 名下。',
        en: 'Matching items ask who raised which arrangement. Match voices to roles at the opening; note the speaker before the point, so mentor support is not attached to Neerja by mistake.',
      },
    },
    {
      title: { zh: '区分日常职责与必备要求', en: 'Routine duty versus requirement' },
      body: {
        zh: '多选题的 F 项“记录样品结果”是每天都做的职责，而 A、C、E 是他们逐条列出的必备要求。听到 First、Second、Third 时把对应选项圈出，职责描述不要混进要求清单。',
        en: 'The multiple-choice option F, recording sample results, is a daily duty, while A, C and E are listed requirements. Circle options after First, Second and Third, and do not fold duty descriptions into the requirement list.',
      },
    },
    {
      title: { zh: '否定与被推迟的安排要标出来', en: 'Mark rejected and deferred arrangements' },
      body: {
        zh: 'Not at this stage、No written exam、rotating through every department is not part、do not pay for it 都是排除项。干扰项常把这些否定内容改成正面安排，听到否定词先在选项旁打叉。',
        en: 'Not at this stage, No written exam, rotating through every department is not part and do not pay for it are exclusions. Distractors often turn these into positive arrangements; mark a cross beside the option after the negative.',
      },
    },
  ],
};
