import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 45 · Part 4 — 讲座：发酵（单人）。原创仿真材料，非官方真题。
 *
 * 结构：微生物作用 → 面包与风味 → 工业应用 → 控制条件 → 食品实例 → 总结；
 * 笔记填空按讲座顺序出现，多选落在食品实例两段，单选落在中段问答与结尾评价。
 */
export const test45Part4: ListeningLesson = {
  slug: 'test-45-part-4',
  part: 4,
  status: 'published',
  title: { zh: '发酵', en: 'Fermentation' },
  summary: {
    zh: '一场关于发酵的讲座：微生物如何以原料为食并分解出简单物质，酵母在面包中分解糖释放气体，发酵如何改善风味，工业发酵如何生产酶、化学品与药物，以及温度、湿度和酸度等控制条件为何决定批次成败。',
    en: 'A lecture on fermentation: how microbes feed on raw material and break it into simpler compounds, how yeast breaks down sugar to release gas in bread, how fermentation improves flavour, how industry makes enzymes, chemicals and medicines, and why temperature, moisture and acidity determine whether a batch succeeds.',
  },
  accent: { zh: '男讲师为加拿大口音，语速平稳，术语会重复。', en: 'A male lecturer with a Canadian accent. He speaks steadily and repeats key terms.' },
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
        { lead: 'Fermentation uses', cells: [[{ blank: 31 }, { text: ' such as yeast and bacteria.' }]] },
        { lead: 'In bread, yeast breaks down', cells: [[{ blank: 32 }, { text: ' to release gas.' }]] },
        { lead: 'Fermented foods improve the', cells: [[{ blank: 33 }, { text: ' of the product.' }]] },
        { lead: 'Industrial fermentation produces chemicals and', cells: [[{ blank: 34 }, { text: '.' }]] },
        { lead: 'Temperature and', cells: [[{ blank: 35 }, { text: ' must be kept steady.' }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO foods are examples of fermentation? Choose TWO letters, A–F.',
      select: 2,
      stem: 'Which TWO foods are examples of fermentation?',
      options: [
        { key: 'A', text: 'bread' },
        { key: 'B', text: 'cheese' },
        { key: 'C', text: 'fresh fruit' },
        { key: 'D', text: 'raw milk' },
        { key: 'E', text: 'boiled rice' },
        { key: 'F', text: 'salted nuts' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 38,
          stem: 'What do microbes do during fermentation?',
          options: [
            { key: 'A', text: 'They add colour to the food directly.' },
            { key: 'B', text: 'They break down substances and release energy.' },
            { key: 'C', text: 'They keep the food raw for longer.' },
          ],
        },
        {
          number: 39,
          stem: 'Why are control conditions important in a production batch?',
          options: [
            { key: 'A', text: 'Unstable conditions can spoil the batch or change the taste.' },
            { key: 'B', text: 'They allow the lab staff to work shorter hours.' },
            { key: 'C', text: 'They prevent microbes from entering the room.' },
          ],
        },
        {
          number: 40,
          stem: 'What is the lecturer’s view of home fermentation?',
          options: [
            { key: 'A', text: 'It should be banned from student kitchens.' },
            { key: 'B', text: 'It can be learned, but hygiene matters at every step.' },
            { key: 'C', text: 'It produces safer food than factory methods.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['microbes'], evidence: 3,
      explanation: {
        zh: '定位句 3：Fermentation works through living organisms, mainly microbes such as yeast and bacteria。发酵依靠酵母、细菌等微生物，空格后已有 such as，填 microbes。',
        en: 'Sentence 3: "Fermentation works through living organisms, mainly microbes such as yeast and bacteria". Fermentation relies on microbes such as yeast and bacteria; such as already follows the gap, so write microbes.',
      },
    },
    {
      number: 32, accepted: ['sugar'], evidence: 6,
      explanation: {
        zh: '定位句 6：In bread making, yeast breaks down sugar to release gas that pockets the dough。酵母分解的是糖，气体由此产生；句 5 的 compounds 是泛指，不是面包这一例的对象。',
        en: 'Sentence 6: "In bread making, yeast breaks down sugar to release gas that pockets the dough". Yeast breaks down sugar in bread; compounds in sentence 5 is a general term, not the bread example.',
      },
    },
    {
      number: 33, accepted: ['flavour'], evidence: 10,
      explanation: {
        zh: '定位句 10：Fermented foods improve the flavour of the product, often making it richer or sharper。发酵改善产品风味；句 9 的 smell and taste 是铺垫，本空对应名词 flavour。',
        en: 'Sentence 10: "Fermented foods improve the flavour of the product, often making it richer or sharper". Fermentation improves flavour; smell and taste in sentence 9 are lead in, and the gap asks for flavour.',
      },
    },
    {
      number: 34, accepted: ['enzymes'], evidence: 13,
      explanation: {
        zh: '定位句 13：Industrial fermentation produces chemicals and enzymes used in medicine and cleaning products。工业发酵产出化学品和酶，对应空格后的句号；句 14 的 enzymes 回指确认。',
        en: 'Sentence 13: "Industrial fermentation produces chemicals and enzymes used in medicine and cleaning products". Industrial fermentation makes chemicals and enzymes; sentence 14 refers back to the enzymes.',
      },
    },
    {
      number: 35, accepted: ['moisture'], evidence: 18,
      explanation: {
        zh: '定位句 18：Temperature and moisture must be kept steady through the whole batch。温度和湿度需保持稳定；句 21 的 acidity 是另一项被监控指标，不填本空。',
        en: 'Sentence 18: "Temperature and moisture must be kept steady through the whole batch". Temperature and moisture stay steady; acidity in sentence 21 is another monitored condition, not this gap.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：Yogurt and cheese rely on bacterial cultures that turn milk into a thicker product。奶酪由细菌培养物发酵牛奶制成，对应 B。C 的鲜果、D 的生奶、E 的米饭、F 的坚果都在句 27–29 被排除。',
        en: 'Sentence 25: "Yogurt and cheese rely on bacterial cultures that turn milk into a thicker product". Cheese is made by bacterial cultures acting on milk, matching B. Fresh fruit, raw milk, boiled rice and salted nuts in C, D, E and F are excluded in sentences 27 to 29.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：Bread rises because of the gas released by yeast in the warm dough。面包靠酵母产气发起来，是发酵食品，对应 A。',
        en: 'Sentence 26: "Bread rises because of the gas released by yeast in the warm dough". Bread rises on yeast gas, so it is a fermented food, matching A.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：They break down substances and release energy in the process。微生物分解物质并在过程中释放能量，对应 B。句 32 否定直接调色，句 33 否定保持原料生的状态。',
        en: 'Sentence 31: "They break down substances and release energy in the process". Microbes break down substances and release energy, matching B. Sentence 32 rules out adding colour directly, and sentence 33 rules out keeping the food raw.',
      },
    },
    {
      number: 39, accepted: ['A'], evidence: 35,
      explanation: {
        zh: '定位句 35：Unstable conditions can spoil the batch or change the taste, so the environment is held steady。条件不稳会毁批次或改变风味，对应 A。B 的缩短工时、C 的阻隔微生物进屋都不是控制条件的目的。',
        en: 'Sentence 35: "Unstable conditions can spoil the batch or change the taste, so the environment is held steady". Unstable conditions spoil the batch or alter taste, matching A. Shorter shifts in B and keeping microbes out in C are not the purpose of the controls.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 38,
      explanation: {
        zh: '定位句 38：It can be learned in a kitchen, but hygiene matters at every step。家庭发酵可以学会，但每一步都要讲卫生，对应 B。句 40 否定比工厂更安全，句 41 否定应当禁止。',
        en: 'Sentence 38: "It can be learned in a kitchen, but hygiene matters at every step". Home fermentation can be learned with careful hygiene, matching B. Sentence 40 rules out factory-level safety, and sentence 41 rules out a ban.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'What turns grape juice into wine, and flour into a risen loaf?' },
    { speaker: 'lecturer', text: 'The answer in both cases is fermentation, one of the oldest methods people know.' },
    { speaker: 'lecturer', text: 'Today we will look at how microbes drive it, where it appears in food and industry, and what conditions keep it under control.' },
    { speaker: 'lecturer', text: 'Fermentation works through living organisms, mainly microbes such as yeast and bacteria.' },
    { speaker: 'lecturer', text: 'These organisms feed on sugars and other compounds in the raw material.' },
    { speaker: 'lecturer', text: 'As they feed, they break the material down into simpler substances.' },
    { speaker: 'lecturer', text: 'In bread making, yeast breaks down sugar to release gas that pockets the dough.' },
    { speaker: 'lecturer', text: 'That gas is carbon dioxide, and it creates the holes you see in a finished loaf.' },
    { speaker: 'lecturer', text: 'The same process in fruit juice produces alcohol instead of gas.' },
    { speaker: 'lecturer', text: 'Over time, the microbes also alter the smell and taste of the material.' },
    { speaker: 'lecturer', text: 'Fermented foods improve the flavour of the product, often making it richer or sharper.' },
    { speaker: 'lecturer', text: 'They can also preserve the food, slowing the growth of unwanted organisms.' },
    { speaker: 'lecturer', text: 'Beyond the kitchen, fermentation has a large industrial side.' },
    { speaker: 'lecturer', text: 'Industrial fermentation produces chemicals and enzymes used in medicine and cleaning products.' },
    { speaker: 'lecturer', text: 'Enzymes from microbial cultures help break down stains in washing powders.' },
    { speaker: 'lecturer', text: 'Some vaccines and antibiotic drugs are made with fermenting cultures as well.' },
    { speaker: 'lecturer', text: 'The process also supplies animal feed additives and certain biofuels.' },
    { speaker: 'lecturer', text: 'In every setting, the microbes need a stable environment to do their work.' },
    { speaker: 'lecturer', text: 'Temperature and moisture must be kept steady through the whole batch.' },
    { speaker: 'lecturer', text: 'If the room is too cold, the microbes slow down and the reaction stalls.' },
    { speaker: 'lecturer', text: 'If it is too warm, unwanted organisms may take over and spoil the batch.' },
    { speaker: 'lecturer', text: 'Acidity levels are watched closely, because they decide which microbes can grow.' },
    { speaker: 'lecturer', text: 'Too much variation can change the taste or make the product unsafe.' },
    { speaker: 'lecturer', text: 'That is why factories monitor each vat with sensors and written logs.' },
    { speaker: 'lecturer', text: 'The raw material itself must be checked for contaminants before it enters the vat.' },
    { speaker: 'lecturer', text: 'Yogurt and cheese rely on bacterial cultures that turn milk into a thicker product.' },
    { speaker: 'lecturer', text: 'Bread rises because of the gas released by yeast in the warm dough.' },
    { speaker: 'lecturer', text: 'Fresh fruit, by contrast, is eaten raw, with no fermentation involved.' },
    { speaker: 'lecturer', text: 'Raw milk itself is not a fermented product until bacteria act on it.' },
    { speaker: 'lecturer', text: 'Boiled rice and salted nuts have no live microbes doing the work.' },
    { speaker: 'lecturer', text: 'What exactly do the microbes do during fermentation?' },
    { speaker: 'lecturer', text: 'They break down substances and release energy in the process.' },
    { speaker: 'lecturer', text: 'They do not add colour to the food directly; colour comes from later changes.' },
    { speaker: 'lecturer', text: 'They do not keep the food raw; their work transforms the material.' },
    { speaker: 'lecturer', text: 'Why do control conditions matter so much in a production batch?' },
    { speaker: 'lecturer', text: 'Unstable conditions can spoil the batch or change the taste, so the environment is held steady.' },
    { speaker: 'lecturer', text: 'Good conditions do not shorten the staff shift, and they do not keep microbes out of the room.' },
    { speaker: 'lecturer', text: 'A common question is whether students should try fermentation at home.' },
    { speaker: 'lecturer', text: 'It can be learned in a kitchen, but hygiene matters at every step.' },
    { speaker: 'lecturer', text: 'Clean jars, fresh ingredients and a watched temperature prevent mould and bad batches.' },
    { speaker: 'lecturer', text: 'Home fermentation is not safer than factory methods; it simply uses smaller amounts.' },
    { speaker: 'lecturer', text: 'It should not be banned from student kitchens, but beginners should follow a tested recipe.' },
    { speaker: 'lecturer', text: 'Let us now summarise the main points before the discussion.' },
    { speaker: 'lecturer', text: 'Microbes feed on raw material and break it into simpler compounds.' },
    { speaker: 'lecturer', text: 'Bread, cheese and yogurt are everyday food examples of the process.' },
    { speaker: 'lecturer', text: 'Industry uses the same reactions to make enzymes, chemicals and medicines.' },
    { speaker: 'lecturer', text: 'Temperature, moisture and acidity are the controls that keep the batch predictable.' },
    { speaker: 'lecturer', text: 'Without these controls, the same recipe can give very different results.' },
    { speaker: 'lecturer', text: 'Next week we will look at how flavour develops inside a single fermented food.' },
    { speaker: 'lecturer', text: 'You can read the case study on sauerkraut before then.' },
    { speaker: 'lecturer', text: 'The reading also shows where home batches most often go wrong.' },
    { speaker: 'lecturer', text: 'Please bring one example of a fermented food you have tried to the seminar.' },
  ],
  vocabulary: [
    {
      term: 'fermentation', phonetic: '/ˌfɜːmenˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '发酵', en: 'a process in which microbes break down a substance without oxygen' },
      usage: { zh: '不可数名词；动词 ferment，形容词 fermented；fermented food 指发酵食品。', en: 'Uncountable; verb ferment, adjective fermented. Fermented food is made by this process.' },
      collocations: ['the fermentation', 'fermented food', 'industrial fermentation'],
      example: { en: 'Fermentation is one of the oldest food methods.', zh: '发酵是最古老的食品加工方法之一。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈteɪ/，开头 fer 弱读。', en: 'Five syllables with stress on the fourth; the opening fer is weak.' },
    },
    {
      term: 'microbes', phonetic: '/ˈmaɪkrəʊbz/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '微生物', en: 'a tiny living organism such as yeast or bacteria, visible only under a microscope' },
      usage: { zh: '可数名词；microbes such as yeast and bacteria，形容词 microbial。', en: 'Countable: microbes such as yeast and bacteria; the adjective is microbial.' },
      collocations: ['microbes such as', 'live microbes', 'microbial cultures'],
      example: { en: 'Microbes feed on sugars in the raw material.', zh: '微生物以原料中的糖分为食。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈmaɪ/，双元音 /aɪ/。', en: 'Two syllables with first-syllable stress and the diphthong /aɪ/.' },
    },
    {
      term: 'compounds', phonetic: '/ˈkɒmpaʊndz/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '化合物，混合物质', en: 'a substance made of two or more elements joined together' },
      usage: { zh: '可数名词；此处指原料中的糖分等化合物，不指“围墙”义。', en: 'Countable: chemical compounds in raw material, not the enclosed yard sense.' },
      collocations: ['other compounds', 'a chemical compound', 'break down a compound'],
      example: { en: 'The microbes feed on sugars and other compounds.', zh: '微生物以糖分和其他化合物为食。' },
      listening: { zh: '名词重音在第一音节 /ˈkɒm/；动词重音在第二音节，注意区分。', en: 'Noun stress is the first syllable; the verb stresses the second, so listen for the part of speech.' },
    },
    {
      term: 'flavour', phonetic: '/ˈfleɪvə(r)/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '风味，味道', en: 'the particular taste and smell of a food' },
      usage: { zh: '英式拼写 flavour，美式 flavor；improve the flavour、rich flavour。', en: 'British flavour, American flavor: improve the flavour, a rich flavour.' },
      collocations: ['improve the flavour', 'a rich flavour', 'sharp flavour'],
      example: { en: 'Fermented foods improve the flavour of the product.', zh: '发酵食品改善产品的风味。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈfleɪ/，结尾 -our 弱读。', en: 'Two syllables with first-syllable stress; the ending -our is weak.' },
    },
    {
      term: 'enzymes', phonetic: '/ˈenzaɪmz/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '酶', en: 'a protein that speeds up a chemical reaction in living things' },
      usage: { zh: '可数名词；industrial enzymes、enzymes in washing powders，复数加 -s。', en: 'Countable: industrial enzymes, enzymes in washing powders; the plural adds -s.' },
      collocations: ['chemicals and enzymes', 'industrial enzymes', 'microbial enzymes'],
      example: { en: 'Industrial fermentation produces chemicals and enzymes.', zh: '工业发酵生产化学品和酶。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈen/，结尾 /zaɪm/ 饱满。', en: 'Two syllables with first-syllable stress; the ending /zaɪm/ is full.' },
    },
    {
      term: 'moisture', phonetic: '/ˈmɔɪstʃə(r)/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '湿度，水分', en: 'the amount of water held in the air or in a material' },
      usage: { zh: '不可数名词；与 temperature 并列作控制条件，形容词 moist。', en: 'Uncountable; listed beside temperature as a control condition; the adjective is moist.' },
      collocations: ['temperature and moisture', 'keep moisture steady', 'low moisture'],
      example: { en: 'Temperature and moisture must be kept steady.', zh: '温度和湿度必须保持稳定。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈmɔɪ/，中间 /stʃ/ 连读。', en: 'Two syllables with first-syllable stress; the /stʃ/ blends together.' },
    },
    {
      term: 'hygiene', phonetic: '/ˈhaɪdʒiːn/', partOfSpeech: 'n.', sentenceIndex: 38,
      meaning: { zh: '卫生（条件）', en: 'cleanliness that prevents contamination and keeps food safe' },
      usage: { zh: '不可数名词；food hygiene、hygiene matters，形容词 hygienic。', en: 'Uncountable: food hygiene, hygiene matters; the adjective is hygienic.' },
      collocations: ['hygiene matters', 'food hygiene', 'strict hygiene'],
      example: { en: 'Hygiene matters at every step of home fermentation.', zh: '家庭发酵每一步都要讲究卫生。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈhaɪ/，结尾 /dʒiːn/ 长音。', en: 'Two syllables with first-syllable stress; the ending /dʒiːn/ is long.' },
    },
  ],
  expressions: [
    {
      phrase: 'under control', sentenceIndex: 2,
      meaning: { zh: '处于受控状态', en: 'kept within the limits needed for the process to work' },
      usage: { zh: 'keep something under control 指把条件控制住；反义 out of control。', en: 'Keep something under control means hold it within limits; the opposite is out of control.' },
      example: { en: 'The conditions that keep fermentation under control are temperature and moisture.', zh: '让发酵受控的条件是温度和湿度。' },
    },
    {
      phrase: 'feed on', sentenceIndex: 4,
      meaning: { zh: '以……为食，靠……为生', en: 'to use a substance as food and energy source' },
      usage: { zh: '微生物场景常用；feed on sugars、feed on raw material。', en: 'Common for microbes: feed on sugars, feed on raw material.' },
      example: { en: 'These organisms feed on sugars in the material.', zh: '这些微生物以物质中的糖分为食。' },
    },
    {
      phrase: 'breaks down', sentenceIndex: 6,
      meaning: { zh: '分解（物质）', en: 'to split a substance into simpler parts' },
      usage: { zh: '及物短语动词；break down sugar、break down compounds，宾语可放在中间。', en: 'Transitive phrasal verb: break down sugar or compounds; the object can sit in the middle.' },
      example: { en: 'Yeast breaks down sugar to release gas.', zh: '酵母分解糖以释放气体。' },
    },
    {
      phrase: 'take over', sentenceIndex: 20,
      meaning: { zh: '占据，接管（发酵环境）', en: 'to become the dominant organism in the batch' },
      usage: { zh: '此处指杂菌在条件失控时抢占批次；take over the batch。', en: 'Here unwanted organisms become dominant when conditions fail; take over the batch.' },
      example: { en: 'Unwanted organisms may take over and spoil the batch.', zh: '杂菌可能抢占批次并使其变质。' },
    },
    {
      phrase: 'held steady', sentenceIndex: 35,
      meaning: { zh: '保持稳定', en: 'to keep a condition from changing up or down' },
      usage: { zh: 'hold 在此为使保持；hold the environment steady，同义 keep steady。', en: 'Hold means keep here: hold the environment steady, like keep steady.' },
      example: { en: 'The environment is held steady through the batch.', zh: '整个批次期间环境保持稳定。' },
    },
    {
      phrase: 'go wrong', sentenceIndex: 50,
      meaning: { zh: '出问题，失败', en: 'to develop a fault or fail, often in a process' },
      usage: { zh: '短语动词；where home batches go wrong 指家庭批次容易出错的环节。', en: 'Phrasal verb: where home batches go wrong means the points where they fail.' },
      example: { en: 'The reading shows where home batches go wrong.', zh: '阅读材料指出家庭批次容易出错的地方。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记空格先判词性', en: 'Judge the part of speech before writing' },
      body: {
        zh: '五行空格分别要填：微生物（名词）、糖（名词）、风味（名词）、酶（名词复数）、湿度（名词）。听到 answer 前先看空格前后的 such as、to release gas、and 等连接词，判断要写单数还是复数。',
        en: 'The five gaps ask for microbes, sugar, flavour, enzymes and moisture. Before each answer, read the connectors around the gap, such as such as, to release gas and and, to decide whether a singular or plural form is needed.',
      },
    },
    {
      title: { zh: '多选排除生食与加工食品', en: 'Rule out raw or processed foods' },
      body: {
        zh: '多选两题要找真正由微生物发酵的食品。鲜果生吃、生奶未经细菌作用、米饭煮熟、坚果盐渍，都被讲师明确排除；听到 by contrast、not until、no live microbes 时划掉对应选项。',
        en: 'The two multiple choice answers are foods genuinely fermented by microbes. Raw fruit, untreated raw milk, boiled rice and salted nuts are explicitly excluded. Cross out an option when you hear by contrast, not until or no live microbes.',
      },
    },
    {
      title: { zh: '讲师的否定句用来排除选项', en: 'Use negations to remove options' },
      body: {
        zh: '三道单选的干扰项常在否定句中出现：微生物不直接调色、不保持原料生的，控制条件不为缩短工时、不为阻隔微生物。听到 do not、does not 时，把后面的主张记成被排除的内容。',
        en: 'Distractors for the single questions appear in negations: microbes do not add colour directly or keep food raw, and controls neither shorten shifts nor keep microbes out. When you hear do not or does not, mark the following claim as rejected.',
      },
    },
  ],
};
