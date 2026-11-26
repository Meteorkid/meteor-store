import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 43 · Part 1 — 咨询托儿补助（双人对话，英式口音）。原创仿真材料，非官方真题。
 *
 * 家长先打电话询问资格，办事员逐项核对表单：姓氏、孩子出生日期、家庭周收入与补助额度；
 * 表单填空 1–4 按对话顺序出现，单选 5–7 落在申请资格、发放方式与复审周期，表格 8–10 是所需材料。
 */
export const test43Part1: ListeningLesson = {
  slug: 'test-43-part-1',
  part: 1,
  status: 'published',
  title: { zh: '咨询托儿补助', en: 'Enquiring about a childcare bursary' },
  summary: {
    zh: '一位家长致电咨询托儿补助：报上姓氏、孩子出生日期与家庭周收入，办事员核对资格门槛、每周补助额度、入账方式与每学期复审周期，并列出身份证明、收入凭证和入托证明三类材料。',
    en: 'A parent phones about the childcare bursary and gives the surname, the child’s date of birth and weekly household income. The officer checks the income threshold, the weekly contribution, the weekly payment method and the termly review, then lists identity, income and registration documents.',
  },
  accent: { zh: '办事员与家长均为英式口音。', en: 'Both speakers use British accents.' },
  cast: [
    { id: 'officer', label: 'OFFICER', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'parent', label: 'PARENT', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Surname', cells: [[{ blank: 1 }]] },
        { lead: 'Child’s date of birth', cells: [[{ blank: 2 }]] },
        { lead: 'Weekly household income', cells: [[{ text: '£' }, { blank: 3 }]] },
        { lead: 'Bursary weekly amount', cells: [[{ text: '£' }, { blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'Who can apply for the bursary?',
          options: [
            { key: 'A', text: 'Any working family below the income threshold.' },
            { key: 'B', text: 'Only single parents receiving benefits.' },
            { key: 'C', text: 'Families with children already of school age.' },
          ],
        },
        {
          number: 6,
          stem: 'How is the bursary paid?',
          options: [
            { key: 'A', text: 'In cash collected at the centre desk.' },
            { key: 'B', text: 'Directly into the parent’s bank account each week.' },
            { key: 'C', text: 'As a voucher redeemable at local shops.' },
          ],
        },
        {
          number: 7,
          stem: 'When is eligibility reviewed?',
          options: [
            { key: 'A', text: 'Once every calendar year.' },
            { key: 'B', text: 'At the end of each nursery month.' },
            { key: 'C', text: 'Every term.' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Document', 'Accepted form'],
      rows: [
        { lead: 'Proof of identity', cells: [[{ text: 'either a ' }, { blank: 8 }, { text: ' or a driving licence' }]] },
        { lead: 'Evidence of income', cells: [[{ blank: 9 }]] },
        { lead: 'Centre registration', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Bennett'], evidence: 3,
      explanation: {
        zh: '定位句 3：家长逐字母拼出 Bennett。先记下首字母 B，再跟读音补全；注意双 N 和双 T，不要写成 Benet。',
        en: 'Sentence 3: the parent spells the surname out as B, E, double N, E, double T. Note the first letter and fill in the rest; watch the double N and double T and do not write Benet.',
      },
    },
    {
      number: 2, accepted: ['14 March', 'March 14'], spoken: 'the fourteenth of March', evidence: 5,
      explanation: {
        zh: '定位句 5：She was born on the fourteenth of March, two thousand and twenty-two。年份不是答案；日期按英式 14 March 书写。',
        en: 'Sentence 5: "She was born on the fourteenth of March, two thousand and twenty-two". The year is not the answer. Write the date in British order, 14 March.',
      },
    },
    {
      number: 3, accepted: ['210'], spoken: 'two hundred and ten pounds', evidence: 8,
      explanation: {
        zh: '定位句 8：our combined income is two hundred and ten pounds a week。空格前已印 £，只填数字；这里说的是夫妻合计周收入，不是单人工资。',
        en: 'Sentence 8: "our combined income is two hundred and ten pounds a week". The pound sign is already printed, so write the number only. This is the joint weekly income, not one parent’s salary alone.',
      },
    },
    {
      number: 4, accepted: ['45'], spoken: 'forty-five pounds', evidence: 11,
      explanation: {
        zh: '定位句 11：the weekly contribution is forty-five pounds。这是补助额度；句 13 的 balance 是家庭自付差额，不是补助金额。',
        en: 'Sentence 11: "the weekly contribution is forty-five pounds". This is the bursary amount. The balance in sentence 13 is what the family pays itself, not the grant.',
      },
    },
    {
      number: 5, accepted: ['A'], evidence: 22,
      explanation: {
        zh: '定位句 22：This one is open to any working family, as long as the combined income falls below the threshold。any working family 对应 A；B 与句 24 的 two-parent household 相反，C 未被提及。',
        en: 'Sentence 22: "This one is open to any working family, as long as the combined income falls below the threshold". Any working family matches A. B contradicts the two-parent household in sentence 24, and C is never mentioned.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：It is paid straight into the parent’s bank account each week。straight into the bank account 对应 B；A 错在句中明确说不是现金，C 的购物券在对话里没有出现。',
        en: 'Sentence 15: "It is paid straight into the parent’s bank account each week". The bank account matches B. A is wrong because cash at the desk is explicitly rejected, and shop vouchers in C are never mentioned.',
      },
    },
    {
      number: 7, accepted: ['C'], evidence: 19,
      explanation: {
        zh: '定位句 19：We check the household circumstances every term。every term 对应 C；家长句 18 猜的 once a year 被否定，月度复审 B 没有出现。',
        en: 'Sentence 19: "We check the household circumstances every term". Every term matches C. The once a year guess in sentence 18 is rejected, and monthly review in B is never mentioned.',
      },
    },
    {
      number: 8, accepted: ['passport'], evidence: 26,
      explanation: {
        zh: '定位句 26：we need either a passport or a driving licence。表格已印 either a 和 or a driving licence，缺的就是 passport；出生证明在句中被明确排除。',
        en: 'Sentence 26: "we need either a passport or a driving licence". Either a and or a driving licence are printed, so the missing item is passport. A birth certificate is explicitly excluded.',
      },
    },
    {
      number: 9, accepted: ['payslip'], evidence: 28,
      explanation: {
        zh: '定位句 28：the most useful document is a recent payslip from your employer。收入凭证填 payslip；税务信函只在 figures unclear 时才补交，不是首选材料。',
        en: 'Sentence 28: "the most useful document is a recent payslip from your employer". The income evidence is the payslip. A tax letter is only requested later if the figures are unclear.',
      },
    },
    {
      number: 10, accepted: ['acceptance letter'], evidence: 32,
      explanation: {
        zh: '定位句 32：We also need the centre’s acceptance letter, to confirm that your child has a place there。首列是入托登记，缺的两词文件就是 acceptance letter。',
        en: 'Sentence 32: "We also need the centre’s acceptance letter, to confirm that your child has a place there". The registration row needs the two-word document, the acceptance letter.',
      },
    },
  ],
  transcript: [
    { speaker: 'parent', text: 'I’m calling about the childcare bursary, to find out whether our family might be eligible.' },
    { speaker: 'officer', text: 'Of course, let’s go through the form together, and then I can tell you what paperwork we need.' },
    { speaker: 'officer', text: 'Could I have your surname first, please?' },
    { speaker: 'parent', text: 'It’s Bennett. That’s B, E, double N, E, double T.' },
    { speaker: 'officer', text: 'Bennett, thank you. And the child’s date of birth?' },
    { speaker: 'parent', text: 'She was born on the fourteenth of March, two thousand and twenty-two.' },
    { speaker: 'officer', text: 'The fourteenth of March. I’ll put that down.' },
    { speaker: 'officer', text: 'Now, the bursary is based on weekly household income, so I need to ask what you earn together.' },
    { speaker: 'parent', text: 'My wife works part time, and I do a full time job, so our combined income is two hundred and ten pounds a week.' },
    { speaker: 'officer', text: 'Two hundred and ten. That sits below the threshold, so you should qualify on income grounds.' },
    { speaker: 'parent', text: 'That’s a relief. How much would the bursary cover?' },
    { speaker: 'officer', text: 'For a child under five, the weekly contribution is forty-five pounds, which goes towards nursery fees and meals.' },
    { speaker: 'parent', text: 'Forty-five. Does it cover the full nursery place?' },
    { speaker: 'officer', text: 'No, it is a contribution only, and the family pays the balance directly to the centre.' },
    { speaker: 'parent', text: 'I see. And how do we receive the money?' },
    { speaker: 'officer', text: 'It is paid straight into the parent’s bank account each week, rather than given as cash at the desk.' },
    { speaker: 'parent', text: 'So we would still need to open a bank account in the child’s name?' },
    { speaker: 'officer', text: 'No, the payment goes to the adult who holds the account, and the centre receives a copy of the statement.' },
    { speaker: 'parent', text: 'Right. What about eligibility? Does the review happen once a year?' },
    { speaker: 'officer', text: 'We check the household circumstances every term, because income and working hours can change during the year.' },
    { speaker: 'parent', text: 'Every term, then. We will keep our payslips just in case.' },
    { speaker: 'parent', text: 'Who exactly can apply? I know some schemes are only for single parents.' },
    { speaker: 'officer', text: 'This one is open to any working family, as long as the combined income falls below the threshold on our list.' },
    { speaker: 'parent', text: 'So a two-parent household can apply too?' },
    { speaker: 'officer', text: 'Yes, the scheme does not favour one family type over another, and both parents’ earnings are counted together.' },
    { speaker: 'officer', text: 'Good. Now let’s look at the documents we accept.' },
    { speaker: 'officer', text: 'For proof of identity, we need either a passport or a driving licence, but a birth certificate alone is not enough.' },
    { speaker: 'parent', text: 'I can bring my passport, if that works.' },
    { speaker: 'officer', text: 'That is fine. Next, we need evidence of income, and the most useful document is a recent payslip from your employer.' },
    { speaker: 'parent', text: 'A payslip, not a tax letter?' },
    { speaker: 'officer', text: 'A payslip is enough for the first application, though we may ask for a tax statement later if the figures look unclear.' },
    { speaker: 'parent', text: 'And the third item?' },
    { speaker: 'officer', text: 'We also need the centre’s acceptance letter, to confirm that your child has a place there.' },
    { speaker: 'parent', text: 'The centre gave us that letter last week, so I can bring it with me.' },
    { speaker: 'parent', text: 'What happens if our income rises above the limit later?' },
    { speaker: 'officer', text: 'Then the bursary stops at the end of that term, and we send a letter explaining the decision and the appeal process.' },
    { speaker: 'parent', text: 'And if one of us loses our job?' },
    { speaker: 'officer', text: 'You should tell us straight away, because a drop in income may raise the weekly contribution at the next review.' },
    { speaker: 'officer', text: 'Let me confirm the details on the form. Bennett, child born the fourteenth of March, weekly income two hundred and ten, bursary forty-five pounds.' },
    { speaker: 'parent', text: 'That all sounds correct.' },
    { speaker: 'officer', text: 'You can submit the form online, or hand it in at the centre desk, and we reply within five working days.' },
    { speaker: 'parent', text: 'Thank you for walking me through it.' },
    { speaker: 'officer', text: 'You’re welcome. Bring the three documents with you when you come in.' },
  ],
  vocabulary: [
    {
      term: 'bursary', phonetic: '/ˈbɜːsəri/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '（教育或育儿类）补助金，助学金', en: 'a sum of money granted to help pay for childcare or study' },
      usage: { zh: '可数名词；apply for a bursary、a bursary covers fees。区别于 loan（贷款）。', en: 'Countable: apply for a bursary, a bursary covers fees. Compare loan, which must be repaid.' },
      collocations: ['a childcare bursary', 'apply for a bursary', 'the bursary amount'],
      example: { en: 'The bursary helps families who cannot afford the full nursery fee.', zh: '这笔补助帮助负担不起全额托儿费的家庭。' },
      listening: { zh: '重音在第一音节，三个音节尾音 /əri/ 轻读。', en: 'Stress the first syllable and reduce the final /əri/.' },
    },
    {
      term: 'eligible', phonetic: '/ˈelɪdʒəbl/', partOfSpeech: 'adj.', sentenceIndex: 0,
      meaning: { zh: '符合条件的，有资格的', en: 'allowed to apply or receive a benefit because rules are met' },
      usage: { zh: 'be eligible for something；名词 eligibility。反义是 ineligible。', en: 'be eligible for something; the noun is eligibility. The opposite is ineligible.' },
      collocations: ['eligible for the bursary', 'eligible applicants', 'become eligible'],
      example: { en: 'Only households below the income line are eligible for the grant.', zh: '只有收入低于标准线的家庭才有资格申请补助。' },
      listening: { zh: '四个音节，重音在第一音节，/dʒ/ 是软腭音。', en: 'Four syllables stressed first; the /dʒ/ is a soft affricate.' },
    },
    {
      term: 'threshold', phonetic: '/ˈθreʃhəʊld/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '门槛，临界值（收入达标线）', en: 'the level at which a rule starts or stops applying' },
      usage: { zh: '收入与资格场景高频；below the threshold、income threshold。本义是“门框”。', en: 'Common with income and rules: below the threshold, income threshold. The literal sense is a door sill.' },
      collocations: ['below the threshold', 'income threshold', 'raise the threshold'],
      example: { en: 'Families earning above the threshold do not receive the grant.', zh: '收入超过门槛的家庭领不到这笔补助。' },
      listening: { zh: '开头 /θr/ 辅音丛要读清，结尾 /ʊld/ 不要丢 /l/。', en: 'Listen for the /θr/ cluster and do not drop the /l/ in /ʊld/.' },
    },
    {
      term: 'contribution', phonetic: '/ˌkɒntrɪˈbjuːʃn/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '分担金额，补贴额度', en: 'the part of a cost the grant or scheme pays toward a larger fee' },
      usage: { zh: '可数名词；weekly contribution、a contribution towards fees。动词 contribute。', en: 'Countable: weekly contribution, a contribution towards fees. The verb is contribute.' },
      collocations: ['weekly contribution', 'a contribution to the fees', 'the family contribution'],
      example: { en: 'The scheme makes a contribution towards nursery meals each week.', zh: '该方案每周分担一部分餐费。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈbjuː/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'payslip', phonetic: '/ˈpeɪslɪp/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '工资单，薪资明细单', en: 'the document an employer gives showing wages and deductions' },
      usage: { zh: '可数复合词；recent payslip、a copy of the payslip。', en: 'Countable compound: recent payslip, a copy of the payslip.' },
      collocations: ['a recent payslip', 'hand in the payslip', 'payslip details'],
      example: { en: 'Bring a recent payslip to prove your weekly income.', zh: '带上近期工资单证明你的周收入。' },
      listening: { zh: '复合词两部分都读，slip 与 lip 押韵。', en: 'Both parts are pronounced; slip rhymes with lip.' },
    },
    {
      term: 'passport', phonetic: '/ˈpɑːspɔːt/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '护照（身份证明文件之一）', en: 'an official identity document used to prove who you are' },
      usage: { zh: '可数名词；proof of identity 场景的常见选项。英式 /ˈpɑː/，美式 /ˈpæs/。', en: 'Countable; a common identity proof option. British /ˈpɑː/, American /ˈpæs/.' },
      collocations: ['a valid passport', 'passport or licence', 'show a passport'],
      example: { en: 'A passport is accepted as proof of identity for the form.', zh: '护照可以作为该表格的身份证明。' },
      listening: { zh: '两个音节，重音在第一音节，第二部分轻读。', en: 'Two syllables, stressed on the first, with the second part reduced.' },
    },
    {
      term: 'review', phonetic: '/rɪˈvjuː/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '复审，复核（资格或收入情况的再次核查）', en: 'a second check of circumstances to see whether rules still apply' },
      usage: { zh: '名词与动词同形；eligibility review、at the next review。名词重音在后。', en: 'Noun and verb share the form: eligibility review, at the next review. Noun stress is second.' },
      collocations: ['the termly review', 'at the next review', 'a review of income'],
      example: { en: 'The officer repeats the review every term the child attends.', zh: '孩子在托期间办事员每学期复审一次。' },
      listening: { zh: '与 revue 同音；重音在第二音节 /ˈvjuː/。', en: 'A homophone of revue; stress the second syllable.' },
    },
    {
      term: 'acceptance', phonetic: '/əkˈseptəns/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '录取，接收（中心同意入托的回执）', en: 'the formal agreement that a place has been offered and confirmed' },
      usage: { zh: '可数或不可数；acceptance letter、offer of acceptance。动词 accept。', en: 'Countable or uncountable: acceptance letter, offer of acceptance. The verb is accept.' },
      collocations: ['the acceptance letter', 'an acceptance from the centre'],
      example: { en: 'The centre sends an acceptance letter once a place is confirmed.', zh: '名额确认后中心会寄来录取信。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsep/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'go through', sentenceIndex: 1,
      meaning: { zh: '逐项核对，过一遍（表格或流程）', en: 'to check items one by one as you complete a form or process' },
      usage: { zh: '及物短语动词；go through the form、go through the details。', en: 'Transitive phrasal verb: go through the form, go through the details.' },
      example: { en: 'The officer will go through each section of the application with you.', zh: '办事员会和你逐项核对申请表的每个部分。' },
    },
    {
      phrase: 'qualify on', sentenceIndex: 9,
      meaning: { zh: '凭借……条件达到资格', en: 'to meet the requirements on the basis of a particular factor' },
      usage: { zh: 'qualify on income grounds、qualify on experience；后接所依据的标准。', en: 'qualify on income grounds, qualify on experience; the basis follows on.' },
      example: { en: 'You qualify on income grounds rather than family status.', zh: '你的资格来自收入条件，而不是家庭类型。' },
    },
    {
      phrase: 'straight into', sentenceIndex: 15,
      meaning: { zh: '直接汇入（账户），不经中转', en: 'directly into an account, without another step in between' },
      usage: { zh: 'pay straight into an account；straight 此处是副词“直接”。', en: 'Pay straight into an account; straight is the adverb directly here.' },
      example: { en: 'The grant is paid straight into the adult’s bank account.', zh: '补助金直接汇入成年申请人的银行账户。' },
    },
    {
      phrase: 'proof of identity', sentenceIndex: 26,
      meaning: { zh: '身份证明', en: 'an official document showing who a person is' },
      usage: { zh: '常见搭配 provide proof of identity、proof of identity card。', en: 'Usually provide proof of identity or a proof of identity card.' },
      example: { en: 'Each applicant must bring one form of proof of identity.', zh: '每位申请人都要带一份身份证明。' },
    },
    {
      phrase: 'evidence of income', sentenceIndex: 28,
      meaning: { zh: '收入凭证，收入证明', en: 'documents that show how much a person or household earns' },
      usage: { zh: '申请场景；evidence of income 可由 payslip 或 tax statement 提供。', en: 'Used in applications; evidence of income may be a payslip or tax statement.' },
      example: { en: 'We accept a recent payslip as evidence of income for the scheme.', zh: '我们接受近期工资单作为该项目的收入凭证。' },
    },
    {
      phrase: 'straight away', sentenceIndex: 37,
      meaning: { zh: '立刻，马上', en: 'immediately, without waiting until later' },
      usage: { zh: '英式口语副词短语；同义的 right away 偏美式。', en: 'British colloquial adverb; right away is closer to American English.' },
      example: { en: 'Tell the office straight away if your household income changes.', zh: '家庭收入有变化请立刻告知办公室。' },
    },
    {
      phrase: 'bring it with me', sentenceIndex: 33,
      meaning: { zh: '随身带来', en: 'to carry a document along when you visit' },
      usage: { zh: 'separable 结构；bring it with you、bring the letter with me。', en: 'Separable: bring it with you, bring the letter with me.' },
      example: { en: 'I will bring the acceptance letter with me on Friday.', zh: '我周五会把录取信随身带来。' },
    },
  ],
  tips: [
    {
      title: { zh: '先分清表单四栏各考什么', en: 'Label each form gap before the recording' },
      body: {
        zh: '表单四题分别考姓名、出生日期、周收入和补助额度。听前在每栏旁标注类型：姓名要拼写，日期记日和月，两个金额先听清是谁的收入、是补助还是自付。',
        en: 'The four form gaps ask for a surname, a date of birth, weekly income and the grant amount. Label each gap by type before the recording: listen for spelling, day and month, and which person the money belongs to.',
      },
    },
    {
      title: { zh: '纠正与修正之后才是答案', en: 'The corrected version wins' },
      body: {
        zh: '家长句 18 猜复审 once a year，办事员句 19 用 every term 纠正；句 16 猜孩子名下开户，句 17 被否定。听到 No、actually、rather than 时，划掉先前记下的内容。',
        en: 'The parent guesses once a year in sentence 18, and the officer corrects him to every term in sentence 19. The child’s account guess in sentence 16 is rejected in sentence 17. Cross out the first idea after No, actually or rather than.',
      },
    },
    {
      title: { zh: '表格题按材料类别定位', en: 'Match documents to their category' },
      body: {
        zh: '表格三行分别是身份、收入、登记三类材料。听到 passport、licence 对身份行，payslip、tax statement 对收入行，acceptance letter 对登记行；别把税务信函填进收入首选项。',
        en: 'The three table rows cover identity, income and registration. Match passport and licence to identity, payslip and tax statement to income, and the acceptance letter to registration. Do not write the tax letter in the primary income row.',
      },
    },
  ],
};
