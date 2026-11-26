import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 30 · Part 4 — 讲座：邮政服务史（单人，加拿大口音）。原创仿真材料，非官方真题。
 *
 * 结构：早期邮路与班次 → 到付资费问题 → 邮票改革与预付制 → 商业信息传播 →
 * 早期系统两大特征（多选 36–37）→ 问题成因、改革意义与讲座结论（单选 38–40）。
 */
export const test30Part4: ListeningLesson = {
  slug: 'test-30-part-4',
  part: 4,
  status: 'published',
  title: { zh: '邮政史', en: 'The history of the postal service' },
  summary: {
    zh: '讲座回顾邮政服务的早期邮路与班次、按距离和重量计费、由收件人付费带来的退回问题、邮票改革如何实现预付低价平信，以及邮政对商业信息传播的作用；归纳早期系统两大特征，并点评到付制度的局限与邮政对现代信息社会的塑造。',
    en: 'The lecture traces early post routes and schedules, distance-and-weight charges, the problems caused by recipient payment, how the stamp reform enabled prepayment at low flat rates, and the post’s role in spreading commercial information; it lists two early-system features, then reviews the limitations of recipient pay and the service’s shaping of the modern information society.',
  },
  accent: { zh: '男讲师为加拿大口音，语速平稳，术语会重复。', en: 'A male lecturer with a Canadian accent. He speaks steadily and repeats key terms.' },
  speechRate: '+5%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Early post was carried along official', cells: [[{ blank: 31 }]] },
        { lead: 'Charges were paid by the', cells: [[{ blank: 32 }]] },
        { lead: 'The reform lowered the cost of each', cells: [[{ blank: 33 }]] },
        { lead: 'The first adhesive stamp showed the monarch’s', cells: [[{ blank: 34 }]] },
        { lead: 'Post transformed the spread of commercial', cells: [[{ blank: 35 }]] },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which TWO features did early postal systems have? Choose TWO letters, A–F.',
      select: 2,
      stem: 'Which TWO features did early postal systems have?',
      options: [
        { key: 'A', text: 'fixed schedules between towns' },
        { key: 'B', text: 'private couriers for all mail' },
        { key: 'C', text: 'roads reserved for post riders' },
        { key: 'D', text: 'charges based on distance and weight' },
        { key: 'E', text: 'free delivery to every farm' },
        { key: 'F', text: 'stamps printed in advance' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 38,
          stem: 'Why did payment by recipient cause a problem?',
          options: [
            { key: 'A', text: 'the receiver could refuse it and the mail went back' },
            { key: 'B', text: 'the sender had to wait at the post office' },
            { key: 'C', text: 'the rider collected the fee by post' },
          ],
        },
        {
          number: 39,
          stem: 'What did the stamp reform make possible?',
          options: [
            { key: 'A', text: 'free delivery to every household' },
            { key: 'B', text: 'prepayment at low flat rates' },
            { key: 'C', text: 'stamps printed with the sender’s name' },
          ],
        },
        {
          number: 40,
          stem: 'What is the lecturer’s main point about the postal service?',
          options: [
            { key: 'A', text: 'it replaced all private courier networks' },
            { key: 'B', text: 'it shaped the modern information society' },
            { key: 'C', text: 'it developed after the telegraph arrived' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['routes'], evidence: 4,
      explanation: {
        zh: '定位句 4：messengers rode between towns on recognised routes。早期邮件沿官方线路运送，填 routes；句 5 的 staging posts 是中途换马点，不是线路本身。',
        en: 'Sentence 4: "messengers rode between towns on recognised routes". Early mail ran along official routes, so fill routes. The staging posts in sentence 5 are horse-change stops, not the routes themselves.',
      },
    },
    {
      number: 32, accepted: ['recipient'], evidence: 11,
      explanation: {
        zh: '定位句 11：Charges were paid by the recipient rather than the sender。费用由收件人支付，填 recipient；句 13 的 refused 是收件人拒付行为，不是付费主体。',
        en: 'Sentence 11: "Charges were paid by the recipient rather than the sender". The charge was paid by the recipient, so fill recipient. Refused in sentence 13 describes rejection, not who paid.',
      },
    },
    {
      number: 33, accepted: ['letter'], evidence: 21,
      explanation: {
        zh: '定位句 21：The reform lowered the cost of each letter。改革降低每封信的费用，填 letter；句 29 的 printed circulars 是随同一网络寄送的印刷品。',
        en: 'Sentence 21: "The reform lowered the cost of each letter". The reform cut the cost per letter, so fill letter. Printed circulars in sentence 29 travelled the same network but are not the answer.',
      },
    },
    {
      number: 34, accepted: ['head'], evidence: 19,
      explanation: {
        zh: '定位句 19：The first adhesive stamp showed the head of the monarch, the familiar profile。邮票图案是君主头像，填 head；句 20 的 adhesive 指粘贴方式，不是图案内容。',
        en: 'Sentence 19: "The first adhesive stamp showed the head of the monarch, the familiar profile". The stamp showed the monarch’s head, so fill head. Adhesive in sentence 20 describes how it stuck, not the image.',
      },
    },
    {
      number: 35, accepted: ['information'], evidence: 27,
      explanation: {
        zh: '定位句 27：The post transformed the spread of commercial information, from prices and new products to job notices。邮政推动商业信息传播，填 information；句 28 的 prices 是信息举例。',
        en: 'Sentence 27: "The post transformed the spread of commercial information, from prices and new products to job notices". The post spread commercial information, so fill information. Prices in sentence 28 are examples of that information.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 33,
      explanation: {
        zh: '定位句 33：The first was fixed schedules between towns, so senders could plan around a known departure day。早期特征之一是城际固定班次，对应 A。',
        en: 'Sentence 33: "The first was fixed schedules between towns, so senders could plan around a known departure day". One early feature was fixed inter-town schedules, matching A.',
      },
    },
    {
      number: 37, accepted: ['D'], evidence: 34,
      explanation: {
        zh: '定位句 34：The second was charges based on distance and weight, before any flat per-letter rate existed。第二条特征是按距离与重量计费，对应 D。B、C、E、F 在句 35–37 被分别否定。',
        en: 'Sentence 34: "The second was charges based on distance and weight, before any flat per-letter rate existed". The second feature was distance-and-weight charges, matching D. B, C, E and F are rejected in sentences 35 to 37.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 39,
      explanation: {
        zh: '定位句 39：Recipient refusal meant outgoing mail often returned unpaid, and riders repeated the journey for nothing。收件人可拒付，邮件退回，对应 A。B 的寄件人在邮局等候、C 的骑手邮寄收费均未提到。',
        en: 'Sentence 39: "Recipient refusal meant outgoing mail often returned unpaid, and riders repeated the journey for nothing". Refusal sent the mail back, matching A. The sender waiting at the post office in B and the rider posting the fee in C are not mentioned.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 41,
      explanation: {
        zh: '定位句 41：The stamp reform changed this by allowing prepayment at low flat rates before the letter left the sender’s hands。邮票改革让寄件人可按低廉统一费率预付，对应 B。A 的免费投递、C 的寄件人姓名印上邮票均未出现。',
        en: 'Sentence 41: "The stamp reform changed this by allowing prepayment at low flat rates before the letter left the sender’s hands". The reform enabled prepayment at low flat rates, matching B. Free household delivery in A and the sender’s name on stamps in C are not mentioned.',
      },
    },
    {
      number: 40, accepted: ['B'], evidence: 46,
      explanation: {
        zh: '定位句 46：the postal service shaped the modern information society more than earlier accounts sometimes admit。讲师的核心观点是邮政塑造了现代信息社会，对应 B。A 说取代全部私人信使、C 说在电报之后才发展，均与讲座相反。',
        en: 'Sentence 46: "the postal service shaped the modern information society more than earlier accounts sometimes admit". The lecturer’s main claim is that the post shaped the information society, matching B. Replacing all couriers in A and developing after the telegraph in C contradict the lecture.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'How did a letter travel from one town to another two hundred years ago, before trains, telegrams and parcel vans?' },
    { speaker: 'lecturer', text: 'The story of the postal service is not only about letters and stamps.' },
    { speaker: 'lecturer', text: 'It traces how governments organised the movement of information across growing distances.' },
    { speaker: 'lecturer', text: 'I’ll begin with the early post roads and riders, then cover the charge system, the stamp reform, and the postal service’s place in the information society.' },
    { speaker: 'lecturer', text: 'In the earliest organised systems, messengers rode between towns on recognised routes.' },
    { speaker: 'lecturer', text: 'Official post routes linked the main market towns, and riders changed horses at staging posts along the way.' },
    { speaker: 'lecturer', text: 'Carriers also walked or rode on foot paths that farmers and traders already used.' },
    { speaker: 'lecturer', text: 'The first regular schedules meant mail left town on fixed days rather than whenever a rider was free.' },
    { speaker: 'lecturer', text: 'Before national mail services, much local message carrying was done by private couriers on market days.' },
    { speaker: 'lecturer', text: 'The cost of sending a letter depended on how far it travelled and how heavy the folded packet was.' },
    { speaker: 'lecturer', text: 'A short note to the next town cost little, while a thick packet to a distant city could be expensive.' },
    { speaker: 'lecturer', text: 'Charges were paid by the recipient rather than the sender, so the receiver settled the amount when the letter arrived.' },
    { speaker: 'lecturer', text: 'This arrangement created real problems for people on low incomes.' },
    { speaker: 'lecturer', text: 'If a household could not pay on delivery, the letter was refused and sent back along the same route.' },
    { speaker: 'lecturer', text: 'The rider then wasted the outward trip, and the writer never learned whether the message had reached anyone.' },
    { speaker: 'lecturer', text: 'Letters also accumulated at town offices while families decided whether they could afford the charge.' },
    { speaker: 'lecturer', text: 'Reformers argued that a predictable, cheap system would encourage more people to write and read mail.' },
    { speaker: 'lecturer', text: 'The key change was letting the sender pay in advance, instead of billing the person who opened the letter.' },
    { speaker: 'lecturer', text: 'To make prepayment simple, authorities issued a small adhesive stamp that showed payment had been made.' },
    { speaker: 'lecturer', text: 'The first adhesive stamp showed the head of the monarch, the familiar profile that collectors still study today.' },
    { speaker: 'lecturer', text: 'A stamped letter could then travel through the network without another charge waiting at the door.' },
    { speaker: 'lecturer', text: 'The reform lowered the cost of each letter, especially for ordinary correspondents who wrote regularly.' },
    { speaker: 'lecturer', text: 'Post offices also introduced dated marks to show where and when a letter had entered the system.' },
    { speaker: 'lecturer', text: 'These marks let officials trace a packet if it went missing on a long route.' },
    { speaker: 'lecturer', text: 'As roads improved, mail coaches carried bags between larger towns at set times each day.' },
    { speaker: 'lecturer', text: 'Coaches worked to a timetable, and passengers sometimes travelled alongside the mail bags.' },
    { speaker: 'lecturer', text: 'The system connected provincial papers with city readers, and advertisements moved between markets more quickly.' },
    { speaker: 'lecturer', text: 'The post transformed the spread of commercial information, from prices and new products to job notices.' },
    { speaker: 'lecturer', text: 'Merchants could compare prices across regions, and farmers learned about supply in neighbouring towns.' },
    { speaker: 'lecturer', text: 'Newspapers and printed circulars travelled the same routes once the charge per sheet had been settled.' },
    { speaker: 'lecturer', text: 'Literacy rose alongside the mail, as more people had reason to read letters sent to their own household.' },
    { speaker: 'lecturer', text: 'Governments used the network to collect tax notices, official forms and public announcements from one region to another.' },
    { speaker: 'lecturer', text: 'The early postal systems had two features worth keeping in mind when we compare them with later services.' },
    { speaker: 'lecturer', text: 'The first was fixed schedules between towns, so senders could plan around a known departure day.' },
    { speaker: 'lecturer', text: 'The second was charges based on distance and weight, before any flat per-letter rate existed.' },
    { speaker: 'lecturer', text: 'Private couriers remained for urgent or valuable messages, but they did not carry all ordinary mail.' },
    { speaker: 'lecturer', text: 'Roads were shared by riders, carts and walkers; they were not reserved solely for post riders.' },
    { speaker: 'lecturer', text: 'Delivery was not free to every farm, and stamps were not printed in advance in the earliest period.' },
    { speaker: 'lecturer', text: 'Looking back, payment by recipient held the system back in several ways.' },
    { speaker: 'lecturer', text: 'Recipient refusal meant outgoing mail often returned unpaid, and riders repeated the journey for nothing.' },
    { speaker: 'lecturer', text: 'Families delayed opening mail until they knew the charge, which slowed communication between towns.' },
    { speaker: 'lecturer', text: 'The stamp reform changed this by allowing prepayment at low flat rates before the letter left the sender’s hands.' },
    { speaker: 'lecturer', text: 'Once the sender controlled the cost, more letters reached their destination rather than turning back.' },
    { speaker: 'lecturer', text: 'Reformers also noted that prepaid mail created a fairer record of who sent what, and when.' },
    { speaker: 'lecturer', text: 'Some historians caution that postal growth depended on road quality, rail expansion and literacy too.' },
    { speaker: 'lecturer', text: 'The service did not grow alone; it rode the same transport improvements that moved goods and people.' },
    { speaker: 'lecturer', text: 'Even so, the postal service shaped the modern information society more than earlier accounts sometimes admit.' },
    { speaker: 'lecturer', text: 'It built the first nationwide habit of sending written news to a stranger in another town.' },
    { speaker: 'lecturer', text: 'It trained people to trust a public network that carried private messages from one household to the next.' },
    { speaker: 'lecturer', text: 'Later systems, from telegraph to parcel delivery, inherited this idea of a trusted public channel.' },
    { speaker: 'lecturer', text: 'The social effects lasted long after the coaches themselves gave way to trains and lorries.' },
    { speaker: 'lecturer', text: 'Next week we will look at how the telegraph shortened the time that messages took to cross a continent.' },
    { speaker: 'lecturer', text: 'Thank you for listening.' },
  ],
  vocabulary: [
    {
      term: 'routes', phonetic: '/ruːts/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '线路，邮路', en: 'the recognised paths along which mail was carried' },
      usage: { zh: '常用复数；post routes、trade routes。单数 route。', en: 'Usually plural: post routes, trade routes; the singular is route.' },
      collocations: ['official routes', 'post routes', 'along the route'],
      example: { en: 'Riders followed the official post routes between towns.', zh: '骑手沿城际官方邮路行进。' },
      listening: { zh: '单音节，与 root 同音，结尾 /ts/。', en: 'One syllable, homophone of root, ending /ts/.' },
    },
    {
      term: 'recipient', phonetic: '/rɪˈsɪpiənt/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '收件人，接收方', en: 'the person who receives a letter or package' },
      usage: { zh: '可数名词；the recipient pays、recipient refusal。动词 receive。', en: 'Countable: the recipient pays, recipient refusal; the verb is receive.' },
      collocations: ['the letter recipient', 'recipient payment', 'the recipient pays'],
      example: { en: 'The recipient paid the charge on delivery.', zh: '收件人在送达时付费。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsɪp/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'adhesive', phonetic: '/ədˈhiːsɪv/', partOfSpeech: 'adj.', sentenceIndex: 18,
      meaning: { zh: '有黏着性的，背胶的', en: 'sticking to a surface without a separate fixing' },
      usage: { zh: '形容词；adhesive stamp、adhesive label。', en: 'Adjective: an adhesive stamp, an adhesive label.' },
      collocations: ['the adhesive stamp', 'adhesive backing', 'an adhesive label'],
      example: { en: 'The adhesive stamp showed payment had been made.', zh: '背胶邮票表示费用已付。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈhiː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'monarch', phonetic: '/ˈmɒnək/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '君主，国王或女王', en: 'the head of state shown on the early stamp' },
      usage: { zh: '可数名词；the monarch’s head、the reigning monarch。', en: 'Countable: the monarch’s head, the reigning monarch.' },
      collocations: ['the monarch’s head', 'the monarch’s profile', 'the reigning monarch'],
      example: { en: 'The stamp carried the monarch’s familiar profile.', zh: '邮票上是君主熟悉的侧面像。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈmɒ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'schedules', phonetic: '/ˈʃedjuːlz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '班次时刻表，固定排期', en: 'the fixed days and times when mail departed' },
      usage: { zh: '可数复数；regular schedules、work to a schedule。动词 schedule。', en: 'Countable plural: regular schedules, work to a schedule; the verb is schedule.' },
      collocations: ['fixed schedules', 'regular schedules', 'the timetable schedule'],
      example: { en: 'Mail left town on fixed schedules.', zh: '邮件按固定班次离镇。' },
      listening: { zh: '英式读 /ˈʃedjuːl/，美式常读 /ˈske-/。', en: 'British says /ˈʃedjuːl/, American often says /ˈske-/.' },
    },
    {
      term: 'coaches', phonetic: '/ˈkəʊtʃɪz/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '邮车，公共马车', en: 'the horse-drawn vehicles that carried mail bags between towns' },
      usage: { zh: '可数复数；mail coaches、stage coaches。单数 coach。', en: 'Countable plural: mail coaches, stage coaches; the singular is coach.' },
      collocations: ['mail coaches', 'the coach timetable', 'the coach route'],
      example: { en: 'Mail coaches carried bags between larger towns.', zh: '邮车在较大城镇之间运送邮袋。' },
      listening: { zh: 'coach 加 es，结尾 /ɪz/。', en: 'Coach plus es, ending /ɪz/.' },
    },
    {
      term: 'literacy', phonetic: '/ˈlɪtərəsi/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '识字能力，读写水平', en: 'the ability to read and write in a household' },
      usage: { zh: '不可数名词；literacy rose、adult literacy。形容词 literate。', en: 'Uncountable: literacy rose, adult literacy; the adjective is literate.' },
      collocations: ['literacy rose', 'adult literacy', 'literacy levels'],
      example: { en: 'More mail raised reasons for household literacy.', zh: '邮件增多提升了家庭读写需求。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈlɪt/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'prepayment', phonetic: '/ˌpriːˈpeɪmənt/', partOfSpeech: 'n.', sentenceIndex: 41,
      meaning: { zh: '预付，预先付费', en: 'paying the charge before the letter leaves the sender' },
      usage: { zh: '不可数名词；prepayment at flat rates。动词 prepay。', en: 'Uncountable: prepayment at flat rates; the verb is prepay.' },
      collocations: ['prepayment in advance', 'prepayment at flat rates', 'require prepayment'],
      example: { en: 'The stamp reform allowed prepayment by the sender.', zh: '邮票改革允许寄件人预付邮资。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈpeɪ/。', en: 'Four syllables with stress on the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'staging posts', sentenceIndex: 5,
      meaning: { zh: '中途换马驿站', en: 'the stops where riders changed horses along the route' },
      usage: { zh: '可数复数；change horses at staging posts。', en: 'Countable plural: change horses at staging posts.' },
      example: { en: 'Riders changed horses at the staging posts.', zh: '骑手在驿站换马。' },
    },
    {
      phrase: 'on delivery', sentenceIndex: 13,
      meaning: { zh: '送达时（付费）', en: 'when the letter arrives at the receiver’s door' },
      usage: { zh: '费用语境；pay on delivery、refuse on delivery。', en: 'In pricing: pay on delivery, refuse on delivery.' },
      example: { en: 'The charge was settled on delivery.', zh: '费用在送达时结清。' },
    },
    {
      phrase: 'went missing', sentenceIndex: 23,
      meaning: { zh: '遗失，找不到', en: 'to be lost somewhere along the route' },
      usage: { zh: '被动/系表；a packet went missing、go missing in transit。', en: 'Copular: a packet went missing, go missing in transit.' },
      example: { en: 'Officials traced a packet if it went missing.', zh: '若包裹遗失，官员会追查。' },
    },
    {
      phrase: 'alongside the mail bags', sentenceIndex: 25,
      meaning: { zh: '与邮袋一同（同行）', en: 'travelling next to the bags of mail' },
      usage: { zh: 'alongside 后接名词；sit alongside the mail bags。', en: 'Alongside plus noun: sit alongside the mail bags.' },
      example: { en: 'Passengers rode alongside the mail bags.', zh: '乘客与邮袋同车同行。' },
    },
    {
      phrase: 'turning back', sentenceIndex: 42,
      meaning: { zh: '退回，折返', en: 'returning to the sender instead of reaching the address' },
      usage: { zh: '动名词；letters turn back、mail turns back。', en: 'Gerund: letters turn back, mail turns back.' },
      example: { en: 'More letters reached home without turning back.', zh: '更多信件送达，不再退回。' },
    },
    {
      phrase: 'gave way to', sentenceIndex: 50,
      meaning: { zh: '被……取代，让位于', en: 'to be replaced by a newer transport system' },
      usage: { zh: '被动短语；coaches gave way to trains、old routes gave way to roads。', en: 'Passive phrase: coaches gave way to trains, old routes gave way to roads.' },
      example: { en: 'The coaches gave way to trains and lorries.', zh: '邮车最终被火车和货车取代。' },
    },
  ],
  tips: [
    {
      title: { zh: '先判断空格词性与搭配', en: 'Predict word class and collocation' },
      body: {
        zh: '第 31 空前是 official，填名词 routes；第 32 空在 the 后，填付款主体 recipient；第 34 空在 monarch’s 后填 head；第 35 空 commercial 后填 information。听前把词性写在空格旁，听时只等那一类词。',
        en: 'Item 31 follows official and needs routes; item 32 after the needs the payer, recipient; item 34 after monarch’s needs head; item 35 after commercial needs information. Mark the predicted word class beside each gap before listening.',
      },
    },
    {
      title: { zh: '历史讲座抓对比与改革前后', en: 'Catch the before and after contrast' },
      body: {
        zh: '讲座把到付时代与邮票改革后对照：refused、sent back、wasted trip 属于旧制度；prepayment、flat rates、reached destination 属于新制度。听到 before、reform、changed this 就分清结论落在哪一边。',
        en: 'The lecture contrasts recipient pay with the stamp reform: refused, sent back and wasted trip belong to the old system; prepayment, flat rates and reached destination belong to the new. At before, reform and changed this, place the conclusion on the correct side.',
      },
    },
    {
      title: { zh: '多选排除被否定的对照项', en: 'Exclude the rejected comparison options' },
      body: {
        zh: '36–37 的两个正确项是固定班次和按距离重量计费；私人信使并不承运全部邮件、道路不专供邮差、投递不免费、早期也没有预先印制邮票，这些都在句 35–37 被否定，听到 but、not、neither 就在选项旁打叉。',
        en: 'Items 36–37 are fixed schedules and distance-and-weight charges; private couriers did not carry all mail, roads were shared, delivery was not free, and pre-printed stamps came later. Mark those out where but, not or neither appears in sentences 35 to 37.',
      },
    },
  ],
};
