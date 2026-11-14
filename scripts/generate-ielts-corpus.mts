#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, renameSync, appendFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { IeltsPairContentSchema, IeltsLearningSchema, IeltsPairSeedSchema, countWords, type IeltsPairContent, type IeltsPairSeed } from '../src/lib/ielts/types';
import { ieltsExpansionPlan, type IeltsExpansionPlan } from '../src/data/ielts/expansion-plan';
import { batchA } from '../src/data/ielts/batch-a';
import { batchB } from '../src/data/ielts/batch-b';
import { batchC } from '../src/data/ielts/batch-c';
import { auditIeltsCorpusPair, findCorpusDuplicates } from './lib/ielts-corpus-quality';
import { IeltsWritingSchema, inspectIeltsWriting, splitAlignedWritingSentences, mergeUnchangedWritingSegments, applyIeltsWritingPatches } from './lib/ielts-writing-repair';

const { values } = parseArgs({ options: {
  out: { type: 'string' }, generate: { type: 'boolean' }, pilot: { type: 'boolean' }, export: { type: 'boolean' },
  only: { type: 'string' }, skip: { type: 'string' }, concurrency: { type: 'string', default: '2' },
} });
if (!values.out) throw new Error('Provide an owned --out directory for resumable artifacts.');
const output = path.resolve(values.out);
mkdirSync(output, { recursive: true });
const journalFile = path.join(output, 'usage.ndjson');
const previous = existsSync(journalFile) ? readFileSync(journalFile, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)) : [];
let calls = previous.filter(row => row.kind === 'attempt').length;
let totalTokens = previous.reduce((sum, row) => sum + (row.totalTokens ?? 0), 0);
const MAX_CALLS = 650;
const MAX_TOTAL_TOKENS = 3_000_000;
let stopped = false;
const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
const bodySchema = z.object({
  segments: IeltsPairContentSchema.shape.segments,
  criteria: IeltsPairContentSchema.shape.criteria,
  takeaways: IeltsPairContentSchema.shape.takeaways,
}).strict();
const reviewSchema = z.object({ approved: z.boolean(), issues: z.array(z.string().max(1500)).max(12), rationale: z.string().max(1500) }).strict();

function writeJson(file: string, value: unknown) {
  const temp = file + '.partial';
  writeFileSync(temp, JSON.stringify(value, null, 2) + '\n');
  renameSync(temp, file);
}
function fileFor(plan: IeltsExpansionPlan, name: string) {
  const folder = path.join(output, plan.slug);mkdirSync(folder, { recursive: true });return path.join(folder, name);
}
function appendUsage(row: Record<string, unknown>) {
  appendFileSync(journalFile, JSON.stringify(row) + '\n');
}
async function modelJson(plan: IeltsExpansionPlan, stage: string, system: string, payload: unknown, maxTokens: number): Promise<unknown> {
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY is unavailable');
  if (stopped || calls >= MAX_CALLS || totalTokens >= MAX_TOTAL_TOKENS) { stopped = true; throw new Error('Corpus generation budget or provider stop reached'); }
  const call = ++calls;
  const start = Date.now();
  const requestBody = { model: 'deepseek-v4-pro', thinking: { type: 'disabled' }, max_tokens: maxTokens,
    temperature: stage.startsWith('review') ? 0.1 : 0.65, response_format: { type: 'json_object' },
    messages: [{ role: 'system', content: system }, { role: 'user', content: JSON.stringify(payload) }],
  };
  const requestHash = createHash('sha256').update(JSON.stringify(requestBody)).digest('hex');
  appendUsage({ kind: 'attempt', call, slug: plan.slug, stage, requestHash, startedAt: new Date().toISOString(), totalTokens: 0 });
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(requestBody), signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) { await response.body?.cancel(); if ([401, 402, 403].includes(response.status)) stopped = true; throw new Error(`Provider HTTP ${response.status}`); }
    if (!response.body) throw new Error('Empty provider body');
    const reader = response.body.getReader();const chunks: Uint8Array[] = [];let size = 0;
    try { while (true) { const { value, done } = await reader.read();if (done) break;size += value.byteLength;if (size > 256 * 1024) { await reader.cancel();throw new Error('Provider response exceeded 256KB'); }chunks.push(value); } }
    finally { reader.releaseLock(); }
    const completion = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const usage = completion.usage ?? {};
    totalTokens += Number(usage.total_tokens) || 0;
    const record = { kind: 'result', call, slug: plan.slug, stage, requestHash, model: completion.model, elapsedMs: Date.now() - start,
      promptTokens: usage.prompt_tokens ?? 0, completionTokens: usage.completion_tokens ?? 0, totalTokens: usage.total_tokens ?? 0,
      finishReason: completion.choices?.[0]?.finish_reason };
    appendUsage(record);
    writeJson(fileFor(plan, `${String(call).padStart(4, '0')}-${stage}-response.json`), completion);
    if (completion.choices?.[0]?.finish_reason !== 'stop') throw new Error('Provider output truncated');
    const content = completion.choices[0].message?.content;
    if (typeof content !== 'string' || !content.trim()) throw new Error('Empty model content');
    return JSON.parse(content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeJson(fileFor(plan, `${String(call).padStart(4, '0')}-${stage}-error.json`), { call, stage, requestHash, message, elapsedMs: Date.now() - start });
    // HTTP失败仍计调用数；不记录请求headers或密钥。
    if (!existsSync(fileFor(plan, `${String(call).padStart(4, '0')}-${stage}-response.json`))) appendUsage({ kind: 'error', call, slug: plan.slug, stage, requestHash, error: message, totalTokens: 0 });
    throw error;
  }
}

