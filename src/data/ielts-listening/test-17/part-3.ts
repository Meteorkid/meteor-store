import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 17 · Part 3 — 三人小组分析远程办公调查数据。原创仿真材料，非官方真题。
 *
 * 讨论依次暴露样本偏差、确定生产率指标、选择图表形式并收紧结论措辞；
 * 中段核对指标口径、混合办公分组与图表分工，后段处理直填问卷、噪音指标与成稿顺序。
 */
export const test17Part3: ListeningLesson = {
  slug: 'test-17-part-3',
  part: 3,
  status: 'published',
  title: { zh: '远程办公数据分析', en: 'Analysing data on remote work' },
  summary: {
    zh: '三名学生分析远程办公调查数据：Ryan 指出样本偏年轻、偏城市且科技业集中；Neerja 主张用完成任务量和会议负载替代自报工时；Aria 选择堆叠条形图作主图；两人一致要求结论谨慎，不把远程办公说成明显更优，摘要保持克制。后段区分混合办公组别、剔除直填问卷、留出薄弱数据领域。',
    en: 'Three students analyse remote-work data: Ryan flags a young, city-heavy, tech-dominated sample; Neerja argues for completed tasks and meeting load over self-reported hours; Aria chooses a stacked bar; the two keep conclusions cautious, avoid calling remote work clearly superior, and restrain the abstract. Later they split the hybrid group, remove straight-line replies and mark thin sectors.',
  },
  accent: { zh: 'Neerja 为印度口音，Ryan 为英式口音，Aria 为美式口音。', en: 'Neerja speaks with an Indian accent, Ryan with a British accent, and Aria with an American accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'ryan', label: 'RYAN', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Who raises each point? Choose the correct letter, A–D.',
      options: [
        { key: 'A', text: 'Neerja' },
        { key: 'B', text: 'Ryan' },
        { key: 'C', text: 'Aria' },
        { key: 'D', text: 'Neerja and Aria' },
      ],
      items: [
        { number: 21, text: 'Raises the sample bias problem' },
        { number: 22, text: 'Leads the metric selection' },
        { number: 23, text: 'Suggests the chart style' },
        { number: 24, text: 'Warns against overstating the conclusion' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What sample bias does Ryan identify?',
          options: [
            { key: 'A', text: 'Older regional workers were overrepresented' },
            { key: 'B', text: 'Young city-centre workers replied more often' },
            { key: 'C', text: 'Healthcare staff filled most forms' },
          ],
        },
        {
          number: 26,
          stem: 'Which two metrics do they settle on?',
          options: [
            { key: 'A', text: 'Completed tasks and meeting load' },
            { key: 'B', text: 'Hours logged and break time' },
            { key: 'C', text: 'Messages and interruptions' },
          ],
        },
        {
          number: 27,
          stem: 'What chart does Aria choose for the main report?',
          options: [
            { key: 'A', text: 'A single trend line over months' },
            { key: 'B', text: 'A plain appendix table' },
            { key: 'C', text: 'A stacked bar with task output and meeting hours' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE cautions about wording do they agree on? Choose THREE letters, A–G.',
      select: 3,
      stem: 'Which THREE cautions about wording do they agree on?',
      options: [
        { key: 'A', text: 'Do not call remote work clearly superior' },
        { key: 'B', text: 'Use "mixed results" rather than a clear win' },
        { key: 'C', text: 'Avoid naming any sector in the report' },
        { key: 'D', text: 'Keep the abstract cautious in tone' },
        { key: 'E', text: 'Publish logged hours without comment' },
        { key: 'F', text: 'Compare salaries across departments' },
        { key: 'G', text: 'Ignore the gap for older workers' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['B'], evidence: 3,
      explanation: {
        zh: '定位句 3：My first concern is the sample itself. The people who answered were mostly young and based in the city centre。样本偏差由 Ryan 先提出，对应 B。',
        en: 'Sentence 3: "My first concern is the sample itself. The people who answered were mostly young and based in the city centre". Ryan raises the sample bias, matching B.',
      },
    },
    {
      number: 22, accepted: ['A'], evidence: 7,
      explanation: {
        zh: '定位句 7：Once the bias is noted, we need to choose what actually measures productivity。Neerja 接过指标选择议题，对应 A；图表建议在句 11 归 Aria。',
        en: 'Sentence 7: "Once the bias is noted, we need to choose what actually measures productivity". Neerja leads metric selection, matching A; the chart suggestion in sentence 11 belongs to Aria.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 11,
      explanation: {
        zh: '定位句 11：For the charts, I would start with a line showing monthly changes over the past year。图表形式由 Aria 先提议，对应 C。',
        en: 'Sentence 11: "For the charts, I would start with a line showing monthly changes over the past year". Aria suggests the chart style, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 13,
      explanation: {
        zh: '定位句 13：And we should both keep the wording cautious, so the conclusion does not promise what the data cannot show。谨慎措辞由 Neerja 与 Aria 共同主张，对应 D。',
        en: 'Sentence 13: "And we should both keep the wording cautious, so the conclusion does not promise what the data cannot show". Neerja and Aria jointly warn against overstatement, matching D.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：City workers replied more often than those outside the centre。偏差是市中心年轻工人回复更多；年长地区员工是代表不足，不是过多，医疗业只占小部分。',
        en: 'Sentence 15: "City workers replied more often than those outside the centre". The bias favours young city-centre replies; older regional workers are underrepresented, not overrepresented, and healthcare appears in small numbers.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 20,
      explanation: {
        zh: '定位句 20：Those two measures, completed tasks and meeting load, give us a fairer picture than logged hours。最终指标是完成任务量与会议负载；工时与休息时间被排除。',
        en: 'Sentence 20: "Those two measures, completed tasks and meeting load, give us a fairer picture than logged hours". The settled metrics are completed tasks and meeting load; hours and break time are excluded.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 24,
      explanation: {
        zh: '定位句 24：For the main report figure, I will use a stacked bar that shows task output alongside meeting hours。主图是堆叠条形图；趋势线只是早期想法，附录表格不是主图。',
        en: 'Sentence 24: "For the main report figure, I will use a stacked bar that shows task output alongside meeting hours". The main figure is the stacked bar; the trend line was an early idea and the table sits in the appendix.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 31,
      explanation: {
        zh: '定位句 31：The conclusion must not call remote work clearly superior to the office。第一项措辞禁忌是不得宣称远程明显更优，对应 A。',
        en: 'Sentence 31: "The conclusion must not call remote work clearly superior to the office". The first wording caution is avoiding a clear-superiority claim, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 32,
      explanation: {
        zh: '定位句 32：Better to write mixed results, and say the picture depends on the role and the team。第二项是用 mixed results 代替明确胜出，对应 B。',
        en: 'Sentence 32: "Better to write mixed results, and say the picture depends on the role and the team". The second caution is mixed results rather than a clear win, matching B.',
      },
    },
    {
      number: 30, accepted: ['D'], evidence: 33,
      explanation: {
        zh: '定位句 33：The abstract should keep that cautious tone, without a confident prediction about the future of work。第三项是摘要保持克制，对应 D；点出薄弱行业是另一要求，不在这三项内。',
        en: 'Sentence 33: "The abstract should keep that cautious tone, without a confident prediction about the future of work". The third caution is a cautious abstract, matching D; naming thin sectors is a separate requirement, not one of these three.',
      },
    },
  ],
  transcript: [
    { speaker: 'ryan', text: 'The survey reached under four thousand office workers last year, and only two in ten answered all questions.' },
    { speaker: 'neerja', text: 'Our tutorial asks what this remote-work data shows, not what the press says.' },
    { speaker: 'aria', text: 'The raw responses are in the shared folder, split by department and pattern.' },
    { speaker: 'ryan', text: 'My first concern is the sample itself. The people who answered were mostly young and based in the city centre.' },
    { speaker: 'neerja', text: 'That makes sense. Older staff in regional offices are barely represented in the responses.' },
    { speaker: 'aria', text: 'Should we check the industry mix before we trust any average?' },
    { speaker: 'ryan', text: 'We did. Technology firms are overrepresented, while healthcare and retail appear only in small numbers.' },
    { speaker: 'neerja', text: 'Once the bias is noted, we need to choose what actually measures productivity.' },
    { speaker: 'aria', text: 'Hours logged reward people who stay late, not those who finish fast.' },
    { speaker: 'ryan', text: 'Self-reported hours tend to be generous, so I would not put that in the headline figure.' },
    { speaker: 'neerja', text: 'Then let us track completed tasks and the number of meetings each week, which both relate to output.' },
    { speaker: 'aria', text: 'For the charts, I would start with a line showing monthly changes over the past year.' },
    { speaker: 'ryan', text: 'A bar comparison between home and office days reads better than one trend line.' },
    { speaker: 'neerja', text: 'And we should both keep the wording cautious, so the conclusion does not promise what the data cannot show.' },
    { speaker: 'aria', text: 'Ryan checks figures, Neerja drafts wording, and I arrange the visuals.' },
    { speaker: 'ryan', text: 'Before we look at results, the sample gap matters most. City workers replied more often than those outside the centre.' },
    { speaker: 'neerja', text: 'So any finding should carry a note that regional and older workers are underrepresented.' },
    { speaker: 'aria', text: 'The report should not pretend the sample mirrors every workforce.' },
    { speaker: 'ryan', text: 'On the metrics, what exactly counts as a completed task?' },
    { speaker: 'neerja', text: 'A task marked finished in the team tracker, with no follow-up comment left open.' },
    { speaker: 'neerja', text: 'Those two measures, completed tasks and meeting load, give us a fairer picture than logged hours.' },
    { speaker: 'aria', text: 'Do we need to count interruptions and messages as a separate burden?' },
    { speaker: 'ryan', text: 'We can note them in the discussion, but they should not become a main metric this time.' },
    { speaker: 'neerja', text: 'Good. Keep the number of measures small enough to explain in one tutorial page.' },
    { speaker: 'aria', text: 'For the main report figure, I will use a stacked bar that shows task output alongside meeting hours.' },
    { speaker: 'ryan', text: 'A stacked bar works if each segment is labelled clearly, otherwise readers guess the values.' },
    { speaker: 'neerja', text: 'The appendix table can carry the raw figures behind that bar.' },
    { speaker: 'aria', text: 'Home days go soft blue, office days grey, to match the report legend.' },
    { speaker: 'ryan', text: 'Shall we state whether remote workers were more productive overall?' },
    { speaker: 'neerja', text: 'Not yet. The data only covers a single year, and the sample bias could move the averages either way.' },
    { speaker: 'aria', text: 'We can compare groups, but the gap between them stays modest in most departments.' },
    { speaker: 'ryan', text: 'The conclusion must not call remote work clearly superior to the office.' },
    { speaker: 'neerja', text: 'Better to write mixed results, and say the picture depends on the role and the team.' },
    { speaker: 'aria', text: 'The abstract should keep that cautious tone, without a confident prediction about the future of work.' },
    { speaker: 'ryan', text: 'A strong claim would be easy to challenge once the reader notices the sample gap.' },
    { speaker: 'neerja', text: 'Exactly. We qualify the finding, and we name the sectors where the data is thin.' },
    { speaker: 'aria', text: 'In the methods section, we list the response rate and the main groups missing from the survey.' },
    { speaker: 'ryan', text: 'What about people who work partly from home, the hybrid group?' },
    { speaker: 'neerja', text: 'Keep them as a separate column, because lumping them with fully remote workers hides the differences.' },
    { speaker: 'aria', text: 'Hybrid respondents split their week, closer to the office group than the remote one.' },
    { speaker: 'ryan', text: 'Fine. Three columns then, fully remote, hybrid and in-office.' },
    { speaker: 'neerja', text: 'The tutorial deadline is next Friday, so we should split the draft before the middle of the week.' },
    { speaker: 'aria', text: 'I can finish the three charts by Wednesday evening.' },
    { speaker: 'ryan', text: 'I will write the methods and the sample-bias paragraph once the figures are fixed.' },
    { speaker: 'neerja', text: 'And I will draft the results and conclusion, using the cautious phrases we agreed on.' },
    { speaker: 'aria', text: 'We should agree the wording before the charts are finalised, so captions match the text.' },
    { speaker: 'ryan', text: 'Is there any figure we should drop altogether?' },
    { speaker: 'neerja', text: 'Average break time looks too noisy, varying by office policy more than pattern.' },
    { speaker: 'aria', text: 'Leave break time out of the comparison, and note it only as a follow-up.' },
    { speaker: 'ryan', text: 'Did anyone spot a respondent who filled the same answer on every line?' },
    { speaker: 'neerja', text: 'A small number of straight-line replies, which we mark for removal before calculating means.' },
    { speaker: 'aria', text: 'We should record those exclusions in the appendix, so the analysis stays transparent.' },
    { speaker: 'ryan', text: 'The survey also asked about home equipment, but that question sits outside our productivity question.' },
    { speaker: 'neerja', text: 'We can reference it in one sentence, but do not build a chart around it.' },
    { speaker: 'aria', text: 'The final page should lead with the clearest finding, not the most surprising one.' },
    { speaker: 'ryan', text: 'Which finding is that, in your view?' },
    { speaker: 'neerja', text: 'Working pattern alone does not decide output; tools and role matter as much.' },
    { speaker: 'aria', text: 'That line belongs in the opening paragraph, after the sample caveat.' },
    { speaker: 'ryan', text: 'I will check whether our numbers actually support that role point before we write it.' },
    { speaker: 'neerja', text: 'Fair enough. If the role data is weak, we soften the claim in the draft.' },
    { speaker: 'aria', text: 'Let me pull the department split first, and we can see where the gaps sit.' },
    { speaker: 'ryan', text: 'Once the charts are ready, we read the draft aloud to catch wording that sounds too confident.' },
    { speaker: 'neerja', text: 'That works. I would rather the report be plain and careful than polished but overstated.' },
    { speaker: 'aria', text: 'Any remaining numbers we quote should match the tracker, not the survey comments.' },
    { speaker: 'ryan', text: 'Then we each check our own section, and swap drafts on Thursday morning.' },
    { speaker: 'neerja', text: 'Good. I will open the shared document and add the heading for the methods section.' },
    { speaker: 'aria', text: 'And I will set up the chart template with the three columns we agreed on.' },
  ],
  vocabulary: [
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '样本，被调查的一组对象', en: 'the set of survey responses used to represent a wider group' },
      usage: { zh: 'sample bias、sample gap；动词 sample 指抽样。', en: 'Sample bias, sample gap; as a verb it means take samples.' },
      collocations: ['the survey sample', 'sample gap', 'the sample mirrors'],
      example: { en: 'The sample is mostly young and based in the city centre.', zh: '样本以市中心年轻人为主。' },
      listening: { zh: '双音节，/mpl/ 成音节；重音在首音节。', en: 'Two syllables; /mpl/ forms the final syllable, stress first.' },
    },
    {
      term: 'bias', phonetic: '/ˈbaɪəs/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '偏差，代表性倾斜', en: 'a tendency that makes one group over- or under-represented' },
      usage: { zh: 'sample bias、overrepresented bias；形容词 biased。', en: 'Sample bias; the adjective is biased.' },
      collocations: ['sample bias', 'identify the bias', 'the bias sits'],
      example: { en: 'The city-heavy replies create a clear sample bias.', zh: '偏城市的回复造成明显样本偏差。' },
      listening: { zh: '双音节，双元音 /aɪ/，尾音 /əs/。', en: 'Two syllables with /aɪ/ and a weak ending.' },
    },
    {
      term: 'productivity', phonetic: '/ˌprɒdʌkˈtɪvəti/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '生产率，工作产出效率', en: 'the output produced relative to the time spent' },
      usage: { zh: 'measure productivity、productivity metric；形容词 productive。', en: 'Measure productivity, productivity metric; the adjective is productive.' },
      collocations: ['measure productivity', 'productivity figure', 'remote productivity'],
      example: { en: 'We need to choose what actually measures productivity.', zh: '我们要选出真正衡量生产率的指标。' },
      listening: { zh: '五音节，重音在第四音节 /ˈtɪv/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'metric', phonetic: '/ˈmetrɪk/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '指标，衡量标准', en: 'a number used to track a part of performance' },
      usage: { zh: 'settle on a metric、main metric；形容词 metric 指度量的。', en: 'Settle on a metric, main metric; the adjective means relating to measure.' },
      collocations: ['choose a metric', 'the main metric', 'two measures'],
      example: { en: 'Completed tasks and meeting load are the chosen metrics.', zh: '完成任务量与会议负载是选定指标。' },
      listening: { zh: '双音节，重音在首音节 /ˈmet/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'stacked bar', phonetic: '/stækt bɑː/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '堆叠条形图', en: 'a bar chart whose segments sit on top of one another' },
      usage: { zh: '可视化术语；segment 指条内分段。', en: 'A charting term; each segment is a part of the bar.' },
      collocations: ['a stacked bar', 'the main stacked bar', 'label each segment'],
      example: { en: 'The main figure is a stacked bar of output and meeting hours.', zh: '主图是产出与会议时长的堆叠条形图。' },
      listening: { zh: 'stacked 读 /stækt/，两个词之间轻微连读。', en: 'stacked is /stækt/ with a light link to bar.' },
    },
    {
      term: 'abstract', phonetic: '/ˈæbstrækt/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '摘要，论文开头概述', en: 'the short opening summary of the report' },
      usage: { zh: '报告文体；作形容词 /æbˈstrækt/ 表抽象的，重音后移。', en: 'Report writing; as an adjective it is /æbˈstrækt/ with later stress.' },
      collocations: ['the abstract', 'a cautious abstract', 'the abstract tone'],
      example: { en: 'The abstract keeps a cautious tone throughout.', zh: '摘要全程保持克制语气。' },
      listening: { zh: '名词重音在前；听到后面跟 cautious 即名词用法。', en: 'Noun stress first; a following cautious signals the noun.' },
    },
    {
      term: 'hybrid', phonetic: '/ˈhaɪbrɪd/', partOfSpeech: 'adj.', sentenceIndex: 37,
      meaning: { zh: '混合式的，部分时间居家办公', en: 'splitting the week between home and office' },
      usage: { zh: 'hybrid group、hybrid respondent；另义杂交品种。', en: 'Hybrid group, hybrid respondent; it also means a cross-bred variety.' },
      collocations: ['the hybrid group', 'hybrid workers', 'hybrid schedule'],
      example: { en: 'Keep hybrid respondents in a separate column.', zh: '把混合办公受访者单列一栏。' },
      listening: { zh: '双音节，双元音 /aɪ/，尾音 /d/。', en: 'Two syllables with /aɪ/ and final /d/.' },
    },
    {
      term: 'caveat', phonetic: '/ˈkæviæt/', partOfSpeech: 'n.', sentenceIndex: 57,
      meaning: { zh: '保留说明，限制条件', en: 'a note that limits how far a finding should be read' },
      usage: { zh: '报告写作场景；常见搭配 sample caveat、with a caveat。', en: 'Report writing: sample caveat, with a caveat.' },
      collocations: ['the sample caveat', 'add a caveat', 'the opening caveat'],
      example: { en: 'The line follows the sample caveat in the opening paragraph.', zh: '这句话放在开篇样本保留说明之后。' },
      listening: { zh: '三音节，重音在首音节 /ˈkæ/。', en: 'Three syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'split by', sentenceIndex: 2,
      meaning: { zh: '按……分组拆分', en: 'to divide data according to a category' },
      usage: { zh: '后接部门、模式；split up 同义。', en: 'Follow with department or pattern; split up means the same.' },
      example: { en: 'The responses are split by department and working pattern.', zh: '回复按部门与办公模式分组。' },
    },
    {
      phrase: 'track completed tasks', sentenceIndex: 10,
      meaning: { zh: '统计已完成任务量', en: 'to record finished tasks as a performance measure' },
      usage: { zh: '后接指标对象；track 在此是记录统计。', en: 'Follow with the measure; track means record here.' },
      example: { en: 'They track completed tasks and the number of meetings each week.', zh: '他们统计每周完成任务量与会议次数。' },
    },
    {
      phrase: 'sits outside', sentenceIndex: 52,
      meaning: { zh: '不属于（本议题范围）', en: 'to fall outside the current question or scope' },
      usage: { zh: 'scope 语境；outside 为介词。', en: 'Used with scope; outside works as a preposition.' },
      example: { en: 'Home equipment sits outside our productivity question.', zh: '居家设备不属于我们的生产率议题。' },
    },
    {
      phrase: 'data is thin', sentenceIndex: 35,
      meaning: { zh: '数据薄弱、样本稀少', en: 'too few responses in a sector to support a claim' },
      usage: { zh: '研究写作；thin 在此是稀少的。', en: 'Research writing; thin means sparse here.' },
      example: { en: 'Name the sectors where the data is thin.', zh: '点出数据薄弱的行业。' },
    },
    {
      phrase: 'lead with', sentenceIndex: 54,
      meaning: { zh: '以……作为开篇重点', en: 'to place the clearest point at the opening' },
      usage: { zh: '写作与发言场景；后接 finding。', en: 'Writing and speaking; follow with the finding.' },
      example: { en: 'The final page leads with the clearest finding.', zh: '终页把最清楚的结论放在开头。' },
    },
    {
      phrase: 'sounds too confident', sentenceIndex: 61,
      meaning: { zh: '听起来过于肯定', en: 'to read as overstated or sure of itself' },
      usage: { zh: '审稿语境；反义 sound cautious。', en: 'Review usage; the opposite is sound cautious.' },
      example: { en: 'Read the draft aloud to catch wording that sounds too confident.', zh: '朗读草稿，找出过于肯定的措辞。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先把声音与议题对上', en: 'Match voices to issues before pairing' },
      body: {
        zh: '第 21–24 题按人分配观点。开场四句依次交代三人角色：Ryan 管样本、Neerja 管指标、Aria 管图表、Neerja 与 Aria 共同守措辞。听论点时先判定说话人，再在选项里找同义改写，避免把共同主张错配给单人。',
        en: 'Items 21 to 24 assign points to speakers. The opening four lines set the roles: Ryan on sample, Neerja on metrics, Aria on charts, Neerja and Aria jointly on wording. Judge the speaker first, then match the paraphrase, and do not assign a shared stance to one person.',
      },
    },
    {
      title: { zh: '被排除的指标常作干扰项', en: 'Rejected metrics make the distractors' },
      body: {
        zh: '第 26 题问最终指标，录音先讨论工时（被否）、再到中断消息（只作讨论），最后落在完成任务量与会议负载。听到 generous、reward、should not become 这类否定词时，把对应指标划掉，答案取最后达成一致的两项。',
        en: 'Item 26 asks the settled metrics. The recording first discusses hours, rejected as generous, then interruptions, kept only as discussion, before landing on completed tasks and meeting load. Mark off a metric when you hear generous, reward or should not become, and keep the two that are agreed at the end.',
      },
    },
    {
      title: { zh: '多选题区分“措辞禁忌”与“分析动作”', en: 'Separate wording cautions from analysis moves' },
      body: {
        zh: '第 28–30 题选三项措辞注意，句 31–33 给出：不称远程更优、用 mixed results、摘要克制。其余选项如剔除老员工缺口、直接公布工时，要么与主张相反，要么属于数据处理步骤。听到 conclusion、abstract、wording 这类段落标签后再判断选项归属。',
        en: 'Items 28 to 30 pick three wording cautions from sentences 31 to 33: no clear superiority, mixed results, cautious abstract. Other options, such as ignoring the older-worker gap or publishing hours raw, either reverse the stance or describe data handling. Judge an option once you hear a paragraph label such as conclusion, abstract or wording.',
      },
    },
  ],
};
