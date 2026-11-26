import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 48 · Part 2 — 游艇码头设施说明（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：泊位类型、潮汐影响、码头水电、废弃物规定（表格 11–14）→ 登记地点、加油方式、
 * 离港报告（单选 15–17）→ 深水船、取水与厨余垃圾的建议配对（配对 18–20）。
 * 开场用行动指令，不用 welcome to。
 */
export const test48Part2: ListeningLesson = {
  slug: 'test-48-part-2',
  part: 2,
  status: 'published',
  title: { zh: '游艇码头设施说明', en: 'Briefing at a marina' },
  summary: {
    zh: '码头管理员向到访船只讲解：短停船多用浮动泊位，码头头部潮汐改变水深；每个泊位供应淡水，厨房垃圾须装入密封黑袋投弃。访客在港务办公室登记，加油靠呼叫加油驳船，离港前须向办公室报告出发时间。深水船避开低潮浅水道，取水接软管到码头龙头，厨余垃圾入密封黑袋。',
    en: 'A manager briefs visiting boats: visiting craft take pontoon berths, where tide changes depth at the head. Every pontoon supplies fresh water; kitchen waste leaves in a black bag. Visitors register at the office, fuel comes from the called barge, and skippers report departure time. Deep-draft boats avoid the shallow channel, water connects to the tap, and galley waste goes in the black bag.',
  },
  accent: { zh: '管理员为英式口音，指令清晰，停顿留出记笔记时间。', en: 'The manager speaks with a British accent, gives clear instructions and pauses for note taking.' },
  cast: [
    { id: 'manager', label: 'MANAGER', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Feature', 'Detail'],
      rows: [
        { lead: 'Main visitor berth', cells: [[{ blank: 11 }]] },
        { lead: 'Tide changes the ', cells: [[{ blank: 12 }, { text: ' at the marina head' }]] },
        { lead: 'Service on every pontoon: ', cells: [[{ blank: 13 }]] },
        { lead: 'Kitchen waste goes into a sealed ', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'Where do visiting boat owners first register?',
          options: [
            { key: 'A', text: 'the fuel barge alongside the pier' },
            { key: 'B', text: 'the harbour office beside the main entrance' },
            { key: 'C', text: 'the pontoon gate after dark' },
          ],
        },
        {
          number: 16,
          stem: 'How do boats take on fuel during their stay?',
          options: [
            { key: 'A', text: 'carry petrol cans along the walkway' },
            { key: 'B', text: 'buy it from the laundry store' },
            { key: 'C', text: 'call the fuel barge on the radio' },
          ],
        },
        {
          number: 17,
          stem: 'What should a skipper report before leaving the marina?',
          options: [
            { key: 'A', text: 'the departure time to the office' },
            { key: 'B', text: 'the number of fish caught that day' },
            { key: 'C', text: 'the depth reading at the outer pier' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which advice applies to each situation? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'check the tide table before lunch' },
        { key: 'B', text: 'keep waste in the sealed black bag' },
        { key: 'C', text: 'connect the hose to the fresh water tap' },
        { key: 'D', text: 'avoid the shallow channel at low tide' },
        { key: 'E', text: 'book a temporary visitor berth in advance' },
      ],
      items: [
        { number: 18, text: 'a boat drawing deep water' },
        { number: 19, text: 'needing fresh water' },
        { number: 20, text: 'disposing of kitchen rubbish' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['pontoon'], evidence: 2,
      explanation: {
        zh: '定位句 2：Most short-stay boats take a pontoon berth, where the walkway floats with the water。主访客泊位是浮动泊位，填 pontoon；句 3 的泥岸泊位是另一选项。',
        en: 'Sentence 2: "Most short-stay boats take a pontoon berth, where the walkway floats". The main berth is the pontoon, so write pontoon. The mud berth in sentence 3 is the other option.',
      },
    },
    {
      number: 12, accepted: ['depth'], evidence: 4,
      explanation: {
        zh: '定位句 4：Tide matters most at the head of the marina, where the depth falls away quickly at low water。潮汐改变的是水深，填 depth；低水位是时间背景，不是所指变化项。',
        en: 'Sentence 4: "the depth falls away quickly at low water". The tide changes depth, so write depth. Low water is the timing background, not the changed item.',
      },
    },
    {
      number: 13, accepted: ['water'], evidence: 7,
      explanation: {
        zh: '定位句 7：Fresh water runs to every pontoon tap, and the electricity points have marked cable locks。每个泊位供应淡水，填 water；句内 electricity 是另一项设施，不是空格所指。',
        en: 'Sentence 7: "Fresh water runs to every pontoon tap". The supplied service is water, so write water. Electricity in the same sentence is another facility, not the gap item.',
      },
    },
    {
      number: 14, accepted: ['bag'], evidence: 9,
      explanation: {
        zh: '定位句 9：Kitchen waste has to leave the marina in a sealed black bag, ready for the skip。厨余垃圾装密封黑袋，填 bag；句 10 的废油布另投专用桶，不进此袋。',
        en: 'Sentence 9: "Kitchen waste has to leave the marina in a sealed black bag". The kitchen waste goes in a bag, so write bag. Oily rags in sentence 10 go to a separate drum, not this bag.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 16,
      explanation: {
        zh: '定位句 16：Registration opens at the harbour office beside the main entrance, not at the pontoon gate。登记地点是主入口旁的港务办公室，对应 B。加油驳船、泊位闸门都不是登记处。',
        en: 'Sentence 16: "Registration opens at the harbour office beside the main entrance". Registration is at the office, matching B. The barge and the gate are not registration points.',
      },
    },
    {
      number: 16, accepted: ['C'], evidence: 18,
      explanation: {
        zh: '定位句 18：There is no pump on the walkway; you call the fuel barge over the VHF, and it comes alongside。加油靠无线电呼叫驳船，对应 C。手提油桶、洗衣店购油均被排除。',
        en: 'Sentence 18: "you call the fuel barge over the VHF, and it comes alongside". Fuel comes from the barge, matching C. Carrying cans and buying at the laundry are ruled out.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 20,
      explanation: {
        zh: '定位句 20：Tell the office your departure time, so the overnight register matches the boats still afloat。离港前报告出发时间，对应 A。渔获数量、外码头水深读数与离港报告无关。',
        en: 'Sentence 20: "Tell the office your departure time". Skippers report their departure time, matching A. Fish caught and the pier depth reading are unrelated to the report.',
      },
    },
    {
      number: 18, accepted: ['D'], evidence: 26,
      explanation: {
        zh: '定位句 26：The shallow channel off the outer pier dries out early, so keep large boats clear of it。吃水深的船要避开低潮浅水道，选 D。',
        en: 'Sentence 26: "the shallow channel off the outer pier dries out early, so keep large boats clear of it". Deep-draft boats avoid the shallow channel, matching D.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 24,
      explanation: {
        zh: '定位句 24：If you need fresh water while tied up, connect the hose to the pontoon tap。需要淡水时把软管接到码头龙头，选 C。',
        en: 'Sentence 24: "connect the hose to the pontoon tap" for fresh water. Taking on water matches C.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：Kitchen rubbish from the galley must go into the sealed black bag for the skip。厨余垃圾留在密封黑袋中，选 B。',
        en: 'Sentence 25: galley rubbish "must go into the sealed black bag". Kitchen waste matches B.',
      },
    },
  ],
  transcript: [
    { speaker: 'manager', text: 'Before you step onto the pontoons, I’ll run through the marina rules for visiting boats.' },
    { speaker: 'manager', text: 'Our visitors arrive at the main entrance, and the harbour office sits beside it.' },
    { speaker: 'manager', text: 'Most short-stay boats take a pontoon berth, where the walkway floats with the water.' },
    { speaker: 'manager', text: 'The other option is a mud berth against the shore, which suits deeper draft hulls.' },
    { speaker: 'manager', text: 'Tide matters most at the head of the marina, where the depth falls away quickly at low water.' },
    { speaker: 'manager', text: 'Check the depth on the pilot chart before you walk the outer pier.' },
    { speaker: 'manager', text: 'At the pontoon, each boat connects to the services on the finger pier.' },
    { speaker: 'manager', text: 'Fresh water runs to every pontoon tap, and the electricity points have marked cable locks.' },
    { speaker: 'manager', text: 'Fuel is not stored on the pontoons, and we do not carry cans along the walkway.' },
    { speaker: 'manager', text: 'Kitchen waste has to leave the marina in a sealed black bag, ready for the skip.' },
    { speaker: 'manager', text: 'Anything oily, such as filter cloths, goes into the separate waste drum by the shed.' },
    { speaker: 'manager', text: 'Visitors who stay more than one night must register at the office before dusk.' },
    { speaker: 'manager', text: 'The register records the boat name, the home port and the number of people aboard.' },
    { speaker: 'manager', text: 'If your party changes after arrival, return to the office to update the entry.' },
    { speaker: 'manager', text: 'Now three short points on where things are and how they work.' },
    { speaker: 'manager', text: 'Where do visiting boat owners first register?' },
    { speaker: 'manager', text: 'Registration opens at the harbour office beside the main entrance, not at the pontoon gate.' },
    { speaker: 'manager', text: 'How do boats take on fuel during their stay?' },
    { speaker: 'manager', text: 'There is no pump on the walkway; you call the fuel barge over the VHF, and it comes alongside.' },
    { speaker: 'manager', text: 'What should a skipper report before leaving the marina?' },
    { speaker: 'manager', text: 'Tell the office your departure time, so the overnight register matches the boats still afloat.' },
    { speaker: 'manager', text: 'The desk also notes whether any visiting berth was vacated early.' },
    { speaker: 'manager', text: 'Let’s match four situations to the right advice from this briefing.' },
    { speaker: 'manager', text: 'A boat that draws deep water should plan its move around the tide.' },
    { speaker: 'manager', text: 'If you need fresh water while tied up, connect the hose to the pontoon tap.' },
    { speaker: 'manager', text: 'Kitchen rubbish from the galley must go into the sealed black bag for the skip.' },
    { speaker: 'manager', text: 'The shallow channel off the outer pier dries out early, so keep large boats clear of it.' },
    { speaker: 'manager', text: 'Visitor berths can be reserved through the office before you cross the bar.' },
    { speaker: 'manager', text: 'The fuel barge moves between pontoons when the call comes in.' },
    { speaker: 'manager', text: 'Waste oil and rags never share the bag with food scraps.' },
    { speaker: 'manager', text: 'Each pontoon has a cleat for the mooring lines, with room for two ropes on the outer side.' },
    { speaker: 'manager', text: 'The walkway boards can be slippery after rain, so take care near the ladder steps.' },
    { speaker: 'manager', text: 'Bathroom key cards are issued at registration and returned on departure.' },
    { speaker: 'manager', text: 'The laundry room sits behind the office, with two washers and a drying rack.' },
    { speaker: 'manager', text: 'The barbecue area on the upper deck is reserved for boat owners after the evening meal.' },
    { speaker: 'manager', text: 'Please do not tie mooring lines to the railings along the pontoon edge.' },
    { speaker: 'manager', text: 'Dogs on the pontoons must stay on a short lead and clear the walkway after themselves.' },
    { speaker: 'manager', text: 'The cafe terrace opens onto the outer pier and closes at dusk.' },
    { speaker: 'manager', text: 'Before dark, return any deck chairs to the store behind the office.' },
    { speaker: 'manager', text: 'If a small vessel slips its mooring in the wind, alert the office before chasing it.' },
    { speaker: 'manager', text: 'That covers the basics. Tie up safely, and check the tide before you leave the berth.' },
  ],
  vocabulary: [
    {
      term: 'pontoon', phonetic: '/pɒnˈtuːn/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '浮动泊位，浮桥码头', en: 'the floating walkway and berth tied to the pier' },
      usage: { zh: '可数；pontoon berth、pontoon tap。', en: 'Countable: pontoon berth, pontoon tap.' },
      collocations: ['the pontoon berth', 'every pontoon', 'the pontoon gate'],
      example: { en: 'Most short-stay boats take a pontoon berth.', zh: '短停船只多用浮动泊位。' },
      listening: { zh: '双音节，重音在第二音节 /ˈtuː/，长元音。', en: 'Two syllables, second-syllable stress, long /uː/.' },
    },
    {
      term: 'depth', phonetic: '/depθ/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '水深（潮水变化的指标）', en: 'the distance from the water surface to the seabed' },
      usage: { zh: '不可数；water depth、fall away in depth。', en: 'Uncountable: water depth.' },
      collocations: ['the depth falls away', 'check the depth', 'water depth'],
      example: { en: 'The depth falls away quickly at low water.', zh: '低水位时水深快速变浅。' },
      listening: { zh: '单音节，结尾 /pθ/ 辅音丛，/θ/ 咬舌。', en: 'One syllable, final /pθ/ cluster, dental /θ/.' },
    },
    {
      term: 'water', phonetic: '/ˈwɔːtə/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '淡水（泊位供应的设施）', en: 'the fresh supply connected at every berth' },
      usage: { zh: '不可数；fresh water、pontoon tap water。', en: 'Uncountable: fresh water.' },
      collocations: ['fresh water', 'the pontoon tap', 'the water hose'],
      example: { en: 'Fresh water runs to every pontoon tap.', zh: '每个泊位龙头都通淡水。' },
      listening: { zh: '双音节，重音在第一音节；英式 /ˈwɔː/。', en: 'Two syllables, first stress, British /ˈwɔː/.' },
    },
    {
      term: 'bag', phonetic: '/bæɡ/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '垃圾袋（密封投放厨余）', en: 'the sealed sack for kitchen waste' },
      usage: { zh: '可数；black bag、sealed bag、waste bag。', en: 'Countable: sealed black bag.' },
      collocations: ['the sealed black bag', 'the kitchen waste bag', 'a waste bag'],
      example: { en: 'Kitchen waste leaves the marina in a sealed black bag.', zh: '厨余垃圾装密封黑袋离开码头。' },
      listening: { zh: '单音节，短元音 /æ/，结尾 /ɡ/。', en: 'One syllable, short /æ/, final /ɡ/.' },
    },
    {
      term: 'register', phonetic: '/ˈredʒɪstə/', partOfSpeech: 'v.', sentenceIndex: 11,
      meaning: { zh: '登记（访客到港记录）', en: 'to enter boat details in the visitor record' },
      usage: { zh: '动词；register at the office、register the entry。名词同形。', en: 'Verb: register at the office. The noun shares the form.' },
      collocations: ['register at the office', 'the register records', 'register the boat'],
      example: { en: 'Registration opens at the harbour office.', zh: '登记在港务办公室办理。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈredʒ/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'barge', phonetic: '/bɑːdʒ/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '加油驳船（靠泊供油）', en: 'the floating vessel that brings fuel alongside' },
      usage: { zh: '可数；fuel barge、call the barge。', en: 'Countable: fuel barge.' },
      collocations: ['the fuel barge', 'call the barge', 'the barge comes alongside'],
      example: { en: 'You call the fuel barge over the radio.', zh: '你通过无线电呼叫加油驳船。' },
      listening: { zh: '单音节，长元音 /ɑː/，结尾 /dʒ/。', en: 'One syllable, long /ɑː/, final /dʒ/.' },
    },
    {
      term: 'departure', phonetic: '/dɪˈpɑːtʃə/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '离港（离开码头的时间）', en: 'the act of leaving the marina' },
      usage: { zh: '可数；departure time、on departure。动词 depart。', en: 'Countable: departure time. The verb is depart.' },
      collocations: ['the departure time', 'before departure', 'on departure'],
      example: { en: 'Tell the office your departure time before you leave.', zh: '离港前把出发时间告知办公室。' },
      listening: { zh: '双音节，重音在第二音节 /ˈpɑː/。', en: 'Two syllables with second-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'run through', sentenceIndex: 0,
      meaning: { zh: '逐项讲一遍（规则说明）', en: 'to explain the rules point by point' },
      usage: { zh: '及物；run through the rules、run through the briefing。', en: 'Transitive: run through the rules.' },
      example: { en: 'I’ll run through the marina rules for visiting boats.', zh: '我给到访船只逐项讲码头规则。' },
    },
    {
      phrase: 'draws deep water', sentenceIndex: 23,
      meaning: { zh: '吃水深（船底入水深度大）', en: 'needs a deep channel to float safely' },
      usage: { zh: '动词短语；a boat draws deep water。', en: 'Verb phrase: a boat draws deep water.' },
      example: { en: 'A boat that draws deep water plans around the tide.', zh: '吃水深的船按潮汐安排行动。' },
    },
    {
      phrase: 'connects to', sentenceIndex: 6,
      meaning: { zh: '接到（码头设施上）', en: 'joined to the pontoon service fitting' },
      usage: { zh: '被动短语；connected to the tap、connect to the lock。', en: 'Passive: connected to the tap.' },
      example: { en: 'Each boat connects to the services on the finger pier.', zh: '每条船接到指形码头的设施上。' },
    },
    {
      phrase: 'clear of', sentenceIndex: 26,
      meaning: { zh: '避开，不靠近（危险水域）', en: 'kept away from a shallow or risky area' },
      usage: { zh: '介词短语；keep clear of the channel、stay clear of。', en: 'Prepositional phrase: keep clear of the channel.' },
      example: { en: 'Keep large boats clear of the shallow channel.', zh: '大船避开浅水道。' },
    },
    {
      phrase: 'slips its mooring', sentenceIndex: 39,
      meaning: { zh: '挣脱缆绳（走锚）', en: 'to break loose from the lines in the wind' },
      usage: { zh: '动词短语；slip its mooring、slip the mooring lines。', en: 'Verb phrase: slip its mooring.' },
      example: { en: 'If a vessel slips its mooring in the wind, alert the office.', zh: '船在风中走锚时通知办公室。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题按设施类别记答案', en: 'Note each gap by facility category' },
      body: {
        zh: '第 11–14 题分别是泊位类型、潮汐变化项、码头服务、垃圾容器。听到 berth、walkway 记泊位，depth、low water 记水深，fresh water、tap 记供水，black bag、sealed 记垃圾袋；题干已给 Feature 引导词，不要重复写。',
        en: 'Items 11–14 are berth type, tide variable, pontoon service and waste container. Note the berth after berth or walkway, depth after depth or low water, water after fresh water or tap, and the bag after black bag or sealed. Do not repeat printed leads.',
      },
    },
    {
      title: { zh: '单选区分地点、方式与报告内容', en: 'Separate place, method and report' },
      body: {
        zh: '第 15 题登记地点是港务办公室；第 16 题加油方式是无线电呼叫驳船，手提油桶被禁止；第 17 题离港报告内容是出发时间。驳船、闸门、洗衣店、渔获、水深读数都是干扰项。',
        en: 'Item 15 registration is the harbour office; item 16 fuel comes from the called barge, and cans are banned; item 17 the report is the departure time. The barge, gate, laundry, fish and depth reading are distractors.',
      },
    },
    {
      title: { zh: '配对题把情境对到建议动作', en: 'Match situations to advice actions' },
      body: {
        zh: '三道配对：深水船避开低潮浅水道；需要淡水接软管到龙头；厨余垃圾入密封黑袋。提前订泊位、午前查潮汐表没有对应情境。听到 deep water、shallow channel 选 D，听到 fresh water、hose、tap 选 C，听到 kitchen rubbish、black bag 选 B。',
        en: 'The three matches: deep-draft boats avoid the shallow channel; water use connects to the tap; galley waste goes in the black bag. Booking ahead and checking the tide table have no matching situation. Pick D at deep water and channel, C at hose and tap, B at rubbish and black bag.',
      },
    },
  ],
};
