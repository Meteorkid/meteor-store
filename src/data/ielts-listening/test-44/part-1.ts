import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 44 · Part 1 — 预约修车（双人对话，澳式口音）。原创仿真材料，非官方真题。
 *
 * 对话顺序：故障描述、零件来源、报价上限（前填空块 1–3）→ 主故障、零件标准、取车时间
 * （单选 4–6）→ 保修期限、取车时刻、附带检查、自带物品（后填空块 7–10）。
 * 开场由顾客直陈需求，不用机构问候加 How can I help you。
 */
export const test44Part1: ListeningLesson = {
  slug: 'test-44-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预约修车', en: 'Booking a bike repair service' },
  summary: {
    zh: '一名顾客预约自行车维修：前轮刹车蹭碟、踏板发僵，店里更换磨损件时沿用与原车一致的原厂零件，报价上限设为八十美元；主问题是刹车片磨损而非车架断裂，零件用原厂件，周五下午可取车。零件保修十二个月，取车时段从五点开始，附带清洗检查链条，顾客需自带车锁。',
    en: 'A customer books a bike repair: the front brakes rub and the pedal feels stiff. Wear parts match the original build with manufacturer stock, and the quote cap is eighty dollars. The main fault is worn brake pads; parts are original stock, and collection is Friday afternoon. Parts carry a twelve month warranty, the slot starts at five, the chain is checked, and the customer brings their own lock.',
  },
  accent: { zh: '接待技师与顾客均为澳式口音。', en: 'The mechanic and the customer both speak with Australian accents.' },
  speechRate: '+3%',
  cast: [
    { id: 'mechanic', label: 'MECHANIC', gender: 'female', voice: 'en-AU-NatashaNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Reported fault: rubbing on the front', cells: [[{ blank: 1 }]] },
        { lead: 'Replacement parts follow the original', cells: [[{ blank: 2 }, { text: ' specification' }]] },
        { lead: 'Maximum repair quote: $', cells: [[{ blank: 3 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'What is the main problem with the bike?',
          options: [
            { key: 'A', text: 'The chain slips under load' },
            { key: 'B', text: 'The brakes rub because the pads are worn' },
            { key: 'C', text: 'The puncture will not hold air' },
          ],
        },
        {
          number: 5,
          stem: 'Which replacement parts does the shop fit?',
          options: [
            { key: 'A', text: 'Second-hand stock from old bikes' },
            { key: 'B', text: 'Original manufacturer parts matching the build' },
            { key: 'C', text: 'Generic third-party copies' },
          ],
        },
        {
          number: 6,
          stem: 'When can the customer collect the bike?',
          options: [
            { key: 'A', text: 'Friday afternoon' },
            { key: 'B', text: 'Saturday morning' },
            { key: 'C', text: 'Monday morning' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Warranty on replacement parts: ', cells: [[{ blank: 7 }, { text: ' months' }]] },
        { lead: 'Collection time: ', cells: [[{ blank: 8 }, { text: ' o’clock' }]] },
        { lead: 'Free check included: the ', cells: [[{ blank: 9 }]] },
        { lead: 'Customer should bring their own ', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['brakes'], evidence: 2,
      explanation: {
        zh: '定位句 2：The brakes are rubbing on the front wheel, and the pedal feels stiff when I push off。前轮蹭碟的是刹车，填 brakes。踏板发僵是附带描述，不是故障主体。',
        en: 'Sentence 2: "The brakes are rubbing on the front wheel", so fill brakes. The stiff pedal is a secondary detail, not the main fault.',
      },
    },
    {
      number: 2, accepted: ['manufacturer'], evidence: 7,
      explanation: {
        zh: '定位句 7：For wear items we use manufacturer parts that match the original build, not generic copies。零件沿用原厂规格，填 manufacturer。generic copies 是被排除的做法。',
        en: 'Sentence 7: wear items use "manufacturer parts that match the original build", so fill manufacturer. Generic copies are the rejected alternative.',
      },
    },
    {
      number: 3, accepted: ['eighty', '80'], evidence: 12,
      explanation: {
        zh: '定位句 12：Let me put the cap at eighty dollars, including the labour on top of parts。报价上限八十美元，填 eighty。超出上限前须先打电话征得同意。',
        en: 'Sentence 12: the cap is set at "eighty dollars", so fill eighty. The shop must ring before going past that limit.',
      },
    },
    {
      number: 4, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：the brakes rub because the pads are worn, rather than a broken frame。主故障是刹车片磨损导致蹭碟，对应 B。链条打滑、补不住气在讲解中未出现。',
        en: 'Sentence 15: the brakes rub "because the pads are worn", matching B. Chain slip and a failing puncture are not mentioned.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：for safety parts we fit original manufacturer stock, and we explain why a copy pad would wear unevenly。安全件用原厂库存，对应 B。二手拆车件、通用拷贝均被否定。',
        en: 'Sentence 17: safety parts get "original manufacturer stock", matching B. Second-hand parts and generic copies are ruled out.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 20,
      explanation: {
        zh: '定位句 20：I cannot make Saturday morning, so Friday afternoon suits me better。取车定在周五下午，对应 A。周六上午顾客来不了，周一未提及。',
        en: 'Sentence 20: Saturday morning does not work, so "Friday afternoon suits me better", matching A. Monday is not mentioned.',
      },
    },
    {
      number: 7, accepted: ['twelve', '12'], evidence: 23,
      explanation: {
        zh: '定位句 23：The replacement parts carry a twelve month warranty against faults in the fitting。零件保修十二个月，填 twelve。',
        en: 'Sentence 23: replacement parts carry a "twelve month warranty", so fill twelve.',
      },
    },
    {
      number: 8, accepted: ['five', '5'], evidence: 27,
      explanation: {
        zh: '定位句 27：The collection slot runs from five o’clock, and the workshop stays open until seven。取车时段五点开始，填 five。七点是关门时间，不是取车时刻。',
        en: 'Sentence 27: the collection slot starts at "five o’clock", so fill five. Seven is the closing time, not the pickup point.',
      },
    },
    {
      number: 9, accepted: ['chain'], evidence: 30,
      explanation: {
        zh: '定位句 30：Could you give the chain a clean and check it for wear while it is here? 附带清洗检查的是链条，填 chain。',
        en: 'Sentence 30: the chain gets "a clean and check for wear", so fill chain.',
      },
    },
    {
      number: 10, accepted: ['lock'], evidence: 33,
      explanation: {
        zh: '定位句 33：Bring your own lock if you use one, and a pump if you need to keep the tyres topped up。顾客需自带车锁，填 lock。打气筒是可选物品。',
        en: 'Sentence 33: bring "your own lock", so fill lock. A pump is optional rather than required.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I need to book my bike in for a repair, and I wanted to check a few details first.' },
    { speaker: 'mechanic', text: 'Sure, tell me what the bike is doing, and I will note it down.' },
    { speaker: 'customer', text: 'The brakes are rubbing on the front wheel, and the pedal feels stiff when I push off.' },
    { speaker: 'mechanic', text: 'Brakes rubbing can mean the pads have worn thin or the cable has stretched.' },
    { speaker: 'customer', text: 'Can you look at the front wheel wobble as well? It seems loose over the bumps.' },
    { speaker: 'mechanic', text: 'We will check the hub and the spoke tension while the wheel is off.' },
    { speaker: 'customer', text: 'What kind of replacement parts do you fit when something needs changing?' },
    { speaker: 'mechanic', text: 'For wear items we use manufacturer parts that match the original build, not generic copies.' },
    { speaker: 'customer', text: 'So the brake pads would be the original make, not a cheaper brand.' },
    { speaker: 'mechanic', text: 'That is right. We keep the original specification so the bike brakes as it did new.' },
    { speaker: 'customer', text: 'Is there an upper limit on what the repair can cost before you call me?' },
    { speaker: 'mechanic', text: 'You can set a maximum quote, and we do not go past it without your approval.' },
    { speaker: 'customer', text: 'Let me put the cap at eighty dollars, including the labour on top of parts.' },
    { speaker: 'mechanic', text: 'Eighty dollars noted. If the fault turns out deeper, we ring before spending more.' },
    { speaker: 'customer', text: 'What exactly is the main problem with the bike from what you hear so far?' },
    { speaker: 'mechanic', text: 'From the description, the brakes rub because the pads are worn, rather than a broken frame.' },
    { speaker: 'customer', text: 'Do you ever fit second-hand parts to bring the price down?' },
    { speaker: 'mechanic', text: 'No, for safety parts we fit original manufacturer stock, and we explain why a copy pad would wear unevenly.' },
    { speaker: 'customer', text: 'When will it be ready if I drop it off on Wednesday?' },
    { speaker: 'mechanic', text: 'Most brake work finishes by Friday afternoon, unless a part has to come from outside.' },
    { speaker: 'customer', text: 'I cannot make Saturday morning, so Friday afternoon suits me better.' },
    { speaker: 'mechanic', text: 'We will aim to have it ready by Friday afternoon, and text you when the wheel is back on.' },
    { speaker: 'customer', text: 'What warranty comes with the repair once I pick it up?' },
    { speaker: 'mechanic', text: 'The replacement parts carry a twelve month warranty against faults in the fitting.' },
    { speaker: 'customer', text: 'Does that cover labour as well as the parts on the same repair?' },
    { speaker: 'mechanic', text: 'Parts are covered for twelve months, and our fitting work is guaranteed for the same period.' },
    { speaker: 'customer', text: 'What time on Friday should I come around to collect?' },
    { speaker: 'mechanic', text: 'The collection slot runs from five o’clock, and the workshop stays open until seven.' },
    { speaker: 'customer', text: 'Five o’clock works for me, as I finish work near the shop.' },
    { speaker: 'mechanic', text: 'Is there anything else you would like checked on the bike?' },
    { speaker: 'customer', text: 'Could you give the chain a clean and check it for wear while it is here?' },
    { speaker: 'mechanic', text: 'We will service the chain along with the brake check, and adjust the gears if they stick.' },
    { speaker: 'customer', text: 'Should I bring anything with me when I drop the bike off?' },
    { speaker: 'mechanic', text: 'Bring your own lock if you use one, and a pump if you need to keep the tyres topped up.' },
    { speaker: 'customer', text: 'I will leave the front light attached, but I will take the saddle bag off at home.' },
    { speaker: 'mechanic', text: 'Valuables such as the bag and computer are best kept with you, for security.' },
    { speaker: 'customer', text: 'How do I pay once the repair is done?' },
    { speaker: 'mechanic', text: 'Card or contactless at the desk, and we email a receipt after the work.' },
    { speaker: 'customer', text: 'Is the diagnosis free before I commit to the booking?' },
    { speaker: 'mechanic', text: 'The first inspection is included, and any quote holds for seven days after that.' },
    { speaker: 'customer', text: 'Good. I will bring it in on Wednesday morning.' },
    { speaker: 'mechanic', text: 'Fine. I will reserve the bay, and list the brakes, hub and chain on the job card.' },
    { speaker: 'customer', text: 'Thanks for going through the details with me.' },
    { speaker: 'mechanic', text: 'No problem. See you Wednesday, and bring the lock if you have one.' },
  ],
  vocabulary: [
    {
      term: 'brakes', phonetic: '/breɪks/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '刹车，制动装置', en: 'the parts that slow or stop the bike' },
      usage: { zh: '可数复数；front brakes、brake pads、the brakes rub。', en: 'Plural countable: front brakes; the singular is brake.' },
      collocations: ['the brakes rub', 'the front brakes', 'brake pads'],
      example: { en: 'The brakes are rubbing on the front wheel.', zh: '前轮刹车蹭碟。' },
      listening: { zh: '单音节，结尾 /ks/ 清辅音。', en: 'One syllable with a final /ks/ cluster.' },
    },
    {
      term: 'manufacturer', phonetic: '/ˌmænjuˈfæktʃərə/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '原厂，制造商（配件来源）', en: 'the original maker whose parts match the build' },
      usage: { zh: '可数；manufacturer parts、original manufacturer stock。形容词 manufactured。', en: 'Countable: manufacturer parts; the adjective is manufactured.' },
      collocations: ['manufacturer parts', 'original manufacturer stock', 'the original manufacturer'],
      example: { en: 'We use manufacturer parts that match the build.', zh: '我们沿用与原车一致的原厂零件。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈfæk/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'quote', phonetic: '/kwəʊt/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '报价，维修估价', en: 'the estimated price agreed before the repair' },
      usage: { zh: '可数；a maximum quote、set a quote、hold a quote。动词同形。', en: 'Countable: maximum quote; the verb is also quote.' },
      collocations: ['a maximum quote', 'set the cap', 'the quote holds'],
      example: { en: 'You can set a maximum quote before we start.', zh: '开工前你可以设定报价上限。' },
      listening: { zh: '单音节，与 coat 押韵。', en: 'One syllable, rhyming with coat.' },
    },
    {
      term: 'pads', phonetic: '/pædz/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '刹车片（摩擦件）', en: 'the brake blocks that press on the wheel' },
      usage: { zh: '可数复数；worn pads、copy pad、brake pads。', en: 'Plural countable: worn brake pads; the singular is pad.' },
      collocations: ['worn pads', 'brake pads', 'a copy pad'],
      example: { en: 'The brakes rub because the pads are worn.', zh: '刹车蹭碟是因为刹车片磨损。' },
      listening: { zh: '单音节，结尾 /dz/ 浊辅音。', en: 'One syllable with a voiced /dz/ ending.' },
    },
    {
      term: 'warranty', phonetic: '/ˈwɒrənti/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '保修（配件故障承诺）', en: 'the guarantee covering faults in the fitted parts' },
      usage: { zh: '可数；a twelve month warranty、parts warranty、under warranty。', en: 'Countable: twelve month warranty; compare guarantee.' },
      collocations: ['a twelve month warranty', 'the parts warranty', 'under warranty'],
      example: { en: 'The parts carry a twelve month warranty.', zh: '零件保修十二个月。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈwɒ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'chain', phonetic: '/tʃeɪn/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '链条（传动件）', en: 'the metal loop that transfers pedal power' },
      usage: { zh: '可数；clean the chain、check the chain for wear。', en: 'Countable: clean and check the chain.' },
      collocations: ['the chain', 'clean the chain', 'chain wear'],
      example: { en: 'Could you clean and check the chain for wear?', zh: '能否把链条清洗检查一下磨损？' },
      listening: { zh: '单音节，与 rain 押韵。', en: 'One syllable, rhyming with rain.' },
    },
    {
      term: 'lock', phonetic: '/lɒk/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '车锁（自带安全件）', en: 'the device used to secure the bike' },
      usage: { zh: '可数；your own lock、bring a lock、put on the lock。', en: 'Countable: your own lock; the verb is also lock.' },
      collocations: ['your own lock', 'bring the lock', 'the bike lock'],
      example: { en: 'Bring your own lock if you use one.', zh: '如果你用车锁，请自带。' },
      listening: { zh: '单音节，与 rock 押韵。', en: 'One syllable, rhyming with rock.' },
    },
  ],
  expressions: [
    {
      phrase: 'drop it off', sentenceIndex: 18,
      meaning: { zh: '送修，把车留下', en: 'to leave the bike at the workshop for repair' },
      usage: { zh: '可分开；drop the bike off、drop it off。反义 collect。', en: 'Separable: drop the bike off; the opposite is collect.' },
      example: { en: 'When will it be ready if I drop it off on Wednesday?', zh: '周三送来的话什么时候能取？' },
    },
    {
      phrase: 'go past', sentenceIndex: 11,
      meaning: { zh: '超出（报价上限）', en: 'to spend more than the agreed cap' },
      usage: { zh: '及物；go past the quote、go past the limit。', en: 'Transitive: go past the quote or limit.' },
      example: { en: 'We do not go past it without your approval.', zh: '未经同意我们不会超出上限。' },
    },
    {
      phrase: 'worn thin', sentenceIndex: 3,
      meaning: { zh: '磨薄，磨损变弱', en: 'thinned by use so it no longer grips well' },
      usage: { zh: '形容词短语；pads worn thin、worn through。', en: 'Adjective phrase: pads worn thin; worn through is stronger.' },
      example: { en: 'The pads may have worn thin on the front wheel.', zh: '前轮刹车片可能已经磨薄。' },
    },
    {
      phrase: 'topped up', sentenceIndex: 33,
      meaning: { zh: '补足（胎压）', en: 'filled back to the recommended level' },
      usage: { zh: '被动短语；tyres topped up、top up the tyres。', en: 'Passive: tyres topped up; the active verb is top up.' },
      example: { en: 'Bring a pump to keep the tyres topped up.', zh: '带打气筒把胎压补足。' },
    },
    {
      phrase: 'kept with you', sentenceIndex: 35,
      meaning: { zh: '随身保管（贵重物品）', en: 'carried by the owner rather than left at the shop' },
      usage: { zh: '被动短语；valuables kept with you、keep the bag with you。', en: 'Passive: valuables kept with you.' },
      example: { en: 'The bag and computer are best kept with you.', zh: '车包和电脑最好随身带。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记先分故障、零件与报价', en: 'Split notes into fault, parts and quote' },
      body: {
        zh: '前三空依次是刹车、原厂、八十美元。听到 rubbing、pads 记故障，manufacturer、original specification 记零件来源，quote、cap、dollars 记金额；题干已给 specification、$ 等引导词，不要重复写。',
        en: 'The first three blanks are brakes, manufacturer and eighty. Note the fault after rubbing or pads, the parts source after manufacturer or original specification, and the money after quote, cap or dollars. Do not repeat printed leads such as specification and $.',
      },
    },
    {
      title: { zh: '单选抓主故障与被排除做法', en: 'Pick the main fault and rejected options' },
      body: {
        zh: '第 4 题主故障是刹车片磨损蹭碟；第 5 题零件用原厂库存，二手拆车件和通用拷贝都被否定；第 6 题取车周五下午，周六上午顾客来不了。听到 rather than、no、copy 这类词时在选项旁做标记。',
        en: 'Item 4 is worn pads rubbing; item 5 uses original manufacturer stock, with second-hand and generic copies ruled out; item 6 collects Friday afternoon, since Saturday morning fails. Mark options after rather than, no and copy.',
      },
    },
    {
      title: { zh: '后段笔记按保修、时刻、附带检查记', en: 'Note warranty, time and extra check' },
      body: {
        zh: '后四空依次是十二个月、五点、链条、车锁。warranty、months 对应保修，collection slot、o’clock 对应时刻，clean the chain 对应附带检查，own lock 对应自带物品；打气筒只是可选，不要写进必备项。',
        en: 'The last four blanks are twelve, five, chain and lock. Warranty and months mark the cover, collection slot and o’clock the time, clean the chain the extra check, and own lock the required item. A pump is optional, not a required item.',
      },
    },
  ],
};
