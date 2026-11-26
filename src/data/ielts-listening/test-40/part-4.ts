import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 40 · Part 4 — 讲座：地图史（单人，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 结构：早期载体与手抄 → 投影问题 → 测绘工具 → 政治表达与商路（填空 31–35）→
 * 历史两大特征（多选 36–37）→ 投影作用、测绘精度与讲座主旨（单选 38–40）。
 */
export const test40Part4: ListeningLesson = {
  slug: 'test-40-part-4',
  part: 4,
  status: 'published',
  title: { zh: '地图史', en: 'The history of maps' },
  summary: {
    zh: '讲座回顾地图从泥板、羊皮纸手抄起步，投影如何把圆球世界铺到平面上，早期测绘员用测链与罗盘逐段丈量，地图如何承载领土主张等政治信息，以及商路如何绘入地图；归纳前印刷时代手抄地图、统治者借地图拓土两大特征，再解释投影解决的问题、测绘工具带来的精度提升，指出地图史是知识、权力与导航的交汇。',
    en: 'The lecture traces maps from clay tablets and parchment copies, projections placing a round Earth on a flat surface, early surveyors with chains and compasses, maps carrying claims to territory, and trade routes on sheets. It lists hand copied pre print maps and rulers claiming land, then explains the projection problem, surveying accuracy gains, and maps as knowledge, power and navigation.',
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
        { lead: 'Early maps were drawn on clay', cells: [[{ blank: 31 }]] },
        { lead: 'A projection shows the round Earth on a flat', cells: [[{ blank: 32 }]] },
        { lead: 'Early surveyors measured distance with chains and', cells: [[{ blank: 33 }]] },
        { lead: 'Maps carried political messages about', cells: [[{ blank: 34 }]] },
        { lead: 'Maps guided travellers along marked', cells: [[{ blank: 35 }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO features run through the history of maps? Choose TWO letters, A–F.',
      select: 2,
      stem: 'Which TWO features run through the history of maps?',
      options: [
        { key: 'A', text: 'maps were once hand copied by scribes' },
        { key: 'B', text: 'every early map showed the whole planet correctly' },
        { key: 'C', text: 'rulers used maps to claim land' },
        { key: 'D', text: 'GPS replaced all paper maps' },
        { key: 'E', text: 'surveying tools improved accuracy over time' },
        { key: 'F', text: 'ancient maps had no written labels' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 38,
          stem: 'What problem does a map projection solve?',
          options: [
            { key: 'A', text: 'showing a round world on a flat map' },
            { key: 'B', text: 'printing copies without error' },
            { key: 'C', text: 'measuring long distances at sea' },
          ],
        },
        {
          number: 39,
          stem: 'How did surveying tools change the accuracy of maps?',
          options: [
            { key: 'A', text: 'measurements became more accurate' },
            { key: 'B', text: 'maps could be sold cheaply' },
            { key: 'C', text: 'rulers could draw borders themselves' },
          ],
        },
        {
          number: 40,
          stem: 'What is the main point of this short history?',
          options: [
            { key: 'A', text: 'maps record knowledge, power and navigation across history' },
            { key: 'B', text: 'map making began with satellite photos' },
            { key: 'C', text: 'ancient maps were purely decorative' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['tablets'], evidence: 3,
      explanation: {
        zh: '定位句 3：Early maps were drawn on clay tablets, and later on parchment and paper。早期地图画在泥板上，填 tablets；羊皮纸与纸张是后来的载体。',
        en: 'Sentence 3: "Early maps were drawn on clay tablets, and later on parchment and paper". Early maps were on clay tablets, so fill tablets. Parchment and paper came later.',
      },
    },
    {
      number: 32, accepted: ['surface'], evidence: 8,
      explanation: {
        zh: '定位句 8：A map projection shows the round Earth on a flat surface, by stretching or cutting the picture in some way。投影把圆球地球呈现在平面上，填 surface。',
        en: 'Sentence 8: "A map projection shows the round Earth on a flat surface, by stretching or cutting the picture in some way". The projection places the round Earth on a flat surface, so fill surface.',
      },
    },
    {
      number: 33, accepted: ['compasses'], evidence: 12,
      explanation: {
        zh: '定位句 12：Early surveyors measured distance with chains and compasses, walking the land line by line。早期测绘员用测链和罗盘测距，填 compasses；测链已在题干给出。',
        en: 'Sentence 12: "Early surveyors measured distance with chains and compasses, walking the land line by line". Early surveyors used chains and compasses, so fill compasses. Chains are already in the question.',
      },
    },
    {
      number: 34, accepted: ['territory'], evidence: 15,
      explanation: {
        zh: '定位句 15：Maps were never only practical documents. They also carried political messages about territory。地图承载关于领土的政治信息，填 territory。',
        en: 'Sentence 15: "Maps were never only practical documents. They also carried political messages about territory". Maps carried political messages about territory, so fill territory.',
      },
    },
    {
      number: 35, accepted: ['routes'], evidence: 19,
      explanation: {
        zh: '定位句 19：Trade routes appeared on maps too, linking ports, markets and inland towns。地图上的商路连接港口、市场与内陆城镇，填 routes。',
        en: 'Sentence 19: "Trade routes appeared on maps too, linking ports, markets and inland towns". Trade routes on maps linked ports, markets and inland towns, so fill routes.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：In the age before printing, maps were hand copied by scribes, and each copy took skilled work。前印刷时代地图由抄写员手抄，对应 A。',
        en: 'Sentence 26: "In the age before printing, maps were hand copied by scribes, and each copy took skilled work", matching A.',
      },
    },
    {
      number: 37, accepted: ['C'], evidence: 27,
      explanation: {
        zh: '定位句 27：Rulers used maps to claim land, mark borders and show the reach of their authority。统治者借地图主张土地、划定边界，对应 C。',
        en: 'Sentence 27: "Rulers used maps to claim land, mark borders and show the reach of their authority", matching C.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 33,
      explanation: {
        zh: '定位句 33：It solves the basic problem of showing a round world on a flat map, where distances and areas must be balanced。投影解决圆球世界上平面地图的问题，对应 A。印刷误差与海上测距不是投影功能。',
        en: 'Sentence 33: "It solves the basic problem of showing a round world on a flat map, where distances and areas must be balanced", matching A. Printing error and sea distance measurement are not what projections do.',
      },
    },
    {
      number: 39, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：Measurements became more accurate as instruments improved, allowing borders and streets to be drawn with confidence。工具改进让测量更精确，对应 A。售价与统治者自绘边界不在其中。',
        en: 'Sentence 36: "Measurements became more accurate as instruments improved, allowing borders and streets to be drawn with confidence", matching A. Price and rulers drawing borders themselves are not covered.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 41,
      explanation: {
        zh: '定位句 41：Maps record knowledge, power and navigation across history, rather than one single technical story。主旨是地图史记录知识、权力与导航，对应 A。',
        en: 'Sentence 41: "Maps record knowledge, power and navigation across history, rather than one single technical story", matching A.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'The earliest known map was drawn on clay more than four thousand years ago.' },
    { speaker: 'lecturer', text: 'That map showed rivers, hills and towns around a single city valley.' },
    { speaker: 'lecturer', text: 'Maps have always been more than pictures of the land; they record how people understand their world.' },
    { speaker: 'lecturer', text: 'Early maps were drawn on clay tablets, and later on parchment and paper.' },
    { speaker: 'lecturer', text: 'Before printing, maps were hand copied by scribes, who drew each coastline and river by hand.' },
    { speaker: 'lecturer', text: 'Copies slowly drifted from the original, because each hand drawn version could introduce a small error.' },
    { speaker: 'lecturer', text: 'As sailors travelled farther, maps had to show wider seas and more distant coasts.' },
    { speaker: 'lecturer', text: 'One persistent problem is that the Earth is round, while any map is flat.' },
    { speaker: 'lecturer', text: 'A map projection shows the round Earth on a flat surface, by stretching or cutting the picture in some way.' },
    { speaker: 'lecturer', text: 'Every projection keeps some features accurate and distorts others, so no flat map is perfect.' },
    { speaker: 'lecturer', text: 'Some projections favour the size of continents, while others keep the shape of countries.' },
    { speaker: 'lecturer', text: 'Surveying changed what maps could show on the ground.' },
    { speaker: 'lecturer', text: 'Early surveyors measured distance with chains and compasses, walking the land line by line.' },
    { speaker: 'lecturer', text: 'Later instruments allowed longer sightings, and roads and borders could be drawn with more care.' },
    { speaker: 'lecturer', text: 'The growth of cities made detailed maps useful for streets, land ownership and public works.' },
    { speaker: 'lecturer', text: 'Maps were never only practical documents. They also carried political messages about territory.' },
    { speaker: 'lecturer', text: 'Rulers used maps to claim land, mark borders and project their power over regions.' },
    { speaker: 'lecturer', text: 'A map could make a kingdom look larger or more unified than its rivals.' },
    { speaker: 'lecturer', text: 'Colours and names on a map could support a ruler’s claim to an area.' },
    { speaker: 'lecturer', text: 'Trade routes appeared on maps too, linking ports, markets and inland towns.' },
    { speaker: 'lecturer', text: 'As printing spread, maps reached more readers and could be sold as separate sheets.' },
    { speaker: 'lecturer', text: 'Explorers filled blank spaces on older maps as they reached new coasts and rivers.' },
    { speaker: 'lecturer', text: 'Missing land was often filled with imagined creatures or unknown seas, before surveys reached it.' },
    { speaker: 'lecturer', text: 'The nineteenth century brought large national surveys, which mapped whole countries in careful detail.' },
    { speaker: 'lecturer', text: 'Those surveys set the basis for the street maps still used in many cities today.' },
    { speaker: 'lecturer', text: 'Now let us look at two features that run through this long history.' },
    { speaker: 'lecturer', text: 'In the age before printing, maps were hand copied by scribes, and each copy took skilled work.' },
    { speaker: 'lecturer', text: 'Rulers used maps to claim land, mark borders and show the reach of their authority.' },
    { speaker: 'lecturer', text: 'Not every early map showed the whole planet correctly, since large parts were still unknown to its makers.' },
    { speaker: 'lecturer', text: 'Paper maps have not disappeared, even after satellite navigation became common.' },
    { speaker: 'lecturer', text: 'Surveying tools improved accuracy over time, from chains and compasses to precise optical instruments.' },
    { speaker: 'lecturer', text: 'Ancient maps often carried written labels for towns, rivers and mountain ranges.' },
    { speaker: 'lecturer', text: 'So why does a map projection matter for the modern reader?' },
    { speaker: 'lecturer', text: 'It solves the basic problem of showing a round world on a flat map, where distances and areas must be balanced.' },
    { speaker: 'lecturer', text: 'Knowing the projection helps a reader judge which sizes and shapes can be trusted.' },
    { speaker: 'lecturer', text: 'How did surveying tools change the accuracy of maps?' },
    { speaker: 'lecturer', text: 'Measurements became more accurate as instruments improved, allowing borders and streets to be drawn with confidence.' },
    { speaker: 'lecturer', text: 'Modern maps guide navigation through satellite signals, which fix the position of the receiver above the ground.' },
    { speaker: 'lecturer', text: 'Digital maps update traffic, closed roads and new buildings far faster than printed sheets can.' },
    { speaker: 'lecturer', text: 'Yet the idea of a map remains the same, a frame of reference between a person and a place.' },
    { speaker: 'lecturer', text: 'What is the main point of this short history?' },
    { speaker: 'lecturer', text: 'Maps record knowledge, power and navigation across history, rather than one single technical story.' },
    { speaker: 'lecturer', text: 'The land measured, the rulers who claimed it, and the travellers who followed routes all left their mark.' },
    { speaker: 'lecturer', text: 'Modern navigation still rests on those centuries of observation and drawing.' },
    { speaker: 'lecturer', text: 'Next week we will compare maps and globes as two ways of showing the Earth.' },
    { speaker: 'lecturer', text: 'The reading list on the course page includes a short book on early surveying.' },
    { speaker: 'lecturer', text: 'A map from the eighteenth century will be shown in the next class.' },
    { speaker: 'lecturer', text: 'Take notes on how its borders and names differ from a modern street map.' },
    { speaker: 'lecturer', text: 'If a term such as projection is unclear, check the glossary before the tutorial.' },
    { speaker: 'lecturer', text: 'The slides from this talk are posted with the old map images in the shared folder.' },
    { speaker: 'lecturer', text: 'Questions can be written on the card by the door and answered after the break.' },
    { speaker: 'lecturer', text: 'Before we finish, one reminder about the homework map exercise.' },
    { speaker: 'lecturer', text: 'Trace the route from the port to the inland town on the nineteenth century sheet.' },
    { speaker: 'lecturer', text: 'Note which distances are marked, and which gaps the mapmaker left open.' },
  ],
  vocabulary: [
    {
      term: 'projection', phonetic: '/prəˈdʒekʃn/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '地图投影', en: 'the method that places a round Earth on a flat map' },
      usage: { zh: '可数名词；a map projection、the projection type。', en: 'Countable: a map projection, the projection type.' },
      collocations: ['a map projection', 'the projection type', 'choose a projection'],
      example: { en: 'A projection shows the Earth on a flat surface.', zh: '投影把地球呈现在平面上。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈdʒek/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'surveyors', phonetic: '/səˈveɪəz/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '测绘员，土地测量员', en: 'the person who measures distances and land on the ground' },
      usage: { zh: '可数名词；early surveyors、the land surveyor。动词 survey。', en: 'Countable: early surveyors, the land surveyor; the verb is survey.' },
      collocations: ['early surveyors', 'the land surveyor', 'a surveyor measures'],
      example: { en: 'Early surveyors measured with chains and compasses.', zh: '早期测绘员用测链和罗盘测量。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈveɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'territory', phonetic: '/ˈterətri/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '领土，管辖区域', en: 'the land claimed and ruled by a government or ruler' },
      usage: { zh: '可数/不可数；political territory、claim the territory。', en: 'Political territory, claim the territory.' },
      collocations: ['claim the territory', 'political territory', 'hold territory'],
      example: { en: 'Maps carried messages about territory.', zh: '地图承载领土信息。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈter/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'scribes', phonetic: '/skraɪbz/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '抄写员，文书', en: 'the person who copied maps by hand before printing' },
      usage: { zh: '可数名词；the scribes、a medieval scribe。复数 scribes。', en: 'Countable: the scribes, a medieval scribe; plural scribes.' },
      collocations: ['the scribes', 'copy by a scribe', 'medieval scribes'],
      example: { en: 'Scribes copied each coastline by hand.', zh: '抄写员手绘每条海岸线。' },
      listening: { zh: '单音节，与 bribe 押韵。', en: 'One syllable, rhyming with bribe.' },
    },
    {
      term: 'parchment', phonetic: '/ˈpɑːtʃmənt/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '羊皮纸', en: 'the prepared animal skin used for early maps and documents' },
      usage: { zh: '不可数；on parchment、a parchment sheet。', en: 'Uncountable: on parchment, a parchment sheet.' },
      collocations: ['on parchment', 'a parchment sheet', 'parchment maps'],
      example: { en: 'Later maps were drawn on parchment and paper.', zh: '后来的地图画在羊皮纸和纸上。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpɑːt/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'inland', phonetic: '/ˈɪnlənd/', partOfSpeech: 'adj.', sentenceIndex: 19,
      meaning: { zh: '内陆的，内地的', en: 'away from the coast, toward the interior' },
      usage: { zh: '形容词；inland towns、the inland route。', en: 'Inland towns, the inland route.' },
      collocations: ['inland towns', 'the inland route', 'inland areas'],
      example: { en: 'Routes linked ports to inland towns.', zh: '路线把港口与内陆城镇相连。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɪn/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'optical', phonetic: '/ˈɒptɪkl/', partOfSpeech: 'adj.', sentenceIndex: 30,
      meaning: { zh: '光学的，仪器目视的', en: 'using lenses and sight for precise measurement' },
      usage: { zh: '形容词；optical instruments、the optical sight。', en: 'Optical instruments, the optical sight.' },
      collocations: ['optical instruments', 'the optical sight', 'optical surveying'],
      example: { en: 'Later tools were precise optical instruments.', zh: '后来的工具是精密光学仪器。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈɒp/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'receiver', phonetic: '/rɪˈsiːvə/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '接收器，导航终端', en: 'the device that picks up satellite position signals' },
      usage: { zh: '可数名词；the receiver position、a navigation receiver。', en: 'Countable: the receiver position, a navigation receiver.' },
      collocations: ['the satellite receiver', 'the receiver position', 'a navigation receiver'],
      example: { en: 'Signals fix the receiver’s position.', zh: '信号确定接收器位置。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsiː/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'hand copied', sentenceIndex: 4,
      meaning: { zh: '手工抄写的', en: 'reproduced by hand rather than printed' },
      usage: { zh: '定语搭配；hand copied maps、be copied by hand。', en: 'Attributive: hand copied maps, be copied by hand.' },
      example: { en: 'Maps were hand copied by scribes.', zh: '地图由抄写员手抄。' },
    },
    {
      phrase: 'drifted from', sentenceIndex: 5,
      meaning: { zh: '偏离（原图）', en: 'to move away from the original over copies' },
      usage: { zh: '不及物；copies drift from the original。', en: 'Intransitive: copies drift from the original.' },
      example: { en: 'Copies slowly drifted from the original.', zh: '副本逐渐偏离原图。' },
    },
    {
      phrase: 'filled blank spaces', sentenceIndex: 21,
      meaning: { zh: '填补地图空白处', en: 'to add unknown coasts and rivers to an empty map' },
      usage: { zh: '及物；fill blank spaces on the map。', en: 'Transitive: fill blank spaces on the map.' },
      example: { en: 'Explorers filled blank spaces on old maps.', zh: '探险家填补旧图空白。' },
    },
    {
      phrase: 'left their mark', sentenceIndex: 42,
      meaning: { zh: '留下印记，产生影响', en: 'to have a lasting effect on the map record' },
      usage: { zh: '及物；rulers left their mark、leave one’s mark。', en: 'Transitive: rulers left their mark, leave one’s mark.' },
      example: { en: 'Travellers who followed routes left their mark.', zh: '循路而行的旅人留下印记。' },
    },
    {
      phrase: 'rests on', sentenceIndex: 43,
      meaning: { zh: '建立在…基础上', en: 'to rely on centuries of earlier observation' },
      usage: { zh: '及物；navigation rests on old surveys。', en: 'Transitive: navigation rests on old surveys.' },
      example: { en: 'Modern navigation rests on old observations.', zh: '现代导航建立在旧时观测之上。' },
    },
  ],
  tips: [
    {
      title: { zh: '载体与工具按年代成对记', en: 'Pair materials with tools by period' },
      body: {
        zh: '早期泥板、羊皮纸、纸张；早期测链罗盘，后期光学仪器。填空题常把工具安到另一时期，听时抓住 clay、parchment、chains、compasses 各自对应的阶段。',
        en: 'Materials go clay, parchment, paper; tools go chains and compasses, then optical instruments. Fill-ins attach a tool to the wrong period; catch clay, parchment, chains and compasses with their stages.',
      },
    },
    {
      title: { zh: '多选区分史实与绝对说法', en: 'Rule out absolute claims in multiple choice' },
      body: {
        zh: '手抄地图、统治者借地图拓土是史实；早期地图不可能画对整个星球、GPS 没有取代全部纸图、古图都有文字标注。选项出现 every、all、no 这类绝对词时回听原文是否成立。',
        en: 'Hand copied maps and rulers claiming land are facts; early maps could not show the whole planet correctly, GPS did not replace all paper maps, and ancient maps carried labels. At every, all or no, check whether the recording supports it.',
      },
    },
    {
      title: { zh: '主旨题覆盖三条线索', en: 'The conclusion covers three threads' },
      body: {
        zh: '最后一题选能概括测得的土地、拓土的统治者、循路的旅人这条主线，即知识、权力与导航；把地图史简化成单一技术故事或装饰用途的选项是细节干扰。',
        en: 'The final question covers measured land, claiming rulers and following travellers, that is knowledge, power and navigation. Options reducing history to one technical story or decoration are detail distractors.',
      },
    },
  ],
};
