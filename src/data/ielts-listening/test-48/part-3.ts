import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 48 · Part 3 — 抗生素耐药论文评读（三人讨论，英式与美式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：研究分工配对 → 研究设计、临床意义与研究局限（单选 25–27）→ 三条评读共识（多选 28–30）。
 * 题块顺序与录音一致。
 */
export const test48Part3: ListeningLesson = {
  slug: 'test-48-part-3',
  part: 3,
  status: 'published',
  title: { zh: '抗生素耐药论文评读', en: 'Reviewing a paper on antibiotic resistance' },
  summary: {
    zh: '三位研究者评读一项抗生素耐药研究：Thomas 设计调研，Sonia 分析医院数据，Ava 复核实验室耐药谱，资深临床医生起草后续建议。研究是两家医院的前瞻性调研，临床意义是把广谱抗生素留给重症感染；局限是样本小、周期短。共识包括轻症限制用药、记录失效药物、未来试验延长随访；不主张立即停用所有处方，也不无核对就发表结果。',
    en: 'Three reviewers discuss an antibiotic paper: Thomas designed the survey, Sonia analysed data, Ava checked lab patterns, clinician drafted recommendations. It was a two-hospital prospective survey; spare broad drugs for serious cases. The sample was small and short. Agreed: restrict mild use, record failed drugs, plan longer follow-up; no all-out prescription stop, no unchecked publish.',
  },
  accent: { zh: 'Thomas 与 Sonia 是英国口音英语，Ava 是美国口音英语。', en: 'Thomas and Sonia speak British English, and Ava speaks American English.' },
  cast: [
    { id: 'thomas', label: 'THOMAS', gender: 'male', voice: 'en-GB-ThomasNeural' },
    { id: 'sonia', label: 'SONIA', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'ava', label: 'AVA', gender: 'female', voice: 'en-US-AvaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Match each task with the person who handles it. Write the correct letter, A, B, C, D or E next to questions 21–24.',
      options: [
        { key: 'A', text: 'Thomas' },
        { key: 'B', text: 'Sonia' },
        { key: 'C', text: 'Ava' },
        { key: 'D', text: 'the senior clinician' },
        { key: 'E', text: 'the journal editor' },
      ],
      items: [
        { number: 21, text: 'designed the survey' },
        { number: 22, text: 'analysed the hospital data' },
        { number: 23, text: 'reviewed lab resistance patterns' },
        { number: 24, text: 'drafted follow-up recommendations' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What was the study design?',
          options: [
            { key: 'A', text: 'prospective survey of two hospitals over one winter' },
            { key: 'B', text: 'randomised trial of a newly developed drug' },
            { key: 'C', text: 'lab test of bacterial strains from one ward' },
          ],
        },
        {
          number: 26,
          stem: 'What is the main clinical implication?',
          options: [
            { key: 'A', text: 'spare broad antibiotics for truly serious infections' },
            { key: 'B', text: 'prescribe broad antibiotics for every mild cough' },
            { key: 'C', text: 'stop all antibiotic prescriptions on the wards' },
          ],
        },
        {
          number: 27,
          stem: 'What limitation do they note?',
          options: [
            { key: 'A', text: 'small sample drawn from two sites over a short period' },
            { key: 'B', text: 'too many hospitals compared across the region' },
            { key: 'C', text: 'an unlimited set of bacterial strains tested' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE points do the reviewers agree on? Choose three letters, A–E.',
      select: 3,
      stem: 'Which THREE points do the reviewers agree on?',
      options: [
        { key: 'A', text: 'restricted antibiotics in mild cases' },
        { key: 'B', text: 'recorded which drugs failed to work' },
        { key: 'C', text: 'propose longer follow-up in future trials' },
        { key: 'D', text: 'stop every prescription at once' },
        { key: 'E', text: 'publish results without checking lab data' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 3,
      explanation: {
        zh: '定位句 3：I designed the survey myself, agreeing the ward lists and the dates with both site managers。设计调研由 Thomas 负责，对应 A。',
        en: 'Sentence 3: "I designed the survey myself, agreeing the ward lists and the dates". Thomas designed the survey, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：The hospital data was mine to analyse, matching prescriptions against the recorded outcomes。分析医院数据由 Sonia 负责，对应 B。',
        en: 'Sentence 4: "The hospital data was mine to analyse, matching prescriptions against outcomes". Sonia analysed the data, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 5,
      explanation: {
        zh: '定位句 5：I reviewed the lab resistance patterns, checking which drugs failed against the common bacteria。复核实验室耐药谱由 Ava 负责，对应 C。',
        en: 'Sentence 5: "I reviewed the lab resistance patterns, checking which drugs failed". Ava reviewed the lab patterns, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 6,
      explanation: {
        zh: '定位句 6：The senior clinician on the team drafted the follow-up recommendations for the hospital board。起草后续建议由资深临床医生负责，对应 D；期刊编辑只收到成稿。',
        en: 'Sentence 6: "The senior clinician on the team drafted the follow-up recommendations". The clinician drafted recommendations, matching D. The editor only received the finished manuscript.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 10,
      explanation: {
        zh: '定位句 10：The design was a prospective survey across two hospitals, collecting records over one winter。研究设计是两家医院的前瞻性调研，对应 A；随机新药试验、单病房实验室检测均被排除。',
        en: 'Sentence 10: "The design was a prospective survey across two hospitals, collecting records over one winter". The design matches A. A randomised drug trial and a single-ward lab test are ruled out.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 13,
      explanation: {
        zh: '定位句 13：The clinical implication is to spare the broad antibiotics for infections that are truly serious。临床意义是把广谱抗生素留给重症感染，对应 A；轻症常规用药、全部停药都被否定。',
        en: 'Sentence 13: "spare the broad antibiotics for infections that are truly serious". The implication matches A. Routine mild-case use and stopping all prescriptions are rejected.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：The sample was small, drawn from two sites over a short period, so the figures may not generalise。局限是样本小、周期短，对应 A；医院过多、菌株无限制都与原文相反。',
        en: 'Sentence 17: "The sample was small, drawn from two sites over a short period". The limitation matches A. Too many hospitals and unlimited strains contradict the text.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 22,
      explanation: {
        zh: '定位句 22：First, we restricted antibiotics in mild cases, rather than prescribing them by habit。轻症限制用药是共识项，对应 A。',
        en: 'Sentence 22: "we restricted antibiotics in mild cases, rather than prescribing them by habit". Restricting mild-case use matches A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：Second, we recorded which drugs failed to work against the samples we tested。记录失效药物是共识项，对应 B。',
        en: 'Sentence 23: "we recorded which drugs failed to work against the samples we tested". Recording failed drugs matches B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 24,
      explanation: {
        zh: '定位句 24：Third, we propose longer follow-up in any future trial on the same question。未来试验延长随访是共识项，对应 C；D 的立即停药与 E 的无核对发表在句 25、26 被否定。',
        en: 'Sentence 24: "we propose longer follow-up in any future trial". Longer follow-up matches C. Stopping every prescription in D and unchecked publication in E are rejected in sentences 25 and 26.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'The paper we are reviewing this week tracks resistance to common antibiotics in two local hospitals.' },
    { speaker: 'sonia', text: 'I finished the survey section yesterday, and the numbers were clearer than I expected.' },
    { speaker: 'ava', text: 'I went through the lab records before the seminar, and some patterns stood out at once.' },
    { speaker: 'thomas', text: 'I designed the survey myself, agreeing the ward lists and the dates with both site managers.' },
    { speaker: 'sonia', text: 'The hospital data was mine to analyse, matching prescriptions against the recorded outcomes.' },
    { speaker: 'ava', text: 'I reviewed the lab resistance patterns, checking which drugs failed against the common bacteria.' },
    { speaker: 'thomas', text: 'The senior clinician on the team drafted the follow-up recommendations for the hospital board.' },
    { speaker: 'sonia', text: 'The journal editor only received the finished manuscript, and he had no hand in the design.' },
    { speaker: 'ava', text: 'So the four working strands sit with Thomas, Sonia, me and the clinician.' },
    { speaker: 'thomas', text: 'Let’s settle what kind of study this actually was.' },
    { speaker: 'sonia', text: 'The design was a prospective survey across two hospitals, collecting records over one winter.' },
    { speaker: 'ava', text: 'It was not a randomised trial, and there was no new drug being tested here.' },
    { speaker: 'thomas', text: 'What is the main message for clinicians on the wards?' },
    { speaker: 'sonia', text: 'The clinical implication is to spare the broad antibiotics for infections that are truly serious.' },
    { speaker: 'ava', text: 'Mild cases can often be watched, or treated with the narrower drugs that still work.' },
    { speaker: 'thomas', text: 'Overuse of any antibiotic builds resistance in the bacteria that survive.' },
    { speaker: 'ava', text: 'Which limits on the study should we state plainly in our discussion?' },
    { speaker: 'sonia', text: 'The sample was small, drawn from two sites over a short period, so the figures may not generalise.' },
    { speaker: 'thomas', text: 'The follow-up was also brief, and we could not watch patients through a full relapse.' },
    { speaker: 'ava', text: 'We should be honest that the lab tests ran with a limited set of bacterial strains.' },
    { speaker: 'sonia', text: 'The missing long-term data is the biggest gap in the whole paper.' },
    { speaker: 'thomas', text: 'Now the three points our review agreed on, before we note the cautions.' },
    { speaker: 'sonia', text: 'First, we restricted antibiotics in mild cases, rather than prescribing them by habit.' },
    { speaker: 'ava', text: 'Second, we recorded which drugs failed to work against the samples we tested.' },
    { speaker: 'thomas', text: 'Third, we propose longer follow-up in any future trial on the same question.' },
    { speaker: 'sonia', text: 'We did not agree to stop every prescription at once, which would leave serious infections untreated.' },
    { speaker: 'ava', text: 'Nor do we publish the results without checking the supporting lab data.' },
    { speaker: 'thomas', text: 'The review keeps the cautious tone the evidence supports.' },
    { speaker: 'sonia', text: 'Let me walk through the survey figures Thomas set up.' },
    { speaker: 'thomas', text: 'The wards chose patients with confirmed bacterial infection, not viral illnesses.' },
    { speaker: 'ava', text: 'Prescriptions were recorded with their dose and the date the course ended.' },
    { speaker: 'sonia', text: 'Outcomes were split into recovery, slow improvement and no response at all.' },
    { speaker: 'thomas', text: 'The two hospitals used different brand names for the same active drug.' },
    { speaker: 'ava', text: 'I mapped those names back to the generic ingredients before the resistance check.' },
    { speaker: 'sonia', text: 'The control notes listed patients who had never received the broad drug.' },
    { speaker: 'thomas', text: 'That comparison helped separate age effects from the drug effects.' },
    { speaker: 'ava', text: 'Still, the older patients in one ward skewed the recovery numbers upward.' },
    { speaker: 'sonia', text: 'We noted that imbalance in the methods section rather than hiding it.' },
    { speaker: 'thomas', text: 'How might a future study make the result more reliable?' },
    { speaker: 'ava', text: 'Add more hospitals across the region, and keep a register for at least a year.' },
    { speaker: 'sonia', text: 'Track resistance in the local bacteria before and after the prescribing change.' },
    { speaker: 'thomas', text: 'Consult the clinicians who write the ward prescriptions day to day.' },
    { speaker: 'ava', text: 'Their practical concerns about shortages matter as much as the lab results.' },
    { speaker: 'sonia', text: 'The senior clinician’s recommendations cover stock levels and review dates.' },
    { speaker: 'thomas', text: 'He suggests quarterly checks of the antibiotics most often saved for serious cases.' },
    { speaker: 'ava', text: 'The paper does not argue against antibiotics in principle, only against loose use.' },
    { speaker: 'sonia', text: 'Every course still needs a clear reason and a recorded review date.' },
    { speaker: 'thomas', text: 'Resistance changes slowly, so the data from one winter will not tell the whole story.' },
    { speaker: 'ava', text: 'A follow-up after several seasons would show whether the trend held.' },
    { speaker: 'sonia', text: 'The lab team can share strain samples with a neighbouring research centre.' },
    { speaker: 'thomas', text: 'That collaboration would broaden the bacteria covered by the next analysis.' },
    { speaker: 'ava', text: 'We should also note which patient groups were underrepresented.' },
    { speaker: 'sonia', text: 'Children and the elderly appear in fewer records than the adult middle group.' },
    { speaker: 'thomas', text: 'The review could recruit those groups deliberately in the next wave.' },
    { speaker: 'ava', text: 'Before we close, what do we want the reader to take away?' },
    { speaker: 'sonia', text: 'That the evidence supports careful prescribing, not a panic about antibiotics.' },
    { speaker: 'thomas', text: 'The strongest claim the data allows is a measured one, not a sweeping rule.' },
    { speaker: 'ava', text: 'We will leave the drug policy decisions to the hospital board, not the paper.' },
    { speaker: 'sonia', text: 'The discussion section should list the unknowns as clearly as the findings.' },
    { speaker: 'thomas', text: 'I’ll check that the limitations paragraph matches the notes Sonia wrote.' },
    { speaker: 'ava', text: 'I will cross reference the lab table against the prescription log.' },
    { speaker: 'sonia', text: 'Then we send the marked draft back to the senior clinician for review.' },
    { speaker: 'thomas', text: 'Any new claim in the conclusion needs its own line in the methods.' },
    { speaker: 'ava', text: 'Agreed. We will not extend the results beyond what the records show.' },
    { speaker: 'sonia', text: 'The seminar notes are typed up, and the references are filed on the shared drive.' },
    { speaker: 'thomas', text: 'Thanks both. I’ll circulate the revised outline before our next session.' },
    { speaker: 'ava', text: 'No problem. I’ll bring the strain notes to that meeting.' },
  ],
  vocabulary: [
    {
      term: 'survey', phonetic: '/ˈsɜːveɪ/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '调研（医院病历收集）', en: 'the study collecting ward records and prescriptions' },
      usage: { zh: '可数；design the survey、survey section。动词读 /səˈveɪ/。', en: 'Countable: design the survey. The verb has second-syllable stress.' },
      collocations: ['design the survey', 'the survey section', 'the survey figures'],
      example: { en: 'I designed the survey myself with both site managers.', zh: '我和两家站点经理一起设计了调研。' },
      listening: { zh: '双音节，名词重音在第一音节 /ˈsɜː/。', en: 'Two syllables; noun stress on the first.' },
    },
    {
      term: 'data', phonetic: '/ˈdeɪtə/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '数据（病历与处方记录）', en: 'the recorded prescriptions and outcomes analysed' },
      usage: { zh: '不可数；hospital data、analyse the data。', en: 'Uncountable: hospital data.' },
      collocations: ['the hospital data', 'analyse the data', 'the raw data'],
      example: { en: 'The hospital data was mine to analyse.', zh: '医院数据由我来分析。' },
      listening: { zh: '双音节，重音在第一音节 /ˈdeɪ/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'resistance', phonetic: '/rɪˈzɪstəns/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '耐药性（细菌对抗生素耐受）', en: 'the bacteria’s tolerance to the drugs' },
      usage: { zh: '不可数；antibiotic resistance、resistance patterns。', en: 'Uncountable: antibiotic resistance.' },
      collocations: ['resistance patterns', 'antibiotic resistance', 'the resistance check'],
      example: { en: 'I reviewed the lab resistance patterns myself.', zh: '我复核了实验室耐药谱。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈzɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'recommendations', phonetic: '/ˌrekəmenˈdeɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '建议（给医院委员会的后续措施）', en: 'the proposed follow-up steps for the board' },
      usage: { zh: '可数复数；draft recommendations、follow-up recommendations。单数 recommendation。', en: 'Plural countable: draft recommendations; the singular is recommendation.' },
      collocations: ['the follow-up recommendations', 'draft the recommendations', 'the clinician’s recommendations'],
      example: { en: 'The clinician drafted the follow-up recommendations.', zh: '临床医生起草了后续建议。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈdeɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'prospective', phonetic: '/prəˈspektɪv/', partOfSpeech: 'adj.', sentenceIndex: 10,
      meaning: { zh: '前瞻性的（向前收集记录）', en: 'designed to collect records as events unfold' },
      usage: { zh: '形容词；prospective survey、prospective study。', en: 'Adjective: prospective survey.' },
      collocations: ['a prospective survey', 'the prospective design', 'a prospective study'],
      example: { en: 'The design was a prospective survey across two hospitals.', zh: '研究设计是两家医院的前瞻性调研。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈspek/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'infections', phonetic: '/ɪnˈfekʃnz/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '感染（需抗生素的病症）', en: 'the illnesses caused by bacteria in the patient' },
      usage: { zh: '可数复数；serious infections、bacterial infection。单数 infection。', en: 'Plural countable: serious infections; the singular is infection.' },
      collocations: ['serious infections', 'bacterial infection', 'the common infection'],
      example: { en: 'Broad antibiotics are spared for truly serious infections.', zh: '广谱抗生素留给真正重症感染。' },
      listening: { zh: '双音节，重音在第二音节 /ˈfek/。', en: 'Two syllables with second-syllable stress.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '样本（纳入研究的患者群）', en: 'the set of patients included in the study' },
      usage: { zh: '可数；small sample、study sample。', en: 'Countable: small sample.' },
      collocations: ['the sample was small', 'the study sample', 'a limited sample'],
      example: { en: 'The sample was small and drawn from two sites.', zh: '样本很小，取自两个站点。' },
      listening: { zh: '双音节，重音在第一音节，/mpl/ 后不加元音。', en: 'Two syllables, first stress, no vowel after /mpl/.' },
    },
  ],
  expressions: [
    {
      phrase: 'went through', sentenceIndex: 2,
      meaning: { zh: '通读，逐项核对（记录）', en: 'to read through and check the records' },
      usage: { zh: '及物；go through the lab records、go through the notes。', en: 'Transitive: go through the lab records.' },
      example: { en: 'I went through the lab records before the seminar.', zh: '研讨前我通读了实验室记录。' },
    },
    {
      phrase: 'stood out', sentenceIndex: 2,
      meaning: { zh: '突出，显眼（模式明显）', en: 'to be clearly visible against the rest' },
      usage: { zh: '不及物；patterns stand out、something stood out。', en: 'Intransitive: patterns stand out.' },
      example: { en: 'Some resistance patterns stood out at once.', zh: '有些耐药模式立刻很显眼。' },
    },
    {
      phrase: 'spare the broad antibiotics', sentenceIndex: 13,
      meaning: { zh: '把广谱抗生素留给（重症）', en: 'to reserve broad drugs for serious cases only' },
      usage: { zh: '及物；spare the broad antibiotics for infections。', en: 'Transitive: spare the broad antibiotics for infections.' },
      example: { en: 'We spare the broad antibiotics for serious infections.', zh: '我们把广谱抗生素留给重症感染。' },
    },
    {
      phrase: 'which drugs failed', sentenceIndex: 23,
      meaning: { zh: '哪些药物失效（无疗效）', en: 'the medications that did not work against the samples' },
      usage: { zh: '名词从句；record which drugs failed。', en: 'Noun clause: record which drugs failed.' },
      example: { en: 'We recorded which drugs failed to work.', zh: '我们记录了哪些药物失效。' },
    },
    {
      phrase: 'longer follow-up', sentenceIndex: 24,
      meaning: { zh: '更长的随访（跟踪观察期）', en: 'the extended period of tracking patients after treatment' },
      usage: { zh: '名词短语；propose longer follow-up、follow-up period。', en: 'Noun phrase: propose longer follow-up.' },
      example: { en: 'We propose longer follow-up in future trials.', zh: '我们建议未来试验延长随访。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先认分工与自主动词', en: 'Match people by ownership verbs' },
      body: {
        zh: '第 21–24 题把四条线索分给三人加一位临床医生。分工句多以第一人称出现：I designed、mine to analyse、I reviewed、the clinician drafted。听到自主动词先记说话人；期刊编辑 E 只收到成稿，是未承担任务的干扰项。',
        en: 'Items 21–24 split four strands among three speakers and a clinician. Ownership appears first person: I designed, mine to analyse, I reviewed, the clinician drafted. Note the speaker before the verb; the editor E only received the manuscript and is a distractor.',
      },
    },
    {
      title: { zh: '单选盯住设计、意义与局限', en: 'Singles target design, meaning and limits' },
      body: {
        zh: '第 25 题设计是两家医院前瞻性调研；第 26 题临床意义是广谱药留给重症；第 27 题局限是样本小、周期短。随机新药试验、单病房检测、轻症常规用药、全部停药、医院过多、菌株无限制都是干扰项。',
        en: 'Item 25 design is a two-hospital prospective survey; item 26 spare broad drugs for serious infections; item 27 small short sample. A randomised trial, single-ward test, routine mild use, all-prescription stop, too many hospitals and unlimited strains are distractors.',
      },
    },
    {
      title: { zh: '多选区分共识项与被否定立场', en: 'Split agreed points from rejected stands' },
      body: {
        zh: '三项入选：轻症限制用药、记录失效药物、未来延长随访。句 25、26 明确否定立即停用所有处方和无核对发表；听到 did not agree to stop、nor publish 直接排除对应项。',
        en: 'The three are mild-case restriction, recording failed drugs and longer follow-up. Sentences 25 and 26 reject stopping every prescription and unchecked publication; cross out options after did not agree to stop and nor publish.',
      },
    },
  ],
};
