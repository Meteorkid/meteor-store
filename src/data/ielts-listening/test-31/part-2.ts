import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 31 · Part 2 — 滑雪场安全讲解（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：雪道分级 → 缆车乘坐 → 装备检查 → 雪崩预警与救援电话 → 五类人群各自遵守的规则
 * （配对 16–20）→ 天气、急救与收尾提醒。开场用现场安全指令，不用 welcome to。
 */
export const test31Part2: ListeningLesson = {
  slug: 'test-31-part-2',
  part: 2,
  status: 'published',
  title: { zh: '滑雪场安全讲解', en: 'A safety briefing at a ski resort' },
  summary: {
    zh: '雪场安全员向一组滑雪者说明雪道颜色分级、缆车乘坐姿势、租雪具前的装备检查、雪崩预警告示与救援电话，随后分别讲初学者、缆车乘客、租板者、看到雪崩告示者和结伴同行者各自要遵守的规则，最后补充天气、急救与下山时间提醒。',
    en: 'A snow safety officer briefs a group on piste colour grading, chairlift behaviour, gear checks before renting, the avalanche warning board and the rescue line, then matches five groups to their own rules: beginners, lift users, renters, skiers near an avalanche notice, and those following a friend, with weather, first aid and closing-time notes.',
  },
  accent: { zh: '发言人为新西兰口音，安全要求处会放慢并重复。', en: 'The speaker has a New Zealand accent and slows down to repeat the safety rules.' },
  speechRate: '+2%',
  cast: [
    { id: 'officer', label: 'OFFICER', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'The easiest slopes are marked', cells: [[{ blank: 11 }]] },
        { lead: 'Lift users must keep their', cells: [[{ blank: 12 }, { text: ' secure' }]] },
        { lead: 'Check the', cells: [[{ blank: 13 }, { text: ' before leaving the rental desk' }]] },
        { lead: 'Avalanche warning level is posted on the', cells: [[{ blank: 14 }]] },
        { lead: 'Emergency rescue answered by the', cells: [[{ blank: 15 }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which rule applies to each group? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'stay on marked trails only' },
        { key: 'B', text: 'keep a fixed distance behind the skier ahead' },
        { key: 'C', text: 'remove the ski poles before boarding' },
        { key: 'D', text: 'check bindings with a technician' },
        { key: 'E', text: 'wait for the patrol before leaving the slope' },
        { key: 'F', text: 'carry a partner’s details in the pocket' },
      ],
      items: [
        { number: 16, text: 'beginners on green runs' },
        { number: 17, text: 'people using the chairlift' },
        { number: 18, text: 'people renting skis' },
        { number: 19, text: 'skiers near an avalanche notice' },
        { number: 20, text: 'the group following a friend' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['green'], evidence: 3,
      explanation: {
        zh: '定位句 3：The easiest slopes are marked green。最容易的雪道标绿色；句 4 的蓝色、句 5 的黑色是更高难度级别，不能填。',
        en: 'Sentence 3: "The easiest slopes are marked green". The easiest runs are green. Blue in sentence 4 and black in sentence 5 mark harder grades.',
      },
    },
    {
      number: 12, accepted: ['backpack'], evidence: 7,
      explanation: {
        zh: '定位句 7：keep your backpack secure so it does not swing against the chair。缆车乘客须把背包固定好；空后已印 secure，填 backpack。',
        en: 'Sentence 7: "keep your backpack secure so it does not swing against the chair". The backpack must be secured; secure is printed, so write backpack.',
      },
    },
    {
      number: 13, accepted: ['boots'], evidence: 11,
      explanation: {
        zh: '定位句 11：Before you leave the rental desk, look at your boots。离开租板台之前检查靴子；句 13 的 skis 是另一类装备，不能混填。',
        en: 'Sentence 11: "Before you leave the rental desk, look at your boots". The check before the desk concerns boots. Skis in sentence 13 are a separate item.',
      },
    },
    {
      number: 14, accepted: ['noticeboard'], evidence: 15,
      explanation: {
        zh: '定位句 15：check the warning level posted on the noticeboard at the base。预警等级贴在告示板上；句 16 说的是每日更新，不是张贴位置。',
        en: 'Sentence 15: "check the warning level posted on the noticeboard at the base". The level is posted on the noticeboard. Sentence 16 describes daily updates, not the location.',
      },
    },
    {
      number: 15, accepted: ['ski patrol'], evidence: 19,
      explanation: {
        zh: '定位句 19：the ski patrol answers at all lift hours。救援电话由雪道巡逻队接听；句 20 要求把号码存进手机，接听方仍是巡逻队。',
        en: 'Sentence 19: "the ski patrol answers at all lift hours". The rescue line is answered by the ski patrol. Sentence 20 asks you to save the number, not a different responder.',
      },
    },
    {
      number: 16, accepted: ['A'], evidence: 22,
      explanation: {
        zh: '定位句 22：The beginners on green runs must stay on marked trails only。初学者只走有标记的雪道，对应 A。句 23 的保持距离是缆车规则，不归初学者。',
        en: 'Sentence 22: "The beginners on green runs must stay on marked trails only". Beginners keep to marked trails, matching A. The distance rule in sentence 23 applies to lift users.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：Anyone using the chairlift should keep a fixed distance behind the skier ahead。缆车乘客与前方滑行者保持固定距离，对应 B。C 的取下雪杖在讲解中没有出现。',
        en: 'Sentence 23: "Anyone using the chairlift should keep a fixed distance behind the skier ahead". Lift users keep a fixed distance, matching B. Removing poles in C is never mentioned.',
      },
    },
    {
      number: 18, accepted: ['D'], evidence: 24,
      explanation: {
        zh: '定位句 24：People renting skis at the shop should have the bindings checked by a technician。租板者请技师检查固定器，对应 D。句 12 讲靴子是否卡紧，是自助检查，不是技师动作。',
        en: 'Sentence 24: "People renting skis at the shop should have the bindings checked by a technician". Renters get bindings checked by a technician, matching D. Boot fit in sentence 12 is a self-check, not the technician step.',
      },
    },
    {
      number: 19, accepted: ['E'], evidence: 25,
      explanation: {
        zh: '定位句 25：Skiers who see an avalanche notice should wait for the patrol before leaving the marked slope。看到雪崩告示要等巡逻队再离开雪道，对应 E。A 的只走标记道是初学者规则，不专属于告示场景。',
        en: 'Sentence 25: "Skiers who see an avalanche notice should wait for the patrol before leaving the marked slope". Those near a notice wait for the patrol, matching E. Staying on trails in A is the beginner rule.',
      },
    },
    {
      number: 20, accepted: ['F'], evidence: 26,
      explanation: {
        zh: '定位句 26：Anyone following a friend downhill should carry that partner’s contact details in their pocket。结伴者随身带同伴联系方式，对应 F。句 27 的口哨是领队集合信号，不是随身物品。',
        en: 'Sentence 26: "Anyone following a friend downhill should carry that partner’s contact details in their pocket". A follower carries the partner’s details, matching F. The whistle in sentence 27 is the leader’s signal, not an item carried.',
      },
    },
  ],
  transcript: [
    { speaker: 'officer', text: 'Keep your skis within sight of the lift line, and do not stop where another rider could run into you.' },
    { speaker: 'officer', text: 'I’m the snow safety officer for today, and these next few points apply to every run on the mountain.' },
    { speaker: 'officer', text: 'First, the piste grading. Each trail is marked by a colour at the entrance.' },
    { speaker: 'officer', text: 'The easiest slopes are marked green, and they are wide, gentle runs for first-day skiers.' },
    { speaker: 'officer', text: 'Blue runs are steeper and narrower, and red runs should be left to those with some speed control.' },
    { speaker: 'officer', text: 'The black diamond faces are the hardest, with ice and drops that need confidence and experience.' },
    { speaker: 'officer', text: 'Stick to the green trails until your group can stop and turn under control.' },
    { speaker: 'officer', text: 'Next, riding the chairlift. Wait in the queue, and keep your backpack secure so it does not swing against the chair.' },
    { speaker: 'officer', text: 'Hold the safety bar down once you sit, and keep your poles together on your lap until the top station.' },
    { speaker: 'officer', text: 'When the ramp appears, lift the bar early and slide off to the side rather than blocking the exit.' },
    { speaker: 'officer', text: 'If you drop a glove or a pole on the way up, do not lean out; the patrol will collect it after the lift clears.' },
    { speaker: 'officer', text: 'Now the gear check. Before you leave the rental desk, look at your boots.' },
    { speaker: 'officer', text: 'The boots should click firmly into the bindings, and no part of the sole should feel loose.' },
    { speaker: 'officer', text: 'Skis borrowed from the shop are checked once a day, but you should still test the edge on a gentle run.' },
    { speaker: 'officer', text: 'Poles should reach your wrist when you stand upright; anything too long can throw off your balance.' },
    { speaker: 'officer', text: 'Avalanche conditions change with the weather, so check the warning level posted on the noticeboard at the base.' },
    { speaker: 'officer', text: 'The patrol updates it each morning, and a higher level means keeping to open trees rather than side slopes.' },
    { speaker: 'officer', text: 'If you hear a long siren over the speakers, move down to the marked valley trails and stay together.' },
    { speaker: 'officer', text: 'The forest above the treeline can hold snow overnight, and that is where slides start.' },
    { speaker: 'officer', text: 'For emergencies, the rescue line is oh eight hundred six five double three, and the ski patrol answers at all lift hours.', displayText: 'For emergencies, the rescue line is 0800 6533, and the ski patrol answers at all lift hours.' },
    { speaker: 'officer', text: 'Write that number in your phone now, and keep your pass in an inner pocket where it stays dry.' },
    { speaker: 'officer', text: 'Now, a few notes about who follows which rule on today’s group outing.' },
    { speaker: 'officer', text: 'The beginners on green runs must stay on marked trails only, away from the edges and the closed sections.' },
    { speaker: 'officer', text: 'Anyone using the chairlift should keep a fixed distance behind the skier ahead, to avoid a collision on the ramp.' },
    { speaker: 'officer', text: 'People renting skis at the shop should have the bindings checked by a technician before they head up.' },
    { speaker: 'officer', text: 'Skiers who see an avalanche notice should wait for the patrol before leaving the marked slope.' },
    { speaker: 'officer', text: 'Anyone following a friend downhill should carry that partner’s contact details in their pocket, in case they get split up.' },
    { speaker: 'officer', text: 'The group leader will whistle twice at each trail junction, so keep the leader in sight.' },
    { speaker: 'officer', text: 'If a member loses sight of the group, stop at the last junction rather than continuing alone.' },
    { speaker: 'officer', text: 'The patrol asks that all skiers stay within the mapped area, even on quiet weekdays.' },
    { speaker: 'officer', text: 'Off-piste travel needs its own equipment and training, which today’s group does not have.' },
    { speaker: 'officer', text: 'Lunch runs from twelve until two, and the patrol hut at mid-mountain sells hot drinks and soup.' },
    { speaker: 'officer', text: 'The last lift down leaves at four thirty, so plan your route well before that time.' },
    { speaker: 'officer', text: 'Children under twelve must wear a helmet on every lift, and helmets are available at the rental desk.' },
    { speaker: 'officer', text: 'If the weather turns, visibility falls quickly above the tree line, so descend when the clouds close in.' },
    { speaker: 'officer', text: 'Never ski over a closed fence or tape; it marks cornices or drops that cannot be seen from above.' },
    { speaker: 'officer', text: 'Report any injured rider to the nearest patrol, and do not move someone with a possible back injury.' },
    { speaker: 'officer', text: 'The first aid point sits beside the base café, and staff there can call the rescue line for you.' },
    { speaker: 'officer', text: 'Sun and wind can burn exposed skin fast above the snow, so use a high-protection cream each morning.' },
    { speaker: 'officer', text: 'Keep water in an insulated bottle, since drinks left in the cold freeze before noon.' },
    { speaker: 'officer', text: 'Before you set off today, check that your group has a whistle, a map and a charged phone.' },
    { speaker: 'officer', text: 'These items do not replace the patrol, but they help until help reaches you.' },
    { speaker: 'officer', text: 'Enjoy the slopes, and remember that slow riders keep to the right so others can pass safely.' },
  ],
  vocabulary: [
    {
      term: 'piste', phonetic: '/piːst/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '雪道，压过雪的滑雪坡', en: 'a prepared ski run marked for skiers' },
      usage: { zh: '不可数/可数；piste grading、off-piste。法语借词。', en: 'Countable or uncountable: piste grading, off-piste. A French loanword.' },
      collocations: ['the piste grading', 'off-piste travel', 'a marked piste'],
      example: { en: 'Stay on the marked piste until you can control your turns.', zh: '能控制转弯前请走标记雪道。' },
      listening: { zh: '结尾不读 /t/ 后加 s；与 piece 区分，靠上下文判断。', en: 'The final sound is /st/; do not confuse it with piece.' },
    },
    {
      term: 'bindings', phonetic: '/ˈbaɪndɪŋz/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '雪板固定器', en: 'the clip that locks a ski boot to the ski' },
      usage: { zh: '常用复数 bindings；ski bindings、check the bindings。', en: 'Often plural: ski bindings, check the bindings.' },
      collocations: ['the ski bindings', 'check the bindings', 'bindings click into'],
      example: { en: 'A technician should check the bindings before the first run.', zh: '首滑前应由技师检查固定器。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈbaɪ/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'avalanche', phonetic: '/ˈævəlæntʃ/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '雪崩', en: 'a mass of snow sliding down a mountain slope' },
      usage: { zh: '可数；avalanche warning、avalanche notice。', en: 'Countable: avalanche warning, avalanche notice.' },
      collocations: ['an avalanche notice', 'the avalanche warning', 'slide starts'],
      example: { en: 'Check the avalanche level before leaving the marked slopes.', zh: '离开标记雪道前先看雪崩等级。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈæv/；中间 /əl/ 弱读。', en: 'Three syllables, first stress; the middle /əl/ is weak.' },
    },
    {
      term: 'patrol', phonetic: '/pəˈtroʊl/', partOfSpeech: 'n.', sentenceIndex: 19,
      meaning: { zh: '巡逻队，雪道安全员', en: 'the team that monitors the mountain and rescues riders' },
      usage: { zh: 'the ski patrol；动词 patrol 同形，重音在第二音节。', en: 'the ski patrol; the verb patrol has the same second-syllable stress.' },
      collocations: ['the ski patrol', 'wait for the patrol', 'the patrol hut'],
      example: { en: 'The ski patrol answers the rescue line during lift hours.', zh: '雪道巡逻队在缆车时段接听救援电话。' },
      listening: { zh: '重音在第二音节 /ˈtroʊl/，开头 /pə/ 很轻。', en: 'Stress the second syllable; the opening /pə/ is weak.' },
    },
    {
      term: 'technician', phonetic: '/tekˈnɪʃn/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '技师，设备检查员', en: 'a skilled person who checks and repairs equipment' },
      usage: { zh: '可数；a ski technician、bindings checked by a technician。', en: 'Countable: a ski technician, bindings checked by a technician.' },
      collocations: ['a trained technician', 'checked by a technician', 'a ski technician'],
      example: { en: 'The technician tests the bindings before skis leave the shop.', zh: '技师在雪具离店前测试固定器。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈnɪʃ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'junction', phonetic: '/ˈdʒʌŋkʃn/', partOfSpeech: 'n.', sentenceIndex: 27,
      meaning: { zh: '岔路口，雪道交汇点', en: 'the point where two trails meet or split' },
      usage: { zh: '可数；trail junction、road junction。', en: 'Countable: a trail junction, a road junction.' },
      collocations: ['the trail junction', 'stop at the junction', 'the junction marker'],
      example: { en: 'Stop at the last junction if you lose sight of the group.', zh: '看不到队伍时就在上一个岔路口停下。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈdʒʌŋ/；中间 /kʃ/ 连读。', en: 'Two syllables, first stress; the /kʃ/ blends together.' },
    },
    {
      term: 'visibility', phonetic: '/ˌvɪzəˈbɪləti/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '能见度', en: 'how far you can see through mist or falling snow' },
      usage: { zh: '不可数；visibility falls、poor visibility。', en: 'Uncountable: visibility falls, poor visibility.' },
      collocations: ['visibility falls', 'poor visibility', 'low visibility'],
      example: { en: 'Visibility drops fast above the tree line in cloud.', zh: '云雾中林线以上能见度迅速下降。' },
      listening: { zh: '五个音节，重音在第三音节 /ˈbɪl/。', en: 'Five syllables with stress on the third.' },
    },
  ],
  expressions: [
    {
      phrase: 'riding the chairlift', sentenceIndex: 7,
      meaning: { zh: '乘坐缆车', en: 'travelling on the chairlift up the mountain' },
      usage: { zh: 'ride the lift；动名词 riding 作主语。', en: 'Ride the lift; the gerund riding acts as the subject.' },
      example: { en: 'Keep the backpack secure when riding the chairlift.', zh: '坐缆车时把背包固定好。' },
    },
    {
      phrase: 'under control', sentenceIndex: 6,
      meaning: { zh: '在控制之下，能停能转', en: 'able to stop and turn without losing balance' },
      usage: { zh: '固定搭配；stop and turn under control。', en: 'Fixed phrase: stop and turn under control.' },
      example: { en: 'Ski the green runs until you stay under control.', zh: '能稳住之前滑绿道即可。' },
    },
    {
      phrase: 'split up', sentenceIndex: 26,
      meaning: { zh: '（队伍）走散，分开', en: 'to become separated from the rest of the group' },
      usage: { zh: '可分短语动词；get split up、split up the group。', en: 'Separable: get split up, split up the group.' },
      example: { en: 'Carry your partner’s details in case you split up.', zh: '带上同伴联系方式，以防走散。' },
    },
    {
      phrase: 'head up', sentenceIndex: 24,
      meaning: { zh: '上山，往高处走', en: 'to go up the mountain toward the slopes' },
      usage: { zh: 'head 此处为不及物动词；head up the mountain。', en: 'Here head is intransitive: head up the mountain.' },
      example: { en: 'Have the bindings checked before you head up.', zh: '上山前先检查固定器。' },
    },
    {
      phrase: 'closed sections', sentenceIndex: 22,
      meaning: { zh: '封闭路段', en: 'trail parts shut off after risk or maintenance' },
      usage: { zh: 'closed 作定语；closed sections、closed fence。', en: 'Closed as an adjective: closed sections, a closed fence.' },
      example: { en: 'Beginners keep away from the closed sections.', zh: '初学者远离封闭路段。' },
    },
    {
      phrase: 'charged phone', sentenceIndex: 40,
      meaning: { zh: '电量充足的手机', en: 'a mobile phone with enough battery for the day' },
      usage: { zh: 'charged 作定语；a charged phone、battery charged。', en: 'Charged as a modifier: a charged phone, battery charged.' },
      example: { en: 'Check that your group has a charged phone before setting off.', zh: '出发前确认队伍里有一部有电的手机。' },
    },
  ],
  tips: [
    {
      title: { zh: '笔记抓颜色与位置词', en: 'Catch colours and locations in the notes' },
      body: {
        zh: '第 11–15 题答案都出现在名词前的修饰位置：marked green、secure backpack、your boots、the noticeboard、the ski patrol。听到颜色、部位、场所名词时立刻回到对应行，别把相邻装备名（skis、poles）填错。',
        en: 'Items 11 to 15 sit before or after a noun: marked green, secure backpack, your boots, the noticeboard, the ski patrol. On colours, body parts or places, return to the row; do not swap in adjacent items like skis or poles.',
      },
    },
    {
      title: { zh: '配对按人群关键词锁定选项', en: 'Match people to rules by keyword' },
      body: {
        zh: '配对五个选项先缩成 trails、distance、technician、patrol、details。句 22–26 依次对应初学者、缆车乘客、租板者、告示旁、结伴者；听到人群名称再选规则，避免把缆车距离规则安到初学者身上。',
        en: 'Reduce the six options to trails, distance, technician, patrol, details. Sentences 22 to 26 order beginners, lift users, renters, notice skiers and followers. Match the rule after the group name, not before.',
      },
    },
    {
      title: { zh: '区分自检与技师检查', en: 'Separate self-checks from technician checks' },
      body: {
        zh: '句 12 的靴子是否卡紧是自助检查，句 24 的固定器才是技师动作。配对题问租板者的规则，选 technician 而不是 boots；听时盯住动作执行者是 you 还是 a technician。',
        en: 'Sentence 12’s boot fit is a self-check; only the bindings in sentence 24 are a technician task. The renter matching item selects technician, not boots. Listen for whether the actor is you or a technician.',
      },
    },
  ],
};
