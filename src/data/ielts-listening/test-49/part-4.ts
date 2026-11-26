import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 49 · Part 4 — 讲座：植物的防御机制。原创仿真材料，非官方真题。
 *
 * 结构：物理屏障 → 化学物质 → 诱导防御 → 共生合作 → 常见提问 → 实际机制举例 → 环境对比 → 总结。
 * 表格填空 31–34 按四类防御出现顺序排列，单选 35–37 落在概念辨析段，多选 38–40 落在实例段。
 */
export const test49Part4: ListeningLesson = {
  slug: 'test-49-part-4',
  part: 4,
  status: 'published',
  title: { zh: '植物的防御', en: 'Plant defences' },
  summary: {
    zh: '一场关于植物防御的讲座：物理屏障如何用树皮、尖刺和绒毛抵挡啃食者，化学物质如何用苦汁和气味驱离昆虫，诱导防御如何在感知损伤后才启动，以及植物如何通过与蚂蚁、真菌的共生合作换取保护。',
    en: 'A lecture on plant defences: how physical barriers such as bark, thorns and hairs hold off grazers, how chemical substances such as bitter sap and smells repel insects, how induced defences switch on only after damage is detected, and how plants trade food or shelter with ants and fungi in symbiotic partnerships.',
  },
  accent: { zh: '讲师为澳式口音，术语会放慢重复。', en: 'The lecturer has an Australian accent and repeats key terms slowly.' },
  speechRate: '+3%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Defence type', 'Example', 'Note'],
      rows: [
        { lead: 'Physical barrier', cells: [[{ blank: 31 }], [{ text: 'shields the living tissue beneath' }]] },
        { lead: 'Chemical defence', cells: [[{ blank: 32 }], [{ text: 'repels grazers after the first taste' }]] },
        { lead: 'Induced defence', cells: [[{ text: 'produced when ' }, { blank: 33 }, { text: ' is detected' }], [{ text: 'switched on after a real threat' }]] },
        { lead: 'Symbiosis', cells: [[{ blank: 34 }], [{ text: 'live among the leaves and attack invaders' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'What forms the first line of plant defence?',
          options: [
            { key: 'A', text: 'Physical structures such as thorns and bark' },
            { key: 'B', text: 'Poisonous compounds stored in every root' },
            { key: 'C', text: 'Partnerships with insects that live nearby' },
          ],
        },
        {
          number: 36,
          stem: 'Why do induced defences save the plant energy?',
          options: [
            { key: 'A', text: 'They are made only when a threat appears.' },
            { key: 'B', text: 'They replace the need for any physical barrier.' },
            { key: 'C', text: 'They run continuously through the growing season.' },
          ],
        },
        {
          number: 37,
          stem: 'How do symbiotic partnerships help the plant?',
          options: [
            { key: 'A', text: 'The partner protects it in return for food.' },
            { key: 'B', text: 'The partner grows the plant’s leaves for it.' },
            { key: 'C', text: 'The partner removes all chemical reserves.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE defence mechanisms are mentioned in the lecture? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE defence mechanisms are mentioned in the lecture?',
      options: [
        { key: 'A', text: 'sharp thorns along the stems' },
        { key: 'B', text: 'poisonous nectar in every flower' },
        { key: 'C', text: 'bitter sap that repels grazers' },
        { key: 'D', text: 'a tall canopy blocking all sunlight' },
        { key: 'E', text: 'trading nectar with ants that attack herbivores' },
        { key: 'F', text: 'colourful leaves to attract birds' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['bark'], evidence: 6,
      explanation: {
        zh: '定位句 6：Many trees grow tough outer bark, shielding living tissue beneath from frost and fire。物理屏障的例子是树皮；句 8 的 thorns 是另一类物理结构，不是本空答案。',
        en: 'Sentence 6: "Many trees grow tough outer bark, shielding living tissue beneath from frost and fire". The physical example is bark; the thorns in sentence 8 are a separate physical structure, not this answer.',
      },
    },
    {
      number: 32, accepted: ['sap'], evidence: 13,
      explanation: {
        zh: '定位句 13：Bitter sap runs through the stems of certain shrubs, and it repels grazers before they take more than one bite。化学防御的例子是苦汁；句 14 的 oils 是另一种化学物质。',
        en: 'Sentence 13: "Bitter sap runs through the stems of certain shrubs, and it repels grazers before they take more than one bite". The chemical example is bitter sap; the oils in sentence 14 are a different substance.',
      },
    },
    {
      number: 33, accepted: ['damage'], evidence: 19,
      explanation: {
        zh: '定位句 19：the plant produces the response only when damage is detected。诱导防御在检测到损伤后才产生；threat 是句 18 的概括说法，不要填进本空。',
        en: 'Sentence 19: "the plant produces the response only when damage is detected". Induced defence appears only after damage is detected. Threat in sentence 18 is a general summary, not this gap’s word.',
      },
    },
    {
      number: 34, accepted: ['colonies'], evidence: 29,
      explanation: {
        zh: '定位句 29：ant colonies live among the leaves。共生例子是栖居叶间的蚁群；句 31 的 fungus 是另一类共生伙伴。',
        en: 'Sentence 29: "ant colonies live among the leaves". The symbiotic example is the ant colony living among the leaves; the fungus in sentence 31 is another partner.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：It meets attackers before any chemical or partnership can react。第一道防线是物理屏障，在化学物质和合作关系反应之前就挡住啃食者；前文第 6、8 句举了树皮 bark 与刺 thorns，对应 A。根部毒物和邻近昆虫合作都属于后面的层级。',
        en: 'Sentence 36: "It meets attackers before any chemical or partnership can react". The first line is physical, meeting attackers before chemistry or partnership can respond; earlier sentences 6 and 8 give bark and thorns as examples, matching A. Root poisons and insect partnerships belong to later layers.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 39,
      explanation: {
        zh: '定位句 39：Switching the response on after damage keeps that energy in reserve until it is truly required。诱导防御节约能量是因为只在需要时制造；它不能取代物理屏障，也不是全天运行。',
        en: 'Sentence 39: "Switching the response on after damage keeps that energy in reserve until it is truly required". Induced defence saves energy by being made on demand. It does not replace the physical barrier, and it does not run all season.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 41,
      explanation: {
        zh: '定位句 41：A partner lives on or beside the plant over time, and provides something the plant cannot get for itself。共生伙伴长期栖居并提供植物自身得不到的保护，对应 A。伙伴既不替植物长叶，也不会移除化学储备。',
        en: 'Sentence 41: "A partner lives on or beside the plant over time, and provides something the plant cannot get for itself". A symbiotic partner stays over time and supplies what the plant cannot get alone, matching A. The partner does not grow the leaves or remove chemical reserves.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 44,
      explanation: {
        zh: '定位句 44：A rose stem shows the physical layer through its thorns, which stop larger grazers。尖刺沿茎生长是讲到的机制之一；有毒花蜜在句 48 被明确否定。',
        en: 'Sentence 44: "A rose stem shows the physical layer through its thorns, which stop larger grazers". Thorns along the stems are one mechanism mentioned. Poisonous nectar in sentence 48 is explicitly rejected.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 45,
      explanation: {
        zh: '定位句 45：A shrub with bitter sap uses a chemical defence that repels grazers after the first taste。苦汁驱离啃食者是第二项机制；高冠遮光在句 49 被否定为防御手段。',
        en: 'Sentence 45: "A shrub with bitter sap uses a chemical defence that repels grazers after the first taste". Bitter sap repelling grazers is the second mechanism. A tall canopy blocking sunlight in sentence 49 is rejected as a defence.',
      },
    },
    {
      number: 40, accepted: ['E'], evidence: 46,
      explanation: {
        zh: '定位句 46：An acacia that trades nectar with ants running along its branches relies on a symbiotic defence。用花蜜交换攻击食草动物的蚂蚁是第三项机制；彩色叶子在句 49 是吸引传粉者，不是防御。',
        en: 'Sentence 46: "An acacia that trades nectar with ants running along its branches relies on a symbiotic defence". Trading nectar with ants that attack herbivores is the third mechanism. Colourful leaves in sentence 49 attract pollinators, not defenders.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Think of the last time you watched a caterpillar crawl over a leaf.' },
    { speaker: 'lecturer', text: 'The leaf may look helpless, yet plants defend themselves in ways that evolved over millions of years.' },
    { speaker: 'lecturer', text: 'Unlike animals, a plant cannot run away from whatever tries to eat it.' },
    { speaker: 'lecturer', text: 'It must rely on structures, substances and partnerships built into its body.' },
    { speaker: 'lecturer', text: 'We will follow four layers of defence, from the outer surface to partnerships with other species.' },
    { speaker: 'lecturer', text: 'The first layer is physical, the barriers we can see and touch.' },
    { speaker: 'lecturer', text: 'Many trees grow tough outer bark, shielding living tissue beneath from frost and fire.' },
    { speaker: 'lecturer', text: 'Bark cracks and splits with age, so smaller plants rely on other physical tricks.' },
    { speaker: 'lecturer', text: 'Roses and brambles carry thorns along their stems, uncomfortable to bite or brush past.' },
    { speaker: 'lecturer', text: 'Some grasses grow sharp silica particles in their leaves, which wear down grazers’ teeth over time.' },
    { speaker: 'lecturer', text: 'Hairs on the leaf surface trap small insects and block them from reaching softer tissue below.' },
    { speaker: 'lecturer', text: 'A physical barrier works passively. It is there all the time, whether or not an attacker appears.' },
    { speaker: 'lecturer', text: 'The second layer is chemical, substances the plant manufactures to taste bad or harm its attackers.' },
    { speaker: 'lecturer', text: 'Bitter sap runs through the stems of certain shrubs, and it repels grazers before they take more than one bite.' },
    { speaker: 'lecturer', text: 'Some leaves release sharp-smelling oils that mask the plant’s scent and deter insects.' },
    { speaker: 'lecturer', text: 'Nettle hairs inject a mild irritant that stings the skin, a chemical weapon delivered through a physical structure.' },
    { speaker: 'lecturer', text: 'These compounds can also target the animal’s digestion, making the leaf hard to break down once eaten.' },
    { speaker: 'lecturer', text: 'Chemical defences cost the plant energy to produce, so many keep only a steady low level in reserve.' },
    { speaker: 'lecturer', text: 'The third layer changes this pattern, switching on only when the plant senses a real threat.' },
    { speaker: 'lecturer', text: 'This is what we call induced defence, and the plant produces the response only when damage is detected.' },
    { speaker: 'lecturer', text: 'A leaf already being chewed can send a chemical signal through the rest of the branch.' },
    { speaker: 'lecturer', text: 'Other leaves then raise their own bitter compounds before the insect reaches them.' },
    { speaker: 'lecturer', text: 'Some trees release a scent into the air that calls in predators of the attacking insect.' },
    { speaker: 'lecturer', text: 'The predator arrives, eats the pest, and the plant pays nothing until the threat appeared.' },
    { speaker: 'lecturer', text: 'Induced defences save energy, because the costly chemistry is made only when needed, rather than around the clock.' },
    { speaker: 'lecturer', text: 'They also give the plant flexibility. Different threats call for different responses, and the leaf can adjust its signal.' },
    { speaker: 'lecturer', text: 'This layer has limits. A delayed response cannot save the leaf being eaten at that moment.' },
    { speaker: 'lecturer', text: 'The fourth layer is not inside the plant at all, but a partnership with another living thing.' },
    { speaker: 'lecturer', text: 'These symbiotic partnerships are common in the plant world, and they usually trade food or shelter for protection.' },
    { speaker: 'lecturer', text: 'Acacia trees feed sugary nectar from special glands, and in return ant colonies live among the leaves.' },
    { speaker: 'lecturer', text: 'The ants patrol the branches, attack animals that land on the tree, and cut away climbing vines.' },
    { speaker: 'lecturer', text: 'In some partnerships, a fungus wraps around the plant’s roots and improves its uptake of water and minerals.' },
    { speaker: 'lecturer', text: 'The plant supplies the fungus with leaf sugar, so both gain what they could not manage alone.' },
    { speaker: 'lecturer', text: 'Symbiosis can therefore defend the plant without the plant growing a thorn or brewing a poison itself.' },
    { speaker: 'lecturer', text: 'Having looked at the four layers, let’s consider a few questions students often ask.' },
    { speaker: 'lecturer', text: 'First, why is physical defence called the first line?' },
    { speaker: 'lecturer', text: 'It meets attackers before any chemical or partnership can react, so it surrounds the plant from the start.' },
    { speaker: 'lecturer', text: 'Second, why do induced defences matter for energy budgets?' },
    { speaker: 'lecturer', text: 'Producing bitter compounds around the clock uses sugar the plant could spend on growth and seed.' },
    { speaker: 'lecturer', text: 'Switching the response on after damage keeps that energy in reserve until it is truly required.' },
    { speaker: 'lecturer', text: 'Third, how can we tell a symbiotic partner apart from a simple visitor?' },
    { speaker: 'lecturer', text: 'A partner lives on or beside the plant over time, and provides something the plant cannot get for itself.' },
    { speaker: 'lecturer', text: 'A passing insect that feeds on nectar may never return, and it defends nothing in return.' },
    { speaker: 'lecturer', text: 'Now, a quick look at which mechanisms the plant combines in practice.' },
    { speaker: 'lecturer', text: 'A rose stem shows the physical layer through its thorns, which stop larger grazers from browsing the shoot.' },
    { speaker: 'lecturer', text: 'A shrub with bitter sap uses a chemical defence that repels grazers after the first taste.' },
    { speaker: 'lecturer', text: 'An acacia that trades nectar with ants running along its branches relies on a symbiotic defence.' },
    { speaker: 'lecturer', text: 'Some options people guess do not match anything in the lecture.' },
    { speaker: 'lecturer', text: 'No plant grows poisonous nectar in every flower; nectar brings a partner in.' },
    { speaker: 'lecturer', text: 'A tall canopy does not block all sunlight as a defence, and colourful leaves attract pollinators rather than enemies.' },
    { speaker: 'lecturer', text: 'Real plant defences fall into the layers we examined, with the partnership acting around them.' },
    { speaker: 'lecturer', text: 'We can also compare how these layers appear across environments.' },
    { speaker: 'lecturer', text: 'Plants on open grassland face constant grazing, so they tend to invest heavily in thorns, hairs and tough leaves.' },
    { speaker: 'lecturer', text: 'Trees in dense shade rely more on bark and chemical reserves, since branches are hard to reach from the ground.' },
    { speaker: 'lecturer', text: 'Aquatic plants face insects and fish, defending themselves with softer chemicals released into the water.' },
    { speaker: 'lecturer', text: 'None of these layers guarantees survival, because attackers evolve alongside the plants over long periods.' },
    { speaker: 'lecturer', text: 'A grass that builds harder silica may meet a grazer whose teeth wear more slowly in return.' },
    { speaker: 'lecturer', text: 'The balance between plant and herbivore is what keeps both populations changing together.' },
    { speaker: 'lecturer', text: 'Before we finish, let’s correct one common misunderstanding.' },
    { speaker: 'lecturer', text: 'Plants do not choose a defence the way an animal chooses a route.' },
    { speaker: 'lecturer', text: 'Their responses are shaped by generations of evolution, not by a decision made on the day of attack.' },
    { speaker: 'lecturer', text: 'Still, when you next walk past a hedge, notice the thorns, the hairs and the bitter smell.' },
    { speaker: 'lecturer', text: 'Each one is a record of the struggles plants have survived over millions of years.' },
    { speaker: 'lecturer', text: 'Next week we will look at how farmers use these natural defences in modern crop protection.' },
    { speaker: 'lecturer', text: 'That concludes the talk. I hope the examples were useful.' },
  ],
  vocabulary: [
    {
      term: 'barrier', phonetic: '/ˈbæriə/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '屏障，阻隔结构', en: 'a physical structure that blocks or slows an attacker' },
      usage: { zh: '可数；physical barrier、outer barrier。', en: 'Countable: physical barrier, outer barrier.' },
      collocations: ['a physical barrier', 'the barriers we can see', 'a protective barrier'],
      example: { en: 'The first layer is the physical barriers we can see and touch.', zh: '第一层是可见可触的物理屏障。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /riə/ 轻读。', en: 'Two syllables with stress on the first; the ending /riə/ is weak.' },
    },
    {
      term: 'bark', phonetic: '/bɑːk/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '树皮', en: 'the tough outer covering of a tree trunk' },
      usage: { zh: '不可数；outer bark、bark cracks。', en: 'Uncountable: outer bark, bark cracks.' },
      collocations: ['outer bark', 'tough bark', 'the bark shields'],
      example: { en: 'The tough outer bark shields the living tissue beneath.', zh: '坚韧的外层树皮保护着内部活组织。' },
      listening: { zh: '单音节，长元音 /ɑː/；与 bar 区分，结尾 /k/ 要读出。', en: 'One syllable with long /ɑː/; keep the final /k/.' },
    },
    {
      term: 'sap', phonetic: '/sæp/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '植物汁液，树汁', en: 'the liquid that carries food through a plant’s stems' },
      usage: { zh: '不可数；bitter sap、sap runs through。', en: 'Uncountable: bitter sap, sap runs through.' },
      collocations: ['bitter sap', 'the sap runs through', 'sap repels grazers'],
      example: { en: 'Bitter sap repels grazers before they take another bite.', zh: '苦汁在啃食者再咬一口之前将其驱离。' },
      listening: { zh: '单音节，短元音 /æ/；与 zip、map 同韵。', en: 'One syllable with short /æ/, rhyming with map.' },
    },
    {
      term: 'induced', phonetic: '/ɪnˈdjuːst/', partOfSpeech: 'adj.', sentenceIndex: 19,
      meaning: { zh: '诱导的，受触发才产生的（induced defence 诱导防御）', en: 'switched on only after a stimulus or damage appears' },
      usage: { zh: '形容词；induced defence、induced response。动词 induce。', en: 'Adjective: induced defence. The verb is induce.' },
      collocations: ['induced defence', 'the induced response', 'induced chemistry'],
      example: { en: 'The induced defence appears only when damage is detected.', zh: '诱导防御在检测到损伤后才出现。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈdjuː/；结尾 /st/ 清辅音。', en: 'Two syllables with stress on the second; the ending /st/ is voiceless.' },
    },
    {
      term: 'symbiotic', phonetic: '/ˌsɪmbaɪˈɒtɪk/', partOfSpeech: 'adj.', sentenceIndex: 28,
      meaning: { zh: '共生的', en: 'in a partnership where two species live together and both benefit' },
      usage: { zh: '形容词；symbiotic partnership、symbiotic defence。名词 symbiosis。', en: 'Adjective: symbiotic partnership. The noun is symbiosis.' },
      collocations: ['symbiotic partnership', 'a symbiotic defence', 'symbiotic relationship'],
      example: { en: 'Symbiotic partnerships trade food or shelter for protection.', zh: '共生合作用食物或栖息换取保护。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈɒ/；开头 /sɪm/ 轻读。', en: 'Four syllables with stress on the third; the opening /sɪm/ is weak.' },
    },
    {
      term: 'colonies', phonetic: '/ˈkɒləniz/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '群落，群体（ant colonies 蚁群）', en: 'groups of insects or animals living and working together' },
      usage: { zh: '复数；单数 colony；ant colonies、a colony of ants。', en: 'Plural of colony: ant colonies.' },
      collocations: ['ant colonies', 'live among the leaves', 'an insect colony'],
      example: { en: 'Ant colonies live among the leaves and patrol the branches.', zh: '蚁群栖居叶间并在枝条上巡逻。' },
      listening: { zh: '三个音节，重音在第一音节；结尾 /niz/ 读作 /niz/。', en: 'Three syllables with stress on the first; the ending is /niz/.' },
    },
    {
      term: 'predator', phonetic: '/ˈpredətə/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '捕食者', en: 'an animal that hunts and eats other animals' },
      usage: { zh: '可数；predator of the insect、call in predators。反义词 prey。', en: 'Countable: predator of the insect. The opposite is prey.' },
      collocations: ['predators of the pest', 'call in a predator', 'the predator arrives'],
      example: { en: 'Some trees release a scent that calls in predators of the insect.', zh: '有些树释放气味，招来昆虫的捕食者。' },
      listening: { zh: '三个音节，重音在第一音节；结尾 /tə/ 不卷舌。', en: 'Three syllables with stress on the first; the ending /tə/ is non-rhotic.' },
    },
  ],
  expressions: [
    {
      phrase: 'run away', sentenceIndex: 2,
      meaning: { zh: '逃走，跑开', en: 'to escape by running from a threat' },
      usage: { zh: '不及物短语动词；run away from something。', en: 'Intransitive: run away from something.' },
      example: { en: 'A plant cannot run away from whatever tries to eat it.', zh: '植物无法从啃食者面前逃走。' },
    },
    {
      phrase: 'in reserve', sentenceIndex: 17,
      meaning: { zh: '储备着，留作备用', en: 'kept ready for use rather than spent straight away' },
      usage: { zh: '作状语；keep a low level in reserve、hold something in reserve。', en: 'Adverbial: keep something in reserve.' },
      example: { en: 'Many plants keep only a low chemical level in reserve.', zh: '许多植物只保留少量化学物质作储备。' },
    },
    {
      phrase: 'around the clock', sentenceIndex: 24,
      meaning: { zh: '全天候，不停地', en: 'continuously, day and night, without a break' },
      usage: { zh: '作状语；run around the clock、work around the clock。', en: 'Adverbial: run around the clock.' },
      example: { en: 'Induced chemistry is made only when needed, not around the clock.', zh: '诱导化学物质只在需要时制造，并非全天运行。' },
    },
    {
      phrase: 'in return', sentenceIndex: 29,
      meaning: { zh: '作为回报', en: 'in exchange for something given or done' },
      usage: { zh: '作状语；in return for food、pay nothing in return。', en: 'Adverbial: in return for food.' },
      example: { en: 'The tree feeds nectar, and ant colonies live there in return.', zh: '树提供花蜜，蚁群作为回报栖居其上。' },
    },
    {
      phrase: 'trade food or shelter', sentenceIndex: 28,
      meaning: { zh: '用食物或栖息作为交换', en: 'to give food or shelter in exchange for protection' },
      usage: { zh: '后接 for protection；trade A for B 结构。', en: 'Follow with for protection; the pattern is trade A for B.' },
      example: { en: 'Symbiotic partnerships trade food or shelter for protection.', zh: '共生合作用食物或栖息换取保护。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题按四类防御定位', en: 'Locate the four defence layers for the table' },
      body: {
        zh: '第 31–34 题的表格按物理、化学、诱导、共生四层顺序排列。听前把四行分别标注成结构、物质、触发、合作；听到 bark、sap、damage、colonies 时直接填对应行，不要把真菌填进蚁群那一行。',
        en: 'The table in items 31 to 34 follows physical, chemical, induced and symbiotic layers. Label the rows structure, substance, trigger and partnership before listening, and fill bark, sap, damage and colonies in their rows. Do not put the fungus in the ant colony row.',
      },
    },
    {
      title: { zh: '概念题抓定义句', en: 'Catch the definition sentence for concept items' },
      body: {
        zh: '第 35–37 题考四层防御的概念。first line、save energy、trade food or shelter for protection 这类定义句直接对应选项；被否定的说法（取代屏障、全天运行、替长叶子）往往就是干扰项。',
        en: 'Items 35 to 37 test the four concepts. Definition phrases such as first line, save energy and trade food or shelter for protection match the options directly. Rejected claims like replacing the barrier, running all season or growing leaves for the plant are the distractors.',
      },
    },
    {
      title: { zh: '实例题对应到防御层级', en: 'Match examples back to their defence layer' },
      body: {
        zh: '第 38–40 题在实例段出选项：thorns 对应物理层，bitter sap 对应化学层，ants 对应共生层。讲座还专门点出 poisonous nectar、blocking sunlight、colourful leaves 不属于防御，这些即干扰项。',
        en: 'Items 38 to 40 sit in the examples section: thorns are physical, bitter sap is chemical, and ants are symbiotic. The lecture explicitly names poisonous nectar, blocking sunlight and colourful leaves as non-defences, and those are the distractors.',
      },
    },
  ],
};