const writingSchema = IeltsWritingSchema;
const writingPatchSchema = z.object({ patches: z.array(z.object({
  index: z.number().int().min(0).max(29), low: z.string().min(1).max(600).optional(), high: z.string().min(1).max(600).optional(),
}).strict()).min(1).max(30) }).strict();
const repairWritingPrompt = `Repair ONLY the indicated problems in this existing aligned IELTS draft. Return JSON {"patches":[{"index":0,"low":"replacement full sentence","high":"replacement full sentence"}]}. You may omit an unchanged side or index. Do not return a new segments array. No paragraph changes. Preserve the argument, examples, facts and alignment. Word counts supplied were computed by code; use the target difference to trim or expand a SMALL number of sentences. Keep natural developed English; no padding. Do not preserve a bloated draft when asked to cut. Each low/high pair must contain a genuine rewrite. A salutation may remain inside a rewritten adjacent sentence. Return the full replacement string for the chosen side, never an ellipsis or partial patch.`;
function normalizeWriting(raw: unknown) {
  return mergeUnchangedWritingSegments(splitAlignedWritingSentences(writingSchema.parse(raw)));
}
function writingPrompt(plan: IeltsExpansionPlan): string {
  return `Write a complete original IELTS teaching essay in two aligned versions for the exact supplied question.
${plan.task === 'task2' ? 'Use EXACTLY 14 aligned sentence pairs in 4 paragraphs (2,5,5,2). Each low sentence should average 19 words and each high sentence 20–21 words. Low total MUST be 260–285 words; high total 275–305 words. Develop TWO reasons only; do not expand into a long survey. Most segments should contain one sentence, not two or three.' : 'Use about 12–14 short sentence pairs in 4–5 paragraphs. Low essay MUST contain 160–190 alphabetic words; high MUST contain 175–215 alphabetic words. Numbers do not count in our word counter.'}
Each array element contains the SAME idea expressed twice, low in basic language with a few plausible grammar/collocation faults, high in natural precise varied English. Preserve stance, examples and information order. High may clarify existing links but must not replace the argument or invent new data. The complete essay on EACH side must meet its word target; do not output paragraph fragments or revision patches.
Fully answer the category: opinion has a consistent extent of agreement, discussion covers both views and own opinion, outweigh states a comparison, two-part answers both questions, problem-solution links causes and workable measures. Academic reports need an overview and accurate grouped comparisons, only from supplied hypothetical data, no causal speculation. Letters cover all three bullets with appropriate register, greeting and close.
Avoid generic high-version openings such as Nowadays or In recent years. Do not claim research sources or examiner scores. Respect the authoring brief. Include concrete development rather than padding. Treat authoringBrief as editorial guidance, not sentences to paste into the essay. Use hypothetical examples with could/may rather than invented time, price or percentage claims. Do not invent a growing trend as an opening. Keep the audience in the exact question (e.g. repair shops must not turn into all members of the public). If a salutation/close is identical, combine it with its adjacent sentence so each low/high pair contains a real rewrite.
If previousDraft is supplied, revise THAT draft to the given word target while preserving its ideas; do not discard it and start a new answer. For letters, use Alex as a fictional teaching signature if no name is given; never use [Name] or any placeholder. Return ONLY a single complete JSON object, no markdown or text before/after. No translation, notes, criteria, title or word-count fields yet. Shape:
{"segments":[{"paragraph":1,"low":"Complete basic sentence.","high":"Corresponding improved sentence."}]}
Count both complete essays before returning; underlength essays are rejected.`;
}
const annotationPrompt = `Annotate the supplied aligned IELTS essays without changing any English sentence. Return ONE valid JSON object with annotations, criteria and takeaways; no other root keys.
annotations must contain one item for EVERY supplied index, using ZERO-based indices. Each item:
{index:0,translationZh:{low:"Chinese translation of low",high:"Chinese translation of high"},focus:["lexis"],note:{zh:"具体改写说明",en:"Specific explanation"},expressionEdits:[{before:"exact substring in low",after:"exact substring in high",focus:"lexis",explanation:{zh:"原因",en:"Reason"}}]}.
Allowed focus values: task, cohesion, lexis, grammar, accuracy. Each focus array contains1–3 values. Translation is faithful to EACH version, including its own quantities and stance; do not silently correct low-version factual errors. Each note language 20–300 characters. Use plain text without quotation marks inside note strings.
Distinguish genuine grammar errors from optional lexical/style improvements. Do not call a correct basic word or simple sentence wrong merely because HIGH uses a formal alternative. In criteria, describe actual differences; do not invent missing task requirements, universal synonym hierarchies or mandatory extra examples.
Every paragraph needs 1–3 expressionEdits TOTAL across its segments, selected as the main learning points; it is optional on other segments (omit the property, not an empty array), maximum2 per segment. before and after MUST be EXACT contiguous phrases from the supplied low/high, and must differ. Use SHORT paired phrases or clauses (usually 2–12 words). after must be STRICTLY SHORTER than its full high sentence. Do not use a complete sentence as the expression card. Explanations <=250 characters each language.
criteria is an ARRAY, not an object, with exactly four items {key:"TR",note:{zh:"...",en:"..."}}, keys TR,CC,LR,GRA each once; for Task1 TR means Task Achievement. Explain concrete improvements and remaining issues, no guaranteed scores. Each note <=900 characters per language.
takeaways:{zh:[three concise tips],en:[same three tips]}, each tip <=180 characters. The JSON must include every annotation and all four criterion entries in the same object.`;
const annotationSchema = z.object({
  annotations: z.array(z.object({ index: z.number().int().min(0).max(29),
    translationZh: IeltsPairContentSchema.shape.segments.element.shape.translationZh.unwrap(),
    focus: IeltsPairContentSchema.shape.segments.element.shape.focus,
    note: IeltsPairContentSchema.shape.segments.element.shape.note,
    expressionEdits: IeltsPairContentSchema.shape.segments.element.shape.expressionEdits,
  }).strict()).min(6).max(30),
  criteria: IeltsPairContentSchema.shape.criteria, takeaways: IeltsPairContentSchema.shape.takeaways,
}).strict();

