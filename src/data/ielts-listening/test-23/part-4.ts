import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 23 · Part 4 — 微塑料讲座（单人，英式口音）。原创仿真材料，非官方真题。
 *
 * 结构：来源与迁移路径（笔记 31–32）→ 生态影响（笔记 33）→ 检测方法（笔记 34）
 * → 清除难度、海洋生物风险与最终沉积（单选 35–37）→ 各类来源对应的颗粒形态（配对 38–40）。
 * 题块顺序与录音一致；讲座含定义、机制、例子与数据性描述。
 */
export const test23Part4: ListeningLesson = {
  slug: 'test-23-part-4',
  part: 4,
  status: 'published',
  title: { zh: '微塑料', en: 'Microplastics' },
  summary: {
    zh: '一场关于微塑料的讲座：大块塑料碎裂与衣物纤维、洗护珠粒两类来源，雨水与河流如何把颗粒带入海洋，颗粒如何进入食物链，研究人员如何用水样和细网在实验室检测，以及清除难度、海洋生物累积风险、最终沉积和各类来源对应的颗粒形态。',
    en: 'A lecture on microplastics: sources from broken waste, clothing fibres and care beads, how rainwater and rivers carry particles to the sea, their path through the food chain, how researchers detect them with water samples and fine nets, the difficulty of removal, the build-up risk to marine life, final settlement, and the particle shape each source produces.',
  },
  accent: { zh: '讲师为英式口音，术语会重复并举例说明。', en: 'The lecturer speaks with a British accent and repeats key terms with examples.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Larger plastic items crack into smaller', cells: [[{ blank: 31 }]] },
        { lead: 'Particles reach the sea when carried by', cells: [[{ blank: 32 }]] },
        { lead: 'Particles move upward through the', cells: [[{ blank: 33 }]] },
        { lead: 'Lab samples are filtered through fine', cells: [[{ blank: 34 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why are microplastics so hard to remove from water?',
          options: [
            { key: 'A', text: 'Ordinary filters catch only large debris, and tiny fibres slip through the mesh.' },
            { key: 'B', text: 'They dissolve quickly once they reach the seabed.' },
            { key: 'C', text: 'Most are eaten by fish before they can be collected.' },
          ],
        },
        {
          number: 36,
          stem: 'What is the main risk to marine life?',
          options: [
            { key: 'A', text: 'A single dose causes immediate poisoning.' },
            { key: 'B', text: 'Particles build up in the body over months of feeding.' },
            { key: 'C', text: 'Birds cannot nest where fragments are present.' },
          ],
        },
        {
          number: 37,
          stem: 'Where do the smallest particles eventually settle?',
          options: [
            { key: 'A', text: 'They float at the surface for several years.' },
            { key: 'B', text: 'They remain suspended in the water column forever.' },
            { key: 'C', text: 'Some sink and settle in the seabed sediment.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What does each source produce? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'thin threads that match the garment material' },
        { key: 'B', text: 'round, smooth beads about a grain of salt' },
        { key: 'C', text: 'flat, clear pieces that flex under the microscope' },
        { key: 'D', text: 'hard pellets that sink straight to the seabed' },
        { key: 'E', text: 'large fragments floating at the surface' },
        { key: 'F', text: 'coloured fibres woven into fishing rope' },
      ],
      items: [
        { number: 38, text: 'threads from synthetic clothing' },
        { number: 39, text: 'beads from personal care products' },
        { number: 40, text: 'film from packaging' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['fragments'], evidence: 4,
      explanation: {
        zh: '定位句 4：A bottle, a bag or a fishing rope exposed to sun and wind slowly cracks into smaller fragments。大块塑料碎裂后形成碎片，填 fragments；句 5 的 polymer 是材质属性，不是碎裂产物。',
        en: 'Sentence 4: "A bottle, a bag or a fishing rope exposed to sun and wind slowly cracks into smaller fragments". Broken waste produces fragments. The polymer in sentence 5 describes the material, not the broken product.',
      },
    },
    {
      number: 32, accepted: ['rivers'], evidence: 11,
      explanation: {
        zh: '定位句 11：Rivers carry fragments downstream, and in coastal regions the particles enter the sea。河流把颗粒带向海洋，填 rivers；句 10 的 runoff 只是雨水径流，不是入海通道。',
        en: 'Sentence 11: "Rivers carry fragments downstream, and in coastal regions the particles enter the sea". Rivers carry particles to the sea. Runoff in sentence 10 is rainwater flow, not the route into the ocean.',
      },
    },
    {
      number: 33, accepted: ['food chain'], evidence: 17,
      explanation: {
        zh: '定位句 17：When one animal eats another, the particles move upward through the food chain。两个词，符合 TWO WORDS 限制；句 16 的 fish、shellfish 是具体动物，不是这个上位概念。',
        en: 'Sentence 17: "When one animal eats another, the particles move upward through the food chain". Two words, within the TWO WORDS limit. Fish and shellfish in sentence 16 are specific animals, not this general term.',
      },
    },
    {
      number: 34, accepted: ['nets'], evidence: 24,
      explanation: {
        zh: '定位句 24：the sample is filtered through fine nets, and the trapped particles are counted under a microscope。实验室用细网过滤水样，填 nets；句 25 的 microscope 是计数工具，不是过滤器材。',
        en: 'Sentence 24: "the sample is filtered through fine nets, and the trapped particles are counted under a microscope". Lab samples are filtered through nets. The microscope in sentence 25 is the counting tool, not the filter.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 28,
      explanation: {
        zh: '定位句 28：A filter can catch large debris, but the tiniest fibres slip through even fine mesh。滤网只拦大件、细纤维漏网对应 A；B 的溶解和 C 的被鱼吃掉在讲座中都没有出现。',
        en: 'Sentence 28: "A filter can catch large debris, but the tiniest fibres slip through even fine mesh". Filters catch debris while fibres slip through, matching A. Dissolving in B and being eaten in C are never mentioned.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：animals spend months feeding around fragments, and the particles build up in their bodies over time。长期取食后颗粒在体内累积对应 B；A 的单次急性中毒与句 30 的 not always poisoning at one dose 相反，C 的无法筑巢在讲解中没有出现。',
        en: 'Sentence 31: "animals spend months feeding around fragments, and the particles build up in their bodies over time". A gradual build-up matches B. One-dose poisoning in A contradicts not always poisoning at one dose in sentence 30, and nesting trouble in C is never mentioned.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 35,
      explanation: {
        zh: '定位句 35：Over months, some pieces sink to the seabed and settle in the sediment。沉入海床沉积物对应 C；A 的常年漂浮和 B 的永远悬浮与句 14 的漂移后沉降描述不符。',
        en: 'Sentence 35: "Over months, some pieces sink to the seabed and settle in the sediment". Sinking into seabed sediment matches C. Floating for years in A and staying suspended forever in B contradict the drift-and-settle description in sentence 14.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 37,
      explanation: {
        zh: '定位句 37：Fragments from synthetic clothing appear as thin threads, often blue or black, and they match the material of the garment。衣物纤维是与衣料同色的细线，对应 A；F 的编进钓鱼绳的纤维不是衣物来源。',
        en: 'Sentence 37: "Fragments from synthetic clothing appear as thin threads, often blue or black, and they match the material of the garment". Clothing fibres are garment-matching threads, matching A. Fibres woven into rope in F are not a clothing source.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 38,
      explanation: {
        zh: '定位句 38：Beads from personal care products are round and smooth, about the size of a salt grain。洗护珠粒圆而光滑、约盐粒大小，对应 B；D 的硬颗粒直接沉底不是珠粒形态。',
        en: 'Sentence 38: "Beads from personal care products are round and smooth, about the size of a salt grain". Round smooth beads match B. Hard pellets sinking straight down in D are not the bead form.',
      },
    },
    {
      number: 40, accepted: ['C'], evidence: 39,
      explanation: {
        zh: '定位句 39：Film from packaging tears into flat, clear pieces that flex when touched under the microscope。包装薄膜裂成扁平透明、可弯曲的碎片，对应 C；E 的漂浮大块碎片不是薄膜来源。',
        en: 'Sentence 39: "Film from packaging tears into flat, clear pieces that flex when touched under the microscope". Packaging film becomes flat clear flexible pieces, matching C. Large floating fragments in E are not the film source.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'A single plastic bottle can shed thousands of tiny pieces before it reaches the recycling bin.' },
    { speaker: 'lecturer', text: 'These pieces, smaller than a grain of rice, are what scientists call microplastics.' },
    { speaker: 'lecturer', text: 'We will trace where they come from, how they move, what they do to ecosystems, and how researchers detect them.' },
    { speaker: 'lecturer', text: 'The first source is the breakdown of larger plastic waste.' },
    { speaker: 'lecturer', text: 'A bottle, a bag or a fishing rope exposed to sun and wind slowly cracks into smaller fragments.' },
    { speaker: 'lecturer', text: 'Each fragment keeps the polymer of the original item, but it can no longer be reused as a whole object.' },
    { speaker: 'lecturer', text: 'A second source is materials that shed fibres during ordinary use.' },
    { speaker: 'lecturer', text: 'Synthetic clothing releases fine threads every time it is washed, and these threads pass through standard filters.' },
    { speaker: 'lecturer', text: 'Tiny beads added to some personal care products wash straight down the drain after use.' },
    { speaker: 'lecturer', text: 'Once these particles leave our homes, they enter the drainage system.' },
    { speaker: 'lecturer', text: 'From there, the smallest ones travel with rainwater and runoff, and many reach rivers.' },
    { speaker: 'lecturer', text: 'Rivers carry fragments downstream, and in coastal regions the particles enter the sea.' },
    { speaker: 'lecturer', text: 'Wind also lifts light pieces from open waste sites and drops them far from their source.' },
    { speaker: 'lecturer', text: 'At sea, microplastics split into two broad groups by size.' },
    { speaker: 'lecturer', text: 'Large fragments float near the surface, while the smallest particles drift through the water column.' },
    { speaker: 'lecturer', text: 'Aquatic animals mistake small fragments for food, and the particles pass through their digestive systems.' },
    { speaker: 'lecturer', text: 'Studies have found fibres in fish, shellfish and birds that feed near the surface.' },
    { speaker: 'lecturer', text: 'When one animal eats another, the particles move upward through the food chain.' },
    { speaker: 'lecturer', text: 'The long-term health effects are still being studied, but the physical blockage of the gut is already documented.' },
    { speaker: 'lecturer', text: 'Microplastics also carry chemical additives on their surface, which may leach into the surrounding water.' },
    { speaker: 'lecturer', text: 'In freshwater systems, fragments settle in lake beds and are eaten by bottom-dwelling insects.' },
    { speaker: 'lecturer', text: 'Those insects are then food for fish, so the same cycle repeats inland.' },
    { speaker: 'lecturer', text: 'So how do scientists detect them in the field?' },
    { speaker: 'lecturer', text: 'The standard method begins with water samples taken at several depths and locations.' },
    { speaker: 'lecturer', text: 'In the lab, the sample is filtered through fine nets, and the trapped particles are counted under a microscope.' },
    { speaker: 'lecturer', text: 'Researchers record the shape, colour and polymer type of each piece.' },
    { speaker: 'lecturer', text: 'Sediment cores from the seabed show how particle numbers have changed over recent decades.' },
    { speaker: 'lecturer', text: 'Because the particles are so small, removal from the environment is extremely difficult.' },
    { speaker: 'lecturer', text: 'A filter can catch large debris, but the tiniest fibres slip through even fine mesh.' },
    { speaker: 'lecturer', text: 'Once scattered across water and sediment, collecting them back would mean treating huge volumes of water.' },
    { speaker: 'lecturer', text: 'The main risk to marine life is not always poisoning at one dose.' },
    { speaker: 'lecturer', text: 'Rather, animals spend months feeding around fragments, and the particles build up in their bodies over time.' },
    { speaker: 'lecturer', text: 'Birds that nest on the coast have been found carrying fibres in their stomach pellets.' },
    { speaker: 'lecturer', text: 'Researchers therefore treat microplastics as a widespread, persistent pollutant rather than a single local spill.' },
    { speaker: 'lecturer', text: 'Where do the smallest particles eventually settle?' },
    { speaker: 'lecturer', text: 'Over months, some pieces sink to the seabed and settle in the sediment.' },
    { speaker: 'lecturer', text: 'Now let us match each source to the kind of particle it produces.' },
    { speaker: 'lecturer', text: 'Fragments from synthetic clothing appear as thin threads, often blue or black, and they match the material of the garment.' },
    { speaker: 'lecturer', text: 'Beads from personal care products are round and smooth, about the size of a salt grain, before they break down further.' },
    { speaker: 'lecturer', text: 'Film from packaging tears into flat, clear pieces that flex when touched under the microscope.' },
    { speaker: 'lecturer', text: 'It is worth noting that not every tiny speck of plastic in a sample counts as a microplastic.' },
    { speaker: 'lecturer', text: 'Lab staff remove organic matter by heating the sample, then sort the remaining particles by hand.' },
    { speaker: 'lecturer', text: 'Quality control matters, because counting errors can make a clean site look polluted.' },
    { speaker: 'lecturer', text: 'In a later session we can look at policy responses to this problem.' },
    { speaker: 'lecturer', text: 'Before we move on, let me repeat the four stages, source, transport, effect and detection.' },
    { speaker: 'lecturer', text: 'The source tells us what item the plastic came from, and the transport shows how it reached the water.' },
    { speaker: 'lecturer', text: 'The effect section tracks its movement through animals, and detection covers the field and lab methods.' },
    { speaker: 'lecturer', text: 'Students on this course will write a short report on one coastal site next month.' },
    { speaker: 'lecturer', text: 'You should collect three water samples and record any fibres or beads you identify.' },
    { speaker: 'lecturer', text: 'Bring your notes to the seminar, and we will compare findings across the different sites.' },
    { speaker: 'lecturer', text: 'That brings us to the end of this section, and I will take questions after the break.' },
  ],
  vocabulary: [
    {
      term: 'fragments', phonetic: '/ˈfræɡmənts/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '碎片，碎块（碎裂后的小塑料件）', en: 'small broken pieces of a larger plastic object' },
      usage: { zh: '可数名词复数；plastic fragments、broken fragments。单数 fragment。', en: 'Countable plural: plastic fragments, broken fragments. The singular is fragment.' },
      collocations: ['small fragments', 'plastic fragments', 'broken fragments'],
      example: { en: 'Sun and wind crack the bottle into fragments.', zh: '日晒风蚀把瓶子裂成碎片。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /mənts/ 轻读。', en: 'Two syllables, stressed on the first, with a light final /mənts/.' },
    },
    {
      term: 'polymer', phonetic: '/ˈpɒlɪmə/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '聚合物（塑料的化学材质）', en: 'the chemical substance that plastic is made from' },
      usage: { zh: '可数名词；polymer type、recycled polymer。化学讲座高频词。', en: 'Countable: polymer type, recycled polymer. Common in chemistry talks.' },
      collocations: ['the original polymer', 'polymer type', 'a synthetic polymer'],
      example: { en: 'Each fragment keeps the polymer of the bottle.', zh: '每片碎片保留着瓶子的聚合物。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /mə/。', en: 'Three syllables, stressed on the first, ending in /mə/.' },
    },
    {
      term: 'synthetic', phonetic: '/sɪnˈθetɪk/', partOfSpeech: 'adj.', sentenceIndex: 7,
      meaning: { zh: '合成的（人造纤维，非天然材料）', en: 'man-made material rather than natural fibre such as cotton' },
      usage: { zh: 'synthetic clothing、synthetic fibre。反义是 natural。', en: 'Synthetic clothing, synthetic fibre. The opposite is natural.' },
      collocations: ['synthetic clothing', 'synthetic fibres', 'synthetic material'],
      example: { en: 'Synthetic threads release every time the garment is washed.', zh: '这件衣服每次洗涤都会脱落合成纤维。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈθet/，/θ/ 清辅音。', en: 'Three syllables with stress on the second and a voiceless /θ/.' },
    },
    {
      term: 'runoff', phonetic: '/ˈrʌnɒf/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '径流（雨水流过地面带走污染物）', en: 'rainwater that flows over the ground and carries material with it' },
      usage: { zh: '不可数；rainwater runoff、surface runoff。复合词 run 加 off。', en: 'Uncountable: rainwater runoff, surface runoff. Compound of run and off.' },
      collocations: ['rainwater runoff', 'surface runoff', 'carried by runoff'],
      example: { en: 'Runoff carries particles into the nearest river.', zh: '径流把颗粒带进最近的河流。' },
      listening: { zh: '复合词重音在第一部分，/rʌ/ 短元音。', en: 'Compound stressed on the first part, with short /rʌ/.' },
    },
    {
      term: 'microscope', phonetic: '/ˈmaɪkrəskəʊp/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '显微镜（放大观察细小颗粒的仪器）', en: 'an instrument that magnifies tiny particles for inspection' },
      usage: { zh: '可数；under a microscope。动词 microscopically 不常用。', en: 'Countable: under a microscope. The adverb is rare.' },
      collocations: ['under a microscope', 'count under the microscope', 'an electron microscope'],
      example: { en: 'The beads are counted under a microscope in the lab.', zh: '实验室里在显微镜下计数珠粒。' },
      listening: { zh: '三个音节，重音在第一音节，/skəʊp/ 清晰读出。', en: 'Three syllables, stressed on the first; pronounce /skəʊp/ clearly.' },
    },
    {
      term: 'sediment', phonetic: '/ˈsedɪmənt/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '沉积物（海床或湖底积存的颗粒层）', en: 'the layer of particles that settles on the seabed or lake bed' },
      usage: { zh: '不可数；seabed sediment、sediment core。动词 sediment 少见。', en: 'Uncountable: seabed sediment, sediment core. The verb is rare.' },
      collocations: ['seabed sediment', 'settle in the sediment', 'sediment cores'],
      example: { en: 'Some fragments sink and settle in the sediment.', zh: '部分碎片下沉并积存在沉积物中。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /mənt/。', en: 'Three syllables, stressed on the first, ending in /mənt/.' },
    },
    {
      term: 'persistent', phonetic: '/pəˈsɪstənt/', partOfSpeech: 'adj.', sentenceIndex: 33,
      meaning: { zh: '持久的，难以降解的（污染物长期存留）', en: 'lasting a long time in the environment, slow to break down' },
      usage: { zh: '环境语境；persistent pollutant、persistent chemicals。动词 persist。', en: 'Environmental sense: persistent pollutant, persistent chemicals. The verb is persist.' },
      collocations: ['a persistent pollutant', 'persistent chemicals', 'persistent in the water'],
      example: { en: 'Microplastics are treated as a persistent pollutant.', zh: '微塑料被视为持久性污染物。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsɪs/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'breakdown of', sentenceIndex: 3,
      meaning: { zh: '碎裂，分解成小部分', en: 'the process of something splitting into smaller pieces' },
      usage: { zh: '名词短语；the breakdown of waste。动词短语 break down。', en: 'Noun phrase: the breakdown of waste. The verb form is break down.' },
      example: { en: 'The breakdown of bags produces thin fragments.', zh: '塑料袋分解后产生细小碎片。' },
    },
    {
      phrase: 'pass through', sentenceIndex: 7,
      meaning: { zh: '穿过，透过（过滤材料）', en: 'to go through a filter or barrier without being caught' },
      usage: { zh: '及物；pass through filters、pass through the mesh。', en: 'Transitive: pass through filters, pass through the mesh.' },
      example: { en: 'The threads pass through standard filters.', zh: '这些纤维穿得过普通滤网。' },
    },
    {
      phrase: 'mistake small fragments for food', sentenceIndex: 15,
      meaning: { zh: '把小碎片误当成食物', en: 'to wrongly identify broken plastic as edible food' },
      usage: { zh: '结构是 mistake A for B；过去式 mistook。', en: 'The structure is mistake A for B; the past form is mistook.' },
      example: { en: 'Fish mistake the fragments for food.', zh: '鱼把碎片误当成食物。' },
    },
    {
      phrase: 'slip through', sentenceIndex: 28,
      meaning: { zh: '漏过，没能被拦住', en: 'to escape a filter or barrier by being too small' },
      usage: { zh: '及物；slip through the mesh、slip through the net。', en: 'Transitive: slip through the mesh, slip through the net.' },
      example: { en: 'The finest fibres slip through even fine mesh.', zh: '最细的纤维连细网也漏得过。' },
    },
    {
      phrase: 'build up', sentenceIndex: 31,
      meaning: { zh: '累积，逐渐增多', en: 'to collect and increase in amount over time' },
      usage: { zh: '不及物或可分开；particles build up、build up in the body。', en: 'Intransitive or separable: particles build up, build up in the body.' },
      example: { en: 'Particles build up in the body over months.', zh: '颗粒在数月内在体内累积。' },
    },
    {
      phrase: 'settle in', sentenceIndex: 35,
      meaning: { zh: '沉降到……之中', en: 'to sink and come to rest in a place' },
      usage: { zh: '及物；settle in the sediment、settle in the lake bed。', en: 'Transitive: settle in the sediment, settle in the lake bed.' },
      example: { en: 'Some pieces settle in the seabed sediment.', zh: '部分碎片沉入海床沉积物。' },
    },
  ],
  tips: [
    {
      title: { zh: '预测词性再听笔记答案', en: 'Predict the part of speech' },
      body: {
        zh: '第 31 空前是 smaller，填名词 fragments；第 32 空前是 carried by，填河流名 rivers；第 33 空在 the 后、食物链概念，填 food chain；第 34 空在 fine 后，填过滤器材 nets。听之前把词性和类别写在空格旁。',
        en: 'Gap 31 follows smaller, so a noun fragments fits. Gap 32 follows carried by, so rivers fits. Gap 33 sits in the food-chain concept after the. Gap 34 follows fine, so a filter nets fits. Note the predicted part of speech beside each gap.',
      },
    },
    {
      title: { zh: '配对题按形态词去对选项', en: 'Match on shape words' },
      body: {
        zh: '配对三个来源对应三种形态：细线、圆珠、扁平薄膜。听前各记一个形态词：threads、round beads、flat clear pieces；听到衣物、珠粒、薄膜时直接拿形态词对选项，不要整句翻译。',
        en: 'The three sources match three shapes: threads, round beads, flat film. Note one shape word each before listening: threads, round beads, flat clear pieces. Match the shape when you hear clothing, beads or film rather than translating whole options.',
      },
    },
    {
      title: { zh: '讲座结构信号词定位题块', en: 'Use lecture signposts' },
      body: {
        zh: 'The first source、A second source 对应来源段；So how do scientists detect 进入检测方法；Where do the smallest particles settle 引出单选沉积题；Now let us match 进入配对段。听到信号词就检查自己填到了哪个题块。',
        en: 'The first source and A second source open the source section; So how do scientists detect introduces the method; Where do the smallest particles settle opens the settlement choice; Now let us match opens the matching section. Check your place in the blocks after each signpost.',
      },
    },
  ],
};
