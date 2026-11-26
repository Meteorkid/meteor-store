import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 19 · Part 4 — 讲座：土壤健康。原创仿真材料，非官方真题。
 *
 * 结构：团粒结构与孔隙 → 有机质来源与作用 → 微生物与蚯蚓 → 耕作方式的影响 →
 * 团粒对根系的意义 → 有机质流失的后果 → 倾向的耕作方式 → 养地三项措施。
 * 表格填空 31–34 按出现顺序，单选 35–37 落在机理段，多选 38–40 落在措施段。
 * 开场用反问，不用 Today's lecture is about 句式。
 */
export const test19Part4: ListeningLesson = {
  slug: 'test-19-part-4',
  part: 4,
  status: 'published',
  title: { zh: '土壤健康', en: 'Soil health' },
  summary: {
    zh: '一场关于土壤健康的讲座：土壤颗粒如何结成团粒、团粒之间的孔隙如何保水透气，有机质以堆肥或厩肥的形式补充并把颗粒黏在一起，微生物如何把有机质分解成根系可吸收的养分，反复犁地如何破坏团粒；随后解释团粒对根系的意义、有机质流失的后果、讲师倾向的少耕方式，以及养地的三项措施。',
    en: 'A lecture on soil health: how particles bind into aggregates, how pores hold water and air, how organic matter is added as compost or manure, how microorganisms break matter into nutrients, and how ploughing damages crumbs. It then explains why aggregates matter to roots, what happens when matter is lost, the reduced-tillage approach favoured, and three practices that build soil health.',
  },
  accent: { zh: '讲师为澳式口音，术语会放慢重复。', en: 'The lecturer has an Australian accent and repeats key terms slowly.' },
  speechRate: '+3%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Component', 'Role in soil', 'Note'],
      rows: [
        { lead: 'Soil aggregates', cells: [[{ blank: 31 }], [{ text: 'hold water and air between them' }]] },
        { lead: 'Organic matter', cells: [[{ blank: 32 }], [{ text: 'binds particles into crumbs' }]] },
        { lead: 'Microorganisms', cells: [[{ blank: 33 }], [{ text: 'turned into plant nutrients' }]] },
        { lead: 'Tillage', cells: [[{ blank: 34 }], [{ text: 'broken apart by repeated ploughing' }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why do aggregates matter so much for plant roots?',
          options: [
            { key: 'A', text: 'They let air and water reach the roots without waterlogging.' },
            { key: 'B', text: 'They keep the soil surface warm through the winter.' },
            { key: 'C', text: 'They stop weeds from growing between the crop rows.' },
          ],
        },
        {
          number: 36,
          stem: 'What happens when soil loses its organic matter?',
          options: [
            { key: 'A', text: 'It becomes richer in nutrients after each harvest.' },
            { key: 'B', text: 'It holds less water and dries out quickly.' },
            { key: 'C', text: 'It forms a hard pan that drains rain too fast.' },
          ],
        },
        {
          number: 37,
          stem: 'Which tillage approach does the lecturer favour?',
          options: [
            { key: 'A', text: 'Deep ploughing once every season to clear weeds.' },
            { key: 'B', text: 'Reduced tillage that disturbs the soil as little as possible.' },
            { key: 'C', text: 'Full tillage after every harvest to loosen the top layer.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE practices build soil health over several seasons? Choose THREE letters, A–F.',
      select: 3,
      stem: 'Which THREE practices does the lecturer recommend?',
      options: [
        { key: 'A', text: 'adding compost on a regular basis' },
        { key: 'B', text: 'leaving crop stubble on the surface' },
        { key: 'C', text: 'ploughing deeply every season' },
        { key: 'D', text: 'rotating different crops year by year' },
        { key: 'E', text: 'applying weedkiller each month' },
        { key: 'F', text: 'compacting the soil after harvest' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['pores'], evidence: 6,
      explanation: {
        zh: '定位句 6：Between these aggregates are small pores that hold water and air。团粒之间的孔隙保水透气；aggregates 是团粒本身，不是本空答案。',
        en: 'Sentence 6: "Between these aggregates are small pores that hold water and air". The gaps between crumbs are pores; aggregates are the crumbs themselves, not this answer.',
      },
    },
    {
      number: 32, accepted: ['manure'], evidence: 12,
      explanation: {
        zh: '定位句 12：Farmers add it as compost, or as manure from grazing animals。有机质的两种来源是堆肥和厩肥；compost 已在句中并列出现，本空填 manure。',
        en: 'Sentence 12: "Farmers add it as compost, or as manure from grazing animals". The two sources are compost and manure; compost already appears beside the gap, so write manure.',
      },
    },
    {
      number: 33, accepted: ['organic matter'], evidence: 17,
      explanation: {
        zh: '定位句 17：Microorganisms break down organic matter into simple nutrients that roots can take up。微生物分解的对象是有机质；nutrients 是分解后的产物，不是被分解的对象。',
        en: 'Sentence 17: "Microorganisms break down organic matter into simple nutrients that roots can take up". Microorganisms break down organic matter; nutrients are the product, not the material being broken down.',
      },
    },
    {
      number: 34, accepted: ['aggregates'], evidence: 22,
      explanation: {
        zh: '定位句 22：Repeated ploughing breaks the aggregates apart and compacts the surface。反复犁地把团粒打碎；注意 aggregates 为复数，词尾不能丢。',
        en: 'Sentence 22: "Repeated ploughing breaks the aggregates apart and compacts the surface". Repeated ploughing breaks the aggregates apart; keep the plural ending.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：An open crumb structure lets air and water reach the roots without waterlogging。团粒结构让水和空气到达根系而不涝根，对应 A。保温和压草在本段没有依据。',
        en: 'Sentence 27: "An open crumb structure lets air and water reach the roots without waterlogging". The open structure delivers air and water without waterlogging, matching A. Warming the soil and suppressing weeds are not mentioned here.',
      },
    },
    {
      number: 36, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：It holds less water, dries out quickly, and blows away as fine dust in strong wind。有机质流失后保水变差、快速干透，对应 B。A 的养分逐年变富与 C 的硬壳层在本段被否定或归到别处。',
        en: 'Sentence 31: "It holds less water, dries out quickly, and blows away as fine dust in strong wind". Lost matter means less water held and fast drying, matching B. Richer nutrients and a hard pan are rejected or placed elsewhere in this part.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 35,
      explanation: {
        zh: '定位句 35：I favour reduced tillage, which disturbs the soil as little as possible each year。讲师倾向少耕、尽量少扰动土壤，对应 B。深耕和全耕在句 38 被归为长期损害结构的做法。',
        en: 'Sentence 35: "I favour reduced tillage, which disturbs the soil as little as possible each year". The lecturer favours reduced tillage with minimal disturbance, matching B. Deep and full tillage in sentence 38 are described as long-term damage to the structure.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 40,
      explanation: {
        zh: '定位句 40：The first is adding compost on a regular basis, which restores organic matter。第一项措施是定期施堆肥，对应 A。',
        en: 'Sentence 40: "The first is adding compost on a regular basis, which restores organic matter". The first practice is regular compost addition, matching A.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 41,
      explanation: {
        zh: '定位句 41：The second is leaving crop stubble on the surface after harvest, to shield the soil。第二项是收割后留茬覆盖地表，对应 B。',
        en: 'Sentence 41: "The second is leaving crop stubble on the surface after harvest, to shield the soil". The second practice is leaving stubble on the surface, matching B.',
      },
    },
    {
      number: 40, accepted: ['D'], evidence: 42,
      explanation: {
        zh: '定位句 42：The third is rotating different crops year by year, so the same nutrients are not drained。第三项是逐年轮作不同作物，对应 D。深耕、月度除草剂和收后压实土壤在句 44–46 被列为不利做法。',
        en: 'Sentence 42: "The third is rotating different crops year by year, so the same nutrients are not drained". The third practice is crop rotation, matching D. Deep ploughing, monthly weedkiller and post-harvest compaction are listed as unhelpful in sentences 44 to 46.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'What do you think weighs more, the animals you can see above ground, or the life hidden in the soil below?' },
    { speaker: 'lecturer', text: 'The answer surprises most people, because the hidden community is far larger than it looks.' },
    { speaker: 'lecturer', text: 'Soil health is not just about dirt. It describes how well the ground supports roots, water and life.' },
    { speaker: 'lecturer', text: 'We begin with the physical structure of the soil, the way particles stick together.' },
    { speaker: 'lecturer', text: 'Under a microscope, soil particles clump into small crumbs called aggregates.' },
    { speaker: 'lecturer', text: 'These crumbs vary in size, from fine grains to lumps the size of a pea.' },
    { speaker: 'lecturer', text: 'Between these aggregates are small pores that hold water and air.' },
    { speaker: 'lecturer', text: 'Roots grow through the larger pores, while fine pores retain moisture after rain.' },
    { speaker: 'lecturer', text: 'When the structure is open, water drains slowly and air reaches every layer.' },
    { speaker: 'lecturer', text: 'A collapsed structure, by contrast, seals the surface and runs water off.' },
    { speaker: 'lecturer', text: 'Next, what feeds these aggregates and keeps them stable.' },
    { speaker: 'lecturer', text: 'Organic matter is the decaying remains of plants, roots and once-living creatures.' },
    { speaker: 'lecturer', text: 'Farmers add it as compost, or as manure from grazing animals.' },
    { speaker: 'lecturer', text: 'It binds particles into crumbs, and it feeds the living part of the soil.' },
    { speaker: 'lecturer', text: 'Without it, the crumbs fall apart and the surface turns dusty after dry weather.' },
    { speaker: 'lecturer', text: 'Organic matter also acts like a sponge, soaking up rain and releasing it slowly.' },
    { speaker: 'lecturer', text: 'The third component is the living community itself, mostly invisible to the eye.' },
    { speaker: 'lecturer', text: 'Microorganisms break down organic matter into simple nutrients that roots can take up.' },
    { speaker: 'lecturer', text: 'Fungi weave threads through the crumbs, helping particles stick together over time.' },
    { speaker: 'lecturer', text: 'Earthworms mix the layers, opening channels that water and roots follow.' },
    { speaker: 'lecturer', text: 'Each group supports the others, so losing one weakens the whole community.' },
    { speaker: 'lecturer', text: 'The fourth factor is how the land is worked, which farmers call tillage.' },
    { speaker: 'lecturer', text: 'Repeated ploughing breaks the aggregates apart and compacts the surface.' },
    { speaker: 'lecturer', text: 'Each pass turns the soil over, burying surface matter and loosening the top layer.' },
    { speaker: 'lecturer', text: 'In the short term this clears weeds, but over years it wears down the crumb structure.' },
    { speaker: 'lecturer', text: 'Heavy machinery presses the lower layers into a hard pan that roots cannot cross.' },
    { speaker: 'lecturer', text: 'Why do these aggregates matter so much for plant roots?' },
    { speaker: 'lecturer', text: 'An open crumb structure lets air and water reach the roots without waterlogging.' },
    { speaker: 'lecturer', text: 'If the pores collapse, roots stay near the surface and struggle in dry spells.' },
    { speaker: 'lecturer', text: 'The crumbs also shelter microorganisms from drying wind and hot sun.' },
    { speaker: 'lecturer', text: 'What happens to soil that loses its organic matter?' },
    { speaker: 'lecturer', text: 'It holds less water, dries out quickly, and blows away as fine dust in strong wind.' },
    { speaker: 'lecturer', text: 'Nutrient levels fall, because there is little material left to decompose.' },
    { speaker: 'lecturer', text: 'The surface may look green for a season, but the reserve beneath it is thin.' },
    { speaker: 'lecturer', text: 'Which tillage approach does the lecturer favour?' },
    { speaker: 'lecturer', text: 'I favour reduced tillage, which disturbs the soil as little as possible each year.' },
    { speaker: 'lecturer', text: 'The surface is left mostly intact, and only narrow slots are cut for the seed.' },
    { speaker: 'lecturer', text: 'This keeps the crumbs whole, protects the pores, and preserves the living layer.' },
    { speaker: 'lecturer', text: 'Deep ploughing may clear weeds fast, but it costs the structure over the long run.' },
    { speaker: 'lecturer', text: 'Now let us list the practices that build soil health over several seasons.' },
    { speaker: 'lecturer', text: 'The first is adding compost on a regular basis, which restores organic matter.' },
    { speaker: 'lecturer', text: 'The second is leaving crop stubble on the surface after harvest, to shield the soil.' },
    { speaker: 'lecturer', text: 'The third is rotating different crops year by year, so the same nutrients are not drained.' },
    { speaker: 'lecturer', text: 'I should also mention what does not help in the long term.' },
    { speaker: 'lecturer', text: 'Ploughing deeply every season keeps breaking the crumbs we want to preserve.' },
    { speaker: 'lecturer', text: 'Applying weedkiller each month leaves the soil bare between crops, with little cover.' },
    { speaker: 'lecturer', text: 'Compacting the soil after harvest presses the pores shut and slows drainage.' },
    { speaker: 'lecturer', text: 'None of these three belongs in the recommended set for a healthy field.' },
    { speaker: 'lecturer', text: 'Healthy soil also needs time. A field cannot be restored in a single growing season.' },
    { speaker: 'lecturer', text: 'Farmers who keep records can watch organic matter rise slowly over years.' },
    { speaker: 'lecturer', text: 'They compare the colour, the crumbs and the earthworm count from one year to the next.' },
    { speaker: 'lecturer', text: 'A dark, crumbly soil with visible worms is a reliable sign of improving health.' },
    { speaker: 'lecturer', text: 'Soil health ties together structure, matter, life and the way the land is worked.' },
    { speaker: 'lecturer', text: 'When one element declines, the others usually follow, and the field loses its reserve.' },
    { speaker: 'lecturer', text: 'Next week we will look at how city gardens can apply the same principles on a small scale.' },
    { speaker: 'lecturer', text: 'We will finish there. The handout will help you review the stages.' },
  ],
  vocabulary: [
    {
      term: 'aggregates', phonetic: '/ˈæɡrɪɡəts/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '团粒，土壤团聚体', en: 'small crumbs formed when soil particles stick together' },
      usage: { zh: '复数；soil aggregates、crumb aggregates。单数 aggregate。', en: 'Plural: soil aggregates, crumb aggregates. Singular aggregate.' },
      collocations: ['soil aggregates', 'break the aggregates', 'crumb aggregates'],
      example: { en: 'Repeated ploughing breaks the aggregates apart.', zh: '反复犁地把土壤团粒打碎。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈæ/；结尾 /ɡəts/。', en: 'Three syllables with stress on the first; ending /ɡəts/.' },
    },
    {
      term: 'pores', phonetic: '/pɔːz/', partOfSpeech: 'n.', sentenceIndex: 6,
      meaning: { zh: '孔隙，细小空隙', en: 'small gaps between soil crumbs that hold water and air' },
      usage: { zh: '复数；soil pores、open pores。单数 pore。', en: 'Plural: soil pores, open pores. Singular pore.' },
      collocations: ['small pores', 'soil pores', 'the pores collapse'],
      example: { en: 'Small pores between aggregates hold water and air.', zh: '团粒间的小孔隙保水透气。' },
      listening: { zh: '单音节 /pɔː/，复数结尾 /z/；勿与 pours 同音混淆。', en: 'One syllable /pɔː/ with plural /z/; do not confuse with pours.' },
    },
    {
      term: 'manure', phonetic: '/məˈnjʊə(r)/', partOfSpeech: 'n.', sentenceIndex: 12,
      meaning: { zh: '厩肥，粪肥', en: 'animal dung used to fertilise the soil' },
      usage: { zh: '不可数；farmyard manure、add manure。', en: 'Uncountable: farmyard manure, add manure.' },
      collocations: ['animal manure', 'add manure', 'grazing animals'],
      example: { en: 'Farmers add manure from grazing animals to the soil.', zh: '农户把牲畜厩肥施进土壤。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈnjʊə/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'microorganisms', phonetic: '/ˌmaɪkrəʊˈɔːɡənɪzəmz/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '微生物', en: 'tiny living things such as bacteria and fungi in the soil' },
      usage: { zh: '复数；soil microorganisms、microorganisms break down。', en: 'Plural: soil microorganisms, microorganisms break down.' },
      collocations: ['soil microorganisms', 'living microorganisms', 'microorganisms in the soil'],
      example: { en: 'Microorganisms break down matter into simple nutrients.', zh: '微生物把有机质分解成简单养分。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈɔː/；开头 /maɪ/。', en: 'Five syllables with stress on the fourth; opening /maɪ/.' },
    },
    {
      term: 'nutrients', phonetic: '/ˈnjuːtriənts/', partOfSpeech: 'n.', sentenceIndex: 17,
      meaning: { zh: '养分，营养物', en: 'substances that roots absorb for growth' },
      usage: { zh: '复数；plant nutrients、absorb nutrients。', en: 'Plural: plant nutrients, absorb nutrients.' },
      collocations: ['plant nutrients', 'absorb nutrients', 'nutrient levels'],
      example: { en: 'Organic matter turns into nutrients that roots can take up.', zh: '有机质转化为根系可吸收的养分。' },
      listening: { zh: '三个音节，重音在第一音节 /ˈnjuː/。', en: 'Three syllables with stress on the first.' },
    },
    {
      term: 'tillage', phonetic: '/ˈtɪlɪdʒ/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '耕作，翻耕', en: 'the practice of working the soil before sowing' },
      usage: { zh: '不可数；reduced tillage、deep tillage。动词 till。', en: 'Uncountable: reduced tillage, deep tillage. The verb is till.' },
      collocations: ['reduced tillage', 'deep tillage', 'soil tillage'],
      example: { en: 'How the land is worked is what farmers call tillage.', zh: '土地如何耕作就是农所说的 tillage。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈtɪ/；结尾 /dʒ/。', en: 'Two syllables with stress on the first; ending /dʒ/.' },
    },
    {
      term: 'stubble', phonetic: '/ˈstʌbl/', partOfSpeech: 'n.', sentenceIndex: 41,
      meaning: { zh: '作物残茬，留茬', en: 'the short stalks left in the field after harvest' },
      usage: { zh: '不可数；crop stubble、leave stubble on the surface。', en: 'Uncountable: crop stubble, leave stubble on the surface.' },
      collocations: ['crop stubble', 'leave stubble', 'stubble cover'],
      example: { en: 'Leaving stubble on the surface shields the soil after harvest.', zh: '收割后留茬覆盖地表保护土壤。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈstʌ/；结尾 /bl/。', en: 'Two syllables, stress on the first; ending /bl/.' },
    },
    {
      term: 'rotating', phonetic: '/rəʊˈteɪtɪŋ/', partOfSpeech: 'v.', sentenceIndex: 42,
      meaning: { zh: '轮作，轮换种植', en: 'growing different crops on the same field in turn' },
      usage: { zh: '现在分词；rotating crops、crop rotation。名词 rotation。', en: 'Present participle: rotating crops, crop rotation. The noun is rotation.' },
      collocations: ['rotating crops', 'crop rotation', 'rotating different crops'],
      example: { en: 'Rotating crops year by year keeps the soil from draining one nutrient.', zh: '逐年轮作避免土壤耗尽某一种养分。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈteɪ/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'stick together', sentenceIndex: 3,
      meaning: { zh: '黏结在一起', en: 'to hold together as a clump rather than fall apart' },
      usage: { zh: '可分短语动词；particles stick together。', en: 'Separable: particles stick together.' },
      example: { en: 'Soil particles stick together into small crumbs.', zh: '土壤颗粒黏结成小团粒。' },
    },
    {
      phrase: 'break down', sentenceIndex: 17,
      meaning: { zh: '分解（有机物）', en: 'to decompose matter into simpler substances' },
      usage: { zh: '可分；microorganisms break down organic matter。', en: 'Separable: microorganisms break down organic matter.' },
      example: { en: 'Microorganisms break down organic matter into nutrients.', zh: '微生物把有机质分解成养分。' },
    },
    {
      phrase: 'holds less water', sentenceIndex: 31,
      meaning: { zh: '保水能力变差', en: 'to retain less moisture than healthy soil' },
      usage: { zh: 'hold 此处指保有；soil holds less water。', en: 'Here hold means retain: soil holds less water.' },
      example: { en: 'Soil without organic matter holds less water and dries fast.', zh: '缺有机质的土壤保水差、干得快。' },
    },
    {
      phrase: 'disturbs the soil', sentenceIndex: 35,
      meaning: { zh: '翻动、扰动土壤', en: 'to turn or break the soil surface during tillage' },
      usage: { zh: 'disturb 此处指耕作扰动；disturb the soil as little as possible。', en: 'Here disturb means tillage disturbance: disturb the soil as little as possible.' },
      example: { en: 'Reduced tillage disturbs the soil as little as possible.', zh: '少耕尽量少扰动土壤。' },
    },
    {
      phrase: 'on a regular basis', sentenceIndex: 40,
      meaning: { zh: '定期地', en: 'done again at steady intervals rather than once' },
      usage: { zh: '介词短语作状语；add compost on a regular basis。', en: 'Adverbial phrase: add compost on a regular basis.' },
      example: { en: 'Compost is added on a regular basis to restore matter.', zh: '定期施堆肥以恢复有机质。' },
    },
    {
      phrase: 'year by year', sentenceIndex: 42,
      meaning: { zh: '逐年地，一年接一年', en: 'one year after another, season after season' },
      usage: { zh: '短语作状语；rotate crops year by year。', en: 'Adverbial: rotate crops year by year.' },
      example: { en: 'Different crops follow one another year by year.', zh: '不同作物逐年轮换种植。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格题按行首定位成分', en: 'Use the row label to locate each gap' },
      body: {
        zh: '第 31–34 题按团粒、有机质、微生物、耕作四行推进。听前先看首列成分名，听到 aggregates、organic matter、microorganisms、tillage 就知道对应哪一行；空格填的是该成分的作用对象或产物，别把产物填进被分解对象的空。',
        en: 'Items 31 to 34 follow aggregates, organic matter, microorganisms and tillage. Read the row labels first, and when you hear aggregates, organic matter, microorganisms or tillage you know which row matches. The gap asks for the object or product of that component, so do not put the product into the object gap.',
      },
    },
    {
      title: { zh: '机理题抓定义与因果句', en: 'Catch the defining and causal sentences' },
      body: {
        zh: '第 35 题答案在 lets air and water reach the roots 之后，第 36 题在 holds less water, dries out quickly 之后。讲座讲机理时常先抛问题再给因果句，听到 Why、What happens、Which approach 这类题干词，下一句的主句就是答案。',
        en: 'Item 35 follows lets air and water reach the roots, and item 36 follows holds less water, dries out quickly. Lectures often pose a question then give a causal sentence; after Why, What happens or Which approach, the main clause of the next sentence is the answer.',
      },
    },
    {
      title: { zh: '多选题区分推荐与不利做法', en: 'Separate recommended practices from harmful ones' },
      body: {
        zh: '第 38–40 题三项措施按 first、second、third 依次列出；深耕、月度除草剂、收后压实土壤在后面被逐项说成破坏团粒或裸露地表。听到 keeps breaking、leaves the soil bare、presses the pores shut 这类否定信号，先划掉对应选项。',
        en: 'Items 38 to 40 list the three recommendations with first, second and third. Deep ploughing, monthly weedkiller and post-harvest compaction are later described as breaking crumbs or leaving soil bare. On signals such as keeps breaking, leaves the soil bare and presses the pores shut, cross out the matching option first.',
      },
    },
  ],
};
