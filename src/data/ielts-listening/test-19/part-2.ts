import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 19 · Part 2 — 社区菜园协会会议（单人独白，澳式口音）。原创仿真材料，非官方真题。
 *
 * 会议顺序：新地块编号 → 水泵位置与检修 → 堆肥区 → 会费用途 → 地块分配方式 →
 * 水泵故障 → 丰收日日期 → 费用复述 → 秘书与管家分工。表格填空块在前，单选块居中，
 * 配对块在后，题块顺序与发言顺序一致。开场用议程指令，不重复 welcome to 句式。
 */
export const test19Part2: ListeningLesson = {
  slug: 'test-19-part-2',
  part: 2,
  status: 'published',
  title: { zh: '社区菜园协会会议', en: 'A meeting of an allotment society' },
  summary: {
    zh: '协会秘书在例会上通报：新地块编号与位置、共享水泵的位置和检修安排、堆肥区位置与废料规则、年会费的主要用途，说明地块抽签分配方式、水泵故障原因、丰收日日期，以及秘书和管家各自的分工。',
    en: 'The society secretary chairs a monthly meeting: the newest plot number and site, the shared pump location and repair, the compost area and waste rules, what the annual fee pays for, the ballot method for allocating plots, the pump fault, the harvest day date, and the separate duties of the secretary and the steward.',
  },
  accent: { zh: '秘书为澳式口音，会议节奏平稳。', en: 'The secretary speaks with an Australian accent at a steady meeting pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'secretary', label: 'SECRETARY', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Topic', 'Detail'],
      rows: [
        { lead: 'Newest plot', cells: [[{ text: 'plot number ' }, { blank: 11 }]] },
        { lead: 'Shared pump', cells: [[{ text: 'near the ' }, { blank: 12 }]] },
        { lead: 'Compost heaps', cells: [[{ text: 'behind the ' }, { blank: 13 }]] },
        { lead: 'Fee covers shared water supply and', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'How are plots allocated this year?',
          options: [
            { key: 'A', text: 'By length of membership' },
            { key: 'B', text: 'By a ballot of waiting members' },
            { key: 'C', text: 'By order of application' },
          ],
        },
        {
          number: 16,
          stem: 'What is wrong with the pump?',
          options: [
            { key: 'A', text: 'The motor has burned out.' },
            { key: 'B', text: 'A pipe is cracked and leaking.' },
            { key: 'C', text: 'The water tank has run dry.' },
          ],
        },
        {
          number: 17,
          stem: 'When is the harvest day held?',
          options: [
            { key: 'A', text: 'The second Saturday in March' },
            { key: 'B', text: 'The first Sunday in April' },
            { key: 'C', text: 'The third Saturday in February' },
          ],
        },
        {
          number: 18,
          stem: 'What does the membership fee mainly pay for?',
          options: [
            { key: 'A', text: 'Plot rent and fence repairs' },
            { key: 'B', text: 'The water supply and shared tools' },
            { key: 'C', text: 'The harvest fair costs and key deposits' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which duty matches each committee member? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'keeps the membership records' },
        { key: 'B', text: 'checks and repairs the shared water pump' },
        { key: 'C', text: 'organises the harvest fair' },
        { key: 'D', text: 'turns the compost heaps each month' },
        { key: 'E', text: 'marks out the new plots' },
      ],
      items: [
        { number: 19, text: 'the secretary' },
        { number: 20, text: 'the steward' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['sixteen', '16'], evidence: 2,
      explanation: {
        zh: '定位句 2：The newest plot, number sixteen, goes to the first name pulled。最新地块是十六号；far end beside the hedge 是位置参照，不是编号。',
        en: 'Sentence 2: "The newest plot, number sixteen, goes to the first name pulled". The newest plot is number sixteen; the far end beside the hedge locates it, rather than giving the number.',
      },
    },
    {
      number: 12, accepted: ['north gate'], evidence: 3,
      explanation: {
        zh: '定位句 3：The shared pump near the north gate has been losing pressure。水泵在北门附近；pressure 是故障表现，不是位置。',
        en: 'Sentence 3: "The shared pump near the north gate has been losing pressure". The pump is near the north gate; pressure describes the fault, not the location.',
      },
    },
    {
      number: 13, accepted: ['tool shed'], evidence: 5,
      explanation: {
        zh: '定位句 5：The compost heaps sit behind the tool shed。堆肥堆在工具棚后面；fence 和 boundary path 是周边参照，不能填。',
        en: 'Sentence 5: "The compost heaps sit behind the tool shed". The heaps are behind the tool shed; fence and boundary path are nearby references, not the answer.',
      },
    },
    {
      number: 14, accepted: ['tools'], evidence: 8,
      explanation: {
        zh: '定位句 8：it mainly covers the shared water supply and the tools kept in the shed。会费主要用于供水和共用工具；fence 维修在分工句提到，不在会费清单里。',
        en: 'Sentence 8: "it mainly covers the shared water supply and the tools kept in the shed". The fee pays for water and shared tools; fence repair appears in the duty description, not the fee list.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 10,
      explanation: {
        zh: '定位句 10：we draw names by ballot, so everyone waiting has the same chance。今年按抽签分配地块，对应 B。A 的按入会年限在同句被 rather than 否定，C 的申请顺序未提及。',
        en: 'Sentence 10: "we draw names by ballot, so everyone waiting has the same chance". Plots go to a ballot, matching B. Length of membership in A is rejected by rather than, and application order in C is not mentioned.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：The fault, according to the plumber, is a cracked pipe rather than the motor。故障是管道开裂，对应 B。A 的电机烧毁被 rather than 否定，C 的水箱干涸未出现。',
        en: 'Sentence 11: "The fault, according to the plumber, is a cracked pipe rather than the motor". The fault is a cracked pipe, matching B. A burned-out motor is rejected by rather than, and a dry tank is not raised.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 12,
      explanation: {
        zh: '定位句 12：It falls on the second Saturday in March。丰收日在三月第二个周六，对应 A。四月首个周日与二月第三个周六在录音中没有出现。',
        en: 'Sentence 12: "It falls on the second Saturday in March". Harvest day is the second Saturday in March, matching A. The first Sunday in April and third Saturday in February are not mentioned.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：the fee goes toward the water supply and the shared tools。会费用于供水和共用工具，对应 B。A 的地块租金在句 9 是另列款项，C 的集市费用与押金未计入会费。',
        en: 'Sentence 14: "the fee goes toward the water supply and the shared tools", matching B. Plot rent in sentence 9 is listed separately, and fair costs and deposits are not funded from the fee.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：The secretary keeps the membership records, sends the annual reminders, and updates the waiting list。秘书管会员记录，对应 A。',
        en: 'Sentence 16: "The secretary keeps the membership records, sends the annual reminders, and updates the waiting list". The secretary keeps membership records, matching A.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：The steward, meanwhile, looks after the shared water pump and walks the plots each morning to check the fences。管家负责共享水泵与围栏巡查，对应 B。',
        en: 'Sentence 17: "The steward, meanwhile, looks after the shared water pump and walks the plots each morning to check the fences". The steward checks and maintains the pump, matching B.',
      },
    },
  ],
  transcript: [
    { speaker: 'secretary', text: 'Good evening, everyone. Take a seat where you can, and I’ll run through tonight’s business in the order on the notice sheet.' },
    { speaker: 'secretary', text: 'First up is plot allocation. This year we have four new plots, and the waiting list has grown longer than we expected.' },
    { speaker: 'secretary', text: 'The newest plot, number sixteen, goes to the first name pulled, and it sits at the far end beside the hedge.' },
    { speaker: 'secretary', text: 'Next, the water supply. The shared pump near the north gate has been losing pressure for two weeks, and several members reported weak flow last weekend.' },
    { speaker: 'secretary', text: 'A plumber will inspect it next Tuesday. Members should water their plots early in the morning while the repair is pending, to keep pressure fair for everyone.' },
    { speaker: 'secretary', text: 'Now the compost area. The compost heaps sit behind the tool shed, between the fence and the boundary path.' },
    { speaker: 'secretary', text: 'Green waste can be added at any time, but cooked food and meat scraps must not go on the heaps.' },
    { speaker: 'secretary', text: 'The south heap is ready to turn this month, and any member who helps will get a bag of compost for their own plot.' },
    { speaker: 'secretary', text: 'Turning to the membership fee. The annual fee stays at forty dollars this year, and it mainly covers the shared water supply and the tools kept in the shed.' },
    { speaker: 'secretary', text: 'Plot rent is listed separately on the sheet, so please do not send the two amounts in one payment.' },
    { speaker: 'secretary', text: 'A reminder on how plots are assigned this year. Rather than give the ground to the longest members, we draw names by ballot, so everyone waiting has the same chance.' },
    { speaker: 'secretary', text: 'The fault, according to the plumber, is a cracked pipe rather than the motor itself.' },
    { speaker: 'secretary', text: 'One date to put in your diary is the harvest day. It falls on the second Saturday in March, when members bring their produce to the table by the entrance.' },
    { speaker: 'secretary', text: 'The fair runs from ten until two, and any unsold vegetables go to the community food bank rather than back home.' },
    { speaker: 'secretary', text: 'To restate the money side, the fee goes toward the water supply and the shared tools, while rent is paid on the separate form.' },
    { speaker: 'secretary', text: 'Now a quick note on who does what around the site.' },
    { speaker: 'secretary', text: 'The secretary keeps the membership records, sends the annual reminders, and updates the waiting list.' },
    { speaker: 'secretary', text: 'The steward, meanwhile, looks after the shared water pump and walks the plots each morning to check the fences.' },
    { speaker: 'secretary', text: 'If you spot a broken fence or a blocked tap, tell the steward rather than fixing it yourself.' },
    { speaker: 'secretary', text: 'The harvest fair itself is organised by a small working group, whose names are on the back of tonight’s sheet.' },
    { speaker: 'secretary', text: 'Before we take questions, a few rules for the meeting record.' },
    { speaker: 'secretary', text: 'Please speak once you have the floor, and hold side conversations outside the shed.' },
    { speaker: 'secretary', text: 'New members should collect a key from the secretary after the meeting, against a small returnable deposit.' },
    { speaker: 'secretary', text: 'Keys are not handed out during the plot discussion, so wait until we reach the end.' },
    { speaker: 'secretary', text: 'Does anyone have a question about the pump timing before we move on?' },
    { speaker: 'secretary', text: 'No questions, then. I’ll post the ballot result on the board by Thursday lunchtime.' },
    { speaker: 'secretary', text: 'Anyone who misses the draw can still join the waiting list for the round after next.' },
    { speaker: 'secretary', text: 'If you lose your key, tell the secretary the same day, because replacements are issued only at the next meeting.' },
    { speaker: 'secretary', text: 'The full list of duties is pinned beside the notice board for anyone who wants to read it later.' },
    { speaker: 'secretary', text: 'The secretary also keeps a note of which tools are signed out each month.' },
    { speaker: 'secretary', text: 'Members are asked to return any borrowed tool within a fortnight.' },
    { speaker: 'secretary', text: 'The working group meets on the first Sunday of each month in the shed.' },
    { speaker: 'secretary', text: 'Anyone who wants to help with the fair can add their name to that list.' },
    { speaker: 'secretary', text: 'We have ordered a new set of labels for the plot posts, to replace the faded ones.' },
    { speaker: 'secretary', text: 'The shed roof was patched last spring, and it should hold through the winter.' },
    { speaker: 'secretary', text: 'Please keep the gate closed behind you, especially when the weather is dry.' },
    { speaker: 'secretary', text: 'Children are welcome on site, but they should stay beside an adult near the plots.' },
    { speaker: 'secretary', text: 'That covers the main business. Thank you all for coming this evening.' },
  ],
  vocabulary: [
    {
      term: 'allocation', phonetic: '/ˌæləˈkeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '分配（地块名额）', en: 'the act of assigning plots to members' },
      usage: { zh: '不可数；plot allocation、allocation method。动词 allocate。', en: 'Uncountable: plot allocation. The verb is allocate.' },
      collocations: ['plot allocation', 'the allocation method', 'waiting list allocation'],
      example: { en: 'Plot allocation this year is decided by ballot.', zh: '今年地块按抽签分配。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈkeɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'ballot', phonetic: '/ˈbælət/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '抽签，投票选举', en: 'a random draw or vote to assign places' },
      usage: { zh: '可数；draw names by ballot、a ballot of members。', en: 'Countable: draw names by ballot, a ballot of members.' },
      collocations: ['draw by ballot', 'a ballot of members', 'ballot result'],
      example: { en: 'The plot winners are chosen by ballot.', zh: '地块中签者通过抽签选出。' },
      listening: { zh: '两个音节，重音在第一个；/ɒ/ 英音、/æ/ 澳音相近。', en: 'Two syllables with first stress; listen for the short vowel.' },
    },
    {
      term: 'compost', phonetic: '/ˈkɒmpɒst/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '堆肥', en: 'decayed plant matter used to feed the soil' },
      usage: { zh: '不可数；compost heap、turn the compost。', en: 'Uncountable: compost heap, turn the compost.' },
      collocations: ['the compost heaps', 'green compost', 'a bag of compost'],
      example: { en: 'The heaps behind the shed hold the green compost.', zh: '棚后的堆肥堆放着绿色堆肥。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /st/。', en: 'Two syllables with first stress; final /st/.' },
    },
    {
      term: 'steward', phonetic: '/ˈstjuːəd/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '场地管家，管事', en: 'the member who looks after the shared site and equipment' },
      usage: { zh: '可数名词；site steward、the steward walks the plots。', en: 'Countable: site steward; the steward walks the plots.' },
      collocations: ['the steward', 'site steward', 'steward duties'],
      example: { en: 'The steward checks the fences and the pump each morning.', zh: '管家每天早上巡查围栏和水泵。' },
      listening: { zh: '两个音节，重音在第一个；/juː/ 不要漏。', en: 'Two syllables with first stress; keep /juː/.' },
    },
    {
      term: 'harvest', phonetic: '/ˈhɑːvɪst/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '收获，丰收时节', en: 'the time when crops and produce are gathered' },
      usage: { zh: '可数或不可数；harvest day、the harvest fair。', en: 'Countable or uncountable: harvest day, harvest fair.' },
      collocations: ['harvest day', 'the harvest fair', 'the harvest table'],
      example: { en: 'The harvest day falls on the second Saturday in March.', zh: '丰收日在三月第二个周六。' },
      listening: { zh: '两个音节，重音在第一个；/v/ 咬唇。', en: 'Two syllables with first stress; the /v/ is labial.' },
    },
    {
      term: 'membership', phonetic: '/ˈmembəʃɪp/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '会员资格，会员名册', en: 'the status of being a member, or the member list' },
      usage: { zh: '不可数；membership records、annual membership fee。', en: 'Uncountable: membership records, annual membership fee.' },
      collocations: ['membership records', 'annual membership fee', 'membership list'],
      example: { en: 'The secretary keeps the membership records up to date.', zh: '秘书把会员记录更新到最新。' },
      listening: { zh: '三个音节，重音在第一个；-ship 读 /ʃɪp/。', en: 'Three syllables with first stress; -ship is /ʃɪp/.' },
    },
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '押金（可退还）', en: 'a sum returned when a key or item is given back' },
      usage: { zh: '可数；returnable deposit、pay a deposit。', en: 'Countable: returnable deposit, pay a deposit.' },
      collocations: ['a returnable deposit', 'key deposit', 'pay a deposit'],
      example: { en: 'The key is issued against a small returnable deposit.', zh: '凭一小笔可退还押金领取钥匙。' },
      listening: { zh: '重音在第二音节 /ˈpɒz/；与 dispose 同根。', en: 'Stress the second syllable; related to dispose.' },
    },
  ],
  expressions: [
    {
      phrase: 'run through', sentenceIndex: 0,
      meaning: { zh: '逐项过一遍（议程）', en: 'to go through the meeting business in order' },
      usage: { zh: '及物短语；run through the business、the schedule。', en: 'Transitive: run through the business or schedule.' },
      example: { en: 'I’ll run through tonight’s business in order.', zh: '我按顺序把今晚的议程过一遍。' },
    },
    {
      phrase: 'pending', sentenceIndex: 4,
      meaning: { zh: '在等待（处理）期间', en: 'while something is waiting to be dealt with' },
      usage: { zh: 'while the repair is pending；正式会议用语。', en: 'While the repair is pending; formal meeting language.' },
      example: { en: 'Use morning watering while the repair is pending.', zh: '检修完成前请在早上浇水。' },
    },
    {
      phrase: 'ready to turn', sentenceIndex: 7,
      meaning: { zh: '可以翻堆了', en: 'ripe enough to be mixed and aerated' },
      usage: { zh: '堆肥用语；heap is ready to turn。', en: 'Compost term: the heap is ready to turn.' },
      example: { en: 'The south heap is ready to turn this month.', zh: '南边这堆本月可以翻堆了。' },
    },
    {
      phrase: 'goes toward', sentenceIndex: 14,
      meaning: { zh: '用于，投入（某项开支）', en: 'contributes to paying for something' },
      usage: { zh: 'fee goes toward the water supply；说明费用去向。', en: 'Fee goes toward the water supply; states where money goes.' },
      example: { en: 'The fee goes toward shared tools and water.', zh: '会费用于共用工具和供水。' },
    },
    {
      phrase: 'on the board', sentenceIndex: 25,
      meaning: { zh: '在公告栏上', en: 'posted on the notice board' },
      usage: { zh: 'post the result on the board；社区场景常用。', en: 'Post the result on the board; common in community settings.' },
      example: { en: 'The ballot result goes on the board by Thursday.', zh: '抽签结果周四前贴上公告栏。' },
    },
    {
      phrase: 'side conversations', sentenceIndex: 21,
      meaning: { zh: '私下交谈，旁聊', en: 'small talks away from the main meeting' },
      usage: { zh: 'hold side conversations outside；会议纪律用语。', en: 'Hold side conversations outside; a meeting rule.' },
      example: { en: 'Please keep side conversations outside the shed.', zh: '请把私下交谈挪到棚外。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题先定位主题列', en: 'Locate the topic column first' },
      body: {
        zh: '第 11 到 14 题是表格填空，左列主题依次是地块、水泵、堆肥、会费。听前先把四个主题词在脑中过一遍，录音提到 pump、compost、fee 时再到对应行落笔。',
        en: 'Items 11 to 14 are table completion; the left column moves plot, pump, compost and fee. Note these topics before listening, and write into a row only when its topic word is named.',
      },
    },
    {
      title: { zh: '否定对比锁定故障原因', en: 'Negatives pin down the fault' },
      body: {
        zh: '第 16 题答案在 cracked pipe rather than the motor。rather than 之后是被否定的对象；选择题 A 常把被否定的电机烧毁做成干扰项，听到 rather than 先在旁标注。',
        en: 'Item 16 follows cracked pipe rather than the motor. After rather than is the rejected part; distractor A turns the rejected motor fault into the answer. Mark the rejection when you hear rather than.',
      },
    },
    {
      title: { zh: '配对题把职务与动作分开记', en: 'Separate role from action in matching' },
      body: {
        zh: '配对只有两题：秘书对应记录，管家对应水泵与围栏。听到人名/职务时先写角色，再写紧随的动作；organises the fair、turns the heaps 属于其他工作组，是干扰项。',
        en: 'The matching set has two items: the secretary to records, the steward to the pump and fences. Write the role first, then the action that follows; organising the fair and turning the heaps belong to other groups and are distractors.',
      },
    },
  ],
};
