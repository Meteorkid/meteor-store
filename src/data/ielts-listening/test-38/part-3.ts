import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 38 · Part 3 — 语言学习 App 试用讨论（三人讨论，英式与美式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：任务分工配对 → 试用周期、留存指标与对照组理由 → 招募、隐私与结果解释（多选）。
 * 题块顺序与录音一致。
 */
export const test38Part3: ListeningLesson = {
  slug: 'test-38-part-3',
  part: 3,
  status: 'published',
  title: { zh: '语言学习 App 试用讨论', en: 'Discussing a language app trial' },
  summary: {
    zh: '三位研究者复盘一项语言学习 App 试用：Thomas 排定试用日程，Sonia 主持对照组分析，Ava 起草伦理说明，研究助理复核留存数据；试用共四周，留存以七天后回访用户为准，对照组保留旧版是为公平比较参与度。报告招募了混合年龄段、如实记录隐私顾虑、谨慎解释结果；没有付费换好评，也没有只挑最佳片段。',
    en: 'Three researchers review an app trial: Thomas scheduled sessions, Sonia led the control analysis, Ava drafted the ethics statement, and the assistant rechecked retention. The trial ran four weeks; retention means seven-day returns, and the control kept the old version for comparison. The sample mixes ages, privacy concerns noted, and results read cautiously, with no paid reviews or selected clips.',
  },
  accent: { zh: 'Thomas 与 Sonia 是英国口音英语，Ava 是美国口音英语。', en: 'Thomas and Sonia speak British English, and Ava speaks American English.' },
  cast: [
    { id: 'thomas', label: 'THOMAS', gender: 'male', voice: 'en-GB-ThomasNeural' },
    { id: 'sonia', label: 'SONIA', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'ava', label: 'AVA', gender: 'female', voice: 'en-US-AvaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Match each task with the person who handles it. Write the correct letter, A, B, C, D or E next to questions 21–24.',
      options: [
        { key: 'A', text: 'Thomas' },
        { key: 'B', text: 'Sonia' },
        { key: 'C', text: 'Ava' },
        { key: 'D', text: 'the research assistant' },
        { key: 'E', text: 'the ethics officer' },
      ],
      items: [
        { number: 21, text: 'arranged the trial schedule' },
        { number: 22, text: 'led the control group analysis' },
        { number: 23, text: 'drafted the ethics statement' },
        { number: 24, text: 'rechecked the retention figures' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'How long did the trial run?',
          options: [
            { key: 'A', text: 'four weeks' },
            { key: 'B', text: 'two weeks' },
            { key: 'C', text: 'eight weeks' },
          ],
        },
        {
          number: 26,
          stem: 'What is the main retention measure?',
          options: [
            { key: 'A', text: 'users who finish the first session' },
            { key: 'B', text: 'users who return to the app after seven days' },
            { key: 'C', text: 'users who buy the full version' },
          ],
        },
        {
          number: 27,
          stem: 'Why does the control group keep the old app version?',
          options: [
            { key: 'A', text: 'the new version has not been translated' },
            { key: 'B', text: 'to make a fair comparison of engagement' },
            { key: 'C', text: 'the assistant prefers the old layout' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE points do the researchers agree on? Choose three letters, A–E.',
      select: 3,
      stem: 'Which THREE points do the researchers agree on?',
      options: [
        { key: 'A', text: 'recruited a mixed age range' },
        { key: 'B', text: 'reported privacy concerns from interviews' },
        { key: 'C', text: 'interpreted the results cautiously' },
        { key: 'D', text: 'paid participants for good reviews' },
        { key: 'E', text: 'selected only the best clips for the summary' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：I set up the trial schedule myself, booking the two test rooms and the sessions。排定试用日程由 Thomas 负责，对应 A。',
        en: 'Sentence 3: "I set up the trial schedule myself, booking the two test rooms and the sessions". Thomas arranged the schedule, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：The control group analysis was mine to lead, checking daily opens and session length against the trial group。对照组分析由 Sonia 主持，对应 B；助理只清洗表格，不是主持者。',
        en: 'Sentence 6: "The control group analysis was mine to lead, checking daily opens and session length". Sonia led the control analysis, matching B. The assistant only cleaned spreadsheets.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 9,
      explanation: {
        zh: '定位句 9：Then the ethics statement was mine to draft. I wrote the consent wording and privacy paragraph。伦理说明由 Ava 起草，对应 C；伦理官员只审阅草稿，不是起草人。',
        en: 'Sentence 9: "Then the ethics statement was mine to draft. I wrote the consent wording and privacy paragraph". Ava drafted the ethics statement, matching C. The officer only reviewed the draft.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 12,
      explanation: {
        zh: '定位句 12：The research assistant rechecked the retention figures, because some sessions overlapped and the raw counts looked uneven。复核留存数据由研究助理完成，对应 D。',
        en: 'Sentence 12: "The research assistant rechecked the retention figures, because some sessions overlapped and the raw counts looked uneven". The assistant rechecked retention, matching D.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：It was four weeks. A shorter run would not show whether people came back after week one。试用周期四周，对应 A；句 17 也说明四周仍是短窗口。',
        en: 'Sentence 16: "It was four weeks. A shorter run would not show whether people came back after week one". The trial lasted four weeks, matching A. Sentence 17 notes four weeks is still a short window.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：Retention means users who return after seven days, not those who finish the first session only。留存主指标是七天后回访，对应 B；完成首课在句 19 被否定，购买完整版未提及。',
        en: 'Sentence 19: "Retention means users who return after seven days, not those who finish the first session only". The measure is the seven-day return, matching B. Finishing the first session is ruled out, and purchases are not mentioned.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：They kept the old version so the groups could be compared fairly on engagement over one period。对照组保留旧版是为公平比较参与度，对应 B；翻译未完成与助理偏好旧版在录音中未出现。',
        en: 'Sentence 22: "They kept the old version so the groups could be compared fairly on engagement over one period". The old version allows a fair engagement comparison, matching B. Translation status and assistant preference are not mentioned.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：We drew a mixed age range, from college students to working adults in their fifties。招募混合年龄段是同意项，对应 A。',
        en: 'Sentence 26: "We drew a mixed age range, from college students to working adults in their fifties". A mixed age range was recruited, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：We also reported the data privacy concerns that participants raised during interviews, even when they were small。如实记录隐私顾虑是同意项，对应 B。',
        en: 'Sentence 28: "We also reported the data privacy concerns that participants raised during interviews, even when they were small". Privacy concerns were reported, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：We must interpret results cautiously, and not claim the app teaches a language alone。谨慎解释结果是同意项，对应 C；D 的付费好评与 E 的只挑最佳片段在句 32、33 被明确否定。',
        en: 'Sentence 29: "We must interpret results cautiously, and not claim the app teaches a language". Cautious interpretation matches C. Paid reviews in D and selected clips in E are rejected in sentences 32 and 33.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'OK, let’s pick up where we left off on the app trial, and close out the task division.' },
    { speaker: 'sonia', text: 'Good. We still need to confirm who did what before the supervisor reads the report.' },
    { speaker: 'ava', text: 'I brought my notes on the ethics side, so I can map that part clearly.' },
    { speaker: 'thomas', text: 'I set up the trial schedule myself, booking the two test rooms and the sessions.' },
    { speaker: 'sonia', text: 'You also sent out the reminder emails the night before each session, if I remember right.' },
    { speaker: 'thomas', text: 'Yes, that was part of the schedule I arranged.' },
    { speaker: 'sonia', text: 'The control group analysis was mine to lead, checking daily opens and session length against the trial group.' },
    { speaker: 'ava', text: 'Did the assistant help with that control data too?' },
    { speaker: 'sonia', text: 'She cleaned the spreadsheets, but the control comparison itself was mine to lead.' },
    { speaker: 'ava', text: 'Then the ethics statement was mine to draft. I wrote the consent wording and privacy paragraph.' },
    { speaker: 'thomas', text: 'You cleared the privacy line with the university ethics officer before we shared it with participants.' },
    { speaker: 'ava', text: 'Correct. The officer only reviewed my draft, and did not write it himself.' },
    { speaker: 'sonia', text: 'The research assistant rechecked the retention figures, because some sessions overlapped and the raw counts looked uneven.' },
    { speaker: 'thomas', text: 'Did she spot any duplicate accounts?' },
    { speaker: 'sonia', text: 'She removed two duplicates, and left a note on which sessions they came from.' },
    { speaker: 'thomas', text: 'Now, how do we explain the trial length in the methods section?' },
    { speaker: 'sonia', text: 'It was four weeks. A shorter run would not show whether people came back after week one.' },
    { speaker: 'ava', text: 'But four weeks is still a short window, so we cannot claim long-term habit changes from it.' },
    { speaker: 'sonia', text: 'Let’s talk about what the retention numbers actually measured.' },
    { speaker: 'thomas', text: 'Retention means users who return after seven days, not those who finish the first session only.' },
    { speaker: 'ava', text: 'So the headline number is the seven-day return rate, rather than the first-day signups.' },
    { speaker: 'thomas', text: 'The control group reason deserves a clear sentence in the report.' },
    { speaker: 'sonia', text: 'They kept the old version so the groups could be compared fairly on engagement over one period.' },
    { speaker: 'thomas', text: 'Without that comparison, any rise in usage could just be excitement about a new app.' },
    { speaker: 'ava', text: 'I agree. Novelty alone often makes people open something more in the first week.' },
    { speaker: 'sonia', text: 'One thing we should flag is how the trial sample was recruited.' },
    { speaker: 'ava', text: 'We drew a mixed age range, from college students to working adults in their fifties.' },
    { speaker: 'thomas', text: 'That matters because app habits differ a lot by age group.' },
    { speaker: 'sonia', text: 'We also reported the data privacy concerns that participants raised during interviews, even when they were small.' },
    { speaker: 'ava', text: 'We must interpret results cautiously, and not claim the app teaches a language alone.' },
    { speaker: 'thomas', text: 'The app supports practice, but learning still depends on how often the user comes back.' },
    { speaker: 'sonia', text: 'I should mention what we deliberately did not do in the trial.' },
    { speaker: 'ava', text: 'We did not pay anyone for good reviews, which would have made the numbers look better than they were.' },
    { speaker: 'thomas', text: 'We did not select only the best clips. We included sessions where the app confused learners.' },
    { speaker: 'sonia', text: 'That keeps the write-up honest, even if the numbers are less impressive.' },
    { speaker: 'ava', text: 'Shall we go back through the task list one by one to make sure the matching is right?' },
    { speaker: 'thomas', text: 'The timetable side was mine, as I said.' },
    { speaker: 'sonia', text: 'The control group analysis was mine, and the retention numbers were rechecked by the assistant.' },
    { speaker: 'ava', text: 'The ethics draft was mine, with the officer only giving approval comments.' },
    { speaker: 'sonia', text: 'The seven-day return rate was higher in the trial group, but the gap narrowed by the fourth week.' },
    { speaker: 'ava', text: 'That narrowing suggests the design alone does not hold attention forever.' },
    { speaker: 'sonia', text: 'We should write that the effect was modest, rather than calling it a strong improvement.' },
    { speaker: 'thomas', text: 'The interviews gave us useful reasons behind the numbers.' },
    { speaker: 'ava', text: 'Some learners said the daily reminder helped them come back, while others found the exercises repetitive.' },
    { speaker: 'sonia', text: 'We need to separate what the app changed from what the users themselves brought to the trial.' },
    { speaker: 'thomas', text: 'A participant’s study habits still count for a lot, and we did not control for every difference.' },
    { speaker: 'ava', text: 'That is a limitation we should state plainly in the discussion section.' },
    { speaker: 'sonia', text: 'About the privacy side, participants asked whether their exercise history would be passed to third parties.' },
    { speaker: 'ava', text: 'We recorded those concerns in the interview notes, and answered them in the plain-language summary.' },
    { speaker: 'thomas', text: 'The statement makes clear that data stays in the team and is deleted after the study.' },
    { speaker: 'sonia', text: 'Do we need to add anything about participants who dropped out?' },
    { speaker: 'ava', text: 'We kept notes on why people stopped, and we report that alongside the retained users.' },
    { speaker: 'thomas', text: 'Early dropouts do not invalidate the trial, but they shape how we read the results.' },
    { speaker: 'sonia', text: 'Next, the report structure. The methods section should name the two groups and the four-week window.' },
    { speaker: 'ava', text: 'The results section leads with the seven-day return rate, and the interview comments explain it.' },
    { speaker: 'thomas', text: 'The discussion section states what the trial can and cannot claim.' },
    { speaker: 'sonia', text: 'I’ll draft that part, since the control analysis sits closest to it.' },
    { speaker: 'ava', text: 'I’ll attach the consent wording and the privacy paragraph from my ethics draft.' },
    { speaker: 'thomas', text: 'And the assistant can verify the retention counts one last time before submission.' },
    { speaker: 'sonia', text: 'One more check, were the age groups balanced enough to compare?' },
    { speaker: 'ava', text: 'Mostly. The sample was small, so age effects should be described as trends rather than fixed findings.' },
    { speaker: 'thomas', text: 'Fair. We will write that the mixed age range limits how far the results generalise.' },
    { speaker: 'sonia', text: 'Anything else before we split the writing up?' },
    { speaker: 'ava', text: 'Let’s make sure the final version avoids overstating what a single app trial can prove.' },
    { speaker: 'thomas', text: 'Agreed. Honest wording over a dramatic headline.' },
    { speaker: 'sonia', text: 'The control group used the old layout with fewer reminders, so their baseline habits stayed stable.' },
    { speaker: 'thomas', text: 'That gives us a fairer ground for measuring whether the new design changed behaviour.' },
    { speaker: 'ava', text: 'We should note in the appendix which exercises the two groups had in common.' },
  ],
  vocabulary: [
    {
      term: 'schedule', phonetic: '/ˈʃedjuːl/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '日程安排，时间表', en: 'the plan of session times and rooms' },
      usage: { zh: '可数；trial schedule、set up the schedule。动词 schedule。', en: 'Countable: trial schedule, set up the schedule. The verb is schedule.' },
      collocations: ['the trial schedule', 'set up a schedule', 'the session schedule'],
      example: { en: 'I set up the trial schedule and booked the test rooms.', zh: '我排定试用日程并预订了测试房间。' },
      listening: { zh: '三个音节，重音在第一音节；英式 /ˈʃed-/，美式 /ˈsked-/。', en: 'Three syllables, first-syllable stress; British /ˈʃed-/, American /ˈsked-/.' },
    },
    {
      term: 'control', phonetic: '/kənˈtrəʊl/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '对照组（不接触新方案的比较组）', en: 'the comparison group keeping the old version' },
      usage: { zh: '可数；control group、control analysis、control data。', en: 'Countable: control group, control analysis, control data.' },
      collocations: ['the control group', 'the control analysis', 'a control comparison'],
      example: { en: 'The control group kept the old app version throughout.', zh: '对照组全程使用旧版应用。' },
      listening: { zh: '两个音节，重音在第二音节，/tr/ 辅音丛。', en: 'Two syllables, second-syllable stress, /tr/ cluster.' },
    },
    {
      term: 'ethics', phonetic: '/ˈeθɪks/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '伦理（研究中对参与者的规范）', en: 'the rules about fair treatment of participants' },
      usage: { zh: '不可数；ethics statement、ethics officer、research ethics。形容词 ethical。', en: 'Uncountable: ethics statement, ethics officer, research ethics. The adjective is ethical.' },
      collocations: ['the ethics statement', 'the ethics officer', 'research ethics'],
      example: { en: 'I drafted the ethics statement and the privacy paragraph.', zh: '我起草了伦理说明和隐私段落。' },
      listening: { zh: '两个音节，重音在第一音节，/θ/ 清擦音。', en: 'Two syllables, first-syllable stress, voiceless /θ/.' },
    },
    {
      term: 'retention', phonetic: '/rɪˈtenʃn/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '留存（用户回访率）', en: 'the measure of users who keep returning to the app' },
      usage: { zh: '不可数；retention figures、retention rate、recheck retention。', en: 'Uncountable: retention figures, retention rate, recheck retention.' },
      collocations: ['the retention figures', 'the seven-day retention', 'check retention'],
      example: { en: 'The assistant rechecked the retention figures.', zh: '助理复核了留存数据。' },
      listening: { zh: '两个音节，重音在第二音节，/tenʃ/ 音节清晰。', en: 'Two syllables, second-syllable stress, clear /tenʃ/.' },
    },
    {
      term: 'return rate', phonetic: '/rɪˈtɜːn reɪt/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '回访率（再打开应用的比例）', en: 'the proportion of users who come back to the app' },
      usage: { zh: '可数；seven-day return rate、headline return rate。', en: 'Countable: seven-day return rate, headline return rate.' },
      collocations: ['the seven-day return rate', 'a higher return rate', 'the return rate'],
      example: { en: 'The headline number is the seven-day return rate.', zh: '头条指标是七天回访率。' },
      listening: { zh: 'return 重音在第二音节；rate 单音节长元音 /eɪ/。', en: 'Return is second-stressed; rate has one long /eɪ/.' },
    },
    {
      term: 'privacy', phonetic: '/ˈprɪvəsi/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '隐私（个人数据的保护）', en: 'the protection of personal participant data' },
      usage: { zh: '不可数；data privacy、privacy concerns、privacy paragraph。', en: 'Uncountable: data privacy, privacy concerns, privacy paragraph.' },
      collocations: ['data privacy', 'privacy concerns', 'the privacy paragraph'],
      example: { en: 'We reported the privacy concerns raised in interviews.', zh: '我们记录了访谈中提出的隐私顾虑。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /si/。', en: 'Three syllables, first-syllable stress, final /si/.' },
    },
    {
      term: 'cautiously', phonetic: '/ˈkɔːʃəsli/', partOfSpeech: 'adv.', sentenceIndex: 29,
      meaning: { zh: '谨慎地，留余地地', en: 'without claiming more than the evidence supports' },
      usage: { zh: '修饰动词；interpret cautiously、state cautiously。形容词 cautious。', en: 'Modifies a verb: interpret cautiously, state cautiously. The adjective is cautious.' },
      collocations: ['interpret cautiously', 'speak cautiously', 'read cautiously'],
      example: { en: 'We must interpret the results cautiously.', zh: '我们必须谨慎解释结果。' },
      listening: { zh: '三个音节，重音在第一音节，/ʃ/ 清擦音。', en: 'Three syllables, first-syllable stress, /ʃ/ fricative.' },
    },
  ],
  expressions: [
    {
      phrase: 'left off', sentenceIndex: 0,
      meaning: { zh: '上次停下的地方', en: 'the point where the earlier discussion stopped' },
      usage: { zh: 'leave off 的过去式；pick up where we left off。', en: 'Past of leave off: pick up where we left off.' },
      example: { en: 'Let’s pick up where we left off on the trial.', zh: '我们接着上次试用讨论往下谈。' },
    },
    {
      phrase: 'came back', sentenceIndex: 16,
      meaning: { zh: '回访，再打开（应用）', en: 'to return to use the app after a break' },
      usage: { zh: '不及物；users came back、come back after a week。', en: 'Intransitive: users came back, come back after a week.' },
      example: { en: 'A shorter run would not show whether people came back.', zh: '周期太短看不出用户是否回访。' },
    },
    {
      phrase: 'compared fairly', sentenceIndex: 22,
      meaning: { zh: '公平对照（两组条件可比）', en: 'compared where neither group has an unfair advantage' },
      usage: { zh: '被动短语；compared fairly on engagement、fairly compared across groups。', en: 'Passive phrase: compared fairly on engagement, fairly compared across groups.' },
      example: { en: 'The groups are compared fairly on engagement.', zh: '两组在参与度上公平对照。' },
    },
    {
      phrase: 'third parties', sentenceIndex: 47,
      meaning: { zh: '第三方（研究团队之外的机构）', en: 'outside organisations receiving participant data' },
      usage: { zh: '复数；pass data to third parties、share with third parties。', en: 'Plural: pass data to third parties, share with third parties.' },
      example: { en: 'Participants asked whether history would go to third parties.', zh: '参与者询问记录是否会交给第三方。' },
    },
    {
      phrase: 'dropped out', sentenceIndex: 50,
      meaning: { zh: '中途退出（试用）', en: 'to stop taking part before the trial ended' },
      usage: { zh: '不及物；participants dropped out、drop out early。名词 dropout。', en: 'Intransitive: participants dropped out, drop out early. The noun is dropout.' },
      example: { en: 'We keep notes on why participants dropped out.', zh: '我们记录参与者中途退出的原因。' },
    },
    {
      phrase: 'overstating', sentenceIndex: 63,
      meaning: { zh: '夸大（结论超出证据）', en: 'claiming more than the trial can prove' },
      usage: { zh: '动名词；avoid overstating、overstating the results。动词原形 overstate。', en: 'Gerund: avoid overstating, overstating the results. The base verb is overstate.' },
      example: { en: 'The final version avoids overstating what the trial proves.', zh: '终稿避免夸大试用能证明的内容。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题抓自主动词与主语', en: 'Match verbs and subjects' },
      body: {
        zh: '第 21–24 题把任务分给三人加助理。分工句常以第一人称出现：I set up、mine to lead、mine to draft、assistant rechecked。听到自主动词先记说话人，再把任务对上；被否定的参与（助理只清洗表格、官员只审阅草稿）不是答案。',
        en: 'Items 21–24 split tasks between three people and the assistant. Ownership often appears in first person: I set up, mine to lead, mine to draft, assistant rechecked. Note the speaker before the verb, then match the task. Denied involvement, the assistant cleaning sheets, the officer reviewing drafts, is not the answer.',
      },
    },
    {
      title: { zh: '单选题盯住定义句', en: 'Singles target definition sentences' },
      body: {
        zh: '第 26 题问留存指标，定义句是 Retention here means…，答案取 means 之后；第 27 题问对照组理由，答案跟在 so 后面的 fair comparison。听到 means、so、because 时，后半句优先记录。',
        en: 'Item 26 asks the retention measure, defined in Retention here means, so take what follows means; item 27 asks the control reason, after so in fair comparison. Record the clause after means, so, or because first.',
      },
    },
    {
      title: { zh: '多选区分同意项与被否定做法', en: 'Split agreed points from rejected practices' },
      body: {
        zh: '第 28–30 题选三人同意的三点：混合年龄段、记录隐私顾虑、谨慎解释结果。录音里明确否定的付费好评、只挑最佳片段是干扰项；听到 did not pay、did not select 直接排除。',
        en: 'Items 28–30 choose three agreed points: mixed age range, reported privacy concerns, cautious interpretation. Explicitly rejected paid reviews and selected clips are distractors; rule them out after did not pay or did not select.',
      },
    },
  ],
};
