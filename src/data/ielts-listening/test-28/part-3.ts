import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 28 · Part 3 — 书写与学习论文讨论（三人讨论，英式为主，一名学生美式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：各自立场与分工（配对 21–24）→ 实验设计、结论谨慎的原因与课堂应用建议（单选 25–27）
 * → 论文的三个优点（多选 28–30）。题块顺序与录音一致。
 */
export const test28Part3: ListeningLesson = {
  slug: 'test-28-part-3',
  part: 3,
  status: 'published',
  title: { zh: '书写与学习论文讨论', en: 'Discussing a paper on handwriting and learning' },
  summary: {
    zh: '导师与两名学生讨论一篇书写与学习的论文：谁主张手写利于记忆、谁提出样本量顾虑、谁复核对照组设计、谁起草课堂应用部分；随后梳理两组对照实验的设计、结论保持谨慎的原因、课堂上有限度应用的建议，并列出论文的三个优点。',
    en: 'A tutor and two students discuss a paper on handwriting and learning: who favours handwriting for memory, who raises the sample-size concern, who reviews the control group, and who drafts the classroom application. They then settle the two-group design, the reasons for the cautious conclusion, the limited classroom advice, and the three strengths of the paper.',
  },
  accent: { zh: '导师与 Sonia 为英式口音，Ava 为美式口音。', en: 'The tutor and Sonia have British accents; Ava has an American accent.' },
  cast: [
    { id: 'tutor', label: 'TUTOR', gender: 'male', voice: 'en-GB-ThomasNeural' },
    { id: 'sonia', label: 'SONIA', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'ava', label: 'AVA', gender: 'female', voice: 'en-US-AvaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which person supports each point or takes each task? Choose the correct letter, A–C.',
      options: [
        { key: 'A', text: 'Sonia' },
        { key: 'B', text: 'Ava' },
        { key: 'C', text: 'the tutor' },
      ],
      items: [
        { number: 21, text: 'prefers handwriting for memory notes' },
        { number: 22, text: 'raises the sample-size concern' },
        { number: 23, text: 'reviews the control group design' },
        { number: 24, text: 'drafts the classroom application section' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What was the experiment design?',
          options: [
            { key: 'A', text: 'a survey comparing handwritten and typed answers after a lesson' },
            { key: 'B', text: 'a controlled two-group study with the note-taking method as the only difference' },
            { key: 'C', text: 'a single group that switched from handwriting to typing halfway through' },
          ],
        },
        {
          number: 26,
          stem: 'Why is the conclusion cautious?',
          options: [
            { key: 'A', text: 'the readers disagreed on most of the recall scores' },
            { key: 'B', text: 'the sample was small and the study lasted only one week' },
            { key: 'C', text: 'the typing group refused to take the recall test' },
          ],
        },
        {
          number: 27,
          stem: 'What does the tutor advise about classroom use?',
          options: [
            { key: 'A', text: 'replace all classroom laptops with handwritten notebooks at once' },
            { key: 'B', text: 'apply the findings in a limited way and collect local class data first' },
            { key: 'C', text: 'ignore the handwriting result until a paid survey confirms it' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE strengths does the paper have? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE strengths does the paper have?',
      options: [
        { key: 'A', text: 'the note-taking conditions were controlled' },
        { key: 'B', text: 'the recall scores were recorded clearly' },
        { key: 'C', text: 'the study used a large sample across many schools' },
        { key: 'D', text: 'a paid teacher survey supported the result' },
        { key: 'E', text: 'the paper states its limits honestly' },
        { key: 'F', text: 'the researchers designed an original handwriting tool' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Sonia 说 I’m in favour of handwriting for memory notes。主张手写利于记忆对应 A（Sonia）；Ava 句 5 只是提出键盘速度的疑问，并未主张手写。',
        en: 'Sentence 4: Sonia says "I’m in favour of handwriting for memory notes". Favouring handwriting matches A, Sonia. Ava in sentence 5 only questions keyboard speed; she does not argue for handwriting.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 7,
      explanation: {
        zh: '定位句 7：Ava 说 I’d raise the sample-size concern。提出样本量顾虑归 Ava，对应 B；她还指出每组只有四十名学生。',
        en: 'Sentence 7: Ava says "the concern about sample size". The sample-size concern goes to Ava, matching B. She notes only forty students per group.',
      },
    },
    {
      number: 23, accepted: ['B'], evidence: 10,
      explanation: {
        zh: '定位句 10：Ava 说 I can review the control group design。复核对照组设计归 Ava，对应 B；两组做同一回忆测试、读同一篇文章。',
        en: 'Sentence 10: Ava says "I can review the control group design". Reviewing the control group goes to Ava, matching B. Both groups sat the same recall test on the same passage.',
      },
    },
    {
      number: 24, accepted: ['A'], evidence: 11,
      explanation: {
        zh: '定位句 11：Sonia 说 Then I’ll draft the classroom application section。起草课堂应用部分归 Sonia，对应 A；任务是写出结论可进入写作课的环节。',
        en: 'Sentence 11: Sonia says "Then I’ll draft the classroom application section". The application draft goes to Sonia, matching A. Her task names where the findings could enter the writing lesson.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：It was a controlled two-group study, with the note-taking method as the only thing that differed。受控两组、唯一变量是记录方式对应 B；A 的课后问卷与句 14 的现场分组不符，C 的中途切换在讲解中没有出现。',
        en: 'Sentence 17: "It was a controlled two-group study, with the note-taking method as the only thing that differed". A controlled two-group design matches B. A lesson survey in A contradicts the on-site split in sentence 14, and a mid-study switch in C is never mentioned.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：the sample is small and the study ran for only one week, so they cannot claim a long-term advantage yet。样本小、周期短对应 B；A 的评分者分歧与句 19 的两名独立评分者不符，C 的打字组拒测在讲解中未出现。',
        en: 'Sentence 22: "the sample is small and the study ran for only one week, so they cannot claim a long-term advantage yet". A small sample and one-week period match B. Reader disagreement in A contradicts two independent readers in sentence 19, and the typing group refusing the test in C is never mentioned.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：I would apply them in a limited way。有限度应用、先收集本班数据对应 B；A 的立刻换掉笔记本电脑与句 28 的 on the strength of one small study 相反，C 的等付费调查确认在讲解中未出现。',
        en: 'Sentence 27: "I would apply them in a limited way". Limited application with local data matches B. Replacing laptops at once in A contradicts one small study in sentence 28, and waiting for a paid survey in C is never mentioned.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 31,
      explanation: {
        zh: '定位句 31：the conditions were controlled. Both groups read the same passage and sat the same recall test。记录条件受控对应 A。',
        en: 'Sentence 31: "the conditions were controlled. Both groups read the same passage and sat the same recall test". Controlled conditions match A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 32,
      explanation: {
        zh: '定位句 32：the recall scores were recorded clearly, with two readers checking the marks。回忆分数记录清晰对应 B。',
        en: 'Sentence 32: "the recall scores were recorded clearly, with two readers checking the marks". Clear recall scoring matches B.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 33,
      explanation: {
        zh: '定位句 33：the paper states its limits honestly, and it does not overstate the effect of handwriting。如实写明局限对应 E。C 的大样本多校被句 35 排除，D 的付费教师调查句 37 不存在，F 的原创书写工具句 39 不是研究重点。',
        en: 'Sentence 33: "the paper states its limits honestly, and it does not overstate the effect of handwriting". Honest limits match E. A large multi-school sample in C is ruled out in sentence 35, a paid teacher survey in D does not exist in sentence 37, and the tool in F is not the focus in sentence 39.',
      },
    },
  ],
  transcript: [
    { speaker: 'tutor', text: 'Sorry to keep you waiting. I have just finished marking the last presentation.' },
    { speaker: 'sonia', text: 'No problem. We brought the paper on handwriting and learning that you set last week.' },
    { speaker: 'ava', text: 'There are a few parts of the design we want to talk through before the seminar.' },
    { speaker: 'tutor', text: 'Good. Let’s start with what each of you makes of the central claim.' },
    { speaker: 'sonia', text: 'I’m in favour of handwriting for memory notes. When you write by hand, you process the meaning before the pen moves, and that seems to stick better than typing.' },
    { speaker: 'ava', text: 'I see that, but I wonder if the typing group in the study were simply slower at the keyboard.' },
    { speaker: 'tutor', text: 'Hold that point and let’s turn to the sample.' },
    { speaker: 'ava', text: 'I’d raise the concern about sample size. The study ran with only forty students in each group, and a larger pool might show a different pattern.' },
    { speaker: 'sonia', text: 'That’s fair, but forty is enough for a first look, as long as the paper states the limit clearly.' },
    { speaker: 'tutor', text: 'Now who has looked at the control group?' },
    { speaker: 'ava', text: 'I can review the control group design. Both groups took the same recall test after the same reading passage, so the comparison is fairly even.' },
    { speaker: 'sonia', text: 'Then I’ll draft the classroom application section, saying where the findings could enter the writing lesson.' },
    { speaker: 'tutor', text: 'Perfect. Those four points are settled for now.' },
    { speaker: 'tutor', text: 'Let’s go back to how the experiment was actually set up.' },
    { speaker: 'sonia', text: 'The researchers split the volunteers into two groups. One group took notes by hand, the other typed them on a laptop, and all read the same text.' },
    { speaker: 'ava', text: 'Both notes were collected straight after the reading, and no one was told which group scored higher.' },
    { speaker: 'tutor', text: 'So what would you call the main design?' },
    { speaker: 'sonia', text: 'It was a controlled two-group study, with the note-taking method as the only thing that differed between the sets.' },
    { speaker: 'tutor', text: 'Right. And how did they measure the result?' },
    { speaker: 'ava', text: 'Each student sat a recall test the next day, and the scores were marked against the original passage by two independent readers.' },
    { speaker: 'sonia', text: 'The handwritten group did remember slightly more details, but the gap was not large across every section.' },
    { speaker: 'tutor', text: 'Why do you think the authors keep the conclusion so cautious?' },
    { speaker: 'ava', text: 'Because the sample is small and the study ran for only one week, so they cannot claim a long-term advantage yet.' },
    { speaker: 'sonia', text: 'They also did not control for keyboard skill, and students who type fast may process the text differently.' },
    { speaker: 'tutor', text: 'That matters. What limits on the findings should we keep in our summary?' },
    { speaker: 'ava', text: 'We should say the result is a preliminary sign, not a settled rule for every subject and age group.' },
    { speaker: 'tutor', text: 'Now the classroom side. How ready are these findings for teaching?' },
    { speaker: 'sonia', text: 'I would apply them in a limited way. Handwritten note-taking could suit younger learners, but students taking notes for revision may prefer typing.' },
    { speaker: 'ava', text: 'The tutor should not replace laptops in the classroom on the strength of one small study.' },
    { speaker: 'tutor', text: 'Agreed. Use the paper to open a discussion, and gather our own class data before making a change.' },
    { speaker: 'tutor', text: 'When the reviewers look at the paper, what are its real strengths?' },
    { speaker: 'sonia', text: 'First, the conditions were controlled. Both groups read the same passage and sat the same recall test.' },
    { speaker: 'ava', text: 'Second, the recall scores were recorded clearly, with two readers checking the marks.' },
    { speaker: 'tutor', text: 'Third, the paper states its limits honestly, and it does not overstate the effect of handwriting.' },
    { speaker: 'sonia', text: 'What about the sample of schools?' },
    { speaker: 'tutor', text: 'The study did not draw on many schools, so a broad sample is not a strength.' },
    { speaker: 'ava', text: 'Was there a paid survey of teachers?' },
    { speaker: 'tutor', text: 'No, the data come from the student experiment only; a teacher survey would be separate.' },
    { speaker: 'sonia', text: 'Should we mention the handwriting tool the researchers designed?' },
    { speaker: 'tutor', text: 'It was a provided notebook, not the study’s focus, so it is not a main strength.' },
    { speaker: 'tutor', text: 'Let’s fix who brings what to the next seminar.' },
    { speaker: 'ava', text: 'I’ll summarise the sample-size and control group points in two short slides.' },
    { speaker: 'sonia', text: 'I’ll write the classroom application notes, with examples from our own writing lesson.' },
    { speaker: 'tutor', text: 'Check that every claim in your notes matches a sentence in the paper, not your own guess.' },
    { speaker: 'ava', text: 'Some students type faster than they write, which may change the recall result here.' },
    { speaker: 'tutor', text: 'Right. Note that difference as a local factor rather than a flaw in the study itself.' },
    { speaker: 'sonia', text: 'Should we ask whether the recall test allowed typing the answers?' },
    { speaker: 'tutor', text: 'Good question. Note the test format in your summary, because it affects how fair the comparison looks.' },
    { speaker: 'ava', text: 'The paper reports engagement with the notes, but those numbers are not central.' },
    { speaker: 'sonia', text: 'We can mention engagement in one sentence, without treating it as a main result.' },
    { speaker: 'tutor', text: 'Quote the recall gap as a score difference, not just a general claim that handwriting wins.' },
    { speaker: 'ava', text: 'The next reading we discuss has a longer experimental period, which may answer the sample concern.' },
    { speaker: 'sonia', text: 'I’ll compare the two studies on sample size and recall measure after that paper arrives.' },
    { speaker: 'tutor', text: 'Keep the comparison focused on design, not just on which result you prefer.' },
    { speaker: 'ava', text: 'Do we need the original text for the recall test?' },
    { speaker: 'tutor', text: 'The library has a copy, and I can put it on the reading folder before Friday.' },
    { speaker: 'sonia', text: 'What about the deadline for our seminar notes?' },
    { speaker: 'tutor', text: 'Bring a draft by Wednesday afternoon, and we can go through the main claims together.' },
    { speaker: 'ava', text: 'I’ll sort out the slides before the seminar, so we have time for comments.' },
    { speaker: 'sonia', text: 'The application section should name one concrete writing activity we could trial.' },
    { speaker: 'tutor', text: 'Yes, choose a short note-taking task where students compare handwritten and typed notes.' },
    { speaker: 'ava', text: 'I’ll record who offers to take part in that trial.' },
    { speaker: 'sonia', text: 'Thanks for clarifying what the paper can and cannot support.' },
    { speaker: 'tutor', text: 'Describe the design fairly, and say plainly where the evidence stops.' },
    { speaker: 'ava', text: 'I’ll see you both at the Wednesday seminar.' },
    { speaker: 'sonia', text: 'See you then.' },
  ],
  vocabulary: [
    {
      term: 'handwriting', phonetic: '/ˈhændraɪtɪŋ/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '手写（用笔记记，对照打字）', en: 'writing by hand rather than typing on a keyboard' },
      usage: { zh: '不可数；handwriting notes。另有“笔迹”之义。', en: 'Uncountable: handwriting notes. It also means a person’s script.' },
      collocations: ['handwriting notes', 'by handwriting', 'the handwriting condition'],
      example: { en: 'The handwritten group remembered slightly more details.', zh: '手写组记住的细节略多。' },
      listening: { zh: '复合词两部分重读，结尾 /ɪŋ/。', en: 'Both parts are stressed, ending in /ɪŋ/.' },
    },
    {
      term: 'recall', phonetic: '/rɪˈkɔːl/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '回忆（测试中复现读过的内容）', en: 'the ability to bring studied information back to mind' },
      usage: { zh: '不可数；recall test、recall score。动词 recall 重音在第二音节。', en: 'Uncountable: recall test, recall score. The verb also stresses the second syllable.' },
      collocations: ['the recall test', 'recall scores', 'free recall'],
      example: { en: 'Both groups sat the same recall test the next day.', zh: '两组次日参加同一回忆测试。' },
      listening: { zh: '名词与动词都重音在第二音节 /ˈkɔː/，开头 /rɪ/ 轻读。', en: 'Noun and verb both stress the second; reduce the initial /rɪ/.' },
    },
    {
      term: 'control', phonetic: '/kənˈtrəʊl/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '对照（实验中用于比较的条件组）', en: 'the comparison group kept unchanged in an experiment' },
      usage: { zh: 'control group、controlled condition。动词 control 指“控制变量”。', en: 'Control group, controlled condition. The verb means to manage variables.' },
      collocations: ['the control group', 'control group design', 'controlled conditions'],
      example: { en: 'The control group took the same reading passage.', zh: '对照组读同一篇文章。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈtrəʊl/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '样本（参与研究的受试者群体）', en: 'the group of people taking part in a study' },
      usage: { zh: '可数；sample size、large sample。动词 sample 指“抽样”。', en: 'Countable: sample size, large sample. The verb means to select participants.' },
      collocations: ['the sample size', 'a small sample', 'a large sample'],
      example: { en: 'The sample was only forty students per group.', zh: '样本每组只有四十名学生。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /pl/ 辅音丛。', en: 'Two syllables, stressed on the first, with a final /pl/ cluster.' },
    },
    {
      term: 'application', phonetic: '/ˌæplɪˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '应用（研究结论在课堂中的使用）', en: 'the practical use of research findings in a setting' },
      usage: { zh: '可数；classroom application、application section。动词 apply。', en: 'Countable: classroom application, application section. The verb is apply.' },
      collocations: ['the application section', 'classroom application', 'practical application'],
      example: { en: 'The application section names one writing activity to trial.', zh: '应用部分写出一个可试用的写作活动。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈkeɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'preliminary', phonetic: '/prɪˈlɪmɪnəri/', partOfSpeech: 'adj.', sentenceIndex: 25,
      meaning: { zh: '初步的（尚未下最终结论）', en: 'early and provisional, before the final result is known' },
      usage: { zh: 'preliminary sign、preliminary result。区别于 final。', en: 'Preliminary sign, preliminary result. Compare final.' },
      collocations: ['a preliminary sign', 'preliminary results', 'a preliminary study'],
      example: { en: 'The result is a preliminary sign, not a settled rule.', zh: '这只是初步迹象，不是定论。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈlɪm/，结尾 /ri/ 轻读。', en: 'Four syllables, stress on the second, light final /ri/.' },
    },
    {
      term: 'engagement', phonetic: '/ɪnˈɡeɪdʒmənt/', partOfSpeech: 'n.', sentenceIndex: 48,
      meaning: { zh: '投入度（学生参与笔记的程度）', en: 'how involved students are with a task' },
      usage: { zh: '不可数；engagement with the notes。动词 engage。', en: 'Uncountable: engagement with the notes. The verb is engage.' },
      collocations: ['student engagement', 'engagement with the notes', 'high engagement'],
      example: { en: 'Engagement numbers are reported but not central to the claim.', zh: '投入度有记录，但不是核心结论。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈɡeɪdʒ/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'hold that point', sentenceIndex: 6,
      meaning: { zh: '先记下这个观点，稍后再谈', en: 'keep a point in mind and return to it later' },
      usage: { zh: '口语过渡语；对话中换话题时使用。', en: 'A spoken transition used when switching topics for the moment.' },
      example: { en: 'Hold that point and let’s turn to the sample.', zh: '先记下这个观点，我们转到样本。' },
    },
    {
      phrase: 'stick better', sentenceIndex: 4,
      meaning: { zh: '记得更牢，更易留存', en: 'to remain in memory more firmly' },
      usage: { zh: '不及物；the meaning sticks better。stick 此处指“留存”。', en: 'Intransitive: the meaning sticks better. Here stick means to remain.' },
      example: { en: 'Writing by hand seems to make the notes stick better.', zh: '手写似乎让笔记记得更牢。' },
    },
    {
      phrase: 'split the volunteers into', sentenceIndex: 14,
      meaning: { zh: '分成（若干小组）', en: 'to divide a group into smaller sets' },
      usage: { zh: '及物；split volunteers into two groups。过去式仍为 split。', en: 'Transitive: split volunteers into two groups. The past form stays split.' },
      example: { en: 'The researchers split the volunteers into two groups.', zh: '研究者把志愿者分成两组。' },
    },
    {
      phrase: 'overstate the effect', sentenceIndex: 33,
      meaning: { zh: '夸大效果，把作用说得过大', en: 'to describe an effect as larger than the evidence supports' },
      usage: { zh: '及物；overstate the effect、overstate the claim。反义 understate。', en: 'Transitive: overstate the effect, overstate the claim. The opposite is understate.' },
      example: { en: 'The paper does not overstate the effect of handwriting.', zh: '论文没有夸大手写的作用。' },
    },
    {
      phrase: 'sort out', sentenceIndex: 58,
      meaning: { zh: '办妥，整理安排好', en: 'to deal with and organise a task' },
      usage: { zh: '及物；sort out the slides、sort out the schedule。', en: 'Transitive: sort out the slides, sort out the schedule.' },
      example: { en: 'I’ll sort out the slides before the seminar.', zh: '研讨会前我把幻灯片整理好。' },
    },
    {
      phrase: 'compare the two studies on', sentenceIndex: 52,
      meaning: { zh: '在（某一维度）上比较', en: 'to judge two studies against a shared measure' },
      usage: { zh: '及物；compare the studies on sample size。', en: 'Transitive: compare the studies on sample size.' },
      example: { en: 'I’ll compare the two studies on sample size and recall measure.', zh: '我从样本量和回忆指标上比较两项研究。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先把声音对到名字', en: 'Match voices to names early' },
      body: {
        zh: 'Part 3 配对考“谁主张什么、谁做什么”。开场先记住导师、Sonia、Ava 三人的声音；听到 I’m in favour of、I’d raise、I can、Then I’ll 这类认领句，先记说话人，再记观点或任务。',
        en: 'Part 3 matching asks who argues what and who does what. Match the tutor, Sonia and Ava to their voices first. After phrases such as I’m in favour of, I’d raise, I can or Then I’ll, note the speaker before the point or task.',
      },
    },
    {
      title: { zh: '注意中途修正和换人提议', en: 'Watch for last-minute changes' },
      body: {
        zh: '讨论中常有先提议、后被他人接走的分工。听到 Actually、Then I’ll、I can 时核对说话人是否换人；早先的认领如果被后面的句子取代，以最终分工为准。',
        en: 'A task can be offered first and taken by someone else later. After Actually, Then I’ll or I can, check whether the speaker has changed. If an earlier offer is replaced, follow the final allocation.',
      },
    },
    {
      title: { zh: '多选题用否定句排干扰', en: 'Reject options with the negative' },
      body: {
        zh: '多选三个正确项对应论文优点；其余三项被导师明确排除：样本并非来自多所学校、没有付费教师调查、提供的笔记本不是研究重点。听到排除句，在对应选项旁划掉，不要凭印象保留。',
        en: 'Three options are paper strengths; the rest are explicitly ruled out: no broad school sample, no paid teacher survey, and the provided notebook is not the focus. Cross out an option when you hear the exclusion rather than keeping it on impression.',
      },
    },
  ],
};
