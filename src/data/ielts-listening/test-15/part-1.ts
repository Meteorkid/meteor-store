import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 15 · Part 1 — 咨询夜校陶艺课程（双人对话，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 生活咨询类对话：上课日与课时、费用包含范围、考核方式、缺课补课、课程费与材料费、
 * 报名截止与缴费地点。单选 4–6 分别考费用包含、考核形式与缺课安排，干扰项把工具、
 * 笔试和课程演讲混在一起。
 */
export const test15Part1: ListeningLesson = {
  slug: 'test-15-part-1',
  part: 1,
  status: 'published',
  title: { zh: '咨询夜校课程', en: 'Enquiring about a night class' },
  summary: {
    zh: '学生致电社区学院咨询晚间陶艺课程：上课日期与时长、每节课时、费用包含什么、期末如何考核、缺课能否补课，以及课程费、材料费、报名截止日和缴费地点。',
    en: 'A student phones the community college about an evening pottery class: the day and length of the course, the length of each session, what the fee covers, how the final work is assessed, catch-up for missed evenings, the course and materials fees, the enrolment deadline and where to pay.',
  },
  accent: { zh: '两位说话人均为新西兰口音。', en: 'Both speakers use New Zealand accents.' },
  speechRate: '+2%',
  cast: [
    { id: 'adviser', label: 'ADVISER', gender: 'female', voice: 'en-NZ-MollyNeural' },
    { id: 'student', label: 'STUDENT', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Course meets on', cells: [[{ blank: 1 }, { text: ' evening' }]] },
        { lead: 'Course runs for', cells: [[{ blank: 2 }, { text: ' weeks' }]] },
        { lead: 'Each session lasts', cells: [[{ blank: 3 }, { text: ' hours' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 4,
          stem: 'What does the course fee include?',
          options: [
            { key: 'A', text: 'all clay and glazes for the term' },
            { key: 'B', text: 'shared studio tools and the tutor’s time' },
            { key: 'C', text: 'a personal set of modelling tools to take home' },
          ],
        },
        {
          number: 5,
          stem: 'How is the final work assessed?',
          options: [
            { key: 'A', text: 'a written exam on pottery history' },
            { key: 'B', text: 'a portfolio of finished pieces with tutor comments' },
            { key: 'C', text: 'a presentation to the whole class' },
          ],
        },
        {
          number: 6,
          stem: 'What arrangement exists if a student misses an evening?',
          options: [
            { key: 'A', text: 'short Saturday catch-up slots are available' },
            { key: 'B', text: 'the person must repeat the whole term' },
            { key: 'C', text: 'the tutor sends a recorded lesson' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Course fee', cells: [[{ blank: 7 }, { text: ' dollars' }]] },
        { lead: 'Materials fee', cells: [[{ blank: 8 }, { text: ' dollars' }]] },
        { lead: 'Most people pay at the', cells: [[{ blank: 9 }]] },
        { lead: 'Enrolment closes', cells: [[{ blank: 10 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Thursday'], evidence: 3,
      explanation: {
        zh: '定位句 3：it runs for eight weeks, every Thursday evening。课程固定在周四晚；句 2 只问何时开始，没有给具体星期。',
        en: 'Sentence 3: "it runs for eight weeks, every Thursday evening". The course meets on Thursday evenings. Sentence 2 only asks when it starts and gives no day of the week.',
      },
    },
    {
      number: 2, accepted: ['eight', '8'], evidence: 3,
      explanation: {
        zh: '定位句 3：it runs for eight weeks。空格后已印 weeks，填数字 eight；句 31 的 sixteen 是班级人数，不是课程周数，属于干扰数字。',
        en: 'Sentence 3: "it runs for eight weeks". Weeks is already printed, so write the number eight. The sixteen places in sentence 31 are the class size, a distractor for the course length.',
      },
    },
    {
      number: 3, accepted: ['two', '2'], evidence: 5,
      explanation: {
        zh: '定位句 5：Two hours, from seven until nine。每节两小时；句 5 的 seven 到 nine 是起止钟点，不是课时数。',
        en: 'Sentence 5: "Two hours, from seven until nine". Each session lasts two hours. Seven and nine are the start and finish times, not the length itself.',
      },
    },
    {
      number: 4, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：The fee covers the tutor time and the shared tools in the studio。费用含指导时间与共用工具，对应 B；A 把陶土釉料说成含在学费里，它们走材料费；C 的个人工具句 13 明确要另购。',
        en: 'Sentence 11: "The fee covers the tutor time and the shared tools in the studio", which matches B. Clay and glazes in A are paid through the materials fee, and the personal tools in C must be bought separately in sentence 13.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：You keep a portfolio of the pieces you finish, and the tutor comments on that at the end。作品集加评语对应 B；A 的笔试句 15 开头已否定，C 的全班演讲句 17 明确不需要。',
        en: 'Sentence 15: "You keep a portfolio of the pieces you finish, and the tutor comments on that at the end", matching B. The written exam in A is ruled out at the start of sentence 15, and the class presentation in C is not required in sentence 17.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：We run short catch-up slots on Saturday mornings for the main projects。周六上午短补课对应 A；B 的重读整学期句中未提，C 的录播课在对话里没有出现。',
        en: 'Sentence 19: "We run short catch-up slots on Saturday mornings for the main projects", which matches A. Repeating the whole term in B is not mentioned, and a recorded lesson in C never appears in the conversation.',
      },
    },
    {
      number: 7, accepted: ['65'], spoken: 'sixty-five', evidence: 21,
      explanation: {
        zh: '定位句 21：The course fee is sixty-five dollars for the whole eight weeks。学费六十五美元；句 23 的 fifteen 是材料费，不要混到这一空。',
        en: 'Sentence 21: "The course fee is sixty-five dollars for the whole eight weeks". The course fee is sixty-five dollars. The fifteen dollars in sentence 23 is the materials fee, not this blank.',
      },
    },
    {
      number: 8, accepted: ['15'], spoken: 'fifteen', evidence: 23,
      explanation: {
        zh: '定位句 23：That is fifteen dollars, which covers the clay, glazes and the firing。材料费十五美元；它覆盖陶土、釉料与烧制，与学费分开记。',
        en: 'Sentence 23: "That is fifteen dollars, which covers the clay, glazes and the firing". The materials fee is fifteen dollars, covering clay, glazes and firing, separately from the course fee.',
      },
    },
    {
      number: 9, accepted: ['reception'], evidence: 25,
      explanation: {
        zh: '定位句 25：most people pay at the reception desk once they arrive。多数人在接待处缴费；句 25 也提到可以在线报名缴费，但笔记要填的是线下地点 reception。',
        en: 'Sentence 25: "most people pay at the reception desk once they arrive". The note asks for the offline location, reception. Online payment is also mentioned in sentence 25, but it is not the place named here.',
      },
    },
    {
      number: 10, accepted: ['20 September'], spoken: 'the twentieth of September', evidence: 27,
      explanation: {
        zh: '定位句 27：enrolment closes on the twentieth of September。报名截止 9 月 20 日；句 3 的 fourteenth of September 是开课日，不是截止日。',
        en: 'Sentence 27: "enrolment closes on the twentieth of September". The deadline is 20 September. The fourteenth of September in sentence 3 is the course start date, not the closing date.',
      },
    },
  ],
  transcript: [
    { speaker: 'student', text: 'Hi, I saw your notice for an evening pottery class, and I wanted to ask a few things before I sign up.' },
    { speaker: 'adviser', text: 'Good evening, thanks for calling the community college. What would you like to know?' },
    { speaker: 'student', text: 'First, when does it meet, and how long does the whole course run for?' },
    { speaker: 'adviser', text: 'It begins on the fourteenth of September, and it runs for eight weeks, every Thursday evening.' },
    { speaker: 'student', text: 'Every Thursday. And how long is each session on those evenings?' },
    { speaker: 'adviser', text: 'Two hours, from seven until nine, with a short break about halfway through.' },
    { speaker: 'student', text: 'That fits my work schedule well. What do we actually make in the first few weeks?' },
    { speaker: 'adviser', text: 'You start with hand-built bowls and mugs, and later you may try a simple wheel-thrown pot.' },
    { speaker: 'student', text: 'Nice. Do any skills carry over from drawing or painting?' },
    { speaker: 'adviser', text: 'Not really. The tutor walks you through the hand positions, and most people pick them up quickly.' },
    { speaker: 'student', text: 'That is reassuring. What does the course fee cover, out of interest?' },
    { speaker: 'adviser', text: 'The fee covers the tutor time and the shared tools in the studio. Clay, glazes and firing are paid through the materials fee.' },
    { speaker: 'student', text: 'So we do not keep the tools after the class, then?' },
    { speaker: 'adviser', text: 'No, the tools stay here. You can buy your own apron and a set of modelling tools if you want to keep them.' },
    { speaker: 'student', text: 'And how is the course assessed at the end? I have heard some classes set a written test.' },
    { speaker: 'adviser', text: 'There is no written exam. You keep a portfolio of the pieces you finish, and the tutor comments on that at the end.' },
    { speaker: 'student', text: 'Do we have to give a talk to the rest of the group?' },
    { speaker: 'adviser', text: 'Not formally. A short comment on your own work is enough, no presentation to the whole class.' },
    { speaker: 'student', text: 'What if I miss one evening because of work? Can I catch up later?' },
    { speaker: 'adviser', text: 'If you miss an evening, do not worry. We run short catch-up slots on Saturday mornings for the main projects.' },
    { speaker: 'student', text: 'That is reassuring. Now, could you tell me the exact fees?' },
    { speaker: 'adviser', text: 'The course fee is sixty-five dollars for the whole eight weeks.' },
    { speaker: 'student', text: 'Sixty-five. And the materials fee you mentioned earlier?' },
    { speaker: 'adviser', text: 'That is fifteen dollars, which covers the clay, glazes and the firing of your finished pieces.' },
    { speaker: 'student', text: 'Do we pay that on the first evening, or somewhere else?' },
    { speaker: 'adviser', text: 'You can pay online when you enrol, but most people pay at the reception desk once they arrive.' },
    { speaker: 'student', text: 'And is there a deadline for signing up?' },
    { speaker: 'adviser', text: 'Yes, enrolment closes on the twentieth of September, and the class fills up quickly after that.' },
    { speaker: 'student', text: 'Right. One more question, do I need any previous experience?' },
    { speaker: 'adviser', text: 'None at all. The first sessions are designed for people who have never touched clay before.' },
    { speaker: 'student', text: 'What about the size of the class? I would hate a huge group.' },
    { speaker: 'adviser', text: 'There are sixteen places on this course, split between two studio benches, so the tutor can give everyone a turn.' },
    { speaker: 'student', text: 'Sixteen sounds reasonable. Is there anywhere I can look at past work?' },
    { speaker: 'adviser', text: 'Yes, the college website has photos from the last three terms, and a few finished pieces sit in the hallway by the stairs.' },
    { speaker: 'student', text: 'Great. What should I bring on the first evening?' },
    { speaker: 'adviser', text: 'Just comfortable clothes and an old shirt you do not mind getting dusty. The studio supplies the clay and the aprons on that night.' },
    { speaker: 'student', text: 'I will make a note of that. Is the room easy to find on campus?' },
    { speaker: 'adviser', text: 'It is studio four, on the first floor, past the library. There are signs from the main entrance after seven.' },
    { speaker: 'student', text: 'Thanks for explaining everything. Good night.' },
    { speaker: 'adviser', text: 'Good night, and I hope to see you on the first Thursday.' },
  ],
  vocabulary: [
    {
      term: 'enrolment', phonetic: '/ɪnˈrəʊlmənt/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '报名，注册（入学）', en: 'the act of registering on a course or programme' },
      usage: { zh: '英式拼写 enrolment；美式 enrollment。enrolment closes、enrolment deadline。', en: 'British spelling enrolment; American enrollment. Enrolment closes, enrolment deadline.' },
      collocations: ['enrolment closes', 'open enrolment', 'the enrolment deadline'],
      example: { en: 'Enrolment for the evening classes ends next Friday.', zh: '晚间课程的报名下周五截止。' },
      listening: { zh: '重音在第二音节 /ˈrəʊl/，开头 /ɪn/ 弱读。', en: 'Stress the second syllable; the opening /ɪn/ is reduced.' },
    },
    {
      term: 'portfolio', phonetic: '/pɔːtˈfəʊliəʊ/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '作品集；档案夹', en: 'a collection of finished pieces showing someone’s work' },
      usage: { zh: '课程与求职高频：keep a portfolio、submit a portfolio。', en: 'Common in courses and job applications: keep a portfolio, submit a portfolio.' },
      collocations: ['a portfolio of work', 'submit a portfolio', 'a design portfolio'],
      example: { en: 'She kept a portfolio of her paintings for the final review.', zh: '她把画作整理成作品集供期末评审。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈfəʊ/；末尾 /liəʊ/ 不要读成 lion。', en: 'Four syllables with stress on the second; the ending differs from lion.' },
    },
    {
      term: 'materials', phonetic: '/məˈtɪəriəlz/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '材料，原料（复数）', en: 'the substances used to make something' },
      usage: { zh: '课程语境 materials fee 指材料费；不可说 material fee 的单数搭配。', en: 'In courses, materials fee covers supplies; the fee usually keeps the plural materials.' },
      collocations: ['the materials fee', 'teaching materials', 'raw materials'],
      example: { en: 'The materials fee covers clay, glazes and firing.', zh: '材料费包含陶土、釉料和烧制。' },
      listening: { zh: '重音在第二音节 /ˈtɪə/，前面 /mə/ 很轻。', en: 'Stress the second syllable; the opening /mə/ is weak.' },
    },
    {
      term: 'reception', phonetic: '/rɪˈsepʃn/', partOfSpeech: 'n.', sentenceIndex: 25,
      meaning: { zh: '接待处，前台', en: 'the desk in a building where visitors are met' },
      usage: { zh: 'at the reception desk、pay at reception；reception 前一般不加 the。', en: 'At the reception desk, pay at reception; reception usually drops the article.' },
      collocations: ['at the reception desk', 'the reception area', 'leave something at reception'],
      example: { en: 'You can collect the keys at reception after four.', zh: '四点以后可以在前台取钥匙。' },
      listening: { zh: '重音在第二音节 /ˈsep/，与 receptionist 同根。', en: 'Stress the second syllable; related to receptionist.' },
    },
    {
      term: 'catch-up', phonetic: '/ˈkætʃ ʌp/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '补课，追赶进度', en: 'extra work to make up for what was missed' },
      usage: { zh: '作名词带连字符：catch-up slot、catch-up session；动词短语分开写 catch up。', en: 'The noun keeps the hyphen, catch-up slot; the verb phrase splits as catch up.' },
      collocations: ['catch-up session', 'a catch-up class', 'do some catch-up work'],
      example: { en: 'The tutor ran a catch-up session on Saturday morning.', zh: '导师周六上午安排了一次补课。' },
      listening: { zh: '两个词都重读，/ˈkætʃ/ 与 /ʌp/ 之间有轻微停顿。', en: 'Both words are stressed, with a slight pause between them.' },
    },
    {
      term: 'apron', phonetic: '/ˈeɪprən/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '围裙', en: 'a garment worn over clothes to keep them clean while working' },
      usage: { zh: '绘画、陶艺、烹饪场景：wear an apron、tie on an apron。', en: 'Used in art, pottery and cooking: wear an apron, tie on an apron.' },
      collocations: ['a studio apron', 'wear an apron', 'a protective apron'],
      example: { en: 'He put on an apron before throwing clay on the wheel.', zh: '他上轮拉坯前系上了围裙。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈeɪ/，第二个 /prən/ 弱读。', en: 'Two syllables, stress on the first; the second is reduced.' },
    },
    {
      term: 'benches', phonetic: '/ˈbentʃɪz/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '工作台；长凳（复数）', en: 'long worktables in a studio or workshop' },
      usage: { zh: '工作室语境 studio bench 指工作台；公园里则是长凳，复数加 es。', en: 'In a studio, a bench is the worktable; elsewhere it is a public seat; the plural adds es.' },
      collocations: ['studio benches', 'work at the benches', 'two wooden benches'],
      example: { en: 'The class split between two studio benches.', zh: '全班分在两张工作台旁。' },
      listening: { zh: '词尾 /ɪz/ 要清晰，不要吞掉成 /bentʃ/。', en: 'Pronounce the final /ɪz/ clearly; do not drop it.' },
    },
  ],
  expressions: [
    {
      phrase: 'sign up', sentenceIndex: 0,
      meaning: { zh: '报名（课程、活动）', en: 'to enrol on a course or register for an event' },
      usage: { zh: 'sign up for 后接课程；代词放中间：sign it up。', en: 'Follow sign up for with the course; put the pronoun in the middle, sign it up.' },
      example: { en: 'I signed up for the evening pottery class last week.', zh: '我上周报了晚间陶艺课。' },
    },
    {
      phrase: 'out of interest', sentenceIndex: 10,
      meaning: { zh: '顺便问一下（出于好奇）', en: 'used to ask something out of curiosity, not necessity' },
      usage: { zh: '插入语，缓和提问；比 I want to know 更口语。', en: 'A parenthetical softener, more colloquial than I want to know.' },
      example: { en: 'How many students are in the group, out of interest?', zh: '顺便问一下，小组里有多少学生？' },
    },
    {
      phrase: 'carry over', sentenceIndex: 8,
      meaning: { zh: '沿用，迁移到另一处', en: 'to transfer a skill or habit to a new situation' },
      usage: { zh: 'carry over from 后接来源；技能、规则、习惯都可用。', en: 'Follow carry over from with the source; skills, rules and habits work here.' },
      example: { en: 'Her drawing skills carried over well into the pottery class.', zh: '她的绘画技巧顺利迁移到陶艺课上。' },
    },
    {
      phrase: 'fills up', sentenceIndex: 27,
      meaning: { zh: '（名额）报满，填满', en: 'to become full, especially of places on a course' },
      usage: { zh: '名额语境 The class fills up quickly；fill up 也指给容器装满。', en: 'With places, the class fills up quickly; otherwise it means fill a container.' },
      example: { en: 'The evening classes fill up within the first week.', zh: '晚间课程第一周内就报满。' },
    },
    {
      phrase: 'pick them up', sentenceIndex: 9,
      meaning: { zh: '（不经指导而）学会，掌握', en: 'to learn a skill informally and quickly' },
      usage: { zh: 'pick up a skill、pick up a habit；代词放中间：pick it up。', en: 'pick up a skill or habit; the pronoun goes in the middle, pick it up.' },
      example: { en: 'Most beginners pick up the hand positions in one session.', zh: '多数初学者一节课就能掌握手部姿势。' },
    },
    {
      phrase: 'make a note of', sentenceIndex: 36,
      meaning: { zh: '记下，记录', en: 'to write something down so you remember it' },
      usage: { zh: '后接名词或从句；比 note down 更完整正式。', en: 'Follow with a noun or clause; fuller than note down.' },
      example: { en: 'Make a note of the room number before you go home.', zh: '回家前把房间号记下来。' },
    },
  ],
  tips: [
    {
      title: { zh: '数字先归类再落笔', en: 'Sort each number before you write it' },
      body: {
        zh: '篇内出现八个、十六、两小时、六点五、十五等多个数字，分别对应周数、人数、课时、学费和材料费。听到数字先在草稿旁标注类别：周数、人数、时长还是费用，再填进对应空格。',
        en: 'The passage gives eight, sixteen, two hours, sixty-five and fifteen, mapping to weeks, class size, session length, course fee and materials fee. Label each number by category first, then place it in the matching blank.',
      },
    },
    {
      title: { zh: '修正后的说法为准', en: 'The corrected version wins' },
      body: {
        zh: '咨询对话常先给一个笼统说法再纠正，例如工具是否带走、材料是否含在学费里。听到 actually、though、rather 这类词，准备把刚写下的答案换成后面的版本。',
        en: 'A consultation often states something loosely and then corrects it, such as whether tools leave the studio or whether materials are included. When you hear actually, though or rather, be ready to replace what you wrote.',
      },
    },
    {
      title: { zh: '日期区分开课与截止', en: 'Separate the start date from the deadline' },
      body: {
        zh: '句中先后出现 9 月 14 日开课和 9 月 20 日报名截止。听日期时记下它修饰的动作：begins 还是 closes，避免把开课日填进截止日的空格。',
        en: 'The passage gives a fourteenth September start and a twentieth September enrolment close. Note the verb attached to each date, begins or closes, so the start date does not land in the deadline blank.',
      },
    },
  ],
};
