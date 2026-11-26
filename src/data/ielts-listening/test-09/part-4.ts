import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 9 · Part 4 — 海岸侵蚀讲座。原创仿真材料，非官方真题。
 *
 * 结构：波浪能量 → 沉积物收支 → 沿岸漂沙 → 硬质防护（海堤、丁坝）→ 风暴侵蚀 →
 * 软质措施（补沙、固草、湿地）→ 迁移策略 → 术语与案例。
 */
export const test09Part4: ListeningLesson = {
  slug: 'test-09-part-4',
  part: 4,
  status: 'published',
  title: { zh: '海岸侵蚀', en: 'Coastal erosion' },
  summary: {
    zh: '一场关于海岸侵蚀的讲座：波浪如何掀起并带走泥沙，沉积物收支怎样判断海滩进退，沿岸漂沙如何让局部海滩缺沙，海堤与丁坝两类硬质防护的作用和代价，风暴为何加速侵蚀，补沙、固草、湿地等软质措施，以及对持续后退海岸采取的迁移策略。',
    en: 'A lecture on coastal erosion: how waves lift and carry away sand, how the sediment budget tells whether a beach grows or shrinks, how longshore drift starves a local beach, what sea walls and groynes do and what they cost, why storms speed up erosion, soft measures such as nourishment, dune grass and wetlands, and managed retreat for coasts that keep retreating.',
  },
  accent: { zh: '讲师为澳式口音，关键术语会放慢重复。', en: 'The lecturer has an Australian accent and repeats key terms slowly.' },
  speechRate: '+3%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Process', 'Description'],
      rows: [
        { lead: 'Wave movement', cells: [[{ blank: 31 }, { text: 'lifts sand off the seabed and carries it out to sea' }]] },
        { lead: 'Sediment budget', cells: [[{ blank: 32 }, { text: 'new sand over lost sand means a widening beach' }]] },
        { lead: 'Sea wall', cells: [[{ blank: 33 }, { text: 'absorbs or reflects this coastal force' }]] },
        { lead: 'Longshore drift', cells: [[{ blank: 34 }, { text: 'carries material from one end of the beach to the other' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why do beaches erode faster after storms?',
          options: [
            { key: 'A', text: 'Storm waves reach higher up the beach and strip near-dune sand.' },
            { key: 'B', text: 'Storms raise the temperature of the coastal water.' },
            { key: 'C', text: 'Storms bring extra sand down the rivers.' },
          ],
        },
        {
          number: 36,
          stem: 'What is a groyne?',
          options: [
            { key: 'A', text: 'A stone barrier built along the cliff line' },
            { key: 'B', text: 'A low barrier built out from the beach into the water' },
            { key: 'C', text: 'A channel dug to drain the salt marsh' },
          ],
        },
        {
          number: 37,
          stem: 'What does the lecturer think of hard defences?',
          options: [
            { key: 'A', text: 'They protect every beach permanently.' },
            { key: 'B', text: 'They can shift the erosion problem along the shore.' },
            { key: 'C', text: 'They are cheaper than all soft measures.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE measures reduce coastal erosion? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE measures reduce coastal erosion?',
      options: [
        { key: 'A', text: 'Adding new sand matched to the beach' },
        { key: 'B', text: 'Planting grass to bind the dune sand' },
        { key: 'C', text: 'Draining coastal salt marshes' },
        { key: 'D', text: 'Building groynes to trap shore sand' },
        { key: 'E', text: 'Removing sand dunes near access paths' },
        { key: 'F', text: 'Raising concrete walls along every cliff' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['back'], evidence: 2,
      explanation: {
        zh: '定位句 2：it lifts sand and pebbles off the seabed and drags them back out to sea。波浪把泥沙掀起，再带回海里；空后已印 out to sea，填 back。',
        en: 'Sentence 2: "it lifts sand and pebbles off the seabed and drags them back out to sea". Waves lift the sediment and pull it out to sea; out to sea is already printed, so the blank takes back.',
      },
    },
    {
      number: 32, accepted: ['exceeds'], evidence: 6,
      explanation: {
        zh: '定位句 6：When new sand exceeds the lost sand, the budget is positive and the beach widens。新沙多于流失沙时收支为正；答案是动词 exceeds，不要填名词 budget。',
        en: 'Sentence 6: "When new sand exceeds the lost sand, the budget is positive and the beach widens". The budget turns positive when new sand is more than lost sand; the answer is the verb exceeds, not the noun budget.',
      },
    },
    {
      number: 33, accepted: ['energy'], evidence: 10,
      explanation: {
        zh: '定位句 10：A sea wall absorbs or reflects wave energy。海堤应对的是波浪能量；句 11 的 reflection 是能量反射方式，不是空格所问对象。',
        en: 'Sentence 10: "A sea wall absorbs or reflects wave energy". The wall deals with wave energy; reflection in sentence 11 is how that energy bounces, not the object asked for.',
      },
    },
    {
      number: 34, accepted: ['drift'], evidence: 8,
      explanation: {
        zh: '定位句 8：This longshore drift carries material from one end of the beach to the other。沿岸漂沙把泥沙从海滩一端带到另一端；longshore 已在题干中，填 drift。',
        en: 'Sentence 8: "This longshore drift carries material from one end of the beach to the other". Longshore drift moves material along the shore; longshore is printed in the stem, so the blank takes drift.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：the surge reaches higher up the beach, and it strips away sand that would normally stay near the dunes。风暴潮水位更高，刮走靠近沙丘的沙；水温变化与河流补沙在讲座中没有提到。',
        en: 'Sentence 16: "the surge reaches higher up the beach, and it strips away sand that would normally stay near the dunes". The higher storm surge strips near-dune sand. Water temperature and river sand input are never mentioned.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：A groyne is another hard structure, a low barrier built out from the beach into the water。丁坝是从海滩伸入水中的低屏障；沿崖线的石堤是海堤，排干盐沼的沟渠与丁坝无关。',
        en: 'Sentence 13: "A groyne is another hard structure: a low barrier built out from the beach into the water". A groyne projects from the beach into the water. The cliff-line barrier is a sea wall, and a marsh drainage ditch is unrelated.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：They protect the walled beach, but they often shift the problem along the shore。硬质防护护住堤后海滩，却把侵蚀压力转移到下游岸段；永久保护和成本更低都与讲座观点相反。',
        en: 'Sentence 19: "They protect the walled beach, but they often shift the problem along the shore". Hard defences protect the beach behind them but move erosion downstream. Permanent protection and lower cost contradict the lecture.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：Beach nourishment means adding new sand to a depleted beach, matched in size to the sand already there。补沙是向缺沙海滩添加粒径匹配的新沙，对应 A。',
        en: 'Sentence 21: "Beach nourishment means adding new sand to a depleted beach, matched in size to the sand already there". Nourishment adds size-matched new sand, matching A.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：The roots bind loose sand together, and the plants slow the wind that would blow it inland。固草用根系固定散沙、削弱风蚀，对应 B。',
        en: 'Sentence 22: "The roots bind loose sand together, and the plants slow the wind that would blow it inland". Dune grass binds loose sand and weakens wind erosion, matching B.',
      },
    },
    {
      number: 40, accepted: ['D'], evidence: 32,
      explanation: {
        zh: '定位句 32：A small number of beaches rely on groynes to hold the sand after the natural supply has been cut off。丁坝截住沿岸漂沙、留住滩面泥沙，对应 D；排干沼泽、移除沙丘、全线筑墙在句 24、25 被列为削弱防护的做法。',
        en: 'Sentence 32: "A small number of beaches rely on groynes to hold the sand after the natural supply has been cut off". Groynes trap shore sand, matching D. Draining marshes and removing dunes are listed in sentences 24 and 25 as actions that weaken defence, and raising walls everywhere is not the soft measure endorsed.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Stand on almost any Australian beach, and the shoreline you remember from childhood has already moved a few steps inland.' },
    { speaker: 'lecturer', text: 'Today we will look at how coastal erosion works, and what communities can do about it.' },
    { speaker: 'lecturer', text: 'Erosion begins with wave energy. When a large wave breaks on the shore, it lifts sand and pebbles off the seabed and drags them back out to sea.' },
    { speaker: 'lecturer', text: 'The power of that movement depends on the wind strength, the distance the wave has travelled, and the depth of water near the beach.' },
    { speaker: 'lecturer', text: 'To understand whether a stretch of coast is growing or shrinking, geographers use the idea of a sediment budget.' },
    { speaker: 'lecturer', text: 'The budget adds up all the sand coming onto the beach and subtracts all the sand carried away.' },
    { speaker: 'lecturer', text: 'When new sand exceeds the lost sand, the budget is positive and the beach widens. When losses exceed gains, the beach narrows.' },
    { speaker: 'lecturer', text: 'Sand travels along the shore too, pushed by waves that approach the beach at an angle.' },
    { speaker: 'lecturer', text: 'This longshore drift carries material from one end of the beach to the other, and a local beach can starve even when the whole coast holds plenty of sand.' },
    { speaker: 'lecturer', text: 'We can group coastal defences into two broad families, hard structures and soft measures.' },
    { speaker: 'lecturer', text: 'The classic hard defence is the sea wall, a concrete or stone barrier built along the cliff line. A sea wall absorbs or reflects wave energy.' },
    { speaker: 'lecturer', text: 'Reflection sends that energy back out to sea rather than absorbing it fully.' },
    { speaker: 'lecturer', text: 'Because the energy bounces back, the water next to the wall scours the seabed, and beaches beside the wall can narrow over time.' },
    { speaker: 'lecturer', text: 'A groyne is another hard structure, a low barrier built out from the beach into the water.' },
    { speaker: 'lecturer', text: 'Groynes are placed at right angles to the shore, and they trap sand that longshore drift would otherwise carry away.' },
    { speaker: 'lecturer', text: 'A groyne holds sand on the stretch behind it, but it can starve the beaches further down the coast.' },
    { speaker: 'lecturer', text: 'During a storm, the surge reaches higher up the beach, and it strips away sand that would normally stay near the dunes.' },
    { speaker: 'lecturer', text: 'Once that sand is gone, the cliff behind the beach loses its natural buffer, and waves attack the cliff foot directly.' },
    { speaker: 'lecturer', text: 'That is why beaches erode faster after storms. Large waves lift loose sediment, and the higher surge reaches sand the calm sea never touches.' },
    { speaker: 'lecturer', text: 'Hard structures therefore trade one stretch of coast against another. They protect the walled beach, but they often shift the problem along the shore.' },
    { speaker: 'lecturer', text: 'Soft measures work with natural processes instead of blocking them.' },
    { speaker: 'lecturer', text: 'Beach nourishment means adding new sand to a depleted beach, matched in size to the sand already there.' },
    { speaker: 'lecturer', text: 'Planting dune grass is another soft measure. The roots bind loose sand together, and the plants slow the wind that would blow it inland.' },
    { speaker: 'lecturer', text: 'Coastal wetlands and salt marshes also absorb wave energy before it reaches the land.' },
    { speaker: 'lecturer', text: 'Draining those marshes for development removes that buffer, and the shoreline behind them erodes faster.' },
    { speaker: 'lecturer', text: 'Removing sand dunes for access or parking weakens the first line of defence in exactly the same way.' },
    { speaker: 'lecturer', text: 'Even the best defences cannot hold back every coast. Where erosion is relentless, planners consider managed retreat.' },
    { speaker: 'lecturer', text: 'Managed retreat means moving buildings and roads away from the coastline rather than fighting the sea.' },
    { speaker: 'lecturer', text: 'It is often the cheapest long-term option once the cost of repeated repairs is counted.' },
    { speaker: 'lecturer', text: 'Communities often resist retreat, however, because properties are tied to the land and familiar views.' },
    { speaker: 'lecturer', text: 'A settlement that retreats slowly can still keep its fishing harbour and public promenade behind the new line of defence.' },
    { speaker: 'lecturer', text: 'Some engineers propose nourishment together with dune planting, so the beach rebuilds rather than depending on walls alone.' },
    { speaker: 'lecturer', text: 'A small number of beaches rely on groynes to hold the sand after the natural supply has been cut off by harbours or walls elsewhere.' },
    { speaker: 'lecturer', text: 'It helps to remember that no single structure fixes erosion for good. Each measure trades one stretch of coast against another, or buys time before the next storm.' },
    { speaker: 'lecturer', text: 'In the reading list, look for the study of a bay where a wall was built in the nineteen seventies.' },
    { speaker: 'lecturer', text: 'Its beaches widened behind the wall at first, but the shoreline to the south began to retreat within ten years.' },
    { speaker: 'lecturer', text: 'That case shows the feedback between structures and longshore drift, which we will examine in the next lecture.' },
    { speaker: 'lecturer', text: 'Let me define a few terms before we move on.' },
    { speaker: 'lecturer', text: 'Sediment is the general word for sand, gravel and silt that waves move along the coast.' },
    { speaker: 'lecturer', text: 'The cliff foot is the lowest part of the cliff, where rock meets the beach.' },
    { speaker: 'lecturer', text: 'The foreshore is the band of sand exposed at low tide and covered again at high tide.' },
    { speaker: 'lecturer', text: 'Storm surge is the extra rise in water level pushed onshore by strong winds.' },
    { speaker: 'lecturer', text: 'Longshore drift works best where waves meet the coast at a shallow angle rather than straight on.' },
    { speaker: 'lecturer', text: 'When a harbour or a breakwater cuts that drift off, beaches on one side lose their supply.' },
    { speaker: 'lecturer', text: 'Beach nourishment must be repeated every few years, because the new sand moves on like the old sand.' },
    { speaker: 'lecturer', text: 'Dune grass grows low to the ground, so it does not block the view from nearby houses.' },
    { speaker: 'lecturer', text: 'Salt marshes reduce wave height over a distance of many metres, especially in gentle water.' },
    { speaker: 'lecturer', text: 'Managed retreat can include buying out properties or relocating a road further inland.' },
    { speaker: 'lecturer', text: 'The decision depends on the value of the buildings, the rate of erosion and the funding available.' },
    { speaker: 'lecturer', text: 'In our region, two coastal towns have chosen nourishment, and one has begun a slow retreat plan.' },
  ],
  vocabulary: [
    {
      term: 'erosion', phonetic: '/ɪˈrəʊʒn/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '侵蚀，被自然力量逐步冲掉', en: 'the gradual wearing away of land by water, wind or waves' },
      usage: { zh: 'coastal erosion、soil erosion；动词 erode。', en: 'Coastal erosion, soil erosion; the verb is erode.' },
      collocations: ['coastal erosion', 'the rate of erosion', 'control erosion'],
      example: { en: 'Coastal erosion moves the shoreline a little further inland each year.', zh: '海岸侵蚀每年把岸线向内陆推进一点。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈrəʊ/，结尾 /ʒn/ 轻读。', en: 'Three syllables with stress on /ˈrəʊ/; the ending /ʒn/ is light.' },
    },
    {
      term: 'sediment', phonetic: '/ˈsedɪmənt/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '沉积物，泥沙砾石的统称', en: 'sand, gravel and silt carried or dropped by water' },
      usage: { zh: '不可数；sediment budget、sediment supply。形容词 sedimentary。', en: 'Uncountable: sediment budget, sediment supply. The adjective is sedimentary.' },
      collocations: ['the sediment budget', 'loose sediment', 'the sediment supply'],
      example: { en: 'Waves lift loose sediment from the seabed during storms.', zh: '风暴时波浪把海底散沙掀起。' },
      listening: { zh: '三音节，重音在首音节 /ˈsed/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'budget', phonetic: '/ˈbʌdʒɪt/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '收支平衡测算，此处指泥沙收支', en: 'a balance between what enters and what leaves, applied here to sand' },
      usage: { zh: '日常义“预算”；本讲座 sediment budget 是泥沙收支。', en: 'The usual sense is a money budget; here sediment budget tracks sand.' },
      collocations: ['a positive budget', 'the sediment budget', 'budget gains and losses'],
      example: { en: 'A positive sediment budget means the beach is widening.', zh: '泥沙收支为正意味着海滩在变宽。' },
      listening: { zh: '双音节，首音节 /ˈbʌ/，尾音 /dʒɪt/。', en: 'Two syllables with stress on the first; the ending is /dʒɪt/.' },
    },
    {
      term: 'drift', phonetic: '/drɪft/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '漂沙，沿岸泥沙移动', en: 'the slow movement of material along the shore by waves' },
      usage: { zh: 'longshore drift 固定搭配；动词 drift 指“漂流”。', en: 'Longshore drift is a set phrase; as a verb it means float along.' },
      collocations: ['longshore drift', 'the drift carries', 'cut off the drift'],
      example: { en: 'Longshore drift moves sand from one end of the beach to the other.', zh: '沿岸漂沙把泥沙从海滩一端带到另一端。' },
      listening: { zh: '短元音 /ɪ/，结尾 /ft/ 读全。', en: 'Short /ɪ/; pronounce the final /ft/.' },
    },
    {
      term: 'groyne', phonetic: '/ɡrɔɪn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '丁坝，从滩面伸入水中的拦沙坝', en: 'a low barrier projecting from the beach to trap sand' },
      usage: { zh: '英式拼写 groyne，美式 groin；不要和“腹股沟”的 groin 混淆。', en: 'British groyne, American groin; do not confuse it with the body part groin.' },
      collocations: ['build a groyne', 'a row of groynes', 'the groyne traps sand'],
      example: { en: 'Each groyne holds sand on the stretch behind it.', zh: '每道丁坝在坝后留住泥沙。' },
      listening: { zh: '双音节；oy 读 /ɔɪ/，尾音 /n/。', en: 'Two syllables; oy sounds /ɔɪ/, ending in /n/.' },
    },
    {
      term: 'nourishment', phonetic: '/ˈnʌrɪʃmənt/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '海滩补沙，人工填沙养滩', en: 'adding new sand to a beach that has lost its sediment' },
      usage: { zh: 'beach nourishment 固定说法；一般义“营养”。动词 nourish。', en: 'Beach nourishment is the technical term; the general sense is nutrition. The verb is nourish.' },
      collocations: ['beach nourishment', 'repeat the nourishment', 'nourishment projects'],
      example: { en: 'Beach nourishment adds sand matched to the existing grain size.', zh: '补沙添加粒径与原有沙匹配的新沙。' },
      listening: { zh: '三音节，重音在首音节 /ˈnʌ/，-ment 轻读。', en: 'Three syllables with stress on the first; -ment is light.' },
    },
    {
      term: 'dune', phonetic: '/djuːn/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '沙丘', en: 'a raised bank of sand shaped by the wind' },
      usage: { zh: 'sand dune、dune grass；复数 dunes。', en: 'Sand dune, dune grass; the plural is dunes.' },
      collocations: ['sand dunes', 'dune grass', 'near the dunes'],
      example: { en: 'Dune grass binds the loose sand behind the beach.', zh: '固草把海滩后方的散沙固定住。' },
      listening: { zh: '单音节，开头 /djuː/ 类似 dew，不要读成 dun。', en: 'One syllable starting like dew, not dun.' },
    },
    {
      term: 'retreat', phonetic: '/rɪˈtriːt/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '（海岸）后退，迁移避让', en: 'moving buildings or settlements away from a receding coast' },
      usage: { zh: 'managed retreat 固定说法；动词 retreat 也指撤退。', en: 'Managed retreat is the fixed term; the verb also means withdraw.' },
      collocations: ['managed retreat', 'coastal retreat', 'a slow retreat plan'],
      example: { en: 'Managed retreat relocates roads and buildings away from the coastline.', zh: '迁移策略把道路和建筑从岸线后撤。' },
      listening: { zh: '双音节，重音在第二音节 /ˈtriː/，长元音。', en: 'Two syllables with stress on the second long vowel.' },
    },
  ],
  expressions: [
    {
      phrase: 'drags them back out', sentenceIndex: 2,
      meaning: { zh: '把（泥沙）卷带回海', en: 'to pull lifted material back toward the water' },
      usage: { zh: '可分短语动词；宾语代词放在 back 前。', en: 'Separable; the object pronoun goes before back.' },
      example: { en: 'Each wave drags the pebbles back out to sea.', zh: '每道浪都把砾石卷带回海里。' },
    },
    {
      phrase: 'carried away', sentenceIndex: 5,
      meaning: { zh: '被带走，被冲走', en: 'moved off the beach by waves or wind' },
      usage: { zh: '被动语态；carry away 也指“着迷”，靠语境区分。', en: 'Passive voice; carry away can also mean charmed, context decides.' },
      example: { en: 'All the sand carried away by storms must be counted in the budget.', zh: '风暴冲走的所有泥沙都要计入收支。' },
    },
    {
      phrase: 'work with', sentenceIndex: 20,
      meaning: { zh: '顺应（自然过程）来做', en: 'to follow natural processes rather than block them' },
      usage: { zh: '反义搭配是 fight against；后接自然力量。', en: 'The opposite is fight against; follow with a natural force.' },
      example: { en: 'Soft measures work with the tide instead of building walls.', zh: '软质措施顺应潮汐，而不是筑墙对抗。' },
    },
    {
      phrase: 'tied to', sentenceIndex: 29,
      meaning: { zh: '绑定在（土地/地点）上', en: 'connected firmly to a place and unable to leave it' },
      usage: { zh: '被动或状态搭配；tied to the land、tied to the house。', en: 'Passive or state: tied to the land, tied to the house.' },
      example: { en: 'Many owners feel tied to the land and resist moving.', zh: '许多业主觉得自己与土地绑定，不愿搬迁。' },
    },
    {
      phrase: 'cut off', sentenceIndex: 32,
      meaning: { zh: '切断，隔绝（泥沙来源）', en: 'to stop a supply reaching a place' },
      usage: { zh: '可分短语动词；cut off the supply、be cut off by。', en: 'Separable: cut off the supply, be cut off by.' },
      example: { en: 'The harbour cuts off the sand supply to beaches on one side.', zh: '港口切断了一侧海滩的泥沙来源。' },
    },
    {
      phrase: 'for good', sentenceIndex: 33,
      meaning: { zh: '永久地，一劳永逸', en: 'permanently, with no return' },
      usage: { zh: '副词短语置于句末；同义表达是 permanently。', en: 'Adverbial phrase at the end; a paraphrase is permanently.' },
      example: { en: 'No single structure fixes coastal erosion for good.', zh: '没有哪一项工程能一劳永逸解决海岸侵蚀。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题先读列头再抓关系词', en: 'Read the table headers, then catch relation words' },
      body: {
        zh: '第 31–34 题表格列头是 Process 与 Description，空格多为关系动词或术语名词。听讲座前先扫读每行的已知描述，听到 exceeds、energy、drift 这类关系词时直接对应到行列，避免在长句里临时找位置。',
        en: 'Items 31 to 34 have Process and Description headers; blanks are relation verbs or technical nouns. Read each known description before the lecture, and when you hear relation words such as exceeds, energy or drift, match them straight to the row instead of hunting through a long sentence.',
      },
    },
    {
      title: { zh: '区分两类防护的代价', en: 'Separate the costs of the two defence families' },
      body: {
        zh: '第 36 题问丁坝定义，第 37 题问硬质防护的整体评价：丁坝截沙但会让下游海滩缺沙，海堤把能量反射回海、冲刷堤前滩面。听结构介绍时在 hard 与 soft 两栏分别记“作用”和“代价”，选择题干扰项常把两类特点互换。',
        en: 'Item 36 defines the groyne, and item 37 judges hard defences overall: groynes trap sand but starve downstream beaches, and walls reflect energy that scours the beach in front. Note benefit and cost under hard and soft columns as structures are introduced; distractors often swap features between the two families.',
      },
    },
    {
      title: { zh: '多选题排除破坏型做法', en: 'Multiple choice: rule out destructive actions' },
      body: {
        zh: '第 38–40 题选三项减蚀措施，句 24、25 把排干沼泽、移除沙丘列为削弱防护的做法，选项 C、E 即对应这些干扰。讲座讲措施时通常先说“有效做法”，再讲“错误做法”，听到 removing、draining 这类动词时留意它指向的是被否定的选项。',
        en: 'Items 38 to 40 pick three erosion-reduction measures; sentences 24 and 25 list draining marshes and removing dunes as defence-weakening actions, matching distractors C and E. Lectures usually give helpful measures first then wrong actions; when you hear removing or draining, check whether it points to a rejected option.',
      },
    },
  ],
};
