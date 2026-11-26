import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 10 · Part 4 — 讲座：面包的科学（单人）。原创仿真材料，非官方真题。
 *
 * 结构：酵母发酵 → 面筋结构 → 温度控制 → 风味形成；笔记填空按讲座顺序出现，
 * 多选落在决定体积的两个因素两段，单选落在结尾的回顾与判断。
 */
export const test10Part4: ListeningLesson = {
  slug: 'test-10-part-4',
  part: 4,
  status: 'published',
  title: { zh: '面包的科学', en: 'The science of bread' },
  summary: {
    zh: '一场关于面包制作原理的讲座：酵母如何分解糖分产生气体，面筋怎样形成结构锁住气泡，温度如何控制发酵与烘烤，风味怎样在长时间发酵中形成，以及决定面包体积的主要因素。',
    en: 'A lecture on the science of bread: how yeast breaks down sugars to produce gas, how gluten forms a structure that traps bubbles, how temperature controls fermentation and baking, how flavour develops through long proofing, and the main factors that decide loaf volume.',
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
        { lead: 'Yeast releases carbon dioxide and', cells: [[{ blank: 31 }]] },
        { lead: 'The protein in wheat that builds bread structure is', cells: [[{ blank: 32 }]] },
        { lead: 'Kneading develops the gluten into a strong', cells: [[{ blank: 33 }]] },
        { lead: 'Baking kills the', cells: [[{ blank: 34 }, { text: ' in the dough.' }]] },
        { lead: 'Flavour develops through fermentation and long', cells: [[{ blank: 35 }, { text: '.' }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO factors decide the volume of the loaf? Choose TWO letters, A–F.',
      select: 2,
      stem: 'Which TWO factors decide the volume of the loaf?',
      options: [
        { key: 'A', text: 'the amount of water in the dough' },
        { key: 'B', text: 'the colour of the baking tin' },
        { key: 'C', text: 'the strength of the gluten' },
        { key: 'D', text: 'the price of the flour' },
        { key: 'E', text: 'the humidity during proofing' },
        { key: 'F', text: 'the brand of the oven' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 38,
          stem: 'Why does the dough rise more slowly in a cool kitchen?',
          options: [
            { key: 'A', text: 'the yeast becomes less active' },
            { key: 'B', text: 'the gluten hardens quickly' },
            { key: 'C', text: 'the water evaporates' },
          ],
        },
        {
          number: 39,
          stem: 'What happens when the oven is too hot at the start?',
          options: [
            { key: 'A', text: 'the crust forms before the crumb expands' },
            { key: 'B', text: 'the yeast dies too slowly' },
            { key: 'C', text: 'the gluten becomes too stretchy' },
          ],
        },
        {
          number: 40,
          stem: 'Where does the flavour of wholemeal bread mainly come from?',
          options: [
            { key: 'A', text: 'seeds added on top of the loaf' },
            { key: 'B', text: 'the bran breaking down during long fermentation' },
            { key: 'C', text: 'extra salt mixed into the dough' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['alcohol'], evidence: 4,
      explanation: {
        zh: '定位句 4：as it breaks them down it releases carbon dioxide and alcohol。酵母分解糖分同时放出二氧化碳和酒精；句 5 的 fermented smell 是酒精带来的气味，不是答案。',
        en: 'Sentence 4: "as it breaks them down it releases carbon dioxide and alcohol". Yeast releases carbon dioxide and alcohol. The fermented smell in sentence 5 comes from the alcohol, but it is not the answer.',
      },
    },
    {
      number: 32, accepted: ['gluten'], evidence: 8,
      explanation: {
        zh: '定位句 8：the protein in wheat, called gluten。小麦中构成面包结构的蛋白就是 gluten；句 9 讲它遇水形成，不填进本空。',
        en: 'Sentence 8: "the protein in wheat, called gluten". The wheat protein that builds the structure is gluten. Sentence 9 describes how it forms with water, but it does not fill this gap.',
      },
    },
    {
      number: 33, accepted: ['network'], evidence: 10,
      explanation: {
        zh: '定位句 10：Kneading the dough works the gluten into a strong network that traps the bubbles。揉面把面筋发展成结实的网络；句 11 的 loaf’s shape 是网络的作用，不是答案。',
        en: 'Sentence 10: "Kneading the dough works the gluten into a strong network that traps the bubbles". Kneading develops a strong network. The loaf’s shape in sentence 11 is what the network does, not the answer.',
      },
    },
    {
      number: 34, accepted: ['yeast'], evidence: 20,
      explanation: {
        zh: '定位句 20：Baking also kills the yeast once the dough has set。烘烤在面团定型后杀死酵母，发酵随之停止；空后已印 in the dough。',
        en: 'Sentence 20: "Baking also kills the yeast once the dough has set". Baking kills the yeast after the dough sets, and fermentation stops. In the dough is already printed.',
      },
    },
    {
      number: 35, accepted: ['proofing'], evidence: 23,
      explanation: {
        zh: '定位句 23：it develops during fermentation and through long proofing。风味来自发酵和长时间醒发；spices 在句 23 被说不是主要来源。',
        en: 'Sentence 23: "it develops during fermentation and through long proofing". Flavour comes from fermentation and long proofing. Spices are said not to be the main source in the same sentence.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：One factor is the amount of water in the dough. A wetter dough stretches more easily and holds more gas。水量是决定体积的第一因素，对应 A。',
        en: 'Sentence 27: "One factor is the amount of water in the dough. A wetter dough stretches more easily and holds more gas". Water amount is the first factor, matching A.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 28,
      explanation: {
        zh: '定位句 28：The second main factor is the strength of the gluten。面筋强度是第二因素，对应 C。烤盘颜色、烤箱品牌在句 29 被归为次要细节，湿度在句 30 次于水和面筋。',
        en: 'Sentence 28: "The second main factor is the strength of the gluten". Gluten strength is the second factor, matching C. Tin colour and oven brand are called secondary in sentence 29, and humidity ranks below water and gluten in sentence 30.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 45,
      explanation: {
        zh: '定位句 45：the yeast becomes inactive enough to slow the rise, rather than the gluten hardening or the water drying up。冷厨房里酵母活性下降导致发酵变慢，对应 A。B、C 是句中明确排除的另两种解释。',
        en: 'Sentence 45: "the yeast becomes inactive enough to slow the rise, rather than the gluten hardening or the water drying up". The yeast becoming less active slows the rise, matching A. B and C are the explanations explicitly ruled out in the sentence.',
      },
    },
    {
      number: 39, accepted: ['A'], evidence: 46,
      explanation: {
        zh: '定位句 46：An oven that is too hot seals the crust early, so the crumb cannot expand fully。炉温过高会提前结壳，内部来不及膨胀，对应 A。B 说酵母死得慢、C 说面筋过松，都与原文相反。',
        en: 'Sentence 46: "An oven that is too hot seals the crust early, so the crumb cannot expand fully". A too-hot oven sets the crust early, matching A. B claims the yeast dies slowly and C claims over-stretchy gluten; both contradict the lecture.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 47,
      explanation: {
        zh: '定位句 47：Wholemeal flavour comes from the bran breaking down during long fermentation, not mainly from seeds added on top。全麦风味来自麸皮在长时间发酵中分解，对应 B。顶部种子和额外加盐都不是主要来源。',
        en: 'Sentence 47: "Wholemeal flavour comes from the bran breaking down during long fermentation, not mainly from seeds added on top". Wholemeal flavour comes from the bran during long fermentation, matching B. Seeds on top and extra salt are not the main source.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'In the cool room behind the bakery, a single lump of dough can double in size before it ever touches the oven.' },
    { speaker: 'lecturer', text: 'Today’s lecture looks at bread, the simplest staple in our kitchens, and the science behind what happens while it rises and bakes.' },
    { speaker: 'lecturer', text: 'We will cover how yeast feeds the dough, how gluten builds the structure, how temperature controls the process, and where the flavour comes from.' },
    { speaker: 'lecturer', text: 'Start with the yeast, which is a living fungus added to nearly every loaf.' },
    { speaker: 'lecturer', text: 'Yeast feeds on the sugars in the flour, and as it breaks them down it releases carbon dioxide and alcohol.' },
    { speaker: 'lecturer', text: 'The carbon dioxide forms tiny bubbles that spread through the dough, and the alcohol gives off a faint fermented smell.' },
    { speaker: 'lecturer', text: 'Without this gas, the bread would stay a heavy flat mass, because there would be nothing to lift it.' },
    { speaker: 'lecturer', text: 'Yeast needs warmth and moisture to feed, and it works through the sugars already present in the flour.' },
    { speaker: 'lecturer', text: 'The second ingredient we need to understand is the protein in wheat, called gluten.' },
    { speaker: 'lecturer', text: 'Gluten forms when flour mixes with water, and it stretches around the gas bubbles instead of letting them escape.' },
    { speaker: 'lecturer', text: 'Kneading the dough works the gluten into a strong network that traps the bubbles inside.' },
    { speaker: 'lecturer', text: 'This network also holds the loaf’s shape after the bubbles are set by heat.' },
    { speaker: 'lecturer', text: 'If the gluten is weak, the bubbles escape early, and the loaf ends up dense rather than light.' },
    { speaker: 'lecturer', text: 'Different wheat varieties contain different amounts of this protein, which is why some flours rise better.' },
    { speaker: 'lecturer', text: 'Now temperature, which controls how quickly all of this happens.' },
    { speaker: 'lecturer', text: 'Yeast works fastest in a warm room, around twenty-four degrees, and it slows as the kitchen gets cooler.' },
    { speaker: 'lecturer', text: 'In a cool kitchen the yeast becomes less active, so the dough rises slowly and may need a longer rest.' },
    { speaker: 'lecturer', text: 'The oven then finishes the work. Early heat expands the remaining gas, and the crust begins to set.' },
    { speaker: 'lecturer', text: 'If the oven is too hot at the start, the crust forms before the crumb has finished expanding.' },
    { speaker: 'lecturer', text: 'The inside then stays tight, and the loaf cannot reach its full volume.' },
    { speaker: 'lecturer', text: 'Baking also kills the yeast once the dough has set, so fermentation stops inside the finished bread.' },
    { speaker: 'lecturer', text: 'Moisture in the dough turns to steam, which helps the crumb stay soft, while the outside loses water and browns.' },
    { speaker: 'lecturer', text: 'The steam also keeps the crumb tender, and it leaves small open pockets once the bread cools.' },
    { speaker: 'lecturer', text: 'Finally, flavour. Bread flavour is not added by spices alone, and it develops during fermentation and through long proofing.' },
    { speaker: 'lecturer', text: 'In wholemeal flour, the bran keeps breaking down slowly, and that deepens the nutty taste over a long rest.' },
    { speaker: 'lecturer', text: 'Salt tightens the gluten and slows the yeast, but it does not create the main flavour on its own.' },
    { speaker: 'lecturer', text: 'Let’s look at what decides how large the final loaf becomes.' },
    { speaker: 'lecturer', text: 'One factor is the amount of water in the dough. A wetter dough stretches more easily and holds more gas.' },
    { speaker: 'lecturer', text: 'The second main factor is the strength of the gluten, which depends on the flour and the kneading.' },
    { speaker: 'lecturer', text: 'Other details, such as the tin’s colour or the oven’s brand, have little effect on the volume.' },
    { speaker: 'lecturer', text: 'Humidity during proofing matters for the skin of the loaf, but it is secondary to water and gluten.' },
    { speaker: 'lecturer', text: 'A strong dough can hold the gas for a long proof without leaking out through the skin.' },
    { speaker: 'lecturer', text: 'To sum up what we have covered so far, the yeast produces the gas, the gluten traps it, and the heat sets the crumb.' },
    { speaker: 'lecturer', text: 'A slow rise in a cool room gives the yeast time to develop flavour, even though it takes longer.' },
    { speaker: 'lecturer', text: 'The trade-off for that slow rise is a loaf with a deeper, more rounded taste.' },
    { speaker: 'lecturer', text: 'Let me address a common question. Why does store-bought bread rise so evenly?' },
    { speaker: 'lecturer', text: 'Commercial bakers control temperature and humidity closely, and their dough often rests for a fixed short time.' },
    { speaker: 'lecturer', text: 'Home bakers usually work in less steady conditions, which is why loaves vary more from one day to the next.' },
    { speaker: 'lecturer', text: 'Some home bakers compensate by warming the dough near the oven before it goes in.' },
    { speaker: 'lecturer', text: 'We should also mention that not all bread uses yeast. Flatbreads rely on chemical raising or none at all.' },
    { speaker: 'lecturer', text: 'Their structure comes from the dough itself, and they cook quickly on a hot surface.' },
    { speaker: 'lecturer', text: 'Those breads are thinner and softer, and they do not need a rising stage at all.' },
    { speaker: 'lecturer', text: 'Next week we will compare wheat with other grains, and see why some flours contain too little gluten to make a loaf.' },
    { speaker: 'lecturer', text: 'We will also look at how salt affects the speed of that final rise in that session.' },
    { speaker: 'lecturer', text: 'Before that, let me check a few points from today.' },
    { speaker: 'lecturer', text: 'In a cool kitchen, the yeast becomes inactive enough to slow the rise, rather than the gluten hardening or the water drying up.' },
    { speaker: 'lecturer', text: 'An oven that is too hot seals the crust early, so the crumb cannot expand fully.' },
    { speaker: 'lecturer', text: 'Wholemeal flavour comes from the bran breaking down during long fermentation, not mainly from seeds added on top.' },
    { speaker: 'lecturer', text: 'Keep these three ideas in mind. The gas, the network, and the heat that sets it.' },
    { speaker: 'lecturer', text: 'Thank you for listening, and the reading list is on the course page.' },
  ],
  vocabulary: [
    {
      term: 'yeast', phonetic: '/jiːst/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '酵母（发酵用的活真菌）', en: 'a living fungus that ferments dough and produces gas' },
      usage: { zh: '不可数；fresh yeast、dry yeast、yeast feeds。', en: 'Uncountable: fresh yeast, dry yeast, yeast feeds.' },
      collocations: ['the yeast feeds', 'kill the yeast', 'active yeast'],
      example: { en: 'Yeast needs warmth before it starts to rise the dough.', zh: '酵母需要温暖环境才开始发面。' },
      listening: { zh: '单音节，元音 /iː/，结尾 /st/，与 east 押韵。', en: 'One syllable with /iː/; it rhymes with east.' },
    },
    {
      term: 'alcohol', phonetic: '/ˈælkəhɒl/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '酒精（发酵副产物）', en: 'the substance produced when yeast breaks down sugar' },
      usage: { zh: '不可数；此处指发酵产生的微量酒精，不是饮用酒。', en: 'Uncountable: here it means the trace alcohol from fermentation, not a drink.' },
      collocations: ['releases alcohol', 'faint alcohol', 'alcohol and gas'],
      example: { en: 'Fermentation turns sugar into gas and alcohol.', zh: '发酵把糖分变成气体和酒精。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈæl/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'gluten', phonetic: '/ˈɡluːtn/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '面筋（小麦中的结构蛋白）', en: 'the wheat protein that gives dough its stretch and structure' },
      usage: { zh: '不可数；gluten network、weak gluten、gluten strength。', en: 'Uncountable: a gluten network, weak gluten, gluten strength.' },
      collocations: ['the gluten forms', 'strong gluten', 'gluten strength'],
      example: { en: 'Bread flour is chosen for its high gluten content.', zh: '面包粉因面筋含量高而被选用。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɡluː/，结尾 /tn/。', en: 'Two syllables with first-syllable stress; the ending is /tn/.' },
    },
    {
      term: 'network', phonetic: '/ˈnetwɜːk/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '网络（面筋交织成的结构）', en: 'the interwoven structure that traps gas in the dough' },
      usage: { zh: '可数；strong network、gluten network。日常也指人际或通信网络。', en: 'Countable: a strong network, a gluten network. It also means a social or communication network.' },
      collocations: ['a strong network', 'the gluten network', 'a network that traps'],
      example: { en: 'The kneading builds a network around each bubble.', zh: '揉面在每个气泡周围形成网络。' },
      listening: { zh: '复合词，两个音节都重读。', en: 'A compound with stress on both halves.' },
    },
    {
      term: 'crumb', phonetic: '/krʌm/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '面包瓤，面包内部组织', en: 'the soft inner part of a loaf, as opposed to the crust' },
      usage: { zh: '不可数；soft crumb、the crumb expands。crust 是外皮。', en: 'Uncountable: a soft crumb, the crumb expands. The crust is the outer skin.' },
      collocations: ['the crumb expands', 'a soft crumb', 'the crumb stays soft'],
      example: { en: 'Steam keeps the crumb tender while the crust browns.', zh: '蒸汽让瓤保持柔软，外皮上色。' },
      listening: { zh: '单音节，元音 /ʌ/，结尾 b 不发音。', en: 'One syllable with /ʌ/; the final b is silent.' },
    },
    {
      term: 'proofing', phonetic: '/ˈpruːfɪŋ/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '醒发，最后发酵', en: 'the final resting stage when dough rises before baking' },
      usage: { zh: '不可数；long proofing、during proofing。动词 proof 指让面团最后醒发。', en: 'Uncountable: long proofing, during proofing. The verb means to let dough rest.' },
      collocations: ['long proofing', 'during proofing', 'the proofing stage'],
      example: { en: 'A long proofing gives the bread a deeper taste.', zh: '长时间醒发让面包味道更醇厚。' },
      listening: { zh: 'proof 加 ing，两个音节，重音在第一音节。', en: 'Proof plus ing, two syllables with first-syllable stress.' },
    },
    {
      term: 'bran', phonetic: '/bræn/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '麸皮，麦麸', en: 'the outer husk of the wheat grain, kept in wholemeal flour' },
      usage: { zh: '不可数；wheat bran、wholemeal bran。', en: 'Uncountable: wheat bran, wholemeal bran.' },
      collocations: ['the bran breaks down', 'wheat bran', 'the bran deepens the taste'],
      example: { en: 'The bran in wholemeal flour adds a nutty flavour.', zh: '全麦粉里的麸皮带来坚果风味。' },
      listening: { zh: '单音节，元音 /æ/，结尾 /n/。', en: 'One syllable with /æ/ and a final /n/.' },
    },
    {
      term: 'fermentation', phonetic: '/ˌfɜːmenˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '发酵（酵母分解糖分的过程）', en: 'the process in which yeast breaks down sugar and releases gas' },
      usage: { zh: '不可数；during fermentation、slow fermentation。动词 ferment。', en: 'Uncountable: during fermentation, slow fermentation. The verb is ferment.' },
      collocations: ['during fermentation', 'slow fermentation', 'the fermentation stops'],
      example: { en: 'Flavour develops as fermentation continues overnight.', zh: '隔夜发酵过程中风味不断形成。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈteɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
  ],
  expressions: [
    {
      phrase: 'feeds on', sentenceIndex: 4,
      meaning: { zh: '以……为食，靠……供给养分', en: 'to live on and use up a particular substance' },
      usage: { zh: '及物；yeast feeds on sugar、bacteria feed on waste。', en: 'Transitive: yeast feeds on sugar, bacteria feed on waste.' },
      example: { en: 'The yeast feeds on the sugars in the flour.', zh: '酵母以面粉中的糖分为养分。' },
    },
    {
      phrase: 'breaks them down', sentenceIndex: 4,
      meaning: { zh: '分解（物质）', en: 'to split a substance into simpler parts' },
      usage: { zh: '可拆分短语动词；break down sugar、break down the cells。', en: 'A separable phrasal verb: break down sugar, break down the cells.' },
      example: { en: 'Yeast breaks down the sugar into gas and alcohol.', zh: '酵母把糖分分解成气体和酒精。' },
    },
    {
      phrase: 'depends on', sentenceIndex: 28,
      meaning: { zh: '取决于，由……决定', en: 'to be determined by something' },
      usage: { zh: '及物；depends on the flour、depends on the kneading。', en: 'Transitive: depends on the flour, depends on the kneading.' },
      example: { en: 'Gluten strength depends on the flour used.', zh: '面筋强度取决于所用面粉。' },
    },
    {
      phrase: 'on its own', sentenceIndex: 25,
      meaning: { zh: '单独地，单凭自身', en: 'without help from anything else' },
      usage: { zh: '作状语；create flavour on its own、work on its own。', en: 'Adverbial: create flavour on its own, work on its own.' },
      example: { en: 'Salt alone does not give the bread its taste.', zh: '盐本身并不构成面包的味道。' },
    },
    {
      phrase: 'sum up', sentenceIndex: 32,
      meaning: { zh: '总结，概括', en: 'to give a short account of the main points' },
      usage: { zh: '讲座收尾信号；to sum up、sum up the evidence。', en: 'A closing lecture signal: to sum up, sum up the evidence.' },
      example: { en: 'To sum up, the yeast produces the gas and the gluten traps it.', zh: '概括来说，酵母产气，面筋锁气。' },
    },
    {
      phrase: 'rely on', sentenceIndex: 39,
      meaning: { zh: '依靠，依赖', en: 'to depend on something for the result' },
      usage: { zh: '及物；rely on chemical raising、rely on the dough itself。', en: 'Transitive: rely on chemical raising, rely on the dough itself.' },
      example: { en: 'Flatbreads rely on a hot surface rather than yeast.', zh: '薄饼靠热炉面而不是酵母。' },
    },
    {
      phrase: 'breaking down', sentenceIndex: 47,
      meaning: { zh: '逐渐分解（麸皮）', en: 'to decompose slowly during the long rise' },
      usage: { zh: '第三人称 breaks down；the bran breaks down、material breaks down。', en: 'Third person breaks down: the bran breaks down, material breaks down.' },
      example: { en: 'The bran breaks down and deepens the wholemeal taste.', zh: '麸皮分解，让全麦味道更浓。' },
    },
  ],
  tips: [
    {
      title: { zh: '先预测空格词性', en: 'Predict the part of speech' },
      body: {
        zh: '第 31 题空在 and 后，填名词 alcohol；第 32 题空在 is 后，填名词 gluten；第 35 题空在 long 后，填动名词 proofing。听前把词性写在空格旁，听时只等那一类词。',
        en: 'Item 31 needs a noun after and: alcohol. Item 32 follows is, so gluten. Item 35 follows long, so proofing. Note the predicted part of speech beside each gap before listening.',
      },
    },
    {
      title: { zh: '跟着讲座信号词走', en: 'Follow the lecture signposts' },
      body: {
        zh: 'Start with、The second ingredient、Now temperature、Finally、One factor、The second main factor、To sum up 都是段落切换。题目顺序与讲座一致，听到信号词就检查自己填到了哪一空。',
        en: 'Start with, The second ingredient, Now temperature, Finally, One factor, The second main factor and To sum up all mark a new stage. Items follow the lecture order, so check your place after each one.',
      },
    },
    {
      title: { zh: '因素题区分主次', en: 'Separate main factors from details' },
      body: {
        zh: '决定体积的主因素是水量和面筋强度；烤盘颜色、烤箱品牌、醒发湿度都是次要细节。多选题听到 Other details、secondary 这类归类词时，把这些选项排除。',
        en: 'The main volume factors are water and gluten strength; tin colour, oven brand and proofing humidity are secondary. Exclude an option when you hear Other details or secondary.',
      },
    },
  ],
};
