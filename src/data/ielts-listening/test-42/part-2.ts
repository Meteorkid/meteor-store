import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 42 · Part 2 — 社区工具图书馆介绍（单人独白）。原创仿真材料，非官方真题。
 *
 * 独白顺序：借还规则与期限 → 工具维护与破损上报 → 安全培训 → 开放时间 → 志愿者排班
 * （填空块在前半段），后半段集中回答带走工具前的手续、破损处理、培训重点与志愿者要求（单选块）。
 */
export const test42Part2: ListeningLesson = {
  slug: 'test-42-part-2',
  part: 2,
  status: 'published',
  title: { zh: '社区工具图书馆介绍', en: 'Introducing a community tool library' },
  summary: {
    zh: '图书馆协调员向新成员介绍社区工具馆：借期与归还货架、工具清洁与破损上报、月度安全培训内容、周六及工作日开放时间，以及志愿者周排班与班次内容；后半段回答带走工具前的手续、破损工具处理、培训最细章节和志愿者续训要求。',
    en: 'The library coordinator briefs new members on the community tool library: loan periods and return shelves, cleaning and damage reports, the monthly safety training, Saturday and weekday opening hours, and the volunteer weekly rota; the latter half answers questions on pre-loan procedures, damaged tool handling, the training’s main section, and volunteer renewal requirements.',
  },
  accent: { zh: '协调员为南非口音，语速平稳，规则部分会重复强调。', en: 'The coordinator speaks with a South African accent at a steady pace, repeating the rules that matter most.' },
  speechRate: '+8%',
  cast: [
    { id: 'coordinator', label: 'COORDINATOR', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Standard loan period: ', cells: [[{ blank: 11 }, { text: ' days.' }]] },
        { lead: 'Return tools to the', cells: [[{ blank: 12 }, { text: ' shelf.' }]] },
        { lead: 'Report a', cells: [[{ blank: 13 }, { text: ' tool to the desk.' }]] },
        { lead: 'Safety training runs once a', cells: [[{ blank: 14 }]] },
        { lead: 'Opens at nine on', cells: [[{ blank: 15 }, { text: ' mornings.' }]] },
        { lead: 'Volunteers sign the', cells: [[{ blank: 16 }, { text: ' rota.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'What must users do before taking a tool home?',
          options: [
            { key: 'A', text: 'Pay a deposit for every small hand tool.' },
            { key: 'B', text: 'Show the library card and complete safety training.' },
            { key: 'C', text: 'Reserve the tool at least one day ahead.' },
          ],
        },
        {
          number: 18,
          stem: 'How are damaged tools handled?',
          options: [
            { key: 'A', text: 'They are repaired by the borrowing member at home.' },
            { key: 'B', text: 'They are separated from working stock and logged in the repair book.' },
            { key: 'C', text: 'They are thrown away immediately after return.' },
          ],
        },
        {
          number: 19,
          stem: 'What does the safety training cover in most detail?',
          options: [
            { key: 'A', text: 'Safe clamping of workpieces.' },
            { key: 'B', text: 'Eye wear maintenance.' },
            { key: 'C', text: 'First aid for burns.' },
          ],
        },
        {
          number: 20,
          stem: 'What is required of volunteers beyond their shift?',
          options: [
            { key: 'A', text: 'They must work a weekend shift each month.' },
            { key: 'B', text: 'They attend one short update each term and keep training current.' },
            { key: 'C', text: 'They may borrow power tools free during shifts.' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['three', '3'], evidence: 4,
      explanation: {
        zh: '定位句 4：The standard loan period is three days, and longer requests need approval。标准借期三天；longer requests 是延期情形，不是借期答案。',
        en: 'Sentence 4: "The standard loan period is three days, and longer requests need approval". The standard loan is three days; longer requests are an extension case, not the period.',
      },
    },
    {
      number: 12, accepted: ['numbered'], evidence: 5,
      explanation: {
        zh: '定位句 5：return them to the numbered shelf in the right aisle。工具还到编号货架；right aisle 是位置参照，不是货架名称。',
        en: 'Sentence 5: "return them to the numbered shelf in the right aisle". Tools go back to the numbered shelf; the right aisle locates it but is not the shelf name.',
      },
    },
    {
      number: 13, accepted: ['broken'], evidence: 10,
      explanation: {
        zh: '定位句 10：If you find a broken tool, do not try to repair it yourself at home。破损工具要上报，空前是 a，填 broken；damaged 在句 11 是同义复述。',
        en: 'Sentence 10: "If you find a broken tool, do not try to repair it yourself at home". The damaged tool is reported; a precedes the gap, so write broken. Sentence 11 restates it as damaged.',
      },
    },
    {
      number: 14, accepted: ['month'], evidence: 14,
      explanation: {
        zh: '定位句 14：The session runs once a month, and it lasts about forty minutes。培训每月一次；forty minutes 是时长，不是周期答案。',
        en: 'Sentence 14: "The session runs once a month, and it lasts about forty minutes". Training runs monthly; forty minutes is the duration, not the cycle.',
      },
    },
    {
      number: 15, accepted: ['Saturday'], evidence: 18,
      explanation: {
        zh: '定位句 18：The library opens at nine on Saturday mornings and closes at twelve。九点开门的是周六上午；句 19 的工作日傍晚是另一组时间。',
        en: 'Sentence 18: "The library opens at nine on Saturday mornings and closes at twelve". Nine opening applies to Saturday mornings; weekday evenings in sentence 19 are a separate time set.',
      },
    },
    {
      number: 16, accepted: ['weekly'], evidence: 22,
      explanation: {
        zh: '定位句 22：Volunteers sign the weekly rota at the desk, and each shift is two hours。志愿者签周排班表；two hours 是单班时长，不是排班周期。',
        en: 'Sentence 22: "Volunteers sign the weekly rota at the desk, and each shift is two hours". Volunteers sign the weekly rota; two hours is the shift length, not the cycle.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 27,
      explanation: {
        zh: '定位句 27：Show the library card at the desk, and have your safety training marked complete。带走工具前要出示借书卡并完成安全培训，对应 B。A 的小件工具押金在句 39 被限定为罕见电动工具，C 的提前一天预订在录音中没有依据。',
        en: 'Sentence 27: "Show the library card at the desk, and have your safety training marked complete", matching B. Deposits for small hand tools are ruled out in sentence 39, and booking a day ahead is not said.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 30,
      explanation: {
        zh: '定位句 30：They are separated from the working stock and logged in the repair book。破损工具与可用库存分开并记入维修簿，对应 B。A 的由借用人在家自修与句 10 相反，C 的立即丢弃在录音中没有依据。',
        en: 'Sentence 30: "They are separated from the working stock and logged in the repair book", matching B. Home repair by the member contradicts sentence 10, and immediate disposal is not mentioned.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 33,
      explanation: {
        zh: '定位句 33：The main section is safe clamping, so workpieces do not move under the tool。培训最细的部分是工件牢固夹紧，对应 A。B 的护眼和 C 的烧伤急救在句 34 只是较短章节。',
        en: 'Sentence 33: "The main section is safe clamping, so workpieces do not move under the tool", matching A. Eye wear and burn first aid are shorter parts in sentence 34.',
      },
    },
    {
      number: 20, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：Volunteers attend one short update each term, and they keep their own training current。志愿者每学期参加一次短进修并保持培训有效，对应 B。A 的每月周末班次和 C 的班次内免费借电动工具在录音中没有依据。',
        en: 'Sentence 36: "Volunteers attend one short update each term, and they keep their own training current", matching B. A monthly weekend shift and free power tool loans during shifts are not mentioned.',
      },
    },
  ],
  transcript: [
    { speaker: 'coordinator', text: 'Right, before you sign up as a tool library member, here are the rules we follow.' },
    { speaker: 'coordinator', text: 'I am Leah, the library coordinator, and I will walk you through the basics.' },
    { speaker: 'coordinator', text: 'First, the borrowing and return rules for tools.' },
    { speaker: 'coordinator', text: 'Each member may take out up to four tools at one time.' },
    { speaker: 'coordinator', text: 'The standard loan period is three days, and longer requests need approval.' },
    { speaker: 'coordinator', text: 'When you bring tools back, return them to the numbered shelf in the right aisle.' },
    { speaker: 'coordinator', text: 'Check that the tool bag matches the list printed on the shelf card.' },
    { speaker: 'coordinator', text: 'If a tool is late, the member pauses new loans until it comes back.' },
    { speaker: 'coordinator', text: 'Next, the upkeep of the tools themselves.' },
    { speaker: 'coordinator', text: 'Before you borrow, wipe the handles clean and remove any loose dirt.' },
    { speaker: 'coordinator', text: 'If you find a broken tool, do not try to repair it yourself at home.' },
    { speaker: 'coordinator', text: 'Report a damaged tool to the desk, and we mark it out of circulation.' },
    { speaker: 'coordinator', text: 'Keep sharp blades in their guards, and carry hammers head down.' },
    { speaker: 'coordinator', text: 'Now, the safety training we ask every member to complete.' },
    { speaker: 'coordinator', text: 'The session runs once a month, and it lasts about forty minutes.' },
    { speaker: 'coordinator', text: 'It covers eye protection, safe clamping, and what to do in a slip.' },
    { speaker: 'coordinator', text: 'New members attend the first training before taking any power tool home.' },
    { speaker: 'coordinator', text: 'Opening hours matter, so note the times on the door card.' },
    { speaker: 'coordinator', text: 'The library opens at nine on Saturday mornings and closes at twelve.' },
    { speaker: 'coordinator', text: 'On weekdays it opens at six in the evening and stays open until nine.' },
    { speaker: 'coordinator', text: 'We are closed on Sundays, except for the volunteer work sessions.' },
    { speaker: 'coordinator', text: 'The last topic is the volunteer rota that keeps the doors open.' },
    { speaker: 'coordinator', text: 'Volunteers sign the weekly rota at the desk, and each shift is two hours.' },
    { speaker: 'coordinator', text: 'A volunteer reshelves tools, checks returns, and greets new members.' },
    { speaker: 'coordinator', text: 'You can trade a shift with another volunteer once you have been trained.' },
    { speaker: 'coordinator', text: 'Now a few questions I am often asked in this briefing.' },
    { speaker: 'coordinator', text: 'What must users do before taking a tool home?' },
    { speaker: 'coordinator', text: 'Show the library card at the desk, and have your safety training marked complete.' },
    { speaker: 'coordinator', text: 'You may reserve a tool in advance, but collection still needs the card.' },
    { speaker: 'coordinator', text: 'How are damaged tools handled once they come back?' },
    { speaker: 'coordinator', text: 'They are separated from the working stock and logged in the repair book.' },
    { speaker: 'coordinator', text: 'A spare replacement is given out only after the repair note is signed.' },
    { speaker: 'coordinator', text: 'What does the safety training cover in most detail?' },
    { speaker: 'coordinator', text: 'The main section is safe clamping, so workpieces do not move under the tool.' },
    { speaker: 'coordinator', text: 'Eye wear and first aid are shorter parts of the same session.' },
    { speaker: 'coordinator', text: 'What is required of volunteers beyond their shift?' },
    { speaker: 'coordinator', text: 'Volunteers attend one short update each term, and they keep their own training current.' },
    { speaker: 'coordinator', text: 'They do not take tools home for personal projects during a volunteer shift.' },
    { speaker: 'coordinator', text: 'Finally, a note on membership fees.' },
    { speaker: 'coordinator', text: 'Joining is free, and deposits are only held for rare power tools.' },
    { speaker: 'coordinator', text: 'The deposit is returned when the tool comes back in good order.' },
    { speaker: 'coordinator', text: 'If you damage a tool through misuse, the repair cost may be charged to the member.' },
    { speaker: 'coordinator', text: 'The shelf labels are colour coded by tool type, so look for the right band.' },
    { speaker: 'coordinator', text: 'Large benches at the back are for quick fixes, not whole projects.' },
    { speaker: 'coordinator', text: 'Please keep the floor clear of cable runs when you borrow electrical tools.' },
    { speaker: 'coordinator', text: 'The coordinator holds a short monthly meeting for anyone who volunteers.' },
    { speaker: 'coordinator', text: 'You can read the full rule booklet by the door before your first loan.' },
    { speaker: 'coordinator', text: 'Most members find the return shelf easier to use after their second visit.' },
    { speaker: 'coordinator', text: 'Any questions before you collect your library card today?' },
    { speaker: 'coordinator', text: 'No, then please wait by the desk while I print the cards.' },
  ],
  vocabulary: [
    {
      term: 'loan', phonetic: '/ləʊn/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '借出，借阅（期限与记录）', en: 'the act of borrowing an item from the library' },
      usage: { zh: '可数或不可数；the loan period、take out on loan。', en: 'The loan period, take out on loan.' },
      collocations: ['the loan period', 'on loan', 'a new loan'],
      example: { en: 'The standard loan period for tools is three days.', zh: '工具的标准借期是三天。' },
      listening: { zh: '单音节，双元音 /əʊ/，结尾 /n/ 读出来。', en: 'One syllable with /əʊ/; pronounce the final /n/.' },
    },
    {
      term: 'aisle', phonetic: '/aɪl/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '（货架之间的）通道', en: 'the passage between shelves in a library or shop' },
      usage: { zh: '可数名词；in the right aisle、down the aisle。结尾 s 不发音。', en: 'Countable: in the right aisle; the final s is silent.' },
      collocations: ['the right aisle', 'a narrow aisle', 'down the aisle'],
      example: { en: 'The numbered shelf sits in the right aisle.', zh: '编号货架在右侧通道。' },
      listening: { zh: '双元音 /aɪ/，结尾 /l/，s 静默。', en: 'Vowel /aɪ/ with final /l/; s is silent.' },
    },
    {
      term: 'upkeep', phonetic: '/ˈʌpkiːp/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '维护保养，日常打理', en: 'the work of keeping tools clean and in good order' },
      usage: { zh: '不可数；the upkeep of the tools、regular upkeep。', en: 'Uncountable: the upkeep of the tools, regular upkeep.' },
      collocations: ['tool upkeep', 'regular upkeep', 'the upkeep of tools'],
      example: { en: 'The upkeep of the tools is shared by every member.', zh: '工具的日常打理由每位成员共同承担。' },
      listening: { zh: '复合词，重音在第一个词 up。', en: 'Compound with stress on up.' },
    },
    {
      term: 'damaged', phonetic: '/ˈdæmɪdʒd/', partOfSpeech: 'adj.', sentenceIndex: 11,
      meaning: { zh: '损坏的，有破损的', en: 'broken or worn so that it cannot be used safely' },
      usage: { zh: '形容词；a damaged tool、report damaged equipment。动词是 damage。', en: 'Adjective: a damaged tool. The verb is damage.' },
      collocations: ['a damaged tool', 'damaged equipment', 'report damaged tools'],
      example: { en: 'Report a damaged tool to the desk rather than fixing it.', zh: '破损工具报到前台，不要自行修理。' },
      listening: { zh: '两个音节，重音在第一个；结尾 /dʒd/。', en: 'Two syllables with first-syllable stress; ending /dʒd/.' },
    },
    {
      term: 'clamping', phonetic: '/ˈklæmpɪŋ/', partOfSpeech: 'n.', sentenceIndex: 33,
      meaning: { zh: '夹紧，固定工件（用夹具）', en: 'holding a workpiece firmly in a vice or clamp' },
      usage: { zh: '不可数；safe clamping、clamp the workpiece。动词是 clamp。', en: 'Uncountable: safe clamping. The verb is clamp.' },
      collocations: ['safe clamping', 'clamp the workpiece', 'secure clamping'],
      example: { en: 'Safe clamping keeps the workpiece still under the tool.', zh: '牢固夹紧能让工件在工具下保持不动。' },
      listening: { zh: '两个音节，重音在第一个；/kl/ 连在一起。', en: 'Two syllables with first stress; /kl/ is a cluster.' },
    },
    {
      term: 'rota', phonetic: '/ˈrəʊtə/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '排班表，值班轮次表', en: 'the list showing who volunteers on which shift' },
      usage: { zh: '可数名词；sign the rota、the weekly rota。美式常说 schedule。', en: 'Countable: sign the rota; Americans say schedule.' },
      collocations: ['the weekly rota', 'sign the rota', 'the volunteer rota'],
      example: { en: 'Volunteers sign the weekly rota at the library desk.', zh: '志愿者在前台签周排班表。' },
      listening: { zh: '两个音节，重音在第一个；与 rotor 读音不同。', en: 'Two syllables with first stress; do not confuse it with rotor.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk you through', sentenceIndex: 1,
      meaning: { zh: '带你逐项过一遍', en: 'to explain the rules step by step' },
      usage: { zh: '及物短语动词；walk somebody through the basics、through the rules。', en: 'Transitive: walk somebody through the basics or rules.' },
      example: { en: 'I will walk you through the library rules before your first loan.', zh: '第一次借阅前我带你把馆规过一遍。' },
    },
    {
      phrase: 'take out', sentenceIndex: 3,
      meaning: { zh: '借出（工具）', en: 'to borrow an item from the shelf' },
      usage: { zh: 'take out tools、take out on loan；与 return 相对。', en: 'Take out tools; the opposite is return.' },
      example: { en: 'Each member may take out four tools at one time.', zh: '每位成员一次最多借出四件工具。' },
    },
    {
      phrase: 'out of circulation', sentenceIndex: 11,
      meaning: { zh: '停止流通，下架不可借', en: 'removed from the available stock until repaired' },
      usage: { zh: '图书馆语境；mark something out of circulation。', en: 'Library usage: mark something out of circulation.' },
      example: { en: 'Damaged tools are marked out of circulation after the report.', zh: '破损工具上报后即下架不可借。' },
    },
    {
      phrase: 'separated from', sentenceIndex: 30,
      meaning: { zh: '与……分开放置', en: 'kept apart from the rest of the stock' },
      usage: { zh: 'separated from the working stock；后接被分离的对象。', en: 'Separated from the working stock; followed by what is apart.' },
      example: { en: 'Broken tools are separated from the working stock.', zh: '损坏工具与可用库存分开放。' },
    },
    {
      phrase: 'keep their own training current', sentenceIndex: 36,
      meaning: { zh: '保持培训有效，及时续训', en: 'to renew safety training before it expires' },
      usage: { zh: 'keep something current；与 outdated 相对。', en: 'Keep something current; the opposite is outdated.' },
      example: { en: 'Volunteers keep their own safety training current each term.', zh: '志愿者每学期更新自己的安全培训。' },
    },
    {
      phrase: 'trade a shift', sentenceIndex: 24,
      meaning: { zh: '和他人对调班次', en: 'to exchange a volunteer shift with another person' },
      usage: { zh: 'trade a shift with somebody；与 swap a shift 近义。', en: 'Trade a shift with somebody; similar to swap a shift.' },
      example: { en: 'You can trade a shift with another volunteer after training.', zh: '培训后你可以和其他志愿者对调班次。' },
    },
  ],
  tips: [
    {
      title: { zh: '周期与时长分开记', en: 'Keep cycles and durations apart' },
      body: {
        zh: '第 14 题问培训周期、第 16 题问排班周期，相邻句子还给出 forty minutes、two hours 这类时长。听前看清空格问的是 once a 还是 lasts，落笔前确认对应周期而不是时长。',
        en: 'Items 14 and 16 ask for cycles, while nearby sentences give durations such as forty minutes and two hours. Check whether the gap asks for once a or lasts, and confirm the cycle rather than the duration before writing.',
      },
    },
    {
      title: { zh: '路标词切分规则段落', en: 'Split rules by signpost words' },
      body: {
        zh: 'First、Next、Now、Opening hours、The last topic 是独白的段落路标。听到路标就跳到对应话题的题号：借还、维护、培训、时间、排班，避免把上一段细节填进下一段的空里。',
        en: 'First, Next, Now, Opening hours and The last topic are section signposts. Jump to the matching topic when you hear one: loans, upkeep, training, hours, rota, so details from one block do not fill the next gap.',
      },
    },
    {
      title: { zh: '被否定的处理方式先排除', en: 'Rule out rejected handling methods' },
      body: {
        zh: '第 18 题 A 项的在家自修与录音中 do not try to repair it yourself 相反。干扰项常把禁止的做法改成建议；听到 do not、never 时先在选项旁画叉，再确认被允许的流程。',
        en: 'Option A for item 18, home repair, contradicts do not try to repair it yourself. Distractors turn bans into suggestions; mark a cross after do not or never, then confirm the allowed procedure.',
      },
    },
  ],
};
