import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 36 · Part 4 — 锂电池回收（单人讲座，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 结构：到厂分拣 → 拆包分离电芯 → 封闭破碎 → 湿法冶金提金属（笔记填空 31–36）；
 * 后半段讲放电防火、破碎工序、粉尘与化学品风险、金属回流电池生产的产业闭环（单选 37–40）。
 * 笔记块在前，单选块在后，题块顺序与讲座顺序一致。开场用现象引入，不用 Today's lecture is about 句式。
 */
export const test36Part4: ListeningLesson = {
  slug: 'test-36-part-4',
  part: 4,
  status: 'published',
  title: { zh: '锂电池回收', en: 'Recycling lithium batteries' },
  summary: {
    zh: '讲座讲解废旧锂电池的回收链条：到厂先按类型分拣、拆除外包装分离电芯，电芯进入封闭破碎机破碎，再经湿法冶金在酸液中溶解，回收锂、钴、镍等金属并送回新电池生产；后半段说明放电以防短路起火、封闭破碎的工序作用、粉尘与化学品暴露等安全风险，以及回收金属回流电池制造如何形成产业闭环。',
    en: 'The lecture traces spent lithium batteries from sorting by type, pack removal and cell separation through a sealed shredder and wet chemistry in acid, recovering lithium, cobalt and nickel for new batteries. It then covers discharging against short circuits and fire, what shredding does, dust and chemical exposure as the main risk, and returning metals to production to close the loop.',
  },
  accent: { zh: '讲师为新西兰口音，术语处放慢并重复。', en: 'The lecturer has a New Zealand accent and slows down for technical terms.' },
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
        { lead: 'Recovered metals go back into new', cells: [[{ blank: 31 }]] },
        { lead: 'Batteries arrive sorted by', cells: [[{ blank: 32 }]] },
        { lead: 'First stage removes the outer', cells: [[{ blank: 33 }, { text: ' and separates cells.' }]] },
        { lead: 'Cells are broken in a closed', cells: [[{ blank: 34 }]] },
        { lead: 'Wet chemistry dissolves metals in', cells: [[{ blank: 35 }, { text: ' solutions.' }]] },
        { lead: 'Recovered metals include lithium, cobalt and', cells: [[{ blank: 36 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 37,
          stem: 'Why are batteries discharged before dismantling?',
          options: [
            { key: 'A', text: 'To prevent short circuits and fire' },
            { key: 'B', text: 'To save storage space in the warehouse' },
            { key: 'C', text: 'To speed up the sorting line' },
          ],
        },
        {
          number: 38,
          stem: 'What does the shredding stage do?',
          options: [
            { key: 'A', text: 'It melts the casing in an open furnace' },
            { key: 'B', text: 'It breaks cells inside a sealed machine' },
            { key: 'C', text: 'It washes cells with plain water only' },
          ],
        },
        {
          number: 39,
          stem: 'What is the main safety risk in the plant?',
          options: [
            { key: 'A', text: 'Noise from the conveyor belts' },
            { key: 'B', text: 'Falling from high storage shelves' },
            { key: 'C', text: 'Dust and chemical exposure' },
          ],
        },
        {
          number: 40,
          stem: 'What closes the recycling loop?',
          options: [
            { key: 'A', text: 'Returning recovered metals to battery production' },
            { key: 'B', text: 'Selling all scrap to general steel mills' },
            { key: 'C', text: 'Burying the black powder in landfill' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['batteries'], evidence: 5,
      explanation: {
        zh: '定位句 5：Proper recycling protects workers and keeps valuable metals out of landfill and back toward new batteries。回收金属送回新电池，填复数 batteries。',
        en: 'Sentence 5: "Proper recycling protects workers and keeps valuable metals out of landfill and back toward new batteries". Metals go back to new batteries, so write the plural batteries.',
      },
    },
    {
      number: 32, accepted: ['type'], evidence: 7,
      explanation: {
        zh: '定位句 7：They are first sorted by type, because each chemistry needs a different treatment line。到厂先按类型分拣，填 type。句 8 的外壳检查是分拣后的下一步，不是分拣依据。',
        en: 'Sentence 7: "They are first sorted by type, because each chemistry needs a different treatment line". Batteries are sorted by type, so write type. The casing check in sentence 8 follows sorting and is not the sorting basis.',
      },
    },
    {
      number: 33, accepted: ['pack'], evidence: 10,
      explanation: {
        zh: '定位句 10：The first processing stage removes the outer pack and separates the individual cells inside。第一道工序拆除外包装、分离电芯，填 pack。句 11 的 wires 是随包装剥离的附件，不是被移除的主体。',
        en: 'Sentence 10: "The first processing stage removes the outer pack and separates the individual cells inside". The outer pack is removed, so write pack. The wires in sentence 11 are stripped with it, not the main removed item.',
      },
    },
    {
      number: 34, accepted: ['shredder'], evidence: 13,
      explanation: {
        zh: '定位句 13：Once discharged, the cells go into a closed shredder, which breaks them into small pieces。电芯进入封闭破碎机，填 shredder。句 14 的 sealed 是机器特征，不是设备名称。',
        en: 'Sentence 13: "Once discharged, the cells go into a closed shredder, which breaks them into small pieces". Cells enter a closed shredder, so write shredder. Sealed in sentence 14 describes the machine, not its name.',
      },
    },
    {
      number: 35, accepted: ['acid'], evidence: 19,
      explanation: {
        zh: '定位句 19：Hydrometallurgy dissolves the powder in acid solutions, so the metals separate from the waste material。湿法冶金在酸液中溶解粉末，填 acid；solutions 已印在卷面上。',
        en: 'Sentence 19: "Hydrometallurgy dissolves the powder in acid solutions, so the metals separate from the waste material". Powder dissolves in acid solutions; solutions is printed, so write acid.',
      },
    },
    {
      number: 36, accepted: ['nickel'], evidence: 22,
      explanation: {
        zh: '定位句 22：The key metals recovered this way include lithium, cobalt and nickel, along with copper from the foil。回收金属含锂、钴、镍，填 nickel；copper 来自箔材，是附带回收项。',
        en: 'Sentence 22: "The key metals recovered this way include lithium, cobalt and nickel, along with copper from the foil". The metals include nickel, so write nickel. Copper from the foil is an extra recovered item.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：Before dismantling, every battery is discharged, so the cells hold little or no remaining charge. This step prevents short circuits that could spark a fire inside the plant。放电是为防短路起火，对应 A。B 的省仓储空间与 C 的加快分拣在录音中均未出现。',
        en: 'Sentence 26: "Before dismantling, every battery is discharged, so the cells hold little or no remaining charge. This step prevents short circuits that could spark a fire inside the plant". Discharging prevents short circuits and fire, matching A. Saving space and speeding sorting are not mentioned.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：Once discharged, the cells go into a closed shredder, which breaks them into small pieces. The shredder stays sealed, so dust and fumes cannot escape。破碎工序在封闭机器内完成，对应 B。A 的露天熔炉熔化与 C 的仅清水冲洗在录音中没有依据。',
        en: 'Sentence 27: "Once discharged, the cells go into a closed shredder, which breaks them into small pieces. The shredder stays sealed, so dust and fumes cannot escape". Shredding breaks cells in a sealed machine, matching B. An open furnace and plain-water washing are not claimed.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 28,
      explanation: {
        zh: '定位句 28：The main risk in the plant is exposure to fine dust and the chemicals used in the acid baths。主要风险是粉尘与化学品暴露，对应 C。A 的传送带噪音与 B 的货架坠落未被点名为主要风险。',
        en: 'Sentence 28: "The main risk in the plant is exposure to fine dust and the chemicals used in the acid baths". Dust and chemical exposure match C. Belt noise and falling from shelves are not named as the main risk.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 34,
      explanation: {
        zh: '定位句 34：Closing the recycling loop means returning these metals to battery production rather than selling them as scrap。产业闭环是把金属送回电池生产，对应 A。B 的卖给普通钢厂与 C 的粉末填埋都打破闭环，与句中 rather than 相反。',
        en: 'Sentence 34: "Closing the recycling loop means returning these metals to battery production rather than selling them as scrap". Returning metals to battery production matches A. Selling scrap to steel mills and burying powder break the loop, contrary to rather than.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'A single mobile phone battery can travel through mines, factories and shops before it ever reaches a recycling plant.' },
    { speaker: 'lecturer', text: 'Today we look at what happens after that battery is no longer charged, and how its metals can come back into use.' },
    { speaker: 'lecturer', text: 'Lithium batteries now power phones, laptops, tools and an increasing share of electric vehicles.' },
    { speaker: 'lecturer', text: 'Once a battery no longer holds its charge, it should not be thrown in the general waste bin.' },
    { speaker: 'lecturer', text: 'The cells hold reactive chemicals, and a damaged pack can overheat or catch fire.' },
    { speaker: 'lecturer', text: 'Proper recycling protects workers and keeps valuable metals out of landfill and back toward new batteries.' },
    { speaker: 'lecturer', text: 'The process begins when used batteries arrive at the recycling centre.' },
    { speaker: 'lecturer', text: 'They are first sorted by type, because each chemistry needs a different treatment line.' },
    { speaker: 'lecturer', text: 'Staff check the outer casing for swelling, leaks or damage before anything else opens the pack.' },
    { speaker: 'lecturer', text: 'Any battery that looks unsafe is set aside in a fireproof container for special handling.' },
    { speaker: 'lecturer', text: 'The first processing stage removes the outer pack and separates the individual cells inside.' },
    { speaker: 'lecturer', text: 'The pack and its wires are stripped out, and the cells move on to the next machine.' },
    { speaker: 'lecturer', text: 'A magnetic stage pulls out the steel and aluminium pieces for separate recovery.' },
    { speaker: 'lecturer', text: 'Once discharged, the cells go into a closed shredder, which breaks them into small pieces.' },
    { speaker: 'lecturer', text: 'The shredder stays sealed, so dust and fumes cannot escape into the working area.' },
    { speaker: 'lecturer', text: 'Inside, the hard casing, metal foil and black powder are broken apart together.' },
    { speaker: 'lecturer', text: 'The remaining black powder carries the metals that matter most to battery makers.' },
    { speaker: 'lecturer', text: 'From here, most modern plants use hydrometallurgy to recover those metals.' },
    { speaker: 'lecturer', text: 'Wet chemistry dissolves the powder, so the metals separate from the waste material.' },
    { speaker: 'lecturer', text: 'Hydrometallurgy dissolves the powder in acid solutions, so the metals separate from the waste material.' },
    { speaker: 'lecturer', text: 'Different chemical conditions bring one metal out of the solution at a time.' },
    { speaker: 'lecturer', text: 'The liquid is filtered and treated, and the recovered metals settle as solid salts or powders.' },
    { speaker: 'lecturer', text: 'The key metals recovered this way include lithium, cobalt and nickel, along with copper from the foil.' },
    { speaker: 'lecturer', text: 'Each metal is tested for purity before it leaves the plant.' },
    { speaker: 'lecturer', text: 'Some plants also use a heating stage to burn off binding materials, but wet chemistry remains the main route for these metals.' },
    { speaker: 'lecturer', text: 'Safety is the thread running through every step of the process.' },
    { speaker: 'lecturer', text: 'Before dismantling, every battery is discharged, so the cells hold little or no remaining charge. This step prevents short circuits that could spark a fire inside the plant.' },
    { speaker: 'lecturer', text: 'Once discharged, the cells go into a closed shredder, which breaks them into small pieces. The shredder stays sealed, so dust and fumes cannot escape.' },
    { speaker: 'lecturer', text: 'The main risk in the plant is exposure to fine dust and the chemicals used in the acid baths.' },
    { speaker: 'lecturer', text: 'Workers wear gloves, eye protection and masks when handling damaged packs or powder.' },
    { speaker: 'lecturer', text: 'Ventilation keeps the air clean, and spill kits stand ready for any leak on the floor.' },
    { speaker: 'lecturer', text: 'Fire detection equipment watches the shredder and the storage area around the clock.' },
    { speaker: 'lecturer', text: 'A battery that heats up or leaks is moved outside, away from the main production line.' },
    { speaker: 'lecturer', text: 'Even with these controls, the plants train staff to recognise warning signs before a problem grows.' },
    { speaker: 'lecturer', text: 'Closing the recycling loop means returning these metals to battery production rather than selling them as scrap.' },
    { speaker: 'lecturer', text: 'Refined cobalt and nickel go back into cathode material for new cells.' },
    { speaker: 'lecturer', text: 'Lithium is purified and sold to battery makers, who mix it into new electrolyte or cathode recipes.' },
    { speaker: 'lecturer', text: 'Copper from the foil returns to wire and electrical components.' },
    { speaker: 'lecturer', text: 'When recovered metals replace freshly mined ore, the total environmental cost of each battery drops.' },
    { speaker: 'lecturer', text: 'The loop still has weak spots, though. Some batteries are too mixed or damaged to separate cleanly.' },
    { speaker: 'lecturer', text: 'Collection rates stay low in many regions, so many spent batteries never reach a plant at all.' },
    { speaker: 'lecturer', text: 'Small worn-out packs often sit in drawers or general waste instead of the designated drop-off points.' },
    { speaker: 'lecturer', text: 'Design also matters. Batteries that are easier to open and sort recycle more cheaply than sealed complex packs.' },
    { speaker: 'lecturer', text: 'Researchers are looking for simpler chemistries that split apart with fewer chemicals.' },
    { speaker: 'lecturer', text: 'Policy and public habits will decide how much of the stream can actually be recycled.' },
    { speaker: 'lecturer', text: 'To summarise, the route from a spent pack to a new cell runs through sorting, dismantling, shredding, wet chemistry and refining.' },
    { speaker: 'lecturer', text: 'Along the way, the plant guards against short circuits, dust and chemical exposure at each stage.' },
    { speaker: 'lecturer', text: 'The recovered metals then feed back into fresh batteries, which is what makes the system a true closed loop.' },
    { speaker: 'lecturer', text: 'Without that return path, recycled material would be sold off for lower-value uses, and the loop would break.' },
    { speaker: 'lecturer', text: 'In the next session we will compare this wet route with the newer thermal recycling methods now being tested.' },
    { speaker: 'lecturer', text: 'For today, the main point is that battery recycling is not a single step but a chain of controlled processes.' },
  ],
  vocabulary: [
    {
      term: 'hydrometallurgy', phonetic: '/ˌhaɪdrəʊmeˈtælədʒi/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '湿法冶金（用酸液溶解回收金属）', en: 'the wet chemical route that dissolves powder to recover metals' },
      usage: { zh: '不可数；hydrometallurgy route、wet chemistry。对比火法冶金 pyrometallurgy。', en: 'Uncountable: hydrometallurgy route, wet chemistry. Contrast pyrometallurgy.' },
      collocations: ['hydrometallurgy route', 'use hydrometallurgy', 'hydrometallurgy recovers'],
      example: { en: 'Most plants use hydrometallurgy to recover the battery metals.', zh: '多数工厂用湿法冶金回收电池金属。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈtæl/；开头 hydro- 读 /ˈhaɪ/。', en: 'Five syllables with stress on the third; the opening hydro- is /ˈhaɪ/.' },
    },
    {
      term: 'shredder', phonetic: '/ˈʃredər/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '破碎机，撕碎机', en: 'the sealed machine that breaks cells into small pieces' },
      usage: { zh: '可数；closed shredder、the shredder stays sealed。动词 shred。', en: 'Countable: closed shredder. The verb is shred.' },
      collocations: ['the closed shredder', 'the shredder stays sealed', 'the shredder breaks'],
      example: { en: 'Cells go into the closed shredder before wet chemistry starts.', zh: '湿法处理前，电芯先进入封闭破碎机。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈʃred/；结尾 /ər/ 轻读。', en: 'Two syllables, first stress; the ending /ər/ is weak.' },
    },
    {
      term: 'cathode', phonetic: '/ˈkæθəʊd/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '正极，阴极材料', en: 'the positive electrode material inside a cell' },
      usage: { zh: '可数；cathode material、cathode recipe。对比 anode 负极。', en: 'Countable: cathode material. Contrast anode.' },
      collocations: ['cathode material', 'the cathode recipe', 'cobalt in the cathode'],
      example: { en: 'Recovered cobalt and nickel go back into cathode material.', zh: '回收的钴和镍回到正极材料中。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkæθ/；th 读 /θ/。', en: 'Two syllables, first stress; th is /θ/.' },
    },
    {
      term: 'electrolyte', phonetic: '/ɪˈlektrəlaɪt/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '电解液', en: 'the liquid inside a cell that carries ions between electrodes' },
      usage: { zh: '可数/不可数；new electrolyte、battery electrolyte。', en: 'Countable or uncountable: new electrolyte, battery electrolyte.' },
      collocations: ['the battery electrolyte', 'new electrolyte recipes', 'the electrolyte carries ions'],
      example: { en: 'Purified lithium is mixed into new electrolyte recipes.', zh: '提纯后的锂配入新的电解液配方。' },
      listening: { zh: '四个音节，重音在第一音节 /ɪˈlek/。', en: 'Four syllables with stress on the first.' },
    },
    {
      term: 'landfill', phonetic: '/ˈlændfɪl/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '垃圾填埋场', en: 'the site where waste is buried rather than recycled' },
      usage: { zh: '不可数/可数；out of landfill、go to landfill。', en: 'Uncountable or countable: out of landfill, go to landfill.' },
      collocations: ['out of landfill', 'go to landfill', 'landfill site'],
      example: { en: 'Recycling keeps battery metals out of landfill.', zh: '回收让电池金属免于填埋。' },
      listening: { zh: '复合词，重音在第一词 land；结尾 /fɪl/。', en: 'Compound with stress on land; the ending is /fɪl/.' },
    },
    {
      term: 'discharged', phonetic: '/dɪsˈtʃɑːrdʒd/', partOfSpeech: 'v.', sentenceIndex: 26,
      meaning: { zh: '已放电（剩余电量被放光）', en: 'the state after the remaining charge has been run down' },
      usage: { zh: '过去分词作表语；battery is discharged、cells are discharged。动词原形 discharge，反义 charge。', en: 'Past participle as predicate: battery is discharged. Base verb discharge; opposite charge.' },
      collocations: ['discharge the battery', 'cells are discharged', 'fully discharged'],
      example: { en: 'Every battery is discharged before it enters the plant line.', zh: '每条产线上的电池都先放电再处理。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈtʃɑːrdʒ/。', en: 'Two syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'catch fire', sentenceIndex: 4,
      meaning: { zh: '起火，着火', en: 'to begin to burn because the cells overheat' },
      usage: { zh: 'catch fire；被动 be set on fire 不同。', en: 'Catch fire; differ from be set on fire.' },
      example: { en: 'A damaged pack can overheat and catch fire.', zh: '损坏的电池包可能过热起火。' },
    },
    {
      phrase: 'sorted by type', sentenceIndex: 7,
      meaning: { zh: '按类型分拣', en: 'separated into groups according to battery chemistry' },
      usage: { zh: 'sort by + 分类标准；sort by size、sort by type。', en: 'Sort by plus the category: sort by size, sort by type.' },
      example: { en: 'Batteries are sorted by type before the treatment line.', zh: '上处理线前电池先按类型分拣。' },
    },
    {
      phrase: 'set aside', sentenceIndex: 9,
      meaning: { zh: '单独留出，另行处理', en: 'to move unsafe batteries apart for special handling' },
      usage: { zh: '可分短语；set aside the unsafe packs。', en: 'Separable: set aside the unsafe packs.' },
      example: { en: 'Unsafe packs are set aside in a fireproof container.', zh: '不安全的电池包留存在防火容器中。' },
    },
    {
      phrase: 'feed back into', sentenceIndex: 47,
      meaning: { zh: '回流到（生产环节）', en: 'to return recovered material into a fresh production chain' },
      usage: { zh: 'feed something back into；主语是回收金属。', en: 'Feed something back into; the subject is recovered metal.' },
      example: { en: 'Recovered metals feed back into fresh batteries.', zh: '回收金属回流到新电池生产。' },
    },
    {
      phrase: 'closed loop', sentenceIndex: 47,
      meaning: { zh: '闭环（材料循环回流）', en: 'a system where recovered material returns to make new products' },
      usage: { zh: '可数；a true closed loop、the recycling loop。', en: 'Countable: a true closed loop, the recycling loop.' },
      example: { en: 'Return paths make the recycling system a true closed loop.', zh: '回流路径让回收体系成为真正闭环。' },
    },
    {
      phrase: 'drop-off points', sentenceIndex: 41,
      meaning: { zh: '回收投放点', en: 'the designated places where spent batteries are handed in' },
      usage: { zh: '可数复数；designated drop-off points。', en: 'Countable plural: designated drop-off points.' },
      example: { en: 'Spent packs should go to the designated drop-off points.', zh: '废旧电池包应送到指定投放点。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记按工序段落抓名词', en: 'Catch nouns by processing stage' },
      body: {
        zh: '第 31–36 题按回流、分拣、拆包、破碎、湿法、金属名单六段排列。听到 type、pack、shredder、acid、nickel、batteries 时回到对应行；casing、foil、copper 是相邻部件或附带金属，不要填入工序行。',
        en: 'Items 31 to 36 follow return, sorting, pack removal, shredding, wet chemistry and the metal list. On type, pack, shredder, acid, nickel and batteries, return to the row. Casing, foil and copper are adjacent parts or extra metals, not the stage answers.',
      },
    },
    {
      title: { zh: '单选区分工序作用与风险类型', en: 'Separate stage function from risk type' },
      body: {
        zh: '第 37 题问放电目的、38 题问破碎工序、39 题主风险、40 题问闭环。四个问题各对应一句核心描述：prevent short circuits、sealed machine、dust and chemical exposure、return to production；听到方法名先划下句中的目的词。',
        en: 'Items 37 to 40 ask the discharge purpose, shredder function, main risk and loop closure. Each has one core line: prevent short circuits, sealed machine, dust and chemical exposure, return to production. Note the purpose word after each method name.',
      },
    },
    {
      title: { zh: '干扰项复用同段细节', en: 'Distractors reuse same-segment details' },
      body: {
        zh: '露天熔炉、清水冲洗、传送带噪音、货架坠落、普通钢厂、粉末填埋都在讲座语境里可想象，但分别被工序描述、风险归类和闭环定义排除。落笔前确认选项对应题干问的那道工序或风险，而不是顺带提到的另一细节。',
        en: 'An open furnace, plain-water washing, belt noise, shelf falls, general steel mills and powder burial are all plausible, but each is ruled out by the stage description, risk category or loop definition. Confirm the option matches the stage or risk the stem asks about.',
      },
    },
  ],
};
