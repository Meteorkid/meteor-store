import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 31 · Part 1 — 客户向搬家公司询价（双人对话，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 交易类对话：物品清单、楼层搬运、打包服务、保险范围与计价方式；中间穿插打包对象、
 * 餐桌与盆栽三类物品的处理规则（配对 8–10）。开场由客户直接说明搬家需求，不用机构问候。
 */
export const test31Part1: ListeningLesson = {
  slug: 'test-31-part-1',
  part: 1,
  status: 'published',
  title: { zh: '请搬家公司', en: 'Hiring a removal company' },
  summary: {
    zh: '客户为下周五的搬家向搬家公司询价：纸箱数量、大件家具、无电梯的楼层、打包服务收费、基础保险覆盖范围与按小时计价的方式，以及书籍、餐桌和盆栽三类物品各自的搬运处理。',
    en: 'A customer asks a removal firm for a quote for moving next Friday: the carton count, large furniture, the floor without a working lift, packing charges, what the basic insurance covers, hourly pricing, and how books, the dining table and potted plants are each handled.',
  },
  accent: { zh: '两位说话人均为新西兰口音。', en: 'Both speakers use New Zealand accents.' },
  speechRate: '+2%',
  cast: [
    { id: 'agent', label: 'AGENT', gender: 'female', voice: 'en-NZ-MollyNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Cartons listed for the move', cells: [[{ blank: 1 }]] },
        { lead: 'Large assembled item', cells: [[{ blank: 2 }]] },
        { lead: 'Customer’s flat is on the', cells: [[{ blank: 3 }, { text: ' floor' }]] },
        { lead: 'Packing service charged per', cells: [[{ blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'How does the company price the move?',
          options: [
            { key: 'A', text: 'A flat fee for each van load' },
            { key: 'B', text: 'By the hour for crew and van' },
            { key: 'C', text: 'By the number of individual items' },
          ],
        },
        {
          number: 6,
          stem: 'What does the standard insurance cover?',
          options: [
            { key: 'A', text: 'Damage caused before the move' },
            { key: 'B', text: 'Breakage that happens in transit' },
            { key: 'C', text: 'Loss of fragile antiques' },
          ],
        },
        {
          number: 7,
          stem: 'What does the agent advise about parking?',
          options: [
            { key: 'A', text: 'Reserve a bay near the front door' },
            { key: 'B', text: 'Park along the main road instead' },
            { key: 'C', text: 'Use the building’s loading lift' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which rule applies to each item? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'packed by the customer before arrival' },
        { key: 'B', text: 'moved separately in the trailer' },
        { key: 'C', text: 'covered by the standard insurance' },
        { key: 'D', text: 'carried upstairs by the crew' },
        { key: 'E', text: 'wrapped in blankets by the movers' },
      ],
      items: [
        { number: 8, text: 'the books' },
        { number: 9, text: 'the dining table' },
        { number: 10, text: 'the potted plants' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['forty', '40'], spoken: 'forty', evidence: 2,
      explanation: {
        zh: '定位句 2：there are about forty cartons in the hallway。题目问纸箱数量，填 forty；句 31 复述清单时再次提到 forty cartons，是同一条信息的确认。',
        en: 'Sentence 2: "there are about forty cartons in the hallway". The gap asks for the carton count, so write forty. Sentence 31 repeats the forty cartons to confirm the same figure.',
      },
    },
    {
      number: 2, accepted: ['wardrobe'], evidence: 4,
      explanation: {
        zh: '定位句 4：There’s a solid wooden wardrobe, plus two armchairs and a small dining table。大件且仍组装着的是衣柜；扶手椅和餐桌是伴随家具，不是题目所指的大件。',
        en: 'Sentence 4: "There’s a solid wooden wardrobe, plus two armchairs and a small dining table". The large assembled piece is the wardrobe; the armchairs and table are accompanying furniture.',
      },
    },
    {
      number: 3, accepted: ['third', '3rd'], evidence: 8,
      explanation: {
        zh: '定位句 8：The flat is on the third floor, and the lift in the block has been out of order all week。空后已印 floor，填序数词 third；句 9 只讲楼梯附加费，不改变楼层。',
        en: 'Sentence 8: "The flat is on the third floor, and the lift in the block has been out of order all week". Floor is printed, so write third. Sentence 9 only adds the stair surcharge.',
      },
    },
    {
      number: 4, accepted: ['box'], evidence: 13,
      explanation: {
        zh: '定位句 13：We offer a packing service, charged by the box。打包服务按纸箱计费；句 15 的单价 four dollars and fifty cents 是每箱费用，不是计费单位。',
        en: 'Sentence 13: "We offer a packing service, charged by the box". Packing is charged per box. The four dollars fifty in sentence 15 is the price per box, not the unit itself.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：We charge by the hour for the crew and the van, plus the stair surcharge and any packing you add。按小时计船员与车辆费用，对应 B。A 的每车一口价被句 20 的 flat fee per van 否定，C 的按件计价在对话中未出现。',
        en: 'Sentence 21: "We charge by the hour for the crew and the van, plus the stair surcharge and any packing you add". Hourly pricing matches B. A flat van fee is rejected in sentence 20, and pricing by item in C is never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：It covers breakage that happens in transit, not damage you caused beforehand。基础保险保运输途中破损，对应 B。A 的事前损坏在同句被否定，C 的易碎古董需要额外保险，句 19 有说明。',
        en: 'Sentence 17: "It covers breakage that happens in transit, not damage you caused beforehand". In-transit breakage matches B. Pre-existing damage in A is rejected in the same sentence, and fragile antiques in C need extra cover in sentence 19.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：You should reserve a bay right near the front door, so the van does not block the main road。建议在正门旁预留车位，对应 A。B 的停主路正是句 27 要避免的，C 的装卸电梯句 28 只是客户询问，不是建议。',
        en: 'Sentence 27: "You should reserve a bay right near the front door, so the van does not block the main road". Reserving a bay near the door matches A. Parking on the main road in B is what sentence 27 avoids, and the lift in C is only asked about in sentence 28.',
      },
    },
    {
      number: 8, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：The books are all packed in cartons already, so those we’ll handle ourselves before you arrive。书籍由客户提前自行装箱，对应 A。句 33 只说明封好后可直接搬上车，不改变打包责任。',
        en: 'Sentence 32: "The books are all packed in cartons already, so those we’ll handle ourselves before you arrive". Books are packed by the customer beforehand, matching A. Sentence 33 only notes sealed boxes can be loaded straight on.',
      },
    },
    {
      number: 9, accepted: ['E'], evidence: 34,
      explanation: {
        zh: '定位句 34：The dining table has glass legs, so I’d rather your crew wrapped it in blankets。餐桌由搬运工裹毯保护，对应 E。句 35 说必要时挂在拖车后面，那是运输方式，不是包装规则。',
        en: 'Sentence 34: "The dining table has glass legs, so I’d rather your crew wrapped it in blankets". The movers wrap the table, matching E. The trailer in sentence 35 is the transport option, not the packing rule.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 37,
      explanation: {
        zh: '定位句 37：Plants we move separately, standing upright in the trailer, and they aren’t covered by the standard breakage cover。盆栽单独放拖车直立运输，对应 B。C 的标准保险覆盖在同句被否定，D 的搬上楼是楼层服务，与盆栽无关。',
        en: 'Sentence 37: "Plants we move separately, standing upright in the trailer, and they aren’t covered by the standard breakage cover". Plants travel separately in the trailer, matching B. Standard cover in C is rejected in the same sentence, and carrying upstairs in D is a floor service.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi there, I need someone to move the contents of my flat next Friday, so I’m phoning around for quotes.' },
    { speaker: 'agent', text: 'Good morning, and thanks for calling Fernside Removals. I’ll take a few details and give you a rough estimate today.' },
    { speaker: 'customer', text: 'Great. I’ve counted most of what needs to go, and there are about forty cartons in the hallway.' },
    { speaker: 'agent', text: 'Forty cartons, noted. And any large furniture that won’t fit through the door?' },
    { speaker: 'customer', text: 'There’s a solid wooden wardrobe, plus two armchairs and a small dining table.' },
    { speaker: 'agent', text: 'The wardrobe is the heavy one, then. Is it already taken apart, or do we need to do that on site?' },
    { speaker: 'customer', text: 'It’s still assembled, I’m afraid. I haven’t got the tools to take it down myself.' },
    { speaker: 'agent', text: 'That’s fine, our crew carries the right tools, and we can dismantle it before loading.' },
    { speaker: 'customer', text: 'Good. The flat is on the third floor, and the lift in the block has been out of order all week.' },
    { speaker: 'agent', text: 'Third floor without a working lift. That means the crew carries everything down the stairs, and there’s a stairlift surcharge for that.' },
    { speaker: 'customer', text: 'I see. Will the stairs make the quote much higher?' },
    { speaker: 'agent', text: 'Not dramatically, but we do charge extra per flight of stairs when the lift cannot be used.' },
    { speaker: 'customer', text: 'Right. What about packing? I’ve kept most things in boxes, but the kitchen crockery is still loose.' },
    { speaker: 'agent', text: 'We offer a packing service, charged by the box. Our crew brings the paper and wraps each fragile item.' },
    { speaker: 'customer', text: 'How much does that add per box?' },
    { speaker: 'agent', text: 'It’s four dollars and fifty cents per carton for the wrapping, and you only pay for the ones we pack.' },
    { speaker: 'customer', text: 'Fine. Do I need to buy separate insurance for the move?' },
    { speaker: 'agent', text: 'The standard cover is included in the quote. It covers breakage that happens in transit, not damage you caused beforehand.' },
    { speaker: 'customer', text: 'So if a box is dropped on the van, that’s covered, but a cracked mug from before the move isn’t?' },
    { speaker: 'agent', text: 'Exactly. Theft from the locked van is also covered, but fragile antiques would need extra cover.' },
    { speaker: 'customer', text: 'How do you actually price the job? I assumed it was a flat fee per van.' },
    { speaker: 'agent', text: 'We charge by the hour for the crew and the van, plus the stair surcharge and any packing you add.' },
    { speaker: 'customer', text: 'Hourly, not per item. Does the clock stop when you load and unload?' },
    { speaker: 'agent', text: 'It runs from arrival at your old flat until the last item is placed in the new place.' },
    { speaker: 'customer', text: 'I should warn you the new flat is also up several flights, so that time will count there too.' },
    { speaker: 'agent', text: 'We’ll note that on the estimate, and the crew will judge the stairs on the day.' },
    { speaker: 'customer', text: 'One more thing. Can you advise on parking outside the building?' },
    { speaker: 'agent', text: 'You should reserve a bay right near the front door, so the van does not block the main road.' },
    { speaker: 'customer', text: 'Is there a loading lift in the new block I should mention?' },
    { speaker: 'agent', text: 'Send us the details later, but for today’s quote we assume normal door-to-door carrying.' },
    { speaker: 'customer', text: 'Now let me go through the items again, so the list matches what you have.' },
    { speaker: 'agent', text: 'Please do. Forty cartons, the wardrobe, two armchairs and the dining table.' },
    { speaker: 'customer', text: 'The books are all packed in cartons already, so those we’ll handle ourselves before you arrive.' },
    { speaker: 'agent', text: 'Good. Books are heavy, and if they’re sealed we can lift them straight onto the van.' },
    { speaker: 'customer', text: 'The dining table has glass legs, so I’d rather your crew wrapped it in blankets.' },
    { speaker: 'agent', text: 'We’ll pad that one carefully, and it travels in the trailer behind the main van if needed.' },
    { speaker: 'customer', text: 'What about the potted plants on the balcony? They’re quite tall.' },
    { speaker: 'agent', text: 'Plants we move separately, standing upright in the trailer, and they aren’t covered by the standard breakage cover.' },
    { speaker: 'customer', text: 'So I should keep the most fragile ones with me in the car?' },
    { speaker: 'agent', text: 'That’s the safest option. We can carry them, but you accept the risk for the foliage.' },
    { speaker: 'customer', text: 'Alright. Can you send the written estimate to my email this afternoon?' },
    { speaker: 'agent', text: 'Of course. I’ll include the hourly rate, the stair surcharge and the packing extras, and hold it for seven days.' },
    { speaker: 'customer', text: 'Thanks. I’ll compare one or two other firms before I confirm.' },
    { speaker: 'agent', text: 'That’s sensible. If you book with us, let us know the floor plan of the new flat in advance.' },
  ],
  vocabulary: [
    {
      term: 'estimate', phonetic: '/ˈestɪmət/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '估价，报价估算', en: 'a rough calculated cost before the work is done' },
      usage: { zh: '可数；give an estimate、written estimate。动词 estimate 重音在第二音节。', en: 'Countable: give an estimate, a written estimate. The verb stresses the second syllable.' },
      collocations: ['a rough estimate', 'the written estimate', 'hold the estimate'],
      example: { en: 'The firm will email a written estimate this afternoon.', zh: '公司下午会把书面估价发到邮箱。' },
      listening: { zh: '名词重音在第一音节 /ˈes/；不要与形容词 estimate 混读。', en: 'The noun stresses the first syllable; do not read it as the verb.' },
    },
    {
      term: 'cartons', phonetic: '/ˈkɑːtnz/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '纸箱，纸板箱', en: 'a cardboard box for packing goods' },
      usage: { zh: '可数；与 box 近义，carton 更强调搬运打包用的厚纸箱。', en: 'Countable, near-synonym of box; carton suggests a heavy packing box.' },
      collocations: ['forty cartons', 'a sealed carton', 'pack a carton'],
      example: { en: 'The books are sealed in cartons ready for loading.', zh: '书籍已封箱等待装车。' },
      listening: { zh: '两个音节，结尾 /tn/；不要读成 cartoon（卡通）。', en: 'Two syllables ending /tn/; do not confuse with cartoon.' },
    },
    {
      term: 'wardrobe', phonetic: '/ˈwɔːrdroʊb/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '衣柜', en: 'a large piece of furniture for hanging clothes' },
      usage: { zh: '可数；solid wooden wardrobe、assembled wardrobe。也可指“全部衣物”。', en: 'Countable: a wooden wardrobe; it can also mean someone’s clothes overall.' },
      collocations: ['a wooden wardrobe', 'dismantle the wardrobe', 'an assembled wardrobe'],
      example: { en: 'The crew will dismantle the wardrobe before loading it.', zh: '搬运工会先把衣柜拆开再装车。' },
      listening: { zh: '重音在第一音节 /ˈwɔː/；robe 部分弱读。', en: 'Stress the first syllable; robe is reduced.' },
    },
    {
      term: 'surcharge', phonetic: '/ˈsɜːrtʃɑːrdʒ/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '附加费，额外收费', en: 'an extra charge added to the main price' },
      usage: { zh: '可数；stair surcharge、pay a surcharge。', en: 'Countable: a stair surcharge, pay a surcharge.' },
      collocations: ['the stair surcharge', 'an extra surcharge', 'a fuel surcharge'],
      example: { en: 'The lift being out adds a stair surcharge to the quote.', zh: '电梯停用会在报价上加收楼梯附加费。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɜː/；charge 部分也清晰读出。', en: 'Two syllables with first-syllable stress; charge stays clear.' },
    },
    {
      term: 'transit', phonetic: '/ˈtrænzɪt/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '运输途中，转运过程', en: 'the period when goods are being carried from one place to another' },
      usage: { zh: '固定搭配 in transit；作名词不可数。', en: 'Fixed phrase in transit; the noun is uncountable here.' },
      collocations: ['in transit', 'damage in transit', 'loss in transit'],
      example: { en: 'The insurance covers breakage during transit.', zh: '保险覆盖运输途中的破损。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtræn/；与 transition 区分。', en: 'Two syllables, first stress; do not confuse with transition.' },
    },
    {
      term: 'trailer', phonetic: '/ˈtreɪlər/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '拖车，挂车', en: 'a separate cart pulled behind the main removal van' },
      usage: { zh: '可数；travel in the trailer、the main van。', en: 'Countable: travel in the trailer, the main van.' },
      collocations: ['the trailer behind the van', 'stand upright in the trailer'],
      example: { en: 'The tall plants travel upright in the trailer.', zh: '高盆栽直立放在拖车里运输。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtreɪ/；结尾 /lər/ 弱读。', en: 'Two syllables, first stress; the final /lər/ is weak.' },
    },
    {
      term: 'crockery', phonetic: '/ˈkrɒkəri/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '（成套）餐具，陶瓷器皿', en: 'plates, cups and dishes used for meals' },
      usage: { zh: '不可数；loose crockery、pack the crockery。', en: 'Uncountable: loose crockery, pack the crockery.' },
      collocations: ['the kitchen crockery', 'wrap the crockery', 'fragile crockery'],
      example: { en: 'The kitchen crockery is still loose and needs wrapping.', zh: '厨房餐具还散放着，需要包起来。' },
      listening: { zh: '三个音节，重音在第一音节；不要和 cracker 混淆。', en: 'Three syllables, first stress; do not confuse with cracker.' },
    },
  ],
  expressions: [
    {
      phrase: 'phoning around for', sentenceIndex: 0,
      meaning: { zh: '四处打电话询问（报价）', en: 'to contact several firms to compare prices' },
      usage: { zh: 'phone around 是可分短语；for 后接 quotes、prices。', en: 'Phone around is separable; for quotes or prices follows.' },
      example: { en: 'I’m phoning around for removal quotes this week.', zh: '我这周在打电话比较搬家报价。' },
    },
    {
      phrase: 'charge by the hour', sentenceIndex: 21,
      meaning: { zh: '按小时计费', en: 'priced according to the number of hours worked' },
      usage: { zh: '主动语态；charge by the hour，对照 charge by the box。', en: 'Active: charge by the hour, contrasting with charge by the box.' },
      example: { en: 'The crew and van are charged by the hour.', zh: '船员和车辆按小时计费。' },
    },
    {
      phrase: 'in transit', sentenceIndex: 17,
      meaning: { zh: '在运输途中', en: 'while goods are being moved between locations' },
      usage: { zh: '地点状语，常修饰 damage、loss、breakage。', en: 'Adverbial modifying damage, loss or breakage.' },
      example: { en: 'Breakage in transit is covered by the standard policy.', zh: '运输途中的破损在标准保单覆盖内。' },
    },
    {
      phrase: 'handle ourselves', sentenceIndex: 32,
      meaning: { zh: '自己处理，自行打包', en: 'to deal with something without the movers’ help' },
      usage: { zh: 'handle 后接事物；反身代词 ourselves 强调“自己做”。', en: 'Handle plus the object; the reflexive ourselves stresses doing it alone.' },
      example: { en: 'The books are packed, so we handle those ourselves.', zh: '书已装箱，我们自己处理那部分。' },
    },
    {
      phrase: 'wrapped it in blankets', sentenceIndex: 34,
      meaning: { zh: '用毯子裹住（家具）', en: 'to pad a piece of furniture with blankets for transport' },
      usage: { zh: 'wrap something in something；代词 it 放中间：wrap it in blankets。', en: 'wrap something in something; put the pronoun in the middle, wrap it in blankets.' },
      example: { en: 'The crew wrapped the table in blankets to protect the glass legs.', zh: '搬运工用毯子裹住餐桌保护玻璃腿。' },
    },
    {
      phrase: 'go through', sentenceIndex: 30,
      meaning: { zh: '逐项核对，过一遍', en: 'to check a list item by item' },
      usage: { zh: 'go through the list、go through the items；此处不是“穿过”。', en: 'Go through the list; here it means review, not cross through.' },
      example: { en: 'Let me go through the items again to match the list.', zh: '我再把物品逐项核对一遍。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格先记单位再填数字', en: 'Check the printed unit first' },
      body: {
        zh: '第 1、3、4 题空后分别没有单位提示，第 4 题问计费单位。听到 forty、third、box 时先确认行标题问的是数量、楼层还是单位，不要把单价 four dollars fifty 当成计费单位。',
        en: 'Rows 1, 3 and 4 ask for a count, a floor and a billing unit. When you hear forty, third or box, confirm whether the row wants a number, an ordinal or a unit; do not write the four-dollar fifty price as the unit.',
      },
    },
    {
      title: { zh: '区分保险范围与额外条款', en: 'Separate standard cover from extras' },
      body: {
        zh: '第 6 题只问标准保险。句 17 的 in transit 是标准覆盖，句 19 的古董额外保险、句 37 的盆栽不保都是附加条款；听到 extra cover、isn’t covered 时不要选进标准范围。',
        en: 'Item 6 asks only about standard cover. In transit in sentence 17 is standard; antique extra cover in sentence 19 and uncovered plants in sentence 37 are extras. On extra cover or isn’t covered, keep them out of the standard answer.',
      },
    },
    {
      title: { zh: '配对题分清打包与运输方式', en: 'Separate packing rule from transport' },
      body: {
        zh: '第 8–10 题三个物品各对应一条规则：书籍客户自装、餐桌裹毯、盆栽单独拖车。拖车既是盆栽的运输方式，也在句 35 被提作餐桌的备选；落笔前回到物品本身确认规则归属。',
        en: 'Items 8 to 10 pair one rule each: books self-packed, table blanket-wrapped, plants in the trailer. The trailer appears again as a table option in sentence 35, so return to the item before assigning the rule.',
      },
    },
  ],
};
