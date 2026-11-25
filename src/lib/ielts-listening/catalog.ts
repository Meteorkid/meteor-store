import { z } from 'zod';
import audioManifest from '@/data/ielts-listening/audio-manifest.json';
import { listeningLessons, listeningTests } from '@/data/ielts-listening';
import { readR2Config } from '@/lib/r2-client';
import { listeningTranscriptHash } from './transcript-hash';
import {
  ListeningAudioSchema, ListeningLessonSchema, ListeningTestSchema,
  countListeningWords, listeningQuestionLocations,
  type ListeningAudio, type ListeningLesson, type ListeningQuestionKind, type ListeningTest,
} from './types';

/**
 * 听力题库的运行时目录：随代码上线的内容 + 离线合成的音频清单。
 *
 * 内容只有文件这一个来源，所以本地空库也能完整练习；每条课时在首次读取时过一遍协议，
 * 不合格的条目被丢弃并打日志，而不是带着对不上的解析或录音上线。
 */

const AudioManifestSchema = z.record(z.string(), ListeningAudioSchema);

export interface ListeningLessonRecord extends ListeningLesson {
  /** 通过校验、且与当前原文指纹一致的音频；否则为 null，页面改用逐句朗读。 */
  audio: ListeningAudio | null;
  /** 音频的公开地址；未配置 R2 或没有可用音频时为 null。 */
  audioUrl: string | null;
  /** 本课出现的题型，按试卷顺序去重。 */
  kinds: ListeningQuestionKind[];
  wordCount: number;
}

export interface ListeningTestRecord extends ListeningTest {
  lessons: ListeningLessonRecord[];
}

interface Catalog {
  tests: ListeningTestRecord[];
  lessons: Map<string, ListeningLessonRecord>;
}

let catalog: Catalog | undefined;

function rejectAudio(slug: string, reason: string): null {
  console.error(`[ielts-listening] ${slug} 的音频不可用，已改用朗读：${reason}`);
  return null;
}

function resolveAudio(lesson: ListeningLesson, raw: unknown): ListeningAudio | null {
  if (raw === undefined) return null;
  const parsed = ListeningAudioSchema.safeParse(raw);
  if (!parsed.success) return rejectAudio(lesson.slug, parsed.error.issues.map(issue => issue.message).join('; '));
  const audio = parsed.data;
  if (audio.transcriptHash !== listeningTranscriptHash(lesson.transcript.map(utterance => utterance.text))) {
    return rejectAudio(lesson.slug, '原文已改动，录音需要重新合成');
  }
  if (audio.cues.length !== lesson.transcript.length) {
    return rejectAudio(lesson.slug, `逐句时间数（${audio.cues.length}）与原文句数（${lesson.transcript.length}）不一致`);
  }
  let previousEnd = 0;
  for (const [start, end] of audio.cues) {
    if (start < previousEnd - 0.05 || end <= start || end > audio.durationSec + 0.5) {
      return rejectAudio(lesson.slug, '逐句时间不是单调递增或超出了音频时长');
    }
    previousEnd = end;
  }
  return audio;
}

function buildCatalog(): Catalog {
  const manifestResult = AudioManifestSchema.safeParse(audioManifest);
  const manifest: Record<string, ListeningAudio> = manifestResult.success
    ? manifestResult.data
    : (console.error('[ielts-listening] audio-manifest.json 不合法，全部课时改用朗读'), {});

  const tests = listeningTests.flatMap(test => {
    const parsed = ListeningTestSchema.safeParse(test);
    return parsed.success ? [parsed.data] : (console.error(`[ielts-listening] 套题 ${test.slug} 不合法：${parsed.error.issues[0]?.message}`), []);
  }).sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug));

  const lessons = new Map<string, ListeningLessonRecord>();
  for (const seed of listeningLessons) {
    const parsed = ListeningLessonSchema.safeParse(seed);
    if (!parsed.success) {
      console.error(`[ielts-listening] 课时 ${String((seed as ListeningLesson).slug)} 不合法：${parsed.error.issues.slice(0, 3).map(issue => `${issue.path.join('.')}: ${issue.message}`).join(' | ')}`);
      continue;
    }
    const lesson = parsed.data;
    if (lesson.status !== 'published') continue;
    const audio = resolveAudio(lesson, manifest[lesson.slug]);
    lessons.set(lesson.slug, {
      ...lesson,
      audio,
      audioUrl: listeningAudioUrl(audio),
      kinds: [...new Set(listeningQuestionLocations(lesson).map(location => lesson.sections[location.sectionIndex].kind))],
      wordCount: countListeningWords(lesson),
    });
  }

  const grouped = tests.map(test => ({
    ...test,
    lessons: [...lessons.values()].filter(lesson => lesson.slug.startsWith(`${test.slug}-`)).sort((a, b) => a.part - b.part),
  }));
  return { tests: grouped, lessons };
}

function load(): Catalog {
  if (!catalog) catalog = buildCatalog();
  return catalog;
}

/** 全部套题，每套按 Part 1–4 排好序；没有已发布内容的套题不会出现。 */
export function listListeningTests(): ListeningTestRecord[] {
  return load().tests.filter(test => test.lessons.length > 0);
}

/** 全部课时，按套题顺序与 Part 排序。 */
export function listListeningLessons(): ListeningLessonRecord[] {
  return listListeningTests().flatMap(test => test.lessons);
}

export function getListeningLesson(slug: string): ListeningLessonRecord | null {
  return load().lessons.get(slug) ?? null;
}

/** 音频的公开地址；R2 未配置时返回 null，由调用方退回朗读。 */
export function listeningAudioUrl(audio: ListeningAudio | null | undefined): string | null {
  const publicBase = readR2Config()?.publicBase;
  if (!audio || !publicBase) return null;
  return `${publicBase.replace(/\/+$/, '')}/${audio.key}`;
}
