import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 34 · Part 4 — 潮汐（单人讲座，澳式口音）。原创仿真材料，非官方真题。
 *
 * 结构：引潮力来源 → 潮型周期 → 潮间带生物 → 航海应用（表格 31–34）→
 * 月球主导原因、大潮定义、潮间带生存（单选 35–37）→ 三项实用要点（多选 38–40）。
 * 开场用现场现象观察，不用 Today's lecture is about 句式。
 */
export const test34Part4: ListeningLesson = {
  slug: 'test-34-part-4',
  part: 4,
  status: 'published',
  title: { zh: '潮汐', en: 'Tides' },
  summary: {
    zh: '讲座从港壁水位每日两度升降讲起：主要引潮力来自月球，太阳引力较弱；高潮约每十二小时一次，高潮与低潮之间是潮间带，海藻固着岩石、贝类闭壳储水熬过干露；月日共线形成大潮，季候小潮幅度较小。水手靠潮候表安排离港时机；并归纳安全进港时机、潮间带海藻贝类、海岸线形状影响潮差三项要点。',
    en: 'The lecture opens with harbour water: the main tide force is the moon, the sun pulls more weakly; high tide comes every twelve hours, the intertidal zone sits between high and low water, seaweeds cling to rock and shellfish clamp shut. Aligned moon and sun make a spring tide; sailors plan departure from tide tables. The three points are safe entry, intertidal life and range by coastline.',
  },
  accent: { zh: '讲师为澳式口音，术语放慢，段落之间有停顿。', en: 'The lecturer has an Australian accent, slows key terms and pauses between sections.' },
  speechRate: '+3%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Feature', 'Detail'],
      rows: [
        { lead: 'Tide-generating force', cells: [[{ text: 'comes from the ' }, { blank: 31 }]] },
        { lead: 'High tide', cells: [[{ text: 'roughly every ' }, { blank: 32 }, { text: ' hours' }]] },
        { lead: 'Intertidal zone', cells: [[{ text: 'exposed between ' }, { blank: 33 }, { text: ' and low tide' }]] },
        { lead: 'Sailors', cells: [[{ text: 'use tide tables to plan the ' }, { blank: 34 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why does the moon dominate tides over the sun?',
          options: [
            { key: 'A', text: 'It sits closer to the Earth and pulls the water more strongly' },
            { key: 'B', text: 'It produces all the heat that warms the ocean' },
            { key: 'C', text: 'It reflects sunlight back onto the harbour' },
          ],
        },
        {
          number: 36,
          stem: 'What defines a spring tide?',
          options: [
            { key: 'A', text: 'The moon and sun line up and their pulls combine' },
            { key: 'B', text: 'The quarter moon cancels every tidal movement' },
            { key: 'C', text: 'A strong wind pushes the harbour water aside' },
          ],
        },
        {
          number: 37,
          stem: 'How do intertidal creatures survive exposure?',
          options: [
            { key: 'A', text: 'They swim away to deep water before the tide falls' },
            { key: 'B', text: 'They cling to rock or clamp shells shut and store water' },
            { key: 'C', text: 'They bury themselves in sand for the whole year' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE practical points about tides does the lecturer mention? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE practical points about tides are mentioned?',
      options: [
        { key: 'A', text: 'tide tables mark safe harbour entry' },
        { key: 'B', text: 'intertidal rocks hold seaweeds and shellfish' },
        { key: 'C', text: 'tidal range differs by coastline shape' },
        { key: 'D', text: 'tides stop all movement in deep water' },
        { key: 'E', text: 'moon appears larger every night' },
        { key: 'F', text: 'beaches stay dry at high tide' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['moon'], evidence: 2,
      explanation: {
        zh: '定位句 2：The main tide-generating force comes from the moon, which pulls the ocean toward it。主要引潮力来自月球，填 moon。',
        en: 'Sentence 2: the main force "comes from the moon", so fill moon.',
      },
    },
    {
      number: 32, accepted: ['twelve', '12'], evidence: 6,
      explanation: {
        zh: '定位句 6：High tide occurs roughly every twelve hours, with two highs and two lows most days。高潮约每十二小时一次，填 twelve。',
        en: 'Sentence 6: high tide occurs "roughly every twelve hours", so fill twelve.',
      },
    },
    {
      number: 33, accepted: ['high'], evidence: 8,
      explanation: {
        zh: '定位句 8：Between high tide and low tide lies the intertidal zone, exposed twice a day。潮间带在高潮与低潮之间，填 high。',
        en: 'Sentence 8: the intertidal zone lies "between high tide and low tide", so fill high.',
      },
    },
    {
      number: 34, accepted: ['departure'], evidence: 23,
      explanation: {
        zh: '定位句 23：Sailors use tide tables to plan the departure, when the water sits deep enough。水手用潮候表安排离港，填 departure。',
        en: 'Sentence 23: sailors use tide tables "to plan the departure", so fill departure.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：It sits far closer to the Earth, so its gravitational pull reaches the water more strongly。月球距离更近、引力更强，对应 A。产热、反光均与潮汐无关。',
        en: 'Sentence 32: the moon sits "far closer to the Earth" and pulls the water more strongly, matching A. Heating and reflection are unrelated to tides.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 34,
      explanation: {
        zh: '定位句 34：It forms when moon and sun line up and their pulls add into one stronger force。大潮由月日共线、引力叠加形成，对应 A。弦月抵消、刮风不是大潮成因。',
        en: 'Sentence 34: a spring tide forms when moon and sun "line up" and their pulls combine, matching A. Quarter-moon cancellation and wind are not causes.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：They cling to the rock or clamp their shells shut and store water until the tide returns。潮间带生物固着岩石或闭壳储水，对应 B。游向深水、常年埋沙均未提及。',
        en: 'Sentence 36: creatures "cling to the rock or clamp their shells shut and store water", matching B. Swimming to deep water and year-round burial are not mentioned.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 38,
      explanation: {
        zh: '定位句 38：Tide tables mark the safe time to enter a harbour across the shallow bar。潮候表标出安全进港时机，对应 A。',
        en: 'Sentence 38: tide tables mark "the safe time to enter a harbour", matching A.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 39,
      explanation: {
        zh: '定位句 39：Intertidal rocks hold seaweeds and shellfish that live through both wet and dry。潮间带岩石生长海藻和贝类，对应 B。',
        en: 'Sentence 39: intertidal rocks "hold seaweeds and shellfish", matching B.',
      },
    },
    {
      number: 40, accepted: ['C'], evidence: 40,
      explanation: {
        zh: '定位句 40：The tidal range changes with the shape of the coastline and the width of the bay。潮差随海岸线形状变化，对应 C。深水停流、月亮变大、海滩高潮仍干均被排除。',
        en: 'Sentence 40: the tidal range changes "with the shape of the coastline", matching C. Still deep water, a larger moon and dry high-tide beaches are ruled out.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'The water at the harbour wall rises and falls twice a day without anyone pushing it.' },
    { speaker: 'lecturer', text: 'Those shifts are the tides, and they follow a repeating rhythm around the coast.' },
    { speaker: 'lecturer', text: 'The main tide-generating force comes from the moon, which pulls the ocean toward it.' },
    { speaker: 'lecturer', text: 'The sun also acts, but its pull is weaker on the water than the moon’s.' },
    { speaker: 'lecturer', text: 'The moon sits much closer to the Earth, so its gravitational reach matters more here.' },
    { speaker: 'lecturer', text: 'As the Earth turns, a coastal point passes under the moon once each day.' },
    { speaker: 'lecturer', text: 'High tide occurs roughly every twelve hours, with two highs and two lows most days.' },
    { speaker: 'lecturer', text: 'The water does not climb in a smooth slope; it swings back and forth in the basin.' },
    { speaker: 'lecturer', text: 'Between high tide and low tide lies the intertidal zone, exposed twice a day.' },
    { speaker: 'lecturer', text: 'This stretch of rocks and sand sits wet when the tide comes in, dry when it leaves.' },
    { speaker: 'lecturer', text: 'Creatures there must survive both being covered in water and being left in air.' },
    { speaker: 'lecturer', text: 'Many seaweeds cling to the rock and store water through the dry period.' },
    { speaker: 'lecturer', text: 'Shellfish clamp their shells shut to keep moisture inside until the tide returns.' },
    { speaker: 'lecturer', text: 'Birds pick over the exposed rocks between the two tide levels each morning.' },
    { speaker: 'lecturer', text: 'The shape of the coast changes how far the water travels up the beach.' },
    { speaker: 'lecturer', text: 'A wide shallow bay can hold a large rise, while a steep shore shows little range.' },
    { speaker: 'lecturer', text: 'Tidal range, the gap between high and low water, differs by coastline shape.' },
    { speaker: 'lecturer', text: 'When moon and sun line up, their pulls add together to make a spring tide.' },
    { speaker: 'lecturer', text: 'Spring tides bring the highest highs and the lowest lows near the new and full moon.' },
    { speaker: 'lecturer', text: 'At the quarter moon, the pulls partly cancel, giving a smaller neap tide.' },
    { speaker: 'lecturer', text: 'Neap waters sit closer to a mid level, with less movement up the shore.' },
    { speaker: 'lecturer', text: 'Sailors have watched these water marks for centuries before engines arrived.' },
    { speaker: 'lecturer', text: 'Tide tables list the predicted high and low times for each harbour.' },
    { speaker: 'lecturer', text: 'Sailors use tide tables to plan the departure, when the water sits deep enough.' },
    { speaker: 'lecturer', text: 'A shallow harbour may only be safe to enter around the high water mark.' },
    { speaker: 'lecturer', text: 'Tide tables also warn the skipper about the range at the landing stage.' },
    { speaker: 'lecturer', text: 'Now let us restate the table details in a clear order.' },
    { speaker: 'lecturer', text: 'The main tide-generating force comes from the moon above our own planet.' },
    { speaker: 'lecturer', text: 'High tide arrives roughly every twelve hours through the daylight and night.' },
    { speaker: 'lecturer', text: 'The intertidal zone is exposed between high tide and low tide.' },
    { speaker: 'lecturer', text: 'Sailors check the tables before they plan the departure from the port.' },
    { speaker: 'lecturer', text: 'Why does the moon dominate the tides rather than the sun?' },
    { speaker: 'lecturer', text: 'It sits far closer to the Earth, so its gravitational pull reaches the water more strongly.' },
    { speaker: 'lecturer', text: 'What defines a spring tide?' },
    { speaker: 'lecturer', text: 'It forms when moon and sun line up and their pulls add into one stronger force.' },
    { speaker: 'lecturer', text: 'How do intertidal creatures survive being exposed in air?' },
    { speaker: 'lecturer', text: 'They cling to the rock or clamp their shells shut and store water until the tide returns.' },
    { speaker: 'lecturer', text: 'Which practical points should we carry from this talk?' },
    { speaker: 'lecturer', text: 'Tide tables mark the safe time to enter a harbour across the shallow bar.' },
    { speaker: 'lecturer', text: 'Intertidal rocks hold seaweeds and shellfish that live through both wet and dry.' },
    { speaker: 'lecturer', text: 'The tidal range changes with the shape of the coastline and the width of the bay.' },
    { speaker: 'lecturer', text: 'Deep water still moves with the tide, though the range there may be small.' },
    { speaker: 'lecturer', text: 'The moon does not grow visibly larger each night, though its face changes.' },
    { speaker: 'lecturer', text: 'A beach does not stay dry at high tide; that is when the water covers it.' },
    { speaker: 'lecturer', text: 'These patterns repeat against the fixed habits of the coastal organisms.' },
    { speaker: 'lecturer', text: 'Local records combine old harbour marks with modern computer predictions.' },
    { speaker: 'lecturer', text: 'A skipper should never rely on memory alone for a tidal entry.' },
    { speaker: 'lecturer', text: 'The dry intertidal strip reveals animal tracks left by the evening visitors.' },
    { speaker: 'lecturer', text: 'Salt marshes at the head of the bay slow the water before it reaches the town.' },
    { speaker: 'lecturer', text: 'Buoys on the channel move up and down with each turning of the tide.' },
    { speaker: 'lecturer', text: 'Next week we will look at how waves shape the same stretch of shore.' },
  ],
  vocabulary: [
    {
      term: 'moon', phonetic: '/muːn/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '月球（引潮力主体）', en: 'the body whose gravity drives most tidal movement' },
      usage: { zh: '可数；the moon above the Earth、under the moon。', en: 'Countable: the moon’s pull; compare the sun.' },
      collocations: ['the moon’s pull', 'under the moon', 'the new and full moon'],
      example: { en: 'The moon dominates the daily tides.', zh: '月球主导每日潮汐。' },
      listening: { zh: '单音节，与 soon 押韵。', en: 'One syllable, rhyming with soon.' },
    },
    {
      term: 'intertidal', phonetic: '/ˌɪntəˈtaɪdl/', partOfSpeech: 'adj.', sentenceIndex: 8,
      meaning: { zh: '潮间带的', en: 'the shore strip exposed between high and low water' },
      usage: { zh: '形容词；the intertidal zone、intertidal rocks。', en: 'Adjective: the intertidal zone; built from inter and tidal.' },
      collocations: ['the intertidal zone', 'intertidal rocks', 'the intertidal strip'],
      example: { en: 'The intertidal zone dries twice a day.', zh: '潮间带每日两度干露。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈtaɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'gravitational', phonetic: '/ˌɡrævɪˈteɪʃənl/', partOfSpeech: 'adj.', sentenceIndex: 32,
      meaning: { zh: '引力的，重力的', en: 'relating to the pull between celestial bodies' },
      usage: { zh: '形容词；gravitational pull、gravitational reach。名词 gravity。', en: 'Adjective: gravitational pull; the noun is gravity.' },
      collocations: ['gravitational pull', 'gravitational reach', 'the gravitational force'],
      example: { en: 'The moon’s gravitational pull reaches the water.', zh: '月球引力作用于海水。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈteɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'range', phonetic: '/reɪndʒ/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '潮差，高低水位之差', en: 'the gap between high and low water on the shore' },
      usage: { zh: '可数/不可数；tidal range、a large range。', en: 'Countable or uncountable: tidal range.' },
      collocations: ['tidal range', 'a large range', 'the range at the stage'],
      example: { en: 'The range differs by coastline shape.', zh: '潮差随海岸线形状不同。' },
      listening: { zh: '单音节，与 change 押韵。', en: 'One syllable, rhyming with change.' },
    },
    {
      term: 'spring tide', phonetic: '/sprɪŋ taɪd/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '大潮，朔望潮', en: 'the strong tide when moon and sun pulls combine' },
      usage: { zh: '可数；a spring tide、spring tides near new moon。反义 neap tide。', en: 'Countable: spring tides; the opposite is neap tide.' },
      collocations: ['a spring tide', 'spring tides', 'the spring tide range'],
      example: { en: 'Spring tides bring the highest highs.', zh: '大潮带来最高高潮。' },
      listening: { zh: 'spring 单音节，tide 单音节，重音在 spring。', en: 'Two words; stress falls on spring.' },
    },
    {
      term: 'shellfish', phonetic: '/ˈʃelfɪʃ/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '贝类，有壳水生动物', en: 'the shelled creatures living on the intertidal rocks' },
      usage: { zh: '可数，复数同形；shellfish clamp shut、rock shellfish。', en: 'Countable, plural unchanged: rock shellfish.' },
      collocations: ['shellfish clamp shut', 'intertidal shellfish', 'the shellfish beds'],
      example: { en: 'Shellfish keep moisture inside their shells.', zh: '贝类把水分留在壳内。' },
      listening: { zh: '双音节，重音在第一音节 /ˈʃel/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'buoys', phonetic: '/bɔɪz/', partOfSpeech: 'n.', sentenceIndex: 49,
      meaning: { zh: '浮标（航道标记）', en: 'the channel marker that rises and falls with the tide' },
      usage: { zh: '可数；buoys on the channel、the channel buoy。', en: 'Countable: channel buoys move with the tide.' },
      collocations: ['channel buoys', 'the buoy on the water', 'the buoy line'],
      example: { en: 'Buoys rise and fall with the tide.', zh: '浮标随潮汐升降。' },
      listening: { zh: '单音节，与 boy 同音。', en: 'One syllable, homophone of boy.' },
    },
  ],
  expressions: [
    {
      phrase: 'comes from', sentenceIndex: 2,
      meaning: { zh: '来自，由……产生', en: 'to be caused by the stated force' },
      usage: { zh: '动词短语：the force comes from the moon、come from gravity。', en: 'Comes from means originates from; compare driven by.' },
      example: { en: 'The force comes from the moon.', zh: '引潮力来自月球。' },
    },
    {
      phrase: 'every twelve hours', sentenceIndex: 6,
      meaning: { zh: '每十二小时一次', en: 'the repeating interval between two high tides' },
      usage: { zh: '时间短语；every twelve hours、every six months。', en: 'Every marks the interval; compare twice a day.' },
      example: { en: 'High tide comes every twelve hours.', zh: '高潮每十二小时一次。' },
    },
    {
      phrase: 'between high tide and low', sentenceIndex: 8,
      meaning: { zh: '在高潮与低潮之间', en: 'the zone sitting between the two water levels' },
      usage: { zh: '介词短语；between high and low tide、between the two levels。', en: 'Between high and low marks the intertidal strip.' },
      example: { en: 'The zone sits between high and low tide.', zh: '该区域在高低潮之间。' },
    },
    {
      phrase: 'plan the departure', sentenceIndex: 23,
      meaning: { zh: '安排离港（时机）', en: 'to choose when the vessel leaves the port' },
      usage: { zh: '动宾短语；plan the departure、plan the entry。', en: 'Plan the departure means time the leaving; compare schedule the exit.' },
      example: { en: 'Sailors plan the departure from the tables.', zh: '水手按潮候表安排离港。' },
    },
    {
      phrase: 'line up', sentenceIndex: 17,
      meaning: { zh: '排成一线（月日共线）', en: 'to align so the two pulls add together' },
      usage: { zh: '短语动词；moon and sun line up、line up in space。', en: 'Line up means align; compare align with.' },
      example: { en: 'Moon and sun line up at spring tide.', zh: '大潮时月日共线。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格按自然顺序填词', en: 'Fill the table in natural order' },
      body: {
        zh: '四空依次是月球、十二、高潮、离港。听到 comes from the moon、every twelve hours、between high tide、plan the departure 直接落笔；题干已给 hours、low tide 等引导词，不要重复写。',
        en: 'The four blanks are moon, twelve, high and departure. Write at comes from the moon, every twelve hours, between high tide and plan the departure; do not repeat printed leads such as hours and low tide.',
      },
    },
    {
      title: { zh: '单选定原因与生存策略', en: 'Pick causes and survival strategies' },
      body: {
        zh: '月球主导是因为距离近、引力强；大潮是月日共线叠加；潮间带生物靠固着岩石或闭壳储水。产热反光、弦月抵消、刮风推水、游向深水都是干扰项。',
        en: 'The moon dominates through closeness and stronger pull; a spring tide aligns moon and sun; creatures cling or clamp shut to store water. Heating, reflection, quarter-moon cancellation, wind and swimming away are distractors.',
      },
    },
    {
      title: { zh: '多选排除被否定的说法', en: 'Rule out negated multiple-choice items' },
      body: {
        zh: '三项入选：潮候表定安全进港、潮间带岩石有海藻贝类、潮差随海岸线形状变化。深水仍有潮汐运动；月亮不会每晚变大；海滩高潮被水淹没而非保持干燥。听到 still moves、does not grow、does not stay dry 就划掉对应项。',
        en: 'The three are safe harbour entry, intertidal seaweeds and shellfish, and range shaped by coastline. Deep water still moves, the moon does not grow, and beaches flood at high tide. Cross out options at still moves, does not grow and does not stay dry.',
      },
    },
  ],
};