function normalizeAnnotations(raw: unknown, writing: z.infer<typeof writingSchema>): unknown {
  if (!raw || typeof raw !== 'object') return raw;
  const value = raw as Record<string, unknown>;
  const criteria = Array.isArray(value.criteria) ? value.criteria : value.criteria && typeof value.criteria === 'object'
    ? Object.entries(value.criteria).map(([key, note]) => ({ key, note })) : value.criteria;
  const annotations = Array.isArray(value.annotations) ? value.annotations.map(rawItem => {
    if (!rawItem || typeof rawItem !== 'object') return rawItem;
    const item = { ...rawItem } as Record<string, unknown>;
    const source = writing.segments[Number(item.index)];
    if (Array.isArray(item.expressionEdits)) {
      const edits = item.expressionEdits.filter(edit => source && edit && typeof edit === 'object'
        && typeof edit.before === 'string' && typeof edit.after === 'string'
        && edit.before !== edit.after && source.low.includes(edit.before) && source.high.includes(edit.after));
      if (edits.length) item.expressionEdits = edits.map(edit => ({ ...edit, focus: Array.isArray(edit.focus) ? edit.focus[0] : edit.focus }));
      else delete item.expressionEdits;
    }
    return item;
  }) : value.annotations;
  return { criteria, annotations, takeaways: value.takeaways };
}

