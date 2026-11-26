import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 3 · Part 4 — 讲座：火山预警信号（单人，英式口音）。原创仿真材料，非官方真题。
 *
 * 结构：三类前兆信号（笔记 31–34）→ 预警等级、疏散决策与不确定性（单选 35–37）→ 各信号分别说明什么（配对 38–40）。
 * 题块顺序与录音一致；讲座含定义、机制、例子与数据性描述。
 */
export const test03Part4: ListeningLesson = {
  slug: 'test-03-part-4',
  part: 4,
  status: 'published',
  title: { zh: '火山：识别预警信号', en: 'Volcanoes: reading the warning signs' },
  summary: {
    zh: '一场关于火山喷发前兆的讲座：地震活动、地表形变与气体变化三类信号如何被监测，四级预警体系依据哪些证据，疏散决策与应急准备，以及每种信号分别说明岩浆处于什么位置。',
    en: 'A lecture on volcanic warning signs: how seismic activity, ground deformation and gas changes are monitored, what evidence the four alert levels combine, the evacuation decision and emergency preparation, and what each signal says about where the magma is.',
  },
  accent: { zh: '讲师为英式口音，术语会重复并举例说明。', en: 'The lecturer speaks with a British accent and repeats key terms with examples.' },
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-GB-RyanNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Most eruptions are preceded by increased seismic', cells: [[{ blank: 31 }]] },
        { lead: 'Ground movement as magma rises is measured by', cells: [[{ blank: 32 }]] },
        { lead: 'Warning levels combine gas, seismicity and', cells: [[{ blank: 33 }]] },
        { lead: 'Residents should keep an emergency', cells: [[{ blank: 34 }, { text: ' ready to carry.' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why can predictions still be uncertain?',
          options: [
            { key: 'A', text: 'The instruments record only gas levels.' },
            { key: 'B', text: 'Volcanoes differ and some signals stay hidden or masked.' },
            { key: 'C', text: 'Most eruptions begin without any prior signs.' },
          ],
        },
        {
          number: 36,
          stem: 'Why is evacuation a difficult decision for the authority?',
          options: [
            { key: 'A', text: 'There are no agreed shelters in most affected towns.' },
            { key: 'B', text: 'It affects people’s livelihoods and cannot easily be reversed.' },
            { key: 'C', text: 'Residents usually refuse to leave their homes.' },
          ],
        },
        {
          number: 37,
          stem: 'Apart from rising magma, what else may produce tremors?',
          options: [
            { key: 'A', text: 'A collapse inside the crater or rainwater seeping in.' },
            { key: 'B', text: 'Vibration from tourist traffic on the access road.' },
            { key: 'C', text: 'Cooling of the lava dome.' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What does each signal indicate? Choose the correct letter, A–H.',
      options: [
        { key: 'A', text: 'Magma moving upward and breaking the rock ahead.' },
        { key: 'B', text: 'Fresh magma rising close to the surface.' },
        { key: 'C', text: 'Magma collecting in a shallow underground chamber.' },
        { key: 'D', text: 'A collapse has occurred inside the crater.' },
        { key: 'E', text: 'Heavy rainfall has seeped into the rock.' },
        { key: 'F', text: 'The lava dome has cooled and solidified.' },
        { key: 'G', text: 'Vibration from traffic on the access road.' },
        { key: 'H', text: 'Steam released from a nearby hot spring.' },
      ],
      items: [
        { number: 38, text: 'a seismic swarm' },
        { number: 39, text: 'rising gas emissions' },
        { number: 40, text: 'measurable swelling of the slopes' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['activity'], evidence: 6,
      explanation: {
        zh: '定位句 6：An increase in seismic activity over several days is one of the clearest early signs。空前是 seismic，填名词 activity；句 3 的 seismic activity 是定义句，句 6 才是答案落点。',
        en: 'Sentence 6: "An increase in seismic activity over several days is one of the clearest early signs". Seismic already precedes the gap, so the noun activity is needed. Sentence 3 defines the term; sentence 6 is where the answer lands.',
      },
    },
    {
      number: 32, accepted: ['tiltmeters'], evidence: 9,
      explanation: {
        zh: '定位句 9：This movement is too slow to see, so it is measured by tiltmeters, which record the slope angle, and by GPS stations tracking small position shifts。GPS stations 是并列的另一套设备，不是答案；注意 tiltmeters 的拼写。',
        en: 'Sentence 9: "it is measured by tiltmeters, which record the slope angle". GPS stations are a separate parallel system, not the answer. Watch the spelling of tiltmeters.',
      },
    },
    {
      number: 33, accepted: ['ground deformation'], evidence: 16,
      explanation: {
        zh: '定位句 16：seismicity, gas measurements and ground deformation。三项证据并列，前两项已在题干印出，缺第三项；两个词，符合 TWO WORDS 限制。',
        en: 'Sentence 16: "seismicity, gas measurements and ground deformation". The three forms of evidence are listed together; the first two are printed in the question, so the missing one is ground deformation, two words.',
      },
    },
    {
      number: 34, accepted: ['kit'], evidence: 23,
      explanation: {
        zh: '定位句 23：Residents are advised to keep an emergency kit at home。空后是 ready to carry，填名词 kit；句 24 的 The kit 是回指，不是新信息。',
        en: 'Sentence 23: "Residents are advised to keep an emergency kit at home". The gap precedes ready to carry, so the noun kit fits. The kit in sentence 24 refers back to it.',
      },
    },
    {
      number: 35, accepted: ['B'], evidence: 33,
      explanation: {
        zh: '定位句 33：Some signals remain hidden because the instruments are too few, and others are masked by the shape of the rock。hidden 与 masked 对应 B；A 错在仪器不只测气体，C 与句 2 的 preparation traces 相反。',
        en: 'Sentence 33: "Some signals remain hidden because the instruments are too few, and others are masked by the shape of the rock". Hidden and masked match B. A is wrong because instruments record more than gas, and C contradicts the preparation traces in sentence 2.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 25,
      explanation: {
        zh: '定位句 25：it affects livelihoods, businesses and schools, and it cannot be reversed once people have left their homes。livelihoods 对应 B，irreversible 对应 cannot easily be reversed。',
        en: 'Sentence 25: "it affects livelihoods, businesses and schools, and it cannot be reversed once people have left their homes". Livelihoods match B, and irreversible matches cannot easily be reversed.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 30,
      explanation: {
        zh: '定位句 30：A slow collapse inside the crater can weaken the rock and shake the slopes, and heavy rainfall can seep into the stone and add pressure to the chamber。collapse 与 rainwater seeping in 对应 A。交通振动 G 和穹丘冷却 F 在讲座中没有出现。',
        en: 'Sentence 30: "A slow collapse inside the crater can weaken the rock and shake the slopes, and heavy rainfall can seep into the stone and add pressure to the chamber.". Collapse and rainwater seeping in match A. Traffic vibration in G and dome cooling in F are never mentioned.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 37,
      explanation: {
        zh: '定位句 37：they usually mean that magma is moving upward and breaking the rock ahead of it。moving upward and breaking rock 与 A 逐词对应；D（坑内塌陷）是句 30 的干扰成因。',
        en: 'Sentence 37: "they usually mean that magma is moving upward and breaking the rock ahead of it". Moving upward and breaking rock match A word for word. The crater collapse in D is the distractor from sentence 30.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 39,
      explanation: {
        zh: '定位句 39：fresh magma has risen close to the surface。气体比例变化说明新岩浆接近地表，对应 B。H（温泉蒸汽）不是火山气体信号。',
        en: 'Sentence 39: "fresh magma has risen close to the surface". The changed gas ratio indicates fresh magma near the surface, matching B. Hot-spring steam in H is not a volcanic gas signal.',
      },
    },
    {
      number: 40, accepted: ['C'], evidence: 41,
      explanation: {
        zh: '定位句 41：magma collecting in a shallow chamber beneath the volcano。slopes swelling 对应 C；F（穹丘冷却）与地表隆起方向相反。',
        en: 'Sentence 41: "magma collecting in a shallow chamber beneath the volcano". Swelling slopes match C. Dome cooling in F works in the opposite direction to ground swelling.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Three years ago, a town sat below a volcano that showed no clear sign of trouble, until the ground began to tilt by a few centimetres in a single week.' },
    { speaker: 'lecturer', text: 'Most people picture a volcano as a single dramatic explosion, but in reality eruptions rarely happen without a period of preparation.' },
    { speaker: 'lecturer', text: 'That preparation can last for days, months, or even years, and it leaves traces that trained observers can detect.' },
    { speaker: 'lecturer', text: 'The first and most widely used signal is seismic activity.' },
    { speaker: 'lecturer', text: 'As magma forces its way upward through the rock, it cracks the surrounding stone, and each crack produces a small earthquake.' },
    { speaker: 'lecturer', text: 'These tremors are usually too weak to feel, but sensitive instruments record them around the clock.' },
    { speaker: 'lecturer', text: 'An increase in seismic activity over several days is one of the clearest early signs that something is changing beneath the volcano.' },
    { speaker: 'lecturer', text: 'The second signal is deformation of the ground itself.' },
    { speaker: 'lecturer', text: 'When magma rises into the upper part of the volcano, the slopes may swell or tilt, like skin over a rising blister.' },
    { speaker: 'lecturer', text: 'This movement is too slow to see, so it is measured by tiltmeters, which record the slope angle, and by GPS stations tracking small position shifts.' },
    { speaker: 'lecturer', text: 'A third signal comes from the gases released at the crater.' },
    { speaker: 'lecturer', text: 'Volcanoes continuously emit steam, carbon dioxide and sulphur compounds, and changes in their mix or volume often show that fresh magma is approaching the surface.' },
    { speaker: 'lecturer', text: 'Before we go further, it is worth saying that no single signal is enough on its own.' },
    { speaker: 'lecturer', text: 'A swarm of earthquakes can also follow a heavy rainstorm, and gas levels can shift for harmless reasons.' },
    { speaker: 'lecturer', text: 'Scientists therefore look at several signals together, and compare what they see with the behaviour of the same volcano in quieter periods.' },
    { speaker: 'lecturer', text: 'Once the monitoring data are collected, they feed into a warning system with four levels.' },
    { speaker: 'lecturer', text: 'The levels combine three kinds of evidence, which are seismicity, gas measurements and ground deformation.' },
    { speaker: 'lecturer', text: 'Level one means that the volcano is restless but no eruption is expected soon.' },
    { speaker: 'lecturer', text: 'Level two means that unrest is ongoing, and officials prepare local communities for possible action.' },
    { speaker: 'lecturer', text: 'Level three is raised when signs suggest an eruption may begin within days, and Level four, the highest, means that an eruption is underway or expected imminently.' },
    { speaker: 'lecturer', text: 'It is important to understand what these levels do and do not mean.' },
    { speaker: 'lecturer', text: 'A warning level is not a precise prediction of the exact hour or size of an eruption.' },
    { speaker: 'lecturer', text: 'When the warning rises to level three or four, the local authority turns to evacuation planning.' },
    { speaker: 'lecturer', text: 'Residents are advised to keep an emergency kit at home, with water, food, a torch, a radio and copies of important documents.' },
    { speaker: 'lecturer', text: 'The kit should be ready to carry at short notice, because the order to leave may arrive with little warning.' },
    { speaker: 'lecturer', text: 'Evacuating a town is a major decision, because it affects livelihoods, businesses and schools, and it cannot be reversed once people have left their homes.' },
    { speaker: 'lecturer', text: 'The authority therefore works with the community well before any crisis, so that routes, shelters and transport are already agreed.' },
    { speaker: 'lecturer', text: 'Schools run drills in which children practise the route to the shelter, and families mark a meeting point in case they are separated.' },
    { speaker: 'lecturer', text: 'After an evacuation, officials do not allow residents to return until the danger has passed, even if the sky above the town looks calm.' },
    { speaker: 'lecturer', text: 'Apart from rising magma, other events can produce tremors inside the volcano.' },
    { speaker: 'lecturer', text: 'A slow collapse inside the crater can weaken the rock and shake the slopes, and heavy rainfall can seep into the stone and add pressure to the chamber.' },
    { speaker: 'lecturer', text: 'These cases remind us that a single set of tremors does not always point to an eruption.' },
    { speaker: 'lecturer', text: 'Volcanoes are complicated systems, and two mountains can show very similar signs yet behave in completely different ways.' },
    { speaker: 'lecturer', text: 'Some signals remain hidden because the instruments are too few, and others are masked by the shape of the rock beneath the surface.' },
    { speaker: 'lecturer', text: 'For these reasons, even experienced volcanologists speak in probabilities rather than certainties, and the science remains partly descriptive, because each volcano has its own structure and its own history.' },
    { speaker: 'lecturer', text: 'Now let us look more closely at what each kind of signal actually indicates.' },
    { speaker: 'lecturer', text: 'The first is a sequence of small earthquakes, often called a seismic swarm.' },
    { speaker: 'lecturer', text: 'When these quakes grow in number and in depth over time, they usually mean that magma is moving upward and breaking the rock ahead of it.' },
    { speaker: 'lecturer', text: 'The second is the release of gas from the crater.' },
    { speaker: 'lecturer', text: 'A sudden rise in sulphur gases, together with a change in the ratio of carbon dioxide to steam, suggests that fresh magma has risen close to the surface.' },
    { speaker: 'lecturer', text: 'The third is the swelling of the ground on the slopes.' },
    { speaker: 'lecturer', text: 'A measurable tilt or outward shift over weeks is consistent with magma collecting in a shallow chamber beneath the volcano.' },
    { speaker: 'lecturer', text: 'Not every signal points upward, and monitoring continues around the clock even when the volcano appears quiet.' },
    { speaker: 'lecturer', text: 'In the last part of this lecture, I want to turn to how the public receives these warnings.' },
    { speaker: 'lecturer', text: 'A high alert level can create fear, and some people ignore the order to leave because they have stayed through previous scares without harm.' },
    { speaker: 'lecturer', text: 'Others return home too early, drawn back by worry about their property.' },
    { speaker: 'lecturer', text: 'Communication therefore has to be clear, repeated and consistent, so that residents understand the difference between advice and a mandatory order.' },
    { speaker: 'lecturer', text: 'The best we can do is to watch carefully, to share what we find honestly, and to plan communities that can move quickly when the signs turn serious.' },
    { speaker: 'lecturer', text: 'Next week we will look at two case studies, one where the warning worked well and one where it did not.' },
    { speaker: 'lecturer', text: 'We will stop there. The examples should make the process easier to picture.' },
  ],
  vocabulary: [
    {
      term: 'magma', phonetic: '/ˈmæɡmə/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '岩浆（地下熔融岩石，喷出后称 lava）', en: 'molten rock below the surface; once erupted it is called lava' },
      usage: { zh: '不可数；geology 讲座核心词。magma rises、magma chamber。', en: 'Uncountable; a geology key term: magma rises, magma chamber.' },
      collocations: ['magma rises', 'a magma chamber', 'fresh magma'],
      example: { en: 'The magma heats the surrounding rock as it moves upward.', zh: '岩浆上涌时加热周围岩石。' },
      listening: { zh: '两个音节，重音在第一音节，结尾 /mə/ 轻读。', en: 'Two syllables with stress on the first and a light final /mə/.' },
    },
    {
      term: 'activity', phonetic: '/ækˈtɪvəti/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '活动（seismic activity 指地震活动）', en: 'movement or events in a particular field; seismic activity means earthquake tremors' },
      usage: { zh: '不可数；seismic activity、volcanic activity。', en: 'Uncountable: seismic activity, volcanic activity.' },
      collocations: ['seismic activity', 'volcanic activity', 'increased activity'],
      example: { en: 'Seismic activity rose sharply in the second week.', zh: '第二周地震活动明显增强。' },
      listening: { zh: '四个音节，重音在第二音节 /ˈtɪv/。', en: 'Four syllables with stress on the second.' },
    },
    {
      term: 'tiltmeters', phonetic: '/ˈtɪltmiːtəz/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '倾斜仪（测量坡面角度变化的仪器）', en: 'instruments that record small changes in the angle of a slope' },
      usage: { zh: '可数名词，复数；由 tilt（倾斜）加 meter 构成。单数 tiltmeter。', en: 'Countable plural; built from tilt plus meter. The singular is tiltmeter.' },
      collocations: ['measure by tiltmeters', 'tiltmeters and GPS stations'],
      example: { en: 'Tiltmeters detect even a slight change in the slope.', zh: '倾斜仪能测出坡面哪怕很小的变化。' },
      listening: { zh: '复合词，meter 部分读 /miːtə/，注意复数 /z/。', en: 'Compound with meter pronounced /miːtə/ and a plural /z/.' },
    },
    {
      term: 'deformation', phonetic: '/ˌdiːfɔːˈmeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '形变，变形（地表的隆起或倾斜）', en: 'a change in the shape or position of the ground' },
      usage: { zh: '不可数；ground deformation、rock deformation。动词 deform。', en: 'Uncountable: ground deformation, rock deformation. The verb is deform.' },
      collocations: ['ground deformation', 'measure deformation', 'deformation of the slopes'],
      example: { en: 'Ground deformation can be detected before the eruption.', zh: '喷发前可以测到地表形变。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈmeɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'sulphur', phonetic: '/ˈsʌlfə/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '硫，硫磺（火山气体成分之一）', en: 'a chemical element present in volcanic gases, American spelling sulfur' },
      usage: { zh: '英式 sulphur，美式 sulfur；sulphur compounds、sulphur gases。', en: 'British sulphur, American sulfur: sulphur compounds, sulphur gases.' },
      collocations: ['sulphur compounds', 'sulphur gases', 'sulphur smell'],
      example: { en: 'The air near the crater smelled of sulphur.', zh: '火山口附近的空气有硫磺味。' },
      listening: { zh: '两个音节，重音在第一音节，/f/ 清辅音。', en: 'Two syllables, stressed on the first, with a voiceless /f/.' },
    },
    {
      term: 'evacuation', phonetic: '/ɪˌvækjuˈeɪʃn/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '疏散，撤离', en: 'the movement of people away from a dangerous area to safety' },
      usage: { zh: '可数或不可数；evacuation planning、order of evacuation。动词 evacuate。', en: 'Countable or uncountable: evacuation planning. The verb is evacuate.' },
      collocations: ['evacuation planning', 'order an evacuation', 'evacuation route'],
      example: { en: 'The evacuation route was agreed with the local authority.', zh: '疏散路线已与地方当局商定。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈeɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'chamber', phonetic: '/ˈtʃeɪmbə/', partOfSpeech: 'n.', sentenceIndex: 30,
      meaning: { zh: '岩浆房（地下储存岩浆的空腔）', en: 'an underground cavity where magma collects before an eruption' },
      usage: { zh: 'geology 语境；magma chamber。另有“房间、会议厅”之义。', en: 'Geology sense: magma chamber. It also means a room or assembly hall.' },
      collocations: ['magma chamber', 'shallow chamber', 'beneath the chamber'],
      example: { en: 'The pressure in the chamber builds over weeks.', zh: '岩浆房里的压力在数周内累积。' },
      listening: { zh: '两个音节，重音在第一音节，mber 读 /mbə/。', en: 'Two syllables, stressed on the first; mber is /mbə/.' },
    },
    {
      term: 'volcanologists', phonetic: '/ˌvɒlkəˈnɒlədʒɪsts/', partOfSpeech: 'n.', sentenceIndex: 34,
      meaning: { zh: '火山学家（volcanologist 的复数）', en: 'scientists who study volcanoes and their behaviour' },
      usage: { zh: '可数名词；学科名 volcanology。', en: 'Countable; the field is volcanology.' },
      collocations: ['experienced volcanologists', 'volcanologists predict'],
      example: { en: 'Volcanologists compare readings from several monitoring stations.', zh: '火山学家比对多个监测站的读数。' },
      listening: { zh: '重音在第三音节 /ˈnɒl/，词长不要漏音节。', en: 'Stress the third syllable; do not drop any beat in this long word.' },
    },
  ],
  expressions: [
    {
      phrase: 'leaves traces', sentenceIndex: 2,
      meaning: { zh: '留下痕迹', en: 'to produce signs that can be detected later' },
      usage: { zh: 'leave traces of something；traces 也可指“微量”。', en: 'leave traces of something; traces can also mean small amounts.' },
      example: { en: 'The eruption left traces of ash across the valley.', zh: '喷发在山谷各处留下了火山灰痕迹。' },
    },
    {
      phrase: 'around the clock', sentenceIndex: 5,
      meaning: { zh: '日夜不停地，全天候', en: 'continuously, day and night' },
      usage: { zh: '状语短语；work around the clock、monitor around the clock。', en: 'Adverbial: work around the clock, monitor around the clock.' },
      example: { en: 'Instruments record tremors around the clock.', zh: '仪器全天候记录地震活动。' },
    },
    {
      phrase: 'on its own', sentenceIndex: 12,
      meaning: { zh: '单独地，单凭自身', en: 'alone, without other signals to support it' },
      usage: { zh: 'no single signal is enough on its own；one’s own 随主语变化。', en: 'No single signal is enough on its own; own changes with the subject.' },
      example: { en: 'One reading cannot confirm the trend on its own.', zh: '单次读数不能单独确认趋势。' },
    },
    {
      phrase: 'at short notice', sentenceIndex: 24,
      meaning: { zh: '随时，在很短的准备时间内', en: 'with little warning or preparation time' },
      usage: { zh: '状语短语；ready at short notice、leave at short notice。', en: 'Adverbial: ready at short notice, leave at short notice.' },
      example: { en: 'The shelter must be ready to open at short notice.', zh: '避难所必须能随时启用。' },
    },
    {
      phrase: 'point to', sentenceIndex: 31,
      meaning: { zh: '表明，指向（某个结论）', en: 'to suggest that a particular explanation is likely' },
      usage: { zh: '及物；the signals point to an eruption。', en: 'Transitive: the signals point to an eruption.' },
      example: { en: 'The gas readings point to fresh magma below.', zh: '气体读数表明下方有新岩浆。' },
    },
    {
      phrase: 'feed into', sentenceIndex: 15,
      meaning: { zh: '汇入，输入到（系统）', en: 'to be collected and passed into a larger system' },
      usage: { zh: '被动 be fed into；monitoring data feed into the warning system。', en: 'Passive be fed into: monitoring data feed into the warning system.' },
      example: { en: 'The sensor readings feed into one central dashboard.', zh: '传感器读数汇入同一个中央面板。' },
    },
    {
      phrase: 'turn serious', sentenceIndex: 47,
      meaning: { zh: '变得严重', en: 'to become dangerous or urgent' },
      usage: { zh: 'turn 加形容词表示变化；turn serious、turn sour。', en: 'Turn plus adjective shows a change: turn serious, turn sour.' },
      example: { en: 'Communities must be ready to act before the signs turn serious.', zh: '社区必须在事态严重前做好行动准备。' },
    },
  ],
  tips: [
    {
      title: { zh: '预测词性再听答案', en: 'Predict the part of speech' },
      body: {
        zh: '第 31 题空在 seismic 之后，填名词 activity；第 32 题空前是 measured by，填仪器名 tiltmeters；第 34 题空在 emergency 之后，填名词 kit。听之前把词性写在空格旁。',
        en: 'Item 31 follows seismic, so a noun activity is needed. Item 32 follows measured by, so the instrument tiltmeters fits. Item 34 follows emergency, so the noun kit fits. Note the predicted part of speech beside each gap.',
      },
    },
    {
      title: { zh: '配对题把信号和机理对上', en: 'Match signals to mechanisms' },
      body: {
        zh: '配对题三个信号分别对应岩浆的三个位置：上涌破裂、接近地表、停在浅部腔室。听时抓住 moving upward、close to the surface、shallow chamber 三个短语，再去对选项。',
        en: 'The three signals correspond to three magma positions: rising and breaking rock, near the surface, and in a shallow chamber. Catch moving upward, close to the surface and shallow chamber before matching the options.',
      },
    },
    {
      title: { zh: '讲座结构信号词定位题块', en: 'Use lecture signposts' },
      body: {
        zh: 'The first signal、The second、A third 对应笔记三行；Now let us look more closely 进入配对段；Apart from rising magma 引出干扰成因。听到这类信号词就检查自己是否填到了对应题块。',
        en: 'The first signal, The second and A third map to the note rows; Now let us look more closely opens the matching section; Apart from rising magma introduces the distractor causes. Check your place in the question blocks whenever you hear one.',
      },
    },
  ],
};
