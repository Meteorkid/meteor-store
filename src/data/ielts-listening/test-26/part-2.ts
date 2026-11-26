import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 26 · Part 2 — 野生动物保护区讲解（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：路线安全 → 栖息地类型 → 观鸟塘 → 投喂禁令 → 繁殖季限制 → 巡逻路线 →
 * 五个地点的行为要求复盘（配对 16–20）。
 */
export const test26Part2: ListeningLesson = {
  slug: 'test-26-part-2',
  part: 2,
  status: 'published',
  title: { zh: '野生动物保护区讲解', en: 'A ranger talk at a wildlife reserve' },
  summary: {
    zh: '保护区护林员介绍原生林与灌丛栖息地、湖边观鸟棚、禁止投喂规定、繁殖季对犬只的限制和巡逻路线，并复盘观鸟棚、灌丛小径、投喂点、繁殖地与巡逻道各处应遵守的行为要求。',
    en: 'A ranger explains the native forest and scrub habitat, the lagoon hide, the no-feeding rule, dog restrictions in the breeding season and the patrol route, then recaps the required behaviour at the hide, track, feeding station, breeding ground and patrol path.',
  },
  accent: { zh: '发言人为新西兰口音，语速中等。', en: 'The speaker has a New Zealand accent and speaks at a moderate pace.' },
  speechRate: '+2%',
  cast: [
    { id: 'ranger', label: 'RANGER', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Habitat: native', cells: [[{ blank: 11 }, { text: ' and scrub beside the coast' }]] },
        { lead: 'Birdwatching hide stands beside the', cells: [[{ blank: 12 }]] },
        { lead: 'Visitors must not', cells: [[{ blank: 13 }, { text: ' the animals' }]] },
        { lead: 'Breeding season: trails closed to', cells: [[{ blank: 14 }]] },
        { lead: 'Rangers follow the marked', cells: [[{ blank: 15 }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What should visitors do at each spot? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'keep quiet and stay behind the fence' },
        { key: 'B', text: 'stay on the path to protect nesting birds' },
        { key: 'C', text: 'mark the habitat boundaries each week' },
        { key: 'D', text: 'no feeding whatever the animal looks like' },
        { key: 'E', text: 'look for wading birds among the reeds' },
        { key: 'F', text: 'record animal sightings on the patrol log' },
      ],
      items: [
        { number: 16, text: 'lakeside hide' },
        { number: 17, text: 'scrubland track' },
        { number: 18, text: 'feeding station' },
        { number: 19, text: 'breeding ground' },
        { number: 20, text: 'patrol path' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['forest'], evidence: 2,
      explanation: {
        zh: '定位句 2：four hundred hectares of native forest and open scrub beside the coast。栖息地为原生林加灌丛，题目已给 and scrub，填 forest；句 3 的 bracken 是被清理的蕨类，不是栖息地主体。',
        en: 'Sentence 2: "four hundred hectares of native forest and open scrub beside the coast". And scrub is printed, so fill forest. Bracken in sentence 3 is cut back, not the main habitat.',
      },
    },
    {
      number: 12, accepted: ['lagoon'], evidence: 4,
      explanation: {
        zh: '定位句 4：Our main birdwatching hide stands beside the shallow lagoon。观鸟棚在浅塘边，填 lagoon；句 5 的 reeds 是塘边植物，不是棚位所在水体。',
        en: 'Sentence 4: the main hide "stands beside the shallow lagoon", so fill lagoon. Reeds in sentence 5 grow beside it, not the water body itself.',
      },
    },
    {
      number: 13, accepted: ['feed'], evidence: 7,
      explanation: {
        zh: '定位句 7：visitors must not feed the animals, however tame they look。禁止投喂动物，题目已给 the animals，填 feed；句 8 的 rats and foxes 是投喂引来的后果。',
        en: 'Sentence 7: "visitors must not feed the animals, however tame they look". The animals is printed, so fill feed. Rats and foxes in sentence 8 are the drawn-in predators.',
      },
    },
    {
      number: 14, accepted: ['dogs'], evidence: 9,
      explanation: {
        zh: '定位句 9：the breeding season closes some trails to dogs, even well behaved ones。繁殖季部分步道对犬只关闭，填 dogs；句 10 的 horses and bikes 是另两类受限活动。',
        en: 'Sentence 9: "the breeding season closes some trails to dogs, even well behaved ones", so fill dogs. Horses and bikes in sentence 10 are separate restricted activities.',
      },
    },
    {
      number: 15, accepted: ['route'], evidence: 12,
      explanation: {
        zh: '定位句 12：Rangers patrol the reserve along the marked route, checking fences and water levels each shift。护林员沿标记路线巡逻，填 route；句 13 的 patrol log 是记录工具，不是行进线路。',
        en: 'Sentence 12: rangers "patrol the reserve along the marked route", so fill route. The patrol log in sentence 13 is the record, not the path.',
      },
    },
    {
      number: 16, accepted: ['E'], evidence: 17,
      explanation: {
        zh: '定位句 17：Watch the reeds at dawn, where wading birds pick insects from the stems。湖边棚中可在芦苇间观察涉禽，对应 E。',
        en: 'Sentence 17: "Watch the reeds at dawn, where wading birds pick insects from the stems", matching E.',
      },
    },
    {
      number: 17, accepted: ['B'], evidence: 18,
      explanation: {
        zh: '定位句 18：Keep to the path so nesting birds are not disturbed under the bushes。灌丛小径须留在路上以免惊扰巢鸟，对应 B。',
        en: 'Sentence 18: "Keep to the path so nesting birds are not disturbed under the bushes", matching B.',
      },
    },
    {
      number: 18, accepted: ['D'], evidence: 19,
      explanation: {
        zh: '定位句 19：under no circumstances do visitors hand food to the animals。旧投喂点禁止任何投喂，对应 D。',
        en: 'Sentence 19: "under no circumstances do visitors hand food to the animals", matching D.',
      },
    },
    {
      number: 19, accepted: ['A'], evidence: 20,
      explanation: {
        zh: '定位句 20：The fenced breeding ground near the ridge must stay quiet, and no one leans on the fence。繁殖地须保持安静、留在围栏后，对应 A。',
        en: 'Sentence 20: the fenced breeding ground "must stay quiet, and no one leans on the fence", matching A.',
      },
    },
    {
      number: 20, accepted: ['F'], evidence: 21,
      explanation: {
        zh: '定位句 21：rangers write down animal sightings in the patrol log。巡逻道上护林员把目击记录到巡逻日志，对应 F。C 的每周划界没有出现在复盘段。',
        en: 'Sentence 21: rangers "write down animal sightings in the patrol log", matching F. Marking boundaries weekly in C is not mentioned in the recap.',
      },
    },
  ],
  transcript: [
    { speaker: 'ranger', text: 'Keep to the marked paths today, and do not step over the fence into the scrub.' },
    { speaker: 'ranger', text: 'I’m Anna, one of the reserve rangers, and I’ll walk you through the main rules before we start.' },
    { speaker: 'ranger', text: 'The reserve covers four hundred hectares of native forest and open scrub beside the coast.' },
    { speaker: 'ranger', text: 'The warden team cuts back bracken each spring to keep the bird routes open.' },
    { speaker: 'ranger', text: 'Our main birdwatching hide stands beside the shallow lagoon, where the reeds grow thick.' },
    { speaker: 'ranger', text: 'The lagoon level is kept steady so wading birds can feed there through summer.' },
    { speaker: 'ranger', text: 'A common question is whether visitors may give the animals snacks.' },
    { speaker: 'ranger', text: 'The answer is no, and the rule is that visitors must not feed the animals, however tame they look.' },
    { speaker: 'ranger', text: 'Food left out also attracts rats and foxes that prey on the nests.' },
    { speaker: 'ranger', text: 'From August to November, the breeding season closes some trails to dogs, even well behaved ones.' },
    { speaker: 'ranger', text: 'Horses and bikes stay on the main east track during those months.' },
    { speaker: 'ranger', text: 'Outside the breeding season, dogs may walk the shorter loops on a short lead.' },
    { speaker: 'ranger', text: 'Rangers patrol the reserve along the marked route, checking fences and water levels each shift.' },
    { speaker: 'ranger', text: 'The patrol log records sightings, fence damage and any litter left behind.' },
    { speaker: 'ranger', text: 'Bring drinking water with you, because the tap near the gate is for emergency use only.' },
    { speaker: 'ranger', text: 'Children must stay beside an adult on the steep ridge section.' },
    { speaker: 'ranger', text: 'Now let me go through each spot and what you should do there.' },
    { speaker: 'ranger', text: 'First, the lakeside hide. Watch the reeds at dawn, where wading birds pick insects from the stems.' },
    { speaker: 'ranger', text: 'Next, the scrubland track. Keep to the path so nesting birds are not disturbed under the bushes.' },
    { speaker: 'ranger', text: 'The old feeding station near the car park is closed; under no circumstances do visitors hand food to the animals.' },
    { speaker: 'ranger', text: 'The fenced breeding ground near the ridge must stay quiet, and no one leans on the fence.' },
    { speaker: 'ranger', text: 'Finally, the patrol path runs the full boundary; rangers write down animal sightings in the patrol log.' },
    { speaker: 'ranger', text: 'The reserve runs guided walks every Saturday morning during spring.' },
    { speaker: 'ranger', text: 'Bird lists are updated at the notice board by the main gate.' },
    { speaker: 'ranger', text: 'If you spot an injured animal, note its location and tell a ranger rather than approach it.' },
    { speaker: 'ranger', text: 'The coastal track is closed after heavy rain until the surface drains.' },
    { speaker: 'ranger', text: 'Our volunteer scheme helps with planting and fence repairs each winter.' },
    { speaker: 'ranger', text: 'Visitors may take photographs, but flash should be turned off near the nests.' },
    { speaker: 'ranger', text: 'The shelter near the lagoon provides shade on hot afternoons.' },
    { speaker: 'ranger', text: 'Rangers remove invasive weeds before they spread into the native blocks.' },
    { speaker: 'ranger', text: 'A small wetland at the reserve end filters runoff before it reaches the sea.' },
    { speaker: 'ranger', text: 'The reserve was founded to protect the breeding colony of the reef heron.' },
    { speaker: 'ranger', text: 'Walkers should carry their own bags out, as bins attract scavengers.' },
    { speaker: 'ranger', text: 'The eastern loop passes the old boundary wall and returns to the gate.' },
    { speaker: 'ranger', text: 'Questions are welcome after the short walk around the lagoon.' },
    { speaker: 'ranger', text: 'The reserve opens at seven in the morning and closes at dusk each day.' },
    { speaker: 'ranger', text: 'Entrance is free, and the small car park sits beside the main gate.' },
    { speaker: 'ranger', text: 'Binoculars may be borrowed from the shelter for a short walk around the lagoon.' },
    { speaker: 'ranger', text: 'Young visitors must stay close to an adult on any raised boardwalk.' },
    { speaker: 'ranger', text: 'Rangers publish a short note each month about the birds seen on the loop.' },
    { speaker: 'ranger', text: 'Please keep any collected litter in your bag until you reach the gate.' },
  ],
  vocabulary: [
    {
      term: 'reserve', phonetic: '/rɪˈzɜːv/', partOfSpeech: 'n.', sentenceIndex: 2,
      meaning: { zh: '保护区，自然保留地', en: 'an area of land protected for wildlife' },
      usage: { zh: '可数；wildlife reserve、the reserve team。', en: 'Countable: wildlife reserve, the reserve team.' },
      collocations: ['the wildlife reserve', 'the reserve boundary', 'a nature reserve'],
      example: { en: 'The reserve protects birds along the coast.', zh: '保护区保护沿海鸟类。' },
      listening: { zh: '名词重音在第二音节 /ˈzɜː/；动词 reserve 同音。', en: 'The noun stresses the second syllable; the verb sounds the same.' },
    },
    {
      term: 'scrub', phonetic: '/skrʌb/', partOfSpeech: 'n.', sentenceIndex: 0,
      meaning: { zh: '灌丛，矮灌木地', en: 'low dense bushes growing on open land' },
      usage: { zh: '不可数；open scrub、scrubland track。', en: 'Uncountable: open scrub, scrubland track.' },
      collocations: ['open scrub', 'scrub habitat', 'the scrub track'],
      example: { en: 'The path runs through low scrub behind the fence.', zh: '小径穿过围栏后的矮灌丛。' },
      listening: { zh: '单音节，与 club 押韵，开头 /skr/。', en: 'One syllable rhyming with club, opening /skr/.' },
    },
    {
      term: 'lagoon', phonetic: '/ləˈɡuːn/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '浅水塘，泻湖', en: 'a shallow sheltered pool near the coast' },
      usage: { zh: '可数；the shallow lagoon、beside the lagoon。', en: 'Countable: the shallow lagoon, beside the lagoon.' },
      collocations: ['the shallow lagoon', 'beside the lagoon', 'lagoon level'],
      example: { en: 'The hide overlooks the shallow lagoon.', zh: '观鸟棚俯瞰浅水塘。' },
      listening: { zh: '重音在第二音节 /ˈɡuː/，长音。', en: 'Stress the second syllable with a long /uː/.' },
    },
    {
      term: 'wading', phonetic: '/ˈweɪdɪŋ/', partOfSpeech: 'adj.', sentenceIndex: 5,
      meaning: { zh: '涉水的（鸟类）', en: 'describing birds that stand and feed in shallow water' },
      usage: { zh: 'wading birds、wading species。动词 wade。', en: 'wading birds, wading species; the verb is wade.' },
      collocations: ['wading birds', 'wading species', 'wading in the shallows'],
      example: { en: 'Wading birds feed among the reeds.', zh: '涉禽在芦苇间觅食。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈweɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'breeding', phonetic: '/ˈbriːdɪŋ/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '繁殖（季节、群体）', en: 'the season when animals nest and raise young' },
      usage: { zh: '不可数；breeding season、breeding ground。', en: 'Uncountable: breeding season, breeding ground.' },
      collocations: ['the breeding season', 'the breeding ground', 'the breeding colony'],
      example: { en: 'Trails close during the breeding season.', zh: '繁殖季步道关闭。' },
      listening: { zh: '两个音节，长音 /iː/。', en: 'Two syllables with a long /iː/.' },
    },
    {
      term: 'patrol', phonetic: '/pəˈtrəʊl/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '巡逻（路线、班次）', en: 'the regular walk made to check an area' },
      usage: { zh: '可数或不可数；patrol route、on patrol。', en: 'Countable or uncountable: patrol route, on patrol.' },
      collocations: ['the patrol route', 'the patrol log', 'a patrol shift'],
      example: { en: 'Rangers follow the patrol route each shift.', zh: '护林员每班沿巡逻路线走。' },
      listening: { zh: '名词与动词都重音在第二音节 /ˈtrəʊl/。', en: 'Noun and verb stress the second syllable.' },
    },
    {
      term: 'bracken', phonetic: '/ˈbrækən/', partOfSpeech: 'n.', sentenceIndex: 3,
      meaning: { zh: '蕨丛，欧洲蕨', en: 'large coarse fern that spreads over open ground' },
      usage: { zh: '不可数；cut back bracken、bracken beds。', en: 'Uncountable: cut back bracken, bracken beds.' },
      collocations: ['cut back bracken', 'the bracken beds', 'dense bracken'],
      example: { en: 'Bracken is cut back to keep paths open.', zh: '蕨丛被砍除以留出小径。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈbræk/。', en: 'Two syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk you through', sentenceIndex: 1,
      meaning: { zh: '带你逐一过一遍', en: 'to explain the main points step by step' },
      usage: { zh: '及物短语；walk the group through the rules。', en: 'Transitive: walk the group through the rules.' },
      example: { en: 'I will walk you through the reserve rules.', zh: '我带大家过一遍保护区规定。' },
    },
    {
      phrase: 'step over', sentenceIndex: 0,
      meaning: { zh: '跨过（围栏）', en: 'to cross over a barrier on foot' },
      usage: { zh: '动词短语；step over the fence、step over the rope，指从障碍上跨过去。', en: 'step over the fence, step over the rope.' },
      example: { en: 'Do not step over the fence into the scrub.', zh: '不要跨过围栏进灌丛。' },
    },
    {
      phrase: 'feed the animals', sentenceIndex: 7,
      meaning: { zh: '投喂动物', en: 'to give food to wildlife' },
      usage: { zh: 'feed 作及物动词；feed the animals、feed the birds。', en: 'Feed is transitive: feed the animals, feed the birds.' },
      example: { en: 'Visitors must not feed the wild animals.', zh: '游客不得投喂野生动物。' },
    },
    {
      phrase: 'prey on', sentenceIndex: 8,
      meaning: { zh: '捕食，袭击（巢穴）', en: 'to hunt and kill nestlings for food' },
      usage: { zh: '动物习性；foxes prey on nests、prey on chicks。', en: 'Animal behaviour: foxes prey on nests, prey on chicks.' },
      example: { en: 'Foxes prey on the bird nests at night.', zh: '狐狸夜间袭击鸟巢。' },
    },
    {
      phrase: 'keep to', sentenceIndex: 18,
      meaning: { zh: '留在（路上、范围内）', en: 'to stay within a path or boundary' },
      usage: { zh: '动词短语；keep to the path、keep to the marked route，指不越出路线。', en: 'keep to the path, keep to the marked route.' },
      example: { en: 'Please keep to the main track.', zh: '请留在主道上。' },
    },
    {
      phrase: 'leans on', sentenceIndex: 20,
      meaning: { zh: '倚靠（围栏）', en: 'to rest weight against a barrier' },
      usage: { zh: '动词短语；lean on the fence、lean on the rail，人称变化时作 leans on。', en: 'lean on the fence, lean on the rail; it becomes leans on with a third person.' },
      example: { en: 'No one should lean on the breeding ground fence.', zh: '不要倚靠繁殖地围栏。' },
    },
    {
      phrase: 'note its location', sentenceIndex: 24,
      meaning: { zh: '记下它的位置', en: 'to write down where an animal is seen' },
      usage: { zh: 'note 作动词；note its location、note the damage。', en: 'Note is a verb: note its location, note the damage.' },
      example: { en: 'Note the location and tell a ranger.', zh: '记下位置再告诉护林员。' },
    },
  ],
  tips: [
    {
      title: { zh: '独白跟着地点路标走', en: 'Follow the spot signposts' },
      body: {
        zh: 'Part 2 没有对话提示下一题。The main hide、The scrubland track、The old feeding station 这类短语标出地点切换，听到就检查自己填到了哪一格。',
        en: 'Nobody prompts the next item. Phrases such as The main hide, The scrubland track and The old feeding station mark spot switches; use them to check your place.',
      },
    },
    {
      title: { zh: '配对先判行为类型', en: 'Match the behaviour, not the keyword' },
      body: {
        zh: '配对题把地点与行为句对应。先在地点旁记下动作：watch reeds, keep to path, no food, stay quiet, log sightings，再匹配选项，别被同样出现 animals 的句子混淆。',
        en: 'Matching links spots to behaviours. Note the action beside each: watch reeds, keep to path, no food, stay quiet, log sightings; do not confuse sentences that both mention animals.',
      },
    },
    {
      title: { zh: '规则与生态分开记', en: 'Separate rules from ecology' },
      body: {
        zh: '栖息地、涉禽、蕨类是生态信息；禁止投喂、犬只限制、巡逻要求是参观规则。听到规则词 must not、closed to、patrol 就记到笔记下方，避免把生态词填进规则空。',
        en: 'Habitat, wading birds and bracken are ecology; no feeding, dog restrictions and patrols are visitor rules. At must not, closed to and patrol, note them below the ecology so an ecological word does not slip into a rule blank.',
      },
    },
  ],
};