const learningPrompt = `Create detailed bilingual study notes for the supplied IELTS teaching essays. Do not rewrite either essay. Describe what this pair actually does, without pretending an official score. Mistakes must focus on REAL mistakes or weak expressions in the LOW essay, quote the problematic phrase and explain its correction in HIGH. Never invent weaknesses in the high essay merely to fill this list.
Return ONLY JSON:
{taskAnalysis:{zh,en},paragraphs:[{paragraph,role:{zh,en},analysis:{zh,en}}],techniques:[{title:{zh,en},explanation:{zh,en},segmentIndex}],mistakes:[{zh,en}],vocabulary:[{term,partOfSpeech,meaning:{zh,en},usage:{zh,en},collocations:[...],example:{en,zh},segmentIndex}]}.
Cover every paragraph exactly once, ordered 1..N. expectedParagraphNumbers lists the exact paragraph IDs; paragraphs must have precisely that length and those IDs, NOT one entry per segment. Include 3 concrete techniques and 2 common mistakes. segmentIndex is ZERO-based and must reference the actual sentence. Chinese taskAnalysis <=250 chars; paragraph role <=100 chars each language, analysis <=600 each; technique explanation <=700 each; mistake <=700 each.
Choose exactly 6 useful words/phrases from HIGH sentences. term must be an exact contiguous substring in the referenced high sentence; preserve inflection. Each term unique, <=80 chars. Do NOT list a synonym absent from the text. partOfSpeech <=50 chars. meaning each language <=250 chars; usage each <=400 and explain grammar/collocation pitfalls. Give 2 natural collocations <=90 chars each and an original example with faithful Chinese translation (each <=350 chars). These examples may be hypothetical; no invented sources or phonetics. Keep all content specific to this question and these sentences. IELTS teaching accuracy: an agree/disagree answer may fully agree, fully disagree or partially agree; neither a balanced position nor discussing both sides is inherently superior or mandatory unless the actual question demands it. A 250-word essay does not require extra industries, statistics, implementation minutiae or more examples than it needs to develop its position. Never advise adding irrelevant coverage. Avoid false absolute grammar rules and simplistic synonym/ranking claims (e.g. ought to is always stronger than should; authorised equals certified). Explain words in THIS context.`;
const reviewPrompt = `You are the final factual editor of an IELTS teaching pair. The LOW essay intentionally contains basic errors; the HIGH essay corrects and improves it. This is not official scoring.
Return ONLY this JSON: {"approved":true,"issues":[],"rationale":"brief conclusion"} or {"approved":false,"issues":["field/index: real unresolved error and precise fix"],"rationale":"brief conclusion"}.
HARD OUTPUT LIMIT: at most FIVE issues, each at most 250 characters; rationale at most 200 characters. NEVER put successful checks, observations, "no issue", or a correctly fixed low-version error in issues. Do not output an audit transcript.
Check unresolved defects: wrong high-version task answer/data/math; changed claims between the two versions; mistranslation; misleading grammar/word-meaning notes. Review learning rules too: an agree/disagree essay need not discuss both sides, a partial stance is not inherently superior, adding more domains/examples is not mandatory, a correct simple sentence is not an error. British collective agreement can be singular or plural. "Wake early" is grammatical.
Stylistic upgrades are allowed and should NOT be rejected just because the low expression was already grammatical. Low errors need not all appear in the two-item mistakes list. Original vocabulary example sentences are allowed. High may make an implicit link explicit without adding a new main point. Do not demand extra information absent from the question.
If no unresolved substantive defect remains, approved MUST be true and issues MUST be empty. If uncertain about a stylistic preference, omit it. Do not claim certainty about official band scores.`;


