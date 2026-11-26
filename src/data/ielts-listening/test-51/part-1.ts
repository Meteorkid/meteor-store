import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 51 · Part 1 — 顾客预约攀岩体验（双人对话，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 对话围绕新手课程、装备租借、年龄与健康要求、教练人数展开，
 * 配对题考三种预订方式（体验课、私教、团体）分别适用哪条规则。
 */
export const test51Part1: ListeningLesson = {
  slug: 'test-51-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预订攀岩体验', en: 'Booking a climbing wall session' },
  summary: {
    zh: '顾客咨询周末攀岩：入门课面向零基础学员，前台可租借安全带与攀岩鞋，最低年龄十二岁，心脏问题需先咨询医生，每场配备四名教练。费用含一次墙上指导，装备另计；体验课含租借装备，私教须电话预订，团体票适合六人以上。',
    en: 'A caller asks about a weekend climb: the course suits beginners, a harness and shoes are borrowed at the desk, the minimum age is twelve, those with a heart condition should check a doctor, and four coaches are on duty. The fee covers one coaching session with gear hired separately; the taster includes rental gear, private coaching is booked by phone, and the group booking suits six or more.',
  },
  accent: { zh: '两位说话人均为新西兰口音。', en: 'Both speakers use New Zealand accents.' },
  speechRate: '+2%',
  cast: [
    { id: 'clerk', label: 'CLERK', gender: 'female', voice: 'en-NZ-MollyNeural' },
    { id: 'visitor', label: 'VISITOR', gender: 'male', voice: 'en-NZ-MitchellNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Course for absolute', cells: [[{ blank: 1 }]] },
        { lead: 'Borrow: climbing', cells: [[{ blank: 2 }, { text: ' and shoes' }]] },
        { lead: 'Minimum age:', cells: [[{ blank: 3 }]] },
        { lead: 'Coaches on duty per session:', cells: [[{ blank: 4 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 5,
          stem: 'What does the course fee include?',
          options: [
            { key: 'A', text: 'Full equipment hire for the session' },
            { key: 'B', text: 'One coaching session on the wall' },
            { key: 'C', text: 'A membership pass to the wall' },
          ],
        },
        {
          number: 6,
          stem: 'Who would be advised not to climb?',
          options: [
            { key: 'A', text: 'Anyone with an untreated heart condition' },
            { key: 'B', text: 'Anyone under ten years old' },
            { key: 'C', text: 'Anyone wearing loose trousers' },
          ],
        },
        {
          number: 7,
          stem: 'What happens if a climber feels unwell during the session?',
          options: [
            { key: 'A', text: 'The coach stops the session straight away' },
            { key: 'B', text: 'The fee is refunded in full' },
            { key: 'C', text: 'A friend takes the climber’s place' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which rule applies to each booking type? Choose the correct letter, A–E.',
      options: [
        { key: 'A', text: 'must be booked by phone' },
        { key: 'B', text: 'includes rental gear in the price' },
        { key: 'C', text: 'suits a group of six or more' },
        { key: 'D', text: 'cannot be passed on to another climber' },
        { key: 'E', text: 'gives a discount on the next visit' },
      ],
      items: [
        { number: 8, text: 'taster session' },
        { number: 9, text: 'private coaching' },
        { number: 10, text: 'group booking' },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['beginners'], evidence: 3,
      explanation: {
        zh: '定位句 3：The introductory course is for absolute beginners, and it starts with the basic holds and footwork。入门课面向零基础学员，填 beginners。句 1 的 first-timers 是泛指，不是课程对象的正式说法。',
        en: 'Sentence 3: "The introductory course is for absolute beginners, and it starts with the basic holds and footwork", so write beginners. First-timers in sentence 1 is a loose reference, not the formal course group.',
      },
    },
    {
      number: 2, accepted: ['harness'], evidence: 5,
      explanation: {
        zh: '定位句 5：You can borrow a harness and climbing shoes from the front desk。可租借安全带和攀岩鞋，题目已给 climbing，填 harness。shoes 是并列另一件装备，不填。',
        en: 'Sentence 5: "You can borrow a harness and climbing shoes from the front desk". Climbing is printed, so write harness. Shoes are the parallel item, not the blank.',
      },
    },
    {
      number: 3, accepted: ['twelve', '12'], evidence: 7,
      explanation: {
        zh: '定位句 7：the minimum age is twelve, and younger children can join the family session with an adult。最低年龄十二岁，twelve 与 12 都得分。十岁与题中家庭场合并列的年龄不是门槛。',
        en: 'Sentence 7: "the minimum age is twelve, and younger children can join the family session with an adult". Twelve and 12 both fit; ten is the age mentioned for the family session, not the threshold.',
      },
    },
    {
      number: 4, accepted: ['four', '4'], evidence: 11,
      explanation: {
        zh: '定位句 11：We keep four coaches on duty for each session, so no group runs larger than eight climbers。每场四名教练，four 与 4 都得分。八人是每组人数上限，不是教练数。',
        en: 'Sentence 11: "We keep four coaches on duty for each session, so no group runs larger than eight climbers". Four and 4 both fit; eight is the group size limit, not the coach count.',
      },
    },
    {
      number: 5, accepted: ['B'], evidence: 13,
      explanation: {
        zh: '定位句 13：The fee includes one coaching session on the wall, and the gear hire is charged separately。费用含一次墙上指导，对应 B。装备租用另计，排除 A；会员次卡全段未出现，排除 C。',
        en: 'Sentence 13: "The fee includes one coaching session on the wall, and the gear hire is charged separately", matching B. Gear hire is separate, so A is out; no membership pass is mentioned, so C is out.',
      },
    },
    {
      number: 6, accepted: ['A'], evidence: 15,
      explanation: {
        zh: '定位句 15：Anyone with an untreated heart condition should wait for medical advice before booking。未处理的心脏问题者不宜攀登，对应 A。十岁以下是家庭场次年龄，松长裤只是着装建议。',
        en: 'Sentence 15: "Anyone with an untreated heart condition should wait for medical advice before booking", matching A. Under-tens are a family-session age, and loose trousers are only dress advice.',
      },
    },
    {
      number: 7, accepted: ['A'], evidence: 17,
      explanation: {
        zh: '定位句 17：The coach stops the session straight away and walks you back to the front desk。身体不适时教练立即中止场次，对应 A。全额退款与转名额在本段没有出现。',
        en: 'Sentence 17: "The coach stops the session straight away and walks you back to the front desk", matching A. A full refund or a transferred place are not mentioned here.',
      },
    },
    {
      number: 8, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：The taster session includes rental gear in the price, so you pay once and climb。体验课价格含租借装备，对应 B。',
        en: 'Sentence 21: "The taster session includes rental gear in the price, so you pay once and climb", matching B.',
      },
    },
    {
      number: 9, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：Private coaching must be booked by phone, since the coach arranges the times personally。私教须电话预订，对应 A。',
        en: 'Sentence 23: "Private coaching must be booked by phone, since the coach arranges the times personally", matching A.',
      },
    },
    {
      number: 10, accepted: ['C'], evidence: 25,
      explanation: {
        zh: '定位句 25：The group booking suits a party of six or more, and you get a shared coach for the hour。团体票适合六人以上，对应 C。不可转让与下次优惠分别归私教和常客，不归团体票。',
        en: 'Sentence 25: "The group booking suits a party of six or more, and you get a shared coach for the hour", matching C. Non-transferability and the repeat discount belong to private sessions and regular climbers, not the group booking.',
      },
    },
  ],
  transcript: [
    { speaker: 'visitor', text: 'I have never climbed before, and I would like to book a session this weekend.' },
    { speaker: 'clerk', text: 'We run regular sessions for first-timers, so you are in the right place.' },
    { speaker: 'visitor', text: 'What sort of course would suit someone like me?' },
    { speaker: 'clerk', text: 'The introductory course is for absolute beginners, and it starts with the basic holds and footwork.' },
    { speaker: 'visitor', text: 'Do I need to bring my own equipment?' },
    { speaker: 'clerk', text: 'You can borrow a harness and climbing shoes from the front desk; the shoes are fitted before you start.' },
    { speaker: 'visitor', text: 'I have never worn climbing shoes, so that helps. Is there an age limit?' },
    { speaker: 'clerk', text: 'Yes, the minimum age is twelve, and younger children can join the family session with an adult.' },
    { speaker: 'visitor', text: 'Twelve, fine. What about health? I have mild asthma.' },
    { speaker: 'clerk', text: 'Anyone with a heart condition should check with a doctor first, and asthma is fine if you bring your inhaler.' },
    { speaker: 'visitor', text: 'Good to know. How many coaches are there for a group?' },
    { speaker: 'clerk', text: 'We keep four coaches on duty for each session, so no group runs larger than eight climbers.' },
    { speaker: 'visitor', text: 'That sounds well looked after. What does the course fee cover?' },
    { speaker: 'clerk', text: 'The fee includes one coaching session on the wall, and the gear hire is charged separately.' },
    { speaker: 'visitor', text: 'Who would be advised not to climb?' },
    { speaker: 'clerk', text: 'Anyone with an untreated heart condition should wait for medical advice before booking.' },
    { speaker: 'visitor', text: 'If I start to feel unwell during the session?' },
    { speaker: 'clerk', text: 'The coach stops the session straight away and walks you back to the front desk.' },
    { speaker: 'visitor', text: 'Tell me about the different ways to book.' },
    { speaker: 'clerk', text: 'We have a taster session, private coaching and a group booking for parties.' },
    { speaker: 'visitor', text: 'What about the taster session?' },
    { speaker: 'clerk', text: 'The taster session includes rental gear in the price, so you pay once and climb.' },
    { speaker: 'visitor', text: 'And private coaching?' },
    { speaker: 'clerk', text: 'Private coaching must be booked by phone, since the coach arranges the times personally.' },
    { speaker: 'visitor', text: 'What about the group booking?' },
    { speaker: 'clerk', text: 'The group booking suits a party of six or more, and you get a shared coach for the hour.' },
    { speaker: 'visitor', text: 'Can a friend use my place if I cannot come?' },
    { speaker: 'clerk', text: 'The private session cannot be passed on, but the taster ticket can be changed once.' },
    { speaker: 'visitor', text: 'Is there a discount after the first visit?' },
    { speaker: 'clerk', text: 'Regular climbers get a discount on the next pass, but that is separate from today’s fee.' },
    { speaker: 'visitor', text: 'Is the wall open every day?' },
    { speaker: 'clerk', text: 'We open from ten in the morning until nine at night, and the last session starts at seven.' },
    { speaker: 'visitor', text: 'How long does the beginner course last?' },
    { speaker: 'clerk', text: 'The course runs ninety minutes, including a warm-up and a safety briefing.' },
    { speaker: 'visitor', text: 'Do we wear our own clothes?' },
    { speaker: 'clerk', text: 'Long trousers and a T-shirt are best, and jewellery is left in the locker.' },
    { speaker: 'visitor', text: 'Is there parking nearby?' },
    { speaker: 'clerk', text: 'The car park behind the hall holds thirty cars, and there is a bike rack at the side door.' },
    { speaker: 'visitor', text: 'Will the coach explain the safety ropes?' },
    { speaker: 'clerk', text: 'Yes, the safety briefing covers the harness, the rope and how to ask for help.' },
    { speaker: 'visitor', text: 'That covers what I need. I will check the times online.' },
    { speaker: 'clerk', text: 'Fine, and the desk can answer any questions when you arrive.' },
  ],
  vocabulary: [
    {
      term: 'beginners', phonetic: '/bɪˈɡɪnəz/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '初学者，零基础学员', en: 'people who have no experience of an activity' },
      usage: { zh: '可数复数；absolute beginners、a beginner course。动词 begin。', en: 'Countable plural: absolute beginners, a beginner course. The verb is begin.' },
      collocations: ['absolute beginners', 'a beginner course', 'total beginners'],
      example: { en: 'The introductory course suits absolute beginners.', zh: '入门课适合零基础学员。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈɡɪ/，结尾 /z/。', en: 'Three syllables stressing the second; ending /z/.' },
    },
    {
      term: 'harness', phonetic: '/ˈhɑːnəs/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '安全带（攀岩保护带）', en: 'a strapped body belt used to attach a climbing rope' },
      usage: { zh: '可数；climbing harness、wear a harness。', en: 'Countable: climbing harness, wear a harness.' },
      collocations: ['a climbing harness', 'the harness fits', 'fasten the harness'],
      example: { en: 'Climbers borrow a harness and shoes at the desk.', zh: '攀岩者在前台借安全带和鞋。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈhɑː/，中间 /n/ 连读。', en: 'Two syllables stressing the first; linked /n/.' },
    },
    {
      term: 'twelve', phonetic: '/twelv/', partOfSpeech: 'num.', sentenceIndex: 7,
      meaning: { zh: '十二', en: 'the number twelve' },
      usage: { zh: '基数词；minimum age of twelve。', en: 'A cardinal number: minimum age of twelve.' },
      collocations: ['age twelve', 'twelve years old', 'at twelve'],
      example: { en: 'The minimum climbing age is twelve.', zh: '最低攀岩年龄为十二岁。' },
      listening: { zh: '单音节，开头 /tw/ 连读，结尾 /v/ 浊音。', en: 'One syllable linking /tw/; voiced final /v/.' },
    },
    {
      term: 'coaches', phonetic: '/kəʊtʃɪz/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '教练，指导者', en: 'an instructor who trains people in a sport' },
      usage: { zh: '可数；on-duty coach、group coach。动词 coach 表指导。', en: 'Countable: on-duty coach, group coach. The verb is coach.' },
      collocations: ['the coach on duty', 'a shared coach', 'the coach explains'],
      example: { en: 'Four coaches are on duty for each session.', zh: '每场有四名教练在岗。' },
      listening: { zh: '单音节，结尾 /tʃ/，与 couch 区分。', en: 'One syllable ending /tʃ/; distinguish from couch.' },
    },
    {
      term: 'private', phonetic: '/ˈpraɪvət/', partOfSpeech: 'adj.', sentenceIndex: 23,
      meaning: { zh: '私人的，一对一的', en: 'arranged for one person rather than a group' },
      usage: { zh: 'private coaching、private session。名词 privacy。', en: 'private coaching, private session. The noun is privacy.' },
      collocations: ['private coaching', 'a private session', 'private lessons'],
      example: { en: 'Private coaching is booked by phone.', zh: '私教通过电话预订。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈpraɪ/，结尾 /ət/ 轻读。', en: 'Two syllables stressing the first; soft final /ət/.' },
    },
    {
      term: 'rental', phonetic: '/ˈrentl/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '租借的，租用的（装备）', en: 'hired equipment available for a short period' },
      usage: { zh: '名词作定语；rental gear、rental shoes。动词 rent。', en: 'A noun acting as modifier: rental gear, rental shoes. The verb is rent.' },
      collocations: ['rental gear', 'the rental fee', 'rental equipment'],
      example: { en: 'The taster session includes rental gear.', zh: '体验课含租借装备。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈren/，结尾 /tl/。', en: 'Two syllables stressing the first; ending /tl/.' },
    },
    {
      term: 'discount', phonetic: '/ˈdɪskaʊnt/', partOfSpeech: 'n.', sentenceIndex: 29,
      meaning: { zh: '折扣，减价', en: 'a reduction from the usual price' },
      usage: { zh: '可数；get a discount、a discount on the next pass。', en: 'Countable: get a discount, a discount on the next pass.' },
      collocations: ['a discount on', 'the regular discount', 'claim a discount'],
      example: { en: 'Regular climbers get a discount on the next pass.', zh: '常客下次购票可享折扣。' },
      listening: { zh: '两个音节，重音在第一音节；动词 discount 重音在第二音节。', en: 'Two syllables stressing the first; the verb stresses the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'charged separately', sentenceIndex: 13,
      meaning: { zh: '另行收费，分开计价', en: 'priced apart from the main fee' },
      usage: { zh: '被动短语；gear hire is charged separately。', en: 'A passive phrase: gear hire is charged separately.' },
      example: { en: 'The gear hire is charged separately from the fee.', zh: '装备租用与费用分开计价。' },
    },
    {
      phrase: 'feel unwell', sentenceIndex: 16,
      meaning: { zh: '身体不适，感觉不舒服', en: 'to feel ill or not fit enough to continue' },
      usage: { zh: 'feel 后接形容词；feel unwell during the session。', en: 'Feel plus adjective: feel unwell during the session.' },
      example: { en: 'Tell the coach if you start to feel unwell.', zh: '如果感觉不适就告诉教练。' },
    },
    {
      phrase: 'booked by phone', sentenceIndex: 23,
      meaning: { zh: '通过电话预订', en: 'reserved over the telephone rather than online' },
      usage: { zh: '被动短语；booked by phone、booked online。', en: 'A passive phrase: booked by phone, booked online.' },
      example: { en: 'Private sessions are booked by phone.', zh: '私教场次通过电话预订。' },
    },
    {
      phrase: 'rental gear', sentenceIndex: 21,
      meaning: { zh: '租借装备', en: 'hired climbing equipment such as shoes and harness' },
      usage: { zh: '名词短语；include rental gear、collect rental gear。', en: 'A noun phrase: include rental gear, collect rental gear.' },
      example: { en: 'The taster ticket covers the rental gear.', zh: '体验票包含租借装备。' },
    },
    {
      phrase: 'on duty', sentenceIndex: 11,
      meaning: { zh: '在岗，值班中', en: 'working and available during a session' },
      usage: { zh: '表语短语；coaches on duty、on duty tonight。', en: 'A predicative phrase: coaches on duty, on duty tonight.' },
      example: { en: 'Four coaches remain on duty per session.', zh: '每场四名教练在岗。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格先按行锁定关键词', en: 'Locate the row by keyword first' },
      body: {
        zh: '三种预订方式按体验课、私教、团体顺序出现。听之前在条目旁写下关键词，听到 taster、private、group 时回到对应行，再记规则，不要听到什么选什么。',
        en: 'The booking types appear in order: taster, private and group. Note a keyword beside each item before listening, and return to that row when taster, private or group is mentioned.',
      },
    },
    {
      title: { zh: '数字题区分人数与装备', en: 'Separate people from equipment' },
      body: {
        zh: '十二岁是年龄，四名是教练数，八人是每组上限。听到数字先判断它指年龄、人数还是装备数量，再落笔；别把每组人数填进教练数空格。',
        en: 'Twelve is the age, four the coach count, eight the group limit. Decide whether each number refers to age, people or equipment before writing. Do not put the group limit in the coach-count blank.',
      },
    },
    {
      title: { zh: '健康否定条件单独记录', en: 'Note the health exclusion' },
      body: {
        zh: '第 6 题问谁不宜攀登。听到 heart condition、doctor 这类排除条件时，把对应干扰项划掉；哮喘是被允许的情况，不要和禁忌病混在一起。',
        en: 'Item 6 asks who should not climb. Cross out the matching distractor at heart condition or doctor. Asthma is allowed, so do not mix it with the excluded condition.',
      },
    },
  ],
};
