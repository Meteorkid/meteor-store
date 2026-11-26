import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 9 · Part 3 — 小额信贷案例辩论双方交锋。原创仿真材料，非官方真题。
 *
 * 正方以还款记录和妇女储蓄小组立论，反方以高息陷阱、倒闭商户、缺对照组与样本量质疑；
 * 中段核对数据来源与样本辩护，末段说明评分标准与发言安排。
 */
export const test09Part3: ListeningLesson = {
  slug: 'test-09-part-3',
  part: 3,
  status: 'published',
  title: { zh: '小额信贷案例辩论', en: 'Debating a case study on microfinance' },
  summary: {
    zh: '两名辩手就案例研究中的小额信贷方案交锋：正方摆出还款率、描述妇女储蓄小组，反方指出高息套牢借款人、举出发包失败的小商户作为反例；双方又核对数据来源、样本量与研究缺口，最后明确辩论评分看重证据运用、反驳深度与整体结构。',
    en: 'Two debaters argue over a microfinance scheme: the proposer quotes the repayment rate and the saving groups, while the opposer cites high interest and failing businesses. They check the data source and sample size, then agree that scoring rests on evidence, rebuttal and structure.',
  },
  accent: { zh: '正方为澳式口音，反方为英式口音。', en: 'The proposer has an Australian accent and the opposer has a British accent.' },
  speechRate: '+3%',
  cast: [
    { id: 'proposer', label: 'PROPOSER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'opposer', label: 'OPPOSER', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which speaker makes each point? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'Presents figures on loan repayment rates' },
        { key: 'B', text: 'Argues high interest traps borrowers' },
        { key: 'C', text: 'Describes the women’s saving groups' },
        { key: 'D', text: 'Cites failing small businesses as a counterexample' },
        { key: 'E', text: 'Points out the study lacked a control group' },
        { key: 'F', text: 'Questions whether the sample was large enough' },
      ],
      items: [
        { number: 21, text: 'Proposer’s opening case' },
        { number: 22, text: 'Opposer’s first reply' },
        { number: 23, text: 'Proposer’s second argument' },
        { number: 24, text: 'Opposer’s counterexample' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'How does the proposer defend the sample?',
          options: [
            { key: 'A', text: 'The sample covers three villages, enough to show a trend.' },
            { key: 'B', text: 'The figures were checked twice by independent reviewers.' },
            { key: 'C', text: 'The borrowers were drawn from one central street.' },
          ],
        },
        {
          number: 26,
          stem: 'Where did the case study obtain its figures?',
          options: [
            { key: 'A', text: 'The local bank’s own records' },
            { key: 'B', text: 'Interviews carried out with borrowers' },
            { key: 'C', text: 'A national government survey' },
          ],
        },
        {
          number: 27,
          stem: 'What does the opposition say repayment alone fails to show?',
          options: [
            { key: 'A', text: 'Whether borrowers kept up with the schedule' },
            { key: 'B', text: 'Whether borrowers thrived after the loans' },
            { key: 'C', text: 'Whether the bank kept a ledger' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE criteria will the judges use? Choose THREE letters, A–G.',
      select: 3,
      stem: 'Which THREE criteria will the judges use?',
      options: [
        { key: 'A', text: 'Use of evidence from the case study' },
        { key: 'B', text: 'Rebuttal to the opposing points' },
        { key: 'C', text: 'Strict order of the speakers' },
        { key: 'D', text: 'Humour in the opening speech' },
        { key: 'E', text: 'Overall structure of the argument' },
        { key: 'F', text: 'Appearance and dress of the speakers' },
        { key: 'G', text: 'Length of the opening statement' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：Repayment rates stood at eighty-two percent，which the study treats as a clear sign。正方开场摆出还款率数字，对应 A；高息陷阱是反方在句 4 的发言。',
        en: 'Sentence 3: "Repayment rates stood at eighty-two percent, which the study treats as a clear sign". The proposer opens with repayment-rate figures, matching A. The high-interest trap belongs to the opposer in sentence 4.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：The interest charged on each loan is very high, and once a borrower falls behind, the repayments trap the whole family。反方第一击主张高息把借款人套住，对应 B。',
        en: 'Sentence 4: "The interest charged on each loan is very high, and once a borrower falls behind, the repayments trap the whole family". The opposer’s first reply argues high interest traps borrowers, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 5,
      explanation: {
        zh: '定位句 5：the case study also describes the women’s saving groups attached to the scheme。正方第二段转讲储蓄小组，句 6 补充小组每周碰头凑钱，对应 C。',
        en: 'Sentence 5: "the case study also describes the women’s saving groups attached to the scheme". The proposer’s second argument turns to the saving groups, and sentence 6 adds weekly meetings pooling small amounts, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 8,
      explanation: {
        zh: '定位句 8：a set of small businesses that took loans in the third year. Most folded within six months。反方用倒闭商户作反例，对应 D；缺对照组在句 11 是另一条批评。',
        en: 'Sentence 8: "a set of small businesses that took loans in the third year. Most folded within six months". The opposer cites failing businesses as a counterexample, matching D. The missing control group in sentence 11 is a separate criticism.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 12,
      explanation: {
        zh: '定位句 12：the sample covered three villages, which should be enough to show a trend。正方辩护样本覆盖三个村庄、足以看出趋势；句 13 反方仍嫌样本太小。',
        en: 'Sentence 12: "the sample covered three villages, which should be enough to show a trend". The proposer defends three villages as enough for a trend; sentence 13 still calls the sample small.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 15,
      explanation: {
        zh: '定位句 15：The case study pulled its numbers from the local bank’s own records over two years。数据出自银行台账，不是借款人访谈或全国调查。',
        en: 'Sentence 15: "The case study pulled its numbers from the local bank’s own records over two years". The figures come from the bank ledger, neither borrower interviews nor a national survey.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：Keeping up does not mean thriving. The study records no income figures after the loans, only repayment。还款记录看不出借款人之后是否过得更好；是否跟上日程正是还款数字本身能显示的。',
        en: 'Sentence 24: "Keeping up does not mean thriving. The study records no income figures after the loans, only repayment". Repayment cannot show whether borrowers thrived; keeping up with the schedule is what the repayment record already shows.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 35,
      explanation: {
        zh: '定位句 35：how well each side uses evidence, and whether it quotes the case study rather than general opinion。第一项评分标准是证据运用，对应 A。',
        en: 'Sentence 35: "how well each side uses evidence, and whether it quotes the case study rather than general opinion". The first criterion is evidence use, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：the rebuttal. A side that answers the other’s strongest point scores better。第二项标准是回应对方最强论点，对应 B。',
        en: 'Sentence 36: "the rebuttal. A side that answers the other’s strongest point scores better". The second criterion is rebuttal to opposing points, matching B.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 37,
      explanation: {
        zh: '定位句 37：the overall structure. The argument should move from facts to interpretation to a clear conclusion。第三项标准是整体结构，对应 E；发言顺序在句 39 被明确排除在评分之外。',
        en: 'Sentence 37: "the overall structure. The argument should move from facts to interpretation to a clear conclusion". The third criterion is overall structure, matching E. Speaking order is explicitly excluded from scoring in sentence 39.',
      },
    },
  ],
  transcript: [
    { speaker: 'proposer', text: 'Good afternoon, everyone. Today our side argues that the microfinance scheme in the case study genuinely helped small borrowers.' },
    { speaker: 'opposer', text: 'And our side argues the opposite. The scheme looks encouraging on paper, but the loans leave many people worse off.' },
    { speaker: 'proposer', text: 'Our opening case rests on what the study calls a solid repayment record.' },
    { speaker: 'proposer', text: 'Repayment rates stood at eighty-two percent, which the study treats as a clear sign that borrowers could keep up with their debt.' },
    { speaker: 'opposer', text: 'Those eighty-two percent tell only half the story. The interest charged on each loan is very high, and once a borrower falls behind, the repayments trap the whole family.' },
    { speaker: 'proposer', text: 'But the case study also describes the women’s saving groups attached to the scheme.' },
    { speaker: 'proposer', text: 'Members meet each week, and they pool small amounts to cover emergencies without going back to the bank.' },
    { speaker: 'opposer', text: 'Groups like that exist in plenty of schemes, successful or not. They do not prove the loans themselves worked.' },
    { speaker: 'opposer', text: 'Our counterexample is a set of small businesses that took loans in the third year. Most folded within six months, and the owners had to sell household goods to repay the bank.' },
    { speaker: 'proposer', text: 'Those businesses failed for local reasons, not because the loan terms were unfair.' },
    { speaker: 'opposer', text: 'That is your claim, but the study never compared the loan group with borrowers who had no loan at all.' },
    { speaker: 'opposer', text: 'Without that control group, any improvement could be down to luck or to outside help.' },
    { speaker: 'proposer', text: 'Fair point on the control group, but the sample covered three villages, which should be enough to show a trend.' },
    { speaker: 'opposer', text: 'Three villages is still a small sample, and the study does not say whether the numbers were checked twice.' },
    { speaker: 'proposer', text: 'Before we criticise each other’s sources, let me say where the figures come from.' },
    { speaker: 'proposer', text: 'The case study pulled its numbers from the local bank’s own records over two years, matching each loan against the ledger.' },
    { speaker: 'opposer', text: 'A ledger cannot show why a loan was repaid. A family may have sold a shop or received help from relatives.' },
    { speaker: 'proposer', text: 'The saving groups partly explain that support, since members cover each other’s shortfalls.' },
    { speaker: 'opposer', text: 'Then the groups deserve the credit, not the bank loan you are defending.' },
    { speaker: 'proposer', text: 'That is a fair distinction, but the scheme still connected savers with borrowers who had no other source of credit.' },
    { speaker: 'opposer', text: 'Credit at a high price is not access to finance. The study never lists the interest rates side by side with local shop loans.' },
    { speaker: 'proposer', text: 'It does quote one repayment problem in the second year, where a borrower lost part of a harvest.' },
    { speaker: 'opposer', text: 'A single harvest story proves nothing about the whole scheme.' },
    { speaker: 'proposer', text: 'We do not claim every borrower succeeded. Our claim is that the majority kept up with repayments.' },
    { speaker: 'opposer', text: 'Keeping up does not mean thriving. The study records no income figures after the loans, only repayment.' },
    { speaker: 'proposer', text: 'That gap is real, and we should say so in our closing remarks.' },
    { speaker: 'opposer', text: 'It also weakens your opening case, which leaned on the repayment number alone.' },
    { speaker: 'proposer', text: 'Fine. Shall we settle the speaking times before the judges arrive?' },
    { speaker: 'opposer', text: 'Each opening speech runs eight minutes, and each reply has four minutes.' },
    { speaker: 'proposer', text: 'The closing statements are two minutes each, and the speaker order does not change between rounds.' },
    { speaker: 'opposer', text: 'Then I will take notes on your evidence list while you prepare the opening.' },
    { speaker: 'proposer', text: 'I’ll keep the three villages and the repayment rate in front of me, in case the judges ask for sources.' },
    { speaker: 'opposer', text: 'And I will list the failing businesses, the missing control group and the small sample as our main points.' },
    { speaker: 'proposer', text: 'Now, how will the judges score us?' },
    { speaker: 'opposer', text: 'The brief says three things carry the most weight.' },
    { speaker: 'opposer', text: 'First, how well each side uses evidence, and whether it quotes the case study rather than general opinion.' },
    { speaker: 'proposer', text: 'Second, the rebuttal. A side that answers the other’s strongest point scores better than one that only repeats its own opening.' },
    { speaker: 'opposer', text: 'Third, the overall structure. The argument should move from facts to interpretation to a clear conclusion.' },
    { speaker: 'proposer', text: 'What does not count is a clever joke, so we shouldn’t spend time trying to amuse the room.' },
    { speaker: 'opposer', text: 'Right. Speaking order itself is a format rule, not a scoring criterion.' },
    { speaker: 'proposer', text: 'One last check. Are we allowed to use slides, or is this a spoken debate only?' },
    { speaker: 'opposer', text: 'The brief allows one simple slide with key figures, but no videos or hand-outs.' },
    { speaker: 'proposer', text: 'Good. I’ll put the repayment chart on that slide, and leave the saving-group stories for the speech.' },
    { speaker: 'opposer', text: 'We should finish here. The room opens to the audience in ten minutes.' },
  ],
  vocabulary: [
    {
      term: 'repayment', phonetic: '/rɪˈpeɪmənt/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '还款，偿付款项', en: 'the act of paying back borrowed money; a payment made against a loan' },
      usage: { zh: 'repayment rate、keep up with repayments；动词 repay。', en: 'Repayment rate, keep up with repayments; the verb is repay.' },
      collocations: ['repayment rates', 'on-time repayment', 'missed repayments'],
      example: { en: 'The study cites an eighty-two percent repayment rate across the two years.', zh: '研究给出两年间百分之八十二的还款率。' },
      listening: { zh: '重音在第二音节 /ˈpeɪ/，-ment 轻读 /mənt/。', en: 'Stress the second syllable; -ment reduces to /mənt/.' },
    },
    {
      term: 'interest', phonetic: '/ˈɪntrəst/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '贷款利息', en: 'money charged by a lender on top of the amount borrowed' },
      usage: { zh: 'interest charged on a loan；另义“兴趣”靠语境区分。', en: 'Interest charged on a loan; the meaning of curiosity depends on context.' },
      collocations: ['high interest', 'the interest charged', 'an interest rate'],
      example: { en: 'The scheme charges very high interest on each small loan.', zh: '这套方案每笔小额贷款都收很高的利息。' },
      listening: { zh: '三音节，首音节 /ˈɪn/，不要读成 in-ter-est 四拍。', en: 'Three syllables with stress on the first; do not give it four beats.' },
    },
    {
      term: 'borrower', phonetic: '/ˈbɒrəʊə/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '借款人', en: 'a person who takes money that must be paid back' },
      usage: { zh: '对应动词 borrow；放款人是 lender。', en: 'Related to the verb borrow; the lender is the other party.' },
      collocations: ['a small borrower', 'the loan group', 'individual borrowers'],
      example: { en: 'Most borrowers in the study ran small shops or home businesses.', zh: '研究里的借款人多经营小商店或家庭生意。' },
      listening: { zh: '三音节，重音在前；结尾 /ə/ 轻读。', en: 'Three syllables with stress first; the ending is a weak /ə/.' },
    },
    {
      term: 'saving groups', phonetic: '/ˈseɪvɪŋ ɡruːps/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '储蓄小组，互助攒钱组织', en: 'local members who pool small savings and lend among themselves' },
      usage: { zh: '常用复数；动词短语 save up 指“攒钱”。', en: 'Usually plural; the phrasal verb save up means accumulate money.' },
      collocations: ['the women’s saving groups', 'join a saving group', 'weekly saving meetings'],
      example: { en: 'Members of the saving group cover each other’s emergencies.', zh: '储蓄小组成员互相帮衬应急。' },
      listening: { zh: 'saving 双音节 /ˈseɪ-vɪŋ/，groups 尾音 /z/。', en: 'saving has two syllables; groups ends in /z/.' },
    },
    {
      term: 'control group', phonetic: '/kənˈtrəʊl ɡruːp/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '对照组', en: 'a comparison group that does not receive the treatment being studied' },
      usage: { zh: '研究方法高频搭配；反义是 treatment group。', en: 'A common research-methods term; the treatment group receives the scheme.' },
      collocations: ['a missing control group', 'compare with the control group', 'no control group'],
      example: { en: 'Without a control group, the study cannot prove the loans caused the improvement.', zh: '没有对照组，研究无法证明改善来自贷款。' },
      listening: { zh: 'control 重音在第二音节；group 中 ou 读 /uː/。', en: 'Stress control on the second syllable; group has /uː/.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '样本，被调查的一组对象', en: 'the set of people or places studied to represent a wider group' },
      usage: { zh: 'sample size、cover a sample；动词 sample 指“抽样”。', en: 'Sample size, cover a sample; as a verb it means take samples.' },
      collocations: ['a small sample', 'the sample covered', 'the sample size'],
      example: { en: 'The sample covered three villages across the district.', zh: '样本覆盖了片区内三个村庄。' },
      listening: { zh: '双音节，/mpl/ 成音节；澳式读音元音偏 /ɑː/。', en: 'Two syllables; /mpl/ forms the final syllable, with an Australian /ɑː/.' },
    },
    {
      term: 'ledger', phonetic: '/ˈledʒə/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '账目台账，分类账簿', en: 'an official record of money paid and received' },
      usage: { zh: '银行与会计场景；keep a ledger、match against the ledger。', en: 'Banking and accounting: keep a ledger, match against the ledger.' },
      collocations: ['the bank ledger', 'match the ledger', 'the loan ledger'],
      example: { en: 'Each loan was matched against the bank’s own ledger.', zh: '每笔贷款都对照银行自有台账核对。' },
      listening: { zh: '双音节，首音节 /led/，词尾 -ger 弱读 /dʒə/。', en: 'Two syllables with stress on the first; -ger reduces to /dʒə/.' },
    },
    {
      term: 'rebuttal', phonetic: '/rɪˈbʌtl/', partOfSpeech: 'n.', sentenceIndex: 36,
      meaning: { zh: '反驳，答辩', en: 'a reply that directly answers the opposing side’s argument' },
      usage: { zh: '辩论场景；动词 rebut，反驳某人论点用 rebuttal to。', en: 'Debate vocabulary: the verb is rebut, and rebuttal to follows the point.' },
      collocations: ['a strong rebuttal', 'the rebuttal stage', 'answer the rebuttal'],
      example: { en: 'A direct rebuttal scores better than repeating your own opening.', zh: '直接反驳比重复开场更得分。' },
      listening: { zh: '双音节，重音在第二音节 /ˈbʌ/，尾音 /tl/。', en: 'Two syllables with stress on /ˈbʌ/; the ending is /tl/.' },
    },
  ],
  expressions: [
    {
      phrase: 'keep up with', sentenceIndex: 3,
      meaning: { zh: '跟得上，按期偿还（债务）', en: 'to stay on schedule with payments or progress' },
      usage: { zh: '后接债务、进度；同义表达是 keep pace with。', en: 'Follow with debt or progress; a paraphrase is keep pace with.' },
      example: { en: 'Borrowers who keep up with repayments avoid extra charges.', zh: '按期还款的借款人不会产生额外费用。' },
    },
    {
      phrase: 'falls behind', sentenceIndex: 4,
      meaning: { zh: '掉队，拖欠（还款）', en: 'to be late with payments or progress and struggle to catch up' },
      usage: { zh: 'fall behind on something；反义是 catch up。', en: 'Fall behind on something; the opposite is catch up.' },
      example: { en: 'Once a borrower falls behind, the repayments grow harder.', zh: '借款人一旦拖欠，还款会越来越吃力。' },
    },
    {
      phrase: 'pool small amounts', sentenceIndex: 6,
      meaning: { zh: '凑集小额资金', en: 'to combine small sums held by several people' },
      usage: { zh: 'pool 作动词表示共用、汇集；后接资金或资源。', en: 'Here pool is a verb meaning combine; it takes money or resources.' },
      example: { en: 'The members pool small amounts each week for emergencies.', zh: '成员每周凑集小额资金应对急用。' },
    },
    {
      phrase: 'side by side', sentenceIndex: 20,
      meaning: { zh: '并排，逐项对照', en: 'placed next to each other for direct comparison' },
      usage: { zh: 'compare something side by side；引申为“并列”。', en: 'Compare something side by side; it also means standing together.' },
      example: { en: 'The study never lists the two interest rates side by side.', zh: '研究从未把两种利率并排列出对照。' },
    },
    {
      phrase: 'leaned on', sentenceIndex: 26,
      meaning: { zh: '依赖，倚重（某个论据）', en: 'to rely heavily on a particular argument or piece of evidence' },
      usage: { zh: '比喻用法；后接证据、数字或人名。', en: 'Figurative: rely heavily on evidence, figures or a person.' },
      example: { en: 'The opening case leaned on the repayment number alone.', zh: '开场立论只倚重还款这一个数字。' },
    },
    {
      phrase: 'carry the most weight', sentenceIndex: 34,
      meaning: { zh: '分量最重，最有影响力', en: 'to matter most in a decision or judgement' },
      usage: { zh: '评分与判断场景；weight 在此是“重要性”。', en: 'Used in scoring and judgement; weight means importance here.' },
      example: { en: 'Three criteria carry the most weight in the judge’s mark.', zh: '三项标准在评委打分中分量最重。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先锁定说话人立场', en: 'Fix each speaker’s stance before matching' },
      body: {
        zh: '第 21–24 题按说话人分配论点，句 0 和句 1 先交代双方立场：正方主张方案有效，反方主张方案伤人。听论点时先判断归属哪一方，再在选项里找同义改写，避免被同一话题下的细节带偏。',
        en: 'Items 21 to 24 match points to speakers, and sentences 0 and 1 set the stances: the proposer defends the scheme, the opposer attacks it. Judge the speaker first, then match the paraphrase in the options, so shared details do not mislead you.',
      },
    },
    {
      title: { zh: '区分数据来源与数据内容', en: 'Separate the source from the content of the data' },
      body: {
        zh: '第 26 题问数据从哪里来，句 15 给出银行台账；还款率、样本村庄数是数据内容，不是来源。听学术讨论时把 source、figure、sample 三个标签分开记，题干问哪个就填哪一栏。',
        en: 'Item 26 asks where the data came from, and sentence 15 names the bank ledger. The repayment rate and village count are the content of the data, not its source. Keep source, figure and sample in separate columns during academic discussions.',
      },
    },
    {
      title: { zh: '多选题排除格式规则', en: 'Multiple choice: rule out format rules' },
      body: {
        zh: '第 28–30 题选三项评分标准，句 39 明确发言顺序只是格式规则、不计分，句 38 的幽默也被排除。多选题录音常先讲哪些算分、再讲哪些不算，听到 not count、not a criterion 时立刻在对应选项旁打叉。',
        en: 'Items 28 to 30 pick three scoring criteria; sentence 39 says speaking order is only a format rule and sentence 38 excludes humour. Multiple-choice recordings often list what counts before what does not; when you hear not count or not a criterion, cross off that option immediately.',
      },
    },
  ],
};
