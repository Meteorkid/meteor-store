import { describe, expect, it } from 'vitest';
import { listeningLessons } from '@/data/ielts-listening';

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9']+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * A quoted English fragment in a review explanation is a citation of the
 * transcript line that `answer.evidence` points at, not a paraphrase.
 *
 * The schema only checks completion answers appear in the evidence sentence and
 * choice answers have a valid letter. It cannot see whether the explanation's
 * quotation actually comes from that sentence, which is how earlier content
 * drifted: an inserted prompt pushed every evidence index down by one while the
 * old quotation stayed behind.
 *
 * Rule: split an explanation quotation at an ellipsis, normalize punctuation and
 * curly apostrophes, and require every fragment of four or more words to occur
 * inside the normalized text of `transcript[answer.evidence]`. Short fragments
 * are ignored because they are often ordinary collocations, not citations.
 */
describe('IELTS listening explanation quotations', () => {
  it('every quoted fragment appears in the answer evidence sentence', () => {
    const failures: string[] = [];
    let checkedFragments = 0;

    for (const lesson of listeningLessons) {
      for (const answer of lesson.answers) {
        const evidence = normalize(lesson.transcript[answer.evidence]?.text ?? '');
        if (!evidence) {
          failures.push(`${lesson.slug}#${answer.number}: evidence ${answer.evidence} is empty`);
          continue;
        }

        for (const field of ['zh', 'en'] as const) {
          const text = answer.explanation[field];
          // Accept both ASCII and curly quotation marks. The content mixes them
          // (especially in the Chinese explanations), and a curly quote must not
          // become an unaudited escape hatch.
          for (const match of text.matchAll(/[“"]([^”"]+)[”"]/g)) {
            const quote = match[1];
            const fragments = quote
              .split(/…|\.\.\./)
              .map(normalize)
              .filter(fragment => fragment.split(' ').length >= 4);

            for (const fragment of fragments) {
              checkedFragments += 1;
              if (!evidence.includes(fragment)) {
                failures.push(
                  `${lesson.slug}#${answer.number} ${field}: "${quote}" is not in evidence ${answer.evidence}: "${lesson.transcript[answer.evidence]?.text ?? ''}"`,
                );
              }
            }
          }

          // The Chinese review cites the sentence directly after "定位句 N：".
          // That English run is the candidate-facing quotation even though it is
          // not wrapped in ASCII double quotes.
          const citation = text.match(/定位句\s*(?:句\s*)?[0-9]+\s*：([^。]+)/);
          if (citation) {
            const run = citation[1].split(/[\u4e00-\u9fff]/)[0].trim();
            const fragments = run
              .split(/…|\.\.\./)
              .map(normalize)
              .filter(fragment => fragment.split(' ').length >= 4);
            for (const fragment of fragments) {
              checkedFragments += 1;
              if (!evidence.includes(fragment)) {
                failures.push(
                  `${lesson.slug}#${answer.number} zh 定位句: "${run}" is not in evidence ${answer.evidence}: "${lesson.transcript[answer.evidence]?.text ?? ''}"`,
                );
              }
            }
          }
        }
      }
    }

    expect(checkedFragments, 'the quotation audit must not become vacuous').toBeGreaterThan(500);
    expect(failures, failures.join('\n')).toEqual([]);
  });
});
