import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 18 · Part 2 — 海滩安全讲解（单人独白，英式口音）。原创仿真材料，非官方真题。
 *
 * 独白按旗语含义、救生员时段、走失流程、离岸流识别、防晒建议、团队分工推进。
 * 开场用现场提醒，不使用 welcome to 句式。
 */
export const test18Part2: ListeningLesson = {
  slug: 'test-18-part-2',
  part: 2,
  status: 'published',
  title: { zh: '海滩安全讲解', en: 'A beach safety talk' },
  summary: {
    zh: '海滩管理员讲解红黄两面旗的含义、救生员在岗时段、儿童走失后的报送地点与流程，如何识别离岸流、遇险时的游法，防晒补涂时机，以及 junior lifeguard、first aider 和 senior lifeguard 各自的职责。',
    en: 'A beach warden explains what the red and yellow flags mean, the lifeguard duty hours, where a lost child is handed in, how to recognise a rip current and what to do if caught, when to reapply sunscreen, and the duties of the junior lifeguard, the first aider and the senior lifeguard.',
  },
  accent: { zh: '讲解员为英式口音，语速中等。', en: 'The guide has a British accent and speaks at a moderate pace.' },
  cast: [
    { id: 'warden', label: 'WARDEN', gender: 'female', voice: 'en-GB-LibbyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Signal / situation', 'Detail'],
      rows: [
        { lead: 'Red flag', cells: [[{ text: 'water closed to ' }, { blank: 11 }]] },
        { lead: 'Yellow flag', cells: [[{ text: 'enter the water with ' }, { blank: 12 }]] },
        { lead: 'Lifeguard duty ends at', cells: [[{ blank: 13 }, { text: ' in the afternoon' }]] },
        { lead: 'Lost child is brought to the', cells: [[{ blank: 14 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What does a rip current look like?',
          options: [
            { key: 'A', text: 'A narrow channel of darker, choppy water' },
            { key: 'B', text: 'A wide band of white foam across the surf' },
            { key: 'C', text: 'A patch of shallow water over a sandbar' },
          ],
        },
        {
          number: 16,
          stem: 'What should you do if you are caught in a rip current?',
          options: [
            { key: 'A', text: 'Swim straight back toward the beach' },
            { key: 'B', text: 'Swim parallel to the shore' },
            { key: 'C', text: 'Stand up and wait for the tide to turn' },
          ],
        },
        {
          number: 17,
          stem: 'When should sunscreen be reapplied?',
          options: [
            { key: 'A', text: 'after swimming' },
            { key: 'B', text: 'after eating a meal' },
            { key: 'C', text: 'when the temperature rises' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which duty matches each member of the beach team? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'patrols the shoreline each morning' },
        { key: 'B', text: 'checks the first aid kit before opening' },
        { key: 'C', text: 'speaks to parents of a lost child' },
        { key: 'D', text: 'raises and lowers the flags' },
        { key: 'E', text: 'collects beach litter after lunch' },
        { key: 'F', text: 'leads the junior safety session' },
      ],
      items: [
        { number: 18, text: 'the junior lifeguard' },
        { number: 19, text: 'the first aider' },
        { number: 20, text: 'the senior lifeguard' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['swimmers'], evidence: 4,
      explanation: {
        zh: '定位句 4：A red flag means the water is closed to swimmers。红旗表示水域对游泳者关闭；句 5 的 strong current 是红旗出现的原因，不是关闭对象。',
        en: 'Sentence 4: "A red flag means the water is closed to swimmers". A red flag closes the water to swimmers; the strong current in sentence 5 is why the flag is raised, not who is excluded.',
      },
    },
    {
      number: 12, accepted: ['caution'], evidence: 6,
      explanation: {
        zh: '定位句 6：A yellow flag means you may enter the water, but only with caution。黄旗可下水但需谨慎；句 7 的 close to the shore 是注意事项，不是空里的词。',
        en: 'Sentence 6: "A yellow flag means you may enter the water, but only with caution". A yellow flag allows entry with caution; staying close to shore in sentence 7 is a rule, not the answer.',
      },
    },
    {
      number: 13, accepted: ['five thirty', '5:30'], evidence: 10,
      explanation: {
        zh: '定位句 10：Their duty runs from nine in the morning until five thirty in the afternoon。救生员下午五点半下岗；九点是上班时间，不能填。',
        en: 'Sentence 10: "Their duty runs from nine in the morning until five thirty in the afternoon". Duty ends at five thirty; nine is the start time, not the finish.',
      },
    },
    {
      number: 14, accepted: ['information point'], evidence: 15,
      explanation: {
        zh: '定位句 15：The lost child will be brought to the information point, where a staff member stays with them。走失儿童被带到咨询点；句 13 的 lifeguard 是先报送的对象，不是孩子被带去的地方。',
        en: 'Sentence 15: "The lost child will be brought to the information point, where a staff member stays with them". The child is taken to the information point; the lifeguard in sentence 13 is who you report to first, not where the child waits.',
      },
    },
    {
      number: 15, accepted: ['A'], evidence: 18,
      explanation: {
        zh: '定位句 18：It appears as a narrow channel of darker, choppy water moving straight out to sea。离岸流是一条颜色更深、更碎浪的窄水道；白色泡沫带和浅滩沙洲在全段没有依据。',
        en: 'Sentence 18: "It appears as a narrow channel of darker, choppy water moving straight out to sea". A rip is a narrow darker choppy channel; a wide foam band and a shallow sandbar have no basis.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 22,
      explanation: {
        zh: '定位句 22：Swim parallel to the shore first, along the line of the waves, until the current weakens。遇险先沿岸平行游；句 21 明确反对直接往回游，站着等退潮在全段未提。',
        en: 'Sentence 22: "Swim parallel to the shore first, along the line of the waves, until the current weakens". Swim parallel to the shore first; swimming straight back is rejected in sentence 21, and waiting for the tide is not mentioned.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：Reapply it after swimming, and again after every two hours in the sun。游泳后补涂防晒；吃饭和气温升高在全段没有作为补涂时机。',
        en: 'Sentence 25: "Reapply it after swimming, and again after every two hours in the sun". Reapply after swimming; meals and rising temperature are not given as reasons to reapply.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：The junior lifeguard, in the bright red shirt, patrols the shoreline each morning between the flags。见习救生员上午巡逻岸线，对应 A。',
        en: 'Sentence 30: "The junior lifeguard, in the bright red shirt, patrols the shoreline each morning between the flags". The junior lifeguard patrols the shoreline, matching A.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：The first aider, who keeps the blue bag, checks the first aid kit before the beach opens。急救员开滩前检查药箱，对应 B。',
        en: 'Sentence 31: "The first aider, who keeps the blue bag, checks the first aid kit before the beach opens". The first aider checks the kit before opening, matching B.',
      },
    },
    {
      number: 20, accepted: ['C'], evidence: 32,
      explanation: {
        zh: '定位句 32：The senior lifeguard, beside the tower, speaks to the parents once a lost child has been found。资深救生员与走失儿童家长沟通，对应 C。',
        en: 'Sentence 32: "The senior lifeguard, beside the tower, speaks to the parents once a lost child has been found". The senior lifeguard speaks to the parents, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'warden', text: 'If you are heading down onto the sand in the next hour, take one minute to read the flag board at the top of the steps.' },
    { speaker: 'warden', text: 'I am the beach warden, and this talk covers the flags, the currents, and what to do if a child gets lost.' },
    { speaker: 'warden', text: 'The sea here looks calm most days, but the water changes quickly around the sandbars.' },
    { speaker: 'warden', text: 'Two flags stand by the main steps, and their colours tell you how safe the water is.' },
    { speaker: 'warden', text: 'A red flag means the water is closed to swimmers, and nobody should go past the shallow edge.' },
    { speaker: 'warden', text: 'That colour is used when the current is too strong, or when the tide is running fast.' },
    { speaker: 'warden', text: 'A yellow flag means you may enter the water, but only with caution.' },
    { speaker: 'warden', text: 'Stay close to the shore, and do not go out beyond the first line of breaking waves.' },
    { speaker: 'warden', text: 'On a calm day with no flags at all, the water is considered safe for ordinary swimmers.' },
    { speaker: 'warden', text: 'The lifeguards watch the water from the tower beside the information board.' },
    { speaker: 'warden', text: 'Their duty runs from nine in the morning until five thirty in the afternoon.' },
    { speaker: 'warden', text: 'Outside those hours, there is no one on the tower, so please stay on the sand.' },
    { speaker: 'warden', text: 'Children must stay within an adult sight near the water, even on the sand beside the waves.' },
    { speaker: 'warden', text: 'If a child goes missing, the first step is to report it to the nearest lifeguard or the information point.' },
    { speaker: 'warden', text: 'Do not leave the beach to search the car park or the town on your own.' },
    { speaker: 'warden', text: 'The lost child will be brought to the information point, where a staff member stays with them.' },
    { speaker: 'warden', text: 'Please give the warden a clear description. Mention age, clothing, and any backpack or toy.' },
    { speaker: 'warden', text: 'Now, the current you most need to recognise is the rip current.' },
    { speaker: 'warden', text: 'It appears as a narrow channel of darker, choppy water moving straight out to sea.' },
    { speaker: 'warden', text: 'The water there looks smoother than the waves around it, and it carries people away from the shore.' },
    { speaker: 'warden', text: 'Many visitors mistake it for a calm spot, but it is the most dangerous line on this beach.' },
    { speaker: 'warden', text: 'If you are caught in one, do not fight straight back toward the beach.' },
    { speaker: 'warden', text: 'Swim parallel to the shore first, along the line of the waves, until the current weakens.' },
    { speaker: 'warden', text: 'Then turn in and raise one arm so the lifeguard can see you.' },
    { speaker: 'warden', text: 'For sunscreen, put on a high factor before you leave the changing rooms.' },
    { speaker: 'warden', text: 'Reapply it after swimming, and again after every two hours in the sun.' },
    { speaker: 'warden', text: 'Water washes the cream off, so a single application in the morning is not enough for a full day.' },
    { speaker: 'warden', text: 'Keep an eye on young skin between the hours when the sun is strongest, around midday.' },
    { speaker: 'warden', text: 'You may sit under the awning near the kiosk if your skin feels hot.' },
    { speaker: 'warden', text: 'Around the beach today you will see three members of our team.' },
    { speaker: 'warden', text: 'The junior lifeguard, in the bright red shirt, patrols the shoreline each morning between the flags.' },
    { speaker: 'warden', text: 'The first aider, who keeps the blue bag, checks the first aid kit before the beach opens.' },
    { speaker: 'warden', text: 'The senior lifeguard, beside the tower, speaks to the parents once a lost child has been found.' },
    { speaker: 'warden', text: 'Another volunteer collects beach litter after lunch and empties the bins along the path.' },
    { speaker: 'warden', text: 'We also run a short junior safety session each Saturday for children aged eight and over.' },
    { speaker: 'warden', text: 'If the weather turns, the changing rooms and the kiosk stay open until the rain passes.' },
    { speaker: 'warden', text: 'The nearest pay phone is beside the information point, and the emergency number is on the board.' },
    { speaker: 'warden', text: 'Drinks are available at the kiosk, but please do not feed the seagulls near the steps.' },
    { speaker: 'warden', text: 'Bags should not be left unattended beside the towel lines.' },
    { speaker: 'warden', text: 'Before we finish, let me repeat the three rules. Respect the flags, stay out of the rip, and report a lost child at once.' },
    { speaker: 'warden', text: 'The full safety leaflet is pinned to the board, and our website lists the latest water conditions each morning.' },
    { speaker: 'warden', text: 'Enjoy the beach, and look after the people beside you in the water.' },
  ],
  vocabulary: [
    {
      term: 'caution', phonetic: '/ˈkɔːʃn/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '谨慎，小心', en: 'careful attention because the situation may be risky' },
      usage: { zh: '不可数；with caution、exercise caution。形容词 cautious。', en: 'Uncountable: with caution, exercise caution. The adjective is cautious.' },
      collocations: ['with caution', 'proceed with caution', 'use caution'],
      example: { en: 'You may enter the water only with caution.', zh: '只有谨慎留意才可下水。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkɔː/；中间 /ʃn/。', en: 'Two syllables with stress on the first; the middle is /ʃn/.' },
    },
    {
      term: 'lifeguards', phonetic: '/ˈlaɪfɡɑːdz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '救生员', en: 'a person trained to watch swimmers and rescue people in trouble' },
      usage: { zh: '可数；the lifeguard on the tower、junior lifeguard。', en: 'Countable: the lifeguard on the tower, junior lifeguard.' },
      collocations: ['the lifeguard', 'the lifeguard tower', 'a trained lifeguard'],
      example: { en: 'The lifeguards watch the water from the tower.', zh: '救生员在瞭望塔上观察水面。' },
      listening: { zh: '复合词 life + guard，重音在第一音节。', en: 'Compound life plus guard, stress on the first.' },
    },
    {
      term: 'rip current', phonetic: '/ˈrɪp ˌkʌrənt/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '离岸流，裂流', en: 'a strong narrow current flowing straight away from the shore' },
      usage: { zh: '可数；the rip current、caught in a rip。', en: 'Countable: the rip current, caught in a rip.' },
      collocations: ['the rip current', 'caught in a rip', 'recognise the rip'],
      example: { en: 'The current you most need to recognise is the rip current.', zh: '最需要识别的水流就是离岸流。' },
      listening: { zh: 'rip 短元音 /ɪ/；current 重音在第一音节 /ˈkʌ/。', en: 'rip has short /ɪ/; current stresses the first syllable.' },
    },
    {
      term: 'parallel', phonetic: '/ˈpærəlel/', partOfSpeech: 'adv.', sentenceIndex: 22,
      meaning: { zh: '平行地', en: 'moving alongside a line without meeting it' },
      usage: { zh: '副词或形容词；swim parallel to the shore、parallel lines。', en: 'Adverb or adjective: swim parallel to the shore, parallel lines.' },
      collocations: ['parallel to the shore', 'swim parallel', 'parallel lines'],
      example: { en: 'Swim parallel to the shore until the current weakens.', zh: '沿岸平行游，直到水流减弱。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈpær/；结尾 /lel/。', en: 'Three syllables with stress on the first and a final /lel/.' },
    },
    {
      term: 'information point', phonetic: '/ˌɪnfəˈmeɪʃn pɔɪnt/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '咨询点，问讯处', en: 'the staffed place where visitors ask for help or report problems' },
      usage: { zh: '可数；brought to the information point、at the information point。', en: 'Countable: brought to the information point, at the information point.' },
      collocations: ['the information point', 'at the information point', 'the beach information point'],
      example: { en: 'The lost child is brought to the information point.', zh: '走失儿童被带到咨询点。' },
      listening: { zh: 'information 重音在第三音节 /ˈmeɪ/；point 单音节。', en: 'information stresses the third syllable; point is one syllable.' },
    },
    {
      term: 'sunscreen', phonetic: '/ˈsʌnskriːn/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '防晒霜', en: 'cream that protects the skin from strong sunlight' },
      usage: { zh: '不可数；put on sunscreen、reapply sunscreen。', en: 'Uncountable: put on sunscreen, reapply sunscreen.' },
      collocations: ['put on sunscreen', 'reapply sunscreen', 'high factor sunscreen'],
      example: { en: 'Put on a high factor sunscreen before changing rooms.', zh: '离开更衣室前涂上高倍防晒。' },
      listening: { zh: '复合词 sun + screen，重音在第一音节。', en: 'Compound sun plus screen, stress on the first.' },
    },
    {
      term: 'patrols', phonetic: '/pəˈtrəʊlz/', partOfSpeech: 'v.', sentenceIndex: 30,
      meaning: { zh: '巡逻，巡查', en: 'to walk an area regularly to watch for problems' },
      usage: { zh: '第三人称 patrols；patrol the shoreline。名词 patrol。', en: 'Third person patrols; patrol the shoreline. The noun is patrol.' },
      collocations: ['patrols the shoreline', 'patrol the beach', 'a daily patrol'],
      example: { en: 'The junior lifeguard patrols the shoreline each morning.', zh: '见习救生员每天上午巡逻岸线。' },
      listening: { zh: '重音在第二音节 /ˈtrəʊ/；结尾 /lz/。', en: 'Stress the second syllable; the ending is /lz/.' },
    },
    {
      term: 'kit', phonetic: '/kɪt/', partOfSpeech: 'n.', sentenceIndex: 31,
      meaning: { zh: '成套用品，药箱', en: 'a set of supplies kept together for a particular job' },
      usage: { zh: '可数；first aid kit、repair kit。', en: 'Countable: first aid kit, repair kit.' },
      collocations: ['the first aid kit', 'check the kit', 'a medical kit'],
      example: { en: 'The first aider checks the first aid kit before opening.', zh: '急救员开滩前检查急救药箱。' },
      listening: { zh: '单音节 /kɪt/，结尾 /t/ 清辅音。', en: 'One syllable /kɪt/ ending in a voiceless /t/.' },
    },
  ],
  expressions: [
    {
      phrase: 'closed to swimmers', sentenceIndex: 4,
      meaning: { zh: '对游泳者关闭', en: 'not open to people who want to swim' },
      usage: { zh: '被动搭配；be closed to visitors、be closed to swimmers。', en: 'Passive: be closed to visitors, be closed to swimmers.' },
      example: { en: 'The red flag means the water is closed to swimmers.', zh: '红旗表示水域对游泳者关闭。' },
    },
    {
      phrase: 'carries people away', sentenceIndex: 19,
      meaning: { zh: '把人带离岸边', en: 'to pull someone further from the shore by the current' },
      usage: { zh: 'carry somebody away；第三人称 carries，away 此处指离岸。', en: 'Carry somebody away; third person carries, and away means off the shore.' },
      example: { en: 'The current carries people away from the shore.', zh: '水流把人带离岸边。' },
    },
    {
      phrase: 'mistake it for', sentenceIndex: 20,
      meaning: { zh: '误把……当成', en: 'to wrongly identify something as something else' },
      usage: { zh: 'mistake A for B；过去式 mistook。', en: 'Mistake A for B; the past form is mistook.' },
      example: { en: 'Many visitors mistake the rip for a calm spot.', zh: '许多游客把离岸流误当成平静水域。' },
    },
    {
      phrase: 'washes the cream off', sentenceIndex: 26,
      meaning: { zh: '把防晒冲掉', en: 'to remove the cream from the skin by water' },
      usage: { zh: 'wash something off；被动 be washed off。', en: 'Wash something off; passive be washed off.' },
      example: { en: 'Water washes the sunscreen cream off the skin.', zh: '海水把皮肤上的防晒冲掉。' },
    },
    {
      phrase: 'stays with them', sentenceIndex: 15,
      meaning: { zh: '陪着孩子', en: 'to remain beside someone until their parent arrives' },
      usage: { zh: '陪着某人等待；stay with somebody，指工作人员留在孩子身边。', en: 'Stay with somebody; staff remains beside the child.' },
      example: { en: 'A staff member stays with the lost child.', zh: '工作人员陪着走失的孩子。' },
    },
    {
      phrase: 'before the beach opens', sentenceIndex: 31,
      meaning: { zh: '开滩之前', en: 'before the official opening time of the site' },
      usage: { zh: '时间状语；check the kit before the beach opens。', en: 'A time adverbial: check the kit before the beach opens.' },
      example: { en: 'The first aider checks the kit before the beach opens.', zh: '急救员在开滩前检查药箱。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题先按信号定位', en: 'Locate the signal before each gap' },
      body: {
        zh: '第 11–14 题按红旗、黄旗、时段、走失流程排列。听前把 red flag、yellow flag、duty、lost child 标在表格旁；听到对应信号词再填后面的名词，不要把原因句里的词填进空内。',
        en: 'Items 11 to 14 follow red flag, yellow flag, duty hours and lost-child procedure. Mark red flag, yellow flag, duty and lost child beside the table; write the noun after the signal word, not a word from the reason sentence.',
      },
    },
    {
      title: { zh: '危险动作先被否定', en: 'The rejected action is the distractor' },
      body: {
        zh: '第 16 题问遇险怎么办，录音先说 do not fight straight back，再给正确游法 swim parallel。规则类独白常先否定常见错误做法，听到 do not、never 时把对应选项划掉。',
        en: 'Item 16 asks what to do in a rip. The talk first rejects fighting straight back, then gives swimming parallel. Safety talks often rule out the common wrong move first; cross out an option when you hear do not or never.',
      },
    },
    {
      title: { zh: '配对题先记岗位再记工作', en: 'For matching, note the role then the duty' },
      body: {
        zh: '第 18–20 题把团队成员与职责配对。独白先报身份（junior lifeguard、first aider、senior lifeguard），再说动作；听到身份词在题号旁做记号，再把 patrols、checks、speaks to 对上选项字母。',
        en: 'Items 18 to 20 pair team members with duties. The guide names the role first, junior lifeguard, first aider or senior lifeguard, then the action. Mark the role beside the number, then match patrols, checks and speaks to a letter.',
      },
    },
  ],
};
