import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 13 · Part 3 — 三人小组讨论博物馆语音导览项目分工与测试方案。原创仿真材料，非官方真题。
 *
 * 先按人分配脚本精简、录音、试访与反馈整理；再确认条目时长、成人深度层与试访后修订；
 * 末段明确试访测量的三项指标与排除项。
 */
export const test13Part3: ListeningLesson = {
  slug: 'test-13-part-3',
  part: 3,
  status: 'published',
  title: { zh: '博物馆语音导览项目', en: 'Discussing a museum audio-guide project' },
  summary: {
    zh: '三名组员讨论博物馆语音导览：分工上 Sonia 精简脚本、Thomas 进录音棚录制、Ava 做游客试访、两人共同整理反馈；条目目标约九十秒，成人可选深度艺术史层，试访后按记录修订脚本；试访测量收听时长、主展品理解度与全程完成率，付费意愿、灯光配色与入口人数不在测量范围。',
    en: 'Three members plan a museum audio guide: Sonia tightens scripts, Thomas records in the booth, Ava runs the pilot, and they compile feedback together. Entries aim for ninety seconds, adults may choose a deeper art layer, and scripts are revised from pilot notes. The trial measures listening time, object understanding and trail completion; payment, lighting and staff numbers are excluded.',
  },
  accent: { zh: 'Thomas 与 Sonia 为英式口音，Ava 为美式口音。', en: 'Thomas and Sonia use British accents; Ava uses an American accent.' },
  speechRate: '+0%',
  cast: [
    { id: 'thomas', label: 'THOMAS', gender: 'male', voice: 'en-GB-ThomasNeural' },
    { id: 'sonia', label: 'SONIA', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'ava', label: 'AVA', gender: 'female', voice: 'en-US-AvaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Who takes each task? Choose the correct letter, A–D.',
      options: [
        { key: 'A', text: 'Thomas' },
        { key: 'B', text: 'Sonia' },
        { key: 'C', text: 'Ava' },
        { key: 'D', text: 'Thomas and Ava together' },
      ],
      items: [
        { number: 21, text: 'Shorten the draft scripts' },
        { number: 22, text: 'Record the voice tracks in the booth' },
        { number: 23, text: 'Run the pilot trial with visitors' },
        { number: 24, text: 'Compile the post-trial feedback notes' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'How long should each guide entry run?',
          options: [
            { key: 'A', text: 'Around ninety seconds' },
            { key: 'B', text: 'Nearly three minutes' },
            { key: 'C', text: 'About five minutes' },
          ],
        },
        {
          number: 26,
          stem: 'Which group receives the detailed art-history layer?',
          options: [
            { key: 'A', text: 'School children under twelve' },
            { key: 'B', text: 'Adults who choose the deeper option' },
            { key: 'C', text: 'First-time weekend visitors' },
          ],
        },
        {
          number: 27,
          stem: 'What does the team do after the first pilot?',
          options: [
            { key: 'A', text: 'Record the final voices immediately' },
            { key: 'B', text: 'Revise the scripts from the trial notes' },
            { key: 'C', text: 'Ask visitors to pay for the guide' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE things does the pilot trial measure? Choose THREE letters, A–G.',
      select: 3,
      stem: 'Which THREE things does the pilot trial measure?',
      options: [
        { key: 'A', text: 'How long visitors listen to each entry' },
        { key: 'B', text: 'Whether visitors understand the main object' },
        { key: 'C', text: 'The price visitors expect to pay' },
        { key: 'D', text: 'How many visitors finish the whole trail' },
        { key: 'E', text: 'The colour of the room lighting' },
        { key: 'F', text: 'Whether visitors ask for more audio' },
        { key: 'G', text: 'The number of entrance staff' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['B'], evidence: 4,
      explanation: {
        zh: '定位句 4：I can shorten the draft scripts by Thursday, and keep the wording plain for younger visitors。精简脚本是 Sonia 的任务，对应 B；录音在句 5 由 Thomas 承担。',
        en: 'Sentence 4: "I can shorten the draft scripts by Thursday, and keep the wording plain for younger visitors". Shortening the scripts is Sonia’s task, matching B; recording goes to Thomas in sentence 5.',
      },
    },
    {
      number: 22, accepted: ['A'], evidence: 5,
      explanation: {
        zh: '定位句 5：I will handle the recording myself, since I have the booth keys and the older microphone。进棚录音由 Thomas 负责，对应 A。',
        en: 'Sentence 5: "I will handle the recording myself, since I have the booth keys and the older microphone". Thomas handles the booth recording, matching A.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 6,
      explanation: {
        zh: '定位句 6：Then I’ll run the pilot trial, watching which objects visitors stop at first。试访由 Ava 执行，对应 C。',
        en: 'Sentence 6: "Then I’ll run the pilot trial, watching which objects visitors stop at first". Ava runs the pilot trial, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 7,
      explanation: {
        zh: '定位句 7：I’ll compile them together with Ava, so we both see the raw comments。反馈笔记由 Thomas 与 Ava 共同整理，对应 D；单独一人的任务分别见前三项。',
        en: 'Sentence 7: "I’ll compile them together with Ava, so we both see the raw comments". Feedback notes are compiled by Thomas and Ava together, matching D; the solo tasks appear in the previous items.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 9,
      explanation: {
        zh: '定位句 9：Aim for about ninety seconds. Anything longer makes people skip to the next room。条目目标约九十秒；近三分钟只是初稿现状，不是目标时长。',
        en: 'Sentence 9: "Aim for about ninety seconds. Anything longer makes people skip to the next room". The target is about ninety seconds; nearly three minutes is the draft’s current length, not the target.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：the detailed art history sits behind an adult-only option。深度艺术史层面向选择深层选项的成人；儿童版只保留平实故事。',
        en: 'Sentence 11: "the detailed art history sits behind an adult-only option". The deep layer serves adults who choose it; the children’s version keeps only the plain story.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：after the pilot we revise the scripts from the trial notes, not from personal taste。首次试访后按记录修订脚本；立即录最终人声和向游客收费都未被提及。',
        en: 'Sentence 17: "after the pilot we revise the scripts from the trial notes, not from personal taste". The team revises scripts from pilot notes; recording final voices at once and charging visitors are not mentioned.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：how long visitors listen to each entry before walking on。第一项指标是每条目的收听时长，对应 A。',
        en: 'Sentence 19: "how long visitors listen to each entry before walking on". The first measure is listening time per entry, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：whether they understand the main object after hearing the guide。第二项指标是听完后是否理解主展品，对应 B。',
        en: 'Sentence 20: "whether they understand the main object after hearing the guide". The second measure is understanding of the main object, matching B.',
      },
    },
    {
      number: 30, accepted: ['D'], evidence: 21,
      explanation: {
        zh: '定位句 21：how many visitors finish the whole trail rather than dropping out halfway。第三项指标是全程完成人数，对应 D；付费意愿、灯光配色与入口人数在句 22–24 被排除。',
        en: 'Sentence 21: "how many visitors finish the whole trail rather than dropping out halfway". The third measure is trail completion, matching D. Willingness to pay, lighting and entrance staff are excluded in sentences 22 to 24.',
      },
    },
  ],
  transcript: [
    { speaker: 'thomas', text: 'We have the museum audio-guide review in front of us, so let’s divide the work clearly before Friday.' },
    { speaker: 'sonia', text: 'Good. The first drafts for the ground-floor room are already on the shared drive.' },
    { speaker: 'ava', text: 'I’m still waiting for the visitor numbers from last month, but the trial plan can go ahead without them.' },
    { speaker: 'thomas', text: 'Sonia, you’ll lead the writing side. Can you tighten each draft until it stays short and clear?' },
    { speaker: 'sonia', text: 'That’s fine. I can shorten the draft scripts by Thursday, and keep the wording plain for younger visitors.' },
    { speaker: 'thomas', text: 'I will handle the recording myself, since I have the booth keys and the older microphone.' },
    { speaker: 'ava', text: 'Then I’ll run the pilot trial, watching which objects visitors stop at first.' },
    { speaker: 'thomas', text: 'And the feedback notes after the trial? I’ll compile them together with Ava, so we both see the raw comments.' },
    { speaker: 'sonia', text: 'How long should each guide entry run? The first draft is nearly three minutes in places.' },
    { speaker: 'thomas', text: 'Aim for about ninety seconds. Anything longer makes people skip to the next room.' },
    { speaker: 'ava', text: 'Some of our regular visitors want more detail, though. Should we add a longer version?' },
    { speaker: 'thomas', text: 'We can layer it. The basic entry stays ninety seconds, and the detailed art history sits behind an adult-only option.' },
    { speaker: 'sonia', text: 'So younger visitors get the plain story, while adults can choose the deeper layer.' },
    { speaker: 'ava', text: 'Right. The children’s version avoids dates and names that mean little to them.' },
    { speaker: 'sonia', text: 'Before recording, we should check that each script names one object only.' },
    { speaker: 'thomas', text: 'Yes. Mixing two objects in one entry leaves the visitor unsure what to look at.' },
    { speaker: 'ava', text: 'I notice the draft for the pottery room repeats the same detail twice.' },
    { speaker: 'thomas', text: 'Remember, after the pilot we revise the scripts from the trial notes, not from personal taste.' },
    { speaker: 'ava', text: 'What will the pilot trial actually measure?' },
    { speaker: 'thomas', text: 'First, how long visitors listen to each entry before walking on.' },
    { speaker: 'sonia', text: 'Second, whether they understand the main object after hearing the guide.' },
    { speaker: 'ava', text: 'Third, how many visitors finish the whole trail rather than dropping out halfway.' },
    { speaker: 'thomas', text: 'We won’t measure what visitors would pay; this guide is already free with admission.' },
    { speaker: 'sonia', text: 'Lighting and room colours are set by the gallery design, so those are outside our test.' },
    { speaker: 'ava', text: 'We also won’t count entrance staff numbers, since the trial takes place on the weekend shift.' },
    { speaker: 'sonia', text: 'Should we record whether visitors ask for more audio after the tour?' },
    { speaker: 'thomas', text: 'That note can go in the free comments, but it is not one of the three measured targets.' },
    { speaker: 'ava', text: 'I’ll prepare the observation sheets with columns for listening time, understanding and completion.' },
    { speaker: 'sonia', text: 'If a script still runs over ninety seconds, we split it into two short entries.' },
    { speaker: 'ava', text: 'Then we record the revised versions and run a second small trial with a fresh group.' },
    { speaker: 'thomas', text: 'The curator will review the final wording before anything is added to the App.' },
    { speaker: 'sonia', text: 'I can send the revised scripts to the curator by Wednesday evening.' },
    { speaker: 'ava', text: 'My observation sheets are ready, but I need the trial badges printed before Saturday.' },
    { speaker: 'thomas', text: 'I’ll sort the badges with the volunteer desk, and book the booth for Tuesday morning.' },
    { speaker: 'sonia', text: 'One question. Do we need background music between entries?' },
    { speaker: 'thomas', text: 'No music in the pilot. Keep the sound dry, so we can judge the voice itself.' },
    { speaker: 'ava', text: 'Visitors often pause near the window seat, so our observation route should cover that corner.' },
    { speaker: 'sonia', text: 'I’ll add a short entry for the wall map, since people stop there before choosing a room.' },
    { speaker: 'thomas', text: 'Let’s wrap up. The draft cut, the booking and the observation sheets are our three next steps.' },
    { speaker: 'sonia', text: 'I’ll update the shared drive folder after this meeting.' },
    { speaker: 'ava', text: 'And I’ll email the trial time to the weekend volunteers.' },
  ],
  vocabulary: [
    {
      term: 'drafts', phonetic: '/drɑːfts/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '草稿，初稿', en: 'an early version of a text that still needs changes' },
      usage: { zh: 'first draft、shorten the draft；动词 draft 指起草。', en: 'First draft, shorten the draft; as a verb it means write an early version.' },
      collocations: ['the first draft', 'a rough draft', 'revise a draft'],
      example: { en: 'The first drafts for the ground-floor room are on the drive.', zh: '一层展厅的初稿已在共享盘上。' },
      listening: { zh: '单音节，/drɑːft/ 含 /ft/ 尾缀。', en: 'One syllable /drɑːft/ with an /ft/ ending.' },
    },
    {
      term: 'entry', phonetic: '/ˈentri/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '（导览）条目，一段语音讲解', en: 'one separate audio guide item about a single object' },
      usage: { zh: '导览与列表语境：each entry、guide entry；另义“进入”。', en: 'Guide and list usage: each entry, guide entry; it also means entrance.' },
      collocations: ['a guide entry', 'short entries', 'one entry per object'],
      example: { en: 'Each guide entry should stay around ninety seconds.', zh: '每条导览条目控制在九十秒左右。' },
      listening: { zh: '双音节，重音在首音节 /ˈen/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'layer', phonetic: '/ˈleɪə/', partOfSpeech: 'v.', sentenceIndex: 11,
      meaning: { zh: '分层设置（不同难度版本）', en: 'to arrange versions in separate levels for different users' },
      usage: { zh: '动词化用法；名词 layer 指一层、一个层级。', en: 'Verbal usage here; the noun layer means one level or tier.' },
      collocations: ['layer the content', 'a deeper layer', 'basic layer'],
      example: { en: 'The team layers the guide into basic and adult versions.', zh: '团队把导览分成基础版与成人版两层。' },
      listening: { zh: '双音节 /ˈleɪ-ə/，英式读音不卷舌。', en: 'Two syllables /ˈleɪ-ə/, non-rhotic in British English.' },
    },
    {
      term: 'curator', phonetic: '/kjʊəˈreɪtə/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '（博物馆）策展人，馆内研究员', en: 'the museum specialist who selects and explains the objects' },
      usage: { zh: '博物馆场景；curator’s approval、send drafts to the curator。', en: 'Museum usage: curator’s approval, send drafts to the curator.' },
      collocations: ['the museum curator', 'curator review', 'consult the curator'],
      example: { en: 'The curator reviews the final wording before the App update.', zh: 'App 更新前由策展人审定最终文案。' },
      listening: { zh: '重音在第二音节 /ˈreɪ/，尾音 /tə/ 轻读。', en: 'Stress the second syllable; the ending reduces to /tə/.' },
    },
    {
      term: 'pilot', phonetic: '/ˈpaɪlət/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '试运行，小规模试点', en: 'a first small-scale test before the full launch' },
      usage: { zh: 'pilot trial、run a pilot；另义飞行员。', en: 'Pilot trial, run a pilot; it also means the aircraft pilot.' },
      collocations: ['a pilot trial', 'run the pilot', 'the pilot stage'],
      example: { en: 'Ava runs the pilot trial with a small group of visitors.', zh: 'Ava 带一小批游客做试访。' },
      listening: { zh: '双音节，重音在首音节 /ˈpaɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'observation', phonetic: '/ˌɒbzəˈveɪʃn/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '观察记录', en: 'watching and recording what visitors do during the trial' },
      usage: { zh: 'observation sheet、make observations；动词 observe。', en: 'Observation sheet, make observations; the verb is observe.' },
      collocations: ['observation sheets', 'visitor observation', 'observation route'],
      example: { en: 'The sheets have columns for listening time and completion.', zh: '记录表设有收听时长与完成率栏目。' },
      listening: { zh: '四音节，重音在第三音节 /ˈveɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'completion', phonetic: '/kəmˈpliːʃn/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '完成（全程）', en: 'finishing the whole guide trail without dropping out' },
      usage: { zh: 'trial completion、completion rate；形容词 complete。', en: 'Trial completion, completion rate; the adjective is complete.' },
      collocations: ['trail completion', 'the completion column', 'full completion'],
      example: { en: 'The third measure is how many visitors reach full completion.', zh: '第三项指标是有多少游客走完全程。' },
      listening: { zh: '三音节，重音在第二音节 /ˈpliː/。', en: 'Three syllables with stress on /ˈpliː/.' },
    },
    {
      term: 'booth', phonetic: '/buːθ/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '录音棚，隔音小间', en: 'the small sound-proof room used for recording voices' },
      usage: { zh: 'recording booth、booth keys；另义电话亭、摊位。', en: 'Recording booth, booth keys; it also means a phone booth or market stall.' },
      collocations: ['the recording booth', 'book the booth', 'booth keys'],
      example: { en: 'Thomas books the booth for Tuesday morning.', zh: 'Thomas 把录音棚订到周二上午。' },
      listening: { zh: '长元音 /uː/，尾音清辅音 /θ/。', en: 'Long /uː/ with a voiceless final /θ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'divide the work', sentenceIndex: 0,
      meaning: { zh: '分工', en: 'to split the tasks among team members' },
      usage: { zh: '项目开场说法；同义表达是 split the tasks。', en: 'A project-opening phrase; split the tasks is a paraphrase.' },
      example: { en: 'Let’s divide the work before the Friday deadline.', zh: '周五截止前我们先分工。' },
    },
    {
      phrase: 'tighten each draft', sentenceIndex: 3,
      meaning: { zh: '把初稿压缩得更紧凑', en: 'to cut a draft down to short, clear wording' },
      usage: { zh: 'tighten 后接文本；tighten up 同构。', en: 'Follow tighten with a text; tighten up works the same way.' },
      example: { en: 'Sonia tightens each draft until it stays short.', zh: 'Sonia 把每份初稿压到简短清晰。' },
    },
    {
      phrase: 'run the pilot', sentenceIndex: 6,
      meaning: { zh: '开展试点试访', en: 'to carry out the first small-scale trial' },
      usage: { zh: 'run 在此是组织、执行；后接 trial、project。', en: 'Run means organise and execute here; it takes trial or project.' },
      example: { en: 'Ava runs the pilot after the recordings are ready.', zh: '录音就绪后 Ava 开展试访。' },
    },
    {
      phrase: 'dropping out halfway', sentenceIndex: 21,
      meaning: { zh: '中途退出', en: 'to stop the trail before reaching the end' },
      usage: { zh: 'drop out of something；halfway 表中途。', en: 'Drop out of something; halfway means at the middle point.' },
      example: { en: 'The team counts how many visitors avoid dropping out halfway.', zh: '团队统计有多少游客不会中途退出。' },
    },
    {
      phrase: 'keep the sound dry', sentenceIndex: 35,
      meaning: { zh: '保持干声，不加背景音', en: 'to record plain voice without added music or effects' },
      usage: { zh: '录音术语 dry sound；反义是 add music or reverb。', en: 'A recording term for plain voice; the opposite is adding music or reverb.' },
      example: { en: 'Keep the sound dry so the judge can hear the voice.', zh: '保留干声，方便评判人声本身。' },
    },
    {
      phrase: 'wrap up', sentenceIndex: 38,
      meaning: { zh: '结束（会议），收尾', en: 'to bring the meeting or task to a close' },
      usage: { zh: '短语动词；wrap-up 是名词总结。', en: 'A phrasal verb; the noun form is wrap-up.' },
      example: { en: 'Let’s wrap up before the volunteers arrive.', zh: '志愿者到来前我们收尾。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先记人名与职责', en: 'Match names to duties as the meeting opens' },
      body: {
        zh: '第 21–24 题按人分工。句 3 到句 7 依次点名：Sonia 写、Thomas 录、Ava 试访、Thomas 与 Ava 合整理。听时在人名旁标注动词任务，选项是四个身份而非论点，别把共同任务错配给单人。',
        en: 'Items 21 to 24 match people to duties. Sentences 3 to 7 assign in order: Sonia writes, Thomas records, Ava trials, and Thomas and Ava compile together. Note the verb task beside each name; the options are identities, not arguments, and do not assign a shared task to one person.',
      },
    },
    {
      title: { zh: '初稿时长与目标时长分开', en: 'Keep draft length separate from target length' },
      body: {
        zh: '第 25 题问目标时长，句 8 说初稿近三分钟，句 9 才给出约九十秒的目标。选择题干扰项常把现状塞进题干，听到 first draft、currently 先标为背景，听到 aim、target 再记答案。',
        en: 'Item 25 asks the target length. Sentence 8 says the draft is nearly three minutes, and sentence 9 gives the ninety-second target. Distractors often insert the current state into the stem; mark first draft and currently as background, and record the answer when you hear aim or target.',
      },
    },
    {
      title: { zh: '多选题抓“测量/排除”两类信号', en: 'Pick up measure versus exclude signals' },
      body: {
        zh: '第 28–30 题选三项测量指标。句 19–21 用 first、second、third 列出收听时长、理解度、完成率；句 22–24 用 won’t、outside our test 排除付费意愿、灯光配色和人数。听到这些信号词就立刻在选项旁标注入选或排除。',
        en: 'Items 28 to 30 choose three measures. Sentences 19 to 21 list listening time, understanding and completion with first, second and third; sentences 22 to 24 exclude willingness to pay, lighting and staff numbers with won’t and outside our test. Mark each option in or out the moment you hear these signals.',
      },
    },
  ],
};
