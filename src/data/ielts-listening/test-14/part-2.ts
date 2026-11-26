import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 14 · Part 2 — 剧院后台参观导览（单人独白，澳式口音）。原创仿真材料，非官方真题。
 *
 * 独白按后台路线推进：舞台地板、服装间、灯光控制室、安全出口，再讲参观规则、
 * 讲解结束时间与后台各岗位分工。开场用现场提醒，不重复 welcome to 句式。
 */
export const test14Part2: ListeningLesson = {
  slug: 'test-14-part-2',
  part: 2,
  status: 'published',
  title: { zh: '剧院后台参观', en: 'A backstage tour of a theatre' },
  summary: {
    zh: '讲解员带参观者走过剧院后台：舞台木地板、服装间的戏服、灯光台的调光器、绿色安全出口，说明舞台活板的用途、参观禁令和讲解结束时间，并配对舞台经理、服装助理和灯光技师的职责。',
    en: 'A guide takes visitors backstage: the wooden stage floor, costumes in the wardrobe room, dimmers in the lighting control, and the green emergency exits. The talk explains the stage trap, the rules during a set change and when the tour ends, and matches the stage manager, wardrobe assistant and lighting technician to their duties.',
  },
  accent: { zh: '讲解员为澳式口音，语速中等。', en: 'The guide has an Australian accent and speaks at a moderate pace.' },
  speechRate: '+3%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-AU-NatashaNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      columns: ['Area', 'What you will see or do'],
      rows: [
        { lead: 'Stage floor', cells: [[{ text: 'traditional wooden ' }, { blank: 11 }]] },
        { lead: 'Costume room', cells: [[{ text: 'rails of period ' }, { blank: 12 }]] },
        { lead: 'Lighting control', cells: [[{ text: 'a bank of ' }, { blank: 13 }]] },
        { lead: 'Emergency exit', cells: [[{ blank: 14 }, { text: ' markings on the far wall' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 15,
          stem: 'What is the stage trap used for?',
          options: [
            { key: 'A', text: 'lifting scenery between scenes' },
            { key: 'B', text: 'lowering actors into a cellar' },
            { key: 'C', text: 'storing props during the day' },
          ],
        },
        {
          number: 16,
          stem: 'What must visitors not do backstage?',
          options: [
            { key: 'A', text: 'touch the lighting desk' },
            { key: 'B', text: 'walk across the stage during a set change' },
            { key: 'C', text: 'take photographs of the costumes' },
          ],
        },
        {
          number: 17,
          stem: 'When does the guided tour finish?',
          options: [
            { key: 'A', text: 'before the evening rehearsal' },
            { key: 'B', text: 'halfway through the rehearsal' },
            { key: 'C', text: 'after the evening performance' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'Which duty matches each member of the theatre staff? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'operates the flying scenery' },
        { key: 'B', text: 'repairs torn costumes' },
        { key: 'C', text: 'calls the lighting cues' },
        { key: 'D', text: 'polishes the stage floor' },
        { key: 'E', text: 'records the ticket sales' },
        { key: 'F', text: 'keeps the prop list' },
      ],
      items: [
        { number: 18, text: 'the stage manager' },
        { number: 19, text: 'the wardrobe assistant' },
        { number: 20, text: 'the lighting technician' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['boards'], evidence: 4,
      explanation: {
        zh: '定位句 4：Under your feet are the traditional wooden boards that make up the stage floor。舞台地面由传统木板铺成；sprung 是地板的弹性结构，不是空里的词。',
        en: 'Sentence 4: "Under your feet are the traditional wooden boards that make up the stage floor". The stage floor is made of wooden boards; sprung describes the floor’s spring, not the answer.',
      },
    },
    {
      number: 12, accepted: ['costumes'], evidence: 6,
      explanation: {
        zh: '定位句 6：rails of period costumes hang in long rows。服装间挂着一排排戏服；garment 是泛称，不填。',
        en: 'Sentence 6: "rails of period costumes hang in long rows". The wardrobe holds rows of period costumes; garment is a general term, not the answer.',
      },
    },
    {
      number: 13, accepted: ['dimmers'], evidence: 11,
      explanation: {
        zh: '定位句 11：A bank of these dimmers controls the whole lighting rig。调光台由一组调光器控制；sliders 是调光器上的推拉杆，不是设备名。',
        en: 'Sentence 11: "A bank of these dimmers controls the whole lighting rig". The lighting desk runs on a bank of dimmers; sliders are the levers on them, not the device itself.',
      },
    },
    {
      number: 14, accepted: ['green'], evidence: 13,
      explanation: {
        zh: '定位句 13：notice the emergency exit marked in green along the far wall。安全出口用绿色标记；fire escape 是出口外的设施，不是颜色。',
        en: 'Sentence 13: "notice the emergency exit marked in green along the far wall". The exit is marked green; the fire escape is the outside structure, not the colour.',
      },
    },
    {
      number: 15, accepted: ['A'], evidence: 16,
      explanation: {
        zh: '定位句 16：Through that opening, scenery can be lifted between one scene and the next。舞台活板用于换景时升降布景；下降演员和白天存放道具都不是它的用途。',
        en: 'Sentence 16: "Through that opening, scenery can be lifted between one scene and the next". The trap lifts scenery between scenes; lowering actors and storing props are not its uses.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：During a set change, do not walk across the stage, because scenery and flown pieces are still moving。换景时不能横穿舞台；碰灯光台在句 18 只是“请勿伸手”，拍照在句 20 被允许。',
        en: 'Sentence 19: "During a set change, do not walk across the stage, because scenery and flown pieces are still moving". Crossing the stage during a change is forbidden; touching the desk in sentence 18 means keep hands back, and photography is allowed in sentence 20.',
      },
    },
    {
      number: 17, accepted: ['A'], evidence: 22,
      explanation: {
        zh: '定位句 22：The tour finishes before that rehearsal starts, so you will not interrupt the cast。讲解在晚排练开始前结束；排练中途和演出结束后都与原文不符。',
        en: 'Sentence 22: "The tour finishes before that rehearsal starts, so you will not interrupt the cast". The tour ends before the rehearsal; halfway through and after the performance do not match the recording.',
      },
    },
    {
      number: 18, accepted: ['F'], evidence: 24,
      explanation: {
        zh: '定位句 24：The stage manager keeps the prop list and checks every item appears in the right scene。舞台经理保管道具清单，对应 F。',
        en: 'Sentence 24: "The stage manager keeps the prop list and checks every item appears in the right scene". The stage manager keeps the prop list, matching F.',
      },
    },
    {
      number: 19, accepted: ['B'], evidence: 26,
      explanation: {
        zh: '定位句 26：The wardrobe assistant repairs torn costumes and sews on missing buttons before the next night。服装助理修补破损戏服，对应 B。',
        en: 'Sentence 26: "The wardrobe assistant repairs torn costumes and sews on missing buttons before the next night". The wardrobe assistant repairs torn costumes, matching B.',
      },
    },
    {
      number: 20, accepted: ['C'], evidence: 28,
      explanation: {
        zh: '定位句 28：The lighting technician calls the lighting cues and works the dimmers during the show。灯光技师报灯光提示并操作调光器，对应 C。',
        en: 'Sentence 28: "The lighting technician calls the lighting cues and works the dimmers during the show". The lighting technician calls the lighting cues, matching C.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Stay on the marked walkway, and please do not touch any of the scenery.' },
    { speaker: 'guide', text: 'I’m Maya, one of the theatre guides, and I’ll take you backstage this afternoon.' },
    { speaker: 'guide', text: 'We’ll pass the stage, the costume room and the lighting control before we stop by the emergency exits.' },
    { speaker: 'guide', text: 'The first area is the main stage itself.' },
    { speaker: 'guide', text: 'Under your feet are the traditional wooden boards that make up the stage floor.' },
    { speaker: 'guide', text: 'These boards are sprung, so an actor landing from a jump does not jar their knees.' },
    { speaker: 'guide', text: 'To your left is the costume room, where rails of period costumes hang in long rows.' },
    { speaker: 'guide', text: 'Each garment is labelled with the play and the character who wears it.' },
    { speaker: 'guide', text: 'The wardrobe team repairs tears and replaces buttons between performances.' },
    { speaker: 'guide', text: 'Next door is the lighting control, raised above the stage so the operator can see every corner.' },
    { speaker: 'guide', text: 'On the desk in front are the sliders that set how bright each lamp becomes.' },
    { speaker: 'guide', text: 'A bank of these dimmers controls the whole lighting rig.' },
    { speaker: 'guide', text: 'The control room also holds the script for tonight’s rehearsal.' },
    { speaker: 'guide', text: 'Before we leave this side, notice the emergency exit marked in green along the far wall.' },
    { speaker: 'guide', text: 'Those exits lead to the fire escape outside, and they must never be blocked by props.' },
    { speaker: 'guide', text: 'The stage trap sits near the centre, a square opening in the floor.' },
    { speaker: 'guide', text: 'Through that opening, scenery can be lifted between one scene and the next.' },
    { speaker: 'guide', text: 'Now a few rules for your visit.' },
    { speaker: 'guide', text: 'The lighting desk is off limits, so please keep your hands behind the rail.' },
    { speaker: 'guide', text: 'During a set change, do not walk across the stage, because scenery and flown pieces are still moving.' },
    { speaker: 'guide', text: 'Photographs of the costumes are allowed as long as the flash is switched off.' },
    { speaker: 'guide', text: 'We have about twenty minutes left before the evening rehearsal begins.' },
    { speaker: 'guide', text: 'The tour finishes before that rehearsal starts, so you will not interrupt the cast.' },
    { speaker: 'guide', text: 'After we stop, the stage manager will be near the door by the prompt corner.' },
    { speaker: 'guide', text: 'The stage manager keeps the prop list and checks every item appears in the right scene.' },
    { speaker: 'guide', text: 'In the costume room you may meet the wardrobe assistant.' },
    { speaker: 'guide', text: 'The wardrobe assistant repairs torn costumes and sews on missing buttons before the next night.' },
    { speaker: 'guide', text: 'Upstairs in the control booth sits the lighting technician.' },
    { speaker: 'guide', text: 'The lighting technician calls the lighting cues and works the dimmers during the show.' },
    { speaker: 'guide', text: 'A stagehand, who you have not met, operates the flying scenery above the stage.' },
    { speaker: 'guide', text: 'The floor is polished by a member of the crew each morning.' },
    { speaker: 'guide', text: 'Box office staff are the ones who record the ticket sales, and they work out front.' },
    { speaker: 'guide', text: 'If you have questions about tonight’s show, the box office has the programmes.' },
    { speaker: 'guide', text: 'We’ll now walk across the rear corridor to the costume room for a closer look.' },
    { speaker: 'guide', text: 'Please stay in line, and watch the low doorway on your right.' },
    { speaker: 'guide', text: 'That doorway leads to the workshop where scenery is built.' },
    { speaker: 'guide', text: 'The corridor walls hold framed posters from productions in the last twenty years.' },
    { speaker: 'guide', text: 'If any alarm sounds, follow the green signs and wait outside the front entrance.' },
    { speaker: 'guide', text: 'The guide will answer questions after the tour, near the cloakroom.' },
    { speaker: 'guide', text: 'The costume room also holds a rail of hats and shoes from older productions.' },
    { speaker: 'guide', text: 'We keep the group together so that nobody wanders into the wings alone.' },
    { speaker: 'guide', text: 'Enjoy the rest of your time in the theatre.' },
  ],
  vocabulary: [
    {
      term: 'scenery', phonetic: '/ˈsiːnəri/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '舞台布景', en: 'painted sets and panels used on a stage' },
      usage: { zh: '不可数；stage scenery、flown scenery、scenery panels。', en: 'Uncountable: stage scenery, flown scenery, scenery panels.' },
      collocations: ['the scenery', 'flown scenery', 'stage scenery'],
      example: { en: 'Do not touch any of the scenery backstage.', zh: '后台请勿触碰布景。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈsiː/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'sprung', phonetic: '/sprʌŋ/', partOfSpeech: 'adj.', sentenceIndex: 5,
      meaning: { zh: '（地板）弹性架空的', en: 'built with a flexible sprung layer above the floor' },
      usage: { zh: '只作定语；sprung floor、sprung boards。', en: 'Attributive only: sprung floor, sprung boards.' },
      collocations: ['a sprung floor', 'sprung boards', 'sprung stage'],
      example: { en: 'The stage boards are sprung to protect the dancers’ knees.', zh: '舞台地板带弹性，保护舞者膝盖。' },
      listening: { zh: '单音节 /sprʌŋ/，开头 /spr/ 辅音连缀。', en: 'One syllable /sprʌŋ/ with an opening /spr/ cluster.' },
    },
    {
      term: 'costume', phonetic: '/ˈkɒstjuːm/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '戏服，演出服装', en: 'the clothing worn by an actor in a play' },
      usage: { zh: '可数，复数 costumes；period costume、costume room。', en: 'Countable, plural costumes: period costume, costume room.' },
      collocations: ['period costumes', 'the costume room', 'a costume designer'],
      example: { en: 'Rails of period costumes hang in the wardrobe room.', zh: '服装间挂着一排排戏服。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈkɒ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'dimmers', phonetic: '/ˈdɪməz/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '调光器（调节灯光亮度的设备）', en: 'a device that controls how bright a stage lamp is' },
      usage: { zh: '可数，常用复数 dimmers；a bank of dimmers。', en: 'Countable, often plural dimmers: a bank of dimmers.' },
      collocations: ['a bank of dimmers', 'the lighting dimmers', 'work the dimmers'],
      example: { en: 'A bank of dimmers controls the whole lighting rig.', zh: '一组调光器控制整套灯光设备。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈdɪ/；注意拼写双写 m。', en: 'Two syllables with stress on the first; note the double m in spelling.' },
    },
    {
      term: 'rig', phonetic: '/rɪɡ/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '成套设备（lighting rig 灯光架）', en: 'the whole set of equipment hung for a purpose' },
      usage: { zh: '可数；lighting rig、stage rig。', en: 'Countable: lighting rig, stage rig.' },
      collocations: ['the lighting rig', 'the stage rig', 'hang the rig'],
      example: { en: 'The lighting rig hangs above the stage.', zh: '灯光架悬挂在舞台上方。' },
      listening: { zh: '单音节 /rɪɡ/，结尾 /ɡ/ 要读清楚。', en: 'One syllable /rɪɡ/; pronounce the final /ɡ/.' },
    },
    {
      term: 'cues', phonetic: '/kjuːz/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '提示（灯光、台词的时机信号）', en: 'the signal that tells the team when a light or line comes' },
      usage: { zh: '可数；lighting cue、call a cue。', en: 'Countable: lighting cue, call a cue.' },
      collocations: ['lighting cues', 'call the cues', 'a stage cue'],
      example: { en: 'The technician calls the lighting cues during the show.', zh: '演出时灯光技师报灯光提示。' },
      listening: { zh: '单音节 /kjuː/，与 queue 同音。', en: 'One syllable /kjuː/, homophone of queue.' },
    },
    {
      term: 'wardrobe', phonetic: '/ˈwɔːrdrəʊb/', partOfSpeech: 'n.', sentenceIndex: 26,
      meaning: { zh: '服装间，戏服部门', en: 'the room or department that keeps and repairs costumes' },
      usage: { zh: '可数；wardrobe assistant、the wardrobe room。', en: 'Countable: wardrobe assistant, the wardrobe room.' },
      collocations: ['the wardrobe assistant', 'the wardrobe room', 'the wardrobe team'],
      example: { en: 'The wardrobe assistant sews on missing buttons each night.', zh: '服装助理每晚缝上脱落的纽扣。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈwɔː/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'prompt', phonetic: '/prɒmpt/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '提词（prompt corner 舞台提词位）', en: 'the corner where the prompter sits to feed lines' },
      usage: { zh: '舞台术语；prompt corner、prompt desk。', en: 'Stage term: prompt corner, prompt desk.' },
      collocations: ['the prompt corner', 'the prompt desk', 'a prompt book'],
      example: { en: 'The stage manager waits near the prompt corner.', zh: '舞台经理在提词位附近等候。' },
      listening: { zh: '单音节 /prɒmpt/，结尾 /mpt/ 辅音连缀。', en: 'One syllable /prɒmpt/ with a final /mpt/ cluster.' },
    },
  ],
  expressions: [
    {
      phrase: 'pass the stage', sentenceIndex: 2,
      meaning: { zh: '经过，穿过', en: 'to go through a space on a route' },
      usage: { zh: '及物短语动词；pass the stage、pass through the corridor。', en: 'Transitive: pass the stage, pass through the corridor.' },
      example: { en: 'We’ll pass the stage before the costume room.', zh: '我们会先经过舞台，再到服装间。' },
    },
    {
      phrase: 'off limits', sentenceIndex: 18,
      meaning: { zh: '禁止进入，不对外开放', en: 'not allowed to be touched or entered by visitors' },
      usage: { zh: '表语形容词；be off limits to visitors。', en: 'Predicative adjective: be off limits to visitors.' },
      example: { en: 'The lighting desk is off limits to the tour group.', zh: '灯光台对参观团不开放。' },
    },
    {
      phrase: 'between one scene and the next', sentenceIndex: 16,
      meaning: { zh: '换场之间', en: 'during the change from one scene to another' },
      usage: { zh: '时间状语；between scenes 是简说。', en: 'Adverbial of time; between scenes is the short form.' },
      example: { en: 'Scenery is lifted between one scene and the next.', zh: '布景在两场之间被升降。' },
    },
    {
      phrase: 'as long as', sentenceIndex: 20,
      meaning: { zh: '只要', en: 'on the condition that' },
      usage: { zh: '条件连词，后接从句；photos allowed as long as flash is off。', en: 'Conditional conjunction followed by a clause: photos allowed as long as flash is off.' },
      example: { en: 'Photographs are allowed as long as the flash is off.', zh: '只要关闭闪光灯就可以拍照。' },
    },
    {
      phrase: 'work out front', sentenceIndex: 31,
      meaning: { zh: '在观众区前台工作', en: 'to work in the auditorium side rather than backstage' },
      usage: { zh: '剧场用语；box office staff work out front。', en: 'Theatre phrase: box office staff work out front.' },
      example: { en: 'Box office staff work out front, near the entrance.', zh: '售票处人员在前台入口附近工作。' },
    },
    {
      phrase: 'appears in the right scene', sentenceIndex: 24,
      meaning: { zh: '出现在对应的场次', en: 'to be present in the scene where it belongs' },
      usage: { zh: '舞台道具核对用语；every prop appears in the right scene。', en: 'Stage prop check: every prop appears in the right scene.' },
      example: { en: 'The manager checks each prop appears in the right scene.', zh: '经理核对每件道具都在对应场次出现。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题先记分区词', en: 'For tables, catch the zone first' },
      body: {
        zh: '第 11–14 题按后台路线排列。听前把 stage floor、costume room、lighting control、emergency exit 标在表旁，听到分区名就锁定对应空格，不要等整段讲完再回头找。',
        en: 'Items 11 to 14 follow the backstage route. Mark the zone names beside the table before the recording; when you hear stage floor, costume room, lighting control or emergency exit, the matching gap is fixed. Do not wait for the whole section to end.',
      },
    },
    {
      title: { zh: '配对题先听岗位再听职责', en: 'For matching, catch the role first' },
      body: {
        zh: '第 18–20 题把岗位和职责配对。独白先报身份（stage manager、wardrobe assistant、lighting technician），再讲工作；听到身份词在题号旁做记号，再把短语对上选项字母。',
        en: 'Items 18 to 20 pair staff with duties. The guide names the role first, stage manager, wardrobe assistant or lighting technician, then the work. Mark the role beside the number, then match the phrase to a letter.',
      },
    },
    {
      title: { zh: '规则题抓禁止与允许', en: 'For rules, note forbiddens and permissions' },
      body: {
        zh: '第 16 题问后台禁令，答案在 do not walk across the stage 之后；allowed、off limits、as long as 这些词分别标出允许和限制。规则类题目把否定句和条件句分开记。',
        en: 'Item 16 asks the backstage ban, and the answer follows do not walk across the stage; allowed, off limits and as long as mark permissions and limits separately. In rule items, keep negatives and conditions apart.',
      },
    },
  ],
};
