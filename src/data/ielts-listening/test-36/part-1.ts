import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 36 · Part 1 — 居民向社区菜园咨询租地（双人对话，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 交易类对话：地块面积、年费、工具房、浇水时段、退租清理；后段把共享工具、浇水软管和腾空地块
 * 三类对象各自的规则配成选项（配对 8–10）。开场由居民直接说明来意，不用机构问候。
 */
export const test36Part1: ListeningLesson = {
  slug: 'test-36-part-1',
  part: 1,
  status: 'published',
  title: { zh: '租社区菜园地块', en: 'Renting a community garden plot' },
  summary: {
    zh: '居民咨询社区菜园租地：标准地块面积、年费与优惠、共享工具房、上午浇水时段、退租时的清理义务，以及检查频次、年费包含项目，并把共享工具、浇水软管和腾空地块分别对应到各自规则。',
    en: 'A resident asks about renting a community garden plot: the standard size, annual fee and concession, shared tool shed, morning watering slot, clearance on leaving, inspection frequency, what the fee covers, and matching rules for shared tools, hoses and a vacated plot.',
  },
  accent: { zh: '两位说话人均为新西兰口音。', en: 'Both speakers use New Zealand accents.' },
  speechRate: '+2%',
  cast: [
    { id: 'officer', label: 'OFFICER', gender: 'female', voice: 'en-NZ-MollyNeural' },
    { id: 'resident', label: 'RESIDENT', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Standard plot size', cells: [[{ blank: 1 }, { text: ' square metres' }]] },
        { lead: 'Annual fee', cells: [[{ blank: 2 }, { text: ' dollars' }]] },
        { lead: 'Shared tools kept in the', cells: [[{ blank: 3 }]] },
        { lead: 'Watering allowed before', cells: [[{ blank: 4 }, { text: ' in the morning' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What must happen when a tenant gives up the plot?',
          options: [
            { key: 'A', text: 'The plot must be cleared before handover' },
            { key: 'B', text: 'Old compost may stay for the next gardener' },
            { key: 'C', text: 'The tool shed is reassigned to the waiting list' },
          ],
        },
        {
          number: 6,
          stem: 'How often does the committee inspect the plots?',
          options: [
            { key: 'A', text: 'Once a month' },
            { key: 'B', text: 'Once each season' },
            { key: 'C', text: 'Once a year' },
          ],
        },
        {
          number: 7,
          stem: 'What does the annual fee cover?',
          options: [
            { key: 'A', text: 'Shared tools and standpipe water' },
            { key: 'B', text: 'Seeds and young plants' },
            { key: 'C', text: 'Bags of bought compost' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which rule applies to each item? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'locked inside the tool shed each evening' },
        { key: 'B', text: 'used only for the herb beds' },
        { key: 'C', text: 'drained and stored over winter' },
        { key: 'D', text: 'cleared before the next tenant moves in' },
        { key: 'E', text: 'watered by the automatic timer' },
      ],
      items: [
        { number: 8, text: 'the shared tools' },
        { number: 9, text: 'the watering hoses' },
        { number: 10, text: 'the vacated plot' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['twenty', '20'], spoken: 'twenty', evidence: 3,
      explanation: {
        zh: '定位句 3：The ordinary plots are twenty square metres, with a smaller bed of eight square metres beside the orchard。标准地块二十平方米；句 3 的八平方米是果园旁的小床，属于干扰数字。',
        en: 'Sentence 3: "The ordinary plots are twenty square metres, with a smaller bed of eight square metres beside the orchard". The standard plot is twenty square metres. The eight-square-metre bed in the same sentence is a distractor.',
      },
    },
    {
      number: 2, accepted: ['forty', '40'], spoken: 'forty', evidence: 5,
      explanation: {
        zh: '定位句 5：The annual fee is forty dollars, and it renews each spring。年费四十美元；句 5 的优惠价是持卡人减免，不是标准年费。',
        en: 'Sentence 5: "The annual fee is forty dollars, and it renews each spring". The fee is forty dollars. The concession rate in the same sentence is a reduced cardholder price, not the standard fee.',
      },
    },
    {
      number: 3, accepted: ['shed'], evidence: 7,
      explanation: {
        zh: '定位句 7：There’s a shared tool shed near the entrance, with spades, rakes and hoes for everyone。共享工具放在工具房，填 shed。句 9 讲钥匙与归还，不改变存放地点。',
        en: 'Sentence 7: "There’s a shared tool shed near the entrance, with spades, rakes and hoes for everyone". Tools are kept in the shed, so write shed. Sentence 9 covers keys and returns, not the storage place.',
      },
    },
    {
      number: 4, accepted: ['nine', '9'], spoken: 'nine', evidence: 11,
      explanation: {
        zh: '定位句 11：you may water your own plot there between six and nine in the morning。浇水时段截止到上午九点；空后已印 in the morning，填 nine。句 13 说九点后关闭水管，不另给截止点。',
        en: 'Sentence 11: "you may water your own plot there between six and nine in the morning". Watering ends at nine; in the morning is printed, so write nine. Sentence 13 closes the hoses after nine but gives no new cutoff.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：When you give up a plot, you must clear it and remove everything you have grown or stored there。退租必须清理地块，对应 A。B 的堆肥留下在句 21 被否定，C 的工具房重新分配在对话中没有依据。',
        en: 'Sentence 17: "When you give up a plot, you must clear it and remove everything you have grown or stored there". Clearing before handover matches A. Leaving compost in B is rejected in sentence 21, and reassigning the shed in C is never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：We inspect once each season, and send a reminder if a plot has been neglected。检查频次为每季一次，对应 B。句 40 的每月劳作日是志愿活动，不是检查；A、C 的频次在对话中未出现。',
        en: 'Sentence 21: "We inspect once each season, and send a reminder if a plot has been neglected". Once each season matches B. The monthly working bee in sentence 40 is a volunteer event, not an inspection; monthly and yearly in A and C are not stated.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：The fee covers shared tools and the water from the standpipes。年费含共享工具与水管用水，对应 A。B 的种子幼苗与 C 的堆肥袋在同句被明确为自购。',
        en: 'Sentence 25: "The fee covers shared tools and the water from the standpipes". Shared tools and water match A. Seeds, plants and compost bags in B and C are explicitly bought by the tenant in the same sentence.',
      },
    },
    {
      number: 8, accepted: ['A'], evidence: 31,
      explanation: {
        zh: '定位句 31：The shared tools are locked inside the tool shed each evening。共享工具每晚锁进工具房，对应 A。句 7 的工具清单是物品说明，不是保管规则。',
        en: 'Sentence 31: "The shared tools are locked inside the tool shed each evening". Tools are locked in the shed, matching A. The tool list in sentence 7 describes items, not the storage rule.',
      },
    },
    {
      number: 9, accepted: ['C'], evidence: 33,
      explanation: {
        zh: '定位句 33：The watering hoses are drained and stored before the frost。软管排空收存过冬，对应 C。E 的自动定时器属于大门旁药草床，不是软管。',
        en: 'Sentence 33: "The watering hoses are drained and stored before the frost". Hoses are drained and stored, matching C. The automatic timer in E applies to the herb beds by the gate, not the hoses.',
      },
    },
    {
      number: 10, accepted: ['D'], evidence: 36,
      explanation: {
        zh: '定位句 36：A vacated plot has to be cleared before the next tenant moves in。腾空地块在下一租户入住前清理完毕，对应 D。B 的仅供药草床在讲解中未作为规则出现。',
        en: 'Sentence 36: "A vacated plot has to be cleared before the next tenant moves in". The vacated plot is cleared before handover, matching D. Used only for herb beds in B is never stated as a rule.',
      },
    },
  ],
  transcript: [
    { speaker: 'resident', text: 'Hi, I saw the notice about plots coming free at the community garden, so I’ve come to ask how renting one works.' },
    { speaker: 'officer', text: 'Welcome, and thanks for coming round. I’ll walk you through the size, the fee, the shared facilities and the rules.' },
    { speaker: 'resident', text: 'Perfect. How large is the standard plot we could take on?' },
    { speaker: 'officer', text: 'The ordinary plots are twenty square metres, with a smaller bed of eight square metres beside the orchard.' },
    { speaker: 'resident', text: 'Twenty square metres, that sounds about right for my vegetables. And what does the annual fee come to?' },
    { speaker: 'officer', text: 'The annual fee is forty dollars, and it renews each spring. A reduced rate applies to concession card holders.' },
    { speaker: 'resident', text: 'Fine. Do we need to buy our own tools, or is there something on site?' },
    { speaker: 'officer', text: 'You don’t need to bring everything. There’s a shared tool shed near the entrance, with spades, rakes and hoes for everyone.' },
    { speaker: 'resident', text: 'Where do we collect the key to that shed?' },
    { speaker: 'officer', text: 'The shed stays unlocked during opening hours, but if you take a tool home you must return it the same week.' },
    { speaker: 'resident', text: 'What about watering? I don’t want to carry buckets from the tap all day.' },
    { speaker: 'officer', text: 'The standpipes are along the central path, and you may water your own plot there between six and nine in the morning.' },
    { speaker: 'resident', text: 'Only before nine? Is there an afternoon slot as well?' },
    { speaker: 'officer', text: 'After nine the hoses are closed off, to keep the water down during the warmest part of the day.' },
    { speaker: 'resident', text: 'I see. Is there an automatic system for the herb beds, or do those still need hand watering?' },
    { speaker: 'officer', text: 'The herb beds near the gate are on an automatic timer, so those you leave alone.' },
    { speaker: 'resident', text: 'Good. Now if something goes wrong and I can’t keep the plot, how does leaving early work?' },
    { speaker: 'officer', text: 'When you give up a plot, you must clear it and remove everything you have grown or stored there.' },
    { speaker: 'resident', text: 'So the next person starts with bare soil, no old frames or bags left behind?' },
    { speaker: 'officer', text: 'Compost you make stays in your plot until handover; the shared bin by the shed is for garden waste only.' },
    { speaker: 'resident', text: 'How often does the committee check that the plots are looked after?' },
    { speaker: 'officer', text: 'We inspect once each season, and send a reminder if a plot has been neglected.' },
    { speaker: 'resident', text: 'Would we lose the plot after repeated reminders?' },
    { speaker: 'officer', text: 'Yes, after three warnings the committee reassigns the plot to someone on the waiting list.' },
    { speaker: 'resident', text: 'What exactly does the annual fee cover? I assume seeds are ours to buy.' },
    { speaker: 'officer', text: 'The fee covers shared tools and the water from the standpipes. Seeds, plants and compost bags you buy yourself.' },
    { speaker: 'resident', text: 'Are there any restrictions on what we grow?' },
    { speaker: 'officer', text: 'No large trees, and no plants that spread across the path into the neighbour’s bed.' },
    { speaker: 'resident', text: 'Can we put a small shed on the plot itself?' },
    { speaker: 'officer', text: 'Permanent sheds aren’t allowed on the plots, though a small portable storage box is fine.' },
    { speaker: 'resident', text: 'And the tool shed by the entrance, who uses that?' },
    { speaker: 'officer', text: 'The shared tools are locked inside the tool shed each evening, and the shed door is checked by the coordinator.' },
    { speaker: 'resident', text: 'What happens to the hoses over winter?' },
    { speaker: 'officer', text: 'The watering hoses are drained and stored before the frost, so please don’t leave them out.' },
    { speaker: 'resident', text: 'The herb beds on the other side of the gate, are those on the same hose system?' },
    { speaker: 'officer', text: 'Those are watered by the automatic timer, so you don’t need to tend them yourself.' },
    { speaker: 'officer', text: 'A vacated plot has to be cleared before the next tenant moves in.' },
    { speaker: 'resident', text: 'Is there a waiting list I should join now, in case this plot goes quickly?' },
    { speaker: 'officer', text: 'Yes, I can add your name to the list, and we’ll write once the inspection clears the plot.' },
    { speaker: 'resident', text: 'Do residents get a say in what happens around the garden?' },
    { speaker: 'officer', text: 'There’s a working bee once a month, and anyone with a plot can help with the path and fence repairs.' },
    { speaker: 'resident', text: 'That sounds fair. I’ll take the application form home and fill it in tonight.' },
    { speaker: 'officer', text: 'Fine. Bring it back with a recent proof of address, and we’ll confirm the plot next week.' },
  ],
  vocabulary: [
    {
      term: 'plot', phonetic: '/plɒt/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '（菜园）地块', en: 'a small marked piece of land for one gardener' },
      usage: { zh: '可数；garden plot、standard plot、rent a plot。', en: 'Countable: garden plot, standard plot, rent a plot.' },
      collocations: ['a garden plot', 'the standard plot', 'the vacated plot'],
      example: { en: 'The standard plot is twenty square metres.', zh: '标准地块为二十平方米。' },
      listening: { zh: '单音节，与 spot 区分；靠 garden 搭配判断。', en: 'One syllable; distinguish from spot by the garden context.' },
    },
    {
      term: 'fee', phonetic: '/fiː/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '费用，年费', en: 'the annual charge for renting the plot' },
      usage: { zh: '可数；annual fee、cover the fee。', en: 'Countable: annual fee, cover the fee.' },
      collocations: ['the annual fee', 'the fee covers', 'pay the fee'],
      example: { en: 'The annual fee covers shared tools and water.', zh: '年费含共享工具与用水。' },
      listening: { zh: '单音节长音 /iː/；与 feet 同音，靠语境判断。', en: 'One syllable, long /iː/, homophone of feet.' },
    },
    {
      term: 'standpipes', phonetic: '/ˈstændpaɪps/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '（园地）供水立管', en: 'the fixed tap or pipe where gardeners collect water' },
      usage: { zh: '可数；standpipes along the path。', en: 'Countable: standpipes along the path.' },
      collocations: ['the standpipes', 'water from the standpipes'],
      example: { en: 'The standpipes run along the central path.', zh: '供水立管沿中央小路排布。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈstæn/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'concession', phonetic: '/kənˈseʃn/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '优惠价，减免（持卡人）', en: 'a reduced rate for eligible cardholders' },
      usage: { zh: 'concession card、concession rate；英式公共场合常见。', en: 'Concession card, concession rate; common in British public services.' },
      collocations: ['a concession card', 'the concession rate', 'concession holders'],
      example: { en: 'Concession card holders pay a reduced annual fee.', zh: '优惠卡持有人年费减免。' },
      listening: { zh: '重音在第二音节 /ˈseʃ/，结尾是 /n/。', en: 'Stress the second syllable; the word ends in /n/.' },
    },
    {
      term: 'inspect', phonetic: '/ɪnˈspekt/', partOfSpeech: 'v.', sentenceIndex: 21,
      meaning: { zh: '检查，巡查（地块）', en: 'to look over a plot to see it is cared for' },
      usage: { zh: '及物；inspect the plots；名词 inspection。', en: 'Transitive: inspect the plots; the noun is inspection.' },
      collocations: ['inspect the plots', 'the committee inspects'],
      example: { en: 'The committee inspects each plot once a season.', zh: '委员会每季巡查一次地块。' },
      listening: { zh: '重音在第二音节 /ˈspekt/；与名词 inspection 对比记。', en: 'Stress the second syllable; compare with the noun inspection.' },
    },
    {
      term: 'vacated', phonetic: '/vəˈkeɪtɪd/', partOfSpeech: 'adj.', sentenceIndex: 36,
      meaning: { zh: '腾空的，退租后的', en: 'left empty after the tenant moves out' },
      usage: { zh: '定语；a vacated plot。动词 vacate，名词 vacation 不同义。', en: 'Attributive: a vacated plot. Verb vacate; do not confuse with vacation.' },
      collocations: ['the vacated plot', 'a vacated bed'],
      example: { en: 'A vacated plot is cleared before reletting.', zh: '腾空地块在再租前清理干净。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈkeɪ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'compost', phonetic: '/ˈkɒmpɒst/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '堆肥，腐殖土', en: 'rotted garden waste used to feed the soil' },
      usage: { zh: '不可数；make compost、a compost heap。', en: 'Uncountable: make compost, a compost heap.' },
      collocations: ['make compost', 'the shared compost bin', 'compost bags'],
      example: { en: 'Garden waste goes to the shared compost bin.', zh: '园林废弃物送入共享堆肥箱。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkɒm/。', en: 'Two syllables with first-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'coming round', sentenceIndex: 1,
      meaning: { zh: '过来，到访（场地）', en: 'to visit the site in person' },
      usage: { zh: 'come round 后不加宾语；动名词 coming round 用于感谢到访。', en: 'Come round takes no object; the gerund coming round thanks someone for visiting.' },
      example: { en: 'Thanks for coming round to the garden.', zh: '谢谢你专程来园地一趟。' },
    },
    {
      phrase: 'between six and nine', sentenceIndex: 11,
      meaning: { zh: '在六点到九点之间', en: 'the time window from six to nine' },
      usage: { zh: 'between 后接两个时间点；morning 限定为上午。', en: 'Between plus two times; morning fixes the window.' },
      example: { en: 'Water the plot between six and nine in the morning.', zh: '在上午六点到九点之间浇水。' },
    },
    {
      phrase: 'leave alone', sentenceIndex: 15,
      meaning: { zh: '不用管，任由其自动运行', en: 'to leave something running without manual care' },
      usage: { zh: 'leave something alone；这里指定时器药草床不用手浇。', en: 'Leave something alone; here the timed herb beds need no hand watering.' },
      example: { en: 'The timer beds are on their own, so leave them alone.', zh: '定时药草床自动运行，不用管。' },
    },
    {
      phrase: 'handover', sentenceIndex: 19,
      meaning: { zh: '交接（地块手续）', en: 'the moment the plot passes from one tenant to the next' },
      usage: { zh: '不可数；before handover、at handover。', en: 'Uncountable: before handover, at handover.' },
      example: { en: 'All grown produce must go before handover.', zh: '所有收成须在交接前清走。' },
    },
    {
      phrase: 'reassigns the plot', sentenceIndex: 23,
      meaning: { zh: '把地块重新分配', en: 'to give the plot to someone else on the list' },
      usage: { zh: 'reassign 为及物动词；reassign something to somebody。', en: 'Transitive: reassign something to somebody.' },
      example: { en: 'The committee reassigns the plot after three warnings.', zh: '三次提醒后委员会重新分配地块。' },
    },
    {
      phrase: 'working bee', sentenceIndex: 40,
      meaning: { zh: '集体劳作日', en: 'a volunteer session to repair paths, fences and shared areas' },
      usage: { zh: '澳洲/新西兰常用；once a month 的 working bee。', en: 'Common in Australian and NZ usage: a monthly working bee.' },
      example: { en: 'The monthly working bee repairs paths and fences.', zh: '每月劳作日修缮小路与围栏。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格先看已印单位词', en: 'Read the printed unit before each gap' },
      body: {
        zh: '第 1、2、4 题空后分别印 square metres、dollars、in the morning，听到数词直接填数量或时间，不要把单位词重复写下。八平方米小床、优惠价是相邻干扰数字。',
        en: 'Rows 1, 2 and 4 print square metres, dollars and in the morning, so write the number or time only and do not repeat the unit. The eight-square-metre bed and concession rate are adjacent distractors.',
      },
    },
    {
      title: { zh: '分清费用包含与自购项', en: 'Split included items from bought items' },
      body: {
        zh: '第 7 题只问年费包含项：共享工具与立管用水。种子、幼苗、堆肥袋在同句被明确为自购；听到 buy yourself、own 时不要把这些选进包含项。',
        en: 'Item 7 asks only what the fee includes: shared tools and standpipe water. Seeds, plants and compost bags are bought yourself in the same sentence. On buy yourself or own, keep them out of the included answer.',
      },
    },
    {
      title: { zh: '配对按物品归规则', en: 'Match rule to item by keyword' },
      body: {
        zh: '第 8–10 题三个物品对应锁入工具房、排空过冬、交接前清理。定时器药草床在选项 E 出现但不是配对物品；落笔前确认选项规则说的是当前物品，不要把定时器规则安到软管上。',
        en: 'Items 8 to 10 pair tools with locking in the shed, hoses with draining, and the plot with pre-handover clearance. The timer herb beds appear in option E but are not matching items. Confirm the rule names the current item before choosing.',
      },
    },
  ],
};
