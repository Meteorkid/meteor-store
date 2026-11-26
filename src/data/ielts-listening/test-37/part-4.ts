import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 37 · Part 4 — 讲座：群体心理学。原创仿真材料，非官方真题。
 *
 * 结构：开场概览群体对行为的塑造（单选 31–34）→ 从众实验与原因 → 群体决策缺陷与群体思维 →
 * 角色分化；后半段复述笔记要点（填空 35–40）：实验任务、共识倾向、选项收窄、任务与社交角色、
 * 共同目标、辩论与信任的平衡。单选块在前，填空块在后，题块顺序与讲座顺序一致。
 */
export const test37Part4: ListeningLesson = {
  slug: 'test-37-part-4',
  part: 4,
  status: 'published',
  title: { zh: '群体心理学', en: 'The psychology of groups' },
  summary: {
    zh: '一场关于群体行为的讲座：群体对个体的塑造不亚于规则与奖励；讲解从众实验的设计与动机、群体决策中表面一致掩盖疑虑的群体思维风险、强势成员收窄选项的影响，以及任务角色与社交角色的分化；后半段复述实验任务、共识倾向、共同目标、辩论与信任平衡等笔记要点。',
    en: 'A lecture on group behaviour: groups shape individuals as strongly as rules or rewards do. It covers conformity experiments and motives, the groupthink risk behind apparent agreement, a dominant member narrowing the options, and task versus social roles; the latter half restates the note points on the test, agreement, goals and the balance of debate and trust.',
  },
  accent: { zh: '讲师为美式口音，语速平稳，关键术语会重复一遍。', en: 'The lecturer speaks with an American accent at a steady pace, repeating the key terms.' },
  speechRate: '+8%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 31,
          stem: 'What is the lecturer’s main point about group behaviour?',
          options: [
            { key: 'A', text: 'Groups shape behaviour as strongly as rules or rewards.' },
            { key: 'B', text: 'Groups always decide more wisely than any individual member.' },
            { key: 'C', text: 'Groups mainly follow formal written rules to make decisions.' },
          ],
        },
        {
          number: 32,
          stem: 'Why do people conform to group opinion?',
          options: [
            { key: 'A', text: 'They are paid to match the group position.' },
            { key: 'B', text: 'They want to avoid standing out and assume the group may be right.' },
            { key: 'C', text: 'They are forced to agree by the group leader.' },
          ],
        },
        {
          number: 33,
          stem: 'What can go wrong in group decision-making?',
          options: [
            { key: 'A', text: 'Too many written objections slow the vote down.' },
            { key: 'B', text: 'A unanimous-looking choice may hide unspoken doubts and risk.' },
            { key: 'C', text: 'Quiet members are given too much influence over the final option.' },
          ],
        },
        {
          number: 34,
          stem: 'What does role differentiation contribute to a team?',
          options: [
            { key: 'A', text: 'It lets a large group cover more ground than one member could.' },
            { key: 'B', text: 'It removes the need for shared goals among members.' },
            { key: 'C', text: 'It pushes every member to take on the same task role.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Conformity experiments used a simple', cells: [[{ blank: 35 }, { text: ' test.' }]] },
        { lead: 'Group decisions tend to seek shared', cells: [[{ blank: 36 }, { text: '.' }]] },
        { lead: 'A dominant member can narrow the group’s', cells: [[{ blank: 37 }, { text: '.' }]] },
        { lead: 'Roles split into task and', cells: [[{ blank: 38 }, { text: ' roles.' }]] },
        { lead: 'Teams need clear shared', cells: [[{ blank: 39 }, { text: ' to stay aligned.' }]] },
        { lead: 'Effective teamwork balances debate and', cells: [[{ blank: 40 }, { text: '.' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['A'], evidence: 2,
      explanation: {
        zh: '定位句 2：The central point is that groups shape behaviour as strongly as rules or rewards do。群体对行为的塑造不亚于规则或奖励，对应 A。B 的 always 与讲座中群体思维风险相反，C 的正式书面规则在录音中没有依据。',
        en: 'Sentence 2: "The central point is that groups shape behaviour as strongly as rules or rewards do", matching A. Always deciding more wisely contradicts the groupthink risk, and formal written rules are not claimed.',
      },
    },
    {
      number: 32, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：The main reason is that people want to avoid standing out in front of the others。从众一是怕突出，二是认为群体可能掌握自己漏掉的信息，对应 B。A 的报酬和 C 的被强制在录音中均未出现。',
        en: 'Sentence 11: "The main reason is that people want to avoid standing out in front of the others". People conform to avoid standing out and assume the group may be right, matching B. Payment and forced agreement are not mentioned.',
      },
    },
    {
      number: 33, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：A decision that feels unanimous may still rest on a few unspoken doubts。第 19 句补充，当所有人都不表态时，团队可能采取有风险的行动；看似一致的选择可能藏着未说出的疑虑与风险，对应 B。A 的书面异议拖慢投票与 C 的安静成员影响过大在录音中没有依据。',
        en: 'Sentence 18: "A decision that feels unanimous may still rest on a few unspoken doubts". Sentence 19 adds that when everyone holds back disagreement, the group can commit to a risky course. A unanimous-looking choice hides doubts and risk, matching B. Written objections slowing votes and quiet members having too much influence are not claimed.',
      },
    },
    {
      number: 34, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：Role differentiation lets a large group cover more ground than any single member could。角色分化让团队比单个成员覆盖更多工作，对应 A。B 的取消共同目标与句 39 相反，C 的全员同一任务角色与角色分化相反。',
        en: 'Sentence 30: "Role differentiation lets a large group cover more ground than any single member could", matching A. Removing shared goals contradicts item 39, and one shared task role contradicts differentiation itself.',
      },
    },
    {
      number: 35, accepted: ['line'], evidence: 34,
      explanation: {
        zh: '定位句 34：The classic conformity experiments used a simple line test。实验任务是线条长度判断，空前是 simple，填 line；test 已印在卷面上。',
        en: 'Sentence 34: "The classic conformity experiments used a simple line test". The task was a line comparison; simple precedes the gap, and test is printed.',
      },
    },
    {
      number: 36, accepted: ['agreement'], evidence: 35,
      explanation: {
        zh: '定位句 35：Group decisions tend to seek shared agreement rather than a single leader choice。群体决策追求共识，空前是 shared，填 agreement。',
        en: 'Sentence 35: "Group decisions tend to seek shared agreement rather than a single leader choice". Groups seek shared agreement; shared precedes the gap, so write agreement.',
      },
    },
    {
      number: 37, accepted: ['options'], evidence: 36,
      explanation: {
        zh: '定位句 36：A dominant member can narrow the group options by speaking first and ruling alternatives out。强势成员收窄的是群体的可选方案，填复数 options。',
        en: 'Sentence 36: "A dominant member can narrow the group options by speaking first and ruling alternatives out". What is narrowed is the group’s options; write the plural options.',
      },
    },
    {
      number: 38, accepted: ['social'], evidence: 37,
      explanation: {
        zh: '定位句 37：Roles in a team split into task roles and social roles, each supporting the other。角色分为任务角色与社交角色，空前是 task and，填 social。',
        en: 'Sentence 37: "Roles in a team split into task roles and social roles, each supporting the other". Roles split into task and social; the gap follows task and, so write social.',
      },
    },
    {
      number: 39, accepted: ['goals'], evidence: 38,
      explanation: {
        zh: '定位句 38：Teams need clear shared goals so that every member works toward the same outcome。团队对齐需要清晰的共同目标，填复数 goals。',
        en: 'Sentence 38: "Teams need clear shared goals so that every member works toward the same outcome". Alignment needs shared goals; write the plural goals.',
      },
    },
    {
      number: 40, accepted: ['trust'], evidence: 39,
      explanation: {
        zh: '定位句 39：Effective teamwork balances open debate and mutual trust。有效团队平衡公开辩论与相互信任，空后是句号，填 trust。',
        en: 'Sentence 39: "Effective teamwork balances open debate and mutual trust". Effective teamwork balances debate and trust; the gap ends the sentence, so write trust.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'When you join a new group, how quickly do you change your own view to match the room?' },
    { speaker: 'lecturer', text: 'This lecture looks at the pull toward one shared position among individual members.' },
    { speaker: 'lecturer', text: 'The central point is that groups shape behaviour as strongly as rules or rewards do.' },
    { speaker: 'lecturer', text: 'We will cover conformity in experiments, the faults of group decisions, the roles people take, and what makes teamwork work.' },
    { speaker: 'lecturer', text: 'Before the details, the broad conclusions are worth stating in order.' },
    { speaker: 'lecturer', text: 'Groups do not only decide better; they also tend to pull dissenting views toward the centre.' },
    { speaker: 'lecturer', text: 'The same pressure that helps a team agree can blind it to risky choices.' },
    { speaker: 'lecturer', text: 'Once members split into roles, the team runs more smoothly and its work becomes easier to coordinate.' },
    { speaker: 'lecturer', text: 'The first classic study asked people to judge the length of simple line drawings.' },
    { speaker: 'lecturer', text: 'Each participant sat among several others who gave the same clearly wrong answer.' },
    { speaker: 'lecturer', text: 'Many participants conformed, choosing the wrong answer rather than disagreeing with the group.' },
    { speaker: 'lecturer', text: 'The main reason is that people want to avoid standing out in front of the others.' },
    { speaker: 'lecturer', text: 'They also assume the group must know something that they missed in the room.' },
    { speaker: 'lecturer', text: 'The effect grows when the group is large and the question feels uncertain to the participant.' },
    { speaker: 'lecturer', text: 'Researchers call this shift toward the common answer conformity.' },
    { speaker: 'lecturer', text: 'Conformity shows up in meetings, classrooms and online discussion groups alike.' },
    { speaker: 'lecturer', text: 'Now consider how a group reaches a decision rather than a single view.' },
    { speaker: 'lecturer', text: 'Groups often aim for shared agreement, so the discussion avoids reopening old disagreements.' },
    { speaker: 'lecturer', text: 'A decision that feels unanimous may still rest on a few unspoken doubts.' },
    { speaker: 'lecturer', text: 'When everyone holds back disagreement, the group can commit to a risky course.' },
    { speaker: 'lecturer', text: 'This flaw is often called groupthink, and it appears in teams that value harmony too highly.' },
    { speaker: 'lecturer', text: 'A dominant member can narrow the discussion by speaking first and rejecting alternatives.' },
    { speaker: 'lecturer', text: 'Quiet members may stay silent, so the final option looks broader than it really was.' },
    { speaker: 'lecturer', text: 'Groups that write down objections before voting make safer decisions overall.' },
    { speaker: 'lecturer', text: 'Even a short record of dissenting views protects the team from one-sided choices.' },
    { speaker: 'lecturer', text: 'Beyond decisions, groups divide work because members differ in skills and style.' },
    { speaker: 'lecturer', text: 'Some people push the task forward, while others keep the relationships working.' },
    { speaker: 'lecturer', text: 'The first kind fills task roles, such as leading the plan or checking the facts.' },
    { speaker: 'lecturer', text: 'The second kind fills social roles, such as easing tension or recognising each person’s effort.' },
    { speaker: 'lecturer', text: 'Teams that recognise both kinds of role retain their members longer.' },
    { speaker: 'lecturer', text: 'Role differentiation lets a large group cover more ground than any single member could.' },
    { speaker: 'lecturer', text: 'A team without clear roles tends to repeat the same work and miss the gaps.' },
    { speaker: 'lecturer', text: 'Now the notes section follows, so keep the points I restate in mind.' },
    { speaker: 'lecturer', text: 'These restated sentences are the ones you should match to the note headings.' },
    { speaker: 'lecturer', text: 'The classic conformity experiments used a simple line test, asking which line matched a standard.' },
    { speaker: 'lecturer', text: 'Group decisions tend to seek shared agreement rather than a single leader choice.' },
    { speaker: 'lecturer', text: 'A dominant member can narrow the group options by speaking first and ruling alternatives out.' },
    { speaker: 'lecturer', text: 'Roles in a team split into task roles and social roles, each supporting the other.' },
    { speaker: 'lecturer', text: 'Teams need clear shared goals so that every member works toward the same outcome.' },
    { speaker: 'lecturer', text: 'Effective teamwork balances open debate and mutual trust, so people can disagree without fear.' },
    { speaker: 'lecturer', text: 'The best teams invite objection early, and they keep the reasons for each decision visible.' },
    { speaker: 'lecturer', text: 'Members who feel heard are more likely to commit to the final choice afterwards.' },
    { speaker: 'lecturer', text: 'Trust grows when the group shows that disagreement will not be punished.' },
    { speaker: 'lecturer', text: 'Debate should not turn into a contest where the loudest voice wins the room.' },
    { speaker: 'lecturer', text: 'These threads meet in a practical question about how a group can disagree without splitting.' },
    { speaker: 'lecturer', text: 'Conformity pulls members toward the common answer, and groups need safeguards against that pull.' },
    { speaker: 'lecturer', text: 'Groupthink follows when harmony is valued more than honest disagreement.' },
    { speaker: 'lecturer', text: 'Roles split the workload, and shared goals keep the members aligned.' },
    { speaker: 'lecturer', text: 'Balance debate and trust, and a group can decide more wisely than its loudest member.' },
    { speaker: 'lecturer', text: 'In the next session we will look at how leaders design teams with these patterns in mind.' },
    { speaker: 'lecturer', text: 'That is all for this session. Try the practice task before we meet again.' },
  ],
  vocabulary: [
    {
      term: 'conformity', phonetic: '/kənˈfɔːməti/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '从众，与群体保持一致的倾向', en: 'the tendency to match the group’s views and choices' },
      usage: { zh: '不可数；social conformity、the pressure of conformity。动词是 conform。', en: 'Uncountable: social conformity. The verb is conform.' },
      collocations: ['social conformity', 'the pressure of conformity', 'conformity experiments'],
      example: { en: 'The experiments measured conformity in a group setting.', zh: '实验测量群体环境中的从众行为。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈfɔː/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'dissenting', phonetic: '/dɪˈsentɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 5,
      meaning: { zh: '持异议的，与多数意见不同的', en: 'holding a view that differs from the majority' },
      usage: { zh: '形容词；dissenting views、a dissenting member。动词是 dissent。', en: 'Adjective: dissenting views. The verb is dissent.' },
      collocations: ['dissenting views', 'a dissenting member', 'record dissenting views'],
      example: { en: 'The group records its dissenting views before voting.', zh: '群体在投票前记下不同意见。' },
      listening: { zh: '重音在第二音节 /ˈsen/；开头 /dɪ/ 很弱。', en: 'Stress the second syllable; the opening /dɪ/ is weak.' },
    },
    {
      term: 'unanimous', phonetic: '/juːˈnænɪməs/', partOfSpeech: 'adj.', sentenceIndex: 18,
      meaning: { zh: '一致同意的，全员赞成的', en: 'fully agreed by every member, with no recorded objection' },
      usage: { zh: '形容词；a unanimous decision、reach a unanimous view。', en: 'Adjective: a unanimous decision, reach a unanimous view.' },
      collocations: ['a unanimous decision', 'unanimous agreement', 'seem unanimous'],
      example: { en: 'The vote looked unanimous, though doubts remained unspoken.', zh: '投票看似一致，疑虑却没说出口。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈnæn/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'groupthink', phonetic: '/ˈɡruːpθɪŋk/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '群体思维（为维护和谐压制异议而决策失误）', en: 'the pressure for harmony that stops members raising objections' },
      usage: { zh: '不可数；the groupthink flaw、fall into groupthink。复合词。', en: 'Uncountable: fall into groupthink. A compound word.' },
      collocations: ['the groupthink flaw', 'avoid groupthink', 'groupthink in teams'],
      example: { en: 'Teams that value harmony too highly are prone to groupthink.', zh: '过度看重和谐的团队容易陷入群体思维。' },
      listening: { zh: '重音在第一个词 group；think 读 /θɪŋk/。', en: 'Stress the first part group; think is /θɪŋk/.' },
    },
    {
      term: 'differentiation', phonetic: '/ˌdɪfəˌrenʃiˈeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '角色分化，分工区分', en: 'the splitting of work into distinct roles by skill or style' },
      usage: { zh: '不可数；role differentiation。形容词是 differentiated。', en: 'Uncountable: role differentiation. The adjective is differentiated.' },
      collocations: ['role differentiation', 'task differentiation', 'the differentiation of roles'],
      example: { en: 'Role differentiation lets the team cover more tasks.', zh: '角色分化让团队能覆盖更多任务。' },
      listening: { zh: '六个音节，重音在最后 /ˈeɪ/。', en: 'Six syllables with stress on the final /eɪ/.' },
    },
    {
      term: 'aligned', phonetic: '/əˈlaɪnd/', partOfSpeech: 'adj.', sentenceIndex: 47,
      meaning: { zh: '方向一致的，目标对齐的', en: 'working toward the same outcome as the other members' },
      usage: { zh: '形容词；stay aligned、aligned with the goals。动词是 align。', en: 'Adjective: stay aligned, aligned with goals. The verb is align.' },
      collocations: ['stay aligned', 'aligned with the goals', 'keep members aligned'],
      example: { en: 'Shared goals keep every member aligned with the outcome.', zh: '共同目标让每位成员与结果保持对齐。' },
      listening: { zh: '单音节形容词，/ə/ 开头很弱，结尾 /nd/ 读出来。', en: 'One-syllable adjective with a weak /ə/; pronounce the final /nd/.' },
    },
  ],
  expressions: [
    {
      phrase: 'pull toward', sentenceIndex: 1,
      meaning: { zh: '把……拉向，使趋向', en: 'to move someone’s view closer to a shared position' },
      usage: { zh: 'pull views toward the centre；后接方向或对象。', en: 'Pull views toward the centre; followed by a direction or object.' },
      example: { en: 'Groups pull individual members toward one shared position.', zh: '群体把个体成员拉向同一个立场。' },
    },
    {
      phrase: 'standing out', sentenceIndex: 11,
      meaning: { zh: '突出，显得与他人不同', en: 'to be visibly different from the rest of the group' },
      usage: { zh: 'avoid standing out；现在分词短语，后接 in front of。', en: 'Avoid standing out; present participle followed by in front of.' },
      example: { en: 'People conform to avoid standing out in the group.', zh: '人们从众是为了避免在群体里显得突出。' },
    },
    {
      phrase: 'holds back disagreement', sentenceIndex: 19,
      meaning: { zh: '把异议压下，不表达反对', en: 'to keep an objection to oneself rather than saying it' },
      usage: { zh: 'hold back + 名词；与 voice disagreement 相对。', en: 'Hold back plus a noun; the opposite is voice disagreement.' },
      example: { en: 'When everyone holds back disagreement, the team commits to a risky course.', zh: '人人压下异议时，团队会走上有风险的路线。' },
    },
    {
      phrase: 'cover more ground', sentenceIndex: 30,
      meaning: { zh: '覆盖更多工作范围，处理更多事项', en: 'to deal with a wider range of tasks than one person could' },
      usage: { zh: '习语；cover ground 在工作语境指处理内容。', en: 'Idiom: cover ground means deal with a range of work.' },
      example: { en: 'A differentiated team covers more ground than one member alone.', zh: '分工后的团队比单个成员覆盖更多工作。' },
    },
    {
      phrase: 'split into', sentenceIndex: 37,
      meaning: { zh: '划分为，分成（若干类别）', en: 'to divide a set of roles or tasks into kinds' },
      usage: { zh: 'split into A and B；后接分类名词。', en: 'Split into A and B; followed by category nouns.' },
      example: { en: 'Team roles split into task roles and social roles.', zh: '团队角色分为任务角色与社交角色。' },
    },
    {
      phrase: 'feel heard', sentenceIndex: 41,
      meaning: { zh: '感到被倾听，意见被重视', en: 'to sense that one’s view has been taken seriously' },
      usage: { zh: 'feel + 过去分词；members who feel heard。', en: 'Feel plus past participle: members who feel heard.' },
      example: { en: 'Members who feel heard commit to the final choice afterwards.', zh: '感到被倾听的成员之后会认同最终选择。' },
    },
  ],
  tips: [
    {
      title: { zh: '概览句先答单选，复述段再填笔记', en: 'Overview sentences feed the choice items' },
      body: {
        zh: 'Part 4 开头几句话给出总体结论，31 到 34 题的答案集中在概览段；35 到 40 题的术语在后面复述段。听到 Now the notes section follows 这类路标时，再开始盯填空答案词。',
        en: 'The opening sentences give the overview, and items 31 to 34 sit there; the terms for 35 to 40 appear in the restatement section later. Start watching for completion answers only after a signpost such as Now the notes section follows.',
      },
    },
    {
      title: { zh: '预判词性再等答案词', en: 'Predict the word class before listening' },
      body: {
        zh: '第 35 题空前是 simple，填名词；第 38 题空前是 task and，填并列的形容词；第 40 题空前是 debate and，填与 debate 并列的名词。听前把词性写在空格旁，录音里只等那一类词。',
        en: 'In item 35 simple precedes a noun; item 38 follows task and, expecting a parallel adjective; item 40 follows debate and, expecting a parallel noun. Note the predicted word class beside each gap before listening.',
      },
    },
    {
      title: { zh: '警惕绝对化选项', en: 'Watch for absolute options' },
      body: {
        zh: '单选干扰项常用 always、must、mainly 这类绝对词。讲座讲的是群体倾向与条件性结论，不做全称判断；听到选项里的 always、forced、removed 时先标记，回到录音核对是否有同等强度的依据。',
        en: 'Choice distractors often use absolutes such as always, must and mainly. The lecture speaks in tendencies and conditional conclusions, so mark absolutes first and check the recording for equally strong evidence before choosing.',
      },
    },
  ],
};
