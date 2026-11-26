import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 11 · Part 1 — 周末租车咨询（双人对话，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 生活交易类对话：车型分组、保险档位、异地还车费、加油政策、附加驾驶人，以及导航、
 * 儿童座椅和车顶架三项附加设备。配对题考“三项设备分别如何计费或是否需要”。
 */
export const test11Part1: ListeningLesson = {
  slug: 'test-11-part-1',
  part: 1,
  status: 'published',
  title: { zh: '周末租车', en: 'Hiring a car for a weekend' },
  summary: {
    zh: '顾客租车过周末：选定车型分组、比较保险档位、了解异地还车费和加油政策，登记附加驾驶人，并确定导航、儿童座椅和车顶架三项附加设备的安排。',
    en: 'A customer hires a car for the weekend: choosing the car group, comparing insurance levels, the one-way drop-off fee and fuel policy, adding a second driver, and sorting out the navigation, child seat and roof rack.',
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
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Car group', cells: [[{ blank: 2 }]] },
        { lead: 'Insurance level', cells: [[{ blank: 3 }]] },
        { lead: 'One-way drop-off fee', cells: [[{ blank: 4 }, { text: ' dollars' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What is the fuel policy for this car?',
          options: [
            { key: 'A', text: 'Return it with the same amount of fuel as when collected.' },
            { key: 'B', text: 'Prepay for a full tank before the weekend.' },
            { key: 'C', text: 'Leave the tank empty on return.' },
          ],
        },
        {
          number: 6,
          stem: 'What does the agent say about the additional driver?',
          options: [
            { key: 'A', text: 'She pays a daily fee alongside the main driver.' },
            { key: 'B', text: 'She can be added at no extra charge.' },
            { key: 'C', text: 'She must visit the depot in person to sign.' },
          ],
        },
        {
          number: 7,
          stem: 'What should the customer do if the car breaks down?',
          options: [
            { key: 'A', text: 'Take it to the nearest private garage.' },
            { key: 'B', text: 'Wait until the branch opens on Monday.' },
            { key: 'C', text: 'Call the roadside number kept in the glove box.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which detail applies to each extra? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'hired for a single day at five dollars' },
        { key: 'B', text: 'not included and charged eight dollars a day' },
        { key: 'C', text: 'not requested for this weekend' },
        { key: 'D', text: 'included free with the compact car' },
        { key: 'E', text: 'available only as a booster cushion' },
      ],
      items: [
        { number: 8, text: 'satellite navigation' },
        { number: 9, text: 'child seat' },
        { number: 10, text: 'roof rack' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Mercer'], evidence: 1,
      explanation: {
        zh: '定位句 1：来访者逐字母拼出 Mercer，M, E, R, C, E, R。拼写题先记首字母 M，再跟读音补；不要按发音写成 Merser。',
        en: 'Sentence 1: the customer spells the surname M, E, R, C, E, R. Write the first letter and fill in the rest; do not guess Merser.',
      },
    },
    {
      number: 2, accepted: ['compact'], evidence: 6,
      explanation: {
        zh: '定位句 6：Then our compact group suits you。顾客句 5 说要小一点的车，据此归入 compact 分组；句 8 的 weekend rate 是价格，不是车型。',
        en: 'Sentence 6: "our compact group suits you". Sentence 5 asks for something small, so the car group is compact. The weekend rate in sentence 8 is the price, not the model.',
      },
    },
    {
      number: 3, accepted: ['full cover'], evidence: 13,
      explanation: {
        zh: '定位句 13：I’ll go with the full cover, then。句 10 提到基础档是 third party，被顾客放弃；full cover 是两个词，符合词数限制。',
        en: 'Sentence 13: "I’ll go with the full cover, then". The basic third party in sentence 10 is turned down. Full cover is two words, within the word limit.',
      },
    },
    {
      number: 4, accepted: ['thirty', '30'], evidence: 16,
      explanation: {
        zh: '定位句 16：a drop-off fee of thirty dollars。空格后已印 dollars，填数字即可；句 18 说明把车开回本店则不收这笔费用，属于规则补充。',
        en: 'Sentence 16: "a drop-off fee of thirty dollars". Dollars is printed, so write the number. Sentence 18 explains the fee is waived if the car returns to this depot.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 20,
      explanation: {
        zh: '定位句 20：Our policy is full to full. You collect the car with a full tank, and you return it the same way。满取满还对应 A。B 的预付油箱在句 22 被明确说没有；C 的空箱归还没有出现。',
        en: 'Sentence 20: "Our policy is full to full. You collect the car with a full tank, and you return it the same way.", matching A. The prepaid tank in B is ruled out in sentence 22, and returning empty in C is never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：you can add one extra driver, and there’s no charge for that on a weekend booking。周末订单不加收费用，对应 B。A 与 no charge 相反；C 与句 26 的不用本人到场相反。',
        en: 'Sentence 24: "you can add one extra driver, and there’s no charge for that on a weekend booking", matching B. A contradicts no charge, and C contradicts sentence 26, which says she need not come in person.',
      },
    },
    {
      number: 7, accepted: ['C'], evidence: 31,
      explanation: {
        zh: '定位句 31：You call the roadside number in the glove box, and we arrange a replacement。故障时打手套箱里的道路救援电话，对应 C。A 的私人修理厂和 B 的等周一开门都不在安排之内。',
        en: 'Sentence 31: "You call the roadside number in the glove box, and we arrange a replacement", matching C. The private garage in A and waiting until Monday in B are not part of the arrangement.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 34,
      explanation: {
        zh: '定位句 34：that’s a separate add-on at eight dollars a day。导航不包含在车费内，按天收八元，对应 B。顾客句 35 随后决定不订导航。',
        en: 'Sentence 34: "that’s a separate add-on at eight dollars a day". Navigation is excluded and charged daily, matching B. The customer declines it in sentence 35.',
      },
    },
    {
      number: 9, accepted: ['A'], evidence: 37,
      explanation: {
        zh: '定位句 37：We only need the seat for one day, so I’ll reserve that。句 36 给出儿童座椅五美元一天，顾客只订一天，对应 A。E 的增高坐垫是另一件设备，不是儿童座椅本身。',
        en: 'Sentence 37: "We only need the seat for one day, so I’ll reserve that". Sentence 36 prices the child seat at five dollars a day, matching A. The booster cushion in E is a separate item.',
      },
    },
    {
      number: 10, accepted: ['C'], evidence: 39,
      explanation: {
        zh: '定位句 39：No, we’re not bringing any bikes this time。车顶架因为不带自行车而没有预订，对应 C。D 的免费包含与导航句 34 相反，不适用于车顶架。',
        en: 'Sentence 39: "No, we’re not bringing any bikes this time", so the roof rack is not requested, matching C. The free inclusion in D contradicts sentence 34.',
      },
    },
  ],
  transcript: [
    { speaker: 'agent', text: 'Before I take the booking, could I have your name, please?' },
    { speaker: 'customer', text: 'Yes, it’s Greg Mercer. That’s M, E, R, C, E, R.' },
    { speaker: 'agent', text: 'Mercer, Greg. Thank you. And the licence is still valid, I assume?' },
    { speaker: 'customer', text: 'It is. I’ve held it for about four years now.' },
    { speaker: 'agent', text: 'Good. What kind of car did you have in mind for the weekend?' },
    { speaker: 'customer', text: 'Something small would be best, since I’m mostly driving around the city.' },
    { speaker: 'agent', text: 'Then our compact group suits you. It’s a petrol car, and it seats four adults comfortably.' },
    { speaker: 'customer', text: 'Fine. How much is that for two days?' },
    { speaker: 'agent', text: 'The weekend rate is sixty dollars a day, so a hundred and twenty for Saturday and Sunday.' },
    { speaker: 'customer', text: 'That sounds reasonable. Now, about insurance.' },
    { speaker: 'agent', text: 'The basic cover is third party, but most weekend drivers take the full cover.' },
    { speaker: 'customer', text: 'What’s the difference in cost?' },
    { speaker: 'agent', text: 'Full cover adds twelve dollars a day, and it lowers the excess from nine hundred to a hundred and fifty.' },
    { speaker: 'customer', text: 'I’ll go with the full cover, then. I’d rather not worry about a large excess.' },
    { speaker: 'agent', text: 'Done. Are you returning the car here, or dropping it off somewhere else?' },
    { speaker: 'customer', text: 'We’re driving down to Napier, so I might leave it at the city branch there.' },
    { speaker: 'agent', text: 'A one-way rental carries a drop-off fee of thirty dollars, which covers returning the vehicle to this depot.' },
    { speaker: 'customer', text: 'And if we bring it back here, there’s no fee at all?' },
    { speaker: 'agent', text: 'That’s right. The fee only applies when the branches differ.' },
    { speaker: 'customer', text: 'Understood. What about fuel?' },
    { speaker: 'agent', text: 'Our policy is full to full. You collect the car with a full tank, and you return it the same way.' },
    { speaker: 'customer', text: 'Is there a prepaid tank option instead?' },
    { speaker: 'agent', text: 'There isn’t on this group. If the tank is below full when you return, we charge a refilling service on top.' },
    { speaker: 'customer', text: 'Fair. My partner will do some of the driving too. Is she allowed on the contract?' },
    { speaker: 'agent', text: 'Yes, you can add one extra driver, and there’s no charge for that on a weekend booking.' },
    { speaker: 'customer', text: 'Does she need to come in person to sign?' },
    { speaker: 'agent', text: 'No, her details go on the agreement here, and she must carry her own licence whenever she drives.' },
    { speaker: 'customer', text: 'What’s the minimum age for an additional driver?' },
    { speaker: 'agent', text: 'She’ll need to be twenty-one or over, and she must have held the licence for at least a year.' },
    { speaker: 'customer', text: 'She’s twenty-six, so that’s no problem.' },
    { speaker: 'customer', text: 'What happens if the car breaks down on the road?' },
    { speaker: 'agent', text: 'You call the roadside number in the glove box, and we arrange a replacement within a few hours.' },
    { speaker: 'agent', text: 'Now, are there any extras you’d like to book with the car?' },
    { speaker: 'customer', text: 'Will there be satellite navigation included?' },
    { speaker: 'agent', text: 'No, that’s a separate add-on at eight dollars a day. You can also use the maps on your phone.' },
    { speaker: 'customer', text: 'I’ll skip the navigation then. Do you have child seats?' },
    { speaker: 'agent', text: 'We have one child seat at five dollars a day, and a booster cushion for older children.' },
    { speaker: 'customer', text: 'We only need the seat for one day, so I’ll reserve that.' },
    { speaker: 'agent', text: 'And a roof rack? Some people ask for those when they carry bicycles.' },
    { speaker: 'customer', text: 'No, we’re not bringing any bikes this time.' },
    { speaker: 'agent', text: 'Alright. Let me confirm the details, compact car, full cover, one extra driver, and the child seat for Saturday.' },
    { speaker: 'customer', text: 'One question, what happens if we return it late?' },
    { speaker: 'agent', text: 'You pay an extra half day if you keep it past noon on Sunday.' },
    { speaker: 'customer', text: 'Perfect. Thanks for your help.' },
    { speaker: 'agent', text: 'You’re welcome. We’ll see you Friday morning.' },
  ],
  vocabulary: [
    {
      term: 'licence', phonetic: '/ˈlaɪsns/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '驾驶执照', en: 'the official document that permits someone to drive' },
      usage: { zh: '英式拼写 licence，美式 license；hold a licence、a full licence。', en: 'British spelling licence, American license: hold a licence, a full licence.' },
      collocations: ['a valid licence', 'hold a licence', 'a driving licence'],
      example: { en: 'You must carry your licence whenever you drive.', zh: '开车时必须随身携带驾照。' },
      listening: { zh: '两个音节，结尾 /ns/ 很轻，不要读成 lie-sense。', en: 'Two syllables with a soft final /ns/; do not say lie-sense.' },
    },
    {
      term: 'compact', phonetic: '/kəmˈpækt/', partOfSpeech: 'adj.', sentenceIndex: 6,
      meaning: { zh: '小型紧凑的（车型分组）', en: 'small and economical, describing a car group' },
      usage: { zh: '租车场景 compact car、compact group；重音在第二音节。', en: 'In car hire: compact car, compact group. Stress the second syllable.' },
      collocations: ['a compact car', 'the compact group', 'compact size'],
      example: { en: 'The compact model is easiest to park in the city.', zh: '小型车在城里最好停。' },
      listening: { zh: '作形容词重音在第二音节 /ˈpæ/；名词 compact（化妆盒）重音在第一音节。', en: 'The adjective stresses the second syllable; the noun stresses the first.' },
    },
    {
      term: 'excess', phonetic: '/ɪkˈses/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '免赔额，自负额（保险）', en: 'the amount the driver pays toward a claim before cover starts' },
      usage: { zh: '保险语境 excess 是免赔额；lower the excess、a high excess。', en: 'In insurance, the excess is the first amount paid on a claim: lower the excess.' },
      collocations: ['the excess', 'lower the excess', 'a full excess'],
      example: { en: 'The excess on this policy is five hundred dollars.', zh: '这份保单的免赔额是五百元。' },
      listening: { zh: '名词重音在第二音节 /ˈses/；动词 excess 不常用。', en: 'The noun stresses the second syllable; the verb is rare.' },
    },
    {
      term: 'one-way', phonetic: '/ˌwʌn ˈweɪ/', partOfSpeech: 'adj.', sentenceIndex: 16,
      meaning: { zh: '单程的（取车与还车地点不同）', en: 'with different pickup and drop-off locations' },
      usage: { zh: '租车术语 one-way rental、one-way fee；反义 return to base。', en: 'A car-hire term: one-way rental, one-way fee; the opposite is return to base.' },
      collocations: ['a one-way rental', 'one-way drop-off', 'a one-way fee'],
      example: { en: 'A one-way hire usually carries a drop-off charge.', zh: '单程租车通常要收异地还车费。' },
      listening: { zh: '复合词，重音在 way 上；one 弱读为 /wʌn/。', en: 'A compound with stress on way; one is reduced to /wʌn/.' },
    },
    {
      term: 'depot', phonetic: '/ˈdepəʊ/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '车场，门店仓库', en: 'the branch or storage site where vehicles are kept' },
      usage: { zh: '可数名词；bus depot、rental depot。注意 o 发 /əʊ/。', en: 'Countable: bus depot, rental depot. The o is /əʊ/.' },
      collocations: ['the rental depot', 'a bus depot', 'return to the depot'],
      example: { en: 'The car must be cleaned before it leaves the depot.', zh: '车辆离场场前必须清洁。' },
      listening: { zh: '重音在第一音节，不要读成 di-pot。', en: 'Stress the first syllable; do not say di-pot.' },
    },
    {
      term: 'prepaid', phonetic: '/ˌpriːˈpeɪd/', partOfSpeech: 'adj.', sentenceIndex: 21,
      meaning: { zh: '预付的（费用事先付清）', en: 'paid for in advance' },
      usage: { zh: 'prepaid tank、prepaid ticket；动词 prepay。', en: 'prepaid tank, prepaid ticket; the verb is prepay.' },
      collocations: ['a prepaid tank', 'prepaid fuel', 'prepaid parking'],
      example: { en: 'A prepaid tank costs less if you return it empty.', zh: '预付油箱在空箱归还时更划算。' },
      listening: { zh: '重音在第二音节 /ˈpeɪd/，开头长音 /priː/。', en: 'Stress the second syllable with a long opening /priː/.' },
    },
    {
      term: 'additional', phonetic: '/əˈdɪʃənl/', partOfSpeech: 'adj.', sentenceIndex: 27,
      meaning: { zh: '附加的，额外的', en: 'extra; added to the main person or item' },
      usage: { zh: 'additional driver、additional charge；比 extra 正式。', en: 'additional driver, additional charge; more formal than extra.' },
      collocations: ['an additional driver', 'an additional charge', 'additional cover'],
      example: { en: 'An additional driver must hold a valid licence.', zh: '附加驾驶人必须持有有效驾照。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈdɪʃ/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'glove box', phonetic: '/ˈɡlʌv bɒks/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '（汽车）手套箱', en: 'the small storage compartment in front of the passenger seat' },
      usage: { zh: '可数名词；英式也叫 glove compartment。', en: 'Countable; British English also says glove compartment.' },
      collocations: ['in the glove box', 'the glove compartment'],
      example: { en: 'The registration paper is kept in the glove box.', zh: '登记文件放在手套箱里。' },
      listening: { zh: 'glove 读 /ɡlʌv/，与 love 押韵；两个词连读成一组。', en: 'Glove rhymes with love; say the two words as one group.' },
    },
  ],
  expressions: [
    {
      phrase: 'go with', sentenceIndex: 13,
      meaning: { zh: '选择，采用（某档位）', en: 'to choose or settle on an option' },
      usage: { zh: '口语中表示选定；go with the full cover、go with this plan。', en: 'Colloquial for choosing: go with the full cover.' },
      example: { en: 'I think I’ll go with the smaller car.', zh: '我想选那辆小一点的车。' },
    },
    {
      phrase: 'full to full', sentenceIndex: 20,
      meaning: { zh: '满取满还（油量政策）', en: 'collect and return the car with a full tank' },
      usage: { zh: '租车加油政策的固定说法；对比 prepaid tank。', en: 'The standard fuel phrase in hire; compare prepaid tank.' },
      example: { en: 'Most rentals here work on a full to full basis.', zh: '这里的租车大多按满取满还执行。' },
    },
    {
      phrase: 'on top', sentenceIndex: 22,
      meaning: { zh: '另外，额外（加收）', en: 'in addition, charged on top of the main price' },
      usage: { zh: 'on top of something 表示在原有费用之上再加。', en: 'on top of something means added to the existing cost.' },
      example: { en: 'A service fee is charged on top of the daily rate.', zh: '日租金之外还要加收服务费。' },
    },
    {
      phrase: 'breaks down', sentenceIndex: 30,
      meaning: { zh: '（车辆）抛锚，出故障', en: 'to stop working because of a mechanical fault' },
      usage: { zh: '不及物；car breaks down。名词 breakdown。', en: 'Intransitive: the car breaks down; the noun is breakdown.' },
      example: { en: 'The van broke down on the motorway.', zh: '货车在高速公路上抛锚了。' },
    },
    {
      phrase: 'skip the navigation', sentenceIndex: 35,
      meaning: { zh: '不订导航，省去这项', en: 'to choose not to take an optional extra' },
      usage: { zh: 'skip 表示“跳过、不要”；skip the add-on、skip lunch。', en: 'skip means to pass over: skip the add-on, skip lunch.' },
      example: { en: 'I’ll skip the insurance and drive carefully.', zh: '我不买保险，小心开车就是。' },
    },
    {
      phrase: 'reserve that', sentenceIndex: 37,
      meaning: { zh: '把它预订下来', en: 'to book an optional item in advance' },
      usage: { zh: 'reserve 后接设备或座位；名词 reservation。', en: 'reserve an item or seat; the noun is reservation.' },
      example: { en: 'Please reserve a child seat for the Friday pickup.', zh: '请为周五取车预留儿童座椅。' },
    },
  ],
  tips: [
    {
      title: { zh: '价格与规则分开记', en: 'Keep prices and rules apart' },
      body: {
        zh: '租车对话里数字很多：日租、保险加价、免赔额、还车费、设备租金。听到数字先归类它属于哪一项，避免把保险加价当成总费用。',
        en: 'Car-hire talks are full of numbers: daily rate, insurance loading, excess, drop-off fee, extras. Sort each number into its category before writing it down.',
      },
    },
    {
      title: { zh: '否定句里藏着干扰项', en: 'Distractors sit in the negatives' },
      body: {
        zh: 'There isn’t on this group、no charge、not bringing any bikes 这类否定句常用来排除错误选项。听到否定词时，把被排除的方案在选项旁划掉。',
        en: 'Sentences such as There isn’t on this group, no charge and not bringing any bikes rule out distractors. Cross the rejected option out when you hear the negation.',
      },
    },
    {
      title: { zh: '配对按设备名定位', en: 'Match by the item name' },
      body: {
        zh: '配对题的三个设备在原文中依次出现。先在导航、座椅、车顶架旁记下计费方式或是否需要，不要听到价格就往第一行填。',
        en: 'The three extras appear in order. Note the charge or need beside each item name; do not put the first price you hear on the first line.',
      },
    },
  ],
};
