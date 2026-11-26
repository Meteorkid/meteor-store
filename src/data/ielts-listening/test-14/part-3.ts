import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 14 · Part 3 — 食品标签问卷设计（师生讨论，两人）。原创仿真材料，非官方真题。
 *
 * 讨论先分工（题目措辞、选项互斥、预测试、发放渠道），再谈措辞模糊、预测试目的、
 * 回收率最高的渠道，最后列出导师建议的三项准备。
 */
export const test14Part3: ListeningLesson = {
  slug: 'test-14-part-3',
  part: 3,
  status: 'published',
  title: { zh: '食品标签问卷设计', en: 'Planning a questionnaire on food labels' },
  summary: {
    zh: '学生与导师敲定食品标签问卷的分工：谁起草题目措辞、谁核对选项互斥、谁组织十名顾客的预测试、谁定发放渠道；随后讨论模糊用词、预测试目的、回收率最高的渠道，以及导师建议的三项准备。',
    en: 'A student and tutor divide the work on a food label questionnaire: who drafts the wording, who checks the options for overlap, who runs the ten-shopper pilot, and who chooses the channels. They then discuss vague wording, the pilot’s purpose, the highest-return channel, and three preparations the tutor recommends.',
  },
  accent: { zh: '学生为澳式口音，导师为英式口音。', en: 'The student has an Australian accent; the tutor has a British accent.' },
  speechRate: '+3%',
  cast: [
    { id: 'student', label: 'STUDENT', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'tutor', label: 'TUTOR', gender: 'male', voice: 'en-GB-ThomasNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Which task matches each person? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'drafts the wording of the questions' },
        { key: 'B', text: 'checks that options do not overlap' },
        { key: 'C', text: 'runs the pilot with ten shoppers' },
        { key: 'D', text: 'chooses the distribution channels' },
        { key: 'E', text: 'analyses the returned questionnaires' },
        { key: 'F', text: 'writes the ethics note' },
      ],
      items: [
        { number: 21, text: 'the student' },
        { number: 22, text: 'the tutor' },
        { number: 23, text: 'the student’s classmate' },
        { number: 24, text: 'the whole group' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'Why must the label questions avoid vague words such as "healthy"?',
          options: [
            { key: 'A', text: 'Shoppers interpret such words in different ways.' },
            { key: 'B', text: 'The words are too long to read on a label.' },
            { key: 'C', text: 'The words attract biased answers from certain shoppers.' },
          ],
        },
        {
          number: 26,
          stem: 'What is the main purpose of the pilot?',
          options: [
            { key: 'A', text: 'to recruit a larger number of respondents' },
            { key: 'B', text: 'to spot unclear questions before the full launch' },
            { key: 'C', text: 'to compare the designs of different labels' },
          ],
        },
        {
          number: 27,
          stem: 'Which channel does the tutor expect to give the highest return rate?',
          options: [
            { key: 'A', text: 'email sent to students' },
            { key: 'B', text: 'paper forms handed out in supermarkets' },
            { key: 'C', text: 'links posted on social media' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE preparations does the tutor recommend before the pilot? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE preparations does the tutor recommend?',
      options: [
        { key: 'A', text: 'ask shoppers how often they read labels' },
        { key: 'B', text: 'keep the questionnaire under ten questions' },
        { key: 'C', text: 'offer a small reward for completion' },
        { key: 'D', text: 'translate every label into three languages' },
        { key: 'E', text: 'run the pilot twice with different shoppers' },
        { key: 'F', text: 'record the age range of respondents' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 2,
      explanation: {
        zh: '定位句 2：I can draft the wording of the questions first, so the rest can build on that。学生起草题目措辞，对应 A。',
        en: 'Sentence 2: "I can draft the wording of the questions first, so the rest can build on that". The student drafts the wording, matching A.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 3,
      explanation: {
        zh: '定位句 3：I’ll look over the draft and check that the answer options do not overlap。导师核对选项是否互斥，对应 B。',
        en: 'Sentence 3: "I’ll look over the draft and check that the answer options do not overlap". The tutor checks the options do not overlap, matching B.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 7,
      explanation: {
        zh: '定位句 7：Ask your classmate to run the pilot with ten shoppers from the campus shop。同学负责十名顾客的预测试，对应 C。',
        en: 'Sentence 7: "Ask your classmate to run the pilot with ten shoppers from the campus shop". The classmate runs the pilot, matching C.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 9,
      explanation: {
        zh: '定位句 9：The whole group should choose the distribution channels together。发放渠道由全组共同决定，对应 D。',
        en: 'Sentence 9: "The whole group should choose the distribution channels together". The group chooses the channels, matching D.',
      },
    },
    {
      number: 25, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：Shoppers interpret healthy in different ways。模糊词被不同人理解成不同含义；篇幅长和回答偏向在全段没有依据。',
        en: 'Sentence 16: "Shoppers interpret healthy in different ways". Vague words are read differently by different shoppers; length and bias have no basis here.',
      },
    },
    {
      number: 26, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：Its main purpose is to spot unclear questions before the full launch。预测试主要用于正式发放前发现表述不清的题目；扩大样本和比较标签设计都不是它的目的。',
        en: 'Sentence 21: "Its main purpose is to spot unclear questions before the full launch". The pilot catches unclear questions before launch; recruiting more respondents and comparing label designs are not its purpose.',
      },
    },
    {
      number: 27, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：Paper forms handed out in supermarkets usually give the highest return rate。超市纸质表回收率最高；邮件便于追踪但回复率低，社交链接易被忽略。',
        en: 'Sentence 26: "Paper forms handed out in supermarkets usually give the highest return rate". Paper forms in supermarkets have the highest return; email is easy to track but replies lag, and social links are ignored.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 31,
      explanation: {
        zh: '定位句 31：First, ask shoppers how often they actually read food labels。第一项准备是询问顾客看标签的频率，对应 A。',
        en: 'Sentence 31: "First, ask shoppers how often they actually read food labels". The first preparation is asking how often labels are read, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 33,
      explanation: {
        zh: '定位句 33：Second, keep the questionnaire under ten questions, or people will drop off。第二项是把问卷控制在十题以内，对应 B。',
        en: 'Sentence 33: "Second, keep the questionnaire under ten questions, or people will drop off". The second preparation is keeping the questionnaire under ten questions, matching B.',
      },
    },
    {
      number: 30, accepted: ['F'], evidence: 35,
      explanation: {
        zh: '定位句 35：Third, record the age range of each respondent, so we can compare groups later。第三项是记录受访者年龄段，对应 F。奖励只是可选，翻译三语和二次预测试被否定。',
        en: 'Sentence 35: "Third, record the age range of each respondent, so we can compare groups later". The third preparation is recording the age range, matching F. A reward is optional, and three-language translation and a second pilot are rejected.',
      },
    },
  ],
  transcript: [
    { speaker: 'student', text: 'Thanks for making time. I’ve brought the draft questions for the food label survey.' },
    { speaker: 'tutor', text: 'Good. Let’s start by dividing the work between us and your classmate.' },
    { speaker: 'student', text: 'I can draft the wording of the questions first, so the rest can build on that.' },
    { speaker: 'tutor', text: 'I’ll look over the draft and check that the answer options do not overlap.' },
    { speaker: 'student', text: 'Does that mean each option should cover a separate situation?' },
    { speaker: 'tutor', text: 'Exactly. If two choices describe the same behaviour, the question does not measure anything.' },
    { speaker: 'student', text: 'What about the pilot before we send it out?' },
    { speaker: 'tutor', text: 'Ask your classmate to run the pilot with ten shoppers from the campus shop.' },
    { speaker: 'student', text: 'And how should we get the final forms back?' },
    { speaker: 'tutor', text: 'The whole group should choose the distribution channels together, so we reach both students and shoppers.' },
    { speaker: 'student', text: 'I’m glad the channels are a group decision; I don’t want to choose on my own.' },
    { speaker: 'student', text: 'I’ve listed the five product types we want to cover.' },
    { speaker: 'tutor', text: 'Keep that list short; too many products stretches the interview.' },
    { speaker: 'student', text: 'Right. Now, a few questions about the wording itself.' },
    { speaker: 'tutor', text: 'Go ahead.' },
    { speaker: 'student', text: 'I used the word healthy in two of the label questions.' },
    { speaker: 'tutor', text: 'That’s the kind of vague word we want to avoid. Shoppers interpret healthy in different ways.' },
    { speaker: 'student', text: 'So I should replace it with something more specific?' },
    { speaker: 'tutor', text: 'Yes, name the feature you actually want to measure, such as sugar or salt content.' },
    { speaker: 'student', text: 'Sugar and salt are printed on most labels anyway, so the answers will be concrete.' },
    { speaker: 'student', text: 'What is the pilot meant to achieve, exactly?' },
    { speaker: 'tutor', text: 'Its main purpose is to spot unclear questions before the full launch.' },
    { speaker: 'student', text: 'Will the pilot also give us a larger sample?' },
    { speaker: 'tutor', text: 'No, ten shoppers are enough to catch wording problems, not to draw conclusions.' },
    { speaker: 'tutor', text: 'The conclusions come later, from the full sample.' },
    { speaker: 'student', text: 'Which channel do you expect to bring back the most forms?' },
    { speaker: 'tutor', text: 'Paper forms handed out in supermarkets usually give the highest return rate.' },
    { speaker: 'student', text: 'Email to students is easier to track, though.' },
    { speaker: 'tutor', text: 'It works for the campus sample, but online links tend to be ignored after the first message.' },
    { speaker: 'student', text: 'So we may need reminders to those who don’t reply first time.' },
    { speaker: 'student', text: 'What else should we prepare before the pilot?' },
    { speaker: 'tutor', text: 'First, ask shoppers how often they actually read food labels.' },
    { speaker: 'student', text: 'That gives us a baseline before we ask about specific products.' },
    { speaker: 'tutor', text: 'Second, keep the questionnaire under ten questions, or people will drop off.' },
    { speaker: 'student', text: 'I can trim the two repeated items I noticed.' },
    { speaker: 'tutor', text: 'Third, record the age range of each respondent, so we can compare groups later.' },
    { speaker: 'student', text: 'Should we offer a reward for finishing?' },
    { speaker: 'tutor', text: 'A small reward helps, but it is optional this term; do not make it the main incentive.' },
    { speaker: 'student', text: 'Do we need to translate every label into three languages?' },
    { speaker: 'tutor', text: 'No, that is outside this project. The forms can stay in English.' },
    { speaker: 'student', text: 'And should the pilot be run twice?' },
    { speaker: 'tutor', text: 'One pilot round is enough for this stage. You can repeat it if the answers stay unclear.' },
    { speaker: 'tutor', text: 'A second round only if the first leaves real ambiguity.' },
    { speaker: 'tutor', text: 'Let’s look at the answer options next.' },
    { speaker: 'student', text: 'I’ll check the wording against the campus shop products.' },
    { speaker: 'tutor', text: 'Good. Most shoppers there read labels for snack items.' },
    { speaker: 'student', text: 'Should we record how long each interview takes?' },
    { speaker: 'tutor', text: 'That helps us judge the length later, but it is not a required field.' },
    { speaker: 'student', text: 'Will anyone else see the completed forms?' },
    { speaker: 'tutor', text: 'Only the research group, and the answers stay anonymous.' },
    { speaker: 'student', text: 'I should mention that on the front sheet.' },
    { speaker: 'tutor', text: 'Yes, a short note on confidentiality belongs at the top.' },
    { speaker: 'student', text: 'I’ll mark any overlap I find and come back to you.' },
    { speaker: 'student', text: 'I’ll keep a short note of each change I make.' },
    { speaker: 'tutor', text: 'Fine. The ethics note can wait until the questions are fixed.' },
    { speaker: 'student', text: 'Who writes the ethics note, then?' },
    { speaker: 'tutor', text: 'I’ll draft it after the pilot, so we can describe the real sample.' },
    { speaker: 'student', text: 'And the analysis of the returned forms?' },
    { speaker: 'tutor', text: 'You and your classmate can split that once the data comes in.' },
    { speaker: 'tutor', text: 'Split the data by question type before you compare answers.' },
    { speaker: 'student', text: 'When do you want the revised draft?' },
    { speaker: 'tutor', text: 'By the middle of next week, so the pilot can run before the holiday.' },
    { speaker: 'student', text: 'Understood. I’ll tidy the wording tonight.' },
    { speaker: 'student', text: 'The campus shop manager already agreed to let us speak to shoppers.' },
    { speaker: 'tutor', text: 'That saves us one letter of permission.' },
    { speaker: 'tutor', text: 'Good. Bring the marked options when you next meet.' },
  ],
  vocabulary: [
    {
      term: 'questionnaire', phonetic: '/ˌkwestʃəˈneə(r)/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '问卷', en: 'a set of written questions for collecting survey data' },
      usage: { zh: '可数；run a questionnaire、a short questionnaire。', en: 'Countable: run a questionnaire, a short questionnaire.' },
      collocations: ['the questionnaire', 'run a questionnaire', 'a questionnaire on labels'],
      example: { en: 'Keep the questionnaire under ten questions.', zh: '问卷题目控制在十题以内。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈneə/；开头 /kw/。', en: 'Four syllables with stress on the third; the opening is /kw/.' },
    },
    {
      term: 'respondent', phonetic: '/rɪˈspɒndənt/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '受访者，填写问卷的人', en: 'a person who answers a survey or interview' },
      usage: { zh: '可数；each respondent、respondent group。动词 respond。', en: 'Countable: each respondent, respondent group. The verb is respond.' },
      collocations: ['each respondent', 'the respondent group', 'recruit respondents'],
      example: { en: 'Record the age range of each respondent.', zh: '记录每位受访者的年龄段。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈspɒn/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'pilot', phonetic: '/ˈpaɪlət/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '预测试，小范围试用', en: 'a small test run of a survey before the full version' },
      usage: { zh: '可数；run the pilot、pilot round、pilot study。', en: 'Countable: run the pilot, pilot round, pilot study.' },
      collocations: ['run the pilot', 'the pilot round', 'a pilot test'],
      example: { en: 'The pilot runs with ten shoppers before the full survey.', zh: '正式调查前先用十名顾客做预测试。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpaɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'overlap', phonetic: '/ˌəʊvəˈlæp/', partOfSpeech: 'v.', sentenceIndex: 3,
      meaning: { zh: '重叠，相互包含', en: 'to cover the same ground as another option' },
      usage: { zh: '及物动词；options overlap、check the overlap。名词同形。', en: 'Transitive: options overlap, check the overlap. The noun shares the form.' },
      collocations: ['options overlap', 'check the overlap', 'no overlap between choices'],
      example: { en: 'Check that the answer options do not overlap.', zh: '核对答案选项之间不要相互包含。' },
      listening: { zh: '动词重音在第二音节 /ˈlæp/；名词重音在前。', en: 'Verb stress on the second; the noun stresses the first.' },
    },
    {
      term: 'channels', phonetic: '/ˈtʃænlz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '渠道，发放途径', en: 'the way a survey reaches its audience' },
      usage: { zh: '可数；distribution channel、online channel。', en: 'Countable: distribution channel, online channel.' },
      collocations: ['distribution channels', 'an online channel', 'the survey channel'],
      example: { en: 'The group chooses the distribution channels together.', zh: '全组共同决定发放渠道。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtʃæn/；结尾 /nl/。', en: 'Two syllables with stress on the first; the ending is /nl/.' },
    },
    {
      term: 'vague', phonetic: '/veɪɡ/', partOfSpeech: 'adj.', sentenceIndex: 16,
      meaning: { zh: '模糊的，含义不清的', en: 'not precise, open to different interpretations' },
      usage: { zh: '定语或表语；vague word、vague answer。', en: 'Attributive or predicative: vague word, vague answer.' },
      collocations: ['a vague word', 'vague wording', 'too vague to measure'],
      example: { en: 'Healthy is a vague word that shoppers read differently.', zh: 'healthy 是个模糊词，顾客理解各不相同。' },
      listening: { zh: '单音节 /veɪɡ/，结尾 /ɡ/ 要读出。', en: 'One syllable /veɪɡ/; pronounce the final /ɡ/.' },
    },
    {
      term: 'baseline', phonetic: '/ˈbeɪslaɪn/', partOfSpeech: 'n.', sentenceIndex: 32,
      meaning: { zh: '基线，调查前的参照数据', en: 'the starting figure used to compare later results' },
      usage: { zh: '可数；establish a baseline、baseline data。', en: 'Countable: establish a baseline, baseline data.' },
      collocations: ['a baseline', 'the baseline figure', 'baseline data'],
      example: { en: 'The reading frequency gives us a baseline for later questions.', zh: '阅读频率为后续题目提供基线。' },
      listening: { zh: '复合词 base + line，重音在第一音节。', en: 'Compound base plus line, stress on the first.' },
    },
    {
      term: 'anonymous', phonetic: '/əˈnɒnɪməs/', partOfSpeech: 'adj.', sentenceIndex: 49,
      meaning: { zh: '匿名的', en: 'with the respondent’s name withheld' },
      usage: { zh: '表语或定语；answers stay anonymous、anonymous form。', en: 'Predicative or attributive: answers stay anonymous, anonymous form.' },
      collocations: ['stay anonymous', 'an anonymous respondent', 'anonymous answers'],
      example: { en: 'The completed forms stay anonymous.', zh: '填好的问卷保持匿名。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈnɒ/。', en: 'Four syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'dividing the work', sentenceIndex: 1,
      meaning: { zh: '分工', en: 'to split the tasks between people' },
      usage: { zh: '后接 between us；divide the work between the group。', en: 'Follow with between us: divide the work between the group.' },
      example: { en: 'Let’s divide the work between us and your classmate.', zh: '我们和你的同学把分工定下来。' },
    },
    {
      phrase: 'look over', sentenceIndex: 3,
      meaning: { zh: '通读，审阅', en: 'to read through and check a draft' },
      usage: { zh: '可分短语动词；look over the draft。', en: 'Separable: look over the draft.' },
      example: { en: 'I’ll look over the draft and check the options.', zh: '我会通读草稿并核对选项。' },
    },
    {
      phrase: 'spot unclear questions', sentenceIndex: 21,
      meaning: { zh: '发现表述不清的题目', en: 'to identify questions that shoppers find hard to answer' },
      usage: { zh: 'spot 此处是“发现”；spot unclear wording。', en: 'Here spot means identify: spot unclear wording.' },
      example: { en: 'The pilot spots unclear questions before the launch.', zh: '预测试在正式发放前找出含糊题目。' },
    },
    {
      phrase: 'drop off', sentenceIndex: 33,
      meaning: { zh: '中途放弃（填写）', en: 'to stop completing a long form' },
      usage: { zh: '不及物短语动词；people drop off、completion drops off。', en: 'Intransitive: people drop off, completion drops off.' },
      example: { en: 'People drop off if the questionnaire runs past ten questions.', zh: '问卷超过十题，填写者就会中途放弃。' },
    },
    {
      phrase: 'split that', sentenceIndex: 58,
      meaning: { zh: '分头承担那件事', en: 'to divide a task between two people' },
      usage: { zh: 'split 后接任务；split the analysis。', en: 'Split takes the task: split the analysis.' },
      example: { en: 'You can split the analysis once the data comes in.', zh: '数据回来后你们可以分头分析。' },
    },
    {
      phrase: 'belongs at the top', sentenceIndex: 51,
      meaning: { zh: '应放在开头位置', en: 'should be placed at the beginning of the form' },
      usage: { zh: 'belong 此处表示“位置应当在”；a note belongs at the top。', en: 'Here belong means be positioned: a note belongs at the top.' },
      example: { en: 'A confidentiality note belongs at the top of the sheet.', zh: '保密说明应放在表单开头。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题按分工信号词记', en: 'For matching, follow who-owns-what' },
      body: {
        zh: '第 21–24 题把任务和人配对。讨论开场先分工，每句主语后紧跟动词短语（draft wording、check overlap、run pilot、choose channels）；听到人名或角色就在题号旁标记，再对上选项。',
        en: 'Items 21 to 24 pair tasks with people. The work is divided first, and each subject is followed by a verb phrase: draft wording, check overlap, run pilot, choose channels. Mark the role beside the number, then match the phrase to a letter.',
      },
    },
    {
      title: { zh: '多选题区分建议与可选项', en: 'For multi-select, split recommendations from extras' },
      body: {
        zh: '第 28–30 题选三项导师明确建议的准备。奖励被说成 optional，翻译三语和二次预测试被直接否定；被淡化或否定的选项先划掉，剩下三项即答案。',
        en: 'Items 28 to 30 ask for three recommended preparations. The reward is called optional, and three-language translation and a second pilot are rejected. Cross out softened or rejected options first; the remaining three are the answers.',
      },
    },
    {
      title: { zh: '问卷题听目的与渠道', en: 'For survey questions, listen for purpose and channel' },
      body: {
        zh: '第 26 题问预测试目的，答案在 main purpose 之后；第 27 题问回收率最高的渠道，答案在 highest return rate 之后。学术讨论中 purpose、main aim、channel、return rate 这些名词常直接引出答案。',
        en: 'Item 26 asks the pilot purpose, answered after main purpose; item 27 asks the highest-return channel, answered after highest return rate. In discussion talks, nouns such as purpose, main aim, channel and return rate often lead straight to the answer.',
      },
    },
  ],
};
