import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 36 · Part 2 — 音乐节场地指引（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：两座舞台分布 → 露营区 → 饮水点 → 失物招领 → 离场班车 → 五类人群各自遵守的规则
 * （配对 16–20）→ 急救、厕所、垃圾与天气提醒。开场用现场入场指令，不用 welcome to。
 */
export const test36Part2: ListeningLesson = {
  slug: 'test-36-part-2',
  part: 2,
  status: 'published',
  title: { zh: '音乐节场地指引', en: 'Orienting festival-goers on site' },
  summary: {
    zh: '场地协调员向乐迷说明主舞台与第二舞台的位置、西门露营区、蓝色标记饮水点、入口旁信息台的失物招领，以及东离场末班车时间；随后把入场者、露营者、找水者、失物者和散场人群分别对应到各自规则，最后补充急救、厕所、垃圾分类与天气提醒。',
    en: 'The site coordinator explains the two stages, the west-gate camping zone, blue-marked water points, lost property at the entrance information desk and the last shuttle from the east gate, then matches five groups to their rules: entrants, campers, people looking for water, those who lost something and the crowd leaving after the final set.',
  },
  accent: { zh: '发言人为新西兰口音，指引处会放慢并重复路线。', en: 'The speaker has a New Zealand accent and slows down to repeat route directions.' },
  speechRate: '+2%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Second stage runs along the', cells: [[{ blank: 11 }]] },
        { lead: 'Camping zone lies by the', cells: [[{ blank: 12 }, { text: ' gate' }]] },
        { lead: 'Water points are marked in', cells: [[{ blank: 13 }]] },
        { lead: 'Lost property goes to the information', cells: [[{ blank: 14 }]] },
        { lead: 'Last shuttle leaves at', cells: [[{ blank: 15 }, { text: ' at night' }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which rule applies to each group? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'keep tickets ready at the entrance' },
        { key: 'B', text: 'carry camping gear to the far field' },
        { key: 'C', text: 'queue at the tap before filling bottles' },
        { key: 'D', text: 'report any lost item to the desk' },
        { key: 'E', text: 'wait by the gate for the return shuttle' },
        { key: 'F', text: 'keep noise down after midnight' },
      ],
      items: [
        { number: 16, text: 'people entering the site' },
        { number: 17, text: 'campers' },
        { number: 18, text: 'people looking for water' },
        { number: 19, text: 'people who lost something' },
        { number: 20, text: 'those leaving after the final set' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['river'], evidence: 2,
      explanation: {
        zh: '定位句 2：the second stage runs along the river at the east side。第二舞台沿河而设，填 river。句 3 的主舞台面向中央场地，不是第二舞台的位置。',
        en: 'Sentence 2: "the second stage runs along the river at the east side". The second stage follows the river, so write river. The main stage in sentence 3 faces the central field, not the second stage’s location.',
      },
    },
    {
      number: 12, accepted: ['west'], evidence: 6,
      explanation: {
        zh: '定位句 6：The camping zone lies by the west gate, a ten-minute walk from the main entrance。露营区在西门旁；空后已印 gate，填 west。句 15 的东门是班车离场方向，不是露营门。',
        en: 'Sentence 6: "The camping zone lies by the west gate, a ten-minute walk from the main entrance". Camping is by the west gate; gate is printed, so write west. The east gate in sentence 15 is the shuttle exit, not the camping gate.',
      },
    },
    {
      number: 13, accepted: ['blue'], evidence: 9,
      explanation: {
        zh: '定位句 9：Water points are marked in blue on the map, one near each stage。饮水点以蓝色标出，填 blue。句 10 的 reusable bottle 是自备容器，不是标记颜色。',
        en: 'Sentence 9: "Water points are marked in blue on the map, one near each stage". Points are marked blue, so write blue. The reusable bottle in sentence 10 is the container you bring, not the marker colour.',
      },
    },
    {
      number: 14, accepted: ['desk'], evidence: 12,
      explanation: {
        zh: '定位句 12：Lost property is taken to the information desk near the main entrance。失物交到信息台；题目已给 information，填 desk。句 13 的 volunteers 是台内人员，不是地点。',
        en: 'Sentence 12: "Lost property is taken to the information desk near the main entrance". Lost property goes to the information desk; information is printed, so write desk. Volunteers in sentence 13 are staff, not the place.',
      },
    },
    {
      number: 15, accepted: ['eleven', '11'], spoken: 'eleven', evidence: 16,
      explanation: {
        zh: '定位句 16：The last shuttle leaves at eleven at night, so do not linger at the stage after the final song。末班车晚上十一点发；空后已印 at night，填 eleven。句 15 的东门是上车点，不是时间。',
        en: 'Sentence 16: "The last shuttle leaves at eleven at night, so do not linger at the stage after the final song". The last shuttle leaves at eleven; at night is printed, so write eleven. The east gate in sentence 15 is the boarding point, not the time.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：People entering the site should keep their tickets ready and show them to the steward at the barrier。入场者备好票，对应 A。句 0 的排队提醒是开场广播，不是配对人群规则。',
        en: 'Sentence 18: "People entering the site should keep their tickets ready and show them to the steward at the barrier". Entrants keep tickets ready, matching A. The queue reminder in sentence 0 is the opening broadcast, not a matching rule.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：Campers carry their camping gear out to the far field, and set up away from the marked paths。露营者把装备搬到远场，对应 B。句 23 的午夜降噪是另一条营地提醒，不属本项。',
        en: 'Sentence 19: "Campers carry their camping gear out to the far field, and set up away from the marked paths". Campers carry gear to the far field, matching B. The midnight noise rule in sentence 23 is a separate camp reminder.',
      },
    },
    {
      number: 18, accepted: ['C'], evidence: 20,
      explanation: {
        zh: '定位句 20：Anyone looking for water should queue at the tap before filling bottles, to keep the line moving。找水者在龙头前排队，对应 C。句 11 的洗锅限制是对露营者的要求，不是排队规则。',
        en: 'Sentence 20: "Anyone looking for water should queue at the tap before filling bottles, to keep the line moving". People looking for water queue at the tap, matching C. The dishwashing ban in sentence 11 applies to campers, not the queue rule.',
      },
    },
    {
      number: 19, accepted: ['D'], evidence: 21,
      explanation: {
        zh: '定位句 21：People who have lost something report it to the information desk, with a short description of the item。失物者到信息台报告，对应 D。句 14 的网站公示是事后处理，不是当场报告动作。',
        en: 'Sentence 21: "People who have lost something report it to the information desk, with a short description of the item". Those who lost something report to the desk, matching D. Website posting in sentence 14 is later handling, not the on-site report.',
      },
    },
    {
      number: 20, accepted: ['E'], evidence: 22,
      explanation: {
        zh: '定位句 22：Those leaving after the final set wait by the gate for the return shuttle, rather than walking to the road alone。散场者在车门边等候班车，对应 E。F 的午夜降噪属于露营者，不是散场人群。',
        en: 'Sentence 22: "Those leaving after the final set wait by the gate for the return shuttle, rather than walking to the road alone". The leaving crowd waits at the gate for the shuttle, matching E. Midnight quiet in F applies to campers, not the leaving crowd.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Keep your ticket ready as you approach the gates, and stay behind the barrier until the stewards wave you through.' },
    { speaker: 'coordinator', text: 'I’m the site coordinator for today’s festival, and these notes cover the stages, camping, water, lost property and the return buses.' },
    { speaker: 'coordinator', text: 'There are two stages. The main stage faces the central field, and the second stage runs along the river at the east side.' },
    { speaker: 'coordinator', text: 'The main stage hosts the headline acts through the evening, so arrive early for a spot near the front.' },
    { speaker: 'coordinator', text: 'The second stage is quieter, with acoustic sets, and you can reach it by the path that follows the water.' },
    { speaker: 'coordinator', text: 'Between the stages you will find food stalls, market tables and a row of information boards.' },
    { speaker: 'coordinator', text: 'The camping zone lies by the west gate, a ten-minute walk from the main entrance.' },
    { speaker: 'coordinator', text: 'Campers should carry their own tent and bedding, and the field opens for tents from twelve at midday.' },
    { speaker: 'coordinator', text: 'Vehicles cannot enter the camping field, so leave cars in the outer car park and use the handcart loaned at the gate.' },
    { speaker: 'coordinator', text: 'Water points are marked in blue on the map, one near each stage and another beside the camping field.' },
    { speaker: 'coordinator', text: 'Bring a reusable bottle, and fill it at these taps rather than buying drinks from every stall.' },
    { speaker: 'coordinator', text: 'The taps are not for washing dishes or cooking pots, so keep those back at your tent.' },
    { speaker: 'coordinator', text: 'Lost property is taken to the information desk near the main entrance.' },
    { speaker: 'coordinator', text: 'If you lose a coat or a phone, report it there, and the volunteers log every item by the hour it was handed in.' },
    { speaker: 'coordinator', text: 'Unclaimed items at the end of the weekend are posted on the festival website, with a photo of each item.' },
    { speaker: 'coordinator', text: 'When the last act finishes, the return shuttle buses wait by the east gate.' },
    { speaker: 'coordinator', text: 'The last shuttle leaves at eleven at night, so do not linger at the stage after the final song.' },
    { speaker: 'coordinator', text: 'Now a few notes about who should do what around the site today.' },
    { speaker: 'coordinator', text: 'People entering the site should keep their tickets ready and show them to the steward at the barrier.' },
    { speaker: 'coordinator', text: 'Campers carry their camping gear out to the far field, and set up away from the marked paths.' },
    { speaker: 'coordinator', text: 'Anyone looking for water should queue at the tap before filling bottles, to keep the line moving.' },
    { speaker: 'coordinator', text: 'People who have lost something report it to the information desk, with a short description of the item.' },
    { speaker: 'coordinator', text: 'Those leaving after the final set wait by the gate for the return shuttle, rather than walking to the road alone.' },
    { speaker: 'coordinator', text: 'A reminder for campers that noise should stay down after midnight, out of respect for neighbours in the fields nearby.' },
    { speaker: 'coordinator', text: 'The stewards wear high-visibility jackets, so stop any one of them if you cannot read the map.' },
    { speaker: 'coordinator', text: 'First aid is beside the main stage, and any injury should be reported there before it gets worse.' },
    { speaker: 'coordinator', text: 'Toilets sit behind the food row, and the accessible toilet is next to the information desk.' },
    { speaker: 'coordinator', text: 'Bin stations are spaced along every path; please sort cans, plastic and food waste into the right bags.' },
    { speaker: 'coordinator', text: 'If it rains, the ground near the river can turn muddy, so wear boots rather than trainers.' },
    { speaker: 'coordinator', text: 'The second stage moves under cover if the weather worsens, and the board will announce any change.' },
    { speaker: 'coordinator', text: 'Photography is allowed, but ask before taking close pictures of other festival-goers.' },
    { speaker: 'coordinator', text: 'No glass bottles may be brought into the field, and bags are checked at the gate.' },
    { speaker: 'coordinator', text: 'Re-entry to the site is allowed with a wristband, which you must keep on all day.' },
    { speaker: 'coordinator', text: 'The family area is at the south edge, away from the loudest speakers, for young children and their guardians.' },
    { speaker: 'coordinator', text: 'Dogs are not permitted inside the site, with the usual exception for registered assistance animals.' },
    { speaker: 'coordinator', text: 'Charging sockets sit beside the information desk, but take your phone back when it is full.' },
    { speaker: 'coordinator', text: 'The festival app shows stage times, and it updates when a set moves to a later slot.' },
    { speaker: 'coordinator', text: 'If a stage finishes early, check the app before heading across to the other stage.' },
    { speaker: 'coordinator', text: 'Volunteers can be found at every information board if the map leaves you unsure of a path.' },
    { speaker: 'coordinator', text: 'Take your litter out with you, and leave the field as clean as you found it this morning.' },
    { speaker: 'coordinator', text: 'Enjoy the music, and look out for the people beside you as the crowd moves between sets.' },
  ],
  vocabulary: [
    {
      term: 'steward', phonetic: '/ˈstjuːərd/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '场地管理员，检票引导员', en: 'the volunteer who directs crowds and checks tickets' },
      usage: { zh: '可数；the steward、stewards wear jackets。', en: 'Countable: the steward, stewards wear jackets.' },
      collocations: ['the site steward', 'show the steward', 'the stewards wave you through'],
      example: { en: 'Show your ticket to the steward at the barrier.', zh: '在护栏处把票出示给管理员。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈstjuː/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'acoustic', phonetic: '/əˈkuːstɪk/', partOfSpeech: 'adj.', sentenceIndex: 4,
      meaning: { zh: '原声的，不插电的', en: 'played without loud amplification, for acoustic sets' },
      usage: { zh: '定语；acoustic sets、an acoustic guitar。', en: 'Attributive: acoustic sets, an acoustic guitar.' },
      collocations: ['acoustic sets', 'the acoustic stage', 'an acoustic guitar'],
      example: { en: 'The second stage hosts quieter acoustic sets.', zh: '第二舞台上演较安静的原声演出。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈkuː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'camping', phonetic: '/ˈkæmpɪŋ/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '露营，扎营', en: 'staying overnight in tents on the festival field' },
      usage: { zh: '不可数；camping zone、go camping。动词 camp。', en: 'Uncountable: camping zone, go camping. The verb is camp.' },
      collocations: ['the camping zone', 'the camping field', 'go camping'],
      example: { en: 'The camping zone opens at midday for tents.', zh: '露营区中午开放扎营。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkæm/；结尾 /ɪŋ/。', en: 'Two syllables, first stress; ending /ɪŋ/.' },
    },
    {
      term: 'reusable', phonetic: '/ˌriːˈjuːzəbl/', partOfSpeech: 'adj.', sentenceIndex: 10,
      meaning: { zh: '可重复使用的', en: 'designed to be used more than once instead of thrown away' },
      usage: { zh: '定语；a reusable bottle。动词 reuse 前缀 re-。', en: 'Attributive: a reusable bottle. The verb reuse carries the re- prefix.' },
      collocations: ['a reusable bottle', 'reusable cups'],
      example: { en: 'Bring a reusable bottle to fill at the taps.', zh: '带可重复使用的水杯去龙头接水。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈjuː/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'lost property', phonetic: '/lɒst ˈprɒpəti/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '失物招领', en: 'items handed in after being dropped or forgotten' },
      usage: { zh: '不可数；lost property desk、report lost property。', en: 'Uncountable: lost property desk, report lost property.' },
      collocations: ['lost property', 'the lost property desk', 'hand in lost property'],
      example: { en: 'Lost property is logged at the information desk.', zh: '失物在信息台登记。' },
      listening: { zh: 'property 重音在第一音节 /ˈprɒ/；与 proper 区分。', en: 'Property stresses the first syllable; do not confuse with proper.' },
    },
    {
      term: 'shuttle', phonetic: '/ˈʃʌtl/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '接驳班车', en: 'the bus that carries festival-goers between the gate and car park' },
      usage: { zh: '可数；return shuttle、shuttle bus。', en: 'Countable: return shuttle, shuttle bus.' },
      collocations: ['the return shuttle', 'the shuttle buses', 'the last shuttle'],
      example: { en: 'The return shuttle waits by the east gate.', zh: '返程班车在东门等候。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈʃʌ/；结尾 /tl/。', en: 'Two syllables, first stress; ending /tl/.' },
    },
    {
      term: 'wristband', phonetic: '/ˈrɪstbænd/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '入场腕带', en: 'the band on the wrist that allows re-entry to the site' },
      usage: { zh: '可数；keep the wristband on、a paper wristband。', en: 'Countable: keep the wristband on, a paper wristband.' },
      collocations: ['the festival wristband', 'keep the wristband on'],
      example: { en: 'Re-entry needs the wristband kept on all day.', zh: '凭全天佩戴的腕带再次入场。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈrɪst/。', en: 'Two syllables with first-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'wave you through', sentenceIndex: 0,
      meaning: { zh: '挥手放行', en: 'to signal that someone may enter' },
      usage: { zh: 'wave somebody through；可分短语，代词放中间。', en: 'Wave somebody through; separable, the pronoun goes in the middle.' },
      example: { en: 'The steward waves you through once the ticket is checked.', zh: '检票后管理员挥手放行。' },
    },
    {
      phrase: 'along the river', sentenceIndex: 2,
      meaning: { zh: '沿着河边', en: 'following the line of the river' },
      usage: { zh: '方位短语；the stage runs along the river。', en: 'Adverbial: the stage runs along the river.' },
      example: { en: 'The second stage sits along the river path.', zh: '第二舞台沿河步道而设。' },
    },
    {
      phrase: 'queue at the tap', sentenceIndex: 20,
      meaning: { zh: '在饮水龙头前排队', en: 'to line up at the water tap before filling bottles' },
      usage: { zh: 'queue 此处为动词；queue at the tap。', en: 'Here queue is a verb: queue at the tap.' },
      example: { en: 'Queue at the tap so the line keeps moving.', zh: '在龙头前排队，让队伍顺畅前进。' },
    },
    {
      phrase: 'lost something', sentenceIndex: 21,
      meaning: { zh: '丢了东西', en: 'to have dropped or forgotten an item' },
      usage: { zh: '现在完成时；people who have lost something。', en: 'Present perfect: people who have lost something.' },
      example: { en: 'Anyone who has lost something should report it at the desk.', zh: '丢了东西的人请到信息台报告。' },
    },
    {
      phrase: 'under cover', sentenceIndex: 29,
      meaning: { zh: '在有遮蔽处', en: 'inside a tent or roofed area out of the rain' },
      usage: { zh: '地点状语；move under cover。反义 in the open。', en: 'Adverbial: move under cover; opposite in the open.' },
      example: { en: 'The second stage moves under cover if it rains.', zh: '下雨时第二舞台转入遮蔽处。' },
    },
    {
      phrase: 'sort cans, plastic and food waste', sentenceIndex: 27,
      meaning: { zh: '分类投放罐、塑料与厨余垃圾', en: 'to separate recyclables and food waste into the right bags' },
      usage: { zh: 'sort 后接分类对象；into the right bags 指分袋。', en: 'Sort plus categories; into the right bags names the bags.' },
      example: { en: 'Sort waste into cans, plastic and food bags.', zh: '把垃圾分类投入罐、塑料与厨余袋。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记抓方位与颜色词', en: 'Catch directions and colours in notes' },
      body: {
        zh: '第 11–15 题答案集中在方位（river、west gate）、颜色（blue）、地点（desk）和时间（eleven）。听到舞台、露营、饮水、失物、班车各段首句就回到对应行，不要把东门班车和西门露营混填。',
        en: 'Items 11 to 15 centre on directions (river, west gate), colour (blue), place (desk) and time (eleven). Return to the row at each segment opener: stages, camping, water, lost property, shuttle. Do not swap the east-gate shuttle and west-gate camping.',
      },
    },
    {
      title: { zh: '配对按人群名锁定规则', en: 'Match rules to groups by name' },
      body: {
        zh: '配对五个选项先缩成 tickets、gear、queue、report、shuttle。句 18–22 依次对应入场者、露营者、找水者、失物者、散场者；午夜降噪 F 只属露营者，落笔前核对人群。',
        en: 'Reduce the six options to tickets, gear, queue, report, shuttle. Sentences 18 to 22 order entrants, campers, water seekers, losers and leavers. The midnight quiet in F belongs only to campers; check the group before choosing.',
      },
    },
    {
      title: { zh: '位置描述不等于规则归属', en: 'Location is not the matching rule' },
      body: {
        zh: '信息台既出现失物招领，也出现充电插座、无障碍厕所；第二舞台既沿河又在雨天转遮蔽。配对题问的是人群动作，听到地点先记住，等规则动词（report、queue、wait）出现再选。',
        en: 'The information desk hosts lost property, chargers and the accessible toilet, and the second stage follows the river then moves under cover. Matching asks what the group does; note the location and choose when the rule verb report, queue or wait appears.',
      },
    },
  ],
};
