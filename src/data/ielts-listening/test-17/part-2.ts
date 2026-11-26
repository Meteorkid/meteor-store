import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 17 · Part 2 — 食物银行志愿者岗前说明（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白顺序：班次时长 → 分拣与储存分区 → 保质期判断 → 打包与配送路线 → 受助者隐私；
 * 后段补充干食摆放、破损包装处理、上门协助边界与缺班通知。填空块在前半段，单选块在后半段。
 */
export const test17Part2: ListeningLesson = {
  slug: 'test-17-part-2',
  part: 2,
  status: 'published',
  title: { zh: '食物银行志愿者说明', en: 'Briefing volunteers at a food bank' },
  summary: {
    zh: '协调员向志愿者说明四小时班次、干食上架与冷藏存放规则、保质期与破损包装判断、三条配送路线和打包标签，以及受助者隐私要求；后段讲干食远离日晒窗户、破损包装入拒收箱、不上门搬袋的边界，以及缺班提前一天通知协调员。',
    en: 'The coordinator briefs volunteers on four-hour shifts, dry-food shelving and chilled storage, expiry and damaged-packaging rules, the three delivery routes and packing labels, and recipient privacy. Later she covers keeping dry food off the sunny window, the reject bin for damaged packs, the boundary on carrying bags to doors, and giving the coordinator a day’s notice before missing a shift.',
  },
  accent: { zh: '协调员为南非口音，规则逐条重复强调。', en: 'The coordinator speaks with a South African accent, repeating the rules that matter most.' },
  speechRate: '+8%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Each volunteer works a four-hour', cells: [[{ blank: 11 }]] },
        { lead: 'Chilled products stay in the cool', cells: [[{ blank: 12 }]] },
        { lead: 'Out-of-date food goes to the waste', cells: [[{ blank: 13 }]] },
        { lead: 'Products near their date: set aside for', cells: [[{ blank: 14 }, { text: ' packing' }]] },
        { lead: 'Western route: the retirement', cells: [[{ blank: 15 }]] },
        { lead: 'Never photograph the packing', cells: [[{ blank: 16 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'Where should dry food be kept away from?',
          options: [
            { key: 'A', text: 'The sunlit window' },
            { key: 'B', text: 'The cool cabinet' },
            { key: 'C', text: 'The delivery van' },
          ],
        },
        {
          number: 18,
          stem: 'Damaged packaging goes to the:',
          options: [
            { key: 'A', text: 'Waste bin at the back' },
            { key: 'B', text: 'Dry shelf' },
            { key: 'C', text: 'Reject bin' },
          ],
        },
        {
          number: 19,
          stem: 'When may volunteers carry bags to individual doors?',
          options: [
            { key: 'A', text: 'On every delivery stop' },
            { key: 'B', text: 'When the driver asks for help on the ramp' },
            { key: 'C', text: 'When the recipient phones first' },
          ],
        },
        {
          number: 20,
          stem: 'What should a volunteer do if they miss a shift?',
          options: [
            { key: 'A', text: 'Message the coordinator at least a day ahead' },
            { key: 'B', text: 'Find a replacement with no notice' },
            { key: 'C', text: 'Arrive for the afternoon slot instead' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['shift'], evidence: 1,
      explanation: {
        zh: '定位句 1：Each volunteer works a four-hour shift。班次长度为四小时；morning and afternoon slots 只是时段安排，不是时长单位。',
        en: 'Sentence 1: "Each volunteer works a four-hour shift". The block is a four-hour shift; the morning and afternoon slots are timing, not the unit.',
      },
    },
    {
      number: 12, accepted: ['cabinet'], evidence: 4,
      explanation: {
        zh: '定位句 4：Fresh bread and chilled products stay in the cool cabinet。冷藏品放冷柜；dry shelves 放的是干货，不是冷藏区。',
        en: 'Sentence 4: "Fresh bread and chilled products stay in the cool cabinet". Chilled items go in the cabinet; dry shelves hold non-perishables, not the cold area.',
      },
    },
    {
      number: 13, accepted: ['bin'], evidence: 7,
      explanation: {
        zh: '定位句 7：Food past its date must go straight into the waste bin at the back。过期食品进后部废物箱；reject bin 专收破损包装。',
        en: 'Sentence 7: "Food past its date must go straight into the waste bin at the back". Out-of-date food goes to the waste bin; the reject bin is for damaged packaging.',
      },
    },
    {
      number: 14, accepted: ['same-day'], evidence: 8,
      explanation: {
        zh: '定位句 8：Products within three days of their date are set aside for same-day packing。临期品留作当天打包；不要放上架等待。',
        en: 'Sentence 8: "Products within three days of their date are set aside for same-day packing". Near-date items are packed the same day, not left on the shelf.',
      },
    },
    {
      number: 15, accepted: ['homes'], evidence: 11,
      explanation: {
        zh: '定位句 11：the western retirement homes。西线路线覆盖退休住所；eastern estates 与 centre flats 是另外两条路线。',
        en: 'Sentence 11: "the western retirement homes". The western route serves retirement homes; eastern estates and centre flats are the other two routes.',
      },
    },
    {
      number: 16, accepted: ['lists'], evidence: 14,
      explanation: {
        zh: '定位句 14：do not photograph the packing lists。隐私要求是不得拍摄打包清单；bag names 只是不得读出，不是拍摄对象。',
        en: 'Sentence 14: "do not photograph the packing lists". Privacy bans photos of the packing lists; bag names must not be read aloud but are not the photographed item here.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：Dry food near the window warms in the sunlight, so keep boxes on the inner shelves。干货要远离日晒窗户；冷柜是冷藏品位置，配送车是运输环节。',
        en: 'Sentence 16: "Dry food near the window warms in the sunlight, so keep boxes on the inner shelves". Dry food stays off the sunny window; the cabinet holds chilled goods and the van is transport.',
      },
    },
    {
      number: 18, accepted: ['C'], evidence: 17,
      explanation: {
        zh: '定位句 17：Damaged packaging, torn bags or leaks always go to the reject bin。破损包装进拒收箱；后部废物箱收过期食品。',
        en: 'Sentence 17: "Damaged packaging, torn bags or leaks always go to the reject bin". Damaged packs go to the reject bin; the back waste bin holds out-of-date food.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：Volunteers do not carry bags to individual doors unless the driver asks for help on the ramp。只有司机在坡道求助时才帮忙搬袋；每站都搬、受助者先打电话都不成立。',
        en: 'Sentence 18: "Volunteers do not carry bags to individual doors unless the driver asks for help on the ramp". Bag carrying happens only on the driver’s ramp request; neither every stop nor a prior recipient call applies.',
      },
    },
    {
      number: 20, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：If you cannot make a shift, message the coordinator at least a day ahead so a cover can be found。缺班须提前一天通知协调员；自行找替补或改下午班都未被允许。',
        en: 'Sentence 19: "If you cannot make a shift, message the coordinator at least a day ahead so a cover can be found". Missing a shift needs a day’s notice to the coordinator; finding your own cover or switching to the afternoon slot is not allowed.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Before we start the sorting shift, let me walk you through today’s routine, from the crates at the door to the bags that leave for delivery.' },
    { speaker: 'coordinator', text: 'Each volunteer works a four-hour shift, and there are two slots every weekday morning and afternoon.' },
    { speaker: 'coordinator', text: 'The first task is checking donations against the shelf list.' },
    { speaker: 'coordinator', text: 'Non-perishable tins and packets go onto the dry shelves in the main store room.' },
    { speaker: 'coordinator', text: 'Fresh bread and chilled products stay in the cool cabinet, which runs at a low temperature all day.' },
    { speaker: 'coordinator', text: 'Please wipe each shelf before you stack anything, and keep heavy tins on the lower levels.' },
    { speaker: 'coordinator', text: 'When you check a donated item, look at the use-by date before anything else.' },
    { speaker: 'coordinator', text: 'Food past its date must go straight into the waste bin at the back, regardless of how sealed the packet looks.' },
    { speaker: 'coordinator', text: 'Products within three days of their date are set aside for same-day packing, not left on the shelf.' },
    { speaker: 'coordinator', text: 'The sorting tables are washed down after every forty crates, and gloves are changed between crates.' },
    { speaker: 'coordinator', text: 'After packing, volunteers load the delivery route with our driver, who knows the addresses.' },
    { speaker: 'coordinator', text: 'There are three daily routes, covering the eastern estates, the town centre flats and the western retirement homes.' },
    { speaker: 'coordinator', text: 'Bags are matched to the route labels on the clipboard before the van leaves the yard.' },
    { speaker: 'coordinator', text: 'We take the privacy of everyone we support very seriously.' },
    { speaker: 'coordinator', text: 'Never read the names on a bag out loud in the hallway, and do not photograph the packing lists.' },
    { speaker: 'coordinator', text: 'Each recipient chooses their own items from the packing list, so we do not substitute goods on the route.' },
    { speaker: 'coordinator', text: 'Dry food near the window warms in the sunlight, so keep boxes on the inner shelves.' },
    { speaker: 'coordinator', text: 'Damaged packaging, torn bags or leaks always go to the reject bin, even if the food inside looks fine.' },
    { speaker: 'coordinator', text: 'Volunteers do not carry bags to individual doors unless the driver asks for help on the ramp.' },
    { speaker: 'coordinator', text: 'If you cannot make a shift, message the coordinator at least a day ahead so a cover can be found.' },
    { speaker: 'coordinator', text: 'The morning group signs in at the desk by the door, and the afternoon group signs out there before leaving.' },
    { speaker: 'coordinator', text: 'All volunteers wear a plain vest over their own clothes, kept on the hook behind the table.' },
    { speaker: 'coordinator', text: 'Wash your hands at the sink before you touch any loose food, and again after handling tins.' },
    { speaker: 'coordinator', text: 'Tins with dents around the rim are rejected, because the seal may have failed.' },
    { speaker: 'coordinator', text: 'Glass jars are checked for cracks, and any sticky jar is wiped before it goes into a bag.' },
    { speaker: 'coordinator', text: 'Baby food and formula are kept on a separate shelf, ready for families who need them.' },
    { speaker: 'coordinator', text: 'Pet food follows the same date check, and it is packed in a separate bag from the household items.' },
    { speaker: 'coordinator', text: 'The driver leaves the yard at eleven thirty, and the afternoon van sets off at three.' },
    { speaker: 'coordinator', text: 'If a bag label is unreadable, take it to the coordinator rather than guessing the route.' },
    { speaker: 'coordinator', text: 'Recipients are identified by a number on the list, never by a full name in the packing room.' },
    { speaker: 'coordinator', text: 'Do not share stories about visitors with friends after the shift; that confidentiality matters as much as the food.' },
    { speaker: 'coordinator', text: 'A short break falls in the middle of each shift, but please keep voices low near the store room.' },
    { speaker: 'coordinator', text: 'Any leftover cold drinks go back into the cabinet, not onto the dry shelf with the packets.' },
    { speaker: 'coordinator', text: 'Loose fruit is inspected for bruises, and soft pieces are removed before the bags are sealed.' },
    { speaker: 'coordinator', text: 'The volunteer room has water and biscuits, and the microwave can be used for your own lunch.' },
    { speaker: 'coordinator', text: 'If you spot a mouse or any sign of pests, tell the coordinator at once rather than moving the food yourself.' },
    { speaker: 'coordinator', text: 'Volunteers must label any donated food that does not match the shelf list.' },
    { speaker: 'coordinator', text: 'The sorting table stays clear of personal bags during the shift.' },
    { speaker: 'coordinator', text: 'A new crate arrives at the door about every hour, and it should be sorted before the next one comes.' },
    { speaker: 'coordinator', text: 'Thank you for giving your time. The room works best when everyone follows these storage and privacy rules.' },
  ],
  vocabulary: [
    {
      term: 'donations', phonetic: '/dəʊˈneɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '捐赠物，捐来的食品', en: 'food or goods given to the food bank' },
      usage: { zh: 'check a donation、donation crate；动词 donate。', en: 'Check a donation, donation crate; the verb is donate.' },
      collocations: ['food donation', 'check the donation', 'a donation crate'],
      example: { en: 'The first task is checking each donated item against the list.', zh: '第一项任务是对照清单检查捐赠物。' },
      listening: { zh: '三音节，重音在第二音节 /ˈneɪ/。', en: 'Three syllables with stress on /ˈneɪ/.' },
    },
    {
      term: 'non-perishable', phonetic: '/ˌnɒn ˈperɪʃəbl/', partOfSpeech: 'adj.', sentenceIndex: 3,
      meaning: { zh: '不易腐坏的，可长期存放的', en: 'food that keeps for months without refrigeration' },
      usage: { zh: '食品储存分类词；反义 perishable 易腐品。', en: 'A storage category; the opposite perishable means fresh and short-lived.' },
      collocations: ['non-perishable tins', 'non-perishable packets', 'dry non-perishables'],
      example: { en: 'Tins and packets are non-perishable and belong on the dry shelves.', zh: '罐头和包装干货不易腐坏，应放干货架。' },
      listening: { zh: '重音在 per 部分 /ˈper/，前缀 non 轻读。', en: 'Stress falls on /ˈper/; the non- prefix is weak.' },
    },
    {
      term: 'use-by date', phonetic: '/ˈjuːz baɪ deɪt/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '保质期，最佳食用期限', en: 'the last day the food should be eaten' },
      usage: { zh: '英式标签用语；best before 偏风味，use-by 偏安全。', en: 'A British label term; best before refers to flavour, use-by to safety.' },
      collocations: ['check the use-by date', 'past its date', 'the date on the packet'],
      example: { en: 'Look at the use-by date before you touch the food.', zh: '接触食品前先看保质期。' },
      listening: { zh: '三个词连读，date 重读；不要吞掉 by。', en: 'The phrase links together with date stressed; do not drop by.' },
    },
    {
      term: 'reject', phonetic: '/ˈriːdʒekt/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '拒收（箱），被剔除的物品', en: 'the bin for items that cannot be used' },
      usage: { zh: '名词 reject 重读首音节；作动词 /rɪˈdʒekt/ 表拒绝，重音后移。', en: 'Noun reject stresses the first syllable; as a verb it is /rɪˈdʒekt/ with later stress.' },
      collocations: ['the reject bin', 'go to the reject bin', 'reject the damaged pack'],
      example: { en: 'Damaged packs always go to the reject bin.', zh: '破损包装一律进拒收箱。' },
      listening: { zh: '名词重音在前，动词重音在后；靠位置判断。', en: 'Noun stress first, verb stress second; judge from the slot.' },
    },
    {
      term: 'routes', phonetic: '/ruːts/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '配送路线', en: 'the fixed path the delivery van travels each day' },
      usage: { zh: 'delivery route、route label；动词 route 指按路线派送。', en: 'Delivery route, route label; the verb means send along a path.' },
      collocations: ['a delivery route', 'the three routes', 'route labels'],
      example: { en: 'The three daily routes cover the estates, flats and homes.', zh: '三条日常路线覆盖住宅区、公寓楼和退休住所。' },
      listening: { zh: '单音节长元音 /uː/；不要读成 rout。', en: 'One syllable with long /uː/; do not say rout.' },
    },
    {
      term: 'privacy', phonetic: '/ˈprɪvəsi/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '隐私，受助者个人信息保护', en: 'keeping recipients’ details and identities confidential' },
      usage: { zh: 'take privacy seriously、privacy rule；形容词 private。', en: 'Take privacy seriously, privacy rule; the adjective is private.' },
      collocations: ['recipient privacy', 'protect privacy', 'privacy rules'],
      example: { en: 'We take the privacy of every recipient very seriously.', zh: '我们非常重视每位受助者的隐私。' },
      listening: { zh: '三音节，重音在首音节 /ˈprɪ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'recipient', phonetic: '/rɪˈsɪpiənt/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '受助者，领取食品的人', en: 'the person who receives a food bag from the bank' },
      usage: { zh: '公益场景；receive 的名词形式，与 donor 相对。', en: 'Charity usage; related to receive, the opposite of donor.' },
      collocations: ['the recipient chooses', 'individual recipients', 'recipient details'],
      example: { en: 'Each recipient chooses their own items from the list.', zh: '每位受助者按清单自选物品。' },
      listening: { zh: '四音节，重音在第二音节 /ˈsɪ/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'confidentiality', phonetic: '/ˌkɒnfɪˌdenʃiˈæləti/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '保密义务', en: 'the duty not to share what is seen at the food bank' },
      usage: { zh: '工作伦理高频词；形容词 confidential。', en: 'A work-ethics term; the adjective is confidential.' },
      collocations: ['keep confidentiality', 'confidentiality matters', 'breach confidentiality'],
      example: { en: 'Confidentiality matters as much as handing out the food.', zh: '保密与发放食品同等重要。' },
      listening: { zh: '六音节，重音在最后两个元音 /ælə/。', en: 'Six syllables with stress near the final /ælə/.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk you through', sentenceIndex: 0,
      meaning: { zh: '带你逐项过一遍流程', en: 'to explain a routine step by step to newcomers' },
      usage: { zh: '培训开场说法；后接流程、清单。', en: 'A training opener; follow with a routine or list.' },
      example: { en: 'Let me walk you through today’s sorting routine.', zh: '我带你过一遍今天的分拣流程。' },
    },
    {
      phrase: 'regardless of', sentenceIndex: 7,
      meaning: { zh: '不管，不顾（某条件）', en: 'without being affected by a particular detail' },
      usage: { zh: '后接名词；同义表达 no matter。', en: 'Follow with a noun; no matter is a paraphrase.' },
      example: { en: 'Out-of-date food is rejected regardless of the seal.', zh: '不管封口如何，过期食品都拒收。' },
    },
    {
      phrase: 'set aside', sentenceIndex: 8,
      meaning: { zh: '留出，单独放置', en: 'to keep items apart from the main shelf' },
      usage: { zh: '短语动词；set aside for 后接用途。', en: 'A phrasal verb; set aside for takes the purpose.' },
      example: { en: 'Near-date items are set aside for same-day packing.', zh: '临期品单独留出用于当天打包。' },
    },
    {
      phrase: 'very seriously', sentenceIndex: 13,
      meaning: { zh: '严肃对待', en: 'to treat a rule or duty as important' },
      usage: { zh: 'take something seriously；反义 take lightly。', en: 'Take something seriously; the opposite is take lightly.' },
      example: { en: 'We take recipient privacy very seriously.', zh: '我们非常严肃地对待受助者隐私。' },
    },
    {
      phrase: 'reject bin', sentenceIndex: 17,
      meaning: { zh: '进入拒收处理', en: 'to be sent to the reject bin' },
      usage: { zh: 'go to 后接容器；注意名词 reject 的重读位置。', en: 'Follow go to with the bin; note the noun’s first-syllable stress.' },
      example: { en: 'Torn bags go to the reject bin, whatever the food looks like.', zh: '不管食品怎样，破袋都进拒收箱。' },
    },
    {
      phrase: 'cover can be found', sentenceIndex: 19,
      meaning: { zh: '能找到替班人员', en: 'to arrange another volunteer for the missed shift' },
      usage: { zh: 'cover 在此是名词替班；find a cover 同构。', en: 'Here cover means a replacement; find a cover works the same way.' },
      example: { en: 'Notice lets the coordinator find a cover for the shift.', zh: '提前通知方便协调员找替班。' },
    },
  ],
  tips: [
    {
      title: { zh: '两类箱子分开记', en: 'Keep the two bins apart' },
      body: {
        zh: '第 13 题问过期食品去向，第 18 题问破损包装去向：前者进后部 waste bin，后者进 reject bin。录音在同一段落出现两个容器名，听时按食品状态（过期/破损）对应箱子，不要混填。',
        en: 'Item 13 asks where out-of-date food goes and item 18 where damaged packaging goes: the former the back waste bin, the latter the reject bin. The two bin names appear in one passage; match bin to condition, expiry or damage, and do not swap them.',
      },
    },
    {
      title: { zh: '路线题只填题干线路', en: 'Fill only the route named in the stem' },
      body: {
        zh: '第 15 题问西线路线覆盖地，句 12 一次列出三条路线。选择题与填空题都可能把另外两条路线当干扰，先锁定题干的 western，再从并列三项里取对应地名。',
        en: 'Item 15 asks the western route, and sentence 12 lists three routes at once. Both choice and gap items may use the other routes as distractors; fix western in the stem first, then take the matching place from the three listed.',
      },
    },
    {
      title: { zh: '隐私规则抓禁止动作', en: 'Privacy items target the forbidden action' },
      body: {
        zh: '第 16 题考隐私保护的具体动作：不得拍摄打包清单；同段还有不得读出姓名。听到 never、do not 后紧跟的名词就是禁止对象，把动作（read aloud / photograph）与对象（name / list）成对记下。',
        en: 'Item 16 tests the concrete privacy action: no photos of packing lists; the same passage also bans reading names aloud. When you hear never or do not, the following noun is the forbidden object; pair the action, read aloud or photograph, with its name or list.',
      },
    },
  ],
};
