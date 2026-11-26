import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 38 · Part 4 — 古代灌溉（单人讲座，英式口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：水源、水权记录、主栽作物与聚落发展（笔记 31–34）→ 重力输水、分水规则与人口供养
 * （单选 35–37）→ 渠坡、泥板档案与大麦田的特征配对（配对 38–40）。题块顺序与录音一致。
 */
export const test38Part4: ListeningLesson = {
  slug: 'test-38-part-4',
  part: 4,
  status: 'published',
  title: { zh: '古代灌溉', en: 'Ancient irrigation' },
  summary: {
    zh: '讲座梳理早期河域灌溉：渠道从河流引水，水权记入共享登记册，大麦是主要灌溉作物，稳定供水让聚落长成城市。渠道依重力顺坡分级，分水由成文规则与共享记录决定，可靠收成供养更多人口；最后把渠坡、泥板档案与大麦田分别对应到重力渠、水权档案和需持续供水的作物。',
    en: 'The lecture traces early irrigation: channels drew from a river, rights were kept in a shared register, barley was the main crop, and settlements grew into cities. Canals ran on gravity down a graded slope; division followed written rules and records; a reliable harvest fed more people. Matching links slope to gravity canals, tablets to the rights archive, and barley to steady-water crops.',
  },
  accent: { zh: '讲者为英式口音。', en: 'The lecturer speaks with a British accent.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Main water source', cells: [[{ text: 'a ' }, { blank: 31 }]] },
        { lead: 'Water rights recorded in a shared', cells: [[{ blank: 32 }]] },
        { lead: 'Main irrigated crop', cells: [[{ blank: 33 }]] },
        { lead: 'Irrigation let settlements grow into', cells: [[{ blank: 34 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why do the canals carry water without pumps?',
          options: [
            { key: 'A', text: 'water flows downhill under gravity' },
            { key: 'B', text: 'water is lifted by wooden wheels' },
            { key: 'C', text: 'the river flood fills each ditch by hand' },
          ],
        },
        {
          number: 36,
          stem: 'How was water division decided?',
          options: [
            { key: 'A', text: 'by the wealth of the largest landowner' },
            { key: 'B', text: 'by written rules and shared records' },
            { key: 'C', text: 'by an upstream family’s first claim' },
          ],
        },
        {
          number: 37,
          stem: 'What did a reliable harvest allow?',
          options: [
            { key: 'A', text: 'a smaller number of craft workers' },
            { key: 'B', text: 'a population that could leave during dry spells' },
            { key: 'C', text: 'a larger population supported by steady food' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Match each feature with its description. Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'crops that need a steady water supply' },
        { key: 'B', text: 'channels graded to follow gravity down the slope' },
        { key: 'C', text: 'archives keeping records of shared water rights' },
        { key: 'D', text: 'canals dug for navigation between towns' },
        { key: 'E', text: 'reservoirs filled by seasonal floods' },
        { key: 'F', text: 'fields watered by rain only' },
      ],
      items: [
        { number: 38, text: 'slope of the channels' },
        { number: 39, text: 'clay tablets' },
        { number: 40, text: 'barley fields' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['river'], evidence: 3,
      explanation: {
        zh: '定位句 3：Most of these channels drew water from a river, where a low weir raised the level。主水源是河流 river；句 2 的 main channel 是引水渠，不是水源。',
        en: 'Sentence 3: "Most of these channels drew water from a river, where a low weir raised the level". The main source is the river. The main channel in sentence 2 is the ditch, not the source.',
      },
    },
    {
      number: 32, accepted: ['register'], evidence: 8,
      explanation: {
        zh: '定位句 8：Those agreements were written down, so disputes could be settled from a shared register kept near the temple。水权记在共享登记册 register；句 9 的 fines 是违规处罚，不是记录载体。',
        en: 'Sentence 8: "Those agreements were written down, so disputes could be settled from a shared register kept near the temple". Rights are kept in a shared register. Fines in sentence 9 are penalties, not the record.',
      },
    },
    {
      number: 33, accepted: ['barley'], evidence: 13,
      explanation: {
        zh: '定位句 13：Barley was the main crop in many early river valleys, because it stood fairly dry periods。主要灌溉作物是大麦 barley；句 14 的小麦、椰枣和蔬菜是小块地次栽作物。',
        en: 'Sentence 13: "Barley was the main crop in many early river valleys, because it stood fairly dry periods". The main crop is barley. Wheat, dates and vegetables in sentence 14 fill smaller plots.',
      },
    },
    {
      number: 34, accepted: ['cities'], evidence: 16,
      explanation: {
        zh: '定位句 16：irrigation let small farming settlements grow into cities, where craft workers and rulers could live apart from the fields。灌溉促成聚落长成城市 cities；句 17 的 population rise 是城市出现后的结果。',
        en: 'Sentence 16: "irrigation let small farming settlements grow into cities, where craft workers and rulers could live apart from the fields". Settlements grew into cities. The population rise in sentence 17 follows the cities.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 20,
      explanation: {
        zh: '定位句 20：Water flows downhill under gravity, and every canal was graded so the surface fell by a small amount。无泵输水靠重力顺坡，对应 A；木轮提水与手工填沟在录音中未出现。',
        en: 'Sentence 20: "Water flows downhill under gravity, and every canal was graded so the surface fell by a small amount". Pump-free flow relies on gravity, matching A. Wooden wheels and hand filling are not mentioned.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：Rules for division were written rules, and shared records decided how water was split between upstream and downstream plots。分水由成文规则与共享记录决定，对应 B；最大地主财富与上游家族优先权在录音中未出现。',
        en: 'Sentence 27: "Rules for division were written rules, and shared records decided how water was split between upstream and downstream plots". Division follows written rules and records, matching B. Landowner wealth and upstream priority are not mentioned.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 31,
      explanation: {
        zh: '定位句 31：A reliable harvest supported a larger population, which in turn built larger temples, storage rooms and town walls。可靠收成供养更多人口，对应 C；A 的工匠更少与 B 的人口旱季离开在录音中被反向表述。',
        en: 'Sentence 31: "A reliable harvest supported a larger population, which in turn built larger temples, storage rooms and town walls". A steady harvest fed more people, matching C. Fewer craft workers in A and leaving in dry spells in B are reversed.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 40,
      explanation: {
        zh: '定位句 40：The channels were graded to follow gravity down the slope, rather than fighting the land with raised banks。渠道坡度对应按坡度分级的重力渠，选 B。',
        en: 'Sentence 40: "The channels were graded to follow gravity down the slope, rather than fighting the land with raised banks". Channel slope matches gravity canals graded by slope, B.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 42,
      explanation: {
        zh: '定位句 42：They form the archive keeping records of shared water rights across the village and its neighbours。泥板对应保存水权记录的档案，选 C；D 的通航运河与 E 的洪水水库不对应泥板。',
        en: 'Sentence 42: "They form the archive keeping records of shared water rights across the village and its neighbours". Clay tablets match the rights archive, C. Navigation canals in D and flood reservoirs in E do not match tablets.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 44,
      explanation: {
        zh: '定位句 44：These are crops that need a steady water supply through the growing season, unlike plots that wait on rain。大麦田对应需持续供水的作物，选 A；F 的仅靠雨水地块句 44 被排除。',
        en: 'Sentence 44: "These are crops that need a steady water supply through the growing season, unlike plots that wait on rain". Barley fields match crops needing steady water, A. Rain-only plots in F are excluded in sentence 44.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Some of the earliest settled towns grew up beside rivers whose water could be guided onto fields, and that history is our focus today.' },
    { speaker: 'lecturer', text: 'Long before pumps or engines, farmers and rulers had to move water from where it ran to where crops needed it.' },
    { speaker: 'lecturer', text: 'The simplest systems combined a main channel dug along the river bank with smaller side ditches that reached each plot.' },
    { speaker: 'lecturer', text: 'Most of these channels drew water from a river, where a low weir raised the level enough to let the flow leave the bank.' },
    { speaker: 'lecturer', text: 'The weir also slowed the current, so silt settled out before the water entered the main channel.' },
    { speaker: 'lecturer', text: 'Where the land sloped gently, the ditch carried water downhill without any lifting device.' },
    { speaker: 'lecturer', text: 'Farmers opened and closed small gates to send water to one plot at a time, and the gates were checked each morning.' },
    { speaker: 'lecturer', text: 'Over generations, groups of villages had to agree who could take water, and when.' },
    { speaker: 'lecturer', text: 'Those agreements were written down, so disputes could be settled from a shared register kept near the temple or the town hall.' },
    { speaker: 'lecturer', text: 'The register recorded each household’s share, the season for release, and any fines for taking more than the agreed amount.' },
    { speaker: 'lecturer', text: 'In several regions, water rights were inherited like land, and passed from parent to child within the village.' },
    { speaker: 'lecturer', text: 'Records also showed which plots were fed by the main canal and which depended on rainfall alone.' },
    { speaker: 'lecturer', text: 'The crops chosen for irrigated land had to repay the work of digging and maintaining the ditches.' },
    { speaker: 'lecturer', text: 'Barley was the main crop in many early river valleys, because it stood fairly dry periods and could be stored through the season.' },
    { speaker: 'lecturer', text: 'Wheat, dates and vegetables filled smaller plots near the village, where the water was easiest to control.' },
    { speaker: 'lecturer', text: 'Surplus grain meant families did not rely on one year’s rain, and fewer people had to leave during dry spells.' },
    { speaker: 'lecturer', text: 'With steady water supply, irrigation let small farming settlements grow into cities, where craft workers and rulers could live apart from the fields.' },
    { speaker: 'lecturer', text: 'The population could rise because a reliable harvest fed people who did not themselves farm.' },
    { speaker: 'lecturer', text: 'Trade along the rivers carried grain, tools and pottery between towns that shared the same irrigation rules.' },
    { speaker: 'lecturer', text: 'Now let us look at how the channels actually worked on the land.' },
    { speaker: 'lecturer', text: 'Water flows downhill under gravity, and every canal was graded so the surface fell by a small amount over its length.' },
    { speaker: 'lecturer', text: 'If the slope was too steep, the current scoured the bank and washed silt onto the fields, and if it was too flat, water stalled in the ditch.' },
    { speaker: 'lecturer', text: 'Builders set the fall with simple sighting lines and wooden levels, repairing the bed each year after the flood season.' },
    { speaker: 'lecturer', text: 'Channels on the gentlest ground ran in long straight lines, while steeper valleys used short steps and small drops.' },
    { speaker: 'lecturer', text: 'The side ditches branched off the main canal at right angles, so each field received an equal slice of the flow.' },
    { speaker: 'lecturer', text: 'Maintenance was a village duty. Each household sent workers to clear reeds, mud and fallen branches from the ditch line.' },
    { speaker: 'lecturer', text: 'A blocked ditch meant a dry plot, and villagers understood that the whole system failed if one section was neglected.' },
    { speaker: 'lecturer', text: 'Rules for division were written rules, and shared records decided how water was split between upstream and downstream plots.' },
    { speaker: 'lecturer', text: 'An elder or local official read the register aloud at the start of the season, so every household heard its own turn.' },
    { speaker: 'lecturer', text: 'No single family could hold the water back, because the gates were communal and opened in a fixed rotation.' },
    { speaker: 'lecturer', text: 'When drought stretched the season, the rules were tightened rather than abandoned, and short rations replaced full shares.' },
    { speaker: 'lecturer', text: 'A reliable harvest supported a larger population, which in turn built larger temples, storage rooms and town walls.' },
    { speaker: 'lecturer', text: 'That link between water management and settlement size runs through every early river civilisation we study.' },
    { speaker: 'lecturer', text: 'Archaeologists reconstruct these systems from two kinds of evidence, the physical remains and the written records.' },
    { speaker: 'lecturer', text: 'The physical remains show canal beds, gate stones and the line of ditches that once crossed the plain.' },
    { speaker: 'lecturer', text: 'Written records come from clay tablets sealed in archive rooms, which list plots, shares and water releases by season.' },
    { speaker: 'lecturer', text: 'These tablets were kept together in a shared archive, so a later generation could trace a right back to its first grant.' },
    { speaker: 'lecturer', text: 'Scholars compare the tablet entries with the surviving canal lines to check that the written shares match the physical layout.' },
    { speaker: 'lecturer', text: 'We can now match three features of such a system to the description that fits it.' },
    { speaker: 'lecturer', text: 'First, the slope of a channel.' },
    { speaker: 'lecturer', text: 'The channels were graded to follow gravity down the slope, rather than fighting the land with raised banks.' },
    { speaker: 'lecturer', text: 'Second, the clay tablets themselves.' },
    { speaker: 'lecturer', text: 'They form the archive keeping records of shared water rights across the village and its neighbours.' },
    { speaker: 'lecturer', text: 'Third, the barley fields along the main ditch.' },
    { speaker: 'lecturer', text: 'These are crops that need a steady water supply through the growing season, unlike plots that wait on rain.' },
    { speaker: 'lecturer', text: 'Other systems in wetter regions relied on flood meadows, where the river spread naturally across low ground.' },
    { speaker: 'lecturer', text: 'Those flood meadows needed fewer dug channels, but their harvests varied with the height of the annual flood.' },
    { speaker: 'lecturer', text: 'By contrast, irrigated valleys held water through dry months, which gave a more even food supply.' },
    { speaker: 'lecturer', text: 'The cost was cooperation. A canal system cannot be run by one farmer alone, and it depends on agreed rules year after year.' },
    { speaker: 'lecturer', text: 'When communities broke apart or fell to war, the ditches fell into disrepair, and fields reverted to dry scrub.' },
    { speaker: 'lecturer', text: 'Reconstructing an old irrigation system means understanding both the engineering and the social rules behind it.' },
    { speaker: 'lecturer', text: 'A canal without a register is just a ditch. The register is what turns the ditch into a shared way of farming.' },
  ],
  vocabulary: [
    {
      term: 'channels', phonetic: '/ˈtʃænlz/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '水渠，渠道（引水主沟，复数）', en: 'the dug waterways carrying flow to fields' },
      usage: { zh: '可数复数；main channels、side channels、dig channels。单数 channel。', en: 'Plural countable: main channels, side channels, dig channels. The singular is channel.' },
      collocations: ['the main channels', 'dug channels', 'the channel beds'],
      example: { en: 'The channels drew water from a river near the bank.', zh: '渠道从河岸附近的河流引水。' },
      listening: { zh: '两个音节，重音在第一音节，/nlz/ 结尾不加元音。', en: 'Two syllables, first-syllable stress, final /nlz/ without a vowel.' },
    },
    {
      term: 'register', phonetic: '/ˈredʒɪstə/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '登记册（记录份额与水权的簿册）', en: 'the written record of shares and water rights' },
      usage: { zh: '可数；shared register、keep a register、read the register。', en: 'Countable: shared register, keep a register, read the register.' },
      collocations: ['a shared register', 'the town register', 'keep the register'],
      example: { en: 'Disputes were settled from a shared register near the temple.', zh: '纠纷依据神庙旁的共享登记册裁定。' },
      listening: { zh: '三个音节，重音在第一音节，/dʒ/ 辅音。', en: 'Three syllables, first-syllable stress, /dʒ/ consonant.' },
    },
    {
      term: 'barley', phonetic: '/ˈbɑːli/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '大麦（耐旱储粮谷物）', en: 'the grain crop that tolerates dry periods and stores well' },
      usage: { zh: '不可数；barley crop、barley fields、grow barley。对照 wheat。', en: 'Uncountable: barley crop, barley fields, grow barley. Compare wheat.' },
      collocations: ['the barley crop', 'barley fields', 'grow barley'],
      example: { en: 'Barley was the main crop in early river valleys.', zh: '大麦是早期河域的主栽作物。' },
      listening: { zh: '两个音节，重音在第一音节，长元音 /ɑː/。', en: 'Two syllables, first-syllable stress, long /ɑː/.' },
    },
    {
      term: 'gravity', phonetic: '/ˈɡrævəti/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '重力（使水顺坡下流的力）', en: 'the force that pulls water downhill without a pump' },
      usage: { zh: '不可数；under gravity、gravity flow、by gravity。', en: 'Uncountable: under gravity, gravity flow, by gravity.' },
      collocations: ['under gravity', 'gravity down the slope', 'the gravity flow'],
      example: { en: 'Water flows downhill under gravity without lifting devices.', zh: '水在重力下顺坡下流，无需提水装置。' },
      listening: { zh: '三个音节，重音在第一音节，/v/ 浊辅音。', en: 'Three syllables, first-syllable stress, voiced /v/.' },
    },
    {
      term: 'harvest', phonetic: '/ˈhɑːvɪst/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '收成（一季收获的粮食）', en: 'the gathered crop from one growing season' },
      usage: { zh: '可数；reliable harvest、annual harvest、the harvest fed。', en: 'Countable: reliable harvest, annual harvest, the harvest fed.' },
      collocations: ['a reliable harvest', 'the annual harvest', 'a good harvest'],
      example: { en: 'A reliable harvest supported a larger population.', zh: '可靠收成供养了更多人口。' },
      listening: { zh: '两个音节，重音在第一音节，/v/ 浊辅音。', en: 'Two syllables, first-syllable stress, voiced /v/.' },
    },
    {
      term: 'archive', phonetic: '/ˈɑːkaɪv/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '档案库（集中保存泥板记录处）', en: 'the stored collection of written tablets and records' },
      usage: { zh: '可数；shared archive、in the archive、archive rooms。', en: 'Countable: shared archive, in the archive, archive rooms.' },
      collocations: ['a shared archive', 'the archive room', 'keep records in the archive'],
      example: { en: 'The tablets were kept in a shared archive of rights.', zh: '泥板保存在共享水权档案库中。' },
      listening: { zh: '两个音节，重音在第一音节，/ɑː/ 拉长。', en: 'Two syllables, first-syllable stress, long /ɑː/.' },
    },
    {
      term: 'drought', phonetic: '/draʊt/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '干旱（长期缺水期）', en: 'the long dry period when water runs short' },
      usage: { zh: '可数；during drought、in a drought、stretch the drought。', en: 'Countable: during drought, in a drought, stretch the drought.' },
      collocations: ['during drought', 'a long drought', 'the drought season'],
      example: { en: 'When drought stretched the season, shares were rationed.', zh: '干旱拉长季候时，水量按配给发放。' },
      listening: { zh: '单音节，双元音 /aʊ/，结尾 /t/。', en: 'One syllable, diphthong /aʊ/, final /t/.' },
    },
  ],
  expressions: [
    {
      phrase: 'grew up', sentenceIndex: 0,
      meaning: { zh: '兴起，发展成（城镇）', en: 'to develop from a small settlement into a town' },
      usage: { zh: '不及物；towns grew up、settlements grow up。', en: 'Intransitive: towns grew up, settlements grow up.' },
      example: { en: 'Settled towns grew up beside the rivers.', zh: '聚居城镇在河流旁兴起。' },
    },
    {
      phrase: 'drew water from', sentenceIndex: 3,
      meaning: { zh: '从（水源）引水', en: 'to take water out of a river or stream' },
      usage: { zh: '及物；draw water from a river、drew 为过去式。', en: 'Transitive: draw water from a river; drew is the past.' },
      example: { en: 'The channels drew water from a nearby river.', zh: '渠道从附近河流引水。' },
    },
    {
      phrase: 'water rights', sentenceIndex: 10,
      meaning: { zh: '水权（每户可取水的份额资格）', en: 'the legal share of water each household may take' },
      usage: { zh: '复数；inherit water rights、shared water rights、water rights record。', en: 'Plural: inherit water rights, shared water rights, water rights record.' },
      example: { en: 'Water rights were passed from parent to child.', zh: '水权由父母传给子女。' },
    },
    {
      phrase: 'surplus grain', sentenceIndex: 15,
      meaning: { zh: '余粮，节余谷物', en: 'grain left over after feeding the household' },
      usage: { zh: '不可数；surplus grain、store surplus grain。', en: 'Uncountable: surplus grain, store surplus grain.' },
      example: { en: 'Surplus grain reduced dependence on one year’s rain.', zh: '余粮降低了对单年降雨的依赖。' },
    },
    {
      phrase: 'fell into disrepair', sentenceIndex: 49,
      meaning: { zh: '失修，荒废（沟渠坍塌）', en: 'to stop being maintained and fall into ruin' },
      usage: { zh: '不及物；ditches fell into disrepair、fall into disrepair。', en: 'Intransitive: ditches fell into disrepair, fall into disrepair.' },
      example: { en: 'The ditches fell into disrepair after the war.', zh: '战争后沟渠年久失修。' },
    },
    {
      phrase: 'by contrast', sentenceIndex: 47,
      meaning: { zh: '相比之下（对照两种系统）', en: 'used to compare a second system against the first' },
      usage: { zh: '句首连接；by contrast, irrigated valleys…。', en: 'Sentence opener: by contrast, irrigated valleys…' },
      example: { en: 'By contrast, irrigated valleys held water through dry months.', zh: '相比之下，灌溉谷地在旱季仍有水。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记题抓类别词定位空行', en: 'Locate note rows by category words' },
      body: {
        zh: '第 31 题问水源，听到 source、draw water from；第 32 题问记录载体，听到 register、written down；第 33 题主栽作物，听到 main crop、barley；第 34 题问聚落发展，听到 grow into、cities。落笔前确认空行已给的类别。',
        en: 'Item 31 asks the source after source or draw water from; item 32 the record after register or written down; item 33 the main crop after main crop or barley; item 34 settlement growth after grow into or cities. Confirm the printed category before writing.',
      },
    },
    {
      title: { zh: '讲座单选重因果与定义', en: 'Lecture singles favour causes and definitions' },
      body: {
        zh: '第 35 题问无泵原因，答案在 under gravity；第 36 题问分水依据，答案在 written rules and shared records；第 37 题问收成带来什么，答案在 supported a larger population。听到 why、how、what did 时紧跟其后的名词短语。',
        en: 'Item 35 asks the pump-free reason after under gravity; item 36 the division basis after written rules and shared records; item 37 what the harvest allowed after supported a larger population. Note the noun phrase after why, how or what did.',
      },
    },
    {
      title: { zh: '配对题先读选项名词', en: 'Read matching option nouns first' },
      body: {
        zh: '六个选项各带一个核心名词：crops、channels、archives、canals、reservoirs、fields。听到 slope 对 channels，tablets 对 archives，barley 对 crops。干扰项 navigation canals 与 reservoirs 在录音中没有对应特征。',
        en: 'Each option has a core noun: crops, channels, archives, canals, reservoirs, fields. Match slope to channels, tablets to archives, barley to crops. Distractors navigation canals and reservoirs have no feature in the recording.',
      },
    },
  ],
};
