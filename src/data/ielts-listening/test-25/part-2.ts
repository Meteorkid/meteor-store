import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 25 · Part 2 — 校医务室服务说明（单人独白，加拿大口音）。原创仿真材料。
 *
 * 独白前半段按预约方式、旅行疫苗、心理支持、急诊转诊、周六时间展开，对应五道单选；
 * 后半段讲提前放号天数、首诊记录、咨询时长、转诊热线与闭馆日，对应五道笔记填空。
 * 开场用现场指令，不用 welcome to 句式。
 */
export const test25Part2: ListeningLesson = {
  slug: 'test-25-part-2',
  part: 2,
  status: 'published',
  title: { zh: '校医务室服务说明', en: 'Explaining campus health centre services' },
  summary: {
    zh: '医务室协调员向新生介绍服务：常规预约走线上门户，旅行诊所提供出国疫苗接种，压力焦虑可预约保密咨询，重伤或胸痛才转急诊；随后说明提前放号天数、首诊需带接种记录、咨询时长、转诊热线开放时间与闭馆假日。',
    en: 'The health centre coordinator briefs new students: routine bookings use the online portal, the travel clinic gives overseas vaccinations, stress and anxiety go to confidential counselling, and only serious injury or chest pain refers to the emergency department. The notes cover booking release, the first-visit record, session length, referral hours and holidays.',
  },
  accent: { zh: '协调员为加拿大口音，语速平稳清晰。', en: 'The coordinator has a Canadian accent and speaks steadily and clearly.' },
  speechRate: '+5%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'male', voice: 'en-CA-LiamNeural' },
  ],
  sections: [
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 11,
          stem: 'How do students book a routine appointment?',
          options: [
            { key: 'A', text: 'Through the online booking portal' },
            { key: 'B', text: 'By phoning the nurse directly' },
            { key: 'C', text: 'By walking in without an appointment' },
          ],
        },
        {
          number: 12,
          stem: 'What does the travel clinic provide?',
          options: [
            { key: 'A', text: 'Vaccinations for overseas trips' },
            { key: 'B', text: 'Free malaria tablets for the term' },
            { key: 'C', text: 'A written letter supporting a visa application' },
          ],
        },
        {
          number: 13,
          stem: 'What support is offered for stress or anxiety?',
          options: [
            { key: 'A', text: 'A one-off medical check-up' },
            { key: 'B', text: 'Confidential counselling sessions' },
            { key: 'C', text: 'A referral to a private hospital' },
          ],
        },
        {
          number: 14,
          stem: 'When should a student go to the emergency department?',
          options: [
            { key: 'A', text: 'For a minor cough that lasts a week' },
            { key: 'B', text: 'For a small sports injury walked off the field' },
            { key: 'C', text: 'For a serious injury or chest pain' },
          ],
        },
        {
          number: 15,
          stem: 'What are the centre’s Saturday opening hours?',
          options: [
            { key: 'A', text: 'Closed all weekend' },
            { key: 'B', text: 'Nine until twelve' },
            { key: 'C', text: 'Eight until four' },
          ],
        },
      ],
    },
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Routine appointments are released', cells: [[{ blank: 16 }, { text: ' days ahead' }]] },
        { lead: 'Vaccination record must be brought to the', cells: [[{ blank: 17 }, { text: ' visit' }]] },
        { lead: 'Counselling sessions last about', cells: [[{ blank: 18 }, { text: ' minutes' }]] },
        { lead: 'Emergency referral line open until', cells: [[{ blank: 19 }, { text: ' at night' }]] },
        { lead: 'Centre is closed on', cells: [[{ blank: 20 }]] },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['A'], evidence: 4,
      explanation: {
        zh: '定位句 4：The standard route is our online portal, where you pick a slot that suits your timetable。常规预约走线上门户，对应 A。B 的电话只作备用，C 的直接上门在句 3 被否定。',
        en: 'Sentence 4: "The standard route is our online portal, where you pick a slot that suits your timetable". Routine booking uses the portal, matching A. Phoning in B is only a backup, and walking in in C is rejected in sentence 3.',
      },
    },
    {
      number: 12, accepted: ['A'], evidence: 8,
      explanation: {
        zh: '定位句 8：The clinic provides vaccinations for overseas trips, such as those required before a semester overseas。旅行诊所提供出国疫苗，对应 A。B 的免费疟疾药与 C 的签证信在句 9 被否定。',
        en: 'Sentence 8: "The clinic provides vaccinations for overseas trips, such as those required before a semester overseas". The clinic gives overseas vaccinations, matching A. Free malaria tablets and a visa letter are rejected in sentence 9.',
      },
    },
    {
      number: 13, accepted: ['B'], evidence: 12,
      explanation: {
        zh: '定位句 12：we offer confidential counselling sessions with a trained counsellor。压力焦虑对应保密咨询，匹配 B。A 的一次性体检与 C 的私人医院转介在句 13 被否定。',
        en: 'Sentence 12: "we offer confidential counselling sessions with a trained counsellor". Stress and anxiety are handled by counselling, matching B. A one-off check-up and a private hospital referral are rejected in sentence 13.',
      },
    },
    {
      number: 14, accepted: ['C'], evidence: 18,
      explanation: {
        zh: '定位句 18：Go to the emergency department only for a serious injury or chest pain, symptoms that cannot wait until morning。重伤或胸痛才去急诊，对应 C。A 的咳嗽与 B 的轻伤在句 16、17 被归为不必急诊。',
        en: 'Sentence 18: "Go to the emergency department only for a serious injury or chest pain, symptoms that cannot wait until morning". Serious injury or chest pain match C. A cough in A and a minor injury in B are ruled out in sentences 16 and 17.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：On Saturdays we open from nine until twelve, so do not plan an afternoon visit on the weekend。周六九点到十二点，对应 B。A 的周末全天关闭与 C 的八点到四点在本段未出现。',
        en: 'Sentence 20: "On Saturdays we open from nine until twelve, so do not plan an afternoon visit on the weekend". Saturday hours are nine to twelve, matching B. A closed weekend and eight to four are not mentioned here.',
      },
    },
    {
      number: 16, accepted: ['seven', '7'], spoken: 'seven', evidence: 22,
      explanation: {
        zh: '定位句 22：Routine appointments are released seven days ahead, so check the portal early。提前七天放号；空后已印 days ahead，填 seven。',
        en: 'Sentence 22: "Routine appointments are released seven days ahead, so check the portal early". Appointments open seven days ahead; days ahead is already printed, so write seven.',
      },
    },
    {
      number: 17, accepted: ['first'], evidence: 23,
      explanation: {
        zh: '定位句 23：Vaccination records must be brought to the first visit, otherwise the nurse cannot confirm what you already have。接种记录在首诊带来；空后已印 visit，填 first。',
        en: 'Sentence 23: "Vaccination records must be brought to the first visit, otherwise the nurse cannot confirm what you already have". The record comes to the first visit; visit is already printed, so write first.',
      },
    },
    {
      number: 18, accepted: ['fifty', '50'], spoken: 'fifty', evidence: 24,
      explanation: {
        zh: '定位句 24：Counselling sessions, as mentioned, run about fifty minutes each, with time to talk without interruption。咨询约五十分钟；空后已印 minutes，填 fifty。',
        en: 'Sentence 24: "Counselling sessions, as mentioned, run about fifty minutes each, with time to talk without interruption". Sessions run about fifty minutes; minutes is printed, so write fifty.',
      },
    },
    {
      number: 19, accepted: ['nine', '9'], spoken: 'nine', evidence: 25,
      explanation: {
        zh: '定位句 25：The emergency referral line stays open until nine at night on weekdays。转诊热线工作日开放到晚上九点；空后已印 at night，填 nine。',
        en: 'Sentence 25: "The emergency referral line stays open until nine at night on weekdays". The referral line runs until nine at night; at night is printed, so write nine.',
      },
    },
    {
      number: 20, accepted: ['statutory holidays'], evidence: 26,
      explanation: {
        zh: '定位句 26：The centre itself is closed on statutory holidays, when the recorded message lists nearby urgent clinics。闭馆日为法定假日；two-word answer 符合词数限制。',
        en: 'Sentence 26: "The centre itself is closed on statutory holidays, when the recorded message lists nearby urgent clinics". The centre closes on statutory holidays; the two-word answer fits the word limit.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Before you book anything this term, here is how the campus health centre works, so you know where to go.' },
    { speaker: 'coordinator', text: 'I’m Owen, the student health coordinator, and I’ll cover appointments, vaccinations, mental support and urgent care.' },
    { speaker: 'coordinator', text: 'Routine appointments are the easiest part. Let me begin with how you book them.' },
    { speaker: 'coordinator', text: 'You cannot just walk in and expect to be seen the same morning.' },
    { speaker: 'coordinator', text: 'The standard route is our online portal, where you pick a slot that suits your timetable.' },
    { speaker: 'coordinator', text: 'If the portal is down, you may phone the reception desk, but that is only a backup.' },
    { speaker: 'coordinator', text: 'So for a routine visit, choose the online portal rather than calling the nurse directly.' },
    { speaker: 'coordinator', text: 'Next, the travel clinic. We run one afternoon a week for students going abroad.' },
    { speaker: 'coordinator', text: 'The clinic provides vaccinations for overseas trips, such as those required before a semester overseas.' },
    { speaker: 'coordinator', text: 'It does not hand out free malaria tablets, and it does not write visa letters.' },
    { speaker: 'coordinator', text: 'Bring your previous vaccination record when you come for that first travel visit.' },
    { speaker: 'coordinator', text: 'Now the support side. University life can be stressful, and there are two ways we can help.' },
    { speaker: 'coordinator', text: 'For stress or anxiety, we offer confidential counselling sessions with a trained counsellor.' },
    { speaker: 'coordinator', text: 'This is not a one-off medical check-up, and it does not refer you to a private hospital.' },
    { speaker: 'coordinator', text: 'Each session leaves enough time to talk through what is troubling you, without being rushed.' },
    { speaker: 'coordinator', text: 'Urgent care comes next. Most minor problems can still be handled here during opening hours.' },
    { speaker: 'coordinator', text: 'A common cough or a mild cold does not need the emergency department.' },
    { speaker: 'coordinator', text: 'Neither does a small sports injury that you can walk off the field with.' },
    { speaker: 'coordinator', text: 'Go to the emergency department only for a serious injury or chest pain, symptoms that cannot wait until morning.' },
    { speaker: 'coordinator', text: 'For those cases, our referral line is the first number to call before the hospital.' },
    { speaker: 'coordinator', text: 'On Saturdays we open from nine until twelve, so do not plan an afternoon visit on the weekend.' },
    { speaker: 'coordinator', text: 'Now a few details to note down about times and records.' },
    { speaker: 'coordinator', text: 'Routine appointments are released seven days ahead, so check the portal early if you want a morning slot.' },
    { speaker: 'coordinator', text: 'Vaccination records must be brought to the first visit, otherwise the nurse cannot confirm what you already have.' },
    { speaker: 'coordinator', text: 'Counselling sessions, as mentioned, run about fifty minutes each, with time to talk without interruption.' },
    { speaker: 'coordinator', text: 'The emergency referral line stays open until nine at night on weekdays.' },
    { speaker: 'coordinator', text: 'The centre itself is closed on statutory holidays, when the recorded message lists nearby urgent clinics.' },
    { speaker: 'coordinator', text: 'Weekday hours run from eight in the morning until six at night, with a short lunch break.' },
    { speaker: 'coordinator', text: 'If you fall ill between terms, the campus clinic still keeps a limited service for registered students.' },
    { speaker: 'coordinator', text: 'Any urgent symptom that worries you should be reported rather than endured on your own.' },
    { speaker: 'coordinator', text: 'The nurses can advise whether you need a clinic visit, the referral line or the hospital.' },
    { speaker: 'coordinator', text: 'You can also download the centre leaflet from the student portal, with the full timetable printed on it.' },
    { speaker: 'coordinator', text: 'If you are unsure which service fits your problem, ask reception to point you to the right desk.' },
    { speaker: 'coordinator', text: 'Remember to bring your student card to every appointment, even counselling.' },
    { speaker: 'coordinator', text: 'Without the card, the appointment may be rescheduled to the next available slot.' },
    { speaker: 'coordinator', text: 'New this term, the centre runs a short drop-in hour on Wednesday mornings for minor questions.' },
    { speaker: 'coordinator', text: 'These drop-ins are for quick advice only, not for long consultations or prescriptions.' },
    { speaker: 'coordinator', text: 'We hope you will not need urgent care often, but the services are there when you do.' },
    { speaker: 'coordinator', text: 'If anything is unclear after this talk, the reception desk can answer by email.' },
  ],
  vocabulary: [
    {
      term: 'appointment', phonetic: '/əˈpɔɪntmənt/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '预约（就诊时段）', en: 'a booked time to see a doctor or nurse' },
      usage: { zh: '可数；book an appointment、routine appointment。动词 appoint。', en: 'Countable: book an appointment, a routine appointment. The verb is appoint.' },
      collocations: ['book an appointment', 'a routine appointment', 'the next appointment'],
      example: { en: 'Routine appointments are booked through the online portal.', zh: '常规预约通过线上门户登记。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈpɔɪnt/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'vaccination', phonetic: '/ˌvæksɪˈneɪʃn/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '疫苗接种', en: 'the act of being given a vaccine against a disease' },
      usage: { zh: '可数或不可数；vaccination record、travel vaccination。动词 vaccinate。', en: 'Countable or uncountable: a vaccination record, travel vaccination. The verb is vaccinate.' },
      collocations: ['vaccinations for overseas trips', 'a vaccination record', 'the vaccination clinic'],
      example: { en: 'The travel clinic arranges vaccinations for students going abroad.', zh: '旅行诊所为出国学生安排接种疫苗。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈneɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'counselling', phonetic: '/ˈkaʊnsəlɪŋ/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '心理咨询，辅导谈话', en: 'talk therapy with a trained counsellor for stress or emotional problems' },
      usage: { zh: '不可数；counselling sessions、confidential counselling。', en: 'Uncountable: counselling sessions, confidential counselling.' },
      collocations: ['counselling sessions', 'confidential counselling', 'book counselling'],
      example: { en: 'Students can book confidential counselling for stress.', zh: '学生可预约保密心理咨询。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈkaʊ/；结尾 /lɪŋ/。', en: 'Three syllables with stress on the first; ending /lɪŋ/.' },
    },
    {
      term: 'referral', phonetic: '/rɪˈfɜːrəl/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '转诊，转介', en: 'sending a patient to another service or hospital' },
      usage: { zh: '可数；referral line、referral to hospital。动词 refer。', en: 'Countable: a referral line, a referral to hospital. The verb is refer.' },
      collocations: ['the referral line', 'a referral to hospital', 'seek a referral'],
      example: { en: 'The referral line connects urgent cases to the hospital.', zh: '转诊热线把急症接到医院。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈfɜː/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'statutory', phonetic: '/ˈstætʃətri/', partOfSpeech: 'adj.', sentenceIndex: 26,
      meaning: { zh: '法定的，依法规定的', en: 'fixed by law, describing public holidays' },
      usage: { zh: '定语；statutory holidays、statutory requirement。', en: 'Attributive: statutory holidays, a statutory requirement.' },
      collocations: ['statutory holidays', 'a statutory holiday', 'statutory days off'],
      example: { en: 'The centre closes on statutory holidays each year.', zh: '医务室每年法定假日闭馆。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈstæt/；中间 /tʃə/ 弱读。', en: 'Three syllables with stress on the first; the middle /tʃə/ is weak.' },
    },
    {
      term: 'portal', phonetic: '/ˈpɔːrtl/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '（线上）门户，入口网站', en: 'the online page where students book services' },
      usage: { zh: '可数；online portal、student portal。', en: 'Countable: an online portal, the student portal.' },
      collocations: ['the online portal', 'the student portal', 'book through the portal'],
      example: { en: 'Routine appointments are released on the online portal.', zh: '常规预约在线上门户放号。' },
      listening: { zh: '两个音节，重音在第一音节；tal 读 /tl/。', en: 'Two syllables with first-syllable stress; tal is /tl/.' },
    },
    {
      term: 'drop-in', phonetic: '/ˈdrɒp ɪn/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '免预约的短时接待', en: 'a short session anyone can attend without booking ahead' },
      usage: { zh: '常作定语；drop-in hour、drop-in clinic。动词短语 drop in。', en: 'Often attributive: a drop-in hour, a drop-in clinic. The phrasal verb is drop in.' },
      collocations: ['a drop-in hour', 'the drop-in clinic', 'attend a drop-in'],
      example: { en: 'The Wednesday drop-in hour handles minor questions only.', zh: '周三短时接待只处理小问题。' },
      listening: { zh: '两个词都重读；连字符词按一个词计。', en: 'Both halves are stressed; the hyphenated word counts as one.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk in', sentenceIndex: 3,
      meaning: { zh: '直接上门，不预约', en: 'to arrive without booking a time in advance' },
      usage: { zh: '不及物短语动词；walk in without an appointment。', en: 'Intransitive: walk in without an appointment.' },
      example: { en: 'You cannot walk in and expect an instant appointment.', zh: '不能直接上门就指望马上看病。' },
    },
    {
      phrase: 'backup', sentenceIndex: 5,
      meaning: { zh: '备用渠道，后备方案', en: 'a secondary option used only if the main one fails' },
      usage: { zh: '可数名词；only a backup、use it as a backup。', en: 'Countable: only a backup, use it as a backup.' },
      example: { en: 'The phone desk is only a backup when the portal fails.', zh: '门户故障时电话台只是备用渠道。' },
    },
    {
      phrase: 'provides vaccinations', sentenceIndex: 8,
      meaning: { zh: '提供疫苗接种', en: 'to supply vaccines for a particular group of travellers' },
      usage: { zh: 'provide 后接服务对象；the clinic provides vaccinations for overseas trips。', en: 'Provide plus the group: the clinic provides vaccinations for overseas trips.' },
      example: { en: 'The clinic provides vaccinations for overseas trips.', zh: '诊所为出国旅行提供疫苗接种。' },
    },
    {
      phrase: 'run about', sentenceIndex: 24,
      meaning: { zh: '持续约（时长）', en: 'to run for roughly a given length of time' },
      usage: { zh: 'run 此处指持续；run about fifty minutes，与 last about 同义。', en: 'Here run means last: run about fifty minutes, like last about.' },
      example: { en: 'Each counselling session runs about fifty minutes.', zh: '每次咨询约五十分钟。' },
    },
    {
      phrase: 'point you to', sentenceIndex: 32,
      meaning: { zh: '指给你看，引导到（对应部门）', en: 'to direct someone toward the right desk or service' },
      usage: { zh: 'point somebody to something；前台把你指到对应服务的窗口。', en: 'Point somebody to something: reception points you to the desk.' },
      example: { en: 'Reception can point you to the right service.', zh: '前台会指给你对应服务的部门。' },
    },
    {
      phrase: 'between terms', sentenceIndex: 28,
      meaning: { zh: '学期之间，假期中', en: 'during the break when classes are not running' },
      usage: { zh: '时间状语；service between terms、ill between terms。', en: 'Adverbial: a service between terms, fall ill between terms.' },
      example: { en: 'A limited clinic runs between terms for registered students.', zh: '假期为注册学生保留有限门诊。' },
    },
  ],
  tips: [
    {
      title: { zh: '单选抓住适用人群与条件', en: 'Match each rule to its group' },
      body: {
        zh: '第 11–15 题每条规则都有适用对象：常规预约走门户，旅行疫苗在诊所，心理问题找咨询，急诊只给重伤胸痛。选项常把另一人群的服务安到题干人群上，听时盯住条件句的主语。',
        en: 'Items 11 to 15 each apply to a group: portal for routine visits, vaccinations for travellers, counselling for stress, emergency care for serious cases. Options often attach one group’s service to the stem’s group; watch the subject of each condition clause.',
      },
    },
    {
      title: { zh: '笔记数字先看空后提示', en: 'Use the printed words around each gap' },
      body: {
        zh: '第 16 题空后是 days ahead，第 18 题空后是 minutes，第 19 题空后是 at night。落笔前先确认空后已印的单位，听到数词 seven、fifty、nine 直接填数字，别把单位词重复写下。',
        en: 'Item 16 prints days ahead, item 18 prints minutes, and item 19 prints at night. Check the printed unit before writing; when you hear seven, fifty or nine, write the number only and do not repeat the unit.',
      },
    },
    {
      title: { zh: '否定句划出干扰项', en: 'Cross out options after negative signals' },
      body: {
        zh: '句 9 的 does not hand out、句 13 的 not a one-off check-up、句 16–17 的 does not need 都在否定干扰项。听到 does not、rather than、neither does 时，立刻在对应选项旁划掉。',
        en: 'Sentence 9 does not hand out, sentence 13 not a one-off check-up, and sentences 16 and 17 does not need all reject distractors. On does not, rather than and neither does, cross out the matching option at once.',
      },
    },
  ],
};
