import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 26 · Part 4 — 城市农业（单人讲座，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：城市农业范围 → 屋顶农场承重 → 社区农场租地 → 土壤污染检测 → 雨水收集 →
 * 产量条件 → 政策支持 → 复盘单选（37–40）。笔记填空 31–36 在前半与中段。
 */
export const test26Part4: ListeningLesson = {
  slug: 'test-26-part-4',
  part: 4,
  status: 'published',
  title: { zh: '城市农业', en: 'Urban farming' },
  summary: {
    zh: '讲座介绍城市农业两种主要形式：屋顶农场对承重结构的要求，社区农场按季节出租小块园地；讲土壤污染检测、清洁客土、雨水收集灌溉、产量受光照与降水影响的条件，以及市政补贴与短租政策，并复盘屋顶选址、老土风险、园地划分与政策内容。',
    en: 'The lecture covers rooftop farms and community plots: structural load requirements, seasonal plot rental, soil contamination tests, clean imported topsoil, rainwater irrigation, how sunlight and rainfall shape yields, and council grants with short leases. The recap covers roof siting, old soil risk, plot division and policy support.',
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
        { lead: 'Rooftop farms need a strong', cells: [[{ blank: 31 }, { text: ' that carries the load' }]] },
        { lead: 'Community farm members rent small', cells: [[{ blank: 32 }]] },
        { lead: 'Soil must be tested for', cells: [[{ blank: 33 }, { text: ' before planting' }]] },
        { lead: 'Collected rainwater waters the', cells: [[{ blank: 34 }]] },
        { lead: 'Yields depend on sunlight and', cells: [[{ blank: 35 }]] },
        { lead: 'Local councils offer small', cells: [[{ blank: 36 }, { text: ' for growing groups' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'Why are rooftop farms limited to certain buildings?',
          options: [
            { key: 'A', text: 'Only their frames can carry the added load' },
            { key: 'B', text: 'They lack space for visitor parking' },
            { key: 'C', text: 'The roof cannot be made waterproof' },
          ],
        },
        {
          number: 38,
          stem: 'What risk does old city soil carry?',
          options: [
            { key: 'A', text: 'It stays too wet for most crops' },
            { key: 'B', text: 'Contamination from earlier industry' },
            { key: 'C', text: 'It contains too many large stones' },
          ],
        },
        {
          number: 39,
          stem: 'How do community farms split the land?',
          options: [
            { key: 'A', text: 'By rotating all members between shared beds' },
            { key: 'B', text: 'Into flower borders kept by the council' },
            { key: 'C', text: 'Into individual plots rented by the season' },
          ],
        },
        {
          number: 40,
          stem: 'What does local policy mainly provide?',
          options: [
            { key: 'A', text: 'Grants and short leases for growing groups' },
            { key: 'B', text: 'Free housing on every farm site' },
            { key: 'C', text: 'Paid wholesale contracts with supermarkets' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['structure'], evidence: 5,
      explanation: {
        zh: '定位句 5：Rooftop farms therefore need a strong structure that can carry an extra load through the year。屋顶农场需要能承重的坚固结构，填 structure；句 6 的 beams and waterproof layer 是结构检查项，不是答案词。',
        en: 'Sentence 5: "Rooftop farms therefore need a strong structure that can carry an extra load", so fill structure. Beams and the waterproof layer in sentence 6 are checked parts, not the answer word.',
      },
    },
    {
      number: 32, accepted: ['plots'], evidence: 9,
      explanation: {
        zh: '定位句 9：Members rent small plots and decide what to grow on their own patch。成员出租小块园地，填 plots；句 10 的 tool shed 是共享设施，不是租赁地块。',
        en: 'Sentence 9: "Members rent small plots and decide what to grow on their own patch", so fill plots. The tool shed in sentence 10 is shared equipment, not the rented land.',
      },
    },
    {
      number: 33, accepted: ['contaminants'], evidence: 14,
      explanation: {
        zh: '定位句 14：Before planting, the soil must be tested for contaminants that would harm eaters。种植前须检测污染物，填 contaminants；句 13 的 lead 是污染物举例，不是检测类别。',
        en: 'Sentence 14: "the soil must be tested for contaminants that would harm eaters", so fill contaminants. Lead in sentence 13 is an example pollutant, not the test category.',
      },
    },
    {
      number: 34, accepted: ['crops'], evidence: 19,
      explanation: {
        zh: '定位句 19：That collected rainwater is used to water the crops through the dry weeks。收集的雨水用来浇灌作物，填 crops；句 20 的 mains water 是备用水源。',
        en: 'Sentence 19: "That collected rainwater is used to water the crops through the dry weeks", so fill crops. Mains water in sentence 20 is the backup supply.',
      },
    },
    {
      number: 35, accepted: ['rainfall'], evidence: 22,
      explanation: {
        zh: '定位句 22：Yields depend on sunlight and rainfall, since shade cuts the growing season。产量取决于光照与降水，填 rainfall；句 23 的 wind and soil depth 是其它影响因素。',
        en: 'Sentence 22: "Yields depend on sunlight and rainfall, since shade cuts the growing season", so fill rainfall. Wind and soil depth in sentence 23 are other factors.',
      },
    },
    {
      number: 36, accepted: ['grants'], evidence: 29,
      explanation: {
        zh: '定位句 29：Local councils offer small grants that cover soil tests, tools and raised bed timber。市政提供小额补贴，填 grants；句 30 的 token rent 是土地租赁方式，不是补贴本身。',
        en: 'Sentence 29: "Local councils offer small grants that cover soil tests, tools and raised bed timber", so fill grants. The token rent in sentence 30 is a lease arrangement, not the subsidy.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 40,
      explanation: {
        zh: '定位句 40：only their frames can carry the added load。屋顶农场限于特定建筑是因为只有这些框架能承受附加荷载，对应 A。停车空间与防水能力均未提及。',
        en: 'Sentence 40: "only their frames can carry the added load", matching A. Parking space and waterproofing are not mentioned.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 42,
      explanation: {
        zh: '定位句 42：The old city soil carries a real risk of contamination from earlier industry。老城区土壤有早年工业污染风险，对应 B。过湿与石块过多不是讲座所述风险。',
        en: 'Sentence 42: "The old city soil carries a real risk of contamination from earlier industry", matching B. Waterlogging and stones are not the stated risks.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 44,
      explanation: {
        zh: '定位句 44：Community farms split the land into individual plots that members rent by the season。社区农场把土地分成按季出租的独立小块，对应 C。',
        en: 'Sentence 44: "Community farms split the land into individual plots that members rent by the season", matching C.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 46,
      explanation: {
        zh: '定位句 46：Local policy mainly provides grants and short leases, not free land for every group。地方政策主要提供补贴与短租，对应 A。免费住房与超市批发合同均未提及。',
        en: 'Sentence 46: "Local policy mainly provides grants and short leases, not free land for every group", matching A. Free housing and supermarket wholesale contracts are not mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Across the city, vegetables are now grown on rooftops and in empty lots that once looked useless.' },
    { speaker: 'lecturer', text: 'Urban farming covers any food grown inside town boundaries, from balcony pots to shared plots.' },
    { speaker: 'lecturer', text: 'It raises fresh produce close to consumers and turns neglected land into productive green space.' },
    { speaker: 'lecturer', text: 'The first type we will look at is the rooftop farm.' },
    { speaker: 'lecturer', text: 'A roof must hold the weight of soil, plants and staff before any bed goes up.' },
    { speaker: 'lecturer', text: 'Rooftop farms therefore need a strong structure that can carry an extra load through the year.' },
    { speaker: 'lecturer', text: 'Engineers check the beams and the waterproof layer before the first planter arrives.' },
    { speaker: 'lecturer', text: 'Wind on high buildings dries the plants fast, so beds are sheltered by low walls or screens.' },
    { speaker: 'lecturer', text: 'The second type is the community farm, set on disused ground within the suburb.' },
    { speaker: 'lecturer', text: 'Members rent small plots and decide what to grow on their own patch.' },
    { speaker: 'lecturer', text: 'A shared tool shed and water tap serve everyone on the site.' },
    { speaker: 'lecturer', text: 'Community farms also run workshops for children and new gardeners each season.' },
    { speaker: 'lecturer', text: 'Soil in the city cannot be trusted at first sight.' },
    { speaker: 'lecturer', text: 'Old lots may hold lead or other contaminants from past industry and traffic.' },
    { speaker: 'lecturer', text: 'Before planting, the soil must be tested for contaminants that would harm eaters.' },
    { speaker: 'lecturer', text: 'Where the native ground is unsafe, farms import clean topsoil in raised beds.' },
    { speaker: 'lecturer', text: 'Raised beds also drain better than compacted soil left between old buildings.' },
    { speaker: 'lecturer', text: 'Water supply is the next practical question.' },
    { speaker: 'lecturer', text: 'Many farms collect rainwater from roofs and shed surfaces in covered tanks.' },
    { speaker: 'lecturer', text: 'That collected rainwater is used to water the crops through the dry weeks.' },
    { speaker: 'lecturer', text: 'Mains water remains a backup when the tanks run low in summer.' },
    { speaker: 'lecturer', text: 'A farm’s output is not decided by space alone.' },
    { speaker: 'lecturer', text: 'Yields depend on sunlight and rainfall, since shade cuts the growing season.' },
    { speaker: 'lecturer', text: 'Wind, soil depth and how often the bed is weeded also affect the harvest.' },
    { speaker: 'lecturer', text: 'Some sites grow herbs and salad leaves, which sell well at the local market.' },
    { speaker: 'lecturer', text: 'Others keep fruit bushes that take several years before they bear much.' },
    { speaker: 'lecturer', text: 'City farmers often sell directly at the gate or through a weekly box scheme.' },
    { speaker: 'lecturer', text: 'Small routes deliver bags to nearby streets rather than a long wholesale chain.' },
    { speaker: 'lecturer', text: 'Policy now supports these projects in several ways.' },
    { speaker: 'lecturer', text: 'Local councils offer small grants that cover soil tests, tools and raised bed timber.' },
    { speaker: 'lecturer', text: 'Some lease vacant land to groups for a token rent over a fixed period.' },
    { speaker: 'lecturer', text: 'Councils also publish simple rules for water use and shared plot access.' },
    { speaker: 'lecturer', text: 'Planning rules were once a barrier, because roofs were valued only for storage.' },
    { speaker: 'lecturer', text: 'Today several buildings keep a farm as part of their public green commitment.' },
    { speaker: 'lecturer', text: 'Volunteers bring labour, while the council covers insurance and basic fencing.' },
    { speaker: 'lecturer', text: 'Schools use adjacent plots to show where food comes from each term.' },
    { speaker: 'lecturer', text: 'A common worry is that urban farms take land away from housing.' },
    { speaker: 'lecturer', text: 'Most schemes use roof space or lots too small for a standard building.' },
    { speaker: 'lecturer', text: 'Where a site does sit on developable land, its future must be reviewed openly.' },
    { speaker: 'lecturer', text: 'Now let me review the main points before discussion.' },
    { speaker: 'lecturer', text: 'Rooftop farms are limited to certain buildings because only their frames can carry the added load.' },
    { speaker: 'lecturer', text: 'A weak roof would crack under wet soil and foot traffic, so engineers approve each site first.' },
    { speaker: 'lecturer', text: 'The old city soil carries a real risk of contamination from earlier industry.' },
    { speaker: 'lecturer', text: 'That is why a test precedes any edible planting in the ground.' },
    { speaker: 'lecturer', text: 'Community farms split the land into individual plots that members rent by the season.' },
    { speaker: 'lecturer', text: 'Shared paths and tools sit between the private patches rather than dividing the plots.' },
    { speaker: 'lecturer', text: 'Local policy mainly provides grants and short leases, not free land for every group.' },
    { speaker: 'lecturer', text: 'The council does not run the farm itself; members organise the work and the harvest.' },
    { speaker: 'lecturer', text: 'Records from the last decade show a slow rise in city growing sites.' },
    { speaker: 'lecturer', text: 'The next likely expansion is along disused railway corridors close to stations.' },
    { speaker: 'lecturer', text: 'Harvest figures are still small compared with suburban market gardens.' },
    { speaker: 'lecturer', text: 'Even so, city farms shorten the food chain and teach practical skills locally.' },
    { speaker: 'lecturer', text: 'Next week we will look at how urban farms manage compost across the town.' },
  ],
  vocabulary: [
    {
      term: 'rooftop', phonetic: '/ˈruːftɒp/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '屋顶（平台）', en: 'the flat or open top of a building' },
      usage: { zh: '可数；rooftop farm、on the rooftop。', en: 'Countable: rooftop farm, on the rooftop.' },
      collocations: ['a rooftop farm', 'the rooftop garden', 'rooftop growing'],
      example: { en: 'The rooftop farm sits above the city shops.', zh: '屋顶农场在城市商店楼上。' },
      listening: { zh: '复合词，重音在第一部分 /ruːf/。', en: 'A compound with stress on the first part.' },
    },
    {
      term: 'structure', phonetic: '/ˈstrʌktʃə/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '承重结构，建筑框架', en: 'the frame that supports a building’s weight' },
      usage: { zh: '可数；strong structure、building structure。', en: 'Countable: strong structure, building structure.' },
      collocations: ['the building structure', 'a strong structure', 'carry the structure'],
      example: { en: 'The roof structure must carry wet soil.', zh: '屋顶结构必须承受湿土重量。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈstrʌk/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'plots', phonetic: '/plɒts/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '小块园地，地块', en: 'a small piece of land rented for growing' },
      usage: { zh: '可数复数；small plots、garden plot。', en: 'Countable plural: small plots, garden plot.' },
      collocations: ['small plots', 'rented plots', 'individual plots'],
      example: { en: 'Each member works one small plot.', zh: '每位成员种一小块园地。' },
      listening: { zh: '单音节，与 lot 押韵，词尾 /ts/。', en: 'One syllable rhyming with lot, final /ts/.' },
    },
    {
      term: 'contaminants', phonetic: '/kənˈtæmɪnənts/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '污染物，有害杂质', en: 'substances that make soil unsafe to grow food in' },
      usage: { zh: '可数复数；test for contaminants。动词 contaminate。', en: 'Countable plural: test for contaminants; the verb is contaminate.' },
      collocations: ['soil contaminants', 'test for contaminants', 'industrial contaminants'],
      example: { en: 'The soil is tested for contaminants first.', zh: '土壤先做污染物检测。' },
      listening: { zh: '重音在第二音节 /ˈtæm/，词尾 /nts/。', en: 'Stress the second syllable; the final /nts/ is clear.' },
    },
    {
      term: 'rainfall', phonetic: '/ˈreɪnfɔːl/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '降水，降雨量', en: 'the amount of rain that reaches the land' },
      usage: { zh: '不可数；sunlight and rainfall、annual rainfall。', en: 'Uncountable: sunlight and rainfall, annual rainfall.' },
      collocations: ['summer rainfall', 'low rainfall', 'rainfall levels'],
      example: { en: 'Yields follow sunlight and rainfall through the year.', zh: '产量随全年光照与降水变化。' },
      listening: { zh: '复合词，重音在第一部分 /reɪn/。', en: 'A compound with stress on the first part.' },
    },
    {
      term: 'grants', phonetic: '/ɡrɑːnts/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '补贴款，资助金', en: 'money given by the council for a project' },
      usage: { zh: '可数复数；small grants、apply for a grant。', en: 'Countable plural: small grants, apply for a grant.' },
      collocations: ['small grants', 'council grants', 'project grants'],
      example: { en: 'Grants cover soil tests and garden tools.', zh: '补贴覆盖土壤检测与园艺工具。' },
      listening: { zh: '单音节，与 chance 押韵，词尾 /nts/。', en: 'One syllable rhyming with chance, final /nts/.' },
    },
    {
      term: 'compacted', phonetic: '/kəmˈpæktɪd/', partOfSpeech: 'adj.', sentenceIndex: 16,
      meaning: { zh: '板结的，压实的（土壤）', en: 'pressed hard so water drains poorly' },
      usage: { zh: 'compacted soil、compacted ground。动词 compact。', en: 'compacted soil, compacted ground; the verb is compact.' },
      collocations: ['compacted soil', 'compacted ground', 'heavily compacted'],
      example: { en: 'Compacted soil drains worse than raised beds.', zh: '板结土壤排水比高床差。' },
      listening: { zh: '重音在第二音节 /ˈpækt/。', en: 'Stress the second syllable /ˈpækt/.' },
    },
  ],
  expressions: [
    {
      phrase: 'turns neglected land', sentenceIndex: 2,
      meaning: { zh: '把闲置土地改造成……', en: 'to change unused ground into productive space' },
      usage: { zh: 'turn land into something；neglected 修饰 land。', en: 'turn land into something; neglected modifies land.' },
      example: { en: 'Farms turn neglected land into green space.', zh: '农场把闲置土地变成绿地。' },
    },
    {
      phrase: 'goes up', sentenceIndex: 4,
      meaning: { zh: '建起，搭起（种植床）', en: 'to be built or installed on site' },
      usage: { zh: '不及物；the bed goes up、the planter goes up。', en: 'Intransitive: the bed goes up, the planter goes up.' },
      example: { en: 'No bed goes up before the load is checked.', zh: '承重核查前不搭种植床。' },
    },
    {
      phrase: 'sell directly', sentenceIndex: 26,
      meaning: { zh: '直接销售（不经批发商）', en: 'to sell to buyers without a middle chain' },
      usage: { zh: '动词短语；sell directly at the gate、sell directly to locals，指绕过批发环节。', en: 'sell directly at the gate, to locals.' },
      example: { en: 'Farmers sell directly through the box scheme.', zh: '农户通过菜箱计划直销。' },
    },
    {
      phrase: 'take land away', sentenceIndex: 36,
      meaning: { zh: '占用（本可建房的）土地', en: 'to use land that housing might occupy' },
      usage: { zh: '动词短语；take land away from housing、take space away，指挤占建设用地。', en: 'take land away from housing, take space away.' },
      example: { en: 'Farms are said to take land away from housing.', zh: '有人说农场占了建房土地。' },
    },
    {
      phrase: 'precedes any', sentenceIndex: 43,
      meaning: { zh: '先于任何（种植动作）', en: 'to come before any particular action' },
      usage: { zh: 'precede 作动词；precede any planting、precede the harvest。', en: 'Precede is a verb: precede any planting, precede the harvest.' },
      example: { en: 'The test precedes any edible planting.', zh: '检测先于任何食用种植。' },
    },
    {
      phrase: 'short leases', sentenceIndex: 46,
      meaning: { zh: '短期租约', en: 'rental agreements lasting a fixed limited period' },
      usage: { zh: '可数复数；offer short leases、sign short leases。', en: 'Countable plural: offer short leases, sign short leases.' },
      example: { en: 'The council grants short leases to groups.', zh: '市政向团体提供短期租约。' },
    },
  ],
  tips: [
    {
      title: { zh: '按两种农场记笔记', en: 'Note the two farm types separately' },
      body: {
        zh: '讲座先讲屋顶农场的承重与防风，再讲社区农场的租地与共享设施。在笔记上把两类各留一栏，听到 rooftop、community farm 就归入对应栏目，避免把结构要求填进园地空。',
        en: 'The lecture covers rooftop load and wind shelter first, then community plots and shared facilities. Keep a column for each type; route rooftop and community farm notes to the right column so a structural requirement does not slip into a plot blank.',
      },
    },
    {
      title: { zh: '区分风险词与材料词', en: 'Separate risk terms from material terms' },
      body: {
        zh: '同一组语境里既有污染物这类风险词，也有 topsoil、raised beds 这类材料词。先看题干修饰词 tested for、clean、drain，再决定填风险类别还是工程做法。',
        en: 'The same context carries risk terms such as contaminants and material terms such as topsoil and raised beds. Check the modifier in the stem, tested for, clean or drain, before choosing a risk category or engineering method.',
      },
    },
    {
      title: { zh: '复盘段对应单选', en: 'The recap carries the single-choice items' },
      body: {
        zh: '后半段 Now let me review、A weak roof、The old city soil、Community farms split 是对前文复盘，37–40 答案集中在这里。听到总结短语就把注意力转到选项匹配，重点听原因与方式。',
        en: 'The later recap, marked by Now let me review, A weak roof, The old city soil and Community farms split, carries items 37–40. Shift to option matching and listen for reasons and methods.',
      },
    },
  ],
};
