import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 42 · Part 4 — 讲座：运动的生理学。原创仿真材料，非官方真题。
 *
 * 结构：开场概览运动对身体的塑造（单选 31–34）→ 三种能量系统 → 心肺适应 →
 * 恢复机制 → 训练原则；后半段复述笔记要点（填空 35–40）：无氧系统、血氧输送、
 * 肌肉恢复、渐进加量、热身升温、训练与恢复平衡。单选块在前，填空块在后。
 */
export const test42Part4: ListeningLesson = {
  slug: 'test-42-part-4',
  part: 4,
  status: 'published',
  title: { zh: '运动的生理学', en: 'The physiology of exercise' },
  summary: {
    zh: '一场关于运动生理学的讲座：重复的负荷与适应共同塑造身体；讲解无氧与有氧等能量系统如何随时长强度切换、规律有氧训练后心脏泵血与血氧输送的适应、睡眠与休息日的肌肉修复，以及渐进加量、热身与训练恢复平衡等安全训练原则。',
    en: 'A lecture on exercise physiology: repeated stress and adaptation shape the body. It covers how energy systems such as anaerobic and aerobic work switch with length and intensity, cardio adaptations in heart pumping and oxygen delivery, muscle repair through sleep and rest days, and safe training principles of gradual progression, warm up, and the balance of training and recovery.',
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
          stem: 'What is the lecturer’s main point about exercise physiology?',
          options: [
            { key: 'A', text: 'Exercise trains the body through repeated stress and adaptation.' },
            { key: 'B', text: 'The body recovers from exercise without any rest.' },
            { key: 'C', text: 'Harder workouts always produce faster muscle growth.' },
          ],
        },
        {
          number: 32,
          stem: 'Why does the body switch energy systems during exercise?',
          options: [
            { key: 'A', text: 'It prefers the aerobic system for every kind of effort.' },
            { key: 'B', text: 'Different efforts call on different fuel systems by length and intensity.' },
            { key: 'C', text: 'The anaerobic system lasts longer than any other system.' },
          ],
        },
        {
          number: 33,
          stem: 'What adaptation follows regular cardio training?',
          options: [
            { key: 'A', text: 'The heart pumps more blood per beat and resting rate drops.' },
            { key: 'B', text: 'Lung capacity shrinks after several weeks.' },
            { key: 'C', text: 'Muscles stop extracting oxygen during rest.' },
          ],
        },
        {
          number: 34,
          stem: 'What principle guides safe training progression?',
          options: [
            { key: 'A', text: 'Load should rise suddenly to shock the body.' },
            { key: 'B', text: 'Progression is gradual, with small weekly increases.' },
            { key: 'C', text: 'Training volume stays fixed for the whole season.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'First energy system for sprinting: the', cells: [[{ blank: 35 }, { text: ' system.' }]] },
        { lead: 'Cardio training improves the blood’s ability to carry', cells: [[{ blank: 36 }, { text: '.' }]] },
        { lead: 'Rest days allow muscle tissue to', cells: [[{ blank: 37 }, { text: ' and repair.' }]] },
        { lead: 'Training should be', cells: [[{ blank: 38 }, { text: ' over time rather than sudden.' }]] },
        { lead: 'A warm up raises muscle', cells: [[{ blank: 39 }, { text: ' before exercise.' }]] },
        { lead: 'A balanced plan combines training and', cells: [[{ blank: 40 }, { text: '.' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['A'], evidence: 2,
      explanation: {
        zh: '定位句 2：The central point is that exercise trains the body in the same way it trains the mind。运动通过重复负荷与适应塑造身体，对应 A。B 的无需休息与句 25 相反，C 的越练越快在讲座中没有依据。',
        en: 'Sentence 2: "The central point is that exercise trains the body in the same way it trains the mind", matching A. Recovery without rest contradicts sentence 25, and harder always producing faster growth is not claimed.',
      },
    },
    {
      number: 32, accepted: ['B'], evidence: 10,
      explanation: {
        zh: '定位句 10：A short sprint uses fuel that does not need oxygen, called the anaerobic system。不同时长强度调用不同燃料系统，对应 B。A 的所有运动都用有氧与句 12 的切换相反，C 的无氧最持久与句 11 相反。',
        en: 'Sentence 10: "A short sprint uses fuel that does not need oxygen, called the anaerobic system". Different efforts call on different systems by length and intensity, matching B. Aerobic-only contradicts the switch in sentence 12, and anaerobic lasting longest contradicts sentence 11.',
      },
    },
    {
      number: 33, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：Regular cardio training strengthens the heart so it pumps more blood per beat。规律有氧训练强化心脏、每次搏动感泵出更多血液，对应 A。B 的肺活量缩小与句 20 相反，C 的休息时肌肉停止摄氧在录音中没有依据。',
        en: 'Sentence 18: "Regular cardio training strengthens the heart so it pumps more blood per beat", matching A. Lung shrinkage contradicts sentence 20, and muscles stopping oxygen extraction at rest is not said.',
      },
    },
    {
      number: 34, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：Progression should be gradual, with small increases in load each week。安全加量遵循渐进原则、每周小幅提升，对应 B。A 的突然加量与句 30 的损伤风险相反，C 的全年固定容量在录音中没有依据。',
        en: 'Sentence 29: "Progression should be gradual, with small increases in load each week", matching B. Sudden load rises carry injury risk per sentence 30, and fixed volume all season is not claimed.',
      },
    },
    {
      number: 35, accepted: ['anaerobic'], evidence: 35,
      explanation: {
        zh: '定位句 35：The body’s first energy system for sprinting is anaerobic, and it works without oxygen。短跑首用的无氧系统，空前是 the，填 anaerobic；system 已印在卷面上。',
        en: 'Sentence 35: "The body’s first energy system for sprinting is anaerobic, and it works without oxygen". The sprint system is anaerobic; the precedes the gap and system is printed.',
      },
    },
    {
      number: 36, accepted: ['oxygen'], evidence: 36,
      explanation: {
        zh: '定位句 36：Cardio training improves the blood’s ability to carry oxygen to working muscles。有氧训练提升血液携氧能力，空前是 carry，填 oxygen。',
        en: 'Sentence 36: "Cardio training improves the blood’s ability to carry oxygen to working muscles". Blood carries oxygen to muscles; carry precedes the gap, so write oxygen.',
      },
    },
    {
      number: 37, accepted: ['recover'], evidence: 37,
      explanation: {
        zh: '定位句 37：Rest days allow muscle tissue to recover and repair after the session。休息日让肌肉组织恢复并修复，空后是 and repair，填 recover。',
        en: 'Sentence 37: "Rest days allow muscle tissue to recover and repair after the session". Tissue recovers and repairs; and repair follows the gap, so write recover.',
      },
    },
    {
      number: 38, accepted: ['gradual'], evidence: 38,
      explanation: {
        zh: '定位句 38：Training should be gradual over time rather than sudden and large in one week。训练应随时间渐进，而非一周内突然大幅加量，填 gradual。',
        en: 'Sentence 38: "Training should be gradual over time rather than sudden and large in one week". Training is gradual over time, not sudden, so write gradual.',
      },
    },
    {
      number: 39, accepted: ['temperature'], evidence: 39,
      explanation: {
        zh: '定位句 39：A warm up raises muscle temperature so the body moves through the main session safely。热身提升肌肉温度，空前是 muscle，填 temperature。',
        en: 'Sentence 39: "A warm up raises muscle temperature so the body moves through the main session safely". The warm up raises muscle temperature; muscle precedes the gap, so write temperature.',
      },
    },
    {
      number: 40, accepted: ['recovery'], evidence: 40,
      explanation: {
        zh: '定位句 40：A balanced plan combines regular training and planned recovery between sessions。均衡计划结合训练与计划性恢复，空前是 and，填 recovery。',
        en: 'Sentence 40: "A balanced plan combines regular training and planned recovery between sessions". The plan balances training and recovery; and precedes the gap, so write recovery.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'When you run for a bus or lift a heavy box, your body responds in ways you barely notice.' },
    { speaker: 'lecturer', text: 'This lecture looks at the physiology behind ordinary exercise and how the body adapts.' },
    { speaker: 'lecturer', text: 'The central point is that exercise trains the body in the same way it trains the mind.' },
    { speaker: 'lecturer', text: 'We will cover the three energy systems, heart and lung adaptation, recovery, and training principles.' },
    { speaker: 'lecturer', text: 'Before the details, the broad conclusions are worth stating first.' },
    { speaker: 'lecturer', text: 'Different efforts call on different fuel systems, and the choice changes within a single session.' },
    { speaker: 'lecturer', text: 'Regular endurance work strengthens the heart and improves how oxygen reaches the muscles.' },
    { speaker: 'lecturer', text: 'Without recovery between sessions, training gains fade and injury risk rises.' },
    { speaker: 'lecturer', text: 'Safe progression is gradual, and it balances load against rest over weeks rather than days.' },
    { speaker: 'lecturer', text: 'To begin with the energy systems the body draws on.' },
    { speaker: 'lecturer', text: 'A short sprint uses fuel that does not need oxygen, called the anaerobic system.' },
    { speaker: 'lecturer', text: 'Anaerobic power is high, but it cannot last beyond a minute or two.' },
    { speaker: 'lecturer', text: 'Longer, steadier effort shifts to the aerobic system, which burns oxygen steadily.' },
    { speaker: 'lecturer', text: 'The third system supports very brief, explosive actions such as a single heavy lift.' },
    { speaker: 'lecturer', text: 'The body switches systems as effort rises, rather than choosing one for the whole workout.' },
    { speaker: 'lecturer', text: 'This explains why you slow down after an all out start to a race.' },
    { speaker: 'lecturer', text: 'Now consider how the body adapts after weeks of regular training.' },
    { speaker: 'lecturer', text: 'Cardiorespiratory adaptation changes the heart, lungs and blood together.' },
    { speaker: 'lecturer', text: 'Regular cardio training strengthens the heart so it pumps more blood per beat.' },
    { speaker: 'lecturer', text: 'The resting heart rate drops, and the muscles extract oxygen more efficiently.' },
    { speaker: 'lecturer', text: 'Lung ventilation rises during exercise, and trained people recover their breathing faster.' },
    { speaker: 'lecturer', text: 'Blood volume grows, so each beat can carry more fuel to active tissue.' },
    { speaker: 'lecturer', text: 'These changes are not immediate; they appear over repeated sessions across weeks.' },
    { speaker: 'lecturer', text: 'Next, the recovery side that makes adaptation possible.' },
    { speaker: 'lecturer', text: 'During exercise the body breaks down muscle tissue in small amounts.' },
    { speaker: 'lecturer', text: 'Sleep and rest days allow that tissue to rebuild and grow slightly stronger.' },
    { speaker: 'lecturer', text: 'Recovery also clears waste products that build up in working muscles.' },
    { speaker: 'lecturer', text: 'A plan that trains hard every day misses this repair window and stalls.' },
    { speaker: 'lecturer', text: 'Now the principles that guide a safe training programme.' },
    { speaker: 'lecturer', text: 'Progression should be gradual, with small increases in load each week.' },
    { speaker: 'lecturer', text: 'Sudden jumps in volume or intensity are the common cause of overuse injury.' },
    { speaker: 'lecturer', text: 'A proper warm up raises muscle temperature before the main session begins.' },
    { speaker: 'lecturer', text: 'It loosens the joints and lets the heart rate rise without a sharp shock.' },
    { speaker: 'lecturer', text: 'A balanced plan combines steady training with enough rest between blocks.' },
    { speaker: 'lecturer', text: 'The classic experiments and readings are the ones you should match to the note headings.' },
    { speaker: 'lecturer', text: 'The body’s first energy system for sprinting is anaerobic, and it works without oxygen.' },
    { speaker: 'lecturer', text: 'Cardio training improves the blood’s ability to carry oxygen to working muscles.' },
    { speaker: 'lecturer', text: 'Rest days allow muscle tissue to recover and repair after the session.' },
    { speaker: 'lecturer', text: 'Training should be gradual over time rather than sudden and large in one week.' },
    { speaker: 'lecturer', text: 'A warm up raises muscle temperature so the body moves through the main session safely.' },
    { speaker: 'lecturer', text: 'A balanced plan combines regular training and planned recovery between sessions.' },
    { speaker: 'lecturer', text: 'Trained athletes show a lower resting pulse and faster return to resting state.' },
    { speaker: 'lecturer', text: 'Even light activity helps blood flow back toward the heart during the rest period.' },
    { speaker: 'lecturer', text: 'Nutrition after a session supplies the materials the repair process needs.' },
    { speaker: 'lecturer', text: 'Hydration supports the blood volume that carries oxygen to active tissue.' },
    { speaker: 'lecturer', text: 'Let me bring these ideas together before we finish.' },
    { speaker: 'lecturer', text: 'Energy systems match the length and intensity of the effort on hand.' },
    { speaker: 'lecturer', text: 'Cardio adaptation strengthens the heart and improves oxygen delivery to muscles.' },
    { speaker: 'lecturer', text: 'Recovery rebuilds what exercise breaks down, and gradual progression keeps training safe.' },
    { speaker: 'lecturer', text: 'Ignore rest, and even a strong athlete reaches a plateau or picks up an injury.' },
    { speaker: 'lecturer', text: 'In the next session we will look at how periodisation arranges these blocks across a season.' },
    { speaker: 'lecturer', text: 'Thank you for listening.' },
  ],
  vocabulary: [
    {
      term: 'physiology', phonetic: '/ˌfɪziˈɒlədʒi/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '生理学（身体如何运作与适应）', en: 'the study of how the body functions and adapts to effort' },
      usage: { zh: '不可数；exercise physiology、human physiology。形容词是 physiological。', en: 'Uncountable: exercise physiology. The adjective is physiological.' },
      collocations: ['exercise physiology', 'human physiology', 'the physiology of exercise'],
      example: { en: 'Exercise physiology explains how the heart adapts to training.', zh: '运动生理学解释心脏如何适应训练。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈɒ/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'anaerobic', phonetic: '/ˌæneəˈrəʊbɪk/', partOfSpeech: 'adj.', sentenceIndex: 10,
      meaning: { zh: '无氧的（不需要氧气供能）', en: 'working without relying on oxygen for fuel' },
      usage: { zh: '生理术语；the anaerobic system、anaerobic power。反义词 aerobic。', en: 'Term: the anaerobic system, anaerobic power. The opposite is aerobic.' },
      collocations: ['the anaerobic system', 'anaerobic power', 'anaerobic exercise'],
      example: { en: 'A short sprint uses the anaerobic system for fuel.', zh: '短跑依靠无氧系统供能。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈrəʊ/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'aerobic', phonetic: '/eəˈrəʊbɪk/', partOfSpeech: 'adj.', sentenceIndex: 12,
      meaning: { zh: '有氧的（依赖氧气稳定供能）', en: 'using oxygen to produce steady fuel for endurance' },
      usage: { zh: '生理术语；the aerobic system、aerobic training。反义词 anaerobic。', en: 'Term: the aerobic system, aerobic training. The opposite is anaerobic.' },
      collocations: ['the aerobic system', 'aerobic training', 'aerobic effort'],
      example: { en: 'Steady long effort draws on the aerobic system.', zh: '长时间匀速运动依靠有氧系统。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈrəʊ/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'cardiorespiratory', phonetic: '/ˌkɑːdiəʊrˈspɪrətri/', partOfSpeech: 'adj.', sentenceIndex: 17,
      meaning: { zh: '心肺的（心脏与呼吸循环系统）', en: 'relating to the heart and the breathing circulation system' },
      usage: { zh: '长复合形容词；cardiorespiratory adaptation、cardiorespiratory fitness。', en: 'Long compound: cardiorespiratory adaptation, cardiorespiratory fitness.' },
      collocations: ['cardiorespiratory adaptation', 'cardiorespiratory fitness', 'cardiorespiratory system'],
      example: { en: 'Cardiorespiratory adaptation changes heart, lungs and blood together.', zh: '心肺适应同时改变心脏、肺与血液。' },
      listening: { zh: '六个音节，重音在第四音节 /ˈspɪr/。', en: 'Six syllables with stress on the fourth.' },
    },
    {
      term: 'progression', phonetic: '/prəˈɡreʃn/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '渐进加量，训练负荷逐步提升', en: 'the gradual increase of training load over weeks' },
      usage: { zh: '不可数；safe progression、progression in load。动词是 progress。', en: 'Uncountable: safe progression, progression in load. The verb is progress.' },
      collocations: ['safe progression', 'gradual progression', 'training progression'],
      example: { en: 'Progression should be gradual with small weekly increases.', zh: '加量应渐进，每周小幅提升。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈɡre/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'recovery', phonetic: '/rɪˈkʌvəri/', partOfSpeech: 'n.', sentenceIndex: 40,
      meaning: { zh: '恢复（训练后身体修复的阶段）', en: 'the period when the body repairs and rebuilds after exercise' },
      usage: { zh: '不可数；rest days allow recovery、training and recovery。动词是 recover。', en: 'Uncountable: rest days allow recovery. The verb is recover.' },
      collocations: ['muscle recovery', 'training and recovery', 'the recovery period'],
      example: { en: 'Rest days allow muscle tissue to recover and repair.', zh: '休息日让肌肉组织恢复并修复。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈkʌ/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'draws on', sentenceIndex: 9,
      meaning: { zh: '调用，依靠（能量系统）', en: 'to use a particular system or source of fuel' },
      usage: { zh: 'draw on the anaerobic system；后接被调用的对象。', en: 'Draw on the anaerobic system; followed by what is used.' },
      example: { en: 'The body draws on different systems as effort rises.', zh: '随强度上升，身体调用不同系统。' },
    },
    {
      phrase: 'per beat', sentenceIndex: 18,
      meaning: { zh: '每次心跳，每搏', en: 'for each contraction of the heart' },
      usage: { zh: '生理描述；pump more blood per beat、stroke per beat。', en: 'Physiology usage: pump more blood per beat.' },
      example: { en: 'A trained heart pumps more blood per beat at rest.', zh: '训练有素的心脏休息时每搏泵血更多。' },
    },
    {
      phrase: 'build up', sentenceIndex: 26,
      meaning: { zh: '积累，逐渐堆积（废物）', en: 'to collect in working muscles over the session' },
      usage: { zh: 'waste products build up；与 clear 相对。', en: 'Waste products build up; the opposite is clear.' },
      example: { en: 'Recovery clears waste products that build up in muscles.', zh: '恢复过程清除肌肉里堆积的废物。' },
    },
    {
      phrase: 'breaks down', sentenceIndex: 24,
      meaning: { zh: '分解，轻微破坏（肌肉组织）', en: 'to split small amounts of muscle tissue during exercise' },
      usage: { zh: 'break down tissue；与 rebuild 相对。', en: 'Break down tissue; the opposite is rebuild.' },
      example: { en: 'Exercise breaks down muscle tissue in small amounts.', zh: '运动会轻微分解肌肉组织。' },
    },
    {
      phrase: 'warm up', sentenceIndex: 31,
      meaning: { zh: '热身，正式运动前的准备活动', en: 'the light preparation before the main exercise session' },
      usage: { zh: '名词或动词；a proper warm up、warm up before training。', en: 'Noun or verb: a proper warm up, warm up before training.' },
      example: { en: 'A warm up raises muscle temperature before the session.', zh: '热身在训练前提升肌肉温度。' },
    },
    {
      phrase: 'reaches a plateau', sentenceIndex: 49,
      meaning: { zh: '进入平台期，成绩不再提升', en: 'to stop making gains despite continued training' },
      usage: { zh: '训练语境；reach a plateau、break through a plateau。', en: 'Training context: reach a plateau, break through a plateau.' },
      example: { en: 'Ignoring rest, even a strong athlete reaches a plateau.', zh: '忽视休息，再强的运动员也会进入平台期。' },
    },
  ],
  tips: [
    {
      title: { zh: '概览句先答单选，复述段再填笔记', en: 'Overview sentences feed the choice items' },
      body: {
        zh: 'Part 4 开头几句话给出总体结论，31 到 34 题答案集中在概览段；35 到 40 题的术语在后面复述段。听到 The classic experiments 这类路标时，再开始盯填空答案词。',
        en: 'The opening sentences give the overview, and items 31 to 34 sit there; the terms for 35 to 40 appear in the restatement section. Start watching for completion answers after a signpost such as The classic experiments.',
      },
    },
    {
      title: { zh: '预判词性再等答案词', en: 'Predict the word class before listening' },
      body: {
        zh: '第 35 题空前是 the，填系统名称；第 37 题空后是 and repair，填并列动词；第 40 题空前是 and，填与 training 并列的名词。听前把词性写在空格旁，录音里只等那一类词。',
        en: 'Item 35 follows the and names a system; item 37 precedes and repair, expecting a parallel verb; item 40 follows and, expecting a noun parallel to training. Note the predicted word class beside each gap before listening.',
      },
    },
    {
      title: { zh: '对比系统时抓时长与强度', en: 'Match systems to length and intensity' },
      body: {
        zh: '第 32 题问系统切换的原因，干扰项常把两个系统的特点互换。听到 anaerobic、aerobic 时记下各自对应的时长（短跑与匀速长距离），答案取与 length and intensity 对应的那一侧。',
        en: 'Item 32 asks why systems switch, and distractors swap the systems’ features. Note the effort type beside anaerobic and aerobic, sprint versus steady endurance, and choose the side matched to length and intensity.',
      },
    },
  ],
};
