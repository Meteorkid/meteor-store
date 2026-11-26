import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 32 · Part 2 — 古宅花园导览（单人独白）。原创仿真材料，非官方真题。
 *
 * 导览顺序：园林风格 → 珍稀树木 → 石墙修复 → 主花期 → 摄影规则（笔记 11–16），
 * 后半段谈修复台阶、秋花、合影规则与花园商店（单选 17–20）。题块顺序与录音一致。
 */
export const test32Part2: ListeningLesson = {
  slug: 'test-32-part-2',
  part: 2,
  status: 'published',
  title: { zh: '古宅花园导览', en: 'A garden tour at a historic house' },
  summary: {
    zh: '花园女向导沿主路讲解：下段是规则式意大利园林，溪畔一棵古老黎巴嫩雪松是县内最老的标本之一；南界石墙去年完成修复，主花期在六月，允许手持相机但窄径上禁用三脚架。随后介绍观景木台阶的翻修、九月十月的秋花、开放草坪上的合影规则，以及出口花园商店售卖的本地种子、笔记本与宅邸版画。',
    en: 'A female guide tours the historic garden: a formal Italian section, an old cedar of Lebanon, a restored boundary wall, June peak flowering, handheld cameras allowed but tripods banned on narrow paths. Later: repaired viewpoint steps, autumn dahlias and daisies, group photos on the lawn, and the shop’s seeds, notebooks and prints.',
  },
  accent: { zh: '向导为南非口音英语。', en: 'The guide speaks with a South African English accent.' },
  speechRate: '+8%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-ZA-LeahNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      wordLimit: 'ONE WORD AND/OR A NUMBER',
      rows: [
        { lead: 'Tour gathers by the front', cells: [[{ blank: 11 }]] },
        { lead: 'Garden style in the lower section:', cells: [[{ blank: 12 }]] },
        { lead: 'Rare old tree near the stream:', cells: [[{ blank: 13 }]] },
        { lead: 'Restored last year: southern boundary', cells: [[{ blank: 14 }]] },
        { lead: 'Main flower display reaches its best in', cells: [[{ blank: 15 }]] },
        { lead: 'Photo rule: no', cells: [[{ blank: 16 }, { text: ' on the narrow paths' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 17,
          stem: 'What photography rule applies to large groups?',
          options: [
            { key: 'A', text: 'large groups must book a separate slot before touring' },
            { key: 'B', text: 'group photographs are allowed on the open lawn, without entering the beds' },
            { key: 'C', text: 'cameras are banned anywhere inside the walled garden' },
          ],
        },
        {
          number: 18,
          stem: 'What restoration work was finished last year?',
          options: [
            { key: 'A', text: 'rebuilding the leaning boundary wall' },
            { key: 'B', text: 'repairing and repainting the wooden viewpoint steps' },
            { key: 'C', text: 'cleaning the stone bridge over the stream' },
          ],
        },
        {
          number: 19,
          stem: 'Which plants flower in autumn?',
          options: [
            { key: 'A', text: 'dahlias and Michaelmas daisies' },
            { key: 'B', text: 'peonies and tall delphiniums' },
            { key: 'C', text: 'spring bulbs in the wild garden' },
          ],
        },
        {
          number: 20,
          stem: 'What does the garden shop sell?',
          options: [
            { key: 'A', text: 'seed packets, notebooks and house prints' },
            { key: 'B', text: 'plants dug from the garden beds' },
            { key: 'C', text: 'tea cakes baked in the courtyard' },
          ],
        },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['fountain'], evidence: 0,
      explanation: {
        zh: '定位句 0：gather on the path by the front fountain, I’ll start the garden tour in a moment。集合点在前喷泉旁，填 fountain。',
        en: 'Sentence 0: "gather on the path by the front fountain, I’ll start the garden tour in a moment". The tour gathers by the front fountain, so write fountain.',
      },
    },
    {
      number: 12, accepted: ['Italian'], evidence: 3,
      explanation: {
        zh: '定位句 3：This section is an Italian garden, with formal flower beds cut into straight shapes。下段园林是意大利式，填 Italian；句 4 的 rose terraces 是后来加的露台，不是整体风格。',
        en: 'Sentence 3: "This section is an Italian garden, with formal flower beds cut into straight shapes". The lower garden is Italian, so write Italian. The rose terraces in sentence 4 are a later addition, not the overall style.',
      },
    },
    {
      number: 13, accepted: ['cedar'], evidence: 6,
      explanation: {
        zh: '定位句 6：That is a cedar of Lebanon, one of the oldest specimens in the county。溪畔珍稀老树是雪松 cedar；句 8 的 conifers 是泛指其他针叶树，不是这棵树的名称。',
        en: 'Sentence 6: "That is a cedar of Lebanon, one of the oldest specimens in the county". The rare old tree is the cedar. Conifers in sentence 8 are other evergreens, not this tree’s name.',
      },
    },
    {
      number: 14, accepted: ['wall'], evidence: 9,
      explanation: {
        zh: '定位句 9：Last year the estate completed a restoration of the old stone wall that runs along the southern boundary。南界修复的是石墙，填 wall；句 10 的 coping stones 是墙顶石块，不是修复对象整体。',
        en: 'Sentence 9: "Last year the estate completed a restoration of the old stone wall that runs along the southern boundary". The restored boundary is the stone wall, so write wall. Coping stones in sentence 10 are wall-top pieces, not the whole object.',
      },
    },
    {
      number: 15, accepted: ['June'], evidence: 12,
      explanation: {
        zh: '定位句 12：The main flower display reaches its best in June, when the peonies and the tall delphiniums are at their height。主花期在六月，填 June；句 13 的 April 是野花园春季球根的最佳时段。',
        en: 'Sentence 12: "The main flower display reaches its best in June, when the peonies and the tall delphiniums are at their height". The peak display is June. April in sentence 13 is the wild garden’s spring bulb season.',
      },
    },
    {
      number: 16, accepted: ['tripod'], evidence: 15,
      explanation: {
        zh: '定位句 15：Please do not set up a tripod on the paths, because they are narrow and other guests need to pass through。窄径禁用三脚架，填 tripod；句 14 的 handheld cameras 是允许的拍摄方式。',
        en: 'Sentence 15: "Please do not set up a tripod on the paths, because they are narrow and other guests need to pass through". Tripods are banned on paths, so write tripod. Handheld cameras in sentence 14 are the allowed method.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 16,
      explanation: {
        zh: '定位句 16：Group photographs are fine in the open lawn, but no one should climb on the flower beds or touch the planting for a posed shot。开放草坪可合影、不得踏入花床对应 B；A 的另约时段与 C 的花园区禁拍在讲解中未出现。',
        en: 'Sentence 16: "Group photographs are fine in the open lawn, but no one should climb on the flower beds or touch the planting for a posed shot". Lawn photos without entering beds match B. A separate booking slot and a walled-garden camera ban are not mentioned.',
      },
    },
    {
      number: 18, accepted: ['B'], evidence: 19,
      explanation: {
        zh: '定位句 19：the wooden steps up to the viewpoint, which were repaired and repainted before the season opened。去年翻修的是观景木台阶，对应 B。A 的石墙修复在句 9 是更早一项，C 的石桥清洗属于维护工程（句 33）。',
        en: 'Sentence 19: "the wooden steps up to the viewpoint, which were repaired and repainted before the season opened". The viewpoint steps match B. The wall in A is the earlier restoration in sentence 9, and the bridge cleaning in C is maintenance in sentence 33.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 21,
      explanation: {
        zh: '定位句 21：with dahlias and Michaelmas daisies carrying the colour through September and October。大丽花与紫菀开在秋季，对应 A。B 的牡丹飞燕草是初夏花，C 的春球根在野花园。',
        en: 'Sentence 21: "with dahlias and Michaelmas daisies carrying the colour through September and October". Dahlias and daisies match A. Peonies and delphiniums are early summer, and spring bulbs are in the wild garden.',
      },
    },
    {
      number: 20, accepted: ['A'], evidence: 25,
      explanation: {
        zh: '定位句 25：The garden shop by the exit sells packets of the seeds grown here, together with small notebooks and prints of the house。商店卖本地种子、笔记本与宅邸版画，对应 A；B 的挖自花床的植株句 26 明确不卖，C 的茶点在庭院而非商店。',
        en: 'Sentence 25: "The garden shop by the exit sells packets of the seeds grown here, together with small notebooks and prints of the house". Seeds, notebooks and prints match A. Plants dug from beds are not sold in sentence 26, and tea cakes are served in the courtyard.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'If you’d like to gather on the path by the front fountain, I’ll start the garden tour in a moment.' },
    { speaker: 'guide', text: 'I’m Leah, your guide for the next hour, and we will follow the main path around the lower lawn before climbing to the walled garden.' },
    { speaker: 'guide', text: 'The house itself dates from the late seventeenth century, but the gardens were laid out in the style you see today about two hundred years ago.' },
    { speaker: 'guide', text: 'This section is an Italian garden, with formal flower beds cut into straight shapes and paths kept in neat lines.' },
    { speaker: 'guide', text: 'The rose terraces beyond the hedge were added later, when the family wanted a place to sit in the evening sun.' },
    { speaker: 'guide', text: 'Before we move on, look to your left at the large tree near the stream.' },
    { speaker: 'guide', text: 'That is a cedar of Lebanon, one of the oldest specimens in the county, planted when the house was first extended.' },
    { speaker: 'guide', text: 'Its broad branches spread over the grass, and you can sit underneath it on the old stone bench.' },
    { speaker: 'guide', text: 'The garden holds several rare conifers brought back by the owner’s travels abroad, but the cedar is the one visitors ask about most.' },
    { speaker: 'guide', text: 'Last year the estate completed a restoration of the old stone wall that runs along the southern boundary.' },
    { speaker: 'guide', text: 'The wall had leaned after heavy rain, so stonemasons rebuilt the lower section and replaced several loose coping stones.' },
    { speaker: 'guide', text: 'Inside the walled garden, the beds are filled with herbs and old-fashioned vegetables, kept going by the gardeners throughout the growing season.' },
    { speaker: 'guide', text: 'The main flower display reaches its best in June, when the peonies and the tall delphiniums are at their height along the rose terrace.' },
    { speaker: 'guide', text: 'The wild garden at the far side fills with spring bulbs, so that section looks its best around April rather than summer.' },
    { speaker: 'guide', text: 'A short note for photographers. The garden allows handheld cameras, and visitors may take pictures for their own use.' },
    { speaker: 'guide', text: 'Please do not set up a tripod on the paths, because they are narrow and other guests need to pass through.' },
    { speaker: 'guide', text: 'Group photographs are fine in the open lawn, but no one should climb on the flower beds or touch the planting for a posed shot.' },
    { speaker: 'guide', text: 'The old glasshouses at the back are open to view, but their shelves and tropical pots are out of bounds to the public.' },
    { speaker: 'guide', text: 'Now a few points that came up on earlier tours.' },
    { speaker: 'guide', text: 'The restoration work last year also touched the wooden steps up to the viewpoint, which were repaired and repainted before the season opened.' },
    { speaker: 'guide', text: 'The peony beds, which flower in early summer, need two years to settle after being divided, so they are not moved around each year.' },
    { speaker: 'guide', text: 'Some borders are planned for autumn instead, with dahlias and Michaelmas daisies carrying the colour through September and October.' },
    { speaker: 'guide', text: 'The autumn border survives the first frosts better than the rose beds, and it is often the last colour left in the garden.' },
    { speaker: 'guide', text: 'For photos of the house, the clearest view is from the bridge over the stream, where the front wall sits behind the lawn.' },
    { speaker: 'guide', text: 'Large groups should stay together on the main path, and the guide will stop at each planting area for questions.' },
    { speaker: 'guide', text: 'The garden shop by the exit sells packets of the seeds grown here, together with small notebooks and prints of the house.' },
    { speaker: 'guide', text: 'It does not sell plants dug from the garden, because the nursery stock is raised separately for sale.' },
    { speaker: 'guide', text: 'Tea and light cakes are served in the courtyard between twelve and three, and the tables are shaded by the old grape vine.' },
    { speaker: 'guide', text: 'Dogs are welcome only on the short perimeter walk, and they must be kept on a lead near the flower beds.' },
    { speaker: 'guide', text: 'The garden closes at half past five in the summer, and the last entry is an hour before that.' },
    { speaker: 'guide', text: 'If it rains heavily, the indoor display of garden plans is open in the coach house, just across from the entrance.' },
    { speaker: 'guide', text: 'Volunteers who help in the garden wear plain working clothes, and visitors should stay on the marked paths.' },
    { speaker: 'guide', text: 'The bird feeders near the wood corner attract finches and tits through the winter months.' },
    { speaker: 'guide', text: 'A small stream runs through the lower lawn, and the stone bridge was cleaned during last year’s maintenance works.' },
    { speaker: 'guide', text: 'The planting plan keeps one colour family in each bed, so the yellow border and the blue border do not mix along the same path.' },
    { speaker: 'guide', text: 'Benches are placed every few hundred yards, so visitors can rest without leaving the main route.' },
    { speaker: 'guide', text: 'The estate archive keeps old garden maps, which show how the formal beds have changed since Victorian times.' },
    { speaker: 'guide', text: 'Before we set off, take the leaflet from the holder by the door, and mark the trees you would like to see again.' },
    { speaker: 'guide', text: 'We will pause at the cedar, the walled garden and the autumn border before returning to the shop.' },
  ],
  vocabulary: [
    {
      term: 'Italian', phonetic: '/ɪˈtæliən/', partOfSpeech: 'adj.', sentenceIndex: 3,
      meaning: { zh: '意大利式（规则对称的园林风格）', en: 'formal and symmetrical, in the style of Italian gardens' },
      usage: { zh: 'Italian garden、Italian terrace。首字母大写。', en: 'Italian garden, Italian terrace. The adjective starts with a capital letter.' },
      collocations: ['an Italian garden', 'Italian formal beds', 'the Italian style'],
      example: { en: 'This section is an Italian garden with straight flower beds.', zh: '下段是规则式意大利园林。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈtæ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'cedar', phonetic: '/ˈsiːdə/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '雪松（常绿针叶大树）', en: 'a large evergreen conifer with spreading branches' },
      usage: { zh: '可数；cedar of Lebanon、rare cedar。', en: 'Countable: cedar of Lebanon, rare cedar.' },
      collocations: ['a cedar of Lebanon', 'the old cedar', 'rare cedars'],
      example: { en: 'The cedar near the stream is one of the oldest in the county.', zh: '溪畔雪松是县内最老树之一。' },
      listening: { zh: '两个音节，重音在第一音节，长元音 /iː/。', en: 'Two syllables, stressed on the first, long /iː/.' },
    },
    {
      term: 'restoration', phonetic: '/ˌrestəˈreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '修复（古迹园林的修缮）', en: 'the work of repairing an old wall, step or building' },
      usage: { zh: '可数或不可数；restoration of the wall、complete a restoration。动词 restore。', en: 'Countable or uncountable: restoration of the wall, complete a restoration. The verb is restore.' },
      collocations: ['a restoration of the wall', 'complete the restoration', 'last year’s restoration'],
      example: { en: 'The estate completed a restoration of the old stone wall.', zh: '庄园完成了旧石墙的修复。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈreɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'borders', phonetic: '/ˈbɔːdəz/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '花境（沿路种植的长条花丛，复数）', en: 'long strips of planting along paths or lawns' },
      usage: { zh: '可数复数；autumn borders、rose borders。单数 border。', en: 'Plural countable: autumn borders, rose borders. Singular border.' },
      collocations: ['the autumn borders', 'the rose borders', 'planting borders'],
      example: { en: 'Some borders are planned for autumn instead.', zh: '有些花境安排在秋季开花。' },
      listening: { zh: '两个音节，重音在第一音节，复数结尾 /z/。', en: 'Two syllables, stressed on the first, plural ending /z/.' },
    },
    {
      term: 'tripod', phonetic: '/ˈtraɪpɒd/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '三脚架（相机支架）', en: 'the three-legged stand used to steady a camera' },
      usage: { zh: '可数；set up a tripod、no tripod。', en: 'Countable: set up a tripod, no tripod.' },
      collocations: ['set up a tripod', 'a camera tripod', 'no tripod on the paths'],
      example: { en: 'Do not set up a tripod on the narrow garden paths.', zh: '窄园径上不要架三脚架。' },
      listening: { zh: '两个音节，重音在第一音节，/traɪ/ 长音。', en: 'Two syllables, stressed on the first, long /traɪ/.' },
    },
    {
      term: 'specimens', phonetic: '/ˈspesɪmənz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '标本树（园中代表性珍稀植株，复数）', en: 'individual notable plants kept as reference examples' },
      usage: { zh: '可数复数；old specimens、rare specimens。单数 specimen。', en: 'Plural countable: old specimens, rare specimens. Singular specimen.' },
      collocations: ['the oldest specimens', 'rare specimens', 'specimen trees'],
      example: { en: 'The cedar is one of the oldest specimens in the county.', zh: '这棵雪松是县内最老的标本树之一。' },
      listening: { zh: '三个音节，重音在第一音节，复数结尾 /z/。', en: 'Three syllables, stressed on the first, plural ending /z/.' },
    },
    {
      term: 'glasshouses', phonetic: '/ˈɡlɑːshaʊzɪz/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '玻璃温室（种植热带植物的棚室，复数）', en: 'glass buildings used to grow tender plants' },
      usage: { zh: '可数复数；old glasshouses、tropical glasshouses。单数 glasshouse。', en: 'Plural countable: old glasshouses, tropical glasshouses. Singular glasshouse.' },
      collocations: ['the old glasshouses', 'inside the glasshouses', 'glasshouse shelves'],
      example: { en: 'The old glasshouses are open to view, but their shelves are out of bounds.', zh: '旧温室可参观，但货架区不对外开放。' },
      listening: { zh: '复合词 glass 加 house，复数 house 结尾 /zɪz/。', en: 'Compound glass plus house; plural house ends /zɪz/.' },
    },
  ],
  expressions: [
    {
      phrase: 'laid out', sentenceIndex: 2,
      meaning: { zh: '规划布置（园林格局）', en: 'designed and arranged as a planned garden' },
      usage: { zh: 'lay out 的被动；the gardens were laid out、laid out in a style。', en: 'Passive of lay out: the gardens were laid out, laid out in a style.' },
      example: { en: 'The gardens were laid out about two hundred years ago.', zh: '园林格局约两百年前规划成形。' },
    },
    {
      phrase: 'at their height', sentenceIndex: 12,
      meaning: { zh: '处于全盛期，开得最盛', en: 'at the strongest or fullest stage of flowering' },
      usage: { zh: '介词短语；peonies at their height、at the height of summer。', en: 'Prepositional phrase: peonies at their height, at the height of summer.' },
      example: { en: 'The delphiniums are at their height along the terrace.', zh: '飞燕草在露台边开得最盛。' },
    },
    {
      phrase: 'out of bounds', sentenceIndex: 17,
      meaning: { zh: '不对外开放，禁止进入', en: 'not allowed for visitors to enter' },
      usage: { zh: '形容词短语；out of bounds to the public。反义 open to view。', en: 'Adjective phrase: out of bounds to the public. The opposite is open to view.' },
      example: { en: 'The glasshouse shelves are out of bounds to visitors.', zh: '温室货架区游客不得进入。' },
    },
    {
      phrase: 'carrying the colour', sentenceIndex: 21,
      meaning: { zh: '延续花色，维持观赏期', en: 'keeping the border flowering through a season' },
      usage: { zh: '现在分词；dahlias carrying the colour through autumn。', en: 'Present participle: dahlias carrying the colour through autumn.' },
      example: { en: 'Dahlias carry the colour through September and October.', zh: '大丽花把花色延续到九十月。' },
    },
    {
      phrase: 'stay on the marked paths', sentenceIndex: 31,
      meaning: { zh: '走在标示路径上', en: 'keep to the signed routes rather than the beds' },
      usage: { zh: '及物；visitors stay on the marked paths。', en: 'Transitive: visitors stay on the marked paths.' },
      example: { en: 'Visitors should stay on the marked paths in the beds.', zh: '游客应沿标示路径行走。' },
    },
    {
      phrase: 'before we set off', sentenceIndex: 37,
      meaning: { zh: '在出发之前', en: 'before the guided walk begins' },
      usage: { zh: '时间状语从句；set off 指出发。', en: 'Time clause; set off means to leave.' },
      example: { en: 'Take the leaflet before we set off around the garden.', zh: '出发游园前拿好导览单。' },
    },
  ],
  tips: [
    {
      title: { zh: '风格与植物分开记', en: 'Keep style and plant names separate' },
      body: {
        zh: '笔记前半先给整体风格 Italian，再给具体珍稀树 cedar；听到 section、style 记风格词，听到 tree、specimen、near the stream 记植物名，避免把花境名字填进风格空。',
        en: 'The notes open with the overall style Italian, then the rare cedar. Record a style after section or style, and a plant after tree, specimen or near the stream, so a border name does not fill the style gap.',
      },
    },
    {
      title: { zh: '花期按季节分组对号', en: 'Match flowers to their season' },
      body: {
        zh: '同一篇出现初夏 June、春 April、秋 September and October 三段花期。第 15 题主花期在六月，第 19 题秋花是大丽花与紫菀；听到 peonies、delphiniums 归初夏，dahlias、Michaelmas daisies 归秋季，不要混填。',
        en: 'One tour covers early summer June, spring April and autumn September and October. Item 15 peaks in June; item 19’s autumn flowers are dahlias and daisies. Group peonies and delphiniums as early summer and dahlias and daisies as autumn.',
      },
    },
    {
      title: { zh: '修复题区分年份与对象', en: 'Split restoration by object and year' },
      body: {
        zh: '去年有两项修整：石墙修复（笔记 13）和观景木台阶翻修（单选 17）。听到 restoration、rebuilt 记石墙，听到 steps、repaired and repainted 记木台阶；石桥清洗属于日常维护，不算去年修复工程。',
        en: 'Two works were done last year: the wall restoration (note 13) and the viewpoint steps (choice 17). Note the wall after restoration or rebuilt, and the steps after repaired and repainted. Bridge cleaning is routine maintenance, not last year’s restoration.',
      },
    },
  ],
};
