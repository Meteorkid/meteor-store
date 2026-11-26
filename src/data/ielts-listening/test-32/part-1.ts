import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 32 · Part 1 — 加入农场志愿项目（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：每周时段 → 农活种类 → 交通安排 → 住宿 → 健康要求（笔记 1–5），
 * 后半段谈设备使用、雨天安排、费用、餐食与鞋履（单选 6–10）。题块顺序与录音一致。
 */
export const test32Part1: ListeningLesson = {
  slug: 'test-32-part-1',
  part: 1,
  status: 'published',
  title: { zh: '加入农场志愿项目', en: 'Joining a farm volunteering scheme' },
  summary: {
    zh: '一名大学生咨询农场志愿项目：每周六到场、当季主要摘水果、从市场广场搭七点四十五的便车、过夜者住六人一间的集体宿舍，健康上需有破伤风疫苗并穿防滑封脚靴。随后弄清志愿者不操作机械、雨天进包装棚分拣水果、注册学生免费且含午餐与住宿，午餐包含而晚餐自行分摊。',
    en: 'A student enquires about a farm scheme: Saturdays, fruit picking, a seven forty-five lift from the market square, a shared six-bed bunkhouse, and a tetanus injection with closed boots. Later: no machinery for volunteers, wet-day packing shed, free entry for registered students, included lunch, shared evening meal, required footwear.',
  },
  accent: { zh: '报名者为美式口音，农场协调员为澳式口音。', en: 'The applicant speaks with an American accent and the farm coordinator with an Australian accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'applicant', label: 'APPLICANT', gender: 'female', voice: 'en-US-JennyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Volunteer day each week:', cells: [[{ blank: 1 }]] },
        { lead: 'Main farm task in this season:', cells: [[{ blank: 2 }]] },
        { lead: 'Lift leaves from the market', cells: [[{ blank: 3 }]] },
        { lead: 'Overnight guests sleep in a shared', cells: [[{ blank: 4 }]] },
        { lead: 'Health requirement: current', cells: [[{ blank: 5 }, { text: ' injection' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'How do volunteers work with equipment?',
          options: [
            { key: 'A', text: 'they take turns driving small tractors' },
            { key: 'B', text: 'they use hand tools and ladders checked by staff' },
            { key: 'C', text: 'they load the harvest onto farm lorries' },
          ],
        },
        {
          number: 7,
          stem: 'If it rains heavily, volunteers work in',
          options: [
            { key: 'A', text: 'the packing shed sorting and boxing fruit' },
            { key: 'B', text: 'the vegetable rows weeding between showers' },
            { key: 'C', text: 'the bunkhouse preparing the next day’s boxes' },
          ],
        },
        {
          number: 8,
          stem: 'What applies to registered students?',
          options: [
            { key: 'A', text: 'they pay half the season donation' },
            { key: 'B', text: 'they take part for free, with lunch and stay included' },
            { key: 'C', text: 'they cover their own lunch and bunkhouse stay' },
          ],
        },
        {
          number: 9,
          stem: 'What meal arrangement applies to volunteers?',
          options: [
            { key: 'A', text: 'lunch is included, while the evening meal is shared between volunteers' },
            { key: 'B', text: 'volunteers buy all their meals from the farm shop' },
            { key: 'C', text: 'breakfast and dinner are provided free by the scheme' },
          ],
        },
        {
          number: 10,
          stem: 'What must volunteers wear?',
          options: [
            { key: 'A', text: 'open sandals for the orchard paths' },
            { key: 'B', text: 'closed boots with a good sole' },
            { key: 'C', text: 'rubber boots provided on site' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Saturday'], evidence: 3,
      explanation: {
        zh: '定位句 3：Most volunteers come on a Saturday, from eight in the morning until four, and some stay for a Sunday morning session as well。每周固定志愿日是 Saturday；句 3 的 Sunday morning 只是少数人额外留下的时段。',
        en: 'Sentence 3: "Most volunteers come on a Saturday, from eight in the morning until four". The regular volunteer day is Saturday. The Sunday morning in the same sentence is an optional extra for a few.',
      },
    },
    {
      number: 2, accepted: ['picking'], evidence: 5,
      explanation: {
        zh: '定位句 5：The main task in this season is fruit picking, mostly apples and plums。当季主要农活是摘水果，填 picking；句 5 的 weeding 是附带帮助，不是主任务。',
        en: 'Sentence 5: "The main task in this season is fruit picking, mostly apples and plums". The main task is picking. Weeding in the same sentence is secondary help, not the main job.',
      },
    },
    {
      number: 3, accepted: ['square'], evidence: 7,
      explanation: {
        zh: '定位句 7：we arrange a lift from the market square at seven forty-five。便车从市场广场出发，填 square；bus stop 是农场距离参照点，不是上车处。',
        en: 'Sentence 7: "we arrange a lift from the market square at seven forty-five". The lift leaves from the market square, so write square. The bus stop is a distance reference, not the pickup point.',
      },
    },
    {
      number: 4, accepted: ['bunkhouse'], evidence: 9,
      explanation: {
        zh: '定位句 9：Overnight guests sleep in a shared bunkhouse, with six beds to a room。过夜者住集体宿舍 bunkhouse；blankets 是提供物，不是住处名称。',
        en: 'Sentence 9: "Overnight guests sleep in a shared bunkhouse, with six beds to a room". Overnight guests use the bunkhouse. Blankets are supplied items, not the lodging name.',
      },
    },
    {
      number: 5, accepted: ['tetanus'], evidence: 11,
      explanation: {
        zh: '定位句 11：You need a current tetanus injection, and closed boots with a good sole。健康要求是破伤风疫苗，填 tetanus；boots 是穿着要求，不是健康项目。',
        en: 'Sentence 11: "You need a current tetanus injection, and closed boots with a good sole". The health requirement is a tetanus injection. Boots are footwear, not the health item.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：No machinery is operated by volunteers. You use hand tools and ladders, and a member of staff checks the ladders before each use。志愿者只用手工工具和经检查的梯子对应 B；A 的拖拉机与 C 的装车都被句 17 排除。',
        en: 'Sentence 17: "No machinery is operated by volunteers. You use hand tools and ladders, and a member of staff checks the ladders before each use". Hand tools and checked ladders match B. Tractors and loading lorries are ruled out.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：A wet day moves the group to the packing shed, where fruit is sorted and boxed instead of picked outside。雨天进包装棚分拣装箱对应 A；B 的雨中除草与 C 的在宿舍备箱均未出现。',
        en: 'Sentence 19: "A wet day moves the group to the packing shed, where fruit is sorted and boxed instead of picked outside". The packing shed matches A. Weeding in showers and preparing boxes in the bunkhouse are not mentioned.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：registered students take part for free, and the lunch and bunkhouse stay are included in that。注册学生免费、含午餐与住宿对应 B；A 的半价捐赠与 C 的自付食宿与录音相反。',
        en: 'Sentence 21: "registered students take part for free, and the lunch and bunkhouse stay are included in that". Free entry with included meals and stay matches B. Half-price donation and self-paid lodging contradict the recording.',
      },
    },
    {
      number: 9, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：Volunteers get lunch included, and breakfast for those staying over, but the evening meal is arranged between yourselves。午餐包含、晚餐志愿者自行分摊对应 A；B 的全自费与 C 的早晚免费均与录音相反。',
        en: 'Sentence 23: "Volunteers get lunch included, and breakfast for those staying over, but the evening meal is arranged between yourselves". Included lunch and a shared evening meal match A. Buying all meals and free dinner both contradict the recording.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：do remember the closed boots with a good sole, since sandals are not safe on the muddy paths。封脚防滑靴对应 B；A 的凉鞋被句中否定，C 的现场提供胶靴在讲解中未出现。',
        en: 'Sentence 24: "do remember the closed boots with a good sole, since sandals are not safe on the muddy paths". Closed boots match B. Sandals are ruled out, and supplied rubber boots are not mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'applicant', text: 'Hi, I’m calling about the farm volunteering scheme I saw on the college website.' },
    { speaker: 'coordinator', text: 'Hello, thanks for calling. I’m Eli, the farm coordinator, and I’ll go through the details with you.' },
    { speaker: 'applicant', text: 'Great. How often do volunteers come each week?' },
    { speaker: 'coordinator', text: 'Most volunteers come on a Saturday, from eight in the morning until four, and some stay for a Sunday morning session as well.' },
    { speaker: 'applicant', text: 'Saturdays. What sort of work would I be doing?' },
    { speaker: 'coordinator', text: 'The main task in this season is fruit picking, mostly apples and plums, and we also need help with weeding the vegetable rows.' },
    { speaker: 'applicant', text: 'Do I need my own way there, or is there transport from town?' },
    { speaker: 'coordinator', text: 'The farm is four miles from the nearest bus stop, so we arrange a lift from the market square at seven forty-five on volunteer days.' },
    { speaker: 'applicant', text: 'Seven forty-five from the square. Where do volunteers stay if the project runs long?' },
    { speaker: 'coordinator', text: 'Overnight guests sleep in a shared bunkhouse, with six beds to a room, and blankets are provided on site.' },
    { speaker: 'applicant', text: 'Is there anything I should prepare health-wise before coming?' },
    { speaker: 'coordinator', text: 'You need a current tetanus injection, and closed boots with a good sole, because the orchard paths can be muddy.' },
    { speaker: 'applicant', text: 'A tetanus injection and sturdy boots. Anything else on the health side?' },
    { speaker: 'coordinator', text: 'Tell us about any allergy to pollen or animal feeds before your first day, so we can place you away from that section.' },
    { speaker: 'applicant', text: 'How large are the volunteer groups?' },
    { speaker: 'coordinator', text: 'Each working group has eight people, led by a farm hand who knows the crops, and there are usually two groups on site at once.' },
    { speaker: 'applicant', text: 'Do volunteers handle any machinery?' },
    { speaker: 'coordinator', text: 'No machinery is operated by volunteers. You use hand tools and ladders, and a member of staff checks the ladders before each use.' },
    { speaker: 'applicant', text: 'What happens if the weather turns heavy?' },
    { speaker: 'coordinator', text: 'A wet day moves the group to the packing shed, where fruit is sorted and boxed instead of picked outside.' },
    { speaker: 'applicant', text: 'Is there a fee to join the scheme?' },
    { speaker: 'coordinator', text: 'There is a small donation each season, but registered students take part for free, and the lunch and bunkhouse stay are included in that.' },
    { speaker: 'applicant', text: 'I’m a registered student, so that suits me. What about the meals while I am here?' },
    { speaker: 'coordinator', text: 'Volunteers get lunch included, and breakfast for those staying over, but the evening meal is arranged between yourselves.' },
    { speaker: 'coordinator', text: 'And do remember the closed boots with a good sole, since sandals are not safe on the muddy paths.' },
    { speaker: 'applicant', text: 'What should I bring on the first day?' },
    { speaker: 'coordinator', text: 'Bring a water bottle, a hat for the sun, and old clothes you do not mind getting dirty. Gloves are provided for the picking.' },
    { speaker: 'applicant', text: 'How do I sign up once I decide?' },
    { speaker: 'coordinator', text: 'Fill the online form by the Wednesday before your first Saturday, and we will confirm the lift and the working group by email.' },
    { speaker: 'applicant', text: 'One more question, can I bring a friend who has no experience?' },
    { speaker: 'coordinator', text: 'Beginners are welcome, as long as they read the safety note and book the place in advance.' },
    { speaker: 'applicant', text: 'Is there anything I should know about working near the animals?' },
    { speaker: 'coordinator', text: 'The chickens are kept in a separate yard, and volunteers do not enter that area unless a staff member leads them through.' },
    { speaker: 'applicant', text: 'Do we get any time to rest during the day?' },
    { speaker: 'coordinator', text: 'There are two short breaks, one mid-morning and one after lunch, when you can sit in the shade by the packing shed.' },
    { speaker: 'applicant', text: 'What happens to the fruit you pick?' },
    { speaker: 'coordinator', text: 'Most of it goes to the town market, and a small share is given to the community kitchen on the edge of town.' },
    { speaker: 'applicant', text: 'That sounds like a useful way to spend a weekend.' },
    { speaker: 'coordinator', text: 'It is. The work is steady rather than hard, and most volunteers come back several times.' },
    { speaker: 'applicant', text: 'Thanks, Eli. This all sounds clear.' },
    { speaker: 'coordinator', text: 'Fine. Keep the seven forty-five lift in mind, and bring the closed boots on the first Saturday.' },
  ],
  vocabulary: [
    {
      term: 'volunteering', phonetic: '/ˌvɒlənˈtɪərɪŋ/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '志愿活动（无偿参与的项目）', en: 'unpaid work joined as a scheme or project' },
      usage: { zh: '不可数；farm volunteering、volunteering scheme。名词 volunteer 指志愿者。', en: 'Uncountable: farm volunteering, volunteering scheme. A volunteer is the person.' },
      collocations: ['the volunteering scheme', 'farm volunteering', 'join volunteering'],
      example: { en: 'I’m calling about the farm volunteering scheme.', zh: '我来电咨询农场志愿项目。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈtɪə/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'picking', phonetic: '/ˈpɪkɪŋ/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '采摘（收获水果）', en: 'the act of gathering ripe fruit from trees or bushes' },
      usage: { zh: '不可数；fruit picking、picking season。动词 pick。', en: 'Uncountable: fruit picking, picking season. The verb is pick.' },
      collocations: ['fruit picking', 'picking apples', 'the picking season'],
      example: { en: 'The main task this season is fruit picking.', zh: '当季主要农活是摘水果。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /ɪŋ/。', en: 'Two syllables, stressed on the first, ending in /ɪŋ/.' },
    },
    {
      term: 'bunkhouse', phonetic: '/ˈbʌŋkhaʊs/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '集体宿舍（农场里多床位的住处）', en: 'a shared sleeping building with several beds on a farm' },
      usage: { zh: '可数名词；shared bunkhouse、farm bunkhouse。复合 bunk 加 house。', en: 'Countable: shared bunkhouse, farm bunkhouse. Compound bunk plus house.' },
      collocations: ['a shared bunkhouse', 'sleep in the bunkhouse', 'the farm bunkhouse'],
      example: { en: 'Overnight guests sleep in a shared bunkhouse.', zh: '过夜者住在集体宿舍。' },
      listening: { zh: '复合词两部分重读，house 结尾 /aʊs/。', en: 'Both parts are stressed; house ends /aʊs/.' },
    },
    {
      term: 'tetanus', phonetic: '/ˈtetənəs/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '破伤风（需接种疫苗预防）', en: 'a serious infection prevented by an injection' },
      usage: { zh: '不可数；tetanus injection、tetanus vaccine。', en: 'Uncountable: tetanus injection, tetanus vaccine.' },
      collocations: ['a tetanus injection', 'current tetanus protection', 'the tetanus vaccine'],
      example: { en: 'You need a current tetanus injection before the first day.', zh: '首日之前需有近期破伤风疫苗。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /nəs/。', en: 'Three syllables, stressed on the first, ending /nəs/.' },
    },
    {
      term: 'packing shed', phonetic: '/ˈpækɪŋ ʃed/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '包装棚（分拣装箱农产品的棚屋）', en: 'the shed where harvest is sorted and boxed' },
      usage: { zh: '可数；in the packing shed、packing shed sorting。', en: 'Countable: in the packing shed, packing shed sorting.' },
      collocations: ['the packing shed', 'sorting in the packing shed', 'the farm packing shed'],
      example: { en: 'On a wet day the group works in the packing shed.', zh: '雨天小组在包装棚干活。' },
      listening: { zh: 'packing 重音在前，shed 单音节 /ʃed/。', en: 'Stress packing first; shed is one syllable /ʃed/.' },
    },
    {
      term: 'donation', phonetic: '/dəʊˈneɪʃn/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '捐款，项目捐助', en: 'a small payment given to support the scheme' },
      usage: { zh: '可数；season donation、make a donation。动词 donate。', en: 'Countable: season donation, make a donation. The verb is donate.' },
      collocations: ['a small donation', 'the season donation', 'pay a donation'],
      example: { en: 'There is a small donation each season, but students join free.', zh: '每季有小额捐助，但学生免费参加。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈneɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'allergy', phonetic: '/ˈælədʒi/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '过敏（对花粉或饲料等）', en: 'a reaction to pollen, feeds or other substances' },
      usage: { zh: '可数；allergy to pollen、animal feed allergy。形容词 allergic。', en: 'Countable: allergy to pollen, animal feed allergy. The adjective is allergic.' },
      collocations: ['an allergy to pollen', 'a feed allergy', 'report an allergy'],
      example: { en: 'Tell us about any allergy to pollen before day one.', zh: '首日之前告知有无花粉过敏。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /dʒi/。', en: 'Three syllables, stressed on the first, ending /dʒi/.' },
    },
  ],
  expressions: [
    {
      phrase: 'lift from', sentenceIndex: 7,
      meaning: { zh: '从某处搭便车', en: 'a shared ride that departs from a place' },
      usage: { zh: '及物；arrange a lift from the square。名词 lift 此处指便车。', en: 'Transitive: arrange a lift from the square. Lift means a ride here.' },
      example: { en: 'The lift leaves from the market square at seven forty-five.', zh: '便车七点四十五从市场广场出发。' },
    },
    {
      phrase: 'hand tools', sentenceIndex: 17,
      meaning: { zh: '手工工具（非机械）', en: 'simple tools worked by hand rather than a machine' },
      usage: { zh: '复数；use hand tools、hand tools and ladders。', en: 'Plural: use hand tools, hand tools and ladders.' },
      example: { en: 'Volunteers use hand tools and checked ladders.', zh: '志愿者使用手工工具和检查过的梯子。' },
    },
    {
      phrase: 'get lunch included', sentenceIndex: 23,
      meaning: { zh: '午餐包含在内', en: 'have the meal provided as part of the scheme' },
      usage: { zh: 'include 的被动；lunch included、stay included。', en: 'Passive of include: lunch included, stay included.' },
      example: { en: 'Volunteers get lunch included during the project.', zh: '项目期间志愿者午餐包含在内。' },
    },
    {
      phrase: 'sign up', sentenceIndex: 27,
      meaning: { zh: '报名参加', en: 'to register for a place on the scheme' },
      usage: { zh: '可分开；sign up for the scheme、sign up online。名词 sign-up。', en: 'Separable: sign up for the scheme, sign up online. The noun is sign-up.' },
      example: { en: 'Fill the online form to sign up before the Saturday.', zh: '周六之前填线上表报名。' },
    },
    {
      phrase: 'book the place in advance', sentenceIndex: 30,
      meaning: { zh: '提前预留名额', en: 'reserve a spot before the volunteer day' },
      usage: { zh: '及物；book the place in advance、book in advance。', en: 'Transitive: book the place in advance, book in advance.' },
      example: { en: 'Beginners must book the place in advance.', zh: '初学者须提前预留名额。' },
    },
    {
      phrase: 'come back', sentenceIndex: 38,
      meaning: { zh: '再来，重复参加', en: 'to return to the scheme on later visits' },
      usage: { zh: '不及物；come back several times、come back next season。', en: 'Intransitive: come back several times, come back next season.' },
      example: { en: 'Most volunteers come back several times in the year.', zh: '多数志愿者一年里会来好几次。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记题先记类别再记答案', en: 'Note the category before the answer' },
      body: {
        zh: '第 1–5 题分别是星期、农活、上车地点、住处、健康项。听到 day、week 记星期，task、work 记农活，lift、leave 记地点，sleep、stay 记住处，injection、boots 分健康与穿着两类，避免把靴子填进健康空。',
        en: 'Items 1–5 are a day, a task, a pickup place, lodging and a health item. Record a day after day or week, a task after task or work, a place after lift or leave, lodging after sleep or stay, and split injection from boots into health versus clothing.',
      },
    },
    {
      title: { zh: '义务与提供项对照记', en: 'Split required items from supplied items' },
      body: {
        zh: '对话常区分哪些由项目提供、哪些志愿者自备：午餐与住宿包含在内，手套现场提供；封脚靴必须自穿，水帽和旧衣要带来。听到 provide、include 记提供项，记得 bring、must wear 记自备项。',
        en: 'The dialogue separates supplied items from volunteer items: lunch and stay are included, gloves are supplied; closed boots must be worn, and a bottle, hat and old clothes are brought. Mark provide or include as supplied, bring or must wear as self-provided.',
      },
    },
    {
      title: { zh: '雨天与设备题抓否定句', en: 'Catch negatives for equipment and weather' },
      body: {
        zh: '第 6 题问设备，句 17 开头 No machinery is operated 直接排除机械；第 7 题问雨天去向，句 19 的 packing shed 是唯一室内安排。听到 no、not、instead of 时在选项旁标注被否定的内容。',
        en: 'Item 6 asks about equipment, and sentence 17 opens No machinery is operated, ruling out machines. Item 7 asks the wet-day room, and the packing shed in sentence 19 is the only indoor option. Mark ruled-out content beside no, not or instead of.',
      },
    },
  ],
};
