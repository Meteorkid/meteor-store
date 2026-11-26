import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 10 · Part 3 — 咖啡因与反应时实验报告（两名学生讨论）。原创仿真材料，非官方真题。
 *
 * 分工回忆在前半段（配对 21–24），对照设置、样本限制与误差来源在中段（单选 25–27），
 * 报告保障措施在后半段（多选 28–30）。题块顺序与录音顺序一致。
 */
export const test10Part3: ListeningLesson = {
  slug: 'test-10-part-3',
  part: 3,
  status: 'published',
  title: { zh: '咖啡因与反应时实验报告', en: 'Lab report on caffeine and reaction time' },
  summary: {
    zh: '两名学生在辅导前复盘咖啡因反应时实验：各自承担的招募、备料、记录与核对工作，对照条件如何设置，样本量受限的原因，需要讨论的误差来源，以及写进报告的三项保障措施。',
    en: 'Two students review their caffeine reaction-time experiment before the tutorial: who recruited participants, prepared drinks, recorded times and checked the data, how the control condition was set up, why the sample was limited, the error source to discuss, and the three safeguards that go into the report.',
  },
  accent: { zh: 'Clara 为加拿大口音，Andrew 为美式口音。', en: 'Clara speaks with a Canadian accent and Andrew with an American accent.' },
  speechRate: '+5%',
  cast: [
    { id: 'clara', label: 'CLARA', gender: 'female', voice: 'en-CA-ClaraNeural' },
    { id: 'andrew', label: 'ANDREW', gender: 'male', voice: 'en-US-AndrewNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which job did each person take on? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'designed the reaction-time task' },
        { key: 'B', text: 'recruited the participants' },
        { key: 'C', text: 'recorded the reaction times' },
        { key: 'D', text: 'prepared the caffeine drinks' },
        { key: 'E', text: 'checked the data for errors' },
        { key: 'F', text: 'wrote the introduction' },
      ],
      items: [
        { number: 21, text: 'Clara' },
        { number: 22, text: 'Andrew' },
        { number: 23, text: 'Clara' },
        { number: 24, text: 'Andrew' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What was the control condition?',
          options: [
            { key: 'A', text: 'participants drank plain water' },
            { key: 'B', text: 'participants skipped breakfast' },
            { key: 'C', text: 'participants took a placebo pill' },
          ],
        },
        {
          number: 26,
          stem: 'Why was the sample size limited?',
          options: [
            { key: 'A', text: 'the lab equipment was fully booked' },
            { key: 'B', text: 'the course required only a small group' },
            { key: 'C', text: 'participants had to be non-coffee drinkers' },
          ],
        },
        {
          number: 27,
          stem: 'What is the main source of error they discuss?',
          options: [
            { key: 'A', text: 'variation in drink temperature' },
            { key: 'B', text: 'participants guessing the condition' },
            { key: 'C', text: 'the timing device drifting' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE safeguards are described in the report? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE safeguards are described in the report?',
      options: [
        { key: 'A', text: 'blind recording of the results' },
        { key: 'B', text: 'fixed order of the tasks' },
        { key: 'C', text: 'random assignment to conditions' },
        { key: 'D', text: 'payment to each participant' },
        { key: 'E', text: 'repeated measurements per person' },
        { key: 'F', text: 'signed ethical consent forms' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['B'], evidence: 2,
      explanation: {
        zh: '定位句 2：I recruited the participants, because I already knew who could take part。Clara 负责招募参与者，对应 B。',
        en: 'Sentence 2: "I recruited the participants, because I already knew who could take part". Clara recruited participants, matching B.',
      },
    },
    {
      number: 22, accepted: ['D'], evidence: 3,
      explanation: {
        zh: '定位句 3：I prepared the caffeine drinks in the lab, measuring the powder into each cup。Andrew 配制含咖啡因饮品，对应 D。',
        en: 'Sentence 3: "I prepared the caffeine drinks in the lab, measuring the powder into each cup". Andrew prepared the drinks, matching D.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 4,
      explanation: {
        zh: '定位句 4：I recorded the reaction times on the computer, and wrote each one down。Clara 在电脑上记录反应时，对应 C。',
        en: 'Sentence 4: "I recorded the reaction times on the computer, and wrote each one down". Clara recorded the times, matching C.',
      },
    },
    {
      number: 24, accepted: ['E'], evidence: 5,
      explanation: {
        zh: '定位句 5：Then I checked the data for errors, after the last participant had left。Andrew 在结束后核对数据找错，对应 E。A 的任务设计来自导师手册，F 的引言两人都还没写。',
        en: 'Sentence 5: "Then I checked the data for errors, after the last participant had left". Andrew checked the data, matching E. The task design came from the tutor’s handbook, and neither drafted the introduction.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 13,
      explanation: {
        zh: '定位句 13：In the control condition, everyone drank plain water at room temperature。对照组喝白开水，对应 A。安慰剂片在句 14 被说没有准备，早餐在句 55 是保持正常，不是跳过。',
        en: 'Sentence 13: "In the control condition, everyone drank plain water at room temperature". The control drank plain water, matching A. The placebo pill was unavailable in sentence 14, and breakfast was kept normal in sentence 55.',
      },
    },
    {
      number: 26, accepted: ['C'], evidence: 16,
      explanation: {
        zh: '定位句 16：We needed participants who were not regular coffee drinkers, and that ruled out most people on the course。样本受限是因为只能选不常喝咖啡的人。句 17 明确说设备整周空闲，排除 A；课程要求小团体没有提到。',
        en: 'Sentence 16: "We needed participants who were not regular coffee drinkers, and that ruled out most people on the course". The limit was the non-coffee-drinker requirement. Sentence 17 states the equipment was free all week, ruling out A, and a small course requirement is never mentioned.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：One risk is that participants guessed which condition they were in, from the taste of the drink。主要误差是参与者从味道猜出分组，对应 B。温度在句 23 两组保持一致，设备漂移在句 24 被排除。',
        en: 'Sentence 21: "One risk is that participants guessed which condition they were in, from the taste of the drink". The main error is participants guessing the condition, matching B. Drink temperature was held equal in sentence 23, and device drift was ruled out in sentence 24.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：the person recording the results did not know which condition each participant was in, so the scoring stayed blind。记录者不知分组，评分保持盲态，对应 A。',
        en: 'Sentence 27: "the person recording the results did not know which condition each participant was in, so the scoring stayed blind". Blind recording matches A.',
      },
    },
    {
      number: 29, accepted: ['C'], evidence: 28,
      explanation: {
        zh: '定位句 28：We also assigned people to conditions at random, rather than putting friends in the same group。参与者被随机分配到两组，对应 C。',
        en: 'Sentence 28: "We also assigned people to conditions at random, rather than putting friends in the same group". Random assignment matches C.',
      },
    },
    {
      number: 30, accepted: ['F'], evidence: 29,
      explanation: {
        zh: '定位句 29：Every participant signed an ethical consent form before the task, and that goes in the appendix。签署伦理知情同意书是第三项保障，对应 F。任务固定顺序是设计选择（句 33），没有现金报酬（句 32），也没有重复测量（句 31）。',
        en: 'Sentence 29: "Every participant signed an ethical consent form before the task, and that goes in the appendix". Signed consent forms match F. The fixed task order was a design choice, there was no cash payment, and there were no repeated measurements.',
      },
    },
  ],
  transcript: [
    { speaker: 'clara', text: 'Hi Andrew. Shall we go through our caffeine reaction-time report before the tutorial?' },
    { speaker: 'andrew', text: 'Sure. Let’s recall who did what, so the acknowledgements are correct.' },
    { speaker: 'clara', text: 'I recruited the participants, as I knew who could take part.' },
    { speaker: 'andrew', text: 'I prepared the caffeine drinks in the lab, measuring each cup.' },
    { speaker: 'clara', text: 'I recorded the reaction times on the computer and wrote each one down.' },
    { speaker: 'andrew', text: 'Then I checked the data for errors, after the last participant had left.' },
    { speaker: 'andrew', text: 'I cross-checked the records against the notes and fixed two entries.' },
    { speaker: 'clara', text: 'What about the task design? Who set up the reaction-time task?' },
    { speaker: 'andrew', text: 'That was the tutor’s handbook design, so none of us gets credit.' },
    { speaker: 'clara', text: 'And the introduction? Neither of us has drafted it yet.' },
    { speaker: 'andrew', text: 'So our four jobs are recruitment, drinks, recording and checking.' },
    { speaker: 'clara', text: 'Now the design itself. We should explain the control condition clearly in the method section.' },
    { speaker: 'andrew', text: 'In the caffeine condition, participants had a coffee with a standard amount of caffeine.' },
    { speaker: 'clara', text: 'In the control condition, everyone drank plain water at room temperature, so nothing else changed.' },
    { speaker: 'andrew', text: 'We did not use a placebo pill; our lab did not have one ready.' },
    { speaker: 'clara', text: 'Right. The sample ended up smaller than I first thought. Why was that?' },
    { speaker: 'andrew', text: 'We needed participants who were not regular coffee drinkers, and that ruled out most people on the course.' },
    { speaker: 'clara', text: 'The equipment was free all week. The restriction was the participant group.' },
    { speaker: 'andrew', text: 'How many did we get in the end? Fourteen in total, seven in each condition.' },
    { speaker: 'clara', text: 'Fourteen. The tutor may ask if that is enough, so we note the limit.' },
    { speaker: 'andrew', text: 'Now the possible sources of error. Let’s list them before we write the discussion.' },
    { speaker: 'clara', text: 'One risk is that participants guessed which condition they were in, from the taste of the drink.' },
    { speaker: 'andrew', text: 'Knowing they had caffeine could speed reactions independently of the drug.' },
    { speaker: 'clara', text: 'Drink temperature was held the same, so that is not an error source.' },
    { speaker: 'andrew', text: 'The timing device was calibrated, with no drift during the morning.' },
    { speaker: 'clara', text: 'So the main error we should discuss is participants working out their condition from the taste.' },
    { speaker: 'andrew', text: 'Good. What safeguards did we put in place to keep the report reliable?' },
    { speaker: 'clara', text: 'The recorder did not know each participant’s condition, so scoring stayed blind.' },
    { speaker: 'andrew', text: 'We also assigned people to conditions at random, rather than putting friends in the same group.' },
    { speaker: 'clara', text: 'Every participant signed an ethical consent form before the task, and that goes in the appendix.' },
    { speaker: 'andrew', text: 'Did we repeat the measurements on each person?' },
    { speaker: 'clara', text: 'No, each person did it once, so an off-day response could not be averaged out.' },
    { speaker: 'andrew', text: 'They got a snack after the session, but no cash payment.' },
    { speaker: 'clara', text: 'The fixed task order was a design choice, not a safeguard against bias.' },
    { speaker: 'andrew', text: 'So the three safeguards for the report are blind recording, random assignment and consent forms.' },
    { speaker: 'clara', text: 'Now let’s think about how to present the results.' },
    { speaker: 'andrew', text: 'Reaction times work best as two bar charts, one per condition, showing the average.' },
    { speaker: 'clara', text: 'Show the spread of scores, not just the mean.' },
    { speaker: 'andrew', text: 'A table would be hard to read, so the charts are the better choice.' },
    { speaker: 'clara', text: 'I’ll draft the method section tonight, and you can check the results table tomorrow.' },
    { speaker: 'andrew', text: 'Fair enough. I’ll write up the error discussion, since that was the part we discussed longest.' },
    { speaker: 'clara', text: 'We should also acknowledge the small sample as a limitation, rather than claiming a firm conclusion.' },
    { speaker: 'andrew', text: 'Right. The tutor wants the draft by Friday, so let’s share the folder before Thursday evening.' },
    { speaker: 'clara', text: 'One more check. Did we keep the participant names separate from the raw scores?' },
    { speaker: 'andrew', text: 'Yes, the names are on a consent list, and the scores are coded by number.' },
    { speaker: 'clara', text: 'Good. That means we can remove the names before any copy leaves the lab.' },
    { speaker: 'andrew', text: 'I’ll add that note to the ethics paragraph, so it’s clear how the data were stored.' },
    { speaker: 'clara', text: 'Andrew, can you confirm the drink amounts match the handbook table?' },
    { speaker: 'andrew', text: 'I’ll check tonight and send the numbers, adjusting the method if anything differs.' },
    { speaker: 'clara', text: 'Perfect. The structure is sound, with method, results, discussion and limitations in that order.' },
    { speaker: 'andrew', text: 'Let’s meet after the Wednesday lecture to put the charts into the shared document.' },
    { speaker: 'clara', text: 'Sounds good. I’ll bring my notes on the error sources, and you can bring the coded scores.' },
    { speaker: 'andrew', text: 'Before we finish, should we mention the caffeine dose in the method?' },
    { speaker: 'clara', text: 'The handbook says one standard cup; we should write that amount, not just coffee.' },
    { speaker: 'andrew', text: 'Did anyone skip breakfast before the session?' },
    { speaker: 'clara', text: 'We asked everyone to eat normally, so that variable was held constant too.' },
    { speaker: 'andrew', text: 'Good. That rules out breakfast as an explanation for the slower reactions.' },
    { speaker: 'clara', text: 'I’ll note that in the method, beside the water control condition.' },
    { speaker: 'andrew', text: 'The task was pressing a key as soon as a dot appeared on screen.' },
    { speaker: 'clara', text: 'We should describe that task in one sentence, so the tutor knows what was being measured.' },
    { speaker: 'andrew', text: 'Right. Reaction time in milliseconds, from the dot appearing to the key press.' },
    { speaker: 'clara', text: 'I’ll make sure the units are stated clearly under each chart.' },
    { speaker: 'andrew', text: 'Let’s send the draft once the charts are in, and leave comments open.' },
    { speaker: 'clara', text: 'Agreed. I’ll tidy the references after you send the results section.' },
    { speaker: 'andrew', text: 'Fine. See you after the Wednesday lecture, then.' },
  ],
  vocabulary: [
    {
      term: 'participants', phonetic: '/pɑːˈtɪsɪpənts/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '参与者，受试者', en: 'people who take part in a study or experiment' },
      usage: { zh: '常用复数；recruit participants、regular participants。单数 participant。', en: 'Usually plural: recruit participants, regular participants; the singular is participant.' },
      collocations: ['recruit the participants', 'the control group participants', 'participants signed'],
      example: { en: 'Participants were asked not to drink coffee before the test.', zh: '受试者被要求测试前不要喝咖啡。' },
      listening: { zh: '重音在第二音节 /ˈtɪs/，结尾 /pənts/ 轻读。', en: 'Stress the second syllable; the ending /pənts/ is weak.' },
    },
    {
      term: 'condition', phonetic: '/kənˈdɪʃn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '实验组，分组条件', en: 'a group or treatment that participants are assigned to in an experiment' },
      usage: { zh: '实验高频词；control condition、caffeine condition、random assignment to conditions。', en: 'Common in experiments: the control condition, the caffeine condition, assignment to conditions.' },
      collocations: ['the control condition', 'the caffeine condition', 'each condition'],
      example: { en: 'Half the participants were placed in the control condition.', zh: '一半受试者被分入对照组。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈdɪʃ/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'placebo', phonetic: '/pləˈsiːbəʊ/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '安慰剂（外观相同但无有效成分）', en: 'an inactive treatment that looks identical to the real one' },
      usage: { zh: '可数；placebo pill、placebo group。对照实验常用来排除心理预期。', en: 'Countable: a placebo pill, a placebo group. It rules out expectation effects in trials.' },
      collocations: ['a placebo pill', 'the placebo group', 'a placebo control'],
      example: { en: 'The placebo group received a plain sugar pill.', zh: '安慰剂组拿到的是普通糖片。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈsiː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'sample', phonetic: '/ˈsɑːmpl/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '样本（参与实验的人群）', en: 'the group of people selected for the study' },
      usage: { zh: '可数；sample size、small sample、representative sample。动词 sample 是抽样。', en: 'Countable: sample size, a small sample, a representative sample. The verb means to sample.' },
      collocations: ['the sample size', 'a small sample', 'the sample was limited'],
      example: { en: 'The small sample limits what the results can show.', zh: '小样本限制了结论的适用范围。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈsɑː/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'error', phonetic: '/ˈerə/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '误差，误差来源', en: 'a source of deviation between the result and the true value' },
      usage: { zh: '可数；source of error、random error、measurement error。', en: 'Countable: a source of error, random error, measurement error.' },
      collocations: ['a source of error', 'the main error', 'sources of error'],
      example: { en: 'Expectation can be a source of reaction-time error.', zh: '预期心理可能成为反应时误差的来源。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈer/，结尾 /ə/。', en: 'Two syllables with first-syllable stress; the ending is /ə/.' },
    },
    {
      term: 'consent', phonetic: '/kənˈsent/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '知情同意（伦理流程）', en: 'agreement given after being told what the study involves' },
      usage: { zh: '不可数；consent form、ethical consent、sign consent。动词 consent。', en: 'Uncountable: a consent form, ethical consent, sign consent. The verb is consent.' },
      collocations: ['a consent form', 'ethical consent', 'sign a consent form'],
      example: { en: 'Each participant signed the consent form before the task.', zh: '每位受试者在任务前签署了知情同意书。' },
      listening: { zh: '名词重音在第二音节 /ˈsent/，与动词同形，靠位置判断。', en: 'Noun stress is the second syllable; the form matches the verb, so use the grammar.' },
    },
    {
      term: 'blind', phonetic: '/blaɪnd/', partOfSpeech: 'adj.', sentenceIndex: 27,
      meaning: { zh: '盲法的（记录者不知分组）', en: 'not knowing which condition a participant belongs to' },
      usage: { zh: '实验术语；blind recording、single blind、stay blind。', en: 'An experiment term: blind recording, single blind, stay blind.' },
      collocations: ['stay blind', 'blind recording', 'the scoring stayed blind'],
      example: { en: 'The scorer stayed blind to the condition labels.', zh: '评分者对分组标签保持盲态。' },
      listening: { zh: '单音节，元音 /aɪ/，结尾 /nd/ 不要漏。', en: 'One syllable with /aɪ/; do not drop the final /nd/.' },
    },
    {
      term: 'coded', phonetic: '/ˈkəʊdɪd/', partOfSpeech: 'adj.', sentenceIndex: 44,
      meaning: { zh: '编码的（用编号代替姓名）', en: 'replaced with a number so names stay private' },
      usage: { zh: 'code 加 d；coded scores、coded by number。数据匿名化常见做法。', en: 'Code plus d: coded scores, coded by number. A common anonymisation step.' },
      collocations: ['coded by number', 'coded scores', 'coded data'],
      example: { en: 'The scores are coded by number to protect the names.', zh: '分数用编号记录以保护姓名。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkəʊ/。', en: 'Two syllables with first-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'take part', sentenceIndex: 2,
      meaning: { zh: '参加（实验）', en: 'to join an activity such as a study' },
      usage: { zh: '及物短语动词；take part in the experiment、take part in the survey。', en: 'Transitive: take part in the experiment, take part in the survey.' },
      example: { en: 'Twelve students agreed to take part in the trial.', zh: '十二名学生同意参加试验。' },
    },
    {
      phrase: 'plain water', sentenceIndex: 13,
      meaning: { zh: '白开水，无添加的水', en: 'water with no coffee, sugar or other flavour added' },
      usage: { zh: 'plain 在此表示“无添加的”；plain water、plain yoghurt 同类。', en: 'Plain means with nothing added: plain water, plain yoghurt.' },
      example: { en: 'The control group drank plain water at room temperature.', zh: '对照组在室温下喝白开水。' },
    },
    {
      phrase: 'ruled out', sentenceIndex: 16,
      meaning: { zh: '排除（可能性或人选）', en: 'to remove something as a possible explanation or candidate' },
      usage: { zh: '过去式 ruled out；rule out a cause、rule out most applicants。', en: 'Past tense ruled out: rule out a cause, rule out most applicants.' },
      example: { en: 'The sample size ruled out most first-year students.', zh: '样本要求排除了大多数一年级学生。' },
    },
    {
      phrase: 'sources of error', sentenceIndex: 20,
      meaning: { zh: '误差来源', en: 'possible reasons the measurements might deviate' },
      usage: { zh: '复数；list the sources of error、a source of error。', en: 'Plural: list the sources of error, a source of error.' },
      example: { en: 'The discussion lists the main sources of error first.', zh: '讨论部分先列出主要误差来源。' },
    },
    {
      phrase: 'stayed blind', sentenceIndex: 27,
      meaning: { zh: '保持盲态，不知分组', en: 'kept unaware of which condition was which' },
      usage: { zh: 'stay 加形容词；stay blind、stay neutral、stay unaware。', en: 'Stay plus adjective: stay blind, stay neutral, stay unaware.' },
      example: { en: 'The recorder stayed blind until the scoring was finished.', zh: '记录者在评分结束前一直保持盲态。' },
    },
    {
      phrase: 'at random', sentenceIndex: 28,
      meaning: { zh: '随机地', en: 'in a way that leaves the assignment to chance' },
      usage: { zh: '方式状语；assign at random、choose at random。', en: 'Adverbial: assign at random, choose at random.' },
      example: { en: 'Participants were assigned to the groups at random.', zh: '参与者被随机分到两组。' },
    },
    {
      phrase: 'coded by number', sentenceIndex: 44,
      meaning: { zh: '用编号代替姓名', en: 'labelled with a number instead of a personal name' },
      usage: { zh: '被动；scores are coded by number。', en: 'Passive: scores are coded by number.' },
      example: { en: 'The raw results are coded by number for privacy.', zh: '原始结果出于隐私用编号记录。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先把声音对上名字', en: 'Match voice to name first' },
      body: {
        zh: '21–24 考“谁承担了哪项工作”。开头先记住 Clara 是女声、Andrew 是男声，每条分工先记说话人，再记事项；导师设计的任务、两人都没写的引言是干扰项。',
        en: 'Items 21–24 ask who took on which job. Match the female Clara and male Andrew to their voices first, then note the speaker before the task. The tutor’s task design and the undrafted introduction are distractors.',
      },
    },
    {
      title: { zh: '排除项要听否定句', en: 'Listen for the rejection' },
      body: {
        zh: '对照组不是安慰剂片（实验室没准备），设备不是被订满（整周空闲），温度和设备漂移已被排除。听到 did not、no drift、held the same 这类否定或一致表述时，把对应选项划掉。',
        en: 'The control was not a placebo pill, the equipment was not booked out, and temperature and device drift were ruled out. Mark an option down when you hear did not, no drift or held the same.',
      },
    },
    {
      title: { zh: '多选区分保障与设计选择', en: 'Safeguards versus design choices' },
      body: {
        zh: '三个正确项是盲态记录、随机分组、知情同意；固定任务顺序只是设计选择，没有现金报酬，也没有重复测量。听时把每个选项标注为保障、选择或不存在，再落笔。',
        en: 'The three safeguards are blind recording, random assignment and consent forms. The fixed task order is a design choice, there is no payment and no repeated measures. Label each option as safeguard, choice or absent before choosing.',
      },
    },
  ],
};
