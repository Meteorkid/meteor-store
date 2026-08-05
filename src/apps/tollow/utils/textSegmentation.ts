// @ts-nocheck
/* eslint-disable */
interface GraphemeSegment {
  segment: string
}

interface GraphemeSegmenter {
  segment(input: string): Iterable<GraphemeSegment>
}

type GraphemeSegmenterConstructor = new (
  locale?: string | string[],
  options?: { granularity: 'grapheme' }
) => GraphemeSegmenter

export const PRACTICE_SEGMENT_GRAPHEMES = 1500

export function splitGraphemes(text: string, locale?: string): string[] {
  const Segmenter = (
    Intl as unknown as { Segmenter?: GraphemeSegmenterConstructor }
  ).Segmenter

  if (!Segmenter) {
    return Array.from(text)
  }

  return Array.from(
    new Segmenter(locale, { granularity: 'grapheme' }).segment(text),
    ({ segment }) => segment
  )
}

function findPreferredBoundary(
  graphemes: readonly string[],
  start: number,
  limit: number
): number {
  for (let index = limit; index > start + 1; index -= 1) {
    if (graphemes[index - 2] === '\n' && graphemes[index - 1] === '\n') {
      return index
    }
  }

  for (let index = limit; index > start; index -= 1) {
    if (graphemes[index - 1] === '\n') {
      return index
    }
  }

  const sentenceEnding = /^[.!?;。！？；]$/u
  for (let index = limit; index > start; index -= 1) {
    if (sentenceEnding.test(graphemes[index - 1])) {
      return index
    }
  }

  const whitespace = /^\s$/u
  for (let index = limit; index > start; index -= 1) {
    if (whitespace.test(graphemes[index - 1])) {
      return index
    }
  }

  return limit
}

export function splitPracticeSegments(
  text: string,
  locale?: string,
  maxGraphemes = PRACTICE_SEGMENT_GRAPHEMES
): string[] {
  if (!Number.isInteger(maxGraphemes) || maxGraphemes <= 0) {
    throw new RangeError('maxGraphemes 必须是正整数')
  }

  const graphemes = splitGraphemes(text, locale)
  const segments: string[] = []

  for (let start = 0; start < graphemes.length; ) {
    const limit = Math.min(start + maxGraphemes, graphemes.length)
    const end =
      limit === graphemes.length
        ? limit
        : findPreferredBoundary(graphemes, start, limit)

    segments.push(graphemes.slice(start, end).join(''))
    start = end
  }

  return segments
}
