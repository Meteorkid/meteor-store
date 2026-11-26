import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 37 · Part 1 — 顾客电话预约剪发染发（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：可选档期 → 染发耗时 → 过敏测试 → 咨询时长 → 改约费用（填空块），
 * 后半段再谈色调建议、发根补染周期、到店携带物、改约细则与颜色过深的处理（单选块）。
 * 题块顺序与录音顺序一致。
 */
export const test37Part1: ListeningLesson = {
  slug: 'test-37-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预约剪发染发', en: 'Booking a haircut and colour' },
  summary: {
    zh: '一位顾客致电美发沙龙预约剪发与染发：可选到店日、染发耗时、提前两天的过敏测试、开档前的咨询时长，以及改约费用；后半段了解色调建议、发根补染周期、需要携带的照片、改约细则和颜色过深时的补救方式。',
    en: 'A customer calls a hair salon to book a cut and colour: the available day, the colouring time, the allergy test two days beforehand, the opening consultation, and the reschedule fee; later she learns about the shade suggestion, root touch-up intervals, what to bring, the reschedule rules, and how a too-dark colour is corrected.',
  },
  accent: { zh: '顾客为美式口音，发型师为澳式多语言口音。', en: 'The customer speaks with an American accent and the stylist with an Australian multilingual accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'customer', label: 'CUSTOMER', gender: 'female', voice: 'en-US-JennyNeural' },
    { id: 'stylist', label: 'STYLIST', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Appointment day: afternoon', cells: [[{ blank: 1 }]] },
        { lead: 'Colouring takes about', cells: [[{ blank: 2 }, { text: ' hours.' }]] },
        { lead: 'Allergy test: done', cells: [[{ blank: 3 }, { text: ' days before the appointment.' }]] },
        { lead: 'Opening consultation lasts about', cells: [[{ blank: 4 }, { text: ' minutes.' }]] },
        { lead: 'Late change carries a', cells: [[{ blank: 5 }, { text: ' pound fee.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'What does the stylist say about the colour shade?',
          options: [
            { key: 'A', text: 'A warm brown suits the customer better than a very dark black.' },
            { key: 'B', text: 'A pure black shade matches the customer’s skin tone.' },
            { key: 'C', text: 'The customer should choose a blonde shade.' },
          ],
        },
        {
          number: 7,
          stem: 'How often should the roots be touched up?',
          options: [
            { key: 'A', text: 'Every three weeks.' },
            { key: 'B', text: 'Every six weeks.' },
            { key: 'C', text: 'Every three months.' },
          ],
        },
        {
          number: 8,
          stem: 'What should the customer bring to the appointment?',
          options: [
            { key: 'A', text: 'Her own colour products.' },
            { key: 'B', text: 'One clear photo of the desired look.' },
            { key: 'C', text: 'A list of previous dyes.' },
          ],
        },
        {
          number: 9,
          stem: 'What is the rescheduling policy?',
          options: [
            { key: 'A', text: 'Changes are free as long as notice is given.' },
            { key: 'B', text: 'A late change still carries the fee.' },
            { key: 'C', text: 'The full deposit is lost for any change.' },
          ],
        },
        {
          number: 10,
          stem: 'What happens if the colour turns out too dark?',
          options: [
            { key: 'A', text: 'The whole head is redone the same day.' },
            { key: 'B', text: 'It is lightened gently at the next visit.' },
            { key: 'C', text: 'The customer must accept the shade.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['Thursday'], evidence: 3,
      explanation: {
        zh: '定位句 3：Tuesday is fully booked, but there is one place left on Thursday afternoon。顾客先提 Tuesday 与 Thursday，发型师说 Tuesday 约满，剩下的是 Thursday；Tuesday 是被否定的干扰项。',
        en: 'Sentence 3: "Tuesday is fully booked, but there is one place left on Thursday afternoon". The customer offers Tuesday and Thursday; Tuesday is full, so the available day is Thursday.',
      },
    },
    {
      number: 2, accepted: ['three', '3'], evidence: 7,
      explanation: {
        zh: '定位句 7：The colouring takes about three hours, and then we do the cut afterwards。空格后已印 hours，只填数字 three；cut 是染发之后的步骤，不是耗时答案。',
        en: 'Sentence 7: "The colouring takes about three hours, and then we do the cut afterwards". Hours is already printed, so write three; the cut follows the colouring and is not the answer.',
      },
    },
    {
      number: 3, accepted: ['two', '2'], evidence: 9,
      explanation: {
        zh: '定位句 9：a colour allergy test has to be done two days before the appointment。过敏测试要提前两天做；句 11 的 next day 是查看贴片的时间，不是测试提前量。',
        en: 'Sentence 9: "a colour allergy test has to be done two days before the appointment". The test is two days ahead; the next day in sentence 11 is when the patch is checked, not the lead time.',
      },
    },
    {
      number: 4, accepted: ['fifteen', '15'], evidence: 13,
      explanation: {
        zh: '定位句 13：We begin with a short consultation, about fifteen minutes, to agree the shade。咨询时长约十五分钟；short 是修饰，不能填进分钟数的空里。',
        en: 'Sentence 13: "We begin with a short consultation, about fifteen minutes, to agree the shade". The consultation lasts about fifteen minutes; short is a description, not the figure.',
      },
    },
    {
      number: 5, accepted: ['five', '5'], evidence: 14,
      explanation: {
        zh: '定位句 14：a late change carries a five pound fee。改约费用是五英镑；fee 已在卷面上印出，空格填数字 five。',
        en: 'Sentence 14: "a late change carries a five pound fee". The late-change fee is five pounds; fee is already printed, so write the number five.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：a warm brown works better than a very dark black。暖棕色比深黑更适合顾客肤色，对应 A。B 的纯黑与句中 very dark black 被比较的语气相反，C 的金色在录音中没有提到。',
        en: 'Sentence 16: "a warm brown works better than a very dark black", matching A. Pure black is the rejected comparison, and blonde is never mentioned.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：the roots need touching up every six weeks。发根每六周补染一次，对应 B。A 的三周和 C 的三个月在录音中均未出现。',
        en: 'Sentence 18: "the roots need touching up every six weeks", matching B. Three weeks and three months are not mentioned in the recording.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：bring one clear photo, and wear no make up that morning。顾客需要带一张清晰的参考照片，对应 B。自带产品与既往染剂清单在录音中都没有要求。',
        en: 'Sentence 20: "bring one clear photo, and wear no make up that morning". The customer should bring one clear reference photo, matching B. Own products and a dye history list are not requested.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：You can reschedule with a day notice, but a late change still carries the fee。改约可提前一天办理，但迟到改约仍收费，对应 B。A 的免费改约与句中 fee 相反，C 的定金全失在录音中没有依据。',
        en: 'Sentence 22: "You can reschedule with a day notice, but a late change still carries the fee", matching B. Free changes contradict the fee, and losing the full deposit is not claimed.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：We can lighten it gently at the next visit, rather than redoing the whole head the same day。颜色过深时下次到访轻柔提亮，对应 B。A 的当天重做整头与句中 rather than 相反，C 的必须接受原色没有依据。',
        en: 'Sentence 26: "We can lighten it gently at the next visit, rather than redoing the whole head the same day", matching B. Redoing the head the same day is ruled out, and accepting the shade is not said.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I would like to book a cut and colour for next week.' },
    { speaker: 'stylist', text: 'Sure, let me check the diary for you. What day works best for you?' },
    { speaker: 'customer', text: 'I am free Tuesday or Thursday afternoon, whichever suits the salon.' },
    { speaker: 'stylist', text: 'Tuesday is fully booked, but there is one place left on Thursday afternoon.' },
    { speaker: 'customer', text: 'Thursday works, then. What time can I come in?' },
    { speaker: 'stylist', text: 'The slot starts at two o clock and runs through the early evening.' },
    { speaker: 'customer', text: 'How long does the colouring itself take once I am here?' },
    { speaker: 'stylist', text: 'The colouring takes about three hours, and then we do the cut afterwards.' },
    { speaker: 'customer', text: 'Do I need anything special before the colour goes on my hair?' },
    { speaker: 'stylist', text: 'Yes, a colour allergy test has to be done two days before the appointment.' },
    { speaker: 'customer', text: 'Where does that patch test take place, and how long does it take?' },
    { speaker: 'stylist', text: 'You drop in at the front desk, and the patch is checked the next day.' },
    { speaker: 'customer', text: 'Is there anything else I should know before we start the visit?' },
    { speaker: 'stylist', text: 'We begin with a short consultation, about fifteen minutes, to agree the shade.' },
    { speaker: 'stylist', text: 'If you need to move this later, a late change carries a five pound fee.' },
    { speaker: 'customer', text: 'Right. What colour options would you suggest for my hair?' },
    { speaker: 'stylist', text: 'For your skin tone, a warm brown works better than a very dark black.' },
    { speaker: 'customer', text: 'Will the colour fade quickly during the first month after the visit?' },
    { speaker: 'stylist', text: 'It settles after the first wash, and the roots need touching up every six weeks.' },
    { speaker: 'customer', text: 'Should I bring any photos of the look I want to copy?' },
    { speaker: 'stylist', text: 'Yes, bring one clear photo, and wear no make up that morning if you can.' },
    { speaker: 'customer', text: 'What if I have to move the appointment once it is booked in?' },
    { speaker: 'stylist', text: 'You can reschedule with a day notice, but a late change still carries the fee.' },
    { speaker: 'customer', text: 'Is that fee waived if I am unwell and cannot make the salon?' },
    { speaker: 'stylist', text: 'The fee still applies, though we hold the credit for a later visit.' },
    { speaker: 'customer', text: 'What if the shade comes out darker than I hoped for my hair?' },
    { speaker: 'stylist', text: 'We can lighten it gently at the next visit, rather than redoing the whole head the same day.' },
    { speaker: 'customer', text: 'Do you trim the ends during the colour session itself?' },
    { speaker: 'stylist', text: 'Yes, the cut follows the colour, and we check the length together in the mirror.' },
    { speaker: 'customer', text: 'How long should I leave the colour before washing my hair at home?' },
    { speaker: 'stylist', text: 'Wait forty eight hours after the appointment before the first shampoo.' },
    { speaker: 'customer', text: 'Is the studio open on weekends for those who work weekdays?' },
    { speaker: 'stylist', text: 'Saturday mornings take bookings, but Sunday is closed for team training.' },
    { speaker: 'customer', text: 'Can I pay by card at the desk when the visit is finished?' },
    { speaker: 'stylist', text: 'Card and contactless are accepted, but cash is not taken for colour appointments.' },
    { speaker: 'customer', text: 'Will I get a reminder text before the Thursday slot next week?' },
    { speaker: 'stylist', text: 'Yes, the confirmation message arrives the evening before your visit.' },
    { speaker: 'customer', text: 'One last thing, do you add conditioning after the colour process?' },
    { speaker: 'stylist', text: 'A gloss treatment is included at the end of every colour session here.' },
    { speaker: 'customer', text: 'Great, I will take the Thursday two o clock place, then.' },
    { speaker: 'stylist', text: 'Done. Please arrive ten minutes early for the allergy patch check.' },
  ],
  vocabulary: [
    {
      term: 'diary', phonetic: '/ˈdaɪəri/', partOfSpeech: 'n.', sentenceIndex: 1,
      meaning: { zh: '预约簿，日程表', en: 'the book or system where appointments are recorded' },
      usage: { zh: '英式口语里 check the diary 指查档期；美式常说 schedule。', en: 'British for checking availability; Americans often say schedule.' },
      collocations: ['check the diary', 'a busy diary', 'book in the diary'],
      example: { en: 'Let me check the diary and see what slots are free.', zh: '我查一下预约簿，看看还有哪些空档。' },
      listening: { zh: '两个音节，重音在第一个；结尾 -ary 弱读。', en: 'Two syllables with first-syllable stress; the ending is weak.' },
    },
    {
      term: 'consultation', phonetic: '/ˌkɒnslˈteɪʃn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '咨询，面诊（确定方案的简短沟通）', en: 'a short talk before a service to agree the plan' },
      usage: { zh: '可数名词；a short consultation、book a consultation。动词是 consult。', en: 'Countable: a short consultation. The verb is consult.' },
      collocations: ['a short consultation', 'the opening consultation', 'book a consultation'],
      example: { en: 'The consultation takes fifteen minutes before the colour starts.', zh: '染发开始前先做十五分钟咨询。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈteɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'shade', phonetic: '/ʃeɪd/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '（颜色的）深浅，色调', en: 'a particular depth or tone of a colour' },
      usage: { zh: '美发高频词：agree the shade、a warm shade。注意与 shadow（阴影）区分。', en: 'Common in hairdressing: agree the shade. Do not confuse it with shadow.' },
      collocations: ['the right shade', 'a warm shade', 'agree the shade'],
      example: { en: 'We choose the shade together in the consultation.', zh: '我们在咨询时一起选定色调。' },
      listening: { zh: '单音节，双元音 /eɪ/，结尾 /d/ 要读出来。', en: 'One syllable with /eɪ/; pronounce the final /d/.' },
    },
    {
      term: 'touching up', phonetic: '/ˈtʌtʃɪŋ ʌp/', partOfSpeech: 'v.', sentenceIndex: 18,
      meaning: { zh: '补染，修补（长出的发根）', en: 'refreshing the roots where the colour has grown out' },
      usage: { zh: '短语动词 touch up 的现在分词；touch up the roots、root touch-up 作名词。', en: 'Present participle of touch up: touch up the roots; root touch-up is the noun form.' },
      collocations: ['touch up the roots', 'a root touch-up', 'touch up the colour'],
      example: { en: 'The roots need touching up every six weeks.', zh: '发根每六周需要补染一次。' },
      listening: { zh: '两个词都读短元音 /ʌ/；up 的 /p/ 轻读。', en: 'Both words have the short vowel /ʌ/; the /p/ in up is light.' },
    },
    {
      term: 'reschedule', phonetic: '/ˌriːˈʃedjuːl/', partOfSpeech: 'v.', sentenceIndex: 22,
      meaning: { zh: '改约，重新安排时间', en: 'to move an appointment to a later or different time' },
      usage: { zh: 're- 前缀加 schedule；reschedule the appointment、reschedule with notice。', en: 'Prefix re- plus schedule: reschedule the appointment, reschedule with notice.' },
      collocations: ['reschedule the appointment', 'reschedule with notice', 'reschedule for next week'],
      example: { en: 'You can reschedule with a day notice before the fee applies.', zh: '提前一天通知就可以改约，否则要收费。' },
      listening: { zh: '重音在第二音节 /ˈʃed/；开头 re- 读 /riː/。', en: 'Stress the second syllable; the opening re- is /riː/.' },
    },
    {
      term: 'gloss treatment', phonetic: '/ɡlɒs ˈtriːtmənt/', partOfSpeech: 'n.', sentenceIndex: 38,
      meaning: { zh: '光泽护理（染发后增加发丝亮泽的护理）', en: 'a finishing treatment that adds shine to coloured hair' },
      usage: { zh: '美发场景；a gloss treatment、add a gloss treatment。gloss 此处指光泽层。', en: 'Salon term: a gloss treatment adds shine; gloss means the shine layer here.' },
      collocations: ['a gloss treatment', 'add a gloss treatment', 'included gloss treatment'],
      example: { en: 'A gloss treatment is included at the end of the colour session.', zh: '染发结束时附赠一次光泽护理。' },
      listening: { zh: 'gloss 单音节 /ɡlɒs/；treatment 三个音节，重音在第一个。', en: 'gloss is one syllable; treatment has three with first-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'fully booked', sentenceIndex: 3,
      meaning: { zh: '全部约满，没有空档', en: 'all appointment slots have already been taken' },
      usage: { zh: '服务行业高频；the salon is fully booked、fully booked for Tuesday。', en: 'Common in services: the salon is fully booked, fully booked for Tuesday.' },
      example: { en: 'Tuesday is fully booked, but Thursday still has a place.', zh: '周二已经约满，周四还有一个位置。' },
    },
    {
      phrase: 'drop in', sentenceIndex: 11,
      meaning: { zh: '顺路到访，不预约前来', en: 'to arrive without a pre-booked time' },
      usage: { zh: 'drop in at the desk、drop in for the test；后接地点用 at。', en: 'Drop in at the desk; at precedes the place.' },
      example: { en: 'You drop in at the front desk for the patch test.', zh: '你顺路到前台做贴片测试。' },
    },
    {
      phrase: 'works better than', sentenceIndex: 16,
      meaning: { zh: '比……更适合，效果更好', en: 'is a more suitable choice than the alternative' },
      usage: { zh: '比较结构；A works better than B，口语里比 compare favorably 自然。', en: 'Comparative structure: A works better than B; more natural than formal comparison phrases.' },
      example: { en: 'A warm brown works better than black on your skin tone.', zh: '以你的肤色，暖棕色比黑色更合适。' },
    },
    {
      phrase: 'carries the fee', sentenceIndex: 22,
      meaning: { zh: '需要支付这笔费用', en: 'to incur a charge for the late change' },
      usage: { zh: 'carry a fee、carry the charge；主语通常是改约或迟到行为。', en: 'Carry a fee; the subject is usually the late change or arrival.' },
      example: { en: 'A late change still carries the five pound fee.', zh: '迟到改约仍需支付五英镑费用。' },
    },
    {
      phrase: 'hold the credit', sentenceIndex: 24,
      meaning: { zh: '保留抵扣额度，留作下次使用', en: 'to keep the money as credit for a later visit' },
      usage: { zh: 'retail 场景；hold the credit、put it on your account。', en: 'Retail usage: hold the credit, put it on your account.' },
      example: { en: 'We hold the credit for a later visit instead of refunding it.', zh: '我们把额度留下，供你下次到店使用。' },
    },
    {
      phrase: 'one last thing', sentenceIndex: 37,
      meaning: { zh: '最后一件事（结束前补问）', en: 'the final point before finishing the conversation' },
      usage: { zh: '对话收尾信号；后接问题，相当于 one final question。', en: 'A closing signal before one final question.' },
      example: { en: 'One last thing, do you offer a conditioning treatment after colour?', zh: '最后一件事，染发后你们提供护理吗？' },
    },
  ],
  tips: [
    {
      title: { zh: '被否定的日期先划掉', en: 'Cross out dates that are ruled out' },
      body: {
        zh: '第 1 题顾客同时报出 Tuesday 与 Thursday，发型师先说 Tuesday is fully booked。听到 fully booked、no room 这类否定短语时，在旁边日期上画叉，答案取保留下来的那个。',
        en: 'In item 1 the customer offers Tuesday and Thursday, and the stylist says Tuesday is fully booked. Mark a cross beside ruled-out dates when you hear fully booked or no room, and keep the surviving day.',
      },
    },
    {
      title: { zh: '注意卷面已给的单位', en: 'Check the printed unit on the note' },
      body: {
        zh: '第 2、4、5 题卷面已经印出 hours、minutes、pound，填空只写数字。落笔前先看空格前后的单位，避免把 three hours 整词抄进去超出词数限制。',
        en: 'Items 2, 4 and 5 already print hours, minutes and pound, so write the number only. Check the unit beside the gap before writing, so you do not copy the whole phrase and break the word limit.',
      },
    },
    {
      title: { zh: '比较句里抓被肯定的一方', en: 'In comparisons, keep the positive side' },
      body: {
        zh: '第 6 题的 warm brown works better than a very dark black 是比较结构，单选常把被比较的一方写成干扰项。听到 than 时记下两侧分别是什么，答案取 works better 的那一侧。',
        en: 'Item 6 uses a comparative: warm brown works better than a very dark black. Choice distractors often take the rejected side; note both sides before than and choose the one that works better.',
      },
    },
  ],
};
