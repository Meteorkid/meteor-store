import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 41 · Part 2 — 屋顶花园场地介绍（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白顺序：设计理念 → 排水层与轻质土壤 → 植物选择 → 开放时间 → 志愿者招募（填空块在前半段），
 * 后半段复述设计初衷、轻质土壤原因、闭园时间与志愿者回报（单选块）。
 * 题块顺序与录音顺序一致。开场用现场入场提醒，不用 welcome to。
 */
export const test41Part2: ListeningLesson = {
  slug: 'test-41-part-2',
  part: 2,
  status: 'published',
  title: { zh: '屋顶花园介绍', en: 'Introducing a rooftop garden' },
  summary: {
    zh: '花园负责人沿屋顶步道做现场介绍：花园建在旧社区中心楼顶，初衷是给居民一处安静绿地；讲解床下的砾石排水层、配了珍珠岩的轻质土壤、耐风耐旱的植物选择、每日开放到黄昏的时间，以及志愿者浇水除草和在公告板报名的方式；后半段复述设计初衷、轻质土壤原因、闭园时段与志愿者能分到的产出。',
    en: 'The guide briefs visitors on a rooftop garden above the old community centre: a shared green space, its gravel drainage layer and light perlite soil, wind and drought tolerant plants, daily opening until dusk, and volunteers who water and weed and sign on the noticeboard; the recap covers the design idea, why the soil stays light, closing time and volunteer rewards.',
  },
  accent: { zh: '讲解员为南非口音，语速平稳，工程细节处会放慢重复。', en: 'The guide speaks with a South African accent at a steady pace, slowing down for the engineering details.' },
  speechRate: '+8%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Drainage layer under the soil is made of', cells: [[{ blank: 11 }]] },
        { lead: 'The light soil mix contains compost and', cells: [[{ blank: 12 }]] },
        { lead: 'Plants must tolerate strong', cells: [[{ blank: 13 }, { text: ' and full sun.' }]] },
        { lead: 'Garden opens each morning at', cells: [[{ blank: 14 }]] },
        { lead: 'Volunteers help with watering and', cells: [[{ blank: 15 }]] },
        { lead: 'Volunteers sign up on the garden', cells: [[{ blank: 16 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'What was the main design idea?',
          options: [
            { key: 'A', text: 'A plot for growing market vegetables.' },
            { key: 'B', text: 'A green space shared by residents.' },
            { key: 'C', text: 'A commercial café garden on the roof.' },
          ],
        },
        {
          number: 18,
          stem: 'Why does the soil have to stay light?',
          options: [
            { key: 'A', text: 'To reduce weight on the roof structure.' },
            { key: 'B', text: 'To cut down how often the beds are watered.' },
            { key: 'C', text: 'To keep the materials cheap to buy.' },
          ],
        },
        {
          number: 19,
          stem: 'When is the garden closed to visitors?',
          options: [
            { key: 'A', text: 'On weekday mornings.' },
            { key: 'B', text: 'On Sunday afternoons.' },
            { key: 'C', text: 'After dark each evening.' },
          ],
        },
        {
          number: 20,
          stem: 'What do regular volunteers receive?',
          options: [
            { key: 'A', text: 'A paid weekly wage.' },
            { key: 'B', text: 'A small share of the produce.' },
            { key: 'C', text: 'Tools to keep for their own garden.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['gravel'], evidence: 7,
      explanation: {
        zh: '定位句 7：Under the soil, a drainage layer of gravel catches rainwater and keeps it from pooling。排水层由砾石构成，填 gravel。句 8 的 drains 是边缘排水口，不是排水层材料。',
        en: 'Sentence 7: "Under the soil, a drainage layer of gravel catches rainwater and keeps it from pooling". The drainage layer is gravel, so write gravel. The drains in sentence 8 are edge outlets, not the layer material.',
      },
    },
    {
      number: 12, accepted: ['perlite'], evidence: 10,
      explanation: {
        zh: '定位句 10：We chose compost and perlite for that mix, rather than ordinary heavy garden soil。轻质土壤配了堆肥与珍珠岩；compost 已在卷面上，填 perlite。',
        en: 'Sentence 10: "We chose compost and perlite for that mix, rather than ordinary heavy garden soil". The mix uses compost and perlite; compost is printed, so write perlite.',
      },
    },
    {
      number: 13, accepted: ['wind'], evidence: 12,
      explanation: {
        zh: '定位句 12：The plants had to survive strong wind and full sun on this exposed roof。植物须耐强风与全日照，空后已印 and full sun，填 wind。句 13 的 dry spells 是耐旱要求，不是本题并列项。',
        en: 'Sentence 12: "The plants had to survive strong wind and full sun on this exposed roof". Plants tolerate wind and full sun; and full sun is printed, so write wind. Dry spells in sentence 13 are the drought point, not this pair.',
      },
    },
    {
      number: 14, accepted: ['seven', '7'], evidence: 17,
      explanation: {
        zh: '定位句 17：The garden opens each morning at seven, and closes again at dusk。早上七点开放，填 seven。句 17 的 dusk 是闭园时间，与本题开园时间不同。',
        en: 'Sentence 17: "The garden opens each morning at seven, and closes again at dusk". Opening time is seven, so write seven. Dusk in the same sentence is the closing time, not the opening one.',
      },
    },
    {
      number: 15, accepted: ['weeding'], evidence: 22,
      explanation: {
        zh: '定位句 22：Volunteers help with watering in the mornings and weeding around the beds each week。志愿者负责浇水与除草，填 weeding。句 23 的 showing new helpers 是团队带新，不是志愿者任务。',
        en: 'Sentence 22: "Volunteers help with watering in the mornings and weeding around the beds each week". Volunteers water and weed, so write weeding. Showing new helpers in sentence 23 is team induction, not a volunteer task.',
      },
    },
    {
      number: 16, accepted: ['noticeboard'], evidence: 24,
      explanation: {
        zh: '定位句 24：To join, residents leave their name on the garden noticeboard beside the door。报名处是花园公告板，填 noticeboard。句 25 的 tools 是现场提供物，不是报名地点。',
        en: 'Sentence 24: "To join, residents leave their name on the garden noticeboard beside the door". Sign-up uses the garden noticeboard, so write noticeboard. Tools in sentence 25 are provided on site, not the sign-up spot.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：The idea was a green space shared by residents above the noisy street, not a market vegetable plot。设计初衷是居民共享的绿地，对应 B。A 的市场菜地与句中 not 相反，C 的商业咖啡馆在句 4 被否定。',
        en: 'Sentence 28: "The idea was a green space shared by residents above the noisy street, not a market vegetable plot". A shared resident green space matches B. Market vegetables contradict not, and the café was ruled out in sentence 4.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：The mix keeps total weight down, so the original roof structure is not overloaded。轻质土壤是为减轻屋顶承重，对应 A。B 的减少浇水频次与 C 的省钱是句 31 明确提到的次要原因，不是设计动因。',
        en: 'Sentence 30: "The mix keeps total weight down, so the original roof structure is not overloaded". Light soil protects the roof structure, matching A. Less watering and lower cost are secondary reasons in sentence 31, not the driver.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 33,
      explanation: {
        zh: '定位句 33：It closes after dark each evening, while weekday mornings and Sunday afternoons remain open。闭园时间是天黑以后，对应 C。A 的工作日上午与 B 的周日下午在同句被说成仍然开放。',
        en: 'Sentence 33: "It closes after dark each evening, while weekday mornings and Sunday afternoons remain open". It closes after dark, matching C. Weekday mornings and Sunday afternoons are both said to stay open.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：Helpers take home a small share of the herbs and fruit they help to grow。志愿者能分到一小份产出，对应 B。A 的有偿工资与句 36 的 no paid wage 相反，C 的工具带走与 borrow tools on site 相反。',
        en: 'Sentence 35: "Helpers take home a small share of the herbs and fruit they help to grow". Volunteers take a small share of produce, matching B. A paid wage contradicts no paid wage, and keeping tools contradicts borrowing them on site.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'If you have just come up the stairs, stay close to the railing until you have your bearings.' },
    { speaker: 'guide', text: 'I am Leah, and I will walk you around the rooftop garden before the volunteers arrive.' },
    { speaker: 'guide', text: 'This space sits on top of the old community centre, two floors above the street.' },
    { speaker: 'guide', text: 'The design idea was simple, to give residents a quiet green space above the busy road.' },
    { speaker: 'guide', text: 'We did not plan a commercial café here, and the beds are not meant for market vegetables.' },
    { speaker: 'guide', text: 'Before you look at the plants, the roof itself needs a few engineering details explained.' },
    { speaker: 'guide', text: 'Every bed sits on a raised frame, so no soil touches the original roof surface.' },
    { speaker: 'guide', text: 'Under the soil, a drainage layer of gravel catches rainwater and keeps it from pooling.' },
    { speaker: 'guide', text: 'The gravel slopes gently toward the drains at the edge of the roof.' },
    { speaker: 'guide', text: 'Above the gravel, the soil is mixed with a lightweight material so the roof carries less weight.' },
    { speaker: 'guide', text: 'We chose compost and perlite for that mix, rather than ordinary heavy garden soil.' },
    { speaker: 'guide', text: 'Good drainage matters more than richness here, because wet soil adds a great deal of weight.' },
    { speaker: 'guide', text: 'The plants had to survive strong wind and full sun on this exposed roof.' },
    { speaker: 'guide', text: 'We chose perennial species with deep roots and narrow leaves, so they can tolerate dry spells.' },
    { speaker: 'guide', text: 'Tall shrubs are kept near the parapet, where they also act as a wind break.' },
    { speaker: 'guide', text: 'Flowers are mixed in among the herbs, and the bees are welcome visitors here.' },
    { speaker: 'guide', text: 'Now for the times the garden opens to residents through the season.' },
    { speaker: 'guide', text: 'The garden opens each morning at seven, and closes again at dusk.' },
    { speaker: 'guide', text: 'It stays open all week, including Sundays, though the tools are locked away after dark.' },
    { speaker: 'guide', text: 'On very hot afternoons the beds are left alone so the plants can rest.' },
    { speaker: 'guide', text: 'If rain is heavy, the stairs may close for a short safety check.' },
    { speaker: 'guide', text: 'The last thing I want to cover today is our volunteer group.' },
    { speaker: 'guide', text: 'Volunteers help with watering in the mornings and weeding around the beds each week.' },
    { speaker: 'guide', text: 'No experience is required, and a member of the team shows new helpers the routines.' },
    { speaker: 'guide', text: 'To join, residents leave their name on the garden noticeboard beside the door.' },
    { speaker: 'guide', text: 'You do not pay a fee, and tools are provided on site rather than taken home.' },
    { speaker: 'guide', text: 'Now a few points people often ask before they visit.' },
    { speaker: 'guide', text: 'What was the main idea behind this rooftop garden?' },
    { speaker: 'guide', text: 'The idea was a green space shared by residents above the noisy street, not a market vegetable plot.' },
    { speaker: 'guide', text: 'Why does the soil have to stay light on the roof?' },
    { speaker: 'guide', text: 'The mix keeps total weight down, so the original roof structure is not overloaded.' },
    { speaker: 'guide', text: 'Watering less often and saving money were secondary reasons, not the design driver.' },
    { speaker: 'guide', text: 'When is the garden closed to visitors?' },
    { speaker: 'guide', text: 'It closes after dark each evening, while weekday mornings and Sunday afternoons remain open.' },
    { speaker: 'guide', text: 'What do regular volunteers receive for their time?' },
    { speaker: 'guide', text: 'Helpers take home a small share of the produce, the herbs and fruit they help to grow.' },
    { speaker: 'guide', text: 'There is no paid wage, and volunteers borrow tools on site without keeping them.' },
    { speaker: 'guide', text: 'The team also runs an open day once a month for neighbours who are curious.' },
    { speaker: 'guide', text: 'Children are welcome if an adult stays with them on the paved paths.' },
    { speaker: 'guide', text: 'Please do not step into the beds, even to pick a fallen flower.' },
    { speaker: 'guide', text: 'Waste water from the watering cans returns to the garden beds, not onto the stairs.' },
    { speaker: 'guide', text: 'If you notice a loose tile or a leak, tell the garden team before it grows worse.' },
    { speaker: 'guide', text: 'That is the tour for today, and you may walk the paths once the volunteer briefing ends.' },
  ],
  vocabulary: [
    {
      term: 'drainage', phonetic: '/ˈdreɪnɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '排水（把多余水分导离种植层）', en: 'the system that removes excess water from the soil' },
      usage: { zh: '不可数；a drainage layer、good drainage。动词是 drain。', en: 'Uncountable: a drainage layer, good drainage. The verb is drain.' },
      collocations: ['a drainage layer', 'good drainage', 'the drainage system'],
      example: { en: 'The gravel forms a drainage layer under the soil.', zh: '砾石在土壤下方形成排水层。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈdreɪ/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'perlite', phonetic: '/ˈpɜːlaɪt/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '珍珠岩（轻质透气的土壤改良材料）', en: 'a lightweight porous material mixed into soil to keep it light' },
      usage: { zh: '不可数；compost and perlite、perlite in the mix。', en: 'Uncountable: compost and perlite.' },
      collocations: ['compost and perlite', 'perlite in the mix', 'lightweight perlite'],
      example: { en: 'The soil mix uses compost and perlite to stay light on the roof.', zh: '土壤配堆肥和珍珠岩，在屋顶上保持轻质。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpɜː/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'parapet', phonetic: '/ˈpærəpət/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '女儿墙，屋顶边缘护栏墙', en: 'the low wall along the edge of a roof' },
      usage: { zh: '可数；near the parapet、the roof parapet。', en: 'Countable: near the parapet, the roof parapet.' },
      collocations: ['near the parapet', 'the roof parapet', 'along the parapet'],
      example: { en: 'Tall shrubs are kept near the parapet as a wind break.', zh: '高灌木沿女儿墙种植以挡风。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpær/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'perennial', phonetic: '/pəˈreniəl/', partOfSpeech: 'adj.', sentenceIndex: 13,
      meaning: { zh: '多年生的（植物每年自行返青）', en: 'living for several years and growing back each season' },
      usage: { zh: '形容词；perennial species、perennial herbs。对比 annual 一年生。', en: 'Adjective: perennial species. Contrast annual.' },
      collocations: ['perennial species', 'perennial herbs', 'a perennial plant'],
      example: { en: 'Deep rooted perennial species suit the exposed roof.', zh: '深根多年生植物适合外露屋顶。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈren/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'wind break', phonetic: '/ˈwɪnd breɪk/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '防风林，挡风屏障', en: 'a row of shrubs that slows the wind across the roof' },
      usage: { zh: '可数；act as a wind break、a tall wind break。', en: 'Countable: act as a wind break.' },
      collocations: ['a wind break', 'act as a wind break', 'the shrub wind break'],
      example: { en: 'The shrubs along the edge act as a wind break.', zh: '边缘灌木起到防风屏障的作用。' },
      listening: { zh: '复合词，重音在第一词 wind；break 读 /breɪk/。', en: 'Compound with stress on wind; break is /breɪk/.' },
    },
    {
      term: 'produce', phonetic: '/ˈprɒdjuːs/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '农产品，收获的蔬果', en: 'the herbs and fruit grown and harvested on site' },
      usage: { zh: '不可数；a share of the produce。注意名词重音在第一音节，动词 produce 重音在后。', en: 'Uncountable: a share of the produce. Noun stress differs from the verb.' },
      collocations: ['the garden produce', 'a share of the produce', 'fresh produce'],
      example: { en: 'Volunteers take a small share of the produce home.', zh: '志愿者可以分一小份产出带回家。' },
      listening: { zh: '名词重音在第一音节 /ˈprɒ/，结尾 /s/ 读出来。', en: 'Noun stress on the first syllable; the ending is /s/.' },
    },
  ],
  expressions: [
    {
      phrase: 'have your bearings', sentenceIndex: 0,
      meaning: { zh: '弄清方向，找到自己所处位置', en: 'to know where you are and which way to move' },
      usage: { zh: 'find your bearings、get your bearings；导航场景高频。', en: 'Find or get your bearings; common when navigating a place.' },
      example: { en: 'Stay by the railing until you have your bearings.', zh: '先靠栏杆站着，等辨清方向再走。' },
    },
    {
      phrase: 'touches the original roof surface', sentenceIndex: 6,
      meaning: { zh: '接触原有屋顶表面', en: 'to make contact with the original roof material' },
      usage: { zh: 'touch + 名词；工程布置说明常用，原文为第三人称 touches。', en: 'Touch plus a noun; common in layout explanations. The transcript uses the third person touches.' },
      example: { en: 'No soil touches the original roof surface under the beds.', zh: '床下没有土壤接触原有屋顶表面。' },
    },
    {
      phrase: 'tolerate dry spells', sentenceIndex: 13,
      meaning: { zh: '扛过一段干旱期', en: 'to survive a period without regular rain' },
      usage: { zh: 'tolerate + 名词；植物选择高频搭配。', en: 'Tolerate plus a noun; common when choosing plants.' },
      example: { en: 'The narrow leaved species tolerate dry spells well.', zh: '窄叶物种很能扛干旱期。' },
    },
    {
      phrase: 'leave their name', sentenceIndex: 24,
      meaning: { zh: '留下姓名报名，登记参加（志愿工作）', en: 'to add your name to the volunteer list' },
      usage: { zh: '报名时在公告板上留名；leave one’s name on the noticeboard。', en: 'Leave one’s name on the noticeboard to join the group.' },
      example: { en: 'Residents sign up on the garden noticeboard beside the door.', zh: '居民在门边的花园公告板上报名。' },
    },
    {
      phrase: 'on site', sentenceIndex: 25,
      meaning: { zh: '在现场（园内提供）', en: 'provided within the garden rather than brought from home' },
      usage: { zh: '地点状语；tools are provided on site。', en: 'Adverbial: tools are provided on site.' },
      example: { en: 'Tools are provided on site rather than taken home.', zh: '工具现场提供，不带回家。' },
    },
    {
      phrase: 'take home', sentenceIndex: 35,
      meaning: { zh: '带回家（收获或物品）', en: 'to carry the harvested produce back home' },
      usage: { zh: '可分短语；take home a share of the herbs。', en: 'Separable: take home a share of the herbs.' },
      example: { en: 'Helpers take home a small share of the herbs and fruit.', zh: '帮手们分一小份香草和果实带回家。' },
    },
  ],
  tips: [
    {
      title: { zh: '先看卷面并列词，锁定答案词性', en: 'Use printed conjunctions to predict the gap' },
      body: {
        zh: '第 12 题空格前是 compost and，第 13 题空后是 and full sun，答案分别是并列的材料名与环境词。听前在空格旁标出并列结构，录音里只等 and 前后那一对词，避免把解释句里的 dry spells、weight 填进去。',
        en: 'Item 12 follows compost and and item 13 precedes and full sun, so the answers are a paired material and environment word. Mark the pair structure beside each gap, and wait for the word on either side of and rather than a nearby explanation such as dry spells or weight.',
      },
    },
    {
      title: { zh: '单选区分主因与次要原因', en: 'Separate main reason from secondary reasons' },
      body: {
        zh: '第 18 题问轻质土壤的原因，录音明确说减重是设计动因，减少浇水与省钱是次要原因。听到 secondary reasons、not the driver 这类降级信号时，把对应选项标为干扰；答案取被说成 design driver 的那一项。',
        en: 'Item 18 asks why the soil stays light; the recording calls weight reduction the driver and names less watering and saving money as secondary reasons. On a downgrade signal such as secondary reasons or not the driver, mark those options as distractors and choose the design driver.',
      },
    },
    {
      title: { zh: '时间题抓开放与闭园两个时刻', en: 'Note both opening and closing times' },
      body: {
        zh: '第 14 题问开放时刻，第 19 题问闭园时段，两句常挨在一起。听到 seven、dusk、after dark 时分别记下是开门还是关门；干扰项把工作日上午、周日下午这些仍开放的时段说成闭园，落笔前核对 remain open 还是 closes。',
        en: 'Item 14 asks the opening time and item 19 the closing period, often in nearby sentences. Record whether seven, dusk and after dark mean open or closed; distractors turn weekday mornings and Sunday afternoons into closures, so check remain open against closes before writing.',
      },
    },
  ],
};
