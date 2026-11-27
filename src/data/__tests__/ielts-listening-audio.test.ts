import { describe, expect, it } from 'vitest';
import { listeningLessons } from '@/data/ielts-listening';
import audioManifest from '@/data/ielts-listening/audio-manifest.json';
import { getListeningLesson, listListeningTests } from '@/lib/ielts-listening/catalog';
import { listeningTranscriptHash } from '@/lib/ielts-listening/transcript-hash';

/**
 * 音频清单的离线回归：不访问 R2，只保证仓库里的清单与当前原文、句子数、
 * 逐句时间一致。线上对象是否存在由 scripts/ielts/verify-audio.mts 单独检查。
 *
 * 没有这条测试时，过期清单只会让 catalog.ts 静默退回逐句朗读，页面照常打开，
 * 单测也全绿——问题要等考生发现“这篇没有录音”才暴露。
 */
type AudioEntry = {
  key: string;
  durationSec: number;
  transcriptHash: string;
  cues: [number, number][];
  generatedAt: string;
};

const manifest = audioManifest as unknown as Record<string, AudioEntry>;

describe('雅思听力音频清单', () => {
  it('208 篇已发布课时都有清单项，且没有多余条目', () => {
    const lessonSlugs = new Set(listeningLessons.map(lesson => lesson.slug));
    expect(Object.keys(manifest).sort()).toEqual([...lessonSlugs].sort());
    expect(listeningLessons).toHaveLength(208);
  });

  it('每条的指纹、对象路径与当前课时一致', () => {
    for (const lesson of listeningLessons) {
      const entry = manifest[lesson.slug];
      expect(entry, lesson.slug).toBeDefined();
      if (!entry) continue;

      expect(entry.transcriptHash, lesson.slug).toBe(
        listeningTranscriptHash(lesson.transcript.map(utterance => utterance.text)),
      );
      expect(entry.key, lesson.slug).toMatch(
        new RegExp(`^ielts-listening/${lesson.slug}/[a-f0-9]{16}(-[a-f0-9]{8})?\\.mp3$`),
      );
      expect(entry.durationSec, lesson.slug).toBeGreaterThan(0);
    }
  });

  it('逐句时间与原文等长、单调递增且不越过音频时长', () => {
    for (const lesson of listeningLessons) {
      const entry = manifest[lesson.slug];
      expect(entry, lesson.slug).toBeDefined();
      if (!entry) continue;

      expect(entry.cues, lesson.slug).toHaveLength(lesson.transcript.length);
      let previousEnd = 0;
      for (const [start, end] of entry.cues) {
        expect(start, lesson.slug).toBeGreaterThanOrEqual(previousEnd - 0.05);
        expect(end, lesson.slug).toBeGreaterThan(start);
        expect(end, lesson.slug).toBeLessThanOrEqual(entry.durationSec + 0.5);
        previousEnd = end;
      }
    }
  });

  it('每篇录音末句后保留至少 1.5 秒收尾静音', () => {
    for (const lesson of listeningLessons) {
      const entry = manifest[lesson.slug];
      expect(entry, lesson.slug).toBeDefined();
      if (!entry) continue;

      const tail = entry.durationSec - entry.cues.at(-1)![1];
      expect(tail, lesson.slug).toBeGreaterThanOrEqual(1.5);
    }
  });

  it('运行时目录能解析全部 52 套 208 篇，并保留可用音频', () => {
    const tests = listListeningTests();
    expect(tests).toHaveLength(52);
    expect(tests.flatMap(test => test.lessons)).toHaveLength(208);
    for (const lesson of listeningLessons) {
      const record = getListeningLesson(lesson.slug);
      expect(record, lesson.slug).not.toBeNull();
      expect(record?.audio, lesson.slug).not.toBeNull();
    }
  });
});
