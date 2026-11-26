import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 40 · Part 3 — 志愿行为调查评析（双人讨论，加拿大 + 美式口音）。原创仿真材料，非官方真题。
 *
 * 顺序：分工配对（拟题、抽样框、编码、措辞审查）→ 抽样风险、社会期望偏差、开放评论分析法（单选）→
 * 调查设计三项良好实践（多选）。
 */
export const test40Part3: ListeningLesson = {
  slug: 'test-40-part-3',
  part: 3,
  status: 'published',
  title: { zh: '志愿行为调查评析', en: 'Reviewing survey design on volunteering' },
  summary: {
    zh: '研究团队讨论一项本地志愿服务调查：分工为 Mei 拟题、Dr Reed 核对抽样框、Omar 编码回复、Lina 审查措辞偏差；分析自选样本代表性不足、社会期望偏差让人报喜不报忧，开放评论用主题编码；良好实践包括先界定目标人群、保持措辞中立清晰、记录抽样方式。',
    en: 'The team reviews a volunteering survey: Mei drafts questions, Dr Reed checks the sample frame, Omar codes replies, Lina reviews wording bias. They discuss unrepresentative self selected samples, desirability bias toward acceptable answers, and thematic coding for open comments. Good practice is defining the population, keeping wording neutral and clear, and recording sample choice.',
  },
  accent: { zh: '研究人员为加拿大口音，导师为美式口音。', en: 'The researcher speaks with a Canadian accent and the supervisor with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'mei', label: 'MEI', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'dr-reed', label: 'DR REED', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'What is each person responsible for? Choose four answers from the list and write the correct letter, A, B, C or D, next to questions 21–24.',
      items: [
        { number: 21, text: 'drafts the survey questions' },
        { number: 22, text: 'checks the sample frame' },
        { number: 23, text: 'codes the responses' },
        { number: 24, text: 'reviews the wording for bias' },
      ],
      options: [
        { key: 'A', text: 'Mei, the researcher' },
        { key: 'B', text: 'Dr Reed, the supervisor' },
        { key: 'C', text: 'Omar, the data assistant' },
        { key: 'D', text: 'Lina, the student helper' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What risk does a self selected sample carry?',
          options: [
            { key: 'A', text: 'the views are unrepresentative' },
            { key: 'B', text: 'every age group is over covered' },
            { key: 'C', text: 'the reply rate becomes too high' },
          ],
        },
        {
          number: 26,
          stem: 'What problem does social desirability bias cause?',
          options: [
            { key: 'A', text: 'people answer what looks acceptable rather than truthful' },
            { key: 'B', text: 'people refuse to answer any personal question' },
            { key: 'C', text: 'people give longer open comments' },
          ],
        },
        {
          number: 27,
          stem: 'Which analysis method fits the open comments?',
          options: [
            { key: 'A', text: 'simple counting of names' },
            { key: 'B', text: 'thematic coding of similar comments' },
            { key: 'C', text: 'comparing income levels' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE practices protect a survey like this one? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE practices protect a survey like this one?',
      options: [
        { key: 'A', text: 'define the target population before sampling' },
        { key: 'B', text: 'include leading questions to guide answers' },
        { key: 'C', text: 'keep question wording neutral and clear' },
        { key: 'D', text: 'rely only on one neighbourhood group' },
        { key: 'E', text: 'record how the sample was chosen' },
        { key: 'F', text: 'ignore responses that disagree with the hypothesis' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Mei, you have drafted the survey questions, so walk us through the first version。拟题的是 Mei，对应 A。句 5 说明她写了十道题。',
        en: 'Sentence 4: "Mei, you have drafted the survey questions, so walk us through the first version", matching A. Sentence 5 notes she wrote ten questions.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 6,
      explanation: {
        zh: '定位句 6：I will check the sample frame, to make sure we are inviting people from the whole target population。核对抽样框的是 Dr Reed，对应 B。',
        en: 'Sentence 6: "I will check the sample frame, to make sure we are inviting people from the whole target population", matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 7,
      explanation: {
        zh: '定位句 7：Omar will code the responses once the replies come back from the field。编码回复的是 Omar，对应 C。',
        en: 'Sentence 7: "Omar will code the responses once the replies come back from the field", matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 8,
      explanation: {
        zh: '定位句 8：Lina reviews the wording for bias, so no question pushes the reader toward one answer。审查措辞偏差的是 Lina，对应 D。',
        en: 'Sentence 8: "Lina reviews the wording for bias, so no question pushes the reader toward one answer", matching D.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 13,
      explanation: {
        zh: '定位句 13：The main risk of a self selected sample is that the views are unrepresentative, because the keenest people reply。自选样本的风险是观点不具代表性，对应 A。',
        en: 'Sentence 13: "The main risk of a self selected sample is that the views are unrepresentative, because the keenest people reply", matching A.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：Social desirability bias appears when people answer what looks acceptable rather than truthful。社会期望偏差让人选看起来得体的答案而非真话，对应 A。',
        en: 'Sentence 18: "Social desirability bias appears when people answer what looks acceptable rather than truthful", matching A.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：Thematic coding groups similar comments into themes, rather than counting simple numbers。开放评论用主题编码，对应 B。',
        en: 'Sentence 23: "Thematic coding groups similar comments into themes, rather than counting simple numbers", matching B.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：We define the target population before sampling, keep the wording neutral and clear, and record how the sample was chosen。先界定目标人群是良好实践，选 A。引导性问题在句 29 被排除。',
        en: 'Sentence 27: "We define the target population before sampling, keep the wording neutral and clear, and record how the sample was chosen", selecting A. Leading questions are excluded in sentence 29.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 27,
      explanation: {
        zh: '定位句 27 同上，保持措辞中立清晰是良好实践，选 C。只靠单一邻里群体在句 29 被排除。',
        en: 'Sentence 27 as above: neutral and clear wording belongs in, selecting C. Relying on one neighbourhood group is excluded in sentence 29.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 27,
      explanation: {
        zh: '定位句 27 同上，记录抽样方式是良好实践，选 E。与假设相悖的回复在句 29 被排除，不能忽略。',
        en: 'Sentence 27 as above: recording how the sample was chosen belongs in, selecting E. Replies that disagree with the hypothesis are excluded in sentence 29, not ignored.',
      },
    },
  ],
  transcript: [
    { speaker: 'dr-reed', text: 'How can we tell whether a survey about volunteering really reflects what people do?' },
    { speaker: 'mei', text: 'That is the question our team has been debating before we launch the questionnaire.' },
    { speaker: 'dr-reed', text: 'The study asks how often local residents give time to community projects.' },
    { speaker: 'mei', text: 'It covers one off help, regular shifts and donations of goods.' },
    { speaker: 'dr-reed', text: 'Mei, you have drafted the survey questions, so walk us through the first version.' },
    { speaker: 'mei', text: 'I wrote ten questions, split between weekly habits and attitudes toward volunteering.' },
    { speaker: 'dr-reed', text: 'I will check the sample frame, to make sure we are inviting people from the whole target population.' },
    { speaker: 'mei', text: 'Omar will code the responses once the replies come back from the field.' },
    { speaker: 'dr-reed', text: 'Lina reviews the wording for bias, so no question pushes the reader toward one answer.' },
    { speaker: 'mei', text: 'Before we divide the remaining tasks, let us look at the design choices behind the survey.' },
    { speaker: 'dr-reed', text: 'First, the sample. We need to know who we are trying to reach before anyone fills a form.' },
    { speaker: 'mei', text: 'The target population is adults living in the city who could reasonably take part in local projects.' },
    { speaker: 'dr-reed', text: 'If people choose themselves whether to answer, that is a self selected sample.' },
    { speaker: 'mei', text: 'The main risk of a self selected sample is that the views are unrepresentative, because the keenest people reply.' },
    { speaker: 'dr-reed', text: 'We should compare the returned sample with the known mix of age and area in the city.' },
    { speaker: 'mei', text: 'A sample frame lists everyone we could invite, and we draw names from that list.' },
    { speaker: 'dr-reed', text: 'Next, the wording of the questions.' },
    { speaker: 'mei', text: 'We must keep each question neutral and clear, so the respondent reports what they actually do.' },
    { speaker: 'dr-reed', text: 'Social desirability bias appears when people answer what looks acceptable rather than truthful.' },
    { speaker: 'mei', text: 'Volunteers may overstate their hours, because giving time feels like a good thing to report.' },
    { speaker: 'dr-reed', text: 'We can soften the wording, and ask about the last month rather than the whole year.' },
    { speaker: 'mei', text: 'A leading question would nudge the answer, so Lina flags any phrasing of that kind.' },
    { speaker: 'dr-reed', text: 'What analysis method fits the open comments people write at the end?' },
    { speaker: 'mei', text: 'Thematic coding groups similar comments into themes, rather than counting simple numbers.' },
    { speaker: 'dr-reed', text: 'We compare the closed answers with the comments, so the numbers and the words agree.' },
    { speaker: 'mei', text: 'Omar codes each comment against a set of themes agreed by the whole team.' },
    { speaker: 'dr-reed', text: 'Now which practices protect a survey like this one?' },
    { speaker: 'mei', text: 'We define the target population before sampling, keep the wording neutral and clear, and record how the sample was chosen.' },
    { speaker: 'dr-reed', text: 'Those three steps keep the survey transparent, even when the sample is small.' },
    { speaker: 'mei', text: 'We leave out leading questions, one sided neighbourhood groups and responses that disagree with our guess.' },
    { speaker: 'dr-reed', text: 'A full review of past volunteering studies belongs to the report, not the questionnaire itself.' },
    { speaker: 'mei', text: 'The questions should take about eight minutes to finish, which keeps the reply rate up.' },
    { speaker: 'dr-reed', text: 'We run a pilot with ten residents first, to catch unclear wording and slow questions.' },
    { speaker: 'mei', text: 'The pilot tells us whether people understand the terms we use for regular shifts.' },
    { speaker: 'dr-reed', text: 'We ask one question per item, so a respondent does not answer two ideas at once.' },
    { speaker: 'mei', text: 'Options for frequency cover never, once a month, weekly and more than weekly.' },
    { speaker: 'dr-reed', text: 'An open box lets people add details that the fixed options miss.' },
    { speaker: 'mei', text: 'We check that every question matches the study aim, and drop any item that drifts off topic.' },
    { speaker: 'dr-reed', text: 'Ethics approval asks for a plain note of what the data will be used for.' },
    { speaker: 'mei', text: 'Respondents may skip any question they do not wish to answer.' },
    { speaker: 'dr-reed', text: 'The raw replies stay on the encrypted team drive, and only the analysts see the names.' },
    { speaker: 'mei', text: 'When the fieldwork ends, we clean the sample records before running the comparisons.' },
    { speaker: 'dr-reed', text: 'We weight the returned answers if the sample misses one age group.' },
    { speaker: 'mei', text: 'The report states where the sample is weak, instead of claiming broad results.' },
    { speaker: 'dr-reed', text: 'Lina reads the draft questions aloud to hear whether any phrase sounds awkward.' },
    { speaker: 'mei', text: 'Omar checks that the coding rules match the themes in the pilot comments.' },
    { speaker: 'dr-reed', text: 'We set a closing date two weeks after the invites are sent.' },
    { speaker: 'mei', text: 'A reminder goes to those who have not replied three days before the deadline.' },
    { speaker: 'dr-reed', text: 'The team meets after the pilot to agree the final wording together.' },
    { speaker: 'mei', text: 'We keep the comments anonymous in the summary that goes to the community groups.' },
    { speaker: 'dr-reed', text: 'Charts will show the split between regular volunteers and one off helpers.' },
    { speaker: 'mei', text: 'The open comments help explain why people give their time, not only how often.' },
    { speaker: 'dr-reed', text: 'We avoid asking sensitive details about income or employment unless the analysis needs them.' },
    { speaker: 'mei', text: 'Each invitation explains that taking part is voluntary and has no payment attached.' },
    { speaker: 'dr-reed', text: 'The survey link is sent by email and through two community notice boards.' },
    { speaker: 'mei', text: 'Paper forms are available at the library for residents without email.' },
    { speaker: 'dr-reed', text: 'We count the paper and online replies together once they are entered in the sheet.' },
    { speaker: 'mei', text: 'The team writes a short methods note for anyone who reads the final report.' },
    { speaker: 'dr-reed', text: 'If the sample bias looks large, we run a second round of invites to balance the groups.' },
    { speaker: 'mei', text: 'We do not remove replies just because they challenge what we expected.' },
    { speaker: 'dr-reed', text: 'The analysis separates factual habits from attitudes toward volunteering.' },
    { speaker: 'mei', text: 'Those two can point in different directions, and the report says so plainly.' },
    { speaker: 'dr-reed', text: 'Before we circulate the pilot, let us confirm the roles once more.' },
    { speaker: 'mei', text: 'Mei drafts the questions, the supervisor checks the frame, Omar codes the replies, and Lina reviews the wording.' },
    { speaker: 'dr-reed', text: 'Good. Send me the pilot draft once the wording review is complete.' },
    { speaker: 'mei', text: 'I will collect the comments from the first pilot and mark which questions need a rewrite.' },
  ],
  vocabulary: [
    {
      term: 'survey', phonetic: '/ˈsɜːveɪ/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '调查，问卷', en: 'the study that asks residents about volunteering' },
      usage: { zh: '可数名词；run a survey、the survey questions。', en: 'Countable: run a survey, the survey questions.' },
      collocations: ['run a survey', 'the survey sample', 'a questionnaire survey'],
      example: { en: 'The survey asks how often people volunteer.', zh: '调查询问人们志愿频次。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɜː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '样本，受访群体', en: 'the group of residents who reply to the survey' },
      usage: { zh: '可数名词；a self selected sample、the returned sample。', en: 'Countable: a self selected sample, the returned sample.' },
      collocations: ['the survey sample', 'a self selected sample', 'the sample frame'],
      example: { en: 'A self selected sample may be unrepresentative.', zh: '自选样本可能不具代表性。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɑː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'bias', phonetic: '/ˈbaɪəs/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '偏差，倾向性误导', en: 'the distortion that makes answers or wording favour one side' },
      usage: { zh: '不可数；wording bias、social desirability bias。形容词 biased。', en: 'Uncountable: wording bias, social desirability bias; the adjective is biased.' },
      collocations: ['wording bias', 'sample bias', 'desirability bias'],
      example: { en: 'Lina reviews the wording for bias.', zh: 'Lina 审查措辞偏差。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈbaɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'respondent', phonetic: '/rɪˈspɒndənt/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '受访者，填写问卷的人', en: 'the person who answers the survey questions' },
      usage: { zh: '可数名词；the respondent reports、each respondent。', en: 'Countable: the respondent reports, each respondent.' },
      collocations: ['the survey respondent', 'each respondent', 'the respondent answers'],
      example: { en: 'The respondent reports what they actually do.', zh: '受访者报告真实行为。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈspɒn/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'thematic', phonetic: '/θiˈmætɪk/', partOfSpeech: 'adj.', sentenceIndex: 23,
      meaning: { zh: '主题的，按主题归类的', en: 'grouped around shared themes rather than numbers' },
      usage: { zh: '形容词；thematic coding、thematic analysis。', en: 'Thematic coding, thematic analysis.' },
      collocations: ['thematic coding', 'thematic analysis', 'grouped thematically'],
      example: { en: 'Open comments are grouped by thematic coding.', zh: '开放评论按主题编码归类。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈmæt/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'pilot', phonetic: '/ˈpaɪlət/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '试点，预调查', en: 'the small test run before the main survey' },
      usage: { zh: '可数名词；run a pilot、the pilot draft。', en: 'Countable: run a pilot, the pilot draft.' },
      collocations: ['run a pilot', 'the pilot study', 'the pilot comments'],
      example: { en: 'We run a pilot with ten residents first.', zh: '先找十位居民做试点。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpaɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'coding', phonetic: '/ˈkəʊdɪŋ/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '编码，归类打标', en: 'the work of grouping replies under agreed themes' },
      usage: { zh: '不可数；the coding rules、thematic coding。动词 code。', en: 'Uncountable: the coding rules, thematic coding; the verb is code.' },
      collocations: ['the coding rules', 'thematic coding', 'open coding'],
      example: { en: 'Omar codes each comment against the themes.', zh: 'Omar 按主题给每条评论编码。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkəʊ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'transparent', phonetic: '/trænsˈpærənt/', partOfSpeech: 'adj.', sentenceIndex: 28,
      meaning: { zh: '透明的，可核查的', en: 'open about how the sample and wording were chosen' },
      usage: { zh: '形容词；transparent methods、keep the survey transparent。', en: 'Transparent methods, keep the survey transparent.' },
      collocations: ['transparent methods', 'transparent reporting', 'remain transparent'],
      example: { en: 'The three steps keep the survey transparent.', zh: '三步让调查公开可核查。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈpær/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk us through', sentenceIndex: 4,
      meaning: { zh: '带我们过一遍（初稿）', en: 'to explain the draft section by section' },
      usage: { zh: '及物；walk us through the version、walk through the questions。', en: 'Transitive: walk us through the version, walk through the questions.' },
      example: { en: 'Walk us through the first version.', zh: '带我们过一遍初稿。' },
    },
    {
      phrase: 'split between', sentenceIndex: 5,
      meaning: { zh: '分为（两类）', en: 'to divide questions between two topics' },
      usage: { zh: '及物；split between habits and attitudes。', en: 'Transitive: split between habits and attitudes.' },
      example: { en: 'Ten questions are split between habits and attitudes.', zh: '十道题分为习惯与态度两类。' },
    },
    {
      phrase: 'nudge the answer', sentenceIndex: 21,
      meaning: { zh: '引导答案，暗示倾向', en: 'to push a respondent toward a preferred reply' },
      usage: { zh: '及物；nudge the answer、nudge the reader。', en: 'Transitive: nudge the answer, nudge the reader.' },
      example: { en: 'A leading question would nudge the answer.', zh: '引导性问题会暗示答案。' },
    },
    {
      phrase: 'drifts off topic', sentenceIndex: 37,
      meaning: { zh: '偏离主题', en: 'to move away from the study aim' },
      usage: { zh: '不及物；an item drifts off topic。', en: 'Intransitive: an item drifts off topic.' },
      example: { en: 'Drop any item that drifts off topic.', zh: '删掉偏离主题的题项。' },
    },
    {
      phrase: 'agree the final wording', sentenceIndex: 48,
      meaning: { zh: '商定最终措辞', en: 'to settle the final question phrasing together' },
      usage: { zh: '及物；agree the final wording、agree the wording together。', en: 'Transitive: agree the final wording, agree the wording together.' },
      example: { en: 'The team agrees the final wording after the pilot.', zh: '试点后团队商定最终措辞。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先固定人名身份', en: 'Fix names to roles first' },
      body: {
        zh: '听到四个名字先在选项旁标出身份：Mei 研究者、Dr Reed 导师、Omar 数据助理、Lina 学生助手；题目问职责时把录音动作对到人，别只抓职位名词。',
        en: 'Mark identities beside the options as names appear: Mei researcher, Dr Reed supervisor, Omar data assistant, Lina student helper. Match the described action to the person, not just the job title.',
      },
    },
    {
      title: { zh: '两类偏差分清来源', en: 'Separate the two kinds of bias' },
      body: {
        zh: '抽样偏差来自自选样本不代表全体；社会期望偏差来自受访者报喜不报忧。题目常把样本问题安到措辞上，听时抓住 sample、unrepresentative 与 acceptable、truthful 的对应。',
        en: 'Sampling bias comes from an unrepresentative self selected sample; desirability bias comes from acceptable rather than truthful answers. Distractors attach a sample problem to wording; catch sample and unrepresentative versus acceptable and truthful.',
      },
    },
    {
      title: { zh: '多选区分良好实践与违规做法', en: 'Keep good practice apart from bad practice' },
      body: {
        zh: '纳入：界定目标人群、措辞中立清晰、记录抽样方式；排除：引导性问题、单一邻里群体、忽略相悖回复。多选选项常把违规做法换个说法重复，对照句 27 与句 30 的成对清单。',
        en: 'Keep defining the population, neutral clear wording and sampling record; leave out leading questions, one sided groups and disagreeing replies. Multiple choice distractors rephrase bad practice; check the paired lists in sentences 27 and 30.',
      },
    },
  ],
};
