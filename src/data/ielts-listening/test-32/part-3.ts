import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 32 · Part 3 — 包装设计项目讨论（三人讨论）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：四项分工配对 → 主盒材料 → 测试反馈与改设计 → 下一步样本；
 * 多选在结尾段挑出三项设计目标。题块顺序与录音一致。
 */
export const test32Part3: ListeningLesson = {
  slug: 'test-32-part-3',
  part: 3,
  status: 'published',
  title: { zh: '包装设计项目讨论', en: 'Discussing a packaging design project' },
  summary: {
    zh: '三位项目成员评审新款零食盒的包装：Neerja 主张用再生纸板，Ryan 提出成本顾虑，Aria 主持用户测试，项目助理起草修改笔记。主盒最终选定再生纸板，外层光面涂布只留作展示套；上周测试里老年顾客觉得封条太紧，于是加宽拉舌并压痕撕口。下一步先做修订样本再进第二轮测试；设计目标包括方便老年顾客开启、可穿过信箱投递、背面带清晰回收标识，光面涂布、付费品牌调查与满版侧面宣传均被排除。',
    en: 'Three members review the snack-box packaging: Neerja backs recycled cardboard, Ryan raises cost, Aria leads testing, the assistant drafts notes. The main box uses recycled cardboard; the tight seal is widened after older testers struggled. Next: a revised sample for another round. Goals: easy opening for older customers, letterbox posting, a clear recycling label.',
  },
  accent: { zh: 'Neerja 是印度口音英语，Ryan 是英国口音英语，Aria 是美国口音英语。', en: 'Neerja speaks Indian English, Ryan British English, and Aria American English.' },
  speechRate: '+8%',
  cast: [
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'ryan', label: 'RYAN', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Match each task with the person who handles it. Write the correct letter, A, B, C, D or E next to questions 21–24.',
      options: [
        { key: 'A', text: 'Neerja' },
        { key: 'B', text: 'Ryan' },
        { key: 'C', text: 'Aria' },
        { key: 'D', text: 'the project assistant' },
        { key: 'E', text: 'the recycling officer' },
      ],
      items: [
        { number: 21, text: 'argues for recycled cardboard' },
        { number: 22, text: 'raises the cost concern' },
        { number: 23, text: 'leads the user testing' },
        { number: 24, text: 'drafts the revision notes' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What material is chosen for the main box?',
          options: [
            { key: 'A', text: 'recycled cardboard' },
            { key: 'B', text: 'glossy coated cardboard' },
            { key: 'C', text: 'plain untreated softwood board' },
          ],
        },
        {
          number: 26,
          stem: 'Why did the design change after testing?',
          options: [
            { key: 'A', text: 'older customers found the seal hard to open' },
            { key: 'B', text: 'the box did not fit through the letterbox' },
            { key: 'C', text: 'the printed label faded under shop lights' },
          ],
        },
        {
          number: 27,
          stem: 'What is the team’s next step?',
          options: [
            { key: 'A', text: 'produce a revised sample for another test round' },
            { key: 'B', text: 'order a full season’s stock from the mill' },
            { key: 'C', text: 'run a paid survey of well known brands' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE design goals does the team agree on? Choose three letters, A–E.',
      select: 3,
      stem: 'Which THREE design goals does the team agree on?',
      options: [
        { key: 'A', text: 'easy for older customers to open' },
        { key: 'B', text: 'can be posted through a letterbox' },
        { key: 'C', text: 'carries a clear recycling label' },
        { key: 'D', text: 'glossy coated cardboard finish' },
        { key: 'E', text: 'paid brand-name survey before launch' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：I would push for recycled cardboard. Customers expect a greener option。主张再生纸板的是 Neerja，对应 A。',
        en: 'Sentence 6: "I would push for recycled cardboard. Customers expect a greener option". Neerja argues for recycled cardboard, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 8,
      explanation: {
        zh: '定位句 8：I have to raise the cost concern. Recycled cardboard runs about ten percent higher。提出成本顾虑的是 Ryan，对应 B。',
        en: 'Sentence 8: "I have to raise the cost concern. Recycled cardboard runs about ten percent higher". Ryan raises the cost concern, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 11,
      explanation: {
        zh: '定位句 11：Then the user testing. I will lead that session with regular customers。主持用户测试的是 Aria，对应 C。',
        en: 'Sentence 11: "Then the user testing. I will lead that session with regular customers". Aria leads the testing, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 13,
      explanation: {
        zh: '定位句 13：The project assistant will draft the revision notes after the first round。起草修改笔记的是项目助理，对应 D。',
        en: 'Sentence 13: "The project assistant will draft the revision notes after the first round". The project assistant drafts the notes, matching D.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 22,
      explanation: {
        zh: '定位句 22：So the main box is recycled cardboard, and the coated finish stays only for the display sleeve。主盒选定再生纸板，对应 A。B 的光面涂布只留作展示套，C 的软木板未出现。',
        en: 'Sentence 22: "So the main box is recycled cardboard, and the coated finish stays only for the display sleeve". Recycled cardboard matches A. Glossy coating is limited to the sleeve, and softwood board is not mentioned.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 28,
      explanation: {
        zh: '定位句 28：several older customers struggled with the sealed flap。改设计是因为老年顾客觉得封条难开，对应 A。B 的信箱尺寸在句 25 已满足，C 的褪色是次要担忧。',
        en: 'Sentence 28: "several older customers struggled with the sealed flap". The change follows the hard-to-open seal for older customers, matching A. The letterbox fit already works in sentence 25, and fading is a minor worry.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 45,
      explanation: {
        zh: '定位句 45：The assistant turns the notes into a revised sample for another test round。下一步是修订样本再测一轮，对应 A。B 的整季下单要等第二轮通过，C 的付费调查被句 42 否定。',
        en: 'Sentence 45: "The assistant turns the notes into a revised sample for another test round". A revised sample matches A. Full-season stock waits for the next round, and the paid survey is rejected in sentence 42.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 62,
      explanation: {
        zh: '定位句 62：The revised seal should work for older customers too, since they were the weakest testers。方便老年顾客开启是约定目标，对应 A。',
        en: 'Sentence 62: "The revised seal should work for older customers too, since they were the weakest testers". Easy opening for older customers matches A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 50,
      explanation: {
        zh: '定位句 50：The letterbox depth is non-negotiable once online orders become the main channel。可穿信箱投递是约定目标，对应 B。句 25 也说明信箱深度。',
        en: 'Sentence 50: "The letterbox depth is non-negotiable once online orders become the main channel". Letterbox posting matches B. Sentence 25 confirms the depth.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 63,
      explanation: {
        zh: '定位句 63：The recycling label stays on the back, so it can be read without opening the box。背面清晰回收标识是约定目标，对应 C。D 的光面涂布在句 39–40 被排除，E 的付费品牌调查在句 41–43 被否定。',
        en: 'Sentence 63: "The recycling label stays on the back, so it can be read without opening the box". A clear recycling label matches C. Glossy coating is ruled out in sentences 39–40, and the paid survey in 41–43.',
      },
    },
  ],
  transcript: [
    { speaker: 'ryan', text: 'Thanks for coming in. Let us settle the packaging design for the new snack box today.' },
    { speaker: 'neerja', text: 'Good. We have two drafts, and the brief lists strength, cost and recyclability.' },
    { speaker: 'aria', text: 'Before we start, who owns which part of the decision?' },
    { speaker: 'ryan', text: 'I will summarise the supplier quotes, and Aria can take the user testing later.' },
    { speaker: 'neerja', text: 'The four tasks need a clear owner before we hand anything to production.' },
    { speaker: 'ryan', text: 'First, which side supports recycled cardboard for the main box?' },
    { speaker: 'neerja', text: 'I would push for recycled cardboard. Customers expect a greener option, and the mill can supply the weight we need.' },
    { speaker: 'aria', text: 'The recycled stock feels rougher than coated paper, but that may read as natural rather than cheap.' },
    { speaker: 'ryan', text: 'I have to raise the cost concern. Recycled cardboard runs about ten percent higher than standard stock.' },
    { speaker: 'neerja', text: 'The gap narrows if we order a full season rather than a trial batch.' },
    { speaker: 'ryan', text: 'The supplier can confirm that rate once the box size is fixed.' },
    { speaker: 'aria', text: 'Then the user testing. I will lead that session with regular customers from the town centre.' },
    { speaker: 'neerja', text: 'Recruit a mix of ages, so we do not hear only from students buying lunch boxes.' },
    { speaker: 'ryan', text: 'The project assistant will draft the revision notes after the first round.' },
    { speaker: 'aria', text: 'I will send the tester feedback to the assistant once the session is done.' },
    { speaker: 'neerja', text: 'The recycling officer will check that our claims match local rules.' },
    { speaker: 'ryan', text: 'That covers the four tasks. Now the material choice for the main box.' },
    { speaker: 'aria', text: 'The first draft used glossy coated cardboard, sharp on a shelf but hard to recycle.' },
    { speaker: 'neerja', text: 'The second draft moved to plain recycled cardboard, with a simple brown finish.' },
    { speaker: 'ryan', text: 'Strength matters too. The box must hold five snack packs without crushing under a stack.' },
    { speaker: 'neerja', text: 'The recycled stock passed the drop test in the supplier sample.' },
    { speaker: 'aria', text: 'I lean towards the recycled cardboard, provided the seal is easy to use.' },
    { speaker: 'ryan', text: 'So the main box is recycled cardboard, and the coated finish stays only for the display sleeve.' },
    { speaker: 'neerja', text: 'That keeps the green message visible without weakening the outer carton.' },
    { speaker: 'ryan', text: 'What about the size and shape for posting?' },
    { speaker: 'aria', text: 'The revised depth lets the parcel slide through a standard letterbox.' },
    { speaker: 'neerja', text: 'Online customers should not need someone at home to receive the box.' },
    { speaker: 'ryan', text: 'Now the user testing from last week. What came back?' },
    { speaker: 'aria', text: 'Most testers opened the box quickly, but several older customers struggled with the sealed flap.' },
    { speaker: 'neerja', text: 'The seal was too tight. It kept the box fresh, but defeated the easy snack pack.' },
    { speaker: 'ryan', text: 'That explains the design change. We widen the pull tab and score the flap cleanly.' },
    { speaker: 'aria', text: 'The revised seal should open with one hand, without a knife or scissors.' },
    { speaker: 'neerja', text: 'We should mark the recycling route clearly on the back panel.' },
    { speaker: 'ryan', text: 'A plain recycling label says what the box is made of and where it goes after use.' },
    { speaker: 'aria', text: 'The current draft prints our brand name in large letters on every side.' },
    { speaker: 'neerja', text: 'That looks crowded, and it hides the material information from people who care.' },
    { speaker: 'ryan', text: 'I agree. Cut the side branding back to a small mark near the bottom edge.' },
    { speaker: 'aria', text: 'What did testers say about the hand-drawn illustration on the front?' },
    { speaker: 'neerja', text: 'It was liked, but it is not a brief requirement. We keep it only if the layout leaves room.' },
    { speaker: 'ryan', text: 'The supplier quoted two finishes. Glossy coating adds shine but complicates recycling.' },
    { speaker: 'neerja', text: 'We have ruled out the glossy coating for the main carton.' },
    { speaker: 'aria', text: 'Should we run a paid brand survey before production?' },
    { speaker: 'ryan', text: 'That is not needed. The budget stays with real users, and tester feedback is enough.' },
    { speaker: 'neerja', text: 'A paid survey would ask about brand names, not how the box opens or breaks down.' },
    { speaker: 'aria', text: 'Right. The next step after this meeting matters most.' },
    { speaker: 'ryan', text: 'The assistant turns the notes into a revised sample for another test round.' },
    { speaker: 'neerja', text: 'If the second round is clean, production can order the first season stock.' },
    { speaker: 'aria', text: 'I will prepare the tester invitation and the checklist for the sample.' },
    { speaker: 'neerja', text: 'I will check the recycled content claim against the officer’s guidance.' },
    { speaker: 'ryan', text: 'Keep the weight inside the tested range, so the box does not bulge in the post.' },
    { speaker: 'aria', text: 'The letterbox depth is non-negotiable once online orders become the main channel.' },
    { speaker: 'neerja', text: 'We should note the winner and the rejected options in the project folder.' },
    { speaker: 'ryan', text: 'Rejected for now are the glossy coating, the tight seal and the full side branding.' },
    { speaker: 'aria', text: 'Also rejected is relying on a paid survey instead of direct tester feedback.' },
    { speaker: 'neerja', text: 'The front illustration stays optional until the layout settles.' },
    { speaker: 'ryan', text: 'We can revisit the cost gap once the supplier confirms the full season rate.' },
    { speaker: 'aria', text: 'The first revised sample should arrive before the end of the month.' },
    { speaker: 'neerja', text: 'Who checks that the ink does not block the recycling process?' },
    { speaker: 'ryan', text: 'The supplier uses a water-based ink for the brown stock, which the officer can approve.' },
    { speaker: 'aria', text: 'We should test whether the brown cardboard fades under the shop lights.' },
    { speaker: 'neerja', text: 'Fading matters less than a clear label, but we can note it for the second sample.' },
    { speaker: 'ryan', text: 'The snack packs inside should sit flat, so the box does not slip when stacked.' },
    { speaker: 'neerja', text: 'The revised seal should work for older customers too, since they were the weakest testers.' },
    { speaker: 'ryan', text: 'The recycling label stays on the back, so it can be read without opening the box.' },
    { speaker: 'neerja', text: 'I will send a short summary to the design team after this meeting.' },
    { speaker: 'ryan', text: 'Good. That should close today’s discussion on the packaging project.' },
  ],
  vocabulary: [
    {
      term: 'cardboard', phonetic: '/ˈkɑːdbɔːd/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '纸板（包装纸盒材料）', en: 'the stiff paper board used to make boxes' },
      usage: { zh: '不可数；recycled cardboard、coated cardboard、cardboard box。', en: 'Uncountable: recycled cardboard, coated cardboard, cardboard box.' },
      collocations: ['recycled cardboard', 'coated cardboard', 'a cardboard box'],
      example: { en: 'I would push for recycled cardboard for the main box.', zh: '我主张主盒用再生纸板。' },
      listening: { zh: '复合词 card 加 board，重音在第一部分，长元音 /ɑː/。', en: 'Compound card plus board, stress first, long /ɑː/.' },
    },
    {
      term: 'cost', phonetic: '/kɒst/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '成本，价格', en: 'the money paid for materials and production' },
      usage: { zh: '可数或不可数；cost concern、the cost gap、at this cost。', en: 'Countable or uncountable: cost concern, the cost gap.' },
      collocations: ['the cost concern', 'the cost gap', 'raise the cost'],
      example: { en: 'I have to raise the cost concern about recycled stock.', zh: '我必须提出再生材料的成本顾虑。' },
      listening: { zh: '单音节；短元音 /ɒ/，结尾 /st/。', en: 'One syllable; short /ɒ/, final /st/.' },
    },
    {
      term: 'testing', phonetic: '/ˈtestɪŋ/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '用户测试（试用反馈环节）', en: 'the session where real users try the sample' },
      usage: { zh: '不可数；user testing、lead the testing、tester feedback。动词 test。', en: 'Uncountable: user testing, lead the testing, tester feedback. Verb test.' },
      collocations: ['the user testing', 'lead the testing', 'a testing session'],
      example: { en: 'I will lead the user testing with town centre customers.', zh: '我主持面向镇中心顾客的用户测试。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /ɪŋ/。', en: 'Two syllables, first-syllable stress, ending /ɪŋ/.' },
    },
    {
      term: 'revision', phonetic: '/rɪˈvɪʒn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '修改，修订（笔记或样本）', en: 'changes made after feedback to improve the design' },
      usage: { zh: '不可数；revision notes、revised sample。动词 revise。', en: 'Uncountable: revision notes, revised sample. Verb revise.' },
      collocations: ['revision notes', 'a revised sample', 'the revision round'],
      example: { en: 'The assistant drafts the revision notes after round one.', zh: '助理在第一轮后起草修改笔记。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈvɪʒ/。', en: 'Two syllables with second-syllable stress.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 45,
      meaning: { zh: '样本（供测试的盒子样品）', en: 'a prototype box made for review and testing' },
      usage: { zh: '可数；revised sample、test sample、sample group。', en: 'Countable: revised sample, test sample, sample group.' },
      collocations: ['a revised sample', 'the test sample', 'the sample group'],
      example: { en: 'The notes become a revised sample for another test round.', zh: '笔记落成修订样本再测一轮。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /mpl/。', en: 'Two syllables, first-syllable stress, ending /mpl/.' },
    },
    {
      term: 'seal', phonetic: '/siːl/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '封条，封口（保持盒内新鲜）', en: 'the closure that keeps the box fresh until opened' },
      usage: { zh: '可数；sealed flap、the revised seal、tight seal。', en: 'Countable: sealed flap, the revised seal, tight seal.' },
      collocations: ['the sealed flap', 'the revised seal', 'a tight seal'],
      example: { en: 'The seal was too tight for the older testers.', zh: '封条对老年测试者来说太紧。' },
      listening: { zh: '单音节；长元音 /iː/，结尾 /l/。', en: 'One syllable; long /iː/, final /l/.' },
    },
    {
      term: 'label', phonetic: '/ˈleɪbl/', partOfSpeech: 'n.', sentenceIndex: 63,
      meaning: { zh: '标签（标明材料与回收去向）', en: 'the printed mark stating material and recycling route' },
      usage: { zh: '可数；recycling label、clear label、on the back。', en: 'Countable: recycling label, clear label, on the back.' },
      collocations: ['the recycling label', 'a clear label', 'print the label'],
      example: { en: 'The recycling label stays on the back panel.', zh: '回收标识留在盒背。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /bl/。', en: 'Two syllables, first-syllable stress, ending /bl/.' },
    },
  ],
  expressions: [
    {
      phrase: 'push for', sentenceIndex: 6,
      meaning: { zh: '主张，争取（某方案）', en: 'to support and argue for an option' },
      usage: { zh: 'push for 加方案；push for recycled cardboard。', en: 'Push for plus option: push for recycled cardboard.' },
      example: { en: 'I would push for a greener cardboard option.', zh: '我会争取更环保的纸板方案。' },
    },
    {
      phrase: 'raise the cost concern', sentenceIndex: 8,
      meaning: { zh: '提出成本顾虑，指出价格问题', en: 'to point out a worry about the material price' },
      usage: { zh: '及物；raise the cost concern、raise the safety concern。', en: 'Transitive: raise the cost concern, raise the safety concern.' },
      example: { en: 'I have to raise the cost concern about recycled stock.', zh: '我得先提出再生材料的成本顾虑。' },
    },
    {
      phrase: 'lean towards', sentenceIndex: 21,
      meaning: { zh: '倾向于（某选择）', en: 'to prefer one option without deciding finally' },
      usage: { zh: 'lean towards 加选项；lean towards the recycled stock。', en: 'Lean towards plus option: lean towards the recycled stock.' },
      example: { en: 'I lean towards the recycled cardboard for the box.', zh: '我倾向用再生纸板做盒子。' },
    },
    {
      phrase: 'ruled out', sentenceIndex: 40,
      meaning: { zh: '排除，否决（某做法）', en: 'decided that an option is not acceptable' },
      usage: { zh: 'rule out 的过去式；ruled out the coating、be ruled out。', en: 'Past of rule out: ruled out the coating, be ruled out.' },
      example: { en: 'We have ruled out the glossy coating for the carton.', zh: '光面涂布已被排除出主盒。' },
    },
    {
      phrase: 'relying on', sentenceIndex: 53,
      meaning: { zh: '依靠，依赖', en: 'depending on someone or something for feedback' },
      usage: { zh: '现在分词；relying on a paid survey、relying on real users。', en: 'Present participle: relying on a paid survey, relying on real users.' },
      example: { en: 'We reject relying on a paid survey instead of tester feedback.', zh: '我们拒绝靠付费调查代替试用反馈。' },
    },
    {
      phrase: 'non-negotiable', sentenceIndex: 50,
      meaning: { zh: '不可让步，硬性要求', en: 'a requirement that cannot be changed' },
      usage: { zh: '形容词作表语；the letterbox depth is non-negotiable。', en: 'Adjective predicative: the depth is non-negotiable.' },
      example: { en: 'The letterbox depth remains non-negotiable online.', zh: '线上渠道下信箱深度不能让步。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题听发言归属', en: 'Match speakers by who says it' },
      body: {
        zh: '第 21–24 题把四项任务分给三人加项目助理。分工段先认人：I would push for 是 Neerja，I have to raise 是 Ryan，I will lead 是 Aria，句 13 的 the project assistant 是第四方；听到任务词同时记下发言者，不要凭任务名选字母。',
        en: 'Questions 21–24 assign four tasks to three people plus the assistant. Identify the speaker first: I would push for is Neerja, I have to raise is Ryan, I will lead is Aria, and the project assistant in sentence 13 is the fourth party. Note the speaker with each task, not the task name alone.',
      },
    },
    {
      title: { zh: '单选抓结论句与原因句', en: 'Catch decision and cause sentences' },
      body: {
        zh: '第 25 题答案在 So the main box is 之后的结论；第 26 题问改设计原因，答案在 struggled with the sealed flap；第 27 题下一步在 turns the notes into a revised sample。听到 so、that explains、next step 时先记后半句。',
        en: 'Item 25 follows the decision after So the main box is; item 26’s reason is after struggled with the sealed flap; item 27’s next step is after turns the notes into a revised sample. Note the clause after so, that explains, or next step.',
      },
    },
    {
      title: { zh: '多选区分目标与被否方案', en: 'Separate goals from rejected options' },
      body: {
        zh: '第 28–30 题选三项约定目标：老年顾客易开、可穿信箱、回收标识清晰。被排除的光面涂布、付费品牌调查、满版侧面宣传是干扰项；听到 ruled out、rejected、That is not needed 时把该项划掉。',
        en: 'Questions 28–30 pick three agreed goals: easy opening for older customers, letterbox posting, a clear recycling label. Glossy coating, the paid survey and full side branding are rejected distractors. Cross out an item after ruled out, rejected, or That is not needed.',
      },
    },
  ],
};