function asPair(plan: IeltsExpansionPlan, content: IeltsPairContent): IeltsPairSeed {
  return IeltsPairSeedSchema.parse({ slug: plan.slug, task: plan.task, category: plan.category, topic: plan.topic,
    sortOrder: plan.sortOrder, status: 'published', content });
}
function bodyIssues(content: IeltsPairContent, plan: IeltsExpansionPlan): string[] {
  const low = countWords(content.segments.map(s => s.low).join(' '));const high = countWords(content.segments.map(s => s.high).join(' '));
  const min = plan.task === 'task2' ? 250 : 150;const lowMax = plan.task === 'task2' ? 300 : 200;const highMax = plan.task === 'task2' ? 320 : 230;
  const errors: string[] = [];
  if (low < min || low > lowMax) errors.push(`low words ${low}, required ${min}..${lowMax}`);
  if (high < min || high > highMax) errors.push(`high words ${high}, required ${min}..${highMax}`);
  if (high < low - 20) errors.push('high shortened by more than 20 words; preserve full content');
  const covered = new Set(content.segments.filter(s => s.expressionEdits?.length).map(s => s.paragraph));
  if (content.segments.some(s => !covered.has(s.paragraph))) errors.push('Every paragraph needs an expression edit');
  for (const paragraph of covered) {
    const segments = content.segments.filter(s => s.paragraph === paragraph);
    if (segments.reduce((sum,s)=>sum+(s.expressionEdits?.length ?? 0),0)>3) errors.push(`Paragraph ${paragraph} may have at most 3 expression cards`);
    if (segments.some(s=>s.expressionEdits?.some(e=>e.after.length>=s.high.length))) errors.push(`Paragraph ${paragraph} expression cards must be shorter than the full high sentence`);
  }
  if (content.segments.some(s => !s.translationZh || s.low === s.high || s.note.zh.length < 12 || s.note.en.length < 12)) errors.push('Every sentence pair needs complete translation, concrete notes and an actual rewrite');
  return errors;
}
async function generate(plan: IeltsExpansionPlan) {
  const approvedFile = fileFor(plan, 'approved.json');
  if (existsSync(approvedFile)) { console.log(`RESUME ${plan.slug}`);return; }
  const completedRounds = readdirSync(path.dirname(approvedFile)).flatMap(name => {
    const match = /^(?:rejected|failed)-(\d+)\.json$/.exec(name);
    return match ? [Number(match[1])] : [];
  });
  const oldAttempts = completedRounds.length ? Math.max(...completedRounds) + 1 : 0;
  let feedback = '';
  if (oldAttempts) {
    const priorReview = fileFor(plan, `review-${oldAttempts - 1}.json`);
    const priorFailure = fileFor(plan, `failed-${oldAttempts - 1}.json`);
    if (existsSync(priorReview)) feedback = JSON.parse(readFileSync(priorReview, 'utf8')).issues.join('; ');
    else if (existsSync(priorFailure)) feedback = JSON.parse(readFileSync(priorFailure, 'utf8')).feedback;
  }
  for (let round = oldAttempts; round < oldAttempts + 1; round += 1) {
    try {
      let essay: IeltsPairContent | undefined;
      const bodyFile = fileFor(plan, `body-${round}.json`);
      if (round > 0 && !existsSync(fileFor(plan, `review-${round-1}.json`))) {
        for (const stage of ['body','pair']) {
          const from = fileFor(plan, `${stage}-${round-1}.json`); const to = fileFor(plan, `${stage}-${round}.json`);
          if (!existsSync(to) && existsSync(from)) writeJson(to, JSON.parse(readFileSync(from, 'utf8')));
        }
      }
      if (existsSync(bodyFile)) essay = IeltsPairContentSchema.parse(JSON.parse(readFileSync(bodyFile, 'utf8')));
      else {
        const writingFile = fileFor(plan, `writing-${round}.json`);
        const manualFile = fileFor(plan, 'manual-pilot-writing.json');
        if (!existsSync(writingFile) && existsSync(manualFile) && !existsSync(fileFor(plan, `review-${round-1}.json`))) writeJson(writingFile, JSON.parse(readFileSync(manualFile, 'utf8')));
        let writing: z.infer<typeof writingSchema> | undefined;
        let previousDraft: z.infer<typeof writingSchema> | undefined;
        if (!existsSync(writingFile) && round > 0 && !existsSync(fileFor(plan, `review-${round-1}.json`))) {
          const previousWriting = fileFor(plan, `writing-${round-1}.json`);
          if (existsSync(previousWriting)) writeJson(writingFile, JSON.parse(readFileSync(previousWriting, 'utf8')));
        }
        if (existsSync(writingFile)) {
          const stored = normalizeWriting(JSON.parse(readFileSync(writingFile, 'utf8')));
          if (!inspectIeltsWriting(stored, plan.task).errors.length) writing = stored;
          else { previousDraft = stored; feedback += ' Fix unchanged sentence pairs by including an adjacent rewritten sentence, and replace name placeholders with the fictional signature Alex.'; }
        }
        if (!writing) for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            const payload = { question: plan.prompt, task: plan.task, category: plan.category, authoringBrief: plan.authoringBrief, feedback };
            const candidate = previousDraft
              ? normalizeWriting(applyIeltsWritingPatches(previousDraft, writingPatchSchema.parse(await modelJson(plan, `repair-writing-${round}-${attempt}`, repairWritingPrompt,
                { ...payload, draft: previousDraft, inspection: inspectIeltsWriting(previousDraft, plan.task), targetWords: plan.task === 'task2' ? { low: 275, high: 290 } : { low: 175, high: 190 }, requiredWordChange: Object.fromEntries((['low','high'] as const).map(side=>[side, (plan.task === 'task2' ? (side === 'low' ? 275 : 290) : (side === 'low' ? 175 : 190)) - inspectIeltsWriting(previousDraft!, plan.task).wordCounts[side]])) }, 7000)).patches))
              : normalizeWriting(await modelJson(plan, `writing-${round}-${attempt}`, writingPrompt(plan), payload, 7000));
            previousDraft = candidate;
            writeJson(fileFor(plan, `writing-candidate-${round}-${attempt}.json`), candidate);
            const inspection = inspectIeltsWriting(candidate, plan.task);
            if (inspection.errors.length) throw new Error(inspection.errors.join('; '));
            writing = candidate;writeJson(writingFile, candidate);break;
          } catch (error) { feedback = String(error).slice(0, 2200); }
        }
        if (!writing) throw new Error(`Writing rejected: ${feedback}`);
        for (let attempt = 0; attempt < 2; attempt += 1) {
          try {
            const annotatedRaw = await modelJson(plan, `annotations-${round}-${attempt}`, annotationPrompt,
              { task: plan.task, question: plan.prompt, segments: writing.segments.map((s,index)=>({index,...s})), feedback: attempt ? feedback : undefined }, 12_000);
            const annotated = annotationSchema.parse(normalizeAnnotations(annotatedRaw, writing));
            const mapped = new Map(annotated.annotations.map(item => [item.index, item]));
            if (mapped.size !== writing.segments.length || annotated.annotations.length !== writing.segments.length) throw new Error('Every index requires exactly one annotation');
            const body = bodySchema.parse({ segments: writing.segments.map((s,index)=>{
              const annotation = mapped.get(index);if (!annotation) throw new Error('Missing annotation');
              const { index: ignoredIndex, ...fields } = annotation;void ignoredIndex;
              return {...s,...fields};
            }), criteria: annotated.criteria, takeaways: annotated.takeaways });
            const candidate = IeltsPairContentSchema.parse({ ...body, prompt: plan.prompt, title: plan.title, bandLow: 5, bandHigh: 8 });
            const issues = bodyIssues(candidate, plan);if (issues.length) throw new Error(issues.join('; '));
            essay = candidate;writeJson(bodyFile, essay);break;
          } catch (error) { feedback = String(error).slice(0, 2600); }
        }
      }
      if (!essay) throw new Error(`Body rejected: ${feedback}`);
      let pair: IeltsPairSeed | undefined;
      const learningFile = fileFor(plan, `pair-${round}.json`);
      if (existsSync(learningFile)) pair = IeltsPairSeedSchema.parse(JSON.parse(readFileSync(learningFile, 'utf8')));
      else for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const learning = IeltsLearningSchema.parse(await modelJson(plan, `learning-${round}-${attempt}`, learningPrompt,
            { question: plan.prompt, task: plan.task, expectedParagraphNumbers: [...new Set(essay.segments.map(s=>s.paragraph))], segments: essay.segments.map((s, index) => ({ index, paragraph: s.paragraph, low: s.low, high: s.high })), feedback: attempt ? feedback : undefined }, 10_000));
          const candidate = asPair(plan, IeltsPairContentSchema.parse({ ...essay, learning }));
          const issues = auditIeltsCorpusPair(candidate);if (issues.length) throw new Error(issues.join('; '));
          pair = candidate;writeJson(learningFile, pair);break;
        } catch (error) { feedback = String(error).slice(0, 2400); }
      }
      if (!pair) throw new Error(`Learning rejected: ${feedback}`);
      const review = reviewSchema.parse(await modelJson(plan, `review-${round}`, reviewPrompt, { authoringBrief: plan.authoringBrief, pair }, 4000));
      writeJson(fileFor(plan, `review-${round}.json`), review);
      if (!review.approved || review.issues.length) { feedback = review.issues.join('; ');writeJson(fileFor(plan, `rejected-${round}.json`), { feedback });continue; }
      writeJson(approvedFile, pair);
      console.log(`APPROVED ${plan.slug} low=${countWords(pair.content.segments.map(s=>s.low).join(' '))} high=${countWords(pair.content.segments.map(s=>s.high).join(' '))} calls=${calls} tokens=${totalTokens}`);
      return;
    } catch (error) { feedback = String(error).slice(0, 3000);writeJson(fileFor(plan, `failed-${round}.json`), { feedback }); }
  }
  console.log(`FAILED ${plan.slug}: ${feedback.slice(0, 200)}`);
}

