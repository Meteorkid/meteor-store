import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 21 · Part 1 — 预订营地营位（双人对话，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 生活交易类对话：营位类型、用电接口、淋浴代币、最晚入住、篝火规定、第二辆车费用，
 * 以及帐篷位、 caravan 位与集体避雨棚三类场地的区分（配对 8–10）。
 */
export const test21Part1: ListeningLesson = {
  slug: 'test-21-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预订营地营位', en: 'Booking a campsite pitch' },
  summary: {
    zh: '露营者电话预订周末营位：选定帐篷位，确认非供电营位没有接线口，了解淋浴代币价格、最晚入住时间、篝火只能在指定火坑点燃，并弄清第二辆车费用与三类场地的区别。',
    en: 'A camper books a weekend pitch: choosing a tent pitch, confirming non-powered sites have no hook-up, learning the shower tokens, the latest check-in time, the designated fire pits, the second vehicle fee, and how the three site types differ.',
  },
  accent: { zh: '两位说话人均为新西兰口音。', en: 'Both speakers use New Zealand accents.' },
  speechRate: '+2%',
  cast: [
    { id: 'camper', label: 'CAMPER', gender: 'male', voice: 'en-NZ-MitchellNeural' },
    { id: 'warden', label: 'WARDEN', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Booking item', 'Detail'],
      rows: [
        { lead: 'Pitch type', cells: [[{ blank: 1 }]] },
        { lead: 'Electricity on the pitch', cells: [[{ blank: 2 }, { text: ' available' }]] },
        { lead: 'Shower cost', cells: [[{ blank: 3 }, { text: ' per shower' }]] },
        { lead: 'Latest check-in', cells: [[{ blank: 4 }, { text: ' p.m.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'Where may guests light a campfire this season?',
          options: [
            { key: 'A', text: 'Only in the designated fire pits near the shelter' },
            { key: 'B', text: 'Anywhere on the tent pitch itself' },
            { key: 'C', text: 'Inside the camp kitchen barbecue area' },
          ],
        },
        {
          number: 6,
          stem: 'What is the charge for a second vehicle?',
          options: [
            { key: 'A', text: 'Five dollars a night' },
            { key: 'B', text: 'Six dollars a day' },
            { key: 'C', text: 'Twelve dollars per pitch' },
          ],
        },
        {
          number: 7,
          stem: 'Which row of pitches does the warden assign because it is level?',
          options: [
            { key: 'A', text: 'The western row by the oak trees' },
            { key: 'B', text: 'The eastern row beside the hedge' },
            { key: 'C', text: 'The riverside powered site' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which detail applies to each site? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'no power and space for one car' },
        { key: 'B', text: 'powered hook-up and a hard stand for an awning' },
        { key: 'C', text: 'seats up to twelve and bookable for evening meals' },
        { key: 'D', text: 'free covered veranda for pitch guests' },
        { key: 'E', text: 'permits only small gas stoves' },
      ],
      items: [
        { number: 8, text: 'tent pitch' },
        { number: 9, text: 'caravan site' },
        { number: 10, text: 'group shelter' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['tent'], evidence: 2,
      explanation: {
        zh: '定位句 2：We’re bringing a small tent, so a basic tent pitch would suit us。顾客明确要帐篷位，填 tent；句 3 的 powered sites 是另一类，不是本次预订。',
        en: 'Sentence 2: "We’re bringing a small tent, so a basic tent pitch would suit us", so fill tent. The powered sites in sentence 3 are a different category.',
      },
    },
    {
      number: 2, accepted: ['hook-up'], evidence: 7,
      explanation: {
        zh: '定位句 7：the pitches themselves have no hook-up on the non-powered side。非供电营位没有接线口，填 hook-up；句 6 办公室的共享插座是临时充电处，不是营位供电。',
        en: 'Sentence 7: "the pitches themselves have no hook-up on the non-powered side", so fill hook-up. The shared office outlet in sentence 6 is a temporary charger, not pitch power.',
      },
    },
    {
      number: 3, accepted: ['tokens'], evidence: 9,
      explanation: {
        zh: '定位句 9：Each shower takes two tokens。淋浴按代币计费，题目已给 per shower，填 tokens；句 11 的 four minutes 是淋浴时长，不是计费单位。',
        en: 'Sentence 9: "Each shower takes two tokens". Per shower is printed, so fill tokens. The four minutes in sentence 11 is the shower length, not the payment unit.',
      },
    },
    {
      number: 4, accepted: ['nine', '9'], evidence: 13,
      explanation: {
        zh: '定位句 13：the latest check-in is nine, unless you text us earlier。题目已给 p.m.，填数字 nine；句 15 的 gate code 是晚到后的补救安排，不是入住截止点。',
        en: 'Sentence 13: "the latest check-in is nine, unless you text us earlier". P.m. is printed, so write nine. The gate code in sentence 15 is a backup for late arrivals.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：Campfires are banned on the pitches themselves this season, but there are designated fire pits near the main shelter。篝火只能在指定火坑点燃，对应 A。B 在营位上点火正是被禁止的；C 的厨房烧烤区没有出现。',
        en: 'Sentence 17: fires are "banned on the pitches themselves this season, but there are designated fire pits near the main shelter", matching A. Lighting on the pitch in B is banned, and the kitchen barbecue in C is not mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：It’s six dollars a day for the extra car。第二辆车每天六元，对应 B。A 的五元一夜与 C 的十二元每营位均未出现；十二元是句 25 供电营位的加价。',
        en: 'Sentence 27: "It’s six dollars a day for the extra car", matching B. Five dollars and twelve dollars per pitch are not stated; the twelve dollars in sentence 25 is the powered-site surcharge.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：The western ones slope a little, but the eastern row beside the hedge is flat, so I’ll put you there。平坦的是树篱旁东侧一排，对应 B。A 的西侧排略有坡度；C 的河边供电位与本次帐篷位无关。',
        en: 'Sentence 31: "The western ones slope a little, but the eastern row beside the hedge is flat, so I’ll put you there", matching B. The western row in A slopes, and the riverside powered site in C is irrelevant.',
      },
    },
    {
      number: 8, accepted: ['A'], evidence: 33,
      explanation: {
        zh: '定位句 33：The tent pitches suit small groups who bring their own equipment。帐篷位不靠供电，且句 5 说明每个帐篷位可停一辆车，对应 A。E 只允许小气炉是使用规则，不是场地特征。',
        en: 'Sentence 33: "The tent pitches suit small groups who bring their own equipment". Tent sites lack power, and sentence 5 allows one car, matching A. E, small gas stoves only, is a usage rule, not a site feature.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：Caravan sites all have powered hook-ups, and the hard stand leaves room for an awning。 caravan 位带供电接线口和硬地车位，可搭遮阳篷，对应 B。',
        en: 'Sentence 35: "Caravan sites all have powered hook-ups, and the hard stand leaves room for an awning", matching B.',
      },
    },
    {
      number: 10, accepted: ['C'], evidence: 37,
      explanation: {
        zh: '定位句 37：The shelter seats up to twelve people, and it can be reserved separately for evening meals。集体棚可坐十二人、可单独预订用于晚餐，对应 C。D 的免费廊台是棚外区域，不是棚本身的容量。',
        en: 'Sentence 37: "The shelter seats up to twelve people, and it can be reserved separately for evening meals", matching C. The free veranda in D is the area outside the shelter, not its capacity.',
      },
    },
  ],
  transcript: [
    { speaker: 'camper', text: 'Hi, I’m ringing to book a campsite pitch for next weekend, the fourteenth and fifteenth of March.' },
    { speaker: 'warden', text: 'Good morning, I’m Kiri from the coastal holiday park. How many people are in your group, and are you in a tent or a caravan?' },
    { speaker: 'camper', text: 'There are four of us, and we’re bringing a small tent, so a basic tent pitch would suit us.' },
    { speaker: 'warden', text: 'Right, a tent pitch. The non-powered ones sit behind the oak trees, and the powered sites run along the river.' },
    { speaker: 'camper', text: 'We don’t need power for the tent. Do any pitches still leave space for a car beside the tent?' },
    { speaker: 'warden', text: 'Yes, each tent pitch allows one car, and the second vehicle pays a small daily fee at reception.' },
    { speaker: 'camper', text: 'Fine. Is there somewhere we can plug in a phone charger in the office, in case the battery dies?' },
    { speaker: 'warden', text: 'The office has a shared outlet, but the pitches themselves have no hook-up on the non-powered side.' },
    { speaker: 'camper', text: 'That’s okay. Now, about the kitchen. I was told the showers are coin operated.' },
    { speaker: 'warden', text: 'They are. Each shower takes two tokens, and you buy the tokens at the reception desk beside the maps.' },
    { speaker: 'camper', text: 'How long does one token last in the shower?' },
    { speaker: 'warden', text: 'A two-token shower runs about four minutes, and hot water stays on the whole time.' },
    { speaker: 'camper', text: 'Good. What time do we have to arrive by, if we come straight from campus?' },
    { speaker: 'warden', text: 'Reception closes at nine in the evening, so the latest check-in is nine, unless you text us earlier.' },
    { speaker: 'camper', text: 'Nine o’clock. We should make that, but what if the bus runs late?' },
    { speaker: 'warden', text: 'Send a message the day before, and the warden on duty will leave the gate code for you.' },
    { speaker: 'camper', text: 'About campfires. Are we allowed to light one at the tent pitch?' },
    { speaker: 'warden', text: 'Campfires are banned on the pitches themselves this season, but there are designated fire pits near the main shelter.' },
    { speaker: 'camper', text: 'So we gather around one of those pits rather than dig a hole in the ground?' },
    { speaker: 'warden', text: 'That’s right. The pits have fixed grates, and you bring your own wood from the shop.' },
    { speaker: 'camper', text: 'Can we cook on our own gas stove at the tent?' },
    { speaker: 'warden', text: 'Small gas stoves are permitted, but open charcoal barbecues are not allowed near the trees.' },
    { speaker: 'camper', text: 'Got it. What about the washing facilities for dishes?' },
    { speaker: 'warden', text: 'The camp kitchen has two sinks, and hot water there is free, unlike the showers.' },
    { speaker: 'camper', text: 'I should check the price. How much is the tent pitch per night?' },
    { speaker: 'warden', text: 'A tent pitch is twenty-five dollars a night, and the powered sites are twelve dollars more.' },
    { speaker: 'camper', text: 'Twenty-five. And the second vehicle fee, what does that come to?' },
    { speaker: 'warden', text: 'It’s six dollars a day for the extra car, collected when you register on arrival.' },
    { speaker: 'camper', text: 'Do we need to bring bedding or utensils?' },
    { speaker: 'warden', text: 'No, those are up to you, but the kitchen pots and plates are stored in the cupboards.' },
    { speaker: 'camper', text: 'One thing. The oak-tree pitches, are they level enough for a two-person tent?' },
    { speaker: 'warden', text: 'The western ones slope a little, but the eastern row beside the hedge is flat, so I’ll put you there.' },
    { speaker: 'camper', text: 'Perfect. Now, could you tell me how the three pitch types differ?' },
    { speaker: 'warden', text: 'Sure. The tent pitches suit small groups who bring their own equipment.' },
    { speaker: 'camper', text: 'What about the caravan sites?' },
    { speaker: 'warden', text: 'Caravan sites all have powered hook-ups, and the hard stand leaves room for an awning.' },
    { speaker: 'camper', text: 'And the group shelter near the fire pits?' },
    { speaker: 'warden', text: 'The shelter seats up to twelve people, and it can be reserved separately for evening meals.' },
    { speaker: 'camper', text: 'Do we pay extra for the shelter if it rains?' },
    { speaker: 'warden', text: 'The covered veranda is free for pitch guests, but booking the whole shelter needs a small fee.' },
    { speaker: 'camper', text: 'Alright, I think that covers it. I’ll pay the deposit online this evening.' },
    { speaker: 'warden', text: 'Thank you. You’ll get a confirmation message with the gate code and the pitch number.' },
  ],
  vocabulary: [
    {
      term: 'caravan', phonetic: '/ˈkærəvæn/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: ' caravan 房车，拖挂式旅居车', en: 'a wheeled home towed behind a vehicle' },
      usage: { zh: '可数名词；caravan site、caravan park。', en: 'Countable: caravan site, caravan park.' },
      collocations: ['a caravan site', 'tow a caravan', 'the caravan park'],
      example: { en: 'The caravan sites sit along the riverside row.', zh: ' caravan 位排在河边一排。' },
      listening: { zh: '三个音节，重音在第一和第三音节。', en: 'Three syllables with stress on the first and third.' },
    },
    {
      term: 'hook-up', phonetic: '/ˈhʊk ʌp/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '（营位）供电接线口', en: 'a power connection supplied to a pitch' },
      usage: { zh: '露营术语；powered hook-up、no hook-up。连字符连接两个词。', en: 'Camping term: powered hook-up, no hook-up. Hyphenated as one noun.' },
      collocations: ['a powered hook-up', 'no hook-up', 'the hook-up point'],
      example: { en: 'Non-powered pitches have no hook-up for appliances.', zh: '非供电营位没有给电器用的接线口。' },
      listening: { zh: '两个词连读，up 弱读为 /ʌp/。', en: 'The two words link; up reduces to /ʌp/.' },
    },
    {
      term: 'token', phonetic: '/ˈtəʊkən/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '代币，代用筹码', en: 'a plastic disc used instead of coins for a service' },
      usage: { zh: '可数；shower token、buy tokens。', en: 'Countable: shower token, buy tokens.' },
      collocations: ['shower tokens', 'two tokens', 'a token machine'],
      example: { en: 'Each shower takes two tokens from reception.', zh: '每次淋浴用前台买的两枚代币。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtəʊ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'designated', phonetic: '/ˈdezɪɡneɪtɪd/', partOfSpeech: 'adj.', sentenceIndex: 17,
      meaning: { zh: '指定的，划定的（区域）', en: 'set aside for a particular purpose' },
      usage: { zh: 'designated area、designated fire pit；动词 designate。', en: 'designated area, designated fire pit; the verb is designate.' },
      collocations: ['a designated pit', 'designated areas', 'the designated zone'],
      example: { en: 'Fires are allowed only in the designated pits.', zh: '只能在指定火坑生火。' },
      listening: { zh: '重音在第一音节 /ˈdez/，词尾 /tɪd/ 清晰。', en: 'Stress the first syllable; the final /tɪd/ is clear.' },
    },
    {
      term: 'barbecues', phonetic: '/ˈbɑːbɪkjuːz/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '烧烤炉，烧烤聚会', en: 'a grill for cooking food over charcoal or gas' },
      usage: { zh: '可数；open charcoal barbecue。口语缩写 BBQ。', en: 'Countable: open charcoal barbecue; the short form is BBQ.' },
      collocations: ['a charcoal barbecue', 'the barbecue area', 'open a barbecue'],
      example: { en: 'Charcoal barbecues are banned near the trees.', zh: '炭火烧烤禁止靠近树木。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈbɑː/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'awning', phonetic: '/ˈɔːnɪŋ/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '遮阳篷，车边篷', en: 'a canvas shelter fixed beside a caravan or window' },
      usage: { zh: '可数；leave room for an awning、roll out the awning。', en: 'Countable: leave room for an awning, roll out the awning.' },
      collocations: ['a caravan awning', 'roll out the awning', 'space for an awning'],
      example: { en: 'The hard stand leaves room for the caravan awning.', zh: '硬地车位留出搭车边篷的空间。' },
      listening: { zh: '两个音节，开头 /ˈɔː/ 长音。', en: 'Two syllables with a long opening /ɔː/.' },
    },
    {
      term: 'veranda', phonetic: '/vəˈrændə/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '走廊，有顶露台', en: 'a covered open porch attached to a building' },
      usage: { zh: '可数；covered veranda。英式也拼 verandah。', en: 'Countable: covered veranda; British English also writes verandah.' },
      collocations: ['the covered veranda', 'on the veranda', 'a wide veranda'],
      example: { en: 'Pitch guests can sit on the covered veranda.', zh: '营位客人可以坐在有顶廊台上。' },
      listening: { zh: '重音在第二音节 /ˈræn/。', en: 'Stress the second syllable /ˈræn/.' },
    },
  ],
  expressions: [
    {
      phrase: 'ringing to book', sentenceIndex: 0,
      meaning: { zh: '打电话来预订', en: 'calling in order to reserve something' },
      usage: { zh: 'ring 作“打电话”；ring to book、ring to ask。', en: 'Ring means to call: ring to book, ring to ask.' },
      example: { en: 'I’m ringing to book a pitch for the weekend.', zh: '我打电话来订周末的营位。' },
    },
    {
      phrase: 'leave space for', sentenceIndex: 4,
      meaning: { zh: '为……留出空间', en: 'to keep room available for something' },
      usage: { zh: '后接名词；leave space for a car、leave space for equipment。', en: 'Follow with a noun: leave space for a car, for equipment.' },
      example: { en: 'The pitch leaves space for one small car.', zh: '营位留出一辆小车的位置。' },
    },
    {
      phrase: 'plug in', sentenceIndex: 6,
      meaning: { zh: '插上电源', en: 'to connect a device to an electricity supply' },
      usage: { zh: '可分短语动词；plug in a charger、plug the phone in。', en: 'Separable: plug in a charger, plug the phone in.' },
      example: { en: 'You can plug in the charger at the office outlet.', zh: '你可以在办公室插座给充电器插电。' },
    },
    {
      phrase: 'takes two tokens', sentenceIndex: 9,
      meaning: { zh: '需要两枚代币', en: 'to require two tokens to operate' },
      usage: { zh: 'take 在此表示“需要、耗用”；the shower takes two tokens。', en: 'Take means to require here: the shower takes two tokens.' },
      example: { en: 'The washing machine takes three tokens per load.', zh: '洗衣机每桶要三枚代币。' },
    },
    {
      phrase: 'designated fire pits', sentenceIndex: 17,
      meaning: { zh: '指定的篝火坑', en: 'the marked pits where fires are allowed' },
      usage: { zh: 'designated 修饰地点；fire pit 为可数名词，复数加 s。', en: 'Designated modifies the place; fire pit is countable with an s in the plural.' },
      example: { en: 'Guests gather at the designated fire pits after dark.', zh: '天黑后客人聚在指定火坑旁。' },
    },
    {
      phrase: 'bring your own', sentenceIndex: 19,
      meaning: { zh: '自带（物品）', en: 'to supply the item yourself rather than the venue' },
      usage: { zh: '露营常见说法；bring your own wood、bring your own tent。', en: 'Common camping phrase: bring your own wood, bring your own tent.' },
      example: { en: 'You bring your own firewood from the camp shop.', zh: '柴火要自己在营地商店买。' },
    },
    {
      phrase: 'covers it', sentenceIndex: 40,
      meaning: { zh: '都问到了，说全了', en: 'to have dealt with every point' },
      usage: { zh: '口语收尾；that covers it、that covers everything。', en: 'Colloquial closing: that covers it, that covers everything.' },
      example: { en: 'I think the price and the times cover it.', zh: '价格和时间都说全了。' },
    },
  ],
  tips: [
    {
      title: { zh: '规则与价格分开记', en: 'Keep rules and prices separate' },
      body: {
        zh: '订位对话里数字密集：夜租、加价、第二辆车、代币、时长。听到数字先归类它属于哪一项，避免把供电位加价十二元当成第二辆车费用。',
        en: 'Booking talks are full of numbers: nightly rate, surcharge, second vehicle, tokens, minutes. Sort each number into its category; do not mistake the twelve-dollar powered surcharge for the car fee.',
      },
    },
    {
      title: { zh: '否定句排除干扰项', en: 'Negations rule out distractors' },
      body: {
        zh: 'no hook-up、banned on the pitches、not allowed near the trees 这类否定句直接排除错误选项。听到否定词就在对应选项旁划掉，别把被禁止的做法当成规定。',
        en: 'Phrases such as no hook-up, banned on the pitches and not allowed near the trees rule out distractors. Cross the rejected option out when you hear the negation.',
      },
    },
    {
      title: { zh: '配对按场地名定位', en: 'Match by the site name' },
      body: {
        zh: '配对三项依次讲帐篷位、 caravan 位和集体棚。先在场地名旁记下供电、车位、容量等特征，再去对应选项；不要听到 hook-up 就填第一行。',
        en: 'The three sites appear in order: tent pitch, caravan site, shelter. Note power, car space and capacity beside each name before matching; do not put hook-up on the first line.',
      },
    },
  ],
};
