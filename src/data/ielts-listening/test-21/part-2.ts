import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 21 · Part 2 — 污水处理厂参观（单人独白，新西兰口音）。原创仿真材料，非官方真题。
 *
 * 独白顺序：安全提醒 → 格栅 → 沉淀池 → 微生物池 → 污泥干床与肥料利用 → 加氯排放 →
 * 参观防护规则 → 五个处理环节的目的复盘（配对 16–20）。
 */
export const test21Part2: ListeningLesson = {
  slug: 'test-21-part-2',
  part: 2,
  status: 'published',
  title: { zh: '污水处理厂参观', en: 'A visit to a water treatment plant' },
  summary: {
    zh: '讲解员沿流程介绍污水处理：格栅拦截大件杂物，沉淀池靠重力分离固体，微生物池降解有机物，污泥晒干后制成肥料，出水前检测加氯；同时说明湿滑地面、栏杆与穿鞋等参观防护要求，并复盘五个环节各自的作用。',
    en: 'A guide walks through the process: screens catch coarse objects, settlement tanks drop solids by gravity, the biofilm pool digests organic matter, dried sludge becomes fertiliser, and chlorine is checked before discharge. Visitor safety rules and a stage-by-stage recap follow.',
  },
  accent: { zh: '发言人为新西兰口音，语速中等。', en: 'The speaker has a New Zealand accent and speaks at a moderate pace.' },
  speechRate: '+2%',
  cast: [
    { id: 'guide', label: 'GUIDE', gender: 'female', voice: 'en-NZ-MollyNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      rows: [
        { lead: 'Stage one: screens catch large', cells: [[{ blank: 11 }]] },
        { lead: 'Microbes feed on dissolved', cells: [[{ blank: 12 }]] },
        { lead: 'Dried sludge is turned into', cells: [[{ blank: 13 }, { text: ' for farms' }]] },
        { lead: 'Final check measures', cells: [[{ blank: 14 }, { text: ' levels' }]] },
        { lead: 'Visitors must wear protective', cells: [[{ blank: 15 }]] },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What happens in each room or bed? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'microbes digest dissolved material using pumped oxygen' },
        { key: 'B', text: 'coarse items are removed by hand each morning' },
        { key: 'C', text: 'settled solids drop to the floor under gravity' },
        { key: 'D', text: 'water receives a final chemical check and filter' },
        { key: 'E', text: 'sludge spreads on open beds to lose its moisture' },
        { key: 'F', text: 'rainwater drains separately from the treatment line' },
      ],
      items: [
        { number: 16, text: 'screening chamber' },
        { number: 17, text: 'settlement tank' },
        { number: 18, text: 'biofilm pool' },
        { number: 19, text: 'drying bed' },
        { number: 20, text: 'chlorination room' },
      ],
    },
  ],
  answers: [
    {
      number: 11, accepted: ['objects'], evidence: 4,
      explanation: {
        zh: '定位句 4：screens that catch large objects such as cloth, plastic and branches。格栅拦截大件物品，填 objects；句 5 的 debris 是清理出的残渣，不是格栅拦截的对象类别。',
        en: 'Sentence 4: screens "catch large objects such as cloth, plastic and branches", so fill objects. The debris in sentence 5 is what is later cleared out.',
      },
    },
    {
      number: 12, accepted: ['organic matter'], evidence: 8,
      explanation: {
        zh: '定位句 8：special microbes feed on the dissolved organic matter left in the water。微生物以溶解的有机物为食，填 organic matter；句 9 的 biofilm 是微生物附着层，不是它们的食物。',
        en: 'Sentence 8: microbes "feed on the dissolved organic matter left in the water", so fill organic matter. The biofilm in sentence 9 is where they attach, not their food.',
      },
    },
    {
      number: 13, accepted: ['fertiliser'], evidence: 11,
      explanation: {
        zh: '定位句 11：the sludge is composted and turned into fertiliser for local farms。污泥制成农场用肥料，填 fertiliser；句 12 去填埋的是被农场拒收的小部分污泥。',
        en: 'Sentence 11: sludge "is composted and turned into fertiliser for local farms", so fill fertiliser. The landfill part in sentence 12 covers only rejected sludge.',
      },
    },
    {
      number: 14, accepted: ['chlorine'], evidence: 13,
      explanation: {
        zh: '定位句 13：operators check chlorine levels and add a final filter。出水前检测氯含量，题目已给 levels，填 chlorine；句 14 的 river 是排放去向，不是检测指标。',
        en: 'Sentence 13: operators "check chlorine levels and add a final filter". Levels is printed, so fill chlorine. The river in sentence 14 is the receiving water, not the test measure.',
      },
    },
    {
      number: 15, accepted: ['boots'], evidence: 15,
      explanation: {
        zh: '定位句 15：so wear the boots provided at the entrance。参观须穿入口提供的防护靴，填 boots；句 16 的 railings 是不能倚靠的设施，不是穿戴物。',
        en: 'Sentence 15: "wear the boots provided at the entrance", so fill boots. The railings in sentence 16 are a barrier not to lean on, not protective clothing.',
      },
    },
    {
      number: 16, accepted: ['B'], evidence: 21,
      explanation: {
        zh: '定位句 21：In the screening chamber, coarse items are lifted out by hand each morning。格栅间每天人工清出粗杂物，对应 B。F 的雨污分流在句 36 另述，不属于该车间。',
        en: 'Sentence 21: in the screening chamber, "coarse items are lifted out by hand each morning", matching B. Separate rainwater drainage in sentence 36 is a different system.',
      },
    },
    {
      number: 17, accepted: ['C'], evidence: 22,
      explanation: {
        zh: '定位句 22：In the settlement tank, settled solids drop to the floor under gravity。沉淀池靠重力让固体沉底，对应 C。句 6 的 upper water 是沉淀后的上层清水。',
        en: 'Sentence 22: in the settlement tank, "settled solids drop to the floor under gravity", matching C. The upper water in sentence 6 is the clarified layer above.',
      },
    },
    {
      number: 18, accepted: ['A'], evidence: 23,
      explanation: {
        zh: '定位句 23：In the biofilm pool, microbes digest dissolved material using pumped oxygen。微生物池用泵送氧气分解溶解物，对应 A。',
        en: 'Sentence 23: in the biofilm pool, "microbes digest dissolved material using pumped oxygen", matching A.',
      },
    },
    {
      number: 19, accepted: ['E'], evidence: 24,
      explanation: {
        zh: '定位句 24：On the drying bed, sludge spreads on open beds to lose its moisture。干床摊开污泥脱去水分，对应 E。句 11 的堆肥是脱水之后的下一步处理。',
        en: 'Sentence 24: on the drying bed, "sludge spreads on open beds to lose its moisture", matching E. Composting in sentence 11 follows the drying stage.',
      },
    },
    {
      number: 20, accepted: ['D'], evidence: 25,
      explanation: {
        zh: '定位句 25：In the chlorination room, the water gets a final chemical check and filter。加氯室做最终化学检测与过滤，对应 D。',
        en: 'Sentence 25: in the chlorination room, "the water gets a final chemical check and filter", matching D.',
      },
    },
  ],
  transcript: [
    { speaker: 'guide', text: 'Stay behind the yellow line; the raw tanks ahead hold water we have not treated yet.' },
    { speaker: 'guide', text: 'I’m Maya, your guide for today, and we will walk through the plant in four short stages.' },
    { speaker: 'guide', text: 'Most equipment runs automatically, but operators check each stage around the clock and record any unusual reading in the log book.' },
    { speaker: 'guide', text: 'The water arrives from town through large pipes before anything else happens.' },
    { speaker: 'guide', text: 'First it passes through screens that catch large objects such as cloth, plastic and branches.' },
    { speaker: 'guide', text: 'Workers remove this debris by hand each morning, and it goes to general waste.' },
    { speaker: 'guide', text: 'After screening, the water flows into settlement tanks, where heavier particles drop to the floor.' },
    { speaker: 'guide', text: 'The clearer upper water then moves across to the biological pool, our next stop.' },
    { speaker: 'guide', text: 'In this pool, special microbes feed on the dissolved organic matter left in the water.' },
    { speaker: 'guide', text: 'The microbes form a thin biofilm on stones, and they need oxygen pumped in from blowers.' },
    { speaker: 'guide', text: 'The separated sludge is thickened in tanks and then dried on open beds in the yard.' },
    { speaker: 'guide', text: 'Once dry, the sludge is composted and turned into fertiliser for local farms.' },
    { speaker: 'guide', text: 'A small part of the sludge goes to landfill if it contains chemicals the farms reject.' },
    { speaker: 'guide', text: 'Before the water leaves the plant, operators check chlorine levels and add a final filter.' },
    { speaker: 'guide', text: 'Clean water returns to the river downstream, where fish and insects have returned in recent years.' },
    { speaker: 'guide', text: 'The floors can be wet near the tanks, so wear the boots provided at the entrance.' },
    { speaker: 'guide', text: 'Do not lean over the railings, and keep children beside you on the walkways.' },
    { speaker: 'guide', text: 'Photography is allowed outside, but please switch off cameras in the electrical rooms, where the wiring must stay undisturbed.' },
    { speaker: 'guide', text: 'The plant treats about forty million litres each day at full flow.' },
    { speaker: 'guide', text: 'Saving water at home reduces what the plant must handle each morning.' },
    { speaker: 'guide', text: 'Now let me revisit each room, in case you want to note its purpose.' },
    { speaker: 'guide', text: 'In the screening chamber, coarse items are lifted out by hand each morning.' },
    { speaker: 'guide', text: 'In the settlement tank, settled solids drop to the floor under gravity.' },
    { speaker: 'guide', text: 'In the biofilm pool, microbes digest dissolved material using pumped oxygen.' },
    { speaker: 'guide', text: 'On the drying bed, sludge spreads on open beds to lose its moisture.' },
    { speaker: 'guide', text: 'In the chlorination room, the water gets a final chemical check and filter.' },
    { speaker: 'guide', text: 'The fertiliser goes to vegetable farms within a thirty kilometre radius.' },
    { speaker: 'guide', text: 'Operators record the flow level once an hour on the control board and compare it with the average for the season.' },
    { speaker: 'guide', text: 'If you smell chlorine near the exit, that means the final stage is working.' },
    { speaker: 'guide', text: 'The plant was built after the old river began to show signs of pollution, when smaller local streams could no longer recover on their own.' },
    { speaker: 'guide', text: 'Local schools visit each term, and the leaflet explains the same steps.' },
    { speaker: 'guide', text: 'A volunteer will answer questions by the gift table after the tour.' },
    { speaker: 'guide', text: 'The next open day is in two months, when the sludge beds are on display.' },
    { speaker: 'guide', text: 'Remember to stay on the raised path between the tanks.' },
    { speaker: 'guide', text: 'The screens are replaced every few years when the bars bend.' },
    { speaker: 'guide', text: 'Blowers in the biofilm room run quietly, but their pipes carry air to the stones.' },
    { speaker: 'guide', text: 'Rainwater from the roofs drains separately and never enters the treatment line.' },
    { speaker: 'guide', text: 'Visitors who wear open shoes should change into the boots at the desk.' },
    { speaker: 'guide', text: 'The control room overlooks the settlement tanks through a wide window.' },
    { speaker: 'guide', text: 'Questions about recycling are listed in the leaflet on the way out.' },
  ],
  vocabulary: [
    {
      term: 'screens', phonetic: '/skriːnz/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '格栅，筛网', en: 'bars that trap large objects from flowing water' },
      usage: { zh: '可数复数；through screens、clean the screens。动词 screen。', en: 'Countable plural: through screens, clean the screens; the verb is screen.' },
      collocations: ['the inlet screens', 'clean the screens', 'metal screens'],
      example: { en: 'The screens catch branches before the water reaches the tanks.', zh: '格栅在水进池前拦住树枝。' },
      listening: { zh: '词尾 /z/ 清晰，不要读成 screet。', en: 'The final /z/ is clear; do not say screet.' },
    },
    {
      term: 'debris', phonetic: '/ˈdebriː/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '残渣，杂物', en: 'scattered waste and broken material' },
      usage: { zh: '不可数；remove debris、debris pile。', en: 'Uncountable: remove debris, a debris pile.' },
      collocations: ['remove the debris', 'organic debris', 'clear the debris'],
      example: { en: 'Workers clear the debris from the screens each morning.', zh: '工人每天早上清格栅残渣。' },
      listening: { zh: '重音在第一音节，结尾 /iː/ 长音，s 不发音。', en: 'Stress the first syllable, long final /iː/, and the s is silent.' },
    },
    {
      term: 'microbes', phonetic: '/ˈmaɪkrəʊbz/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '微生物，细菌', en: 'tiny living organisms visible only under a microscope' },
      usage: { zh: '可数复数；special microbes、microbes feed on。', en: 'Countable plural: special microbes, microbes feed on.' },
      collocations: ['special microbes', 'helpful microbes', 'microbes digest'],
      example: { en: 'Microbes break down the waste in the biological pool.', zh: '微生物在生物池分解污物。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈmaɪ/。', en: 'Two syllables with stress on the first.' },
    },
    {
      term: 'biofilm', phonetic: '/ˈbaɪəʊfɪlm/', partOfSpeech: 'n.', sentenceIndex: 9,
      meaning: { zh: '生物膜', en: 'a thin layer of microbes growing on a surface' },
      usage: { zh: '可数；form a thin biofilm。', en: 'Countable: form a thin biofilm.' },
      collocations: ['a thin biofilm', 'the biofilm layer', 'biofilm on stones'],
      example: { en: 'The biofilm covers the stones in the biological pool.', zh: '生物膜覆盖生物池里的石头。' },
      listening: { zh: '复合词，重音在第一部分 /baɪ/。', en: 'A compound with stress on the first part.' },
    },
    {
      term: 'sludge', phonetic: '/slʌdʒ/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '污泥，淤渣', en: 'thick wet waste separated from the water' },
      usage: { zh: '不可数；dry the sludge、sludge bed。', en: 'Uncountable: dry the sludge, a sludge bed.' },
      collocations: ['separated sludge', 'dry the sludge', 'sludge beds'],
      example: { en: 'The sludge is thickened before it goes to the beds.', zh: '污泥进干床前先浓缩。' },
      listening: { zh: '单音节，与 judge 押韵，开头 /sl/。', en: 'One syllable rhyming with judge, opening /sl/.' },
    },
    {
      term: 'fertiliser', phonetic: '/ˈfɜːtɪlaɪzə/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '肥料', en: 'substance added to soil to help crops grow' },
      usage: { zh: '可数或不可数；organic fertiliser。美式拼 fertilizer。', en: 'Countable or uncountable: organic fertiliser; American spelling fertilizer.' },
      collocations: ['organic fertiliser', 'farm fertiliser', 'produce fertiliser'],
      example: { en: 'Dried sludge becomes fertiliser for vegetable farms.', zh: '干污泥成为菜地肥料。' },
      listening: { zh: '重音在第一音节 /ˈfɜː/，中间 /tɪ/ 轻读。', en: 'Stress the first syllable; the middle /tɪ/ is soft.' },
    },
    {
      term: 'chlorine', phonetic: '/ˈklɔːriːn/', partOfSpeech: 'n.', sentenceIndex: 13,
      meaning: { zh: '氯（消毒剂）', en: 'a chemical used to kill germs in water' },
      usage: { zh: '不可数；chlorine levels、add chlorine。', en: 'Uncountable: chlorine levels, add chlorine.' },
      collocations: ['chlorine levels', 'the chlorine check', 'chlorine smell'],
      example: { en: 'Operators test the chlorine before release.', zh: '排放前操作员检测氯含量。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈklɔː/。', en: 'Two syllables with stress on the first.' },
    },
  ],
  expressions: [
    {
      phrase: 'walk through', sentenceIndex: 1,
      meaning: { zh: '逐一讲解，带过一遍', en: 'to explain a process step by step' },
      usage: { zh: '及物短语；walk through the stages、walk the group through。', en: 'Transitive: walk through the stages, walk the group through.' },
      example: { en: 'I will walk you through the four treatment stages.', zh: '我带大家过一遍四个处理环节。' },
    },
    {
      phrase: 'feed on', sentenceIndex: 8,
      meaning: { zh: '以……为食，靠……为生', en: 'to use something as a source of food' },
      usage: { zh: '动物或微生物以某物为食；feed on organic matter。', en: 'Animals or microbes feed on something: feed on organic matter.' },
      example: { en: 'The microbes feed on the waste left in the water.', zh: '微生物以水中残留污物为食。' },
    },
    {
      phrase: 'turned into', sentenceIndex: 11,
      meaning: { zh: '被转化成', en: 'to be changed into another form' },
      usage: { zh: '被动结构；be turned into fertiliser、be turned into compost。', en: 'Passive: be turned into fertiliser, into compost.' },
      example: { en: 'The dry sludge is turned into garden fertiliser.', zh: '干污泥被制成园艺肥料。' },
    },
    {
      phrase: 'returns to', sentenceIndex: 14,
      meaning: { zh: '回到（水体）', en: 'to flow back into a natural water body' },
      usage: { zh: '指水或物品回到某处；常见搭配 return to the river、return to the sea。', en: 'Water or goods flow back somewhere: return to the river, return to the sea.' },
      example: { en: 'Treated water returns to the clean part of the river.', zh: '处理后的水回到河流清洁段。' },
    },
    {
      phrase: 'lean over', sentenceIndex: 16,
      meaning: { zh: '俯身越过（栏杆）', en: 'to bend forward over a barrier' },
      usage: { zh: '指俯身越过栏杆或边缘；常见搭配 lean over the railing、lean over the tank edge。', en: 'To bend forward over a barrier: lean over the railing, over the tank edge.' },
      example: { en: 'Do not lean over the railings beside the tanks.', zh: '不要俯身在池边栏杆上。' },
    },
    {
      phrase: 'at full flow', sentenceIndex: 18,
      meaning: { zh: '满负荷流量下', en: 'when the plant is treating its maximum volume' },
      usage: { zh: 'flow 作名词；at full flow、at normal flow。', en: 'Flow is a noun here: at full flow, at normal flow.' },
      example: { en: 'The plant treats forty million litres at full flow.', zh: '满负荷时厂内处理四千万升水。' },
    },
    {
      phrase: 'lose its moisture', sentenceIndex: 24,
      meaning: { zh: '脱去水分', en: 'to dry out by losing water content' },
      usage: { zh: 'moisture 不可数；lose moisture、retain moisture。', en: 'Moisture is uncountable: lose moisture, retain moisture.' },
      example: { en: 'The sludge spreads out to lose its moisture.', zh: '污泥摊开脱去水分。' },
    },
  ],
  tips: [
    {
      title: { zh: '顺着流程记笔记', en: 'Follow the process order in notes' },
      body: {
        zh: '处理环节按格栅、沉淀、微生物、干床、加氯的顺序展开。在笔记上按顺序留出空行，听到 stage one、next stop、before the water leaves 这类路标就知道填到了哪一格。',
        en: 'The stages run screens, settlement, biofilm, drying bed, chlorination. Leave blank lines in order; stage one, next stop and before the water leaves tell you which blank you have reached.',
      },
    },
    {
      title: { zh: '配对先判车间功能', en: 'Match the room to its function' },
      body: {
        zh: '配对题把五个车间与功能句对应。先在车间名旁记下关键词：hand, gravity, oxygen, moisture, chemical check，再去匹配选项，不要被同样出现 sludge 的两个选项混淆。',
        en: 'Matching links each room to its function. Note the keywords beside the name: hand, gravity, oxygen, moisture, chemical check, then match; do not confuse the two sludge options.',
      },
    },
    {
      title: { zh: '防护规则单独归类', en: 'Keep safety rules in their own group' },
      body: {
        zh: 'boots、railings、cameras、open shoes 属于参观规则，和处理流程是两条线。听到规则提示时把它们记在笔记下方，避免把穿戴物填进工艺指标空。',
        en: 'Boots, railings, cameras and open shoes are visitor rules, a separate line from the process. Note them below the process so a protective item does not slip into a chemistry blank.',
      },
    },
  ],
};
