import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 16 · Part 2 — 社区果园说明（单人独白，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：地块由来 → 种植计划 → 志愿轮值 → 采摘规则 → 开放日 → 五方反馈（配对 16–20）→ 配套安排。
 */
export const test16Part2: ListeningLesson = {
  slug: 'test-16-part-2',
  part: 2,
  status: 'published',
  title: { zh: '社区果园说明', en: 'A talk on a community orchard' },
  summary: {
    zh: '组织者介绍社区果园的地块由来、首批苹果樱桃树种、志愿轮值安排、成熟采摘规则与十月开放日，并说明学校、新志愿者、居民、种植协会和园林团队各自的诉求与分工。',
    en: 'The coordinator explains the orchard’s land history, the first apple and cherry trees, volunteer shifts, ripe-only picking rules and the October open day, plus the roles and requests of the school, new volunteers, residents, growers’ association and parks team.',
  },
  accent: { zh: '发言人为加拿大口音，语速中等。', en: 'The speaker has a Canadian accent and speaks at a moderate pace.' },
  speechRate: '+5%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-CA-ClaraNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'The land was once a disused', cells: [[{ blank: 11 }]] },
        { lead: 'First planting: apple and', cells: [[{ blank: 12 }, { text: ' trees' }]] },
        { lead: 'Volunteers work a four-hour', cells: [[{ blank: 13 }, { text: ' each month' }]] },
        { lead: 'Pick only fruit that is', cells: [[{ blank: 14 }]] },
        { lead: 'Open day held in', cells: [[{ blank: 15 }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which role does each group take? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'helps test the soil and lend tools' },
        { key: 'B', text: 'worries birds will strip the fruit' },
        { key: 'C', text: 'asks for a lesson on pruning the trees' },
        { key: 'D', text: 'requests a fence to keep dogs out' },
        { key: 'E', text: 'runs a stall at the open day' },
        { key: 'F', text: 'checks drainage and advises on tree varieties' },
      ],
      items: [
        { number: 16, text: 'the local school' },
        { number: 17, text: 'the new volunteers' },
        { number: 18, text: 'neighbouring residents' },
        { number: 19, text: 'the fruit growers’ association' },
        { number: 20, text: 'the council parks team' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['allotment'], evidence: 2,
      explanation: {
        zh: '定位句 2：It was once a disused allotment, where neighbours grew vegetables。地块前身是菜圃，填 allotment；句 3 的 shared orchard 是改造后的用途。',
        en: 'Sentence 2: the land "was once a disused allotment", so fill allotment. The shared orchard in sentence 3 is the new use.',
      },
    },
    {
      number: 12, accepted: ['cherry'], evidence: 4,
      explanation: {
        zh: '定位句 4：We are putting in apple and cherry trees, with a few pear trees along the fence line。首批果树填 cherry；梨树是围栏边的补充，不是题目所问。',
        en: 'Sentence 4: "apple and cherry trees" with pear trees along the fence, so fill cherry. The pears are an extra row.',
      },
    },
    {
      number: 13, accepted: ['shift'], evidence: 6,
      explanation: {
        zh: '定位句 6：The basic commitment is a four-hour shift each month。志愿轮值单位是 shift，填 shift；句 7 的 Saturday morning 是常见时间，不是轮值名称。',
        en: 'Sentence 6: "a four-hour shift each month", so fill shift. Saturday morning in sentence 7 is the usual time, not the term itself.',
      },
    },
    {
      number: 14, accepted: ['ripe'], evidence: 10,
      explanation: {
        zh: '定位句 10：Visitors must pick only fruit that is ripe。只能摘成熟果实，填 ripe；句 10 的 green or hard fruit 是要留下的部分。',
        en: 'Sentence 10: "pick only fruit that is ripe", so fill ripe. Green or hard fruit is left for later.',
      },
    },
    {
      number: 15, accepted: ['October'], evidence: 13,
      explanation: {
        zh: '定位句 13：The first open day will be held in October。开放日在十月，填 October；句 4 的 next spring 是种树时间，不是开放日。',
        en: 'Sentence 13: "The first open day will be held in October", so fill October. Next spring in sentence 4 is planting time.',
      },
    },
    {
      number: 16, accepted: ['E'], evidence: 16,
      explanation: {
        zh: '定位句 16：The children will help run the stall at the open day。学校负责开放日摊位，对应 E。',
        en: 'Sentence 16: the children "help run the stall at the open day", matching E.',
      },
    },
    {
      number: 17, accepted: ['C'], evidence: 17,
      explanation: {
        zh: '定位句 17：They would welcome a short lesson on pruning the trees。新志愿者想学修剪，对应 C。',
        en: 'Sentence 17: they "would welcome a short lesson on pruning the trees", matching C.',
      },
    },
    {
      number: 18, accepted: ['D'], evidence: 18,
      explanation: {
        zh: '定位句 18：some have asked for a fence to keep dogs out of the planted rows。居民要求设围栏挡狗，对应 D。',
        en: 'Sentence 18: residents "asked for a fence to keep dogs out", matching D.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：Their members will test the soil and lend the group tools for the first year。协会负责测土并出借工具，对应 A。',
        en: 'Sentence 19: association members "test the soil and lend the group tools", matching A.',
      },
    },
    {
      number: 20, accepted: ['F'], evidence: 20,
      explanation: {
        zh: '定位句 20：The council parks team will check the drainage around the trees, and advise on which varieties suit this part of the country。园林团队查排水并建议品种，对应 F。句 21 担心鸟啄果实是另一位居民的意见，不是团队分工。',
        en: 'Sentence 20: the parks team "check the drainage" and advise on varieties, matching F. The bird worry in sentence 21 is a separate resident’s comment.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Before we begin the planting, I’ll show you where the paths will run through the new orchard.' },
    { speaker: 'coordinator', text: 'My name is Clara, and I help coordinate the volunteer groups.' },
    { speaker: 'coordinator', text: 'This piece of land has stood empty for years. It was once a disused allotment, where neighbours grew vegetables before the soil was left to rest.' },
    { speaker: 'coordinator', text: 'The council agreed to turn it into a shared orchard, open to anyone in the neighbourhood.' },
    { speaker: 'coordinator', text: 'The first planting will happen next spring. We are putting in apple and cherry trees, with a few pear trees along the fence line.' },
    { speaker: 'coordinator', text: 'Each tree has a wooden label with its variety and the year it was planted.' },
    { speaker: 'coordinator', text: 'Volunteers are the heart of the project. The basic commitment is a four-hour shift each month, usually on a Saturday morning.' },
    { speaker: 'coordinator', text: 'During a shift, people prune young branches, clear weeds around the roots and check the tree stakes.' },
    { speaker: 'coordinator', text: 'Training is given on the first visit, so no prior gardening experience is needed.' },
    { speaker: 'coordinator', text: 'Once the trees fruit, we follow simple picking rules.' },
    { speaker: 'coordinator', text: 'Visitors must pick only fruit that is ripe, and leave any green or hard fruit for later.' },
    { speaker: 'coordinator', text: 'No one should climb the mature trees; fruit within reach is taken from the ground or a low step.' },
    { speaker: 'coordinator', text: 'All harvested fruit is shared between volunteers and nearby residents, with any surplus sold at the open day.' },
    { speaker: 'coordinator', text: 'The first open day will be held in October, after the autumn harvest.' },
    { speaker: 'coordinator', text: 'There will be samples of the fruit, talks about the trees, and a stall run by the local school.' },
    { speaker: 'coordinator', text: 'Before that, we have met several groups who will take part, and their comments were mixed.' },
    { speaker: 'coordinator', text: 'First, the local school. The children will help run the stall at the open day, selling small bags of fruit.' },
    { speaker: 'coordinator', text: 'The new volunteers asked one question again and again. They would welcome a short lesson on pruning the trees before the spring planting.' },
    { speaker: 'coordinator', text: 'Neighbouring residents are mostly pleased, but some have asked for a fence to keep dogs out of the planted rows.' },
    { speaker: 'coordinator', text: 'The fruit growers’ association has offered practical help. Their members will test the soil and lend the group tools for the first year.' },
    { speaker: 'coordinator', text: 'The council parks team will check the drainage around the trees, and advise on which varieties suit this part of the country.' },
    { speaker: 'coordinator', text: 'One long-standing resident worries that birds will strip the fruit before it is ready. We are putting up netting over the smaller trees.' },
    { speaker: 'coordinator', text: 'We have also planned water storage for dry weeks, using the barrel beside the gate.' },
    { speaker: 'coordinator', text: 'Paths will be kept wide enough for pushchairs and wheelchairs.' },
    { speaker: 'coordinator', text: 'A bench will be placed under the largest tree, so people can rest and watch the orchard grow.' },
    { speaker: 'coordinator', text: 'Volunteers who cannot attend a shift can swap with someone else on the group message list.' },
    { speaker: 'coordinator', text: 'Tool storage is a locked shed at the field entrance, with gloves and spades inside.' },
    { speaker: 'coordinator', text: 'Any damage to the fence should be reported to the coordinator before it gets worse.' },
    { speaker: 'coordinator', text: 'In future years, we may add a small wildflower meadow at the far end.' },
    { speaker: 'coordinator', text: 'The map on the table shows the tree positions and the proposed paths.' },
    { speaker: 'coordinator', text: 'Questions are welcome after I walk through the seasonal calendar.' },
    { speaker: 'coordinator', text: 'Each spring, the group will prune the young trees before the buds open.' },
    { speaker: 'coordinator', text: 'Members share recipes using the orchard fruit at the autumn gathering.' },
    { speaker: 'coordinator', text: 'A notice board near the gate lists the current volunteer shifts.' },
    { speaker: 'coordinator', text: 'Children from the school help measure the growth of each tree.' },
    { speaker: 'coordinator', text: 'We hope the orchard becomes a quiet place for the whole neighbourhood.' },
    { speaker: 'coordinator', text: 'A volunteer coordinator answers questions at the gate each Saturday.' },
    { speaker: 'coordinator', text: 'Fruit that falls on the ground is left for the compost.' },
    { speaker: 'coordinator', text: 'The group writes short notes about each tree’s progress.' },
    { speaker: 'coordinator', text: 'Visitors should stay on the marked paths among the rows.' },
  ],
  vocabulary: [
    {
      term: 'allotment', phonetic: '/əˈlɒtmənt/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '（社区）菜圃，小块出租菜地', en: 'a small plot of land rented for growing vegetables' },
      usage: { zh: '可数；a disused allotment、work on the allotment。英式用法常见。', en: 'Countable: a disused allotment, work on the allotment; common in British usage.' },
      collocations: ['a community allotment', 'the allotment plot', 'dig the allotment'],
      example: { en: 'The allotment next door grows tomatoes and beans.', zh: '隔壁菜圃种番茄和豆子。' },
      listening: { zh: '重音在第二音节 /ˈlɒt/。', en: 'Stress the second syllable /ˈlɒt/.' },
    },
    {
      term: 'orchard', phonetic: '/ˈɔːtʃəd/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '果园', en: 'a plot of land planted with fruit trees' },
      usage: { zh: '可数；a community orchard、an apple orchard。', en: 'Countable: a community orchard, an apple orchard.' },
      collocations: ['the community orchard', 'the orchard trees', 'plant an orchard'],
      example: { en: 'The orchard opens to all neighbours in summer.', zh: '果园夏天对所有邻居开放。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /əd/ 轻读。', en: 'Two syllables with stress on the first; the ending /əd/ is soft.' },
    },
    {
      term: 'shift', phonetic: '/ʃɪft/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '轮值班次，志愿时段', en: 'a set period of duty for volunteers or staff' },
      usage: { zh: '可数；a four-hour shift、work a shift、swap a shift。', en: 'Countable: a four-hour shift, work a shift, swap a shift.' },
      collocations: ['a monthly shift', 'the volunteer shift', 'swap shifts'],
      example: { en: 'Each volunteer completes one shift a month.', zh: '每位志愿者每月完成一次轮值。' },
      listening: { zh: '单音节，与 gift 同尾韵。', en: 'One syllable, rhyming with gift.' },
    },
    {
      term: 'prune', phonetic: '/pruːn/', partOfSpeech: 'v.', sentenceIndex: 7,
      meaning: { zh: '修剪（树枝）', en: 'to cut back branches to help a tree grow' },
      usage: { zh: '及物；prune young branches、prune the fruit trees。名词 pruning。', en: 'Transitive: prune young branches; the noun is pruning.' },
      collocations: ['prune the branches', 'prune in spring', 'prune back'],
      example: { en: 'We prune the young trees before winter.', zh: '我们入冬前修剪幼树。' },
      listening: { zh: '单音节，长音 /uː/，与 moon 同韵。', en: 'One syllable with a long /uː/, rhyming with moon.' },
    },
    {
      term: 'harvest', phonetic: '/ˈhɑːvɪst/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '收获，采收季', en: 'the gathering of ripe fruit or crops' },
      usage: { zh: '可数/不可数；the autumn harvest、the harvest time。', en: 'Countable or uncountable: the autumn harvest, harvest time.' },
      collocations: ['the autumn harvest', 'the harvest season', 'the first harvest'],
      example: { en: 'The open day follows the apple harvest.', zh: '开放日在苹果采收之后。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈhɑː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'surplus', phonetic: '/ˈsɜːpləs/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '剩余，多余部分', en: 'the amount left after everyone has been given a share' },
      usage: { zh: '可数/不可数；any surplus、sell the surplus。', en: 'Countable or uncountable: any surplus, sell the surplus.' },
      collocations: ['the fruit surplus', 'sell the surplus', 'a surplus of apples'],
      example: { en: 'Surplus fruit is bagged for the stall.', zh: '剩余水果装袋放到摊位上。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɜː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'drainage', phonetic: '/ˈdreɪnɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '排水，排水设施', en: 'the system that carries water away from the soil' },
      usage: { zh: '不可数；check the drainage、poor drainage。动词 drain。', en: 'Uncountable: check the drainage, poor drainage; the verb is drain.' },
      collocations: ['the soil drainage', 'good drainage', 'the drainage ditches'],
      example: { en: 'The trees need drainage that keeps roots dry.', zh: '树木需要保持根部干燥的排水条件。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈdreɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'variety', phonetic: '/vəˈraɪəti/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '品种（果树种类）', en: 'a particular kind of fruit tree' },
      usage: { zh: '可数；the variety of apple、a new variety。', en: 'Countable: the variety of apple, a new variety.' },
      collocations: ['the tree variety', 'a fruit variety', 'choose a variety'],
      example: { en: 'Each label names the tree variety.', zh: '每个标签写着果树品种。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈraɪ/。', en: 'Four syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'take part', sentenceIndex: 15,
      meaning: { zh: '参与，加入', en: 'to join in an activity or project' },
      usage: { zh: 'take part in something；比 join 更强调参与其中。', en: 'take part in something; stresses active involvement.' },
      example: { en: 'Several local groups take part in the scheme.', zh: '几个本地团体参与了这个项目。' },
    },
    {
      phrase: 'clear weeds', sentenceIndex: 7,
      meaning: { zh: '清除杂草', en: 'to remove unwanted plants around the trees' },
      usage: { zh: 'clear 在此表示清理；clear weeds、clear the path。', en: 'Clear means to remove here: clear weeds, clear the path.' },
      example: { en: 'Volunteers clear weeds around the roots.', zh: '志愿者清除根部周围的杂草。' },
    },
    {
      phrase: 'fruit for later', sentenceIndex: 10,
      meaning: { zh: '留待以后（再摘）', en: 'to keep something until a later time' },
      usage: { zh: 'leave something for later；宾语可放中间。', en: 'leave something for later; the object can sit in the middle.' },
      example: { en: 'Hard fruit is left for later picking.', zh: '硬实的果实留待以后再摘。' },
    },
    {
      phrase: 'strip the fruit', sentenceIndex: 21,
      meaning: { zh: '把果实啄光，摘光', en: 'to remove all the fruit, here by birds' },
      usage: { zh: 'strip 在此表示剥光；strip the leaves、strip the branches。', en: 'Strip means to bare here: strip the leaves, strip the branches.' },
      example: { en: 'Birds may strip the cherries before harvest.', zh: '鸟可能在采收前啄光樱桃。' },
    },
    {
      phrase: 'suit this part', sentenceIndex: 20,
      meaning: { zh: '适合这一地区', en: 'to be right for this local climate or soil' },
      usage: { zh: 'suit 作动词；suit the local climate、suit this part of the country。', en: 'Suit is a verb here: suit the local climate, suit this part of the country.' },
      example: { en: 'Choose trees that suit the local soil.', zh: '挑选适合本地土壤的树种。' },
    },
    {
      phrase: 'rest and watch', sentenceIndex: 24,
      meaning: { zh: '休息并照看（果园）', en: 'to sit and observe the growing trees' },
      usage: { zh: 'rest 与 watch 并列；under the largest tree 点明位置。', en: 'Rest and watch are parallel; under the largest tree gives the place.' },
      example: { en: 'Visitors rest and watch the orchard grow.', zh: '访客坐下休息，看着果园长大。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白按话题路标定位', en: 'Follow the topic signposts' },
      body: {
        zh: 'Once the trees fruit、Before that、The council parks team 这类短语标出规则段与反馈段。听到就检查自己填到了笔记第几格，避免把开放日月份误填成种树季节。',
        en: 'Phrases such as Once the trees fruit, Before that and The council parks team mark the rules section and the feedback section. Use them to check which note you are on.',
      },
    },
    {
      title: { zh: '配对先记群体再记分工', en: 'Match group to role, not keyword' },
      body: {
        zh: '五个群体各有一句定位。先在学校、志愿者、居民、协会、园林团队旁记下动作（摊位、修剪课、围栏、测土、排水），再去对应选项，别只抓 fruit、tools 这类原词。',
        en: 'Each group has one locator line. Note the action beside each name first, then match; do not rely on single keywords like fruit or tools.',
      },
    },
    {
      title: { zh: '成熟度词是采摘规则考点', en: 'Ripeness words are the picking test' },
      body: {
        zh: 'ripe、green、hard、mature 这类词在采摘规则段成对出现。题目问可摘的条件，就对应 ripe；干扰项常把要留下的未熟果实反过来设成答案。',
        en: 'Words like ripe, green, hard and mature pair up in the picking rules. The pickable condition maps to ripe; distractors reverse the unripe fruit that must stay.',
      },
    },
  ],
};
