import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 30 · Part 1 — 办理家庭宽带（双人对话，加拿大 + 美式口音）。原创仿真材料，非官方真题。
 *
 * 对话顺序：姓名与地址 → 覆盖查询 → 套餐速率 → 安装费 → 路由器租用 → 上门时段、
 * 现场准备与费用包含项。填空块在前半段，单选块在后半段，题块顺序与录音顺序一致。
 */
export const test30Part1: ListeningLesson = {
  slug: 'test-30-part-1',
  part: 1,
  status: 'published',
  title: { zh: '装家庭宽带', en: 'Setting up home broadband' },
  summary: {
    zh: '新住户咨询并办理家庭宽带：核对姓名与地址，确认所在街区已覆盖，选择两百兆套餐，了解一次性安装费、路由器租用方式，预约最早的上门时段，并弄清上门前准备与费用包含范围。',
    en: 'A new resident checks availability and orders home broadband: name and address, fibre coverage for the district, a two-hundred-megabit plan, the one-off installation fee, router rental, the earliest visit slot, on-site preparation and what the fee includes.',
  },
  accent: { zh: '客服为加拿大口音，顾客为美式口音。', en: 'The adviser speaks with a Canadian accent and the customer with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Street address', cells: [[{ blank: 2 }, { text: ', number twelve' }]] },
        { lead: 'Coverage confirmed for district', cells: [[{ blank: 3 }]] },
        { lead: 'Package speed', cells: [[{ blank: 4 }, { text: ' megabits' }]] },
        { lead: 'One-off installation fee', cells: [[{ text: '$' }, { blank: 5 }]] },
        { lead: 'Router option', cells: [[{ blank: 6 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'How much does the router rental cost each month?',
          options: [
            { key: 'A', text: 'four dollars' },
            { key: 'B', text: 'five dollars' },
            { key: 'C', text: 'three dollars' },
          ],
        },
        {
          number: 8,
          stem: 'What is the earliest installation day?',
          options: [
            { key: 'A', text: 'the fourteenth' },
            { key: 'B', text: 'the twelfth' },
            { key: 'C', text: 'the thirtieth' },
          ],
        },
        {
          number: 9,
          stem: 'What should the customer keep accessible before the visit?',
          options: [
            { key: 'A', text: 'a spare gate key' },
            { key: 'B', text: 'a power socket near the wall' },
            { key: 'C', text: 'a phone line in every bedroom' },
          ],
        },
        {
          number: 10,
          stem: 'What does the installation fee cover?',
          options: [
            { key: 'A', text: 'the router purchase' },
            { key: 'B', text: 'all wiring runs to bedrooms' },
            { key: 'C', text: 'standard wiring to the main living room' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Marsh'], evidence: 2,
      explanation: {
        zh: '定位句 2：My surname is Marsh. That’s M, A, R, S, H。拼写题跟着字母逐个写；不要按发音误写成 Mash 或 Marshs。',
        en: 'Sentence 2: "My surname is Marsh. That’s M, A, R, S, H". Write the letters as they are spelled; do not guess Mash or Marshs from the sound.',
      },
    },
    {
      number: 2, accepted: ['Birch Road'], evidence: 4,
      explanation: {
        zh: '定位句 4：It’s number twelve, Birch Road, on the corner with the park。空后已印 number twelve，街道填 Birch Road；公园拐角是补充方位，不是路名。',
        en: 'Sentence 4: "It’s number twelve, Birch Road, on the corner with the park". Number twelve is printed, so fill Birch Road. The park corner is a location note, not the street name.',
      },
    },
    {
      number: 3, accepted: ['Westfield'], evidence: 8,
      explanation: {
        zh: '定位句 8：Westfield is on our fibre map, so coverage is confirmed for that address。确认覆盖的街区是 Westfield；句 6 的 cabinet 是系统查询对象，不是街区名。',
        en: 'Sentence 8: "Westfield is on our fibre map, so coverage is confirmed for that address". The covered district is Westfield. The cabinet in sentence 6 is what the system checks, not the district name.',
      },
    },
    {
      number: 4, accepted: ['200', 'two hundred'], spoken: 'two hundred', evidence: 12,
      explanation: {
        zh: '定位句 12：The mid option gives two hundred megabits per second。空后已印 megabits，填数字 two hundred；句 14 的 slower tier 是被放弃的低速档。',
        en: 'Sentence 12: "The mid option gives two hundred megabits per second". Megabits is printed, so write two hundred. The slower tier in sentence 14 is the rejected lower plan.',
      },
    },
    {
      number: 5, accepted: ['40', 'forty'], spoken: 'forty', evidence: 18,
      explanation: {
        zh: '定位句 18：Standard installation costs forty dollars。安装费四十；句 24 的 three dollars 是路由器月租，别混进安装费。',
        en: 'Sentence 18: "Standard installation costs forty dollars". The fee is forty. The three dollars in sentence 24 is the monthly router rental, not the installation charge.',
      },
    },
    {
      number: 6, accepted: ['rented'], evidence: 22,
      explanation: {
        zh: '定位句 22：Most new customers rent the router, so I’ve put rented on your order for now。路由器选项为租用；句 20 的 buy 是另一种被对照的选择。',
        en: 'Sentence 22: "Most new customers rent the router, so I’ve put rented on your order for now". The router option is rented. Buying in sentence 20 is the alternative being compared.',
      },
    },
    {
      number: 7, accepted: ['C'], evidence: 24,
      explanation: {
        zh: '定位句 24：The router rental is three dollars a month。月租三美元，对应 C。A 的四元、B 的五元均未出现。',
        en: 'Sentence 24: "The router rental is three dollars a month", matching C. Four and five dollars are not mentioned.',
      },
    },
    {
      number: 8, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：The earliest opening is the fourteenth of next month。最早装机日是十四号，对应 A。十二号与三十号全段未提及。',
        en: 'Sentence 26: "The earliest opening is the fourteenth of next month", matching A. The twelfth and thirtieth are never mentioned.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 28,
      explanation: {
        zh: '定位句 28：please keep a power socket near the wall accessible。上门前要让墙边电源插座可用，对应 B。A 的备用门钥匙、C 的卧室电话线均未提到。',
        en: 'Sentence 28: "please keep a power socket near the wall accessible", matching B. A spare gate key and a phone line in every bedroom are not mentioned.',
      },
    },
    {
      number: 10, accepted: ['C'], evidence: 32,
      explanation: {
        zh: '定位句 32：Standard wiring to the main living room is included in the installation fee。费用包含客厅标准布线，对应 C。A 的路由器买断另算，B 的卧室加长线路单独报价。',
        en: 'Sentence 32: "Standard wiring to the main living room is included in the installation fee", matching C. Buying the router in A is extra, and longer bedroom runs in B are quoted separately.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I want to check whether broadband is available at my new flat, and get it set up if it is.' },
    { speaker: 'adviser', text: 'Of course. Could I take your name and the address first?' },
    { speaker: 'customer', text: 'Sure. My surname is Marsh. That’s M, A, R, S, H.' },
    { speaker: 'adviser', text: 'M, A, R, S, H. Thank you. And the street address?' },
    { speaker: 'customer', text: 'It’s number twelve, Birch Road, on the corner with the park.' },
    { speaker: 'adviser', text: 'Birch Road, number twelve. I’ll look up the line in that district now.' },
    { speaker: 'customer', text: 'Is there any chance the area is still not covered? I moved here last week.' },
    { speaker: 'adviser', text: 'One moment while the system checks the cabinet.' },
    { speaker: 'adviser', text: 'Good news. Westfield is on our fibre map, so coverage is confirmed for that address.' },
    { speaker: 'customer', text: 'Great. What packages do you offer for a household of three?' },
    { speaker: 'customer', text: 'We stream films and work from home, so the old connection at my last place kept dropping.' },
    { speaker: 'adviser', text: 'For three users, the standard home package suits most families.' },
    { speaker: 'adviser', text: 'The mid option gives two hundred megabits per second, which handles several screens at once.' },
    { speaker: 'customer', text: 'Two hundred sounds fine. Is that the one people usually take?' },
    { speaker: 'adviser', text: 'It is our most ordered plan. The slower tier cannot support video calls on more than one device.' },
    { speaker: 'customer', text: 'Right, I’ll go with the two hundred package then.' },
    { speaker: 'adviser', text: 'Noted. Now the one-off installation fee, before we talk about equipment.' },
    { speaker: 'customer', text: 'Is the setup charged separately, or included in the monthly plan?' },
    { speaker: 'adviser', text: 'Standard installation costs forty dollars, and that covers the engineer visit and the wall wiring.' },
    { speaker: 'customer', text: 'Forty. Are there any extra charges on top of that?' },
    { speaker: 'adviser', text: 'No hidden fees beyond the router, which you can buy or rent.' },
    { speaker: 'customer', text: 'How does renting work, if that’s cheaper to start with?' },
    { speaker: 'adviser', text: 'Most new customers rent the router, so I’ve put rented on your order for now.' },
    { speaker: 'customer', text: 'What does the rental add each month, out of interest?' },
    { speaker: 'adviser', text: 'The router rental is three dollars a month, and the device stays ours until you buy it.' },
    { speaker: 'customer', text: 'Fine. When could an engineer actually come out? I’d like the earliest slot.' },
    { speaker: 'adviser', text: 'The earliest opening is the fourteenth of next month, in the morning between nine and twelve.' },
    { speaker: 'customer', text: 'The fourteenth works. I’ll be at home all that morning.' },
    { speaker: 'adviser', text: 'Before the visit, please keep a power socket near the wall accessible, so the engineer can fix the router there.' },
    { speaker: 'customer', text: 'Should I move any furniture out of the way?' },
    { speaker: 'adviser', text: 'A clear space beside the entry point is enough; the engineer brings his own tools and drill.' },
    { speaker: 'customer', text: 'What about the wiring inside the flat?' },
    { speaker: 'adviser', text: 'Standard wiring to the main living room is included in the installation fee; longer runs to bedrooms are quoted separately.' },
    { speaker: 'customer', text: 'I’ll keep that in mind. Anything else before I confirm?' },
    { speaker: 'adviser', text: 'The contract runs for twelve months, and the monthly plan starts once the router is connected.' },
    { speaker: 'customer', text: 'No problem. I’ll take the two hundred package, rented router, and the fourteenth morning slot.' },
    { speaker: 'adviser', text: 'I’ll send the booking summary to your email, and the engineer will call half an hour before arriving.' },
    { speaker: 'adviser', text: 'Once connected, the engineer tests the signal strength in each room before leaving.' },
    { speaker: 'customer', text: 'Thanks for sorting this out so quickly.' },
    { speaker: 'adviser', text: 'You’re welcome. Enjoy the new connection.' },
  ],
  vocabulary: [
    {
      term: 'coverage', phonetic: '/ˈkʌvərɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '信号覆盖，网络可达范围', en: 'the area where a service can reach customers' },
      usage: { zh: '不可数名词；coverage is confirmed、fibre coverage。动词 cover。', en: 'Uncountable: coverage is confirmed, fibre coverage; the verb is cover.' },
      collocations: ['network coverage', 'fibre coverage', 'check the coverage'],
      example: { en: 'The system confirms coverage for this district.', zh: '系统确认这个街区在覆盖范围内。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkʌv/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'package', phonetic: '/ˈpækɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '套餐，资费方案', en: 'a set plan of services offered at one price' },
      usage: { zh: '可数名词；home package、broadband package、choose a package。', en: 'Countable: a home package, a broadband package, choose a package.' },
      collocations: ['the home package', 'the two hundred package', 'a slower package'],
      example: { en: 'The mid package suits three users at home.', zh: '中档套餐适合家里三人使用。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpæk/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'megabits', phonetic: '/ˈmeɡəbɪts/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '兆比特（网速单位）', en: 'the unit measuring how much data moves per second' },
      usage: { zh: '常用复数；megabits per second，缩写 Mbps。', en: 'Usually plural: megabits per second, abbreviated Mbps.' },
      collocations: ['two hundred megabits', 'megabits per second', 'a lower megabit speed'],
      example: { en: 'The plan offers two hundred megabits per second.', zh: '该套餐提供每秒两百兆比特。' },
      listening: { zh: 'mega 读 /ˈmeɡə/，结尾 bits 读 /bɪts/。', en: 'Mega is /ˈmeɡə/, and bits ends /bɪts/.' },
    },
    {
      term: 'installation', phonetic: '/ˌɪnstəˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '安装（上门布线调试）', en: 'the visit and work that set up the service' },
      usage: { zh: '可数或不可数；installation fee、standard installation。动词 install。', en: 'Countable or uncountable: an installation fee, standard installation; the verb is install.' },
      collocations: ['the installation fee', 'standard installation', 'arrange an installation'],
      example: { en: 'The installation fee covers the engineer visit.', zh: '安装费包含工程师上门。' },
      listening: { zh: '重音在第四音节 /ˈleɪ/。', en: 'Stress the fourth syllable /ˈleɪ/.' },
    },
    {
      term: 'router', phonetic: '/ˈruːtə/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '路由器', en: 'the device that sends the broadband signal around the home' },
      usage: { zh: '可数名词；buy or rent the router、fix the router。', en: 'Countable: buy or rent the router, fix the router.' },
      collocations: ['the home router', 'rent the router', 'the router rental'],
      example: { en: 'The engineer fixes the router near the entry point.', zh: '工程师把路由器装在入户点旁。' },
      listening: { zh: '两个音节，重音在第一音节；英式也可读 /ˈraʊtə/。', en: 'Two syllables with first-syllable stress; some British speakers say /ˈraʊtə/.' },
    },
    {
      term: 'rental', phonetic: '/ˈrentl/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '租用，月租', en: 'the arrangement of paying to use a device rather than buy it' },
      usage: { zh: '可数或不可数；router rental、monthly rental。动词 rent。', en: 'Countable or uncountable: the router rental, a monthly rental; the verb is rent.' },
      collocations: ['the router rental', 'a monthly rental', 'rental charges'],
      example: { en: 'The rental adds three dollars each month.', zh: '租用每月多收三美元。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈrent/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'contract', phonetic: '/ˈkɒntrækt/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '合同，合约期', en: 'the formal agreement binding the service for a period' },
      usage: { zh: '名词重音第一音节；动词 contract 重音第二音节。', en: 'The noun stresses the first syllable; the verb stresses the second.' },
      collocations: ['a twelve month contract', 'sign a contract', 'the contract runs'],
      example: { en: 'The contract lasts for twelve months.', zh: '合约期为十二个月。' },
      listening: { zh: '名词与动词重音不同，靠句子成分判断。', en: 'Noun and verb differ in stress; use the grammar to tell them apart.' },
    },
  ],
  expressions: [
    {
      phrase: 'get it set up', sentenceIndex: 0,
      meaning: { zh: '把它办好，安装到位', en: 'to arrange and have the service installed and working' },
      usage: { zh: '被动结构 get something done；get it set up、get it connected。', en: 'Causative get plus past participle: get it set up, get it connected.' },
      example: { en: 'I want the broadband set up before the weekend.', zh: '我想周末前把宽带装好。' },
    },
    {
      phrase: 'on top of', sentenceIndex: 19,
      meaning: { zh: '在……之外（另加费用）', en: 'in addition to a stated charge' },
      usage: { zh: '费用语境；charges on top of that、extra on top of the fee。', en: 'In pricing: charges on top of that, extra on top of the fee.' },
      example: { en: 'No extra fees on top of the installation charge.', zh: '安装费之外没有额外收费。' },
    },
    {
      phrase: 'out of interest', sentenceIndex: 23,
      meaning: { zh: '随口问问，出于好奇', en: 'in case you happen to know, without committing to it' },
      usage: { zh: '口语插入语；放在问句前软化语气。', en: 'A spoken hedge before a question, softening the request.' },
      example: { en: 'What does the rental add, out of interest?', zh: '随口一问，租用每月加多少？' },
    },
    {
      phrase: 'power socket', sentenceIndex: 28,
      meaning: { zh: '电源插座', en: 'the wall outlet the engineer needs near the entry point' },
      usage: { zh: '可数；keep a power socket near the wall、the power socket accessible。', en: 'Countable: keep a power socket near the wall, the power socket accessible.' },
      example: { en: 'Keep the power socket near the wall accessible.', zh: '让墙边的电源插座保持可用。' },
    },
    {
      phrase: 'quoted separately', sentenceIndex: 32,
      meaning: { zh: '单独报价', en: 'given a separate estimate rather than included in the fee' },
      usage: { zh: '被动；be quoted separately、quote extra runs separately。', en: 'Passive: be quoted separately, quote extra runs separately.' },
      example: { en: 'Longer bedroom runs are quoted separately.', zh: '卧室加长线路单独报价。' },
    },
    {
      phrase: 'sorting this out', sentenceIndex: 38,
      meaning: { zh: '办妥，安排好', en: 'dealt with and arranged successfully' },
      usage: { zh: '短语动词过去分词；sort out the booking、sort out the problem。', en: 'Past participle of the phrasal verb: sort out the booking.' },
      example: { en: 'Thanks for sorting out the booking so fast.', zh: '谢谢你这么快把预约办妥。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单字段就是定位线索', en: 'The form rows are your cues' },
      body: {
        zh: '听前把 Surname、Street address、Coverage、Package speed、Installation fee、Router option 读一遍，预判每空填专有名词、地名还是数字；听到对应字段名再落笔。',
        en: 'Read Surname, Street address, Coverage, Package speed, Installation fee and Router option before listening, and predict whether each gap wants a name, place or number. Write only when the matching row cue appears.',
      },
    },
    {
      title: { zh: '两个数字分属不同项目', en: 'Keep the two numbers apart' },
      body: {
        zh: 'forty dollars 是一次性安装费，three dollars 是路由器月租；two hundred 是网速档位。听到数字先对照空格属于哪一行，别把月租填进安装费空。',
        en: 'Forty dollars is the one-off installation, three dollars is the monthly router rental, and two hundred is the speed tier. Match each number to its row before writing it down.',
      },
    },
    {
      title: { zh: '自我修正后以新说法为准', en: 'The corrected form wins' },
      body: {
        zh: '对话里顾客先提旧连接不稳，客服对照标准档再给出中档套餐。听到 actually、right、then 这类转折后，以最后确认的套餐、时段和设备选项为准。',
        en: 'The customer first describes the old unreliable connection, then the adviser compares tiers before the mid plan is chosen. After actually, right or then, follow the final confirmed plan, slot and device option.',
      },
    },
  ],
};
