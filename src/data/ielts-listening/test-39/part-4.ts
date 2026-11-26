import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 39 · Part 4 — 讲座：隔声。原创仿真材料，非官方真题。
 *
 * 结构：传声两条路径（空气传声与结构传声）→ 吸声与隔声的区别 →
 * 材料选择 → 建筑规范要求 → 概念复核 → 三项实用措施。
 * 开场用墙面事实起手，不用 Today’s lecture is about 句式。
 */
export const test39Part4: ListeningLesson = {
  slug: 'test-39-part-4',
  part: 4,
  status: 'published',
  title: { zh: '隔声', en: 'Sound insulation' },
  summary: {
    zh: '讲座讲解建筑中的隔声：声音经空气波与建筑结构两条路径传入邻室；吸声材料以纤维消耗声波能量、消除室内回声，厚重密实的墙体靠质量阻挡传声；规范对分户墙设定最低隔声评级。讲座复核空气传声的定义、软表面消回声的原理与分户墙要求，并列出三项措施：封闭门缝、给分户墙增加质量、安装吸声吊顶板。',
    en: 'The lecture covers sound insulation: noise reaches the next room through airborne waves and the structure. Absorbers spend energy in fibres and remove echo, while heavy walls block transmission by mass. Codes set a minimum reduction rating for separating walls. It revises airborne sound and divider rules, then recommends sealing door gaps, adding mass to party walls and absorbing ceiling tiles.',
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
      columns: ['Topic', 'Detail'],
      rows: [
        { lead: 'Sound crosses through the air and through the', cells: [[{ blank: 31 }]] },
        { lead: 'Materials that take in sound are called', cells: [[{ blank: 32 }]] },
        { lead: 'Heavy layers give sound', cells: [[{ blank: 33 }]] },
        { lead: 'Rules require a minimum sound reduction', cells: [[{ blank: 34 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'What is airborne sound?',
          options: [
            { key: 'A', text: 'sound travelling through solid walls only' },
            { key: 'B', text: 'sound carried by air waves' },
            { key: 'C', text: 'sound produced by footsteps' },
          ],
        },
        {
          number: 36,
          stem: 'Why do soft surfaces reduce the echo?',
          options: [
            { key: 'A', text: 'they reflect the waves straight back' },
            { key: 'B', text: 'they convert sound energy into heat' },
            { key: 'C', text: 'they seal the door completely' },
          ],
        },
        {
          number: 37,
          stem: 'What do building codes require between flats?',
          options: [
            { key: 'A', text: 'a minimum sound reduction rating' },
            { key: 'B', text: 'double glazing on every window' },
            { key: 'C', text: 'carpet on every floor' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE measures does the lecturer recommend? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE measures does the lecturer recommend?',
      options: [
        { key: 'A', text: 'seal gaps around doors' },
        { key: 'B', text: 'add mass to party walls' },
        { key: 'C', text: 'install sound-absorbing ceiling tiles' },
        { key: 'D', text: 'remove all furniture from shared rooms' },
        { key: 'E', text: 'lay thick carpets in every hallway' },
        { key: 'F', text: 'paint every wall white' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['structure'], evidence: 11,
      explanation: {
        zh: '定位句 11：So sound reaches a room through the air and through the structure。第二条路径是建筑结构，填 structure。air 已在题干给出，不能重复。',
        en: 'Sentence 11: "So sound reaches a room through the air and through the structure". The second path is the building structure, so write structure. Air is already printed in the lead and cannot repeat.',
      },
    },
    {
      number: 32, accepted: ['absorbers'], evidence: 18,
      explanation: {
        zh: '定位句 18：Materials that absorb sound are called absorbers, and they mainly cut echo inside a room。吸声材料称 absorbers；mass 在句 23 讲的是隔声质量，不是这类材料。',
        en: 'Sentence 18: "Materials that absorb sound are called absorbers, and they mainly cut echo inside a room". Sound-taking-in materials are absorbers; mass in sentence 23 means blocking weight, not this material class.',
      },
    },
    {
      number: 33, accepted: ['mass'], evidence: 23,
      explanation: {
        zh: '定位句 23：Heavy materials provide sound mass, and the denser the wall, the less noise crosses。厚重材料提供隔声质量，填 mass。gap 在句 24 指两层墙间的空气层，不是答案。',
        en: 'Sentence 23: "Heavy materials provide sound mass, and the denser the wall, the less noise crosses". Heavy layers provide sound mass, so write mass. The gap in sentence 24 is the air space between two wall leaves, not the answer.',
      },
    },
    {
      number: 34, accepted: ['rating'], evidence: 33,
      explanation: {
        zh: '定位句 33：Codes set a minimum sound reduction rating that every separating wall must meet。规范设定最低隔声评级，填 rating。standard 在句 35 是泛指达标水平，不是空内术语。',
        en: 'Sentence 33: "Codes set a minimum sound reduction rating that every separating wall must meet". Codes set a minimum reduction rating, so write rating. Standard in sentence 35 refers generally to meeting the level, not the term in the gap.',
      },
    },
    {
      number: 35, accepted: ['B'], evidence: 37,
      explanation: {
        zh: '定位句 37：Airborne sound is sound carried by air waves from the source to the receiver。空气传声由空气波携带，对应 B。只走实体墙面与脚步声属于结构/撞击声，不是空气传声。',
        en: 'Sentence 37: "Airborne sound is sound carried by air waves from the source to the receiver". Airborne sound is carried by air waves, matching B. Sound through solid walls and footsteps are structure or impact sound, not airborne.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 42,
      explanation: {
        zh: '定位句 42：Instead they convert the sound energy into heat as the fibres move。软表面把声能转化为热，对应 B。反射回波是硬墙的做法，封门与软表面无关。',
        en: 'Sentence 42: "Instead they convert the sound energy into heat as the fibres move". Soft surfaces turn sound energy into heat, matching B. Reflecting waves back is what hard walls do, and sealing doors is unrelated to soft surfaces.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 46,
      explanation: {
        zh: '定位句 46：Between flats, the regulation demands a minimum sound reduction rating for the dividing wall。分户墙须达到最低隔声评级，对应 A。双层玻璃是窗户措施，走廊地毯不是法定要求。',
        en: 'Sentence 46: "Between flats, the regulation demands a minimum sound reduction rating for the dividing wall". Flats need a minimum rating on the dividing wall, matching A. Double glazing is a window measure, and hallway carpet is not a legal requirement.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 49,
      explanation: {
        zh: '定位句 49：First, seal gaps around doors, where speech often leaks between rooms。第一项措施是封闭门缝，对应 A。',
        en: 'Sentence 49: "First, seal gaps around doors, where speech often leaks between rooms". The first measure is sealing door gaps, matching A.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 50,
      explanation: {
        zh: '定位句 50：Second, add mass to party walls, using dense layers on each side of the division。第二项是给分户墙增加质量，对应 B。',
        en: 'Sentence 50: "Second, add mass to party walls, using dense layers on each side of the division". The second measure adds mass to party walls, matching B.',
      },
    },
    {
      number: 40, accepted: ['C'], evidence: 51,
      explanation: {
        zh: '定位句 51：Third, install sound-absorbing ceiling tiles to soften echo inside the shared space。第三项是吸声吊顶板，对应 C。',
        en: 'Sentence 51: "Third, install sound-absorbing ceiling tiles to soften echo inside the shared space". The third measure is absorbing ceiling tiles, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'A wall between two rooms does not stop every sound, and engineers have worked for centuries to close that gap.' },
    { speaker: 'lecturer', text: 'The subject, known as sound insulation, covers how buildings keep noise in its place.' },
    { speaker: 'lecturer', text: 'Start with the path sound takes after a person speaks or a machine runs.' },
    { speaker: 'lecturer', text: 'Sound begins as a vibration in the air, a series of waves that travel outward from the source.' },
    { speaker: 'lecturer', text: 'These waves reach the walls, the floor and the ceiling of the next room.' },
    { speaker: 'lecturer', text: 'There are two distinct paths a noise can follow once it leaves its source.' },
    { speaker: 'lecturer', text: 'The first is airborne sound, carried through the air as pressure waves.' },
    { speaker: 'lecturer', text: 'A loud voice, a radio or a shout all move through the air between rooms.' },
    { speaker: 'lecturer', text: 'The second path travels through the building structure itself.' },
    { speaker: 'lecturer', text: 'When a foot falls on a floor, the impact shakes the joists and the concrete below.' },
    { speaker: 'lecturer', text: 'That vibration passes along beams and walls, and it emerges as noise in the room beside it.' },
    { speaker: 'lecturer', text: 'So sound reaches a room through the air and through the structure.' },
    { speaker: 'lecturer', text: 'Understanding the two paths matters because the treatments differ.' },
    { speaker: 'lecturer', text: 'Now we turn to the difference between absorbing sound and blocking it.' },
    { speaker: 'lecturer', text: 'Absorption is what happens when a soft material takes in a wave rather than reflecting it.' },
    { speaker: 'lecturer', text: 'An open space with hard bare walls throws the wave back, and listeners hear an echo.' },
    { speaker: 'lecturer', text: 'Soft surfaces such as fabric, foam and carpet trap the moving air inside their fibres.' },
    { speaker: 'lecturer', text: 'The trapped motion turns into a small amount of heat, and the reflected wave dies away.' },
    { speaker: 'lecturer', text: 'Materials that absorb sound are called absorbers, and they mainly cut echo inside a room.' },
    { speaker: 'lecturer', text: 'Absorption does not stop noise crossing a wall on its own.' },
    { speaker: 'lecturer', text: 'Blocking sound, by contrast, depends on mass and separation.' },
    { speaker: 'lecturer', text: 'A heavy, dense wall reflects most of the energy before it can pass through.' },
    { speaker: 'lecturer', text: 'Thin plasterboard lets vibration travel almost freely from one side to the other.' },
    { speaker: 'lecturer', text: 'Heavy materials provide sound mass, and the denser the wall, the less noise crosses.' },
    { speaker: 'lecturer', text: 'Two leaves of wall with a gap between them perform better than one solid slab.' },
    { speaker: 'lecturer', text: 'The trapped air in the gap breaks the path of the vibration before it reaches the far side.' },
    { speaker: 'lecturer', text: 'This is why party walls in buildings are often built in two layers.' },
    { speaker: 'lecturer', text: 'To choose materials, an engineer weighs several facts together.' },
    { speaker: 'lecturer', text: 'The weight of the layers, the thickness of the air gap and the stiffness of the panels all matter.' },
    { speaker: 'lecturer', text: 'A ceiling that hangs on separate rails can reduce noise travelling up into the flat above.' },
    { speaker: 'lecturer', text: 'A door that fits badly lets a surprising amount of speech seep through its edges.' },
    { speaker: 'lecturer', text: 'Building codes do not leave these choices to guesswork.' },
    { speaker: 'lecturer', text: 'Local regulations set rules for the walls, floors and doors that join two homes.' },
    { speaker: 'lecturer', text: 'Codes set a minimum sound reduction rating that every separating wall must meet.' },
    { speaker: 'lecturer', text: 'The rating measures how much less noise a wall allows through than an open partition.' },
    { speaker: 'lecturer', text: 'Homes below the standard are flagged when the building is inspected.' },
    { speaker: 'lecturer', text: 'Let us examine the nature of airborne sound once more, to keep the terms clear.' },
    { speaker: 'lecturer', text: 'Airborne sound is sound carried by air waves from the source to the receiver.' },
    { speaker: 'lecturer', text: 'It does not require a solid floor to travel, and it crosses thin partitions more easily.' },
    { speaker: 'lecturer', text: 'Footsteps, by contrast, are impact sound, which shakes the structure directly.' },
    { speaker: 'lecturer', text: 'A common question is why soft surfaces cut the echo so effectively.' },
    { speaker: 'lecturer', text: 'Soft surfaces do not reflect the wave straight back into the room.' },
    { speaker: 'lecturer', text: 'Instead they convert the sound energy into heat as the fibres move.' },
    { speaker: 'lecturer', text: 'Once the energy is spent, little remains to bounce around the ceiling.' },
    { speaker: 'lecturer', text: 'Carpet and foam do the same job on a smaller scale inside a home.' },
    { speaker: 'lecturer', text: 'For homes next to each other, the codes set a clear requirement.' },
    { speaker: 'lecturer', text: 'Between flats, the regulation demands a minimum sound reduction rating for the dividing wall.' },
    { speaker: 'lecturer', text: 'Double glazing helps windows, but the wall rating remains the main standard.' },
    { speaker: 'lecturer', text: 'Carpet in every hallway is not a legal requirement, however comfortable it feels.' },
    { speaker: 'lecturer', text: 'Now which practical measures does the lecture actually recommend?' },
    { speaker: 'lecturer', text: 'First, seal gaps around doors, where speech often leaks between rooms.' },
    { speaker: 'lecturer', text: 'Second, add mass to party walls, using dense layers on each side of the division.' },
    { speaker: 'lecturer', text: 'Third, install sound-absorbing ceiling tiles to soften echo inside the shared space.' },
    { speaker: 'lecturer', text: 'The lecture does not suggest removing furniture, which would leave surfaces harder, not softer.' },
    { speaker: 'lecturer', text: 'White paint on the walls has no effect on whether sound passes through.' },
    { speaker: 'lecturer', text: 'None of these treatments cancels noise completely, but each lowers the level that reaches the next home.' },
    { speaker: 'lecturer', text: 'Engineers combine absorbers for echo and heavy walls for transmission, rather than choosing one alone.' },
    { speaker: 'lecturer', text: 'In the next session we will measure the rating of an actual wall in the college building.' },
    { speaker: 'lecturer', text: 'For today, remember that sound travels by two paths, and each path needs its own treatment.' },
    { speaker: 'lecturer', text: 'Thank you for listening.' },
  ],
  vocabulary: [
    {
      term: 'insulation', phonetic: '/ˌɪnsjuˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '隔声；保温隔离', en: 'the protection that keeps heat, sound or cold from passing through' },
      usage: { zh: '不可数；sound insulation、thermal insulation。动词 insulate。', en: 'Uncountable: sound insulation, thermal insulation. The verb is insulate.' },
      collocations: ['sound insulation', 'the insulation of walls', 'acoustic insulation'],
      example: { en: 'Sound insulation covers how buildings keep noise in its place.', zh: '隔声研究建筑如何把噪音限制在原处。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈleɪ/；-tion 读 /ʃn/。', en: 'Four syllables with stress on the third; -tion is /ʃn/.' },
    },
    {
      term: 'vibration', phonetic: '/vaɪˈbreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '振动，震动', en: 'the fast back-and-forth movement that carries sound through a structure' },
      usage: { zh: '可数或不可数；structure vibration、reduce vibration。动词 vibrate。', en: 'Countable or uncountable: structure vibration, reduce vibration. The verb is vibrate.' },
      collocations: ['the vibration passes', 'structure vibration', 'stop the vibration'],
      example: { en: 'The vibration passes along beams and walls into the next room.', zh: '振动沿梁柱与墙体传到隔壁房间。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈbreɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'absorbers', phonetic: '/əbˈzɔːbəz/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '吸声材料，吸声器', en: 'soft materials that take in sound waves rather than reflect them' },
      usage: { zh: '可数复数；sound absorbers、ceiling absorbers。动词 absorb。', en: 'Countable plural: sound absorbers, ceiling absorbers. The verb is absorb.' },
      collocations: ['sound absorbers', 'soft absorbers', 'room absorbers'],
      example: { en: 'Absorbers mainly cut the echo inside a single room.', zh: '吸声器主要消除单个房间内的回声。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈzɔː/；结尾 /əz/。', en: 'Three syllables with stress on the second; ending /əz/.' },
    },
    {
      term: 'mass', phonetic: '/mæs/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '质量（隔声中指墙体厚重程度）', en: 'the weight and density of a layer that block sound' },
      usage: { zh: '不可数；sound mass、add mass to a wall。', en: 'Uncountable: sound mass, add mass to a wall.' },
      collocations: ['sound mass', 'add mass', 'heavy mass'],
      example: { en: 'Heavy materials provide sound mass that blocks noise.', zh: '厚重材料提供阻挡噪音的隔声质量。' },
      listening: { zh: '单音节，短元音 /æ/，结尾 /s/ 要读清。', en: 'One syllable with /æ/; pronounce the final /s/ clearly.' },
    },
    {
      term: 'dense', phonetic: '/dens/', partOfSpeech: 'adj.', sentenceIndex: 21,
      meaning: { zh: '密实的，密度高的', en: 'closely packed, so little energy passes through' },
      usage: { zh: '修饰材料；a dense wall、dense layers。名词 density。', en: 'Describes materials: a dense wall, dense layers. The noun is density.' },
      collocations: ['the denser the wall', 'dense layers', 'a dense panel'],
      example: { en: 'The denser the wall, the less noise crosses it.', zh: '墙体越密实，传声越少。' },
      listening: { zh: '单音节，结尾 /ns/；与 dent 区分。', en: 'One syllable ending /ns/; do not confuse with dent.' },
    },
    {
      term: 'partition', phonetic: '/pɑːˈtɪʃn/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '隔断，分隔墙', en: 'a wall or screen that divides one space from another' },
      usage: { zh: '可数；an open partition、a dividing partition。', en: 'Countable: an open partition, a dividing partition.' },
      collocations: ['an open partition', 'the dividing partition', 'a thin partition'],
      example: { en: 'The rating compares the wall with an open partition.', zh: '评级把墙体与敞开隔断作比较。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtɪʃ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'rating', phonetic: '/ˈreɪtɪŋ/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '评级，分级数值', en: 'a standard measure showing how well a wall blocks noise' },
      usage: { zh: '可数；sound reduction rating、meet the rating。动词 rate。', en: 'Countable: sound reduction rating, meet the rating. The verb is rate.' },
      collocations: ['the reduction rating', 'meet the rating', 'the wall rating'],
      example: { en: 'Every separating wall must meet the minimum rating.', zh: '每道分户墙都须达到最低评级。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈreɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'echo', phonetic: '/ˈekəʊ/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '回声，回响', en: 'a reflected sound that listeners hear after the direct sound' },
      usage: { zh: '可数；cut the echo、room echo。动词 echo 表回响。', en: 'Countable: cut the echo, room echo. The verb means to reflect sound.' },
      collocations: ['cut the echo', 'reduce echo', 'the room echo'],
      example: { en: 'Hard bare walls throw the wave back and create an echo.', zh: '光秃硬墙把声波弹回，形成回声。' },
      listening: { zh: '两个音节，重音在第一音节；结尾 /əʊ/。', en: 'Two syllables with stress on the first; ending /əʊ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'turn to', sentenceIndex: 13,
      meaning: { zh: '转到（下一个话题）', en: 'to move on to the next part of the lecture' },
      usage: { zh: '讲座过渡说法；turn to the difference、turn to materials。', en: 'A lecture transition: turn to the difference, turn to materials.' },
      example: { en: 'Now we turn to the difference between absorbing and blocking sound.', zh: '接下来我们讲吸声与隔声的区别。' },
    },
    {
      phrase: 'by contrast', sentenceIndex: 20,
      meaning: { zh: '相比之下，相反', en: 'used to show the opposite side of a comparison' },
      usage: { zh: '插入语；Block sound, by contrast, depends on mass。', en: 'A parenthetical: block sound, by contrast, depends on mass.' },
      example: { en: 'Absorption cuts echo; blocking, by contrast, depends on mass.', zh: '吸声消除回声；隔声则相反，靠质量。' },
    },
    {
      phrase: 'on its own', sentenceIndex: 19,
      meaning: { zh: '单凭自身，独立地', en: 'alone, without another method helping' },
      usage: { zh: '状语；absorption does not stop noise on its own。', en: 'Adverbial: absorption does not stop noise on its own.' },
      example: { en: 'Absorption does not stop noise crossing the wall on its own.', zh: '单靠吸声不能挡住穿墙噪音。' },
    },
    {
      phrase: 'seep through', sentenceIndex: 30,
      meaning: { zh: '渗漏，悄悄穿过缝隙', en: 'to pass slowly through a small gap or edge' },
      usage: { zh: '不及物短语；speech seeps through the edges。', en: 'Intransitive: speech seeps through the edges.' },
      example: { en: 'Badly fitted doors let speech seep through their edges.', zh: '密封差的门会让说话声从缝隙漏出。' },
    },
    {
      phrase: 'leave these choices to guesswork', sentenceIndex: 31,
      meaning: { zh: '留给主观猜测决定', en: 'to let choices be made without rules or evidence' },
      usage: { zh: '把某事留给猜测；leave something to guesswork，codes do not leave choices to guesswork。', en: 'Leave something to guesswork; codes do not leave choices to guesswork.' },
      example: { en: 'Building codes do not leave these choices to guesswork.', zh: '建筑规范不让这些选择凭猜测决定。' },
    },
    {
      phrase: 'the energy is spent', sentenceIndex: 43,
      meaning: { zh: '消耗掉（声）能量', en: 'to use up the sound energy so little remains' },
      usage: { zh: '能量被消耗；spend energy，once the energy is spent。', en: 'Spend energy; once the energy is spent.' },
      example: { en: 'Once the energy is spent, little remains to bounce around the room.', zh: '能量消耗后，几乎没有声波在室内反弹。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题先判词性与概念', en: 'Read the part of speech before listening' },
      body: {
        zh: '第 31–34 题是表格填空：structure 是地点路径，absorbers 是材料类别，mass 是隔声手段，rating 是规范指标。听前把预测词性写在空旁，避免把句中同义的 wall、gap、standard 填进去。',
        en: 'Items 31 to 34 are a table. Structure is a path, absorbers a material class, mass a blocking method, and rating a code measure. Write the predicted part of speech beside each gap, so a synonym such as wall, gap or standard is not written in.',
      },
    },
    {
      title: { zh: '区分吸声与隔声', en: 'Separate absorption from blocking' },
      body: {
        zh: '讲座反复对比两类做法：absorber 靠纤维消耗能量、消除室内回声；隔声靠厚重墙体与空气层阻挡传声。第 32、33 题分别落在这两段，听到 absorbers、mass、dense 时先确认属于哪一类，再落笔。',
        en: 'The lecture contrasts two approaches: absorbers spend energy in fibres and remove indoor echo, while blocking relies on heavy walls and air gaps. Items 32 and 33 fall in these two sections; once you hear absorbers, mass or dense, confirm which approach it belongs to before writing.',
      },
    },
    {
      title: { zh: '多选排除被否定的措施', en: 'Rule out the rejected measures' },
      body: {
        zh: '多选题里搬走家具被说成会让表面更硬，白漆对传声没有作用，地毯只是舒适而非法定要求；只有 first、second、third 引出的封缝、加质量、吸声板是推荐措施。听到 does not suggest、no effect、not a requirement 时把对应选项划掉。',
        en: 'Among the multiple-choice options, removing furniture would make surfaces harder, white paint has no effect on transmission, and carpet is comfort rather than a legal rule. Only the door seal, added mass and absorbing tiles introduced by first, second and third are recommended. Cross out an option after does not suggest, no effect or not a requirement.',
      },
    },
  ],
};
