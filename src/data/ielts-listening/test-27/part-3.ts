import type { ListeningLesson } from '@/lib/ielts-listening/types';

/**
 * Practice Test 27 · Part 3 — 方言播客三人策划（多人讨论）。原创仿真材料，非官方真题。
 *
 * 讨论顺序：任务分工配对 → 首期选题与不念稿原因 → 设备与剪辑结构 → 版权规则 →
 * 第二期计划（多选）。题块顺序与录音顺序一致。
 */
export const test27Part3: ListeningLesson = {
  slug: 'test-27-part-3',
  part: 3,
  status: 'published',
  title: { zh: '方言播客策划', en: 'Planning a podcast on local dialects' },
  summary: {
    zh: '三位合作者讨论一档记录当地方言的播客：先把联络嘉宾、整理转写与词汇注释、音频剪辑、背景音乐版权四项任务分派到人；接着确定首期录一段可能失传的村宴致辞，说明不念稿是为保留自然口语中的方言特征；再谈外景设备、单集时长与解说结构；随后明确受访人须签署授权书、背景音乐须先查许可；最后列出第二期的三项计划：学校代际对话、相邻两镇口音对比、邀请退休广播播音员。',
    en: 'Three collaborators plan a dialect podcast, splitting four tasks: guest outreach, gloss notes, audio editing, music rights. Episode one records a village speech that may disappear; guests do not read a script, since talk shows dialect features. Equipment, length, commentary, copyright follow: speakers sign a release form. Episode two plans a school talk, a town comparison, an announcer guest.',
  },
  accent: { zh: 'Neerja 是印度口音英语，Ryan 是英国口音英语，Aria 是美国口音英语。', en: 'Neerja speaks Indian English, Ryan British English, and Aria American English.' },
  speechRate: '+8%',
  cast: [
    { id: 'neerja', label: 'NEERJA', gender: 'female', voice: 'en-IN-NeerjaNeural' },
    { id: 'ryan', label: 'RYAN', gender: 'male', voice: 'en-GB-RyanNeural' },
    { id: 'aria', label: 'ARIA', gender: 'female', voice: 'en-US-AriaNeural' },
  ],
  sections: [
    {
      kind: 'matching',
      instruction: 'Match each task with the person who handles it. Write the correct letter, A, B, C, D or E next to questions 21–24.',
      options: [
        { key: 'A', text: 'Neerja' },
        { key: 'B', text: 'Ryan' },
        { key: 'C', text: 'Aria' },
        { key: 'D', text: 'the producer' },
        { key: 'E', text: 'the research assistant' },
      ],
      items: [
        { number: 21, text: 'contacts potential guests' },
        { number: 22, text: 'writes the transcript and vocabulary notes' },
        { number: 23, text: 'edits the recorded audio' },
        { number: 24, text: 'clears background music rights' },
      ],
    },
    {
      kind: 'choice-single',
      instruction: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          number: 25,
          stem: 'What makes the first episode special?',
          options: [
            { key: 'A', text: 'It records the busiest market in the region.' },
            { key: 'B', text: 'It preserves a village speech that may disappear.' },
            { key: 'C', text: 'It features a well known radio announcer.' },
          ],
        },
        {
          number: 26,
          stem: 'Why do they avoid handing guests a script to read?',
          options: [
            { key: 'A', text: 'Natural speech reveals dialect features.' },
            { key: 'B', text: 'Scripts take too long to write in advance.' },
            { key: 'C', text: 'Guests cannot read English clearly.' },
          ],
        },
        {
          number: 27,
          stem: 'What copyright rule applies to the interviewees?',
          options: [
            { key: 'A', text: 'Their voices may be reused without permission.' },
            { key: 'B', text: 'They receive a copy of every episode after release.' },
            { key: 'C', text: 'They sign a release form before online use.' },
          ],
        },
      ],
    },
    {
      kind: 'choice-multiple',
      instruction: 'Which THREE things does the team plan to do in episode two? Choose three letters, A–E.',
      select: 3,
      stem: 'Which THREE things does the team plan to do in episode two?',
      options: [
        { key: 'A', text: 'record a school conversation between pupils and elders' },
        { key: 'B', text: 'compare speech in two neighbouring towns' },
        { key: 'C', text: 'invite a retired radio announcer' },
        { key: 'D', text: 'translate every local phrase into standard English' },
        { key: 'E', text: 'publish the raw interview files online' },
      ],
    },
  ],
  answers: [
    {
      number: 21, accepted: ['A'], evidence: 9,
      explanation: {
        zh: '定位句 9：I can take that on. I have contacts in two market towns and a farming village。联络潜在嘉宾由 Neerja 负责，对应 A。research assistant 是未被分派任务的干扰项。',
        en: 'Sentence 9: "I can take that on. I have contacts in two market towns and a farming village". Neerja handles guest outreach, matching A. The research assistant is an unused distractor.',
      },
    },
    {
      number: 22, accepted: ['B'], evidence: 11,
      explanation: {
        zh: '定位句 11：I will mark the local words and write a plain English gloss beside each one。转写与词汇注释由 Ryan 负责，对应 B。gloss 即词条旁的白话注释。',
        en: 'Sentence 11: "I will mark the local words and write a plain English gloss beside each one". Ryan owns the transcript and notes, matching B. A gloss is the plain-English note beside each local word.',
      },
    },
    {
      number: 23, accepted: ['C'], evidence: 13,
      explanation: {
        zh: '定位句 13：I will look after the recorded audio, trimming long pauses and balancing the levels。音频剪辑由 Aria 负责，对应 C。句 14 也确认 Editing is your strength, Aria。',
        en: 'Sentence 13: "I will look after the recorded audio, trimming long pauses and balancing the levels". Aria edits the audio, matching C. Sentence 14 confirms editing is her strength.',
      },
    },
    {
      number: 24, accepted: ['D'], evidence: 17,
      explanation: {
        zh: '定位句 17：The producer on our side will handle the music rights before the first upload。背景音乐版权由 producer 处理，对应 D。',
        en: 'Sentence 17: "The producer on our side will handle the music rights before the first upload". The producer clears the music rights, matching D.',
      },
    },
    {
      number: 25, accepted: ['B'], evidence: 23,
      explanation: {
        zh: '定位句 23：the recording itself preserves something fragile。首期特殊之处在于保存一段可能失传的村宴致辞，对应 B。A 的集市在句 24 是落选候选，C 的播音员属于第二期。',
        en: 'Sentence 23: "the recording itself preserves something fragile". The first episode preserves a disappearing village speech, matching B. The market in sentence 24 was a rejected candidate, and the announcer belongs to episode two.',
      },
    },
    {
      number: 26, accepted: ['A'], evidence: 27,
      explanation: {
        zh: '定位句 27：Reading aloud flattens the natural rhythms, and dialect features show up in spontaneous talk。不念稿是因为自然口语才显露出方言特征，对应 A。B 写稿耗时与 C 读不清英文在录音中未出现。',
        en: 'Sentence 27: "Reading aloud flattens the natural rhythms, and dialect features show up in spontaneous talk". Natural speech reveals dialect features, matching A. Writing time and unclear reading are not mentioned.',
      },
    },
    {
      number: 27, accepted: ['C'], evidence: 47,
      explanation: {
        zh: '定位句 47：Every interviewee signs a release form before we use the recording online。受访人上线使用前须签授权书，对应 C。A 的免许可复用被规则否定，B 的成片副本未提及。',
        en: 'Sentence 47: "Every interviewee signs a release form before we use the recording online". Speakers sign a release form, matching C. Reuse without permission is ruled out, and episode copies to speakers are not mentioned.',
      },
    },
    {
      number: 28, accepted: ['A'], evidence: 57,
      explanation: {
        zh: '定位句 57：record a conversation at a local school between pupils and older residents。第二期计划之一是学校里学生与长辈对话，对应 A。',
        en: 'Sentence 57: "record a conversation at a local school between pupils and older residents". A school intergenerational conversation is planned, matching A.',
      },
    },
    {
      number: 29, accepted: ['B'], evidence: 58,
      explanation: {
        zh: '定位句 58：The comparison between two neighbouring towns is also on the list。相邻两镇口音对比在计划清单上，对应 B。',
        en: 'Sentence 58: "The comparison between two neighbouring towns is also on the list". Comparing two neighbouring towns is planned, matching B.',
      },
    },
    {
      number: 30, accepted: ['C'], evidence: 59,
      explanation: {
        zh: '定位句 59：We have invited a retired radio announcer who worked in the region for decades。第二期邀请退休广播播音员，对应 C。D 全译方言被句 61 否定，E 原始文件上线被句 63 否定。',
        en: 'Sentence 59: "We have invited a retired radio announcer who worked in the region for decades". The retired announcer is invited, matching C. Full translation is rejected in sentence 61, and raw files online in sentence 63.',
      },
    },
  ],
  transcript: [
    { speaker: 'ryan', text: 'Thanks for making time. We should lock down the plan for the dialect podcast today.' },
    { speaker: 'neerja', text: 'Good. We have a working title, but the episode structure still needs agreement.' },
    { speaker: 'aria', text: 'Let us start with what the show actually sets out to do.' },
    { speaker: 'ryan', text: 'The idea is to capture local speech before it blends into standard city English.' },
    { speaker: 'neerja', text: 'Many villages have words and turns of phrase that younger residents no longer use.' },
    { speaker: 'aria', text: 'So each episode will pair one recorded interview with a short commentary.' },
    { speaker: 'ryan', text: 'That keeps it listenable, rather than a wall of unedited talk.' },
    { speaker: 'neerja', text: 'We agreed four tasks need a named owner before recording begins.' },
    { speaker: 'ryan', text: 'First, who contacts the potential guests in the local communities?' },
    { speaker: 'neerja', text: 'I can take that on. I have contacts in two market towns and a farming village.' },
    { speaker: 'aria', text: 'Then Ryan, could you handle the transcript and vocabulary notes?' },
    { speaker: 'ryan', text: 'Yes. I will mark the local words and write a plain English gloss beside each one.' },
    { speaker: 'neerja', text: 'That helps listeners who are not from the region follow the conversation.' },
    { speaker: 'aria', text: 'I will look after the recorded audio, trimming long pauses and balancing the levels.' },
    { speaker: 'ryan', text: 'Editing is your strength, Aria, so that division works for me.' },
    { speaker: 'neerja', text: 'The last task is clearing any background music we use between segments.' },
    { speaker: 'ryan', text: 'We do not want a track that cannot be reused on a public feed.' },
    { speaker: 'neerja', text: 'The producer on our side will handle the music rights before the first upload.' },
    { speaker: 'aria', text: 'Good. We should note that in the shared production sheet.' },
    { speaker: 'ryan', text: 'Now the topic for episode one. We had three candidates on the list.' },
    { speaker: 'neerja', text: 'One was the speech used in market stalls, another was pub banter, and the third was a village wedding speech.' },
    { speaker: 'aria', text: 'Which one did you settle on?' },
    { speaker: 'neerja', text: 'The wedding speech. It has turns of phrase that may disappear within a generation.' },
    { speaker: 'ryan', text: 'That makes the first episode special, because the recording itself preserves something fragile.' },
    { speaker: 'aria', text: 'Market talk was a close second, but it appeared in too many other local shows.' },
    { speaker: 'ryan', text: 'How should we prepare the guests before the recording?' },
    { speaker: 'neerja', text: 'We brief them on the topics, but we must not hand them a script to read.' },
    { speaker: 'aria', text: 'Reading aloud flattens the natural rhythms, and dialect features show up in spontaneous talk.' },
    { speaker: 'ryan', text: 'Right. Interviewers should ask open questions and let people finish their own stories.' },
    { speaker: 'neerja', text: 'We can offer prompts about childhood, work, and local festivals.' },
    { speaker: 'aria', text: 'People speak more openly when the prompt is about a memory rather than a grammar point.' },
    { speaker: 'ryan', text: 'What equipment are we taking to location?' },
    { speaker: 'neerja', text: 'Two portable recorders, one spare microphone, and a pair of wind shields.' },
    { speaker: 'aria', text: 'We should test the battery levels the night before, especially outdoors.' },
    { speaker: 'ryan', text: 'A quiet indoor spot is still better than a windy roadside.' },
    { speaker: 'neerja', text: 'If there is a loud café nearby, we move to a corner room or the village hall.' },
    { speaker: 'aria', text: 'We also record a short room tone to use under quiet edits.' },
    { speaker: 'ryan', text: 'That gives the editor a natural base instead of harsh silence.' },
    { speaker: 'neerja', text: 'The episode structure after recording.' },
    { speaker: 'aria', text: 'I propose an opening clip, then the main interview, then our commentary segment.' },
    { speaker: 'ryan', text: 'The commentary should explain three or four notable phrases, not every word.' },
    { speaker: 'neerja', text: 'Listeners get tired if the track sounds like a language lesson.' },
    { speaker: 'aria', text: 'We will place the glosses on the show notes page, where people can read them later.' },
    { speaker: 'ryan', text: 'How long should each episode run?' },
    { speaker: 'neerja', text: 'Around twenty minutes, with five minutes reserved for commentary.' },
    { speaker: 'aria', text: 'That leaves room for a closing question sent in by a listener.' },
    { speaker: 'aria', text: 'Now the copyright side. Speakers may expect their voices to stay local.' },
    { speaker: 'neerja', text: 'Every interviewee signs a release form before we use the recording online.' },
    { speaker: 'ryan', text: 'The form states where the episode will appear and how long it stays available.' },
    { speaker: 'aria', text: 'We keep a scanned copy in the project folder for the record.' },
    { speaker: 'neerja', text: 'Music is separate. The producer checks the licence before any track goes in.' },
    { speaker: 'ryan', text: 'If a track has a Creative Commons condition, we note the credit in the description.' },
    { speaker: 'aria', text: 'Speaking of description, we write a short summary and list the recorded locations.' },
    { speaker: 'neerja', text: 'Tags should name the dialect and the county, so searches can find the episode.' },
    { speaker: 'ryan', text: 'We release one episode a month, leaving two weeks for edits and review.' },
    { speaker: 'aria', text: 'The feedback after each release decides what we record next.' },
    { speaker: 'ryan', text: 'Episode two has a broader plan than the first.' },
    { speaker: 'neerja', text: 'We want to record a conversation at a local school between pupils and older residents.' },
    { speaker: 'ryan', text: 'The comparison between two neighbouring towns is also on the list.' },
    { speaker: 'aria', text: 'We have invited a retired radio announcer who worked in the region for decades.' },
    { speaker: 'neerja', text: 'That guest can describe how the speech changed on air over the years.' },
    { speaker: 'ryan', text: 'We should be careful not to translate every phrase into standard English.' },
    { speaker: 'aria', text: 'Some local colour would be lost if we turned each line into neutral wording.' },
    { speaker: 'neerja', text: 'And the raw interview files stay in our archive, not on the public feed.' },
    { speaker: 'ryan', text: 'Public access is through the edited episodes and the show notes.' },
    { speaker: 'neerja', text: 'I will draft the guest list and the brief for episode one today.' },
    { speaker: 'ryan', text: 'I will prepare the transcript template and the gloss column.' },
    { speaker: 'aria', text: 'Then we meet again before the weekend to check the recording schedule.' },
    { speaker: 'ryan', text: 'That covers the main points. Thanks both.' },
  ],
  vocabulary: [
    {
      term: 'guests', phonetic: '/ɡests/', partOfSpeech: 'n.', sentenceIndex: 8,
      meaning: { zh: '受访嘉宾', en: 'a person invited to speak in the recording' },
      usage: { zh: '可数名词；potential guest、contact a guest、interview a guest。', en: 'Countable: potential guest, contact a guest, interview a guest.' },
      collocations: ['potential guests', 'invite a guest', 'the guest list'],
      example: { en: 'I have contacts in two market towns and a farming village.', zh: '我在两个集镇和一个农业村都有人脉。' },
      listening: { zh: '单音节；/e/ 短元音，结尾 /st/。', en: 'One syllable; short /e/ and final /st/.' },
    },
    {
      term: 'transcript', phonetic: '/ˈtrænskrɪpt/', partOfSpeech: 'n.', sentenceIndex: 10,
      meaning: { zh: '文字转写稿', en: 'the written copy of what was spoken' },
      usage: { zh: '可数名词；write a transcript、transcript template。动词 transcribe。', en: 'Countable: write a transcript, transcript template. The verb is transcribe.' },
      collocations: ['the transcript', 'a transcript template', 'prepare the transcript'],
      example: { en: 'I will write a plain English gloss beside each local word.', zh: '我会在每个本地词旁写白话注释。' },
      listening: { zh: '两个音节，重音在第一个；/skr/ 连缀清晰。', en: 'Two syllables with first-syllable stress; the /skr/ cluster is clear.' },
    },
    {
      term: 'gloss', phonetic: '/ɡlɒs/', partOfSpeech: 'n.', sentenceIndex: 11,
      meaning: { zh: '词条注释，白话释义', en: 'a short plain-language explanation beside a word' },
      usage: { zh: '可数名词；a gloss beside the word、gloss column。', en: 'Countable: a gloss beside the word, gloss column.' },
      collocations: ['a plain English gloss', 'the gloss column', 'write a gloss'],
      example: { en: 'The gloss helps listeners from outside the region follow along.', zh: '注释帮助外地听众听懂内容。' },
      listening: { zh: '单音节；/ɡl/ 连缀，短元音 /ɒ/。', en: 'One syllable; cluster /ɡl/ and short /ɒ/.' },
    },
    {
      term: 'release form', phonetic: '/rɪˈliːs fɔːm/', partOfSpeech: 'n.', sentenceIndex: 47,
      meaning: { zh: '录音授权书，使用许可表', en: 'the signed paper allowing online use of a speaker’s voice' },
      usage: { zh: '可数；sign a release form、a signed release form。', en: 'Countable: sign a release form, a signed release form.' },
      collocations: ['sign a release form', 'a release form before use', 'the signed release'],
      example: { en: 'Every interviewee signs a release form before online use.', zh: '每位受访人上线使用前签署授权书。' },
      listening: { zh: 'release 重音在第二音节；form 为单音节。', en: 'Stress release on the second syllable; form is one syllable.' },
    },
    {
      term: 'licence', phonetic: '/ˈlaɪsns/', partOfSpeech: 'n.', sentenceIndex: 50,
      meaning: { zh: '许可（音乐使用权）', en: 'the legal permission to reuse a track' },
      usage: { zh: '英式名词拼写 licence；动词或美式名词为 license。check the licence。', en: 'British noun licence; the verb and American noun are license. Check the licence.' },
      collocations: ['check the licence', 'a music licence', 'the licence condition'],
      example: { en: 'The producer checks the licence before any track goes in.', zh: '任何曲目使用前先由制作人核查许可。' },
      listening: { zh: '两个音节，重音在第一个；词尾 /sns/。', en: 'Two syllables with first-syllable stress; ending /sns/.' },
    },
    {
      term: 'archive', phonetic: '/ˈɑːkaɪv/', partOfSpeech: 'n.', sentenceIndex: 63,
      meaning: { zh: '存档库（原始素材保存处）', en: 'the stored collection of raw recordings' },
      usage: { zh: '可数名词；in the archive、raw files in the archive。', en: 'Countable: in the archive, raw files in the archive.' },
      collocations: ['in our archive', 'the raw archive', 'keep files in the archive'],
      example: { en: 'The raw interview files stay in our archive, not online.', zh: '原始采访文件留在存档库，不上网。' },
      listening: { zh: '两个音节，重音在第一个；/ɑː/ 拉长。', en: 'Two syllables with first-syllable stress; /ɑː/ is long.' },
    },
    {
      term: 'segments', phonetic: '/ˈseɡmənts/', partOfSpeech: 'n.', sentenceIndex: 15,
      meaning: { zh: '片段，段落（复数）', en: 'short sections of the recorded episode' },
      usage: { zh: '可数名词复数；between segments、opening segment、commentary segment。', en: 'Plural countable: between segments, opening segment, commentary segment.' },
      collocations: ['between segments', 'a commentary segment', 'the opening segment'],
      example: { en: 'We clear the music used between segments.', zh: '我们处理片段之间使用的音乐版权。' },
      listening: { zh: '两个音节，重音在第一个；复数词尾 /ts/。', en: 'Two syllables with first-syllable stress; plural ending /ts/.' },
    },
  ],
  expressions: [
    {
      phrase: 'turns of phrase', sentenceIndex: 4,
      meaning: { zh: '说法，惯用表达', en: 'particular ways people phrase things in their speech' },
      usage: { zh: '复数；local turns of phrase、a turn of phrase。', en: 'Plural: local turns of phrase, a turn of phrase.' },
      example: { en: 'Villages have turns of phrase younger residents no longer use.', zh: '村里有些说法年轻人已经不再使用。' },
    },
    {
      phrase: 'named owner', sentenceIndex: 7,
      meaning: { zh: '明确到人负责人', en: 'a task assigned to one named person' },
      usage: { zh: '可数；a named owner for each task。', en: 'Countable: a named owner for each task.' },
      example: { en: 'Four tasks need a named owner before recording begins.', zh: '开拍前四项任务都要明确负责人。' },
    },
    {
      phrase: 'look after', sentenceIndex: 13,
      meaning: { zh: '负责照料，主管', en: 'to take responsibility for something' },
      usage: { zh: 'look after 加任务；look after the audio、look after the guests。', en: 'Look after plus task: the audio, the guests.' },
      example: { en: 'I will look after the recorded audio and trim the pauses.', zh: '我负责录音并剪掉长停顿。' },
    },
    {
      phrase: 'settle on', sentenceIndex: 21,
      meaning: { zh: '选定，敲定', en: 'to make a final choice after considering options' },
      usage: { zh: 'settle on 加选项；settle on the wedding speech。', en: 'Settle on plus option: settle on the wedding speech.' },
      example: { en: 'Which topic did you settle on for episode one?', zh: '首期你们敲定了哪个话题？' },
    },
    {
      phrase: 'stay local', sentenceIndex: 46,
      meaning: { zh: '留在本地（不外传）', en: 'to remain used only in the local area' },
      usage: { zh: 'stay 加形容词；voices stay local、speech stays local。', en: 'Stay plus adjective: voices stay local, speech stays local.' },
      example: { en: 'Speakers may expect their voices to stay local.', zh: '受访人可能以为声音只留在本地。' },
    },
    {
      phrase: 'on the list', sentenceIndex: 58,
      meaning: { zh: '在计划清单上', en: 'included in the planned tasks or topics' },
      usage: { zh: 'on the list 为介词短语；also on the list、on the short list。', en: 'On the list: also on the list, on the short list.' },
      example: { en: 'The comparison of two towns is also on the list.', zh: '两镇对比也在计划清单上。' },
    },
  ],
  tips: [
    {
      title: { zh: '配对题先认人称再认任务', en: 'Match people before tasks' },
      body: {
        zh: '第 21–24 题把任务分给三位合作者加制作人。听分工段时先把说话人与名字对上（I can take that on 即 Neerja），再把每个任务对应到发言者，不要听到任务名就凭印象选字母。',
        en: 'Questions 21–24 assign tasks to three collaborators plus the producer. First match each speaker to a name, such as I can take that on meaning Neerja, then link each task to its speaker; do not pick a letter from the task name alone.',
      },
    },
    {
      title: { zh: '多选只记明确列入计划的项', en: 'Multiple choice records only planned items' },
      body: {
        zh: '第 28–30 题选第二期要做的三件事。讨论中被否定的做法（全译方言、原始文件上线）是干扰项；听到 plan、on the list、invited 这类词再勾选项，听到 avoid、not、raw files stay 就排除。',
        en: 'Questions 28–30 pick three episode-two plans. Rejected approaches, full translation and raw files online, are distractors. Tick an item on plan, on the list, or invited wording, and rule it out after avoid, not, or raw files stay.',
      },
    },
    {
      title: { zh: '讨论题抓因果连接词', en: 'Catch cause connectors in discussion' },
      body: {
        zh: '第 26 题问不念稿的原因，答案跟在 because 后面；第 25 题问首期特殊之处，答案在 because the recording itself preserves 之后。讨论题的单选项常是因果句的后半段，听到 because、so、that is why 时先记后半句。',
        en: 'Item 26 asks why no script, and the answer follows because; item 25 asks what makes episode one special, after because the recording itself preserves. Discussion singles often use the second half of a cause sentence; note the clause after because, so, or that is why.',
      },
    },
  ],
};
