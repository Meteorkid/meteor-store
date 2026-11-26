import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 44 · Part 4 — 光污染（单人讲座，澳式口音）。原创仿真材料，非官方真题。
 *
 * 讲座顺序：主要来源、生态影响、观测损失、照明设计（表格 31–34）→ 天光成因、
 * 对野生动物的影响、减光设计（单选 35–37）→ 三项实用照明要点（多选 38–40）。
 * 开场用现场现象观察，不用 Today's lecture is about 句式。
 */
export const test44Part4: ListeningLesson = {
  slug: 'test-44-part-4',
  part: 4,
  status: 'published',
  title: { zh: '光污染', en: 'Light pollution' },
  summary: {
    zh: '讲座从城镇上空的光晕讲起：主要来源是街道照明，未遮蔽的灯把光抛向天空；强光干扰鸟类迁徙，也改变昆虫、蛙类和蝙蝠的觅食繁殖节律；天文学家对暗弱天体的观测因此变差。减少浪费光的设计是把灯光向下照的遮蔽灯具。三项实用要点：遮蔽灯具削减上射光、在可行处用更暖更暗的光、保护暗夜储备地不受新开发侵占。',
    en: 'The lecture opens with the glow over towns. Street lights are the main source; unshielded lamps spill light upward. Bright light disrupts bird migration and shifts feeding and breeding rhythms; astronomers lose faint-object observations. Shielded lamps aimed down cut waste light. The three points: shield fixtures, use dimmer warmer light, protect dark reserves from new development.',
  },
  accent: { zh: '讲师为澳式口音，术语放慢，段落之间有停顿。', en: 'The lecturer has an Australian accent, slows key terms and pauses between sections.' },
  speechRate: '+3%',
  cast: [
    { id: 'lecturer', label: 'LECTURER', gender: 'male', voice: 'en-AU-WilliamMultilingualNeural' },
  ],
  sections: [
    {
      kind: 'completion',
      instruction: 'Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      wordLimit: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      columns: ['Feature', 'Detail'],
      rows: [
        { lead: 'Main source of town glow', cells: [[{ text: 'the street ' }, { blank: 31 }]] },
        { lead: 'Ecological effect', cells: [[{ text: 'disrupts bird ' }, { blank: 32 }]] },
        { lead: 'Observation loss', cells: [[{ text: 'poorer astronomers’ ' }, { blank: 33 }]] },
        { lead: 'Helpful lighting design', cells: [[{ text: 'shielded ' }, { blank: 34 }]] },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 35,
          stem: 'What causes most sky glow near towns?',
          options: [
            { key: 'A', text: 'Unshielded street lamps spilling light upward' },
            { key: 'B', text: 'Shop signs reflecting off wet pavements' },
            { key: 'C', text: 'House windows left open at night' },
          ],
        },
        {
          number: 36,
          stem: 'How does extra night light affect wildlife?',
          options: [
            { key: 'A', text: 'It changes feeding and breeding rhythms' },
            { key: 'B', text: 'It forces all animals to sleep all day' },
            { key: 'C', text: 'It improves the growth of night flowers' },
          ],
        },
        {
          number: 37,
          stem: 'Which lamp design reduces the light wasted on the sky?',
          options: [
            { key: 'A', text: 'Lamps that direct light down to the ground' },
            { key: 'B', text: 'Lamps with open tops on tall poles' },
            { key: 'C', text: 'Lamps that shine across the road only' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE practical lighting points does the lecturer mention? Choose THREE letters, A–E.',
      select: 3,
      stem: 'Which THREE practical lighting points are mentioned?',
      options: [
        { key: 'A', text: 'shield fixtures to cut upward spill' },
        { key: 'B', text: 'use warmer, dimmer light where possible' },
        { key: 'C', text: 'protect dark reserves from new development' },
        { key: 'D', text: 'leave every street lamp on all night' },
        { key: 'E', text: 'point lamps toward the sky' },
      ],
    },
  ],
  answers: [
    {
      number: 31, accepted: ['lights'], evidence: 21,
      explanation: {
        zh: '定位句 21：The main source of the town glow is the street lights above the road。城镇光晕主要来自街道照明，填 lights。',
        en: 'Sentence 21: the main source is "the street lights above the road", so fill lights.',
      },
    },
    {
      number: 32, accepted: ['migration'], evidence: 22,
      explanation: {
        zh: '定位句 22：The clearest ecological effect described tonight is the disruption of bird migration。生态影响是干扰鸟类迁徙，填 migration。',
        en: 'Sentence 22: the clearest effect is "the disruption of bird migration", so fill migration.',
      },
    },
    {
      number: 33, accepted: ['observations'], evidence: 23,
      explanation: {
        zh: '定位句 23：The loss for sky watchers is poorer observations of faint objects from the town。观测损失是对暗弱天体的观测变差，填 observations。',
        en: 'Sentence 23: sky watchers lose "poorer observations of faint objects", so fill observations.',
      },
    },
    {
      number: 34, accepted: ['lamps'], evidence: 24,
      explanation: {
        zh: '定位句 24：The lighting design that helps is the shielded lamps aimed down at the ground。有助设计是向下照的遮蔽灯具，填 lamps。',
        en: 'Sentence 24: the helpful design is "the shielded lamps aimed down", so fill lamps.',
      },
    },
    {
      number: 35, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：Unshielded street lamps spill light upward, and that upward scatter is what brightens the sky。天光主要来自未遮蔽灯具的上射光，对应 A。湿路面反光、开窗均未提及。',
        en: 'Sentence 27: unshielded lamps "spill light upward", matching A. Wet reflections and open windows are not mentioned.',
      },
    },
    {
      number: 36, accepted: ['A'], evidence: 29,
      explanation: {
        zh: '定位句 29：It changes the feeding and breeding rhythms animals follow through the seasons。强光改变觅食与繁殖节律，对应 A。全天睡眠、促进夜花生长均被排除。',
        en: 'Sentence 29: light changes "feeding and breeding rhythms", matching A. Daylong sleep and night-flower growth are ruled out.',
      },
    },
    {
      number: 37, accepted: ['A'], evidence: 32,
      explanation: {
        zh: '定位句 32：Lamps that direct light down to the ground keep the pavement lit with little upward spill。向下照的灯具减少浪费光，对应 A。敞顶高杆灯、只照路面横向都不是减光设计。',
        en: 'Sentence 32: lamps that "direct light down to the ground" cut upward spill, matching A. Open-top poles and cross-road shine are not waste-light designs.',
      },
    },
    {
      number: 38, accepted: ['A'], evidence: 35,
      explanation: {
        zh: '定位句 35：First, shield the fixtures so the upward spill is cut before it reaches the sky。遮蔽灯具削减上射光是要点一，对应 A。',
        en: 'Sentence 35: shield fixtures "so the upward spill is cut", matching A.',
      },
    },
    {
      number: 39, accepted: ['B'], evidence: 36,
      explanation: {
        zh: '定位句 36：Second, use warmer and dimmer light wherever the task allows that level of brightness。可行处用更暖更暗的光是要点二，对应 B。',
        en: 'Sentence 36: use "use warmer and dimmer light wherever the task allows that level of brightness", matching B.',
      },
    },
    {
      number: 40, accepted: ['C'], evidence: 37,
      explanation: {
        zh: '定位句 37：Third, protect the remaining dark reserves from any new roadside development nearby。保护暗夜储备地是要点三，对应 C；D 的整夜亮灯与 E 的朝天照射在句 38、39 被否定。',
        en: 'Sentence 37: protect "protect the remaining dark reserves from any new roadside development nearby", matching C. All-night lamps in D and skyward shine in E are rejected in sentences 38 and 39.',
      },
    },
  ],
  transcript: [
    { speaker: 'lecturer', text: 'Look up over any town on a clear night, and the faint glow above the roofs often hides the stars you would see in the country.' },
    { speaker: 'lecturer', text: 'That glow is light pollution, the wasteful or misplaced light that changes the dark around us.' },
    { speaker: 'lecturer', text: 'Most of it comes from street lights along roads and public squares.' },
    { speaker: 'lecturer', text: 'Unshielded lamps send light straight upward, and that scatter paints the sky pale even far from the town.' },
    { speaker: 'lecturer', text: 'Shop signs and car parks add their own beams, but the street network remains the main source.' },
    { speaker: 'lecturer', text: 'Beyond the town, the dark strips that survive between roads matter to animals after dark.' },
    { speaker: 'lecturer', text: 'Many birds navigate by the stars and the moon, and a bright sky can pull them off their route.' },
    { speaker: 'lecturer', text: 'Coastal seabirds may circle lit cliffs instead of returning to their burrows.' },
    { speaker: 'lecturer', text: 'Inland, insects gather around a single lamp and miss the flowers they feed on by night.' },
    { speaker: 'lecturer', text: 'These changes disrupt bird migration, as confused flocks settle where they would not normally rest.' },
    { speaker: 'lecturer', text: 'Frogs and bats also shift their hunting hours when the light around their ponds stays bright.' },
    { speaker: 'lecturer', text: 'For people who watch the sky, the same glow blurs the faint objects astronomers track.' },
    { speaker: 'lecturer', text: 'Observations of distant galaxies and old star clusters grow harder each year as the sky brightens.' },
    { speaker: 'lecturer', text: 'Amateur telescope groups report fewer faint stars visible from the town edge.' },
    { speaker: 'lecturer', text: 'Even a small site near a busy road loses the deep sky view that once drew visitors.' },
    { speaker: 'lecturer', text: 'The good news is that the causes are built by design, so design can also fix them.' },
    { speaker: 'lecturer', text: 'A lamp that directs light down onto the ground cuts the spill that reaches the sky.' },
    { speaker: 'lecturer', text: 'These shielded lamps keep the pavement lit while sending little upward waste.' },
    { speaker: 'lecturer', text: 'Changing the bulb colour and level also reduces the harsh glare near houses.' },
    { speaker: 'lecturer', text: 'Planning rules can hold back new development close to the remaining dark reserves.' },
    { speaker: 'lecturer', text: 'We can now match the table details in a clear order.' },
    { speaker: 'lecturer', text: 'The main source of the town glow is the street lights above the road.' },
    { speaker: 'lecturer', text: 'The clearest ecological effect described tonight is the disruption of bird migration.' },
    { speaker: 'lecturer', text: 'The loss for sky watchers is poorer observations of faint objects from the town.' },
    { speaker: 'lecturer', text: 'The lighting design that helps is the shielded lamps aimed down at the ground.' },
    { speaker: 'lecturer', text: 'Now three questions about how light moves and what it does.' },
    { speaker: 'lecturer', text: 'What produces most of the sky glow close to a town?' },
    { speaker: 'lecturer', text: 'Unshielded street lamps spill light upward, and that upward scatter is what brightens the sky.' },
    { speaker: 'lecturer', text: 'How does the extra night light affect wildlife?' },
    { speaker: 'lecturer', text: 'It changes the feeding and breeding rhythms animals follow through the seasons.' },
    { speaker: 'lecturer', text: 'A bat may delay its evening hunt, and a bird may nest in the lit edge of the wood.' },
    { speaker: 'lecturer', text: 'Which lamp design reduces the light wasted on the sky?' },
    { speaker: 'lecturer', text: 'Lamps that direct light down to the ground keep the pavement lit with little upward spill.' },
    { speaker: 'lecturer', text: 'Tall poles with open tops tend to throw light into the air rather than onto the path.' },
    { speaker: 'lecturer', text: 'We should pick three practical points for better local lighting.' },
    { speaker: 'lecturer', text: 'First, shield the fixtures so the upward spill is cut before it reaches the sky.' },
    { speaker: 'lecturer', text: 'Second, use warmer and dimmer light wherever the task allows that level of brightness.' },
    { speaker: 'lecturer', text: 'Third, protect the remaining dark reserves from any new roadside development nearby.' },
    { speaker: 'lecturer', text: 'Leaving every street lamp on through the whole night would only add to the waste.' },
    { speaker: 'lecturer', text: 'Pointing lamps toward the sky defeats the purpose of keeping the ground safe.' },
    { speaker: 'lecturer', text: 'The timing of lighting can matter as much as the fixture chosen.' },
    { speaker: 'lecturer', text: 'Many car parks and paths dim after the last visitors leave, rather than burn all night.' },
    { speaker: 'lecturer', text: 'Parks close dark after dusk, and that quiet helps the animals that live there.' },
    { speaker: 'lecturer', text: 'Schools and sports fields switch off floodlights once the training sessions end.' },
    { speaker: 'lecturer', text: 'Local councils review lamp heights and angles as part of their street maintenance.' },
    { speaker: 'lecturer', text: 'Citizen groups can record the sky brightness from their own garden over a year.' },
    { speaker: 'lecturer', text: 'Those records help planners see where the dark patches are being lost.' },
    { speaker: 'lecturer', text: 'The darkest reserves sit beyond the reach of the town spill, and they need protection first.' },
    { speaker: 'lecturer', text: 'A dark sky reserve keeps its night quiet for both wildlife and human visitors.' },
    { speaker: 'lecturer', text: 'Lighting policy balances safety on the path against the need to preserve the dark above.' },
    { speaker: 'lecturer', text: 'No design removes every lamp, but it can cut the waste that reaches the sky.' },
    { speaker: 'lecturer', text: 'The next session will look at how coastal light affects nesting terns on the dunes.' },
  ],
  vocabulary: [
    {
      term: 'lights', phonetic: '/laɪts/', partOfSpeech: 'n.', sentenceIndex: 21,
      meaning: { zh: '路灯，街道照明', en: 'the lamps along roads that form the main glow' },
      usage: { zh: '可数复数；street lights、the street lights above。单数 light。', en: 'Plural countable: street lights; the singular is light.' },
      collocations: ['street lights', 'the street lights above', 'the street network'],
      example: { en: 'The street lights are the main source of glow.', zh: '街道照明是光晕主要来源。' },
      listening: { zh: '单音节，结尾 /ts/ 清辅音。', en: 'One syllable with a final /ts/ cluster.' },
    },
    {
      term: 'migration', phonetic: '/maɪˈɡreɪʃn/', partOfSpeech: 'n.', sentenceIndex: 22,
      meaning: { zh: '迁徙（鸟类定期移动）', en: 'the seasonal movement of birds between regions' },
      usage: { zh: '不可数；bird migration、disrupt migration。动词 migrate。', en: 'Uncountable: bird migration; the verb is migrate.' },
      collocations: ['bird migration', 'disrupt migration', 'the migration route'],
      example: { en: 'Bright light disrupts bird migration.', zh: '强光干扰鸟类迁徙。' },
      listening: { zh: '三个音节，重音在第二音节 /ˈɡreɪ/。', en: 'Three syllables with stress on the second.' },
    },
    {
      term: 'observations', phonetic: '/ˌɒbzəˈveɪʃnz/', partOfSpeech: 'n.', sentenceIndex: 23,
      meaning: { zh: '观测（对暗弱天体的记录）', en: 'the recorded sightings astronomers make of faint objects' },
      usage: { zh: '可数复数；poor observations、make observations。单数 observation。', en: 'Plural countable: make observations; the singular is observation.' },
      collocations: ['poor observations', 'astronomers’ observations', 'faint observations'],
      example: { en: 'The town glow worsens observations of faint stars.', zh: '城镇光晕使暗星观测变差。' },
      listening: { zh: '四个音节，重音在第三音节 /ˈveɪ/。', en: 'Four syllables with stress on the third.' },
    },
    {
      term: 'lamps', phonetic: '/læmps/', partOfSpeech: 'n.', sentenceIndex: 24,
      meaning: { zh: '灯具（街灯装置）', en: 'the fitted light units along streets and paths' },
      usage: { zh: '可数复数；shielded lamps、street lamps。单数 lamp。', en: 'Plural countable: shielded lamps; the singular is lamp.' },
      collocations: ['shielded lamps', 'street lamps', 'the lamp design'],
      example: { en: 'The shielded lamps are aimed down at the ground.', zh: '遮蔽灯具向下照向地面。' },
      listening: { zh: '单音节，结尾 /ps/ 清辅音。', en: 'One syllable with a final /ps/ cluster.' },
    },
    {
      term: 'shielded', phonetic: '/ˈʃiːldɪd/', partOfSpeech: 'adj.', sentenceIndex: 17,
      meaning: { zh: '遮蔽的（挡住上射光）', en: 'fitted with a cover that cuts light spilling upward' },
      usage: { zh: '形容词；shielded lamps、shield the fixtures。名词 shield。', en: 'Adjective: shielded lamps; the noun is shield.' },
      collocations: ['shielded lamps', 'shield the fixtures', 'the shielded design'],
      example: { en: 'Shielded lamps send little upward waste.', zh: '遮蔽灯具几乎不上射浪费光。' },
      listening: { zh: '两个音节，重音在第一音节 /ˈʃiː/。', en: 'Two syllables with first-syllable stress.' },
    },
    {
      term: 'wildlife', phonetic: '/ˈwaɪldlaɪf/', partOfSpeech: 'n.', sentenceIndex: 28,
      meaning: { zh: '野生动物（夜间活动的动物）', en: 'the animals affected by night light' },
      usage: { zh: '不可数；night wildlife、wildlife rhythms。', en: 'Uncountable: wildlife rhythms.' },
      collocations: ['night wildlife', 'wildlife affected', 'wildlife and visitors'],
      example: { en: 'Extra light changes wildlife feeding rhythms.', zh: '额外灯光改变野生动物觅食节律。' },
      listening: { zh: '双音节复合词，重音在第一部分。', en: 'Two-part compound with first-part stress.' },
    },
    {
      term: 'reserves', phonetic: '/rɪˈzɜːvz/', partOfSpeech: 'n.', sentenceIndex: 37,
      meaning: { zh: '储备地，保留区（暗夜区域）', en: 'the protected dark areas kept free of new spill' },
      usage: { zh: '可数复数；dark reserves、dark sky reserve。单数 reserve。', en: 'Plural countable: dark reserves; the singular is reserve.' },
      collocations: ['dark reserves', 'the dark sky reserve', 'protect the reserves'],
      example: { en: 'Protect the dark reserves from new development.', zh: '保护暗夜储备地不受新开发侵占。' },
      listening: { zh: '双音节，重音在第二音节 /ˈzɜː/。', en: 'Two syllables with second-syllable stress.' },
    },
  ],
  expressions: [
    {
      phrase: 'look up', sentenceIndex: 0,
      meaning: { zh: '抬头看（天空）', en: 'to raise your eyes toward the sky' },
      usage: { zh: '不及物；look up over the town、look up at the stars。', en: 'Intransitive: look up over the town.' },
      example: { en: 'Look up over the town on a clear night.', zh: '晴朗夜晚抬头望向城镇上空。' },
    },
    {
      phrase: 'spill light upward', sentenceIndex: 27,
      meaning: { zh: '向上溢散（浪费光）', en: 'light thrown up toward the sky rather than down' },
      usage: { zh: '动词短语；spill upward、upward spill。', en: 'Verb phrase: spill upward; the noun is upward spill.' },
      example: { en: 'Unshielded lamps spill light upward.', zh: '未遮蔽灯具把光抛向天空。' },
    },
    {
      phrase: 'feed on', sentenceIndex: 8,
      meaning: { zh: '以……为食（夜间取食）', en: 'to take food from a source after dark' },
      usage: { zh: '及物；insects feed on flowers、feed on nectar。', en: 'Transitive: feed on flowers.' },
      example: { en: 'Insects miss the flowers they feed on by night.', zh: '昆虫错过夜间取食的花。' },
    },
    {
      phrase: 'hold back', sentenceIndex: 19,
      meaning: { zh: '限制，阻止（新开发）', en: 'to keep new development out of the reserve' },
      usage: { zh: '及物；hold back development、hold back the spill。', en: 'Transitive: hold back development.' },
      example: { en: 'Rules hold back development near dark reserves.', zh: '规则限制暗夜储备地旁的开发。' },
    },
    {
      phrase: 'burn all night', sentenceIndex: 41,
      meaning: { zh: '整夜亮着（无人使用）', en: 'to stay lit through the whole night unused' },
      usage: { zh: '动词短语；lamps burn all night、burn through the night。', en: 'Verb phrase: burn all night.' },
      example: { en: 'Paths dim after visitors leave, rather than burn all night.', zh: '步道在游客离开后调暗，而非整夜亮灯。' },
    },
  ],
  tips: [
    {
      title: { zh: '表格按来源、影响、损失、设计填词', en: 'Fill source, effect, loss and design' },
      body: {
        zh: '四空依次是 lights、migration、observations、lamps。听到 main source、street 记来源，disrupts、bird 记生态影响，observations、sky watchers 记观测损失，shielded、aimed down 记设计；题干已给 street、bird 等引导词，不要重复写。',
        en: 'The four blanks are lights, migration, observations and lamps. Note the source after main source and street, the effect after disrupts and bird, the loss after observations and sky watchers, and the design after shielded and aimed down. Do not repeat printed leads such as street and bird.',
      },
    },
    {
      title: { zh: '单选定成因、影响与设计', en: 'Pick causes, effects and designs' },
      body: {
        zh: '第 35 题天光成因是未遮蔽灯具上射；第 36 题对野生动物的影响是改变觅食繁殖节律；第 37 题减光设计是灯光向下照。湿路反光、开窗、全天睡眠、夜花生长、敞顶高杆灯都是干扰项。',
        en: 'Item 35 glow comes from unshielded upward spill; item 36 wildlife effects are feeding and breeding rhythms; item 37 waste-light design aims lamps down. Wet reflections, open windows, daylong sleep, night flowers and open-top poles are distractors.',
      },
    },
    {
      title: { zh: '多选排除整夜亮灯与朝天照射', en: 'Rule out all-night and skyward lighting' },
      body: {
        zh: '三项入选：遮蔽灯具削减上射光、可行处用更暖更暗的光、保护暗夜储备地。句 38、39 明确否定整夜留灯和朝天照射；听到 leave every lamp on、point lamps toward the sky 就划掉对应项。',
        en: 'The three are shielding fixtures, warmer dimmer light where possible, and protecting dark reserves. Sentences 38 and 39 reject all-night lamps and skyward shine; cross out options at leave every lamp on and point lamps toward the sky.',
      },
    },
  ],
};
