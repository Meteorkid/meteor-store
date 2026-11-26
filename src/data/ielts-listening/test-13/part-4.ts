import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 13 · Part 4 — 单人讲座：茶的历史。原创仿真材料，非官方真题。
 *
 * 从野生茶树起源讲起，经早期药用、僧侣与贸易传播、英国社会普及、
 * 印度与日本分支，再到茶包起源、现代产区与加工差异。
 */
export const test13Part4: ListeningLesson = {
  slug: 'test-13-part-4',
  part: 4,
  status: 'published',
  title: { zh: '茶的历史', en: 'The history of tea' },
  summary: {
    zh: '讲座从一片叶子的传播现象切入：茶树最早生于中国西南，起初作药用；僧侣与贸易把茶带出中国，十七世纪传入欧洲，在英国加糖后进入中产家庭；印度分阿萨姆与大吉岭两大产区，日本茶道脱胎于寺院习俗；二十世纪初茶包由丝绸小袋的偶然用法兴起，现代茶味由土壤、降水与加工决定，红茶全发酵，而泡茶共饮的核心方式延续至今。',
    en: 'Tea first grew in China as medicine; monks and trade carried it abroad, reached Europe in the seventeenth century, and sweetened tea entered British middle-class homes. India has Assam and Darjeeling, Japanese ceremony grew from monastery practice, tea bags arose by accident, taste depends on soil, rainfall and processing, black tea is fully oxidised, steeping and sharing a leaf lasts.',
  },
  accent: { zh: '讲者为英式口音。', en: 'The lecturer uses a British accent.' },
  speechRate: '+0%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Tea plant first grew in south-west', cells: [[{ blank: 31 }]] },
        { lead: 'Early tea was taken as a', cells: [[{ blank: 32 }, { text: ' preparation' }]] },
        { lead: 'In Britain tea entered the', cells: [[{ blank: 33 }, { text: ' class home' }]] },
        { lead: 'Indian regions: Assam and', cells: [[{ blank: 34 }]] },
        { lead: 'Japanese ceremony grew from Chinese', cells: [[{ blank: 35 }, { text: ' practice' }]] },
        { lead: 'Tea bags appeared in the early', cells: [[{ blank: 36 }, { text: ' century' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'What led to the tea bag becoming popular?',
          options: [
            { key: 'A', text: 'Factory machines sealed the pouches automatically' },
            { key: 'B', text: 'Customers dipped the silk pouch by accident and liked the result' },
            { key: 'C', text: 'Restaurants ordered bags to save cleaning cups' },
          ],
        },
        {
          number: 38,
          stem: 'How is black tea processed?',
          options: [
            { key: 'A', text: 'It is dried without oxidation' },
            { key: 'B', text: 'It is fully oxidised before drying' },
            { key: 'C', text: 'It is steamed and rolled fresh' },
          ],
        },
        {
          number: 39,
          stem: 'What shapes the taste of a regional tea?',
          options: [
            { key: 'A', text: 'The price paid at auction' },
            { key: 'B', text: 'The colour of the tea cup' },
            { key: 'C', text: 'Soil, rainfall and leaf processing' },
          ],
        },
        {
          number: 40,
          stem: 'What does the lecturer say has stayed the same?',
          options: [
            { key: 'A', text: 'The way leaves are processed' },
            { key: 'B', text: 'The core act of steeping a leaf in hot water and sharing it' },
            { key: 'C', text: 'The customs around serving tea' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['China'], evidence: 2,
      explanation: {
        zh: '定位句 2：The wild tea plant first grew in the mountain forests of south-west China。原产地为中国西南；空格里填 China。',
        en: 'Sentence 2: "The wild tea plant first grew in the mountain forests of south-west China". The homeland is south-west China, so the gap takes China.',
      },
    },
    {
      number: 32, accepted: ['medicinal'], evidence: 4,
      explanation: {
        zh: '定位句 4：but a medicinal preparation taken in small amounts。早期茶是药用制剂；空格里填 medicinal，不要填 preparation，它已印在题面。',
        en: 'Sentence 4: "but a medicinal preparation taken in small amounts". Early tea was a medicinal preparation; the gap takes medicinal, since preparation already appears in the note.',
      },
    },
    {
      number: 33, accepted: ['middle'], evidence: 11,
      explanation: {
        zh: '定位句 11：tea entered the middle class home by the eighteenth century。进入的是中产家庭；早期富裕家庭只是过渡阶段，不是答案。',
        en: 'Sentence 11: "tea entered the middle class home by the eighteenth century". It entered middle-class homes; the earlier wealthy households are a transitional stage, not the answer.',
      },
    },
    {
      number: 34, accepted: ['Darjeeling'], evidence: 15,
      explanation: {
        zh: '定位句 15：The two best-known Indian regions are Assam in the east and Darjeeling in the foothills of the Himalayas。第二个产区是大吉岭；注意拼写连写。',
        en: 'Sentence 15: "The two best-known Indian regions are Assam in the east and Darjeeling in the foothills of the Himalayas". The second region is Darjeeling, spelled as one word.',
      },
    },
    {
      number: 35, accepted: ['monastery'], evidence: 18,
      explanation: {
        zh: '定位句 18：The Japanese tea ceremony grew out of Chinese monastery practice。茶道源自中国寺院习俗；空格里填 monastery。',
        en: 'Sentence 18: "The Japanese tea ceremony grew out of Chinese monastery practice". The ceremony derives from monastery practice, so the answer is monastery.',
      },
    },
    {
      number: 36, accepted: ['twentieth', '20th'], evidence: 21,
      explanation: {
        zh: '定位句 21：An American merchant sent samples of tea in small silk pouches early in the twentieth century。茶包出现于二十世纪初；空格里填序数词 twentieth。',
        en: 'Sentence 21: "An American merchant sent samples of tea in small silk pouches early in the twentieth century". Tea bags appeared in the early twentieth century, so the gap takes twentieth.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：Customers dipped the whole pouch in hot water by accident, and the bag idea took off from there。茶包流行源于顾客偶然浸泡丝袋后喜欢上这种用法；机器封袋和餐厅省洗杯都未提及。',
        en: 'Sentence 22: "Customers dipped the whole pouch in hot water by accident, and the bag idea took off from there". The bag spread after customers accidentally dipped the pouch and liked it. Machine sealing and restaurant cup-saving are not mentioned.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：black tea is fully oxidised before drying。红茶干燥前完全氧化；不氧化是绿茶特征，蒸青是另一种工艺。',
        en: 'Sentence 26: "black tea is fully oxidised before drying". Black tea is fully oxidised before drying; no oxidation describes green tea, and steaming and rolling refer to another process.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：Each region develops its own taste, shaped by soil, rainfall and the way the leaves are processed。地域口味由土壤、降水和加工方式决定；拍卖价与杯色无关。',
        en: 'Sentence 25: "Each region develops its own taste, shaped by soil, rainfall and the way the leaves are processed". Regional taste depends on soil, rainfall and processing; auction price and cup colour are irrelevant.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：the core act stays the same, a leaf steeped in hot water and shared between people。不变的核心是泡一片叶子与人共饮；加工方式与待客礼仪随时代改变。',
        en: 'Sentence 29: "the core act stays the same, a leaf steeped in hot water and shared between people". What endures is steeping and sharing a leaf; processing and serving customs change over time.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'A single leaf, dried and steeped in hot water, now reaches more people each day than coffee in many parts of the world.' },
    { speaker: 'lecturer', text: 'That leaf is tea, and its history stretches back thousands of years before it appeared on any European table.' },
    { speaker: 'lecturer', text: 'The wild tea plant first grew in the mountain forests of south-west China, where leaves were picked long before written records.' },
    { speaker: 'lecturer', text: 'Early records describe tea as a bitter herb used to settle the stomach and clear the head.' },
    { speaker: 'lecturer', text: 'At first it was not the social drink we know today, but a medicinal preparation taken in small amounts.' },
    { speaker: 'lecturer', text: 'Buddhist monks carried tea around the temples, because staying awake during long meditation mattered more than flavour.' },
    { speaker: 'lecturer', text: 'From those temple gardens, cultivation spread to the river valleys of southern China.' },
    { speaker: 'lecturer', text: 'Chinese traders exchanged tea for horses, silk and salt with the peoples beyond the northern passes.' },
    { speaker: 'lecturer', text: 'Over centuries, tea travelled west along the overland trade routes and later by sea to ports in the Middle East.' },
    { speaker: 'lecturer', text: 'It reached Europe only in the seventeenth century, brought by merchants who had seen its value in Asian markets.' },
    { speaker: 'lecturer', text: 'In Britain, tea at first remained a luxury for wealthy households, served in small porcelain cups.' },
    { speaker: 'lecturer', text: 'As trade volumes grew, prices fell, and tea entered the middle class home by the eighteenth century.' },
    { speaker: 'lecturer', text: 'The habit of adding sugar to tea changed its taste from bitter to sweet, and helped it spread through working families.' },
    { speaker: 'lecturer', text: 'Tea gardens and public tea rooms made the drink part of daily social life, rather than a rare import.' },
    { speaker: 'lecturer', text: 'British planters later moved tea cultivation to India, where the climate suited the bush.' },
    { speaker: 'lecturer', text: 'The two best-known Indian regions are Assam in the east and Darjeeling in the foothills of the Himalayas.' },
    { speaker: 'lecturer', text: 'Assam tea gives a strong dark brew, while Darjeeling leaves produce a lighter, flowery cup.' },
    { speaker: 'lecturer', text: 'Tea also travelled east from China to Japan, where monks adapted the drinking habit into a formal ceremony.' },
    { speaker: 'lecturer', text: 'The Japanese tea ceremony grew out of Chinese monastery practice, and focuses on quiet preparation and respect.' },
    { speaker: 'lecturer', text: 'In Japan, tea was no longer just a drink, but part of etiquette and household ritual.' },
    { speaker: 'lecturer', text: 'The tea bag, now common in offices, has a surprising origin.' },
    { speaker: 'lecturer', text: 'An American merchant sent samples of tea in small silk pouches early in the twentieth century.' },
    { speaker: 'lecturer', text: 'Customers dipped the whole pouch in hot water by accident, and the bag idea took off from there.' },
    { speaker: 'lecturer', text: 'What began as packaging became one of the most convenient forms of tea in the modern home.' },
    { speaker: 'lecturer', text: 'Today tea grows in dozens of countries, from Kenya and Sri Lanka to Turkey and Argentina.' },
    { speaker: 'lecturer', text: 'Each region develops its own taste, shaped by soil, rainfall and the way the leaves are processed.' },
    { speaker: 'lecturer', text: 'Green tea keeps the original leaf colour, while black tea is fully oxidised before drying.' },
    { speaker: 'lecturer', text: 'Oolong sits between the two, with a shorter oxidation time and a fruity aroma.' },
    { speaker: 'lecturer', text: 'Modern tea culture mixes old customs with new habits, such as bottled iced tea and milk tea drinks.' },
    { speaker: 'lecturer', text: 'Despite these changes, the core act stays the same, a leaf steeped in hot water and shared between people.' },
    { speaker: 'lecturer', text: 'Let me add a few details about the early Chinese period, so the timeline is clear.' },
    { speaker: 'lecturer', text: 'The earliest written mentions appear around the second century before the present era, though wild use must be older.' },
    { speaker: 'lecturer', text: 'Leaves were first boiled directly, with herbs added to soften the bitterness.' },
    { speaker: 'lecturer', text: 'The method of steaming and pressing leaves into cakes came much later, and made transport easier.' },
    { speaker: 'lecturer', text: 'Tea drinking moved from the temple to the scholars’ study, where it marked refined taste.' },
    { speaker: 'lecturer', text: 'During the eighth century, a written guide to tea described the bush, the water and the correct utensils.' },
    { speaker: 'lecturer', text: 'That guide helped standardise a habit that had varied from valley to valley.' },
    { speaker: 'lecturer', text: 'Along the trade routes, travellers carried both the leaf and the stories attached to it.' },
    { speaker: 'lecturer', text: 'Some nomadic peoples mixed tea with milk and butter, which gave them calories in cold winters.' },
    { speaker: 'lecturer', text: 'This tradition still survives in parts of the Himalayan region today.' },
    { speaker: 'lecturer', text: 'In colonial India, British gardens were laid out on hillsides that could drain heavy rain.' },
    { speaker: 'lecturer', text: 'Cooler air at altitude slows growth, and the leaves build a more delicate flavour.' },
    { speaker: 'lecturer', text: 'Ceylon, now called Sri Lanka, developed its own bold black teas on the central highlands.' },
    { speaker: 'lecturer', text: 'African tea, mainly from Kenya, tends to be bright and strong, suited to mixing with milk.' },
    { speaker: 'lecturer', text: 'Processing turns the same fresh leaf into very different drinks.' },
    { speaker: 'lecturer', text: 'Withering softens the leaf, rolling breaks its cells, and heating stops the oxidation.' },
    { speaker: 'lecturer', text: 'The final roast or drying step fixes the colour and the shelf life of the leaves.' },
    { speaker: 'lecturer', text: 'Specialty blenders combine leaves from several regions to produce a consistent house taste.' },
    { speaker: 'lecturer', text: 'Some modern brands market single-region tea, so drinkers can trace the garden on the packet.' },
    { speaker: 'lecturer', text: 'Whether the leaf is loose, bagged or bottled, the preparation still rests on hot water and patience.' },
  ],
  vocabulary: [
    {
      term: 'medicinal', phonetic: '/məˈdɪsɪnl/', partOfSpeech: 'adj.', sentenceIndex: 4,
      meaning: { zh: '药用的，有医疗用途的', en: 'used as a medicine or health preparation' },
      usage: { zh: 'medicinal preparation、medicinal herb；名词 medicine。', en: 'Medicinal preparation, medicinal herb; the noun is medicine.' },
      collocations: ['medicinal use', 'medicinal preparation', 'medicinal herbs'],
      example: { en: 'Early tea was a medicinal preparation taken in small amounts.', zh: '早期茶是少量服用的药用制剂。' },
      listening: { zh: '四音节，重音在第二音节 /ˈdɪ/，-al 弱读。', en: 'Four syllables with stress on /ˈdɪ/; -al reduces.' },
    },
    {
      term: 'cultivation', phonetic: '/ˌkʌltɪˈveɪʃn/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '种植，栽培', en: 'growing crops or plants on purpose' },
      usage: { zh: 'tea cultivation、spread to cultivation；动词 cultivate。', en: 'Tea cultivation; the verb is cultivate.' },
      collocations: ['tea cultivation', 'crop cultivation', 'the spread of cultivation'],
      example: { en: 'Cultivation spread from temple gardens to southern valleys.', zh: '种植从寺院园林扩展到南部河谷。' },
      listening: { zh: '四音节，重音在第三音节 /ˈveɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'merchants', phonetic: '/ˈmɜːtʃənts/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '商人（长途贸易）', en: 'a person who trades goods over long distances' },
      usage: { zh: '历史贸易语境；merchant 与 shopkeeper 规模不同。', en: 'Historical trade usage; a merchant trades broadly, unlike a local shopkeeper.' },
      collocations: ['an American merchant', 'a wealthy merchant', 'trade merchants'],
      example: { en: 'Merchants brought tea back to European markets.', zh: '商人把茶带回欧洲市场。' },
      listening: { zh: '双音节，英式首音节 /ˈmɜː/ 不卷舌。', en: 'Two syllables; British first syllable /ˈmɜː/ is non-rhotic.' },
    },
    {
      term: 'luxury', phonetic: '/ˈlʌkʃəri/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '奢侈品，昂贵享受', en: 'something expensive and rare that ordinary households cannot afford' },
      usage: { zh: 'a luxury、luxury good；形容词 luxurious。', en: 'A luxury, luxury good; the adjective is luxurious.' },
      collocations: ['a luxury import', 'a luxury for households', 'remain a luxury'],
      example: { en: 'Tea remained a luxury for wealthy households at first.', zh: '起初茶只是富裕家庭的奢侈品。' },
      listening: { zh: '三音节，重音在首音节 /ˈlʌ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'oxidation', phonetic: '/ˌɒksɪˈdeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '氧化（茶叶加工工序）', en: 'the chemical reaction that darkens the leaf before drying' },
      usage: { zh: 'tea processing 高频词；动词 oxidise，形容词 oxidised。', en: 'Common in tea processing; the verb is oxidise, the adjective oxidised.' },
      collocations: ['full oxidation', 'the oxidation time', 'stop oxidation'],
      example: { en: 'Black tea is fully oxidised before it is dried.', zh: '红茶干燥前经过完全氧化。' },
      listening: { zh: '四音节，重音在第三音节 /ˈdeɪ/。', en: 'Four syllables with stress on /ˈdeɪ/.' },
    },
    {
      term: 'aroma', phonetic: '/əˈrəʊmə/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '香气，香味', en: 'the pleasant smell of a brewed tea' },
      usage: { zh: 'a fruity aroma、the tea aroma；形容词 aromatic。', en: 'A fruity aroma, the tea aroma; the adjective is aromatic.' },
      collocations: ['a fruity aroma', 'a delicate aroma', 'the leaves’ aroma'],
      example: { en: 'Oolong has a shorter oxidation and a fruity aroma.', zh: '乌龙氧化时间较短，带果香。' },
      listening: { zh: '三音节，重音在第二音节 /ˈrəʊ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'ritual', phonetic: '/ˈrɪtʃuəl/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '仪式，惯例流程', en: 'a fixed, respectful sequence of actions' },
      usage: { zh: 'tea ritual、household ritual；形容词 ritual。', en: 'Tea ritual, household ritual; the adjective is ritual.' },
      collocations: ['a formal ritual', 'daily ritual', 'the tea ritual'],
      example: { en: 'In Japan tea became part of etiquette and household ritual.', zh: '在日本茶成为礼仪与家庭仪式的一部分。' },
      listening: { zh: '双音节，重音在首音节 /ˈrɪ/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'pouches', phonetic: '/ˈpaʊtʃɪz/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '小袋，囊状包装', en: 'a small soft bag holding a sample or portion' },
      usage: { zh: 'silk pouch、tea pouch；动词 pouch 指做成袋状。', en: 'Silk pouch, tea pouch; as a verb it means put in a pouch.' },
      collocations: ['a silk pouch', 'a small pouch', 'the tea pouch'],
      example: { en: 'The merchant sent tea samples in small silk pouches.', zh: '商人用丝绸小袋寄送茶叶样品。' },
      listening: { zh: '单音节，双元音 /aʊ/，尾音 /tʃ/。', en: 'One syllable with /aʊ/ and final /tʃ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'settle the stomach', sentenceIndex: 3,
      meaning: { zh: '舒缓胃部不适', en: 'to calm an unsettled stomach through a mild herb or drink' },
      usage: { zh: '健康说法；settle 在此是安抚。', en: 'Health usage; settle means soothe here.' },
      example: { en: 'Early tea was used to settle the stomach after heavy meals.', zh: '早期茶被用来在饱餐后舒缓胃部。' },
    },
    {
      phrase: 'staying awake', sentenceIndex: 5,
      meaning: { zh: '保持清醒', en: 'to remain alert rather than fall asleep' },
      usage: { zh: 'stay awake during meditation；反义 fall asleep。', en: 'Stay awake during meditation; the opposite is fall asleep.' },
      example: { en: 'Monks drank tea to stay awake through long meditation.', zh: '僧侣喝茶以便长时间禅坐保持清醒。' },
    },
    {
      phrase: 'took off', sentenceIndex: 22,
      meaning: { zh: '突然流行起来，迅速推广', en: 'to become popular quickly after a small start' },
      usage: { zh: '比喻用法；后接事物想法，不是飞机起飞。', en: 'Figurative for an idea catching on, not an aircraft leaving the ground.' },
      example: { en: 'The bag idea took off once customers liked the result.', zh: '顾客认可后茶包做法迅速流行。' },
    },
    {
      phrase: 'shaped by', sentenceIndex: 25,
      meaning: { zh: '由……塑造、决定', en: 'to be influenced and formed by conditions such as soil or climate' },
      usage: { zh: '被动结构；shape 后接因素。', en: 'Passive structure; take the influencing factor after shape.' },
      example: { en: 'Regional taste is shaped by soil, rainfall and processing.', zh: '地域口味由土壤、降水与加工塑造。' },
    },
    {
      phrase: 'sits between', sentenceIndex: 27,
      meaning: { zh: '介于两者之间', en: 'to occupy a middle position between two extremes' },
      usage: { zh: '工艺与分类语境；sit 在此是处于。', en: 'Used for categories; here sit means occupy a position.' },
      example: { en: 'Oolong sits between green tea and black tea.', zh: '乌龙介于绿茶与红茶之间。' },
    },
    {
      phrase: 'steeped in', sentenceIndex: 29,
      meaning: { zh: '浸泡在（热水中）', en: 'to leave leaves in hot water until flavour enters the water' },
      usage: { zh: '泡茶术语；steep 后接液体。', en: 'Brewing term; steep takes the liquid.' },
      example: { en: 'The core act is a leaf steeped in hot water and shared.', zh: '核心动作仍是泡一片叶子与人共饮。' },
    },
  ],
  tips: [
    {
      title: { zh: '讲座笔记抓时间与地点标签', en: 'Mark time and place labels in lecture notes' },
      body: {
        zh: '第 31–36 题多为起源、产地、阶层、世纪等事实。录音按中国起源、药用、英国普及、印度产区、日本分支、茶包年代推进，听到 south-west、medicinal、middle class、century 这类定位词立刻在对应题号旁写下名词，不要等讲完一段再补记。',
        en: 'Items 31 to 36 are mostly origin, place, class and century facts. The lecture moves through China, medicine, British spread, Indian regions, Japan and tea-bag dates. When you hear south-west, medicinal, middle class and century, write the noun beside the matching item at once rather than waiting until the paragraph ends.',
      },
    },
    {
      title: { zh: '加工区别按品类记对照', en: 'Record processing differences by tea type' },
      body: {
        zh: '第 38 题考红茶工艺，句 26 对比绿茶与红茶：绿茶保留叶色，红茶干燥前全氧化；句 27 的乌龙介于两者之间。选择题选项常把别的品类工艺搬进题干，听时把 green、black、oolong 各自的工艺分开记。',
        en: 'Item 38 tests black-tea processing, and sentence 26 contrasts green with black: green keeps the leaf colour, black is fully oxidised before drying, and sentence 27 places oolong between them. Options often borrow another type’s process; keep green, black and oolong separate in your notes.',
      },
    },
    {
      title: { zh: '结尾重复句常出主旨题', en: 'The closing restatement often answers the main-idea question' },
      body: {
        zh: '第 40 题问什么没变，答案在讲座末句 29：核心仍是热水泡茶与人共饮。学术独白常在结尾用 despite these changes、stays the same 总结不变项，听到这类总结句时留意它对应哪道单选。',
        en: 'Item 40 asks what has not changed, answered in the closing sentence 29: steeping a leaf in hot water and sharing it. Academic monologues often restate the constant at the end with despite these changes and stays the same; watch which single-choice question such a summary matches.',
      },
    },
  ],
};
