import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 17 · Part 1 — 学生致电摄影工作室预约毕业集体照。原创仿真材料，非官方真题。
 *
 * 对话先确认套餐时长、成片数量、外景地点、雨天改期与交付时间，
 * 后段核对人数、基础费用范围、备用遮雨场地、取消费用与到场准备。
 */
export const test17Part1: ListeningLesson = {
  slug: 'test-17-part-1',
  part: 1,
  status: 'published',
  title: { zh: '约毕业照摄影师', en: 'Booking a graduation photographer' },
  summary: {
    zh: '学生致电工作室预约毕业集体照：套餐时长九十分钟，含十二张修图，外景选主楼旁大学花园，雨天可在一周内改期，成片十个工作日交付；后段确认约二十人、基础费用含拍摄与私人线上相册、备用遮雨场地为门廊、提前两天以上取消退订金、到场自带梳子与补妆粉。',
    en: 'A student books a graduation group shoot: ninety minutes, twelve edited images in the university gardens, rain dates within one week, files after ten working days. Later they confirm around twenty people, the base fee covers the shoot and private gallery, the backup is the hall porch, deposits return when cancelled two days ahead, and the group brings a comb and powder.',
  },
  accent: { zh: '学生为美式口音，摄影师为澳式口音。', en: 'The student speaks with an American accent and the photographer with an Australian accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'caller', label: 'CALLER', gender: 'female', voice: 'en-US-JennyNeural' },
    { id: 'photographer', label: 'PHOTOGRAPHER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Package session length', cells: [[{ blank: 1 }, { text: ' minutes' }]] },
        { lead: 'Edited photos included', cells: [[{ blank: 2 }]] },
        { lead: 'Outdoor location', cells: [[{ blank: 3 }]] },
        { lead: 'Rain date: within', cells: [[{ blank: 4 }, { text: ' of the booking' }]] },
        { lead: 'Final delivery: ten', cells: [[{ blank: 5 }, { text: ' days' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'How many people are in the group?',
          options: [
            { key: 'A', text: 'Eighteen' },
            { key: 'B', text: 'Around twenty' },
            { key: 'C', text: 'Twenty-two' },
          ],
        },
        {
          number: 7,
          stem: 'What does the base fee include?',
          options: [
            { key: 'A', text: 'The session, twelve edits and a private online gallery' },
            { key: 'B', text: 'A printed album and two frame enlargements' },
            { key: 'C', text: 'Unlimited extra photos from the whole shoot' },
          ],
        },
        {
          number: 8,
          stem: 'Where is the covered backup spot?',
          options: [
            { key: 'A', text: 'Inside the main graduation hall' },
            { key: 'B', text: 'The sheltered porch beside the hall' },
            { key: 'C', text: 'The indoor studio on the other side of town' },
          ],
        },
        {
          number: 9,
          stem: 'When is the deposit returned?',
          options: [
            { key: 'A', text: 'If the group cancels on the morning of the shoot' },
            { key: 'B', text: 'If the cancellation is made two days or more ahead' },
            { key: 'C', text: 'The deposit is never returned under any condition' },
          ],
        },
        {
          number: 10,
          stem: 'What should the group bring to the shoot?',
          options: [
            { key: 'A', text: 'Lighting stands and group props' },
            { key: 'B', text: 'A comb and touch-up powder' },
            { key: 'C', text: 'Their own printed photo albums' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['ninety', '90'], spoken: 'ninety minutes', evidence: 3,
      explanation: {
        zh: '定位句 3：Our standard package runs ninety minutes。套餐时长为九十分钟；句中的 forty-five minute 是另一档单人肖像时长，不是本套餐。',
        en: 'Sentence 3: "Our standard package runs ninety minutes". The session lasts ninety minutes; the forty-five minute slot in the same sentence is a different portrait package, not this one.',
      },
    },
    {
      number: 2, accepted: ['twelve', '12'], evidence: 5,
      explanation: {
        zh: '定位句 5：You receive twelve edited images, chosen from the whole shoot。含十二张修图；额外加购按张计费，套餐本身不是无限张。',
        en: 'Sentence 5: "You receive twelve edited images, chosen from the whole shoot". Twelve edited images are included; extras are charged per picture, and the package is not unlimited.',
      },
    },
    {
      number: 3, accepted: ['university gardens'], evidence: 7,
      explanation: {
        zh: '定位句 7：Most groups use the university gardens near the main hall。外景在主楼附近的大学花园；门廊只是雨天备用点。',
        en: 'Sentence 7: "Most groups use the university gardens near the main hall". The outdoor location is the university gardens; the porch is only the rainy backup.',
      },
    },
    {
      number: 4, accepted: ['one week'], evidence: 9,
      explanation: {
        zh: '定位句 9：we move the shoot to the nearest dry day within one week of the original booking。雨天改期在原定日期后一周内；句中未提其它宽限天数。',
        en: 'Sentence 9: "we move the shoot to the nearest dry day within one week of the original booking". The rain date falls within one week; no other grace period is mentioned.',
      },
    },
    {
      number: 5, accepted: ['working'], evidence: 11,
      explanation: {
        zh: '定位句 11：Final delivery takes ten working days from the session。交付为十个工作日；three days 只是预览小样，不是完整相册。',
        en: 'Sentence 11: "Final delivery takes ten working days from the session". Delivery is ten working days; three days is only the preview, not the full album.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 14,
      explanation: {
        zh: '定位句 14：Around twenty. Some guests may leave early, but the core group is eighteen or nineteen。约二十人；十八九只是核心人数，不是总数。',
        en: 'Sentence 14: "Around twenty. Some guests may leave early, but the core group is eighteen or nineteen". The group is around twenty; eighteen or nineteen is only the core, not the total.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：It covers the session, twelve edits and a private online gallery。基础费用含拍摄、十二张修图和私人线上相册；印刷相册与装框放大另付。',
        en: 'Sentence 17: "It covers the session, twelve edits and a private online gallery". The base fee covers those three items; printed albums and enlargements are paid separately.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：the sheltered porch beside the hall works well, though the background is plainer than the gardens。备用遮雨点是主楼旁门廊；大厅内部和镇另一头的工作室都不是该备用场地。',
        en: 'Sentence 19: "the sheltered porch beside the hall works well, though the background is plainer than the gardens". The backup is the hall porch; neither the hall interior nor the studio across town is that spot.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：A full cancellation two days or more ahead returns the deposit, but later cancellations lose it。提前两天以上取消退订金；当天早上取消不退。',
        en: 'Sentence 21: "A full cancellation two days or more ahead returns the deposit, but later cancellations lose it". The deposit returns when cancelled two days or more ahead; a morning-of cancellation does not.',
      },
    },
    {
      number: 10, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：Please bring a comb and touch-up powder, and arrive ten minutes early。自带梳子和补妆粉；灯光设备与集体道具由工作室提供。',
        en: 'Sentence 23: "Please bring a comb and touch-up powder, and arrive ten minutes early". The group brings the comb and powder; lighting gear and props come from the studio.',
      },
    },
  ],
  transcript: [
    { speaker: 'caller', text: 'Hi, I’m ringing about graduation group photos. We have about twenty people in our group, and we want the session on campus.' },
    { speaker: 'photographer', text: 'Nice to hear from you. Let me go through the packages before you book a slot.' },
    { speaker: 'caller', text: 'Great. How long does one session usually last?' },
    { speaker: 'photographer', text: 'Our standard package runs ninety minutes. The shorter forty-five minute slot only covers one family portrait, so the group one is the better fit.' },
    { speaker: 'caller', text: 'Ninety minutes sounds fine. How many finished photos do we get?' },
    { speaker: 'photographer', text: 'You receive twelve edited images, chosen from the whole shoot. Extra pictures are available at a set price each, but the package already covers twelve.' },
    { speaker: 'caller', text: 'Twelve works. Where do you suggest the outdoor shots?' },
    { speaker: 'photographer', text: 'Most groups use the university gardens near the main hall, because the light is soft in the late morning and the steps give everyone room.' },
    { speaker: 'caller', text: 'The gardens are a good choice. What happens if it rains on the day?' },
    { speaker: 'photographer', text: 'We hold a rain date. If the forecast looks poor, we move the shoot to the nearest dry day within one week of the original booking.' },
    { speaker: 'caller', text: 'Within one week, got it. And when will we receive the finished files?' },
    { speaker: 'photographer', text: 'Final delivery takes ten working days from the session. A small preview goes out within three days, but the full album comes after ten days.' },
    { speaker: 'caller', text: 'That gives us time before the graduation ceremony.' },
    { speaker: 'photographer', text: 'How many people did you say are coming again?' },
    { speaker: 'caller', text: 'Around twenty. Some guests may leave early, but the core group is eighteen or nineteen.' },
    { speaker: 'photographer', text: 'Twenty is within the group limit, so there is no extra per-person fee on this package.' },
    { speaker: 'caller', text: 'What does the base price cover exactly?' },
    { speaker: 'photographer', text: 'It covers the session, twelve edits and a private online gallery. Printed albums and frame enlargements are paid for separately.' },
    { speaker: 'caller', text: 'If the gardens are too wet, is there a covered outdoor spot?' },
    { speaker: 'photographer', text: 'Yes, the sheltered porch beside the hall works well, though the background is plainer than the gardens.' },
    { speaker: 'caller', text: 'What if our group has to cancel altogether?' },
    { speaker: 'photographer', text: 'You can move the date once without charge. A full cancellation two days or more ahead returns the deposit, but later cancellations lose it.' },
    { speaker: 'caller', text: 'Do we need to bring anything for the shoot?' },
    { speaker: 'photographer', text: 'Please bring a comb and touch-up powder, and arrive ten minutes early. The studio provides the lighting gear and any group props.' },
    { speaker: 'caller', text: 'One last thing. Can we request a particular background in the edits?' },
    { speaker: 'photographer', text: 'Minor background changes are included. Removing a person from the frame counts as an extra edit.' },
    { speaker: 'caller', text: 'Should we wear one colour or our own clothes?' },
    { speaker: 'photographer', text: 'Most groups wear dark outfits so the faces stand out, but the dress code is not strict.' },
    { speaker: 'caller', text: 'Will there be time for separate friend photos after the group one?' },
    { speaker: 'photographer', text: 'The last fifteen minutes are free for small friend clusters, provided the main group shoot stays on schedule.' },
    { speaker: 'caller', text: 'How do we choose the twelve images?' },
    { speaker: 'photographer', text: 'You mark your favourites in the gallery, and I retouch the ones you select. The other files stay in the folder for a month.' },
    { speaker: 'caller', text: 'Can family members who live abroad see the gallery?' },
    { speaker: 'photographer', text: 'The link is private, but you can share it by email with anyone you choose. It cannot be searched from the public site.' },
    { speaker: 'caller', text: 'What time of day gives the best light in the gardens?' },
    { speaker: 'photographer', text: 'Late morning is safest. The midday sun here casts strong shadows, so I avoid that window for group shots.' },
    { speaker: 'caller', text: 'I didn’t think about the shadows. That helps.' },
    { speaker: 'photographer', text: 'We also check the weather two days ahead, and message the group if the plan changes.' },
    { speaker: 'caller', text: 'Thank you, that answers everything. I’ll check the calendar and send the booking email tonight.' },
    { speaker: 'photographer', text: 'Looking forward to it. The gallery link will arrive by email once the files are ready.' },
  ],
  vocabulary: [
    {
      term: 'session', phonetic: '/ˈseʃn/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '拍摄场次，一段时间的拍摄', en: 'a scheduled block of time reserved for the shoot' },
      usage: { zh: 'booking session、photo session；动词 session 不常用。', en: 'Booking session, photo session; the verb form is rare.' },
      collocations: ['a photo session', 'the package session', 'book a session'],
      example: { en: 'The standard package runs a ninety-minute session on campus.', zh: '标准套餐含一场九十分钟的校内拍摄。' },
      listening: { zh: '双音节，重音在首音节 /ˈse/，-sion 读 /ʃn/。', en: 'Two syllables with first-syllable stress; -sion reduces to /ʃn/.' },
    },
    {
      term: 'edited', phonetic: '/ˈedɪtɪd/', partOfSpeech: 'adj.', sentenceIndex: 5,
      meaning: { zh: '修过的，后期处理过的（照片）', en: 'images adjusted for colour, light and small flaws' },
      usage: { zh: 'edited images、edited photos；动词 edit，名词 edition 另义版本。', en: 'Edited images or photos; the verb is edit, and edition means a published version.' },
      collocations: ['edited images', 'twelve edits', 'retouch and edit'],
      example: { en: 'You receive twelve edited images from the whole shoot.', zh: '整套拍摄中给你十二张修过的照片。' },
      listening: { zh: '三音节，重音在首音节 /ˈed/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'gardens', phonetic: '/ˈɡɑːdnz/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '（校园）花园，庭园', en: 'the planted green area beside a campus building' },
      usage: { zh: '常用复数；university gardens、botanical gardens。', en: 'Usually plural: university gardens, botanical gardens.' },
      collocations: ['the university gardens', 'the gardens near the hall', 'walk through the gardens'],
      example: { en: 'Most groups take outdoor shots in the university gardens.', zh: '多数小组在大学花园拍外景。' },
      listening: { zh: '双音节，/dnz/ 成音节，尾音 /z/ 浊化。', en: 'Two syllables; /dnz/ forms the final syllable with a voiced /z/.' },
    },
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '订金，押金', en: 'money paid in advance to hold the booking' },
      usage: { zh: 'booking deposit、return the deposit；动词 deposit 指存款。', en: 'Booking deposit, return the deposit; as a verb it means put money away.' },
      collocations: ['the booking deposit', 'return the deposit', 'lose the deposit'],
      example: { en: 'Cancelling two days ahead returns the deposit.', zh: '提前两天以上取消可退订金。' },
      listening: { zh: '重音在第二音节 /ˈpɒ/，尾音 /t/。', en: 'Stress the second syllable; the ending is /t/.' },
    },
    {
      term: 'gallery', phonetic: '/ˈɡæləri/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '线上相册，展示图片的页面', en: 'the private online page where the finished photos are shown' },
      usage: { zh: 'online gallery、share the gallery link；另义美术馆。', en: 'Online gallery, share the gallery link; it also means an art museum.' },
      collocations: ['a private gallery', 'the online gallery', 'the gallery link'],
      example: { en: 'The base fee includes a private online gallery.', zh: '基础费用含一个私人线上相册。' },
      listening: { zh: '三音节，重音在首音节 /ˈɡæ/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'porch', phonetic: '/pɔːtʃ/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '门廊，屋檐下的遮雨走道', en: 'the covered entrance area beside a building' },
      usage: { zh: 'sheltered porch、beside the porch；与 balcony 不同，porch 贴地。', en: 'Sheltered porch, beside the porch; unlike a balcony it sits at ground level.' },
      collocations: ['the sheltered porch', 'the porch beside the hall', 'stand on the porch'],
      example: { en: 'The sheltered porch works as a rainy backup spot.', zh: '遮雨门廊可作雨天备用场地。' },
      listening: { zh: '单音节，元音 /ɔː/，尾音 /tʃ/。', en: 'One syllable with /ɔː/ and final /tʃ/.' },
    },
    {
      term: 'preview', phonetic: '/ˈpriːvjuː/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '预览小样，提前看到的部分照片', en: 'a small set of images shown before the full delivery' },
      usage: { zh: 'a preview goes out、send a preview；动词 preview 指预览。', en: 'A preview goes out; the verb also means look at ahead of time.' },
      collocations: ['a small preview', 'the preview images', 'send a preview'],
      example: { en: 'A small preview goes out within three days of the shoot.', zh: '拍摄后三天内发出少量预览小样。' },
      listening: { zh: '双音节，两部分都重读，/priː/ 长元音。', en: 'Two syllables, both stressed, with a long /iː/.' },
    },
    {
      term: 'retouch', phonetic: '/ˌriːˈtʌtʃ/', partOfSpeech: 'v.', sentenceIndex: 31,
      meaning: { zh: '修图，对照片细节做后期修整', en: 'to adjust small marks and flaws in a finished image' },
      usage: { zh: 'retouch the selected photos；名词 retouch 指修图工序。', en: 'Retouch the selected photos; the noun is the editing stage.' },
      collocations: ['retouch the images', 'retouch the selected frames', 'light retouch'],
      example: { en: 'I retouch the images the group marks as favourites.', zh: '我修整小组标记为喜欢的照片。' },
      listening: { zh: '双音节，重音在第二音节 /ˈtʌtʃ/。', en: 'Two syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'go through the packages', sentenceIndex: 1,
      meaning: { zh: '逐项介绍套餐内容', en: 'to explain each package in order before booking' },
      usage: { zh: '服务咨询开场；go through 表示过一遍清单。', en: 'A service-opening phrase; go through means cover a list.' },
      example: { en: 'Let me go through the packages before you choose a slot.', zh: '选时段前我先把套餐过一遍。' },
    },
    {
      phrase: 'the better fit', sentenceIndex: 3,
      meaning: { zh: '更合适的选择', en: 'the option that suits the group’s needs more closely' },
      usage: { zh: 'fit 在此是名词；a good fit 同构。', en: 'Fit is a noun here; a good fit works the same way.' },
      example: { en: 'The group package is the better fit for twenty people.', zh: '二十人的话团体套餐更合适。' },
    },
    {
      phrase: 'within one week', sentenceIndex: 9,
      meaning: { zh: '在一周以内', en: 'before seven days have passed since the original date' },
      usage: { zh: '时间限定搭配；within 后接时段。', en: 'A time-limit collocation; follow within with a period.' },
      example: { en: 'The rain date must be within one week of the booking.', zh: '雨天改期须在预订后一周内。' },
    },
    {
      phrase: 'leave early', sentenceIndex: 14,
      meaning: { zh: '提前离开（活动）', en: 'to go before the whole event finishes' },
      usage: { zh: 'leave early 反义 stay late；后接活动。', en: 'The opposite is stay late; follow with the event.' },
      example: { en: 'Some guests may leave early, so the core group still fits.', zh: '部分客人可能提前离开，核心人数仍够。' },
    },
    {
      phrase: 'on schedule', sentenceIndex: 29,
      meaning: { zh: '按预定时间，进度正常', en: 'keeping to the planned timetable' },
      usage: { zh: 'stay on schedule；反义 behind schedule。', en: 'Stay on schedule; the opposite is behind schedule.' },
      example: { en: 'The friend photos fit if the main shoot stays on schedule.', zh: '主拍摄按计划完成，就有时间拍朋友合影。' },
    },
    {
      phrase: 'stand out', sentenceIndex: 27,
      meaning: { zh: '突出，显眼', en: 'to be clearly visible against the surrounding colour' },
      usage: { zh: '面部、物品显眼；stand out from the crowd。', en: 'Used for faces or objects; stand out from the crowd is an idiom.' },
      example: { en: 'Dark outfits help the faces stand out in the group shot.', zh: '深色服装让集体照里的脸更显眼。' },
    },
  ],
  tips: [
    {
      title: { zh: '套餐时长别被另一档带偏', en: 'Do not let the shorter slot steal the session answer' },
      body: {
        zh: '第 1 题问标准套餐时长，句 3 同时给出九十分钟档和四十五分钟档。听到另一档时长时先标为干扰，确认题干问的是 group package 再填 ninety。选择题同理，优先匹配题干对象。',
        en: 'Item 1 asks the standard package length, and sentence 3 offers both ninety and forty-five minutes. Mark the other slot as a distractor, confirm the stem says group package, then write ninety. Match the stem subject before choosing in single-choice items.',
      },
    },
    {
      title: { zh: '预览与全片交付分开记', en: 'Keep the preview and the final delivery separate' },
      body: {
        zh: '第 5 题问最终交付时间，句 11 先说三天出预览、再说十天给全片。录音常把早到的小样和最终成品放在同一句，听到 preview、small set 时知道这不是 delivery 答案。',
        en: 'Item 5 asks final delivery; sentence 11 gives a three-day preview before the ten-day full delivery. Recordings often place an early sample beside the finished product; when you hear preview or small set, know it is not the delivery answer.',
      },
    },
    {
      title: { zh: '人数区分核心成员与总人数', en: 'Separate the core group from the total' },
      body: {
        zh: '第 6 题问总人数，句 14 先说 around twenty，再补充核心十八九人。选择题干扰项常把核心数当总数，听时把 total、core、some guests 三个标签分开记。',
        en: 'Item 6 asks the total, and sentence 14 says around twenty before adding an eighteen or nineteen core. Distractors often treat the core as the total; keep total, core and some guests in separate notes.',
      },
    },
  ],
};
