import { splitGraphemes } from '../utils/textSegmentation';

export type FavoriteSourceResolution =
  | { status: 'exact' | 'relocated'; startOffset: number; endOffset: number }
  | { status: 'invalid' };

export function resolveFavoriteSource(
  segment: string,
  quote: string,
  startOffset: number,
  endOffset: number,
  locale?: string,
): FavoriteSourceResolution {
  const segmentGraphemes = splitGraphemes(segment, locale);
  const quoteGraphemes = splitGraphemes(quote, locale);
  if (quoteGraphemes.length === 0) return { status: 'invalid' };

  if (
    startOffset >= 0
    && endOffset >= startOffset
    && segmentGraphemes.slice(startOffset, endOffset).join('') === quote
  ) {
    return { status: 'exact', startOffset, endOffset };
  }

  let matchStart = -1;
  for (let index = 0; index <= segmentGraphemes.length - quoteGraphemes.length; index += 1) {
    let matches = true;
    for (let quoteIndex = 0; quoteIndex < quoteGraphemes.length; quoteIndex += 1) {
      if (segmentGraphemes[index + quoteIndex] !== quoteGraphemes[quoteIndex]) {
        matches = false;
        break;
      }
    }
    if (!matches) continue;
    if (matchStart !== -1) return { status: 'invalid' };
    matchStart = index;
  }

  return matchStart === -1
    ? { status: 'invalid' }
    : {
        status: 'relocated',
        startOffset: matchStart,
        endOffset: matchStart + quoteGraphemes.length,
      };
}
