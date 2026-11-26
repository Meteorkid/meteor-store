import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 28 · Part 2 — 会议中心指引（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：注册台、分会场楼层、茶歇区与网络密码（表格 11–14）→ 海报规则、午餐地点与疏散路线（单选 15–17）
 * → 胸牌、海报与电脑包的放置（配对 18–20）。题块顺序与录音一致。
 */
export const test28Part2: ListeningLesson = {
  slug: 'test-28-part-2',
  part: 2,
  status: 'published',
  title: { zh: '会议中心指引', en: 'Orienting delegates at a conference venue' },
  summary: {
    zh: '会场女协调员向与会者介绍注册台开放时间、C4 分会场所在楼层、茶歇所在中庭、网络密码印在胸牌上，随后讲海报保留规则、午餐地点、警报疏散路线，以及胸牌、海报和电脑包各自应放的位置。',
    en: 'The venue coordinator briefs delegates on the registration opening time, the floor of breakout room C4, the atrium tea break, the badge-printed Wi-Fi password, the poster rule, the lunch location, the evacuation route, and where the badge, poster and laptop bag belong.',
  },
  accent: { zh: '协调员为英式口音。', en: 'The coordinator speaks with a British accent.' },
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Facility', 'Detail'],
      rows: [
        { lead: 'Registration desk', cells: [[{ text: 'opens at ' }, { blank: 11 }]] },
        { lead: 'Room C4', cells: [[{ text: 'on the ' }, { blank: 12 }]] },
        { lead: 'Tea break', cells: [[{ text: 'served in the ' }, { blank: 13 }]] },
        { lead: 'Wi-Fi password', cells: [[{ text: 'printed on the ' }, { blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What rule applies to the posters?',
          options: [
            { key: 'A', text: 'Presenters remove them after lunch.' },
            { key: 'B', text: 'They remain on the stands until the end of the day.' },
            { key: 'C', text: 'They are taken down before the lunch break.' },
          ],
        },
        {
          number: 16,
          stem: 'Where is lunch served?',
          options: [
            { key: 'A', text: 'the garden café' },
            { key: 'B', text: 'the ground-floor canteen' },
            { key: 'C', text: 'the atrium coffee bar' },
          ],
        },
        {
          number: 17,
          stem: 'Which route should delegates take if the alarm sounds?',
          options: [
            { key: 'A', text: 'use the lifts to the main lobby' },
            { key: 'B', text: 'follow the side corridor to the east exit' },
            { key: 'C', text: 'gather by the registration desk' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Where should each item be kept? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'on the registration desk counter' },
        { key: 'B', text: 'on the poster board near the window' },
        { key: 'C', text: 'in the cloakroom locker' },
        { key: 'D', text: 'on the conference website' },
        { key: 'E', text: 'beside the water station' },
        { key: 'F', text: 'in the lecture hall lectern' },
      ],
      items: [
        { number: 18, text: 'the name badge' },
        { number: 19, text: 'the printed poster' },
        { number: 20, text: 'the laptop bag' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['eight thirty'], evidence: 4,
      explanation: {
        zh: '定位句 4：Registration opens at eight thirty。表格已印 opens at，缺的是时间 eight thirty；句 1 的 until half past eight 是协调员在岗时段，不是开放时间。',
        en: 'Sentence 4: "Registration opens at eight thirty". Opens at is printed, so the missing time is eight thirty. Until half past eight in sentence 1 is the coordinator’s duty period, not the opening time.',
      },
    },
    {
      number: 12, accepted: ['second floor'], evidence: 7,
      explanation: {
        zh: '定位句 7：The data panel room, on the second floor, sits opposite the staircase。空格前已印 on the，填楼层 second floor；句 6 的 colours 是房间标识方式，不是楼层。',
        en: 'Sentence 7: "The data panel room, on the second floor, sits opposite the staircase". On the is printed, so the floor is second floor. Colours in sentence 6 label rooms; they are not a floor.',
      },
    },
    {
      number: 13, accepted: ['atrium'], evidence: 8,
      explanation: {
        zh: '定位句 8：Tea and coffee are served in the atrium between the morning sessions。空格前已印 in the，填地点 atrium；句 9 的 coats 是存放物，不是茶歇地点。',
        en: 'Sentence 8: "Tea and coffee are served in the atrium between the morning sessions". In the is printed, so the place is atrium. Coats in sentence 9 are stored items, not the tea-break location.',
      },
    },
    {
      number: 14, accepted: ['badge'], evidence: 10,
      explanation: {
        zh: '定位句 10：the password is printed on the badge you collect at registration。空格前已印 printed on the，填 badge；句 5 的 stewards 是检票人员，不是密码载体。',
        en: 'Sentence 10: "the password is printed on the badge you collect at registration". Printed on the is printed, so the item is badge. Stewards in sentence 5 check the door; they do not carry the password.',
      },
    },
    {
      number: 15, accepted: ['B'], evidence: 15,
      explanation: {
        zh: '定位句 15：The posters should stay up until the end of the day。海报保留到当天结束对应 B；A 的午饭后取下与句中 do not remove after lunch 相反，C 的午餐前撤下在讲解中未出现。',
        en: 'Sentence 15: "The posters should stay up until the end of the day". Keeping posters all day matches B. Removing after lunch in A contradicts do not remove after lunch in the same sentence, and taking them down before lunch in C is never mentioned.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：Lunch itself is served in the garden café, through the side door。花园咖啡馆对应 A；B 的底层食堂句 16 明确本周不对与会者开放，C 的中庭咖啡吧只供应饮品（句 29）。',
        en: 'Sentence 16: "Lunch itself is served in the garden café, through the side door". The garden café matches A. The ground-floor canteen in B is closed to delegates this week, and the atrium bar in C serves drinks only in sentence 29.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 17,
      explanation: {
        zh: '定位句 17：leave by the side corridor and follow the green signs to the east exit。侧走廊到东门对应 B；A 的乘电梯被句中 Do not use the lifts 排除，C 的注册台不是集合点，集合点在大门旁花园。',
        en: 'Sentence 17: "leave by the side corridor and follow the green signs to the east exit". The side corridor to the east exit matches B. The lifts in A are ruled out by Do not use the lifts, and the registration desk in C is not the assembly point; delegates gather in the garden.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 19,
      explanation: {
        zh: '定位句 19：Your name badge stays on the registration desk counter until you collect it。胸牌放在注册台台面对应 A；D 的网站只列议程，不是胸牌处。',
        en: 'Sentence 19: "Your name badge stays on the registration desk counter until you collect it". The badge stays on the desk counter, matching A. The website in D lists the programme; it is not where badges are kept.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 20,
      explanation: {
        zh: '定位句 20：Your printed poster goes on the poster board near the window。打印海报放窗边海报板对应 B；E 的饮水站旁是放水瓶的位置，不是海报处。',
        en: 'Sentence 20: "Your printed poster goes on the poster board near the window". The poster goes on the window board, matching B. The water station in E is for bottles, not posters.',
      },
    },
    {
      number: 20, accepted: ['C'], evidence: 21,
      explanation: {
        zh: '定位句 21：If you bring a laptop bag, leave it in the cloakroom locker beside the entrance。电脑包放进衣帽间储物柜对应 C；F 的讲台是放映文件处，不是存包处。',
        en: 'Sentence 21: "If you bring a laptop bag, leave it in the cloakroom locker beside the entrance". The bag goes in the cloakroom locker, matching C. The lectern in F holds slides; it is not a bag store.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Could I have your attention for a moment, please. The opening plenary begins in ten minutes, and I will point out the main rooms.' },
    { speaker: 'coordinator', text: 'I’m the venue coordinator, and my name is Helen. You can find me by the registration desk until half past eight.' },
    { speaker: 'coordinator', text: 'The venue has two floors. The ground floor holds the main hall, the registration desk and the atrium, while the first floor has the breakout rooms and the poster stands.' },
    { speaker: 'coordinator', text: 'First, the registration desk, on your left as you enter through the main doors.' },
    { speaker: 'coordinator', text: 'Registration opens at eight thirty, and delegates who have not paid in advance can settle their fee there with a card.' },
    { speaker: 'coordinator', text: 'Please collect your badge before the plenary, because the room stewards check it on the door.' },
    { speaker: 'coordinator', text: 'Next, the breakout rooms. Two rooms are on the ground floor, and the four rooms on the second floor are marked by colours rather than numbers.' },
    { speaker: 'coordinator', text: 'The data panel room, on the second floor, sits opposite the staircase.' },
    { speaker: 'coordinator', text: 'Tea and coffee are served in the atrium between the morning sessions, and there are water stations beside each lecture hall.' },
    { speaker: 'coordinator', text: 'The atrium stays open all day, and you can leave coats there, but luggage must go to the cloakroom at the back.' },
    { speaker: 'coordinator', text: 'A note on the internet. The conference Wi-Fi reaches every room, and the password is printed on the badge you collect at registration.' },
    { speaker: 'coordinator', text: 'If the connection drops, go to the help desk beside the main hall, rather than calling the venue office direct.' },
    { speaker: 'coordinator', text: 'That covers the practical rooms. Now a few rules for the poster session.' },
    { speaker: 'coordinator', text: 'Posters go on the stands along the far wall, and each stand shows the presenter’s name and the session title.' },
    { speaker: 'coordinator', text: 'At the lunch break, presenters stand beside their own poster for twenty minutes, so that visitors can ask questions without interrupting the session.' },
    { speaker: 'coordinator', text: 'The posters should stay up until the end of the day. Please do not remove them after lunch, even if your own talk is finished.' },
    { speaker: 'coordinator', text: 'Lunch itself is served in the garden café, through the side door at the back of the atrium. The canteen on the ground floor is closed to conference delegates this week.' },
    { speaker: 'coordinator', text: 'If the alarm sounds, leave by the side corridor and follow the green signs to the east exit. Do not use the lifts, and gather in the garden by the main gate.' },
    { speaker: 'coordinator', text: 'Now for three items you may be carrying around, and where each one belongs.' },
    { speaker: 'coordinator', text: 'Your name badge stays on the registration desk counter until you collect it, and it must be worn for every session.' },
    { speaker: 'coordinator', text: 'Your printed poster goes on the poster board near the window, where the stands are numbered in rows.' },
    { speaker: 'coordinator', text: 'If you bring a laptop bag, leave it in the cloakroom locker beside the entrance, rather than on a seat in the hall.' },
    { speaker: 'coordinator', text: 'Drinks from the atrium are not allowed into the lecture halls, except for water in a sealed bottle.' },
    { speaker: 'coordinator', text: 'The lunch menu offers one vegetarian option and one fish option each day, and any dietary restriction should be noted on the badge slip.' },
    { speaker: 'coordinator', text: 'Presenters who need a slide change can email the file to the room steward an hour before the talk, rather than bringing a memory stick to the lectern.' },
    { speaker: 'coordinator', text: 'The plenary speaker will finish at twelve thirty, and then the first breakout panel starts promptly at two in the afternoon.' },
    { speaker: 'coordinator', text: 'Seating in the breakout rooms is unreserved, so choose a free seat and move on if a room is full.' },
    { speaker: 'coordinator', text: 'The help desk can print missing handouts, and copies of the programme are also displayed on the conference website.' },
    { speaker: 'coordinator', text: 'Speakers should keep to the timing on the programme, because the room chair will signal five minutes before the end.' },
    { speaker: 'coordinator', text: 'The garden café closes at three, but the atrium coffee bar remains open until the last session.' },
    { speaker: 'coordinator', text: 'Accessible toilets are on the ground floor beside the cloakroom, and there is a lift at the end of the main corridor.' },
    { speaker: 'coordinator', text: 'If you feel unwell at any point, ask a steward in the high-visibility jacket, and someone will take you to the quiet room off the atrium.' },
    { speaker: 'coordinator', text: 'The quiet room has comfortable chairs and a water dispenser, and it is kept free of phone calls.' },
    { speaker: 'coordinator', text: 'Photographs of the slides are allowed for your own notes, but please do not record the speakers without asking first.' },
    { speaker: 'coordinator', text: 'Lost property is taken to the registration desk, and items are listed on the board beside the entrance at the end of each day.' },
    { speaker: 'coordinator', text: 'The shuttle bus to the city centre leaves from the main gate every twenty minutes after the last session.' },
    { speaker: 'coordinator', text: 'That is the main orientation. Please check the programme for your own panel room, and ask a steward if any door looks locked.' },
    { speaker: 'coordinator', text: 'The programme also lists each panel’s room number and the time it begins.' },
    { speaker: 'coordinator', text: 'If you lose your way between sessions, follow the coloured signs on the wall.' },
    { speaker: 'coordinator', text: 'I’ll be at the desk until the plenary starts, so feel free to ask anything before then.' },
    { speaker: 'coordinator', text: 'Enjoy the morning, and I will be near the registration desk until the plenary begins.' },
  ],
  vocabulary: [
    {
      term: 'registration', phonetic: '/ˌredʒɪˈstreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '注册，签到（会议开始前登记到场）', en: 'the process of checking in and collecting a pass at an event' },
      usage: { zh: '可数或不可数；registration desk、registration opens。动词 register。', en: 'Countable or uncountable: registration desk, registration opens. The verb is register.' },
      collocations: ['the registration desk', 'registration opens', 'complete registration'],
      example: { en: 'Collect your badge at the registration desk before the talk.', zh: '开讲前到注册台领取胸牌。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈstreɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'atrium', phonetic: '/ˈɑːtriəm/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '中庭（建筑中央的通透公共区域）', en: 'the open central hall of a large building' },
      usage: { zh: '可数；in the atrium。复数 atria 或 atriums。', en: 'Countable: in the atrium. The plural is atria or atriums.' },
      collocations: ['in the atrium', 'the hotel atrium', 'the atrium coffee bar'],
      example: { en: 'Tea and coffee are served in the atrium between sessions.', zh: '会间茶歇设在中庭。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /riəm/。', en: 'Three syllables, stressed on the first, ending /riəm/.' },
    },
    {
      term: 'breakout', phonetic: '/ˈbreɪkaʊt/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '分会场（大会主题之外的小组讨论室）', en: 'a smaller room for parallel group sessions at a conference' },
      usage: { zh: '复合名词；breakout room、breakout panel。对照 plenary 全体会场。', en: 'Compound: breakout room, breakout panel. Compare plenary.' },
      collocations: ['breakout rooms', 'the breakout panel', 'a breakout session'],
      example: { en: 'The data panel meets in a breakout room on the second floor.', zh: '数据专题在二楼分会场进行。' },
      listening: { zh: '复合词两部分都重读，/aʊ/ 双元音清晰。', en: 'Both parts are stressed; pronounce the /aʊ/ clearly.' },
    },
    {
      term: 'poster', phonetic: '/ˈpəʊstə/', partOfSpeech: 'n.', sentenceIndex: 20,
      meaning: { zh: '海报（学术展示用的展板）', en: 'a display board showing research findings at a conference' },
      usage: { zh: '可数；poster session、poster stand。动词 post 是“张贴”。', en: 'Countable: poster session, poster stand. The verb post means to display.' },
      collocations: ['the poster board', 'the poster session', 'a poster stand'],
      example: { en: 'Presenters stand beside their poster during the lunch break.', zh: '茶歇时作者站在自己的海报旁。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /ə/ 轻读。', en: 'Two syllables, stressed on the first, light final /ə/.' },
    },
    {
      term: 'cloakroom', phonetic: '/ˈkləʊkruːm/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '衣帽间（存放外套和包的房间）', en: 'a room where coats and bags are left during an event' },
      usage: { zh: '可数；cloakroom locker。英式口语中 cloakroom 也指洗手间。', en: 'Countable: cloakroom locker. In British speech it can also mean a toilet.' },
      collocations: ['the cloakroom locker', 'leave it in the cloakroom', 'a cloakroom attendant'],
      example: { en: 'Laptop bags go in the cloakroom locker beside the entrance.', zh: '电脑包放进入口旁的衣帽间储物柜。' },
      listening: { zh: '复合词两部分重读，room 长元音 /uː/。', en: 'Both parts are stressed; keep the long /uː/ in room.' },
    },
    {
      term: 'dietary', phonetic: '/ˈdaɪətəri/', partOfSpeech: 'adj.', sentenceIndex: 23,
      meaning: { zh: '饮食的（与忌口、食物过敏相关）', en: 'relating to food restrictions, allergies or choices' },
      usage: { zh: 'dietary restriction、dietary requirement。名词 diet 是“饮食”。', en: 'Dietary restriction, dietary requirement. The noun is diet.' },
      collocations: ['a dietary restriction', 'dietary requirements', 'dietary needs'],
      example: { en: 'Note any dietary restriction on the badge slip.', zh: '把忌口写在胸牌附条上。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /ri/ 轻读。', en: 'Three syllables, stressed on the first, light final /ri/.' },
    },
  ],
  expressions: [
    {
      phrase: 'settle their fee', sentenceIndex: 4,
      meaning: { zh: '结清费用，付账', en: 'to pay the amount owed at registration' },
      usage: { zh: '及物；settle the fee、settle a bill。fee 可用 card 支付。', en: 'Transitive: settle the fee, settle a bill. It can be paid by card.' },
      example: { en: 'Delegates can settle their fee at the desk with a card.', zh: '与会者可在前台刷卡缴费。' },
    },
    {
      phrase: 'printed on', sentenceIndex: 10,
      meaning: { zh: '印在（某物上）', en: 'shown in writing on a card, board or page' },
      usage: { zh: '被动 be printed on；on 后接载体。', en: 'Passive be printed on; on is followed by the carrier.' },
      example: { en: 'The Wi-Fi password is printed on the badge.', zh: '网络密码印在胸牌上。' },
    },
    {
      phrase: 'stand beside', sentenceIndex: 14,
      meaning: { zh: '站在……旁边', en: 'to remain next to an object or person' },
      usage: { zh: '及物；stand beside the poster。另有“支持”之义。', en: 'Transitive: stand beside the poster. It also means to support.' },
      example: { en: 'Presenters stand beside their own poster for questions.', zh: '作者站在自己海报旁接受提问。' },
    },
    {
      phrase: 'keep to', sentenceIndex: 28,
      meaning: { zh: '遵守，不超出（时限或路线）', en: 'to stay within a limit or follow a plan' },
      usage: { zh: '及物；keep to the timing、keep to the route。', en: 'Transitive: keep to the timing, keep to the route.' },
      example: { en: 'Speakers keep to the timing on the programme.', zh: '演讲者遵守议程时间安排。' },
    },
    {
      phrase: 'lost property', sentenceIndex: 34,
      meaning: { zh: '失物（捡到后待认领的物品）', en: 'items handed in after being left somewhere' },
      usage: { zh: '英式固定说法；美式常说 lost and found。', en: 'British fixed term; American English says lost and found.' },
      example: { en: 'Lost property is taken to the registration desk.', zh: '捡到的物品交到注册台。' },
    },
    {
      phrase: 'high-visibility', sentenceIndex: 31,
      meaning: { zh: '高可见度的（醒目反光外套）', en: 'brightly coloured so a person is easy to see' },
      usage: { zh: '形容词；high-visibility jacket。常缩写为 hi-vis。', en: 'Adjective: high-visibility jacket. Often shortened to hi-vis.' },
      example: { en: 'Ask a steward in the high-visibility jacket for help.', zh: '找穿醒目外套的工作人员求助。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白里的地点要对到楼层', en: 'Match each place to its floor' },
      body: {
        zh: 'Part 2 一段独白会出现多个房间：注册台、B1、B2 在底层，C4 在二楼，中庭在一层。听到 room、floor、opposite 时记下地点和楼层对应关系，表格 12 考的是 C4 所在楼层，别把房间标识颜色填进去。',
        en: 'One monologue lists several rooms: the desk, B1 and B2 on the ground floor, C4 on the second floor, the atrium on one level. Note each place against its floor after room, floor or opposite. Gap 12 asks for C4’s floor; do not fill the colour that labels the rooms.',
      },
    },
    {
      title: { zh: '配对题先记地点介词', en: 'Note the place prepositions' },
      body: {
        zh: '六个配对选项都是地点短语，听前各记一个方位词：on desk、on board、in locker、on website、beside station、in lectern。听到物品名（badge、poster、bag）时直接拿方位词去对，不要整句翻译选项。',
        en: 'All six matching options are place phrases. Note one location word per option: desk, board, locker, website, station, lectern. When you hear badge, poster or bag, match the preposition rather than translating the whole option.',
      },
    },
    {
      title: { zh: '表格答案看空格前后提示词', en: 'Use the words around the gap' },
      body: {
        zh: '第 11 空前是 opens at，填时间；第 12 空前是 on the，填楼层；第 13 空前是 in the，填地点；第 14 空前是 printed on the，填载体。落笔前确认词性和类别，避免把时长或人员名写进去。',
        en: 'Gap 11 follows opens at, so a time fits. Gap 12 follows on the, so a floor fits. Gap 13 follows in the, so a place fits. Gap 14 follows printed on the, so a carrier fits. Confirm the part of speech before writing.',
      },
    },
  ],
};
