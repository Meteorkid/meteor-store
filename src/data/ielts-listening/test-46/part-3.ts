import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 46 · Part 3 — 旧报纸档案研究讨论（两人学术讨论，新西兰口音为主，一名爱尔兰口音）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：档案获取 → 样本年份与标题 → 编码方法 → 选题理由与史料偏见
 * → 分工与编码记录 → 对比两份报纸 → 三项研究措施（多选 28–30）。
 * 配对题考“谁提出了哪条方案”。
 */
export const test46Part3: ListeningLesson = {
  slug: 'test-46-part-3',
  part: 3,
  status: 'published',
  title: { zh: '旧报纸档案研究', en: 'Discussing archival research on newspapers' },
  summary: {
    zh: '两名学生规划旧报纸研究：从城市档案申请复印本，样本聚焦十九十年代单一十年、每份标题二十期；按主题类别编码文章，比较早晚两份报纸，记录版面长度与发行量，并警惕广告商影响编辑倾向带来的史料偏见。',
    en: 'Two students plan a newspaper study: they request copies from the city archive, focus on one decade in the nineteen tens with twenty issues per title, code articles by subject category, compare the morning and evening papers, note report length and circulation, and watch for editorial bias influenced by advertisers.',
  },
  accent: { zh: 'Mitchell 为新西兰口音，Emily 为爱尔兰口音。', en: 'Mitchell has a New Zealand accent; Emily has an Irish accent.' },
  speechRate: '+2%',
  cast: [
    { id: 'mitchell', label: 'MITCHELL', gender: 'male', voice: 'en-NZ-MitchellNeural' },
    { id: 'emily', label: 'EMILY', gender: 'female', voice: 'en-IE-EmilyNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which proposal does each person put forward? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'request copies from the city archive' },
        { key: 'B', text: 'compare a morning and an evening title from the same years' },
        { key: 'C', text: 'code articles by subject category' },
        { key: 'D', text: 'read the oldest bound volumes first' },
        { key: 'E', text: 'check how editors selected stories' },
        { key: 'F', text: 'watch for bias in the editorial line' },
      ],
      items: [
        { number: 21, text: 'Mitchell' },
        { number: 22, text: 'Emily' },
        { number: 23, text: 'Mitchell' },
        { number: 24, text: 'Emily' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Why did the group choose newspapers as their source?',
          options: [
            { key: 'A', text: 'To record local opinion of the period rather than a later account.' },
            { key: 'B', text: 'To compare printing techniques across two decades.' },
            { key: 'C', text: 'To train reporters in the style of old articles.' },
          ],
        },
        {
          number: 26,
          stem: 'What source bias do they discuss?',
          options: [
            { key: 'A', text: 'Librarians chose which volumes were kept on the shelves.' },
            { key: 'B', text: 'Advertisers influenced the editorial choices of the paper.' },
            { key: 'C', text: 'Cartoons were printed instead of straight news reports.' },
          ],
        },
        {
          number: 27,
          stem: 'What does the sample consist of?',
          options: [
            { key: 'A', text: 'Twenty issues from one selected decade, per title.' },
            { key: 'B', text: 'Fifty issues spread across fifty different years.' },
            { key: 'C', text: 'Five titles all from the nineteen twenties.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE measures will the group take? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE measures will the group take in the research?',
      options: [
        { key: 'A', text: 'Keeping a coding log for each article' },
        { key: 'B', text: 'Comparing the morning and evening titles' },
        { key: 'C', text: 'Recording the circulation figures where printed' },
        { key: 'D', text: 'Noting the length of each report' },
        { key: 'E', text: 'Including all cartoons and adverts in the sample' },
        { key: 'F', text: 'Removing articles that read like advertisements' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：Mitchell 说 I think we should request copies through the city archive, since the bound volumes cannot leave the reading room。他主张向城市档案申请复印本，对应 A。句 2 的馆藏年限是背景，不是方案。',
        en: 'Sentence 4: Mitchell says he would "request copies through the city archive, since the bound volumes cannot leave the reading room", matching A. The archive’s date range in sentence 2 is background, not a proposal.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 7,
      explanation: {
        zh: '定位句 7：Emily 说 We can compare the morning paper with the evening one from the same years。她提议比较同年的早晚两份报纸，对应 B。句 6 的单十年范围是 Mitchell 的意见。',
        en: 'Sentence 7: Emily says they can "compare the morning paper with the evening one from the same years", matching B. The single-decade frame in sentence 6 is Mitchell’s view.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 10,
      explanation: {
        zh: '定位句 10：Mitchell 说 We should code each piece by subject category, such as politics, trade, weather or local events。他提出按主题类别编码，对应 C。句 12 的先读旧合订本是 Mitchell 另一项次要建议，不在选项 C 内。',
        en: 'Sentence 10: Mitchell says they should "code each piece by subject category, such as politics, trade, weather or local events", matching C. Reading the oldest volumes first in sentence 12 is his secondary suggestion, not option C.',
      },
    },
    {
      number: 24, accepted: ['F'], evidence: 16,
      explanation: {
        zh: '定位句 16：Emily 说 That touches on bias, which the tutor asked us to discuss in the write-up。她提出留意编辑立场中的偏见，对应 F。句 39 的发行量记录是 Mitchell 提到、Emily 接话确认的事实，不属于她独立提出的方案。',
        en: 'Sentence 16: Emily says "That touches on bias, which the tutor asked us to discuss in the write-up", matching F. The circulation note in sentence 39 is raised by Mitchell and confirmed by Emily, not her own proposal.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 26,
      explanation: {
        zh: '定位句 26：They record local opinion of the period, the talk at the time, rather than a later account written from hindsight。选题是记录当时的本地舆论，而非后人追溯，对应 A。B 的印刷技术比较与 C 的培养记者在全段没有出现。',
        en: 'Sentence 26: newspapers "record local opinion of the period, the talk at the time, rather than a later account written from hindsight", matching A. Comparing print techniques in B and training reporters in C are never raised.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：Advertisers placed large notices in the back pages, and those could nudge the editorial line。讨论的偏见是广告商影响编辑取向，对应 B。馆藏挑选与漫画替代新闻都不是本段偏见。',
        en: 'Sentence 18: "Advertisers placed large notices in the back pages, and those could nudge the editorial line", matching B. Shelf selection and cartoons replacing news are not the bias discussed.',
      },
    },
    {
      number: 27, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：The tutor expects twenty issues per title, spread across the selected decade。样本为选定十年内每份标题二十期，对应 A。B 的五十年五十期与 C 的五个二十年代标题都与录音不符。',
        en: 'Sentence 21: "The tutor expects twenty issues per title, spread across the selected decade", matching A. Fifty issues over fifty years in B and five nineteen-twenties titles in C do not match the plan.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 41,
      explanation: {
        zh: '定位句 41：We should keep a coding log, where each article gets a reference number and a short note。为每篇文章保留编码记录是第一项措施，对应 A。句 42 说明日志防止遗漏已读篇目。',
        en: 'Sentence 41: "We should keep a coding log, where each article gets a reference number and a short note", matching A. Sentence 42 explains the log prevents losing track of read issues.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 43,
      explanation: {
        zh: '定位句 43：Then we compare the two titles side by side, looking for stories one paper carried and the other missed。并排比较两份报纸是第二项措施，对应 B。句 44 说明选择差异反映编辑优先取向。',
        en: 'Sentence 43: "we compare the two titles side by side, looking for stories one paper carried and the other missed", matching B. Sentence 44 notes selection differences reveal editorial priorities.',
      },
    },
    {
      number: 30, accepted: ['D'], evidence: 45,
      explanation: {
        zh: '定位句 45：We should note the length of each report, since a long piece may matter more than a short mention。记录每篇报道长度是第三项措施，对应 D。E 的纳入全部漫画广告与 F 的删除广告式文章在句 55、51 被明确排除或另作处理。',
        en: 'Sentence 45: "We should note the length of each report, since a long piece may matter more than a short mention", matching D. Including all cartoons and adverts in E and removing advert-like articles in F are rejected or separated out in sentences 55 and 51.',
      },
    },
  ],
  transcript: [
    { speaker: 'mitchell', text: 'Emily, the archive session with the city library is next Tuesday, so let us settle how we will use the old newspapers.' },
    { speaker: 'emily', text: 'Good, the tutor wants a paper on local opinion in the late nineteenth and early twentieth centuries.' },
    { speaker: 'mitchell', text: 'The archive holds bound volumes from eighteen eighty to nineteen twenty-five.' },
    { speaker: 'emily', text: 'How do we get access to the originals?' },
    { speaker: 'mitchell', text: 'I think we should request copies through the city archive, since the bound volumes cannot leave the reading room.' },
    { speaker: 'emily', text: 'That makes sense. Which titles should we focus on?' },
    { speaker: 'mitchell', text: 'I would keep to a single decade first, the nineteen tens, so the sample stays manageable.' },
    { speaker: 'emily', text: 'A decade is a good frame. We can compare the morning paper with the evening one from the same years.' },
    { speaker: 'mitchell', text: 'Yes, two titles let us see whether the same stories were selected in both.' },
    { speaker: 'emily', text: 'Once we have the copies, how will we sort the articles?' },
    { speaker: 'mitchell', text: 'We should code each piece by subject category, such as politics, trade, weather or local events.' },
    { speaker: 'emily', text: 'Coding by topic keeps the notes consistent.' },
    { speaker: 'mitchell', text: 'I also suggest reading the oldest bound volumes first, to get a feel for the layout and the printing quality.' },
    { speaker: 'emily', text: 'Reading order is secondary to the coding.' },
    { speaker: 'emily', text: 'What about the editors’ choices? Newspapers do not print every event that happens.' },
    { speaker: 'mitchell', text: 'We should check how editors selected stories, and whether a tale was pushed higher on the page.' },
    { speaker: 'emily', text: 'That touches on bias, which the tutor asked us to discuss in the write-up.' },
    { speaker: 'mitchell', text: 'Right, the same town event can look very different depending on who paid for the notice.' },
    { speaker: 'emily', text: 'Advertisers placed large notices in the back pages, and those could nudge the editorial line.' },
    { speaker: 'mitchell', text: 'We must record when an article reads like an advertisement rather than straight reporting.' },
    { speaker: 'emily', text: 'Did the brief say how many issues we need to look at?' },
    { speaker: 'mitchell', text: 'The tutor expects twenty issues per title, spread across the selected decade.' },
    { speaker: 'emily', text: 'Twenty issues per paper, forty in total, enough for the coding table.' },
    { speaker: 'mitchell', text: 'Originals stay in the archive, but the copies are ours to keep.' },
    { speaker: 'emily', text: 'Good. Let me note the sample years in the plan before the meeting.' },
    { speaker: 'mitchell', text: 'Fine. Why did we choose newspapers as our source in the first place?' },
    { speaker: 'emily', text: 'They record local opinion of the period, the talk at the time, rather than a later account written from hindsight.' },
    { speaker: 'mitchell', text: 'That is the main reason. They show what people were reading and worrying about back then.' },
    { speaker: 'emily', text: 'Could they also teach us how reporters wrote at the time?' },
    { speaker: 'mitchell', text: 'Our topic is opinion, not reporter style.' },
    { speaker: 'emily', text: 'I see. What is the biggest weakness of using newspapers?' },
    { speaker: 'mitchell', text: 'They reflect the views of the paper’s owners and advertisers, not every voice in the town.' },
    { speaker: 'emily', text: 'Our findings will be strongest on public taste, weaker on those who could not buy a paper.' },
    { speaker: 'mitchell', text: 'Exactly. We should say that limitation plainly in the introduction.' },
    { speaker: 'emily', text: 'How will we divide the work between us?' },
    { speaker: 'mitchell', text: 'I will request the copies and list the issues; you set up the coding sheet.' },
    { speaker: 'emily', text: 'Deal. I will draft the subject categories, and you can add any topic I have missed.' },
    { speaker: 'mitchell', text: 'Before coding, we should skim each issue for the main headline on the front page.' },
    { speaker: 'emily', text: 'Headlines signal what the paper treated as important that week.' },
    { speaker: 'mitchell', text: 'We also note the circulation figure printed at the bottom of certain issues.' },
    { speaker: 'emily', text: 'Circulation tells us roughly how many households read that title.' },
    { speaker: 'mitchell', text: 'We should keep a coding log, where each article gets a reference number and a short note.' },
    { speaker: 'emily', text: 'A log prevents us losing track of which issue we have already read.' },
    { speaker: 'mitchell', text: 'Then we compare the two titles side by side, looking for stories one paper carried and the other missed.' },
    { speaker: 'emily', text: 'Differences in selection are evidence of editorial priorities, not mistakes.' },
    { speaker: 'mitchell', text: 'We should note the length of each report, since a long piece may matter more than a short mention.' },
    { speaker: 'emily', text: 'Letters to the editor show how readers replied to a story.' },
    { speaker: 'mitchell', text: 'We will set those aside from news articles in the coding, to keep the categories clean.' },
    { speaker: 'emily', text: 'What questions did the tutor raise about source bias?' },
    { speaker: 'mitchell', text: 'She warned that advertisers influenced editorial choices, so we should watch for positive mentions of regular sponsors.' },
    { speaker: 'emily', text: 'A bakery notice and a shop advertisement might sit beside a review of the same business.' },
    { speaker: 'mitchell', text: 'We mark those entries separately rather than counting them as neutral reporting.' },
    { speaker: 'emily', text: 'Could a wealthy owner slant the whole line of the paper?' },
    { speaker: 'mitchell', text: 'That is why we compare titles, so one owner’s preference does not stand for the town.' },
    { speaker: 'emily', text: 'Shall we include cartoons and adverts in the sample?' },
    { speaker: 'mitchell', text: 'Cartoons go in a separate section; adverts count only when they shape nearby news.' },
    { speaker: 'emily', text: 'I will read through the archive list tonight and check which issues are still held.' },
    { speaker: 'mitchell', text: 'Email the librarian if a volume is missing, and pick another year in the decade.' },
    { speaker: 'emily', text: 'Good. Do we need permission to quote short passages?' },
    { speaker: 'mitchell', text: 'The archive allows short quotes for study, but we should name the paper and date in every note.' },
    { speaker: 'emily', text: 'I will keep that citation format beside the coding sheet.' },
    { speaker: 'mitchell', text: 'When coding is done, we tally subjects across the two titles.' },
    { speaker: 'emily', text: 'The final section will explain the bias sources and the limits of our sample.' },
    { speaker: 'mitchell', text: 'Right. I will bring the request form to the archive session on Tuesday.' },
    { speaker: 'emily', text: 'And I will have the coding categories ready by then.' },
    { speaker: 'mitchell', text: 'Anything else before we meet?' },
    { speaker: 'emily', text: 'We should bring a notebook for the reading room, since no cameras are allowed there.' },
    { speaker: 'mitchell', text: 'The archive desks provide pens, but paper is easier to write on.' },
    { speaker: 'emily', text: 'Then this covers our preparation. I will see you at the library entrance at nine.' },
    { speaker: 'mitchell', text: 'See you then.' },
  ],
  vocabulary: [
    {
      term: 'archive', phonetic: '/ˈɑːkaɪv/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '档案（馆），旧藏文献库', en: 'a place keeping old records, newspapers or documents' },
      usage: { zh: '可数；city archive、bound volumes in the archive。形容词 archival。', en: 'Countable: city archive, bound volumes in the archive. The adjective is archival.' },
      collocations: ['the city archive', 'the archive session', 'archive copies'],
      example: { en: 'We request copies from the city archive.', zh: '我们向城市档案申请复印本。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈɑː/，结尾 /kaɪv/。', en: 'Two syllables with stress on the first; ending /kaɪv/.' },
    },
    {
      term: 'category', phonetic: '/ˈkætəɡəri/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '类别，主题分类', en: 'a group of articles sharing one subject' },
      usage: { zh: '可数；subject category、code by category。复数 categories。', en: 'Countable: subject category, code by category. Plural is categories.' },
      collocations: ['subject category', 'by category', 'a coding category'],
      example: { en: 'Each piece is coded by subject category.', zh: '每篇文章按主题类别编码。' },
      listening: { zh: '四个音节，重音在第一音节 /ˈkæ/。', en: 'Four syllables with stress on the first.' },
    },
    {
      term: 'bias', phonetic: '/ˈbaɪəs/', partOfSpeech: 'n.', sentenceIndex: 16,
      meaning: { zh: '偏见，史料偏向', en: 'a leaning toward one group or view that skews the record' },
      usage: { zh: '不可数；source bias、editorial bias。形容词 biased。', en: 'Uncountable: source bias, editorial bias. The adjective is biased.' },
      collocations: ['source bias', 'editorial bias', 'reduce the bias'],
      example: { en: 'The tutor asked us to discuss source bias.', zh: '导师要求我们讨论史料偏见。' },
      listening: { zh: '读 /ˈbaɪəs/，两个元音连读，不加额外音节。', en: 'Pronounced /ˈbaɪəs/ with linked vowels; do not add a syllable.' },
    },
    {
      term: 'circulation', phonetic: '/ˌsɜːkjəˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 39,
      meaning: { zh: '发行量（报纸读者规模）', en: 'the number of copies a paper sells or distributes' },
      usage: { zh: '不可数或可数；circulation figure、print circulation。', en: 'Uncountable or countable: circulation figure, print circulation.' },
      collocations: ['the circulation figure', 'circulation estimate', 'a large circulation'],
      example: { en: 'We note the circulation figure printed at the issue bottom.', zh: '我们记录印在刊底的发行量数字。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈleɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'coding', phonetic: '/ˈkəʊdɪŋ/', partOfSpeech: 'n.', sentenceIndex: 41,
      meaning: { zh: '编码（按类别标注条目）', en: 'the work of labeling each article with a subject code' },
      usage: { zh: '不可数；coding log、coding sheet。动词 code。', en: 'Uncountable: coding log, coding sheet. The verb is code.' },
      collocations: ['a coding log', 'the coding sheet', 'keep the coding clean'],
      example: { en: 'A coding log records each article reference.', zh: '编码日志记录每篇文章编号。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkəʊ/，结尾 /dɪŋ/。', en: 'Two syllables with stress on the first; ending /dɪŋ/.' },
    },
    {
      term: 'editorial', phonetic: '/ˌedɪˈtɔːriəl/', partOfSpeech: 'adj.', sentenceIndex: 49,
      meaning: { zh: '编辑的，社论取向的', en: 'relating to the news choices and voice of a paper' },
      usage: { zh: 'editorial choices、editorial line。名词 editor 指编辑。', en: 'editorial choices, editorial line. The person is the editor.' },
      collocations: ['editorial choices', 'the editorial line', 'editorial preference'],
      example: { en: 'Advertisers can influence editorial choices.', zh: '广告商可能影响编辑选择。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈtɔː/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'quotes', phonetic: '/kwəʊts/', partOfSpeech: 'n.', sentenceIndex: 59,
      meaning: { zh: '引用的原文片段', en: 'short passages copied from a source in a study' },
      usage: { zh: '指引用的短文；short quotes、take quotes。动词 quote 表引用。', en: 'quote a short passage; the noun is quotation.' },
      collocations: ['quote short passages', 'a quoted line', 'the citation format'],
      example: { en: 'The archive allows short quotes for study.', zh: '档案允许为研究引用短段。' },
      listening: { zh: '单音节，开头 /kw/ 连读，结尾 /t/。', en: 'One syllable linking /kw/; ending /t/.' },
    },
  ],
  expressions: [
    {
      phrase: 'divide the work', sentenceIndex: 34,
      meaning: { zh: '分工，把任务拆开', en: 'to share the tasks between the two people' },
      usage: { zh: '表示把任务在两人之间拆开；divide the work between us。', en: 'divide something between; divide the work between us.' },
      example: { en: 'We divide the work into copies and coding.', zh: '我们把任务分为取件和编码。' },
    },
    {
      phrase: 'set those aside', sentenceIndex: 47,
      meaning: { zh: '单独分出，排除出某类', en: 'to keep a group apart from the main category' },
      usage: { zh: '可分短语动词；set letters aside from news articles。', en: 'Separable: set letters aside from news articles.' },
      example: { en: 'We set letters aside from news articles.', zh: '我们把读者来信排除出新闻条目。' },
    },
    {
      phrase: 'side by side', sentenceIndex: 43,
      meaning: { zh: '并排，对照着', en: 'next to each other for direct comparison' },
      usage: { zh: '方式短语；compare the titles side by side。', en: 'An adverbial: compare the titles side by side.' },
      example: { en: 'We compare the two papers side by side.', zh: '我们并排比较两份报纸。' },
    },
    {
      phrase: 'slant the whole line', sentenceIndex: 52,
      meaning: { zh: '使（报道立场）偏向一方', en: 'to make a paper’s editorial stance lean one way' },
      usage: { zh: 'slant 作动词；slant the whole line of the paper。', en: 'Slant as a verb: slant the whole line of the paper.' },
      example: { en: 'A wealthy owner may slant the paper’s line.', zh: '有钱老板可能让报纸立场偏向一方。' },
    },
    {
      phrase: 'read through', sentenceIndex: 56,
      meaning: { zh: '通读，逐页看完', en: 'to go through a list or record carefully' },
      usage: { zh: '可分短语动词；read through the archive list，代词放中间。', en: 'Separable: read through the archive list; put the pronoun in the middle.' },
      example: { en: 'I will read through the archive list tonight.', zh: '我今晚通读档案清单。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对先记说话人', en: 'Match the voice first' },
      body: {
        zh: '配对题问“谁提出哪条方案”。开头先把 Mitchell 和 Emily 的声音对上，每条意见先记说话人再记方案内容，避免两人提议混在一行。',
        en: 'Matching asks who proposed what. Match the two voices at the start, note the speaker before the proposal, and do not mix their ideas on one line.',
      },
    },
    {
      title: { zh: '被否定的方案直接排除', en: 'Rejected proposals are out' },
      body: {
        zh: 'No、rather than、separate section 之后紧跟的方案通常被否决，例如把漫画广告纳入样本、把广告式文章直接删除。听到否定词就把对应选项划掉。',
        en: 'A proposal after No, rather than or separate section is usually rejected, such as including all cartoons and adverts or deleting advert-like articles. Cross the option out at the negation.',
      },
    },
    {
      title: { zh: '多选题辨正式措施', en: 'Read the strength in multiple choice' },
      body: {
        zh: '多选题正确项往往是 We should 引出的正式研究步骤：编码日志、两份对照、记录篇幅。顾虑、背景和被排除的素材是干扰项，听到序数或建议动词时集中记录。',
        en: 'Correct multiple-choice items are the formal steps introduced by We should: the coding log, the two-title comparison and report length. Worries and excluded material are distractors; concentrate on suggestions and ordinals.',
      },
    },
  ],
};
