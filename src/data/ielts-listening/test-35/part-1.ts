import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 35 · Part 1 — 加入维修咖啡馆（双人对话，加拿大 + 美式口音）。原创仿真材料，非官方真题。
 *
 * 对话顺序：登记姓名与物品 → 可修类别 → 零件费用与入场费 → 预约方式（填空 1–6）→
 * 志愿者分工、单次时长、携带物品与拒收品类（单选 7–10）。题块顺序与录音顺序一致。
 */
export const test35Part1: ListeningLesson = {
  slug: 'test-35-part-1',
  part: 1,
  status: 'published',
  title: { zh: '加入维修咖啡馆', en: 'Joining a repair cafe' },
  summary: {
    zh: '居民到维修咖啡馆咨询一台不加热的水壶：登记姓名与物品，确认小电器属于可修类别，了解零件分摊费用、免入场费与线上预约方式，并弄清志愿者分工、单次维修时长、当天携带物品和拒收的燃气器具。',
    en: 'A resident visits a repair cafe about a kettle that will not heat: giving name and item, confirming small electricals are accepted, learning the parts contribution, the free entry and online booking, then the volunteer role, session length, what to bring and the refused gas appliances.',
  },
  accent: { zh: '协调员为加拿大口音，居民为美式口音。', en: 'The coordinator speaks with a Canadian accent and the resident with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'resident', label: 'RESIDENT', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Item brought', cells: [[{ blank: 2 }]] },
        { lead: 'Accepted category', cells: [[{ blank: 3 }]] },
        { lead: 'Parts contribution', cells: [[{ text: '$' }, { blank: 4 }]] },
        { lead: 'Entry charge', cells: [[{ blank: 5 }]] },
        { lead: 'Booking method', cells: [[{ blank: 6 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'What do volunteers do on a shift?',
          options: [
            { key: 'A', text: 'fix the item without help from the resident' },
            { key: 'B', text: 'assess the fault and guide the resident through the repair' },
            { key: 'C', text: 'sell spare parts from the till' },
          ],
        },
        {
          number: 8,
          stem: 'How long does each resident’s repair session last?',
          options: [
            { key: 'A', text: 'one hour' },
            { key: 'B', text: 'two hours' },
            { key: 'C', text: 'three hours' },
          ],
        },
        {
          number: 9,
          stem: 'What should residents bring on the day?',
          options: [
            { key: 'A', text: 'the broken item, its plug and lead, and a short fault note' },
            { key: 'B', text: 'the instruction book and a tool kit' },
            { key: 'C', text: 'a donation and a reference letter' },
          ],
        },
        {
          number: 10,
          stem: 'What is refused at the cafe?',
          options: [
            { key: 'A', text: 'small lamps' },
            { key: 'B', text: 'kettles and toasters' },
            { key: 'C', text: 'gas appliances' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Bell'], evidence: 4,
      explanation: {
        zh: '定位句 4：It’s Bell. B, E, L, L。拼写题跟着字母逐个写；不要按发音误写成 Bel 或 Belle。',
        en: 'Sentence 4: "It’s Bell. B, E, L, L". Write the letters as spelled; do not guess Bel or Belle from the sound.',
      },
    },
    {
      number: 2, accepted: ['kettle'], evidence: 6,
      explanation: {
        zh: '定位句 6：The kettle. It boils no water now, and the switch does not click when I press it。带来的物品是水壶；句 7 的 switch 是故障部件，不是物品类别。',
        en: 'Sentence 6: "The kettle. It boils no water now, and the switch does not click when I press it". The item is the kettle. The switch in sentence 7 is the faulty part, not the item.',
      },
    },
    {
      number: 3, accepted: ['electrical appliance'], evidence: 7,
      explanation: {
        zh: '定位句 7：A kettle falls under the electrical appliance category, which our volunteers can usually open。可修类别为电器，填 electrical appliance；句 9 的 lamps、toasters 是同类举例。',
        en: 'Sentence 7: "A kettle falls under the electrical appliance category, which our volunteers can usually open". The accepted category is electrical appliance. Lamps and toasters in sentence 9 are examples of the same group.',
      },
    },
    {
      number: 4, accepted: ['5', 'five'], spoken: 'five', evidence: 11,
      explanation: {
        zh: '定位句 11：we ask five dollars toward the cost, and larger components are priced before fitting。零件分摊五美元；大件部件是先报价后更换，不是分摊价。',
        en: 'Sentence 11: "we ask five dollars toward the cost, and larger components are priced before fitting". The parts contribution is five dollars; larger components are quoted before fitting.',
      },
    },
    {
      number: 5, accepted: ['free'], evidence: 13,
      explanation: {
        zh: '定位句 13：There is no entry charge; the visit itself is free, though donations toward the tools are welcome at the till。入场不收费，填 free；捐款是自愿行为，不是入场费。',
        en: 'Sentence 13: "There is no entry charge; the visit itself is free, though donations toward the tools are welcome at the till". Entry is free, so fill free. Donations are voluntary, not the entry charge.',
      },
    },
    {
      number: 6, accepted: ['online form'], evidence: 15,
      explanation: {
        zh: '定位句 15：You fill in the online form, giving your name, the item and the fault, and we confirm by email。预约走线上表单，填 online form；句 17 说明电话只解答一般问题，不能占座。',
        en: 'Sentence 15: "You fill in the online form, giving your name, the item and the fault, and we confirm by email". Booking is the online form. Sentence 17 states the phone handles general questions only, not reservations.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：They assess the fault first, then guide you through the repair rather than fixing it for you。志愿者先判断故障，再引导居民自己修，对应 B。A 说替居民修好，与原文相反；C 的零件售卖不在志愿者职责内。',
        en: 'Sentence 19: "They assess the fault first, then guide you through the repair rather than fixing it for you", matching B. A reverses the guide-not-fix rule, and selling parts in C is not the volunteer’s role.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：Each resident has about two hours, and simple faults are usually found within the first hour。单次约两小时，对应 B；第一小时是找到简单故障的时间，不是总时长。',
        en: 'Sentence 23: "Each resident has about two hours, and simple faults are usually found within the first hour", matching B. The first hour is when simple faults are found, not the total session length.',
      },
    },
    {
      number: 9, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：Bring the broken item itself, its plug and lead, and a short note of when it stopped working。带故障物品、插头电源线和简短故障记录，对应 A。说明书可选（句 27），工具包与介绍信未要求。',
        en: 'Sentence 25: "Bring the broken item itself, its plug and lead, and a short note of when it stopped working", matching A. The instruction book is optional in sentence 27, and a tool kit or reference letter is not requested.',
      },
    },
    {
      number: 10, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：We turn away gas appliances. Gas equipment has to be handled by a qualified engineer, not on an open bench。燃气器具拒收，对应 C。小台灯、水壶和烤面包机都在可修小电器范围内。',
        en: 'Sentence 29: "We turn away gas appliances. Gas equipment has to be handled by a qualified engineer, not on an open bench", matching C. Small lamps, kettles and toasters are among the accepted electricals.',
      },
    },
  ],
  transcript: [
    { speaker: 'resident', text: 'Hi, I’ve got a small kettle that has stopped heating, and I heard your repair cafe can look at it.' },
    { speaker: 'coordinator', text: 'Welcome in. We do take small household items here, as long as they are safe to open on the bench.' },
    { speaker: 'resident', text: 'Great. Could I leave my name for the booking?' },
    { speaker: 'coordinator', text: 'Sure. What’s your surname?' },
    { speaker: 'resident', text: 'It’s Bell. B, E, L, L.' },
    { speaker: 'coordinator', text: 'Bell, noted. And what exactly have you brought along?' },
    { speaker: 'resident', text: 'The kettle. It boils no water now, and the switch does not click when I press it.' },
    { speaker: 'coordinator', text: 'A kettle falls under the electrical appliance category, which our volunteers can usually open.' },
    { speaker: 'resident', text: 'Is that the type you accept? I was worried you only took furniture.' },
    { speaker: 'coordinator', text: 'No, small electrical appliances are our main group, from lamps to toasters and kettles.' },
    { speaker: 'resident', text: 'Do I pay for any replacement parts?' },
    { speaker: 'coordinator', text: 'If a part is needed, we ask five dollars toward the cost, and larger components are priced before fitting.' },
    { speaker: 'resident', text: 'Five dollars for parts. Is there a seat fee on top of that?' },
    { speaker: 'coordinator', text: 'There is no entry charge; the visit itself is free, though donations toward the tools are welcome at the till.' },
    { speaker: 'resident', text: 'Good. How do I book a place on the next session?' },
    { speaker: 'coordinator', text: 'You fill in the online form, giving your name, the item and the fault, and we confirm by email.' },
    { speaker: 'resident', text: 'The online form. Can I instead book by phone?' },
    { speaker: 'coordinator', text: 'Phone calls are for general questions only; slots are reserved through the form, so we can match you to a bench.' },
    { speaker: 'resident', text: 'What does a volunteer actually do during a shift?' },
    { speaker: 'coordinator', text: 'They assess the fault first, then guide you through the repair rather than fixing it for you.' },
    { speaker: 'resident', text: 'That sounds fair. I’d rather understand the problem than hand it over.' },
    { speaker: 'coordinator', text: 'Most residents feel the same, and we keep the tools and spare parts on site.' },
    { speaker: 'resident', text: 'How long is the repair session once I’m at the bench?' },
    { speaker: 'coordinator', text: 'Each resident has about two hours, and simple faults are usually found within the first hour.' },
    { speaker: 'resident', text: 'What should I bring with me on the day?' },
    { speaker: 'coordinator', text: 'Bring the broken item itself, its plug and lead, and a short note of when it stopped working.' },
    { speaker: 'resident', text: 'Should I bring the instruction book as well?' },
    { speaker: 'coordinator', text: 'It helps if you have it, but it is optional; the volunteer will check the model number on the base.' },
    { speaker: 'resident', text: 'Is there anything you would not take at the cafe?' },
    { speaker: 'coordinator', text: 'We turn away gas appliances. Gas equipment has to be handled by a qualified engineer, not on an open bench.' },
    { speaker: 'resident', text: 'What if the volunteer cannot find the problem?' },
    { speaker: 'coordinator', text: 'We write down what we checked, and suggest an engineer or a recycling point rather than guess a fix.' },
    { speaker: 'resident', text: 'When does the cafe meet each week?' },
    { speaker: 'coordinator', text: 'The cafe runs every Saturday morning, and the next session is this coming Saturday.' },
    { speaker: 'resident', text: 'Saturdays work for me. Do the volunteers work in shifts through the morning?' },
    { speaker: 'coordinator', text: 'Yes, each volunteer signs up for one two hour shift, and they rotate between the benches.' },
    { speaker: 'resident', text: 'That’s reassuring. I’ll fill the form tonight.' },
    { speaker: 'coordinator', text: 'Perfect. Please arrive ten minutes early so we can look over the kettle before the session starts.' },
    { speaker: 'resident', text: 'Thanks for explaining all this.' },
    { speaker: 'coordinator', text: 'You’re welcome. We’ll see you on Saturday morning.' },
  ],
  vocabulary: [
    {
      term: 'bench', phonetic: '/bentʃ/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '工作台，维修操作台', en: 'the table where volunteers examine and repair items' },
      usage: { zh: '可数名词；on the bench、repair bench。', en: 'Countable: on the bench, a repair bench.' },
      collocations: ['the repair bench', 'on the bench', 'match you to a bench'],
      example: { en: 'Items are opened safely on the repair bench.', zh: '物品在维修台上安全拆开。' },
      listening: { zh: '单音节，与 bench 同音，开头 /b/。', en: 'One syllable, opening /b/.' },
    },
    {
      term: 'category', phonetic: '/ˈkætəɡəri/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '类别，可修分组', en: 'the group an item belongs to for repair' },
      usage: { zh: '可数名词；accepted category、product category。', en: 'Countable: an accepted category, a product category.' },
      collocations: ['the accepted category', 'the electrical category', 'fall under a category'],
      example: { en: 'A kettle sits in the electrical category.', zh: '水壶属于电器类别。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkæt/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'components', phonetic: '/kəmˈpəʊnənts/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '部件，零件', en: 'the separate parts inside an appliance' },
      usage: { zh: '可数复数；spare components、larger components。单数 component。', en: 'Countable plural: spare components, larger components; the singular is component.' },
      collocations: ['spare components', 'larger components', 'replace the components'],
      example: { en: 'Larger components are priced before fitting.', zh: '大件部件先报价再更换。' },
      listening: { zh: '重音在第二音节 /ˈpəʊ/，结尾 /nts/。', en: 'Stress the second syllable; ending /nts/.' },
    },
    {
      term: 'donations', phonetic: '/dəʊˈneɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '捐款，自愿捐赠', en: 'voluntary money given toward the tools or running costs' },
      usage: { zh: '可数复数；welcome donations、accept donations。动词 donate。', en: 'Countable plural: welcome donations, accept donations; the verb is donate.' },
      collocations: ['voluntary donations', 'tool donations', 'accept donations'],
      example: { en: 'Donations toward the tools are welcome.', zh: '欢迎自愿捐款购置工具。' },
      listening: { zh: '重音在第二音节 /ˈneɪ/。', en: 'Stress the second syllable /ˈneɪ/.' },
    },
    {
      term: 'shift', phonetic: '/ʃɪft/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '值班班次', en: 'the period a volunteer works on the bench' },
      usage: { zh: '可数名词；on a shift、two hour shift。', en: 'Countable: on a shift, a two hour shift.' },
      collocations: ['the volunteer shift', 'a two hour shift', 'sign up for a shift'],
      example: { en: 'Each volunteer signs up for one shift.', zh: '每位志愿者登记一个班次。' },
      listening: { zh: '单音节，元音 /ɪ/，与 gift 押韵。', en: 'One syllable with /ɪ/, rhyming with gift.' },
    },
    {
      term: 'optional', phonetic: '/ˈɒpʃənl/', partOfSpeech: 'adj.', sentenceIndex: 27,
      meaning: { zh: '可选的，非必需的', en: 'not required, but useful if available' },
      usage: { zh: '与 compulsory 相对；optional item、optional extra。', en: 'The opposite of compulsory: an optional item, an optional extra.' },
      collocations: ['an optional item', 'optional extras', 'strictly optional'],
      example: { en: 'The instruction book is optional.', zh: '说明书不是必需材料。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɒp/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'qualified', phonetic: '/ˈkwɒlɪfaɪd/', partOfSpeech: 'adj.', sentenceIndex: 29,
      meaning: { zh: '有资质的，持证的', en: 'trained and certified to work on gas equipment' },
      usage: { zh: 'qualified engineer、qualified technician。动词 qualify。', en: 'A qualified engineer, a qualified technician; the verb is qualify.' },
      collocations: ['a qualified engineer', 'a qualified technician', 'qualified to work'],
      example: { en: 'Gas work needs a qualified engineer.', zh: '燃气活必须由持证工程师处理。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkwɒ/。', en: 'Three syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'leave my name', sentenceIndex: 2,
      meaning: { zh: '登记姓名', en: 'to write down one’s name for a booking' },
      usage: { zh: '登记预约时留下姓名；leave your name、leave your details。', en: 'Leave your name, leave your details.' },
      example: { en: 'Could I leave my name for the session?', zh: '我可以登记姓名占个位置吗？' },
    },
    {
      phrase: 'falls under', sentenceIndex: 7,
      meaning: { zh: '归入（某类别）', en: 'to belong to a stated group or category' },
      usage: { zh: '正式归类；fall under the category、fall under this group。', en: 'For classification: fall under the category, fall under this group.' },
      example: { en: 'A kettle falls under the electrical group.', zh: '水壶归入电器组。' },
    },
    {
      phrase: 'on site', sentenceIndex: 21,
      meaning: { zh: '在现场，馆内备有', en: 'kept available at the cafe rather than brought from home' },
      usage: { zh: '场所状语；tools on site、parts kept on site。', en: 'Locative: tools on site, parts kept on site.' },
      example: { en: 'Tools and parts are kept on site.', zh: '工具和零件都备在馆内。' },
    },
    {
      phrase: 'signs up for', sentenceIndex: 35,
      meaning: { zh: '报名登记（班次）', en: 'to register for a volunteer shift' },
      usage: { zh: '及物；sign up for a shift、sign up for the course。', en: 'Transitive: sign up for a shift, sign up for the course.' },
      example: { en: 'Volunteers sign up for one two hour shift.', zh: '志愿者登记两小时班次。' },
    },
    {
      phrase: 'look over', sentenceIndex: 37,
      meaning: { zh: '查看，过目（物品）', en: 'to examine an item briefly before the session' },
      usage: { zh: '及物短语动词；look over the kettle、look over the fault。', en: 'Transitive: look over the kettle, look over the fault.' },
      example: { en: 'We look over the kettle before the session.', zh: '开场前我们先查看水壶。' },
    },
    {
      phrase: 'turn away', sentenceIndex: 29,
      meaning: { zh: '拒收，谢绝', en: 'to refuse to take an item at the bench' },
      usage: { zh: '被动或主动；turn away gas appliances、be turned away。', en: 'Active or passive: turn away gas appliances, be turned away.' },
      example: { en: 'The cafe turns away gas appliances.', zh: '咖啡馆拒收燃气器具。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单字段就是定位线索', en: 'The form rows are your cues' },
      body: {
        zh: '听前把 Surname、Item brought、Accepted category、Parts contribution、Entry charge、Booking method 读一遍，预判每空填姓名、物品、类别、金额还是方式；听到字段名再落笔。',
        en: 'Read Surname, Item brought, Accepted category, Parts contribution, Entry charge and Booking method beforehand, and predict a name, item, category, amount or method. Write only at the matching cue.',
      },
    },
    {
      title: { zh: '分清可修与拒收', en: 'Separate accepted from refused' },
      body: {
        zh: '小台灯、水壶、烤面包机属于可修小电器；燃气器具必须持证工程师处理，馆内拒收。选项常把拒收类别的规则安到可修物品上，听时抓住 gas、qualified engineer 这类限定。',
        en: 'Small lamps, kettles and toasters are accepted electricals; gas appliances need a qualified engineer and are refused. Options often attach the refused rule to an accepted item; catch gas and qualified engineer as the limits.',
      },
    },
    {
      title: { zh: '费用题分清捐款与收费', en: 'Separate donations from charges' },
      body: {
        zh: 'five dollars 是零件分摊，入场本身免费，捐款是自愿投入工具。听到 till、donation、free 时判断这一项是不是必须交的钱，别把自愿捐款填成入场费。',
        en: 'Five dollars is the parts contribution, entry itself is free, and donations are voluntary tool funds. At till, donation and free, decide whether the money is mandatory; do not write a voluntary donation as the entry fee.',
      },
    },
  ],
};
