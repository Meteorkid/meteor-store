import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 30 · Part 3 — 社交媒体辩论准备（两名学生讨论，加拿大 + 美式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：分工与角色（配对 21–24）→ 证据类型与反驳策略、评分维度（单选 25–27）→
 * 可使用的有效证据类型（多选 28–30）。题块顺序与录音顺序一致。
 */
export const test30Part3: ListeningLesson = {
  slug: 'test-30-part-3',
  part: 3,
  status: 'published',
  title: { zh: '社交媒体辩论准备', en: 'Preparing a debate on social media' },
  summary: {
    zh: '两名学生准备一场关于青少年社媒使用时长的辩论：划分各自承担的主张梳理、调查数据、开场陈词、反驳准备、计时与评分记录；确定优先引用的证据类型、反驳对方的策略和评委打分维度，并梳理可带入赛场的三类有效证据。',
    en: 'Two students prepare a debate on teenagers’ social media use: dividing roles across claims, survey data, opening case, rebuttals, timing and criteria; deciding which evidence to cite first, how to answer the other side, and what judges score; then listing the three valid evidence types they may bring in.',
  },
  accent: { zh: 'Clara 为加拿大口音，Andrew 为美式口音。', en: 'Clara speaks with a Canadian accent and Andrew with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'clara', label: 'CLARA', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'andrew', label: 'ANDREW', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which preparation has each person taken on? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'divides the two sides’ main claims' },
        { key: 'B', text: 'collects survey evidence on usage' },
        { key: 'C', text: 'prepares rebuttal examples' },
        { key: 'D', text: 'checks the speaking time' },
        { key: 'E', text: 'writes the opening case' },
        { key: 'F', text: 'notes the judging criteria' },
      ],
      items: [
        { number: 21, text: 'Clara' },
        { number: 22, text: 'Andrew' },
        { number: 23, text: 'Clara' },
        { number: 24, text: 'Andrew' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What evidence does Clara recommend citing first?',
          options: [
            { key: 'A', text: 'recent studies on young people’s screen habits' },
            { key: 'B', text: 'personal stories from classmates' },
            { key: 'C', text: 'opinions posted on the platforms' },
          ],
        },
        {
          number: 26,
          stem: 'How will Andrew handle opposing arguments?',
          options: [
            { key: 'A', text: 'repeat the main claim without change' },
            { key: 'B', text: 'concede small points, then attack the strongest claim' },
            { key: 'C', text: 'refuse to answer any opposing point' },
          ],
        },
        {
          number: 27,
          stem: 'What will the judges score?',
          options: [
            { key: 'A', text: 'only the final result' },
            { key: 'B', text: 'structure, evidence and delivery' },
            { key: 'C', text: 'the number of slides shown' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE types of evidence are valid to bring into the debate? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE types of evidence are valid to bring into the debate?',
      options: [
        { key: 'A', text: 'statistics from a recent survey' },
        { key: 'B', text: 'personal anecdotes from friends' },
        { key: 'C', text: 'studies on screen time and attention' },
        { key: 'D', text: 'claims repeated online' },
        { key: 'E', text: 'quotes from official policy reports' },
        { key: 'F', text: 'unsupported predictions' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：I’ll divide the two sides’ main claims, so we know exactly what our opponents may argue。Clara 梳理双方主张，对应 A。',
        en: 'Sentence 3: "I’ll divide the two sides’ main claims, so we know exactly what our opponents may argue". Clara maps the claims, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：I’ll collect survey evidence on usage, since I saved last year’s class survey。Andrew 收集使用情况调查数据，对应 B。',
        en: 'Sentence 4: "I’ll collect survey evidence on usage, since I saved last year’s class survey". Andrew gathers survey data, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 7,
      explanation: {
        zh: '定位句 7：Then I’ll prepare rebuttal examples, so we can answer each claim with a concrete counterpoint。Clara 准备反驳例证，对应 C。',
        en: 'Sentence 7: "Then I’ll prepare rebuttal examples, so we can answer each claim with a concrete counterpoint". Clara prepares rebuttals, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 8,
      explanation: {
        zh: '定位句 8：I’ll also check the speaking time, because each speaker only gets four minutes。Andrew 负责核对发言时间，对应 D。E 的开场陈词由 Andrew 起草但不是本条分工，F 的评分标准由 Clara 记录。',
        en: 'Sentence 8: "I’ll also check the speaking time, because each speaker only gets four minutes". Andrew checks timing, matching D. The opening case in E is his draft but not this item, and the criteria in F are Clara’s note.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 14,
      explanation: {
        zh: '定位句 14：I’d cite recent studies on young people’s screen habits first, because they follow large samples over weeks。优先引用青少年屏幕习惯研究，对应 A。B 的个人故事只作举例，C 的平台观点不算证据。',
        en: 'Sentence 14: "I’d cite recent studies on young people’s screen habits first, because they follow large samples over weeks", matching A. Personal stories in B are only illustration, and platform opinions in C are not evidence.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：I’ll concede the small points, then attack the main claim that unlimited use does no harm。先让步小处，再主攻最强主张，对应 B。A 重复原说法、C 拒绝回应均与策略相反。',
        en: 'Sentence 19: "I’ll concede the small points, then attack the main claim that unlimited use does no harm", matching B. Repeating the claim in A and refusing to answer in C go against the stated strategy.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：The judges score structure, evidence and delivery, rather than a single final impression。评委按结构、证据和表达打分，对应 B。A 的单一结果印象、C 的幻灯片数量均未列入评分。',
        en: 'Sentence 24: "The judges score structure, evidence and delivery, rather than a single final impression", matching B. A single overall impression in A and slide counts in C are not scored.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：statistics from a recent survey are safe to cite, as long as we name the sample size。近期调查统计是有效证据，对应 A。',
        en: 'Sentence 29: "statistics from a recent survey are safe to cite, as long as we name the sample size", matching A.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 30,
      explanation: {
        zh: '定位句 30：studies on screen time and attention give us a measured link to school performance。屏幕时长与注意力研究是有效证据，对应 C。',
        en: 'Sentence 30: "studies on screen time and attention give us a measured link to school performance", matching C.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 31,
      explanation: {
        zh: '定位句 31：quotes from official policy reports show what schools and councils already recommend。官方政策报告引文是有效证据，对应 E。B 的朋友轶事仅作举例，D 的网络重复说法和 F 的无依据预测被句 33、34 排除。',
        en: 'Sentence 31: "quotes from official policy reports show what schools and councils already recommend", matching E. Friends’ anecdotes in B are illustration only; repeated online claims in D and unsupported predictions in F are ruled out in sentences 33 and 34.',
      },
    },
  ],
  transcript: [
    { speaker: 'clara', text: 'The debate is about how much time teenagers should spend on social media, so let’s divide the preparation first.' },
    { speaker: 'andrew', text: 'Right. Each side needs a clear case, evidence, and a plan for answering the other team.' },
    { speaker: 'clara', text: 'Who does what before the session tomorrow?' },
    { speaker: 'clara', text: 'I’ll divide the two sides’ main claims, so we know exactly what our opponents may argue.' },
    { speaker: 'andrew', text: 'And I’ll collect survey evidence on usage, since I saved last year’s class survey on my laptop.' },
    { speaker: 'clara', text: 'Good. What about the opening statement?' },
    { speaker: 'andrew', text: 'I can draft the opening case, as long as you check the facts before we speak.' },
    { speaker: 'clara', text: 'Then I’ll prepare rebuttal examples, so we can answer each claim with a concrete counterpoint.' },
    { speaker: 'andrew', text: 'Fair. I’ll also check the speaking time, because each speaker only gets four minutes.' },
    { speaker: 'clara', text: 'The judging criteria were posted on the society page; I’ll note them down and bring them to the room.' },
    { speaker: 'andrew', text: 'So the roles are claims, survey data, opening case, rebuttals, timing and criteria.' },
    { speaker: 'clara', text: 'Exactly. Now let’s settle what our own side actually argues.' },
    { speaker: 'andrew', text: 'Our position is that teenagers should limit daily use to a reasonable amount, not ban it outright.' },
    { speaker: 'clara', text: 'We need evidence that holds up under questioning, not just opinions repeated online.' },
    { speaker: 'clara', text: 'I’d cite recent studies on young people’s screen habits first, because they follow large samples over weeks.' },
    { speaker: 'andrew', text: 'Personal stories could illustrate a point, but they cannot carry the case on their own.' },
    { speaker: 'clara', text: 'Right. The other team will probably say that connection and learning keep the platforms useful.' },
    { speaker: 'andrew', text: 'We can accept that some use is valuable, so we do not look defensive about the benefits.' },
    { speaker: 'clara', text: 'How should we answer their strongest argument when it comes up?' },
    { speaker: 'andrew', text: 'I’ll concede the small points, then attack the main claim that unlimited use does no harm.' },
    { speaker: 'clara', text: 'That avoids overstating our case. We should not pretend social media has no good side.' },
    { speaker: 'andrew', text: 'Agreed. Our rebuttals should match each opposing point one by one.' },
    { speaker: 'clara', text: 'Before we practise the speaking, what will the judges look for?' },
    { speaker: 'andrew', text: 'The sheet lists three marks, and I’ll read them out.' },
    { speaker: 'clara', text: 'The judges score structure, evidence and delivery, rather than a single final impression.' },
    { speaker: 'andrew', text: 'Structure means the case follows a clear order, with each point linked to the next.' },
    { speaker: 'clara', text: 'Evidence means each claim is supported by a source the judges can follow.' },
    { speaker: 'andrew', text: 'Delivery covers clarity, eye contact and keeping within the time limit.' },
    { speaker: 'clara', text: 'Now the evidence we are allowed to bring into the room.' },
    { speaker: 'andrew', text: 'First, statistics from a recent survey are safe to cite, as long as we name the sample size.' },
    { speaker: 'clara', text: 'Second, studies on screen time and attention give us a measured link to school performance.' },
    { speaker: 'andrew', text: 'Third, quotes from official policy reports show what schools and councils already recommend.' },
    { speaker: 'clara', text: 'What should we leave out of the evidence pack?' },
    { speaker: 'andrew', text: 'Personal anecdotes from friends carry weight only as illustration, not as proof.' },
    { speaker: 'clara', text: 'Claims repeated online do not count as evidence, and unsupported predictions will be challenged.' },
    { speaker: 'andrew', text: 'So the three solid types are the survey figures, the screen time studies and the policy quotes.' },
    { speaker: 'clara', text: 'That matches what the criteria sheet expects, so let’s write them on the index cards.' },
    { speaker: 'andrew', text: 'How long should each speaker prepare their opening lines tonight?' },
    { speaker: 'clara', text: 'Keep the first two minutes simple, with one main claim, two supporting reasons and one example.' },
    { speaker: 'andrew', text: 'I’ll rehearse my opening after dinner, and send the draft to you for a quick check.' },
    { speaker: 'clara', text: 'I’ll read the survey report tonight and note the figures we can quote.' },
    { speaker: 'andrew', text: 'Do we need slides for the room?' },
    { speaker: 'clara', text: 'The society said slides are optional, and the judges rely on the spoken argument more than visuals.' },
    { speaker: 'andrew', text: 'Then we keep a few cards rather than a long deck.' },
    { speaker: 'clara', text: 'What happens if our opponents cite a study we have not seen?' },
    { speaker: 'andrew', text: 'We ask them to name the sample and the year, then we respond to the method, not the headline.' },
    { speaker: 'clara', text: 'Good. We should not dismiss a source just because it disagrees with us.' },
    { speaker: 'andrew', text: 'The reply section is where we address their strongest case after our own opening.' },
    { speaker: 'clara', text: 'I’ll note the order, opening, main arguments, reply, summary, and then questions from the judges.' },
    { speaker: 'andrew', text: 'The chair keeps time with a card raised two minutes before the end.' },
    { speaker: 'clara', text: 'Speaking too late costs delivery marks, so the timing check matters as much as the case.' },
    { speaker: 'andrew', text: 'I’ll put the four minute limit on each card beside the speaker’s name.' },
    { speaker: 'clara', text: 'Did you bring the criteria sheet from last week’s meeting?' },
    { speaker: 'andrew', text: 'It’s in the shared folder. The main headings are the same as this year’s.' },
    { speaker: 'clara', text: 'Let me copy the scoring rows into our notebook before I forget them.' },
    { speaker: 'andrew', text: 'One risk is that the debate drifts into general opinion instead of evidence.' },
    { speaker: 'clara', text: 'We can stop that by asking, after every point, what source supports it.' },
    { speaker: 'andrew', text: 'I’ll mark any card that lacks a source and rewrite it before tomorrow.' },
    { speaker: 'clara', text: 'The title of the motion should be quoted exactly when we introduce our side.' },
    { speaker: 'andrew', text: 'I’ve written it on the cover card, so neither of us misstates the question.' },
    { speaker: 'clara', text: 'Any last details before we split the work?' },
    { speaker: 'andrew', text: 'The room number is on the society notice, and we meet there fifteen minutes early.' },
    { speaker: 'clara', text: 'I’ll print the survey summary and bring the rebuttals notes in one folder.' },
    { speaker: 'andrew', text: 'I’ll check that the timing card and the criteria list are in my bag.' },
    { speaker: 'clara', text: 'Then tonight we have drafts, sources, cards, and a short run-through before bed.' },
    { speaker: 'andrew', text: 'Sounds good. I’ll see you in the debate room tomorrow afternoon.' },
  ],
  vocabulary: [
    {
      term: 'rebuttal', phonetic: '/rɪˈbʌtl/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '反驳，回应对手论点', en: 'an answer that argues against an opposing claim' },
      usage: { zh: '可数名词；rebuttal examples、preparation rebuttal。动词 rebut。', en: 'Countable: rebuttal examples, preparation rebuttal; the verb is rebut.' },
      collocations: ['a rebuttal example', 'the rebuttal section', 'prepare a rebuttal'],
      example: { en: 'Each rebuttal answers one opposing claim.', zh: '每条反驳回应一个对手论点。' },
      listening: { zh: '重音在第二音节 /ˈbʌ/，开头 /rɪ/ 弱读。', en: 'Stress the second syllable; the opening /rɪ/ is weak.' },
    },
    {
      term: 'survey', phonetic: '/ˈsɜːveɪ/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '调查，问卷统计', en: 'a study that collects answers from a sample of people' },
      usage: { zh: '可数名词；survey evidence、class survey。动词 survey 重音在第二音节。', en: 'Countable: survey evidence, a class survey; the verb stresses the second syllable.' },
      collocations: ['the class survey', 'survey evidence', 'a recent survey'],
      example: { en: 'The survey records how often teenagers go online.', zh: '调查记录青少年上网频率。' },
      listening: { zh: '名词重音在第一音节；动词重音在第二音节。', en: 'The noun stresses the first syllable; the verb stresses the second.' },
    },
    {
      term: 'evidence', phonetic: '/ˈevɪdəns/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '证据，论据', en: 'facts or sources that support a claim' },
      usage: { zh: '不可数名词；evidence holds up、valid evidence。', en: 'Uncountable: evidence holds up, valid evidence.' },
      collocations: ['the survey evidence', 'valid evidence', 'lack a source'],
      example: { en: 'Each claim needs evidence the judges can follow.', zh: '每个论点都要有评委可追溯的证据。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈev/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'concede', phonetic: '/kənˈsiːd/', partOfSpeech: 'v.', sentenceIndex: 19,
      meaning: { zh: '承认（小处有理），让步', en: 'to accept a weaker opposing point before arguing the main case' },
      usage: { zh: '及物动词；concede a point、concede small claims。名词 concession。', en: 'Transitive: concede a point, concede small claims; the noun is concession.' },
      collocations: ['concede a small point', 'concede some benefit', 'concede in part'],
      example: { en: 'Concede the small point, then defend the main claim.', zh: '先让步小处，再守住主论点。' },
      listening: { zh: '重音在第二音节 /ˈsiːd/，长音。', en: 'Stress the second syllable with a long /iː/.' },
    },
    {
      term: 'criteria', phonetic: '/kraɪˈtɪəriə/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '评分标准，评判条件', en: 'the standards judges use to score a performance' },
      usage: { zh: '常用复数；judging criteria、meet the criteria。单数 criterion。', en: 'Usually plural: judging criteria, meet the criteria; the singular is criterion.' },
      collocations: ['the judging criteria', 'the criteria sheet', 'score against the criteria'],
      example: { en: 'The criteria list structure, evidence and delivery.', zh: '评分标准包括结构、证据和表达。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtɪə/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'delivery', phonetic: '/dɪˈlɪvəri/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '表达，演讲呈现', en: 'how a speaker presents the case, including clarity and timing' },
      usage: { zh: '不可数名词；delivery marks、clear delivery。动词 deliver。', en: 'Uncountable: delivery marks, clear delivery; the verb is deliver.' },
      collocations: ['delivery marks', 'clear delivery', 'within the time limit'],
      example: { en: 'Clarity and timing both affect delivery.', zh: '清晰度和时间控制都影响表达分。' },
      listening: { zh: '重音在第二音节 /ˈlɪv/。', en: 'Stress the second syllable /ˈlɪv/.' },
    },
    {
      term: 'anecdotes', phonetic: '/ˈænɪkdəʊts/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '轶事，个人故事', en: 'a short personal story used as illustration, not proof' },
      usage: { zh: '可数名词；personal anecdote、anecdote from friends。形容词 anecdotal。', en: 'Countable: a personal anecdote, an anecdote from friends; the adjective is anecdotal.' },
      collocations: ['a personal anecdote', 'anecdotes from friends', 'use as an anecdote'],
      example: { en: 'A friend’s anecdote can illustrate, but not prove, a point.', zh: '朋友轶事可作举例，不能证明论点。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈæn/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'motion', phonetic: '/ˈməʊʃn/', partOfSpeech: 'n.', sentenceIndex: 58,
      meaning: { zh: '辩题，辩论动议', en: 'the formal statement the debate agrees or disagrees with' },
      usage: { zh: '辩论术语；the title of the motion、support the motion。', en: 'Debate term: the title of the motion, support the motion.' },
      collocations: ['the debate motion', 'quote the motion', 'the motion title'],
      example: { en: 'Quote the motion exactly when you open the case.', zh: '开场时逐字引用辩题。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈməʊ/。', en: 'Two syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'divide the preparation', sentenceIndex: 0,
      meaning: { zh: '把准备工作分工', en: 'to split the tasks for the debate between speakers' },
      usage: { zh: '及物；divide the preparation first、divide the work between us。', en: 'Transitive: divide the preparation first, divide the work between us.' },
      example: { en: 'Let’s divide the preparation before we rehearse.', zh: '排练前先把准备工作分工。' },
    },
    {
      phrase: 'holds up under questioning', sentenceIndex: 13,
      meaning: { zh: '在追问下站得住', en: 'to remain convincing when challenged by opponents' },
      usage: { zh: '证据搭配；the case holds up under questioning。', en: 'With evidence: the case holds up under questioning.' },
      example: { en: 'The study holds up under questioning because its sample is large.', zh: '这项研究样本大，追问下也站得住。' },
    },
    {
      phrase: 'one by one', sentenceIndex: 21,
      meaning: { zh: '逐条，逐一', en: 'one opposing point at a time' },
      usage: { zh: '方式状语；answer the points one by one。', en: 'Adverbial: answer the points one by one.' },
      example: { en: 'Match each rebuttal to a point one by one.', zh: '每条反驳逐一对应一个论点。' },
    },
    {
      phrase: 'split the work', sentenceIndex: 60,
      meaning: { zh: '分工，分派任务', en: 'to divide tasks between the two speakers' },
      usage: { zh: '及物；split the work after the outline is agreed。', en: 'Transitive: split the work after the outline is agreed.' },
      example: { en: 'We split the work between survey notes and rebuttals.', zh: '我们把调查记录和反驳准备分工。' },
    },
    {
      phrase: 'drifts into', sentenceIndex: 55,
      meaning: { zh: '滑向，不自觉变成', en: 'to move gradually into a weaker kind of talk' },
      usage: { zh: '贬义；drift into opinion、drift into generalities。', en: 'Negative: drift into opinion, drift into generalities.' },
      example: { en: 'The debate must not drift into general opinion.', zh: '辩论不能滑向泛泛而谈。' },
    },
    {
      phrase: 'run-through', sentenceIndex: 64,
      meaning: { zh: '通排，走一遍流程', en: 'a short rehearsal through the whole sequence' },
      usage: { zh: '名词；have a run-through、a short run-through。', en: 'Noun: have a run-through, a short run-through.' },
      example: { en: 'We do a short run-through before bed.', zh: '睡前我们简短通排一遍。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对先记说话人角色', en: 'Match voice to role first' },
      body: {
        zh: '21–24 考“谁承担了哪项准备”。开头先把 Clara、Andrew 的声音对上名字，每条分工先记说话人再记事项；起草开场陈词、记录评分标准是另外两条对照角色。',
        en: 'Items 21–24 ask who took on which preparation. Match the two voices to names first, then note speaker before task. Drafting the opening case and noting the criteria are the two comparison roles.',
      },
    },
    {
      title: { zh: '反驳策略听让步词', en: 'Listen for concession words' },
      body: {
        zh: '第 26 题问如何回应对方，答案在 concede the small points 之后：先接受局部有理，再主攻主论点。听到 accept、concede、some use is valuable 时，预判后面才是真正的反驳对象。',
        en: 'Item 26 asks how to answer the other side; the answer follows concede the small points: accept local merits first, then attack the main claim. After accept, concede or some use is valuable, expect the real target of the rebuttal.',
      },
    },
    {
      title: { zh: '多选区分证据与例证', en: 'Evidence versus illustration' },
      body: {
        zh: '三项有效证据是调查统计、屏幕时长研究、政策报告引文；朋友轶事只是举例，网络重复说法和无依据预测被明确排除。听时把每个选项标注为证据、例证或排除项，再选三个。',
        en: 'The three valid types are survey statistics, screen time studies and policy quotes; friends’ anecdotes are illustration, and repeated online claims plus unsupported predictions are excluded. Mark each option evidence, illustration or rejected before choosing three.',
      },
    },
  ],
};
