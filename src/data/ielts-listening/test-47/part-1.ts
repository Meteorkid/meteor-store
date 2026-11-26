import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 47 · Part 1 — 游客电话预订海滩小屋（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：使用时段 → 烧烤规则 → 押金 → 钥匙领取 → 恶劣天气与巡查（填空块），
 * 后半段复述使用时长、烧烤规则、押金金额、领匙地点与天气退款方式（单选块）。
 * 题块顺序与录音顺序一致。开场用顾客直接诉求，不用机构问候加 How can I help you。
 */
export const test47Part1: ListeningLesson = {
  slug: 'test-47-part-1',
  part: 1,
  status: 'published',
  title: { zh: '租一日海滩小屋', en: 'Booking a beach hut for the day' },
  summary: {
    zh: '一位游客致电预订周六海滩小屋：小屋早上九点开放、全天可用；露台共用烤架可供做饭，押金五十英镑并在到访后退还，钥匙在海滩办公室领取，恶劣天气由管理员每日上午巡查；后半段复述使用时长、烧烤规则、押金金额、领匙地点与雨后半退或代金券的退款方式。',
    en: 'A visitor books a Saturday beach hut: it opens at nine for the full day, the shared terrace grill is available, a fifty-pound deposit is held and returned later, keys come from the beach office, and the warden checks huts each morning; the recap covers session length, barbecue rules, deposit, key location and the half refund or voucher after rain.',
  },
  accent: { zh: '顾客为美式口音，前台为澳式多语言口音。', en: 'The customer speaks with an American accent and the receptionist with an Australian multilingual accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'customer', label: 'CUSTOMER', gender: 'female', voice: 'en-US-JennyNeural' },
    { id: 'receptionist', label: 'RECEPTIONIST', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Hut opens from', cells: [[{ blank: 1 }, { text: ' in the morning.' }]] },
        { lead: 'Shared', cells: [[{ blank: 2 }, { text: ' on the terrace for cooking.' }]] },
        { lead: 'Guests bring their own charcoal and', cells: [[{ blank: 3 }]] },
        { lead: 'Deposit:', cells: [[{ blank: 4 }, { text: ' pounds.' }]] },
        { lead: 'Keys collected from the beach', cells: [[{ blank: 5 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'How long may the hut be used?',
          options: [
            { key: 'A', text: 'Half day only, morning or afternoon.' },
            { key: 'B', text: 'The full day until dusk.' },
            { key: 'C', text: 'Overnight until the next morning.' },
          ],
        },
        {
          number: 7,
          stem: 'What barbecue rule applies?',
          options: [
            { key: 'A', text: 'No barbecue is allowed anywhere on the site.' },
            { key: 'B', text: 'The shared grill on the terrace only.' },
            { key: 'C', text: 'Each hut has its own private grill.' },
          ],
        },
        {
          number: 8,
          stem: 'How much deposit is held?',
          options: [
            { key: 'A', text: 'Ten pounds.' },
            { key: 'B', text: 'Fifty pounds.' },
            { key: 'C', text: 'The full rental paid in advance.' },
          ],
        },
        {
          number: 9,
          stem: 'Where are the keys collected?',
          options: [
            { key: 'A', text: 'At the hut door itself.' },
            { key: 'B', text: 'At the beach office by the entrance path.' },
            { key: 'C', text: 'From the warden’s home address.' },
          ],
        },
        {
          number: 10,
          stem: 'What is the bad weather refund rule?',
          options: [
            { key: 'A', text: 'Full refund whenever the visitor asks.' },
            { key: 'B', text: 'No refund once the booking is confirmed.' },
            { key: 'C', text: 'A half refund, or the balance as a voucher.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['nine', '9'], evidence: 3,
      explanation: {
        zh: '定位句 3：The hut by the second stairway fits that, and it opens from nine in the morning。小屋早上九点开放，填 nine。',
        en: 'Sentence 3: "The hut by the second stairway fits that, and it opens from nine in the morning". Opening time is nine, so write nine.',
      },
    },
    {
      number: 2, accepted: ['grill'], evidence: 7,
      explanation: {
        zh: '定位句 7：the shared grill on the terrace is available to all hut guests。露台共用烤架可供使用，填 grill。句 9 的 charcoal、utensils 是自带物品，不是设施名。',
        en: 'Sentence 7: "the shared grill on the terrace is available to all hut guests". The terrace grill is the shared facility, so write grill. Charcoal and utensils in sentence 9 are what guests bring, not the facility.',
      },
    },
    {
      number: 3, accepted: ['utensils'], evidence: 9,
      explanation: {
        zh: '定位句 9：No, the terrace grill is included, though you bring your own charcoal and utensils。烤架含在内，木炭与用具由客人自带，填 utensils。',
        en: 'Sentence 9: "No, the terrace grill is included, though you bring your own charcoal and utensils". Guests bring their own charcoal and utensils, so write utensils.',
      },
    },
    {
      number: 4, accepted: ['fifty', '50'], evidence: 11,
      explanation: {
        zh: '定位句 11：A deposit of fifty pounds is held when the booking is confirmed。押金五十英镑；空后已印 pounds，填 fifty。',
        en: 'Sentence 11: "A deposit of fifty pounds is held when the booking is confirmed". The deposit is fifty pounds; pounds is printed, so write fifty.',
      },
    },
    {
      number: 5, accepted: ['office'], evidence: 15,
      explanation: {
        zh: '定位句 15：The keys are kept at the beach office, beside the main entrance path。钥匙在海滩办公室领取，填 office。句 17 的 eight thirty 是办公开门时间，不是领匙地点。',
        en: 'Sentence 15: "The keys are kept at the beach office, beside the main entrance path". Keys are collected at the beach office, so write office. Eight thirty in sentence 17 is the opening time, not the location.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：The booking covers the full day until dusk, not a half day and not an overnight stay。全天可用到黄昏，对应 B。A 的半天与句中 not a half day 相反，C 的过夜与 not an overnight stay 相反。',
        en: 'Sentence 21: "The booking covers the full day until dusk, not a half day and not an overnight stay". Full day until dusk matches B. Half day contradicts not a half day, and overnight contradicts not an overnight stay.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：The only allowed cooking is the shared grill on the terrace; private barbecues are not permitted on the sand。只允许露台共用烤架，对应 B。A 的完全禁止烧烤与 grill available 相反，C 的每屋私有烤架与 shared 相反。',
        en: 'Sentence 23: "The only allowed cooking is the shared grill on the terrace; private barbecues are not permitted on the sand". The shared terrace grill matches B. No barbecue contradicts the grill, and private grills contradict shared.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：Fifty pounds is held on booking, returned after the visit unless the hut is damaged。押金为五十英镑，对应 B。A 的十英镑与 C 的预付全额租金在录音中均未出现。',
        en: 'Sentence 25: "Fifty pounds is held on booking, returned after the visit unless the hut is damaged". A fifty-pound deposit matches B. Ten pounds and full advance rental are not mentioned.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：You collect them from the beach office beside the entrance path, not from the hut itself。领匙地点是海滩办公室，对应 B。A 的小屋门口与句中 not from the hut 相反，C 的管理员住址在录音中没有依据。',
        en: 'Sentence 27: "You collect them from the beach office beside the entrance path, not from the hut itself". The beach office matches B. The hut door contradicts not from the hut, and the warden’s home is not said.',
      },
    },
    {
      number: 10, accepted: ['C'], evidence: 29,
      explanation: {
        zh: '定位句 29：After the morning deadline you get a half refund, or the balance held as a voucher for another visit。雨后半退或余额留作代金券，对应 C。A 的任意条件全退与半退相反，B 的概不退款与 refund 相反。',
        en: 'Sentence 29: "After the morning deadline you get a half refund, or the balance held as a voucher for another visit". Half refund or voucher matches C. Full refund on request contradicts the half refund, and no refund contradicts refund itself.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I’m looking to book a beach hut for the day this Saturday, if any are free.' },
    { speaker: 'receptionist', text: 'Good afternoon. Let me check the booking diary for the huts along the front.' },
    { speaker: 'customer', text: 'I have two friends coming, so we want one close enough to the sand.' },
    { speaker: 'receptionist', text: 'The hut by the second stairway fits that, and it opens from nine in the morning.' },
    { speaker: 'customer', text: 'Great. What time do we have to leave by in the evening?' },
    { speaker: 'receptionist', text: 'The booking runs the full day until dusk, so you are not limited to a morning slot.' },
    { speaker: 'customer', text: 'Can we cook food there, or is the kitchen area shared?' },
    { speaker: 'receptionist', text: 'You may not bring your own barbecue, but the shared grill on the terrace is available to all hut guests.' },
    { speaker: 'customer', text: 'Does the grill cost extra on top of the hut rental?' },
    { speaker: 'receptionist', text: 'No, the terrace grill is included, though you bring your own charcoal and utensils.' },
    { speaker: 'customer', text: 'How does the deposit work? Do I pay anything now?' },
    { speaker: 'receptionist', text: 'A deposit of fifty pounds is held when the booking is confirmed, and it is returned after the visit.' },
    { speaker: 'customer', text: 'What happens if the hut has a problem and we cannot use it?' },
    { speaker: 'receptionist', text: 'The deposit is refunded in full in that case, and we move you to another hut if one is free.' },
    { speaker: 'customer', text: 'Where do we collect the keys once we arrive?' },
    { speaker: 'receptionist', text: 'The keys are kept at the beach office, beside the main entrance path.' },
    { speaker: 'customer', text: 'Is anyone there early enough for a nine o’clock start?' },
    { speaker: 'receptionist', text: 'The office opens at eight thirty, so keys are ready before your nine o’clock slot.' },
    { speaker: 'customer', text: 'What if the weather turns bad on the day?' },
    { speaker: 'receptionist', text: 'A weather refund must be reported before nine in the morning, so we know before you travel.' },
    { speaker: 'customer', text: 'Now could you go over the booking once more, so I note it down?' },
    { speaker: 'receptionist', text: 'The booking covers the full day until dusk, not a half day and not an overnight stay.' },
    { speaker: 'customer', text: 'What barbecue rules apply to the hut guests?' },
    { speaker: 'receptionist', text: 'The only allowed cooking is the shared grill on the terrace; private barbecues are not permitted on the sand.' },
    { speaker: 'customer', text: 'And how much is the deposit, once more?' },
    { speaker: 'receptionist', text: 'Fifty pounds is held on booking, returned after the visit unless the hut is damaged.' },
    { speaker: 'customer', text: 'Where exactly do we pick up the keys?' },
    { speaker: 'receptionist', text: 'You collect them from the beach office beside the entrance path, not from the hut itself.' },
    { speaker: 'customer', text: 'What happens if rain cancels the day after we arrive?' },
    { speaker: 'receptionist', text: 'After the morning deadline you get a half refund, or the balance held as a voucher for another visit.' },
    { speaker: 'customer', text: 'Is there parking near the huts?' },
    { speaker: 'receptionist', text: 'A small car park sits behind the café, with a short walk down to the beach front.' },
    { speaker: 'customer', text: 'Are dogs allowed in the hut area?' },
    { speaker: 'receptionist', text: 'Dogs must stay on the lead on the path, and they are not allowed inside the hut itself.' },
    { speaker: 'customer', text: 'Can we bring picnic blankets to sit on the sand?' },
    { speaker: 'receptionist', text: 'Yes, the sand is open to everyone; the hut is just for changing and storing bags.' },
    { speaker: 'customer', text: 'What about wind and rain in the forecast?' },
    { speaker: 'receptionist', text: 'The warden checks the huts each morning and closes any that look unsafe.' },
    { speaker: 'customer', text: 'Do the huts have power or running water inside?' },
    { speaker: 'receptionist', text: 'There is a tap on the terrace, but the huts themselves have no electricity.' },
    { speaker: 'customer', text: 'Shall I pay the rental online before I arrive?' },
    { speaker: 'receptionist', text: 'The balance can be paid at the beach office on the day; only the deposit is held online now.' },
    { speaker: 'customer', text: 'Fine. I will take the second stairway hut for Saturday, then.' },
    { speaker: 'receptionist', text: 'Done. Please check the forecast before you set off, and arrive before the nine o’clock start.' },
  ],
  vocabulary: [
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '押金，预订担保金', en: 'the sum held against the booking and returned after the visit' },
      usage: { zh: '可数；hold a deposit、refund the deposit。动词 deposit 另有“存放”义。', en: 'Countable: hold a deposit, refund the deposit. The verb means place safely.' },
      collocations: ['a deposit of fifty pounds', 'hold the deposit', 'return the deposit'],
      example: { en: 'A deposit of fifty pounds is held when the booking is confirmed.', zh: '预订确认时收取五十英镑押金。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈpɒz/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'warden', phonetic: '/ˈwɔːrdn/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '管理员，看守人（巡查场地设施）', en: 'the person who inspects the huts and closes unsafe ones' },
      usage: { zh: '可数；the beach warden、the warden checks。', en: 'Countable: the beach warden, the warden checks.' },
      collocations: ['the warden checks', 'the beach warden', 'the park warden'],
      example: { en: 'The warden checks the huts each morning in bad weather.', zh: '天气不好时管理员每天上午巡查小屋。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈwɔː/；结尾 /dn/ 成音节。', en: 'Two syllables with first stress; the ending is syllabic /dn/.' },
    },
    {
      term: 'terrace', phonetic: '/ˈterəs/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '露台，屋旁平台', en: 'the paved outdoor platform beside the huts' },
      usage: { zh: '可数；on the terrace、the shared terrace。', en: 'Countable: on the terrace, the shared terrace.' },
      collocations: ['the terrace grill', 'on the terrace', 'the shared terrace'],
      example: { en: 'The shared grill stands on the terrace outside the huts.', zh: '共用烤架摆在小屋外的露台上。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈter/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'voucher', phonetic: '/ˈvaʊtʃər/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '代金券，抵扣凭证', en: 'a document that keeps the balance for a later visit' },
      usage: { zh: '可数；hold as a voucher、a gift voucher。', en: 'Countable: hold as a voucher, a gift voucher.' },
      collocations: ['as a voucher', 'a voucher for another visit', 'the balance as a voucher'],
      example: { en: 'The balance is held as a voucher for another visit.', zh: '余额留作下次到访的代金券。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈvaʊ/；ch 读 /tʃ/。', en: 'Two syllables with first stress; ch is /tʃ/.' },
    },
    {
      term: 'stairway', phonetic: '/ˈsteərweɪ/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '楼梯通道，通往沙滩的台阶', en: 'the steps leading down from the path to the beach' },
      usage: { zh: '可数；the second stairway、the stairway down。', en: 'Countable: the second stairway, the stairway down.' },
      collocations: ['the second stairway', 'the stairway down', 'near the stairway'],
      example: { en: 'The hut sits by the second stairway down to the sand.', zh: '小屋在通往沙滩的第二条台阶旁。' },
      listening: { zh: '复合词，重音在第一词 stair；way 读 /weɪ/。', en: 'Compound with stress on stair; way is /weɪ/.' },
    },
    {
      term: 'charcoal', phonetic: '/ˈtʃɑːrkəʊl/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '木炭（烧烤燃料）', en: 'the fuel guests bring for the terrace grill' },
      usage: { zh: '不可数；bring charcoal、charcoal and utensils。', en: 'Uncountable: bring charcoal, charcoal and utensils.' },
      collocations: ['bring your own charcoal', 'charcoal and utensils', 'the charcoal grill'],
      example: { en: 'Guests bring their own charcoal for the terrace grill.', zh: '露台烤架的木炭由客人自带。' },
      listening: { zh: '复合词，重音在第一词 char；coal 读 /kəʊl/。', en: 'Compound with stress on char; coal is /kəʊl/.' },
    },
  ],
  expressions: [
    {
      phrase: 'go over', sentenceIndex: 20,
      meaning: { zh: '复述，再过一遍（预订细节）', en: 'to review the booking details once more' },
      usage: { zh: '及物短语动词；go over the booking、go over the rules。', en: 'Transitive: go over the booking, go over the rules.' },
      example: { en: 'Could you go over the booking once more so I note it down?', zh: '你能把预订再过一遍吗，我好记下来。' },
    },
    {
      phrase: 'held on booking', sentenceIndex: 25,
      meaning: { zh: '预订时扣留（押金）', en: 'kept as security at the moment of booking' },
      usage: { zh: 'hold a deposit on booking；服务预订场景高频。', en: 'Hold a deposit on booking; common when reserving.' },
      example: { en: 'Fifty pounds is held on booking and returned later.', zh: '五十英镑在预订时扣留，之后退还。' },
    },
    {
      phrase: 'on top of', sentenceIndex: 8,
      meaning: { zh: '在……之外，另外加上', en: 'in addition to the main rental price' },
      usage: { zh: 'on top of the rental；费用叠加高频。', en: 'On top of the rental; common with added costs.' },
      example: { en: 'The grill is included, with no cost on top of the hut rental.', zh: '烤架含在内，小屋租金之外不再加钱。' },
    },
    {
      phrase: 'on the lead', sentenceIndex: 33,
      meaning: { zh: '牵着牵引绳（宠物）', en: 'kept attached to a leash on the path' },
      usage: { zh: 'dogs on the lead；场地规则高频。', en: 'Dogs on the lead; common in site rules.' },
      example: { en: 'Dogs must stay on the lead along the beach path.', zh: '沿沙滩路径狗必须牵绳。' },
    },
    {
      phrase: 'closes any that look unsafe', sentenceIndex: 37,
      meaning: { zh: '关闭看起来不安全的（小屋）', en: 'to shut facilities that seem unsafe before use' },
      usage: { zh: 'close + 名词 + 定语从句；场地处置高频。', en: 'Close plus a noun plus a relative clause; common in site decisions.' },
      example: { en: 'The warden closes any huts that look unsafe.', zh: '管理员关闭任何看起来不安全的小屋。' },
    },
  ],
  tips: [
    {
      title: { zh: '先看卷面已给单位', en: 'Check the printed unit on the note' },
      body: {
        zh: '第 1、3、5 题卷面已印 in the morning、pounds、check the huts each morning，填空只写数字或名词。落笔前先看空格前后的单位与动词，避免把整句抄进去超出词数限制。',
        en: 'Items 1, 3 and 5 already print in the morning, pounds and check the huts each morning, so write the number or noun only. Check the printed unit and verb beside the gap before writing, so you do not copy the whole phrase and break the word limit.',
      },
    },
    {
      title: { zh: '规则题抓唯一允许项', en: 'Catch the single allowed option' },
      body: {
        zh: '第 7 题问烧烤规则，录音用 the only allowed cooking、private barbecues are not permitted 这类对比。听到 the only、not permitted 时记下允许与禁止两侧，答案取被允许的共用烤架，私有烧烤是干扰。',
        en: 'Item 7 asks the barbecue rule; the recording uses the only allowed cooking and private barbecues are not permitted. Note both allowed and banned sides on such a contrast, and choose the shared grill, treating private barbecues as distractors.',
      },
    },
    {
      title: { zh: '复述段按题号顺序找答案', en: 'Follow the recap section in question order' },
      body: {
        zh: '单选六到十题在后半段复述中依次出现：使用时长、烧烤规则、押金金额、领匙地点、天气退款。听到 once more、again 这类复述信号时，按题号顺序在对应句找答案词，不要把上一题的细节填进下一题。',
        en: 'Singles 6 to 10 appear in order in the recap: session length, barbecue rule, deposit, key location, weather refund. At a recap signal such as once more, match the next question number in order, rather than carrying the previous detail forward.',
      },
    },
  ],
};
