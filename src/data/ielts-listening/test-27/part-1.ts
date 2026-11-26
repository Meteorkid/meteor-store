import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 27 · Part 1 — 新人考察婚礼场地（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：可订日期 → 容纳人数 → 餐饮最低消费 → 布置限制 → 订金退还期限，
 * 后半段再谈桌面提供物、计费方式、允许的装饰、迟退订金与蛋糕安排。填空块在前半段，
 * 单选块在后半段，题块顺序与录音顺序一致。
 */
export const test27Part1: ListeningLesson = {
  slug: 'test-27-part-1',
  part: 1,
  status: 'published',
  title: { zh: '考察婚礼场地', en: 'Viewing a wedding venue' },
  summary: {
    zh: '一对新人咨询河边婚礼大厅：了解本季剩余可订的周六日期、最大宾客人数、每人餐饮最低消费、墙面布置限制，以及订金在提前多久取消时可全额退还；随后弄清桌面由场地提供什么、餐饮如何计费、允许使用哪些装饰、迟退订金如何处理，以及蛋糕是否需要自行安排。',
    en: 'A couple asks about a wedding hall: the free Saturday date, the maximum guest number, the per-head catering minimum, wall decoration limits, and the deposit refund window. They then learn what the venue supplies for tables, how catering is charged, which decorations are allowed, what a late deposit does, and whether the cake is arranged separately.',
  },
  accent: { zh: '咨询的新人是美式口音，场地经理是澳式口音。', en: 'The applicant speaks with an American accent and the venue manager with an Australian accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'manager', label: 'MANAGER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
    { id: 'applicant', label: 'APPLICANT', gender: 'female', voice: 'en-US-JennyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Free Saturday: in', cells: [[{ blank: 1 }]] },
        { lead: 'Maximum number of guests:', cells: [[{ blank: 2 }]] },
        { lead: 'Catering minimum per', cells: [[{ blank: 3 }]] },
        { lead: 'Decoration limit: no', cells: [[{ blank: 4 }, { text: ' in the walls.' }]] },
        { lead: 'Deposit refundable if cancelled more than', cells: [[{ blank: 5 }, { text: ' weeks ahead.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'What does the venue provide for the tables?',
          options: [
            { key: 'A', text: 'tablecloths and centrepieces' },
            { key: 'B', text: 'linen and napkins' },
            { key: 'C', text: 'flowers for every table' },
          ],
        },
        {
          number: 7,
          stem: 'How is the catering charged?',
          options: [
            { key: 'A', text: 'as a fixed menu per guest' },
            { key: 'B', text: 'as a buffet people serve themselves' },
            { key: 'C', text: 'by the total weight of the meal' },
          ],
        },
        {
          number: 8,
          stem: 'Which decoration are couples allowed to use?',
          options: [
            { key: 'A', text: 'tape on the plaster walls' },
            { key: 'B', text: 'nails in the painted walls' },
            { key: 'C', text: 'balloons on the floor' },
          ],
        },
        {
          number: 9,
          stem: 'What happens to the deposit if the booking is cancelled late?',
          options: [
            { key: 'A', text: 'It is returned within two weeks.' },
            { key: 'B', text: 'It is kept by the venue.' },
            { key: 'C', text: 'It is reduced by half.' },
          ],
        },
        {
          number: 10,
          stem: 'What must couples arrange themselves?',
          options: [
            { key: 'A', text: 'the wedding cake' },
            { key: 'B', text: 'the table cutlery' },
            { key: 'C', text: 'the chair setting' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['June'], evidence: 3,
      explanation: {
        zh: '定位句 3：The one free date left is a Saturday in June, the fourteenth。剩余可订的周六在六月；句 2 提到多数夏季周六已订出，summer 是被排除的时段。',
        en: 'Sentence 3: "The one free date left is a Saturday in June, the fourteenth". The free Saturday is in June; most summer Saturdays are already gone in sentence 2, so summer is the excluded period.',
      },
    },
    {
      number: 2, accepted: ['eighty', '80'], evidence: 5,
      explanation: {
        zh: '定位句 5：It holds up to eighty guests。场地最多容纳八十位宾客；句 6 新人猜的 a hundred 是被现场规模否定的干扰数。',
        en: 'Sentence 5: "It holds up to eighty guests". The capacity is eighty; the couple’s guess of a hundred in sentence 6 is ruled out against the actual room size.',
      },
    },
    {
      number: 3, accepted: ['head'], evidence: 8,
      explanation: {
        zh: '定位句 8：there is a catering minimum per head, and the current figure is forty pounds each。最低消费按每人计算，填 head；figure 指金额，不是计费单位。',
        en: 'Sentence 8: "there is a catering minimum per head, and the current figure is forty pounds each". The minimum is charged per person, so write head; figure means the amount, not the unit.',
      },
    },
    {
      number: 4, accepted: ['nails'], evidence: 12,
      explanation: {
        zh: '定位句 12：The walls are freshly painted, so no nails in the walls。墙面禁止钉钉子；tape 是句 12 同句被禁止的另一项，不是答案。',
        en: 'Sentence 12: "The walls are freshly painted, so no nails in the walls". Nails are banned from the walls; tape in the same sentence is another banned item, not the answer.',
      },
    },
    {
      number: 5, accepted: ['four', '4'], evidence: 18,
      explanation: {
        zh: '定位句 18：If you cancel more than four weeks ahead, the deposit comes back in full。提前四周以上取消可全额退订金；句 20 的后期取消不退，是反面条件。',
        en: 'Sentence 18: "If you cancel more than four weeks ahead, the deposit comes back in full". A cancellation more than four weeks ahead gets the full deposit back; the later cancellation in sentence 20 is the opposite condition.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 24,
      explanation: {
        zh: '定位句 24：We provide linen and napkins for every table, along with the glassware and cutlery。场地提供亚麻桌布与餐巾，对应 B。A 的 centrepieces 在句 26 归新人自备，C 的鲜花是允许布置而非场地提供。',
        en: 'Sentence 24: "We provide linen and napkins for every table, along with the glassware and cutlery". The venue supplies linen and napkins, matching B. Centrepieces in sentence 26 are the couple’s choice, and flowers are allowed decor rather than supplied.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 28,
      explanation: {
        zh: '定位句 28：The food is charged as a fixed menu per guest, rather than a buffet people serve themselves。餐饮按固定菜单每人计费，对应 A。B 的自助餐正是 rather than 否定的形式，C 按重量在录音中未出现。',
        en: 'Sentence 28: "The food is charged as a fixed menu per guest, rather than a buffet people serve themselves". Catering is a fixed menu per guest, matching A. The buffet is the form rejected after rather than, and charging by weight is never mentioned.',
      },
    },
    {
      number: 8, accepted: ['C'], evidence: 32,
      explanation: {
        zh: '定位句 32：Balloons on the floor are fine, and streamers above the door are allowed。地面气球可以使用，对应 C。A 的胶带与 B 的钉子在句 12 已被禁止。',
        en: 'Sentence 32: "Balloons on the floor are fine, and streamers above the door are allowed". Floor balloons are permitted, matching C. Tape and nails were both banned in sentence 12.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：Then the venue keeps the deposit, because we would have turned away other bookings by that stage。迟于期限取消，订金由场地保留，对应 B。A 的两周内退还与 C 的减半在录音中都没有依据。',
        en: 'Sentence 20: "Then the venue keeps the deposit, because we would have turned away other bookings by that stage". A late cancellation means the venue keeps the deposit, matching B. A two-week refund and a half reduction have no basis in the recording.',
      },
    },
    {
      number: 10, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：the wedding cake is something couples arrange themselves, usually through a baker。蛋糕需新人自行安排，对应 A。B 的餐具由场地提供，C 的椅子在句 38 由场地在上午摆好。',
        en: 'Sentence 36: "the wedding cake is something couples arrange themselves, usually through a baker". The cake is arranged separately, matching A. Cutlery is supplied by the venue, and chairs are set by the venue in sentence 38.',
      },
    },
  ],
  transcript: [
    { speaker: 'applicant', text: 'We are looking around for a venue for our wedding, and your hall came up online.' },
    { speaker: 'manager', text: 'Welcome in. I’m Daniel, the venue manager, and I’ll walk you through the room and the booking terms.' },
    { speaker: 'applicant', text: 'Thank you. First, what Saturdays do you still have open this year?' },
    { speaker: 'manager', text: 'Most summer Saturdays are gone. The one free date left is a Saturday in June, the fourteenth.' },
    { speaker: 'applicant', text: 'June fourteenth. That is earlier than we hoped, but let us keep it in mind.' },
    { speaker: 'manager', text: 'It holds up to eighty guests, and the tables can be pushed together for a long top table.' },
    { speaker: 'applicant', text: 'Eighty. We had guessed a hundred might be tight, so that settles it.' },
    { speaker: 'applicant', text: 'What does the food cost? Is there a minimum you have to spend?' },
    { speaker: 'manager', text: 'Yes, there is a catering minimum per head, and the current figure is forty pounds each, before the cake.' },
    { speaker: 'applicant', text: 'Forty a head. Does that include room hire?' },
    { speaker: 'manager', text: 'Room hire is separate, but the minimum covers the three course meal and coffee for every guest.' },
    { speaker: 'applicant', text: 'Now the decorations. What are we not allowed to do in here?' },
    { speaker: 'manager', text: 'The walls are freshly painted, so no nails in the walls, and you cannot tape anything directly to the plaster.' },
    { speaker: 'applicant', text: 'What about flowers on the tables?' },
    { speaker: 'manager', text: 'Flowers are welcome on every table. The only line you cannot cross is the wall itself.' },
    { speaker: 'applicant', text: 'And the deposit to hold the date?' },
    { speaker: 'manager', text: 'You pay a deposit of two hundred pounds when you sign the booking form.' },
    { speaker: 'applicant', text: 'Is that money returned if we have to cancel?' },
    { speaker: 'manager', text: 'It depends on the timing. If you cancel more than four weeks ahead, the deposit comes back in full.' },
    { speaker: 'applicant', text: 'Four weeks. And if it is later than that?' },
    { speaker: 'manager', text: 'Then the venue keeps the deposit, because we would have turned away other bookings by that stage.' },
    { speaker: 'applicant', text: 'That is fair enough. Let me ask a few practical points.' },
    { speaker: 'manager', text: 'Go ahead.' },
    { speaker: 'applicant', text: 'What do you lay on the tables for us?' },
    { speaker: 'manager', text: 'We provide linen and napkins for every table, along with the glassware and cutlery.' },
    { speaker: 'applicant', text: 'So we do not need to bring tablecloths.' },
    { speaker: 'manager', text: 'Correct. What we do not supply are the centrepieces, those are your choice.' },
    { speaker: 'applicant', text: 'How is the catering charged overall?' },
    { speaker: 'manager', text: 'The food is charged as a fixed menu per guest, rather than a buffet people serve themselves.' },
    { speaker: 'applicant', text: 'A fixed menu, then. Can guests choose a main on the day?' },
    { speaker: 'manager', text: 'They choose between two mains when they reply to your invitation, so the kitchen knows the numbers.' },
    { speaker: 'applicant', text: 'You mentioned flowers. What other decorations are we allowed to hang?' },
    { speaker: 'manager', text: 'Balloons on the floor are fine, and streamers above the door are allowed, but nothing fixes to a nail in the wall.' },
    { speaker: 'applicant', text: 'I see. What about the deposit, once the day is confirmed?' },
    { speaker: 'manager', text: 'If the booking runs to the date, the deposit is taken off the final bill. A late cancellation, as I said, means we keep it.' },
    { speaker: 'applicant', text: 'Is the cake part of the catering menu?' },
    { speaker: 'manager', text: 'No, the wedding cake is something couples arrange themselves, usually through a baker, and we just provide the stand and knife.' },
    { speaker: 'applicant', text: 'Do you charge for setting up the chairs the night before?' },
    { speaker: 'manager', text: 'The venue sets the chairs and tables the morning itself, and that is included in the room hire.' },
    { speaker: 'applicant', text: 'One last thing, can we bring our own music?' },
    { speaker: 'manager', text: 'A playlist is fine, but a live band has to be agreed with us, because of the noise limit.' },
    { speaker: 'applicant', text: 'Thank you, Daniel. We will talk it over and send the form if the date suits.' },
    { speaker: 'manager', text: 'Fine. The June fourteenth booking will stay open until the end of the week.' },
    { speaker: 'applicant', text: 'That gives us enough time to decide.' },
  ],
  vocabulary: [
    {
      term: 'venue', phonetic: '/ˈvenjuː/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '场地，举办场所', en: 'the hall or building used for an event' },
      usage: { zh: '可数名词；wedding venue、the venue manager、book a venue。', en: 'Countable: wedding venue, the venue manager, book a venue.' },
      collocations: ['a wedding venue', 'the venue manager', 'book the venue'],
      example: { en: 'We are looking around for a venue for our wedding.', zh: '我们正在四处看婚礼场地。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /juː/。', en: 'Two syllables with first-syllable stress; the ending /juː/.' },
    },
    {
      term: 'minimum', phonetic: '/ˈmɪnɪməm/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '最低额，最低消费', en: 'the smallest amount you must spend or pay' },
      usage: { zh: '可数名词；catering minimum、minimum spend。形容词 minimal。', en: 'Countable: catering minimum, minimum spend. The adjective is minimal.' },
      collocations: ['the catering minimum', 'a minimum spend', 'the minimum per head'],
      example: { en: 'There is a catering minimum per head for the evening.', zh: '晚宴按人头设有餐饮最低消费。' },
      listening: { zh: '三个音节，重音在第一个；结尾 /əm/ 弱读。', en: 'Three syllables with first-syllable stress; the ending is weak /əm/.' },
    },
    {
      term: 'deposit', phonetic: '/dɪˈpɒzɪt/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '订金，押金', en: 'an initial payment that holds the booking' },
      usage: { zh: '可数名词；pay a deposit、refund the deposit、keep the deposit。', en: 'Countable: pay a deposit, refund the deposit, keep the deposit.' },
      collocations: ['pay a deposit', 'the deposit comes back', 'keep the deposit'],
      example: { en: 'You pay a deposit when you sign the booking form.', zh: '签预订表时需要付订金。' },
      listening: { zh: '重音在第二音节 /ˈpɒz/；开头 /dɪ/ 很弱。', en: 'Stress the second syllable; the opening /dɪ/ is weak.' },
    },
    {
      term: 'linen', phonetic: '/ˈlɪnɪn/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '亚麻桌布（布质餐桌用品）', en: 'the cloths and napkins laid on a table' },
      usage: { zh: '不可数；provide linen、table linen。napkins 是餐巾。', en: 'Uncountable: provide linen, table linen. Napkins are the cloth serviettes.' },
      collocations: ['linen and napkins', 'table linen', 'clean linen'],
      example: { en: 'We provide linen and napkins for every table.', zh: '每张桌子都配好桌布和餐巾。' },
      listening: { zh: '两个音节，重音在第一个；/lɪ/ 清晰。', en: 'Two syllables with first-syllable stress; listen for /lɪ/.' },
    },
    {
      term: 'centrepieces', phonetic: '/ˈsentəpiːsɪz/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '桌面中央装饰摆件（复数）', en: 'the arrangements placed in the middle of tables' },
      usage: { zh: '可数名词复数；table centrepieces、flowers as centrepieces。美式拼写 centerpieces。', en: 'Plural countable: table centrepieces. The American spelling is centerpieces.' },
      collocations: ['the centrepieces', 'table centrepieces', 'flowers as centrepieces'],
      example: { en: 'The centrepieces are something the couple chooses.', zh: '桌面摆件由新人自行挑选。' },
      listening: { zh: '复合词 centre 加 piece，复数词尾 /ɪz/。', en: 'Compound centre plus piece, plural ending /ɪz/.' },
    },
    {
      term: 'cancel', phonetic: '/ˈkænsl/', partOfSpeech: 'v.', sentenceIndex: 18,
      meaning: { zh: '取消（预订）', en: 'to call off a booked event' },
      usage: { zh: '动词；cancel a booking、cancel more than four weeks ahead。名词 cancellation。', en: 'Verb: cancel a booking, cancel four weeks ahead. The noun is cancellation.' },
      collocations: ['cancel the booking', 'cancel ahead of time', 'cancel in full'],
      example: { en: 'If you cancel more than four weeks ahead, the deposit comes back.', zh: '提前四周以上取消可退回订金。' },
      listening: { zh: '两个音节，重音在第一个；/sl/ 收尾。', en: 'Two syllables with first-syllable stress; ending /sl/.' },
    },
    {
      term: 'playlist', phonetic: '/ˈpleɪlɪst/', partOfSpeech: 'n.', sentenceIndex: 40,
      meaning: { zh: '播放曲目单', en: 'a recorded list of songs played through speakers' },
      usage: { zh: '可数名词；bring a playlist、a live band 相对。', en: 'Countable: bring a playlist; the contrast is a live band.' },
      collocations: ['a playlist', 'bring a playlist', 'the wedding playlist'],
      example: { en: 'A playlist is fine, but a live band must be agreed first.', zh: '播放曲目可以，现场乐队需事先同意。' },
      listening: { zh: '复合词 play 加 list，重音在第一个音节。', en: 'Compound play plus list, stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'came up online', sentenceIndex: 0,
      meaning: { zh: '在网上搜到，线上出现', en: 'to be found through an internet search' },
      usage: { zh: 'come up 的过去式；came up online、came up in the search。', en: 'Past of come up: came up online, came up in the search.' },
      example: { en: 'Your hall came up online when we searched venues.', zh: '我们搜场地时在网上看到了你们大厅。' },
    },
    {
      phrase: 'keep it in mind', sentenceIndex: 4,
      meaning: { zh: '记在心上，暂作备选', en: 'to hold a date or option as a possibility' },
      usage: { zh: 'keep something in mind；与 keep in touch 不同。', en: 'Keep something in mind; it differs from keep in touch.' },
      example: { en: 'June fourteenth is earlier than we hoped, but we will keep it in mind.', zh: '六月十四日偏早，不过我们先记下来。' },
    },
    {
      phrase: 'pushed together', sentenceIndex: 5,
      meaning: { zh: '拼到一起（桌子并排）', en: 'moved next to each other to form one long table' },
      usage: { zh: 'push together 的被动；tables pushed together、chairs pushed together。', en: 'Passive of push together: tables pushed together, chairs pushed together.' },
      example: { en: 'The tables can be pushed together for a top table.', zh: '桌子可以拼成一张主桌。' },
    },
    {
      phrase: 'keeps the deposit', sentenceIndex: 20,
      meaning: { zh: '保留订金（不退）', en: 'retains the deposit instead of returning it' },
      usage: { zh: 'keep 加宾语；the venue keeps the deposit、keep the money。', en: 'Keep plus object: the venue keeps the deposit, keep the money.' },
      example: { en: 'After a late cancellation the venue keeps the deposit.', zh: '迟退订时场地保留订金。' },
    },
    {
      phrase: 'taken off the final bill', sentenceIndex: 34,
      meaning: { zh: '从尾款中抵扣', en: 'deducted from the last amount owed' },
      usage: { zh: 'take off 的被动；taken off the bill、taken off the total。', en: 'Passive of take off: taken off the bill, taken off the total.' },
      example: { en: 'The deposit is taken off the final bill on the day.', zh: '当天订金从尾款中抵扣。' },
    },
    {
      phrase: 'arrange themselves', sentenceIndex: 36,
      meaning: { zh: '自行安排（不由场地包办）', en: 'organised by the couple rather than supplied by the venue' },
      usage: { zh: 'arrange 后接宾语；couples arrange it themselves。', en: 'Arrange takes an object: couples arrange it themselves.' },
      example: { en: 'The cake is something couples arrange themselves.', zh: '蛋糕由新人自己安排。' },
    },
  ],
  tips: [
    {
      title: { zh: '日期先记条件再记月份', en: 'Note the condition before the month' },
      body: {
        zh: '第 1 题问剩余可订日期，句 2 先排除多数夏季周六，句 3 才给出 June。听日期时把被排除的季节和最终月份分开记，避免把 summer 填进空里。',
        en: 'Item 1 asks the free date. Sentence 2 rules out most summer Saturdays, and sentence 3 gives June. Keep the excluded season separate from the final month, so summer is not written into the gap.',
      },
    },
    {
      title: { zh: '自备项与提供项分栏记', en: 'Split supplied items from couple items' },
      body: {
        zh: '第 6 题问场地提供什么，句 24 的 linen and napkins 与句 26 自备的 centrepieces 紧邻出现。听到 provide、supply 就记为场地项，听到 your choice、arrange themselves 就记为新人项。',
        en: 'Item 6 asks what the venue supplies. The linen and napkins in sentence 24 sit next to the self-sourced centrepieces in sentence 26. Mark provide or supply words as venue items, and your choice or arrange themselves as couple items.',
      },
    },
    {
      title: { zh: '退还条件按期限对折', en: 'Split the deposit by the deadline' },
      body: {
        zh: '订金题有两条相反条件：四周以上全额退，四周以内场地保留。第 5 题填空是提前周数，第 9 题单选是迟退结果；听到 more than 与 later than 时分别在题旁标注方向。',
        en: 'The deposit has two opposite conditions: a full refund beyond four weeks, retained by the venue inside that window. Item 5 asks the lead time, item 9 the late outcome; mark each direction beside more than and later than.',
      },
    },
  ],
};
