import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 17 · Part 4 — 单人讲座：鸟类迁徙。原创仿真材料，非官方真题。
 *
 * 从跨洋小鸟的疑问切入，依次讲太阳与星辰罗盘、脂肪能量储备、
 * 停歇地在迁徙网络中的作用，以及气候变化对到达时间与路线的影响。
 */
export const test17Part4: ListeningLesson = {
  slug: 'test-17-part-4',
  part: 4,
  status: 'published',
  title: { zh: '鸟类迁徙', en: 'Bird migration' },
  summary: {
    zh: '讲座从一只跨洋鸣禽如何认路发问：白天靠太阳罗盘、夜间靠星辰，海岸线等地标校准方向；出发前大量进食皮下储存脂肪作为能量；停歇地供鸟休息、避天敌并补充燃料，是整条迁飞通道的关键节点；气候变暖使春季提前、到达时间前移、路线偏移，物候错位会影响育雏。',
    en: 'A warbler crosses the sea by a sun compass by day, stars by night and landmarks; before departure it stores subcutaneous fat as fuel; stopover sites rest, shelter and refuel birds, and are key flyway links; warmer springs advance arrival, shift routes and can mismatch breeding with insect peaks.',
  },
  accent: { zh: '讲者为美式口音。', en: 'The lecturer speaks with an American accent.' },
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
          stem: 'How do migrating birds chiefly find their direction?',
          options: [
            { key: 'A', text: 'They follow human-made maps along the coastlines' },
            { key: 'B', text: 'The sun compass, star cues and landscape landmarks' },
            { key: 'C', text: 'They copy the route of the older birds in the flock' },
          ],
        },
        {
          number: 32,
          stem: 'What do birds build up before departure?',
          options: [
            { key: 'A', text: 'Fat reserves to use as flight energy' },
            { key: 'B', text: 'A second set of feathers for the open sea' },
            { key: 'C', text: 'Stored water for the longest crossings' },
          ],
        },
        {
          number: 33,
          stem: 'Why are stopover sites protected?',
          options: [
            { key: 'A', text: 'They hold the only breeding grounds for the species' },
            { key: 'B', text: 'They provide nesting material for winter flocks' },
            { key: 'C', text: 'They let birds rest and refuel between flight legs' },
          ],
        },
        {
          number: 34,
          stem: 'How has climate change affected migration patterns?',
          options: [
            { key: 'A', text: 'Many birds arrive earlier, and routes are shifting' },
            { key: 'B', text: 'All migrants now fly shorter distances' },
            { key: 'C', text: 'Arrival dates have stayed fixed for sixty years' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Sun compass reads polarised', cells: [[{ blank: 35 }]] },
        { lead: 'Energy stored as', cells: [[{ blank: 36 }, { text: ' under the skin' }]] },
        { lead: 'Stopover needs food and safe', cells: [[{ blank: 37 }, { text: ' from predators' }]] },
        { lead: '___ wetlands link summer and winter grounds', cells: [[{ blank: 38 }]] },
        { lead: 'Warmer springs advance insect', cells: [[{ blank: 39 }]] },
        { lead: 'Young birds follow an innate, generations-shaped', cells: [[{ blank: 40 }, { text: ' route' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：Landmarks such as coastlines, rivers and mountain ridges confirm the chosen heading。导航由太阳罗盘、星辰与地标共同完成；人造地图和成鸟带领都不是机制本身。',
        en: 'Sentence 4: "Landmarks such as coastlines, rivers and mountain ridges confirm the chosen heading". Navigation combines the sun compass, stars and landmarks; neither human maps nor adult leaders are the mechanism.',
      },
    },
    {
      number: 32, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：they feed heavily and store fat under the skin, which acts as the main energy reserve。出发前积累的是脂肪储备；换羽和储水在原文中没有依据。',
        en: 'Sentence 6: "they feed heavily and store fat under the skin, which acts as the main energy reserve". The pre-departure build-up is fat reserves; extra feathers and stored water are not mentioned.',
      },
    },
    {
      number: 33, accepted: ['C'], evidence: 9,
      explanation: {
        zh: '定位句 9：few migrants could complete two long flights without an intermediate rest。停歇地用于两段航程之间休息补能；繁殖地和筑巢材料不是停歇地的作用。',
        en: 'Sentence 9: "few migrants could complete two long flights without an intermediate rest". Stopover sites rest and refuel between legs; breeding grounds and nesting material are not their role here.',
      },
    },
    {
      number: 34, accepted: ['A'], evidence: 11,
      explanation: {
        zh: '定位句 11：Spring warmth arrives earlier, and many birds reach their breeding grounds ahead of the old timetable。变暖使到达提前、路线改变；所有鸟都缩短距离、六十年日期不变都与原文相反。',
        en: 'Sentence 11: "Spring warmth arrives earlier, and many birds reach their breeding grounds ahead of the old timetable". Warming brings earlier arrival and shifting routes; all migrants shortening flights and fixed sixty-year dates contradict the recording.',
      },
    },
    {
      number: 35, accepted: ['light'], evidence: 14,
      explanation: {
        zh: '定位句 14：the bird senses the polarised light around the sun。太阳罗盘读取太阳周围的偏振光；空格里填 light。',
        en: 'Sentence 14: "the bird senses the polarised light around the sun". The compass reads polarised light around the sun, so the gap takes light.',
      },
    },
    {
      number: 36, accepted: ['fat'], evidence: 16,
      explanation: {
        zh: '定位句 16：Fat reserves burn steadily over the flight, and the bird loses weight each day it stays aloft。飞行中消耗皮下脂肪；空格里填 fat。',
        en: 'Sentence 16: "Fat reserves burn steadily over the flight, and the bird loses weight each day it stays aloft". The stored energy is fat, so the answer is fat.',
      },
    },
    {
      number: 37, accepted: ['rest'], evidence: 17,
      explanation: {
        zh: '定位句 17：At a stopover, the main needs are food to rebuild reserves and a safe rest from predators。停歇地提供食物与躲避天敌的安全休息；空格里填 rest。',
        en: 'Sentence 17: "At a stopover, the main needs are food to rebuild reserves and a safe rest from predators". The site offers food and safe rest from predators, so the gap takes rest.',
      },
    },
    {
      number: 38, accepted: ['Coastal'], evidence: 18,
      explanation: {
        zh: '定位句 18：Coastal wetlands sit between summer and winter grounds, so they carry an outsized role in the network。连接繁殖地与越冬地的是沿海湿地；空格里填 Coastal。',
        en: 'Sentence 18: "Coastal wetlands sit between summer and winter grounds, so they carry an outsized role in the network". The wetlands linking the two grounds are coastal, so the answer is Coastal.',
      },
    },
    {
      number: 39, accepted: ['hatching'], evidence: 19,
      explanation: {
        zh: '定位句 19：Warmer springs have advanced the hatching of insects, which sets the breeding timetable under pressure。暖春使昆虫孵化提前；空格里填 hatching。',
        en: 'Sentence 19: "Warmer springs have advanced the hatching of insects, which sets the breeding timetable under pressure". Warmer springs advance insect hatching, so the gap takes hatching.',
      },
    },
    {
      number: 40, accepted: ['generations'], evidence: 20,
      explanation: {
        zh: '定位句 20：The route passed down to young birds is partly innate, shaped by generations that survived the journey。幼鸟路线由世代积累塑造；空格里填 generations。',
        en: 'Sentence 20: "The route passed down to young birds is partly innate, shaped by generations that survived the journey". The young route is shaped by generations, so the answer is generations.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'How does a small warbler cross two thousand kilometres of open sea without a map? The answer lies in a set of navigational instincts built up over millions of years.' },
    { speaker: 'lecturer', text: 'In this lecture we will look at how birds find their way, what fuel they carry, where they rest, and how the changing climate is reshaping the journey.' },
    { speaker: 'lecturer', text: 'The best-known guide is the sun compass. During the day, the bird reads the sun’s position and adjusts for its movement across the sky.' },
    { speaker: 'lecturer', text: 'At night, many songbirds switch to the stars, reading the rotating pattern around the pole.' },
    { speaker: 'lecturer', text: 'Landmarks such as coastlines, rivers and mountain ridges confirm the chosen heading once the bird is close to home.' },
    { speaker: 'lecturer', text: 'A second part of the journey is fuel. Long migrants cannot eat steadily along the whole route, so they prepare in advance.' },
    { speaker: 'lecturer', text: 'In the weeks before departure, they feed heavily and store fat under the skin, which acts as the main energy reserve.' },
    { speaker: 'lecturer', text: 'This fat can make up a quarter of the bird’s weight before a long crossing.' },
    { speaker: 'lecturer', text: 'Where the fuel runs low, the bird needs a stopover site, a patch where it can rest and feed before the next leg.' },
    { speaker: 'lecturer', text: 'These sites are protected because few migrants could complete two long flights without an intermediate rest.' },
    { speaker: 'lecturer', text: 'Wetlands, estuaries and farmland hedges all offer seeds, insects and shelter in turn.' },
    { speaker: 'lecturer', text: 'Climate change has begun to shift the migration pattern. Spring warmth arrives earlier, and many birds reach their breeding grounds ahead of the old timetable.' },
    { speaker: 'lecturer', text: 'Some species have shortened the distance flown, while others have expanded their winter range further north.' },
    { speaker: 'lecturer', text: 'When the plants and insects they depend on peak at a different time, the bird may arrive too late to feed its young.' },
    { speaker: 'lecturer', text: 'The sun compass works even when clouds cover part of the sky, because the bird senses the polarised light around the sun.' },
    { speaker: 'lecturer', text: 'Star cues are learned early, as young birds watch the rotating sky and fix on the stable point near the pole.' },
    { speaker: 'lecturer', text: 'Fat reserves burn steadily over the flight, and the bird loses weight each day it stays aloft.' },
    { speaker: 'lecturer', text: 'At a stopover, the main needs are food to rebuild reserves and a safe rest from predators.' },
    { speaker: 'lecturer', text: 'Coastal wetlands sit between summer and winter grounds, so they carry an outsized role in the network.' },
    { speaker: 'lecturer', text: 'Warmer springs have advanced the hatching of insects, which sets the breeding timetable under pressure.' },
    { speaker: 'lecturer', text: 'The route passed down to young birds is partly innate, shaped by generations that survived the journey.' },
    { speaker: 'lecturer', text: 'Conservation plans now link wetland sites along the whole flyway, rather than protecting one reserve in isolation.' },
    { speaker: 'lecturer', text: 'Where a wetland is drained, the migrants that depended on it must crowd into the remaining patches.' },
    { speaker: 'lecturer', text: 'Wind conditions over the sea also decide how far a bird can cross before it must turn back.' },
    { speaker: 'lecturer', text: 'Some coastal species have reduced the open-sea leg as the land provides more food year-round.' },
    { speaker: 'lecturer', text: 'Ringing records show changes in arrival dates over the last sixty years, matching the rise in average temperature.' },
    { speaker: 'lecturer', text: 'A migrant carries no extra luggage, and every gram of weight counts over a long flight.' },
    { speaker: 'lecturer', text: 'Birds that stop too long at one site risk missing the best feeding window further north.' },
    { speaker: 'lecturer', text: 'Those that arrive too early may find frozen ground and no insects to feed chicks.' },
    { speaker: 'lecturer', text: 'The balance between early and late arrival decides how many young survive the season.' },
    { speaker: 'lecturer', text: 'Radar studies over the sea show flocks climbing to gain height before the longest crossing.' },
    { speaker: 'lecturer', text: 'Smaller warblers often travel at night, when the air is cool and predators are fewer.' },
    { speaker: 'lecturer', text: 'Geese and cranes fly by day, in visible lines that make their routes easier to chart.' },
    { speaker: 'lecturer', text: 'Each flyway follows a chain of sites repeated year after year by the same species.' },
    { speaker: 'lecturer', text: 'Destroying one link in that chain can break the whole route for the birds that use it.' },
    { speaker: 'lecturer', text: 'Volunteers now count migrants at headlands and islands during the autumn passage.' },
    { speaker: 'lecturer', text: 'Their counts help planners decide which wetlands deserve formal protection.' },
    { speaker: 'lecturer', text: 'A young bird on its first journey has no adult flock to follow, so the innate route matters most.' },
    { speaker: 'lecturer', text: 'Experience later refines the choice of sites, but the broad direction is set before it leaves the nest.' },
    { speaker: 'lecturer', text: 'Magnetite in the bird’s bill may add a faint sense of the Earth’s magnetic field.' },
    { speaker: 'lecturer', text: 'This magnetic sense works alongside the sun and stars rather than replacing them.' },
    { speaker: 'lecturer', text: 'Laboratory tests have displaced birds across continents, and they re-orient toward home.' },
    { speaker: 'lecturer', text: 'Such experiments show that the compass is only one part of a wider map sense.' },
    { speaker: 'lecturer', text: 'River valleys act as funnels, concentrating flocks along the lowest passes.' },
    { speaker: 'lecturer', text: 'Island chains offer short hops across water between one resting place and the next.' },
    { speaker: 'lecturer', text: 'Drought on one side of the route pushes birds toward wetter refuges further east.' },
    { speaker: 'lecturer', text: 'Changes in land use near breeding grounds cut the food available for the final stage.' },
    { speaker: 'lecturer', text: 'Long-term surveys suggest some routes now host half the numbers recorded forty years ago.' },
    { speaker: 'lecturer', text: 'Protecting the full chain matters more than guarding a single spectacular reserve.' },
    { speaker: 'lecturer', text: 'In the discussion we can compare the sea crossing of two species with different wing shape.' },
  ],
  vocabulary: [
    {
      term: 'compass', phonetic: '/ˈkʌmpəs/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '罗盘，定向机制', en: 'the internal guide that lets a bird hold a heading' },
      usage: { zh: 'sun compass、star compass；另义普通指南针。', en: 'Sun compass, star compass; it also means a handheld magnetic needle.' },
      collocations: ['the sun compass', 'the star compass', 'read the compass'],
      example: { en: 'The sun compass lets the bird hold a heading through the day.', zh: '太阳罗盘让鸟在白天保持方向。' },
      listening: { zh: '双音节，重音在首音节 /ˈkʌm/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'migration', phonetic: '/maɪˈɡreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '迁徙，定期南北往返飞行', en: 'the regular seasonal journey between breeding and winter grounds' },
      usage: { zh: 'bird migration、migration pattern；动词 migrate。', en: 'Bird migration, migration pattern; the verb is migrate.' },
      collocations: ['bird migration', 'the migration pattern', 'the migration route'],
      example: { en: 'Climate change has begun to shift the migration pattern.', zh: '气候变化已开始改变迁徙模式。' },
      listening: { zh: '三音节，重音在第二音节 /ˈɡreɪ/。', en: 'Three syllables with stress on /ˈɡreɪ/.' },
    },
    {
      term: 'reserve', phonetic: '/rɪˈzɜːv/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '储备（能量）', en: 'the stored body material used later as fuel' },
      usage: { zh: 'fat reserve、energy reserve；作动词表保留，重音仍在后。', en: 'Fat reserve, energy reserve; as a verb it keeps later stress.' },
      collocations: ['fat reserves', 'energy reserve', 'rebuild reserves'],
      example: { en: 'The fat under the skin acts as the main energy reserve.', zh: '皮下脂肪是主要能量储备。' },
      listening: { zh: '双音节，重音在第二音节 /ˈzɜː/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'stopover', phonetic: '/ˈstɒpəʊvə/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '停歇地，中途休息点', en: 'a site where migrants rest and refuel between flight legs' },
      usage: { zh: 'stopover site、at a stopover；动词短语 stop over。', en: 'Stopover site, at a stopover; the phrasal verb is stop over.' },
      collocations: ['a stopover site', 'the stopover network', 'rest at a stopover'],
      example: { en: 'The stopover patch lets birds rest and feed before the next leg.', zh: '停歇地供鸟在下一段航程前休息进食。' },
      listening: { zh: '双音节，两部分都重读，/əʊ/ 长音。', en: 'Two syllables, both stressed, with a long /əʊ/.' },
    },
    {
      term: 'wetlands', phonetic: '/ˈwetləndz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '湿地', en: 'the waterlogged habitat that supplies food and shelter to migrants' },
      usage: { zh: 'coastal wetland、wetland site；常用复数。', en: 'Coastal wetland, wetland site; usually plural.' },
      collocations: ['coastal wetlands', 'protect the wetland', 'wetland chain'],
      example: { en: 'Wetlands and estuaries offer seeds, insects and shelter.', zh: '湿地与河口提供种子、昆虫和遮蔽。' },
      listening: { zh: '双音节，重音在首音节 /ˈwet/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'flyway', phonetic: '/ˈflaɪweɪ/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '迁飞通道，候鸟南北路线', en: 'the whole chain of sites used along one migration route' },
      usage: { zh: 'ecology 术语；along the flyway。', en: 'An ecology term; along the flyway.' },
      collocations: ['the whole flyway', 'along the flyway', 'one flyway'],
      example: { en: 'Conservation links wetland sites along the whole flyway.', zh: '保护工作把整条迁飞通道上的湿地连起来。' },
      listening: { zh: '复合词，两部分重读，双元音 /aɪ/。', en: 'A compound with both parts stressed and /aɪ/.' },
    },
    {
      term: 'innate', phonetic: '/ɪˈneɪt/', partOfSpeech: 'adj.', sentenceIndex: 20,
      meaning: { zh: '先天的，本能的', en: 'built into the bird rather than learned from experience' },
      usage: { zh: 'innate route、innate behaviour；反义 learned。', en: 'Innate route, innate behaviour; the opposite is learned.' },
      collocations: ['an innate route', 'innate behaviour', 'innate sense'],
      example: { en: 'The young bird follows an innate route on its first journey.', zh: '幼鸟初次出行遵循先天路线。' },
      listening: { zh: '双音节，重音在第二音节 /ˈneɪ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'magnetite', phonetic: '/ˈmæɡnətaɪt/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '磁铁矿（喙内的磁性颗粒）', en: 'the magnetic mineral thought to help sense the Earth’s field' },
      usage: { zh: '鸟类生理术语；magnet- 词根表磁性。', en: 'A bird-physiology term; the magnet- root means magnetic.' },
      collocations: ['magnetite in the bill', 'magnetic mineral', 'the magnetite grain'],
      example: { en: 'Magnetite in the bill may sense the Earth’s magnetic field.', zh: '喙内磁铁矿或可感知地磁场。' },
      listening: { zh: '三音节，重音在首音节 /ˈmæɡ/。', en: 'Three syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'feed heavily', sentenceIndex: 6,
      meaning: { zh: '大量进食（储备能量）', en: 'to eat a lot in the weeks before departure' },
      usage: { zh: '后接时段；heavy 在此是大量的。', en: 'Follow with the period; heavy means substantial here.' },
      example: { en: 'Before departure the birds feed heavily and store fat.', zh: '出发前鸟大量进食并储存脂肪。' },
    },
    {
      phrase: 'runs low', sentenceIndex: 8,
      meaning: { zh: '即将耗尽', en: 'to have little fuel left before the next site' },
      usage: { zh: 'fuel runs low；反义 keep full。', en: 'Fuel runs low; the opposite is keep full.' },
      example: { en: 'When fuel runs low, the bird needs a stopover site.', zh: '燃料将尽时鸟需要停歇地。' },
    },
    {
      phrase: 'sit between', sentenceIndex: 18,
      meaning: { zh: '位于……之间', en: 'to lie in the middle of two distant grounds' },
      usage: { zh: '地理语境；sit 在此是处于。', en: 'Geography usage; sit means occupy a place here.' },
      example: { en: 'Coastal wetlands sit between summer and winter grounds.', zh: '沿海湿地位于繁殖地与越冬地之间。' },
    },
    {
      phrase: 'crowd into', sentenceIndex: 22,
      meaning: { zh: '挤入（剩余栖息地）', en: 'to concentrate into fewer patches than before' },
      usage: { zh: '后接地点；crowd 作动词。', en: 'Follow with a place; crowd is the verb here.' },
      example: { en: 'Migrants crowd into the remaining wetland patches.', zh: '候鸟挤入剩余的湿地区块。' },
    },
    {
      phrase: 'turn back', sentenceIndex: 23,
      meaning: { zh: '折返，掉头', en: 'to stop the crossing and head toward land' },
      usage: { zh: 'flight 语境；turn back from 后接地点。', en: 'Flight usage; turn back from follows the place.' },
      example: { en: 'The wind decides how far the bird can cross before it turns back.', zh: '风向决定鸟能飞多远才折返。' },
    },
    {
      phrase: 'break the whole route', sentenceIndex: 34,
      meaning: { zh: '打断整条迁徙路线', en: 'to destroy a link that the whole path depends on' },
      usage: { zh: 'conservation 语境；break a chain 同构。', en: 'Conservation usage; break a chain works the same way.' },
      example: { en: 'Losing one site can break the whole route.', zh: '失去一个地点就可能打断整条路线。' },
    },
  ],
  tips: [
    {
      title: { zh: '导航机制按白天/夜间分层记', en: 'Layer navigation by day and night' },
      body: {
        zh: '第 31 题考定向机制，句 2 到句 4 依次给太阳罗盘、星辰、地标。听时按 daytime / night-time / landmarks 三栏记，干扰项常把人造地图或成鸟跟随塞进题干，机制本身不依赖这些。',
        en: 'Item 31 tests the navigational mechanism, and sentences 2 to 4 give the sun compass, stars and landmarks in order. Note them in daytime, night-time and landmarks columns; distractors insert human maps or adult leaders, which the mechanism does not rely on.',
      },
    },
    {
      title: { zh: '能量题区分储备与消耗', en: 'Separate stored fuel from fuel burned' },
      body: {
        zh: '第 32 题问出发前积累什么，句 6 给皮下脂肪储备；句 16 讲飞行中脂肪燃烧掉秤。选择题选项可能把换羽、储水混入，听到 feed heavily、store fat 锁定储备项，burn steadily 是消耗阶段。',
        en: 'Item 32 asks the pre-departure build-up, and sentence 6 gives subcutaneous fat; sentence 16 describes fat burning aloft. Options may mix extra feathers or stored water; lock the reserve when you hear feed heavily and store fat, and treat burn steadily as the consumption stage.',
      },
    },
    {
      title: { zh: '气候影响抓时间与路线两类变化', en: 'Climate items track timing and route shifts' },
      body: {
        zh: '第 34 题问气候变化影响，句 11 是到达提前，句 12 是距离与越冬范围改变，句 13 是物候错位。选项常说 all birds、fixed dates 这类全称或相反说法，录音用 many、some 留有余地，听到绝对化表述先排除。',
        en: 'Item 34 asks the climate effect: sentence 11 earlier arrival, sentence 12 distance and winter-range shifts, sentence 13 phenology mismatch. Options often use all birds or fixed dates as absolutes; the recording says many and some, so rule out over-general statements first.',
      },
    },
  ],
};
