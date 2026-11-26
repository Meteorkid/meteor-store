import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 33 · Part 2 — 垃圾发电厂参观导览（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 导览按进厂称重 → 料斗 → 炉膛高温 → 烟囱 → 残渣利用 → 余热供暖 →
 * 烟气净化 → 排放监测 → 比例 → 三个区域配对推进。开场用现场指引，不使用 welcome to 句式。
 */
export const test33Part2: ListeningLesson = {
  slug: 'test-33-part-2',
  part: 2,
  status: 'published',
  title: { zh: '垃圾发电厂参观', en: 'A tour of a waste-to-energy plant' },
  summary: {
    zh: '工厂导览员带访客沿玻璃走廊查看垃圾发电流程：垃圾车在入口称重后倾入中央料斗，炉膛高温燃烧，净化后的烟气经高烟囱排出，残渣灰烬作为建筑材料再利用；燃烧余热通过区域供暖网络供应本地住宅，烟气在排放前检测粉尘与排放量，最终灰烬约占原重量的十分之一。结尾把装卸区、燃烧室、过滤塔与各自功能配对。',
    en: 'A guide leads visitors through the plant: trucks are weighed and tipped into the hopper, waste burns at high temperature, cleaned gases leave through the chimney, and ash is reused as a building material. Heat feeds local homes, dust and emissions are checked before release, and final ash is about one tenth of the original weight. The closing matching links each area to its function.',
  },
  accent: { zh: '讲解员为英式口音，语速中等。', en: 'The guide has a British accent and speaks at a moderate pace.' },
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Stage in the plant', 'Detail'],
      rows: [
        { lead: 'Waste trucks tip into the central', cells: [[{ blank: 11 }]] },
        { lead: 'Furnace burns waste at a high', cells: [[{ blank: 12 }]] },
        { lead: 'Cleaned gases leave through the tall', cells: [[{ blank: 13 }]] },
        { lead: 'Ash is reused as a', cells: [[{ blank: 14 }, { text: ' material' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What does the heat from burning waste produce?',
          options: [
            { key: 'A', text: 'electricity sold only to factories' },
            { key: 'B', text: 'heat supplied to local homes' },
            { key: 'C', text: 'steam exported to other countries' },
          ],
        },
        {
          number: 16,
          stem: 'What is checked before the gas is released?',
          options: [
            { key: 'A', text: 'the level of dust and other emissions' },
            { key: 'B', text: 'the noise made by the turbines' },
            { key: 'C', text: 'the quality of water in the yard' },
          ],
        },
        {
          number: 17,
          stem: 'About how much of the original waste ends as ash?',
          options: [
            { key: 'A', text: 'about one half' },
            { key: 'B', text: 'about one quarter' },
            { key: 'C', text: 'about one tenth' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which function matches each area of the plant? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'collects waste before it burns' },
        { key: 'B', text: 'burns waste at high temperature' },
        { key: 'C', text: 'removes dust and harmful gases' },
        { key: 'D', text: 'turns ash into road base' },
        { key: 'E', text: 'releases steam to drive turbines' },
        { key: 'F', text: 'monitors stack emissions each shift' },
      ],
      items: [
        { number: 18, text: 'the loading bay' },
        { number: 19, text: 'the combustion chamber' },
        { number: 20, text: 'the filter tower' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['hopper'], evidence: 4,
      explanation: {
        zh: '定位句 4：their loads are weighed on the bridge at the entrance before they tip into the central hopper。垃圾倾入中央料斗，填 hopper。bridge 是称重桥，不是倾倒位置。',
        en: 'Sentence 4: "their loads are weighed on the bridge at the entrance before they tip into the central hopper". Waste goes into the central hopper, so write hopper. The bridge is the weighbridge, not the tipping point.',
      },
    },
    {
      number: 12, accepted: ['temperature'], evidence: 7,
      explanation: {
        zh: '定位句 7：Inside the chamber, the waste burns at a high temperature。炉膛在高温下燃烧，填 temperature。air supply 是助燃条件，不是燃烧强度。',
        en: 'Sentence 7: "Inside the chamber, the waste burns at a high temperature". Waste burns at high temperature, so write temperature. The air supply supports combustion, not the heat level.',
      },
    },
    {
      number: 13, accepted: ['chimney'], evidence: 11,
      explanation: {
        zh: '定位句 11：The gases, once cleaned, eventually leave through the tall chimney on the roof。净化烟气经高烟囱排出，填 chimney。tower 是过滤塔，不是排放出口。',
        en: 'Sentence 11: "The gases, once cleaned, eventually leave through the tall chimney on the roof". Cleaned gases leave through the chimney, so write chimney. The tower is the filter tower, not the release point.',
      },
    },
    {
      number: 14, accepted: ['building'], evidence: 12,
      explanation: {
        zh: '定位句 12：The ash is reused as a building material, mixed into road surfaces and foundations。灰烬用作建筑材料，填 building。road 是混合去向，不是材料类别。',
        en: 'Sentence 12: "The ash is reused as a building material, mixed into road surfaces and foundations". Ash becomes a building material, so write building. Road is where it is mixed, not the material category.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：Some of this energy supplies heat to local homes through a district heating network。余热供应本地住宅供暖，对应 B。A 的只卖给工厂与 C 的蒸汽出口在录音中未出现。',
        en: 'Sentence 14: "Some of this energy supplies heat to local homes through a district heating network". Heat supplies local homes, matching B. Factory-only sales and steam exports are not mentioned.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：sensors that check the level of dust and other emissions。排放前检测粉尘与其他排放量，对应 A。噪音与水质监测在全段没有依据。',
        en: 'Sentence 21: "sensors that check the level of dust and other emissions". Dust and emissions are checked before release, matching A. Noise and water quality monitoring have no basis.',
      },
    },
    {
      number: 17, accepted: ['C'], evidence: 24,
      explanation: {
        zh: '定位句 24：Roughly one tenth of the original weight arrives as ash after the process。最终灰烬约为原重量十分之一，对应 C。一半与四分之一在录音中未出现。',
        en: 'Sentence 24: "Roughly one tenth of the original weight arrives as ash after the process". Ash is about one tenth of the original, matching C. Half and a quarter are not mentioned.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：The loading bay, where trucks tip their loads, collects waste before it burns。装卸区在燃烧前汇集垃圾，对应 A。',
        en: 'Sentence 27: "The loading bay, where trucks tip their loads, collects waste before it burns". The loading bay collects waste before burning, matching A.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：The combustion chamber is the area where waste burns at high temperature。燃烧室负责高温燃烧，对应 B。',
        en: 'Sentence 28: "The combustion chamber is the area where waste burns at high temperature". The chamber burns waste at high temperature, matching B.',
      },
    },
    {
      number: 20, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：The filter tower removes dust and harmful gases from the rising smoke。过滤塔去除粉尘与有害气体，对应 C。',
        en: 'Sentence 29: "The filter tower removes dust and harmful gases from the rising smoke". The filter tower removes dust and gases, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'If you follow me along this glass walkway, you can see the waste plant working below without stepping onto the yard.' },
    { speaker: 'guide', text: 'I am your guide for the visit, and today we will trace one load of rubbish from delivery to emission.' },
    { speaker: 'guide', text: 'The plant does not simply burn whatever arrives; each load is sorted before it reaches the furnace.' },
    { speaker: 'guide', text: 'Refuse trucks arrive through the gate on the far side of the site.' },
    { speaker: 'guide', text: 'Their loads are weighed on the bridge at the entrance before they tip into the central hopper.' },
    { speaker: 'guide', text: 'The hopper is a deep concrete pit that holds several hours of waste at once.' },
    { speaker: 'guide', text: 'From there, an automatic feeder carries the material into the combustion chamber.' },
    { speaker: 'guide', text: 'Inside the chamber, the waste burns at a high temperature, which keeps the smoke steady and reduces harmful particles.' },
    { speaker: 'guide', text: 'The flames run on a controlled air supply, so the staff can adjust the heat through the day.' },
    { speaker: 'guide', text: 'Around the chamber, pipes capture the heat that the burning releases.' },
    { speaker: 'guide', text: 'That heat turns water into steam, and the steam drives turbines in the next hall.' },
    { speaker: 'guide', text: 'The gases, once cleaned, eventually leave through the tall chimney on the roof.' },
    { speaker: 'guide', text: 'The ash is reused as a building material, mixed into road surfaces and foundations.' },
    { speaker: 'guide', text: 'Only a small part of the original waste cannot be recovered and goes to a licensed landfill.' },
    { speaker: 'guide', text: 'Some of this energy supplies heat to local homes through a district heating network.' },
    { speaker: 'guide', text: 'Without the plant, that heat would be lost up the chimney, and houses would burn extra fuel.' },
    { speaker: 'guide', text: 'After burning, what remains drops onto a conveyor at the base of the chamber.' },
    { speaker: 'guide', text: 'This leftover material, mostly ash, is collected and taken to the recovery yard.' },
    { speaker: 'guide', text: 'Metal pieces are pulled from the ash by magnets and sold to recyclers.' },
    { speaker: 'guide', text: 'Now the smoke side of the plant. Hot gases leave the chamber and rise toward the filter tower.' },
    { speaker: 'guide', text: 'Inside the tower, bag filters remove dust, while scrubbers take out harmful gases before the gas can rise further.' },
    { speaker: 'guide', text: 'The cleaned stream then passes through sensors that check the level of dust and other emissions.' },
    { speaker: 'guide', text: 'If any reading rises above the limit, the plant slows the feed and alerts the control room.' },
    { speaker: 'guide', text: 'Emissions are logged continuously, and the figures are published on the plant notice board each month.' },
    { speaker: 'guide', text: 'Roughly one tenth of the original weight arrives as ash after the process.' },
    { speaker: 'guide', text: 'The rest either burns to release energy or leaves through the cleaned gas stream.' },
    { speaker: 'guide', text: 'Let us match the three main areas you can see from the walkway.' },
    { speaker: 'guide', text: 'The loading bay, where trucks tip their loads, collects waste before it burns.' },
    { speaker: 'guide', text: 'The combustion chamber is the area where waste burns at high temperature.' },
    { speaker: 'guide', text: 'The filter tower removes dust and harmful gases from the rising smoke.' },
    { speaker: 'guide', text: 'Along the side wall you can see the control room, where one operator watches the gauges.' },
    { speaker: 'guide', text: 'The recovery yard, beyond the window, stores ash waiting to be sent to road projects.' },
    { speaker: 'guide', text: 'Metal pieces are pulled from the ash by magnets and sold to recyclers.' },
    { speaker: 'guide', text: 'The plant employs local drivers, sorting staff, and engineers who keep the filters in good order.' },
    { speaker: 'guide', text: 'For safety on the tour, stay on the walkway and do not lean on the glass railings.' },
    { speaker: 'guide', text: 'Cameras are welcome, but please keep back from any open doorway ahead.' },
    { speaker: 'guide', text: 'The next stop is the education room, where a short film shows the plant year round.' },
    { speaker: 'guide', text: 'Before we move, are there any questions about the furnace or the filters?' },
    { speaker: 'guide', text: 'The leaflet on your seat lists the visiting hours and the booking form for school groups.' },
    { speaker: 'guide', text: 'Waste collected in this area would otherwise sit in open ground for decades.' },
    { speaker: 'guide', text: 'The plant cuts the volume of rubbish going to landfill by around three quarters.' },
    { speaker: 'guide', text: 'It also reduces the need to open new waste sites near residential areas.' },
    { speaker: 'guide', text: 'Thank you for walking the route with me, and enjoy the film next door.' },
  ],
  vocabulary: [
    {
      term: 'hopper', phonetic: '/ˈhɒpə/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '料斗，进料坑', en: 'the deep pit that holds waste before it feeds the furnace' },
      usage: { zh: '可数；central hopper、tip into the hopper。', en: 'Countable: central hopper, tip into the hopper.' },
      collocations: ['the central hopper', 'tip into the hopper', 'the hopper holds waste'],
      example: { en: 'Trucks tip their loads into the central hopper.', zh: '卡车把垃圾倾入中央料斗。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /ə/。', en: 'Two syllables with first-syllable stress; ending /ə/.' },
    },
    {
      term: 'temperature', phonetic: '/ˈtemprətʃə/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '温度', en: 'the level of heat inside the furnace' },
      usage: { zh: '可数或不可数；high temperature、burn at a temperature。', en: 'Countable or uncountable: high temperature, burn at a temperature.' },
      collocations: ['a high temperature', 'the furnace temperature', 'control the temperature'],
      example: { en: 'The waste burns at a high temperature in the chamber.', zh: '垃圾在炉膛高温下燃烧。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈtem/；中间 /prə/。', en: 'Three syllables with first-syllable stress; middle /prə/.' },
    },
    {
      term: 'chimney', phonetic: '/ˈtʃɪmni/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '烟囱', en: 'the tall stack through which cleaned gases leave' },
      usage: { zh: '可数；the tall chimney、release through the chimney。', en: 'Countable: the tall chimney, release through the chimney.' },
      collocations: ['the tall chimney', 'up the chimney', 'the plant chimney'],
      example: { en: 'Cleaned gases leave through the tall chimney.', zh: '净化烟气经高烟囱排出。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /ni/。', en: 'Two syllables with first-syllable stress; ending /ni/.' },
    },
    {
      term: 'ash', phonetic: '/æʃ/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '灰烬，炉渣', en: 'the dusty material left after waste burns' },
      usage: { zh: '不可数；the ash、collect the ash、ash recovery。', en: 'Uncountable: the ash, collect the ash, ash recovery.' },
      collocations: ['the ash', 'leftover ash', 'ash as a material'],
      example: { en: 'The ash is reused as a building material.', zh: '灰烬作为建筑材料再利用。' },
      listening: { zh: '单音节 /æʃ/，短元音 /æ/，结尾 /ʃ/。', en: 'One syllable /æʃ/ with short /æ/ and final /ʃ/.' },
    },
    {
      term: 'emissions', phonetic: '/ɪˈmɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '排放物，排放量', en: 'gases and dust released into the air' },
      usage: { zh: '可数复数；check emissions、emissions level。动词 emit。', en: 'Countable plural: check emissions, emissions level. The verb is emit.' },
      collocations: ['other emissions', 'check the emissions', 'log emissions'],
      example: { en: 'Sensors check dust and other emissions before release.', zh: '传感器在排放前检测粉尘与其他排放量。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈmɪ/；结尾 /ʃnz/。', en: 'Three syllables with stress on the second; ending /ʃnz/.' },
    },
    {
      term: 'furnace', phonetic: '/ˈfɜːnɪs/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '炉膛，焚烧炉', en: 'the chamber where waste is burned at heat' },
      usage: { zh: '可数；reach the furnace、the furnace burns waste。', en: 'Countable: reach the furnace, the furnace burns waste.' },
      collocations: ['the furnace', 'inside the furnace', 'the plant furnace'],
      example: { en: 'Each load is sorted before it reaches the furnace.', zh: '每批垃圾进炉膛前先分拣。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈfɜː/；结尾 /nɪs/。', en: 'Two syllables with first-syllable stress; ending /nɪs/.' },
    },
    {
      term: 'filters', phonetic: '/ˈfɪltəz/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '过滤器，滤层', en: 'the device that traps dust from rising smoke' },
      usage: { zh: '可数复数；bag filters、the filter tower。动词 filter。', en: 'Countable plural: bag filters, the filter tower. The verb is filter.' },
      collocations: ['the filter tower', 'bag filters', 'clean the filters'],
      example: { en: 'Bag filters remove dust from the rising smoke.', zh: '布袋过滤器去除上升烟气中的粉尘。' },
      listening: { zh: '两个音节，重音在第一音节；复数结尾 /z/。', en: 'Two syllables with first-syllable stress; plural ending /z/.' },
    },
  ],
  expressions: [
    {
      phrase: 'tip into', sentenceIndex: 4,
      meaning: { zh: '倾倒入（料斗）', en: 'to unload waste by pouring it into a container' },
      usage: { zh: '把某物倾入某处；tip into the hopper。', en: 'Tip something into somewhere: tip into the hopper.' },
      example: { en: 'Trucks tip their loads into the central hopper.', zh: '卡车把货物倾入中央料斗。' },
    },
    {
      phrase: 'drops onto', sentenceIndex: 16,
      meaning: { zh: '落到（传送带）上', en: 'to fall down onto the next surface' },
      usage: { zh: 'drop onto 加位置；drops onto the conveyor。', en: 'Drop onto plus place: drops onto the conveyor.' },
      example: { en: 'The leftover material drops onto a conveyor at the base.', zh: '残余物料落到炉底传送带上。' },
    },
    {
      phrase: 'reused as', sentenceIndex: 12,
      meaning: { zh: '再利用为……', en: 'processed again so it serves a new purpose' },
      usage: { zh: 'be reused as 加用途；reused as a material。', en: 'Be reused as plus purpose: reused as a material.' },
      example: { en: 'Ash is reused as a building material.', zh: '灰烬再利用为建筑材料。' },
    },
    {
      phrase: 'rises above', sentenceIndex: 22,
      meaning: { zh: '超过（限值）', en: 'to go higher than the allowed limit' },
      usage: { zh: 'rise above 加标准；reading rises above the limit。', en: 'Rise above plus standard: reading rises above the limit.' },
      example: { en: 'If a reading rises above the limit, the feed slows.', zh: '读数超限就放慢进料。' },
    },
    {
      phrase: 'logged continuously', sentenceIndex: 23,
      meaning: { zh: '连续记录（数据）', en: 'recorded on a chart or system without a break' },
      usage: { zh: '被动；emissions are logged continuously。名词 log。', en: 'Passive: emissions are logged continuously. The noun is a log.' },
      example: { en: 'Emissions are logged continuously each day.', zh: '排放量被连续记录下来。' },
    },
    {
      phrase: 'lean on', sentenceIndex: 34,
      meaning: { zh: '倚靠（栏杆）', en: 'to rest weight against a railing or wall' },
      usage: { zh: 'lean on 加支撑；do not lean on the rail。', en: 'Lean on plus support: do not lean on the rail.' },
      example: { en: 'Do not lean on the glass railings during the tour.', zh: '参观时不要倚靠玻璃栏杆。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题沿工艺流程定位', en: 'Follow the process order in tables' },
      body: {
        zh: '第 11–14 题按进厂、炉膛、烟囱、残渣的流程排列。听前在表格旁标出 hopper、temperature、chimney、building 对应的题干；听到 trucks tip、burns at、leave through、reused as 再填后面的名词。',
        en: 'Items 11 to 14 follow delivery, furnace, chimney and residue. Mark the printed leads beside the table; write the noun after trucks tip, burns at, leave through or reused as.',
      },
    },
    {
      title: { zh: '比例题听分数信号词', en: 'Catch fraction signals in proportion items' },
      body: {
        zh: '第 17 题问灰烬占比，答案在 one tenth 附近。独白中的比例常跟 roughly、about、around 一起出现；听到分数词先记数字，再回勾题干预留的 fraction。',
        en: 'Item 17 asks the ash proportion, answered near one tenth. Fractions in talks often follow roughly, about or around; note the number when you hear a fraction signal, then match it to the printed lead.',
      },
    },
    {
      title: { zh: '配对题先记区域名再记功能', en: 'For matching, note the area then the duty' },
      body: {
        zh: '第 18–20 题把厂区区域与功能配对。结尾回顾段每句先报区域（loading bay、combustion chamber、filter tower），再说动作；先把区域名写在题号旁，再把 collects、burns、removes 对上选项字母。',
        en: 'Items 18 to 20 pair plant areas with functions. The closing review names the area first, loading bay, combustion chamber or filter tower, then the action. Write the area beside the number, then match collects, burns and removes to a letter.',
      },
    },
  ],
};
