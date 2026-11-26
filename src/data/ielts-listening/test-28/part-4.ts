import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 28 · Part 4 — 冰川讲座（单人，英式口音）。原创仿真材料，非官方真题。
 *
 * 结构：积雪压实成冰、夏季表面消融、自重驱动流动与 U 型谷（笔记 31–34）→
 * 下坡动力、冰川末端与对海平面的影响（单选 35–37）→ 床岩擦痕、侧碛与谷地形态对应（配对 38–40）。
 * 题块顺序与录音一致；讲座含定义、机制、例子与地貌证据。
 */
export const test28Part4: ListeningLesson = {
  slug: 'test-28-part-4',
  part: 4,
  status: 'published',
  title: { zh: '冰川', en: 'Glaciers' },
  summary: {
    zh: '一场关于冰川的讲座：积雪逐年压实成粒雪再转为冰，高海拔积累区与夏季消融区如何分界，冰在自重与融水润滑下沿坡流动，留下擦痕、侧碛和 U 型谷等地貌证据，以及陆地上冰川消融如何补给河流并影响全球海平面。',
    en: 'A lecture on glaciers: snow compacts into firn and then ice, how the high accumulation zone meets the summer ablation zone, how ice flows downhill under its own weight with meltwater lubrication, the evidence left as striations, moraines and U-shaped valleys, and how land glacier melt feeds rivers and affects global sea level.',
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
        { lead: 'Snow compacts into a dense layer before turning to ice', cells: [[{ blank: 31 }]] },
        { lead: 'Summer melting happens at the', cells: [[{ blank: 32 }]] },
        { lead: 'The ice moves under its own', cells: [[{ blank: 33 }]] },
        { lead: 'Glaciers carve U-shaped', cells: [[{ blank: 34 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'Why does glacier ice flow downhill?',
          options: [
            { key: 'A', text: 'wind pressure pushes the surface snow toward the valley floor' },
            { key: 'B', text: 'gravity pulls on the ice’s weight, helped by meltwater at the bed' },
            { key: 'C', text: 'the summer sun melts the lowest layer and lifts the ice upward' },
          ],
        },
        {
          number: 36,
          stem: 'What marks the lower end of a glacier?',
          options: [
            { key: 'A', text: 'the terminus, where melting matches the new ice arriving' },
            { key: 'B', text: 'the highest snowfield feeding the accumulation zone' },
            { key: 'C', text: 'the band where meltwater streams enter the sea' },
          ],
        },
        {
          number: 37,
          stem: 'What is the main sea-level contribution from glaciers?',
          options: [
            { key: 'A', text: 'floating sea ice melting adds most of the rise' },
            { key: 'B', text: 'land glaciers release meltwater that runs into the ocean' },
            { key: 'C', text: 'calved icebergs trap freshwater inside the polar ocean' },
          ],
        },
      ],
    },
    {
      kind: 'matching',
      instruction: 'What does each piece of landscape evidence show? Choose the correct letter, A–F.',
      options: [
        { key: 'A', text: 'a carved U-shaped valley' },
        { key: 'B', text: 'scratched bedrock with fine lines' },
        { key: 'C', text: 'piled rock debris at the glacier edge' },
        { key: 'D', text: 'a smooth erratic boulder far from its source' },
        { key: 'E', text: 'dust bubbles inside an ice core' },
        { key: 'F', text: 'a flat meltwater pool on the surface' },
      ],
      items: [
        { number: 38, text: 'bedrock evidence of the ice passing' },
        { number: 39, text: 'material dropped at the glacier side' },
        { number: 40, text: 'valley shape left after ice retreats' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['firn'], evidence: 4,
      explanation: {
        zh: '定位句 4：The dense, half-compacted layer between snow and ice is known as firn, before it turns into solid glacier ice。积雪与冰之间的致密层是粒雪 firn；句 3 的 crystals 是雪晶，不是这个中间层名称。',
        en: 'Sentence 4: "The dense, half-compacted layer between snow and ice is known as firn, before it turns into solid glacier ice". The compacted middle layer is firn. Crystals in sentence 3 are snow grains, not the layer’s name.',
      },
    },
    {
      number: 32, accepted: ['surface'], evidence: 8,
      explanation: {
        zh: '定位句 8：Summer melting happens at the surface, where sunlight warms the top layer。夏季消融发生在表面 surface；句 9 的 meltwater streams 是融水去向，不是消融位置。',
        en: 'Sentence 8: "Summer melting happens at the surface, where sunlight warms the top layer". Summer loss occurs at the surface. Meltwater streams in sentence 9 are where water goes, not where melting happens.',
      },
    },
    {
      number: 33, accepted: ['weight'], evidence: 14,
      explanation: {
        zh: '定位句 14：Under its own weight, the deep ice is squeezed until it behaves like a very slow fluid。冰在自重 weight 下被挤压变形；句 16 的 meltwater 是润滑条件，不是驱动冰体的压力来源。',
        en: 'Sentence 14: "Under its own weight, the deep ice is squeezed until it behaves like a very slow fluid". Ice deforms under its own weight. Meltwater in sentence 16 is a lubricant, not the pressure driving the mass.',
      },
    },
    {
      number: 34, accepted: ['valleys'], evidence: 25,
      explanation: {
        zh: '定位句 25：the moving ice grinds the original V-shaped stream valley into smooth U-shaped valleys。冰川磨出 U 型谷 valleys；句 24 的 moraine 是冰碛堆，不是谷地形态。',
        en: 'Sentence 25: "the moving ice grinds the original V-shaped stream valley into smooth U-shaped valleys". Moving ice produces U-shaped valleys. The moraine in sentence 24 is piled debris, not a valley shape.',
      },
    },
    {
      number: 35, accepted: ['B'], evidence: 31,
      explanation: {
        zh: '定位句 31：The key force is gravity acting on the ice’s own weight, combined with the slippery layer of meltwater at the bed。重力加压、融水润滑对应 B；A 的风力推动和 C 的阳光抬升在讲解中都没有出现。',
        en: 'Sentence 31: "The key force is gravity acting on the ice’s own weight, combined with the slippery layer of meltwater at the bed". Gravity plus bed meltwater match B. Wind pressure in A and sun lifting in C are never mentioned.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 35,
      explanation: {
        zh: '定位句 35：The terminus is the point where melting balances the new ice arriving from up-valley。冰川末端 terminus 是消融与新冰到达平衡处，对应 A；B 的最高雪场属于积累区，C 的融水入海带在讲解中未出现。',
        en: 'Sentence 35: "The terminus is the point where melting balances the new ice arriving from up-valley". The terminus balances melting with new ice, matching A. The highest snowfield in B belongs to the accumulation zone, and meltwater entering the sea in C is never mentioned.',
      },
    },
    {
      number: 37, accepted: ['B'], evidence: 38,
      explanation: {
        zh: '定位句 38：When land glaciers melt, the water runs into rivers and eventually into the ocean, raising the global sea level。陆地冰川融水汇入海洋对应 B；A 的漂浮海冰按句 39 排开体积、融化后贡献很小，C 的冰山困住淡水在讲解中未出现。',
        en: 'Sentence 38: "When land glaciers melt, the water runs into rivers and eventually into the ocean, raising the global sea level". Land glacier meltwater reaches the ocean, matching B. Floating sea ice in A displaces its volume in sentence 39 and adds little, and trapped freshwater in C is never mentioned.',
      },
    },
    {
      number: 38, accepted: ['B'], evidence: 43,
      explanation: {
        zh: '定位句 43：Scratched bedrock with fine lines records the direction of the glacier as it passed over the rock。带细纹的床岩擦痕对应 B；D 的漂砾是孤立石块，不是床岩痕迹。',
        en: 'Sentence 43: "Scratched bedrock with fine lines records the direction of the glacier as it passed over the rock". Fine-lined bedrock scratches match B. The erratic boulder in D is a loose stone, not a bedrock mark.',
      },
    },
    {
      number: 39, accepted: ['C'], evidence: 44,
      explanation: {
        zh: '定位句 44：Piled rock debris at the glacier edge marks the moraine, where frozen-on material was dropped at the side。冰缘堆积岩屑对应 C；E 的冰芯气泡是内部记录，不是侧碛物。',
        en: 'Sentence 44: "Piled rock debris at the glacier edge marks the moraine, where frozen-on material was dropped at the side". Edge debris piles match C. Bubbles in the core in E are an internal record, not side debris.',
      },
    },
    {
      number: 40, accepted: ['A'], evidence: 45,
      explanation: {
        zh: '定位句 45：The carved U-shaped valley shows the broad channel the ice cut through once the original river valley was widened。凿出的 U 型谷对应 A；F 的表面融水塘是临时水体，不是冰退后的谷地形态。',
        en: 'Sentence 45: "The carved U-shaped valley shows the broad channel the ice cut through once the original river valley was widened". The carved U-valley matches A. The surface pool in F is temporary water, not the valley shape after retreat.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'The ice in a typical valley glacier can be hundreds of metres thick, yet it creeps downhill every single year.' },
    { speaker: 'lecturer', text: 'We will look at how glaciers grow, how they move, and what they leave behind on the land.' },
    { speaker: 'lecturer', text: 'A glacier begins as snow that falls year after year in high mountains or near the poles.' },
    { speaker: 'lecturer', text: 'Each new layer presses on the one below, and over time the snow crystals pack more tightly.' },
    { speaker: 'lecturer', text: 'The dense, half-compacted layer between snow and ice is known as firn, before it turns into solid glacier ice.' },
    { speaker: 'lecturer', text: 'Accumulation is the part of the glacier where snow adds more mass than it loses over the year.' },
    { speaker: 'lecturer', text: 'High in the valley, the slope and the cold keep most of the snow through the summer months.' },
    { speaker: 'lecturer', text: 'Lower down, temperatures rise, and the glacier enters the ablation zone, where loss exceeds gain.' },
    { speaker: 'lecturer', text: 'Summer melting happens at the surface, where sunlight warms the top layer and water runs down through cracks in the ice.' },
    { speaker: 'lecturer', text: 'Some meltwater pools on flat sections, while other streams run along the bed of the glacier itself.' },
    { speaker: 'lecturer', text: 'The ice also loses mass where pieces break off into a lake or the sea, a process called calving.' },
    { speaker: 'lecturer', text: 'When accumulation outpaces ablation, the glacier grows thicker and advances further down the valley.' },
    { speaker: 'lecturer', text: 'When melting wins instead, the glacier thins and retreats, even though the ice inside keeps flowing downhill.' },
    { speaker: 'lecturer', text: 'Now, how does ice that seems so rigid begin to move?' },
    { speaker: 'lecturer', text: 'Under its own weight, the deep ice is squeezed until it behaves like a very slow fluid rather than a solid block.' },
    { speaker: 'lecturer', text: 'Gravity pulls the mass down the slope, and the ice deforms grain by grain, without cracking all at once.' },
    { speaker: 'lecturer', text: 'At the base, meltwater acts like a lubricant, letting the glacier slide over the rock underneath.' },
    { speaker: 'lecturer', text: 'The centre of the ice usually moves fastest, while the sides drag against the valley walls.' },
    { speaker: 'lecturer', text: 'On a steep section, the ice may speed up in short surges, then settle back to a steady creep.' },
    { speaker: 'lecturer', text: 'Because the ice moves slowly, a mark dropped on the surface can take many decades to reach the lower end.' },
    { speaker: 'lecturer', text: 'At the lower end, where the ice meets the plain or the water, the glacier ends in its terminus.' },
    { speaker: 'lecturer', text: 'Beyond the terminus, no new ice arrives, and melting removes whatever ice remains.' },
    { speaker: 'lecturer', text: 'Glaciers shape the land as they travel. The rock trapped under the ice scrapes along the bed, leaving fine scratches called striations.' },
    { speaker: 'lecturer', text: 'These lines on the bedrock point in the direction the ice once flowed, even after the glacier has gone.' },
    { speaker: 'lecturer', text: 'On the sides, rocks frozen into the ice are carried along and later dropped as a ridge of debris known as a moraine.' },
    { speaker: 'lecturer', text: 'In the wider valley, the moving ice grinds the original V-shaped stream valley into smooth U-shaped valleys.' },
    { speaker: 'lecturer', text: 'After the ice retreats, this U-shape stays as clear evidence that a glacier once filled the valley.' },
    { speaker: 'lecturer', text: 'Smaller marks, such as smoothed rock and rounded boulders, help researchers match a site to past glaciation.' },
    { speaker: 'lecturer', text: 'Scientists also study the layers inside an ice core, which preserve dust, bubbles and chemistry from past climates.' },
    { speaker: 'lecturer', text: 'Each core shows how the glacier grew or shrank across hundreds of years, one layer at a time.' },
    { speaker: 'lecturer', text: 'Now let us consider why a glacier flows downhill in the first place.' },
    { speaker: 'lecturer', text: 'The key force is gravity acting on the ice’s own weight, combined with the slippery layer of meltwater at the bed.' },
    { speaker: 'lecturer', text: 'A gentle slope may move the ice only a few centimetres a year, while a steeper bed speeds the flow.' },
    { speaker: 'lecturer', text: 'Friction against the valley walls slows the sides, which is why the central band of ice travels ahead.' },
    { speaker: 'lecturer', text: 'So what marks the lower end of the glacier?' },
    { speaker: 'lecturer', text: 'The terminus is the point where melting balances the new ice arriving from up-valley, and no glacier ice continues beyond it.' },
    { speaker: 'lecturer', text: 'In retreating glaciers, the terminus climbs back up the valley, even though the internal flow still points downhill.' },
    { speaker: 'lecturer', text: 'How do these changes matter for the wider world?' },
    { speaker: 'lecturer', text: 'When land glaciers melt, the water runs into rivers and eventually into the ocean, raising the global sea level.' },
    { speaker: 'lecturer', text: 'Ice already floating in the sea displaces its own volume, so it raises the level only a little when it melts.' },
    { speaker: 'lecturer', text: 'The main sea-level contribution comes from glaciers on land, such as those in mountain ranges and polar islands.' },
    { speaker: 'lecturer', text: 'If a glacier retreats, stored freshwater is released quickly, and coastal communities may face higher storm surges.' },
    { speaker: 'lecturer', text: 'Now we can match each piece of landscape evidence to what it shows about the ice.' },
    { speaker: 'lecturer', text: 'Scratched bedrock with fine lines records the direction of the glacier as it passed over the rock.' },
    { speaker: 'lecturer', text: 'Piled rock debris at the glacier edge marks the moraine, where frozen-on material was dropped at the side.' },
    { speaker: 'lecturer', text: 'The carved U-shaped valley shows the broad channel the ice cut through once the original river valley was widened.' },
    { speaker: 'lecturer', text: 'Other signs, such as large erratic boulders far from their source, also help map past ice limits.' },
    { speaker: 'lecturer', text: 'Researchers measure glacier length and thickness each year, comparing photographs taken at the same viewpoint over decades.' },
    { speaker: 'lecturer', text: 'A short warm spell can change the surface melt, but the real retreat trend becomes clear over many seasons.' },
    { speaker: 'lecturer', text: 'Understanding glaciers matters beyond the mountains, because their meltwater feeds rivers used for farming and drinking water.' },
    { speaker: 'lecturer', text: 'That covers the basic cycle of accumulation, movement and land evidence. In the next session we will look at ice cores and past climate.' },
  ],
  vocabulary: [
    {
      term: 'accumulation', phonetic: '/əˌkjuːmjəˈleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 5,
      meaning: { zh: '积累区（积雪多于消融的冰体上段）', en: 'the upper glacier where snow gain exceeds melt loss' },
      usage: { zh: '不可数；accumulation zone。动词 accumulate。', en: 'Uncountable: accumulation zone. The verb is accumulate.' },
      collocations: ['the accumulation zone', 'snow accumulation', 'annual accumulation'],
      example: { en: 'In the accumulation zone, more snow arrives than melts each year.', zh: '积累区每年降雪多于消融。' },
      listening: { zh: '五个音节，重音在第四音节 /ˈleɪ/。', en: 'Five syllables with stress on the fourth.' },
    },
    {
      term: 'firn', phonetic: '/fɜːn/', partOfSpeech: 'n.', sentenceIndex: 4,
      meaning: { zh: '粒雪（雪与冰之间半压实的致密层）', en: 'the dense half-compacted layer between snow and glacier ice' },
      usage: { zh: '不可数；firn layer。发音类似 fern，但元音更长。', en: 'Uncountable: firn layer. Sounds like fern with a longer vowel.' },
      collocations: ['the firn layer', 'compacted firn', 'firn and ice'],
      example: { en: 'The firn turns into solid glacier ice over years of pressure.', zh: '粒雪在多年压力下变成坚实冰川冰。' },
      listening: { zh: '单音节，长元音 /ɜː/，词尾 /n/。', en: 'One syllable, long /ɜː/ and a final /n/.' },
    },
    {
      term: 'ablation', phonetic: '/əˈbleɪʃn/', partOfSpeech: 'n.', sentenceIndex: 7,
      meaning: { zh: '消融（冰川通过融化、崩解失去质量）', en: 'the loss of glacier mass through melting or breaking off' },
      usage: { zh: '不可数；ablation zone。对照 accumulation。动词 ablate。', en: 'Uncountable: ablation zone. Compare accumulation. The verb is ablate.' },
      collocations: ['the ablation zone', 'surface ablation', 'ablation exceeds gain'],
      example: { en: 'In the ablation zone, melting loses more ice than snow adds.', zh: '消融区失去的冰多于积雪补充。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈbleɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'terminus', phonetic: '/ˈtɜːmɪnəs/', partOfSpeech: 'n.', sentenceIndex: 35,
      meaning: { zh: '冰川末端（冰体与平原或水体相接处）', en: 'the lower end of a glacier where it meets plain or water' },
      usage: { zh: '可数；复数 termini 或 terminuses。另有“终点”之义。', en: 'Countable: plural termini or terminuses. It also means a finishing point.' },
      collocations: ['the glacier terminus', 'retreating terminus', 'the terminus point'],
      example: { en: 'The terminus balances melting with the new ice arriving.', zh: '末端处消融与新冰到达相平衡。' },
      listening: { zh: '三个音节，重音在第一音节，结尾 /nəs/ 轻读。', en: 'Three syllables, stressed on the first, light final /nəs/.' },
    },
    {
      term: 'striations', phonetic: '/straɪˈeɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '擦痕（冰川岩屑在床岩上留下的平行细纹）', en: 'fine parallel scratches left on bedrock by rock under the ice' },
      usage: { zh: '常用复数；rock striations。单数 striation。', en: 'Usually plural: rock striations. The singular is striation.' },
      collocations: ['bedrock striations', 'ice striations', 'fine striations'],
      example: { en: 'The striations point in the direction the ice once flowed.', zh: '擦痕指示冰川曾经的流向。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈeɪ/，开头 /straɪ/。', en: 'Three syllables, stress on the second, opening /straɪ/.' },
    },
    {
      term: 'moraine', phonetic: '/məˈreɪn/', partOfSpeech: 'n.', sentenceIndex: 44,
      meaning: { zh: '冰碛（冰缘堆积的岩石碎屑垄）', en: 'a ridge of rock debris carried and dropped at the edge of a glacier' },
      usage: { zh: '可数；side moraine、end moraine。', en: 'Countable: side moraine, end moraine.' },
      collocations: ['a ridge of moraine', 'the glacier edge moraine', 'side moraine'],
      example: { en: 'Rocks dropped at the side form a long moraine.', zh: '冰侧掉落的岩石形成长条冰碛。' },
      listening: { zh: '两个音节，重音在第二音节 /ˈreɪn/。', en: 'Two syllables with stress on the second.' },
    },
    {
      term: 'erratic', phonetic: '/ɪˈrætɪk/', partOfSpeech: 'n.', sentenceIndex: 46,
      meaning: { zh: '漂砾（被冰川带到远处的大石块）', en: 'a large boulder transported far from its original rock by ice' },
      usage: { zh: '可数；erratic boulder。作形容词时指“不规则的”。', en: 'Countable: erratic boulder. As an adjective it means irregular.' },
      collocations: ['an erratic boulder', 'glacial erratic', 'far from its source'],
      example: { en: 'The erratic sits on bedrock that does not match its stone.', zh: '漂砾所在床岩与石质并不相同。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈræt/。', en: 'Three syllables with stress on the second.' },
    },
  ],
  expressions: [
    {
      phrase: 'pack more tightly', sentenceIndex: 3,
      meaning: { zh: '压得更密实', en: 'to become compact under the weight of new layers' },
      usage: { zh: '不及物；snow crystals pack more tightly。tight 副词形式。', en: 'Intransitive: snow crystals pack more tightly. Tight is the adverb form here.' },
      example: { en: 'Older snow packs more tightly than fresh powder.', zh: '陈年雪比新雪压得更密实。' },
    },
    {
      phrase: 'acts like', sentenceIndex: 16,
      meaning: { zh: '起到……的作用，像……一样', en: 'to function as something, by resemblance' },
      usage: { zh: '及物；meltwater acts like a lubricant。', en: 'Transitive: meltwater acts like a lubricant.' },
      example: { en: 'The meltwater acts like a lubricant under the ice.', zh: '融水在冰下起到润滑作用。' },
    },
    {
      phrase: 'grain by grain', sentenceIndex: 15,
      meaning: { zh: '一粒一粒地，逐渐变形', en: 'changing slowly, one small piece at a time' },
      usage: { zh: '固定状语；类似 day by day、step by step。', en: 'Fixed adverbial, like day by day or step by step.' },
      example: { en: 'The ice deforms grain by grain without cracking.', zh: '冰逐粒变形，整体不裂开。' },
    },
    {
      phrase: 'balances the new ice', sentenceIndex: 35,
      meaning: { zh: '与新冰到达量相抵', en: 'to match the amount of new ice arriving from upstream' },
      usage: { zh: '及物；melting balances the new ice。balance 此处指“抵消”。', en: 'Transitive: melting balances the new ice. Balance means to offset here.' },
      example: { en: 'At the terminus, loss balances the new ice arriving.', zh: '末端处消融与新冰到达相抵。' },
    },
    {
      phrase: 'carved U-shaped', sentenceIndex: 45,
      meaning: { zh: '凿出的 U 型（谷地）', en: 'cut into the broad rounded profile left by ice' },
      usage: { zh: '过去分词修饰 valley；carved by the glacier。', en: 'Past participle modifies valley: carved by the glacier.' },
      example: { en: 'The carved U-shaped valley shows the ice’s broad channel.', zh: '凿出的 U 型谷显示冰流过的宽阔通道。' },
    },
    {
      phrase: 'far from', sentenceIndex: 46,
      meaning: { zh: '远离（来源地）', en: 'at a great distance from the original place' },
      usage: { zh: '介词短语；far from its source。', en: 'Prepositional phrase: far from its source.' },
      example: { en: 'The boulder rests far from its source rock.', zh: '石块所在处远离其原生岩区。' },
    },
  ],
  tips: [
    {
      title: { zh: '预测词性再听笔记答案', en: 'Predict the part of speech' },
      body: {
        zh: '第 31 空前是 dense，填物质名 firn；第 32 空前是 at the，填位置 surface；第 33 空前是 own，填抽象名词 weight；第 34 空前是 U-shaped，填地貌名词 valleys。听之前把词性和类别写在空格旁。',
        en: 'Gap 31 follows dense, so a material firn fits. Gap 32 follows at the, so a place surface fits. Gap 33 follows own, so an abstract noun weight fits. Gap 34 follows U-shaped, so a landform valleys fits. Note the predicted part of speech beside each gap.',
      },
    },
    {
      title: { zh: '配对题按地貌词去对选项', en: 'Match on landform words' },
      body: {
        zh: '配对三个证据对应三种痕迹：床岩擦痕、冰缘堆碛、U 型谷。听前各记一个地貌词：scratched bedrock、rock debris、U-shaped valley；听到岩石、碎屑、谷地时直接拿地貌词对选项，不要整句翻译。',
        en: 'The three evidence items match three marks: bedrock scratches, edge debris piles and the U-valley. Note one landform word each: scratched bedrock, rock debris, U-shaped valley. Match the landform when you hear rock, debris or a valley rather than translating whole options.',
      },
    },
    {
      title: { zh: '讲座结构信号词定位题块', en: 'Use lecture signposts' },
      body: {
        zh: 'The first source 类信号在此换成 Accumulation、ablation zone；Now how does ice move 进入运动机制；So what marks the lower end 引出末端单选；Now we can match 进入配对段。听到信号词就检查自己填到了哪个题块。',
        en: 'The opening source signal here is Accumulation and the ablation zone; Now how does ice move opens the mechanism; So what marks the lower end introduces the terminus choice; Now we can match opens the matching section. Check your place in the blocks after each signpost.',
      },
    },
  ],
};
