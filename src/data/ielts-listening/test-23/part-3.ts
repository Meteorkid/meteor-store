import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 23 · Part 3 — 戏剧改编讨论（三人讨论，英式为主，一名学生美式口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：各自立场与分工（配对 21–24）→ 改编对原作的改动、舞台调度与观众反馈（单选 25–27）
 * → 评论将考察的三个要素（多选 28–30）。题块顺序与录音一致。
 */
export const test23Part3: ListeningLesson = {
  slug: 'test-23-part-3',
  part: 3,
  status: 'published',
  title: { zh: '戏剧改编讨论', en: 'Discussing a theatre adaptation' },
  summary: {
    zh: '导师与两名学生讨论一部戏剧改编：谁主张保留原作结局、谁建议简化舞台、谁记录观众反馈、谁整理改编笔记；随后确定改编对原作情节与场景的主要改动、舞台调度建议和目前观众反应，并列出评论将考察的三个要素。',
    en: 'A tutor and two students discuss a theatre adaptation: who keeps the original ending, who suggests a simpler set, who records audience feedback, and who writes the adaptation notes. They then settle the main plot and setting changes, the staging advice, the current audience reaction, and the three elements reviewers will assess.',
  },
  accent: { zh: '导师与 Sonia 为英式口音，Ava 为美式口音。', en: 'The tutor and Sonia have British accents; Ava has an American accent.' },
  cast: [
    { id: 'tutor', label: 'TUTOR', gender: 'male', voice: 'en-GB-ThomasNeural' },
    { id: 'sonia', label: 'SONIA', gender: 'female', voice: 'en-GB-SoniaNeural' },
    { id: 'ava', label: 'AVA', gender: 'female', voice: 'en-US-AvaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which person supports each point or takes each task? Choose the correct letter, A–C.',
      options: [
        { key: 'A', text: 'Sonia' },
        { key: 'B', text: 'Ava' },
        { key: 'C', text: 'the tutor' },
      ],
      items: [
        { number: 21, text: 'prefers keeping the original ending' },
        { number: 22, text: 'suggests a simpler set design' },
        { number: 23, text: 'records the audience feedback' },
        { number: 24, text: 'writes the adaptation notes' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What main change does the adaptation make to the original play?',
          options: [
            { key: 'A', text: 'It adds two minor characters to the original plot.' },
            { key: 'B', text: 'It condenses the plot and narrows the setting to the home.' },
            { key: 'C', text: 'It moves the climax back to the public square.' },
          ],
        },
        {
          number: 26,
          stem: 'What does the tutor advise about the staging?',
          options: [
            { key: 'A', text: 'Use a revolving stage to cover the set changes.' },
            { key: 'B', text: 'Keep movement simple with a fixed platform and clear exits.' },
            { key: 'C', text: 'Place all key encounters at the back of the stage.' },
          ],
        },
        {
          number: 27,
          stem: 'What has been the audience reaction so far?',
          options: [
            { key: 'A', text: 'Strong rejection of the shortened plot.' },
            { key: 'B', text: 'Broadly warm, with mild criticism of the cuts.' },
            { key: 'C', text: 'Younger guests lost interest after the interval.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE elements will the reviewers assess? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE elements will the reviewers assess?',
      options: [
        { key: 'A', text: 'whether the adaptation keeps the spirit of the original' },
        { key: 'B', text: 'whether the actors make the shortened scenes believable' },
        { key: 'C', text: 'whether the costumes match each historical period' },
        { key: 'D', text: 'whether the programme note explains every cut' },
        { key: 'E', text: 'whether the set design serves the story' },
        { key: 'F', text: 'whether the show uses original live music' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Sonia 说 I’m in favour of keeping the original ending。主张保留原作结局对应 A（Sonia）；Ava 句 5 只是提出疑问，并未主张保留。',
        en: 'Sentence 4: Sonia says "I’m in favour of keeping the original ending". Keeping the ending matches A, Sonia. Ava in sentence 5 only raises a question, she does not argue to keep it.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 7,
      explanation: {
        zh: '定位句 7：Ava 说 I’d suggest a simpler set design。建议简化舞台对应 B（Ava）；Sonia 句 8 只是附和灯光建议，不是提议者。',
        en: 'Sentence 7: Ava says "I’d suggest a simpler set design". The simpler set matches B, Ava. Sonia in sentence 8 only agrees about lighting; she is not the proposer.',
      },
    },
    {
      number: 23, accepted: ['B'], evidence: 10,
      explanation: {
        zh: '定位句 10：Ava 说 I can record the audience feedback。记录观众反馈归 Ava，对应 B；她还提到上周五散场后留下交谈的观众。',
        en: 'Sentence 10: Ava says "I can record the audience feedback". Recording feedback goes to Ava, matching B. She also mentions guests who stayed to talk after last Friday’s showing.',
      },
    },
    {
      number: 24, accepted: ['A'], evidence: 11,
      explanation: {
        zh: '定位句 11：Sonia 说 Then I’ll write up the adaptation notes。整理改编笔记归 Sonia，对应 A；任务是逐场与原作章节对照。',
        en: 'Sentence 11: Sonia says "Then I’ll write up the adaptation notes". The notes go to Sonia, matching A. Her task compares each scene with its source chapter.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：The adaptation condenses the original plot and narrows the setting down to the home。压缩情节、收窄场景对应 B；A 的增加次要人物与句 14 的 cuts two minor characters 相反，C 的公共广场高潮被句 15 移到了家庭厨房。',
        en: 'Sentence 17: "The adaptation condenses the original plot and narrows the setting down to the home". Condensing the plot and narrowing the setting match B. Adding minor characters in A contradicts cutting two in sentence 14, and the public square climax in C has moved to the kitchen in sentence 15.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：keep the moves simple, and let the dialogue carry the tension。动作简单、平台固定、出口清楚对应 B；A 的旋转舞台在句 19 因场地空间被否掉，C 的 encounters 放在后区与句 21 的 downstage 相反。',
        en: 'Sentence 22: "keep the moves simple, and let the dialogue carry the tension". Simple movement with a fixed platform and clear exits matches B. The revolving stage in A is rejected for space in sentence 19, and placing encounters upstage in C contradicts downstage in sentence 21.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：the reaction is broadly warm, with mild criticism of the cuts rather than rejection。总体温和、对删减略有意见对应 B；A 的强烈否定与句 24 的 followed the shortened plot well 相反，C 的年轻观众失去兴趣与句 25 的 stayed engaged 相反。',
        en: 'Sentence 26: "the reaction is broadly warm, with mild criticism of the cuts rather than rejection". A warm response with mild criticism matches B. Strong rejection in A contradicts following the shortened plot well in sentence 24, and young guests losing interest in C contradicts staying engaged in sentence 25.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 28,
      explanation: {
        zh: '定位句 28：whether the adaptation respects the spirit of the original, even where it changes the details。保留原作精神对应 A。',
        en: 'Sentence 28: "whether the adaptation respects the spirit of the original, even where it changes the details". Keeping the spirit of the original matches A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：whether the actors make the condensed scenes feel believable on stage。演员让压缩后的场次可信对应 B。',
        en: 'Sentence 29: "the actors make the condensed scenes feel believable on stage". Believable shortened scenes match B.',
      },
    },
    {
      number: 30, accepted: ['E'], evidence: 30,
      explanation: {
        zh: '定位句 30：whether the design serves the story instead of drawing attention to itself。舞台设计服务于故事对应 E。C 的服装在句 32 被明确列为非强项，D 的节目单说明句 34 不计入艺术评分，F 的现场音乐句 35 已排除。',
        en: 'Sentence 30: "whether the design serves the story instead of drawing attention to itself". A design that serves the story matches E. Costumes in C are called a non-strength in sentence 32, the programme note in D is not scored in sentence 34, and live music in F is ruled out in sentence 35.',
      },
    },
  ],
  transcript: [
    { speaker: 'tutor', text: 'Come in, you two. Thanks for making time before the rehearsal.' },
    { speaker: 'sonia', text: 'Hi, we’ve brought our notes on the theatre adaptation.' },
    { speaker: 'ava', text: 'There are a few choices we still can’t settle.' },
    { speaker: 'tutor', text: 'That’s normal at this stage. Let’s start with what each of you thinks of the original ending.' },
    { speaker: 'sonia', text: 'I’m in favour of keeping the original ending. The novel’s last scene earns its sadness, and cutting it would weaken the whole piece.' },
    { speaker: 'ava', text: 'I see the argument, but I wonder if the stage version needs something cleaner.' },
    { speaker: 'tutor', text: 'Let’s hold that thought and move to the set.' },
    { speaker: 'ava', text: 'I’d suggest a simpler set design. One raised platform and a few chairs would keep the focus on the actors rather than the scenery.' },
    { speaker: 'sonia', text: 'That works for me. We can use lighting to suggest the different rooms.' },
    { speaker: 'tutor', text: 'Good. Now, who will collect what the audience says after the preview?' },
    { speaker: 'ava', text: 'I can record the audience feedback. I noted who stayed to talk after last Friday’s showing.' },
    { speaker: 'sonia', text: 'Then I’ll write up the adaptation notes, comparing each scene with the original chapter it comes from.' },
    { speaker: 'tutor', text: 'Perfect. Those four jobs are settled for now.' },
    { speaker: 'tutor', text: 'Now let’s talk about how the adaptation changes the source play.' },
    { speaker: 'ava', text: 'The original script has three acts and a large cast, but our version cuts two minor characters and brings the scenes into one continuous evening.' },
    { speaker: 'sonia', text: 'It also shifts the climax from a public square to the family kitchen, which brings the conflict closer to the audience.' },
    { speaker: 'tutor', text: 'So what is the main change you would point to?' },
    { speaker: 'ava', text: 'The adaptation condenses the original plot and narrows the setting down to the home.' },
    { speaker: 'tutor', text: 'Right. And what about the staging, the way the actors move on stage?' },
    { speaker: 'sonia', text: 'We discussed a revolving stage, but that would need more space than our hall has.' },
    { speaker: 'tutor', text: 'I agree. A fixed platform with clear exits on both sides is safer for this cast.' },
    { speaker: 'ava', text: 'The director can place the key encounters downstage, where every seat in the small room can see them.' },
    { speaker: 'tutor', text: 'That’s the staging I’d advise, so keep the moves simple, and let the dialogue carry the tension.' },
    { speaker: 'sonia', text: 'What about the audience reaction so far? We had two previews last week.' },
    { speaker: 'ava', text: 'Most viewers followed the shortened plot well, but a few missed the secondary characters from the original.' },
    { speaker: 'sonia', text: 'The evening felt steady rather than exciting, and the younger guests in the front row stayed engaged throughout.' },
    { speaker: 'tutor', text: 'So the reaction is broadly warm, with mild criticism of the cuts rather than rejection of the new version.' },
    { speaker: 'tutor', text: 'When the reviewers come, what will they be looking at?' },
    { speaker: 'sonia', text: 'First, whether the adaptation respects the spirit of the original, even where it changes the details.' },
    { speaker: 'ava', text: 'Second, whether the actors make the condensed scenes feel believable on stage.' },
    { speaker: 'tutor', text: 'Third, whether the design serves the story instead of drawing attention to itself.' },
    { speaker: 'sonia', text: 'What about costumes?' },
    { speaker: 'tutor', text: 'I wouldn’t count costumes as a main strength here. They are plain by choice, not a feature to defend.' },
    { speaker: 'ava', text: 'And should we add a programme note explaining the cuts?' },
    { speaker: 'tutor', text: 'Yes, a short note helps, but it is not one of the artistic elements the judges score.' },
    { speaker: 'sonia', text: 'We shouldn’t promise any original music either, because the show runs with recorded sound only.' },
    { speaker: 'tutor', text: 'Let’s fix the rehearsal schedule before you go.' },
    { speaker: 'sonia', text: 'We can run scenes one and two on Tuesday, and the kitchen scenes on Thursday.' },
    { speaker: 'ava', text: 'I’ll bring the feedback sheets from the previews to that Thursday run.' },
    { speaker: 'tutor', text: 'Check that every sheet has a clear note on which scene the comment refers to.' },
    { speaker: 'sonia', text: 'Some comments are too general to use, like saying the show was nice.' },
    { speaker: 'tutor', text: 'Right. Encourage viewers to name the moment that worked or fell flat.' },
    { speaker: 'ava', text: 'I can group the notes by scene once the final preview is done.' },
    { speaker: 'sonia', text: 'And I’ll compare each adapted scene with its source chapter in the notes.' },
    { speaker: 'tutor', text: 'That comparison matters, because the reviewers will read it alongside the show.' },
    { speaker: 'ava', text: 'Should we contact the rights holder about the shortened plot?' },
    { speaker: 'tutor', text: 'The college licence already covers this student production, so no extra permission is needed.' },
    { speaker: 'sonia', text: 'What about the title? Should it stay close to the novel?' },
    { speaker: 'tutor', text: 'Keep the original title, but add a subtitle showing this is an adapted version.' },
    { speaker: 'ava', text: 'The poster can list the two leads and the director, not the full cast.' },
    { speaker: 'tutor', text: 'Fine. Now a note on tone in the discussion.' },
    { speaker: 'sonia', text: 'You mean we shouldn’t argue the choices as if they were personal.' },
    { speaker: 'tutor', text: 'Exactly. Describe what the audience sees, and explain why the choice serves the story.' },
    { speaker: 'ava', text: 'I noticed some lines are still too long for the small stage.' },
    { speaker: 'tutor', text: 'Read them aloud at the next rehearsal, and mark where the breath runs out.' },
    { speaker: 'sonia', text: 'We should also check the sightlines from the back row.' },
    { speaker: 'tutor', text: 'Ask the stage manager to sit there during the first full run.' },
    { speaker: 'ava', text: 'Will there be time to revise after that run?' },
    { speaker: 'tutor', text: 'One weekend, enough to trim lines and adjust the exits, not to rebuild the set.' },
    { speaker: 'sonia', text: 'That sounds realistic.' },
    { speaker: 'tutor', text: 'Bring a draft of the adaptation notes to our next meeting, and we can go through them together.' },
    { speaker: 'ava', text: 'We’ll sort out the feedback sheets by Wednesday evening.' },
    { speaker: 'sonia', text: 'Thanks for the advice on the ending and the set.' },
    { speaker: 'tutor', text: 'Keep the changes clear, and the audience will follow the story without effort.' },
    { speaker: 'ava', text: 'I’ll see you both at the Tuesday rehearsal.' },
    { speaker: 'sonia', text: 'See you then.' },
  ],
  vocabulary: [
    {
      term: 'adaptation', phonetic: '/ˌædæpˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '改编作品（把小说或剧本改成舞台版本）', en: 'a work rewritten from a book or play for the stage or screen' },
      usage: { zh: '可数；stage adaptation、film adaptation。动词 adapt。', en: 'Countable: stage adaptation, film adaptation. The verb is adapt.' },
      collocations: ['a theatre adaptation', 'the adaptation notes', 'faithful adaptation'],
      example: { en: 'The stage adaptation keeps the main plot but trims the cast.', zh: '舞台改编保留主线，但精简了演员阵容。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈteɪ/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'original', phonetic: '/əˈrɪdʒənl/', partOfSpeech: 'adj.', sentenceIndex: 4,
      meaning: { zh: '原作的，最初版本的', en: 'from the source book or play, before any change' },
      usage: { zh: 'original ending、original chapter。作名词时指“原著”。', en: 'Original ending, original chapter. As a noun it means the source work.' },
      collocations: ['the original ending', 'the original chapter', 'faithful to the original'],
      example: { en: 'The review compares the new scenes with the original.', zh: '评论把新场次与原作做了比较。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈrɪdʒ/，开头 /ə/ 轻读。', en: 'Four syllables with stress on the second; the initial /ə/ is reduced.' },
    },
    {
      term: 'condenses', phonetic: '/kənˈdensɪz/', partOfSpeech: 'v.', sentenceIndex: 17,
      meaning: { zh: '压缩，精简（把长情节改短）', en: 'shortened by removing parts while keeping the main story' },
      usage: { zh: '被动 be condensed；名词 condensation。condense 也指“浓缩液体”。', en: 'Passive be condensed; the noun is condensation. It also means to thicken a liquid.' },
      collocations: ['condense the plot', 'a condensed version', 'condensed scenes'],
      example: { en: 'The condensed plot fits into one evening.', zh: '压缩后的情节能在一个晚上演完。' },
      listening: { zh: '单音节动词过去式，/nst/ 辅音丛不要漏 /n/。', en: 'One-syllable past form; keep the /n/ in the /nst/ cluster.' },
    },
    {
      term: 'staging', phonetic: '/ˈsteɪdʒɪŋ/', partOfSpeech: 'n.', sentenceIndex: 18,
      meaning: { zh: '舞台调度，舞台呈现方式', en: 'how a play is placed and moved on the stage' },
      usage: { zh: '不可数；the staging advice、stage design 相近但 staging 强调动作与走位。', en: 'Uncountable: staging advice. Stage design is close, but staging stresses movement and placement.' },
      collocations: ['the staging advice', 'simple staging', 'the staging of the scenes'],
      example: { en: 'The staging keeps the actors close to the audience.', zh: '舞台调度让演员贴近观众。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /ɪŋ/。', en: 'Two syllables, stressed on the first, ending in /ɪŋ/.' },
    },
    {
      term: 'preview', phonetic: '/ˈpriːvjuː/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '预演，试映（正式上演前的公开场次）', en: 'a showing before the official opening, to test the audience response' },
      usage: { zh: '可数；press preview、preview showing。动词 preview 指“预演”。', en: 'Countable: press preview, preview showing. The verb means to test-run.' },
      collocations: ['the audience feedback', 'last week’s preview', 'a preview showing'],
      example: { en: 'Feedback from the preview shapes the final cuts.', zh: '预演反馈决定最终删改。' },
      listening: { zh: '两个音节，重音在第一音节，/vjuː/ 清晰读出。', en: 'Two syllables, stressed on the first; pronounce /vjuː/ clearly.' },
    },
    {
      term: 'spirit', phonetic: '/ˈspɪrɪt/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '精神，神韵（作品内在的主旨气质）', en: 'the underlying meaning or mood that a work keeps, despite changes' },
      usage: { zh: '不可数；the spirit of the original。另有“精神活力”之义。', en: 'Uncountable: the spirit of the original. It also means energy or morale.' },
      collocations: ['the spirit of the original', 'keep the spirit', 'in the spirit of'],
      example: { en: 'The adaptation keeps the spirit even where it changes details.', zh: '改编虽改细节，仍保住了神韵。' },
      listening: { zh: '两个音节，重音在第一音节，第二音节 /rɪt/ 轻读。', en: 'Two syllables, stressed on the first, with a light second /rɪt/.' },
    },
    {
      term: 'sightlines', phonetic: '/ˈsaɪtlaɪnz/', partOfSpeech: 'n.', sentenceIndex: 55,
      meaning: { zh: '视线（观众到舞台之间无遮挡的观看角度）', en: 'the view from each seat, with nothing blocking the stage' },
      usage: { zh: '常用复数；check the sightlines。复合词 sight 加 line。', en: 'Usually plural: check the sightlines. Compound of sight and line.' },
      collocations: ['check the sightlines', 'the sightlines from the back row', 'clear sightlines'],
      example: { en: 'The low platform keeps the sightlines open.', zh: '低矮平台保证后排视线不受挡。' },
      listening: { zh: '复合词两个部分都重读，结尾 /z/ 轻读。', en: 'Both parts are stressed; the final /z/ is soft.' },
    },
  ],
  expressions: [
    {
      phrase: 'hold that thought', sentenceIndex: 6,
      meaning: { zh: '先记下这个想法，稍后再谈', en: 'keep an idea in mind and return to it later' },
      usage: { zh: '口语过渡语；对话中换话题时使用。', en: 'A spoken transition used when switching topics for the moment.' },
      example: { en: 'Let’s hold that thought and look at the set first.', zh: '先记下这个想法，我们先看舞台。' },
    },
    {
      phrase: 'keep the focus on', sentenceIndex: 7,
      meaning: { zh: '把注意力集中在……上', en: 'direct attention onto something rather than elsewhere' },
      usage: { zh: '及物；keep the focus on the actors。focus 作名词。', en: 'Transitive: keep the focus on the actors. Focus is a noun here.' },
      example: { en: 'The plain set keeps the focus on the dialogue.', zh: '朴素舞台把注意力留在对话上。' },
    },
    {
      phrase: 'stayed to talk', sentenceIndex: 10,
      meaning: { zh: '留下来交谈', en: 'remained after the showing to discuss the performance' },
      usage: { zh: 'stay to do something；反义是 leave straight away。', en: 'stay to do something; the opposite is leaving straight away.' },
      example: { en: 'A few viewers stayed to talk about the ending.', zh: '几位观众留下来讨论结局。' },
    },
    {
      phrase: 'run scenes', sentenceIndex: 37,
      meaning: { zh: '排练场次，顺一遍戏', en: 'to practise a scene from start to finish in rehearsal' },
      usage: { zh: '戏剧排练用语；run a scene、run through the lines。', en: 'Rehearsal sense: run a scene, run through the lines.' },
      example: { en: 'We run scenes one and two on Tuesday.', zh: '周二我们排练第一、二场。' },
    },
    {
      phrase: 'fell flat', sentenceIndex: 41,
      meaning: { zh: '（效果）失败，没引起反应', en: 'failed to amuse or convince an audience' },
      usage: { zh: '口语；a joke falls flat、a line fell flat。', en: 'Speech: a joke falls flat, a line fell flat.' },
      example: { en: 'Note the moment that worked or fell flat.', zh: '记下哪个瞬间有效、哪个冷场。' },
    },
    {
      phrase: 'sort out', sentenceIndex: 61,
      meaning: { zh: '办妥，整理安排好', en: 'to deal with and organise a task' },
      usage: { zh: '及物；sort out the sheets、sort out the schedule。', en: 'Transitive: sort out the sheets, sort out the schedule.' },
      example: { en: 'We’ll sort out the feedback sheets by Wednesday.', zh: '我们周三前把反馈表整理好。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先把声音对到名字', en: 'Match voices to names early' },
      body: {
        zh: 'Part 3 配对考“谁主张什么、谁做什么”。开场先记住导师、Sonia、Ava 三人的声音；听到 I’m in favour of、I’d suggest、I can、I’ll 这类认领句，先记说话人，再记观点或任务。',
        en: 'Part 3 matching asks who argues what and who does what. Match the tutor, Sonia and Ava to their voices first. After phrases such as I’m in favour of, I’d suggest, I can or I’ll, note the speaker before the point or task.',
      },
    },
    {
      title: { zh: '注意中途修正和换人提议', en: 'Watch for last-minute changes' },
      body: {
        zh: '讨论中常有先提议、后被他人接走的分工。听到 Actually、Then I’ll、I can 时核对说话人是否换人；早先的认领如果被后面的句子取代，以最终分工为准。',
        en: 'A task can be offered first and taken by someone else later. After Actually, Then I’ll or I can, check whether the speaker has changed. If an earlier offer is replaced, follow the final allocation.',
      },
    },
    {
      title: { zh: '多选题用否定句排干扰', en: 'Reject options with the negative' },
      body: {
        zh: '多选三个正确项对应三条评论要素；其余三项被导师明确排除：服装是刻意朴素、节目单不计分、只有录音配乐。听到排除句，在对应选项旁划掉，不要凭印象保留。',
        en: 'Three options are review elements; the rest are explicitly ruled out: plain costumes, an unscored programme note, and recorded sound only. Cross out an option when you hear the exclusion rather than keeping it on impression.',
      },
    },
  ],
};
