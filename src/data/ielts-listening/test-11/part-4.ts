import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 11 · Part 4 — 罗马道路（单人讲座，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：道路用途 → 选线原则 → 分层构造 → 排水与材料 → 长期联结作用 → 维护与 durability →
 * 复盘单选（37–40）。笔记填空 31–36 在前半与中段，单选证据集中在后半复盘段。
 */
export const test11Part4: ListeningLesson = {
  slug: 'test-11-part-4',
  part: 4,
  status: 'published',
  title: { zh: '罗马道路', en: 'Roman roads' },
  summary: {
    zh: '讲座介绍罗马道路的选址原则、分层构造、排水沟设计与本地材料使用，说明道路如何把诸省联结成一个帝国，并复盘坡度、铺面、排水与长期影响等关键问题。',
    en: 'The lecture covers route selection, layered construction, drainage ditches and local materials, explains how the roads bound the provinces into one empire, and reviews slope, paving, drainage and long-term impact.',
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
        { lead: 'Roads moved soldiers and', cells: [[{ blank: 31 }, { text: ' quickly between provinces' }]] },
        { lead: 'Surveyors chose routes that avoided steep', cells: [[{ blank: 32 }]] },
        { lead: 'Lowest layer: foundation of', cells: [[{ blank: 33 }, { text: ' and gravel' }]] },
        { lead: 'Ditches dug along the road', cells: [[{ blank: 34 }]] },
        { lead: 'Builders preferred local', cells: [[{ blank: 35 }, { text: ' where strong enough' }]] },
        { lead: 'Long term: provinces bound into one', cells: [[{ blank: 36 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'Why did surveyors avoid steep hills?',
          options: [
            { key: 'A', text: 'To give travellers a shorter distance' },
            { key: 'B', text: 'To keep gradients manageable for soldiers and carts' },
            { key: 'C', text: 'To avoid crossing any river valleys' },
          ],
        },
        {
          number: 38,
          stem: 'What formed the wearing surface of the road?',
          options: [
            { key: 'A', text: 'Large fitted stone blocks' },
            { key: 'B', text: 'A layer of packed gravel only' },
            { key: 'C', text: 'Wooden logs laid across the trench' },
          ],
        },
        {
          number: 39,
          stem: 'What was the main purpose of the side ditches?',
          options: [
            { key: 'A', text: 'To mark the boundary of the road' },
            { key: 'B', text: 'To store water for nearby farms' },
            { key: 'C', text: 'To protect the foundations by draining rainwater' },
          ],
        },
        {
          number: 40,
          stem: 'What was the most important long-term effect of the road network?',
          options: [
            { key: 'A', text: 'It ended local trade in most provinces' },
            { key: 'B', text: 'It allowed people, goods and ideas to move across provinces' },
            { key: 'C', text: 'It reduced the number of soldiers stationed abroad' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['supplies'], evidence: 3,
      explanation: {
        zh: '定位句 3：they allowed soldiers and supplies to move quickly。题目已给 soldiers and，填 supplies；句 4 的 food, weapons and baggage 是补充说明，不是答案词。',
        en: 'Sentence 3: roads let "soldiers and supplies to move quickly". Soldiers and is printed, so fill supplies. Food, weapons and baggage in sentence 4 are extra detail.',
      },
    },
    {
      number: 32, accepted: ['hills'], evidence: 9,
      explanation: {
        zh: '定位句 9：They avoided steep hills, because carts and marching columns struggled on sharp gradients。填 hills；句 10 的 gentle slopes 是对策，不是被避开的对象。',
        en: 'Sentence 9: "They avoided steep hills, because carts and marching columns struggled on sharp gradients", so fill hills. Gentle slopes in sentence 10 are the solution.',
      },
    },
    {
      number: 33, accepted: ['stones'], evidence: 14,
      explanation: {
        zh: '定位句 14：a foundation of stones and gravel。题目已给 and gravel，填 stones；句 15 的 broken rock 是上一层，不是最底层材料。',
        en: 'Sentence 14: "a foundation of stones and gravel". And gravel is printed, so fill stones. Broken rock in sentence 15 is the layer above.',
      },
    },
    {
      number: 34, accepted: ['sides'], evidence: 22,
      explanation: {
        zh: '定位句 22：ditches were dug along the road sides。填 sides；句 23 的 puddles 是排水沟解决的问题，不是位置。',
        en: 'Sentence 22: "ditches were dug along the road sides", so fill sides. Puddles in sentence 23 are the problem the drains solve.',
      },
    },
    {
      number: 35, accepted: ['stone'], evidence: 25,
      explanation: {
        zh: '定位句 25：Builders preferred local stone where it was strong enough。填 stone；句 26 的 imported blocks 是仅用于铺面的例外材料。',
        en: 'Sentence 25: "Builders preferred local stone where it was strong enough", so fill stone. Imported blocks in sentence 26 are the exception for the surface.',
      },
    },
    {
      number: 36, accepted: ['empire'], evidence: 28,
      explanation: {
        zh: '定位句 28：these paved routes bound the provinces into one empire。题目已给 one，填 empire；句 33 的 weaken 是帝国后期，不是这里的长期结果。',
        en: 'Sentence 28: "these paved routes bound the provinces into one empire". One is printed, so fill empire. Weakening in sentence 33 is a later period.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 37,
      explanation: {
        zh: '定位句 37：Columns of soldiers and heavy carts simply could not climb sharp gradients at a steady pace。避开陡坡是为了让队伍和车辆能稳步通行，对应 B。',
        en: 'Sentence 37: "Columns of soldiers and heavy carts simply could not climb sharp gradients at a steady pace", matching B.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 38,
      explanation: {
        zh: '定位句 38：the fitted stone blocks were chosen because they resisted wear and could be renewed piece by piece。表层铺面是大块拼合石板，对应 A。',
        en: 'Sentence 38: the "fitted stone blocks" resisted wear and could be renewed piece by piece, matching A.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 39,
      explanation: {
        zh: '定位句 39：The side ditches existed chiefly to protect the foundations, by keeping rainwater from soaking into the trench。排水沟保护路基，对应 C。',
        en: 'Sentence 39: ditches existed "chiefly to protect the foundations, by keeping rainwater from soaking into the trench", matching C.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 43,
      explanation: {
        zh: '定位句 43：Roads also carried ideas, laws and language, binding distant regions together。道路让人、货与思想跨省流动，对应 B。A 的终结本地贸易、C 的减少驻军均未提及。',
        en: 'Sentence 43: roads "carried ideas, laws and language, binding distant regions together", matching B. Ending local trade and reducing troops are not mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'At its peak, the Roman road network stretched over fifty thousand miles across three continents.' },
    { speaker: 'lecturer', text: 'Today I’ll look at how those roads were planned, built and maintained, and why they lasted so long.' },
    { speaker: 'lecturer', text: 'Roads were not built only for trade.' },
    { speaker: 'lecturer', text: 'Above all, they allowed soldiers and supplies to move quickly between the provinces.' },
    { speaker: 'lecturer', text: 'A legion could march many miles in a day, and its food, weapons and baggage followed the same paved route.' },
    { speaker: 'lecturer', text: 'Without this network, holding distant territories would have been far harder.' },
    { speaker: 'lecturer', text: 'The first task was choosing the line.' },
    { speaker: 'lecturer', text: 'Roman surveyors walked the land before any digging began.' },
    { speaker: 'lecturer', text: 'They used sighting poles and simple instruments to keep the route as straight as conditions allowed.' },
    { speaker: 'lecturer', text: 'They avoided steep hills, because carts and marching columns struggled on sharp gradients.' },
    { speaker: 'lecturer', text: 'Gentle slopes mattered more than a perfectly direct line, especially where heavy equipment had to pass.' },
    { speaker: 'lecturer', text: 'Routes also had to cross rivers at easy fords, or leave room for a bridge.' },
    { speaker: 'lecturer', text: 'Once the line was marked, workers cleared the ground and dug a shallow trench.' },
    { speaker: 'lecturer', text: 'The road itself was built in several layers, rather than as a single pile of stone.' },
    { speaker: 'lecturer', text: 'At the bottom, they laid a foundation of stones and gravel to raise the surface above the wet soil.' },
    { speaker: 'lecturer', text: 'Above that came a layer of broken rock packed firm, which drained water away from the centre.' },
    { speaker: 'lecturer', text: 'Near the top, smaller stones were set in mortar to create a level bedding.' },
    { speaker: 'lecturer', text: 'The final wearing surface was made of large fitted blocks, cut so close together that little gap remained.' },
    { speaker: 'lecturer', text: 'These blocks wore down slowly under cart wheels and boots, and they could be replaced section by section.' },
    { speaker: 'lecturer', text: 'A road of this thickness would settle over time, so workers repaired the top surface each season.' },
    { speaker: 'lecturer', text: 'Water was the biggest threat to the foundations.' },
    { speaker: 'lecturer', text: 'Rain that sank into the ground could soften the trench and shift the layers above.' },
    { speaker: 'lecturer', text: 'For this reason, ditches were dug along the road sides to carry rainwater away.' },
    { speaker: 'lecturer', text: 'The drains also stopped puddles from sitting on the surface after storms.' },
    { speaker: 'lecturer', text: 'Where the ground was flat, the road was raised slightly on a low embankment to improve the slope.' },
    { speaker: 'lecturer', text: 'Builders preferred local stone where it was strong enough, to cut down on long haulage.' },
    { speaker: 'lecturer', text: 'Imported blocks were used only for the final surface, where smoothness mattered most.' },
    { speaker: 'lecturer', text: 'The use of local materials also made repairs easier for soldiers stationed nearby.' },
    { speaker: 'lecturer', text: 'In the long view, these paved routes bound the provinces into one empire.' },
    { speaker: 'lecturer', text: 'Maintenance was organised by the state, not left to chance.' },
    { speaker: 'lecturer', text: 'Each legion road had assigned repair parties, who filled cracks and reset loose blocks.' },
    { speaker: 'lecturer', text: 'Milestones along the route marked distance and gave travellers a fixed point to report damage.' },
    { speaker: 'lecturer', text: 'The roads were wide enough for two carts to pass, with a firm shoulder for pedestrians.' },
    { speaker: 'lecturer', text: 'Many sections survived for centuries after the empire itself began to weaken.' },
    { speaker: 'lecturer', text: 'Their durability came from the deep foundations and the careful drainage, not from the top stones alone.' },
    { speaker: 'lecturer', text: 'Scholars once thought Roman roads were built by slaves, but most were laid by soldiers and skilled engineers.' },
    { speaker: 'lecturer', text: 'Looking back at the route choices, the avoidance of steep slopes was practical rather than aesthetic.' },
    { speaker: 'lecturer', text: 'Columns of soldiers and heavy carts simply could not climb sharp gradients at a steady pace.' },
    { speaker: 'lecturer', text: 'As for the top surface, the fitted stone blocks were chosen because they resisted wear and could be renewed piece by piece.' },
    { speaker: 'lecturer', text: 'The side ditches existed chiefly to protect the foundations, by keeping rainwater from soaking into the trench.' },
    { speaker: 'lecturer', text: 'The long-term effect reached far beyond movement of troops.' },
    { speaker: 'lecturer', text: 'Goods, coins and letters travelled along the same paved routes as the legions.' },
    { speaker: 'lecturer', text: 'Merchants moved between provinces that had previously traded only by rough tracks.' },
    { speaker: 'lecturer', text: 'Roads also carried ideas, laws and language, binding distant regions together.' },
    { speaker: 'lecturer', text: 'Towns grew up at road junctions, and many modern cities still sit on those old crossing points.' },
    { speaker: 'lecturer', text: 'Even after the surface blocks wore away, the line of the road shaped later maps and field boundaries.' },
    { speaker: 'lecturer', text: 'To study a Roman road today is to read a map of Roman power itself.' },
    { speaker: 'lecturer', text: 'Next week we’ll look at the bridges that carried these roads across the rivers.' },
    { speaker: 'lecturer', text: 'The roads also carried messengers who crossed provinces before the winter rains.' },
    { speaker: 'lecturer', text: 'Their surface remained solid even when heavy wagons passed in single file.' },
    { speaker: 'lecturer', text: 'In some regions, Roman road lines are still visible in country boundaries today.' },
  ],
  vocabulary: [
    {
      term: 'provinces', phonetic: '/ˈprɒvɪnsɪz/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '（罗马帝国的）行省', en: 'regions ruled by a distant imperial government' },
      usage: { zh: '可数复数；the Roman provinces、provincial town。', en: 'Countable plural: the Roman provinces, a provincial town.' },
      collocations: ['the Roman provinces', 'distant provinces', 'provincial roads'],
      example: { en: 'Legions were stationed in the northern provinces.', zh: '军团驻扎在北部行省。' },
      listening: { zh: '重音在第一音节 /ˈprɒ/，词尾 /z/ 清晰。', en: 'Stress the first syllable; the final /z/ is clear.' },
    },
    {
      term: 'surveyors', phonetic: '/səˈveɪəz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '测量员，路线勘测者', en: 'people who measure and mark out land or routes' },
      usage: { zh: '可数复数；动词 survey。', en: 'Countable plural; the verb is survey.' },
      collocations: ['Roman surveyors', 'the road surveyors', 'land surveyors'],
      example: { en: 'Surveyors marked the line before digging began.', zh: '测量员在动工前标出路线。' },
      listening: { zh: '重音在第二音节 /ˈveɪ/。', en: 'Stress the second syllable /ˈveɪ/.' },
    },
    {
      term: 'gradients', phonetic: '/ˈɡreɪdiənts/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '坡度，倾斜度', en: 'the steepness of a slope or hill' },
      usage: { zh: '可数；sharp/gentle gradient。形容词 gradual。', en: 'Countable: a sharp or gentle gradient; the adjective is gradual.' },
      collocations: ['a sharp gradient', 'steep gradients', 'a gentle gradient'],
      example: { en: 'The route avoids gradients steeper than one in ten.', zh: '路线避开陡于一比十的坡度。' },
      listening: { zh: '重音在第一音节 /ˈɡreɪ/。', en: 'Stress the first syllable /ˈɡreɪ/.' },
    },
    {
      term: 'foundation', phonetic: '/faʊnˈdeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '路基，地基', en: 'the solid base under a building or road' },
      usage: { zh: '可数；road foundation、lay a foundation。', en: 'Countable: a road foundation, lay a foundation.' },
      collocations: ['the road foundation', 'a deep foundation', 'protect the foundation'],
      example: { en: 'The stone foundation keeps the surface above wet soil.', zh: '石质地基让路面高于湿土。' },
      listening: { zh: '重音在第二音节 /ˈdeɪ/。', en: 'Stress the second syllable /ˈdeɪ/.' },
    },
    {
      term: 'mortar', phonetic: '/ˈmɔːtə/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '灰浆，砂浆', en: 'a paste that binds stones or bricks together' },
      usage: { zh: '不可数；set in mortar。注意与军事武器 mortar 同形。', en: 'Uncountable: set in mortar. Same spelling as the weapon.' },
      collocations: ['set in mortar', 'lime mortar', 'mortar and stone'],
      example: { en: 'Small stones were bedded in mortar.', zh: '小石块铺在灰浆层上。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈmɔː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'embankment', phonetic: '/ɪmˈbæŋkmənt/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '路堤，堤道', en: 'a raised bank carrying a road or railway over flat ground' },
      usage: { zh: '可数；a low embankment、railway embankment。', en: 'Countable: a low embankment, a railway embankment.' },
      collocations: ['a low embankment', 'raise the embankment', 'the road embankment'],
      example: { en: 'The road sat on a low embankment to drain well.', zh: '道路筑在低矮路堤上以利排水。' },
      listening: { zh: '重音在第二音节 /ˈbæŋk/。', en: 'Stress the second syllable /ˈbæŋk/.' },
    },
    {
      term: 'haulage', phonetic: '/ˈhɔːlɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '长途运输，搬运', en: 'the transport of goods over a distance' },
      usage: { zh: '不可数；long haulage、road haulage。动词 haul。', en: 'Uncountable: long haulage, road haulage; the verb is haul.' },
      collocations: ['long haulage', 'reduce haulage', 'stone haulage'],
      example: { en: 'Local stone cuts down on haulage costs.', zh: '本地石料减少运输成本。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈhɔː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'durability', phonetic: '/ˌdjʊərəˈbɪləti/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '耐久性，耐用程度', en: 'how long something lasts without breaking down' },
      usage: { zh: '不可数；形容词 durable。', en: 'Uncountable; the adjective is durable.' },
      collocations: ['the road’s durability', 'long durability', 'test durability'],
      example: { en: 'Durability depends on the foundation, not the top stones.', zh: '耐久性取决于地基，而不是表层石块。' },
      listening: { zh: '重音在第三音节 /ˈbɪl/。', en: 'Stress the third syllable /ˈbɪl/.' },
    },
  ],
  expressions: [
    {
      phrase: 'above all', sentenceIndex: 3,
      meaning: { zh: '最重要的是，首先', en: 'most importantly; before everything else' },
      usage: { zh: '句首状语；引出最核心的目的。', en: 'Sentence adverbial introducing the main purpose.' },
      example: { en: 'Above all, the roads moved troops quickly.', zh: '最重要的是，道路能快速调动军队。' },
    },
    {
      phrase: 'leave room for', sentenceIndex: 11,
      meaning: { zh: '为……留出空间', en: 'to keep space available for something' },
      usage: { zh: '为某事物留出空间；常见 leave room for a bridge、leave room for expansion。', en: 'leave room for a bridge, leave room for expansion.' },
      example: { en: 'The route left room for a stone bridge.', zh: '路线为石桥留出了位置。' },
    },
    {
      phrase: 'cut down on', sentenceIndex: 25,
      meaning: { zh: '减少（成本、运输量）', en: 'to reduce the amount or cost of something' },
      usage: { zh: '及物短语；cut down on haulage、cut down on waste。', en: 'Transitive: cut down on haulage, cut down on waste.' },
      example: { en: 'Local materials cut down on transport.', zh: '本地材料减少运输量。' },
    },
    {
      phrase: 'in the long view', sentenceIndex: 28,
      meaning: { zh: '从长远看', en: 'over a long period of time' },
      usage: { zh: '句首状语；与 in the short term 相对。', en: 'Sentence adverbial; the opposite is in the short term.' },
      example: { en: 'In the long view, the roads held the empire together.', zh: '从长远看，道路维系了帝国。' },
    },
    {
      phrase: 'piece by piece', sentenceIndex: 38,
      meaning: { zh: '逐块地，分件地', en: 'one part at a time, separately' },
      usage: { zh: '方式状语；替换、修缮时分块进行。', en: 'Adverbial of manner; repairs are done one block at a time.' },
      example: { en: 'Loose blocks were renewed piece by piece.', zh: '松动的石块逐块更换。' },
    },
    {
      phrase: 'wore away', sentenceIndex: 45,
      meaning: { zh: '磨掉，磨损', en: 'to become slowly removed by rubbing or use' },
      usage: { zh: '可分短语动词；the surface wore away。', en: 'Separable: the surface wore away.' },
      example: { en: 'The top blocks wore away over centuries.', zh: '表层石块几个世纪后磨掉了。' },
    },
  ],
  tips: [
    {
      title: { zh: '讲座笔记跟着层次走', en: 'Follow the layers in lecture notes' },
      body: {
        zh: '道路构造按自下而上的顺序讲：底层 stones、中间 broken rock、表层 fitted blocks。记笔记时在每条材料旁标出所在层位，防止把上层碎石填进最底层空。',
        en: 'Construction runs bottom to top: stones at the base, broken rock above, fitted blocks on top. Label the layer beside each material so you do not fill a top-layer stone into the base item.',
      },
    },
    {
      title: { zh: '区分材料词与用途词', en: 'Separate material words from purpose words' },
      body: {
        zh: '同一组词既可能是材料也可能是用途：stone 既指本地石料（35 空），也出现在表层铺面。先看题干修饰词 local、wearing surface，再决定填材料还是定位用途。',
        en: 'The same words cover material and purpose: stone is the local material in item 35 and appears in the top surface. Check the modifier, local or wearing surface, before choosing.',
      },
    },
    {
      title: { zh: '复盘段是单选密集区', en: 'The recap carries the single-choice items' },
      body: {
        zh: '后半段 Looking back at、As for、The side ditches existed 是讲座对前文的复盘，37–40 的答案集中在这里。听到这类总结短语就把注意力放到选项匹配上。',
        en: 'The later recap, marked by Looking back at, As for and The side ditches existed, carries items 37–40. Shift to option matching when you hear these summary phrases.',
      },
    },
  ],
};
