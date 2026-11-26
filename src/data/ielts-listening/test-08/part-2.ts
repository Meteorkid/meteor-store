import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 8 · Part 2 — 植物园温室导览（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 独白按温室分区推进：雨林温室、干旱区、授粉区，再讲参观规则、闭园时间与团队分工。
 * 开场用现场提醒，不重复 welcome to 句式。
 */
export const test08Part2: ListeningLesson = {
  slug: 'test-08-part-2',
  part: 2,
  status: 'published',
  title: { zh: '植物园导览', en: 'A tour of the botanical garden' },
  summary: {
    zh: '讲解员带参观者依次走过雨林温室、干旱区和授粉区，介绍各分区植物、珍稀兰花的来源、参观规则与工作日闭园时间，并说明入口志愿者、首席园艺师和见习园艺师各自的工作。',
    en: 'A guide takes visitors through the rainforest greenhouse, the arid zone and the pollination area, describing the plants, the origin of a rare orchid, the rules, the weekday closing time, and the duties of the entrance volunteer, the head gardener and the trainee.',
  },
  accent: { zh: '讲解员为英式口音，语速中等。', en: 'The guide has a British accent and speaks at a moderate pace.' },
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      columns: ['Zone', 'What you can see or do'],
      rows: [
        { lead: 'Tropical greenhouse', cells: [[{ text: 'plants from the ' }, { blank: 11 }, { text: ' forest' }]] },
        { lead: 'Arid zone', cells: [[{ text: 'cacti and ' }, { blank: 12 }]] },
        { lead: 'Pollination area', cells: [[{ text: 'watch bees visit the ' }, { blank: 13 }]] },
        { lead: 'Volunteer guided tours', cells: [[{ blank: 14 }, { text: ' each morning' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'Where did the rare orchid originally come from?',
          options: [
            { key: 'A', text: 'South-east Asia' },
            { key: 'B', text: 'South America' },
            { key: 'C', text: 'southern Africa' },
          ],
        },
        {
          number: 16,
          stem: 'What is forbidden inside the glasshouses?',
          options: [
            { key: 'A', text: 'Touching the plants' },
            { key: 'B', text: 'Taking photographs' },
            { key: 'C', text: 'Eating fruit and drink' },
          ],
        },
        {
          number: 17,
          stem: 'When does the garden close on weekdays?',
          options: [
            { key: 'A', text: 'five thirty' },
            { key: 'B', text: 'six thirty' },
            { key: 'C', text: 'seven' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which duty matches each member of the gardening team? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'watering the young seedlings' },
        { key: 'B', text: 'repotting rare orchids' },
        { key: 'C', text: 'pruning the rose beds' },
        { key: 'D', text: 'collecting seeds for next year' },
        { key: 'E', text: 'cleaning the glass roof' },
        { key: 'F', text: 'leading family workshops' },
      ],
      items: [
        { number: 18, text: 'the volunteer at the entrance' },
        { number: 19, text: 'the head gardener' },
        { number: 20, text: 'the trainee gardener' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['rainforest'], evidence: 4,
      explanation: {
        zh: '定位句 4：It holds plants from the rainforest, grown under the tallest glass in the garden。热带温室的植物来自雨林；空后已印 forest，只填 rain。',
        en: 'Sentence 4: "It holds plants from the rainforest, grown under the tallest glass in the garden". The tropical plants come from the rainforest; forest is already printed, so write rain only.',
      },
    },
    {
      number: 12, accepted: ['succulents'], evidence: 8,
      explanation: {
        zh: '定位句 8：It collects cacti and succulents, all used to long dry spells and bright sun。干旱区除仙人掌外是多肉植物；注意拼写 succulents。',
        en: 'Sentence 8: "It collects cacti and succulents, all used to long dry spells and bright sun". Besides cacti, the arid zone holds succulents; spell succulents carefully.',
      },
    },
    {
      number: 13, accepted: ['hives'], evidence: 11,
      explanation: {
        zh: '定位句 11：Here you can watch bees visit the hives and move from one bloom to the next。授粉区观察蜜蜂进出蜂箱；flowers 是蜜蜂停留的对象，不是空里的词。',
        en: 'Sentence 11: "Here you can watch bees visit the hives and move from one bloom to the next". In the pollination area you watch bees at the hives; flowers are what they land on, not the answer.',
      },
    },
    {
      number: 14, accepted: ['eleven', '11'], evidence: 13,
      explanation: {
        zh: '定位句 13：Volunteers give guided tours of the garden at eleven each morning。志愿讲解上午十一点开始；句 14 的四十分钟是步行时长，不是集合时间。',
        en: 'Sentence 13: "Volunteers give guided tours of the garden at eleven each morning". The volunteer walk starts at eleven; the forty minutes in sentence 14 is its length, not the meeting time.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：a small orchid brought back from South America。珍稀兰花来自南美；东南亚和非洲在全段没有提到。',
        en: 'Sentence 23: "a small orchid brought back from South America". The rare orchid comes from South America; South-east Asia and southern Africa are never mentioned.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：First, do not touch the plants. The leaves bruise easily。禁止触摸植物；拍照在句 18 被允许，饮食只限室外长椅。',
        en: 'Sentence 17: "First, do not touch the plants. The leaves bruise easily". Touching plants is forbidden; photography is allowed in sentence 18, and eating and drinking are limited to outside benches.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：The garden stays open until six thirty on weekdays, and an hour later at the weekend。工作日六点半闭园；七点是周末时间，五点半没有依据。',
        en: 'Sentence 20: "The garden stays open until six thirty on weekdays, and an hour later at the weekend". Weekday closing is six thirty; seven is the weekend hour, and five thirty has no basis.',
      },
    },
    {
      number: 18, accepted: ['F'], evidence: 27,
      explanation: {
        zh: '定位句 27：The volunteer at the entrance looks after the family workshops and the trail sheets for children。入口志愿者负责家庭工作坊，对应 F。',
        en: 'Sentence 27: "The volunteer at the entrance looks after the family workshops and the trail sheets for children". The entrance volunteer runs family workshops, matching F.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：She is the person who repots the rare orchids and decides which plants move to the display beds。首席园艺师负责换盆珍稀兰花，对应 B。',
        en: 'Sentence 29: "She is the person who repots the rare orchids and decides which plants move to the display beds". The head gardener repots the rare orchids, matching B.',
      },
    },
    {
      number: 20, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：The trainee gardener, who you may see with a watering can, is watering the young seedlings by the eastern window。见习园艺师给幼苗浇水，对应 A。句 31 收集种子是另一名见习生。',
        en: 'Sentence 30: "The trainee gardener, who you may see with a watering can, is watering the young seedlings by the eastern window". The trainee waters the seedlings, matching A. Collecting seeds in sentence 31 is another trainee.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Mind the step just inside the main entrance, and please keep to the marked paths.' },
    { speaker: 'guide', text: 'I’m Anna, one of the garden guides, and I’ll show you round the glasshouses today.' },
    { speaker: 'guide', text: 'We’ll move through four zones, and stop in each one for about ten minutes.' },
    { speaker: 'guide', text: 'The first building you enter is the tropical greenhouse.' },
    { speaker: 'guide', text: 'It holds plants from the rainforest, grown under the tallest glass in the garden.' },
    { speaker: 'guide', text: 'You’ll see tall palms, ferns that hang from the frames, and several varieties of banana.' },
    { speaker: 'guide', text: 'The air here is warm and damp, so take a breath before we move on.' },
    { speaker: 'guide', text: 'The second zone is the arid zone, on the other side of the courtyard.' },
    { speaker: 'guide', text: 'It collects cacti and succulents, all used to long dry spells and bright sun.' },
    { speaker: 'guide', text: 'These plants store water in their thick stems, and they need very little watering in winter.' },
    { speaker: 'guide', text: 'Beyond the arid zone lies the pollination area, a covered bed open to the bees.' },
    { speaker: 'guide', text: 'Here you can watch bees visit the hives and move from one bloom to the next.' },
    { speaker: 'guide', text: 'A board beside the path explains which flowers open first in the morning.' },
    { speaker: 'guide', text: 'Volunteers give guided tours of the garden at eleven each morning.' },
    { speaker: 'guide', text: 'The meeting point is the bench outside the arid zone, and the walk lasts forty minutes.' },
    { speaker: 'guide', text: 'There is also a family workshop on Saturday afternoons, for children aged six and over.' },
    { speaker: 'guide', text: 'A few rules apply inside the glasshouses.' },
    { speaker: 'guide', text: 'First, do not touch the plants. The leaves bruise easily, and some hairs can irritate the skin.' },
    { speaker: 'guide', text: 'Photography is allowed, but please switch off the flash near the delicate seedlings.' },
    { speaker: 'guide', text: 'You may eat and drink on the outside benches only, not among the displays.' },
    { speaker: 'guide', text: 'The garden stays open until six thirty on weekdays, and an hour later at the weekend.' },
    { speaker: 'guide', text: 'The ticket desk closes half an hour before that, so leave time if you want a guidebook.' },
    { speaker: 'guide', text: 'If it rains, the covered corridor links all four buildings, so you need not rush outside.' },
    { speaker: 'guide', text: 'The rarest plant in this building is a small orchid brought back from South America.' },
    { speaker: 'guide', text: 'Its flowers open for only two weeks each spring, so we are lucky to catch it now.' },
    { speaker: 'guide', text: 'It came to us through a botanic exchange, not a commercial nursery.' },
    { speaker: 'guide', text: 'Around you today are several members of the gardening team.' },
    { speaker: 'guide', text: 'The volunteer at the entrance looks after the family workshops and the trail sheets for children.' },
    { speaker: 'guide', text: 'You will meet the head gardener in the pollination area later this morning.' },
    { speaker: 'guide', text: 'She is the person who repots the rare orchids and decides which plants move to the display beds.' },
    { speaker: 'guide', text: 'The trainee gardener, who you may see with a watering can, is watering the young seedlings by the eastern window.' },
    { speaker: 'guide', text: 'Another trainee spends the summer collecting seeds to sow next spring.' },
    { speaker: 'guide', text: 'Before we go in, any questions about the route or the cafe?' },
    { speaker: 'guide', text: 'The cafe sells soup and sandwiches, and it overlooks the lily pond.' },
    { speaker: 'guide', text: 'You can pick up a seed packet as a souvenir from the shop near the exit.' },
    { speaker: 'guide', text: 'We have a short leaflet in four languages, free at the door.' },
    { speaker: 'guide', text: 'If you feel tired, the quiet bench beside the arid zone is away from the main path.' },
    { speaker: 'guide', text: 'A poster by the exit lists the plant collection by zone.' },
    { speaker: 'guide', text: 'You can also subscribe to the garden’s seasonal bulletin online.' },
    { speaker: 'guide', text: 'Let us start in the tropical greenhouse, and watch your step on the damp stone floor.' },
  ],
  vocabulary: [
    {
      term: 'rainforest', phonetic: '/ˈreɪnfɒrɪst/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '雨林', en: 'a dense tropical forest with heavy rainfall' },
      usage: { zh: '可数或不可数；the rainforest、rainforest plants。', en: 'Countable or uncountable: the rainforest, rainforest plants.' },
      collocations: ['the rainforest', 'rainforest plants', 'a rainforest climate'],
      example: { en: 'The greenhouse grows plants from the rainforest.', zh: '温室种植来自雨林的植物。' },
      listening: { zh: '复合词，重音在第一音节 rain；中间 /f/ 清晰。', en: 'A compound with stress on rain; the middle /f/ is clear.' },
    },
    {
      term: 'arid', phonetic: '/ˈærɪd/', partOfSpeech: 'adj.', sentenceIndex: 7,
      meaning: { zh: '干旱的，干燥的', en: 'having little rainfall and very dry soil' },
      usage: { zh: '地理描述词；arid zone、arid climate。', en: 'A geography adjective: arid zone, arid climate.' },
      collocations: ['the arid zone', 'an arid climate', 'arid conditions'],
      example: { en: 'The second zone recreates an arid landscape.', zh: '第二个分区再现干旱地貌。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈær/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'succulents', phonetic: '/ˈsʌkjələnts/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '多肉植物', en: 'thick-fleshed plants such as cacti that store water' },
      usage: { zh: '只用复数；cacti and succulents、succulent plants。', en: 'Plural only: cacti and succulents. The adjective is succulent.' },
      collocations: ['cacti and succulents', 'grow succulents', 'succulent collection'],
      example: { en: 'The arid zone holds cacti and succulents.', zh: '干旱区种植仙人掌和多肉植物。' },
      listening: { zh: '三个音节，重音在第一音节；中间 /kjə/ 连读。', en: 'Three syllables with stress on the first; the middle /kjə/ links smoothly.' },
    },
    {
      term: 'pollination', phonetic: '/ˌpɒləˈneɪʃn/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '授粉', en: 'the transfer of pollen that allows plants to set seed' },
      usage: { zh: '不可数；pollination area、bee pollination。动词 pollinate。', en: 'Uncountable: pollination area. The verb is pollinate.' },
      collocations: ['the pollination area', 'bee pollination', 'cross-pollination'],
      example: { en: 'The covered bed is the garden’s pollination area.', zh: '这片敞篷花圃是花园的授粉区。' },
      listening: { zh: '五个音节，重音在第四个 /ˈneɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'orchid', phonetic: '/ˈɔːkɪd/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '兰花', en: 'a plant with an unusual showy flower, often grown in glasshouses' },
      usage: { zh: '可数；rare orchid、orchid flowers。', en: 'Countable: rare orchid, orchid flowers.' },
      collocations: ['a rare orchid', 'orchid flowers', 'repot an orchid'],
      example: { en: 'The rarest plant here is a small South American orchid.', zh: '这里最珍稀的植物是一株南美小兰花。' },
      listening: { zh: '两个音节，重音在第一音节；开头 /ɔː/ 长音。', en: 'Two syllables with stress on the first and a long opening /ɔː/.' },
    },
    {
      term: 'seedlings', phonetic: '/ˈsiːdlɪŋz/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '幼苗，小苗', en: 'young plants grown from seed' },
      usage: { zh: '可数复数；water the seedlings、young seedlings。', en: 'Countable plural: water the seedlings, young seedlings.' },
      collocations: ['the young seedlings', 'water the seedlings', 'pot the seedlings'],
      example: { en: 'The trainee is watering the young seedlings by the window.', zh: '见习生在窗边给幼苗浇水。' },
      listening: { zh: '复合词 seed + ling，重音在第一音节。', en: 'Compound seed plus ling, stress on the first.' },
    },
    {
      term: 'repots', phonetic: '/ˌriːˈpɒts/', partOfSpeech: 'v.', sentenceIndex: 29,
      meaning: { zh: '换盆，移栽到新花盆', en: 'to move a plant into a larger pot with fresh compost' },
      usage: { zh: '第三人称 repots；名词 repotting。', en: 'Third person repots; the noun is repotting.' },
      collocations: ['repot the orchids', 'repot a seedling', 'repot in spring'],
      example: { en: 'The head gardener repots the rare orchids each spring.', zh: '首席园艺师每年春天给珍稀兰花换盆。' },
      listening: { zh: '重音在第二音节 /ˈpɒ/；前缀 ree 读 /riː/。', en: 'Stress the second syllable; the prefix is /riː/.' },
    },
    {
      term: 'trainee', phonetic: '/ˌtreɪˈniː/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '见习生，受训人员', en: 'a person learning a practical job under supervision' },
      usage: { zh: '可数；trainee gardener、a trainee nurse。', en: 'Countable: trainee gardener, a trainee nurse.' },
      collocations: ['the trainee gardener', 'a trainee', 'trainee placement'],
      example: { en: 'The trainee gardener carries a watering can around the beds.', zh: '见习园艺师提着洒水壶在花圃间走动。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈniː/。', en: 'Two syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'mind the step', sentenceIndex: 0,
      meaning: { zh: '留意台阶', en: 'watch your foot for a raised step' },
      usage: { zh: '现场提醒用语；Mind the step 是英式场馆常见告示。', en: 'An on-site reminder; mind the step is a familiar British notice.' },
      example: { en: 'Mind the step just inside the main entrance.', zh: '主入口内侧注意台阶。' },
    },
    {
      phrase: 'used to', sentenceIndex: 8,
      meaning: { zh: '习惯于，适应于', en: 'accustomed to a condition or treatment' },
      usage: { zh: 'be used to something / doing something；不要和 used to do（过去常常）混淆。', en: 'Be used to something; do not confuse with used to do, meaning once did.' },
      example: { en: 'These plants are used to long dry spells.', zh: '这些植物适应长期干旱。' },
    },
    {
      phrase: 'beyond the arid zone', sentenceIndex: 10,
      meaning: { zh: '在干旱区的更远处', en: 'past the place just mentioned' },
      usage: { zh: '方位描述；Beyond the arid zone lies the pollination area。', en: 'A route description: beyond the arid zone lies the pollination area.' },
      example: { en: 'The pollination area lies beyond the arid zone.', zh: '授粉区在干旱区的更远处。' },
    },
    {
      phrase: 'catch it now', sentenceIndex: 24,
      meaning: { zh: '赶上（短暂开放的时机）', en: 'to be present during a brief period when something is visible' },
      usage: { zh: 'catch 在此处指“赶上见到”；catch the flower, catch the show。', en: 'Here catch means arrive in time to see: catch the flower.' },
      example: { en: 'The flowers open for two weeks, so we are lucky to catch it now.', zh: '花期只有两周，能赶上看很幸运。' },
    },
    {
      phrase: 'came to us through', sentenceIndex: 25,
      meaning: { zh: '经由……来到我们这里', en: 'arrived by means of a particular route or arrangement' },
      usage: { zh: 'through 后接机构或渠道；come to us through an exchange。', en: 'Through names the channel: come to us through an exchange.' },
      example: { en: 'The orchid came to us through a botanic exchange.', zh: '这株兰花通过植物园交流来到我们这里。' },
    },
    {
      phrase: 'pick up', sentenceIndex: 34,
      meaning: { zh: '随手取，领取', en: 'to take or collect something from a place' },
      usage: { zh: '可分短语动词；pick up a leaflet、pick up a souvenir。', en: 'Separable: pick up a leaflet, pick up a souvenir.' },
      example: { en: 'You can pick up a seed packet from the shop near the exit.', zh: '你可以在出口旁的商店取一包花种。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题先按分区定位', en: 'Locate the zone first' },
      body: {
        zh: '第 11–14 题按温室分区排列。听前把四个区名标在表格旁，听到 tropical greenhouse、arid zone、pollination area、guided tour 就知道对应哪一空，不要等讲完一段再回头找。',
        en: 'Items 11 to 14 follow the garden zones. Mark the four zone names beside the table before the recording; when you hear tropical greenhouse, arid zone, pollination area or guided tour, you know which gap matches.',
      },
    },
    {
      title: { zh: '配对题先记岗位再记工作', en: 'For matching, note the role then the duty' },
      body: {
        zh: '第 18–20 题把团队成员和职责配对。独白先报身份（volunteer、head gardener、trainee），再说工作内容；听到身份词时在题号旁做记号，再把职责对上选项字母。',
        en: 'Items 18 to 20 pair team members with duties. The guide names the role first, volunteer, head gardener or trainee, then the work. Mark the role beside the number, then match the duty to a letter.',
      },
    },
    {
      title: { zh: '禁止事项听否定词', en: 'For rules, listen for negatives' },
      body: {
        zh: '第 16 题问禁止行为，答案在 do not touch 之后；允许事项（photography is allowed）和受限事项（outside benches only）都是干扰。规则类题目留意 not、only、forbidden 这些限定词。',
        en: 'Item 16 asks what is forbidden, and the answer follows do not touch. Allowed actions such as photography and limited ones such as outside benches only are distractors. Watch negatives and limits such as not, only and forbidden in rule items.',
      },
    },
  ],
};
