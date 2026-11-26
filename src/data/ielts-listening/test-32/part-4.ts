import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 32 · Part 4 — 昆虫通讯（单人讲座）。原创仿真材料，非官方真题。
 *
 * 概述段先考蚂蚁留迹、摆尾舞用途、拟寄生蜂产卵原因与群体信号优势（单选 31–34）；
 * 细节段展开信息素、八字形舞蹈、基质振动、蚁后气味、拟寄生幼虫与警报信号（笔记 35–40）。
 */
export const test32Part4: ListeningLesson = {
  slug: 'test-32-part-4',
  part: 4,
  status: 'published',
  title: { zh: '昆虫通讯', en: 'Insect communication' },
  summary: {
    zh: '讲座从林间一次蚂蚁信号观察切入，讲昆虫不靠句子却能完成觅食、护巢、择偶与繁衍：蚂蚁沿路留下化学标记，蜜蜂用摆尾舞告知花田方向与距离，振动经叶片、茎秆或土壤传递；拟寄生蜂把卵产在宿主体内以保护幼虫，群体信号让整个巢穴进入警戒。细节段介绍信息素混合配方、八字形舞蹈与太阳夹角、基质传导、蚁后气味维系群体、幼虫取食宿主身体，以及惠及全群的警报信号。',
    en: 'The lecture opens with an ant-signal observation. Insects coordinate foraging, defence and mating without sentences. Ants lay chemical markers, the waggle dance gives flower direction and distance, vibration travels through surfaces, and wasps protect young inside a host. Details cover pheromones, the figure-of-eight dance, substrate conduction, the queen’s scent and larvae.',
  },
  accent: { zh: '讲者为美国口音英语。', en: 'The lecturer speaks with an American English accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 31,
          stem: 'How do ants leave a trail between nest and food?',
          options: [
            { key: 'A', text: 'by laying small chemical markers along the path' },
            { key: 'B', text: 'by beating their wings against the leaves' },
            { key: 'C', text: 'by repeating a dance on the vertical comb' },
          ],
        },
        {
          number: 32,
          stem: 'What is the waggle dance used for?',
          options: [
            { key: 'A', text: 'choosing a new nest site after swarming' },
            { key: 'B', text: 'showing the direction and distance of a flower patch' },
            { key: 'C', text: 'warning neighbouring hives of an intruder' },
          ],
        },
        {
          number: 33,
          stem: 'Why does a parasitoid wasp lay eggs inside a host?',
          options: [
            { key: 'A', text: 'to mark the host as its own territory' },
            { key: 'B', text: 'to protect the young until they can feed and emerge' },
            { key: 'C', text: 'to attract a mate to the same plant' },
          ],
        },
        {
          number: 34,
          stem: 'What main advantage do group signals give?',
          options: [
            { key: 'A', text: 'they let one insect control the whole colony alone' },
            { key: 'B', text: 'they coordinate and protect the whole colony rather than one sender' },
            { key: 'C', text: 'they allow insects to copy the songs of other species' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Chemical scents between members of one species:', cells: [[{ blank: 35 }]] },
        { lead: 'Scout runs a', cells: [[{ blank: 36 }, { text: ' dance on the comb' }]] },
        { lead: 'Vibration travels through the', cells: [[{ blank: 37 }, { text: ' below the insect' }]] },
        { lead: 'Colony held together by the queen’s own', cells: [[{ blank: 38 }]] },
        { lead: 'Parasitoid', cells: [[{ blank: 39 }, { text: ' feed on the host body after hatching' }]] },
        { lead: 'An', cells: [[{ blank: 40 }, { text: ' signal spreads through the nest and benefits the whole group' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：each ant deposits small chemical markers along the path。蚂蚁靠沿路留下化学标记留迹，对应 A。B 的振翅与 C 的舞蹈是其他昆虫渠道。',
        en: 'Sentence 6: "each ant deposits small chemical markers along the path". Ants leave markers, matching A. Wing beating and comb dancing are other insect channels.',
      },
    },
    {
      number: 32, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：The waggle dance tells waiting bees the direction and the distance of a good flower patch。摆尾舞用来告知花田方向与距离，对应 B。A 的选址与 C 的告警在讲解中未作为舞蹈用途。',
        en: 'Sentence 11: "The waggle dance tells waiting bees the direction and the distance of a good flower patch". The dance gives direction and distance, matching B. Nest choice and intruder warning are not its stated use.',
      },
    },
    {
      number: 33, accepted: ['B'], evidence: 16,
      explanation: {
        zh: '定位句 16：Parasitoid wasps find a host such as a caterpillar and lay their eggs inside its body；句 17 补充 it protects the young until they are ready to feed and emerge。产卵于宿主体内是为保护幼虫到取食羽化阶段，对应 B。A 的领地标记与 C 的招引配偶未提及。',
        en: 'Sentence 16: "Parasitoid wasps find a host such as a caterpillar and lay their eggs inside its body"; sentence 17 adds "it protects the young until they are ready to feed and emerge". Eggs protect the young until feeding and emergence, matching B. Territory marking and mate attraction are not mentioned.',
      },
    },
    {
      number: 34, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：An alarm call does not protect only the sender; it puts the whole group on guard。群体信号协调并保护整个群体，对应 B。A 的单只控制全巢与 C 的模仿他种歌声未出现。',
        en: 'Sentence 19: "An alarm call does not protect only the sender; it puts the whole group on guard". Group signals protect the whole colony, matching B. Single-insect control and copying other species’ songs are not mentioned.',
      },
    },
    {
      number: 35, accepted: ['pheromones'], evidence: 22,
      explanation: {
        zh: '定位句 22：These scents are called pheromones, and each species produces its own blend。同种个体间的化学气味是信息素，填 pheromones。',
        en: 'Sentence 22: "These scents are called pheromones, and each species produces its own blend". The chemical scents are pheromones, so write pheromones.',
      },
    },
    {
      number: 36, accepted: ['figure-of-eight'], evidence: 25,
      explanation: {
        zh: '定位句 25：the scout runs a figure-of-eight dance on the comb。侦察蜂在巢脾上跳八字形舞，填 figure-of-eight。',
        en: 'Sentence 25: "the scout runs a figure-of-eight dance on the comb". The scout performs a figure-of-eight dance, so write figure-of-eight.',
      },
    },
    {
      number: 37, accepted: ['substrate'], evidence: 29,
      explanation: {
        zh: '定位句 29：the vibration enters the substrate below it。振动经昆虫下方的基质传导，填 substrate。句 30 的 plant stem 是基质的例子，不是空内词。',
        en: 'Sentence 29: "the vibration enters the substrate below it". Vibration travels through the substrate, so write substrate. The plant stem in sentence 30 is an example, not the gap word.',
      },
    },
    {
      number: 38, accepted: ['scent'], evidence: 33,
      explanation: {
        zh: '定位句 33：The queen of an insect colony maintains order through her own scent。群体靠蚁后自身气味维系，填 scent。',
        en: 'Sentence 33: "The queen of an insect colony maintains order through her own scent". The colony is held by the queen’s scent, so write scent.',
      },
    },
    {
      number: 39, accepted: ['larvae'], evidence: 38,
      explanation: {
        zh: '定位句 38：The larvae then feed on the host body, avoiding vital organs。拟寄生幼虫孵化后取食宿主身体，填 larvae。',
        en: 'Sentence 38: "The larvae then feed on the host body, avoiding vital organs". Parasitoid larvae feed on the host, so write larvae.',
      },
    },
    {
      number: 40, accepted: ['alarm'], evidence: 41,
      explanation: {
        zh: '定位句 41：An alarm signal spreads quickly through a nest and benefits the whole group。惠及全群的是警报信号，填 alarm。',
        en: 'Sentence 41: "An alarm signal spreads quickly through a nest and benefits the whole group". The group-wide signal is the alarm, so write alarm.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'In a woodland clearing last summer, researchers counted more than forty separate signals passing between ants on a single branch in under ten minutes.' },
    { speaker: 'lecturer', text: 'That observation leads us into one of the oldest communication systems on Earth, the signals used by insects.' },
    { speaker: 'lecturer', text: 'Insects do not speak in sentences, yet they coordinate foraging, defend nests, choose mates and arrange the next generation.' },
    { speaker: 'lecturer', text: 'We will follow three channels, chemical scents, movement and dance, and vibration through surfaces.' },
    { speaker: 'lecturer', text: 'The first channel is the most familiar to biologists, the chemical signal.' },
    { speaker: 'lecturer', text: 'Ants moving between the nest and a food source lay a thin trail that other ants can follow.' },
    { speaker: 'lecturer', text: 'This trail works because each ant deposits small chemical markers along the path.' },
    { speaker: 'lecturer', text: 'When a second ant finds the marker, it follows the line back to the food and adds its own trace on the return.' },
    { speaker: 'lecturer', text: 'The trail grows stronger while the food remains fresh, and it fades once the supply runs out.' },
    { speaker: 'lecturer', text: 'The dance of honeybees is the second well known channel, built entirely on movement.' },
    { speaker: 'lecturer', text: 'A returning forager performs a set of moves on the vertical comb inside the dark hive.' },
    { speaker: 'lecturer', text: 'The waggle dance tells waiting bees the direction and the distance of a good flower patch.' },
    { speaker: 'lecturer', text: 'Bees reading the dance leave the hive and fly the route themselves, rather than being led by the first scout.' },
    { speaker: 'lecturer', text: 'The third channel is quieter, and it travels not through the air but through whatever the insect stands on.' },
    { speaker: 'lecturer', text: 'Vibration passes along a leaf, a stem or the soil, carrying warnings or recruitment cues to neighbours.' },
    { speaker: 'lecturer', text: 'Now consider a special case of communication that looks harsh from a human point of view.' },
    { speaker: 'lecturer', text: 'Parasitoid wasps find a host such as a caterpillar and lay their eggs inside its body.' },
    { speaker: 'lecturer', text: 'This seems cruel, but it protects the young until they are ready to feed and emerge.' },
    { speaker: 'lecturer', text: 'The signals discussed so far all serve the colony or the species as a whole.' },
    { speaker: 'lecturer', text: 'An alarm call does not protect only the sender, and it puts the whole group on guard.' },
    { speaker: 'lecturer', text: 'That shared benefit is the main reason insect signalling evolved into such a wide range of forms.' },
    { speaker: 'lecturer', text: 'Chemical signals carry specific information between members of the same species.' },
    { speaker: 'lecturer', text: 'These scents are called pheromones, and each species produces its own blend.' },
    { speaker: 'lecturer', text: 'A food trail, a mate call and a nest alarm can all be sent with different pheromone mixes.' },
    { speaker: 'lecturer', text: 'Pheromones persist for minutes or hours, so they leave a record of where others have passed.' },
    { speaker: 'lecturer', text: 'Inside a honeybee colony, the scout runs a figure-of-eight dance on the comb.' },
    { speaker: 'lecturer', text: 'The straight run at the centre of the figure gives the angle relative to the sun.' },
    { speaker: 'lecturer', text: 'The length of that run estimates how far the patch lies from the hive.' },
    { speaker: 'lecturer', text: 'Observers may repeat the dance several times before enough bees join the trip.' },
    { speaker: 'lecturer', text: 'When an insect taps or shakes its body, the vibration enters the substrate below it.' },
    { speaker: 'lecturer', text: 'Plant stems are good conductors, and a leaf can carry a warning several centimetres along the row.' },
    { speaker: 'lecturer', text: 'Nearby insects detect the vibration through their legs, even when the air above is silent.' },
    { speaker: 'lecturer', text: 'Some species combine vibration with chemical signals, so the message reaches both close and distant neighbours.' },
    { speaker: 'lecturer', text: 'The queen of an insect colony maintains order through her own scent.' },
    { speaker: 'lecturer', text: 'Her pheromone tells workers she is present and healthy, which keeps the group working as one unit.' },
    { speaker: 'lecturer', text: 'If her scent weakens, workers may raise new queens or split the colony.' },
    { speaker: 'lecturer', text: 'The colony acts as a single body, with signals replacing the nervous system of a large animal.' },
    { speaker: 'lecturer', text: 'The parasitoid wasp eggs hatch inside the host after a short period.' },
    { speaker: 'lecturer', text: 'The larvae then feed on the host body, avoiding vital organs until they are nearly ready to emerge.' },
    { speaker: 'lecturer', text: 'By this stage the host is weakened, and the adult wasps leave to search for fresh hosts.' },
    { speaker: 'lecturer', text: 'This life cycle depends on the wasp recognising the right host by chemical cues first.' },
    { speaker: 'lecturer', text: 'An alarm signal spreads quickly through a nest and benefits the whole group.' },
    { speaker: 'lecturer', text: 'Workers rush to the entrance, close gaps and drive off the intruder before it reaches the brood.' },
    { speaker: 'lecturer', text: 'Even insects that do not raise the alarm themselves gain the safety of a defended nest.' },
    { speaker: 'lecturer', text: 'The same signals that defend the nest also guide teamwork on food collection.' },
    { speaker: 'lecturer', text: 'Foragers share locations, nurses tend the young, and guards patrol the boundary.' },
    { speaker: 'lecturer', text: 'Without these channels, a colony would split into individuals acting alone.' },
    { speaker: 'lecturer', text: 'Biologists compare insect communication to a simple code that can be combined in new ways.' },
    { speaker: 'lecturer', text: 'Each signal carries a small piece of information, but together they keep a complex society running.' },
    { speaker: 'lecturer', text: 'Many questions remain about how these channels develop across generations.' },
    { speaker: 'lecturer', text: 'We will return to the role of learning in insect colonies in the next session.' },
  ],
  vocabulary: [
    {
      term: 'markers', phonetic: '/ˈmɑːkəz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '标记物（蚂蚁留下的化学记号，复数）', en: 'small chemical signs left along a path' },
      usage: { zh: '可数复数；chemical markers、deposit markers。单数 marker。', en: 'Plural countable: chemical markers, deposit markers. Singular marker.' },
      collocations: ['chemical markers', 'deposit markers', 'trail markers'],
      example: { en: 'Each ant deposits small chemical markers along the path.', zh: '每只蚂蚁沿路留下细小化学标记。' },
      listening: { zh: '两个音节，重音在第一音节，复数结尾 /z/。', en: 'Two syllables, first-syllable stress, plural ending /z/.' },
    },
    {
      term: 'waggle dance', phonetic: '/ˈwæɡl dɑːns/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '摆尾舞（蜜蜂告知蜜源的动作）', en: 'the bee dance that signals flower direction and distance' },
      usage: { zh: '可数；perform the waggle dance、waggle dance movement。', en: 'Countable: perform the waggle dance, waggle dance movement.' },
      collocations: ['the waggle dance', 'perform the waggle dance', 'waggle dance moves'],
      example: { en: 'The waggle dance tells bees the direction and distance of the patch.', zh: '摆尾舞告知花田的方向与距离。' },
      listening: { zh: 'waggle 重音在前，/ɡl/ 连缀；dance 单音节。', en: 'Stress waggle first with /ɡl/ cluster; dance is one syllable.' },
    },
    {
      term: 'host', phonetic: '/həʊst/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '宿主（被拟寄生蜂利用的昆虫）', en: 'the animal body in which the wasp eggs develop' },
      usage: { zh: '可数；inside a host、the host body、fresh hosts。', en: 'Countable: inside a host, the host body, fresh hosts.' },
      collocations: ['a host such as a caterpillar', 'the host body', 'a fresh host'],
      example: { en: 'The wasp lays eggs inside the host caterpillar.', zh: '蜂把卵产在宿主毛虫体内。' },
      listening: { zh: '单音节；双元音 /əʊ/，结尾 /st/。', en: 'One syllable; diphthong /əʊ/, final /st/.' },
    },
    {
      term: 'colony', phonetic: '/ˈkɒləni/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '群体，巢穴（蚂蚁或蜜蜂社群）', en: 'the whole social group living and working together' },
      usage: { zh: '可数；the colony、worker colony、raise the colony。', en: 'Countable: the colony, worker colony, raise the colony.' },
      collocations: ['the whole colony', 'an insect colony', 'defend the colony'],
      example: { en: 'The alarm call puts the whole group on guard.', zh: '警报声让全群体进入警戒。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /ni/。', en: 'Three syllables, first-syllable stress, ending /ni/.' },
    },
    {
      term: 'pheromones', phonetic: '/ˈferəməʊnz/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '信息素（同种个体间的化学信号）', en: 'the chemical scents exchanged within one species' },
      usage: { zh: '可数复数；produce pheromones、pheromone mix。单数 pheromone。', en: 'Plural countable: produce pheromones, pheromone mix. Singular pheromone.' },
      collocations: ['produce pheromones', 'a pheromone mix', 'the queen’s pheromone'],
      example: { en: 'Each species produces its own blend of pheromones.', zh: '每个物种有自己的信息素配方。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /məʊnz/。', en: 'Three syllables, first-syllable stress, ending /məʊnz/.' },
    },
    {
      term: 'substrate', phonetic: '/ˈsʌbstreɪt/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '基质（昆虫脚下传导振动的表面）', en: 'the surface under the insect that carries vibration' },
      usage: { zh: '可数或不可数；the substrate below it、through the substrate。', en: 'Countable or uncountable: the substrate below it, through the substrate.' },
      collocations: ['the substrate below', 'through the substrate', 'a solid substrate'],
      example: { en: 'Vibration enters the substrate beneath the insect’s legs.', zh: '振动传入昆虫脚下的基质。' },
      listening: { zh: '两个音节，重音在第一音节，/streɪt/ 收尾。', en: 'Two syllables, first-syllable stress, ending /streɪt/.' },
    },
    {
      term: 'larvae', phonetic: '/ˈlɑːviː/', partOfSpeech: 'n.', sentenceIndex: 38,
      meaning: { zh: '幼虫（复数，拟寄生蜂幼体）', en: 'the young insects after hatching, plural form' },
      usage: { zh: '复数；单数 larva。the larvae、parasitoid larvae。', en: 'Plural; singular larva. The larvae, parasitoid larvae.' },
      collocations: ['the larvae', 'parasitoid larvae', 'the larvae hatch'],
      example: { en: 'The larvae feed on the host body after hatching.', zh: '幼虫孵化后取食宿主身体。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /viː/。', en: 'Two syllables, first-syllable stress, ending /viː/.' },
    },
    {
      term: 'alarm', phonetic: '/əˈlɑːm/', partOfSpeech: 'n.', sentenceIndex: 41,
      meaning: { zh: '警报（群体警戒信号）', en: 'the warning signal that prepares the nest for danger' },
      usage: { zh: '可数；alarm signal、raise the alarm、alarm call。', en: 'Countable: alarm signal, raise the alarm, alarm call.' },
      collocations: ['the alarm signal', 'raise the alarm', 'an alarm call'],
      example: { en: 'The alarm signal spreads through the whole nest.', zh: '警报信号传遍整个巢穴。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈlɑːm/。', en: 'Two syllables with second-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'lay a thin trail', sentenceIndex: 5,
      meaning: { zh: '留下气味路线', en: 'to mark a narrow path that others can follow' },
      usage: { zh: '及物；lay a thin trail、lay the trail。', en: 'Transitive: lay a thin trail, lay the trail.' },
      example: { en: 'Ants lay a thin trail between nest and food.', zh: '蚂蚁在巢穴与食物间留下细味迹。' },
    },
    {
      phrase: 'relative to the sun', sentenceIndex: 26,
      meaning: { zh: '相对于太阳的角度', en: 'measured against the sun’s position in the sky' },
      usage: { zh: '介词短语；the angle relative to the sun。', en: 'Prepositional phrase: the angle relative to the sun.' },
      example: { en: 'The dance angle is read relative to the sun.', zh: '舞蹈角度参照太阳方位判读。' },
    },
    {
      phrase: 'raise new queens', sentenceIndex: 35,
      meaning: { zh: '培育新蚁后，新蜂王', en: 'to rear new reproductive females in the colony' },
      usage: { zh: '及物；workers raise new queens。', en: 'Transitive: workers raise new queens.' },
      example: { en: 'Weakened scent leads workers to raise new queens.', zh: '气味转弱后工蜂会培育新蜂王。' },
    },
    {
      phrase: 'feed on', sentenceIndex: 38,
      meaning: { zh: '以……为食，取食', en: 'to eat the body of the host for growth' },
      usage: { zh: 'feed on 加对象；larvae feed on the host。', en: 'Feed on plus object: larvae feed on the host.' },
      example: { en: 'The larvae feed on the host body until emergence.', zh: '幼虫取食宿主身体直至羽化。' },
    },
    {
      phrase: 'split the colony', sentenceIndex: 35,
      meaning: { zh: '分群，拆成新群体', en: 'to divide the social group into separate nests' },
      usage: { zh: '及物；split the colony、the colony splits。', en: 'Transitive: split the colony, the colony splits.' },
      example: { en: 'Workers may split the colony after the queen’s scent fades.', zh: '蚁后气味消失后工蜂可能分群。' },
    },
    {
      phrase: 'acts as a single body', sentenceIndex: 36,
      meaning: { zh: '像一个整体般行动', en: 'behaving as one coordinated organism' },
      usage: { zh: 'act as 加名词；the colony acts as a single body。', en: 'Act as plus noun: the colony acts as a single body.' },
      example: { en: 'Signals let the colony act as a single body.', zh: '信号让群体像一个整体般运作。' },
    },
  ],
  tips: [
    {
      title: { zh: '概述段先分渠道再答题', en: 'Sort channels before answering' },
      body: {
        zh: '讲座开场把通讯分成化学气味、动作舞蹈、表面振动三条渠道。第 31 题蚂蚁化学标记、第 32 题蜜蜂舞蹈、第 33 题拟寄生蜂、第 34 题群体优势；听到 channel、signal 先归类，再把选项对到对应昆虫。',
        en: 'The opening splits communication into chemical scents, movement and dance, and surface vibration. Item 31 ant markers, 32 bee dance, 33 parasitoid wasp, 34 colony benefit. Sort after channel or signal before matching an option to an insect.',
      },
    },
    {
      title: { zh: '填空题按段落抓专业词', en: 'Catch technical terms in details' },
      body: {
        zh: '第 35–40 题集中在细节段：信息素 pheromones、八字形舞 figure-of-eight、基质 substrate、蚁后气味 scent、幼虫 larvae、警报 alarm。听到 These scents are called、runs a … dance、enters the … 这类定义句时，紧跟的专业名词就是答案。',
        en: 'Items 35–40 sit in the detail section: pheromones, figure-of-eight, substrate, scent, larvae, alarm. In definition sentences after These scents are called, runs a … dance, or enters the …, the following technical noun is the answer.',
      },
    },
    {
      title: { zh: '讲座因果题记后半句', en: 'Note the clause after cause' },
      body: {
        zh: '第 33 题问拟寄生蜂产卵原因，答案在 it protects the young until 之后；第 34 题问群体信号优势，答案在 does not protect only the sender 之后。听到 but、so、the reason、that shared benefit 时先记后半句内容。',
        en: 'Item 33 asks why wasps lay eggs, after it protects the young until; item 34’s benefit follows does not protect only the sender. Note the second clause after but, so, the reason, or that shared benefit.',
      },
    },
  ],
};
