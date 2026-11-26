import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 47 · Part 4 — 讲座：电话交换机。原创仿真材料，非官方真题。
 *
 * 结构：开场概览人工接线、自动交换、网络演进与社会影响（单选 31–34）→
 * 人工总机接线员 → 自动交换机与脉冲拨号 → 干线互联与全国网络 → 商业与家庭联系；
 * 后半段复述笔记要点（填空 35–40）：接线员、接线面板、拨号号码、网络、长途成本、商业安排。
 * 单选块在前，填空块在后。开场用提问引入，不用 Today's lecture is about 句式。
 */
export const test47Part4: ListeningLesson = {
  slug: 'test-47-part-4',
  part: 4,
  status: 'published',
  title: { zh: '电话交换机', en: 'The telephone exchange' },
  summary: {
    zh: '讲座回顾电话交换史：早期呼叫由人工接线员在总机面板插线接通；自动交换机按拨号号码经步进开关路由呼叫，取代大部分人工操作；干线把城镇连成更大网络，使更远距离的通话成为可能；随着设备改进长途成本下降，电话改变了商业往来与家庭联络方式。后半段复述接线员、面板、号码、网络、长途成本与商业安排等笔记要点。',
    en: 'The lecture traces telephone switching: manual operators plugged cords on a switchboard; automatic exchanges routed calls by dialed number through stepping switches; trunk lines joined towns into a larger network; as equipment improved, long distance cost fell, changing business and family contact. The recap restates operator, panel, number, network, distance cost and business notes.',
  },
  accent: { zh: '讲师为美式口音，语速平稳，历史设备与术语处会放慢。', en: 'The lecturer speaks with an American accent at a steady pace, slowing down for equipment names and technical terms.' },
  speechRate: '+8%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 31,
          stem: 'What did early telephone operators do?',
          options: [
            { key: 'A', text: 'They fixed the cables under the streets.' },
            { key: 'B', text: 'They connected each caller to the right line by hand.' },
            { key: 'C', text: 'They billed households for their monthly calls.' },
          ],
        },
        {
          number: 32,
          stem: 'What did the automatic exchange replace?',
          options: [
            { key: 'A', text: 'Manual operators plugging cords into the board.' },
            { key: 'B', text: 'Trunk cables that linked distant towns.' },
            { key: 'C', text: 'Private telephones kept in family halls.' },
          ],
        },
        {
          number: 33,
          stem: 'Why did networks grow from local to national?',
          options: [
            { key: 'A', text: 'To reduce the number of phones in each town.' },
            { key: 'B', text: 'To let operators rest during busy peak hours.' },
            { key: 'C', text: 'To connect more callers across distant towns.' },
          ],
        },
        {
          number: 34,
          stem: 'What social impact did the telephone network bring?',
          options: [
            { key: 'A', text: 'It ended all travel between neighbouring towns.' },
            { key: 'B', text: 'It changed how businesses and families stayed in touch.' },
            { key: 'C', text: 'It forced every household to share one public phone.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Early calls were connected by a human', cells: [[{ blank: 35 }]] },
        { lead: 'Operators plugged cords into a switchboard', cells: [[{ blank: 36 }]] },
        { lead: 'Automatic systems routed calls by the dialed', cells: [[{ blank: 37 }]] },
        { lead: 'Trunk lines linked towns into a larger', cells: [[{ blank: 38 }]] },
        { lead: 'The network made long distance feel less', cells: [[{ blank: 39 }]] },
        { lead: 'Telephone access changed how people arranged their', cells: [[{ blank: 40 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['B'], evidence: 10,
      explanation: {
        zh: '定位句 10：Early calls were connected by a human operator, who sat facing a large board of sockets。早期接线员手工把呼叫接到对应线路，对应 B。A 的地下电缆维修与 C 的按月计费在录音中均未出现。',
        en: 'Sentence 10: "Early calls were connected by a human operator, who sat facing a large board of sockets". Operators connected callers by hand, matching B. Street cable repair and monthly billing are not mentioned.',
      },
    },
    {
      number: 32, accepted: ['A'], evidence: 20,
      explanation: {
        zh: '定位句 20：The next step was the automatic exchange, which removed most manual work from the call。自动交换取代的是人工插线接线，对应 A。B 的干线电缆是网络互联阶段，C 的家庭共用电话是普及阶段的现象，均不是被取代对象。',
        en: 'Sentence 20: "The next step was the automatic exchange, which removed most manual work from the call". The automatic exchange replaced manual cord work, matching A. Trunk cables belong to the network stage, and shared hall phones to the access stage.',
      },
    },
    {
      number: 33, accepted: ['C'], evidence: 31,
      explanation: {
        zh: '定位句 31：The reason was simple, to connect more callers across distant towns, not just neighbours on the same street。网络走向全国是为连接更远城镇的更多用户，对应 C。A 的减少电话数量与 B 的让接线员休息在录音中均未出现。',
        en: 'Sentence 31: "The reason was simple, to connect more callers across distant towns, not just neighbours on the same street". Growth connected more distant callers, matching C. Reducing phones and operator rest are not mentioned.',
      },
    },
    {
      number: 34, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：Families arranged visits, relayed news and kept in touch across towns they could not visit weekly。电话改变了商业与家庭的联络方式，对应 B。A 的终止跨镇出行与句 35 的安排探访相反，C 的强制共用电话在录音中没有依据。',
        en: 'Sentence 35: "Families arranged visits, relayed news and kept in touch across towns they could not visit weekly". The network changed business and family contact, matching B. Ending all travel contradicts arranging visits, and forced shared phones are not said.',
      },
    },
    {
      number: 35, accepted: ['operator'], evidence: 44,
      explanation: {
        zh: '定位句 44：Early calls were connected by a human operator sitting at a board of sockets。早期呼叫由人工接线员接通，填 operator。',
        en: 'Sentence 44: "Early calls were connected by a human operator sitting at a board of sockets". Calls were connected by an operator, so write operator.',
      },
    },
    {
      number: 36, accepted: ['panel'], evidence: 45,
      explanation: {
        zh: '定位句 45：Operators plugged cords into a switchboard panel, joining caller and called line。接线员把线插入总机面板，填 panel。',
        en: 'Sentence 45: "Operators plugged cords into a switchboard panel, joining caller and called line". Cords went into the switchboard panel, so write panel.',
      },
    },
    {
      number: 37, accepted: ['number'], evidence: 46,
      explanation: {
        zh: '定位句 46：Automatic systems routed each call by the dialed number through stepping switches。自动系统按拨号号码路由呼叫，填 number。',
        en: 'Sentence 46: "Automatic systems routed each call by the dialed number through stepping switches". Calls route by the dialed number, so write number.',
      },
    },
    {
      number: 38, accepted: ['network'], evidence: 47,
      explanation: {
        zh: '定位句 47：Trunk lines linked separate towns into a larger network carrying many calls together。干线把城镇连成更大网络，填 network。',
        en: 'Sentence 47: "Trunk lines linked separate towns into a larger network carrying many calls together". Trunk lines form a larger network, so write network.',
      },
    },
    {
      number: 39, accepted: ['costly'], evidence: 48,
      explanation: {
        zh: '定位句 48：The network made long distance feel less costly as equipment improved over the decades。网络让长途不再那么昂贵，空前是 less，填 costly。',
        en: 'Sentence 48: "The network made long distance feel less costly as equipment improved over the decades". Long distance felt less costly; less precedes the gap, so write costly.',
      },
    },
    {
      number: 40, accepted: ['business'], evidence: 49,
      explanation: {
        zh: '定位句 49：Telephone access changed how people arranged their business and their family visits。电话改变了人们安排商业与家庭探访的方式，填 business。',
        en: 'Sentence 49: "Telephone access changed how people arranged their business and their family visits". Access changed how business was arranged, so write business.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Before you pick up a phone, consider how your voice first reached another house.' },
    { speaker: 'lecturer', text: 'For most of the last century, that journey went through a building filled with people at boards.' },
    { speaker: 'lecturer', text: 'This lecture follows the telephone exchange from manual switchboards to the digital networks of today.' },
    { speaker: 'lecturer', text: 'We will cover early operators, automatic switching, the growth of trunk lines, and the social effects along the way.' },
    { speaker: 'lecturer', text: 'Before the details, a few broad conclusions are worth noting in order.' },
    { speaker: 'lecturer', text: 'The earliest calls did not connect by themselves; a human operator sat between the two callers.' },
    { speaker: 'lecturer', text: 'The switchboard later gave way to automatic machines that routed calls without hands on the cords.' },
    { speaker: 'lecturer', text: 'Networks then joined towns together, until a caller could reach people far beyond the local street.' },
    { speaker: 'lecturer', text: 'The telephone changed not only technology, but how businesses and families kept in touch.' },
    { speaker: 'lecturer', text: 'We begin with the manual exchange, the room where operators worked in shifts.' },
    { speaker: 'lecturer', text: 'Early calls were connected by a human operator, who sat facing a large board of sockets.' },
    { speaker: 'lecturer', text: 'A caller picked up the receiver and spoke the name or number of the person they wanted.' },
    { speaker: 'lecturer', text: 'The operator looked that name up and plugged cords into a switchboard panel.' },
    { speaker: 'lecturer', text: 'One cord joined the caller to the board, and another reached the line of the person called.' },
    { speaker: 'lecturer', text: 'When the two sides were connected, the operator stayed available to drop the line when the call ended.' },
    { speaker: 'lecturer', text: 'Operators learned local names and addresses, so repeat callers were recognised quickly.' },
    { speaker: 'lecturer', text: 'The work demanded fast hands, a good memory and a calm voice during busy hours.' },
    { speaker: 'lecturer', text: 'At peak times the board was crowded, and waiting callers heard only the operator’s ring back tone.' },
    { speaker: 'lecturer', text: 'This system served towns well, but it could not scale to every new household on its own.' },
    { speaker: 'lecturer', text: 'As more homes installed phones, the cost of hiring enough operators grew fast.' },
    { speaker: 'lecturer', text: 'The next step was the automatic exchange, which removed most manual work from the call.' },
    { speaker: 'lecturer', text: 'Automatic systems routed calls by the dialed number, stepping switches that moved across the board.' },
    { speaker: 'lecturer', text: 'A dial sent a series of pulses, and the machine matched those pulses to the right socket.' },
    { speaker: 'lecturer', text: 'Operators still handled some calls, such as long distance ones and troubles with the line.' },
    { speaker: 'lecturer', text: 'The machine could connect far more calls each hour than a room of cord operators could.' },
    { speaker: 'lecturer', text: 'Equipment filled whole buildings, with relays and racks arranged along the walls.' },
    { speaker: 'lecturer', text: 'Maintenance staff watched the switches day and night, replacing worn parts before they failed.' },
    { speaker: 'lecturer', text: 'Even early automatic systems worked only inside one town, or a small group of nearby towns.' },
    { speaker: 'lecturer', text: 'To reach distant places, calls still passed through operators between local boards.' },
    { speaker: 'lecturer', text: 'Trunk lines linked towns into a larger network, carrying many calls at once over shared cables.' },
    { speaker: 'lecturer', text: 'As trunk lines spread, networks grew from local exchanges toward a national system.' },
    { speaker: 'lecturer', text: 'The reason was simple, to connect more callers across distant towns, not just neighbours on the same street.' },
    { speaker: 'lecturer', text: 'Long distance calls were still priced high at first, so households used them for urgent matters.' },
    { speaker: 'lecturer', text: 'Over time, equipment improved and the cost per call dropped, widening who could call far away.' },
    { speaker: 'lecturer', text: 'Business offices relied on the network to place orders and check stock without travelling.' },
    { speaker: 'lecturer', text: 'Families arranged visits, relayed news and kept in touch across towns they could not visit weekly.' },
    { speaker: 'lecturer', text: 'The telephone changed the pace of daily life, because replies no longer waited for the post.' },
    { speaker: 'lecturer', text: 'Villages with a local exchange could trade and hire people from a wider region.' },
    { speaker: 'lecturer', text: 'The network also carried news that would otherwise have travelled slowly by road.' },
    { speaker: 'lecturer', text: 'Not every effect was immediate. Many households kept a shared phone in the hall for years.' },
    { speaker: 'lecturer', text: 'Access was unequal at first, with richer districts wired before smaller homes in outer streets.' },
    { speaker: 'lecturer', text: 'Still, the direction of change was clear, toward a system any household could join.' },
    { speaker: 'lecturer', text: 'The notes section comes next, so keep those restated points in view.' },
    { speaker: 'lecturer', text: 'Each restated sentence belongs under one note heading.' },
    { speaker: 'lecturer', text: 'Early calls were connected by a human operator sitting at a board of sockets.' },
    { speaker: 'lecturer', text: 'Operators plugged cords into a switchboard panel, joining caller and called line.' },
    { speaker: 'lecturer', text: 'Automatic systems routed each call by the dialed number through stepping switches.' },
    { speaker: 'lecturer', text: 'Trunk lines linked separate towns into a larger network carrying many calls together.' },
    { speaker: 'lecturer', text: 'The network made long distance feel less costly as equipment improved over the decades.' },
    { speaker: 'lecturer', text: 'Telephone access changed how people arranged their business and their family visits.' },
    { speaker: 'lecturer', text: 'Each stage replaced a weak point of the system that came before it.' },
    { speaker: 'lecturer', text: 'Operators handled the first connections, then machines took over the routine routing.' },
    { speaker: 'lecturer', text: 'Trunk lines joined the exchanges, and wider access changed the social life around the phone.' },
    { speaker: 'lecturer', text: 'Without these steps, trade, family contact and daily coordination would have run far more slowly.' },
    { speaker: 'lecturer', text: 'In the next session we will look at how digital exchanges changed routing once again.' },
    { speaker: 'lecturer', text: 'We will stop at that point. The next session takes the idea further.' },
  ],
  vocabulary: [
    {
      term: 'operator', phonetic: '/ˈɒpəreɪtər/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '接线员，人工总机话务员', en: 'the person who connected calls by hand at the board' },
      usage: { zh: '可数；a human operator、the operator’s tone。', en: 'Countable: a human operator, the operator’s tone.' },
      collocations: ['a human operator', 'the operator connected', 'cord operators'],
      example: { en: 'A human operator connected each early call by hand.', zh: '早期每通电话都由人工接线员接通。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈɒp/。', en: 'Four syllables with first-syllable stress.' },
    },
    {
      term: 'switchboard', phonetic: '/ˈswɪtʃbɔːrd/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '总机，接线面板（插线接通呼叫的设备）', en: 'the manual board of sockets where cords were plugged' },
      usage: { zh: '可数；the switchboard panel、on the switchboard。复合词。', en: 'Countable: the switchboard panel. A compound word.' },
      collocations: ['the switchboard panel', 'on the switchboard', 'the manual switchboard'],
      example: { en: 'Cords were plugged into the switchboard panel by hand.', zh: '线绳由手工插入总机面板。' },
      listening: { zh: '复合词，重音在第一词 switch；board 读 /bɔːrd/。', en: 'Compound with stress on switch; board is /bɔːrd/.' },
    },
    {
      term: 'trunk lines', phonetic: '/trʌŋk laɪnz/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '干线（连接各城镇交换局的共享线路）', en: 'the shared cables linking local exchanges across towns' },
      usage: { zh: '复数；trunk lines、the trunk network。', en: 'Plural: trunk lines, the trunk network.' },
      collocations: ['trunk lines', 'the trunk lines linked', 'trunk cables'],
      example: { en: 'Trunk lines linked towns into a larger telephone network.', zh: '干线把各城镇连成更大的电话网络。' },
      listening: { zh: 'trunk 单音节 /trʌŋk/；lines 结尾 /z/。', en: 'trunk is one syllable /trʌŋk/; lines ends in /z/.' },
    },
    {
      term: 'relays', phonetic: '/ˈriːleɪz/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '继电器（自动交换机里的开关元件）', en: 'the electromechanical switch inside an automatic exchange' },
      usage: { zh: '可数；relays and racks、a worn relay。', en: 'Countable: relays and racks, a worn relay.' },
      collocations: ['relays and racks', 'the relays', 'a worn relay'],
      example: { en: 'Relays and racks filled the automatic exchange buildings.', zh: '继电器与机架摆满自动交换机房。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈriː/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'pulses', phonetic: '/ˈpʌlsɪz/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '脉冲（拨号发出的一串电信号）', en: 'the signal pulses a dial sends to match the socket' },
      usage: { zh: '可数；a series of pulses、those pulses。', en: 'Countable: a series of pulses, those pulses.' },
      collocations: ['a series of pulses', 'those pulses', 'dial pulses'],
      example: { en: 'The dial sent pulses that the machine matched to the socket.', zh: '拨号发出脉冲，机器据此匹配插孔。' },
      listening: { zh: '单音节，元音 /ʌ/，结尾 /s/ 读出来。', en: 'One syllable with /ʌ/; pronounce the final /s/.' },
    },
    {
      term: 'exchange', phonetic: '/ɪksˈtʃeɪndʒ/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '交换局，电话转接机房', en: 'the building and equipment that routes calls between lines' },
      usage: { zh: '可数；the automatic exchange、the manual exchange。动词 exchange 另有“交换”义。', en: 'Countable: the automatic exchange. The verb means trade.' },
      collocations: ['the automatic exchange', 'the manual exchange', 'the exchange building'],
      example: { en: 'The automatic exchange removed most manual cord work.', zh: '自动交换局省去了大部分人工插线。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈtʃeɪndʒ/。', en: 'Two syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'gave way to', sentenceIndex: 6,
      meaning: { zh: '让位于，被……取代', en: 'to be replaced gradually by the newer machine' },
      usage: { zh: 'give way to + 名词；过去式 gave way to。', en: 'Give way to plus a noun; past form gave way to.' },
      example: { en: 'The manual switchboard gave way to automatic machines.', zh: '人工总机让位于自动机器。' },
    },
    {
      phrase: 'plugged cords into', sentenceIndex: 12,
      meaning: { zh: '把线绳插入（插孔）', en: 'to push the connecting cords into the board sockets' },
      usage: { zh: 'plug something into；接线场景高频。', en: 'Plug something into; common with wiring.' },
      example: { en: 'Operators plugged cords into the switchboard panel.', zh: '接线员把线绳插入总机面板。' },
    },
    {
      phrase: 'routed each call by', sentenceIndex: 46,
      meaning: { zh: '按……路由呼叫', en: 'to direct a call through the machine using a dialed value' },
      usage: { zh: 'route a call by + 号码；交换技术高频。', en: 'Route a call by plus a number; common in switching.' },
      example: { en: 'The machine routed each call by the dialed number.', zh: '机器按拨号号码接通每通呼叫。' },
    },
    {
      phrase: 'kept in touch', sentenceIndex: 35,
      meaning: { zh: '保持联络，互通消息', en: 'to stay in contact across a distance' },
      usage: { zh: 'keep in touch with + 人；社交场景高频。', en: 'Keep in touch with someone; common socially.' },
      example: { en: 'Families kept in touch across towns by telephone.', zh: '家庭靠电话跨城镇保持联络。' },
    },
    {
      phrase: 'at peak times', sentenceIndex: 17,
      meaning: { zh: '在高峰时段', en: 'during the busiest hours for call volume' },
      usage: { zh: '时间状语；at peak times、during peak hours。', en: 'Adverbial: at peak times, during peak hours.' },
      example: { en: 'At peak times the switchboard board was crowded.', zh: '高峰时段总机面板挤满呼叫。' },
    },
    {
      phrase: 'carrying many calls at once', sentenceIndex: 29,
      meaning: { zh: '同时承载多通呼叫', en: 'to hold several calls together over one shared cable' },
      usage: { zh: 'carry + 呼叫；线路容量高频。', en: 'Carry plus calls; common with line capacity.' },
      example: { en: 'Trunk cables carry many calls at once between towns.', zh: '干线在城镇间同时承载多通呼叫。' },
    },
  ],
  tips: [
    {
      title: { zh: '概览句先答单选，复述段再填笔记', en: 'Overview sentences feed the choice items' },
      body: {
        zh: 'Part 4 开头几句话给出总体脉络，31 到 34 题集中在概览段；35 到 40 题的术语在后面复述段。听到 Now the notes section follows 这类路标时，再开始盯填空答案词。',
        en: 'The opening sentences give the overview, and items 31 to 34 sit there; the terms for 35 to 40 appear in the restatement section later. Start watching for completion answers only after a signpost such as Now the notes section follows.',
      },
    },
    {
      title: { zh: '预判词性再等答案词', en: 'Predict the word class before listening' },
      body: {
        zh: '第 35 题空前是 human，填名词 operator；第 37 题空前是 dialed，填名词 number；第 39 题空前是 less，填形容词 costly。听前把词性写在空格旁，录音里只等那一类词。',
        en: 'Item 35 follows human, expecting a noun; item 37 follows dialed, expecting a noun; item 39 follows less, expecting an adjective. Note the predicted word class beside each gap before listening.',
      },
    },
    {
      title: { zh: '按技术演进阶段定位题目', en: 'Locate items along the technology stages' },
      body: {
        zh: '人工接线 → 自动交换 → 干线联网 → 社会影响，四阶段依次出现。单选与笔记都沿这条链走；听到 operator、automatic exchange、trunk lines、business 这些路标时回到对应阶段，不要把上一阶段的设备填进下一阶段。',
        en: 'The chain runs manual operators, automatic exchange, trunk network, social impact. Both choices and notes follow it; on a signpost such as operator, automatic exchange, trunk lines or business, return to that stage, rather than carrying the previous device forward.',
      },
    },
  ],
};
