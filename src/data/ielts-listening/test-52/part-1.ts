import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 52 · Part 1 — 业主电话预约家庭能耗评估（双人对话）。原创仿真材料，非官方真题。
 *
 * 对话顺序：评估内容 → 到访耗时 → 是否免费 → 改造建议报告 → 补贴申请（填空块），
 * 后半段复述评估范围、到访时长、收费政策、报告内容与后续补贴支持（单选块）。
 * 题块顺序与录音顺序一致。开场用业主直接诉求，不用机构问候加 How can I help you。
 */
export const test52Part1: ListeningLesson = {
  slug: 'test-52-part-1',
  part: 1,
  status: 'published',
  title: { zh: '预约家庭能耗评估', en: 'Arranging a home energy survey' },
  summary: {
    zh: '一位业主致电预约家庭能耗评估：评估检查保温、供暖与漏风点，到访约四十五分钟，符合条件的家庭基础评估免费；之后收到含改造建议与优先级的书面报告，并可协助申请家庭补贴；后半段复述评估范围、到访时长、收费政策、报告内容与补贴支持。',
    en: 'A homeowner books a home energy survey: it checks insulation, heating and draught points, the visit lasts about forty-five minutes, the basic survey is free for eligible homes, and a written report gives improvement advice and priorities, with help applying for a home grant; the recap covers scope, visit length, charges, report contents and grant support.',
  },
  accent: { zh: '业主为美式口音，预约协调员为澳式多语言口音。', en: 'The homeowner speaks with an American accent and the coordinator with an Australian multilingual accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'customer', label: 'CUSTOMER', gender: 'female', voice: 'en-US-JennyNeural' },
    { id: 'coordinator', label: 'COORDINATOR', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Survey checks insulation, heating and', cells: [[{ blank: 1 }, { text: ' points.' }]] },
        { lead: 'Visit lasts about', cells: [[{ blank: 2 }, { text: ' minutes.' }]] },
        { lead: 'The basic survey is', cells: [[{ blank: 3 }, { text: ' for eligible homes.' }]] },
        { lead: 'Written report lists improvement', cells: [[{ blank: 4 }]] },
        { lead: 'Help applying for a home', cells: [[{ blank: 5 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 6,
          stem: 'What does the survey cover?',
          options: [
            { key: 'A', text: 'Only the central heating system.' },
            { key: 'B', text: 'Insulation, heating and draught points.' },
            { key: 'C', text: 'Garden walls and roof repairs.' },
          ],
        },
        {
          number: 7,
          stem: 'How long does the on-site visit take?',
          options: [
            { key: 'A', text: 'About fifteen minutes.' },
            { key: 'B', text: 'About forty-five minutes.' },
            { key: 'C', text: 'Half a day.' },
          ],
        },
        {
          number: 8,
          stem: 'Is the basic survey charged?',
          options: [
            { key: 'A', text: 'It is free to eligible homes.' },
            { key: 'B', text: 'A fixed fee applies to every booking.' },
            { key: 'C', text: 'Only the written report costs money.' },
          ],
        },
        {
          number: 9,
          stem: 'What does the written report provide?',
          options: [
            { key: 'A', text: 'A guaranteed fixed renovation price.' },
            { key: 'B', text: 'Improvement advice and priorities.' },
            { key: 'C', text: 'Names of recommended builders.' },
          ],
        },
        {
          number: 10,
          stem: 'What support is offered after the survey?',
          options: [
            { key: 'A', text: 'Help applying for a home grant.' },
            { key: 'B', text: 'A free new boiler for every home.' },
            { key: 'C', text: 'A discount on future surveys.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 1, accepted: ['draughts'], evidence: 3,
      explanation: {
        zh: '定位句 3：The survey checks insulation, heating and the places where draughts get in。评估检查保温、供暖与漏风点，填 draughts。',
        en: 'Sentence 3: "The survey checks insulation, heating and the places where draughts get in". The survey covers draught points, so write draughts.',
      },
    },
    {
      number: 2, accepted: ['forty-five', '45'], evidence: 7,
      explanation: {
        zh: '定位句 7：The visit lasts about forty-five minutes, walking through each main room with the checklist。到访约四十五分钟；空后已印 minutes，填 forty-five。',
        en: 'Sentence 7: "The visit lasts about forty-five minutes, walking through each main room with the checklist". The visit takes forty-five minutes; minutes is printed, so write forty-five.',
      },
    },
    {
      number: 3, accepted: ['free'], evidence: 11,
      explanation: {
        zh: '定位句 11：The basic survey is free for eligible homes in our area, so you pay nothing for the visit。符合条件家庭基础评估免费，填 free。',
        en: 'Sentence 11: "The basic survey is free for eligible homes in our area, so you pay nothing for the visit". The basic survey is free, so write free.',
      },
    },
    {
      number: 4, accepted: ['advice'], evidence: 13,
      explanation: {
        zh: '定位句 13：You receive a written report with improvement advice, listing what to fix first。报告给出改造建议与优先级，填 advice。',
        en: 'Sentence 13: "You receive a written report with improvement advice, listing what to fix first". The report gives improvement advice, so write advice.',
      },
    },
    {
      number: 5, accepted: ['grant'], evidence: 17,
      explanation: {
        zh: '定位句 17：we can help you apply for a home grant for the approved insulation or heating work。可协助申请家庭补贴，填 grant。',
        en: 'Sentence 17: "we can help you apply for a home grant for the approved insulation or heating work". Help applies for a home grant, so write grant.',
      },
    },
    {
      number: 6, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：The visit covers insulation, heating and draught points, not garden or roof repairs。评估覆盖保温、供暖与漏风点，对应 B。A 的只查供暖与 C 的花园屋顶维修在同句被否定。',
        en: 'Sentence 21: "The visit covers insulation, heating and draught points, not garden or roof repairs". Insulation, heating and draught points match B. Heating only and garden or roof repairs are ruled out in the same sentence.',
      },
    },
    {
      number: 7, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：About forty-five minutes for a standard home, not a fifteen minute walk through。标准住宅到访约四十五分钟，对应 B。A 的十五分钟与句中 not 相反，C 的半天在录音中没有依据。',
        en: 'Sentence 23: "About forty-five minutes for a standard home, not a fifteen minute walk through". Forty-five minutes matches B. Fifteen minutes contradicts not it, and half a day is not claimed.',
      },
    },
    {
      number: 8, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：It is free to eligible homes; only later builder quotes carry a fee。符合条件家庭免费，对应 A。B 的统一收费与 free 相反，C 的只收报告费与句中 only later quotes 不符。',
        en: 'Sentence 25: "It is free to eligible homes; only later builder quotes carry a fee". Free for eligible homes matches A. A flat fee contradicts free, and only the report costing money contradicts later quotes being charged.',
      },
    },
    {
      number: 9, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：It sets out improvement advice and priorities, not a guaranteed fixed renovation price。报告给改造建议与优先级，对应 B。A 的固定报价与句中 not 相反，C 的推荐工名单在录音中没有依据。',
        en: 'Sentence 27: "It sets out improvement advice and priorities, not a guaranteed fixed renovation price". Advice and priorities match B. A fixed price contradicts not it, and builder names are not said.',
      },
    },
    {
      number: 10, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：We help with the home grant application for any approved work, rather than supplying a free boiler。后续协助申请家庭补贴，对应 A。B 的免费锅炉与 rather than 相反，C 的下次评估折扣在录音中没有依据。',
        en: 'Sentence 29: "We help with the home grant application for any approved work, rather than supplying a free boiler". Grant application help matches A. A free boiler contradicts rather than, and a future survey discount is not said.',
      },
    },
  ],
  transcript: [
    { speaker: 'customer', text: 'Hi, I’d like to book a home energy survey for my house, if there are any slots soon.' },
    { speaker: 'coordinator', text: 'Of course. Let me check the survey diary and see which weeks still have openings.' },
    { speaker: 'customer', text: 'We want to know where we are wasting heat before we spend on repairs.' },
    { speaker: 'coordinator', text: 'The survey checks insulation, heating and the places where draughts get in.' },
    { speaker: 'customer', text: 'What exactly does the inspector look at inside the rooms?' },
    { speaker: 'coordinator', text: 'Walls, loft insulation, windows and doors, plus any cold spots you point out.' },
    { speaker: 'customer', text: 'How long will someone need to be at the house?' },
    { speaker: 'coordinator', text: 'The visit lasts about forty-five minutes, walking through each main room with the checklist.' },
    { speaker: 'customer', text: 'Is the whole inspection done on one visit, or does it come back another day?' },
    { speaker: 'coordinator', text: 'One visit covers the home; a follow up is only arranged if a fault needs another look.' },
    { speaker: 'customer', text: 'Does the basic survey cost anything?' },
    { speaker: 'coordinator', text: 'The basic survey is free for eligible homes in our area, so you pay nothing for the visit.' },
    { speaker: 'customer', text: 'What do we get afterwards, apart from the walk around notes?' },
    { speaker: 'coordinator', text: 'You receive a written report with improvement advice, listing what to fix first.' },
    { speaker: 'customer', text: 'Does the report quote a firm price for the work?' },
    { speaker: 'coordinator', text: 'No, it gives priorities and rough directions; actual quotes come from builders later.' },
    { speaker: 'customer', text: 'Are there grants we could apply for once we know what to do?' },
    { speaker: 'coordinator', text: 'Yes, we can help you apply for a home grant for the approved insulation or heating work.' },
    { speaker: 'customer', text: 'Do I need to prepare anything before the inspector arrives?' },
    { speaker: 'coordinator', text: 'Just clear access to the loft hatch and keep heating controls easy to find.' },
    { speaker: 'customer', text: 'Now could you go over the survey once more, so I note it down?' },
    { speaker: 'coordinator', text: 'The visit covers insulation, heating and draught points, not garden or roof repairs.' },
    { speaker: 'customer', text: 'How long is the inspector on site?' },
    { speaker: 'coordinator', text: 'About forty-five minutes for a standard home, not a fifteen minute walk through.' },
    { speaker: 'customer', text: 'Is there a charge for the basic survey?' },
    { speaker: 'coordinator', text: 'It is free to eligible homes; only later builder quotes carry a fee.' },
    { speaker: 'customer', text: 'What does the written report actually contain?' },
    { speaker: 'coordinator', text: 'It sets out improvement advice and priorities, not a guaranteed fixed renovation price.' },
    { speaker: 'customer', text: 'What support comes after the report?' },
    { speaker: 'coordinator', text: 'We help with the home grant application for any approved work, rather than supplying a free boiler.' },
    { speaker: 'customer', text: 'When are the surveyors available each week?' },
    { speaker: 'coordinator', text: 'They work weekdays and one Saturday morning each month, weather permitting.' },
    { speaker: 'customer', text: 'Should someone be at home for the whole visit?' },
    { speaker: 'coordinator', text: 'Yes, an adult needs to stay to answer questions and show the cold spots.' },
    { speaker: 'customer', text: 'Can the survey look at solar panels already on the roof?' },
    { speaker: 'coordinator', text: 'It notes their condition, but panel fitting advice belongs to a separate specialist visit.' },
    { speaker: 'customer', text: 'What if we rent the property instead of owning it?' },
    { speaker: 'coordinator', text: 'The tenant can book, but grant approval usually needs the landlord’s agreement first.' },
    { speaker: 'customer', text: 'Is the report shared with anyone else?' },
    { speaker: 'coordinator', text: 'It stays with the household unless you choose to send it to a landlord or installer.' },
    { speaker: 'customer', text: 'How soon after the visit does the report arrive?' },
    { speaker: 'coordinator', text: 'The written report comes through within ten working days of the inspection.' },
    { speaker: 'customer', text: 'Great. I will book the next available weekday slot, then.' },
    { speaker: 'coordinator', text: 'Done. Please clear the loft hatch and keep the heating controls visible before the visit.' },
  ],
  vocabulary: [
    {
      term: 'insulation', phonetic: '/ˌɪnsjuˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '保温层，隔热材料', en: 'the material in walls and loft that keeps heat inside' },
      usage: { zh: '不可数；loft insulation、wall insulation。动词是 insulate。', en: 'Uncountable: loft insulation. The verb is insulate.' },
      collocations: ['loft insulation', 'wall insulation', 'insulation and heating'],
      example: { en: 'The survey checks loft insulation and wall draughts.', zh: '评估检查阁楼保温层与墙面漏风。' },
      listening: { zh: '四个音节，重音在最后 /ˈleɪ/。', en: 'Four syllables with stress on the final /eɪ/.' },
    },
    {
      term: 'draughts', phonetic: '/drɑːfts/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '漏风，冷风缝隙', en: 'a cold stream of air entering through a gap' },
      usage: { zh: '可数；draught points、stop a draught。美式拼写 draft。', en: 'Countable: draught points. American spelling draft.' },
      collocations: ['draught points', 'where draughts get in', 'seal the draughts'],
      example: { en: 'The inspector marks where draughts get in around doors.', zh: '检查员标出门窗漏风的位置。' },
      listening: { zh: '单音节，双元音 /ɑː/，结尾 /ft/ 读出来。', en: 'One syllable with /ɑː/; pronounce the final /ft/.' },
    },
    {
      term: 'eligible', phonetic: '/ˈelɪdʒəbl/', partOfSpeech: 'adj.', sentenceIndex: 11,
      meaning: { zh: '符合条件的，有资格的', en: 'qualifying for the free survey under the scheme rules' },
      usage: { zh: '形容词；eligible homes、eligible for the grant。名词 eligibility。', en: 'Adjective: eligible homes. The noun is eligibility.' },
      collocations: ['eligible homes', 'eligible for the grant', 'eligible households'],
      example: { en: 'The basic survey is free for eligible homes in the area.', zh: '区域内符合条件的家庭可享免费基础评估。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈel/。', en: 'Three syllables with first-syllable stress.' },
    },
    {
      term: 'grant', phonetic: '/ɡrɑːnt/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '补贴，政府资助款', en: 'the money awarded for approved insulation or heating work' },
      usage: { zh: '可数；a home grant、apply for a grant。', en: 'Countable: a home grant, apply for a grant.' },
      collocations: ['a home grant', 'apply for a grant', 'grant approval'],
      example: { en: 'The team helps households apply for the home grant.', zh: '团队协助家庭申请住房补贴。' },
      listening: { zh: '单音节，双元音 /ɑː/，结尾 /nt/ 读出来。', en: 'One syllable with /ɑː/; pronounce the final /nt/.' },
    },
    {
      term: 'loft', phonetic: '/lɒft/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '阁楼，屋顶下的储物空间', en: 'the space under the roof where insulation is checked' },
      usage: { zh: '可数；the loft hatch、loft insulation。', en: 'Countable: the loft hatch, loft insulation.' },
      collocations: ['the loft hatch', 'loft insulation', 'clear the loft'],
      example: { en: 'Clear access to the loft hatch before the inspector arrives.', zh: '检查员来前先清出阁楼入口通道。' },
      listening: { zh: '单音节，元音 /ɒ/，结尾 /ft/。', en: 'One syllable with /ɒ/; ending /ft/.' },
    },
    {
      term: 'priorities', phonetic: '/praɪˈɒrətiz/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '优先级，先修事项', en: 'the order in which repairs should be tackled' },
      usage: { zh: '可数；improvement priorities、what to fix first。形容词 prior。', en: 'Countable: improvement priorities. The adjective is prior.' },
      collocations: ['improvement priorities', 'the repair priorities', 'list the priorities'],
      example: { en: 'The report lists the repair priorities for the household.', zh: '报告列出家庭维修的先后顺序。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈɒ/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'go over', sentenceIndex: 20,
      meaning: { zh: '复述，再过一遍（评估安排）', en: 'to review the survey details once more' },
      usage: { zh: '及物短语动词；go over the survey、go over the schedule。', en: 'Transitive: go over the survey, go over the schedule.' },
      example: { en: 'Could you go over the survey once more so I note it down?', zh: '你能把评估再过一遍吗，我好记下来。' },
    },
    {
      phrase: 'eligible homes', sentenceIndex: 11,
      meaning: { zh: '符合条件的家庭', en: 'households that qualify under the scheme rules' },
      usage: { zh: 'eligible + 名词；补贴与免费服务场景高频。', en: 'Eligible plus a noun; common with grants and free services.' },
      example: { en: 'The free survey is offered to eligible homes only.', zh: '免费评估只面向符合条件的家庭。' },
    },
    {
      phrase: 'clear access to', sentenceIndex: 19,
      meaning: { zh: '清出可进入的通道', en: 'to leave a route open to a hatch or room' },
      usage: { zh: 'clear access to + 地点；到访准备高频。', en: 'Clear access to plus a place; common before a visit.' },
      example: { en: 'Please leave clear access to the loft hatch.', zh: '请清出通往阁楼入口的通道。' },
    },
    {
      phrase: 'approved work', sentenceIndex: 29,
      meaning: { zh: '经批准的改造工程', en: 'the insulation or heating work the grant covers' },
      usage: { zh: 'approved + 名词；补贴申请场景高频。', en: 'Approved plus a noun; common with grant claims.' },
      example: { en: 'The grant applies only to approved work.', zh: '补贴只覆盖经批准的工程。' },
    },
    {
      phrase: 'cold spots', sentenceIndex: 33,
      meaning: { zh: '冷点，偏冷的位置', en: 'the parts of a room where heat escapes' },
      usage: { zh: '可数复数；show the cold spots、find cold spots。', en: 'Plural countable: show the cold spots.' },
      example: { en: 'An adult stays to show the inspector the cold spots.', zh: '留一位成年人向检查员指出冷点位置。' },
    },
    {
      phrase: 'working days', sentenceIndex: 41,
      meaning: { zh: '工作日（不含周末）', en: 'the weekdays within which the report is sent' },
      usage: { zh: 'within ten working days；时限表述高频。', en: 'Within ten working days; common for deadlines.' },
      example: { en: 'The report arrives within ten working days.', zh: '报告在十个工作日内送达。' },
    },
  ],
  tips: [
    {
      title: { zh: '先看卷面已给单位', en: 'Check the printed unit on the note' },
      body: {
        zh: '第 2 题卷面已印 minutes，第 1 题空后是 points，第 3 题空后是 eligible homes。落笔前先看空格前后的单位与搭配，避免把整句抄进去超出词数限制。',
        en: 'Item 2 already prints minutes, item 1 ends in points, item 3 precedes eligible homes. Check the printed unit and collocation beside each gap before writing, so you do not copy the whole phrase and break the word limit.',
      },
    },
    {
      title: { zh: '收费题抓免费与收费分界', en: 'Catch the free versus charged boundary' },
      body: {
        zh: '第 8 题问收费政策，录音用 free、eligible、only later quotes 这类分界词。干扰项把免费评估说成收费，或把后期报价费用算到评估头上；听到 free、only、later 时记下哪一环免费、哪一环收费。',
        en: 'Item 8 asks the charge policy; the recording uses free, eligible and only later quotes to draw the boundary. Distractors charge the survey or assign later quote fees to the visit. Note which stage is free and which carries a fee on free, only and later.',
      },
    },
    {
      title: { zh: '复述段按题号顺序找答案', en: 'Follow the recap section in question order' },
      body: {
        zh: '单选六到十题在后半段复述中依次出现：评估范围、到访时长、收费、报告内容、补贴支持。听到 once more、again 这类复述信号时，按题号顺序在对应句找答案词，不要把上一题的细节填进下一题。',
        en: 'Singles 6 to 10 appear in order in the recap: scope, visit length, charges, report contents, grant support. At a recap signal such as once more, match the next question number in order, rather than carrying the previous detail forward.',
      },
    },
  ],
};
