import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 5 · Part 2 — 机场航站楼指引广播（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白前半段按值机岛、安检通道、转机路线、特殊协助柜台的顺序展开，对应五道单选；
 * 后半段讲时间与位置提醒，对应五道笔记填空。题块顺序与录音顺序一致。
 */
export const test05Part2: ListeningLesson = {
  slug: 'test-05-part-2',
  part: 2,
  status: 'published',
  title: { zh: '机场航站楼指引广播', en: 'Orienting passengers at an airport terminal' },
  summary: {
    zh: '广播员在出发前讲解航站楼布局：值机岛如何分区、安检通道的使用规则、转机旅客前往一号航站楼的路线，以及特殊协助柜台的位置和开放时间。',
    en: 'An announcer briefs passengers before departure: how the check-in islands are divided, the rules for security lanes, the route to Terminal One for connecting passengers, and where the special assistance desk is and when it opens.',
  },
  accent: { zh: '广播员为加拿大口音，语速中等偏快。', en: 'The announcer has a Canadian accent and speaks fairly quickly.' },
  speechRate: '+5%',
  cast: [
    { id: 'announcer', label: 'ANNOUNCER', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 11,
          stem: 'Where should passengers with domestic tickets check in?',
          options: [
            { key: 'A', text: 'islands A to C' },
            { key: 'B', text: 'islands D to F' },
            { key: 'C', text: 'island G' },
          ],
        },
        {
          number: 12,
          stem: 'Who may use the fast-track lane?',
          options: [
            { key: 'A', text: 'passengers travelling with families' },
            { key: 'B', text: 'passengers with hand luggage only' },
            { key: 'C', text: 'passengers on long-haul flights' },
          ],
        },
        {
          number: 13,
          stem: 'How do connecting passengers reach Terminal One?',
          options: [
            { key: 'A', text: 'by shuttle bus' },
            { key: 'B', text: 'by indoor walkway' },
            { key: 'C', text: 'by underground train' },
          ],
        },
        {
          number: 14,
          stem: 'Where is the special assistance desk?',
          options: [
            { key: 'A', text: 'opposite the arrivals hall' },
            { key: 'B', text: 'beside the information point' },
            { key: 'C', text: 'on the lower level' },
          ],
        },
        {
          number: 15,
          stem: 'What should passengers who booked assistance do?',
          options: [
            { key: 'A', text: 'call the airline after landing' },
            { key: 'B', text: 'report to the desk on arrival' },
            { key: 'C', text: 'wait at gate nine' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'International check-in closes', cells: [[{ blank: 16 }, { text: ' minutes before departure' }]] },
        { lead: 'Transfer walkway opens at', cells: [[{ blank: 17 }, { text: ' in the morning' }]] },
        { lead: 'Baggage claim is on the', cells: [[{ blank: 18 }]] },
        { lead: 'Assistance desk staffed until', cells: [[{ blank: 19 }, { text: ' at night' }]] },
        { lead: 'Lost property desk is next to the', cells: [[{ blank: 20 }, { text: ' shop' }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Islands A, B and C serve domestic flights。国内航班对应 A 到 C 岛；D 到 F 是国际航班，G 岛留给带幼儿的家庭，是两个干扰项。',
        en: 'Sentence 4: "Islands A, B and C serve domestic flights". Domestic tickets go to islands A to C. D to F are international, and island G is reserved for families, both distractors.',
      },
    },
    {
      number: 12, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：If you have only hand luggage and no bags to drop, you may use the fast-track lane。条件是只有手提行李，不托运行李。A 的家庭旅客在 G 岛，C 的长途旅客没有特殊通道权利。',
        en: 'Sentence 11: "If you have only hand luggage and no bags to drop, you may use the fast-track lane". The condition is hand luggage only. Families use island G, and long-haul passengers have no special lane entitlement.',
      },
    },
    {
      number: 13, accepted: ['B'], evidence: 16,
      explanation: {
        zh: '定位句 16：Follow the purple transfer signs along the indoor walkway to Terminal One。句 17 明确说今天两楼之间没有摆渡巴士，排除 A；地下火车全段未提及。',
        en: 'Sentence 16: "Follow the purple transfer signs along the indoor walkway to Terminal One". Sentence 17 states there is no shuttle bus today, ruling out A, and an underground train is never mentioned.',
      },
    },
    {
      number: 14, accepted: ['A'], evidence: 20,
      explanation: {
        zh: '定位句 20：The assistance desk sits opposite the arrivals hall, beside the coffee shop。opposite the arrivals hall 与 A 逐词对应。B 的信息点在 G 岛旁，C 的 lower level 是行李提取处。',
        en: 'Sentence 20: "The assistance desk sits opposite the arrivals hall, beside the coffee shop". Opposite the arrivals hall matches A word for word. B belongs to island G, and the lower level is baggage claim.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：please let the desk know as soon as you arrive。as soon as you arrive = report on arrival。A 说落地后打电话，与原文相反；C 的 gate nine 是吸烟区。',
        en: 'Sentence 21: "please let the desk know as soon as you arrive". As soon as you arrive matches report on arrival. A reverses the timing by calling after landing, and gate nine is the smoking area.',
      },
    },
    {
      number: 16, accepted: ['45', 'forty-five'], spoken: 'forty-five', evidence: 24,
      explanation: {
        zh: '定位句 24：Check-in for international flights closes forty-five minutes before departure。空格后已印 minutes，只填数字。句 25 的 thirty minutes 是国内航班时间，别混淆。',
        en: 'Sentence 24: "Check-in for international flights closes forty-five minutes before departure". Minutes is already printed, so write the number only. The thirty minutes in sentence 25 is the domestic deadline, a distractor.',
      },
    },
    {
      number: 17, accepted: ['6', 'six'], spoken: 'six', evidence: 26,
      explanation: {
        zh: '定位句 26：The transfer walkway opens at six in the morning。空后已印 in the morning，填数字 six 即可；句 26 的 until midnight 是关闭时间，不是开门时间。',
        en: 'Sentence 26: "The transfer walkway opens at six in the morning". In the morning is already printed, so write six only. Until midnight is the closing time, not the opening time.',
      },
    },
    {
      number: 18, accepted: ['lower level'], evidence: 27,
      explanation: {
        zh: '定位句 27：Baggage claim for arriving passengers is on the lower level。两个词；句中 one floor below the main concourse 是对 lower level 的解释，不是答案。',
        en: 'Sentence 27: "Baggage claim for arriving passengers is on the lower level". Write the two-word answer. One floor below the main concourse explains it, but it is not the answer itself.',
      },
    },
    {
      number: 19, accepted: ['10', 'ten'], spoken: 'ten', evidence: 28,
      explanation: {
        zh: '定位句 28：The special assistance desk is staffed until ten at night。空后已印 at night，填数字 ten；午夜关闭的是转机步道，不是协助柜台。',
        en: 'Sentence 28: "The special assistance desk is staffed until ten at night". At night is already printed, so write ten. The walkway closes at midnight, not the assistance desk.',
      },
    },
    {
      number: 20, accepted: ['duty-free'], evidence: 29,
      explanation: {
        zh: '定位句 29：Lost property is handled at the desk next to the duty-free shop。空后已印 shop，填 duty-free；连字符词按一个词计。',
        en: 'Sentence 29: "Lost property is handled at the desk next to the duty-free shop". Shop is already printed, so write duty-free; the hyphenated word counts as one word.',
      },
    },
  ],
  transcript: [
    { speaker: 'announcer', text: 'Attention please, passengers travelling through Willow Creek Terminal Two. This is a short guide to the terminal before your flight.' },
    { speaker: 'announcer', text: 'My name is Daniel, and I will be making a few announcements to help you find your way around.' },
    { speaker: 'announcer', text: 'If you have not checked in yet, please follow the blue signs to the check-in islands on the main concourse.' },
    { speaker: 'announcer', text: 'The counters are arranged in seven islands, lettered from A to G across the hall.' },
    { speaker: 'announcer', text: 'Islands A, B and C serve domestic flights to cities within this province.' },
    { speaker: 'announcer', text: 'You will find the domestic agents beside the large windows overlooking the apron.' },
    { speaker: 'announcer', text: 'Islands D, E and F handle international flights, including long-haul departures to Europe and Asia.' },
    { speaker: 'announcer', text: 'Island G next to the information point is reserved for families travelling with young children.' },
    { speaker: 'announcer', text: 'If you are travelling on a domestic ticket, make sure you go to the correct island, as counters do not switch between the two types.' },
    { speaker: 'announcer', text: 'After check-in, all passengers must pass through security screening before reaching the departure gates.' },
    { speaker: 'announcer', text: 'The standard security lanes are on the left, and they are open to everyone regardless of your ticket.' },
    { speaker: 'announcer', text: 'If you have only hand luggage and no bags to drop, you may use the fast-track lane on the right.' },
    { speaker: 'announcer', text: 'The fast-track lane tends to move more quickly during the morning peak, so it is worth looking for it.' },
    { speaker: 'announcer', text: 'Please have your boarding pass and passport ready, and take laptops and liquids out of your bag.' },
    { speaker: 'announcer', text: 'Any liquids over one hundred millilitres must be left behind or placed in your checked bag.' },
    { speaker: 'announcer', text: 'Connecting passengers should not join the main check-in queue.' },
    { speaker: 'announcer', text: 'Follow the purple transfer signs along the indoor walkway to Terminal One, where your onward gate is located.' },
    { speaker: 'announcer', text: 'The walkway takes about ten minutes on foot, and there is no shuttle bus between the two terminals today.' },
    { speaker: 'announcer', text: 'If you have a long connection, you may rest on the benches outside gate six before continuing.' },
    { speaker: 'announcer', text: 'Passengers who need special assistance, such as a wheelchair or help to board, should use the desk near gate two.' },
    { speaker: 'announcer', text: 'The assistance desk sits opposite the arrivals hall, beside the coffee shop.' },
    { speaker: 'announcer', text: 'If you booked assistance through your airline, please let the desk know as soon as you arrive.' },
    { speaker: 'announcer', text: 'Our assistants will escort you to your gate, and they can also help with boarding at the aircraft door.' },
    { speaker: 'announcer', text: 'Now a few reminders about times and locations around the terminal.' },
    { speaker: 'announcer', text: 'Check-in for international flights closes forty-five minutes before departure, so do not arrive too late.' },
    { speaker: 'announcer', text: 'Domestic check-in closes thirty minutes before take-off, once your bag has been weighed.' },
    { speaker: 'announcer', text: 'The transfer walkway opens at six in the morning and stays open until midnight.' },
    { speaker: 'announcer', text: 'Baggage claim for arriving passengers is on the lower level, one floor below the main concourse.' },
    { speaker: 'announcer', text: 'The special assistance desk is staffed until ten at night, after which you should call the airport help line.' },
    { speaker: 'announcer', text: 'Lost property is handled at the desk next to the duty-free shop, near the main exit.' },
    { speaker: 'announcer', text: 'If an item is found after you leave the terminal, it will be logged at that desk and kept for thirty days.' },
    { speaker: 'announcer', text: 'If you have time before your flight, there are three cafes on this level and a small shop selling local crafts.' },
    { speaker: 'announcer', text: 'The cafe near gate five serves hot meals, while the others offer sandwiches and snacks.' },
    { speaker: 'announcer', text: 'Smoking is permitted only in the marked outdoor area beside gate nine.' },
    { speaker: 'announcer', text: 'Please keep your boarding pass handy, as you will need it again at the gate.' },
    { speaker: 'announcer', text: 'Our staff in the blue uniforms are happy to answer any questions you may have.' },
    { speaker: 'announcer', text: 'If you are unsure about anything, ask before you follow a sign, and do not wait until the last minute.' },
    { speaker: 'announcer', text: 'If you need to contact the airport desk, the number is printed on the back of your boarding pass.' },
    { speaker: 'announcer', text: 'We wish you a safe flight, and thank you for choosing this terminal.' },
    { speaker: 'announcer', text: 'Thank you for flying with us today, and we wish you a pleasant journey.' },
  ],
  vocabulary: [
    {
      term: 'concourse', phonetic: '/ˈkɒŋkɔːs/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '（机场、车站的）大厅，主厅', en: 'the large open hall of an airport or station' },
      usage: { zh: '可数名词；main concourse 指主厅，登机口、值机岛都在其周围。', en: 'Countable. The main concourse is the large hall around which check-in islands and gates are arranged.' },
      collocations: ['the main concourse', 'on the concourse', 'the concourse opens'],
      example: { en: 'Passengers gathered in the concourse before boarding.', zh: '旅客们在大厅集合等待登机。' },
      listening: { zh: '重音在第一音节，结尾 /kɔːs/ 与 course 同音。', en: 'Stress the first syllable; the ending sounds like course.' },
    },
    {
      term: 'domestic', phonetic: '/dəˈmestɪk/', partOfSpeech: 'adj.', sentenceIndex: 4,
      meaning: { zh: '国内的', en: 'relating to flights inside the same country' },
      usage: { zh: '航空场景与 international 对举；domestic flight、domestic terminal。', en: 'In aviation it contrasts with international: a domestic flight, a domestic terminal.' },
      collocations: ['domestic flights', 'a domestic terminal', 'domestic tickets'],
      example: { en: 'Domestic flights arrive at the smaller terminal.', zh: '国内航班在较小的航站楼到达。' },
      listening: { zh: '重音在第二音节 /ˈmes/，开头 /də/ 弱读。', en: 'Stress the second syllable; the opening /də/ is weak.' },
    },
    {
      term: 'international', phonetic: '/ˌɪntəˈnæʃnəl/', partOfSpeech: 'adj.', sentenceIndex: 6,
      meaning: { zh: '国际的', en: 'relating to flights between different countries' },
      usage: { zh: '航空高频词；international flight、international departure。', en: 'Frequent in aviation: an international flight, international departure.' },
      collocations: ['international flights', 'an international terminal', 'international passengers'],
      example: { en: 'International passengers must pass through passport control.', zh: '国际旅客必须经过边检。' },
      listening: { zh: '五个音节，重音在第三 /ˈnæʃ/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'fast-track', phonetic: '/ˈfɑːst træk/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '快速通道', en: 'a lane that lets eligible passengers move through more quickly' },
      usage: { zh: '常作定语：fast-track lane、fast-track security；旅客口语里也直接说 the fast-track。', en: 'Often attributive: a fast-track lane, fast-track security; in speech people say the fast-track itself.' },
      collocations: ['the fast-track lane', 'use the fast-track', 'fast-track security'],
      example: { en: 'Business travellers can use the fast-track lane.', zh: '商务旅客可以走快速通道。' },
      listening: { zh: '两个词都重读，中间停顿很短，不要听成一个形容词。', en: 'Both halves are stressed with a short pause; it is not one adjective.' },
    },
    {
      term: 'boarding pass', phonetic: '/ˈbɔːdɪŋ pɑːs/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '登机牌', en: 'the card that lets a passenger board a plane' },
      usage: { zh: '可数名词；动词短语 board the plane 是登机。', en: 'Countable. The verb phrase board the plane means to get on the aircraft.' },
      collocations: ['your boarding pass', 'show the boarding pass', 'a mobile boarding pass'],
      example: { en: 'Keep your boarding pass ready for the gate check.', zh: '把登机牌准备好，以备登机口查验。' },
      listening: { zh: 'boarding 结尾的 /ɪŋ/ 与 pass 连读，pass 读 /pɑːs/。', en: 'The ending /ɪŋ/ links into pass, pronounced /pɑːs/.' },
    },
    {
      term: 'transfer', phonetic: '/ˈtrænsfɜː/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '转机，换乘', en: 'the act of changing from one flight to another' },
      usage: { zh: '名词重音在第一音节；transfer signs、transfer desk。动词重音在第二音节。', en: 'Noun stress is first syllable: transfer signs, a transfer desk. The verb stresses the second syllable.' },
      collocations: ['the transfer signs', 'a transfer desk', 'a long transfer'],
      example: { en: 'Follow the transfer signs to the next terminal.', zh: '跟着转机指示牌前往下一个航站楼。' },
      listening: { zh: '名词与动词重音不同，靠句子位置判断。', en: 'Noun and verb differ in stress; use the grammar to tell them apart.' },
    },
    {
      term: 'assistance', phonetic: '/əˈsɪstəns/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '协助，帮助（此处指特殊旅客服务）', en: 'help provided to passengers who need support, such as wheelchair users' },
      usage: { zh: '不可数；special assistance、assistance desk 是机场固定说法。', en: 'Uncountable. Special assistance and the assistance desk are standard airport phrases.' },
      collocations: ['special assistance', 'the assistance desk', 'book assistance'],
      example: { en: 'Book assistance if you need a wheelchair at the airport.', zh: '如果在机场需要轮椅，请提前预约协助服务。' },
      listening: { zh: '重音在第二音节 /ˈsɪs/，结尾 /əns/。', en: 'Stress the second syllable; the ending is /əns/.' },
    },
    {
      term: 'duty-free', phonetic: '/ˈdjuːti friː/', partOfSpeech: 'adj.', sentenceIndex: 29,
      meaning: { zh: '免税的（机场免税店）', en: 'sold without tax to passengers leaving a country' },
      usage: { zh: 'duty-free shop 是机场固定搭配；名词说法 duty-free goods。', en: 'A duty-free shop is the standard phrase; duty-free goods are the items sold.' },
      collocations: ['the duty-free shop', 'duty-free goods', 'buy duty-free'],
      example: { en: 'The duty-free shop is near the main exit.', zh: '免税店就在主出口附近。' },
      listening: { zh: 'duty 读 /ˈdjuːti/，不要和 dirty 混淆。', en: 'Duty is /ˈdjuːti/, not dirty.' },
    },
  ],
  expressions: [
    {
      phrase: 'find your way around', sentenceIndex: 1,
      meaning: { zh: '认路，熟悉周围环境', en: 'to learn where places are in an unfamiliar building' },
      usage: { zh: '及物短语动词；find your way around the terminal、find your way around a city。', en: 'Transitive: find your way around the terminal or around a city.' },
      example: { en: 'The map helps you find your way around the campus.', zh: '这张地图帮你熟悉校园的路。' },
    },
    {
      phrase: 'checked in', sentenceIndex: 2,
      meaning: { zh: '办理值机，办理登机手续', en: 'to complete the formalities before a flight' },
      usage: { zh: '短语动词；check in at the island、check your bag。名词形式 check-in。', en: 'Phrasal verb: check in at the island, check your bag. The noun is check-in.' },
      example: { en: 'Have you checked in for your flight yet?', zh: '你办登机手续了吗？' },
    },
    {
      phrase: 'on foot', sentenceIndex: 17,
      meaning: { zh: '步行', en: 'by walking rather than by vehicle' },
      usage: { zh: '固定介词短语；on foot 前不加 by。', en: 'Fixed phrase; do not say by on foot.' },
      example: { en: 'The hotel is ten minutes on foot from the station.', zh: '酒店步行到车站要十分钟。' },
    },
    {
      phrase: 'as soon as', sentenceIndex: 21,
      meaning: { zh: '一……就……', en: 'at the moment when, immediately after' },
      usage: { zh: '引导时间状语从句；as soon as you arrive、as soon as possible。', en: 'Introduces a time clause: as soon as you arrive, as soon as possible.' },
      example: { en: 'Call us as soon as you reach the gate.', zh: '一到登机口就给我们打电话。' },
    },
    {
      phrase: 'regardless of', sentenceIndex: 10,
      meaning: { zh: '不管，不论', en: 'without being affected by something' },
      usage: { zh: '后接名词；regardless of your ticket、regardless of the weather。', en: 'Follow with a noun: regardless of your ticket, regardless of the weather.' },
      example: { en: 'The lane is open to everyone regardless of ticket type.', zh: '这条通道对所有人开放，与票种无关。' },
    },
    {
      phrase: 'keep your boarding pass handy', sentenceIndex: 34,
      meaning: { zh: '放在手边备用', en: 'to keep something where you can reach it easily' },
      usage: { zh: 'handy 是形容词；keep something handy、have something handy。', en: 'Handy is an adjective: keep something handy, have something handy.' },
      example: { en: 'Keep your passport handy until you reach the gate.', zh: '把护照放在手边，直到登机口。' },
    },
  ],
  tips: [
    {
      title: { zh: '先在地图上标位置', en: 'Mark the locations first' },
      body: {
        zh: 'Part 2 独白没有提问来提示进度。听前把题干里的地点（值机岛、协助柜台、行李提取、免税店）在笔记旁画成简图，听到方位词 opposite、beside、next to、near 时直接对号入座。',
        en: 'There is no question to signal progress. Before listening, sketch the locations from the stems beside your notes, and match direction words such as opposite, beside, next to and near as you hear them.',
      },
    },
    {
      title: { zh: '数字题分清适用对象', en: 'Match the number to its flight type' },
      body: {
        zh: 'forty-five minutes 是国际航班截止时间，thirty minutes 是国内航班；six in the morning 是步道开门，ten at night 是协助柜台下班。落笔前先确认这个数字服务于哪一条。',
        en: 'Forty-five minutes is the international deadline and thirty minutes is domestic; six in the morning opens the walkway and ten at night closes the assistance desk. Confirm what each number applies to before writing it.',
      },
    },
    {
      title: { zh: '干扰项常是另一条规则', en: 'Distractors are other rules' },
      body: {
        zh: '机场广播里每条规则都有适用人群：家庭旅客去 G 岛，手提行李旅客走快速通道，转机旅客走步道。选项往往把另一群人的规则安到题干人群上，听时抓住条件句 if you… 的主语。',
        en: 'Every rule applies to a group: families use island G, hand luggage travellers use the fast-track lane, transfer passengers use the walkway. Options often attach one group’s rule to the stem’s group; watch the subject of each if you… clause.',
      },
    },
  ],
};
