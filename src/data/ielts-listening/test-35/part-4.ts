import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 35 · Part 4 — 讲座：咖啡的历史（单人，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 结构：产地与早期贸易 → 烘焙与早期咖啡馆 → 殖民港口传播（填空 31–35）→
 * 早期饮用两大特征（多选 36–37）→ 传播成因、烘焙作用与讲座结论（单选 38–40）。
 */
export const test35Part4: ListeningLesson = {
  slug: 'test-35-part-4',
  part: 4,
  status: 'published',
  title: { zh: '咖啡的历史', en: 'The history of coffee' },
  summary: {
    zh: '讲座回顾咖啡从埃塞俄比亚高地野生浆果起步、经红海贸易传到阿拉伯半岛、烘焙释放香气、早期咖啡馆成为交谈与生意场所，并通过殖民港口扩散到南美、加勒比与亚洲种植区；归纳早期饮用的两个特征，再解释咖啡随贸易路线与制备知识传播、烘焙带来的风味变化，指出咖啡史是全球交流与城市文化的缩影。',
    en: 'The lecture traces coffee from Ethiopian highland berries across the Red Sea to Arabia, through roasting, coffee houses for talk and business, and colonial ports to plantations in South America, the Caribbean and Asia. It lists two early drinking features, explains spread along trade routes with preparation knowledge, the roasting effect, and coffee history as global exchange and urban culture.',
  },
  accent: { zh: '男讲师为加拿大口音，语速平稳，地名与年代会重复。', en: 'A male lecturer with a Canadian accent. He speaks steadily and repeats place names and periods.' },
  speechRate: '+5%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Coffee first grew wild in the highlands of', cells: [[{ blank: 31 }]] },
        { lead: 'Beans were carried across the', cells: [[{ blank: 32 }]] },
        { lead: 'Roasting turns the beans dark and', cells: [[{ blank: 33 }]] },
        { lead: 'Early coffee houses offered conversation and', cells: [[{ blank: 34 }]] },
        { lead: 'Coffee spread through colonial', cells: [[{ blank: 35 }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO features of early coffee drinking are mentioned? Choose TWO letters, A–F.',
      select: 2,
      stem: 'Which TWO features of early coffee drinking are mentioned?',
      options: [
        { key: 'A', text: 'beans were roasted before brewing' },
        { key: 'B', text: 'the drink came from a medicinal leaf' },
        { key: 'C', text: 'customers discussed trade and news over cups' },
        { key: 'D', text: 'coffee was grown in every European garden' },
        { key: 'E', text: 'brewed coffee was sealed and kept for months' },
        { key: 'F', text: 'each ship carried its own coffee plants' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 38,
          stem: 'Why did coffee spread beyond its original region?',
          options: [
            { key: 'A', text: 'local forests planted it across every continent' },
            { key: 'B', text: 'trade routes carried beans and preparation knowledge' },
            { key: 'C', text: 'colonial laws forced people to drink coffee' },
          ],
        },
        {
          number: 39,
          stem: 'What effect did roasting have on the bean?',
          options: [
            { key: 'A', text: 'it removed the need for boiling water' },
            { key: 'B', text: 'it released aroma and flavour and removed the raw taste' },
            { key: 'C', text: 'it made the beans last for years in storage' },
          ],
        },
        {
          number: 40,
          stem: 'What is the lecturer’s main point about coffee history?',
          options: [
            { key: 'A', text: 'it reflects global exchange and urban culture' },
            { key: 'B', text: 'it spread because European farmers preferred the climate' },
            { key: 'C', text: 'it began as a medicinal leaf in Europe' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['Ethiopia'], evidence: 1,
      explanation: {
        zh: '定位句 1：Coffee first grew wild in the highlands of Ethiopia, where local people noticed the effect of the red berries。原产地是埃塞俄比亚，填 Ethiopia；浆果只是被注意到的对象，不是产地。',
        en: 'Sentence 1: "Coffee first grew wild in the highlands of Ethiopia, where local people noticed the effect of the red berries". The origin is Ethiopia, so fill Ethiopia. The berries were what was noticed, not the place.',
      },
    },
    {
      number: 32, accepted: ['Red Sea'], evidence: 3,
      explanation: {
        zh: '定位句 3：Early traders carried beans across the Red Sea, bringing them to the markets of the Arabian peninsula。豆类经红海转运，填 Red Sea；阿拉伯半岛是到达的市场，不是渡海海域。',
        en: 'Sentence 3: "Early traders carried beans across the Red Sea, bringing them to the markets of the Arabian peninsula". Beans crossed the Red Sea, so fill Red Sea. The peninsula was the destination market, not the water crossed.',
      },
    },
    {
      number: 33, accepted: ['fragrant'], evidence: 6,
      explanation: {
        zh: '定位句 6：Roasting turns the beans dark and fragrant, releasing oils that carry the familiar aroma。烘焙后豆子色深且香，填 fragrant；aroma 是烘焙释放出的气味，不是豆子本身状态。',
        en: 'Sentence 6: "Roasting turns the beans dark and fragrant, releasing oils that carry the familiar aroma". Roasting makes beans dark and fragrant, so fill fragrant. Aroma is the released smell, not the bean’s own state.',
      },
    },
    {
      number: 34, accepted: ['business'], evidence: 11,
      explanation: {
        zh: '定位句 11：Early coffee houses were therefore places for conversation and business, not just eating and drinking。咖啡馆兼具交谈与谈生意，填 business；句 10 的 trade 是交谈话题的一部分。',
        en: 'Sentence 11: "Early coffee houses were therefore places for conversation and business, not just eating and drinking". Houses served conversation and business, so fill business. Trade in sentence 10 is one topic discussed.',
      },
    },
    {
      number: 35, accepted: ['ports'], evidence: 14,
      explanation: {
        zh: '定位句 14：Global trade spread coffee through colonial ports, where ships carried beans to new growing regions。咖啡经殖民港口扩散，填 ports；种植区是豆子运抵后的目的地。',
        en: 'Sentence 14: "Global trade spread coffee through colonial ports, where ships carried beans to new growing regions". Coffee spread through colonial ports, so fill ports. Growing regions were destinations after arrival.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：In the earliest records, beans were roasted over a fire before they were brewed, rather than used green。早期豆子先烘焙再冲泡，对应 A。句 20 明确它不是药草叶饮品。',
        en: 'Sentence 19: "In the earliest records, beans were roasted over a fire before they were brewed, rather than used green", matching A. Sentence 20 rules out the medicinal leaf drink.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 21,
      explanation: {
        zh: '定位句 21：Customers sat around shared tables and discussed trade and news over their cups。顾客围坐桌边边饮边谈贸易与新闻，对应 C。句 22 说明欧洲花园种不了咖啡树。',
        en: 'Sentence 21: "Customers sat around shared tables and discussed trade and news over their cups", matching C. Sentence 22 states European gardens could not grow coffee trees.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：Trade routes carried both the beans and the knowledge of how to prepare them。传播靠贸易路线同时带走豆子和制备知识，对应 B。没有森林跨洲播种，也没有法律强制饮用。',
        en: 'Sentence 27: "Trade routes carried both the beans and the knowledge of how to prepare them", matching B. Forests did not plant it across continents, and no law forced people to drink it.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：The heat released the aroma and flavour that make coffee recognizable, while removing the raw grassy taste。烘焙释放香气与风味、去掉生草味，对应 B。烘焙不省去烧水，也不能让豆子储存多年。',
        en: 'Sentence 31: "The heat released the aroma and flavour that make coffee recognizable, while removing the raw grassy taste", matching B. Roasting does not remove boiling water or store beans for years.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 39,
      explanation: {
        zh: '定位句 39：Coffee history reflects global exchange and urban culture, rather than the story of one single place。讲座主旨是咖啡史折射全球交流与城市文化，对应 A。句 40 的植物、商人、港口与房间都是这一主线的组成部分。',
        en: 'Sentence 39: "Coffee history reflects global exchange and urban culture, rather than the story of one single place", matching A. The plant, traders, ports and rooms in sentence 40 are parts of this main thread.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'More than two billion cups of coffee are drunk around the world every day, and its history reaches back many centuries.' },
    { speaker: 'lecturer', text: 'Coffee first grew wild in the highlands of Ethiopia, where local people noticed the effect of the red berries.' },
    { speaker: 'lecturer', text: 'The beans inside those berries were later dried and carried by traders moving north and east.' },
    { speaker: 'lecturer', text: 'Early traders carried beans across the Red Sea, bringing them to the markets of the Arabian peninsula.' },
    { speaker: 'lecturer', text: 'There, farmers began to grow coffee in shaded gardens near the coast.' },
    { speaker: 'lecturer', text: 'The drink itself was prepared by boiling roasted beans in water, often with spices added.' },
    { speaker: 'lecturer', text: 'Roasting turns the beans dark and fragrant, releasing oils that carry the familiar aroma.' },
    { speaker: 'lecturer', text: 'Before roasting, the green beans taste plain and grassy, so the heat is essential to the flavour.' },
    { speaker: 'lecturer', text: 'From the Arabian peninsula, coffee reached Egypt, Syria and the cities of the Ottoman empire.' },
    { speaker: 'lecturer', text: 'Early coffee houses opened as places where people met over a cup.' },
    { speaker: 'lecturer', text: 'In those rooms, customers talked about trade, news and the latest ideas.' },
    { speaker: 'lecturer', text: 'Early coffee houses were therefore places for conversation and business, not just eating and drinking.' },
    { speaker: 'lecturer', text: 'By the seventeenth century, coffee houses had appeared in major European port cities.' },
    { speaker: 'lecturer', text: 'Merchants, writers and students gathered there, and some rooms became known by the people who used them.' },
    { speaker: 'lecturer', text: 'Global trade spread coffee through colonial ports, where ships carried beans to new growing regions.' },
    { speaker: 'lecturer', text: 'Plantations were later started in South America, the Caribbean and parts of Asia.' },
    { speaker: 'lecturer', text: 'Brazil became one of the largest coffee producers in the world, and its beans reached every market.' },
    { speaker: 'lecturer', text: 'The growing regions changed over time, but the preparation method stayed broadly similar.' },
    { speaker: 'lecturer', text: 'Now let us look at what early coffee drinking actually involved.' },
    { speaker: 'lecturer', text: 'In the earliest records, beans were roasted over a fire before they were brewed, rather than used green.' },
    { speaker: 'lecturer', text: 'The drink was not made from a medicinal leaf, and it was not a herb tea in the modern sense.' },
    { speaker: 'lecturer', text: 'Customers sat around shared tables and discussed trade and news over their cups.' },
    { speaker: 'lecturer', text: 'Coffee was not grown in every European garden; the climate there was too cool for the trees.' },
    { speaker: 'lecturer', text: 'Brewed coffee was drunk fresh, and it was not sealed and stored for months.' },
    { speaker: 'lecturer', text: 'As port cities grew, demand for coffee rose among merchants and travellers.' },
    { speaker: 'lecturer', text: 'These early habits explain why coffee houses became such important public spaces.' },
    { speaker: 'lecturer', text: 'So why did coffee spread beyond its original region?' },
    { speaker: 'lecturer', text: 'Trade routes carried both the beans and the knowledge of how to prepare them.' },
    { speaker: 'lecturer', text: 'Merchants who bought coffee in one market taught buyers in the next how to roast and brew it.' },
    { speaker: 'lecturer', text: 'Travel and colonial exchange carried the drink to regions that had never seen the plant.' },
    { speaker: 'lecturer', text: 'What effect did roasting have on the bean itself?' },
    { speaker: 'lecturer', text: 'The heat released the aroma and flavour that make coffee recognizable, while removing the raw grassy taste.' },
    { speaker: 'lecturer', text: 'Different roasting levels produce lighter or darker cups, but the core process remains the same.' },
    { speaker: 'lecturer', text: 'The bean also changes colour and texture as the oils rise to the surface.' },
    { speaker: 'lecturer', text: 'Over time, coffee became linked with work, study and social life in many cities.' },
    { speaker: 'lecturer', text: 'Coffee houses offered a neutral room where people could meet without going to a private home.' },
    { speaker: 'lecturer', text: 'Some early business agreements were reached over a cup, and writers drafted articles in the same rooms.' },
    { speaker: 'lecturer', text: 'The drink moved along the same routes that carried goods, letters and ideas between continents.' },
    { speaker: 'lecturer', text: 'What is the main point of this short history?' },
    { speaker: 'lecturer', text: 'Coffee history reflects global exchange and urban culture, rather than the story of one single place.' },
    { speaker: 'lecturer', text: 'The plant, the traders, the ports and the city rooms all shaped the drink we know today.' },
    { speaker: 'lecturer', text: 'Modern coffee still carries traces of this long route, from the bean origin to the roasting table.' },
    { speaker: 'lecturer', text: 'The soils and altitude of each growing region leave their mark on the final taste.' },
    { speaker: 'lecturer', text: 'Small differences in processing gave rise to distinct regional names among buyers.' },
    { speaker: 'lecturer', text: 'Shipping schedules later made fresh beans available year round in large importing cities.' },
    { speaker: 'lecturer', text: 'The next session will compare coffee with tea as two drinks that shaped public life.' },
    { speaker: 'lecturer', text: 'You can find the reading list on the course page before then.' },
    { speaker: 'lecturer', text: 'If a term is unclear, note it down and ask at the start of the next class.' },
    { speaker: 'lecturer', text: 'The slides from this talk are posted in the shared folder along with the map of early trade routes.' },
    { speaker: 'lecturer', text: 'Please do not take notes on every detail; focus on the main stages and the regions named today.' },
    { speaker: 'lecturer', text: 'Questions can be written on the card by the door, and I will answer them after the break.' },
    { speaker: 'lecturer', text: 'Before we move on, one last reminder about the reading for next week.' },
    { speaker: 'lecturer', text: 'The chapter covers the spread of coffee across the Atlantic and the plantations it reached.' },
    { speaker: 'lecturer', text: 'Take a look at the map in the chapter, and match each port to the region that supplied it.' },
  ],
  vocabulary: [
    {
      term: 'highlands', phonetic: '/ˈhaɪləndz/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '高地，高原山区', en: 'the elevated inland region where coffee first grew' },
      usage: { zh: '复数地名用法；the Ethiopian highlands、the coastal highlands。', en: 'Plural place term: the Ethiopian highlands, the coastal highlands.' },
      collocations: ['the Ethiopian highlands', 'the mountain highlands', 'the highland region'],
      example: { en: 'Coffee grew wild in the Ethiopian highlands.', zh: '咖啡野生于埃塞俄比亚高地。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈhaɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'berries', phonetic: '/ˈberiz/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '浆果，咖啡果', en: 'the small red fruit that holds the coffee bean' },
      usage: { zh: '可数复数；coffee berries、red berries。单数 berry。', en: 'Countable plural: coffee berries, red berries; singular berry.' },
      collocations: ['the red berries', 'coffee berries', 'pick the berries'],
      example: { en: 'People noticed the effect of the red berries.', zh: '人们注意到红色浆果的作用。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈber/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'peninsula', phonetic: '/pəˈnɪnsjələ/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '半岛', en: 'the land mass surrounded partly by sea, here Arabia' },
      usage: { zh: '可数名词；the Arabian peninsula、on the peninsula。', en: 'Countable: the Arabian peninsula, on the peninsula.' },
      collocations: ['the Arabian peninsula', 'on the peninsula', 'a coastal peninsula'],
      example: { en: 'Beans reached the markets of the peninsula.', zh: '豆类抵达半岛市场。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈnɪn/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'plantations', phonetic: '/plænˈteɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '种植园', en: 'the large farms where coffee was grown for trade' },
      usage: { zh: '可数复数；coffee plantations、start plantations。单数 plantation。', en: 'Countable plural: coffee plantations, start plantations; singular plantation.' },
      collocations: ['coffee plantations', 'start plantations', 'the coastal plantations'],
      example: { en: 'Plantations were started in South America and Asia.', zh: '南美与亚洲建起种植园。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈteɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'producers', phonetic: '/prəˈdjuːsəz/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '产地国，生产商', en: 'the regions or companies that grow and supply coffee' },
      usage: { zh: '可数复数；coffee producers、major producers。单数 producer。', en: 'Countable plural: coffee producers, major producers; singular producer.' },
      collocations: ['major producers', 'coffee producers', 'a leading producer'],
      example: { en: 'Brazil became a largest coffee producer.', zh: '巴西成为主要咖啡产地国。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈdjuː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'aroma', phonetic: '/əˈrəʊmə/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '香气，香味', en: 'the pleasant smell released by roasted coffee' },
      usage: { zh: '可数/不可数；the familiar aroma、the coffee aroma。', en: 'The familiar aroma, the coffee aroma.' },
      collocations: ['the coffee aroma', 'the familiar aroma', 'release an aroma'],
      example: { en: 'Oils carry the familiar coffee aroma.', zh: '油脂携带着熟悉的咖啡香气。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈrəʊ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'texture', phonetic: '/ˈtekstʃə/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '质地，口感结构', en: 'the surface feel and structure of the roasted bean' },
      usage: { zh: '不可数；the bean texture、change the texture。', en: 'Uncountable: the bean texture, change the texture.' },
      collocations: ['the bean texture', 'the surface texture', 'a smooth texture'],
      example: { en: 'The bean changes colour and texture in the heat.', zh: '受热后豆子颜色与质地改变。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtek/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'neutral', phonetic: '/ˈnjuːtrəl/', partOfSpeech: 'adj.', sentenceIndex: 35,
      meaning: { zh: '中立的，公共中性的', en: 'open and even, not tied to a private home or party' },
      usage: { zh: '形容词；a neutral room、a neutral meeting space。', en: 'A neutral room, a neutral meeting space.' },
      collocations: ['a neutral room', 'a neutral space', 'neutral ground'],
      example: { en: 'The house offered a neutral room to meet in.', zh: '咖啡馆提供了一个中立的会面空间。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈnjuː/。', en: 'Two syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'noticed the effect', sentenceIndex: 1,
      meaning: { zh: '注意到（饮品的）作用', en: 'to observe the effect a plant or drink had on people' },
      usage: { zh: '及物；notice the effect of the berries、notice the effect of the drink。', en: 'Transitive: notice the effect of the berries, notice the effect of the drink.' },
      example: { en: 'People noticed the effect of the red berries.', zh: '人们注意到红色浆果的作用。' },
    },
    {
      phrase: 'rise to the surface', sentenceIndex: 33,
      meaning: { zh: '升到表面（油脂析出）', en: 'to move up to the outer layer of the roasted bean' },
      usage: { zh: '不及物；oils rise to the surface。', en: 'Intransitive: oils rise to the surface.' },
      example: { en: 'Oils rise to the surface as the bean roasts.', zh: '烘焙时油脂析到豆子表面。' },
    },
    {
      phrase: 'year round', sentenceIndex: 44,
      meaning: { zh: '全年，一年到头', en: 'available throughout every season' },
      usage: { zh: '时间状语；fresh beans year round、open year round。', en: 'Adverbial: fresh beans year round, open year round.' },
      example: { en: 'Shipping made fresh beans available year round.', zh: '航运让新鲜豆子全年可得。' },
    },
    {
      phrase: 'leave their mark', sentenceIndex: 42,
      meaning: { zh: '留下印记，产生影响', en: 'to have a lasting effect on the final taste or product' },
      usage: { zh: '及物；soils leave their mark、the region leaves its mark。', en: 'Transitive: soils leave their mark, the region leaves its mark.' },
      example: { en: 'Soils leave their mark on the final taste.', zh: '土壤在最终风味上留下印记。' },
    },
    {
      phrase: 'take a look at', sentenceIndex: 53,
      meaning: { zh: '查看，看一眼（地图）', en: 'to examine a map or chapter section' },
      usage: { zh: '及物；take a look at the map、take a look at the list。', en: 'Transitive: take a look at the map, take a look at the list.' },
      example: { en: 'Take a look at the map in the chapter.', zh: '看一看章节里的地图。' },
    },
  ],
  tips: [
    {
      title: { zh: '产地与路线成对记', en: 'Pair origin with route' },
      body: {
        zh: '听到地名先记两个层级：起点埃塞俄比亚高地，渡海红海，到达阿拉伯半岛市场；后面种植区是南美、加勒比、亚洲。填空题常把到达地误写成途经海域。',
        en: 'Record place names at two levels: origin Ethiopian highlands, crossing the Red Sea, arriving at Arabian markets; later plantations in South America, the Caribbean and Asia. Fill-ins often swap destination for the sea crossed.',
      },
    },
    {
      title: { zh: '多选排除未提及的夸张说法', en: 'Rule out unsupported exaggerations' },
      body: {
        zh: '早期咖啡不是药草叶饮品、欧洲花园种不了咖啡树、煮好的咖啡不密封存数月、船上不自带咖啡植株；选项出现 every、months、plants 这类绝对词时，回听原文是否真有依据。',
        en: 'Early coffee was not a medicinal leaf drink, European gardens could not grow trees, brewed coffee was not sealed for months, and ships did not carry plants. At absolute words like every, months or plants, check whether the recording actually supports them.',
      },
    },
    {
      title: { zh: '结论题抓主线而非细节', en: 'The conclusion follows the main thread' },
      body: {
        zh: '最后一题问主旨，选能概括植物、商人、港口、城市房间的那条，即全球交流与城市文化；把某一地区的气候偏好或植物起源当主旨的选项通常是细节干扰。',
        en: 'The final question asks for the main point; choose the option covering plant, traders, ports and city rooms, that is global exchange and urban culture. Options reducing the history to one region’s climate preference or plant origin are detail distractors.',
      },
    },
  ],
};