const initial = [...batchA, ...batchB, ...batchC];
if (ieltsExpansionPlan.length !== 94 || initial.length !== 6) throw new Error('Expected 6 existing + 94 planned pairs');
if (values.generate) {
  let selected = ieltsExpansionPlan;
  if (values.only) selected = selected.filter(plan => values.only!.split(',').includes(plan.slug));
  if (values.skip) selected = selected.filter(plan => !values.skip!.split(',').includes(plan.slug));
  if (values.pilot) selected = (['task2','task1-academic','task1-general'] as const).map(task => selected.find(plan => plan.task === task)!).filter(Boolean);
  const concurrency = Math.min(6, Math.max(1, Number(values.concurrency) || 2));
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => { while (cursor < selected.length && !stopped) await generate(selected[cursor++]); }));
}
const approved = ieltsExpansionPlan.flatMap(plan => {
  const file = fileFor(plan, 'approved.json');return existsSync(file) ? [IeltsPairSeedSchema.parse(JSON.parse(readFileSync(file, 'utf8')))] : [];
});
const invalid = approved.flatMap(pair => auditIeltsCorpusPair(pair).map(error => ({ slug: pair.slug, error })));
const duplicates = findCorpusDuplicates([...initial, ...approved]);
const report = { planned: ieltsExpansionPlan.length, approved: approved.length, missing: ieltsExpansionPlan.filter(p=>!approved.some(a=>a.slug===p.slug)).map(p=>p.slug), calls, totalTokens, invalid, duplicates };
writeJson(path.join(output, 'report.json'), report);
if (values.export) {
  if (approved.length !== 94 || invalid.length || duplicates.length) throw new Error('Cannot export incomplete or invalid corpus');
  writeJson(path.resolve('src/data/ielts/generated-corpus.json'), approved.sort((a,b)=>a.sortOrder-b.sortOrder));
  console.log('EXPORTED 94 complete new pairs');
}
console.log(JSON.stringify({ approved: approved.length, missing: report.missing.length, calls, totalTokens, invalid: invalid.length, duplicates: duplicates.length }));
