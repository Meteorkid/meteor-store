import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 29 · Part 2 — 共享办公空间参观（单人独白，澳式口音）。原创仿真材料，非官方真题。
 *
 * 参观顺序：工位类型与订房系统 → 打印额度与访客登记 → 月度活动（笔记 11–14）→
 * 专属工位、提前订房时限、访客手续、月费包含项（单选 15–18）→ 桌面管家与社区经理分工（配对 19–20）。
 * 开场用参观前提示，不用 welcome to。
 */
export const test29Part2: ListeningLesson = {
  slug: 'test-29-part-2',
  part: 2,
  status: 'published',
  title: { zh: '共享办公空间参观', en: 'A tour of a co-working space' },
  summary: {
    zh: '导览员带看共享办公空间：基础会员用每日可选的流动工位，专属工位按月固定保留，会议室通过手机会员应用预订；每月两百页打印额度，访客须在前台签到等待会员下来接；月度活动是最后一个周四的工作坊。随后解释专属工位、七天提前订房、访客手续和月费包含项，并配对桌面管家与社区经理的分工。',
    en: 'The guide tours a co-working space: basic members claim a daily hot desk, a dedicated desk is reserved monthly, rooms book through the member app, the quota is two hundred pages, visitors sign in at the front desk, and the last-Thursday workshop is the monthly event. Singles cover dedicated desks, the seven-day limit, visitor procedure and fee coverage; the match pairs host and manager.',
  },
  accent: { zh: '导览员为澳式口音，参观节奏平稳，分区之间有停顿。', en: 'The guide speaks with an Australian accent at a steady tour pace, pausing between zones.' },
  speechRate: '+3%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Basic membership: a', cells: [[{ blank: 11 }, { text: ' desk' }]] },
        { lead: 'Meeting room booked through the member', cells: [[{ blank: 12 }]] },
        { lead: 'Printing quota:', cells: [[{ blank: 13 }, { text: ' pages per month' }]] },
        { lead: 'Monthly community event: a', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What is a dedicated desk?',
          options: [
            { key: 'A', text: 'A permanent table reserved for one member' },
            { key: 'B', text: 'A shared table claimed each morning' },
            { key: 'C', text: 'A table inside a quiet phone booth' },
          ],
        },
        {
          number: 16,
          stem: 'How far in advance can meeting rooms be booked?',
          options: [
            { key: 'A', text: 'Three days' },
            { key: 'B', text: 'Seven days' },
            { key: 'C', text: 'One month' },
          ],
        },
        {
          number: 17,
          stem: 'What must a visitor do before entering the space?',
          options: [
            { key: 'A', text: 'Pay a day fee at the desk' },
            { key: 'B', text: 'Sign in and wait for the member' },
            { key: 'C', text: 'Leave bags in the locker' },
          ],
        },
        {
          number: 18,
          stem: 'What does the standard monthly fee cover?',
          options: [
            { key: 'A', text: 'Private meeting room hire' },
            { key: 'B', text: 'Desk access, printing quota and kitchen use' },
            { key: 'C', text: 'Outside printer repairs' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which duty matches each staff role? Choose the correct letter, A–D.',
      options: [
        { key: 'A', text: 'keeps the shared kitchen stocked' },
        { key: 'B', text: 'books meeting rooms for members' },
        { key: 'C', text: 'runs the monthly social events' },
        { key: 'D', text: 'repairs the printers' },
      ],
      items: [
        { number: 19, text: 'the desk host' },
        { number: 20, text: 'the community manager' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['hot'], evidence: 2,
      explanation: {
        zh: '定位句 2：The basic membership books a hot desk, which you can claim anywhere each morning。基础会员是流动工位，填 hot。',
        en: 'Sentence 2: basic membership books "a hot desk", claimed anywhere each morning, so fill hot.',
      },
    },
    {
      number: 12, accepted: ['app'], evidence: 6,
      explanation: {
        zh: '定位句 6：Every meeting room is booked through the member app on your phone。会议室通过手机会员应用预订，填 app。',
        en: 'Sentence 6: every meeting room is booked "through the member app", so fill app.',
      },
    },
    {
      number: 13, accepted: ['two hundred', '200'], evidence: 9,
      explanation: {
        zh: '定位句 9：Each member has two hundred pages per month。每月打印额度两百页，填 two hundred。超出部分另收费。',
        en: 'Sentence 9: each member has "two hundred pages per month", so fill two hundred. Extra pages carry a small charge.',
      },
    },
    {
      number: 14, accepted: ['workshop'], evidence: 14,
      explanation: {
        zh: '定位句 14：The community manager organises the monthly workshop on the last Thursday。月度活动是工作坊，填 workshop。',
        en: 'Sentence 14: the monthly event is "the monthly workshop", so fill workshop.',
      },
    },
    {
      number: 15, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：It is a permanent table with your name on it, not a shared morning spot。专属工位是固定留给一人的桌子，对应 A。每日抢占的是流动工位。',
        en: 'Sentence 16: a dedicated desk is "a permanent table with your name on it", matching A. The shared morning spot is the hot desk.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：Up to seven days, provided the room is for your own team。最多提前七天订房，对应 B。',
        en: 'Sentence 18: rooms may be booked "up to seven days", matching B.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：Sign in at the front desk, and wait for the member to come down。访客先签到并等会员下来接，对应 B。日费、存包未提及。',
        en: 'Sentence 20: visitors "sign in at the front desk, and wait for the member", matching B. A day fee and bag storage are not mentioned.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：It covers desk access, the printing quota and use of the kitchen。月费含工位、打印额度和厨房使用，对应 B。会议室与活动不另收费但不是答案所指；打印机维修外包。',
        en: 'Sentence 22: the fee covers "desk access, the printing quota and use of the kitchen", matching B. Rooms and events carry no separate charge, while printer repairs are outsourced.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：The desk host keeps the shared kitchen stocked and resets the meeting tables。桌面管家负责补齐共享厨房，对应 A。',
        en: 'Sentence 25: the desk host "keeps the shared kitchen stocked", matching A.',
      },
    },
    {
      number: 20, accepted: ['C'], evidence: 26,
      explanation: {
        zh: '定位句 26：The community manager runs the monthly social events and the welcome talks。社区经理办月度社交活动，对应 C。打印机维修外包给承包商。',
        en: 'Sentence 26: the community manager "runs the monthly social events", matching C. Printer repairs go to an outside contractor.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Before we walk in, take a look at the floor plan on the wall beside you.' },
    { speaker: 'guide', text: 'The space splits into three zones, starting with the open desks near the window.' },
    { speaker: 'guide', text: 'The basic membership books a hot desk, which you can claim anywhere each morning.' },
    { speaker: 'guide', text: 'You do not keep the same chair or table from one day to the next.' },
    { speaker: 'guide', text: 'A dedicated desk is the fixed option, reserved only for you through the month.' },
    { speaker: 'guide', text: 'The quiet rooms along the far wall hold no phones or open calls.' },
    { speaker: 'guide', text: 'Every meeting room is booked through the member app on your phone.' },
    { speaker: 'guide', text: 'Choose the size you need, and the screen outside shows the next booking.' },
    { speaker: 'guide', text: 'Rooms can be reserved up to seven days ahead, but only for your own team.' },
    { speaker: 'guide', text: 'Printing sits in the corner by the kitchen. Each member has two hundred pages per month.' },
    { speaker: 'guide', text: 'Pages beyond that rate pay a small charge on the monthly bill.' },
    { speaker: 'guide', text: 'The kitchen brews coffee all day, and the cupboard holds tea and sugar.' },
    { speaker: 'guide', text: 'Visitors coming to meet a member must sign in at the front desk first.' },
    { speaker: 'guide', text: 'They wait there until the member comes down to collect them.' },
    { speaker: 'guide', text: 'The community manager organises the monthly workshop on the last Thursday.' },
    { speaker: 'guide', text: 'What exactly is a dedicated desk?' },
    { speaker: 'guide', text: 'It is a permanent table with your name on it, not a shared morning spot.' },
    { speaker: 'guide', text: 'How far in advance can meeting rooms be reserved?' },
    { speaker: 'guide', text: 'Up to seven days, provided the room is for your own team.' },
    { speaker: 'guide', text: 'What must a visitor do before entering the space?' },
    { speaker: 'guide', text: 'Sign in at the front desk, and wait for the member to come down.' },
    { speaker: 'guide', text: 'What does the standard monthly fee cover?' },
    { speaker: 'guide', text: 'It covers desk access, the printing quota and use of the kitchen.' },
    { speaker: 'guide', text: 'The meeting rooms and events come with no separate charge either.' },
    { speaker: 'guide', text: 'Two part-time staff run the day to day here.' },
    { speaker: 'guide', text: 'The desk host keeps the shared kitchen stocked and resets the meeting tables.' },
    { speaker: 'guide', text: 'The community manager runs the monthly social events and the welcome talks.' },
    { speaker: 'guide', text: 'The printer repairs go out to an outside contractor once a month.' },
    { speaker: 'guide', text: 'The phone booths fit one person and a laptop each.' },
    { speaker: 'guide', text: 'Lockers sit under the stairs for members who store a bag overnight.' },
    { speaker: 'guide', text: 'The air conditioning runs quietly through the open zone all day.' },
    { speaker: 'guide', text: 'A whiteboard trolley moves between rooms for quick planning sessions.' },
    { speaker: 'guide', text: 'The events wall lists talks, skill shares and evening drinks.' },
    { speaker: 'guide', text: 'New members get a short tour at nine on their first weekday.' },
    { speaker: 'guide', text: 'The Wi-Fi code sits on the member board behind the kitchen.' },
    { speaker: 'guide', text: 'Recycling bins for paper and plastic stand near the entrance.' },
    { speaker: 'guide', text: 'The roof terrace opens at lunch, when the weather is dry.' },
    { speaker: 'guide', text: 'Bike racks outside hold up to twenty cycles.' },
    { speaker: 'guide', text: 'Mail for members arrives each morning and sorts into the labelled slots.' },
    { speaker: 'guide', text: 'Please keep food and drinks away from the printer corner.' },
    { speaker: 'guide', text: 'The quiet rooms close for cleaning at four each afternoon.' },
    { speaker: 'guide', text: 'Any questions before we start the walk around the desks?' },
    { speaker: 'guide', text: 'The tour takes about twenty minutes, with stops at each zone.' },
    { speaker: 'guide', text: 'The water cooler sits beside the door to the kitchen.' },
    { speaker: 'guide', text: 'The print queue shows how many members are ahead of you.' },
    { speaker: 'guide', text: 'The events wall changes each week during the term.' },
    { speaker: 'guide', text: 'Members may bring one guest to the monthly evening talk.' },
    { speaker: 'guide', text: 'A map of the zones hangs beside the exit on your right.' },
    { speaker: 'guide', text: 'The quiet rooms reopen after the afternoon cleaning break.' },
  ],
  vocabulary: [
    {
      term: 'dedicated', phonetic: '/ˈdedɪkeɪtɪd/', partOfSpeech: 'adj.', sentenceIndex: 4,
      meaning: { zh: '专属的，固定保留的', en: 'reserved for one member and not shared daily' },
      usage: { zh: '形容词；a dedicated desk、a dedicated room。动词 dedicate。', en: 'Adjective: a dedicated desk; the verb is dedicate.' },
      collocations: ['a dedicated desk', 'a dedicated room', 'dedicated space'],
      example: { en: 'A dedicated desk stays yours through the month.', zh: '专属工位整月留给你。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈded/。', en: 'Four syllables with stress on the first.' },
    },
    {
      term: 'quota', phonetic: '/ˈkwəʊtə/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '额度，限额（打印页数）', en: 'the fixed allowance included in the membership' },
      usage: { zh: '可数；the printing quota、a monthly quota。', en: 'Countable: the printing quota, a monthly quota.' },
      collocations: ['the printing quota', 'a monthly quota', 'the quota limit'],
      example: { en: 'Each member has a two-hundred-page quota.', zh: '每位会员有两百页额度。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkwəʊ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'contractor', phonetic: '/kənˈtræktə/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '外包承包商', en: 'the outside firm brought in for repairs' },
      usage: { zh: '可数；an outside contractor、hire a contractor。', en: 'Countable: an outside contractor, hire a contractor.' },
      collocations: ['an outside contractor', 'hire a contractor', 'the repair contractor'],
      example: { en: 'Printer repairs go to an outside contractor.', zh: '打印机维修外包给承包商。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtræk/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'lockers', phonetic: '/ˈlɒkəz/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '储物柜', en: 'the small locked shelf for overnight bags' },
      usage: { zh: '可数；under the stairs、store a bag in a locker。', en: 'Countable: store a bag in a locker.' },
      collocations: ['the storage lockers', 'under the lockers', 'a locker key'],
      example: { en: 'Lockers sit under the stairs.', zh: '储物柜在楼梯下面。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈlɒ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'booths', phonetic: '/buːðz/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '电话隔间，单人电话亭', en: 'the enclosed single-person space for calls' },
      usage: { zh: '可数；a phone booth、the booth fits one person。', en: 'Countable: a phone booth, the booth fits one person.' },
      collocations: ['a phone booth', 'the call booth', 'book a booth'],
      example: { en: 'Each booth fits one person and a laptop.', zh: '每个隔间容一人和一台电脑。' },
      listening: { zh: '单音节，尾音 /ð/ 要读出。', en: 'One syllable; keep the final /ð/.' },
    },
    {
      term: 'member', phonetic: '/ˈmembə/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '会员，空间使用者', en: 'a person who holds a desk in the space' },
      usage: { zh: '可数；the member app、a new member。', en: 'Countable: the member app, a new member.' },
      collocations: ['the member app', 'a new member', 'the member board'],
      example: { en: 'Visitors wait for their member to come down.', zh: '访客等会员下来接。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈmem/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'terrace', phonetic: '/ˈterəs/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '露台，屋顶平台', en: 'the open roof space used at lunchtime' },
      usage: { zh: '可数；the roof terrace、open the terrace。', en: 'Countable: the roof terrace, open the terrace.' },
      collocations: ['the roof terrace', 'open the terrace', 'the terrace door'],
      example: { en: 'The terrace opens at lunch in dry weather.', zh: '天气干燥时露台午餐开放。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈter/。', en: 'Two syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'sign in', sentenceIndex: 20,
      meaning: { zh: '签到，登记进入', en: 'to record arrival at the front desk' },
      usage: { zh: '短语动词；visitors sign in、sign in at the desk。反义 sign out。', en: 'Sign in at the desk; the opposite is sign out.' },
      example: { en: 'Visitors sign in before entering.', zh: '访客进入前先签到。' },
    },
    {
      phrase: 'up to', sentenceIndex: 18,
      meaning: { zh: '至多，不超过（时限）', en: 'the maximum time ahead allowed' },
      usage: { zh: '固定短语；up to seven days、up to twenty cycles。', en: 'Up to means at most; compare within seven days.' },
      example: { en: 'Rooms are booked up to seven days ahead.', zh: '会议室最多提前七天预订。' },
    },
    {
      phrase: 'come down', sentenceIndex: 20,
      meaning: { zh: '下楼来接（访客）', en: 'to leave the floor and meet the visitor' },
      usage: { zh: '短语动词；the member comes down、come down to collect。', en: 'The member comes down; compare come up to meet.' },
      example: { en: 'The member comes down to collect the visitor.', zh: '会员下楼来接访客。' },
    },
    {
      phrase: 'go out to', sentenceIndex: 27,
      meaning: { zh: '外包给（外部承包商）', en: 'to be handled by an outside firm' },
      usage: { zh: '被动短语；repairs go out to a contractor。', en: 'Repairs go out to a contractor; compare in-house.' },
      example: { en: 'Printer repairs go out to a contractor.', zh: '打印机维修外包给承包商。' },
    },
    {
      phrase: 'keeps the shared kitchen stocked', sentenceIndex: 25,
      meaning: { zh: '补齐（厨房用品）', en: 'to refill supplies so nothing runs out' },
      usage: { zh: '被动短语；keep the kitchen stocked、keep the shelves stocked。', en: 'Keep stocked means refill supplies; stocked is an adjective here.' },
      example: { en: 'The host keeps the kitchen stocked.', zh: '管家补齐厨房用品。' },
    },
  ],
  tips: [
    {
      title: { zh: '流动与专属工位对照记', en: 'Contrast hot and dedicated desks' },
      body: {
        zh: '流动工位每天早上自选、不留同一桌椅；专属工位整月固定、桌上有名字。单选题问 dedicated desk 时，别把每日抢占的共享桌当成答案。',
        en: 'A hot desk is claimed each morning with no fixed table; a dedicated desk is reserved all month with a name on it. For the dedicated question, do not choose the shared morning spot.',
      },
    },
    {
      title: { zh: '额度与超出部分分开听', en: 'Separate quota from overage' },
      body: {
        zh: '两百页是含在月费内的额度，超出部分才在月账单上加收。听到 per month、beyond that rate、small charge 就把额度和超支分界标出来。',
        en: 'Two hundred pages are included; only pages beyond that carry a small monthly charge. Mark the quota and overage boundary at per month, beyond that rate and small charge.',
      },
    },
    {
      title: { zh: '配对按岗位动作归位', en: 'Match role to action' },
      body: {
        zh: '配对两题先看岗位：桌面管家管厨房补给与整理桌面，社区经理办社交活动和欢迎讲解。订会议室、修打印机是干扰项或外包任务，不分配给这两个岗位。',
        en: 'Read the role first: the host stocks the kitchen and resets tables; the manager runs social events and welcome talks. Room booking and printer repair are distractors or outsourced tasks.',
      },
    },
  ],
};
