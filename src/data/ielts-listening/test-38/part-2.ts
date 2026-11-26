import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 38 · Part 2 — 国家公园步道说明（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：三条路线难度与水源（表格 11–14）→ 环线坡度、野生动物与垃圾处理（单选 15–17）→
 * 取水、天气与家畜地段的行为建议（配对 18–20）。题块顺序与录音一致。
 */
export const test38Part2: ListeningLesson = {
  slug: 'test-38-part-2',
  part: 2,
  status: 'published',
  title: { zh: '国家公园步道说明', en: 'A trail briefing at a national park' },
  summary: {
    zh: '公园女护林员向访客讲解三条标识路线：主步道难度中等、途经一条未处理的溪流，阵雨时有石屋避雨，所有垃圾必须自行带下山；山顶环线更陡更多石，林缘可见鹿，步道上不设垃圾桶。随后说明应在中心接水、出发前看天气预报、靠近绵羊地段须牵狗。',
    en: 'A ranger briefs visitors on three routes: the moderate main trail passes an untreated stream, a stone shelter gives shower cover, and all rubbish is carried out. The summit loop is steeper and rockier, deer graze near the woodland edge, and there are no bins on the trails. Advice covers filling bottles at the centre tap, checking the forecast, and keeping dogs on the lead near sheep.',
  },
  accent: { zh: '护林员为英式口音。', en: 'The ranger speaks with a British accent.' },
  cast: [
    { id: 'ranger', label: 'RANGER', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Feature', 'Detail'],
      rows: [
        { lead: 'Main trail difficulty', cells: [[{ blank: 11 }]] },
        { lead: 'Route water source', cells: [[{ blank: 12 }]] },
        { lead: 'Shelter in a shower', cells: [[{ text: 'stone ' }, { blank: 13 }]] },
        { lead: 'Litter you must carry out', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What is the summit loop like?',
          options: [
            { key: 'A', text: 'flat and level beside the river' },
            { key: 'B', text: 'steeper and rockier than the main trail' },
            { key: 'C', text: 'closed to walkers in the wet season' },
          ],
        },
        {
          number: 16,
          stem: 'Which wildlife may visitors see?',
          options: [
            { key: 'A', text: 'deer near the woodland edge' },
            { key: 'B', text: 'snakes on the dry stone walls' },
            { key: 'C', text: 'foxes around the visitor centre' },
          ],
        },
        {
          number: 17,
          stem: 'What should walkers do with food wrappers?',
          options: [
            { key: 'A', text: 'leave them in the bin at the trail start' },
            { key: 'B', text: 'carry them back to the centre themselves' },
            { key: 'C', text: 'bury them under leaves off the path' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which advice applies to each situation? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'keep to the waymarked path' },
        { key: 'B', text: 'fill bottles at the visitor centre tap' },
        { key: 'C', text: 'check the forecast before setting out' },
        { key: 'D', text: 'keep dogs on a lead near livestock' },
        { key: 'E', text: 'rest at the stone shelter before the climb' },
        { key: 'F', text: 'take photographs from the viewpoint only' },
      ],
      items: [
        { number: 18, text: 'water supply for the walk' },
        { number: 19, text: 'a sudden change in the weather' },
        { number: 20, text: 'grazing animals nearby' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['moderate'], evidence: 3,
      explanation: {
        zh: '定位句 3：its difficulty is moderate, so wear stable shoes。主步道难度中等，填 moderate；句 2 的 riverside walk 是最平缓路线，不是主步道。',
        en: 'Sentence 3: "its difficulty is moderate, so wear stable shoes". The main trail is moderate, so write moderate. The riverside walk in sentence 2 is the easiest route, not the main trail.',
      },
    },
    {
      number: 12, accepted: ['stream'], evidence: 5,
      explanation: {
        zh: '定位句 5：Water on the route comes from a clear stream beside the lower meadow。路线水源是溪流 stream；句 17 的 centre tap 是建议接水处，不是路线水源。',
        en: 'Sentence 5: "Water on the route comes from a clear stream beside the lower meadow". The route source is the stream. The centre tap in sentence 17 is the advised refill point, not the route water.',
      },
    },
    {
      number: 13, accepted: ['shelter'], evidence: 6,
      explanation: {
        zh: '定位句 6：there is a stone shelter just below the quarry, with a bench inside。阵雨避雨处是石屋 shelter；句 6 的 bench 是屋内设施，不是避雨建筑。',
        en: 'Sentence 6: "there is a stone shelter just below the quarry, with a bench inside". The shower cover is the shelter. The bench in sentence 6 is a seat inside, not the building.',
      },
    },
    {
      number: 14, accepted: ['rubbish'], evidence: 8,
      explanation: {
        zh: '定位句 8：Pack out all rubbish yourself, including food wrappers and empty cartons。必须带下山的是垃圾 rubbish；句 15 的 bins 因吸引动物而未在步道设置。',
        en: 'Sentence 8: "Pack out all rubbish yourself, including food wrappers and empty cartons". The litter to carry out is rubbish. Trail bins in sentence 15 are absent because they attract animals.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 9,
      explanation: {
        zh: '定位句 9：the summit loop, which is steeper and rockier than the main trail。山顶环线更陡更多石对应 B；A 的临河平路是 riverside walk，C 的雨季关闭在讲解中未出现。',
        en: 'Sentence 9: "the summit loop, which is steeper and rockier than the main trail". The loop is steeper and rockier, matching B. The flat riverside route in A is the other walk, and wet-season closure in C is not mentioned.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 10,
      explanation: {
        zh: '定位句 10：deer that graze near the woodland edge at dawn and late afternoon。林缘的鹿对应 A；B 的石墙上蛇与 C 的中心附近狐狸在讲解中未出现。',
        en: 'Sentence 10: "deer that graze near the woodland edge at dawn and late afternoon". Deer at the woodland edge match A. Wall snakes in B and centre foxes in C are not mentioned.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 16,
      explanation: {
        zh: '定位句 16：Visitors who drop litter are asked to carry it back to the centre themselves。包装纸自行带回中心对应 B；A 的步道垃圾桶句 15 说明没有，C 的埋叶下被句 8 否定。',
        en: 'Sentence 16: "Visitors who drop litter are asked to carry it back to the centre themselves". Taking wrappers back yourself matches B. Trail bins in A are absent in sentence 15, and burying under leaves in C is ruled out in sentence 8.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：Water for the day should come from the centre tap, not the untreated stream on the route。步行取水对应在中心水龙头接水，选 B；E 的石屋是避雨处。',
        en: 'Sentence 17: "Water for the day should come from the centre tap, not the untreated stream on the route". The walking water supply matches filling at the centre tap, B. The stone shelter in E is for rain.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 18,
      explanation: {
        zh: '定位句 18：Before you leave, check the forecast at the centre board, since the ridge wind changes fast。天气突变对应出发前看天气预报，选 C；E 的石屋是阵雨时的去处，不是行前准备。',
        en: 'Sentence 18: "Before you leave, check the forecast at the centre board, since the ridge wind changes fast". Sudden weather matches checking the forecast, C. The shelter in E is a shower refuge, not pre-departure preparation.',
      },
    },
    {
      number: 20, accepted: ['D'], evidence: 19,
      explanation: {
        zh: '定位句 19：Where sheep graze through the summer, dogs must stay on a lead and give the animals plenty of room。靠近家畜对应牵狗，选 D；A 的走标识路是通用规则，不针对羊群地段。',
        en: 'Sentence 19: "Where sheep graze through the summer, dogs must stay on a lead and give the animals plenty of room". Near livestock matches the dog lead, D. Keeping to the path in A is a general rule, not a livestock-specific one.',
      },
    },
  ],
  transcript: [
    { speaker: 'ranger', text: 'Right, everyone, if you’d like to stay on the porch for a few minutes, I’ll go over the park trails before you set off.' },
    { speaker: 'ranger', text: 'I’m Megan, your ranger today, and this map shows the three waymarked routes from the visitor centre.' },
    { speaker: 'ranger', text: 'The easiest route is the riverside walk, flat and level for about two miles.' },
    { speaker: 'ranger', text: 'The main trail climbs through the woodland to the old quarry, and its difficulty is moderate, so wear stable shoes.' },
    { speaker: 'ranger', text: 'The weather on the hills can turn quickly, and the centre forecast lists wind and rain for the afternoon.' },
    { speaker: 'ranger', text: 'Water on the route comes from a clear stream beside the lower meadow, but the water there is not treated for drinking.' },
    { speaker: 'ranger', text: 'If a shower catches you out, there is a stone shelter just below the quarry, with a bench inside.' },
    { speaker: 'ranger', text: 'The park leave no trace rule applies to every route.' },
    { speaker: 'ranger', text: 'Pack out all rubbish yourself, including food wrappers and empty cartons, and do not bury anything under leaves.' },
    { speaker: 'ranger', text: 'A short side path leads up to the summit loop, which is steeper and rockier than the main trail.' },
    { speaker: 'ranger', text: 'Wildlife here includes deer that graze near the woodland edge at dawn and late afternoon.' },
    { speaker: 'ranger', text: 'You may hear birdsong on the ridge, and small rodents run along the dry stone walls.' },
    { speaker: 'ranger', text: 'Near the north field, sheep graze through the summer, and dogs must stay on a lead there.' },
    { speaker: 'ranger', text: 'The summit loop suits walkers with reasonable fitness, and its rocky section needs careful footing.' },
    { speaker: 'ranger', text: 'The riverside walk suits families, and it stays within reach of the centre if weather worsens.' },
    { speaker: 'ranger', text: 'Wrappers and scraps attract foxes and rats, so there are no bins out on the trails.' },
    { speaker: 'ranger', text: 'Visitors who drop litter are asked to carry it back to the centre themselves.' },
    { speaker: 'ranger', text: 'Water for the day should come from the centre tap, not the untreated stream on the route.' },
    { speaker: 'ranger', text: 'Before you leave, check the forecast at the centre board, since the ridge wind changes fast.' },
    { speaker: 'ranger', text: 'Where sheep graze through the summer, dogs must stay on a lead and give the animals plenty of room.' },
    { speaker: 'ranger', text: 'The marked path runs past a viewpoint bench, where you can stop and take photographs.' },
    { speaker: 'ranger', text: 'Please keep to the waymarked path, because the grass beside it is protected habitat.' },
    { speaker: 'ranger', text: 'The ranger patrols the lower field around midday, and you can ask about the deer tracks near the wall.' },
    { speaker: 'ranger', text: 'If you meet livestock, move slowly and give the animals plenty of space.' },
    { speaker: 'ranger', text: 'Dogs are welcome in the park, but they cannot run loose near the grazing fields.' },
    { speaker: 'ranger', text: 'The first section of the main trail shares a road used by farm vehicles, so step aside when one passes.' },
    { speaker: 'ranger', text: 'A map leaflet at the centre lists each route’s length, the steepest section and the nearest seat.' },
    { speaker: 'ranger', text: 'After heavy rain, the side path can be muddy, and boots with grip are the safest choice.' },
    { speaker: 'ranger', text: 'The quarry wall is fenced off, and visitors must not climb it for safety reasons.' },
    { speaker: 'ranger', text: 'Photography from the viewpoint is encouraged, but please do not disturb nesting birds in spring.' },
    { speaker: 'ranger', text: 'The centre cafe opens at nine, and packed lunches can be eaten on the terrace outside.' },
    { speaker: 'ranger', text: 'In an emergency, use the number printed on the map leaflet, and stay where you are if the path is unclear.' },
    { speaker: 'ranger', text: 'The riverside walk crosses a small wooden bridge, which may be slippery after rain.' },
    { speaker: 'ranger', text: 'Deer are shy, so keep your voice down if you spot one near the trees.' },
    { speaker: 'ranger', text: 'The shelter roof was repaired last spring, and the door swings shut against the wind.' },
    { speaker: 'ranger', text: 'No fires are allowed anywhere in the park, even in the designated picnic area.' },
    { speaker: 'ranger', text: 'You can borrow a free walking pole at the centre if the climb feels demanding.' },
    { speaker: 'ranger', text: 'The route signs are colour coded, red for the main trail and blue for the riverside walk.' },
    { speaker: 'ranger', text: 'At the far end of the main trail, a stone seat looks back over the valley.' },
    { speaker: 'ranger', text: 'That covers the basics. Check the board by the door for the day’s wind speed before you head out.' },
  ],
  vocabulary: [
    {
      term: 'moderate', phonetic: '/ˈmɒdərət/', partOfSpeech: 'adj.', sentenceIndex: 3,
      meaning: { zh: '中等的（难度适中）', en: 'neither easy nor hard, within a comfortable range' },
      usage: { zh: '难度描述；moderate trail、moderate level。', en: 'Describes difficulty: moderate trail, moderate level.' },
      collocations: ['a moderate trail', 'moderate difficulty', 'a moderate pace'],
      example: { en: 'The main trail has a moderate difficulty for regular walkers.', zh: '主步道对常散步的人难度中等。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /rət/。', en: 'Three syllables, first-syllable stress, final /rət/.' },
    },
    {
      term: 'stream', phonetic: '/striːm/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '小溪，溪流', en: 'a small narrow flow of water across the land' },
      usage: { zh: '可数；clear stream、beside the stream。对照 river（大河）。', en: 'Countable: clear stream, beside the stream. Compare river.' },
      collocations: ['a clear stream', 'the route stream', 'cross the stream'],
      example: { en: 'The route passes a clear stream beside the meadow.', zh: '路线经过草甸旁一条清溪。' },
      listening: { zh: '单音节，长元音 /iː/，开头 /str/。', en: 'One syllable, long /iː/, opening /str/.' },
    },
    {
      term: 'shelter', phonetic: '/ˈʃeltə/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '避雨处，遮蔽建筑', en: 'a covered place that protects from rain or wind' },
      usage: { zh: '可数；stone shelter、take shelter。', en: 'Countable: stone shelter, take shelter.' },
      collocations: ['a stone shelter', 'the mountain shelter', 'find shelter'],
      example: { en: 'The stone shelter sits just below the old quarry.', zh: '石屋就在旧采石场下方。' },
      listening: { zh: '两个音节，/lt/ 辅音丛，结尾 /ə/ 轻读。', en: 'Two syllables, /lt/ cluster, light final /ə/.' },
    },
    {
      term: 'rubbish', phonetic: '/ˈrʌbɪʃ/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '垃圾，废弃物', en: 'waste items to be carried away or disposed of' },
      usage: { zh: '英式不可数；美式常说 trash、garbage。pack out rubbish。', en: 'British uncountable; American often says trash or garbage. Pack out rubbish.' },
      collocations: ['all the rubbish', 'pack out rubbish', 'leave rubbish'],
      example: { en: 'Pack out all rubbish, including wrappers and cartons.', zh: '所有垃圾包括包装纸和纸盒都要带下山。' },
      listening: { zh: '两个音节，重音在第一音节，/ʃ/ 收尾。', en: 'Two syllables, first-syllable stress, final /ʃ/.' },
    },
    {
      term: 'deer', phonetic: '/dɪə/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '鹿（单复数同形）', en: 'a grazing wild animal found near woodland' },
      usage: { zh: '单复数同形；one deer、two deer。', en: 'Same singular and plural: one deer, two deer.' },
      collocations: ['wild deer', 'a deer near the trees', 'deer tracks'],
      example: { en: 'Deer graze near the woodland edge at dusk.', zh: '黄昏时分鹿在林缘吃草。' },
      listening: { zh: '单音节，双元音 /ɪə/，结尾 /r/ 轻触。', en: 'One syllable, diphthong /ɪə/, light final /r/.' },
    },
    {
      term: 'forecast', phonetic: '/ˈfɔːkɑːst/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '天气预报', en: 'the predicted weather for the day' },
      usage: { zh: '可数；check the forecast、weather forecast。动词同形。', en: 'Countable: check the forecast, weather forecast. The verb shares the form.' },
      collocations: ['check the forecast', 'the weather forecast', 'a wind forecast'],
      example: { en: 'Check the forecast at the centre board before leaving.', zh: '出发前在中心公告板看天气预报。' },
      listening: { zh: '复合词，重音在第一部分；/kɑː/ 长元音。', en: 'Compound with first-part stress; long /ɑː/.' },
    },
    {
      term: 'litter', phonetic: '/ˈlɪtə/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '乱丢的垃圾（步道上的废弃物）', en: 'waste dropped in a public or natural place' },
      usage: { zh: '不可数；drop litter、pick up litter。', en: 'Uncountable: drop litter, pick up litter.' },
      collocations: ['drop litter', 'trail litter', 'no litter'],
      example: { en: 'Visitors who drop litter carry it back to centre.', zh: '乱丢垃圾的访客要自行带回中心。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /ə/。', en: 'Two syllables, first-syllable stress, final /ə/.' },
    },
  ],
  expressions: [
    {
      phrase: 'set off', sentenceIndex: 0,
      meaning: { zh: '出发，动身步行', en: 'to leave on a walk or journey' },
      usage: { zh: '不及物；set off on the trail、set off early。', en: 'Intransitive: set off on the trail, set off early.' },
      example: { en: 'We go over the routes before you set off.', zh: '你们出发前我们先讲一遍路线。' },
    },
    {
      phrase: 'waymarked path', sentenceIndex: 21,
      meaning: { zh: '有标识路标的步道', en: 'a trail marked with signs for walkers' },
      usage: { zh: '可数；waymarked route、colour coded signs。', en: 'Countable: waymarked route, colour coded signs.' },
      example: { en: 'Keep to the waymarked path in the protected grass.', zh: '在受保护草地旁请走标识步道。' },
    },
    {
      phrase: 'pack out', sentenceIndex: 8,
      meaning: { zh: '打包带下山，自行带走垃圾', en: 'to carry waste out of the natural area yourself' },
      usage: { zh: '及物；pack out rubbish、pack out wrappers。', en: 'Transitive: pack out rubbish, pack out wrappers.' },
      example: { en: 'Pack out all rubbish from every route.', zh: '每条路线的垃圾都要自行带下山。' },
    },
    {
      phrase: 'keep to', sentenceIndex: 21,
      meaning: { zh: '沿着，不偏离（路线）', en: 'to stay on a route and not wander off it' },
      usage: { zh: '及物；keep to the path、keep to the signs。', en: 'Transitive: keep to the path, keep to the signs.' },
      example: { en: 'Keep to the path beside the protected habitat.', zh: '在受保护生境旁沿步道行走。' },
    },
    {
      phrase: 'on a lead', sentenceIndex: 19,
      meaning: { zh: '牵着牵引绳', en: 'held by a leash near animals or livestock' },
      usage: { zh: '介词短语；keep dogs on a lead。反义 off the lead。', en: 'Prepositional phrase: keep dogs on a lead. Opposite off the lead.' },
      example: { en: 'Dogs stay on a lead where sheep graze.', zh: '有绵羊吃草的地段狗要牵绳。' },
    },
    {
      phrase: 'drop litter', sentenceIndex: 16,
      meaning: { zh: '乱扔垃圾', en: 'to leave waste behind in the park' },
      usage: { zh: '及物；drop litter on the trails。', en: 'Transitive: drop litter on the trails.' },
      example: { en: 'Anyone dropping litter carries it back to centre.', zh: '乱扔垃圾的人要把它带回中心。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题按特征词定位行', en: 'Find rows by feature words' },
      body: {
        zh: '第 11 题问难度，听到 difficulty、moderate；第 12 题问水源，听到 stream、water；第 13 题问避雨建筑，听到 shelter、shower；第 14 题问垃圾，听到 rubbish、wrap。先判词性再落笔。',
        en: 'Item 11 asks difficulty after difficulty or moderate; item 12 the water source after stream or water; item 13 the rain cover after shelter or shower; item 14 the litter after rubbish or wrap. Judge the part of speech before writing.',
      },
    },
    {
      title: { zh: '配对题先记建议动词', en: 'Note the advice verbs first' },
      body: {
        zh: '六个选项都是行为建议：fill、check、keep on a lead、keep to path、rest、photograph。听前各记一个动词；听到 water、forecast、sheep 时直接拿动词对选项，不要整句翻译。',
        en: 'All six options are actions: fill, check, keep on a lead, keep to path, rest, photograph. Note one verb per option; match the verb when you hear water, forecast or sheep rather than translating whole options.',
      },
    },
    {
      title: { zh: '独白里区分路线与规则', en: 'Separate routes from rules' },
      body: {
        zh: '讲解先分三条路线：riverside 平缓、main trail 中等、summit loop 陡且多石；后半段是无痕规则与地段建议。听到 route、trail、loop 记路线特征，听到 rule、must、please 记行为要求。',
        en: 'The briefing splits three routes: riverside flat, main trail moderate, summit loop steep and rocky. The second half covers leave-no-trace rules and area advice. Note route features after route, trail or loop; note rules after rule, must or please.',
      },
    },
  ],
};
