import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 15 · Part 2 — 海滩清洁日活动说明（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：集合时间地点与分组装备（笔记 11–14）→ 垃圾分类与尖锐物、医疗废物处理（单选 15–18）
 * → 塑料瓶与油污包装的去向（配对 19–20）。题块顺序与录音一致。
 */
export const test15Part2: ListeningLesson = {
  slug: 'test-15-part-2',
  part: 2,
  status: 'published',
  title: { zh: '海滩清洁日活动说明', en: 'Instructions for a coastal clean-up day' },
  summary: {
    zh: '协调员在清洁日前说明集合地点与时间、每组人数与自带装备，讲解玻璃、塑料、金属与油污包装的分类方式，尖锐物和医疗废物的处理，安全提示，以及塑料瓶和污染包装最终分别送到哪里。',
    en: 'Before the clean-up, the coordinator explains the meeting point and time, group sizes and what volunteers bring, how glass, plastic, metal and greasy packaging are sorted, how sharp objects and medical waste are handled, the safety rules, and where plastic bottles and contaminated packaging end up.',
  },
  accent: { zh: '讲解员为新西兰口音。', en: 'The guide speaks with a New Zealand accent.' },
  speechRate: '+2%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Meeting point: car park near the', cells: [[{ blank: 11 }, { text: ' end of the beach' }]] },
        { lead: 'Walk onto the sand at', cells: [[{ blank: 12 }, { text: ' o’clock' }]] },
        { lead: 'Each group has about', cells: [[{ blank: 13 }, { text: ' volunteers' }]] },
        { lead: 'Bring your own sun', cells: [[{ blank: 14 }, { text: ' and water bottle' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'Where should glass be placed?',
          options: [
            { key: 'A', text: 'the green glass crate' },
            { key: 'B', text: 'the blue recycling bag' },
            { key: 'C', text: 'the cardboard box near the dunes' },
          ],
        },
        {
          number: 16,
          stem: 'What should you do with a sharp piece of metal?',
          options: [
            { key: 'A', text: 'wrap it in cloth and mark the bag' },
            { key: 'B', text: 'leave it beside the first aid kit' },
            { key: 'C', text: 'hand it straight to the coordinator' },
          ],
        },
        {
          number: 17,
          stem: 'Which item must not be collected by volunteers?',
          options: [
            { key: 'A', text: 'tangled fishing line' },
            { key: 'B', text: 'an unused syringe' },
            { key: 'C', text: 'a broken bottle' },
          ],
        },
        {
          number: 18,
          stem: 'What footwear does the coordinator require?',
          options: [
            { key: 'A', text: 'sandals are fine on dry sand' },
            { key: 'B', text: 'closed shoes are required' },
            { key: 'C', text: 'bare feet are safest on the rocks' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Where does each item go? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'washed and passed to the recycling partner depot' },
        { key: 'B', text: 'composted in the community garden' },
        { key: 'C', text: 'sold at the beach kiosk' },
        { key: 'D', text: 'stored for local craft projects' },
        { key: 'E', text: 'sealed and taken away as general waste' },
      ],
      items: [
        { number: 19, text: 'plastic bottles' },
        { number: 20, text: 'food-stained packaging' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['north'], evidence: 2,
      explanation: {
        zh: '定位句 2：the one near the north end of the beach, by the wooden notice board。集合点在海滩北端停车场；句 32 的 southern steps 是另一组的作业区，属于干扰方位。',
        en: 'Sentence 2: "the one near the north end of the beach, by the wooden notice board". The meeting point is the car park at the north end. The southern steps in sentence 32 belong to another group’s area, a distractor.',
      },
    },
    {
      number: 12, accepted: ['nine', '9'], evidence: 3,
      explanation: {
        zh: '定位句 3：The walk onto the sand begins at nine o’clock。九点开始走上沙滩；句 33 的 one 是集合返回时间，不是出发钟点。',
        en: 'Sentence 3: "The walk onto the sand begins at nine o’clock". The group reaches the sand at nine. The one o’clock in sentence 33 is the recall time, not the departure.',
      },
    },
    {
      number: 13, accepted: ['six', '6'], evidence: 4,
      explanation: {
        zh: '定位句 4：Each group has about six volunteers。每组约六人；句 5 的两只是袋子数量，不是人数。',
        en: 'Sentence 4: "Each group has about six volunteers". Each group has about six people. The two bags in sentence 5 are equipment, not the group size.',
      },
    },
    {
      number: 14, accepted: ['hat'], evidence: 6,
      explanation: {
        zh: '定位句 6：We ask you to bring your own sun hat and a full water bottle。自带遮阳帽和水瓶；手套与反光背心由协调员发放，不需要自带。',
        en: 'Sentence 6: "We ask you to bring your own sun hat and a full water bottle". Volunteers bring a hat and bottle. Gloves and the hi-vis vest are handed out by the marshal.',
      },
    },
    {
      number: 15, accepted: ['A'], evidence: 8,
      explanation: {
        zh: '定位句 8：Glass, especially bottles and jars, goes into the green glass crate。玻璃进绿色板条箱，对应 A；B 的蓝色回收袋专收塑料，C 的纸箱在独白中没有出现。',
        en: 'Sentence 8: "Glass, especially bottles and jars, goes into the green glass crate", matching A. The blue bag in B is for plastics, and the cardboard box in C is never mentioned.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 12,
      explanation: {
        zh: '定位句 12：wrap it in an old cloth before you place it in the bag，句 13 再要求在袋把手处做尖锐标记。布包加标记对应 A；B 的急救箱旁和 C 的直接交给协调员都与流程不符。',
        en: 'Sentence 12: "wrap it in an old cloth before you place it in the bag", and sentence 13 adds a sharp-object mark on the handle. That matches A. Leaving it by the kit in B and handing it to the coordinator in C do not match the procedure.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：If you see a syringe or any other medical waste, leave it exactly where it is。注射器等医疗废物不得触碰，对应 B；A 的鱼线和 C 的碎瓶句 16、17 都允许小心收集。',
        en: 'Sentence 14: "If you see a syringe or any other medical waste, leave it exactly where it is", matching B. Fishing line in A and broken bottles in C may be collected carefully in sentences 16 and 17.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：closed shoes are required for this work. Sandals and open toes are not allowed。必须穿全包鞋，对应 B；A 的凉鞋句 20 已否定，C 的光脚句 21 也不建议。',
        en: 'Sentence 20: "closed shoes are required for this work. Sandals and open toes are not allowed", matching B. Sandals in A are ruled out in sentence 20, and bare feet in C are not advised in sentence 21.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：The plastic bottles we collect are washed and passed to the local recycling partner depot across town。清洗后送回收合作仓库，对应 A；D 的工艺项目只收干净瓶盖，不是整只瓶子。',
        en: 'Sentence 30: "The plastic bottles we collect are washed and passed to the local recycling partner depot across town", matching A. The craft project in D takes only clean caps, not whole bottles.',
      },
    },
    {
      number: 20, accepted: ['E'], evidence: 31,
      explanation: {
        zh: '定位句 31：It is sealed and taken away with the general waste at the end of the day。油污包装密封后按一般垃圾运走，对应 E；B 的堆肥和 C 的 kiosk 出售在独白中都未提及。',
        en: 'Sentence 31: "It is sealed and taken away with the general waste at the end of the day", matching E. Composting in B and selling at the kiosk in C are not mentioned anywhere in the talk.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Everyone, can you gather round the supply barrels here before we split into groups for the clean-up.' },
    { speaker: 'coordinator', text: 'I am Priya, and I will be coordinating the beach side of today’s event.' },
    { speaker: 'coordinator', text: 'We meet at the main car park, the one near the north end of the beach, by the wooden notice board.' },
    { speaker: 'coordinator', text: 'The walk onto the sand begins at nine o’clock, so please arrive fifteen minutes early to collect your bags.' },
    { speaker: 'coordinator', text: 'Each group has about six volunteers, led by one of the trained marshals in orange jackets.' },
    { speaker: 'coordinator', text: 'Your marshal will give you a hi-vis vest, a pair of heavy gloves and two collection bags before you go out.' },
    { speaker: 'coordinator', text: 'We ask you to bring your own sun hat and a full water bottle, because there is little shade along the shore.' },
    { speaker: 'coordinator', text: 'Now a few words about sorting the rubbish you pick up.' },
    { speaker: 'coordinator', text: 'Glass, especially bottles and jars, goes into the green glass crate, not the general bag.' },
    { speaker: 'coordinator', text: 'Plastic bottles should be rinsed if possible, then dropped in the blue recycling bag for plastics.' },
    { speaker: 'coordinator', text: 'Food-stained packaging, like greasy wrappers and paper napkins, cannot be recycled here and goes in the sealed waste bags.' },
    { speaker: 'coordinator', text: 'Metal cans and foil go in a separate small sack, because they attract a different collection partner.' },
    { speaker: 'coordinator', text: 'If you find a sharp can or a piece of broken metal, wrap it in an old cloth before you place it in the bag.' },
    { speaker: 'coordinator', text: 'Mark that bag with the sharp symbol on the handle, so the collectors do not cut their hands later.' },
    { speaker: 'coordinator', text: 'There is one kind of item we do not want you to touch. If you see a syringe or any other medical waste, leave it exactly where it is.' },
    { speaker: 'coordinator', text: 'Raise your hand and tell your marshal, and the site manager will deal with it under protocol.' },
    { speaker: 'coordinator', text: 'Fishing line can be slippery and tangled, so pull it in slowly and keep it away from your face.' },
    { speaker: 'coordinator', text: 'Broken bottles are fine to collect, but hold them by the body and do not reach under rocks where shards may hide.' },
    { speaker: 'coordinator', text: 'Please do not step into the dunes. The nesting birds are sitting low in the grass, and their nests are easy to crush.' },
    { speaker: 'coordinator', text: 'Stick to the tide line and the firm wet sand, where your marshal can keep an eye on the whole group.' },
    { speaker: 'coordinator', text: 'About footwear, closed shoes are required for this work. Sandals and open toes are not allowed on the beach today.' },
    { speaker: 'coordinator', text: 'Bare feet are not advised either, even on the dry sand, because shells and broken glass are hard to see.' },
    { speaker: 'coordinator', text: 'If anyone feels unwell, sit down near the tide line and wave to your marshal. First aid is kept in the main car park trailer.' },
    { speaker: 'coordinator', text: 'Do not lift anything too heavy. A full bag of wet sand weighs more than it looks, so call a marshal to help carry it back.' },
    { speaker: 'coordinator', text: 'We will have a break at half past eleven near the picnic tables, with fruit and tea provided by the cafe.' },
    { speaker: 'coordinator', text: 'The cafe also sells water and fruit bars, but prices there are a little higher than the kiosk.' },
    { speaker: 'coordinator', text: 'Please keep your group together during the break, so nobody misses the walk back out.' },
    { speaker: 'coordinator', text: 'Lunch is not included, so you may want to bring a snack, or buy something from the kiosk after the walk.' },
    { speaker: 'coordinator', text: 'At the end of the morning, all bags are weighed at the trailer, and the totals go on the community board by the car park.' },
    { speaker: 'coordinator', text: 'Last year the volunteers collected nearly two tonnes of rubbish, and this year we hope to match that total.' },
    { speaker: 'coordinator', text: 'The plastic bottles we collect are washed and passed to the local recycling partner depot across town.' },
    { speaker: 'coordinator', text: 'The food-stained packaging does not get reused here. It is sealed and taken away with the general waste at the end of the day.' },
    { speaker: 'coordinator', text: 'A small amount of clean plastic, such as unbroken bottle caps, is stored for local craft projects in the community hall.' },
    { speaker: 'coordinator', text: 'Anything that cannot be identified should be left for the marshal to inspect before you put it in a bag.' },
    { speaker: 'coordinator', text: 'Now, if your name is on the red group list, follow Dave toward the north stretch of the beach.' },
    { speaker: 'coordinator', text: 'The blue group works the centre shore, and the green group covers the stones near the southern steps.' },
    { speaker: 'coordinator', text: 'Your marshal has a map of your section, and you will stay in that area until we call everyone back at one.' },
    { speaker: 'coordinator', text: 'One last reminder. Do not take anything home that you found on the beach, even a pretty shell.' },
    { speaker: 'coordinator', text: 'Everything collected today is weighed and recorded, and the seashore belongs to the birds and the tides.' },
    { speaker: 'coordinator', text: 'If you have questions while you are out, your marshal is the first person to ask.' },
    { speaker: 'coordinator', text: 'If the tide turns while you are out, move up the beach rather than following the waterline too far.' },
    { speaker: 'coordinator', text: 'Thank you all for coming out today. Put your gloves on, and let us look after this stretch of coast together.' },
  ],
  vocabulary: [
    {
      term: 'volunteers', phonetic: '/ˌvɒlənˈtɪəz/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '志愿者', en: 'a person who gives time to help without pay' },
      usage: { zh: '集合、分组场景高频：group of volunteers、sign up as a volunteer。', en: 'Common at events: a group of volunteers, sign up as a volunteer.' },
      collocations: ['a team of volunteers', 'volunteer work', 'volunteer shift'],
      example: { en: 'Each volunteer carries two bags and a pair of gloves.', zh: '每位志愿者带两个袋子和一副手套。' },
      listening: { zh: '重音在最后一个音节 /ˈtɪə/，前面三个音节轻快连读。', en: 'Stress the final syllable; the first three run together quickly.' },
    },
    {
      term: 'marshal', phonetic: '/ˈmɑːʃl/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '活动领队，协调员', en: 'the trained staff member who leads a small group on site' },
      usage: { zh: '现场活动领队；trained marshal、group marshal，不是军事元帅义。', en: 'An event group leader here, not the military rank: trained marshal, group marshal.' },
      collocations: ['the group marshal', 'a trained marshal', 'speak to your marshal'],
      example: { en: 'Your marshal will hand out the vests before you leave.', zh: '领队会在出发前发反光背心。' },
      listening: { zh: '两个音节 /ˈmɑː/ /ʃl/，中间不发元音。', en: 'Two syllables with no vowel between them.' },
    },
    {
      term: 'recycling', phonetic: '/ˌriːˈsaɪklɪŋ/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '回收利用，可回收物处理', en: 'processing used items so materials can be used again' },
      usage: { zh: 'the recycling partner、recycling depot；动词 recycle。', en: 'the recycling partner, recycling depot; the verb is recycle.' },
      collocations: ['the recycling partner', 'recycling depot', 'recycling bag'],
      example: { en: 'Bottles go to the recycling partner depot across town.', zh: '瓶子送往镇外的回收合作仓库。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsaɪ/，开头 /ˌriː/ 次重读。', en: 'Three syllables, stress on the second; the first has secondary stress.' },
    },
    {
      term: 'syringe', phonetic: '/sɪˈrɪndʒ/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '注射器，针管', en: 'a medical device used for injections' },
      usage: { zh: '危险废物场景：used syringe、medical syringe；不触碰、留在原地。', en: 'In hazardous waste: used syringe, medical syringe; leave it untouched.' },
      collocations: ['a used syringe', 'medical waste', 'a sharp syringe'],
      example: { en: 'Do not touch the syringe, and tell the marshal at once.', zh: '不要碰针管，立刻告诉领队。' },
      listening: { zh: '重音在第二音节 /ˈrɪndʒ/，开头 /sɪ/ 轻读。', en: 'Stress the second syllable; the opening /sɪ/ is weak.' },
    },
    {
      term: 'dunes', phonetic: '/djuːnz/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '沙丘（海边）', en: 'the low sandy banks near a beach' },
      usage: { zh: '复数常用：step into the dunes、the coastal dunes。', en: 'Usually plural: step into the dunes, coastal dunes.' },
      collocations: ['the sand dunes', 'nesting in the dunes', 'the dune grass'],
      example: { en: 'Please keep off the dunes where the birds nest.', zh: '请勿进入鸟类筑巢的沙丘。' },
      listening: { zh: '与 dunes 同音的 dun（暗褐色）靠语境区分；词尾 /z/ 浊化。', en: 'Homophone of dun; the final /z/ is voiced.' },
    },
    {
      term: 'tide', phonetic: '/taɪd/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '潮汐，潮水', en: 'the regular rise and fall of the sea' },
      usage: { zh: 'the tide line、tide turns；与 time 押韵但首辅音不同。', en: 'the tide line, the tide turns; it rhymes with time but starts differently.' },
      collocations: ['the tide line', 'the tide turns', 'high tide'],
      example: { en: 'Work along the tide line where the sand stays firm.', zh: '沿着潮水线在结实的沙地上作业。' },
      listening: { zh: '与 tied（系住）同音，靠搭配 tide line 判断词义。', en: 'A homophone of tied; the collocation tide line identifies it.' },
    },
    {
      term: 'protocol', phonetic: '/ˈprəʊtəkɒl/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '规程，处置流程', en: 'the official set of steps for handling a situation' },
      usage: { zh: 'deal with it under protocol、follow the protocol；正式场合用词。', en: 'deal with it under protocol, follow the protocol; formal register.' },
      collocations: ['under protocol', 'follow the protocol', 'the safety protocol'],
      example: { en: 'The manager removes the medical waste under protocol.', zh: '经理按规程处理医疗废物。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈprəʊ/，后两音节弱读。', en: 'Three syllables, stress on the first; the rest are reduced.' },
    },
  ],
  expressions: [
    {
      phrase: 'gather round', sentenceIndex: 0,
      meaning: { zh: '围拢过来，聚到一起', en: 'to move close together in a group to listen' },
      usage: { zh: '现场指令开头：gather round here、gather round the barrels。', en: 'An opening on-site instruction: gather round here, gather round the barrels.' },
      example: { en: 'Gather round the trailer so I can show you the bags.', zh: '围到拖车这边来，我给大家看袋子。' },
    },
    {
      phrase: 'split into groups', sentenceIndex: 0,
      meaning: { zh: '分成小组', en: 'to divide a large group into smaller teams' },
      usage: { zh: 'split into groups of four、split into three teams；被动式 be split into。', en: 'split into groups of four; the passive is be split into.' },
      example: { en: 'We will split into groups before we walk onto the sand.', zh: '走上沙滩前我们先分组。' },
    },
    {
      phrase: 'stick to', sentenceIndex: 19,
      meaning: { zh: '沿……走；遵守（路线或规则）', en: 'to stay on a route or keep to a rule' },
      usage: { zh: 'stick to the path、stick to the tide line；也指坚持计划。', en: 'stick to the path, the tide line; it also means keep to a plan.' },
      example: { en: 'Stick to the wet sand so the marshal can see you.', zh: '走湿沙地带，方便领队看到你。' },
    },
    {
      phrase: 'keep an eye on', sentenceIndex: 19,
      meaning: { zh: '照看，留意', en: 'to watch over someone or something' },
      usage: { zh: '后接人或物；= look after，口语更常用。', en: 'Follow with a person or thing; similar to look after, more colloquial.' },
      example: { en: 'The marshal keeps an eye on the whole group from the tide line.', zh: '领队在潮水线照看整组人。' },
    },
    {
      phrase: 'deal with', sentenceIndex: 15,
      meaning: { zh: '处理，处置', en: 'to handle a problem or a dangerous item' },
      usage: { zh: 'deal with the waste、deal with an incident；后接名词，不接不定式。', en: 'deal with the waste or an incident; it takes a noun, not an infinitive.' },
      example: { en: 'Only the site manager deals with medical waste.', zh: '只有现场经理处置医疗废物。' },
    },
    {
      phrase: 'take anything home', sentenceIndex: 37,
      meaning: { zh: '带回家', en: 'to carry something away from the site to your home' },
      usage: { zh: 'take anything home；否定句中强调不得带走场地物品。', en: 'take anything home; negatives stress that site items stay put.' },
      example: { en: 'Do not take shells or driftwood home from the reserve.', zh: '不要把保护区的贝壳或浮木带回家。' },
    },
  ],
  tips: [
    {
      title: { zh: '先看分类标签再听容器', en: 'Read the labels before the container' },
      body: {
        zh: '分类题先在选项旁写下颜色或材质关键词：green crate、blue bag、sealed waste bag。听到对应容器时回到题目，不要被近义的 recycling 一词带偏。',
        en: 'Note the colour or material beside each option first: green crate, blue bag, sealed waste bag. Return to the question when the container is named, and do not be led by the vague word recycling.',
      },
    },
    {
      title: { zh: '危险物品单独记忆', en: 'Treat hazardous items separately' },
      body: {
        zh: '独白把可收集的瓶子、鱼线与不可触碰的医疗废物分开讲。听到 leave it where it is、do not touch 这类指令时，在对应选项旁做记号，这通常是单选题答案。',
        en: 'The talk separates collectable bottles and line from items you must not touch. When you hear leave it where it is or do not touch, mark the option; such instructions usually identify the single-choice answer.',
      },
    },
    {
      title: { zh: '配对题跟着物品顺序走', en: 'Match in the order of the items' },
      body: {
        zh: '配对的塑料瓶与油污包装在独白后半段依次出现。听前先把两个物品名圈出，听到第一个就选第一个去向，听到第二个再选第二个，不要提前交叉匹配。',
        en: 'The matched bottles and greasy packaging appear one after another late in the talk. Circle both items first; choose the destination for the first as it appears, then the second, without crossing over early.',
      },
    },
  ],
};
