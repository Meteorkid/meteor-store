import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 7 · Part 2 — 酒店新员工入职说明（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白顺序：班表与换班规则 → 制服分工 → 客房标准 → 投诉处理流程 → 员工餐厅 → 培训日，
 * 后半段集中回答常见疑问：房间未就绪、小投诉、小费、十月培训重点。填空块在前半段，
 * 单选块在后半段，题块顺序与录音顺序一致。
 */
export const test07Part2: ListeningLesson = {
  slug: 'test-07-part-2',
  part: 2,
  status: 'published',
  title: { zh: '酒店新员工入职说明', en: 'Inducting new hotel staff' },
  summary: {
    zh: '值班经理向新员工做入职说明：两班倒的时间与换班规则、制服哪些由酒店提供、客房检查标准、投诉处理流程、员工餐厅安排，以及定期培训日的时间与要求。',
    en: 'A duty manager briefs new hotel staff: the two shifts and swap rules, which uniform items the hotel provides, the room inspection standards, the complaint procedure, the staff restaurant arrangements, and the regular training days.',
  },
  accent: { zh: '培训主管为南非口音，语速偏慢，规则部分会重复强调。', en: 'The trainer speaks with a South African accent at a measured pace, repeating the rules that matter most.' },
  speechRate: '+8%',
  cast: [
    { id: 'trainer', label: 'TRAINER', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Early shift starts at', cells: [[{ blank: 11 }]] },
        { lead: 'Hotel-provided uniform item: a plain white', cells: [[{ blank: 12 }]] },
        { lead: 'Missing bathroom', cells: [[{ blank: 13 }, { text: ' are replaced straight away.' }]] },
        { lead: 'For complaints, take the guest to the', cells: [[{ blank: 14 }]] },
        { lead: 'Staff restaurant opens at', cells: [[{ blank: 15 }]] },
        { lead: 'Training day: every second', cells: [[{ blank: 16 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'What should staff do if a room is not ready when the guest arrives?',
          options: [
            { key: 'A', text: 'Finish the cleaning as quickly as possible.' },
            { key: 'B', text: 'Offer the guest a seat in the lounge with a drink.' },
            { key: 'C', text: 'Send the guest upstairs to inspect the room themselves.' },
          ],
        },
        {
          number: 18,
          stem: 'How should a complaint that seems minor be treated?',
          options: [
            { key: 'A', text: 'It can be left until the next shift.' },
            { key: 'B', text: 'It needs the same procedure as any other complaint.' },
            { key: 'C', text: 'It should be settled directly with the guest.' },
          ],
        },
        {
          number: 19,
          stem: 'What does the trainer say about tips?',
          options: [
            { key: 'A', text: 'They must be handed to reception.' },
            { key: 'B', text: 'They are shared equally among the team.' },
            { key: 'C', text: 'Staff may keep what guests give them.' },
          ],
        },
        {
          number: 20,
          stem: 'What is the main focus of the October training day?',
          options: [
            { key: 'A', text: 'safety procedures' },
            { key: 'B', text: 'the booking system' },
            { key: 'C', text: 'room cleaning standards' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['seven', '7'], evidence: 1,
      explanation: {
        zh: '定位句 1：The early shift starts at seven in the morning。同句的 half past three 是早班下班时间，two 是晚班开始时间，两个数字都不是答案。',
        en: 'Sentence 1: "The early shift starts at seven in the morning". Half past three is the early shift finish time and two is the late shift start; neither is the answer.',
      },
    },
    {
      number: 12, accepted: ['shirt'], evidence: 5,
      explanation: {
        zh: '定位句 5：we provide a plain white shirt and a dark navy apron。空格前已印 plain white，颜色修饰的是 shirt；apron 是深色的，不能填。',
        en: 'Sentence 5: "a plain white shirt and a dark navy apron". The gap follows plain white, which modifies shirt; the apron is navy, so it does not fit.',
      },
    },
    {
      number: 13, accepted: ['toiletries'], evidence: 10,
      explanation: {
        zh: '定位句 10：any missing toiletries are replaced straight away。空格后已给 are replaced，主语是浴室里补齐的用品；towels 在同句是折叠对象，不是被补齐的东西。',
        en: 'Sentence 10: "any missing toiletries are replaced straight away". The gap needs the bathroom supplies that are topped up; towels in the same sentence are folded, not replaced.',
      },
    },
    {
      number: 14, accepted: ['lounge'], evidence: 14,
      explanation: {
        zh: '定位句 14：Take them to the lounge beside reception。投诉要带离拥挤大堂，去的是 lounge；reception 只是 lounge 的位置参照，不是目的地。',
        en: 'Sentence 14: "Take them to the lounge beside reception". Complaints are moved away from the lobby to the lounge; reception only locates the lounge.',
      },
    },
    {
      number: 15, accepted: ['twelve', '12'], evidence: 18,
      explanation: {
        zh: '定位句 18：The staff restaurant opens at twelve and closes at two o’clock。问的是开门时间，two 是关门时间，别填反。',
        en: 'Sentence 18: "The staff restaurant opens at twelve and closes at two o’clock". The question asks for opening time; two is the closing time, so do not reverse them.',
      },
    },
    {
      number: 16, accepted: ['Tuesday'], evidence: 22,
      explanation: {
        zh: '定位句 22：We hold a training day every second Tuesday。every second 后面跟星期几；ninth of October 是下一次具体日期，不是周期。',
        en: 'Sentence 22: "a training day every second Tuesday". Every second is followed by the weekday; the ninth of October is the next date, not the cycle.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：offer a seat in the lounge with a complimentary drink。同义替换：a seat in the lounge with a drink 对应 B。A 与句 27 开头的 Do not rush the cleaning 相反，C 与句 28 的 Never send a guest up 相反。',
        en: 'Sentence 27: "offer a seat in the lounge with a complimentary drink", which matches B. A contradicts Do not rush the cleaning, and C contradicts Never send a guest up in sentence 28.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：Treat every complaint the same way, whether it is a noisy neighbour or a stained sheet。无论大小都走同一流程，对应 B。A 与 same way 相反，C 与句 15 不承诺现场处理相冲突。',
        en: 'Sentence 30: "Treat every complaint the same way, whether it is a noisy neighbour or a stained sheet". The same procedure for all complaints matches B. A contradicts same way, and C conflicts with sentence 15.',
      },
    },
    {
      number: 19, accepted: ['C'], evidence: 32,
      explanation: {
        zh: '定位句 32：you may keep whatever you are given。员工可保留小费，对应 C。A 的上交前台和 B 的团队平分在录音中都被否定；句 33 还要求不要比较金额。',
        en: 'Sentence 32: "you may keep whatever you are given", matching C. Handing tips to reception and sharing them equally are both ruled out, and sentence 33 adds that amounts must not be compared.',
      },
    },
    {
      number: 20, accepted: ['A'], evidence: 36,
      explanation: {
        zh: '定位句 36：The main focus that month is safety procedures。十月培训重点是安全流程。B 的预订系统在句 37 被降级为不深入讲解，C 的客房清洁标准属于日常岗位内容，不在培训日主题里。',
        en: 'Sentence 36: "The main focus that month is safety procedures". The booking system in sentence 37 is explicitly not covered in depth, and cleaning standards are routine job content rather than the training theme.',
      },
    },
  ],
  transcript: [
    { speaker: 'trainer', text: 'Right, can I have everyone’s attention? I’m Leah, the duty manager, and I’ll walk you through the basics before your first shift.' },
    { speaker: 'trainer', text: 'The early shift starts at seven in the morning and finishes at half past three.' },
    { speaker: 'trainer', text: 'The late shift begins at two in the afternoon and runs until half past ten, and you will find your rota on the staff board each Friday.' },
    { speaker: 'trainer', text: 'If you need to swap a day with a colleague, speak to the duty manager at least three days beforehand, not on the morning itself.' },
    { speaker: 'trainer', text: 'Now, the uniform.' },
    { speaker: 'trainer', text: 'On the ground floor we provide a plain white shirt and a dark navy apron, and those two items stay with the hotel.' },
    { speaker: 'trainer', text: 'You do need to bring your own black trousers or skirt, along with closed shoes that have a low heel.' },
    { speaker: 'trainer', text: 'There is a laundry basket at the back of the housekeeping room, so please do not take the hotel shirts home to wash.' },
    { speaker: 'trainer', text: 'Next, the room standards, which is the part guests notice most during their stay.' },
    { speaker: 'trainer', text: 'Every room must be checked from the entrance to the window before you mark it ready for the next guest.' },
    { speaker: 'trainer', text: 'The bathroom towels must be folded in the way shown in the training video, and any missing toiletries are replaced straight away.' },
    { speaker: 'trainer', text: 'If you find a broken lamp or a leaking tap, report it to maintenance rather than trying to fix it yourself.' },
    { speaker: 'trainer', text: 'Now, complaints.' },
    { speaker: 'trainer', text: 'A guest who complains is usually upset about one specific thing, and the first rule is to stay calm and let them finish speaking.' },
    { speaker: 'trainer', text: 'Take them to the lounge beside reception, away from the crowded lobby, so the conversation does not disturb other guests.' },
    { speaker: 'trainer', text: 'Do not argue with a guest, and do not promise a refund or an upgrade on the spot.' },
    { speaker: 'trainer', text: 'Note the details on a complaint form and hand it to the duty manager, who will call the guest back the same day.' },
    { speaker: 'trainer', text: 'Moving on to the facilities we provide for staff.' },
    { speaker: 'trainer', text: 'The staff restaurant opens at twelve and closes at two o’clock, so eat during your own break rather than while you are on duty.' },
    { speaker: 'trainer', text: 'The hot meal changes each day, and there is always soup, bread and fresh fruit on the side table for anyone who prefers something lighter.' },
    { speaker: 'trainer', text: 'You may not take food out of the restaurant into the guest areas, and mobile phones should be kept silent during meals.' },
    { speaker: 'trainer', text: 'Finally, training.' },
    { speaker: 'trainer', text: 'We hold a training day every second Tuesday, and the next one is on the ninth of October.' },
    { speaker: 'trainer', text: 'Attendance is required for all new staff during their first month, and you will receive the schedule by email a week beforehand.' },
    { speaker: 'trainer', text: 'On that day we cover guest safety, fire procedures and how to use the booking system.' },
    { speaker: 'trainer', text: 'Now a few questions I am often asked in this first briefing.' },
    { speaker: 'trainer', text: 'What if a room is not ready when the guest arrives early?' },
    { speaker: 'trainer', text: 'Do not rush the cleaning just to finish in time. Tell the guest the room will be ready within twenty minutes, and offer a seat in the lounge with a complimentary drink.' },
    { speaker: 'trainer', text: 'Never send a guest up to a half-cleaned room, even if they insist on seeing it straight away.' },
    { speaker: 'trainer', text: 'How should you deal with a complaint that seems minor at first?' },
    { speaker: 'trainer', text: 'Treat every complaint the same way, whether it is a noisy neighbour or a stained sheet. Small issues ignored early tend to become serious ones later.' },
    { speaker: 'trainer', text: 'What about tips?' },
    { speaker: 'trainer', text: 'Tips are entirely up to the guest, and you may keep whatever you are given in cash or through the card machine.' },
    { speaker: 'trainer', text: 'Do not mention tips to guests, and do not compare amounts with your colleagues during a shift.' },
    { speaker: 'trainer', text: 'If a guest offers money in exchange for an upgrade, politely refer them to reception rather than handling it yourself.' },
    { speaker: 'trainer', text: 'And the training day in October, what will it cover in depth?' },
    { speaker: 'trainer', text: 'The main focus that month is safety procedures, because the winter conference season brings much larger groups through the hotel.' },
    { speaker: 'trainer', text: 'You will practise evacuating your floor and carrying the first aid kit, rather than looking at the booking system in detail.' },
    { speaker: 'trainer', text: 'One last practical point about identification.' },
    { speaker: 'trainer', text: 'Your name badge must be worn at chest level at all times, and it should be clearly visible from the corridor.' },
    { speaker: 'trainer', text: 'If you lose it, report it to the office the same day, because replacements are not issued after the shift ends.' },
    { speaker: 'trainer', text: 'Any questions so far?' },
    { speaker: 'trainer', text: 'No, then please collect your uniform from the store room at the end of this briefing.' },
    { speaker: 'trainer', text: 'The store room is next to the staff entrance, and it stays open until four this afternoon.' },
  ],
  vocabulary: [
    {
      term: 'rota', phonetic: '/ˈrəʊtə/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '值班排班表', en: 'a list showing who works on which days and shifts' },
      usage: { zh: '英式常用词，美式多称 schedule；on the rota、check the rota。', en: 'British for schedule; on the rota, check the rota.' },
      collocations: ['the staff rota', 'on the rota', 'the weekly rota'],
      example: { en: 'Your name appears on the rota for the early shift on Friday.', zh: '排班表上周五早班有你的名字。' },
      listening: { zh: '两个音节，重音在第一个；与 rotor（旋翼）拼写相近但读音不同。', en: 'Two syllables, stress on the first; do not confuse it with rotor.' },
    },
    {
      term: 'apron', phonetic: '/ˈeɪprən/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '围裙，工作围裙', en: 'a cloth worn over the front of the uniform to keep it clean' },
      usage: { zh: '可数名词；酒店、厨房、手工场景常见。', en: 'Countable; common in hotels, kitchens and craft settings.' },
      collocations: ['a dark apron', 'put on an apron', 'a work apron'],
      example: { en: 'The waiter tied his apron before taking the orders.', zh: '服务员系好围裙才去接单。' },
      listening: { zh: '首音节读 /eɪ/，不是 /æ/。', en: 'The first syllable is /eɪ/, not /æ/.' },
    },
    {
      term: 'toiletries', phonetic: '/ˈtɔɪlətriːz/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '洗漱用品，卫浴用品', en: 'small products such as soap, shampoo and toothpaste used in the bathroom' },
      usage: { zh: '只用复数；酒店客房补齐的洗发水、香皂等统称 toiletries。', en: 'Always plural; covers shampoo, soap and similar bathroom products.' },
      collocations: ['missing toiletries', 'provide toiletries', 'hotel toiletries'],
      example: { en: 'The guest asked for more toiletries in the bathroom.', zh: '客人要求再补一些浴室用品。' },
      listening: { zh: '三个音节，重音在第一个；结尾 -ies 读 /triːz/。', en: 'Three syllables with first-syllable stress; the ending is /triːz/.' },
    },
    {
      term: 'maintenance', phonetic: '/ˈmeɪntənəns/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '维修部门；维护保养', en: 'the department that repairs equipment, or the work of keeping things in order' },
      usage: { zh: '不可数；report it to maintenance 指报修。形容词是 maintenance-free。', en: 'Uncountable: report it to maintenance. The adjective is maintenance-free.' },
      collocations: ['report to maintenance', 'the maintenance team', 'routine maintenance'],
      example: { en: 'Maintenance fixed the leaking tap the same afternoon.', zh: '维修部当天下午就修好了漏水的龙头。' },
      listening: { zh: '三个音节，重音在第一个；中间的 -ten- 弱读成 /tən/。', en: 'Three syllables with first-syllable stress; the middle is a weak /tən/.' },
    },
    {
      term: 'lounge', phonetic: '/laʊndʒ/', partOfSpeech: 'n.', sentenceIndex: 14,
      meaning: { zh: '休息厅，等候室', en: 'a comfortable room where guests can sit and wait' },
      usage: { zh: '可数名词；hotel lounge、departure lounge。与 lobby（大堂）位置相邻但不同。', en: 'Countable: hotel lounge, departure lounge. Adjacent to but distinct from the lobby.' },
      collocations: ['the hotel lounge', 'wait in the lounge', 'a guest lounge'],
      example: { en: 'We waited in the lounge until our room was ready.', zh: '我们在休息厅等到房间准备好。' },
      listening: { zh: '双元音 /aʊ/ 开头，结尾是 /ndʒ/，不要漏听 /d/。', en: 'Opens with /aʊ/ and ends in /ndʒ/; do not drop the /d/.' },
    },
    {
      term: 'complimentary', phonetic: '/ˌkɒmplɪˈmentri/', partOfSpeech: 'adj.', sentenceIndex: 27,
      meaning: { zh: '免费赠送的', en: 'given free as part of a service' },
      usage: { zh: '酒店高频词：a complimentary drink、complimentary breakfast。注意与 complementary（互补的）拼写区分。', en: 'Common in hotels: a complimentary drink. Do not confuse it with complementary.' },
      collocations: ['a complimentary drink', 'complimentary breakfast', 'complimentary tickets'],
      example: { en: 'Guests receive a complimentary bottle of water.', zh: '客人会收到一瓶免费矿泉水。' },
      listening: { zh: '五个音节，重音在第三个 /ˈmen/。', en: 'Five syllables with stress on the third.' },
    },
    {
      term: 'evacuating', phonetic: '/ɪˈvækjueɪtɪŋ/', partOfSpeech: 'v.', sentenceIndex: 37,
      meaning: { zh: '疏散，撤离（楼层）', en: 'moving people out of a building to a safe place' },
      usage: { zh: '动词 evacuate 的现在分词；evacuate the floor、evacuate the building。', en: 'Present participle of evacuate: evacuate the floor or the building.' },
      collocations: ['evacuate the floor', 'evacuate the building', 'evacuation drill'],
      example: { en: 'Staff practise evacuating the floor once a year.', zh: '员工每年演练一次楼层疏散。' },
      listening: { zh: '重音在第二音节 /ˈvæk/；开头 /ɪ/ 很弱，别漏掉。', en: 'Stress the second syllable; the opening /ɪ/ is weak but present.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk you through', sentenceIndex: 0,
      meaning: { zh: '带你逐项过一遍', en: 'to explain something step by step' },
      usage: { zh: '及物短语动词；walk somebody through the basics、through the procedure。', en: 'Transitive: walk somebody through the basics or the procedure.' },
      example: { en: 'I’ll walk you through the booking system this afternoon.', zh: '今天下午我带你把预订系统过一遍。' },
    },
    {
      phrase: 'swap a day', sentenceIndex: 3,
      meaning: { zh: '调换班次（与同事对调某天）', en: 'to exchange a working day with a colleague' },
      usage: { zh: 'swap 后接 days、shifts、places；swap with somebody。', en: 'Swap takes days, shifts or places; swap with somebody.' },
      example: { en: 'Can I swap my day off with you next week?', zh: '下周我能跟你调个休息日吗？' },
    },
    {
      phrase: 'on the spot', sentenceIndex: 15,
      meaning: { zh: '当场，现场', en: 'immediately, at the place where the problem happens' },
      usage: { zh: '常与 decide、promise、settle 搭配；not on the spot 表示不能现场拍板。', en: 'Often with decide, promise or settle; not on the spot means no on-the-spot decision.' },
      example: { en: 'The manager cannot approve refunds on the spot.', zh: '经理不能当场批准退款。' },
    },
    {
      phrase: 'moving on to', sentenceIndex: 17,
      meaning: { zh: '接下来讲，转到（下一话题）', en: 'turning to the next topic' },
      usage: { zh: '独白里的段落信号词；后接名词或动名词。', en: 'A monologue signpost; followed by a noun or gerund.' },
      example: { en: 'Moving on to the training schedule, here is next month’s list.', zh: '接下来讲培训安排，这是下个月的清单。' },
    },
    {
      phrase: 'on duty', sentenceIndex: 18,
      meaning: { zh: '当班，值班中', en: 'working in your official role' },
      usage: { zh: '与 off duty 相对；be on duty、go off duty。', en: 'The opposite of off duty: be on duty, go off duty.' },
      example: { en: 'You may not use your phone while you are on duty.', zh: '当班期间不能使用手机。' },
    },
    {
      phrase: 'up to the guest', sentenceIndex: 32,
      meaning: { zh: '由客人决定', en: 'for the guest to decide' },
      usage: { zh: 'be up to somebody 表示决定权在某人；此处指给不给小费完全看客人。', en: 'Be up to somebody means it is their decision; here the guest decides whether to tip.' },
      example: { en: 'Whether to take the upgrade is up to you.', zh: '要不要升级房型由你决定。' },
    },
    {
      phrase: 'refer them to', sentenceIndex: 34,
      meaning: { zh: '把他们转介到（某个部门）', en: 'to direct somebody to the right person or desk' },
      usage: { zh: 'refer somebody to a department；客服场景高频。', en: 'Refer somebody to a department; common in customer service.' },
      example: { en: 'For billing questions, refer the caller to reception.', zh: '账单问题把来电者转到前台。' },
    },
  ],
  tips: [
    {
      title: { zh: '先记时段，再记动作', en: 'Note the time, then the action' },
      body: {
        zh: '填空题 11 和 15 都是时间点，一句话里常同时给开门和关门两个时间（twelve / two）。听前先看清空格问的是 starts 还是 opens，落笔前确认对应的是哪个动作。',
        en: 'Items 11 and 15 are time points, and one sentence often gives opening and closing times together, twelve and two. Check whether the gap asks for starts or opens before you write, and match it to the right action.',
      },
    },
    {
      title: { zh: '独白靠话题词切分段落', en: 'Split the monologue by topic' },
      body: {
        zh: 'Now, the uniform、Next, the room standards、Now, complaints、Moving on to、Finally, training 都是段落路标。听到路标就检查当前题号，避免把上一段的细节填到下一段的空里。',
        en: 'Now, the uniform; Next, the room standards; Now, complaints; Moving on to; Finally, training are all signposts. Check your current item whenever you hear one, so details from one section do not fill the next gap.',
      },
    },
    {
      title: { zh: '否定句里的选项要反过来听', en: 'Reverse the meaning of negatives' },
      body: {
        zh: 'Do not rush the cleaning、Never send a guest up、do not promise on the spot 都是否定规则。单选干扰项常把否定内容改成肯定建议，听到否定词时先在选项旁标一个叉。',
        en: 'Do not rush the cleaning, Never send a guest up and do not promise on the spot are negative rules. Distractors often turn these into positive suggestions; mark a cross beside them when you hear the negative.',
      },
    },
  ],
};
