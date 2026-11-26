import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 6 · Part 3 — 通勤调查设计讨论（两人学术讨论，新西兰口音为主，一名爱尔兰口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：样本范围与分组 → 问卷长度 → 试点安排 → 激励与重复答卷 → 选题理由与样本风险
 * → 试点执行方式 → 三项偏差控制措施（多选 28–30）。配对题考“谁提出了哪条方案”。
 */
export const test06Part3: ListeningLesson = {
  slug: 'test-06-part-3',
  part: 3,
  status: 'published',
  title: { zh: '通勤调查设计', en: 'Planning a survey on commuting' },
  summary: {
    zh: '两名学生讨论校园通勤调查的样本分组、问卷长度、试点范围、激励方式与重复答卷处理，并确定选题理由、最大样本风险和三项控制偏差的措施。',
    en: 'Two students plan a commuting survey for campus: sample groups, questionnaire length, the pilot, incentives and duplicate replies, then the reason for the topic, the main sample risk, and three measures to keep bias under control.',
  },
  accent: { zh: 'Sam 为新西兰口音，Emily 为爱尔兰口音。', en: 'Sam has a New Zealand accent; Emily has an Irish accent.' },
  speechRate: '+2%',
  cast: [
    { id: 'sam', label: 'SAM', gender: 'male', voice: 'en-NZ-MitchellNeural' },
    { id: 'emily', label: 'EMILY', gender: 'female', voice: 'en-IE-EmilyNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which proposal does each person put forward? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'include commuters who travel by bicycle' },
        { key: 'B', text: 'keep the questionnaire within a fifteen-minute limit' },
        { key: 'C', text: 'run a small pilot to reveal unclear questions' },
        { key: 'D', text: 'offer the same incentive to every respondent' },
        { key: 'E', text: 'remove duplicate online responses before analysis' },
        { key: 'F', text: 'carry out interviews during the morning rush' },
      ],
      items: [
        { number: 21, text: 'Sam' },
        { number: 22, text: 'Emily' },
        { number: 23, text: 'Sam' },
        { number: 24, text: 'Emily' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Why did the group choose this topic?',
          options: [
            { key: 'A', text: 'To find out why outer-suburb residents often arrive late.' },
            { key: 'B', text: 'To count how many buses serve the campus each day.' },
            { key: 'C', text: 'To compare driving speeds on the main approach roads.' },
          ],
        },
        {
          number: 26,
          stem: 'What does Sam identify as the biggest risk with the sample?',
          options: [
            { key: 'A', text: 'Respondents who never reply to surveys.' },
            { key: 'B', text: 'Staff who work only at weekends.' },
            { key: 'C', text: 'Students who live on campus.' },
          ],
        },
        {
          number: 27,
          stem: 'How will the pilot be carried out?',
          options: [
            { key: 'A', text: 'On twenty students from different courses, after tutors check the wording.' },
            { key: 'B', text: 'By interviewing five hundred commuters at the main gate.' },
            { key: 'C', text: 'Online for one week, with a gift card for each reply.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE measures will the group take to reduce bias? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE measures will the group take to reduce bias?',
      options: [
        { key: 'A', text: 'Asking every respondent the same questions in the same order' },
        { key: 'B', text: 'Balancing replies between mornings and afternoons' },
        { key: 'C', text: 'Giving the same incentive to all respondents' },
        { key: 'D', text: 'Including only people who travel by car' },
        { key: 'E', text: 'Removing answers that look unusual' },
        { key: 'F', text: 'Repeating the survey with long-distance commuters' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 6,
      explanation: {
        zh: '定位句 6：Sam 说 I’d especially like to include commuters who travel by bicycle。他主张把骑车通勤者纳入样本，对应 A。句 5 Emily 说不要只覆盖开车的人，但没有点名骑车群体。',
        en: 'Sentence 6: Sam says he would "especially like to include commuters who travel by bicycle", matching A. In sentence 5 Emily argues against covering only drivers, but she does not name cyclists.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：Emily 说 I’d keep it to a fifteen-minute limit overall。她提出问卷总时长不超过十五分钟，对应 B。句 21 Sam 担心题目太多，只是顾虑，没有给出时长方案。',
        en: 'Sentence 22: Emily says she would "keep it to a fifteen-minute limit overall", matching B. Sam’s worry in sentence 21 is a concern, not a time proposal.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：Sam 说 A pilot will help us spot unclear questions。试点用来发现表述不清的题目，对应 C。句 24 是 Emily 提议做试点，具体作用由 Sam 这句补充。',
        en: 'Sentence 25: Sam says "a pilot will help us spot unclear questions", matching C. Emily proposes the pilot in sentence 24, but Sam adds its purpose.',
      },
    },
    {
      number: 24, accepted: ['E'], evidence: 35,
      explanation: {
        zh: '定位句 35：Emily 说 if someone submits the same answers twice, we keep only the first copy and remove the rest。重复答卷在分析前删除，对应 E。D 的统一激励是 Sam 句 32 提出的，不归 Emily。',
        en: 'Sentence 35: Emily says that if someone submits the same answers twice, "we keep only the first copy and remove the rest", matching E. The equal incentive in D is Sam’s proposal in sentence 32.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 43,
      explanation: {
        zh: '定位句 43：outer-suburb residents arrive late more often than others, and they want to understand why。选题是弄清郊区居民为何常迟到，对应 A。B 的统计公交数量在句 3 被明确排除；C 的车速比较没有出现。',
        en: 'Sentence 43: "outer-suburb residents arrive late more often than others, and they want to understand why", matching A. Counting buses in B is ruled out in sentence 3, and comparing speeds in C is never raised.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 46,
      explanation: {
        zh: '定位句 46：People who never reply to surveys. If we only hear from the keenest respondents, the picture will be skewed。最大风险是不回复的人造成样本偏差，对应 A。B 的周末员工和 C 的住校生只是样本分组，不是风险。',
        en: 'Sentence 46: "People who never reply to surveys. If we only hear from the keenest respondents, the picture will be skewed", matching A. Weekend staff in B and residents in C are sample groups, not risks.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 49,
      explanation: {
        zh: '定位句 49：We’ll hand the draft to two tutors first, to check the wording, then test it on twenty students from different courses。先请导师审措辞，再在不同课程的二十名学生中试测，对应 A。B 的五百人拦访和 C 的一周线上赠卡都与试点安排不符。',
        en: 'Sentence 49: "hand the draft to two tutors first, to check the wording, then test it on twenty students from different courses", matching A. The five hundred gate interviews in B and the one-week online card in C do not match the pilot plan.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 54,
      explanation: {
        zh: '定位句 54：we’ll ask every respondent the same questions in the same order。统一题目与顺序是第一项措施，对应 A。句 51 区分开放与封闭问题，那是题型安排，不是偏差控制。',
        en: 'Sentence 54: "we’ll ask every respondent the same questions in the same order", matching A. The open and closed question split in sentence 51 is question design, not a bias measure.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 55,
      explanation: {
        zh: '定位句 55：we’ll balance replies between mornings and afternoons。平衡早晚回复是第二项措施，对应 B。句 37 否定了只在早高峰收集，方向相反。',
        en: 'Sentence 55: "we’ll balance replies between mornings and afternoons", matching B. Collecting only in the morning rush, rejected in sentence 37, is the opposite approach.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 56,
      explanation: {
        zh: '定位句 56：the incentive will be the same for everyone, regardless of how far they travel。所有人激励相同是第三项措施，对应 C。D 只纳入开车者和 E 删除异常答卷都在句 60 被明确否定；F 没有提到。',
        en: 'Sentence 56: "the incentive will be the same for everyone, regardless of how far they travel", matching C. D, including only drivers, and E, deleting unusual answers, are rejected in sentence 60, and F is never mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'sam', text: 'Hi Emily, shall we get started on the commuting survey? The tutor wants our plan by Friday.' },
    { speaker: 'emily', text: 'Yes, I’ve read the brief again. We have to look at how people on this campus get to work or study each day.' },
    { speaker: 'sam', text: 'Right, the transport office says that some people living in the outer suburbs have trouble reaching campus on time.' },
    { speaker: 'emily', text: 'That’s the problem we’re trying to measure, not just count how many buses there are.' },
    { speaker: 'sam', text: 'So who should we include in the sample?' },
    { speaker: 'emily', text: 'I think we should cover all the main ways of travelling, not just people who drive.' },
    { speaker: 'sam', text: 'I agree, and I’d especially like to include commuters who travel by bicycle, because their routes are rarely studied.' },
    { speaker: 'emily', text: 'That makes sense. What about people who walk, or who work from home some days?' },
    { speaker: 'sam', text: 'Home workers still have to come in sometimes, so they belong in the sample too, as long as they visit campus at least once a week.' },
    { speaker: 'emily', text: 'Should we include staff as well as students?' },
    { speaker: 'sam', text: 'Yes, the brief covers both groups, because their journeys can be very different.' },
    { speaker: 'emily', text: 'I’ll split the sample into four groups, which are students on campus, suburban students, staff who drive, and staff who use public transport.' },
    { speaker: 'sam', text: 'That way we can compare each group instead of lumping everyone together.' },
    { speaker: 'sam', text: 'How many people do we need to reach in total?' },
    { speaker: 'emily', text: 'The tutor said two hundred replies would give us enough data to compare the four groups.' },
    { speaker: 'sam', text: 'Then we should invite closer to five hundred, because plenty of people won’t reply.' },
    { speaker: 'emily', text: 'Agreed. We’ll send the link by email and post it on the student notice board as well.' },
    { speaker: 'sam', text: 'Will the survey be anonymous?' },
    { speaker: 'emily', text: 'Yes, no names are recorded, and the answers go straight into a spreadsheet that only we can open.' },
    { speaker: 'sam', text: 'Good, that should make people more honest about delays and complaints.' },
    { speaker: 'emily', text: 'Good. Now the questionnaire itself. How long should it be?' },
    { speaker: 'sam', text: 'I worry about asking too many questions. Most people drop off after ten minutes.' },
    { speaker: 'emily', text: 'I’d keep it to a fifteen-minute limit overall, and no more than twenty questions, so the completion rate stays high.' },
    { speaker: 'sam', text: 'Fifteen minutes, that sounds reasonable. We can put the easiest questions first.' },
    { speaker: 'emily', text: 'Before we send it to everyone, I suggest we run a small pilot with about twenty students.' },
    { speaker: 'sam', text: 'A pilot will help us spot unclear questions, and we can rewrite anything that confuses people.' },
    { speaker: 'emily', text: 'Exactly. We’ll ask the pilot group to note any question they found hard to understand.' },
    { speaker: 'sam', text: 'Will the pilot also tell us which questions people skip?' },
    { speaker: 'emily', text: 'Yes, we’ll record how far each person gets, and any question most people leave blank needs rewriting.' },
    { speaker: 'emily', text: 'We should also ask whether people commute at weekends, because some staff work Saturdays.' },
    { speaker: 'sam', text: 'What about incentives? Should we offer something to encourage replies?' },
    { speaker: 'emily', text: 'A small gift card might help, but we must be careful that it doesn’t bias who responds.' },
    { speaker: 'sam', text: 'I’d offer the same incentive to everyone who completes the survey, rather than extra money for one group.' },
    { speaker: 'emily', text: 'That’s fair. We shouldn’t make it worth more to people with long journeys, or the results will tilt toward them.' },
    { speaker: 'sam', text: 'And online responses, we should check for duplicates before we analyse anything.' },
    { speaker: 'emily', text: 'Yes, if someone submits the same answers twice, we keep only the first copy and remove the rest.' },
    { speaker: 'sam', text: 'There’s also the timing issue. Should we collect answers only in the morning rush?' },
    { speaker: 'emily', text: 'No, that would bias the sample toward people who commute early. We should leave the survey open for a full week.' },
    { speaker: 'emily', text: 'We should also ask about the weather, because wet days change how people choose to travel.' },
    { speaker: 'sam', text: 'Good point. We’ll note the day’s weather alongside each reply.' },
    { speaker: 'sam', text: 'Should we hold any face-to-face interviews, or keep it all online?' },
    { speaker: 'emily', text: 'Online for the main sample. Interviews would take too long, and we can follow up by email if a reply looks unclear.' },
    { speaker: 'sam', text: 'Fine. Now, why did we choose this topic again?' },
    { speaker: 'emily', text: 'The transport office noticed that outer-suburb residents arrive late more often than others, and they want to understand why.' },
    { speaker: 'sam', text: 'Right, it’s not about blaming drivers, it’s about finding where the journey breaks down.' },
    { speaker: 'emily', text: 'What’s the biggest risk with our sample, in your view?' },
    { speaker: 'sam', text: 'People who never reply to surveys. If we only hear from the keenest respondents, the picture will be skewed.' },
    { speaker: 'emily', text: 'So we need to report how many people actually answered, compared with the number we contacted.' },
    { speaker: 'sam', text: 'Exactly. And how will we run the pilot?' },
    { speaker: 'emily', text: 'We’ll hand the draft to two tutors first, to check the wording, then test it on twenty students from different courses.' },
    { speaker: 'sam', text: 'Good. What about the questions themselves? Should they be mostly yes or no?' },
    { speaker: 'emily', text: 'A few closed questions are fine for the statistics, but we need open questions too, so people can explain their own situation.' },
    { speaker: 'sam', text: 'I’ll draft the closed questions, and you can add the open ones after the pilot.' },
    { speaker: 'emily', text: 'Deal. Now, what measures will we take to keep the results unbiased?' },
    { speaker: 'sam', text: 'First, we’ll ask every respondent the same questions in the same order.' },
    { speaker: 'emily', text: 'Second, we’ll balance replies between mornings and afternoons, so one time of day doesn’t dominate.' },
    { speaker: 'sam', text: 'Third, the incentive will be the same for everyone, regardless of how far they travel.' },
    { speaker: 'emily', text: 'The wording should stay neutral, so no question pushes an answer.' },
    { speaker: 'sam', text: 'I’ll read my draft with that in mind, and mark anything that sounds leading.' },
    { speaker: 'emily', text: 'The main figures will go in a simple table.' },
    { speaker: 'emily', text: 'We mustn’t include only people who drive, and we won’t delete answers just because they look unusual.' },
    { speaker: 'sam', text: 'We’ll report the response rate honestly in the final write-up.' },
    { speaker: 'emily', text: 'That covers the main points. Shall I draft the questionnaire, and you do the sampling plan?' },
    { speaker: 'sam', text: 'Good deal. I’ll send you the sampling notes by Thursday evening.' },
  ],
  vocabulary: [
    {
      term: 'brief', phonetic: '/briːf/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '任务说明，课题要求', en: 'a short document or set of instructions for a task' },
      usage: { zh: '可数名词；read the brief、follow the brief。作形容词意为“简短的”。', en: 'Countable: read the brief, follow the brief. As an adjective it means short.' },
      collocations: ['read the brief', 'the project brief', 'a clear brief'],
      example: { en: 'The tutor sent a brief describing the survey aims.', zh: '导师发来一份说明调查目的的任务要求。' },
      listening: { zh: '与 beef（牛肉）押韵，长元音 /iː/。', en: 'Rhymes with beef, with a long /iː/.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '样本（被调查或研究的一组人）', en: 'the group of people chosen to take part in a study' },
      usage: { zh: '可数名词；random sample、sample size。研究方法讲座高频词。', en: 'Countable: random sample, sample size. Common in research methods.' },
      collocations: ['the sample', 'a random sample', 'sample groups'],
      example: { en: 'Our sample included staff from three departments.', zh: '我们的样本包括三个部门的员工。' },
      listening: { zh: '重音在第一音节，结尾 /mpl/ 不要漏听。', en: 'Stress the first syllable and listen for the final /mpl/.' },
    },
    {
      term: 'anonymous', phonetic: '/əˈnɒnɪməs/', partOfSpeech: 'adj.', sentenceIndex: 17,
      meaning: { zh: '匿名的', en: 'with the person’s name kept unknown' },
      usage: { zh: 'be anonymous；名词 anonymity。问卷与伦理讨论的高频词。', en: 'be anonymous; the noun is anonymity. Frequent in surveys and ethics.' },
      collocations: ['an anonymous survey', 'remain anonymous', 'anonymous replies'],
      example: { en: 'Replies to the questionnaire are anonymous.', zh: '问卷回复是匿名的。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈnɒn/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'completion', phonetic: '/kəmˈpliːʃn/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '完成（率）', en: 'the act of finishing something; how many people finish a survey' },
      usage: { zh: '不可数；completion rate 是问卷完成率。动词 complete。', en: 'Uncountable; completion rate is the share who finish. The verb is complete.' },
      collocations: ['the completion rate', 'survey completion', 'on completion'],
      example: { en: 'A long form lowers the completion rate.', zh: '表单太长会降低完成率。' },
      listening: { zh: '重音在第二音节 /ˈpliː/，前面 /kəm/ 弱读。', en: 'Stress the second syllable; the opening /kəm/ is weak.' },
    },
    {
      term: 'pilot', phonetic: '/ˈpaɪlət/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '试点，小规模预调查', en: 'a small-scale test of a survey before the main study' },
      usage: { zh: '名词：run a pilot、a pilot study；也可作动词。', en: 'Noun: run a pilot, a pilot study; it can also be a verb.' },
      collocations: ['a small pilot', 'run a pilot', 'a pilot survey'],
      example: { en: 'We tested the questions in a pilot last week.', zh: '我们上周用一次试点检验了题目。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /ət/ 很轻。', en: 'Three syllables, stress on the first, with a soft final /ət/.' },
    },
    {
      term: 'incentive', phonetic: '/ɪnˈsentɪv/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '激励，报酬（鼓励参与的小奖励）', en: 'a reward offered to encourage people to take part' },
      usage: { zh: '可数名词；offer an incentive、a financial incentive。', en: 'Countable: offer an incentive, a financial incentive.' },
      collocations: ['an incentive to reply', 'offer an incentive', 'the same incentive'],
      example: { en: 'A small voucher was used as an incentive to reply.', zh: '一张小额代金券作为回复激励。' },
      listening: { zh: '重音在第二音节 /ˈsen/，开头 /ɪn/ 不要漏。', en: 'Stress the second syllable; do not miss the opening /ɪn/.' },
    },
    {
      term: 'bias', phonetic: '/ˈbaɪəs/', partOfSpeech: 'v.', sentenceIndex: 31,
      meaning: { zh: '使有偏向，造成偏差', en: 'to make a sample or result lean toward one group' },
      usage: { zh: '动词 bias somebody toward；名词 bias；形容词 biased。反义 unbiased。', en: 'Verb: bias somebody toward; the noun is bias, the adjective biased; the opposite is unbiased.' },
      collocations: ['bias the sample', 'bias who responds', 'a biased result'],
      example: { en: 'A reward for long journeys may bias the replies.', zh: '给长途通勤者奖励可能让回复有偏。' },
      listening: { zh: '读 /ˈbaɪəs/，两个元音连在一起，不要加额外音节。', en: 'Pronounced /ˈbaɪəs/ with two vowels linked; do not add a syllable.' },
    },
    {
      term: 'skewed', phonetic: '/skjuːd/', partOfSpeech: 'adj.', sentenceIndex: 46,
      meaning: { zh: '被扭曲的，有偏的', en: 'pulled away from a fair or balanced picture' },
      usage: { zh: 'picture is skewed、skewed toward one group；动词 skew。', en: 'the picture is skewed, skewed toward one group; the verb is skew.' },
      collocations: ['a skewed picture', 'skewed results', 'heavily skewed'],
      example: { en: 'Without non-repliers, the data will be skewed.', zh: '漏掉不回复的人，数据就会有偏。' },
      listening: { zh: '开头 /skj/ 连读，结尾 /d/ 很轻。', en: 'Link the opening /skj/; the final /d/ is soft.' },
    },
  ],
  expressions: [
    {
      phrase: 'get started on', sentenceIndex: 0,
      meaning: { zh: '开始做（某事）', en: 'to begin working on something' },
      usage: { zh: 'get started on something；比 start 更口语，常见于约时间开工。', en: 'get started on something; more colloquial than start, used when agreeing to begin.' },
      example: { en: 'Let’s get started on the plan after lunch.', zh: '我们午饭后开始做方案。' },
    },
    {
      phrase: 'drop off', sentenceIndex: 21,
      meaning: { zh: '中途放弃，退出（问卷）', en: 'to stop continuing something before the end' },
      usage: { zh: '不及物；在问卷语境指受访者做到一半退出。', en: 'Intransitive; in surveys it means leaving halfway through.' },
      example: { en: 'Most readers drop off after the first page.', zh: '多数读者看完第一页就退出了。' },
    },
    {
      phrase: 'spot unclear questions', sentenceIndex: 25,
      meaning: { zh: '发现表述不清的题目', en: 'to notice questions that are hard to understand' },
      usage: { zh: 'spot 表示“认出、发现”；spot a problem、spot an error。', en: 'spot means to notice: spot a problem, spot an error.' },
      example: { en: 'The pilot helped us spot two confusing questions.', zh: '试点帮我们发现了两道表述不清的题。' },
    },
    {
      phrase: 'follow up', sentenceIndex: 41,
      meaning: { zh: '跟进，后续联系', en: 'to contact somebody again about an earlier reply' },
      usage: { zh: 'follow up on something；可分短语动词，代词放中间：follow it up。', en: 'follow up on something; separable: follow it up.' },
      example: { en: 'We may follow up by email if the answer looks unclear.', zh: '如果回答不清楚，我们可能邮件跟进。' },
    },
    {
      phrase: 'breaks down', sentenceIndex: 44,
      meaning: { zh: '出问题，中断（行程环节）', en: 'to fail or stop working at a particular stage' },
      usage: { zh: '此处指通勤链条某一环节断裂；另义是机器故障、数据分解。', en: 'Here a stage of the journey fails; it also means a machine breaks down or data is split.' },
      example: { en: 'The journey breaks down when the last bus is missed.', zh: '错过末班车，这趟行程就断了。' },
    },
    {
      phrase: 'in your view', sentenceIndex: 45,
      meaning: { zh: '在你看来', en: 'in your opinion' },
      usage: { zh: '征询观点的礼貌说法；同义 in your opinion、from your point of view。', en: 'A polite way to ask for an opinion; compare in your opinion.' },
      example: { en: 'What is the main weakness, in your view?', zh: '你认为主要弱点是什么？' },
    },
  ],
  tips: [
    {
      title: { zh: '配对先记说话人', en: 'Match the voice first' },
      body: {
        zh: '配对题问“谁提出哪条方案”。开头先把 Sam 和 Emily 的声音对上，每条意见先记说话人，再记方案内容，避免把两人的提议混在一行。',
        en: 'Matching asks who proposed what. Match the two voices at the start, note the speaker for each point before the proposal, and do not mix their ideas on one line.',
      },
    },
    {
      title: { zh: '被否定的方案直接排除', en: 'Rejected proposals are out' },
      body: {
        zh: 'No、that would bias、we mustn’t 之后紧跟的方案通常被否决，例如只在早高峰收集、只纳入开车者。听到否定词就把对应选项划掉，不要留到多选题里犹豫。',
        en: 'A proposal after No, that would bias or we mustn’t is usually rejected, such as morning-rush-only collection or drivers only. Cross the option out when you hear the negation.',
      },
    },
    {
      title: { zh: '多选题辨语气强弱', en: 'Read the strength in multiple choice' },
      body: {
        zh: '多选题的正确项往往是 First、Second、Third 列出的正式措施；抱怨、顾虑和被否决的替代方案是干扰项。听到序数词时集中记录。',
        en: 'Correct multiple-choice items are usually the formal measures listed with First, Second and Third; worries and rejected alternatives are distractors. Concentrate when you hear the ordinal words.',
      },
    },
  ],
};
