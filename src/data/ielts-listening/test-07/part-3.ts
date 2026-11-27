import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 7 · Part 3 — 三人评读一篇双语儿童研究论文。原创仿真材料，非官方真题。
 *
 * 讨论顺序：各自提出方法局限（配对）→ 复述主要发现（单选）→ 判断结论能否推广（单选）→
 * 动笔前还需核对的细节（单选）→ 下一轮研究的三项必改（多选）→ 下次会前分工。
 * 配对块在前，单选块居中，多选块在后，题块顺序与录音顺序一致。
 */
export const test07Part3: ListeningLesson = {
  slug: 'test-07-part-3',
  part: 3,
  status: 'published',
  title: { zh: '评读双语儿童研究', en: 'Reviewing a paper on bilingual children' },
  summary: {
    zh: '导师与两名研究生评读一篇双语儿童论文：分别指出样本来源、翻译核对、年龄范围与数据获取方式上的局限，复述主要发现，讨论结论能否推广到其他家庭，并商定下一轮研究必须做出的三项改进与会前分工。',
    en: 'A tutor and two postgraduates review a paper on bilingual children: they each raise limitations about the sample, the translation, the age range and the source of the data, restate the main finding, discuss whether the conclusion generalises, and agree on three essential changes and their tasks before the next meeting.',
  },
  accent: { zh: '导师为英式口音，Neerja 为印度口音，Aria 为美式口音。', en: 'The tutor has a British accent, Neerja an Indian accent, and Aria an American accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'tutor', label: 'TUTOR', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which criticism of the study does each person make? Choose the correct letter, A–G.',
      options: [
        { key: 'A', text: 'The sample was drawn from a single school.' },
        { key: 'B', text: 'The age range of the children was too narrow.' },
        { key: 'C', text: 'The interviewers did not follow the question list.' },
        { key: 'D', text: 'The study ignored children who speak a minority language at home.' },
        { key: 'E', text: 'The results rely on parental reports rather than direct tests.' },
        { key: 'F', text: 'The room had distractions during the sessions.' },
        { key: 'G', text: 'The tasks were not checked by a second bilingual speaker.' },
      ],
      items: [
        { number: 21, text: 'Neerja' },
        { number: 22, text: 'the tutor' },
        { number: 23, text: 'Aria' },
        { number: 24, text: 'Neerja' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What was the main finding reported in the paper?',
          options: [
            { key: 'A', text: 'Bilingual children outperform monolingual peers in all language tests.' },
            { key: 'B', text: 'There was no clear advantage in the reported tests.' },
            { key: 'C', text: 'Bilingual children switch languages more often than expected.' },
          ],
        },
        {
          number: 26,
          stem: 'Why can the conclusion not be generalised to other bilingual children?',
          options: [
            { key: 'A', text: 'The children came from similar neighbourhoods and families.' },
            { key: 'B', text: 'The tests were translated too late in the study.' },
            { key: 'C', text: 'The interviewers were not trained properly.' },
          ],
        },
        {
          number: 27,
          stem: 'What do they decide to check before writing the response?',
          options: [
            { key: 'A', text: 'whether the sample size meets the journal’s guidelines' },
            { key: 'B', text: 'whether the parents were told the study’s aim' },
            { key: 'C', text: 'whether the tasks match the children’s age group' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE improvements do they agree on for future work? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE improvements do they agree on for future work?',
      options: [
        { key: 'A', text: 'recruit children from different neighbourhoods' },
        { key: 'B', text: 'test the children directly rather than asking parents' },
        { key: 'C', text: 'extend the sessions to a second visit' },
        { key: 'D', text: 'check the translation with another bilingual speaker' },
        { key: 'E', text: 'publish the paper in an open-access journal' },
        { key: 'F', text: 'record the sessions for later review' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['E'], evidence: 8,
      explanation: {
        zh: '定位句 8：We are really measuring parental reports, not how the children actually perform。Neerja 批评数据来自家长问卷而不是直接测试，对应 E。',
        en: 'Sentence 8: "We are really measuring parental reports, not how the children actually perform". Neerja’s criticism is that the data come from a parent questionnaire rather than direct testing, matching E.',
      },
    },
    {
      number: 22, accepted: ['A'], evidence: 15,
      explanation: {
        zh: '定位句 15：You cannot tell from such a group whether the result would hold somewhere very different。导师在前一句说明儿童全部来自同一所学校、同一社区，样本来源单一对应 A。',
        en: 'Sentence 15: "You cannot tell from such a group whether the result would hold somewhere very different". The previous sentence explains all the children came from one school and neighbourhood, so the sample is single-source, matching A.',
      },
    },
    {
      number: 23, accepted: ['G'], evidence: 12,
      explanation: {
        zh: '定位句 12：There was no second bilingual speaker to go over the tasks before testing began。Aria 指出翻译任务没有第二位双语者复核，对应 G。',
        en: 'Sentence 12: "There was no second bilingual speaker to go over the tasks before testing began". Aria’s point is that the translated tasks were never checked by a second bilingual speaker, matching G.',
      },
    },
    {
      number: 24, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：the age range here was too narrow for any wider claim。Neerja 第二次发言批评四到五岁的年龄跨度太窄，对应 B。',
        en: 'Sentence 17: "the age range here was too narrow for any wider claim". Neerja’s second criticism is that the four-to-five age span is too narrow, matching B.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 29,
      explanation: {
        zh: '定位句 29：There was no clear advantage in the reported tests。前两句说分数略高、词汇测试几乎无差异，作者自己也把差距归因于家庭教育水平，对应 B。A 与 across the board 被否定相反，C 的语言切换在句 34 只是观察，不是主要发现。',
        en: 'Sentence 29: "There was no clear advantage in the reported tests". The two preceding sentences note a small edge and almost no vocabulary difference, and the authors attribute the gap to family education, matching B. A contradicts the rejected across the board reading, and C is only an observation in sentence 34.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：The children came from similar neighbourhoods and similar kinds of families, so that generalisation is weak。样本背景相近是无法推广的原因，对应 A。B 的翻译过晚和 C 的访谈员培训在录音中都未提及。',
        en: 'Sentence 32: "The children came from similar neighbourhoods and similar kinds of families, so that generalisation is weak". A similar background is why the conclusion cannot spread, matching A. Late translation and interviewer training are never mentioned.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 38,
      explanation: {
        zh: '定位句 38：A few instructions looked long for four-year-olds, and tired children would perform badly。动笔前要核对任务是否符合儿童年龄段，对应 C。A 的样本量准则在句 61 被降为次要，B 的家长知情在讨论中没有出现。',
        en: 'Sentence 38: "A few instructions looked long for four-year-olds, and tired children would perform badly". The response should check whether the tasks suit the age group, matching C. Sample size guidelines are secondary in sentence 61, and informing parents of the aim never comes up.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 44,
      explanation: {
        zh: '定位句 44：it should recruit children from different neighbourhoods, not one school or one catchment。扩大样本社区范围是三项必改之一，对应 A。C 的第二次回访在句 49 被推迟到下一轮，F 的录音在句 51 需伦理批准，都不是必改项。',
        en: 'Sentence 44: "it should recruit children from different neighbourhoods, not one school or one catchment". Widening the neighbourhoods is one of three essential changes, matching A. A second visit in sentence 49 is deferred, and recording in sentence 51 needs ethics approval first.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 45,
      explanation: {
        zh: '定位句 45：I would test the children directly, instead of asking parents to report on them。直接测试取代家长报告，对应 B，也正是 Neerja 在句 8 提出的局限。',
        en: 'Sentence 45: "I would test the children directly, instead of asking parents to report on them". Direct testing replaces parental reports, matching B and answering Neerja’s concern from sentence 8.',
      },
    },
    {
      number: 30, accepted: ['D'], evidence: 47,
      explanation: {
        zh: '定位句 47：the translated tasks need checking by another bilingual speaker before any testing starts。另找双语者复核翻译对应 D，回应 Aria 在句 12 提出的问题。E 的开放获取期刊在句 53 被明确归为出版选择，与设计无关。',
        en: 'Sentence 47: "the translated tasks need checking by another bilingual speaker before any testing starts". A second bilingual review matches D and answers Aria’s point from sentence 12. Open access publishing in sentence 53 is a publication choice, not a design change.',
      },
    },
  ],
  transcript: [
    { speaker: 'tutor', text: 'Right, let’s settle in. Have you both read the paper on bilingual children that I sent round on Monday?' },
    { speaker: 'neerja', text: 'I have. It compares children who hear two languages at home with those who hear only one.' },
    { speaker: 'aria', text: 'Me too. The sample was four-and-a-half-year-olds from two primary classes, tested during the school day.' },
    { speaker: 'neerja', text: 'It looked neat on the surface, but the methods raised several issues I would change.' },
    { speaker: 'tutor', text: 'That’s the right instinct. Before the findings, each of you should name one limitation that stood out.' },
    { speaker: 'tutor', text: 'Neerja, would you like to start?' },
    { speaker: 'neerja', text: 'Well, what bothered me most was where the information came from.' },
    { speaker: 'neerja', text: 'The team never sat down with the children themselves. Every score came from what the parents wrote on a questionnaire.' },
    { speaker: 'neerja', text: 'So we are really measuring parental reports, not how the children actually perform in the tasks.' },
    { speaker: 'tutor', text: 'That’s a fair point. Aria, what about you?' },
    { speaker: 'aria', text: 'I noticed the materials had been translated by one member of the team only.' },
    { speaker: 'aria', text: 'If that person missed a tricky word, the same error appears in every child’s score.' },
    { speaker: 'aria', text: 'There was no second bilingual speaker to go over the tasks before testing began.' },
    { speaker: 'tutor', text: 'Good. And my own concern is the sample itself.' },
    { speaker: 'tutor', text: 'All the children were recruited from one school in the same neighbourhood, where most families are professional households.' },
    { speaker: 'tutor', text: 'You cannot tell from such a group whether the result would hold somewhere very different.' },
    { speaker: 'neerja', text: 'I’d add one more. The children were all between four and five, so the study says nothing about older bilinguals.' },
    { speaker: 'neerja', text: 'A child of eight faces very different demands at school, and the age range here was too narrow for any wider claim.' },
    { speaker: 'aria', text: 'The age point is a good one. You can’t generalise from four-year-olds to teenagers.' },
    { speaker: 'tutor', text: 'Did anyone notice how the testing sessions were arranged?' },
    { speaker: 'neerja', text: 'Each child was tested in the morning, one after another, in a small room off the main hall.' },
    { speaker: 'aria', text: 'The door stayed open, though, and you could hear other children playing outside between tasks.' },
    { speaker: 'tutor', text: 'That’s a fair observation, but it affected all the children equally, so it is not the main weakness here.' },
    { speaker: 'tutor', text: 'Let’s turn to what the paper actually found.' },
    { speaker: 'tutor', text: 'What was the headline result, as you read it?' },
    { speaker: 'aria', text: 'The bilingual group scored slightly higher on two of the three tests, but the gap was small.' },
    { speaker: 'aria', text: 'On the vocabulary task there was almost no difference at all.' },
    { speaker: 'neerja', text: 'The authors themselves say the difference could be down to family education, not the home languages.' },
    { speaker: 'tutor', text: 'So how would you summarise the main finding in one sentence?' },
    { speaker: 'neerja', text: 'There was no clear advantage in the reported tests. The bilingual children did not outperform the others across the board.' },
    { speaker: 'tutor', text: 'Exactly. Now, the authors do make a wider claim in the discussion section.' },
    { speaker: 'tutor', text: 'They suggest the findings apply to bilingual children generally. Do you buy that?' },
    { speaker: 'aria', text: 'Not really. The children came from similar neighbourhoods and similar kinds of families, so that generalisation is weak.' },
    { speaker: 'neerja', text: 'I agree. A child with a minority heritage language may have a very different experience.' },
    { speaker: 'aria', text: 'Some children switch languages several times a day, which the tasks did not capture.' },
    { speaker: 'tutor', text: 'Right. Before we draft our response to the paper, what do we need to check in the methods?' },
    { speaker: 'tutor', text: 'Neerja, you flagged the parental reports. Is there anything else we should verify first?' },
    { speaker: 'neerja', text: 'We should check whether the tasks actually match the children’s age group.' },
    { speaker: 'neerja', text: 'A few instructions looked long for four-year-olds, and tired children would perform badly whatever language they spoke.' },
    { speaker: 'tutor', text: 'Good point. A task that suits a six-year-old will simply confuse a four-year-old.' },
    { speaker: 'tutor', text: 'Anything else about the materials?' },
    { speaker: 'neerja', text: 'The vocabulary task used pictures of household objects, which some children may not have seen at home.' },
    { speaker: 'aria', text: 'That ties back to the sample point. A wider sample would show whether the pictures are fair.' },
    { speaker: 'tutor', text: 'Now let’s agree what the next study in this area ought to do differently.' },
    { speaker: 'aria', text: 'First, it should recruit children from different neighbourhoods, not one school or one catchment.' },
    { speaker: 'neerja', text: 'Second, I would test the children directly, instead of asking parents to report on them.' },
    { speaker: 'tutor', text: 'That addresses your earlier concern about the questionnaire.' },
    { speaker: 'aria', text: 'And the translated tasks need checking by another bilingual speaker before any testing starts.' },
    { speaker: 'tutor', text: 'Those three I’d put in the must-do list.' },
    { speaker: 'neerja', text: 'What about holding a second visit, so the children are not tested once and never again?' },
    { speaker: 'tutor', text: 'That’s worth considering, but with a larger sample it may have to wait for a later round.' },
    { speaker: 'aria', text: 'Recording the sessions would help us check what the interviewer actually said.' },
    { speaker: 'tutor', text: 'Possibly, though the ethics committee would have to approve it first.' },
    { speaker: 'neerja', text: 'I had wondered about an open-access journal, but that concerns where we publish, not the design.' },
    { speaker: 'tutor', text: 'Correct. That can be decided much later.' },
    { speaker: 'neerja', text: 'Should we ask parents about the home language, rather than the school register?' },
    { speaker: 'tutor', text: 'That fits with recruiting a wider sample, so fold it into your note on the neighbourhoods.' },
    { speaker: 'tutor', text: 'Now, what will each of you do before our next meeting?' },
    { speaker: 'neerja', text: 'I’ll read the methods section again and list every place the sample description is too vague.' },
    { speaker: 'aria', text: 'I’ll look for studies that compared children from mixed neighbourhoods, so we have something to cite.' },
    { speaker: 'tutor', text: 'I’ll draft the opening paragraph, setting out the four limitations we have agreed on.' },
    { speaker: 'neerja', text: 'Should we check the journal’s sample size guidelines while we are at it?' },
    { speaker: 'tutor', text: 'We can, but that is secondary to the design issues. Let’s keep the response focused on what can be changed.' },
    { speaker: 'aria', text: 'Fine. I’ll bring the comparison studies to Thursday’s meeting.' },
    { speaker: 'tutor', text: 'Good. That should give us enough to write a solid review.' },
  ],
  vocabulary: [
    {
      term: 'bilingual', phonetic: '/baɪˈlɪŋɡwəl/', partOfSpeech: 'adj.', sentenceIndex: 0,
      meaning: { zh: '双语的；会说两种语言的', en: 'speaking or using two languages' },
      usage: { zh: '可作定语或表语：bilingual children、a bilingual household。名词是 bilingualism。', en: 'Attributive or predicative: bilingual children. The noun is bilingualism.' },
      collocations: ['bilingual children', 'a bilingual household', 'bilingual education'],
      example: { en: 'Bilingual children often switch between words in the two languages.', zh: '双语儿童常常在两种语言的词之间切换。' },
      listening: { zh: '重音在第二音节 /ˈlɪŋ/；开头 /baɪ/ 是双元音。', en: 'Stress the second syllable; the opening /baɪ/ is a diphthong.' },
    },
    {
      term: 'questionnaire', phonetic: '/ˌkwestʃəˈneə/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '问卷', en: 'a set of written questions used to collect information' },
      usage: { zh: '可数名词；fill in a questionnaire、design a questionnaire。', en: 'Countable: fill in a questionnaire, design a questionnaire.' },
      collocations: ['a parental questionnaire', 'complete a questionnaire', 'a questionnaire survey'],
      example: { en: 'Parents completed a short questionnaire after the session.', zh: '家长在活动结束后填写了一份简短问卷。' },
      listening: { zh: '四个音节，重音在第三个 /ˈneə/，不要读成 question 加 nair。', en: 'Four syllables with stress on the third; do not read it as question plus nair.' },
    },
    {
      term: 'parental', phonetic: '/pəˈrentl/', partOfSpeech: 'adj.', sentenceIndex: 8,
      meaning: { zh: '家长的，父母一方的', en: 'relating to a parent or parents' },
      usage: { zh: '只作定语：parental reports、parental consent。名词是 parent。', en: 'Attributive only: parental reports, parental consent. The noun is parent.' },
      collocations: ['parental reports', 'parental consent', 'parental involvement'],
      example: { en: 'The study relied on parental reports rather than child tests.', zh: '该研究依赖家长报告，而非儿童测试结果。' },
      listening: { zh: '重音在第二音节 /ˈrent/；开头 /pə/ 很弱。', en: 'Stress the second syllable; the opening /pə/ is weak.' },
    },
    {
      term: 'recruited', phonetic: '/rɪˈkruːtɪd/', partOfSpeech: 'v.', sentenceIndex: 14,
      meaning: { zh: '招募，征集（参与者）', en: 'invited people to take part in a study' },
      usage: { zh: '研究场景高频；recruit participants、recruit from a school。', en: 'Common in research: recruit participants, recruit from a school.' },
      collocations: ['recruited from', 'recruit participants', 'recruit volunteers'],
      example: { en: 'Participants were recruited from three local primary schools.', zh: '参与者从三所本地小学招募。' },
      listening: { zh: '重音在第二音节 /ˈkruːt/；结尾 -ed 读 /ɪd/。', en: 'Stress the second syllable; the ending -ed is /ɪd/.' },
    },
    {
      term: 'vocabulary', phonetic: '/vəˈkæbjələri/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '词汇（量）', en: 'the words known or tested in a language' },
      usage: { zh: '不可数；a vocabulary task、test vocabulary。', en: 'Uncountable: a vocabulary task, test vocabulary.' },
      collocations: ['a vocabulary task', 'active vocabulary', 'limited vocabulary'],
      example: { en: 'The vocabulary task used pictures of everyday objects.', zh: '词汇任务使用日常物品的图片。' },
      listening: { zh: '五个音节，重音在第二个 /ˈkæb/。', en: 'Five syllables with stress on the second.' },
    },
    {
      term: 'generalisation', phonetic: '/ˌdʒenrəlaɪˈzeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '推广，概括（把结论用于更大范围）', en: 'extending a finding to groups or settings not studied' },
      usage: { zh: '不可数或可数；动词是 generalise。weak generalisation 指推广依据不足。', en: 'The verb is generalise; a weak generalisation lacks support.' },
      collocations: ['a weak generalisation', 'make a generalisation', 'generalisation from the sample'],
      example: { en: 'The generalisation from such a small sample is hard to defend.', zh: '从这么小的样本做推广很难站得住脚。' },
      listening: { zh: '重音在最后一个 /ˈzeɪ/，前面的音节连读。', en: 'Stress the final /ˈzeɪ/; the earlier syllables run together.' },
    },
    {
      term: 'catchment', phonetic: '/ˈkætʃmənt/', partOfSpeech: 'n.', sentenceIndex: 44,
      meaning: { zh: '（学校的）招生片区', en: 'the area from which a school takes its pupils' },
      usage: { zh: '教育场景；school catchment、one catchment。本义是集水区。', en: 'School catchment; the literal sense is a drainage basin.' },
      collocations: ['one catchment', 'the school catchment', 'catchment area'],
      example: { en: 'Children from outside the catchment had to apply separately.', zh: '片区外的孩子需要单独申请。' },
      listening: { zh: '两个音节，重音在第一个；/tʃ/ 要读清楚。', en: 'Two syllables with first-syllable stress; listen for the /tʃ/.' },
    },
    {
      term: 'vague', phonetic: '/veɪɡ/', partOfSpeech: 'adj.', sentenceIndex: 58,
      meaning: { zh: '含糊的，不具体的', en: 'not clear or detailed enough' },
      usage: { zh: '形容描述、说明；a vague description、vague sample description。', en: 'Describes descriptions or accounts: a vague description.' },
      collocations: ['too vague', 'a vague description', 'vague details'],
      example: { en: 'The methods section gives only a vague description of the sample.', zh: '方法部分对样本的描述很含糊。' },
      listening: { zh: '单音节，元音是 /eɪ/，结尾 /ɡ/ 不要漏。', en: 'One syllable with /eɪ/; do not drop the final /ɡ/.' },
    },
  ],
  expressions: [
    {
      phrase: 'stood out', sentenceIndex: 4,
      meaning: { zh: '突出，引人注目', en: 'to be clearly noticeable among other points' },
      usage: { zh: 'stand out 的过去式；常与 limitation、problem、difference 搭配。', en: 'Past of stand out; often with limitation, problem or difference.' },
      example: { en: 'One weakness in the design stood out above the rest.', zh: '设计里有一处缺陷比其他问题更突出。' },
    },
    {
      phrase: 'down to', sentenceIndex: 27,
      meaning: { zh: '归因于，是……的结果', en: 'caused by or due to' },
      usage: { zh: 'the difference could be down to something；口语里表示原因。', en: 'The difference could be down to something, meaning due to.' },
      example: { en: 'The score gap may be down to home background rather than language.', zh: '分数差距可能源于家庭背景，而非语言。' },
    },
    {
      phrase: 'outperform', sentenceIndex: 29,
      meaning: { zh: '胜过，表现优于', en: 'to do better than someone else' },
      usage: { zh: '及物动词；outperform peers、outperform the other group。', en: 'Transitive: outperform peers or the other group.' },
      example: { en: 'The treated group did not outperform the control group.', zh: '处理组的表现没有优于对照组。' },
    },
    {
      phrase: 'buy that', sentenceIndex: 31,
      meaning: { zh: '相信，接受（说法）', en: 'to accept that an argument is true' },
      usage: { zh: '口语表达；否定句 I don’t buy that 表示不认同。', en: 'Spoken: I don’t buy that means I disagree.' },
      example: { en: 'I don’t buy that the result applies to every child.', zh: '我不认为这个结果适用于每个孩子。' },
    },
    {
      phrase: 'flagged', sentenceIndex: 36,
      meaning: { zh: '指出，标记出（问题）', en: 'marked a point as needing attention' },
      usage: { zh: '动词 flag 的过去式；flag a problem、flag a concern。', en: 'Past of flag: flag a problem or a concern.' },
      example: { en: 'She flagged the questionnaire bias in her notes.', zh: '她在笔记里标出了问卷偏差问题。' },
    },
    {
      phrase: 'fold it into', sentenceIndex: 56,
      meaning: { zh: '并入，纳入（已有内容）', en: 'to add a point into an existing note or section' },
      usage: { zh: 'fold something into a note、into a plan；表示把新观点收进原有条目。', en: 'Fold something into a note or plan, absorbing a new point.' },
      example: { en: 'Fold that suggestion into your draft before Friday.', zh: '周五前把这条建议并入你的草稿。' },
    },
    {
      phrase: 'secondary to', sentenceIndex: 62,
      meaning: { zh: '次于，在……之后考虑', en: 'less important than something else' },
      usage: { zh: 'be secondary to something；与 primary 相对。', en: 'Be secondary to something; the opposite of primary.' },
      example: { en: 'Publishing choices are secondary to the design issues.', zh: '出版选择次于设计问题，应排在后面考虑。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先记说话人，再记批评点', en: 'Match the voice before the criticism' },
      body: {
        zh: 'Part 3 配对题问“谁说了哪条局限”。开场就把导师、Neerja、Aria 的声音和名字对上；每条批评先写说话人，再写内容，避免只记观点导致张冠李戴。',
        en: 'Matching items ask who said which limitation. Match voices to names early; for each point write the speaker first, then the criticism, so opinions do not get attached to the wrong person.',
      },
    },
    {
      title: { zh: '区分“必改”与“可以以后再说”', en: 'Essential versus later rounds' },
      body: {
        zh: '多选题考语气强弱：must-do、first、second 是必选项；worth considering、may wait、ethics approval first、where we publish 都是被推迟或被排除的内容。落笔前先在选项旁标出强弱。',
        en: 'Multiple choice turns on strength: must-do, first and second are firm; worth considering, may wait, ethics approval first and where we publish are deferred or excluded. Mark the strength beside each option first.',
      },
    },
    {
      title: { zh: '注意被提到但被否定的选项', en: 'Watch options mentioned but rejected' },
      body: {
        zh: '句 21–22 提到房间有噪音，但导师说对所有孩子影响相同、不算主要缺陷；这类“被讨论又被驳回”的点常做干扰项。听到 but、not the main weakness 时，在对应选项旁标注否定。',
        en: 'Sentences 21 and 22 mention room noise, but the tutor says it affected everyone equally and is not the main weakness. Such discussed-then-rejected points are typical distractors. Mark a rejection beside options after but or not the main weakness.',
      },
    },
  ],
};
