import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 29 · Part 4 — 颜色感知（单人讲座，澳式口音）。原创仿真材料，非官方真题。
 *
 * 结构：三类视锥与感光范围 → 同时对比 → 语言与色觉差异（表格 31–34）→
 * 锥细胞分工原因、对比定义、语言作用（单选 35–37）→ 三项色觉事实（多选 38–40）。
 * 开场用现场观察现象，不用 Today's lecture is about 句式。
 */
export const test29Part4: ListeningLesson = {
  slug: 'test-29-part-4',
  part: 4,
  status: 'published',
  title: { zh: '颜色感知', en: 'Colour perception' },
  summary: {
    zh: '讲座从一块蓝布在不同背景下的深浅变化讲起：人眼靠视网膜上三类视锥分别感知红、绿、蓝光，合计分辨约一百万种颜色；同时对比使同一色块在不同背景旁显得深浅不同；语言把颜色归成基本名称，影响分类、命名与记忆。随后解释锥细胞分工拓宽光谱覆盖、对比由邻色引起而非颜料本身、语言不改信号但引导排序与记忆，并选出文化分蓝、命名影响排序、中心视觉最敏锐三项事实。',
    en: 'The lecture opens with a blue jacket looking different on backgrounds: three cone types sense red, green and blue light and distinguish one million colours; contrast shifts a colour beside its background; language groups colours into names shaping sorting and memory. It covers cone division, neighbour-caused contrast, language guiding sorting, culture splitting blue and names shaping recall.',
  },
  accent: { zh: '讲师为澳式口音，术语放慢，举例前有停顿。', en: 'The lecturer has an Australian accent, slows key terms and pauses before examples.' },
  speechRate: '+3%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Cone / effect', 'Detail'],
      rows: [
        { lead: 'Three cone types', cells: [[{ text: 'respond to red, ' }, { blank: 31 }, { text: ' and blue light' }]] },
        { lead: 'Combined cones', cells: [[{ text: 'distinguish about ' }, { blank: 32 }, { text: ' colours' }]] },
        { lead: 'Contrast effect', cells: [[{ text: 'a colour shifts against its ' }, { blank: 33 }]] },
        { lead: 'Language and names', cells: [[{ text: 'speakers name shades their ' }, { blank: 34 }, { text: ' language marks out' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why do the three cone types differ in their sensitivity?',
          options: [
            { key: 'A', text: 'Each responds to a different band of the light spectrum' },
            { key: 'B', text: 'Some cones work only in dim light' },
            { key: 'C', text: 'The retina sorts cones by size' },
          ],
        },
        {
          number: 36,
          stem: 'What exactly is simultaneous contrast?',
          options: [
            { key: 'A', text: 'The eye adapts after staring at a bright colour' },
            { key: 'B', text: 'A colour looks changed by the colours beside it' },
            { key: 'C', text: 'Two people mix the same pigment differently' },
          ],
        },
        {
          number: 37,
          stem: 'How does language affect how we see colour?',
          options: [
            { key: 'A', text: 'It sharpens the cones themselves in the eye' },
            { key: 'B', text: 'It adds new colours to the light spectrum' },
            { key: 'C', text: 'It guides sorting, naming and memory for shades' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE facts about colour perception does the lecturer mention? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE facts about colour perception are mentioned?',
      options: [
        { key: 'A', text: 'some cultures divide the blue range into named shades' },
        { key: 'B', text: 'colour names make cones more sensitive to light' },
        { key: 'C', text: 'names shape how shades are sorted and recalled' },
        { key: 'D', text: 'vision is sharpest near the centre of the retina' },
        { key: 'E', text: 'all languages share one basic list of colour words' },
        { key: 'F', text: 'contrast affects large objects more than small chips' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['green'], evidence: 4,
      explanation: {
        zh: '定位句 4：One sort responds to red light, another to green, and the third to blue。三类视锥对应红、绿、蓝，填 green。',
        en: 'Sentence 4: one sort responds to red, another to green, the third to blue, so fill green.',
      },
    },
    {
      number: 32, accepted: ['one million', '1,000,000'], evidence: 6,
      explanation: {
        zh: '定位句 6：the cones let most people distinguish about one million colours in good light。合计分辨约一百万种颜色，填 one million。',
        en: 'Sentence 6: cones distinguish "about one million colours" in good light, so fill one million.',
      },
    },
    {
      number: 33, accepted: ['background'], evidence: 15,
      explanation: {
        zh: '定位句 15：The background colour shifts our reading of the figure in front of it。背景色改变对前景的判断，填 background。',
        en: 'Sentence 15: "the background colour shifts our reading", so fill background.',
      },
    },
    {
      number: 34, accepted: ['own'], evidence: 24,
      explanation: {
        zh: '定位句 24：People tend to name colours first for the shades their own language marks out clearly。先按本语言明确命名的色名，填 own。',
        en: 'Sentence 24: shades the speakers’ "own language marks out" are named first, so fill own.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 38,
      explanation: {
        zh: '定位句 38：Each responds best to a different band of the spectrum, so their signals cover a wider range。各管一段光谱、覆盖更宽范围，对应 A。暗光细胞是视杆细胞，按大小分类未提及。',
        en: 'Sentence 38: each cone responds to "a different band of the spectrum", matching A. Dim-light cells are rods, and size sorting is not mentioned.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 40,
      explanation: {
        zh: '定位句 40：It is the change in how a colour looks, caused by the colours beside it rather than by the colour itself。对比由邻色引起、改变外观，对应 B。盯看适应、颜料调和不是定义。',
        en: 'Sentence 40: contrast is the look "caused by the colours beside it", matching B. Adaptation after staring and pigment mixing are not the definition.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 42,
      explanation: {
        zh: '定位句 42：It does not alter the eye’s signals, but it guides sorting, naming and memory for shades。语言引导排序、命名与记忆，对应 C。它不改变锥细胞，也不增加光谱颜色。',
        en: 'Sentence 42: language guides "sorting, naming and memory for shades", matching C. It neither sharpens cones nor adds spectrum colours.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 44,
      explanation: {
        zh: '定位句 44：Some cultures divide the blue range into separate named shades。部分文化把蓝色细分命名，对应 A。',
        en: 'Sentence 44: some cultures "divide the blue range into separate named shades", matching A.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 46,
      explanation: {
        zh: '定位句 46：Colour names shape the order in which people sort and recall shades。色名影响排序与回忆顺序，对应 C。',
        en: 'Sentence 46: colour names "shape the order in which people sort and recall shades", matching C.',
      },
    },
    {
      number: 40, accepted: ['D'], evidence: 47,
      explanation: {
        zh: '定位句 47：Colour vision is sharpest near the centre of the retina, where the cones are densest。视网膜中心视觉最敏锐，对应 D。色名提升感光、所有语言同名、对比影响大物均被排除。',
        en: 'Sentence 47: vision "is sharpest near the centre of the retina", matching D. Names boosting sensitivity, identical word lists and size-dependent contrast are ruled out.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Look at the jacket on the chair here. Its blue may look pale against the white wall and deep beside the grey sofa.' },
    { speaker: 'lecturer', text: 'That shift is the subject of today’s discussion, and it tells us a lot about how the eye reads colour.' },
    { speaker: 'lecturer', text: 'Human colour vision starts with the cones, the cells packed into the retina at the back of the eye.' },
    { speaker: 'lecturer', text: 'Most people carry three sorts of cone, and each sort responds best to one part of the light spectrum.' },
    { speaker: 'lecturer', text: 'One sort responds to red light, another to green, and the third to blue.' },
    { speaker: 'lecturer', text: 'The three signals combine in the brain, rather than arriving as three separate pictures.' },
    { speaker: 'lecturer', text: 'Taken together, the cones let most people distinguish about one million colours in good light.' },
    { speaker: 'lecturer', text: 'Sensitivity is not the same across the whole retina.' },
    { speaker: 'lecturer', text: 'Cones crowd the centre of the eye, where detail and colour are sharpest.' },
    { speaker: 'lecturer', text: 'Rods, the other cells, handle dim light and do not register colour at all.' },
    { speaker: 'lecturer', text: 'A cone’s sensitivity can also change with the light around it.' },
    { speaker: 'lecturer', text: 'In bright sun it adapts down, and after dark it recovers gradually over several minutes.' },
    { speaker: 'lecturer', text: 'Next comes the effect we call simultaneous contrast.' },
    { speaker: 'lecturer', text: 'Put the same grey square on a black sheet and on a white sheet.' },
    { speaker: 'lecturer', text: 'The square looks lighter against black and darker against white, though its pigment has not changed.' },
    { speaker: 'lecturer', text: 'The background colour shifts our reading of the figure in front of it.' },
    { speaker: 'lecturer', text: 'The same rule works with warm and cool colours.' },
    { speaker: 'lecturer', text: 'A red patch looks warmer next to green, and a blue patch cooler beside orange.' },
    { speaker: 'lecturer', text: 'Contrast does not depend on the size of the object.' },
    { speaker: 'lecturer', text: 'A tiny chip shows the same shift as a large painted wall.' },
    { speaker: 'lecturer', text: 'The third thread is how language meets colour.' },
    { speaker: 'lecturer', text: 'Every language groups colours into a smaller set of basic names.' },
    { speaker: 'lecturer', text: 'Some languages split the blue range into two words, one for pale sky and one for deep water.' },
    { speaker: 'lecturer', text: 'Speakers of such a language can sort those shades faster than speakers who use a single word.' },
    { speaker: 'lecturer', text: 'People tend to name colours first for the shades their own language marks out clearly.' },
    { speaker: 'lecturer', text: 'Colour names do not make a shade visible, but they shape how it is sorted and remembered.' },
    { speaker: 'lecturer', text: 'Languages do not all draw the same lines between hues.' },
    { speaker: 'lecturer', text: 'A colour that feels distinct in one tongue may blend into its neighbour in another.' },
    { speaker: 'lecturer', text: 'This shows that perception sits between the eye’s input and the culture’s words.' },
    { speaker: 'lecturer', text: 'Let us now go through the three points once more in a working order.' },
    { speaker: 'lecturer', text: 'First, the cones.' },
    { speaker: 'lecturer', text: 'The three cone types respond to red, green and blue light.' },
    { speaker: 'lecturer', text: 'The cones together distinguish about one million colours when the light is good.' },
    { speaker: 'lecturer', text: 'Second, contrast.' },
    { speaker: 'lecturer', text: 'A colour looks different against its background, whether the surface is small or large.' },
    { speaker: 'lecturer', text: 'Third, language.' },
    { speaker: 'lecturer', text: 'Speakers separate the colours their own language gives a clear name.' },
    { speaker: 'lecturer', text: 'Why do the three cone types differ in their sensitivity?' },
    { speaker: 'lecturer', text: 'Each responds best to a different band of the spectrum, so their signals cover a wider range than one cell could.' },
    { speaker: 'lecturer', text: 'What exactly is simultaneous contrast?' },
    { speaker: 'lecturer', text: 'It is the change in how a colour looks, caused by the colours beside it rather than by the colour itself.' },
    { speaker: 'lecturer', text: 'How does language affect how we see colour?' },
    { speaker: 'lecturer', text: 'It does not alter the eye’s signals, but it guides sorting, naming and memory for shades.' },
    { speaker: 'lecturer', text: 'Which facts should we keep in mind when reading the studies?' },
    { speaker: 'lecturer', text: 'Some cultures divide the blue range into separate named shades.' },
    { speaker: 'lecturer', text: 'Cones recover their sensitivity gradually after exposure to bright light.' },
    { speaker: 'lecturer', text: 'Colour names shape the order in which people sort and recall shades.' },
    { speaker: 'lecturer', text: 'Colour vision is sharpest near the centre of the retina, where the cones are densest.' },
    { speaker: 'lecturer', text: 'Not every language shares the same list of basic colour words.' },
    { speaker: 'lecturer', text: 'Contrast affects small chips just as strongly as large walls.' },
    { speaker: 'lecturer', text: 'Beyond these points, individual eyes vary slightly in the number of cones.' },
    { speaker: 'lecturer', text: 'That variation helps explain why two people may describe one shade in different words.' },
    { speaker: 'lecturer', text: 'Most of what we call a colour, then, is built in the brain from light, context and language.' },
  ],
  vocabulary: [
    {
      term: 'cones', phonetic: '/kəʊnz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '视锥细胞（感知颜色）', en: 'the retinal cell that senses colour' },
      usage: { zh: '可数；three sorts of cone、the cone types。暗光细胞是 rod。', en: 'Countable: three sorts of cone; the dim-light cell is a rod.' },
      collocations: ['the cone types', 'three sorts of cone', 'the retinal cones'],
      example: { en: 'Three cone types respond to red, green and blue.', zh: '三类视锥感知红绿蓝。' },
      listening: { zh: '单音节，与 bone 押韵。', en: 'One syllable, rhyming with bone.' },
    },
    {
      term: 'retina', phonetic: '/ˈretɪnə/', partOfSpeech: 'n.', sentenceIndex: 47,
      meaning: { zh: '视网膜', en: 'the light-sensitive layer at the back of the eye' },
      usage: { zh: '可数；the retina at the back of the eye、central retina。', en: 'Countable: the central retina; adjective retinal.' },
      collocations: ['the back of the retina', 'the central retina', 'retinal cells'],
      example: { en: 'Cones pack the centre of the retina.', zh: '视锥集中在视网膜中心。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈret/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'spectrum', phonetic: '/ˈspektrəm/', partOfSpeech: 'n.', sentenceIndex: 38,
      meaning: { zh: '光谱，光的波段', en: 'the range of visible light wavelengths' },
      usage: { zh: '可数，复数 spectra；the light spectrum、a band of the spectrum。', en: 'Countable, plural spectra: a band of the spectrum.' },
      collocations: ['the light spectrum', 'a band of the spectrum', 'the visible spectrum'],
      example: { en: 'Each cone answers a band of the spectrum.', zh: '每个视锥对应一段光谱。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈspek/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'pigment', phonetic: '/ˈpɪɡmənt/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '颜料，色素（物体本身的颜色）', en: 'the material colour that has not changed' },
      usage: { zh: '可数/不可数；its pigment、the pigment of the square。', en: 'Countable or uncountable: its pigment, the pigment colour.' },
      collocations: ['the pigment has not changed', 'the surface pigment', 'pigment chips'],
      example: { en: 'The pigment stays fixed while the look shifts.', zh: '颜料不变而观感变化。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpɪɡ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'hues', phonetic: '/hjuːz/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '色相，色调', en: 'the basic colour category such as red or blue' },
      usage: { zh: '可数；between hues、a distinct hue。与 shade（明暗深浅）区分。', en: 'Countable: between hues; shade means light or dark depth.' },
      collocations: ['between hues', 'a distinct hue', 'warm and cool hues'],
      example: { en: 'Languages draw lines between hues differently.', zh: '各语言划分色相的界线不同。' },
      listening: { zh: '单音节，类似 you 加首音 /h/。', en: 'One syllable, like you with an initial /h/.' },
    },
    {
      term: 'perception', phonetic: '/pəˈsepʃn/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '感知，知觉', en: 'how the brain receives and interprets colour' },
      usage: { zh: '不可数；colour perception、visual perception。动词 perceive。', en: 'Uncountable: colour perception; the verb is perceive.' },
      collocations: ['colour perception', 'visual perception', 'the perception of shades'],
      example: { en: 'Perception sits between input and words.', zh: '感知介于输入与语言之间。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsep/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'adapts', phonetic: '/əˈdæpts/', partOfSpeech: 'v.', sentenceIndex: 11,
      meaning: { zh: '适应（明暗），调整敏感度', en: 'to change sensitivity to the surrounding light' },
      usage: { zh: '动词；the eye adapts、adapt to bright light。名词 adaptation。', en: 'Verb: adapt to bright light; the noun is adaptation.' },
      collocations: ['adapt down', 'adapt to bright light', 'the eye adapts'],
      example: { en: 'The cone adapts down in bright sun.', zh: '视锥在强光下降低敏感。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈdæpt/。', en: 'Two syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'responds to', sentenceIndex: 4,
      meaning: { zh: '对（光）产生反应，感知', en: 'to react to a band of incoming light' },
      usage: { zh: '动词短语；a cone responds to red light、respond to a signal。', en: 'A cone responds to red light; compare react to.' },
      example: { en: 'Each cone responds to one light band.', zh: '每个视锥反应一段光。' },
    },
    {
      phrase: 'next to', sentenceIndex: 17,
      meaning: { zh: '紧邻，在……旁边（对比参照）', en: 'beside the neighbouring colour in contrast' },
      usage: { zh: '固定介词短语；red next to green、beside orange。', en: 'Next to means beside; compare alongside.' },
      example: { en: 'Red looks warmer next to green.', zh: '红在绿旁显得更暖。' },
    },
    {
      phrase: 'draw the same lines', sentenceIndex: 26,
      meaning: { zh: '划分（颜色类别界线）', en: 'to set the boundary between colour categories' },
      usage: { zh: '比喻短语；draw lines between hues、draw the same lines。', en: 'Draw the lines means set category boundaries.' },
      example: { en: 'Languages draw lines between hues differently.', zh: '语言划分色相界线不同。' },
    },
    {
      phrase: 'sits between', sentenceIndex: 28,
      meaning: { zh: '处于（两端）之间', en: 'to be located between two inputs' },
      usage: { zh: '动词短语；perception sits between input and words、sit between two sheets。', en: 'Sit between means occupy the middle position.' },
      example: { en: 'Perception sits between the eye and language.', zh: '感知介于眼睛与语言之间。' },
    },
    {
      phrase: 'exposure to', sentenceIndex: 45,
      meaning: { zh: '暴露于（强光），接触', en: 'time spent under bright light' },
      usage: { zh: '名词短语；exposure to bright light、after exposure to the sun。', en: 'Exposure to bright light; the verb form is expose to.' },
      example: { en: 'Cones recover after exposure to bright light.', zh: '视锥在强光后逐渐恢复。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格按三条线索填词', en: 'Fill the table by the three threads' },
      body: {
        zh: '四空对应绿、一百万、背景、本语言。听到 another to green、one million colours、the background colour、their own language 直接落笔；题干已给 red、blue、colours 等引导词，不要重复写。',
        en: 'The four blanks match green, one million, background and own. Write at another to green, one million colours, the background and own language; do not repeat printed leads such as red and blue.',
      },
    },
    {
      title: { zh: '单选定定义时抓因果', en: 'Pick the defined cause in singles' },
      body: {
        zh: '锥细胞分工是各管一段光谱；对比定义是邻色改变观感、颜料不变；语言不改信号而引导排序命名记忆。盯看适应、混合颜料、提升锥细胞敏感都是干扰。',
        en: 'Cone division covers spectral bands; contrast changes appearance by neighbours while pigment stays; language guides sorting without altering signals. Staring adaptation, pigment mixing and sharpening cones are distractors.',
      },
    },
    {
      title: { zh: '多选排除被否定的说法', en: 'Rule out negated multiple-choice options' },
      body: {
        zh: '三项入选：文化分蓝、命名影响排序回忆、中心视觉最敏锐。所有语言同名与原文 not every language 相反；对比大小无差别，F 说影响大物更强被排除；色名不提升感光。听到 not、rather than、just as strongly 就划掉对应项。',
        en: 'The three are culture splitting blue, names shaping recall and central sharpness. Identical lists contradict not every language; contrast is size-independent; names do not boost sensitivity. Cross out options at not, rather than and just as strongly.',
      },
    },
  ],
};
