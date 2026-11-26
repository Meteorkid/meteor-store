import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 26 · Part 1 — 报修洗衣机（双人对话，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 生活服务类对话：机型与故障现象、保修期判定、上门时段、备用设备、费用预估，
 * 以及洗衣机、洗碗机、烘干机三类设备的受理方式（配对 8–10）。
 */
export const test26Part1: ListeningLesson = {
  slug: 'test-26-part-1',
  part: 1,
  status: 'published',
  title: { zh: '报修洗衣机', en: 'Reporting a broken washing machine' },
  summary: {
    zh: '用户电话报修不排水的洗衣机：说明机型与故障现象，确认仍在保修期内，预约周二上午上门，了解备用烘干机与泵件费用预估，并弄清洗碗机、烘干机各自的受理安排。',
    en: 'A customer reports a washing machine that will not drain: stating the model and symptom, confirming the warranty, booking a Tuesday morning visit, learning about the loan dryer and pump estimate, and how dishwashers and dryers are handled.',
  },
  accent: { zh: '两位说话人均为新西兰口音。', en: 'Both speakers use New Zealand accents.' },
  speechRate: '+2%',
  cast: [
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-NZ-MitchellNeural' },
    { id: 'agent', label: 'AGENT', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Booking item', 'Detail'],
      rows: [
        { lead: 'Machine type', cells: [[{ blank: 1 }]] },
        { lead: 'Fault: water in drum will not', cells: [[{ blank: 2 }]] },
        { lead: 'Warranty: repair is still', cells: [[{ blank: 3 }]] },
        { lead: 'Visit slot: Tuesday', cells: [[{ blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What appliance can the customer borrow during the repair?',
          options: [
            { key: 'A', text: 'A loan washing machine for the repair period' },
            { key: 'B', text: 'A small dryer for damp clothes' },
            { key: 'C', text: 'No loan appliance of any kind' },
          ],
        },
        {
          number: 6,
          stem: 'What estimate is given for the pump repair?',
          options: [
            { key: 'A', text: 'Inspection free, and the pump part costs about eighty dollars' },
            { key: 'B', text: 'The full repair is covered with no part charge' },
            { key: 'C', text: 'A fixed inspection fee of forty dollars' },
          ],
        },
        {
          number: 7,
          stem: 'What should the customer do before the technician arrives?',
          options: [
            { key: 'A', text: 'Leave the laundry inside the drum' },
            { key: 'B', text: 'Empty the drum, unplug the machine and clear the front filter' },
            { key: 'C', text: 'Move the machine to the service centre' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'How is each appliance handled? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'inspected on the same visit if time allows' },
        { key: 'B', text: 'booked with a separate technician for the vent system' },
        { key: 'C', text: 'covered by the current warranty booking' },
        { key: 'D', text: 'swapped for a loan unit while it is apart' },
        { key: 'E', text: 'cleaned by the customer before arrival' },
      ],
      items: [
        { number: 8, text: 'washing machine' },
        { number: 9, text: 'dishwasher' },
        { number: 10, text: 'tumble dryer' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['front-loader'], evidence: 2,
      explanation: {
        zh: '定位句 2：It’s Rob, and it’s a front-loader, the white one in the kitchen。机型是前开门洗衣机，填 front-loader；句 4 的型号贴纸是补充信息，不是机型类别。',
        en: 'Sentence 2: "it’s a front-loader, the white one in the kitchen", so fill front-loader. The serial sticker in sentence 4 is extra detail, not the machine type.',
      },
    },
    {
      number: 2, accepted: ['drain'], evidence: 6,
      explanation: {
        zh: '定位句 6：the water just sits in the drum and won’t drain。故障是桶内积水排不出去，填 drain；句 7 的 pump 是故障部件，不是症状动词。',
        en: 'Sentence 6: "the water just sits in the drum and won’t drain", so fill drain. The pump in sentence 7 is the faulty part, not the symptom verb.',
      },
    },
    {
      number: 3, accepted: ['under warranty'], evidence: 11,
      explanation: {
        zh: '定位句 11：the repair stays under warranty。维修仍在保修范围内，填 under warranty；句 13 的泵件另计是保修之外的费用说明。',
        en: 'Sentence 11: "the repair stays under warranty", so fill under warranty. The separate pump part in sentence 13 is the cost beyond warranty cover.',
      },
    },
    {
      number: 4, accepted: ['morning'], evidence: 16,
      explanation: {
        zh: '定位句 16：Tuesday morning works best. I’ll be at home before noon for that slot。上门时段是周二上午，填 morning；句 15 的周四下午是被放弃的另一时段。',
        en: 'Sentence 16: "Tuesday morning works best", so fill morning. The Thursday afternoon slot in sentence 15 is the rejected alternative.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：We don’t keep loan washers at this branch, but we can lend a small dryer for damp clothes。可借的是小型烘干机，对应 B。A 的借用洗衣机与原文相反；C 说完全不借设备，与烘干机不符。',
        en: 'Sentence 19: "we don’t keep loan washers at this branch, but we can lend a small dryer for damp clothes", matching B. A contradicts the washer statement, and C ignores the dryer.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：The inspection is free under warranty, and the pump itself usually runs to about eighty dollars。保修内免上门检测，泵件约八十元，对应 A。B 的全免部件费、C 的四十元检测费均未出现。',
        en: 'Sentence 21: "The inspection is free under warranty, and the pump itself usually runs to about eighty dollars", matching A. Full part cover and a forty-dollar inspection fee are not stated.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：Empty the drum, unplug the machine, and pull it out enough to reach the back panel。上门前要清空桶内衣物、拔电源并留出背面操作空间，对应 B。A 把衣物留在桶里与原文相反；C 送修中心没有提到。',
        en: 'Sentence 25: "Empty the drum, unplug the machine, and pull it out enough to reach the back panel", matching B. Leaving laundry in the drum in A contradicts this, and moving it to the centre in C is not mentioned.',
      },
    },
    {
      number: 8, accepted: ['C'], evidence: 37,
      explanation: {
        zh: '定位句 37：The front-loader, drain pump suspected, Tuesday morning slot, warranty still active。本次报修的洗衣机在当前保修预约内，对应 C。D 的换机备用在句 19 已被否定。',
        en: 'Sentence 37: the "front-loader, drain pump suspected, Tuesday morning slot, warranty still active", matching C. The loan swap in D was ruled out in sentence 19.',
      },
    },
    {
      number: 9, accepted: ['A'], evidence: 33,
      explanation: {
        zh: '定位句 33：Note it on the call sheet if you like, and the engineer will take a look if time allows。洗碗机若有故障，可在同一次上门时顺带查看，对应 A。',
        en: 'Sentence 33: "the engineer will take a look if time allows", matching A.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：Dryer faults are booked with a different technician, since the vent system needs its own check。烘干机要另约技师检查排风系统，对应 B。',
        en: 'Sentence 35: "Dryer faults are booked with a different technician, since the vent system needs its own check", matching B.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, my washing machine has stopped draining water, and I need to book a repair.' },
    { speaker: 'agent', text: 'Hello, thanks for calling the appliance service line. Could I take your name and the model first?' },
    { speaker: 'customer', text: 'It’s Rob, and it’s a front-loader, the white one in the kitchen.' },
    { speaker: 'agent', text: 'Front-loader, noted. Could you spell the model if it’s on the door label?' },
    { speaker: 'customer', text: 'It reads WF forty two, and there’s a serial sticker inside the drum.' },
    { speaker: 'agent', text: 'Fine. Tell me what happens when you run a cycle.' },
    { speaker: 'customer', text: 'It fills and tumbles, but at the end the water just sits in the drum and won’t drain.' },
    { speaker: 'agent', text: 'So the drum turns, but the pump is not clearing the water. Have you checked the filter at the bottom?' },
    { speaker: 'customer', text: 'I did. The filter was clean, and there was no blockage I could see.' },
    { speaker: 'agent', text: 'That points to the drain pump rather than a loose hose. How old is the machine?' },
    { speaker: 'customer', text: 'I bought it two and a half years ago, so I’m not sure it’s still covered.' },
    { speaker: 'agent', text: 'Let me check the warranty. Your purchase date puts it just inside the two year cover, so the repair stays under warranty.' },
    { speaker: 'customer', text: 'That’s a relief. Does that mean no labour charge at all?' },
    { speaker: 'agent', text: 'Labour is covered, but any new pump part is listed separately on the estimate.' },
    { speaker: 'customer', text: 'Right. When can someone come out?' },
    { speaker: 'agent', text: 'We have Tuesday morning between eight and twelve, or Thursday afternoon from one to five.' },
    { speaker: 'customer', text: 'Tuesday morning works best. I’ll be at home before noon for that slot.' },
    { speaker: 'agent', text: 'Then I’ll reserve the Tuesday morning visit. The engineer calls half an hour before arrival.' },
    { speaker: 'customer', text: 'Is there a loan machine we can use while it’s apart?' },
    { speaker: 'agent', text: 'We don’t keep loan washers at this branch, but we can lend a small dryer for damp clothes.' },
    { speaker: 'customer', text: 'Only the dryer, then. How much do you expect the pump repair to cost?' },
    { speaker: 'agent', text: 'The inspection is free under warranty, and the pump itself usually runs to about eighty dollars.' },
    { speaker: 'customer', text: 'Eighty for the part, plus what if they find something else?' },
    { speaker: 'agent', text: 'The engineer calls before fitting anything beyond the pump, so you approve the extra first.' },
    { speaker: 'customer', text: 'Good. What should I do before the visit?' },
    { speaker: 'agent', text: 'Empty the drum, unplug the machine, and pull it out enough to reach the back panel.' },
    { speaker: 'customer', text: 'Should I leave the drainage hose attached?' },
    { speaker: 'agent', text: 'Yes, keep the hose in the sink, and clear the floor around the front filter.' },
    { speaker: 'customer', text: 'Anything about clothes left inside?' },
    { speaker: 'agent', text: 'Take out all laundry, and wipe the door seal with a dry cloth before we arrive.' },
    { speaker: 'customer', text: 'Got it. Do you handle dishwashers on the same visit?' },
    { speaker: 'agent', text: 'The same engineer looks at dishwashers, but a separate booking is needed if that machine faults.' },
    { speaker: 'customer', text: 'My dishwasher drains slowly too, but it’s still usable for now.' },
    { speaker: 'agent', text: 'Note it on the call sheet if you like, and the engineer will take a look if time allows.' },
    { speaker: 'customer', text: 'What about the tumble dryer in the corner?' },
    { speaker: 'agent', text: 'Dryer faults are booked with a different technician, since the vent system needs its own check.' },
    { speaker: 'customer', text: 'Fair. Let me confirm the details once more.' },
    { speaker: 'agent', text: 'Sure. The front-loader, drain pump suspected, Tuesday morning slot, warranty still active.' },
    { speaker: 'customer', text: 'And the loan dryer only, not a loan washer.' },
    { speaker: 'agent', text: 'That’s right. You’ll get a text with the reference and the engineer’s number.' },
    { speaker: 'customer', text: 'Thanks for sorting this out.' },
    { speaker: 'agent', text: 'You’re welcome. We’ll see you Tuesday.' },
  ],
  vocabulary: [
    {
      term: 'drain', phonetic: '/dreɪn/', partOfSpeech: 'v.', sentenceIndex: 6,
      meaning: { zh: '排出（积水），放掉', en: 'to let water flow out of a machine or container' },
      usage: { zh: '动词；drain the water、won’t drain。名词 drain 指排水口。', en: 'Verb: drain the water, won’t drain; the noun drain is the outlet.' },
      collocations: ['drain the water', 'the drain pump', 'won’t drain'],
      example: { en: 'The drum will not drain after the spin cycle.', zh: '脱水结束后桶里的水排不出去。' },
      listening: { zh: '单音节，与 train 押韵，开头 /dr/。', en: 'One syllable rhyming with train, opening /dr/.' },
    },
    {
      term: 'filter', phonetic: '/ˈfɪltə/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '过滤器，滤网', en: 'a mesh that catches hair and small objects' },
      usage: { zh: '可数；the filter at the bottom、clean the filter。', en: 'Countable: the filter at the bottom, clean the filter.' },
      collocations: ['the drain filter', 'clean the filter', 'the filter cover'],
      example: { en: 'Check the filter for coins or loose buttons.', zh: '检查滤网里有没有硬币或松扣。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈfɪl/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'warranty', phonetic: '/ˈwɒrənti/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '保修（单）', en: 'a manufacturer’s promise to repair faults free for a period' },
      usage: { zh: '可数；under warranty、still covered by warranty。', en: 'Countable: under warranty, still covered by warranty.' },
      collocations: ['under warranty', 'the two year warranty', 'warranty cover'],
      example: { en: 'The pump repair stays under warranty.', zh: '泵件维修仍在保修内。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈwɒ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'labour', phonetic: '/ˈleɪbə/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '人工，工时费', en: 'the charge for a technician’s work, separate from parts' },
      usage: { zh: '不可数；labour is covered、labour charge。美式拼 labor。', en: 'Uncountable: labour is covered, labour charge; American spelling labor.' },
      collocations: ['labour cost', 'labour charge', 'cover the labour'],
      example: { en: 'Labour is included, but the part is listed separately.', zh: '工时费包含在内，零件另计。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈleɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'estimate', phonetic: '/ˈestɪmət/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '费用预估，估价单', en: 'a rough expected cost given before the repair' },
      usage: { zh: '名词读 /ˈestɪmət/；动词 estimate 读 /ˈestɪmeɪt/。', en: 'Noun /ˈestɪmət/; the verb estimate is /ˈestɪmeɪt/.' },
      collocations: ['the repair estimate', 'give an estimate', 'a rough estimate'],
      example: { en: 'The engineer sends an estimate before extra work.', zh: '额外维修前工程师会给估价。' },
      listening: { zh: '名词重音在第一音节，不要与动词读音混淆。', en: 'The noun stresses the first syllable; do not use the verb sound.' },
    },
    {
      term: 'seal', phonetic: '/siːl/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '门封胶圈，密封圈', en: 'the rubber ring around the machine door' },
      usage: { zh: '可数；door seal、door seal gasket。', en: 'Countable: door seal, door seal gasket.' },
      collocations: ['the door seal', 'a rubber seal', 'wipe the seal'],
      example: { en: 'Wipe the door seal with a dry cloth.', zh: '用干布擦一下门封胶圈。' },
      listening: { zh: '单音节，与 feel 押韵。', en: 'One syllable rhyming with feel.' },
    },
    {
      term: 'vent', phonetic: '/vent/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '排风口，通风管', en: 'the opening or hose that carries warm air outdoors' },
      usage: { zh: '可数；vent system、dryer vent。', en: 'Countable: vent system, dryer vent.' },
      collocations: ['the vent system', 'the dryer vent', 'clear the vent'],
      example: { en: 'The dryer vent needs its own safety check.', zh: '烘干机排风管需要单独安全检查。' },
      listening: { zh: '单音节，与 sent 押韵。', en: 'One syllable rhyming with sent.' },
    },
  ],
  expressions: [
    {
      phrase: 'book a repair', sentenceIndex: 0,
      meaning: { zh: '预约维修', en: 'to arrange a technician to fix an appliance' },
      usage: { zh: 'book a repair、book a visit；名词 repair booking。', en: 'book a repair, book a visit; the noun is a repair booking.' },
      example: { en: 'I’m ringing to book a repair for the washer.', zh: '我打电话来预约洗衣机维修。' },
    },
    {
      phrase: 'points to', sentenceIndex: 9,
      meaning: { zh: '表明，指向（故障原因）', en: 'to suggest a likely cause or source' },
      usage: { zh: '诊断用语；the fault points to the pump。', en: 'Diagnostic phrase: the fault points to the pump.' },
      example: { en: 'The slow drain points to a blocked filter.', zh: '排水缓慢说明滤网可能堵塞。' },
    },
    {
      phrase: 'under warranty', sentenceIndex: 11,
      meaning: { zh: '在保修期内', en: 'still covered by the manufacturer’s guarantee' },
      usage: { zh: 'be under warranty、still under warranty；反义 out of warranty。', en: 'be under warranty, still under warranty; the opposite is out of warranty.' },
      example: { en: 'The machine is still under warranty for two years.', zh: '机器仍在两年保修期内。' },
    },
    {
      phrase: 'runs to', sentenceIndex: 21,
      meaning: { zh: '（费用）达到，约为', en: 'to amount to an expected cost' },
      usage: { zh: '报价语境；the part runs to about eighty dollars。', en: 'In quoting: the part runs to about eighty dollars.' },
      example: { en: 'The replacement pump runs to roughly eighty dollars.', zh: '替换泵件大约八十元。' },
    },
    {
      phrase: 'take a look', sentenceIndex: 33,
      meaning: { zh: '查看，检查一下', en: 'to examine an item briefly' },
      usage: { zh: '口语短语；take a look at the dishwasher、take a look if time allows。', en: 'Colloquial: take a look at the dishwasher, if time allows.' },
      example: { en: 'The engineer will take a look if he has time.', zh: '工程师有空就会看一下。' },
    },
    {
      phrase: 'separate booking', sentenceIndex: 31,
      meaning: { zh: '另约一次工单', en: 'a distinct appointment for another appliance' },
      usage: { zh: 'separate 修饰 booking；make a separate booking。', en: 'Separate modifies booking: make a separate booking.' },
      example: { en: 'The dryer needs a separate booking.', zh: '烘干机需要另约工单。' },
    },
  ],
  tips: [
    {
      title: { zh: '保修与零件费用分开记', en: 'Keep warranty and parts apart' },
      body: {
        zh: '报修对话常把保修范围和另计费用混在一起：工时保修内、泵件另计。听到 labour、part、estimate 时分清哪项免费、哪项报价，避免把零件费当成全免。',
        en: 'Repair calls mix warranty cover with extra costs: labour is covered, the pump part is listed. At labour, part and estimate, sort what is free and what is quoted; do not treat the part as free.',
      },
    },
    {
      title: { zh: '时段选择听被放弃项', en: 'Note the rejected time slot' },
      body: {
        zh: '两个上门时段先并列给出，顾客选其中一个。听到 Tuesday morning、Thursday afternoon 时都记下，再跟确认句判断最终选哪一个，别把先出现的时段填进空。',
        en: 'Two slots are given before the choice. Note Tuesday morning and Thursday afternoon, then follow the confirmation to pick the final one; do not write down the first slot heard.',
      },
    },
    {
      title: { zh: '配对按设备名定位', en: 'Match by the appliance name' },
      body: {
        zh: '配对三项依次讲洗衣机、洗碗机、烘干机。先在设备名旁记下受理方式：保修内、顺带查看、另约技师，再去对应选项；不要听到 technician 就填第一行。',
        en: 'The three appliances appear in order: washer, dishwasher, dryer. Note the handling beside each name: warranty, same-visit check, separate technician, then match; do not put technician on the first line.',
      },
    },
  ],
};
