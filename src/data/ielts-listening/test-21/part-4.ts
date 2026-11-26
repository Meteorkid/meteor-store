import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 21 · Part 4 — 深海热液喷口（单人讲座，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：深海生命之问 → 海水下渗与黑烟囱 → 化能合成食物链 → 地壳位置与极端环境 →
 * 探测技术 → 群落周期与对比研究 → 复盘单选（37–40）。笔记填空 31–36 在前半与中段。
 */
export const test21Part4: ListeningLesson = {
  slug: 'test-21-part-4',
  part: 4,
  status: 'published',
  title: { zh: '深海热液喷口', en: 'Deep-sea hydrothermal vents' },
  summary: {
    zh: '讲座介绍深海热液喷口的形成：海水下渗遇热溶解矿物，喷出黑烟囱；细菌靠化能合成支撑食物链，动物不依赖阳光；喷口位于地壳裂缝之上，高温高压塑造特有物种，由深潜器探测。复盘绿洲成因、群落存续年限、细菌与植物的差异及早期考察发现。',
    en: 'The lecture explains how vents form: seawater seeps down, heats up, dissolves minerals and rises as black smokers. Bacteria drive chemosynthesis instead of sunlight; vents sit above crust cracks, extremes shape specialised species, and submersibles explore them. The recap covers the oasis effect, community lifespan, bacteria versus plants and early discoveries.',
  },
  accent: { zh: '发言人为新西兰口音，语速中等。', en: 'The speaker has a New Zealand accent and speaks at a moderate pace.' },
  speechRate: '+2%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Black smokers release hot, mineral-rich', cells: [[{ blank: 31 }]] },
        { lead: 'Vent bacteria carry out', cells: [[{ blank: 32 }]] },
        { lead: 'Vent animals rely on chemical energy rather than', cells: [[{ blank: 33 }]] },
        { lead: 'Vent fields sit above cracks in the ocean', cells: [[{ blank: 34 }]] },
        { lead: 'Extremes: temperature and', cells: [[{ blank: 35 }, { text: ' shape the species' }]] },
        { lead: 'Detection uses deep-sea', cells: [[{ blank: 36 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'Why are vents described as oases?',
          options: [
            { key: 'A', text: 'They concentrate rich life on an otherwise bare deep plain' },
            { key: 'B', text: 'They provide drinking water for surface animals' },
            { key: 'C', text: 'They mark safe routes for deep-sea fishing' },
          ],
        },
        {
          number: 38,
          stem: 'What limits how long a vent community lasts?',
          options: [
            { key: 'A', text: 'The number of visiting submersibles' },
            { key: 'B', text: 'How long the chimney keeps releasing fluid' },
            { key: 'C', text: 'The age of the nearby continental slope' },
          ],
        },
        {
          number: 39,
          stem: 'How do vent bacteria differ from surface plants?',
          options: [
            { key: 'A', text: 'They grow only in warm shallow water' },
            { key: 'B', text: 'They reproduce by laying eggs' },
            { key: 'C', text: 'They do not use light and oxidise fluid chemicals' },
          ],
        },
        {
          number: 40,
          stem: 'What did the early vent expeditions discover?',
          options: [
            { key: 'A', text: 'Dense animal colonies around hot cracks, unexpectedly' },
            { key: 'B', text: 'That all deep-sea animals move to the surface to breed' },
            { key: 'C', text: 'That vents release only cold freshwater' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['fluid'], evidence: 7,
      explanation: {
        zh: '定位句 7：The black smokers release hot, mineral-rich fluid that can reach four hundred degrees Celsius。黑烟囱喷出富含矿物的热流体，填 fluid；句 8 的 sulphur and iron 是流体携带的成分，不是答案词。',
        en: 'Sentence 7: black smokers "release hot, mineral-rich fluid", so fill fluid. Sulphur and iron in sentence 8 are carried components, not the answer word.',
      },
    },
    {
      number: 32, accepted: ['chemosynthesis'], evidence: 10,
      explanation: {
        zh: '定位句 10：special bacteria carry out chemosynthesis, turning chemical energy into living tissue。细菌进行化能合成，填 chemosynthesis；句 11 的 photosynthesis 是地表植物的对照过程。',
        en: 'Sentence 10: special bacteria "carry out chemosynthesis, turning chemical energy into living tissue", so fill chemosynthesis. Photosynthesis in sentence 11 is the surface comparison.',
      },
    },
    {
      number: 33, accepted: ['sunlight'], evidence: 12,
      explanation: {
        zh: '定位句 12：The vent animals rely on chemical energy rather than sunlight。动物依靠化学能而非阳光，填 sunlight；句 11 的 no light at all 是背景说明，题干已给 chemical energy rather than。',
        en: 'Sentence 12: vent animals "rely on chemical energy rather than sunlight", so fill sunlight. No light at all in sentence 11 is background detail.',
      },
    },
    {
      number: 34, accepted: ['crust'], evidence: 14,
      explanation: {
        zh: '定位句 14：The vents themselves sit above cracks in the ocean crust, where the plates slowly pull apart。喷口位于洋壳裂缝之上，填 crust；句 4 的 hot rock beneath the floor 是热源位置，不是答案。',
        en: 'Sentence 14: vents "sit above cracks in the ocean crust", so fill crust. The hot rock in sentence 4 is the heat source, not the answer.',
      },
    },
    {
      number: 35, accepted: ['pressure'], evidence: 16,
      explanation: {
        zh: '定位句 16：Life there faces extremes of temperature and pressure, and only specialised species can persist。塑造物种的极端条件是温度与压力，填 pressure；句 17 的 boiling hot 是温度一侧的细节。',
        en: 'Sentence 16: life faces "extremes of temperature and pressure", so fill pressure. Boiling hot in sentence 17 is the temperature side of the contrast.',
      },
    },
    {
      number: 36, accepted: ['submersibles'], evidence: 21,
      explanation: {
        zh: '定位句 21：Detection uses deep-sea submersibles that descend for hours on each dive。探测依靠深潜器，填 submersibles；句 22 的 remotely operated vehicles 是后来的设备类型，不是题干所指。',
        en: 'Sentence 21: detection uses "deep-sea submersibles that descend for hours", so fill submersibles. Remotely operated vehicles in sentence 22 are a later device type.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 43,
      explanation: {
        zh: '定位句 43：Vents are often called oases because they concentrate rich life in an otherwise bare deep plain。喷口在荒凉深海平原上集中了繁盛生命，对应 A。B 的饮用水、C 的渔路均未提及。',
        en: 'Sentence 43: vents are called oases because they "concentrate rich life in an otherwise bare deep plain", matching A. Drinking water and fishing routes are not mentioned.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 45,
      explanation: {
        zh: '定位句 45：The lifespan of a vent community is limited by how long the chimney keeps releasing fluid。群落存续受烟囱喷液时长限制，对应 B。参观深潜器数量与坡地年代均无关。',
        en: 'Sentence 45: the community lifespan "is limited by how long the chimney keeps releasing fluid", matching B. The number of submersibles and slope age are irrelevant.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 47,
      explanation: {
        zh: '定位句 47：Unlike surface plants, vent bacteria do not use light; they oxidise chemicals from the fluid。细菌不用光、氧化流体化学物，对应 C。浅水生长与产卵都未提及。',
        en: 'Sentence 47: unlike surface plants, vent bacteria "do not use light; they oxidise chemicals from the fluid", matching C. Shallow-water growth and egg laying are not mentioned.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 49,
      explanation: {
        zh: '定位句 49：The early expeditions discovered dense animal colonies around hot cracks, against all expectations。早期考察意外发现热裂缝周围的密集动物群落，对应 A。B 的上浮繁殖、C 的冷淡水均与原文相反。',
        en: 'Sentence 49: early expeditions "discovered dense animal colonies around hot cracks, against all expectations", matching A. Surface breeding and cold freshwater in B and C contradict the lecture.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'How can animals live three kilometres below the ocean surface where sunlight never reaches?' },
    { speaker: 'lecturer', text: 'Until the nineteen seventies, we assumed the deep sea was almost empty of life.' },
    { speaker: 'lecturer', text: 'Then expeditions found dense colonies clustered around cracks in the seabed.' },
    { speaker: 'lecturer', text: 'These sites are called hydrothermal vents, and they rank among the most surprising habitats on Earth.' },
    { speaker: 'lecturer', text: 'Seawater seeps down through the crust until it meets hot rock beneath the ocean floor.' },
    { speaker: 'lecturer', text: 'The heated water dissolves minerals from the rock and rises back toward the surface.' },
    { speaker: 'lecturer', text: 'Where it meets the cold deep water, the minerals settle into tall chimneys known as black smokers.' },
    { speaker: 'lecturer', text: 'The black smokers release hot, mineral-rich fluid that can reach four hundred degrees Celsius.' },
    { speaker: 'lecturer', text: 'The fluid carries sulphur, iron and other compounds that would poison most land animals.' },
    { speaker: 'lecturer', text: 'Around these chimneys, the food web does not start with plants.' },
    { speaker: 'lecturer', text: 'Instead, special bacteria carry out chemosynthesis, turning chemical energy into living tissue.' },
    { speaker: 'lecturer', text: 'In photosynthesis, plants use sunlight to build sugar; here there is no light at all.' },
    { speaker: 'lecturer', text: 'The vent animals rely on chemical energy rather than sunlight.' },
    { speaker: 'lecturer', text: 'Many animals host these bacteria in their own tissues, which is how they survive.' },
    { speaker: 'lecturer', text: 'The vents themselves sit above cracks in the ocean crust, where the plates slowly pull apart.' },
    { speaker: 'lecturer', text: 'Each vent field covers only a few hundred metres, yet it holds thousands of animals.' },
    { speaker: 'lecturer', text: 'Life there faces extremes of temperature and pressure, and only specialised species can persist.' },
    { speaker: 'lecturer', text: 'The water near a chimney may be boiling hot, while the surrounding seabed stays near freezing.' },
    { speaker: 'lecturer', text: 'Animals move between the warm plume and the cool rock to find their preferred range.' },
    { speaker: 'lecturer', text: 'Pressure at this depth is hundreds of times that at the surface, which keeps bodies from collapsing.' },
    { speaker: 'lecturer', text: 'Detecting these fields is hard, because they lie far below the reach of ordinary cameras.' },
    { speaker: 'lecturer', text: 'Detection uses deep-sea submersibles that descend for hours on each dive.' },
    { speaker: 'lecturer', text: 'Early expeditions used manned submersibles with strong lights and sample boxes.' },
    { speaker: 'lecturer', text: 'Today remotely operated vehicles map the chimneys and collect rock cores.' },
    { speaker: 'lecturer', text: 'The first vent communities were found along the Pacific ridge in nineteen seventy seven.' },
    { speaker: 'lecturer', text: 'Before that, no one expected life to thrive without any sunlight.' },
    { speaker: 'lecturer', text: 'The discovery changed how we think about where life can survive.' },
    { speaker: 'lecturer', text: 'Vent animals include tube worms, clams, crabs and pale shrimp with no eyes.' },
    { speaker: 'lecturer', text: 'The tube worms grow fast, reaching over two metres in a single vent field.' },
    { speaker: 'lecturer', text: 'Their red plumes wave in the warm water, absorbing chemicals from the plume.' },
    { speaker: 'lecturer', text: 'Some crabs graze the bacterial mats that coat the chimney walls.' },
    { speaker: 'lecturer', text: 'The species differ from one ridge to another, depending on the local chemistry.' },
    { speaker: 'lecturer', text: 'When a vent stops releasing fluid, the surrounding animals gradually die off.' },
    { speaker: 'lecturer', text: 'The chimney then becomes bare rock, until a new vent opens nearby.' },
    { speaker: 'lecturer', text: 'Larvae drift on the deep currents until they reach an active field.' },
    { speaker: 'lecturer', text: 'This cycle means a vent community lasts only as long as its chimney stays active.' },
    { speaker: 'lecturer', text: 'Researchers compare vent animals with species near cold seeps on the continental slope.' },
    { speaker: 'lecturer', text: 'Both habitats rely on bacteria, but the vents are far hotter and more energetic.' },
    { speaker: 'lecturer', text: 'Some scientists study vents as a model for how life might begin on other planets.' },
    { speaker: 'lecturer', text: 'The chemistry here resembles the conditions thought to exist in early Earth oceans.' },
    { speaker: 'lecturer', text: 'Samples brought back to the surface must be kept cold and labelled quickly.' },
    { speaker: 'lecturer', text: 'Each dive records temperature, depth and the species seen around the chimney.' },
    { speaker: 'lecturer', text: 'Now let me review the main points before the discussion.' },
    { speaker: 'lecturer', text: 'Vents are often called oases because they concentrate rich life in an otherwise bare deep plain.' },
    { speaker: 'lecturer', text: 'A bare seabed stretches for kilometres around, yet the chimney supports a dense colony.' },
    { speaker: 'lecturer', text: 'The lifespan of a vent community is limited by how long the chimney keeps releasing fluid.' },
    { speaker: 'lecturer', text: 'Once the flow stops, the animals cannot feed, and the colony disperses or dies.' },
    { speaker: 'lecturer', text: 'Unlike surface plants, vent bacteria do not use light; they oxidise chemicals from the fluid.' },
    { speaker: 'lecturer', text: 'Surface plants need carbon dioxide, water and sunlight to grow.' },
    { speaker: 'lecturer', text: 'The early expeditions discovered dense animal colonies around hot cracks, against all expectations.' },
    { speaker: 'lecturer', text: 'Before nineteen seventy seven, the deep ocean was thought to hold only scattered scavengers.' },
    { speaker: 'lecturer', text: 'The samples and photos proved that whole ecosystems could form without light.' },
    { speaker: 'lecturer', text: 'Next week we will look at how these findings affect the search for life beyond Earth.' },
  ],
  vocabulary: [
    {
      term: 'hydrothermal', phonetic: '/ˌhaɪdrəˈθɜːml/', partOfSpeech: 'adj.', sentenceIndex: 3,
      meaning: { zh: '热液的，与热水有关的', en: 'relating to heated water beneath the earth' },
      usage: { zh: '科学术语；hydrothermal vents、hydrothermal fluid。', en: 'Scientific term: hydrothermal vents, hydrothermal fluid.' },
      collocations: ['hydrothermal vents', 'hydrothermal activity', 'the hydrothermal field'],
      example: { en: 'Hydrothermal vents lie along the ocean ridges.', zh: '热液喷口分布在洋脊沿线。' },
      listening: { zh: '重音在第三音节 /ˈθɜː/，开头 /ˌhaɪ/ 次重音。', en: 'Stress the third syllable; the opening /ˌhaɪ/ is secondary.' },
    },
    {
      term: 'seeps', phonetic: '/siːps/', partOfSpeech: 'v.', sentenceIndex: 4,
      meaning: { zh: '渗漏，渗入', en: 'to flow slowly through small gaps' },
      usage: { zh: '动词；seep down through、water seeps through。名词 seepage。', en: 'Verb: seep down through; the noun is seepage.' },
      collocations: ['seeps down', 'water seeps through', 'seep into the rock'],
      example: { en: 'Seawater seeps down through the ocean crust.', zh: '海水沿洋壳向下渗漏。' },
      listening: { zh: '单音节，与 sleep 押韵，词尾 /s/ 清读。', en: 'One syllable rhyming with sleep; the final /s/ is voiceless.' },
    },
    {
      term: 'minerals', phonetic: '/ˈmɪnərəlz/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '矿物', en: 'solid chemical substances formed in rock' },
      usage: { zh: '可数复数；dissolve minerals、mineral deposits。', en: 'Countable plural: dissolve minerals, mineral deposits.' },
      collocations: ['dissolve minerals', 'metal minerals', 'mineral content'],
      example: { en: 'The hot water dissolves minerals from the rock.', zh: '热水溶解岩石中的矿物。' },
      listening: { zh: '重音在第一音节 /ˈmɪ/，词尾 /z/ 清晰。', en: 'Stress the first syllable; the final /z/ is clear.' },
    },
    {
      term: 'chimneys', phonetic: '/ˈtʃɪmniz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '（热液）烟囱', en: 'tall mineral towers built around a vent' },
      usage: { zh: '可数复数；black smoker chimney、chimney wall。', en: 'Countable plural: black smoker chimney, chimney wall.' },
      collocations: ['tall chimneys', 'the chimney walls', 'a single chimney'],
      example: { en: 'Minerals settle into tall chimneys on the seabed.', zh: '矿物在海床上堆成高烟囱。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtʃɪm/，中间 /n/ 弱读。', en: 'Two syllables with stress on the first; the middle /n/ is soft.' },
    },
    {
      term: 'chemosynthesis', phonetic: '/ˌkiːməʊˈsɪnθəsɪs/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '化能合成', en: 'building tissue from chemical energy without light' },
      usage: { zh: '不可数；carry out chemosynthesis。对比 photosynthesis。', en: 'Uncountable: carry out chemosynthesis; contrast photosynthesis.' },
      collocations: ['carry out chemosynthesis', 'chemosynthesis bacteria', 'vent chemosynthesis'],
      example: { en: 'Vent bacteria rely on chemosynthesis rather than light.', zh: '喷口细菌靠化能合成而非光照。' },
      listening: { zh: '重音在第三音节 /ˈsɪn/，开头 /ˌkiː/ 次重音。', en: 'Stress the third syllable; the opening is secondary.' },
    },
    {
      term: 'crust', phonetic: '/krʌst/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '地壳', en: 'the thin outer layer of the planet' },
      usage: { zh: '不可数；ocean crust、the crust cracks。', en: 'Uncountable: ocean crust, the crust cracks.' },
      collocations: ['the ocean crust', 'the crust cracks', 'the earth’s crust'],
      example: { en: 'The vents sit above cracks in the ocean crust.', zh: '喷口位于洋壳裂缝之上。' },
      listening: { zh: '单音节，与 trust 押韵，开头 /kr/。', en: 'One syllable rhyming with trust, opening /kr/.' },
    },
    {
      term: 'submersibles', phonetic: '/səbˈmɜːsəblz/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '深潜器，潜水器', en: 'vehicles that descend deep under water' },
      usage: { zh: '可数复数；manned submersibles、deep-sea submersibles。', en: 'Countable plural: manned submersibles, deep-sea submersibles.' },
      collocations: ['deep-sea submersibles', 'manned submersibles', 'a submersible dive'],
      example: { en: 'Submersibles carry scientists down to the vents.', zh: '深潜器把科学家送到喷口深处。' },
      listening: { zh: '重音在第二音节 /ˈmɜː/，开头 /səb/ 轻读。', en: 'Stress the second syllable; the opening /səb/ is soft.' },
    },
    {
      term: 'larvae', phonetic: '/ˈlɑːviː/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '幼体，幼虫（复数）', en: 'young forms that later develop into adults' },
      usage: { zh: '复数形式；单数 larva。vent larvae、drift as larvae。', en: 'Plural form; the singular is larva: vent larvae, drift as larvae.' },
      collocations: ['vent larvae', 'drifting larvae', 'the larvae settle'],
      example: { en: 'Larvae drift until they reach an active vent field.', zh: '幼体漂流直到抵达活跃喷口场。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈlɑː/，结尾 /iː/ 长音。', en: 'Two syllables with stress on the first and a long final /iː/.' },
    },
  ],
  expressions: [
    {
      phrase: 'clustered around', sentenceIndex: 2,
      meaning: { zh: '聚集在……周围', en: 'gathered closely around a central point' },
      usage: { zh: '指生物聚集在某中心点周围；常见搭配 cluster around the cracks、cluster around the vent。', en: 'To gather around a central point: cluster around the cracks, around the vent.' },
      example: { en: 'Colonies cluster around the warm cracks.', zh: '生物群聚集在温暖裂缝周围。' },
    },
    {
      phrase: 'rises back', sentenceIndex: 5,
      meaning: { zh: '向上回流', en: 'to move upward again toward the surface' },
      usage: { zh: '指受热流体向上回流；常见搭配 rise back toward the surface、rise back through the crust。', en: 'For heated fluid moving upward: rise back toward the surface, through the crust.' },
      example: { en: 'The heated fluid rises back toward the seabed.', zh: '受热流体向海床回流。' },
    },
    {
      phrase: 'rely on', sentenceIndex: 12,
      meaning: { zh: '依靠，依赖', en: 'to depend on a source for survival' },
      usage: { zh: '指依靠某来源生存；常见搭配 rely on chemical energy、rely on bacteria。', en: 'To depend on a source: rely on chemical energy, rely on bacteria.' },
      example: { en: 'The animals rely on chemical energy, not sunlight.', zh: '这些动物依靠化学能而非阳光。' },
    },
    {
      phrase: 'persist', sentenceIndex: 16,
      meaning: { zh: '存活，持续存在', en: 'to continue to survive in harsh conditions' },
      usage: { zh: '不及物动词；specialised species persist。', en: 'Intransitive: specialised species persist.' },
      example: { en: 'Only specialised species persist at the vents.', zh: '只有特化物种能在喷口存活。' },
    },
    {
      phrase: 'drift on', sentenceIndex: 34,
      meaning: { zh: '随……漂流', en: 'to float along a current until settling' },
      usage: { zh: '指幼体随水流漂浮；常见搭配 drift on the currents、drift on the plume。', en: 'For larvae floating on a flow: drift on the currents, on the plume.' },
      example: { en: 'Larvae drift on the deep currents for weeks.', zh: '幼体随深海流漂流数周。' },
    },
    {
      phrase: 'feed', sentenceIndex: 46,
      meaning: { zh: '进食，取食', en: 'to obtain food and energy from a source' },
      usage: { zh: '不及物；animals cannot feed、bacteria feed on chemicals。', en: 'Intransitive: animals cannot feed; bacteria feed on chemicals.' },
      example: { en: 'When the flow stops, the animals cannot feed.', zh: '喷液停止后动物无法取食。' },
    },
    {
      phrase: 'against all expectations', sentenceIndex: 49,
      meaning: { zh: '出乎意料地', en: 'in a way no one predicted in advance' },
      usage: { zh: '句中状语；discovered against all expectations。', en: 'Sentence adverbial: discovered against all expectations.' },
      example: { en: 'Life thrived around the vents against all expectations.', zh: '生命在喷口周围繁盛，完全出乎意料。' },
    },
  ],
  tips: [
    {
      title: { zh: '按成因链条记笔记', en: 'Follow the cause chain in notes' },
      body: {
        zh: '讲座按海水下渗、溶解矿物、喷出流体、细菌合成、动物生存的顺序展开。在笔记上把链条从左到右排开，听到 result、instead、rather than 这类衔接词就补到对应环节。',
        en: 'The lecture runs seep down, dissolve minerals, release fluid, bacterial synthesis, animal survival. Lay the chain left to right; connectives such as result, instead and rather than tell you which link to fill.',
      },
    },
    {
      title: { zh: '区分对照概念', en: 'Separate contrast terms' },
      body: {
        zh: '化能合成与光合作用、化学能与阳光、深海与地表反复对照。听到 rather than、unlike 就把两侧概念分别记下，避免把 sunlight 填进 chemosynthesis 的空。',
        en: 'Chemosynthesis and photosynthesis, chemical energy and sunlight, deep and surface are contrasted repeatedly. At rather than or unlike, note both sides so you do not put sunlight into the chemosynthesis blank.',
      },
    },
    {
      title: { zh: '复盘段对应单选', en: 'The recap carries the single-choice items' },
      body: {
        zh: '后半段 Now let me review、Unlike surface plants、The early expeditions 是对前文的复盘，37–40 的答案集中在这里。听到总结短语就把注意力转到选项匹配，重点听原因与差异。',
        en: 'The later recap, marked by Now let me review, Unlike surface plants and The early expeditions, carries items 37–40. Shift to option matching and listen for reasons and differences.',
      },
    },
  ],
};
