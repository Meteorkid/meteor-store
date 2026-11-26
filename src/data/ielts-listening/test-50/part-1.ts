import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 50 · Part 1 — 办理手机合约（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：携号转网保留原号 → 流量档位与合约期 → 境外漫游 → 提前解约费与超套流量；
 * 填空块在前半段，单选块在后半段，题块顺序与录音顺序一致。
 */
export const test50Part1: ListeningLesson = {
  slug: 'test-50-part-1',
  part: 1,
  status: 'published',
  title: { zh: '办理手机合约', en: 'Arranging a mobile phone contract' },
  summary: {
    zh: '用户想更换手机运营商并保留原号码：确认携号转网后号码保留、所选二十 GB 标准档、二十四个月合约期、欧洲漫游覆盖、提前解约费用以及超套流量单价。',
    en: 'A customer switches phone provider and keeps his old number: he confirms the number is retained on porting, chooses the twenty GB standard plan, signs a twenty four month contract, learns about Europe roaming, the early cancellation fee and the per GB extra data charge.',
  },
  accent: { zh: '运营商顾问为加拿大口音，用户为美式口音。', en: 'The adviser speaks with a Canadian accent and the customer with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'customer', label: 'CUSTOMER', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Existing number', cells: [[{ text: 'will be ' }, { blank: 1 }, { text: ' when switching provider' }]] },
        { lead: 'Monthly data allowance', cells: [[{ blank: 2 }, { text: ' GB' }]] },
        { lead: 'Contract length', cells: [[{ blank: 3 }, { text: ' months' }]] },
        { lead: 'Roaming bundle covers', cells: [[{ blank: 4 }]] },
        { lead: 'Early cancellation fee', cells: [[{ text: '$' }, { blank: 5 }]] },
        { lead: 'Extra data costs', cells: [[{ text: '$' }, { blank: 6 }, { text: ' per GB' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 7,
          stem: 'What does the customer decide about his current number?',
          options: [
            { key: 'A', text: 'Keep the same number after switching provider.' },
            { key: 'B', text: 'Buy a brand new local number.' },
            { key: 'C', text: 'Cancel the old number and port it later.' },
          ],
        },
        {
          number: 8,
          stem: 'Which data tier does the adviser recommend for his use?',
          options: [
            { key: 'A', text: 'the ten GB light plan' },
            { key: 'B', text: 'the twenty GB standard plan' },
            { key: 'C', text: 'the unlimited premium plan' },
          ],
        },
        {
          number: 9,
          stem: 'What happens if the contract ends early?',
          options: [
            { key: 'A', text: 'No charge is made as long as the phone is returned.' },
            { key: 'B', text: 'A cancellation fee of 120 dollars is paid.' },
            { key: 'C', text: 'The roaming allowance is cancelled first.' },
          ],
        },
        {
          number: 10,
          stem: 'What does the roaming bundle cover?',
          options: [
            { key: 'A', text: 'calls within Canada only' },
            { key: 'B', text: 'data and calls across Europe' },
            { key: 'C', text: 'free service in every country' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['retained'], evidence: 3,
      explanation: {
        zh: '定位句 3：your existing number is retained when you switch provider。转网后原号保留，对应 retained；句 5 再次强调 keep the same SIM number。',
        en: 'Sentence 3: "your existing number is retained when you switch provider". The old number stays with the customer, matching retained. Sentence 5 repeats that the same SIM number is kept.',
      },
    },
    {
      number: 2, accepted: ['20', 'twenty'], spoken: 'twenty', evidence: 9,
      explanation: {
        zh: '定位句 9：I will put you on the twenty GB standard plan。流量档为二十 GB；句 7 的 ten GB 与 unlimited 是另外两档干扰项。',
        en: 'Sentence 9: "I will put you on the twenty GB standard plan". The chosen allowance is twenty GB. The ten GB and unlimited options in sentence 7 are the other two tiers.',
      },
    },
    {
      number: 3, accepted: ['24', 'twenty four'], spoken: 'twenty four', evidence: 11,
      explanation: {
        zh: '定位句 11：The standard contract lasts twenty four months from the day the SIM activates。合约期二十四个月；句 15 的 month twenty four 回指同一期限。',
        en: 'Sentence 11: "The standard contract lasts twenty four months from the day the SIM activates". The contract runs twenty four months; month twenty four in sentence 15 refers to the same limit.',
      },
    },
    {
      number: 4, accepted: ['Europe'], evidence: 13,
      explanation: {
        zh: '定位句 13：Our roaming bundle covers data and calls across Europe。漫游覆盖欧洲；句 27 说明其他地区按单独漫游费率计算。',
        en: 'Sentence 13: "Our roaming bundle covers data and calls across Europe". The bundle covers Europe. Sentence 27 notes that other regions are charged separate roaming rates.',
      },
    },
    {
      number: 5, accepted: ['120'], spoken: 'one hundred and twenty', evidence: 15,
      explanation: {
        zh: '定位句 15：An early cancellation fee of one hundred and twenty dollars applies。提前解约费一百二十美元；句 19 的 five dollars 是超套流量单价，不要混淆。',
        en: 'Sentence 15: "An early cancellation fee of one hundred and twenty dollars applies". The cancellation fee is 120 dollars. The five dollars in sentence 19 is the extra data unit price, not the cancellation charge.',
      },
    },
    {
      number: 6, accepted: ['5', 'five'], spoken: 'five', evidence: 17,
      explanation: {
        zh: '定位句 17：Extra data costs five dollars per GB, added to the next bill。超套流量每 GB 五美元；空格后已有 per GB，答案只填 five。',
        en: 'Sentence 17: "Extra data costs five dollars per GB, added to the next bill". Extra data is five dollars per GB; per GB already follows the gap, so write only five.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：You chose to keep the same number after switching provider, rather than buying a new local one。用户决定转网后保留同号，对应 A。B 的新本地号、C 的先注销后补转网都与原文相反。',
        en: 'Sentence 21: "You chose to keep the same number after switching provider, rather than buying a new local one". The customer keeps the old number, matching A. A new local number in B and cancelling before porting in C contradict the recording.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：The twenty GB standard plan matches your streaming and maps, not the ten GB light or the unlimited premium。推荐二十 GB 标准档，对应 B。A 档月底不够用，C 档用不满。',
        en: 'Sentence 23: "The twenty GB standard plan matches your streaming and maps, not the ten GB light or the unlimited premium". The standard twenty GB tier is recommended, matching B. The light tier runs out and the premium is unused.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：You pay the early cancellation fee of one hundred and twenty dollars, and return the handset in good order。提前解约需付一百二十美元费用，对应 B。A 说还机就免费，C 说先取消漫游，均未出现。',
        en: 'Sentence 25: "You pay the early cancellation fee of one hundred and twenty dollars, and return the handset in good order". Leaving early costs the 120 dollar fee, matching B. A claims the return waives the charge, and C claims roaming is cut first; neither appears.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：It covers data and calls across Europe; other regions are charged at separate roaming rates。漫游含欧洲境内数据与通话，对应 B。A 只限加拿大国内，C 说所有国家免费，都不准确。',
        en: 'Sentence 27: "It covers data and calls across Europe; other regions are charged at separate roaming rates". Roaming includes European data and calls, matching B. Canada only in A and free worldwide in C are both incorrect.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I want to change my phone provider and keep the same number if I can.' },
    { speaker: 'adviser', text: 'Of course. Let me check what we can offer, starting with your existing number.' },
    { speaker: 'customer', text: 'My current number has been mine for several years, so I would rather not lose it.' },
    { speaker: 'adviser', text: 'Good news. With our contract, your existing number is retained when you switch provider.' },
    { speaker: 'customer', text: 'So the old number follows me across, and I do not need to tell everyone the new one?' },
    { speaker: 'adviser', text: 'That is right. The porting takes two working days, and you keep the same SIM number.' },
    { speaker: 'customer', text: 'Now the monthly data. I stream music and maps most days, so what tiers do you have?' },
    { speaker: 'adviser', text: 'The light plan gives ten GB, the standard plan gives twenty GB, and the premium plan is unlimited.' },
    { speaker: 'customer', text: 'Twenty sounds about right; I rarely use more than that in a normal month.' },
    { speaker: 'adviser', text: 'Then I will put you on the twenty GB standard plan for the contract term.' },
    { speaker: 'customer', text: 'How long does the contract run before I can switch again?' },
    { speaker: 'adviser', text: 'The standard contract lasts twenty four months from the day the SIM activates.' },
    { speaker: 'customer', text: 'And the roaming? I travel to Europe once or twice a year.' },
    { speaker: 'adviser', text: 'Our roaming bundle covers data and calls across Europe, so you do not pay per text there.' },
    { speaker: 'customer', text: 'What if I need to cancel the contract before it runs out?' },
    { speaker: 'adviser', text: 'An early cancellation fee of one hundred and twenty dollars applies if you leave before month twenty four.' },
    { speaker: 'customer', text: 'What about extra data if a month goes over the allowance?' },
    { speaker: 'adviser', text: 'Extra data costs five dollars per GB, added to the next bill.' },
    { speaker: 'customer', text: 'Is there any way that cancellation fee can be waived?' },
    { speaker: 'adviser', text: 'Not under this plan, unless you move abroad or your line is cancelled by us.' },
    { speaker: 'customer', text: 'Looking back at the choices, what did I decide about the old number?' },
    { speaker: 'adviser', text: 'You chose to keep the same number after switching provider, rather than buying a new local one.' },
    { speaker: 'customer', text: 'And which data tier did the rep recommend for my use?' },
    { speaker: 'adviser', text: 'The twenty GB standard plan matches your streaming and maps, not the ten GB light or the unlimited premium.' },
    { speaker: 'customer', text: 'If I left before the contract ends, what would I owe?' },
    { speaker: 'adviser', text: 'You pay the early cancellation fee of one hundred and twenty dollars, and return the handset in good order.' },
    { speaker: 'customer', text: 'How far does the roaming bundle go?' },
    { speaker: 'adviser', text: 'It covers data and calls across Europe; other regions are charged at separate roaming rates.' },
    { speaker: 'customer', text: 'Do I get any discount for paying annually?' },
    { speaker: 'adviser', text: 'Annual payment saves a small amount, but the roaming and cancellation terms stay the same.' },
    { speaker: 'customer', text: 'Can I bring my old unlocked handset with me?' },
    { speaker: 'adviser', text: 'Yes, as long as it works on our network bands; we can check it at the counter today.' },
    { speaker: 'customer', text: 'What about the voicemail setup after the SIM moves?' },
    { speaker: 'adviser', text: 'It transfers with the number, so you keep your existing greeting and messages.' },
    { speaker: 'customer', text: 'Is the porting done while my old SIM still works?' },
    { speaker: 'adviser', text: 'Your old provider keeps the line active until the new SIM is ready, so there is no gap.' },
    { speaker: 'customer', text: 'Any setup fee on top of the monthly bill?' },
    { speaker: 'adviser', text: 'There is no activation charge for this contract, only the monthly plan and any extra data.' },
    { speaker: 'customer', text: 'What if I add a tablet to the same account later?' },
    { speaker: 'adviser', text: 'A second SIM shares the data allowance, with a small monthly line fee.' },
    { speaker: 'customer', text: 'That all sounds fair. I will take the standard twenty GB plan.' },
    { speaker: 'adviser', text: 'Fine. I will start the porting request and confirm the dates by email.' },
  ],
  vocabulary: [
    {
      term: 'provider', phonetic: '/prəˈvaɪdə(r)/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '运营商，服务提供商', en: 'the company that supplies a phone line or service' },
      usage: { zh: '可数名词；phone provider、switch provider，动词 provide。', en: 'Countable: a phone provider, switch provider; the verb is provide.' },
      collocations: ['switch provider', 'the old provider', 'a new provider'],
      example: { en: 'He wants to change his phone provider.', zh: '他想更换手机运营商。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈvaɪ/，双元音。', en: 'Three syllables with stress on the second and a diphthong.' },
    },
    {
      term: 'porting', phonetic: '/ˈpɔːtɪŋ/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '携号转网，转存（号码）', en: 'to keep the same phone number when moving to a new provider' },
      usage: { zh: '移动通信场景；porting 是名词，port the number、the porting takes two days。', en: 'In mobile service: port the number; the noun is porting, which takes two days.' },
      collocations: ['the porting takes', 'port the number', 'the porting request'],
      example: { en: 'The porting takes two working days.', zh: '携号转网需要两个工作日。' },
      listening: { zh: '单音节，长元音 /ɔː/，不要漏听结尾 /t/。', en: 'One syllable with the long vowel /ɔː/; listen for the final /t/.' },
    },
    {
      term: 'allowance', phonetic: '/əˈlaʊəns/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '额度，限额（流量或通话）', en: 'the fixed amount of data or calls included in a plan' },
      usage: { zh: '可数名词；data allowance、monthly allowance，go over the allowance 指超套。', en: 'Countable: a data allowance, a monthly allowance; go over the allowance means exceed it.' },
      collocations: ['the data allowance', 'the monthly allowance', 'go over the allowance'],
      example: { en: 'Extra data applies if a month goes over the allowance.', zh: '当月超出额度就要加购流量。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈlaʊ/，开头 /ə/ 弱读。', en: 'Three syllables with stress on the second; the opening /ə/ is weak.' },
    },
    {
      term: 'roaming', phonetic: '/ˈrəʊmɪŋ/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '境外漫游', en: 'using the phone on a network outside your home country' },
      usage: { zh: '不可数名词；roaming bundle、roaming rates，动词 roam。', en: 'Uncountable: a roaming bundle, roaming rates; the verb is roam.' },
      collocations: ['the roaming bundle', 'roaming rates', 'the roaming allowance'],
      example: { en: 'The roaming bundle covers data and calls across Europe.', zh: '漫游套餐含欧洲境内数据和通话。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈrəʊ/，结尾 /ɪŋ/。', en: 'Two syllables with first-syllable stress and the ending /ɪŋ/.' },
    },
    {
      term: 'cancellation', phonetic: '/ˌkæn səˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '解约，取消（合约）', en: 'the act of ending a contract before its agreed term' },
      usage: { zh: '可数名词；early cancellation fee，动词 cancel。', en: 'Countable: an early cancellation fee; the verb is cancel.' },
      collocations: ['the cancellation fee', 'an early cancellation', 'cancel the contract'],
      example: { en: 'An early cancellation fee applies if you leave before month twenty four.', zh: '第二十四个月之前解约需付提前解约费。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈleɪ/，开头 can 弱读。', en: 'Four syllables with stress on the third; the opening can is weak.' },
    },
    {
      term: 'handset', phonetic: '/ˈhændset/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '手机，手持终端', en: 'the physical phone device used with a SIM card' },
      usage: { zh: '可数名词；return the handset、unlocked handset，正式用语中比 phone 常见。', en: 'Countable: return the handset, an unlocked handset; a formal term for the phone itself.' },
      collocations: ['return the handset', 'an unlocked handset', 'the handset in good order'],
      example: { en: 'The handset must be returned in good order.', zh: '手机须完好归还。' },
      listening: { zh: '复合词，重音在第一音节；hand 与 set 都清晰。', en: 'A compound with first-syllable stress; both hand and set are clear.' },
    },
    {
      term: 'activation', phonetic: '/ˌæktɪˈveɪʃn/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '开通，激活（号码或设备）', en: 'the process of turning on a line, SIM or device' },
      usage: { zh: '不可数名词；activation charge、activate the SIM，动词 activate。', en: 'Uncountable: an activation charge, activate the SIM; the verb is activate.' },
      collocations: ['the activation charge', 'SIM activation', 'activate the line'],
      example: { en: 'There is no activation charge for this contract.', zh: '本合约不收开通费。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈveɪ/，开头 ac 弱读。', en: 'Four syllables with stress on the third; the opening ac is weak.' },
    },
  ],
  expressions: [
    {
      phrase: 'switch provider', sentenceIndex: 3,
      meaning: { zh: '更换运营商', en: 'to move your phone line to a different company' },
      usage: { zh: 'switch 后接 provider；也可说 change provider，名词搭配 mobile provider。', en: 'Switch takes provider; change provider means the same, as in mobile provider.' },
      example: { en: 'Your number is retained when you switch provider.', zh: '转网后你的号码仍然保留。' },
    },
    {
      phrase: 'goes over the allowance', sentenceIndex: 16,
      meaning: { zh: '超出额度', en: 'to use more data or calls than the plan includes' },
      usage: { zh: 'go over 加 allowance；反义 stay within the allowance。', en: 'Go over plus allowance; the opposite is stay within the allowance.' },
      example: { en: 'Extra data applies if a month goes over the allowance.', zh: '当月超套就按单价加购流量。' },
    },
    {
      phrase: 'waived', sentenceIndex: 18,
      meaning: { zh: '被免除（费用）', en: 'to be cancelled or not charged under a condition' },
      usage: { zh: '被动形式 be waived；fee waived，主动句 waive the fee。', en: 'Passive: be waived, a fee waived; the active verb is waive the fee.' },
      example: { en: 'The cancellation fee cannot be waived under this plan.', zh: '本计划下解约费不能免除。' },
    },
    {
      phrase: 'in good order', sentenceIndex: 25,
      meaning: { zh: '完好，状态正常', en: 'in sound condition, without damage or fault' },
      usage: { zh: '归还设备的常用说法；return the handset in good order。', en: 'Common when returning equipment: return the handset in good order.' },
      example: { en: 'The handset is returned in good order.', zh: '手机完好归还。' },
    },
    {
      phrase: 'extra data', sentenceIndex: 17,
      meaning: { zh: '超套流量', en: 'data bought beyond the included monthly allowance' },
      usage: { zh: '名词短语；extra data costs five dollars per GB，add extra data。', en: 'Noun phrase: extra data costs five dollars per GB, or add extra data.' },
      example: { en: 'Extra data costs five dollars per GB.', zh: '超套流量每 GB 五美元。' },
    },
    {
      phrase: 'shares the data allowance', sentenceIndex: 39,
      meaning: { zh: '同一额度（共享流量）', en: 'the data amount shared across more than one SIM' },
      usage: { zh: '此处指平板副卡与主卡共享数据额度；share the allowance。', en: 'Here the tablet SIM shares the main SIM data; share the allowance.' },
      example: { en: 'A second SIM shares the data allowance.', zh: '副卡共享数据额度。' },
    },
  ],
  tips: [
    {
      title: { zh: '表单数字先标单位再听', en: 'Mark the units before listening' },
      body: {
        zh: '六行表单里 GB、months、per GB 已经给出单位，答案只填数字或名词。听到 ten、twenty、twenty four、five 时先对照行首字段，避免把超套单价五美元填进解约费那一行。',
        en: 'GB, months and per GB already appear in the six rows, so write only the number or noun. Match each number to its row label first; do not put the five dollar extra data price into the cancellation fee row.',
      },
    },
    {
      title: { zh: '套餐三档按用途排除', en: 'Rule out tiers by usage' },
      body: {
        zh: '三档分别是 ten GB light、twenty GB standard、unlimited premium。顾客听音乐和地图，顾问据此选标准档；选项里出现 light 与 premium 时，回原文核对用量描述再排除。',
        en: 'The three tiers are ten GB light, twenty GB standard and unlimited premium. The customer streams music and maps, so the adviser picks the standard tier. When light and premium appear as options, check the usage description before ruling them out.',
      },
    },
    {
      title: { zh: '否定条件里藏着例外', en: 'Exceptions sit in the negatives' },
      body: {
        zh: '顾问说解约费本计划下不免，除非搬家出国或线路被我方取消。听到 unless、not under 这类条件句时，把例外情形记成补充信息，不要把它当成普通条款。',
        en: 'The adviser says the fee cannot be waived under this plan unless the customer moves abroad or the line is cancelled by the provider. When you hear unless or not under, note the exception as a side condition rather than the standard rule.',
      },
    },
  ],
};
