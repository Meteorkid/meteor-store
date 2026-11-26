import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 27 · Part 4 — 制冷技术发明讲座（单人独白）。原创仿真材料，非官方真题。
 *
 * 讲座先用概述给出四道单选答案（古代冰藏、压缩循环、战后家用冰柜、现代冷链），
 * 再按年代展开细节笔记（采冰季节、冰屋墙体、制冷剂、铁路运输、家用冰箱、货架终点）。
 */
export const test27Part4: ListeningLesson = {
  slug: 'test-27-part-4',
  part: 4,
  status: 'published',
  title: { zh: '制冷技术的发明', en: 'The invention of refrigeration' },
  summary: {
    zh: '讲座回顾制冷从天然冰藏到机械制冷再到现代冷链的历程：古代城市把冰块存进隔热地窖保鲜；十九世纪改进的压缩循环让人工制冷成为可能；战后家用冰柜普及推动冷冻食品进入普通家庭；现代冷链把产地农场和远方市场连成一体。细节部分讲冬季从湖面采冰、砖与稻草隔热的冰屋、以氨为制冷剂的早期机器、跨州铁路冷藏肉、放在地面的家用冰箱，以及冷链最终送达超市货架。',
    en: 'The lecture traces cold storage from natural ice to mechanical refrigeration and the cold chain. Ancient cities cooled food in insulated cellars; the compression cycle enabled artificial cold in the 1800s; post-war freezers spread frozen food; today’s chain links farms to distant markets. Details cover winter ice, ice houses, ammonia, rail meat, the ice box, and the supermarket shelf.',
  },
  accent: { zh: '讲者为美国口音英语。', en: 'The lecturer speaks with an American English accent.' },
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
          stem: 'How did ancient cities keep food cool?',
          options: [
            { key: 'A', text: 'by burying food in dry sand' },
            { key: 'B', text: 'by storing blocks of ice in insulated cellars' },
            { key: 'C', text: 'by hanging meat in shaded river water' },
          ],
        },
        {
          number: 32,
          stem: 'What made mechanical refrigeration possible in the nineteenth century?',
          options: [
            { key: 'A', text: 'the improved compression cycle' },
            { key: 'B', text: 'the first insulated railway wagon' },
            { key: 'C', text: 'the widespread home freezer' },
          ],
        },
        {
          number: 33,
          stem: 'Why did frozen foods spread after the war?',
          options: [
            { key: 'A', text: 'ice delivery became cheaper than ever' },
            { key: 'B', text: 'canning replaced frozen storage' },
            { key: 'C', text: 'home freezers became common' },
          ],
        },
        {
          number: 34,
          stem: 'What does the lecturer say about the modern cold chain?',
          options: [
            { key: 'A', text: 'it serves only the nearest local markets' },
            { key: 'B', text: 'it links farms to distant markets' },
            { key: 'C', text: 'it runs without temperature monitoring' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Ice was cut from frozen lakes in', cells: [[{ blank: 35 }]] },
        { lead: 'Ice houses lined with', cells: [[{ blank: 36 }, { text: ' and straw.' }]] },
        { lead: 'First artificial machine used', cells: [[{ blank: 37 }, { text: ' as the cooling gas.' }]] },
        { lead: 'Rail cars carried refrigerated', cells: [[{ blank: 38 }, { text: ' across states.' }]] },
        { lead: 'Early ice box sat on the', cells: [[{ blank: 39 }, { text: ' near the kitchen wall.' }]] },
        { lead: 'Cold chain ends at the supermarket', cells: [[{ blank: 40 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['B'], evidence: 3,
      explanation: {
        zh: '定位句 3：cities kept food cool by storing blocks of ice in insulated cellars。古代靠隔热地窖存冰块保鲜，对应 B。A 的干沙埋藏与 C 的河水悬挂在录音中未出现。',
        en: 'Sentence 3: "cities kept food cool by storing blocks of ice in insulated cellars". Ancient cities stored ice in insulated cellars, matching B. Dry sand and shaded river water are not mentioned.',
      },
    },
    {
      number: 32, accepted: ['A'], evidence: 7,
      explanation: {
        zh: '定位句 7：What made mechanical refrigeration possible was the improved compression cycle。十九世纪改进的压缩循环使机械制冷成为可能，对应 A。B 的铁路保温车属于运输阶段，C 的家用冰柜是战后现象。',
        en: 'Sentence 7: "What made mechanical refrigeration possible was the improved compression cycle". The improved compression cycle enabled mechanical refrigeration, matching A. The insulated wagon belongs to transport, and the home freezer to the post-war period.',
      },
    },
    {
      number: 33, accepted: ['C'], evidence: 9,
      explanation: {
        zh: '定位句 9：frozen foods spread quickly because home freezers became common in ordinary kitchens。战后冷冻食品普及是因为家用冰柜进入普通厨房，对应 C。A 的送冰更便宜与 B 的罐头取代冷冻在录音中未出现。',
        en: 'Sentence 9: "frozen foods spread quickly because home freezers became common in ordinary kitchens". Common home freezers drove the spread, matching C. Cheaper ice delivery and canning replacing freezing are not mentioned.',
      },
    },
    {
      number: 34, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：the modern cold chain links farms to distant markets。现代冷链把农场与远方市场连接起来，对应 B。A 的只供本地市场与 C 的无需温控监测与讲座说法相反。',
        en: 'Sentence 11: "the modern cold chain links farms to distant markets". The chain connects farms to distant markets, matching B. Local-only service and no monitoring contradict the lecture.',
      },
    },
    {
      number: 35, accepted: ['winter'], evidence: 14,
      explanation: {
        zh: '定位句 14：Ice was cut from frozen lakes in winter, when the surface was thick enough to walk on。采冰在冬季湖面结冰足够厚时进行，填 winter。',
        en: 'Sentence 14: "Ice was cut from frozen lakes in winter, when the surface was thick enough to walk on". Ice was harvested in winter, so write winter.',
      },
    },
    {
      number: 36, accepted: ['brick'], evidence: 17,
      explanation: {
        zh: '定位句 17：The walls were lined with brick and straw, which trapped air and slowed the melt。冰屋墙体用砖和稻草砌衬，填 brick。straw 已在题干给出。',
        en: 'Sentence 17: "The walls were lined with brick and straw, which trapped air and slowed the melt". The walls used brick and straw, so write brick. Straw is already given in the lead.',
      },
    },
    {
      number: 37, accepted: ['ammonia'], evidence: 21,
      explanation: {
        zh: '定位句 21：the first artificial ice machine used ammonia as the cooling gas。第一台人工制冰机以氨作制冷剂，填 ammonia。句 25 提到后来家用机改用更安全的气体。',
        en: 'Sentence 21: "the first artificial ice machine used ammonia as the cooling gas". The first machine used ammonia, so write ammonia. Sentence 25 notes safer gases later replaced it in domestic machines.',
      },
    },
    {
      number: 38, accepted: ['meat'], evidence: 27,
      explanation: {
        zh: '定位句 27：Rail cars carried refrigerated meat across states。铁路冷藏车跨州运送冷藏肉，填 meat。句 29 以后同类车厢才运果蔬。',
        en: 'Sentence 27: "Rail cars carried refrigerated meat across states". Rail cars shipped chilled meat, so write meat. Fruit and vegetables followed in similar wagons later, in sentence 30.',
      },
    },
    {
      number: 39, accepted: ['floor'], evidence: 32,
      explanation: {
        zh: '定位句 32：The ice box sat on the floor near the kitchen wall。早期冰箱放在厨房墙边的地面上，填 floor。top compartment 是放冰块的隔层，不是冰箱位置。',
        en: 'Sentence 32: "The ice box sat on the floor near the kitchen wall". The ice box stood on the floor, so write floor. The top compartment held the ice, not the box’s own position.',
      },
    },
    {
      number: 40, accepted: ['shelf'], evidence: 44,
      explanation: {
        zh: '定位句 44：From there it moves to distribution centres and finally to the supermarket shelf。冷链最后送达超市货架，填 shelf。',
        en: 'Sentence 44: "From there it moves to distribution centres and finally to the supermarket shelf". The chain ends at the supermarket shelf, so write shelf.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Before refrigeration, a block of ice was worth more than a bag of flour in some summer markets.' },
    { speaker: 'lecturer', text: 'Today we will trace how cold storage moved from frozen lakes to the shelves of every supermarket.' },
    { speaker: 'lecturer', text: 'The story begins with the ice that nature itself supplied.' },
    { speaker: 'lecturer', text: 'In ancient times, cities kept food cool by storing blocks of ice in insulated cellars.' },
    { speaker: 'lecturer', text: 'The thick walls slowed the melting, and food stayed fresh for several extra days.' },
    { speaker: 'lecturer', text: 'This method depended on a steady supply of ice, which was not available everywhere.' },
    { speaker: 'lecturer', text: 'By the nineteenth century, inventors were trying to make cold without natural ice.' },
    { speaker: 'lecturer', text: 'What made mechanical refrigeration possible was the improved compression cycle, which circulated a gas under pressure.' },
    { speaker: 'lecturer', text: 'Early machines were large and expensive, but they proved that artificial cold could replace ice.' },
    { speaker: 'lecturer', text: 'After the war, frozen foods spread quickly because home freezers became common in ordinary kitchens.' },
    { speaker: 'lecturer', text: 'Families no longer needed a weekly market trip to keep meat and vegetables fresh.' },
    { speaker: 'lecturer', text: 'Today the modern cold chain links farms to distant markets, so food grown in one region reaches tables far away.' },
    { speaker: 'lecturer', text: 'That broad outline sets the scene. Now the details of how each stage worked.' },
    { speaker: 'lecturer', text: 'The earliest ice trade relied on frozen lakes and ponds in the coldest months.' },
    { speaker: 'lecturer', text: 'Ice was cut from frozen lakes in winter, when the surface was thick enough to walk on.' },
    { speaker: 'lecturer', text: 'Workers sawed the blocks into uniform sizes and dragged them to storage.' },
    { speaker: 'lecturer', text: 'These storage buildings were called ice houses, and they sat half underground to stay cool.' },
    { speaker: 'lecturer', text: 'The walls were lined with brick and straw, which trapped air and slowed the melt.' },
    { speaker: 'lecturer', text: 'Sawdust was often packed around the blocks to keep them apart and absorb water.' },
    { speaker: 'lecturer', text: 'Even so, a good ice house lost only part of its stock over the summer.' },
    { speaker: 'lecturer', text: 'The ice was then sold to households, inns, and market traders who kept perishable food.' },
    { speaker: 'lecturer', text: 'Moving to artificial cold, the first artificial ice machine used ammonia as the cooling gas.' },
    { speaker: 'lecturer', text: 'Ammonia absorbed heat as it evaporated, then released it again outside the insulated box.' },
    { speaker: 'lecturer', text: 'The machine repeated this cycle automatically, with no need for a worker to carry ice.' },
    { speaker: 'lecturer', text: 'Early versions ran on steam, and their noise filled the whole factory floor.' },
    { speaker: 'lecturer', text: 'Over time, safer gases replaced ammonia in domestic machines, but the principle stayed the same.' },
    { speaker: 'lecturer', text: 'Once factories could make ice cheaply, transport became the next problem.' },
    { speaker: 'lecturer', text: 'Rail cars carried refrigerated meat across states, instead of herding cattle to the city.' },
    { speaker: 'lecturer', text: 'The insulated wagon kept the carcass cold for the long journey to the slaughterhouse.' },
    { speaker: 'lecturer', text: 'This changed the food map, ranchers could sell to cities hundreds of miles away.' },
    { speaker: 'lecturer', text: 'Similar wagons later carried fruit and vegetables that once spoiled on the road.' },
    { speaker: 'lecturer', text: 'In the home, the first cold appliance was the ice box, not an electric fridge.' },
    { speaker: 'lecturer', text: 'The ice box sat on the floor near the kitchen wall, with a block of ice in the top compartment.' },
    { speaker: 'lecturer', text: 'Food went on lower shelves, and melted water drained into a tray below.' },
    { speaker: 'lecturer', text: 'When electric fridges arrived, they replaced the daily ice delivery with a closed machine.' },
    { speaker: 'lecturer', text: 'Household fridges moved food away from the open shelf and into a sealed, cooled interior.' },
    { speaker: 'lecturer', text: 'The diet of ordinary families changed as a result.' },
    { speaker: 'lecturer', text: 'Before cold storage, seasonal food dominated the table, and winter meant stored grain and root crops.' },
    { speaker: 'lecturer', text: 'Refrigeration allowed fruit and dairy to travel beyond their local growing area.' },
    { speaker: 'lecturer', text: 'Families could eat meat from distant farms and fish caught on another coast.' },
    { speaker: 'lecturer', text: 'Frozen meals later added convenience, though they changed how food tasted and was prepared.' },
    { speaker: 'lecturer', text: 'The cold chain itself is a connected system rather than one single machine.' },
    { speaker: 'lecturer', text: 'It starts at the farm, where produce is cooled soon after harvest.' },
    { speaker: 'lecturer', text: 'Refrigerated lorries carry it to a regional warehouse, where it waits in a chilled room.' },
    { speaker: 'lecturer', text: 'From there it moves to distribution centres and finally to the supermarket shelf.' },
    { speaker: 'lecturer', text: 'Every step must stay below a set temperature, or the whole batch can spoil.' },
    { speaker: 'lecturer', text: 'Monitoring devices now track the temperature inside each container along the route.' },
    { speaker: 'lecturer', text: 'This reliability is what allows supermarkets to stock food from every season and country.' },
    { speaker: 'lecturer', text: 'Yet the system also carries a cost, in energy and in the packaging that protects chilled goods.' },
    { speaker: 'lecturer', text: 'Historians of food argue that refrigeration reshaped both farming and city eating habits.' },
    { speaker: 'lecturer', text: 'It turned local markets into national ones, and national ones into international ones.' },
    { speaker: 'lecturer', text: 'Next week we will look at how preservation by heat, canning, developed alongside cold storage.' },
    { speaker: 'lecturer', text: 'For today, remember three stages, natural ice, artificial machines, and the connected cold chain.' },
    { speaker: 'lecturer', text: 'That concludes our look at the invention of refrigeration.' },
  ],
  vocabulary: [
    {
      term: 'cellars', phonetic: '/ˈseləz/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '地窖，地下室（复数）', en: 'underground rooms kept cool for storage' },
      usage: { zh: '可数名词复数；insulated cellars、ice cellars、wine cellars。', en: 'Plural countable: insulated cellars, ice cellars, wine cellars.' },
      collocations: ['insulated cellars', 'underground cellars', 'store ice in cellars'],
      example: { en: 'Cities stored blocks of ice in insulated cellars.', zh: '城市把冰块存进隔热地窖。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /z/。', en: 'Two syllables with first-syllable stress; ending /z/.' },
    },
    {
      term: 'compression', phonetic: '/kəmˈpreʃn/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '压缩（制冷循环中的加压环节）', en: 'the pressing of a gas to raise its pressure' },
      usage: { zh: '不可数；compression cycle、under compression。动词 compress。', en: 'Uncountable: compression cycle, under compression. The verb is compress.' },
      collocations: ['the compression cycle', 'gas under compression', 'the compression stage'],
      example: { en: 'The improved compression cycle circulated a gas under pressure.', zh: '改进后的压缩循环让气体在压力下循环。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈpreʃ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'ammonia', phonetic: '/əˈməʊniə/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '氨（早期制冷剂）', en: 'the gas used as the first refrigerant' },
      usage: { zh: '不可数；use ammonia as the cooling gas。', en: 'Uncountable: use ammonia as the cooling gas.' },
      collocations: ['use ammonia', 'ammonia as the cooling gas', 'the ammonia cycle'],
      example: { en: 'The first machine used ammonia as the cooling gas.', zh: '第一台机器以氨作制冷剂。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈməʊ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'meat', phonetic: '/miːt/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '肉，肉类食品', en: 'animal flesh sold as food' },
      usage: { zh: '不可数；refrigerated meat、pack meat。', en: 'Uncountable: refrigerated meat, pack meat.' },
      collocations: ['refrigerated meat', 'fresh meat', 'cut of meat'],
      example: { en: 'Rail cars carried refrigerated meat across states.', zh: '铁路冷藏车跨州运送冷藏肉。' },
      listening: { zh: '单音节；长元音 /iː/，结尾 /t/。', en: 'One syllable; long /iː/ and final /t/.' },
    },
    {
      term: 'shelf', phonetic: '/ʃelf/', partOfSpeech: 'n.', sentenceIndex: 44,
      meaning: { zh: '货架，层板', en: 'the board where goods are displayed for sale' },
      usage: { zh: '可数名词，复数 shelves；supermarket shelf、on the shelf。', en: 'Countable, plural shelves: supermarket shelf, on the shelf.' },
      collocations: ['the supermarket shelf', 'on the shelf', 'stock the shelf'],
      example: { en: 'The chain ends at the supermarket shelf.', zh: '冷链最终送达超市货架。' },
      listening: { zh: '单音节；/ʃ/ 开头，结尾 /lf/。', en: 'One syllable; opening /ʃ/ and final /lf/.' },
    },
    {
      term: 'perishable', phonetic: '/ˈperɪʃəbl/', partOfSpeech: 'adj.', sentenceIndex: 20,
      meaning: { zh: '易腐坏的（食品）', en: 'likely to go bad if not kept cool' },
      usage: { zh: '形容词；perishable food、perishable goods。', en: 'Adjective: perishable food, perishable goods.' },
      collocations: ['perishable food', 'perishable goods', 'keep perishables cold'],
      example: { en: 'Traders kept perishable food with blocks of ice.', zh: '商贩用冰块保鲜易腐食品。' },
      listening: { zh: '四个音节，重音在第一个；/ʃ/ 在第三音节。', en: 'Four syllables with first-syllable stress; /ʃ/ in the third.' },
    },
    {
      term: 'warehouse', phonetic: '/ˈweəhaʊs/', partOfSpeech: 'n.', sentenceIndex: 43,
      meaning: { zh: '仓库，仓储中心', en: 'the large chilled store where goods wait for distribution' },
      usage: { zh: '可数名词；regional warehouse、chilled warehouse。', en: 'Countable: regional warehouse, chilled warehouse.' },
      collocations: ['a regional warehouse', 'a chilled room', 'store goods in the warehouse'],
      example: { en: 'Goods wait in a chilled room at the regional warehouse.', zh: '货物在区域仓库的冷藏间等待分发。' },
      listening: { zh: '复合词 ware 加 house，重音在第一个音节。', en: 'Compound ware plus house, stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'insulated cellars', sentenceIndex: 3,
      meaning: { zh: '隔热地窖', en: 'underground rooms built to slow heat exchange' },
      usage: { zh: '复数；insulated cellars lined with thick walls。', en: 'Plural: insulated cellars lined with thick walls.' },
      example: { en: 'Ice blocks were kept in insulated cellars through the summer.', zh: '冰块整夏存放在隔热地窖里。' },
    },
    {
      phrase: 'compression cycle', sentenceIndex: 7,
      meaning: { zh: '压缩循环', en: 'the repeated pressurising and releasing of the cooling gas' },
      usage: { zh: '可数；the improved compression cycle、the refrigeration cycle。', en: 'Countable: the improved compression cycle, the refrigeration cycle.' },
      example: { en: 'The compression cycle made artificial cold possible.', zh: '压缩循环使人工制冷成为可能。' },
    },
    {
      phrase: 'cold chain', sentenceIndex: 11,
      meaning: { zh: '冷链', en: 'the connected low-temperature route from farm to shop' },
      usage: { zh: '可数；the modern cold chain、break the cold chain。', en: 'Countable: the modern cold chain, break the cold chain.' },
      example: { en: 'The cold chain links farms to distant markets.', zh: '冷链把农场和远方市场连起来。' },
    },
    {
      phrase: 'perishable food', sentenceIndex: 20,
      meaning: { zh: '易腐食品', en: 'food that spoils quickly without cold storage' },
      usage: { zh: '不可数组合；keep perishable food cool。', en: 'Uncountable phrase: keep perishable food cool.' },
      example: { en: 'Traders used ice to keep perishable food fresh.', zh: '商贩用冰给易腐食品保鲜。' },
    },
    {
      phrase: 'chilled room', sentenceIndex: 43,
      meaning: { zh: '冷藏间', en: 'the cooled storage room in a warehouse' },
      usage: { zh: '可数；wait in a chilled room、a chilled room for produce。', en: 'Countable: wait in a chilled room, a chilled room for produce.' },
      example: { en: 'Produce waits in a chilled room before distribution.', zh: '农产品在分发前存放在冷藏间。' },
    },
    {
      phrase: 'along the route', sentenceIndex: 46,
      meaning: { zh: '沿途，运输路线上', en: 'at each point of the journey to market' },
      usage: { zh: '介词短语；temperature tracked along the route。', en: 'Prepositional phrase: temperature tracked along the route.' },
      example: { en: 'Sensors track temperature inside each container along the route.', zh: '传感器沿途监测每个容器内部温度。' },
    },
  ],
  tips: [
    {
      title: { zh: '讲座先听概述段再填细节', en: 'Take the overview before the details' },
      body: {
        zh: '本篇单选集中在讲座开头概述段，笔记题在后面的年代展开段。第 31–34 题在听到古代、十九世纪、战后、现代四个阶段标志词时就选；第 35–40 题等进入细节段再填，不要在概述段抢细节。',
        en: 'The singles sit in the opening overview, and the notes in the later historical detail. Choose items 31–34 at the stage markers, ancient, nineteenth century, post-war, modern, and fill items 35–40 only once the detail section begins.',
      },
    },
    {
      title: { zh: '年代顺序对齐笔记位置', en: 'Align notes to the timeline' },
      body: {
        zh: '笔记按年代排列：冬季采冰 → 砖草冰屋 → 氨制冷剂 → 铁路运肉 → 地面冰箱 → 超市货架。听讲座时把每个答案放回它所处的年代，避免把后期的家用冰柜答案填到早期冰屋空里。',
        en: 'The notes follow a timeline: winter ice, brick-and-straw house, ammonia, rail meat, floor ice box, supermarket shelf. Place each answer back in its period, so a later home-freezer answer does not fill an early ice-house gap.',
      },
    },
    {
      title: { zh: '听原理题抓被动与定义句', en: 'Catch passive and definition clauses' },
      body: {
        zh: '第 32 题问什么使机械制冷成为可能，答案在 What made ... possible was the improved compression cycle 这类定义句里。讲座原理题常以 What is/was the key ... 起句，听到 was、which、because 时记录后面的核心名词。',
        en: 'Item 32 asks what enabled mechanical refrigeration, in a What made ... possible was clause. Lecture principle questions often begin What is or was the key; record the core noun after was, which, or because.',
      },
    },
  ],
};
