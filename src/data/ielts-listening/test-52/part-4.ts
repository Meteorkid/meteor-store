import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 52 · Part 4 — 嗅觉的科学（单人讲座）。原创仿真材料，非官方真题。
 *
 * 顺序：气味分子路径 → 受体类型 → 记忆与情绪联结 → 职业辨香（单选块在前半段），
 * 后半段按笔记顺序复述分子入口、信号去向、受体响应类别、情绪联结、辨香训练与长期提升（填空块）。
 * 题块顺序与录音顺序一致。开场用反思式提问，不用 Today's lecture is about。
 */
export const test52Part4: ListeningLesson = {
  slug: 'test-52-part-4',
  part: 4,
  status: 'published',
  title: { zh: '嗅觉的科学', en: 'The science of smell' },
  summary: {
    zh: '讲座讲解嗅觉机制：气味分子随空气进入鼻腔，受体组合编码出特定气味，信号沿短通路传到大脑，靠近记忆与情绪中枢，因此气味容易唤起旧日场景；职业辨香者靠训练区分相近气味，嗅觉训练随时间提升分辨力。单选锁定气味抵达大脑的方式、人类受体特点、气味联结记忆的原因与职业嗅觉依据，填空复述入口、信号去向、分子类别、情绪联结、辨香与长期训练。',
    en: 'Olfaction: molecules enter through the nose, receptor combinations code each scent, signals reach the brain near memory and emotion centres, and trained noses separate similar odours; practice sharpens the sense over time. Singles cover the brain route, receptors, memory links and trained discrimination; notes recap entry, destination, classes, emotion, discrimination and training.',
  },
  accent: { zh: '讲师为美式男声，讲解节奏清晰，机制分步处会放慢。', en: 'The lecturer speaks with an American male accent at a clear pace, slowing at each step of the mechanism.' },
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
          stem: 'How does smell reach the brain?',
          options: [
            { key: 'A', text: 'Light signals travel down the optic nerve.' },
            { key: 'B', text: 'Odour molecules drift through the air to receptors in the nose.' },
            { key: 'C', text: 'Sound waves vibrate the inner ear.' },
          ],
        },
        {
          number: 32,
          stem: 'What distinguishes human smell receptors?',
          options: [
            { key: 'A', text: 'Many receptor types detect a wide range of molecules.' },
            { key: 'B', text: 'Each receptor responds to exactly one molecule.' },
            { key: 'C', text: 'Receptors are located only on the tongue.' },
          ],
        },
        {
          number: 33,
          stem: 'Why do smells link so strongly to memory?',
          options: [
            { key: 'A', text: 'Smell is processed entirely in the visual cortex.' },
            { key: 'B', text: 'Smell signals pass through the taste centre only.' },
            { key: 'C', text: 'Smell routes close to memory and emotion centres.' },
          ],
        },
        {
          number: 34,
          stem: 'What do professional smell workers rely on?',
          options: [
            { key: 'A', text: 'A device that reads every molecule online.' },
            { key: 'B', text: 'Trained discrimination between similar odours.' },
            { key: 'C', text: 'A written list of fixed scent prices.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS',
      rows: [
        { lead: 'Odour molecules enter through the', cells: [[{ blank: 35 }]] },
        { lead: 'Receptors send signals to the', cells: [[{ blank: 36 }]] },
        { lead: 'Each receptor responds to a class of', cells: [[{ blank: 37 }]] },
        { lead: 'Smell connects closely to memory and', cells: [[{ blank: 38 }]] },
        { lead: 'Professionals learn to tell similar odours', cells: [[{ blank: 39 }]] },
        { lead: 'Smell training sharpens the sense over', cells: [[{ blank: 40 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['B'], evidence: 5,
      explanation: {
        zh: '定位句 5：Molecules from food, plants or perfumes drift through the air around us。气味分子随空气飘入鼻腔受体，对应 B。A 的视觉神经与 C 的声波内耳在录音中没有依据。',
        en: 'Sentence 5: "Molecules from food, plants or perfumes drift through the air around us". Molecules drifting through air to nose receptors match B. Optic nerve and ear vibration are not mentioned.',
      },
    },
    {
      number: 32, accepted: ['A'], evidence: 9,
      explanation: {
        zh: '定位句 9：Humans carry many receptor types, and together they detect a wide range of molecules。人类有多类受体、共同覆盖广范围分子，对应 A。B 的每个受体只对一种分子与句中 together 相反，C 的舌上受体在录音中没有依据。',
        en: 'Sentence 9: "Humans carry many receptor types, and together they detect a wide range of molecules". Many types covering a wide range match A. One molecule per receptor contradicts together, and tongue receptors are not said.',
      },
    },
    {
      number: 33, accepted: ['C'], evidence: 15,
      explanation: {
        zh: '定位句 15：Once inside the brain, smell signals run close to the memory and emotion centres。嗅觉通路靠近记忆与情绪中枢，对应 C。A 的视觉皮层与 B 的仅经味觉中枢在录音中没有依据。',
        en: 'Sentence 15: "Once inside the brain, smell signals run close to the memory and emotion centres". Routes near memory and emotion centres match C. Visual cortex and taste centre only are not said.',
      },
    },
    {
      number: 34, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：People who work with scent, such as perfumers and tasters, rely on trained discrimination between similar odours。职业辨香者靠训练出的相近气味分辨力，对应 B。A 的在线读分子设备与 C 的固定香价清单在录音中没有依据。',
        en: 'Sentence 21: "People who work with scent, such as perfumers and tasters, rely on trained discrimination between similar odours". Trained discrimination matches B. An online molecule reader and a price list are not said.',
      },
    },
    {
      number: 35, accepted: ['nose'], evidence: 26,
      explanation: {
        zh: '定位句 26：Odour molecules enter through the nose with each breath。分子经鼻腔进入，填 nose。',
        en: 'Sentence 26: "Odour molecules enter through the nose with each breath". Molecules enter through the nose, so write nose.',
      },
    },
    {
      number: 36, accepted: ['brain'], evidence: 29,
      explanation: {
        zh: '定位句 29：Receptors send those signals onward to the brain for interpretation。受体把信号送到大脑解读，填 brain。',
        en: 'Sentence 29: "Receptors send those signals onward to the brain for interpretation". Signals go to the brain, so write brain.',
      },
    },
    {
      number: 37, accepted: ['molecules'], evidence: 31,
      explanation: {
        zh: '定位句 31：Each receptor responds to a class of molecules rather than a single named substance。每个受体响应一类分子，填 molecules。',
        en: 'Sentence 31: "Each receptor responds to a class of molecules rather than a single named substance". Each receptor responds to molecules, so write molecules.',
      },
    },
    {
      number: 38, accepted: ['emotion'], evidence: 34,
      explanation: {
        zh: '定位句 34：Smell connects closely to memory and emotion, which is why scents feel personal。嗅觉紧密联结记忆与情绪，填 emotion。',
        en: 'Sentence 34: "Smell connects closely to memory and emotion, which is why scents feel personal". Smell links to memory and emotion, so write emotion.',
      },
    },
    {
      number: 39, accepted: ['apart'], evidence: 38,
      explanation: {
        zh: '定位句 38：Professionals learn to tell similar odours apart through repeated comparison。职业者靠反复比较把相近气味区分开，填 apart；tell apart 为固定搭配。',
        en: 'Sentence 38: "Professionals learn to tell similar odours apart through repeated comparison". Professionals tell similar odours apart, so write apart; tell apart is the fixed phrase.',
      },
    },
    {
      number: 40, accepted: ['time'], evidence: 41,
      explanation: {
        zh: '定位句 41：Smell training sharpens the sense over time, much like practising a musical skill。嗅觉训练随时间提升感官分辨力，填 time。',
        en: 'Sentence 41: "Smell training sharpens the sense over time, much like practising a musical skill". Training sharpens the sense over time, so write time.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Think for a moment about a scent that brings back a childhood place in an instant.' },
    { speaker: 'lecturer', text: 'That pull, between a smell and a memory, is what this lecture sets out to explain.' },
    { speaker: 'lecturer', text: 'Smell is one of the oldest senses in the human nervous system.' },
    { speaker: 'lecturer', text: 'Before language or written records, animals relied on odour to find food and detect danger.' },
    { speaker: 'lecturer', text: 'To understand how smell works, start with the journey an odour molecule takes.' },
    { speaker: 'lecturer', text: 'Molecules from food, plants or perfumes drift through the air around us.' },
    { speaker: 'lecturer', text: 'They enter the body through the nose as we breathe in.' },
    { speaker: 'lecturer', text: 'At the back of the nasal cavity they meet a layer of smell receptors.' },
    { speaker: 'lecturer', text: 'Each receptor is a special protein on the surface of a nerve cell.' },
    { speaker: 'lecturer', text: 'Humans carry many receptor types, and together they detect a wide range of molecules.' },
    { speaker: 'lecturer', text: 'No single receptor has to name every possible scent in the world.' },
    { speaker: 'lecturer', text: 'A molecule may fit several receptors at once, and the brain reads the combination.' },
    { speaker: 'lecturer', text: 'That pattern of activity is what we experience as a particular odour.' },
    { speaker: 'lecturer', text: 'The nerve signals then travel along a short pathway toward the brain.' },
    { speaker: 'lecturer', text: 'This route is shorter than the paths for sight or sound.' },
    { speaker: 'lecturer', text: 'Once inside the brain, smell signals run close to the memory and emotion centres.' },
    { speaker: 'lecturer', text: 'That closeness explains why a scent can trigger an old memory so quickly.' },
    { speaker: 'lecturer', text: 'A whiff of a familiar kitchen may bring back a grandparent’s home before any word forms.' },
    { speaker: 'lecturer', text: 'Smell also links to mood, so a pleasant odour can ease stress in the moment.' },
    { speaker: 'lecturer', text: 'Not every person smells a scent in the same way.' },
    { speaker: 'lecturer', text: 'Receptor sensitivity varies, and so does the memory attached to a smell.' },
    { speaker: 'lecturer', text: 'People who work with scent, such as perfumers and tasters, rely on trained discrimination between similar odours.' },
    { speaker: 'lecturer', text: 'They compare notes on layers, intensity and how a scent changes over time.' },
    { speaker: 'lecturer', text: 'A professional nose learns to separate a fresh note from an aged one.' },
    { speaker: 'lecturer', text: 'That training builds on the same receptors everyone has, but sharpens the attention given to signals.' },
    { speaker: 'lecturer', text: 'Let us now follow the pathway step by step, as the notes require.' },
    { speaker: 'lecturer', text: 'Odour molecules enter through the nose with each breath.' },
    { speaker: 'lecturer', text: 'They settle on the receptor layer at the back of the nasal cavity.' },
    { speaker: 'lecturer', text: 'The matching receptor cells begin to fire their signals.' },
    { speaker: 'lecturer', text: 'Receptors send those signals onward to the brain for interpretation.' },
    { speaker: 'lecturer', text: 'The brain combines the pattern across many receptors into one odour.' },
    { speaker: 'lecturer', text: 'Each receptor responds to a class of molecules rather than a single named substance.' },
    { speaker: 'lecturer', text: 'Some receptors are broad, while others are tuned to narrow chemical families.' },
    { speaker: 'lecturer', text: 'The signal then moves toward the inner parts of the brain.' },
    { speaker: 'lecturer', text: 'Smell connects closely to memory and emotion, which is why scents feel personal.' },
    { speaker: 'lecturer', text: 'A familiar smell can return a person to a scene decades old.' },
    { speaker: 'lecturer', text: 'Emotion colours the memory, so some scents feel comforting and others sharp.' },
    { speaker: 'lecturer', text: 'Turning to professionals in the scent trade, practice matters more than instinct.' },
    { speaker: 'lecturer', text: 'Professionals learn to tell similar odours apart through repeated comparison.' },
    { speaker: 'lecturer', text: 'They record what each sample smells like and revisit the notes later.' },
    { speaker: 'lecturer', text: 'Over months, small differences become easier to name.' },
    { speaker: 'lecturer', text: 'Smell training sharpens the sense over time, much like practising a musical skill.' },
    { speaker: 'lecturer', text: 'Even people with an ordinary nose can improve their discrimination with regular practice.' },
    { speaker: 'lecturer', text: 'Strong odours can mask weaker ones, so workers test samples in a quiet, neutral room.' },
    { speaker: 'lecturer', text: 'The nose also tires after repeated exposure, and the rest between samples matters.' },
    { speaker: 'lecturer', text: 'Age can soften smell sensitivity, especially after the later decades of life.' },
    { speaker: 'lecturer', text: 'Keeping the nasal passages clear helps the receptors do their job.' },
    { speaker: 'lecturer', text: 'We still do not fully understand how the brain stores a smell label.' },
    { speaker: 'lecturer', text: 'Researchers map receptor families by testing molecules one by one.' },
    { speaker: 'lecturer', text: 'Future work may explain why some scents are hard to put into words.' },
    { speaker: 'lecturer', text: 'In daily life, this sense quietly guides food, safety and social comfort.' },
    { speaker: 'lecturer', text: 'It operates beneath attention, yet it shapes which places feel familiar and safe.' },
    { speaker: 'lecturer', text: 'Remember that the next time a single scent carries you back somewhere familiar.' },
  ],
  vocabulary: [
    {
      term: 'receptor', phonetic: '/rɪˈseptər/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '感受器，嗅觉受体', en: 'the special protein cell that detects odour molecules' },
      usage: { zh: '可数；smell receptors、receptor types、the receptor layer。', en: 'Countable: smell receptors, receptor types.' },
      collocations: ['smell receptors', 'receptor types', 'the receptor layer'],
      example: { en: 'Molecules meet a layer of smell receptors in the nose.', zh: '分子在鼻腔内遇到一层嗅觉受体。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsep/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'molecules', phonetic: '/ˈmɒlɪkjuːlz/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '分子（气味微粒）', en: 'the small particle of food, plant or perfume that carries a scent' },
      usage: { zh: '可数；odour molecules、a class of molecules。', en: 'Countable: odour molecules, a class of molecules.' },
      collocations: ['odour molecules', 'a class of molecules', 'test the molecules'],
      example: { en: 'Odour molecules drift through the air into the nose.', zh: '气味分子随空气飘进鼻腔。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈmɒ/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'odour', phonetic: '/ˈəʊdər/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '气味，嗅感', en: 'the smell detected by the nose, pleasant or otherwise' },
      usage: { zh: '可数；odour molecules、a particular odour。美式拼写 odor。', en: 'Countable: a particular odour. American spelling odor.' },
      collocations: ['odour molecules', 'a particular odour', 'similar odours'],
      example: { en: 'Each receptor combination gives a particular odour.', zh: '每组合受体对应一种特定气味。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈəʊ/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'emotion', phonetic: '/ɪˈməʊʃn/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '情绪，情感', en: 'the feeling centre that smell reaches close to' },
      usage: { zh: '可数；memory and emotion、emotion centres。形容词 emotional。', en: 'Countable: memory and emotion. The adjective is emotional.' },
      collocations: ['memory and emotion', 'emotion centres', 'colour the emotion'],
      example: { en: 'Smell signals run close to the memory and emotion centres.', zh: '嗅觉信号靠近记忆与情绪中枢。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈməʊ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'discrimination', phonetic: '/dɪˌskrɪmɪˈneɪʃn/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '分辨力，辨别能力', en: 'the trained ability to tell similar odours apart' },
      usage: { zh: '不可数；trained discrimination、odour discrimination。动词 discriminate。', en: 'Uncountable: trained discrimination. The verb is discriminate.' },
      collocations: ['trained discrimination', 'odour discrimination', 'improve discrimination'],
      example: { en: 'Professionals rely on trained discrimination between similar odours.', zh: '职业者靠训练出的相近气味分辨力。' },
      listening: { zh: '五个音节，重音在倒数第二音节 /ˈneɪ/。', en: 'Five syllables with stress on the penultimate.' },
    },
    {
      term: 'sensitivity', phonetic: '/ˌsensəˈtɪvəti/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '敏感度，灵敏程度', en: 'how strongly a receptor or person responds to a scent' },
      usage: { zh: '不可数；receptor sensitivity、smell sensitivity。形容词 sensitive。', en: 'Uncountable: receptor sensitivity. The adjective is sensitive.' },
      collocations: ['receptor sensitivity', 'smell sensitivity', 'soften sensitivity'],
      example: { en: 'Receptor sensitivity varies from person to person.', zh: '受体敏感度因人而异。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈtɪv/。', en: 'Five syllables with stress on the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'drift through', sentenceIndex: 5,
      meaning: { zh: '飘游穿过（空气）', en: 'to move slowly through the air' },
      usage: { zh: 'drift through + 介质；气味传播高频。', en: 'Drift through plus a medium; common for scent travel.' },
      example: { en: 'Molecules drift through the air around us.', zh: '分子在我们周围的空气中飘游。' },
    },
    {
      phrase: 'rely on', sentenceIndex: 21,
      meaning: { zh: '依靠，凭借', en: 'to depend on trained discrimination as the working basis' },
      usage: { zh: '及物短语；rely on training、rely on notes。', en: 'Transitive: rely on training, rely on notes.' },
      example: { en: 'Perfumers rely on trained discrimination between odours.', zh: '调香师靠训练出的气味分辨力。' },
    },
    {
      phrase: 'links to', sentenceIndex: 18,
      meaning: { zh: '与……相联系', en: 'to connect smell with mood or memory' },
      usage: { zh: 'link to + 对象；联结关系高频。', en: 'Link to plus a target; common for connections.' },
      example: { en: 'Smell also links to mood and stress.', zh: '嗅觉也与情绪和压力相联系。' },
    },
    {
      phrase: 'over time', sentenceIndex: 41,
      meaning: { zh: '随时间推移', en: 'gradually, as practice continues' },
      usage: { zh: '状语；improve over time、sharpens over time。', en: 'Adverbial: improve over time.' },
      example: { en: 'Smell training sharpens the sense over time.', zh: '嗅觉训练随时间提升感官分辨力。' },
    },
    {
      phrase: 'tires after', sentenceIndex: 44,
      meaning: { zh: '在……之后疲劳', en: 'to lose sensitivity after repeated exposure' },
      usage: { zh: 'tires after + 次数；测试流程高频。', en: 'Tires after plus exposure; common in testing.' },
      example: { en: 'The nose tires after repeated exposure to a sample.', zh: '反复闻同一样本后鼻子会疲劳。' },
    },
    {
      phrase: 'mask weaker ones', sentenceIndex: 43,
      meaning: { zh: '掩盖较弱气味', en: 'to cover milder scents with a strong odour' },
      usage: { zh: 'mask + 气味；辨香干扰高频。', en: 'Mask plus a scent; common for scent interference.' },
      example: { en: 'Strong odours can mask weaker ones in the same room.', zh: '同一房间内浓味会掩盖淡味。' },
    },
  ],
  tips: [
    {
      title: { zh: '单选先排跨感官干扰项', en: 'Cross-out options from other senses first' },
      body: {
        zh: '第 31 题把视觉、听觉通路混进选项；第 32、33 题干扰项把受体放到舌上、把信号放到视觉或味觉中枢。预读时按 sight、hearing、tongue、visual cortex 这类跨感官词先标记，听到它们出现即可排除。',
        en: 'Item 31 mixes sight and hearing pathways in; items 32 and 33 put receptors on the tongue or route signals through visual or taste centres. Mark cross-sense words such as sight, hearing, tongue and visual cortex while pre-reading, and rule them out when they appear.',
      },
    },
    {
      title: { zh: '填空按笔记顺序定位后半段', en: 'Follow the note order in the recap half' },
      body: {
        zh: '第 35–40 题在后半段按路径顺序复述：入口、信号去向、分子类别、情绪联结、辨香、长期训练。听到 step by step、notes require 这类路标后，按题号在对应句抓核心名词，不要把前半段的同类细节回填到后面的空里。',
        en: 'Items 35 to 40 recap in pathway order: entry, signal destination, molecule class, emotion, discrimination, long-term training. After a signpost such as step by step or notes require, catch the key noun for that item in order; do not backfill an earlier detail into a later gap.',
      },
    },
    {
      title: { zh: '留意固定搭配中的小品词', en: 'Watch the particle in fixed phrases' },
      body: {
        zh: '第 39 题答案 apart 来自固定搭配 tell apart，只填 apart 即可，不要把 tell、odours 一起写进去；第 40 题 over time 的 time 是核心名词。写前确认空格前后是否已印出搭配的其余部分。',
        en: 'Item 39 answer apart belongs to tell apart; write only apart, not tell or odours. Item 40 time is the noun in over time. Check whether the rest of the collocation is already printed beside the gap before writing.',
      },
    },
  ],
};
